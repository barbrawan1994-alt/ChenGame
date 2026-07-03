// ==========================================
// 单人四国国战模拟系统
// 帮派经营 + AI四国战争 + 城池管理 + 剧本结局
// ==========================================

// ===== 一、国家变量系统 =====

export const NATION_STATS_DEFAULT = {
  military: 50,    // 军备 — 影响进攻
  grain: 50,       // 粮草 — 影响行动次数
  morale: 50,      // 民心 — 影响城池稳定和防守
  ecology: 50,     // 生态 — 影响精灵刷新和灵灾
  spirit: 50,      // 灵气 — 影响高级精灵和圣域
  intel: 50,       // 情报 — 影响侦查/渗透/预判
  tech: 50,        // 科技 — 影响器械/遗迹/研究
  warMorale: 50,   // 士气 — 影响战役自动结算
  fortune: 50,     // 国运 — 赛季总评分
  fatigue: 0,      // 疲劳 — 连续作战后战力下降
};

export const NATION_STYLE_BONUS = {
  wei: { military: 12, tech: 8, grain: 5, warMorale: 5 },
  shu: { ecology: 12, morale: 12, spirit: 8, grain: 3 },
  wu:  { grain: 8, intel: 8, warMorale: 8, fortune: 8 },
  jin: { intel: 12, tech: 10, fortune: 8, morale: 5 },
};

// ===== 二、AI国家战略 =====

export const AI_FACTION_STRATEGY = {
  wei: {
    name: '魏国战略',
    priority: 'mine',
    style: 'aggressive',
    targetPref: 'weakest',
    attackFreq: 0.55,
    defendFreq: 0.5,
    specialAction: 'siege_engine',
    desc: '正面强攻，军备碾压，优先攻占矿场',
  },
  shu: {
    name: '蜀国战略',
    priority: 'sanctuary',
    style: 'defensive',
    targetPref: 'border',
    attackFreq: 0.4,
    defendFreq: 0.8,
    specialAction: 'eco_restore',
    desc: '防守反击，生态优先，稳固关隘再出击',
  },
  wu: {
    name: '吴国战略',
    priority: 'port',
    style: 'mobile',
    targetPref: 'trade_route',
    attackFreq: 0.55,
    defendFreq: 0.5,
    specialAction: 'raid',
    desc: '游击突袭，控制港口和贸易路线',
  },
  jin: {
    name: '晋国战略',
    priority: 'relic',
    style: 'infiltrate',
    targetPref: 'high_intel',
    attackFreq: 0.5,
    defendFreq: 0.6,
    specialAction: 'infiltrate',
    desc: '渗透瓦解，先情报后进攻，后期统一',
  },
};

// ===== 三、城池类型与管理 =====

export const CITY_TYPES = {
  capital: { name: '主城', icon: '🏯', baseIncome: 500, baseDefense: 80, canCapture: false },
  city:    { name: '郡城', icon: '🏰', baseIncome: 300, baseDefense: 60, canCapture: true },
  town:    { name: '县城', icon: '🏘️', baseIncome: 150, baseDefense: 40, canCapture: true },
  pass:    { name: '关隘', icon: '⛩️', baseIncome: 80,  baseDefense: 70, canCapture: true },
  port:    { name: '港口', icon: '⚓', baseIncome: 250, baseDefense: 35, canCapture: true },
  mine:    { name: '矿场', icon: '⛏️', baseIncome: 200, baseDefense: 30, canCapture: true },
  sanctuary: { name: '圣域', icon: '🌿', baseIncome: 120, baseDefense: 45, canCapture: true },
  relic:   { name: '遗迹', icon: '🏛️', baseIncome: 180, baseDefense: 50, canCapture: true },
  center:  { name: '洛都', icon: '👑', baseIncome: 600, baseDefense: 90, canCapture: true },
};

export const CITY_BUILDINGS = [
  { id: 'wall',       name: '加固城墙',    icon: '🧱', cost: 3000, effect: { defense: 10 }, maxLv: 5 },
  { id: 'granary',    name: '建设粮仓',    icon: '🌾', cost: 2500, effect: { grain: 8 }, maxLv: 5 },
  { id: 'sanctuary',  name: '修建圣域',    icon: '🌿', cost: 4000, effect: { ecology: 10, spirit: 5 }, maxLv: 3 },
  { id: 'market',     name: '建设商市',    icon: '🏪', cost: 3000, effect: { commerce: 12 }, maxLv: 5 },
  { id: 'arsenal',    name: '建设军械坊',  icon: '⚒️', cost: 4000, effect: { military: 10 }, maxLv: 4 },
  { id: 'jutsu_tower', name: '建设忍术塔', icon: '🗼', cost: 3500, effect: { spirit: 8 }, maxLv: 3 },
  { id: 'fruit_lab',  name: '果实研究所',  icon: '🧪', cost: 4500, effect: { tech: 10 }, maxLv: 3 },
  { id: 'intel_tower', name: '建设情报楼', icon: '🔭', cost: 3000, effect: { intel: 10 }, maxLv: 4 },
  { id: 'clinic',     name: '建设药庐',    icon: '💊', cost: 2000, effect: { morale: 8 }, maxLv: 4 },
];

export const CITY_EVENTS = [
  { id: 'grain_shortage', name: '粮草短缺', icon: '🌾', type: 'crisis',
    desc: '城池粮草不足，民心下降中', effect: { morale: -5, grain: -10 },
    resolve: { memberRole: 'logistics', turns: 2 }, reward: { morale: 8, grain: 15 } },
  { id: 'spirit_rampage', name: '精灵暴走', icon: '🐲', type: 'crisis',
    desc: '野生精灵失控，需要安抚', effect: { ecology: -8 },
    resolve: { memberRole: 'tamer', turns: 2 }, reward: { ecology: 12, spirit: 5 } },
  { id: 'black_market', name: '黑市渗透', icon: '🕵️', type: 'crisis',
    desc: '黑市势力渗透城池', effect: { security: -10, morale: -3 },
    resolve: { memberRole: 'intel', turns: 3 }, reward: { intel: 10, gold: 2000 } },
  { id: 'ghost_night', name: '鬼夜袭击', icon: '👻', type: 'crisis',
    desc: '鬼化敌人在夜间袭城', effect: { morale: -8, defense: -5 },
    resolve: { memberRole: 'combat', turns: 2 }, reward: { warMorale: 10, morale: 5 } },
  { id: 'wall_damage', name: '城墙损坏', icon: '🧱', type: 'crisis',
    desc: '城墙年久失修需要修复', effect: { defense: -15 },
    resolve: { memberRole: 'builder', turns: 3 }, reward: { defense: 20 } },
  { id: 'morale_drop', name: '民心下降', icon: '😟', type: 'crisis',
    desc: '连年战事导致百姓不安', effect: { morale: -12 },
    resolve: { memberRole: 'logistics', turns: 2 }, reward: { morale: 15, grain: 5 } },
  { id: 'fruit_outbreak', name: '果实暴走', icon: '🍎', type: 'crisis',
    desc: '恶魔果实能量失控', effect: { ecology: -10, morale: -5 },
    resolve: { memberRole: 'researcher', turns: 3 }, reward: { tech: 12, ecology: 8 } },
  { id: 'enemy_scout', name: '敌军侦查', icon: '🔍', type: 'crisis',
    desc: '发现敌国斥候在附近活动', effect: { intel: -5 },
    resolve: { memberRole: 'intel', turns: 1 }, reward: { intel: 8 } },
  { id: 'trade_boom', name: '贸易繁荣', icon: '💰', type: 'boon',
    desc: '商路畅通，贸易繁荣', effect: { commerce: 15 },
    duration: 3 },
  { id: 'spirit_blessing', name: '灵气涌动', icon: '✨', type: 'boon',
    desc: '圣域灵气充沛', effect: { spirit: 12, ecology: 8 },
    duration: 3 },
];

