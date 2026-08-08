import React, { useEffect, useRef, useState } from 'react';
import { ChatItem, setState, useStore } from '../store';
import { approve, openFile } from '../actions';
import { Markdown } from './Markdown';
import { Composer } from './Composer';
import { Brain, Check, Chevron, Sparkle, X } from './Icons';

const TOOL_LABEL: Record<string, string> = {
  read_file: 'Read',
  write_file: 'Write',
  edit_file: 'Edit',
  delete_file: 'Delete',
  list_files: 'List',
  find_files: 'Find',
  search_code: 'Search',
  run_command: 'Run',
  update_plan: 'Plan',
};

function Thinking({ item }: { item: Extract<ChatItem, { kind: 'thinking' }> }) {
  const show = useStore((s) => s.settings.showThinking);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (item.done) setOpen(false);
  }, [item.done]);

  if (!show) return null;

  return (
    <div className="thinking">
      <div className="thinking-head" onClick={() => setOpen((v) => !v)}>
        <Chevron size={11} className={`chev${open ? ' open' : ''}`} />
        <Brain size={12} />
        {item.done ? <span>Thought process</span> : <span className="shimmer">Thinking…</span>}
      </div>
      {open && item.text && <div className="thinking-body">{item.text}</div>}
    </div>
  );
}

function ToolCard({ item }: { item: Extract<ChatItem, { kind: 'tool' }> }) {
  const [open, setOpen] = useState(false);
  const label = TOOL_LABEL[item.name] ?? item.name;
  const target =
    typeof item.input?.path === 'string'
      ? item.input.path
      : typeof item.input?.command === 'string'
        ? item.input.command
        : typeof item.input?.pattern === 'string'
          ? item.input.pattern
          : '';

  const clickable = item.name === 'write_file' || item.name === 'edit_file';

  return (
    <div className="tool">
      <div className="tool-head" onClick={() => item.detail && setOpen((v) => !v)}>
        {item.status === 'running' ? (
          <div className="spin" />
        ) : (
          <span className={`pill ${item.status}`}>
            {item.status === 'ok' ? <Check size={12} /> : item.status === 'rejected' ? '⃠' : <X size={12} />}
          </span>
        )}
        <span className="tool-name">{label}</span>
        <span
          className="tool-sum"
          onClick={(e) => {
            if (!clickable || !item.input?.path) return;
            e.stopPropagation();
            void openFile(String(item.input.path), 'diff');
          }}
          style={clickable ? { cursor: 'pointer', color: 'var(--accent-2)' } : undefined}
        >
          {item.summary || target}
        </span>
        {item.detail && <Chevron size={11} className={`chev${open ? ' open' : ''}`} />}
      </div>
      {open && item.detail && <div className="tool-body">{item.detail}</div>}
    </div>
  );
}

function Approval({ item }: { item: Extract<ChatItem, { kind: 'approval' }> }) {
  if (item.resolved !== null) {
    return (
      <div className="approval done">
        <div className="title">{item.title}</div>
        <div className="why">{item.resolved ? 'Approved' : 'Declined'}</div>
      </div>
    );
  }

  return (
    <div className="approval">
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <Sparkle size={13} />
        <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          Permission needed
        </span>
      </div>
      <div className="title">{item.title}</div>
      {item.detail && <div className="why">{item.detail}</div>}
      <div className="acts">
        <button className="btn primary tiny" onClick={() => approve(item.id, true, false)}>
          Allow once
        </button>
        <button className="btn tiny" onClick={() => approve(item.id, true, true)}>
          Always allow {TOOL_LABEL[item.tool] ?? item.tool}
        </button>
        <button className="btn tiny danger" onClick={() => approve(item.id, false, false)}>
          Decline
        </button>
      </div>
    </div>
  );
}

function Plan() {
  const todos = useStore((s) => s.todos);
  const [open, setOpen] = useState(true);
  if (todos.length === 0) return null;
  const done = todos.filter((t) => t.status === 'done').length;

  return (
    <div className="plan">
      <div className="plan-head" onClick={() => setOpen((v) => !v)}>
        <Chevron size={11} className={`chev${open ? ' open' : ''}`} />
        Plan
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--mono)', letterSpacing: 0 }}>
          {done}/{todos.length}
        </span>
      </div>
      {open && (
        <div className="plan-list">
          {todos.map((todo, i) => (
            <div key={i} className={`plan-item ${todo.status}`}>
              <span className="plan-box">{todo.status === 'done' ? '✓' : ''}</span>
              <span>{todo.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Item({ item }: { item: ChatItem }) {
  switch (item.kind) {
    case 'user':
      return (
        <div className="msg-user">
          {item.text}
          {item.attachments.length > 0 && (
            <div className="chips">
              {item.attachments.map((a) => (
                <span className="chip" key={a}>
                  @{a}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    case 'thinking':
      return <Thinking item={item} />;
    case 'text':
      return item.text ? (
        <div className="msg-text">
          <Markdown text={item.text} />
        </div>
      ) : null;
    case 'tool':
      return <ToolCard item={item} />;
    case 'approval':
      return <Approval item={item} />;
    case 'notice':
      return (
        <div className={`notice ${item.level}`}>
          <span>{item.level === 'error' ? '⚠' : item.level === 'warn' ? '!' : 'i'}</span>
          <span>{item.message}</span>
        </div>
      );
    default:
      return null;
  }
}

function Empty() {
  const workspace = useStore((s) => s.workspace);
  return (
    <div style={{ margin: 'auto', textAlign: 'center', padding: '30px 16px', color: 'var(--faint)' }}>
      <div
        style={{
          width: 44,
          height: 44,
          margin: '0 auto 14px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          boxShadow: '0 0 34px var(--accent-glow)',
        }}
      />
      <div style={{ color: 'var(--text)', fontSize: 15.5, fontWeight: 600, marginBottom: 5 }}>
        {workspace ? 'What should we build?' : 'Open a folder to begin'}
      </div>
      <div style={{ fontSize: 12.5, maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>
        Describe it in plain language. The agent reads your project, plans, writes the files and checks its own work.
      </div>
    </div>
  );
}

export function Chat() {
  const chat = useStore((s) => s.chat);
  const busy = useStore((s) => s.busy);
  const usage = useStore((s) => s.usage);
  const scroller = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);

  useEffect(() => {
    const el = scroller.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  });

  return (
    <div className="pane">
      <div className="pane-head">
        Agent
        <div className="grow" />
        {usage.cost > 0 && <span style={{ fontFamily: 'var(--mono)', letterSpacing: 0 }}>${usage.cost.toFixed(3)}</span>}
      </div>

      <div
        className="chat"
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
        }}
      >
        {chat.length === 0 ? <Empty /> : chat.map((item) => <Item key={item.id} item={item} />)}
        {busy && chat.length > 0 && chat[chat.length - 1].kind === 'tool' && (
          <div style={{ color: 'var(--faint)', fontSize: 12, paddingLeft: 4 }}>
            <span className="shimmer">Working…</span>
          </div>
        )}
      </div>

      <Plan />
      <Composer />
    </div>
  );
}

export { setState };
