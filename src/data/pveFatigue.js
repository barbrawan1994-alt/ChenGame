/** PVE 疲劳系统已停用，保留接口避免旧存档和界面引用出错。 */

export const FATIGUE_CONFIG = {
  maxFatigue: 0,
  perBattle: 0,
  perBossBattle: 0,
  perInfinityFloor: 0,
  restAtCenter: 0,
  restItemReduction: 25,
  refuseThreshold: Infinity,
  speedPenaltyPer20: 0,
  maxSpeedPenalty: 0,
};

export function getPetFatigue(pet) {
  return 0;
}

export function addFatigue(pet, amount) {
  return 0;
}

export function reduceFatigue(pet, amount) {
  return 0;
}

export function getFatigueSpeedMult(pet) {
  return 1;
}

export function canPetBattle(pet) {
  return true;
}

export function getFatigueLabel(fatigue) {
  return { label: '精神', color: '#2E7D32' };
}
