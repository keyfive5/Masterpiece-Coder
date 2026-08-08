import React, { useEffect, useRef, useState } from 'react';
import { sendMessage, stopAgent, updateSettings } from '../actions';
import { useStore } from '../store';
import { api } from '../api';
import { FileNode } from '../../shared/types';
import { Send, Stop } from './Icons';

const STARTERS = [
  'Build a landing page for a coffee roaster',
  'Make a snake game I can play in the browser',
  'Add dark mode to this project',
  'Explain what this codebase does',
];

export function Composer() {
  const busy = useStore((s) => s.busy);
  const workspace = useStore((s) => s.workspace);
  const chatEmpty = useStore((s) => s.chat.length === 0);
  const mode = useStore((s) => s.settings.approvalMode);

  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [mentions, setMentions] = useState<FileNode[] | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its content, up to the CSS max-height.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [text]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        box.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = async () => {
    if (busy || !text.trim()) return;
    const payload = text;
    const files = attachments;
    setText('');
    setAttachments([]);
    setMentions(null);
    await sendMessage(payload, files);
  };

  // `@` opens a file picker so the user can pin exact files into the prompt.
  const onChange = async (value: string) => {
    setText(value);
    const match = value.match(/@([\w./-]*)$/);
    if (!match) {
      setMentions(null);
      return;
    }
    const query = match[1].toLowerCase();
    const nodes = await api.readTree('');
    const flat: FileNode[] = [];
    for (const node of nodes) {
      if (!node.dir) flat.push(node);
      else flat.push(...(await api.readTree(node.path)).filter((n) => !n.dir));
    }
    setMentions(flat.filter((n) => n.path.toLowerCase().includes(query)).slice(0, 6));
  };

  const pick = (node: FileNode) => {
    setText((current) => current.replace(/@([\w./-]*)$/, ''));
    setAttachments((current) => (current.includes(node.path) ? current : [...current, node.path]));
    setMentions(null);
    box.current?.focus();
  };

  return (
    <div className="composer">
      {chatEmpty && workspace && (
        <div className="suggestions">
          {STARTERS.map((s) => (
            <button key={s} className="suggestion" onClick={() => setText(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {mentions && mentions.length > 0 && (
        <div className="suggestions">
          {mentions.map((node) => (
            <button key={node.path} className="suggestion" onClick={() => pick(node)}>
              @{node.path}
            </button>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="suggestions">
          {attachments.map((path) => (
            <button
              key={path}
              className="suggestion"
              title="Remove"
              onClick={() => setAttachments((c) => c.filter((p) => p !== path))}
            >
              @{path} ×
            </button>
          ))}
        </div>
      )}

      <div className="composer-box">
        <textarea
          ref={box}
          value={text}
          placeholder={workspace ? 'Describe what you want built…  (@ to attach a file)' : 'Open a project folder first'}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          spellCheck={false}
        />
        <div className="composer-bar">
          <div className="seg" title="How much freedom the agent has">
            <button
              className={mode === 'ask' ? 'on' : ''}
              onClick={() => updateSettings({ approvalMode: 'ask' })}
              disabled={busy}
            >
              Ask first
            </button>
            <button
              className={mode === 'autopilot' ? 'on' : ''}
              onClick={() => updateSettings({ approvalMode: 'autopilot' })}
              disabled={busy}
            >
              Autopilot
            </button>
          </div>
          <div className="grow" />
          <span className="hint">⏎ send · ⇧⏎ newline</span>
          {busy ? (
            <button className="btn danger" onClick={stopAgent}>
              <Stop size={12} /> Stop
            </button>
          ) : (
            <button className="btn primary" onClick={submit} disabled={!text.trim() || !workspace}>
              <Send size={13} /> Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
