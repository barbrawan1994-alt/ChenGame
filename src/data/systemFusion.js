/** v15.0 六系统融合 — 门派映射 / 觉醒三档 / 国战PVE / 解锁节奏 */

import { SECT_DB, SECT_COUNT } from './sects';
import { canAwakenPet as baseCanAwakenPet } from './resonance';

/** 30 武侠门派 → 生态 PVE 心法角色（映射方案，不替换现有门派战斗被动） */

export const SECT_ECO_ROLES = {
  1:  { ecoRole: 'burst',    label: '爆发清障', desc: '快速焚烧/压制污染，生态恢复较慢', branches: ['fight'], ecoDelta: { pollution: -15, vegetation: -3 } },
  2:  { ecoRole: 'defense',  label: '筑城防守', desc: '国战防守、地形建设、矿洞探索', branches: ['relocate'], ecoDelta: { stability: 15 } },
  3:  { ecoRole: 'mobility', label: '机动侦查', desc: '潜入、双线、逃脱战优势', branches: ['soothe'], ecoDelta: { diversity: 10 } },
  4:  { ecoRole: 'burst',    label: '精准破防', desc: 'Boss 破防、精英压制', branches: ['fight'], ecoDelta: { stability: 10 } },
  5:  { ecoRole: 'heal',     label: '生态修复', desc: '净化、治疗、安抚植物精灵', branches: ['heal', 'soothe'], ecoDelta: { vegetation: 15, pollution: -12 } },
  6:  { ecoRole: 'burst',    label: '火焰控制', desc: '清理藤蔓/污染，需控制强度', branches: ['fight'], ecoDelta: { pollution: -12, vegetation: -5 } },
  7:  { ecoRole: 'control',  label: '冰封净化', desc: '冻结污染源、湖泊探索', branches: ['heal'], ecoDelta: { water: 12, pollution: -8 } },
  8:  { ecoRole: 'control',  label: '毒素分析', desc: '识别污染根源、暗线任务', branches: ['soothe'], ecoDelta: { pollution: -10 } },
  9:  { ecoRole: 'defense',  label: '组织防线', desc: '护送、据点保护、NPC 防线', branches: ['relocate'], ecoDelta: { stability: 12 } },
  10: { ecoRole: 'puzzle',   label: '机关解谜', desc: '古代遗迹、机械精灵、根系分析', branches: ['heal'], ecoDelta: { spirit: 8, stability: 8 } },
  11: { ecoRole: 'control',  label: '元素联动', desc: '阵法、控制、元素机关', branches: ['heal', 'soothe'], ecoDelta: { spirit: 10 } },
  12: { ecoRole: 'balance',  label: '调和双方', desc: '调停冲突、资源交换', branches: ['soothe', 'relocate'], ecoDelta: { stability: 14, diversity: 6 } },
  13: { ecoRole: 'burst',    label: '连击清障', desc: '快速多段输出压制污染精灵', branches: ['fight'], ecoDelta: { pollution: -10, stability: 4 } },
  14: { ecoRole: 'burst',    label: '破甲攻坚', desc: 'Boss破防、高防目标压制', branches: ['fight'], ecoDelta: { stability: 6 } },
  15: { ecoRole: 'sustain',  label: '嗜血续航', desc: '持久战、吸血维持战线', branches: ['fight'], ecoDelta: { stability: -3 } },
  16: { ecoRole: 'burst',    label: '双态奇袭', desc: '节奏型爆发，风险与收益并存', branches: ['fight'], ecoDelta: { spirit: 6 } },
  17: { ecoRole: 'defense',  label: '屏障守城', desc: '护盾防守、边境据点保护', branches: ['relocate'], ecoDelta: { stability: 12 } },
  18: { ecoRole: 'counter',  label: '反击诱敌', desc: '防守反击、诱敌深入', branches: ['soothe'], ecoDelta: { stability: 8 } },
  19: { ecoRole: 'balance',  label: '天龙均衡', desc: '全面发展、各类任务皆可', branches: ['heal', 'soothe'], ecoDelta: { diversity: 8, stability: 6 } },
  20: { ecoRole: 'burst',    label: '背水死战', desc: '低血爆发、险境翻盘', branches: ['fight'], ecoDelta: { stability: -5 } },
  21: { ecoRole: 'control',  label: '雷法控场', desc: '麻痹控场、限制敌方行动', branches: ['heal'], ecoDelta: { pollution: -6 } },
  22: { ecoRole: 'control',  label: '星宿削弱', desc: '持续弱化、消耗战优势', branches: ['soothe'], ecoDelta: { pollution: -8 } },
  23: { ecoRole: 'control',  label: '灵鹫威压', desc: '削弱攻击、保护队友', branches: ['soothe'], ecoDelta: { spirit: 8 } },
  24: { ecoRole: 'control',  label: '泰山重压', desc: '降速压制、控速先手', branches: ['fight'], ecoDelta: { stability: 5 } },
  25: { ecoRole: 'burst',    label: '点苍精准', desc: '高命中狙击、PVP优势', branches: ['fight'], ecoDelta: { stability: 4 } },
  26: { ecoRole: 'synergy',  label: '衡山同门', desc: '同门派协同、团队增益', branches: ['relocate'], ecoDelta: { stability: 10, diversity: 4 } },
  27: { ecoRole: 'weather',  label: '雪山天时', desc: '依赖天气加成、雪天优势', branches: ['heal'], ecoDelta: { water: 8, pollution: -6 } },
  28: { ecoRole: 'burst',    label: '青城先手', desc: '首回合爆发、速攻战术', branches: ['fight'], ecoDelta: { stability: 4 } },
  29: { ecoRole: 'defense',  label: '嵩山铁壁', desc: '濒死护命、高风险防守', branches: ['relocate'], ecoDelta: { stability: 12 } },
  30: { ecoRole: 'burst',    label: '神霄雷罚', desc: '百分比真伤、高HP目标', branches: ['fight'], ecoDelta: { spirit: 6, pollution: -4 } },
};

