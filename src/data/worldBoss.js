// =====================================================================
// 世界Boss — 每日轮换的超强Boss挑战
// 解锁条件: 6枚徽章 | 每日3次挑战机会 | 伤害累计制
// =====================================================================

export const WORLD_BOSSES = [
  {
    id: 'wb_dragon_king', name: '龙王·雷吉纳斯', emoji: '🐉', type: 'DRAGON',
    baseLv: 80, baseHp: 50000, baseStats: { hp: 200, p_atk: 180, p_def: 150, s_atk: 160, s_def: 130, spd: 120 },
    traits: ['intimidate', 'multiscale'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '龙王露出凶猛的目光！' },
      { hpPct: 0.6, buff: { p_atk: 2 }, msg: '龙王暴怒了！攻击力大幅提升！' },
      { hpPct: 0.3, buff: { spd: 2, crit: 1 }, msg: '龙王进入狂暴状态！速度和暴击飙升！' },
    ],
    rewards: { gold: 8000, exp_candy: 3, tickets: 2 },
    milestones: [
      { dmg: 5000,  reward: { gold: 2000 }, desc: '造成5000伤害: 💰 2000金币' },
      { dmg: 15000, reward: { gold: 5000, tickets: 1 }, desc: '造成15000伤害: 💰 5000金 + 🎫 竞技票' },
      { dmg: 30000, reward: { exp_candy: 2 }, desc: '造成30000伤害: 🍬 经验糖果x2' },
      { dmg: 50000, reward: { gold: 10000, title: '屠龙勇士' }, desc: '击败Boss: 💰 10000金 + 称号「屠龙勇士」' },
    ],
  },
  {
    id: 'wb_ice_titan', name: '冰霜泰坦·弗罗斯特', emoji: '🧊', type: 'ICE',
    baseLv: 85, baseHp: 55000, baseStats: { hp: 220, p_atk: 140, p_def: 200, s_atk: 120, s_def: 180, spd: 80 },
    traits: ['ice_body', 'sturdy'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '冰霜泰坦缓缓苏醒...' },
      { hpPct: 0.5, buff: { p_def: 2, s_def: 1 }, msg: '泰坦的冰甲变得更加坚固！' },
      { hpPct: 0.2, buff: { s_atk: 3 }, msg: '泰坦释放了终极冰暴！特攻暴涨！' },
    ],
    rewards: { gold: 9000, exp_candy: 3, tickets: 2 },
    milestones: [
      { dmg: 5000,  reward: { gold: 2000 }, desc: '造成5000伤害: 💰 2000金币' },
      { dmg: 18000, reward: { gold: 5000, tickets: 1 }, desc: '造成18000伤害: 💰 5000金 + 🎫 竞技票' },
      { dmg: 35000, reward: { exp_candy: 2, berries: 5 }, desc: '造成35000伤害: 🍬 糖果x2 + 🍒 树果x5' },
      { dmg: 55000, reward: { gold: 12000, title: '破冰者' }, desc: '击败Boss: 💰 12000金 + 称号「破冰者」' },
    ],
  },
  {
    id: 'wb_shadow_lord', name: '暗影领主·奈克萨斯', emoji: '👹', type: 'DARK',
    baseLv: 85, baseHp: 48000, baseStats: { hp: 180, p_atk: 200, p_def: 130, s_atk: 180, s_def: 110, spd: 160 },
    traits: ['pressure', 'dark_aura'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '暗影从深渊中浮现...' },
      { hpPct: 0.7, buff: { spd: 1, eva: 1 }, msg: '暗影领主的身形变得模糊不定！' },
      { hpPct: 0.35, buff: { p_atk: 2, s_atk: 2 }, msg: '黑暗力量全面觉醒！双攻暴涨！' },
    ],
    rewards: { gold: 8500, exp_candy: 3, tickets: 2 },
    milestones: [
      { dmg: 5000,  reward: { gold: 2000 }, desc: '造成5000伤害: 💰 2000金币' },
      { dmg: 15000, reward: { gold: 4000, tickets: 1 }, desc: '造成15000伤害: 💰 4000金 + 🎫 竞技票' },
      { dmg: 28000, reward: { exp_candy: 2 }, desc: '造成28000伤害: 🍬 经验糖果x2' },
      { dmg: 48000, reward: { gold: 10000, title: '暗影猎手' }, desc: '击败Boss: 💰 10000金 + 称号「暗影猎手」' },
    ],
  },
  {
    id: 'wb_storm_phoenix', name: '风暴凤凰·塞拉菲姆', emoji: '🔥', type: 'FIRE',
    baseLv: 90, baseHp: 52000, baseStats: { hp: 190, p_atk: 170, p_def: 140, s_atk: 190, s_def: 130, spd: 170 },
    traits: ['flame_body', 'regenerator'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '凤凰在烈焰中重生！' },
      { hpPct: 0.5, buff: { s_atk: 2, spd: 1 }, msg: '凤凰之翼燃烧得更加猛烈！' },
      { hpPct: 0.15, buff: { p_atk: 2, s_atk: 2, spd: 2 }, msg: '涅槃之焰！凤凰进入终极形态！' },
    ],
    rewards: { gold: 10000, exp_candy: 4, tickets: 3 },
    milestones: [
      { dmg: 6000,  reward: { gold: 2500 }, desc: '造成6000伤害: 💰 2500金币' },
      { dmg: 18000, reward: { gold: 6000, tickets: 1 }, desc: '造成18000伤害: 💰 6000金 + 🎫 竞技票' },
      { dmg: 35000, reward: { exp_candy: 3 }, desc: '造成35000伤害: 🍬 经验糖果x3' },
      { dmg: 52000, reward: { gold: 15000, title: '凤凰审判者' }, desc: '击败Boss: 💰 15000金 + 称号「凤凰审判者」' },
    ],
  },
  {
    id: 'wb_earth_golem', name: '大地巨像·盖亚', emoji: '⛰️', type: 'ROCK',
    baseLv: 88, baseHp: 65000, baseStats: { hp: 280, p_atk: 160, p_def: 240, s_atk: 140, s_def: 220, spd: 40 },
    traits: ['sturdy', 'sand_stream'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '山岳震动，巨像苏醒了...' },
      { hpPct: 0.6, buff: { p_def: 3 }, msg: '岩层加固！防御力大幅上升！' },
      { hpPct: 0.25, buff: { p_atk: 3, p_def: -1 }, msg: '巨像放弃防御，释放全部力量！' },
    ],
    rewards: { gold: 9500, exp_candy: 3, tickets: 2 },
    milestones: [
      { dmg: 8000,  reward: { gold: 3000 }, desc: '造成8000伤害: 💰 3000金币' },
      { dmg: 22000, reward: { gold: 6000, tickets: 1 }, desc: '造成22000伤害: 💰 6000金 + 🎫 竞技票' },
      { dmg: 42000, reward: { exp_candy: 3 }, desc: '造成42000伤害: 🍬 经验糖果x3' },
      { dmg: 65000, reward: { gold: 12000, title: '碎岩巨人' }, desc: '击败Boss: 💰 12000金 + 称号「碎岩巨人」' },
    ],
  },
  {
    id: 'wb_cosmic_entity', name: '宇宙意志·虚空', emoji: '🌌', type: 'COSMIC',
    baseLv: 95, baseHp: 70000, baseStats: { hp: 250, p_atk: 190, p_def: 180, s_atk: 200, s_def: 170, spd: 150 },
    traits: ['pressure', 'magic_guard'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '虚空裂隙中涌出无尽的宇宙能量...' },
      { hpPct: 0.5, buff: { s_atk: 2, s_def: 2 }, msg: '维度扭曲！特殊属性全面提升！' },
      { hpPct: 0.2, buff: { p_atk: 2, s_atk: 2, spd: 2, crit: 2 }, msg: '宇宙意志展现了终极力量！全属性暴涨！' },
    ],
    rewards: { gold: 15000, exp_candy: 5, tickets: 3 },
    milestones: [
      { dmg: 10000, reward: { gold: 5000 }, desc: '造成10000伤害: 💰 5000金币' },
      { dmg: 25000, reward: { gold: 8000, tickets: 2 }, desc: '造成25000伤害: 💰 8000金 + 🎫 竞技票x2' },
      { dmg: 50000, reward: { exp_candy: 4 }, desc: '造成50000伤害: 🍬 经验糖果x4' },
      { dmg: 70000, reward: { gold: 20000, title: '星际猎人' }, desc: '击败Boss: 💰 20000金 + 称号「星际猎人」' },
    ],
  },
  {
    id: 'wb_fairy_queen', name: '妖精女王·蒂塔妮亚', emoji: '🧚', type: 'FAIRY',
    baseLv: 82, baseHp: 45000, baseStats: { hp: 200, p_atk: 120, p_def: 160, s_atk: 150, s_def: 180, spd: 140 },
    traits: ['magic_bounce', 'fairy_aura'],
    phases: [
      { hpPct: 1.0, buff: null, msg: '妖精女王降临，花瓣漫天飞舞！' },
      { hpPct: 0.5, buff: { s_def: 2, spd: 1 }, msg: '魔法屏障展开！特防和速度上升！' },
      { hpPct: 0.25, buff: { s_atk: 3 }, msg: '女王释放了月光审判！特攻狂涨！' },
    ],
    rewards: { gold: 7500, exp_candy: 3, tickets: 2 },
    milestones: [
      { dmg: 5000,  reward: { gold: 2000 }, desc: '造成5000伤害: 💰 2000金币' },
      { dmg: 15000, reward: { gold: 4000, tickets: 1 }, desc: '造成15000伤害: 💰 4000金 + 🎫 竞技票' },
      { dmg: 30000, reward: { exp_candy: 2 }, desc: '造成30000伤害: 🍬 经验糖果x2' },
      { dmg: 45000, reward: { gold: 10000, title: '仙境行者' }, desc: '击败Boss: 💰 10000金 + 称号「仙境行者」' },
    ],
  },
];

export const WORLD_BOSS_MAX_ATTEMPTS = 3;
export const WORLD_BOSS_REQ_BADGES = 6;

export const DEFAULT_WORLD_BOSS_STATE = {
  currentBossId: null,
  bossDate: null,
  totalDamage: 0,
  attempts: 0,
  claimedMilestones: [],
  defeated: false,
  bestDamage: 0,
  totalBossesDefeated: 0,
};

export function getTodayBoss(dateStr) {
  const dayHash = dateStr.split('-').reduce((s, n) => s + parseInt(n, 10), 0);
  return WORLD_BOSSES[dayHash % WORLD_BOSSES.length];
}

export function scaleBossHp(boss, badges) {
  const mult = 1 + Math.max(0, badges - 6) * 0.12;
  return Math.floor(boss.baseHp * mult);
}

export function scaleBossLevel(boss, badges) {
  return Math.min(100, boss.baseLv + Math.max(0, badges - 6) * 2);
}
