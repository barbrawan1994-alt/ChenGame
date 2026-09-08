import React from 'react';
import { X, Swords, Compass, Settings2, Check } from 'lucide-react';
import { ANCIENT_BATTLEFIELDS, FRUIT_SEA_ZONES, JUTSU_SECRET_REALMS, SECT_SECRET_REALMS, KINGDOM_PVE_TASKS, KINGDOM_POSITIONS, PLAYER_STYLES, GENERAL_PVE_TACTICS, getActiveNationalCalamities, getCalamityWeekKey, getUnlockedFusionSystems, calcCrossSystemPveBonuses, calcFusionPveBonuses, mergePveBonuses } from '../../data';
import './JointAdventure.css';

const ROUTES=[['jutsu','忍术秘境',JUTSU_SECRET_REALMS,'jutsuRealmsCleared'],['fruit','果实海域',FRUIT_SEA_ZONES,'fruitTrialsCleared'],['sect','门派秘境',SECT_SECRET_REALMS,'sectRealmsCleared'],['battlefield','古战场',ANCIENT_BATTLEFIELDS,'battlefieldsCleared']];
const rewards=r=>[r?.gold && `${r.gold} 金币`,r?.item && `道具 ×${r.itemCount || 1}`,r?.jutsuMastery && `忍术熟练 +${r.jutsuMastery}`,r?.title && `称号「${r.title}」`,r?.kwContrib && `国战贡献 +${r.kwContrib}`,r?.kwManpower && `兵力 +${r.kwManpower}`,r?.guardianScore && `守护积分 +${r.guardianScore}`,r?.generalFragment && '名将碎片 ×1',r?.sectContrib && `门派贡献 +${r.sectContrib}`,r?.scrollPage && `武学残页 ×${r.scrollPage}`,r?.fruitTrialClear && '果实试炼印记'].filter(Boolean).join(' · ');
const bonusRows=b=>[
  b.purifyBonus && ['净化行动',`效率 +${b.purifyBonus}%`],b.protectBonus && ['护送与守护',`目标耐久 +${Math.round(b.protectBonus*100)}%`],
  b.captureBonus && ['特殊捕获步骤',`进度 +${Math.round(b.captureBonus*100)}%`],b.bossMultReduce && ['冒险首领',`强度降低 ${Math.round(b.bossMultReduce*100)}%`],
  b.exploreSpeedBonus && ['探索步骤',`效率 +${Math.round(b.exploreSpeedBonus*100)}%`],b.escapeTurnReduce && ['撤离步骤',`减少 ${b.escapeTurnReduce} 回合`],
  b.puzzleHintBonus && ['解谜步骤','额外提示'],
].filter(Boolean);