/** 忍术 × 精灵属性联携（PVE 效率加成，非战斗数值膨胀）
 *  jutsuElement 使用 CHAKRA_NATURE_MAP 映射后的 gameType（FIRE/WATER/ELECTRIC/WIND/GROUND）*/
export const JUTSU_PET_SYNERGY = [
  { jutsuElement: 'WATER', petTypes: ['WATER', 'ELECTRIC'], effect: 'conductive_field', label: '导电水域', desc: '净化战进度 +10%', purifyBonus: 10 },
  { jutsuElement: 'FIRE', petTypes: ['FIRE', 'FLYING'], effect: 'fire_vortex', label: '火焰旋风', desc: '群怪战效率提升', captureBonus: 0.08 },
  { jutsuElement: 'GROUND', petTypes: ['GROUND', 'ROCK', 'GRASS'], effect: 'forest_wall', label: '森林壁垒', desc: '守护战目标 HP +10%', protectBonus: 0.10 },
  { jutsuElement: 'ELECTRIC', petTypes: ['ELECTRIC', 'STEEL'], effect: 'purify_seal', label: '净化封印', desc: '净化战每回合额外 -6%', purifyBonus: 6 },
  { jutsuElement: 'GROUND', petTypes: ['DARK', 'GHOST', 'GROUND'], effect: 'shadow_lure', label: '影分身诱敌', desc: '活捕战容错 +1 次失误', captureBonus: 0.10 },
  { jutsuElement: 'WATER', petTypes: ['ICE', 'WATER'], effect: 'frozen_path', label: '冰封路径', desc: '逃脱战所需回合 -1', escapeTurnReduce: 1 },
  { jutsuElement: 'WIND', petTypes: ['FLYING', 'BUG'], effect: 'scout_wind', label: '感知侦查', desc: '跳过一个探索步骤', skipExploreStep: true },
  { jutsuElement: 'FIRE', petTypes: ['TIME', 'COSMIC'], effect: 'time_blaze', label: '时空燃烧', desc: '净化战效率 +8%，时空系回合加速', purifyBonus: 8 },
  { jutsuElement: 'WIND', petTypes: ['CHAOS', 'DARK'], effect: 'chaos_gale', label: '混沌风暴', desc: '群怪战混沌属性伤害 +15%', captureBonus: 0.08 },
  { jutsuElement: 'ELECTRIC', petTypes: ['TIME', 'ELECTRIC'], effect: 'chrono_bolt', label: '时空雷鸣', desc: '净化战每回合额外 -7%', purifyBonus: 7 },
];

