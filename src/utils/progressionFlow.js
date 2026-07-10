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
