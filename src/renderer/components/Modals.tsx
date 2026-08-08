import React, { useState } from 'react';
import { Effort, MODELS } from '../../shared/types';
import { api, isDemo } from '../api';
import { restoreCheckpoint, updateSettings } from '../actions';
import { setState, useStore } from '../store';
import { Undo, X } from './Icons';

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

function ApiKeyModal({ onDone }: { onDone: () => void }) {
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const ok = await api.setApiKey(key);
    setState({ hasApiKey: ok });
    setSaving(false);
    onDone();
  };

  return (
    <Scrim onClose={onDone}>
      <header>
        Connect your Anthropic API key
        <div style={{ flex: 1 }} />
        <button className="iconbtn" onClick={onDone}>
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
            placeholder="sk-ant-…"
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && key.trim() && save()}
          />
          <div className="desc">
            Stored encrypted on this machine and sent only to Anthropic. Get one at{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              onClick={(e) => {
                e.preventDefault();
                api.openExternal('https://console.anthropic.com/settings/keys');
              }}
              style={{ color: 'var(--accent-2)' }}
            >
              console.anthropic.com
            </a>
            . You pay Anthropic directly for what you use — this app adds nothing.
          </div>
        </div>
      </div>
      <footer>
        <button className="btn" onClick={onDone}>
          Cancel
        </button>
        <button className="btn primary" disabled={!key.trim() || saving} onClick={save}>
          {saving ? 'Saving…' : 'Save key'}
        </button>
      </footer>
    </Scrim>
  );
}

const EFFORTS: { id: Effort; label: string; desc: string }[] = [
  { id: 'low', label: 'Low', desc: 'Quick and cheap. Small, well-defined edits.' },
  { id: 'medium', label: 'Medium', desc: 'A good balance for everyday work.' },
  { id: 'high', label: 'High', desc: 'The default. Thinks things through.' },
  { id: 'xhigh', label: 'Extra high', desc: 'Best for hard, multi-file builds.' },
  { id: 'max', label: 'Max', desc: 'No ceiling. Slowest and priciest.' },
];

function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = useStore((s) => s.settings);
  const hasKey = useStore((s) => s.hasApiKey);
  const [instructions, setInstructions] = useState(settings.customInstructions);

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
          <label>Model</label>
          <div className="opts">
            {MODELS.map((model) => (
              <div
                key={model.id}
                className={`opt${settings.model === model.id ? ' on' : ''}`}
                onClick={() => updateSettings({ model: model.id })}
              >
                <div className="radio" />
                <div style={{ flex: 1 }}>
                  <div className="t">
                    {model.label}
                    <span style={{ color: 'var(--faint)', fontWeight: 400, fontSize: 11.5, marginLeft: 8 }}>
                      ${model.inputPrice}/${model.outputPrice} per million tokens
                    </span>
                  </div>
                  <div className="s">{model.blurb}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Thinking effort</label>
          <select value={settings.effort} onChange={(e) => updateSettings({ effort: e.target.value as Effort })}>
            {EFFORTS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label} — {e.desc}
              </option>
            ))}
          </select>
          <div className="desc">Higher effort means deeper reasoning and more tool calls, at more cost and latency.</div>
        </div>

        <div className="field">
          <label>Behaviour</label>
          <div className="opts">
            <Toggle
              on={settings.showThinking}
              label="Show the thought process"
              desc="Stream the model's reasoning summary into the chat."
              onChange={(v) => updateSettings({ showThinking: v })}
            />
            <Toggle
              on={settings.approvalMode === 'autopilot'}
              label="Autopilot"
              desc="Let the agent write files and run commands without asking each time."
              onChange={(v) => updateSettings({ approvalMode: v ? 'autopilot' : 'ask' })}
            />
            <Toggle
              on={settings.serverFallbacks}
              label="Automatic model fallback"
              desc="If a request is declined by safety filters, retry it on another Claude model."
              onChange={(v) => updateSettings({ serverFallbacks: v })}
            />
          </div>
        </div>

        <div className="field">
          <label>Standing instructions</label>
          <textarea
            value={instructions}
            placeholder={'e.g. "Always use TypeScript." · "Never add a build step." · "Comment sparingly."'}
            onChange={(e) => setInstructions(e.target.value)}
            onBlur={() => updateSettings({ customInstructions: instructions })}
          />
          <div className="desc">Added to every request, so you do not have to repeat yourself.</div>
        </div>

        {settings.alwaysAllow.length > 0 && (
          <div className="field">
            <label>Always allowed</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {settings.alwaysAllow.map((tool) => (
                <button
                  key={tool}
                  className="suggestion"
                  onClick={() => updateSettings({ alwaysAllow: settings.alwaysAllow.filter((t) => t !== tool) })}
                >
                  {tool} ×
                </button>
              ))}
            </div>
            <div className="desc">Click to revoke.</div>
          </div>
        )}

        <div className="field">
          <label>API key</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: hasKey ? 'var(--green)' : 'var(--amber)', fontSize: 12.5 }}>
              {hasKey ? 'Connected' : 'Not set'}
            </span>
            <div style={{ flex: 1 }} />
            <button className="btn" onClick={() => setState({ modal: 'key' })}>
              {hasKey ? 'Replace' : 'Add key'}
            </button>
            {hasKey && !isDemo && (
              <button
                className="btn danger"
                onClick={async () => {
                  await api.clearApiKey();
                  setState({ hasApiKey: false });
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <footer>
        <button className="btn primary" onClick={onClose}>
          Done
        </button>
      </footer>
    </Scrim>
  );
}

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
            Every message the agent acts on creates a checkpoint. Rewinding restores every file it touched from that
            point onward — nothing else on your computer is affected.
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
                    <Undo size={12} /> Rewind to here
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
  const close = () => setState({ modal: null });

  if (modal === 'settings') return <SettingsModal onClose={close} />;
  if (modal === 'history') return <HistoryModal onClose={close} />;
  if (modal === 'key') return <ApiKeyModal onDone={close} />;
  return null;
}
