import { Agent } from '../core/agent';
import { loadPuter, providerById, puterAuth } from '../core/providers';
import { Workspace } from '../core/workspace';
import { AgentEvent, ProjectInfo, Settings } from '../shared/types';
import { host } from './host';
import { getState, patchChat, pushChat, setState, toast } from './store';
import { cancelPush, schedulePush } from './sync';

/* ---------------------------------------------------------------- *
 * Streaming deltas arrive far faster than React should re-render, so
 * they are buffered and flushed on a short timer. A timer rather than
 * an animation frame: rAF stops while the window is minimised, which
 * would leave a reply frozen mid-sentence.
 * ---------------------------------------------------------------- */
const deltaBuffer = new Map<string, string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function queueFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    if (deltaBuffer.size === 0) return;
    const pending = new Map(deltaBuffer);
    deltaBuffer.clear();
    setState((s) => ({
      chat: s.chat.map((item) => {
        const extra = pending.get(item.id);
        if (extra === undefined || (item.kind !== 'text' && item.kind !== 'thinking')) return item;
        return { ...item, text: item.text + extra };
      }),
    }));
  }, 32);
}

/* ---------------------------------------------------------------- agent */

let workspace: Workspace | null = null;

const agent = new Agent({
  net: host.net,
  platform: host.platform,
  keyFor: (provider) => keyCache[provider] ?? '',
  requestSignIn: async () => signIn(true),
});

/** Keys are read once at boot so the agent can stay synchronous. */
const keyCache: Record<string, string> = {};

function handleEvent(event: AgentEvent): void {
  switch (event.type) {
    case 'turn_start':
      setState({ busy: true, activity: 'Getting started', startedAt: Date.now() });
      break;

    case 'activity':
      setState({ activity: event.label });
      break;

    case 'block_start':
      pushChat({ kind: event.kind, id: event.id, text: '', done: false });
      break;

    case 'delta':
      deltaBuffer.set(event.id, (deltaBuffer.get(event.id) ?? '') + event.text);
      queueFlush();
      break;

    case 'block_end':
      patchChat(event.id, { done: true });
      break;

    case 'tool_start':
      pushChat({ kind: 'tool', id: event.id, name: event.name, input: event.input, status: 'running', summary: '' });
      break;

    case 'tool_end':
      patchChat(event.id, { status: event.status, summary: event.summary, detail: event.detail });
      break;

    case 'approval_request':
      pushChat({ kind: 'approval', id: event.id, tool: event.tool, title: event.title, detail: event.detail, resolved: null });
      break;

    case 'approval_resolved':
      patchChat(event.id, { resolved: event.approved });
      break;

    case 'todos':
      setState({ todos: event.items });
      break;

    case 'file_change': {
      const change = event.change;
      setState((s) => {
        const open = s.files[change.path];
        return {
          changes: [...s.changes.filter((c) => c.path !== change.path), change],
          files: open
            ? { ...s.files, [change.path]: { ...open, content: change.after ?? '', original: change.after ?? '', dirty: false } }
            : s.files,
          diffPath: change.path,
          center: s.center === 'preview' ? 'preview' : 'diff',
        };
      });
      void refreshTree();
      queueSync();
      break;
    }

    case 'command_output':
      setState((s) => ({ output: (s.output + event.chunk).slice(-120_000), outputOpen: true }));
      break;

    case 'usage':
      setState((s) => ({
        usage: {
          input: s.usage.input + event.delta.input + event.delta.cacheRead + event.delta.cacheWrite,
          output: s.usage.output + event.delta.output,
          cost: s.usage.cost + event.delta.costUsd,
        },
      }));
      break;

    case 'notice':
      pushChat({ kind: 'notice', id: `n_${Date.now()}_${Math.random()}`, level: event.level, message: event.message });
      break;

    case 'need_key':
      setState({ modal: 'key', keyProvider: event.provider });
      break;

    case 'idle':
      setState({ busy: false, activity: '', checkpoints: agent.checkpoints.list() });
      // Refresh the preview so a finished build is immediately visible.
      if (getState().center === 'preview') void openPreview();
      break;

    case 'turn_end':
      break;
  }
}

/* ---------------------------------------------------------------- boot */

