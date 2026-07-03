/** 门派 13–30 战斗被动 */

const STAT_KEYS = ['p_atk', 'p_def', 's_atk', 's_def', 'spd'];

export function refreshSectBarrier(pet, sectLv, turnCount) {
  if (!pet || pet.sectId !== 17 || sectLv <= 0) return;
  if (pet._barrierTurn === turnCount) return;
  const maxHp = pet._maxHp || pet.currentHp || 100;
  pet._sectShield = Math.floor(maxHp * (0.01 + sectLv * 0.005));
  pet._barrierTurn = turnCount;
}

export function applyExtendedSectPreDamage(rawDmg, ctx) {
  const {
    attacker, atkSect, atkSectLv, battleState, weather, move, getStats, party,
  } = ctx;
  if (!atkSect || atkSect < 13 || atkSectLv <= 0) return rawDmg;
  let dmg = rawDmg;
  const turn = battleState?.turnCount || 0;
  const maxHp = attacker._maxHp || getStats?.(attacker)?.maxHp || 100;
  const hpRatio = maxHp > 0 ? attacker.currentHp / maxHp : 1;

  if (atkSect === 14) {
    const ignore = (2 + atkSectLv * 1.5) / 100;
    dmg *= (1 + ignore * 0.65);
  }
  if (atkSect === 16) {
    const odd = turn % 2 === 1;
    dmg *= odd ? 1.18 : 0.90;
  }
  if (atkSect === 17) {
    refreshSectBarrier(attacker, atkSectLv, turn);
  }
  if (atkSect === 19) {
    dmg *= (1 + (0.01 + atkSectLv * 0.008));
  }
  if (atkSect === 20 && hpRatio < 0.5) {
    const bonus = Math.min(atkSectLv * 0.02, 0.2);
    dmg *= (1 + bonus * (1 - hpRatio) * 2);
  }
  if (atkSect === 25) {
    const eva = ctx.defender?.stages?.eva || 0;
    if (eva > 0) dmg *= (1 + atkSectLv * 0.01);
  }
  if (atkSect === 26 && party?.length) {
    const allies = party.filter(p => p?.sectId === atkSect && (p.currentHp ?? 1) > 0).length;
    if (allies > 1) dmg *= (1 + (allies - 1) * atkSectLv * 0.015);
  }
  if (atkSect === 27 && weather && weather !== 'CLEAR') {
    dmg *= (1 + (0.03 + atkSectLv * 0.02));
  }
  if (atkSect === 28 && turn <= 1 && move?.p > 0) {
    dmg *= (1 + (0.05 + atkSectLv * 0.03));
  }

  return dmg;
}

export function applyExtendedSectDefMods(rawDmg, ctx) {
  const { defender, defSect, defSectLv, battleState } = ctx;
  if (!defSect || defSect < 13 || defSectLv <= 0) return rawDmg;
  let dmg = rawDmg;
  const turn = battleState?.turnCount || 0;

  if (defSect === 16) {
    const odd = turn % 2 === 1;
    if (odd) dmg *= 0.92;
    else dmg *= 0.88;
  }
  if (defSect === 17) {
    refreshSectBarrier(defender, defSectLv, turn);
  }

  return dmg;
}

