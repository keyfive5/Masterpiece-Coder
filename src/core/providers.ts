import {
  CoreMessage,
  Net,
  ToolCall,
  ToolSchema,
  TurnHandlers,
  TurnRequest,
  TurnResult,
  TurnUsage,
} from './types';

/* ================================================================
   Provider catalogue
   ================================================================ */

export type Wire = 'anthropic' | 'openai' | 'puter';

export interface ModelDef {
  id: string;
  label: string;
  blurb?: string;
  /** USD per million tokens. Omitted when the provider is free. */
  inputPrice?: number;
  outputPrice?: number;
}

export interface ProviderDef {
  id: string;
  label: string;
  tagline: string;
  wire: Wire;
  /** No payment involved — either genuinely free or a free tier. */
  free: boolean;
  needsKey: boolean;
  /** Puter signs in through a popup instead of taking a pasted key. */
  signIn?: boolean;
  keyUrl?: string;
  keyHint?: string;
  endpoint?: string;
  models: ModelDef[];
  /** Custom model ids are allowed alongside the curated list. */
  allowCustomModel?: boolean;
  /** Reachable from a plain web page (CORS) as well as from the desktop app. */
  browserOk: boolean;
  note?: string;
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: 'puter',
    label: 'Free',
    tagline: 'No API key, no card. One click to sign in, then build.',
    wire: 'puter',
    free: true,
    needsKey: false,
    signIn: true,
    browserOk: true,
    allowCustomModel: true,
    note: 'Usage runs through your free Puter account, which also syncs your projects across the web app and the desktop app.',
    // Ordered strongest-at-tool-use first: this agent lives or dies on the model
    // actually calling write_file instead of describing code in prose.
    models: [
      { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', blurb: 'Best at building things. The default.' },
      { id: 'gpt-5', label: 'GPT-5', blurb: 'Strong all-rounder.' },
      { id: 'gpt-4.1', label: 'GPT-4.1', blurb: 'Reliable and quick.' },
      { id: 'gpt-5-nano', label: 'GPT-5 nano', blurb: 'Fastest, but often too weak to finish a build.' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', blurb: 'Very fast.' },
    ],
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    tagline: 'Claude, direct from Anthropic. The best coding models.',
    wire: 'anthropic',
    free: false,
    needsKey: true,
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyHint: 'sk-ant-…',
    endpoint: 'https://api.anthropic.com/v1/messages',
    browserOk: true,
    models: [
      { id: 'claude-opus-5', label: 'Opus 5', blurb: 'Best for complex agentic coding.', inputPrice: 5, outputPrice: 25 },
      { id: 'claude-sonnet-5', label: 'Sonnet 5', blurb: 'Near-Opus quality, cheaper.', inputPrice: 3, outputPrice: 15 },
      { id: 'claude-opus-4-8', label: 'Opus 4.8', blurb: 'Previous generation Opus.', inputPrice: 5, outputPrice: 25 },
      { id: 'claude-haiku-4-5', label: 'Haiku 4.5', blurb: 'Fastest and cheapest.', inputPrice: 1, outputPrice: 5 },
    ],
  },
  {
    id: 'google',
    label: 'Google Gemini',
    tagline: 'Has a genuinely free tier. The key takes about a minute to get.',
    wire: 'openai',
    free: true,
    needsKey: true,
    keyUrl: 'https://aistudio.google.com/apikey',
    keyHint: 'AIza…',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    browserOk: true,
    allowCustomModel: true,
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', blurb: 'Free tier, fast, good at code.' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', blurb: 'Stronger, smaller free allowance.' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', blurb: 'Older, very generous limits.' },
    ],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    tagline: 'GPT models, direct from OpenAI.',
    wire: 'openai',
    free: false,
    needsKey: true,
    keyUrl: 'https://platform.openai.com/api-keys',
    keyHint: 'sk-…',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    browserOk: true,
    allowCustomModel: true,
    models: [
      { id: 'gpt-4.1', label: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini', blurb: 'Cheap and quick.' },
      { id: 'gpt-4o', label: 'GPT-4o' },
    ],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    tagline: 'One key, hundreds of models — including free ones.',
    wire: 'openai',
    free: true,
    needsKey: true,
    keyUrl: 'https://openrouter.ai/keys',
    keyHint: 'sk-or-…',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    browserOk: true,
    allowCustomModel: true,
    models: [
      { id: 'deepseek/deepseek-chat-v3.1:free', label: 'DeepSeek V3.1 (free)', blurb: 'Free, strong at code.' },
      { id: 'z-ai/glm-4.5-air:free', label: 'GLM 4.5 Air (free)', blurb: 'Free.' },
      { id: 'anthropic/claude-sonnet-4.5', label: 'Claude Sonnet 4.5', blurb: 'Paid, excellent.' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom endpoint',
    tagline: 'Any OpenAI-compatible server — LM Studio, vLLM, a gateway at work.',
    wire: 'openai',
    free: false,
    needsKey: false,
    endpoint: '',
    browserOk: true,
    allowCustomModel: true,
    note: 'Set the full chat-completions URL in the box below. A key is optional.',
    models: [{ id: 'local-model', label: 'local-model', blurb: 'Whatever your server calls it.' }],
  },
  {
    id: 'ollama',
    label: 'Ollama',
    tagline: 'Models running on your own machine. Free and private, but you install it.',
    wire: 'openai',
    free: true,
    needsKey: false,
    endpoint: 'http://localhost:11434/v1/chat/completions',
    browserOk: false,
    allowCustomModel: true,
    note: 'Needs Ollama running locally. In the web app the browser blocks localhost requests, so this one is desktop only.',
    models: [
      { id: 'qwen2.5-coder:7b', label: 'Qwen2.5 Coder 7B', blurb: 'Good small coding model.' },
      { id: 'llama3.1:8b', label: 'Llama 3.1 8B' },
    ],
  },
];

export function providerById(id: string): ProviderDef {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}

export function modelsFor(providerId: string): ModelDef[] {
  return providerById(providerId).models;
}

export function priceOf(providerId: string, modelId: string): { inputPrice: number; outputPrice: number } {
  const model = providerById(providerId).models.find((m) => m.id === modelId);
  return { inputPrice: model?.inputPrice ?? 0, outputPrice: model?.outputPrice ?? 0 };
}

/* ================================================================
   Shared helpers
   ================================================================ */

const EMPTY_USAGE: TurnUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly retryable = false,
  ) {
    super(message);
  }
}

/** Split a byte stream of `data: {...}` server-sent events into parsed objects. */
async function* sseEvents(response: { lines(): AsyncIterable<string> }): AsyncGenerator<any> {
  let buffer = '';
  for await (const chunk of response.lines()) {
    buffer += chunk;
    let index: number;
    while ((index = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '' || payload === '[DONE]') continue;
      try {
        yield JSON.parse(payload);
      } catch {
        /* a partial frame; the next chunk completes it */
      }
    }
  }
}

function describeHttpError(status: number, body: string, provider: ProviderDef): ProviderError {
  const snippet = body.slice(0, 400);
  const retryable = status === 429 || status >= 500;
  if (status === 401 || status === 403) {
    return new ProviderError(
      `${provider.label} rejected the key. Check it in Settings.${snippet ? ` (${snippet})` : ''}`,
      status,
    );
  }
  if (status === 404) {
    return new ProviderError(`${provider.label} does not have that model. Pick another in Settings.`, status);
  }
  if (status === 429) {
    return new ProviderError(`${provider.label} is rate limiting. Wait a moment, or switch model.`, status, true);
  }
  if (status >= 500) {
    return new ProviderError(`${provider.label} is having trouble right now. Try again shortly.`, status, true);
  }
  return new ProviderError(`${provider.label} returned ${status}: ${snippet}`, status, retryable);
}

/* ================================================================
   Anthropic
   ================================================================ */

function anthropicMessages(messages: CoreMessage[]): any[] {
  return messages.map((message) => {
    if (message.role === 'user') return { role: 'user', content: message.content };
    if (message.role === 'tool') {
      return {
        role: 'user',
        content: message.results.map((r) => ({
          type: 'tool_result',
          tool_use_id: r.id,
          content: r.content,
          ...(r.isError ? { is_error: true } : {}),
        })),
      };
    }
    // Replay the provider's own blocks so thinking signatures survive.
    if (message.native) return { role: 'assistant', content: message.native };
    const blocks: any[] = [];
    if (message.content) blocks.push({ type: 'text', text: message.content });
    for (const call of message.toolCalls ?? []) {
      blocks.push({ type: 'tool_use', id: call.id, name: call.name, input: call.input });
    }
    return { role: 'assistant', content: blocks.length ? blocks : [{ type: 'text', text: '…' }] };
  });
}

interface AnthropicFeatures {
  thinking: boolean;
  effort: boolean;
  cache: boolean;
}

async function runAnthropic(
  provider: ProviderDef,
  key: string,
  net: Net,
  request: TurnRequest,
  handlers: TurnHandlers,
  features: AnthropicFeatures,
): Promise<TurnResult> {
  const body: Record<string, unknown> = {
    model: request.model,
    max_tokens: request.maxTokens,
    system: [{ type: 'text', text: request.system }],
    messages: anthropicMessages(request.messages),
    tools: request.tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters })),
    stream: true,
  };
  if (features.thinking && request.thinking) body.thinking = { type: 'adaptive', display: 'summarized' };
  if (features.effort) body.output_config = { effort: request.effort };
  if (features.cache) body.cache_control = { type: 'ephemeral' };

  const response = await net.request(provider.endpoint!, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal: request.signal,
  });

  if (!response.ok) throw describeHttpError(response.status, await response.text(), provider);

  const blocks: any[] = [];
  const partials = new Map<number, string>();
  let text = '';
  let thinking = '';
  let stopReason: string | null = null;
  const usage: TurnUsage = { ...EMPTY_USAGE };

  for await (const event of sseEvents(response)) {
    if (event.type === 'message_start') {
      const u = event.message?.usage ?? {};
      usage.input += u.input_tokens ?? 0;
      usage.cacheRead += u.cache_read_input_tokens ?? 0;
      usage.cacheWrite += u.cache_creation_input_tokens ?? 0;
    } else if (event.type === 'content_block_start') {
      blocks[event.index] = { ...event.content_block };
      if (event.content_block?.type === 'tool_use') {
        partials.set(event.index, '');
        handlers.onToolPending?.(event.content_block.id, event.content_block.name);
      }
    } else if (event.type === 'content_block_delta') {
      const delta = event.delta ?? {};
      const block = blocks[event.index] ?? (blocks[event.index] = {});
      if (delta.type === 'text_delta') {
        text += delta.text;
        block.text = (block.text ?? '') + delta.text;
        handlers.onText(delta.text);
      } else if (delta.type === 'thinking_delta') {
        thinking += delta.thinking;
        block.thinking = (block.thinking ?? '') + delta.thinking;
        handlers.onThinking(delta.thinking);
      } else if (delta.type === 'signature_delta') {
        block.signature = (block.signature ?? '') + delta.signature;
      } else if (delta.type === 'input_json_delta') {
        partials.set(event.index, (partials.get(event.index) ?? '') + delta.partial_json);
      }
    } else if (event.type === 'content_block_stop') {
      const raw = partials.get(event.index);
      if (raw !== undefined && blocks[event.index]) {
        try {
          blocks[event.index].input = raw ? JSON.parse(raw) : {};
        } catch {
          blocks[event.index].input = {};
        }
      }
    } else if (event.type === 'message_delta') {
      stopReason = event.delta?.stop_reason ?? stopReason;
      usage.output += event.usage?.output_tokens ?? 0;
    } else if (event.type === 'error') {
      throw new ProviderError(event.error?.message ?? 'Anthropic stream error', null, true);
    }
  }

  const native = blocks.filter(Boolean);
  const toolCalls: ToolCall[] = native
    .filter((b: any) => b.type === 'tool_use')
    .map((b: any) => ({ id: b.id, name: b.name, input: b.input ?? {} }));

  return { text, thinking, toolCalls, native, usage, stopReason };
}

