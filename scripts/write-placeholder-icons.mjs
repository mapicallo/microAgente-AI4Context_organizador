/**
 * Iconos mínimos violeta (#5b21b6) para la barra de herramientas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, '../public/icons');
const sizes = [16, 48, 128];

function solidRound(size) {
  const png = new PNG({ width: size, height: size });
  const pr = 91;
  const pg = 33;
  const pb = 182;
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const R = size * 0.42;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (size * y + x) << 2;
      const d = Math.hypot(x - cx, y - cy);
      const inside = d <= R;
      png.data[i] = pr;
      png.data[i + 1] = pg;
      png.data[i + 2] = pb;
      png.data[i + 3] = inside ? 255 : 0;
    }
  }
  return PNG.sync.write(png);
}

fs.mkdirSync(outDir, { recursive: true });
for (const s of sizes) {
  fs.writeFileSync(path.join(outDir, `icon${s}.png`), solidRound(s));
}
console.log('[icons] wrote', sizes.map((x) => `icon${x}.png`).join(', '));
