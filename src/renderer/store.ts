import { useSyncExternalStore } from 'react';
import {
  CheckpointInfo,
  DEFAULT_SETTINGS,
  FileChange,
  FileNode,
  ProjectInfo,
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
  | { kind: 'notice'; id: string; level: 'info' | 'warn' | 'error'; message: string };

export interface OpenFile {
  content: string;
  original: string;
  language: string;
  dirty: boolean;
  binary: boolean;
}

export type CenterView = 'editor' | 'diff' | 'preview';

export interface UIState {
  ready: boolean;
  project: ProjectInfo | null;
  projects: ProjectInfo[];
  settings: Settings;
  configuredKeys: string[];

  /** Puter account, used for free AI and for syncing projects. */
  account: { username: string } | null;
  syncing: boolean;

  /** Projects stored in the signed-in account, made on any device. */
  cloudProjects: { id: string; name: string; updatedAt: number; fileCount: number }[];
  githubUser: string | null;
  githubBusy: string | null;
  repoLink: { owner: string; repo: string } | null;

  tree: Record<string, FileNode[]>;
  expanded: string[];
  tabs: string[];
  active: string | null;
  files: Record<string, OpenFile>;

  chat: ChatItem[];
  todos: TodoItem[];
  changes: FileChange[];
  busy: boolean;
  /** What the agent is doing right now, shown while it works. */
  activity: string;
  startedAt: number;
  /** The project has something runnable, so the Play button is live. */
  playable: boolean;

  usage: { input: number; output: number; cost: number };

  center: CenterView;
  diffPath: string | null;
  preview: { url?: string; srcdoc?: string; error?: string } | null;

  output: string;
  outputOpen: boolean;

  modal: null | 'settings' | 'history' | 'key' | 'projects' | 'github';
  /** Which provider the key modal is collecting for. */
  keyProvider: string | null;
  checkpoints: CheckpointInfo[];
  toast: string | null;
}

const initial: UIState = {
  ready: false,
  project: null,
  projects: [],
  settings: DEFAULT_SETTINGS,
  configuredKeys: [],

  account: null,
  syncing: false,

  cloudProjects: [],
  githubUser: null,
  githubBusy: null,
  repoLink: null,

  tree: {},
  expanded: [],
  tabs: [],
  active: null,
  files: {},

  chat: [],
  todos: [],
  changes: [],
  busy: false,
  activity: '',
  startedAt: 0,
  playable: false,

  usage: { input: 0, output: 0, cost: 0 },

  center: 'editor',
  diffPath: null,
  preview: null,

  output: '',
  outputOpen: false,

  modal: null,
  keyProvider: null,
  checkpoints: [],
  toast: null,
};

let state = initial;
const listeners = new Set<() => void>();

export const EMPTY_NODES: FileNode[] = [];

export function getState(): UIState {
  return state;
}

export function setState(patch: Partial<UIState> | ((s: UIState) => Partial<UIState>)): void {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
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

let toastTimer: ReturnType<typeof setTimeout> | null = null;
export function toast(message: string): void {
  setState({ toast: message });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setState({ toast: null }), 3400);
}

export function pushChat(item: ChatItem): void {
  setState((s) => ({ chat: [...s.chat, item] }));
}

export function patchChat(id: string, patch: Record<string, unknown>): void {
  setState((s) => ({
    chat: s.chat.map((item) => (item.id === id ? ({ ...item, ...patch } as ChatItem) : item)),
  }));
}
