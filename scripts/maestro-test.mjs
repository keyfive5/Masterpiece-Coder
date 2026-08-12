/**
 * Maestro's self-test.
 *
 * Bundles src/core/maestro with esbuild, then puts it through five checks:
 *
 *   1. every palette passes WCAG AA on the pairings the generators rely on
 *   2. the intent compiler maps real sentences to the right archetype
 *   3. every archetype synthesises a project that the critic passes clean
 *   4. every generated script actually parses
 *   5. the critic catches deliberately planted bugs, so it is not a no-op
 *
 * Run with:  node scripts/maestro-test.mjs
 */

import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title) {
  process.stdout.write(`\n${title}\n${'-'.repeat(title.length)}\n`);
}

async function loadMaestro() {
  const dir = await mkdtemp(path.join(tmpdir(), 'maestro-'));
  const outfile = path.join(dir, 'maestro.mjs');
  await build({
    entryPoints: [path.join(root, 'src/core/maestro/index.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    logLevel: 'error',
  });
  const module = await import(pathToFileURL(outfile).href);
  return { module, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

const WEB = { canRunCommands: false, hasFiles: false };

/* ================================================================
   1. Palettes
   ================================================================ */

function testPalettes(M) {
  section('Palettes — contrast');
  for (const palette of M.PALETTES) {
    const design = M.chooseDesign({
      raw: palette.id,
      archetype: 'generic-app',
      mood: [palette.mood],
      kind: 'app',
      constraints: { scheme: palette.scheme },
    });
    const problems = M.checkPalette({ ...palette, fonts: design.fonts });
    check(
      `palette ${palette.id}`,
      problems.length === 0,
      problems.map((p) => `${p.pair} ${p.ratio}:1 needs ${p.needed}`).join(', '),
    );
  }
  console.log(`  ${M.PALETTES.length} palettes checked on 9 pairings each`);
}

/* ================================================================
   2. Intent compiler
   ================================================================ */

const PROMPTS = [
  ['make me a snake game', 'snake'],
  ['snake but neon', 'snake'],
  ['a brick breaker game', 'breakout'],
  ['build breakout', 'breakout'],
  ['pong please', 'pong'],
  ['flappy bird clone', 'flappy'],
  ['an endless runner where you dodge things', 'runner'],
  ['space invaders in space', 'shooter'],
  ['a shoot em up', 'shooter'],
  ['make a dance game', 'rhythm'],
  ['rhythm game like guitar hero', 'rhythm'],
  ['a maze game', 'maze'],
  ['memory matching game for kids', 'memory'],
  ['tic tac toe against the computer', 'tictactoe'],
  ['2048', '2048'],
  ['a trivia quiz', 'quiz'],
  ['multiple choice quiz app', 'quiz'],
  ['a todo list', 'todo'],
  ['task manager that saves my tasks', 'todo'],
  ['notes app with search', 'notes'],
  ['a calculator', 'calculator'],
  ['unit converter', 'converter'],
  ['pomodoro timer', 'timer'],
  ['a focus timer with sound', 'timer'],
  ['habit tracker with streaks', 'habit'],
  ['expense tracker for my budget', 'budget'],
  ['a drawing app', 'drawing'],
  ['kanban board like trello', 'kanban'],
  ['flashcards for studying', 'flashcards'],
  ['markdown editor with preview', 'markdown'],
  ['a landing page for my product', 'landing'],
  ['website for my bakery', 'restaurant'],
  ['my personal portfolio', 'portfolio'],
  ['a resume site', 'resume'],
  ['blog with a few posts', 'blog'],
  ['analytics dashboard', 'dashboard'],
  ['an online store', 'ecommerce'],
  ['wedding website', 'event'],
  ['minesweeper', 'minesweeper'],
  ['wordle clone', 'wordguess'],
  ['tower defense game', 'towerdefense'],
  ['an idle clicker game', 'clicker'],
  ['typing speed test', 'typing'],
  ['simon says game', 'simon'],
  ['a platformer', 'platformer'],
  ['tetris', 'tetris'],
  ['image gallery with a lightbox', 'gallery'],
  ['a chat interface', 'chatui'],
  ['music player for my mp3s', 'musicplayer'],
  ['documentation site', 'docs'],
];

function testCompiler(M) {
  section('Intent compiler — archetype');
  for (const [prompt, expected] of PROMPTS) {
    const spec = M.compileSpec(prompt, WEB);
    check(`"${prompt}"`, spec.archetype === expected, `got ${spec.archetype}`);
  }

  section('Intent compiler — details');

  const neon = M.compileSpec('a neon snake game about space', WEB);
  check('mood detected', neon.mood.includes('neon'), JSON.stringify(neon.mood));
  check('subject detected', neon.subject.includes('space'), neon.subject);

  const noSound = M.compileSpec('a snake game with no sound', WEB);
  check('negation excludes', noSound.excluded.includes('sound') && !noSound.features.includes('sound'), JSON.stringify(noSound));

  const framework = M.compileSpec('a todo app in react', WEB);
  check('framework noted', framework.constraints.framework === 'react');
  check('build-step warning raised', framework.unknowns.some((u) => u.includes('build step')));

  const must = M.compileSpec('make a quiz. It must have exactly ten questions and should never repeat one.', WEB);
  check('verbatim requirements kept', must.verbatim.length >= 1, JSON.stringify(must.verbatim));

  const vague = M.compileSpec('something cool', WEB);
  check('low confidence flagged', vague.confidence < 0.34, String(vague.confidence));
  check('unknown surfaced', vague.unknowns.length > 0);

  const edit = M.compileSpec('add a pause button', { canRunCommands: false, hasFiles: true });
  check('edit detected', edit.isEdit === true);
  const fresh = M.compileSpec('add a pause button', WEB);
  check('edit needs existing files', fresh.isEdit === false);

  const stable = M.compileSpec('make me a snake game', WEB);
  const again = M.compileSpec('make me a snake game', WEB);
  check('compilation is deterministic', JSON.stringify(stable) === JSON.stringify(again));

  const d1 = M.chooseDesign(M.compileSpec('a bakery website', WEB));
  const d2 = M.chooseDesign(M.compileSpec('a bakery website', WEB));
  const d3 = M.chooseDesign(M.compileSpec('a rhythm game about robots', WEB));
  check('design is deterministic', d1.id === d2.id, `${d1.id} vs ${d2.id}`);
  check('different ideas differ', d1.id !== d3.id, `${d1.id} vs ${d3.id}`);
}

/* ================================================================
   3 & 4. Synthesis
   ================================================================ */

function testSynthesis(M) {
  section('Native synthesis — the critic must pass every generated project');

  const prompts = new Map();
  for (const archetype of M.ARCHETYPES) prompts.set(archetype.id, archetype.triggers[0]);

  let totalFiles = 0;
  let totalBytes = 0;

  for (const [id, prompt] of prompts) {
    const spec = M.compileSpec(prompt, WEB);
    // Force the archetype: this is a test of every generator, not of matching.
    spec.archetype = id;
    const archetype = M.archetypeById(id);
    spec.archetypeLabel = archetype.label;
    spec.kind = archetype.kind;

    const design = M.chooseDesign(spec);
    const project = M.synthesize(spec, design);

    const files = new Map(Object.entries(project.files));
    totalFiles += files.size;
    for (const body of files.values()) totalBytes += body.length;

    // Judge what was actually built. When the builder has no bespoke generator
    // it substitutes the closest one it has and says so, and the review has to
    // be of that thing rather than of the one that was asked for.
    const builtArchetype = M.archetypeById(project.builtArchetype);
    const reviewSpec = {
      ...spec,
      archetype: project.builtArchetype,
      archetypeLabel: builtArchetype.label,
      kind: builtArchetype.kind,
    };
    const findings = M.review(files, reviewSpec);
    const serious = findings.filter((f) => f.severity !== 'minor');
    check(
      `${id} builds clean`,
      serious.length === 0,
      serious.map((f) => `[${f.rule}] ${f.path}${f.line ? ':' + f.line : ''} ${f.message}`).join(' | '),
    );

    // Every generated script must actually parse.
    for (const [name, body] of files) {
      if (!name.endsWith('.js')) continue;
      let error = null;
      try {
        // eslint-disable-next-line no-new-func
        new Function(body);
      } catch (err) {
        error = err.message;
      }
      check(`${id} · ${name} parses`, error === null, error ?? '');
    }

    check(`${id} has an entry page`, files.has('index.html'));
    check(`${id} has a readme`, files.has('README.md'));
  }

  console.log(`  ${prompts.size} archetypes · ${totalFiles} files · ${Math.round(totalBytes / 1024)} KB generated`);
}

/* ================================================================
   5. The critic must actually catch things
   ================================================================ */

const BROKEN = [
  {
    rule: 'html.missing-asset',
    files: { 'index.html': '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>X</title></head><body><script src="missing.js"></script></body></html>' },
  },
  {
    rule: 'html.unbalanced',
    files: { 'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><div><section></div></body></html>' },
  },
  {
    rule: 'html.viewport',
    files: { 'index.html': '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>X</title></head><body><p>hi</p></body></html>' },
  },
  {
    rule: 'html.duplicate-id',
    files: { 'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><p id="a">1</p><p id="a">2</p></body></html>' },
  },
  {
    rule: 'html.inline-handler-undefined',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><button onclick="doTheThing()">go</button><script src="app.js"></script></body></html>',
      'app.js': 'var x = 1;\n',
    },
  },
  {
    rule: 'js.unbalanced',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><script src="app.js"></script></body></html>',
      'app.js': 'function start() {\n  console.log("hello");\n',
    },
  },
  {
    rule: 'js.undefined-function',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><script src="app.js"></script></body></html>',
      'app.js': 'function start() {\n  renderEverything();\n}\nstart();\n',
    },
  },
  {
    rule: 'js.duplicate-declaration',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><script src="app.js"></script></body></html>',
      'app.js': 'function draw() { return 1; }\nfunction draw() { return 2; }\ndraw();\n',
    },
  },
  {
    rule: 'app.no-eval',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><script src="app.js"></script></body></html>',
      'app.js': 'var total = eval("1 + 2");\n',
    },
  },
  {
    rule: 'app.escape-output',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><script src="app.js"></script></body></html>',
      'app.js': 'var name = "x";\ndocument.body.innerHTML = `<p>${name}</p>`;\n',
    },
  },
  {
    rule: 'content.placeholder',
    files: { 'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><p>Lorem ipsum dolor sit amet</p></body></html>' },
  },
  {
    rule: 'css.unbalanced',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title><link rel="stylesheet" href="styles.css"></head><body></body></html>',
      'styles.css': 'body { color: red;\n.other { color: blue; }\n',
    },
  },
  {
    rule: 'css.undefined-var',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title><link rel="stylesheet" href="styles.css"></head><body></body></html>',
      'styles.css': ':root { --ink: #111; }\nbody { color: var(--nope); }\n',
    },
  },
  {
    rule: 'web.contrast',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title><link rel="stylesheet" href="styles.css"></head><body></body></html>',
      'styles.css': ':root { --bg: #ffffff; --ink: #cccccc; --ink-dim: #dddddd; }\n@media (min-width: 40em) { body { color: var(--ink); } }\n',
    },
  },
  {
    rule: 'web.responsive',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title><link rel="stylesheet" href="styles.css"></head><body></body></html>',
      'styles.css': `body { width: 1200px; }\n.a { padding: 12px; }\n.b { margin: 4px; }\n${'/* filler to pass the length gate */\n'.repeat(14)}`,
    },
  },
  {
    rule: 'project.orphan-file',
    files: {
      'index.html': '<!doctype html><html lang="en"><head><title>X</title></head><body><p>hi</p></body></html>',
      'styles.css': ':root { --ink: #111; }\nbody { color: var(--ink); }\n@media (min-width: 40em) { body { font-size: 18px; } }\n',
    },
  },
];

