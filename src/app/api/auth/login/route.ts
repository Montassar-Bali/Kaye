import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import {
  isValidEmail,
  setSessionCookie,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  isTrustedOrigin,
  NO_STORE_HEADERS,
} from "@/lib/security";

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden origin." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `login:${ip}`,
    limit: 12,
    windowMs: 60_000,
  });
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again shortly." },
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

  const { email, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (
    !isValidEmail(email) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 200
  ) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 400, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  const ok = verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  await setSessionCookie(user.id);
  return NextResponse.json(
    { user: toPublicUser(user) },
    { headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
