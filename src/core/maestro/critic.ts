import { contrast } from './design';
import { archetypeById } from './knowledge';
import { Finding, Severity, Spec } from './types';

/**
 * The critic.
 *
 * Whoever wrote the code — an external model, the native synthesiser, or a
 * person — this reads what actually landed on disk and says what is wrong with
 * it. No network, no model, no opinion: every rule here fires on evidence in
 * the file, and every rule has a stable id so a test can prove it still works.
 *
 * The rules are drawn from the failure modes in knowledge.ts. `game.spawn-
 * offscreen` exists because a rhythm game shipped with its arrows already on
 * the hit line. `app.timer-drift` exists because setInterval is throttled in a
 * background tab. Nothing here is theoretical.
 *
 * Which game rules run is decided by the archetype: a board game has no frame
 * loop and should not be told it is missing one.
 */

export type FileMap = Map<string, string>;

interface Ctx {
  files: FileMap;
  spec: Spec | null;
  /** Every .js file plus the contents of every inline <script>, joined. */
  allScript: string;
  /** The same, with comments and string bodies blanked out. */
  allScriptBare: string;
  /** Every .css file plus every inline <style>. */
  allStyle: string;
  add(f: Finding): void;
}

/* ================================================================
   Lexical helpers
   ================================================================ */

/**
 * Blank out comments, string bodies, template contents and regex literals,
 * keeping the length and the newlines so line numbers still line up. Every
 * structural check runs against this rather than the raw source, or a brace
 * inside a string breaks the balance count.
 */
export function blankJs(source: string): string {
  const out = source.split('');
  let i = 0;
  const n = source.length;
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < n; k++) if (out[k] !== '\n') out[k] = ' ';
  };

  let prevMeaning = ''; // last non-space character, to tell division from regex
  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (c === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      blank(i, end === -1 ? n : end);
      i = end === -1 ? n : end;
      continue;
    }
    if (c === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      blank(i, end === -1 ? n : end + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      let k = i + 1;
      while (k < n) {
        if (source[k] === '\\') { k += 2; continue; }
        if (source[k] === c) break;
        // Template holes contain real code — leave them alone.
        if (c === '`' && source[k] === '$' && source[k + 1] === '{') {
          let depth = 1;
          k += 2;
          while (k < n && depth > 0) {
            if (source[k] === '{') depth++;
            else if (source[k] === '}') depth--;
            k++;
          }
          continue;
        }
        k++;
      }
      blank(i + 1, k);
      i = k + 1;
      prevMeaning = c;
      continue;
    }
    if (c === '/' && next !== '=' && !/[\w)\]]/.test(prevMeaning)) {
      // Regex literal: only where a value can start.
      let k = i + 1;
      let inClass = false;
      while (k < n) {
        if (source[k] === '\\') { k += 2; continue; }
        if (source[k] === '[') inClass = true;
        else if (source[k] === ']') inClass = false;
        else if (source[k] === '/' && !inClass) break;
        else if (source[k] === '\n') { k = -1; break; }
        k++;
      }
      if (k > 0 && k < n) {
        blank(i + 1, k);
        i = k + 1;
        prevMeaning = '/';
        continue;
      }
    }
    if (!/\s/.test(c)) prevMeaning = c;
    i++;
  }
  return out.join('');
}

function lineAt(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}

function balance(text: string): { char: string; missing: 'open' | 'close' } | null {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const c of text) {
    if (c === '(' || c === '[' || c === '{') stack.push(c);
    else if (c === ')' || c === ']' || c === '}') {
      if (stack.pop() !== pairs[c]) return { char: c, missing: 'open' };
    }
  }
  return stack.length ? { char: stack[stack.length - 1], missing: 'close' } : null;
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const OPTIONAL_CLOSE = new Set(['li', 'p', 'td', 'th', 'tr', 'option', 'dt', 'dd', 'thead', 'tbody', 'tfoot']);

function inlineBlocks(html: string, tag: 'script' | 'style'): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  for (const m of html.matchAll(re)) out.push(m[1]);
  return out;
}

/* ================================================================
   Globals the undefined-function rule must not flag
   ================================================================ */

