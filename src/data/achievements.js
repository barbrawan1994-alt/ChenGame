// ==========================================
// 成就系统 - 定义、分类、奖励
// ==========================================

export const ACH_CATEGORY = {
  COLLECTION: { name: '收集', icon: '📖', color: '#4CAF50' },
  BATTLE:     { name: '战斗', icon: '⚔️', color: '#F44336' },
  EXPLORE:    { name: '探索', icon: '🗺️', color: '#2196F3' },
  GROWTH:     { name: '成长', icon: '⭐', color: '#FF9800' },
  SOCIAL:     { name: '社交', icon: '🤝', color: '#9C27B0' },
  MASTERY:    { name: '精通', icon: '👑', color: '#FFD700' },
  SECRET:     { name: '隐藏', icon: '🔮', color: '#7E57C2' },
};

export const ACH_RARITY = {
  COMMON:    { name: '普通', color: '#78909C', stars: 1 },
  UNCOMMON:  { name: '稀有', color: '#43A047', stars: 2 },
  RARE:      { name: '珍贵', color: '#1E88E5', stars: 3 },
  EPIC:      { name: '史诗', color: '#8E24AA', stars: 4 },
  LEGENDARY: { name: '传说', color: '#FF8F00', stars: 5 },
};

// stat key → achievement条件检查
// check: (stats, gameState) => boolean
// reward: { gold, title, item }
const ACHIEVEMENTS = [
  // ===== 收集类 (13) =====
  { id: 'catch_first',     cat: 'COLLECTION', rarity: 'COMMON',    name: '初出茅庐',     desc: '捕捉第一只精灵',             check: s => s.totalCaught >= 1,    reward: { gold: 500 } },
  { id: 'catch_10',        cat: 'COLLECTION', rarity: 'COMMON',    name: '收藏爱好者',   desc: '图鉴中记录10种精灵',          check: s => s.dexCount >= 10,       reward: { gold: 1000 } },
  { id: 'catch_50',        cat: 'COLLECTION', rarity: 'UNCOMMON',  name: '精灵猎人',     desc: '图鉴中记录50种精灵',          check: s => s.dexCount >= 50,       reward: { gold: 3000 } },
  { id: 'catch_100',       cat: 'COLLECTION', rarity: 'RARE',      name: '图鉴学者',     desc: '图鉴中记录100种精灵',         check: s => s.dexCount >= 100,      reward: { gold: 8000, title: '图鉴学者' } },
  { id: 'catch_250',       cat: 'COLLECTION', rarity: 'EPIC',      name: '精灵博士',     desc: '图鉴中记录250种精灵',         check: s => s.dexCount >= 250,      reward: { gold: 30000, title: '精灵博士' } },
  { id: 'catch_500',       cat: 'COLLECTION', rarity: 'LEGENDARY', name: '图鉴完成者',   desc: '收集全部500种精灵！',          check: s => s.dexCount >= 500,      reward: { gold: 100000, title: '图鉴大师' } },
  { id: 'catch_shiny',     cat: 'COLLECTION', rarity: 'RARE',      name: '闪光猎人',     desc: '捕捉一只闪光精灵',            check: s => s.shinyCaught >= 1,     reward: { gold: 5000 } },
  { id: 'catch_5_shiny',   cat: 'COLLECTION', rarity: 'EPIC',      name: '闪光收藏家',   desc: '捕捉5只闪光精灵',             check: s => s.shinyCaught >= 5,     reward: { gold: 20000, title: '闪光大师' } },
  { id: 'catch_legend',    cat: 'COLLECTION', rarity: 'EPIC',      name: '神兽降临',     desc: '捕捉一只神兽',                check: s => s.legendCaught >= 1,    reward: { gold: 15000 } },
  { id: 'fruit_5',         cat: 'COLLECTION', rarity: 'UNCOMMON',  name: '果实收藏家',   desc: '收集5种不同的恶魔果实',       check: s => s.uniqueFruits >= 5,    reward: { gold: 5000 } },
  { id: 'fruit_15',        cat: 'COLLECTION', rarity: 'RARE',      name: '果实鉴赏家',   desc: '收集15种不同的恶魔果实',      check: s => s.uniqueFruits >= 15,   reward: { gold: 15000 } },
  { id: 'fruit_all',       cat: 'COLLECTION', rarity: 'LEGENDARY', name: '恶魔果实图鉴', desc: '收集全部35种恶魔果实',         check: s => s.uniqueFruits >= 35,   reward: { gold: 80000, title: '果实之王' } },
  { id: 'catch_all_type',  cat: 'COLLECTION', rarity: 'EPIC',      name: '属性大师',     desc: '捕捉所有19种属性的精灵',      check: s => s.typesCollected >= 19, reward: { gold: 20000, title: '属性大师' } },

  // ===== 战斗类 (15) =====
  { id: 'win_first',       cat: 'BATTLE', rarity: 'COMMON',    name: '初次胜利',     desc: '赢得第一场战斗',              check: s => s.battlesWon >= 1,      reward: { gold: 300 } },
  { id: 'win_50',          cat: 'BATTLE', rarity: 'UNCOMMON',  name: '百战老兵',     desc: '赢得50场战斗',                check: s => s.battlesWon >= 50,     reward: { gold: 5000 } },
  { id: 'win_200',         cat: 'BATTLE', rarity: 'RARE',      name: '战神降世',     desc: '赢得200场战斗',               check: s => s.battlesWon >= 200,    reward: { gold: 15000, title: '战神' } },
  { id: 'win_500',         cat: 'BATTLE', rarity: 'EPIC',      name: '千场勇士',     desc: '赢得500场战斗',               check: s => s.battlesWon >= 500,    reward: { gold: 50000, title: '不败战神' } },
  { id: 'crit_king',       cat: 'BATTLE', rarity: 'UNCOMMON',  name: '暴击之王',     desc: '在单场战斗中触发5次暴击',     check: s => s.maxCritsInBattle >= 5, reward: { gold: 3000 } },
  { id: 'clutch_win',      cat: 'BATTLE', rarity: 'RARE',      name: '绝地反击',     desc: '在精灵HP低于10%时赢得战斗',   check: s => s.clutchWins >= 1,      reward: { gold: 8000, title: '绝境逢生' } },
  { id: 'perfect_win',     cat: 'BATTLE', rarity: 'RARE',      name: '完美胜利',     desc: '在不损失HP的情况下赢得战斗',  check: s => s.perfectWins >= 1,     reward: { gold: 10000 } },
  { id: 'sweep_win',       cat: 'BATTLE', rarity: 'UNCOMMON',  name: '全队存活',     desc: '训练家对战中全队无一阵亡',    check: s => s.sweepWins >= 1,       reward: { gold: 5000 } },
  { id: 'underdog',        cat: 'BATTLE', rarity: 'RARE',      name: '以弱胜强',     desc: '击败等级高出20级以上的对手',   check: s => s.underdogWins >= 1,    reward: { gold: 8000, title: '越级挑战者' } },
  { id: 'ko_streak_10',    cat: 'BATTLE', rarity: 'UNCOMMON',  name: '连胜达人',     desc: '达成10场连胜',                check: s => s.maxWinStreak >= 10,   reward: { gold: 5000 } },
  { id: 'ko_streak_30',    cat: 'BATTLE', rarity: 'EPIC',      name: '不败传说',     desc: '达成30场连胜',                check: s => s.maxWinStreak >= 30,   reward: { gold: 30000, title: '不败传说' } },
  { id: 'domain_first',    cat: 'BATTLE', rarity: 'RARE',      name: '领域展开',     desc: '第一次展开领域',              check: s => s.domainsUsed >= 1,     reward: { gold: 5000 } },
  { id: 'vow_first',       cat: 'BATTLE', rarity: 'UNCOMMON',  name: '缚誓之力',     desc: '第一次使用缚誓',              check: s => s.vowsUsed >= 1,        reward: { gold: 3000 } },
  { id: 'fruit_transform',  cat: 'BATTLE', rarity: 'UNCOMMON',  name: '恶魔觉醒',     desc: '第一次在战斗中使用果实变身',  check: s => s.fruitTransforms >= 1, reward: { gold: 3000 } },
  { id: 'fruit_50_trans',   cat: 'BATTLE', rarity: 'RARE',      name: '变身大师',     desc: '累计使用果实变身50次',        check: s => s.fruitTransforms >= 50, reward: { gold: 15000, title: '变身大师' } },

  // ===== 探索类 (10) =====
  { id: 'explore_3',       cat: 'EXPLORE', rarity: 'COMMON',    name: '旅行者',       desc: '探索3个不同的地图',           check: s => s.mapsVisited >= 3,     reward: { gold: 1000 } },
  { id: 'explore_all',     cat: 'EXPLORE', rarity: 'RARE',      name: '环游世界',     desc: '探索所有地图区域',            check: s => s.mapsVisited >= 13,    reward: { gold: 15000, title: '环游世界' } },
  { id: 'steps_1k',        cat: 'EXPLORE', rarity: 'COMMON',    name: '散步者',       desc: '在地图上行走1000步',          check: s => s.totalSteps >= 1000,   reward: { gold: 1000 } },
  { id: 'steps_10k',       cat: 'EXPLORE', rarity: 'UNCOMMON',  name: '马拉松选手',   desc: '在地图上行走10000步',         check: s => s.totalSteps >= 10000,  reward: { gold: 5000 } },
  { id: 'steps_50k',       cat: 'EXPLORE', rarity: 'RARE',      name: '万里长征',     desc: '在地图上行走50000步',         check: s => s.totalSteps >= 50000,  reward: { gold: 20000, title: '行者' } },
  { id: 'dungeon_first',   cat: 'EXPLORE', rarity: 'UNCOMMON',  name: '副本探险者',   desc: '完成第一个特殊副本',          check: s => s.dungeonsCleared >= 1, reward: { gold: 3000 } },
  { id: 'dungeon_all',     cat: 'EXPLORE', rarity: 'EPIC',      name: '副本征服者',   desc: '完成所有特殊副本',            check: s => s.dungeonsCleared >= 8, reward: { gold: 30000, title: '副本之王' } },
  { id: 'infinity_10',     cat: 'EXPLORE', rarity: 'UNCOMMON',  name: '无尽攀登',     desc: '无限城堡到达第10层',          check: s => s.maxInfinityFloor >= 10, reward: { gold: 5000 } },
  { id: 'infinity_30',     cat: 'EXPLORE', rarity: 'RARE',      name: '深渊行者',     desc: '无限城堡到达第30层',          check: s => s.maxInfinityFloor >= 30, reward: { gold: 20000 } },
  { id: 'infinity_50',     cat: 'EXPLORE', rarity: 'LEGENDARY', name: '无限征服者',   desc: '无限城堡到达第50层',          check: s => s.maxInfinityFloor >= 50, reward: { gold: 60000, title: '无限征服者' } },

  // ===== 成长类 (11) =====
  { id: 'badge_first',     cat: 'GROWTH', rarity: 'COMMON',    name: '首枚徽章',     desc: '获得第一枚道馆徽章',          check: s => s.badgeCount >= 1,      reward: { gold: 1000 } },
  { id: 'badge_all',       cat: 'GROWTH', rarity: 'RARE',      name: '徽章大满贯',   desc: '获得全部8枚道馆徽章',         check: s => s.badgeCount >= 8,      reward: { gold: 15000, title: '全徽章训练家' } },
  { id: 'league_first',    cat: 'GROWTH', rarity: 'RARE',      name: '联赛新星',     desc: '首次赢得联赛冠军',            check: s => s.leagueWins >= 1,      reward: { gold: 10000, title: '联赛冠军' } },
  { id: 'league_10',       cat: 'GROWTH', rarity: 'EPIC',      name: '联赛霸主',     desc: '赢得联赛冠军10次',            check: s => s.leagueWins >= 10,     reward: { gold: 50000, title: '联赛之王' } },
  { id: 'sect_first',      cat: 'GROWTH', rarity: 'UNCOMMON',  name: '门派弟子',     desc: '击败第一位门派掌门',          check: s => s.sectChiefsDefeated >= 1, reward: { gold: 3000 } },
  { id: 'sect_all',        cat: 'GROWTH', rarity: 'EPIC',      name: '武林盟主',     desc: '击败全部12位门派掌门',        check: s => s.sectChiefsDefeated >= 12, reward: { gold: 50000, title: '武林盟主' } },
  { id: 'lv100',           cat: 'GROWTH', rarity: 'UNCOMMON',  name: '满级精灵',     desc: '培养一只精灵到100级',         check: s => s.maxPetLevel >= 100,   reward: { gold: 5000 } },
  { id: 'elite_team',      cat: 'GROWTH', rarity: 'RARE',      name: '精英队伍',     desc: '拥有满编6只50级以上精灵',     check: s => s.eliteTeamReady,       reward: { gold: 10000, title: '精英训练家' } },
  { id: 'challenge_6',     cat: 'GROWTH', rarity: 'UNCOMMON',  name: '挑战达人',     desc: '通关6座挑战塔',               check: s => s.challengesCompleted >= 6, reward: { gold: 8000 } },
  { id: 'challenge_all',   cat: 'GROWTH', rarity: 'EPIC',      name: '通关达人',     desc: '通关全部12座挑战塔',          check: s => s.challengesCompleted >= 12, reward: { gold: 40000, title: '全塔征服者' } },
  { id: 'gold_100k',       cat: 'GROWTH', rarity: 'UNCOMMON',  name: '小富即安',     desc: '累计获得100,000金币',         check: s => s.totalGoldEarned >= 100000, reward: { gold: 5000 } },

  // ===== 社交/生活类 (7) =====
  { id: 'house_first',     cat: 'SOCIAL', rarity: 'COMMON',    name: '安家落户',     desc: '购买第一套房子',              check: s => s.houseLevel >= 1,      reward: { gold: 2000 } },
  { id: 'house_castle',    cat: 'SOCIAL', rarity: 'EPIC',      name: '城堡之主',     desc: '升级为城堡',                  check: s => s.houseLevel >= 5,      reward: { gold: 30000, title: '城堡领主' } },
  { id: 'furniture_10',    cat: 'SOCIAL', rarity: 'UNCOMMON',  name: '室内设计师',   desc: '摆放10件家具',                check: s => s.furnitureCount >= 10, reward: { gold: 5000 } },
  { id: 'legend_home',     cat: 'SOCIAL', rarity: 'LEGENDARY', name: '传说家园',     desc: '家园评分达到传说级别',         check: s => s.housingScoreTier >= 5, reward: { gold: 50000, title: '传说家园主' } },
  { id: 'fishing_5',       cat: 'SOCIAL', rarity: 'UNCOMMON',  name: '钓鱼达人',     desc: '钓鱼活动获胜5次',             check: s => s.fishingWins >= 5,     reward: { gold: 3000 } },
  { id: 'beauty_first',    cat: 'SOCIAL', rarity: 'UNCOMMON',  name: '选美冠军',     desc: '赢得精灵选美比赛',            check: s => s.beautyWins >= 1,      reward: { gold: 5000 } },
  { id: 'pvp_10',          cat: 'SOCIAL', rarity: 'RARE',      name: 'PvP强者',      desc: '赢得10场PvP对战',             check: s => s.pvpWins >= 10,        reward: { gold: 10000, title: 'PvP高手' } },

  // ===== 精通类 (6) =====
  { id: 'gold_million',    cat: 'MASTERY', rarity: 'EPIC',      name: '亿万富翁',     desc: '累计获得1,000,000金币',       check: s => s.totalGoldEarned >= 1000000, reward: { gold: 50000, title: '亿万富翁' } },
  { id: 'all_badges_sects', cat: 'MASTERY', rarity: 'LEGENDARY', name: '至高训练家',   desc: '获得全徽章+击败全门派+联赛冠军', check: s => s.badgeCount >= 8 && s.sectChiefsDefeated >= 12 && s.leagueWins >= 1, reward: { gold: 100000, title: '至高训练家' } },
  { id: 'master_trainer',  cat: 'MASTERY', rarity: 'LEGENDARY', name: '精灵大师',     desc: '图鉴250+战斗500+联赛10+全门派', check: s => s.dexCount >= 250 && s.battlesWon >= 500 && s.leagueWins >= 10 && s.sectChiefsDefeated >= 12, reward: { gold: 200000, title: '精灵大师' } },
  { id: 'completionist',   cat: 'MASTERY', rarity: 'LEGENDARY', name: '完美主义者',   desc: '解锁50个成就',                check: s => s.achievementCount >= 50, reward: { gold: 150000, title: '完美主义者' } },
  { id: 'speed_demon',     cat: 'MASTERY', rarity: 'RARE',      name: '速攻战术',     desc: '在3回合内结束战斗10次',       check: s => s.quickWins >= 10,      reward: { gold: 10000 } },
  { id: 'type_master',     cat: 'MASTERY', rarity: 'EPIC',      name: '属性克制大师', desc: '利用属性克制造成超级有效300次', check: s => s.superEffectiveHits >= 300, reward: { gold: 25000 } },

  // ===== 隐藏成就 (6) =====
  { id: 'secret_starter',  cat: 'SECRET', rarity: 'COMMON',    name: '冒险的起点',   desc: '选择你的初始精灵',            check: s => s.starterChosen,        reward: { gold: 500 },  hidden: true },
  { id: 'secret_faint',    cat: 'SECRET', rarity: 'UNCOMMON',  name: '跌倒再爬起',   desc: '首次被击败',                  check: s => s.timesDefeated >= 1,   reward: { gold: 2000 }, hidden: true },
  { id: 'secret_run',      cat: 'SECRET', rarity: 'COMMON',    name: '三十六计',     desc: '从战斗中逃跑',                check: s => s.timesRun >= 1,        reward: { gold: 500 },  hidden: true },
  { id: 'secret_master_ball', cat: 'SECRET', rarity: 'EPIC',    name: '大师球传说',   desc: '使用大师球捕捉精灵',          check: s => s.masterBallUsed >= 1,  reward: { gold: 10000 }, hidden: true },
  { id: 'secret_overkill', cat: 'SECRET', rarity: 'RARE',      name: '毁天灭地',     desc: '单次伤害超过9999',            check: s => s.maxDamageDealt >= 9999, reward: { gold: 10000 }, hidden: true },
  { id: 'secret_rich',     cat: 'SECRET', rarity: 'RARE',      name: '挥金如土',     desc: '单次购物消费超过50000金币',   check: s => s.maxSinglePurchase >= 50000, reward: { gold: 15000 }, hidden: true },
];

