/** v14.1 六系统融合 — 门派映射 / 觉醒三档 / 国战PVE / 解锁节奏 */

import { SECT_DB } from './sects';
import { canAwakenPet as baseCanAwakenPet } from './resonance';

/** 12 武侠门派 → 生态 PVE 心法角色（映射方案，不替换现有门派战斗被动） */
export const SECT_ECO_ROLES = {
  1:  { ecoRole: 'burst',    label: '爆发清障', desc: '快速焚烧/压制污染，生态恢复较慢', branches: ['fight'], ecoDelta: { pollution: -20, vegetation: -5 } },
  2:  { ecoRole: 'defense',  label: '筑城防守', desc: '国战防守、地形建设、矿洞探索', branches: ['relocate'], ecoDelta: { stability: 20 } },
  3:  { ecoRole: 'mobility', label: '机动侦查', desc: '潜入、双线、逃脱战优势', branches: ['soothe'], ecoDelta: { diversity: 10 } },
  4:  { ecoRole: 'burst',    label: '精准破防', desc: 'Boss 破防、精英压制', branches: ['fight'], ecoDelta: { stability: 10 } },
  5:  { ecoRole: 'heal',     label: '生态修复', desc: '净化、治疗、安抚植物精灵', branches: ['heal', 'soothe'], ecoDelta: { vegetation: 20, pollution: -15 } },
  6:  { ecoRole: 'burst',    label: '火焰控制', desc: '清理藤蔓/污染，需控制强度', branches: ['fight'], ecoDelta: { pollution: -15, vegetation: -8 } },
  7:  { ecoRole: 'control',  label: '冰封净化', desc: '冻结污染源、湖泊探索', branches: ['heal'], ecoDelta: { water: 15, pollution: -10 } },
  8:  { ecoRole: 'control',  label: '毒素分析', desc: '识别污染根源、暗线任务', branches: ['soothe'], ecoDelta: { pollution: -12 } },
  9:  { ecoRole: 'defense',  label: '组织防线', desc: '护送、据点保护、NPC 防线', branches: ['relocate'], ecoDelta: { stability: 15 } },
  10: { ecoRole: 'puzzle',   label: '机关解谜', desc: '古代遗迹、机械精灵、根系分析', branches: ['heal'], ecoDelta: { spirit: 10, stability: 10 } },
  11: { ecoRole: 'control',  label: '元素联动', desc: '阵法、控制、元素机关', branches: ['heal', 'soothe'], ecoDelta: { spirit: 12 } },
  12: { ecoRole: 'balance',  label: '调和双方', desc: '调停冲突、资源交换', branches: ['soothe', 'relocate'], ecoDelta: { stability: 18, diversity: 8 } },
};

/** 忍术 × 精灵属性联携（PVE 效率加成，非战斗数值膨胀） */
export const JUTSU_PET_SYNERGY = [
  { jutsuElement: 'WATER', petTypes: ['WATER', 'ELECTRIC'], effect: 'conductive_field', label: '导电水域', desc: '净化战进度 +15%', purifyBonus: 15 },
  { jutsuElement: 'FIRE', petTypes: ['FIRE', 'WIND', 'FLYING'], effect: 'fire_vortex', label: '火焰旋风', desc: '群怪战效率提升', captureBonus: 0.1 },
  { jutsuElement: 'GROUND', petTypes: ['GROUND', 'ROCK', 'GRASS'], effect: 'forest_wall', label: '森林壁垒', desc: '守护战目标 HP +15%', protectBonus: 0.15 },
  { jutsuElement: 'ELECTRIC', petTypes: ['ELECTRIC', 'STEEL'], effect: 'purify_seal', label: '净化封印', desc: '净化战每回合额外 -8%', purifyBonus: 8 },
  { jutsuElement: 'GROUND', petTypes: ['DARK', 'GHOST', 'GROUND'], effect: 'shadow_lure', label: '影分身诱敌', desc: '活捕战容错 +1 次失误', captureBonus: 0.15 },
  { jutsuElement: 'WATER', petTypes: ['ICE', 'WATER'], effect: 'frozen_path', label: '冰封路径', desc: '逃脱战所需回合 -1', escapeTurnReduce: 1 },
  { jutsuElement: 'WIND', petTypes: ['FLYING', 'BUG'], effect: 'scout_wind', label: '感知侦查', desc: '跳过一个探索步骤', skipExploreStep: true },
  { jutsuElement: 'FIRE', petTypes: ['TIME', 'COSMIC'], effect: 'time_blaze', label: '时空燃烧', desc: '净化战效率 +12%，时空系回合加速', purifyBonus: 12 },
  { jutsuElement: 'WIND', petTypes: ['CHAOS', 'DARK'], effect: 'chaos_gale', label: '混沌风暴', desc: '群怪战混沌属性伤害 +20%', captureBonus: 0.12 },
  { jutsuElement: 'ELECTRIC', petTypes: ['TIME', 'ELECTRIC'], effect: 'chrono_bolt', label: '时空雷鸣', desc: '净化战每回合额外 -10%', purifyBonus: 10 },
];

