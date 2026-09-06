const DEFAULT_EXCLUDED_TYPES = ['GOD', 'COSMIC'];

export const getStarterBaseStatTotal = (pet, typeBias = {}) => {
  const bias = typeBias[pet?.type] || { p: 1, s: 1 };
  const diversity = (Number(pet?.id) % 5) * 2 - 4;
  const hp = Number(pet?.hp) || 60;
  const atk = Number(pet?.atk) || 50;
  const def = Number(pet?.def) || 50;
  const spd = Number(pet?.spd) || (40 + (Number(pet?.id) * 7 % 70));
  return hp
    + Math.floor(atk * bias.p) + diversity
    + Math.floor(def * bias.p)
    + Math.floor(atk * bias.s) - diversity
    + Math.floor(def * bias.s)
    + spd;
};

const shuffleWith = (items, random) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const buildStarterCatalog = ({
  pokedex = [],
  stoneEvolutionRules = {},
  excludedIds = [],
  excludedTypes = DEFAULT_EXCLUDED_TYPES,
  typeBias = {},
  maxBaseStatTotal = 500,
} = {}) => {
  const evolvedIds = new Set();
  pokedex.forEach((pet) => {
    if (pet?.evo) evolvedIds.add(Number(pet.evo));
  });
  Object.values(stoneEvolutionRules || {}).forEach((rules) => {
    Object.values(rules || {}).forEach((targetId) => evolvedIds.add(Number(targetId)));
  });

  const blockedIds = new Set(excludedIds.map(Number));
  const blockedTypes = new Set(excludedTypes);
  const seenIds = new Set();

  return pokedex
    .filter((pet) => {
      const id = Number(pet?.id);
      if (!Number.isFinite(id) || id <= 0 || seenIds.has(id)) return false;
      if (pet.hidden || pet.starterExcluded || !pet.name || pet.name === '未发现') return false;
      if (evolvedIds.has(id) || blockedIds.has(id)) return false;
      if (blockedTypes.has(pet.type) || blockedTypes.has(pet.type2)) return false;
      if (Number.isFinite(maxBaseStatTotal) && getStarterBaseStatTotal(pet, typeBias) > maxBaseStatTotal) return false;
      seenIds.add(id);
      return true;
    })
    .sort((a, b) => Number(a.id) - Number(b.id));
};

export const filterStarterCatalog = (catalog, search = '', type = 'ALL') => {
  const keyword = String(search).trim().toLocaleLowerCase();
  return (catalog || []).filter((pet) => {
    const matchesType = type === 'ALL' || pet.type === type || pet.type2 === type;
    if (!matchesType) return false;
    if (!keyword) return true;
    const paddedId = String(pet.id).padStart(3, '0');
    return String(pet.name).toLocaleLowerCase().includes(keyword)
      || String(pet.id).includes(keyword)
      || paddedId.includes(keyword.replace(/^#/, ''));
  });
};

export const buildBalancedStarterPool = (
  catalog,
  { typeBias = {}, minBaseStatTotal = 310, maxBaseStatTotal = 370 } = {},
) => (catalog || []).filter((pet) => {
  const total = getStarterBaseStatTotal(pet, typeBias);
  return total >= minBaseStatTotal && total <= maxBaseStatTotal;
});

export const sampleDiverseStarters = (catalog, count = 5, previousIds = [], random = Math.random) => {
  if (!Array.isArray(catalog) || catalog.length === 0 || count <= 0) return [];

  const previous = new Set(previousIds.map(Number));
  const fresh = catalog.filter((pet) => !previous.has(Number(pet.id)));
  const source = fresh.length >= count ? fresh : catalog;
  const groups = new Map();

  source.forEach((pet) => {
    const key = pet.type || 'NORMAL';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(pet);
  });

  const selected = [];
  shuffleWith([...groups.keys()], random).forEach((type) => {
    if (selected.length >= count) return;
    const group = groups.get(type);
    selected.push(group[Math.floor(random() * group.length)]);
  });

  if (selected.length < count) {
    const selectedIds = new Set(selected.map((pet) => Number(pet.id)));
    const remainder = shuffleWith(source.filter((pet) => !selectedIds.has(Number(pet.id))), random);
    selected.push(...remainder.slice(0, count - selected.length));
  }

  return selected.slice(0, count);
};

export const getStarterCombatScore = (stats = {}) => (
  ['maxHp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd']
    .reduce((sum, key) => sum + Math.max(0, Number(stats[key]) || 0), 0)
);

export const selectCombatBalancedStarters = (
  candidates,
  count = 5,
  { getStats, maxSpreadRatio = 0.12, random = Math.random } = {},
) => {
  if (!Array.isArray(candidates) || candidates.length === 0 || count <= 0) return [];
  if (typeof getStats !== 'function') return sampleDiverseStarters(candidates, count, [], random);

  const scored = candidates
    .map((pet) => ({ pet, score: getStarterCombatScore(getStats(pet)) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => a.score - b.score);
  if (scored.length <= count) return scored.map(({ pet }) => pet);

  let left = 0;
  let bestBand = null;
  for (let right = 0; right < scored.length; right += 1) {
    while (left < right && scored[right].score > scored[left].score * (1 + maxSpreadRatio)) left += 1;
    const band = scored.slice(left, right + 1);
    if (band.length < count) continue;
    const typeCount = new Set(band.map(({ pet }) => pet.type || 'NORMAL')).size;
    if (!bestBand || typeCount > bestBand.typeCount || (typeCount === bestBand.typeCount && band.length > bestBand.items.length)) {
      bestBand = { items: band, typeCount };
    }
  }

  if (!bestBand) {
    let tightest = scored.slice(0, count);
    let tightestRatio = tightest[tightest.length - 1].score / tightest[0].score;
    for (let start = 1; start <= scored.length - count; start += 1) {
      const window = scored.slice(start, start + count);
      const ratio = window[window.length - 1].score / window[0].score;
      if (ratio < tightestRatio) {
        tightest = window;
        tightestRatio = ratio;
      }
    }
    bestBand = { items: tightest, typeCount: new Set(tightest.map(({ pet }) => pet.type || 'NORMAL')).size };
  }

  return sampleDiverseStarters(bestBand.items.map(({ pet }) => pet), count, [], random);
};