export const DEFAULT_ACH_STATS = {
  totalCaught: 0,
  dexCount: 0,
  shinyCaught: 0,
  legendCaught: 0,
  uniqueFruits: 0,
  typesCollected: 0,
  battlesWon: 0,
  maxCritsInBattle: 0,
  clutchWins: 0,
  perfectWins: 0,
  sweepWins: 0,
  underdogWins: 0,
  maxWinStreak: 0,
  currentWinStreak: 0,
  domainsUsed: 0,
  vowsUsed: 0,
  fruitTransforms: 0,
  mapsVisited: 0,
  totalSteps: 0,
  dungeonsCleared: 0,
  maxInfinityFloor: 0,
  badgeCount: 0,
  leagueWins: 0,
  sectChiefsDefeated: 0,
  maxPetLevel: 0,
  eliteTeamReady: false,
  challengesCompleted: 0,
  totalGoldEarned: 0,
  houseLevel: 0,
  furnitureCount: 0,
  housingScoreTier: 0,
  fishingWins: 0,
  beautyWins: 0,
  pvpWins: 0,
  achievementCount: 0,
  quickWins: 0,
  superEffectiveHits: 0,
  starterChosen: false,
  timesDefeated: 0,
  timesRun: 0,
  masterBallUsed: 0,
  maxDamageDealt: 0,
  maxSinglePurchase: 0,
};

export default ACHIEVEMENTS;
