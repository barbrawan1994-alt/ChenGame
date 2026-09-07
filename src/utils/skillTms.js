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
