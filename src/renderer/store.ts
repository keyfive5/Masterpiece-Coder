import { useSyncExternalStore } from 'react';
import {
  AppState,
  CheckpointInfo,
  DEFAULT_SETTINGS,
  FileChange,
  FileNode,
  Settings,
  TodoItem,
  ToolStatus,
} from '../shared/types';

export type ChatItem =
  | { kind: 'user'; id: string; text: string; attachments: string[] }
  | { kind: 'thinking'; id: string; text: string; done: boolean }
  | { kind: 'text'; id: string; text: string; done: boolean }
  | { kind: 'tool'; id: string; name: string; input: any; status: ToolStatus; summary: string; detail?: string }
  | { kind: 'approval'; id: string; tool: string; title: string; detail: string; resolved: null | boolean }
  | { kind: 'notice'; id: string; level: 'info' | 'warn' | 'error'; message: string }
  | { kind: 'turn'; id: string; label: string };

export interface OpenFile {
  content: string;
  original: string;
  language: string;
  dirty: boolean;
  binary: boolean;
  truncated: boolean;
}

export type CenterView = 'editor' | 'diff' | 'preview';

export interface UIState {
  ready: boolean;
  workspace: string | null;
  hasApiKey: boolean;
  settings: Settings;
  recent: string[];

  tree: Record<string, FileNode[]>;
  expanded: string[];
  tabs: string[];
  active: string | null;
  files: Record<string, OpenFile>;

  chat: ChatItem[];
  todos: TodoItem[];
  changes: FileChange[];
  busy: boolean;
  turnId: string | null;

  usage: { input: number; output: number; cost: number };

  center: CenterView;
  diffPath: string | null;
  previewUrl: string | null;

  output: string;
  outputOpen: boolean;

  modal: null | 'settings' | 'history' | 'key';
  checkpoints: CheckpointInfo[];
  toast: string | null;
}

const initial: UIState = {
  ready: false,
  workspace: null,
  hasApiKey: false,
  settings: DEFAULT_SETTINGS,
  recent: [],

  tree: {},
  expanded: [],
  tabs: [],
  active: null,
  files: {},

  chat: [],
  todos: [],
  changes: [],
  busy: false,
  turnId: null,

  usage: { input: 0, output: 0, cost: 0 },

  center: 'editor',
  diffPath: null,
  previewUrl: null,

  output: '',
  outputOpen: false,

  modal: null,
  checkpoints: [],
  toast: null,
};

let state = initial;
const listeners = new Set<() => void>();

export function getState(): UIState {
  return state;
}

export function setState(patch: Partial<UIState> | ((s: UIState) => Partial<UIState>)): void {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(initial),
  );
}

export function applyAppState(app: AppState): void {
  setState({
    ready: true,
    workspace: app.workspace,
    hasApiKey: app.hasApiKey,
    settings: app.settings,
    recent: app.recentWorkspaces,
  });
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
export function toast(message: string): void {
  setState({ toast: message });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setState({ toast: null }), 3200);
}

export function pushChat(item: ChatItem): void {
  setState((s) => ({ chat: [...s.chat, item] }));
}

export function patchChat(id: string, patch: Partial<ChatItem>): void {
  setState((s) => ({
    chat: s.chat.map((item) => (item.id === id ? ({ ...item, ...patch } as ChatItem) : item)),
  }));
}