/* ================================================================
   OpenAI-compatible (OpenAI, Google, OpenRouter, Ollama)
   ================================================================ */

function openaiMessages(system: string, messages: CoreMessage[]): any[] {
  const out: any[] = [{ role: 'system', content: system }];
  for (const message of messages) {
    if (message.role === 'user') {
      out.push({ role: 'user', content: message.content });
    } else if (message.role === 'assistant') {
      const entry: any = { role: 'assistant', content: message.content || null };
      if (message.toolCalls?.length) {
        entry.tool_calls = message.toolCalls.map((call) => ({
          id: call.id,
          type: 'function',
          function: { name: call.name, arguments: JSON.stringify(call.input ?? {}) },
        }));
      }
      out.push(entry);
    } else {
      for (const result of message.results) {
        out.push({ role: 'tool', tool_call_id: result.id, content: result.content });
      }
    }
  }
  return out;
}

function openaiTools(tools: ToolSchema[]): any[] {
  return tools.map((tool) => ({
    type: 'function',
    function: { name: tool.name, description: tool.description, parameters: tool.parameters },
  }));
}

/** Tool-call arguments arrive as fragments spread across many deltas. */
class ToolCallAccumulator {
  private readonly byIndex = new Map<number, { id: string; name: string; args: string }>();

