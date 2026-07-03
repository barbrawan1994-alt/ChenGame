/** 精灵圣域 — 区域生态据点与共生设施 */

export const SANCTUARY_FACILITIES = [
  {
    id: 'purify_spring', name: '净化泉', icon: '💧', maxLevel: 5,
    desc: '降低区域污染，治疗精灵，恢复水源',
    costPerLevel: (lv) => 3000 + lv * 2000,
    effects: (lv) => ({ pollutionReduce: lv * 2, healBonus: lv * 3, waterBoost: lv * 2 }),
  },
  {
    id: 'moon_meadow', name: '月眠草田', icon: '🌙', maxLevel: 5,
    desc: '产出安抚类材料，提升安定度',
    costPerLevel: (lv) => 2500 + lv * 1500,
    effects: (lv) => ({ stabilityBoost: lv * 2, sootheBonus: lv * 5 }),
  },
  {
    id: 'canopy_nest', name: '树冠巢区', icon: '🌳', maxLevel: 5,
    desc: '吸引飞行和木系精灵',
    costPerLevel: (lv) => 3500 + lv * 1800,
    effects: (lv) => ({ vegetationBoost: lv * 2, flyingSpawn: lv * 3 }),
  },
  {
    id: 'rescue_center', name: '精灵救助所', icon: '🏥', maxLevel: 5,
    desc: '接收受伤精灵事件，提升多样性',
    costPerLevel: (lv) => 4000 + lv * 2200,
    effects: (lv) => ({ diversityBoost: lv * 2, rescueBonus: lv * 10 }),
  },
  {
    id: 'ancient_altar', name: '古树祭坛', icon: '⛩️', maxLevel: 3,
    desc: '解锁木/光进化线索，提升灵气',
    costPerLevel: (lv) => 8000 + lv * 5000,
    effects: (lv) => ({ spiritBoost: lv * 5, evoHint: lv >= 2 }),
  },
  {
    id: 'watch_tower', name: '观察塔', icon: '🔭', maxLevel: 5,
    desc: '提高稀有精灵发现率',
    costPerLevel: (lv) => 2800 + lv * 1600,
    effects: (lv) => ({ rareSpawn: lv * 4, observeBonus: lv * 8 }),
  },
  {
    id: 'ward_barrier', name: '防护结界', icon: '🛡️', maxLevel: 5,
    desc: '减少生态异变入侵',
    costPerLevel: (lv) => 4500 + lv * 2500,
    effects: (lv) => ({ crisisReduce: lv * 5, stabilityBoost: lv * 3 }),
  },
  {
    id: 'symbiosis_garden', name: '共生花园', icon: '🌺', maxLevel: 5,
    desc: '不同精灵组合产生特殊资源',
    costPerLevel: (lv) => 3200 + lv * 1900,
    effects: (lv) => ({ synergySlots: 2 + lv, goldPerDay: lv * 200 }),
  },
];

export const SANCTUARY_SYNERGY = [
  {
    id: 'night_peace',
    name: '月夜安定',
    pets: ['GRASS', 'FAIRY', 'NORMAL'],
    petNames: ['眠菇兽类', '小萤芽类', '叶团鼠类'],
    desc: '夜晚安定度提升，稀有精灵出现率提升',
    effects: { stability: 5, spirit: 3, nightRare: 0.1 },
  },
  {
    id: 'fire_balance',
    name: '炎息平衡',
    pets: ['FIRE', 'FLYING'],
    petNames: ['火尾狐类', '炎尾鸟类'],
    desc: '温度上升，黑藤减少，精灵活力提升',
    effects: { pollution: -8, vegetation: -1, spirit: 5 },
  },
  {
    id: 'water_restore',
    name: '水源复苏',
    pets: ['WATER', 'ICE'],
    petNames: ['水泡獭类', '月鳞鱼类'],
    desc: '水源恢复速度提升',
    effects: { water: 10, stability: 5 },
  },
  {
    id: 'wind_harvest',
    name: '风铃丰收',
    pets: ['FLYING', 'GRASS'],
    petNames: ['风铃鸟类', '花田类'],
    desc: '作物生长速度提升',
    effects: { vegetation: 8, diversity: 5 },
  },
  {
    id: 'rock_shield',
    name: '岩盾守护',
    pets: ['ROCK', 'STEEL'],
    petNames: ['岩甲犀类', '钢铁类'],
    desc: '防护结界强化，异变频率降低',
    effects: { stability: 12, pollution: -5 },
  },
  {
    id: 'spirit_bloom',
    name: '灵花绽放',
    pets: ['FAIRY', 'PSYCHIC'],
    petNames: ['妖精类', '超能类'],
    desc: '灵气浓度提升，稀有精灵吸引力增强',
    effects: { spirit: 10, diversity: 8 },
  },
];

export const DEFAULT_SANCTUARY = {
  mapId: 1,
  facilities: {},
  residents: [],
  synergyActive: null,
};

export function getFacilityDef(id) {
  return SANCTUARY_FACILITIES.find(f => f.id === id);
}

export function calcSanctuaryEcoBonus(sanctuary) {
  if (!sanctuary?.facilities) return {};
  const bonus = { water: 0, vegetation: 0, spirit: 0, pollution: 0, stability: 0, diversity: 0, nightRare: 0 };
  Object.entries(sanctuary.facilities).forEach(([fid, lv]) => {
    const def = getFacilityDef(fid);
    if (!def || !lv) return;
    const fx = def.effects(lv);
    if (fx.pollutionReduce) bonus.pollution -= fx.pollutionReduce;
    if (fx.vegetationBoost) bonus.vegetation += fx.vegetationBoost;
    if (fx.spiritBoost) bonus.spirit += fx.spiritBoost;
    if (fx.stabilityBoost) bonus.stability += fx.stabilityBoost;
    if (fx.diversityBoost) bonus.diversity += fx.diversityBoost;
    if (fx.waterBoost) bonus.water += fx.waterBoost;
  });
  const syn = SANCTUARY_SYNERGY.find(s => s.id === sanctuary.synergyActive);
  if (syn?.effects) {
    Object.entries(syn.effects).forEach(([k, v]) => {
      if (k === 'nightRare') { bonus.nightRare += v; return; }
      if (bonus[k] !== undefined) bonus[k] += v;
    });
  }
  return bonus;
}

export function checkSynergyMatch(synergyId, residents) {
  const syn = SANCTUARY_SYNERGY.find(s => s.id === synergyId);
  if (!syn || !syn.pets?.length) return false;
  if (!residents || residents.length < syn.pets.length) return false;
  const typeCounts = {};
  residents.forEach(p => {
    const uniqueTypes = new Set([p.type, p.secondaryType, p.type2].filter(Boolean));
    uniqueTypes.forEach(t => {
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
  });
  return syn.pets.every(t => (typeCounts[t] || 0) >= 1);
}

export function getSanctuaryUpgradeCost(facilityId, currentLevel) {
  const def = getFacilityDef(facilityId);
  if (!def || currentLevel >= def.maxLevel) return null;
  return def.costPerLevel(currentLevel + 1);
}
