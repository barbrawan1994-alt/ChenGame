import { POKEDEX } from '../data/pets';
import { NATURE_DB, TRAIT_DB } from '../data/traits';
import { TYPE_CHARM_BASE } from '../data/types';
import { SKILL_DB } from '../data/skills';
import { generateCurseTalent } from '../data/jujutsu';
import { calcNextExp } from './statsCalculator';

export function getMoveByLevel(type, level) {
  const db = SKILL_DB[type] || SKILL_DB.NORMAL;
  if (!db || db.length === 0) return { name: '\u649E\u51FB', p: 40, t: 'NORMAL', pp: 35, maxPP: 35, acc: 100, category: 'physical' };
  const index = Math.floor(level / 5);
  const template = db[index % db.length];
  let name = template.name;
  let power = (template.p !== undefined) ? template.p : 40;
  let pp = template.pp || 15;
  let acc = template.acc || 100;
  if (power >= 120) acc = 90;
  if (power >= 150) acc = 80;
  const tier = Math.min(3, Math.floor(index / db.length));
  if (power > 0 && tier > 0) {
    const baseName = template.name;
    if (tier === 1) { name = `\u771F\u00B7${baseName}`; power = Math.floor(power * 1.2); }
    else if (tier === 2) { name = `\u8D85\u00B7${baseName}`; power = Math.floor(power * 1.3); }
    else if (tier >= 3) { name = `\u795E\u00B7${baseName}`; power = Math.floor(power * 1.5); }
  }
  return { name, p: power, t: type, pp, maxPP: pp, val: template.val, effect: template.effect, acc, priority: template.priority || 0, alwaysHit: template.alwaysHit || false, desc: template.desc || '' };
}

/**
 * @param {number|string} dexId
 * @param {number} level
 * @param {boolean} isBoss
 * @param {boolean} forceShiny
 * @param {object} context - { spouseBonuses, getStatsForPet }
 *   spouseBonuses: result of getSpouseBonuses() e.g. { shinyRate, ivBoost }
 *   getStatsForPet: (pet) => stats object (bound version of getStats with context)
 */