/** 恶魔果实 PVE 限制与生态型分类 */
export const FRUIT_PVE_RULES = {
  maxPerPet: 1,
  overuseFatigue: 15,
  waterRestrictedCategories: ['LOGIA'],
  waterRestrictedTypes: ['FIRE', 'GROUND'],
  sealSuppressesTurns: 2,
  maxFatiguePerBattle: 45,
  ecoTypes: {
    element: { label: '元素型', maps: ['fire', 'water', 'ice'], effect: 'terrain_change' },
    transform: { label: '变身型', maps: ['cave', 'sky'], effect: 'form_shift' },
    rule: { label: '规则型', maps: ['ghost', 'space'], effect: 'rule_break' },
    eco: { label: '生态型', maps: ['grass', 'forest', 'swamp'], effect: 'eco_boost' },
  },
};

/** 觉醒三档 — 总叠乘上限参见 resonance.js MAX_COMBINED_STAT_MULT (1.25) */
export const AWAKENING_TIERS = {
  normal: {
    id: 'normal', name: '普通觉醒', icon: '🌟',
    requirements: { minLevel: 100, minIntimacy: 200, minTotalEv: 400, needsDevilFruitOrSectOrJutsu: true, needsSkillInherit: true },
    rewards: { statMult: 1.10, unlockAwakeningMove: true, prefix: '🌟' },
  },
  fruit: {
    id: 'fruit', name: '恶魔果实觉醒', icon: '🍎',
    requirements: { needsNormalAwaken: true, needsDevilFruit: true, fruitTrialClear: true, pveFruitUse: 1 },
    rewards: { statMult: 1.05, fruitDurationBonus: 1, mapEcoBonus: { vegetation: 5 }, unlockExpeditionBlessing: true, prefix: '🍎🌟' },
  },
  strategic: {
    id: 'strategic', name: '战略觉醒', icon: '⚔️',
    requirements: { needsFruitAwaken: true, needsSectResonance: true, needsGeneralTactic: true, kwContribMin: 500, needsBattlefieldClear: true },
    rewards: { statMult: 1.05, kwContribMult: 1.1, sanctuaryBonus: 0.05, title: '战略觉醒者', prefix: '⚔️🍎🌟' },
  },
};