  absorb(deltas: any[] | undefined, onPending?: (id: string, name: string) => void): void {
    for (const delta of deltas ?? []) {
      const index = delta.index ?? 0;
      let entry = this.byIndex.get(index);
      if (!entry) {
        entry = { id: delta.id ?? `call_${index}_${Date.now()}`, name: '', args: '' };
        this.byIndex.set(index, entry);
      }
      if (delta.id) entry.id = delta.id;
      if (delta.function?.name) {
        const isNew = entry.name === '';
        entry.name += delta.function.name;
        if (isNew) onPending?.(entry.id, entry.name);
      }
      if (delta.function?.arguments) entry.args += delta.function.arguments;
    }
  }

  finish(): ToolCall[] {
    return [...this.byIndex.values()]
      .filter((entry) => entry.name)
      .map((entry) => {
        let input: Record<string, unknown> = {};
        try {
          input = entry.args ? JSON.parse(entry.args) : {};
        } catch {
          input = {};
        }
        return { id: entry.id, name: entry.name, input };
      });
  }
}

async function runOpenAI(
  provider: ProviderDef,
  key: string,
  net: Net,
  request: TurnRequest,
  handlers: TurnHandlers,
  endpoint: string,
): Promise<TurnResult> {
  if (!endpoint) {
    throw new ProviderError('No endpoint is set for this provider. Add one in Settings.', null);
  }
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (key) headers.authorization = `Bearer ${key}`;
  if (provider.id === 'openrouter') {
    headers['http-referer'] = 'https://keyfive5.github.io/Masterpiece-Coder';
    headers['x-title'] = 'Masterpiece Coder';
  }

  const response = await net.request(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: request.model,
      messages: openaiMessages(request.system, request.messages),
      tools: request.tools.length ? openaiTools(request.tools) : undefined,
      max_tokens: request.maxTokens,
      stream: true,
      stream_options: provider.id === 'openai' ? { include_usage: true } : undefined,
    }),
    signal: request.signal,
  });

  if (!response.ok) throw describeHttpError(response.status, await response.text(), provider);

  const calls = new ToolCallAccumulator();
  let text = '';
  let thinking = '';
  let stopReason: string | null = null;
  const usage: TurnUsage = { ...EMPTY_USAGE };

  for await (const event of sseEvents(response)) {
    if (event.error) throw new ProviderError(event.error.message ?? 'Stream error', null, true);
    const choice = event.choices?.[0];
    if (event.usage) {
      usage.input += event.usage.prompt_tokens ?? 0;
      usage.output += event.usage.completion_tokens ?? 0;
    }
    if (!choice) continue;
    const delta = choice.delta ?? {};
    if (typeof delta.content === 'string' && delta.content) {
      text += delta.content;
      handlers.onText(delta.content);
    }
    // Several gateways expose chain-of-thought under a reasoning field.
    const reason = delta.reasoning_content ?? delta.reasoning;
    if (typeof reason === 'string' && reason) {
      thinking += reason;
      handlers.onThinking(reason);
    }
    calls.absorb(delta.tool_calls, handlers.onToolPending);
    if (choice.finish_reason) stopReason = choice.finish_reason;
  }

  const toolCalls = calls.finish();
  return { text, thinking, toolCalls, native: null, usage, stopReason };
}

