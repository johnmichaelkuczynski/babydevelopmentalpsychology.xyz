// ---------------------------------------------------------------------------
// Original content for the embedded diagnostic reasoning assessments.
//
// Two instruments, each offered at FOUR time-points (phases) so a student can
// gauge themselves before, during, and after the course:
//   - subject  — Developmental Psychology subject-specific reasoning. Realistic
//     short cases about the course material; the best-supported answer is keyed
//     first.
//   - general  — General Reasoning. Genuine reasoning items spanning analysis,
//     inference, evaluation, deduction, and induction (NOT a "docility"/agree-
//     with-authority test).
//
// Each (instrument, phase) is offered in THREE selectable answer formats that
// share the same kind of questions:
//   - mcq     — pick the single best option.
//   - hybrid  — pick the best option AND (optionally) write a short note.
//   - written — no options shown; write a short answer in your own words.
//
// These diagnostics are UNGRADED practice: takeable anytime, unlimited times,
// and they never affect the course grade. Every time a test is started, fresh
// questions are generated (see reasoning.ts) so questions never repeat. The
// items below are the structural BLUEPRINT (style + fallback) for that
// generation, grounded per phase by GEN_SPECS.
//
// All items are ORIGINAL. For every item the correct option is written FIRST;
// at seed time options are rotated so the correct answer lands at a varied
// index (see seedDiagnostics.ts). `modelAnswer` is the ideal short written
// response used to grade the written/hybrid formats.
// ---------------------------------------------------------------------------

export type SkillArea =
  | "analysis"
  | "inference"
  | "evaluation"
  | "deduction"
  | "induction";

export type Instrument = "subject" | "general";

export type Phase = "before" | "third" | "twothirds" | "after";

export type DiagFormat = "mcq" | "hybrid" | "written";

// A single unified diagnostic item. The correct option is listed FIRST and is
// rotated to a random index at seed time. `modelAnswer` is the reference answer
// for grading the written/hybrid formats.
export type DiagItem = {
  prompt: string;
  options: string[];
  modelAnswer: string;
  skillArea?: SkillArea;
};

export type DiagnosticSeed = {
  instrument: Instrument;
  phase: Phase;
  format: DiagFormat;
  title: string;
  subtitle: string;
  instructions: string;
  items: DiagItem[];
};

// ===========================================================================
// Phase metadata
// ===========================================================================

export const PHASE_ORDER: Phase[] = ["before", "third", "twothirds", "after"];

export const PHASE_LABEL: Record<Phase, string> = {
  before: "Before the course",
  third: "One-third of the way through",
  twothirds: "Two-thirds of the way through",
  after: "After the course",
};

// ===========================================================================
// Per-(instrument, phase) generation specs
// Used by reasoning.ts to generate fresh, never-repeating questions grounded in
// the right scope for the chosen time-point. `topicFocus` describes WHAT to ask
// about; `level` nudges difficulty for the time-point.
// ===========================================================================

export type GenSpec = { topicFocus: string; level: string };

const SUBJECT_SPECS: Record<Phase, GenSpec> = {
  before: {
    level:
      "Intro level: answerable by a thoughtful newcomer reasoning carefully, BEFORE any lessons. Do not assume prior course knowledge or technical terms.",
    topicFocus:
      "What developmental psychology is and how it thinks about people: that development is lifelong change (from before birth to old age) studied scientifically, that it spans physical, cognitive, and social-emotional growth, and that who a person becomes grows out of nature and nurture working together rather than a single 'it's all genes' or 'it's all upbringing' cause.",
  },
  third: {
    level:
      "Early course level: covers roughly the first third of the unit. Plain language, short realistic cases.",
    topicFocus:
      "Topics 1.1-1.3: what developmental psychology is (lifelong change across physical, cognitive, and social-emotional domains); nature vs. nurture (genes set a range, environment shapes it, and the two interact rather than competing); and the infant mind (infants are not blank — they prefer faces and voices and already expect objects to be solid/permanent, studied via looking time and surprise).",
  },
  twothirds: {
    level:
      "Mid course level: covers roughly the first two-thirds of the unit. Realistic short cases requiring a step of reasoning.",
    topicFocus:
      "Topics 1.1-1.6: lifelong development, nature/nurture interaction, and the infant mind, PLUS attachment (the bond rests on comfort/contact not just food, and works as a secure base for exploration), how children think (Piaget — children reason by different rules that change in stages, e.g. conservation and egocentrism), and language development (children learn rules, shown by overregularization like 'goed'/'foots', within a sensitive period).",
  },
  after: {
    level:
      "End-of-course level: covers the whole unit. Integrative short cases that apply more than one idea.",
    topicFocus:
      "The full unit, topics 1.1-1.8: lifelong development, nature/nurture, the infant mind, attachment, Piagetian thinking, and language, PLUS the teenage brain (an early-maturing reward system and late-maturing prefrontal control, with risk heightened by peers) and aging and the lifespan (development never stops; aging brings losses AND gains, with crystallized knowledge holding/growing and often steady or higher well-being).",
  },
};

