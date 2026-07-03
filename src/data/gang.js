// ==========================================
// 帮派系统 v2.0 - 国战联动·实用增益
// ==========================================

const WEI_GENERALS = [
  '曹操','夏侯惇','夏侯渊','张辽','徐晃','张郃','于禁','乐进','李典','曹仁',
  '曹洪','曹纯','典韦','许褚','荀彧','荀攸','郭嘉','贾诩','程昱','司马懿',
  '庞德','王朗','钟繇','蔡瑁','张绣','曹丕','曹植','邓艾','钟会','满宠',
];
const SHU_GENERALS = [
  '刘备','关羽','张飞','赵云','马超','黄忠','诸葛亮','庞统','法正','姜维',
  '魏延','严颜','马岱','王平','张翼','廖化','关兴','张苞','李严','吴懿',
  '糜竺','简雍','孙乾','马良','马谡','费祎','蒋琬','董允','黄权','刘封',
];
const WU_GENERALS = [
  '孙坚','孙策','孙权','周瑜','鲁肃','吕蒙','陆逊','甘宁','太史慈','黄盖',
  '程普','韩当','周泰','凌统','丁奉','徐盛','蒋钦','潘璋','朱然','陆抗',
  '诸葛瑾','张昭','顾雍','步骘','全琮','吕范','贺齐','孙桓','孙翊','朱桓',
];
const JIN_GENERALS = [
  '司马师','司马昭','司马炎','羊祜','杜预','王濬','贾充','张华','陈寿','文鸯',
  '王浑','王戎','裴秀','荀勖','卫瓘','马隆','唐彬','胡奋','石苞','陆机',
  '陆云','刘琨','祖逖','桓温','谢安','谢玄','陶侃','王导','庾亮','刘牢之',
];
const RECRUIT_NAMES = [...WEI_GENERALS, ...SHU_GENERALS, ...WU_GENERALS, ...JIN_GENERALS];

