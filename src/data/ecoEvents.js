/** 生态事件 — 周期性区域状态变化，影响遇敌、战斗与生态指标 */

import { getEcoCrisisByMapId } from './ecoCrises';

export const ECO_METRIC_KEYS = ['water', 'vegetation', 'spirit', 'pollution', 'stability', 'diversity'];

export const ECO_METRIC_LABELS = {
  water: '水源', vegetation: '植被', spirit: '灵气',
  pollution: '污染', stability: '安定', diversity: '多样性',
};

export const DEFAULT_ECOLOGY = {
  water: 50, vegetation: 50, spirit: 50,
  pollution: 30, stability: 50, diversity: 40,
};

/** 各地图初始生态（略有差异） */
export const MAP_DEFAULT_ECOLOGY = {
  1: { water: 55, vegetation: 70, spirit: 45, pollution: 25, stability: 60, diversity: 55 },
  2: { water: 35, vegetation: 40, spirit: 65, pollution: 40, stability: 35, diversity: 45 },
  3: { water: 30, vegetation: 20, spirit: 70, pollution: 35, stability: 30, diversity: 35 },
  4: { water: 80, vegetation: 40, spirit: 60, pollution: 20, stability: 55, diversity: 50 },
  5: { water: 30, vegetation: 25, spirit: 55, pollution: 35, stability: 45, diversity: 40 },
  6: { water: 40, vegetation: 20, spirit: 35, pollution: 45, stability: 40, diversity: 35 },
  7: { water: 45, vegetation: 50, spirit: 70, pollution: 30, stability: 50, diversity: 45 },
  8: { water: 70, vegetation: 30, spirit: 50, pollution: 25, stability: 50, diversity: 45 },
  9: { water: 60, vegetation: 15, spirit: 65, pollution: 15, stability: 55, diversity: 35 },
  10: { water: 20, vegetation: 10, spirit: 40, pollution: 25, stability: 35, diversity: 30 },
  11: { water: 50, vegetation: 45, spirit: 55, pollution: 20, stability: 60, diversity: 50 },
  12: { water: 35, vegetation: 30, spirit: 75, pollution: 15, stability: 55, diversity: 40 },
  106: { water: 40, vegetation: 25, spirit: 80, pollution: 10, stability: 50, diversity: 45 },
};