const KNOWN_GLOBALS = new Set([
  'alert', 'confirm', 'prompt', 'fetch', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'requestAnimationFrame', 'cancelAnimationFrame', 'queueMicrotask', 'structuredClone', 'atob', 'btoa',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent', 'decodeURIComponent',
  'encodeURI', 'decodeURI', 'String', 'Number', 'Boolean', 'Array', 'Object', 'Math', 'JSON', 'Date',
  'RegExp', 'Error', 'TypeError', 'RangeError', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise', 'Symbol',
  'Proxy', 'Reflect', 'BigInt', 'Intl', 'URL', 'URLSearchParams', 'Blob', 'File', 'FileReader',
  'FormData', 'Headers', 'Request', 'Response', 'AbortController', 'Image', 'Audio', 'AudioContext',
  'webkitAudioContext', 'OffscreenCanvas', 'Path2D', 'ImageData', 'DOMParser', 'MutationObserver',
  'IntersectionObserver', 'ResizeObserver', 'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent',
  'PointerEvent', 'TouchEvent', 'Worker', 'BroadcastChannel', 'Notification', 'ArrayBuffer',
  'Uint8Array', 'Uint8ClampedArray', 'Int32Array', 'Float32Array', 'Float64Array', 'DataView',
  'console', 'window', 'document', 'navigator', 'location', 'history', 'localStorage', 'sessionStorage',
  'performance', 'screen', 'matchMedia', 'getComputedStyle', 'scrollTo', 'scrollBy', 'open', 'close',
  'addEventListener', 'removeEventListener', 'dispatchEvent', 'postMessage', 'crypto', 'speechSynthesis',
  'SpeechSynthesisUtterance', 'devicePixelRatio', 'innerWidth', 'innerHeight', 'top', 'self', 'globalThis',
  'if', 'for', 'while', 'switch', 'catch', 'return', 'typeof', 'function', 'super', 'this', 'new',
  'await', 'yield', 'delete', 'void', 'in', 'of', 'do', 'else', 'try', 'throw', 'case', 'default',
]);

/* ================================================================
   The rules
   ================================================================ */

