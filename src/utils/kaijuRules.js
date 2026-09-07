import { KAIJU, KAIJU_BY_ID, KAIJU_RANKS, KAIJU_STYLES } from '../data/kaiju';

export function normalizeKaijuProgress(raw) {
  const ids = values => [...new Set((Array.isArray(values) ? values : []).filter(id=>typeof id==='string' && KAIJU_BY_ID[id]?.id===id))];
  const defeatedIds=ids(raw?.defeatedIds);
  return {seenIds:ids([...(Array.isArray(raw?.seenIds) ? raw.seenIds : []),...defeatedIds]),defeatedIds,
    recentIds:ids(raw?.recentIds).slice(-10),
    wildSinceEncounter:Number.isFinite(raw?.wildSinceEncounter) ? Math.max(0,Math.min(10,Math.floor(raw.wildSinceEncounter))) : 2};
}

export function recordKaijuBattle(progress, enemies, {defeated=false,wild=false,eligible=false}={}) {
  const next=normalizeKaijuProgress(progress);
  const ids=[...new Set((enemies || []).filter(unit=>!defeated || unit.currentHp<=0).map(unit=>unit.kaijuId).filter(id=>typeof id==='string' && KAIJU_BY_ID[id]?.id===id))];
  next.seenIds=[...new Set([...next.seenIds,...ids])];
  if(defeated) next.defeatedIds=[...new Set([...next.defeatedIds,...ids])];
  else if(wild && ids.length) {
    next.recentIds=[...next.recentIds.filter(id=>!ids.includes(id)),...ids].slice(-10);
    next.wildSinceEncounter=0;
  } else if(eligible) next.wildSinceEncounter=Math.min(10,next.wildSinceEncounter+1);
  return next;
}

const BIOME={forest:'grass',capital:'city'};
const WEATHER_TYPE={RAIN:'WATER',SUN:'FIRE',SNOW:'ICE',SAND:'GROUND',STORM:'ELECTRIC'};
export function getKaijuEncounterPool({map,badgeCount=0,party=[],level=0}) {
  if(!map?.type || !Array.isArray(map.lvl) || badgeCount<2) return [];
  const strongest=Math.max(0,...party.filter(unit=>unit.currentHp>0).map(unit=>Number(unit.level)||0));
  return KAIJU.filter(item=>{
    const rank=KAIJU_RANKS[item.rank];
    return badgeCount>=rank.badges && level>=rank.minLevel && strongest>=rank.minLevel;
  });
}

export function rollKaijuEncounter({map,badgeCount,party,level,weather,timePhase,progress,isDouble=false},random=Math.random) {
  const pool=getKaijuEncounterPool({map,badgeCount,party,level});
  const state=normalizeKaijuProgress(progress);
  if(!pool.length || state.wildSinceEncounter<1) return null;
  const chance=Math.min(0.38,0.18+Math.max(0,state.wildSinceEncounter-3)*0.04);
  if(state.wildSinceEncounter<10 && random()>=chance) return null;
  const biome=BIOME[map.type] || map.type;
  const rift=random()<0.16;
  const selected=[];
  const pick=()=>{
    const candidates=pool.filter(item=>!state.recentIds.includes(item.id) && !selected.includes(item.id));
    if(!candidates.length)return null;
    const weighted=candidates.map(item=>({item,weight:(rift ? 1 : item.habitats.includes(biome) ? 8 : 0.25)
      * (state.seenIds.includes(item.id) ? 1 : 1.5)
      * (WEATHER_TYPE[weather]===item.type ? 1.8 : 1)
      * (timePhase==='NIGHT' && ['DARK','GHOST'].includes(item.type) ? 1.5 : 1)
      * [1,0.7,0.35][item.rank]}));
    let roll=random()*weighted.reduce((sum,row)=>sum+row.weight,0);
    const chosen=weighted.find(row=>(roll-=row.weight)<0)?.item || weighted[weighted.length-1]?.item;
    if(chosen)selected.push(chosen.id);
    return chosen;
  };
  pick();
  if(isDouble)pick();
  return selected.length ? {ids:selected,rift,level:Math.min(100,level+2)} : null;
}

