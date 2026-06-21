import { NextResponse } from "next/server";
import { getCurrentUser, toPublicUser } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  NO_STORE_HEADERS,
} from "@/lib/security";

export async function GET(request: Request) {
  const rate = checkRateLimit({
    key: `me:${getClientIp(request)}`,
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
  return NextResponse.json(
    { user: user ? toPublicUser(user) : null },
    { headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
