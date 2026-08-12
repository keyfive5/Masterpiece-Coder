import { DesignSystem, Spec } from '../types';
import { Piece } from './games';

/**
 * Applications: things with state that has to survive a reload.
 *
 * Each one is written the way the knowledge base says it should be — state in
 * one object, the view rendered from it, user text set with textContent, and
 * saved on every change rather than on unload, which does not fire reliably on
 * a phone.
 */

/* ================================================================
   List app — to-do, groceries, reading list, anything with items
   ================================================================ */

export function listApp(spec: Spec, _design: DesignSystem): Piece {
  const noun = spec.subject ? spec.subject.split(' ')[0] : 'task';
  const nounPlural = noun.endsWith('s') ? noun : `${noun}s`;

  const script = `/* --- ${spec.title} ---------------------------------------------------
   One array of items is the only truth; the list is rendered from it every
   time. Nothing is ever read back out of the DOM, which is what stops
   filtering losing items and reordering duplicating them.

   Item text goes in with textContent. Never innerHTML: a ${noun} called
   <img onerror=alert(1)> would otherwise run. */

var KEY = '${spec.slug}.v1';

var items = load();
var filter = 'all';

var listEl = document.getElementById('list');
var formEl = document.getElementById('add-form');
var inputEl = document.getElementById('add-input');
var countEl = document.getElementById('count');
var emptyEl = document.getElementById('empty');
var clearEl = document.getElementById('clear-done');

function load() {
  var saved = Engine.store.get(KEY, null);
  return Array.isArray(saved) ? saved : [];
}

function save() {
  Engine.store.set(KEY, items);
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
}

function add(text) {
  var trimmed = text.trim();
  if (!trimmed) return;
  items.unshift({ id: uid(), text: trimmed, done: false, createdAt: Date.now() });
  save();
  render();
}

function toggle(id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) { items[i].done = !items[i].done; break; }
  }
  save();
  render();
}

function remove(id) {
  items = items.filter(function (item) { return item.id !== id; });
  save();
  render();
}

function rename(id, text) {
  var trimmed = text.trim();
  if (!trimmed) return remove(id);
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === id) { items[i].text = trimmed; break; }
  }
  save();
  render();
}

function visible() {
  if (filter === 'active') return items.filter(function (i) { return !i.done; });
  if (filter === 'done') return items.filter(function (i) { return i.done; });
  return items;
}

function render() {
  var shown = visible();
  listEl.textContent = '';

  for (var i = 0; i < shown.length; i++) {
    listEl.appendChild(row(shown[i]));
  }

  var left = items.filter(function (i) { return !i.done; }).length;
  countEl.textContent = items.length === 0
    ? 'Nothing yet'
    : left + ' of ' + items.length + ' ${nounPlural} left';

  emptyEl.hidden = shown.length > 0;
  emptyEl.textContent = items.length === 0
    ? 'No ${nounPlural} yet. Type one above and press Enter.'
    : filter === 'done' ? 'Nothing finished yet.' : 'Nothing left here — try another filter.';

  clearEl.hidden = !items.some(function (i) { return i.done; });
}

function row(item) {
  var li = document.createElement('li');
  li.className = 'item' + (item.done ? ' is-done' : '');

  var check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'item__check';
  check.checked = item.done;
  check.id = 'chk-' + item.id;
  check.addEventListener('change', function () { toggle(item.id); });

  var label = document.createElement('label');
  label.className = 'item__text';
  label.setAttribute('for', check.id);
  label.textContent = item.text;                    /* never innerHTML */

  /* Double click to edit in place; Escape cancels, Enter and blur commit. */
  label.addEventListener('dblclick', function () {
    var editor = document.createElement('input');
    editor.type = 'text';
    editor.className = 'item__editor';
    editor.value = item.text;
    li.replaceChild(editor, label);
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);

    var cancelled = false;
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') editor.blur();
      if (e.key === 'Escape') { cancelled = true; editor.blur(); }
    });
    editor.addEventListener('blur', function () {
      if (cancelled) render();
      else rename(item.id, editor.value);
    });
  });

  var del = document.createElement('button');
  del.type = 'button';
  del.className = 'item__delete';
  del.textContent = 'Delete';
  del.setAttribute('aria-label', 'Delete ' + item.text);
  del.addEventListener('click', function () { remove(item.id); });

  li.appendChild(check);
  li.appendChild(label);
  li.appendChild(del);
  return li;
}

formEl.addEventListener('submit', function (e) {
  e.preventDefault();
  add(inputEl.value);
  inputEl.value = '';
  inputEl.focus();                                  /* so a list can be typed straight through */
});

var filterButtons = document.querySelectorAll('[data-filter]');
for (var f = 0; f < filterButtons.length; f++) {
  (function (button) {
    button.addEventListener('click', function () {
      filter = button.dataset.filter;
      for (var b = 0; b < filterButtons.length; b++) {
        filterButtons[b].setAttribute('aria-pressed', filterButtons[b] === button ? 'true' : 'false');
      }
      render();
    });
  })(filterButtons[f]);
}

clearEl.addEventListener('click', function () {
  items = items.filter(function (i) { return !i.done; });
  save();
  render();
});

render();
inputEl.focus();
`;

  const markup = `      <form class="add" id="add-form">
        <input id="add-input" class="add__input" type="text" autocomplete="off"
               placeholder="Add a ${noun} and press Enter" aria-label="New ${noun}">
        <button type="submit" class="btn">Add</button>
      </form>

      <div class="bar">
        <p class="muted" id="count">Nothing yet</p>
        <div class="filters" role="group" aria-label="Filter">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="active" aria-pressed="false">Active</button>
          <button type="button" data-filter="done" aria-pressed="false">Done</button>
        </div>
        <button type="button" class="link" id="clear-done" hidden>Clear finished</button>
      </div>

      <ul class="list" id="list"></ul>
      <p class="empty" id="empty">No ${nounPlural} yet. Type one above and press Enter.</p>`;

  const css = `
.add { display: flex; gap: 10px; }
.add__input {
  flex: 1;
  min-height: 48px;
  padding: 0 14px;
  font: inherit;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.add__input::placeholder { color: var(--ink-dim); }

.bar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.bar .muted { margin-right: auto; }

.filters { display: flex; gap: 4px; padding: 3px; background: var(--surface-alt); border-radius: var(--radius); }
.filters button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: calc(var(--radius) - 2px);
  color: var(--ink-dim);
  font-size: 0.9rem;
}
.filters button[aria-pressed="true"] { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

.link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; font-size: 0.9rem; }

.list { list-style: none; padding: 0; display: grid; gap: 8px; }
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.item__check { width: 20px; height: 20px; accent-color: var(--accent); flex: none; }
.item__text { flex: 1; cursor: pointer; word-break: break-word; }
.item.is-done .item__text { color: var(--ink-dim); text-decoration: line-through; }
.item__editor {
  flex: 1;
  font: inherit;
  color: var(--ink);
  background: var(--surface-alt);
  border: 1px solid var(--accent);
  border-radius: 6px;
  padding: 4px 8px;
}
.item__delete { color: var(--ink-dim); font-size: 0.85rem; opacity: 0; transition: opacity var(--motion); }
.item:hover .item__delete, .item__delete:focus-visible { opacity: 1; }
@media (hover: none) { .item__delete { opacity: 1; } }

.empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--ink-dim);
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
.empty[hidden] { display: none; }`;

  return {
    script,
    markup,
    css,
    howTo: [
      `Type a ${noun} and press Enter.`,
      'Click the checkbox to finish one; double-click the text to edit it.',
      'The filters show all, unfinished, or finished. Everything is saved as you go.',
    ],
    notes: [
      'One array is the only source of truth and the list is re-rendered from it, so filtering and reordering cannot lose or duplicate anything.',
      'Item text is written with textContent, so a title containing markup shows as text rather than running.',
      'Saved to localStorage on every change — not on unload, which does not fire reliably on a phone.',
      'The delete button is always visible on touch devices, where there is no hover to reveal it.',
    ],
    engine: true,
    scriptName: 'app.js',
  };
}

