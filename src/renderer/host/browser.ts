import { Net, NetResponse } from '../../core/types';
import { IGNORED_DIRS, Workspace } from '../../core/workspace';
import { languageFor, looksBinary } from '../../shared/lang';
import { DEFAULT_SETTINGS, FileContent, FileNode, ProjectInfo, Settings } from '../../shared/types';
import { Host } from './types';

/* ---------------------------------------------------------------- OPFS */

async function opfsRoot(): Promise<FileSystemDirectoryHandle> {
  if (!navigator.storage?.getDirectory) {
    throw new Error('This browser cannot store projects. Try Chrome, Edge, or the desktop app.');
  }
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle('projects', { create: true });
}

async function dirFor(project: string, segments: string[], create: boolean): Promise<FileSystemDirectoryHandle | null> {
  let handle = await (await opfsRoot()).getDirectoryHandle(project, { create });
  for (const segment of segments) {
    try {
      handle = await handle.getDirectoryHandle(segment, { create });
    } catch {
      return null;
    }
  }
  return handle;
}

function split(path: string): { dirs: string[]; name: string } {
  const parts = path.split('/').filter(Boolean);
  return { name: parts.pop() ?? '', dirs: parts };
}

class OpfsWorkspace implements Workspace {
  readonly canRunCommands = false;

  constructor(
    private readonly project: string,
    readonly label: string,
  ) {}

  async list(dir: string): Promise<FileNode[]> {
    const handle = await dirFor(this.project, dir.split('/').filter(Boolean), false);
    if (!handle) return [];
    const nodes: FileNode[] = [];
    for await (const [name, entry] of (handle as any).entries()) {
      if (IGNORED_DIRS.has(name)) continue;
      nodes.push({ name, path: dir ? `${dir}/${name}` : name, dir: entry.kind === 'directory' });
    }
    nodes.sort((a, b) => (a.dir === b.dir ? a.name.localeCompare(b.name) : a.dir ? -1 : 1));
    return nodes;
  }

  async read(path: string): Promise<string | null> {
    const { dirs, name } = split(path);
    const handle = await dirFor(this.project, dirs, false);
    if (!handle) return null;
    try {
      const file = await (await handle.getFileHandle(name)).getFile();
      return file.text();
    } catch {
      return null;
    }
  }

  async write(path: string, content: string): Promise<void> {
    const { dirs, name } = split(path);
    const handle = await dirFor(this.project, dirs, true);
    if (!handle) throw new Error(`Could not create ${path}`);
    const file = await handle.getFileHandle(name, { create: true });
    if (!(file as any).createWritable) {
      throw new Error('This browser cannot write files. Try Chrome, Edge, or the desktop app.');
    }
    const writable = await (file as any).createWritable();
    await writable.write(content);
    await writable.close();
  }

  async remove(path: string): Promise<void> {
    const { dirs, name } = split(path);
    const handle = await dirFor(this.project, dirs, false);
    if (!handle) return;
    await handle.removeEntry(name, { recursive: true }).catch(() => undefined);
  }

  async exists(path: string): Promise<boolean> {
    return (await this.read(path)) !== null;
  }

  async walk(): Promise<string[]> {
    const out: string[] = [];
    const step = async (dir: string, depth: number) => {
      if (depth > 10 || out.length > 3000) return;
      for (const node of await this.list(dir)) {
        if (node.dir) await step(node.path, depth + 1);
        else out.push(node.path);
      }
    };
    await step('', 0);
    return out;
  }
}

/* ---------------------------------------------------------------- preview */

const MIME: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon',
};

/**
 * The web build has no server, so the preview is assembled by hand: local
 * stylesheets and scripts are inlined and local images become data URIs, then
 * the whole thing is handed to an iframe as srcdoc.
 */
