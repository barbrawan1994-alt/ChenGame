// ==========================================
// 帮派系统 - 数据定义
// ==========================================

const RECRUIT_NAMES = [
  '赵云','李白','王刚','陈风','周海','吴铭','郑远','孙亮','马超','杨威',
  '黄峰','林静','刘勇','张翼','徐达','高远','韩冰','唐龙','朱雀','罗刹',
  '萧寒','楚天','秦明','宋江','卫庄','沈浪','燕青','霍去病','花木兰','穆桂英',
];

export const GANG_PRESETS = [
  {
    id: 'dragon_fang', name: '龙牙会', icon: '🐲', leader: '龙牙老大',
    style: 'ATK', level: 5, power: 3200, desc: '崇尚力量的格斗帮派',
    color: '#D32F2F',
    members: Array.from({length: 12}, (_, i) => ({
      name: RECRUIT_NAMES[i % RECRUIT_NAMES.length], level: 40 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_atk: 3, gs_def: 1, gs_hp: 2, gs_spd: 0, gs_gold: 1, gs_exp: 1 },
    wins: 24,
    teamPool: [6, 9, 65, 94, 130, 143, 149, 168, 199, 241],
  },
  {
    id: 'shadow_guild', name: '暗影公会', icon: '🌑', leader: '影主',
    style: 'SPD', level: 4, power: 2800, desc: '行踪诡秘的暗杀组织',
    color: '#37474F',
    members: Array.from({length: 10}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 5) % RECRUIT_NAMES.length], level: 35 + i * 3, contribution: 80 + i * 40,
    })),
    skills: { gs_atk: 1, gs_def: 0, gs_hp: 1, gs_spd: 3, gs_gold: 1, gs_exp: 2 },
    wins: 18,
    teamPool: [3, 18, 33, 94, 138, 190, 206, 241, 434, 437],
  },
  {
    id: 'iron_wall', name: '铁壁盟', icon: '🛡️', leader: '铁壁将军',
    style: 'DEF', level: 6, power: 3500, desc: '固若金汤的防御联盟',
    color: '#455A64',
    members: Array.from({length: 14}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 10) % RECRUIT_NAMES.length], level: 45 + i * 3, contribution: 120 + i * 55,
    })),
    skills: { gs_atk: 1, gs_def: 4, gs_hp: 3, gs_spd: 0, gs_gold: 1, gs_exp: 1 },
    wins: 30,
    teamPool: [9, 65, 69, 134, 135, 136, 139, 169, 190, 225],
  },
  {
    id: 'storm_riders', name: '风暴骑士团', icon: '⚡', leader: '雷霆统帅',
    style: 'CRIT', level: 3, power: 2400, desc: '追求极速的精锐骑士',
    color: '#F57F17',
    members: Array.from({length: 8}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 15) % RECRUIT_NAMES.length], level: 30 + i * 4, contribution: 60 + i * 35,
    })),
    skills: { gs_atk: 2, gs_def: 0, gs_hp: 1, gs_spd: 2, gs_gold: 0, gs_exp: 1 },
    wins: 12,
    teamPool: [3, 18, 130, 143, 160, 182, 446, 449, 455, 459],
  },
  {
    id: 'phoenix_order', name: '凤凰社', icon: '🔥', leader: '凤凰长老',
    style: 'HEAL', level: 5, power: 3000, desc: '以治愈与再生闻名',
    color: '#E64A19',
    members: Array.from({length: 11}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 20) % RECRUIT_NAMES.length], level: 38 + i * 3, contribution: 90 + i * 45,
    })),
    skills: { gs_atk: 1, gs_def: 2, gs_hp: 3, gs_spd: 1, gs_gold: 1, gs_exp: 1 },
    wins: 22,
    teamPool: [6, 9, 140, 149, 168, 199, 443, 452, 461, 465],
  },
  {
    id: 'star_alliance', name: '星辰联盟', icon: '⭐', leader: '星主',
    style: 'SATK', level: 4, power: 2900, desc: '精通特殊攻击的智者联盟',
    color: '#1565C0',
    members: Array.from({length: 10}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 2) % RECRUIT_NAMES.length], level: 36 + i * 3, contribution: 85 + i * 42,
    })),
    skills: { gs_atk: 2, gs_def: 1, gs_hp: 1, gs_spd: 1, gs_gold: 1, gs_exp: 2 },
    wins: 20,
    teamPool: [33, 65, 94, 138, 139, 182, 206, 437, 463, 467],
  },
  {
    id: 'wild_pack', name: '野狼帮', icon: '🐺', leader: '头狼',
    style: 'EXP', level: 2, power: 1800, desc: '野性十足的冒险者',
    color: '#6D4C41',
    members: Array.from({length: 6}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 8) % RECRUIT_NAMES.length], level: 25 + i * 4, contribution: 40 + i * 30,
    })),
    skills: { gs_atk: 1, gs_def: 0, gs_hp: 1, gs_spd: 1, gs_gold: 0, gs_exp: 2 },
    wins: 6,
    teamPool: [3, 6, 18, 33, 69, 130, 143, 160, 168, 199],
  },
  {
    id: 'golden_lotus', name: '金莲堂', icon: '🪷', leader: '莲主',
    style: 'GOLD', level: 7, power: 4000, desc: '富可敌国的商业帮会',
    color: '#FF8F00',
    members: Array.from({length: 15}, (_, i) => ({
      name: RECRUIT_NAMES[(i + 12) % RECRUIT_NAMES.length], level: 50 + i * 3, contribution: 150 + i * 60,
    })),
    skills: { gs_atk: 1, gs_def: 1, gs_hp: 2, gs_spd: 1, gs_gold: 4, gs_exp: 2 },
    wins: 35,
    teamPool: [9, 65, 94, 130, 139, 149, 190, 206, 241, 443],
  },
];

