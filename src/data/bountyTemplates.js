import { TYPES } from './types';

const TYPES_FOR_BOUNTY = Object.keys(TYPES);

function pickType() { return TYPES_FOR_BOUNTY[Math.floor(Math.random() * TYPES_FOR_BOUNTY.length)]; }

const TYPE_NAMES = {};
Object.entries(TYPES).forEach(([k, v]) => { TYPE_NAMES[k] = v.name; });

export { TYPE_NAMES };

export const BOUNTY_TEMPLATES = [
  {
    id: 'catch_type', category: 'catch', icon: '🎯',
    generate: (badgeCount) => {
      const t = pickType(); const n = 2 + Math.min(Math.floor(badgeCount / 2), 4);
      return { id: `catch_${t}_${n}`, desc: `捕捉 ${n} 只${TYPE_NAMES[t] || t}系精灵`, type: 'catch', targetType: t, target: n, progress: 0, reward: { gold: 1500 + badgeCount * 300 }, completed: false };
    }
  },
  {
    id: 'beat_trainers', category: 'battle', icon: '⚔️',
    generate: (badgeCount) => {
      const n = 3 + Math.min(Math.floor(badgeCount / 2), 5);
      return { id: `beat_trainers_${n}`, desc: `击败 ${n} 个训练家`, type: 'beat_trainer', target: n, progress: 0, reward: { gold: 2000 + badgeCount * 400 }, completed: false };
    }
  },
  {
    id: 'win_battles', category: 'battle', icon: '🏆',
    generate: (badgeCount) => {
      const n = 5 + Math.min(Math.floor(badgeCount / 3), 5);
      return { id: `win_battles_${n}`, desc: `赢得 ${n} 场战斗`, type: 'win_battle', target: n, progress: 0, reward: { gold: 1800 + badgeCount * 250, tickets: 1 }, completed: false };
    }
  },
  {
    id: 'evolve_pets', category: 'nurture', icon: '🧬',
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 4), 2);
      return { id: `evolve_${n}`, desc: `进化 ${n} 只精灵`, type: 'evolve', target: n, progress: 0, reward: { gold: 3000 + badgeCount * 500 }, completed: false };
    }
  },
  {
    id: 'hatch_eggs', category: 'nurture', icon: '🥚',
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 5), 2);
      return { id: `hatch_${n}`, desc: `孵化 ${n} 枚蛋`, type: 'hatch', target: n, progress: 0, reward: { gold: 2500 + badgeCount * 400 }, completed: false };
    }
  },
  {
    id: 'mine_ores', category: 'explore', icon: '⛏️',
    generate: (badgeCount) => {
      const n = 5 + Math.min(badgeCount, 10);
      return { id: `mine_${n}`, desc: `挖掘 ${n} 个矿石`, type: 'mine', target: n, progress: 0, reward: { gold: 1200 + badgeCount * 200 }, completed: false };
    }
  },
  {
    id: 'expedition_complete', category: 'explore', icon: '🗺️',
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 3), 2);
      return { id: `expedition_${n}`, desc: `完成 ${n} 次探险`, type: 'expedition', target: n, progress: 0, reward: { gold: 2000 + badgeCount * 350 }, completed: false };
    }
  },
  {
    id: 'training_camp', category: 'facility', icon: '🏋️',
    generate: (badgeCount) => {
      const n = 1 + Math.min(Math.floor(badgeCount / 5), 2);
      return { id: `training_${n}`, desc: `完成特训营训练 ${n} 次`, type: 'training', target: n, progress: 0, reward: { gold: 2000 + badgeCount * 400 }, completed: false };
    }
  },
  {
    id: 'spend_gold', category: 'economy', icon: '💰',
    generate: (badgeCount) => {
      const n = (3 + badgeCount) * 1000;
      return { id: `spend_${n}`, desc: `消费 ${n.toLocaleString()} 金币`, type: 'spend_gold', target: n, progress: 0, reward: { gold: Math.floor(n * 0.15) }, completed: false };
    }
  },
  {
    id: 'explore_maps', category: 'explore', icon: '🧭',
    generate: (badgeCount) => {
      const n = 2 + Math.min(Math.floor(badgeCount / 2), 4);
      return { id: `explore_maps_${n}`, desc: `探索 ${n} 个不同地图`, type: 'explore_map', target: n, progress: 0, reward: { gold: 1500 + badgeCount * 250 }, completed: false, visited: [] };
    }
  },
  {
    id: 'use_type_move', category: 'battle', icon: '💥',
    generate: (badgeCount) => {
      const t = pickType(); const n = 5 + Math.min(badgeCount, 10);
      return { id: `use_${t}_${n}`, desc: `使用 ${n} 次${TYPE_NAMES[t] || t}系技能`, type: 'use_type_move', targetType: t, target: n, progress: 0, reward: { gold: 1000 + badgeCount * 200, tickets: 1 }, completed: false };
    }
  },
  {
    id: 'jutsu_battle', category: 'battle', icon: '🍥',
    generate: (badgeCount) => {
      const n = 3 + Math.min(Math.floor(badgeCount / 2), 5);
      return { id: `jutsu_win_${n}`, desc: `使用忍术技能赢得 ${n} 场战斗`, type: 'jutsu_win_battle', target: n, progress: 0, reward: { gold: 2500 + badgeCount * 400, tickets: 1 }, completed: false };
    }
  },
];

export function generateDailyBounties(badgeCount) {
  const pool = [...BOUNTY_TEMPLATES];
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
