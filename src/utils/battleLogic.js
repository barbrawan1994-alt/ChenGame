import { TYPES } from '../data/types';

const TYPE_CHART = {
  NORMAL: { weak: [], strong: [], immune: ['GHOST'] },
  FIRE: { weak: ['WATER', 'ROCK', 'GROUND'], strong: ['GRASS', 'ICE', 'BUG', 'STEEL'], immune: [] },
  WATER: { weak: ['ELECTRIC', 'GRASS'], strong: ['FIRE', 'GROUND', 'ROCK'], immune: [] },
  GRASS: { weak: ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'], strong: ['WATER', 'GROUND', 'ROCK'], immune: [] },
  ELECTRIC: { weak: ['GROUND'], strong: ['WATER', 'FLYING'], immune: [] },
  ICE: { weak: ['FIRE', 'FIGHT', 'ROCK', 'STEEL', 'SOUND'], strong: ['GRASS', 'GROUND', 'FLYING', 'DRAGON', 'WIND'], immune: [] },
  FIGHT: { weak: ['FLYING', 'PSYCHIC', 'FAIRY'], strong: ['NORMAL', 'ICE', 'ROCK', 'DARK', 'STEEL'], immune: ['GHOST'] },
  POISON: { weak: ['GROUND', 'PSYCHIC'], strong: ['GRASS', 'FAIRY'], immune: ['STEEL'] },
  GROUND: { weak: ['WATER', 'GRASS', 'ICE'], strong: ['FIRE', 'ELECTRIC', 'POISON', 'ROCK', 'STEEL', 'SOUND'], immune: ['FLYING'] },
  FLYING: { weak: ['ELECTRIC', 'ICE', 'ROCK', 'COSMIC'], strong: ['GRASS', 'FIGHT', 'BUG'], immune: [] },
  PSYCHIC: { weak: ['BUG', 'GHOST', 'DARK', 'SOUND', 'COSMIC'], strong: ['FIGHT', 'POISON'], immune: ['DARK'] },
  BUG: { weak: ['FIRE', 'FLYING', 'ROCK'], strong: ['GRASS', 'PSYCHIC', 'DARK'], immune: [] },
  ROCK: { weak: ['WATER', 'GRASS', 'FIGHT', 'GROUND', 'STEEL'], strong: ['FIRE', 'ICE', 'FLYING', 'BUG', 'SOUND'], immune: [] },
  GHOST: { weak: ['DARK'], strong: ['PSYCHIC', 'GHOST', 'COSMIC', 'LIGHT', 'TIME'], immune: ['NORMAL', 'FIGHT'] },
  DRAGON: { weak: ['ICE', 'DRAGON', 'FAIRY', 'COSMIC'], strong: ['DRAGON'], immune: [] },
  STEEL: { weak: ['FIRE', 'FIGHT', 'GROUND'], strong: ['ICE', 'ROCK', 'FAIRY', 'SOUND', 'COSMIC', 'LIGHT'], immune: ['POISON'] },
  FAIRY: { weak: ['POISON', 'STEEL', 'SOUND'], strong: ['FIGHT', 'DRAGON', 'DARK', 'CHAOS'], immune: [] },
  DARK: { weak: ['FIGHT', 'BUG', 'FAIRY'], strong: ['PSYCHIC', 'GHOST', 'COSMIC', 'LIGHT', 'TIME'], immune: ['PSYCHIC'] },
  WIND: { weak: ['ICE', 'ROCK', 'ELECTRIC'], strong: ['GRASS', 'BUG', 'FIGHT', 'GROUND'], immune: [] },
  LIGHT: { weak: ['STEEL'], strong: ['DARK', 'GHOST', 'POISON', 'BUG', 'CHAOS'], immune: [] },
  COSMIC: { weak: ['DARK', 'GHOST', 'STEEL'], strong: ['DRAGON', 'PSYCHIC', 'FLYING', 'POISON'], immune: [] },
  SOUND: { weak: ['GROUND', 'STEEL', 'ROCK'], strong: ['ICE', 'FAIRY', 'PSYCHIC', 'GHOST', 'BUG'], immune: [] },
  HEAL: { weak: ['POISON', 'DARK', 'GHOST'], strong: ['FIGHT', 'DRAGON', 'BUG'], immune: [] },
  GOD: { weak: ['GOD'], strong: ['DRAGON', 'DARK', 'GHOST', 'PSYCHIC', 'FAIRY'], immune: [] },
  TIME: { weak: ['DARK', 'GHOST'], strong: ['DRAGON', 'PSYCHIC', 'GROUND', 'ICE', 'CHAOS'], immune: [] },
  CHAOS: { weak: ['FAIRY', 'LIGHT'], strong: ['PSYCHIC', 'COSMIC', 'NORMAL', 'STEEL', 'TIME'], immune: [] }
};

export function getTypeEffectiveness(atkType, defTypes) {
  const defenders = Array.isArray(defTypes) ? defTypes : [defTypes];
  let mult = 1;
  for (const defType of defenders) {
    if (!defType) continue;
    const chart = TYPE_CHART[atkType];
    if (!chart) continue;
    if (chart.immune.includes(defType)) return 0;
    if (chart.strong.includes(defType)) mult *= 1.5;
    else if (chart.weak.includes(defType)) mult *= 0.8;
  }
  return mult;
}

export function calcDamage({ power, atkStat, defStat, level, stab, typeEff, critical, random }) {
  if (power <= 0) return 0;
  const safeDef = Math.max(1, defStat || 1);
  const levelFactor = ((2 * level) / 5 + 2);
  const baseDmg = Math.floor((levelFactor * power * atkStat) / (50 * safeDef)) + 2;
  const stabMult = stab ? 1.5 : 1;
  const critMult = critical ? 1.5 : 1;
  const rng = random !== undefined ? random : (0.85 + Math.random() * 0.15);
  return Math.max(1, Math.floor(baseDmg * stabMult * typeEff * critMult * rng));
}

export function checkCritical(critRate) {
  const rate = critRate ?? 5;
  return Math.random() * 100 < Math.min(40, Math.max(0, rate));
}
