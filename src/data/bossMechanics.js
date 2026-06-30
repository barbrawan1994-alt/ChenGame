/** Boss 阶段机制库 — 统一描述与战斗钩子 */

export const BOSS_MECHANIC_DEFS = {
  meteor_summon: {
    id: 'meteor_summon', name: '陨石召唤', icon: '☄️',
    desc: '每回合概率召唤小陨石，对玩家造成百分比伤害',
    onTurnEnd: 'meteor_damage',
  },
  gravity_field: {
    id: 'gravity_field', name: '重力扭曲', icon: '🌌',
    desc: '速度较慢的一方无法行动',
    onAction: 'gravity_skip',
  },
  star_dream: {
    id: 'star_dream', name: '星海梦境', icon: '✨',
    desc: 'Boss 获得护盾，仅妖精/超能系可破盾',
    onDamage: 'star_shield',
    shieldTypes: ['FAIRY', 'PSYCHIC'],
  },
  vine_spread: {
    id: 'vine_spread', name: '藤蔓扩散', icon: '🌿',
    desc: '每回合召唤黑藤吸收生命，火系可烧藤但 Boss 愤怒',
    onTurnEnd: 'vine_summon',
  },
  parasite: {
    id: 'parasite', name: '寄生队友', icon: '🦠',
    desc: '随机寄生己方精灵，治疗会流向 Boss',
    onPhase: 'parasite_ally',
  },
  forest_will: {
    id: 'forest_will', name: '森林意志', icon: '🌳',
    desc: '生态恢复良好时场地出现净化花，降低黑藤速度',
    onPhase: 'forest_aid',
    requiresEcology: { pollution: { max: 40 }, vegetation: { min: 60 } },
  },
  mirror_clones: {
    id: 'mirror_clones', name: '镜湖分身', icon: '🪞',
    desc: '制造倒影，攻击假身触发反击',
    onTurnStart: 'mirror_decoy',
  },
  skill_echo: {
    id: 'skill_echo', name: '技能回声', icon: '🔊',
    desc: 'Boss 复制玩家上一招进行反击',
    onEnemyTurn: 'copy_player_move',
  },
  star_orbit: {
    id: 'star_orbit', name: '星轨格子', icon: '⭐',
    desc: '星轨格增强技能但吸引陨石',
    onField: 'star_grid',
  },
};

/** 生态联动 Boss 配置（调查副本 / 世界首领） */
export const ECO_LINKED_BOSSES = {
  black_vine_king: {
    id: 'black_vine_king',
    name: '黑藤鹿王',
    emoji: '🦌',
    type: 'GRASS',
    secondaryType: 'DARK',
    bossId: 117,
    mapId: 1,
    phases: [
      { hpPct: 1.0, mechanic: 'vine_spread', msg: '黑藤鹿王召唤黑藤蔓延！' },
      { hpPct: 0.5, mechanic: 'parasite', msg: '黑藤鹿王寄生了一只己方灵兽！' },
      { hpPct: 0.25, mechanic: 'forest_will', msg: '森林意志苏醒…' },
    ],
    branchModifiers: {
      fight: { bossStatMult: 1.0, phases: null },
      heal: { bossStatMult: 0.85, skipMechanic: ['vine_spread'] },
      trade: { bossStatMult: 1.1, extraPhase: { buff: { p_atk: 1 } } },
    },
  },
  mirror_giant_clam: {
    id: 'mirror_giant_clam',
    name: '镜湖巨蚌',
    emoji: '🐚',
    type: 'WATER',
    secondaryType: 'PSYCHIC',
    bossId: 23,
    mapId: 4,
    phases: [
      { hpPct: 1.0, mechanic: 'mirror_clones', msg: '镜湖巨蚌制造出三个倒影！' },
      { hpPct: 0.55, mechanic: 'skill_echo', msg: '湖面回声！巨蚌开始复制你的技能！' },
      { hpPct: 0.25, buff: { s_def: 2 }, msg: '巨蚌闭合硬壳，特防大幅提升！' },
    ],
  },
};

export function getBossMechanicDef(mechanicId) {
  return BOSS_MECHANIC_DEFS[mechanicId] || null;
}

export function getEcoLinkedBoss(id) {
  return ECO_LINKED_BOSSES[id] || null;
}

export function getBossPhaseForHp(phases, hpPct) {
  if (!phases?.length) return null;
  return [...phases].reverse().find(ph => hpPct <= (ph.hpPct ?? 1));
}

export function checkForestWillEcology(ecology) {
  if (!ecology) return false;
  return (ecology.pollution ?? 50) <= 40 && (ecology.vegetation ?? 50) >= 60;
}
