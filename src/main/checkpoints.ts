import { CheckpointInfo } from '../shared/types';
import * as ws from './workspace';

/**
 * A checkpoint records the contents of every file the agent touched during one
 * turn, captured *before* the first mutation. Restoring rewinds the workspace
 * to exactly how it looked when the turn began.
 *
 * `null` content means "the file did not exist" — restoring deletes it.
 */
interface Checkpoint {
  turnId: string;
  label: string;
  at: number;
  files: Map<string, string | null>;
}

const checkpoints: Checkpoint[] = [];
const MAX_CHECKPOINTS = 40;

export function begin(turnId: string, label: string): void {
  checkpoints.push({ turnId, label, at: Date.now(), files: new Map() });
  while (checkpoints.length > MAX_CHECKPOINTS) checkpoints.shift();
}

/** Called immediately before a file is written or deleted. First call wins. */
export async function capture(turnId: string, relPath: string): Promise<string | null> {
  const cp = checkpoints.find((c) => c.turnId === turnId);
  const previous = await ws.readFileRaw(relPath);
  if (cp && !cp.files.has(relPath)) cp.files.set(relPath, previous);
  return previous;
}

export function list(): CheckpointInfo[] {
  return checkpoints
    .filter((c) => c.files.size > 0)
    .map((c) => ({ turnId: c.turnId, label: c.label, at: c.at, files: c.files.size }))
    .reverse();
}

/**
 * Restore the workspace to the state captured at the start of `turnId`, and
 * discard that checkpoint plus every checkpoint after it.
 */
export async function restore(turnId: string): Promise<number> {
  const index = checkpoints.findIndex((c) => c.turnId === turnId);
  if (index === -1) throw new Error('That checkpoint is no longer available.');

  // Later turns first, so earlier snapshots win for files touched repeatedly.
  let restored = 0;
  for (let i = checkpoints.length - 1; i >= index; i--) {
    for (const [relPath, content] of checkpoints[i].files) {
      if (content === null) {
        await ws.deleteEntry(relPath).catch(() => undefined);
      } else {
        await ws.writeFile(relPath, content);
      }
      restored++;
    }
  }

  checkpoints.splice(index);
  return restored;
}

export function clear(): void {
  checkpoints.length = 0;
}
