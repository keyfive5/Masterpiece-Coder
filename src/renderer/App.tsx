import React, { useEffect, useRef, useState } from 'react';
import { providerById } from '../core/providers';
import { boot, saveActive } from './actions';
import { isWeb } from './host';
import { setState, useStore } from './store';
import { TitleBar } from './components/TitleBar';
import { Explorer } from './components/Explorer';
import { EditorPane } from './components/EditorPane';
import { Chat } from './components/Chat';
import { Modals } from './components/Modals';
import { Launcher } from './components/Launcher';

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
      const grid = frame.current?.parentElement;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const raw = invert ? rect.right - e.clientX : e.clientX - rect.left;
      grid.style.setProperty(varName, `${Math.max(min, Math.min(max, raw))}px`);
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
  const project = useStore((s) => s.project);
  const busy = useStore((s) => s.busy);
  const usage = useStore((s) => s.usage);
  const settings = useStore((s) => s.settings);
  const account = useStore((s) => s.account);
  const active = useStore((s) => s.active);
  const changes = useStore((s) => s.changes.length);

  const provider = providerById(settings.provider);

  return (
    <div className="status">
      <span className={busy ? 'live' : ''}>{busy ? '● working' : '○ idle'}</span>
      <b>{settings.model}</b>
      <span>{provider.free ? 'free' : provider.label.toLowerCase()}</span>
      <span>{settings.approvalMode === 'autopilot' ? 'autopilot' : 'ask first'}</span>
      <div className="grow" />
      {active && <span>{active}</span>}
      {changes > 0 && <span>{changes} changed</span>}
      {usage.cost > 0 && <span>${usage.cost.toFixed(3)}</span>}
      {account && <span>☁ {account.username}</span>}
      <span>{isWeb ? 'web' : 'desktop'}</span>
      {project && <span title={project.location}>{project.name}</span>}
    </div>
  );
}

export function App() {
  const ready = useStore((s) => s.ready);
  const project = useStore((s) => s.project);
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
      if (e.key === 'Escape') setState({ modal: null, keyProvider: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!ready) return null;

  return (
    <div className={`app${isWeb ? ' web' : ''}`}>
      <TitleBar />

      {project ? (
        <div className="body" style={{ position: 'relative' }}>
          <Explorer />
          <EditorPane />
          <Chat />
          <Resizer varName="--explorer" fallback={248} min={170} max={420} side="left" />
          <Resizer varName="--chat" fallback={430} min={320} max={720} side="right" invert />
        </div>
      ) : (
        <Launcher />
      )}

      <StatusBar />
      <Modals />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
