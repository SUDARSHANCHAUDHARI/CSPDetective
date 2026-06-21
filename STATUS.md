# Status — CSP Detective

**Last updated:** 2026-06-21
**Maturity:** 🔴 `status-mvp-scaffold`

## What's done

The repo was previously zero source code (README said "Coming soon..."). Bootstrapped from scratch:

- Next.js 15 + React 19 + TypeScript (strict) + Tailwind + ESLint + Vitest
- **UI** (`app/page.tsx`) — URL input → headers table, sorted, with six standard security headers tinted green: `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Server route** (`app/api/headers/route.ts`) — GET `/api/headers?url=…` fetches the target server-side with a 10 s `AbortController` timeout, returns `{status, finalUrl, headers}` as JSON
- **Pure SSRF guard** (`lib/url.ts`) — `validateTargetUrl()` accepts only `http:` / `https:`, trims whitespace, prepends `https://` only when no scheme is present (catches the bug where `file:///etc/passwd` would otherwise pass through)
- Identifies itself with a User-Agent header so site owners can see who's probing
- 8 Vitest tests including SSRF rejection for `file:`, `javascript:`, `ftp:`, `gopher:` schemes — the test suite caught a real bug in `validateTargetUrl` before shipping
- Honest README that lists what's done vs. what's still vision-only
- Build, lint, typecheck (strict), tests all green
- No env vars or external services required

## What's left

This is the minimum useful product. The full vision in the original repo description is **not** implemented:

- **CSP policy parsing and analysis** — currently the CSP value is shown as a raw string. A real product would parse directives, flag unsafe sources (`'unsafe-inline'`, `*`, etc.), and link to fixes.
- **`X-Frame-Options` / `frame-ancestors` simulation** — predict whether a site embeds in a given parent
- **Playwright-based rendering tests** — live screenshot, console-error capture, in-iframe render verification
- **Browser compatibility matrix** — does this site work in Safari, kiosk Chrome, signage Edge, etc.
- **AI-powered explanations and fix suggestions** — OpenAI / Claude integration (was in original spec)
- **Persistence** — Postgres / Redis (was in original spec)
- **Auth** — none currently

Each of these is a separate, scoped piece of work to add on top of this scaffold.

## Quality gates

| Gate | Status |
|---|---|
| Build | ✅ |
| Lint | ✅ 0 errors |
| Typecheck (strict) | ✅ |
| Tests | ✅ 8 / 1 suite |

## Deployment

Not yet deployed. Self-hosted on your own domain. Stock Next.js with no env vars for the MVP — deploy via the same flow you use for your other apps.

## File-by-file checklist

### App shell
- [x] `app/layout.tsx` — root layout + metadata
- [x] `app/page.tsx` — single-page UI (URL input → headers table with security highlighting)
- [x] `app/globals.css` — Tailwind base

### API
- [x] `app/api/headers/route.ts` — GET `/api/headers?url=…` with 10 s AbortController timeout, returns status/finalUrl/headers JSON, custom User-Agent

### Lib
- [x] `lib/url.ts` — `validateTargetUrl()` pure SSRF guard (http(s) only, blocks `file:` / `javascript:` / `ftp:` / `gopher:`)

### Tests
- [x] `lib/url.test.ts` — 8 tests including the SSRF rejection cases (test suite caught a real bug in `validateTargetUrl` during development)

### Tooling
- [x] `package.json` — Next 15 + React 19 + TS strict + Tailwind + ESLint + Vitest
- [x] `tsconfig.json` (strict)
- [x] `.eslintrc.json` (next/core-web-vitals)
- [x] `tailwind.config.js`, `postcss.config.js`
- [x] `next.config.js` (reactStrictMode: true)
- [x] `vitest.config.ts`

### Not done (the original product vision)
- [ ] CSP policy parsing + analysis (currently shows raw string only)
- [ ] `X-Frame-Options` / `frame-ancestors` simulation (iframe-compat verdict)
- [ ] Playwright rendering tests (live screenshot, console-error capture, in-iframe render verification)
- [ ] Browser compatibility matrix (Safari, kiosk Chrome, signage Edge, etc.)
- [ ] AI-powered explanations + fix suggestions (OpenAI / Anthropic)
- [ ] Persistence (Postgres / Redis from original spec)
- [ ] Auth

## Categorized work remaining

| Item | Effort | Bucket | Blocker | Priority |
|------|--------|--------|---------|----------|
| CSP policy parser + UI breakdown | ~1d | 🟦 Pure code | none — parse directives, flag unsafe sources | P1 |
| X-Frame-Options / frame-ancestors simulator | ~half day | 🟦 Pure code | none — pure logic from headers | P2 |
| Playwright rendering tests (screenshot + console capture) | ~1–2d | 🟦 Pure code | none — adds `playwright` dep + a `/api/render` route | P2 |
| Browser compatibility matrix | ~1d | 🟦 Pure code | none — extend Playwright multi-browser projects | P3 |
| AI explanations + fix suggestions | ~1d | 🟦 Pure code | needs `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` for live use | P2 |
| Persistence (Postgres / Redis) | ~1d | 🟦 Pure code (+🔑 hosted DB) | only needed when adding auth + history | P3 |
| Auth | ~1d | 🟦 Pure code | none — pick a provider (Clerk / NextAuth / custom) | P3 |
| Deploy MVP to your domain | ~30m | 🔑 Needs hosting | hosting access; no env vars for MVP | P1 |

## Release plan

CSP Detective is the longest-tail repo. Phased releases:

1. **`v0.1.0` (now):** MVP — URL inspector with security-header highlighting.
2. **`v0.2.0`:** CSP parser (directives + unsafe-source flags) + X-Frame simulator.
3. **`v0.3.0`:** Playwright rendering tests (screenshot, console errors).
4. **`v0.4.0`:** AI explanations (`OPENAI_API_KEY` required to use; falls back to "set key" message without).
5. **`v0.5.0`:** Browser compatibility matrix.
6. **`v1.0.0`:** Auth + persistence (history of past inspections per user).

### Deploy prerequisites
**For the MVP (`v0.1.0`):** None. Stock Next.js, no env vars, no database.

**As features land:**
- `v0.3.0+`: Playwright Chromium binary on the host (`pnpm playwright install chromium` in build step)
- `v0.4.0+`: `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`)
- `v1.0.0+`: `DATABASE_URL` (Postgres) + auth provider credentials