/* ================================================================
   Calculator
   ================================================================ */

export function calculator(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   The expression is parsed and evaluated properly: a tokeniser, then a
   precedence-climbing parser. About sixty lines, and unlike eval it cannot
   be handed something that runs code, and unlike a left-to-right chain it
   gets 2 + 3 * 4 right. */

var expression = '';
var lastAnswer = 0;
var justEvaluated = false;

var exprEl = document.getElementById('expr');
var resultEl = document.getElementById('result');

/* ---- tokenise ---- */
function tokenise(source) {
  var tokens = [];
  var i = 0;
  while (i < source.length) {
    var ch = source[i];
    if (ch === ' ') { i++; continue; }
    if (ch >= '0' && ch <= '9' || ch === '.') {
      var start = i;
      while (i < source.length && (source[i] >= '0' && source[i] <= '9' || source[i] === '.')) i++;
      tokens.push({ type: 'number', value: parseFloat(source.slice(start, i)) });
      continue;
    }
    if ('+-*/()%'.indexOf(ch) >= 0) { tokens.push({ type: ch }); i++; continue; }
    throw new Error('Unexpected character');
  }
  return tokens;
}

/* ---- parse and evaluate ---- */
var PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 };

function parse(tokens) {
  var position = 0;

  function peek() { return tokens[position]; }
  function next() { return tokens[position++]; }

  function primary() {
    var token = next();
    if (!token) throw new Error('Unfinished expression');
    if (token.type === 'number') {
      var value = token.value;
      while (peek() && peek().type === '%') { next(); value = value / 100; }
      return value;
    }
    if (token.type === '-') return -primary();
    if (token.type === '+') return primary();
    if (token.type === '(') {
      var inner = expr(1);
      var closing = next();
      if (!closing || closing.type !== ')') throw new Error('Missing closing bracket');
      return inner;
    }
    throw new Error('Unexpected symbol');
  }

  function expr(minPrecedence) {
    var left = primary();
    while (true) {
      var token = peek();
      if (!token || !PRECEDENCE[token.type] || PRECEDENCE[token.type] < minPrecedence) break;
      next();
      var right = expr(PRECEDENCE[token.type] + 1);
      if (token.type === '+') left = left + right;
      else if (token.type === '-') left = left - right;
      else if (token.type === '*') left = left * right;
      else {
        if (right === 0) throw new Error('divide by zero');
        left = left / right;
      }
    }
    return left;
  }

  var value = expr(1);
  if (position < tokens.length) throw new Error('Unexpected trailing symbol');
  return value;
}