export default function FusionHubScreen({badges,completeKingdomPveTask,fusionHubOpen,fusionHubTab,fusionState,getLocalDateStr,participateCalamity,party,selectGeneralTactic,selectKwPosition,selectPlayerStyle,setFusionHubOpen,setFusionHubTab,startFusionDungeon,onTactics,kingdomWar,ecoCrisisState,sanctuaryState,gold}) {
  if(!fusionHubOpen)return null;
  const unlocked=getUnlockedFusionSystems(badges.length);
  const section=['style','general','crossworld'].includes(fusionHubTab) ? 'prepare' : fusionHubTab==='calamity' || fusionHubTab==='kingdom' ? fusionHubTab : 'routes';
  const route=ROUTES.find(row=>row[0]===fusionHubTab) || ROUTES[0];
  const today=getLocalDateStr(),week=getCalamityWeekKey(today);
  const active=getActiveNationalCalamities(today,badges.length);
  const bonuses=mergePveBonuses(calcCrossSystemPveBonuses({playerStyle:fusionState.playerStyle || {},kwPosition:fusionState.kwPosition}),calcFusionPveBonuses({generalTacticId:fusionState.generalTacticId,sectId:party[0]?.sectId}));
  const taskBlock=task=>{
    if(badges.length<task.reqBadges)return `需要 ${task.reqBadges} 枚徽章`;
    if(task.prereq?.some(id=>!fusionState.kingdomTasksDone?.includes(id)))return '前置任务未完成';
    const last=fusionState.kingdomTaskCooldowns?.[task.id];
    if(last!==undefined && (kingdomWar?.currentTurn || 0)-last<(task.cooldownTurns || 999))return `冷却 ${Math.max(0,(task.cooldownTurns || 999)-(kingdomWar?.currentTurn || 0)+last)} 回合`;
    if(task.cost?.gold>gold)return '金币不足';
    if(task.cost?.energy>(kingdomWar?.kwManpowerReserve || 0))return '兵力不足';
    if(task.cost?.grain>(kingdomWar?.grain || 0))return '粮草不足';
    if(task.requiresCrisis && !ecoCrisisState?.cleared?.includes(task.requiresCrisis))return '需要完成对应灵灾';
    if(task.requiresUnlock && !fusionState.crisisUnlocks?.includes(task.requiresUnlock))return '需要完成对应剧情结局';
    if(task.requiresSanctuaryLv>Math.max(0,...Object.values(sanctuaryState?.facilities || {})))return `需要圣域设施 Lv.${task.requiresSanctuaryLv}`;
    return '';
  };
  return <div className="joint-overlay" role="dialog" aria-modal="true" aria-label="联合冒险"><section className="joint-adventure">
    <header><Compass size={23}/><div><span>JOINT EXPEDITIONS</span><h1>联合冒险</h1></div><button onClick={onTactics}><Settings2 size={16}/>队伍准备</button><button aria-label="关闭联合冒险" title="关闭" onClick={()=>setFusionHubOpen(false)}><X size={20}/></button></header>
    <nav aria-label="联合冒险导航">{[['routes','秘境挑战','jutsu'],['calamity','灵灾救援','calamity'],['kingdom','国战委托','kingdom'],['prepare','冒险专长','style']].map(([id,name,target])=><button key={id} aria-pressed={section===id} onClick={()=>setFusionHubTab(target)}>{name}</button>)}</nav>
    <main>
      {section==='routes' && <><div className="joint-filters">{ROUTES.map(([id,name])=><button key={id} aria-pressed={route[0]===id} onClick={()=>setFusionHubTab(id)}>{name}</button>)}</div><div className="joint-list">{route[2].map(def=>{
        const done=(fusionState[route[3]] || []).includes(def.id);
        const block=badges.length<def.reqBadges ? `需要 ${def.reqBadges} 枚徽章` : def.sectIds?.length && !party.some(pet=>def.sectIds.includes(pet.sectId)) ? '需要对应门派伙伴' : '';
        const progress=fusionState[`${route[0]}_progress_${def.id}`] || 0;
        return <article key={def.id}><div><span className="joint-condition">{done ? '已完成' : block || '可挑战'} · {progress} / {def.steps?.length || 1} 阶段</span><h2>{def.name}</h2><p>{def.summary}</p><small>{rewards(def.reward)}</small><details><summary>阶段与目标</summary><ol>{(def.steps || []).map((step,i)=><li key={i}>{step.title || step.enemyName || {battle:'守卫战',boss:'首领战',puzzle:'机关解谜',explore:'区域探索',soothe:'安抚'}[step.type]}{i<progress && ' · 已完成'}</li>)}</ol>{def.sectIds?.length>0 && <p>需要对应门派伙伴随行。</p>}</details></div><button title={block} disabled={done || !!block} onClick={()=>startFusionDungeon(route[0],def.id)}>{done ? <Check size={17}/> : <Swords size={17}/>} {done ? '已完成' : block || (progress ? '继续挑战' : '开始挑战')}</button></article>;
      })}</div></>}
      {section==='calamity' && (unlocked.includes('national_calamity') ? <div className="joint-list">{active.length ? active.map(cal=>{const done=fusionState.calamitiesParticipated?.includes(`${cal.id}_${week}`),cost=Math.floor((cal.reqBadges || 5)*500);const block=gold<cost ? '金币不足' : !party.some(pet=>pet.currentHp>0) ? '需要存活伙伴' : '';return <article key={cal.id}><div><span className="joint-condition">本周救援 · {cal.reqBadges} 枚徽章</span><h2>{cal.name}</h2><p>{cal.summary}</p><small>报名费 {cost} 金币 · 胜利基础赏金 {cost*2} 金币</small></div><button disabled={done || !!block || badges.length<cal.reqBadges} onClick={()=>participateCalamity(cal.id)}>{done ? '本周已参与' : block || '参与救援'}</button></article>;}) : <p>本周暂无可参与的灵灾。</p>}</div> : <p className="joint-locked">8 枚徽章开放灵灾救援。</p>)}
      {section==='kingdom' && (unlocked.includes('kingdom_pve') ? <><div className="joint-position"><label>委托职位<select value={fusionState.kwPosition || ''} onChange={e=>selectKwPosition(e.target.value)}><option value="" disabled>选择职位</option>{KINGDOM_POSITIONS.map(pos=><option key={pos.id} value={pos.id}>{pos.name}</option>)}</select></label><span>国战贡献 {kingdomWar?.warContribution || 0} · 兵力 {kingdomWar?.kwManpowerReserve || 0} · 粮草 {kingdomWar?.grain || 0}</span></div><div className="joint-list">{KINGDOM_PVE_TASKS.map(task=>{const block=taskBlock(task);return <article key={task.id}><div><h2>{task.name}</h2><p>{task.desc || task.summary}</p><small>奖励：{rewards(task.reward)}</small><p>费用：{task.cost?.gold || 0} 金币 · {task.cost?.energy || 0} 兵力 · {task.cost?.grain || 0} 粮草</p></div><button title={block} disabled={!!block} onClick={()=>completeKingdomPveTask(task.id)}>{block || '执行委托'}</button></article>;})}</div></> : <p className="joint-locked">国战委托尚未解锁。</p>)}
      {section==='prepare' && <div className="joint-specialties"><section><h2>冒险专长</h2><p>生效于净化、护送、探索与冒险首领等事件步骤。</p><label>主要专长<select aria-label="主要专长" value={fusionState.playerStyle?.main || ''} onChange={e=>selectPlayerStyle(e.target.value,fusionState.playerStyle?.sub===e.target.value ? null : fusionState.playerStyle?.sub)}><option value="" disabled>选择专长</option>{Object.values(PLAYER_STYLES).map(style=><option key={style.id} value={style.id}>{style.name} · {style.pveFocus.join(' / ')}</option>)}</select></label>{fusionState.playerStyle?.main && <label>辅助专长<select aria-label="辅助专长" value={fusionState.playerStyle?.sub || ''} onChange={e=>selectPlayerStyle(fusionState.playerStyle.main,e.target.value || null)}><option value="">不设置</option>{Object.values(PLAYER_STYLES).filter(style=>style.id!==fusionState.playerStyle.main).map(style=><option key={style.id} value={style.id}>{style.name}</option>)}</select></label>}<dl>{bonusRows(bonuses).map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></section>{unlocked.includes('general_tactic') && <section><h2>将魂支援</h2><label>支援战术<select value={fusionState.generalTacticId || ''} onChange={e=>selectGeneralTactic(e.target.value)}><option value="" disabled>选择支援</option>{Object.values(GENERAL_PVE_TACTICS).map(item=><option key={item.generalId} value={item.generalId}>{item.name}</option>)}</select></label>{fusionState.generalTacticId && <><p>{GENERAL_PVE_TACTICS[fusionState.generalTacticId]?.passive.desc}</p></>}</section>}</div>}
    </main>
  </section></div>;
}
