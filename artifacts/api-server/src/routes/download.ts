import { Router, type IRouter } from "express";
import { asc, eq, inArray } from "drizzle-orm";
import PDFDocument from "pdfkit";
import {
  db,
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
} from "@workspace/db";

const router: IRouter = Router();

const COURSE_TITLE = "Basic Developmental Psychology";

type Section = {
  heading: string;
  subheading?: string;
  paragraphs: string[];
};

async function buildCourseDocument(): Promise<{ intro: string[]; sections: Section[] }> {
  const topics = await db
    .select()
    .from(topicsTable)
    .orderBy(asc(topicsTable.position));
  const lectures = await db
    .select()
    .from(lecturesTable)
    .orderBy(asc(lecturesTable.id));
  const lectureByTopic = new Map(lectures.map((l) => [l.topicId, l]));

  const assignments = await db
    .select()
    .from(assignmentsTable)
    .where(inArray(assignmentsTable.kind, ["homework", "test", "final"]))
    .orderBy(asc(assignmentsTable.position), asc(assignmentsTable.id));

  const sections: Section[] = [];

  // Topics overview
  sections.push({
    heading: "Topics Covered",
    paragraphs: topics.map((t, i) => `1.${i + 1}  ${t.title}`),
  });

  // Lectures (short versions)
  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    const lec = lectureByTopic.get(t.id);
    if (!lec) continue;
    sections.push({
      heading: `Lecture 1.${i + 1} — ${lec.title}`,
      paragraphs: lec.body.split(/\n{2,}/).map((p) => p.replace(/\s+\n/g, "\n").trim()).filter(Boolean),
    });
  }

  // Practice homeworks and exams (question prompts only)
  for (const a of assignments) {
    const problems = await db
      .select()
      .from(problemsTable)
      .where(eq(problemsTable.assignmentId, a.id))
      .orderBy(asc(problemsTable.position));
    const label =
      a.kind === "homework" ? "Practice Homework" : a.kind === "test" ? "Practice Test" : "Practice Final Exam";
    sections.push({
      heading: `${label}: ${a.title}`,
      subheading: a.instructions ?? undefined,
      paragraphs: problems.map((p, i) => `${i + 1}. ${p.prompt}`),
    });
  }

  const intro = [
    COURSE_TITLE,
    "A complete one-unit introduction to developmental psychology: the full short-form lectures, plus practice homework sets, a practice unit test, and a practice final exam.",
    `Downloaded from the course site. ${topics.length} topics, ${assignments.length} practice assignments.`,
  ];

  return { intro, sections };
}

router.get("/course/download", async (req, res) => {
  const format = req.query.format === "pdf" ? "pdf" : "txt";
  const { intro, sections } = await buildCourseDocument();

  if (format === "txt") {
    const lines: string[] = [];
    lines.push(intro[0]);
    lines.push("=".repeat(intro[0].length));
    lines.push("");
    lines.push(...intro.slice(1));
    lines.push("");
    for (const s of sections) {
      lines.push("");
      lines.push(s.heading);
      lines.push("-".repeat(Math.min(s.heading.length, 78)));
      if (s.subheading) {
        lines.push(s.subheading);
        lines.push("");
      }
      for (const p of s.paragraphs) {
        lines.push(p);
        lines.push("");
      }
    }
    const body = lines.join("\n");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="basic-developmental-psychology-course.txt"',
    );
    res.send(body);
    return;
  }

  // PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="basic-developmental-psychology-course.pdf"',
  );
  const doc = new PDFDocument({ size: "LETTER", margins: { top: 64, bottom: 64, left: 64, right: 64 } });
  doc.pipe(res);

  doc.font("Times-Bold").fontSize(24).text(intro[0], { align: "center" });
  doc.moveDown(1);
  doc.font("Times-Roman").fontSize(12);
  for (const p of intro.slice(1)) {
    doc.text(p, { align: "center" });
    doc.moveDown(0.5);
  }

  for (const s of sections) {
    doc.addPage();
    doc.font("Times-Bold").fontSize(16).text(s.heading);
    doc.moveDown(0.5);
    if (s.subheading) {
      doc.font("Times-Italic").fontSize(11).text(s.subheading);
      doc.moveDown(0.5);
    }
    doc.font("Times-Roman").fontSize(11);
    for (const p of s.paragraphs) {
      doc.text(p, { lineGap: 2 });
      doc.moveDown(0.6);
    }
  }

  doc.end();
});

export default router;
