export function normalizeCombatTargets(targets, fallbackIdx) {
  const targetList = Array.isArray(targets)
    ? targets
    : targets?.unit
      ? [targets]
      : [{ unit: targets, idx: fallbackIdx }];

  return targetList.filter(target => target?.unit && target.unit.currentHp > 0);
}
