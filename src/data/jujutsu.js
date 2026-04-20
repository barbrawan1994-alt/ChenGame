// ==========================================
// 咒术回战系统 - 数据定义
// ==========================================

export const CURSED_ENERGY_CONFIG = {
  maxCE: 100,
  regenPerTurn: 15,
  chargeAction: 40,
  levelScaling: 0.5,
  initialPercent: 0,
};

export const CURSE_GRADES = {
  SPECIAL: { name: '特级', minTotal: 500, ceBonus: 50, color: '#FF0000' },
  GRADE1:  { name: '一级', minTotal: 380, ceBonus: 30, color: '#FF6600' },
  GRADE2:  { name: '二级', minTotal: 260, ceBonus: 15, color: '#FFCC00' },
  GRADE3:  { name: '三级', minTotal: 150, ceBonus: 5,  color: '#00CC00' },
  GRADE4:  { name: '四级', minTotal: 0,   ceBonus: 0,  color: '#999999' },
};

export const getCurseGrade = (baseStats, curseTalent = 0) => {
  const total = (baseStats.hp || 0) + (baseStats.p_atk || baseStats.atk || 0) +
                (baseStats.p_def || baseStats.def || 0) + (baseStats.s_atk || 0) +
                (baseStats.s_def || 0) + (baseStats.spd || 0) + (curseTalent || 0);
  for (const [key, g] of Object.entries(CURSE_GRADES)) {
    if (total >= g.minTotal) return { key, ...g };
  }
  return { key: 'GRADE4', ...CURSE_GRADES.GRADE4 };
};

export const generateCurseTalent = () => {
  const r = Math.random();
  if (r < 0.02) return Math.floor(Math.random() * 80 + 220);
  if (r < 0.08) return Math.floor(Math.random() * 70 + 150);
  if (r < 0.20) return Math.floor(Math.random() * 60 + 90);
  if (r < 0.45) return Math.floor(Math.random() * 50 + 40);
  return Math.floor(Math.random() * 40);
};

export const getMaxCE = (level, gradeKey) => {
  const base = CURSED_ENERGY_CONFIG.maxCE;
  const levelBonus = Math.floor(level * CURSED_ENERGY_CONFIG.levelScaling);
  const gradeBonus = CURSE_GRADES[gradeKey]?.ceBonus || 0;
  return base + levelBonus + gradeBonus;
};

// 通用术式
export const COMMON_TECHNIQUES = [
  { id: 'ct_reinforce', name: '咒力强化', ceCost: 15, type: 'BUFF', cat: 'physical',
    effect: { stat: 'p_atk', stages: 1 }, desc: '用咒力强化肉体，物攻+1' },
  { id: 'ct_barrier', name: '帳', ceCost: 20, type: 'FIELD', cat: 'status',
    effect: { isolate: true, turns: 3 }, desc: '隔绝外界3回合，双方无法换人' },
  { id: 'ct_reverse', name: '反转术式', ceCost: 30, type: 'HEAL', cat: 'status',
    effect: { healPercent: 0.3 }, desc: '逆转咒力流动，恢复30%HP' },
  { id: 'ct_simple_domain', name: '简易领域', ceCost: 25, type: 'FIELD', cat: 'status',
    effect: { antiDomain: true, turns: 2 }, desc: '展开简易领域抵消对方领域2回合' },
];

