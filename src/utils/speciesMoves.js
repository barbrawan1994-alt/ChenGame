import { SKILL_DB } from '../data/skills';

const MOVE_BY_ID = new Map(Object.entries(SKILL_DB).flatMap(([t, moves]) => moves.map(move => [move.id, { ...move, t }])));

export function getSpeciesLearnedMoves(species, level, afterLevel = 0) {
  return (species?.learnset || []).filter(entry => entry.level > afterLevel && entry.level <= level).map(entry => {
    const move = MOVE_BY_ID.get(entry.move);
    return move ? { ...move, effect: move.effect ? JSON.parse(JSON.stringify(move.effect)) : undefined, maxPP: move.pp, learnedSlot: entry.slot } : null;
  }).filter(Boolean);
}

export function getSpeciesStartingMoves(species, level) {
  const slots = new Map();
  for (const move of getSpeciesLearnedMoves(species, level)) slots.set(move.learnedSlot, move);
  const unique = new Map([...slots.values()].map(move => [move.id, move]));
  return [...unique.values()].slice(0, 4);
}
