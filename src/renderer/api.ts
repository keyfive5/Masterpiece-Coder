import { AgentEvent, Bridge, DEFAULT_SETTINGS, FileNode } from '../shared/types';
import { languageFor } from '../shared/lang';

declare global {
  interface Window {
    mc?: Bridge;
  }
}

/** True when running in a plain browser (`npm run web`) rather than in Electron. */
export const isDemo = typeof window !== 'undefined' && !window.mc;

/* ------------------------------------------------------------------ *
 * Demo bridge — an in-memory project and a scripted agent run so the
 * interface can be explored (and screenshotted) without an API key.
 * ------------------------------------------------------------------ */

const DEMO_FILES: Record<string, string> = {
  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Aurora — a tiny synth</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="stage">
      <h1>Aurora</h1>
      <p class="hint">Press A–L to play. Space holds the sustain pedal.</p>
      <div id="keys" class="keys"></div>
    </main>
    <script type="module" src="synth.js"></script>
  </body>
</html>
`,
  'style.css': `:root {
  color-scheme: dark;
  --key: #161b25;
  --key-lit: #7c8cff;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 100% at 50% 0%, #1a2030 0%, #0a0c11 60%);
  color: #e7ebf3;
  font: 16px/1.5 system-ui, sans-serif;
}

.keys {
  display: flex;
  gap: 6px;
}

.key {
  width: 52px;
  height: 180px;
  border-radius: 0 0 10px 10px;
  background: var(--key);
  transition: background 90ms ease, transform 90ms ease;
}

.key[data-on] {
  background: var(--key-lit);
  transform: translateY(3px);
}
`,
  'synth.js': `const NOTES = { a: 261.63, s: 293.66, d: 329.63, f: 349.23, g: 392.0, h: 440.0, j: 493.88, k: 523.25 };

const ctx = new AudioContext();
const live = new Map();

function press(key) {
  if (live.has(key) || !NOTES[key]) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = NOTES[key];
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  live.set(key, { osc, gain });
  document.querySelector(\`[data-key="\${key}"]\`)?.setAttribute('data-on', '');
}

function release(key) {
  const voice = live.get(key);
  if (!voice) return;
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  voice.osc.stop(ctx.currentTime + 0.26);
  live.delete(key);
  document.querySelector(\`[data-key="\${key}"]\`)?.removeAttribute('data-on');
}

const keys = document.getElementById('keys');
for (const key of Object.keys(NOTES)) {
  const el = document.createElement('div');
  el.className = 'key';
  el.dataset.key = key;
  keys.append(el);
}

addEventListener('keydown', (e) => !e.repeat && press(e.key.toLowerCase()));
addEventListener('keyup', (e) => release(e.key.toLowerCase()));
`,
  'README.md': `# Aurora

A tiny browser synthesizer built from a single sentence in **Masterpiece Coder**.

- No build step, no dependencies
- Web Audio API oscillators with a short attack/release envelope
- Open \`index.html\` in the Preview panel and start playing
`,
};

const DEMO_SCRIPT: AgentEvent[] = [
  { type: 'turn_start', turnId: 'demo' },
  { type: 'block_start', kind: 'thinking', id: 't1' },
  {
    type: 'delta',
    id: 't1',
    kind: 'thinking',
    text: 'A playable synth in the browser means Web Audio. Keep it dependency-free: one HTML page, one stylesheet, one module. Oscillators per key with a short envelope so notes do not click, and a keyboard map for A–L.',
  },
  { type: 'block_end', id: 't1' },
  { type: 'block_start', kind: 'text', id: 'x1' },
  { type: 'delta', id: 'x1', kind: 'text', text: "I'll build this as three plain files so it runs straight from the Preview panel — no install step." },
  { type: 'block_end', id: 'x1' },
  { type: 'tool_start', id: 'tool1', name: 'update_plan', input: {} },
  {
    type: 'todos',
    items: [
      { text: 'Scaffold the page and keyboard layout', status: 'active' },
      { text: 'Style the keys with a lit state', status: 'pending' },
      { text: 'Wire up Web Audio oscillators', status: 'pending' },
    ],
  },
  { type: 'tool_end', id: 'tool1', status: 'ok', summary: 'Plan · 0/3 done' },
  { type: 'tool_start', id: 'tool2', name: 'write_file', input: { path: 'index.html' } },
  {
    type: 'file_change',
    turnId: 'demo',
    change: { path: 'index.html', before: null, after: DEMO_FILES['index.html'], added: 17, removed: 0 },
  },
  { type: 'tool_end', id: 'tool2', status: 'ok', summary: 'Created index.html · +17/-0' },
  { type: 'tool_start', id: 'tool3', name: 'write_file', input: { path: 'style.css' } },
  {
    type: 'file_change',
    turnId: 'demo',
    change: { path: 'style.css', before: null, after: DEMO_FILES['style.css'], added: 31, removed: 0 },
  },
  { type: 'tool_end', id: 'tool3', status: 'ok', summary: 'Created style.css · +31/-0' },
  {
    type: 'todos',
    items: [
      { text: 'Scaffold the page and keyboard layout', status: 'done' },
      { text: 'Style the keys with a lit state', status: 'done' },
      { text: 'Wire up Web Audio oscillators', status: 'active' },
    ],
  },
  { type: 'tool_start', id: 'tool4', name: 'write_file', input: { path: 'synth.js' } },
  {
    type: 'file_change',
    turnId: 'demo',
    change: { path: 'synth.js', before: null, after: DEMO_FILES['synth.js'], added: 38, removed: 0 },
  },
  { type: 'tool_end', id: 'tool4', status: 'ok', summary: 'Created synth.js · +38/-0' },
  {
    type: 'todos',
    items: [
      { text: 'Scaffold the page and keyboard layout', status: 'done' },
      { text: 'Style the keys with a lit state', status: 'done' },
      { text: 'Wire up Web Audio oscillators', status: 'done' },
    ],
  },
  { type: 'block_start', kind: 'text', id: 'x2' },
  {
    type: 'delta',
    id: 'x2',
    kind: 'text',
    text: 'Aurora is playable. Hit **Preview** and press `A` through `K` — each key starts a triangle oscillator with a 20 ms attack and a quarter-second release, so notes fade instead of clicking. Everything is three static files with no dependencies.',
  },
  { type: 'block_end', id: 'x2' },
  { type: 'usage', delta: { input: 4820, output: 2130, cacheRead: 3600, cacheWrite: 1220, costUsd: 0.0783 } },
  { type: 'turn_end', turnId: 'demo', stopReason: 'end_turn' },
  { type: 'idle' },
];

function demoBridge(): Bridge {
  const files = { ...DEMO_FILES };
  const listeners = new Set<(e: AgentEvent) => void>();
  const fire = (event: AgentEvent) => listeners.forEach((cb) => cb(event));

  const tree = (dir: string): FileNode[] => {
    const seen = new Map<string, FileNode>();
    for (const full of Object.keys(files)) {
      if (dir && !full.startsWith(`${dir}/`)) continue;
      const rest = dir ? full.slice(dir.length + 1) : full;
      const [head, ...tail] = rest.split('/');
      const p = dir ? `${dir}/${head}` : head;
      if (!seen.has(p)) seen.set(p, { name: head, path: p, dir: tail.length > 0 });
    }
    return [...seen.values()].sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
  };

  return {
    getState: async () => ({
      workspace: 'C:\\Projects\\aurora',
      hasApiKey: true,
      settings: DEFAULT_SETTINGS,
      recentWorkspaces: ['C:\\Projects\\aurora'],
    }),
    setSettings: async (patch) => ({ ...DEFAULT_SETTINGS, ...patch }),
    setApiKey: async () => true,
    clearApiKey: async () => undefined,

    chooseWorkspace: async () => 'C:\\Projects\\aurora',
    openWorkspace: async (dir) => dir,
    readTree: async (dir) => tree(dir ?? ''),
    readFile: async (file) => ({
      path: file,
      content: files[file] ?? '',
      language: languageFor(file),
      truncated: false,
      binary: false,
    }),
    saveFile: async (file, content) => {
      files[file] = content;
    },
    createEntry: async (file) => {
      files[file] = '';
    },
    deleteEntry: async (file) => {
      delete files[file];
    },
    revealInExplorer: async () => undefined,

    send: async () => {
      let delay = 120;
      for (const event of DEMO_SCRIPT) {
        const step = event.type === 'delta' ? 40 + event.text.length * 6 : 420;
        setTimeout(() => fire(event), delay);
        delay += step;
      }
    },
    stop: async () => fire({ type: 'idle' }),
    resolveApproval: async () => undefined,
    newSession: async () => undefined,

    checkpoints: async () => [],
    restore: async () => 0,
    revertFile: async () => undefined,

    startPreview: async () => 'about:blank',
    stopPreview: async () => undefined,
    openExternal: async (url) => {
      window.open(url, '_blank', 'noopener');
    },

    minimize: () => undefined,
    toggleMaximize: () => undefined,
    close: () => undefined,

    onEvent(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    onWorkspaceChanged() {
      return () => undefined;
    },
  };
}

export const api: Bridge = window.mc ?? demoBridge();
