type MutableGlobal = typeof globalThis & {
  __noirRateLimitStore?: Map<string, RateLimitEntry>;
};

type ResponseHeaderMap = Record<string, string>;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

function getStore(): Map<string, RateLimitEntry> {
  const g = globalThis as MutableGlobal;
  if (!g.__noirRateLimitStore) {
    g.__noirRateLimitStore = new Map<string, RateLimitEntry>();
  }
  return g.__noirRateLimitStore;
}

function cleanupExpired(now: number) {
  const store = getStore();
  if (store.size < 2000) return;
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const store = getStore();
  const existing = store.get(options.key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + options.windowMs;
    store.set(options.key, { count: 1, resetAt });
    return {
      ok: true,
      limit: options.limit,
      remaining: Math.max(0, options.limit - 1),
      resetAt,
      retryAfterSec: 0,
    };
  }

  existing.count += 1;
  store.set(options.key, existing);

  const ok = existing.count <= options.limit;
  const retryAfterSec = ok
    ? 0
    : Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    ok,
    limit: options.limit,
    remaining: Math.max(0, options.limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSec,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): ResponseHeaderMap {
  const base: ResponseHeaderMap = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
  };
  if (!result.ok) {
    base["Retry-After"] = String(result.retryAfterSec);
  }
  return base;
}

function normalizedOrigin(input: string): string | null {
  try {
    const url = new URL(input);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

export function isTrustedOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  const candidate = normalizedOrigin(origin);
  if (!candidate) return false;

  const allowed = new Set<string>();
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  if (host) {
    allowed.add(`${proto}://${host}`);
  }

  const fromEnv = process.env.NOIR_ALLOWED_ORIGINS;
  if (fromEnv) {
    for (const raw of fromEnv.split(",")) {
      const normalized = normalizedOrigin(raw.trim());
      if (normalized) allowed.add(normalized);
    }
  }

  return allowed.has(candidate);
}

export const NO_STORE_HEADERS: ResponseHeaderMap = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
};
