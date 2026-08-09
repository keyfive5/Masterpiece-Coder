import { Net, NetResponse } from '../../core/types';
import { Workspace } from '../../core/workspace';
import { DesktopBridge, FileContent, FileNode, ProjectInfo, Settings } from '../../shared/types';
import { Host } from './types';

/**
 * Network requests are proxied through the main process. That keeps every
 * provider reachable regardless of CORS, and keeps API keys off the page.
 */
function desktopNet(bridge: DesktopBridge): Net {
  const inFlight = new Map<string, { push: (chunk: string | null) => void }>();

  bridge.onNetChunk((requestId, chunk) => {
    inFlight.get(requestId)?.push(chunk);
  });

  return {
    async request(url, init): Promise<NetResponse> {
      const started = await bridge.netRequest(url, { method: init.method, headers: init.headers, body: init.body });
      const { requestId } = started;

      const queue: string[] = [];
      let done = false;
      let wake: (() => void) | null = null;

      inFlight.set(requestId, {
        push: (chunk) => {
          if (chunk === null) done = true;
          else queue.push(chunk);
          wake?.();
        },
      });

      init.signal.addEventListener('abort', () => bridge.netAbort(requestId), { once: true });

      const drain = async function* (): AsyncGenerator<string> {
        try {
          for (;;) {
            if (queue.length) {
              yield queue.shift()!;
              continue;
            }
            if (done) return;
            await new Promise<void>((resolve) => {
              wake = resolve;
            });
            wake = null;
          }
        } finally {
          inFlight.delete(requestId);
        }
      };

      return {
        status: started.status,
        ok: started.ok,
        lines: drain,
        async text() {
          let out = '';
          for await (const chunk of drain()) out += chunk;
          return out;
        },
      };
    },
  };
}

class DesktopWorkspace implements Workspace {
  readonly canRunCommands = true;

  constructor(
    private readonly bridge: DesktopBridge,
    readonly label: string,
  ) {}

  list(dir: string): Promise<FileNode[]> {
    return this.bridge.list(dir);
  }
  read(path: string): Promise<string | null> {
    return this.bridge.read(path);
  }
  write(path: string, content: string): Promise<void> {
    return this.bridge.write(path, content);
  }
  remove(path: string): Promise<void> {
    return this.bridge.remove(path);
  }
  exists(path: string): Promise<boolean> {
    return this.bridge.exists(path);
  }
  walk(): Promise<string[]> {
    return this.bridge.walk();
  }

  async run(command: string, onChunk: (chunk: string) => void) {
    const off = this.bridge.onCommandChunk(onChunk);
    try {
      return await this.bridge.run(command);
    } finally {
      off();
    }
  }
}

export function createDesktopHost(bridge: DesktopBridge): Host {
  const net = desktopNet(bridge);

  return {
    kind: 'desktop',
    platform: bridge.platform,
    net,
    canRunCommands: true,

    listProjects: () => bridge.listProjects(),
    createProject: (name) => bridge.createProject(name),
    openProject: (location) => bridge.openProject(location),
    chooseProject: () => bridge.chooseProject(),
    deleteProject: async () => {
      /* the desktop app never deletes a real folder on the user's disk */
    },
    lastProject: () => bridge.currentProject(),

    workspace(project: ProjectInfo): Workspace {
      return new DesktopWorkspace(bridge, project.name);
    },

    readMeta: (_project, path): Promise<FileContent> => bridge.readMeta(path),

    getSettings: () => bridge.getSettings(),
    setSettings: (patch: Partial<Settings>) => bridge.setSettings(patch),
    getKey: (provider) => bridge.getKey(provider),
    setKey: (provider, key) => bridge.setKey(provider, key),
    configuredKeys: () => bridge.listKeys(),

    async preview() {
      const url = await bridge.startPreview();
      return url ? { url } : { error: 'Could not start the preview server.' };
    },

    openExternal: (url) => void bridge.openExternal(url),

    window: {
      minimize: () => bridge.minimize(),
      toggleMaximize: () => bridge.toggleMaximize(),
      close: () => bridge.close(),
    },
  };
}