export async function boot(): Promise<void> {
  const [settings, keys, projects] = await Promise.all([host.getSettings(), host.configuredKeys(), host.listProjects()]);
  for (const provider of keys) keyCache[provider] = await host.getKey(provider);

  setState({ settings, configuredKeys: keys, projects, ready: true });

  // Restore the Puter session quietly if there is one.
  void (async () => {
    if (!(await loadPuter())) return;
    if (!puterAuth.isSignedIn()) return;
    const account = await puterAuth.user();
    if (account) setState({ account });
  })();

  if (keyCache.github) {
    void import('../core/github').then(async ({ whoAmI }) => {
      setState({ githubUser: await whoAmI(host.net, keyCache.github) });
    });
  }

  const last = await host.lastProject();
  if (last) await activateProject(last);

  const events = (window as any).mcEvents;
  events?.onProjectChanged?.((project: ProjectInfo) => void activateProject(project));
}

async function activateProject(project: ProjectInfo): Promise<void> {
  workspace = host.workspace(project);
  agent.reset();
  cancelPush();
  setState({
    project,
    tree: {},
    expanded: [],
    tabs: [],
    active: null,
    files: {},
    chat: [],
    todos: [],
    changes: [],
    output: '',
    preview: null,
    center: 'editor',
    usage: { input: 0, output: 0, cost: 0 },
    checkpoints: [],
    repoLink: null,
  });
  await refreshTree();
  setState({ repoLink: await readRepoLink() });
}

/* ---------------------------------------------------------------- projects */

export async function newProject(name: string): Promise<ProjectInfo> {
  const project = await host.createProject(name);
  setState((s) => ({ projects: [project, ...s.projects.filter((p) => p.id !== project.id)] }));
  await activateProject(project);
  return project;
}

export async function openProject(location: string): Promise<void> {
  const project = await host.openProject(location);
  if (project) await activateProject(project);
  else toast('That project could not be opened.');
}

export async function chooseProjectFolder(): Promise<void> {
  const project = await host.chooseProject?.();
  if (project) {
    setState((s) => ({ projects: [project, ...s.projects.filter((p) => p.id !== project.id)] }));
    await activateProject(project);
  }
}

export async function deleteProject(location: string): Promise<void> {
  await host.deleteProject(location);
  setState((s) => ({ projects: s.projects.filter((p) => p.location !== location) }));
  toast('Project deleted');
}

export async function refreshProjects(): Promise<void> {
  setState({ projects: await host.listProjects() });
}

/**
 * Projects made on another device. This is the other half of the phone story:
 * write the prompt outside, then pull the result down on the computer at home.
 */
export async function refreshCloudProjects(): Promise<void> {
  if (!getState().account) {
    setState({ cloudProjects: [] });
    return;
  }
  const { listCloudProjects } = await import('./sync');
  setState({ cloudProjects: await listCloudProjects() });
}

export async function pullFromCloud(id: string): Promise<void> {
  setState({ githubBusy: 'Downloading from your account…' });
  try {
    const { pullProject } = await import('./sync');
    const project = await pullProject(id);
    if (!project) {
      toast('That project could not be downloaded.');
      return;
    }
    await refreshProjects();
    await activateProject(project);
    setState({ modal: null });
    toast(`Opened ${project.name} from your account`);
  } catch (err) {
    toast((err as Error).message);
  } finally {
    setState({ githubBusy: null });
  }
}

/* ---------------------------------------------------------------- files */

export async function refreshTree(dir = ''): Promise<void> {
  if (!workspace) return;
  const nodes = await workspace.list(dir);
  setState((s) => ({ tree: { ...s.tree, [dir]: nodes } }));
}

export async function toggleDir(path: string): Promise<void> {
  const { expanded, tree } = getState();
  if (expanded.includes(path)) {
    setState({ expanded: expanded.filter((p) => p !== path) });
    return;
  }
  if (!tree[path]) await refreshTree(path);
  setState((s) => ({ expanded: [...s.expanded, path] }));
}

export async function openFile(path: string, view: 'editor' | 'diff' = 'editor'): Promise<void> {
  const { project, files } = getState();
  if (!project) return;

  if (!files[path]) {
    const meta = await host.readMeta(project, path);
    setState((s) => ({
      files: {
        ...s.files,
        [path]: {
          content: meta.content,
          original: meta.content,
          language: meta.language,
          dirty: false,
          binary: meta.binary,
        },
      },
    }));
  }

  setState((s) => ({
    tabs: s.tabs.includes(path) ? s.tabs : [...s.tabs, path],
    active: path,
    center: view,
    diffPath: view === 'diff' ? path : s.diffPath,
  }));
}

export function closeTab(path: string): void {
  setState((s) => {
    const tabs = s.tabs.filter((t) => t !== path);
    const files = { ...s.files };
    delete files[path];
    return { tabs, files, active: s.active === path ? (tabs[tabs.length - 1] ?? null) : s.active };
  });
}

