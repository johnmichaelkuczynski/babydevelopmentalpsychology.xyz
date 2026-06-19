import { db } from "@workspace/db";
import {
  topicsTable,
  lecturesTable,
  assignmentsTable,
  problemsTable,
  seedMetaTable,
} from "@workspace/db";
import { eq, sql, and, like, notInArray } from "drizzle-orm";
import { logger } from "./logger";

// Content version of the seeded curriculum. BUMP THIS whenever the TOPICS or
// ASSIGNMENTS content below changes. On boot, seedIfEmpty compares this against
// the value stored in seed_meta; a mismatch forces a full re-seed, so content
// edits self-heal in every environment (including a republished production)
// without a manual database wipe.
const SEED_CONTENT_VERSION = "2026-06-16-basic-developmental-psychology-v2";

type SeedTopic = {
  slug: string;
  title: string;
  weekNumber: number;
  blurb: string;
  lectureTitle: string;
  body: string;
};

const TOPICS: SeedTopic[] = [
  // Unit 1 — Basic Developmental Psychology
  {
    slug: "what-developmental-psychology-is",
    title: "What developmental psychology is",
    weekNumber: 1,
    blurb: "Developmental psychology studies how people change from before birth to the end of life — and change never really stops.",
    lectureTitle: "1.1 What developmental psychology is (growth, stages, and the whole lifespan)",
    body: `# What developmental psychology is

An infant who can't hold up her head becomes a toddler who runs, then a teenager who argues about everything, then an adult, then an old person looking back on it all. That whole journey is the subject of **developmental psychology** — the careful study of how and why people change across their entire lives.

## A science of change across life

Developmental psychology is a science, which means it doesn't run on cute stories or "common sense" about kids. It uses evidence — careful observation, experiments, and studies that follow the same people for years — to ask things like: *when* do infants start to understand the world, *how* does thinking grow more powerful, and *why* do teenagers take risks. The goal is to describe what really changes, and to explain what drives those changes.

## Stages or smooth growth?

One of the field's oldest questions is whether we change in **stages** — sudden jumps to a new way of being, like a caterpillar turning into a butterfly — or in smooth, gradual steps, like a plant slowly growing taller. The honest answer is "some of both." Some changes (like learning to walk) look like real leaps; others (like getting better at remembering) creep up gradually. Knowing which is which is a big part of the work.

## Three kinds of growth at once

To keep things clear, developmental psychologists watch three areas at the same time: **physical** growth (the body and brain), **cognitive** growth (thinking, memory, and language), and **social-emotional** growth (feelings and relationships). These are tangled together — an infant who can finally crawl (physical) suddenly explores more, learns more (cognitive), and bumps into new rules from parents (social). Real development is all three braided into one rope.

## Why this matters

This isn't just for scientists. The same ideas shape how we raise children, design schools, write laws about teenagers, and care for the elderly. When adults misunderstand how children grow — expecting a three-year-old to "just be reasonable," or treating a teenager's brain as a finished adult brain — real people get hurt or blamed for things they can't yet do. Understanding development is a kind of fairness across every age.

## In the real world

Some of the most powerful evidence comes from **longitudinal studies** — projects that follow the very same people for decades. In New Zealand, researchers tracked over a thousand infants born in the same town from birth into middle age, measuring them again and again. That patient, year-after-year watching revealed how early traits, family life, and luck weave together over a lifetime — something no single snapshot of a person could ever show. It's a reminder that development is a story, and you have to watch the whole thing to understand it.`,
  },
  {
    slug: "nature-vs-nurture",
    title: "Nature vs. nurture",
    weekNumber: 1,
    blurb: "It was never 'genes OR environment' — who you become grows out of the two working together, constantly.",
    lectureTitle: "1.2 Nature vs. nurture (the argument that won't die)",
    body: `# Nature vs. nurture

Here's an argument that has run for centuries and refuses to end: are we shaped by **nature** — the genes we're born with — or by **nurture** — the world that raises us? People still take sides as if it's a sports match. But the real answer, the one the evidence keeps pointing to, is that the question itself is wrong. It was never one or the other.

## Two answers that are both incomplete

"Nature" says you arrive with a fixed blueprint: your genes set your height, your temperament, maybe even your talents. "Nurture" says you arrive as a blank slate, and your family, friends, and experiences write the whole story. Each side captures something true — and each, on its own, is clearly false. Identical twins raised apart end up similar in surprising ways (score one for nature), yet a child's language, habits, and fears are obviously shaped by where they grow up (score one for nurture).

## Genes set a range, the world picks the spot

A better way to think about it: your genes often set a **range** of possibilities, and your environment decides where inside that range you land. Height is a clear example — good genes set how tall you *could* grow, but poor nutrition can keep you well below it. The same logic reaches into the mind: a child might be born with the potential to be a strong reader, but only a world full of books and conversation turns that potential into the real thing.

## They don't just add — they interact

The deepest idea is that nature and nurture don't sit in separate boxes; they **interact.** A naturally bold, active infant pulls different reactions out of the world than a quiet, cautious one — so the same parents end up creating different environments for each child. Genes shape the experiences you have, and experiences can even change how genes get used. Asking "how much is nature and how much is nurture?" is a bit like asking whether a song is more about the notes or the playing.

## Why the either/or is dangerous

Picking a side has real costs. Believe everything is "nature" and you start treating people's troubles as fixed and hopeless — why bother helping? Believe everything is "nurture" and you blame parents for every difference and ignore real inborn needs. The mature view — that the two always work together — keeps us both realistic about what's hard to change and hopeful about what isn't.

## In the real world

There's a genetic condition called PKU where, because of a single faulty gene, the body can't handle a substance found in ordinary food — and the buildup once caused serious intellectual disability. It sounds like pure "nature," a fate written in the genes. But the harm only happens if the child *eats* that substance. Put the infant on a special diet — a change in **nurture** — and development proceeds normally. One faulty gene, one change in the environment, and the outcome flips completely. It's the whole nature-and-nurture lesson in a single story.`,
  },
  {
    slug: "the-infant-mind",
    title: "The infant mind",
    weekNumber: 1,
    blurb: "Infants aren't blank, helpless blobs — they arrive already tuned to faces, voices, and the rules of the world.",
    lectureTitle: "1.3 The infant mind (what infants know before they can speak)",
    body: `# The infant mind

For a long time people assumed a newborn's mind was a "blooming, buzzing confusion" — a blank, helpless blob that knew nothing. That picture turned out to be spectacularly wrong. Modern research shows that infants arrive already prepared for the world, packed with preferences and expectations, long before they can say a single word.

## Born ready for people

Within days of birth, infants already prefer some things over others — and most of those things are *people.* Newborns turn toward human faces more than scrambled patterns, prefer their own mother's voice to a stranger's, and like the rhythm of the language they heard in the womb. They aren't passive. From the start, an infant is built to seek out the faces and voices that will keep it alive and teach it everything. The "blank slate" was never blank.

## How do you study an infant who can't talk?

Here's the clever problem: you can't *ask* an infant what it knows. So researchers learned to read the two things infants control — **where they look** and **how long.** Infants stare longer at things that are new or surprising and look away from things that have become boring. By carefully measuring those gazes, scientists can ask an infant "does this surprise you?" without a single word — and the infant answers with its eyes.

## The surprise test

Use that trick and something amazing appears. Show an infant an event that breaks the rules of the physical world — an object that seems to pass through a solid wall, or two toys that become three when nothing was added — and the infant **stares longer**, as if to say "wait, that's not possible." That extra staring is evidence that even young infants already expect objects to be solid, to keep existing when hidden, and to add up correctly. They have a rough physics in their heads before they can crawl.

## Out of sight, not gone

One famous milestone is **object permanence** — understanding that a thing still exists even when you can't see it. Very young infants act as if a hidden toy has simply vanished; a bit later, they'll search for it under a blanket. For decades people thought this understanding arrived slowly and late. The looking-time studies suggest infants grasp it earlier than they can *show* with their clumsy hands — knowing and doing don't always arrive together.

## In the real world

In one elegant study, researchers showed infants a simple "math" scene: one doll placed behind a screen, then a second doll added behind it. When the screen dropped to reveal only *one* doll — an impossible result — the infants stared much longer than when two dolls appeared. Months before they could speak or count, they expected one plus one to make two, and were startled when it didn't. The infant mind, it turns out, is already quietly keeping track of the world.`,
  },
  {
    slug: "attachment",
    title: "Attachment",
    weekNumber: 1,
    blurb: "The bond between an infant and its caregiver isn't just sweet — it's a survival system that shapes how we relate for life.",
    lectureTitle: "1.4 Attachment (why the first bond shapes everything)",
    body: `# Attachment

Watch a one-year-old in a new place and you'll see it: she explores, then glances back to make sure her caregiver is still there, then explores a little further. That invisible thread between an infant and the person who cares for it is called **attachment**, and studying it changed how the whole world thinks about raising children.

## More than feeding

People used to assume infants love their caregivers simply because they're the source of food — "cupboard love." Then experiments with infant monkeys shattered that idea. Given a choice between a bare wire "mother" that provided milk and a soft cloth "mother" that provided none, the frightened infants clung to the soft one and ran to it for comfort. **Contact and comfort**, not just food, turned out to be the heart of the bond. We are wired to seek closeness, not just calories.

## A secure base

A good attachment works like a **secure base.** Because the caregiver is reliable, the child feels safe enough to wander off, try new things, and learn — knowing there's a safe spot to run back to when the world gets scary. This is why attachment isn't the opposite of independence; it's the *launchpad* for it. The most confident explorers are usually the ones who feel most certain someone has their back.

## Measuring the bond

To study attachment, researchers designed a careful little drama: an infant plays in a room, the caregiver briefly leaves, a stranger appears, and the caregiver returns. The key moment isn't the leaving — it's the **reunion.** A securely attached infant is upset when the caregiver goes but is comforted and soothed on return. Other infants show insecure patterns: some seem indifferent, others can't be calmed. Watching that reunion gives a surprisingly clear window into the relationship.

## Patterns, not destiny

These early patterns matter — secure attachment is linked to easier friendships and steadier emotions later on. But it's important not to overstate it. Attachment can change as relationships change, and one early pattern does not lock in a person's whole future. Like everything in this course, it's a strong influence and a set of odds, not a switch that decides the rest of a life.

## In the real world

The monkey study with the wire and cloth "mothers" is one of the most famous in all of psychology precisely because the result was so clear and so moving: comfort beat food, every time. Around the same time, careful observation of human infants separated from caregivers showed how deeply distressing that loss is — and how much steady, responsive care matters. Together, this work helped end the old advice to handle infants coldly "so they won't get spoiled," and replaced it with something kinder and truer: infants need warmth as surely as they need milk.`,
  },
  {
    slug: "how-children-think",
    title: "How children think",
    weekNumber: 1,
    blurb: "Children don't think like small adults — they think in a genuinely different way that grows in stages.",
    lectureTitle: "1.5 How children think (Piaget and the stages of mind)",
    body: `# How children think

Ask a four-year-old why it gets dark at night and you might hear "so people can sleep." That's not just a wrong fact — it's a glimpse of a whole different *way* of thinking. The great insight of **Jean Piaget** was that children aren't simply adults who know less. Their minds work by different rules, and those rules change in a predictable order as they grow.

## Children build their own understanding

Piaget saw children as little scientists, constantly building and testing their own theories about how the world works. They take in new experiences and fit them into what they already understand — and when something won't fit, they're forced to rebuild their theory into something better. Thinking grows not by adults pouring facts in, but by the child actively making sense of the world, over and over.

## Four big stages

Piaget described thinking as moving through four broad stages. In the **sensorimotor** stage, infants "think" through senses and actions — grabbing, mouthing, banging. In the **preoperational** stage, young children can use words and imagination but reason in ways that look strange to adults. In the **concrete operational** stage, school-age children get logical about real, concrete things. And in **formal operational** thinking, adolescents become able to reason about abstract ideas and "what ifs." The order, Piaget argued, is the same everywhere.

## Why a young child gets fooled

Two classic quirks show how preschoolers think. In **conservation**, pour water from a short, wide glass into a tall, thin one and a young child insists there's now *more* water — they fix on the height and miss that nothing was added or removed. And in **egocentrism**, young children struggle to picture a scene from anyone's viewpoint but their own. These aren't signs of a "dumb" child; they're signs of a mind that hasn't yet built certain logical tools.

## Piaget was right, and incomplete

Later researchers showed Piaget was onto something huge but also got some things wrong — mostly by *underestimating* children. With simpler, friendlier tests, kids often reveal understanding earlier than his tasks suggested, and development turns out to be less neatly step-like than four tidy stages imply. That's science working as it should: a brilliant theory opens the door, and the people who follow refine it.

## In the real world

The water-glass conservation task is so reliable you can almost do it at a birthday party. Show a young child two identical glasses with the same amount of juice, then pour one into a taller, skinnier glass while they watch every drop. Ask which has more, and the preschooler will confidently point to the tall one — "it's bigger!" A year or two later, the very same child will look at you like the question is silly: "It's the same, you just poured it." Nothing changed but the glass; everything changed in the mind.`,
  },
  {
    slug: "language-development",
    title: "Language",
    weekNumber: 1,
    blurb: "Every typical toddler cracks the code of language without lessons — one of the most astonishing feats humans pull off.",
    lectureTitle: "1.6 Language (the astonishing feat every toddler pulls off)",
    body: `# Language

Think about what a three-year-old can do: take a stream of sounds, figure out where the words are, learn thousands of them, and string them into sentences nobody taught them word-by-word — all without a single grammar lesson. No adult could learn a new language that fast. Yet nearly every toddler on Earth does it. How is one of the biggest puzzles in this whole field.

## The same path, everywhere

Children around the world learn language in a strikingly similar order. First **cooing**, then **babbling** ("bababa") that practices the sounds, then first words around the first birthday, then a sudden **word explosion** where new words pour in. Early sentences are **telegraphic** — "want cookie," "doggie gone" — keeping the important words and dropping the rest. This shared timetable, across wildly different languages and cultures, is a big clue that something deep and built-in is at work.

## Built-in or taught?

So is language **nature** or **nurture**? One side argues the human brain comes pre-wired for grammar — that children couldn't possibly learn something so complex so fast unless they were born ready for it. The other side points out that children clearly need to *hear* language: the words and patterns they learn obviously come from the people around them, and children who are talked with more tend to develop language faster. As with everything in this course, the truth lives in the overlap — a prepared brain meeting a world full of talk.

## The mistakes that prove the rule

Here's the most delightful evidence that kids learn *rules*, not just copy phrases: they make errors no adult ever modeled. A child who once correctly said "went" starts saying "goed"; "feet" becomes "foots"; "ran" becomes "runned." Nobody ever says those words to them. The child has figured out the rule — add "-ed," add "-s" — and is over-applying it to words that break the rule. Those "mistakes" are actually a sign of a powerful little mind discovering the hidden logic of language.

## A window that narrows

Language also shows a **sensitive period** — a stretch of childhood when the brain soaks up language with astonishing ease. Young children pick up a language, or two, almost effortlessly; adults grind at it and rarely sound native. Tragic cases of children deprived of any language in early childhood show how hard full language becomes if that early window is missed. The door doesn't slam, but it does narrow with age.

## In the real world

Researchers tested whether kids really learn rules using made-up words. They showed children a cartoon creature and said, "This is a wug." Then they showed two of them: "Now there are two ___?" Without hesitation, little children said "wugs" — adding the plural to a word they had never heard before and that doesn't exist. They couldn't have memorized it; they *applied a rule.* That tiny made-up animal is one of the clearest proofs that toddlers aren't parrots — they're code-breakers.`,
  },
  {
    slug: "the-teenage-brain",
    title: "The teenage brain",
    weekNumber: 1,
    blurb: "Teenagers aren't broken or lazy — their brains are mid-renovation, with the gas pedal wired before the brakes.",
    lectureTitle: "1.7 The teenage brain (why adolescence looks the way it does)",
    body: `# The teenage brain

Adults love to complain about teenagers: moody, impulsive, glued to friends, drawn to risk. It's tempting to write it off as bad attitude or laziness. But brain science tells a more interesting story. The teenage brain isn't broken or finished — it's in the middle of a massive, necessary renovation, and a lot of "teenage behavior" makes sense once you see the construction site.

## Still under construction

For a long time people assumed the brain was basically done by childhood. It isn't. The brain keeps rewiring deep into the **mid-twenties**, getting faster and more efficient. Adolescence isn't a finished product behaving badly; it's a work in progress, pruning unused connections and speeding up the ones that remain. The teenager you know is, quite literally, running on a brain that's still being built.

## The gas pedal and the brakes

The key clue is *which* parts grow up first. The brain's emotional, reward-seeking system — the "gas pedal" that craves excitement, fun, and approval — matures **early**, around puberty. But the **prefrontal cortex** — the "brakes" that handle planning, judgment, and impulse control — matures **last**, into the mid-twenties. For a few years, the gas pedal is floored while the brakes are still being installed. That mismatch, not stupidity, drives a lot of teenage risk-taking.

## Why friends matter so much

Teenagers don't just take more risks; they take far more when **friends are watching.** This isn't simple peer pressure — the teenage brain finds social approval intensely rewarding, so the presence of peers literally cranks up the pull of a risky-but-exciting choice. From the inside, fitting in and seeking thrills feel enormously important, because for the developing brain, they are. Understanding this changes how we should think about teen behavior in groups.

## A feature, not just a bug

Here's the surprise: this design may be useful, not just dangerous. Adolescence is when humans must leave the safety of childhood, try new things, take social risks, and build a life apart from their parents. A brain tuned toward novelty, excitement, and friendship is well-suited to that leap. The same wiring that leads to reckless choices also powers creativity, passion, and the courage to strike out on one's own. The trick is keeping teens safe while the brakes finish installing.

## In the real world

In one clever experiment, teens and adults played a risky driving video game, sometimes alone and sometimes with friends watching. Adults drove about the same either way. But teenagers took **far more risks when peers were present** — running more yellow lights, pushing their luck — even though no one said a word. The mere presence of friends lit up the reward system and tipped the balance toward thrill. It's vivid evidence that the teenage brain isn't just a smaller adult brain; it's tuned to a different, noisier station.`,
  },
  {
    slug: "aging-and-lifespan",
    title: "Aging and the lifespan (capstone)",
    weekNumber: 1,
    blurb: "Development doesn't stop at adulthood — we keep changing, losing some things and gaining others, right to the end.",
    lectureTitle: "1.8 Aging and the lifespan, and what comes next (Capstone)",
    body: `# Aging and the lifespan (capstone)

We end where most people assume development is already over: adulthood and old age. The biggest myth about the lifespan is that growth happens in childhood and then we just slowly run down. The truth is far more interesting — we keep developing until the very end, and later life brings real losses *and* real gains that the science is only now appreciating.

## Development never stops

The whole point of a *lifespan* view is that change is never finished. Adults learn new skills, take on new roles, rebuild after setbacks, and rethink who they are well into old age. Some abilities fade, yes — but others ripen. Treating adulthood as a flat plateau or a long decline misses most of the human story. The same scientific curiosity we aimed at infants belongs on every decade of life.

## Losing some, gaining some

Aging is best understood as a mix of **losses and gains.** Raw mental speed and the ability to juggle brand-new information — sometimes called *fluid* abilities — tend to decline with age. But accumulated knowledge, vocabulary, and hard-won judgment — *crystallized* abilities — often hold steady or keep growing for decades. The older mind is slower at some games and far richer at others. It's not simply "worse"; it's *different*, with a different set of strengths.

## The surprising happiness of later life

Here's a finding that startles almost everyone: older adults, on average, often report being **as happy or happier** than younger ones, and handle their emotions more smoothly. One leading explanation is that when people sense time is more limited, they stop chasing everything and focus on what matters most — close relationships and meaningful moments. The narrowing of time, oddly, sharpens the focus on joy. Aging isn't only a story of decline; for many, it's a story of getting better at living.

## Tying the course together

Look back across all eight topics and one thread runs through them: **resist the simple story.** Development isn't pure nature or pure nurture; infants aren't blank; children don't think like little adults; teenagers aren't just badly behaved; and old age isn't just decline. Again and again, the careful evidence replaces a tidy myth with something richer, stranger, and more humane. That habit — looking past the obvious story to what's really happening — is the most valuable thing to carry out of this course.

## The biggest questions stay open

And plenty remains unsolved. How much can we shape our own development? Why do some people thrive after hardship while others struggle? How do we help every stage of life go well, from the first bond to the last years? Developmental psychology gives us better questions and more honest answers — not final ones. The single habit worth keeping is this: whenever someone offers a simple, certain story about how people grow and change, ask, "Is that real, or is it a myth?"`,
  },
];

