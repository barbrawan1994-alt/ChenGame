import { KAIJU_RAID_BY_ID } from '../data/kaijuRaids';
import { KAIJU_STYLES } from '../data/kaiju';
import { buildKaijuUnit } from './kaijuRules';

export function normalizeRaidProgress(raw) {
  const ids = values => [...new Set((Array.isArray(values) ? values : []).filter(id=>typeof id==='string' && KAIJU_RAID_BY_ID[id]?.id===id))];
  return {clearedIds:ids(raw?.clearedIds),rewardDate:typeof raw?.rewardDate==='string' ? raw.rewardDate : '',rewardedIds:ids(raw?.rewardedIds)};
}

export function getRaidBlock(raid,party,badges,gold) {
  if(!raid) return '讨伐不存在';
  if(badges<raid.badges) return `需要 ${raid.badges} 枚徽章`;
  const healthy=party.filter(pet=>pet.currentHp>0).slice(0,4);
  if(healthy.length<(raid.double ? 3 : 2)) return `需要 ${raid.double ? 3 : 2} 名存活伙伴`;
  if(healthy.some(pet=>pet.level<raid.level-10)) return `出战伙伴均需达到 Lv.${raid.level-10}`;
  if(gold<raid.stake) return `需要 ${raid.stake} 金币出征押金`;
  return '';
}

export function getRaidReward(progress,raid,today) {
  const state=normalizeRaidProgress(progress);
  const firstClear=!state.clearedIds.includes(raid.id);
  const rewarded=state.rewardDate===today && state.rewardedIds.includes(raid.id);
  return {firstClear,gold:firstClear ? raid.gold : rewarded ? 0 : raid.repeatGold,
    vitamin:firstClear ? raid.vitamin : null,berries:firstClear ? 5 : rewarded ? 0 : 2,
    state:{clearedIds:[...new Set([...state.clearedIds,raid.id])],rewardDate:today,
      rewardedIds:[...new Set([...(state.rewardDate===today ? state.rewardedIds : []),raid.id])]}};
}

export function buildRaidParty(raid,deps) {
  const ids=raid.double ? [raid.boss,...raid.guards] : [...raid.guards,raid.boss];
  return ids.map((id,slot)=>{
    const boss=id===raid.boss;
    const unit=buildKaijuUnit(id,raid.level,{...deps,slot,tier:{hp:boss ? 225 : 160,attack:boss ? 137 : 112,defense:boss ? 115 : 95}});
    if(boss) {
      const style=KAIJU_STYLES[raid.style];
      unit.kaijuStyle=raid.style;
      unit.customBaseStats.spd=style.speed;
      unit.customBaseStats.p_def=Math.round(115*(raid.style==='trickster' ? 0.85 : 1));
      unit.moves[0].category=style.category;
      unit.moves[2]={name:style.setup,t:unit.type,p:0,category:'status',pp:raid.style==='drain' ? 3 : 5,maxPP:raid.style==='drain' ? 3 : 5,acc:100,effect:JSON.parse(JSON.stringify(style.effect))};
      unit.moves[3]={...unit.moves[3],category:style.category,recharge:raid.style==='siege'};
      unit.trialSequence=raid.sequence;
      unit.raidProfile={phaseHp:raid.phaseHp,phaseSequence:raid.phaseSequence};
      unit.currentHp=deps.getStats(unit).maxHp;
    }
    return unit;
  });
}
