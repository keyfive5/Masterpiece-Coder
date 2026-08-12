/** Types shared by the core agent, the Electron host and the browser host. */

export type ApprovalMode = 'autopilot' | 'ask';
export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface Settings {
  /** Provider id from src/core/providers.ts. */
  provider: string;
  model: string;
  effort: Effort;
  approvalMode: ApprovalMode;
  showThinking: boolean;
  maxTokens: number;
  customInstructions: string;
  alwaysAllow: string[];
  /** Full chat-completions URL for the "Custom endpoint" provider. */
  customEndpoint: string;
  /**
   * Maestro — the planner and reviewer built into the app. It compiles the
   * request into a specification before the AI starts, and checks the result
   * afterwards. On by default; off means the raw model, unassisted.
   */
  maestro: boolean;
  /** Bumped when a stored setting needs correcting on load. */
  version?: number;
}

const SETTINGS_VERSION = 2;

/**
 * Repairs settings saved by earlier builds. Only ever corrects choices the user
 * did not actually make — a default we shipped and then found to be wrong.
 */
export function migrateSettings(saved: Partial<Settings> | null | undefined): Settings {
  const settings: Settings = { ...DEFAULT_SETTINGS, ...(saved ?? {}) };

  // v2: the original free default was gpt-5-nano, which is too weak to carry a
  // build to completion. Anyone still on it never chose it.
  if ((settings.version ?? 1) < 2 && settings.provider === 'puter' && settings.model === 'gpt-5-nano') {
    settings.model = DEFAULT_SETTINGS.model;
  }

  settings.version = SETTINGS_VERSION;
  return settings;
}

export const DEFAULT_SETTINGS: Settings = {
  provider: 'puter',
  model: 'claude-sonnet-4-5',
  effort: 'high',
  approvalMode: 'autopilot',
  showThinking: true,
  maxTokens: 32000,
  customInstructions: '',
  alwaysAllow: [],
  customEndpoint: '',
  maestro: true,
};

export interface FileNode {
  name: string;
  path: string;
  dir: boolean;
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  truncated: boolean;
  binary: boolean;
}

export type ToolStatus = 'running' | 'ok' | 'error' | 'rejected';

export interface TodoItem {
  text: string;
  status: 'pending' | 'active' | 'done';
}

export interface UsageDelta {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  costUsd: number;
}

export interface FileChange {
  path: string;
  before: string | null;
  after: string | null;
  added: number;
  removed: number;
}

export interface CheckpointInfo {
  turnId: string;
  label: string;
  at: number;
  files: number;
}

/** A project the user can open. In the browser these live in OPFS. */
export interface ProjectInfo {
  id: string;
  name: string;
  /** Absolute path on disk, or the OPFS folder name in the browser. */
  location: string;
  updatedAt: number;
}

export type AgentEvent =
  | { type: 'turn_start'; turnId: string }
  | { type: 'block_start'; kind: 'thinking' | 'text'; id: string }
  | { type: 'delta'; id: string; kind: 'thinking' | 'text'; text: string }
  | { type: 'block_end'; id: string }
  | { type: 'tool_start'; id: string; name: string; input: unknown }
  | { type: 'tool_end'; id: string; status: ToolStatus; summary: string; detail?: string }
  | { type: 'approval_request'; id: string; tool: string; title: string; detail: string }
  | { type: 'approval_resolved'; id: string; approved: boolean }
  | { type: 'file_change'; turnId: string; change: FileChange }
  | { type: 'todos'; items: TodoItem[] }
  | { type: 'usage'; delta: UsageDelta }
  | { type: 'command_output'; id: string; chunk: string }
  | { type: 'notice'; level: 'info' | 'warn' | 'error'; message: string }
  /** Drives the "it is working" strip so the app never looks frozen. */
  | { type: 'activity'; label: string }
  | { type: 'need_key'; provider: string }
  | { type: 'turn_end'; turnId: string; stopReason: string | null }
  | { type: 'idle' };

/**
 * What the desktop host exposes to the renderer. The browser build implements
 * the same shape on top of OPFS and direct fetch, so the UI is identical.
 */
export interface DesktopBridge {
  isDesktop: true;
  platform: string;

  listProjects(): Promise<ProjectInfo[]>;
  createProject(name: string): Promise<ProjectInfo>;
  chooseProject(): Promise<ProjectInfo | null>;
  openProject(location: string): Promise<ProjectInfo | null>;
  currentProject(): Promise<ProjectInfo | null>;

  list(dir: string): Promise<FileNode[]>;
  read(path: string): Promise<string | null>;
  readMeta(path: string): Promise<FileContent>;
  write(path: string, content: string): Promise<void>;
  remove(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  walk(): Promise<string[]>;
  reveal(path: string): Promise<void>;

  run(command: string): Promise<{ id: string; code: number | null; output: string; timedOut: boolean }>;
  onCommandChunk(cb: (chunk: string) => void): () => void;

  netRequest(
    url: string,
    init: { method: string; headers: Record<string, string>; body: string },
  ): Promise<{ requestId: string; status: number; ok: boolean }>;
  onNetChunk(cb: (requestId: string, chunk: string | null) => void): () => void;
  netAbort(requestId: string): void;

  getSettings(): Promise<Settings>;
  setSettings(patch: Partial<Settings>): Promise<Settings>;
  getKey(provider: string): Promise<string>;
  setKey(provider: string, key: string): Promise<void>;
  listKeys(): Promise<string[]>;

  startPreview(): Promise<string | null>;
  openExternal(url: string): Promise<void>;

  minimize(): void;
  toggleMaximize(): void;
  close(): void;
}
