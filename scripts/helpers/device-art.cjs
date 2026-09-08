const sharp=require('sharp');
const DEVICE_BACKGROUND='#101815';

async function prepareDeviceArtwork(input,{lightThreshold=228,matteTolerance=16}={}){
  const {data,info}=await sharp(input).resize(640,640,{fit:'inside',withoutEnlargement:true}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const {width,height}=info,seen=new Uint8Array(width*height),queue=[];
  const background=(i)=>{
    const [r,g,b,a]=data.subarray(i*4,i*4+4);
    return a<20 || Math.max(r,g,b)<36 || (Math.min(r,g,b)>lightThreshold && Math.max(r,g,b)-Math.min(r,g,b)<matteTolerance);
  };
  const add=i=>{if(i>=0&&i<seen.length&&!seen[i]&&background(i)){seen[i]=1;queue.push(i);}};
  for(let x=0;x<width;x++){add(x);add((height-1)*width+x);}
  for(let y=0;y<height;y++){add(y*width);add(y*width+width-1);}
  // Remove only edge-connected matte; internal black metal and bright highlights survive.
  for(let q=0;q<queue.length;q++){
    const i=queue[q],x=i%width;data[i*4+3]=0;
    if(x>0)add(i-1);if(x<width-1)add(i+1);add(i-width);add(i+width);
  }
  const cropped=await sharp(data,{raw:{width,height,channels:4}}).trim({threshold:8}).resize(304,304,{fit:'inside'}).png().toBuffer();
  return sharp({create:{width:384,height:384,channels:3,background:DEVICE_BACKGROUND}}).composite([{input:cropped,gravity:'centre'}]).webp({quality:90}).toBuffer();
}
module.exports={prepareDeviceArtwork,DEVICE_BACKGROUND};
