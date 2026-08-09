import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

export interface StaticServer {
  url: string;
  port: number;
  setRoot(dir: string): void;
  close(): Promise<void>;
}

/**
 * A tiny read-only static file server bound to 127.0.0.1. Used both for the app
 * bundle (so web workers and modules behave exactly as they do on the web) and
 * for the workspace Preview panel.
 */
export function serveDirectory(
  initialRoot: string,
  opts: { spa?: boolean; preferredPort?: number } = {},
): Promise<StaticServer> {
  let root = path.resolve(initialRoot);

  const server = http.createServer(async (req, res) => {
    const send = (code: number, body: string, type = 'text/plain; charset=utf-8') => {
      res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(body);
    };

    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (rel === '') rel = 'index.html';

      let abs = path.resolve(root, rel);
      if (path.relative(root, abs).startsWith('..')) return send(403, 'Forbidden');

      let stat = await fsp.stat(abs).catch(() => null);
      if (stat?.isDirectory()) {
        abs = path.join(abs, 'index.html');
        stat = await fsp.stat(abs).catch(() => null);
      }
      if (!stat && opts.spa) {
        abs = path.join(root, 'index.html');
        stat = await fsp.stat(abs).catch(() => null);
      }
      if (!stat) {
        return send(
          404,
          `<!doctype html><meta charset="utf-8"><title>Not found</title>` +
            `<body style="font:15px system-ui;background:#0b0d12;color:#e6e9f0;padding:48px">` +
            `<h2 style="margin:0 0 8px">Nothing to preview yet</h2>` +
            `<p style="color:#8b93a7">No <code>${rel}</code> in this folder. Ask the agent to create an <code>index.html</code>.</p>`,
          'text/html; charset=utf-8',
        );
      }

      res.writeHead(200, {
        'Content-Type': MIME[path.extname(abs).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': stat.size,
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(abs).pipe(res);
    } catch (err) {
      send(500, `Server error: ${(err as Error).message}`);
    }
  });

  return new Promise((resolve, reject) => {
    // The app bundle asks for a fixed port so its origin is stable: browser
    // storage — including the signed-in session — is keyed by origin, and a
    // random port every launch would sign the user out each time.
    let wanted = opts.preferredPort ?? 0;

    server.on('error', (err: NodeJS.ErrnoException) => {
      // Preferred port taken (a second instance, or a leftover socket) — fall
      // back to any free port rather than failing to start.
      if (err.code === 'EADDRINUSE' && wanted !== 0) {
        wanted = 0;
        server.listen(0, '127.0.0.1');
        return;
      }
      reject(err);
    });

    // Bound as a listener rather than a listen() callback so it still fires
    // on the retry above.
    server.on('listening', () => {
      const address = server.address();
      const bound = typeof address === 'object' && address ? address.port : 0;
      resolve({
        url: `http://127.0.0.1:${bound}/`,
        port: bound,
        setRoot(dir: string) {
          root = path.resolve(dir);
        },
        close: () =>
          new Promise((done) => {
            server.close(() => done());
          }),
      });
    });

    server.listen(wanted, '127.0.0.1');
  });
}
