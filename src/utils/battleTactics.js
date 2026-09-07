import { BATTLE_TACTICS, BREATHING_TECHNIQUES, BREATHING_FOCUS, BATTLE_CHARGE, BATTLE_GUARD } from '../data/battleTactics';
import { JUTSU_DB, CHAKRA_NATURE_MAP, NINJA_RANKS, getNinjaRank, getUnlockedJutsuRanks } from '../data/naruto';

export function getCombatFamily(move) {
  if (move?.isUltraFinisher || move?.isFruitMove || move?.isBijuu) return 'burst';
  if (move?.isBreathing) return 'breathing';
  if (move?.isJutsu || move?.isComboJutsu) return 'ninja';
  if (move?.isCursed) return 'curse';
  if (move?.isMartialArt) return 'martial';
  return 'basic';
}

export function mergeBattleGrowth(unit, updated) {
  if (!updated) return unit;
  const fields = ['level','currentHp','exp','nextExp','name','moves','canEvolve','pendingLearnMove','pendingLearnMoves'];
  const growth = Object.fromEntries(fields.filter(key=>key in updated).map(key=>[key,updated[key]]));
  const temporary = (unit.combatMoves || []).filter(move=>move.isExtra || move.isCursed || move.isMartialArt || move.isJutsu || move.isFruitMove || move.isBreathing || (move.isUltraFinisher && unit.ultraTransformed));
  return {...unit,...growth,combatMoves:[...(updated.moves || []),...temporary]};
}

export function getBattleCommand(index) {
  const command = index?.isBattleCommand ? index : index === -2 ? BATTLE_CHARGE : index === -10 ? BATTLE_GUARD : null;
  return command ? {...command,effect:{...command.effect}} : null;
}

export function getEnemyNinjaRank(level) {
  const id = level>=70 ? 'kage' : level>=55 ? 'jonin' : level>=40 ? 'chunin' : level>=25 ? 'genin' : 'academy';
  return NINJA_RANKS.find(rank=>rank.id===id) || NINJA_RANKS[0];
}

export function getEligiblePreparedJutsu(pet, narutoState) {
  const rank = getNinjaRank(narutoState?.examsCompleted || 0);
  if (!pet || pet.level < 30 || rank.id === 'academy') return [];
  const rankAccess = {genin:['D','C'],chunin:['D','C','B'],jonin:['D','C','B','A'],kage:['D','C','B','A','S']}[rank.id] || [];
  const levelAccess = getUnlockedJutsuRanks(pet.level);
  const nature = Object.entries(CHAKRA_NATURE_MAP).find(([, value])=>value.gameType === pet.type)?.[0];
  return JUTSU_DB.filter(move=>(!move.nature || move.nature === nature) && rankAccess.includes(move.rank || 'D') && levelAccess.includes(move.rank || 'D') && (!move.isKekkei || pet.level >= 65));
}

export function selectPreparedJutsu(pet, narutoState) {
  const available = getEligiblePreparedJutsu(pet, narutoState);
  const slots = getNinjaRank(narutoState?.examsCompleted || 0).id === 'kage' ? 2 : 1;
  const chosen = [...new Set(Array.isArray(pet?.preparedJutsu) ? pet.preparedJutsu : [])].map(id=>available.find(move=>move.id===id)).filter(Boolean).slice(0,slots);
  const ranked = [...available].sort((a,b)=>(narutoState?.jutsuMastery?.[b.id] || 0)-(narutoState?.jutsuMastery?.[a.id] || 0) || (b.p || 0)-(a.p || 0) || a.id.localeCompare(b.id));
  for (const move of ranked) if(chosen.length<slots && !chosen.some(item=>item.id===move.id)) chosen.push(move);
  return chosen;
}

export function buildBreathingMoves(styleId, badgeCount, crisisUnlocks = []) {
  if (badgeCount < BATTLE_TACTICS.breathingBadgeRequirement) return [];
  const advanced = ['insect','mist','sun','moon'];
  const safeId = advanced.includes(styleId) && !crisisUnlocks.includes('breathing_unlock') ? 'water' : styleId;
  const technique = BREATHING_TECHNIQUES[safeId];
  if (!technique) return [];
  return [{...BREATHING_FOCUS,effect:{...BREATHING_FOCUS.effect}}, {id:`breathing_${safeId}`,category:'physical',acc:100,pp:8,maxPP:8,isBreathing:true,...technique,effect:technique.effect ? {...technique.effect} : undefined}];
}

