// ==========================================
// 咒术回战系统 - 数据定义
// ==========================================

export const CURSED_ENERGY_CONFIG = {
  maxCE: 100,
  regenPerTurn: 15,
  chargeAction: 40,
  levelScaling: 0.5,
  initialPercent: 0.3,
};

export const CURSE_GRADES = {
  SPECIAL: { name: '特级', minTotal: 500, ceBonus: 50, color: '#FF0000' },
  GRADE1:  { name: '一级', minTotal: 380, ceBonus: 30, color: '#FF6600' },
  GRADE2:  { name: '二级', minTotal: 260, ceBonus: 15, color: '#FFCC00' },
  GRADE3:  { name: '三级', minTotal: 150, ceBonus: 5,  color: '#00CC00' },
  GRADE4:  { name: '四级', minTotal: 0,   ceBonus: 0,  color: '#999999' },
};

export const getCurseGrade = (baseStats) => {
  const total = (baseStats.hp || 0) + (baseStats.p_atk || baseStats.atk || 0) +
                (baseStats.p_def || baseStats.def || 0) + (baseStats.s_atk || 0) +
                (baseStats.s_def || 0) + (baseStats.spd || 0);
  for (const [key, g] of Object.entries(CURSE_GRADES)) {
    if (total >= g.minTotal) return { key, ...g };
  }
  return { key: 'GRADE4', ...CURSE_GRADES.GRADE4 };
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
           moveType: 'FIGHT', effect: { doubleTap: true }, desc: '肉体与咒力的时间差攻击' },
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
  WATER: { name: '真人领域·自闭圆顿裹', turns: 3, ceCost: 80,
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
             effect: { enemySkipChance: 0.5, spdBoost: 2.0, dot: 0 },
             desc: '五条悟的领域，敌方50%概率无法行动' },
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
  GOD: { name: '神域·创世纪', turns: 5, ceCost: 100,
         effect: { atkBoost: 2.0, defBoost: 1.5, spdBoost: 1.5, dot: 0 },
         desc: '神之领域，全属性大幅提升' },
};

// 缚誓系统 (每个缚誓都需要最低咒力门槛 ceCost)
export const BINDING_VOWS = [
  { id: 'vow_power', name: '以命搏命', ceCost: 20,
    sacrifice: { hpPercent: 0.3 },
    reward: { atkMult: 2.0, turns: 1 },
    desc: '消耗20CE+30%HP，下一击伤害翻倍' },
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
    { id: 110, levelRange: [40, 55], hasCE: true, technique: 'ct_poison_rot' },
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

// 咒术觉醒条件
export const AWAKENING_CONDITIONS = {
  byLevel: 30,
  byIntimacy: 150,
  specialAwakenings: [
    { petId: 150, technique: 'ct_void', condition: 'level >= 50' },
    { petId: 68, technique: 'ct_divergent_fist', condition: 'intimacy >= 200' },
  ]
};