export function editFile(path: string, content: string): void {
  setState((s) => {
    const file = s.files[path];
    if (!file) return {};
    return { files: { ...s.files, [path]: { ...file, content, dirty: content !== file.original } } };
  });
}

export async function saveActive(): Promise<void> {
  const { active, files } = getState();
  if (!active || !workspace) return;
  const file = files[active];
  if (!file?.dirty) return;
  await workspace.write(active, file.content);
  setState((s) => ({ files: { ...s.files, [active]: { ...s.files[active], original: file.content, dirty: false } } }));
  queueSync();
  toast(`Saved ${active}`);
}

/* ---------------------------------------------------------------- chat */

export async function sendMessage(text: string, attachments: string[] = []): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  let { project, settings } = getState();
  if (!project) {
    // Prompt-first: the very first message creates the project for you.
    project = await newProject(projectNameFrom(trimmed));
    settings = getState().settings;
  }
  if (!workspace) return;

  pushChat({ kind: 'user', id: `u_${Date.now()}`, text: trimmed, attachments });
  // Flip to working immediately — the first network round trip can take a few
  // seconds and the app must never look like it ignored you.
  setState({ busy: true, activity: 'Getting started', startedAt: Date.now() });
  await agent.send(trimmed, attachments, workspace, settings, handleEvent);
}

/** Turn "make me a snake game" into "snake-game" for the folder name. */
function projectNameFrom(prompt: string): string {
  const stop = new Set([
    'a', 'an', 'the', 'make', 'build', 'create', 'me', 'my', 'i', 'want', 'need', 'please',
    'can', 'you', 'app', 'that', 'with', 'for', 'and', 'to', 'of', 'in', 'on', 'is', 'it',
  ]);
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !stop.has(w))
    .slice(0, 4);
  return words.length ? words.join('-') : 'new-project';
}

export function stopAgent(): void {
  agent.stop();
  setState({ busy: false });
}

export function approve(id: string, approved: boolean, always: boolean): void {
  const item = getState().chat.find((c) => c.id === id);
  const tool = item && item.kind === 'approval' ? item.tool : undefined;
  agent.resolveApproval(id, approved, always, tool);
  if (always && approved && tool) {
    const settings = getState().settings;
    if (!settings.alwaysAllow.includes(tool)) void updateSettings({ alwaysAllow: [...settings.alwaysAllow, tool] });
  }
}

export function newSession(): void {
  agent.reset();
  setState({ chat: [], todos: [], changes: [], usage: { input: 0, output: 0, cost: 0 }, output: '', checkpoints: [] });
  toast('Fresh session — the project files are untouched');
}

/* ---------------------------------------------------------------- settings */

export async function updateSettings(patch: Partial<Settings>): Promise<void> {
  const settings = await host.setSettings(patch);
  setState({ settings });
}

export async function saveKey(provider: string, key: string): Promise<void> {
  await host.setKey(provider, key);
  keyCache[provider] = key;
  setState({ configuredKeys: await host.configuredKeys(), modal: null, keyProvider: null });
  toast(key ? 'Key saved' : 'Key removed');
}

/** Switching provider also snaps the model to one that provider actually has. */
export async function chooseProvider(providerId: string): Promise<void> {
  const provider = providerById(providerId);
  const current = getState().settings.model;
  const model = provider.models.some((m) => m.id === current) ? current : (provider.models[0]?.id ?? current);
  await updateSettings({ provider: providerId, model });
}

/* ---------------------------------------------------------------- account */

export async function signIn(fromAgent = false): Promise<boolean> {
  try {
    const account = await puterAuth.signIn();
    if (!account) return false;
    setState({ account });
    if (!fromAgent) toast(`Signed in as ${account.username}`);
    return true;
  } catch {
    if (!fromAgent) toast('Sign-in was cancelled');
    return false;
  }
}

export function signOut(): void {
  puterAuth.signOut();
  setState({ account: null });
  toast('Signed out. Your projects stay on this device.');
}

function queueSync(): void {
  const { account, project } = getState();
  if (!account || !project || !workspace) return;
  setState({ syncing: true });
  schedulePush(project, workspace, (ok) => {
    setState({ syncing: false });
    if (!ok) toast('Could not sync to your account.');
  });
}

export async function syncNow(): Promise<void> {
  const { account, project } = getState();
  if (!account || !project || !workspace) {
    toast('Sign in first to sync.');
    return;
  }
  setState({ syncing: true });
  const { pushProject } = await import('./sync');
  const ok = await pushProject(project, workspace).catch(() => false);
  setState({ syncing: false });
  toast(ok ? 'Synced to your account' : 'Sync failed');
}

/* ---------------------------------------------------------------- history */