type SeedAssignment = {
  kind: "homework" | "test" | "midterm" | "final";
  title: string;
  weekNumber: number;
  isTimed: boolean;
  timeLimitMinutes: number | null;
  instructions: string;
  problems: Array<{
    topicSlug: string;
    prompt: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  }>;
};

const ASSIGNMENTS: SeedAssignment[] = [
  {
    kind: "homework",
    title: "Homework 1.1 — Change, nature & nurture, infants, and attachment",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.1–1.4. Answer each question in a few sentences (about 3–5) in your own words. Explain your thinking clearly. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "what-developmental-psychology-is",
        prompt:
          "A friend says, 'Developmental psychology is just the study of little kids growing up.' Using what the field actually covers, explain why this is too narrow. (3–5 sentences.)",
        correctAnswer:
          "Developmental psychology studies how people change across their entire lives, not just childhood — from before birth all the way to old age. Change never really stops: adults learn new skills, take on new roles, and even old age brings real gains alongside losses. The field also watches three areas at once — physical, cognitive, and social-emotional growth — at every stage, not only in kids. So limiting it to 'little kids growing up' leaves out most of the human story it's actually trying to explain.",
        explanation:
          "Full credit: explains development is lifelong (birth/before birth to old age, change never stops), not just childhood, and may note the three domains across all stages.",
      },
      {
        topicSlug: "nature-vs-nurture",
        prompt:
          "Two people argue: one says 'we're born who we are, it's all genes,' the other says 'we're shaped entirely by how we're raised.' Explain why developmental psychology rejects both extremes. (3–5 sentences.)",
        correctAnswer:
          "Both extremes are incomplete because nature and nurture always work together — it was never one or the other. Genes often set a range of possibilities, and the environment decides where inside that range a person lands, the way good genes set how tall you could grow but nutrition decides how tall you actually get. More than that, the two interact: a child's inborn temperament shapes the experiences they have, and experiences can even change how genes get used. So 'all genes' and 'all upbringing' both miss the real picture, which is the two constantly influencing each other.",
        explanation:
          "Full credit: explains nature and nurture interact rather than compete (genes set a range, environment shapes within it; the two influence each other), so neither extreme is right.",
        hint: "Think about whether genes and environment work in separate boxes, or whether each one shapes the other.",
      },
      {
        topicSlug: "the-infant-mind",
        prompt:
          "Someone says, 'Newborns don't know anything — their minds are totally blank.' Use evidence about the infant mind to explain why this is wrong, and how we can even tell. (3–5 sentences.)",
        correctAnswer:
          "Infants aren't blank; they arrive already prepared for the world, preferring human faces, their mother's voice, and the rhythm of the language they heard in the womb. Even young infants seem to expect objects to be solid and to keep existing when hidden, and they're surprised when those rules are broken. We can tell because infants look longer at things that are new or surprising, so researchers measure where and how long they look to find out what surprises them — without needing a single word. That extra staring at 'impossible' events is the evidence that the infant mind already knows quite a lot.",
        explanation:
          "Full credit: states infants arrive prepared (face/voice preferences, early physical expectations) and explains the looking-time/surprise method as how we know, contradicting the 'blank' claim.",
      },
      {
        topicSlug: "attachment",
        prompt:
          "A relative insists, 'Infants only love whoever feeds them — it's all about the food.' Using what attachment research shows, explain two things this gets wrong. (3–5 sentences.)",
        correctAnswer:
          "First, attachment is about contact and comfort, not just food: given a choice, frightened infant monkeys clung to a soft, cloth 'mother' that gave no milk rather than a bare wire one that did, showing comfort matters more than calories. Second, the bond isn't just sweet dependence — it works as a secure base that actually lets a child explore, because feeling safe gives them the confidence to wander off and learn. So a caregiver provides safety and comfort, which is the heart of the bond, not merely meals. 'It's all about the food' misses both the comfort and the way attachment supports independence.",
        explanation:
          "Full credit: corrects (1) comfort/contact matters more than food (e.g. the cloth vs. wire 'mother') and (2) attachment is a secure base that supports exploration/independence, not just feeding.",
      },
    ],
  },
  {
    kind: "homework",
    title: "Homework 1.2 — Thinking, language, the teenage brain, and aging",
    weekNumber: 1,
    isTimed: false,
    timeLimitMinutes: null,
    instructions:
      "Untimed practice covering sections 1.5–1.8. Answer each question in a few sentences (about 3–5) in your own words. Explain your reasoning. One-word answers won't receive credit.",
    problems: [
      {
        topicSlug: "how-children-think",
        prompt:
          "You pour juice from a short, wide glass into a tall, thin one while a preschooler watches, and they insist the tall glass now has 'more.' Using Piaget's ideas, explain what this shows about how young children think. (3–5 sentences.)",
        correctAnswer:
          "This is the classic conservation task, and the child's answer shows their thinking follows different rules than an adult's, not that they're unintelligent. The preschooler fixes on one feature — the height of the liquid — and misses that nothing was added or removed, so the amount must be the same. Piaget argued children aren't just adults who know less; their minds lack certain logical tools that develop later. A year or two on, the same child will find the question obvious, because their way of thinking will have grown into a new stage.",
        explanation:
          "Full credit: identifies conservation, explains the child centers on one feature (height) and misses that quantity is unchanged, and frames it as children thinking by different rules/stages, not just knowing less.",
      },
      {
        topicSlug: "language-development",
        prompt:
          "A toddler who used to say 'went' starts saying 'goed,' and says 'foots' instead of 'feet' — words no adult ever taught them. Explain why these 'mistakes' are actually a good sign. (3–5 sentences.)",
        correctAnswer:
          "These errors are a sign the child is learning rules, not just copying phrases. Nobody ever says 'goed' or 'foots' to them, so the child can't be imitating — they've figured out the rule (add '-ed' for past tense, '-s' for plural) and are over-applying it to words that happen to break the rule. That shows a powerful little mind discovering the hidden logic of language rather than memorizing each word one by one. So the 'mistake' is really evidence of real grammatical understanding taking shape.",
        explanation:
          "Full credit: explains overregularization — the child applies a learned rule ('-ed'/'-s') to irregular words, which proves rule-learning rather than imitation, hence a positive sign.",
        hint: "Could the child have heard 'goed' from an adult? If not, where did it come from?",
      },
      {
        topicSlug: "the-teenage-brain",
        prompt:
          "A teenager drives carefully alone but takes far more risks when friends are in the car. Using what you know about the teenage brain, explain why, and why calling it 'just bad behavior' misses the point. (3–5 sentences.)",
        correctAnswer:
          "The teenage brain's emotional, reward-seeking 'gas pedal' matures early, while the prefrontal 'brakes' that handle judgment and impulse control mature last, into the mid-twenties — so for a few years the gas pedal is floored before the brakes are fully installed. On top of that, the teenage brain finds social approval intensely rewarding, so the mere presence of friends cranks up the pull of an exciting, risky choice, even with no one saying a word. That's why the same teen drives safely alone but riskily with peers watching. Calling it 'just bad behavior' misses that this is brain development, not a character flaw — and the same wiring also fuels creativity and the courage to grow up.",
        explanation:
          "Full credit: explains the early reward system vs. late-maturing prefrontal control and the heightened reward of peer presence, and reframes it as normal brain development rather than mere misbehavior.",
      },
      {
        topicSlug: "aging-and-lifespan",
        prompt:
          "Someone says, 'After you grow up, it's all downhill — getting older just means everything gets worse.' Explain why developmental psychology sees later life as more than decline. (3–5 sentences.)",
        correctAnswer:
          "Aging is best understood as a mix of losses and gains, not pure decline. Raw mental speed and handling brand-new information tend to fade, but accumulated knowledge, vocabulary, and judgment often hold steady or keep growing for decades. Strikingly, older adults on average often report being as happy or happier than younger people and manage their emotions more smoothly, partly because sensing limited time leads them to focus on what matters most. So later life brings real strengths and even greater well-being, which 'it's all downhill' completely misses.",
        explanation:
          "Full credit: explains aging as losses AND gains (fluid declines but crystallized knowledge holds/grows) and notes the well-being finding (older adults often as happy or happier, focusing on what matters).",
      },
    ],
  },
  {
    kind: "test",
    title: "Unit Test — Basic Developmental Psychology",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 30,
    instructions:
      "Timed. 30 minutes. Covers sections 1.1–1.8. Answer each question in a few sentences (about 4–6) in your own words. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "what-developmental-psychology-is",
        prompt:
          "Explain what developmental psychology is as a science, including the idea that it follows change across the whole lifespan and watches three kinds of growth at once. Why does that broad view matter? (4–6 sentences.)",
        correctAnswer:
          "Developmental psychology is the careful, evidence-based study of how and why people change across their entire lives, from before birth to old age — using observation, experiments, and studies that follow the same people for years rather than relying on common sense about kids. A core idea is the lifespan view: change never stops, so adulthood and old age are part of the story too, not just childhood. At every stage it watches three braided areas at once — physical growth (body and brain), cognitive growth (thinking, memory, language), and social-emotional growth (feelings and relationships). These domains are tangled together, so a single change like learning to crawl ripples across all three. That broad view matters because it keeps us from misjudging people at any age — for example expecting a young child or a teenager to do things their development hasn't made possible yet.",
        explanation:
          "Full credit: defines developmental psychology as the evidence-based study of lifelong change, explains the lifespan view (not just childhood) and the three domains (physical, cognitive, social-emotional), and why the broad view matters.",
      },
      {
        topicSlug: "nature-vs-nurture",
        prompt:
          "Explain why developmental psychology rejects the 'nature vs. nurture' question as an either/or, using the ideas that genes set a range and that nature and nurture interact. (4–6 sentences.)",
        correctAnswer:
          "The either/or is wrong because nature and nurture always work together rather than competing. Genes often set a range of possibilities, and the environment decides where inside that range a person lands — like good genes setting how tall you could grow while nutrition determines how tall you actually become. The deeper point is that the two interact: an inborn temperament shapes the experiences a child has, so a bold infant and a cautious infant pull different environments out of the same parents, and experiences can even change how genes get used. That's why asking 'how much is nature and how much is nurture' is like asking whether a song is more the notes or the playing. Picking a side also causes harm — pure 'nature' breeds hopelessness, pure 'nurture' breeds blame — while the mature view stays both realistic and hopeful.",
        explanation:
          "Full credit: explains nature and nurture interact (genes set a range, environment shapes within it; temperament shapes experiences; experiences affect gene use), so the either/or framing fails.",
      },
      {
        topicSlug: "the-infant-mind",
        prompt:
          "Describe what infants seem to know before they can speak, and explain how researchers can study an infant's mind using looking time and 'surprise.' (4–6 sentences.)",
        correctAnswer:
          "Infants are not blank slates; they arrive already prepared for people and the world, preferring human faces, their mother's voice, and the rhythm of their native language. Even young infants appear to expect objects to be solid and to keep existing when hidden, and some studies suggest they expect simple amounts to add up correctly. Researchers can't ask an infant what it knows, so they read the two things infants control: where they look and for how long. Infants stare longer at events that are new or surprising and look away from boring ones, so showing an infant an 'impossible' event — an object passing through a wall, or one plus one appearing to make one — and measuring the extra staring reveals what the infant expected. That longer look at rule-breaking events is the evidence that the infant mind already tracks the world.",
        explanation:
          "Full credit: describes infant knowledge (face/voice preferences, expecting solidity/permanence) and explains the looking-time/violation-of-expectation method (longer looking at surprising/impossible events) as how we know.",
      },
      {
        topicSlug: "attachment",
        prompt:
          "Explain what attachment is, why comfort matters more than food, and how the 'secure base' idea connects attachment to a child's independence. (4–6 sentences.)",
        correctAnswer:
          "Attachment is the strong emotional bond between an infant and the person who cares for it — a kind of survival system that shapes how we relate to others. It's not just about feeding: experiments with infant monkeys showed that frightened infants clung to a soft, cloth 'mother' that gave no milk rather than a bare wire one that did, so contact and comfort, not just calories, are the heart of the bond. A good attachment works as a 'secure base': because the caregiver is reliable, the child feels safe enough to explore, try new things, and learn, knowing there's a safe spot to return to. That's why attachment isn't the opposite of independence — it's the launchpad for it, since the most confident explorers usually feel most certain someone has their back. These early patterns matter for later life but are influences and odds, not a switch that fixes a child's whole future.",
        explanation:
          "Full credit: defines attachment, explains comfort/contact over food (cloth vs. wire 'mother'), and the secure-base idea linking attachment to confident exploration/independence.",
      },
      {
        topicSlug: "how-children-think",
        prompt:
          "Explain Piaget's central insight that children think differently (not just less), using one concrete example such as conservation or egocentrism, and note one way later researchers refined his theory. (4–6 sentences.)",
        correctAnswer:
          "Piaget's central insight was that children aren't simply adults who know less — their minds work by different rules that change in a predictable order as they grow, and children actively build their own understanding rather than just absorbing facts. Conservation shows this clearly: pour the same juice into a taller, thinner glass and a preschooler insists there's now more, because they fix on the height and miss that nothing was added or removed. Egocentrism is another example — young children struggle to picture a scene from anyone's viewpoint but their own. These aren't signs of a dumb child but of a mind that hasn't yet built certain logical tools, which develop in later stages. Later researchers refined Piaget by showing he often underestimated children: with simpler, friendlier tests, kids reveal understanding earlier than his tasks suggested, and development is less neatly step-like than four tidy stages imply.",
        explanation:
          "Full credit: explains children think by different rules (not just less) and build understanding, gives a valid example (conservation/egocentrism), and notes a refinement (Piaget underestimated kids / stages less rigid).",
      },
      {
        topicSlug: "language-development",
        prompt:
          "Explain why language learning is considered an astonishing feat, and use the example of errors like 'goed' or 'foots' to show that children learn rules rather than just imitating. (4–6 sentences.)",
        correctAnswer:
          "Language learning is astonishing because a young child takes a stream of sounds, figures out where the words are, learns thousands of them, and builds sentences nobody taught word-by-word — all without grammar lessons, and faster than any adult could. Children worldwide follow a strikingly similar path: cooing, babbling, first words, a word explosion, and telegraphic speech like 'want cookie,' which hints at something built in. The clearest proof that they learn rules rather than imitate is errors like 'goed' or 'foots' — words no adult ever says to them. The child has worked out the rule (add '-ed' for past tense, '-s' for plurals) and is over-applying it to words that break the rule. So those 'mistakes' actually reveal a powerful mind discovering the hidden logic of language, not a parrot copying phrases.",
        explanation:
          "Full credit: explains the speed/complexity that makes language learning remarkable (and the shared milestones) and uses overregularization ('goed'/'foots') to show rule-learning rather than imitation.",
      },
      {
        topicSlug: "the-teenage-brain",
        prompt:
          "Explain why the teenage brain leads to more risk-taking, using the 'gas pedal and brakes' idea and the effect of peers, and explain why this design might actually be useful. (4–6 sentences.)",
        correctAnswer:
          "The teenage brain isn't broken or finished — it's still rewiring into the mid-twenties, and the order in which parts mature explains the behavior. The emotional, reward-seeking 'gas pedal' that craves excitement and approval matures early, around puberty, but the prefrontal 'brakes' that handle planning, judgment, and impulse control mature last, so for a few years the gas pedal is floored while the brakes are still being installed. The teenage brain also finds social approval intensely rewarding, so risk-taking jumps when friends are watching, even with no spoken pressure. This design may actually be useful, because adolescence is when humans must leave the safety of childhood, try new things, and build a life apart from their parents. The same wiring that produces reckless choices also powers creativity, passion, and the courage to strike out, so the task is keeping teens safe while the brakes finish installing.",
        explanation:
          "Full credit: explains early reward system vs. late prefrontal control ('gas pedal/brakes'), the heightened effect of peers, and why novelty/risk-seeking is adaptive for becoming independent.",
      },
      {
        topicSlug: "aging-and-lifespan",
        prompt:
          "Explain why developmental psychology treats aging as more than decline, using the idea of losses and gains and the finding about well-being in later life. (4–6 sentences.)",
        correctAnswer:
          "The lifespan view holds that development never stops, so aging is a continuation of change rather than a simple winding down. It's best understood as a mix of losses and gains: raw mental speed and handling brand-new information (fluid abilities) tend to decline, but accumulated knowledge, vocabulary, and judgment (crystallized abilities) often hold steady or keep growing for decades. So the older mind isn't simply 'worse' — it's different, slower at some games and far richer at others. Strikingly, older adults on average often report being as happy or happier than younger people and handle emotions more smoothly, partly because sensing that time is limited leads them to focus on close relationships and meaningful moments. That's why 'it's all downhill' is a myth: later life brings real strengths and, for many, greater well-being.",
        explanation:
          "Full credit: explains the lifespan view (development never stops), aging as losses AND gains (fluid declines, crystallized holds/grows), and the well-being finding (older adults often as happy/happier, focusing on what matters).",
      },
    ],
  },
  {
    kind: "final",
    title: "Final — Basic Developmental Psychology",
    weekNumber: 1,
    isTimed: true,
    timeLimitMinutes: 45,
    instructions:
      "Timed cumulative final. 45 minutes. Covers the whole course (sections 1.1–1.8). Answer each question in a paragraph (about 5–7 sentences) in your own words. Pasting is disabled; keystrokes are screened for AI use.",
    problems: [
      {
        topicSlug: "aging-and-lifespan",
        prompt:
          "Using ideas from across the whole course, argue that one habit of mind — 'resist the simple story' — runs through developmental psychology. Show how it applies to at least three different topics (for example: nature vs. nurture, the 'blank' newborn, love being 'just about food,' children as little adults, the teenage brain, or aging as pure decline). (5–7 sentences.)",
        correctAnswer:
          "The thread running through the whole course is to resist the simple, tidy story and replace it with careful, evidence-based thinking. Nature vs. nurture isn't an either/or: genes set a range and the environment shapes it, and the two constantly interact, so 'all genes' and 'all upbringing' are both wrong. Newborns aren't blank either — looking-time studies show infants already prefer faces and voices and expect objects to be solid, surprising us with how much they know. Children don't think like little adults; conservation and egocentrism show their minds follow genuinely different rules that grow in stages. The same caution undoes the myths that love is just about food (comfort beats calories), that teenagers are simply badly behaved (their brains are mid-renovation), and that old age is pure decline (real gains and even greater well-being appear). That shared habit — looking past the obvious story to what's really happening — is harder than believing a neat myth, but it's what makes the field both honest and humane.",
        explanation:
          "Full credit: states the unifying habit (reject simple stories for evidence) and applies it correctly to at least three distinct course topics with accurate detail.",
      },
      {
        topicSlug: "nature-vs-nurture",
        prompt:
          "Someone insists, 'People are just born the way they are — genes decide everything.' Using evidence and ideas from the course, argue why development is better understood as nature and nurture working together. Use at least one concrete example. (5–7 sentences.)",
        correctAnswer:
          "The 'genes decide everything' view assumes a fixed blueprint, but the evidence shows nature and nurture always work together. Genes typically set a range of possibilities while the environment decides where inside it a person lands — good height genes still need good nutrition to be realized, and a child born to be a strong reader needs a world full of books and talk to get there. The two also interact: an inborn temperament shapes the experiences a child has, so a bold infant and a cautious one draw different environments out of the very same parents, and experiences can even change how genes are used. A striking example is the genetic condition PKU, where a single faulty gene once caused serious intellectual disability — yet the harm only happens if the child eats a certain substance, so a simple change in diet (nurture) lets development proceed normally. One gene, one environmental change, and the whole outcome flips. That's why 'genes decide everything' mistakes a starting point for a finished story.",
        explanation:
          "Full credit: rejects pure genetic determinism, explains genes-set-a-range plus interaction, and supports it with a concrete example (e.g. PKU diet, or height/reading) showing environment changes the outcome.",
      },
      {
        topicSlug: "attachment",
        prompt:
          "A parent worries that comforting their infant too much will 'spoil' it and make it clingy and dependent. Using what the course shows about attachment, explain why this worry gets the science backwards. Use a concrete example or study. (5–7 sentences.)",
        correctAnswer:
          "This worry gets the science backwards, because warm, responsive care doesn't create a clingy child — it builds the security that makes a child brave. Attachment is the strong bond between an infant and caregiver, and research shows it rests on contact and comfort, not just feeding: frightened infant monkeys clung to a soft, cloth 'mother' that gave no milk rather than a bare wire one that did, proving comfort matters more than calories. A good attachment works as a 'secure base' — because the caregiver is reliable, the child feels safe enough to explore, try new things, and learn, knowing there's a safe spot to return to. So attachment isn't the opposite of independence; it's the launchpad for it, and the most confident explorers tend to be the ones most sure someone has their back. This is exactly why the old advice to handle infants coldly 'so they won't be spoiled' was abandoned in favor of warmth. Comforting an infant builds confidence, not dependence.",
        explanation:
          "Full credit: explains comfort/contact over food (cloth vs. wire 'mother') and the secure-base idea that responsive care supports exploration/independence, correcting the 'spoiling' myth, with a concrete example.",
      },
      {
        topicSlug: "the-teenage-brain",
        prompt:
          "A lawmaker argues, 'Teenagers who take dangerous risks are just bad kids who should know better.' Using the course, explain why brain development offers a fairer and more accurate account. Use a concrete example or study. (5–7 sentences.)",
        correctAnswer:
          "Calling risk-taking teens 'bad kids' misreads what's actually happening in the developing brain. The teenage brain isn't broken or finished — it keeps rewiring into the mid-twenties, and the parts don't mature at the same time. The emotional, reward-seeking 'gas pedal' that craves excitement and approval matures early, while the prefrontal 'brakes' for planning, judgment, and impulse control mature last, so for a few years the gas pedal is floored before the brakes are installed. The teenage brain also finds social approval intensely rewarding, which is why risk jumps when peers are present: in one experiment, teens took far more risks in a driving game when friends were watching, while adults drove about the same either way. That's not a character flaw but normal, temporary brain development — and the same wiring toward novelty and friendship also fuels creativity and the courage to grow up. A fairer response keeps teens safe while the brakes finish installing, rather than simply branding them 'bad.'",
        explanation:
          "Full credit: explains early reward system vs. late prefrontal control and the heightened effect of peers (e.g. the driving-game study), reframes risk as normal development rather than 'bad kids,' and may note its adaptive side.",
      },
    ],
  },
];

