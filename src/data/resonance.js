// ==========================================
// 跨界共鸣 · 精灵觉醒 · 无限遗物 · 生态恩赐
// ==========================================

import { AWAKENING_CONDITIONS } from './jujutsu';
import { getJutsuMasteryLevel } from './naruto';
import { MORAL_BRANCHES } from './ecoCrises';
import { ECO_METRIC_KEYS } from './ecoEvents';
import { getMilitaryRank } from './kingdom';
import { GANG_PRESETS } from './gang';

export const AWAKENING_STAT_MULT = 1.10;
export const MAX_COMBINED_STAT_MULT = 1.25;
export const MAX_EQUIPPED_RELICS = 5;
export const BLESSED_ECO_THRESHOLD = 78;
export const GUARDIAN_ENCOUNTER_RATE = 0.045;
export const BLESSED_SHINY_BONUS = 0.08;
export const TRANSCENDENCE_STAGE_BOOST = 1;
export const FRUIT_TRANSFORM_BASE_TURN = 3;
export const DUPLICATE_RELIC_GOLD = { COMMON: 1500, RARE: 3500, EPIC: 8000, LEGENDARY: 15000 };

/** 地图 biome (小写) → 生态守护者 ecosystem */
export const MAP_BIOME_TO_ECOSYSTEM = {
  grass: 'GRASS', water: 'WATER', fire: 'FIRE', ghost: 'GHOST', ice: 'ICE',
  mountain: 'ROCK', ground: 'GROUND', sky: 'FLYING', factory: 'STEEL', city: 'ELECTRIC',
  desert: 'GROUND', swamp: 'POISON', forest: 'GRASS', cave: 'ROCK', snow: 'ICE',
  wind: 'FLYING', fairy: 'FAIRY', dragon: 'DRAGON', dark: 'GHOST', gold: 'STEEL',
  rock: 'ROCK', space: 'DRAGON',
};

export const AWAKENING_REQUIREMENTS = {
  minLevel: 100,
  minIntimacy: 200,
  minTotalEv: 400,
  needsDevilFruitOrSectOrJutsu: true,
  needsSkillInherit: true,
};

