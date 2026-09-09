const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const pages = {
  dinas: 'Ultraman Dinas', noa: 'Ultraman Noa', next: 'Ultraman the Next',
  ruebe: 'Ultraman Ruebe', gruebe: 'Ultraman Gruebe', reiga: 'Ultraman Reiga',
  boy: 'Ultraman Boy', sora: 'Sora', rising: 'Ultraman (Ultraman: Rising)', shin: 'Ultraman (Shin Ultraman)',
  elet: 'Elek', loto: 'Loto', amia: 'Amia', belial: 'Ultraman Belial', tregear: 'Ultraman Tregear',
  evil_tiga: 'Evil Tiga', tiga_dark: 'Ultraman Tiga (character)', camilla: 'Camearra', darramb: 'Darramb',
  hudra: 'Hudra', zagi: 'Dark Zagi', faust: 'Dark Faust', mephisto: 'Dark Mephisto',
  mephisto_zwei: 'Dark Mephisto (Zwei)', chaos: 'Chaos Header', shadow: 'Ultraman Shadow',
  dark_lops: 'Darklops Zero', ginga_dark: 'Dark Lugiel', ultraman_dark: 'Ultraman (character)',
  seven_dark: 'Ultraseven (character)', trigger_dark: 'Trigger Dark', carmeara: 'Carmeara',
  darrgon: 'Darrgon', hudram: 'Hudram', evil_trigger: 'Evil Trigger',
};
const formFiles = {
  tiga_dark: 'File:Ultraman Tiga Tiga Dark Render 4.png',
  chaos: 'File:Chaos Ultraman data.png',
  seven_dark: 'File:Ultraseven Dark I.png',
  ultraman_dark: 'File:Ultraman ginga ultraman dark render by zer0stylinx-dazd9z9.png',
};
const destination = path.resolve(__dirname, '../public/assets/ultra');
const manifestFile = path.join(destination, 'sources.json');
const data = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const get = url => execFileSync('curl', ['-fsSL', '--retry', '2', '--max-time', '30', url], { maxBuffer: 16 * 1024 * 1024 });

async function main() {
  for (const [id, title] of Object.entries(pages)) {
    const entry = data.manifest.find(item => item.id === id);
    if (entry?.page && (!formFiles[id] || entry.file === formFiles[id]) && !process.argv.includes('--refresh')) continue;
    // Pageimages often returns a bust/icon. Resolve the page's image list first
    // and prefer transparent full-body render files when the wiki provides one.
    const params = new URLSearchParams({ action: 'query', titles: title, redirects: '1', prop: 'images', imlimit: 'max', format: 'json' });
    const response = JSON.parse(get(`https://ultra.fandom.com/api.php?${params}`));
    const page = Object.values(response.query.pages)[0];
    let source;
    const candidates = (page.images || []).map(item => item.title)
      .filter(file => /\.(png|webp)$/i.test(file))
      .filter(file => !/(logo|title|icon|screenshot|episode|card|poster|toy|figu|photo|battle|attack|beam|gif)/i.test(file))
      .sort((a, b) => {
        const score = file => (/(full|render|standing|body|profile|character|suit)/i.test(file) ? 10 : 0) - (/(head|bust|close|face)/i.test(file) ? 8 : 0);
        return score(b) - score(a);
      });
    for (const candidate of candidates.slice(0, 12)) {
      const query = new URLSearchParams({ action: 'query', titles: candidate, prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: '640', format: 'json' });
      const file = Object.values(JSON.parse(get(`https://ultra.fandom.com/api.php?${query}`)).query.pages)[0];
      const info = file.imageinfo?.[0];
      if (info?.url && info.width >= 180 && info.height >= 240) { source = info.url; break; }
    }
    if (!source) {
      const fallback = new URLSearchParams({ action: 'query', titles: title, redirects: '1', prop: 'pageimages', piprop: 'original', format: 'json' });
      source = Object.values(JSON.parse(get(`https://ultra.fandom.com/api.php?${fallback}`)).query.pages)[0].original?.source;
    }
    if (formFiles[id]) {
      const query = new URLSearchParams({ action: 'query', titles: formFiles[id], prop: 'imageinfo', iiprop: 'url', format: 'json' });
      const file = Object.values(JSON.parse(get(`https://ultra.fandom.com/api.php?${query}`)).query.pages)[0];
      source = file.imageinfo?.[0]?.url;
    }
    if (!source) { console.error(`MISSING ${id}: ${page.title}`); continue; }
    const input = get(source);
    // Full silhouette remains visible; individual crops are reviewed in the contact sheet.
    const output = await sharp(input).trim().resize(320, 320, { fit: 'contain', background: '#e0e7e3' }).webp({ quality: 85 }).toBuffer();
    fs.writeFileSync(path.join(destination, `${id}.webp`), output);
    Object.assign(entry, { source, page: `https://ultra.fandom.com/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`, ...(formFiles[id] ? { file: formFiles[id] } : {}), bytes: output.length });
    data.checkedAt = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(manifestFile, JSON.stringify(data, null, 2) + '\n');
    console.log(`${id}: ${page.title} (${output.length} bytes)`);
  }
  const missing = data.manifest.filter(item => !item.source.startsWith('https://'));
  if (missing.length) throw new Error(`Portraits still missing: ${missing.map(item => item.id).join(', ')}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
