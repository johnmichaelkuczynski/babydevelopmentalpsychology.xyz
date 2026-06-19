import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, lecturesTable } from "@workspace/db";
import { AskTutorBody, AskTutorResponse } from "@workspace/api-zod";
import { chatText, chatJson, FAST_MODEL } from "../lib/ai";

const router: IRouter = Router();

router.get("/tutor/suggestions/:lectureId", async (req, res): Promise<void> => {
  const lectureId = Number(req.params.lectureId);
  if (!Number.isFinite(lectureId)) {
    res.status(400).json({ error: "invalid lectureId" });
    return;
  }
  const [lecture] = await db
    .select()
    .from(lecturesTable)
    .where(eq(lecturesTable.id, lectureId));
  if (!lecture) {
    res.status(404).json({ error: "lecture not found" });
    return;
  }

  const SYSTEM_PROMPT =
    'You are a rigorous introductory developmental psychology tutor writing study questions. Reply as strict JSON of the form {"questions": string[]} with NO other keys.';
  const buildUserPrompt = (extra: string) =>
    extra +
    `From the lecture below, write 6 starter questions that make the student APPLY the lecture's ideas to a CONCRETE EXAMPLE. Every question must hang on a specific case and ask the student to reason about that case.\n\n` +
    `THE SINGLE MOST IMPORTANT RULE: every question must contain an explicit, concrete, EVERYDAY example — a specific relatable situation (e.g. "an infant who plays happily until her mother leaves the room and then bursts into tears", "a preschooler who is sure the taller glass holds more juice even after watching you pour it over", "a toddler who says 'goed' instead of 'went', a word no adult ever taught him"). Keep examples plain-language and non-technical — no technical terms, study citations, or jargon. The question must ask the student to analyze, explain, judge, or predict something about THAT example. Reuse the lecture's own examples when it has them; otherwise invent a vivid, specific one.\n\n` +
    `ABSOLUTELY FORBIDDEN — never produce any of these:\n` +
    `- Questions that ask for a definition ("What is X?", "What does X mean?", "Define X").\n` +
    `- Questions that ask to distinguish or compare concepts in the abstract ("How do X and Y differ?", "What is the difference between X and Y?", "How does X relate to Y?").\n` +
    `- Questions about terminology, labels, or what something is "called".\n` +
    `- Any question that could be answered without referring to a specific case.\n\n` +
    `If a question does not name a concrete example and ask the student to reason about it, REWRITE it until it does.\n\n` +
    `GOOD vs BAD:\n` +
    `- BAD: "What's the difference between assimilation and accommodation?"\n` +
    `- GOOD: "Two children are raised by the same parents, but one is bold and the other shy — what does this suggest about whether upbringing alone 'causes' a child's personality?"\n` +
    `- BAD: "What is object permanence?"\n` +
    `- GOOD: "A 6-month-old stops reaching for a toy the instant you hide it under a blanket — explain what this shows about how an infant that age thinks about objects."\n\n` +
    `Cover several different major ideas from the reading across the 6 questions. One clear sentence each (roughly 12–28 words), in the student's own voice, no compound double-questions. Use $...$ for any inline math.\n\n` +
    `Return exactly 6 questions.\n\nLECTURE TITLE: ${lecture.title}\n\nLECTURE BODY:\n"""\n${lecture.body}\n"""`;

  // Reject abstract / definition / comparison questions so none reach the UI.
  // Kept precise to avoid false-positives on valid case questions (e.g. "What
  // should Alex do after lying?"), since the prompt + retry do the heavy lifting.
  const isAbstract = (q: string): boolean => {
    const t = q.toLowerCase().trim();
    return (
      /\bdefine\b/.test(t) ||
      /\bwhat does .+\bmean\b/.test(t) ||
      /\bwhat (is|are) (the )?(meaning|definition)\b/.test(t) ||
      /\bdifference between\b/.test(t) ||
      /\bhow (do|does) .+ (differ|relate)\b/.test(t) ||
      /\bwhat (distinguishes|makes) .+ (from|rather than)\b/.test(t) ||
      /\bwhat (is|are) .+ called\b/.test(t)
    );
  };

  const generate = async (extra: string): Promise<string[]> => {
    const out = await chatJson<{ questions: string[] }>(
      SYSTEM_PROMPT,
      buildUserPrompt(extra),
      FAST_MODEL,
    );
    return Array.isArray(out?.questions)
      ? out.questions.filter((q) => typeof q === "string" && q.trim().length > 0)
      : [];
  };

  try {
    const good: string[] = [];
    const seen = new Set<string>();
    const retryNote =
      "Your previous attempt included abstract or definition-style questions, which are unacceptable. EVERY question MUST describe a specific situation with a named person or concrete act. ";
    // Bounded refill loop: regenerate until we have 6 concrete questions.
    for (let attempt = 0; attempt < 3 && good.length < 6; attempt++) {
      const batch = (await generate(attempt === 0 ? "" : retryNote)).filter(
        (q) => !isAbstract(q),
      );
      for (const q of batch) {
        if (good.length >= 6) break;
        const key = q.toLowerCase().trim();
        if (!seen.has(key)) {
          good.push(q);
          seen.add(key);
        }
      }
    }
    res.setHeader("Cache-Control", "no-store");
    res.json({ questions: good.slice(0, 6) });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.json({ questions: [] });
  }
});

router.post("/tutor/ask", async (req, res): Promise<void> => {
  const parsed = AskTutorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { message, selectedLectureText } = parsed.data;

  const sys =
    "You are an encouraging introductory developmental psychology tutor. Explain step by step, use clear examples and relatable cases, and define key terms (e.g. nature vs. nurture, temperament, attachment, object permanence, conservation, the teenage brain) when they come up. Keep replies short (3-6 sentences) unless the student asks for more detail. Never just give the answer — guide them.";
  const user = selectedLectureText
    ? `Context from the lecture the student is reading:\n"""\n${selectedLectureText}\n"""\n\nStudent question: ${message}`
    : message;

  let text = "";
  try {
    text = await chatText(sys, user);
  } catch {
    text =
      "I'm having trouble reaching the tutor service right now. Try again in a moment, and consider re-reading the relevant section of the lecture.";
  }
  res.json(AskTutorResponse.parse({ text, audioUrl: null }));
});

export default router;
