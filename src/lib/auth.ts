import { cookies } from "next/headers";
import crypto from "node:crypto";
import { findUserById } from "./db";
import type { PublicUser, User } from "./types";

const SESSION_COOKIE = "noir_session";
// 14 days
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function getSessionSecret(): string {
  const secret = process.env.NOIR_SESSION_SECRET;
  if (typeof secret === "string" && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NOIR_SESSION_SECRET must be set in production and be at least 32 characters long.",
    );
  }

  // Dev fallback only.
  return "noir-dev-secret-please-change-in-production-abcdef0123456789";
}

// ————————— Password hashing (scrypt) —————————

export function hashPassword(password: string): {
  passwordHash: string;
  passwordSalt: string;
} {
  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, passwordSalt, 64);
  return { passwordHash: derived.toString("hex"), passwordSalt };
}

export function verifyPassword(
  password: string,
  passwordHash: string,
  passwordSalt: string,
): boolean {
  const derived = crypto.scryptSync(password, passwordSalt, 64);
  const a = Buffer.from(derived);
  const b = Buffer.from(passwordHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ————————— Signed session tokens (HMAC-SHA256) —————————

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? 0 : 4 - (input.length % 4);
  const normalized =
    input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(normalized, "base64");
}

interface SessionPayload {
  sub: string; // user id
  iat: number; // issued-at seconds
  exp: number; // expiry seconds
}

export function signSession(userId: string): string {
  const secret = getSessionSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: userId,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };
  const body = base64url(JSON.stringify(payload));
  const sig = base64url(
    crypto.createHmac("sha256", secret).update(body).digest(),
  );
  return `${body}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
  const secret = getSessionSecret();
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = base64url(
    crypto.createHmac("sha256", secret).update(body).digest(),
  );
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(base64urlDecode(body).toString()) as SessionPayload;
    if (!payload.sub || typeof payload.exp !== "number") return null;
    if (Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ————————— Cookie helpers —————————

export async function setSessionCookie(userId: string): Promise<void> {
  const store = await cookies();
  const token = signSession(userId);
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload) return null;
  const user = await findUserById(payload.sub);
  return user || null;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

// Simple validation helpers
export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    email.length <= 254
  );
}

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 200;
}
