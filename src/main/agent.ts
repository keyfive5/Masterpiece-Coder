import Anthropic from '@anthropic-ai/sdk';
import { AgentEvent, MODELS, Settings, UsageDelta } from '../shared/types';
import { store } from './store';
import * as ws from './workspace';
import * as checkpoints from './checkpoints';
import { apiTools, TOOL_BY_NAME, ToolContext } from './tools';
import { killAll } from './runner';
import { systemPrompt } from './prompt';

type Emit = (event: AgentEvent) => void;

interface PendingApproval {
  resolve: (approved: boolean) => void;
}

/** Optional request features, each independently disabled if the API rejects it. */
interface Features {
  fallbacks: boolean;
  cache: boolean;
  thinking: boolean;
  effort: boolean;
}

let messages: Anthropic.MessageParam[] = [];
let busy = false;
let currentStream: { abort: () => void } | null = null;
let aborter: AbortController | null = null;
const pending = new Map<string, PendingApproval>();
const sessionAllow = new Set<string>();
let features: Features = { fallbacks: true, cache: true, thinking: true, effort: true };

export function isBusy(): boolean {
  return busy;
}

export function newSession(): void {
  messages = [];
  sessionAllow.clear();
  checkpoints.clear();
}

export function stop(): void {
  aborter?.abort();
  currentStream?.abort();
  killAll();
  for (const [id, entry] of pending) {
    entry.resolve(false);
    pending.delete(id);
  }
}

export function resolveApproval(id: string, approved: boolean, always: boolean, toolName?: string): void {
  const entry = pending.get(id);
  if (!entry) return;
  pending.delete(id);
  if (always && approved && toolName) {
    sessionAllow.add(toolName);
    const settings = store.settings();
    if (!settings.alwaysAllow.includes(toolName)) {
      store.updateSettings({ alwaysAllow: [...settings.alwaysAllow, toolName] });
    }
  }
  entry.resolve(approved);
}

function priceFor(model: string) {
  return MODELS.find((m) => m.id === model) ?? { inputPrice: 5, outputPrice: 25 };
}

function usageDelta(model: string, usage: Anthropic.Usage | undefined): UsageDelta {
  const price = priceFor(model);
  const input = usage?.input_tokens ?? 0;
  const output = usage?.output_tokens ?? 0;
  const cacheRead = (usage as any)?.cache_read_input_tokens ?? 0;
  const cacheWrite = (usage as any)?.cache_creation_input_tokens ?? 0;
  const costUsd =
    (input * price.inputPrice +
      output * price.outputPrice +
      cacheRead * price.inputPrice * 0.1 +
      cacheWrite * price.inputPrice * 1.25) /
    1_000_000;
  return { input, output, cacheRead, cacheWrite, costUsd };
}

function buildParams(settings: Settings, system: string, feat: Features): Record<string, any> {
  const params: Record<string, any> = {
    model: settings.model,
    max_tokens: Math.max(4096, Math.min(settings.maxTokens, 64_000)),
    system: [{ type: 'text', text: system }],
    tools: apiTools(),
    messages,
  };

  // Thinking and effort are what make the "thought process" panel worth watching.
  // No temperature/top_p/top_k — current models reject them.
  if (feat.thinking) params.thinking = { type: 'adaptive', display: 'summarized' };
  if (feat.effort) params.output_config = { effort: settings.effort };
  // Auto-caches the last cacheable block, which covers tools + system + history.
  if (feat.cache) params.cache_control = { type: 'ephemeral' };

  return params;
}

/** Turn an SDK error into the feature we should switch off, if any. */
function degrade(err: unknown, feat: Features): keyof Features | null {
  const status = (err as any)?.status;
  const text = String((err as any)?.message ?? err ?? '');
  if (status !== 400 && status !== 404) return null;
  if (feat.fallbacks && /fallback|server-side-fallback/i.test(text)) return 'fallbacks';
  if (feat.cache && /cache_control/i.test(text)) return 'cache';
  if (feat.effort && /effort|output_config/i.test(text)) return 'effort';
  if (feat.thinking && /thinking/i.test(text)) return 'thinking';
  // Unattributable 400 — drop the most exotic feature still enabled.
  if (feat.fallbacks) return 'fallbacks';
  if (feat.cache) return 'cache';
  if (feat.effort) return 'effort';
  return null;
}

