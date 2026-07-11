/** 段位徽章门槛：2→4→6→8→10→13；钻石 10 枚，大师 13 枚为终局门槛。 */
export const ARENA_RANKS = [
  { id: 'bronze',   name: '青铜', icon: '🥉', color: '#CD7F32', maxStars: 3, noDropOnLoss: true,
    enemyLvl: [20, 40], enemyCount: 3, reqBadges: 2,
    firstReward: { gold: 5000 },
    streakBonus: { 3: { gold: 2000 }, 5: { gold: 5000 } } },
  { id: 'silver',   name: '白银', icon: '🥈', color: '#C0C0C0', maxStars: 3, noDropOnLoss: false,
    enemyLvl: [40, 60], enemyCount: 4, reqBadges: 4,
    firstReward: { gold: 15000, title: '白银斗士' },
    streakBonus: { 3: { gold: 5000 }, 5: { gold: 10000 } } },
  { id: 'gold',     name: '黄金', icon: '🥇', color: '#FFD700', maxStars: 3, noDropOnLoss: false,
    enemyLvl: [55, 75], enemyCount: 5, reqBadges: 6,
    firstReward: { gold: 30000 },
    streakBonus: { 3: { gold: 8000 }, 5: { gold: 20000 } } },
  { id: 'platinum', name: '铂金', icon: '💎', color: '#E5E4E2', maxStars: 3, noDropOnLoss: false,
    enemyLvl: [70, 82], enemyCount: 5, reqBadges: 8,
    firstReward: { gold: 50000, title: '铂金王者' },
    streakBonus: { 3: { gold: 12000 }, 5: { gold: 30000 } } },
  { id: 'diamond',  name: '钻石', icon: '💠', color: '#B9F2FF', maxStars: 3, noDropOnLoss: false,
    enemyLvl: [84, 96], enemyCount: 6, reqBadges: 10,
    firstReward: { gold: 80000 },
    streakBonus: { 3: { gold: 20000 }, 5: { gold: 50000 } } },
  { id: 'master',   name: '大师', icon: '👑', color: '#FF6F00', maxStars: 3, noDropOnLoss: false,
    enemyLvl: [90, 100], enemyCount: 6, reqBadges: 13,
    firstReward: { gold: 150000, title: '竞技大师' },
    streakBonus: { 3: { gold: 20000 }, 5: { gold: 50000, title: '无双霸主' } },
    seasonReward: { gold: 200000, accessory: 'trophy', title: '赛季王者' } },
];

export const ARENA_WEEKLY_RULES = [
  { id: 'normal',    name: '自由对战', icon: '⚔️', desc: '无特殊限制', effect: null },
  { id: 'level_cap', name: '等级封印', icon: '🔒', desc: '所有精灵等级压到Lv.50', effect: 'levelCap50' },
  { id: 'solo',      name: '单挑模式', icon: '🎯', desc: '仅允许1v1决斗', effect: 'solo' },
  { id: 'type_lock', name: '属性限定', icon: '🎨', desc: '仅限本周指定属性', effect: 'typeLock' },
  { id: 'handicap',  name: '逆境突破', icon: '💪', desc: '初始全队扣50% HP', effect: 'halfHp' },
  { id: 'speed',     name: '极速对决', icon: '⚡', desc: '速度提升1.5倍，先手优势巨大', effect: 'speedBoost' },
  { id: 'double',    name: '双打狂欢', icon: '👥', desc: '所有对战为2v2双打', effect: 'forcedDouble' },
  { id: 'jutsu',     name: '忍术之战', icon: '🍥', desc: '忍术技能伤害+5~15%（按忍者段位：下忍+5%、中忍+8%、上忍+12%、影级+15%）', effect: 'jutsuBoost' },
];

export const ARENA_TICKET_PRICE = 3000;
export const ARENA_DAILY_FREE_TICKETS = 5;

export const ARENA_SEASON_REWARDS = [
  { rank: 'bronze',   gold: 5000,   desc: '🥉 青铜赛季奖励' },
  { rank: 'silver',   gold: 15000,  desc: '🥈 白银赛季奖励' },
  { rank: 'gold',     gold: 30000,  desc: '🥇 黄金赛季奖励' },
  { rank: 'platinum', gold: 60000,  desc: '💎 铂金赛季奖励' },
  { rank: 'diamond',  gold: 100000, desc: '💠 钻石赛季奖励' },
  { rank: 'master',   gold: 200000, accessory: 'trophy', title: '赛季王者', desc: '👑 大师赛季奖励（含传说饰品+称号）' },
];

export const DEFAULT_ARENA_STATE = {
  rank: 'bronze',
  stars: 0,
  tickets: 5,
  lastTicketDate: '',
  wins: 0,
  losses: 0,
  winStreak: 0,
  bestStreak: 0,
  weeklyRule: 'normal',
  lastRuleDate: '',
  rewardsClaimed: [],
  season: 1,
  seasonStartDate: '',
  seasonBestRank: 'bronze',
};

