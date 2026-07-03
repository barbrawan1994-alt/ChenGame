/** 门派战斗逻辑：心法中/高阶、武学、气势 */
import { getXinfaTier, getMartialArtById, SECT_XINFA } from '../data/sectSystem';

export const SECT_MOMENTUM_MAX = 100;
export const SECT_MOMENTUM_PER_CRIT = 12;
export const SECT_MOMENTUM_PER_DODGE = 10;
export const SECT_MOMENTUM_PER_HEAL = 8;
export const SECT_MOMENTUM_PER_REFLECT = 9;
export const SECT_MOMENTUM_PER_KILL = 15;

export function getPlayerSectCombatContext(pet, battleState) {
  const ps = battleState?._playerSectState;
  if (!ps?.playerSect || !pet) return { xinfaTier: 1, isMainSectPet: false };
  const sid = pet.sectId || 0;
  const isMain = sid === ps.playerSect;
  const isSub = sid === ps.playerSubSect;
  const xinfaTier = isMain ? getXinfaTier(ps.sectXinfaLevels, ps.playerSect) : (isSub ? Math.min(2, getXinfaTier(ps.sectXinfaLevels, ps.playerSubSect)) : 1);
  return { xinfaTier, isMainSectPet: isMain, isSubSectPet: isSub, playerSect: ps.playerSect, playerSubSect: ps.playerSubSect };
}

export function applyXinfaDamageMods(rawDmg, attacker, defender, ctx, battleLog) {
  if (!ctx?.isMainSectPet && !ctx?.isSubSectPet) return rawDmg;
  const tier = ctx.xinfaTier || 1;
  const atkSect = attacker?.sectId || 0;
  let dmg = rawDmg;

  if (tier >= 2 && atkSect === 1 && Math.random() < 0.1) {
    dmg *= 1.15;
    battleLog?.('剑气追加！');
  }
  if (tier >= 3 && atkSect === 1 && attacker?._sectKillChain) {
    dmg *= 1.2;
    attacker._sectKillChain = false;
    battleLog?.('飞剑追击！');
  }
  if (tier >= 2 && atkSect === 2) {
    dmg *= 0.92;
  }
  if (tier >= 3 && atkSect === 2 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.35) {
    dmg *= 0.85;
  }
  if (tier >= 2 && atkSect === 3) {
    attacker._xiaoyaoStack = (attacker._xiaoyaoStack || 0);
    if (attacker._xiaoyaoStack > 0) { dmg *= (1 + attacker._xiaoyaoStack * 0.12); attacker._xiaoyaoStack = 0; }
  }
  if (tier >= 2 && atkSect === 4 && Math.random() < 0.15) {
    defender._darkWeaponMark = (defender._darkWeaponMark || 0) + 1;
    battleLog?.(`暗器标记 x${defender._darkWeaponMark}！`);
    if (tier >= 3 && defender._darkWeaponMark >= 3) {
      dmg *= 1.5;
      defender._darkWeaponMark = 0;
      battleLog?.('暗器标记引爆！');
    }
  }
  if (tier >= 2 && atkSect === 5 && attacker) {
    if (attacker.currentHp < (attacker._maxHp || 999) * 0.3 && !attacker._deathSaveReady && !attacker._deathSaveUsed) {
      attacker._deathSaveReady = true;
      battleLog?.('长生诀·蓄力：濒死自动护命！');
    }
  }
  if (tier >= 2 && atkSect === 6) dmg *= 1.08;
  if (tier >= 3 && atkSect === 6 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.4) dmg *= 1.15;
  if (tier >= 2 && atkSect === 7 && defender?.volatiles?.slowed) dmg *= 1.12;
  if (tier >= 2 && atkSect === 8) dmg *= 1.05;
  if (tier >= 3 && atkSect === 8 && defender?.status === 'PSN') dmg *= 1.18;
  if (tier >= 2 && atkSect === 9 && attacker?._sectComboTarget === defender?.uid) dmg *= 1.08;
  if (tier >= 3 && atkSect === 9 && (attacker?._partySize ?? 0) >= 4) dmg *= 1.06;
  if (tier >= 2 && atkSect === 10) dmg *= 1.12;
  if (tier >= 2 && atkSect === 11) {
    attacker._purpleQi = (attacker._purpleQi || 0) + 1;
    if (attacker._purpleQi >= 3) { dmg *= 1.2; attacker._purpleQi = 0; battleLog?.('紫霞真气爆发！'); }
  }
  if (tier >= 2 && atkSect === 12 && rawDmg > 80) dmg *= 1.1;
  if (tier >= 3 && atkSect === 12) {
    if (attacker._sectShield > 0) dmg *= 1.08;
  }

  // 扩展门派 13–30 心法
  if (tier >= 2 && atkSect === 13 && Math.random() < 0.15) { dmg *= 1.12; battleLog?.('峨眉剑意连击！'); }
  if (tier >= 3 && atkSect === 13) dmg *= 1.08;
  if (tier >= 2 && atkSect === 14) dmg *= 1.05;
  if (tier >= 3 && atkSect === 14 && (defender?.stages?.p_def || 0) > 0) dmg *= 1.12;
  if (tier >= 2 && atkSect === 15) dmg *= 1.03;
  if (tier >= 3 && atkSect === 15 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.4) dmg *= 1.15;
  if (tier >= 2 && atkSect === 16) dmg *= 1.05;
  if (tier >= 3 && atkSect === 16) dmg *= 1.10;
  if (tier >= 2 && atkSect === 17 && attacker?._sectShield > 0) dmg *= 1.06;
  if (tier >= 3 && atkSect === 17 && !attacker?._sectShield) dmg *= 1.08;
  if (tier >= 2 && atkSect === 18 && Math.random() < 0.12) { dmg *= 1.10; battleLog?.('玉女反击蓄力！'); }
  if (tier >= 3 && atkSect === 18) dmg *= 1.12;
  if (tier >= 2 && atkSect === 19) dmg *= 1.03;
  if (tier >= 3 && atkSect === 19) dmg *= 1.10;
  if (tier >= 2 && atkSect === 20 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.5) dmg *= 1.08;
  if (tier >= 3 && atkSect === 20 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.3) dmg *= 1.15;
  if (atkSect === 21 && defender?.status === 'PAR') {
    if (tier >= 3) dmg *= 1.18;
    else if (tier >= 2) dmg *= 1.10;
  }
  if (tier >= 2 && atkSect === 22) dmg *= 1.05;
  if (tier >= 3 && atkSect === 22 && (defender?.stages?.p_atk || 0) < 0) { attacker.stages = attacker.stages || {}; attacker.stages.p_atk = Math.min(6, (attacker.stages.p_atk || 0) + 1); battleLog?.('吸星换月！'); }
  if (tier >= 2 && atkSect === 23 && Math.random() < 0.10) { defender.volatiles = { ...defender.volatiles, sectCharmed: 2 }; battleLog?.('灵鹫威压！'); }
  if (tier >= 3 && atkSect === 23 && defender?.volatiles?.sectCharmed) dmg *= 1.12;
  if (tier >= 2 && atkSect === 24 && (defender?.stages?.spd || 0) < 0) dmg *= 1.08;
  if (tier >= 3 && atkSect === 24) dmg *= 1.06;
  if (tier >= 2 && atkSect === 25) dmg *= 1.05;
  if (tier >= 3 && atkSect === 25 && (defender?.stages?.eva || 0) > 0) dmg *= 1.10;
  if (tier >= 2 && atkSect === 26) dmg *= 1.04;
  if (tier >= 3 && atkSect === 26) dmg *= 1.06;
  if (tier >= 2 && atkSect === 27) dmg *= 1.05;
  if (tier >= 3 && atkSect === 27) dmg *= 1.10;
  if (tier >= 2 && atkSect === 28) dmg *= 1.08;
  if (tier >= 3 && atkSect === 28) dmg *= 1.06;
  if (tier >= 2 && atkSect === 29 && attacker?.currentHp < (attacker?._maxHp || 999) * 0.3) dmg *= 1.10;
  if (tier >= 3 && atkSect === 29 && attacker?._sectEndureUsed) dmg *= 1.20;
  if (tier >= 2 && atkSect === 30) dmg *= 1.04;
  if (tier >= 3 && atkSect === 30) dmg *= 1.10;

  return Number.isFinite(dmg) ? dmg : rawDmg;
}