export function buildKaijuUnit(kaijuId,level,{createPet,pokedex,getStats,tier=null,slot=0}={}) {
  const entry=KAIJU_BY_ID[kaijuId];
  if(!entry)throw new Error(`Unknown kaiju ${kaijuId}`);
  const style=KAIJU_STYLES[entry.style],rank=KAIJU_RANKS[entry.rank];
  const base=pokedex.find(unit=>unit.type===entry.type) || pokedex[0];
  const unit=createPet(base.id,Math.max(1,Math.min(100,level)));
  const budget=tier || rank;
  const attack=budget.attack+(entry.style==='siege' ? 5 : 0);
  const power=tier ? 82+entry.rank*4 : 74+entry.rank*6;
  const moves=[
    {name:`${entry.name}·${style.category==='physical' ? '强袭' : '能量波'}`,t:entry.type,p:power,category:style.category,pp:16},
    {name:`${entry.name}·${style.category==='physical' ? '震荡波' : '尾击'}`,t:style.category==='physical' ? 'DARK' : 'FIGHT',p:power-8,category:style.category==='physical' ? 'special' : 'physical',pp:16},
    {name:style.setup,t:entry.type,p:0,category:'status',pp:entry.style==='drain' ? 3 : 5,effect:JSON.parse(JSON.stringify(style.effect))},
    {name:entry.signature,t:entry.type,p:power+26,category:style.category,pp:6,...(entry.style==='siege' ? {p:power+40,recharge:true} : {})},
  ];
  Object.assign(unit,{name:entry.name,nickname:entry.name,type:entry.type,type2:null,secondaryType:null,
    kaijuId,kaijuRank:entry.rank,kaijuStyle:entry.style,trialPortrait:entry.portrait,trialSequence:[...style.sequence],kaijuSlot:slot,
    trait:'none',nature:'docile',isEnemy:true,isBoss:false,devilFruit:null,bijuu:null,equips:[],sectId:0,sectLevel:0,intimacy:0,
    isShiny:false,isFusedShiny:false,awakened:false,ivs:{},evs:{},cursedTechnique:null,hasDomain:false,equippedBerry:null,
    customBaseStats:{hp:Math.round(budget.hp*(tier ? 0.9 : 1)),p_atk:attack,s_atk:attack,
      p_def:Math.round(budget.defense*(entry.style==='armor' ? 1.2 : entry.style==='trickster' ? 0.85 : 1)),
      s_def:Math.round(budget.defense*(entry.style==='barrier' ? 1.2 : entry.style==='swift' ? 0.85 : 1)),spd:style.speed,crit:0},
    moves:moves.map(move=>({...move,acc:100,maxPP:move.pp})),
  });
  unit.currentHp=getStats(unit).maxHp;
  return unit;
}

export function getKaijuAction(battle,enemy,targets,canUse) {
  if(!enemy.kaijuId || !enemy.trialSequence?.length)return null;
  const sequence=enemy.trialSequence;
  const turn=(battle.turnCount || 0)+(enemy.kaijuSlot || 0);
  let index=sequence[turn%sequence.length];
  if(index===2 && enemy.kaijuStyle==='drain' && enemy.currentHp>(enemy.maxHp || enemy._maxHp || 1)*0.5) index=0;
  const moves=enemy.combatMoves || enemy.moves || [];
  const move=moves[index] && canUse(moves[index]) ? moves[index] : moves.find(item=>item.p>0 && canUse(item));
  const living=targets.filter(item=>item.unit?.currentHp>0);
  if(!move || !living.length)return null;
  // Different threats in doubles: assassins finish weak targets; artillery alternates lanes.
  const target=['swift','breaker'].includes(enemy.kaijuStyle)
    ? [...living].sort((a,b)=>a.unit.currentHp/(a.unit.maxHp || a.unit._maxHp || a.unit.currentHp)-b.unit.currentHp/(b.unit.maxHp || b.unit._maxHp || b.unit.currentHp))[0]
    : living[turn%living.length];
  return {move,targetIdx:target.idx};
}

export function getKaijuReward(enemies,random=Math.random) {
  const monsters=(enemies || []).filter(unit=>KAIJU_BY_ID[unit.kaijuId]);
  if(!monsters.length)return null;
  const rank=Math.max(...monsters.map(unit=>KAIJU_BY_ID[unit.kaijuId].rank));
  const tier=KAIJU_RANKS[rank];
  const berry=['oran','sitrus','lum'][rank];
  const vitamin=rank>0 && random()<[0,0.25,0.45][rank] ? ['vit_hp','vit_patk','vit_pdef','vit_satk','vit_sdef','vit_spd'][Math.min(5,Math.floor(random()*6))] : null;
  return {rank,goldMult:monsters.reduce((sum,unit)=>sum+KAIJU_RANKS[KAIJU_BY_ID[unit.kaijuId].rank].gold,0)/monsters.length,
    berry,berryCount:tier.berries+(monsters.length>1 ? 1 : 0),vitamin,stone:rank===2 && random()<0.18 ? 'dusk_stone' : null};
}

export function getKaijuExpMultiplier(unit) {
  const entry=KAIJU_BY_ID[unit?.kaijuId];
  return entry ? KAIJU_RANKS[entry.rank].exp : 1;
}
