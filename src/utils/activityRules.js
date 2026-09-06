export function getWheelStopRotation(previous, prizeIndex, prizeCount) {
  const target = (360 - (prizeIndex + 0.5) * 360 / prizeCount) % 360;
  const current = ((previous % 360) + 360) % 360;
  return previous + 360 * 5 + (target - current + 360) % 360;
}

export function getTrainingAvailability(pet, { slots = [], dailyCount = {}, expeditions = [], workers = [] } = {}) {
  if (!pet || pet.currentHp <= 0) return '需要恢复体力';
  if (slots.some(slot => slot.petUid === pet.uid)) return '训练中';
  if (dailyCount[pet.uid] >= 1) return '今日已训练';
  if (expeditions.some(team => (team.petUids || []).includes(pet.uid))) return '远征中';
  if (workers.includes(pet.uid)) return '咖啡厅工作中';
  if (Object.values(pet.evs || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0) >= 510) return '努力值已满';
  return null;
}