/** 轻量将魂 — PVE 战术（不改战斗属性） */
export const GENERAL_PVE_TACTICS = {
  zhuge_liang: {
    generalId: 'zhuge_liang', name: '诸葛亮', icon: '🧠', role: 'strategist',
    passive: { label: '军策·元素联动', desc: '净化+8%，守护+8%', purifyBonus: 8, protectBonus: 0.08 },
    order: { label: '战令·八阵图', desc: '跳过一个解谜步骤', skipPuzzleStep: true },
    bestFor: ['净化', '守护', '机械首领'],
  },
  guan_yu: {
    generalId: 'guan_yu', name: '关羽', icon: '🐉', role: 'warlord',
    passive: { label: '军策·破防', desc: 'Boss 战 bossMult -0.04', bossMultReduce: 0.04 },
    order: { label: '战令·斩将', desc: '活捕战进度 +8%', captureBonus: 0.08 },
    bestFor: ['首领', '活捕'],
  },
  zhao_yun: {
    generalId: 'zhao_yun', name: '赵云', icon: '🏇', role: 'cavalry',
    passive: { label: '军策·护主', desc: '守护战目标 HP +10%', protectBonus: 0.10 },
    order: { label: '战令·单骑救主', desc: '逃脱战回合 -1', escapeTurnReduce: 1 },
    bestFor: ['守护', '逃脱', '护送'],
  },
  zhou_yu: {
    generalId: 'zhou_yu', name: '周瑜', icon: '🔥', role: 'fire_strategist',
    passive: { label: '军策·火风联携', desc: '火/风系净化 +10%，Boss弱化3%', purifyBonus: 10, bossMultReduce: 0.03 },
    order: { label: '战令·赤壁火攻', desc: '群怪战伤害+15%', swarmDamageBonus: 0.15 },
    bestFor: ['战斗', '群战'],
    ecoPenalty: { vegetation: -4 },
  },
  hua_tuo: {
    generalId: 'hua_tuo', name: '华佗', icon: '💊', role: 'healer',
    passive: { label: '军策·青囊', desc: '结契/救助亲密度 +15', intimacyBonus: 15 },
    order: { label: '战令·急救', desc: '失败后重试一次非战斗步骤', retryNonCombat: true },
    bestFor: ['结契', '救援', '远征'],
  },
  lu_xun: {
    generalId: 'lu_xun', name: '陆逊', icon: '📜', role: 'strategist',
    passive: { label: '军策·火计', desc: '群怪战效率+10%，火系净化+8%', purifyBonus: 8, captureBonus: 0.1 },
    order: { label: '战令·连营', desc: '连续战斗步骤间不消耗PP', skipPPCost: true },
    bestFor: ['战斗', '群战', '火系'],
    ecoPenalty: { vegetation: -3 },
  },
  zhang_liao: {
    generalId: 'zhang_liao', name: '张辽', icon: '🐺', role: 'vanguard',
    passive: { label: '军策·威震', desc: '守护战目标HP+10%', protectBonus: 0.10 },
    order: { label: '战令·逍遥津', desc: '以少敌多时伤害+10%', eliteBonus: 0.10 },
    bestFor: ['守护', '防御', '以少敌多'],
  },
  cao_cao: {
    generalId: 'cao_cao', name: '曹操', icon: '👑', role: 'commander',
    passive: { label: '军策·挟天子', desc: '国战贡献+15%，Boss弱化3%', kwContribBonus: 0.15, bossMultReduce: 0.03 },
    order: { label: '战令·奇袭', desc: '首步骤战斗效率+20%', firstStepBonus: 0.2 },
    bestFor: ['国战', '资源', '统率'],
  },
  sima_yi: {
    generalId: 'sima_yi', name: '司马懿', icon: '🦊', role: 'grand_strategist',
    passive: { label: '军策·隐忍', desc: '守护战+12%，净化+6%', protectBonus: 0.12, purifyBonus: 6 },
    order: { label: '战令·空城应对', desc: '跳过一个解谜步骤', skipPuzzleStep: true },
    bestFor: ['守护', '解谜', '持久战'],
  },
  deng_ai: {
    generalId: 'deng_ai', name: '邓艾', icon: '⛰️', role: 'vanguard',
    passive: { label: '军策·偷渡', desc: '逃脱回合-1，活捕+10%', escapeTurnReduce: 1, captureBonus: 0.1 },
    order: { label: '战令·奇兵天降', desc: '跳过一个探索步骤', skipExploreStep: true },
    bestFor: ['逃脱', '捕获', '突袭'],
  },
  yang_hu: {
    generalId: 'yang_hu', name: '羊祜', icon: '🕊️', role: 'peacekeeper',
    passive: { label: '军策·德化', desc: '安抚/修复分支生态+25%', ecoBranchBonus: 0.25 },
    order: { label: '战令·仁政', desc: '非战斗步骤重试一次', retryNonCombat: true },
    bestFor: ['结契', '生态', '安抚'],
  },
  du_yu: {
    generalId: 'du_yu', name: '杜预', icon: '📖', role: 'scholar_general',
    passive: { label: '军策·破竹', desc: 'Boss弱化5%，净化+8%', bossMultReduce: 0.05, purifyBonus: 8 },
    order: { label: '战令·势如破竹', desc: '连续战斗后续伤害+10%', chainBattleBonus: 0.1 },
    bestFor: ['首领', '净化', '连续战'],
  },
  liu_bei: {
    generalId: 'liu_bei', name: '刘备', icon: '🤝', role: 'leader',
    passive: { label: '军策·仁德', desc: '结契亲密度+20，安抚成功率+10%', intimacyBonus: 20, captureBonus: 0.1 },
    order: { label: '战令·三顾', desc: '非战斗步骤效率+15%', nonCombatBonus: 0.15 },
    bestFor: ['结契', '安抚', '生态'],
  },
  lu_bu: {
    generalId: 'lu_bu', name: '吕布', icon: '🗡️', role: 'berserker',
    passive: { label: '军策·无双', desc: 'Boss弱化6%，但守护战-5%', bossMultReduce: 0.06, protectBonus: -0.05 },
    order: { label: '战令·方天画戟', desc: '首步骤Boss战伤害+20%', firstStepBonus: 0.20 },
    bestFor: ['首领', '爆发', '单挑'],
  },
  sun_ce: {
    generalId: 'sun_ce', name: '孙策', icon: '🦁', role: 'conqueror',
    passive: { label: '军策·江东', desc: '逃脱回合-1，群怪战+8%', escapeTurnReduce: 1, captureBonus: 0.08 },
    order: { label: '战令·小霸王', desc: '多目标战斗效率+12%', swarmDamageBonus: 0.12 },
    bestFor: ['逃脱', '群战', '速攻'],
  },
  pang_tong: {
    generalId: 'pang_tong', name: '庞统', icon: '🪶', role: 'scheme_master',
    passive: { label: '军策·连环', desc: '解谜跳过一次，Boss弱化2%，净化+6', bossMultReduce: 0.02, skipPuzzleStep: true, purifyBonus: 6 },
    order: { label: '战令·连环计', desc: '机关/封印战效率+10%', sealBonus: 0.10 },
    bestFor: ['解谜', '封印', '机关'],
  },
  huang_yueying: {
    generalId: 'huang_yueying', name: '黄月英', icon: '⚙️', role: 'engineer',
    passive: { label: '军策·机巧', desc: '净化+7%，守护+6%', purifyBonus: 7, protectBonus: 0.06 },
    order: { label: '战令·木牛流马', desc: '探索步骤可跳过一次', skipExploreStep: true },
    bestFor: ['遗迹', '机关', '守护'],
  },
  gan_ning: {
    generalId: 'gan_ning', name: '甘宁', icon: '🛶', role: 'raider',
    passive: { label: '军策·锦帆', desc: '逃脱回合-1，捕获+8%', escapeTurnReduce: 1, captureBonus: 0.08 },
    order: { label: '战令·夜袭', desc: '首步骤战斗效率+15%', firstStepBonus: 0.15 },
    bestFor: ['突袭', '海域', '逃脱'],
  },
  diao_chan: {
    generalId: 'diao_chan', name: '貂蝉', icon: '🎐', role: 'controller',
    passive: { label: '军策·离间', desc: '捕获+10%，Boss弱化2%', captureBonus: 0.1, bossMultReduce: 0.02 },
    order: { label: '战令·扰阵', desc: '多目标战斗效率+10%', swarmDamageBonus: 0.1 },
    bestFor: ['控制', '捕获', '群战'],
  },
  ma_chao: {
    generalId: 'ma_chao', name: '马超', icon: '🐎', role: 'shock_cavalry',
    passive: { label: '军策·铁骑', desc: 'Boss弱化4%，逃脱回合-1', bossMultReduce: 0.04, escapeTurnReduce: 1 },
    order: { label: '战令·突阵', desc: '首步骤Boss战效率+18%', firstStepBonus: 0.18 },
    bestFor: ['突袭', '首领', '速攻'],
  },
  sun_quan: {
    generalId: 'sun_quan', name: '孙权', icon: '🌊', role: 'administrator',
    passive: { label: '军策·制衡', desc: '守护+8%，净化+4%', protectBonus: 0.08, purifyBonus: 4 },
    order: { label: '战令·江表', desc: '非战斗步骤效率+12%', nonCombatBonus: 0.12 },
    bestFor: ['守护', '后勤', '均衡'],
  },
};

