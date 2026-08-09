import { Net } from './types';
import { IGNORED_DIRS, Workspace } from './workspace';

/**
 * GitHub over the REST API rather than a git binary, so the same code works in
 * the browser and in the desktop app. Pushing uses the git data API (blobs →
 * tree → commit → ref) so a save is one clean commit, not one commit per file.
 */

const API = 'https://api.github.com';

export interface RepoRef {
  owner: string;
  repo: string;
  branch?: string;
}

export interface GitHubProgress {
  (label: string): void;
}

export function parseRepo(input: string): RepoRef | null {
  const text = input.trim().replace(/\.git$/, '');
  const patterns = [
    /^https?:\/\/(?:www\.)?github\.com\/([^/\s]+)\/([^/\s?#]+)/i,
    /^git@github\.com:([^/\s]+)\/([^/\s]+)$/i,
    /^([\w.-]+)\/([\w.-]+)$/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return { owner: match[1], repo: match[2] };
  }
  return null;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call(
  net: Net,
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<any> {
  const controller = new AbortController();
  const response = await net.request(`${API}${path}`, {
    method,
    headers: {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? '' : JSON.stringify(body),
    signal: controller.signal,
  });

  const text = await response.text();
  if (!response.ok) {
    let detail = text.slice(0, 300);
    try {
      detail = JSON.parse(text).message ?? detail;
    } catch {
      /* keep the raw body */
    }
    if (response.status === 401) throw new GitHubError('GitHub rejected the token. Check it in Settings.', 401);
    if (response.status === 403) {
      throw new GitHubError(`GitHub refused: ${detail}. The token may lack "Contents: read and write".`, 403);
    }
    if (response.status === 404) {
      throw new GitHubError('Repository or branch not found. Check the link, and that the token can see it.', 404);
    }
    throw new GitHubError(`GitHub error ${response.status}: ${detail}`, response.status);
  }
  return text ? JSON.parse(text) : null;
}

async function defaultBranch(net: Net, token: string, ref: RepoRef): Promise<string> {
  if (ref.branch) return ref.branch;
  const info = await call(net, token, 'GET', `/repos/${ref.owner}/${ref.repo}`);
  return info.default_branch ?? 'main';
}

/** Files we never sync either way. */
function skip(path: string): boolean {
  const segments = path.split('/');
  return segments.some((segment) => IGNORED_DIRS.has(segment));
}

/* ---------------------------------------------------------------- pull */

export async function pullRepo(
  net: Net,
  token: string,
  ref: RepoRef,
  workspace: Workspace,
  onProgress: GitHubProgress = () => undefined,
): Promise<{ files: number; branch: string }> {
  const branch = await defaultBranch(net, token, ref);
  onProgress(`Reading ${ref.owner}/${ref.repo}`);

  const tree = await call(
    net,
    token,
    'GET',
    `/repos/${ref.owner}/${ref.repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  );

  const blobs = (tree.tree ?? []).filter(
    (entry: any) => entry.type === 'blob' && !skip(entry.path) && (entry.size ?? 0) < 600_000,
  );

  let written = 0;
  for (const entry of blobs) {
    onProgress(`Downloading ${entry.path}`);
    const blob = await call(net, token, 'GET', `/repos/${ref.owner}/${ref.repo}/git/blobs/${entry.sha}`);
    if (blob.encoding !== 'base64') continue;
    let content: string;
    try {
      // GitHub wraps base64 at 60 chars.
      content = decodeURIComponent(escape(atob(String(blob.content).replace(/\n/g, ''))));
    } catch {
      continue; // binary that is not valid UTF-8 — skip rather than corrupt it
    }
    await workspace.write(entry.path, content);
    written++;
  }

  return { files: written, branch };
}

/* ---------------------------------------------------------------- push */

export async function pushRepo(
  net: Net,
  token: string,
  ref: RepoRef,
  workspace: Workspace,
  message: string,
  onProgress: GitHubProgress = () => undefined,
): Promise<{ files: number; commit: string; branch: string; url: string }> {
  if (!token) throw new GitHubError('A GitHub token is needed to save. Add one in Settings.', 401);

  const branch = await defaultBranch(net, token, ref);
  const paths = (await workspace.walk()).filter((path) => !skip(path));
  if (paths.length === 0) throw new GitHubError('There is nothing in this project to save yet.', 400);

  onProgress('Finding the current commit');
  let baseCommitSha: string | null = null;
  let baseTreeSha: string | undefined;
  try {
    const refInfo = await call(net, token, 'GET', `/repos/${ref.owner}/${ref.repo}/git/ref/heads/${branch}`);
    baseCommitSha = refInfo.object.sha;
    const baseCommit = await call(net, token, 'GET', `/repos/${ref.owner}/${ref.repo}/git/commits/${baseCommitSha}`);
    baseTreeSha = baseCommit.tree.sha;
  } catch (err) {
    // An empty repository has no ref yet — the first push creates it.
    if (!(err instanceof GitHubError) || err.status !== 404) throw err;
  }

  const entries: { path: string; mode: string; type: string; sha: string }[] = [];
  for (const path of paths) {
    onProgress(`Uploading ${path}`);
    const content = await workspace.read(path);
    if (content === null) continue;
    const blob = await call(net, token, 'POST', `/repos/${ref.owner}/${ref.repo}/git/blobs`, {
      content,
      encoding: 'utf-8',
    });
    entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  onProgress('Building the commit');
  const tree = await call(net, token, 'POST', `/repos/${ref.owner}/${ref.repo}/git/trees`, {
    ...(baseTreeSha ? { base_tree: baseTreeSha } : {}),
    tree: entries,
  });

  const commit = await call(net, token, 'POST', `/repos/${ref.owner}/${ref.repo}/git/commits`, {
    message,
    tree: tree.sha,
    ...(baseCommitSha ? { parents: [baseCommitSha] } : {}),
  });

  onProgress('Pushing');
  if (baseCommitSha) {
    await call(net, token, 'PATCH', `/repos/${ref.owner}/${ref.repo}/git/refs/heads/${branch}`, {
      sha: commit.sha,
      force: false,
    });
  } else {
    await call(net, token, 'POST', `/repos/${ref.owner}/${ref.repo}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha: commit.sha,
    });
  }

  return {
    files: entries.length,
    commit: String(commit.sha).slice(0, 7),
    branch,
    url: `https://github.com/${ref.owner}/${ref.repo}/commit/${commit.sha}`,
  };
}

/** Create a brand-new repository on the signed-in account. */
export async function createRepo(
  net: Net,
  token: string,
  name: string,
  isPrivate: boolean,
): Promise<RepoRef & { url: string }> {
  if (!token) throw new GitHubError('A GitHub token is needed to create a repository.', 401);
  const created = await call(net, token, 'POST', '/user/repos', {
    name,
    private: isPrivate,
    auto_init: false,
    description: 'Built with Masterpiece Coder',
  });
  return { owner: created.owner.login, repo: created.name, url: created.html_url };
}

export async function whoAmI(net: Net, token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const user = await call(net, token, 'GET', '/user');
    return user?.login ?? null;
  } catch {
    return null;
  }
}