/**
 * One request/response round trip, streamed. Returns the final assistant message.
 * Deltas are only emitted once the stream is producing content, so a request that
 * fails on the first byte can be safely retried with a feature switched off.
 */
async function streamOnce(
  client: Anthropic,
  settings: Settings,
  system: string,
  emit: Emit,
): Promise<Anthropic.Message> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const params = buildParams(settings, system, features);
    let produced = false;

    try {
      const stream: any = features.fallbacks
        ? (client as any).beta.messages.stream({
            ...params,
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
          })
        : (client.messages.stream as any)(params);

      currentStream = stream;

      const openBlocks = new Map<number, { id: string; kind: 'thinking' | 'text' }>();

      for await (const event of stream) {
        if (aborter?.signal.aborted) break;
        produced = true;

        if (event.type === 'content_block_start') {
          const block = event.content_block;
          if (block?.type === 'text' || block?.type === 'thinking') {
            const id = `b${event.index}_${Date.now()}`;
            const kind = block.type === 'thinking' ? 'thinking' : 'text';
            openBlocks.set(event.index, { id, kind });
            emit({ type: 'block_start', kind, id });
          }
        } else if (event.type === 'content_block_delta') {
          const open = openBlocks.get(event.index);
          if (!open) continue;
          const delta = event.delta;
          if (delta?.type === 'text_delta' && delta.text) {
            emit({ type: 'delta', id: open.id, kind: 'text', text: delta.text });
          } else if (delta?.type === 'thinking_delta' && delta.thinking) {
            emit({ type: 'delta', id: open.id, kind: 'thinking', text: delta.thinking });
          }
        } else if (event.type === 'content_block_stop') {
          const open = openBlocks.get(event.index);
          if (open) {
            emit({ type: 'block_end', id: open.id });
            openBlocks.delete(event.index);
          }
        }
      }

      const message: Anthropic.Message = await stream.finalMessage();
      currentStream = null;
      emit({ type: 'usage', delta: usageDelta(settings.model, message.usage) });
      return message;
    } catch (err) {
      currentStream = null;
      if (aborter?.signal.aborted) throw err;

      const disable = produced ? null : degrade(err, features);
      if (!disable) throw err;

      features = { ...features, [disable]: false };
      emit({
        type: 'notice',
        level: 'info',
        message: `This API key does not support ${
          disable === 'fallbacks'
            ? 'server-side refusal fallbacks'
            : disable === 'cache'
              ? 'automatic prompt caching'
              : disable === 'effort'
                ? 'the effort setting'
                : 'extended thinking'
        }. Continuing without it.`,
      });
    }
  }

  throw new Error('Could not reach the Claude API after several attempts.');
}

