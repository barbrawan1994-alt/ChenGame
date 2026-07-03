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
    desc: 'Boss 获得护盾，光/超能/妖精系可破盾',
    onDamage: 'star_shield',
    shieldTypes: ['FAIRY', 'PSYCHIC', 'LIGHT'],
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
  dream_song: {
    id: 'dream_song', name: '沉眠之歌', icon: '🎵',
    desc: '每隔数回合使己方精灵进入梦境状态',
    onTurnEnd: 'sleep_wave',
  },
  rage_stack: {
    id: 'rage_stack', name: '愤怒叠加', icon: '😤',
    desc: 'Boss 每次受击叠加愤怒层数，攻击提升',
    onDamage: 'rage_stack',
  },
  rock_armor: {
    id: 'rock_armor', name: '岩壁护甲', icon: '🪨',
    desc: 'Boss 护甲厚重，土系/破防可更快击破',
    onPhase: 'rock_armor',
  },
  sand_quicksand: {
    id: 'sand_quicksand', name: '流沙战场', icon: '🏜️',
    desc: '每回合流沙吞噬，小型精灵更易受伤',
    onTurnEnd: 'sand_trap',
  },
  core_rampage: {
    id: 'core_rampage', name: '砂核暴走', icon: '💥',
    desc: '砂核蓄力，需净化/封印打断',
    onTurnEnd: 'core_charge',
  },
  blood_mist: {
    id: 'blood_mist', name: '血雾', icon: '🌫️',
    desc: '血雾降低命中，光系/封印术可驱散',
    onTurnStart: 'blood_mist',
  },
  star_orbit: {
    id: 'star_orbit', name: '星轨格子', icon: '⭐',
    desc: '星轨格增强技能但吸引陨石',
    onField: 'star_grid',
  },
  tail_flame: {
    id: 'tail_flame', name: '尾炎', icon: '🔥',
    desc: '每回合尾炎 AOE，水系/封印可减伤',
    onTurnEnd: 'tail_flame',
  },
  chakra_drain: {
    id: 'chakra_drain', name: '查克拉吸取', icon: '💧',
    desc: '吸取己方精灵 PP，雷系可打断',
    onTurnEnd: 'chakra_drain',
  },
  seal_resist: {
    id: 'seal_resist', name: '封印抗性', icon: '⛩️',
    desc: '查克拉节点未激活时大幅减伤',
    onPhase: 'seal_resist',
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
      { hpPct: 0.5, mechanic: 'parasite', msg: '黑藤鹿王寄生了一只己方精灵！' },
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
  dream_song_queen: {
    id: 'dream_song_queen',
    name: '沉歌蚌后',
    emoji: '🐚',
    type: 'WATER',
    secondaryType: 'PSYCHIC',
    bossId: 24,
    mapId: 4,
    phases: [
      { hpPct: 1.0, mechanic: 'dream_song', msg: '沉歌蚌后释放沉眠之歌，音波区域扩散！' },
      { hpPct: 0.6, mechanic: 'mirror_clones', msg: '湖面倒影中出现蚌后分身！' },
      { hpPct: 0.3, buff: { s_atk: 2 }, msg: '蚌后进入梦境暴走，特攻大幅提升！' },
    ],
    branchModifiers: {
      fight: { bossStatMult: 1.1 },
      heal: { bossStatMult: 0.85, skipMechanic: ['mirror_clones'] },
      soothe: { bossStatMult: 0.9 },
    },
  },
  rock_rhino_king: {
    id: 'rock_rhino_king',
    name: '岩甲犀王',
    emoji: '🦏',
    type: 'GROUND',
    secondaryType: 'ROCK',
    bossId: 190,
    mapId: 5,
    phases: [
      { hpPct: 1.0, mechanic: 'rage_stack', msg: '岩甲犀王因巢穴被毁而暴怒！' },
      { hpPct: 0.5, buff: { p_atk: 2, p_def: 1 }, msg: '岩甲犀王进入冲撞姿态！' },
    ],
    branchModifiers: {
      soothe: { bossStatMult: 0.85 },
      relocate: { bossStatMult: 0.8 },
      fight: { bossStatMult: 1.0 },
    },
  },
  mist_oni: {
    id: 'mist_oni',
    name: '雾隐之鬼',
    emoji: '👹',
    type: 'DARK',
    secondaryType: 'GHOST',
    bossId: 94,
    mapId: 2,
    phases: [
      { hpPct: 1.0, mechanic: 'blood_mist', msg: '血鬼术·雾隐！视野降低，光系/封印可破雾！' },
      { hpPct: 0.66, mechanic: 'mirror_clones', msg: '分裂残影！感知术/霞之呼吸可识真身！' },
      { hpPct: 0.33, mechanic: 'dream_song', msg: '沉眠低语！精灵可能恐惧，呼吸法可抵抗！' },
      { hpPct: 0.12, mechanic: 'core_rampage', msg: '鬼核暴走！需净化/封印打断！' },
    ],
    branchModifiers: {
      heal: { bossStatMult: 0.82, skipMechanic: ['blood_mist'] },
      soothe: { bossStatMult: 0.88 },
      fight: { bossStatMult: 1.05 },
    },
  },
  sand_core_golem: {
    id: 'sand_core_golem',
    name: '砂核巨像',
    emoji: '🗿',
    type: 'GROUND',
    secondaryType: 'STEEL',
    bossId: 190,
    mapId: 5,
    phases: [
      { hpPct: 1.0, mechanic: 'rock_armor', msg: '岩壁护甲保护核心！土系/关羽将魂可破防！' },
      { hpPct: 0.66, mechanic: 'sand_quicksand', msg: '流沙战场！小型精灵易陷入，水系可凝固！' },
      { hpPct: 0.33, mechanic: 'gravity_field', msg: '重力核心激活！飞行精灵被压制！' },
      { hpPct: 0.15, mechanic: 'core_rampage', msg: '砂核暴走蓄力！需净化/封印打断！' },
    ],
    branchModifiers: {
      relocate: { bossStatMult: 0.85, skipMechanic: ['gravity_field'] },
      soothe: { bossStatMult: 0.88 },
      heal: { bossStatMult: 0.8 },
      fight: { bossStatMult: 1.05 },
    },
  },
  stellar_whale: {
    id: 'stellar_whale',
    name: '陨星巨鲸',
    emoji: '🐋',
    type: 'ICE',
    secondaryType: 'COSMIC',
    bossId: 26,
    mapId: 106,
    phases: [
      { hpPct: 1.0, mechanic: 'meteor_summon', msg: '陨星巨鲸召唤陨石！' },
      { hpPct: 0.66, mechanic: 'gravity_field', msg: '重力扭曲！速度慢的精灵行动困难！' },
      { hpPct: 0.33, mechanic: 'star_orbit', msg: '星轨格子激活，站在上面技能增强！' },
    ],
    branchModifiers: {
      heal: { bossStatMult: 0.85, skipMechanic: ['gravity_field'] },
      fight: { bossStatMult: 1.05 },
    },
  },
  tailed_calamity: {
    id: 'tailed_calamity',
    name: '尾兽级灾厄',
    emoji: '🦊',
    type: 'FIRE',
    secondaryType: 'DARK',
    bossId: 149,
    mapId: 3,
    phases: [
      { hpPct: 1.0, mechanic: 'tail_flame', msg: '尾炎横扫！水系/封印忍术可减伤！' },
      { hpPct: 0.66, mechanic: 'chakra_drain', msg: '灾厄吸取查克拉！雷系攻击可打断！' },
      { hpPct: 0.33, mechanic: 'seal_resist', msg: '封印抗性展开！需激活查克拉节点才能有效输出！' },
      { hpPct: 0.12, mechanic: 'core_rampage', msg: '灾厄暴走！需净化/封印打断！' },
    ],
    branchModifiers: {
      heal: { bossStatMult: 0.82, skipMechanic: ['tail_flame'] },
      soothe: { bossStatMult: 0.88 },
      fight: { bossStatMult: 1.05 },
    },
  },
  black_tide_serpent: {
    id: 'black_tide_serpent',
    name: '黑潮蛇王',
    type: 'WATER',
    secondaryType: 'POISON',
    bossId: 26,
    mapId: 4,
    phases: [
      { hpPct: 1.0, name: '潮涌', buff: { s_atk: 1 }, mechanic: 'vine_spread' },
      { hpPct: 0.5, name: '毒潮', buff: { s_atk: 2, spd: 1 }, mechanic: 'blood_mist' },
    ],
    branchModifiers: { soothe: { bossStatMult: 0.9 }, fight: { bossStatMult: 1.1 } },
  },
  mech_overlord: {
    id: 'mech_overlord',
    name: '机械霸主',
    type: 'STEEL',
    secondaryType: 'ELECTRIC',
    bossId: 87,
    mapId: 5,
    phases: [
      { hpPct: 1.0, name: '启动', buff: { p_def: 1 }, mechanic: 'skill_echo' },
      { hpPct: 0.4, name: '过载', buff: { p_atk: 2, spd: 1 }, mechanic: 'core_rampage' },
    ],
    branchModifiers: { soothe: { bossStatMult: 0.85 }, fight: { bossStatMult: 1.1 } },
  },
  nightmare_lord: {
    id: 'nightmare_lord',
    name: '噩梦领主',
    type: 'GHOST',
    secondaryType: 'PSYCHIC',
    bossId: 94,
    mapId: 7,
    phases: [
      { hpPct: 1.0, name: '梦魇侵蚀', buff: { s_atk: 1 }, mechanic: 'blood_mist' },
      { hpPct: 0.6, name: '深层梦境', buff: { s_atk: 2, eva: 1 }, mechanic: 'parasite' },
      { hpPct: 0.3, name: '梦境崩塌', buff: { s_atk: 3, spd: 2 }, mechanic: 'core_rampage' },
    ],
    branchModifiers: { soothe: { bossStatMult: 0.8 }, fight: { bossStatMult: 1.15 } },
  },
};

export const MIST_ONI_FINAL = {
  id: 'mist_oni_final',
  name: '鬼雾大将',
  type: 'GHOST',
  secondaryType: 'DARK',
  bossId: 94,
  mapId: 2,
  phases: [
    { hpPct: 1.0, name: '鬼雾弥漫', buff: { eva: 1 }, mechanic: 'blood_mist' },
    { hpPct: 0.6, name: '鬼血觉醒', buff: { p_atk: 2, spd: 1 }, mechanic: 'parasite' },
    { hpPct: 0.3, name: '鬼化暴走', buff: { p_atk: 3, s_atk: 2 }, mechanic: 'core_rampage' },
  ],
  branchModifiers: { soothe: { bossStatMult: 0.75 }, fight: { bossStatMult: 1.2 } },
};

// Register in linked bosses
ECO_LINKED_BOSSES['mist_oni_final'] = MIST_ONI_FINAL;

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
