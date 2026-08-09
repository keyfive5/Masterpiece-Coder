import { AgentEvent, Settings } from '../shared/types';
import { CheckpointStore } from './checkpoints';
import { buildSystemPrompt } from './prompt';
import { AnthropicFeatures, priceOf, ProviderError, providerById, runTurn } from './providers';
import { schemasFor, ToolContext, toolsFor } from './tools';
import { CoreMessage, Net, ToolOutcome } from './types';
import { projectSnapshot, Workspace } from './workspace';

export interface AgentHost {
  net: Net;
  platform: string;
  /** Resolves the API key for a provider, or '' when none is needed. */
  keyFor(providerId: string): string;
  /** Called when the free provider needs the user to sign in. */
  requestSignIn(): Promise<boolean>;
}

const MAX_STEPS = 60;

export class Agent {
  private messages: CoreMessage[] = [];
  private aborter: AbortController | null = null;
  private readonly pending = new Map<string, (approved: boolean) => void>();
  private readonly sessionAllow = new Set<string>();
  private anthropicFeatures: AnthropicFeatures = { thinking: true, effort: true, cache: true };
  /** Models already rejected this session, so a fallback never loops. */
  private readonly triedModels = new Set<string>();
  /** Sticks a working fallback model for the rest of the session. */
  private preferredModel: string | null = null;

  readonly checkpoints = new CheckpointStore();
  busy = false;

  constructor(private readonly host: AgentHost) {}

  reset(): void {
    this.messages = [];
    this.sessionAllow.clear();
    this.checkpoints.clear();
  }

  stop(): void {
    this.aborter?.abort();
    for (const [id, resolve] of this.pending) {
      resolve(false);
      this.pending.delete(id);
    }
  }

  resolveApproval(id: string, approved: boolean, always: boolean, tool?: string): void {
    const resolve = this.pending.get(id);
    if (!resolve) return;
    this.pending.delete(id);
    if (approved && always && tool) this.sessionAllow.add(tool);
    resolve(approved);
  }

