# CSP Detective

Inspect a URL's HTTP response headers — with the security-relevant ones (`Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) highlighted.

> **Status:** MVP scaffold. Builds, typechecks, lints, has 8 passing unit tests. The product described in the long-term vision (CSP analysis, iframe compatibility testing, Playwright rendering, AI explanations, browser compat matrix) is **not** implemented — those remain as flagged TODOs. This release ships the smallest useful thing: fetch a URL, show its response headers, mark the security ones.

## What's in this MVP

- `app/page.tsx` — single-page UI: URL input, "Inspect" button, sortable headers table, security headers tinted green
- `app/api/headers/route.ts` — server-side GET `/api/headers?url=…` that fetches the target URL and returns its response headers as JSON
- `lib/url.ts` — pure `validateTargetUrl()` helper enforcing http(s)-only (SSRF guard against `file:`, `javascript:`, `ftp:`, etc.)
- 10-second fetch timeout via `AbortController`
- Tailwind for styling, ESLint + TypeScript strict, Vitest

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>, paste a URL, click Inspect.

## Scripts

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit (strict)
pnpm test         # Vitest unit tests
```

## What it does NOT do (yet)

Out of scope for this MVP — these are the things the product vision called for but that aren't implemented:

- **CSP policy parsing and analysis** (currently the policy is shown as a raw string)
- **`X-Frame-Options` / `frame-ancestors` simulation** for iframe-compatibility verdicts
- **Playwright-based rendering tests** (live screenshot, console error capture)
- **Browser compatibility matrix**
- **AI-powered explanations and fix suggestions** (OpenAI / Claude integration)
- **Persistence** (PostgreSQL / Redis from the original spec)
- **Auth**

Each of these is a separate, scoped piece of work to add on top of this scaffold.

## Deployment

The MVP is a stock Next.js 15 app with no external dependencies, no environment variables, and no database. Zero-config Vercel deploy:

```bash
vercel        # preview
vercel --prod # production
```

## License

MIT — see [LICENSE](LICENSE).
