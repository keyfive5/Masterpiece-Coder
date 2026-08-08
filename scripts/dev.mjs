import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import electronPath from 'electron';
import { buildMain } from './build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const server = await createServer({ configFile: path.join(root, 'vite.config.mjs'), root });
await server.listen();
const address = server.resolvedUrls?.local?.[0] ?? `http://localhost:${server.config.server.port}/`;
server.printUrls();

await buildMain(true);

let child = null;
let restarting = false;

function launch() {
  child = spawn(electronPath, [root], {
    stdio: 'inherit',
    env: { ...process.env, MC_DEV_SERVER_URL: address, NODE_ENV: 'development' },
  });
  child.on('close', () => {
    if (!restarting) {
      void server.close();
      process.exit(0);
    }
  });
}

launch();

// Restart Electron when the main-process bundle changes.
const { watch } = await import('node:fs');
let timer = null;
watch(path.join(root, 'dist', 'main'), () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    restarting = true;
    child?.kill();
    setTimeout(() => {
      restarting = false;
      launch();
    }, 250);
  }, 200);
});
