import React from 'react';
import { providerById } from '../../core/providers';
import { newSession, signIn, signOut, syncNow } from '../actions';
import { host, isWeb } from '../host';
import { setState, useStore } from '../store';
import { Cloud, Folder, Gear, Github, History, Minus, Plus, Square, X } from './Icons';

export function TitleBar() {
  const project = useStore((s) => s.project);
  const settings = useStore((s) => s.settings);
  const account = useStore((s) => s.account);
  const syncing = useStore((s) => s.syncing);
  const busy = useStore((s) => s.busy);

  const provider = providerById(settings.provider);

  return (
    <div className="titlebar">
      <div className="brand">
        <div className="mark" />
        <span>Masterpiece Coder</span>
      </div>

      <button className="crumb" onClick={() => setState({ modal: 'projects' })} title="Switch project">
        <Folder size={13} />
        <span>{project ? project.name : 'No project'}</span>
      </button>

      <button
        className="crumb"
        onClick={() => setState({ modal: 'settings' })}
        title={`${provider.label} · ${settings.model}`}
      >
        <span style={{ color: provider.free ? 'var(--green)' : 'var(--accent-2)' }}>
          {provider.free ? '✦ Free' : provider.label}
        </span>
        <span style={{ color: 'var(--faint)' }}>{settings.model}</span>
      </button>

      <div style={{ flex: 1 }} />

      <button
        className={`btn ghost${account ? ' on' : ''}`}
        onClick={() => (account ? void syncNow() : void signIn())}
        title={
          account
            ? `Signed in as ${account.username}. Click to sync this project now.`
            : 'Sign in free to use the free AI and sync projects between the web app and the desktop app'
        }
      >
        <Cloud size={13} />
        {syncing ? 'Syncing…' : account ? account.username : 'Sign in'}
      </button>

      {account && (
        <button className="iconbtn" onClick={signOut} title="Sign out">
          <X size={13} />
        </button>
      )}

      <button className="btn ghost" onClick={newSession} disabled={busy} title="Clear the conversation, keep the files">
        <Plus size={13} /> New chat
      </button>

      <button
        className="btn ghost"
        onClick={() => setState({ modal: 'github' })}
        title="Save this project to GitHub, or pull a repo into it"
      >
        <Github size={13} />
      </button>

      <button className="btn ghost" onClick={() => setState({ modal: 'history' })} title="Rewind changes">
        <History size={13} />
      </button>

      <button className="btn ghost" onClick={() => setState({ modal: 'settings' })} title="Settings">
        <Gear size={13} />
      </button>

      {!isWeb && host.window && (
        <div className="winbtns">
          <button className="winbtn" onClick={() => host.window!.minimize()} aria-label="Minimize">
            <Minus size={14} />
          </button>
          <button className="winbtn" onClick={() => host.window!.toggleMaximize()} aria-label="Maximize">
            <Square size={12} />
          </button>
          <button className="winbtn close" onClick={() => host.window!.close()} aria-label="Close">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