/** 12 significant digits, then trailing zeros stripped: no 0.30000000000000004. */
function format(value) {
  if (!isFinite(value)) return 'Cannot divide by zero';
  var text = Number(value.toPrecision(12)).toString();
  if (text.indexOf('e') >= 0) return Number(value).toExponential(6);
  return text;
}

function preview() {
  exprEl.textContent = expression || '0';
  if (!expression) { resultEl.textContent = '0'; return; }
  try {
    var value = parse(tokenise(expression));
    resultEl.textContent = format(value);
    resultEl.classList.remove('is-error');
  } catch (err) {
    resultEl.textContent = '';
  }
  fitDisplay();
}

function fitDisplay() {
  var length = resultEl.textContent.length;
  resultEl.style.fontSize = length > 15 ? '1.6rem' : length > 11 ? '2.2rem' : length > 8 ? '2.8rem' : '3.4rem';
}

function press(key) {
  Engine.audio.tone(440, 0.02, 'sine', 0.05);

  if (key === 'C') { expression = ''; justEvaluated = false; preview(); return; }
  if (key === 'CE') { expression = expression.slice(0, -1); justEvaluated = false; preview(); return; }
  if (key === '=') {
    if (!expression) return;
    try {
      var value = parse(tokenise(expression));
      lastAnswer = value;
      expression = format(value);
      resultEl.classList.remove('is-error');
      justEvaluated = true;
    } catch (err) {
      resultEl.textContent = err.message === 'divide by zero' ? 'Cannot divide by zero' : 'That is not a complete sum';
      resultEl.classList.add('is-error');
      justEvaluated = true;
      exprEl.textContent = expression;
      return;
    }
    exprEl.textContent = expression;
    resultEl.textContent = expression;
    fitDisplay();
    return;
  }
  if (key === '+/-') {
    expression = expression.charAt(0) === '-' ? expression.slice(1) : '-' + expression;
    preview();
    return;
  }

  /* Typing a digit straight after equals starts a new sum; an operator continues. */
  if (justEvaluated) {
    if ('0123456789.'.indexOf(key) >= 0) expression = '';
    justEvaluated = false;
  }
  expression += key;
  preview();
}

