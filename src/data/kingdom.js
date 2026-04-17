// ==========================================
// 国战系统 - 魏蜀吴三国争霸
// ==========================================

export const FACTIONS = {
  wei: {
    id: 'wei', name: '魏', fullName: '魏国', icon: '⚔️',
    color: '#1565C0', darkColor: '#0D47A1', lightColor: '#42A5F5',
    lord: '曹操', motto: '挟天子以令诸侯',
    desc: '崇尚军事力量的北方强国，麾下帮派皆为精锐之师。',
    bonus: { gold: 8, exp: 5, catchRate: 0, contribution: 10 },
    bonusDesc: '金币+8%, 经验+5%, 战功+10%',
  },
  shu: {
    id: 'shu', name: '蜀', fullName: '蜀国', icon: '🛡️',
    color: '#2E7D32', darkColor: '#1B5E20', lightColor: '#66BB6A',
    lord: '刘备', motto: '仁德布天下',
    desc: '以仁德治国的西方王国，注重将士成长与续航能力。',
    bonus: { gold: 5, exp: 12, catchRate: 2, contribution: 5 },
    bonusDesc: '经验+12%, 金币+5%, 捕获率+2%',
  },
  wu: {
    id: 'wu', name: '吴', fullName: '吴国', icon: '🏹',
    color: '#C62828', darkColor: '#B71C1C', lightColor: '#EF5350',
    lord: '孙权', motto: '据江东以观天下',
    desc: '富庶善贾的东方大国，以财力和精准著称。',
    bonus: { gold: 12, exp: 5, catchRate: 3, contribution: 5 },
    bonusDesc: '金币+12%, 经验+5%, 捕获率+3%',
  },
};

export const FACTION_IDS = ['wei', 'shu', 'wu'];

// 初始领土分配
export const INITIAL_TERRITORIES = {
  1:  'shu', 2:  'shu', 3:  'wei', 4:  'wu',
  5:  'wei', 6:  'shu', 7:  'wu',  8:  'wu',
  9:  'wu',  10: 'wei', 11: 'shu', 12: 'wei',
  13: 'neutral',
  204: 'neutral', 205: 'neutral', 206: 'neutral',
};

// 参战地图ID列表（含3张中立争夺城池）
export const WAR_MAP_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 204, 205, 206];

// 中立争夺城池ID
export const CONTESTED_MAP_IDS = [204, 205, 206];

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
  hegemon: { type: 'multi', desc: '通关全部阵营战役 + 拥有8名名将 + 控制7+领地', targets: { campaignsCleared: 8, recruitedGenerals: 8, factionTerritories: 7 } },
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
  aiAggressionBonus: 1.15,
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
};

