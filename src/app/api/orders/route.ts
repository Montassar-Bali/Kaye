import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { createOrder, getOrdersByUserId } from "@/lib/db";
import { getProductById } from "@/lib/products";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  isTrustedOrigin,
  NO_STORE_HEADERS,
} from "@/lib/security";
import type { Address, CartItem, Order } from "@/lib/types";

const SHIPPING_FLAT = 12;
const TAX_RATE = 0.08;

function isAddress(value: unknown): value is Address {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const isText = (x: unknown, min: number, max: number) =>
    typeof x === "string" && x.trim().length >= min && x.trim().length <= max;
  return (
    isText(v.fullName, 2, 120) &&
    isText(v.line1, 2, 160) &&
    (v.line2 === undefined || isText(v.line2, 0, 160)) &&
    isText(v.city, 2, 100) &&
    (v.state === undefined || isText(v.state, 2, 100)) &&
    isText(v.postalCode, 2, 32) &&
    isText(v.country, 2, 80) &&
    (v.phone === undefined || isText(v.phone, 5, 32))
  );
}

function isValidCardNumber(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (shouldDouble) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export async function GET(request: Request) {
  const rate = checkRateLimit({
    key: `orders:get:${getClientIp(request)}`,
    limit: 120,
    windowMs: 60_000,
  });
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  const orders = await getOrdersByUserId(user.id);
  return NextResponse.json(
    { orders },
    { headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden origin." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const rate = checkRateLimit({
    key: `orders:post:${getClientIp(request)}`,
    limit: 20,
    windowMs: 60_000,
  });
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many order attempts. Please try again shortly." },
      { status: 429, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to place an order." },
      { status: 401, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const { items, address, cardNumber } = (body ?? {}) as {
    items?: unknown;
    address?: unknown;
    cardNumber?: unknown;
  };

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json(
      { error: "Your cart is empty." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  if (!isAddress(address)) {
    return NextResponse.json(
      { error: "Please provide a complete shipping address." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  if (typeof cardNumber !== "string" || !isValidCardNumber(cardNumber)) {
    return NextResponse.json(
      { error: "Please enter valid payment details." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  // Re-price every item against the server-side catalog to avoid trusting
  // prices submitted by the client.
  const priced: CartItem[] = [];
  for (const raw of items as unknown[]) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.productId !== "string" || r.productId.length > 80) continue;

    const product = getProductById(r.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Invalid cart contents." },
        { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
      );
    }
    const qty = Math.max(1, Math.min(20, Number(r.quantity) || 1));
    priced.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      size:
        typeof r.size === "string" && r.size.length <= 40
          ? r.size
          : undefined,
      color:
        typeof r.color === "string" && r.color.length <= 40
          ? r.color
          : undefined,
    });
  }

  if (priced.length === 0) {
    return NextResponse.json(
      { error: "Invalid cart contents." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const subtotal = priced.reduce((s, it) => s + it.price * it.quantity, 0);
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const cleanDigits = cardNumber.replace(/\D/g, "");
  const paymentLast4 = cleanDigits.slice(-4);

  const order: Order = {
    id: crypto.randomUUID(),
    userId: user.id,
    items: priced,
    subtotal,
    shipping,
    tax,
    total,
    address,
    paymentLast4,
    status: "paid",
    createdAt: new Date().toISOString(),
  };

  await createOrder(order);
  return NextResponse.json(
    { order },
    { status: 201, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
