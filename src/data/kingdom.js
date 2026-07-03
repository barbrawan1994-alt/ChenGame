// ==========================================
// 国战系统 - 魏蜀吴晋四国争霸
// ==========================================

export const FACTIONS = {
  wei: {
    id: 'wei', name: '魏', fullName: '魏国', icon: '⚔️',
    color: '#1565C0', darkColor: '#0D47A1', lightColor: '#42A5F5',
    lord: '曹操', motto: '挟天子以令诸侯',
    desc: '崇尚军事力量的北方强国，麾下帮派皆为精锐之师。',
    bonus: { gold: 8, exp: 5, catchRate: 0, contribution: 8 },
    bonusDesc: '金币+8%, 经验+5%, 战功+8%',
  },
  shu: {
    id: 'shu', name: '蜀', fullName: '蜀国', icon: '🛡️',
    color: '#2E7D32', darkColor: '#1B5E20', lightColor: '#66BB6A',
    lord: '刘备', motto: '仁德布天下',
    desc: '以仁德治国的西方王国，注重将士成长与续航能力。',
    bonus: { gold: 5, exp: 12, catchRate: 2, contribution: 8 },
    bonusDesc: '经验+12%, 金币+5%, 捕获率+2%, 战功+8%',
  },
  wu: {
    id: 'wu', name: '吴', fullName: '吴国', icon: '🏹',
    color: '#C62828', darkColor: '#B71C1C', lightColor: '#EF5350',
    lord: '孙权', motto: '据江东以观天下',
    desc: '富庶善贾的东方大国，以财力和精准著称。',
    bonus: { gold: 12, exp: 5, catchRate: 3, contribution: 8 },
    bonusDesc: '金币+12%, 经验+5%, 捕获率+3%, 战功+8%',
  },
  jin: {
    id: 'jin', name: '晋', fullName: '晋国', icon: '🐉',
    color: '#4A148C', darkColor: '#311B92', lightColor: '#9C27B0',
    lord: '司马炎', motto: '天命归晋，一统河山',
    desc: '继承魏国基业的统一之国，兼具军事智谋与防御体系，生态建设强于他国。',
    bonus: { gold: 6, exp: 6, catchRate: 1, contribution: 10, ecoBonus: 5, sanctuaryBonus: 5 },
    bonusDesc: '战功+10%, 金币+6%, 经验+6%, 捕获率+1%, 圣域/生态效率+5%',
  },
  /** 玩家不可选；名城争夺条中的 NPC 势力 */
  qun: {
    id: 'qun', name: '群雄', fullName: '诸侯群雄', icon: '🏴',
    color: '#6A1B9A', darkColor: '#4A148C', lightColor: '#BA68C8',
    lord: '诸侯', motto: '乱世逐鹿',
    desc: '吕布袁绍等诸侯联军，在洛阳荆州汉中与四国角力，不享受阵营天赋但会分走占领积分。',
    bonus: { gold: 0, exp: 0, catchRate: 0, contribution: 0 },
    bonusDesc: '名城争夺 NPC',
  },
};

export const FACTION_IDS = ['wei', 'shu', 'wu', 'jin'];
export const ALL_FACTION_IDS = ['wei', 'shu', 'wu', 'jin', 'qun'];

// 初始领土分配（群雄也持有一些地图）
export const INITIAL_TERRITORIES = {
  1:  'shu', 2:  'jin', 3:  'jin', 4:  'wu',
  5:  'wei', 6:  'shu', 7:  'wu',  8:  'wei',
  9:  'qun', 10: 'wei', 11: 'shu', 12: 'jin',
  13: 'qun',
  204: 'neutral', 205: 'neutral', 206: 'neutral',
};

// 参战地图ID列表（含3张中立争夺城池）
export const WAR_MAP_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 204, 205, 206];

// 名城争夺城池ID（独立争夺条系统）
export const CONTESTED_MAP_IDS = [204, 205, 206];

// 阵营兵种偏好（AI生成驻军/攻城配置时使用）
export const FACTION_TROOP_BIAS = {
  wei: { shield: 0.22, spear: 0.12, cavalry: 0.24, archer: 0.14, siege: 0.16, raider: 0.12 },
  shu: { shield: 0.14, spear: 0.24, cavalry: 0.12, archer: 0.20, siege: 0.12, raider: 0.18 },
  wu:  { shield: 0.12, spear: 0.14, cavalry: 0.16, archer: 0.26, siege: 0.10, raider: 0.22 },
  jin: { shield: 0.20, spear: 0.16, cavalry: 0.18, archer: 0.16, siege: 0.18, raider: 0.12 },
  qun: { shield: 0.10, spear: 0.14, cavalry: 0.28, archer: 0.10, siege: 0.12, raider: 0.26 },
};

/** 根据阵营偏好和总兵力生成六兵种分配 */
export const generateGarrison = (factionId, totalTroops) => {
  const safeTroops = Math.max(6, Math.floor(Number(totalTroops) || 6));
  const bias = FACTION_TROOP_BIAS[factionId] || FACTION_TROOP_BIAS.qun;
  const KW_TROOP_KEYS = ['shield', 'spear', 'cavalry', 'archer', 'siege', 'raider'];
  const garrison = {};
  let assigned = 0;
  KW_TROOP_KEYS.forEach((tid) => {
    const raw = Math.floor(safeTroops * (bias[tid] || 1/6) * (0.85 + Math.random() * 0.3));
    const val = Math.max(1, raw);
    garrison[tid] = val;
    assigned += val;
  });
  const diff = safeTroops - assigned;
  if (diff !== 0) {
    const key = KW_TROOP_KEYS[Math.floor(Math.random() * KW_TROOP_KEYS.length)];
    garrison[key] = Math.max(1, garrison[key] + diff);
  }
  return garrison;
};

/** 计算驻军总兵力 */
export const getGarrisonTotal = (garrison) => {
  if (!garrison) return 0;
  return Object.values(garrison).reduce((s, v) => s + (v || 0), 0);
};

// 军衔/官职系统（12级）
export const MILITARY_RANKS = [
  { id: 'civilian',    name: '百姓',    icon: '👤', minContribution: 0,       salary: 200,    incomeMultiplier: 1.0,  perk: null, perkDesc: null, maxGenerals: 3, tokenBonus: 0 },
  { id: 'soldier',     name: '士卒',    icon: '🪖', minContribution: 50,      salary: 400,    incomeMultiplier: 1.05, perk: 'basic_scout', perkDesc: '解锁侦察：查看相邻领地强度', maxGenerals: 4, tokenBonus: 0 },
  { id: 'captain',     name: '校尉',    icon: '🎖️', minContribution: 150,     salary: 800,    incomeMultiplier: 1.15, perk: 'recruit_discount', perkDesc: '名将招募费用 -10%', maxGenerals: 5, tokenBonus: 1 },
  { id: 'commander',   name: '中郎将',  icon: '⚔️', minContribution: 400,     salary: 1500,   incomeMultiplier: 1.25, perk: 'war_rally', perkDesc: '每日可发动1次集结令（己方领地+5强度）', maxGenerals: 6, tokenBonus: 1 },
  { id: 'general_l',   name: '偏将军',  icon: '🗡️', minContribution: 800,     salary: 2500,   incomeMultiplier: 1.35, perk: 'general_boost', perkDesc: '名将加成效果 +15%', maxGenerals: 7, tokenBonus: 2 },
  { id: 'general',     name: '将军',    icon: '⚔️', minContribution: 1500,    salary: 4000,   incomeMultiplier: 1.5,  perk: 'territory_shield', perkDesc: '拥有的领地每回合额外+1强度', maxGenerals: 8, tokenBonus: 2 },
  { id: 'general_h',   name: '征东将军', icon: '🏹', minContribution: 2800,    salary: 6000,   incomeMultiplier: 1.7,  perk: 'double_token', perkDesc: '所有战斗令牌收入 ×2', maxGenerals: 9, tokenBonus: 3 },
  { id: 'grand_gen',   name: '大将军',  icon: '🛡️', minContribution: 5000,    salary: 9000,   incomeMultiplier: 2.0,  perk: 'siege_master', perkDesc: '攻城投石效果翻倍（-20强度）', maxGenerals: 10, tokenBonus: 4 },
  { id: 'minister',    name: '丞相',    icon: '📜', minContribution: 8000,    salary: 12000,  incomeMultiplier: 2.3,  perk: 'tax_reform', perkDesc: '领地收入 +50%，帮派俸禄 +30%', maxGenerals: 11, tokenBonus: 5 },
  { id: 'king',        name: '国主',    icon: '👑', minContribution: 12000,   salary: 16000,  incomeMultiplier: 2.5,  perk: 'royal_decree', perkDesc: '每日1次颁布王令（全阵营领地+3强度）', maxGenerals: 12, tokenBonus: 6 },
  { id: 'hegemon',     name: '霸王',    icon: '🐉', minContribution: 20000,   salary: 22000,  incomeMultiplier: 3.0,  perk: 'hegemon_aura', perkDesc: '战斗中全队经验+25%，金币+25%', maxGenerals: 12, tokenBonus: 8 },
  { id: 'emperor',     name: '天子',    icon: '🏯', minContribution: 35000,   salary: 30000,  incomeMultiplier: 3.5,  perk: 'mandate_of_heaven', perkDesc: '天命所归：全加成+30%，每赛季额外50令牌', maxGenerals: 12, tokenBonus: 12 },
];