async function buildPreviewDoc(workspace: Workspace): Promise<{ srcdoc?: string; error?: string }> {
  const files = await workspace.walk();
  const entry =
    files.find((f) => f === 'index.html') ??
    files.find((f) => f.endsWith('/index.html')) ??
    files.find((f) => f.endsWith('.html'));

  if (!entry) {
    return { error: 'No HTML file yet. Ask for a web page and it will appear here.' };
  }

  const base = entry.includes('/') ? entry.slice(0, entry.lastIndexOf('/') + 1) : '';
  const resolve = (href: string) => {
    if (/^(https?:|data:|#|mailto:)/i.test(href)) return null;
    return (base + href.replace(/^\.\//, '')).replace(/^\//, '');
  };

  let html = (await workspace.read(entry)) ?? '';

  // <link rel="stylesheet" href="local.css">
  for (const match of [...html.matchAll(/<link\b[^>]*?href=["']([^"']+)["'][^>]*>/gi)]) {
    if (!/stylesheet/i.test(match[0])) continue;
    const target = resolve(match[1]);
    if (!target) continue;
    const css = await workspace.read(target);
    if (css !== null) html = html.replace(match[0], `<style>\n${css}\n</style>`);
  }

  // <script src="local.js">
  for (const match of [...html.matchAll(/<script\b[^>]*?src=["']([^"']+)["'][^>]*>\s*<\/script>/gi)]) {
    const target = resolve(match[1]);
    if (!target) continue;
    const js = await workspace.read(target);
    if (js === null) continue;
    const isModule = /type=["']module["']/i.test(match[0]);
    html = html.replace(match[0], `<script${isModule ? ' type="module"' : ''}>\n${js}\n</script>`);
  }

  // <img src="local.png">
  for (const match of [...html.matchAll(/src=["']([^"']+\.(?:png|jpe?g|gif|webp|svg|ico))["']/gi)]) {
    const target = resolve(match[1]);
    if (!target) continue;
    const body = await workspace.read(target);
    if (body === null) continue;
    const ext = target.split('.').pop()!.toLowerCase();
    const encoded =
      ext === 'svg'
        ? `data:image/svg+xml;utf8,${encodeURIComponent(body)}`
        : `data:${MIME[ext] ?? 'application/octet-stream'};base64,${btoa(unescape(encodeURIComponent(body)))}`;
    html = html.replace(match[0], `src="${encoded}"`);
  }

  return { srcdoc: html };
}

/* ---------------------------------------------------------------- net */

const browserNet: Net = {
  async request(url, init): Promise<NetResponse> {
    const response = await fetch(url, {
      method: init.method,
      headers: init.headers,
      body: init.body,
      signal: init.signal,
    });
    return {
      status: response.status,
      ok: response.ok,
      text: () => response.text(),
      async *lines() {
        const reader = response.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          yield decoder.decode(value, { stream: true });
        }
      },
    };
  },
};

/* ---------------------------------------------------------------- storage */

const SETTINGS_KEY = 'mc.settings';
const KEYS_KEY = 'mc.keys';
const LAST_KEY = 'mc.lastProject';
const META_KEY = 'mc.projects';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function projectMeta(): Record<string, { name: string; updatedAt: number }> {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveProjectMeta(meta: Record<string, { name: string; updatedAt: number }>): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return base || 'project';
}

/* ---------------------------------------------------------------- host */

export function createBrowserHost(): Host {
  return {
    kind: 'web',
    platform: 'web',
    net: browserNet,
    canRunCommands: false,

    async listProjects(): Promise<ProjectInfo[]> {
      const meta = projectMeta();
      const out: ProjectInfo[] = [];
      try {
        const root = await opfsRoot();
        for await (const [name, entry] of (root as any).entries()) {
          if (entry.kind !== 'directory') continue;
          out.push({
            id: name,
            name: meta[name]?.name ?? name,
            location: name,
            updatedAt: meta[name]?.updatedAt ?? 0,
          });
        }
      } catch {
        /* storage unavailable */
      }
      return out.sort((a, b) => b.updatedAt - a.updatedAt);
    },

    async createProject(name: string): Promise<ProjectInfo> {
      const meta = projectMeta();
      let slug = slugify(name);
      let n = 2;
      while (meta[slug]) slug = `${slugify(name)}-${n++}`;

      await (await opfsRoot()).getDirectoryHandle(slug, { create: true });
      meta[slug] = { name, updatedAt: Date.now() };
      saveProjectMeta(meta);
      localStorage.setItem(LAST_KEY, slug);
      return { id: slug, name, location: slug, updatedAt: Date.now() };
    },

    async openProject(location: string): Promise<ProjectInfo | null> {
      const meta = projectMeta();
      try {
        await (await opfsRoot()).getDirectoryHandle(location, { create: false });
      } catch {
        return null;
      }
      meta[location] = { name: meta[location]?.name ?? location, updatedAt: Date.now() };
      saveProjectMeta(meta);
      localStorage.setItem(LAST_KEY, location);
      return { id: location, name: meta[location].name, location, updatedAt: Date.now() };
    },

    async deleteProject(location: string): Promise<void> {
      await (await opfsRoot()).removeEntry(location, { recursive: true }).catch(() => undefined);
      const meta = projectMeta();
      delete meta[location];
      saveProjectMeta(meta);
      if (localStorage.getItem(LAST_KEY) === location) localStorage.removeItem(LAST_KEY);
    },

    async lastProject(): Promise<ProjectInfo | null> {
      const last = localStorage.getItem(LAST_KEY);
      return last ? this.openProject(last) : null;
    },

    workspace(project: ProjectInfo): Workspace {
      return new OpfsWorkspace(project.location, project.name);
    },

    async readMeta(project: ProjectInfo, path: string): Promise<FileContent> {
      const workspace = new OpfsWorkspace(project.location, project.name);
      if (looksBinary(path)) {
        return { path, content: '', language: 'plaintext', truncated: false, binary: true };
      }
      const content = (await workspace.read(path)) ?? '';
      return { path, content, language: languageFor(path), truncated: false, binary: false };
    },

    async getSettings(): Promise<Settings> {
      return readJson<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
    },

    async setSettings(patch: Partial<Settings>): Promise<Settings> {
      const next = { ...(await this.getSettings()), ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    },

    async getKey(provider: string): Promise<string> {
      return readJson<Record<string, string>>(KEYS_KEY, {})[provider] ?? '';
    },

    async setKey(provider: string, key: string): Promise<void> {
      const all = readJson<Record<string, string>>(KEYS_KEY, {});
      if (key) all[provider] = key;
      else delete all[provider];
      localStorage.setItem(KEYS_KEY, JSON.stringify(all));
    },

    async configuredKeys(): Promise<string[]> {
      return Object.keys(readJson<Record<string, string>>(KEYS_KEY, {}));
    },

    async preview(project: ProjectInfo) {
      return buildPreviewDoc(new OpfsWorkspace(project.location, project.name));
    },

    openExternal(url: string): void {
      window.open(url, '_blank', 'noopener');
    },
  };
}
