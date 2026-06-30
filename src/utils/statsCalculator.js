import { NATURE_DB, TRAIT_DB } from '../data/traits';
import { POKEDEX } from '../data/pets';
import { TYPE_BIAS } from '../data/types';
import { ACCESSORY_DB } from '../data/items';
import { SECT_CHIEFS_CONFIG } from '../data';
import { getGangSkillBonus, getGangSkills } from '../data/gang';
import { calcHouseScore, getHousingScoreTier } from '../data/housing';

export function getStageMult(stage) {
  if (!stage) return 1.0;
  const s = Math.max(-6, Math.min(6, stage));
  if (s >= 0) return (2 + s) / 2;
  return 2 / (2 + Math.abs(s));
}

export function calcNextExp(lv, expMod = 1.0) {
  let lateBonus = 0;
  if (lv > 50) lateBonus += (Math.min(lv, 80) - 50) * (Math.min(lv, 80) - 50) * 2;
  if (lv > 80) lateBonus += (lv - 80) * (lv - 80) * 4;
  return Math.floor((lv * 100 + lateBonus) * expMod);
}

/**
 * @param {object} pet
 * @param {object|null} stages
 * @param {string|null} status
 * @param {object} context - { currentTitle, gang, housing }
 * @param {number|undefined} gangBonusOverride
 */