const BROKEN_GAMES = [
  {
    rule: 'game.spawn-offscreen',
    prompt: 'an endless runner',
    js: `var obstacles = [];\nfunction spawn() { obstacles.push({ x: 400, y: 200, w: 20, h: 20 }); }\nfunction loop() { requestAnimationFrame(loop); }\nfunction restart() { score = 0; }\nvar score = 0;\nvar gameOver = false;\nwindow.addEventListener('pointerdown', spawn);\nvar dt = 0.016;\nfunction hit(a, b) { return Math.abs(a - b) < 10; }\nloop();\n`,
  },
  {
    rule: 'game.touch-input',
    prompt: 'a snake game',
    js: `var score = 0;\nvar gameOver = false;\nvar SPAWN_Y = -40;\nfunction restart() { score = 0; }\nfunction loop(t) { var dt = t / 1000; requestAnimationFrame(loop); }\nwindow.addEventListener('keydown', function (e) { e.preventDefault(); });\nrequestAnimationFrame(loop);\n`,
  },
  {
    rule: 'game.lose-state',
    prompt: 'a snake game',
    js: `var score = 0;\nvar SPAWN_Y = -40;\nfunction restart() { score = 0; }\nfunction loop(t) { var dt = t / 1000; requestAnimationFrame(loop); }\nwindow.addEventListener('keydown', function (e) { e.preventDefault(); });\nwindow.addEventListener('pointerdown', function () {});\nrequestAnimationFrame(loop);\n`,
  },
  {
    rule: 'game.delta-time',
    prompt: 'a snake game',
    js: `var score = 0;\nvar gameOver = false;\nvar x = 0;\nfunction restart() { score = 0; }\nfunction loop() { x += 3; requestAnimationFrame(loop); }\nwindow.addEventListener('keydown', function (e) { e.preventDefault(); });\nwindow.addEventListener('pointerdown', function () {});\nrequestAnimationFrame(loop);\n`,
  },
  {
    rule: 'game.key-scroll',
    prompt: 'a snake game',
    js: `var score = 0;\nvar gameOver = false;\nfunction restart() { score = 0; }\nfunction loop(t) { var dt = t / 1000; requestAnimationFrame(loop); }\nwindow.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { score++; } });\nwindow.addEventListener('pointerdown', function () {});\nrequestAnimationFrame(loop);\n`,
  },
];

