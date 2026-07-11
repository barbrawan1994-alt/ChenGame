import { TYPES } from './types';

const EARLY_BOUNTY_TYPES = ['NORMAL', 'FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'POISON', 'GROUND', 'FLYING', 'BUG', 'ROCK'];
const MID_BOUNTY_TYPES = ['ICE', 'FIGHT', 'PSYCHIC', 'GHOST', 'DARK', 'STEEL', 'FAIRY', 'DRAGON'];
const LATE_BOUNTY_TYPES = ['WIND', 'LIGHT', 'HEAL', 'COSMIC', 'SOUND', 'TIME', 'CHAOS'];

export function getBountyEligibleTypes(badgeCount = 0) {
  const badges = Math.max(0, Number(badgeCount) || 0);
  const ids = [...EARLY_BOUNTY_TYPES];
  if (badges >= 2) ids.push(...MID_BOUNTY_TYPES);
  if (badges >= 6) ids.push(...LATE_BOUNTY_TYPES);
  if (badges >= 10) ids.push('GOD');
  return ids.filter(id => TYPES[id]);
}

function pickType(badgeCount) {
  const pool = getBountyEligibleTypes(badgeCount);
  return pool[Math.floor(Math.random() * pool.length)] || 'NORMAL';
}

const TYPE_NAMES = {};
Object.entries(TYPES).forEach(([k, v]) => { TYPE_NAMES[k] = v.name; });

export { TYPE_NAMES };

export const BOUNTY_TEMPLATES = [
  {
    id: 'catch_type', category: 'catch', icon: '🎯',
    generate: (badgeCount) => {
      const t = pickType(badgeCount); const n = 2 + Math.min(Math.floor(badgeCount / 2), 4);
      return { id: `catch_${t}_${n}`, desc: `捕捉 ${n} 只${TYPE_NAMES[t] || t}系精灵`, type: 'catch', targetType: t, target: n, progress: 0, reward: { gold: 1500 + badgeCount * 300 }, completed: false };
    }
  },
  {
    id: 'beat_trainers', category: 'battle', icon: '⚔️',
    generate: (badgeCount) => {
      const n = 3 + Math.min(Math.floor(badgeCount / 2), 5);
      return { id: `beat_trainers_${n}`, desc: `击败 ${n} 个训练家`, type: 'beat_trainer', target: n, progress: 0, reward: { gold: 1850 + badgeCount * 340 }, completed: false };
    }
  },
  {
    id: 'win_battles', category: 'battle', icon: '🏆',
    generate: (badgeCount) => {
      const n = 5 + Math.min(Math.floor(badgeCount / 3), 5);
      return { id: `win_battles_${n}`, desc: `赢得 ${n} 场战斗`, type: 'win_battle', target: n, progress: 0, reward: { gold: 1650 + badgeCount * 220, tickets: 1 }, completed: false };
    }
  },
  {
    id: 'evolve_pets', category: 'nurture', icon: '🧬', minBadges: 1,
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 4), 2);
      return { id: `evolve_${n}`, desc: `进化 ${n} 只精灵`, type: 'evolve', target: n, progress: 0, reward: { gold: 1950 + badgeCount * 420 }, completed: false };
    }
  },
  {
    id: 'hatch_eggs', category: 'nurture', icon: '🥚', minBadges: 2,
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 5), 2);
      return { id: `hatch_${n}`, desc: `孵化 ${n} 枚蛋`, type: 'hatch', target: n, progress: 0, reward: { gold: 1950 + badgeCount * 340 }, completed: false };
    }
  },
  {
    id: 'mine_ores', category: 'explore', icon: '⛏️', minBadges: 2,
    generate: (badgeCount) => {
      const n = 5 + Math.min(badgeCount, 10);
      return { id: `mine_${n}`, desc: `挖掘 ${n} 个矿石`, type: 'mine', target: n, progress: 0, reward: { gold: 1100 + badgeCount * 180 }, completed: false };
    }
  },
  {
    id: 'expedition_complete', category: 'explore', icon: '🗺️',
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 3), 2);
      return { id: `expedition_${n}`, desc: `完成 ${n} 次探险`, type: 'expedition', target: n, progress: 0, reward: { gold: 1800 + badgeCount * 300 }, completed: false };
    }
  },
  {
    id: 'training_camp', category: 'facility', icon: '🏋️', minBadges: 4,
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 5), 2);
      return { id: `training_${n}`, desc: `完成特训营训练 ${n} 次`, type: 'training', target: n, progress: 0, reward: { gold: 1800 + badgeCount * 340 }, completed: false };
    }
  },
  {
    id: 'spend_gold', category: 'economy', icon: '💰',
    generate: (badgeCount) => {
      const n = (3 + badgeCount) * 1000;
      return { id: `spend_${n}`, desc: `消费 ${n.toLocaleString()} 金币`, type: 'spend_gold', target: n, progress: 0, reward: { gold: Math.floor(n * 0.25) }, completed: false };
    }
  },
  {
    id: 'explore_maps', category: 'explore', icon: '🧭',
    generate: (badgeCount) => {
      const n = 2 + Math.min(Math.floor(badgeCount / 2), 4);
      return { id: `explore_maps_${n}`, desc: `探索 ${n} 个不同地图`, type: 'explore_map', target: n, progress: 0, reward: { gold: 1350 + badgeCount * 220 }, completed: false, visited: [] };
    }
  },
  {
    id: 'use_type_move', category: 'battle', icon: '💥',
    generate: (badgeCount) => {
      const t = pickType(badgeCount); const n = 5 + Math.min(badgeCount, 10);
      return { id: `use_${t}_${n}`, desc: `使用 ${n} 次${TYPE_NAMES[t] || t}系技能`, type: 'use_type_move', targetType: t, target: n, progress: 0, reward: { gold: 950 + badgeCount * 180, tickets: 1 }, completed: false };
    }
  },
  {
    id: 'jutsu_battle', category: 'battle', icon: '🍥', minBadges: 3,
    generate: (badgeCount) => {
      const n = 3 + Math.min(Math.floor(badgeCount / 2), 5);
      return { id: `jutsu_win_${n}`, desc: `使用忍术技能赢得 ${n} 场战斗`, type: 'jutsu_win_battle', target: n, progress: 0, reward: { gold: 1950 + badgeCount * 340, tickets: 1 }, completed: false };
    }
  },
  {
    id: 'learn_tm', category: 'skill', icon: '📖',
    generate: (badgeCount) => ({
      id: `learn_tm_${badgeCount}`,
      desc: '让精灵成功学会 1 本技能书 (TM)',
      type: 'learn_tm',
      target: 1,
      progress: 0,
      reward: { gold: 1100 + badgeCount * 180 },
      completed: false,
    }),
  },
];

export function generateDailyBounties(badgeCount) {
  const badges = Math.max(0, Number(badgeCount) || 0);
  const pool = BOUNTY_TEMPLATES.filter(template => badges >= (template.minBadges || 0));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const selected = [];
  const usedCategories = new Set();
  for (const t of pool) {
    if (selected.length >= 5) break;
    if (usedCategories.has(t.category)) continue;
    selected.push(t);
    usedCategories.add(t.category);
  }
  if (selected.length < 5) {
    for (const t of pool) {
      if (selected.length >= 5) break;
      if (selected.includes(t)) continue;
      selected.push(t);
    }
  }
  return selected.map(t => t.generate(badgeCount));
}

export function getMasterChestReward(badgeCount) {
  const baseGold = 5000 + badgeCount * 1000;
  return {
    gold: baseGold,
    tickets: 2,
    berries: 10 + badgeCount * 2,
    desc: `💰 ${baseGold.toLocaleString()}金币 + 🎫 竞技票x2 + 🍒 ${10 + badgeCount * 2}树果`,
  };
}

export const DEFAULT_BOUNTY_BOARD = {
  date: '',
  quests: [],
  allCompleted: false,
  masterChestClaimed: false,
};
