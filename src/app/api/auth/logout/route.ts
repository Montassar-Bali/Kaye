import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
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

  const rate = checkRateLimit({
    key: `logout:${getClientIp(request)}`,
    limit: 30,
    windowMs: 60_000,
  });
  const rateHeaders = getRateLimitHeaders(rate);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }

  await clearSessionCookie();
  return NextResponse.json(
    { ok: true },
    { headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