function testCriticSensitivity(M) {
  section('Critic — planted bugs must be found');

  for (const item of BROKEN) {
    const findings = M.review(new Map(Object.entries(item.files)), M.compileSpec('a page', WEB));
    check(`catches ${item.rule}`, findings.some((f) => f.rule === item.rule), findings.map((f) => f.rule).join(', ') || 'nothing found');
  }

  for (const item of BROKEN_GAMES) {
    const spec = M.compileSpec(item.prompt, WEB);
    const files = new Map([
      ['index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Game</title></head><body><canvas id="game"></canvas><script src="game.js"></script></body></html>'],
      ['game.js', item.js],
    ]);
    const findings = M.review(files, spec);
    check(`catches ${item.rule}`, findings.some((f) => f.rule === item.rule), findings.map((f) => f.rule).join(', ') || 'nothing found');
  }

  section('Critic — a clean project must stay clean');
  const spec = M.compileSpec('make me a snake game', WEB);
  const project = M.synthesize(spec, M.chooseDesign(spec));
  const findings = M.review(new Map(Object.entries(project.files)), spec);
  check('no false positives on a good build', findings.length === 0, findings.map((f) => `[${f.rule}] ${f.message}`).join(' | '));
}

/* ================================================================
   6. Repair
   ================================================================ */