export function getStats(pet, stages = null, status = null, context = {}, gangBonusOverride = undefined) {
  if (!pet) return { maxHp: 1, p_atk: 1, p_def: 1, s_atk: 1, s_def: 1, spd: 1, crit: 5 };
  const { currentTitle, gang, housing } = context;
  const isPlayerPet = gangBonusOverride === undefined;
  const lvl = pet.level || 1;
  const growth = 1 + Math.min(2.5, Math.pow(lvl / 100, 0.7) * 3.5);
  const shinyMod = pet.isFusedShiny ? 1.35 : (pet.isShiny ? 1.2 : 1.0);

  let ivs = pet.ivs || { hp: 0, p_atk: 0, p_def: 0, s_atk: 0, s_def: 0, spd: 0, crit: 0 };
  const evs = pet.evs || {};
  const natureKey = pet.nature || 'docile';
  const natureStats = NATURE_DB[natureKey]?.stats || {};

  const baseInfo = POKEDEX.find(p => p.id === pet.id) || POKEDEX[0];
  const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };

  const diversity = (pet.diversityRng !== undefined) ? pet.diversityRng : ((baseInfo.id % 5) * 2 - 4);
  const fallbackSpeed = (pet.speedRng !== undefined) ? pet.speedRng : (40 + (baseInfo.id * 7 % 70));

  const statMult = pet.customStatMult || 1;
  const baseStats = pet.customBaseStats || {
    hp: Math.floor((baseInfo.hp || 60) * statMult),
    p_atk: Math.floor(((baseInfo.p_atk || baseInfo.atk || 50) * bias.p + diversity) * statMult),
    p_def: Math.floor(((baseInfo.p_def || baseInfo.def || 50) * bias.p) * statMult),
    s_atk: Math.floor(((baseInfo.s_atk || baseInfo.atk || 50) * bias.s - diversity) * statMult),
    s_def: Math.floor(((baseInfo.s_def || baseInfo.def || 50) * bias.s) * statMult),
    spd: Math.floor((baseInfo.spd || fallbackSpeed) * statMult),
    crit: 5
  };

  let chiefBonus = {};
  if (isPlayerPet && pet.sectId && SECT_CHIEFS_CONFIG[pet.sectId]) {
    const config = SECT_CHIEFS_CONFIG[pet.sectId];
    if (currentTitle === config.title) {
      chiefBonus = config.stats;
    }
  }
  const totalEv = Object.values(evs).reduce((s, v) => s + Math.max(0, v || 0), 0);
  const evScale = totalEv > 510 ? 510 / totalEv : 1;
  const calc = (base, ivKey, evKey, isHp = false) => {
    const iv = Math.max(0, ivs[ivKey] || 0);
    const rawEv = Math.min(252, Math.max(0, isHp ? Math.max(evs[evKey] || 0, evs.maxHp || 0) : (evs[evKey] || 0)));
    const ev = Math.floor(rawEv * evScale);

    let val = Math.floor((base + iv) * growth * shinyMod);
    if (isHp) val = Math.floor(val * 2.0);

    if (natureStats[ivKey]) val = Math.floor(val * natureStats[ivKey]);

    const currentEquips = pet.equips || [null, null];
    currentEquips.forEach(equip => {
      if (!equip) return;
      let accData = null;
      if (typeof equip === 'string') accData = ACCESSORY_DB.find(c => c.id === equip);
      else if (typeof equip === 'object') accData = equip;

      if (accData) {
        const aType = accData.type === 'HYBRID' ? (accData.stat || 'ATK') : (accData.type || accData.stat);
        if (isHp && aType === 'HP') val += accData.val;
        if (ivKey === 'p_atk' && aType === 'ATK') val += accData.val;
        if (ivKey === 's_atk' && aType === 'SATK') val += accData.val;
        if ((ivKey === 'p_def' || ivKey === 's_def') && aType === 'DEF') val += accData.val;
        if (ivKey === 's_def' && aType === 'SDEF') val += accData.val;
        if (ivKey === 'spd' && aType === 'SPD') val += accData.val;
        if (ivKey === 'spd' && accData.effect && accData.effect.id === 'bonus_spd') val += accData.effect.val;
      }
    });

    val += Math.floor(ev / 4);

    if (chiefBonus[ivKey]) {
      val = Math.floor(val * chiefBonus[ivKey]);
    }

    const trait = TRAIT_DB[pet.trait];
    if (trait && trait.type === 'STAT') {
      if (pet.trait === 'huge_power' && ivKey === 'p_atk') val = Math.floor(val * 2);
      if (pet.trait === 'guts' && ivKey === 'p_atk' && (status === 'BRN' || status === 'PSN' || status === 'PAR')) val = Math.floor(val * 1.5);
    }

    if (!isHp && stages && stages[ivKey] !== undefined) {
      val = Math.floor(val * getStageMult(stages[ivKey]));
    }

    if (status === 'PAR' && ivKey === 'spd') val = Math.floor(val * 0.5);
    if (status === 'BRN' && ivKey === 'p_atk' && pet.trait !== 'guts') val = Math.floor(val * 0.5);

    return val;
  };

  let finalCrit = Math.floor((baseStats.crit || 5) + (ivs.crit || 0) + (evs.crit || 0) + (pet.level * 0.2));
  if (chiefBonus.crit) finalCrit += chiefBonus.crit;
  (pet.equips || []).forEach(equip => {
    if (!equip) return;
    const accData = typeof equip === 'string' ? ACCESSORY_DB.find(c => c.id === equip) : equip;
    if (accData && (accData.type || accData.stat) === 'CRIT') finalCrit += accData.val;
  });

  const sectId = pet.sectId || 1;
  const sectLv = pet.sectLevel || 1;
  let finalSpd = calc(baseStats.spd, 'spd', 'spd');

  if (sectId === 3) {
    finalSpd = Math.floor(finalSpd * (1 + (sectLv * 0.02)));
  }

  if (pet.fruitTransformed && pet.fruitEffects?.spdMult) {
    finalSpd = Math.floor(finalSpd * pet.fruitEffects.spdMult);
  }

  const gangBonus = gangBonusOverride !== undefined ? gangBonusOverride : getGangSkillBonus(getGangSkills(gang));
  const hsScore = isPlayerPet && typeof calcHouseScore === 'function' ? calcHouseScore((housing?.furniture || []).filter(f => f.placed)) : 0;
  const hsTier = isPlayerPet && typeof getHousingScoreTier === 'function' ? getHousingScoreTier(hsScore) : null;
  const housingAllStats = hsTier?.buff?.allStats || 0;
  const intimacyAllStatsMult = isPlayerPet && (pet.intimacy || 0) >= 200 ? 1.10 : 1.0;
  const applyGB = (val, pct) => {
    let total = (pct || 0);
    val = Math.floor(val * (1 + (housingAllStats || 0) / 100));
    val = total > 0 ? Math.floor(val * (1 + total / 100)) : val;
    if (intimacyAllStatsMult > 1) val = Math.floor(val * intimacyAllStatsMult);
    return val;
  };

  const clampedCrit = Math.min(75, Math.max(0, finalCrit));
  const finalPAtk = applyGB(calc(baseStats.p_atk, 'p_atk', 'p_atk'), (gangBonus.atk || 0));
  const finalPDef = applyGB(calc(baseStats.p_def, 'p_def', 'p_def'), (gangBonus.def || 0));

  return {
    maxHp: applyGB(calc(baseStats.hp, 'hp', 'hp', true), (gangBonus.hp || 0)),
    p_atk: finalPAtk,
    p_def: finalPDef,
    s_atk: applyGB(calc(baseStats.s_atk, 's_atk', 's_atk'), (gangBonus.s_atk || 0)),
    s_def: applyGB(calc(baseStats.s_def, 's_def', 's_def'), (gangBonus.s_def || 0)),
    spd: applyGB(finalSpd, (gangBonus.spd || 0)),
    crit: clampedCrit,
    atk: finalPAtk,
    def: finalPDef
  };
}