// ===== 四、帮派成员系统 =====

export const MEMBER_ROLES = {
  combat:     { name: '战斗成员', icon: '⚔️', desc: '参与战役、副本、据点战' },
  logistics:  { name: '后勤成员', icon: '📦', desc: '采集、生产、治疗、补给' },
  intel:      { name: '情报成员', icon: '🕵️', desc: '侦查、渗透、反间' },
  tamer:      { name: '御灵成员', icon: '🐾', desc: '精灵培养、安抚、圣域建设' },
  ninja:      { name: '忍术成员', icon: '🌀', desc: '封印、查克拉节点、潜入' },
  researcher: { name: '果实研究员', icon: '🧪', desc: '恶魔果实研究、残片解析' },
  scholar:    { name: '将魂学者', icon: '📜', desc: '四国名将碎片、古战场研究' },
  builder:    { name: '建设成员', icon: '🔨', desc: '修复城池、建设帮派建筑' },
};

export const MEMBER_QUALITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
export const MEMBER_QUALITY_NAMES = { common: '普通', uncommon: '优秀', rare: '精英', epic: '史诗', legendary: '传说' };
export const MEMBER_QUALITY_POWER = { common: 1, uncommon: 1.3, rare: 1.6, epic: 2.0, legendary: 2.5 };

export const generateMember = (faction, forcedRole = null) => {
  const roles = Object.keys(MEMBER_ROLES);
  const role = forcedRole || roles[Math.floor(Math.random() * roles.length)];
  const qualRoll = Math.random();
  const quality = qualRoll < 0.4 ? 'common' : qualRoll < 0.7 ? 'uncommon' : qualRoll < 0.88 ? 'rare' : qualRoll < 0.97 ? 'epic' : 'legendary';
  const basePower = 20 + Math.floor(Math.random() * 30);
  return {
    id: `mem_${Date.now()}_${Math.floor(Math.random() * 99999)}_${Math.random().toString(36).slice(2, 8)}`,
    name: null, // filled by caller from faction pool
    role,
    quality,
    loyalty: 60 + Math.floor(Math.random() * 30),
    power: Math.floor(basePower * MEMBER_QUALITY_POWER[quality]),
    fatigue: 0,
    assignment: null,
    level: 1 + Math.floor(Math.random() * 5),
  };
};

// ===== 五、派遣任务系统 =====

export const DISPATCH_MISSIONS = [
  { id: 'dm_mine',       name: '采集矿石', icon: '⛏️', role: 'logistics', duration: 3, reward: { gold: 1500, military: 3 }, desc: '获得矿石和机械材料' },
  { id: 'dm_repair',     name: '修复城池', icon: '🔨', role: 'builder',   duration: 4, reward: { cityDefense: 10, cityMorale: 5 }, desc: '提升城池防御和民心', requiresCity: true },
  { id: 'dm_scout',      name: '侦查敌军', icon: '🔭', role: 'intel',     duration: 2, reward: { intel: 8 }, desc: '获得敌国动向' },
  { id: 'dm_escort',     name: '护送粮草', icon: '🐫', role: 'logistics', duration: 3, reward: { grain: 10 }, desc: '提高所属国家粮草' },
  { id: 'dm_tame',       name: '安抚精灵', icon: '🐾', role: 'tamer',     duration: 3, reward: { ecology: 8, spirit: 5 }, desc: '提高生态和精灵信任' },
  { id: 'dm_purify',     name: '清理灵灾', icon: '💫', role: 'combat',    duration: 4, reward: { ecology: 12, warMorale: 5 }, desc: '降低区域危险' },
  { id: 'dm_explore',    name: '探索遗迹', icon: '🏛️', role: 'scholar',   duration: 5, reward: { tech: 10, gold: 2000 }, desc: '获得将魂、果实、忍术材料' },
  { id: 'dm_infiltrate', name: '渗透敌城', icon: '🌙', role: 'intel',     duration: 5, reward: { enemyDefense: -8, enemyMorale: -5 }, desc: '降低敌城防御或民心', requiresTarget: true },
  { id: 'dm_defend',     name: '防守据点', icon: '🛡️', role: 'combat',    duration: 3, reward: { cityDefense: 8, warMorale: 3 }, desc: '降低据点丢失概率', requiresCity: true },
  { id: 'dm_research',   name: '果实研究', icon: '🧪', role: 'researcher', duration: 4, reward: { tech: 12 }, desc: '推进恶魔果实研究' },
  { id: 'dm_seal',       name: '封印作业', icon: '🌀', role: 'ninja',     duration: 4, reward: { spirit: 10, ecology: 5 }, desc: '封印危险节点' },
  { id: 'dm_train',      name: '战斗训练', icon: '💪', role: 'combat',    duration: 2, reward: { memberPower: 5 }, desc: '提升成员战斗力' },
];

// ===== 六、帮派驻地建筑 =====

