import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'src', 'data', 'generals.js');
const outDir = path.join(root, 'public', 'assets', 'generals');

const source = fs.readFileSync(dataPath, 'utf8');
const generals = [];
const itemRegex = /G\(\s*(\{[\s\S]*?\})\s*\)/g;
let match;

while ((match = itemRegex.exec(source))) {
  try {
    generals.push(Function(`"use strict"; return (${match[1]});`)());
  } catch (err) {
    console.warn('Skipped a general entry:', err.message);
  }
}

fs.mkdirSync(outDir, { recursive: true });

const factionTheme = {
  wei: { a: '#0f4c9a', b: '#1d6fd1', c: '#9fc7ff', cloth: '#1f5fae', armor: '#9bb7d9', trim: '#d7e8ff' },
  shu: { a: '#1f7a3f', b: '#36a85d', c: '#c4f0ce', cloth: '#2f8f4d', armor: '#b8d8a8', trim: '#e4ffd9' },
  wu: { a: '#aa3b13', b: '#e86a24', c: '#ffd3a4', cloth: '#b94221', armor: '#e4ad70', trim: '#ffe0b3' },
  jin: { a: '#3f1a76', b: '#7646b7', c: '#dec5ff', cloth: '#54308d', armor: '#bda3dd', trim: '#efe0ff' },
  neutral: { a: '#555a63', b: '#858b96', c: '#e2e5ea', cloth: '#60656f', armor: '#bcc3cd', trim: '#f1f3f6' },
};

const rarityTheme = {
  SSR: { halo: '#f7d35a', glow: '#ffe9a6', crown: true, beard: 0.85, detail: 1 },
  SR: { halo: '#b9c7e7', glow: '#dce7ff', crown: false, beard: 0.62, detail: 0.7 },
  R: { halo: '#aab2bd', glow: '#dfe3e8', crown: false, beard: 0.42, detail: 0.45 },
};

function hash(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return ((s >>> 0) / 4294967296);
  };
}

