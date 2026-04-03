// ==========================================
// 莉可莉丝系统 - 搭档羁绊 & LycoReco咖啡厅
// ==========================================

export const BOND_LEVELS = [
  { threshold: 50,  tier: 1, powerMult: 1.0, name: '初识搭档' },
  { threshold: 150, tier: 2, powerMult: 1.5, name: '心意相通' },
  { threshold: 300, tier: 3, powerMult: 2.0, name: '完美默契' },
];

export const getBondLevel = (bondPoints) => {
  let lv = null;
  for (const bl of BOND_LEVELS) {
    if (bondPoints >= bl.threshold) lv = bl;
  }
  return lv;
};

export const PARTNER_COMBOS = {
  FIRE_WATER:     { name: '蒸汽爆裂',   power: 150, type: 'FIRE',     cat: 'special', effect: { ignoreResist: true },                       desc: '火水交融产生高压蒸汽，无视属性抵抗' },
  FIRE_WIND:      { name: '烈焰风暴',   power: 140, type: 'FIRE',     cat: 'special', effect: { burn: 0.6 },                                desc: '风助火势，60%灼伤' },
  FIRE_GRASS:     { name: '野火燎原',   power: 130, type: 'FIRE',     cat: 'physical', effect: { burn: 0.4 },                               desc: '草木助燃，大地焦灼' },
  FIRE_ICE:       { name: '冰火两重天', power: 160, type: 'NORMAL',   cat: 'special', effect: { confuse: 0.5 },                             desc: '极端温差冲击，50%混乱' },
  WATER_GRASS:    { name: '雨林吞噬',   power: 135, type: 'GRASS',    cat: 'special', effect: { healPercent: 0.15 },                        desc: '雨润草木，恢复15%HP' },
  WATER_ELECTRIC: { name: '雷暴海啸',   power: 155, type: 'ELECTRIC', cat: 'special', effect: { paralyze: 1.0 },                            desc: '电流贯穿水面，100%麻痹' },
  WATER_ICE:      { name: '绝对零度',   power: 145, type: 'ICE',      cat: 'special', effect: { freeze: 0.3 },                              desc: '极寒冰海，30%冻结' },
  GRASS_ELECTRIC: { name: '雷木交辉',   power: 130, type: 'ELECTRIC', cat: 'special', effect: { spdUp: 1 },                                 desc: '雷电灌注树木爆发，提升速度' },
  GRASS_GROUND:   { name: '大地之怒',   power: 140, type: 'GROUND',   cat: 'physical', effect: { defDown: 1 },                              desc: '根系撕裂大地，降低防御' },
  ELECTRIC_STEEL: { name: '电磁炮',     power: 155, type: 'ELECTRIC', cat: 'special', effect: { ignoreResist: true },                       desc: '电磁加速钢弹，无视抵抗' },
  ELECTRIC_FLYING:{ name: '雷霆万钧',   power: 145, type: 'ELECTRIC', cat: 'special', effect: { paralyze: 0.5 },                            desc: '从天而降的雷击' },
  ICE_FIGHT:      { name: '冰拳制裁',   power: 150, type: 'ICE',      cat: 'physical', effect: { defDown: 2 },                              desc: '冰封拳击，降防2级' },
  ICE_WIND:       { name: '暴风雪',     power: 140, type: 'ICE',      cat: 'special', effect: { spdDown: 1 },                               desc: '凛冬暴风，降低速度' },
  FIGHT_STEEL:    { name: '钢铁拳王',   power: 155, type: 'FIGHT',    cat: 'physical', effect: { critUp: true },                            desc: '钢拳出击，暴击率提升' },
  FIGHT_DARK:     { name: '暗影破碎拳', power: 145, type: 'FIGHT',    cat: 'physical', effect: { ignoreResist: true },                      desc: '暗影与拳劲融合，无视抵抗' },
  POISON_GHOST:   { name: '冥毒诅咒',   power: 135, type: 'GHOST',    cat: 'special', effect: { poison: 1.0, confuse: 0.3 },                desc: '剧毒与诅咒交织' },
  POISON_FAIRY:   { name: '毒雾仙境',   power: 130, type: 'FAIRY',    cat: 'special', effect: { poison: 0.5, healPercent: 0.1 },            desc: '仙雾中暗藏毒素' },
  GROUND_ROCK:    { name: '山崩地裂',   power: 160, type: 'GROUND',   cat: 'physical', effect: { defDown: 1 },                              desc: '大地碎裂，山岩崩塌' },
  FLYING_DRAGON:  { name: '龙翔天际',   power: 155, type: 'DRAGON',   cat: 'special', effect: { spdUp: 1 },                                 desc: '龙与风的极速突击' },
  PSYCHIC_GHOST:  { name: '灵魂共鸣',   power: 145, type: 'PSYCHIC',  cat: 'special', effect: { confuse: 0.6 },                             desc: '灵与魂的交织，60%混乱' },
  PSYCHIC_FAIRY:  { name: '星光审判',   power: 150, type: 'FAIRY',    cat: 'special', effect: { spAtkUp: 1 },                               desc: '星光聚合为审判之力' },
  BUG_GRASS:      { name: '虫群风暴',   power: 130, type: 'BUG',      cat: 'physical', effect: { atkUp: 1 },                                desc: '虫群与草木协同进攻' },
  ROCK_STEEL:     { name: '铁壁磐石',   power: 145, type: 'STEEL',    cat: 'physical', effect: { defUp: 2 },                                desc: '坚不可摧的防御阵型，防御+2' },
  GHOST_DARK:     { name: '暗夜噬灵',   power: 155, type: 'DARK',     cat: 'special', effect: { healPercent: 0.2 },                         desc: '吞噬暗影回复20%HP' },
  DRAGON_FAIRY:   { name: '龙仙合璧',   power: 160, type: 'DRAGON',   cat: 'special', effect: { ignoreResist: true },                      desc: '龙与仙的终极联合' },
  LIGHT_DARK:     { name: '黎明终焉',   power: 170, type: 'NORMAL',   cat: 'special', effect: { crit: true },                               desc: '光暗交汇，必定暴击' },
  LIGHT_FAIRY:    { name: '圣光洗礼',   power: 140, type: 'LIGHT',    cat: 'special', effect: { healPercent: 0.2, cureStatus: true },       desc: '神圣之光洗净一切' },
  LIGHT_PSYCHIC:  { name: '心灵之光',   power: 145, type: 'LIGHT',    cat: 'special', effect: { spAtkUp: 1, confuse: 0.3 },                 desc: '精神与光芒的共振' },
  DARK_POISON:    { name: '堕暗侵蚀',   power: 140, type: 'DARK',     cat: 'special', effect: { poison: 0.8, defDown: 1 },                  desc: '黑暗腐蚀肉体与灵魂' },
  WIND_FLYING:    { name: '天翔疾风',   power: 145, type: 'WIND',     cat: 'physical', effect: { spdUp: 2 },                                desc: '极速的风与翼的合一，速度+2' },
  WIND_DRAGON:    { name: '风龙咆哮',   power: 155, type: 'DRAGON',   cat: 'special', effect: { spdUp: 1 },                                 desc: '龙息化为风暴席卷' },
  STEEL_ICE:      { name: '冰钢绝壁',   power: 140, type: 'STEEL',    cat: 'physical', effect: { defUp: 1, freeze: 0.2 },                   desc: '冰与钢筑成的绝对防壁' },
  DRAGON_STEEL:   { name: '钢龙之怒',   power: 165, type: 'DRAGON',   cat: 'physical', effect: { critUp: true },                            desc: '钢铁巨龙的毁灭一击' },
  FAIRY_WIND:     { name: '精灵旋舞',   power: 135, type: 'FAIRY',    cat: 'special', effect: { healPercent: 0.1, spdUp: 1 },               desc: '仙灵在风中翩翩起舞' },
  NORMAL_FIGHT:   { name: '全力突击',   power: 140, type: 'FIGHT',    cat: 'physical', effect: { atkUp: 1 },                                desc: '蓄力后的全力一击' },
};

