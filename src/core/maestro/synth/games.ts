import { DesignSystem, Spec } from '../types';

/**
 * Canvas games, generated.
 *
 * Every one of these is written against the numbers in knowledge.ts, so the
 * offline builder produces games that are actually playable rather than
 * technically present. They all share one scaffold — GAME_SHELL — which owns
 * the parts that are identical in every arcade game and easy to get wrong:
 * the overlay, the score and best score, the mute, pause, restart, and the
 * order of update, particles, shake and draw.
 */

export interface Piece {
  /** Contents of game.js / app.js, minus the engine. */
  script: string;
  /** Markup for inside <main>. */
  markup: string;
  /** CSS appended after the base sheet. */
  css: string;
  /** Instructions for the user, for the README and the finish message. */
  howTo: string[];
  /** Decisions worth stating — the numbers, and why. */
  notes: string[];
  /** True when engine.js must be loaded first. */
  engine: boolean;
  scriptName: string;
}

/* ================================================================
   The shared arcade scaffold
   ================================================================ */

/**
 * Emitted at the top of every canvas game. It reads the palette out of the CSS
 * custom properties, so the game is drawn in the project's colours rather than
 * in whatever was hard-coded.
 */
export const GAME_SHELL = `/* --- the scaffold every arcade game here shares --- */

/** Palette, read from the stylesheet so the game matches the page. */
var css = getComputedStyle(document.documentElement);
function token(name, fallback) {
  var v = css.getPropertyValue(name);
  return v && v.trim() ? v.trim() : fallback;
}
var C = {
  bg: token('--bg', '#101014'),
  surface: token('--surface', '#1a1a20'),
  surfaceAlt: token('--surface-alt', '#24242c'),
  ink: token('--ink', '#f2f2f5'),
  inkDim: token('--ink-dim', '#9a9aa6'),
  line: token('--line', '#33333d'),
  accent: token('--accent', '#5ad1ff'),
  accentInk: token('--accent-ink', '#06202b'),
  accent2: token('--accent-2', '#ffcf6b'),
  good: token('--good', '#4ad991'),
  bad: token('--bad', '#ff5f56')
};

function Game(opts) {
  var stage = Engine.stage(document.getElementById('game'), opts.W, opts.H);
  var ctx = stage.ctx;
  var overlay = document.getElementById('overlay');
  var overlayTitle = document.getElementById('overlay-title');
  var overlayText = document.getElementById('overlay-text');
  var startBtn = document.getElementById('start');
  var scoreEl = document.getElementById('score');
  var bestEl = document.getElementById('best');
  var muteBtn = document.getElementById('mute');

  var api = {
    W: opts.W,
    H: opts.H,
    stage: stage,
    ctx: ctx,
    score: 0,
    best: Number(Engine.store.get(opts.key, 0)) || 0,
    playing: false,
    paused: false,
    particles: Engine.particles(240),
    shake: Engine.shaker()
  };

  bestEl.textContent = String(api.best);

  api.setScore = function (n) {
    api.score = n;
    scoreEl.textContent = String(Math.floor(n));
    if (n > api.best) {
      api.best = n;
      bestEl.textContent = String(Math.floor(n));
      Engine.store.set(opts.key, n);
    }
  };
  api.addScore = function (n) { api.setScore(api.score + n); };

  function showOverlay(title, message, button) {
    overlayTitle.textContent = title;
    overlayText.textContent = message;
    startBtn.textContent = button;
    overlay.hidden = false;
    startBtn.focus();
  }

  /** Reset absolutely everything and play. Never a page reload. */
  function restart() {
    Engine.audio.unlock();
    overlay.hidden = true;
    api.paused = false;
    api.playing = true;
    api.particles.clear();
    api.setScore(0);
    Engine.input.clear();
    if (opts.onStart) opts.onStart();
    loop.start();
  }
  api.restart = restart;

  api.gameOver = function (reason) {
    if (!api.playing) return;
    api.playing = false;
    Engine.audio.sweep(320, 90, 0.35, 0.18);
    showOverlay('Game over', reason + '  ·  Score ' + Math.floor(api.score) + '  ·  Best ' + Math.floor(api.best), 'Play again');
  };

  api.win = function (message) {
    api.playing = false;
    Engine.audio.tone(880, 0.1, 'triangle', 0.16);
    setTimeout(function () { Engine.audio.tone(1320, 0.16, 'triangle', 0.16); }, 110);
    showOverlay('You win', message + '  ·  Score ' + Math.floor(api.score), 'Play again');
  };

  function togglePause() {
    if (!api.playing) return;
    api.paused = !api.paused;
    if (api.paused) showOverlay('Paused', 'Take your time.', 'Resume');
    else overlay.hidden = true;
  }

  var loop = Engine.loop(function (dt, t) {
    if (api.playing && !api.paused && opts.onUpdate) opts.onUpdate(dt, t);
    api.particles.update(dt, opts.particleGravity);
    api.shake.update(dt);
    ctx.save();
    api.shake.apply(ctx);
    opts.onDraw(ctx, dt, t);
    api.particles.draw(ctx);
    ctx.restore();
  });
  api.loop = loop;

  /* input */
  startBtn.addEventListener('click', function () {
    if (api.paused) { api.paused = false; overlay.hidden = true; return; }
    restart();
  });

  Engine.input.onKey(function (key, event) {
    if (key === 'Escape' || key === 'p') { togglePause(); return; }
    if (!api.playing) {
      if (key === 'Enter' || key === ' ') { event.preventDefault(); restart(); }
      return;
    }
    if (opts.onKey) opts.onKey(key, event);
  });

  Engine.pointer(stage.canvas, stage, {
    down: function (p, e) { if (opts.onDown) opts.onDown(p, e); },
    move: function (p, e) { if (opts.onMove) opts.onMove(p, e); },
    up: function (p, e) { if (opts.onUp) opts.onUp(p, e); },
    tap: function (p, e) { if (api.playing && opts.onTap) opts.onTap(p, e); },
    swipe: function (dir) { if (api.playing && opts.onSwipe) opts.onSwipe(dir); }
  });

  muteBtn.addEventListener('click', function () {
    var muted = Engine.audio.toggle();
    muteBtn.textContent = muted ? 'Sound off' : 'Sound on';
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
  });

  // Losing the window while playing pauses rather than continuing unseen.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && api.playing && !api.paused) togglePause();
  });

  showOverlay(opts.title, opts.intro, 'Play');
  if (opts.onStart) opts.onStart();
  loop.start();
  return api;
}
`;

/* ================================================================
   Shared markup and CSS for canvas games
   ================================================================ */

export function canvasMarkup(spec: Spec, controls: string, label: string): string {
  return `      <div class="hud">
        <div class="hud__stat"><span class="hud__label">Score</span><strong id="score">0</strong></div>
        <div class="hud__stat"><span class="hud__label">Best</span><strong id="best">0</strong></div>
        <button type="button" id="mute" class="hud__mute" aria-pressed="false">Sound on</button>
      </div>

      <div class="stage">
        <canvas id="game" role="img" aria-label="${label}"></canvas>
        <div class="overlay" id="overlay">
          <h2 id="overlay-title">${spec.title}</h2>
          <p id="overlay-text"></p>
          <button type="button" class="btn" id="start">Play</button>
        </div>
      </div>

      <p class="controls muted">${controls}</p>`;
}

