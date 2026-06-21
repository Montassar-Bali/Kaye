import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createUser, findUserByEmail } from "@/lib/db";
import {
  hashPassword,
  isValidEmail,
  isValidPassword,
  setSessionCookie,
  toPublicUser,
} from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  isTrustedOrigin,
  NO_STORE_HEADERS,
} from "@/lib/security";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden origin." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `signup:${ip}`,
    limit: 6,
    windowMs: 60_000,
  });
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again shortly." },
      { status: 429, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
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

  const { name, email, password } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  if (typeof name !== "string" || name.trim().length < 2 || name.length > 80) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const { passwordHash, passwordSalt } = hashPassword(password);
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name: name.trim(),
    passwordHash,
    passwordSalt,
    createdAt: new Date().toISOString(),
  };
  await createUser(user);
  await setSessionCookie(user.id);

  return NextResponse.json(
    { user: toPublicUser(user) },
    { status: 201, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
