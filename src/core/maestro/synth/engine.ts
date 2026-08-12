/**
 * The engine the native synthesiser writes into every canvas game it builds.
 *
 * It is emitted as source rather than linked, so a generated project is a
 * self-contained thing someone can read, edit and learn from — which is the
 * whole point of an app that builds projects for you.
 *
 * Everything in here exists because leaving it out produces a specific bug:
 *
 *   stage()     a canvas whose backing store ignores devicePixelRatio is soft
 *               on every phone, and one that ignores resize is the wrong shape
 *               after a rotation.
 *   loop()      a loop that does not clamp dt teleports everything through a
 *               wall when the tab has been in the background.
 *   input       arrow keys that are not prevented scroll the page under the
 *               game; a game with no pointer handling is dead on a phone.
 *   audio       an AudioContext created outside a gesture is suspended forever.
 *
 * Written without template literals on purpose: it is generated code, and
 * concatenation keeps the generator readable.
 */

export const ENGINE_JS = `/* Engine — the small runtime every game in this project is built on.
   Canvas fitting, a time-based loop, input, sound and particles. */
(function (global) {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }
  /** Axis-aligned box overlap. Boxes are {x, y, w, h} with x,y at the corner. */
  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  /** Circle overlap by centre distance — cheaper and fairer than boxes. */
  function circlesHit(ax, ay, ar, bx, by, br) {
    var dx = ax - bx, dy = ay - by, r = ar + br;
    return dx * dx + dy * dy <= r * r;
  }

  /* ---------------------------------------------------------------- stage */

  /**
   * A canvas that always shows the same logical W x H field, fitted to
   * whatever space it has, sharp on any pixel ratio.
   */
  function stage(canvas, W, H) {
    var ctx = canvas.getContext('2d');
    var api = { canvas: canvas, ctx: ctx, W: W, H: H, scale: 1 };

    function resize() {
      var box = canvas.parentElement || document.body;
      var availW = box.clientWidth || window.innerWidth;
      var availH = box.clientHeight || window.innerHeight;
      var scale = Math.min(availW / W, availH / H);
      if (!isFinite(scale) || scale <= 0) scale = 1;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = Math.floor(W * scale) + 'px';
      canvas.style.height = Math.floor(H * scale) + 'px';
      canvas.width = Math.max(1, Math.floor(W * scale * dpr));
      canvas.height = Math.max(1, Math.floor(H * scale * dpr));
      // Everything below draws in logical units and comes out sharp.
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      api.scale = scale;
    }

    /** Client coordinates to field coordinates. */
    api.toLocal = function (clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      return { x: (clientX - r.left) * (W / r.width), y: (clientY - r.top) * (H / r.height) };
    };
    api.resize = resize;

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 120); });
    return api;
  }

  /* ----------------------------------------------------------------- loop */

  /**
   * step(dt, time) is called once per frame with the seconds since the last
   * one, clamped so a backgrounded tab never resumes with a huge jump.
   */
  function loop(step) {
    var raf = 0, last = 0, running = false;

    function frame(t) {
      if (!running) return;
      if (!last) last = t;
      var dt = (t - last) / 1000;
      last = t;
      if (dt > 0.05) dt = 0.05;
      step(dt, t / 1000);
      raf = requestAnimationFrame(frame);
    }

    return {
      start: function () {
        if (running) return;
        running = true; last = 0;
        raf = requestAnimationFrame(frame);
      },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      isRunning: function () { return running; }
    };
  }

  /* ---------------------------------------------------------------- input */

  var keys = Object.create(null);
  var keyDownHandlers = [];
  // The keys a game uses that would otherwise scroll the page.
  var SWALLOW = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, ' ': 1, Spacebar: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1 };

  window.addEventListener('keydown', function (e) {
    if (SWALLOW[e.key]) e.preventDefault();
    keys[e.key] = true;
    if (typeof e.key === 'string') keys[e.key.toLowerCase()] = true;
    if (!e.repeat) {
      for (var i = 0; i < keyDownHandlers.length; i++) keyDownHandlers[i](e.key, e);
    }
  }, { passive: false });

  window.addEventListener('keyup', function (e) {
    keys[e.key] = false;
    if (typeof e.key === 'string') keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('blur', function () { for (var k in keys) keys[k] = false; });

  var input = {
    held: function (key) { return !!keys[key]; },
    /** Any of several keys, so WASD and the arrows are one call. */
    any: function (list) {
      for (var i = 0; i < list.length; i++) if (keys[list[i]]) return true;
      return false;
    },
    onKey: function (fn) { keyDownHandlers.push(fn); },
    clear: function () { for (var k in keys) keys[k] = false; }
  };

  /**
   * Pointer input for one element, in field coordinates, with swipes.
   * Pointer events cover mouse, pen and touch in one path.
   */
  function pointer(el, st, handlers) {
    var start = null;
    el.style.touchAction = 'none';

    el.addEventListener('pointerdown', function (e) {
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not fatal */ }
      var p = st.toLocal(e.clientX, e.clientY);
      start = { x: e.clientX, y: e.clientY, t: performance.now(), swiped: false };
      if (handlers.down) handlers.down(p, e);
    });

    el.addEventListener('pointermove', function (e) {
      var p = st.toLocal(e.clientX, e.clientY);
      if (handlers.move) handlers.move(p, e);
      if (start && !start.swiped && handlers.swipe) {
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        // 24px, so a slightly shaky tap is not read as a swipe.
        if (Math.abs(dx) > 24 || Math.abs(dy) > 24) {
          start.swiped = true;
          handlers.swipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        }
      }
    });

    function end(e) {
      var p = st.toLocal(e.clientX, e.clientY);
      var wasTap = start && !start.swiped && performance.now() - start.t < 320;
      if (handlers.up) handlers.up(p, e);
      if (wasTap && handlers.tap) handlers.tap(p, e);
      start = null;
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', function () { start = null; });
  }

  /* ---------------------------------------------------------------- audio */

  /**
   * Sound synthesised on the spot — no files to load, nothing to 404.
   * The context is created on the first unlock() call, which every game makes
   * from inside a real gesture, because a context made before one is suspended.
   */
  var audio = {
    ctx: null,
    muted: false,

    unlock: function () {
      if (!this.ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },

    tone: function (freq, dur, type, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var amp = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      amp.gain.setValueAtTime(0.0001, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(gain || 0.14, ctx.currentTime + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (dur || 0.12));
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (dur || 0.12) + 0.02);
    },

    /** A short slide, for pickups and jumps. */
    sweep: function (from, to, dur, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var amp = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(from, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), ctx.currentTime + dur);
      amp.gain.setValueAtTime(gain || 0.16, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(amp); amp.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.02);
    },

    /** Filtered noise, for hits and explosions. */
    noise: function (dur, gain) {
      if (this.muted) return;
      var ctx = this.unlock();
      if (!ctx) return;
      var len = Math.floor(ctx.sampleRate * (dur || 0.2));
      var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = ctx.createBufferSource();
      var amp = ctx.createGain();
      src.buffer = buffer;
      amp.gain.value = gain || 0.16;
      src.connect(amp); amp.connect(ctx.destination);
      src.start();
    },

    toggle: function () {
      this.muted = !this.muted;
      if (!this.muted) this.unlock();
      return this.muted;
    }
  };

  /* ------------------------------------------------------------ particles */

  /** A fixed pool, so a long game never grows its memory. */
  function particles(max) {
    var pool = [];
    for (var i = 0; i < (max || 220); i++) pool.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 3, color: '#fff' });

    return {
      burst: function (x, y, count, color, speed) {
        var made = 0;
        for (var i = 0; i < pool.length && made < count; i++) {
          var p = pool[i];
          if (p.alive) continue;
          var a = Math.random() * Math.PI * 2;
          var s = (speed || 160) * (0.35 + Math.random() * 0.9);
          p.alive = true; p.x = x; p.y = y;
          p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
          p.max = p.life = 0.35 + Math.random() * 0.4;
          p.size = 2 + Math.random() * 3;
          p.color = color;
          made++;
        }
      },
      update: function (dt, gravity) {
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i];
          if (!p.alive) continue;
          p.life -= dt;
          if (p.life <= 0) { p.alive = false; continue; }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += (gravity == null ? 420 : gravity) * dt;
        }
      },
      draw: function (ctx) {
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i];
          if (!p.alive) continue;
          ctx.globalAlpha = Math.max(0, p.life / p.max);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
      },
      clear: function () { for (var i = 0; i < pool.length; i++) pool[i].alive = false; }
    };
  }

  /* -------------------------------------------------------------- shake */

  function shaker() {
    var amount = 0;
    return {
      kick: function (n) { amount = Math.max(amount, n); },
      update: function (dt) { amount = Math.max(0, amount - dt * 26); },
      apply: function (ctx) {
        if (amount <= 0) return;
        ctx.translate(rand(-amount, amount), rand(-amount, amount));
      }
    };
  }

  /* -------------------------------------------------------------- storage */

  /** localStorage is unavailable in some private modes; never let that throw. */
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (err) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* full or blocked */ }
    }
  };

  /* --------------------------------------------------------------- text */

  function text(ctx, str, x, y, size, color, align, font) {
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '700 ' + size + 'px ' + (font || 'system-ui, sans-serif');
    ctx.fillText(str, x, y);
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  global.Engine = {
    stage: stage,
    loop: loop,
    input: input,
    pointer: pointer,
    audio: audio,
    particles: particles,
    shaker: shaker,
    store: store,
    text: text,
    roundRect: roundRect,
    clamp: clamp,
    lerp: lerp,
    rand: rand,
    randInt: randInt,
    pick: pick,
    shuffle: shuffle,
    overlaps: overlaps,
    circlesHit: circlesHit
  };
})(window);
`;