/* ================================================================
   Puter — free, browser-side SDK, no key
   ================================================================ */

let puterLoading: Promise<boolean> | null = null;

export function loadPuter(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).puter) return Promise.resolve(true);
  if (puterLoading) return puterLoading;

  puterLoading = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.onload = () => resolve(Boolean((window as any).puter));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
    setTimeout(() => resolve(Boolean((window as any).puter)), 12_000);
  });
  return puterLoading;
}

export const puterAuth = {
  async ready(): Promise<boolean> {
    return loadPuter();
  },
  isSignedIn(): boolean {
    try {
      return Boolean((window as any).puter?.auth?.isSignedIn?.());
    } catch {
      return false;
    }
  },
  async user(): Promise<{ username: string } | null> {
    try {
      return (await (window as any).puter.auth.getUser()) ?? null;
    } catch {
      return null;
    }
  },
  /** Must be called from a user gesture — it opens a popup. */
  async signIn(): Promise<{ username: string } | null> {
    if (!(await loadPuter())) throw new Error('Could not reach Puter. Check your internet connection.');
    await (window as any).puter.auth.signIn();
    return puterAuth.user();
  },
  signOut(): void {
    try {
      (window as any).puter.auth.signOut();
    } catch {
      /* ignore */
    }
  },
};