/** 恶魔果实 PVE 限制与生态型分类 */
export const FRUIT_PVE_RULES = {
  maxPerPet: 1,
  overuseFatigue: 15,
  waterRestrictedTypes: ['FIRE', 'GROUND'],
  sealSuppressesTurns: 2,
  ecoTypes: {
    element: { label: '元素型', maps: ['fire', 'water', 'ice'], effect: 'terrain_change' },
    transform: { label: '变身型', maps: ['cave', 'sky'], effect: 'form_shift' },
    rule: { label: '规则型', maps: ['ghost', 'space'], effect: 'rule_break' },
    eco: { label: '生态型', maps: ['grass', 'forest', 'swamp'], effect: 'eco_boost' },
  },
};

/** 觉醒三档 */
export const AWAKENING_TIERS = {
  normal: {
    id: 'normal', name: '普通觉醒', icon: '🌟',
    requirements: { minLevel: 100, minIntimacy: 200, minTotalEv: 400, needsDevilFruitOrSectOrJutsu: true, needsSkillInherit: true },
    rewards: { statMult: 1.10, unlockAwakeningMove: true, prefix: '🌟' },
  },
  fruit: {
    id: 'fruit', name: '恶魔果实觉醒', icon: '🍎',
    requirements: { needsNormalAwaken: true, needsDevilFruit: true, fruitTrialClear: true, pveFruitUse: 1 },
    rewards: { fruitDurationBonus: 1, mapEcoBonus: { vegetation: 5 }, unlockExpeditionBlessing: true },
  },
  strategic: {
    id: 'strategic', name: '战略觉醒', icon: '⚔️',
    requirements: { needsFruitAwaken: true, needsSectResonance: true, needsGeneralTactic: true, kwContribMin: 500, needsBattlefieldClear: true },
    rewards: { kwContribMult: 1.1, sanctuaryBonus: 0.05, title: '战略觉醒者', prefix: '⚔️🌟' },
  },
};