export const AWAKENING_MOVES = {
  NORMAL:  { name: '觉醒·归元击', p: 100, t: 'NORMAL', pp: 8, maxPP: 8, acc: 100, desc: '觉醒之力凝聚为纯粹冲击' },
  FIRE:    { name: '觉醒·烈阳破', p: 120, t: 'FIRE', pp: 6, maxPP: 6, acc: 95, desc: '焚尽万物的觉醒烈焰' },
  WATER:   { name: '觉醒·沧澜涌', p: 110, t: 'WATER', pp: 7, maxPP: 7, acc: 100, desc: '如潮汐般席卷的觉醒之水' },
  GRASS:   { name: '觉醒·森罗生', p: 105, t: 'GRASS', pp: 8, maxPP: 8, acc: 100, desc: '万物生长的觉醒之力' },
  ELECTRIC:{ name: '觉醒·天雷引', p: 115, t: 'ELECTRIC', pp: 6, maxPP: 6, acc: 90, desc: '撕裂苍穹的觉醒雷霆' },
  ICE:     { name: '觉醒·永冻痕', p: 110, t: 'ICE', pp: 7, maxPP: 7, acc: 95, desc: '冻结一切的觉醒寒霜' },
  FIGHT:   { name: '觉醒·破军拳', p: 115, t: 'FIGHT', pp: 5, maxPP: 5, acc: 95, desc: '粉碎极限的觉醒格斗' },
  POISON:  { name: '觉醒·蚀骨毒', p: 100, t: 'POISON', pp: 8, maxPP: 8, acc: 100, desc: '侵蚀灵魂的觉醒剧毒' },
  GROUND:  { name: '觉醒·地裂震', p: 120, t: 'GROUND', pp: 6, maxPP: 6, acc: 95, desc: '撼动大地的觉醒之力' },
  FLYING:  { name: '觉醒·裂空翼', p: 110, t: 'FLYING', pp: 7, maxPP: 7, acc: 95, desc: '划破天际的觉醒疾风' },
  PSYCHIC: { name: '觉醒·心界斩', p: 115, t: 'PSYCHIC', pp: 6, maxPP: 6, acc: 100, desc: '洞穿意识的觉醒念力' },
  BUG:     { name: '觉醒·虫群啸', p: 105, t: 'BUG', pp: 8, maxPP: 8, acc: 100, desc: '万虫共鸣的觉醒之力' },
  ROCK:    { name: '觉醒·磐石崩', p: 120, t: 'ROCK', pp: 6, maxPP: 6, acc: 90, desc: '山岳倾覆的觉醒岩石' },
  GHOST:   { name: '觉醒·幽冥缚', p: 110, t: 'GHOST', pp: 7, maxPP: 7, acc: 100, desc: '缠绕灵魂的觉醒幽影' },
  DRAGON:  { name: '觉醒·龙魂啸', p: 120, t: 'DRAGON', pp: 5, maxPP: 5, acc: 90, desc: '远古龙魂的觉醒咆哮' },
  STEEL:   { name: '觉醒·钢魂斩', p: 115, t: 'STEEL', pp: 6, maxPP: 6, acc: 95, desc: '无坚不摧的觉醒钢铁' },
  FAIRY:   { name: '觉醒·星辉舞', p: 105, t: 'FAIRY', pp: 8, maxPP: 8, acc: 100, desc: '洒落星辉的觉醒妖精' },
  DARK:    { name: '觉醒·暗夜噬', p: 115, t: 'DARK', pp: 6, maxPP: 6, acc: 95, desc: '吞噬光明的觉醒黑暗' },
  WIND:    { name: '觉醒·岚涡斩', p: 110, t: 'WIND', pp: 7, maxPP: 7, acc: 95, desc: '席卷万物的觉醒风暴' },
  LIGHT:   { name: '觉醒·圣辉照', p: 115, t: 'LIGHT', pp: 6, maxPP: 6, acc: 100, desc: '净化一切的觉醒圣光' },
  HEAL:    { name: '觉醒·生命泉', p: 90, t: 'HEAL', pp: 10, maxPP: 10, acc: 100, desc: '复苏万物的觉醒治愈', effect: { type: 'HEAL', val: 0.35 } },
  COSMIC:  { name: '觉醒·星尘爆', p: 120, t: 'COSMIC', pp: 5, maxPP: 5, acc: 90, desc: '宇宙坍缩的觉醒之力' },
  SOUND:   { name: '觉醒·共鸣波', p: 110, t: 'SOUND', pp: 7, maxPP: 7, acc: 100, desc: '震碎灵魂的觉醒音波' },
  GOD:     { name: '觉醒·神罚', p: 120, t: 'GOD', pp: 4, maxPP: 4, acc: 85, desc: '神域降临的终极觉醒' },
  TIME:    { name: '觉醒·时空断裂', p: 115, t: 'TIME', pp: 5, maxPP: 5, acc: 95, desc: '撕裂时间线的觉醒之力', effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.5 } },
  CHAOS:   { name: '觉醒·混沌终焉', p: 115, t: 'CHAOS', pp: 4, maxPP: 4, acc: 85, desc: '终结一切秩序的混沌觉醒', effect: { type: 'STATUS', status: 'CON', chance: 0.3 } },
};

