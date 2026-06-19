# 🔎 Basic Developmental Psychology

**A complete, one-unit introduction to developmental psychology that teaches, tutors, drills, and grades itself — built for serious learners entering the discipline.**

---

## 🧩 Overview

Basic Developmental Psychology is a self-paced, single-user web course that delivers a rigorous introduction to developmental psychology — taught, tutored, drilled, and graded entirely by AI, with built-in academic-integrity enforcement. It is built for adults coming to the field for the first time: graduate students, researchers, and working professionals who need a substantive foothold in a new discipline.

It turns the enduring question of *how people grow into who they are* into one product: read each lesson at the depth you want, ask a tutor scoped to the exact section you're on, drill questions whose difficulty adapts to you in real time, and submit homework, a unit test, and a final that are AI-graded with feedback and screened for AI-generated answers. The material is substantive and rigorous — it explains the science of how people change across the whole lifespan, from before birth to old age.

The curriculum is organized into **one unit and 8 topics**: 1.1 what developmental psychology is; 1.2 nature vs. nurture; 1.3 the infant mind; 1.4 attachment; 1.5 how thinking develops (Piaget); 1.6 language development; 1.7 the adolescent brain; and 1.8 aging and the lifespan.

Designed for **graduate students, researchers, instructors evaluating AI-taught coursework, and academics studying AI integrity**, Basic Developmental Psychology pairs a real curriculum with two layers of AI-authorship detection — surfacing not just *whether* the writing looks AI-generated, but whether the *act of producing it* did.

---

## 🧠 What It Does

- **One-Unit Structured Curriculum** — A complete intro syllabus across 8 topics. The unit ships with lessons, two homework sets, a timed unit test, and a cumulative final exam.
- **Three-Depth Lessons** — Every lesson is available at **Short / Medium / Long** length, AI-rewritten while preserving the same examples and learning objectives. Skim the concept, expand it on demand, or read the deeper cut.
- **Section-Scoped AI Tutor** — Ask a question about the paragraph you're reading and the answer streams back token-by-token, grounded in that exact lecture section. Suggested starter questions are pre-generated per lecture.
- **Adaptive Topic Practice** — Generated problem sets that move difficulty up after a streak and down after a miss, with explanations on every answer. Per-session difficulty persists, so each drill picks up where the last one left off.
- **AI-Graded Assignments** — Homework, the unit test, and the final are scored by an LLM grader that judges semantic equivalence to a model answer, returns per-problem correctness *plus* a written rationale, then rolls up to a percent score on the attempt.
- **Two-Layer AI Detection on Every Submission** — Each submitted answer is screened by both a static text classifier (GPTZero) and a diachronic keystroke-pattern detector. Each verdict ships with a human-readable rationale.
- **Diagnostic Reasoning Checks** — Two instruments (Developmental Psychology subject reasoning; and General Reasoning across analysis, inference, evaluation, deduction, and induction), each offered in three formats (multiple choice, hybrid, or written) and three lengths, at four points in the journey (before, one-third, two-thirds, and after the course). They are ungraded practice — takeable anytime, unlimited, with freshly generated questions every attempt — and never affect the grade (coursework is 100%).
- **Live Analytics** — Dashboard KPIs (attempts, accuracy, streak), per-topic mastery percentages, and a recent-activity feed — so progress, weak spots, and momentum are all visible at a glance.
- **Operator Diagnostics** — One-click self-tests (system health and synthetic-student end-to-end run) verify the entire stack — database, OpenAI integration, GPTZero, detection pipeline, and the practice/grade loop — before you trust a session.
- **Built-In Product Demo Video** — A screencast of the live UI — animated cursor, real typing, real streaming responses — ships as its own deployable artifact, so the product can show itself without anyone narrating it.

---

## ⚙️ Technical Features