// 官职晋升挑战（达到战功门槛后需通过挑战才能晋升）
export const RANK_PROMOTION_CHALLENGES = {
  commander: { type: 'kill', desc: '击败20名敌国训练师', target: 20, stat: 'kills' },
  general_l: { type: 'campaign', desc: '通关至少2个阵营战役', target: 2, stat: 'campaignsCleared' },
  general: { type: 'territory', desc: '阵营控制至少5块领地', target: 5, stat: 'factionTerritories' },
  general_h: { type: 'generals', desc: '招募至少5名名将', target: 5, stat: 'recruitedGenerals' },
  grand_gen: { type: 'historical', desc: '通关至少10场历史名战', target: 10, stat: 'historicalBattles' },
  minister: { type: 'contribution', desc: '单赛季内获得3000战功', target: 3000, stat: 'seasonContribution' },
  king: { type: 'siege', desc: '成功参与3次都城攻防', target: 3, stat: 'capitalSieges' },
  hegemon: { type: 'multi', desc: '通关本阵营全部8场战役 + 拥有8名名将 + 控制7+领地', targets: { campaignsCleared: 8, recruitedGenerals: 8, factionTerritories: 7 } },
  emperor: { type: 'ultimate', desc: '通关25场历史名战 + 战功35000 + 获得"霸主"赛季称号', targets: { historicalBattles: 25, totalContribution: 35000, hasHegemonTitle: true } },
};

// 官职特权详细效果
export const RANK_PERK_EFFECTS = {
  basic_scout: { scoutRange: 1 },
  recruit_discount: { recruitCostMult: 0.9 },
  war_rally: { rallyStrength: 5, rallyPerDay: 1 },
  general_boost: { generalBonusMult: 1.15 },
  territory_shield: { territoryStrengthPerTick: 1 },
  double_token: { tokenMult: 2 },
  siege_master: { siegeEffectMult: 2 },
  tax_reform: { territoryIncomeMult: 1.5, gangSalaryMult: 1.3 },
  royal_decree: { decreeStrength: 3, decreePerDay: 1 },
  hegemon_aura: { battleExpMult: 1.25, battleGoldMult: 1.25 },
  mandate_of_heaven: { allBonusMult: 1.3, seasonBonusTokens: 50 },
};

export const getMilitaryRank = (contribution, playerStats = null) => {
  let rank = MILITARY_RANKS[0];
  for (const r of MILITARY_RANKS) {
    if (contribution < r.minContribution) continue;
    if (playerStats && RANK_PROMOTION_CHALLENGES[r.id]) {
      const ch = RANK_PROMOTION_CHALLENGES[r.id];
      if (ch.type === 'multi') {
        const allMet = Object.entries(ch.targets).every(([k, v]) => (playerStats[k] || 0) >= v);
        if (!allMet) continue;
      } else if (ch.type === 'ultimate') {
        const allMet = Object.entries(ch.targets).every(([k, v]) => {
          if (typeof v === 'boolean') return !!playerStats[k];
          return (playerStats[k] || 0) >= v;
        });
        if (!allMet) continue;
      } else {
        if ((playerStats[ch.stat] || 0) < ch.target) continue;
      }
    }
    rank = r;
  }
  return rank;
};

// 敌国训练师名称池
export const FACTION_TRAINER_NAMES = {
  wei: ['铁卫', '锋将', '暗探', '重甲兵', '先锋官', '军师', '虎豹骑', '典军校尉'],
  shu: ['义士', '锦马超', '仁勇卫', '白耳兵', '无当飞军', '军策师', '虎贲将', '龙骑士'],
  wu: ['锐士', '甘宁水手', '弓弩手', '江东猛虎', '水军都督', '火攻师', '锦帆贼', '破浪将'],
  jin: ['玄武卫', '龙骧将', '北府兵', '天罗使', '铁甲骑', '洛阳校尉', '征南将', '护国师'],
};

// 令牌商店
export const TOKEN_SHOP = [
  { id: 'heal_all',    name: '军粮补给',  cost: 5,   icon: '🍖', desc: '全队HP回满', type: 'consumable' },
  { id: 'exp_buff',    name: '军功令',    cost: 8,   icon: '📜', desc: '下10场战斗EXP +50%', type: 'buff' },
  { id: 'siege',       name: '攻城投石',  cost: 15,  icon: '🪨', desc: '指定敌方领地 strength -10', type: 'war' },
  { id: 'war_ball',    name: '国战精灵球', cost: 12,  icon: '⚔️', desc: '捕获率3.0x (限交战地图)', type: 'consumable' },
  { id: 'flag',        name: '阵营旗帜',  cost: 30,  icon: '🚩', desc: '己方领地 strength +15', type: 'war' },
  { id: 'tiger_seal',  name: '虎符',     cost: 50,  icon: '🐯', desc: '下次war tick己方攻击力 +50%', type: 'buff' },
  { id: 'war_armor',   name: '国战战甲',  cost: 80,  icon: '🛡️', desc: '阵营专属饰品(ATK/DEF+8%)', type: 'equipment' },
  { id: 'jade_seal',   name: '传国玉玺',  cost: 200, icon: '🏆', desc: '传说饰品(全属性+5%, 特殊头衔)', type: 'equipment' },
];

// 赛季配置
export const SEASON_CONFIG = {
  durationDays: 7,
  rewards: {
    1: { gold: 800, tokens: 30, title: '霸主' },
    2: { gold: 500, tokens: 15, title: '强者' },
    3: { gold: 200, tokens: 8,  title: null },
  },
  mvpBonus: { tokens: 100, title: '战神' },
  contributionCarryover: 0.5,
};

// War Tick 配置
export const WAR_TICK_CONFIG = {
  intervalMs: 180000,
  maxCatchupTicks: 20,
  strengthDecayPerTick: 2,
  minStrength: 25,
  maxStrength: 100,
  newTerritoryStrength: 35,
  underdogBonus: 0.4,
  overextendThreshold: 7,
  overextendDecayMultiplier: 3,
  playerKillStrengthBonus: 2,
  playerKillAttackBonus: 4,
  /** 名城(洛阳/荆州/汉中)不在自动 War Tick 中被 AI 易主，仅由「争夺条 + 攻城」结算同步 */
  aiAggressionBonus: 1.12,
};