// 属性专属术式
export const TYPE_TECHNIQUES = {
  NORMAL: { id: 'ct_black_flash', name: '黑闪', ceCost: 35, p: 120, pp: 99, cat: 'physical',
            moveType: 'NORMAL', effect: { critBoost: 3 }, desc: '咒力在0.000001秒内命中的空间扭曲' },
  FIRE: { id: 'ct_red_flame', name: '赫', ceCost: 40, p: 130, pp: 99, cat: 'special',
          moveType: 'FIRE', effect: {}, desc: '咒力发散的极致——灼烧一切' },
  WATER: { id: 'ct_abyss', name: '蒼', ceCost: 35, p: 110, pp: 99, cat: 'special',
           moveType: 'WATER', effect: { spdDown: 1 }, desc: '咒力收敛的极致——吸引万物' },
  GRASS: { id: 'ct_forest_curse', name: '森罗咒法', ceCost: 30, p: 100, pp: 99, cat: 'special',
           moveType: 'GRASS', effect: { leech: 0.25 }, desc: '操纵植物吸取生命力' },
  ELECTRIC: { id: 'ct_thunder_god', name: '御厨子', ceCost: 40, p: 125, pp: 99, cat: 'special',
              moveType: 'ELECTRIC', effect: { paralyze: 0.3 }, desc: '将电能转化为咒力释放' },
  ICE: { id: 'ct_frost_calm', name: '霜凪', ceCost: 35, p: 110, pp: 99, cat: 'special',
         moveType: 'ICE', effect: { freeze: 0.25 }, desc: '冻结周围一切的绝对零度' },
  FIGHT: { id: 'ct_divergent_fist', name: '乖离拳', ceCost: 30, p: 115, pp: 99, cat: 'physical',
           moveType: 'FIGHT', effect: { multiHit: 2 }, desc: '肉体与咒力的时间差攻击' },
  POISON: { id: 'ct_rot_technique', name: '蝕爛腐術', ceCost: 35, p: 100, pp: 99, cat: 'special',
            moveType: 'POISON', effect: { poison: true }, desc: '触碰即腐烂的咒术' },
  GROUND: { id: 'ct_earth_pulse', name: '地脉操術', ceCost: 30, p: 110, pp: 99, cat: 'physical',
            moveType: 'GROUND', effect: { accDown: 1 }, desc: '操纵大地震动，削弱命中' },
  FLYING: { id: 'ct_wind_scythe', name: '鎌鼬', ceCost: 30, p: 105, pp: 99, cat: 'physical',
            moveType: 'FLYING', effect: { critBoost: 1 }, desc: '不可视的真空刃' },
  PSYCHIC: { id: 'ct_idle_transfig', name: '無爲転変', ceCost: 45, p: 130, pp: 99, cat: 'special',
             moveType: 'PSYCHIC', effect: { confuse: 0.4 }, desc: '触碰灵魂改变形状' },
  BUG: { id: 'ct_swarm_curse', name: '蟲咒操術', ceCost: 25, p: 95, pp: 99, cat: 'physical',
         moveType: 'BUG', effect: { multiHit: [2, 4] }, desc: '操纵咒虫进行群体攻击' },
  ROCK: { id: 'ct_stone_prison', name: '石牢封印', ceCost: 35, p: 100, pp: 99, cat: 'physical',
          moveType: 'ROCK', effect: { spdDown: 2 }, desc: '以岩石封锁对手行动' },
  GHOST: { id: 'ct_soul_rip', name: '魂魄掌握', ceCost: 40, p: 120, pp: 99, cat: 'special',
           moveType: 'GHOST', effect: { hpDrain: 0.2 }, desc: '直接攻击对手灵魂' },
  DRAGON: { id: 'ct_dragon_curse', name: '呪龍脈', ceCost: 45, p: 140, pp: 99, cat: 'special',
            moveType: 'DRAGON', effect: {}, desc: '古龙咒力的终极一击' },
  STEEL: { id: 'ct_inverted_spear', name: '天逆鉾', ceCost: 35, p: 110, pp: 99, cat: 'physical',
           moveType: 'STEEL', effect: { breakBarrier: true }, desc: '否定一切术式的特级咒具' },
  FAIRY: { id: 'ct_love_curse', name: '愛之咒縛', ceCost: 30, p: 100, pp: 99, cat: 'special',
           moveType: 'FAIRY', effect: { atkDown: 1 }, desc: '以爱恋之名束缚对手' },
  WIND: { id: 'ct_wind_blade', name: '風刃·嵐', ceCost: 35, p: 115, pp: 99, cat: 'special',
           moveType: 'WIND', effect: { spdUp: 1 }, desc: '召唤风之刃暴风攻击，提升速度' },
  LIGHT: { id: 'ct_holy_light', name: '聖光·天照', ceCost: 40, p: 125, pp: 99, cat: 'special',
           moveType: 'LIGHT', effect: { healPercent: 0.15 }, desc: '释放神圣光芒攻击并恢复15%HP' },
  DARK: { id: 'ct_shadow_devour', name: '闇之蝕', ceCost: 40, p: 120, pp: 99, cat: 'special',
          moveType: 'DARK', effect: { hpDrain: 0.15 }, desc: '暗影吞噬一切光明，汲取生命' },
  COSMIC: { id: 'ct_cosmic_rift', name: '星辰裂隙', ceCost: 45, p: 135, pp: 99, cat: 'special',
            moveType: 'COSMIC', effect: { confuse: 0.3, sDefDown: 1 }, desc: '撕裂时空的宇宙之力' },
  SOUND: { id: 'ct_sonic_howl', name: '共鳴破', ceCost: 30, p: 105, pp: 99, cat: 'special',
           moveType: 'SOUND', effect: { flinch: 0.3 }, desc: '音波共振粉碎对手心智' },
  HEAL: { id: 'ct_reverse_heal', name: '反転術式·極', ceCost: 50, p: 0, pp: 99, cat: 'status',
          moveType: 'HEAL', effect: { healPercent: 0.5 }, desc: '完全掌握的反转术式' },
  GOD: { id: 'ct_void', name: '虛式·茈', ceCost: 60, p: 160, pp: 99, cat: 'special',
         moveType: 'GOD', effect: { ignoreDefense: true }, desc: '虚与实的碰撞——无法防御的一击' },
};