/**
 * Pull tool calls out of whichever shape came back.
 *
 * Puter is a gateway, so the shape follows the *upstream* vendor, not Puter:
 * GPT models answer in OpenAI form (`message.tool_calls`), while Claude models
 * answer in Anthropic form (`message.content` as an array of blocks, one of
 * which is `{type:'tool_use', name, input}`). Verified against both.
 */
function extractToolCalls(source: any): ToolCall[] {
  const message = source?.message ?? source?.choices?.[0]?.message ?? source;
  const out: ToolCall[] = [];

  // OpenAI form.
  const lists = [message?.tool_calls, source?.tool_calls, source?.choices?.[0]?.message?.tool_calls];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const call of list) {
      const name = call?.function?.name ?? call?.name;
      if (!name) continue;
      const rawArgs = call?.function?.arguments ?? call?.arguments ?? call?.input;
      let input: Record<string, unknown> = {};
      try {
        input = typeof rawArgs === 'string' ? JSON.parse(rawArgs || '{}') : (rawArgs ?? {});
      } catch {
        input = {};
      }
      out.push({ id: call?.id ?? `call_${out.length}_${Date.now()}`, name, input });
    }
    if (out.length) return out;
  }

  // Anthropic form.
  const blocks = Array.isArray(message?.content) ? message.content : Array.isArray(source?.content) ? source.content : null;
  for (const block of blocks ?? []) {
    if (block?.type !== 'tool_use' || !block?.name) continue;
    out.push({
      id: block.id ?? `call_${out.length}_${Date.now()}`,
      name: block.name,
      input: (block.input ?? {}) as Record<string, unknown>,
    });
  }
  return out;
}

/** Pull assistant text out of whichever shape came back. */
function extractText(source: any): string {
  const message = source?.message ?? source?.choices?.[0]?.message ?? source;
  if (typeof message === 'string') return message;

  const content = message?.content ?? source?.text ?? '';
  if (Array.isArray(content)) {
    // Anthropic blocks: keep the text ones, drop tool_use.
    return content
      .filter((block: any) => block?.type === 'text' || typeof block?.text === 'string')
      .map((block: any) => block?.text ?? '')
      .join('');
  }
  return typeof content === 'string' ? content : '';
}