/** 国战 PVE 任务 — 影响国家指标（有上限，防膨胀） */
export const KINGDOM_PVE_TASKS = [
  { id: 'kw_escort_grain', name: '护送粮草', icon: '🌾', reqBadges: 5, cooldownTurns: 3, cost: { energy: 10 }, reward: { kwManpower: 15, gold: 1500 }, ecoCost: null },
  { id: 'kw_purify_border', name: '净化边境', icon: '💧', reqBadges: 5, cooldownTurns: 2, cost: { energy: 10 }, reward: { guardianScore: 4, kwContrib: 25 }, ecoDelta: { pollution: -8 } },
  { id: 'kw_repair_wall', name: '修复城墙', icon: '🧱', reqBadges: 6, cooldownTurns: 4, cost: { gold: 2000, energy: 10 }, reward: { kwContrib: 40, gold: 3500 }, territoryStrength: 2 },
  { id: 'kw_repel_rampage', name: '击退暴走潮', icon: '⚔️', reqBadges: 5, cooldownTurns: 3, cost: { energy: 15 }, reward: { kwContrib: 35, guardianScore: 6 }, ecoDelta: { stability: 8 } },
  { id: 'kw_field_hospital', name: '战场救护', icon: '💊', reqBadges: 5, cooldownTurns: 3, cost: { energy: 10 }, reward: { kwContrib: 30, gold: 2000, generalFragment: 'hua_tuo' }, ecoDelta: { stability: 4 } },
  { id: 'kw_build_sanctuary', name: '建设圣域', icon: '⛩️', reqBadges: 7, cooldownTurns: 6, cost: { gold: 5000, energy: 20 }, reward: { kwContrib: 50, gold: 2500, guardianScore: 10 }, requiresSanctuaryLv: 2, prereq: ['kw_purify_border'] },
  { id: 'kw_reclaim_mine', name: '夺回矿场', icon: '⛏️', reqBadges: 6, cooldownTurns: 4, cost: { energy: 20 }, reward: { kwContrib: 60, gold: 5000 }, requiresCrisis: 'crisis_canyon_mine', prereq: ['kw_repair_wall'] },
  { id: 'kw_night_patrol', name: '边境夜巡', icon: '🌙', reqBadges: 8, cooldownTurns: 3, cost: { energy: 15 }, reward: { kwContrib: 50, guardianScore: 8, gold: 4000 }, requiresUnlock: 'kw_night_patrol', ecoDelta: { stability: 6 } },
  { id: 'kw_seal_guardian', name: '封印守护', icon: '⛩️', reqBadges: 9, cooldownTurns: 8, cost: { energy: 30, gold: 5000 }, reward: { kwContrib: 80, guardianScore: 12, gold: 7000 }, requiresUnlock: 'kw_seal_guardian', ecoDelta: { spirit: 8, stability: 10 }, prereq: ['kw_night_patrol'] },
  { id: 'kw_jin_unify', name: '一统之路', icon: '🐉', reqBadges: 10, cooldownTurns: 10, cost: { energy: 30, gold: 8000 }, reward: { kwContrib: 100, gold: 8000, generalFragment: 'sima_yi' }, ecoDelta: { stability: 10, spirit: 6 }, prereq: ['kw_seal_guardian', 'kw_reclaim_mine'] },
];

