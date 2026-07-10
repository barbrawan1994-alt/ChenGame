export function getPostMoveResolution(party = []) {
  const pendingIndex = (party || []).findIndex(pet => pet?.pendingLearnMove);
  if (pendingIndex >= 0) {
    return {
      view: 'move_forget',
      pendingIndex,
      pendingMove: party[pendingIndex].pendingLearnMove,
    };
  }

  if ((party || []).some(pet => pet?.canEvolve)) {
    return { view: 'team', pendingIndex: null, pendingMove: null };
  }

  return { view: 'grid_map', pendingIndex: null, pendingMove: null };
}

const normalizeEnvironmentValue = value => String(value || '').trim().toUpperCase();

export function evolutionConditionMatches(condition, pet = {}, context = {}) {
  if (!condition) return true;

  const requiredTime = normalizeEnvironmentValue(condition.time);
  const currentTime = normalizeEnvironmentValue(context.timePhase);
  if (requiredTime && requiredTime !== currentTime) return false;

  const requiredWeather = normalizeEnvironmentValue(condition.weather);
  const currentWeather = normalizeEnvironmentValue(context.weather);
  if (requiredWeather && requiredWeather !== currentWeather) return false;

  if (condition.intimacy != null && (Number(pet.intimacy) || 0) < Number(condition.intimacy)) {
    return false;
  }

  if (condition.item) {
    if (!context.allowItem) return false;
    const requiredItems = Array.isArray(condition.item) ? condition.item : [condition.item];
    if (!context.itemId || !requiredItems.includes(context.itemId)) return false;
  }

  return true;
}

export function getEvolutionReadiness(pet, pokedex = [], context = {}) {
  if (!pet || pet.isFusion) {
    return { ready: false, targetId: null, source: null, target: null, condition: null };
  }

  const source = pokedex.find(entry => entry.id === pet.id) || null;
  const defaultTargetId = source ? (source.evo ?? null) : (pet.evo ?? null);
  if (!source || !defaultTargetId) {
    return { ready: false, targetId: defaultTargetId, source, target: null, condition: null };
  }

  const requiredLevel = Number(source.evoLvl ?? pet.evoLvl ?? 30);
  let selectedAlt = null;
  for (const alternate of source.evoAlt || []) {
    if (evolutionConditionMatches(alternate.condition, pet, context)) {
      selectedAlt = alternate;
      break;
    }
  }

  const targetId = selectedAlt?.target ?? defaultTargetId;
  const target = pokedex.find(entry => entry.id === targetId) || null;
  const condition = selectedAlt?.condition || source.evoCondition || target?.evoCondition || null;
  const levelReady = (Number(pet.level) || 0) >= requiredLevel;
  const conditionReady = evolutionConditionMatches(condition, pet, context);

  return {
    ready: Boolean(levelReady && target && conditionReady),
    targetId,
    source,
    target,
    condition,
    requiredLevel,
  };
}

export function refreshPetEvolution(pet, pokedex = [], context = {}) {
  if (!pet || typeof pet !== 'object') return pet;
  const readiness = getEvolutionReadiness(pet, pokedex, context);
  const authoritativeEvo = readiness.source ? (readiness.source.evo ?? null) : (pet.evo ?? null);
  const nextEvo = readiness.targetId ?? authoritativeEvo;
  const nextEvoLvl = readiness.source ? (readiness.source.evoLvl ?? null) : (pet.evoLvl ?? null);
  const nextCanEvolve = readiness.ready;
  const nextIsEvolved = readiness.source ? !nextEvo : Boolean(pet.isEvolved);

  if (
    pet.evo === nextEvo
    && pet.evoLvl === nextEvoLvl
    && Boolean(pet.canEvolve) === nextCanEvolve
    && Boolean(pet.isEvolved) === nextIsEvolved
  ) {
    return pet;
  }

  return {
    ...pet,
    evo: nextEvo,
    evoLvl: nextEvoLvl,
    canEvolve: nextCanEvolve,
    isEvolved: nextIsEvolved,
  };
}

export function refreshEvolutionRoster(roster = [], pokedex = [], context = {}) {
  let changed = false;
  const next = (roster || []).map(pet => {
    const refreshed = refreshPetEvolution(pet, pokedex, context);
    if (refreshed !== pet) changed = true;
    return refreshed;
  });
  return changed ? next : roster;
}

export function getStoryObjective(chapter, currentMapId, storyStep, gymPosition) {
  if (!chapter || chapter.mapId !== currentMapId) return null;
  const task = (chapter.tasks || []).find(candidate => candidate.step === storyStep);
  if (task) return { kind: 'task', ...task };

  const tasks = chapter.tasks || [];
  const maxStep = tasks.reduce((max, candidate) => Math.max(max, candidate.step ?? -1), -1);
  if (tasks.length > 0 && storyStep > maxStep) {
    return {
      kind: 'gym',
      name: '挑战道馆馆主',
      x: gymPosition?.x,
      y: gymPosition?.y,
    };
  }

  return null;
}