const GENERAL_SPECS: Record<Phase, GenSpec> = {
  before: {
    level: "Everyday, accessible reasoning. One step of inference per item.",
    topicFocus:
      "General reasoning on everyday, neutral topics: identifying assumptions and conclusions, what evidence does and does not support, judging the strength of sources, valid vs. invalid deduction, and the strength of generalizations.",
  },
  third: {
    level: "Everyday reasoning, slightly more demanding than the baseline.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  twothirds: {
    level: "Moderately demanding reasoning, sometimes two steps.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
  after: {
    level: "More demanding, multi-step reasoning where appropriate.",
    topicFocus:
      "General reasoning on everyday, neutral topics: assumptions/conclusions, supported inferences, source quality, deductive validity, and inductive strength.",
  },
};

export function genSpecFor(instrument: Instrument, phase: Phase): GenSpec {
  return instrument === "subject"
    ? SUBJECT_SPECS[phase]
    : GENERAL_SPECS[phase];
}

// ===========================================================================
// Format-specific instructions
// ===========================================================================

const FORMAT_LABEL: Record<DiagFormat, string> = {
  mcq: "Multiple Choice",
  hybrid: "Hybrid",
  written: "Written",
};

function instructionsFor(instrument: Instrument, format: DiagFormat): string {
  const subject =
    instrument === "subject"
      ? "Answer each question about developmental psychology — these reward careful reasoning about realistic cases, not memorized facts"
      : "Answer each reasoning question — these measure how you think, not what you recall";
  const body =
    format === "mcq"
      ? `${subject} by selecting the single best option.`
      : format === "hybrid"
        ? `${subject} by selecting the best option. You can add a quick note on your reasoning if you like — it's optional and a few words is plenty.`
        : `${subject}. No answer options are shown — just jot a brief answer in your own words. One or two sentences is plenty; there's no need to write a lot.`;
  return `${body} This is ungraded practice — take it anytime, as many times as you like; it never affects your course grade. Submitting shows your results with written feedback.`;
}

// ===========================================================================
// SUBJECT — Developmental Psychology blueprint cases (best answer keyed FIRST)
// ===========================================================================

const SUBJECT_BEFORE: DiagItem[] = [
  {
    prompt:
      "A reporter asks a developmental psychologist why a particular toddler is unusually shy. The psychologist would most likely explain the behavior in terms of:",
    options: [
      "an inborn temperament and the child's experiences working together",
      "the toddler's astrological sign",
      "whether the room happened to be noisy that day",
      "the reporter's personal opinion of toddlers",
    ],
    modelAnswer:
      "Developmental psychology explains behavior through nature and nurture working together (e.g. temperament plus experience), not luck, intuition, or unrelated traits.",
  },
  {
    prompt:
      "A headline claims 'people are simply born exactly who they'll be — genes decide everything.' How would a developmental psychologist most likely treat this claim?",
    options: [
      "As an oversimplification, since development comes from nature and nurture together",
      "As obviously true and needing no evidence",
      "As something that cannot be studied at all",
      "As true only for certain personality types",
    ],
    modelAnswer:
      "It is an oversimplification; the field rejects 'genes decide everything' because development arises from nature and nurture interacting.",
  },
  {
    prompt:
      "Which question is most central to what developmental psychology actually studies?",
    options: [
      "How and why people change across their lives, from before birth to old age",
      "Which infant stroller is the cheapest to buy",
      "How to design a more comfortable nursery chair",
      "Which childhood stories make the most dramatic movies",
    ],
    modelAnswer:
      "Developmental psychology studies how and why people change across the whole lifespan, from before birth to old age.",
  },
];

const SUBJECT_THIRD: DiagItem[] = [
  {
    prompt:
      "A newborn turns toward her mother's voice and stares longer at a human face than at a scrambled pattern. These behaviors are best understood as showing that:",
    options: [
      "infants arrive already prepared for people, not as blank slates",
      "the infant is simply bored",
      "newborns cannot tell anything apart",
      "the infant dislikes faces",
    ],
    modelAnswer:
      "Newborns already prefer faces and familiar voices, showing the infant mind is prepared for people rather than blank.",
    skillArea: "analysis",
  },
  {
    prompt:
      "Two children are raised by the same parents, but one is naturally bold and the other cautious, and they end up with quite different experiences at home. This best illustrates that:",
    options: [
      "a child's inborn temperament and environment interact, each shaping the other",
      "parents have no effect on children at all",
      "only the weather shapes behavior",
      "the outcome is pure random chance",
    ],
    modelAnswer:
      "It shows nature and nurture interact: an inborn temperament shapes the experiences a child has, so the same parents create different environments.",
    skillArea: "inference",
  },
  {
    prompt:
      "A student says 'how a person turns out is decided entirely by how they're raised — genes don't matter.' Why would a developmental psychologist push back?",
    options: [
      "Because development comes from genes and environment working together, not nurture alone",
      "Because upbringing never influences anyone",
      "Because only adults ever change",
      "Because development cannot be explained in any way",
    ],
    modelAnswer:
      "Single-cause explanations are too simple; development results from nature and nurture interacting, so 'all upbringing' is as wrong as 'all genes.'",
    skillArea: "evaluation",
  },
];

const SUBJECT_TWOTHIRDS: DiagItem[] = [
  {
    prompt:
      "You pour juice from a wide glass into a tall, thin one while a preschooler watches, and they insist the tall glass now has more. What does this best illustrate about young children's thinking?",
    options: [
      "Children reason by different rules and can center on one feature (height) while missing that the amount is unchanged",
      "The child is simply not paying attention",
      "Preschoolers think exactly like adults",
      "The amount of juice really did change",
    ],
    modelAnswer:
      "It shows the conservation error: young children reason by different rules, focusing on one feature (height) and missing that quantity stayed the same.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "A toddler who once said 'went' starts saying 'goed,' a word no adult ever taught her. What does this scenario best demonstrate?",
    options: [
      "Children learn grammar rules and over-apply them, rather than only imitating what they hear",
      "The child has forgotten how to talk",
      "Adults must have taught her the word 'goed'",
      "Language is learned purely by copying phrases",
    ],
    modelAnswer:
      "Overregularization shows children learn rules (add '-ed') and over-apply them to irregular words, proving rule-learning rather than imitation.",
    skillArea: "inference",
  },
  {
    prompt:
      "A frightened infant monkey chooses to cling to a soft cloth 'mother' that gives no milk rather than a bare wire one that does. Why is that important for understanding attachment?",
    options: [
      "It shows the bond rests on comfort and contact, not just on being fed",
      "It proves infants don't need food at all",
      "It shows attachment is only about feeding",
      "It means infants prefer whoever is nearest",
    ],
    modelAnswer:
      "Attachment rests on comfort and contact, not just food; the infant seeks the comforting figure even when it provides no milk.",
    skillArea: "analysis",
  },
];

const SUBJECT_AFTER: DiagItem[] = [
  {
    prompt:
      "A teenager drives carefully when alone but takes far more risks when friends are in the car. Which explanation fits what the course shows about the teenage brain?",
    options: [
      "The reward system matures early while impulse-control matures later, and peers heighten the pull of risky choices",
      "Teenagers simply choose to misbehave for no reason",
      "The teenage brain is fully mature and identical to an adult's",
      "Friends have no effect on a teenager's choices",
    ],
    modelAnswer:
      "The early-maturing reward system, late-maturing prefrontal control, and the heightened reward of peer presence explain more risk-taking with friends.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "An older adult is slower at learning a brand-new phone app but has a far richer vocabulary and steadier judgment than a young adult. How should this be understood?",
    options: [
      "As aging bringing losses and gains: fluid speed declines while crystallized knowledge holds or grows",
      "As proof that aging is only decline",
      "As a sign the older adult is not really thinking",
      "As meaning age never changes the mind at all",
    ],
    modelAnswer:
      "Aging brings losses and gains: raw speed (fluid) declines while accumulated knowledge and judgment (crystallized) hold steady or grow.",
    skillArea: "inference",
  },
  {
    prompt:
      "A commentator says, 'After childhood, development is over — it's all genes early on and then pure decline.' Drawing on the unit, the strongest criticism is that:",
    options: [
      "Development is lifelong and shaped by nature and nurture together, with real gains even in later life",
      "Development really does stop at childhood, so the claim is fine",
      "Genes truly decide everything early, so the claim is fine",
      "Nothing about people can ever be studied",
    ],
    modelAnswer:
      "Development is lifelong and arises from nature and nurture interacting; later life brings real gains (e.g. crystallized knowledge, well-being), so the claim fails twice.",
    skillArea: "evaluation",
  },
];

// ===========================================================================
// GENERAL — reasoning blueprint (analysis / inference / evaluation /
// deduction / induction). Shared across phases; difficulty is nudged per phase
// at generation time (see GEN_SPECS.level).
// ===========================================================================

const GENERAL_BLUEPRINT: DiagItem[] = [
  {
    prompt:
      "Consider: 'All students who studied passed the exam. Maria studied. So Maria passed.' Which unstated assumption does the argument rely on?",
    options: [
      "Maria is among the students the first statement describes.",
      "Studying is the only way to pass the exam.",
      "Maria always studies for her exams.",
      "The exam was unusually difficult.",
    ],
    modelAnswer:
      "It assumes Maria is one of the students covered by 'all students who studied' — that her studying puts her in the group described.",
    skillArea: "analysis",
  },
  {
    prompt:
      "A survey finds 70% of people who exercise daily report good sleep, versus 30% of those who never exercise. Which conclusion is best supported?",
    options: [
      "People who exercise daily are more likely to report good sleep than those who never exercise.",
      "Exercise guarantees good sleep for everyone.",
      "Poor sleep is what causes people to stop exercising.",
      "Anyone who wants good sleep must exercise daily.",
    ],
    modelAnswer:
      "Only that daily exercisers are more likely to report good sleep — an association, not a guarantee or a proven cause.",
    skillArea: "inference",
  },
  {
    prompt: "Which source would most strengthen the claim 'this medication is safe'?",
    options: [
      "A large, peer-reviewed clinical trial.",
      "A testimonial from one satisfied customer.",
      "An advertisement produced by the manufacturer.",
      "A popular wellness blog post.",
    ],
    modelAnswer:
      "A large, peer-reviewed clinical trial — independent, systematic evidence is far stronger than a testimonial, an ad, or a blog.",
    skillArea: "evaluation",
  },
  {
    prompt:
      "'If it rained, the streets are wet. The streets are not wet.' What necessarily follows?",
    options: [
      "It did not rain.",
      "It rained.",
      "The streets are dry for some other reason.",
      "Nothing at all follows.",
    ],
    modelAnswer:
      "It did not rain — if rain would have made the streets wet and they are not wet, then it cannot have rained.",
    skillArea: "deduction",
  },
  {
    prompt:
      "Plants given a new fertilizer grew taller than otherwise identical plants without it, all else held equal. The best-supported conclusion is:",
    options: [
      "The fertilizer probably caused the extra growth.",
      "Taller plants attract more fertilizer.",
      "Fertilizer is required for any plant growth at all.",
      "The result was pure coincidence.",
    ],
    modelAnswer:
      "Because everything else was held equal, the fertilizer probably caused the extra growth.",
    skillArea: "induction",
  },
  {
    prompt:
      "A report notes that ice-cream sales and drowning deaths rise in the same months. A careful reader should infer that:",
    options: [
      "Both may be linked to a third factor, such as hot weather.",
      "Eating ice cream causes drowning.",
      "Drowning incidents cause ice-cream sales.",
      "The data must simply be mistaken.",
    ],
    modelAnswer:
      "That both probably rise because of a shared third factor such as hot weather — correlation doesn't mean one causes the other.",
    skillArea: "inference",
  },
];

// ===========================================================================
// Seed expansion — each (instrument, phase) in all three formats
// ===========================================================================

type BaseContent = {
  instrument: Instrument;
  phase: Phase;
  baseTitle: string;
  items: DiagItem[];
};

const BASE_CONTENT: BaseContent[] = PHASE_ORDER.flatMap((phase) => {
  const subjectItems: Record<Phase, DiagItem[]> = {
    before: SUBJECT_BEFORE,
    third: SUBJECT_THIRD,
    twothirds: SUBJECT_TWOTHIRDS,
    after: SUBJECT_AFTER,
  };
  return [
    {
      instrument: "subject" as const,
      phase,
      baseTitle: `Developmental Psychology Check — ${PHASE_LABEL[phase]}`,
      items: subjectItems[phase],
    },
    {
      instrument: "general" as const,
      phase,
      baseTitle: `General Reasoning Check — ${PHASE_LABEL[phase]}`,
      items: GENERAL_BLUEPRINT,
    },
  ];
});

const FORMATS: DiagFormat[] = ["mcq", "hybrid", "written"];

export const DIAGNOSTIC_SEED: DiagnosticSeed[] = BASE_CONTENT.flatMap((base) =>
  FORMATS.map((format) => ({
    instrument: base.instrument,
    phase: base.phase,
    format,
    title: `${base.baseTitle} · ${FORMAT_LABEL[format]}`,
    subtitle: PHASE_LABEL[base.phase],
    instructions: instructionsFor(base.instrument, format),
    items: base.items,
  })),
);