/** 轻量将魂 — PVE 战术（不改战斗属性） */
export const GENERAL_PVE_TACTICS = {
  zhuge_liang: {
    generalId: 'zhuge_liang', name: '诸葛亮', icon: '🧠', role: 'strategist',
    passive: { label: '军策·元素联动', desc: '净化/守护战目标效率 +12%', purifyBonus: 12, protectBonus: 0.12 },
    order: { label: '战令·八阵图', desc: '跳过一个解谜步骤', skipPuzzleStep: true },
    bestFor: ['purify', 'protect', 'mechanic_boss'],
  },
  guan_yu: {
    generalId: 'guan_yu', name: '关羽', icon: '🐉', role: 'warlord',
    passive: { label: '军策·破防', desc: 'Boss 战 bossMult -0.05', bossMultReduce: 0.05 },
    order: { label: '战令·斩将', desc: '活捕战进度 +12%', captureBonus: 0.12 },
    bestFor: ['boss', 'capture_alive'],
  },
  zhao_yun: {
    generalId: 'zhao_yun', name: '赵云', icon: '🏇', role: 'cavalry',
    passive: { label: '军策·护主', desc: '守护战目标 HP +15%', protectBonus: 0.15 },
    order: { label: '战令·单骑救主', desc: '逃脱战回合 -1', escapeTurnReduce: 1 },
    bestFor: ['protect', 'escape', 'escort'],
  },
  zhou_yu: {
    generalId: 'zhou_yu', name: '周瑜', icon: '🔥', role: 'fire_strategist',
    passive: { label: '军策·火风联携', desc: '火/风系净化 +10%，Boss弱化3%', purifyBonus: 10, bossMultReduce: 0.03 },
    order: { label: '战令·赤壁火攻', desc: '群怪战伤害+15%', swarmDamageBonus: 0.15 },
    bestFor: ['fight', 'swarm'],
    ecoPenalty: { vegetation: -5 },
  },
  hua_tuo: {
    generalId: 'hua_tuo', name: '华佗', icon: '💊', role: 'healer',
    passive: { label: '军策·青囊', desc: '结契/救助亲密度 +15', intimacyBonus: 15 },
    order: { label: '战令·急救', desc: '失败后重试一次非战斗步骤', retryNonCombat: true },
    bestFor: ['bonding', 'rescue', 'expedition'],
  },
  lu_xun: {
    generalId: 'lu_xun', name: '陆逊', icon: '📜', role: 'strategist',
    passive: { label: '军策·火计', desc: '群怪战效率+10%，火系净化+8%', purifyBonus: 8, captureBonus: 0.1 },
    order: { label: '战令·连营', desc: '连续战斗步骤间不消耗PP', skipPPCost: true },
    bestFor: ['fight', 'swarm', 'fire_themed'],
    ecoPenalty: { vegetation: -3 },
  },
  zhang_liao: {
    generalId: 'zhang_liao', name: '张辽', icon: '🐺', role: 'vanguard',
    passive: { label: '军策·威震', desc: '守护战目标防御+15%', protectBonus: 0.15 },
    order: { label: '战令·逍遥津', desc: '以少敌多时伤害+12%', eliteBonus: 0.12 },
    bestFor: ['protect', 'defense', 'outnumbered'],
  },
  cao_cao: {
    generalId: 'cao_cao', name: '曹操', icon: '👑', role: 'commander',
    passive: { label: '军策·挟天子', desc: '国战贡献+15%，Boss弱化3%', kwContribBonus: 0.15, bossMultReduce: 0.03 },
    order: { label: '战令·奇袭', desc: '首步骤战斗效率+20%', firstStepBonus: 0.2 },
    bestFor: ['kingdom_war', 'resource', 'command'],
  },
  sima_yi: {
    generalId: 'sima_yi', name: '司马懿', icon: '🦊', role: 'grand_strategist',
    passive: { label: '军策·隐忍', desc: '守护战+12%，净化+6%', protectBonus: 0.12, purifyBonus: 6 },
    order: { label: '战令·空城应对', desc: '跳过一个解谜步骤', skipPuzzleStep: true },
    bestFor: ['protect', 'puzzle', 'long_fight'],
  },
  deng_ai: {
    generalId: 'deng_ai', name: '邓艾', icon: '⛰️', role: 'vanguard',
    passive: { label: '军策·偷渡', desc: '逃脱回合-1，活捕+10%', escapeTurnReduce: 1, captureBonus: 0.1 },
    order: { label: '战令·奇兵天降', desc: '跳过一个探索步骤', skipExploreStep: true },
    bestFor: ['escape', 'capture', 'raid'],
  },
  yang_hu: {
    generalId: 'yang_hu', name: '羊祜', icon: '🕊️', role: 'peacekeeper',
    passive: { label: '军策·德化', desc: '安抚/修复分支生态+25%', ecoBranchBonus: 0.25 },
    order: { label: '战令·仁政', desc: '非战斗步骤重试一次', retryNonCombat: true },
    bestFor: ['bonding', 'eco', 'soothe'],
  },
  du_yu: {
    generalId: 'du_yu', name: '杜预', icon: '📖', role: 'scholar_general',
    passive: { label: '军策·破竹', desc: 'Boss弱化5%，净化+8%', bossMultReduce: 0.05, purifyBonus: 8 },
    order: { label: '战令·势如破竹', desc: '连续战斗后续伤害+10%', chainBattleBonus: 0.1 },
    bestFor: ['boss', 'purify', 'chain_battle'],
  },
  liu_bei: {
    generalId: 'liu_bei', name: '刘备', icon: '🤝', role: 'leader',
    passive: { label: '军策·仁德', desc: '结契亲密度+20，安抚成功率+10%', intimacyBonus: 20, captureBonus: 0.1 },
    order: { label: '战令·三顾', desc: '非战斗步骤效率+15%', nonCombatBonus: 0.15 },
    bestFor: ['bonding', 'soothe', 'eco'],
  },
  lu_bu: {
    generalId: 'lu_bu', name: '吕布', icon: '🗡️', role: 'berserker',
    passive: { label: '军策·无双', desc: 'Boss弱化8%，但守护战-5%', bossMultReduce: 0.08, protectBonus: -0.05 },
    order: { label: '战令·方天画戟', desc: '首步骤Boss战伤害+25%', firstStepBonus: 0.25 },
    bestFor: ['boss', 'burst', 'solo'],
  },
  sun_ce: {
    generalId: 'sun_ce', name: '孙策', icon: '🦁', role: 'conqueror',
    passive: { label: '军策·江东', desc: '逃脱回合-1，群怪战+8%', escapeTurnReduce: 1, captureBonus: 0.08 },
    order: { label: '战令·小霸王', desc: '多目标战斗效率+12%', swarmDamageBonus: 0.12 },
    bestFor: ['escape', 'swarm', 'speed'],
  },
};

