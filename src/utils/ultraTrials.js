import { ULTRA_BY_ID, ULTRA_ERAS, ULTRA_HEROES, ULTRA_ROLES } from '../data/ultra';
import { ULTRA_TRIAL_TIERS, ULTRA_TRIAL_PREREQUISITES, ULTRA_TRIAL_ROLES } from '../data/ultraTrials';
import { KAIJU, KAIJU_BY_ID } from '../data/kaiju';
import { ULTRA_NEMESES } from '../data/kaijuTrials';
import { buildKaijuUnit, getKaijuAction } from './kaijuRules';
import { cloneDeep } from 'lodash';

const LEGENDARY = ['king','noa','legend','saga','reiga','zagi'];
const MASTERS = ['father','mother','zero','belial','tregear','ginga_victory','ruebe','gruebe','nexus'];

export function getUltraTrial(heroId, party = [], route = 0) {
  const hero = ULTRA_BY_ID[heroId];
  if (!hero?.id) return null;
  const era = ULTRA_ERAS.find(item=>item.id===hero.era);
  const tierIndex = LEGENDARY.includes(hero.id) ? 2 : MASTERS.includes(hero.id) || ['beyond','shadow'].includes(hero.era) ? 1 : 0;
  const tier = ULTRA_TRIAL_TIERS[tierIndex];
  const minLevel = Math.max(tier.minLevel,30+ULTRA_ERAS.indexOf(era)*5);
  const strongest = Math.max(1,...party.map(pet=>Number.isFinite(pet.level) ? pet.level : 1));
  const routeIndex=[0,1,2].includes(route) ? route : 0;
  const heroIndex=ULTRA_HEROES.findIndex(item=>item.id===hero.id);
  const pool=KAIJU.filter(item=>item.era===hero.era);
  const eraPool=pool.length ? pool : KAIJU.filter(item=>item.rank>0);
  const first=routeIndex===0 && KAIJU_BY_ID[ULTRA_NEMESES[hero.id]] ? KAIJU_BY_ID[ULTRA_NEMESES[hero.id]] : eraPool[(heroIndex*7+routeIndex*13)%eraPool.length];
  const supports=KAIJU.filter(item=>item.id!==first.id && item.style!==first.style);
  const second=supports[(heroIndex*11+routeIndex*37)%supports.length];
  return {hero,era,tier,tierIndex,minLevel,level:Math.min(100,Math.max(minLevel,strongest+tier.levelBonus)),
    monsters:[first,second],route:routeIndex,isDouble:hero.era==='newgen' || routeIndex===2,partyLimit:3,prerequisites:ULTRA_TRIAL_PREREQUISITES[hero.id] || [],
    tactic:ULTRA_TRIAL_ROLES[hero.role],};
}

export function getUltraTrialBlock(trial, state, party, badgeCount) {
  if (!trial) return '未找到角色试炼';
  const wins = new Set(state?.trialWins || []);
  if (badgeCount<trial.tier.badges) return `需要 ${trial.tier.badges} 枚徽章`;
  if (wins.size<trial.tier.wins) return `需要完成 ${trial.tier.wins} 位不同角色的试炼（当前 ${wins.size}）`;
  const missing = trial.prerequisites.filter(id=>!wins.has(id));
  if (missing.length) return `先通过：${missing.map(id=>ULTRA_BY_ID[id].name).join('、')}`;
  const healthy = party.filter(pet=>pet.currentHp>0).slice(0,trial.partyLimit);
  if (healthy.length<2) return '需要至少两名存活伙伴';
  if (healthy.some(pet=>pet.level<trial.minLevel)) return `出战伙伴均需达到 Lv.${trial.minLevel}`;
  return '';
}

export function buildUltraTrialParty(trial, {createPet,pokedex,getStats}) {
  const {hero,era,tier,tierIndex,level}=trial;
  const create = () => {
    const type = ULTRA_ROLES[hero.role].type;
    const base = pokedex.find(pet=>pet.type===type) || pokedex[0];
    const unit = createPet(base.id,level);
    const role = hero.role;
    const tactic = ULTRA_TRIAL_ROLES[role];
    const opening = {name:tactic.name,t:'NORMAL',p:0,category:'status',effect:cloneDeep(tactic.effect),pp:6};
    const attacks = [
      {name:role==='striker' ? '格斗连击' : '光能脉冲',t:type,p:85+tierIndex*5,category:role==='striker' ? 'physical' : 'special'},
      {name:'光刃突破',t:'FIGHT',p:80+tierIndex*5,category:'physical'},
    ];
    const signature = {name:hero.forms[0].finisher,t:type,p:110+tierIndex*10,category:role==='striker' ? 'physical' : 'special',
      ...(role==='healer' ? {p:0,category:'status',effect:{type:'HEAL',val:0.3,target:'self'},pp:3} : {})};
    const name = `${hero.name}·试炼投影`;
    Object.assign(unit,{name,nickname:name,type,secondaryType:null,type2:null,trait:'none',nature:'docile',isEnemy:true,isBoss:true,
      devilFruit:null,bijuu:null,equips:[],sectId:0,sectLevel:0,intimacy:0,isShiny:false,isFusedShiny:false,awakened:false,
      ivs:{},evs:{},cursedTechnique:null,hasDomain:false,equippedBerry:null,
      trialPortrait:hero.portrait,
      trialSequence:[2,0,3,1],
      customBaseStats:{hp:tier.hp,p_atk:tier.attack,s_atk:tier.attack,
        p_def:tier.defense,s_def:tier.defense,spd:role==='swift' ? 105 : role==='guardian' ? 62 : 78,crit:0},
      moves:[...attacks,opening,signature].map(move=>({...move,category:move.category || 'special',acc:100,pp:move.pp || 20,maxPP:move.pp || 20})),
    });
    unit.currentHp=getStats(unit).maxHp;
    return unit;
  };
  return [...trial.monsters.map((monster,slot)=>buildKaijuUnit(monster.id,level,{createPet,pokedex,getStats,tier,slot})),create()];
}

export function getUltraTrialAction(battle, enemy, targets, canUse) {
  if(enemy.kaijuId)return getKaijuAction(battle,enemy,targets,canUse);
  if (battle.type!=='ultra_trial' || !enemy.trialSequence?.length) return null;
  const index=enemy.trialSequence[(battle.turnCount || 0)%enemy.trialSequence.length];
  const move=enemy.combatMoves[index];
  const available=move && canUse(move) ? move : enemy.combatMoves.find(item=>item.p>0 && canUse(item));
  if (!available) return null;
  const target=targets.filter(item=>item.unit?.currentHp>0).sort((a,b)=>a.unit.currentHp-b.unit.currentHp)[0];
  return target ? {move:available,targetIdx:target.idx} : null;
}