export const ECO_EVENTS = [
  {
    id: 'black_vine',
    mapId: 1,
    name: '黑藤蔓延',
    icon: '🌿',
    color: '#2E7D32',
    reqBadges: 1,
    summary: '黑藤在草原蔓延，木系精灵暴躁，暗/毒系出没增加。',
    effects: {
      encounterRateMult: 1.2,
      poolBonus: { types: ['GRASS', 'DARK', 'POISON'], weight: 1.5 },
      healReduction: 0.15,
      vineBlockBonus: 0.1,
    },
    resolveEcology: { pollution: -25, vegetation: 15, stability: 20 },
    counterTypes: ['FIRE', 'FAIRY'],
    counterHint: '火系可烧藤，光/妖精系可净化',
  },
  {
    id: 'mushroom_migration',
    mapId: 1,
    name: '眠菇兽大迁徙',
    icon: '🍄',
    color: '#8E24AA',
    reqBadges: 2,
    summary: '大量眠菇兽从森林深处迁徙到月光草地。暗系精灵伏击迁徙队伍。',
    effects: {
      encounterRateMult: 0.7,
      poolBonus: { types: ['GRASS', 'FAIRY'], weight: 1.6 },
      nightDarkBonus: 1.3,
    },
    resolveEcology: { stability: 20, diversity: 20, spirit: 10 },
    counterTypes: ['FAIRY', 'FLYING'],
    counterHint: '光系驱散暗影，风系吹散迷雾',
  },
  {
    id: 'mirror_mist',
    mapId: 4,
    name: '镜雾潮汐',
    icon: '🌫️',
    color: '#0277BD',
    reqBadges: 3,
    summary: '大雾笼罩湖面，视野缩短，水系技能增强，部分敌人会制造分身。',
    effects: {
      waterSkillBoost: 1.1,
      electricRisk: 0.08,
      hideEnemyInfo: true,
      poolBonus: { types: ['WATER', 'PSYCHIC'], weight: 1.4 },
    },
    resolveEcology: { water: 20, spirit: 15, stability: 15 },
    counterTypes: ['FLYING', 'PSYCHIC'],
    counterHint: '风系可驱散雾气，超能系可识破倒影',
  },
  {
    id: 'volcano_tremor',
    mapId: 5,
    name: '地脉震动',
    icon: '🌋',
    color: '#E64A19',
    reqBadges: 4,
    summary: '火山灵脉不稳定，岩浆溢出、地面精灵聚集。地下遗迹入口暴露。',
    effects: {
      encounterRateMult: 1.3,
      poolBonus: { types: ['FIRE', 'ROCK', 'GROUND'], weight: 1.5 },
      quakeChance: 0.08,
    },
    resolveEcology: { stability: 25, spirit: 15 },
    counterTypes: ['WATER', 'GROUND'],
    counterHint: '水系灭火，地面系稳定地脉',
  },
  {
    id: 'cyber_overload',
    mapId: 6,
    name: '电磁过载',
    icon: '⚡',
    color: '#1565C0',
    reqBadges: 5,
    summary: '赛博都市电网异常，机械精灵过载暴走，钢系受电磁干扰。',
    effects: {
      encounterRateMult: 1.15,
      poolBonus: { types: ['ELECTRIC', 'STEEL'], weight: 1.4 },
      mechanicalOverload: 0.1,
    },
    resolveEcology: { pollution: -20, stability: 20 },
    counterTypes: ['GROUND', 'ROCK'],
    counterHint: '地面系接地保护，岩石系抗电磁',
  },
  {
    id: 'ghost_veil',
    mapId: 7,
    name: '幽灵面纱',
    icon: '👻',
    color: '#4A148C',
    reqBadges: 5,
    summary: '幽灵古堡雾气弥漫，虚实界限模糊，幽灵/暗系出没率翻倍。',
    effects: {
      encounterRateMult: 1.4,
      poolBonus: { types: ['GHOST', 'DARK'], weight: 2.0 },
      hideEnemyInfo: true,
    },
    resolveEcology: { spirit: 20, stability: 15, pollution: -10 },
    counterTypes: ['FAIRY', 'DARK'],
    counterHint: '妖精系揭示真身，暗系适应幽影',
  },
  {
    id: 'aurora_storm',
    mapId: 9,
    name: '赤色极光风暴',
    icon: '🌌',
    color: '#4FC3F7',
    reqBadges: 7,
    summary: '极寒冻土极光失控，冰系精灵暴走，温度更低。',
    effects: {
      encounterRateMult: 1.25,
      poolBonus: { types: ['ICE', 'DRAGON'], weight: 1.6 },
      coldDotPct: 0.02,
    },
    resolveEcology: { stability: 20, diversity: 10, spirit: 15 },
    counterTypes: ['FIRE', 'FIGHT'],
    counterHint: '火系保暖，格斗系驱散寒气',
  },
  {
    id: 'day_night_extreme',
    mapId: 10,
    name: '昼夜温差',
    icon: '🏜️',
    color: '#FF8F00',
    reqBadges: 7,
    summary: '荒漠昼夜温差极大——白天火系增强、夜晚冰/暗系出没。',
    effects: {
      dayNight: true,
      dayFireBoost: 1.15,
      dayWaterPPCost: 1,
      nightIceDarkBoost: 1.2,
      nightPoolBonus: { types: ['ICE', 'DARK', 'GHOST'], weight: 1.5 },
    },
    resolveEcology: { stability: 20, diversity: 15, pollution: -10 },
    counterTypes: ['FIRE', 'ICE'],
    counterHint: '白天带火系，夜晚带冰/暗系应对',
  },
  {
    id: 'fairy_bloom',
    mapId: 11,
    name: '甜梦花绽',
    icon: '🌸',
    color: '#E91E63',
    reqBadges: 8,
    summary: '糖果王国花海盛开，妖精/超能系精灵活跃，睡眠效果增强。',
    effects: {
      encounterRateMult: 1.1,
      poolBonus: { types: ['FAIRY', 'PSYCHIC'], weight: 1.5 },
      sleepBonus: 0.15,
    },
    resolveEcology: { diversity: 20, spirit: 15, stability: 10 },
    counterTypes: ['STEEL', 'POISON'],
    counterHint: '钢系免疫催眠，毒系打破花粉',
  },
  {
    id: 'star_rain',
    mapId: 12,
    name: '流星坠落',
    icon: '🌠',
    color: '#7C4DFF',
    reqBadges: 9,
    summary: '银河空间站遭遇流星雨，灵压飙升，星属性精灵涌现。',
    effects: {
      encounterRateMult: 1.3,
      poolBonus: { types: ['PSYCHIC', 'FAIRY', 'DRAGON'], weight: 1.5 },
      spiritSurge: 0.1,
    },
    resolveEcology: { spirit: 25, diversity: 15 },
    counterTypes: ['DARK', 'STEEL'],
    counterHint: '暗系遮蔽星光，钢系抵御灵压',
  },
];