export const RESONANCE_COMBOS = [
  {
    id: 'curse_chakra',
    name: '咒查共鸣',
    icon: '⚡',
    desc: '咒术觉醒 + 忍术精通≥3：技能伤害+12%',
    effects: { skillDamageMult: 1.12 },
    check: (ctx) => ctx.jjkAwakened && ctx.maxJutsuMasteryLevel >= 3,
  },
  {
    id: 'curse_fruit',
    name: '咒果共鸣',
    icon: '🍎',
    desc: '咒术觉醒 + 恶魔果实：变身持续+2回合',
    effects: { fruitDurationBonus: 2 },
    check: (ctx) => ctx.jjkAwakened && ctx.hasDevilFruit,
  },
  {
    id: 'chakra_sect',
    name: '查门共鸣',
    icon: '🏔️',
    desc: '忍术精通≥3 + 门派：查克拉消耗-15%',
    effects: { chakraCostMult: 0.85 },
    check: (ctx) => ctx.maxJutsuMasteryLevel >= 3 && ctx.hasSect,
  },
  {
    id: 'fruit_sect',
    name: '果门共鸣',
    icon: '🌸',
    desc: '恶魔果实 + 门派：门派被动×1.5',
    effects: { sectEffectMult: 1.5 },
    check: (ctx) => ctx.hasDevilFruit && ctx.hasSect,
  },
  {
    id: 'sanguo_all',
    name: '名将联动',
    icon: '🏴',
    desc: '同阵营名将 + 任意2种共鸣：金币+20%',
    effects: { goldMult: 1.2 },
    check: (ctx) => ctx.hasFactionGeneral && ctx.activeResonanceCount >= 2,
  },
  {
    id: 'ultimate',
    name: '终极共鸣',
    icon: '✨',
    desc: '四系全开：首回合全能力+1阶（超越爆发）',
    effects: { transcendence: true },
    check: (ctx) => ctx.jjkAwakened && ctx.maxJutsuMasteryLevel >= 3 && ctx.hasDevilFruit && ctx.hasSect,
  },
  {
    id: 'eco_bond',
    name: '生态羁绊',
    icon: '💫',
    desc: '结契精灵 + 生态繁荣区：净化效率+10%',
    effects: { purifyEfficiency: 1.1 },
    check: (ctx) => ctx.hasBondedPet && ctx.ecoBlessed,
  },
  {
    id: 'sanctuary_guard',
    name: '圣域守护',
    icon: '⛩️',
    desc: '圣域设施总等级≥3：守护战目标HP+15%',
    effects: { protectBonus: 0.15 },
    check: (ctx) => (ctx.sanctuaryLevel || 0) >= 3 && ctx.hasSect,
  },
  {
    id: 'sect_eco',
    name: '门派心法',
    icon: '📜',
    desc: '门派生态心法 + 对应分支：生态恩赐+3',
    effects: { guardianScoreBonus: 3 },
    check: (ctx) => ctx.hasSect && ctx.ecoBranchTaken,
  },
  {
    id: 'general_tactic',
    name: '将魂战术',
    icon: '🏇',
    desc: '装备将魂战术 + 古战场通关：副本金币+10%',
    effects: { goldMult: 1.1 },
    check: (ctx) => ctx.generalTacticId && ctx.battlefieldCleared >= 1,
  },
  {
    id: 'fruit_eco',
    name: '果生态能',
    icon: '🌱',
    desc: '恶魔果实 + 生态型试炼：果实变身疲劳-10',
    effects: { fruitFatigueReduce: 10 },
    check: (ctx) => ctx.hasDevilFruit && ctx.fruitTrialClear,
  },
  {
    id: 'breath_jutsu_seal',
    name: '呼吸封印',
    icon: '🌬️',
    desc: '主修呼吸法+封印忍术联携：鬼化 Boss 净化效率+12%',
    effects: { purifyBonus: 12, bossMultReduce: 0.04 },
    check: (ctx) => ctx.playerStyle?.main === 'breathing' && ctx.hasSealJutsu,
  },
  {
    id: 'kw_eco_link',
    name: '国土共鸣',
    icon: '🏴',
    desc: '国战贡献≥500 + 完成国土灵灾：国战贡献+8%',
    effects: { kwContribMult: 1.08 },
    check: (ctx) => (ctx.kwContrib || 0) >= 500 && ctx.calamityParticipated,
  },
];

export const RELIC_RARITY = {
  COMMON:    { name: '普通', color: '#78909C', weight: 50 },
  RARE:      { name: '稀有', color: '#1E88E5', weight: 28 },
  EPIC:      { name: '史诗', color: '#8E24AA', weight: 15 },
  LEGENDARY: { name: '传说', color: '#FF8F00', weight: 7 },
};