var buttons = document.querySelectorAll('[data-key]');
for (var i = 0; i < buttons.length; i++) {
  (function (button) {
    button.addEventListener('click', function () {
      Engine.audio.unlock();
      press(button.dataset.key);
    });
  })(buttons[i]);
}

window.addEventListener('keydown', function (e) {
  var key = e.key;
  if ('0123456789.+-*/()%'.indexOf(key) >= 0 && key.length === 1) { press(key); e.preventDefault(); }
  else if (key === 'Enter' || key === '=') { press('='); e.preventDefault(); }
  else if (key === 'Backspace') { press('CE'); e.preventDefault(); }
  else if (key === 'Escape' || key === 'Delete') { press('C'); e.preventDefault(); }
});

preview();
`;

  const markup = `      <div class="calc">
        <div class="calc__display">
          <p class="calc__expr" id="expr" aria-live="off">0</p>
          <output class="calc__result" id="result" aria-live="polite">0</output>
        </div>

        <div class="calc__keys">
          <button type="button" data-key="C" class="key key--fn">C</button>
          <button type="button" data-key="CE" class="key key--fn">←</button>
          <button type="button" data-key="%" class="key key--fn">%</button>
          <button type="button" data-key="/" class="key key--op">÷</button>

          <button type="button" data-key="7" class="key">7</button>
          <button type="button" data-key="8" class="key">8</button>
          <button type="button" data-key="9" class="key">9</button>
          <button type="button" data-key="*" class="key key--op">×</button>

          <button type="button" data-key="4" class="key">4</button>
          <button type="button" data-key="5" class="key">5</button>
          <button type="button" data-key="6" class="key">6</button>
          <button type="button" data-key="-" class="key key--op">−</button>

          <button type="button" data-key="1" class="key">1</button>
          <button type="button" data-key="2" class="key">2</button>
          <button type="button" data-key="3" class="key">3</button>
          <button type="button" data-key="+" class="key key--op">+</button>

          <button type="button" data-key="+/-" class="key">±</button>
          <button type="button" data-key="0" class="key">0</button>
          <button type="button" data-key="." class="key">.</button>
          <button type="button" data-key="=" class="key key--equals">=</button>
        </div>
      </div>

      <p class="muted small">Keyboard works too — digits, operators, Enter for equals, Backspace to delete, Escape to clear.</p>`;

  const css = `
.calc {
  width: min(100%, 420px);
  margin-inline: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.calc__display {
  padding: 22px 20px 16px;
  text-align: right;
  background: var(--surface-alt);
  min-height: 128px;
  display: grid;
  align-content: end;
  gap: 6px;
}
.calc__expr {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--ink-dim);
  word-break: break-all;
  max-width: none;
}
.calc__result {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 3.4rem;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}
.calc__result.is-error { font-size: 1.2rem; color: var(--bad); }

.calc__keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); }
.key {
  min-height: 68px;
  background: var(--surface);
  font-size: 1.3rem;
  font-weight: 600;
  transition: background var(--motion);
}
.key:hover { background: var(--surface-alt); }
.key:active { background: var(--line); }
.key--fn { color: var(--ink-dim); }
.key--op { color: var(--accent); font-size: 1.5rem; }
.key--equals { background: var(--accent); color: var(--accent-ink); }
.key--equals:hover { background: var(--accent); filter: brightness(1.08); }

