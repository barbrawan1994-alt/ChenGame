const fs=require('fs');
const path=require('path');
const {execFileSync,execFile}=require('child_process');
const {promisify}=require('util');
const {prepareDeviceArtwork}=require('./helpers/device-art.cjs');
const {load,root}=require('./helpers/project-harness.cjs');
const {ULTRA_DEVICE_MODELS}=load('src/data/ultraDevices.js');
const selected=process.argv.slice(2);
const models=selected.length ? ULTRA_DEVICE_MODELS.filter(item=>selected.includes(item.id)) : ULTRA_DEVICE_MODELS;
const dir=path.join(root,'public/assets/ultra-devices');
const manifestFile=path.join(dir,'sources.json');
const curl=promisify(execFile);
const query=params=>{
  const url=new URL('https://ultra.fandom.com/api.php');
  url.search=new URLSearchParams({action:'query',format:'json',...params});
  return JSON.parse(execFileSync('curl',['-fsSL','--retry','2','--max-time','30',url.href],{maxBuffer:8e6}));
};
async function main(){
  fs.mkdirSync(dir,{recursive:true});
  const sources=fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile)) : {};
  for(let i=0;i<models.length;i+=15){
    const batch=models.slice(i,i+15).filter(x=>!sources[x.id] || sources[x.id].imageFile!==x.imageFile);
    if(!batch.length)continue;
    const data=query({titles:batch.map(x=>x.wiki).join('|'),redirects:'1',prop:'pageimages',piprop:'thumbnail',pithumbsize:'500'});
    for(const item of batch){
      let title=item.wiki;
      for(const redirect of [...(data.query.normalized || []),...(data.query.redirects || [])])if(title===redirect.from)title=redirect.to;
      const page=Object.values(data.query.pages).find(x=>x.title===title);
      const filePage=item.imageFile ? Object.values(query({titles:`File:${item.imageFile}`,prop:'imageinfo',iiprop:'url'}).query.pages)[0] : null;
      const image=filePage?.imageinfo?.[0]?.url || (!item.imageFile && page?.thumbnail?.source);
      if(!image){console.log('MISSING',item.id,item.wiki);continue;}
      sources[item.id]={name:item.name,title:page.title,pageId:page.pageid,imageFile:item.imageFile,url:`https://ultra.fandom.com/wiki/${encodeURIComponent(page.title.replaceAll(' ','_'))}`,image,file:`${item.id}.webp`};
    }
    fs.writeFileSync(manifestFile,JSON.stringify(sources,null,2)+'\n');
  }
  const queue=models.filter(x=>sources[x.id]);
  const results=await Promise.allSettled(Array.from({length:3},async()=>{
    while(queue.length){
      const item=queue.shift(),entry=sources[item.id],url=new URL(entry.image);
      if(url.hostname==='static.wikia.nocookie.net'){url.pathname=url.pathname.split('/revision/')[0];url.search='';}
      const {stdout}=await curl('curl',['-fsSL','--retry','2','--max-time','30',url.href],{encoding:'buffer',maxBuffer:25e6});
      const matte=['pikari_brush','leo_ring'].includes(item.id) ? {lightThreshold:180,matteTolerance:60} : {};
      fs.writeFileSync(path.join(dir,entry.file),await prepareDeviceArtwork(stdout,matte));
      console.log('Image',item.id);
    }
  }));
  for(const result of results)if(result.status==='rejected')throw result.reason;
  const missing=ULTRA_DEVICE_MODELS.filter(x=>!fs.existsSync(path.join(dir,`${x.id}.webp`)));
  if(missing.length)throw new Error(`Missing device images: ${missing.map(x=>x.id).join(', ')}`);
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
