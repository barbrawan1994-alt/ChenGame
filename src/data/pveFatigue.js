/** PVE 疲劳系统 — 鼓励多队伍轮换 */

export const FATIGUE_CONFIG = {
  maxFatigue: 100,
  perBattle: 5,
  perBossBattle: 12,
  perInfinityFloor: 6,
  restAtCenter: -50,
  restItemReduction: 25,
  refuseThreshold: 95,
  speedPenaltyPer20: 0.02,
  maxSpeedPenalty: 0.10,
};

export function getPetFatigue(pet) {
  return Math.max(0, Math.min(FATIGUE_CONFIG.maxFatigue, pet?.fatigue || 0));
}

export function addFatigue(pet, amount) {
  const cur = getPetFatigue(pet);
  return Math.min(FATIGUE_CONFIG.maxFatigue, cur + amount);
}

export function reduceFatigue(pet, amount) {
  return Math.max(0, getPetFatigue(pet) - amount);
}

export function getFatigueSpeedMult(pet) {
  const f = getPetFatigue(pet);
  const penalty = Math.floor(f / 20) * FATIGUE_CONFIG.speedPenaltyPer20;
  return Math.max(1 - FATIGUE_CONFIG.maxSpeedPenalty, 1 - penalty);
}

export function canPetBattle(pet) {
  return getPetFatigue(pet) < FATIGUE_CONFIG.refuseThreshold;
}

export function getFatigueLabel(fatigue) {
  if (fatigue >= FATIGUE_CONFIG.refuseThreshold) return { label: '精疲力竭', color: '#C62828' };
  if (fatigue >= 70) return { label: '疲惫', color: '#F57C00' };
  if (fatigue >= 40) return { label: '略疲', color: '#FBC02D' };
  return { label: '精神', color: '#2E7D32' };
}
