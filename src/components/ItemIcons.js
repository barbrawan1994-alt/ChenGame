import React from 'react';
import { BALL_ICONS, MED_ICONS, STONE_ICONS, ACC_ICONS, GROWTH_ICONS, TM_COLORS as TM_ICON_COLORS } from '../data/itemIcons';
import { getFruitIcon } from '../data/devilfruits';

export const renderBallCSS = (ballId, size = 40) => {
  const b = BALL_ICONS[ballId];
  if (!b) return null;
  const bh = Math.max(2, size * 0.08);
  const br = Math.max(6, size * 0.18);
  return (
    <div style={{width:size,height:size,position:'relative',borderRadius:'50%',overflow:'hidden',boxShadow:`0 2px 8px ${b.glow}, inset 0 1px 2px rgba(255,255,255,0.4)`,flexShrink:0}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:b.top}} />
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:b.bottom}} />
      {b.stripes && <><div style={{position:'absolute',top:'12%',left:'8%',right:'8%',height:3,background:'rgba(255,0,0,0.4)',borderRadius:2}} /><div style={{position:'absolute',top:'24%',left:'15%',right:'15%',height:2,background:'rgba(255,0,0,0.3)',borderRadius:2}} /></>}
      {b.bolt && <div style={{position:'absolute',top:'12%',left:'50%',transform:'translateX(-50%)',color:'#FFD600',fontSize:size*0.35,fontWeight:900,textShadow:'0 0 4px #FF6F00',lineHeight:1}}>{'\u26A1'}</div>}
      {b.cross && <div style={{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:size*0.32,fontWeight:900,lineHeight:1}}>+</div>}
      {b.letter && <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',color:'#E040FB',fontSize:size*0.3,fontWeight:900,textShadow:'0 0 6px rgba(224,64,251,0.6)',lineHeight:1}}>{b.letter}</div>}
      {b.mesh && <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)'}} />}
      <div style={{position:'absolute',top:'50%',left:0,right:0,height:bh,transform:'translateY(-50%)',background:b.band,zIndex:2}} />
      <div style={{position:'absolute',top:'50%',left:'50%',width:br,height:br,transform:'translate(-50%,-50%)',borderRadius:'50%',background:b.btn,border:`${Math.max(1,size*0.04)}px solid #555`,zIndex:3,boxShadow:'0 0 4px rgba(0,0,0,0.3)'}} />
      <div style={{position:'absolute',top:'4%',left:'15%',width:size*0.2,height:size*0.1,background:'rgba(255,255,255,0.5)',borderRadius:'50%',transform:'rotate(-30deg)'}} />
    </div>
  );
};

export const renderMedCSS = (medId, size = 40) => {
  const m = MED_ICONS[medId];
  if (!m) return null;
  const s = size;
  const wrap = {width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0};
  const shineEl = m.shine ? <div style={{position:'absolute',top:'12%',right:'18%',width:4,height:4,background:'#fff',borderRadius:'50%',boxShadow:'0 0 6px #fff'}} /> : null;
  if (m.shape === 'bottle') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'8%',left:'35%',right:'35%',height:'14%',background:m.cap,borderRadius:'3px 3px 0 0'}} />
      <div style={{position:'absolute',top:'20%',left:'24%',right:'24%',height:'70%',background:`linear-gradient(135deg,${m.c},${m.c}dd)`,borderRadius:'4px 4px 8px 8px',boxShadow:`0 2px 8px ${m.c}40`,overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'35%',height:'100%',background:'rgba(255,255,255,0.2)',borderRadius:'4px 0 0 8px'}} />
        {shineEl}
      </div>
      <div style={{position:'absolute',bottom:'22%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.2,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.3)',lineHeight:1}}>{m.label}</div>
    </div>
  );
  if (m.shape === 'flask') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'6%',left:'38%',right:'38%',height:'16%',background:m.cap,borderRadius:'3px 3px 1px 1px'}} />
      <div style={{position:'absolute',top:'20%',left:'20%',right:'20%',height:'68%',background:`linear-gradient(135deg,${m.c},${m.c}cc)`,borderRadius:'30% 30% 50% 50%',boxShadow:`0 2px 8px ${m.c}40`,overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'30%',height:'100%',background:'rgba(255,255,255,0.2)'}} />
        {shineEl}
      </div>
      <div style={{position:'absolute',bottom:'24%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.19,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.3)',lineHeight:1}}>{m.label}</div>
    </div>
  );
  if (m.shape === 'tube') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'14%',left:'30%',right:'30%',height:'62%',background:'linear-gradient(180deg,#f5f5f5,#e0e0e0)',borderRadius:6,boxShadow:'0 1px 4px rgba(0,0,0,0.15)',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:m.c,opacity:0.7}} />
      </div>
      <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:8,height:8,background:m.accent,borderRadius:2}} />
      <div style={{position:'absolute',bottom:'20%',left:'50%',transform:'translateX(-50%)',color:m.accent,fontSize:s*0.28,fontWeight:900,lineHeight:1}}>{m.sym}</div>
    </div>
  );
  if (m.shape === 'crystal') return (
    <div style={wrap}>
      <div style={{width:s*0.6,height:s*0.7,background:`linear-gradient(135deg,${m.c},${m.accent})`,clipPath:'polygon(50% 0%,100% 35%,80% 100%,20% 100%,0% 35%)',boxShadow:`0 2px 10px ${m.c}60`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.3)'}} />
        {shineEl}
      </div>
    </div>
  );
  if (m.shape === 'diamond') return (
    <div style={wrap}>
      <div style={{width:s*0.55,height:s*0.55,background:`linear-gradient(135deg,${m.c},${m.accent})`,transform:'rotate(45deg)',borderRadius:4,boxShadow:`0 2px 10px ${m.c}50`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.3)'}} />
        {shineEl}
      </div>
    </div>
  );
  return null;
};

export const renderStoneCSS = (stoneId, size = 40) => {
  const st = STONE_ICONS[stoneId];
  if (!st) return null;
  const s = size;
  const r = s * 0.14;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.72,height:s*0.72,background:`linear-gradient(135deg,${st.c1},${st.c2})`,borderRadius:r,transform:'rotate(12deg)',boxShadow:`0 2px 10px ${st.glow}60, inset 0 1px 2px rgba(255,255,255,0.4)`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.2)',borderRadius:`${r}px 0 0 ${r}px`}} />
        <div style={{position:'absolute',top:'8%',right:'12%',width:s*0.1,height:s*0.1,background:'rgba(255,255,255,0.6)',borderRadius:'50%'}} />
      </div>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#fff',fontSize:s*0.38,fontWeight:900,textShadow:`0 1px 3px rgba(0,0,0,0.3), 0 0 8px ${st.glow}80`,lineHeight:1}}>{st.sym}</div>
    </div>
  );
};