export const initTerritories = () => {
  const territories = {};
  for (const [mapId, owner] of Object.entries(INITIAL_TERRITORIES)) {
    territories[mapId] = {
      owner,
      strength: owner === 'neutral' ? 80 : 60,
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
export const calcFactionPower = (factionId, territories, gangPresets, playerFaction, playerAvgLevel) => {
  const gangPower = gangPresets
    .filter(g => g.faction === factionId)
    .reduce((sum, g) => sum + (g.power || 0), 0);

  const territoryCount = Object.values(territories).filter(t => t.owner === factionId).length;
  const territoryBonus = territoryCount * 200;

  let playerBonus = 0;
  if (playerFaction === factionId) {
    playerBonus = 1000 + (playerAvgLevel || 50) * 20;
  }

  return gangPower + territoryBonus + playerBonus;
};

// 获取阵营领土数
export const getFactionTerritoryCount = (factionId, territories) => {
  return Object.values(territories).filter(t => t.owner === factionId).length;
};

// 找出领土最少的阵营
export const getWeakestFaction = (territories) => {
  const counts = {};
  for (const fid of FACTION_IDS) {
    counts[fid] = getFactionTerritoryCount(fid, territories);
  }
  let min = Infinity, weakest = null;
  for (const [fid, c] of Object.entries(counts)) {
    if (c < min) { min = c; weakest = fid; }
  }
  return weakest;
};

// 执行一次 War Tick
export const executeWarTick = (territories, gangPresets, playerFaction, playerAvgLevel, attackBuff) => {
  const newTerritories = JSON.parse(JSON.stringify(territories));
  const log = [];
  const weakest = getWeakestFaction(newTerritories);
  const cfg = WAR_TICK_CONFIG;

  // 自然衰减
  for (const mapId of WAR_MAP_IDS) {
    const t = newTerritories[mapId];
    if (!t) continue;
    const ownerCount = getFactionTerritoryCount(t.owner, newTerritories);
    const decay = (t.owner !== 'neutral' && ownerCount >= cfg.overextendThreshold)
      ? cfg.overextendDecayMultiplier
      : cfg.strengthDecayPerTick;
    t.strength = Math.max(cfg.minStrength, t.strength - decay);
  }

  // 每个阵营发动一次进攻
  for (const attackerFid of FACTION_IDS) {
    const targets = WAR_MAP_IDS.filter(mid => {
      const t = newTerritories[mid];
      return t && t.owner !== attackerFid;
    });
    if (targets.length === 0) continue;

    // 优先攻击 strength 最低的
    targets.sort((a, b) => (newTerritories[a].strength || 0) - (newTerritories[b].strength || 0));
    const topN = targets.slice(0, Math.max(3, Math.ceil(targets.length * 0.4)));
    const targetMapId = topN[Math.floor(Math.random() * topN.length)];
    const target = newTerritories[targetMapId];
    const defenderFid = target.owner === 'neutral' ? null : target.owner;

    const atkPower = calcFactionPower(attackerFid, newTerritories, gangPresets, playerFaction, playerAvgLevel);
    const defPower = defenderFid
      ? calcFactionPower(defenderFid, newTerritories, gangPresets, playerFaction, playerAvgLevel)
      : 3000;

    let atkRoll = atkPower * (0.7 + Math.random() * 0.6);
    if (attackerFid !== playerFaction) atkRoll *= (cfg.aiAggressionBonus || 1);
    const defRoll = defPower * (target.strength / 100) * (0.8 + Math.random() * 0.4);

    if (attackerFid === weakest) atkRoll *= (1 + cfg.underdogBonus);
    if (attackBuff && attackerFid === playerFaction) atkRoll *= 1.5;

    target.contested = true;
    target.attackerFaction = attackerFid;

    if (atkRoll > defRoll) {
      const oldOwner = target.owner;
      target.owner = attackerFid;
      target.strength = cfg.newTerritoryStrength;
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
        msg: `${FACTIONS[attackerFid].fullName}攻占了${oldOwner === 'neutral' ? '中立领地' : FACTIONS[oldOwner]?.fullName + '的领地'}`,
      });
    } else {
      target.strength = Math.min(cfg.maxStrength, target.strength + 5);
      target.contested = Math.random() < 0.4;
      if (!target.contested) target.attackerFaction = null;
      log.push({
        time: Date.now(),
        type: 'defend',
        attacker: attackerFid,
        defender: defenderFid || 'neutral',
        mapId: Number(targetMapId),
        msg: `${defenderFid ? FACTIONS[defenderFid].fullName : '中立势力'}成功抵御了${FACTIONS[attackerFid].fullName}的进攻`,
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
  for (const fid of FACTION_IDS) {
    counts[fid] = getFactionTerritoryCount(fid, kw.territories);
  }
  const sorted = FACTION_IDS.slice().sort((a, b) => counts[b] - counts[a]);

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

  const isMvp = (kw.warContribution || 0) >= 500;
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

export const isFactionCapitalOnly = (faction, territories) => {
  const ownedMaps = WAR_MAP_IDS.filter(id => territories[id]?.owner === faction);
  return ownedMaps.length === 0;
};

// 获取可发起都城攻防战的敌方阵营
export const getCapitalSiegeTargets = (playerFaction, territories) => {
  return FACTION_IDS.filter(fid => fid !== playerFaction && isFactionCapitalOnly(fid, territories));
};

// ==========================================
// 三国历史战役副本 (每国6个)
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
export const CAPITAL_MAP_IDS = { wei: 201, shu: 202, wu: 203 };

// 重置每日计数
export const resetKingdomDailyCounts = (kw) => {
  const today = new Date().toISOString().slice(0, 10);
  if (kw.dailyCounts.resetDate !== today) {
    return {
      ...kw,
      dailyCounts: { income: false, kills: 0, capitalReward: false, resetDate: today },
    };
  }
  return kw;
};