export const INFINITY_RELICS = [
  { id: 'breath_dawn', name: '破晓之息', rarity: 'COMMON', icon: '🌅', desc: '战斗经验+3%', effects: { expMult: 1.03 } },
  { id: 'lucky_charm', name: '幸运符印', rarity: 'COMMON', icon: '🍀', desc: '捕获率+2%', effects: { catchRateBonus: 2 } },
  { id: 'iron_resolve', name: '铁心意志', rarity: 'COMMON', icon: '🛡️', desc: '物防+3%', effects: { defMult: 1.03 } },
  { id: 'swift_sand', name: '流沙之靴', rarity: 'COMMON', icon: '👟', desc: '速度+3%', effects: { spdMult: 1.03 } },
  { id: 'coin_pouch', name: '聚财袋', rarity: 'COMMON', icon: '💰', desc: '战斗金币+5%', effects: { goldMult: 1.05 } },
  { id: 'shadow_fragment', name: '暗影碎片', rarity: 'RARE', icon: '🌑', desc: '夜间闪光率+8%', effects: { shinyRateBonus: 0.08, nightOnly: true } },
  { id: 'chakra_stone', name: '查克拉石', rarity: 'RARE', icon: '🔮', desc: '查克拉回复+10%', effects: { chakraRegenMult: 1.1 } },
  { id: 'fruit_seed', name: '果实之种', rarity: 'RARE', icon: '🌱', desc: '果实变身冷却-1回合', effects: { fruitCdReduce: 1 } },
  { id: 'sect_scroll', name: '门派秘卷', rarity: 'RARE', icon: '📜', desc: '门派效果+8%', effects: { sectEffectMult: 1.08 } },
  { id: 'echo_crystal', name: '回声水晶', rarity: 'RARE', icon: '💎', desc: '技能伤害+5%', effects: { skillDamageMult: 1.05 } },
  { id: 'infinity_core', name: '无限核心', rarity: 'EPIC', icon: '♾️', desc: '矿洞体力恢复+1/次(每6分钟)', effects: { mineEnergyBonus: 1 } },
  { id: 'eco_bloom', name: '生态之花', rarity: 'EPIC', icon: '🌺', desc: '生态繁荣区闪光率+10%', effects: { blessedShinyBonus: 0.1 } },
  { id: 'war_banner', name: '战旗残片', rarity: 'EPIC', icon: '🏴', desc: '国战贡献+15%', effects: { kwContribMult: 1.15 } },
  { id: 'gang_emblem', name: '帮派徽记', rarity: 'EPIC', icon: '🐲', desc: '帮派技能效果+10%', effects: { gangSkillMult: 1.1 } },
  { id: 'mastery_tome', name: '精通秘典', rarity: 'EPIC', icon: '📖', desc: '忍术精通成长+20%', effects: { jutsuMasteryMult: 1.2 } },
  { id: 'castle_crown', name: '城堡王冠', rarity: 'LEGENDARY', icon: '👑', desc: 'PVE战斗开始全能力+1阶', effects: { battleStartStages: 1, pveOnly: true } },
  { id: 'star_essence', name: '星尘精华', rarity: 'LEGENDARY', icon: '⭐', desc: '全属性+5%', effects: { allStatsMult: 1.05 } },
  { id: 'void_mirror', name: '虚空之镜', rarity: 'LEGENDARY', icon: '🪞', desc: '暴击率+8%', effects: { critBonus: 8 } },
  { id: 'dragon_scale', name: '龙鳞护符', rarity: 'LEGENDARY', icon: '🐉', desc: '觉醒精灵属性+8%', effects: { awakenedStatsMult: 1.08 } },
  { id: 'guardian_seed', name: '守望之种', rarity: 'LEGENDARY', icon: '🌿', desc: '生态恩赐得分+50%', effects: { guardianScoreMult: 1.5 } },
];

export const ECOLOGY_GUARDIANS = [
  { id: 'guardian_grass', ecosystem: 'GRASS', name: '翠岭圣灵', petId: 3, icon: '🌿', trait: 'ecoguard_regen', desc: '每回合回复5%最大HP' },
  { id: 'guardian_water', ecosystem: 'WATER', name: '渊海圣使', petId: 9, icon: '🌊', trait: 'ecoguard_shield', desc: '入场获得15%最大HP护盾' },
  { id: 'guardian_fire', ecosystem: 'FIRE', name: '熔心守望', petId: 6, icon: '🔥', trait: 'ecoguard_blaze', desc: '火系伤害+15%' },
  { id: 'guardian_ghost', ecosystem: 'GHOST', name: '幽林使者', petId: 94, icon: '👻', trait: 'ecoguard_phantom', desc: '首回合闪避+25%' },
  { id: 'guardian_ice', ecosystem: 'ICE', name: '极寒守护', petId: 78, icon: '❄️', trait: 'ecoguard_frost', desc: '入场降低敌方速度1阶' },
  { id: 'guardian_rock', ecosystem: 'ROCK', name: '岩岭守护', petId: 15, icon: '🪨', trait: 'ecoguard_rockwall', desc: '入场获得岩盾，物理防御+20%' },
  { id: 'guardian_steel', ecosystem: 'STEEL', name: '钢城哨兵', petId: 87, icon: '⚙️', trait: 'ecoguard_overclock', desc: '入场暴击率+10%，每回合回复3%HP' },
  { id: 'guardian_dragon', ecosystem: 'DRAGON', name: '龙脉看守', petId: 81, icon: '🐲', trait: 'ecoguard_dragon', desc: '龙系技能伤害+15%，入场时灵气+5' },
  { id: 'guardian_flying', ecosystem: 'FLYING', name: '苍穹守望', petId: 43, icon: '🦅', trait: 'ecoguard_gale', desc: '入场速度+1阶，风系技能+10%' },
  { id: 'guardian_fairy', ecosystem: 'FAIRY', name: '星辉仙灵', petId: 49, icon: '✨', trait: 'ecoguard_starlight', desc: '入场治愈全队8%HP，妖精技能+10%' },
  { id: 'guardian_electric', ecosystem: 'ELECTRIC', name: '雷霆守卫', petId: 35, icon: '⚡', trait: 'ecoguard_spark', desc: '入场麻痹敌方30%概率，电系技能+10%' },
  { id: 'guardian_ground', ecosystem: 'GROUND', name: '大地守望', petId: 99, icon: '🌋', trait: 'ecoguard_quake', desc: '入场降低敌方命中1阶，地面技能+10%' },
  { id: 'guardian_poison', ecosystem: 'POISON', name: '毒瘴圣灵', petId: 185, icon: '☠️', trait: 'ecoguard_toxin', desc: '入场敌方中毒25%概率，毒系伤害+10%' },
];

