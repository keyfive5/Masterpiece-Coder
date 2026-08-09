import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopBridge, ProjectInfo, Settings } from '../shared/types';

const bridge: DesktopBridge = {
  isDesktop: true,
  platform: process.platform,

  listProjects: () => ipcRenderer.invoke('project:list'),
  createProject: (name) => ipcRenderer.invoke('project:create', name),
  chooseProject: () => ipcRenderer.invoke('project:choose'),
  openProject: (location) => ipcRenderer.invoke('project:open', location),
  currentProject: () => ipcRenderer.invoke('project:current'),

  list: (dir) => ipcRenderer.invoke('fs:list', dir),
  read: (path) => ipcRenderer.invoke('fs:read', path),
  readMeta: (path) => ipcRenderer.invoke('fs:readMeta', path),
  write: (path, content) => ipcRenderer.invoke('fs:write', path, content),
  remove: (path) => ipcRenderer.invoke('fs:remove', path),
  exists: (path) => ipcRenderer.invoke('fs:exists', path),
  walk: () => ipcRenderer.invoke('fs:walk'),
  reveal: (path) => ipcRenderer.invoke('fs:reveal', path),

  run: (command) => ipcRenderer.invoke('cmd:run', command),
  onCommandChunk(cb) {
    const listener = (_e: unknown, chunk: string) => cb(chunk);
    ipcRenderer.on('cmd:chunk', listener);
    return () => ipcRenderer.removeListener('cmd:chunk', listener);
  },

  netRequest: (url, init) => ipcRenderer.invoke('net:request', url, init),
  onNetChunk(cb) {
    const listener = (_e: unknown, requestId: string, chunk: string | null) => cb(requestId, chunk);
    ipcRenderer.on('net:chunk', listener);
    return () => ipcRenderer.removeListener('net:chunk', listener);
  },
  netAbort: (requestId) => ipcRenderer.send('net:abort', requestId),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (patch: Partial<Settings>) => ipcRenderer.invoke('settings:set', patch),
  getKey: (provider) => ipcRenderer.invoke('key:get', provider),
  setKey: (provider, key) => ipcRenderer.invoke('key:set', provider, key),
  listKeys: () => ipcRenderer.invoke('key:list'),

  startPreview: () => ipcRenderer.invoke('preview:start'),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),

  minimize: () => ipcRenderer.send('win:minimize'),
  toggleMaximize: () => ipcRenderer.send('win:maximize'),
  close: () => ipcRenderer.send('win:close'),
};

contextBridge.exposeInMainWorld('mc', bridge);

// The renderer wants to know when the main process switches project.
contextBridge.exposeInMainWorld('mcEvents', {
  onProjectChanged(cb: (project: ProjectInfo) => void) {
    const listener = (_e: unknown, project: ProjectInfo) => cb(project);
    ipcRenderer.on('project:changed', listener);
    return () => ipcRenderer.removeListener('project:changed', listener);
  },
});
