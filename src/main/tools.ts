import path from 'node:path';
import fsp from 'node:fs/promises';
import { AgentEvent, TodoItem } from '../shared/types';
import { diffStat } from '../shared/diff';
import { looksBinary } from '../shared/lang';
import * as ws from './workspace';
import * as checkpoints from './checkpoints';
import { runCommand } from './runner';

export interface ToolContext {
  turnId: string;
  emit: (event: AgentEvent) => void;
  /** Resolves true when the user (or the current mode) allows the action. */
  approve: (tool: string, title: string, detail: string) => Promise<boolean>;
  signal: AbortSignal;
}

export interface ToolResult {
  ok: boolean;
  /** One-line summary rendered on the tool card. */
  summary: string;
  /** Optional expandable body rendered under the card. */
  detail?: string;
  /** What actually goes back to the model. */
  content: string;
}

export interface ToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
  /** Mutates the workspace or the machine — gated in "ask" mode. */
  guarded: boolean;
  run: (input: any, ctx: ToolContext) => Promise<ToolResult>;
}

const DENIED = 'The user declined this action. Do not retry it; ask what they would like instead.';

function truncate(text: string, max = 12_000): string {
  return text.length > max ? `${text.slice(0, max)}\n…[truncated, ${text.length - max} more characters]` : text;
}

function numbered(content: string, startLine = 1): string {
  return content
    .split('\n')
    .map((line, i) => `${String(startLine + i).padStart(5, ' ')}  ${line}`)
    .join('\n');
}

async function recordChange(ctx: ToolContext, relPath: string, before: string | null, after: string | null) {
  const { added, removed } = diffStat(before, after);
  ctx.emit({
    type: 'file_change',
    turnId: ctx.turnId,
    change: { path: relPath, before, after, added, removed },
  });
  return { added, removed };
}

