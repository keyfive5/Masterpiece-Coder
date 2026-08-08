import React from 'react';
import { api, isDemo } from '../api';
import { chooseWorkspace, newSession, refreshCheckpoints, updateSettings } from '../actions';
import { setState, useStore } from '../store';
import { MODELS } from '../../shared/types';
import { Folder, Gear, History, Minus, Plus, Square, X } from './Icons';

export function TitleBar() {
  const workspace = useStore((s) => s.workspace);
  const settings = useStore((s) => s.settings);
  const busy = useStore((s) => s.busy);

  const folderName = workspace ? workspace.split(/[\\/]/).filter(Boolean).pop() : null;

  return (
    <div className="titlebar">
      <div className="brand">
        <div className="mark" />
        <span>Masterpiece Coder</span>
      </div>

      <button className="crumb" onClick={chooseWorkspace} title={workspace ?? 'Choose a project folder'}>
        <Folder size={13} />
        <span>{folderName ?? 'Open a project folder'}</span>
      </button>

      <select
        className="btn no-drag"
        value={settings.model}
        onChange={(e) => updateSettings({ model: e.target.value })}
        disabled={busy}
        title="Model"
        style={{ paddingRight: 6 }}
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>

      <button className="btn ghost" onClick={newSession} disabled={busy} title="Clear the conversation and start fresh">
        <Plus size={13} /> New session
      </button>

      <button
        className="btn ghost"
        onClick={async () => {
          await refreshCheckpoints();
          setState({ modal: 'history' });
        }}
        title="Rewind the project to an earlier point"
      >
        <History size={13} /> History
      </button>

      <button className="btn ghost" onClick={() => setState({ modal: 'settings' })} title="Settings">
        <Gear size={13} />
      </button>

      {!isDemo && (
        <div className="winbtns">
          <button className="winbtn" onClick={() => api.minimize()} aria-label="Minimize">
            <Minus size={14} />
          </button>
          <button className="winbtn" onClick={() => api.toggleMaximize()} aria-label="Maximize">
            <Square size={12} />
          </button>
          <button className="winbtn close" onClick={() => api.close()} aria-label="Close">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
