import { archetypeById } from './knowledge';
import { BuildPlan, Milestone, Spec } from './types';

/**
 * The planner.
 *
 * A plan is only worth anything if each step says how you know it is finished.
 * "Write the game loop" is not a step — you can write a game loop and have
 * nothing playable. "The loop runs at a stable rate and moving the player is
 * visible on screen" is a step, because it can be false.
 */

const GAME_STEPS: Milestone[] = [
  { text: 'Page, canvas and the design system', acceptance: 'The page opens with the palette applied, the canvas fills its box at any window size, and nothing is unstyled.' },
  { text: 'The loop and the world', acceptance: 'A requestAnimationFrame loop scaled by elapsed time draws the field; the frame rate does not change the speed of anything.' },
  { text: 'Controls — keyboard, pointer and touch', acceptance: 'Every action can be performed with a key and with a finger, and arrow keys and space do not scroll the page.' },
  { text: 'Rules: collision, scoring, difficulty', acceptance: 'Scoring happens on the right event, collisions are correct at the edges, and difficulty changes in a way the player can feel.' },
  { text: 'Losing and starting again', acceptance: 'There is a way to lose, a screen that says so with the score, and a restart that resets every variable — not a page reload.' },
  { text: 'Feel: sound, feedback, HUD', acceptance: 'Every meaningful event has feedback, sound is created inside a gesture and can be muted, and the HUD is readable while playing.' },
  { text: 'Review and fix', acceptance: 'review_project reports no blockers or majors.' },
];

const APP_STEPS: Milestone[] = [
  { text: 'Shell and the design system', acceptance: 'The layout holds from 320 px to a wide desktop, with the palette applied throughout.' },
  { text: 'The data model and storage', acceptance: 'One state object is the single source of truth, and it survives a reload.' },
  { text: 'The core actions', acceptance: 'Everything the app is for can be done — create, change and remove — with the view re-rendered from state each time.' },
  { text: 'Views, filters and search', acceptance: 'Every way of looking at the data works, and the active view is visible.' },
  { text: 'Empty, loading and error states', acceptance: 'A first-time user sees an explanation rather than a blank box, and every failure says what went wrong.' },
  { text: 'Keyboard and polish', acceptance: 'The primary action has a keyboard path, focus is visible, and destructive actions are undoable or confirmed.' },
  { text: 'Review and fix', acceptance: 'review_project reports no blockers or majors.' },
];

const SITE_STEPS: Milestone[] = [
  { text: 'Write the actual copy', acceptance: 'Every heading and paragraph is about the real subject. There is no placeholder text anywhere.' },
  { text: 'Structure and the design system', acceptance: 'Semantic landmarks, headings in order, and the palette and type scale applied.' },
  { text: 'The hero', acceptance: 'At 900×700 the headline, the sub-line and the primary action are all visible without scrolling.' },
  { text: 'The supporting sections', acceptance: 'Each section earns its place and says something specific.' },
  { text: 'Responsive and navigation', acceptance: 'At 320 px nothing overflows sideways and the navigation still works.' },
  { text: 'Metadata and finish', acceptance: 'Title, description, favicon, and every link and image resolves.' },
  { text: 'Review and fix', acceptance: 'review_project reports no blockers or majors.' },
];

const VIZ_STEPS: Milestone[] = [
  { text: 'Layout and the design system', acceptance: 'A responsive card grid with the palette applied.' },
  { text: 'The data', acceptance: 'Realistic data with units, in one place, shaped the way real data would be.' },
  { text: 'The charts', acceptance: 'Drawn in SVG or canvas, with labelled axes, a legend and units. Nothing loaded from a CDN.' },
  { text: 'Headline figures', acceptance: 'Every number has a comparison beside it, so it means something.' },
  { text: 'Controls', acceptance: 'The range or filter control actually changes what is drawn.' },
  { text: 'Review and fix', acceptance: 'review_project reports no blockers or majors.' },
];

export function buildPlan(spec: Spec): BuildPlan {
  const archetype = archetypeById(spec.archetype);
  const steps =
    spec.kind === 'game' ? GAME_STEPS : spec.kind === 'site' ? SITE_STEPS : spec.kind === 'viz' ? VIZ_STEPS : APP_STEPS;

  const milestones = steps.map((m) => ({ ...m }));

  // Features the user asked for that the standard plan does not already cover
  // become their own step, so they cannot quietly go missing.
  const extra: Record<string, Milestone> = {
    'multiplayer-local': { text: 'Two-player mode', acceptance: 'Both players can play at once on one keyboard, with separate scores.' },
    'ai-opponent': { text: 'The computer opponent', acceptance: 'It plays legally, it can be beaten on easy, and the difficulty control changes how it plays.' },
    export: { text: 'Export', acceptance: 'The exported file downloads and opens correctly in the app it is meant for.' },
    import: { text: 'Import', acceptance: 'A valid file loads, and an invalid one produces a clear message instead of a crash.' },
    charts: { text: 'Charts', acceptance: 'Axes labelled, units stated, drawn without any external library.' },
    print: { text: 'Print stylesheet', acceptance: 'Printing produces a clean page with no navigation and no split entries.' },
    darkmode: { text: 'Theme toggle', acceptance: 'It switches, it persists, and it defaults to the system preference.' },
    tutorial: { text: 'Instructions', acceptance: 'A first-time player is told what to do before they have to do it.' },
  };
  for (const id of spec.features) {
    const step = extra[id];
    if (step && !milestones.some((m) => m.text === step.text)) milestones.splice(milestones.length - 1, 0, step);
  }

  const manifest = spec.constraints.singleFile
    ? ([['index.html', 'Everything — markup, styles in a <style> tag, script in a <script> tag.']] as Array<[string, string]>)
    : (archetype.files ?? defaultManifest(spec));

  return { milestones, manifest, definitionOfDone: doneFor(spec) };
}

function defaultManifest(spec: Spec): Array<[string, string]> {
  const main = spec.kind === 'game' ? 'game.js' : 'app.js';
  const files: Array<[string, string]> = [
    ['index.html', 'Markup and nothing else — no inline styles, no inline logic.'],
    ['styles.css', 'The design tokens from the brief, then the layout and components.'],
    [main, spec.kind === 'game' ? 'State, the loop, input, rules and rendering.' : 'State, storage, actions and rendering.'],
  ];
  if (spec.kind === 'game') files.push(['README.md', 'What it is, how to play, and the numbers chosen for difficulty.']);
  else files.push(['README.md', 'What it is and how to use it.']);
  return files;
}

function doneFor(spec: Spec): string {
  switch (spec.kind) {
    case 'game':
      return 'Someone opens it, understands what to do within five seconds, plays a full round without reading anything, loses, and starts again with one press — on a phone as well as a laptop.';
    case 'site':
      return 'Someone lands on it and can say within ten seconds what this is, who it is for and what to do next — and the page still reads well at 320 px.';
    case 'viz':
      return 'Someone can answer a real question from the screen without asking what a number means or what unit it is in.';
    default:
      return 'Someone can do the thing the app is for, close the tab, come back tomorrow and find their work still there.';
  }
}
