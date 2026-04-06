// ==========================================
// 帮派系统 v2.0 - 国战联动·实用增益
// ==========================================

const RECRUIT_NAMES = [
  '赵云','李白','王刚','陈风','周海','吴铭','郑远','孙亮','马超','杨威',
  '黄峰','林静','刘勇','张翼','徐达','高远','韩冰','唐龙','朱雀','罗刹',
  '萧寒','楚天','秦明','宋江','卫庄','沈浪','燕青','霍去病','花木兰','穆桂英',
  '甘宁','吕蒙','陆逊','太史慈','关羽','张飞','典韦','许褚','黄忠','魏延',
];

export const GANG_PRESETS = [
  // === 魏国 (4) ===
  {
    id: 'dragon_fang', name: '龙牙会', icon: '🐲', leader: '龙牙老大',
    style: '攻城拔寨', level: 5, power: 3200, desc: '崇尚力量的格斗帮派，攻城略地所向披靡', faction: 'wei',
    color: '#D32F2F',
    perkDesc: '国战贡献+20%, 金币+4%',
    members: Array.from({length: 12}, (_, i) => ({
      name: RECRUIT_NAMES[i % RECRUIT_NAMES.length], level: 40 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_gold: 2, gs_exp: 1, gs_contrib: 2, gs_territory: 0, gs_trade: 1, gs_catch: 0 },
    wins: 24,
    teamPool: [6, 9, 65, 94, 130, 143, 149, 168, 199, 241],
  },
  {
    id: 'shadow_guild', name: '暗影公会', icon: '🌑', leader: '影主',
    style: '侦察暗杀', level: 4, power: 2800, desc: '行踪诡秘的暗杀组织，擅长情报与精灵捕获', faction: 'wei',
    color: '#37474F',
    perkDesc: '捕获率+2%, 经验+4%',
    members: Array.from({length: 10}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 5) % RECRUIT_NAMES.length], level: 35 + i * 3, contribution: 80 + i * 40,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 0, gs_territory: 1, gs_trade: 0, gs_catch: 2 },
    wins: 18,
    teamPool: [3, 18, 33, 94, 138, 190, 206, 241, 434, 437],
  },
  {
    id: 'iron_wall', name: '铁壁盟', icon: '🛡️', leader: '铁壁将军',
    style: '领地防御', level: 6, power: 3500, desc: '固若金汤的防御联盟，领地一旦到手绝不松手', faction: 'wei',
    color: '#455A64',
    perkDesc: '领地防御+6, 商队收入高',
    members: Array.from({length: 14}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 10) % RECRUIT_NAMES.length], level: 45 + i * 3, contribution: 120 + i * 55,
    })),
    skills: { gs_gold: 0, gs_exp: 0, gs_contrib: 1, gs_territory: 3, gs_trade: 2, gs_catch: 0 },
    wins: 30,
    teamPool: [9, 65, 69, 134, 135, 136, 139, 169, 190, 225],
  },
  {
    id: 'tiger_cavalry', name: '虎豹骑', icon: '🐅', leader: '曹纯',
    style: '精锐突击', level: 5, power: 3400, desc: '曹操麾下王牌骑兵，国战冲锋第一军', faction: 'wei',
    color: '#1565C0',
    perkDesc: '国战贡献+30%, 经验+2%',
    members: Array.from({length: 12}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 30) % RECRUIT_NAMES.length], level: 42 + i * 3, contribution: 110 + i * 50,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 3, gs_territory: 1, gs_trade: 0, gs_catch: 1 },
    wins: 28,
    teamPool: [6, 9, 65, 94, 130, 143, 149, 199, 241, 443],
  },

  // === 蜀国 (4) ===
  {
    id: 'storm_riders', name: '风暴骑士团', icon: '⚡', leader: '雷霆统帅',
    style: '快速成长', level: 3, power: 2400, desc: '追求极速成长的精锐骑士，经验获取遥遥领先', faction: 'shu',
    color: '#F57F17',
    perkDesc: '经验+6%, 捕获率+1%',
    members: Array.from({length: 8}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 15) % RECRUIT_NAMES.length], level: 30 + i * 4, contribution: 60 + i * 35,
    })),
    skills: { gs_gold: 0, gs_exp: 3, gs_contrib: 1, gs_territory: 0, gs_trade: 1, gs_catch: 1 },
    wins: 12,
    teamPool: [3, 18, 130, 143, 160, 182, 446, 449, 455, 459],
  },
  {
    id: 'phoenix_order', name: '凤凰社', icon: '🔥', leader: '凤凰长老',
    style: '后勤支援', level: 5, power: 3000, desc: '以治愈与补给闻名，商队遍布天下', faction: 'shu',
    color: '#E64A19',
    perkDesc: '商队收入高, 金币+4%',
    members: Array.from({length: 11}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 20) % RECRUIT_NAMES.length], level: 38 + i * 3, contribution: 90 + i * 45,
    })),
    skills: { gs_gold: 2, gs_exp: 0, gs_contrib: 0, gs_territory: 1, gs_trade: 3, gs_catch: 0 },
    wins: 22,
    teamPool: [6, 9, 140, 149, 168, 199, 443, 452, 461, 465],
  },
  {
    id: 'wild_pack', name: '野狼帮', icon: '🐺', leader: '头狼',
    style: '野外猎手', level: 2, power: 1800, desc: '野性十足的冒险者，精灵捕获率极高', faction: 'shu',
    color: '#6D4C41',
    perkDesc: '捕获率+3%, 经验+2%',
    members: Array.from({length: 6}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 8) % RECRUIT_NAMES.length], level: 25 + i * 4, contribution: 40 + i * 30,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 0, gs_territory: 0, gs_trade: 1, gs_catch: 3 },
    wins: 6,
    teamPool: [3, 6, 18, 33, 69, 130, 143, 160, 168, 199],
  },
  {
    id: 'white_ear', name: '白耳精锐', icon: '🦅', leader: '陈到',
    style: '忠义护卫', level: 5, power: 3100, desc: '刘备亲卫白耳兵传承，国战攻防均衡', faction: 'shu',
    color: '#2E7D32',
    perkDesc: '国战贡献+20%, 领地防御+4',
    members: Array.from({length: 11}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 34) % RECRUIT_NAMES.length], level: 40 + i * 3, contribution: 95 + i * 48,
    })),
    skills: { gs_gold: 1, gs_exp: 0, gs_contrib: 2, gs_territory: 2, gs_trade: 1, gs_catch: 0 },
    wins: 20,
    teamPool: [6, 9, 140, 149, 160, 182, 199, 443, 465, 469],
  },

  // === 吴国 (4) ===
  {
    id: 'star_alliance', name: '星辰联盟', icon: '⭐', leader: '星主',
    style: '均衡发展', level: 4, power: 2900, desc: '智者联盟，各方面均衡发展', faction: 'wu',
    color: '#1565C0',
    perkDesc: '经验+4%, 金币+2%, 贡献+10%',
    members: Array.from({length: 10}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 2) % RECRUIT_NAMES.length], level: 36 + i * 3, contribution: 85 + i * 42,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 1, gs_territory: 1, gs_trade: 0, gs_catch: 1 },
    wins: 20,
    teamPool: [33, 65, 94, 138, 139, 182, 206, 437, 463, 467],
  },
  {
    id: 'golden_lotus', name: '金莲堂', icon: '🪷', leader: '莲主',
    style: '财源广进', level: 7, power: 4000, desc: '富可敌国的商业帮会，金币收入无人能比', faction: 'wu',
    color: '#FF8F00',
    perkDesc: '金币+6%, 商队收入最高',
    members: Array.from({length: 15}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 12) % RECRUIT_NAMES.length], level: 50 + i * 3, contribution: 150 + i * 60,
    })),
    skills: { gs_gold: 3, gs_exp: 0, gs_contrib: 0, gs_territory: 0, gs_trade: 3, gs_catch: 0 },
    wins: 35,
    teamPool: [9, 65, 94, 130, 139, 149, 190, 206, 241, 443],
  },
  {
    id: 'brocade_sail', name: '锦帆军', icon: '⚓', leader: '甘宁',
    style: '水上霸主', level: 5, power: 3300, desc: '昔日锦帆贼，今朝水军先锋，国战贡献极高', faction: 'wu',
    color: '#00838F',
    perkDesc: '国战贡献+30%, 捕获率+1%',
    members: Array.from({length: 12}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 32) % RECRUIT_NAMES.length], level: 38 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 3, gs_territory: 1, gs_trade: 0, gs_catch: 1 },
    wins: 26,
    teamPool: [33, 65, 94, 138, 182, 206, 437, 463, 467, 471],
  },
  {
    id: 'danyang_elite', name: '丹阳精兵', icon: '🗡️', leader: '朱桓',
    style: '全能战士', level: 4, power: 2700, desc: '江东丹阳出精兵，领地攻守兼备', faction: 'wu',
    color: '#AD1457',
    perkDesc: '领地防御+4, 经验+2%, 金币+2%',
    members: Array.from({length: 9}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 36) % RECRUIT_NAMES.length], level: 34 + i * 3, contribution: 75 + i * 40,
    })),
    skills: { gs_gold: 1, gs_exp: 1, gs_contrib: 1, gs_territory: 2, gs_trade: 1, gs_catch: 0 },
    wins: 16,
    teamPool: [9, 33, 65, 94, 138, 139, 182, 437, 463, 479],
  },
];