export const GUARDIAN_MILESTONES = [
  { score: 10, reward: { title: '生态见习' } },
  { score: 25, reward: { title: '生态守护者', gold: 5000 } },
  { score: 50, reward: { title: '生态贤者', item: 'master', itemCount: 1, itemCat: 'balls' } },
  { score: 100, reward: { title: '生态大师', petId: 785, petLevel: 70, shiny: true } },
];

export function getAwakeningMove(type) {
  return AWAKENING_MOVES[type] || AWAKENING_MOVES.NORMAL;
}

export function getPetTotalEv(pet) {
  const evs = pet?.evs || {};
  // 与 statsCalculator 的 EV_STAT_KEYS 保持一致（crit 努力值不计入 510 上限与觉醒门槛）
  const EV_STAT_KEYS = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
  return EV_STAT_KEYS.reduce((s, k) => s + Math.max(0, evs[k] || 0), 0);
}

export function hasUsedSkillInherit(allPets = []) {
  return (allPets || []).some(p => (p.legacyCount || 0) > 0 || p.inheritedMove);
}

/** 觉醒精灵本人须为传承导师或学徒 */
export function hasPetParticipatedInLegacy(pet) {
  if (!pet) return false;
  return (pet.legacyCount || 0) > 0 || !!pet.inheritedMove;
}

export function canAwakenPet(pet, allPets = []) {
  if (!pet || pet.awakened) return { ok: false, reason: pet?.awakened ? '已觉醒' : '无效精灵' };
  const reqs = [];
  if ((pet.level || 0) < AWAKENING_REQUIREMENTS.minLevel) reqs.push(`等级 ${AWAKENING_REQUIREMENTS.minLevel}`);
  if ((pet.intimacy || 0) < AWAKENING_REQUIREMENTS.minIntimacy) reqs.push(`亲密度 ${AWAKENING_REQUIREMENTS.minIntimacy}`);
  if (getPetTotalEv(pet) < AWAKENING_REQUIREMENTS.minTotalEv) reqs.push(`EV合计 ${AWAKENING_REQUIREMENTS.minTotalEv}`);
  if (AWAKENING_REQUIREMENTS.needsDevilFruitOrSectOrJutsu && !pet.devilFruit && !(pet.sectLevel >= 2) && !pet.hasJutsuTraining) reqs.push('装备恶魔果实/门派心法≥2/习得忍术(三选一)');
  if (AWAKENING_REQUIREMENTS.needsSkillInherit && !hasPetParticipatedInLegacy(pet)) reqs.push('本精灵须为传承导师或学徒');
  return reqs.length ? { ok: false, reason: `还需：${reqs.join('、')}` } : { ok: true };
}

export function isJjkAwakened(pet) {
  if (!pet) return false;
  if (pet.cursedTechnique) return true;
  return (pet.level || 0) >= AWAKENING_CONDITIONS.byLevel && (pet.intimacy || 0) >= AWAKENING_CONDITIONS.byIntimacy;
}

export function getMaxJutsuMasteryLevel(jutsuMastery = {}) {
  let maxLv = 0;
  Object.values(jutsuMastery || {}).forEach(uses => {
    maxLv = Math.max(maxLv, getJutsuMasteryLevel(uses).level);
  });
  return maxLv;
}