export function review(files: FileMap, spec: Spec | null): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  const add = (f: Finding) => {
    const key = `${f.rule}|${f.path}|${f.line ?? ''}|${f.message}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push(f);
  };

  const scripts: string[] = [];
  const styles: string[] = [];
  for (const [path, body] of files) {
    if (/\.m?js$/i.test(path)) scripts.push(body);
    else if (/\.css$/i.test(path)) styles.push(body);
    else if (/\.html?$/i.test(path)) {
      scripts.push(...inlineBlocks(body, 'script'));
      styles.push(...inlineBlocks(body, 'style'));
    }
  }

  const allScript = scripts.join('\n;\n');
  const ctx: Ctx = {
    files,
    spec,
    allScript,
    allScriptBare: blankJs(allScript),
    allStyle: styles.join('\n'),
    add,
  };

  checkProject(ctx);
  for (const [path, body] of files) {
    if (/\.html?$/i.test(path)) checkHtml(ctx, path, body);
    else if (/\.css$/i.test(path)) checkCss(ctx, path, body);
    else if (/\.m?js$/i.test(path)) checkJs(ctx, path, body);
    checkContent(ctx, path, body);
  }
  checkCssTokens(ctx);
  if (spec) {
    checkAgainstSpec(ctx, spec);
    if (spec.kind === 'game') checkGame(ctx, spec);
  }

  const order: Record<Severity, number> = { blocker: 0, major: 1, minor: 2 };
  return findings.sort((a, b) => order[a.severity] - order[b.severity] || a.path.localeCompare(b.path));
}

/* ---------------------------------------------------------------- project */

function checkProject(ctx: Ctx): void {
  const paths = [...ctx.files.keys()];
  if (paths.length === 0) {
    ctx.add({
      rule: 'project.empty',
      severity: 'blocker',
      path: '.',
      message: 'Nothing was created.',
      fix: 'Write the files. Call write_file with the complete contents of each one.',
    });
    return;
  }

  const hasEntry = paths.some((p) => /(^|\/)index\.html?$/i.test(p));
  const hasAnyHtml = paths.some((p) => /\.html?$/i.test(p));
  if (!hasEntry && hasAnyHtml) {
    ctx.add({
      rule: 'project.entry',
      severity: 'major',
      path: paths.find((p) => /\.html?$/i.test(p))!,
      message: 'There is HTML but no index.html, so the Preview panel has nothing to open.',
      fix: 'Name the entry page index.html, at the root of the project.',
    });
  }
  if (!hasAnyHtml && ctx.spec?.constraints.noBuild) {
    ctx.add({
      rule: 'project.entry',
      severity: 'blocker',
      path: '.',
      message: 'There is no HTML page, so nothing can run here.',
      fix: 'This host has no build step and no shell. Create index.html and load the CSS and JavaScript from it.',
    });
  }

  // A stylesheet or script that nothing links to is almost always a mistake in
  // the markup rather than a deliberate spare file.
  const referenced = new Set<string>();
  for (const [path, body] of ctx.files) {
    if (!/\.html?$/i.test(path)) continue;
    for (const m of body.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) referenced.add(normaliseRef(m[1]));
  }
  for (const path of paths) {
    if (!/\.(css|m?js)$/i.test(path)) continue;
    if (!referenced.has(normaliseRef(path))) {
      ctx.add({
        rule: 'project.orphan-file',
        severity: 'major',
        path,
        message: `${path} exists but no page loads it, so none of it runs.`,
        fix: `Add a <link rel="stylesheet" href="${path}"> or <script src="${path}" defer></script> to index.html.`,
      });
    }
  }
}

function normaliseRef(ref: string): string {
  return ref.split('?')[0].split('#')[0].replace(/^\.\//, '').replace(/^\//, '').toLowerCase();
}

/* ---------------------------------------------------------------- content */

const PLACEHOLDERS: Array<[RegExp, string]> = [
  [/lorem ipsum/i, 'lorem ipsum'],
  [/\bTODO\b|\bFIXME\b/, 'a TODO left in the code'],
  [/your (?:text|content|name|logo) here/i, 'a "your text here" placeholder'],
  [/\bfeature (?:one|two|three)\b/i, 'unnamed "Feature One" copy'],
  [/\bplaceholder (?:text|content)\b/i, 'text literally labelled placeholder'],
  [/coming soon/i, 'a "coming soon" stub'],
  [/implement (?:this|later)|not implemented/i, 'an unimplemented stub'],
  [/\bxxx+\b/i, 'XXX filler'],
];

function checkContent(ctx: Ctx, path: string, body: string): void {
  const meaningful = body.replace(/\s/g, '');
  if (meaningful.length === 0) {
    ctx.add({
      rule: 'content.empty-file',
      severity: 'major',
      path,
      message: `${path} is empty.`,
      fix: 'Either write it properly or delete it.',
    });
    return;
  }
  if (meaningful.length < 24 && !/\.(md|txt|json)$/i.test(path)) {
    ctx.add({
      rule: 'content.empty-file',
      severity: 'major',
      path,
      message: `${path} is almost empty — ${meaningful.length} characters.`,
      fix: 'Finish it, or delete it if it is not needed.',
    });
  }

  // README files legitimately talk about what is not done yet.
  if (/README|CHANGELOG|NOTES/i.test(path)) return;

  for (const [pattern, label] of PLACEHOLDERS) {
    const m = pattern.exec(body);
    if (!m) continue;
    ctx.add({
      rule: 'content.placeholder',
      severity: 'major',
      path,
      line: lineAt(body, m.index),
      message: `${path} still contains ${label}.`,
      fix: 'Replace it with the real thing. Placeholder text means the feature is not finished.',
    });
  }
}

/* ---------------------------------------------------------------- html */

function checkHtml(ctx: Ctx, path: string, body: string): void {
  const isEntry = /(^|\/)index\.html?$/i.test(path);
  const at = (re: RegExp) => re.test(body);

  if (isEntry) {
    if (!at(/<!doctype\s+html/i)) {
      ctx.add({ rule: 'html.doctype', severity: 'minor', path, message: 'No <!doctype html>, so the browser falls back to quirks mode.', fix: 'Put <!doctype html> on the first line.' });
    }
    if (!at(/<html[^>]*\slang\s*=/i)) {
      ctx.add({ rule: 'html.lang', severity: 'minor', path, message: 'The <html> element has no lang attribute.', fix: 'Use <html lang="en"> — screen readers need it to choose a voice.' });
    }
    if (!at(/<meta[^>]+charset/i)) {
      ctx.add({ rule: 'html.charset', severity: 'minor', path, message: 'No charset declaration.', fix: 'Add <meta charset="utf-8"> as the first thing in <head>.' });
    }
    const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(body);
    if (!title || !title[1].trim() || /^(document|untitled|title)$/i.test(title[1].trim())) {
      ctx.add({ rule: 'html.title', severity: 'major', path, message: 'The page has no real <title>.', fix: 'Give it the name of the thing — it is the browser tab, the bookmark and the search result.' });
    }
    if (!at(/<meta[^>]+name=["']viewport["']/i)) {
      ctx.add({
        rule: 'html.viewport',
        severity: 'major',
        path,
        message: 'No viewport meta tag, so a phone will render the page at desktop width and zoom out.',
        fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
      });
    }
    if (!at(/<meta[^>]+name=["']description["']/i) && ctx.spec?.kind === 'site') {
      ctx.add({ rule: 'web.meta-description', severity: 'minor', path, message: 'No meta description.', fix: 'Add one sentence describing the page — it is what shows up when the link is shared.' });
    }
  }

  /* structure */
  const stack: Array<{ tag: string; index: number }> = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g;
  const withoutComments = body.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length));
  let mismatch: { tag: string; index: number } | null = null;
  for (const m of withoutComments.matchAll(tagRe)) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (VOID_TAGS.has(tag) || m[3].trimEnd().endsWith('/')) continue;
    if (tag === 'script' || tag === 'style') {
      if (closing) { if (stack[stack.length - 1]?.tag === tag) stack.pop(); }
      else stack.push({ tag, index: m.index });
      continue;
    }
    if (!closing) {
      stack.push({ tag, index: m.index });
    } else {
      while (stack.length && OPTIONAL_CLOSE.has(stack[stack.length - 1].tag) && stack[stack.length - 1].tag !== tag) stack.pop();
      const open = stack.pop();
      if (!open || open.tag !== tag) {
        mismatch = { tag, index: m.index };
        break;
      }
    }
  }
  const leftOpen = stack.filter((s) => !OPTIONAL_CLOSE.has(s.tag));
  if (mismatch) {
    ctx.add({
      rule: 'html.unbalanced',
      severity: 'blocker',
      path,
      line: lineAt(body, mismatch.index),
      message: `A </${mismatch.tag}> closes something that was never opened, so the rest of the page nests wrongly.`,
      fix: 'Read the markup around that line and match every opening tag with its closing tag.',
    });
  } else if (leftOpen.length) {
    const open = leftOpen[leftOpen.length - 1];
    ctx.add({
      rule: 'html.unbalanced',
      severity: 'blocker',
      path,
      line: lineAt(body, open.index),
      message: `<${open.tag}> is never closed, so everything after it is nested inside it.`,
      fix: `Add the matching </${open.tag}>.`,
    });
  }

  /* duplicate ids */
  const ids = new Map<string, number>();
  for (const m of body.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)) {
    const id = m[1];
    if (ids.has(id)) {
      ctx.add({
        rule: 'html.duplicate-id',
        severity: 'major',
        path,
        line: lineAt(body, m.index),
        message: `Two elements share id="${id}" — getElementById will only ever find the first.`,
        fix: 'Ids must be unique. Use a class for the ones that repeat.',
      });
    }
    ids.set(id, m.index);
  }

  /* local references that do not exist */
  const known = new Set([...ctx.files.keys()].map(normaliseRef));
  for (const m of body.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const ref = m[1].trim();
    if (/^(https?:|data:|mailto:|tel:|#|javascript:|\/\/)/i.test(ref) || ref === '') continue;
    if (!known.has(normaliseRef(ref))) {
      ctx.add({
        rule: 'html.missing-asset',
        severity: 'blocker',
        path,
        line: lineAt(body, m.index),
        message: `${path} loads "${ref}", which does not exist in the project.`,
        fix: `Either create ${ref} or remove the reference. A missing script means none of the behaviour runs.`,
      });
    }
  }

  /* inline handlers calling functions that are never defined */
  for (const m of body.matchAll(/\son[a-z]+\s*=\s*["']([^"']+)["']/gi)) {
    const call = /([A-Za-z_$][\w$]*)\s*\(/.exec(m[1]);
    if (!call) continue;
    const name = call[1];
    if (KNOWN_GLOBALS.has(name)) continue;
    if (!isDeclared(ctx.allScriptBare, name)) {
      ctx.add({
        rule: 'html.inline-handler-undefined',
        severity: 'blocker',
        path,
        line: lineAt(body, m.index),
        message: `An inline handler calls ${name}(), which is not defined anywhere.`,
        fix: `Define ${name}, or better, remove the inline handler and bind the listener in the script with addEventListener.`,
      });
    }
  }

  /* images without alt text */
  for (const m of body.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/.test(m[1])) {
      ctx.add({
        rule: 'web.alt-text',
        severity: 'major',
        path,
        line: lineAt(body, m.index),
        message: 'An <img> has no alt attribute.',
        fix: 'Describe the image, or use alt="" if it is purely decorative. Never leave it off.',
      });
    }
  }

  /* offline / CDN */
  if (ctx.spec?.constraints.offline) {
    const external = /(?:src|href)\s*=\s*["'](https?:)?\/\//i.exec(body);
    if (external) {
      ctx.add({
        rule: 'web.cdn-offline',
        severity: 'major',
        path,
        line: lineAt(body, external.index),
        message: 'The page loads something from the internet, but it was asked to work offline.',
        fix: 'Inline it, or replace it — system font stacks instead of web fonts, hand-drawn SVG instead of remote images, and no CDN libraries.',
      });
    }
  }
}

function isDeclared(bareScript: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`\\bfunction\\s+${escaped}\\b`),
    new RegExp(`\\b(?:const|let|var)\\s+${escaped}\\b`),
    new RegExp(`\\bclass\\s+${escaped}\\b`),
    new RegExp(`\\b${escaped}\\s*=\\s*(?:function|\\(|async)`),
    new RegExp(`window\\.${escaped}\\s*=`),
    new RegExp(`\\b${escaped}\\s*[,)]?\\s*=>`),
    // Destructured or imported.
    new RegExp(`\\b${escaped}\\s*[,}\\]]`),
    // A function parameter: function loop(step) — `step` is defined inside it.
    new RegExp(`[(,]\\s*${escaped}\\s*[),]`),
  ];
  return patterns.some((p) => p.test(bareScript));
}

/** The first JavaScript file containing a pattern, for an accurate report. */
function locate(ctx: Ctx, pattern: RegExp): { path: string; line?: number } {
  for (const [path, body] of ctx.files) {
    if (!/\.m?js$/i.test(path)) continue;
    const match = pattern.exec(body);
    if (match) return { path, line: lineAt(body, match.index) };
  }
  return { path: mainScriptPath(ctx) };
}

/** The file the game logic lives in — not the shared engine, if there is one. */
function mainScriptPath(ctx: Ctx): string {
  const scripts = [...ctx.files.keys()].filter((p) => /\.m?js$/i.test(p));
  return scripts.find((p) => !/engine\.js$/i.test(p)) ?? scripts[0] ?? [...ctx.files.keys()][0] ?? 'game.js';
}

/* ---------------------------------------------------------------- css */

function checkCss(ctx: Ctx, path: string, body: string): void {
  const bare = body.replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length));
  const problem = balance(bare.replace(/[()[\]]/g, ' '));
  if (problem) {
    ctx.add({
      rule: 'css.unbalanced',
      severity: 'blocker',
      path,
      message: problem.missing === 'close' ? 'A CSS rule is never closed — everything after it is ignored by the browser.' : 'There is a stray } in the stylesheet.',
      fix: 'Match every { with a }. A single unclosed rule silently kills the rest of the file.',
    });
  }
}

/** Custom properties used but never defined, and palette contrast. */
function checkCssTokens(ctx: Ctx): void {
  const css = ctx.allStyle;
  if (!css.trim()) return;

  const defined = new Set<string>();
  for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);
  const missing = new Set<string>();
  for (const m of css.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
    if (m[2] === ',') continue; // has a fallback, so it degrades rather than breaks
    if (!defined.has(m[1])) missing.add(m[1]);
  }
  for (const name of missing) {
    ctx.add({
      rule: 'css.undefined-var',
      severity: 'major',
      path: 'styles.css',
      message: `var(${name}) is used but never defined, so anything relying on it falls back to nothing.`,
      fix: `Define ${name} in :root, or use a value that exists.`,
    });
  }

  // Contrast, from the tokens themselves.
  const value = (name: string): string | null => {
    const m = new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(css);
    return m ? m[1] : null;
  };
  const pairs: Array<[string, string, string, number]> = [
    ['--ink', '--bg', 'body text on the background', 4.5],
    ['--ink-dim', '--bg', 'secondary text on the background', 4.5],
    ['--accent-ink', '--accent', 'text on the accent colour', 4.5],
  ];
  for (const [fg, bg, label, needed] of pairs) {
    const a = value(fg);
    const b = value(bg);
    if (!a || !b) continue;
    const ratio = contrast(a, b);
    if (ratio < needed) {
      ctx.add({
        rule: 'web.contrast',
        severity: 'major',
        path: 'styles.css',
        message: `${label} is only ${ratio.toFixed(1)}:1 — below the 4.5:1 needed to be readable.`,
        fix: `Darken ${fg} or lighten ${bg} until the ratio passes. Low contrast is the most common reason a good-looking page is unusable.`,
      });
    }
  }

  const responsive = /@media|clamp\(|minmax\(|flex-wrap|grid-template-columns:\s*repeat\(auto/i.test(css);
  if (!responsive && css.length > 400) {
    ctx.add({
      rule: 'web.responsive',
      severity: 'major',
      path: 'styles.css',
      message: 'The stylesheet has no media query and no fluid sizing, so the layout is fixed at one width.',
      fix: 'Add a breakpoint, or use fluid units — clamp(), minmax(), auto-fit grids, flex-wrap. Check it at 320 px before finishing.',
    });
  }
}

/* ---------------------------------------------------------------- js */

function checkJs(ctx: Ctx, path: string, body: string): void {
  const bare = blankJs(body);

  const problem = balance(bare);
  if (problem) {
    ctx.add({
      rule: 'js.unbalanced',
      severity: 'blocker',
      path,
      message:
        problem.missing === 'close'
          ? `A ${problem.char} is never closed, so the whole file fails to parse and nothing in it runs.`
          : `There is an unmatched ${problem.char}, so the file fails to parse.`,
      fix: 'Read the file back and match every bracket. A syntax error anywhere kills the entire script.',
    });
  }

  if (/\beval\s*\(|new\s+Function\s*\(/.test(bare)) {
    const m = /\beval\s*\(|new\s+Function\s*\(/.exec(bare)!;
    ctx.add({
      rule: 'app.no-eval',
      severity: 'major',
      path,
      line: lineAt(body, m.index),
      message: 'eval or new Function is used to run text as code.',
      fix: 'Write the logic properly. For arithmetic, a tokeniser and a precedence-climbing evaluator is about forty lines and cannot be tricked.',
    });
  }

  // innerHTML with an interpolation and nothing escaping it.
  for (const m of body.matchAll(/(innerHTML|outerHTML)\s*[+]?=\s*([`"'][\s\S]{0,600}?[`"'])/g)) {
    const value = m[2];
    if (!value.includes('${') && !value.includes(' + ')) continue;
    if (/escapeHtml|escapeHTML|\besc\(|encodeURIComponent|sanitiz/i.test(value)) continue;
    ctx.add({
      rule: 'app.escape-output',
      severity: 'major',
      path,
      line: lineAt(body, m.index),
      message: 'Values are interpolated straight into innerHTML, so any text the user types can inject markup.',
      fix: 'Use textContent for text, or run every interpolated value through an escapeHtml() that replaces &, <, > and ". This is also why a task called <b>hi</b> renders bold instead of showing the tags.',
    });
  }

  // Functions called but never defined anywhere in the project.
  const declaredCache = new Map<string, boolean>();
  for (const m of bare.matchAll(/(^|[^.\w$])([a-z_$][\w$]*)\s*\(/g)) {
    const name = m[2];
    if (KNOWN_GLOBALS.has(name) || name.length < 3) continue;
    // A property key or a label, not a call we can resolve.
    if (new RegExp(`\\b${name}\\s*\\(\\s*\\)\\s*{`).test(bare) && /^(if|for|while|switch|catch)$/.test(name)) continue;
    let declared = declaredCache.get(name);
    if (declared === undefined) {
      declared = isDeclared(ctx.allScriptBare, name);
      declaredCache.set(name, declared);
    }
    if (!declared) {
      ctx.add({
        rule: 'js.undefined-function',
        severity: 'blocker',
        path,
        line: lineAt(body, m.index),
        message: `${name}() is called but never defined, so it throws the moment that line runs — and everything after it stops.`,
        fix: `Define ${name}, or fix the name if it is a typo.`,
      });
    }
  }

  // Two top-level functions with the same name: the second silently wins.
  const names = new Map<string, number>();
  for (const m of bare.matchAll(/^function\s+([A-Za-z_$][\w$]*)/gm)) {
    const count = (names.get(m[1]) ?? 0) + 1;
    names.set(m[1], count);
    if (count === 2) {
      ctx.add({
        rule: 'js.duplicate-declaration',
        severity: 'major',
        path,
        line: lineAt(body, m.index),
        message: `function ${m[1]} is declared twice — the second one replaces the first, silently.`,
        fix: 'Delete the one that is out of date, or rename it if both are needed.',
      });
    }
  }
}

