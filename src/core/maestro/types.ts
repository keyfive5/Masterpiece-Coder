/**
 * Maestro — the native intelligence of Masterpiece Coder.
 *
 * Everything in this folder runs locally, deterministically and without a
 * network. It exists because a language model given four words ("make a dance
 * game") has to invent the other 95% of the requirement, and inventing badly is
 * how you get a rhythm game whose arrows spawn on the hit line.
 *
 * Maestro does that inventing on purpose, from a knowledge base, and then
 * checks the result. It sits either side of whichever AI is doing the writing:
 *
 *     prompt → compile → brief ──▶ external AI (or the native synthesiser)
 *                                        │
 *                                        ▼
 *                          critic → repair → critic → done
 *
 * These types are the vocabulary shared by all of it.
 */

/** The broad shape of the thing being asked for. Drives tone and structure. */
export type ProjectKind = 'game' | 'app' | 'site' | 'tool' | 'viz' | 'story';

/**
 * Which family of the native synthesiser can build this archetype. Archetypes
 * without a bespoke generator still fall to their family's generator, which
 * produces a complete, themed, working project rather than a stub.
 */
export type SynthFamily = 'arcade' | 'board' | 'crud' | 'utility' | 'marketing' | 'canvas';

export type Severity = 'blocker' | 'major' | 'minor';

/** A named way this kind of project usually goes wrong, and the fix. */
export interface Pitfall {
  id: string;
  /** What the user experiences when it happens. */
  symptom: string;
  /** What to do instead — written as an instruction, not a description. */
  fix: string;
}

/** Everything Maestro knows about one kind of project. */
export interface Archetype {
  id: string;
  label: string;
  kind: ProjectKind;
  family: SynthFamily;
  /**
   * Phrases that indicate this archetype. Multi-word phrases score higher than
   * single words automatically, so "tower defense" beats a stray "tower".
   */
  triggers: string[];
  /** One sentence: what this thing is, for the brief. */
  summary: string;
  /** Requirements a competent build satisfies. Written as directives. */
  mustHave: string[];
  /** The failure modes worth naming up front. */
  pitfalls: Pitfall[];
  /**
   * Concrete numbers with the reasoning attached. This is the single highest
   * value thing in the knowledge base: a model told "give the player reaction
   * time" still guesses, a model told "spawn at x = width + 60 travelling at
   * 240 px/s, which is 2.7 s of warning at 900 px" does not.
   */
  tuning: string[];
  /** Critic rule ids that must pass before this archetype is considered done. */
  checks: string[];
  /** Suggested file manifest — path, then what lives in it. */
  files?: Array<[string, string]>;
}

/** What the intent compiler produces from a raw sentence. */
export interface Spec {
  /** The user's words, untouched. */
  raw: string;
  title: string;
  slug: string;
  kind: ProjectKind;
  archetype: string;
  archetypeLabel: string;
  /** 0–1. Below ~0.35 Maestro says so rather than pretending. */
  confidence: number;
  /** What the thing is *about* — "space", "cats", "a bakery". */
  subject: string;
  subjectWords: string[];
  /** Detected style words, strongest first. */
  mood: string[];
  /** Feature ids the user asked for, explicitly or by implication. */
  features: string[];
  /** Features the user explicitly ruled out. */
  excluded: string[];
  /** Nouns that look like the data the app is about. */
  entities: string[];
  constraints: Constraints;
  /** Sentences from the prompt that read as hard requirements. */
  verbatim: string[];
  /** Genuinely ambiguous points, if any — surfaced rather than guessed. */
  unknowns: string[];
  /** True when the prompt is a change to existing work, not a new build. */
  isEdit: boolean;
}

export interface Constraints {
  /** No build step available — the browser host. */
  noBuild: boolean;
  /** Everything in one HTML file. */
  singleFile: boolean;
  /** Must work on a phone. Default true; nearly everything is used on one. */
  mobile: boolean;
  /** Must work with no network after load. */
  offline: boolean;
  /** A framework was named. Recorded even when it cannot be honoured. */
  framework: string | null;
  /** The user asked for dark or light explicitly. */
  scheme: 'dark' | 'light' | null;
}

/** One step of the build plan, with the condition that decides it is finished. */
export interface Milestone {
  text: string;
  /** How you know it is actually done — not "wrote the file". */
  acceptance: string;
}

export interface BuildPlan {
  milestones: Milestone[];
  /** Files worth existing, with their responsibility. */
  manifest: Array<[string, string]>;
  /** The single sentence that defines success. */
  definitionOfDone: string;
}

/** A colour + type + spacing system, chosen deterministically per project. */
export interface DesignSystem {
  id: string;
  name: string;
  mood: string;
  scheme: 'dark' | 'light';
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    ink: string;
    inkDim: string;
    line: string;
    accent: string;
    accentInk: string;
    accent2: string;
    good: string;
    bad: string;
  };
  fonts: { display: string; body: string; mono: string; scale: number };
  radius: string;
  shadow: string;
  motion: string;
  /** Human words for the brief: "ink on bone, one warm accent". */
  notes: string;
}

/** One thing wrong with the built project. */
export interface Finding {
  /** Critic rule id — stable, so tests can assert on it. */
  rule: string;
  severity: Severity;
  path: string;
  line?: number;
  /** What is wrong, in the user's language. */
  message: string;
  /** What to do about it, addressed to whoever is fixing it. */
  fix: string;
}

/** The complete package Maestro hands to whoever is building. */
export interface Brief {
  spec: Spec;
  design: DesignSystem;
  plan: BuildPlan;
  archetype: Archetype;
  /** The markdown block injected into the system prompt. */
  text: string;
}
