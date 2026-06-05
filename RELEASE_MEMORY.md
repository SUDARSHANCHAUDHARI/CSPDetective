# Release Memory: CSP Detective
_Last updated: 2026-06-04_

## Current Status

CSP Detective currently appears to be README-level only. No package config was found, and README says “Getting Started: Coming soon.”

## Release Target

New web app MVP.

## Success Criteria

- Next.js app scaffold exists.
- Users can enter a URL and inspect headers.
- CSP and X-Frame-Options are parsed and explained.
- Iframe compatibility result is shown.
- Basic Playwright render check is available.
- Build and deploy docs exist.

## Ordered Plan

1. Scaffold Next.js app with TypeScript and Tailwind.
2. Implement URL input and header inspection API.
3. Add CSP/X-Frame-Options parser.
4. Add iframe compatibility matrix.
5. Add Playwright render/console capture flow.
6. Add AI explanation layer only after deterministic checks work.
7. Add build, deploy, and security docs.

## Risks

- Fetching arbitrary URLs has SSRF/security implications.
- Browser rendering checks need timeouts and sandboxing.
- AI explanations should not replace deterministic security findings.

## First Task

Scaffold the app and implement deterministic header inspection first.