export async function send(text: string, attachments: string[], emit: Emit): Promise<void> {
  if (busy) {
    emit({ type: 'notice', level: 'warn', message: 'Still working on the previous message.' });
    return;
  }

  const apiKey = store.apiKey();
  if (!apiKey) {
    emit({ type: 'notice', level: 'error', message: 'Add your Anthropic API key in Settings first.' });
    emit({ type: 'idle' });
    return;
  }
  if (!ws.getRoot()) {
    emit({ type: 'notice', level: 'error', message: 'Open a project folder first.' });
    emit({ type: 'idle' });
    return;
  }

  busy = true;
  aborter = new AbortController();
  const settings = store.settings();
  const turnId = `turn_${Date.now()}`;
  checkpoints.begin(turnId, text.slice(0, 60) || 'Turn');
  emit({ type: 'turn_start', turnId });

  const client = new Anthropic({ apiKey, maxRetries: 2 });

  // Attachments are pasted in as context so the model does not have to hunt for them.
  let prompt = text;
  for (const rel of attachments) {
    const body = await ws.readFileRaw(rel);
    if (body !== null) {
      prompt += `\n\n<attached_file path="${rel}">\n${body.slice(0, 60_000)}\n</attached_file>`;
    }
  }
  messages.push({ role: 'user', content: prompt });

  const ctx: ToolContext = {
    turnId,
    emit,
    signal: aborter.signal,
    approve: (tool, title, detail) => {
      if (settings.approvalMode === 'autopilot') return Promise.resolve(true);
      if (sessionAllow.has(tool) || settings.alwaysAllow.includes(tool)) return Promise.resolve(true);
      const id = `ap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      emit({ type: 'approval_request', id, tool, title, detail });
      return new Promise<boolean>((resolve) => {
        pending.set(id, {
          resolve: (approved) => {
            emit({ type: 'approval_resolved', id, approved });
            resolve(approved);
          },
        });
      });
    },
  };

  try {
    const system = systemPrompt(await ws.projectSnapshot(), settings.customInstructions, settings.approvalMode);

    for (let step = 0; step < 60; step++) {
      if (aborter.signal.aborted) break;

      const message = await streamOnce(client, settings, system, emit);
      messages.push({ role: 'assistant', content: message.content });

      if (message.stop_reason === 'refusal') {
        emit({
          type: 'notice',
          level: 'warn',
          message: 'Claude declined this request. Try rephrasing, or describe what you are building and why.',
        });
        emit({ type: 'turn_end', turnId, stopReason: 'refusal' });
        break;
      }

      const toolUses = message.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
      if (toolUses.length === 0) {
        emit({ type: 'turn_end', turnId, stopReason: message.stop_reason ?? null });
        break;
      }

      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const use of toolUses) {
        if (aborter.signal.aborted) break;
        emit({ type: 'tool_start', id: use.id, name: use.name, input: use.input });

        const tool = TOOL_BY_NAME.get(use.name);
        if (!tool) {
          emit({ type: 'tool_end', id: use.id, status: 'error', summary: `Unknown tool ${use.name}` });
          results.push({ type: 'tool_result', tool_use_id: use.id, content: `No such tool: ${use.name}`, is_error: true });
          continue;
        }

        try {
          const result = await tool.run(use.input ?? {}, ctx);
          emit({
            type: 'tool_end',
            id: use.id,
            status: result.ok ? 'ok' : result.content.startsWith('The user declined') ? 'rejected' : 'error',
            summary: result.summary,
            detail: result.detail,
          });
          results.push({
            type: 'tool_result',
            tool_use_id: use.id,
            content: result.content,
            ...(result.ok ? {} : { is_error: true }),
          });
        } catch (err) {
          const msg = (err as Error).message ?? String(err);
          emit({ type: 'tool_end', id: use.id, status: 'error', summary: msg });
          results.push({ type: 'tool_result', tool_use_id: use.id, content: `Error: ${msg}`, is_error: true });
        }
      }

      if (aborter.signal.aborted) {
        // Close the loop cleanly so the history stays valid for the next message.
        for (const use of toolUses) {
          if (!results.some((r) => r.tool_use_id === use.id)) {
            results.push({ type: 'tool_result', tool_use_id: use.id, content: 'Stopped by the user.', is_error: true });
          }
        }
        messages.push({ role: 'user', content: results });
        break;
      }

      messages.push({ role: 'user', content: results });
    }
  } catch (err) {
    if (aborter?.signal.aborted) {
      emit({ type: 'notice', level: 'info', message: 'Stopped.' });
    } else {
      emit({ type: 'notice', level: 'error', message: describeError(err) });
    }
    emit({ type: 'turn_end', turnId, stopReason: 'error' });
  } finally {
    busy = false;
    aborter = null;
    currentStream = null;
    emit({ type: 'idle' });
  }
}

function describeError(err: unknown): string {
  const status = (err as any)?.status;
  const raw = String((err as any)?.message ?? err ?? 'Unknown error');
  if (status === 401) return 'Your API key was rejected. Check it in Settings.';
  if (status === 403) return 'That API key does not have access to this model. Try a different model in Settings.';
  if (status === 404) return `Model not found. Pick a different model in Settings. (${raw})`;
  if (status === 429) return 'Rate limited by the API. Wait a moment and try again.';
  if (status === 413) return 'The conversation got too large. Start a new session.';
  if (status && status >= 500) return 'The Claude API is having trouble right now. Try again shortly.';
  if (/ENOTFOUND|ECONNREFUSED|fetch failed/i.test(raw)) return 'Could not reach the internet. Check your connection.';
  return raw;
}