// 领域展开
export const DOMAINS = {
  NORMAL: { name: '无尽武道馆', turns: 3, ceCost: 80,
            effect: { atkBoost: 1.3, critBoost: 2, dot: 0 },
            desc: '纯粹武学的领域，暴击率大幅提升' },
  FIRE: { name: '炼狱领域·焦热地狱', turns: 3, ceCost: 80,
          effect: { atkBoost: 1.5, enemyAccDown: 0.7, dot: 0.05 },
          desc: '灼热领域，攻击+50%，敌方命中-30%，每回合灼伤5%' },
  WATER: { name: '深海领域·碧波净界', turns: 3, ceCost: 80,
           effect: { defBoost: 1.5, healPerTurn: 0.05, dot: 0 },
           desc: '水之领域，防御+50%，每回合恢复5%HP' },
  GRASS: { name: '千年森罗', turns: 3, ceCost: 75,
           effect: { leechBoost: 0.3, spdBoost: 1.3, dot: 0 },
           desc: '森林领域，吸血效果+30%，速度+30%' },
  ELECTRIC: { name: '雷帝领域·万雷', turns: 3, ceCost: 85,
              effect: { atkBoost: 1.4, paralyzeChance: 0.2, dot: 0 },
              desc: '雷电领域，攻击+40%，敌方每回合20%麻痹' },
  ICE: { name: '绝对零域', turns: 4, ceCost: 85,
         effect: { spdBoost: 1.5, enemySpdDown: 0.5, dot: 0.03 },
         desc: '冰封领域，速度+50%，敌方速度-50%，每回合冻伤' },
  FIGHT: { name: '嵌合暗翳庭', turns: 3, ceCost: 80,
           effect: { atkBoost: 1.6, defBoost: 0.8, dot: 0 },
           desc: '格斗领域，攻击+60%但防御-20%' },
  POISON: { name: '蝕毒領域', turns: 4, ceCost: 75,
            effect: { dot: 0.08, enemyAtkDown: 0.8 },
            desc: '毒之领域，敌方每回合中毒8%HP，攻击-20%' },
  GROUND: { name: '裂地深渊', turns: 3, ceCost: 80,
            effect: { atkBoost: 1.4, enemyAccDown: 0.7, dot: 0 },
            desc: '大地领域，攻击+40%，敌方命中-30%' },
  FLYING: { name: '苍穹支配', turns: 3, ceCost: 80,
            effect: { spdBoost: 1.5, evasionBoost: 1.3, dot: 0 },
            desc: '天空领域，速度+50%，闪避+30%' },
  PSYCHIC: { name: '無量空処', turns: 3, ceCost: 90,
             effect: { enemySkipChance: 0.35, spdBoost: 1.8, dot: 0 },
             desc: '五条悟的领域，敌方35%概率无法行动，速度+80%' },
  BUG: { name: '蟲之巢窟', turns: 3, ceCost: 70,
         effect: { multiHitBoost: true, dot: 0.03 },
         desc: '虫群领域，多段攻击次数+1，持续虫蚀' },
  ROCK: { name: '磐石要塞', turns: 4, ceCost: 80,
          effect: { defBoost: 1.8, dot: 0 },
          desc: '岩石领域，防御+80%，固若金汤' },
  GHOST: { name: '冥府领域·黄泉平坂', turns: 3, ceCost: 85,
           effect: { atkBoost: 1.4, hpDrain: 0.1, dot: 0 },
           desc: '幽灵领域，攻击+40%，每次攻击吸血10%' },
  DRAGON: { name: '龙脉领域·逆鳞', turns: 3, ceCost: 90,
            effect: { atkBoost: 1.7, enemyDefDown: 0.7, dot: 0 },
            desc: '龙之领域，攻击+70%，敌方防御-30%' },
  STEEL: { name: '铁壁领域·不毁', turns: 4, ceCost: 85,
           effect: { defBoost: 2.0, atkBoost: 1.2, dot: 0 },
           desc: '钢之领域，防御翻倍，攻击+20%' },
  FAIRY: { name: '梦幻庭园', turns: 3, ceCost: 80,
           effect: { healPerTurn: 0.08, enemyAtkDown: 0.7, dot: 0 },
           desc: '妖精领域，每回合恢复8%HP，敌方攻击-30%' },
  DARK: { name: '暗黑领域·无间', turns: 3, ceCost: 85,
          effect: { atkBoost: 1.5, hpDrain: 0.15, enemyAccDown: 0.7, dot: 0 },
          desc: '暗之领域，攻击+50%，每次攻击吸血15%，敌方命中-30%' },
  WIND: { name: '风神领域·疾空', turns: 3, ceCost: 80,
          effect: { spdBoost: 2.0, atkBoost: 1.3, dot: 0 },
          desc: '风之领域，速度翻倍，攻击+30%' },
  LIGHT: { name: '圣光领域·天启', turns: 3, ceCost: 85,
           effect: { atkBoost: 1.5, healPerTurn: 0.1, enemyAccDown: 0.7, dot: 0 },
           desc: '光之领域，攻击+50%，每回合恢复10%HP，敌方命中-30%' },
  COSMIC: { name: '星穹领域·虚数空间', turns: 4, ceCost: 90,
            effect: { atkBoost: 1.5, spdBoost: 1.5, enemyDefDown: 0.7, dot: 0.04 },
            desc: '宇宙领域，攻击+50%，速度+50%，敌方防御-30%，持续星尘侵蚀' },
  SOUND: { name: '音律领域·万物共鸣', turns: 3, ceCost: 80,
           effect: { atkBoost: 1.3, enemySkipChance: 0.25, healPerTurn: 0.05, dot: 0 },
           desc: '音波领域，攻击+30%，敌方25%概率被音波眩晕，每回合恢复5%HP' },
  GOD: { name: '神域·创世纪', turns: 5, ceCost: 100,
         effect: { atkBoost: 2.0, defBoost: 1.5, spdBoost: 1.5, dot: 0 },
         desc: '神之领域，全属性大幅提升' },
};

// 缚誓系统 (每个缚誓都需要最低咒力门槛 ceCost)
export const BINDING_VOWS = [
  { id: 'vow_power', name: '以命搏命', ceCost: 20,
    sacrifice: { hpPercent: 0.3 },
    reward: { atkMult: 2.5, turns: 1 },
    desc: '消耗20CE+30%HP，下一次攻击伤害2.5倍(仅一次，使用任何技能后立即失效)' },
  { id: 'vow_reveal', name: '术式开示', ceCost: 15,
    sacrifice: { revealMoves: true },
    reward: { ceMult: 1.5, turns: 3 },
    desc: '消耗15CE，展示技能换取3回合咒力恢复1.5倍' },
  { id: 'vow_restrict', name: '自缚之缚', ceCost: 25,
    sacrifice: { noSwitch: true, turns: 3 },
    reward: { defMult: 1.5, turns: 3 },
    desc: '消耗25CE，3回合不能换人但防御+50%' },
  { id: 'vow_burn', name: '焚尽咒力', ceCost: 40,
    sacrifice: { cePercent: 0.5 },
    reward: { nextMovePower: 2.5, turns: 1 },
    desc: '消耗40CE+燃烧50%剩余咒力，下一招威力2.5倍' },
  { id: 'vow_speed', name: '瞬身之誓', ceCost: 30,
    sacrifice: { defMult: 0.5, turns: 2 },
    reward: { spdMult: 2.0, turns: 2 },
    desc: '消耗30CE，2回合速度翻倍但防御减半' },
];

