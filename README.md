# CSP Detective

Inspect a URL's HTTP response headers — with the security-relevant ones (`Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) highlighted.

> **Status:** MVP scaffold. Builds, typechecks, lints, has 8 passing unit tests. The product described in the long-term vision (CSP analysis, iframe compatibility testing, Playwright rendering, AI explanations, browser compat matrix) is **not** implemented — those remain as flagged TODOs. This release ships the smallest useful thing: fetch a URL, show its response headers, mark the security ones.

## Table of Contents

- [What's in this MVP](#whats-in-this-mvp)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [What it does NOT do (yet)](#what-it-does-not-do-yet)
- [Deployment](#deployment)
- [License](#license)
- [About](#about)

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

No external dependencies, no environment variables, no database. Deployed on
**Cloudflare Pages** as a static export (`npx next build` → `out`) plus one
native Pages Function (`functions/api/headers.ts`, Web-APIs only — no
`nodejs_compat` needed). Live at `cspdetective.sudarshantechlabs.com`.

## License

MIT — see [LICENSE](LICENSE).

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
