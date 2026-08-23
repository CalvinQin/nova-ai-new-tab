import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const iconDirectory = path.join(root, 'public', 'icons');
const source = await readFile(path.join(iconDirectory, 'nova.svg'));

await mkdir(iconDirectory, { recursive: true });
await Promise.all(
  [16, 32, 48, 128].map((size) =>
    sharp(source).resize(size, size).png().toFile(path.join(iconDirectory, `nova-${size}.png`)),
  ),
);

console.log('Generated NOVA extension icons: 16, 32, 48, 128px');