export function applyMartialArtEffect(art, attacker, defender, rawDmg, addLog) {
  if (!art) return rawDmg;
  let dmg = rawDmg;
  if (art.id?.includes('_basic') && attacker?.sectId === 1) {
    const spd = attacker._stats?.spd || 100;
    if (spd > 120) dmg *= 1.08;
  }
  const _dt = defender?.type, _dt2 = defender?.type2 || defender?.secondaryType;
  const _canStatus = (st) => {
    if (defender?.status) return false;
    if (st === 'BRN') return _dt !== 'FIRE' && _dt2 !== 'FIRE';
    if (st === 'FRZ') return _dt !== 'ICE' && _dt2 !== 'ICE';
    if (st === 'PSN') return _dt !== 'POISON' && _dt2 !== 'POISON' && _dt !== 'STEEL' && _dt2 !== 'STEEL';
    if (st === 'PAR') return _dt !== 'ELECTRIC' && _dt2 !== 'ELECTRIC';
    return true;
  };
  if (art.desc?.includes('破防') && defender?.stages?.p_def < 0) dmg *= 1.3;
  if (art.burnChance && Math.random() < art.burnChance && _canStatus('BRN')) {
    defender.status = 'BRN';
    addLog?.(`${defender.name} 被灼伤！`);
  }
  if (art.poisonChance && Math.random() < art.poisonChance && _canStatus('PSN')) {
    defender.status = 'PSN';
    addLog?.(`${defender.name} 中毒！`);
  }
  if (art.freezeChance && Math.random() < art.freezeChance) {
    if (Math.random() < 0.5 && _canStatus('FRZ')) defender.status = 'FRZ';
    else defender.volatiles = { ...defender.volatiles, slowed: true };
  }
  if (art.healRatio && attacker) {
    const heal = Math.floor((attacker._maxHp || 100) * art.healRatio);
    attacker.currentHp = Math.min(attacker._maxHp || heal, attacker.currentHp + heal);
    addLog?.(`${attacker.name} 恢复 ${heal} HP！`);
    if (art.power === 0) return 0;
  }
  return dmg;
}

