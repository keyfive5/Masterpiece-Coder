import { CheckpointInfo } from '../shared/types';
import { Workspace } from './workspace';

/**
 * A checkpoint holds the contents of every file a turn touched, captured before
 * the first mutation. `null` means the file did not exist, so restoring deletes it.
 */
interface Checkpoint {
  turnId: string;
  label: string;
  at: number;
  files: Map<string, string | null>;
}

const MAX = 40;

export class CheckpointStore {
  private checkpoints: Checkpoint[] = [];

  begin(turnId: string, label: string): void {
    this.checkpoints.push({ turnId, label, at: Date.now(), files: new Map() });
    while (this.checkpoints.length > MAX) this.checkpoints.shift();
  }

  /** Call immediately before writing or deleting. The first call for a path wins. */
  async capture(workspace: Workspace, turnId: string, path: string): Promise<string | null> {
    const checkpoint = this.checkpoints.find((c) => c.turnId === turnId);
    const previous = await workspace.read(path);
    if (checkpoint && !checkpoint.files.has(path)) checkpoint.files.set(path, previous);
    return previous;
  }

  list(): CheckpointInfo[] {
    return this.checkpoints
      .filter((c) => c.files.size > 0)
      .map((c) => ({ turnId: c.turnId, label: c.label, at: c.at, files: c.files.size }))
      .reverse();
  }

  /** Restore the state captured at the start of `turnId`, discarding it and everything after. */
  async restore(workspace: Workspace, turnId: string): Promise<number> {
    const index = this.checkpoints.findIndex((c) => c.turnId === turnId);
    if (index === -1) throw new Error('That checkpoint is no longer available.');

    let restored = 0;
    // Newest first, so the earliest snapshot wins for files touched repeatedly.
    for (let i = this.checkpoints.length - 1; i >= index; i--) {
      for (const [path, content] of this.checkpoints[i].files) {
        if (content === null) await workspace.remove(path).catch(() => undefined);
        else await workspace.write(path, content);
        restored++;
      }
    }

    this.checkpoints.splice(index);
    return restored;
  }

  clear(): void {
    this.checkpoints = [];
  }
}
