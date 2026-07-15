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