.small { font-size: 0.88rem; text-align: center; }

@media (max-width: 420px) { .key { min-height: 60px; } .calc__result { font-size: 2.8rem; } }`;

  return {
    script,
    markup,
    css,
    howTo: [
      'Click the keys or type — digits, + − × ÷, brackets, Enter for equals.',
      'Backspace deletes, Escape clears, ± flips the sign.',
      'The answer previews live as you type; equals commits it.',
    ],
    notes: [
      'Expressions are tokenised and parsed with precedence climbing, so 2 + 3 × 4 is 14 and brackets work. No eval anywhere.',
      'Results are rounded to 12 significant digits and trailing zeros stripped, so 0.1 + 0.2 shows 0.3.',
      'Dividing by zero says so in words instead of showing Infinity.',
      'Keys are at least 60 px tall — comfortably above the 44 px minimum touch target.',
    ],
    engine: true,
    scriptName: 'app.js',
  };
}

/* ================================================================
   Timer / Pomodoro
   ================================================================ */

export function timer(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   The timer is a target timestamp, not a counter. remaining = target -
   Date.now() on every tick, so it stays exact even though a background tab
   throttles setInterval to once a second or slower. Counting down inside
   the interval is the classic way this loses a minute in twenty. */

var KEY = '${spec.slug}.settings';
var DEFAULTS = { work: 25, short: 5, long: 15, rounds: 4 };

var settings = Object.assign({}, DEFAULTS, Engine.store.get(KEY, {}) || {});
var mode = 'work';
var target = 0;
var remaining = settings.work * 60000;
var running = false;
var round = 1;
var ticker = 0;

var timeEl = document.getElementById('time');
var modeEl = document.getElementById('mode');
var roundEl = document.getElementById('round');
var startEl = document.getElementById('start');
var resetEl = document.getElementById('reset');
var skipEl = document.getElementById('skip');
var ringEl = document.getElementById('ring-progress');
var pageTitle = document.title;

var RING = 2 * Math.PI * 130;
ringEl.style.strokeDasharray = String(RING);

function lengthFor(which) {
  return (which === 'work' ? settings.work : which === 'short' ? settings.short : settings.long) * 60000;
}

function label(which) {
  return which === 'work' ? 'Focus' : which === 'short' ? 'Short break' : 'Long break';
}

function format(ms) {
  var total = Math.max(0, Math.ceil(ms / 1000));
  var minutes = Math.floor(total / 60);
  var seconds = total % 60;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function paint() {
  var text = format(remaining);
  timeEl.textContent = text;
  modeEl.textContent = label(mode);
  roundEl.textContent = 'Round ' + round + ' of ' + settings.rounds;
  document.title = running ? text + ' · ' + label(mode) : pageTitle;

  var fraction = 1 - remaining / lengthFor(mode);
  ringEl.style.strokeDashoffset = String(RING * Math.max(0, Math.min(1, fraction)));
  document.body.dataset.mode = mode;
}

function tick() {
  remaining = target - Date.now();
  if (remaining <= 0) {
    remaining = 0;
    paint();
    complete();
    return;
  }
  paint();
}

function start() {
  if (running) return pause();
  Engine.audio.unlock();
  running = true;
  target = Date.now() + remaining;
  startEl.textContent = 'Pause';
  // 250ms so the seconds never appear to skip; the clock is the truth.
  ticker = setInterval(tick, 250);
  paint();
}

function pause() {
  running = false;
  clearInterval(ticker);
  remaining = Math.max(0, target - Date.now());
  startEl.textContent = 'Start';
  paint();
}

function reset() {
  running = false;
  clearInterval(ticker);
  remaining = lengthFor(mode);
  startEl.textContent = 'Start';
  paint();
}

function chime() {
  // Three beeps rather than one: a single tone is easy to miss.
  for (var i = 0; i < 3; i++) {
    (function (n) {
      setTimeout(function () { Engine.audio.tone(880, 0.18, 'triangle', 0.2); }, n * 300);
    })(i);
  }
}

function complete() {
  running = false;
  clearInterval(ticker);
  chime();
  document.body.classList.add('is-done');
  setTimeout(function () { document.body.classList.remove('is-done'); }, 1600);
  advance();
}

function advance() {
  if (mode === 'work') {
    if (round >= settings.rounds) { mode = 'long'; round = 1; }
    else { mode = 'short'; round++; }
  } else {
    mode = 'work';
  }
  remaining = lengthFor(mode);
  startEl.textContent = 'Start';
  paint();
}

startEl.addEventListener('click', start);
resetEl.addEventListener('click', reset);
skipEl.addEventListener('click', function () { clearInterval(ticker); running = false; advance(); });

var inputs = document.querySelectorAll('[data-setting]');
for (var i = 0; i < inputs.length; i++) {
  (function (input) {
    input.value = String(settings[input.dataset.setting]);
    input.addEventListener('change', function () {
      var value = Math.max(1, Math.min(180, Number(input.value) || DEFAULTS[input.dataset.setting]));
      input.value = String(value);
      settings[input.dataset.setting] = value;
      Engine.store.set(KEY, settings);
      if (!running) reset();
    });
  })(inputs[i]);
}

window.addEventListener('keydown', function (e) {
  if (e.key === ' ') { e.preventDefault(); start(); }
  if (e.key === 'r') reset();
});

paint();
`;

  const markup = `      <div class="timer">
        <svg class="ring" viewBox="0 0 300 300" role="img" aria-label="Time remaining">
          <circle class="ring__track" cx="150" cy="150" r="130" />
          <circle class="ring__progress" id="ring-progress" cx="150" cy="150" r="130" />
        </svg>
        <div class="timer__readout">
          <p class="timer__mode" id="mode">Focus</p>
          <p class="timer__time" id="time" role="timer" aria-live="off">25:00</p>
          <p class="timer__round muted" id="round">Round 1 of 4</p>
        </div>
      </div>

      <div class="timer__controls">
        <button type="button" class="btn" id="start">Start</button>
        <button type="button" class="btn btn--ghost" id="reset">Reset</button>
        <button type="button" class="btn btn--ghost" id="skip">Skip</button>
      </div>

      <details class="settings">
        <summary>Lengths</summary>
        <div class="settings__grid">
          <label>Focus <input type="number" data-setting="work" min="1" max="180"></label>
          <label>Short break <input type="number" data-setting="short" min="1" max="60"></label>
          <label>Long break <input type="number" data-setting="long" min="1" max="60"></label>
          <label>Rounds <input type="number" data-setting="rounds" min="1" max="12"></label>
        </div>
      </details>

      <p class="muted small">Space starts and pauses. R resets. The remaining time shows in the browser tab.</p>`;

  const css = `
.timer { position: relative; width: min(100%, 340px); margin-inline: auto; aspect-ratio: 1; }
.ring { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring__track { fill: none; stroke: var(--surface-alt); stroke-width: 14; }
.ring__progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke-dashoffset 250ms linear, stroke 400ms var(--motion);
}
body[data-mode="short"] .ring__progress, body[data-mode="long"] .ring__progress { stroke: var(--good); }

.timer__readout { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; gap: 4px; }
.timer__mode { font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); }
.timer__time {
  font-family: var(--font-display);
  font-size: clamp(52px, 16vw, 72px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.timer__round { font-size: 0.9rem; }

.timer__controls { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

.settings { max-width: 480px; margin-inline: auto; width: 100%; }
.settings summary { cursor: pointer; color: var(--ink-dim); padding: 8px 0; }
.settings__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr)); gap: 12px; padding-top: 8px; }
.settings label { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.settings input {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}

.small { text-align: center; font-size: 0.88rem; }

body.is-done { animation: flash 400ms 3 var(--motion); }
@keyframes flash { 50% { background: var(--accent); } }`;

  return {
    script,
    markup,
    css,
    howTo: [
      'Start, pause and reset with the buttons, or space and R.',
      'Focus runs 25 minutes, then a 5 minute break, with a longer one after four rounds. All four lengths are editable and remembered.',
      'The remaining time appears in the browser tab, so it is visible from another window.',
    ],
    notes: [
      'The timer stores a target timestamp and computes the remaining time from Date.now() on every tick — a background tab throttles setInterval, and counting down inside it loses about a minute in twenty.',
      'The display updates every 250 ms so seconds never appear to skip.',
      'The end signal is three 880 Hz beeps 300 ms apart plus a visual flash, because sound alone fails on a muted phone.',
      'The AudioContext is created inside the Start click — one made on page load is suspended and stays silent.',
    ],
    engine: true,
    scriptName: 'app.js',
  };
}