export const renderAccCSS = (accId, size = 40) => {
  const a = ACC_ICONS[accId];
  if (!a) return null;
  const s = size;
  const clips = {
    star:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
    crown:'polygon(0% 100%,10% 35%,30% 60%,50% 15%,70% 60%,90% 35%,100% 100%)',
    shield:'polygon(50% 0%,100% 15%,95% 65%,50% 100%,5% 65%,0% 15%)',
    trophy:'polygon(15% 0%,85% 0%,95% 30%,70% 55%,72% 65%,60% 65%,60% 80%,75% 85%,75% 100%,25% 100%,25% 85%,40% 80%,40% 65%,28% 65%,30% 55%,5% 30%)',
    fang:'polygon(50% 0%,100% 30%,80% 100%,50% 85%,20% 100%,0% 30%)',
    round:'',
  };
  const clip = clips[a.shape] || '';
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.78,height:s*0.78,background:`linear-gradient(135deg,${a.c},${a.b})`,clipPath:clip||undefined,borderRadius:clip?undefined:'50%',boxShadow:`0 2px 8px ${a.c}40`,position:'relative'}} />
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#fff',fontSize:s*0.34,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.4)',lineHeight:1}}>{a.sym}</div>
    </div>
  );
};

export const renderGrowthCSS = (growthId, size = 40) => {
  const g = GROWTH_ICONS[growthId];
  if (!g) return null;
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.78,height:s*0.78,background:g.bg,borderRadius:s*0.18,border:`2px solid ${g.c}`,boxShadow:`0 2px 6px ${g.c}30`,position:'relative',overflow:'hidden'}}>
        {g.shine && <div style={{position:'absolute',top:'10%',right:'15%',width:5,height:5,background:'#fff',borderRadius:'50%',boxShadow:`0 0 6px ${g.c}`}} />}
      </div>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:g.c,fontSize:s*0.26,fontWeight:900,lineHeight:1}}>{g.sym}</div>
    </div>
  );
};

export const renderTMCSS = (tmType, size = 40) => {
  const color = TM_ICON_COLORS[tmType] || '#78909C';
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.76,height:s*0.76,background:`radial-gradient(circle at 40% 40%,${color}cc,${color})`,borderRadius:'50%',boxShadow:`0 2px 8px ${color}50, inset 0 -2px 4px rgba(0,0,0,0.2)`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',width:s*0.28,height:s*0.28,transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.25)',borderRadius:'50%'}} />
        <div style={{position:'absolute',top:'50%',left:'50%',width:s*0.08,height:s*0.08,transform:'translate(-50%,-50%)',background:'#fff',borderRadius:'50%'}} />
        <div style={{position:'absolute',top:'6%',left:'22%',width:s*0.18,height:s*0.08,background:'rgba(255,255,255,0.4)',borderRadius:'50%',transform:'rotate(-25deg)'}} />
      </div>
      <div style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.16,fontWeight:800,background:color,padding:'0 3px',borderRadius:2,lineHeight:1.3}}>TM</div>
    </div>
  );
};

export const renderMiscCSS = (size = 40) => {
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.7,height:s*0.7,background:'linear-gradient(135deg,#FCE4EC,#fff)',borderRadius:'50%',border:'2px solid #E91E63',boxShadow:'0 2px 6px rgba(233,30,99,0.3)'}} />
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#E91E63',fontSize:s*0.38,fontWeight:900,lineHeight:1}}>{'\u27F3'}</div>
    </div>
  );
};

export const renderItemIcon = (category, itemId, size = 36, tmType) => {
  if (category === 'ball') return renderBallCSS(itemId, size);
  if (category === 'med') return renderMedCSS(itemId, size);
  if (category === 'stone') return renderStoneCSS(itemId, size);
  if (category === 'acc') return renderAccCSS(itemId, size);
  if (category === 'growth') return renderGrowthCSS(itemId, size);
  if (category === 'tm') return renderTMCSS(tmType || 'NORMAL', size);
  if (category === 'misc') return renderMiscCSS(size);
  return null;
};

export const renderFruitCSSIcon = (fruitId, size = 44) => {
  const icon = getFruitIcon(fruitId);
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: icon.bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 4px rgba(255,255,255,0.15)`,
      flexShrink: 0, border: '2px solid rgba(255,255,255,0.12)'
    }}>
      {icon.pattern && <div style={{position:'absolute', inset:0, background:icon.pattern, borderRadius:'50%'}} />}
      <span style={{
        position:'relative', zIndex:1,
        fontSize: `${Math.round(size * 0.5)}px`,
        lineHeight: 1,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
      }}>{icon.symbol}</span>
    </div>
  );
};
