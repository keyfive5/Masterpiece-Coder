import { DesignSystem, Spec } from './types';

/**
 * The art director.
 *
 * Left alone, every AI builds the same page: Inter on white, a purple-to-blue
 * gradient, three rounded cards. Not because it is good but because it is the
 * mean of everything ever written. This module removes the choice: it picks a
 * complete, coherent, contrast-checked system before a line of code is written,
 * and hands over the actual hex values.
 *
 * Two rules make it work:
 *   1. The choice is seeded from the prompt, so the same idea always looks the
 *      same and two different ideas rarely look alike.
 *   2. Every palette here has been checked to pass WCAG AA on the pairings that
 *      matter — body text on background, dim text on background, and the accent
 *      ink on the accent. `checkPalette` is run over all of them in the tests.
 *
 * No web fonts: everything is a stack of faces that ship with the major
 * operating systems, so a project still has character with the network off.
 */

/* ================================================================
   Colour maths
   ================================================================ */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio, 1–21. AA body text needs 4.5, large text 3. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ================================================================
   Palettes
   ================================================================ */

interface Palette extends DesignSystem {}

const P = (
  id: string,
  name: string,
  mood: string,
  scheme: 'dark' | 'light',
  colors: DesignSystem['colors'],
  notes: string,
): Palette => ({
  id,
  name,
  mood,
  scheme,
  colors,
  notes,
  fonts: { display: '', body: '', mono: '', scale: 1.25 },
  radius: '',
  shadow: '',
  motion: '',
});

