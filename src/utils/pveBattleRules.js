/**
 * PVE 战斗规则处理 — 灵域试炼、生态事件、Boss 机制
 * 由 App.js 在回合开始/结束/伤害计算时调用
 */

import { getSpiritDomainRule } from '../data/spiritDomains';
import { getBossMechanicDef, checkForestWillEcology, getBossPhaseForHp } from '../data/bossMechanics';
import { getAdaptationMult } from '../data/ecoAdaptation';

export function getDomainRuleId(battleState) {
  return battleState?.domainRule;
}

export function shouldForestVineBlock(battleState, source) {
  if (source !== 'player') return false;
  const rule = getSpiritDomainRule(battleState?.domainRule);
  if (!rule) return false;
  if (rule.id === 'forest_growth' || battleState.domainRule === 'forest_vine') {
    const interval = rule.vineGrowInterval || 3;
    const turn = battleState.turnCount || 0;
    const growBonus = turn > 0 && turn % interval === 0 ? 0.15 : 0;
    const chance = (rule.vineBlockChance || 0.35) + growBonus + (battleState._ecoVineBonus || 0);
    return Math.random() < chance;
  }
  return false;
}

export function shouldGravitySkip(battleState, source, attacker, player, enemy) {
  if (!battleState?._gravityActive || battleState.type !== 'world_boss') return false;
  const pSpd = player?._effectiveSpd ?? 0;
  const eSpd = enemy?._effectiveSpd ?? 0;
  const atkSpd = source === 'player' ? pSpd : eSpd;
  const otherSpd = source === 'player' ? eSpd : pSpd;
  return atkSpd < otherSpd;
}

export function calcFireHeatPPExtra(battleState, move) {
  const rule = getSpiritDomainRule(battleState?.domainRule);
  if (!rule || (rule.id !== 'fire_heat' && battleState.domainRule !== 'fire_heat')) return 0;
  return move?.t === 'WATER' ? (rule.waterPPExtra || 1) : 0;
}

export function applyStarShieldDamage(defender, move, dmg, battleState) {
  if (dmg <= 0 || (defender._starShield || 0) <= 0) return dmg;
  if (battleState?.type !== 'world_boss' && !battleState?.ecoBossMechanics) return dmg;
  const def = getBossMechanicDef('star_dream');
  const breakTypes = def?.shieldTypes || ['FAIRY', 'PSYCHIC'];
  if (!breakTypes.includes(move?.t)) return 0;
  const absorbed = Math.min(defender._starShield, dmg);
  defender._starShield -= absorbed;
  return dmg - absorbed;
}

export function processDomainTurnStart(state, player, enemy, addLog) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule) return;
  const turn = (state.turnCount || 0) + 1;

  if (rule.id === 'fire_heat' || state.domainRule === 'fire_heat') {
    [player, enemy].forEach((u, i) => {
      if (!u || u.currentHp <= 0) return;
      const types = [u.type, u.secondaryType, u.type2].filter(Boolean);
      if (types.some(t => rule.heatTypes?.includes(t))) return;
      const dot = Math.max(1, Math.floor((u.maxHp || 100) * (rule.heatDotPct || 0.02)));
      u.currentHp = Math.max(0, u.currentHp - dot);
      if (addLog) addLog(`🔥 高温灼烧！${u.name} 受到 ${dot} 点伤害`);
    });
  }

  if (rule.id === 'wind_tower' || state.domainRule === 'wind_tower') {
    if (turn % (rule.windEyeInterval || 5) === 0) {
      if (player) player._windFatigue = 0;
      if (enemy) enemy._windFatigue = 0;
      if (addLog) addLog('💨 风眼出现！双方疲劳清零');
    }
  }

  if (rule.id === 'forest_growth' && turn % (rule.vineGrowInterval || 3) === 0) {
    state._vineActive = true;
    if (addLog) addLog('🌿 藤蔓格生长！木系站在藤蔓上会回血');
  }
}

