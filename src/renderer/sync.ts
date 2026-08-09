import { loadPuter, puterAuth } from '../core/providers';
import { Workspace } from '../core/workspace';
import { ProjectInfo } from '../shared/types';
import { host } from './host';

/**
 * Projects are mirrored into the signed-in Puter account so the same work can be
 * picked up in the browser or in the desktop app. A project is stored as one
 * JSON blob of {path: contents}; these are small hand-written projects, not repos.
 */

const INDEX_KEY = 'mc.projects.index';
const blobKey = (id: string) => `mc.project.${id}`;

export interface CloudProject {
  id: string;
  name: string;
  updatedAt: number;
  fileCount: number;
}

async function kv(): Promise<any | null> {
  if (!(await loadPuter())) return null;
  if (!puterAuth.isSignedIn()) return null;
  return (window as any).puter.kv;
}

export async function listCloudProjects(): Promise<CloudProject[]> {
  const store = await kv();
  if (!store) return [];
  try {
    const raw = await store.get(INDEX_KEY);
    if (!raw) return [];
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(entries: CloudProject[]): Promise<void> {
  const store = await kv();
  if (!store) return;
  await store.set(INDEX_KEY, JSON.stringify(entries.slice(0, 60)));
}

/** Upload the whole project. Debounced by the caller. */
export async function pushProject(project: ProjectInfo, workspace: Workspace): Promise<boolean> {
  const store = await kv();
  if (!store) return false;

  const files: Record<string, string> = {};
  for (const path of await workspace.walk()) {
    const body = await workspace.read(path);
    // Skip anything huge or binary-ish so a sync stays quick and small.
    if (body !== null && body.length < 400_000) files[path] = body;
  }

  const id = project.id;
  await store.set(blobKey(id), JSON.stringify({ name: project.name, files, updatedAt: Date.now() }));

  const index = (await listCloudProjects()).filter((entry) => entry.id !== id);
  index.unshift({ id, name: project.name, updatedAt: Date.now(), fileCount: Object.keys(files).length });
  await writeIndex(index.sort((a, b) => b.updatedAt - a.updatedAt));
  return true;
}

/** Download a cloud project into a local one, creating it if needed. */
export async function pullProject(id: string): Promise<ProjectInfo | null> {
  const store = await kv();
  if (!store) return null;

  const raw = await store.get(blobKey(id));
  if (!raw) return null;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const files: Record<string, string> = parsed?.files ?? {};
  const name: string = parsed?.name ?? id;

  const existing = (await host.listProjects()).find((p) => p.id === id || p.name === name);
  const project = existing ?? (await host.createProject(name));
  const workspace = host.workspace(project);

  for (const [path, content] of Object.entries(files)) {
    await workspace.write(path, content).catch(() => undefined);
  }
  return project;
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

/** Coalesce rapid file changes into one upload. */
export function schedulePush(project: ProjectInfo, workspace: Workspace, onDone?: (ok: boolean) => void): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    const ok = await pushProject(project, workspace).catch(() => false);
    onDone?.(ok);
  }, 4000);
}

export function cancelPush(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
}
