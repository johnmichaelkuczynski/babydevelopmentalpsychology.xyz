import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  db,
  assignmentsTable,
  problemsTable,
  topicsTable,
  practiceSessionsTable,
  practiceProblemsTable,
  practiceAttemptsTable,
} from "@workspace/db";
import {
  GeneratePracticeAssignmentResponse,
  GradePracticeAssignmentBody,
  GradePracticeAssignmentResponse,
} from "@workspace/api-zod";
import { chatJson } from "../lib/ai";
import { enforceAiQuota, recordAiUsage } from "../lib/quota";
import { gradePracticeEssay } from "../lib/grading";

const router: IRouter = Router();

function parseIdParam(raw: unknown): number {
  const s = Array.isArray(raw) ? raw[0] : (raw as string);
  return parseInt(s ?? "", 10);
}

// Generate a fresh, never-graded PRACTICE version of a graded assignment.
// Each call produces a brand-new set of problems modeled on the source
// assignment (same topics, same kind, same reasoning-answer format) — so the
// student can drill infinitely many practice homeworks / tests / midterms /
// finals before sitting the real one.
router.post(
  "/assignments/:assignmentId/practice",
  async (req, res): Promise<void> => {
    if (!(await enforceAiQuota(req, res))) return;
    const assignmentId = parseIdParam(req.params.assignmentId);
    if (!Number.isFinite(assignmentId)) {
      res.status(400).json({ error: "invalid assignmentId" });
      return;
    }

    const [assignment] = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.id, assignmentId));
    if (!assignment) {
      res.status(404).json({ error: "assignment not found" });
      return;
    }

    const sourceProblems = await db
      .select({
        prompt: problemsTable.prompt,
        correctAnswer: problemsTable.correctAnswer,
        topicId: problemsTable.topicId,
        topicTitle: topicsTable.title,
        position: problemsTable.position,
      })
      .from(problemsTable)
      .leftJoin(topicsTable, eq(problemsTable.topicId, topicsTable.id))
      .where(eq(problemsTable.assignmentId, assignmentId))
      .orderBy(asc(problemsTable.position));

    if (sourceProblems.length === 0) {
      res.status(404).json({ error: "assignment has no problems" });
      return;
    }

    // Cap how many we generate per set to keep generation snappy; mirror the
    // real assignment's length up to the cap.
    const templates = sourceProblems.slice(0, 10);

    let generated: Array<{
      prompt: string;
      correctAnswer: string;
      explanation: string;
    }> = [];
    try {
      const out = await chatJson<{
        problems: Array<{
          prompt: string;
          correctAnswer: string;
          explanation: string;
        }>;
      }>(
        `You write a PRACTICE version of an introductory developmental psychology ${assignment.kind} titled "${assignment.title}". You are given the real assignment's problems as templates. Produce EXACTLY ${templates.length} NEW problems, one per template, in the same order. Each new problem must: (1) cover the SAME topic and test the SAME concept as its template, (2) be clearly DIFFERENT in wording, scenario, and specifics (never copy the template), (3) match the template's style and answer length (if the template expects a reasoned paragraph, write a problem that calls for a reasoned paragraph), (4) be fully self-contained — do NOT reference "the lecture", "the text", "the course", or any named example a student would only know from a specific reading; state any scenario in full inside the problem. For each problem also write the model "correctAnswer" (what a strong student answer contains) and a short "explanation" of the reasoning. Respond as strict JSON: {"problems": [{"prompt": string, "correctAnswer": string, "explanation": string}, ...]} with exactly ${templates.length} items.`,
        JSON.stringify({
          assignmentKind: assignment.kind,
          assignmentTitle: assignment.title,
          templates: templates.map((t, i) => ({
            number: i + 1,
            topic: t.topicTitle ?? "developmental psychology",
            promptStyleExample: t.prompt,
            modelAnswerExample: t.correctAnswer,
          })),
        }),
      );
      generated = Array.isArray(out?.problems) ? out.problems : [];
    } catch {
      generated = [];
    }

    await recordAiUsage(
      req,
      generated.map((g) => `${g.prompt}${g.explanation}`).join(""),
    );

    // Fall back to a self-contained restatement if generation failed/short.
    const finalProblems = templates.map((t, i) => {
      const g = generated[i];
      const topic = t.topicTitle ?? "this topic";
      if (
        g &&
        typeof g.prompt === "string" &&
        g.prompt.trim() &&
        typeof g.correctAnswer === "string" &&
        g.correctAnswer.trim()
      ) {
        return {
          topicId: t.topicId,
          prompt: g.prompt.trim(),
          correctAnswer: g.correctAnswer.trim(),
          explanation:
            (g.explanation ?? "").trim() ||
            "Explain your reasoning using the core concept this problem targets.",
        };
      }
      return {
        topicId: t.topicId,
        prompt: `Practice (${topic}): In a short paragraph, explain the central idea of "${topic}" and apply it to an original example you describe in full.`,
        correctAnswer: t.correctAnswer,
        explanation:
          "Re-read the relevant section, state the main claim in your own words, and ground it with a concrete example.",
      };
    });

    const [session] = await db
      .insert(practiceSessionsTable)
      .values({
        weekNumber: assignment.weekNumber,
        topicId: null,
        assignmentId: assignment.id,
        mode: "assignment",
        tutorEnabled: true,
        focusOnWeaknesses: false,
        difficulty: 2.5,
      })
      .returning();
    if (!session) {
      res.status(500).json({ error: "failed to create practice session" });
      return;
    }

    const inserted = await db
      .insert(practiceProblemsTable)
      .values(
        finalProblems.map((p) => ({
          sessionId: session.id,
          topicId: p.topicId,
          prompt: p.prompt,
          correctAnswer: p.correctAnswer,
          explanation: p.explanation,
          difficulty: 2.5,
        })),
      )
      .returning();

    const topicTitleById = new Map(
      templates.map((t) => [t.topicId, t.topicTitle ?? null]),
    );

    res.json(
      GeneratePracticeAssignmentResponse.parse({
        sessionId: session.id,
        assignmentId: assignment.id,
        title: assignment.title,
        kind: assignment.kind,
        instructions: assignment.instructions ?? null,
        problems: inserted.map((p) => ({
          id: p.id,
          prompt: p.prompt,
          topicId: p.topicId,
          topicTitle: topicTitleById.get(p.topicId) ?? null,
        })),
      }),
    );
  },
);