- **Two-Layer AI-Authorship Detection** —
  - **Static (GPTZero):** Every submitted answer is sent to GPTZero's `predict/text` endpoint; the per-document AI probability is blended `0.85 × GPTZero + 0.15 × structural-heuristic` for the final score. If GPTZero is unavailable, the system silently falls back to an LLM scorer plus heuristic — submissions never block.
  - **Diachronic (Keystroke Pattern):** The student textarea captures keystroke count, erase count, bulk-insert events, longest bulk insert, rewrite segments, and total duration. A scorer penalizes paste-then-reword behavior, low keystroke-to-output ratios, and impossibly sustained typing speeds — catching AI use even when the final text is reworded enough to pass GPTZero.
- **Diagnostic Self-Tests** —
  - **System Diagnostic** (`/diagnostics/system`): Ordered checks — environment, database round-trip, course-seed integrity, OpenAI chat completion, OpenAI JSON mode, detection pipeline, AI-positive control sample, and GPTZero connectivity. Each step returns pass/fail, timing, and a raw error string.
  - **Synthetic-Student Diagnostic** (`/diagnostics/synthetic-run`): Spins up a fake student, runs a practice session (wrong → adjust ↓ → right → adjust ↑), takes a full assignment attempt, submits it, and verifies grading + detection + analytics all reflect the run. End-to-end stack proof in one click.
- **Contract-First API** — A single OpenAPI document is the source of truth; React Query hooks for the UI and Zod validators for the server are generated from it. Request and response shapes can't drift between client and server because both come from the same spec.
- **Streaming AI Tutor** — Token-by-token Server-Sent-Event streaming for tutor answers, with a section-scoped system prompt so responses stay grounded in the lecture the student is reading.
- **Adaptive Practice Engine** — Per-session difficulty (1–4 continuous) adjusts after each attempt; the next-problem generator takes the current difficulty and the topic as input, so the question pool is generated on demand instead of pre-baked.
- **Real-React Demo Video** — The product walkthrough is a real React app, not a slideshow: persistent sidebar, animated SVG cursor, character-by-character typing, word-by-word streaming responses, and scene-synced background audio — all exported as MP4 from a single browser tab.
- **Operator Console** — A dedicated Diagnostics page in the student app surfaces both self-tests with one-click execution, per-step pass/fail rows, and raw error output for debugging.
- **Living README** — This README plus a companion `BLUEPRINT.md` architecture document are kept in lock-step with the code — short-form and long-form views of the same truth.

---

## 📊 Designed For

- **Adult learners new to the field:** A complete, rigorous introduction to developmental psychology delivered with on-demand tutoring and adaptive practice — for graduate students, researchers, and professionals entering the discipline.
- **Instructors & Curriculum Designers:** A working reference for what AI-taught, AI-graded, AI-detection-screened coursework actually looks like end-to-end.
- **Academic-Integrity Researchers:** A live testbed for layered AI-authorship detection that combines text-based classification with behavioral keystroke evidence.
- **Product & Engineering Teams:** A reference implementation of contract-first full-stack architecture, streaming AI UX, and self-diagnostic operator tooling in a Replit pnpm monorepo.

---

## 💡 Core Idea

Basic Developmental Psychology reframes an AI-taught course as a *closed accountability loop*.

It doesn't just teach the material and grade the homework — it **teaches**, **tutors**, **drills**, **grades**, **detects misuse**, and **proves the whole pipeline still works** with a single click. The result is a self-paced course that students can actually trust to be fair, and that instructors can actually trust to be honest.

**Basic Developmental Psychology — where the curriculum, the tutor, the grader, and the integrity check all live in one room.**

---

## 👤 User preferences

- The user prefers to **convert the existing app in place** (e.g. replacing the prior course content/branding with the new subject) rather than create a standalone clone — keep all functionality and format intact when making content/branding changes.
- **Naming rule:** the course must be positioned for serious adults (often graduate students or professors entering a new discipline), never as a children's product. If a name is of the form "X for Children", rename it to "Basic X". Never use the words "baby"/"babies" anywhere, and never use "children" in any video or YouTube description. Avoid infantilizing marketing ("no math", "no coding", "kid-friendly", "age-appropriate", "middle schoolers", "grown-ups", "friendly"); lead with the depth and wealth of the content instead.