export function canvasCss(aspect: string): string {
  return `
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: calc(var(--space) * 2);
  padding: calc(var(--space) * 2);
}

/* The stage grows into whatever is left, so <main> has to grow too — otherwise
   it sizes to its content and the canvas stays small in a tall window. */
.main { flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; gap: 12px; }

.masthead { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.masthead h1 { font-size: var(--step-2); }
.masthead p { color: var(--ink-dim); font-size: 0.95rem; }

.hud {
  display: flex;
  align-items: center;
  gap: calc(var(--space) * 2);
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.hud__stat { display: flex; align-items: baseline; gap: 8px; }
.hud__label { color: var(--ink-dim); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; }
.hud__stat strong { font-size: var(--step-1); font-variant-numeric: tabular-nums; }
.hud__mute {
  margin-left: auto;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--ink-dim);
  font-size: 0.85rem;
}
.hud__mute:hover { color: var(--ink); }

/* No aspect-ratio here on purpose. The canvas keeps the ${aspect} field shape
   itself by fitting to whichever of this box's dimensions runs out first; an
   aspect-ratio on the container as well would fight that and overflow the
   viewport on a short window. */
.stage {
  position: relative;
  flex: 1 1 0;
  min-height: 220px;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: min(100%, 900px);
  margin-inline: auto;
}
.stage canvas {
  display: block;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  touch-action: none;
}

.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(3px);
  border-radius: var(--radius);
}
.overlay[hidden] { display: none; }
.overlay h2 { font-size: var(--step-3); }
.overlay p { color: var(--ink-dim); max-width: 34ch; }

.controls { text-align: center; font-size: 0.9rem; }

@media (max-width: 560px) {
  .page { padding: 10px; gap: 10px; }
  .hud { padding: 8px 10px; gap: 12px; }
  .masthead p { display: none; }
}`;
}

/* ================================================================
   Snake
   ================================================================ */

export function snake(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   A 22x22 grid. The snake steps once per tick, not once per frame, so the
   speed is the same on every screen. The tick shortens by 4ms per apple to
   a floor of 65ms — about twice the starting speed after sixteen apples. */

var COLS = 22, ROWS = 22, CELL = 24;
var START_TICK = 0.130, MIN_TICK = 0.065, TICK_STEP = 0.004;

var snake, dir, queued, food, tick, acc, grow;

function freeCells() {
  var taken = {};
  for (var i = 0; i < snake.length; i++) taken[snake[i].x + ',' + snake[i].y] = true;
  var free = [];
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) if (!taken[x + ',' + y]) free.push({ x: x, y: y });
  }
  return free;
}

/** Picking from the free cells means food can never land under the snake. */
function placeFood() {
  var free = freeCells();
  food = free.length ? Engine.pick(free) : null;
}

function reset() {
  snake = [{ x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 }, { x: 5, y: 11 }];
  dir = { x: 1, y: 0 };
  queued = [];
  grow = 0;
  tick = START_TICK;
  acc = 0;
  placeFood();
}

/** Turns are queued and validated against the direction actually applied, so
    pressing left then up inside one tick cannot fold the snake into itself. */
function turn(nx, ny) {
  var last = queued.length ? queued[queued.length - 1] : dir;
  if (last.x === -nx && last.y === -ny) return;
  if (last.x === nx && last.y === ny) return;
  if (queued.length < 2) queued.push({ x: nx, y: ny });
}

function step() {
  if (queued.length) dir = queued.shift();
  var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
    G.shake.kick(9);
    G.gameOver('You hit the wall.');
    return;
  }
  for (var i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      G.shake.kick(9);
      G.gameOver('You bit yourself.');
      return;
    }
  }

  snake.unshift(head);
  if (food && head.x === food.x && head.y === food.y) {
    grow += 1;
    G.addScore(10);
    tick = Math.max(MIN_TICK, tick - TICK_STEP);
    G.particles.burst(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, 14, C.accent2, 150);
    Engine.audio.tone(660 + Math.min(600, G.score), 0.07, 'square', 0.12);
    placeFood();
  }
  if (grow > 0) grow--;
  else snake.pop();
}

