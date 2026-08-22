---
name: Public access and download runtime notes
description: Course and AI tools are fully public with no login or forced authentication; retains PDF bundle notes.
---
**Rule:** All course routes and AI tools are public and unlimited by authentication. Do not use the former anonymous AI quota to block requests or ask users to sign in.

**Why:** The user explicitly mandated removal of all login and all forced-login behavior.

**How to apply:** New AI endpoints must remain usable without an account. CORS stays allowlisted; do not revert to reflecting arbitrary origins with credentials.

Also: pdfkit in the esbuild bundle needs `@swc/helpers` installed AND its `js/data` AFM font dir copied to `dist/data` in build.mjs, or PDF routes 500 at runtime.