export const TOOLS: ToolDef[] = [
  {
    name: 'read_file',
    guarded: false,
    description:
      'Read a text file from the project. Returns the contents with line numbers. Use this before editing a file so your edits match the real text exactly.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root, e.g. "src/App.tsx".' },
        start_line: { type: 'integer', description: 'Optional 1-based first line to return.' },
        end_line: { type: 'integer', description: 'Optional 1-based last line to return.' },
      },
      required: ['path'],
    },
    async run(input, ctx) {
      const file = await ws.readFile(String(input.path));
      if (file.binary) {
        return {
          ok: true,
          summary: `${input.path} — binary file`,
          content: `${input.path} is a binary file; its contents cannot be shown as text.`,
        };
      }
      const lines = file.content.split('\n');
      const start = Math.max(1, Number(input.start_line) || 1);
      const end = Math.min(lines.length, Number(input.end_line) || lines.length);
      const slice = lines.slice(start - 1, end).join('\n');
      void ctx;
      return {
        ok: true,
        summary: `${input.path} · ${lines.length} lines`,
        detail: truncate(slice, 4000),
        content: `${input.path} (lines ${start}-${end} of ${lines.length}${file.truncated ? ', file was truncated on read' : ''}):\n${numbered(slice, start)}`,
      };
    },
  },

  {
    name: 'write_file',
    guarded: true,
    description:
      'Create a new file, or completely replace an existing one. Always pass the FULL final contents. For small changes to a large existing file prefer edit_file.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root.' },
        content: { type: 'string', description: 'The complete contents of the file.' },
      },
      required: ['path', 'content'],
    },
    async run(input, ctx) {
      const relPath = String(input.path);
      const content = String(input.content ?? '');
      const existed = await ws.exists(relPath);

      const allowed = await ctx.approve(
        'write_file',
        existed ? `Overwrite ${relPath}` : `Create ${relPath}`,
        `${content.split('\n').length} lines`,
      );
      if (!allowed) return { ok: false, summary: `Declined: ${relPath}`, content: DENIED };

      const before = await checkpoints.capture(ctx.turnId, relPath);
      await ws.writeFile(relPath, content);
      const { added, removed } = await recordChange(ctx, relPath, before, content);

      return {
        ok: true,
        summary: `${existed ? 'Updated' : 'Created'} ${relPath} · +${added}/-${removed}`,
        content: `Wrote ${relPath} (${content.split('\n').length} lines).`,
      };
    },
  },

  {
    name: 'edit_file',
    guarded: true,
    description:
      'Replace an exact snippet of text inside an existing file. `old_text` must appear verbatim and, unless replace_all is true, exactly once. Include enough surrounding context to make it unique.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root.' },
        old_text: { type: 'string', description: 'The exact text to find.' },
        new_text: { type: 'string', description: 'The text to put in its place. Use an empty string to delete.' },
        replace_all: { type: 'boolean', description: 'Replace every occurrence instead of requiring a unique match.' },
      },
      required: ['path', 'old_text', 'new_text'],
    },
    async run(input, ctx) {
      const relPath = String(input.path);
      const oldText = String(input.old_text ?? '');
      const newText = String(input.new_text ?? '');

      const before = await ws.readFileRaw(relPath);
      if (before === null) {
        return { ok: false, summary: `Not found: ${relPath}`, content: `${relPath} does not exist. Create it with write_file first.` };
      }
      if (oldText === '') {
        return { ok: false, summary: 'Empty search text', content: 'old_text cannot be empty. Use write_file to create a file.' };
      }

      const occurrences = before.split(oldText).length - 1;
      if (occurrences === 0) {
        return {
          ok: false,
          summary: `No match in ${relPath}`,
          content: `The text was not found in ${relPath}. Read the file again and copy the exact text, including whitespace.`,
        };
      }
      if (occurrences > 1 && !input.replace_all) {
        return {
          ok: false,
          summary: `${occurrences} matches in ${relPath}`,
          content: `Found ${occurrences} occurrences. Add more surrounding context so the match is unique, or pass replace_all: true.`,
        };
      }

      const allowed = await ctx.approve('edit_file', `Edit ${relPath}`, `${occurrences} replacement${occurrences === 1 ? '' : 's'}`);
      if (!allowed) return { ok: false, summary: `Declined: ${relPath}`, content: DENIED };

      await checkpoints.capture(ctx.turnId, relPath);
      const after = input.replace_all ? before.split(oldText).join(newText) : before.replace(oldText, newText);
      await ws.writeFile(relPath, after);
      const { added, removed } = await recordChange(ctx, relPath, before, after);

      return {
        ok: true,
        summary: `Edited ${relPath} · +${added}/-${removed}`,
        content: `Edited ${relPath}: ${occurrences} replacement(s), +${added}/-${removed} lines.`,
      };
    },
  },

  {
    name: 'delete_file',
    guarded: true,
    description: 'Delete a file or a folder (recursively) from the project.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Path relative to the project root.' } },
      required: ['path'],
    },
    async run(input, ctx) {
      const relPath = String(input.path);
      const allowed = await ctx.approve('delete_file', `Delete ${relPath}`, 'This cannot be undone except by restoring a checkpoint.');
      if (!allowed) return { ok: false, summary: `Declined: ${relPath}`, content: DENIED };

      const before = await checkpoints.capture(ctx.turnId, relPath);
      await ws.deleteEntry(relPath);
      await recordChange(ctx, relPath, before, null);

      return { ok: true, summary: `Deleted ${relPath}`, content: `Deleted ${relPath}.` };
    },
  },

  {
    name: 'list_files',
    guarded: false,
    description: 'List the files and folders directly inside a directory of the project.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Directory relative to the project root. Omit for the root.' } },
    },
    async run(input) {
      const dir = String(input.path ?? '').replace(/^[./]+/, '');
      const nodes = await ws.readTree(dir);
      const body = nodes.length
        ? nodes.map((n) => (n.dir ? `${n.name}/` : n.name)).join('\n')
        : '(empty)';
      return {
        ok: true,
        summary: `${dir || '.'} · ${nodes.length} item${nodes.length === 1 ? '' : 's'}`,
        detail: body,
        content: `Contents of ${dir || 'the project root'}:\n${body}`,
      };
    },
  },

  {
    name: 'find_files',
    guarded: false,
    description:
      'Find files by name using a glob pattern such as "**/*.tsx" or "src/**/index.*". Much faster than listing directories one by one.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Glob pattern matched against project-relative paths.' },
        limit: { type: 'integer', description: 'Maximum number of paths to return (default 200).' },
      },
      required: ['pattern'],
    },
    async run(input) {
      const pattern = String(input.pattern);
      const limit = Math.min(Number(input.limit) || 200, 1000);
      const regex = ws.globToRegExp(pattern.startsWith('**/') || pattern.includes('/') ? pattern : `**/${pattern}`);
      const all = await ws.walk('');
      const matches = all.filter((f) => regex.test(f)).slice(0, limit);
      return {
        ok: true,
        summary: `${pattern} · ${matches.length} match${matches.length === 1 ? '' : 'es'}`,
        detail: matches.join('\n'),
        content: matches.length ? matches.join('\n') : `No files matched ${pattern}.`,
      };
    },
  },

  {
    name: 'search_code',
    guarded: false,
    description:
      'Search the text of project files with a regular expression. Returns matching lines with their file and line number.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'JavaScript regular expression.' },
        glob: { type: 'string', description: 'Optional glob to limit which files are searched, e.g. "**/*.ts".' },
        case_sensitive: { type: 'boolean', description: 'Defaults to false.' },
        limit: { type: 'integer', description: 'Maximum matching lines to return (default 80).' },
      },
      required: ['pattern'],
    },
    async run(input) {
      const limit = Math.min(Number(input.limit) || 80, 400);
      let regex: RegExp;
      try {
        regex = new RegExp(String(input.pattern), input.case_sensitive ? '' : 'i');
      } catch (err) {
        return { ok: false, summary: 'Invalid pattern', content: `Not a valid regular expression: ${(err as Error).message}` };
      }

      const fileFilter = input.glob ? ws.globToRegExp(String(input.glob)) : null;
      const files = (await ws.walk('')).filter((f) => !fileFilter || fileFilter.test(f));

      const hits: string[] = [];
      for (const file of files) {
        if (hits.length >= limit) break;
        const text = await ws.readFileRaw(file);
        if (text === null || text.includes('\0') || looksBinary(file)) continue;
        const lines = text.split('\n');
        for (let i = 0; i < lines.length && hits.length < limit; i++) {
          if (regex.test(lines[i])) hits.push(`${file}:${i + 1}: ${lines[i].trim().slice(0, 200)}`);
        }
      }

      return {
        ok: true,
        summary: `/${input.pattern}/ · ${hits.length} hit${hits.length === 1 ? '' : 's'}`,
        detail: hits.join('\n'),
        content: hits.length ? hits.join('\n') : `No matches for /${input.pattern}/.`,
      };
    },
  },

  {
    name: 'run_command',
    guarded: true,
    description:
      'Run a shell command in the project folder — installing packages, running tests, building, or scaffolding. Output is returned to you. Do not start long-lived servers with this; use the Preview panel instead.',
    input_schema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command line to execute.' },
        purpose: { type: 'string', description: 'One short sentence describing why, shown to the user.' },
      },
      required: ['command', 'purpose'],
    },
    async run(input, ctx) {
      const command = String(input.command);
      const purpose = String(input.purpose ?? '');

      const allowed = await ctx.approve('run_command', command, purpose);
      if (!allowed) return { ok: false, summary: `Declined: ${command}`, content: DENIED };

      const id = `cmd_${Date.now()}`;
      const result = await runCommand(command, (chunk) => ctx.emit({ type: 'command_output', id, chunk }));

      const status = result.timedOut ? 'timed out' : `exit ${result.code ?? '?'}`;
      return {
        ok: result.code === 0 && !result.timedOut,
        summary: `${command} · ${status}`,
        detail: truncate(result.output, 6000),
        content: `$ ${command}\n(${status})\n${truncate(result.output, 20_000) || '(no output)'}`,
      };
    },
  },

  {
    name: 'update_plan',
    guarded: false,
    description:
      'Publish or update your task list so the user can follow along. Call this at the start of any multi-step job and again whenever a step completes. Send the whole list every time.',
    input_schema: {
      type: 'object',
      properties: {
        todos: {
          type: 'array',
          description: 'The full plan, in order.',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              status: { type: 'string', enum: ['pending', 'active', 'done'] },
            },
            required: ['text', 'status'],
          },
        },
      },
      required: ['todos'],
    },
    async run(input, ctx) {
      const items: TodoItem[] = (Array.isArray(input.todos) ? input.todos : [])
        .filter((t: any) => t && typeof t.text === 'string')
        .map((t: any) => ({
          text: String(t.text),
          status: ['pending', 'active', 'done'].includes(t.status) ? t.status : 'pending',
        }));

      ctx.emit({ type: 'todos', items });
      const done = items.filter((t) => t.status === 'done').length;
      return {
        ok: true,
        summary: `Plan · ${done}/${items.length} done`,
        content: `Plan updated (${done}/${items.length} complete).`,
      };
    },
  },
];

export const TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

/** The tool definitions in the shape the Messages API expects. */
export function apiTools() {
  return TOOLS.map(({ name, description, input_schema }) => ({ name, description, input_schema }));
}

/** Used by the preview server to find a sensible entry page. */
export async function findEntryPage(): Promise<string | null> {
  const root = ws.getRoot();
  if (!root) return null;
  for (const candidate of ['index.html', 'public/index.html', 'src/index.html', 'docs/index.html']) {
    try {
      await fsp.access(path.join(root, candidate));
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  const html = (await ws.walk('', { maxEntries: 800, maxDepth: 4 })).filter((f) => f.endsWith('.html'));
  return html[0] ?? null;
}
