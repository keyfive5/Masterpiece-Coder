import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { FileContent, FileNode } from '../shared/types';
import { languageFor, looksBinary } from '../shared/lang';

/** Directories never shown in the explorer and never walked by the agent. */
export const IGNORED = new Set([
  'node_modules', '.git', '.svn', '.hg', 'dist', 'build', 'out', 'release',
  '.next', '.nuxt', '.cache', '.parcel-cache', '.turbo', '.vite', 'coverage',
  '__pycache__', '.venv', 'venv', '.idea', '.vscode-test', '.gradle',
  '.masterpiece',
]);

const MAX_READ_BYTES = 400_000;

let root: string | null = null;

export function setRoot(dir: string | null): void {
  root = dir ? path.resolve(dir) : null;
}

export function getRoot(): string | null {
  return root;
}

export function requireRoot(): string {
  if (!root) throw new Error('No project folder is open. Open a folder first.');
  return root;
}

/**
 * Resolve a workspace-relative path to an absolute one, refusing anything that
 * escapes the workspace. Every filesystem entry point goes through this.
 */
export function resolveInside(relative: string): string {
  const base = requireRoot();
  const cleaned = String(relative ?? '').replace(/^[/\\]+/, '');
  const abs = path.resolve(base, cleaned);
  const rel = path.relative(base, abs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path "${relative}" is outside the project folder.`);
  }
  return abs;
}

export function toRelative(abs: string): string {
  const base = requireRoot();
  return path.relative(base, abs).split(path.sep).join('/');
}

export async function readTree(relDir = ''): Promise<FileNode[]> {
  const abs = relDir ? resolveInside(relDir) : requireRoot();
  let entries: fs.Dirent[];
  try {
    entries = await fsp.readdir(abs, { withFileTypes: true });
  } catch {
    return [];
  }

  const nodes: FileNode[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.env.example' && entry.name !== '.gitignore') {
      if (!['.github', '.claude'].includes(entry.name)) continue;
    }
    if (IGNORED.has(entry.name)) continue;
    const rel = relDir ? `${relDir}/${entry.name}` : entry.name;
    nodes.push({ name: entry.name, path: rel, dir: entry.isDirectory() });
  }

  nodes.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
  return nodes;
}

export async function readFile(rel: string): Promise<FileContent> {
  const abs = resolveInside(rel);
  const stat = await fsp.stat(abs);
  if (stat.isDirectory()) throw new Error(`"${rel}" is a folder, not a file.`);

  if (looksBinary(rel)) {
    return { path: rel, content: '', language: 'plaintext', truncated: false, binary: true };
  }

  const truncated = stat.size > MAX_READ_BYTES;
  let content: string;
  if (truncated) {
    const handle = await fsp.open(abs, 'r');
    try {
      const buf = Buffer.alloc(MAX_READ_BYTES);
      await handle.read(buf, 0, MAX_READ_BYTES, 0);
      content = buf.toString('utf8');
    } finally {
      await handle.close();
    }
  } else {
    content = await fsp.readFile(abs, 'utf8');
  }

  return { path: rel, content, language: languageFor(rel), truncated, binary: false };
}

export async function readFileRaw(rel: string): Promise<string | null> {
  try {
    return await fsp.readFile(resolveInside(rel), 'utf8');
  } catch {
    return null;
  }
}

export async function writeFile(rel: string, content: string): Promise<void> {
  const abs = resolveInside(rel);
  await fsp.mkdir(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, content, 'utf8');
}

export async function createEntry(rel: string, dir: boolean): Promise<void> {
  const abs = resolveInside(rel);
  if (dir) {
    await fsp.mkdir(abs, { recursive: true });
  } else {
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.writeFile(abs, '', { flag: 'wx' });
  }
}

export async function deleteEntry(rel: string): Promise<void> {
  const abs = resolveInside(rel);
  await fsp.rm(abs, { recursive: true, force: true });
}

export async function exists(rel: string): Promise<boolean> {
  try {
    await fsp.access(resolveInside(rel));
    return true;
  } catch {
    return false;
  }
}

/** Recursive glob-ish walk used by the agent's `find_files` tool. */
export async function walk(
  relDir: string,
  opts: { maxEntries?: number; maxDepth?: number } = {},
): Promise<string[]> {
  const maxEntries = opts.maxEntries ?? 4000;
  const maxDepth = opts.maxDepth ?? 12;
  const out: string[] = [];

  async function step(rel: string, depth: number): Promise<void> {
    if (out.length >= maxEntries || depth > maxDepth) return;
    let entries: fs.Dirent[];
    try {
      entries = await fsp.readdir(rel ? resolveInside(rel) : requireRoot(), { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (IGNORED.has(entry.name)) continue;
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await step(child, depth + 1);
      } else {
        out.push(child);
        if (out.length >= maxEntries) return;
      }
    }
  }

  await step(relDir.replace(/^[./]+/, ''), 0);
  return out;
}

/** Convert a glob (supports `*`, `?`, `**`) into a RegExp over posix-ish paths. */
export function globToRegExp(glob: string): RegExp {
  let out = '';
  for (let i = 0; i < glob.length; i++) {
    const ch = glob[i];
    if (ch === '*') {
      if (glob[i + 1] === '*') {
        // `**/` matches any number of directories, including none.
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

/** The page the Preview panel should open, if the project has one. */
export async function findEntryPage(): Promise<string | null> {
  if (!getRoot()) return null;
  for (const candidate of ['index.html', 'public/index.html', 'src/index.html', 'docs/index.html']) {
    if (await exists(candidate)) return candidate;
  }
  const html = (await walk('', { maxEntries: 800, maxDepth: 4 })).filter((f) => f.endsWith('.html'));
  return html[0] ?? null;
}