export const GANG_PRESETS = [
  // === 魏国 (4) ===
  {
    id: 'dragon_fang', name: '龙牙会', icon: '🐲', leader: '夏侯惇',
    style: '攻城拔寨', level: 5, power: 3200, desc: '崇尚力量的格斗帮派，攻城略地所向披靡', faction: 'wei',
    color: '#D32F2F',
    perkDesc: '国战贡献+20%, 金币+4%, 经验+2%',
    members: Array.from({length: 12}, (_, i) => ({
      name: WEI_GENERALS[i % WEI_GENERALS.length], level: 40 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_gold: 2, gs_exp: 1, gs_contrib: 2, gs_territory: 0, gs_trade: 1, gs_catch: 0, gs_power: 2, gs_eco: 1, gs_fusion: 1 },
    wins: 24,
    teamPool: [6, 9, 65, 94, 130, 143, 149, 168, 199, 241],
  },
  {
    id: 'shadow_guild', name: '暗影公会', icon: '🌑', leader: '郭嘉',
    style: '侦察暗杀', level: 4, power: 2800, desc: '行踪诡秘的暗杀组织，擅长情报与精灵捕获', faction: 'wei',
    color: '#37474F',
    perkDesc: '捕获率+2%, 经验+4%',
    members: Array.from({length: 10}, (_, i) => ({
      name: WEI_GENERALS[(i + 10) % WEI_GENERALS.length], level: 35 + i * 3, contribution: 80 + i * 40,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 0, gs_territory: 1, gs_trade: 0, gs_catch: 2, gs_power: 1, gs_eco: 1, gs_fusion: 2 },
    wins: 18,
    teamPool: [3, 18, 33, 94, 138, 190, 206, 241, 434, 437],
  },
  {
    id: 'iron_wall', name: '铁壁盟', icon: '🛡️', leader: '曹仁',
    style: '领地防御', level: 6, power: 3500, desc: '固若金汤的防御联盟，领地一旦到手绝不松手', faction: 'wei',
    color: '#455A64',
    perkDesc: '领地防御+6, 商队收入+1000金/日, 贡献+10%',
    members: Array.from({length: 14}, (_, i) => ({
      name: WEI_GENERALS[(i + 5) % WEI_GENERALS.length], level: 45 + i * 3, contribution: 120 + i * 55,
    })),
    skills: { gs_gold: 0, gs_exp: 0, gs_contrib: 1, gs_territory: 3, gs_trade: 2, gs_catch: 0, gs_power: 2, gs_eco: 2, gs_fusion: 1 },
    wins: 30,
    teamPool: [9, 65, 69, 134, 135, 136, 139, 169, 190, 225],
  },
  {
    id: 'tiger_cavalry', name: '虎豹骑', icon: '🐅', leader: '曹纯',
    style: '精锐突击', level: 5, power: 3400, desc: '曹操麾下王牌骑兵，国战冲锋第一军', faction: 'wei',
    color: '#1565C0',
    perkDesc: '国战贡献+30%, 经验+2%',
    members: Array.from({length: 12}, (_, i) => ({
      name: WEI_GENERALS[(i + 15) % WEI_GENERALS.length], level: 42 + i * 3, contribution: 110 + i * 50,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 3, gs_territory: 1, gs_trade: 0, gs_catch: 1, gs_power: 2, gs_eco: 1, gs_fusion: 2 },
    wins: 28,
    teamPool: [6, 9, 65, 94, 130, 143, 149, 199, 241, 443],
  },

  // === 蜀国 (4) ===
  {
    id: 'storm_riders', name: '风暴骑士团', icon: '⚡', leader: '姜维',
    style: '快速成长', level: 4, power: 3200, desc: '追求极速成长的精锐骑士，经验获取遥遥领先', faction: 'shu',
    color: '#F57F17',
    perkDesc: '经验+6%, 捕获率+1%',
    members: Array.from({length: 8}, (_, i) => ({
      name: SHU_GENERALS[(i + 10) % SHU_GENERALS.length], level: 30 + i * 4, contribution: 60 + i * 35,
    })),
    skills: { gs_gold: 0, gs_exp: 3, gs_contrib: 1, gs_territory: 0, gs_trade: 1, gs_catch: 1, gs_power: 1, gs_eco: 2, gs_fusion: 1 },
    wins: 12,
    teamPool: [3, 18, 130, 143, 160, 182, 446, 449, 455, 459],
  },
  {
    id: 'phoenix_order', name: '凤凰社', icon: '🔥', leader: '诸葛亮',
    style: '后勤支援', level: 5, power: 3000, desc: '以治愈与补给闻名，商队遍布天下', faction: 'shu',
    color: '#E64A19',
    perkDesc: '商队收入+1500金/日, 金币+4%, 领地防御+2',
    members: Array.from({length: 11}, (_, i) => ({
      name: SHU_GENERALS[(i + 5) % SHU_GENERALS.length], level: 38 + i * 3, contribution: 90 + i * 45,
    })),
    skills: { gs_gold: 2, gs_exp: 0, gs_contrib: 0, gs_territory: 1, gs_trade: 3, gs_catch: 0, gs_power: 1, gs_eco: 1, gs_fusion: 1 },
    wins: 22,
    teamPool: [6, 9, 140, 149, 168, 199, 443, 452, 461, 465],
  },
  {
    id: 'wild_pack', name: '野狼帮', icon: '🐺', leader: '马超',
    style: '野外猎手', level: 4, power: 2800, desc: '野性十足的冒险者，精灵捕获率极高', faction: 'shu',
    color: '#6D4C41',
    perkDesc: '捕获率+3%, 经验+2%',
    members: Array.from({length: 6}, (_, i) => ({
      name: SHU_GENERALS[(i + 20) % SHU_GENERALS.length], level: 25 + i * 4, contribution: 40 + i * 30,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 0, gs_territory: 0, gs_trade: 1, gs_catch: 3, gs_power: 1, gs_eco: 2, gs_fusion: 1 },
    wins: 6,
    teamPool: [3, 6, 18, 33, 69, 130, 143, 160, 168, 199],
  },
  {
    id: 'white_ear', name: '白耳精锐', icon: '🦅', leader: '赵云',
    style: '忠义护卫', level: 5, power: 3100, desc: '刘备亲卫白耳兵传承，国战攻防均衡', faction: 'shu',
    color: '#2E7D32',
    perkDesc: '国战贡献+20%, 领地防御+4',
    members: Array.from({length: 11}, (_, i) => ({
      name: SHU_GENERALS[(i + 15) % SHU_GENERALS.length], level: 40 + i * 3, contribution: 95 + i * 48,
    })),
    skills: { gs_gold: 1, gs_exp: 0, gs_contrib: 2, gs_territory: 2, gs_trade: 1, gs_catch: 0, gs_power: 2, gs_eco: 1, gs_fusion: 1 },
    wins: 20,
    teamPool: [6, 9, 140, 149, 160, 182, 199, 443, 465, 469],
  },

  // === 吴国 (4) ===
  {
    id: 'star_alliance', name: '星辰联盟', icon: '⭐', leader: '陆逊',
    style: '均衡发展', level: 4, power: 2900, desc: '智者联盟，各方面均衡发展', faction: 'wu',
    color: '#1565C0',
    perkDesc: '经验+4%, 金币+2%, 贡献+10%',
    members: Array.from({length: 10}, (_, i) => ({
      name: WU_GENERALS[(i + 5) % WU_GENERALS.length], level: 36 + i * 3, contribution: 85 + i * 42,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 1, gs_territory: 1, gs_trade: 0, gs_catch: 1, gs_power: 1, gs_eco: 2, gs_fusion: 1 },
    wins: 20,
    teamPool: [33, 65, 94, 138, 139, 182, 206, 437, 463, 467],
  },
  {
    id: 'golden_lotus', name: '金莲堂', icon: '🪷', leader: '鲁肃',
    style: '财源广进', level: 7, power: 4000, desc: '富可敌国的商业帮会，金币收入无人能比', faction: 'wu',
    color: '#FF8F00',
    perkDesc: '金币+6%, 商队收入最高',
    members: Array.from({length: 15}, (_, i) => ({
      name: WU_GENERALS[(i + 10) % WU_GENERALS.length], level: 50 + i * 3, contribution: 150 + i * 60,
    })),
    skills: { gs_gold: 3, gs_exp: 0, gs_contrib: 0, gs_territory: 0, gs_trade: 3, gs_catch: 0, gs_power: 1, gs_eco: 1, gs_fusion: 1 },
    wins: 35,
    teamPool: [9, 65, 94, 130, 139, 149, 190, 206, 241, 443],
  },
  {
    id: 'brocade_sail', name: '锦帆军', icon: '⚓', leader: '甘宁',
    style: '水上霸主', level: 5, power: 3300, desc: '昔日锦帆贼，今朝水军先锋，国战贡献极高', faction: 'wu',
    color: '#00838F',
    perkDesc: '国战贡献+30%, 捕获率+1%',
    members: Array.from({length: 12}, (_, i) => ({
      name: WU_GENERALS[i % WU_GENERALS.length], level: 38 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 3, gs_territory: 1, gs_trade: 0, gs_catch: 1, gs_power: 2, gs_eco: 1, gs_fusion: 2 },
    wins: 26,
    teamPool: [33, 65, 94, 138, 182, 206, 437, 463, 467, 471],
  },
  {
    id: 'danyang_elite', name: '丹阳精兵', icon: '🗡️', leader: '朱桓',
    style: '全能战士', level: 4, power: 2700, desc: '江东丹阳出精兵，领地攻守兼备', faction: 'wu',
    color: '#AD1457',
    perkDesc: '领地防御+4, 经验+2%, 金币+2%, 贡献+10%',
    members: Array.from({length: 9}, (_, i) => ({
      name: WU_GENERALS[(i + 20) % WU_GENERALS.length], level: 34 + i * 3, contribution: 75 + i * 40,
    })),
    skills: { gs_gold: 1, gs_exp: 1, gs_contrib: 1, gs_territory: 2, gs_trade: 1, gs_catch: 0, gs_power: 1, gs_eco: 2, gs_fusion: 1 },
    wins: 16,
    teamPool: [9, 33, 65, 94, 138, 139, 182, 437, 463, 479],
  },

  // === 晋国 (4) ===
  {
    id: 'xuanwu_guard', name: '玄武卫', icon: '🐢', leader: '羊祜',
    style: '铁壁统御', level: 6, power: 3600, desc: '司马家嫡系精锐，统一天下的钢铁意志', faction: 'jin',
    color: '#4A148C',
    perkDesc: '领地防御+6, 国战贡献+20%, 贡献+10%',
    members: Array.from({length: 13}, (_, i) => ({
      name: JIN_GENERALS[i % JIN_GENERALS.length], level: 44 + i * 3, contribution: 115 + i * 55,
    })),
    skills: { gs_gold: 1, gs_exp: 0, gs_contrib: 2, gs_territory: 3, gs_trade: 1, gs_catch: 0, gs_power: 2, gs_eco: 1, gs_fusion: 2 },
    wins: 32,
    teamPool: [9, 65, 87, 94, 130, 139, 190, 199, 241, 443],
  },
  {
    id: 'tianluo_net', name: '天罗网', icon: '🕸️', leader: '贾充',
    style: '情报操控', level: 5, power: 3100, desc: '遍布天下的情报网络，无人能逃其掌控', faction: 'jin',
    color: '#311B92',
    perkDesc: '捕获率+2%, 经验+4%, 金币+2%',
    members: Array.from({length: 11}, (_, i) => ({
      name: JIN_GENERALS[(i + 8) % JIN_GENERALS.length], level: 38 + i * 3, contribution: 90 + i * 45,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 1, gs_territory: 0, gs_trade: 1, gs_catch: 2, gs_power: 1, gs_eco: 1, gs_fusion: 2 },
    wins: 22,
    teamPool: [3, 18, 33, 94, 132, 138, 206, 434, 437, 441],
  },
  {
    id: 'longxiang_army', name: '龙骧军', icon: '🐉', leader: '王濬',
    style: '灭国水师', level: 7, power: 4200, desc: '楼船万里，顺流而下灭东吴的传奇水师', faction: 'jin',
    color: '#1A237E',
    perkDesc: '国战贡献+30%, 商队收入+1000金/日',
    members: Array.from({length: 15}, (_, i) => ({
      name: JIN_GENERALS[(i + 5) % JIN_GENERALS.length], level: 48 + i * 3, contribution: 140 + i * 60,
    })),
    skills: { gs_gold: 0, gs_exp: 1, gs_contrib: 3, gs_territory: 1, gs_trade: 2, gs_catch: 0, gs_power: 2, gs_eco: 2, gs_fusion: 1 },
    wins: 36,
    teamPool: [22, 24, 65, 94, 130, 149, 182, 199, 443, 465],
  },
  {
    id: 'beifu_elite', name: '北府精锐', icon: '🦁', leader: '谢玄',
    style: '以少胜多', level: 5, power: 3300, desc: '淝水之战以少胜多，北府兵名震天下', faction: 'jin',
    color: '#0D47A1',
    perkDesc: '经验+4%, 国战贡献+20%, 领地防御+4',
    members: Array.from({length: 12}, (_, i) => ({
      name: JIN_GENERALS[(i + 20) % JIN_GENERALS.length], level: 40 + i * 3, contribution: 100 + i * 50,
    })),
    skills: { gs_gold: 1, gs_exp: 2, gs_contrib: 2, gs_territory: 2, gs_trade: 0, gs_catch: 0, gs_power: 1, gs_eco: 2, gs_fusion: 2 },
    wins: 26,
    teamPool: [6, 9, 65, 130, 143, 160, 190, 199, 241, 469],
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
  { id: 'gs_power',    name: '武力精进', desc: '全队HP/物攻/物防/特攻/特防+{val}%（PvE生效）', maxLv: 3, costPerLv: 8000, valPerLv: 2,  icon: '💪' },
  { id: 'gs_eco',      name: '生态守望', desc: '圣域建设费用-{val}%',      maxLv: 3, costPerLv: 6000, valPerLv: 5,  icon: '🌿' },
  { id: 'gs_fusion',   name: '融合先驱', desc: '跨体系PVE效率+{val}%',     maxLv: 3, costPerLv: 7000, valPerLv: 5,  icon: '✨' },
];

export const GANG_TASKS = [
  { id: 'battle_5',   name: '战斗演练', desc: '赢得5场战斗',        type: 'battle_win',  target: 5,    reward: 30, gold: 1000, icon: '⚔️' },
  { id: 'battle_10',  name: '精锐出击', desc: '赢得10场战斗',       type: 'battle_win',  target: 10,   reward: 60, gold: 2000, icon: '🗡️' },
  { id: 'donate_gold', name: '资金捐献', desc: '捐献5000金币给帮派', type: 'donate_gold', target: 5000, reward: 40, gold: 0,    icon: '💰' },
  { id: 'donate_pet',  name: '精灵上供', desc: '上交1只Lv20+精灵',  type: 'donate_pet',  target: 1,    reward: 50, gold: 500,  icon: '🐾' },
  { id: 'explore',     name: '领地巡逻', desc: '探索3张不同地图',    type: 'explore_map', target: 3,    reward: 25, gold: 800,  icon: '🗺️' },
  { id: 'kw_battle',   name: '国战先锋', desc: '击败3个敌国训练师', type: 'kw_kill',     target: 3,    reward: 40, gold: 1500, icon: '🏴', reqKingdom: true },
  { id: 'kw_campaign', name: '名将之路', desc: '通关1个四国副本',   type: 'kw_campaign', target: 1,    reward: 80, gold: 3000, icon: '👑', reqKingdom: true },
  { id: 'kw_contrib',  name: '国战功勋', desc: '获得100点国战战功', type: 'kw_contrib',  target: 100,  reward: 50, gold: 2000, icon: '🎖️', reqKingdom: true },
  { id: 'catch_3',     name: '精灵收集', desc: '捕捉3只精灵',       type: 'catch',       target: 3,    reward: 30, gold: 1000, icon: '🎯' },
  { id: 'heal_5',      name: '治愈师',   desc: '治愈5次精灵',       type: 'heal',        target: 5,    reward: 25, gold: 800,  icon: '💊' },
  { id: 'evolve_1',    name: '进化训练', desc: '进化1只精灵',       type: 'evolve',      target: 1,    reward: 35, gold: 1200, icon: '✨' },
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

export const getGangSkillBonus = (skills, mult = 1) => {
  if (!skills) return { atk: 0, def: 0, s_atk: 0, s_def: 0, hp: 0, spd: 0, gold: 0, exp: 0, contrib: 0, territory: 0, trade: 0, catchRate: 0, sanctuaryCostReduce: 0, fusionPveBonus: 0 };
  const m = Math.max(1, mult || 1);
  const power = (skills.gs_power || 0) * 2 * m;
  return {
    atk: power, def: power, s_atk: power, s_def: power, hp: power, spd: 0,
    gold:      Math.floor((skills.gs_gold      || 0) * 2 * m),
    exp:       Math.floor((skills.gs_exp       || 0) * 2 * m),
    contrib:   Math.floor((skills.gs_contrib   || 0) * 10 * m),
    territory: Math.floor((skills.gs_territory || 0) * 2 * m),
    trade:     Math.floor((skills.gs_trade     || 0) * 500 * m),
    catchRate: Math.floor((skills.gs_catch     || 0) * 1 * m),
    sanctuaryCostReduce: Math.floor((skills.gs_eco || 0) * 5 * m),
    fusionPveBonus: Math.floor((skills.gs_fusion || 0) * 5 * m),
  };
};

/** PvP/竞技场：移除 gs_power 等战斗属性加成，保留经济类加成 */
export const stripGangCombatBonus = (bonus) => {
  if (!bonus) return { atk: 0, def: 0, s_atk: 0, s_def: 0, hp: 0, spd: 0, gold: 0, exp: 0, contrib: 0, territory: 0, trade: 0, catchRate: 0, sanctuaryCostReduce: 0, fusionPveBonus: 0 };
  return { ...bonus, atk: 0, def: 0, s_atk: 0, s_def: 0, hp: 0, spd: 0 };
};

export const getGangMaxSkills = (gang) => {
  if (!gang || !gang.gangId) return {};
  if (gang.isOwner && gang.customGang) return gang.customGang.skills || {};
  const preset = GANG_PRESETS.find(g => g.id === gang.gangId);
  return preset ? preset.skills : {};
};

export const getGangSkills = (gang, capBonus = 0) => {
  if (!gang || !gang.gangId) return {};
  const maxSkills = getGangMaxSkills(gang);
  const personal = gang.personalSkills || {};
  const result = {};
  const bonusCap = Math.max(0, capBonus || 0);
  for (const skill of GANG_SKILLS) {
    const cap = (maxSkills[skill.id] || 0) + bonusCap;
    const cur = personal[skill.id] || 0;
    result[skill.id] = Math.min(cur, cap);
  }
  return result;
};

export const getGangWarLevel = (targetGang) => {
  const lv = targetGang.level || 1;
  return Math.min(100, 50 + lv * 5);
};

export const getGangWarReward = (targetGang) => {
  const lv = targetGang.level || 1;
  return {
    funds: GANG_WAR_CONFIG.baseFunds + lv * GANG_WAR_CONFIG.fundsPerLevel,
    contribution: GANG_WAR_CONFIG.baseContribution + lv * GANG_WAR_CONFIG.contributionPerLevel,
  };
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const getRankIndex = (rankId) => Math.max(0, GANG_RANKS.findIndex(r => r.id === rankId));

export const evaluateGangWarTarget = ({ targetGang, ownGang, rank, kingdomWar, partyAvgLevel = 50 }) => {
  if (!targetGang) return null;
  const reward = getGangWarReward(targetGang);
  const enemyLv = getGangWarLevel(targetGang);
  const ownRankIdx = getRankIndex(rank?.id || 'member');
  const ownPower = (ownGang?.power || 1200) + partyAvgLevel * 38 + ownRankIdx * 220 + ((kingdomWar?.faction && ownGang?.faction === kingdomWar.faction) ? 260 : 0);
  const enemyPower = (targetGang.power || 1200) + enemyLv * 34 + (targetGang.wins || 0) * 18;
  const pressure = ownPower / Math.max(1, enemyPower);
  const winChance = clamp(0.12 + (pressure / (pressure + 0.95)) * 0.8, 0.12, 0.9);
  const rewardScore = Math.round(reward.contribution * 1.4 + reward.funds / 180 + enemyLv * 0.35);
  const riskLabel = winChance >= 0.72 ? '稳胜' : winChance >= 0.56 ? '可战' : winChance >= 0.42 ? '胶着' : '高危';
  const difficultyScore = Math.round(clamp((1 - winChance) * 72 + enemyLv * 0.22 + Math.max(0, (targetGang.wins || 0) - (ownGang?.wins || 0)) * 1.8, 8, 96));
  const preparation = [];
  if (partyAvgLevel < enemyLv - 8) preparation.push(`首发均级建议提升到 Lv.${Math.max(1, enemyLv - 6)} 左右`);
  if (winChance < 0.62) preparation.push('先做帮派任务换帮贡，补战力/贡献类技能');
  if (kingdomWar?.faction && targetGang.faction === kingdomWar.faction) preparation.push('同阵营目标会牵制盟友，除非急缺资金不建议打');
  if ((ownGang?.funds || 0) < 5000 && reward.funds >= 5000) preparation.push('资金短缺时可冒险打高资金目标');
  const advice = [];
  if (winChance < 0.5) advice.push('先提升首发等级或帮派技能');
  if (targetGang.faction && kingdomWar?.faction && targetGang.faction !== kingdomWar.faction) advice.push('敌国帮派，胜利会顺带推进国战任务');
  if ((targetGang.skills?.gs_trade || 0) >= 2) advice.push('商队型目标，资金收益更高');
  if ((targetGang.skills?.gs_contrib || 0) >= 2) advice.push('军功型目标，帮贡回报更好');

  return {
    targetId: targetGang.id,
    enemyLv,
    reward,
    pressure,
    winChance,
    riskLabel,
    difficultyScore,
    rewardScore,
    preparation: preparation.length ? preparation : ['无需额外准备，适合作为今日稳定目标'],
    counterplay: winChance < 0.56 ? '先打低风险目标滚资源，再回头挑战' : (rewardScore >= 90 ? '高收益窗口，适合消耗一次帮战次数' : '收益一般，按任务需求选择'),
    advice: advice.length ? advice : ['配置均衡，可作为今日帮战目标'],
  };
};

export const buildGangCommandPlan = ({ gangInfo, gang, dailyCounts, kingdomWar, partyAvgLevel = 50 }) => {
  const completed = dailyCounts?.taskCompleted || [];
  const progress = dailyCounts?.taskProgress || {};
  const rank = getGangRank(gang?.contribution || 0, gang?.isOwner);
  const rankIdx = getRankIndex(rank?.id);
  const skills = getGangSkills(gang);
  const bonus = getGangSkillBonus(skills);
  const aligned = !!(kingdomWar?.faction && gangInfo?.faction === kingdomWar.faction);
  const warLeft = Math.max(0, GANG_WAR_CONFIG.maxDaily - (dailyCounts?.warCount || 0));

  const taskPlan = GANG_TASKS
    .map(task => {
      const rawProgress = Math.min(progress[task.id] || 0, task.target);
      const done = completed.includes(task.id);
      const claimed = completed.includes(`${task.id}_claimed`);
      let score = done && !claimed ? 120 : 30 + (rawProgress / Math.max(1, task.target)) * 45;
      if (task.type.startsWith('kw') && kingdomWar?.faction) score += aligned ? 28 : 14;
      if (task.type === 'battle_win') score += partyAvgLevel >= 35 ? 12 : -8;
      if (task.type === 'donate_gold') score += (gang?.isOwner || (gang?.contribution || 0) < 600) ? 10 : -4;
      if (claimed) score = -10;
      return { ...task, progress: rawProgress, done, claimed, score: Math.round(score) };
    })
    .sort((a, b) => b.score - a.score);

  const skillWeights = {
    gs_contrib: kingdomWar?.faction ? 1.35 : 0.85,
    gs_territory: aligned ? 1.25 : 0.9,
    gs_trade: (gang?.isOwner || bonus.trade < 1000) ? 1.15 : 0.95,
    gs_exp: partyAvgLevel < 70 ? 1.2 : 0.9,
    gs_power: rankIdx >= 2 ? 1.12 : 0.92,
    gs_catch: 1.0,
    gs_gold: 1.0,
    gs_eco: 0.92,
    gs_fusion: 0.95,
  };
  const skillPlan = GANG_SKILLS
    .map(skill => {
      const maxLv = getGangMaxSkills(gang)[skill.id] || 0;
      const curLv = gang?.isOwner ? maxLv : Math.min(gang?.personalSkills?.[skill.id] || 0, maxLv);
      const room = Math.max(0, maxLv - curLv);
      const weight = skillWeights[skill.id] || 1;
      return { ...skill, curLv, maxLv, score: Math.round(room * weight * 100 + (maxLv > 0 ? 10 : 0)) };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const economyPressure = (gang?.isOwner && (gang?.customGang?.funds || 0) < 8000) || (!gang?.isOwner && (gang?.contribution || 0) < 260);
  const warPressure = warLeft > 0 && partyAvgLevel < 45;
  const managementLoad = Math.min(100, Math.round(
    (economyPressure ? 28 : 8) +
    (warLeft / Math.max(1, GANG_WAR_CONFIG.maxDaily)) * 24 +
    (taskPlan.filter(t => !t.claimed && !t.done).length / Math.max(1, GANG_TASKS.length)) * 22 +
    (aligned ? 8 : kingdomWar?.faction ? 16 : 6) +
    Math.max(0, 3 - rankIdx) * 5
  ));
  const depthLevers = [
    {
      label: '资金 vs 帮贡',
      value: gang?.isOwner ? `${gang?.customGang?.funds || 0}资金` : `${gang?.contribution || 0}帮贡`,
      desc: gang?.isOwner ? '帮主优先开技能上限，成员才有成长空间。' : '成员要在个人技能和职位晋升之间分配帮贡。',
    },
    {
      label: '帮战次数',
      value: `${warLeft}/${GANG_WAR_CONFIG.maxDaily}`,
      desc: warLeft > 0 ? '高风险目标会吃掉当日机会，先确认收益是否值得。' : '今日帮战打满，转向任务和技能投资。',
    },
    {
      label: '国战协同',
      value: aligned ? '同阵营' : kingdomWar?.faction ? '错位' : '未参战',
      desc: aligned ? '国战任务和贡献技能收益更高。' : '错位时优先通用成长，避免资源被两条线拉扯。',
    },
  ];

  const focus = aligned
    ? { label: '阵营协同', desc: '帮派与国战阵营一致，优先做国战任务和贡献技能。' }
    : kingdomWar?.faction
      ? { label: '双线经营', desc: '帮派与阵营不一致，先做通用任务，帮战挑高收益目标。' }
      : { label: '成长储备', desc: '未加入国战，先靠日常、经验和商队把帮贡滚起来。' };

  return {
    focus,
    rank,
    aligned,
    warLeft,
    managementLoad,
    depthLevers,
    taskPlan,
    skillPlan,
    metrics: [
      { label: '帮贡效率', value: `+${bonus.contrib || 0}%` },
      { label: '商队收入', value: `${bonus.trade || 0}/日` },
      { label: '领地防御', value: `+${bonus.territory || 0}` },
      { label: '今日帮战', value: `${warLeft}/${GANG_WAR_CONFIG.maxDaily}` },
      { label: '管理压力', value: `${managementLoad}/100` },
    ],
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