/* ================================================================
   Drawing
   ================================================================ */

export function drawing(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   Two things that are easy to get wrong and ruin a drawing app:

   Setting canvas.width or canvas.height CLEARS the canvas, so a resize has
   to copy the bitmap out and draw it back. And the backing store must be
   sized by devicePixelRatio or every stroke is soft on a phone.

   Pointer events cover mouse, pen and touch in one path, and pointer
   capture means a stroke that leaves the canvas still finishes properly. */

var canvas = document.getElementById('paper');
var ctx = canvas.getContext('2d');
var wrap = document.getElementById('paper-wrap');

var drawing = false;
var last = null;
var undoStack = [];
var MAX_UNDO = 20;

var state = {
  color: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111',
  size: 6,
  erasing: false
};

function sizeCanvas() {
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = wrap.clientWidth;
  var height = Math.max(320, Math.round(width * 0.66));

  /* Copy what is there before resizing, because resizing wipes it. */
  var snapshot = document.createElement('canvas');
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  if (canvas.width && canvas.height) snapshot.getContext('2d').drawImage(canvas, 0, 0);

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  if (snapshot.width) ctx.drawImage(snapshot, 0, 0, snapshot.width / dpr, snapshot.height / dpr);
}

function pushUndo() {
  try {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    document.getElementById('undo').disabled = false;
  } catch (err) { /* nothing to lose if the browser refuses */ }
}

function undo() {
  var image = undoStack.pop();
  if (!image) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.putImageData(image, 0, 0);
  ctx.restore();
  document.getElementById('undo').disabled = undoStack.length === 0;
}

function point(e) {
  var rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: e.pressure > 0 ? e.pressure : 0.5 };
}

