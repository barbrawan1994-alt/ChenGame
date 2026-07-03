/** 鬼雾山夜行 — 第二跨体系样板章节（呼吸法/夜战/鬼化/封印） */

export const GHOST_CHAPTER_ID = 'crisis_ghost_mist';

export const GHOST_VARS_DEFAULT = {
  villagerMorale: 50,
  ghostPollution: 30,
  lightCoverage: 25,
  sectTension: 40,
  nightIntensity: 35,
  borderSecurity: 30,
};

export const GHOST_VAR_LABELS = {
  villagerMorale: { label: '村民士气', icon: '🏘️' },
  ghostPollution: { label: '鬼化污染', icon: '👹' },
  lightCoverage: { label: '光源覆盖', icon: '💡' },
  sectTension: { label: '门派分歧', icon: '⚡' },
  nightIntensity: { label: '夜战强度', icon: '🌙' },
  borderSecurity: { label: '边境安定', icon: '🛡️' },
};

export const GHOST_REGIONS = {
  village: { name: '雾隐村', icon: '🏘️' },
  trail: { name: '山间小径', icon: '🌲' },
  shrine: { name: '黄昏神社', icon: '⛩️' },
  mist_peak: { name: '鬼雾山', icon: '🌫️' },
  oni_lair: { name: '鬼巢', icon: '👹' },
};

export function clampGhostVar(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function applyGhostVarDelta(vars = {}, delta = {}) {
  const next = { ...GHOST_VARS_DEFAULT, ...vars };
  Object.entries(delta).forEach(([k, d]) => {
    if (next[k] != null && typeof d === 'number') next[k] = clampGhostVar(next[k] + d);
  });
  return next;
}

export function getGhostBossModifiers(vars = {}, routeId, branchId) {
  const v = { ...GHOST_VARS_DEFAULT, ...vars };
  let bossMult = 1;
  const skipMechanics = [];
  if (v.ghostPollution >= 60) bossMult += 0.08;
  if (v.lightCoverage >= 50) bossMult -= 0.06;
  if (v.villagerMorale >= 55) skipMechanics.push('blood_mist');
  if (routeId === 'purify_path' && branchId === 'heal') bossMult -= 0.08;
  if (routeId === 'shadow_path') bossMult += 0.05;
  bossMult = Math.max(0.78, Math.min(1.18, bossMult));
  return { bossMult, skipMechanics, spawnAdds: v.nightIntensity >= 70 ? 1 : 0 };
}

export function resolveGhostEnding(endings = [], { routeId, branchId, vars = {} }) {
  const v = { ...GHOST_VARS_DEFAULT, ...vars };
  const pick = (id) => endings.find(e => e.id === id);

  if (routeId === 'shadow_path' && branchId === 'fight' && v.ghostPollution >= 55) {
    return pick('dark_purge') || pick('seal_end');
  }
  if (routeId === 'purify_path' && (branchId === 'heal' || branchId === 'soothe') && v.ghostPollution <= 35 && v.villagerMorale >= 45) {
    return pick('best_purify');
  }
  if (routeId === 'soothe_path' || (branchId === 'soothe' && v.villagerMorale >= 50)) {
    return pick('soothe_end');
  }
  if (routeId === 'purify_path') return pick('seal_end');
  return pick('seal_end') || endings[0];
}

export function getGhostRegionLabel(regionId) {
  const r = GHOST_REGIONS[regionId];
  return r ? `${r.icon} ${r.name}` : null;
}

export function getGhostStepUnlocks(step, vars = {}) {
  const unlocks = [];
  if (step?.region === 'shrine') unlocks.push('breathing_scroll_water');
  if (step?.region === 'mist_peak') unlocks.push('breathing_scroll_mist');
  if (step?.region === 'oni_lair' && vars.lightCoverage >= 40) unlocks.push('sun_steel_fragment');
  return unlocks;
}
