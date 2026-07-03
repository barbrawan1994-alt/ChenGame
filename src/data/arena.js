/** 段位徽章门槛：2→4→6→8→10；钻石起为 10 枚，与大师同为终局门槛（铂金仍为 8→10 的明确进阶）。 */
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
  { id: 'speed',     name: '极速对决', icon: '⚡', desc: '速度决定一切，先手必杀', effect: 'speedBoost' },
  { id: 'double',    name: '双打狂欢', icon: '👥', desc: '所有对战为2v2双打', effect: 'forcedDouble' },
  { id: 'jutsu',     name: '忍术之战', icon: '🍥', desc: '忍术技能伤害+5~15%（低段位15%、影级5%，递减追赶）', effect: 'jutsuBoost' },
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
