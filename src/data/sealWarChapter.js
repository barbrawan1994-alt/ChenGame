/** 忍界封印战 — 第三跨体系样板章节（忍术/查克拉/封印/尾兽级Boss/国战） */

export const SEAL_CHAPTER_ID = 'crisis_seal_war';

export const SEAL_VARS_DEFAULT = {
  sealIntegrity: 40,
  chakraReserve: 30,
  calamityPower: 45,
  nationCoord: 25,
  relicDecode: 20,
  civilianSafety: 50,
};

export const SEAL_VAR_LABELS = {
  sealIntegrity: { label: '封印完整度', icon: '⛩️' },
  chakraReserve: { label: '查克拉储备', icon: '💧' },
  calamityPower: { label: '灾厄强度', icon: '💀' },
  nationCoord: { label: '国家协调', icon: '🏴' },
  relicDecode: { label: '遗迹解读', icon: '🔬' },
  civilianSafety: { label: '居民安全', icon: '🏘️' },
};

export const SEAL_REGIONS = {
  outer_gate: { name: '外城结界门', icon: '🚪' },
  chakra_well: { name: '查克拉古井', icon: '💧' },
  clone_hall: { name: '分身大厅', icon: '👥' },
  relic_lab: { name: '遗迹研究室', icon: '🔬' },
  seal_array: { name: '封印大阵', icon: '⛩️' },
  core_chamber: { name: '灾厄核心室', icon: '💀' },
};

export function clampSealVar(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function applySealVarDelta(vars = {}, delta = {}) {
  const next = { ...SEAL_VARS_DEFAULT, ...vars };
  Object.entries(delta).forEach(([k, d]) => {
    if (next[k] != null && typeof d === 'number') next[k] = clampSealVar(next[k] + d);
  });
  return next;
}

export function getSealBossModifiers(vars = {}, routeId, branchId) {
  const v = { ...SEAL_VARS_DEFAULT, ...vars };
  let bossMult = 1;
  const skipMechanics = [];
  let spawnAdds = 0;

  if (v.calamityPower >= 60) {
    bossMult += 0.08;
    spawnAdds = 1;
  } else if (v.calamityPower <= 35) bossMult -= 0.05;

  if (v.chakraReserve >= 50) bossMult -= 0.06;
  if (v.nationCoord >= 40) bossMult -= 0.04;
  if (v.sealIntegrity >= 55) skipMechanics.push('core_rampage');
  if (v.sealIntegrity >= 45) skipMechanics.push('tail_flame');

  if (routeId === 'full_seal' && branchId === 'heal') bossMult -= 0.08;
  if (routeId === 'nation_coord' && v.nationCoord >= 35) bossMult -= 0.05;
  if (routeId === 'weaken_first' && branchId === 'fight') bossMult += 0.05;

  bossMult = Math.max(0.75, Math.min(1.2, bossMult));
  return { bossMult, skipMechanics, spawnAdds };
}

export function resolveSealEnding(endings = [], { routeId, branchId, vars = {} }) {
  const v = { ...SEAL_VARS_DEFAULT, ...vars };
  const pick = (id) => endings.find(e => e.id === id);

  if (
    routeId === 'weaken_first' &&
    branchId === 'fight' &&
    v.calamityPower >= 60
  ) {
    return pick('break_free') || pick('containment');
  }

  if (
    routeId === 'full_seal' &&
    branchId === 'heal' &&
    v.sealIntegrity >= 55 &&
    v.nationCoord >= 40
  ) {
    return pick('perfect_seal');
  }

  if (
    routeId === 'weaken_first' &&
    (branchId === 'soothe' || branchId === 'heal') &&
    v.calamityPower <= 35
  ) {
    return pick('capture_core');
  }

  if (routeId === 'full_seal') return pick('containment');
  if (routeId === 'nation_coord') return pick('containment');
  return pick('containment') || endings[0];
}

export function getSealRegionLabel(regionId) {
  const r = SEAL_REGIONS[regionId];
  return r ? `${r.icon} ${r.name}` : null;
}

export function getSealStepUnlocks(step, vars = {}) {
  const unlocks = [];
  if (step?.region === 'relic_lab') unlocks.push('seal_scroll_fragment');
  if (step?.region === 'chakra_well' && vars.chakraReserve >= 40) unlocks.push('chakra_node_upgrade');
  if (step?.region === 'seal_array' && vars.sealIntegrity >= 45) unlocks.push('advanced_seal_hint');
  if (step?.region === 'core_chamber' && vars.relicDecode >= 35) unlocks.push('calamity_core_data');
  return unlocks;
}
