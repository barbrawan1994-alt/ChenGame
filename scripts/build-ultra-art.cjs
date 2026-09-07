const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const { load } = require('./helpers/project-harness.cjs');
const { ULTRA_HEROES, ULTRA_ERAS } = load('src/data/ultra.js');
const destination = path.resolve(__dirname, '../public/assets/ultra');
fs.mkdirSync(destination, { recursive: true });
const sourceManifest = JSON.parse(fs.readFileSync(path.join(destination, 'sources.json'), 'utf8'));
const sources = Object.fromEntries(sourceManifest.manifest.filter(item => item.source.startsWith('https://')).map(item => [item.id, item.source]));
const kaijuSources = JSON.parse(fs.readFileSync(path.join(destination, 'kaiju-sources.json'), 'utf8'));
const proxyArgs = process.env.HTTPS_PROXY ? ['--proxy', process.env.HTTPS_PROXY] : [];
function emblem(id, index, shadow = false) {
  const accent = shadow ? '#b65876' : ['#b83349', '#306b9c', '#467f73'][index % 3];
  const eyes = shadow ? '#f4666b' : '#f8df87';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="320" height="320" fill="${shadow ? '#25202c' : '#c8d4ce'}"/><path d="M0 260L320 40V75L0 295Z" fill="${accent}" opacity=".3"/><path d="M65 320V250Q90 205 128 201L130 169H190L192 201Q230 205 255 250V320" fill="${accent}"/><path d="M65 320V250L127 216L160 270L194 216L255 250V320L204 286L185 320H135L116 286Z" fill="#aebcba"/><path d="M108 98Q106 52 160 45Q214 52 212 98L205 155Q200 187 160 202Q120 187 115 155Z" fill="#dce3df" stroke="#7d9190" stroke-width="4"/><path d="M145 80L160 20L175 80L167 136H153Z" fill="${accent}"/><path d="M118 107L148 118L146 135Q121 137 118 107ZM202 107L172 118L174 135Q199 137 202 107Z" fill="${eyes}" stroke="#657c7c" stroke-width="3"/><path d="M144 165L160 174L176 165" fill="none" stroke="#6a8383" stroke-width="5"/><path d="M151 235L160 224L169 235L160 250Z" fill="#8dd9e3" stroke="#e9f8f3" stroke-width="3"/><text x="16" y="298" fill="${shadow ? '#e9cbd6' : '#2c4038'}" font-family="sans-serif" font-size="12">${id.toUpperCase().replaceAll('_', ' ')}</text></svg>`;
}
const KAIJU_ART = {
  heisei: '<g stroke="#2b2734" stroke-width="6"><ellipse cx="242" cy="240" rx="172" ry="148" fill="#655a76"/><ellipse cx="236" cy="230" rx="130" ry="117" fill="none"/><ellipse cx="231" cy="227" rx="85" ry="85" fill="none"/><ellipse cx="226" cy="224" rx="39" ry="45" fill="none"/><path d="M72 281L38 246L65 222L39 184L82 182L83 125L127 140L148 79L188 109L228 58L256 101L308 77L319 131L376 123L370 180L423 201L385 244" fill="none" stroke="#b6a5b9" stroke-width="14"/><path d="M173 335Q52 276 30 394M187 352Q77 405 97 456M301 339Q448 280 465 404M316 365Q416 402 392 459" fill="none" stroke="#928394" stroke-width="23"/><path d="M171 332L182 417L221 439L263 424L291 335Z" fill="#a9979a"/><path d="M198 375L212 369M250 374L263 366" stroke="#ed656b" stroke-width="13"/><path d="M221 410Q178 468 248 454Q281 448 268 474" fill="none" stroke="#bfaab0" stroke-width="18"/></g>',
  reiwa: '<g stroke="#4d5157" stroke-width="5"><path d="M126 327L58 210L102 112L176 78L196 33L251 88L308 63L332 127L401 163L389 245L347 328L368 432L297 449L263 369L210 383L174 450L98 437Z" fill="#696e69"/><path d="M133 168L188 114L245 140L269 90L326 141L348 204L313 237L183 229Z" fill="#b9bbb0"/><path d="M152 175L188 185L185 203L150 194M278 173L317 163L321 181L282 193" fill="#e27663"/><path d="M192 253L236 233L282 266L263 314L208 307Z" fill="#d09e58"/><path d="M78 222L30 335L64 364L115 288M380 197L457 321L421 353L344 267" fill="#89908c"/><path d="M234 324L248 397L216 391Z" fill="#cfaa79"/></g>',
  beyond: '<g stroke="#36404a" stroke-width="5"><path d="M154 163L187 107L211 128L216 52L241 97L265 53L276 127L305 103L332 164L314 222L340 332L315 436L261 441L244 352L219 439L159 433L146 333L166 223Z" fill="#202933"/><path d="M174 214L207 226L211 302L174 311M270 225L306 212L313 310L271 301" fill="#d8b35e"/><path d="M163 202L101 238L61 218L43 119L86 178L117 158L132 214M323 204L383 236L421 215L435 114L393 176L363 156L350 215" fill="#a7bac1"/><path d="M180 332L153 398L133 432L180 444M302 332L330 398L350 436L298 445" fill="#9caeb6"/><path d="M228 158L237 202L253 202L260 157Z" fill="#e7b354"/><path d="M210 139L184 41L176 109M279 139L303 41L311 109" fill="#b9c4ba"/></g>',
  shadow: '<g stroke="#39404a" stroke-width="6"><path d="M147 181L182 130L191 68L227 97L240 41L254 99L289 65L299 132L339 180L310 232L327 338L303 442L255 442L241 338L218 442L169 442L151 341L171 232Z" fill="#657180"/><path d="M131 197L87 230L72 308L110 328L168 243M340 197L390 235L405 314L366 331L315 244" fill="#9299a3"/><path d="M185 175L230 190L219 207L188 194M258 190L297 175L296 194L267 207" fill="#d95265"/><path d="M184 240L240 218L300 240L284 303L241 325L200 301Z" fill="#252e3a"/><path d="M215 241L241 266L268 241L250 296L232 296Z" fill="#9d637a"/><path d="M407 67V425M378 62L383 115L407 139L435 113L439 59" fill="none" stroke="#a6a7ac" stroke-width="13"/></g>',
};
async function main() {
  const manifest = [];
  for (let i = 0; i < ULTRA_HEROES.length; i++) {
    const hero = ULTRA_HEROES[i];
    const file = path.join(destination, `${hero.id}.webp`);
    const source = sources[hero.id];
    if (!fs.existsSync(file)) {
      const input = source ? execFileSync('curl', [...proxyArgs, '-fsSL', '--retry', '2', '--max-time', '25', encodeURI(decodeURI(source))], { maxBuffer: 12 * 1024 * 1024 }) : Buffer.from(emblem(hero.id, i, hero.era === 'shadow'));
      await sharp(input).resize(320, 320, { fit: 'cover' }).webp({ quality: 78 }).toFile(file);
    }
    manifest.push({ id: hero.id, source: source || 'Original stylized archive emblem; not a canonical character portrait', bytes: fs.statSync(file).size });
    console.log(`${i + 1}/${ULTRA_HEROES.length} ${hero.id}`);
  }
  for (const era of ULTRA_ERAS) {
    const official = kaijuSources[era.id];
    const file = path.join(destination, `kaiju-${era.id}.webp`);
    if (official && !fs.existsSync(file)) {
      const input = execFileSync('curl', [...proxyArgs, '-fsSL', '--retry', '2', '--max-time', '25', official.image], { maxBuffer: 12 * 1024 * 1024 });
      await sharp(input).resize(480, 480, { fit:'inside' }).webp({ quality:85 }).toFile(file);
    }
    if (KAIJU_ART[era.id]) {
      const sprite = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${KAIJU_ART[era.id]}</svg>`;
      await sharp(Buffer.from(sprite)).webp({quality:90}).toFile(file);
    }
  }
  fs.writeFileSync(path.join(destination, 'sources.json'), JSON.stringify({ checkedAt: '2026-09-07', manifest }, null, 2) + '\n');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
