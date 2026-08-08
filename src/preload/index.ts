import { contextBridge, ipcRenderer } from 'electron';
import type { AgentEvent, Bridge } from '../shared/types';

const bridge: Bridge = {
  getState: () => ipcRenderer.invoke('app:state'),
  setSettings: (patch) => ipcRenderer.invoke('settings:set', patch),
  setApiKey: (key) => ipcRenderer.invoke('key:set', key),
  clearApiKey: () => ipcRenderer.invoke('key:clear'),

  chooseWorkspace: () => ipcRenderer.invoke('workspace:choose'),
  openWorkspace: (dir) => ipcRenderer.invoke('workspace:open', dir),
  readTree: (dir) => ipcRenderer.invoke('fs:tree', dir),
  readFile: (file) => ipcRenderer.invoke('fs:read', file),
  saveFile: (file, content) => ipcRenderer.invoke('fs:save', file, content),
  createEntry: (file, dir) => ipcRenderer.invoke('fs:create', file, dir),
  deleteEntry: (file) => ipcRenderer.invoke('fs:delete', file),
  revealInExplorer: (file) => ipcRenderer.invoke('fs:reveal', file),

  send: (text, attachments) => ipcRenderer.invoke('agent:send', text, attachments),
  stop: () => ipcRenderer.invoke('agent:stop'),
  resolveApproval: (id, approved, always) => ipcRenderer.invoke('agent:approve', id, approved, always),
  newSession: () => ipcRenderer.invoke('agent:new-session'),

  checkpoints: () => ipcRenderer.invoke('checkpoint:list'),
  restore: (turnId) => ipcRenderer.invoke('checkpoint:restore', turnId),
  revertFile: (file, content) => ipcRenderer.invoke('checkpoint:revert-file', file, content),

  startPreview: () => ipcRenderer.invoke('preview:start'),
  stopPreview: () => ipcRenderer.invoke('preview:stop'),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),

  minimize: () => ipcRenderer.send('win:minimize'),
  toggleMaximize: () => ipcRenderer.send('win:maximize'),
  close: () => ipcRenderer.send('win:close'),

  onEvent(cb: (event: AgentEvent) => void) {
    const listener = (_e: unknown, payload: AgentEvent) => cb(payload);
    ipcRenderer.on('agent:event', listener);
    return () => ipcRenderer.removeListener('agent:event', listener);
  },

  onWorkspaceChanged(cb: (dir: string | null) => void) {
    const listener = (_e: unknown, dir: string | null) => cb(dir);
    ipcRenderer.on('workspace:changed', listener);
    return () => ipcRenderer.removeListener('workspace:changed', listener);
  },
};

contextBridge.exposeInMainWorld('mc', bridge);