function testRepair(M) {
  section('Repair — the safe fixes');
  const spec = M.compileSpec('a landing page for a bakery', WEB);
  const design = M.chooseDesign(spec);
  const files = new Map([
    ['index.html', '<html><head></head><body><h1>Hi</h1></body></html>'],
    ['styles.css', 'body { color: red; }'],
    ['app.js', 'console.log(1);'],
  ]);

  const repairs = M.repair(files, spec, design);
  check('repairs the entry page', repairs.length === 1, `${repairs.length} files`);
  const fixed = repairs[0].content;
  check('adds a doctype', /^<!doctype html>/i.test(fixed));
  check('adds lang', /<html lang="en"/.test(fixed));
  check('adds a viewport', /name="viewport"/.test(fixed));
  check('adds a title', /<title>/.test(fixed));
  check('adds a favicon', /rel="icon"/.test(fixed));
  check('links the stylesheet', /href="styles\.css"/.test(fixed));
  check('loads the script', /src="app\.js"/.test(fixed));

  const after = M.review(new Map([...files, ['index.html', fixed]]), spec);
  check('repaired page has no blockers', after.every((f) => f.severity !== 'blocker'), after.filter((f) => f.severity === 'blocker').map((f) => f.rule).join(', '));
}

/* ================================================================
   run
   ================================================================ */

const { module: M, cleanup } = await loadMaestro();

testPalettes(M);
testCompiler(M);
testSynthesis(M);
testCriticSensitivity(M);
testRepair(M);

await cleanup();

console.log(`\n${'='.repeat(52)}`);
if (failed === 0) {
  console.log(`ALL PASS — ${passed} checks`);
} else {
  console.log(`${passed} passed, ${failed} FAILED\n`);
  for (const line of failures) console.log(`  FAIL  ${line}`);
}
console.log('='.repeat(52));
process.exit(failed === 0 ? 0 : 1);
