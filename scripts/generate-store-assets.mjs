import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outputDirectory = path.join(root, 'docs', 'chrome-web-store', 'assets');
const iconSource = path.join(root, 'public', 'icons', 'nova-128.png');

await mkdir(outputDirectory, { recursive: true });

const smallPromo = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
  <defs>
    <radialGradient id="glow" cx="50%" cy="45%" r="66%">
      <stop offset="0" stop-color="#20352a"/>
      <stop offset=".48" stop-color="#111a15"/>
      <stop offset="1" stop-color="#080a08"/>
    </radialGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#7fb295" stop-opacity=".72"/>
      <stop offset="1" stop-color="#31483a" stop-opacity=".12"/>
    </linearGradient>
  </defs>
  <rect width="440" height="280" fill="url(#glow)"/>
  <ellipse cx="220" cy="134" rx="162" ry="92" fill="none" stroke="url(#stroke)" stroke-width="1.2" transform="rotate(-8 220 134)"/>
  <ellipse cx="220" cy="134" rx="126" ry="70" fill="none" stroke="#789681" stroke-opacity=".13" transform="rotate(14 220 134)"/>
  <circle cx="351" cy="72" r="3" fill="#7ac596"/>
  <g transform="translate(172 72)">
    <rect width="96" height="96" rx="23" fill="#111410" stroke="#8aa392" stroke-opacity=".22"/>
    <path d="M23.25 57.38C36 30.75 54 23.25 72.75 22.88C59.25 30 49.88 39.75 42.75 56.63C37.13 69.75 26.63 72.38 20.25 68.25C25.88 66.75 28.5 63 30 58.88C27 59.63 24.75 59.25 23.25 57.38Z" fill="#F0EEE8"/>
    <circle cx="65.25" cy="31.5" r="3.75" fill="#8EB09A"/>
  </g>
  <rect x="105" y="205" width="230" height="34" rx="17" fill="#0D110E" stroke="#6F9E80" stroke-opacity=".38"/>
  <circle cx="126" cy="222" r="5" fill="#7CB38D" fill-opacity=".82"/>
  <rect x="142" y="218" width="102" height="7" rx="3.5" fill="#E7E9E4" fill-opacity=".74"/>
  <rect x="296" y="216" width="18" height="12" rx="4" fill="#172019" stroke="#789681" stroke-opacity=".32"/>
</svg>`);

const marqueePromo = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560" viewBox="0 0 1400 560">
  <defs>
    <radialGradient id="ambient" cx="54%" cy="48%" r="70%">
      <stop offset="0" stop-color="#1F382A"/>
      <stop offset=".42" stop-color="#101A14"/>
      <stop offset="1" stop-color="#070907"/>
    </radialGradient>
    <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#8AC09E" stop-opacity=".72"/>
      <stop offset="1" stop-color="#3E5C48" stop-opacity=".08"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="560" fill="url(#ambient)"/>
  <ellipse cx="744" cy="282" rx="566" ry="225" fill="none" stroke="url(#orbit)" stroke-width="1.6" transform="rotate(-5 744 282)"/>
  <ellipse cx="769" cy="276" rx="430" ry="165" fill="none" stroke="#779281" stroke-opacity=".13" transform="rotate(10 769 276)"/>
  <circle cx="1198" cy="112" r="5" fill="#7BD09C"/>
  <g transform="translate(154 184)">
    <rect width="192" height="192" rx="46" fill="#111410" stroke="#8AA392" stroke-opacity=".23"/>
    <path d="M46.5 114.75C72 61.5 108 46.5 145.5 45.75C118.5 60 99.75 79.5 85.5 113.25C74.25 139.5 53.25 144.75 40.5 136.5C51.75 133.5 57 126 60 117.75C54 119.25 49.5 118.5 46.5 114.75Z" fill="#F0EEE8"/>
    <circle cx="130.5" cy="63" r="7.5" fill="#8EB09A"/>
  </g>
  <g transform="translate(470 192)">
    <rect width="760" height="176" rx="42" fill="#0C100D" fill-opacity=".92" stroke="#6F9E80" stroke-opacity=".46" stroke-width="2"/>
    <rect x="34" y="52" width="126" height="72" rx="22" fill="#151C17" stroke="#6E8C77" stroke-opacity=".28"/>
    <circle cx="66" cy="88" r="10" fill="#6EB88A"/>
    <rect x="87" y="81" width="49" height="14" rx="7" fill="#DDE2DA" fill-opacity=".7"/>
    <rect x="194" y="70" width="2" height="36" rx="1" fill="#73837A" fill-opacity=".24"/>
    <rect x="229" y="76" width="307" height="22" rx="11" fill="#E8ECE6" fill-opacity=".82"/>
    <rect x="564" y="66" width="154" height="42" rx="15" fill="#151D18" stroke="#76917E" stroke-opacity=".25"/>
    <circle cx="590" cy="87" r="5" fill="#88C79E"/>
    <rect x="605" y="82" width="78" height="10" rx="5" fill="#AAB6AD" fill-opacity=".54"/>
  </g>
</svg>`);

await Promise.all([
  sharp(iconSource).png().toFile(path.join(outputDirectory, 'nova-store-icon-128.png')),
  sharp(smallPromo)
    .flatten({ background: '#080a08' })
    .png()
    .toFile(path.join(outputDirectory, 'nova-promo-small-440x280.png')),
  sharp(marqueePromo)
    .flatten({ background: '#070907' })
    .png()
    .toFile(path.join(outputDirectory, 'nova-promo-marquee-1400x560.png')),
]);

const expected = new Map([
  ['nova-store-icon-128.png', [128, 128]],
  ['nova-promo-small-440x280.png', [440, 280]],
  ['nova-promo-marquee-1400x560.png', [1400, 560]],
  ['nova-screenshot-01-light.png', [1280, 800]],
  ['nova-screenshot-02-suggestions.png', [1280, 800]],
  ['nova-screenshot-03-command-dark.png', [1280, 800]],
  ['nova-screenshot-04-settings.png', [1280, 800]],
  ['nova-screenshot-05-focus.png', [1280, 800]],
]);

for (const [filename, [width, height]] of expected) {
  const metadata = await sharp(path.join(outputDirectory, filename)).metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`${filename} must be ${width}x${height}; received ${metadata.width}x${metadata.height}`);
  }
}

process.stdout.write('Generated and verified Chrome Web Store assets.\n');
