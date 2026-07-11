import { NATURE_DB, TRAIT_DB } from '../data/traits';
import { POKEDEX } from '../data/pets';
import { TYPE_BIAS } from '../data/types';
import { ACCESSORY_DB } from '../data/items';
import { SECT_CHIEFS_CONFIG } from '../data';
import { calcSectResonanceBonus } from '../data/sectSystem';
import { getGangSkillBonus, getGangSkills } from '../data/gang';
import { AWAKENING_STAT_MULT, MAX_COMBINED_STAT_MULT } from '../data/resonance';
import { calcHouseScore, getHousingScoreTier } from '../data/housing';

export const MAX_BATTLE_CRIT_CHANCE = 40;

export function getStageMult(stage) {
  if (!stage) return 1.0;
  const s = Math.max(-6, Math.min(6, stage));
  if (s >= 0) return (2 + s) / 2;
  return 2 / (2 + Math.abs(s));
}

export function calcNextExp(lv, expMod = 1.0) {
  const level = Math.max(1, Math.min(100, Number(lv) || 1));
  const early = level * 70;
  const mid = level > 25 ? Math.pow(level - 25, 1.55) * 18 : 0;
  const late = level > 55 ? Math.pow(level - 55, 1.85) * 10 : 0;
  const endgame = level > 80 ? Math.pow(level - 80, 2.15) * 12 : 0;
  return Math.max(50, Math.floor((early + mid + late + endgame) * expMod));
}

