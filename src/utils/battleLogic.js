import { TYPES } from '../data/types';

export function getTypeEffectiveness(atkType, defType) {
  const typeChart = TYPES[atkType]?.chart;
  if (!typeChart) return 1;
  return typeChart[defType] || 1;
}

export function calcDamage({ power, atkStat, defStat, level, stab, typeEff, critical, random }) {
  if (power <= 0) return 0;
  const levelFactor = ((2 * level) / 5 + 2);
  const baseDmg = Math.floor((levelFactor * power * atkStat) / (50 * defStat)) + 2;
  const stabMult = stab ? 1.5 : 1;
  const critMult = critical ? 1.5 : 1;
  const rng = random !== undefined ? random : (0.85 + Math.random() * 0.15);
  return Math.max(1, Math.floor(baseDmg * stabMult * typeEff * critMult * rng));
}

export function checkCritical(critRate) {
  return Math.random() * 100 < (critRate || 5);
}
