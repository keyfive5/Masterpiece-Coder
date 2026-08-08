/**
 * Types shared between the Electron main process, the preload bridge and the
 * renderer. Keep this file dependency-free — it is imported from all three.
 */

export type ApprovalMode = 'autopilot' | 'ask';

export type ModelId = string;

export interface ModelInfo {
  id: ModelId;
  label: string;
  blurb: string;
  /** USD per million input / output tokens. */
  inputPrice: number;
  outputPrice: number;
}

/** Effort levels accepted by `output_config.effort`. */
export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface Settings {
  model: ModelId;
  effort: Effort;
  approvalMode: ApprovalMode;
  showThinking: boolean;
  maxTokens: number;
  /** Extra guidance appended to the system prompt. */
  customInstructions: string;
  /** Tool names the user chose to always allow without a prompt. */
  alwaysAllow: string[];
  /** Ask the API to retry policy-declined requests on a fallback model. */
  serverFallbacks: boolean;
}

export interface AppState {
  workspace: string | null;
  hasApiKey: boolean;
  settings: Settings;
  recentWorkspaces: string[];
}

export interface FileNode {
  name: string;
  path: string; // workspace-relative, posix separators
  dir: boolean;
  /** Populated lazily for directories. */
  children?: FileNode[];
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

/** Events streamed from the agent loop in main → renderer. */
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
  | { type: 'turn_end'; turnId: string; stopReason: string | null }
  | { type: 'idle' };

export interface CheckpointInfo {
  turnId: string;
  label: string;
  at: number;
  files: number;
}

/** The API surface exposed on `window.mc` by the preload script. */
export interface Bridge {
  getState(): Promise<AppState>;
  setSettings(patch: Partial<Settings>): Promise<Settings>;
  setApiKey(key: string): Promise<boolean>;
  clearApiKey(): Promise<void>;

  chooseWorkspace(): Promise<string | null>;
  openWorkspace(path: string): Promise<string | null>;
  readTree(dir?: string): Promise<FileNode[]>;
  readFile(path: string): Promise<FileContent>;
  saveFile(path: string, content: string): Promise<void>;
  createEntry(path: string, dir: boolean): Promise<void>;
  deleteEntry(path: string): Promise<void>;
  revealInExplorer(path: string): Promise<void>;

  send(text: string, attachments: string[]): Promise<void>;
  stop(): Promise<void>;
  resolveApproval(id: string, approved: boolean, always: boolean): Promise<void>;
  newSession(): Promise<void>;

  checkpoints(): Promise<CheckpointInfo[]>;
  restore(turnId: string): Promise<number>;
  revertFile(path: string, content: string | null): Promise<void>;

  startPreview(): Promise<string | null>;
  stopPreview(): Promise<void>;
  openExternal(url: string): Promise<void>;

  minimize(): void;
  toggleMaximize(): void;
  close(): void;

  onEvent(cb: (e: AgentEvent) => void): () => void;
  onWorkspaceChanged(cb: (path: string | null) => void): () => void;
}

export const MODELS: ModelInfo[] = [
  {
    id: 'claude-opus-5',
    label: 'Opus 5',
    blurb: 'Best for complex agentic coding. The default.',
    inputPrice: 5,
    outputPrice: 25,
  },
  {
    id: 'claude-sonnet-5',
    label: 'Sonnet 5',
    blurb: 'Near-Opus quality, faster and cheaper.',
    inputPrice: 3,
    outputPrice: 15,
  },
  {
    id: 'claude-opus-4-8',
    label: 'Opus 4.8',
    blurb: 'Previous-generation Opus. Very capable.',
    inputPrice: 5,
    outputPrice: 25,
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Haiku 4.5',
    blurb: 'Fastest and cheapest. Good for small edits.',
    inputPrice: 1,
    outputPrice: 5,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  model: 'claude-opus-5',
  effort: 'high',
  approvalMode: 'ask',
  showThinking: true,
  maxTokens: 32000,
  customInstructions: '',
  alwaysAllow: [],
  serverFallbacks: true,
};