export const PALETTES: Palette[] = [
  P('midnight-ink', 'Midnight Ink', 'minimal', 'dark', {
    bg: '#0d1117', surface: '#161b22', surfaceAlt: '#1c2430', ink: '#e6edf3', inkDim: '#9aa7b4',
    line: '#263041', accent: '#4cc2ff', accentInk: '#04202e', accent2: '#ffb86b', good: '#3fb950', bad: '#f85149',
  }, 'Deep blue-black with one cold accent. Quiet, technical, gets out of the way.'),

  P('paper-press', 'Paper Press', 'editorial', 'light', {
    bg: '#f7f4ec', surface: '#ffffff', surfaceAlt: '#efe9dc', ink: '#1a1714', inkDim: '#5d564c',
    line: '#ded5c4', accent: '#a8321f', accentInk: '#fff6f2', accent2: '#2f5d50', good: '#2f6b3a', bad: '#a8321f',
  }, 'Warm paper, printer\'s red, ink black. Reads like something that was set rather than typed.'),

  P('neon-grid', 'Neon Grid', 'neon', 'dark', {
    bg: '#07060f', surface: '#120e26', surfaceAlt: '#1b1440', ink: '#f2eaff', inkDim: '#a99cd0',
    line: '#2f2560', accent: '#ff2e88', accentInk: '#14000a', accent2: '#22e7ff', good: '#3ce6a2', bad: '#ff4d4d',
  }, 'Hot pink on near-black with a cyan second. Arcade cabinet at 2am.'),

  P('forest-floor', 'Forest Floor', 'nature', 'light', {
    bg: '#f4f6f0', surface: '#ffffff', surfaceAlt: '#e7ece0', ink: '#16211a', inkDim: '#4d5a4f',
    line: '#d2dbc9', accent: '#2f6f4e', accentInk: '#f2fbf6', accent2: '#b4671f', good: '#2f6f4e', bad: '#a33a2a',
  }, 'Moss and bark on a pale green ground. Calm without being cold.'),

  P('terminal-green', 'Terminal', 'retro', 'dark', {
    bg: '#06110a', surface: '#0b1a10', surfaceAlt: '#102417', ink: '#c9f5d5', inkDim: '#7bbd90',
    line: '#1c3a28', accent: '#38e07b', accentInk: '#04170c', accent2: '#f0d264', good: '#38e07b', bad: '#ff6b5e',
  }, 'Phosphor green on black. Monospaced everything.'),

  P('sunset-club', 'Sunset Club', 'playful', 'dark', {
    bg: '#1a0f1e', surface: '#26152c', surfaceAlt: '#331c3a', ink: '#ffeef7', inkDim: '#c4a3bb',
    line: '#442a4c', accent: '#ff7a4d', accentInk: '#2a0c02', accent2: '#ffd166', good: '#59d999', bad: '#ff5470',
  }, 'Aubergine night, coral and gold. Warm and a bit loud.'),

  P('bone-black', 'Bone & Black', 'brutal', 'light', {
    bg: '#f2f0eb', surface: '#ffffff', surfaceAlt: '#e4e1d8', ink: '#101010', inkDim: '#4a4a48',
    line: '#1a1a1a', accent: '#ff3b00', accentInk: '#1a0500', accent2: '#0026ff', good: '#00794f', bad: '#d10000',
  }, 'Hard black rules, bone paper, one screaming orange. Everything square.'),

  P('cobalt-corp', 'Cobalt', 'corporate', 'light', {
    bg: '#f6f8fb', surface: '#ffffff', surfaceAlt: '#e9eef6', ink: '#101828', inkDim: '#4a5568',
    line: '#d5dde9', accent: '#1f4fd8', accentInk: '#f2f6ff', accent2: '#0a8f7a', good: '#12805c', bad: '#c0392b',
  }, 'Trustworthy blue on cool white. The one that looks like a company.'),

  P('deep-sea', 'Deep Sea', 'space', 'dark', {
    bg: '#04121c', surface: '#0a1d2b', surfaceAlt: '#10293a', ink: '#e2f1f8', inkDim: '#93b0c0',
    line: '#1d3a4d', accent: '#37c9c2', accentInk: '#032120', accent2: '#f2a65a', good: '#3fd0a0', bad: '#f4695f',
  }, 'Submarine blue with a teal glow. Deep, wide, quiet.'),

  P('rose-ink', 'Rose Ink', 'elegant', 'light', {
    bg: '#fdf7f7', surface: '#ffffff', surfaceAlt: '#f6e9ea', ink: '#21161a', inkDim: '#5d4a50',
    line: '#e6d2d4', accent: '#9c2b4e', accentInk: '#fff2f5', accent2: '#3f5d75', good: '#2e7a5b', bad: '#a52a2a',
  }, 'Claret on blush. Serif, generous margins, nothing hurried.'),

  P('amber-cabin', 'Amber Cabin', 'warm', 'dark', {
    bg: '#17120d', surface: '#221a12', surfaceAlt: '#2e2318', ink: '#f6ecdd', inkDim: '#bda88c',
    line: '#3c2f21', accent: '#e0912f', accentInk: '#1e1204', accent2: '#7fa96b', good: '#7fa96b', bad: '#d1583f',
  }, 'Lamplight and old wood. Dark, but not cold.'),

  P('slate-mono', 'Slate', 'minimal', 'light', {
    bg: '#ffffff', surface: '#fafafa', surfaceAlt: '#f0f0f0', ink: '#111111', inkDim: '#565656',
    line: '#e2e2e2', accent: '#111111', accentInk: '#ffffff', accent2: '#767676', good: '#17734a', bad: '#b3261e',
  }, 'No colour at all. Everything carried by type, weight and space.'),

  P('violet-lab', 'Violet Lab', 'space', 'dark', {
    bg: '#0f0b1a', surface: '#191330', surfaceAlt: '#221a3f', ink: '#ece7ff', inkDim: '#a79cc9',
    line: '#2e2452', accent: '#9d7bff', accentInk: '#100626', accent2: '#52e0c4', good: '#4ad9a5', bad: '#ff6188',
  }, 'Ultraviolet with a mint second. Modern, slightly clinical.'),

  P('citrus-pop', 'Citrus Pop', 'playful', 'light', {
    bg: '#fffaf0', surface: '#ffffff', surfaceAlt: '#fdf0d5', ink: '#201a12', inkDim: '#5b5041',
    line: '#efe0c4', accent: '#e2571f', accentInk: '#2a0d02', accent2: '#1f7a8c', good: '#2b7a3f', bad: '#c1272d',
  }, 'Cream, blood orange, a teal counterweight. Cheerful without being childish.'),

  P('ice-blue', 'Ice', 'minimal', 'light', {
    bg: '#f4f8fa', surface: '#ffffff', surfaceAlt: '#e6eef3', ink: '#0e1a20', inkDim: '#4a5b64',
    line: '#d3e0e7', accent: '#0f6fa8', accentInk: '#f0f8ff', accent2: '#c2571a', good: '#16794f', bad: '#b62d2d',
  }, 'Cold and clear, one steel blue. Reads as precise.'),

  P('crt-amber', 'CRT Amber', 'retro', 'dark', {
    bg: '#100b04', surface: '#1a1208', surfaceAlt: '#241a0d', ink: '#ffcf7a', inkDim: '#c29a52',
    line: '#33260f', accent: '#ffb000', accentInk: '#1a1000', accent2: '#7fd6ff', good: '#8fd672', bad: '#ff6a4d',
  }, 'Amber monitor. Scan lines optional, glow mandatory.'),

  P('plum-velvet', 'Plum Velvet', 'elegant', 'dark', {
    bg: '#14101a', surface: '#1f1829', surfaceAlt: '#2b2138', ink: '#f0e9f5', inkDim: '#b3a4bf',
    line: '#392c48', accent: '#c9a227', accentInk: '#1a1400', accent2: '#7c6bd6', good: '#56c08a', bad: '#e0576f',
  }, 'Dark plum and old gold. Expensive-looking, restrained.'),

  P('paper-blue', 'Paper Blue', 'editorial', 'light', {
    bg: '#fbfaf7', surface: '#ffffff', surfaceAlt: '#f0eee7', ink: '#17181a', inkDim: '#55585e',
    line: '#e0ded6', accent: '#1d4ed8', accentInk: '#f5f8ff', accent2: '#b45309', good: '#15803d', bad: '#b91c1c',
  }, 'Off-white stock, link blue, a rusty second. Made for reading.'),

  P('jungle-night', 'Jungle Night', 'nature', 'dark', {
    bg: '#0a1410', surface: '#112019', surfaceAlt: '#182c22', ink: '#e4f2e8', inkDim: '#9ab5a5',
    line: '#234135', accent: '#5fd08c', accentInk: '#04170d', accent2: '#e8b84b', good: '#5fd08c', bad: '#ef6b5b',
  }, 'Dense green dark with a leaf accent. Alive rather than sterile.'),

  P('sand-stone', 'Sandstone', 'warm', 'light', {
    bg: '#f8f4ee', surface: '#ffffff', surfaceAlt: '#eee7dc', ink: '#1d1a15', inkDim: '#57503f',
    line: '#ddd4c3', accent: '#875a31', accentInk: '#fff8f0', accent2: '#3a6157', good: '#3f7a52', bad: '#a3402f',
  }, 'Desert stone and clay. Soft, tactile, unhurried.'),

  P('magenta-noir', 'Magenta Noir', 'brutal', 'dark', {
    bg: '#0b0b0d', surface: '#141418', surfaceAlt: '#1d1d22', ink: '#f5f5f7', inkDim: '#a0a0a8',
    line: '#2b2b33', accent: '#ff0059', accentInk: '#1a0009', accent2: '#00e0b8', good: '#00c281', bad: '#ff4747',
  }, 'Neutral black, one violent magenta. Heavy type, hard edges.'),

  P('arcade-blue', 'Arcade Blue', 'retro', 'dark', {
    bg: '#081028', surface: '#0e1a3d', surfaceAlt: '#142450', ink: '#eaf1ff', inkDim: '#a2b3d6',
    line: '#22346b', accent: '#ffd400', accentInk: '#191400', accent2: '#ff5c8a', good: '#4ade80', bad: '#ff5c5c',
  }, 'Cabinet blue and coin-slot yellow. Loud on purpose.'),
];

