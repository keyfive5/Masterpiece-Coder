import { AgentEvent, Settings } from '../shared/types';
import { api } from './api';
import { applyAppState, getState, patchChat, pushChat, setState, toast } from './store';

/* ---------------------------------------------------------------- *
 * Streaming deltas arrive faster than React should re-render, so we
 * buffer them and flush on a short timer. A timer rather than an
 * animation frame: rAF stops firing while the window is minimised or
 * occluded, which would leave a reply frozen mid-sentence.
 * ---------------------------------------------------------------- */
const deltaBuffer = new Map<string, string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function queueFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    if (deltaBuffer.size === 0) return;
    const pending = new Map(deltaBuffer);
    deltaBuffer.clear();
    setState((s) => ({
      chat: s.chat.map((item) => {
        const extra = pending.get(item.id);
        if (extra === undefined || (item.kind !== 'text' && item.kind !== 'thinking')) return item;
        return { ...item, text: item.text + extra };
      }),
    }));
  }, 32);
}

export function handleEvent(event: AgentEvent): void {
  switch (event.type) {
    case 'turn_start':
      setState({ busy: true, turnId: event.turnId });
      break;

    case 'block_start':
      pushChat({ kind: event.kind, id: event.id, text: '', done: false });
      break;

    case 'delta':
      deltaBuffer.set(event.id, (deltaBuffer.get(event.id) ?? '') + event.text);
      queueFlush();
      break;

    case 'block_end':
      patchChat(event.id, { done: true } as any);
      break;

    case 'tool_start':
      pushChat({ kind: 'tool', id: event.id, name: event.name, input: event.input, status: 'running', summary: '' });
      break;

    case 'tool_end':
      patchChat(event.id, { status: event.status, summary: event.summary, detail: event.detail } as any);
      break;

    case 'approval_request':
      pushChat({ kind: 'approval', id: event.id, tool: event.tool, title: event.title, detail: event.detail, resolved: null });
      break;

    case 'approval_resolved':
      patchChat(event.id, { resolved: event.approved } as any);
      break;

    case 'todos':
      setState({ todos: event.items });
      break;

    case 'file_change': {
      const change = event.change;
      setState((s) => {
        const changes = [...s.changes.filter((c) => c.path !== change.path), change];
        // Keep an open editor tab in sync with what the agent just wrote.
        const open = s.files[change.path];
        const files = open
          ? {
              ...s.files,
              [change.path]: { ...open, content: change.after ?? '', original: change.after ?? '', dirty: false },
            }
          : s.files;
        return { changes, files, diffPath: change.path, center: s.center === 'preview' ? 'preview' : 'diff' };
      });
      void refreshTree();
      break;
    }

    case 'command_output':
      setState((s) => ({
        output: (s.output + event.chunk).slice(-120_000),
        outputOpen: true,
      }));
      break;

    case 'usage':
      setState((s) => ({
        usage: {
          input: s.usage.input + event.delta.input + event.delta.cacheRead + event.delta.cacheWrite,
          output: s.usage.output + event.delta.output,
          cost: s.usage.cost + event.delta.costUsd,
        },
      }));
      break;

    case 'notice':
      pushChat({ kind: 'notice', id: `n_${Date.now()}_${Math.random()}`, level: event.level, message: event.message });
      break;

    case 'turn_end':
      break;

    case 'idle':
      setState({ busy: false });
      void refreshCheckpoints();
      break;
  }
}

/* ---------------------------------------------------------------- *
 * Operations
 * ---------------------------------------------------------------- */

export async function boot(): Promise<void> {
  applyAppState(await api.getState());
  api.onEvent(handleEvent);
  api.onWorkspaceChanged(async (dir) => {
    setState({
      workspace: dir,
      tree: {},
      expanded: [],
      tabs: [],
      active: null,
      files: {},
      chat: [],
      todos: [],
      changes: [],
      output: '',
      previewUrl: null,
      center: 'editor',
    });
    await refreshTree();
  });
  if (getState().workspace) await refreshTree();
}

export async function refreshTree(dir = ''): Promise<void> {
  if (!getState().workspace) return;
  const nodes = await api.readTree(dir);
  setState((s) => ({ tree: { ...s.tree, [dir]: nodes } }));
}