export const GANG_RANKS = [
  { id: 'member',      name: '帮众',   minContribution: 0,    salary: 300,   icon: '👤', privileges: '基础任务' },
  { id: 'elite',       name: '精英',   minContribution: 200,  salary: 700,   icon: '⭐', privileges: '帮战+国战副本' },
  { id: 'hall_master', name: '堂主',   minContribution: 600,  salary: 1500,  icon: '🏛️', privileges: '可招募NPC' },
  { id: 'guardian',    name: '护法',   minContribution: 1500, salary: 3000,  icon: '🛡️', privileges: '解锁高级帮派技能' },
  { id: 'vice_leader', name: '副帮主', minContribution: 3000, salary: 5000,  icon: '🌟', privileges: '可发起帮战' },
  { id: 'leader',      name: '帮主',   minContribution: -1,   salary: 8000,  icon: '👑', privileges: '最高权限' },
];

export const GANG_SKILL_COST_MULT = [1, 2, 3, 5, 8];

export const GANG_SKILLS = [
  { id: 'gs_gold',      name: '聚财之道', desc: '战斗金币+{val}%',        maxLv: 3, costPerLv: 5000, valPerLv: 2,  icon: '💰' },
  { id: 'gs_exp',       name: '经验共享', desc: '战斗经验+{val}%',        maxLv: 3, costPerLv: 5000, valPerLv: 2,  icon: '📖' },
  { id: 'gs_contrib',   name: '国战精英', desc: '国战贡献+{val}%',        maxLv: 3, costPerLv: 6000, valPerLv: 10, icon: '⚔️' },
  { id: 'gs_territory', name: '领地守护', desc: '己方领地防御+{val}/tick', maxLv: 3, costPerLv: 7000, valPerLv: 2,  icon: '🏰' },
  { id: 'gs_trade',     name: '商队贸易', desc: '每日被动收入{val}金',     maxLv: 3, costPerLv: 6000, valPerLv: 500,icon: '🐫' },
  { id: 'gs_catch',     name: '精灵亲和', desc: '捕获率+{val}%',          maxLv: 3, costPerLv: 8000, valPerLv: 1,  icon: '🎯' },
];

