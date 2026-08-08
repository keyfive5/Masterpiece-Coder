import { spawn } from 'node:child_process';
import { requireRoot } from './workspace';

export interface CommandResult {
  code: number | null;
  output: string;
  timedOut: boolean;
}

const MAX_OUTPUT = 60_000;
const running = new Set<ReturnType<typeof spawn>>();

/**
 * Run a shell command inside the workspace and stream its output. Output is
 * capped so a runaway `npm install` can't flood the agent's context.
 */
export function runCommand(
  command: string,
  onChunk: (chunk: string) => void,
  timeoutMs = 180_000,
): Promise<CommandResult> {
  const cwd = requireRoot();

  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const child = isWindows
      ? spawn(process.env.COMSPEC || 'cmd.exe', ['/d', '/s', '/c', command], {
          cwd,
          windowsVerbatimArguments: true,
          env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
        })
      : spawn('/bin/sh', ['-c', command], {
          cwd,
          env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
        });

    running.add(child);

    let output = '';
    let truncated = false;
    let timedOut = false;

    const absorb = (buf: Buffer) => {
      const text = buf.toString('utf8');
      onChunk(text);
      if (output.length < MAX_OUTPUT) {
        output += text;
        if (output.length >= MAX_OUTPUT) {
          output = output.slice(0, MAX_OUTPUT);
          truncated = true;
        }
      }
    };

    child.stdout?.on('data', absorb);
    child.stderr?.on('data', absorb);

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill();
      } catch {
        /* already gone */
      }
    }, timeoutMs);

    const finish = (code: number | null) => {
      clearTimeout(timer);
      running.delete(child);
      resolve({
        code,
        output: truncated ? `${output}\n…[output truncated]` : output,
        timedOut,
      });
    };

    child.on('error', (err) => {
      onChunk(`\n${err.message}\n`);
      output += `\n${err.message}`;
      finish(null);
    });
    child.on('close', finish);
  });
}

export function killAll(): void {
  for (const child of running) {
    try {
      child.kill();
    } catch {
      /* ignore */
    }
  }
  running.clear();
}