type SeedPrimer = SeedTopic;

const REASONING_PRIMERS: SeedPrimer[] = [
  {
    slug: "reasoning-primer-subject",
    title: "How to reason about developmental psychology cases",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: applying the course's ideas to concrete developmental-psychology situations.",
    lectureTitle: "Primer: How to reason about developmental psychology cases",
    body: `# How to reason about developmental psychology cases

This short primer prepares you for the **Developmental Psychology** diagnostic. That check is *ungraded practice* — it never affects your course grade. It is drawn from the eight topics of this unit and asks you to *apply* what you have learned to a specific situation, not to recite a definition.

## It tests application, not memorization

A diagnostic question gives you a small, concrete scene — an infant, a preschooler, a teenager, an aging adult — and asks what the course's ideas tell you about it. Knowing the word "object permanence" or "attachment" is not enough; the question wants you to recognize *when* you are looking at one and *why* it matters here.

## What the questions reward

- **Naming the right idea** — match the situation to the concept that fits it: whether a behavior reflects nature, nurture, or both; what infants already know; how children think differently; how language is learned; why teenagers take risks; how aging brings gains as well as losses.
- **Using evidence from the scene** — point to the detail in the situation that supports your answer, rather than answering from a general impression.
- **Avoiding the simple story** — the course replaces tidy myths with careful explanation. The best answers resist "it's all genes," "infants know nothing," or "it's all downhill," and stay grounded in the science.

## How to do this activity well

1. **Read the situation first**, then ask which topic it belongs to.
2. **Find the detail that decides it** — what in the scene makes one answer better than another.
3. For written items, **give the core idea in a sentence or two** — clear and correct beats long and padded.

Take it as often as you like; the questions are freshly generated every time, and there is no penalty for any answer.`,
  },
  {
    slug: "reasoning-primer-general",
    title: "Core reasoning skills",
    weekNumber: 1,
    blurb:
      "Diagnostic primer: analysis, inference, evaluation, deduction, and induction.",
    lectureTitle: "Primer: Core reasoning skills",
    body: `# Core reasoning skills

This short primer prepares you for the **General Reasoning** diagnostic — an *ungraded* check that tests five genuine reasoning skills. These are the same skills you use to decide what a set of facts really shows, so they matter directly for thinking clearly about how people grow and change.

## The five skills

- **Analysis** — break an argument into parts: find its **point** (the conclusion), the **reasons** given for it, and any hidden assumption it leans on. Ask: "What is this trying to convince me of, and what does it take for granted?"
- **Inference** — work out what *follows* from what you're told, and how strongly. Tell apart what *must* be true, what is *likely*, and what is only *possible*.
- **Evaluation** — judge how much the reasons actually support the point. Notice when evidence is beside the point, a source isn't trustworthy, or a step doesn't really connect.
- **Deduction** — reasoning where true starting facts *guarantee* the conclusion. If the starting facts are true, the conclusion can't be false. Watch for sneaky forms that only *look* airtight.
- **Induction** — reasoning from a few examples to a *probable* general rule or prediction. Strong induction uses many fair examples; weak induction over-generalizes from too few.

## A recurring trap: things that move together

Most wrong answers are statements that *sound* reasonable but are **not actually backed up by what you were told**. The discipline this check rewards is the same one careful thinking about human development demands: keep apart what the facts **show**, what you're **assuming**, and what only *sounds* right. Two things happening together does not prove one causes the other.

## How to do this activity well

1. Find the **point** (conclusion) first, then the reasons.
2. Ask which of the five skills the question is testing (a hidden-assumption question is analysis; a "what follows" question is inference or deduction; a "how good is this reasoning" question is evaluation).
3. Pick the option that follows **only** from what you were given — not the one that merely sounds true or appealing.

Take it as often as you like; the questions are freshly generated every time, and it never affects your grade.`,
  },
];

