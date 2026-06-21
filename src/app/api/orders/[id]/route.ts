import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/db";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  NO_STORE_HEADERS,
} from "@/lib/security";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const rate = checkRateLimit({
    key: `orders:id:${getClientIp(req)}`,
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
  const { id } = await ctx.params;
  const order = await getOrderById(id);
  if (!order || order.userId !== user.id) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
    );
  }
  return NextResponse.json(
    { order },
    { headers: { ...NO_STORE_HEADERS, ...rateHeaders } },
  );
}