export function getEcoEventByMapId(mapId) {
  return ECO_EVENTS.filter(e => e.mapId === mapId);
}

export function getFirstEcoEventByMapId(mapId) {
  return ECO_EVENTS.find(e => e.mapId === mapId);
}

export function getEcoEventById(id) {
  return ECO_EVENTS.find(e => e.id === id);
}

/** 按日期+地图决定当前活跃生态事件（与生态危机已通关互斥时优先危机） */
export function getActiveEcoEventForMap(mapId, dateStr, clearedCrisisIds = [], badges = 0) {
  const mapEvents = ECO_EVENTS.filter(e => e.mapId === mapId && (badges >= (e.reqBadges || 0)));
  if (mapEvents.length === 0) return null;
  const activeCrisis = getEcoCrisisByMapId(mapId, clearedCrisisIds, badges);
  if (activeCrisis) return null;
  const parts = (dateStr || '').split('-').map(n => parseInt(n, 10) || 0);
  const daySeed = parts[2] || 1;
  const weekSeed = Math.floor((parts[0] * 100 + (parts[1] || 1)) % 7);
  const idx = (daySeed + weekSeed + mapId) % mapEvents.length;
  return mapEvents[idx];
}

export function getDefaultEcologyForMap(mapId) {
  return { ...DEFAULT_ECOLOGY, ...(MAP_DEFAULT_ECOLOGY[mapId] || {}) };
}

export function clampEcology(eco) {
  const out = { ...eco };
  ECO_METRIC_KEYS.forEach(k => {
    out[k] = Math.max(0, Math.min(100, Math.round(out[k] ?? 50)));
  });
  return out;
}

export function applyEcologyDelta(eco, delta) {
  if (!delta) return clampEcology(eco);
  const next = { ...eco };
  Object.entries(delta).forEach(([k, v]) => {
    if (ECO_METRIC_KEYS.includes(k)) next[k] = (next[k] || 50) + v;
  });
  return clampEcology(next);
}

export function getEcologyTier(eco) {
  const avg = ECO_METRIC_KEYS.reduce((s, k) => s + (eco[k] || 50), 0) / ECO_METRIC_KEYS.length;
  const pollution = eco.pollution || 30;
  if (pollution > 60) return { tier: 'polluted', label: '污染严重', color: '#C62828' };
  if (avg >= 70 && pollution < 30) return { tier: 'thriving', label: '生态繁荣', color: '#2E7D32' };
  if (avg >= 50) return { tier: 'stable', label: '生态稳定', color: '#1976D2' };
  return { tier: 'fragile', label: '生态脆弱', color: '#F57C00' };
}

/** 区域生态阶段 — 5 阶段演化 */
export const REGION_STAGE_DEFS = [
  { stage: 1, name: '异常爆发', icon: '⚠️', desc: '污染/暴走，调查与清理' },
  { stage: 2, name: '生态恢复', icon: '🌱', desc: '修复、安抚、采集' },
  { stage: 3, name: '族群重建', icon: '🐾', desc: '护送、观察、平衡' },
  { stage: 4, name: '守护觉醒', icon: '✨', desc: '高级试炼、隐藏进化' },
  { stage: 5, name: '生态稳定', icon: '🏡', desc: '稳定产出、周期事件' },
];

