import React, { useEffect, useRef } from 'react';
import '../../styles/battle-tactics.css';

const COLORS = {FIRE:'#ff886d',WATER:'#9ce5f3',ELECTRIC:'#ffe48b',GRASS:'#9cdeb2',ICE:'#d1f4ff',PSYCHIC:'#e7add7',DARK:'#cbbedf',LIGHT:'#fff0b7',FIGHT:'#f9b7a4',STEEL:'#e0e9e8',NORMAL:'#e8ede9',WIND:'#c3edcc',HEAL:'#9de7bd'};

function locateSprite(stage, side, slot, bounds) {
  const selector = `.${side}-zone-v2${slot===1 ? '.battle-slot-secondary' : ':not(.battle-slot-secondary)'} .sprite-v2`;
  const rect = stage.querySelector(selector)?.getBoundingClientRect();
  return rect ? {x:rect.left+rect.width/2-bounds.left,y:rect.top+rect.height/2-bounds.top,width:rect.width,height:rect.height,size:Math.max(64,rect.width)} : {x:bounds.width*(side==='enemy' ? .65 : .35),y:bounds.height*(side==='enemy' ? .35 : .65),width:100,height:100,size:100};
}

export default function BattleImpact({ event, reduced = false }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas = canvasRef.current;
    const stage = canvas?.closest('.battle-stage-v2');
    if (!event || !stage) return undefined;
    const bounds = stage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.round(bounds.width*ratio);
    canvas.height = Math.round(bounds.height*ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.scale(ratio,ratio);
    const origin = locateSprite(stage,event.source,event.atkSlot || 0,bounds);
    const target = locateSprite(stage,event.target,event.defSlot || 0,bounds);
    const sourceSprite = stage.querySelector(`.${event.source}-zone-v2${event.atkSlot===1 ? '.battle-slot-secondary' : ':not(.battle-slot-secondary)'} .sprite-v2`);
    const originalVisibility = sourceSprite?.style.visibility || '';
    const restoreSource = () => { if (sourceSprite) sourceSprite.style.visibility = originalVisibility; };
    const portrait = event.castPortrait ? new Image() : null;
    if (portrait) portrait.src = event.castPortrait;
    canvas.dataset.targetX = String(Math.round(target.x));
    canvas.dataset.targetY = String(Math.round(target.y));
    canvas.dataset.targetSide = event.target;
    canvas.dataset.targetSlot = String(event.defSlot || 0);
    canvas.dataset.kind = event.kind;
    const color = COLORS[event.type] || '#dfc9e5';
    const quiet = reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lifetime = quiet ? 1100 : 920;
    const started = performance.now();
    let frame;
    const stroke = (points,width,alpha=1,strokeColor=color) => {
      ctx.globalAlpha = alpha;ctx.strokeStyle=strokeColor;ctx.lineWidth=width;ctx.lineCap='round';
      ctx.beginPath();points.forEach(([x,y],index)=>index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));ctx.stroke();
    };
    const draw = now => {
      const progress = Math.min(1,(now-started)/lifetime);
      ctx.clearRect(0,0,bounds.width,bounds.height);
      if (progress>=1) { restoreSource(); return; }
      // Keep the casting portrait through the effect after gameplay consumes the form.
      if (portrait?.complete && portrait.naturalWidth>0) {
        if (sourceSprite) sourceSprite.style.visibility = 'hidden';
        ctx.globalAlpha = 1;
        ctx.drawImage(portrait,origin.x-origin.width/2,origin.y-origin.height/2,origin.width,origin.height);
      }
      const impact = Math.max(0,Math.min(1,(progress-.15)/.7));
      const scale = Math.min(1.4,target.size/100);
      if (!quiet) {
        ctx.save();ctx.globalCompositeOperation='lighter';
        if (['guard','heal','support','aura'].includes(event.kind)) {
          const alpha=Math.sin(progress*Math.PI);
          const radius=(event.kind==='aura' ? 60 : 43)*scale;
          ctx.save();ctx.translate(target.x,target.y);
          if (event.kind==='guard') {
            const shield=[[-radius,-radius*.6],[0,-radius],[radius,-radius*.6],[radius*.8,radius*.5],[0,radius],[-radius*.8,radius*.5],[-radius,-radius*.6]];
            stroke(shield,9,alpha*.12,'#bce9e4');stroke(shield,1.7,alpha,'#d9fff3');
            stroke([[-radius*.45,0],[-radius*.1,radius*.28],[radius*.5,-radius*.35]],2,alpha,'#ffffff');
          } else {
            for(let index=0;index<8;index++) {
              const angle=index*Math.PI/4;
              const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius-progress*24;
              stroke([[x,y+12],[x,y-6]],2,alpha*.7,event.kind==='heal' ? COLORS.HEAL : color);
              if(event.kind==='heal') stroke([[x-5,y+3],[x+5,y+3]],2,alpha*.7,COLORS.HEAL);
            }
            ctx.globalAlpha=alpha*.55;ctx.strokeStyle=color;ctx.lineWidth=1.3;
            ctx.beginPath();ctx.ellipse(0,radius*.7,radius*(.8+progress*.4),radius*.28,0,0,Math.PI*2);ctx.stroke();
          }
          ctx.restore();
        } else if (event.kind==='beam' && progress<.6) {
          const alpha = Math.sin(Math.min(1,progress/.6)*Math.PI);
          const end = {x:origin.x+(target.x-origin.x)*Math.min(1,progress/.18),y:origin.y+(target.y-origin.y)*Math.min(1,progress/.18)};
          stroke([[origin.x,origin.y],[end.x,end.y]],23*scale,alpha*.18);
          stroke([[origin.x,origin.y],[end.x,end.y]],8*scale,alpha*.8);
          stroke([[origin.x,origin.y],[end.x,end.y]],2.5*scale,alpha,'#ffffff');
          for(let index=0;index<5;index++) {
            const offset=(index-2)*6*scale;
            stroke([[origin.x,origin.y+offset],[end.x,end.y+offset]],.8,alpha*.5);
          }
        } else if (event.kind==='slash' && progress<.6) {
          ctx.save();ctx.translate(target.x,target.y);ctx.rotate(-.65);
          const length=95*scale*Math.sin(Math.min(1,progress/.5)*Math.PI/2);
          for (const [width,alpha,tint] of [[18,.16,color],[6,.7,color],[2.2,1,'#ffffff']]) {
            ctx.globalAlpha=(1-progress)*alpha;ctx.strokeStyle=tint;ctx.lineWidth=width*scale;
            ctx.beginPath();ctx.moveTo(-length,32);ctx.quadraticCurveTo(0,-50,length,-20);ctx.stroke();
          }
          stroke([[-length*.65,38],[0,1],[length*.75,-5]],1.2,(1-progress)*.7);
          ctx.restore();
        } else if (event.kind==='projectile' && progress<.3) {
          const travel=Math.min(1,progress/.22);
          const x=origin.x+(target.x-origin.x)*travel,y=origin.y+(target.y-origin.y)*travel;
          if(event.type==='ELECTRIC') {
            const points=Array.from({length:9},(_,index)=>{const t=index/8;return [origin.x+(x-origin.x)*t,origin.y+(y-origin.y)*t+(index%2 ? 15 : -8)*Math.sin(t*Math.PI)];});
            stroke(points,9*scale,.2);stroke(points,2*scale,.95,'#fff9db');
          } else {
            stroke([[x-(target.x-origin.x)*.15,y-(target.y-origin.y)*.15],[x,y]],16*scale,.15);
            stroke([[x-(target.x-origin.x)*.1,y-(target.y-origin.y)*.1],[x,y]],5*scale,1-progress);
            stroke([[x-(target.x-origin.x)*.035,y-(target.y-origin.y)*.035],[x,y]],2*scale,.95,'#ffffff');
            for(let index=0;index<6;index++) {
              const tail=travel-index*.025;
              if(tail<0) continue;
              const tx=origin.x+(target.x-origin.x)*tail,ty=origin.y+(target.y-origin.y)*tail+Math.sin(index*2.4+progress*8)*12*scale;
              stroke([[tx,ty],[tx+4,ty-7]],event.type==='FIRE' ? 3 : 1,.65-index*.07);
            }
          }
        }
        if (progress>.14 && event.damage>0) {
          const radius=(10+impact*56)*scale;
          ctx.globalAlpha=(1-impact)*.65;ctx.strokeStyle=color;ctx.lineWidth=(1-impact)*3;
          ctx.beginPath();ctx.ellipse(target.x,target.y,radius,radius*.6,-.25,0,Math.PI*2);ctx.stroke();
          for(let index=0;index<(event.critical ? 18 : 10);index++) {
            const angle=index*2.399+event.id;
            const distance=(12+impact*(40+index%4*15))*scale;
            const x=target.x+Math.cos(angle)*distance,y=target.y+Math.sin(angle)*distance;
            stroke([[x,y],[x+Math.cos(angle)*9*(1-impact),y+Math.sin(angle)*9*(1-impact)]],index%3 ? 1.5 : 2.5,(1-impact)*.9,index%3 ? color : '#ffffff');
          }
        }
        ctx.restore();
      }
      const alpha = progress<.75 ? Math.min(1,progress*12) : (1-progress)*4;
      const y = Math.max(48,target.y-target.size*.45-(quiet ? 0 : Math.min(26,progress*45)));
      const labelX = Math.max(90,Math.min(bounds.width-90,target.x));
      ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='bottom';
      ctx.font=`700 ${event.label ? 22 : event.critical ? 34 : 28}px system-ui, sans-serif`;
      ctx.lineWidth=5;ctx.strokeStyle='#142123';ctx.fillStyle=event.critical ? '#ffe4a3' : '#ffffff';
      const label = event.label || (event.damage>0 ? `-${event.damage.toLocaleString()}` : '抵御');
      ctx.strokeText(label,labelX,y);ctx.fillText(label,labelX,y);
      ctx.font='600 12px system-ui, sans-serif';ctx.fillStyle=color;
      const caption = [event.critical ? '暴击' : '',event.opening ? '协同追击' : '',event.guarded ? '防御减伤' : ''].filter(Boolean).join(' · ');
      if (caption) {ctx.strokeText(caption,labelX,y+18);ctx.fillText(caption,labelX,y+18);}
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(frame);restoreSource();ctx.clearRect(0,0,bounds.width,bounds.height);};
  },[event,reduced]);
  return <canvas ref={canvasRef} className="battle-impact-canvas" data-testid="battle-impact" aria-hidden="true" />;
}