/* ---------------------------------------------------------------- spec */

function checkAgainstSpec(ctx: Ctx, spec: Spec): void {
  const script = ctx.allScriptBare;
  const raw = ctx.allScript;
  const anyFile = [...ctx.files.keys()].find((p) => /\.(m?js|html?)$/i.test(p)) ?? 'index.html';

  if (spec.constraints.noBuild) {
    for (const [path, body] of ctx.files) {
      if (/\.(tsx?|jsx)$/i.test(path)) {
        ctx.add({
          rule: 'web.build-step',
          severity: 'blocker',
          path,
          message: `${path} needs to be compiled, and there is no build step here.`,
          fix: 'Rewrite it as plain JavaScript in a .js file loaded by a <script> tag.',
        });
      }
      if (/\.m?js$/i.test(path)) {
        const bareImport = /^\s*import\s+[\s\S]{0,120}?from\s+['"][^./][^'"]*['"]/m.exec(body);
        if (bareImport) {
          ctx.add({
            rule: 'web.build-step',
            severity: 'blocker',
            path,
            line: lineAt(body, bareImport.index),
            message: 'This imports from a package, which cannot resolve without a bundler.',
            fix: 'Write the code without the dependency, or load the library from a CDN with a script tag if it is genuinely needed.',
          });
        }
      }
      if (/(^|\/)package\.json$/i.test(path) && /"dependencies"\s*:\s*{[^}]*"/.test(body)) {
        ctx.add({
          rule: 'web.build-step',
          severity: 'major',
          path,
          message: 'A package.json with dependencies cannot be installed here — there is no shell.',
          fix: 'Remove it and build with what the browser gives you.',
        });
      }
    }
  }

  if (spec.features.includes('save') && !/localStorage|indexedDB/.test(script)) {
    ctx.add({
      rule: 'app.persist',
      severity: 'major',
      path: anyFile,
      message: 'Nothing is saved, so everything the user does disappears on reload.',
      fix: 'Write state to localStorage on every change and read it back on load. Use a versioned key such as "' + spec.slug + '.v1".',
    });
  }

  if (spec.features.includes('timer') || spec.archetype === 'timer') {
    const usesClock = /Date\.now\(\)|performance\.now\(\)|new Date\(\)/.test(script);
    if (/setInterval/.test(script) && !usesClock) {
      ctx.add({
        rule: 'app.timer-drift',
        severity: 'major',
        path: anyFile,
        message: 'The timer counts down inside setInterval without checking the clock, so it drifts — and a background tab throttles it to once a second or less.',
        fix: 'Store the target timestamp once, then compute remaining = target - Date.now() on each tick. The interval becomes a repaint trigger, not the source of truth.',
      });
    }
  }

  if ((spec.archetype === 'budget' || spec.archetype === 'ecommerce') && !/Math\.round|cents|toFixed\(2\)/.test(script)) {
    ctx.add({
      rule: 'app.money-float',
      severity: 'minor',
      path: anyFile,
      message: 'Money looks like it is being held in floating point, which will eventually be a penny out.',
      fix: 'Store amounts as integer cents and divide by 100 only when displaying.',
    });
  }

  if (spec.archetype === 'drawing' && !/devicePixelRatio/.test(script)) {
    ctx.add({
      rule: 'app.canvas-dpr',
      severity: 'minor',
      path: anyFile,
      message: 'The canvas is not scaled for the device pixel ratio, so strokes will look soft on a phone or a retina screen.',
      fix: 'Set canvas.width = cssWidth * devicePixelRatio and ctx.scale(dpr, dpr) — and redraw after any resize, because resizing clears the canvas.',
    });
  }

  if (spec.archetype === 'resume' && !/@media\s+print/i.test(ctx.allStyle)) {
    ctx.add({
      rule: 'site.print',
      severity: 'major',
      path: 'styles.css',
      message: 'A résumé with no print stylesheet will print with a dark background and split sections.',
      fix: 'Add @media print: black on white, navigation hidden, page-break-inside: avoid on each entry.',
    });
  }

  if (spec.kind === 'viz' && /canvas|<svg/i.test(raw)) {
    const labelled = /fillText|<text/i.test(raw);
    if (!labelled) {
      ctx.add({
        rule: 'viz.axis-labels',
        severity: 'major',
        path: anyFile,
        message: 'The charts have no text on them, so no axis is labelled and no unit is stated.',
        fix: 'Label both axes, name every series, and state the unit once. A chart without units is decoration.',
      });
    }
  }
}

