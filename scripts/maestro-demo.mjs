/**
 * Generates a set of projects with the native synthesiser and serves them, so
 * they can be opened in a real browser and actually played. Static analysis
 * proves the code parses; this proves it runs.
 *
 *   node scripts/maestro-demo.mjs            build and serve on :39281
 *   node scripts/maestro-demo.mjs --build    build only
 */

import { build } from 'esbuild';
import { createServer } from 'node:http';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, '.maestro-demo');
const PORT = 39281;

const PROMPTS = [
  'make me a snake game',
  'a brick breaker game',
  'a neon rhythm game about robots',
  'an endless runner where you dodge things',
  'space invaders in space',
  'flappy bird clone',
  'pong',
  'a maze game',
  'a retro memory matching game',
  'tic tac toe against the computer',
  '2048',
  'a trivia quiz',
  'a todo list',
  'a calculator',
  'a pomodoro timer',
  'a drawing app',
  'an analytics dashboard',
  'a landing page for my product',
  'website for my bakery',
  'my personal portfolio',
  'a resume site',
  'make me tetris',
];

async function loadMaestro() {
  const outfile = path.join(outDir, '_maestro.mjs');
  await mkdir(outDir, { recursive: true });
  await build({
    entryPoints: [path.join(root, 'src/core/maestro/index.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    logLevel: 'error',
  });
  return import(pathToFileURL(outfile).href);
}

async function generate() {
  await rm(outDir, { recursive: true, force: true });
  const M = await loadMaestro();

  const built = [];
  for (const prompt of PROMPTS) {
    const brief = M.compileBrief(prompt, { canRunCommands: false, hasFiles: false });
    const project = M.synthesize(brief.spec, brief.design);
    const slug = `${brief.spec.slug}-${brief.spec.archetype}`.replace(/[^a-z0-9-]/gi, '-');
    const dir = path.join(outDir, slug);
    await mkdir(dir, { recursive: true });
    for (const [name, content] of Object.entries(project.files)) {
      await writeFile(path.join(dir, name), content, 'utf8');
    }

    const findings = M.review(new Map(Object.entries(project.files)), brief.spec);
    built.push({
      prompt,
      slug,
      title: brief.spec.title,
      archetype: project.builtArchetype,
      substitutedFor: project.substitutedFor,
      design: brief.design.name,
      findings: findings.length,
      briefBytes: brief.text.length,
    });
    console.log(
      `${slug.padEnd(34)} ${String(project.builtArchetype).padEnd(12)} ${brief.design.name.padEnd(14)} ` +
        `brief ${String(brief.text.length).padStart(5)}b  findings ${findings.length}`,
    );
  }

  const index = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maestro — generated projects</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#0d1117; color:#e6edf3; font:16px/1.5 system-ui,sans-serif; padding:32px; }
  h1 { font-size:22px; margin:0 0 6px; }
  p.sub { color:#9aa7b4; margin:0 0 24px; }
  ul { list-style:none; padding:0; display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:10px; }
  a { display:block; padding:14px 16px; background:#161b22; border:1px solid #263041; border-radius:8px; color:#e6edf3; text-decoration:none; }
  a:hover { border-color:#4cc2ff; }
  span { display:block; color:#9aa7b4; font-size:13px; margin-top:4px; }
</style></head><body>
<h1>Maestro — ${built.length} projects, generated offline</h1>
<p class="sub">Every one built from a single sentence with no model, no network and no key.</p>
<ul>
${built
  .map(
    (b) =>
      `  <li><a href="./${b.slug}/index.html"><strong>${b.title}</strong><span>"${b.prompt}" · ${b.design}${
        b.substitutedFor ? ` · stood in for ${b.substitutedFor}` : ''
      }</span></a></li>`,
  )
  .join('\n')}
</ul></body></html>`;
  await writeFile(path.join(outDir, 'index.html'), index, 'utf8');
  await writeFile(path.join(outDir, 'check.html'), checkPage(built), 'utf8');

  const clean = built.filter((b) => b.findings === 0).length;
  console.log(`\n${built.length} projects · ${clean} with zero findings of any severity`);
  return built;
}

/**
 * A page that loads every generated project in an iframe, starts it, prods it,
 * and reports anything that threw — plus whether it overflows sideways on a
 * phone. Parsing is checked in maestro-test; this checks that it runs.
 */
function checkPage(built) {
  const list = JSON.stringify(built.map((b) => ({ slug: b.slug, title: b.title })));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Maestro — runtime check</title>
<style>
  body { margin:0; background:#0d1117; color:#e6edf3; font:14px/1.5 ui-monospace,monospace; padding:20px; }
  #frame { position:fixed; right:12px; bottom:12px; border:1px solid #263041; background:#000; }
  pre { white-space:pre-wrap; }
  .ok { color:#3fb950; } .bad { color:#f85149; }
</style></head><body>
<h1>Runtime check</h1>
<pre id="out">starting…</pre>
<iframe id="frame" width="390" height="700"></iframe>
<script>
const PROJECTS = ${list};
const out = document.getElementById('out');
const frame = document.getElementById('frame');
const wait = ms => new Promise(r => setTimeout(r, ms));
const results = [];

function line(text, cls) {
  out.insertAdjacentHTML('beforeend', '\\n<span class="' + (cls || '') + '">' + text + '</span>');
}

async function load(slug, width) {
  frame.width = width;
  frame.height = width < 500 ? 700 : 640;
  return new Promise(resolve => {
    frame.onload = () => resolve(frame.contentWindow);
    frame.src = './' + slug + '/index.html?cachebust=' + Date.now();
  });
}

async function exercise(win) {
  const errors = [];
  win.addEventListener('error', e => errors.push(String(e.message)));
  win.addEventListener('unhandledrejection', e => errors.push('promise: ' + e.reason));
  const doc = win.document;

  const start = doc.getElementById('start');
  if (start) start.click();
  await wait(600);

  const keys = ['ArrowRight', 'ArrowDown', ' ', 'ArrowLeft', 'ArrowUp', 'd', 'f', 'j', 'k', '1', 'Enter'];
  for (const key of keys) {
    win.dispatchEvent(new win.KeyboardEvent('keydown', { key, bubbles: true }));
    win.dispatchEvent(new win.KeyboardEvent('keyup', { key, bubbles: true }));
  }

  const clickable = doc.querySelectorAll('.cell, .card-tile, .option, .key, .btn, .swatch, [data-range], [data-filter]');
  for (let i = 0; i < Math.min(clickable.length, 8); i++) clickable[i].click();

  const canvas = doc.querySelector('canvas');
  if (canvas) {
    const box = canvas.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const opts = { bubbles: true, clientX: box.left + box.width * (0.3 + i * 0.1), clientY: box.top + box.height * 0.6, pointerId: 1, isPrimary: true, pressure: 0.5 };
      canvas.dispatchEvent(new win.PointerEvent('pointerdown', opts));
      canvas.dispatchEvent(new win.PointerEvent('pointermove', opts));
      canvas.dispatchEvent(new win.PointerEvent('pointerup', opts));
    }
  }

  const input = doc.querySelector('input[type="text"]');
  if (input) {
    input.value = '<b>markup should not run</b>';
    const form = input.closest('form');
    if (form) form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  }

  await wait(2400);
  return { errors, doc, win };
}

(async () => {
  out.textContent = '';
  for (const project of PROJECTS) {
    // phone width first: this is where layouts break
    let win = await load(project.slug, 390);
    let r = await exercise(win);
    const overflow = r.doc.documentElement.scrollWidth - r.win.innerWidth;
    const phoneErrors = r.errors.slice();

    // then a normal window
    win = await load(project.slug, 900);
    r = await exercise(win);
    const boldRan = !!r.doc.querySelector('.item b, .item__text b');

    const errors = phoneErrors.concat(r.errors);
    const bad = errors.length > 0 || overflow > 2 || boldRan;
    results.push({ slug: project.slug, errors, overflow, boldRan });
    line(
      (bad ? 'FAIL ' : 'ok   ') + project.slug.padEnd(36) +
      ' overflow ' + String(overflow).padStart(4) + 'px' +
      (errors.length ? '  errors: ' + errors.join(' | ') : '') +
      (boldRan ? '  UNESCAPED HTML' : ''),
      bad ? 'bad' : 'ok'
    );
  }
  const failed = results.filter(r => r.errors.length || r.overflow > 2 || r.boldRan);
  line('\\n' + (failed.length ? failed.length + ' PROJECTS FAILED' : 'ALL ' + results.length + ' PROJECTS RAN CLEAN'), failed.length ? 'bad' : 'ok');
  window.__result = { total: results.length, failed: failed.length, results };
  document.title = failed.length ? 'FAIL' : 'PASS';
})();
</script></body></html>`;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function serve() {
  createServer(async (req, res) => {
    try {
      const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
      let file = path.join(outDir, url === '/' ? 'index.html' : url.replace(/^\/+/, ''));
      if (!file.startsWith(outDir)) {
        res.writeHead(403).end('no');
        return;
      }
      const info = await stat(file).catch(() => null);
      if (info?.isDirectory()) file = path.join(file, 'index.html');
      if (!(await stat(file).catch(() => null))) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      createReadStream(file).pipe(res);
    } catch (err) {
      res.writeHead(500).end(String(err));
    }
  }).listen(PORT, () => console.log(`\nServing ${outDir} on http://localhost:${PORT}/`));
}

await generate();
if (!process.argv.includes('--build')) serve();
