import { renderBaseCss } from '../design';
import { archetypeById } from '../knowledge';
import { DesignSystem, Spec } from '../types';
import { calculator, drawing, listApp, timer } from './apps';
import { dashboard } from './dashboard';
import { ENGINE_JS } from './engine';
import { breakout, flappy, maze, Piece, pong, rhythm, runner, shooter, snake } from './games';
import { memory, QUIZ_QUESTIONS, quiz, sliding, tictactoe } from './puzzles';
import { landing, resume } from './sites';

/**
 * The native synthesiser.
 *
 * This is Maestro building something entirely on its own — no model, no
 * network, no key, no waiting. It is what makes "type an idea, watch it become
 * code" true even on a plane, and it is the safety net when a language model
 * produces nothing.
 *
 * It is not a template library. The design system, the copy, the titles, the
 * storage keys and the difficulty all come from the compiled spec, and every
 * generator is written against the numbers in knowledge.ts — which is why the
 * output passes the same critic that judges the models.
 */

export interface SynthProject {
  files: Record<string, string>;
  /** The archetype actually generated — not always the one requested. */
  builtArchetype: string;
  /** Set when a different kind of thing was asked for and could not be built. */
  substitutedFor: string | null;
  /** Steps for the plan panel, in build order. */
  plan: string[];
  /** What to tell the user at the end. */
  summary: string;
  /** The decisions worth stating — usually the numbers. */
  notes: string[];
  howTo: string[];
}

type Generator = (spec: Spec, design: DesignSystem) => Piece;

/**
 * Archetypes with a generator written specifically for them. Nothing goes in
 * here that would produce something the label does not describe.
 */
const BY_ARCHETYPE: Record<string, Generator> = {
  snake,
  breakout,
  pong,
  flappy,
  runner,
  shooter,
  rhythm,
  maze,
  memory,
  tictactoe,
  '2048': sliding,
  quiz,
  todo: listApp,
  'generic-app': listApp,
  calculator,
  timer,
  drawing,
  dashboard,
  landing,
  portfolio: landing,
  restaurant: landing,
  event: landing,
  ecommerce: landing,
  resume,
};

/**
 * The closest thing the builder can actually make, for everything else. Every
 * one of these is announced to the user rather than passed off as the real
 * thing — a memory game presented as Tetris would be worse than no Tetris.
 */
const SUBSTITUTE: Record<string, string> = {
  platformer: 'runner',
  towerdefense: 'shooter',
  tetris: '2048',
  clicker: '2048',
  minesweeper: 'memory',
  simon: 'memory',
  wordguess: 'quiz',
  typing: 'quiz',
  flashcards: 'quiz',
  converter: 'calculator',
  notes: 'todo',
  habit: 'todo',
  kanban: 'todo',
  budget: 'todo',
  chatui: 'todo',
  gallery: 'todo',
  musicplayer: 'todo',
  markdown: 'todo',
  weather: 'todo',
  blog: 'landing',
  docs: 'landing',
};

/** The last resort, by family. */
const FAMILY_ARCHETYPE: Record<string, string> = {
  arcade: 'runner',
  board: 'memory',
  crud: 'todo',
  utility: 'calculator',
  marketing: 'landing',
  canvas: 'drawing',
};

/**
 * Which archetype the synthesiser can actually build for this request. When it
 * is not the one asked for, everything downstream — the title, the README, the
 * summary and the review — is about what was really built, not what was hoped
 * for. Claiming to have built Tetris and shipping a memory game would be worse
 * than saying so.
 */
export function builtArchetypeFor(spec: Spec): string {
  if (BY_ARCHETYPE[spec.archetype]) return spec.archetype;
  return SUBSTITUTE[spec.archetype] ?? FAMILY_ARCHETYPE[archetypeById(spec.archetype).family] ?? 'todo';
}

