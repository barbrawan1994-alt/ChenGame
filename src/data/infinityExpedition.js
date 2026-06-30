/** 灵境远征 — 无限城路线、灵契祝福、技能变异 */

export const INFINITY_ROUTE_TYPES = [
  {
    id: 'battle', name: '战斗', icon: '⚔️', desc: '普通遭遇战',
    rewardMult: 1.0, risk: 0.1,
  },
  {
    id: 'elite', name: '精英战', icon: '💀', desc: '强敌，奖励+40%',
    rewardMult: 1.4, risk: 0.35, difficulty: 'hard',
  },
  {
    id: 'merchant', name: '商人', icon: '🏪', desc: '购买补给或恢复',
    healPct: 0.25, cost: 500,
  },
  {
    id: 'heal_spring', name: '治疗泉', icon: '💚', desc: '恢复全队30% HP',
    healPct: 0.3,
  },
  {
    id: 'spirit_event', name: '灵兽事件', icon: '🐾', desc: '遭遇野生灵兽，可获临时伙伴',
    tempPartner: true,
  },
  {
    id: 'eco_event', name: '生态异变', icon: '🌿', desc: '生态事件，风险与收益并存',
    rewardMult: 1.2, risk: 0.2,
  },
  {
    id: 'training', name: '技能训练', icon: '📜', desc: '强化一个技能',
    skillMutation: true,
  },
  {
    id: 'boss_gate', name: 'Boss门', icon: '👹', desc: '每层Boss战',
    isBoss: true,
  },
];

export const SPIRIT_BLESSINGS = [
  { id: 'burn_spread', name: '灼烧扩散', icon: '🔥', desc: '火系技能附带15%灼烧扩散', typeBoost: 'FIRE', effect: 'burnSpread' },
  { id: 'heal_shield', name: '治愈护盾', icon: '💚', desc: '治疗技能同时给予10%护盾', effect: 'healShield' },
  { id: 'control_energy', name: '掌控能量', icon: '⚡', desc: '控制敌人时回复5%咒力/查克拉', effect: 'controlRegen' },
  { id: 'small_evasion', name: '灵动身形', icon: '💨', desc: '小型灵兽闪避+8%', tag: 'small', effect: 'evasionUp' },
  { id: 'rain_double', name: '雨幕回响', icon: '🌧️', desc: '雨天水系技能额外触发一次（30%威力）', typeBoost: 'WATER', effect: 'rainDouble' },
  { id: 'vine_mutate', name: '藤蔓变异', icon: '🌿', desc: '草系技能30%概率附加束缚', typeBoost: 'GRASS', effect: 'vineBind' },
  { id: 'crit_chain', name: '暴击连锁', icon: '💥', desc: '暴击后下招威力+20%', effect: 'critChain' },
  { id: 'endure_once', name: '不屈意志', icon: '🛡️', desc: '每场战斗一次致死留1HP', effect: 'endureOnce' },
];

export const SKILL_MUTATIONS = [
  { id: 'range', name: '范围化', suffix: '·蔓延', powerMult: 0.85, desc: '变为范围攻击' },
  { id: 'lifesteal', name: '吸血', suffix: '·吸血', powerMult: 0.9, desc: '造成伤害的20%转化为HP' },
  { id: 'seed_bomb', name: '爆裂种子', suffix: '·爆裂', powerMult: 1.1, desc: '附加延迟爆炸伤害' },
  { id: 'silence', name: '沉默', suffix: '·沉默', powerMult: 0.8, desc: '15%概率使目标下回合无法行动' },
];

export function pickRouteOptions(floor, count = 3) {
  const pool = [...INFINITY_ROUTE_TYPES];
  if (floor % 10 === 0) return [pool.find(r => r.id === 'boss_gate')];
  const weights = pool.map(r => {
    if (r.id === 'boss_gate') return 0;
    if (floor < 5 && r.id === 'elite') return 0.3;
    if (floor > 20 && r.id === 'merchant') return 0.5;
    return 1;
  });
  const picked = [];
  const available = pool.filter((r, i) => weights[i] > 0 && r.id !== 'boss_gate');
  while (picked.length < count && available.length > 0) {
    const idx = Math.floor(Math.random() * available.length);
    picked.push(available.splice(idx, 1)[0]);
  }
  return picked;
}

export function pickBlessingOptions(count = 3) {
  const shuffled = [...SPIRIT_BLESSINGS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function pickSkillMutation() {
  return SKILL_MUTATIONS[Math.floor(Math.random() * SKILL_MUTATIONS.length)];
}

export function applySkillMutation(move, mutation) {
  if (!move || !mutation) return move;
  return {
    ...move,
    name: `${move.name}${mutation.suffix || ''}`,
    p: Math.floor((move.p || 40) * (mutation.powerMult || 1)),
    _mutation: mutation.id,
    _mutationDesc: mutation.desc,
  };
}
