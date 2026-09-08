import React, {useState} from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, BookOpen, Sparkles, Shield, ChevronRight, Settings2 } from 'lucide-react';
import { getNinjaRank } from '../../data/naruto';
import { BREATHING_TECHNIQUES } from '../../data/battleTactics';
import { POKEDEX, TYPES } from '../../data';
import { PET_TACTICS } from '../../data/petExpansion';
import { getUltraDevice } from '../../data/ultraDevices';
import { isUltraUnlocked } from '../../utils/ultraRules';
import { getSpeciesLearnedMoves } from '../../utils/speciesMoves';
import { getEligiblePreparedJutsu, selectPreparedJutsu } from '../../utils/battleTactics';
import '../../styles/team-preparation.css';

export default function TeamPreparationScreen({party,narutoState,fusionState,ultraState,badges,onPrepare,onBreathing,onBack,onUltra,onGuide,onInspect,onEquip,onReorder,onRecall,onTraining,renderAvatar}) {
  const [selectedUid,setSelectedUid]=useState(party[0]?.uid);
  const pet=party.find(item=>item.uid===selectedUid) || party[0];
  const species=POKEDEX.find(item=>item.id===pet?.id);
  const tactic=PET_TACTICS[species?.tactic];
  const [tab,setTab]=useState('moves');
  const eligible=getEligiblePreparedJutsu(pet,narutoState);
  const prepared=selectPreparedJutsu(pet,narutoState);
  const rank=getNinjaRank(narutoState?.examsCompleted || 0);
  const slots=rank.id==='kage' ? 2 : 1;
  const index=party.indexOf(pet);
  const learned=[...new Map(getSpeciesLearnedMoves(species,pet?.level).map(move=>[move.id,move])).values()];
  const recall=learned.filter(move=>!(pet?.moves || []).some(known=>known.id===move.id || (known.name===move.name && known.t===move.t)));
  const device=ultraState?.hostUid===pet?.uid && isUltraUnlocked(ultraState,ultraState.heroId) ? getUltraDevice(ultraState.heroId) : null;
  return <section className="screen team-preparation" aria-label="队伍战术室">
    <header className="team-header"><button onClick={onBack} aria-label="返回地图" title="返回地图"><ArrowLeft size={20}/></button><div><span>TEAM PREPARATION</span><h1>队伍战术室</h1></div><button onClick={onGuide}><BookOpen size={17}/>战斗手册</button></header>
    <div className="team-layout">
      <aside className="team-roster" aria-label="选择伙伴">{party.map((unit,i)=><button key={unit.uid} aria-pressed={pet?.uid===unit.uid} onClick={()=>setSelectedUid(unit.uid)}><span className="team-pet-art">{renderAvatar(unit)}</span><span><small>{i===0 ? '单打首发 / 双打左位' : i===1 ? '双打右位' : '替补'}</small><strong>{unit.nickname || unit.name}</strong><small>Lv.{unit.level} · {unit.currentHp>0 ? '可出战' : '需要恢复'}</small></span></button>)}<div className="team-order"><button title="上移出战顺序" aria-label="上移出战顺序" disabled={index<=0} onClick={()=>onReorder(pet.uid,-1)}><ArrowUp size={18}/></button><button title="下移出战顺序" aria-label="下移出战顺序" disabled={index<0 || index>=party.length-1} onClick={()=>onReorder(pet.uid,1)}><ArrowDown size={18}/></button></div></aside>
      <main className="team-config">
        {pet ? <><div className="team-unit-heading"><div><h2>{pet.nickname || pet.name}</h2><span>{[pet.type,pet.secondaryType || pet.type2].filter(Boolean).map(t=>TYPES[t]?.name || t).join(' / ')} · Lv.{pet.level}{tactic && ` · ${tactic.name}`}</span></div><button onClick={()=>onInspect(pet)}><Settings2 size={16}/>能力详情</button></div>
        <nav className="team-tabs" aria-label="伙伴配置"><button aria-pressed={tab==='moves'} onClick={()=>setTab('moves')}>本体技能</button><button aria-pressed={tab==='equipment'} onClick={()=>setTab('equipment')}>装备与能力</button>{eligible.length>0 && <button aria-pressed={tab==='jutsu'} onClick={()=>setTab('jutsu')}>忍术准备</button>}</nav>
        {tab==='moves' && <><div className="team-section-heading"><h2>当前技能</h2><span>{pet.moves?.length || 0} / 4</span></div><div className="team-moves">{(pet.moves || []).map((move,i)=><div key={`${move.id || move.name}:${i}`}><span className="team-move-index">{i+1}</span><div><strong>{move.name}</strong><small>{TYPES[move.t]?.name || move.t} · {move.p ? `${move.category==='physical' ? '物理' : '特殊'}威力 ${move.p}` : '变化技能'} · PP {move.pp} / {move.maxPP || move.pp}</small></div></div>)}</div>{tactic && <div className="team-role"><Shield size={19}/><p>{tactic.tip}</p></div>}{recall.length>0 && <details className="team-recall"><summary>回忆已学技能 <span>{recall.length}</span></summary>{recall.map(move=><div key={move.id}><div><strong>{move.name}</strong><small>{TYPES[move.t]?.name} · {move.p ? `威力 ${move.p}` : '变化技能'}</small></div><button disabled={!!pet.pendingLearnMove} onClick={()=>onRecall(pet.uid,move.id)}>回忆<ChevronRight size={14}/></button></div>)}<p>回忆消耗 300 金币；四个技能已满时需替换一个。</p></details>}</>}
        {tab==='equipment' && <><div className="team-section-heading"><h2>携带装备</h2><span>2 个位置</span></div><div className="team-equipment">{[0,1].map(slot=><button key={slot} onClick={()=>onEquip(index,slot)}><Shield size={21}/><span><strong>{pet.equips?.[slot]?.name || `装备位置 ${slot+1}`}</strong><small>{pet.equips?.[slot]?.skill?.name || pet.equips?.[slot]?.move?.name || (pet.equips?.[slot] ? '查看属性或更换' : '选择装备')}</small></span><ChevronRight size={16}/></button>)}</div><dl className="team-capabilities"><div><dt>恶魔果实</dt><dd>{pet.devilFruit?.name || '未食用'}</dd></div><div><dt>尾兽</dt><dd>{pet.bijuu?.name || '未封印'}</dd></div><div><dt>门派</dt><dd>{pet.sectId ? `已入门 · 修行 ${pet.sectLevel || 0} 层` : '未加入'}</dd></div><div><dt>变身器</dt><dd>{device?.name || '未携带'}</dd></div></dl></>}
        {tab==='jutsu' && <><div className="team-section-heading"><h2>忍术准备</h2><span>{rank.name} · {slots} 个位置</span></div>{eligible.length>0 ? <><div className="team-jutsu-slots">{Array.from({length:slots},(_,i)=><label key={i}>准备位置 {i+1}<select aria-label={`忍术准备位置 ${i+1}`} value={prepared[i]?.id || ''} onChange={event=>{const ids=prepared.map(move=>move.id);const other=ids.indexOf(event.target.value);if(other>=0 && other!==i)ids[other]=ids[i];ids[i]=event.target.value;onPrepare(pet.uid,ids);}}>{eligible.map(move=><option key={move.id} value={move.id}>{move.name} · {move.chakraCost} 查克拉</option>)}</select></label>)}</div>{prepared.map(move=><div className="team-role" key={move.id}><p><strong>{move.name}</strong><br/>{move.desc || `威力 ${move.p || 0} · 查克拉 ${move.chakraCost}`}</p></div>)}</> : <p>此伙伴尚未开放忍术准备。</p>}</>}
        </> : <p>队伍为空。</p>}
      </main>
      <aside className="team-shared"><div className="team-section-heading"><h2>全队爆发</h2><span>每场 1 次</span></div><button className="team-ultra" onClick={onUltra}><Sparkles size={18}/><span>{device?.name || (ultraState?.heroId && isUltraUnlocked(ultraState,ultraState.heroId) ? '选择宿主' : '前往收集变身器')}<small>{device ? `已携带 · ${party.find(unit=>unit.uid===ultraState?.hostUid)?.name || '未指定宿主'}` : '需在奥特曼图鉴中获得并装配'}</small></span><ChevronRight size={16}/></button><p className="team-rule">变身器、果实变身、尾兽化共用一次爆发机会。</p>{badges.length>=6 ? <><div className="team-section-heading"><h2>呼吸法</h2></div><select aria-label="全队呼吸法" value={fusionState.playerStyle?.breathingStyle || 'water'} onChange={event=>onBreathing(event.target.value)}>{Object.entries(BREATHING_TECHNIQUES).filter(([id])=>!['insect','mist','sun','moon'].includes(id) || fusionState.crisisUnlocks?.includes('breathing_unlock')).map(([id,move])=><option key={id} value={id}>{move.name}</option>)}</select></> : <p className="team-unlock">6 枚徽章开放呼吸法</p>}{badges.length>=4 && <button className="team-training" onClick={onTraining}>针对性训练<ChevronRight size={16}/></button>}</aside>
    </div>
  </section>;
}
