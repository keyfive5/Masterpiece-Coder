import React, { useState } from 'react';
import { PROVIDERS, providerById } from '../../core/providers';
import { Effort } from '../../shared/types';
import {
  chooseProjectFolder,
  chooseProvider,
  deleteProject,
  newProject,
  openProject,
  restoreCheckpoint,
  saveKey,
  signIn,
  signOut,
  updateSettings,
} from '../actions';
import { host, isWeb } from '../host';
import { setState, useStore } from '../store';
import { Cloud, Folder, Plus, Trash, Undo, X } from './Icons';

function Scrim({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">{children}</div>
    </div>
  );
}

function Toggle({ on, label, desc, onChange }: { on: boolean; label: string; desc: string; onChange: (v: boolean) => void }) {
  return (
    <div className={`opt${on ? ' on' : ''}`} onClick={() => onChange(!on)}>
      <div className={`switch${on ? ' on' : ''}`} />
      <div>
        <div className="t">{label}</div>
        <div className="s">{desc}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- key */

function KeyModal({ providerId, onClose }: { providerId: string; onClose: () => void }) {
  const provider = providerById(providerId);
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await saveKey(provider.id, key);
    setSaving(false);
  };

  return (
    <Scrim onClose={onClose}>
      <header>
        Connect {provider.label}
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={onClose}>
          <X size={14} />
        </button>
      </header>
      <div className="content">
        <div className="field">
          <label>API key</label>
          <input
            type="password"
            value={key}
            autoFocus
            placeholder={provider.keyHint ?? 'Paste your key'}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && key.trim() && save()}
          />
          <div className="desc">
            Stored {isWeb ? 'in this browser' : 'encrypted on this machine'} and sent only to {provider.label}.
            {provider.keyUrl && (
              <>
                {' '}
                Get one at{' '}
                <a
                  href={provider.keyUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    host.openExternal(provider.keyUrl!);
                  }}
                  style={{ color: 'var(--accent-2)' }}
                >
                  {new URL(provider.keyUrl).host}
                </a>
                .
              </>
            )}
          </div>
        </div>
        <div className="notice">
          <span>i</span>
          <span>
            Do not want to deal with keys? Switch to <b>Free</b> in settings — one sign-in, no card, and it syncs your
            projects too.
          </span>
        </div>
      </div>
      <footer>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn primary" disabled={!key.trim() || saving} onClick={save}>
          {saving ? 'Saving…' : 'Save key'}
        </button>
      </footer>
    </Scrim>
  );
}

/* ---------------------------------------------------------------- settings */

const EFFORTS: { id: Effort; label: string }[] = [
  { id: 'low', label: 'Low — quick and cheap' },
  { id: 'medium', label: 'Medium — balanced' },
  { id: 'high', label: 'High — thinks it through (default)' },
  { id: 'xhigh', label: 'Extra high — hard multi-file builds' },
  { id: 'max', label: 'Max — no ceiling' },
];