export const HQ_BUILDINGS = [
  { id: 'hq_hall',       name: '帮派大厅',    icon: '🏛️', cost: 0,     maxLv: 10, effect: { memberCap: 2 }, desc: '帮派等级、成员管理' },
  { id: 'hq_sanctuary',  name: '精灵圣域',    icon: '🌿', cost: 5000,  maxLv: 5,  effect: { ecology: 5, spirit: 3 }, desc: '培养精灵、提升生态收益' },
  { id: 'hq_dojo',       name: '练武场',      icon: '🥋', cost: 4000,  maxLv: 5,  effect: { memberPower: 3 }, desc: '提升成员战斗力' },
  { id: 'hq_jutsu',      name: '忍术堂',      icon: '🌀', cost: 5000,  maxLv: 3,  effect: { spirit: 5 }, desc: '研究忍术、封印术' },
  { id: 'hq_fruit_lab',  name: '恶魔果实研究所', icon: '🧪', cost: 6000, maxLv: 3, effect: { tech: 5 }, desc: '研究果实残片和觉醒' },
  { id: 'hq_shrine',     name: '将魂祠',      icon: '📜', cost: 5000,  maxLv: 3,  effect: { fortune: 3 }, desc: '培养四国名将将魂' },
  { id: 'hq_clinic',     name: '药庐',        icon: '💊', cost: 3000,  maxLv: 5,  effect: { fatigueReduce: 5 }, desc: '治疗成员和精灵' },
  { id: 'hq_intel',      name: '情报楼',      icon: '🔭', cost: 4000,  maxLv: 4,  effect: { intel: 5 }, desc: '侦查敌国和资源点' },
  { id: 'hq_arsenal',    name: '军械坊',      icon: '⚒️', cost: 5000,  maxLv: 4,  effect: { military: 5 }, desc: '生产攻城、防守器械' },
  { id: 'hq_warehouse',  name: '仓库',        icon: '📦', cost: 2000,  maxLv: 5,  effect: { resourceCap: 500 }, desc: '储存资源' },
  { id: 'hq_mission',    name: '任务厅',      icon: '📋', cost: 3000,  maxLv: 3,  effect: { dispatchSlot: 1 }, desc: '发布帮派派遣任务' },
];

// 国家专属建筑
export const FACTION_BUILDINGS = {
  wei: [
    { id: 'fb_mech_arsenal', name: '机关军械坊', icon: '⚙️', cost: 8000, maxLv: 3, effect: { military: 12, siegeBonus: 10 }, desc: '生产强力攻城器械' },
    { id: 'fb_mine_workshop', name: '矿脉工坊', icon: '⛏️', cost: 6000, maxLv: 3, effect: { gold: 300, military: 5 }, desc: '提升矿石产出' },
    { id: 'fb_mech_altar', name: '机械精灵台', icon: '🤖', cost: 7000, maxLv: 3, effect: { tech: 8, mechBonus: 10 }, desc: '强化机械精灵' },
    { id: 'fb_iron_camp', name: '铁甲营', icon: '🛡️', cost: 7000, maxLv: 3, effect: { defense: 10, military: 8 }, desc: '提升防御和正面战能力' },
  ],
  shu: [
    { id: 'fb_spirit_altar', name: '御灵圣坛', icon: '🐾', cost: 7000, maxLv: 3, effect: { spirit: 12, ecology: 8 }, desc: '提升精灵亲密度' },
    { id: 'fb_virtue_clinic', name: '仁德药庐', icon: '💚', cost: 5000, maxLv: 3, effect: { morale: 10, fatigueReduce: 8 }, desc: '提升治疗和复苏' },
    { id: 'fb_heart_shrine', name: '民心祠', icon: '❤️', cost: 6000, maxLv: 3, effect: { morale: 15 }, desc: '提升城池民心恢复' },
    { id: 'fb_guardian_nest', name: '守护精灵巢', icon: '🦅', cost: 8000, maxLv: 3, effect: { ecology: 12, defense: 8 }, desc: '强化帮派守护精灵' },
  ],
  wu: [
    { id: 'fb_shipyard', name: '水军船坞', icon: '🚢', cost: 7000, maxLv: 3, effect: { waterBonus: 15, military: 5 }, desc: '提升水域任务收益' },
    { id: 'fb_trade_dock', name: '商贸码头', icon: '⚓', cost: 6000, maxLv: 3, effect: { gold: 400, grain: 5 }, desc: '提升贸易和运输收益' },
    { id: 'fb_swift_camp', name: '疾行营', icon: '💨', cost: 5000, maxLv: 3, effect: { dispatchSpeed: 20 }, desc: '提升小队派遣速度' },
    { id: 'fb_scout_tower', name: '飞羽哨塔', icon: '🦅', cost: 6000, maxLv: 3, effect: { intel: 12, scoutRange: 2 }, desc: '提升侦查和预警能力' },
  ],
  jin: [
    { id: 'fb_scheme_hall', name: '权谋府', icon: '🎭', cost: 7000, maxLv: 3, effect: { intel: 15, infiltrateBonus: 10 }, desc: '解锁渗透和离间任务' },
    { id: 'fb_reform_hall', name: '新政厅', icon: '📋', cost: 6000, maxLv: 3, effect: { morale: 10, governBonus: 15 }, desc: '提升占城治理效率' },
    { id: 'fb_archive', name: '机密档案阁', icon: '📚', cost: 6000, maxLv: 3, effect: { intel: 12, tech: 5 }, desc: '提升情报获取能力' },
    { id: 'fb_relic_lab', name: '遗迹研究院', icon: '🔬', cost: 8000, maxLv: 3, effect: { tech: 15, fortune: 5 }, desc: '提升机械、恶魔果实、将魂研究收益' },
    { id: 'fb_counter_workshop', name: '反制工坊', icon: '🔧', cost: 7000, maxLv: 3, effect: { counterBonus: 12 }, desc: '制作反制敌国国策的道具' },
  ],
};

// ===== 七、帮派影响力等级 =====

export const INFLUENCE_LEVELS = [
  { id: 'unknown',       name: '无名帮派', minInfluence: 0,     icon: '👤', perk: '只能接基础任务', manageCities: 0 },
  { id: 'local',         name: '地方帮派', minInfluence: 50,    icon: '🏘️', perk: '可管理小资源点', manageCities: 1 },
  { id: 'district',      name: '郡内名门', minInfluence: 150,   icon: '🏰', perk: '可影响县城政策', manageCities: 2 },
  { id: 'minister',      name: '国家重臣', minInfluence: 350,   icon: '📜', perk: '可参与国家战略建议', manageCities: 3 },
  { id: 'guardian',      name: '镇国帮派', minInfluence: 1000,  icon: '🛡️', perk: '可管理郡城', manageCities: 4 },
  { id: 'pillar',        name: '一国柱石', minInfluence: 1800,  icon: '🏯', perk: '可决定关键战线', manageCities: 5 },
  { id: 'legendary',     name: '天下名帮', minInfluence: 3000,  icon: '👑', perk: '可影响最终统一结局', manageCities: 8 },
];

export const getInfluenceLevel = (influence) => {
  let level = INFLUENCE_LEVELS[0];
  for (const lv of INFLUENCE_LEVELS) {
    if (influence >= lv.minInfluence) level = lv;
  }
  return level;
};

// ===== 八、战役评级系统 =====