function pick(r, arr) {
  return arr[Math.floor(r() * arr.length) % arr.length];
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function portraitSvg(general) {
  const theme = factionTheme[general.faction] || factionTheme.neutral;
  const rarity = rarityTheme[general.rarity] || rarityTheme.R;
  const h = hash(`${general.id}:${general.name}:${general.title}`);
  const r = rand(h);

  const skin = pick(r, ['#f0c08d', '#e6ad78', '#d99b68', '#f2cda1', '#c98a5b']);
  const hair = pick(r, ['#171514', '#2a211b', '#38271e', '#101827', '#3a2a22']);
  const faceW = 132 + Math.floor(r() * 30);
  const faceH = 168 + Math.floor(r() * 24);
  const faceX = 256 + Math.floor((r() - 0.5) * 10);
  const eyeTilt = (r() - 0.5) * 8;
  const browWeight = 5 + Math.floor(r() * 4);
  const mustache = r() < rarity.beard;
  const longBeard = mustache && r() > 0.46;
  const helmet = r() > (general.rarity === 'SSR' ? 0.24 : 0.46);
  const plume = general.rarity === 'SSR' || r() > 0.72;
  const shoulder = 88 + Math.floor(r() * 18);
  const robeCut = Math.floor(r() * 28);
  const patternA = 50 + Math.floor(r() * 80);
  const patternB = 260 + Math.floor(r() * 120);
  const starOpacity = general.rarity === 'SSR' ? 0.82 : general.rarity === 'SR' ? 0.48 : 0.28;

  const headgear = helmet
    ? `
      <path d="M154 200 Q177 104 256 94 Q335 104 358 200 Q307 175 256 176 Q205 175 154 200Z" fill="${hair}" opacity="0.96"/>
      <path d="M170 188 Q196 128 256 120 Q316 128 342 188 Q296 169 256 169 Q216 169 170 188Z" fill="${theme.armor}" opacity="0.88"/>
      <path d="M212 124 Q256 96 300 124 Q286 146 256 150 Q226 146 212 124Z" fill="${rarity.halo}" opacity="0.92"/>
      ${plume ? `<path d="M256 106 C238 72 260 44 252 20 C295 55 303 86 274 119Z" fill="${theme.c}" opacity="0.9"/>` : ''}
    `
    : `
      <path d="M158 204 Q171 104 256 90 Q341 104 354 204 Q308 151 256 153 Q204 151 158 204Z" fill="${hair}"/>
      <path d="M184 152 Q226 112 256 116 Q290 116 328 152 Q299 139 256 139 Q213 139 184 152Z" fill="${theme.trim}" opacity="0.24"/>
    `;

  const crown = rarity.crown
    ? `
      <path d="M198 124 L222 82 L256 120 L290 82 L314 124 L302 146 L210 146Z" fill="${rarity.halo}"/>
      <path d="M218 134 H294" stroke="#7a4b12" stroke-width="7" stroke-linecap="round" opacity="0.55"/>
    `
    : '';

  const beard = mustache
    ? `
      <path d="M220 286 C238 274 246 274 256 286 C266 274 276 274 292 286 C278 302 266 304 256 296 C246 304 233 302 220 286Z" fill="${hair}" opacity="0.88"/>
      ${longBeard ? `<path d="M230 306 Q256 360 282 306 Q274 384 256 416 Q238 384 230 306Z" fill="${hair}" opacity="0.82"/>` : ''}
    `
    : `<path d="M232 300 Q256 318 280 300" stroke="${hair}" stroke-width="5" stroke-linecap="round" opacity="0.52"/>`;

  const scars = r() > 0.74
    ? `<path d="M296 205 L318 244" stroke="#9f5d46" stroke-width="5" stroke-linecap="round" opacity="0.55"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${escapeXml(general.name)} portrait">
  <defs>
    <radialGradient id="bg" cx="50%" cy="34%" r="72%">
      <stop offset="0%" stop-color="${theme.c}"/>
      <stop offset="46%" stop-color="${theme.b}"/>
      <stop offset="100%" stop-color="${theme.a}"/>
    </radialGradient>
    <linearGradient id="robe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cloth}"/>
      <stop offset="100%" stop-color="${theme.a}"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.32"/>
    </filter>
    <clipPath id="round">
      <circle cx="256" cy="256" r="246"/>
    </clipPath>
  </defs>
  <rect width="512" height="512" fill="#10131b"/>
  <g clip-path="url(#round)">
    <rect width="512" height="512" fill="url(#bg)"/>
    <circle cx="${patternA}" cy="94" r="118" fill="#fff" opacity="0.08"/>
    <circle cx="${patternB}" cy="438" r="164" fill="#000" opacity="0.14"/>
    <path d="M40 132 C140 86 244 102 472 52" stroke="#fff" stroke-width="18" opacity="0.08" fill="none"/>
    <path d="M28 398 C168 330 286 348 492 286" stroke="#000" stroke-width="22" opacity="0.1" fill="none"/>
    <g opacity="${starOpacity}">
      <path d="M416 98 l8 20 21 2 -16 14 5 21 -18 -11 -18 11 5 -21 -16 -14 21 -2Z" fill="${rarity.glow}"/>
      <circle cx="84" cy="288" r="5" fill="${rarity.glow}"/>
      <circle cx="444" cy="244" r="4" fill="${rarity.glow}"/>
    </g>
    <ellipse cx="256" cy="548" rx="190" ry="196" fill="url(#robe)" filter="url(#softShadow)"/>
    <path d="M${132 - robeCut} 514 C164 410 198 360 256 348 C314 360 348 410 ${380 + robeCut} 514Z" fill="${theme.cloth}"/>
    <path d="M164 418 Q256 388 348 418 L334 512 H178Z" fill="${theme.armor}" opacity="0.72"/>
    <path d="M182 432 L256 496 L330 432" stroke="${theme.trim}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
    <path d="M${256 - shoulder} 398 Q200 430 172 512 H128 Q146 424 202 382Z" fill="#000" opacity="0.16"/>
    <path d="M${256 + shoulder} 398 Q312 430 340 512 H384 Q366 424 310 382Z" fill="#000" opacity="0.16"/>
    <path d="M210 334 Q256 366 302 334 V390 Q256 426 210 390Z" fill="${skin}"/>
    <g filter="url(#softShadow)">
      ${headgear}
      ${crown}
      <ellipse cx="${faceX}" cy="228" rx="${faceW / 2}" ry="${faceH / 2}" fill="${skin}"/>
      <path d="M${faceX - faceW / 2 + 10} 218 Q256 242 ${faceX + faceW / 2 - 10} 216 Q314 284 256 324 Q198 284 ${faceX - faceW / 2 + 10} 218Z" fill="#fff" opacity="0.06"/>
      <ellipse cx="${faceX - 62}" cy="238" rx="17" ry="26" fill="${skin}" opacity="0.88"/>
      <ellipse cx="${faceX + 62}" cy="238" rx="17" ry="26" fill="${skin}" opacity="0.88"/>
      <path d="M202 ${210 + eyeTilt} Q226 ${196 + eyeTilt} 246 ${210 + eyeTilt}" stroke="${hair}" stroke-width="${browWeight}" stroke-linecap="round" fill="none"/>
      <path d="M266 ${210 - eyeTilt} Q288 ${196 - eyeTilt} 312 ${210 - eyeTilt}" stroke="${hair}" stroke-width="${browWeight}" stroke-linecap="round" fill="none"/>
      <path d="M210 234 Q226 224 242 234" stroke="#111827" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M270 234 Q288 224 306 234" stroke="#111827" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M254 236 Q242 270 260 274" stroke="#a56b50" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.55"/>
      ${scars}
      ${beard}
    </g>
    <circle cx="256" cy="256" r="246" fill="none" stroke="${rarity.halo}" stroke-width="${general.rarity === 'SSR' ? 12 : 8}" opacity="${general.rarity === 'R' ? 0.38 : 0.64}"/>
    <circle cx="256" cy="256" r="232" fill="none" stroke="#fff" stroke-width="2" opacity="0.16"/>
  </g>
</svg>`;
}

for (const general of generals) {
  const file = path.join(outDir, `${general.id}.svg`);
  fs.writeFileSync(file, portraitSvg(general));
}

console.log(`Generated ${generals.length} general portraits in ${path.relative(root, outDir)}`);