async function runPuter(request: TurnRequest, handlers: TurnHandlers): Promise<TurnResult> {
  if (!(await loadPuter())) {
    throw new ProviderError('Could not load the free AI service. Check your internet connection.', null, true);
  }
  const puter = (window as any).puter;
  if (!puterAuth.isSignedIn()) throw new ProviderError('__PUTER_SIGNIN__', 401);

  const messages = openaiMessages(request.system, request.messages);
  const wantsTools = request.tools.length > 0;
  const options: Record<string, unknown> = { model: request.model };
  if (wantsTools) options.tools = openaiTools(request.tools);

  /*
   * Deliberately NOT streaming when tools are in play. Puter surfaces
   * `tool_calls` reliably on a completed response but not on stream parts, so
   * streaming silently swallowed every tool call the model made after writing
   * a sentence — the loop then saw "no tools" and stopped after one step.
   * Correctness beats token-by-token output here; the activity strip in the UI
   * covers the wait.
   */
  if (!wantsTools) {
    try {
      const stream = await puter.ai.chat(messages, { ...options, stream: true });
      if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
        let text = '';
        for await (const part of stream) {
          if (request.signal.aborted) break;
          const chunk = part?.text ?? part?.delta?.content;
          if (typeof chunk === 'string' && chunk) {
            text += chunk;
            handlers.onText(chunk);
          }
        }
        if (text) {
          return { text, thinking: '', toolCalls: [], native: null, usage: { ...EMPTY_USAGE }, stopReason: 'end_turn' };
        }
      }
    } catch {
      /* fall through to the non-streaming call below */
    }
  }

  const response = await puter.ai.chat(messages, options).catch((err: any) => {
    const message = String(err?.message ?? err);
    if (/sign|auth|login|not.*logged/i.test(message)) throw new ProviderError('__PUTER_SIGNIN__', 401);
    if (/model|not.*(found|support|available)/i.test(message)) {
      throw new ProviderError(`__PUTER_MODEL__${message}`, 404);
    }
    throw new ProviderError(`The free AI service failed: ${message}`, null, true);
  });

  const text = extractText(response);
  const toolCalls = extractToolCalls(response);
  if (text) handlers.onText(text);

  const usage: TurnUsage = { ...EMPTY_USAGE };
  const reported = response?.usage;
  if (reported) {
    usage.input = reported.prompt_tokens ?? reported.input_tokens ?? 0;
    usage.output = reported.completion_tokens ?? reported.output_tokens ?? 0;
  }

  return {
    text,
    thinking: '',
    toolCalls,
    native: null,
    usage,
    stopReason: toolCalls.length ? 'tool_use' : 'end_turn',
  };
}

/* ================================================================
   Entry point
   ================================================================ */

export interface RunOptions {
  provider: ProviderDef;
  key: string;
  net: Net;
  /** Replaces the provider's built-in URL — used by the Custom endpoint provider. */
  endpointOverride?: string;
  /** Anthropic-only extras, disabled individually when an account rejects them. */
  anthropicFeatures: AnthropicFeatures;
  onFeatureDisabled?(feature: keyof AnthropicFeatures): void;
}

export async function runTurn(
  options: RunOptions,
  request: TurnRequest,
  handlers: TurnHandlers,
): Promise<TurnResult> {
  const { provider } = options;

  if (provider.wire === 'puter') return runPuter(request, handlers);
  if (provider.wire === 'openai') {
    const endpoint = options.endpointOverride?.trim() || provider.endpoint || '';
    return runOpenAI(provider, options.key, options.net, request, handlers, endpoint);
  }

  // Anthropic: retry with one optional feature switched off on a 400.
  let features = { ...options.anthropicFeatures };
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await runAnthropic(provider, options.key, options.net, request, handlers, features);
    } catch (err) {
      const status = err instanceof ProviderError ? err.status : null;
      const text = String((err as Error).message ?? '');
      if (status !== 400) throw err;

      const drop: keyof AnthropicFeatures | null = /cache_control/i.test(text)
        ? 'cache'
        : /effort|output_config/i.test(text)
          ? 'effort'
          : /thinking/i.test(text)
            ? 'thinking'
            : features.cache
              ? 'cache'
              : features.effort
                ? 'effort'
                : features.thinking
                  ? 'thinking'
                  : null;
      if (!drop || !features[drop]) throw err;

      features = { ...features, [drop]: false };
      options.onFeatureDisabled?.(drop);
      handlers.onNotice?.(
        `This key does not support ${
          drop === 'cache' ? 'prompt caching' : drop === 'effort' ? 'the effort setting' : 'extended thinking'
        }. Continuing without it.`,
      );
    }
  }
  throw new ProviderError('Could not reach Anthropic after several attempts.', null, true);
}

export type { AnthropicFeatures };
