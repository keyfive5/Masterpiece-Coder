import { DesignSystem, Spec } from '../types';
import { Piece } from './games';

/**
 * Games that are better as real DOM than as a canvas: grids of things you
 * click. Doing these as elements rather than pixels means they are accessible,
 * they scale to any screen for free, and the browser handles the focus.
 */

/* ================================================================
   Memory match
   ================================================================ */

export function memory(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   Input is locked while two cards are face up and while the flip-back timer
   runs. Without that lock, clicking quickly reveals the whole board — which
   is the way every memory game is broken. */

var SYMBOLS = ['\\u25B2', '\\u25CF', '\\u25A0', '\\u25C6', '\\u2605', '\\u271A', '\\u25D0', '\\u2726', '\\u25B6', '\\u2756', '\\u25C9', '\\u2725', '\\u2739', '\\u25CB', '\\u25B0'];
var SIZES = { easy: [4, 3], normal: [4, 4], hard: [6, 5] };

var board = document.getElementById('board');
var movesEl = document.getElementById('moves');
var pairsEl = document.getElementById('pairs');
var timeEl = document.getElementById('time');
var bestEl = document.getElementById('best');
var statusEl = document.getElementById('status');
var difficulty = document.getElementById('difficulty');

var cards = [], first = null, second = null, locked = false;
var moves = 0, matched = 0, total = 0, startedAt = 0, ticker = 0;

function best(key) { return Engine.store.get('${spec.slug}.best.' + key, null); }

function newGame() {
  var size = SIZES[difficulty.value] || SIZES.normal;
  var pairs = (size[0] * size[1]) / 2;
  var deck = [];
  for (var i = 0; i < pairs; i++) {
    deck.push({ symbol: SYMBOLS[i % SYMBOLS.length], pair: i });
    deck.push({ symbol: SYMBOLS[i % SYMBOLS.length], pair: i });
  }
  Engine.shuffle(deck);

  cards = deck;
  first = second = null;
  locked = false;
  moves = 0;
  matched = 0;
  total = pairs;
  startedAt = 0;
  clearInterval(ticker);
  timeEl.textContent = '0s';
  movesEl.textContent = '0';
  pairsEl.textContent = '0 / ' + pairs;
  statusEl.textContent = 'Find every pair.';
  bestEl.textContent = best(difficulty.value) == null ? '—' : best(difficulty.value) + ' moves';

  board.style.setProperty('--cols', String(size[0]));
  board.textContent = '';
  for (var c = 0; c < cards.length; c++) {
    board.appendChild(makeCard(cards[c], c));
  }
}

function makeCard(card, index) {
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-tile';
  button.setAttribute('aria-label', 'Card ' + (index + 1) + ', face down');
  button.dataset.index = String(index);

  var inner = document.createElement('span');
  inner.className = 'card-tile__inner';

  var back = document.createElement('span');
  back.className = 'card-tile__face card-tile__back';

  var front = document.createElement('span');
  front.className = 'card-tile__face card-tile__front';
  front.textContent = card.symbol;

  inner.appendChild(back);
  inner.appendChild(front);
  button.appendChild(inner);
  button.addEventListener('click', function () { flip(button, card); });
  return button;
}

function startClock() {
  if (startedAt) return;
  startedAt = Date.now();
  // Driven from the timestamp, so a throttled tab cannot make it run slow.
  ticker = setInterval(function () {
    timeEl.textContent = Math.round((Date.now() - startedAt) / 1000) + 's';
  }, 250);
}

function flip(button, card) {
  if (locked) return;
  if (button.classList.contains('is-up') || button.classList.contains('is-matched')) return;

  Engine.audio.tone(520, 0.05, 'sine', 0.08);
  startClock();
  button.classList.add('is-up');
  button.setAttribute('aria-label', 'Card showing ' + card.symbol);

  if (!first) { first = { button: button, card: card }; return; }

  second = { button: button, card: card };
  moves++;
  movesEl.textContent = String(moves);
  locked = true;

  if (first.card.pair === second.card.pair) {
    var a = first.button, b = second.button;
    setTimeout(function () {
      a.classList.add('is-matched');
      b.classList.add('is-matched');
      a.disabled = true;
      b.disabled = true;
      matched++;
      pairsEl.textContent = matched + ' / ' + total;
      Engine.audio.tone(880, 0.09, 'triangle', 0.11);
      first = second = null;
      locked = false;
      if (matched === total) finish();
    }, 260);
  } else {
    var x = first.button, y = second.button;
    // 700ms is long enough to memorise and short enough not to be a wait.
    setTimeout(function () {
      x.classList.remove('is-up');
      y.classList.remove('is-up');
      x.setAttribute('aria-label', 'Card face down');
      y.setAttribute('aria-label', 'Card face down');
      first = second = null;
      locked = false;
    }, 700);
  }
}

function finish() {
  clearInterval(ticker);
  var seconds = Math.round((Date.now() - startedAt) / 1000);
  var previous = best(difficulty.value);
  var record = previous == null || moves < previous;
  if (record) Engine.store.set('${spec.slug}.best.' + difficulty.value, moves);
  bestEl.textContent = (record ? moves : previous) + ' moves';
  statusEl.textContent = record
    ? 'All pairs found in ' + moves + ' moves and ' + seconds + 's — a new best.'
    : 'All pairs found in ' + moves + ' moves and ' + seconds + 's.';
  Engine.audio.tone(660, 0.1, 'triangle', 0.12);
  setTimeout(function () { Engine.audio.tone(990, 0.16, 'triangle', 0.12); }, 120);
}

document.getElementById('restart').addEventListener('click', function () {
  Engine.audio.unlock();
  newGame();
});
difficulty.addEventListener('change', newGame);
newGame();
`;

  const markup = `      <div class="toolbar">
        <label class="field">
          <span>Board</span>
          <select id="difficulty">
            <option value="easy">Easy · 6 pairs</option>
            <option value="normal" selected>Normal · 8 pairs</option>
            <option value="hard">Hard · 15 pairs</option>
          </select>
        </label>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <div class="stats">
        <div class="stat"><span>Moves</span><strong id="moves">0</strong></div>
        <div class="stat"><span>Pairs</span><strong id="pairs">0 / 8</strong></div>
        <div class="stat"><span>Time</span><strong id="time">0s</strong></div>
        <div class="stat"><span>Best</span><strong id="best">—</strong></div>
      </div>

      <p class="status" id="status" role="status">Find every pair.</p>
      <div class="board" id="board"></div>`;

  const css = `
.toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
.field { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.field select {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}

.stats { display: flex; gap: calc(var(--space) * 3); flex-wrap: wrap; }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }

.status { color: var(--ink-dim); min-height: 1.6em; }

.board {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  gap: 10px;
  max-width: 620px;
}

.card-tile {
  aspect-ratio: 1;
  padding: 0;
  perspective: 700px;
  background: none;
  border: 0;
}
.card-tile__inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 250ms var(--motion);
  transform-style: preserve-3d;
}
.card-tile.is-up .card-tile__inner,
.card-tile.is-matched .card-tile__inner { transform: rotateY(180deg); }

