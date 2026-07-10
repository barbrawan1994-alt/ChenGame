let caughtPetUidCounter = 0;

export function createCaughtPetUid(now = Date.now, random = Math.random) {
  caughtPetUidCounter = (caughtPetUidCounter + 1) % 1000000;
  const timestamp = Number(now()) || Date.now();
  const randomPart = Math.floor(Math.max(0, Math.min(0.999999999, random())) * 0xFFFFFF)
    .toString(36)
    .padStart(5, '0');
  return `caught_${timestamp}_${caughtPetUidCounter}_${randomPart}`;
}

export function syncMovesFromCombat(moves = [], combatMoves = []) {
  return (moves || []).map(move => {
    const combatMove = (combatMoves || []).find(candidate => candidate?.name === move?.name && !candidate?.isExtra);
    return combatMove ? { ...move, pp: combatMove.pp } : { ...move };
  });
}

export function prepareCaughtPet(enemy, options = {}) {
  if (!enemy) return null;
  const { now = Date.now, random = Math.random } = options;
  const caughtPet = {
    ...enemy,
    uid: createCaughtPetUid(now, random),
    isBoss: false,
    ivs: { ...(enemy.ivs || {}) },
    evs: { ...(enemy.evs || {}) },
    moves: syncMovesFromCombat(enemy.moves, enemy.combatMoves),
  };

  [
    'combatMoves', 'stages', 'volatiles', '_stats', '_maxHp', 'maxHp',
    'isProtected', 'lastMoveUsed', 'flinched', 'devilFruit', 'fruitUsed',
    'fruitTransformed', 'fruitTurnsLeft', 'fruitEffects', 'transformedStats',
    'originalStats', 'fruitForm', '_battleOnly', 'customStatMult',
  ].forEach(key => delete caughtPet[key]);

  return caughtPet;
}

export function syncPartyBattleResources(party = [], combatStates = []) {
  return (party || []).map((pet, index) => {
    const combatState = combatStates?.[index];
    if (!combatState) return pet;
    return {
      ...pet,
      currentHp: combatState.currentHp,
      status: combatState.status || null,
      moves: syncMovesFromCombat(pet.moves, combatState.combatMoves),
    };
  });
}

export function selectContestSpecies(pool = [], lastSpecies = null, random = Math.random) {
  const validPool = [...new Set((pool || []).filter(id => id !== null && id !== undefined))];
  if (validPool.length === 0) return null;
  const candidates = validPool.length > 1
    ? validPool.filter(id => id !== lastSpecies)
    : validPool;
  const roll = Math.max(0, Math.min(0.999999999, random()));
  return candidates[Math.floor(roll * candidates.length)] ?? candidates[0];
}