export function generatorFor(spec: Spec): Generator {
  return BY_ARCHETYPE[builtArchetypeFor(spec)] ?? listApp;
}

export function synthesize(spec: Spec, design: DesignSystem): SynthProject {
  const builtId = builtArchetypeFor(spec);
  const substituted = builtId !== spec.archetype;
  const requested = archetypeById(spec.archetype);
  const archetype = archetypeById(builtId);

  // The generators are handed a spec describing what is really being made.
  const effective: Spec = substituted
    ? {
        ...spec,
        archetype: builtId,
        archetypeLabel: archetype.label,
        kind: archetype.kind,
        title: spec.subject
          ? `${spec.subject.split(' ')[0].replace(/^./, (c) => c.toUpperCase())} ${archetype.label.toLowerCase()}`
          : archetype.label,
      }
    : spec;

  const piece = generatorFor(spec)(effective, design);
  const bare = effective.kind === 'site';
  const use = effective;

  const scripts: string[] = [];
  if (piece.engine) scripts.push('engine.js');
  if (use.archetype === 'quiz') scripts.push('questions.js');
  if (piece.script.trim()) scripts.push(piece.scriptName);

  const files: Record<string, string> = {
    'index.html': shell(use, design, piece, scripts, bare),
    'styles.css': `${renderBaseCss(design)}\n${bare ? '' : APP_CHROME_CSS}\n${piece.css}\n`,
  };
  if (piece.engine) files['engine.js'] = ENGINE_JS;
  if (use.archetype === 'quiz') files['questions.js'] = QUIZ_QUESTIONS;
  if (piece.script.trim()) files[piece.scriptName] = piece.script;
  files['README.md'] = readme(use, design, piece, archetype.label, substituted ? requested.label : null);

  return {
    files,
    builtArchetype: builtId,
    substitutedFor: substituted ? requested.label : null,
    plan: [
      'Work out what was asked for',
      'Choose the palette and the type',
      'Write the page and the styles',
      use.kind === 'game' ? 'Write the game logic' : 'Write the behaviour',
      'Check it over',
    ],
    summary: summaryFor(use, design, piece, substituted ? requested.label : null),
    notes: piece.notes,
    howTo: piece.howTo,
  };
}

/* ================================================================
   The page
   ================================================================ */

/**
 * The frame around anything that is not a marketing site: a measured column,
 * a title, and honest breathing room. Emitted before the generator's own CSS,
 * so a game that wants the whole viewport simply overrides `.page`.
 */
const APP_CHROME_CSS = `
.page {
  width: min(100% - 32px, 860px);
  margin-inline: auto;
  min-height: 100dvh;
  padding-block: 34px 56px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.masthead h1 { font-size: var(--step-3); }
.masthead p { margin-top: 4px; color: var(--ink-dim); }
.main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

@media (max-width: 560px) {
  .page { width: min(100% - 20px, 860px); padding-block: 20px 36px; gap: 20px; }
}
`;

