// Renders the share image and the PNG icons with headless Chrome, using the site's own
// fonts, colors, and copy, so they match the page:
//   public/og.png               1200x630 Open Graph image (hero label, name, one-liner, globe)
//   public/apple-touch-icon.png 180x180 "A" monogram on the page background
//   public/favicon.ico          32x32 "A" monogram (PNG inside an ICO, for old browsers)
// Run after changing the hero copy, the tokens, or public/favicon.svg:
//   npm run og
// Needs Chrome or Edge. Set CHROME_PATH if it is not found.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { site } from '../src/data/site.ts';
import { hero } from '../src/data/hero.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const fontFile = (pkg, file) =>
  pathToFileURL(path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).href;
// Inlined: headless Chrome does not load an SVG <img> across folders from file:// pages.
const favicon = fs
  .readFileSync(path.join(pub, 'favicon.svg'), 'utf8')
  .replace(/<!--[\s\S]*?-->\s*/g, '')
  .replace('<svg ', '<svg class="monogram" ');
const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');

const chrome =
  process.env.CHROME_PATH ||
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => fs.existsSync(p));
if (!chrome) throw new Error('Chrome not found. Set CHROME_PATH.');

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const fonts = `
  @font-face { font-family: 'Bricolage Grotesque Variable'; font-weight: 200 800;
    src: url(${fontFile('bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')}) format('woff2'); }
  @font-face { font-family: 'Geist Variable'; font-weight: 100 900;
    src: url(${fontFile('geist', 'geist-latin-wght-normal.woff2')}) format('woff2'); }
  @font-face { font-family: 'Geist Mono Variable'; font-weight: 100 900;
    src: url(${fontFile('geist-mono', 'geist-mono-latin-wght-normal.woff2')}) format('woff2'); }`;

