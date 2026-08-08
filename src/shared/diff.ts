/** Minimal line diff (LCS) used for change summaries and inline diff cards. */

export type DiffOp = 'same' | 'add' | 'del';

export interface DiffLine {
  op: DiffOp;
  text: string;
  a: number | null; // 1-based line number in the "before" text
  b: number | null; // 1-based line number in the "after" text
}

function splitLines(text: string): string[] {
  if (text === '') return [];
  return text.replace(/\r\n/g, '\n').split('\n');
}

/**
 * Classic dynamic-programming LCS. Files are capped so a huge rewrite can never
 * lock the UI: past the cap we fall back to "everything replaced".
 */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = splitLines(before);
  const b = splitLines(after);

  if (a.length * b.length > 4_000_000) {
    return [
      ...a.map((text, i) => ({ op: 'del' as const, text, a: i + 1, b: null })),
      ...b.map((text, i) => ({ op: 'add' as const, text, a: null, b: i + 1 })),
    ];
  }

  const n = a.length;
  const m = b.length;
  // lcs[i][j] = length of longest common subsequence of a[i:] and b[j:]
  const lcs: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: 'same', text: a[i], a: i + 1, b: j + 1 });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ op: 'del', text: a[i], a: i + 1, b: null });
      i++;
    } else {
      out.push({ op: 'add', text: b[j], a: null, b: j + 1 });
      j++;
    }
  }
  while (i < n) out.push({ op: 'del', text: a[i], a: ++i, b: null });
  while (j < m) out.push({ op: 'add', text: b[j], a: null, b: ++j });
  return out;
}

export function diffStat(before: string | null, after: string | null): { added: number; removed: number } {
  if (before === null) return { added: splitLines(after ?? '').length, removed: 0 };
  if (after === null) return { added: 0, removed: splitLines(before).length };
  let added = 0;
  let removed = 0;
  for (const line of diffLines(before, after)) {
    if (line.op === 'add') added++;
    else if (line.op === 'del') removed++;
  }
  return { added, removed };
}

/** Collapse long runs of unchanged lines into hunks with `context` lines around edits. */
export function hunkify(lines: DiffLine[], context = 3): (DiffLine | { op: 'gap'; count: number })[] {
  const keep = new Set<number>();
  lines.forEach((line, idx) => {
    if (line.op === 'same') return;
    for (let k = Math.max(0, idx - context); k <= Math.min(lines.length - 1, idx + context); k++) {
      keep.add(k);
    }
  });

  const out: (DiffLine | { op: 'gap'; count: number })[] = [];
  let gap = 0;
  lines.forEach((line, idx) => {
    if (keep.has(idx)) {
      if (gap > 0) {
        out.push({ op: 'gap', count: gap });
        gap = 0;
      }
      out.push(line);
    } else {
      gap++;
    }
  });
  if (gap > 0) out.push({ op: 'gap', count: gap });
  return out;
}
