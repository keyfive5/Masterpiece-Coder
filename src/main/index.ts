import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'node:path';
import { AgentEvent, AppState, Settings } from '../shared/types';
import { store } from './store';
import * as ws from './workspace';
import * as agent from './agent';
import * as checkpoints from './checkpoints';
import { findEntryPage } from './tools';
import { serveDirectory, StaticServer } from './static-server';

const DEV_URL = process.env.MC_DEV_SERVER_URL;

let win: BrowserWindow | null = null;
let appServer: StaticServer | null = null;
let previewServer: StaticServer | null = null;

function emit(event: AgentEvent): void {
  win?.webContents.send('agent:event', event);
}

function currentState(): AppState {
  return {
    workspace: ws.getRoot(),
    hasApiKey: store.hasApiKey(),
    settings: store.settings(),
    recentWorkspaces: store.recentWorkspaces(),
  };
}

function setWorkspace(dir: string | null): void {
  ws.setRoot(dir);
  store.setWorkspace(dir);
  agent.newSession();
  if (dir && previewServer) previewServer.setRoot(dir);
  win?.webContents.send('workspace:changed', dir);
}

/**
 * `MC_SMOKE=1 npx electron .` boots the app against whatever workspace is saved,
 * opens the first file, cycles the three views, prints what rendered and exits.
 * A fast way to confirm a build actually works without leaving a window open.
 */
async function runSmokeTest(): Promise<void> {
  const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));
  const evaluate = (js: string) => win?.webContents.executeJavaScript(js);
  const click = (text: string) =>
    evaluate(
      `(() => { const el = [...document.querySelectorAll('.tree .row, .seg button')]
          .find(x => x.textContent.includes(${JSON.stringify(text)}));
        el?.click();
        return !!el; })()`,
    );

  await wait(2500);
  const firstFile = await evaluate(
    `[...document.querySelectorAll('.tree .row .name')].map(n => n.textContent).find(n => n.includes('.')) ?? ''`,
  );
  if (firstFile) {
    await click(firstFile);
    await wait(2200);
  }
  for (const view of ['Diff', 'Preview', 'Code']) {
    await click(view);
    await wait(1400);
  }

  const report = await evaluate(
    `({ title: document.title,
        panes: document.querySelectorAll('.pane').length,
        welcome: !!document.querySelector('.welcome'),
        tree: [...document.querySelectorAll('.tree .row .name')].map(n => n.textContent),
        tabs: document.querySelectorAll('.tab').length,
        monaco: !!document.querySelector('.monaco-editor'),
        highlightedTokens: document.querySelectorAll('.view-line span[class^="mtk"]').length,
        preview: document.querySelector('.preview-frame')?.src ?? null,
        status: document.querySelector('.status')?.innerText.replace(/\\n/g, ' | ') })`,
  );
  console.log('[smoke]', JSON.stringify(report, null, 2));
  app.quit();
}

async function createWindow(): Promise<void> {
  win = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 940,
    minHeight: 620,
    show: false,
    frame: false,
    backgroundColor: '#0b0d12',
    title: 'Masterpiece Coder',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });

  win.once('ready-to-show', () => {
    win?.show();
    // `MC_SMOKE=1 electron .` boots, renders, reports, and exits — used to verify
    // a build without leaving a window open.
    if (process.env.MC_SMOKE) void runSmokeTest();
  });

  win.webContents.on('render-process-gone', (_e, details) => {
    console.error('[renderer crashed]', details.reason);
  });
  win.webContents.on('console-message', (_e, level, message, line, source) => {
    if (level >= 2) console.error(`[renderer] ${message} (${source}:${line})`);
  });

  // External links open in the real browser, never inside the app shell.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (DEV_URL) {
    await win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Serving over http (rather than file://) keeps Monaco's web workers and
    // ES modules working exactly as they do in a browser.
    appServer = await serveDirectory(path.join(__dirname, '../renderer'), { spa: true });
    await win.loadURL(appServer.url);
  }

  win.on('closed', () => {
    win = null;
  });
}

function registerIpc(): void {
  const handle = (channel: string, fn: (...args: any[]) => any) =>
    ipcMain.handle(channel, async (_event, ...args) => fn(...args));

  handle('app:state', () => currentState());

  handle('settings:set', (patch: Partial<Settings>) => store.updateSettings(patch));

  handle('key:set', (key: string) => {
    store.setApiKey(key);
    return store.hasApiKey();
  });
  handle('key:clear', () => store.setApiKey(''));

  handle('workspace:choose', async () => {
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      title: 'Choose a project folder',
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: 'Open project',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    setWorkspace(result.filePaths[0]);
    return result.filePaths[0];
  });

  handle('workspace:open', (dir: string) => {
    try {
      setWorkspace(dir);
      return dir;
    } catch {
      return null;
    }
  });

  handle('fs:tree', (dir?: string) => ws.readTree(dir ?? ''));
  handle('fs:read', (file: string) => ws.readFile(file));
  handle('fs:save', async (file: string, content: string) => {
    await ws.writeFile(file, content);
  });
  handle('fs:create', (file: string, dir: boolean) => ws.createEntry(file, dir));
  handle('fs:delete', (file: string) => ws.deleteEntry(file));
  handle('fs:reveal', (file: string) => {
    shell.showItemInFolder(ws.resolveInside(file));
  });

  handle('agent:send', (text: string, attachments: string[]) => agent.send(text, attachments ?? [], emit));
  handle('agent:stop', () => agent.stop());
  handle('agent:approve', (id: string, approved: boolean, always: boolean, tool?: string) =>
    agent.resolveApproval(id, approved, always, tool),
  );
  handle('agent:new-session', () => agent.newSession());

  handle('checkpoint:list', () => checkpoints.list());
  handle('checkpoint:restore', (turnId: string) => checkpoints.restore(turnId));
  handle('checkpoint:revert-file', async (file: string, content: string | null) => {
    if (content === null) await ws.deleteEntry(file);
    else await ws.writeFile(file, content);
  });

  handle('preview:start', async () => {
    const root = ws.getRoot();
    if (!root) return null;
    if (!previewServer) previewServer = await serveDirectory(root);
    previewServer.setRoot(root);
    const entry = await findEntryPage();
    return entry ? `${previewServer.url}${entry}` : previewServer.url;
  });
  handle('preview:stop', async () => {
    await previewServer?.close();
    previewServer = null;
  });
  handle('shell:open', (url: string) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
  });

  ipcMain.on('win:minimize', () => win?.minimize());
  ipcMain.on('win:maximize', () => {
    if (!win) return;
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on('win:close', () => win?.close());
}

// Single instance: a second launch focuses the existing window.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    ws.setRoot(store.workspace());
    registerIpc();
    await createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) void createWindow();
    });
  });

  app.on('window-all-closed', () => {
    agent.stop();
    void appServer?.close();
    void previewServer?.close();
    if (process.platform !== 'darwin') app.quit();
  });
}
