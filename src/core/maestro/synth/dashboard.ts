import { DesignSystem, Spec } from '../types';
import { Piece } from './games';

/**
 * A dashboard, drawn in inline SVG.
 *
 * No chart library: a line chart and a bar chart are about sixty lines each,
 * they stay sharp at any size, and they cannot fail to load because a CDN is
 * blocked. Every axis is labelled and every number carries a comparison,
 * because a figure with no baseline says nothing at all.
 */

export function dashboard(spec: Spec, _design: DesignSystem): Piece {
  const subject = spec.subject || 'the service';

  const script = `/* --- ${spec.title} ---------------------------------------------------
   The data is generated from a fixed seed so it looks like real traffic and
   does not jump about between reloads. Replace makeSeries() with your own
   source; everything below works off the same shape. */

var RANGES = { '7': 7, '30': 30, '90': 90 };
var range = 30;

/** A tiny seeded generator — same numbers every time the page loads. */
function seeded(seed) {
  var value = seed;
  return function () {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function makeSeries(days, seed, base, drift, noise) {
  var random = seeded(seed);
  var points = [];
  var level = base;
  var today = new Date();
  for (var i = days - 1; i >= 0; i--) {
    var date = new Date(today.getTime() - i * 86400000);
    level = level * (1 + drift) + (random() - 0.5) * noise;
    /* weekends are quieter, which is what makes a chart look real */
    var weekend = date.getDay() === 0 || date.getDay() === 6;
    points.push({
      date: date,
      value: Math.max(0, Math.round(level * (weekend ? 0.68 : 1)))
    });
  }
  return points;
}

function sum(points) {
  var total = 0;
  for (var i = 0; i < points.length; i++) total += points[i].value;
  return total;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(Math.round(n));
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ---- line chart ------------------------------------------------- */

function lineChart(target, points, unit, colour) {
  var W = 720, H = 260, PAD_L = 52, PAD_B = 34, PAD_T = 14, PAD_R = 12;
  var max = 0;
  for (var i = 0; i < points.length; i++) max = Math.max(max, points[i].value);
  max = niceMax(max);

  var plotW = W - PAD_L - PAD_R;
  var plotH = H - PAD_T - PAD_B;
  var stepX = plotW / Math.max(1, points.length - 1);

  var svg = ns('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Daily ' + unit + ' over the last ' + points.length + ' days');

  /* horizontal grid and the y axis labels — a chart without units is decoration */
  for (var g = 0; g <= 4; g++) {
    var value = (max / 4) * g;
    var y = PAD_T + plotH - (value / max) * plotH;
    var grid = ns('line');
    grid.setAttribute('x1', String(PAD_L));
    grid.setAttribute('x2', String(W - PAD_R));
    grid.setAttribute('y1', String(y));
    grid.setAttribute('y2', String(y));
    grid.setAttribute('class', 'grid');
    svg.appendChild(grid);

    var label = ns('text');
    label.setAttribute('x', String(PAD_L - 10));
    label.setAttribute('y', String(y + 4));
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('class', 'axis');
    label.textContent = formatNumber(value);
    svg.appendChild(label);
  }

  var d = '';
  var area = '';
  for (var p = 0; p < points.length; p++) {
    var px = PAD_L + p * stepX;
    var py = PAD_T + plotH - (points[p].value / max) * plotH;
    d += (p === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
  }
  area = d + 'L' + (PAD_L + plotW).toFixed(1) + ' ' + (PAD_T + plotH) + ' L' + PAD_L + ' ' + (PAD_T + plotH) + ' Z';

  var fill = ns('path');
  fill.setAttribute('d', area);
  fill.setAttribute('fill', colour);
  fill.setAttribute('opacity', '0.14');
  svg.appendChild(fill);

  var line = ns('path');
  line.setAttribute('d', d.trim());
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', colour);
  line.setAttribute('stroke-width', '2.5');
  line.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(line);

  /* x axis: first, middle and last date, so it is readable at any width */
  var marks = [0, Math.floor(points.length / 2), points.length - 1];
  for (var m = 0; m < marks.length; m++) {
    var mark = ns('text');
    mark.setAttribute('x', String(PAD_L + marks[m] * stepX));
    mark.setAttribute('y', String(H - 10));
    mark.setAttribute('text-anchor', m === 0 ? 'start' : m === 2 ? 'end' : 'middle');
    mark.setAttribute('class', 'axis');
    mark.textContent = formatDate(points[marks[m]].date);
    svg.appendChild(mark);
  }

  var unitLabel = ns('text');
  unitLabel.setAttribute('x', String(PAD_L));
  unitLabel.setAttribute('y', '10');
  unitLabel.setAttribute('class', 'axis');
  unitLabel.textContent = unit + ' per day';
  svg.appendChild(unitLabel);

  target.textContent = '';
  target.appendChild(svg);
}

/* ---- bar chart -------------------------------------------------- */

function barChart(target, rows, unit, colour) {
  var W = 720, H = 260, PAD_L = 108, PAD_B = 28, PAD_T = 10, PAD_R = 16;
  var max = 0;
  for (var i = 0; i < rows.length; i++) max = Math.max(max, rows[i].value);
  max = niceMax(max);

  var plotW = W - PAD_L - PAD_R;
  var band = (H - PAD_T - PAD_B) / rows.length;

  var svg = ns('svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', unit + ' by source');

  for (var r = 0; r < rows.length; r++) {
    var y = PAD_T + r * band;
    var width = (rows[r].value / max) * plotW;      /* bars always start at zero */

    var bar = ns('rect');
    bar.setAttribute('x', String(PAD_L));
    bar.setAttribute('y', String(y + band * 0.18));
    bar.setAttribute('width', String(Math.max(2, width)));
    bar.setAttribute('height', String(band * 0.64));
    bar.setAttribute('fill', colour);
    bar.setAttribute('rx', '3');
    svg.appendChild(bar);

    var name = ns('text');
    name.setAttribute('x', String(PAD_L - 12));
    name.setAttribute('y', String(y + band / 2 + 4));
    name.setAttribute('text-anchor', 'end');
    name.setAttribute('class', 'axis');
    name.textContent = rows[r].label;
    svg.appendChild(name);

    var value = ns('text');
    value.setAttribute('x', String(PAD_L + Math.max(2, width) + 8));
    value.setAttribute('y', String(y + band / 2 + 4));
    value.setAttribute('class', 'axis');
    value.textContent = formatNumber(rows[r].value);
    svg.appendChild(value);
  }

  var caption = ns('text');
  caption.setAttribute('x', String(PAD_L));
  caption.setAttribute('y', String(H - 8));
  caption.setAttribute('class', 'axis');
  caption.textContent = 'Total ' + unit + ' in the period';
  svg.appendChild(caption);

  target.textContent = '';
  target.appendChild(svg);
}

function niceMax(value) {
  if (value <= 0) return 10;
  var magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / magnitude) * magnitude;
}

function ns(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

/* ---- tiles ------------------------------------------------------- */

function tile(id, current, previous, unit) {
  var valueEl = document.getElementById(id);
  var deltaEl = document.getElementById(id + '-delta');
  valueEl.textContent = formatNumber(current) + (unit || '');
  if (!previous) { deltaEl.textContent = 'no earlier period'; return; }
  var change = ((current - previous) / previous) * 100;
  deltaEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '% vs the previous ' + range + ' days';
  deltaEl.className = 'tile__delta ' + (change >= 0 ? 'is-up' : 'is-down');
}

/* ---- render ------------------------------------------------------ */

function accentColour(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#4c9aff';
}

function render() {
  var visits = makeSeries(range * 2, 20260812, 900, 0.004, 140);
  var signups = makeSeries(range * 2, 77712, 62, 0.006, 22);

  var currentVisits = visits.slice(range);
  var earlierVisits = visits.slice(0, range);
  var currentSignups = signups.slice(range);
  var earlierSignups = signups.slice(0, range);

  tile('visits', sum(currentVisits), sum(earlierVisits), '');
  tile('signups', sum(currentSignups), sum(earlierSignups), '');
  tile('rate', (sum(currentSignups) / Math.max(1, sum(currentVisits))) * 100, (sum(earlierSignups) / Math.max(1, sum(earlierVisits))) * 100, '%');
  tile('session', 214, 226, 's');

  lineChart(document.getElementById('chart-line'), currentVisits, 'Visits', accentColour('--accent'));

  barChart(document.getElementById('chart-bar'), [
    { label: 'Direct', value: Math.round(sum(currentVisits) * 0.34) },
    { label: 'Search', value: Math.round(sum(currentVisits) * 0.28) },
    { label: 'Referral', value: Math.round(sum(currentVisits) * 0.19) },
    { label: 'Social', value: Math.round(sum(currentVisits) * 0.13) },
    { label: 'Email', value: Math.round(sum(currentVisits) * 0.06) }
  ], 'Visits', accentColour('--accent-2'));

  document.getElementById('period').textContent = 'Last ' + range + ' days';
}

var buttons = document.querySelectorAll('[data-range]');
for (var i = 0; i < buttons.length; i++) {
  (function (button) {
    button.addEventListener('click', function () {
      range = RANGES[button.dataset.range];
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].setAttribute('aria-pressed', buttons[b] === button ? 'true' : 'false');
      }
      render();
    });
  })(buttons[i]);
}

render();
window.addEventListener('resize', render);
`;

  const markup = `      <div class="dash-head">
        <div>
          <h2>${subject.charAt(0).toUpperCase()}${subject.slice(1)} overview</h2>
          <p class="muted" id="period">Last 30 days</p>
        </div>
        <div class="ranges" role="group" aria-label="Time range">
          <button type="button" data-range="7" aria-pressed="false">7 days</button>
          <button type="button" data-range="30" aria-pressed="true">30 days</button>
          <button type="button" data-range="90" aria-pressed="false">90 days</button>
        </div>
      </div>

      <div class="tiles">
        <article class="tile"><h3>Visits</h3><p class="tile__value" id="visits">—</p><p class="tile__delta" id="visits-delta"></p></article>
        <article class="tile"><h3>Sign-ups</h3><p class="tile__value" id="signups">—</p><p class="tile__delta" id="signups-delta"></p></article>
        <article class="tile"><h3>Conversion</h3><p class="tile__value" id="rate">—</p><p class="tile__delta" id="rate-delta"></p></article>
        <article class="tile"><h3>Median session</h3><p class="tile__value" id="session">—</p><p class="tile__delta" id="session-delta"></p></article>
      </div>

      <section class="panel">
        <h3>Visits per day</h3>
        <div class="chart" id="chart-line"></div>
      </section>

      <section class="panel">
        <h3>Where they came from</h3>
        <div class="chart" id="chart-bar"></div>
      </section>

      <p class="muted small">The figures are generated sample data with a fixed seed, so they are stable between reloads. Replace makeSeries() in app.js with your own source.</p>`;

  const css = `
.dash-head { display: flex; gap: 16px; align-items: end; justify-content: space-between; flex-wrap: wrap; }
.dash-head h2 { font-size: var(--step-2); }

.ranges { display: flex; gap: 4px; padding: 3px; background: var(--surface-alt); border-radius: var(--radius); }
.ranges button { min-height: 38px; padding: 0 14px; border-radius: calc(var(--radius) - 2px); color: var(--ink-dim); font-size: 0.9rem; }
.ranges button[aria-pressed="true"] { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: 14px; }
.tile { padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.tile h3 { font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim); font-family: var(--font-body); }
.tile__value { font-family: var(--font-display); font-size: 2rem; font-weight: 700; font-variant-numeric: tabular-nums; margin-top: 6px; }
.tile__delta { font-size: 0.85rem; color: var(--ink-dim); margin-top: 2px; }
.tile__delta.is-up { color: var(--good); }
.tile__delta.is-down { color: var(--bad); }

.panel { padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); }
.panel h3 { font-size: 1rem; margin-bottom: 12px; }
.chart { overflow-x: auto; }
.chart svg { width: 100%; height: auto; min-width: 420px; display: block; }
.chart .grid { stroke: var(--line); stroke-width: 1; }
.chart .axis { fill: var(--ink-dim); font-size: 11px; font-family: var(--font-body); }

.small { font-size: 0.85rem; }`;

  return {
    script,
    markup,
    css,
    howTo: [
      'Switch the range with the 7, 30 and 90 day buttons — the tiles and both charts change with it.',
      'Replace makeSeries() in app.js with a real data source; everything else works off the same shape.',
    ],
    notes: [
      'Both charts are inline SVG built in the page — no chart library, so nothing can fail to load and the drawing stays sharp at any size.',
      'Every axis is labelled, both charts state their unit, and the bars start at zero.',
      'Every headline figure carries its change against the previous period of the same length; a number with no baseline says nothing.',
      'The sample data uses a fixed seed and a weekend dip, so it looks like real traffic and does not jump between reloads.',
      'Charts scroll horizontally inside their panel below 420 px rather than squashing.',
    ],
    engine: false,
    scriptName: 'app.js',
  };
}
