import { Download } from "lucide-react";

const apiBase = `${import.meta.env.BASE_URL}api`;

// Plain topic names only — no unit/week/topic-number meta-markers (user mandate).
export const COURSE_TOPICS = [
  "What developmental psychology is",
  "Nature vs. nurture",
  "The infant mind (what we know before we can speak)",
  "Attachment (the first bond)",
  "How thinking develops (Piaget)",
  "Language development",
  "The adolescent brain",
  "Aging and the lifespan",
];

/**
 * Small vertical topics list pinned to the top-left of a page, styled after the
 * reference screenshot: heading, count, plain list, download button.
 */
export function TopicsList() {
  return (
    <div className="w-56 shrink-0 flex flex-col gap-3" data-testid="topics-sidebar">
      <div>
        <h2 className="font-serif font-semibold text-base leading-snug">
          Topics Covered in This Course
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {COURSE_TOPICS.length} topics
        </p>
      </div>
      <ul className="flex flex-col gap-2.5">
        {COURSE_TOPICS.map((t) => (
          <li key={t} className="text-xs leading-snug text-foreground/80">
            {t}
          </li>
        ))}
      </ul>
      <a href={`${apiBase}/course/download?format=pdf`} download className="mt-1">
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          data-testid="button-sidebar-download-pdf"
        >
          <Download className="w-3.5 h-3.5" />
          Download Course (PDF)
        </button>
      </a>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Every lecture (short version) plus practice homework and exam problems.
      </p>
    </div>
  );
}
