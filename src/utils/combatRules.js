const finiteNonNegative = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

export function getEffectiveChakraCost(move, effects = {}) {
  const baseCost = finiteNonNegative(move?.chakraCost);
  if (baseCost <= 0) return 0;
  const multiplier = Number(effects?.chakraCostMult);
  const safeMultiplier = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1;
  return Math.max(1, Math.floor(baseCost * safeMultiplier));
}

export function getUnlockedBattleResourceMax(maxValue, unlocked) {
  return unlocked ? finiteNonNegative(maxValue) : 0;
}

export function getRegeneratedBattleResource(currentValue, maxValue, regenAmount) {
  const max = finiteNonNegative(maxValue);
  if (max <= 0) return 0;
  return Math.min(max, finiteNonNegative(currentValue) + finiteNonNegative(regenAmount));
}

export function spendMovePP(move, amount = 1) {
  if (!move) return { ok: false, before: 0, after: 0, cost: 0 };
  if (move.pp === undefined) move.pp = finiteNonNegative(move.maxPP || move.maxPp || 15);
  const before = finiteNonNegative(move.pp);
  if (before <= 0) return { ok: false, before, after: before, cost: 0 };
  const cost = Math.max(1, Math.floor(finiteNonNegative(amount) || 1));
  const after = Math.max(0, before - cost);
  move.pp = after;
  return { ok: true, before, after, cost };
}

export function getDomainDamageMultiplier(activeDomain, attackerSide, defenderSide) {
  if (!activeDomain || activeDomain.turnsLeft <= 0 || !activeDomain.effect) return 1;
  const effect = activeDomain.effect;
  const attackerOwnsDomain = activeDomain.ownerSide === attackerSide;
  const defenderOwnsDomain = activeDomain.ownerSide === defenderSide;
  let multiplier = 1;

  if (attackerOwnsDomain && effect.atkBoost) multiplier *= finiteNonNegative(effect.atkBoost) || 1;
  if (!attackerOwnsDomain && effect.enemyAtkDown) multiplier *= finiteNonNegative(effect.enemyAtkDown) || 1;
  if (defenderOwnsDomain && effect.defBoost) multiplier /= Math.max(0.5, finiteNonNegative(effect.defBoost) || 1);
  if (!defenderOwnsDomain && effect.enemyDefDown) {
    const remainingDefense = Math.min(1, finiteNonNegative(effect.enemyDefDown));
    multiplier *= 2 - remainingDefense;
  }
  return multiplier;
}

export function resolveDomainActivation(activeDomain, ownerSide, domainDef, domainType) {
  if (!domainDef || !ownerSide) return { blocked: true, isClash: false, activeDomain };
  if (activeDomain?.ownerSide === ownerSide) return { blocked: true, isClash: false, activeDomain };
  if (activeDomain && activeDomain.ownerSide !== ownerSide) {
    return {
      blocked: false,
      isClash: true,
      opposingDomainName: activeDomain.name,
      activeDomain: null,
    };
  }
  return {
    blocked: false,
    isClash: false,
    opposingDomainName: null,
    activeDomain: {
      name: domainDef.name,
      ownerSide,
      turnsLeft: domainDef.turns,
      effect: domainDef.effect,
      type: domainType,
    },
  };
}

export function getQueuedDoubleMoveResourceCost(battleState, kind) {
  if (!battleState || battleState.phase !== 'double_input_2' || kind === undefined) return 0;
  const action = battleState.doubleActions?.[0];
  if (!action || action.moveIdx === undefined || action.moveIdx < 0) return 0;
  const actor = battleState.playerCombatStates?.[action.activeIdx];
  const move = actor?.combatMoves?.[action.moveIdx];
  if (kind === 'ce' && move?.isCursed) return finiteNonNegative(move.ceCost);
  if (kind === 'chakra' && move?.isJutsu) {
    return getEffectiveChakraCost(move, battleState._resonanceFx || {});
  }
  return 0;
}

export function isSelfTargetingCombatMove(move) {
  if (!move || finiteNonNegative(move.p) > 0) return false;
  const effect = move.effect || {};
  if (effect.target === 'enemy' || effect.target === 'opponent') return false;
  if (effect.target === 'self') return true;
  if (['BUFF', 'HEAL', 'PROTECT'].includes(effect.type)) return true;
  return Boolean(effect.healPercent || effect.isolate || effect.antiDomain || (effect.stat && effect.stages));
}