export function buildResonanceContext(pet, { narutoState, kingdomWar, gang, allPets, fusionState, sanctuaryState, regionEcology, currentMapId } = {}) {
  const jjkAwakened = isJjkAwakened(pet);
  const maxJutsuMasteryLevel = getMaxJutsuMasteryLevel(narutoState?.jutsuMastery);
  const hasDevilFruit = !!pet?.devilFruit;
  const hasSect = !!(pet?.sectId && (pet.sectLevel || 0) >= 2);
  const gangPreset = gang?.gangId ? GANG_PRESETS.find(g => g.id === gang.gangId) : null;
  const gangFaction = gangPreset?.faction;
  const playerFaction = kingdomWar?.faction;
  const recruited = kingdomWar?.recruitedGenerals || [];
  const hasFactionGeneral = recruited.some(g => g.faction === playerFaction && playerFaction && playerFaction !== 'neutral');
  const hasBondedPet = (allPets || []).some(p => p?.bonded);
  const eco = regionEcology?.[currentMapId];
  const ecoHealth = eco ? calcEcologyHealth(eco) : 50;
  const ecoBlessed = ecoHealth >= BLESSED_ECO_THRESHOLD;
  const sanctuaryLevel = Object.values(sanctuaryState?.facilities || {}).reduce((s, v) => s + (v || 0), 0);
  const fs = fusionState || {};
  const hasSealJutsu = !!(fs.sealChapter?.completed || fs.sealChapter === 'cleared' || fs.sealChapterCleared);
  const playerStyle = fs.playerStyle || { main: null, sub: null };
  const baseCtx = {
    jjkAwakened, maxJutsuMasteryLevel, hasDevilFruit, hasSect, hasFactionGeneral,
    hasBondedPet, ecoBlessed, sanctuaryLevel, hasSealJutsu, playerStyle,
    ecoBranchTaken: !!(fs.ecoBranchTaken),
    generalTacticId: fs.generalTacticId,
    battlefieldCleared: (fs.battlefieldsCleared || []).length,
    fruitTrialClear: !!(fs.fruitTrialsCleared || []).length,
    kwContrib: kingdomWar?.warContribution || 0,
    calamityParticipated: (fs.calamitiesParticipated || []).length > 0,
    activeResonanceCount: 0,
  };
  const preActive = RESONANCE_COMBOS.filter(c => c.id !== 'ultimate' && c.id !== 'sanguo_all' && c.check(baseCtx));
  baseCtx.activeResonanceCount = preActive.length;
  const finalActive = RESONANCE_COMBOS.filter(c => c.id !== 'ultimate' && c.check(baseCtx));
  baseCtx.activeResonanceCount = finalActive.length;
  return baseCtx;
}

export function calcResonanceBonuses(pet, context = {}) {
  const ctx = buildResonanceContext(pet, context);
  const active = RESONANCE_COMBOS.filter(c => c.check(ctx));
  const effects = {
    skillDamageMult: 1,
    fruitDurationBonus: 0,
    chakraCostMult: 1,
    sectEffectMult: 1,
    goldMult: 1,
    transcendence: false,
    purifyEfficiency: 1,
    purifyBonus: 0,
    bossMultReduce: 0,
    protectBonus: 0,
    fruitFatigueReduce: 0,
    kwContribMult: 1,
    guardianScoreBonus: 0,
    activeCombos: active,
  };
  active.forEach(combo => {
    const e = combo.effects || {};
    if (e.skillDamageMult) effects.skillDamageMult *= e.skillDamageMult;
    if (e.fruitDurationBonus) effects.fruitDurationBonus += e.fruitDurationBonus;
    if (e.chakraCostMult) effects.chakraCostMult *= e.chakraCostMult;
    if (e.sectEffectMult) effects.sectEffectMult *= e.sectEffectMult;
    if (e.goldMult) effects.goldMult *= e.goldMult;
    if (e.purifyEfficiency) effects.purifyEfficiency *= e.purifyEfficiency;
    if (e.purifyBonus) effects.purifyBonus += e.purifyBonus;
    if (e.bossMultReduce) effects.bossMultReduce += e.bossMultReduce;
    if (e.protectBonus) effects.protectBonus += e.protectBonus;
    if (e.fruitFatigueReduce) effects.fruitFatigueReduce += e.fruitFatigueReduce;
    if (e.kwContribMult) effects.kwContribMult *= e.kwContribMult;
    if (e.guardianScoreBonus) effects.guardianScoreBonus += e.guardianScoreBonus;
    if (e.transcendence) effects.transcendence = true;
  });
  return effects;
}

