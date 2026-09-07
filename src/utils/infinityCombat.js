export function getInfinityDamageMultiplier(blessings, move, defender, source, category, random = Math.random) {
  const owns = id => blessings.includes(id);
  if (source === 'enemy') {
    const ground = [defender.type, defender.type2, defender.secondaryType].includes('GROUND');
    return owns('ground_fortify') && ground && category === 'physical' ? 1 / 1.15 : 1;
  }
  return owns('thunder_chain') && move.t === 'ELECTRIC' && random() < 0.35 ? 1.3 : 1;
}

export function applyInfinityHealingShield(blessings, move, pet, maxHp, healed) {
  if (healed <= 0 || pet.currentHp <= 0) return 0;
  const water = [pet.type, pet.type2, pet.secondaryType].includes('WATER');
  if (!blessings.includes('heal_shield') && !(blessings.includes('tide_echo') && water)) return 0;
  const shield = Math.floor(maxHp * 0.1);
  pet._sectShield = Math.max(pet._sectShield || 0, shield);
  return shield;
}

export function applyInfinityHitEffects(blessings, move, attacker, defender, damage, maxHp, immuneStatuses = [], random = Math.random) {
  if (!(damage > 0)) return [];
  const messages = [];
  const hasType = type => [defender.type, defender.type2, defender.secondaryType].includes(type);
  const status = move.t === 'FIRE' && blessings.includes('burn_spread') ? ['BRN', 0.15, 'FIRE', '灼伤']
    : move.t === 'ICE' && blessings.includes('ice_frost') ? ['FRZ', 0.2, 'ICE', '冰冻'] : null;
  if (defender.currentHp > 0 && status && !defender.status && !hasType(status[2]) && !immuneStatuses.includes('ALL') && !immuneStatuses.includes(status[0]) && random() < status[1]) {
    defender.status = status[0];
    messages.push(`${defender.name} 受到祝福的${status[3]}效果`);
  }
  const bind = blessings.includes('vine_mutate') && move.t === 'GRASS' && random() < 0.3;
  const silence = move._mutation === 'silence' && random() < 0.15;
  if (defender.currentHp > 0 && (bind || silence)) {
    defender.volatiles = { ...(defender.volatiles || {}), flinched: true };
    messages.push(`${defender.name} 下次行动受到阻断`);
  }
  if (move._mutation === 'lifesteal' && attacker.currentHp > 0) {
    const healed = Math.min(maxHp - attacker.currentHp, Math.floor(damage * 0.2));
    attacker.currentHp += Math.max(0, healed);
    if (healed > 0) messages.push(`${attacker.name} 吸取了 ${healed} 点体力`);
  }
  return messages;
}