export function buildMartialMove(artId) {
  const art = getMartialArtById(artId);
  if (!art) return null;
  const move = {
    name: art.name,
    p: art.power,
    pp: art.pp,
    maxPP: art.pp,
    t: art.type,
    type: art.type,
    category: art.power === 0 ? 'status' : (['FIGHT', 'GROUND', 'STEEL', 'NORMAL', 'FLYING', 'ROCK', 'BUG', 'GHOST', 'DARK'].includes(art.type) ? 'physical' : 'special'),
    acc: 100,
    isMartialArt: true,
    martialArtId: art.id,
    momentumCost: art.momentumCost || 0,
    desc: art.desc,
  };
  if (art.healRatio) {
    move.effect = art.power === 0
      ? { type: 'HEAL', val: art.healRatio }
      : { healPercent: art.healRatio };
  }
  return move;
}

export function getAvailableMartialMoves(playerSectState) {
  if (!playerSectState?.playerSect) return [];
  const learned = playerSectState.sectMartialArts || [];
  const moves = [];
  for (const id of learned) {
    const m = buildMartialMove(id);
    if (m) moves.push(m);
  }
  return moves.slice(0, 4);
}

export function gainSectMomentum(battleState, amount, reason) {
  if (!battleState) return;
  if (battleState._sectMomentum == null) battleState._sectMomentum = 0;
  battleState._sectMomentum = Math.min(SECT_MOMENTUM_MAX, battleState._sectMomentum + amount);
  if (reason) battleState._sectMomentumReason = reason;
}

export function spendSectMomentum(battleState, cost) {
  if ((battleState?._sectMomentum || 0) < cost) return false;
  battleState._sectMomentum -= cost;
  return true;
}

export function initBattleSectState(battleState, playerSectState) {
  if (!battleState) return;
  battleState._playerSectState = playerSectState;
  if (battleState._sectMomentum == null) battleState._sectMomentum = 0;
  const ps = playerSectState;
  if (!ps?.playerSect) return;
  (battleState.playerCombatStates || battleState.playerParty || []).forEach(p => {
    if (!p) return;
    if (p.sectId === 10 && getXinfaTier(ps.sectXinfaLevels, 10) >= 2) p._sectAnalysis = true;
    if (p.sectId === 2 && getXinfaTier(ps.sectXinfaLevels, 2) >= 2) {
      const max = p._maxHp || p.currentHp || 100;
      p._sectShield = Math.floor(max * 0.12);
    }
    if (p.sectId === 17 && getXinfaTier(ps.sectXinfaLevels, 17) >= 2) {
      const max = p._maxHp || p.currentHp || 100;
      p._sectShield = Math.floor(max * 0.06);
    }
  });
}

export function applySectShieldAbsorb(defender, rawDmg, addLog) {
  if (!defender || !defender._sectShield || defender._sectShield <= 0) return rawDmg;
  const absorbed = Math.min(defender._sectShield, rawDmg);
  defender._sectShield -= absorbed;
  const remaining = rawDmg - absorbed;
  if (addLog && absorbed > 0) {
    const shieldName = defender.sectId === 17 ? '恒山玄冰盾' : '少林金钟罩';
    addLog(`🛡️ ${shieldName}吸收了 ${absorbed} 伤害！${defender._sectShield > 0 ? `(护盾剩余${defender._sectShield})` : '(护盾破碎)'}`);
  }
  return remaining;
}

export function onSectDodge(pet, battleState, addLog) {
  if (!pet || !battleState) return;
  if (pet.sectId === 3) {
    pet._xiaoyaoStack = (pet._xiaoyaoStack || 0) + 1;
    addLog?.(`逍遥步法！蓄力 x${pet._xiaoyaoStack}`);
  }
  gainSectMomentum(battleState, SECT_MOMENTUM_PER_DODGE, '闪避');
}

export function onSectHeal(battleState) {
  if (!battleState) return;
  gainSectMomentum(battleState, SECT_MOMENTUM_PER_HEAL, '治疗');
}

export function applySectDeathSave(pet, addLog) {
  if (!pet) return false;
  if (pet._deathSaveReady && !pet._deathSaveUsed && pet.currentHp <= 0) {
    pet.currentHp = 1;
    pet._deathSaveReady = false;
    pet._deathSaveUsed = true;
    addLog?.(`${pet.name} 长生诀发动：濒死护命，保留 1 HP！`);
    return true;
  }
  return false;
}

export function getXinfaEffectDesc(sectId, tier) {
  const xf = SECT_XINFA[sectId];
  if (!xf) return '';
  const t = xf.tiers.find(x => x.tier === tier);
  return t?.desc || xf.tiers[0]?.name || '';
}
