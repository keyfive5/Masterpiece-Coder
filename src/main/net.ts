import { BrowserWindow } from 'electron';

/**
 * Streaming HTTP on behalf of the renderer. Doing it here rather than in the
 * page means no CORS constraints on any provider, and API keys never appear in
 * renderer-visible network traffic.
 */
const active = new Map<string, AbortController>();

export interface StartResult {
  requestId: string;
  status: number;
  ok: boolean;
}

export async function startRequest(
  win: BrowserWindow,
  url: string,
  init: { method: string; headers: Record<string, string>; body: string },
): Promise<StartResult> {
  const requestId = `net_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const controller = new AbortController();
  active.set(requestId, controller);

  const send = (chunk: string | null) => {
    if (!win.isDestroyed()) win.webContents.send('net:chunk', requestId, chunk);
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method,
      headers: init.headers,
      body: init.method === 'GET' ? undefined : init.body,
      signal: controller.signal,
    });
  } catch (err) {
    active.delete(requestId);
    throw new Error(`Could not reach ${new URL(url).host}: ${(err as Error).message}`);
  }

  // Pump the body in the background; the renderer reads chunks as they arrive.
  void (async () => {
    try {
      const reader = response.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          send(decoder.decode(value, { stream: true }));
        }
      }
    } catch {
      /* aborted or the socket dropped — the null terminator still goes out */
    } finally {
      active.delete(requestId);
      send(null);
    }
  })();

  return { requestId, status: response.status, ok: response.ok };
}

export function abortRequest(requestId: string): void {
  active.get(requestId)?.abort();
  active.delete(requestId);
}

export function abortAll(): void {
  for (const controller of active.values()) controller.abort();
  active.clear();
}