/* ================================================================
   Type
   ================================================================ */

interface FontPair {
  id: string;
  display: string;
  body: string;
  mono: string;
  moods: string[];
  note: string;
}

/** Only faces that ship with Windows, macOS, iOS or Android. Nothing fetched. */
const FONTS: FontPair[] = [
  {
    id: 'grotesque',
    display: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    body: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    mono: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`,
    moods: ['minimal', 'corporate', 'brutal'],
    note: 'One neutral grotesque throughout, separated by weight and size only.',
  },
  {
    id: 'oldstyle',
    display: `Georgia, "Iowan Old Style", "Times New Roman", serif`,
    body: `Georgia, "Iowan Old Style", "Times New Roman", serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['editorial', 'elegant', 'warm'],
    note: 'Old-style serif for everything — the most readable thing available without a download.',
  },
  {
    id: 'serif-sans',
    display: `Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif`,
    body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['elegant', 'editorial', 'nature'],
    note: 'Serif headings over a system sans body — classic magazine pairing.',
  },
  {
    id: 'geometric',
    display: `Futura, "Century Gothic", "Trebuchet MS", sans-serif`,
    body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['playful', 'minimal', 'space'],
    note: 'Geometric display, plain body. Friendly without being soft.',
  },
  {
    id: 'monospace',
    display: `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace`,
    body: `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['retro', 'neon', 'brutal'],
    note: 'Monospaced throughout. Everything lines up; it reads as a machine.',
  },
  {
    id: 'impact',
    display: `Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif`,
    body: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['brutal', 'retro', 'playful'],
    note: 'Condensed poster display against a plain body. Very loud headings.',
  },
  {
    id: 'humanist',
    display: `Optima, Candara, "Gill Sans", "Gill Sans MT", sans-serif`,
    body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['nature', 'warm', 'elegant'],
    note: 'Humanist display with calligraphic bones. Warm without being twee.',
  },
  {
    id: 'slab',
    display: `Rockwell, "Roboto Slab", Georgia, serif`,
    body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['warm', 'corporate', 'playful'],
    note: 'Slab headings, plain body. Solid and a bit mechanical.',
  },
  {
    id: 'system',
    display: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    body: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
    mono: `ui-monospace, Menlo, Consolas, monospace`,
    moods: ['minimal', 'corporate', 'space'],
    note: 'The native interface face. Invisible, fast, correct on every device.',
  },
];

/* ================================================================
   Selection
   ================================================================ */

/** FNV-1a. Small, fast, and stable across runs — which is the whole point. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const RADII = ['0px', '2px', '4px', '8px', '14px', '20px'];
const SHADOWS = [
  'none',
  '0 1px 2px rgba(0,0,0,.14)',
  '0 2px 8px rgba(0,0,0,.18)',
  '0 8px 30px rgba(0,0,0,.24)',
  '4px 4px 0 var(--line)',
];

/**
 * Choose a complete system for this project. Deterministic in the prompt, so a
 * rebuild of the same idea looks the same and a different idea does not.
 */
export function chooseDesign(spec: Spec): DesignSystem {
  const seed = hash(`${spec.raw}|${spec.archetype}`);

  // Mood first: if the user said "retro", they get retro.
  const wanted = spec.mood[0] ?? defaultMoodFor(spec);
  let pool = PALETTES.filter((p) => p.mood === wanted);
  if (spec.constraints.scheme) {
    const filtered = pool.filter((p) => p.scheme === spec.constraints.scheme);
    if (filtered.length) pool = filtered;
  }
  if (!pool.length) {
    pool = spec.constraints.scheme
      ? PALETTES.filter((p) => p.scheme === spec.constraints.scheme)
      : PALETTES.slice();
  }
  const base = pool[seed % pool.length];

  // Type: prefer a pairing that shares the palette's mood.
  const fontPool = FONTS.filter((f) => f.moods.includes(base.mood));
  const font = (fontPool.length ? fontPool : FONTS)[(seed >>> 8) % (fontPool.length || FONTS.length)];

  // Games want tighter corners and a harder shadow than a marketing page.
  const radius =
    base.mood === 'brutal' || base.mood === 'retro'
      ? RADII[(seed >>> 16) % 2]
      : RADII[2 + ((seed >>> 16) % 4)];
  const shadow =
    base.mood === 'brutal'
      ? SHADOWS[4]
      : base.mood === 'minimal'
        ? SHADOWS[(seed >>> 20) % 2]
        : SHADOWS[1 + ((seed >>> 20) % 3)];

  return {
    ...base,
    fonts: { display: font.display, body: font.body, mono: font.mono, scale: base.mood === 'editorial' ? 1.333 : 1.25 },
    radius,
    shadow,
    motion: 'cubic-bezier(.2,.8,.2,1)',
    notes: `${base.notes} ${font.note}`,
  };
}

function defaultMoodFor(spec: Spec): string {
  if (spec.kind === 'game') return spec.archetype === 'rhythm' || spec.archetype === 'shooter' ? 'neon' : 'retro';
  if (spec.kind === 'viz') return 'corporate';
  if (spec.kind === 'site') return 'editorial';
  return 'minimal';
}

/* ================================================================
   Emitting CSS
   ================================================================ */

/** The custom-property block. Everything generated is written against these. */
export function renderTokens(d: DesignSystem): string {
  const c = d.colors;
  return `:root {
  --bg: ${c.bg};
  --surface: ${c.surface};
  --surface-alt: ${c.surfaceAlt};
  --ink: ${c.ink};
  --ink-dim: ${c.inkDim};
  --line: ${c.line};
  --accent: ${c.accent};
  --accent-ink: ${c.accentInk};
  --accent-2: ${c.accent2};
  --good: ${c.good};
  --bad: ${c.bad};

  --font-display: ${d.fonts.display};
  --font-body: ${d.fonts.body};
  --font-mono: ${d.fonts.mono};

  --step-0: 1rem;
  --step-1: ${(d.fonts.scale ** 1).toFixed(3)}rem;
  --step-2: ${(d.fonts.scale ** 2).toFixed(3)}rem;
  --step-3: ${(d.fonts.scale ** 3).toFixed(3)}rem;
  --step-4: ${(d.fonts.scale ** 4).toFixed(3)}rem;

  --space: 8px;
  --radius: ${d.radius};
  --shadow: ${d.shadow};
  --motion: 180ms ${d.motion};
}`;
}

/**
 * A small, opinionated base sheet: reset, tokens, and the handful of primitives
 * every generated project needs. Deliberately short — it is a floor, not a
 * framework, and everything in it is used.
 */
export function renderBaseCss(d: DesignSystem): string {
  return `${renderTokens(d)}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html { -webkit-text-size-adjust: 100%; }

body {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 { font-family: var(--font-display); line-height: 1.15; font-weight: 700; }
h1 { font-size: var(--step-4); letter-spacing: -0.02em; }
h2 { font-size: var(--step-3); letter-spacing: -0.01em; }
h3 { font-size: var(--step-2); }
p { max-width: 68ch; }

a { color: var(--accent); text-underline-offset: 3px; }

:where(button, [role="button"], a, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  touch-action: manipulation;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 700;
  box-shadow: var(--shadow);
  transition: transform var(--motion), filter var(--motion);
}
.btn:hover { filter: brightness(1.08); }
.btn:active { transform: translateY(1px); }
.btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
  box-shadow: none;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: calc(var(--space) * 3);
  box-shadow: var(--shadow);
}

.stack > * + * { margin-top: calc(var(--space) * 2); }
.wrap { width: min(100% - 32px, 1120px); margin-inline: auto; }
.muted { color: var(--ink-dim); }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}`;
}

/* ================================================================
   Self-check — used by the tests, and by the critic on generated CSS
   ================================================================ */

export interface PaletteProblem {
  palette: string;
  pair: string;
  ratio: number;
  needed: number;
}

/** Every pairing a generated project actually relies on. */
export function checkPalette(d: DesignSystem): PaletteProblem[] {
  const c = d.colors;
  const pairs: Array<[string, string, string, number]> = [
    ['ink on bg', c.ink, c.bg, 7],
    ['ink on surface', c.ink, c.surface, 7],
    ['dim on bg', c.inkDim, c.bg, 4.5],
    ['dim on surface', c.inkDim, c.surface, 4.5],
    ['accent-ink on accent', c.accentInk, c.accent, 4.5],
    ['accent on bg', c.accent, c.bg, 3],
    ['accent-2 on bg', c.accent2, c.bg, 3],
    ['good on surface', c.good, c.surface, 3],
    ['bad on surface', c.bad, c.surface, 3],
  ];
  const problems: PaletteProblem[] = [];
  for (const [pair, a, b, needed] of pairs) {
    const ratio = contrast(a, b);
    if (ratio < needed) problems.push({ palette: d.id, pair, ratio: Number(ratio.toFixed(2)), needed });
  }
  return problems;
}