/** 国家政策（占领区域后可选，PVE 行为影响，conflicts 互斥） */
export const NATION_POLICIES = {
  military: { name: '军事开发', icon: '⚔️', bonus: { kwManpower: 12 }, penalty: { pollution: 6 }, conflicts: ['eco', 'sanctuary'], desc: '军备提升快，生态下降' },
  eco: { name: '生态保护', icon: '🌿', bonus: { shinyRate: 0.03 }, penalty: { goldMult: 0.92 }, conflicts: ['military', 'relic'], desc: '稀有精灵率提升，资源较慢' },
  trade: { name: '商业贸易', icon: '💰', bonus: { goldMult: 1.12 }, penalty: { stability: -4 }, conflicts: [], desc: '金币增加，易引黑市' },
  relic: { name: '古迹研究', icon: '🏛️', bonus: { spirit: 8 }, penalty: { pollution: 4 }, conflicts: ['eco'], desc: '遗迹开放，机械灵灾略增' },
  sect: { name: '门派共治', icon: '📜', bonus: { sectEffectMult: 1.06 }, penalty: {}, conflicts: [], desc: '门派贡献提升，效果平均' },
  sanctuary: { name: '精灵圣域', icon: '⛩️', bonus: { ecoStability: 12 }, penalty: { goldCost: 1.15 }, conflicts: ['military'], desc: '生态稳定，建设成本高' },
};