export const BATTLE_RATINGS = {
  S: { name: 'S', icon: '🏆', threshold: 0.88, cityBonus: 20, moraleBonus: 15, lootMult: 2.0, influenceGain: 30 },
  A: { name: 'A', icon: '⭐', threshold: 0.72, cityBonus: 12, moraleBonus: 10, lootMult: 1.5, influenceGain: 20 },
  B: { name: 'B', icon: '✓', threshold: 0.55, cityBonus: 6,  moraleBonus: 5,  lootMult: 1.2, influenceGain: 12 },
  C: { name: 'C', icon: '➖', threshold: 0.35, cityBonus: 2,  moraleBonus: 2,  lootMult: 1.0, influenceGain: 6 },
  F: { name: '失败', icon: '✗', threshold: 0,  cityBonus: -5, moraleBonus: -5, lootMult: 0.3, influenceGain: 0 },
};

export const calcBattleRating = (result) => {
  const { hpPercent = 1, turnsUsed = 10, maxTurns = 20, allSurvived = false, bossKilled = true } = result;
  let score = 0;
  score += Math.min(1, hpPercent) * 40;
  score += Math.max(0, (1 - turnsUsed / maxTurns)) * 30;
  if (allSurvived) score += 15;
  if (bossKilled) score += 15;
  const pct = score / 100;
  if (pct >= BATTLE_RATINGS.S.threshold) return 'S';
  if (pct >= BATTLE_RATINGS.A.threshold) return 'A';
  if (pct >= BATTLE_RATINGS.B.threshold) return 'B';
  if (pct >= BATTLE_RATINGS.C.threshold) return 'C';
  return 'F';
};

// ===== 九、国战地图节点 =====

export const WAR_MAP_NODES = {
  // 4主城
  201: { name: '许昌', type: 'capital', faction: 'wei', position: { x: 70, y: 25 } },
  202: { name: '成都', type: 'capital', faction: 'shu', position: { x: 20, y: 55 } },
  203: { name: '建业', type: 'capital', faction: 'wu', position: { x: 80, y: 65 } },
  207: { name: '洛阳', type: 'capital', faction: 'jin', position: { x: 50, y: 20 } },
  // 中央
  208: { name: '洛都', type: 'center', faction: 'neutral', position: { x: 50, y: 40 } },
  // 8郡城
  1:  { name: '青藤林城', type: 'sanctuary', faction: 'shu', position: { x: 25, y: 40 } },
  2:  { name: '岩晶山城', type: 'mine', faction: 'jin', position: { x: 55, y: 30 } },
  3:  { name: '寒霜谷城', type: 'town', faction: 'jin', position: { x: 40, y: 15 } },
  4:  { name: '雾月湖城', type: 'port', faction: 'wu', position: { x: 75, y: 50 } },
  5:  { name: '赤砂峡城', type: 'mine', faction: 'wei', position: { x: 60, y: 40 } },
  6:  { name: '幽暗森城', type: 'sanctuary', faction: 'shu', position: { x: 15, y: 65 } },
  7:  { name: '雷鸣原城', type: 'town', faction: 'wu', position: { x: 85, y: 45 } },
  8:  { name: '珊瑚湾城', type: 'port', faction: 'wu', position: { x: 90, y: 70 } },
  // 8资源点
  9:  { name: '熔岩矿谷', type: 'mine', faction: 'neutral', position: { x: 45, y: 50 } },
  10: { name: '铁壁关', type: 'pass', faction: 'wei', position: { x: 65, y: 30 } },
  11: { name: '翡翠圣域', type: 'sanctuary', faction: 'shu', position: { x: 30, y: 70 } },
  12: { name: '星辰遗迹', type: 'relic', faction: 'jin', position: { x: 45, y: 25 } },
  13: { name: '黑风关', type: 'pass', faction: 'neutral', position: { x: 55, y: 55 } },
  // 新增资源点
  209: { name: '碧波港', type: 'port', faction: 'wu', position: { x: 70, y: 75 } },
  210: { name: '苍龙遗迹', type: 'relic', faction: 'jin', position: { x: 35, y: 30 } },
  211: { name: '丹阳矿脉', type: 'mine', faction: 'wei', position: { x: 75, y: 35 } },
  // 4特殊遗迹(对应现有章节)
  212: { name: '查克拉节点', type: 'relic', faction: 'neutral', position: { x: 40, y: 60 } },
  213: { name: '鬼夜封印地', type: 'relic', faction: 'neutral', position: { x: 30, y: 45 } },
  214: { name: '果实海域', type: 'port', faction: 'neutral', position: { x: 85, y: 80 } },
  215: { name: '砂核深渊', type: 'relic', faction: 'neutral', position: { x: 60, y: 50 } },
};

// 4条主要战线(连接关系)
export const WAR_MAP_ROUTES = [
  // 魏-晋 北方战线
  { from: 201, to: 10, type: 'road' }, { from: 10, to: 207, type: 'road' },
  { from: 207, to: 12, type: 'road' }, { from: 207, to: 3, type: 'road' },
  { from: 201, to: 211, type: 'road' }, { from: 201, to: 5, type: 'road' },
  // 蜀-吴 南方战线
  { from: 202, to: 1, type: 'road' }, { from: 202, to: 6, type: 'road' },
  { from: 203, to: 4, type: 'road' }, { from: 203, to: 8, type: 'road' },
  { from: 4, to: 209, type: 'water' }, { from: 8, to: 214, type: 'water' },
  // 中央洛都战线
  { from: 208, to: 5, type: 'road' }, { from: 208, to: 9, type: 'road' },
  { from: 208, to: 13, type: 'road' }, { from: 208, to: 2, type: 'road' },
  { from: 9, to: 13, type: 'road' },
  // 蜀-魏 西部战线
  { from: 1, to: 213, type: 'road' }, { from: 6, to: 11, type: 'road' },
  { from: 11, to: 212, type: 'road' },
  // 晋-吴 东部战线
  { from: 2, to: 7, type: 'road' }, { from: 7, to: 203, type: 'road' },
  { from: 210, to: 3, type: 'road' }, { from: 215, to: 5, type: 'road' },
];

// ===== 十、AI帮派系统 =====

export const AI_GANG_TYPES = {
  military:  { name: '军武帮派', icon: '⚔️', behavior: '喜欢攻城和正面战', priority: 'attack' },
  tamer:     { name: '御灵帮派', icon: '🐾', behavior: '喜欢精灵圣域和生态', priority: 'ecology' },
  trade:     { name: '商贸帮派', icon: '💰', behavior: '喜欢港口和贸易', priority: 'trade' },
  intel:     { name: '情报帮派', icon: '🕵️', behavior: '喜欢渗透和伏击', priority: 'infiltrate' },
  research:  { name: '研究帮派', icon: '🔬', behavior: '喜欢遗迹、果实、机械', priority: 'research' },
  dark:      { name: '黑市帮派', icon: '💀', behavior: '可成为敌对势力', priority: 'chaos' },
  neutral:   { name: '中立帮派', icon: '🏳️', behavior: '可被拉拢加入国家', priority: 'neutral' },
};

