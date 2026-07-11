import { POKEDEX } from '../data/pets';
import { SKILL_DB } from '../data/skills';
import { NATURE_DB, TRAIT_DB } from '../data/traits';
import { getFruitById } from '../data/devilfruits';

const STAT_KEYS = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];

const clampInt = (value, min, max, fallback = min) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(numeric)));
};

const SKILLS_BY_NAME = new Map();
Object.entries(SKILL_DB).forEach(([type, moves]) => {
  (moves || []).forEach(move => {
    const entry = { ...move, t: type };
    if (!SKILLS_BY_NAME.has(move.name)) SKILLS_BY_NAME.set(move.name, []);
    SKILLS_BY_NAME.get(move.name).push(entry);
  });
});

const sanitizeMove = raw => {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').slice(0, 30);
  const candidates = SKILLS_BY_NAME.get(name) || [];
  const requestedType = typeof raw.t === 'string' ? raw.t : null;
  const local = candidates.find(move => move.t === requestedType) || candidates[0];
  if (!local) return null;
  const maxPP = clampInt(local.maxPP ?? local.pp, 1, 99, 1);
  return {
    ...local,
    pp: clampInt(raw.pp, 0, maxPP, maxPP),
    maxPP,
  };
};

const sanitizeEvs = raw => {
  const source = raw && typeof raw === 'object' ? raw : {};
  let remaining = 510;
  const evs = Object.fromEntries(STAT_KEYS.map(key => {
    const value = Math.min(remaining, clampInt(source[key], 0, 252, 0));
    remaining -= value;
    return [key, value];
  }));
  evs.crit = clampInt(source.crit, 0, 40, 0);
  return evs;
};

export function sanitizeImportedPvpTeam(rawTeam, localAverageLevel = 30) {
  if (!Array.isArray(rawTeam)) return [];
  const average = clampInt(localAverageLevel, 1, 100, 30);
  const fairCap = Math.min(100, Math.max(5, average + 18));

  return rawTeam.slice(0, 6).flatMap(raw => {
    if (!raw || typeof raw !== 'object') return [];
    const speciesId = Number(raw.id);
    const base = Number.isFinite(speciesId) ? POKEDEX.find(pet => pet.id === speciesId) : null;
    const rawLevel = Number(raw.level);
    if (!base || !Number.isFinite(rawLevel) || rawLevel <= 0 || rawLevel > 100) return [];

    let level = clampInt(rawLevel, 1, 100, 1);
    if (level > fairCap + 12) level = fairCap;
    const moves = (Array.isArray(raw.moves) ? raw.moves : []).map(sanitizeMove).filter(Boolean).slice(0, 4);
    if (moves.length === 0) {
      const fallback = (SKILL_DB[base.type] || []).find(move => Number(move.p) > 0) || (SKILL_DB.NORMAL || [])[0];
      if (fallback) moves.push({ ...fallback, t: base.type, pp: fallback.pp, maxPP: fallback.pp });
    }

    const ivSource = raw.ivs && typeof raw.ivs === 'object' ? raw.ivs : {};
    const ivs = Object.fromEntries([...STAT_KEYS, 'crit'].map(key => [key, clampInt(ivSource[key], 0, 31, 0)]));
    const name = typeof raw.name === 'string' ? raw.name.slice(0, 20) : '';

    return [{
      id: base.id,
      level,
      moves,
      name: name || base.name,
      type: base.type,
      secondaryType: base.type2 || base.secondaryType || null,
      trait: Object.prototype.hasOwnProperty.call(TRAIT_DB, raw.trait) ? raw.trait : undefined,
      nature: Object.prototype.hasOwnProperty.call(NATURE_DB, raw.nature) ? raw.nature : 'docile',
      isShiny: Boolean(raw.isShiny),
      ivs,
      evs: sanitizeEvs(raw.evs),
      devilFruit: typeof raw.devilFruit === 'string' && getFruitById(raw.devilFruit) ? raw.devilFruit : undefined,
    }];
  });
}