// Insert any teaching-to-the-test primer lectures whose slug is not yet present.
// Safe to run on every boot: it only adds what is missing.
export async function seedReasoningPrimersIfMissing(): Promise<void> {
  const currentSlugs = REASONING_PRIMERS.map((p) => p.slug);
  // Remove any obsolete primer topics from earlier diagnostic models (their
  // lectures cascade-delete), so renamed/retired primers self-heal instead of
  // stranding stale content in existing or republished databases.
  const stale = await db
    .delete(topicsTable)
    .where(
      and(
        like(topicsTable.slug, "reasoning-primer-%"),
        notInArray(topicsTable.slug, currentSlugs),
      ),
    )
    .returning({ slug: topicsTable.slug });
  if (stale.length > 0) {
    logger.info(
      { removed: stale.map((s) => s.slug) },
      "Reasoning primers: removed obsolete primers",
    );
  }
  let added = 0;
  for (let i = 0; i < REASONING_PRIMERS.length; i++) {
    const t = REASONING_PRIMERS[i]!;
    const existing = await db
      .select({ id: topicsTable.id })
      .from(topicsTable)
      .where(eq(topicsTable.slug, t.slug));
    if (existing.length > 0) continue;
    const [inserted] = await db
      .insert(topicsTable)
      .values({
        slug: t.slug,
        title: t.title,
        weekNumber: t.weekNumber,
        blurb: t.blurb,
        position: 900 + i,
      })
      .returning();
    if (!inserted) throw new Error(`Failed to insert primer ${t.slug}`);
    await db.insert(lecturesTable).values({
      topicId: inserted.id,
      weekNumber: t.weekNumber,
      title: t.lectureTitle,
      body: t.body,
    });
    added += 1;
  }
  if (added > 0) {
    logger.info({ added }, "Reasoning primers seeded");
  } else {
    logger.info("Reasoning primers: already present, skipping");
  }
}