// Grade every answer in a practice-assignment set and return rich coaching
// feedback per problem. Practice is never penalized — the score is purely
// informational so the student can see if they're ready for the real thing.
router.post(
  "/practice/assignment-sessions/:sessionId/grade",
  async (req, res): Promise<void> => {
    if (!(await enforceAiQuota(req, res))) return;
    const sessionId = parseIdParam(req.params.sessionId);
    if (!Number.isFinite(sessionId)) {
      res.status(400).json({ error: "invalid sessionId" });
      return;
    }
    const parsed = GradePracticeAssignmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [session] = await db
      .select()
      .from(practiceSessionsTable)
      .where(eq(practiceSessionsTable.id, sessionId));
    if (!session) {
      res.status(404).json({ error: "session not found" });
      return;
    }
    if (session.mode !== "assignment") {
      res
        .status(400)
        .json({ error: "session is not an assignment practice session" });
      return;
    }

    const problems = await db
      .select()
      .from(practiceProblemsTable)
      .where(eq(practiceProblemsTable.sessionId, sessionId))
      .orderBy(asc(practiceProblemsTable.id));

    const answerByProblem = new Map(
      parsed.data.answers.map((a) => [a.problemId, a]),
    );

    const results = await Promise.all(
      problems.map(async (problem) => {
        const submitted = answerByProblem.get(problem.id);
        const answer = submitted?.answer ?? "";
        const graded = await gradePracticeEssay({
          prompt: problem.prompt,
          correctAnswer: problem.correctAnswer,
          userAnswer: answer,
        });

        await db.insert(practiceAttemptsTable).values({
          sessionId,
          problemId: problem.id,
          topicId: problem.topicId,
          answer,
          correct: graded.correct,
          difficulty: problem.difficulty,
          trace: submitted?.trace ?? null,
        });

        return {
          problemId: problem.id,
          prompt: problem.prompt,
          correct: graded.correct,
          userAnswer: answer,
          correctAnswer: problem.correctAnswer,
          feedback: graded.feedback,
        };
      }),
    );

    const total = results.length;
    const score = results.filter((r) => r.correct).length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    res.json(
      GradePracticeAssignmentResponse.parse({
        score,
        total,
        percent,
        results,
      }),
    );
  },
);

export default router;
