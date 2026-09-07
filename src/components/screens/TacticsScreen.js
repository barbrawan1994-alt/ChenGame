import React, {useState} from 'react';
import { ArrowLeft, BookOpen, Check, Sparkles } from 'lucide-react';
import { getNinjaRank } from '../../data/naruto';
import { BREATHING_TECHNIQUES } from '../../data/battleTactics';
import { getEligiblePreparedJutsu, selectPreparedJutsu } from '../../utils/battleTactics';
import '../../styles/tactics-screen.css';

export default function TacticsScreen({party,narutoState,fusionState,badges,onPrepare,onBreathing,onBack,onUltra,onGuide,renderAvatar}) {
  const [selectedUid,setSelectedUid]=useState(party[0]?.uid);
  const pet=party.find(item=>item.uid===selectedUid) || party[0];
  const [search,setSearch]=useState('');
  const eligible=getEligiblePreparedJutsu(pet,narutoState);
  const prepared=selectPreparedJutsu(pet,narutoState);
  const rank=getNinjaRank(narutoState?.examsCompleted || 0);
  const slots=rank.id==='kage' ? 2 : 1;
  return <section className="screen tactics-screen">
    <header className="tactics-header"><button type="button" onClick={onBack} aria-label="返回地图" title="返回地图"><ArrowLeft size={20}/></button><div><span>战斗准备</span><h1>战术编成</h1></div><button type="button" onClick={onGuide}><BookOpen size={17}/>战斗手册</button></header>
    <div className="tactics-layout">
      <aside className="tactics-roster" aria-label="选择伙伴">{party.map((unit,index)=><button type="button" key={unit.uid} aria-pressed={pet?.uid===unit.uid} onClick={()=>setSelectedUid(unit.uid)}><span className="tactics-pet-art">{renderAvatar(unit)}</span><span><small>{index+1<3 ? `出战位 ${index+1}` : '替补'}</small><strong>{unit.name}</strong><small>Lv.{unit.level}</small></span></button>)}</aside>
      <main className="tactics-preparation">
        <div className="tactics-section-heading"><h2>忍术准备</h2><span>{rank.name} · {slots} 个位置</span></div>
        {pet && eligible.length>0 ? <>
          <div className="prepared-jutsu-slots">{Array.from({length:slots},(_,index)=><label key={index}>准备位置 {index+1}<select aria-label={`忍术准备位置 ${index+1}`} value={prepared[index]?.id || ''} onChange={event=>{const ids=prepared.map(move=>move.id);const other=ids.indexOf(event.target.value);if(other>=0 && other!==index) ids[other]=ids[index];ids[index]=event.target.value;onPrepare(pet.uid,ids);}}>{eligible.map(move=><option key={move.id} value={move.id}>{move.name} · {move.rank}级 · {move.chakraCost} 查克拉</option>)}</select></label>)}</div>
          <input type="search" aria-label="搜索可准备忍术" placeholder="搜索忍术" value={search} onChange={event=>setSearch(event.target.value)}/>
          <div className="tactics-jutsu-list">{eligible.filter(move=>move.name.includes(search)).map(move=><div className="tactics-jutsu-row" key={move.id}><span className="jutsu-rank">{move.rank}</span><div><strong>{move.name}</strong><p>{move.desc || `威力 ${move.p || 0} · 查克拉 ${move.chakraCost} · PP ${move.pp}`}</p></div>{prepared.some(item=>item.id===move.id) && <Check size={17} aria-label="已准备"/>}</div>)}</div>
        </> : <div className="tactics-locked">{pet?.name || '伙伴'} · Lv.30 与下忍段位开放忍术准备</div>}
      </main>
      <aside className="tactics-style">
        <div className="tactics-section-heading"><h2>呼吸流派</h2><span>全队</span></div>
        <div className="breathing-style-list">{Object.entries(BREATHING_TECHNIQUES).map(([id,move])=>{const locked=badges.length<6 || (['insect','mist','sun','moon'].includes(id) && !fusionState.crisisUnlocks?.includes('breathing_unlock'));return <button key={id} type="button" disabled={locked} title={locked ? badges.length<6 ? '6枚徽章开放' : '需要危机剧情解锁高级呼吸法' : move.name} aria-pressed={(fusionState.playerStyle?.breathingStyle || 'water')===id} onClick={()=>onBreathing(id)}><span>{{water:'水',fire:'炎',thunder:'雷',wind:'风',stone:'岩',flower:'花',beast:'兽',insect:'虫',mist:'霞',sun:'日',moon:'月'}[id]}之呼吸</span><small>{move.name}</small></button>;})}</div>
        <div className="tactics-section-heading"><h2>光之契约</h2></div><button type="button" className="tactics-ultra-link" onClick={onUltra}><Sparkles size={18}/>选择奥特曼与形态</button>
      </aside>
    </div>
  </section>;
}
