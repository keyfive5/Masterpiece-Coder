import React, { useEffect, useRef, useState } from 'react';
import { FileNode } from '../../shared/types';
import { sendMessage, stopAgent, updateSettings } from '../actions';
import { host } from '../host';
import { getState, useStore } from '../store';
import { Send, Stop } from './Icons';

export function Composer() {
  const busy = useStore((s) => s.busy);
  const project = useStore((s) => s.project);
  const mode = useStore((s) => s.settings.approvalMode);

  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [mentions, setMentions] = useState<FileNode[] | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);

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

  const submit = () => {
    if (busy || !text.trim()) return;
    const payload = text;
    const files = attachments;
    setText('');
    setAttachments([]);
    setMentions(null);
    void sendMessage(payload, files);
  };

  // `@` opens a file picker so exact files can be pinned into the prompt.
  const onChange = async (value: string) => {
    setText(value);
    const match = value.match(/@([\w./-]*)$/);
    const current = getState().project;
    if (!match || !current) {
      setMentions(null);
      return;
    }
    const workspace = host.workspace(current);
    const query = match[1].toLowerCase();
    const files = await workspace.walk();
    setMentions(
      files
        .filter((f) => f.toLowerCase().includes(query))
        .slice(0, 6)
        .map((f) => ({ name: f.split('/').pop() ?? f, path: f, dir: false })),
    );
  };

  const pick = (node: FileNode) => {
    setText((current) => current.replace(/@([\w./-]*)$/, ''));
    setAttachments((current) => (current.includes(node.path) ? current : [...current, node.path]));
    setMentions(null);
    box.current?.focus();
  };

  return (
    <div className="composer">
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
          placeholder={project ? 'What next?  (@ to attach a file)' : 'Describe what you want built…'}
          onChange={(e) => void onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          spellCheck={false}
        />
        <div className="composer-bar">
          <div className="seg" title="How much freedom the agent has">
            <button className={mode === 'ask' ? 'on' : ''} onClick={() => updateSettings({ approvalMode: 'ask' })} disabled={busy}>
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
          <span className="hint">⏎ send</span>
          {busy ? (
            <button className="btn danger" onClick={stopAgent}>
              <Stop size={12} /> Stop
            </button>
          ) : (
            <button className="btn primary" onClick={submit} disabled={!text.trim()}>
              <Send size={13} /> Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
