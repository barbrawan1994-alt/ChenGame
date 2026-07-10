export function calculatePetGrade(pet, dependencies = {}) {
  if (!pet) return { grade: 'B', score: 0, leftAvg: 0, rightAvg: 0 };

  const { pokedex = [], typeBias = {}, getStats } = dependencies;
  const baseInfo = pokedex.find(candidate => candidate.id === pet.id) || pokedex[0] || {};
  const bias = typeBias[baseInfo.type] || { p: 1.0, s: 1.0 };
  const diversity = pet.diversityRng !== undefined
    ? pet.diversityRng
    : ((baseInfo.id || 0) % 5) * 2 - 4;

  const getBase = key => {
    if (key === 'hp') return baseInfo.hp || 60;
    if (key === 'spd') return baseInfo.spd || (40 + ((baseInfo.id || 0) * 7 % 70));
    const baseAttack = baseInfo.atk || 50;
    const baseDefense = baseInfo.def || 50;
    if (key === 'p_atk') return Math.floor(baseAttack * bias.p) + diversity;
    if (key === 'p_def') return Math.floor(baseDefense * bias.p);
    if (key === 's_atk') return Math.floor(baseAttack * bias.s) - diversity;
    if (key === 's_def') return Math.floor(baseDefense * bias.s);
    return 50;
  };

  const keys = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
  const currentStats = typeof getStats === 'function' ? getStats(pet) : {};
  const growth = 1 + (pet.level || 1) * 0.05;
  let totalLeftPct = 0;
  let totalRightPct = 0;

  keys.forEach(key => {
    let maxStat = (getBase(key) + 31) * growth;
    if (key === 'hp') maxStat *= 2.5;
    const currentStat = key === 'hp' ? currentStats.maxHp : currentStats[key];
    totalLeftPct += Number.isFinite(currentStat) && maxStat > 0
      ? Math.min(1, currentStat / maxStat)
      : 0;
    totalRightPct += (pet.ivs?.[key] || 0) / 31;
  });

  const leftAvg = (totalLeftPct / keys.length) * 100;
  const rightAvg = (totalRightPct / keys.length) * 100;
  const finalScore = rightAvg;

  let grade = 'C';
  if (finalScore >= 80) grade = 'S';
  else if (finalScore >= 50) grade = 'A';
  else if (finalScore >= 30) grade = 'B';

  return { grade, score: finalScore, leftAvg, rightAvg };
}