export function getRelicById(id) {
  return INFINITY_RELICS.find(r => r.id === id) || null;
}

export function getEquippedRelicEffects(relicState = {}) {
  const equipped = relicState?.equipped || [];
  const effects = {
    expMult: 1,
    catchRateBonus: 0,
    defMult: 1,
    spdMult: 1,
    goldMult: 1,
    shinyRateBonus: 0,
    chakraRegenMult: 1,
    fruitCdReduce: 0,
    sectEffectMult: 1,
    skillDamageMult: 1,
    mineEnergyBonus: 0,
    blessedShinyBonus: 0,
    kwContribMult: 1,
    gangSkillMult: 1,
    jutsuMasteryMult: 1,
    battleStartStages: 0,
    allStatsMult: 1,
    critBonus: 0,
    awakenedStatsMult: 1,
    guardianScoreMult: 1,
    nightOnly: false,
  };
  equipped.forEach(id => {
    const relic = getRelicById(id);
    if (!relic?.effects) return;
    const e = relic.effects;
    if (e.expMult) effects.expMult *= e.expMult;
    if (e.catchRateBonus) effects.catchRateBonus += e.catchRateBonus;
    if (e.defMult) effects.defMult *= e.defMult;
    if (e.spdMult) effects.spdMult *= e.spdMult;
    if (e.goldMult) effects.goldMult *= e.goldMult;
    if (e.shinyRateBonus) effects.shinyRateBonus += e.shinyRateBonus;
    if (e.chakraRegenMult) effects.chakraRegenMult *= e.chakraRegenMult;
    if (e.fruitCdReduce) effects.fruitCdReduce += e.fruitCdReduce;
    if (e.sectEffectMult) effects.sectEffectMult *= e.sectEffectMult;
    if (e.skillDamageMult) effects.skillDamageMult *= e.skillDamageMult;
    if (e.mineEnergyBonus) effects.mineEnergyBonus += e.mineEnergyBonus;
    if (e.blessedShinyBonus) effects.blessedShinyBonus += e.blessedShinyBonus;
    if (e.kwContribMult) effects.kwContribMult *= e.kwContribMult;
    if (e.gangSkillMult) effects.gangSkillMult *= e.gangSkillMult;
    if (e.jutsuMasteryMult) effects.jutsuMasteryMult *= e.jutsuMasteryMult;
    if (e.battleStartStages) effects.battleStartStages = Math.max(effects.battleStartStages, e.battleStartStages);
    if (e.allStatsMult) effects.allStatsMult *= e.allStatsMult;
    if (e.critBonus) effects.critBonus += e.critBonus;
    if (e.awakenedStatsMult) effects.awakenedStatsMult *= e.awakenedStatsMult;
    if (e.guardianScoreMult) effects.guardianScoreMult *= e.guardianScoreMult;
    if (e.nightOnly) effects.nightOnly = true;
  });
  return effects;
}

export function normalizeMapBiome(mapType) {
  if (!mapType) return null;
  const key = String(mapType).toLowerCase();
  return MAP_BIOME_TO_ECOSYSTEM[key] || key.toUpperCase();
}

export function getDuplicateRelicGold(relic) {
  if (!relic) return 1000;
  return DUPLICATE_RELIC_GOLD[relic.rarity] || 1500;
}

export function getFruitTransformMinTurn(relicEffects = {}) {
  const reduce = relicEffects?.fruitCdReduce || 0;
  return Math.max(1, FRUIT_TRANSFORM_BASE_TURN - reduce);
}

export function applyGangSkillMult(bonus, mult = 1) {
  if (!bonus || mult <= 1) return bonus || {};
  const scaled = { ...bonus };
  ['atk', 'def', 's_atk', 's_def', 'hp', 'spd', 'gold', 'exp', 'contrib', 'territory', 'trade', 'catchRate'].forEach(k => {
    if (scaled[k]) scaled[k] = Math.floor(scaled[k] * mult);
  });
  return scaled;
}

export function mergeStatEffectMults(relicEffects = {}, resonanceEffects = {}) {
  return {
    sectEffectMult: (relicEffects.sectEffectMult || 1) * (resonanceEffects.sectEffectMult || 1),
    skillDamageMult: (relicEffects.skillDamageMult || 1) * (resonanceEffects.skillDamageMult || 1),
  };
}