export const AI_GANG_RELATIONS = {
  friendly: { name: '友好', icon: '😊', effect: '可共同作战', threshold: 60 },
  allied:   { name: '盟友', icon: '🤝', effect: '可联合管理城池', threshold: 80 },
  neutral:  { name: '中立', icon: '😐', effect: '不主动协助', threshold: 30 },
  rival:    { name: '竞争', icon: '⚡', effect: '争夺资源和声望', threshold: 15 },
  hostile:  { name: '敌对', icon: '👊', effect: '会破坏玩家任务', threshold: 0 },
  absorbed: { name: '收编', icon: '🏴', effect: '已加入玩家帮派', threshold: 100 },
};

export const AI_GANGS_INITIAL = [
  { id: 'ai_iron_fist', name: '铁拳会', type: 'military', faction: 'wei', power: 2800, relation: 'neutral', occupiedNode: 10 },
  { id: 'ai_green_wind', name: '青风社', type: 'tamer', faction: 'shu', power: 2200, relation: 'neutral', occupiedNode: 11 },
  { id: 'ai_golden_wave', name: '金浪商会', type: 'trade', faction: 'wu', power: 2600, relation: 'neutral', occupiedNode: 209 },
  { id: 'ai_shadow_eye', name: '暗瞳阁', type: 'intel', faction: 'jin', power: 2400, relation: 'neutral', occupiedNode: 210 },
  { id: 'ai_relic_seeker', name: '遗迹猎人', type: 'research', faction: 'neutral', power: 2000, relation: 'neutral', occupiedNode: 212 },
  { id: 'ai_black_market', name: '黑市猎团', type: 'dark', faction: 'neutral', power: 3000, relation: 'rival', occupiedNode: 13 },
  { id: 'ai_wanderer', name: '流浪者联盟', type: 'neutral', faction: 'neutral', power: 1800, relation: 'friendly', occupiedNode: null },
  { id: 'ai_north_guard', name: '北境守卫', type: 'military', faction: 'jin', power: 2900, relation: 'neutral', occupiedNode: 3 },
];

// ===== 十一、战役副本类型 =====

export const BATTLE_TYPES = {
  siege:       { name: '攻城战', icon: '🏰', desc: '破城门、占据点、打城核' },
  defense:     { name: '守城战', icon: '🛡️', desc: '修城墙、防敌军、守住倒计时' },
  escort:      { name: '护送战', icon: '🐫', desc: '护送粮草、矿车、精灵蛋' },
  ambush:      { name: '伏击战', icon: '🗡️', desc: '截断敌方运输线' },
  infiltrate:  { name: '渗透战', icon: '🌙', desc: '潜入敌城破坏机关' },
  calamity:    { name: '灵灾战', icon: '💫', desc: '清理区域灾害' },
  boss:        { name: 'Boss战', icon: '👹', desc: '击败国家级Boss' },
  sanctuary:   { name: '圣域守护', icon: '🌿', desc: '保护精灵圣域' },
  naval:       { name: '港口战', icon: '⚓', desc: '水域战斗和船只机关' },
  relic:       { name: '遗迹战', icon: '🏛️', desc: '古代机关和将魂试炼' },
};

// ===== 十二、晋国战役（补充） =====

export const JIN_CAMPAIGNS = [
  { id: 'jin_gaoping',   faction: 'jin', name: '高平陵之变', desc: '司马懿发动政变夺权！改写历史的一刻。',
    icon: '🎭', lvl: 60, teamSize: 6, boss: 149, bossLvl: 65, bossName: '曹爽·大将军',
    pool: [9, 65, 94, 130, 143, 168, 199, 241], reward: { gold: 8000, tokens: 10, contribution: 50 },
    bg: 'linear-gradient(135deg, #4A148C, #6A1B9A)', lore: '正始十年，司马懿隐忍多年终于一举夺权，魏国实权归于司马氏。' },
  { id: 'jin_shouchun',  faction: 'jin', name: '寿春之战', desc: '平定诸葛诞叛乱！巩固司马氏权力。',
    icon: '⚔️', lvl: 65, teamSize: 6, boss: 182, bossLvl: 70, bossName: '诸葛诞·征东大将军',
    pool: [9, 65, 94, 134, 136, 139, 190, 225], reward: { gold: 10000, tokens: 12, contribution: 60 },
    bg: 'linear-gradient(135deg, #311B92, #4A148C)', lore: '诸葛诞起兵反抗司马昭，二十六万大军围攻寿春。' },
  { id: 'jin_mianzhu',   faction: 'jin', name: '绵竹之战', desc: '邓艾偷渡阴平，直取蜀汉腹地！',
    icon: '⛰️', lvl: 72, teamSize: 6, boss: 130, bossLvl: 78, bossName: '诸葛瞻·卫将军',
    pool: [3, 18, 130, 143, 160, 182, 446, 449], reward: { gold: 12000, tokens: 15, contribution: 70 },
    bg: 'linear-gradient(135deg, #4A148C, #1A237E)', lore: '邓艾率奇兵翻越摩天岭，裹毡滚山而下，出其不意攻占绵竹！' },
  { id: 'jin_destroy_shu', faction: 'jin', name: '灭蜀之战', desc: '钟会邓艾两路伐蜀，蜀汉覆灭！',
    icon: '🗡️', lvl: 78, teamSize: 6, boss: 199, bossLvl: 84, bossName: '姜维·大将军',
    pool: [9, 65, 94, 138, 139, 182, 206, 437], reward: { gold: 15000, tokens: 18, contribution: 80 },
    bg: 'linear-gradient(135deg, #1A237E, #311B92)', lore: '钟会领兵十万入汉中，姜维苦撑残局，蜀汉四十二年国祚终结。' },
  { id: 'jin_jingkou',   faction: 'jin', name: '京口突击', desc: '祖逖中流击楫，北伐中原！',
    icon: '🌊', lvl: 82, teamSize: 6, boss: 241, bossLvl: 88, bossName: '石勒·赵王',
    pool: [3, 6, 18, 33, 69, 130, 143, 160], reward: { gold: 18000, tokens: 22, contribution: 100 },
    bg: 'linear-gradient(135deg, #311B92, #4A148C)', lore: '闻鸡起舞，中流击楫，祖逖带着北伐的壮志渡江北上！' },
  { id: 'jin_feishui',   faction: 'jin', name: '淝水之战', desc: '谢玄八万北府兵大破百万前秦军！',
    icon: '🏹', lvl: 88, teamSize: 6, boss: 335, bossLvl: 94, bossName: '苻坚·天王',
    pool: [9, 65, 94, 130, 139, 149, 190, 206], reward: { gold: 22000, tokens: 26, contribution: 120 },
    bg: 'linear-gradient(135deg, #4A148C, #880E4F)', lore: '风声鹤唳，草木皆兵。八万北府兵创造了以少胜多的奇迹！' },
  { id: 'jin_luoyang',   faction: 'jin', name: '洛阳一统', desc: '王濬楼船下益州，金陵王气黯然收！统一天下。',
    icon: '👑', lvl: 92, teamSize: 6, boss: 336, bossLvl: 98, bossName: '孙皓·吴末帝',
    pool: [9, 65, 94, 130, 149, 190, 199, 241], reward: { gold: 25000, tokens: 30, contribution: 150 },
    bg: 'linear-gradient(135deg, #1A237E, #0D47A1)', lore: '王濬楼船从巴蜀顺流而下，铁锁横江也挡不住统一的大势！' },
  { id: 'jin_wuhu',      faction: 'jin', name: '五胡乱华', desc: '抵御异族入侵！守护晋室最后的荣光。',
    icon: '🐉', lvl: 95, teamSize: 6, boss: 337, bossLvl: 100, bossName: '刘渊·汉赵帝',
    pool: [9, 65, 94, 130, 149, 199, 241, 443], reward: { gold: 28000, tokens: 35, contribution: 180 },
    bg: 'linear-gradient(135deg, #311B92, #880E4F)', lore: '永嘉之乱，衣冠南渡。这是守护华夏文明的最终之战！' },
];

