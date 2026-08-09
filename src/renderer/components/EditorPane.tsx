import React, { useEffect, useRef } from 'react';
import { EDITOR_OPTIONS, monaco } from '../monaco';
import { closeTab, editFile, openFile, openPreview, saveActive } from '../actions';
import { setState, useStore } from '../store';
import { host } from '../host';
import { DiffView } from './DiffView';
import { Code, Diff, External, Eye, Play, Refresh, Save, Terminal, X } from './Icons';

/**
 * The Monaco host stays mounted for the life of the pane — it is only hidden
 * when another view is showing. Tearing it down on every view switch would
 * throw away each tab's undo history and cursor, and remounting is expensive.
 */
function CodeEditor({ visible }: { visible: boolean }) {
  const active = useStore((s) => s.active);
  const file = useStore((s) => (s.active ? s.files[s.active] : null));
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const models = useRef(new Map<string, monaco.editor.ITextModel>());
  const applying = useRef(false);

  useEffect(() => {
    if (!host.current) return;
    const instance = monaco.editor.create(host.current, EDITOR_OPTIONS);
    editor.current = instance;

    instance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => void saveActive());

    return () => {
      instance.dispose();
      for (const model of models.current.values()) model.dispose();
      models.current.clear();
      editor.current = null;
    };
  }, []);

  // Swap the model whenever the active tab changes; each tab keeps its own
  // undo history and cursor position because the model is reused.
  useEffect(() => {
    const instance = editor.current;
    if (!instance || !active || !file) return;

    let model = models.current.get(active);
    if (!model) {
      model = monaco.editor.createModel(file.content, file.language);
      models.current.set(active, model);
      model.onDidChangeContent(() => {
        if (applying.current) return;
        editFile(active, model!.getValue());
      });
    }
    if (instance.getModel() !== model) instance.setModel(model);
    instance.focus();
  }, [active, file?.language]);

  // The agent can rewrite a file that is open — push that in without clobbering
  // the user's cursor.
  useEffect(() => {
    const instance = editor.current;
    if (!instance || !active || !file) return;
    const model = models.current.get(active);
    if (!model || model.getValue() === file.content) return;
    applying.current = true;
    const position = instance.getPosition();
    model.pushEditOperations([], [{ range: model.getFullModelRange(), text: file.content }], () => null);
    if (position) instance.setPosition(position);
    applying.current = false;
  }, [active, file?.content]);

  // Drop models for closed tabs.
  const tabs = useStore((s) => s.tabs);
  useEffect(() => {
    for (const [path, model] of models.current) {
      if (!tabs.includes(path)) {
        model.dispose();
        models.current.delete(path);
      }
    }
  }, [tabs]);

  // Re-measure when the editor comes back into view; while hidden it has no size.
  useEffect(() => {
    if (visible) editor.current?.layout();
  }, [visible]);

  const showCode = Boolean(active && file && !file.binary);

  return (
    <>
      <div className="editor-wrap" ref={host} style={{ display: visible && showCode ? 'block' : 'none' }} />

      {visible && !showCode && (
        <div className="empty">
          {file?.binary ? (
            <div>
              <h3>{active}</h3>
              <p>This is a binary file, so there is nothing to show as text.</p>
            </div>
          ) : (
            <div>
              <h3>Nothing open</h3>
              <p>Pick a file from the explorer, or describe what you want built and watch the files appear.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function PreviewPane() {
  const preview = useStore((s) => s.preview);
  const frame = useRef<HTMLIFrameElement>(null);

  if (!preview || preview.error) {
    return (
      <div className="empty">
        <div>
          <h3>Preview</h3>
          <p>{preview?.error ?? 'Shows the project running. Press the button to build it.'}</p>
          <button className="btn primary" style={{ marginTop: 14 }} onClick={() => void openPreview()}>
            <Eye size={13} /> {preview?.error ? 'Try again' : 'Start preview'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="diff-head">
        <span className="path">{preview.url ?? 'Live preview'}</span>
        <div style={{ flex: 1 }} />
        <button className="btn tiny" onClick={() => void openPreview()}>
          <Refresh size={12} /> Reload
        </button>
        {preview.url && (
          <button className="btn tiny" onClick={() => host.openExternal(preview.url!)}>
            <External size={12} /> Browser
          </button>
        )}
      </div>
      <iframe
        ref={frame}
        className="preview-frame"
        {...(preview.url ? { src: preview.url } : { srcDoc: preview.srcdoc })}
        sandbox="allow-scripts allow-modals allow-forms allow-popups"
        title="Project preview"
      />
    </>
  );
}

function OutputPanel() {
  const output = useStore((s) => s.output);
  const open = useStore((s) => s.outputOpen);
  const body = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [output]);

  if (!open || !output) return null;

  return (
    <div className="output">
      <div className="pane-head">
        <Terminal size={12} /> Output
        <div className="grow" />
        <button className="iconbtn" onClick={() => setState({ output: '' })} title="Clear">
          <Refresh size={12} />
        </button>
        <button className="iconbtn" onClick={() => setState({ outputOpen: false })} title="Hide">
          <X size={12} />
        </button>
      </div>
      <pre ref={body}>{output}</pre>
    </div>
  );
}

export function EditorPane() {
  const tabs = useStore((s) => s.tabs);
  const active = useStore((s) => s.active);
  const center = useStore((s) => s.center);
  const files = useStore((s) => s.files);
  const dirty = active ? (files[active]?.dirty ?? false) : false;
  const changeCount = useStore((s) => s.changes.length);
  const hasOutput = useStore((s) => s.output.length > 0);

  return (
    <div className="pane" style={{ position: 'relative' }}>
      <div className="tabs">
        {tabs.map((path) => (
          <div
            key={path}
            className={`tab${active === path && center === 'editor' ? ' on' : ''}`}
            onClick={() => openFile(path)}
          >
            <span>{path.split('/').pop()}</span>
            {files[path]?.dirty && <span className="pip" />}
            <span
              className="x"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(path);
              }}
            >
              ×
            </span>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
          {dirty && (
            <button className="btn tiny" onClick={saveActive} title="Ctrl+S">
              <Save size={12} /> Save
            </button>
          )}
          <div className="seg">
            <button className={center === 'editor' ? 'on' : ''} onClick={() => setState({ center: 'editor' })}>
              <Code size={11} /> Code
            </button>
            <button className={center === 'diff' ? 'on' : ''} onClick={() => setState({ center: 'diff' })}>
              <Diff size={11} /> Diff{changeCount > 0 ? ` ${changeCount}` : ''}
            </button>
            <button className={center === 'preview' ? 'on' : ''} onClick={() => void openPreview()}>
              <Play size={11} /> Play
            </button>
          </div>
          {hasOutput && (
            <button className="iconbtn" title="Show command output" onClick={() => setState({ outputOpen: true })}>
              <Terminal size={13} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <CodeEditor visible={center === 'editor'} />
        {center === 'diff' && <DiffView />}
        {center === 'preview' && <PreviewPane />}
      </div>

      <OutputPanel />
    </div>
  );
}
