const o={midnight:{bg:"#0d1017",panel:"#161b26",ink:"#e9edf6",dim:"#98a1b6",accent:"#7c8cff",accent2:"#48d8e6"},ember:{bg:"#17100e",panel:"#241a16",ink:"#f6ece7",dim:"#bda79c",accent:"#ff7a45",accent2:"#ffc857"},grove:{bg:"#0c1512",panel:"#14231e",ink:"#e7f4ee",dim:"#93b3a5",accent:"#4ade80",accent2:"#22d3ee"},orchid:{bg:"#140f1b",panel:"#1f1729",ink:"#f0eaf7",dim:"#b0a1c4",accent:"#b98cff",accent2:"#ff7bb0"}};function s(e){const n=Object.keys(o);let t=0;for(let a=0;a<e.length;a++)t+=e.charCodeAt(a);return o[n[t%n.length]]}function r(e,n){const t=s(e);return`:root {
  --bg: ${t.bg};
  --panel: ${t.panel};
  --ink: ${t.ink};
  --dim: ${t.dim};
  --accent: ${t.accent};
  --accent-2: ${t.accent2};
  color-scheme: dark;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px;
  background: radial-gradient(120% 90% at 50% -10%, color-mix(in srgb, var(--accent) 16%, var(--bg)) 0%, var(--bg) 60%);
  color: var(--ink);
  font-family: ui-rounded, "Segoe UI", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1 {
  margin: 0;
  font-size: clamp(22px, 5vw, 32px);
  font-weight: 750;
  letter-spacing: -0.02em;
  background: linear-gradient(100deg, var(--ink), var(--accent) 70%, var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hint { margin: 0; color: var(--dim); font-size: 14px; text-align: center; }

.panel {
  background: var(--panel);
  border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
}

button {
  font: inherit;
  color: var(--ink);
  background: var(--panel);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  border-radius: 11px;
  padding: 10px 16px;
  cursor: pointer;
  transition: transform 90ms ease, background 140ms ease;
}
button:hover { background: color-mix(in srgb, var(--accent) 18%, var(--panel)); }
button:active { transform: translateY(1px); }

${n}`}function i(e,n,t={}){return`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${e}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
${n}
${t.script===!1?"":'    <script src="app.js"><\/script>'}
  </body>
</html>
`}function c(e){return{key:"maze",title:"Maze",plan:["Generate a random maze","Draw it on a canvas","Move with the arrow keys or swipe","Detect reaching the exit"],summary:"A maze game. Every round carves a brand-new maze with a depth-first walk, and you steer the dot to the green exit with the arrow keys, WASD, or a swipe on a phone.",files:{"index.html":i("Maze",`    <h1>Maze</h1>
    <p class="hint">Arrow keys, WASD, or swipe. Reach the green square.</p>
    <canvas id="board" class="panel" width="420" height="420"></canvas>
    <p class="hint"><span id="status">Level 1 &middot; 0 moves</span></p>
    <button id="again">New maze</button>`),"style.css":r(e,`canvas {
  touch-action: none;
  max-width: min(92vw, 460px);
  height: auto;
  aspect-ratio: 1;
}`),"app.js":`// Maze: recursive-backtracker generation, then walk the dot to the exit.
var canvas = document.getElementById('board');
var ctx = canvas.getContext('2d');
var statusEl = document.getElementById('status');

var COLS = 15, ROWS = 15;
var cell = canvas.width / COLS;
var level = 1, moves = 0;
var grid, player;

function makeCell(x, y) {
  return { x: x, y: y, top: true, right: true, bottom: true, left: true, seen: false };
}

function generate() {
  grid = [];
  for (var y = 0; y < ROWS; y++) {
    var row = [];
    for (var x = 0; x < COLS; x++) row.push(makeCell(x, y));
    grid.push(row);
  }

  var stack = [grid[0][0]];
  grid[0][0].seen = true;

  while (stack.length) {
    var current = stack[stack.length - 1];
    var options = [];
    if (current.y > 0 && !grid[current.y - 1][current.x].seen) options.push(['top', grid[current.y - 1][current.x]]);
    if (current.x < COLS - 1 && !grid[current.y][current.x + 1].seen) options.push(['right', grid[current.y][current.x + 1]]);
    if (current.y < ROWS - 1 && !grid[current.y + 1][current.x].seen) options.push(['bottom', grid[current.y + 1][current.x]]);
    if (current.x > 0 && !grid[current.y][current.x - 1].seen) options.push(['left', grid[current.y][current.x - 1]]);

    if (!options.length) { stack.pop(); continue; }

    var pick = options[Math.floor(Math.random() * options.length)];
    var dir = pick[0], next = pick[1];
    current[dir] = false;
    next[{ top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[dir]] = false;
    next.seen = true;
    stack.push(next);
  }

  player = { x: 0, y: 0 };
  moves = 0;
  draw();
}

function draw() {
  var css = getComputedStyle(document.documentElement);
  ctx.fillStyle = css.getPropertyValue('--panel').trim();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // exit
  ctx.fillStyle = '#4ade80';
  ctx.fillRect((COLS - 1) * cell + 4, (ROWS - 1) * cell + 4, cell - 8, cell - 8);

  ctx.strokeStyle = css.getPropertyValue('--dim').trim();
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      var c = grid[y][x], px = x * cell, py = y * cell;
      ctx.beginPath();
      if (c.top) { ctx.moveTo(px, py); ctx.lineTo(px + cell, py); }
      if (c.right) { ctx.moveTo(px + cell, py); ctx.lineTo(px + cell, py + cell); }
      if (c.bottom) { ctx.moveTo(px, py + cell); ctx.lineTo(px + cell, py + cell); }
      if (c.left) { ctx.moveTo(px, py); ctx.lineTo(px, py + cell); }
      ctx.stroke();
    }
  }

  ctx.fillStyle = css.getPropertyValue('--accent').trim();
  ctx.beginPath();
  ctx.arc(player.x * cell + cell / 2, player.y * cell + cell / 2, cell * 0.3, 0, Math.PI * 2);
  ctx.fill();

  statusEl.textContent = 'Level ' + level + ' \\u00b7 ' + moves + ' moves';
}

function move(dx, dy) {
  var c = grid[player.y][player.x];
  if (dx === 1 && c.right) return;
  if (dx === -1 && c.left) return;
  if (dy === 1 && c.bottom) return;
  if (dy === -1 && c.top) return;

  var nx = player.x + dx, ny = player.y + dy;
  if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
  player.x = nx; player.y = ny; moves++;
  draw();

  if (player.x === COLS - 1 && player.y === ROWS - 1) {
    statusEl.textContent = 'Solved in ' + moves + ' moves! Next maze\\u2026';
    level++;
    setTimeout(generate, 900);
  }
}

var KEYS = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
};
addEventListener('keydown', function (e) {
  var dir = KEYS[e.key] || KEYS[e.key.toLowerCase()];
  if (!dir) return;
  e.preventDefault();
  move(dir[0], dir[1]);
});

// Swipe support so it plays on a phone.
var touch = null;
canvas.addEventListener('touchstart', function (e) {
  touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
canvas.addEventListener('touchend', function (e) {
  if (!touch) return;
  var dx = e.changedTouches[0].clientX - touch.x;
  var dy = e.changedTouches[0].clientY - touch.y;
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1, 0);
  else move(0, dy > 0 ? 1 : -1);
  touch = null;
});

document.getElementById('again').addEventListener('click', function () { level = 1; generate(); });
generate();
`}}}function l(e){return{key:"snake",title:"Snake",plan:["Draw the grid","Move the snake on a tick","Grow when it eats","End on a wall or itself"],summary:"Snake. Arrow keys or swipe to steer, the tail grows each time you eat, and the speed creeps up as your score climbs. Your best score is kept in the browser.",files:{"index.html":i("Snake",`    <h1>Snake</h1>
    <p class="hint">Arrow keys, WASD, or swipe.</p>
    <canvas id="board" class="panel" width="400" height="400"></canvas>
    <p class="hint"><span id="score">Score 0</span> &middot; <span id="best">Best 0</span></p>
    <button id="again">New game</button>`),"style.css":r(e,"canvas { touch-action: none; max-width: min(92vw, 440px); height: auto; aspect-ratio: 1; }"),"app.js":`// Snake on a 20x20 grid.
var canvas = document.getElementById('board');
var ctx = canvas.getContext('2d');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');

var SIZE = 20;
var cell = canvas.width / SIZE;
var snake, dir, queued, food, score, timer, speed, dead;
var best = Number(localStorage.getItem('snake.best') || 0);
bestEl.textContent = 'Best ' + best;

function placeFood() {
  do {
    food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
}

function start() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = { x: 1, y: 0 };
  queued = null;
  score = 0;
  speed = 140;
  dead = false;
  placeFood();
  scoreEl.textContent = 'Score 0';
  clearInterval(timer);
  timer = setInterval(tick, speed);
  draw();
}

function tick() {
  if (queued) { dir = queued; queued = null; }
  var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  var hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;
  var hitSelf = snake.some(function (s) { return s.x === head.x && s.y === head.y; });
  if (hitWall || hitSelf) {
    dead = true;
    clearInterval(timer);
    if (score > best) { best = score; localStorage.setItem('snake.best', String(best)); bestEl.textContent = 'Best ' + best; }
    draw();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = 'Score ' + score;
    placeFood();
    if (speed > 70 && score % 4 === 0) {
      speed -= 8;
      clearInterval(timer);
      timer = setInterval(tick, speed);
    }
  } else {
    snake.pop();
  }
  draw();
}

function draw() {
  var css = getComputedStyle(document.documentElement);
  ctx.fillStyle = css.getPropertyValue('--panel').trim();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = css.getPropertyValue('--accent-2').trim();
  ctx.beginPath();
  ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.32, 0, Math.PI * 2);
  ctx.fill();

  for (var i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? css.getPropertyValue('--ink').trim() : css.getPropertyValue('--accent').trim();
    ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i / (snake.length + 4));
    var r = 4;
    var x = snake[i].x * cell + 1, y = snake[i].y * cell + 1, w = cell - 2;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, w, r) : ctx.rect(x, y, w, w);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (dead) {
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = css.getPropertyValue('--ink').trim();
    ctx.font = '600 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game over \\u2014 ' + score, canvas.width / 2, canvas.height / 2);
  }
}

var KEYS = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
};
function steer(next) {
  if (!next) return;
  if (next.x === -dir.x && next.y === -dir.y) return; // no instant reverse
  queued = next;
}
addEventListener('keydown', function (e) {
  var next = KEYS[e.key] || KEYS[e.key.toLowerCase()];
  if (!next) return;
  e.preventDefault();
  steer(next);
});

var touch = null;
canvas.addEventListener('touchstart', function (e) { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
canvas.addEventListener('touchend', function (e) {
  if (!touch) return;
  var dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  steer(Math.abs(dx) > Math.abs(dy) ? { x: dx > 0 ? 1 : -1, y: 0 } : { x: 0, y: dy > 0 ? 1 : -1 });
  touch = null;
});

document.getElementById('again').addEventListener('click', start);
start();
`}}}function d(e){return{key:"todo",title:"List",plan:["Lay out the input and list","Add, complete and delete items","Save to the browser","Show what is left"],summary:"A list app. Add items, tick them off, delete them, and everything is saved in the browser so it survives a refresh.",files:{"index.html":i("My List",`    <h1>My List</h1>
    <div class="panel card">
      <form id="form">
        <input id="entry" placeholder="What needs doing?" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
      <ul id="list"></ul>
      <p class="foot"><span id="left">Nothing yet</span><button id="clear" class="ghost">Clear done</button></p>
    </div>`),"style.css":r(e,`.card { width: min(94vw, 460px); padding: 18px; }
form { display: flex; gap: 8px; }
input {
  flex: 1;
  font: inherit;
  padding: 11px 13px;
  border-radius: 11px;
  border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
  color: var(--ink);
  outline: none;
}
input:focus { border-color: var(--accent); }
ul { list-style: none; margin: 16px 0 8px; padding: 0; display: grid; gap: 7px; }
li {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 12px; border-radius: 11px;
  background: color-mix(in srgb, var(--ink) 4%, transparent);
}
li.done span { text-decoration: line-through; color: var(--dim); }
li input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); flex: 0 0 18px; }
li span { flex: 1; word-break: break-word; }
li button { padding: 4px 9px; font-size: 13px; border-color: transparent; background: transparent; color: var(--dim); }
li button:hover { color: #ff6b6b; background: transparent; }
.foot { display: flex; align-items: center; gap: 10px; margin: 4px 0 0; color: var(--dim); font-size: 13px; }
.foot .ghost { margin-left: auto; padding: 5px 10px; font-size: 13px; border-color: transparent; }`),"app.js":`// A list that remembers itself.
var form = document.getElementById('form');
var entry = document.getElementById('entry');
var list = document.getElementById('list');
var left = document.getElementById('left');

var items = [];
try { items = JSON.parse(localStorage.getItem('list.items') || '[]'); } catch (e) { items = []; }

function save() { localStorage.setItem('list.items', JSON.stringify(items)); }

function render() {
  list.innerHTML = '';
  items.forEach(function (item, index) {
    var li = document.createElement('li');
    if (item.done) li.className = 'done';

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = item.done;
    box.addEventListener('change', function () { items[index].done = box.checked; save(); render(); });

    var label = document.createElement('span');
    label.textContent = item.text;

    var remove = document.createElement('button');
    remove.textContent = 'Delete';
    remove.addEventListener('click', function () { items.splice(index, 1); save(); render(); });

    li.append(box, label, remove);
    list.append(li);
  });

  var open = items.filter(function (i) { return !i.done; }).length;
  left.textContent = items.length === 0 ? 'Nothing yet' : open + ' left of ' + items.length;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var text = entry.value.trim();
  if (!text) return;
  items.push({ text: text, done: false });
  entry.value = '';
  save();
  render();
});

document.getElementById('clear').addEventListener('click', function () {
  items = items.filter(function (i) { return !i.done; });
  save();
  render();
});

render();
`}}}function p(e){return{key:"timer",title:"Timer",plan:["Draw the progress ring","Count down and update it","Start, pause and reset","Chime when it finishes"],summary:"A focus timer with a circular progress ring. 25 minutes by default, with a short break preset, and it chimes with the Web Audio API when the session ends.",files:{"index.html":i("Timer",`    <h1>Focus</h1>
    <div class="panel dial">
      <svg viewBox="0 0 200 200" width="220" height="220">
        <circle cx="100" cy="100" r="88" class="track" />
        <circle cx="100" cy="100" r="88" class="bar" id="bar" />
      </svg>
      <div class="readout"><span id="time">25:00</span><small id="mode">Focus</small></div>
    </div>
    <div class="row">
      <button id="toggle">Start</button>
      <button id="reset">Reset</button>
    </div>
    <div class="row">
      <button data-minutes="25" class="preset">25 min</button>
      <button data-minutes="5" class="preset">5 min</button>
      <button data-minutes="50" class="preset">50 min</button>
    </div>`),"style.css":r(e,`.dial { position: relative; display: grid; place-items: center; padding: 18px; border-radius: 50%; }
svg { transform: rotate(-90deg); display: block; }
.track { fill: none; stroke: color-mix(in srgb, var(--ink) 10%, transparent); stroke-width: 10; }
.bar {
  fill: none; stroke: var(--accent); stroke-width: 10; stroke-linecap: round;
  stroke-dasharray: 553; stroke-dashoffset: 0; transition: stroke-dashoffset 0.35s linear;
}
.readout { position: absolute; display: grid; justify-items: center; gap: 2px; }
.readout span { font-size: 40px; font-weight: 700; font-variant-numeric: tabular-nums; }
.readout small { color: var(--dim); text-transform: uppercase; letter-spacing: 0.14em; font-size: 11px; }
.row { display: flex; gap: 9px; flex-wrap: wrap; justify-content: center; }
.preset { padding: 7px 13px; font-size: 13px; }`),"app.js":`// Focus timer with an SVG progress ring.
var bar = document.getElementById('bar');
var timeEl = document.getElementById('time');
var modeEl = document.getElementById('mode');
var toggle = document.getElementById('toggle');

var CIRCUMFERENCE = 2 * Math.PI * 88;
var total = 25 * 60;
var remaining = total;
var ticking = null;

function render() {
  var minutes = Math.floor(remaining / 60);
  var seconds = remaining % 60;
  timeEl.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  bar.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - remaining / total));
  document.title = timeEl.textContent + ' \\u2014 Focus';
}

function chime() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880].forEach(function (freq, i) {
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.28);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + i * 0.28 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.28 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.28);
      osc.stop(ctx.currentTime + i * 0.28 + 0.55);
    });
  } catch (e) { /* audio blocked until the user interacts */ }
}

function stop() {
  clearInterval(ticking);
  ticking = null;
  toggle.textContent = 'Start';
}

function start() {
  if (ticking) return;
  toggle.textContent = 'Pause';
  ticking = setInterval(function () {
    remaining--;
    if (remaining <= 0) {
      remaining = 0;
      render();
      stop();
      chime();
      modeEl.textContent = 'Done';
      return;
    }
    render();
  }, 1000);
}

toggle.addEventListener('click', function () { ticking ? stop() : start(); });
document.getElementById('reset').addEventListener('click', function () {
  stop();
  remaining = total;
  modeEl.textContent = 'Focus';
  render();
});

Array.prototype.forEach.call(document.querySelectorAll('.preset'), function (button) {
  button.addEventListener('click', function () {
    stop();
    total = Number(button.dataset.minutes) * 60;
    remaining = total;
    modeEl.textContent = total <= 600 ? 'Break' : 'Focus';
    render();
  });
});

bar.style.strokeDasharray = String(CIRCUMFERENCE);
render();
`}}}function u(e){const t=(e.replace(/^\s*(make|build|create)\s+(me\s+)?(a|an|the)?\s*/i,"").replace(/\b(landing\s*page|website|site|page|for)\b/gi," ").replace(/\s+/g," ").trim()||"Northwind").split(" ").slice(0,3).join(" "),a=t.charAt(0).toUpperCase()+t.slice(1);return{key:"landing",title:a,plan:["Write the hero","Add the feature row","Style it","Make it work on a phone"],summary:`A one-page site for ${a} — hero, three features, and a closing call to action. Responsive, no dependencies, and easy to edit: the copy is all in index.html.`,files:{"index.html":i(a,`    <main>
      <section class="hero">
        <p class="eyebrow">${a}</p>
        <h1>Something worth your attention.</h1>
        <p class="hint">Replace this line with the one sentence that makes someone care. Keep it short and specific.</p>
        <div class="cta"><button class="primary">Get started</button><button>Learn more</button></div>
      </section>

      <section class="features">
        <article class="panel"><h3>Fast</h3><p>Say what is quick about it, and how much time it saves.</p></article>
        <article class="panel"><h3>Simple</h3><p>Say what it removes. People buy the absence of work.</p></article>
        <article class="panel"><h3>Yours</h3><p>Say what stays under their control once they start.</p></article>
      </section>

      <section class="closer panel">
        <h2>Ready when you are.</h2>
        <p class="hint">One clear next step beats three vague ones.</p>
        <button class="primary">Get started</button>
      </section>
    </main>`,{script:!1}),"style.css":r(e,`body { justify-content: flex-start; padding: 0; display: block; }
main { max-width: 980px; margin: 0 auto; padding: 8vh 22px 80px; display: grid; gap: 64px; }
.hero { text-align: center; display: grid; gap: 14px; justify-items: center; }
.eyebrow { margin: 0; text-transform: uppercase; letter-spacing: 0.18em; font-size: 12px; color: var(--accent-2); }
.hero h1 { font-size: clamp(32px, 7vw, 56px); line-height: 1.05; max-width: 15ch; }
.hero .hint { max-width: 52ch; font-size: 17px; }
.cta { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
.primary { background: linear-gradient(120deg, var(--accent), var(--accent-2)); color: #0b0e14; font-weight: 650; border: none; }
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
.features article { padding: 22px; }
.features h3 { margin: 0 0 8px; font-size: 18px; }
.features p { margin: 0; color: var(--dim); line-height: 1.6; }
.closer { text-align: center; padding: 48px 24px; display: grid; gap: 12px; justify-items: center; }
.closer h2 { margin: 0; font-size: clamp(24px, 4vw, 34px); }`)}}}function m(e){const n=e.replace(/[<>&]/g,"").slice(0,160)||"your idea";return{key:"starter",title:"Starter",plan:["Create the page","Style it","Wire up a little interactivity"],summary:"A styled starter page with your idea written into it and a working counter, so there is something real on screen to build from. Ask for a specific change and it grows from here.",files:{"index.html":i("Starter",`    <h1>Ready to build</h1>
    <p class="hint">You asked for: <em>${n}</em></p>
    <div class="panel card">
      <p class="big" id="count">0</p>
      <div class="row"><button id="down">-</button><button id="up">+</button><button id="zero">Reset</button></div>
    </div>
    <p class="hint">Everything here is plain HTML, CSS and JavaScript. Ask for the next change and it gets built on top.</p>`),"style.css":r(e,`.card { padding: 26px 30px; display: grid; gap: 16px; justify-items: center; }
.big { margin: 0; font-size: 56px; font-weight: 750; font-variant-numeric: tabular-nums; }
.row { display: flex; gap: 9px; }
em { color: var(--accent-2); font-style: normal; }`),"app.js":`var count = 0;
var output = document.getElementById('count');
function show() { output.textContent = String(count); }
document.getElementById('up').addEventListener('click', function () { count++; show(); });
document.getElementById('down').addEventListener('click', function () { count--; show(); });
document.getElementById('zero').addEventListener('click', function () { count = 0; show(); });
show();
`}}}const h=[{test:/\bmaze\b|\blabyrinth\b/i,make:c},{test:/\bsnake\b/i,make:l},{test:/\b(todo|to-do|task list|checklist|shopping list|grocery|notes?|list app|tracker)\b/i,make:d},{test:/\b(timer|pomodoro|countdown|stopwatch|focus)\b/i,make:p},{test:/\b(landing|website|web site|homepage|home page|portfolio|marketing|business site|site for)\b/i,make:u}];function x(e){for(const n of h)if(n.test.test(e))return n.make(e);return m(e)}export{x as pickBlueprint};