// ===== 十三、剧本系统 =====

export const SCENARIOS = [
  {
    id: 'scenario_red_sand',
    name: '赤砂矿争',
    icon: '⛏️',
    desc: '赤砂峡谷发现巨大矿脉和砂核遗迹，四国争夺。',
    reqBadges: 5,
    initialStrength: { wei: 60, shu: 50, wu: 45, jin: 45 },
    keyNodes: [5, 9, 215],
    specialRules: ['矿场资源产出翻倍', '魏国初期军备+10'],
    chapters: 8,
    objectives: {
      wei: '获得赤砂矿城，军备大幅提升',
      shu: '保护岩甲犀族群，建设赤砂圣域',
      wu: '控制运输和贸易路线',
      jin: '控制砂核遗迹并研究古代科技',
    },
    endings: [
      { id: 'wei_mine', name: '魏国矿城', condition: 'wei控制赤砂', desc: '魏获得赤砂矿城，军备大幅提升' },
      { id: 'shu_sanctuary', name: '蜀国圣域', condition: 'shu完成保护', desc: '蜀保护岩甲犀，建设赤砂圣域' },
      { id: 'wu_trade', name: '吴国商路', condition: 'wu控制运输', desc: '吴控制运输和贸易路线' },
      { id: 'jin_relic', name: '晋国遗迹', condition: 'jin控制砂核', desc: '晋控制砂核遗迹并研究古代科技' },
      { id: 'shared', name: '共生结局', condition: '调停多方', desc: '赤砂成为中立共生区域' },
      { id: 'dark', name: '暗化结局', condition: '砂核失控', desc: '砂核遗迹失控，引发机械灵灾' },
    ],
  },
  {
    id: 'scenario_ghost_night',
    name: '鬼夜降临',
    icon: '👻',
    desc: '鬼化敌人袭击四国边境，蜀国圣域成为关键。',
    reqBadges: 6,
    initialStrength: { wei: 50, shu: 55, wu: 45, jin: 50 },
    keyNodes: [1, 6, 213],
    specialRules: ['夜战增多', '呼吸法系精灵伤害+20%', '光系精灵伤害+15%'],
    chapters: 8,
    objectives: {
      wei: '以军事力量正面清除鬼化威胁',
      shu: '修复圣域净化鬼化污染',
      wu: '防御港口夜袭保护贸易',
      jin: '研究鬼血技术为己所用',
    },
    endings: [
      { id: 'purify', name: '净化成功', condition: '圣域修复完成', desc: '鬼化威胁被净化，生态恢复' },
      { id: 'weapon', name: '鬼血武器', condition: '晋国研究完成', desc: '鬼血技术被掌控为战争武器' },
      { id: 'alliance', name: '四国联盟', condition: '合作度高', desc: '四国暂时联手抵御外敌' },
      { id: 'fall', name: '鬼夜吞噬', condition: '生态崩溃', desc: '鬼化扩散无法控制，世界陷入黑暗' },
    ],
  },
  {
    id: 'scenario_sea_power',
    name: '海权争霸',
    icon: '🌊',
    desc: '吴国控制海域贸易，恶魔果实海域开放。',
    reqBadges: 8,
    initialStrength: { wei: 50, shu: 45, wu: 60, jin: 50 },
    keyNodes: [4, 8, 209, 214],
    specialRules: ['水域地图增多', '恶魔果实系统重要', '吴国水战+20%'],
    chapters: 8,
    objectives: {
      wei: '突破海上封锁获取果实资源',
      shu: '保护海域生态平衡',
      wu: '控制全部港口和海楼石',
      jin: '建立秘密航线获取情报',
    },
    endings: [
      { id: 'wu_navy', name: '吴国海权', condition: '控制全部港口', desc: '吴国成为海上霸主' },
      { id: 'free_trade', name: '自由贸易', condition: '开放航路', desc: '海域成为共享贸易区' },
      { id: 'fruit_chaos', name: '果实暴走', condition: '过度开采', desc: '恶魔果实能量失控' },
      { id: 'jin_secret', name: '晋国秘航', condition: '晋情报满', desc: '晋国掌握全部海域情报' },
    ],
  },
  {
    id: 'scenario_luodu',
    name: '洛都一统',
    icon: '👑',
    desc: '晋国崛起，中央洛都开放，四国围绕洛都决战。',
    reqBadges: 10,
    initialStrength: { wei: 55, shu: 50, wu: 50, jin: 60 },
    keyNodes: [208, 207, 12, 210],
    specialRules: ['晋国后期强', '情报/治理/反制重要', '洛都最终战决定大结局'],
    chapters: 10,
    objectives: {
      wei: '以军事实力碾压夺取洛都',
      shu: '和平联盟或防守至统一',
      wu: '经济优势压制四国',
      jin: '治理路线完成统一大业',
    },
    endings: [
      { id: 'wei_unify', name: '魏国统一', condition: '魏军备最高+洛都', desc: '天下进入铁血秩序' },
      { id: 'shu_unify', name: '蜀国统一', condition: '蜀民心最高+和平', desc: '天下恢复生态平衡' },
      { id: 'wu_unify', name: '吴国统一', condition: '吴经济压制', desc: '天下进入商贸繁荣' },
      { id: 'jin_unify', name: '晋国统一', condition: '晋统一值满', desc: '天下完成制度整合' },
      { id: 'split', name: '四国分裂', condition: '无国统一', desc: '四国继续对峙' },
      { id: 'calamity', name: '灵灾毁灭', condition: '生态崩溃', desc: '世界失控进入灾后重建' },
    ],
  },
];

