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
    id: 'spirit_event', name: '精灵事件', icon: '🐾', desc: '遭遇野生精灵，可获得额外经验和金币',
    rewardGold: 3000, rewardExpMult: 1.5,
  },
  {
    id: 'eco_event', name: '生态异变', icon: '🌿', desc: '生态事件，通过挑战获得额外奖励',
    rewardMult: 1.2, risk: 0.2, triggerBattle: true,
  },
  {
    id: 'eco_puzzle', name: '生态解谜', icon: '🧩', desc: '用精灵能力解开机关',
    rewardMult: 1.15, puzzleBonus: true,
  },
  {
    id: 'bonding', name: '结契事件', icon: '💫', desc: '遭遇可结契野生精灵',
    tempPartner: true, bondingEvent: true,
  },
  {
    id: 'sanctuary_rest', name: '圣域休息', icon: '🏡', desc: '恢复生命并大幅缓解疲劳',
    healPct: 0.4,
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
  { id: 'small_evasion', name: '灵动身形', icon: '💨', desc: '小型精灵闪避+8%', tag: 'small', effect: 'evasionUp' },
  { id: 'rain_double', name: '雨幕回响', icon: '🌧️', desc: '雨天水系技能额外触发一次（30%威力）', typeBoost: 'WATER', effect: 'rainDouble' },
  { id: 'vine_mutate', name: '藤蔓变异', icon: '🌿', desc: '草系技能30%概率附加束缚', typeBoost: 'GRASS', effect: 'vineBind' },
  { id: 'crit_chain', name: '暴击连锁', icon: '💥', desc: '暴击后下招威力+20%', effect: 'critChain' },
  { id: 'endure_once', name: '不屈意志', icon: '🛡️', desc: '每场战斗一次致死留1HP', effect: 'endureOnce' },
  { id: 'tide_echo', name: '潮汐回响', icon: '🌊', desc: '水系治疗额外生成10%护盾', typeBoost: 'WATER', effect: 'healShield', shieldPct: 0.1 },
  { id: 'forest_symbiosis', name: '森林共生', icon: '🌳', desc: '木系技能后回复全队3%HP', typeBoost: 'GRASS', effect: 'grassHealTeam' },
  { id: 'thunder_chain', name: '雷鸣连锁', icon: '⚡', desc: '雷系攻击35%概率弹射', typeBoost: 'ELECTRIC', effect: 'electricChain' },
  { id: 'shadow_ambush', name: '暗影蓄谋', icon: '🌑', desc: '暗系精灵未行动时叠加10%伤害', typeBoost: 'DARK', effect: 'darkAmbush' },
  { id: 'starlight_guard', name: '星光庇护', icon: '⭐', desc: '光系技能清除一个负面状态', typeBoost: 'FAIRY', effect: 'lightCleanse' },
  { id: 'large_wall', name: '巨兽压阵', icon: '🦣', desc: '巨型精灵受伤后给队友8%护盾', tag: 'large', effect: 'largeWall' },
  { id: 'swarm_instinct', name: '群居本能', icon: '🐝', desc: '同标签精灵越多联携越强', tag: 'swarm', effect: 'swarmBoost' },
  { id: 'purify_reward', name: '净化回馈', icon: '💧', desc: '净化污染时回复全队5%HP', effect: 'purifyHeal' },
  { id: 'flying_scout', name: '空中侦查', icon: '🦅', desc: '飞行精灵先手时暴击+10%', tag: 'flying', effect: 'flyingCrit' },
  { id: 'aquatic_flow', name: '潮汐流转', icon: '🐟', desc: '水栖精灵速度+12%', tag: 'aquatic', effect: 'aquaticSpd' },
  { id: 'spirit_phase', name: '灵体相位', icon: '👻', desc: '灵体精灵15%概率闪避物理攻击', tag: 'spirit', effect: 'spiritDodge' },
  { id: 'plant_root', name: '扎根回复', icon: '🌱', desc: '植物标签精灵每回合回复2%HP', tag: 'plant', effect: 'plantRegen' },
  { id: 'nocturnal_power', name: '夜行强化', icon: '🌙', desc: '夜行精灵夜晚攻击+15%', tag: 'nocturnal', effect: 'nightBoost' },
  { id: 'mech_overload', name: '机械过载', icon: '🤖', desc: '机械精灵首回合攻击+25%', tag: 'mechanical', effect: 'mechFirstStrike' },
  { id: 'solitary_hunter', name: '独行猎手', icon: '🐺', desc: '独行精灵单独出战时全能力+8%', tag: 'solitary', effect: 'soloBoost' },
  { id: 'ground_fortify', name: '大地固守', icon: '🪨', desc: '地面系精灵物防+15%', typeBoost: 'GROUND', effect: 'groundDef' },
  { id: 'ice_frost', name: '极寒护体', icon: '❄️', desc: '冰系技能20%概率冻结', typeBoost: 'ICE', effect: 'iceFreeze' },
  { id: 'time_rewind', name: '时光逆流', icon: '⏳', desc: '时空系技能30%概率回退对手一次强化', typeBoost: 'TIME', effect: 'timeRewind' },
  { id: 'chaos_entropy', name: '熵增领域', icon: '🌀', desc: '混沌系攻击附加随机异常状态', typeBoost: 'CHAOS', effect: 'chaosEntropy' },
  { id: 'cosmic_orbit', name: '星轨加护', icon: '🪐', desc: '宇宙系精灵速度+10%暴击+5%', typeBoost: 'COSMIC', effect: 'cosmicOrbit' },
  { id: 'sound_resonance', name: '谐振强化', icon: '🎵', desc: '音波系连续攻击威力递增8%', typeBoost: 'SOUND', effect: 'soundResonance' },
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
  const available = pool.map((r, i) => ({ route: r, w: weights[i] })).filter(x => x.w > 0 && x.route.id !== 'boss_gate');
  while (picked.length < count && available.length > 0) {
    const totalW = available.reduce((s, x) => s + x.w, 0);
    let roll = Math.random() * totalW;
    let idx = 0;
    for (let i = 0; i < available.length; i++) {
      roll -= available[i].w;
      if (roll <= 0) { idx = i; break; }
    }
    picked.push(available.splice(idx, 1)[0].route);
  }
  return picked;
}

export function pickBlessingOptions(count = 3) {
  const implemented = ['crit_chain', 'endure_once', 'burn_spread', 'vine_mutate', 'thunder_chain', 'ice_frost', 'ground_fortify', 'heal_shield', 'tide_echo'];
  const pool = SPIRIT_BLESSINGS.filter(b => implemented.includes(b.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
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
