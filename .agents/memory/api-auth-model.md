---
name: No-login access model
description: The course must remain fully usable without accounts, sign-in pages, or authentication gates.
---

# The course has no login

**Rule:** Do not add login, sign-up, sign-out, account controls, protected frontend routes, or AI-usage redirects to authentication. The landing page, course, tutor, practice, assignments, diagnostics, and admin tools must work without an account.

**Why:** The user explicitly rejected all login and required it to be removed completely.

**How to apply:**
- Keep navigation and API calls anonymous.
- Do not reintroduce Clerk providers, auth pages, route guards, or quota responses that demand login.
- Admin mode remains a client-side convenience, not an identity boundary.
