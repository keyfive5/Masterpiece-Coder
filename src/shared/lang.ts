/** Map a file path to a Monaco language id (and a friendly label). */

const BY_EXT: Record<string, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  json: 'json',
  jsonc: 'json',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  markdown: 'markdown',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  kt: 'kotlin',
  swift: 'swift',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  hpp: 'cpp',
  cs: 'csharp',
  php: 'php',
  sql: 'sql',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  ps1: 'powershell',
  bat: 'bat',
  cmd: 'bat',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'ini',
  ini: 'ini',
  xml: 'xml',
  svg: 'xml',
  vue: 'html',
  dockerfile: 'dockerfile',
};

const BY_NAME: Record<string, string> = {
  dockerfile: 'dockerfile',
  makefile: 'makefile',
  '.gitignore': 'ini',
  '.env': 'ini',
};

export function languageFor(filePath: string): string {
  const name = filePath.split(/[\\/]/).pop() ?? '';
  const lower = name.toLowerCase();
  if (BY_NAME[lower]) return BY_NAME[lower];
  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.') + 1) : '';
  return BY_EXT[ext] ?? 'plaintext';
}

const BINARY_EXT = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'avif',
  'mp3', 'wav', 'ogg', 'mp4', 'mov', 'webm', 'avi',
  'zip', 'gz', 'tar', 'rar', '7z', 'pdf', 'exe', 'dll', 'so', 'dylib',
  'woff', 'woff2', 'ttf', 'otf', 'eot', 'class', 'jar', 'pyc', 'wasm',
]);

export function looksBinary(filePath: string): boolean {
  const ext = filePath.toLowerCase().split('.').pop() ?? '';
  return BINARY_EXT.has(ext);
}