export async function seedIfEmpty(): Promise<void> {
  // The course was migrated to the Basic Developmental Psychology
  // syllabus. Detect the marker topic; if present and the content version
  // matches, the content is current and we skip. This makes the seed
  // self-healing across environments: a database that still holds older content
  // (e.g. a previous curriculum) is detected and replaced on boot.
  const markerTopic = await db
    .select({ id: topicsTable.id })
    .from(topicsTable)
    .where(eq(topicsTable.slug, "what-developmental-psychology-is"));
  // Read the stored content version. Tolerate the seed_meta table not yet
  // existing (e.g. a boot that races ahead of schema migration): treat that as
  // "no version recorded", which forces a reseed once the table is present.
  let currentVersion: string | null = null;
  try {
    const storedVersion = await db
      .select({ value: seedMetaTable.value })
      .from(seedMetaTable)
      .where(eq(seedMetaTable.key, "content_version"));
    currentVersion = storedVersion[0]?.value ?? null;
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Seed: seed_meta unavailable, treating version as unset");
    currentVersion = null;
  }
  if (markerTopic.length > 0 && currentVersion === SEED_CONTENT_VERSION) {
    logger.info("Seed: course content present and current, skipping");
    return;
  }
  if (markerTopic.length > 0) {
    logger.warn(
      { storedVersion: currentVersion, expected: SEED_CONTENT_VERSION },
      "Seed: course content present but out of date — re-seeding with the current curriculum",
    );
  }

  // No current content. Either the database is empty (fresh) or it still holds
  // an older curriculum. Do the (optional) wipe and the full reseed in a SINGLE
  // transaction so the marker topic only ever becomes visible once the entire
  // curriculum has committed. A crash mid-seed rolls back, so the next boot
  // retries instead of leaving partial content that the marker check would
  // wrongly treat as healthy. TRUNCATE also takes an ACCESS EXCLUSIVE lock, so
  // concurrent readers never observe a half-empty course during the replace
  // window. The diagnostic tables are truncated here too so the (non
  // version-gated) diagnostic seed repopulates them with the current content on
  // the same boot.
  await db.transaction(async (tx) => {
    const existing = await tx.execute(sql`select count(*)::int as n from topics`);
    const row = (existing.rows[0] ?? {}) as { n?: number };
    if ((row.n ?? 0) > 0) {
      logger.warn(
        "Seed: stale course content detected — replacing with the Basic Developmental Psychology curriculum",
      );
      await tx.execute(
        sql`TRUNCATE TABLE answers, attempts, practice_attempts, practice_problems, practice_sessions, problems, assignments, lectures, topics, diagnostic_responses, diagnostic_attempts, diagnostic_items, diagnostic_assessments RESTART IDENTITY CASCADE`,
      );
    } else {
      logger.info("Seed: populating course content");
    }

    // Topics + lectures
    const slugToTopicId = new Map<string, number>();
    for (let i = 0; i < TOPICS.length; i++) {
      const t = TOPICS[i]!;
      const [inserted] = await tx
        .insert(topicsTable)
        .values({
          slug: t.slug,
          title: t.title,
          weekNumber: t.weekNumber,
          blurb: t.blurb,
          position: i,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert topic ${t.slug}`);
      slugToTopicId.set(t.slug, inserted.id);
      await tx.insert(lecturesTable).values({
        topicId: inserted.id,
        weekNumber: t.weekNumber,
        title: t.lectureTitle,
        body: t.body,
      });
    }

    // Assignments + problems
    for (let i = 0; i < ASSIGNMENTS.length; i++) {
      const a = ASSIGNMENTS[i]!;
      const [inserted] = await tx
        .insert(assignmentsTable)
        .values({
          kind: a.kind,
          title: a.title,
          weekNumber: a.weekNumber,
          position: i,
          isTimed: a.isTimed,
          timeLimitMinutes: a.timeLimitMinutes,
          instructions: a.instructions,
        })
        .returning();
      if (!inserted) throw new Error(`Failed to insert assignment ${a.title}`);
      for (let p = 0; p < a.problems.length; p++) {
        const prob = a.problems[p]!;
        const topicId = slugToTopicId.get(prob.topicSlug);
        if (!topicId) throw new Error(`Unknown topic slug ${prob.topicSlug}`);
        await tx.insert(problemsTable).values({
          assignmentId: inserted.id,
          topicId,
          position: p,
          prompt: prob.prompt,
          correctAnswer: prob.correctAnswer,
          explanation: prob.explanation,
          hint: prob.hint ?? null,
        });
      }
    }

    // Stamp the content version last, inside the same transaction, so the
    // marker check on the next boot only treats the course as "current" once
    // the entire curriculum has committed.
    await tx
      .insert(seedMetaTable)
      .values({ key: "content_version", value: SEED_CONTENT_VERSION })
      .onConflictDoUpdate({
        target: seedMetaTable.key,
        set: { value: SEED_CONTENT_VERSION, updatedAt: new Date() },
      });
  });

  logger.info(
    { topics: TOPICS.length, assignments: ASSIGNMENTS.length, version: SEED_CONTENT_VERSION },
    "Seed complete",
  );
}