export function arenaPreviewSeed(rankId, ruleId, dateStr) {
  let h = 0;
  const s = `${rankId}|${ruleId}|${dateStr}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

export function mulberry32(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getArenaWeekTypes(date = new Date()) {
  const allowedTypes = ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE', 'FIGHT', 'PSYCHIC', 'DARK', 'DRAGON', 'FAIRY', 'NORMAL', 'WIND', 'LIGHT', 'COSMIC', 'SOUND', 'TIME', 'CHAOS', 'POISON', 'GROUND', 'FLYING', 'BUG', 'ROCK', 'GHOST', 'STEEL', 'HEAL', 'GOD'];
  const day = date.getDay();
  return [allowedTypes[day % allowedTypes.length], allowedTypes[(day + 3) % allowedTypes.length]];
}

export function resolveArenaResult(state, isWin, badgeCount = 0) {
  const prev = state || DEFAULT_ARENA_STATE;
  const rank = ARENA_RANKS.find(entry => entry.id === prev.rank) || ARENA_RANKS[0];
  const rankIdx = ARENA_RANKS.indexOf(rank);
  const rewards = { gold: 0, titles: [] };
  const notices = [];
  const next = {
    ...prev,
    rewardsClaimed: [...(prev.rewardsClaimed || [])],
    wins: Math.max(0, Number(prev.wins) || 0) + (isWin ? 1 : 0),
    losses: Math.max(0, Number(prev.losses) || 0) + (isWin ? 0 : 1),
  };

  if (!isWin) {
    next.winStreak = 0;
    next.stars = Math.max(0, Number(next.stars) || 0);
    if (!rank.noDropOnLoss && next.stars > 0) next.stars -= 1;
    return { state: next, rewards, notices, finalRankIndex: rankIdx };
  }

  next.winStreak = Math.max(0, Number(next.winStreak) || 0) + 1;
  next.bestStreak = Math.max(Number(next.bestStreak) || 0, next.winStreak);
  next.stars = Math.min(rank.maxStars, Math.max(0, Number(next.stars) || 0) + 1);

  const streakBonus = rank.streakBonus?.[next.winStreak];
  if (streakBonus) {
    rewards.gold += Math.max(0, Number(streakBonus.gold) || 0);
    if (streakBonus.title) rewards.titles.push(streakBonus.title);
    notices.push({ type: 'streak', streak: next.winStreak, gold: Math.max(0, Number(streakBonus.gold) || 0) });
  }

  const nextRank = ARENA_RANKS[rankIdx + 1];
  if (next.stars >= rank.maxStars && nextRank) {
    if (badgeCount < nextRank.reqBadges) {
      notices.push({ type: 'blocked', rank: nextRank });
    } else {
      next.rank = nextRank.id;
      next.stars = 0;
      if (nextRank.firstReward && !next.rewardsClaimed.includes(nextRank.id)) {
        rewards.gold += Math.max(0, Number(nextRank.firstReward.gold) || 0);
        if (nextRank.firstReward.title) rewards.titles.push(nextRank.firstReward.title);
        next.rewardsClaimed.push(nextRank.id);
      }
      next.seasonBestRank = nextRank.id;
      notices.push({ type: 'promotion', rank: nextRank });
    }
  }

  const rankOrder = ARENA_RANKS.map(entry => entry.id);
  if (rankOrder.indexOf(next.rank) > rankOrder.indexOf(next.seasonBestRank || 'bronze')) {
    next.seasonBestRank = next.rank;
  }
  return {
    state: next,
    rewards: { ...rewards, titles: [...new Set(rewards.titles)] },
    notices,
    finalRankIndex: Math.max(0, rankOrder.indexOf(next.rank)),
  };
}

export function resolveArenaDailyRefresh(state, today) {
  const prev = state || DEFAULT_ARENA_STATE;
  if (!today || prev.lastTicketDate === today) {
    return { state: prev, seasonReward: null };
  }

  const now = new Date(`${today}T12:00:00`);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor(((now - startOfYear) / 86400000 + startOfYear.getDay()) / 7);
  const ruleIdx = weekNum % ARENA_WEEKLY_RULES.length;
  const ticketCap = ARENA_DAILY_FREE_TICKETS * 3;
  const next = {
    ...prev,
    tickets: Math.min(ticketCap, Math.max(0, Number(prev.tickets) || 0) + ARENA_DAILY_FREE_TICKETS),
    lastTicketDate: today,
    weeklyRule: ARENA_WEEKLY_RULES[ruleIdx]?.id || 'normal',
    lastRuleDate: today,
  };
  let seasonReward = null;

  const seasonStartDay = Date.parse(`${prev.seasonStartDate || ''}T12:00:00Z`);
  const todayDay = Date.parse(`${today}T12:00:00Z`);
  if (!Number.isFinite(seasonStartDay)) {
    next.seasonStartDate = today;
  } else if (Number.isFinite(todayDay) && Math.floor((todayDay - seasonStartDay) / 86400000) >= 14) {
    const bestRank = prev.seasonBestRank || prev.rank || 'bronze';
    const reward = ARENA_SEASON_REWARDS.find(entry => entry.rank === bestRank) || null;
    seasonReward = reward ? { ...reward, bestRank, season: Math.max(1, Number(prev.season) || 1) } : null;
    next.season = Math.max(1, Number(prev.season) || 1) + 1;
    next.seasonStartDate = today;
    next.seasonBestRank = 'bronze';
    const rankOrder = ARENA_RANKS.map(entry => entry.id);
    const curIdx = Math.max(0, rankOrder.indexOf(prev.rank || 'bronze'));
    next.rank = rankOrder[Math.max(0, curIdx - 2)] || 'bronze';
    next.stars = 0;
  }

  const rankOrder = ARENA_RANKS.map(entry => entry.id);
  if (rankOrder.indexOf(next.rank) > rankOrder.indexOf(next.seasonBestRank || 'bronze')) {
    next.seasonBestRank = next.rank;
  }
  return { state: next, seasonReward };
}
