// Generates the app icons with no image dependencies: raw RGBA pixels wrapped
// in a minimal PNG (zlib comes from Node). Matches the in-app brand mark —
// an indigo→cyan rounded square with a dark cut-out centre.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size) {
  const rows = [];
  const radius = size * 0.22;
  const inset = size * 0.28;

  const inRounded = (x, y, pad, r) => {
    const lo = pad;
    const hi = size - pad;
    if (x < lo || x > hi || y < lo || y > hi) return false;
    const cx = Math.min(Math.max(x, lo + r), hi - r);
    const cy = Math.min(Math.max(y, lo + r), hi - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };

  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(size * 4 + 1);
    row[0] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const i = 1 + x * 4;
      const outside = !inRounded(x, y, 0, radius);
      const centre = inRounded(x, y, inset, size * 0.05);

      if (outside) {
        row[i] = 0;
        row[i + 1] = 0;
        row[i + 2] = 0;
        row[i + 3] = 0;
      } else if (centre) {
        row[i] = 0x0a;
        row[i + 1] = 0x0d;
        row[i + 2] = 0x13;
        row[i + 3] = 255;
      } else {
        // Diagonal indigo (#7c8cff) → cyan (#48d8e6)
        const t = (x + y) / (2 * size);
        row[i] = Math.round(0x7c + (0x48 - 0x7c) * t);
        row[i + 1] = Math.round(0x8c + (0xd8 - 0x8c) * t);
        row[i + 2] = Math.round(0xff + (0xe6 - 0xff) * t);
        row[i + 3] = 255;
      }
    }
    rows.push(row);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = path.join(root, 'public');
mkdirSync(out, { recursive: true });
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(path.join(out, name), png(size));
  console.log(`wrote public/${name} (${size}x${size})`);
}