// 咒术高专 NPC / 角色
export const JJK_NPCS = {
  gojo: {
    name: '五条悟', title: '最强术师', gradeKey: 'SPECIAL',
    sprite: '👨‍🏫', desc: '都立咒术高专一年级担当，被称为最强的术师',
    teaches: ['ct_barrier', 'ct_simple_domain'],
    domainType: 'PSYCHIC',
    team: [
      { id: 150, level: 80, forceShiny: true, forceTrait: 'levitate',
        cursedTechnique: 'ct_void', hasDomain: true, domainType: 'PSYCHIC' },
      { id: 65, level: 70, forceTrait: 'pressure',
        cursedTechnique: 'ct_black_flash' },
    ]
  },
  geto: {
    name: '夏油杰', title: '咒灵操术师', gradeKey: 'SPECIAL',
    sprite: '🧑‍🎤', desc: '曾经的最强术师之一，擅长操纵咒灵',
    teaches: ['ct_reinforce', 'ct_reverse'],
    team: [
      { id: 94, level: 75, forceTrait: 'shadow_tag',
        cursedTechnique: 'ct_soul_rip', hasDomain: true, domainType: 'GHOST' },
      { id: 130, level: 70, cursedTechnique: 'ct_swarm_curse' },
      { id: 93, level: 70, cursedTechnique: 'ct_idle_transfig' },
    ]
  },
  todo: {
    name: '东堂葵', title: '一级术师', gradeKey: 'GRADE1',
    sprite: '💪', desc: '京都校一级术师，拍手即可换位',
    teaches: ['ct_black_flash'],
    team: [
      { id: 68, level: 65, cursedTechnique: 'ct_divergent_fist' },
      { id: 57, level: 60, cursedTechnique: 'ct_black_flash' },
    ]
  },
  sukuna: {
    name: '两面宿傩', title: '诅咒之王', gradeKey: 'SPECIAL',
    sprite: '👹', desc: '千年前的咒之王，被称为最恶的咒灵',
    isBoss: true,
    team: [
      { id: 150, level: 100, forceShiny: true, forceTrait: 'mold_breaker',
        cursedTechnique: 'ct_red_flame', hasDomain: true, domainType: 'FIRE',
        customBaseStats: { hp: 130, p_atk: 170, p_def: 100, s_atk: 170, s_def: 100, spd: 150, crit: 15 } },
      { id: 149, level: 90, cursedTechnique: 'ct_dragon_curse', hasDomain: true, domainType: 'DRAGON' },
      { id: 146, level: 90, cursedTechnique: 'ct_void' },
    ]
  },
  mahito: {
    name: '真人', title: '特级咒灵', gradeKey: 'SPECIAL',
    sprite: '🎭', desc: '人类恐惧所生的特级咒灵，能触碰灵魂',
    isBoss: true,
    team: [
      { id: 150, level: 70, cursedTechnique: 'ct_idle_transfig', hasDomain: true, domainType: 'PSYCHIC',
        customBaseStats: { hp: 120, p_atk: 100, p_def: 80, s_atk: 150, s_def: 90, spd: 130, crit: 10 } },
      { id: 93, level: 65, cursedTechnique: 'ct_soul_rip' },
    ]
  },
  jogo: {
    name: '漏瑚', title: '特级咒灵', gradeKey: 'SPECIAL',
    sprite: '🌋', desc: '大地之恐惧所生的特级咒灵',
    isBoss: true,
    team: [
      { id: 146, level: 70, cursedTechnique: 'ct_red_flame', hasDomain: true, domainType: 'FIRE' },
      { id: 59, level: 65, cursedTechnique: 'ct_earth_pulse' },
    ]
  },
};

// 百鬼夜行副本配置
export const HYAKKI_YAKO_CONFIG = {
  name: '百鬼夜行',
  desc: '连续对战咒灵的终极考验',
  waves: 5,
  restBetweenWaves: true,
  ceRegenBetweenWaves: 0.5,
  enemyPool: [
    { id: 92, levelRange: [40, 60], hasCE: true, technique: 'ct_soul_rip' },
    { id: 93, levelRange: [45, 65], hasCE: true, technique: 'ct_idle_transfig' },
    { id: 94, levelRange: [50, 70], hasCE: true, technique: 'ct_soul_rip' },
    { id: 110, levelRange: [40, 55], hasCE: true, technique: 'ct_rot_technique' },
    { id: 89, levelRange: [35, 50], hasCE: true, technique: 'ct_swarm_curse' },
    { id: 42, levelRange: [45, 60], hasCE: true, technique: 'ct_rot_technique' },
  ],
  bossWave: {
    boss: 'sukuna',
    miniBosses: ['mahito', 'jogo'],
  },
  rewards: {
    gold: 50000,
    expMult: 3,
    guaranteedFurniture: { quality: 'LEGENDARY', pool: ['cursed_altar', 'sukuna_finger'] },
  }
};