const ogPage = `<!doctype html><meta charset="utf-8"><style>
${fonts}
${tokens}
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: var(--bg); color: var(--ink); }
body { position: relative; font-family: var(--font-text); -webkit-font-smoothing: antialiased; }
canvas { position: absolute; right: -40px; top: 15px; width: 600px; height: 600px; }
.text { position: absolute; left: 80px; top: 72px; bottom: 72px; display: flex; flex-direction: column; }
.monogram { display: block; width: 64px; height: 64px; }
.label { margin-top: auto; color: var(--muted); font-family: var(--font-mono); font-size: 22px; letter-spacing: 0.08em; text-transform: uppercase; }
.name { margin-top: 12px; font-family: var(--font-display); font-weight: 800; font-size: 168px; line-height: 0.9; letter-spacing: -0.035em; }
.one-liner { margin-top: 28px; max-width: 16ch; font-family: var(--font-display); font-weight: 700; font-size: 44px; line-height: 1.15; }
</style>
<canvas width="1200" height="1200"></canvas>
<div class="text">
  ${favicon}
  <p class="label">${escape(hero.label)}</p>
  <h1 class="name">${escape(hero.name)}</h1>
  <p class="one-liner">${escape(hero.oneLiner)}</p>
</div>
<script>
  // A still frame of the hero globe (src/scripts/globe.ts): dots facing Karachi, arcs, pin.
  const css = getComputedStyle(document.documentElement);
  const rgb = (v) => { const h = css.getPropertyValue(v).trim().slice(1); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(','); };
  const accent = rgb('--accent'), ink = rgb('--ink');
  const ctx = document.querySelector('canvas').getContext('2d');
  ctx.scale(2, 2);
  const size = 600, c = size / 2, r = size * 0.39, yaw = 67 * Math.PI / 180, pitch = 0.32;
  const latLon = (lat, lon) => { const p = lat * Math.PI / 180, l = lon * Math.PI / 180; return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)]; };
  const project = (p) => {
    const x1 = p[0] * Math.cos(yaw) - p[2] * Math.sin(yaw), z1 = p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
    return [c + x1 * r, c - (p[1] * Math.cos(pitch) - z1 * Math.sin(pitch)) * r, p[1] * Math.sin(pitch) + z1 * Math.cos(pitch)];
  };
  const halo = ctx.createRadialGradient(c - r * 0.24, c - r * 0.32, 20, c, c, r * 1.25);
  halo.addColorStop(0, 'rgba(' + accent + ',0.10)'); halo.addColorStop(1, 'rgba(' + accent + ',0)');
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(c, c, r * 1.25, 0, Math.PI * 2); ctx.fill();
  const n = 900, golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, rad = Math.sqrt(1 - y * y), t = golden * i;
    const q = project([Math.cos(t) * rad, y, Math.sin(t) * rad]);
    if (q[2] < -0.05) continue;
    ctx.fillStyle = 'rgba(' + ink + ',' + (0.12 + 0.55 * q[2]) + ')';
    ctx.beginPath(); ctx.arc(q[0], q[1], 1.1 + q[2] * 0.6, 0, Math.PI * 2); ctx.fill();
  }
  const home = latLon(24.86, 67.0);
  const cities = [[51.5, -0.1], [40.7, -74.0], [25.2, 55.3], [52.5, 13.4], [1.35, 103.8], [37.8, -122.4], [43.7, -79.4]];
  ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(' + accent + ',0.35)';
  for (const [lat, lon] of cities) {
    const b = latLon(lat, lon);
    const dot = home[0] * b[0] + home[1] * b[1] + home[2] * b[2];
    const w = Math.acos(Math.min(1, Math.max(-1, dot)));
    ctx.beginPath(); let on = false;
    for (let s = 0; s <= 48; s++) {
      const f = s / 48, k1 = Math.sin((1 - f) * w) / Math.sin(w), k2 = Math.sin(f * w) / Math.sin(w), lift = 1 + 0.22 * Math.sin(f * Math.PI);
      const q = project([0, 1, 2].map((j) => (home[j] * k1 + b[j] * k2) * lift));
      if (q[2] > -0.02) { on ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); on = true; } else on = false;
    }
    ctx.stroke();
  }
  const h = project(home);
  ctx.strokeStyle = 'rgba(' + accent + ',0.3)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(h[0], h[1], 15, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgb(' + accent + ')'; ctx.beginPath(); ctx.arc(h[0], h[1], 5, 0, Math.PI * 2); ctx.fill();
</script>`;

// The monogram centered on a square: page background for the touch icon (iOS rounds
// the corners itself), transparent for the favicon.
const iconPage = (size, inset, background) => `<!doctype html><style>
html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: ${background}; }
.monogram { display: block; width: ${size - inset * 2}px; height: ${size - inset * 2}px; margin: ${inset}px; }
</style>${favicon}`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-image-'));

function shoot(html, width, height, out, transparent = false) {
  const page = path.join(tmp, path.basename(out) + '.html');
  fs.writeFileSync(page, html);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    '--virtual-time-budget=3000',
    ...(transparent ? ['--default-background-color=00000000'] : []),
    `--window-size=${width},${height}`,
    `--screenshot=${out}`,
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  console.log('wrote', path.relative(root, out));
}

shoot(ogPage, 1200, 630, path.join(pub, 'og.png'));
shoot(iconPage(180, 18, '#141414'), 180, 180, path.join(pub, 'apple-touch-icon.png'));

// favicon.ico: an ICO header plus one 32x32 PNG entry.
const png32 = path.join(tmp, 'favicon-32.png');
shoot(iconPage(32, 0, 'transparent'), 32, 32, png32, true);
const png = fs.readFileSync(png32);
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); // reserved
ico.writeUInt16LE(1, 2); // type: icon
ico.writeUInt16LE(1, 4); // one image
ico.writeUInt8(32, 6); // width
ico.writeUInt8(32, 7); // height
ico.writeUInt16LE(1, 10); // color planes
ico.writeUInt16LE(32, 12); // bits per pixel
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18); // image data offset
fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([ico, png]));
console.log('wrote public/favicon.ico');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`for ${site.name}`);