export const getPartnerComboKey = (type1, type2) => {
  const k1 = `${type1}_${type2}`;
  const k2 = `${type2}_${type1}`;
  if (PARTNER_COMBOS[k1]) return k1;
  if (PARTNER_COMBOS[k2]) return k2;
  return null;
};

export const SAME_TYPE_COMBO = {
  name: '同频共振', power: 140, cat: 'special',
  effect: { atkUp: 1, spAtkUp: 1 },
  desc: '相同属性搭档共振，STAB双倍加成'
};

export const DEFAULT_COMBO = {
  name: '搭档合击', power: 120, cat: 'physical',
  effect: {},
  desc: '默认协作技，通用但威力较低'
};

export const BOND_PER_TURN = 5;
export const BOND_PER_KO = 10;

// ==========================================
// LycoReco 咖啡厅
// ==========================================

export const CAFE_BUILDING = {
  id: 'lycoreco_cafe',
  name: 'LycoReco咖啡厅',
  price: 15000,
  workerSlots: 3,
  tickInterval: 300000,
  goldPerTick: 200,
  itemChance: 0.3,
};

export const CAFE_LEVELS = [
  { level: 1, workCount: 0,   goldMult: 1.0, unlockDrinks: ['chisato_blend'] },
  { level: 2, workCount: 10,  goldMult: 1.2, unlockDrinks: ['caffeine_rush'] },
  { level: 3, workCount: 25,  goldMult: 1.4, unlockDrinks: ['relax_tea'] },
  { level: 4, workCount: 50,  goldMult: 1.6, unlockDrinks: ['battle_espresso'] },
  { level: 5, workCount: 100, goldMult: 2.0, unlockDrinks: ['energy_smoothie'] },
];

