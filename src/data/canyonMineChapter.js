/** 赤砂峡谷矿场危机 — 完整章节变量 / 区域 / 结局 / Boss 反馈 */

export const CANYON_CHAPTER_ID = 'crisis_canyon_mine';

export const CANYON_VARS_DEFAULT = {
  mineStability: 40,
  rhinoTrust: 10,
  ecoValue: 35,
  blackMarket: 60,
  kwArsenal: 30,
  relicAwakening: 20,
};

export const CANYON_VAR_LABELS = {
  mineStability: { label: '矿场稳定度', icon: '⛏️' },
  rhinoTrust: { label: '岩甲犀信任', icon: '🦏' },
  ecoValue: { label: '赤砂生态值', icon: '🌿' },
  blackMarket: { label: '黑市活跃度', icon: '🕶️' },
  kwArsenal: { label: '国家军备值', icon: '⚔️' },
  relicAwakening: { label: '遗迹苏醒度', icon: '🗿' },
};

/** 9 个核心区域 — 用于步骤 UI 标注，非独立地图 */
export const CANYON_REGIONS = {
  road: { name: '沙暴商路', icon: '🏜️' },
  sun_station: { name: '烈日驿站', icon: '☀️' },
  mine: { name: '商会矿场', icon: '⛏️' },
  nest: { name: '岩甲犀旧巢', icon: '🦏' },
  sand_cave: { name: '流沙洞窟', icon: '🌀' },
  black_market: { name: '黑市营地', icon: '🕶️' },
  ancient_ruins: { name: '古战残垣', icon: '⚔️' },
  fruit_garden: { name: '恶魔果实残园', icon: '🍎' },
  relic_core: { name: '砂核遗迹', icon: '🗿' },
};

export function clampCanyonVar(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function applyCanyonVarDelta(vars = {}, delta = {}) {
  const next = { ...CANYON_VARS_DEFAULT, ...vars };
  Object.entries(delta).forEach(([k, d]) => {
    if (next[k] != null && typeof d === 'number') next[k] = clampCanyonVar(next[k] + d);
  });
  return next;
}

/** 根据章节变量计算 Boss 额外修正（上限 ±0.12 mult，防膨胀） */
export function getCanyonBossModifiers(vars = {}, routeId, branchId) {
  const v = { ...CANYON_VARS_DEFAULT, ...vars };
  let bossMult = 1;
  const skipMechanics = [];
  let extraSpawnAdds = 0;

  if (v.relicAwakening >= 70) bossMult += 0.08;
  else if (v.relicAwakening <= 30) bossMult -= 0.05;

  if (v.blackMarket >= 70) extraSpawnAdds = 1;
  if (v.blackMarket <= 30) skipMechanics.push('sand_quicksand');

  if (v.rhinoTrust >= 50) {
    bossMult -= 0.06;
    skipMechanics.push('rock_armor');
  } else if (v.rhinoTrust <= 20) bossMult += 0.05;

  if (v.mineStability >= 60) skipMechanics.push('core_rampage');

  if (routeId === 'mediate' && v.rhinoTrust >= 40 && v.mineStability >= 35) {
    bossMult -= 0.08;
    skipMechanics.push('gravity_field');
  }

  if (branchId === 'relocate' && v.ecoValue >= 40) bossMult -= 0.04;

  bossMult = Math.max(0.75, Math.min(1.2, bossMult));
  return {
    bossMult,
    skipMechanics,
    spawnAdds: extraSpawnAdds,
  };
}

/** 结局优先级：暗化 > 调停 > 精灵守护 > 商会胜利 */
export function resolveCanyonEnding(endings = [], { routeId, branchId, vars = {} }) {
  const v = { ...CANYON_VARS_DEFAULT, ...vars };
  const pick = (id) => endings.find(e => e.id === id);

  if (
    (routeId === 'help_merchant' && branchId === 'fight' && v.relicAwakening >= 65) ||
    (v.relicAwakening >= 80 && v.rhinoTrust <= 15 && v.blackMarket >= 50)
  ) {
    return pick('dark_end') || pick('merchant_win');
  }

  if (
    routeId === 'mediate' &&
    (branchId === 'relocate' || branchId === 'soothe') &&
    v.rhinoTrust >= 35 &&
    v.mineStability >= 30 &&
    v.blackMarket <= 45
  ) {
    return pick('best_end');
  }

  if (routeId === 'help_beasts' || (v.rhinoTrust >= 55 && branchId === 'soothe')) {
    return pick('beast_win');
  }

  if (routeId === 'help_merchant') {
    return pick('merchant_win');
  }

  return pick('merchant_win') || pick('beast_win') || endings[0];
}

export function getCanyonStepVarDelta(step) {
  return step?.varDelta || null;
}

export function getCanyonRegionLabel(regionId) {
  const r = CANYON_REGIONS[regionId];
  return r ? `${r.icon} ${r.name}` : null;
}

/** 步骤完成时的融合奖励线索（写入 fusionState，非战斗数值） */
export function getCanyonStepUnlocks(step, vars = {}) {
  const unlocks = [];
  if (step?.region === 'ancient_ruins') unlocks.push('general_fragment_zhao_yun');
  if (step?.region === 'fruit_garden' && vars.ecoValue >= 30) unlocks.push('fruit_clue_sand');
  if (step?.region === 'fruit_garden' && vars.relicAwakening >= 40) unlocks.push('fruit_clue_gravity');
  if (step?.region === 'black_market') unlocks.push('black_market_ledger');
  return unlocks;
}
