const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const sharp=require('sharp');
const {prepareDeviceArtwork}=require('./helpers/device-art.cjs');
const {load,root}=require('./helpers/project-harness.cjs');
const {ULTRA_DEVICE_DESIGNS}=load('src/data/ultraDeviceDesigns.js');
const dir=path.join(root,'public/assets/ultra-devices');
const plate=(d,fill='metal')=>`<path d="${d}" fill="url(#${fill})" stroke="#45545d" stroke-width="3" stroke-linejoin="round"/>`;
const gem=(x,y,r=24)=>`<path d="M${x},${y-r} ${x+r*.8},${y-r*.3} ${x+r*.62},${y+r*.7} ${x},${y+r} ${x-r*.62},${y+r*.7} ${x-r*.8},${y-r*.3}Z" fill="url(#gem)" stroke="#eaf4f5" stroke-width="3"/><path d="M${x},${y-r}V${y+r}M${x-r*.8},${y-r*.3}L${x+r*.62},${y+r*.7}M${x+r*.8},${y-r*.3}L${x-r*.62},${y+r*.7}" stroke="#fff" stroke-opacity=".45" fill="none"/>`;
const ring=(x,y,rx,ry=rx,w=12)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#40515b" stroke-width="${w+4}"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#metal)" stroke-width="${w}"/>`;
const line=(d,w=5)=>`<path d="${d}" fill="none" stroke="url(#accent)" stroke-width="${w}" stroke-linecap="round"/>`;
const star=(x,y,r,points=6)=>Array.from({length:points*2},(_,i)=>{const a=Math.PI*i/points-Math.PI/2,rr=i%2?r*.58:r;return `${i?'L':'M'}${x+Math.cos(a)*rr},${y+Math.sin(a)*rr}`;}).join(' ')+'Z';
const shapes={
  'six-star':()=>plate(star(192,192,123))+ring(192,192,54)+gem(192,192,34)+Array.from({length:6},(_,i)=>`<g transform="rotate(${i*60} 192 192)">${gem(192,99,12)}</g>`).join(''),
  'open-cuff':()=>plate('M270 98C117 25 52 198 142 282L175 250C92 157 188 87 255 139Z')+plate('M284 152L310 216 246 285 208 267 277 203Z')+gem(128,154,28)+line('M112 222C80 157 121 96 189 94'),
  'horn-relic':()=>plate('M124 273L92 203 74 86 122 140 157 115 227 115 262 140 310 86 292 203 260 273Z')+plate('M147 285L149 252 235 252 237 285Z','dark')+gem(192,198,61)+line('M108 154L125 221M276 154L259 221'),
  flute:()=>`<g transform="rotate(28 192 192)">${plate('M172 60Q192 46 212 60L211 307 173 320Z')}${plate('M173 94L133 112 173 132Z')}${plate('M211 155L251 174 211 193Z')}${[125,170,215,260].map(y=>ring(192,y,8,8,3)).join('')}${gem(192,76,14)}${line('M179 97V287',3)}</g>`,
  'chain-lock':()=>ring(192,214,72,59,20)+plate('M148 197L160 132 228 132 243 197 223 243 166 243Z','dark')+gem(194,183,40)+ring(122,95,22,30,9)+ring(99,133,20,29,9)+ring(278,291,20,28,9)+line('M161 277L209 281'),
  crown:()=>plate('M90 263L58 131 120 172 144 84 192 146 240 84 264 172 326 131 294 263Z')+plate('M90 258L294 258 278 290 106 290Z','dark')+gem(192,213,40)+gem(129,229,16)+gem(255,229,16),
  flower:()=>Array.from({length:7},(_,i)=>`<g transform="rotate(${i*360/7} 192 192)">${plate('M192 189Q123 124 166 67Q219 86 211 145Z')}${line('M183 94L194 152')}</g>`).join('')+gem(192,196,34)+plate('M182 238L202 238 218 290 192 325 166 290Z','accent'),
  visor:()=>plate('M66 135L168 114 192 145 216 114 318 135 300 205 231 221 192 185 153 221 84 205Z')+plate('M91 146L155 138 172 166 146 193 98 183Z','dark')+plate('M293 146L229 138 212 166 238 193 286 183Z','dark')+line('M109 161L148 157M236 157L275 161',8)+plate('M106 219L153 232 137 275 86 250Z')+plate('M278 219L231 232 247 275 298 250Z'),
  triad:()=>plate('M192 57L329 293 55 293Z')+plate('M192 101L286 271 97 271Z','dark')+gem(192,141,25)+gem(134,244,25)+gem(251,244,25)+line('M179 174L151 220M206 174L234 220M166 251H217'),
  compass:()=>plate('M99 216L83 128 145 72 239 72 301 128 285 216Z')+plate('M107 212L277 212 311 291 266 322 118 322 73 291Z','dark')+ring(192,151,56)+ring(192,264,49)+plate('M192 109L204 150 192 190 180 150Z','accent')+gem(192,265,19)+line('M103 288L135 305H249L280 288'),
  gauntlet:()=>plate('M128 299L109 214 76 180 81 128 112 116 122 76 157 77 169 63 207 73 217 91 259 84 281 116 295 199 259 240 249 299Z')+plate('M130 299L246 299 242 326 136 326Z','dark')+gem(198,191,43)+line('M121 113L132 148M163 99L169 139M214 113L216 143M255 119L258 151',8),
  fan:()=>Array.from({length:5},(_,i)=>`<g transform="rotate(${i*25-50} 192 286)">${plate('M181 286L156 73 192 48 225 87 204 286Z')}${line('M192 85V244',4)}</g>`).join('')+gem(192,283,23),
  'tuning-fork':()=>plate('M99 58L137 58 143 190Q192 235 241 190L247 58 285 58 278 218 214 267 210 326 174 326 170 267 106 218Z')+gem(192,183,39)+line('M114 82L122 203 176 248M270 82L262 203 208 248',5),
  'swept-wing':()=>plate('M192 99L319 72 272 158 229 181 214 297 192 323 170 297 155 181 112 158 65 72Z')+plate('M172 162L212 162 205 282 179 282Z','dark')+gem(192,147,28)+line('M92 89L124 139 157 150M292 89L260 139 227 150'),
  binocular:()=>plate('M71 116L148 108 162 165 222 165 236 108 313 116 330 252 252 285 218 246 166 246 132 285 54 252Z')+ring(109,218,43,51,16)+ring(275,218,43,51,16)+gem(109,218,27)+gem(275,218,27)+plate('M149 107Q192 48 235 107L224 128Q192 89 160 128Z','dark'),
  earpiece:()=>plate('M271 260C346 171 284 51 195 60C102 64 73 154 103 203L131 184C102 99 220 71 249 136C274 186 244 216 241 247Z')+gem(244,239,25)+plate(star(172,272,48,4),'accent')+plate(star(121,226,31,4))+line('M228 235L172 263M217 209L132 222',4),
  'double-ring':()=>`<g transform="rotate(-26 192 192)">${ring(153,179,78,111,20)}${ring(235,212,64,94,16)}${gem(198,183,35)}${line('M76 193Q59 119 128 85',7)}</g>`,
  'feather-wings':()=>Array.from({length:4},(_,i)=>plate(`M192 246L${81-i*10} ${90+i*48}L${155+i*6} ${160+i*26}L192 183Z`)+plate(`M192 246L${303+i*10} ${90+i*48}L${229-i*6} ${160+i*26}L192 183Z`)).join('')+plate('M177 136L192 62 207 136 223 249 192 314 161 249Z','dark')+gem(192,219,28),
  seed:()=>plate('M180 60C45 155 85 271 177 324L191 250 166 183Z')+plate('M206 59L220 168 198 250 206 325C302 268 328 149 206 59Z')+gem(192,196,48)+line('M150 126Q106 186 145 257M241 130Q280 203 238 264',4),
  hourglass:()=>plate('M96 66L288 66 285 101 229 175 229 207 285 282 288 318 96 318 99 282 155 207 155 175 99 101Z')+plate('M125 98L259 98 213 167 171 167Z','dark')+plate('M125 287L259 287 213 218 171 218Z','dark')+gem(192,192,26)+line('M143 110L182 158M202 228L242 273',9),
  orrery:()=>ring(192,192,122,70,13)+`<g transform="rotate(60 192 192)">${ring(192,192,122,70,13)}</g><g transform="rotate(-60 192 192)">${ring(192,192,122,70,13)}</g>`+gem(192,192,41)+gem(82,169,18)+gem(239,78,15)+gem(245,304,15),
  'kite-shield':()=>plate('M192 49L293 114 277 224 192 334 107 224 91 114Z')+plate('M192 83L261 132 244 213 192 282 140 213 123 132Z','dark')+gem(192,170,45)+line('M192 225V265M116 135L132 210M268 135L252 210',6),
  'claw-seal':()=>plate('M79 110L119 140 130 72 171 135 195 52 229 130 276 77 267 162 313 149 276 251 192 307 103 251Z')+ring(192,210,58,58,15)+gem(192,210,29)+line('M130 248L154 265M255 241L231 265'),
  dial:()=>plate('M109 78Q192 48 274 80L304 256Q272 314 111 305L75 241Z')+ring(189,164,66,66,20)+plate('M189 108L205 153 189 170 176 151Z','accent')+gem(126,254,15)+gem(254,251,15)+plate('M169 245L217 245 213 275 171 275Z','dark'),
  lyre:()=>plate('M74 88L128 60 120 211Q192 289 264 211L256 60 310 88 294 244Q192 350 90 244Z')+plate('M113 115H271V138H113Z','dark')+Array.from({length:5},(_,i)=>line(`M${148+i*22} 139V${244+Math.sin(i)*8}`,2)).join('')+gem(192,280,20),
  'capsule-ball':()=>ring(192,192,118,118,8)+plate('M82 163Q99 77 185 71L174 177 79 210Z')+plate('M205 71Q296 87 309 174L218 166Z')+plate('M300 205Q282 299 198 309L213 214Z')+plate('M174 308Q97 294 76 229L170 204Z')+gem(192,192,28)+line('M103 151Q118 107 158 96M279 232Q261 275 222 286',7),
  hammer:()=>`<g transform="rotate(-25 192 192)">${plate('M173 144L211 144 218 322 166 322Z','dark')}${plate('M64 88L111 62 277 62 319 93 306 155 268 177 110 177 68 149Z')}${gem(192,118,35)}${line('M104 94L114 145M274 94L264 145',8)}${plate('M166 296H219V324H166Z')}</g>`,
  cube:()=>plate('M192 58L306 119 306 258 192 326 78 258 78 119Z')+plate('M192 83L279 131 192 183 105 131Z','dark')+plate('M99 153L174 197 174 294 99 247Z','dark')+plate('M285 153L210 197 210 294 285 247Z','accent')+gem(192,151,27)+line('M118 185L151 204V251',6),
  hairpin:()=>`<g transform="rotate(25 192 192)">${plate('M179 139L205 139 194 332 181 318Z')}${plate('M159 139L173 144 159 313 151 294Z')}${plate(star(192,112,68,5))}${gem(192,112,27)}${line('M215 125Q288 170 257 237',4)}${gem(257,244,19)}</g>`,
  'thorn-staff':()=>plate('M173 111L161 68 217 46 257 101 248 161 222 188 208 324 181 327 187 170 209 147 219 104 201 83Z','dark')+plate('M181 177L134 142 158 201 184 217Z')+plate('M209 222L253 192 231 256 205 270Z')+gem(198,132,29)+line('M195 212L190 300',5),
  'inverted-prism':()=>plate('M63 106L308 88 220 319Z')+plate('M100 129L267 116 214 269Z','dark')+plate('M75 151L88 214 268 185 287 131 262 139 245 159 102 178Z')+gem(189,173,31)+line('M124 146L212 249',4),
  anchor:()=>plate('M173 97H211V210L259 238 286 203 314 248 262 292 210 267 192 325 174 267 122 292 70 248 98 203 125 238 173 210Z')+ring(192,91,36,36,16)+gem(192,228,26)+line('M110 262L126 272 167 248M274 262L258 272 217 248',6),
  sickle:()=>plate('M117 94Q244 23 313 185L267 172Q222 95 156 141L147 270 118 325 101 288Z')+plate('M150 160L240 201 259 262 193 221 139 214Z','dark')+gem(140,155,22)+line('M179 99Q251 83 284 148',4),
  spine:()=>plate('M178 62L206 62 225 126 269 83 244 157 291 144 244 198 299 217 235 239 263 298 213 276 192 332 171 276 121 298 149 239 85 217 140 198 93 144 140 157 115 83 159 126Z','dark')+gem(192,187,55)+line('M185 264L192 303 199 264',5),
  mask:()=>plate('M81 91L188 117 181 195 192 308 108 261 63 165Z')+plate('M204 91L309 112 321 188 273 279 211 310 221 182Z','dark')+gem(128,168,26)+gem(264,178,26)+line('M130 236L158 252M248 249L270 227'),
  'twin-blade':()=>plate('M80 62L160 139 181 239 120 307 126 208 89 164Z')+plate('M304 322L224 245 203 145 264 77 258 176 295 220Z')+plate('M150 170L217 141 241 205 176 237Z','dark')+gem(193,193,28)+line('M101 109L143 153M283 275L241 231',5),
  helix:()=>plate('M131 55C346 122 26 219 249 329L266 293C93 218 357 124 150 55Z')+plate('M253 55C38 122 358 219 135 329L118 293C291 218 27 124 234 55Z','dark')+gem(192,187,38)+line('M156 99H225M141 270H235',5),
  'hex-lantern':()=>ring(192,78,30,30,12)+plate('M127 100L256 100 288 181 260 282 192 321 124 282 96 181Z','dark')+plate('M145 117L178 117 173 282 140 264Z')+plate('M239 117L206 117 211 282 244 264Z')+gem(192,188,33)+line('M114 177L131 129M270 177L253 129'),
  monocular:()=>plate('M62 150L128 170 149 125 235 125 256 170 322 150 298 227 248 246 136 246 86 227Z','dark')+ring(192,189,66,66,20)+gem(192,189,44)+line('M88 178L108 211M296 178L276 211',7)+plate('M157 278L168 246H216L227 278Z'),
  'split-lens':()=>plate('M56 124L138 99 167 140 213 127 244 87 328 116 312 190 254 213 219 173 171 184 123 218 71 187Z','dark')+plate('M82 134L128 122 147 149 118 184 91 168Z','accent')+plate('M238 138L254 113 302 129 294 172 265 185Z','accent')+gem(192,156,20)+line('M107 235L145 253M240 237L284 218',10),
  ribbon:()=>plate('M217 96C352 57 330 289 170 239C18 192 86 55 178 90L163 118C101 101 88 184 182 205C281 227 311 110 229 127Z')+plate('M174 213L208 212 217 319 177 329Z','dark')+gem(195,204,26)+line('M246 103Q315 127 269 195',5),
  knuckle:()=>plate('M69 99L307 84 331 165 289 202 257 297 126 305 100 214 55 180Z')+[108,166,224,282].map((x,i)=>ring(x,140-i*3,21,27,12)).join('')+plate('M126 217L254 206 235 277 141 281Z','dark')+gem(191,242,29),
  rapier:()=>plate('M177 77L195 43 208 88 201 227 175 229Z')+plate('M176 193L98 118 70 168 116 220 180 254 230 257 286 198 255 187 215 221Z')+plate('M177 250H209L218 318 183 333 166 317Z','dark')+gem(191,232,21)+line('M191 93L189 193',4),
  trident:()=>plate('M183 39L204 74 210 147 235 173 278 94 311 91 290 184 217 231 207 332 177 332 166 231 93 184 73 91 106 94 149 173 175 147Z','dark')+gem(192,192,39)+line('M92 118L111 170 162 208M292 118L273 170 222 208M192 250V311',6),
};
function artwork(design){
  const [,shape,color]=design;
  if(!shapes[shape])throw new Error(`Missing silhouette: ${shape}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384" viewBox="0 0 384 384"><defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fcffff"/><stop offset=".28" stop-color="#bbc9cc"/><stop offset=".46" stop-color="#f3f5e9"/><stop offset=".51" stop-color="#71848f"/><stop offset=".73" stop-color="#d8e2e1"/><stop offset="1" stop-color="#62747e"/></linearGradient><linearGradient id="dark" x2=".8" y2="1"><stop stop-color="#465b69"/><stop offset=".5" stop-color="#192936"/><stop offset="1" stop-color="#6b7b83"/></linearGradient><linearGradient id="accent" x2=".7" y2="1"><stop stop-color="#e6f1eb"/><stop offset=".35" stop-color="${color}"/><stop offset="1" stop-color="#405969"/></linearGradient><radialGradient id="gem" cx=".3" cy=".2" r=".95"><stop stop-color="#fff"/><stop offset=".24" stop-color="${color}"/><stop offset=".68" stop-color="${color}"/><stop offset="1" stop-color="#15263b"/></radialGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="1" dy="10" stdDeviation="7" flood-color="#203646" flood-opacity=".27"/></filter></defs><rect width="384" height="384" fill="#e8eceb"/><g filter="url(#shadow)">${shapes[shape]()}</g></svg>`;
}
(async()=>{
  const manifest={};
  for(const [heroId,design] of Object.entries(ULTRA_DEVICE_DESIGNS)){
    const svg=artwork(design),file=`original-${heroId}.webp`;
    const bytes=await prepareDeviceArtwork(Buffer.from(svg.replace('<rect width="384" height="384" fill="#e8eceb"/>','')));
    fs.writeFileSync(path.join(dir,file),bytes);
    manifest[heroId]={name:design[0],silhouette:design[1],description:design[3],file,source:'Original game prop illustration',sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
  }
  fs.writeFileSync(path.join(dir,'originals.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(`Rendered ${Object.keys(manifest).length} distinct original props`);
})().catch(error=>{console.error(error);process.exitCode=1;});