export const MAP_REGION_STAGES = {
  1: { crisisId: 'crisis_forest_rampage', thresholds: [0, 45, 60, 75, 85] },
  2: { crisisId: 'crisis_ghost_mist', thresholds: [0, 45, 60, 75, 88] },
  3: { crisisId: 'crisis_seal_war', thresholds: [0, 48, 62, 78, 90] },
  4: { crisisId: 'crisis_black_lake', thresholds: [0, 45, 60, 75, 85] },
  5: { crisisId: 'crisis_canyon_mine', thresholds: [0, 50, 65, 78, 88] },
  6: { crisisId: 'crisis_robot_rampage', thresholds: [0, 48, 62, 76, 86] },
  8: { crisisId: null, thresholds: [0, 50, 65, 78, 88] },
  9: { crisisId: 'crisis_red_aurora', thresholds: [0, 50, 65, 78, 88] },
  10: { crisisId: 'crisis_desert_freeze', thresholds: [0, 52, 68, 80, 90] },
  106: { crisisId: 'crisis_stellar_aurora', thresholds: [0, 55, 70, 82, 92] },
};

/** 区域连锁 — 上游事件影响下游 */
export const REGION_CHAINS = [
  { fromMap: 1, toMap: 4, condition: { pollution: { min: 55 } }, effect: { water: -10, pollution: 8 }, label: '青藤林污染未清→月影湖水质下降' },
  { fromMap: 5, toMap: 9, condition: { pollution: { min: 50 } }, effect: { spirit: -8, stability: -5 }, label: '矿场扩张→灵脉波动影响冻土' },
  { fromMap: 4, toMap: 1, condition: { water: { min: 70 }, spirit: { min: 60 } }, effect: { vegetation: 8, spirit: 5 }, label: '雾月湖祭坛修复→青藤林月眠草生长加快' },
  { fromMap: 9, toMap: 0, condition: { spirit: { min: 75 } }, effect: { spirit: 5, diversity: 3 }, label: '极光失控→全图灵气波动、多样性上升', global: true },
];

export function getRegionStage(mapId, ecology, clearedCrises = [], badges = 99) {
  const activeCrisis = getEcoCrisisByMapId(mapId, clearedCrises, badges);
  if (activeCrisis) return { stage: 1, ...REGION_STAGE_DEFS[0] };
  const cfg = MAP_REGION_STAGES[mapId];
  if (!cfg) return { stage: 3, ...REGION_STAGE_DEFS[2] };
  const avg = ECO_METRIC_KEYS.reduce((s, k) => s + (ecology?.[k] ?? 50), 0) / ECO_METRIC_KEYS.length;
  const thresholds = cfg.thresholds || [0, 45, 60, 75, 85];
  let stage = 2;
  for (let i = thresholds.length - 1; i >= 1; i--) {
    if (avg >= thresholds[i]) { stage = i + 1; break; }
  }
  const def = REGION_STAGE_DEFS[Math.min(stage - 1, REGION_STAGE_DEFS.length - 1)] || REGION_STAGE_DEFS[2];
  return { stage, ...def };
}

export function applyRegionChains(ecologyByMap, chains = REGION_CHAINS) {
  const result = { ...ecologyByMap };
  chains.forEach(chain => {
    const fromEco = result[chain.fromMap] || getDefaultEcologyForMap(chain.fromMap);
    const met = Object.entries(chain.condition || {}).every(([k, cond]) => {
      const val = fromEco[k] ?? 50;
      if (cond.min != null) return val >= cond.min;
      if (cond.max != null) return val <= cond.max;
      return true;
    });
    if (!met) return;
    if (chain.global) {
      Object.keys(result).forEach(k => {
        const mapKey = Number(k);
        if (Number.isNaN(mapKey)) return;
        const eco = { ...(result[mapKey] || getDefaultEcologyForMap(mapKey)) };
        Object.entries(chain.effect || {}).forEach(([ek, ev]) => {
          if (ECO_METRIC_KEYS.includes(ek)) eco[ek] = (eco[ek] || 50) + ev;
        });
        result[mapKey] = clampEcology(eco);
      });
      return;
    }
    const toEco = { ...(result[chain.toMap] || getDefaultEcologyForMap(chain.toMap)) };
    Object.entries(chain.effect || {}).forEach(([k, v]) => {
      if (ECO_METRIC_KEYS.includes(k)) toEco[k] = (toEco[k] || 50) + v;
    });
    result[chain.toMap] = clampEcology(toEco);
  });
  return result;
}