/* ---------------------------------------------------------------- games */

function checkGame(ctx: Ctx, spec: Spec): void {
  const archetype = archetypeById(spec.archetype);
  const wanted = new Set(archetype.checks);
  const script = ctx.allScriptBare;
  const raw = ctx.allScript;
  const path = mainScriptPath(ctx);
  const want = (rule: string) => wanted.has(rule);

  if (want('game.loop') && !/requestAnimationFrame/.test(script)) {
    ctx.add({
      rule: 'game.loop',
      severity: 'blocker',
      path,
      message: 'There is no animation loop, so nothing on screen can move.',
      fix: 'Drive the game from requestAnimationFrame, and scale every movement by the elapsed time between frames.',
    });
  }

  if (want('game.delta-time') && /requestAnimationFrame/.test(script)) {
    const usesTime = /\b(dt|delta|elapsed|deltaTime)\b/.test(script) || /performance\.now\(\)|\bnow\s*-\s*last/.test(script);
    if (!usesTime) {
      ctx.add({
        rule: 'game.delta-time',
        severity: 'major',
        path,
        message: 'The loop moves things by a fixed amount per frame, so the game runs at double speed on a 120 Hz screen and half speed on a slow one.',
        fix: 'Take the timestamp requestAnimationFrame passes in, work out the seconds since the last frame, and multiply every movement by it.',
      });
    }
  }

  if (want('game.touch-input')) {
    const touch = /pointerdown|pointermove|touchstart|touchmove|['"]click['"]|onclick/.test(raw);
    if (!touch) {
      ctx.add({
        rule: 'game.touch-input',
        severity: 'major',
        path,
        message: 'The only controls are on the keyboard, so the game cannot be played on a phone at all.',
        fix: 'Add pointer or touch handlers for every action — a swipe, a tap zone, or on-screen buttons. Roughly half the people who open this will be on a phone.',
      });
    }
  }

  if (want('game.key-scroll') && /keydown|keyup/.test(raw)) {
    const guards = /preventDefault/.test(raw);
    const usesScrollKeys = /Arrow(Up|Down|Left|Right)|['"] ['"]|Space/.test(raw);
    if (usesScrollKeys && !guards) {
      ctx.add({
        rule: 'game.key-scroll',
        severity: 'major',
        path,
        message: 'Arrow keys and space are read but never prevented, so playing scrolls the page underneath the game.',
        fix: 'Call event.preventDefault() in the keydown handler for the keys the game uses.',
      });
    }
  }

  if (want('game.lose-state') && !/game ?over|gameOver|isOver|\bdead\b|\blost\b|lose\(|defeat/i.test(raw)) {
    ctx.add({
      rule: 'game.lose-state',
      severity: 'major',
      path,
      message: 'There is no way to lose, so there is no game — just a toy.',
      fix: 'Add a fail condition and a screen that says what the score was, then offer a restart.',
    });
  }

  if (want('game.restart') && !/restart|resetGame|newGame|playAgain|tryAgain|\breset\(/i.test(raw)) {
    ctx.add({
      rule: 'game.restart',
      severity: 'major',
      path,
      message: 'There is no way to play again without reloading the page.',
      fix: 'Write a restart that resets every piece of state — score, position, speed, entities, timers — and bind it to a button and a key.',
    });
  }

  if (want('game.score') && !/\bscore\b/i.test(raw)) {
    ctx.add({
      rule: 'game.score',
      severity: 'major',
      path,
      message: 'Nothing is scored, so there is no reason to play twice.',
      fix: 'Keep a score, show it while playing, and save the best one to localStorage.',
    });
  }

  if (want('game.spawn-offscreen')) {
    // Anything a player must react to has to enter from outside the field.
    // Every correct implementation contains an off-field spawn expression —
    // a negative coordinate, or one beyond the right edge. Its absence is a
    // reliable signal that things are appearing on top of the player.
    const offscreen =
      /(?:spawn|start|enter|note|obstacle|enemy|pipe|bullet|x|y)\w*\s*[:=]\s*-\s*\d/i.test(script) ||
      /[:=]\s*[^;\n]{0,40}\b(?:canvas\.)?(?:width|height|W|H|VIEW_W|VIEW_H)\s*\+\s*\d/.test(script);
    if (!offscreen) {
      ctx.add({
        rule: 'game.spawn-offscreen',
        severity: 'blocker',
        path,
        message:
          'Nothing is created outside the visible field, which means the things the player has to react to appear already on top of them. This is unplayable, and it is the single most common way this kind of game ships broken.',
        fix:
          'Spawn every obstacle, enemy or note off screen — above the top edge, or beyond the right edge — and let it travel in. ' +
          'Work out how long it is visible before it matters (distance ÷ speed) and state that number. It must be at least 1.2 seconds.',
      });
    }

    // The same bug stated outright: a note created at the hit line. Matched a
    // line at a time so it cannot be triggered by two unrelated statements.
    const hitLinePattern = /(?=.*\b(?:push|spawn|create|add|unshift)\w*\s*\()(?=.*\by\s*[:=]\s*(?:hitLine|hitY|HIT_Y|HITLINE|targetY|TARGET_Y|judgeLine|JUDGE_Y|goalY|GOAL_Y)\b).*/m;
    const where = locate(ctx, hitLinePattern);
    if (hitLinePattern.test(script)) {
      ctx.add({
        rule: 'game.spawn-offscreen',
        severity: 'blocker',
        path: where.path,
        line: where.line,
        message: 'Something is created at the hit line itself, so the player has zero time to react to it.',
        fix: 'A note is scheduled by the time it must be hit. Create it travelTime seconds earlier, off the top of the field, and derive its position from how long ago it was created.',
      });
    }
  }

  if (want('game.collision') && !/Math\.(?:abs|hypot|sqrt)|\bintersect|\boverlap|\bcollide|\bhitTest/i.test(script)) {
    ctx.add({
      rule: 'game.collision',
      severity: 'minor',
      path,
      message: 'No collision maths anywhere — nothing appears to be able to hit anything.',
      fix: 'Add a real overlap test. For boxes compare edges; for circles compare the distance between centres with the sum of the radii.',
    });
  }

  if (want('game.difficulty')) {
    const ramps = /speed\s*[+*]=|\+=\s*0\.\d|level\s*\+\+|difficulty|Math\.min\([^)]*speed|Math\.max\([^)]*interval/i.test(script);
    if (!ramps) {
      ctx.add({
        rule: 'game.difficulty',
        severity: 'minor',
        path,
        message: 'The difficulty never changes, so the game is the same at 30 seconds as at 3 minutes.',
        fix: 'Raise the speed or the spawn rate gradually, and cap it so it stays possible.',
      });
    }
  }

  if (want('game.audio-unlock') && /AudioContext/.test(raw)) {
    if (!/\.resume\(\)/.test(raw)) {
      ctx.add({
        rule: 'game.audio-unlock',
        severity: 'major',
        path,
        message: 'An AudioContext is created but never resumed, so there will be no sound until the page is reloaded after a click — often no sound at all.',
        fix: 'Create or resume() the context inside the first real user gesture (the start button, the first key press). Browsers suspend any context made before that.',
      });
    }
  }
}

/* ================================================================
   Reporting
   ================================================================ */

export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  const counts: Record<Severity, number> = { blocker: 0, major: 0, minor: 0 };
  for (const f of findings) counts[f.severity]++;
  return counts;
}

/** One line for the activity strip and the tool summary. */
export function summarise(findings: Finding[]): string {
  const c = countBySeverity(findings);
  if (!findings.length) return 'Nothing wrong found';
  const parts: string[] = [];
  if (c.blocker) parts.push(`${c.blocker} blocker${c.blocker === 1 ? '' : 's'}`);
  if (c.major) parts.push(`${c.major} major`);
  if (c.minor) parts.push(`${c.minor} minor`);
  return parts.join(', ');
}

/** The message fed back to whoever is building, when something needs fixing. */
export function reviewReport(findings: Finding[], opts: { final?: boolean } = {}): string {
  if (!findings.length) {
    return 'Review passed: no blockers, no majors, no minors. The project is structurally sound, runnable, responsive and free of placeholder content.';
  }

  const c = countBySeverity(findings);
  const lines: string[] = [
    `Review of what is actually in the project — ${summarise(findings)}.`,
    '',
  ];

  for (const severity of ['blocker', 'major', 'minor'] as const) {
    const group = findings.filter((f) => f.severity === severity);
    if (!group.length) continue;
    lines.push(
      severity === 'blocker'
        ? 'BLOCKERS — the project does not work until these are fixed:'
        : severity === 'major'
          ? 'MAJOR — it runs, but it is not finished:'
          : 'MINOR — worth doing if there is time:',
    );
    for (const f of group.slice(0, 14)) {
      lines.push(`- [${f.rule}] ${f.path}${f.line ? `:${f.line}` : ''} — ${f.message}`);
      lines.push(`  Fix: ${f.fix}`);
    }
    if (group.length > 14) lines.push(`  …and ${group.length - 14} more of the same kind.`);
    lines.push('');
  }

  if (opts.final !== true && (c.blocker || c.major)) {
    lines.push(
      'Fix the blockers and the majors now — read each file first, then edit it. Do not reply to the user until they are gone. ' +
        'When you have fixed them, call review_project again to confirm.',
    );
  }
  return lines.join('\n');
}