function shell(spec: Spec, design: DesignSystem, piece: Piece, scripts: string[], bare: boolean): string {
  const description = descriptionFor(spec);
  const tags = scripts.map((src) => `  <script src="${src}" defer></script>`).join('\n');

  const head = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(spec.title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="color-scheme" content="${design.scheme}">
  <link rel="icon" href="${favicon(spec.title, design)}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>`;

  if (bare) {
    return `${head}
  <div class="page">
${piece.markup}
  </div>
${tags}
</body>
</html>
`;
  }

  return `${head}
  <div class="page">
    <header class="masthead">
      <h1>${escapeHtml(spec.title)}</h1>
      <p>${escapeHtml(taglineFor(spec))}</p>
    </header>

    <main class="main">
${piece.markup}
    </main>
  </div>
${tags}
</body>
</html>
`;
}

function taglineFor(spec: Spec): string {
  if (spec.kind === 'game') return 'Built to be played with a keyboard or a thumb.';
  if (spec.kind === 'viz') return 'Numbers with a baseline, and units on everything.';
  return 'Everything is saved as you go.';
}

function descriptionFor(spec: Spec): string {
  const what = spec.archetypeLabel.toLowerCase();
  return spec.subject ? `A ${what} about ${spec.subject}.` : `A ${what}, built to work on a phone as well as a laptop.`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function favicon(title: string, design: DesignSystem): string {
  const letter = escapeHtml((title.trim()[0] ?? 'M').toUpperCase());
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
    `<rect width='64' height='64' rx='12' fill='${design.colors.accent}'/>` +
    `<text x='32' y='45' font-family='system-ui,sans-serif' font-size='38' font-weight='700' ` +
    `text-anchor='middle' fill='${design.colors.accentInk}'>${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/* ================================================================
   The README — the part that explains the decisions
   ================================================================ */

function readme(spec: Spec, design: DesignSystem, piece: Piece, label: string, insteadOf: string | null): string {
  const files = ['`index.html`  the markup', '`styles.css`  the design tokens and the layout'];
  if (piece.engine) files.push('`engine.js`  the shared runtime — canvas fitting, the loop, input, sound');
  if (spec.archetype === 'quiz') files.push('`questions.js`  the question bank, on its own so it can be swapped');
  if (piece.script.trim()) files.push(`\`${piece.scriptName}\`  ${spec.kind === 'game' ? 'the game' : 'the behaviour'}`);

  return `# ${spec.title}

${descriptionFor(spec)} A ${label.toLowerCase()}, built from the sentence
"${spec.raw.replace(/\n+/g, ' ').slice(0, 160)}".
${
  insteadOf
    ? `\n> You asked for a ${insteadOf.toLowerCase()}. The builder that ships inside the app\n> does not have one, so it built the closest thing it does have. For a real\n> ${insteadOf.toLowerCase()}, switch to **Free** or your own key in Settings.\n`
    : ''
}
## How to use it

${piece.howTo.map((line) => `- ${line}`).join('\n')}

Open \`index.html\` in a browser. There is nothing to install and nothing to
build — it is plain HTML, CSS and JavaScript, and it works offline.

## The decisions

${piece.notes.map((line) => `- ${line}`).join('\n')}

## The look

**${design.name}** — ${design.notes}

The palette lives in \`:root\` in \`styles.css\` as custom properties. Change
\`--accent\` and the whole thing follows. No web fonts: the stacks are faces
that ship with Windows, macOS, iOS and Android, so it looks right with the
network off.

## The files

${files.map((f) => `- ${f}`).join('\n')}

---

Built by the builder inside **Masterpiece Coder**, which runs on your own
machine with no account, no key and no internet. Switch to one of the AI
providers in Settings for something made to order.
`;
}

function summaryFor(spec: Spec, design: DesignSystem, piece: Piece, insteadOf: string | null): string {
  const lines = [
    insteadOf
      ? `You asked for a ${insteadOf.toLowerCase()}, and the builder inside the app does not have one — so it built **${spec.title}** instead, which is the closest thing it does have. Switch to **Free** or your own key in Settings for a real ${insteadOf.toLowerCase()}.`
      : `**${spec.title}** is built and ready to play in the Preview panel.`,
    '',
    piece.howTo.map((line) => `- ${line}`).join('\n'),
    '',
    'The choices worth knowing about:',
    piece.notes.slice(0, 4).map((line) => `- ${line}`).join('\n'),
    '',
    `The look is **${design.name}** — ${design.notes.split('.')[0].toLowerCase()}. Everything is in \`styles.css\` as custom properties, so changing \`--accent\` re-themes the whole thing.`,
    '',
    'This came from the builder that ships inside the app, so it took no account, no key and no internet — but it builds from a fixed set of blueprints rather than to order. Switch to **Free** or your own key in Settings for something bespoke.',
  ];
  return lines.join('\n');
}
