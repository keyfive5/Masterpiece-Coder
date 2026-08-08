import React from 'react';
import { chooseWorkspace, openWorkspace } from '../actions';
import { setState, useStore } from '../store';
import { Folder, Sparkle } from './Icons';

export function Welcome() {
  const recent = useStore((s) => s.recent);
  const hasKey = useStore((s) => s.hasApiKey);

  return (
    <div className="welcome">
      <div className="welcome-inner">
        <div
          style={{
            width: 58,
            height: 58,
            margin: '0 auto 22px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            boxShadow: '0 0 60px var(--accent-glow)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', inset: 15, borderRadius: 6, background: '#0b0e14' }} />
        </div>

        <h1>Masterpiece Coder</h1>
        <p className="lead">Type an idea. Watch it become code.</p>

        <div className="cards">
          <div className="card" onClick={chooseWorkspace}>
            <Folder size={18} />
            <div style={{ flex: 1 }}>
              <div className="t">Open a project folder</div>
              <div className="s">An existing project, or an empty folder to start something new</div>
            </div>
          </div>

          {!hasKey && (
            <div className="card" onClick={() => setState({ modal: 'key' })}>
              <Sparkle size={18} />
              <div style={{ flex: 1 }}>
                <div className="t">Connect your Anthropic API key</div>
                <div className="s">Stored encrypted on this machine — needed before the agent can run</div>
              </div>
            </div>
          )}

          {recent.length > 0 && (
            <>
              <div
                style={{
                  marginTop: 14,
                  marginBottom: 2,
                  fontSize: 11,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: 'var(--faint)',
                  fontWeight: 600,
                }}
              >
                Recent
              </div>
              {recent.map((dir) => (
                <div className="card" key={dir} onClick={() => openWorkspace(dir)}>
                  <Folder size={16} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t">{dir.split(/[\\/]/).filter(Boolean).pop()}</div>
                    <div className="s">{dir}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
