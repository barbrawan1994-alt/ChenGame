import { resolveDomainActivation } from './combatRules';
import { getBurstBlock, spendTeamBurst } from './battleTactics';

export function applyFruitTransform(battle, unit, side, fruit, maxHp, durationBonus = 0) {
  if (!fruit || unit.currentHp<=0 || unit.currentHp>maxHp*0.6 || unit.fruitTransformed || unit.bijuuTransformed || unit.ultraTransformed || getBurstBlock(battle,side)) return false;
  spendTeamBurst(battle,side,'fruit');
  unit.fruitTransformed = true;
  unit.fruitUsed = true;
  unit.fruitTurnsLeft = Math.max(2,(fruit.duration || 3)+durationBonus);
  unit.fruitEffects = {...fruit.transform};
  unit.currentHp = Math.min(maxHp,unit.currentHp+Math.floor(maxHp*Math.max(0,(fruit.transform.hpMult || 1)-1)));
  if (fruit.transform.cureStatus) unit.status = null;
  if (fruit.transform.firstStrike) unit.fruitFirstStrike = true;
  unit.combatMoves = (unit.combatMoves || []).filter(move=>!move.isFruitMove);
  if (fruit.transformMove) unit.combatMoves.push({...fruit.transformMove,isFruitMove:true});
  unit.fruitUseCount = (Number(unit.fruitUseCount) || 0)+1;
  return true;
}

export function buildDomainCommand(domain, domainType) {
  return domain ? {id:`domain_${domainType}`,name:domain.name,p:0,t:domainType,cat:'status',pp:99,acc:0,isBattleCommand:true,ceCost:domain.ceCost,effect:{type:'BATTLE_DOMAIN',target:'self',domain,domainType}} : null;
}

export function buildVowCommand(vow) {
  return vow ? {id:vow.id,name:vow.name,p:0,t:'PSYCHIC',cat:'status',pp:99,acc:0,isBattleCommand:true,ceCost:vow.ceCost || 0,effect:{type:'BATTLE_VOW',target:'self',vow}} : null;
}

export function canUseCrossoverCommand(battle, unit, move, side, availableCE) {
  if (!unit || unit.currentHp<=0 || availableCE<(move.ceCost || 0)) return false;
  if (move.effect?.type==='BATTLE_DOMAIN') return !!unit.hasDomain && !unit.usedDomain && battle.activeDomain?.ownerSide!==side;
  if (move.effect?.type==='BATTLE_VOW') return !unit.activeVow && !(unit.vowCooldowns?.[move.effect.vow.id]>0);
  return true;
}

export function applyCrossoverCommand(battle, unit, move, side, {getStats,addLog,updateAchStat}) {
  const effect = move.effect;
  if (effect.type==='BATTLE_DOMAIN') {
    const result = resolveDomainActivation(battle.activeDomain,side,effect.domain,effect.domainType);
    if (result.blocked) return;
    unit.usedDomain = true;
    battle.activeDomain = result.activeDomain;
    addLog(result.isClash ? `${unit.name} 的 ${move.name} 与对方领域相互抵消。` : `${unit.name} 展开 ${move.name}。`);
    if (side==='player') updateAchStat({domainsUsed:1,...(result.isClash ? {domainClash:1} : {})});
  }
  if (effect.type==='BATTLE_VOW') {
    const vow = effect.vow;
    if (vow.sacrifice.hpPercent) unit.currentHp = Math.max(1,unit.currentHp-Math.floor(getStats(unit).maxHp*vow.sacrifice.hpPercent));
    if (vow.sacrifice.cePercent) {
      const pool = side==='player' ? 'sharedPlayerCE' : 'sharedEnemyCE';
      const maxPool = side==='player' ? 'sharedPlayerMaxCE' : 'sharedEnemyMaxCE';
      const available = battle[maxPool]>0 ? battle[pool] : unit.cursedEnergy;
      unit.cursedEnergy = Math.max(0,available-Math.floor(available*vow.sacrifice.cePercent));
      if (battle[maxPool]>0) battle[pool] = unit.cursedEnergy;
    }
    if (vow.reward.spdMult>0) unit.stages.spd = Math.min(6,(unit.stages.spd || 0)+Math.max(0,Math.round(Math.log2(vow.reward.spdMult)*4)));
    unit.activeVow = {...vow,turnsLeft:vow.reward.turns || 3,side};
    unit.vowUsed = true;
    unit.vowCooldowns = {...unit.vowCooldowns,[vow.id]:(vow.cooldown || 0)+1};
    addLog(`${unit.name} 立下 ${vow.name}。${vow.desc}`);
    if (side==='player') updateAchStat({vowsUsed:1});
  }
}
