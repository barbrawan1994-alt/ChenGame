const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {execFile}=require('child_process');
const {promisify}=require('util');
const sharp=require('sharp');
const {load,root}=require('./helpers/project-harness.cjs');
const {SPIRIT_ARTWORK}=load('src/data/spiritArtwork.js');
const {getSpriteFallbackUrls}=load('src/SpriteMap.js');
const dir=path.join(root,'public/assets/spirits');
const curl=promisify(execFile);
(async()=>{
  const reserved=new Set(Array.from({length:904},(_,i)=>getSpriteFallbackUrls({id:i+1})).flat().map(url=>Number(url.match(/\/(\d+)\.png$/)?.[1])).filter(Boolean));
  if(Object.values(SPIRIT_ARTWORK).some(id=>reserved.has(id)) || new Set(Object.values(SPIRIT_ARTWORK)).size!==96)throw new Error('Artwork duplicates an existing or new spirit');
  const manifest={},queue=Object.entries(SPIRIT_ARTWORK);
  const results=await Promise.allSettled(Array.from({length:4},async()=>{
    while(queue.length){
      const [id,nationalDex]=queue.shift();
      const source=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nationalDex}.png`;
      const {stdout}=await curl('curl',['-fsSL','--retry','2','--max-time','30',source],{encoding:'buffer',maxBuffer:8e6});
      const bytes=await sharp(stdout).resize(384,384,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:88}).toBuffer();
      fs.writeFileSync(path.join(dir,`${id}.webp`),bytes);
      fs.rmSync(path.join(dir,`${id}.svg`),{force:true});
      manifest[id]={nationalDex,source,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
    }
  }));
  for(const result of results)if(result.status==='rejected')throw result.reason;
  fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(`Installed ${Object.keys(manifest).length} non-repeated Pokemon artwork assets`);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