export const getCafeLevel = (workCount) => {
  let lv = CAFE_LEVELS[0];
  for (const cl of CAFE_LEVELS) {
    if (workCount >= cl.workCount) lv = cl;
  }
  return lv;
};

export const CAFE_DRINKS = [
  { id: 'chisato_blend',   name: '千束特调',   price: 500,   effect: { spdMult: 1.2 },                     unlock: 'story_lycoris_0', desc: '速度+20%（1场战斗）' },
  { id: 'takina_latte',    name: '泷奈拿铁',   price: 600,   effect: { atkMult: 1.15 },                    unlock: 'story_lycoris_1', desc: '物攻+15%（1场战斗）' },
  { id: 'partner_shake',   name: '搭档奶昔',   price: 800,   effect: { comboMult: 1.2 },                   unlock: 'first_partner',   desc: '协作技威力+20%（1场战斗）' },
  { id: 'caffeine_rush',   name: '咖啡因冲击', price: 700,   effect: { priorityBoost: 0.3 },               unlock: 'cafe_lv2',        desc: '先手率+30%（1场战斗）' },
  { id: 'relax_tea',       name: '放松花茶',   price: 600,   effect: { healBoost: 1.1 },                   unlock: 'cafe_lv3',        desc: 'HP回复效果+10%（1场战斗）' },
  { id: 'battle_espresso', name: '战斗浓缩',   price: 900,   effect: { critBoost: 0.1 },                   unlock: 'cafe_lv4',        desc: '暴击率+10%（1场战斗）' },
  { id: 'energy_smoothie', name: '能量果昔',   price: 1000,  effect: { expMult: 1.2 },                     unlock: 'cafe_lv5',        desc: '经验+20%（1场战斗）' },
  { id: 'master_recipe',   name: '大师配方',   price: 2000,  effect: { atkMult: 1.05, spdMult: 1.05, critBoost: 0.05 }, unlock: 'all_lycoris_ach', desc: '全属性+5%（1场战斗）' },
];

export const DEFAULT_CAFE_STATE = {
  owned: false,
  workers: [],
  totalWorkCount: 0,
  lastTickTime: Date.now(),
  unlockedDrinks: [],
  activeDrink: null,
};