// 神兽专属咒术技能（补充到 TYPE_TECHNIQUES 之外的独立定义）
export const GOD_TECHNIQUES = {
  96:  { id: 'ct_god_96',  name: '时空崩裂', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { confuse: 0.5, spdDown: 1 }, desc: '扭曲时空的终极念力' },
  97:  { id: 'ct_god_97',  name: '混沌之怒', ceCost: 45, p: 140, pp: 99, cat: 'special', moveType: 'DRAGON', effect: { atkDown: 1 }, desc: '混沌之力的毁灭咆哮' },
  98:  { id: 'ct_god_98',  name: '圣剑审判', ceCost: 50, p: 145, pp: 99, cat: 'physical', moveType: 'STEEL', effect: { critBoost: 2 }, desc: '以圣剑裁决一切不义' },
  99:  { id: 'ct_god_99',  name: '永恒冰棺', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'ICE', effect: { freeze: 0.4 }, desc: '封印万物的绝对零度' },
  142: { id: 'ct_god_142', name: '古龙吐息', ceCost: 45, p: 145, pp: 99, cat: 'special', moveType: 'DRAGON', effect: {}, desc: '远古化石龙的原始吐息' },
  144: { id: 'ct_god_144', name: '极光冻雨', ceCost: 45, p: 135, pp: 99, cat: 'special', moveType: 'ICE', effect: { spdDown: 2 }, desc: '北极之鸟的极光风暴' },
  145: { id: 'ct_god_145', name: '万雷天罚', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { paralyze: 0.4 }, desc: '雷之化身的天罚雷击' },
  146: { id: 'ct_god_146', name: '神焰灭世', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'FIRE', effect: {}, desc: '不死鸟的终极火焰' },
  147: { id: 'ct_god_147', name: '深渊潮汐', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'WATER', effect: { accDown: 1 }, desc: '海底之王的毁灭潮汐' },
  150: { id: 'ct_void',    name: '虛式·茈',  ceCost: 60, p: 160, pp: 99, cat: 'special', moveType: 'GOD', effect: { ignoreDefense: true }, desc: '虚与实的碰撞——无法防御的一击' },
  151: { id: 'ct_god_151', name: '基因重组', ceCost: 40, p: 100, pp: 99, cat: 'status', moveType: 'NORMAL', effect: { healPercent: 0.4 }, desc: '改写自身基因恢复40%HP' },
  216: { id: 'ct_god_216', name: '暴君践踏', ceCost: 45, p: 140, pp: 99, cat: 'physical', moveType: 'GROUND', effect: { accDown: 1 }, desc: '大地暴君的毁灭践踏' },
  218: { id: 'ct_god_218', name: '熔岩奔流', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'FIRE', effect: { poison: true }, desc: '岩浆生物的灼热奔流' },
  220: { id: 'ct_god_220', name: '冰河时代', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'ICE', effect: { freeze: 0.35 }, desc: '召唤冰河纪元的极寒' },
  222: { id: 'ct_god_222', name: '珊瑚禁域', ceCost: 40, p: 120, pp: 99, cat: 'special', moveType: 'WATER', effect: { leech: 0.3 }, desc: '珊瑚领主的生命虹吸' },
  228: { id: 'ct_god_228', name: '暗夜猎杀', ceCost: 45, p: 140, pp: 99, cat: 'physical', moveType: 'GHOST', effect: { hpDrain: 0.25 }, desc: '暗夜猎手的灵魂收割' },
  233: { id: 'ct_god_233', name: '数据风暴', ceCost: 45, p: 135, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { confuse: 0.3 }, desc: '虚拟世界的数据崩溃' },
  242: { id: 'ct_god_242', name: '创世之力', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'GOD', effect: {}, desc: '创世神灵的原初之力' },
  243: { id: 'ct_god_243', name: '雷帝裁决', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { paralyze: 0.35 }, desc: '雷帝的终极审判' },
  244: { id: 'ct_god_244', name: '烈焰皇冠', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'FIRE', effect: {}, desc: '火焰皇帝的燃尽一切' },
  253: { id: 'ct_god_253', name: '天空神罚', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'FLYING', effect: { critBoost: 2 }, desc: '苍穹之主的神罚之风' },
  // LEGENDARY_POOL 补充
  234: { id: 'ct_god_234', name: '极地冰封', ceCost: 45, p: 140, pp: 99, cat: 'special', moveType: 'ICE', effect: { freeze: 0.35, spdDown: 1 }, desc: '冰霜巨龙的绝对封冻' },
  235: { id: 'ct_god_235', name: '末日海啸', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'WATER', effect: { accDown: 1 }, desc: '海啸王掀起的世界末日之潮' },
  236: { id: 'ct_god_236', name: '幽冥渡魂', ceCost: 45, p: 135, pp: 99, cat: 'special', moveType: 'GHOST', effect: { hpDrain: 0.2 }, desc: '幽灵船长的灵魂摆渡' },
  351: { id: 'ct_god_351', name: '深渊恐惧', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'WATER', effect: { confuse: 0.4, spdDown: 1 }, desc: '克苏鲁降临引发的终极恐惧' },
  355: { id: 'ct_god_355', name: '远古霸权', ceCost: 50, p: 150, pp: 99, cat: 'physical', moveType: 'BUG', effect: { atkDown: 1, defDown: 1 }, desc: '史前霸主的原始暴力' },
  // NEW_GOD_IDS (254~283)
  254: { id: 'ct_god_254', name: '起源创光', ceCost: 60, p: 160, pp: 99, cat: 'special', moveType: 'GOD', effect: { ignoreDefense: true }, desc: '万物起源的纯粹光辉' },
  255: { id: 'ct_god_255', name: '终焉吞噬', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'GHOST', effect: { hpDrain: 0.3 }, desc: '终焉之暗吞噬一切生命' },
  256: { id: 'ct_god_256', name: '太阳真火', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'FIRE', effect: {}, desc: '日轮神降下真正的太阳之火' },
  257: { id: 'ct_god_257', name: '月华银箭', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'FAIRY', effect: { spdDown: 2 }, desc: '月华神的银色月光箭矢' },
  258: { id: 'ct_god_258', name: '星界吐息', ceCost: 60, p: 165, pp: 99, cat: 'special', moveType: 'DRAGON', effect: { critBoost: 1 }, desc: '星界龙王的毁灭吐息' },
  259: { id: 'ct_god_259', name: '泰坦之拳', ceCost: 50, p: 150, pp: 99, cat: 'physical', moveType: 'GROUND', effect: { defDown: 2 }, desc: '大地泰坦粉碎一切的巨拳' },
  260: { id: 'ct_god_260', name: '利维坦咆哮', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'WATER', effect: { confuse: 0.3, accDown: 1 }, desc: '深海利维坦引发的末日海啸' },
  261: { id: 'ct_god_261', name: '天空裁决', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'FLYING', effect: { critBoost: 2 }, desc: '天空主宰从苍穹俯冲的裁决' },
  262: { id: 'ct_god_262', name: '宙斯之雷', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { paralyze: 0.5 }, desc: '雷霆宙斯的万钧之雷' },
  263: { id: 'ct_god_263', name: '绝对零度·真', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'ICE', effect: { freeze: 0.45 }, desc: '极寒冰帝的绝对冻结' },
  264: { id: 'ct_god_264', name: '生命之泉', ceCost: 40, p: 110, pp: 99, cat: 'special', moveType: 'GRASS', effect: { leech: 0.35 }, desc: '生命之树的永恒生命力' },
  265: { id: 'ct_god_265', name: '死神镰刀', ceCost: 55, p: 155, pp: 99, cat: 'physical', moveType: 'GHOST', effect: { hpDrain: 0.25, critBoost: 2 }, desc: '死亡之翼的灵魂收割镰刀' },
  266: { id: 'ct_god_266', name: '时光逆流', ceCost: 45, p: 130, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { healPercent: 0.25 }, desc: '时光守护者逆转时间回复自身' },
  267: { id: 'ct_god_267', name: '空间断层', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { ignoreDefense: true }, desc: '空间撕裂者撕裂维度的一击' },
  268: { id: 'ct_god_268', name: '混沌毒雾', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'POISON', effect: { poison: true, confuse: 0.3 }, desc: '混沌魔君弥漫的致命毒雾' },
  269: { id: 'ct_god_269', name: '秩序之刃', ceCost: 50, p: 150, pp: 99, cat: 'physical', moveType: 'STEEL', effect: { defDown: 1 }, desc: '秩序圣骑的裁决之刃' },
  270: { id: 'ct_god_270', name: '武神连击', ceCost: 50, p: 60, pp: 99, cat: 'physical', moveType: 'FIGHT', effect: { multiHit: 3 }, desc: '武斗神的三连追击拳' },
  271: { id: 'ct_god_271', name: '元素融合', ceCost: 45, p: 140, pp: 99, cat: 'special', moveType: 'NORMAL', effect: { atkUp: 1, sAtkUp: 1 }, desc: '元素领主融合万象的一击' },
  272: { id: 'ct_god_272', name: '机械毁灭炮', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'STEEL', effect: { defDown: 1 }, desc: '机械降神的终极歼灭炮' },
  273: { id: 'ct_god_273', name: '永梦蝶舞', ceCost: 45, p: 130, pp: 99, cat: 'special', moveType: 'FAIRY', effect: { confuse: 0.5, healPercent: 0.15 }, desc: '梦境编织者的迷幻蝶舞' },
  274: { id: 'ct_god_274', name: '深渊之眼', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'GHOST', effect: { confuse: 0.4, accDown: 2 }, desc: '深渊凝视者的恐惧凝视' },
  275: { id: 'ct_god_275', name: '熔核爆裂', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'FIRE', effect: { selfDmg: 0.1 }, desc: '熔岩魔神的地核爆裂' },
  276: { id: 'ct_god_276', name: '风暴毁灭', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'FLYING', effect: { spdDown: 2, accDown: 1 }, desc: '风暴之怒的毁灭飓风' },
  277: { id: 'ct_god_277', name: '母皇毒液', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'POISON', effect: { poison: true, leech: 0.2 }, desc: '剧毒母皇的致死毒液' },
  278: { id: 'ct_god_278', name: '金刚碎击', ceCost: 50, p: 155, pp: 99, cat: 'physical', moveType: 'ROCK', effect: { defDown: 1 }, desc: '金刚不坏的岩石粉碎' },
  279: { id: 'ct_god_279', name: '幻影迷宫', ceCost: 45, p: 130, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { confuse: 0.6 }, desc: '幻影之王的无限迷宫' },
  280: { id: 'ct_god_280', name: '虫群灭世', ceCost: 50, p: 145, pp: 99, cat: 'physical', moveType: 'BUG', effect: { multiHit: 2, poison: true }, desc: '虫群之心操控的虫海吞噬' },
  281: { id: 'ct_god_281', name: '一刀两断', ceCost: 55, p: 160, pp: 99, cat: 'physical', moveType: 'STEEL', effect: { critBoost: 3 }, desc: '斩铁剑圣的终极一刀' },
  282: { id: 'ct_god_282', name: '圣愈光辉', ceCost: 40, p: 80, pp: 99, cat: 'status', moveType: 'NORMAL', effect: { healPercent: 0.5 }, desc: '治愈女神的最强恢复之光' },
  283: { id: 'ct_god_283', name: '创世元力', ceCost: 65, p: 170, pp: 99, cat: 'special', moveType: 'GOD', effect: { ignoreDefense: true }, desc: '创世元灵的原初毁灭之力' },
  // FINAL_GOD_IDS (331~340)
  331: { id: 'ct_god_331', name: '时间停滞', ceCost: 55, p: 145, pp: 99, cat: 'special', moveType: 'STEEL', effect: { paralyze: 0.5 }, desc: '时光沙漏冻结时间的一击' },
  332: { id: 'ct_god_332', name: '维度切割', ceCost: 60, p: 165, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { ignoreDefense: true }, desc: '维度魔神切割空间维度的一击' },
  333: { id: 'ct_god_333', name: '瘟疫灭世', ceCost: 55, p: 150, pp: 99, cat: 'special', moveType: 'POISON', effect: { poison: true, leech: 0.25 }, desc: '瘟疫之源散播的终极瘟疫' },
  334: { id: 'ct_god_334', name: '雷霆制裁', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { paralyze: 0.45 }, desc: '雷霆领主的终极制裁之雷' },
  335: { id: 'ct_god_335', name: '沧海怒涛', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'WATER', effect: { spdDown: 2 }, desc: '沧海之王掀起的远古怒涛' },
  336: { id: 'ct_god_336', name: '天神降临', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'FLYING', effect: { critBoost: 2, spdDown: 1 }, desc: '天空之神从天而降的审判' },
  337: { id: 'ct_god_337', name: '崩山碎地', ceCost: 55, p: 160, pp: 99, cat: 'physical', moveType: 'GROUND', effect: { defDown: 2 }, desc: '崩山巨兽粉碎山岳的一击' },
  338: { id: 'ct_god_338', name: '摄魂夺魄', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'GHOST', effect: { hpDrain: 0.3, confuse: 0.4 }, desc: '摄魂死神掠夺灵魂的终极技' },
  339: { id: 'ct_god_339', name: '圣灵祝福', ceCost: 45, p: 120, pp: 99, cat: 'special', moveType: 'FAIRY', effect: { healPercent: 0.3, atkUp: 1 }, desc: '圣灵仙子的神圣祝福' },
  340: { id: 'ct_god_340', name: '灭世龙息', ceCost: 65, p: 175, pp: 99, cat: 'special', moveType: 'DRAGON', effect: { selfDmg: 0.15 }, desc: '灭世魔龙的终焉龙息——以身换灭世' },
  // NEW_LEGENDARY_IDS (480~489)
  480: { id: 'ct_god_480', name: '暗黑吞天', ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'DARK', effect: { hpDrain: 0.2, accDown: 1 }, desc: '暗黑龙神的吞天噬地' },
  481: { id: 'ct_god_481', name: '光明凤翼', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'FAIRY', effect: { healPercent: 0.2 }, desc: '光明凤凰的圣光翼击' },
  482: { id: 'ct_god_482', name: '时间蛇咬', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'PSYCHIC', effect: { spdDown: 2, confuse: 0.3 }, desc: '时间之蛇的因果律蛇咬' },
  483: { id: 'ct_god_483', name: '空间鲸歌', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'WATER', effect: { confuse: 0.4, defDown: 1 }, desc: '空间之鲸的次元鲸歌' },
  484: { id: 'ct_god_484', name: '混沌漩涡', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'GHOST', effect: { hpDrain: 0.25, confuse: 0.3 }, desc: '混沌魔神的虚空漩涡' },
  485: { id: 'ct_god_485', name: '大地母息', ceCost: 45, p: 130, pp: 99, cat: 'special', moveType: 'GROUND', effect: { healPercent: 0.3 }, desc: '大地母神的生命吐息' },
  486: { id: 'ct_god_486', name: '永恒枝缚', ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'GRASS', effect: { leech: 0.3, spdDown: 2 }, desc: '永恒之树的根系缠绕' },
  487: { id: 'ct_god_487', name: '雷神一击', ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'ELECTRIC', effect: { paralyze: 0.45 }, desc: '雷霆战神的究极雷击' },
  488: { id: 'ct_god_488', name: '铁壁崩拳', ceCost: 50, p: 150, pp: 99, cat: 'physical', moveType: 'STEEL', effect: { defDown: 2 }, desc: '钢铁巨像的铁壁碎裂之拳' },
  489: { id: 'ct_god_489', name: '冰霜女帝之怒', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'ICE', effect: { freeze: 0.4, spdDown: 1 }, desc: '冰霜女帝的终极冻结' },
  // GODS_610 (601~610) — 风/光/恶神兽专属
  601: { id: 'ct_god_601', name: '嵐神·風刃万断', ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'WIND', effect: { spdDown: 2 }, desc: '岚神召唤万千风刃，切碎一切并大幅降速' },
  602: { id: 'ct_god_602', name: '飓风·终焉',     ceCost: 50, p: 150, pp: 99, cat: 'special', moveType: 'WIND', effect: { confuse: 0.4 }, desc: '苍穹凤凰展翅引发终焉飓风，40%混乱' },
  603: { id: 'ct_god_603', name: '真空·绝灭',     ceCost: 60, p: 160, pp: 99, cat: 'special', moveType: 'WIND', effect: { ignoreDefense: true }, desc: '真空之主制造绝对真空，无视一切防御' },
  604: { id: 'ct_god_604', name: '天照·炎陽',     ceCost: 55, p: 155, pp: 99, cat: 'special', moveType: 'LIGHT', effect: { healPercent: 0.2 }, desc: '天照大神降下太阳真火，同时恢复20%HP' },
  605: { id: 'ct_god_605', name: '极光·七色审判', ceCost: 50, p: 145, pp: 99, cat: 'special', moveType: 'LIGHT', effect: { accDown: 1, spdDown: 1 }, desc: '极光天使的七色光束，降低命中和速度' },
  606: { id: 'ct_god_606', name: '棱镜·全反射',   ceCost: 50, p: 140, pp: 99, cat: 'special', moveType: 'LIGHT', effect: { defUp: 2 }, desc: '棱镜圣兽全方位折射，大幅提升自身防御' },
  607: { id: 'ct_god_607', name: '创世·光明裁决', ceCost: 60, p: 165, pp: 99, cat: 'special', moveType: 'LIGHT', effect: { ignoreDefense: true }, desc: '创世之光的终极裁决，无视一切防御' },
  608: { id: 'ct_god_608', name: '冥渊·堕天',     ceCost: 55, p: 160, pp: 99, cat: 'special', moveType: 'DARK', effect: { hpDrain: 0.25 }, desc: '冥渊魔王的堕天一击，吸取25%伤害为HP' },
  609: { id: 'ct_god_609', name: '暗影·瞬杀',     ceCost: 55, p: 155, pp: 99, cat: 'physical', moveType: 'DARK', effect: { critBoost: 3 }, desc: '暗影刺客的终极暗杀，暴击率暴增' },
  610: { id: 'ct_god_610', name: '永夜·吞天',     ceCost: 55, p: 150, pp: 99, cat: 'special', moveType: 'DARK', effect: { accDown: 2, atkDown: 1 }, desc: '永夜之主吞噬天光，降低命中和攻击' },
};