.card-tile__face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  backface-visibility: hidden;
  font-size: clamp(20px, 6vw, 34px);
}
.card-tile__back {
  background: var(--surface-alt);
  border: 1px solid var(--line);
}
.card-tile__front {
  background: var(--accent);
  color: var(--accent-ink);
  transform: rotateY(180deg);
}
.card-tile.is-matched .card-tile__front { background: var(--good); color: var(--bg); }
.card-tile:disabled { cursor: default; }`;

  return {
    script,
    markup,
    css,
    howTo: ['Click or tap two cards to turn them over.', 'A pair stays face up; anything else turns back after 700 ms.', 'Fewer moves is better — the best score is kept per board size.'],
    notes: [
      'Input is locked while two cards are face up, so clicking quickly cannot reveal the board.',
      'A mismatch stays visible for 700 ms — long enough to memorise, short enough not to be a wait.',
      'The board is a CSS grid with square cards, so it fits any screen without a media query.',
      'The clock is computed from a start timestamp rather than counted up, so a background tab does not slow it down.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Tic-tac-toe
   ================================================================ */

export function tictactoe(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   Hard mode is full minimax. On nine squares the whole tree is about half a
   million positions in the worst case and it evaluates instantly, so there
   is no reason to approximate it — and it genuinely cannot be beaten. */

var LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

var boardEl = document.getElementById('board');
var statusEl = document.getElementById('status');
var tallyEl = { you: document.getElementById('tally-you'), draw: document.getElementById('tally-draw'), cpu: document.getElementById('tally-cpu') };
var modeEl = document.getElementById('mode');

var board, turn, over, thinking;
var tally = Engine.store.get('${spec.slug}.tally', { you: 0, draw: 0, cpu: 0 });

function winner(cells) {
  for (var i = 0; i < LINES.length; i++) {
    var l = LINES[i];
    if (cells[l[0]] && cells[l[0]] === cells[l[1]] && cells[l[1]] === cells[l[2]]) return { mark: cells[l[0]], line: l };
  }
  return cells.indexOf('') === -1 ? { mark: 'draw', line: null } : null;
}

function empties(cells) {
  var list = [];
  for (var i = 0; i < 9; i++) if (!cells[i]) list.push(i);
  return list;
}

/** Returns a score from O's point of view: +10 win, -10 loss, 0 draw. */
function minimax(cells, isO, depth) {
  var result = winner(cells);
  if (result) {
    if (result.mark === 'O') return 10 - depth;
    if (result.mark === 'X') return depth - 10;
    return 0;
  }
  var options = empties(cells);
  var best = isO ? -Infinity : Infinity;
  for (var i = 0; i < options.length; i++) {
    cells[options[i]] = isO ? 'O' : 'X';
    var value = minimax(cells, !isO, depth + 1);
    cells[options[i]] = '';
    best = isO ? Math.max(best, value) : Math.min(best, value);
  }
  return best;
}

function bestMove(cells) {
  var options = empties(cells);
  var best = -Infinity, choice = options[0];
  for (var i = 0; i < options.length; i++) {
    cells[options[i]] = 'O';
    var value = minimax(cells, false, 0);
    cells[options[i]] = '';
    if (value > best) { best = value; choice = options[i]; }
  }
  return choice;
}

/** Easy takes an obvious win or block 60% of the time, otherwise plays freely. */
function easyMove(cells) {
  var options = empties(cells);
  if (Math.random() < 0.6) {
    for (var mark = 0; mark < 2; mark++) {
      var me = mark === 0 ? 'O' : 'X';
      for (var i = 0; i < options.length; i++) {
        cells[options[i]] = me;
        var result = winner(cells);
        cells[options[i]] = '';
        if (result && result.mark === me) return options[i];
      }
    }
  }
  return Engine.pick(options);
}

function render(highlight) {
  boardEl.textContent = '';
  for (var i = 0; i < 9; i++) {
    var cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell' + (highlight && highlight.indexOf(i) >= 0 ? ' is-win' : '');
    cell.textContent = board[i];
    cell.disabled = !!board[i] || over || thinking;
    cell.setAttribute('aria-label', 'Square ' + (i + 1) + (board[i] ? ', ' + board[i] : ', empty'));
    (function (index) {
      cell.addEventListener('click', function () { play(index); });
    })(i);
    boardEl.appendChild(cell);
  }
  tallyEl.you.textContent = String(tally.you);
  tallyEl.draw.textContent = String(tally.draw);
  tallyEl.cpu.textContent = String(tally.cpu);
}

function finish(result) {
  over = true;
  if (result.mark === 'X') { tally.you++; statusEl.textContent = 'You win.'; Engine.audio.tone(880, 0.12, 'triangle', 0.13); }
  else if (result.mark === 'O') { tally.cpu++; statusEl.textContent = 'The computer wins.'; Engine.audio.sweep(400, 150, 0.3, 0.12); }
  else { tally.draw++; statusEl.textContent = 'A draw.'; Engine.audio.tone(300, 0.14, 'sine', 0.1); }
  Engine.store.set('${spec.slug}.tally', tally);
  render(result.line);
}

function play(index) {
  if (over || thinking || board[index]) return;
  Engine.audio.unlock();
  board[index] = 'X';
  Engine.audio.tone(560, 0.05, 'square', 0.09);

  var result = winner(board);
  if (result) return finish(result);

  thinking = true;
  render();
  statusEl.textContent = 'Thinking…';
  // A visible pause, so the reply reads as a move rather than a flicker.
  setTimeout(function () {
    var move = modeEl.value === 'hard' ? bestMove(board.slice()) : easyMove(board.slice());
    board[move] = 'O';
    Engine.audio.tone(400, 0.05, 'square', 0.09);
    thinking = false;
    var after = winner(board);
    if (after) return finish(after);
    statusEl.textContent = 'Your turn.';
    render();
  }, 300);
}

function reset() {
  board = ['', '', '', '', '', '', '', '', ''];
  turn = 'X';
  over = false;
  thinking = false;
  statusEl.textContent = 'Your turn. You are X.';
  render();
}

document.getElementById('restart').addEventListener('click', reset);
modeEl.addEventListener('change', reset);
reset();
`;

  const markup = `      <div class="toolbar">
        <label class="field">
          <span>Computer</span>
          <select id="mode">
            <option value="easy" selected>Easy — beatable</option>
            <option value="hard">Perfect — cannot lose</option>
          </select>
        </label>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <p class="status" id="status" role="status">Your turn. You are X.</p>
      <div class="board" id="board"></div>

      <div class="stats">
        <div class="stat"><span>You</span><strong id="tally-you">0</strong></div>
        <div class="stat"><span>Draws</span><strong id="tally-draw">0</strong></div>
        <div class="stat"><span>Computer</span><strong id="tally-cpu">0</strong></div>
      </div>`;

  const css = `
.toolbar { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
.field { display: grid; gap: 4px; font-size: 0.85rem; color: var(--ink-dim); }
.field select {
  min-height: 44px; padding: 0 12px; font: inherit; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}
.status { color: var(--ink-dim); min-height: 1.6em; }

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: min(100%, 380px);
}
.cell {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: clamp(38px, 12vw, 62px);
  font-weight: 700;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: background var(--motion);
}
.cell:hover:not(:disabled) { background: var(--surface-alt); }
.cell.is-win { background: var(--accent); color: var(--accent-ink); }

.stats { display: flex; gap: calc(var(--space) * 3); }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }`;

  return {
    script,
    markup,
    css,
    howTo: ['Click a square. You are X and you go first.', 'Easy can be beaten; Perfect runs full minimax and cannot lose.', 'The running tally is kept between visits.'],
    notes: [
      'Perfect mode is a complete minimax search — nine squares is small enough to solve exactly, and it returns instantly.',
      'A draw is checked after the win test, so a full board never leaves the game hanging.',
      'The computer chooses from the list of empty squares, so it can never play into an occupied one.',
      'It replies after 300 ms so the move is visible rather than instantaneous.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Sliding numbers
   ================================================================ */

export function sliding(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   Two rules make this correct rather than nearly correct:
   a tile that has merged this move is flagged and cannot merge again, so
   2 2 4 becomes 4 4 and not 8; and a new tile only appears when the board
   actually changed. */

var SIZE = 4;
var gridEl = document.getElementById('grid');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');
var statusEl = document.getElementById('status');

var cells, score, best, previous, over, won;

best = Number(Engine.store.get('${spec.slug}.best', 0)) || 0;

function empty() {
  var list = [];
  for (var i = 0; i < SIZE * SIZE; i++) if (!cells[i]) list.push(i);
  return list;
}

function addTile() {
  var free = empty();
  if (!free.length) return;
  cells[Engine.pick(free)] = { value: Math.random() < 0.9 ? 2 : 4, fresh: true, merged: false };
}

function reset() {
  cells = new Array(SIZE * SIZE).fill(null);
  score = 0;
  over = false;
  won = false;
  previous = null;
  addTile();
  addTile();
  statusEl.textContent = 'Slide to combine matching numbers.';
  render();
}

function serialise() {
  return cells.map(function (c) { return c ? c.value : 0; }).join(',');
}

function line(indices) {
  var values = [];
  for (var i = 0; i < indices.length; i++) if (cells[indices[i]]) values.push(cells[indices[i]]);

  var out = [];
  for (var v = 0; v < values.length; v++) {
    var current = values[v];
    var next = values[v + 1];
    if (next && next.value === current.value) {
      out.push({ value: current.value * 2, fresh: false, merged: true });
      score += current.value * 2;
      v++;                                  /* the merged pair is consumed */
    } else {
      out.push({ value: current.value, fresh: false, merged: false });
    }
  }
  while (out.length < indices.length) out.push(null);
  for (var k = 0; k < indices.length; k++) cells[indices[k]] = out[k];
}

function move(direction) {
  if (over) return;
  var before = serialise();
  previous = { cells: cells.map(function (c) { return c ? { value: c.value, fresh: false, merged: false } : null; }), score: score };

  for (var i = 0; i < SIZE; i++) {
    var indices = [];
    for (var j = 0; j < SIZE; j++) {
      if (direction === 'left') indices.push(i * SIZE + j);
      else if (direction === 'right') indices.push(i * SIZE + (SIZE - 1 - j));
      else if (direction === 'up') indices.push(j * SIZE + i);
      else indices.push((SIZE - 1 - j) * SIZE + i);
    }
    line(indices);
  }

  if (serialise() === before) { previous = null; return; }

  Engine.audio.tone(300, 0.04, 'sine', 0.06);
  addTile();
  render();

  if (!won) {
    for (var t = 0; t < cells.length; t++) {
      if (cells[t] && cells[t].value >= 2048) {
        won = true;
        statusEl.textContent = 'You made 2048. Keep going if you like.';
        Engine.audio.tone(880, 0.14, 'triangle', 0.13);
        break;
      }
    }
  }
  if (!movesRemain()) {
    over = true;
    statusEl.textContent = 'No moves left. Final score ' + score + '.';
    Engine.audio.sweep(360, 120, 0.35, 0.14);
  }
}

/** Game over needs a merge test as well as an empty-cell test. */
function movesRemain() {
  if (empty().length) return true;
  for (var y = 0; y < SIZE; y++) {
    for (var x = 0; x < SIZE; x++) {
      var here = cells[y * SIZE + x];
      if (x < SIZE - 1 && cells[y * SIZE + x + 1] && cells[y * SIZE + x + 1].value === here.value) return true;
      if (y < SIZE - 1 && cells[(y + 1) * SIZE + x] && cells[(y + 1) * SIZE + x].value === here.value) return true;
    }
  }
  return false;
}

function undo() {
  if (!previous) return;
  cells = previous.cells;
  score = previous.score;
  previous = null;
  over = false;
  statusEl.textContent = 'Took that one back.';
  render();
}

function render() {
  gridEl.textContent = '';
  for (var i = 0; i < cells.length; i++) {
    var tile = document.createElement('div');
    var value = cells[i] ? cells[i].value : 0;
    tile.className = 'tile' + (value ? ' tile--' + Math.min(value, 4096) : ' tile--empty') +
      (cells[i] && cells[i].fresh ? ' is-new' : '') + (cells[i] && cells[i].merged ? ' is-merged' : '');
    tile.textContent = value ? String(value) : '';
    if (cells[i]) cells[i].fresh = false;
    gridEl.appendChild(tile);
  }
  scoreEl.textContent = String(score);
  if (score > best) {
    best = score;
    Engine.store.set('${spec.slug}.best', best);
  }
  bestEl.textContent = String(best);
}

window.addEventListener('keydown', function (e) {
  var map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
  var direction = map[e.key];
  if (!direction) return;
  e.preventDefault();                        /* or the page scrolls as you play */
  Engine.audio.unlock();
  move(direction);
});

Engine.pointer(gridEl, { toLocal: function (x, y) { return { x: x, y: y }; } }, {
  swipe: function (dir) { Engine.audio.unlock(); move(dir); }
});

document.getElementById('restart').addEventListener('click', reset);
document.getElementById('undo').addEventListener('click', undo);
reset();
`;

  const markup = `      <div class="toolbar">
        <div class="stats">
          <div class="stat"><span>Score</span><strong id="score">0</strong></div>
          <div class="stat"><span>Best</span><strong id="best">0</strong></div>
        </div>
        <button type="button" class="btn btn--ghost" id="undo">Undo</button>
        <button type="button" class="btn" id="restart">New game</button>
      </div>

      <p class="status" id="status" role="status">Slide to combine matching numbers.</p>
      <div class="grid" id="grid"></div>`;

  const css = `
.toolbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.stats { display: flex; gap: calc(var(--space) * 3); margin-right: auto; }
.stat { display: grid; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }
.status { color: var(--ink-dim); min-height: 1.6em; }

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  width: min(100%, 460px);
  aspect-ratio: 1;
  background: var(--surface-alt);
  border-radius: var(--radius);
  touch-action: none;
}
.tile {
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  background: var(--surface);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(18px, 6vw, 32px);
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.tile--empty { background: color-mix(in srgb, var(--surface) 50%, transparent); }
.tile--2, .tile--4 { background: var(--surface); }
.tile--8, .tile--16 { background: var(--accent-2); color: var(--bg); }
.tile--32, .tile--64 { background: var(--accent); color: var(--accent-ink); }
.tile--128, .tile--256, .tile--512 { background: var(--good); color: var(--bg); }
.tile--1024, .tile--2048, .tile--4096 { background: var(--bad); color: var(--bg); font-size: clamp(16px, 5vw, 28px); }

.is-new { animation: pop 140ms var(--motion); }
.is-merged { animation: bump 160ms var(--motion); }
@keyframes pop { from { transform: scale(0.4); opacity: 0; } }
@keyframes bump { 50% { transform: scale(1.12); } }`;

  return {
    script,
    markup,
    css,
    howTo: ['Arrow keys, WASD, or swipe.', 'Matching numbers merge. Reach 2048.', 'One level of undo, and the best score is kept.'],
    notes: [
      'A tile that merges is flagged for that move and cannot merge again, so 2 2 4 becomes 4 4 rather than 8.',
      'A new tile only appears when the board actually changed, so a move into a wall does not hand you a free tile.',
      'Game over checks for possible merges as well as for empty cells — a full board is not necessarily finished.',
      'The tile text flips to the background colour above 8, where the tile colour is too light for dark ink.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Quiz
   ================================================================ */

export function quiz(spec: Spec, _design: DesignSystem): Piece {
  const script = `/* --- ${spec.title} ---------------------------------------------------
   The correct answer is stored as its text, not as an index, and the
   options are shuffled as whole values. That is deliberate: shuffling the
   strings while keeping a numeric "correct index" is how almost every quiz
   ends up marking the wrong answer right. */

var ROUND = 10;

var stageEl = document.getElementById('quiz');
var progressEl = document.getElementById('progress');
var scoreEl = document.getElementById('score');
var barEl = document.getElementById('bar');

var deck, index, score, answered, results;

function start() {
  deck = Engine.shuffle(QUESTIONS.slice()).slice(0, Math.min(ROUND, QUESTIONS.length));
  index = 0;
  score = 0;
  results = [];
  scoreEl.textContent = '0';
  show();
}

function show() {
  answered = false;
  var item = deck[index];
  progressEl.textContent = 'Question ' + (index + 1) + ' of ' + deck.length;
  barEl.style.width = Math.round((index / deck.length) * 100) + '%';

  stageEl.textContent = '';

  var question = document.createElement('h2');
  question.className = 'question';
  question.textContent = item.q;
  stageEl.appendChild(question);

  var list = document.createElement('div');
  list.className = 'options';

  var options = Engine.shuffle(item.options.slice());
  for (var i = 0; i < options.length; i++) {
    (function (value, position) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'option';
      var key = document.createElement('kbd');
      key.textContent = String(position + 1);
      var label = document.createElement('span');
      label.textContent = value;
      button.appendChild(key);
      button.appendChild(label);
      button.addEventListener('click', function () { choose(button, value, item); });
      list.appendChild(button);
    })(options[i], i);
  }
  stageEl.appendChild(list);
}

function choose(button, value, item) {
  if (answered) return;
  answered = true;
  Engine.audio.unlock();

  var correct = value === item.answer;
  if (correct) {
    score++;
    scoreEl.textContent = String(score);
    button.classList.add('is-right');
    Engine.audio.tone(880, 0.09, 'triangle', 0.12);
  } else {
    button.classList.add('is-wrong');
    Engine.audio.tone(200, 0.14, 'sawtooth', 0.1);
  }
  results.push({ q: item.q, chosen: value, answer: item.answer, correct: correct });

  var buttons = stageEl.querySelectorAll('.option');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    /* Always show the right answer — a quiz that only says "wrong" teaches nothing. */
    if (buttons[i].lastChild.textContent === item.answer) buttons[i].classList.add('is-right');
  }

  setTimeout(function () {
    index++;
    if (index >= deck.length) finish();
    else show();
  }, 900);
}

function finish() {
  barEl.style.width = '100%';
  progressEl.textContent = 'Finished';
  stageEl.textContent = '';

  var heading = document.createElement('h2');
  heading.className = 'question';
  heading.textContent = 'You scored ' + score + ' out of ' + deck.length;
  stageEl.appendChild(heading);

  var verdict = document.createElement('p');
  verdict.className = 'muted';
  verdict.textContent = score === deck.length ? 'Perfect.' : score >= deck.length * 0.7 ? 'Strong round.' : 'Worth another go.';
  stageEl.appendChild(verdict);

  var review = document.createElement('ul');
  review.className = 'review';
  for (var i = 0; i < results.length; i++) {
    var row = document.createElement('li');
    row.className = results[i].correct ? 'is-right' : 'is-wrong';
    var q = document.createElement('strong');
    q.textContent = results[i].q;
    var a = document.createElement('span');
    a.textContent = results[i].correct ? results[i].answer : 'You said ' + results[i].chosen + ' — it was ' + results[i].answer;
    row.appendChild(q);
    row.appendChild(a);
    review.appendChild(row);
  }
  stageEl.appendChild(review);

  var again = document.createElement('button');
  again.type = 'button';
  again.className = 'btn';
  again.textContent = 'Play again';
  again.addEventListener('click', start);
  stageEl.appendChild(again);
}

window.addEventListener('keydown', function (e) {
  var n = Number(e.key);
  if (!n || n < 1 || n > 4) return;
  var buttons = stageEl.querySelectorAll('.option');
  if (buttons[n - 1]) buttons[n - 1].click();
});

document.getElementById('restart').addEventListener('click', start);
start();
`;

  const markup = `      <div class="toolbar">
        <p id="progress" class="muted">Question 1</p>
        <div class="stat"><span>Score</span><strong id="score">0</strong></div>
        <button type="button" class="btn btn--ghost" id="restart">Restart</button>
      </div>

      <div class="progress"><div class="progress__bar" id="bar"></div></div>
      <div id="quiz" class="quiz"></div>`;

  const css = `
.toolbar { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.toolbar #progress { margin-right: auto; }
.stat { display: flex; align-items: baseline; gap: 8px; }
.stat span { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); }
.stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }

.progress { height: 6px; background: var(--surface-alt); border-radius: 999px; overflow: hidden; }
.progress__bar { height: 100%; width: 0; background: var(--accent); transition: width 300ms var(--motion); }

.quiz { display: grid; gap: calc(var(--space) * 3); }
.question { font-size: var(--step-2); max-width: 30ch; }

.options { display: grid; gap: 10px; max-width: 620px; }
.option {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 12px 16px;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  transition: background var(--motion), border-color var(--motion);
}
.option:hover:not(:disabled) { border-color: var(--accent); }
.option kbd {
  display: grid;
  place-items: center;
  width: 26px; height: 26px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--surface-alt);
  border-radius: 6px;
  color: var(--ink-dim);
  flex: none;
}
.option.is-right { background: var(--good); color: var(--bg); border-color: var(--good); }
.option.is-wrong { background: var(--bad); color: var(--bg); border-color: var(--bad); }
.option.is-right kbd, .option.is-wrong kbd { background: rgba(0,0,0,.2); color: inherit; }

.review { list-style: none; padding: 0; display: grid; gap: 10px; max-width: 640px; }
.review li { display: grid; gap: 2px; padding: 10px 14px; border-left: 3px solid var(--line); background: var(--surface); }
.review li.is-right { border-left-color: var(--good); }
.review li.is-wrong { border-left-color: var(--bad); }
.review span { color: var(--ink-dim); font-size: 0.92rem; }`;

  return {
    script,
    markup,
    css,
    howTo: ['Click an answer, or press 1 to 4.', 'The right answer is always shown, even when you get it wrong.', 'Ten questions a round, drawn at random from the bank.'],
    notes: [
      'The correct answer is stored as text and the whole option values are shuffled, so shuffling can never mark the wrong one right.',
      'Options are disabled the moment one is chosen, so a fast second click cannot score twice.',
      'The bank lives in questions.js on its own — swap in your own subject without touching the game.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/** The bank lives in its own file so it can be swapped without touching the game. */
export const QUIZ_QUESTIONS = `/* The question bank.
   Real, checked general-knowledge questions, so the quiz works out of the box.
   Replace them with your own subject — keep the shape: a question, a list of
   options, and the correct answer written out in full rather than as an index,
   which is what stops shuffling from breaking the marking. */

