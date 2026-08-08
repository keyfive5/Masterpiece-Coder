import { app, safeStorage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_SETTINGS, Settings } from '../shared/types';

interface Persisted {
  settings: Settings;
  workspace: string | null;
  recentWorkspaces: string[];
  /** Base64 of the safeStorage-encrypted key, or a plain key if encryption is unavailable. */
  apiKey?: string;
  apiKeyEncrypted?: boolean;
}

const DEFAULTS: Persisted = {
  settings: DEFAULT_SETTINGS,
  workspace: null,
  recentWorkspaces: [],
};

let cache: Persisted | null = null;

function file(): string {
  return path.join(app.getPath('userData'), 'masterpiece.json');
}

function load(): Persisted {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(file(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    cache = {
      ...DEFAULTS,
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      recentWorkspaces: parsed.recentWorkspaces ?? [],
    };
  } catch {
    cache = { ...DEFAULTS };
  }
  return cache;
}

function flush(): void {
  if (!cache) return;
  try {
    fs.mkdirSync(path.dirname(file()), { recursive: true });
    fs.writeFileSync(file(), JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.error('[store] could not persist settings:', err);
  }
}

export const store = {
  settings(): Settings {
    return load().settings;
  },

  updateSettings(patch: Partial<Settings>): Settings {
    const s = load();
    s.settings = { ...s.settings, ...patch };
    flush();
    return s.settings;
  },

  workspace(): string | null {
    return load().workspace;
  },

  setWorkspace(dir: string | null): void {
    const s = load();
    s.workspace = dir;
    if (dir) {
      s.recentWorkspaces = [dir, ...s.recentWorkspaces.filter((w) => w !== dir)].slice(0, 8);
    }
    flush();
  },

  recentWorkspaces(): string[] {
    return load().recentWorkspaces.filter((dir) => {
      try {
        return fs.statSync(dir).isDirectory();
      } catch {
        return false;
      }
    });
  },

  hasApiKey(): boolean {
    return Boolean(load().apiKey);
  },

  apiKey(): string | null {
    const s = load();
    if (!s.apiKey) return null;
    if (!s.apiKeyEncrypted) return s.apiKey;
    try {
      return safeStorage.decryptString(Buffer.from(s.apiKey, 'base64'));
    } catch {
      return null;
    }
  },

  setApiKey(key: string): void {
    const s = load();
    const trimmed = key.trim();
    if (!trimmed) {
      delete s.apiKey;
      delete s.apiKeyEncrypted;
      flush();
      return;
    }
    if (safeStorage.isEncryptionAvailable()) {
      s.apiKey = safeStorage.encryptString(trimmed).toString('base64');
      s.apiKeyEncrypted = true;
    } else {
      s.apiKey = trimmed;
      s.apiKeyEncrypted = false;
    }
    flush();
  },
};
