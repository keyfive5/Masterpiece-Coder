import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_SETTINGS, ProjectInfo, Settings } from '../shared/types';

interface Persisted {
  settings: Settings;
  project: string | null;
  projects: ProjectInfo[];
  /** provider id → base64 of the encrypted key (or the raw key if encryption is unavailable). */
  keys: Record<string, string>;
  keysEncrypted: boolean;
}

const DEFAULTS: Persisted = {
  settings: DEFAULT_SETTINGS,
  project: null,
  projects: [],
  keys: {},
  keysEncrypted: false,
};

let cache: Persisted | null = null;

function file(): string {
  return path.join(app.getPath('userData'), 'masterpiece.json');
}

function load(): Persisted {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(fs.readFileSync(file(), 'utf8')) as Partial<Persisted>;
    cache = {
      ...DEFAULTS,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      projects: parsed.projects ?? [],
      keys: parsed.keys ?? {},
    };
  } catch {
    cache = { ...DEFAULTS, keys: {}, projects: [] };
  }
  return cache;
}

function flush(): void {
  if (!cache) return;
  try {
    fs.mkdirSync(path.dirname(file()), { recursive: true });
    fs.writeFileSync(file(), JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.error('[store] could not persist:', err);
  }
}

export const store = {
  settings: (): Settings => load().settings,

  updateSettings(patch: Partial<Settings>): Settings {
    const state = load();
    state.settings = { ...state.settings, ...patch };
    flush();
    return state.settings;
  },

  project: (): string | null => load().project,

  setProject(location: string | null): void {
    const state = load();
    state.project = location;
    flush();
  },

  projects(): ProjectInfo[] {
    return load().projects.filter((project) => {
      try {
        return fs.statSync(project.location).isDirectory();
      } catch {
        return false;
      }
    });
  },

  rememberProject(project: ProjectInfo): void {
    const state = load();
    state.projects = [project, ...state.projects.filter((p) => p.location !== project.location)].slice(0, 24);
    state.project = project.location;
    flush();
  },

  key(provider: string): string {
    const state = load();
    const stored = state.keys[provider];
    if (!stored) return '';
    if (!state.keysEncrypted) return stored;
    try {
      return safeStorage.decryptString(Buffer.from(stored, 'base64'));
    } catch {
      return '';
    }
  },

  setKey(provider: string, key: string): void {
    const state = load();
    const trimmed = key.trim();
    if (!trimmed) {
      delete state.keys[provider];
    } else if (safeStorage.isEncryptionAvailable()) {
      state.keys[provider] = safeStorage.encryptString(trimmed).toString('base64');
      state.keysEncrypted = true;
    } else {
      state.keys[provider] = trimmed;
      state.keysEncrypted = false;
    }
    flush();
  },

  configuredKeys: (): string[] => Object.keys(load().keys),
};
