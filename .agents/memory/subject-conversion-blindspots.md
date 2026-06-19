---
name: Subject conversion blind spots
description: Non-obvious places that still carry the old course subject after a rebrand
---

When converting the course to a new subject (e.g. Evolutionary → Criminal Psychology), the obvious copy is in `artifacts/*/src/.../video_scenes/SceneN.tsx`. The easily-missed spots that strand old branding:

- `artifacts/<video-artifact>/index.html` — `<title>` plus `og:title`/`og:description` and `twitter:title`/`twitter:description` meta still name the old subject.
- `artifacts/<video-artifact>/YOUTUBE_DESCRIPTION.md` — a full per-artifact description (title options, topic list, hashtags, chapters) themed to the old subject.

**Why:** these files don't render in the app preview and don't show up in a `SceneN.tsx` text grep, so a scene-only conversion passes visual checks while metadata/docs keep the old subject.

**How to apply:** after editing scenes, run a repo-wide sweep for old-subject terms across the whole artifact dir (not just scenes), and check `index.html` + any `*DESCRIPTION*.md`. Keep one canonical YouTube description (repo-root `youtube-description.md`) and treat artifact-local copies as synced mirrors.

Two more easily-missed spots:

- **ALL sibling video/demo artifacts, not just the headline promo.** A subject rebrand must cover every `video`-kind artifact (e.g. `course-promo`, `qr-course-demo`, `diagnostics-demo`) plus their `.replit-artifact/artifact.toml` `title` (canvas/preview labels read from there). Update toml titles via `verifyAndReplaceArtifactToml` (temp `artifact.edit.toml` → validate), never edit the toml in place.
- **Demo videos are intentionally partial screencasts.** The `qr-course-demo` only ever shows a subset of topics (e.g. lectures 1.1–1.5 with a "6 Lectures" label) — that is original format, not a conversion bug. Per the user's "convert in place, keep format/length intact" preference, do NOT expand demo scenes to list every course topic; only re-theme the existing copy. A code review may flag this as "missing topics 1.6–1.8" — that's over-applying the main-app's topic count to a demo and should be declined.

- **`artifact.toml` titles hide from ripgrep because `.replit-artifact/` is a hidden dir.** `rg` skips dot-directories by default, so a repo-wide old-subject grep can return "CLEAN" while all four `artifacts/*/.replit-artifact/artifact.toml` `title` fields still carry the old subject. Always run the branding sweep with `rg --hidden` (and `--glob '!.git/**'`), or explicitly check each `artifact.toml`.

- **A brand rename has MORE than one off-brand variant, and the same brand string repeats within one file.** Renaming "<X> for Children" → "Basic <X>" missed two things: (1) a sibling off-brand variant "<X> for Everyone" used as the unit/test/final titles (`course.ts` WEEK_TITLES + `seed.ts` assignment titles) — grep the bare subject ("Developmental Psychology") not just the exact banned phrase; (2) the brand appears twice in a layout (header span AND footer div), so fixing the first grep hit leaves the second. **How to apply:** after renaming, re-grep for the bare subject noun and for `for \w+` patterns, and confirm count drops to expected — don't assume one occurrence per file.