export const GANG_RANKS = [
  { id: 'member',      name: '帮众',   minContribution: 0,    salary: 500,   icon: '👤', privileges: '基础任务' },
  { id: 'elite',       name: '精英',   minContribution: 200,  salary: 1200,  icon: '⭐', privileges: '解锁帮战参与' },
  { id: 'hall_master', name: '堂主',   minContribution: 600,  salary: 2500,  icon: '🏛️', privileges: '可招募NPC' },
  { id: 'guardian',    name: '护法',   minContribution: 1500, salary: 5000,  icon: '🛡️', privileges: '解锁高级帮派技能' },
  { id: 'vice_leader', name: '副帮主', minContribution: 3000, salary: 8000,  icon: '🌟', privileges: '可发起帮战' },
  { id: 'leader',      name: '帮主',   minContribution: -1,   salary: 12000, icon: '👑', privileges: '最高权限' },
];

export const GANG_SKILLS = [
  { id: 'gs_atk',  name: '战意昂扬', desc: '全队物攻+{val}%',  maxLv: 5, costPerLv: 5000, valPerLv: 3,  icon: '⚔️' },
  { id: 'gs_def',  name: '坚守阵线', desc: '全队物防+{val}%',  maxLv: 5, costPerLv: 5000, valPerLv: 3,  icon: '🛡️' },
  { id: 'gs_hp',   name: '生命之源', desc: '全队HP上限+{val}%', maxLv: 5, costPerLv: 6000, valPerLv: 4,  icon: '❤️' },
  { id: 'gs_spd',  name: '疾风之势', desc: '全队速度+{val}%',   maxLv: 5, costPerLv: 5000, valPerLv: 2,  icon: '💨' },
  { id: 'gs_gold', name: '聚财之道', desc: '战斗金币+{val}%',   maxLv: 5, costPerLv: 4000, valPerLv: 5,  icon: '💰' },
  { id: 'gs_exp',  name: '经验共享', desc: '战斗经验+{val}%',   maxLv: 5, costPerLv: 4000, valPerLv: 4,  icon: '📖' },
];

export const GANG_TASKS = [
  { id: 'battle_5',   name: '战斗演练', desc: '赢得5场战斗',        type: 'battle_win',  target: 5,    reward: 30, gold: 1000, icon: '⚔️' },
  { id: 'battle_10',  name: '精锐出击', desc: '赢得10场战斗',       type: 'battle_win',  target: 10,   reward: 60, gold: 2000, icon: '🗡️' },
  { id: 'donate_gold', name: '资金捐献', desc: '捐献5000金币给帮派', type: 'donate_gold', target: 5000, reward: 40, gold: 0,    icon: '💰' },
  { id: 'donate_pet',  name: '精灵上供', desc: '上交1只Lv20+精灵',  type: 'donate_pet',  target: 1,    reward: 50, gold: 500,  icon: '🐾' },
  { id: 'explore',     name: '领地巡逻', desc: '探索3张不同地图',    type: 'explore_map', target: 3,    reward: 25, gold: 800,  icon: '🗺️' },
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
  if (!skills) return { atk: 0, def: 0, hp: 0, spd: 0, gold: 0, exp: 0 };
  return {
    atk:  (skills.gs_atk || 0) * 3,
    def:  (skills.gs_def || 0) * 3,
    hp:   (skills.gs_hp || 0) * 4,
    spd:  (skills.gs_spd || 0) * 2,
    gold: (skills.gs_gold || 0) * 5,
    exp:  (skills.gs_exp || 0) * 4,
  };
};

export const getGangSkills = (gang) => {
  if (!gang || !gang.gangId) return {};
  if (gang.isOwner && gang.customGang) return gang.customGang.skills || {};
  const preset = GANG_PRESETS.find(g => g.id === gang.gangId);
  return preset ? preset.skills : {};
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

export const DEFAULT_GANG_STATE = {
  gangId: null,
  isOwner: false,
  customGang: null,
  contribution: 0,
  rank: 'member',
  dailyCounts: {
    salary: false,
    warCount: 0,
    taskProgress: {},
    taskCompleted: [],
    cafeRecruits: [],
    resetDate: null,
  },
};