/** 国战 PVE 任务 — 影响国家指标（有上限，防膨胀） */
export const KINGDOM_PVE_TASKS = [
  { id: 'kw_escort_grain', name: '护送粮草', icon: '🌾', reqBadges: 5, cooldownTurns: 3, cost: { grain: 5 }, reward: { kwManpower: 20, gold: 2000 }, ecoCost: null },
  { id: 'kw_purify_border', name: '净化边境', icon: '💧', reqBadges: 4, cooldownTurns: 2, cost: { energy: 10 }, reward: { guardianScore: 5, kwContrib: 30 }, ecoDelta: { pollution: -10 } },
  { id: 'kw_repair_wall', name: '修复城墙', icon: '🧱', reqBadges: 6, cooldownTurns: 4, cost: { gold: 2000, energy: 10 }, reward: { kwContrib: 50, gold: 2500 }, territoryStrength: 2 },
  { id: 'kw_repel_rampage', name: '击退暴走潮', icon: '⚔️', reqBadges: 5, cooldownTurns: 3, cost: { energy: 15 }, reward: { kwContrib: 40, guardianScore: 8 }, ecoDelta: { stability: 10 } },
  { id: 'kw_build_sanctuary', name: '建设圣域', icon: '⛩️', reqBadges: 7, cooldownTurns: 6, cost: { gold: 3000, energy: 20 }, reward: { kwContrib: 60, gold: 5000 }, requiresSanctuaryLv: 2, prereq: ['kw_purify_border'] },
  { id: 'kw_reclaim_mine', name: '夺回矿场', icon: '⛏️', reqBadges: 5, cooldownTurns: 4, cost: { energy: 20 }, reward: { kwContrib: 80, gold: 8000 }, requiresCrisis: 'crisis_canyon_mine', prereq: ['kw_repair_wall'] },
  { id: 'kw_night_patrol', name: '边境夜巡', icon: '🌙', reqBadges: 6, cooldownTurns: 3, cost: { energy: 15 }, reward: { kwContrib: 70, guardianScore: 10, gold: 6000 }, requiresUnlock: 'kw_night_patrol', ecoDelta: { stability: 8 } },
  { id: 'kw_seal_guardian', name: '封印守护', icon: '⛩️', reqBadges: 9, cooldownTurns: 8, cost: { energy: 30, gold: 5000 }, reward: { kwContrib: 100, guardianScore: 15, gold: 10000 }, requiresUnlock: 'kw_seal_guardian', ecoDelta: { spirit: 10, stability: 12 }, prereq: ['kw_night_patrol'] },
  { id: 'kw_field_hospital', name: '战场救护', icon: '💊', reqBadges: 5, cooldownTurns: 3, cost: { energy: 10 }, reward: { kwContrib: 40, gold: 3000, generalFragment: 'hua_tuo' }, ecoDelta: { stability: 5 } },
  { id: 'kw_jin_unify', name: '一统之路', icon: '🐉', reqBadges: 8, cooldownTurns: 10, cost: { energy: 30, gold: 8000 }, reward: { kwContrib: 90, gold: 9000, generalFragment: 'sima_yi' }, ecoDelta: { stability: 15, spirit: 8 }, prereq: ['kw_seal_guardian', 'kw_reclaim_mine'] },
];

