import { AgentEvent, TodoItem } from '../shared/types';
import { diffStat } from '../shared/diff';
import { looksBinary } from '../shared/lang';
import { readProject, review, reviewReport, summarise, Spec } from './maestro';
import { ToolSchema } from './types';
import { cleanPath, globToRegExp, Workspace } from './workspace';

export interface ToolContext {
  turnId: string;
  workspace: Workspace;
  emit: (event: AgentEvent) => void;
  approve: (tool: string, title: string, detail: string) => Promise<boolean>;
  /** Records a file's pre-change contents so the turn can be rewound. */
  capture: (path: string) => Promise<string | null>;
  signal: AbortSignal;
  /** What Maestro understood this turn to be about, when it is switched on. */
  spec?: Spec | null;
}

export interface ToolResult {
  ok: boolean;
  summary: string;
  detail?: string;
  content: string;
}

export interface ToolDef extends ToolSchema {
  guarded: boolean;
  /** Tools needing a shell are dropped when the host has none. */
  needsShell?: boolean;
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

async function recordChange(ctx: ToolContext, path: string, before: string | null, after: string | null) {
  const { added, removed } = diffStat(before, after);
  ctx.emit({ type: 'file_change', turnId: ctx.turnId, change: { path, before, after, added, removed } });
  return { added, removed };
}

export const TOOLS: ToolDef[] = [
  {
    name: 'read_file',
    guarded: false,
    description:
      'Read a text file from the project. Returns the contents with line numbers. Read a file before editing it so your edits match the real text exactly.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root, e.g. "src/App.tsx".' },
        start_line: { type: 'integer', description: 'Optional 1-based first line to return.' },
        end_line: { type: 'integer', description: 'Optional 1-based last line to return.' },
      },
      required: ['path'],
    },
    async run(input, ctx) {
      const path = cleanPath(input.path);
      if (looksBinary(path)) {
        return { ok: true, summary: `${path} — binary`, content: `${path} is a binary file; it cannot be shown as text.` };
      }
      const body = await ctx.workspace.read(path);
      if (body === null) {
        return { ok: false, summary: `Not found: ${path}`, content: `${path} does not exist.` };
      }
      const lines = body.split('\n');
      const start = Math.max(1, Number(input.start_line) || 1);
      const end = Math.min(lines.length, Number(input.end_line) || lines.length);
      const slice = lines.slice(start - 1, end).join('\n');
      return {
        ok: true,
        summary: `${path} · ${lines.length} lines`,
        detail: truncate(slice, 4000),
        content: `${path} (lines ${start}-${end} of ${lines.length}):\n${numbered(slice, start)}`,
      };
    },
  },

  {
    name: 'write_file',
    guarded: true,
    description:
      'Create a new file, or completely replace an existing one. Always pass the FULL final contents. For a small change to a large existing file prefer edit_file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root.' },
        content: { type: 'string', description: 'The complete contents of the file.' },
      },
      required: ['path', 'content'],
    },
    async run(input, ctx) {
      const path = cleanPath(input.path);
      const content = String(input.content ?? '');
      const existed = await ctx.workspace.exists(path);

      const allowed = await ctx.approve(
        'write_file',
        existed ? `Overwrite ${path}` : `Create ${path}`,
        `${content.split('\n').length} lines`,
      );
      if (!allowed) return { ok: false, summary: `Declined: ${path}`, content: DENIED };

      const before = await ctx.capture(path);
      await ctx.workspace.write(path, content);
      const { added, removed } = await recordChange(ctx, path, before, content);

      return {
        ok: true,
        summary: `${existed ? 'Updated' : 'Created'} ${path} · +${added}/-${removed}`,
        content: `Wrote ${path} (${content.split('\n').length} lines).`,
      };
    },
  },

  {
    name: 'edit_file',
    guarded: true,
    description:
      'Replace an exact snippet of text inside an existing file. old_text must appear verbatim and, unless replace_all is true, exactly once. Include surrounding context to make the match unique.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to the project root.' },
        old_text: { type: 'string', description: 'The exact text to find.' },
        new_text: { type: 'string', description: 'The replacement. Empty string deletes.' },
        replace_all: { type: 'boolean', description: 'Replace every occurrence.' },
      },
      required: ['path', 'old_text', 'new_text'],
    },
    async run(input, ctx) {
      const path = cleanPath(input.path);
      const oldText = String(input.old_text ?? '');
      const newText = String(input.new_text ?? '');

      const before = await ctx.workspace.read(path);
      if (before === null) {
        return { ok: false, summary: `Not found: ${path}`, content: `${path} does not exist. Create it with write_file.` };
      }
      if (oldText === '') {
        return { ok: false, summary: 'Empty search text', content: 'old_text cannot be empty. Use write_file instead.' };
      }

      const occurrences = before.split(oldText).length - 1;
      if (occurrences === 0) {
        return {
          ok: false,
          summary: `No match in ${path}`,
          content: `That text is not in ${path}. Read the file again and copy the exact text, including whitespace.`,
        };
      }
      if (occurrences > 1 && !input.replace_all) {
        return {
          ok: false,
          summary: `${occurrences} matches in ${path}`,
          content: `Found ${occurrences} occurrences. Add more context so the match is unique, or pass replace_all: true.`,
        };
      }

      const allowed = await ctx.approve('edit_file', `Edit ${path}`, `${occurrences} replacement${occurrences === 1 ? '' : 's'}`);
      if (!allowed) return { ok: false, summary: `Declined: ${path}`, content: DENIED };

      await ctx.capture(path);
      const after = input.replace_all ? before.split(oldText).join(newText) : before.replace(oldText, newText);
      await ctx.workspace.write(path, after);
      const { added, removed } = await recordChange(ctx, path, before, after);

      return {
        ok: true,
        summary: `Edited ${path} · +${added}/-${removed}`,
        content: `Edited ${path}: ${occurrences} replacement(s), +${added}/-${removed} lines.`,
      };
    },
  },

  {
    name: 'delete_file',
    guarded: true,
    description: 'Delete a file or folder from the project.',
    parameters: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Path relative to the project root.' } },
      required: ['path'],
    },
    async run(input, ctx) {
      const path = cleanPath(input.path);
      const allowed = await ctx.approve('delete_file', `Delete ${path}`, 'Undo is possible from History.');
      if (!allowed) return { ok: false, summary: `Declined: ${path}`, content: DENIED };

      const before = await ctx.capture(path);
      await ctx.workspace.remove(path);
      await recordChange(ctx, path, before, null);
      return { ok: true, summary: `Deleted ${path}`, content: `Deleted ${path}.` };
    },
  },

  {
    name: 'list_files',
    guarded: false,
    description: 'List the files and folders directly inside a directory of the project.',
    parameters: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Directory relative to the root. Omit for the root.' } },
    },
    async run(input, ctx) {
      const dir = input.path ? cleanPath(input.path) : '';
      const nodes = await ctx.workspace.list(dir);
      const body = nodes.length ? nodes.map((n) => (n.dir ? `${n.name}/` : n.name)).join('\n') : '(empty)';
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
    description: 'Find files by name with a glob such as "**/*.tsx" or "src/**/index.*".',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Glob matched against project-relative paths.' },
        limit: { type: 'integer', description: 'Maximum paths to return (default 200).' },
      },
      required: ['pattern'],
    },
    async run(input, ctx) {
      const pattern = String(input.pattern);
      const limit = Math.min(Number(input.limit) || 200, 1000);
      const regex = globToRegExp(pattern.includes('/') ? pattern : `**/${pattern}`);
      const matches = (await ctx.workspace.walk()).filter((f) => regex.test(f)).slice(0, limit);
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
    description: 'Search file contents with a regular expression. Returns matching lines with file and line number.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regular expression.' },
        glob: { type: 'string', description: 'Optional glob limiting which files are searched.' },
        case_sensitive: { type: 'boolean', description: 'Defaults to false.' },
        limit: { type: 'integer', description: 'Maximum matching lines (default 80).' },
      },
      required: ['pattern'],
    },
    async run(input, ctx) {
      const limit = Math.min(Number(input.limit) || 80, 400);
      let regex: RegExp;
      try {
        regex = new RegExp(String(input.pattern), input.case_sensitive ? '' : 'i');
      } catch (err) {
        return { ok: false, summary: 'Invalid pattern', content: `Not a valid regular expression: ${(err as Error).message}` };
      }

      const filter = input.glob ? globToRegExp(String(input.glob)) : null;
      const files = (await ctx.workspace.walk()).filter((f) => (!filter || filter.test(f)) && !looksBinary(f));

      const hits: string[] = [];
      for (const file of files) {
        if (hits.length >= limit) break;
        const text = await ctx.workspace.read(file);
        if (text === null) continue;
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
    needsShell: true,
    description:
      'Run a shell command in the project folder — installing packages, running tests, building. Output comes back to you. Do not start long-lived servers; use the Preview panel instead.',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command line to execute.' },
        purpose: { type: 'string', description: 'One short sentence describing why, shown to the user.' },
      },
      required: ['command', 'purpose'],
    },
    async run(input, ctx) {
      const command = String(input.command);
      if (!ctx.workspace.run) {
        return {
          ok: false,
          summary: 'No shell here',
          content: 'Commands cannot run in the web app. Build something that works without a build step, or ask the user to open the desktop app.',
        };
      }

      const allowed = await ctx.approve('run_command', command, String(input.purpose ?? ''));
      if (!allowed) return { ok: false, summary: `Declined: ${command}`, content: DENIED };

      const id = `cmd_${Date.now()}`;
      const result = await ctx.workspace.run(command, (chunk) => ctx.emit({ type: 'command_output', id, chunk }));
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
    parameters: {
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
      return { ok: true, summary: `Plan · ${done}/${items.length} done`, content: `Plan updated (${done}/${items.length} complete).` };
    },
  },

  {
    name: 'review_project',
    guarded: false,
    description:
      'Check the project you have built for real problems: files that are referenced but missing, code that does not parse, functions called but never defined, placeholder text left behind, a layout with no responsive rules, a game with no way to lose or no touch controls, low contrast, and the specific failure modes of this kind of project. ' +
      'Call this before you tell the user you are finished, and again after fixing what it reports. It reads the actual files — it is not an opinion.',
    parameters: { type: 'object', properties: {} },
    async run(_input, ctx) {
      const files = await readProject(ctx.workspace);
      const findings = review(files, ctx.spec ?? null);
      const serious = findings.filter((f) => f.severity !== 'minor');
      const report = reviewReport(findings);

      return {
        // Reported as a failure when something serious is wrong, so it cannot
        // be skimmed past — the model has to deal with it.
        ok: serious.length === 0,
        summary: `Review · ${summarise(findings)}`,
        detail: report.slice(0, 4000),
        content: report,
      };
    },
  },
];

export function toolsFor(workspace: Workspace): ToolDef[] {
  return TOOLS.filter((tool) => !tool.needsShell || workspace.canRunCommands);
}

export function schemasFor(workspace: Workspace): ToolSchema[] {
  return toolsFor(workspace).map(({ name, description, parameters }) => ({ name, description, parameters }));
}
