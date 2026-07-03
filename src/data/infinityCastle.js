/** 无限城层数词缀 — 每层的战场环境效果 */
export const INFINITY_FLOOR_MODIFIERS = [
  { id: 'mist', name: '迷雾', icon: '🌫️', desc: '敌方闪避+1 阶段', enemyEva: 1 },
  { id: 'fury', name: '狂怒', icon: '🔥', desc: '敌方物攻+15%', enemyStatMult: { p_atk: 1.15 } },
  { id: 'armor', name: '铁壁', icon: '🛡️', desc: '敌方双防+15%', enemyStatMult: { p_def: 1.15, s_def: 1.15 } },
  { id: 'haste', name: '疾风', icon: '💨', desc: '敌方速度+20%', enemyStatMult: { spd: 1.2 } },
  { id: 'curse', name: '诅咒', icon: '☠️', desc: '我方每回合损 3% HP（战后恢复）', playerCurse: 0.03 },
  { id: 'focus', name: '集中', icon: '🎯', desc: '敌方暴击+10%', enemyCritBonus: 10 },
  { id: 'regen', name: '再生', icon: '💚', desc: '敌方每回合回复 5% HP', enemyRegen: 0.05 },
  { id: 'glass', name: '脆刃', icon: '⚔️', desc: '双方伤害+20%', damageMult: 1.2 },
];

export function getInfinityFloorModifier(floor) {
  const idx = Math.max(0, Math.floor(floor || 1) - 1) % INFINITY_FLOOR_MODIFIERS.length;
  return INFINITY_FLOOR_MODIFIERS[idx];
}

/** 里程碑层：通关后额外宝箱（不含 10/50 等特殊层） */
export const INFINITY_MILESTONE_FLOORS = [5, 15, 35, 45, 55, 65, 85, 95];

export function isInfinityMilestoneFloor(floor) {
  return INFINITY_MILESTONE_FLOORS.includes(floor);
}

export function getInfinityMilestoneReward(floor) {
  const gold = 800 + floor * 120;
  if (floor >= 100) return { gold: gold + 5000, item: 'master', itemCount: 1, label: '终极补给箱', title: '城堡征服者' };
  if (floor >= 85) return { gold, item: 'ultra', itemCount: 2, label: '传说补给箱' };
  if (floor >= 75) return { gold, item: 'hyper_potion', itemCount: 8, label: '精英+补给箱' };
  if (floor >= 55) return { gold, item: 'hyper_potion', itemCount: 5, label: '高级补给箱' };
  if (floor >= 35) return { gold, item: 'great', itemCount: 8, label: '精英补给箱' };
  if (floor >= 25) return { gold, item: 'great', itemCount: 5, label: '进阶补给箱' };
  return { gold, item: 'potion', itemCount: 10, label: '探索补给箱' };
}