/** 系统解锁节奏（按徽章递增，与 gameGuide 中的解锁路线图一致） */
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
  if (!sectId || sectId < 1 || sectId > SECT_COUNT) return null;
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
  const scoreSynergy = (s) => (s.purifyBonus || 0) + (s.captureBonus || 0) * 50 + (s.protectBonus || 0) * 50 + (s.escapeTurnReduce || 0) * 5 + (s.skipExploreStep ? 8 : 0);
  let best = null;
  for (const syn of synergies) {
    if (syn.petTypes.some(t => partyTypes.has(t))) {
      if (!best || scoreSynergy(syn) > scoreSynergy(best)) best = syn;
    }
  }
  return best;
}

export function getGeneralTactic(generalId) {
  return GENERAL_PVE_TACTICS[generalId] || null;
}

export function calcFusionPveBonuses(ctx = {}) {
  const bonuses = { purifyBonus: 0, protectBonus: 0, captureBonus: 0, escapeTurnReduce: 0, bossMultReduce: 0, skipPuzzleStep: false, skipExploreStep: false, exploreSpeedBonus: 0, puzzleHintBonus: false, intimacyBonus: 0, kwContribBonus: 0, ecoBranchBonus: 0, ecoPenalty: null, swarmDamageBonus: 0, firstStepBonus: 0, sealBonus: 0 };
  if (ctx.sectId) {
    const role = getSectEcoRole(ctx.sectId);
    if (role?.ecoRole === 'heal') bonuses.purifyBonus += 6;
    else if (role?.ecoRole === 'defense') bonuses.protectBonus += 0.08;
    else if (role?.ecoRole === 'burst') bonuses.bossMultReduce += 0.03;
    else if (role?.ecoRole === 'control') bonuses.captureBonus += 0.06;
    else if (role?.ecoRole === 'mobility') { bonuses.escapeTurnReduce += 1; bonuses.exploreSpeedBonus += 0.15; }
    else if (role?.ecoRole === 'puzzle') { bonuses.skipPuzzleStep = true; bonuses.puzzleHintBonus = true; }
    else if (role?.ecoRole === 'balance') { bonuses.purifyBonus += 3; bonuses.protectBonus += 0.04; }
    else if (role?.ecoRole === 'synergy') { bonuses.protectBonus += 0.05; bonuses.bossMultReduce += 0.02; }
    else if (role?.ecoRole === 'weather') bonuses.purifyBonus += 5;
    else if (role?.ecoRole === 'counter') { bonuses.protectBonus += 0.06; bonuses.bossMultReduce += 0.02; }
    else if (role?.ecoRole === 'sustain') { bonuses.captureBonus += 0.04; bonuses.protectBonus += 0.04; }
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
      if (gt.passive.skipExploreStep) bonuses.skipExploreStep = true;
      if (gt.passive.intimacyBonus) bonuses.intimacyBonus += gt.passive.intimacyBonus;
      if (gt.passive.kwContribBonus) bonuses.kwContribBonus += gt.passive.kwContribBonus;
      if (gt.passive.ecoBranchBonus) bonuses.ecoBranchBonus += gt.passive.ecoBranchBonus;
    }
    if (gt?.order) {
      if (gt.order.swarmDamageBonus) bonuses.swarmDamageBonus += gt.order.swarmDamageBonus;
      if (gt.order.firstStepBonus) bonuses.firstStepBonus += gt.order.firstStepBonus;
      if (gt.order.sealBonus) bonuses.sealBonus += gt.order.sealBonus;
      if (gt.order.skipPuzzleStep) bonuses.skipPuzzleStep = true;
      if (gt.order.skipExploreStep) bonuses.skipExploreStep = true;
    }
    if (gt?.ecoPenalty) {
      if (bonuses.ecoPenalty) {
        const merged = { ...bonuses.ecoPenalty };
        Object.entries(gt.ecoPenalty).forEach(([k, v]) => { merged[k] = (merged[k] || 0) + v; });
        bonuses.ecoPenalty = merged;
      } else bonuses.ecoPenalty = gt.ecoPenalty;
    }
  }
  if (ctx.jutsuSynergy) {
    bonuses.purifyBonus += ctx.jutsuSynergy.purifyBonus || 0;
    bonuses.protectBonus += ctx.jutsuSynergy.protectBonus || 0;
    bonuses.captureBonus += ctx.jutsuSynergy.captureBonus || 0;
    bonuses.escapeTurnReduce += ctx.jutsuSynergy.escapeTurnReduce || 0;
    if (ctx.jutsuSynergy.skipExploreStep) bonuses.skipExploreStep = true;
  }
  bonuses.purifyBonus = Math.min(25, bonuses.purifyBonus);
  bonuses.protectBonus = Math.max(-0.1, Math.min(0.35, bonuses.protectBonus));
  bonuses.captureBonus = Math.min(0.18, bonuses.captureBonus);
  bonuses.bossMultReduce = Math.min(0.08, bonuses.bossMultReduce);
  bonuses.escapeTurnReduce = Math.min(2, bonuses.escapeTurnReduce);
  bonuses.exploreSpeedBonus = Math.min(0.5, bonuses.exploreSpeedBonus);
  bonuses.swarmDamageBonus = Math.min(0.25, bonuses.swarmDamageBonus);
  bonuses.firstStepBonus = Math.min(0.25, bonuses.firstStepBonus);
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

