export function buildSkillTmCatalog(tms, skillDb) {
  const skills = Object.entries(skillDb).flatMap(([type, moves]) => moves.map(move => ({ ...move, type: move.t || type })));
  const keyOf = move => `${move.type}_${move.name}`;
  const byKey = new Map(skills.map(move => [keyOf(move), move]));
  const existing = new Set(tms.map(keyOf));
  const generated = skills.filter(move => move.type !== 'GOD' && !existing.has(keyOf(move))).map(move => {
    const power = move.p || 0;
    const tier = power < 70 ? 1 : power < 130 ? 2 : 3;
    const price = power === 0 ? 1500 : power < 70 ? 2000 : power < 100 ? 3500 : power < 130 ? 5500 : power < 160 ? 8000 : 12000;
    return { ...move, id: `tmg_${move.type}_${move.name}`, tier, price, shopSell: power <= 70 };
  });
  return [...tms.map(tm => ({ ...byKey.get(keyOf(tm)), ...tm })), ...generated];
}

export function buildMoveFromTm(tm) {
  const { id, tier, price, shopSell, type, ...move } = tm;
  return { ...move, t: type, maxPP: tm.pp };
}

export function getMapShopTMs(catalog, mapId, tierLevel, limit = 8) {
  const eligible = catalog.filter(tm => tm.shopSell && tm.tier <= tierLevel);
  if (eligible.length <= limit) return eligible.map(tm => tm.id);
  let seed = Math.imul(Number(mapId) || 1, 2654435761) >>> 0;
  const next = size => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return Math.floor(seed / 4294967296 * size);
  };
  const byType = new Map();
  eligible.forEach(tm => byType.set(tm.type, [...(byType.get(tm.type) || []), tm]));
  const groups = [...byType.values()];
  // Shuffle the element order too, so later catalog types can reach the shelf.
  for (let i = groups.length - 1; i > 0; i--) {
    const j = next(i + 1);
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  const selected = groups.slice(0, limit).map(group => group[next(group.length)].id);
  const remaining = eligible.filter(tm => !selected.includes(tm.id));
  while (selected.length < limit && remaining.length) selected.push(remaining.splice(next(remaining.length), 1)[0].id);
  return selected;
}
