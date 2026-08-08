import { build as esbuild } from 'esbuild';
import { build as viteBuild } from 'vite';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Shared esbuild config for the two Node-side bundles. */
export const nodeBundle = (entry, outfile) => ({
  entryPoints: [path.join(root, entry)],
  outfile: path.join(root, outfile),
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  sourcemap: true,
  minify: false,
  // Electron and the Anthropic SDK are resolved at runtime from node_modules.
  external: ['electron', '@anthropic-ai/sdk'],
  logLevel: 'info',
});

export async function buildMain(watch = false) {
  const configs = [
    nodeBundle('src/main/index.ts', 'dist/main/index.js'),
    nodeBundle('src/preload/index.ts', 'dist/preload/index.js'),
  ];

  if (!watch) {
    await Promise.all(configs.map((config) => esbuild(config)));
    return [];
  }

  const { context } = await import('esbuild');
  const contexts = await Promise.all(configs.map((config) => context(config)));
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  return contexts;
}

async function main() {
  await rm(path.join(root, 'dist'), { recursive: true, force: true });
  await buildMain(false);
  await viteBuild({ configFile: path.join(root, 'vite.config.mjs'), root });
  console.log('\nBuilt: dist/main, dist/preload, dist/renderer');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