export function calcBattleBaseExp(enemyLevel, { isTrainer = false, isBounty = false } = {}) {
  const level = Math.max(1, Math.min(100, Number(enemyLevel) || 1));
  const earlyBoost = level <= 20 ? 1.15 : level <= 35 ? 1.05 : 1.0;
  const trainerMult = isTrainer ? 1.5 : 1;
  const bountyMult = isBounty ? 1.3 : 1;
  return Math.floor(level * 42 * trainerMult * earlyBoost * bountyMult);
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
  const { currentTitle, gang, housing, relicEffects, gangSkillCapBonus, sectEffectMult = 1, gangSkillMult = 1, playerSect, playerSubSect } = context;
  const isPlayerPet = gangBonusOverride === undefined && !pet.isEnemy;
  const numericLevel = Number(pet.level);
  const lvl = Math.min(100, Math.max(1, Number.isFinite(numericLevel) ? numericLevel : 1));
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
    p_atk: Math.max(1, Math.floor(((baseInfo.p_atk || baseInfo.atk || 50) * bias.p + diversity) * statMult)),
    p_def: Math.max(1, Math.floor(((baseInfo.p_def || baseInfo.def || 50) * bias.p) * statMult)),
    s_atk: Math.max(1, Math.floor(((baseInfo.s_atk || baseInfo.atk || 50) * bias.s - diversity) * statMult)),
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
  const EV_STAT_KEYS = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
  const totalEv = EV_STAT_KEYS.reduce((s, k) => s + Math.max(0, evs[k] || 0), 0);
  const evScale = totalEv > 510 ? 510 / totalEv : 1;
  const calc = (base, ivKey, evKey, isHp = false) => {
    const iv = Math.max(0, ivs[ivKey] || 0);
    const rawEv = Math.min(252, Math.max(0, evs[evKey] || 0));
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
        if (ivKey === 'p_def' && aType === 'DEF') val += accData.val;
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
      if (pet.trait === 'huge_power' && ivKey === 'p_atk') val = Math.floor(val * 1.5);
      if (pet.trait === 'guts' && ivKey === 'p_atk' && (status === 'BRN' || status === 'PSN' || status === 'PAR')) val = Math.floor(val * 1.5);
    }

    if (!isHp && stages && stages[ivKey] !== undefined) {
      val = Math.floor(val * getStageMult(stages[ivKey]));
    }

    if (status === 'PAR' && ivKey === 'spd') val = Math.floor(val * 0.5);
    if (status === 'BRN' && ivKey === 'p_atk' && pet.trait !== 'guts') val = Math.floor(val * 0.5);

    return val;
  };

  const baseCrit = Number(baseStats.crit);
  let finalCrit = Math.floor((Number.isFinite(baseCrit) ? baseCrit : 5) + (ivs.crit || 0) + (evs.crit || 0) + (lvl * 0.2));
  if (chiefBonus.crit) finalCrit += chiefBonus.crit;
  (pet.equips || []).forEach(equip => {
    if (!equip) return;
    const accData = typeof equip === 'string' ? ACCESSORY_DB.find(c => c.id === equip) : equip;
    if (accData && (accData.type || accData.stat) === 'CRIT') finalCrit += accData.val;
  });

  const sectId = pet.sectId || 0;
  const sectLv = pet.sectLevel || 0;
  let finalSpd = calc(baseStats.spd, 'spd', 'spd');

  if (sectId === 3 && sectLv > 0) {
    finalSpd = Math.floor(finalSpd * (1 + (sectLv * 0.012)) * sectEffectMult);
  } else if (sectId > 0 && sectEffectMult > 1 && sectLv > 0) {
    finalSpd = Math.floor(finalSpd * (1 + (sectLv * 0.008) * (sectEffectMult - 1)));
  }

  if (pet.fruitTransformed && pet.fruitEffects?.spdMult) {
    finalSpd = Math.floor(finalSpd * pet.fruitEffects.spdMult);
  }

  const gangBonus = gangBonusOverride !== undefined ? gangBonusOverride : (isPlayerPet && gang ? getGangSkillBonus(getGangSkills(gang, gangSkillCapBonus || 0), gangSkillMult) : {});
  const resonance = isPlayerPet ? calcSectResonanceBonus(pet, playerSect, playerSubSect) : null;
  const resBonus = resonance?.bonus || {};
  const relic = isPlayerPet ? (relicEffects || {}) : {};
  const relicAllStats = relic.allStatsMult || 1;
  const relicDefMult = relic.defMult || 1;
  const relicSpdMult = relic.spdMult || 1;
  const relicCritBonus = relic.critBonus || 0;
  const rawAwakenMult = pet.awakened ? AWAKENING_STAT_MULT * (isPlayerPet ? (relicEffects?.awakenedStatsMult || 1) : 1) : 1;
  const awakenMult = Math.min(MAX_COMBINED_STAT_MULT, rawAwakenMult);
  const hsScore = isPlayerPet && typeof calcHouseScore === 'function' ? calcHouseScore((housing?.furniture || []).filter(f => f.placed)) : 0;
  const hsTier = isPlayerPet && typeof getHousingScoreTier === 'function' ? getHousingScoreTier(hsScore) : null;
  const housingAllStats = hsTier?.buff?.allStats || 0;
  const intimacyAllStatsMult = isPlayerPet && (pet.intimacy || 0) >= 230 ? 1.05 : 1.0;
  const applyGB = (val, pct) => {
    let total = (pct || 0);
    val = Math.floor(val * (1 + (housingAllStats || 0) / 100));
    val = total > 0 ? Math.floor(val * (1 + total / 100)) : val;
    if (intimacyAllStatsMult > 1) val = Math.floor(val * intimacyAllStatsMult);
    return val;
  };

  const clampedCrit = Math.min(MAX_BATTLE_CRIT_CHANCE, Math.max(0, finalCrit + relicCritBonus));
  const resPct = (key) => resBonus[key] && resBonus[key] > 1 ? Math.round((resBonus[key] - 1) * 100) : 0;
  const finalPAtk = applyGB(calc(baseStats.p_atk, 'p_atk', 'p_atk'), (gangBonus.atk || 0) + resPct('atk'));
  const finalPDef = Math.floor(applyGB(calc(baseStats.p_def, 'p_def', 'p_def'), (gangBonus.def || 0) + resPct('def')) * relicDefMult);

  const applyAwaken = (val) => Math.floor(val * awakenMult * relicAllStats);

  const capStat = (v, base, isHp) => {
    const cap = isHp ? Math.max(999, base * 8) : Math.max(500, base * 6);
    return Math.min(cap, v);
  };
  return {
    maxHp: capStat(applyAwaken(applyGB(calc(baseStats.hp, 'hp', 'hp', true), (gangBonus.hp || 0) + resPct('hp'))), baseStats.hp, true),
    p_atk: capStat(applyAwaken(finalPAtk), baseStats.p_atk),
    p_def: capStat(applyAwaken(finalPDef), baseStats.p_def),
    s_atk: capStat(applyAwaken(applyGB(calc(baseStats.s_atk, 's_atk', 's_atk'), (gangBonus.s_atk || 0) + resPct('s_atk'))), baseStats.s_atk),
    s_def: capStat(Math.floor(applyAwaken(applyGB(calc(baseStats.s_def, 's_def', 's_def'), (gangBonus.s_def || 0) + resPct('s_def'))) * relicDefMult), baseStats.s_def),
    spd: capStat(Math.floor(applyAwaken(applyGB(finalSpd, (gangBonus.spd || 0) + resPct('spd'))) * relicSpdMult), baseStats.spd),
    crit: Math.min(MAX_BATTLE_CRIT_CHANCE, Math.max(0, clampedCrit + (resBonus.critRate || 0))),
    atk: applyAwaken(finalPAtk),
    def: applyAwaken(finalPDef)
  };
}