export async function restoreCheckpoint(turnId: string): Promise<void> {
  if (!workspace) return;
  const count = await agent.checkpoints.restore(workspace, turnId);
  toast(`Rewound ${count} file${count === 1 ? '' : 's'}`);
  setState({ modal: null, changes: [], files: {}, tabs: [], active: null, checkpoints: agent.checkpoints.list() });
  await refreshTree();
  queueSync();
}

export async function revertChange(path: string, before: string | null): Promise<void> {
  if (!workspace) return;
  if (before === null) await workspace.remove(path);
  else await workspace.write(path, before);
  setState((s) => ({ changes: s.changes.filter((c) => c.path !== path), files: {}, tabs: s.tabs.filter((t) => t !== path) }));
  await refreshTree();
  queueSync();
  toast(`Reverted ${path}`);
}

/* ---------------------------------------------------------------- github */

/**
 * The repo a project is linked to lives inside the project itself, under
 * `.masterpiece/` — which is on the ignore list, so it never gets committed and
 * the agent never sees it, but it does travel with the project when it syncs.
 */
const LINK_FILE = '.masterpiece/github.json';

export async function readRepoLink(): Promise<{ owner: string; repo: string } | null> {
  if (!workspace) return null;
  const raw = await workspace.read(LINK_FILE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.owner && parsed?.repo ? parsed : null;
  } catch {
    return null;
  }
}

async function writeRepoLink(ref: { owner: string; repo: string }): Promise<void> {
  await workspace?.write(LINK_FILE, JSON.stringify(ref, null, 2));
  setState({ repoLink: ref });
}

export async function saveGithubToken(token: string): Promise<void> {
  await host.setKey('github', token);
  keyCache.github = token;
  const { whoAmI } = await import('../core/github');
  const login = await whoAmI(host.net, token);
  setState({ githubUser: login, configuredKeys: await host.configuredKeys() });
  toast(login ? `Connected to GitHub as ${login}` : 'Token saved, but GitHub did not recognise it');
}

export async function githubPull(input: string): Promise<void> {
  if (!workspace) return;
  const { parseRepo, pullRepo } = await import('../core/github');
  const ref = parseRepo(input);
  if (!ref) {
    toast('That does not look like a GitHub link.');
    return;
  }

  setState({ githubBusy: 'Connecting…' });
  try {
    const result = await pullRepo(host.net, keyCache.github ?? '', ref, workspace, (label) =>
      setState({ githubBusy: label }),
    );
    await writeRepoLink(ref);
    await refreshTree();
    queueSync();
    toast(`Pulled ${result.files} file${result.files === 1 ? '' : 's'} from ${ref.owner}/${ref.repo}`);
  } catch (err) {
    toast((err as Error).message);
  } finally {
    setState({ githubBusy: null });
  }
}

export async function githubPush(input: string, message: string): Promise<void> {
  if (!workspace) return;
  const { parseRepo, pushRepo } = await import('../core/github');
  const ref = parseRepo(input);
  if (!ref) {
    toast('That does not look like a GitHub link.');
    return;
  }

  setState({ githubBusy: 'Connecting…' });
  try {
    const result = await pushRepo(
      host.net,
      keyCache.github ?? '',
      ref,
      workspace,
      message || 'Update from Masterpiece Coder',
      (label) => setState({ githubBusy: label }),
    );
    await writeRepoLink(ref);
    toast(`Saved ${result.files} files to ${ref.owner}/${ref.repo} — commit ${result.commit}`);
  } catch (err) {
    toast((err as Error).message);
  } finally {
    setState({ githubBusy: null });
  }
}

export async function githubCreate(name: string, isPrivate: boolean): Promise<void> {
  if (!workspace) return;
  const { createRepo, pushRepo } = await import('../core/github');
  setState({ githubBusy: 'Creating the repository…' });
  try {
    const ref = await createRepo(host.net, keyCache.github ?? '', name, isPrivate);
    const result = await pushRepo(
      host.net,
      keyCache.github ?? '',
      ref,
      workspace,
      'First commit from Masterpiece Coder',
      (label) => setState({ githubBusy: label }),
    );
    await writeRepoLink(ref);
    toast(`Created ${ref.owner}/${ref.repo} with ${result.files} files`);
    host.openExternal(ref.url);
  } catch (err) {
    toast((err as Error).message);
  } finally {
    setState({ githubBusy: null });
  }
}

/* ---------------------------------------------------------------- preview */

export async function openPreview(): Promise<void> {
  const { project } = getState();
  if (!project) return;
  const preview = await host.preview(project);
  setState({ preview, center: 'preview' });
}