export function getCrossoverMultiplier(multipliers) {
  const bonus = multipliers.reduce((sum,value)=>sum + (Number.isFinite(value) ? Math.max(0,value-1) : 0),0);
  const penalty = multipliers.reduce((product,value)=>product * (Number.isFinite(value) && value>=0 && value<1 ? value : 1),1);
  return (1 + Math.min(BATTLE_TACTICS.crossoverBonusCap,bonus))*penalty;
}

export function getBurstBlock(battle, side = 'player') {
  if (side==='player' && battle?.phase==='double_input_2' && battle.doubleActions?.[0]?.moveIdx?.effect?.type==='BATTLE_FRUIT') return '首位指令已预留本场爆发机会';
  const units = side === 'player' ? battle?.playerCombatStates : battle?.enemyParty;
  const spent = battle?.burstUsed?.[side] || units?.some(unit=>unit.fruitUsed || unit.bijuuUsed) || (side==='player' && battle?.ultraUsed);
  return spent ? '本场队伍的爆发机会已使用' : '';
}

export function spendTeamBurst(battle, side, kind) {
  if (getBurstBlock(battle,side)) return false;
  battle.burstUsed = {...battle.burstUsed,[side]:kind};
  return true;
}

export function hasTacticalOpening(target, battle, attacker, move) {
  const opening = target?.volatiles?.tacticalOpening;
  if (!opening || battle?.isPvP || opening.expiresAt <= (battle?.turnCount || 0)) return false;
  return opening.family !== getCombatFamily(move) || (battle?.isDouble && opening.ownerUid !== attacker?.uid);
}

export function recordTacticalSetup(target, before, battle, attacker, move) {
  if (!target || target.currentHp <= 0 || battle?.isPvP || move?.effect?.target === 'self') return false;
  const newStatus = !!target.status && target.status !== before.status;
  const newConfusion = (target.volatiles?.confused || 0) > (before.confused || 0);
  const weakened = Object.entries(target.stages || {}).some(([stat,value])=>value < (before.stages?.[stat] || 0));
  if (!newStatus && !newConfusion && !weakened) return false;
  target.volatiles = {...target.volatiles,tacticalOpening:{family:getCombatFamily(move),ownerUid:attacker?.uid,expiresAt:(battle?.turnCount || 0)+BATTLE_TACTICS.openingDuration}};
  return true;
}

export function snapshotTacticalTarget(target) {
  return {status:target?.status,confused:target?.volatiles?.confused || 0,stages:{...target?.stages}};
}

export function applyTacticalGuard(unit, battle, reduction = BATTLE_TACTICS.guardReduction) {
  unit.volatiles = {...unit.volatiles,tacticalGuard:{reduction,expiresAt:(battle.turnCount || 0)+1}};
}

export function consumeTacticalGuard(unit, battle, damage) {
  const guard = unit?.volatiles?.tacticalGuard;
  if (!guard || guard.expiresAt <= (battle.turnCount || 0) || damage <= 0) return damage;
  delete unit.volatiles.tacticalGuard;
  return Math.max(1,Math.floor(damage*(1-guard.reduction)));
}

export function applyBattleCharge(battle, unit, side, ceAmount, chakraAmount) {
  const prefix = side === 'player' ? 'sharedPlayer' : 'sharedEnemy';
  const report = [];
  for (const [resource,maxKey,poolKey,maxPoolKey,amount,label] of [
    ['cursedEnergy','maxCE',`${prefix}CE`,`${prefix}MaxCE`,ceAmount,'咒力'],
    ['chakra','maxChakra',`${prefix}Chakra`,`${prefix}MaxChakra`,chakraAmount,'查克拉'],
  ]) {
    const max = battle[maxPoolKey] || unit[maxKey] || 0;
    if (!max) continue;
    const old = battle[maxPoolKey] ? (battle[poolKey] || 0) : (unit[resource] || 0);
    const next = Math.min(max,old+amount);
    if (battle[maxPoolKey]) battle[poolKey] = next;
    unit[resource] = Math.min(unit[maxKey] || max,next);
    report.push(`${label} +${next-old}`);
  }
  return report;
}
