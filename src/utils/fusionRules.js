export function canUseAsFusionMaterial(pet) {
  return Boolean(pet && !pet.isFusion && !pet.isFusedShiny);
}

export function getFusionShinyChance(parentA, parentB) {
  if (!parentA || !parentB) return 0;
  const normalizeLevel = value => Math.max(1, Math.min(100, Number(value) || 1));
  const averageLevel = Math.floor((normalizeLevel(parentA.level) + normalizeLevel(parentB.level)) / 2);
  const shinyParentBonus = [parentA, parentB]
    .filter(parent => parent.isShiny || parent.isFusedShiny)
    .length * 0.1;
  const levelBonus = Math.min(0.15, averageLevel * 0.002);
  return Math.min(0.5, 0.15 + shinyParentBonus + levelBonus);
}
