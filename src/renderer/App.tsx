import React, { useEffect, useRef, useState } from 'react';
import { boot, saveActive } from './actions';
import { setState, useStore } from './store';
import { isDemo } from './api';
import { TitleBar } from './components/TitleBar';
import { Explorer } from './components/Explorer';
import { EditorPane } from './components/EditorPane';
import { Chat } from './components/Chat';
import { Modals } from './components/Modals';
import { Welcome } from './components/Welcome';

/** Drag handle between two panes; writes a CSS custom property on the grid. */
function Resizer({
  varName,
  fallback,
  min,
  max,
  invert,
  side,
}: {
  varName: string;
  fallback: number;
  min: number;
  max: number;
  invert?: boolean;
  side: 'left' | 'right';
}) {
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const host = frame.current?.parentElement;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const raw = invert ? rect.right - e.clientX : e.clientX - rect.left;
      host.style.setProperty(varName, `${Math.max(min, Math.min(max, raw))}px`);
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, invert, max, min, varName]);

  return (
    <div
      ref={frame}
      className={`resizer${dragging ? ' active' : ''}`}
      style={
        side === 'left'
          ? { left: `calc(var(${varName}, ${fallback}px) - 3px)` }
          : { right: `calc(var(${varName}, ${fallback}px) - 3px)` }
      }
      onMouseDown={() => setDragging(true)}
    />
  );
}

function StatusBar() {
  const workspace = useStore((s) => s.workspace);
  const busy = useStore((s) => s.busy);
  const usage = useStore((s) => s.usage);
  const settings = useStore((s) => s.settings);
  const active = useStore((s) => s.active);
  const changes = useStore((s) => s.changes.length);

  return (
    <div className="status">
      <span className={busy ? 'live' : ''}>{busy ? '● working' : '○ idle'}</span>
      <b>{settings.model}</b>
      <span>effort: {settings.effort}</span>
      <span>{settings.approvalMode === 'autopilot' ? 'autopilot' : 'ask first'}</span>
      <div className="grow" />
      {active && <span>{active}</span>}
      {changes > 0 && <span>{changes} changed</span>}
      {usage.input + usage.output > 0 && (
        <span>
          {(usage.input / 1000).toFixed(1)}k in · {(usage.output / 1000).toFixed(1)}k out · ${usage.cost.toFixed(3)}
        </span>
      )}
      <span title={workspace ?? ''}>{workspace ?? 'no folder'}</span>
    </div>
  );
}

export function App() {
  const ready = useStore((s) => s.ready);
  const workspace = useStore((s) => s.workspace);
  const toast = useStore((s) => s.toast);

  useEffect(() => {
    void boot();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void saveActive();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setState({ modal: 'settings' });
      }
      if (e.key === 'Escape') setState({ modal: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!ready) return null;

  return (
    <div className="app">
      <TitleBar />

      {workspace ? (
        <div className="body" style={{ position: 'relative' }}>
          <Explorer />
          <EditorPane />
          <Chat />
          <Resizer varName="--explorer" fallback={248} min={170} max={420} side="left" />
          <Resizer varName="--chat" fallback={430} min={320} max={720} side="right" invert />
        </div>
      ) : (
        <Welcome />
      )}

      <StatusBar />
      <Modals />
      {toast && <div className="toast">{toast}</div>}
      {isDemo && (
        <div
          style={{
            position: 'fixed',
            top: 48,
            right: 14,
            zIndex: 90,
            padding: '5px 11px',
            borderRadius: 999,
            background: 'rgba(124,140,255,0.16)',
            border: '1px solid rgba(124,140,255,0.4)',
            fontSize: 11.5,
            color: '#c3caff',
          }}
        >
          Demo mode — scripted run, no API key used
        </div>
      )}
    </div>
  );
}
