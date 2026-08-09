import { Net } from '../../core/types';
import { Workspace } from '../../core/workspace';
import { FileContent, ProjectInfo, Settings } from '../../shared/types';

/**
 * The renderer talks to exactly one Host. The desktop Host proxies to Electron;
 * the web Host uses OPFS and direct fetch. Everything above this line is shared.
 */
export interface Host {
  kind: 'desktop' | 'web';
  platform: string;
  net: Net;
  canRunCommands: boolean;

  listProjects(): Promise<ProjectInfo[]>;
  createProject(name: string): Promise<ProjectInfo>;
  openProject(location: string): Promise<ProjectInfo | null>;
  /** Desktop only — a native folder picker. */
  chooseProject?(): Promise<ProjectInfo | null>;
  deleteProject(location: string): Promise<void>;
  lastProject(): Promise<ProjectInfo | null>;

  workspace(project: ProjectInfo): Workspace;
  readMeta(project: ProjectInfo, path: string): Promise<FileContent>;

  getSettings(): Promise<Settings>;
  setSettings(patch: Partial<Settings>): Promise<Settings>;
  getKey(provider: string): Promise<string>;
  setKey(provider: string, key: string): Promise<void>;
  configuredKeys(): Promise<string[]>;

  /** Either a URL to load in an iframe, or a self-contained document to render. */
  preview(project: ProjectInfo): Promise<{ url?: string; srcdoc?: string; error?: string }>;
  openExternal(url: string): void;

  window?: { minimize(): void; toggleMaximize(): void; close(): void };
}
