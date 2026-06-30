/** 生态适应度 — 区域环境压力与精灵适应/不适应 */

export const REGION_PRESSURE = {
  1: { type: 'vegetation', name: '密林', icon: '🌲' },
  2: { type: 'normal', name: '平原', icon: '🌾' },
  3: { type: 'normal', name: '丘陵', icon: '⛰️' },
  4: { type: 'water', name: '水域', icon: '🌊' },
  5: { type: 'heat', name: '高温', icon: '🌋' },
  6: { type: 'spirit', name: '灵压', icon: '🤖' },
  7: { type: 'fear', name: '暗域', icon: '🌑' },
  8: { type: 'wind', name: '风暴', icon: '💨' },
  9: { type: 'cold', name: '严寒', icon: '❄️' },
  10: { type: 'cold', name: '荒漠寒夜', icon: '🏜️' },
  11: { type: 'spirit', name: '灵脉', icon: '✨' },
  12: { type: 'spirit', name: '星陨', icon: '🌌' },
};

export const PRESSURE_RULES = {
  cold: {
    adapted: ['FIRE', 'ICE', 'STEEL'],
    maladapted: ['WATER', 'GRASS'],
    adaptedMult: 1.05,
    maladaptMult: 0.9,
    hint: '火/冰/钢系适应严寒，水系易冻结',
  },
  heat: {
    adapted: ['FIRE', 'GROUND', 'ROCK'],
    maladapted: ['ICE', 'WATER'],
    adaptedMult: 1.05,
    maladaptMult: 0.9,
    hint: '火/地面/岩石适应高温，冰/水系消耗增加',
  },
  water: {
    adapted: ['WATER', 'ICE'],
    maladapted: ['FIRE', 'ELECTRIC'],
    adaptedMult: 1.05,
    maladaptMult: 0.92,
    hint: '水/冰系如鱼得水，火系受限',
  },
  vegetation: {
    adapted: ['GRASS', 'BUG', 'FLYING'],
    maladapted: ['FIRE'],
    adaptedMult: 1.05,
    maladaptMult: 0.93,
    hint: '草/虫/飞行适应密林，火系在黑藤中受限',
  },
  fear: {
    adapted: ['DARK', 'GHOST', 'PSYCHIC'],
    maladapted: ['FAIRY', 'NORMAL'],
    adaptedMult: 1.05,
    maladaptMult: 0.92,
    hint: '暗/幽灵/超能适应暗域，妖精/一般系易恐慌',
  },
  spirit: {
    adapted: ['PSYCHIC', 'FAIRY', 'COSMIC'],
    maladapted: ['NORMAL', 'FIGHT'],
    adaptedMult: 1.05,
    maladaptMult: 0.93,
    hint: '超能/妖精/宇宙系灵压适应，一般/格斗系吃力',
  },
  wind: {
    adapted: ['FLYING', 'ELECTRIC'],
    maladapted: ['GROUND', 'ROCK'],
    adaptedMult: 1.05,
    maladaptMult: 0.94,
    hint: '飞行/电系乘风，地面/岩石系行动迟缓',
  },
  poison: {
    adapted: ['POISON', 'STEEL', 'GROUND'],
    maladapted: ['GRASS', 'FAIRY'],
    adaptedMult: 1.05,
    maladaptMult: 0.9,
    hint: '毒/钢/地面适应沼泽，草/妖精易中毒',
  },
  normal: {
    adapted: [],
    maladapted: [],
    adaptedMult: 1.0,
    maladaptMult: 1.0,
    hint: '环境压力适中',
  },
};

export function getRegionPressure(mapId) {
  return REGION_PRESSURE[mapId] || { type: 'normal', name: '平原', icon: '🌾' };
}

export function getAdaptationMult(pet, mapId) {
  if (!pet) return 1;
  const pressure = getRegionPressure(mapId);
  const rules = PRESSURE_RULES[pressure.type] || PRESSURE_RULES.normal;
  const types = [pet.type, pet.secondaryType, pet.type2].filter(Boolean);
  if (types.some(t => rules.adapted.includes(t))) return rules.adaptedMult;
  if (types.some(t => rules.maladapted.includes(t))) return rules.maladaptMult;
  return 1;
}

export function getPartyAdaptationSummary(party, mapId) {
  const pressure = getRegionPressure(mapId);
  const rules = PRESSURE_RULES[pressure.type] || PRESSURE_RULES.normal;
  const adapted = (party || []).filter(p => getAdaptationMult(p, mapId) > 1).length;
  const maladapted = (party || []).filter(p => getAdaptationMult(p, mapId) < 1).length;
  return { pressure, rules, adapted, maladapted, total: (party || []).length };
}
