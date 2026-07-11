export const RACE_CONFIG = Object.freeze({
  maxDailyRaces: 5,
  freeDailyRaces: 3,
  paidEntryCost: 3000,
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function getMedianSpeed(speeds) {
  const values = (speeds || [])
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (values.length === 0) return 1;
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

export function resolveRaceContest({ player, partySpeeds, rivals, badges = 0, random = Math.random }) {
  const medianSpeed = getMedianSpeed(partySpeeds);
  const progressMult = 1 + clamp(Number(badges) || 0, 0, 16) * 0.002;
  const playerRunner = {
    ...player,
    speed: Math.max(1, Math.round((Number(player?.baseSpeed) || 1) * (0.96 + random() * 0.08))),
    isPlayer: true,
    tieBreaker: random(),
  };
  const rivalRunners = (rivals || []).map(rival => {
    const speciesSpeed = Math.max(1, Number(rival?.baseSpeed) || medianSpeed);
    const fieldSpeed = medianSpeed * 0.72 + speciesSpeed * 0.28;
    return {
      ...rival,
      speed: Math.max(1, Math.round(fieldSpeed * (0.98 + random() * 0.22) * progressMult)),
      isPlayer: false,
      tieBreaker: random(),
    };
  });
  const runners = [playerRunner, ...rivalRunners]
    .sort((a, b) => b.speed - a.speed || a.tieBreaker - b.tieBreaker);
  return {
    runners,
    placement: runners.findIndex(runner => runner.isPlayer) + 1,
    medianSpeed,
  };
}

export function getRaceReward(placement, badges = 0, candyAvailable = false) {
  const badgeCount = clamp(Number(badges) || 0, 0, 16);
  if (placement === 1) {
    return {
      gold: 2400 + badgeCount * 100,
      item: candyAvailable ? 'speed_candy' : null,
    };
  }
  if (placement === 2) return { gold: 1200 + badgeCount * 50, item: null };
  if (placement === 3) return { gold: 500, item: null };
  return { gold: 0, item: null };
}