canvas.addEventListener('pointerdown', function (e) {
  canvas.setPointerCapture(e.pointerId);
  pushUndo();
  drawing = true;
  last = point(e);
  stroke(last, last);
});

canvas.addEventListener('pointermove', function (e) {
  if (!drawing) return;
  var now = point(e);
  stroke(last, now);
  last = now;
});

function stop() { drawing = false; last = null; }
canvas.addEventListener('pointerup', stop);
canvas.addEventListener('pointercancel', stop);

function stroke(from, to) {
  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.strokeStyle = state.erasing ? background : state.color;
  ctx.lineWidth = state.size * (state.erasing ? 2.4 : 0.6 + to.pressure * 1.1);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  /* A quadratic through the midpoint, or fast strokes look like polygons. */
  ctx.quadraticCurveTo(from.x, from.y, (from.x + to.x) / 2, (from.y + to.y) / 2);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

var swatches = document.querySelectorAll('[data-color]');
for (var i = 0; i < swatches.length; i++) {
  (function (swatch) {
    swatch.style.setProperty('--swatch', swatch.dataset.color);
    swatch.addEventListener('click', function () {
      state.color = getComputedStyle(document.documentElement).getPropertyValue(swatch.dataset.color).trim() || swatch.dataset.color;
      state.erasing = false;
      document.getElementById('erase').setAttribute('aria-pressed', 'false');
      for (var s = 0; s < swatches.length; s++) swatches[s].setAttribute('aria-pressed', swatches[s] === swatch ? 'true' : 'false');
    });
  })(swatches[i]);
}

document.getElementById('size').addEventListener('input', function (e) {
  state.size = Number(e.target.value);
  document.getElementById('size-value').textContent = e.target.value + ' px';
});

document.getElementById('erase').addEventListener('click', function (e) {
  state.erasing = !state.erasing;
  e.currentTarget.setAttribute('aria-pressed', state.erasing ? 'true' : 'false');
});

document.getElementById('undo').addEventListener('click', undo);

document.getElementById('clear').addEventListener('click', function () {
  pushUndo();
  var background = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#fff';
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
});

document.getElementById('save').addEventListener('click', function () {
  var link = document.createElement('a');
  link.download = '${spec.slug}.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

window.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
});

var resizeTimer = 0;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(sizeCanvas, 150);
});

