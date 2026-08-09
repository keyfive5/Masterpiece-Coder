import React, { useEffect, useRef, useState } from 'react';
import { providerById } from '../../core/providers';
import { chooseProjectFolder, openProject, sendMessage } from '../actions';
import { host, isWeb } from '../host';
import { setState, useStore } from '../store';
import { Folder, Send, Sparkle } from './Icons';

const IDEAS = [
  'a snake game I can play with arrow keys',
  'a landing page for a coffee roaster',
  'a pomodoro timer with a circular progress ring',
  'a tip calculator that splits the bill',
  'a synthesizer I can play with my keyboard',
  'a markdown notes app that saves to my browser',
  'a solar system I can orbit around',
  'a habit tracker with a streak counter',
];

/**
 * The first thing anyone sees: one box. Typing into it and pressing enter
 * creates a project and starts building — no folder picker, no API key.
 */
export function Launcher() {
  const projects = useStore((s) => s.projects);
  const settings = useStore((s) => s.settings);
  const account = useStore((s) => s.account);

  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState(IDEAS[0]);
  const box = useRef<HTMLTextAreaElement>(null);

  const provider = providerById(settings.provider);

  useEffect(() => {
    box.current?.focus();
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % IDEAS.length;
      setPlaceholder(IDEAS[i]);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  const go = (prompt: string) => {
    const value = prompt.trim();
    if (!value) return;
    void sendMessage(value);
  };

  return (
    <div className="launcher">
      <div className="launcher-inner">
        <div className="launcher-mark" />
        <h1>What do you want to build?</h1>
        <p className="lead">
          Describe it in a sentence. It gets built here, in front of you — files, code and all.
        </p>

        <div className="launcher-box">
          <textarea
            ref={box}
            value={text}
            placeholder={`Make me ${placeholder}…`}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                go(text);
              }
            }}
            spellCheck={false}
            rows={2}
          />
          <div className="launcher-bar">
            <button
              className="chip-btn"
              onClick={() => setState({ modal: 'settings' })}
              title="Choose which AI builds this"
            >
              <Sparkle size={12} />
              {provider.free ? 'Free' : provider.label}
              <span className="chip-sub">{settings.model}</span>
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={() => go(text)} disabled={!text.trim()}>
              <Send size={13} /> Build it
            </button>
          </div>
        </div>

        <div className="launcher-note">
          {provider.free && !provider.needsKey ? (
            account ? (
              <>
                Signed in as <b>{account.username}</b> — free, and your projects sync across the web app and the
                desktop app.
              </>
            ) : (
              <>No API key needed. You will be asked to sign in once, free, when the first build starts.</>
            )
          ) : (
            <>
              Using <b>{provider.label}</b>{provider.needsKey ? ' with your own key' : ''}. Switch to the free option
              any time in settings.
            </>
          )}
        </div>

        <div className="ideas">
          {IDEAS.slice(0, 4).map((idea) => (
            <button key={idea} className="idea" onClick={() => go(`Make me ${idea}`)}>
              {idea}
            </button>
          ))}
        </div>

        {(projects.length > 0 || !isWeb) && (
          <div className="launcher-recent">
            <div className="launcher-recent-head">
              {projects.length > 0 ? 'Or pick up where you left off' : 'Already have a project?'}
              <div style={{ flex: 1 }} />
              {!isWeb && (
                <button className="btn tiny ghost" onClick={chooseProjectFolder}>
                  <Folder size={12} /> Open a folder
                </button>
              )}
            </div>
            {projects.slice(0, 5).map((project) => (
              <button key={project.id} className="card" onClick={() => void openProject(project.location)}>
                <Folder size={16} />
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div className="t">{project.name}</div>
                  <div className="s">{host.kind === 'web' ? 'Saved in this browser' : project.location}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
