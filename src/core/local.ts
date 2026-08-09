import { CoreMessage, ToolCall, ToolSchema, TurnHandlers, TurnRequest, TurnResult } from './types';

/**
 * A model running on the user's own GPU through WebLLM.
 *
 * Small local models are unreliable at native function calling, so tools are
 * driven by a plain text protocol instead: the model is asked to reply with a
 * fenced JSON block, which is parsed back into tool calls. That works on every
 * model in the list rather than only the few with a function-calling template,
 * and the parsing is ours to fix when a model gets it slightly wrong.
 */

let engine: any = null;
let loadedModel: string | null = null;
let loading: Promise<any> | null = null;

export class LocalModelError extends Error {}

export function webGpuAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export function isModelLoaded(modelId: string): boolean {
  return engine !== null && loadedModel === modelId;
}

/** Downloads on first use, then reuses the cached engine. */
export async function ensureEngine(modelId: string, onActivity?: (label: string) => void): Promise<any> {
  if (engine && loadedModel === modelId) return engine;
  if (loading) return loading;

  if (!webGpuAvailable()) {
    throw new LocalModelError(
      'This machine does not expose WebGPU, which the on-device model needs. Use the Free provider, or Built in, instead.',
    );
  }

  loading = (async () => {
    onActivity?.('Loading the local model…');
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

    let lastReported = -1;
    const created = await CreateMLCEngine(modelId, {
      initProgressCallback: (report: { progress: number; text: string }) => {
        const percent = Math.round((report.progress ?? 0) * 100);
        // Only speak up every 5% — this can run for several minutes.
        if (percent >= lastReported + 5 || percent === 100) {
          lastReported = percent;
          onActivity?.(percent >= 100 ? 'Starting the local model…' : `Downloading the model — ${percent}%`);
        }
      },
    });

    engine = created;
    loadedModel = modelId;
    loading = null;
    return created;
  })().catch((err) => {
    loading = null;
    throw new LocalModelError(
      `The local model could not start: ${(err as Error).message}. It needs WebGPU and a few gigabytes of free space.`,
    );
  });

  return loading;
}

export async function unloadEngine(): Promise<void> {
  try {
    await engine?.unload?.();
  } catch {
    /* nothing to unload */
  }
  engine = null;
  loadedModel = null;
}

/* ---------------------------------------------------------------- protocol */

function protocolFor(tools: ToolSchema[]): string {
  const list = tools
    .map((tool) => `- ${tool.name}: ${tool.description}\n  input: ${JSON.stringify(tool.parameters.properties ?? {})}`)
    .join('\n');

  return `
# How to act
You cannot write files directly. To do anything, reply with ONE fenced json block and nothing else:

\`\`\`json
{"tool": "write_file", "input": {"path": "index.html", "content": "<!doctype html>..."}}
\`\`\`

Rules:
- Exactly one json block per reply. No prose before or after it.
- Put the file's FULL contents in "content", properly JSON-escaped.
- When the whole task is finished, reply with plain text instead of a json block, describing what you built.

Available tools:
${list}
`;
}

/** Pull the fenced json block (or a bare object) out of a reply. */
function parseToolCall(text: string): ToolCall | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text.trim().startsWith('{') ? text.trim() : null;
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate.trim());
    const name = parsed?.tool ?? parsed?.name ?? parsed?.function;
    if (typeof name !== 'string') return null;
    return {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      input: (parsed.input ?? parsed.arguments ?? parsed.parameters ?? {}) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

function toChatMessages(system: string, messages: CoreMessage[], tools: ToolSchema[]): any[] {
  const out: any[] = [{ role: 'system', content: system + protocolFor(tools) }];
  for (const message of messages) {
    if (message.role === 'user') {
      out.push({ role: 'user', content: message.content });
    } else if (message.role === 'assistant') {
      // Replay what the model actually said, including its json block, so it
      // can see its own last action.
      const call = message.toolCalls?.[0];
      out.push({
        role: 'assistant',
        content: call ? `\`\`\`json\n${JSON.stringify({ tool: call.name, input: call.input })}\n\`\`\`` : message.content,
      });
    } else {
      // Tool results come back as a user turn; there is no tool role here.
      out.push({
        role: 'user',
        content: message.results.map((r) => `Result of ${r.name}: ${r.content}`).join('\n\n').slice(0, 8000),
      });
    }
  }
  return out;
}

export async function runLocal(request: TurnRequest, handlers: TurnHandlers): Promise<TurnResult> {
  const active = await ensureEngine(request.model, handlers.onActivity);
  handlers.onActivity?.('Thinking on your machine');

  const reply = await active.chat.completions.create({
    messages: toChatMessages(request.system, request.messages, request.tools),
    max_tokens: Math.min(request.maxTokens, 4096),
    temperature: 0.4,
    stream: false,
  });

  const raw: string = reply?.choices?.[0]?.message?.content ?? '';
  const call = parseToolCall(raw);

  if (call) {
    return {
      text: '',
      thinking: '',
      toolCalls: [call],
      native: null,
      usage: {
        input: reply?.usage?.prompt_tokens ?? 0,
        output: reply?.usage?.completion_tokens ?? 0,
        cacheRead: 0,
        cacheWrite: 0,
      },
      stopReason: 'tool_use',
    };
  }

  if (raw) handlers.onText(raw);
  return {
    text: raw,
    thinking: '',
    toolCalls: [],
    native: null,
    usage: {
      input: reply?.usage?.prompt_tokens ?? 0,
      output: reply?.usage?.completion_tokens ?? 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    stopReason: 'end_turn',
  };
}