var G = Game({
  W: COLS * CELL,
  H: ROWS * CELL,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Eat to grow. Do not hit the walls or yourself. Arrows, WASD or swipe.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    acc += dt;
    while (acc >= tick && G.playing) {
      acc -= tick;
      step();
    }
  },

  onKey: function (key) {
    if (key === 'ArrowUp' || key === 'w') turn(0, -1);
    else if (key === 'ArrowDown' || key === 's') turn(0, 1);
    else if (key === 'ArrowLeft' || key === 'a') turn(-1, 0);
    else if (key === 'ArrowRight' || key === 'd') turn(1, 0);
  },

  onSwipe: function (d) {
    if (d === 'up') turn(0, -1);
    else if (d === 'down') turn(0, 1);
    else if (d === 'left') turn(-1, 0);
    else turn(1, 0);
  },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, G.W, G.H);

    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    for (var i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, G.H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(G.W, i * CELL + 0.5);
      ctx.stroke();
    }

    if (food) {
      var fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2;
      ctx.fillStyle = C.accent2;
      ctx.beginPath();
      ctx.arc(fx, fy, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var s = snake.length - 1; s >= 0; s--) {
      var part = snake[s];
      var head = s === 0;
      ctx.fillStyle = head ? C.accent : C.good;
      ctx.globalAlpha = head ? 1 : 0.55 + 0.45 * (1 - s / snake.length);
      Engine.roundRect(ctx, part.x * CELL + 2, part.y * CELL + 2, CELL - 4, CELL - 4, head ? 7 : 4);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Arrows or WASD to turn · Swipe on a phone · Esc to pause', 'Snake game board'),
    css: canvasCss('1 / 1'),
    howTo: ['Arrow keys or WASD to turn.', 'Swipe on a phone.', 'Escape pauses; Enter starts and restarts.'],
    notes: [
      'Grid 22×22 at 24 px a cell.',
      'One step every 130 ms at the start, dropping 4 ms per apple to a floor of 65 ms — roughly double speed after sixteen apples.',
      'Turns are queued and checked against the direction actually applied last tick, so a fast left-then-up cannot kill you.',
      'Food is chosen from the list of free cells, so it never appears under the snake.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Brick breaker
   ================================================================ */

export function breakout(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   640x480 field. The paddle is 110 wide — 17% of the width, wide enough to
   be fair. The ball leaves the paddle at an angle set by where it hit, so
   there is skill in it, and it is clamped away from horizontal so no rally
   can stall. It moves in sub-steps no longer than its own radius, which is
   what stops it tunnelling through a brick at speed. */

var W = 640, H = 480;
var PADDLE_W = 110, PADDLE_H = 14, PADDLE_Y = H - 40;
var BALL_R = 7, START_SPEED = 300, MAX_SPEED = 520, SPEED_GAIN = 1.03;
var ROWS = 5, COLS = 9, BRICK_H = 22, BRICK_GAP = 6, TOP = 64;
var BRICK_W = (W - BRICK_GAP * (COLS + 1)) / COLS;

var paddleX, ball, bricks, lives, launched, serveDir;

function reset() {
  paddleX = W / 2;
  lives = 3;
  serveDir = 1;
  bricks = [];
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      bricks.push({
        x: BRICK_GAP + c * (BRICK_W + BRICK_GAP),
        y: TOP + r * (BRICK_H + BRICK_GAP),
        w: BRICK_W,
        h: BRICK_H,
        alive: true,
        points: (ROWS - r) * 10,
        row: r
      });
    }
  }
  serve();
}

function serve() {
  launched = false;
  ball = { x: paddleX, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0, speed: START_SPEED };
}

function launch() {
  if (launched) return;
  launched = true;
  // Between 35 and 55 degrees: never so flat it crawls, never so steep it stalls.
  var angle = (35 + Math.random() * 20) * Math.PI / 180;
  ball.vx = Math.cos(angle) * ball.speed * serveDir;
  ball.vy = -Math.sin(angle) * ball.speed;
  serveDir = -serveDir;
  Engine.audio.tone(520, 0.06, 'square', 0.1);
}

function bounceOffPaddle() {
  var offset = Engine.clamp((ball.x - paddleX) / (PADDLE_W / 2), -1, 1);
  var angle = offset * 60 * Math.PI / 180;
  ball.vx = Math.sin(angle) * ball.speed;
  ball.vy = -Math.abs(Math.cos(angle)) * ball.speed;
  Engine.audio.tone(300, 0.05, 'square', 0.1);
}

function hitBrick(brick) {
  brick.alive = false;
  G.addScore(brick.points);
  G.particles.burst(brick.x + brick.w / 2, brick.y + brick.h / 2, 10, rowColor(brick.row), 170);
  Engine.audio.tone(420 + brick.points * 4, 0.05, 'square', 0.1);
  ball.speed = Math.min(MAX_SPEED, ball.speed * SPEED_GAIN);
  var mag = Math.hypot(ball.vx, ball.vy) || 1;
  ball.vx = ball.vx / mag * ball.speed;
  ball.vy = ball.vy / mag * ball.speed;
  for (var i = 0; i < bricks.length; i++) if (bricks[i].alive) return;
  G.win('Every brick cleared.');
}

function rowColor(row) {
  var scale = [C.accent, C.accent2, C.good, C.bad, C.inkDim];
  return scale[row % scale.length];
}

function moveBall(dt) {
  // Sub-stepping: never travel further than the radius in one collision test.
  var distance = Math.hypot(ball.vx, ball.vy) * dt;
  var steps = Math.max(1, Math.ceil(distance / BALL_R));
  var sub = dt / steps;

  for (var s = 0; s < steps; s++) {
    ball.x += ball.vx * sub;
    ball.y += ball.vy * sub;

    if (ball.x - BALL_R < 0) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }
    if (ball.x + BALL_R > W) { ball.x = W - BALL_R; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - BALL_R < 0) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }

    if (ball.vy > 0 && ball.y + BALL_R >= PADDLE_Y && ball.y - BALL_R < PADDLE_Y + PADDLE_H) {
      if (Math.abs(ball.x - paddleX) <= PADDLE_W / 2 + BALL_R) {
        ball.y = PADDLE_Y - BALL_R;
        bounceOffPaddle();
      }
    }

    for (var i = 0; i < bricks.length; i++) {
      var b = bricks[i];
      if (!b.alive) continue;
      if (ball.x + BALL_R < b.x || ball.x - BALL_R > b.x + b.w) continue;
      if (ball.y + BALL_R < b.y || ball.y - BALL_R > b.y + b.h) continue;

      // Push out along the shallower overlap, and reverse only that axis, so
      // the ball never ends up stuck inside a brick chewing through a column.
      var overlapX = Math.min(ball.x + BALL_R - b.x, b.x + b.w - (ball.x - BALL_R));
      var overlapY = Math.min(ball.y + BALL_R - b.y, b.y + b.h - (ball.y - BALL_R));
      if (overlapX < overlapY) {
        ball.x += ball.x < b.x + b.w / 2 ? -overlapX : overlapX;
        ball.vx = -ball.vx;
      } else {
        ball.y += ball.y < b.y + b.h / 2 ? -overlapY : overlapY;
        ball.vy = -ball.vy;
      }
      hitBrick(b);
      break;
    }

    if (ball.y - BALL_R > H) {
      lives--;
      G.shake.kick(10);
      Engine.audio.noise(0.25, 0.14);
      if (lives <= 0) G.gameOver('Out of balls.');
      else serve();
      return;
    }
  }
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Clear every brick. Move with the mouse, a finger or the arrow keys. Space to launch.',
  particleGravity: 260,

  onStart: reset,

  onUpdate: function (dt) {
    if (Engine.input.any(['ArrowLeft', 'a'])) paddleX -= 460 * dt;
    if (Engine.input.any(['ArrowRight', 'd'])) paddleX += 460 * dt;
    paddleX = Engine.clamp(paddleX, PADDLE_W / 2, W - PADDLE_W / 2);

    if (!launched) {
      ball.x = paddleX;
      ball.y = PADDLE_Y - BALL_R - 2;
      return;
    }
    moveBall(dt);
  },

  onKey: function (key, e) {
    if (key === ' ' || key === 'ArrowUp') { e.preventDefault(); launch(); }
  },
  onMove: function (p) { paddleX = Engine.clamp(p.x, PADDLE_W / 2, W - PADDLE_W / 2); },
  onTap: function () { launch(); },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < bricks.length; i++) {
      var b = bricks[i];
      if (!b.alive) continue;
      ctx.fillStyle = rowColor(b.row);
      Engine.roundRect(ctx, b.x, b.y, b.w, b.h, 3);
      ctx.fill();
    }

    ctx.fillStyle = C.ink;
    Engine.roundRect(ctx, paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 7);
    ctx.fill();

    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    for (var l = 0; l < lives; l++) {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(16 + l * 18, 22, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!launched && G.playing) {
      Engine.text(ctx, 'Space or tap to launch', W / 2, H - 78, 15, C.inkDim, 'center');
    }
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Mouse, finger or arrow keys to move · Space to launch · Esc to pause', 'Brick breaker playfield'),
    css: canvasCss('4 / 3'),
    howTo: ['Move the paddle with the mouse, a finger or the arrow keys.', 'Space or tap to launch the ball.', 'Clear all 45 bricks to win. Three lives.'],
    notes: [
      'Paddle 110 px on a 640 px field — 17%, wide enough to be fair.',
      'The ball leaves the paddle at up to 60° from vertical depending on where it hit, so aiming is a real skill rather than a coin toss.',
      'Speed rises 3% per brick to a cap of 520 px/s.',
      'The ball moves in sub-steps no larger than its radius, which is what prevents it passing through bricks at speed.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Tap-to-fly
   ================================================================ */

export function flappy(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   400x600. The gap is 155px, 26% of the height. Nothing scrolls until the
   first tap, and the first gap starts at x = W + 200, so nobody dies while
   they are still working out the controls. Each gap centre is within 140px
   of the last, so every pair of gaps is connected by a flyable path. */

var W = 400, H = 600;
var GRAVITY = 1500, FLAP = -430, MAX_FALL = 700;
var SCROLL = 150, GAP = 155, SPACING = 230, PIPE_W = 62;
var SPAWN_X = W + 200;          /* off screen — the player must see it coming */
var BIRD_X = 110, BIRD_R = 13, HIT_R = BIRD_R * 0.7;

var bird, pipes, started, groundOffset;

function reset() {
  bird = { y: H / 2, vy: 0, tilt: 0 };
  pipes = [];
  started = false;
  groundOffset = 0;
  addPipe(SPAWN_X);
}

function addPipe(x) {
  var last = pipes.length ? pipes[pipes.length - 1].centre : H / 2;
  var lo = Math.max(GAP / 2 + 40, last - 140);
  var hi = Math.min(H - 90 - GAP / 2, last + 140);
  pipes.push({ x: x, centre: Engine.rand(lo, hi), passed: false });
}

function flap() {
  if (!G.playing) return;
  started = true;
  bird.vy = FLAP;
  Engine.audio.sweep(420, 700, 0.08, 0.12);
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Tap, click or press space to fly. Through the gaps, not into them.',
  particleGravity: 500,

  onStart: reset,

  onUpdate: function (dt) {
    if (!started) return;

    bird.vy = Math.min(MAX_FALL, bird.vy + GRAVITY * dt);
    bird.y += bird.vy * dt;
    bird.tilt = Engine.clamp(bird.vy / 700, -0.5, 1.1);
    groundOffset = (groundOffset + SCROLL * dt) % 40;

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= SCROLL * dt;

      if (!p.passed && p.x + PIPE_W < BIRD_X) {
        p.passed = true;
        G.addScore(1);
        Engine.audio.tone(880, 0.06, 'triangle', 0.1);
      }
      if (p.x + PIPE_W < -20) pipes.splice(i, 1);

      var withinX = BIRD_X + HIT_R > p.x && BIRD_X - HIT_R < p.x + PIPE_W;
      if (withinX) {
        var top = p.centre - GAP / 2, bottom = p.centre + GAP / 2;
        if (bird.y - HIT_R < top || bird.y + HIT_R > bottom) return crash();
      }
    }

    var last = pipes[pipes.length - 1];
    if (!last || last.x < W - SPACING) addPipe(W + PIPE_W);

    if (bird.y + HIT_R > H - 60) return crash();
    if (bird.y - HIT_R < 0) { bird.y = HIT_R; bird.vy = 0; }
  },

  onKey: function (key, e) { if (key === ' ' || key === 'ArrowUp') { e.preventDefault(); flap(); } },
  onDown: function () { flap(); },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < pipes.length; i++) {
      var p = pipes[i];
      ctx.fillStyle = C.good;
      ctx.fillRect(p.x, 0, PIPE_W, p.centre - GAP / 2);
      ctx.fillRect(p.x, p.centre + GAP / 2, PIPE_W, H - (p.centre + GAP / 2) - 60);
      ctx.fillStyle = C.line;
      ctx.fillRect(p.x - 4, p.centre - GAP / 2 - 14, PIPE_W + 8, 14);
      ctx.fillRect(p.x - 4, p.centre + GAP / 2, PIPE_W + 8, 14);
    }

    ctx.fillStyle = C.surfaceAlt;
    ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = C.line;
    for (var g = -40; g < W + 40; g += 40) ctx.fillRect(g - groundOffset, H - 60, 20, 5);

    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    ctx.rotate(bird.tilt * 0.5);
    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.accentInk;
    ctx.beginPath();
    ctx.arc(5, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.accent2;
    ctx.beginPath();
    ctx.moveTo(BIRD_R - 2, 1);
    ctx.lineTo(BIRD_R + 9, 4);
    ctx.lineTo(BIRD_R - 2, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (!started && G.playing) {
      Engine.text(ctx, 'Tap to start', W / 2, H / 2 - 90, 18, C.inkDim, 'center');
    }
  }
});

function crash() {
  G.shake.kick(12);
  G.particles.burst(BIRD_X, bird.y, 18, C.accent, 220);
  Engine.audio.noise(0.3, 0.16);
  G.gameOver('You clipped it.');
}
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Space, click or tap to fly · Esc to pause', 'Flying game field'),
    css: canvasCss('2 / 3'),
    howTo: ['Tap, click or press space to flap.', 'Fly through the gaps; touching a pipe or the ground ends the run.', 'One point per gap.'],
    notes: [
      'Gap 155 px on a 600 px field — 26%, forgiving but not trivial.',
      'Gravity 1500 px/s² with a flap of −430 px/s and a terminal fall of 700 px/s.',
      'Nothing moves until the first tap and the first pipe starts 200 px beyond the right edge, so nobody dies while reading the screen.',
      'Consecutive gap centres are within 140 px of each other, so every pair is connected by a flyable path.',
      'The collision radius is 70% of the drawn bird, so near misses read as misses.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Endless runner / dodger — also the fallback for any arcade idea
   ================================================================ */

export function runner(spec: Spec, _design: DesignSystem): Piece {
  const thing = spec.subject ? spec.subject.split(' ')[0] : 'runner';
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   Obstacles are created at x = W + 40 and travel left, so they are visible
   for 2.8 seconds at the starting speed of 300px/s across an 800px field.
   The minimum gap between them is derived from the jump arc, not guessed:
   at 300px/s the jump covers about 186px, so the gap floor is 1.6 times
   that. Falling gravity is 1.7x rising gravity, which is not physical and
   feels far better. */

var W = 800, H = 380;
var GROUND = H * 0.78;
var GRAVITY_UP = 2200, GRAVITY_DOWN = 3700, JUMP = -760;
var START_SPEED = 300, SPEED_GAIN = 6, MAX_SPEED = 720;
var SPAWN_X = W + 40;               /* off screen, always */
var PLAYER_W = 30, PLAYER_H = 42;

var player, obstacles, speed, distance, nextGap, clouds;

function reset() {
  player = { x: 90, y: GROUND - PLAYER_H, vy: 0, onGround: true, duck: false };
  obstacles = [];
  speed = START_SPEED;
  distance = 0;
  nextGap = 320;
  clouds = [];
  for (var i = 0; i < 5; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * 110, s: 0.25 + Math.random() * 0.3, r: 14 + Math.random() * 16 });
}

/** How far the player travels during one full jump, at the current speed. */
function jumpDistance() {
  var up = -JUMP / GRAVITY_UP;
  var down = -JUMP / GRAVITY_DOWN;
  return (up + down) * speed;
}

function spawn() {
  var tall = Math.random() < 0.28;
  obstacles.push({
    x: SPAWN_X,
    y: tall ? GROUND - 78 : GROUND - 34,
    w: tall ? 26 : 22 + Math.random() * 26,
    h: tall ? 30 : 34,
    tall: tall
  });
  nextGap = Math.max(190, jumpDistance() * 1.6) + Math.random() * 160;
}

function jump() {
  if (!player.onGround || !G.playing) return;
  player.vy = JUMP;
  player.onGround = false;
  Engine.audio.sweep(300, 620, 0.1, 0.11);
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Jump the obstacles. Space or tap to jump, hold to jump higher, down to duck.',
  particleGravity: 900,

  onStart: reset,

  onUpdate: function (dt) {
    speed = Math.min(MAX_SPEED, speed + SPEED_GAIN * dt);
    distance += speed * dt;
    G.setScore(Math.floor(distance / 10));

    player.duck = Engine.input.any(['ArrowDown', 's']) && player.onGround;

    // A short tap gives a short hop: cut the rise when the key is released.
    var rising = player.vy < 0;
    var holding = Engine.input.any([' ', 'ArrowUp', 'w']);
    if (rising && !holding) player.vy += GRAVITY_DOWN * dt;
    player.vy += (rising ? GRAVITY_UP : GRAVITY_DOWN) * dt;
    player.y += player.vy * dt;

    var floor = GROUND - (player.duck ? PLAYER_H * 0.6 : PLAYER_H);
    if (player.y >= floor) { player.y = floor; player.vy = 0; player.onGround = true; }

    nextGap -= speed * dt;
    if (nextGap <= 0) spawn();

    var box = {
      x: player.x + 4,
      y: player.y + 3,
      w: PLAYER_W - 8,
      h: (player.duck ? PLAYER_H * 0.6 : PLAYER_H) - 6
    };

    for (var i = obstacles.length - 1; i >= 0; i--) {
      var o = obstacles[i];
      o.x -= speed * dt;
      if (o.x + o.w < -40) { obstacles.splice(i, 1); continue; }
      if (Engine.overlaps(box, o)) {
        G.shake.kick(12);
        G.particles.burst(player.x + PLAYER_W / 2, player.y + PLAYER_H / 2, 20, C.bad, 250);
        Engine.audio.noise(0.3, 0.17);
        G.gameOver('You hit ' + (o.tall ? 'the high one' : 'a block') + '.');
        return;
      }
    }

    for (var c = 0; c < clouds.length; c++) {
      clouds[c].x -= speed * clouds[c].s * dt;
      if (clouds[c].x < -40) { clouds[c].x = W + 40; clouds[c].y = 40 + Math.random() * 110; }
    }
  },

  onKey: function (key, e) {
    if (key === ' ' || key === 'ArrowUp' || key === 'w') { e.preventDefault(); jump(); }
  },
  onDown: function (p) { if (p.y < GROUND) jump(); else player.duck = true; },
  onUp: function () { player.duck = false; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.surfaceAlt;
    for (var c = 0; c < clouds.length; c++) {
      ctx.beginPath();
      ctx.arc(clouds[c].x, clouds[c].y, clouds[c].r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = C.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND + 1);
    ctx.lineTo(W, GROUND + 1);
    ctx.stroke();

    ctx.fillStyle = C.line;
    var offset = distance % 46;
    for (var m = 0; m <= Math.ceil(W / 46); m++) {
      ctx.fillRect(m * 46 - offset, GROUND + 10, 22, 3);
    }

    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      ctx.fillStyle = o.tall ? C.bad : C.accent2;
      Engine.roundRect(ctx, o.x, o.y, o.w, o.h, 3);
      ctx.fill();
    }

    var h = player.duck ? PLAYER_H * 0.6 : PLAYER_H;
    ctx.fillStyle = C.accent;
    Engine.roundRect(ctx, player.x, player.y, PLAYER_W, h, 6);
    ctx.fill();
    ctx.fillStyle = C.accentInk;
    ctx.fillRect(player.x + PLAYER_W - 11, player.y + 9, 5, 5);

    Engine.text(ctx, Math.floor(distance / 10) + ' m', W - 16, 26, 16, C.inkDim, 'right');
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Space or tap to jump · Hold for a higher jump · Down to duck', `${thing} running game`),
    css: canvasCss('20 / 9'),
    howTo: ['Space, up, or tap to jump — hold it longer to jump higher.', 'Down arrow to duck under the high blocks.', 'Score is distance travelled.'],
    notes: [
      'Obstacles are created 40 px beyond the right edge and never inside the field.',
      'At the starting speed of 300 px/s an obstacle is visible for 2.8 seconds before it matters.',
      'The minimum gap between obstacles is 1.6× the distance covered by a full jump, computed from the physics rather than guessed.',
      'Falling gravity is 1.7× rising gravity, and releasing the key cuts the rise — that is what makes the jump feel controllable.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Space shooter
   ================================================================ */

export function shooter(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   480x720. Enemies enter above y = -50 at 90px/s, taking eight seconds to
   cross, so they are visible long before they matter. The player's hit
   radius is 11 against a 34px ship — generous to the player, honest to the
   enemy, which is what makes near misses feel fair. */

var W = 480, H = 720;
var SPAWN_Y = -50;                 /* above the field, never inside it */
var PLAYER_R = 11, PLAYER_SIZE = 34, PLAYER_SPEED = 340;
var BULLET_SPEED = 620, FIRE_COOLDOWN = 0.17, MAX_BULLETS = 6;
var BASE_ENEMY_SPEED = 90, ENEMY_R = 15;

var player, bullets, enemies, stars, wave, waveLeft, spawnTimer, cooldown, lives, invuln;

function reset() {
  player = { x: W / 2, y: H - 90, target: null };
  bullets = [];
  enemies = [];
  wave = 0;
  waveLeft = 0;
  spawnTimer = 0.8;
  cooldown = 0;
  lives = 3;
  invuln = 0;
  stars = [];
  for (var i = 0; i < 70; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, s: 12 + Math.random() * 46, r: Math.random() * 1.6 + 0.4 });
  nextWave();
}

function nextWave() {
  wave++;
  waveLeft = 4 + wave;
  spawnTimer = 0.6;
}

function spawnEnemy() {
  enemies.push({
    x: Engine.rand(30, W - 30),
    y: SPAWN_Y,
    speed: Math.min(260, BASE_ENEMY_SPEED * Math.pow(1.08, wave - 1)),
    drift: Engine.rand(-40, 40),
    hp: wave > 4 && Math.random() < 0.25 ? 2 : 1
  });
}

function fire() {
  if (cooldown > 0 || bullets.length >= MAX_BULLETS) return;
  cooldown = FIRE_COOLDOWN;
  bullets.push({ x: player.x, y: player.y - 20 });
  Engine.audio.tone(880, 0.05, 'square', 0.08);
}

function hurt() {
  if (invuln > 0) return;
  lives--;
  invuln = 1.2;
  G.shake.kick(14);
  Engine.audio.noise(0.35, 0.18);
  if (lives <= 0) G.gameOver('Your ship is gone.');
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Move and shoot. Arrows or WASD, space to fire — or just drag a finger, which fires for you.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    cooldown -= dt;
    invuln -= dt;

    if (player.target != null) {
      player.x += Engine.clamp(player.target - player.x, -PLAYER_SPEED * dt * 1.6, PLAYER_SPEED * dt * 1.6);
      fire();
    }
    if (Engine.input.any(['ArrowLeft', 'a'])) player.x -= PLAYER_SPEED * dt;
    if (Engine.input.any(['ArrowRight', 'd'])) player.x += PLAYER_SPEED * dt;
    if (Engine.input.any([' ', 'ArrowUp', 'w'])) fire();
    player.x = Engine.clamp(player.x, 20, W - 20);

    for (var s = 0; s < stars.length; s++) {
      stars[s].y += stars[s].s * dt;
      if (stars[s].y > H) { stars[s].y = -2; stars[s].x = Math.random() * W; }
    }

    for (var b = bullets.length - 1; b >= 0; b--) {
      bullets[b].y -= BULLET_SPEED * dt;
      if (bullets[b].y < -12) bullets.splice(b, 1);
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0 && waveLeft > 0) {
      spawnEnemy();
      waveLeft--;
      spawnTimer = Math.max(0.35, 1.1 - wave * 0.05);
    }

    for (var e = enemies.length - 1; e >= 0; e--) {
      var en = enemies[e];
      en.y += en.speed * dt;
      en.x += en.drift * dt;
      if (en.x < 24 || en.x > W - 24) en.drift = -en.drift;

      if (en.y > H + 30) {
        enemies.splice(e, 1);
        continue;
      }
      if (invuln <= 0 && Engine.circlesHit(en.x, en.y, ENEMY_R, player.x, player.y, PLAYER_R)) {
        enemies.splice(e, 1);
        G.particles.burst(en.x, en.y, 20, C.bad, 240);
        hurt();
        continue;
      }
      for (var bb = bullets.length - 1; bb >= 0; bb--) {
        if (!Engine.circlesHit(en.x, en.y, ENEMY_R, bullets[bb].x, bullets[bb].y, 4)) continue;
        bullets.splice(bb, 1);
        en.hp--;
        if (en.hp <= 0) {
          enemies.splice(e, 1);
          G.addScore(10 * wave);
          G.particles.burst(en.x, en.y, 16, C.accent2, 220);
          Engine.audio.tone(180, 0.09, 'sawtooth', 0.1);
        } else {
          Engine.audio.tone(300, 0.04, 'square', 0.07);
        }
        break;
      }
    }

    if (waveLeft === 0 && enemies.length === 0) nextWave();
  },

  onKey: function (key, e) { if (key === ' ') { e.preventDefault(); fire(); } },
  onDown: function (p) { player.target = p.x; },
  onMove: function (p) { if (player.target != null) player.target = p.x; },
  onUp: function () { player.target = null; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.inkDim;
    for (var s = 0; s < stars.length; s++) {
      ctx.globalAlpha = 0.25 + stars[s].r / 3;
      ctx.fillRect(stars[s].x, stars[s].y, stars[s].r, stars[s].r);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = C.accent2;
    for (var b = 0; b < bullets.length; b++) ctx.fillRect(bullets[b].x - 2, bullets[b].y - 10, 4, 12);

    for (var e = 0; e < enemies.length; e++) {
      var en = enemies[e];
      ctx.fillStyle = en.hp > 1 ? C.bad : C.good;
      ctx.beginPath();
      ctx.moveTo(en.x, en.y + ENEMY_R);
      ctx.lineTo(en.x - ENEMY_R, en.y - ENEMY_R * 0.7);
      ctx.lineTo(en.x + ENEMY_R, en.y - ENEMY_R * 0.7);
      ctx.closePath();
      ctx.fill();
    }

    if (invuln <= 0 || Math.floor(invuln * 12) % 2 === 0) {
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - PLAYER_SIZE / 2);
      ctx.lineTo(player.x - PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.lineTo(player.x, player.y + PLAYER_SIZE / 4);
      ctx.lineTo(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
      ctx.closePath();
      ctx.fill();
    }

    for (var l = 0; l < lives; l++) {
      ctx.fillStyle = C.accent;
      ctx.fillRect(14 + l * 16, 16, 9, 9);
    }
    Engine.text(ctx, 'Wave ' + wave, W - 14, 22, 15, C.inkDim, 'right');
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Arrows or WASD to move · Space to fire · Drag a finger to move and fire', 'Space shooter field'),
    css: canvasCss('2 / 3'),
    howTo: ['Arrows or A/D to move, space to fire.', 'On a phone, drag anywhere — the ship follows your finger and fires automatically.', 'Three lives, with a moment of invulnerability after each hit.'],
    notes: [
      'Enemies enter above the top edge at y = −50 and take about eight seconds to cross the field at wave one.',
      'The player hit radius is 11 px against a 34 px ship, so near misses genuinely miss.',
      'Fire cooldown 170 ms with at most six bullets alive, so holding fire does not remove the difficulty.',
      'Each wave adds one enemy and 8% speed, capped at 260 px/s.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Rhythm — the one that is usually broken
   ================================================================ */

export function rhythm(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   The thing that matters most in this file:

   A note is scheduled by the time it must be HIT. Its position is derived
   from how far away that moment is:

       y = HIT_Y - (note.time - songTime) * SPEED

   so at note.time it is exactly on the hit line, and TRAVEL seconds earlier
   it is at HIT_Y - TRAVEL * SPEED, which is 40px above the top of the field.
   Notes are therefore never created on the hit line, and the player always
   gets 1.6 seconds of warning.

   The clock is the audio clock, not a frame counter, so nothing drifts. */

var W = 420, H = 640;
var LANES = 4, LANE_W = W / LANES;
var HIT_Y = 540;
var TRAVEL = 1.6;                        /* seconds of reaction time */
var SPEED = (HIT_Y + 40) / TRAVEL;       /* px per second, so spawn y = -40 */
var SPAWN_Y = -40;
var NOTE_H = 22;
var BPM = 120, BEAT = 60 / BPM, LEAD_IN = 3;
var PERFECT = 0.055, GREAT = 0.095, GOOD = 0.140;
var KEYS = ['d', 'f', 'j', 'k'];

var chart, combo, bestCombo, hits, judged, flash, laneGlow, beatIndex;
var songStart = null;

/** A fixed pattern rather than random spawning — a chart you can learn. */
function buildChart() {
  var notes = [];
  var pattern = [
    [0], [2], [1], [3],
    [0], [0], [2], [1],
    [3], [1], [2], [0],
    [1, 3], [0], [2], [0, 2]
  ];
  for (var bar = 0; bar < 8; bar++) {
    for (var i = 0; i < pattern.length; i++) {
      var lanes = pattern[(i + bar * 3) % pattern.length];
      for (var l = 0; l < lanes.length; l++) {
        notes.push({
          lane: lanes[l],
          time: LEAD_IN + (bar * pattern.length + i) * (BEAT / 2),
          hit: false,
          missed: false
        });
      }
    }
  }
  return notes;
}

function reset() {
  chart = buildChart();
  combo = 0;
  bestCombo = 0;
  hits = { perfect: 0, great: 0, good: 0, miss: 0 };
  judged = '';
  flash = 0;
  laneGlow = [0, 0, 0, 0];
  beatIndex = 0;
  songStart = null;
}

function now() {
  var ctx = Engine.audio.ctx;
  return ctx ? ctx.currentTime : performance.now() / 1000;
}

/* songStart is checked against null, not for truthiness: a freshly created
   AudioContext reports currentTime 0, and "0" is falsy, which would leave the
   song frozen at the start forever. */
function songTime() {
  return songStart === null ? 0 : now() - songStart;
}

function judge(lane) {
  laneGlow[lane] = 1;
  var t = songTime();
  var best = null, bestDelta = 999;
  for (var i = 0; i < chart.length; i++) {
    var n = chart[i];
    if (n.lane !== lane || n.hit || n.missed) continue;
    var delta = Math.abs(n.time - t);
    if (delta < bestDelta) { bestDelta = delta; best = n; }
  }
  if (!best || bestDelta > GOOD) return;

  best.hit = true;
  var name = bestDelta <= PERFECT ? 'perfect' : bestDelta <= GREAT ? 'great' : 'good';
  var points = name === 'perfect' ? 300 : name === 'great' ? 200 : 100;
  hits[name]++;
  combo++;
  bestCombo = Math.max(bestCombo, combo);
  G.addScore(points + Math.min(combo, 50) * 2);
  judged = name;
  flash = 0.35;
  Engine.audio.tone(name === 'perfect' ? 1046 : name === 'great' ? 880 : 660, 0.06, 'triangle', 0.12);
}

function accuracy() {
  var total = hits.perfect + hits.great + hits.good + hits.miss;
  if (!total) return 100;
  return Math.round(((hits.perfect + hits.great * 0.75 + hits.good * 0.4) / total) * 100);
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Hit each note as it crosses the line. Keys D F J K, or tap the lane.',
  particleGravity: 300,

  onStart: function () {
    // The audio context is already unlocked by restart(), inside the click.
    reset();
    songStart = now();
  },

  onUpdate: function (dt) {
    var t = songTime();
    flash = Math.max(0, flash - dt);
    for (var l = 0; l < LANES; l++) laneGlow[l] = Math.max(0, laneGlow[l] - dt * 4);

    /* a click track on every beat, from the audio clock */
    while (LEAD_IN + beatIndex * BEAT < t + 0.05) {
      if (LEAD_IN + beatIndex * BEAT > t - 0.2) {
        Engine.audio.tone(beatIndex % 4 === 0 ? 180 : 120, 0.04, 'sine', 0.05);
      }
      beatIndex++;
    }

    var remaining = 0;
    for (var i = 0; i < chart.length; i++) {
      var n = chart[i];
      if (n.hit) continue;
      if (!n.missed && t > n.time + GOOD) {
        n.missed = true;
        hits.miss++;
        combo = 0;
        judged = 'miss';
        flash = 0.3;
      }
      if (!n.missed) remaining++;
    }

    if (remaining === 0 && t > LEAD_IN) {
      G.win('Accuracy ' + accuracy() + '%, best combo ' + bestCombo);
    }
  },

  onKey: function (key) {
    var lane = KEYS.indexOf(String(key).toLowerCase());
    if (lane >= 0) judge(lane);
  },
  onDown: function (p) {
    var lane = Math.floor(p.x / LANE_W);
    if (lane >= 0 && lane < LANES) judge(lane);
  },

  onDraw: function (ctx) {
    var t = songTime();

    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    for (var l = 0; l < LANES; l++) {
      ctx.fillStyle = l % 2 ? C.surfaceAlt : C.surface;
      ctx.fillRect(l * LANE_W, 0, LANE_W, H);
      if (laneGlow[l] > 0) {
        ctx.globalAlpha = laneGlow[l] * 0.3;
        ctx.fillStyle = C.accent;
        ctx.fillRect(l * LANE_W, 0, LANE_W, H);
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(l * LANE_W + 0.5, 0);
      ctx.lineTo(l * LANE_W + 0.5, H);
      ctx.stroke();
    }

    /* the hit line */
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, HIT_Y);
    ctx.lineTo(W, HIT_Y);
    ctx.stroke();
    for (var k = 0; k < LANES; k++) {
      ctx.strokeStyle = C.inkDim;
      ctx.lineWidth = 2;
      Engine.roundRect(ctx, k * LANE_W + 10, HIT_Y - 16, LANE_W - 20, 32, 6);
      ctx.stroke();
      Engine.text(ctx, KEYS[k].toUpperCase(), k * LANE_W + LANE_W / 2, HIT_Y + 44, 15, C.inkDim, 'center');
    }

    /* notes — position derived from the time until they must be hit */
    for (var i = 0; i < chart.length; i++) {
      var n = chart[i];
      if (n.hit || n.missed) continue;
      var away = n.time - t;
      if (away > TRAVEL || away < -0.4) continue;
      var y = HIT_Y - away * SPEED;
      ctx.fillStyle = n.lane % 2 ? C.accent : C.accent2;
      Engine.roundRect(ctx, n.lane * LANE_W + 12, y - NOTE_H / 2, LANE_W - 24, NOTE_H, 5);
      ctx.fill();
    }

    if (t < LEAD_IN) {
      Engine.text(ctx, String(Math.ceil(LEAD_IN - t)), W / 2, H / 2 - 60, 64, C.inkDim, 'center');
    }

    if (flash > 0 && judged) {
      ctx.globalAlpha = Math.min(1, flash * 3);
      Engine.text(ctx, judged.toUpperCase(), W / 2, HIT_Y - 90, 30, judged === 'miss' ? C.bad : C.accent, 'center');
      ctx.globalAlpha = 1;
    }
    if (combo > 2) Engine.text(ctx, combo + ' combo', W / 2, 60, 22, C.ink, 'center');
    Engine.text(ctx, accuracy() + '%', W - 14, 26, 15, C.inkDim, 'right');
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'D F J K to hit · Tap the lane on a phone · Esc to pause', 'Rhythm game lanes'),
    css: canvasCss('21 / 32'),
    howTo: [
      'Hit D, F, J or K as the note crosses the line — or tap that lane on a phone.',
      'Perfect within 55 ms, great within 95 ms, good within 140 ms. Later than that is a miss.',
      'The combo multiplies your score; a miss resets it.',
    ],
    notes: [
      'Notes are scheduled by the moment they must be hit and their position is derived from how far away that moment is, so they arrive exactly on the beat and are never created on the hit line.',
      'Travel time is 1.6 seconds over 580 px, which is 362 px/s — that is the reaction time, and it should not go below 1.2 s.',
      'The clock is AudioContext.currentTime, not a frame counter, so the notes and the click track cannot drift apart.',
      'The chart is a fixed pattern that shifts each bar, so it can be learned rather than guessed at.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Pong
   ================================================================ */

export function pong(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   The computer paddle is capped at 380px/s, below the ball's maximum
   vertical speed, and only tracks once the ball is coming towards it. That
   is what makes it beatable: a fast angled shot outruns it. */

var W = 720, H = 440;
var PADDLE_W = 12, PADDLE_H = 86, EDGE = 26;
var BALL = 9, START_SPEED = 340, MAX_SPEED = 620;
var AI_SPEED = 380, TARGET = 7;

var left, right, ball, serveDelay, scores, twoPlayer;

function reset() {
  left = { y: H / 2, target: null };
  right = { y: H / 2, target: null };
  scores = { left: 0, right: 0 };
  twoPlayer = false;
  serve(1);
}

function serve(direction) {
  ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: START_SPEED, dir: direction };
  serveDelay = 0.7;
}

function launch() {
  var angle = Engine.rand(-0.45, 0.45);
  ball.vx = Math.cos(angle) * ball.speed * ball.dir;
  ball.vy = Math.sin(angle) * ball.speed;
}

function bounce(paddleY) {
  var offset = Engine.clamp((ball.y - paddleY) / (PADDLE_H / 2), -1, 1);
  var angle = offset * 60 * Math.PI / 180;
  ball.speed = Math.min(MAX_SPEED, ball.speed * 1.04);
  var dir = ball.vx > 0 ? -1 : 1;
  ball.vx = Math.cos(angle) * ball.speed * dir;
  ball.vy = Math.sin(angle) * ball.speed;
  Engine.audio.tone(420, 0.05, 'square', 0.1);
}

function point(side) {
  scores[side]++;
  G.setScore(scores.left);
  Engine.audio.sweep(300, 120, 0.25, 0.14);
  G.shake.kick(7);
  if (scores[side] >= TARGET) {
    if (side === 'left') G.win('You won ' + scores.left + '–' + scores.right + '.');
    else G.gameOver('Lost ' + scores.left + '–' + scores.right + '.');
    return;
  }
  serve(side === 'left' ? 1 : -1);
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'First to seven. W and S, or drag on the left. Press 2 for two players.',
  particleGravity: 0,

  onStart: reset,

  onUpdate: function (dt) {
    if (serveDelay > 0) {
      serveDelay -= dt;
      if (serveDelay <= 0) launch();
      return;
    }

    if (Engine.input.any(['w', 'ArrowUp'])) left.y -= 460 * dt;
    if (Engine.input.any(['s', 'ArrowDown'])) left.y += 460 * dt;
    if (left.target != null) left.y = left.target;
    left.y = Engine.clamp(left.y, PADDLE_H / 2, H - PADDLE_H / 2);

    if (twoPlayer) {
      if (Engine.input.any(['o'])) right.y -= 460 * dt;
      if (Engine.input.any(['l'])) right.y += 460 * dt;
      if (right.target != null) right.y = right.target;
    } else if (ball.vx > 0) {
      // Only tracks when the ball is coming, and never faster than AI_SPEED.
      var aim = ball.y + Engine.clamp((ball.y - right.y) * 0.1, -18, 18);
      right.y += Engine.clamp(aim - right.y, -AI_SPEED * dt, AI_SPEED * dt);
    }
    right.y = Engine.clamp(right.y, PADDLE_H / 2, H - PADDLE_H / 2);

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - BALL / 2 < 0) { ball.y = BALL / 2; ball.vy = Math.abs(ball.vy); }
    if (ball.y + BALL / 2 > H) { ball.y = H - BALL / 2; ball.vy = -Math.abs(ball.vy); }

    if (ball.vx < 0 && ball.x - BALL / 2 <= EDGE + PADDLE_W && ball.x > EDGE) {
      if (Math.abs(ball.y - left.y) <= PADDLE_H / 2 + BALL / 2) { ball.x = EDGE + PADDLE_W + BALL / 2; bounce(left.y); }
    }
    if (ball.vx > 0 && ball.x + BALL / 2 >= W - EDGE - PADDLE_W && ball.x < W - EDGE) {
      if (Math.abs(ball.y - right.y) <= PADDLE_H / 2 + BALL / 2) { ball.x = W - EDGE - PADDLE_W - BALL / 2; bounce(right.y); }
    }

    if (ball.x < -20) point('right');
    else if (ball.x > W + 20) point('left');
  },

  onKey: function (key) {
    if (key === '2') twoPlayer = !twoPlayer;
  },
  onDown: function (p) { if (p.x < W / 2) left.target = p.y; else if (twoPlayer) right.target = p.y; },
  onMove: function (p) { if (p.x < W / 2) left.target = p.y; else if (twoPlayer) right.target = p.y; },
  onUp: function () { left.target = null; right.target = null; },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = C.line;
    for (var y = 10; y < H; y += 26) ctx.fillRect(W / 2 - 2, y, 4, 14);

    ctx.fillStyle = C.accent;
    Engine.roundRect(ctx, EDGE, left.y - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
    ctx.fill();
    ctx.fillStyle = twoPlayer ? C.accent2 : C.inkDim;
    Engine.roundRect(ctx, W - EDGE - PADDLE_W, right.y - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
    ctx.fill();

    ctx.fillStyle = C.ink;
    ctx.fillRect(ball.x - BALL / 2, ball.y - BALL / 2, BALL, BALL);

    Engine.text(ctx, String(scores.left), W / 2 - 46, 44, 34, C.inkDim, 'right');
    Engine.text(ctx, String(scores.right), W / 2 + 46, 44, 34, C.inkDim, 'left');
    Engine.text(ctx, twoPlayer ? 'Two players — O and L' : 'You vs the computer — press 2 to change', W / 2, H - 20, 13, C.inkDim, 'center');

    if (serveDelay > 0 && G.playing) {
      Engine.text(ctx, String(Math.ceil(serveDelay * 3)), W / 2, H / 2, 40, C.line, 'center');
    }
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'W / S or drag on your half · 2 toggles two players · Esc to pause', 'Pong court'),
    css: canvasCss('18 / 11'),
    howTo: ['W and S, or drag on the left half.', 'Press 2 for two players — the second uses O and L, or drags on the right.', 'First to seven points.'],
    notes: [
      'The computer paddle is capped at 380 px/s and only moves once the ball is heading its way, so a fast angled shot beats it.',
      'The exit angle comes from where the ball hit the paddle, up to 60° — the same trick as brick breaker, and the reason rallies vary.',
      'Ball speed rises 4% per hit to a cap of 620 px/s.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}

/* ================================================================
   Maze
   ================================================================ */

export function maze(spec: Spec, _design: DesignSystem): Piece {
  const script = `${GAME_SHELL}
/* --- ${spec.title} ---------------------------------------------------
   The maze is carved with a recursive backtracker driven by an explicit
   stack — an actual spanning tree, so every cell is reachable and the exit
   can never be walled off. An explicit stack rather than recursion, because
   recursion blows the call stack on a large grid. */

var CELLS = 15, MAX_CELLS = 31;
var W = 600, H = 600;

var grid, cell, player, goal, level, moves, startedAt, elapsed, cols;

function index(x, y) { return y * cols + x; }

function carve() {
  cols = CELLS;
  cell = Math.floor(Math.min(W, H) / cols);
  grid = [];
  for (var i = 0; i < cols * cols; i++) {
    grid.push({ n: true, e: true, s: true, w: true, seen: false });
  }

  var stack = [{ x: 0, y: 0 }];
  grid[0].seen = true;
  var visited = 1;

  while (visited < cols * cols) {
    var current = stack[stack.length - 1];
    var options = [];
    if (current.y > 0 && !grid[index(current.x, current.y - 1)].seen) options.push('n');
    if (current.x < cols - 1 && !grid[index(current.x + 1, current.y)].seen) options.push('e');
    if (current.y < cols - 1 && !grid[index(current.x, current.y + 1)].seen) options.push('s');
    if (current.x > 0 && !grid[index(current.x - 1, current.y)].seen) options.push('w');

    if (!options.length) {
      stack.pop();
      if (!stack.length) break;
      continue;
    }

    var dir = Engine.pick(options);
    var next = { x: current.x, y: current.y };
    if (dir === 'n') next.y--;
    else if (dir === 's') next.y++;
    else if (dir === 'e') next.x++;
    else next.x--;

    var a = grid[index(current.x, current.y)];
    var b = grid[index(next.x, next.y)];
    a[dir] = false;
    b[{ n: 's', s: 'n', e: 'w', w: 'e' }[dir]] = false;
    b.seen = true;
    visited++;
    stack.push(next);
  }
}

function reset() {
  level = 1;
  nextMaze();
}

function nextMaze() {
  carve();
  player = { x: 0, y: 0 };
  goal = { x: cols - 1, y: cols - 1 };
  moves = 0;
  startedAt = performance.now();
  elapsed = 0;
}

function move(dx, dy) {
  if (!G.playing) return;
  var here = grid[index(player.x, player.y)];
  if (dx === 1 && here.e) return;
  if (dx === -1 && here.w) return;
  if (dy === 1 && here.s) return;
  if (dy === -1 && here.n) return;

  player.x += dx;
  player.y += dy;
  moves++;
  Engine.audio.tone(300 + moves % 6 * 40, 0.03, 'sine', 0.05);

  if (player.x === goal.x && player.y === goal.y) {
    var seconds = Math.max(1, Math.round(elapsed));
    G.addScore(Math.max(50, 600 - moves * 4 - seconds * 3));
    G.particles.burst(goal.x * cell + cell / 2, goal.y * cell + cell / 2, 26, C.accent2, 220);
    Engine.audio.tone(880, 0.12, 'triangle', 0.14);
    level++;
    CELLS = Math.min(MAX_CELLS, CELLS + 2);
    nextMaze();
  }
}

var G = Game({
  W: W, H: H,
  key: '${spec.slug}.best',
  title: '${spec.title}',
  intro: 'Find the way out. Arrows, WASD, or swipe. Each maze is bigger than the last.',
  particleGravity: 0,

  onStart: function () { CELLS = 15; reset(); },

  onUpdate: function () {
    elapsed = (performance.now() - startedAt) / 1000;
  },

  onKey: function (key) {
    if (key === 'ArrowUp' || key === 'w') move(0, -1);
    else if (key === 'ArrowDown' || key === 's') move(0, 1);
    else if (key === 'ArrowLeft' || key === 'a') move(-1, 0);
    else if (key === 'ArrowRight' || key === 'd') move(1, 0);
  },
  onSwipe: function (d) {
    if (d === 'up') move(0, -1);
    else if (d === 'down') move(0, 1);
    else if (d === 'left') move(-1, 0);
    else move(1, 0);
  },

  onDraw: function (ctx) {
    ctx.fillStyle = C.surface;
    ctx.fillRect(0, 0, W, H);

    var size = cols * cell;
    var ox = (W - size) / 2, oy = (H - size) / 2;

    ctx.save();
    ctx.translate(ox, oy);

    ctx.fillStyle = C.accent2;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(goal.x * cell, goal.y * cell, cell, cell);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2;
    ctx.lineCap = 'square';
    ctx.beginPath();
    for (var y = 0; y < cols; y++) {
      for (var x = 0; x < cols; x++) {
        var c = grid[index(x, y)];
        var px = x * cell, py = y * cell;
        if (c.n) { ctx.moveTo(px, py); ctx.lineTo(px + cell, py); }
        if (c.w) { ctx.moveTo(px, py); ctx.lineTo(px, py + cell); }
        if (y === cols - 1 && c.s) { ctx.moveTo(px, py + cell); ctx.lineTo(px + cell, py + cell); }
        if (x === cols - 1 && c.e) { ctx.moveTo(px + cell, py); ctx.lineTo(px + cell, py + cell); }
      }
    }
    ctx.stroke();

    ctx.fillStyle = C.accent;
    ctx.beginPath();
    ctx.arc(player.x * cell + cell / 2, player.y * cell + cell / 2, cell * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    Engine.text(ctx, 'Level ' + level + '  ·  ' + moves + ' moves  ·  ' + Math.round(elapsed) + 's', W / 2, 18, 15, C.inkDim, 'center');
  }
});
`;

  return {
    script,
    markup: canvasMarkup(spec, 'Arrows, WASD or swipe · Esc to pause', 'Maze grid'),
    css: canvasCss('1 / 1'),
    howTo: ['Arrows, WASD, or swipe to move.', 'Reach the highlighted corner. Each maze is two cells wider than the last, up to 31.', 'Fewer moves and less time means a higher score.'],
    notes: [
      'The maze is carved with a recursive backtracker using an explicit stack, so it is a spanning tree: every cell is reachable and the exit can never be sealed off.',
      'An explicit stack rather than recursion, because a 31×31 grid would otherwise risk a stack overflow.',
      'Walls are drawn as lines between cells rather than filled blocks, which reads far better at small sizes.',
    ],
    engine: true,
    scriptName: 'game.js',
  };
}