export const GANG_TASKS = [
  { id: 'battle_5',   name: '战斗演练', desc: '赢得5场战斗',        type: 'battle_win',  target: 5,    reward: 30, gold: 1000, icon: '⚔️' },
  { id: 'battle_10',  name: '精锐出击', desc: '赢得10场战斗',       type: 'battle_win',  target: 10,   reward: 60, gold: 2000, icon: '🗡️' },
  { id: 'donate_gold', name: '资金捐献', desc: '捐献5000金币给帮派', type: 'donate_gold', target: 5000, reward: 40, gold: 0,    icon: '💰' },
  { id: 'donate_pet',  name: '精灵上供', desc: '上交1只Lv20+精灵',  type: 'donate_pet',  target: 1,    reward: 50, gold: 500,  icon: '🐾' },
  { id: 'explore',     name: '领地巡逻', desc: '探索3张不同地图',    type: 'explore_map', target: 3,    reward: 25, gold: 800,  icon: '🗺️' },
  { id: 'kw_battle',   name: '国战先锋', desc: '击败3个敌国训练师', type: 'kw_kill',     target: 3,    reward: 40, gold: 1500, icon: '🏴' },
  { id: 'kw_campaign', name: '名将之路', desc: '通关1个三国副本',   type: 'kw_campaign', target: 1,    reward: 80, gold: 3000, icon: '👑' },
];

