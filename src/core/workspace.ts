import { FileNode } from '../shared/types';

/**
 * Everything the agent needs from a project, implemented once per host:
 * real files over IPC in the desktop app, OPFS in the browser.
 */
export interface Workspace {
  /** Human-readable location, shown in the status bar. */
  label: string;
  list(dir: string): Promise<FileNode[]>;
  read(path: string): Promise<string | null>;
  write(path: string, content: string): Promise<void>;
  remove(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  /** Every file path in the project, ignoring build output and vendor folders. */
  walk(): Promise<string[]>;

  /** Shell access exists in the desktop app only. */
  canRunCommands: boolean;
  run?(
    command: string,
    onChunk: (chunk: string) => void,
  ): Promise<{ code: number | null; output: string; timedOut: boolean }>;
}

export const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.svn', '.hg', 'dist', 'build', 'out', 'release',
  '.next', '.nuxt', '.cache', '.parcel-cache', '.turbo', '.vite', 'coverage',
  '__pycache__', '.venv', 'venv', '.idea', '.gradle', '.masterpiece',
]);

/** Normalise a model-supplied path: posix separators, no leading slash, no `..`. */
export function cleanPath(input: unknown): string {
  const raw = String(input ?? '').replace(/\\/g, '/');
  const parts: string[] = [];
  for (const segment of raw.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (parts.length === 0) throw new Error(`Path "${raw}" escapes the project.`);
      parts.pop();
      continue;
    }
    parts.push(segment);
  }
  if (parts.length === 0) throw new Error('A file path is required.');
  return parts.join('/');
}

/** Convert a glob (`*`, `?`, `**`) into a RegExp over project-relative paths. */
export function globToRegExp(glob: string): RegExp {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') {
          out += '(?:.*/)?';
          i += 2;
        } else {
          out += '.*';
          i += 1;
        }
      } else {
        out += '[^/]*';
      }
    } else if (ch === '?') {
      out += '[^/]';
    } else if ('\\^$+.()|[]{}'.includes(ch)) {
      out += `\\${ch}`;
    } else {
      out += ch;
    }
  }
  return new RegExp(`^${out}$`, 'i');
}

export async function projectSnapshot(workspace: Workspace): Promise<string> {
  const files = await workspace.walk();
  if (files.length === 0) {
    return `Project: ${workspace.label}\nThe project is EMPTY — you are starting from scratch.`;
  }
  const shown = files.slice(0, 300);
  const more = files.length - shown.length;
  return [
    `Project: ${workspace.label}`,
    `Files (${files.length}${more > 0 ? ', first 300 shown' : ''}):`,
    ...shown.map((f) => `  ${f}`),
    ...(more > 0 ? [`  …and ${more} more`] : []),
  ].join('\n');
}
