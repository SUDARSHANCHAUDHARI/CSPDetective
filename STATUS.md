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

Not yet deployed. **Zero-config Vercel** (`vercel --prod`) — no env vars required for the MVP.
