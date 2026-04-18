// =====================================================================
// 精灵特训营 — 针对性强化精灵努力值(EV)的训练系统
// 解锁条件: 4枚徽章 | 训练位: 最多2个 | 每只精灵每日可训练1次
// =====================================================================

export const TRAINING_CAMPS = [
  { id: 'hp',    name: '体力训练场', icon: '❤️', stat: 'hp',    color: '#E53935', desc: '通过耐力跑和负重训练强化HP', reqBadges: 4 },
  { id: 'p_atk', name: '力量训练场', icon: '⚔️', stat: 'p_atk', color: '#FF6D00', desc: '进行沙袋击打和格斗特训', reqBadges: 4 },
  { id: 'p_def', name: '防御训练场', icon: '🛡️', stat: 'p_def', color: '#2E7D32', desc: '承受冲击波训练防御韧性', reqBadges: 5 },
  { id: 's_atk', name: '特攻训练场', icon: '🔮', stat: 's_atk', color: '#7B1FA2', desc: '冥想与元素操控集训', reqBadges: 5 },
  { id: 's_def', name: '特防训练场', icon: '💠', stat: 's_def', color: '#00838F', desc: '抵御属性能量波训练', reqBadges: 6 },
  { id: 'spd',   name: '速度训练场', icon: '⚡', stat: 'spd',   color: '#F9A825', desc: '冲刺与闪避反应特训', reqBadges: 6 },
];

export const TRAINING_TIERS = [
  { tier: 1, name: '基础训练',   duration: 10 * 60 * 1000, gain: [1, 2],  cost: 500,   reqBadges: 4 },
  { tier: 2, name: '强化训练',   duration: 20 * 60 * 1000, gain: [2, 3],  cost: 1500,  reqBadges: 6 },
  { tier: 3, name: '精英训练',   duration: 40 * 60 * 1000, gain: [3, 5],  cost: 3000,  reqBadges: 8 },
  { tier: 4, name: '极限训练',   duration: 60 * 60 * 1000, gain: [4, 6],  cost: 5000,  reqBadges: 10 },
];

export const TRAINING_MAX_EV = 252;
export const TRAINING_TOTAL_MAX_EV = 510;
export const TRAINING_MAX_SLOTS = 2;
export const TRAINING_REQ_BADGES = 4;

export const TRAINING_EVENTS = [
  '训练非常顺利，状态极佳！',
  '它在训练中学到了新的技巧！',
  '训练场教练对它赞不绝口！',
  '它比其他精灵更努力地训练！',
  '它在休息时偷偷加练了一会！',
  '其他精灵都被它的毅力感动了！',
  '它和训练伙伴配合默契！',
  '今天的训练让它变得更强了！',
];

export const DEFAULT_TRAINING_STATE = {
  slots: [],
  dailyCount: {},
  totalSessions: 0,
  lastResetDate: null,
};

export function calcTrainingGain(pet, camp, tier, badges) {
  const [minG, maxG] = tier.gain;
  let gain = minG + Math.floor(Math.random() * (maxG - minG + 1));

  if (pet.isShiny) gain = Math.floor(gain * 1.2);
  if (pet.intimacy >= 80) gain += 1;
  if (badges >= 10) gain += 1;

  const currentEV = (pet.evs || {})[camp.stat] || 0;
  const totalEV = Object.values(pet.evs || {}).reduce((s, v) => s + v, 0);

  gain = Math.min(gain, TRAINING_MAX_EV - currentEV);
  gain = Math.min(gain, TRAINING_TOTAL_MAX_EV - totalEV);

  return Math.max(0, gain);
}