export const GANG_WAR_CONFIG = {
  maxDaily: 2,
  baseFunds: 3000,
  fundsPerLevel: 700,
  baseContribution: 20,
  contributionPerLevel: 5,
  triggerChance: 0.3,
};

export const GANG_ICONS = ['🐲','🌑','🛡️','⚡','🔥','⭐','🐺','🪷','🦁','🦅','🐍','🌪️','💀','🏴','⚓','🗡️','🌊','🏔️','🐉','🦊'];

export const GANG_CREATE_COST = 20000;
export const GANG_LEVEL_UP_COST = (level) => level * 10000;
export const GANG_MAX_MEMBERS = (level) => 10 + level * 2;

export const getGangRank = (contribution, isOwner) => {
  if (isOwner) return GANG_RANKS.find(r => r.id === 'leader');
  let rank = GANG_RANKS[0];
  for (const r of GANG_RANKS) {
    if (r.minContribution < 0) continue;
    if (contribution >= r.minContribution) rank = r;
  }
  return rank;
};

export const getGangSkillBonus = (skills) => {
  if (!skills) return { atk: 0, def: 0, s_atk: 0, s_def: 0, hp: 0, spd: 0, gold: 0, exp: 0, contrib: 0, territory: 0, trade: 0, catchRate: 0 };
  return {
    atk: 0, def: 0, s_atk: 0, s_def: 0, hp: 0, spd: 0,
    gold:      (skills.gs_gold      || 0) * 2,
    exp:       (skills.gs_exp       || 0) * 2,
    contrib:   (skills.gs_contrib   || 0) * 10,
    territory: (skills.gs_territory || 0) * 2,
    trade:     (skills.gs_trade     || 0) * 500,
    catchRate: (skills.gs_catch     || 0) * 1,
  };
};

export const getGangMaxSkills = (gang) => {
  if (!gang || !gang.gangId) return {};
  if (gang.isOwner && gang.customGang) return gang.customGang.skills || {};
  const preset = GANG_PRESETS.find(g => g.id === gang.gangId);
  return preset ? preset.skills : {};
};

export const getGangSkills = (gang) => {
  if (!gang || !gang.gangId) return {};
  if (gang.isOwner) return getGangMaxSkills(gang);
  const maxSkills = getGangMaxSkills(gang);
  const personal = gang.personalSkills || {};
  const result = {};
  for (const skill of GANG_SKILLS) {
    const cap = maxSkills[skill.id] || 0;
    const cur = personal[skill.id] || 0;
    result[skill.id] = Math.min(cur, cap);
  }
  return result;
};

export const getGangWarLevel = (targetGang) => {
  const lv = targetGang.level || 1;
  return Math.min(100, 70 + lv * 4);
};

export const getGangWarReward = (targetGang) => {
  const lv = targetGang.level || 1;
  return {
    funds: GANG_WAR_CONFIG.baseFunds + lv * GANG_WAR_CONFIG.fundsPerLevel,
    contribution: GANG_WAR_CONFIG.baseContribution + lv * GANG_WAR_CONFIG.contributionPerLevel,
  };
};

export const generateCafeRecruits = () => {
  const pool = [...RECRUIT_NAMES];
  const recruits = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    recruits.push({
      name: pool.splice(idx, 1)[0],
      level: 20 + Math.floor(Math.random() * 50),
      contribution: 0,
    });
  }
  return recruits;
};

export const PERSONAL_SKILL_COST_MULT = [1, 2, 3, 5, 8];
export const PERSONAL_SKILL_BASE_COST = 50;

export const DEFAULT_GANG_STATE = {
  gangId: null,
  isOwner: false,
  customGang: null,
  contribution: 0,
  rank: 'member',
  personalSkills: {},
  dailyCounts: {
    salary: false,
    warCount: 0,
    taskProgress: {},
    taskCompleted: [],
    cafeRecruits: [],
    resetDate: null,
  },
};