// ===== 十四、四国最终结局 =====

export const KINGDOM_ENDINGS = {
  wei_unify: {
    name: '魏国统一',
    icon: '⚔️',
    condition: { stat: 'military', faction: 'wei', min: 90, controlCenter: true },
    title: '铁血霸主',
    desc: '天下进入铁血秩序。机械精灵和军备科技高度发展。生态压力较大，但国家稳定。',
    reward: { gold: 50000, tokens: 100, title: '天下霸主' },
  },
  shu_unify: {
    name: '蜀国统一',
    icon: '🌿',
    condition: { stat: 'morale', faction: 'shu', min: 90, ecologyMin: 80 },
    title: '仁德之主',
    desc: '天下恢复生态平衡。精灵与人类共存。军备发展较慢，但民心稳定。',
    reward: { gold: 50000, tokens: 100, title: '仁德之主' },
  },
  wu_unify: {
    name: '吴国统一',
    icon: '⚓',
    condition: { stat: 'fortune', faction: 'wu', min: 90, controlPorts: true },
    title: '商贸之王',
    desc: '天下进入商贸繁荣时代。海域、港口、贸易高度发展。地方自治较强。',
    reward: { gold: 50000, tokens: 100, title: '商贸之王' },
  },
  jin_unify: {
    name: '晋国统一',
    icon: '🐉',
    condition: { stat: 'intel', faction: 'jin', min: 90, controlCenter: true, governMin: 80 },
    title: '权谋天子',
    desc: '天下完成制度整合。科技、遗迹、恶魔果实研究高速发展。权谋统治带来秩序，但暗线风险存在。',
    reward: { gold: 50000, tokens: 100, title: '权谋天子' },
  },
  split: {
    name: '四国分裂',
    icon: '⚖️',
    condition: { noUnify: true },
    title: '乱世枭雄',
    desc: '四国继续对峙。世界维持动态平衡。后续开放新剧本。',
    reward: { gold: 30000, tokens: 60, title: '乱世枭雄' },
  },
  calamity: {
    name: '灵灾毁灭',
    icon: '💀',
    condition: { ecologyBelow: 20, spiritBelow: 20 },
    title: '废土余生',
    desc: '国战失败。大量城池沦陷。进入灾后重建剧本。',
    reward: { gold: 10000, tokens: 20, title: '废土余生' },
  },
};

// ===== 十五、回合推进引擎 =====

export const TURN_ACTIONS_PER_NATION = {
  produce: { name: '资源产出', desc: '根据控制城池产出资源' },
  handleCalamity: { name: '处理灵灾', desc: '灵灾区域扣除国家变量' },
  attack: { name: '发动进攻', desc: 'AI根据策略选择进攻目标' },
  defend: { name: '防守城池', desc: '修复城墙、恢复驻军' },
  event: { name: '触发事件', desc: '随机城池事件' },
  settle: { name: '结算变化', desc: '更新城池归属' },
};

export const executeTurn = (warState) => {
  const { nationStats, territories, turn, scenario } = warState;
  const newState = JSON.parse(JSON.stringify(warState));
  newState.turn = (turn || 0) + 1;
  const log = [];

  const factions = ['wei', 'shu', 'wu', 'jin'];

  for (const fid of factions) {
    const stats = newState.nationStats[fid];
    const ownedNodes = Object.entries(newState.territories)
      .filter(([, t]) => t.owner === fid)
      .map(([id]) => Number(id));

    const nodeCount = ownedNodes.length;
    stats.grain = Math.min(100, stats.grain + Math.floor(nodeCount * 2));
    stats.military = Math.min(100, stats.military + Math.floor(nodeCount * 1.5));
    stats.fortune = Math.min(100, stats.fortune + 1);

    const fatigueRecovery = fid === newState.playerFaction ? 5 : 3;
    stats.fatigue = Math.max(0, stats.fatigue - fatigueRecovery);

    if (stats.morale < 50) {
      stats.morale = Math.min(50, stats.morale + 2);
    }
  }

  // 城池事件生命周期处理
  for (const [cityId, city] of Object.entries(newState.territories)) {
    if (!city.activeEvents?.length) continue;
    city.activeEvents = city.activeEvents.filter(ev => {
      const age = newState.turn - (ev.startTurn || 0);
      if (ev.type === 'boon' && age >= (ev.duration || 3)) return false;
      if (ev.type === 'crisis' && ev.resolve && age >= (ev.resolve.turns || 2) + 2) {
        const owner = city.owner;
        if (owner !== 'neutral' && newState.nationStats[owner]) {
          if (ev.reward) {
            Object.entries(ev.reward).forEach(([k, v]) => {
              if (typeof v === 'number' && k !== 'gold' && newState.nationStats[owner][k] !== undefined) {
                newState.nationStats[owner][k] = Math.min(100, newState.nationStats[owner][k] + Math.floor(v * 0.5));
              }
            });
          }
        }
        return false;
      }
      return true;
    });
  }

  // AI进攻(非玩家国家)
  for (const fid of factions) {
    if (fid === newState.playerFaction) continue;
    const strategy = AI_FACTION_STRATEGY[fid];
    const stats = newState.nationStats[fid];

    if (stats.fatigue > 70 || stats.grain < 20) continue;
    if (Math.random() > strategy.attackFreq) continue;
    // 进攻消耗资源
    stats.grain = Math.max(0, stats.grain - 5);
    stats.military = Math.max(0, stats.military - 2);

    const allTargets = Object.entries(newState.territories)
      .filter(([, t]) => t.owner !== fid)
      .filter(([id]) => {
        const node = WAR_MAP_NODES[id];
        if (!node) return false;
        if (node.type === 'capital' || node.type === 'center') return false;
        if (!CITY_TYPES[node.type]?.canCapture) return false;
        return true;
      });
    const targets = allTargets.filter(([id]) => {
      const routes = WAR_MAP_ROUTES.filter(r => r.from === Number(id) || r.to === Number(id));
      return routes.some(r => {
        const otherId = r.from === Number(id) ? r.to : r.from;
        return newState.territories[otherId]?.owner === fid;
      });
    });
    const pool = targets.length > 0 ? targets : allTargets;

    if (pool.length === 0) continue;

    let targetId;
    if (strategy.targetPref === 'weakest') {
      pool.sort((a, b) => (a[1].strength || 50) - (b[1].strength || 50));
      targetId = pool[0][0];
    } else if (strategy.targetPref === 'trade_route') {
      const ports = pool.filter(([id]) => WAR_MAP_NODES[id]?.type === 'port');
      targetId = ports.length > 0 ? ports[Math.floor(Math.random() * ports.length)][0] : pool[0][0];
    } else if (strategy.targetPref === 'high_intel') {
      const relics = pool.filter(([id]) => WAR_MAP_NODES[id]?.type === 'relic');
      targetId = relics.length > 0 ? relics[Math.floor(Math.random() * relics.length)][0] : pool[0][0];
    } else {
      targetId = pool[Math.floor(Math.random() * pool.length)][0];
    }

    const target = newState.territories[targetId];
    const atkPower = stats.military * 0.7 + stats.warMorale * 0.4 + stats.intel * 0.15 + stats.tech * 0.1 - stats.fatigue * 0.3;
    const defStats = newState.nationStats[target.owner] || NATION_STATS_DEFAULT;
    const defPower = (target.strength || 50) * 0.4 + defStats.morale * 0.3 + (target.defense || 0) * 0.2 + defStats.ecology * 0.05 + (target.intel || 0) * 0.1;

    const roll = (atkPower * (0.8 + Math.random() * 0.4)) - (defPower * (0.8 + Math.random() * 0.4));

    if (roll > 0) {
      const oldOwner = target.owner;
      target.owner = fid;
      target.strength = 40;
      stats.fatigue = Math.min(100, stats.fatigue + 8);
      stats.warMorale = Math.min(100, stats.warMorale + 5);
      if (newState.nationStats[oldOwner]) {
        newState.nationStats[oldOwner].warMorale = Math.max(0, newState.nationStats[oldOwner].warMorale - 5);
        newState.nationStats[oldOwner].morale = Math.max(0, newState.nationStats[oldOwner].morale - 3);
      }
      log.push({ turn: newState.turn, type: 'capture', attacker: fid, defender: oldOwner, node: Number(targetId), nodeName: WAR_MAP_NODES[targetId]?.name || targetId });
    } else {
      target.strength = Math.min(100, (target.strength || 50) + 5);
      stats.fatigue = Math.min(100, stats.fatigue + 4);
      log.push({ turn: newState.turn, type: 'defend_success', attacker: fid, defender: target.owner, node: Number(targetId), nodeName: WAR_MAP_NODES[targetId]?.name || targetId });
    }
  }

  // 城池事件(随机触发)
  if (Math.random() < 0.3) {
    const allCities = Object.entries(newState.territories).filter(([, t]) => t.owner !== 'neutral');
    if (allCities.length > 0) {
      const [cityId, city] = allCities[Math.floor(Math.random() * allCities.length)];
      const isBoon = Math.random() < 0.35;
      const eventPool = CITY_EVENTS.filter(e => isBoon ? e.type === 'boon' : e.type === 'crisis');
      if (eventPool.length > 0) {
        const event = eventPool[Math.floor(Math.random() * eventPool.length)];
        if (!city.activeEvents) city.activeEvents = [];
        if (city.activeEvents.length < 3 && !city.activeEvents.some(e => e.id === event.id)) {
          city.activeEvents.push({ ...event, startTurn: newState.turn });
          log.push({ turn: newState.turn, type: 'city_event', node: Number(cityId), event: event.name, nodeName: WAR_MAP_NODES[cityId]?.name || cityId });
        }
      }
    }
  }

  newState.warLog = [...(newState.warLog || []), ...log].slice(-50);
  return newState;
};