export async function toggleDir(path: string): Promise<void> {
  const { expanded, tree } = getState();
  if (expanded.includes(path)) {
    setState({ expanded: expanded.filter((p) => p !== path) });
    return;
  }
  if (!tree[path]) await refreshTree(path);
  setState((s) => ({ expanded: [...s.expanded, path] }));
}

export async function openFile(path: string, view: 'editor' | 'diff' = 'editor'): Promise<void> {
  const state = getState();
  if (!state.files[path]) {
    const file = await api.readFile(path);
    setState((s) => ({
      files: {
        ...s.files,
        [path]: {
          content: file.content,
          original: file.content,
          language: file.language,
          dirty: false,
          binary: file.binary,
          truncated: file.truncated,
        },
      },
    }));
  }
  setState((s) => ({
    tabs: s.tabs.includes(path) ? s.tabs : [...s.tabs, path],
    active: path,
    center: view,
    diffPath: view === 'diff' ? path : s.diffPath,
  }));
}

export function closeTab(path: string): void {
  setState((s) => {
    const tabs = s.tabs.filter((t) => t !== path);
    const files = { ...s.files };
    delete files[path];
    return { tabs, files, active: s.active === path ? (tabs[tabs.length - 1] ?? null) : s.active };
  });
}

export function editFile(path: string, content: string): void {
  setState((s) => {
    const file = s.files[path];
    if (!file) return {};
    return { files: { ...s.files, [path]: { ...file, content, dirty: content !== file.original } } };
  });
}

export async function saveActive(): Promise<void> {
  const { active, files } = getState();
  if (!active) return;
  const file = files[active];
  if (!file || !file.dirty) return;
  await api.saveFile(active, file.content);
  setState((s) => ({ files: { ...s.files, [active]: { ...s.files[active], original: file.content, dirty: false } } }));
  toast(`Saved ${active}`);
}

export async function sendMessage(text: string, attachments: string[]): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  const state = getState();
  if (!state.workspace) {
    toast('Open a project folder first.');
    return;
  }
  if (!state.hasApiKey) {
    setState({ modal: 'key' });
    return;
  }
  pushChat({ kind: 'user', id: `u_${Date.now()}`, text: trimmed, attachments });
  setState({ busy: true });
  await api.send(trimmed, attachments);
}

export async function stopAgent(): Promise<void> {
  await api.stop();
  setState({ busy: false });
}

export async function approve(id: string, approved: boolean, always: boolean): Promise<void> {
  await api.resolveApproval(id, approved, always);
  patchChat(id, { resolved: approved } as any);
}

export async function newSession(): Promise<void> {
  await api.newSession();
  setState({ chat: [], todos: [], changes: [], usage: { input: 0, output: 0, cost: 0 }, output: '' });
  toast('Started a fresh session');
}

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  const settings = await api.setSettings(patch);
  setState({ settings });
}

export async function chooseWorkspace(): Promise<void> {
  const dir = await api.chooseWorkspace();
  if (dir) {
    setState({ workspace: dir, tree: {}, expanded: [], tabs: [], active: null, files: {} });
    await refreshTree();
  }
}

export async function openWorkspace(dir: string): Promise<void> {
  const opened = await api.openWorkspace(dir);
  if (opened) {
    setState({ workspace: opened, tree: {}, expanded: [], tabs: [], active: null, files: {} });
    await refreshTree();
  }
}

export async function refreshCheckpoints(): Promise<void> {
  setState({ checkpoints: await api.checkpoints() });
}

export async function restoreCheckpoint(turnId: string): Promise<void> {
  const count = await api.restore(turnId);
  toast(`Rewound ${count} file${count === 1 ? '' : 's'}`);
  setState({ modal: null, changes: [], files: {}, tabs: [], active: null });
  await refreshTree();
  await refreshCheckpoints();
}

export async function revertChange(path: string, before: string | null): Promise<void> {
  await api.revertFile(path, before);
  setState((s) => ({ changes: s.changes.filter((c) => c.path !== path), files: {}, tabs: s.tabs.filter((t) => t !== path) }));
  await refreshTree();
  toast(`Reverted ${path}`);
}

export async function startPreview(): Promise<void> {
  const url = await api.startPreview();
  if (!url) {
    toast('Open a project folder first.');
    return;
  }
  setState({ previewUrl: url, center: 'preview' });
}