export function createPet(dexId, level, isBoss = false, forceShiny = false, context = {}) {
  const { spouseBonuses = {}, getStatsForPet } = context;
  level = Math.min(100, Math.max(1, level));
  let finalId = dexId;

  const visited = new Set();
  while (true) {
    if (visited.has(finalId)) break;
    visited.add(finalId);
    const preForm = POKEDEX.find(p => p.evo === finalId);
    if (!preForm) break;
    if (level < preForm.evoLvl) {
      finalId = preForm.id;
    } else {
      break;
    }
  }

  for (let k = 0; k < 5; k++) {
    const info = POKEDEX.find(p => p.id === finalId);
    if (!info) break;
    if (info.evo && level >= info.evoLvl) {
      if (info.evoCondition) break;
      finalId = info.evo;
    } else {
      break;
    }
  }

  let base = POKEDEX.find(p => p.id === finalId);
  let _fallbackSpecies = false;
  if (!base) {
    console.warn(`[createPet] Unknown dexId: ${finalId}, falling back to POKEDEX[0]`);
    _fallbackSpecies = true;
    const targetNum = Number(finalId);
    if (Number.isFinite(targetNum) && POKEDEX.length) {
      let best = POKEDEX[0];
      let bestDist = Infinity;
      for (const p of POKEDEX) {
        const pn = Number(p.id);
        if (!Number.isFinite(pn)) continue;
        const d = Math.abs(pn - targetNum);
        if (d < bestDist) { bestDist = d; best = p; }
      }
      base = bestDist === Infinity ? POKEDEX[0] : best;
    } else {
      base = POKEDEX[0];
    }
  }

  const spBs = spouseBonuses;
  const baseShinyRate = 0.01 * (spBs.shinyRate || 1);
  const isShiny = forceShiny || (!isBoss && Math.random() < baseShinyRate);

  const ivBoost = spBs.ivBoost || 0;
  const randIV = () => Math.min(31, Math.floor(Math.random() * 32) + ivBoost);
  const ivs = {
    hp: randIV(), p_atk: randIV(), p_def: randIV(),
    s_atk: randIV(), s_def: randIV(), spd: randIV(),
    crit: Math.floor(Math.random() * 6)
  };

  const natureKeys = Object.keys(NATURE_DB);
  const randomNature = natureKeys[Math.floor(Math.random() * natureKeys.length)];
  const natureData = NATURE_DB[randomNature];
  const expMod = natureData.exp || 1.0;

  const diversityRng = Math.floor(Math.random() * 9) - 4;
  const speedRng = Math.floor(Math.random() * 71) + 40;

  const sectId = Math.floor(Math.random() * 12) + 1;
  let autoSectLv = Math.floor(level / 10) + 1;
  if (isBoss || isShiny) autoSectLv += 2;
  const sectLevel = Math.max(1, Math.min(10, autoSectLv));

  const traitKeys = Object.keys(TRAIT_DB);
  const randomTrait = traitKeys[Math.floor(Math.random() * traitKeys.length)];

  const typeBaseCharm = TYPE_CHARM_BASE[base.type] || 30;
  const rngCharm = Math.floor(Math.random() * 21);
  const shinyBonus = isShiny ? 30 : 0;
  const bossBonus = isBoss ? 20 : 0;
  const charmVal = Math.min(100, typeBaseCharm + rngCharm + shinyBonus + bossBonus);

  let charmRank = '\u51F6\u840C';
  if (charmVal >= 90) charmRank = '\u4E07\u4EBA\u8FF7';
  else if (charmVal >= 75) charmRank = '\u4EBA\u6C14\u738B';
  else if (charmVal >= 50) charmRank = '\u53EF\u7231\u9B3C';
  else if (charmVal >= 25) charmRank = '\u5446\u840C';

  const intimacy = 50;
  const curseTalent = generateCurseTalent();

  let newPet = {
    ...base,
    uid: Date.now() + Math.random(),
    level,
    exp: 0,
    nextExp: calcNextExp(level, expMod),
    nature: randomNature,
    equip: null,
    equips: [null, null],
    moves: [],
    isBoss,
    isShiny,
    ivs,
    evs: {},
    diversityRng,
    speedRng,
    sectId: sectId,
    sectLevel: sectLevel,
    trait: randomTrait,
    charm: charmVal,
    charmRank: charmRank,
    intimacy: intimacy,
    curseTalent: curseTalent,
    secondaryType: base.type2 || null,
    _fallbackSpecies,
  };

  const moves = [];
  const maxSkillIndex = Math.floor(level / 5);
  const startIdx = Math.max(0, maxSkillIndex - 3);

  for (let i = startIdx; i <= maxSkillIndex; i++) {
    const moveData = getMoveByLevel(base.type, i * 5);
    moves.push(moveData);
  }

  const hasDamageMove = moves.some(m => m.p > 0);
  if (!hasDamageMove) {
    let fallbackMove = { name: '\u649E\u51FB', p: 40, t: 'NORMAL', pp: 35, maxPP: 35, acc: 100, desc: '\u7528\u8EAB\u4F53\u731B\u649E\u5BF9\u624B\u7684\u57FA\u672C\u653B\u51FB' };
    const typeSkills = SKILL_DB[base.type];
    if (typeSkills && typeSkills.length > 0) {
      const basicStab = typeSkills.find(s => s.p > 0);
      if (basicStab) {
        fallbackMove = {
          name: basicStab.name,
          p: basicStab.p,
          t: base.type,
          pp: basicStab.pp || 35,
          maxPP: basicStab.pp || 35,
          acc: basicStab.acc || 100,
          effect: basicStab.effect,
          desc: basicStab.desc || ''
        };
      }
    }
    if (moves.length < 4) {
      moves.push(fallbackMove);
    } else {
      moves[0] = fallbackMove;
    }
  }

  newPet.moves = moves;

  if (getStatsForPet) {
    const stats = getStatsForPet(newPet);
    newPet.currentHp = stats.maxHp;
  }

  return newPet;
}
