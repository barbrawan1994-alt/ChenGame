const MAX_SAMPLES = 500;
const finite = value => Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0);

export function advanceCombatClock(run, now) {
  if (!run) return;
  const end = run.autoBattle ? now : Math.min(now, run.lastInput + 60000);
  if (run.visible) run.sample.activeMs += Math.max(0, end - run.lastTick);
  run.lastTick = now;
  run.sample.elapsedMs = Math.max(0, now - run.started);
}

export function normalizeCombatMetrics(value = {}) {
  return { version: 1, samples: (Array.isArray(value?.samples) ? value.samples : [])
    .filter(row => row && typeof row.id === 'string' && ['win', 'loss', 'caught', 'escaped', 'interrupted'].includes(row.result))
    .slice(-MAX_SAMPLES).map(row => ({ ...row, activeMs: finite(row.activeMs), elapsedMs: finite(row.elapsedMs), turns: finite(row.turns), manualCommands: finite(row.manualCommands), autoCommands: finite(row.autoCommands), interactions: finite(row.interactions) })) };
}

export function createCombatSample(battle, { now = Date.now(), season = 1, faction = null, badges = 0, speed = 1 } = {}) {
  const average = units => units?.length ? Math.round(units.reduce((sum, unit) => sum + finite(unit.level), 0) / units.length) : 0;
  return { id: battle._metricsId, startedAt: now, type: battle.type, dungeonId: battle.dungeonId || null,
    chapter: battle._storyChapter ?? null, season, faction, badges, speed, double: !!battle.isDouble,
    playerLevel: average(battle.playerCombatStates), enemyLevel: average(battle.enemyParty),
    activeMs: 0, elapsedMs: 0, manualCommands: 0, autoCommands: 0, interactions: 0, turns: 0 };
}

export function appendCombatSample(metrics, sample) {
  const clean = normalizeCombatMetrics(metrics);
  if (!sample?.id || clean.samples.some(row => row.id === sample.id)) return clean;
  return normalizeCombatMetrics({ samples: [...clean.samples, sample].slice(-MAX_SAMPLES) });
}

export function summarizeCombatMetrics(metrics) {
  const groups = new Map();
  for (const row of normalizeCombatMetrics(metrics).samples) {
    const key = `${row.type || 'unknown'}:${row.season}:${row.double ? 'double' : 'single'}`;
    if (!groups.has(key)) groups.set(key, { type: row.type || 'unknown', season: row.season, double: row.double, samples: 0, wins: 0, losses: 0, caught: 0, escaped: 0, interrupted: 0, activeMs: 0, turns: 0, manualCommands: 0, autoCommands: 0, interactions: 0 });
    const group = groups.get(key);
    group.samples++;
    group.wins += row.result === 'win' ? 1 : 0;
    group.losses += row.result === 'loss' ? 1 : 0;
    group.caught += row.result === 'caught' ? 1 : 0;
    group.escaped += row.result === 'escaped' ? 1 : 0;
    group.interrupted += row.result === 'interrupted' ? 1 : 0;
    for (const key of ['activeMs', 'turns', 'manualCommands', 'autoCommands', 'interactions']) group[key] += row[key];
  }
  return [...groups.values()].map(group => ({ ...group,
    failureRate: group.wins + group.losses ? group.losses / (group.wins + group.losses) : null,
    averageActiveMs: Math.round(group.activeMs / group.samples),
  }));
}