function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = useStore((s) => s.settings);
  const keys = useStore((s) => s.configuredKeys);
  const account = useStore((s) => s.account);
  const [instructions, setInstructions] = useState(settings.customInstructions);

  const provider = providerById(settings.provider);
  const available = PROVIDERS.filter((p) => p.browserOk || !isWeb);

  return (
    <Scrim onClose={onClose}>
      <header>
        Settings
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={onClose}>
          <X size={14} />
        </button>
      </header>

      <div className="content">
        <div className="field">
          <label>Who builds it</label>
          <div className="opts">
            {available.map((entry) => {
              const ready = !entry.needsKey || keys.includes(entry.id);
              return (
                <div
                  key={entry.id}
                  className={`opt${settings.provider === entry.id ? ' on' : ''}`}
                  onClick={() => void chooseProvider(entry.id)}
                >
                  <div className="radio" />
                  <div style={{ flex: 1 }}>
                    <div className="t">
                      {entry.label}
                      {entry.free && <span className="tag free">free</span>}
                      {entry.needsKey && !ready && <span className="tag">needs a key</span>}
                      {entry.needsKey && ready && <span className="tag ok">connected</span>}
                    </div>
                    <div className="s">{entry.tagline}</div>
                    {entry.note && settings.provider === entry.id && <div className="s dim">{entry.note}</div>}
                  </div>
                  {entry.needsKey && (
                    <button
                      className="btn tiny"
                      onClick={(e) => {
                        e.stopPropagation();
                        setState({ modal: 'key', keyProvider: entry.id });
                      }}
                    >
                      {ready ? 'Replace' : 'Add key'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {PROVIDERS.some((p) => !p.browserOk) && isWeb && (
            <div className="desc">Ollama is hidden here because a web page cannot reach your local machine. It works in the desktop app.</div>
          )}
        </div>

        {provider.id === 'custom' && (
          <div className="field">
            <label>Endpoint URL</label>
            <input
              type="text"
              defaultValue={settings.customEndpoint}
              placeholder="http://localhost:1234/v1/chat/completions"
              onBlur={(e) => updateSettings({ customEndpoint: e.target.value.trim() })}
            />
            <div className="desc">The full chat-completions URL of any OpenAI-compatible server.</div>
          </div>
        )}

        <div className="field">
          <label>Model</label>
          <select value={settings.model} onChange={(e) => updateSettings({ model: e.target.value })}>
            {provider.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.label}
                {model.blurb ? ` — ${model.blurb}` : ''}
              </option>
            ))}
            {!provider.models.some((m) => m.id === settings.model) && (
              <option value={settings.model}>{settings.model} (custom)</option>
            )}
          </select>
          {provider.allowCustomModel && (
            <>
              <input
                type="text"
                style={{ marginTop: 7 }}
                placeholder="…or type any model id this provider supports"
                defaultValue=""
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) void updateSettings({ model: value });
                  }
                }}
              />
              <div className="desc">Press enter to use a model that is not in the list.</div>
            </>
          )}
        </div>

        {provider.wire === 'anthropic' && (
          <div className="field">
            <label>Thinking effort</label>
            <select value={settings.effort} onChange={(e) => updateSettings({ effort: e.target.value as Effort })}>
              {EFFORTS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label>Account</label>
          <div className="opts">
            <div className="opt" style={{ cursor: 'default' }}>
              <Cloud size={17} />
              <div style={{ flex: 1 }}>
                <div className="t">{account ? account.username : 'Not signed in'}</div>
                <div className="s">
                  {account
                    ? 'Free AI is enabled and your projects sync between the web app and the desktop app.'
                    : 'Sign in free to use the free AI and to carry projects between the browser and the desktop app.'}
                </div>
              </div>
              <button className="btn tiny" onClick={() => (account ? signOut() : void signIn())}>
                {account ? 'Sign out' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Behaviour</label>
          <div className="opts">
            <Toggle
              on={settings.approvalMode === 'autopilot'}
              label="Autopilot"
              desc="Let it write files and run commands without asking each time. Everything is still rewindable."
              onChange={(v) => updateSettings({ approvalMode: v ? 'autopilot' : 'ask' })}
            />
            <Toggle
              on={settings.showThinking}
              label="Show the thought process"
              desc="Stream the reasoning into the chat when the model provides it."
              onChange={(v) => updateSettings({ showThinking: v })}
            />
          </div>
        </div>

        <div className="field">
          <label>Standing instructions</label>
          <textarea
            value={instructions}
            placeholder={'e.g. "Always use plain HTML and CSS." · "Comment sparingly." · "Dark theme by default."'}
            onChange={(e) => setInstructions(e.target.value)}
            onBlur={() => updateSettings({ customInstructions: instructions })}
          />
          <div className="desc">Added to every request, so you never repeat yourself.</div>
        </div>

        {settings.alwaysAllow.length > 0 && (
          <div className="field">
            <label>Always allowed</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {settings.alwaysAllow.map((tool) => (
                <button
                  key={tool}
                  className="idea"
                  onClick={() => updateSettings({ alwaysAllow: settings.alwaysAllow.filter((t) => t !== tool) })}
                >
                  {tool} ×
                </button>
              ))}
            </div>
            <div className="desc">Click to revoke.</div>
          </div>
        )}
      </div>

      <footer>
        <button className="btn primary" onClick={onClose}>
          Done
        </button>
      </footer>
    </Scrim>
  );
}

/* ---------------------------------------------------------------- projects */

function ProjectsModal({ onClose }: { onClose: () => void }) {
  const projects = useStore((s) => s.projects);
  const current = useStore((s) => s.project);
  const [name, setName] = useState('');

  return (
    <Scrim onClose={onClose}>
      <header>
        Projects
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={onClose}>
          <X size={14} />
        </button>
      </header>
      <div className="content">
        <div className="field">
          <label>New project</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={name}
              placeholder="my-idea"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  void newProject(name.trim());
                  onClose();
                }
              }}
            />
            <button
              className="btn primary"
              disabled={!name.trim()}
              onClick={() => {
                void newProject(name.trim());
                onClose();
              }}
            >
              <Plus size={13} /> Create
            </button>
          </div>
          {!isWeb && (
            <button
              className="btn"
              style={{ marginTop: 8 }}
              onClick={() => {
                void chooseProjectFolder();
                onClose();
              }}
            >
              <Folder size={13} /> Open an existing folder
            </button>
          )}
        </div>

        <div className="field">
          <label>Your projects</label>
          {projects.length === 0 ? (
            <div className="desc" style={{ marginTop: 0 }}>Nothing yet — describe an idea and one gets made for you.</div>
          ) : (
            <div className="opts">
              {projects.map((project) => (
                <div key={project.id} className={`opt${current?.id === project.id ? ' on' : ''}`}>
                  <Folder size={16} />
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => {
                      void openProject(project.location);
                      onClose();
                    }}
                  >
                    <div className="t">{project.name}</div>
                    <div className="s" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isWeb ? 'Saved in this browser' : project.location}
                    </div>
                  </div>
                  {isWeb && (
                    <button
                      className="iconbtn"
                      title="Delete this project"
                      onClick={() => void deleteProject(project.location)}
                    >
                      <Trash size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </footer>
    </Scrim>
  );
}

/* ---------------------------------------------------------------- history */

function HistoryModal({ onClose }: { onClose: () => void }) {
  const checkpoints = useStore((s) => s.checkpoints);

  return (
    <Scrim onClose={onClose}>
      <header>
        History
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={onClose}>
          <X size={14} />
        </button>
      </header>
      <div className="content">
        <div className="field" style={{ margin: 0 }}>
          <div className="desc" style={{ marginTop: 0, marginBottom: 10 }}>
            Every message creates a checkpoint. Rewinding restores every file touched from that point onward — nothing
            else is affected.
          </div>
          {checkpoints.length === 0 ? (
            <div style={{ color: 'var(--faint)', fontSize: 12.5 }}>No file changes to rewind yet.</div>
          ) : (
            <div className="opts">
              {checkpoints.map((cp) => (
                <div className="checkpoint" key={cp.turnId}>
                  <div className="l">
                    <div>{cp.label}</div>
                    <div>
                      {new Date(cp.at).toLocaleTimeString()} · {cp.files} file{cp.files === 1 ? '' : 's'}
                    </div>
                  </div>
                  <button className="btn tiny" onClick={() => restoreCheckpoint(cp.turnId)}>
                    <Undo size={12} /> Rewind
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer>
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </footer>
    </Scrim>
  );
}

export function Modals() {
  const modal = useStore((s) => s.modal);
  const keyProvider = useStore((s) => s.keyProvider);
  const close = () => setState({ modal: null, keyProvider: null });

  if (modal === 'settings') return <SettingsModal onClose={close} />;
  if (modal === 'history') return <HistoryModal onClose={close} />;
  if (modal === 'projects') return <ProjectsModal onClose={close} />;
  if (modal === 'key') return <KeyModal providerId={keyProvider ?? 'anthropic'} onClose={close} />;
  return null;
}