/** 国家政策（占领区域后可选，PVE 行为影响，conflicts 互斥） */
export const NATION_POLICIES = {
  military: { name: '军事开发', icon: '⚔️', bonus: { kwManpower: 15 }, penalty: { pollution: 8 }, conflicts: ['eco', 'sanctuary'], desc: '军备提升快，生态下降' },
  eco: { name: '生态保护', icon: '🌿', bonus: { shinyRate: 0.05 }, penalty: { goldMult: 0.9 }, conflicts: ['military'], desc: '稀有精灵率提升，资源较慢' },
  trade: { name: '商业贸易', icon: '💰', bonus: { goldMult: 1.15 }, penalty: { stability: -5 }, conflicts: [], desc: '金币增加，易引黑市' },
  relic: { name: '古迹研究', icon: '🏛️', bonus: { spirit: 10 }, penalty: { pollution: 5 }, conflicts: ['eco'], desc: '遗迹开放，机械灵灾略增' },
  sect: { name: '门派共治', icon: '📜', bonus: { sectEffectMult: 1.08 }, penalty: {}, conflicts: [], desc: '门派贡献提升，效果平均' },
  sanctuary: { name: '精灵圣域', icon: '⛩️', bonus: { ecoStability: 15 }, penalty: { goldCost: 1.2 }, conflicts: ['military'], desc: '生态稳定，建设成本高' },
};

/** 系统解锁节奏（按徽章递增） */
export const FUSION_UNLOCK_SCHEDULE = [
  { chapter: 1, badges: 0, systems: ['pet', 'eco_basic', 'bonding'], label: '精灵生态基础' },
  { chapter: 2, badges: 3, systems: ['jutsu', 'jutsu_realm'], label: '忍术系统' },
  { chapter: 3, badges: 5, systems: ['devil_fruit', 'fruit_sea', 'kingdom_sim', 'gang_hq', 'dispatch'], label: '恶魔果实 & 国战模拟' },
  { chapter: 4, badges: 6, systems: ['sect_eco', 'sect_realm'], label: '门派生态心法' },
  { chapter: 5, badges: 7, systems: ['general_tactic', 'ancient_battlefield'], label: '名将战术' },
  { chapter: 6, badges: 8, systems: ['kingdom_pve', 'national_calamity', 'fusion_resonance'], label: '国战与国土灵灾' },
  { chapter: 7, badges: 10, systems: ['strategic_awaken', 'fusion_hub'], label: '终局融合' },
];

