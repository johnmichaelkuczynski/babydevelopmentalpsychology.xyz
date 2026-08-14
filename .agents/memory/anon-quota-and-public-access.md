---
name: Anonymous access + AI quota model
description: The app is now public; anonymous visitors get a server-enforced free AI budget keyed by X-Anon-Id.
---
The login wall was removed on purpose: all content routes are public; only /admin and /diagnostics stay Clerk-protected (client-side). The API now DOES enforce server-side limits for anonymous users — this supersedes the old "no server authz at all" note for AI endpoints.

**Rule:** every AI-consuming endpoint must call `enforceAiQuota(req,res)` (atomic pre-charge upsert with `setWhere` under the 1500-char limit) and, where output size matters, `recordAiUsage`. Auto-firing endpoints (tutor suggestions) must soft-skip (`hasAiQuota` → empty result), never 401, or opening a lecture redirects anonymous users to sign-in.

**Why:** a plain read-then-record check was race-bypassable (parallel requests all passed); pre-charge of 300/request bounds concurrency to limit/precharge.

**How to apply:** when adding any new AI endpoint, wire the quota helpers; visitor stats endpoint is owner-email-gated server-side via clerkClient (johnmichaelkuczynski@gmail.com). CORS is allowlisted (replit.dev/app, prod domain) — don't revert to `origin: true` with credentials.

Also: pdfkit in the esbuild bundle needs `@swc/helpers` installed AND its `js/data` AFM font dir copied to `dist/data` in build.mjs, or PDF routes 500 at runtime.