var QUESTIONS = [
  { q: 'Which planet has the shortest day in the solar system?', options: ['Mercury', 'Jupiter', 'Mars', 'Neptune'], answer: 'Jupiter' },
  { q: 'What is the largest organ of the human body?', options: ['The liver', 'The skin', 'The lungs', 'The brain'], answer: 'The skin' },
  { q: 'In which country would you find the city of Marrakesh?', options: ['Egypt', 'Tunisia', 'Morocco', 'Algeria'], answer: 'Morocco' },
  { q: 'What does the "www" in a web address stand for?', options: ['World Wide Web', 'Web Wide World', 'Wide Web World', 'World Web Wide'], answer: 'World Wide Web' },
  { q: 'Which element has the chemical symbol "Au"?', options: ['Silver', 'Aluminium', 'Gold', 'Argon'], answer: 'Gold' },
  { q: 'How many minutes are there in a full week?', options: ['10,080', '7,200', '1,440', '43,200'], answer: '10,080' },
  { q: 'Which ocean is the deepest?', options: ['Atlantic', 'Indian', 'Southern', 'Pacific'], answer: 'Pacific' },
  { q: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], answer: 'Ottawa' },
  { q: 'Roughly how long does light take to reach Earth from the Sun?', options: ['8 minutes', '8 seconds', '8 hours', '80 minutes'], answer: '8 minutes' },
  { q: 'Which instrument measures atmospheric pressure?', options: ['Hygrometer', 'Barometer', 'Anemometer', 'Altimeter'], answer: 'Barometer' },
  { q: 'In computing, what does "CPU" stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Power Unit', 'Control Program Utility'], answer: 'Central Processing Unit' },
  { q: 'Which country has the most time zones, counting its overseas territories?', options: ['Russia', 'France', 'United States', 'China'], answer: 'France' },
  { q: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: '2' },
  { q: 'Which sea is the saltiest of the major seas?', options: ['The Red Sea', 'The Dead Sea', 'The Black Sea', 'The Caspian Sea'], answer: 'The Dead Sea' }
];
`;