export function applyExtendedSectPostDamage(ctx, addLog, helpers = {}) {
  const {
    attacker, defender, atkSect, atkSectLv, defSect, defSectLv,
    dmg, move, category, isDead, defState, atkState, battleState, source, getStats,
  } = ctx;
  if (!move?.p || dmg <= 0) return;

  const maxAtkHp = getStats?.(attacker)?.maxHp || attacker._maxHp || 100;
  const maxDefHp = getStats?.(defender)?.maxHp || defender._maxHp || 100;

  if (atkSect === 13 && atkSectLv > 0 && !isDead && Math.random() < (0.03 + atkSectLv * 0.02)) {
    const comboDmg = Math.max(1, Math.floor(dmg * 0.4));
    defender.currentHp = Math.max(0, defender.currentHp - comboDmg);
    addLog?.(`🌸 峨眉连击追加 ${comboDmg} 伤害！`);
  }
  if (atkSect === 15 && atkSectLv > 0 && attacker.currentHp > 0) {
    const steal = Math.floor(dmg * (0.03 + atkSectLv * 0.012));
    if (steal > 0) {
      attacker.currentHp = Math.min(maxAtkHp, attacker.currentHp + steal);
      addLog?.(`🩸 血刀诀吸取 ${steal} HP！`);
    }
  }
  if (atkSect === 21 && atkSectLv > 0 && !defState.status && Math.random() < (0.04 + atkSectLv * 0.015)) {
    defState.status = 'PAR';
    addLog?.(`⚡ 天山雷法麻痹了 ${defender.name}！`);
  }
  if (atkSect === 22 && atkSectLv > 0 && !isDead && Math.random() < (0.05 + atkSectLv * 0.015)) {
    const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
    defState.stages = defState.stages || {};
    defState.stages[stat] = Math.max(-6, (defState.stages[stat] || 0) - 1);
    addLog?.(`⭐ 化功大法削弱了 ${defender.name} 的 ${stat}！`);
  }
  if (atkSect === 23 && atkSectLv > 0 && !isDead && Math.random() < (0.03 + atkSectLv * 0.01)) {
    defState.volatiles = { ...(defState.volatiles || {}), sectCharmed: 2 };
    addLog?.(`🦅 灵鹫威压：${defender.name} 下回合攻击-25%！`);
  }
  if (atkSect === 24 && atkSectLv > 0 && !isDead && Math.random() < (0.02 + atkSectLv * 0.015)) {
    defState.stages = defState.stages || {};
    defState.stages.spd = Math.max(-6, (defState.stages.spd || 0) - 1);
    addLog?.(`🏔️ 泰山压顶：${defender.name} 速度下降！`);
  }
  if (atkSect === 30 && atkSectLv > 0) {
    const cdKey = '_shenxiaoTrueDmgCd';
    if (!(attacker[cdKey] > 0)) {
      const trueDmg = Math.min(dmg, Math.max(1, Math.floor(maxDefHp * (atkSectLv * 0.008))));
      defender.currentHp = Math.max(0, defender.currentHp - trueDmg);
      addLog?.(`🌩️ 神霄雷罚造成 ${trueDmg} 点真伤！`);
      attacker[cdKey] = 2;
    } else {
      attacker[cdKey]--;
    }
  }
  if (defSect === 18 && defSectLv > 0 && move.p > 0 && Math.random() < (0.05 + defSectLv * 0.02)) {
    const counterDmg = Math.max(1, Math.floor(dmg * 0.5));
    attacker.currentHp = Math.max(0, attacker.currentHp - counterDmg);
    addLog?.(`🌙 古墓反击造成 ${counterDmg} 伤害！`);
    if (source !== 'player' && battleState) helpers.gainMomentum?.(battleState, 9);
  }
}

export function trySectEndure(defender, defSect, defSectLv, dmg, addLog) {
  if (defSect !== 29 || defSectLv <= 0 || defender._sectEndureUsed) return false;
  if (dmg < defender.currentHp) return false;
  if (Math.random() >= (0.03 + defSectLv * 0.015)) return false;
  defender._sectEndureUsed = true;
  addLog?.(`🦁 嵩山不屈：${defender.name} 保留 1 HP！`);
  return true;
}

export function applySectCharmAttackPenalty(attacker, atkState) {
  if (!attacker?.volatiles?.sectCharmed) return 1;
  attacker.volatiles.sectCharmed -= 1;
  if (attacker.volatiles.sectCharmed <= 0) delete attacker.volatiles.sectCharmed;
  return 0.75;
}
