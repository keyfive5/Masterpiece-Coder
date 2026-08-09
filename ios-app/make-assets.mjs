// Generates the iOS icon and splash with no image dependencies — the same
// gradient mark the app uses, drawn as raw RGBA and wrapped in a PNG.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const TABLE = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encode(width, height, paint) {
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(width * 4 + 1);
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = paint(x, y);
      const i = 1 + x * 4;
      row[i] = r; row[i + 1] = g; row[i + 2] = b; row[i + 3] = a;
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const gradient = (x, y, size) => {
  const t = (x + y) / (2 * size);
  return [
    Math.round(0x7c + (0x48 - 0x7c) * t),
    Math.round(0x8c + (0xd8 - 0x8c) * t),
    Math.round(0xff + (0xe6 - 0xff) * t),
  ];
};

// App icon: iOS masks its own corners, so fill the square edge to edge.
function icon(size) {
  const inset = size * 0.29;
  const hole = size * 0.05;
  const inRounded = (x, y, pad, r) => {
    const lo = pad, hi = size - pad;
    if (x < lo || x > hi || y < lo || y > hi) return false;
    const cx = Math.min(Math.max(x, lo + r), hi - r);
    const cy = Math.min(Math.max(y, lo + r), hi - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  return encode(size, size, (x, y) => {
    if (inRounded(x, y, inset, hole)) return [0x0a, 0x0d, 0x13, 255];
    const [r, g, b] = gradient(x, y, size);
    return [r, g, b, 255];
  });
}

// Splash: the mark centred on the app background.
function splash(size) {
  const centre = size / 2;
  const half = size * 0.11;
  const hole = size * 0.045;
  const box = (x, y, h) => Math.abs(x - centre) <= h && Math.abs(y - centre) <= h;
  return encode(size, size, (x, y) => {
    if (box(x, y, hole)) return [0x0a, 0x0d, 0x13, 255];
    if (box(x, y, half)) {
      const [r, g, b] = gradient(x - centre + half, y - centre + half, half * 2);
      return [r, g, b, 255];
    }
    return [0x09, 0x0b, 0x10, 255];
  });
}

const assets = path.join(here, 'assets');
mkdirSync(assets, { recursive: true });

writeFileSync(path.join(assets, 'icon.png'), icon(1024));
writeFileSync(path.join(assets, 'adaptive-icon.png'), icon(1024));
writeFileSync(path.join(assets, 'favicon.png'), icon(64));
writeFileSync(path.join(assets, 'splash.png'), splash(1242));
console.log('wrote assets/icon.png (1024), adaptive-icon.png, favicon.png, splash.png (1242)');
