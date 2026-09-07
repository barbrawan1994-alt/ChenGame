// Resolve canonical species pages in batches; downloaded thumbnails are local, lazy-loaded WebP.
const fs=require('fs');
const path=require('path');
const {execFileSync,execFile}=require('child_process');
const {promisify}=require('util');
const sharp=require('sharp');
const {load,root}=require('./helpers/project-harness.cjs');
const {KAIJU}=load('src/data/kaiju.js');
const dir=path.join(root,'public/assets/kaiju');
const manifestFile=path.join(dir,'sources.json');
const official={
  cherubim:{title:'宇宙凶険怪獣 ケルビム',url:'https://m-78.jp/character/z_37',image:'https://m-78.jp/wp-content/uploads/2024/01/ゼット_37_ケルビム_thumb.jpg'},
  satan_delos:{title:'惑星破壊神 サタンデロス',url:'https://m-78.jp/character/trigger_10',image:'https://m-78.jp/wp-content/uploads/2024/01/トリガー_10_サタンデロス_thumb.jpg'},
  megalothor:{title:'邪神 メガロゾーア',url:'https://m-78.jp/character/trigger_30',image:'https://m-78.jp/wp-content/uploads/2024/01/トリガー_32_邪神メガロゾーア第一形態_thumb-2.jpg'},
  mother_sphere:{title:'マザースフィアザウルス',url:'https://m-78.jp/character/decker_mother_sphere_zaurus',image:'https://m-78.jp/wp-content/uploads/2023/01/thumb_decker_mother_sphere_zaurus.jpg'},
};
const get=url=>execFileSync('curl',['-fsSL','--retry','2','--max-time','35',url],{maxBuffer:12e6});
const curl=promisify(execFile);
async function download(url) {
  const source=new URL(url);
  // Original-file endpoints avoid intermittent failures from the remote thumbnail service.
  if(source.hostname==='static.wikia.nocookie.net') {source.pathname=source.pathname.split('/revision/')[0];source.search='';}
  const result=await curl('curl',['-fsSL','--retry','2','--max-time','30',source.href],{encoding:'buffer',maxBuffer:25e6});
  return result.stdout;
}
async function main() {
  fs.mkdirSync(dir,{recursive:true});
  const manifest=fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile,'utf8')) : {};
  for(const [id,entry] of Object.entries(official)) {const item=KAIJU.find(row=>row.id===id);if(item)manifest[id]={...entry,requested:item.wiki,file:`${id}.webp`};}
  for(const id of Object.keys(manifest)) if(!KAIJU.some(item=>item.id===id))delete manifest[id];
  fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
  const pending=KAIJU.filter(item=>!manifest[item.id] || manifest[item.id].requested!==item.wiki);
  for(let i=0;i<pending.length;i+=20) {
    const batch=pending.slice(i,i+20);
    const url=new URL('https://ultra.fandom.com/api.php');
    url.search=new URLSearchParams({action:'query',format:'json',redirects:'1',prop:'pageimages',piprop:'thumbnail',pithumbsize:'384',titles:batch.map(item=>item.wiki).join('|')});
    const data=JSON.parse(get(url));
    const redirects=[...(data.query?.normalized||[]),...(data.query?.redirects||[])];
    for(const item of batch) {
      let title=item.wiki;
      for(let n=0;n<5;n++) {const match=redirects.find(row=>row.from===title);if(!match)break;title=match.to;}
      const page=Object.values(data.query?.pages||{}).find(row=>row.title===title);
      if(!page?.thumbnail?.source) {console.log('MISSING',item.id,item.wiki);continue;}
      manifest[item.id]={requested:item.wiki,title:page.title,pageId:page.pageid,url:`https://ultra.fandom.com/wiki/${encodeURIComponent(page.title.replaceAll(' ','_'))}`,image:page.thumbnail.source,file:`${item.id}.webp`};
    }
    fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
    console.log('Resolved',Math.min(i+20,pending.length),'/',pending.length);
  }
  if(process.argv.includes('--resolve-only')) return;
  const queue=KAIJU.filter(item=>!fs.existsSync(path.join(dir,`${item.id}.webp`)));
  const results=await Promise.allSettled(Array.from({length:3},async()=>{
    while(queue.length) {
      const item=queue.shift(),entry=manifest[item.id];
      if(!entry)throw new Error(`Missing canonical image: ${item.id}`);
      await sharp(await download(entry.image)).resize(384,384,{fit:'contain',background:'#e2e8e4'}).webp({quality:78}).toFile(path.join(dir,entry.file));
      console.log('Image',item.id);
    }
  }));
  const failures=results.filter(result=>result.status==='rejected');
  if(failures.length)throw new AggregateError(failures.map(result=>result.reason),'Some monster images could not be downloaded');
}
main().catch(error=>{console.error(error.errors?.map(item=>item.message).join('\n') || error.message);process.exitCode=1;});
