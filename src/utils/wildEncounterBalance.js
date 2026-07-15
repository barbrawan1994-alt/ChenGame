const toSafeInt = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : fallback;
};

export const balanceEarlyWildLevel = ({
  rolledLevel,
  mapId,
  badgeCount,
  battlesWon,
  partyLevels,
  mapMinLevel,
} = {}) => {
  const rolled = Math.max(1, toSafeInt(rolledLevel, 1));
  const wins = toSafeInt(battlesWon);
  if (Number(mapId) !== 1 || toSafeInt(badgeCount) > 0 || wins >= 3) return rolled;

  const levels = (Array.isArray(partyLevels) ? partyLevels : [])
    .map(level => toSafeInt(level))
    .filter(level => level > 0);
  const partyMax = levels.length > 0 ? Math.max(...levels) : 1;
  const mapFloor = Math.max(1, toSafeInt(mapMinLevel, 1));
  const winAllowance = wins === 0 ? -1 : 0;
  const earlyCap = Math.max(mapFloor, partyMax + winAllowance);
  return Math.min(rolled, earlyCap);
};

export const filterFirstWinWildCandidates = ({
  candidates,
  mapId,
  badgeCount,
  battlesWon,
  playerMoveTypes,
  playerUnit,
  getMultiplier,
} = {}) => {
  const source = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
  if (Number(mapId) !== 1 || toSafeInt(badgeCount) > 0 || toSafeInt(battlesWon) > 0) return source;
  if (!Array.isArray(playerMoveTypes) || playerMoveTypes.length === 0 || typeof getMultiplier !== 'function') return source;

  const fair = source.filter((candidate) => {
    const playerHasAnswer = playerMoveTypes.some(type => getMultiplier(type, candidate) >= 1);
    const candidateTypes = [candidate.type, candidate.secondaryType || candidate.type2].filter(Boolean);
    const enemyHasOpeningAdvantage = candidateTypes.some(type => getMultiplier(type, playerUnit) > 1);
    return playerHasAnswer && !enemyHasOpeningAdvantage;
  });
  return fair.length > 0 ? fair : source;
};
