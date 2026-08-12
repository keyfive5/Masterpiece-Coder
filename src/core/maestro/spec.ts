import { ARCHETYPES, FEATURES, MOODS, archetypeById } from './knowledge';
import { Constraints, ProjectKind, Spec } from './types';

/**
 * The intent compiler.
 *
 * Turns "make me a neon dance game about space, no sound" into a structured
 * specification: archetype, subject, mood, features, exclusions, constraints
 * and the things it is genuinely unsure about.
 *
 * It is deliberately not a language model. It is a scored phrase matcher over a
 * curated vocabulary, which means it is instant, free, offline, and — most
 * usefully — the same sentence always compiles to the same spec, so a build can
 * be reproduced and a bug in the understanding can be found and fixed.
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'to', 'of', 'in', 'on', 'at', 'by',
  'for', 'with', 'from', 'as', 'is', 'are', 'was', 'be', 'been', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'me', 'my', 'mine', 'we', 'our', 'you', 'your', 'they', 'them',
  'make', 'makes', 'making', 'made', 'build', 'building', 'create', 'creating', 'created',
  'write', 'writing', 'code', 'coding', 'develop', 'design', 'do', 'does', 'can', 'could',
  'would', 'should', 'will', 'want', 'wants', 'need', 'needs', 'please', 'thanks', 'thank',
  'like', 'some', 'something', 'thing', 'things', 'new', 'nice', 'good', 'great', 'best',
  'really', 'very', 'just', 'also', 'about', 'using', 'use', 'uses', 'have', 'has', 'had',
  'where', 'when', 'which', 'what', 'who', 'how', 'lets', 'let', 'up', 'out', 'me', 'us',
  'project', 'website', 'webpage', 'page', 'site', 'app', 'application', 'program', 'software',
  'simple', 'basic', 'small', 'quick', 'little', 'full', 'complete', 'working', 'proper',
]);

const EDIT_OPENERS = [
  'add', 'change', 'fix', 'update', 'remove', 'delete', 'rename', 'move', 'refactor',
  'improve', 'tweak', 'adjust', 'also', 'now ', 'instead', 'can you make it', 'make it',
  'it should', 'the button', 'the game', 'why', 'it doesn', 'it does not', 'broken',
];

const FRAMEWORKS = ['react', 'vue', 'svelte', 'angular', 'next.js', 'nextjs', 'tailwind', 'typescript', 'node', 'express', 'python', 'flask', 'django'];

/**
 * Style words that are also things a project can be *about*. "Neon" only
 * describes a look; "space" is the subject of half the games ever made.
 */
const SUBJECT_WORTHY = new Set([
  'space', 'galaxy', 'stars', 'astronomy', 'forest', 'nature', 'night', 'cyber',
  'arcade', 'pixel', 'magazine', 'newspaper', 'shadow', 'craft', 'business',
]);

/** Lowercase, punctuation to spaces, collapsed — with sentinel spaces for phrase matching. */
function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z0-9+.#\s-]/g, ' ').replace(/\s+/g, ' ').trim()} `;
}

function has(haystack: string, phrase: string): boolean {
  return haystack.includes(` ${phrase} `) || haystack.includes(` ${phrase}s `) || haystack.startsWith(`${phrase} `);
}

/**
 * Multi-word triggers are worth much more than single words: "tower defense"
 * should beat a stray "tower", and "brick breaker" should beat "game".
 */
function triggerWeight(trigger: string): number {
  const words = trigger.split(' ').length;
  return words * words + 1;
}

