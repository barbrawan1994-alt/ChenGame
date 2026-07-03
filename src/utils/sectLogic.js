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
  if (tier >= 3 && atkSect === 9 && (attacker?._partySize || 6) >= 4) dmg *= 1.06;
  if (tier >= 2 && atkSect === 10) dmg *= 1.12;
  if (tier >= 2 && atkSect === 11) {
    attacker._purpleQi = (attacker._purpleQi || 0) + 1;
    if (attacker._purpleQi >= 3) { dmg *= 1.2; attacker._purpleQi = 0; battleLog?.('紫霞真气爆发！'); }
  }
  if (tier >= 2 && atkSect === 12 && defender?._lastDamage > 80) dmg *= 1.1;
  if (tier >= 3 && atkSect === 12) {
    if (attacker._sectShield > 0) dmg *= 1.08;
  }

  return dmg;
}

export function applyMartialArtEffect(art, attacker, defender, rawDmg, addLog) {
  if (!art) return rawDmg;
  let dmg = rawDmg;
  if (art.id?.includes('_basic') && attacker?.sectId === 1) {
    const spd = attacker._stats?.spd || 100;
    if (spd > 120) dmg *= 1.08;
  }
  if (art.desc?.includes('破防') && defender?.stages?.p_def < 0) dmg *= 1.3;
  if (art.burnChance && Math.random() < art.burnChance) {
    defender.status = 'BRN';
    addLog?.(`${defender.name} 被灼伤！`);
  }
  if (art.poisonChance && Math.random() < art.poisonChance) {
    defender.status = 'PSN';
    addLog?.(`${defender.name} 中毒！`);
  }
  if (art.freezeChance && Math.random() < art.freezeChance) {
    if (Math.random() < 0.5) defender.status = 'FRZ';
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
    category: art.power === 0 ? 'status' : (['FIGHT', 'GROUND', 'STEEL'].includes(art.type) ? 'physical' : 'special'),
    acc: 100,
    isMartialArt: true,
    martialArtId: art.id,
    momentumCost: art.momentumCost || 0,
    desc: art.desc,
  };
  if (art.healRatio) move.effect = { healPercent: art.healRatio };
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
      p._sectShield = Math.floor(max * 0.08);
    }
  });
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