export function getSectEcoRole(sectId) {
  if (!sectId || sectId < 1 || sectId > 12) return null;
  return SECT_ECO_ROLES[sectId] || null;
}

export function getPartySectIds(party) {
  return [...new Set((party || []).map(p => p?.sectId).filter(Boolean))];
}

export function checkJutsuPetSynergy(party, jutsuElement) {
  const synergies = JUTSU_PET_SYNERGY.filter(s => s.jutsuElement === jutsuElement);
  if (!synergies.length) return null;
  const partyTypes = new Set();
  (party || []).forEach(p => {
    [p?.type, p?.secondaryType, p?.type2].filter(Boolean).forEach(t => partyTypes.add(t));
  });
  let best = null;
  for (const syn of synergies) {
    if (syn.petTypes.some(t => partyTypes.has(t))) {
      if (!best || (syn.purifyBonus || 0) > (best.purifyBonus || 0)) best = syn;
    }
  }
  return best;
}

export function getGeneralTactic(generalId) {
  return GENERAL_PVE_TACTICS[generalId] || null;
}

export function calcFusionPveBonuses(ctx = {}) {
  const bonuses = { purifyBonus: 0, protectBonus: 0, captureBonus: 0, escapeTurnReduce: 0, bossMultReduce: 0, skipPuzzleStep: false, skipExploreStep: false };
  if (ctx.sectId) {
    const role = getSectEcoRole(ctx.sectId);
    if (role?.ecoRole === 'heal') bonuses.purifyBonus += 8;
    else if (role?.ecoRole === 'defense') bonuses.protectBonus += 0.1;
    else if (role?.ecoRole === 'burst') bonuses.bossMultReduce += 0.04;
    else if (role?.ecoRole === 'control') bonuses.captureBonus += 0.08;
    else if (role?.ecoRole === 'mobility') bonuses.escapeTurnReduce += 1;
    else if (role?.ecoRole === 'puzzle') bonuses.skipPuzzleStep = true;
    else if (role?.ecoRole === 'balance') { bonuses.purifyBonus += 4; bonuses.protectBonus += 0.05; }
  }
  if (ctx.generalTacticId) {
    const gt = getGeneralTactic(ctx.generalTacticId);
    if (gt?.passive) {
      bonuses.purifyBonus += gt.passive.purifyBonus || 0;
      bonuses.protectBonus += gt.passive.protectBonus || 0;
      bonuses.captureBonus += gt.passive.captureBonus || 0;
      bonuses.escapeTurnReduce += gt.passive.escapeTurnReduce || 0;
      bonuses.bossMultReduce += gt.passive.bossMultReduce || 0;
      if (gt.passive.skipPuzzleStep) bonuses.skipPuzzleStep = true;
    }
  }
  if (ctx.jutsuSynergy) {
    bonuses.purifyBonus += ctx.jutsuSynergy.purifyBonus || 0;
    bonuses.protectBonus += ctx.jutsuSynergy.protectBonus || 0;
    bonuses.captureBonus += ctx.jutsuSynergy.captureBonus || 0;
    bonuses.escapeTurnReduce += ctx.jutsuSynergy.escapeTurnReduce || 0;
    if (ctx.jutsuSynergy.skipExploreStep) bonuses.skipExploreStep = true;
  }
  bonuses.purifyBonus = Math.min(30, bonuses.purifyBonus);
  bonuses.protectBonus = Math.min(0.25, bonuses.protectBonus);
  bonuses.captureBonus = Math.min(0.2, bonuses.captureBonus);
  bonuses.bossMultReduce = Math.min(0.1, bonuses.bossMultReduce);
  bonuses.escapeTurnReduce = Math.min(2, bonuses.escapeTurnReduce);
  return bonuses;
}