sizeCanvas();
document.getElementById('undo').disabled = true;
`;

  const markup = `      <div class="tools">
        <div class="swatches" role="group" aria-label="Colour">
          <button type="button" class="swatch" data-color="--ink" aria-pressed="true" aria-label="Ink"></button>
          <button type="button" class="swatch" data-color="--accent" aria-pressed="false" aria-label="Accent"></button>
          <button type="button" class="swatch" data-color="--accent-2" aria-pressed="false" aria-label="Second accent"></button>
          <button type="button" class="swatch" data-color="--good" aria-pressed="false" aria-label="Green"></button>
          <button type="button" class="swatch" data-color="--bad" aria-pressed="false" aria-label="Red"></button>
        </div>

        <label class="field field--inline">
          <span>Brush</span>
          <input type="range" id="size" min="1" max="42" value="6">
          <output id="size-value">6 px</output>
        </label>

        <button type="button" class="btn btn--ghost" id="erase" aria-pressed="false">Eraser</button>
        <button type="button" class="btn btn--ghost" id="undo">Undo</button>
        <button type="button" class="btn btn--ghost" id="clear">Clear</button>
        <button type="button" class="btn" id="save">Save PNG</button>
      </div>

      <div class="paper-wrap" id="paper-wrap">
        <canvas id="paper" aria-label="Drawing area"></canvas>
      </div>

      <p class="muted small">Mouse, finger or pen. Pressure is used where the device reports it. Ctrl+Z undoes.</p>`;

  const css = `
.tools { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.swatches { display: flex; gap: 6px; }
.swatch {
  --swatch: var(--ink);
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--swatch);
  border: 2px solid var(--line);
}
.swatch[aria-pressed="true"] { outline: 2px solid var(--accent); outline-offset: 2px; }

.field--inline { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--ink-dim); }
.field--inline input[type="range"] { width: 120px; accent-color: var(--accent); }
.field--inline output { font-variant-numeric: tabular-nums; min-width: 46px; }

.paper-wrap { width: 100%; }
.paper-wrap canvas {
  display: block;
  width: 100%;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  touch-action: none;         /* or drawing scrolls the page on a phone */
  cursor: crosshair;
}

.small { font-size: 0.88rem; }`;

  return {
    script,
    markup,
    css,
    howTo: [
      'Draw with a mouse, a finger or a pen — pressure is used where the device reports it.',
      'Pick a colour, change the brush size, or switch to the eraser.',
      'Ctrl+Z undoes up to 20 strokes. Save PNG downloads what is on the paper.',
    ],
    notes: [
      'The canvas backing store is sized by devicePixelRatio, so strokes are sharp on a phone and on a retina screen.',
      'A resize copies the bitmap out and draws it back, because setting canvas.width clears it — that is why drawings normally vanish when the window changes.',
      'touch-action: none plus pointer capture, so drawing does not scroll the page and a stroke that leaves the canvas still finishes.',
      'Strokes are interpolated with a quadratic through the midpoint, otherwise a fast line looks like a polygon.',
    ],
    engine: true,
    scriptName: 'app.js',
  };
}