/** The clauses the user negated, so "no sound" does not become a sound feature. */
function negatedSpans(haystack: string): string[] {
  const spans: string[] = [];
  const patterns = [/\bno ([a-z0-9 -]{2,28})/g, /\bwithout ([a-z0-9 -]{2,28})/g, /\bdon'?t (?:want|need|add) ([a-z0-9 -]{2,28})/g, /\bnot? (?:need|want) ([a-z0-9 -]{2,28})/g];
  for (const pattern of patterns) {
    for (const match of haystack.matchAll(pattern)) spans.push(` ${match[1].trim()} `);
  }
  return spans;
}

/** Sentences that read as hard requirements rather than description. */
function verbatimRequirements(raw: string): string[] {
  const out: string[] = [];
  for (const piece of raw.split(/(?<=[.!?;])\s+|\n+/)) {
    const clause = piece.trim();
    if (clause.length < 8 || clause.length > 240) continue;
    if (/\b(must|should|make sure|has to|needs? to|it should|don'?t|do not|never|always|only|except)\b/i.test(clause)) {
      out.push(clause.replace(/\s+/g, ' '));
    }
  }
  return out.slice(0, 8);
}

function titleCase(words: string[]): string {
  return words
    .map((w) => (w.length <= 2 && /^(of|in|on|to|a)$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'project';
}

export interface CompileOptions {
  /** False for the web host, where nothing can be compiled or installed. */
  canRunCommands: boolean;
  /** Whether the project already has files — decides new build versus edit. */
  hasFiles: boolean;
}

export function compileSpec(prompt: string, options: CompileOptions): Spec {
  const raw = prompt.trim();
  const hay = normalise(raw);
  const negated = negatedSpans(hay);
  const isNegated = (phrase: string) => negated.some((span) => span.includes(phrase));

  /* -------- archetype ------------------------------------------------- */

  let best = { id: 'generic-app', score: 0, matched: [] as string[] };
  let runnerUp = 0;

  for (const archetype of ARCHETYPES) {
    let score = 0;
    const matched: string[] = [];
    for (const trigger of archetype.triggers) {
      if (!has(hay, trigger)) continue;
      matched.push(trigger);
      let weight = triggerWeight(trigger);
      // A trigger in the first few words is much more likely to be the subject
      // of the sentence than one mentioned in passing at the end.
      if (hay.indexOf(` ${trigger} `) < 24) weight += 2;
      score += weight;
    }
    // The generic buckets exist as a floor, not as competitors. "Landing page"
    // is the catch-all for sites, so it must lose to anything more specific:
    // "website for my bakery" is a local business page, not a generic one.
    if (archetype.id.startsWith('generic')) score *= 0.35;
    else if (archetype.id === 'landing') score *= 0.6;
    if (score > best.score) {
      runnerUp = best.score;
      best = { id: archetype.id, score, matched };
    } else if (score > runnerUp) {
      runnerUp = score;
    }
  }

  const archetype = archetypeById(best.id);

  // Confidence falls both when nothing matched and when two archetypes matched
  // equally — "a quiz game about snakes" genuinely is ambiguous.
  const raw01 = best.score / (best.score + 4);
  const separation = best.score === 0 ? 0 : 1 - runnerUp / (best.score + 0.001);
  const confidence = Math.max(0, Math.min(1, raw01 * (0.55 + 0.45 * separation)));

  /* -------- kind ------------------------------------------------------ */

  let kind: ProjectKind = archetype.kind;
  if (best.score < 3) {
    // Nothing specific matched: fall back to the broad word, if there is one.
    if (/\bgame\b|\bplay\b/.test(hay)) kind = 'game';
    else if (/\b(site|website|landing|page|blog|portfolio)\b/.test(hay)) kind = 'site';
    else if (/\b(dashboard|chart|graph|visuali[sz])/.test(hay)) kind = 'viz';
    else if (/\b(story|adventure|interactive fiction)\b/.test(hay)) kind = 'story';
  }

  /* -------- mood ------------------------------------------------------ */

  const mood: string[] = [];
  for (const [name, words] of Object.entries(MOODS)) {
    if (words.some((w) => has(hay, w)) && !mood.includes(name)) mood.push(name);
  }

  /* -------- features -------------------------------------------------- */

  const features: string[] = [];
  const excluded: string[] = [];
  for (const feature of FEATURES) {
    const hit = feature.triggers.find((t) => has(hay, t));
    if (!hit) continue;
    if (isNegated(hit)) excluded.push(feature.id);
    else features.push(feature.id);
  }

  // Things every project of this kind gets whether or not they were asked for.
  const implied = kind === 'game' ? ['score', 'highscore', 'sound'] : kind === 'app' ? ['save'] : [];
  for (const id of implied) {
    if (!features.includes(id) && !excluded.includes(id)) features.push(id);
  }

  /* -------- constraints ----------------------------------------------- */

  const framework = FRAMEWORKS.find((f) => has(hay, f)) ?? null;
  const constraints: Constraints = {
    noBuild: !options.canRunCommands,
    singleFile: /\b(single file|one file|one html file|single html)\b/.test(hay),
    mobile: !/\bdesktop only\b/.test(hay),
    offline: features.includes('offline') || /\b(offline|no internet|without internet)\b/.test(hay),
    framework,
    scheme: /\bdark (mode|theme|version)?\b/.test(hay) && !/\blight\b/.test(hay) ? 'dark' : /\blight (mode|theme)\b/.test(hay) ? 'light' : null,
  };

  /* -------- subject and entities -------------------------------------- */

  const triggerWords = new Set<string>();
  for (const t of archetype.triggers) for (const w of t.split(' ')) triggerWords.add(w);
  for (const f of FEATURES) for (const t of f.triggers) for (const w of t.split(' ')) triggerWords.add(w);
  for (const words of Object.values(MOODS)) for (const w of words) triggerWords.add(w);
  // Some style words are also perfectly good subjects — "a snake game about
  // space" is about space, and stripping it would lose the whole idea.
  for (const word of SUBJECT_WORTHY) triggerWords.delete(word);

  const subjectWords: string[] = [];
  for (const word of hay.trim().split(' ')) {
    const w = word.replace(/^-+|-+$/g, '');
    if (w.length < 3 || STOPWORDS.has(w) || triggerWords.has(w) || /^\d+$/.test(w)) continue;
    if (!subjectWords.includes(w)) subjectWords.push(w);
  }

  const subject = subjectWords.slice(0, 3).join(' ');
  const entities = subjectWords.slice(0, 6);

  /* -------- title ----------------------------------------------------- */

  // With a subject, the title is that subject plus what the thing is: "Space
  // snake". Without one — because every meaningful word went into identifying
  // the archetype — the words the user actually typed are the better name:
  // "website for my bakery" should produce "Bakery", not the archetype's label.
  const titleWords = subjectWords.slice(0, 2);
  const namedInPrompt = best.matched.slice().sort((a, b) => b.length - a.length)[0];
  const title = titleWords.length
    ? titleCase([...titleWords, ...(archetype.id.startsWith('generic') ? [] : [archetype.label.toLowerCase()])])
    : namedInPrompt
      ? titleCase(namedInPrompt.split(' '))
      : archetype.label;

  /* -------- unknowns -------------------------------------------------- */

  const unknowns: string[] = [];
  if (confidence < 0.34) {
    unknowns.push('The prompt does not clearly name a kind of project, so the shape below is an interpretation — say if it is wrong.');
  }
  if (framework && constraints.noBuild) {
    unknowns.push(`${framework} was mentioned, but this host has no build step. Building it as plain HTML, CSS and JavaScript instead — it will still run everywhere.`);
  }
  if (features.includes('auth')) {
    unknowns.push('Accounts were mentioned. There is no server here, so sign-in can only be a demonstration — it will be labelled as such rather than faked.');
  }
  if (features.includes('realtime') && !/(open-meteo|openmeteo)/.test(hay)) {
    unknowns.push('Live data was mentioned. Only keyless, CORS-friendly APIs can work from a page like this; anything else needs a key you would have to supply.');
  }

  /* -------- edit or new build ----------------------------------------- */

  const opener = hay.trim().slice(0, 32);
  const isEdit = options.hasFiles && EDIT_OPENERS.some((verb) => opener.startsWith(verb));

  return {
    raw,
    title,
    slug: slugify(title),
    kind,
    archetype: archetype.id,
    archetypeLabel: archetype.label,
    confidence: Number(confidence.toFixed(2)),
    subject,
    subjectWords,
    mood,
    features,
    excluded,
    entities,
    constraints,
    verbatim: verbatimRequirements(raw),
    unknowns,
    isEdit,
  };
}

/** A one-line description used in activity labels and commit messages. */
export function describeSpec(spec: Spec): string {
  const bits = [spec.archetypeLabel.toLowerCase()];
  if (spec.subject) bits.unshift(spec.subject);
  if (spec.mood.length) bits.push(`(${spec.mood[0]})`);
  return bits.join(' ');
}