// 默认国战状态
export const DEFAULT_KINGDOM_WAR = {
  faction: null,
  warContribution: 0,
  factionTokens: 0,
  militaryRank: 'civilian',
  dailyCounts: { income: false, kills: 0, capitalReward: false, resetDate: null },
  territories: {},
  warLog: [],
  collectedGeneralIds: [],
  generalDraws: 0,
  lastTick: null,
  season: 1,
  seasonStartDate: null,
  expBuffBattles: 0,
  attackBuff: false,
  warBalls: 0,
  seasonTitles: [],
  completedCampaigns: [],
  completedHistoricalBattles: [],
  recruitedGenerals: [],
  contestProgress: {},
  /** 可调配的预备兵力池（征兵增长，攻城消耗） */
  kwManpowerReserve: 140,
  /** 玩家发动普通地图攻城的每日次数 */
  dailySiegeCount: 0,
  dailySiegeDate: null,
};

export const initTerritories = () => {
  const territories = {};
  for (const [mapId, owner] of Object.entries(INITIAL_TERRITORIES)) {
    const baseTroops = owner === 'neutral' ? 120 : 80;
    territories[mapId] = {
      owner,
      strength: owner === 'neutral' ? 80 : 60,
      garrison: (owner !== 'neutral') ? generateGarrison(owner, baseTroops) : generateGarrison('qun', baseTroops),
      contested: false,
      attackerFaction: null,
      attackProgress: 0,
      playerContribution: 0,
      lastBattleTime: null,
    };
  }
  return territories;
};

// 计算阵营国力
export const calcFactionPower = (factionId, territories, gangPresets, playerFaction, playerAvgLevel, sectBonus = 0) => {
  const gangPower = gangPresets
    .filter(g => g.faction === factionId)
    .reduce((sum, g) => sum + (g.power || 0), 0);

  const territoryCount = Object.values(territories).filter(t => t.owner === factionId).length;
  const territoryBonus = territoryCount * 200;

  let playerBonus = 0;
  if (playerFaction === factionId) {
    playerBonus = 1000 + (playerAvgLevel || 50) * 20 + (sectBonus || 0);
  }

  return gangPower + territoryBonus + playerBonus;
};

// 获取阵营领土数
export const getFactionTerritoryCount = (factionId, territories) => {
  return Object.values(territories).filter(t => t.owner === factionId).length;
};

// 找出领土最少的阵营（含群雄）
export const getWeakestFaction = (territories) => {
  const counts = {};
  for (const fid of ALL_FACTION_IDS) {
    counts[fid] = getFactionTerritoryCount(fid, territories);
  }
  let min = Infinity, weakest = null;
  for (const [fid, c] of Object.entries(counts)) {
    if (c < min) { min = c; weakest = fid; }
  }
  return weakest;
};

/** 获取各势力领土分布统计（用于UI显示） */
export const getFactionTerritoryStats = (territories) => {
  const stats = { wei: { count: 0, totalTroops: 0 }, shu: { count: 0, totalTroops: 0 }, wu: { count: 0, totalTroops: 0 }, jin: { count: 0, totalTroops: 0 }, qun: { count: 0, totalTroops: 0 }, neutral: { count: 0, totalTroops: 0 } };
  for (const t of Object.values(territories || {})) {
    const key = t.owner || 'neutral';
    if (!stats[key]) stats[key] = { count: 0, totalTroops: 0 };
    stats[key].count += 1;
    stats[key].totalTroops += getGarrisonTotal(t.garrison);
  }
  return stats;
};

