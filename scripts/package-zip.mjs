import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(root, '../dist');
const manifestPath = path.join(dist, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('Run npm run build first.');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version ?? '0.0.0';
const name = 'MicroAgente-AI4Context_organizador';
const outZip = path.resolve(root, `../${name}-extension-v${version}.zip`);

const output = fs.createWriteStream(outZip);
const archive = archiver('zip', { zlib: { level: 9 } });
archive.directory(dist, false);
const done = new Promise((resolve, reject) => {
  output.on('close', resolve);
  archive.on('error', reject);
});
archive.pipe(output);
await archive.finalize();
await done;
console.log('[pack]', outZip);