export function getAwakeningStatMult(petUid, fusionState = {}) {
  const tierId = fusionState.awakeningTiers?.[petUid];
  if (!tierId) return 1;
  let mult = 1;
  if (['normal', 'fruit', 'strategic'].includes(tierId)) mult *= AWAKENING_TIERS.normal.rewards.statMult;
  if (['fruit', 'strategic'].includes(tierId)) mult *= AWAKENING_TIERS.fruit.rewards.statMult;
  if (tierId === 'strategic') mult *= AWAKENING_TIERS.strategic.rewards.statMult;
  return Math.min(1.25, mult);
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
    if (cur !== 'normal' && cur !== undefined) return { ok: false, reason: '需先完成普通觉醒注册' };
    const reqs = [];
    if (!pet.devilFruit) reqs.push('绑定恶魔果实');
    const trialsCleared = fusionState.fruitTrialsCleared || [];
    if (!Array.isArray(trialsCleared) || trialsCleared.length === 0) reqs.push('完成任意果实海域试炼');
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

export function getAvailableKwPveTasks(badgeCount, completedTaskLog = {}, currentTurn = 0, crisisUnlocks = []) {
  return KINGDOM_PVE_TASKS.filter(task => {
    if (badgeCount < (task.reqBadges || 0)) return false;
    if (task.requiresUnlock && !crisisUnlocks.includes(task.requiresUnlock)) return false;
    if (task.requiresCrisis && !crisisUnlocks.includes(task.requiresCrisis)) return false;
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
