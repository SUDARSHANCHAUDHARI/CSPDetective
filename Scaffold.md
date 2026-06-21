Project 12: CSP Detective
Browser security + iframe diagnostics platform
Core idea

CSP Detective explains why websites fail inside:

iframe
kiosk browser
signage player
WebView
embedded dashboard
fullscreen environments

Instead of forcing users to manually inspect browser headers, console logs, and security policies, it gives:

human-readable explanations
AI diagnostics
browser compatibility analysis
fix recommendations

Think:

Chrome DevTools + security scanner + AI explainer
for embedding problems.
Tech stack
Frontend:
Next.js 15
React
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion

Backend:
Node.js
Fastify / Next.js API routes

Browser automation:
Playwright

AI:
OpenAI / Claude

Database:
PostgreSQL
Prisma

Queue:
BullMQ
Redis

Deployment:
Self-hosted on your own domain (existing portfolio hosting)
Railway / Fly / your container host (for any backend services)
Supabase / Neon
Upstash Redis
Repo structure
csp-detective/
  apps/
    web/
      app/
        page.tsx
        dashboard/
        scans/
        scans/[id]/
        reports/
        docs/
        settings/
        api/
      components/
        scan/
          url-input.tsx
          security-score-card.tsx
          header-table.tsx
          issue-panel.tsx
          ai-summary-card.tsx
          browser-compatibility-grid.tsx
        dashboard/
        reports/
        layout/
        marketing/
      lib/
        api.ts
        auth.ts
        constants.ts
      package.json

    worker/
      src/
        jobs/
          scan-url.job.ts
          browser-analysis.job.ts
          ai-analysis.job.ts
        services/
          header-parser.ts
          csp-analyzer.ts
          iframe-checker.ts
          browser-engine.service.ts
          ai-report-generator.ts
        index.ts
      package.json

  packages/
    database/
      prisma/
        schema.prisma
      src/
        client.ts

    shared/
      src/
        security-types.ts
        scoring.ts
        browser-types.ts

    ui/
      components/
      styles/

  docs/
    product-spec.md
    mvp-roadmap.md
    security-analysis.md
    ai-prompts.md
    browser-compatibility.md

  infra/
    docker-compose.yml
    railway.json

  .env.example
  package.json
  pnpm-workspace.yaml
  README.md
Main features
1. URL scanning
2. HTTP header inspection
3. CSP analysis
4. X-Frame-Options analysis
5. iframe compatibility detection
6. autoplay policy detection
7. fullscreen restriction detection
8. cookie policy detection
9. browser compatibility testing
10. Playwright rendering tests
11. console error capture
12. AI explanation engine
13. risk scoring
14. shareable reports
15. PDF export
Database schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  scans     Scan[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Scan {
  id             String      @id @default(cuid())
  userId         String?
  url            String
  status         ScanStatus  @default(PENDING)
  securityScore  Int?
  iframeAllowed  Boolean?
  aiSummary      String?
  headers        Json?
  browserResults Json?
  issues         Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id])
}

enum ScanStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}
Scan flow
User submits URL
↓
Worker fetches headers
↓
Analyze CSP
↓
Analyze X-Frame-Options
↓
Launch Playwright
↓
Attempt iframe rendering
↓
Capture browser console errors
↓
Analyze browser restrictions
↓
Generate security score
↓
AI generates explanation
↓
Dashboard report shown
AI analysis prompt
You are an expert browser security and iframe diagnostics engineer.

Analyze this website security scan.

Explain:
1. Why iframe embedding works or fails
2. Whether CSP blocks rendering
3. Whether X-Frame-Options blocks rendering
4. Whether autoplay restrictions exist
5. Whether fullscreen restrictions exist
6. Whether cookies/session issues may happen
7. Whether kiosk/signage players may fail
8. Human-readable explanation
9. Recommended fixes

Scan data:
{{SCAN_DATA}}
Security scoring system
100 = fully embeddable and signage-safe

Scoring:
iframe compatibility: 30
browser compatibility: 20
CSP flexibility: 20
autoplay compatibility: 10
fullscreen compatibility: 10
session/login compatibility: 10

Example:

Security Score: 48/100

Major issues:
- X-Frame-Options SAMEORIGIN
- restrictive CSP frame-ancestors
- autoplay blocked
Dashboard layout
Top:
security score
iframe compatibility
browser support
risk level

Middle:
headers table
console errors
compatibility matrix

Right:
AI explanation
recommended fixes
signage compatibility

Bottom:
browser rendering screenshots
timeline
recent scans
Browser compatibility matrix
Chrome
Edge
Firefox
Android WebView
SCOS
FireOS
Samsung Tizen
LG webOS
iOS Safari
MVP pages
/
/dashboard
/scans
/scans/[id]
/reports
/docs
/settings
API design
POST /api/scans
GET  /api/scans/:id

POST /api/url/validate

GET  /api/reports/:id

POST /api/uploads
MVP build order
Phase 1:
- URL input
- Header fetch
- CSP analysis
- iframe detection

Phase 2:
- Playwright testing
- console log capture
- browser screenshots

Phase 3:
- AI explanations
- compatibility matrix
- shareable reports

Phase 4:
- team workspace
- PDF export
- API access
- billing
Monetization
Free:
10 scans/month

Pro:
$12/month
500 scans/month
AI explanations
browser screenshots

Team:
$49/month
shared reports
API access
history

Enterprise:
custom
bulk scanning
private deployment
audit reporting
Viral demo idea
“Paste any URL.
CSP Detective tells you exactly why it breaks inside iframe or signage.”

Especially powerful for:

QA engineers
signage teams
frontend developers
kiosk builders
Best MVP version

Build this first:

URL input
↓
fetch headers
↓
detect iframe blockers
↓
AI explanation

That alone already solves real pain.