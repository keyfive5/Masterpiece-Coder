/**
 * Provider-neutral conversation types. Every adapter converts these to and from
 * its own wire format, so the agent loop never knows which AI it is talking to.
 */

export type Effort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolOutcome {
  id: string;
  name: string;
  content: string;
  isError?: boolean;
}

export type CoreMessage =
  | { role: 'user'; content: string }
  | {
      role: 'assistant';
      content: string;
      thinking?: string;
      toolCalls?: ToolCall[];
      /**
       * The provider's own representation of this turn. Anthropic requires
       * thinking blocks to be replayed byte-for-byte, so we keep the original
       * rather than trying to rebuild it.
       */
      native?: unknown;
    }
  | { role: 'tool'; results: ToolOutcome[] };

export interface ToolSchema {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface TurnRequest {
  model: string;
  system: string;
  messages: CoreMessage[];
  tools: ToolSchema[];
  maxTokens: number;
  effort: Effort;
  thinking: boolean;
  signal: AbortSignal;
}

export interface TurnHandlers {
  onText(chunk: string): void;
  onThinking(chunk: string): void;
  /** Fired once a tool call's name is known, before its arguments finish streaming. */
  onToolPending?(id: string, name: string): void;
  onNotice?(message: string): void;
  /** Live status for the activity strip — model downloads, load progress. */
  onActivity?(label: string): void;
}

export interface TurnUsage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface TurnResult {
  text: string;
  thinking: string;
  toolCalls: ToolCall[];
  native: unknown;
  usage: TurnUsage;
  stopReason: string | null;
}

/** Streaming HTTP, supplied by the host (direct fetch in a browser, IPC in Electron). */
export interface Net {
  request(
    url: string,
    init: { method: string; headers: Record<string, string>; body: string; signal: AbortSignal },
  ): Promise<NetResponse>;
}

export interface NetResponse {
  status: number;
  ok: boolean;
  /** Yields decoded text chunks in arrival order. */
  lines(): AsyncIterable<string>;
  text(): Promise<string>;
}
