import React from 'react';
import { FileNode } from '../../shared/types';
import { openFile, refreshTree, toggleDir } from '../actions';
import { setState, useStore } from '../store';
import { Chevron, Diff, Refresh, Undo } from './Icons';
import { revertChange } from '../actions';

/** Stable empty array — a fresh `[]` in a selector re-triggers useSyncExternalStore forever. */
const NONE: FileNode[] = [];

const COLORS: Record<string, string> = {
  ts: '#5aa9f8',
  tsx: '#5aa9f8',
  js: '#f0c33c',
  jsx: '#f0c33c',
  json: '#f0c33c',
  html: '#ff8a5b',
  css: '#7c8cff',
  scss: '#ff7bb0',
  md: '#8b94a8',
  py: '#4fd6a0',
  go: '#48d8e6',
  rs: '#ff9a62',
  java: '#ff6b6b',
  svg: '#b98cff',
};

function badge(name: string): { text: string; color: string } {
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : '';
  return { text: (ext || '·').slice(0, 3), color: COLORS[ext] ?? '#5b6478' };
}

function Node({ node, depth }: { node: FileNode; depth: number }) {
  const expanded = useStore((s) => s.expanded.includes(node.path));
  const children = useStore((s) => s.tree[node.path]);
  const active = useStore((s) => s.active === node.path);
  const changed = useStore((s) => s.changes.some((c) => c.path === node.path));

  const mark = badge(node.name);

  return (
    <>
      <div
        className={`row${active ? ' on' : ''}`}
        style={{ paddingLeft: 6 + depth * 12 }}
        onClick={() => (node.dir ? toggleDir(node.path) : openFile(node.path))}
        title={node.path}
      >
        {node.dir ? (
          <Chevron size={12} className={`chev${expanded ? ' open' : ''}`} />
        ) : (
          <span className="filetype" style={{ color: mark.color }}>
            {mark.text}
          </span>
        )}
        <span className="name">{node.name}</span>
        {changed && <span className="dot changed" />}
      </div>

      {node.dir && expanded && (children ?? NONE).map((child) => <Node key={child.path} node={child} depth={depth + 1} />)}
    </>
  );
}

function ChangeList() {
  const changes = useStore((s) => s.changes);
  if (changes.length === 0) return null;

  return (
    <div className="changes">
      <div className="pane-head" style={{ borderTop: '1px solid var(--line-soft)', borderBottom: 'none' }}>
        Changed this session
        <div className="grow" />
        <span style={{ fontFamily: 'var(--mono)', letterSpacing: 0 }}>{changes.length}</span>
      </div>
      {changes.map((change) => (
        <div
          key={change.path}
          className="change-row"
          onClick={() => setState({ diffPath: change.path, center: 'diff' })}
          title={`Open the diff for ${change.path}`}
        >
          <Diff size={12} />
          <span className="p">{change.path}</span>
          <span className="stat-add">+{change.added}</span>
          <span className="stat-del">−{change.removed}</span>
          <button
            className="iconbtn"
            title="Undo this file"
            onClick={(e) => {
              e.stopPropagation();
              void revertChange(change.path, change.before);
            }}
          >
            <Undo size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Explorer() {
  const roots = useStore((s) => s.tree[''] ?? NONE);
  const workspace = useStore((s) => s.workspace);

  return (
    <div className="pane">
      <div className="pane-head">
        Explorer
        <div className="grow" />
        <button className="iconbtn" title="Refresh" onClick={() => refreshTree()}>
          <Refresh size={13} />
        </button>
      </div>

      <div className="tree">
        {!workspace && <div style={{ padding: 14, color: 'var(--faint)', fontSize: 12 }}>No folder open.</div>}
        {roots.map((node) => (
          <Node key={node.path} node={node} depth={0} />
        ))}
      </div>

      <ChangeList />
    </div>
  );
}