export function getUnlockedFusionSystems(badgeCount) {
  const unlocked = new Set(['pet']);
  FUSION_UNLOCK_SCHEDULE.forEach(s => {
    if (badgeCount >= s.badges) s.systems.forEach(sys => unlocked.add(sys));
  });
  return [...unlocked];
}

export function getSectName(sectId) {
  return SECT_DB[sectId]?.name || '未知门派';
}

export function getPetAwakeningTier(petUid, fusionState = {}) {
  return fusionState.awakeningTiers?.[petUid] || null;
}

export function checkAwakeningTier(pet, tierId, ctx = {}) {
  const { fusionState = {}, kingdomWar = {} } = ctx;
  const tier = AWAKENING_TIERS[tierId];
  if (!tier || !pet) return { ok: false, reason: '无效' };
  const cur = fusionState.awakeningTiers?.[pet.uid];
  if (tierId === 'normal') {
    if (pet.awakened) return { ok: false, reason: '已完成普通觉醒' };
    return baseCanAwakenPet(pet);
  }
  if (tierId === 'fruit') {
    if (cur === 'fruit' || cur === 'strategic') return { ok: false, reason: '已完成果实觉醒' };
    if (!pet.awakened) return { ok: false, reason: '需先普通觉醒' };
    const reqs = [];
    if (!pet.devilFruit) reqs.push('绑定恶魔果实');
    if (!(fusionState.fruitTrialsCleared || []).length) reqs.push('完成任意果实海域试炼');
    if ((pet.fruitUseCount || 0) < 1) reqs.push('至少使用过1次恶魔果实变身');
    return reqs.length ? { ok: false, reason: `还需：${reqs.join('、')}` } : { ok: true };
  }
  if (tierId === 'strategic') {
    if (cur === 'strategic') return { ok: false, reason: '已完成战略觉醒' };
    if (cur !== 'fruit') return { ok: false, reason: '需先果实觉醒' };
    const reqs = [];
    if (!pet.sectId) reqs.push('加入门派');
    if ((pet.sectLevel || 0) < 3) reqs.push('门派等级3+（共鸣条件）');
    if (!fusionState.generalTacticId) reqs.push('装备将魂战术');
    if ((kingdomWar?.warContribution || 0) < 500) reqs.push('国战贡献500+');
    if (!(fusionState.battlefieldsCleared || []).length) reqs.push('通关任意古战场');
    return reqs.length ? { ok: false, reason: `还需：${reqs.join('、')}` } : { ok: true };
  }
  return { ok: false, reason: '未知档位' };
}

export function getAvailableKwPveTasks(badgeCount, completedTaskLog = {}, currentTurn = 0, unlockedSystems = []) {
  return KINGDOM_PVE_TASKS.filter(task => {
    if (badgeCount < (task.reqBadges || 0)) return false;
    if (task.requiresUnlock && !unlockedSystems.includes(task.requiresUnlock)) return false;
    if (task.prereq?.length && !task.prereq.every(pid => completedTaskLog[pid])) return false;
    const lastDone = completedTaskLog[task.id];
    if (lastDone && task.cooldownTurns && (currentTurn - lastDone) < task.cooldownTurns) return false;
    return true;
  });
}

export function canAffordKwTask(task, playerResources = {}) {
  if (!task?.cost) return true;
  return Object.entries(task.cost).every(([k, v]) => (playerResources[k] || 0) >= v);
}

export function canApplyPolicy(policyId, activePolicies = []) {
  const policy = NATION_POLICIES[policyId];
  if (!policy) return { ok: false, reason: '无效政策' };
  if (activePolicies.includes(policyId)) return { ok: false, reason: '已激活' };
  const conflicts = policy.conflicts || [];
  const blocked = conflicts.filter(c => activePolicies.includes(c));
  if (blocked.length) {
    const names = blocked.map(c => NATION_POLICIES[c]?.name || c).join('、');
    return { ok: false, reason: `与「${names}」互斥` };
  }
  return { ok: true };
}