// 咒术觉醒条件
export const AWAKENING_CONDITIONS = {
  byLevel: 50,
  byIntimacy: 100,
  specialAwakenings: [
    { petId: 150, technique: 'ct_void', condition: 'level >= 50' },
    { petId: 68,  technique: 'ct_divergent_fist', condition: 'intimacy >= 200' },
    { petId: 96,  technique: 'ct_god_96',  condition: 'level >= 40' },
    { petId: 97,  technique: 'ct_god_97',  condition: 'level >= 40' },
    { petId: 98,  technique: 'ct_god_98',  condition: 'level >= 40' },
    { petId: 99,  technique: 'ct_god_99',  condition: 'level >= 40' },
    { petId: 142, technique: 'ct_god_142', condition: 'level >= 40' },
    { petId: 144, technique: 'ct_god_144', condition: 'level >= 40' },
    { petId: 145, technique: 'ct_god_145', condition: 'level >= 40' },
    { petId: 146, technique: 'ct_god_146', condition: 'level >= 40' },
    { petId: 147, technique: 'ct_god_147', condition: 'level >= 40' },
    { petId: 151, technique: 'ct_god_151', condition: 'level >= 40' },
    { petId: 216, technique: 'ct_god_216', condition: 'level >= 40' },
    { petId: 218, technique: 'ct_god_218', condition: 'level >= 40' },
    { petId: 220, technique: 'ct_god_220', condition: 'level >= 40' },
    { petId: 222, technique: 'ct_god_222', condition: 'level >= 40' },
    { petId: 228, technique: 'ct_god_228', condition: 'level >= 40' },
    { petId: 233, technique: 'ct_god_233', condition: 'level >= 40' },
    { petId: 242, technique: 'ct_god_242', condition: 'level >= 50' },
    { petId: 243, technique: 'ct_god_243', condition: 'level >= 50' },
    { petId: 244, technique: 'ct_god_244', condition: 'level >= 50' },
    { petId: 253, technique: 'ct_god_253', condition: 'level >= 50' },
    { petId: 234, technique: 'ct_god_234', condition: 'level >= 40' },
    { petId: 235, technique: 'ct_god_235', condition: 'level >= 40' },
    { petId: 236, technique: 'ct_god_236', condition: 'level >= 40' },
    { petId: 351, technique: 'ct_god_351', condition: 'level >= 45' },
    { petId: 355, technique: 'ct_god_355', condition: 'level >= 45' },
    { petId: 254, technique: 'ct_god_254', condition: 'level >= 40' },
    { petId: 255, technique: 'ct_god_255', condition: 'level >= 40' },
    { petId: 256, technique: 'ct_god_256', condition: 'level >= 40' },
    { petId: 257, technique: 'ct_god_257', condition: 'level >= 40' },
    { petId: 258, technique: 'ct_god_258', condition: 'level >= 40' },
    { petId: 259, technique: 'ct_god_259', condition: 'level >= 40' },
    { petId: 260, technique: 'ct_god_260', condition: 'level >= 40' },
    { petId: 261, technique: 'ct_god_261', condition: 'level >= 40' },
    { petId: 262, technique: 'ct_god_262', condition: 'level >= 40' },
    { petId: 263, technique: 'ct_god_263', condition: 'level >= 40' },
    { petId: 264, technique: 'ct_god_264', condition: 'level >= 40' },
    { petId: 265, technique: 'ct_god_265', condition: 'level >= 40' },
    { petId: 266, technique: 'ct_god_266', condition: 'level >= 40' },
    { petId: 267, technique: 'ct_god_267', condition: 'level >= 40' },
    { petId: 268, technique: 'ct_god_268', condition: 'level >= 40' },
    { petId: 269, technique: 'ct_god_269', condition: 'level >= 40' },
    { petId: 270, technique: 'ct_god_270', condition: 'level >= 40' },
    { petId: 271, technique: 'ct_god_271', condition: 'level >= 40' },
    { petId: 272, technique: 'ct_god_272', condition: 'level >= 40' },
    { petId: 273, technique: 'ct_god_273', condition: 'level >= 40' },
    { petId: 274, technique: 'ct_god_274', condition: 'level >= 40' },
    { petId: 275, technique: 'ct_god_275', condition: 'level >= 40' },
    { petId: 276, technique: 'ct_god_276', condition: 'level >= 40' },
    { petId: 277, technique: 'ct_god_277', condition: 'level >= 40' },
    { petId: 278, technique: 'ct_god_278', condition: 'level >= 40' },
    { petId: 279, technique: 'ct_god_279', condition: 'level >= 40' },
    { petId: 280, technique: 'ct_god_280', condition: 'level >= 40' },
    { petId: 281, technique: 'ct_god_281', condition: 'level >= 40' },
    { petId: 282, technique: 'ct_god_282', condition: 'level >= 40' },
    { petId: 283, technique: 'ct_god_283', condition: 'level >= 50' },
    { petId: 331, technique: 'ct_god_331', condition: 'level >= 50' },
    { petId: 332, technique: 'ct_god_332', condition: 'level >= 50' },
    { petId: 333, technique: 'ct_god_333', condition: 'level >= 50' },
    { petId: 334, technique: 'ct_god_334', condition: 'level >= 50' },
    { petId: 335, technique: 'ct_god_335', condition: 'level >= 50' },
    { petId: 336, technique: 'ct_god_336', condition: 'level >= 50' },
    { petId: 337, technique: 'ct_god_337', condition: 'level >= 50' },
    { petId: 338, technique: 'ct_god_338', condition: 'level >= 50' },
    { petId: 339, technique: 'ct_god_339', condition: 'level >= 50' },
    { petId: 340, technique: 'ct_god_340', condition: 'level >= 50' },
    { petId: 480, technique: 'ct_god_480', condition: 'level >= 45' },
    { petId: 481, technique: 'ct_god_481', condition: 'level >= 45' },
    { petId: 482, technique: 'ct_god_482', condition: 'level >= 45' },
    { petId: 483, technique: 'ct_god_483', condition: 'level >= 45' },
    { petId: 484, technique: 'ct_god_484', condition: 'level >= 45' },
    { petId: 485, technique: 'ct_god_485', condition: 'level >= 45' },
    { petId: 486, technique: 'ct_god_486', condition: 'level >= 45' },
    { petId: 487, technique: 'ct_god_487', condition: 'level >= 45' },
    { petId: 488, technique: 'ct_god_488', condition: 'level >= 45' },
    { petId: 489, technique: 'ct_god_489', condition: 'level >= 45' },
  ]
};