/** 首回合结束后移除超越爆发加成 */
export function expireTranscendenceBoost(battle) {
  if (!battle?._transcendenceBoost) return battle;
  if ((battle.turnCount || 0) < 1) return battle;
  const boost = battle._transcendenceBoost;
  const targetIdx = battle._transcendenceTargetIdx ?? battle.activeIdx;
  const cs = battle.playerCombatStates?.[targetIdx];
  if (cs?.stages && boost > 0) {
    ['p_atk', 'p_def', 's_atk', 's_def', 'spd'].forEach(k => {
      cs.stages[k] = (cs.stages[k] || 0) - boost;
    });
  }
  return { ...battle, _transcendenceBoost: 0, _transcendenceTargetIdx: undefined };
}

export function rollInfinityRelic(floor = 1, ownedIds = []) {
  let pool = [...INFINITY_RELICS];
  const unowned = pool.filter(r => !(ownedIds || []).includes(r.id));
  if (unowned.length > 0) {
    pool = unowned;
  } else {
    const dup = pool[Math.floor(Math.random() * pool.length)];
    return { ...dup, isDuplicate: true, goldValue: DUPLICATE_RELIC_GOLD[dup.rarity] || 1500 };
  }
  const weights = pool.map(r => {
    const base = RELIC_RARITY[r.rarity]?.weight || 10;
    if (floor >= 80 && r.rarity === 'LEGENDARY') return base * 1.8;
    if (floor >= 50 && (r.rarity === 'EPIC' || r.rarity === 'LEGENDARY')) return base * 1.4;
    if (floor >= 30 && r.rarity === 'RARE') return base * 1.2;
    return base;
  });
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[0];
}

export function calcEcologyHealth(eco = {}) {
  const metrics = ECO_METRIC_KEYS.filter(k => k !== 'pollution');
  const metricAvg = metrics.reduce((s, k) => s + (eco[k] ?? 50), 0) / Math.max(1, metrics.length);
  const pollutionScore = 100 - (eco.pollution ?? 30);
  return (metricAvg + pollutionScore) / 2;
}

export function isRegionBlessed(eco) {
  return calcEcologyHealth(eco) >= BLESSED_ECO_THRESHOLD;
}

export function getEcologyGuardianForMap(mapType) {
  const eco = normalizeMapBiome(mapType);
  if (!eco) return null;
  return ECOLOGY_GUARDIANS.find(g => g.ecosystem === eco)
    || ECOLOGY_GUARDIANS.find(g => g.ecosystem === eco.split('_')[0])
    || null;
}

export function getGuardianPointsForBranch(branchId) {
  const br = MORAL_BRANCHES[branchId];
  if (!br?.ecology) return 0;
  const positive = Object.entries(br.ecology).reduce((s, [, v]) => s + (v > 0 ? v : 0), 0);
  return Math.max(1, Math.floor(positive / 5));
}

export function getGangFaction(gang) {
  if (!gang?.gangId) return null;
  if (gang.isOwner && gang.customGang?.faction) return gang.customGang.faction;
  return GANG_PRESETS.find(g => g.id === gang.gangId)?.faction || null;
}

export function isGangKingdomAligned(gang, kingdomWar) {
  const gf = getGangFaction(gang);
  const kf = kingdomWar?.faction;
  return !!(gf && kf && gf === kf);
}

export function getGangSkillCapBonus(kingdomWar) {
  const rank = getMilitaryRank(kingdomWar?.warContribution || 0, kingdomWar || {});
  const idx = ['civilian','soldier','captain','commander','general_l','general','general_h','grand_gen','minister','king','hegemon','emperor'].indexOf(rank.id);
  // 军衔「将军」(第6阶, index 5) 及以上解锁 +1 技能槽
  return idx >= 5 ? 1 : 0;
}

export function getEffectiveShinyBonus(relicEffects = {}, { blessed = false, nightPhase = false } = {}) {
  let bonus = 0;
  if (blessed) {
    bonus += BLESSED_SHINY_BONUS;
    if (relicEffects.blessedShinyBonus) bonus += relicEffects.blessedShinyBonus;
  }
  if (nightPhase && relicEffects.shinyRateBonus) bonus += relicEffects.shinyRateBonus;
  return Math.min(bonus, 0.25);
}

export function getUnclaimedGuardianMilestones(score, claimed = []) {
  return GUARDIAN_MILESTONES.filter(m => score >= m.score && !(claimed || []).includes(m.score));
}