export function processBossMechanicsTurnEnd(state, player, enemy, addLog, getStats) {
  if (!state || enemy?.currentHp <= 0) return { playerDied: false };
  let playerDied = false;
  const wb = state.worldBoss;
  const phases = wb?.phases;
  if (!phases && !state.ecoBossMechanics) return { playerDied };

  const maxHp = getStats ? getStats(enemy).maxHp : (enemy.maxHp || 1);
  const hpPct = enemy.currentHp / maxHp;
  const phase = getBossPhaseForHp(phases, hpPct);

  if (phase?.mechanic === 'meteor_summon' && player?.currentHp > 0 && Math.random() < 0.3) {
    const meteorDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.05));
    player.currentHp = Math.max(0, player.currentHp - meteorDmg);
    if (addLog) addLog(`☄️ 小陨石坠落！${player.name} 受到 ${meteorDmg} 点伤害`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'vine_spread' && player?.currentHp > 0 && Math.random() < 0.35) {
    const vineDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.04));
    player.currentHp = Math.max(0, player.currentHp - vineDmg);
    if (addLog) addLog(`🌿 黑藤吸收生命！${player.name} 失去 ${vineDmg} HP`);
    if (player.currentHp <= 0) playerDied = true;
    if (state._crisisBranch === 'heal') {
      enemy._vineAnger = (enemy._vineAnger || 0) + 1;
    }
  }

  if (phase?.mechanic === 'forest_will') {
    const ecology = state._regionEcology;
    if (checkForestWillEcology(ecology)) {
      if (!enemy._forestAid && addLog) {
        addLog('🌳 森林意志相助！黑藤生成速度降低，我方精灵回血');
        enemy._forestAid = true;
      }
      if (player?.currentHp > 0) {
        const heal = Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.03);
        player.currentHp = Math.min(getStats ? getStats(player).maxHp : player.maxHp, player.currentHp + heal);
      }
    }
  }

  if (phase?.mechanic === 'parasite' && !state._parasiteApplied && player?.currentHp > 0) {
    state._parasiteApplied = true;
    state._parasiteTarget = 'player';
    if (addLog) addLog(`🦠 ${enemy.name} 寄生了你的 ${player.name}！治疗可能流向Boss`);
  }

  state._gravityActive = phase?.mechanic === 'gravity_field';
  if (phase?.mechanic === 'star_dream' && phase.shield && (enemy._starShield || 0) <= 0) {
    enemy._starShield = phase.shield;
  }

  return { playerDied };
}

export function getMirrorLakeMove(state) {
  if (state.domainRule !== 'mirror_lake' && getSpiritDomainRule(state.domainRule)?.id !== 'mirror_lake') return null;
  const echo = state._echoQueue?.[0] || state._lastPlayerMove;
  return echo?.p > 0 ? { ...echo, pp: 99 } : null;
}

export function queueMirrorEcho(state, move) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule || rule.id !== 'mirror_lake') {
    if (state.domainRule === 'mirror_lake' && move?.p > 0) {
      state._lastPlayerMove = { name: move.name, p: move.p, t: move.t, cat: move.cat, acc: move.acc || 100, effect: move.effect };
    }
    return;
  }
  if (!move?.p) return;
  const echo = { name: move.name, p: move.p, t: move.t, cat: move.cat, acc: move.acc || 100, effect: move.effect };
  if (move.p >= 80 && rule.bigMoveRecoil) state._echoRecoilPending = rule.bigMoveRecoil;
  state._lastPlayerMove = echo;
  if (!state._echoQueue) state._echoQueue = [];
  state._echoQueue.push(echo);
}

export function processWindTowerFollowUp(state, player, enemy, performAction, addLog, getStats) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule || (rule.id !== 'wind_tower' && state.domainRule !== 'wind_tower')) return null;
  if (!player || !enemy || player.currentHp <= 0 || enemy.currentHp <= 0) return null;
  const pSpd = getStats(player).spd * (state._playerAdaptMult || 1);
  const eSpd = getStats(enemy).spd;
  if (pSpd === eSpd) return null;
  const fasterSide = pSpd > eSpd ? 'player' : 'enemy';
  const faster = pSpd > eSpd ? player : enemy;
  const slower = pSpd > eSpd ? enemy : player;
  const power = Math.max(20, Math.floor((faster.level || 30) * (rule.followUpPower || 0.35)));
  const followMove = { name: '风塔追击', p: power, t: 'FLYING', cat: 'special', acc: 100, pp: 99 };
  if (fasterSide === 'player') {
    faster._windFatigue = (faster._windFatigue || 0) + (rule.fatiguePerFastAction || 25);
    if (faster._windFatigue >= (rule.fatigueThreshold || 100)) {
      if (addLog) addLog(`💨 ${faster.name} 疲劳过度，跳过追击！`);
      faster._windFatigue = 0;
      return null;
    }
  }
  if (addLog) addLog(`💨 风塔乱流！${faster.name} 发动追击！`);
  return { faster, slower, followMove, fasterSide };
}

export function applyAdaptationToCombatState(state, party, mapId) {
  if (!state?.playerCombatStates || !mapId) return;
  state.playerCombatStates.forEach((cs, i) => {
    const pet = party?.[i];
    if (!pet || !cs) return;
    const mult = getAdaptationMult(pet, mapId);
    cs._adaptMult = mult;
  });
}

export function isDarkMoonHidden(battleState) {
  const rule = getSpiritDomainRule(battleState?.domainRule);
  return rule?.id === 'dark_moon' || battleState?.domainRule === 'dark_moon';
}

export function canDarkMoonScout(move) {
  const rule = getSpiritDomainRule('dark_moon');
  return rule?.scoutTypes?.includes(move?.t);
}
