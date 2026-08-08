import React, { useMemo } from 'react';
import { diffLines, hunkify } from '../../shared/diff';
import { revertChange } from '../actions';
import { setState, useStore } from '../store';
import { Undo, X } from './Icons';

export function DiffView() {
  const path = useStore((s) => s.diffPath);
  const change = useStore((s) => s.changes.find((c) => c.path === s.diffPath));

  const rows = useMemo(() => {
    if (!change) return [];
    return hunkify(diffLines(change.before ?? '', change.after ?? ''));
  }, [change]);

  if (!path || !change) {
    return (
      <div className="empty">
        <div>
          <h3>No changes yet</h3>
          <p>When the agent writes a file, its diff shows up here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="diff-head">
        <span className="path">{change.path}</span>
        <span className="stat-add">+{change.added}</span>
        <span className="stat-del">−{change.removed}</span>
        <div style={{ flex: 1 }} />
        <button className="btn tiny danger" onClick={() => revertChange(change.path, change.before)}>
          <Undo size={12} /> Undo this file
        </button>
        <button className="btn tiny ghost" onClick={() => setState({ center: 'editor' })} title="Back to the editor">
          <X size={12} />
        </button>
      </div>

      <div className="diff">
        {rows.map((row, i) =>
          row.op === 'gap' ? (
            <div className="diff-gap" key={i}>
              ⋯ {row.count} unchanged line{row.count === 1 ? '' : 's'}
            </div>
          ) : (
            <div className={`diff-line ${row.op}`} key={i}>
              <div className="gutter">
                <i>{row.a ?? ''}</i>
                <i>{row.b ?? ''}</i>
              </div>
              <div className="code">{row.text || ' '}</div>
            </div>
          ),
        )}
      </div>
    </>
  );
}