// ===== 十六、默认国战模拟状态 =====

export const DEFAULT_KINGDOM_SIM_STATE = {
  enabled: false,
  playerFaction: null,
  turn: 0,
  scenario: null,
  scenarioProgress: 0,
  nationStats: {
    wei: { ...NATION_STATS_DEFAULT, ...Object.fromEntries(Object.entries(NATION_STYLE_BONUS.wei).map(([k, v]) => [k, (NATION_STATS_DEFAULT[k] || 50) + v])) },
    shu: { ...NATION_STATS_DEFAULT, ...Object.fromEntries(Object.entries(NATION_STYLE_BONUS.shu).map(([k, v]) => [k, (NATION_STATS_DEFAULT[k] || 50) + v])) },
    wu: { ...NATION_STATS_DEFAULT, ...Object.fromEntries(Object.entries(NATION_STYLE_BONUS.wu).map(([k, v]) => [k, (NATION_STATS_DEFAULT[k] || 50) + v])) },
    jin: { ...NATION_STATS_DEFAULT, ...Object.fromEntries(Object.entries(NATION_STYLE_BONUS.jin).map(([k, v]) => [k, (NATION_STATS_DEFAULT[k] || 50) + v])) },
  },
  territories: {},
  warLog: [],
  influence: 0,
  managedCities: [],
  completedBattles: [],
  aiGangs: [],
  endings: [],
  lastTurnDate: null,
};

export const initKingdomSimTerritories = () => {
  const territories = {};
  for (const [id, node] of Object.entries(WAR_MAP_NODES)) {
    territories[id] = {
      owner: node.faction || 'neutral',
      strength: node.type === 'capital' ? 80 : node.type === 'center' ? 70 : 50,
      defense: CITY_TYPES[node.type]?.baseDefense || 40,
      buildings: [],
      morale: 50,
      grain: 50,
      commerce: CITY_TYPES[node.type]?.baseIncome || 100,
      intel: 30,
      activeEvents: [],
    };
  }
  return territories;
};

// ===== 十七、帮派驻地默认状态 =====

export const DEFAULT_HQ_STATE = {
  buildings: { hq_hall: 1 },
  factionBuildings: {},
  members: [],
  dispatch: [],
  maxMembers: 8,
  maxDispatch: 2,
};

export const getHqBuildingEffect = (buildings, factionBuildings) => {
  const effects = {};
  for (const [bid, lv] of Object.entries(buildings || {})) {
    const def = HQ_BUILDINGS.find(b => b.id === bid);
    if (!def) continue;
    for (const [key, val] of Object.entries(def.effect || {})) {
      effects[key] = (effects[key] || 0) + val * lv;
    }
  }
  for (const [bid, lv] of Object.entries(factionBuildings || {})) {
    const allFb = Object.values(FACTION_BUILDINGS).flat();
    const def = allFb.find(b => b.id === bid);
    if (!def) continue;
    for (const [key, val] of Object.entries(def.effect || {})) {
      effects[key] = (effects[key] || 0) + val * lv;
    }
  }
  return effects;
};

// ===== 导出汇总 =====

export const getScenarioById = (id) => SCENARIOS.find(s => s.id === id);
export const getDispatchMissionById = (id) => DISPATCH_MISSIONS.find(m => m.id === id);
export const getCityEventById = (id) => CITY_EVENTS.find(e => e.id === id);