export const buildKingdomStrategicBrief = (kw, { today = '', rankIdx = 0, seasonDaysLeft = 7 } = {}) => {
  const territories = kw?.territories || {};
  const faction = kw?.faction;
  const stats = getFactionTerritoryStats(territories);
  const myStats = faction ? (stats[faction] || { count: 0, totalTroops: 0 }) : { count: 0, totalTroops: 0 };
  const rival = ALL_FACTION_IDS
    .filter(fid => fid !== faction)
    .map(fid => ({ fid, ...(stats[fid] || { count: 0, totalTroops: 0 }) }))
    .sort((a, b) => b.count - a.count || b.totalTroops - a.totalTroops)[0];
  const reserve = Math.max(0, Math.floor(kw?.kwManpowerReserve || 0));
  let contestedAttempts = 0;
  CONTESTED_MAP_IDS.forEach(mid => { contestedAttempts += Number((kw?.contestProgress || {})[`${mid}_attempts_${today}`]) || 0; });
  const contestedMax = CONTESTED_MAP_IDS.length * 3;
  const regularSieges = kw?.dailySiegeDate === today ? (kw?.dailySiegeCount || 0) : 0;
  const overextended = myStats.count >= WAR_TICK_CONFIG.overextendThreshold;
  const underdog = myStats.count <= 2;
  const reserveState = reserve >= 420 ? '充足' : reserve >= 180 ? '可用' : '不足';
  const enemyPressure = rival ? Math.max(0, (rival.count - myStats.count) * 12 + Math.floor((rival.totalTroops - myStats.totalTroops) / 35)) : 0;
  const overextendPressure = overextended ? 26 : myStats.count >= WAR_TICK_CONFIG.overextendThreshold - 1 ? 14 : 0;
  const reservePressure = reserve < 160 ? 28 : reserve < 320 ? 14 : 4;
  const seasonPressure = seasonDaysLeft <= 2 ? 18 : seasonDaysLeft <= 4 ? 9 : 0;
  const campaignDifficulty = clamp(enemyPressure + overextendPressure + reservePressure + seasonPressure, 8, 100);
  const difficulty = campaignDifficulty >= 70
    ? { label: '高压赛季', desc: '敌方或兵力压力偏高，强攻会带来明显反扑风险。', color: '#EF5350' }
    : campaignDifficulty >= 42
      ? { label: '中压拉扯', desc: '可以推进，但需要挑补给好、城防低的窗口。', color: '#F59E0B' }
      : { label: '主动期', desc: '我方具备主动权，适合集中兵力扩大优势。', color: '#66BB6A' };
  const posture = overextended
    ? { label: '巩固防线', tone: '守', desc: '领地过多触发扩张惩罚，先补守军和清理争夺城。' }
    : underdog
      ? { label: '背水扩张', tone: '攻', desc: '领地较少，背水加成生效，适合集中兵力夺一城。' }
      : reserve < 160
        ? { label: '征兵整备', tone: '养', desc: '预备兵偏低，先打国战训练师补兵再攻城。' }
        : { label: '稳步推进', tone: '衡', desc: '兵力与领土处于健康区间，可挑低防目标推进。' };

  const recommendations = [];
  if (reserve < 160) recommendations.push('先在国战地图击败敌国训练师补预备兵');
  if (overextended) recommendations.push('优先守住接壤城池，避免远征');
  if (contestedAttempts < contestedMax && reserve >= 80) recommendations.push('今日名城攻城次数未用完，可去「争夺」推进占领条');
  if (regularSieges < 5 && reserve >= 60 && !overextended) recommendations.push('普通领土攻城仍有次数，挑胜率高的低防城');
  if (seasonDaysLeft <= 2) recommendations.push('赛季末优先保排名和领每日收入');
  if (recommendations.length === 0) recommendations.push('当前节奏稳定，继续刷战功和名将收集');

  const assaultWindows = WAR_MAP_IDS
    .filter(mid => {
      const t = territories[mid];
      if (!t || t.owner === faction || CONTESTED_MAP_IDS.includes(Number(mid))) return false;
      return true;
    })
    .map(mid => {
      const t = territories[mid];
      const supply = getSupplyProfile(mid, faction, territories);
      const garrison = getGarrisonTotal(t.garrison);
      const score = Math.round((115 - (t.strength || 60)) + (140 - Math.min(140, garrison)) * 0.35 + (supply.mult - 0.8) * 60 + (t.owner === rival?.fid ? 12 : 0));
      const risk = t.strength >= 70 || garrison >= 120 || supply.mult < 0.9
        ? '高'
        : t.strength >= 48 || garrison >= 82 ? '中' : '低';
      return {
        mapId: Number(mid),
        owner: t.owner || 'neutral',
        strength: t.strength || 0,
        garrison,
        supplyLabel: supply.label,
        risk,
        score,
        advice: supply.mult < 0.9 ? '补给差，除非急需不要远征' : (t.strength <= 45 ? '城防薄弱，适合小队推进' : '需带足攻城兵和克制兵种'),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const strategicLevers = [
    {
      label: '补给线',
      value: assaultWindows[0]?.supplyLabel || '暂无',
      desc: '相邻或低远征惩罚的目标胜率更稳，远征会放大战损。',
    },
    {
      label: '反扑风险',
      value: overextended ? '高' : rival && rival.count > myStats.count ? '中' : '低',
      desc: overextended ? '领地过多时自然衰减加重，敌方更容易夺回边境。' : '领地健康时可以主动挑低防城。',
    },
    {
      label: '赛季窗口',
      value: `${seasonDaysLeft}天`,
      desc: seasonDaysLeft <= 2 ? '赛季末重在保排名，少打高损攻城。' : '还有时间做征兵、攻城、守城的完整循环。',
    },
  ];

  return {
    posture,
    difficulty,
    campaignDifficulty,
    rival: rival || null,
    reserveState,
    reserve,
    contestedAttempts,
    contestedMax,
    regularSieges,
    overextended,
    underdog,
    deployCapHint: Math.min(reserve, 200 + Math.max(0, rankIdx) * 40),
    recommendations,
    assaultWindows,
    strategicLevers,
    metrics: [
      { label: '我方城池', value: `${myStats.count}/${WAR_MAP_IDS.length}` },
      { label: '预备兵', value: `${reserveState} ${reserve}` },
      { label: '名城次数', value: `${contestedAttempts}/${contestedMax}` },
      { label: '最大调兵', value: `${Math.min(reserve, 380 + Math.max(0, rankIdx) * 72)}` },
      { label: '战局压力', value: `${campaignDifficulty}/100` },
    ],
  };
};

/** 简易兵种克制计算（与kwSiege共享思路） */
const TROOP_KEYS_K = ['shield', 'spear', 'cavalry', 'archer', 'siege', 'raider'];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const getTroopMatchMultLocal = (attackerType, defenderType) => {
  const ring = { shield: 0, spear: 1, cavalry: 2, archer: 3, siege: 4, raider: 5 };
  const ia = ring[attackerType];
  const ib = ring[defenderType];
  if (ia == null || ib == null) return 1;
  if (ia === ib) return 1;
  const d = (ib - ia + 6) % 6;
  if (d === 1 || d === 2) return 1.25;
  if (d === 4 || d === 5) return 0.8;
  return 1;
};

const troopCounterScore = (atkGarrison, defGarrison) => {
  let atkSum = 0, score = 0;
  for (const aid of TROOP_KEYS_K) {
    const av = atkGarrison[aid] || 0;
    atkSum += av;
    for (const did of TROOP_KEYS_K) {
      const dv = defGarrison[did] || 0;
      const mult = getTroopMatchMultLocal(aid, did);
      score += av * dv * mult;
    }
  }
  const defSum = TROOP_KEYS_K.reduce((s, t) => s + (defGarrison[t] || 0), 0) || 1;
  return score / (atkSum * defSum || 1);
};

const normalizeTroopAllocationK = (allocation) => {
  const out = {};
  TROOP_KEYS_K.forEach(k => { out[k] = Math.max(0, Math.floor(Number(allocation?.[k]) || 0)); });
  return out;
};

const getLeadershipMultK = (recruitedGenerals = [], generalIds = []) => {
  const uniqIds = [...new Set((generalIds || []).map(x => String(x)))].slice(0, 3);
  const gens = uniqIds.map(id => (recruitedGenerals || []).find(g => String(g?.id) === id)).filter(Boolean);
  let lead = 1;
  gens.forEach(g => {
    const r = g.rarity;
    lead += (r === 'SSR' || r === 3) ? 0.11 : (r === 'SR' || r === 2) ? 0.065 : 0.038;
  });
  return { lead: Math.min(1.38, lead), gens };
};

const getSupplyProfile = (mapId, playerFaction, territories) => {
  const n = Number(mapId);
  const ownMaps = WAR_MAP_IDS.filter(id => !CONTESTED_MAP_IDS.includes(Number(id)) && territories?.[id]?.owner === playerFaction);
  const targetIndex = WAR_MAP_IDS.indexOf(n);
  const adjacent = targetIndex >= 0 && ownMaps.some(id => {
    const idx = WAR_MAP_IDS.indexOf(Number(id));
    return idx >= 0 && Math.abs(idx - targetIndex) <= 1;
  });
  if (adjacent) return { mult: 1.08, label: '接壤补给', desc: '邻近我方领地，攻城推进更稳定' };
  if (ownMaps.length <= 1) return { mult: 0.94, label: '孤军突进', desc: '己方领地少，后勤薄弱但易触发背水加成' };
  return { mult: 0.86, label: '远征补给', desc: '不接壤我方领地，战损与失败风险上升' };
};

const getRiskLabel = (chance) => {
  if (chance >= 0.72) return '优势';
  if (chance >= 0.55) return '可战';
  if (chance >= 0.38) return '胶着';
  return '高危';
};

const getSuggestedAllocation = (defGarrison, deploy) => {
  const safeDeploy = Math.max(0, Math.floor(Number(deploy) || 0));
  if (safeDeploy <= 0) return {};
  const weights = {};
  for (const aid of TROOP_KEYS_K) {
    let score = 0.08;
    for (const did of TROOP_KEYS_K) {
      score += (defGarrison?.[did] || 0) * getTroopMatchMultLocal(aid, did);
    }
    weights[aid] = Math.max(0.08, score);
  }
  const total = TROOP_KEYS_K.reduce((s, k) => s + weights[k], 0) || 1;
  const out = {};
  let assigned = 0;
  TROOP_KEYS_K.forEach((k, i) => {
    const v = i === TROOP_KEYS_K.length - 1 ? safeDeploy - assigned : Math.floor(safeDeploy * weights[k] / total);
    out[k] = Math.max(0, v);
    assigned += out[k];
  });
  return out;
};

export const evaluateTerritoryAssault = ({ mapId, playerFaction, allocation, territories, recruitedGenerals = [], generalIds = [] }) => {
  const t = territories?.[mapId];
  if (!t) return { canAttack: false, reason: '目标领地不存在', winChance: 0, riskLabel: '不可攻' };
  if (t.owner === playerFaction) return { canAttack: false, reason: '无法攻击己方领地', winChance: 0, riskLabel: '不可攻' };
  if (CONTESTED_MAP_IDS.includes(Number(mapId))) return { canAttack: false, reason: '名城请在争夺页攻城', winChance: 0, riskLabel: '不可攻' };

  const alloc = normalizeTroopAllocationK(allocation);
  const deploy = TROOP_KEYS_K.reduce((s, k) => s + alloc[k], 0);
  const defGarrison = t.garrison || generateGarrison(t.owner || 'qun', Math.max(40, Math.floor((t.strength || 50) * 1.2)));
  const defTotal = Math.max(1, TROOP_KEYS_K.reduce((s, k) => s + (defGarrison[k] || 0), 0));
  const counter = troopCounterScore(alloc, defGarrison);
  const { lead, gens } = getLeadershipMultK(recruitedGenerals, generalIds);
  const supply = getSupplyProfile(mapId, playerFaction, territories || {});
  const ownCount = getFactionTerritoryCount(playerFaction, territories || {});
  const defenderCount = t.owner && t.owner !== 'neutral' ? getFactionTerritoryCount(t.owner, territories || {}) : 0;
  const overextendMult = ownCount >= WAR_TICK_CONFIG.overextendThreshold ? 0.93 : 1;
  const underdogMult = ownCount <= 2 ? 1.07 : 1;
  const defenderResolve = t.owner === 'neutral' ? 0.86 : clamp(0.92 + defenderCount * 0.018, 0.92, 1.16);
  const attackPower = deploy * counter * lead * supply.mult * overextendMult * underdogMult;
  const defensePower = defTotal * ((t.strength || 50) / 100) * defenderResolve;
  const pressure = attackPower / Math.max(1, defensePower);
  const winChance = deploy < 60 ? 0 : clamp(0.08 + (pressure / (pressure + 1.15)) * 0.84, 0.08, 0.92);
  const lossRate = deploy < 60 ? 0 : clamp(0.30 - winChance * 0.14 + Math.max(0, 1 - counter) * 0.08 + (supply.mult < 1 ? 0.04 : 0), 0.09, 0.48);
  const expectedLoss = Math.min(deploy, Math.floor(deploy * lossRate));
  const expectedStrengthChange = winChance >= 0.5
    ? -Math.floor(11 + pressure * 6 + counter * 6 + Math.min(8, gens.length * 3))
    : Math.floor(3 + (1 - winChance) * 7);
  const advice = [];
  if (deploy < 60) advice.push('至少投入 60 兵力');
  if (counter < 0.95) advice.push('兵种被守军克制，建议按推荐配兵调整');
  if (supply.mult < 1) advice.push('远征目标补给较差，建议先夺取相邻领地');
  if (gens.length < 2) advice.push('携带 2 到 3 名武将可显著降低波动');
  if (ownCount >= WAR_TICK_CONFIG.overextendThreshold) advice.push('己方领地过多，扩张惩罚生效，注意巩固防线');

  return {
    canAttack: deploy >= 60,
    reason: deploy < 60 ? '兵力不足 60，无法攻城' : '',
    allocation: alloc,
    deploy,
    defGarrison,
    defTotal,
    counter,
    leadership: lead,
    selectedGenerals: gens,
    supply,
    pressure,
    winChance,
    riskLabel: getRiskLabel(winChance),
    expectedLoss,
    expectedLossRate: lossRate,
    expectedStrengthChange,
    suggestedAllocation: getSuggestedAllocation(defGarrison, deploy),
    advice: advice.length ? advice : ['当前配兵可执行，注意观察战损'],
  };
};

const scoreAiWarTarget = (attackerFid, mapId, territories, weakestFaction) => {
  const t = territories?.[mapId];
  if (!t || t.owner === attackerFid || CONTESTED_MAP_IDS.includes(Number(mapId))) return -Infinity;
  const defender = t.owner || 'neutral';
  const strength = Math.max(1, Number(t.strength) || 50);
  const garrisonTotal = Math.max(1, getGarrisonTotal(t.garrison));
  const supply = getSupplyProfile(mapId, attackerFid, territories || {});
  const attackerCount = getFactionTerritoryCount(attackerFid, territories || {});
  const defenderCount = defender !== 'neutral' ? getFactionTerritoryCount(defender, territories || {}) : 0;
  const vulnerability = (110 - strength) * 1.15 + Math.max(0, 140 - garrisonTotal) * 0.28;
  const strategicValue = 24 + defenderCount * 3 + (defender === 'neutral' ? 8 : 0);
  const supplyScore = supply.mult >= 1 ? 20 : supply.mult >= 0.9 ? 4 : -16;
  const underdogIntent = attackerFid === weakestFaction ? 18 : 0;
  const overextendPenalty = attackerCount >= WAR_TICK_CONFIG.overextendThreshold ? -14 : 0;
  const noise = Math.random() * 14;
  return vulnerability + strategicValue + supplyScore + underdogIntent + overextendPenalty + noise;
};

// 执行一次 War Tick — 五方势力（魏蜀吴晋+群雄NPC）都参与攻城
export const executeWarTick = (territories, gangPresets, playerFaction, playerAvgLevel, attackBuff, sectBonus = 0) => {
  const newTerritories = JSON.parse(JSON.stringify(territories));
  const log = [];
  const weakest = getWeakestFaction(newTerritories);
  const cfg = WAR_TICK_CONFIG;

  // 补全驻军数据（兼容旧存档）
  for (const mapId of WAR_MAP_IDS) {
    const t = newTerritories[mapId];
    if (!t) continue;
    if (!t.garrison || typeof t.garrison !== 'object') {
      const fid = t.owner === 'neutral' ? 'qun' : t.owner;
      t.garrison = generateGarrison(fid, Math.max(40, Math.floor(t.strength * 1.2)));
    }
  }

  // 自然衰减 + 驻军缓慢恢复
  for (const mapId of WAR_MAP_IDS) {
    if (CONTESTED_MAP_IDS.includes(Number(mapId))) continue;
    const t = newTerritories[mapId];
    if (!t) continue;
    const ownerCount = t.owner !== 'neutral' ? getFactionTerritoryCount(t.owner, newTerritories) : 0;
    const decay = (t.owner !== 'neutral' && ownerCount >= cfg.overextendThreshold)
      ? cfg.overextendDecayMultiplier
      : cfg.strengthDecayPerTick;
    t.strength = Math.max(cfg.minStrength, t.strength - decay);
    if (t.garrison && t.owner !== 'neutral') {
      const total = getGarrisonTotal(t.garrison);
      if (total < 200) {
        const rKey = TROOP_KEYS_K[Math.floor(Math.random() * 6)];
        t.garrison[rKey] = (t.garrison[rKey] || 0) + Math.floor(2 + Math.random() * 4);
      }
    }
  }

  // 四方势力攻城（魏蜀吴 + 群雄都会进攻）
  const attackFactions = [...ALL_FACTION_IDS];
  for (const attackerFid of attackFactions) {
    if (attackerFid === playerFaction) continue;
    const targets = WAR_MAP_IDS.filter(mid => {
      const t = newTerritories[mid];
      if (!t || t.owner === attackerFid) return false;
      if (CONTESTED_MAP_IDS.includes(Number(mid))) return false;
      return true;
    });
    if (targets.length === 0) continue;

    const scoredTargets = targets
      .map(mid => ({ mid, score: scoreAiWarTarget(attackerFid, mid, newTerritories, weakest) }))
      .sort((a, b) => b.score - a.score);
    const topN = scoredTargets.slice(0, Math.max(2, Math.ceil(scoredTargets.length * 0.3)));
    const targetMapId = topN[Math.floor(Math.random() * topN.length)]?.mid || scoredTargets[0]?.mid;
    const target = newTerritories[targetMapId];
    const defenderFid = target.owner === 'neutral' ? null : target.owner;

    const atkPower = attackerFid === 'qun'
      ? 2500 + Math.floor(Math.random() * 1500)
      : calcFactionPower(attackerFid, newTerritories, gangPresets, playerFaction, playerAvgLevel, attackerFid === playerFaction ? sectBonus : 0);
    const defPower = defenderFid
      ? calcFactionPower(defenderFid, newTerritories, gangPresets, playerFaction, playerAvgLevel, defenderFid === playerFaction ? sectBonus : 0)
      : 3000;

    const atkGarrison = generateGarrison(attackerFid, Math.floor(60 + Math.random() * 80));
    const defGarrison = target.garrison || generateGarrison(defenderFid || 'qun', 60);
    const counterMod = troopCounterScore(atkGarrison, defGarrison);

    const supply = getSupplyProfile(targetMapId, attackerFid, newTerritories);
    let atkRoll = atkPower * (0.7 + Math.random() * 0.6) * counterMod * supply.mult;
    atkRoll *= (cfg.aiAggressionBonus || 1);
    const defRoll = defPower * (target.strength / 100) * (0.8 + Math.random() * 0.4);

    if (attackerFid === weakest) atkRoll *= (1 + cfg.underdogBonus);
    if (attackerFid === 'qun') atkRoll *= (0.85 + Math.random() * 0.3);
    if (attackBuff && attackerFid === playerFaction) atkRoll *= 1.5;

    target.contested = true;
    target.attackerFaction = attackerFid;

    if (atkRoll > defRoll) {
      const oldOwner = target.owner;
      target.owner = attackerFid;
      target.strength = cfg.newTerritoryStrength;
      target.garrison = generateGarrison(attackerFid, Math.floor(45 + Math.random() * 35));
      target.contested = false;
      target.attackerFaction = null;
      target.attackProgress = 0;
      target.lastBattleTime = Date.now();
      log.push({
        time: Date.now(),
        type: 'capture',
        attacker: attackerFid,
        defender: oldOwner,
        mapId: Number(targetMapId),
        atkTroops: atkGarrison,
        defTroops: defGarrison,
        msg: `${FACTIONS[attackerFid]?.fullName || '群雄'}攻占了${oldOwner === 'neutral' ? '中立领地' : (FACTIONS[oldOwner]?.fullName || '未知') + '的领地'}`,
      });
    } else {
      target.strength = Math.min(cfg.maxStrength, target.strength + 5);
      if (target.garrison) {
        const lossKey = TROOP_KEYS_K[Math.floor(Math.random() * 6)];
        target.garrison[lossKey] = Math.max(1, (target.garrison[lossKey] || 5) - Math.floor(3 + Math.random() * 5));
      }
      target.contested = Math.random() < 0.4;
      if (!target.contested) target.attackerFaction = null;
      log.push({
        time: Date.now(),
        type: 'defend',
        attacker: attackerFid,
        defender: defenderFid || 'neutral',
        mapId: Number(targetMapId),
        atkTroops: atkGarrison,
        defTroops: defGarrison,
        msg: `${defenderFid ? (FACTIONS[defenderFid]?.fullName || defenderFid) : '中立势力'}成功抵御了${FACTIONS[attackerFid]?.fullName || '群雄'}的进攻`,
      });
    }
  }

  return { territories: newTerritories, log };
};

// 检查赛季是否结束并处理
export const checkSeasonEnd = (kw) => {
  if (!kw.seasonStartDate) return null;
  const start = new Date(kw.seasonStartDate);
  const now = new Date();
  const daysPassed = (now - start) / (1000 * 60 * 60 * 24);

  if (daysPassed < SEASON_CONFIG.durationDays) return null;

  const counts = {};
  for (const fid of ALL_FACTION_IDS) {
    counts[fid] = getFactionTerritoryCount(fid, kw.territories);
  }
  const sorted = ALL_FACTION_IDS.slice().sort((a, b) => counts[b] - counts[a]);

  return {
    rankings: sorted,
    counts,
    season: kw.season,
  };
};

export const applySeasonRewards = (kw, result, rankStatsFn) => {
  if (!kw.faction) return kw;
  const playerRank = result.rankings.indexOf(kw.faction) + 1;
  const reward = SEASON_CONFIG.rewards[playerRank] || SEASON_CONFIG.rewards[3];
  const newContribution = Math.floor(kw.warContribution * SEASON_CONFIG.contributionCarryover);
  const drawCount = playerRank === 1 ? 3 : playerRank === 2 ? 2 : 1;

  const isMvp = (kw.seasonContribution ?? kw.warContribution ?? 0) >= 2000;
  const mvpTokens = isMvp ? SEASON_CONFIG.mvpBonus.tokens : 0;
  const mvpTitle = isMvp ? SEASON_CONFIG.mvpBonus.title : null;

  const titles = [...(kw.seasonTitles || [])];
  if (reward.title) titles.push(`S${result.season}${reward.title}`);
  if (mvpTitle) titles.push(`S${result.season}${mvpTitle}`);

  const newState = {
    ...kw,
    warContribution: newContribution,
    seasonContribution: 0,
    territories: initTerritories(),
    contestProgress: {},
    season: kw.season + 1,
    /** 赛季更替：预备兵保留 45% 并封顶，避免从零开始过难、也避免无限囤积 */
    kwManpowerReserve: Math.min(2800, Math.floor((kw.kwManpowerReserve || 0) * 0.45)),
  };
  const stats = rankStatsFn ? rankStatsFn(newState) : null;
  newState.militaryRank = getMilitaryRank(newContribution, stats).id;

  return {
    ...newState,
    seasonStartDate: new Date().toISOString(),
    warLog: [{
      time: Date.now(), type: 'season_end',
      msg: `第${result.season}赛季结束! ${FACTIONS[result.rankings[0]].fullName}获得霸主! 你的阵营排名第${playerRank}` + (isMvp ? ' 🏆你获得了战神称号!' : ''),
    }],
    lastTick: Date.now(),
    attackBuff: false,
    goldReward: reward.gold,
    tokenReward: reward.tokens + mvpTokens,
    generalDraws: drawCount,
    seasonTitles: titles,
  };
};

/**
 * 玩家对普通地图发动兵种化攻城
 * @returns {{ victory, strengthChange, manpowerLost, detail, atkTroops, defTroops }}
 */
export const runTerritoryAssault = ({ mapId, playerFaction, allocation, territories, recruitedGenerals = [], generalIds = [] }) => {
  const t = territories[mapId];
  if (!t || t.owner === playerFaction) return { victory: false, strengthChange: 0, manpowerLost: 0, detail: '无法攻击己方领地' };
  if (CONTESTED_MAP_IDS.includes(Number(mapId))) return { victory: false, strengthChange: 0, manpowerLost: 0, detail: '名城请在争夺页攻城' };

  const evalResult = evaluateTerritoryAssault({ mapId, playerFaction, allocation, territories, recruitedGenerals, generalIds });
  const alloc = evalResult.allocation || normalizeTroopAllocationK(allocation);
  const deploy = evalResult.deploy || TROOP_KEYS_K.reduce((s, k) => s + alloc[k], 0);
  if (deploy < 60) return { victory: false, strengthChange: 0, manpowerLost: 0, detail: '兵力不足60，无法攻城' };

  const victory = Math.random() < evalResult.winChance;
  const lossNoise = victory ? (0.82 + Math.random() * 0.3) : (1.05 + Math.random() * 0.32);
  const lossRate = (evalResult.expectedLossRate || 0.2) * lossNoise;
  const manpowerLost = Math.min(deploy, Math.floor(deploy * Math.min(0.5, lossRate)));

  let strengthChange = 0;
  if (victory) {
    const baseBreak = Math.abs(evalResult.expectedStrengthChange || 14);
    strengthChange = -Math.floor(baseBreak * (0.78 + Math.random() * 0.42));
  } else {
    strengthChange = Math.floor(3 + (1 - (evalResult.winChance || 0)) * 6 + Math.random() * 4);
  }

  const detail = victory
    ? `${evalResult.supply?.label || '攻势'}奏效，守军阵线被撕开，城防削弱 ${Math.abs(strengthChange)}。`
    : `${evalResult.riskLabel || '高危'}攻城受挫，守军重整城防 (+${strengthChange})。`;

  return {
    victory,
    strengthChange,
    manpowerLost,
    detail,
    atkTroops: alloc,
    defTroops: evalResult.defGarrison,
    winChance: evalResult.winChance,
    riskLabel: evalResult.riskLabel,
    counter: evalResult.counter,
    supply: evalResult.supply,
  };
};

export const isFactionCapitalOnly = (faction, territories) => {
  const ownedMaps = WAR_MAP_IDS.filter(id => territories[id]?.owner === faction);
  return ownedMaps.length === 0;
};

// 获取可发起都城攻防战的敌方阵营
export const getCapitalSiegeTargets = (playerFaction, territories) => {
  return FACTION_IDS.filter(fid => fid !== playerFaction && isFactionCapitalOnly(fid, territories));
};

// ==========================================
// 三国历史战役副本 (每国8个)
// ==========================================
export const KINGDOM_CAMPAIGNS = [
  // === 魏国 ===
  { id: 'wei_guandu',   faction: 'wei', name: '官渡之战',   desc: '曹操以少胜多，大败袁绍主力！与曹操并肩作战击溃袁军。',
    icon: '⚔️', lvl: 60, teamSize: 6, boss: 149, bossLvl: 65, bossName: '袁绍·大将军',
    pool: [65, 94, 130, 143, 168, 199, 241, 434], reward: { gold: 8000, tokens: 10, contribution: 50 },
    bg: 'linear-gradient(135deg, #0D47A1, #1565C0)', lore: '建安五年，曹操率精兵奇袭乌巢粮仓，一举扭转战局！' },
  { id: 'wei_baima',    faction: 'wei', name: '白马之围',   desc: '关羽斩颜良诛文丑！突破白马重围。',
    icon: '🐴', lvl: 65, teamSize: 5, boss: 182, bossLvl: 70, bossName: '颜良·河北名将',
    pool: [9, 65, 94, 134, 136, 139, 190, 225], reward: { gold: 10000, tokens: 12, contribution: 60 },
    bg: 'linear-gradient(135deg, #1565C0, #1976D2)', lore: '白马坡上，关羽万军之中取敌将首级如探囊取物。' },
  { id: 'wei_tongguan',  faction: 'wei', name: '潼关之战',   desc: '曹操大战西凉铁骑，击退马超韩遂联军。',
    icon: '🏔️', lvl: 72, teamSize: 6, boss: 130, bossLvl: 78, bossName: '马超·锦马超',
    pool: [3, 18, 130, 143, 160, 182, 446, 449], reward: { gold: 12000, tokens: 15, contribution: 70 },
    bg: 'linear-gradient(135deg, #0D47A1, #0277BD)', lore: '潼关一战，西凉铁骑的冲击让天下震惊，但曹操终以离间计获胜。' },
  { id: 'wei_hefei',    faction: 'wei', name: '合肥之战',   desc: '张辽八百破十万！守卫合肥抵御吴军。',
    icon: '🏯', lvl: 78, teamSize: 6, boss: 138, bossLvl: 84, bossName: '孙权·吴侯',
    pool: [33, 65, 94, 138, 139, 182, 206, 437], reward: { gold: 15000, tokens: 18, contribution: 80 },
    bg: 'linear-gradient(135deg, #1565C0, #283593)', lore: '张辽威震逍遥津，孙权几乎被擒，此战魏军名震天下！' },
  { id: 'wei_xuchang',  faction: 'wei', name: '许都保卫战', desc: '刺客夜袭许昌！守护魏国心脏之地。',
    icon: '🗡️', lvl: 85, teamSize: 6, boss: 150, bossLvl: 90, bossName: '暗杀者·首领',
    pool: [3, 18, 33, 94, 138, 190, 206, 241], reward: { gold: 18000, tokens: 22, contribution: 100 },
    bg: 'linear-gradient(135deg, #263238, #37474F)', lore: '月黑风高，一群刺客潜入许都，曹操亲率虎卫军迎战！' },
  { id: 'wei_north',    faction: 'wei', name: '统一北方',   desc: '征服乌桓，平定辽东！魏国最终战役。',
    icon: '👑', lvl: 92, teamSize: 6, boss: 340, bossLvl: 98, bossName: '蹋顿·乌桓之王',
    pool: [9, 65, 94, 130, 149, 199, 241, 443], reward: { gold: 25000, tokens: 30, contribution: 150 },
    bg: 'linear-gradient(135deg, #0D47A1, #01579B)', lore: '白狼山之战，曹操亲征乌桓，一统北方大业终成！' },

  { id: 'wei_changban_wei', faction: 'wei', name: '长坂追击', desc: '追击刘备于长坂！曹军精锐尽出。',
    icon: '🐎', lvl: 70, teamSize: 6, boss: 182, bossLvl: 76, bossName: '赵云·白马银枪',
    pool: [6, 9, 65, 94, 130, 143, 168, 199], reward: { gold: 11000, tokens: 13, contribution: 65 },
    bg: 'linear-gradient(135deg, #1565C0, #0D47A1)', lore: '曹操亲率虎豹骑追击刘备，赵子龙七进七出阻挡追兵！' },
  { id: 'wei_wuzhang_wei', faction: 'wei', name: '五丈原对峙', desc: '司马懿坚壁清野，与诸葛亮最后对决。',
    icon: '⭐', lvl: 90, teamSize: 6, boss: 282, bossLvl: 96, bossName: '诸葛亮·卧龙',
    pool: [9, 65, 94, 130, 149, 199, 241, 443], reward: { gold: 22000, tokens: 26, contribution: 120 },
    bg: 'linear-gradient(135deg, #0D47A1, #1A237E)', lore: '五丈原秋风萧瑟，两大智者最后的对决，谁能笑到最后？' },

  // === 蜀国 ===
  { id: 'shu_sangu',    faction: 'shu', name: '三顾茅庐',   desc: '刘备三访隆中，诸葛亮出山！通过智谋考验。',
    icon: '🏠', lvl: 55, teamSize: 4, boss: 65, bossLvl: 60, bossName: '诸葛亮·卧龙',
    pool: [6, 9, 140, 149, 168, 199, 443, 452], reward: { gold: 6000, tokens: 8, contribution: 40 },
    bg: 'linear-gradient(135deg, #1B5E20, #2E7D32)', lore: '隆中对策定天下三分，卧龙出山辅佐明主！' },
  { id: 'shu_chibi',    faction: 'shu', name: '赤壁大战',   desc: '孙刘联军火烧曹操百万大军！借东风破敌。',
    icon: '🔥', lvl: 68, teamSize: 6, boss: 149, bossLvl: 74, bossName: '曹操·丞相',
    pool: [6, 9, 65, 94, 130, 143, 149, 168], reward: { gold: 12000, tokens: 15, contribution: 70 },
    bg: 'linear-gradient(135deg, #BF360C, #E64A19)', lore: '东风起，战船燃，百万曹军一夜覆灭于赤壁！' },
  { id: 'shu_yizhou',   faction: 'shu', name: '入蜀之战',   desc: '攻克益州，建立蜀汉根基！',
    icon: '⛰️', lvl: 72, teamSize: 6, boss: 199, bossLvl: 78, bossName: '刘璋·益州牧',
    pool: [3, 18, 130, 143, 160, 182, 446, 449], reward: { gold: 12000, tokens: 15, contribution: 70 },
    bg: 'linear-gradient(135deg, #2E7D32, #388E3C)', lore: '刘备入蜀，历经艰险终取益州，三分天下之势初成。' },
  { id: 'shu_dingjun',  faction: 'shu', name: '定军山之战', desc: '黄忠斩夏侯渊！老将的辉煌一击。',
    icon: '🗻', lvl: 78, teamSize: 6, boss: 182, bossLvl: 84, bossName: '夏侯渊·征西将军',
    pool: [9, 65, 69, 134, 135, 136, 139, 169], reward: { gold: 15000, tokens: 18, contribution: 80 },
    bg: 'linear-gradient(135deg, #1B5E20, #33691E)', lore: '定军山上黄忠一刀，斩杀魏国名将夏侯渊，蜀军士气大振！' },
  { id: 'shu_menghuo',  faction: 'shu', name: '七擒孟获',   desc: '诸葛亮七擒七纵南蛮王！以德服人。',
    icon: '🐘', lvl: 82, teamSize: 6, boss: 241, bossLvl: 88, bossName: '孟获·南蛮王',
    pool: [3, 6, 18, 33, 69, 130, 143, 160], reward: { gold: 18000, tokens: 22, contribution: 100 },
    bg: 'linear-gradient(135deg, #33691E, #558B2F)', lore: '七擒七纵，以仁德感化南蛮，从此西南安定。' },
  { id: 'shu_beifa',    faction: 'shu', name: '北伐中原',   desc: '诸葛亮六出祁山！蜀汉最后的荣光。',
    icon: '⚔️', lvl: 93, teamSize: 6, boss: 340, bossLvl: 98, bossName: '司马懿·太傅',
    pool: [9, 65, 94, 130, 149, 190, 206, 241], reward: { gold: 25000, tokens: 30, contribution: 150 },
    bg: 'linear-gradient(135deg, #1B5E20, #004D40)', lore: '出师未捷身先死，长使英雄泪满襟。鞠躬尽瘁，死而后已！' },

  { id: 'shu_changban_shu', faction: 'shu', name: '长坂血战', desc: '赵子龙七进七出！救幼主于万军之中。',
    icon: '🐎', lvl: 62, teamSize: 5, boss: 94, bossLvl: 68, bossName: '曹操·虎豹骑',
    pool: [6, 9, 65, 94, 130, 143, 149, 168], reward: { gold: 10000, tokens: 12, contribution: 55 },
    bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)', lore: '赵云怀抱幼主阿斗，于百万曹军中杀出一条血路！' },
  { id: 'shu_hanzhong_shu', faction: 'shu', name: '汉中争夺', desc: '刘备亲征汉中，与曹操争夺要地。',
    icon: '⛰️', lvl: 76, teamSize: 6, boss: 149, bossLvl: 82, bossName: '曹操·魏王',
    pool: [9, 65, 94, 130, 143, 168, 199, 241], reward: { gold: 14000, tokens: 17, contribution: 75 },
    bg: 'linear-gradient(135deg, #1B5E20, #004D40)', lore: '法正运筹，黄忠斩将，刘备终于夺取汉中，进位汉中王！' },

  // === 吴国 ===
  { id: 'wu_jiangdong', faction: 'wu', name: '江东之虎',   desc: '孙策横扫江东六郡！奠定东吴基业。',
    icon: '🐯', lvl: 58, teamSize: 5, boss: 160, bossLvl: 63, bossName: '刘繇·扬州刺史',
    pool: [33, 65, 94, 138, 139, 182, 206, 437], reward: { gold: 7000, tokens: 8, contribution: 40 },
    bg: 'linear-gradient(135deg, #B71C1C, #C62828)', lore: '小霸王孙策，以传国玉玺借兵，横扫江东！' },
  { id: 'wu_chibi_wu',  faction: 'wu', name: '火烧赤壁',   desc: '周瑜火攻计！东风起时万船齐燃。',
    icon: '🔥', lvl: 68, teamSize: 6, boss: 149, bossLvl: 74, bossName: '曹操·丞相',
    pool: [6, 9, 65, 94, 130, 143, 149, 168], reward: { gold: 12000, tokens: 15, contribution: 70 },
    bg: 'linear-gradient(135deg, #D32F2F, #F44336)', lore: '周瑜用火攻之计，借东风点燃连环船，曹军大败！' },
  { id: 'wu_yiling',    faction: 'wu', name: '夷陵之战',   desc: '陆逊火烧连营！以弱胜强的经典。',
    icon: '🌿', lvl: 75, teamSize: 6, boss: 199, bossLvl: 82, bossName: '刘备·汉昭烈帝',
    pool: [3, 18, 130, 143, 160, 182, 446, 449], reward: { gold: 14000, tokens: 16, contribution: 75 },
    bg: 'linear-gradient(135deg, #C62828, #D32F2F)', lore: '陆逊诱敌深入，火烧七百里连营，蜀军惨败！' },
  { id: 'wu_shiting',   faction: 'wu', name: '石亭之战',   desc: '陆逊再施妙计，大破魏军曹休。',
    icon: '🪨', lvl: 80, teamSize: 6, boss: 168, bossLvl: 86, bossName: '曹休·大司马',
    pool: [9, 65, 94, 130, 139, 149, 190, 206], reward: { gold: 16000, tokens: 20, contribution: 85 },
    bg: 'linear-gradient(135deg, #B71C1C, #880E4F)', lore: '石亭设伏，魏军大败，曹休羞愤而亡。' },
  { id: 'wu_hefei_wu',  faction: 'wu', name: '合肥突围',   desc: '孙权十万大军攻合肥，遭张辽拼死抵抗！突出重围。',
    icon: '🏯', lvl: 85, teamSize: 6, boss: 241, bossLvl: 92, bossName: '张辽·征东将军',
    pool: [9, 65, 69, 134, 135, 136, 139, 169], reward: { gold: 20000, tokens: 24, contribution: 110 },
    bg: 'linear-gradient(135deg, #C62828, #AD1457)', lore: '张辽威震逍遥津！孙权险些被擒，这次你能改写历史吗？' },
  { id: 'wu_jiaozhi',   faction: 'wu', name: '交州征伐',   desc: '征服南方蛮荒之地，扩展吴国版图！',
    icon: '🌴', lvl: 93, teamSize: 6, boss: 340, bossLvl: 98, bossName: '士燮·交州太守',
    pool: [3, 6, 18, 33, 69, 130, 143, 160], reward: { gold: 25000, tokens: 30, contribution: 150 },
    bg: 'linear-gradient(135deg, #B71C1C, #4A148C)', lore: '东吴铁骑南下交州，开疆拓土，吴国疆域达到鼎盛！' },
  { id: 'wu_ruoxu', faction: 'wu', name: '濡须之战', desc: '据濡须坞坚守！让曹操发出"生子当如孙仲谋"之叹。',
    icon: '🌊', lvl: 72, teamSize: 6, boss: 149, bossLvl: 78, bossName: '曹操·丞相',
    pool: [6, 9, 65, 94, 130, 143, 149, 168], reward: { gold: 13000, tokens: 16, contribution: 72 },
    bg: 'linear-gradient(135deg, #C62828, #E64A19)', lore: '曹操率大军南征，孙权据濡须坞死守，终使曹操退兵！' },
  { id: 'wu_jianye', faction: 'wu', name: '建业保卫战', desc: '晋军六路伐吴！守卫东吴最后的荣光。',
    icon: '🏰', lvl: 88, teamSize: 6, boss: 340, bossLvl: 94, bossName: '杜预·征南大将军',
    pool: [9, 65, 94, 130, 139, 149, 190, 206], reward: { gold: 22000, tokens: 26, contribution: 120 },
    bg: 'linear-gradient(135deg, #B71C1C, #880E4F)', lore: '晋军楼船下江东，这是保卫吴国都城的最终战役！' },
];

// 都城地图ID
export const CAPITAL_MAP_IDS = { wei: 201, shu: 202, wu: 203, jin: 207 };

// 重置每日计数
export const resetKingdomDailyCounts = (kw) => {
  const today = new Date().toISOString().slice(0, 10);
  if (kw.dailyCounts.resetDate !== today) {
    return {
      ...kw,
      dailyCounts: { income: false, kills: 0, capitalReward: false, resetDate: today },
      dailySiegeCount: 0,
      dailySiegeDate: today,
    };
  }
  return kw;
};
