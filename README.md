# KAYE Fashion Store

Luxury fashion storefront built with Next.js (App Router).

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Security Baseline Included

- Hardened response headers in Next config (`X-Frame-Options`, `nosniff`, `HSTS` in production, etc.)
- HttpOnly + secure session cookie settings
- Server-side origin checks on sensitive write endpoints
- In-memory API rate limiting for auth and order routes
- `no-store` API cache headers for user/session/order responses
- Server-side repricing of cart items before order creation

## Environment Variables

Create `.env` from `.env.example` and fill values:

```bash
cp .env.example .env
```

Required:

- `NOIR_SESSION_SECRET`: at least 32 chars (64 hex chars recommended)
- `NOIR_ALLOWED_ORIGINS`: comma-separated trusted origins

Generate a strong session secret:

```bash
npm run gen:session-secret
```

## Encrypt `.env` Before Sharing

Set an encryption key in your shell (do not commit this key):

```bash
export ENV_ENCRYPTION_KEY="replace-with-a-long-unique-passphrase"
```

Encrypt `.env` to `.env.enc`:

```bash
npm run encrypt:env
```

Decrypt when needed:

```bash
npm run decrypt:env
```

Notes:

- Commit `.env.enc` only if your team actually uses this workflow.
- Never commit `.env` or `.env.key`.
- Store `ENV_ENCRYPTION_KEY` in a password manager or CI secret manager.

## Pre-Publish Security Checklist (GitHub)

1. Ensure `.env` is ignored and not staged: `git status`
2. Rotate any key you may have ever exposed
3. Use GitHub Secrets (or host secrets) for production env values
4. Run checks before push:

```bash
npm run lint
npm run build
```

## Production Notes

- This project currently uses local JSON files in `.data/` as a demo datastore.
- For production, migrate to a managed database and central rate limiter (Redis/upstash).