  async send(
    text: string,
    attachments: string[],
    workspace: Workspace,
    settings: Settings,
    emit: (event: AgentEvent) => void,
  ): Promise<void> {
    if (this.busy) {
      emit({ type: 'notice', level: 'warn', message: 'Still working on the previous message.' });
      return;
    }

    const provider = providerById(settings.provider);
    if (provider.needsKey && !this.host.keyFor(provider.id)) {
      emit({ type: 'need_key', provider: provider.id });
      emit({ type: 'idle' });
      return;
    }

    this.busy = true;
    this.aborter = new AbortController();
    const signal = this.aborter.signal;
    const turnId = `turn_${Date.now()}`;
    this.checkpoints.begin(turnId, text.slice(0, 60) || 'Turn');
    emit({ type: 'turn_start', turnId });

    let prompt = text;
    for (const path of attachments) {
      const body = await workspace.read(path);
      if (body !== null) prompt += `\n\n<attached_file path="${path}">\n${body.slice(0, 60_000)}\n</attached_file>`;
    }
    this.messages.push({ role: 'user', content: prompt });

    const ctx: ToolContext = {
      turnId,
      workspace,
      emit,
      signal,
      capture: (path) => this.checkpoints.capture(workspace, turnId, path),
      approve: (tool, title, detail) => {
        if (settings.approvalMode === 'autopilot') return Promise.resolve(true);
        if (this.sessionAllow.has(tool) || settings.alwaysAllow.includes(tool)) return Promise.resolve(true);
        const id = `ap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        emit({ type: 'approval_request', id, tool, title, detail });
        return new Promise<boolean>((resolve) => {
          this.pending.set(id, (approved) => {
            emit({ type: 'approval_resolved', id, approved });
            resolve(approved);
          });
        });
      },
    };

    try {
      const system = buildSystemPrompt({
        snapshot: await projectSnapshot(workspace),
        custom: settings.customInstructions,
        approvalMode: settings.approvalMode,
        workspace,
        platform: this.host.platform,
      });
      const schemas = schemasFor(workspace);
      const tools = new Map(toolsFor(workspace).map((t) => [t.name, t]));

      // Weaker models sometimes answer with prose describing the code instead of
      // calling write_file. Rather than ending the turn with nothing built, push
      // back once or twice and let them correct themselves.
      let nudges = 0;
      const MAX_NUDGES = 2;

      for (let step = 0; step < MAX_STEPS; step++) {
        if (signal.aborted) break;

        emit({ type: 'activity', label: step === 0 ? 'Thinking about your idea' : 'Thinking' });

        const blockId = `b_${turnId}_${step}`;
        let openedText = false;
        let openedThinking = false;

        const result = await this.runOneStep(
          provider.id,
          settings,
          system,
          schemas,
          signal,
          {
            onText: (chunk) => {
              if (!openedText) {
                emit({ type: 'block_start', kind: 'text', id: `${blockId}_t` });
                openedText = true;
              }
              emit({ type: 'delta', id: `${blockId}_t`, kind: 'text', text: chunk });
            },
            onThinking: (chunk) => {
              if (!openedThinking) {
                emit({ type: 'block_start', kind: 'thinking', id: `${blockId}_k` });
                openedThinking = true;
              }
              emit({ type: 'delta', id: `${blockId}_k`, kind: 'thinking', text: chunk });
            },
            onToolPending: () => undefined,
            onNotice: (message) => emit({ type: 'notice', level: 'info', message }),
          },
          emit,
        );

        if (openedThinking) emit({ type: 'block_end', id: `${blockId}_k` });
        if (openedText) emit({ type: 'block_end', id: `${blockId}_t` });

        const price = priceOf(provider.id, settings.model);
        emit({
          type: 'usage',
          delta: {
            input: result.usage.input,
            output: result.usage.output,
            cacheRead: result.usage.cacheRead,
            cacheWrite: result.usage.cacheWrite,
            costUsd:
              (result.usage.input * price.inputPrice +
                result.usage.output * price.outputPrice +
                result.usage.cacheRead * price.inputPrice * 0.1 +
                result.usage.cacheWrite * price.inputPrice * 1.25) /
              1_000_000,
          },
        });

        this.messages.push({
          role: 'assistant',
          content: result.text,
          thinking: result.thinking,
          toolCalls: result.toolCalls,
          native: result.native,
        });

        if (result.stopReason === 'refusal') {
          emit({ type: 'notice', level: 'warn', message: 'The model declined this request. Try rephrasing it.' });
          emit({ type: 'turn_end', turnId, stopReason: 'refusal' });
          break;
        }

        if (result.toolCalls.length === 0) {
          const wroteCode = /```|<\/?[a-z]+[\s>]/i.test(result.text);
          const builtNothing = (await workspace.walk()).length === 0;

          if ((wroteCode || builtNothing) && nudges < MAX_NUDGES) {
            nudges++;
            emit({
              type: 'notice',
              level: 'info',
              message: builtNothing
                ? 'It replied without creating anything — asking it to actually write the files.'
                : 'It pasted code instead of saving it — asking it to write the files properly.',
            });
            this.messages.push({
              role: 'user',
              content:
                'You did not create any files. Do not describe or paste code in your reply. ' +
                'Call the write_file tool now, once per file, with the complete contents of each file. ' +
                'Then keep going until the project actually runs.',
            });
            continue;
          }

          emit({ type: 'turn_end', turnId, stopReason: result.stopReason });
          break;
        }

        nudges = 0;

        const outcomes: ToolOutcome[] = [];
        for (const call of result.toolCalls) {
          if (signal.aborted) break;
          emit({ type: 'activity', label: describeCall(call.name, call.input) });
          emit({ type: 'tool_start', id: call.id, name: call.name, input: call.input });

          const tool = tools.get(call.name);
          if (!tool) {
            emit({ type: 'tool_end', id: call.id, status: 'error', summary: `Unknown tool ${call.name}` });
            outcomes.push({ id: call.id, name: call.name, content: `No such tool: ${call.name}`, isError: true });
            continue;
          }

          try {
            const outcome = await tool.run(call.input ?? {}, ctx);
            emit({
              type: 'tool_end',
              id: call.id,
              status: outcome.ok ? 'ok' : outcome.content.startsWith('The user declined') ? 'rejected' : 'error',
              summary: outcome.summary,
              detail: outcome.detail,
            });
            outcomes.push({ id: call.id, name: call.name, content: outcome.content, isError: !outcome.ok });
          } catch (err) {
            const message = (err as Error).message ?? String(err);
            emit({ type: 'tool_end', id: call.id, status: 'error', summary: message });
            outcomes.push({ id: call.id, name: call.name, content: `Error: ${message}`, isError: true });
          }
        }

        // Every call must get a result or the next request is malformed.
        for (const call of result.toolCalls) {
          if (!outcomes.some((o) => o.id === call.id)) {
            outcomes.push({ id: call.id, name: call.name, content: 'Stopped by the user.', isError: true });
          }
        }
        this.messages.push({ role: 'tool', results: outcomes });

        if (signal.aborted) break;
      }
    } catch (err) {
      if (signal.aborted) {
        emit({ type: 'notice', level: 'info', message: 'Stopped.' });
      } else {
        emit({ type: 'notice', level: 'error', message: describeError(err) });
      }
      emit({ type: 'turn_end', turnId, stopReason: 'error' });
    } finally {
      this.busy = false;
      this.aborter = null;
      emit({ type: 'idle' });
    }
  }

  /** One request to the provider, with a sign-in retry for the free tier. */
  private async runOneStep(
    providerId: string,
    settings: Settings,
    system: string,
    schemas: ReturnType<typeof schemasFor>,
    signal: AbortSignal,
    handlers: Parameters<typeof runTurn>[2],
    emit: (event: AgentEvent) => void,
  ) {
    const provider = providerById(providerId);
    const request = {
      model: this.preferredModel ?? settings.model,
      system,
      messages: this.messages,
      tools: schemas,
      maxTokens: Math.max(2048, Math.min(settings.maxTokens, 64_000)),
      effort: settings.effort,
      thinking: settings.showThinking,
      signal,
    };

    const options = {
      provider,
      key: this.host.keyFor(provider.id),
      net: this.host.net,
      endpointOverride: settings.customEndpoint,
      anthropicFeatures: this.anthropicFeatures,
      onFeatureDisabled: (feature: keyof AnthropicFeatures) => {
        this.anthropicFeatures = { ...this.anthropicFeatures, [feature]: false };
      },
    };

    try {
      return await runTurn(options, request, handlers);
    } catch (err) {
      if (!(err instanceof ProviderError)) throw err;

      if (err.message === '__PUTER_SIGNIN__') {
        emit({ type: 'activity', label: 'Waiting for you to sign in' });
        const signedIn = await this.host.requestSignIn();
        if (!signedIn) throw new ProviderError('Sign-in was cancelled, so nothing was built.', 401);
        emit({ type: 'activity', label: 'Thinking' });
        return runTurn(options, request, handlers);
      }

      // The chosen model is not available — walk down the provider's list rather
      // than dead-ending on a name that happens to have been retired.
      if (err.message.startsWith('__PUTER_MODEL__')) {
        const alternatives = provider.models.map((m) => m.id).filter((id) => !this.triedModels.has(id));
        const next = alternatives[0];
        if (!next) {
          throw new ProviderError(`No free model is available right now. Try again shortly, or pick another provider in Settings.`, 404);
        }
        this.triedModels.add(next);
        emit({ type: 'notice', level: 'info', message: `${settings.model} is not available — switching to ${next}.` });
        this.preferredModel = next;
        return runTurn(options, { ...request, model: next }, handlers);
      }

      throw err;
    }
  }
}

/** Human-readable "currently doing X" text for the activity strip. */
function describeCall(name: string, input: any): string {
  const path = typeof input?.path === 'string' ? input.path : '';
  switch (name) {
    case 'write_file':
      return `Writing ${path}`;
    case 'edit_file':
      return `Editing ${path}`;
    case 'read_file':
      return `Reading ${path}`;
    case 'delete_file':
      return `Deleting ${path}`;
    case 'list_files':
      return 'Looking around the project';
    case 'find_files':
      return `Searching for ${input?.pattern ?? 'files'}`;
    case 'search_code':
      return 'Searching the code';
    case 'run_command':
      return `Running ${String(input?.command ?? '').slice(0, 50)}`;
    case 'update_plan':
      return 'Updating the plan';
    default:
      return name;
  }
}

function describeError(err: unknown): string {
  if (err instanceof ProviderError) return err.message;
  const raw = String((err as Error)?.message ?? err ?? 'Unknown error');
  if (/Failed to fetch|NetworkError|ENOTFOUND|ECONNREFUSED/i.test(raw)) {
    return 'Could not reach the AI service. Check your internet connection.';
  }
  return raw;
}
