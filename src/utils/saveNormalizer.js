import { EXPEDITION_BRANCH_EVENTS, EXPEDITION_ZONES, DEFAULT_EXPEDITIONS } from '../data/expedition';
import { TRAINING_CAMPS, TRAINING_TIERS, TRAINING_MAX_SLOTS, DEFAULT_TRAINING_STATE } from '../data/training';
import { HOUSE_TYPES, DEFAULT_HOUSING_STATE } from '../data/housing';
import { CAFE_BUILDING, CAFE_DRINKS, DEFAULT_CAFE_STATE, DRINK_BREW_BASE_MS } from '../data/lycoris';
import { ARENA_DAILY_FREE_TICKETS, ARENA_RANKS, ARENA_WEEKLY_RULES, DEFAULT_ARENA_STATE } from '../data/arena';
import { MINE_GRID_SIZE, MINE_MAX_ENERGY, MINE_ORES, MINE_TILES, DEFAULT_MINE_STATE } from '../data/mine';
import { DEFAULT_BOUNTY_BOARD } from '../data/bountyTemplates';
import { WORLD_BOSS_MAX_ATTEMPTS, DEFAULT_WORLD_BOSS_STATE } from '../data/worldBoss';
import { WHEEL_FREE_SPINS_PER_DAY } from '../data/constants';

const MAX_SAFE_COUNT = 1_000_000_000;

const safeInt = (value, fallback = 0, max = MAX_SAFE_COUNT) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(0, Math.floor(parsed))) : fallback;
};

const safeTimestamp = (value, now) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return now;
  return Math.min(parsed, now);
};

const normalizeDate = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : '';

const normalizeCountRecord = (value, max = MAX_SAFE_COUNT) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => typeof key === 'string' && key.length > 0)
      .map(([key, count]) => [key, safeInt(count, 0, max)]),
  );
};

const ARRAY_SAVE_FIELDS = [
  'party', 'box', 'accessories', 'fruitInventory', 'caughtDex', 'completedChallenges', 'badges',
  'viewedIntros', 'sectTitles', 'guardianMilestonesClaimed', 'battleRecords', 'spiritDomainsCleared',
  'observationLog', 'unlockedTitles', 'unlockedAchs', 'infinityRewardsClaimed',
];

const RECORD_SAVE_FIELDS = [
  'mapProgress', 'dexMilestoneClaimed', 'sectPlayer', 'marriage', 'gang', 'kingdomWar', 'kingdomSim',
  'gangHQ', 'achStats', 'activityRecords', 'dungeonCooldowns', 'sideStoryStates', 'arenaState',
  'mineState', 'bountyBoard', 'luckyWheel', 'worldBossState', 'raceState', 'ecoCrisisChoices',
  'regionEcology', 'sanctuaryState', 'bondingProgress', 'ecoCrisisRoutes', 'fusionState', 'narutoState',
];

const NONNEGATIVE_NUMBER_SAVE_FIELDS = [
  'gold', 'towerFloor', 'leagueWins', 'guardianScore', 'storyProgress', 'storyStep', 'sanguoProgress',
  'sanguoStep', 'mainStoryProgress', 'mainStoryStep', 'leagueRound', 'playTimeMs', 'infinityBestFloor',
];

export const normalizeInventoryState = raw => {
  const saved = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const normalized = { ...saved };
  ['balls', 'meds', 'tms', 'misc', 'stones', 'cursed', 'berries'].forEach(key => {
    normalized[key] = normalizeCountRecord(saved[key]);
  });
  normalized.eggs = (Array.isArray(saved.eggs) ? saved.eggs : [])
    .filter(egg => egg && typeof egg === 'object' && Number.isFinite(Number(egg.speciesId)))
    .map(egg => ({
      ...egg,
      speciesId: safeInt(egg.speciesId),
      stepsLeft: safeInt(egg.stepsLeft),
      hatchLevel: Math.min(100, Math.max(1, safeInt(egg.hatchLevel, 1, 100))),
      isShiny: Boolean(egg.isShiny),
    }));
  Object.entries(normalized).forEach(([key, value]) => {
    if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)))) {
      normalized[key] = safeInt(value);
    }
  });
  return normalized;
};

export const normalizeCoreSaveState = raw => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const normalized = { ...raw };
  ARRAY_SAVE_FIELDS.forEach(key => {
    normalized[key] = Array.isArray(raw[key]) ? raw[key] : [];
  });
  RECORD_SAVE_FIELDS.forEach(key => {
    normalized[key] = raw[key] && typeof raw[key] === 'object' && !Array.isArray(raw[key]) ? raw[key] : {};
  });
  NONNEGATIVE_NUMBER_SAVE_FIELDS.forEach(key => {
    normalized[key] = safeInt(raw[key]);
  });
  normalized.gold = raw.gold == null ? 2000 : safeInt(raw.gold, 2000, Number.MAX_SAFE_INTEGER);
  normalized.trainerName = typeof raw.trainerName === 'string' ? raw.trainerName : '';
  normalized.trainerAvatar = typeof raw.trainerAvatar === 'string' ? raw.trainerAvatar : '';
  normalized.lastPetTradeDate = normalizeDate(raw.lastPetTradeDate);
  normalized.lastTradeDate = normalizeDate(raw.lastTradeDate);
  normalized.inventory = normalizeInventoryState(raw.inventory);
  const relics = raw.relics && typeof raw.relics === 'object' && !Array.isArray(raw.relics) ? raw.relics : {};
  normalized.relics = {
    ...relics,
    equipped: Array.isArray(relics.equipped) ? [...new Set(relics.equipped.filter(Boolean))] : [],
    owned: Array.isArray(relics.owned) ? [...new Set(relics.owned.filter(Boolean))] : [],
  };
  return normalized;
};

const getCanonicalUidMap = (saved, requireAlive = false) => new Map(
  [...(Array.isArray(saved.party) ? saved.party : []), ...(Array.isArray(saved.box) ? saved.box : [])]
    .filter(pet => pet?.uid != null && (!requireAlive || pet.currentHp > 0))
    .map(pet => [String(pet.uid), pet.uid]),
);

const takeCanonicalUid = (uid, uidMap, used) => {
  const key = String(uid ?? '');
  if (!uidMap.has(key) || used.has(key)) return null;
  used.add(key);
  return uidMap.get(key);
};

const normalizeTraining = (raw, uidMap, busy, now) => {
  const saved = raw && typeof raw === 'object' ? raw : {};
  const slots = [];
  for (const candidate of Array.isArray(saved.slots) ? saved.slots : []) {
    if (slots.length >= TRAINING_MAX_SLOTS || !candidate || typeof candidate !== 'object') break;
    const uid = takeCanonicalUid(candidate.petUid, uidMap, busy);
    const camp = TRAINING_CAMPS.find(entry => entry.id === candidate.campId);
    const tierIdx = Number(candidate.tierIdx);
    const tier = Number.isInteger(tierIdx) ? TRAINING_TIERS[tierIdx] : null;
    if (uid == null || !camp || !tier) {
      if (uid != null) busy.delete(String(uid));
      continue;
    }
    slots.push({
      petUid: uid,
      campId: camp.id,
      tierIdx,
      startTime: safeTimestamp(candidate.startTime, now),
      duration: tier.duration,
    });
  }
  const ownedUidKeys = new Set(uidMap.keys());
  const dailyCount = Object.fromEntries(
    Object.entries(normalizeCountRecord(saved.dailyCount, 1))
      .filter(([uid]) => ownedUidKeys.has(String(uid))),
  );
  return {
    ...DEFAULT_TRAINING_STATE,
    slots,
    dailyCount,
    totalSessions: safeInt(saved.totalSessions),
    lastResetDate: normalizeDate(saved.lastResetDate) || null,
  };
};

const normalizeExpeditions = (raw, uidMap, busy, now) => {
  const saved = raw && typeof raw === 'object' ? raw : {};
  const teams = [];
  for (const candidate of Array.isArray(saved.teams) ? saved.teams : []) {
    if (teams.length >= 3 || !candidate || typeof candidate !== 'object') break;
    const zone = EXPEDITION_ZONES.find(entry => entry.id === candidate.zoneId);
    if (!zone) continue;
    const teamUsed = new Set();
    const petUids = [];
    for (const rawUid of Array.isArray(candidate.petUids) ? candidate.petUids : []) {
      if (petUids.length >= 3) break;
      const uid = takeCanonicalUid(rawUid, uidMap, busy);
      if (uid == null || teamUsed.has(String(uid))) continue;
      teamUsed.add(String(uid));
      petUids.push(uid);
    }
    if (petUids.length === 0) continue;

    const event = EXPEDITION_BRANCH_EVENTS.find(entry => entry.id === candidate.branchEventId);
    const savedChoiceId = candidate.branchChoice?.id || candidate.branchChoice;
    const choice = event?.choices?.find(entry => entry.id === savedChoiceId) || null;
    const branchResolved = event ? Boolean(candidate.branchResolved && choice) : true;
    teams.push({
      zoneId: zone.id,
      petUids,
      startTime: safeTimestamp(candidate.startTime, now),
      duration: zone.duration,
      branchEventId: event?.id || null,
      branchResolved,
      ...(branchResolved && choice ? { branchChoice: choice, branchFailed: Boolean(candidate.branchFailed) } : {}),
    });
  }
  return {
    ...DEFAULT_EXPEDITIONS,
    teams,
    lastDate: normalizeDate(saved.lastDate),
    startedToday: safeInt(saved.startedToday, 0, 6),
    speedBoosts: safeInt(saved.speedBoosts),
  };
};

const normalizeCafe = (raw, uidMap, busy, now) => {
  const saved = raw && typeof raw === 'object' ? raw : {};
  const owned = Boolean(saved.owned);
  const workers = [];
  if (owned) {
    for (const rawUid of Array.isArray(saved.workers) ? saved.workers : []) {
      if (workers.length >= CAFE_BUILDING.workerSlots) break;
      const uid = takeCanonicalUid(rawUid, uidMap, busy);
      if (uid != null) workers.push(uid);
    }
  }

  const drinkById = id => CAFE_DRINKS.find(entry => entry.id === id);
  const brewingDrink = drinkById(saved.brewing?.drinkId);
  let brewing = null;
  if (owned && workers.length > 0 && brewingDrink) {
    const baseDuration = DRINK_BREW_BASE_MS[brewingDrink.tier] || DRINK_BREW_BASE_MS[1];
    const duration = Number(saved.brewing.duration);
    brewing = {
      drinkId: brewingDrink.id,
      startTime: safeTimestamp(saved.brewing.startTime, now),
      duration: Number.isFinite(duration) && duration > 0
        ? Math.min(baseDuration, Math.max(Math.floor(baseDuration * 0.15), Math.floor(duration)))
        : baseDuration,
    };
  }
  const readyDrinkDef = !brewing ? drinkById(saved.readyDrink?.drinkId) : null;
  const dailyDrinkCounts = Object.fromEntries(CAFE_DRINKS.map(drink => [
    drink.id,
    safeInt(saved.dailyDrinkCounts?.[drink.id], 0, drink.dailyLimit),
  ]));
  return {
    ...DEFAULT_CAFE_STATE,
    ...saved,
    owned,
    workers,
    totalWorkCount: safeInt(saved.totalWorkCount),
    lastTickTime: safeTimestamp(saved.lastTickTime, now),
    brewing,
    readyDrink: readyDrinkDef ? { drinkId: readyDrinkDef.id } : null,
    dailyDrinkCounts,
    dailyResetDate: normalizeDate(saved.dailyResetDate) || null,
    cafeDailyGoldDate: normalizeDate(saved.cafeDailyGoldDate) || null,
    cafeDailyGoldEarned: safeInt(saved.cafeDailyGoldEarned, 0, 25000),
    _pendingSideEffects: undefined,
  };
};

const normalizeHousing = (raw, uidMap) => {
  const saved = raw && typeof raw === 'object' ? raw : {};
  const house = HOUSE_TYPES.find(entry => entry.id === saved.currentHouse);
  const residentUsed = new Set();
  const residents = [];
  if (house) {
    for (const rawUid of Array.isArray(saved.residents) ? saved.residents : []) {
      if (residents.length >= house.slots) break;
      if (rawUid == null) {
        residents.push(null);
        continue;
      }
      const uid = takeCanonicalUid(rawUid, uidMap, residentUsed);
      residents.push(uid == null ? null : uid);
    }
    while (residents.length < house.slots) residents.push(null);
  }
  return {
    ...DEFAULT_HOUSING_STATE,
    ...saved,
    currentHouse: house?.id || null,
    residents,
  };
};

export const normalizeOperationalSaveState = (saved, now = Date.now()) => {
  const source = saved && typeof saved === 'object' ? saved : {};
  const uidMap = getCanonicalUidMap(source);
  const activeUidMap = getCanonicalUidMap(source, true);
  const busy = new Set();
  const trainingState = normalizeTraining(source.trainingState, activeUidMap, busy, now);
  const expeditions = normalizeExpeditions(source.expeditions, activeUidMap, busy, now);
  const cafe = normalizeCafe(source.cafe, activeUidMap, busy, now);
  const housing = normalizeHousing(source.housing, uidMap);
  return { trainingState, expeditions, cafe, housing };
};

export const normalizeActivitySaveState = (saved, now = Date.now()) => {
  const source = saved && typeof saved === 'object' ? saved : {};
  const rawArena = source.arenaState && typeof source.arenaState === 'object' ? source.arenaState : {};
  const rank = ARENA_RANKS.find(entry => entry.id === rawArena.rank) || ARENA_RANKS[0];
  const weeklyRule = ARENA_WEEKLY_RULES.find(entry => entry.id === rawArena.weeklyRule)?.id || 'normal';
  const validRankIds = new Set(ARENA_RANKS.map(entry => entry.id));
  const arenaState = {
    ...DEFAULT_ARENA_STATE,
    ...rawArena,
    rank: rank.id,
    stars: safeInt(rawArena.stars, 0, rank.maxStars),
    tickets: safeInt(rawArena.tickets, DEFAULT_ARENA_STATE.tickets, ARENA_DAILY_FREE_TICKETS * 3),
    wins: safeInt(rawArena.wins),
    losses: safeInt(rawArena.losses),
    winStreak: safeInt(rawArena.winStreak),
    bestStreak: safeInt(rawArena.bestStreak),
    weeklyRule,
    rewardsClaimed: [...new Set((Array.isArray(rawArena.rewardsClaimed) ? rawArena.rewardsClaimed : []).filter(id => validRankIds.has(id)))],
    season: Math.max(1, safeInt(rawArena.season, 1)),
    seasonStartDate: normalizeDate(rawArena.seasonStartDate),
    seasonBestRank: validRankIds.has(rawArena.seasonBestRank) ? rawArena.seasonBestRank : rank.id,
  };

  const rawMine = source.mineState && typeof source.mineState === 'object' ? source.mineState : {};
  const validTileIds = new Set(Object.keys(MINE_TILES));
  const grid = Array.isArray(rawMine.grid) && rawMine.grid.length === MINE_GRID_SIZE
    && rawMine.grid.every(row => Array.isArray(row) && row.length === MINE_GRID_SIZE && row.every(tile => validTileIds.has(tile)))
    ? rawMine.grid.map(row => [...row])
    : null;
  const revealedSeen = new Set();
  const revealed = (Array.isArray(rawMine.revealed) ? rawMine.revealed : []).filter(coord => {
    if (!Array.isArray(coord) || coord.length < 2) return false;
    const row = Number(coord[0]);
    const col = Number(coord[1]);
    const key = `${row}:${col}`;
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= MINE_GRID_SIZE || col >= MINE_GRID_SIZE || revealedSeen.has(key)) return false;
    revealedSeen.add(key);
    return true;
  }).map(([row, col]) => [Number(row), Number(col)]);
  const mineState = {
    ...DEFAULT_MINE_STATE,
    ...rawMine,
    energy: safeInt(rawMine.energy, DEFAULT_MINE_STATE.energy, MINE_MAX_ENERGY),
    maxEnergy: MINE_MAX_ENERGY,
    lastRegenTime: safeTimestamp(rawMine.lastRegenTime, now),
    depth: Math.max(1, safeInt(rawMine.depth, 1, 10000)),
    grid,
    revealed: grid ? revealed : [],
    minerals: Object.fromEntries(Object.keys(MINE_ORES).map(id => [id, safeInt(rawMine.minerals?.[id])])),
    totalMined: safeInt(rawMine.totalMined),
    _comboCount: safeInt(rawMine._comboCount, 0, 100),
  };

  const rawBounty = source.bountyBoard && typeof source.bountyBoard === 'object' ? source.bountyBoard : {};
  const quests = (Array.isArray(rawBounty.quests) ? rawBounty.quests : []).filter(quest => quest && typeof quest === 'object').map(quest => ({
    ...quest,
    progress: safeInt(quest.progress),
    target: Math.max(1, safeInt(quest.target, 1)),
    completed: Boolean(quest.completed),
    claimed: Boolean(quest.claimed),
    reward: quest.reward && typeof quest.reward === 'object' ? quest.reward : {},
  }));
  const allCompleted = quests.length > 0 && quests.every(quest => quest.claimed);
  const bountyBoard = {
    ...DEFAULT_BOUNTY_BOARD,
    date: normalizeDate(rawBounty.date),
    quests,
    allCompleted,
    masterChestClaimed: allCompleted && Boolean(rawBounty.masterChestClaimed),
  };

  const rawBoss = source.worldBossState && typeof source.worldBossState === 'object' ? source.worldBossState : {};
  const worldBossState = {
    ...DEFAULT_WORLD_BOSS_STATE,
    ...rawBoss,
    bossDate: normalizeDate(rawBoss.bossDate) || null,
    totalDamage: safeInt(rawBoss.totalDamage),
    attempts: safeInt(rawBoss.attempts, 0, WORLD_BOSS_MAX_ATTEMPTS),
    claimedMilestones: [...new Set((Array.isArray(rawBoss.claimedMilestones) ? rawBoss.claimedMilestones : []).map(value => safeInt(value)).filter(value => value > 0))],
    defeated: Boolean(rawBoss.defeated),
    bestDamage: safeInt(rawBoss.bestDamage),
    totalBossesDefeated: safeInt(rawBoss.totalBossesDefeated),
  };

  const rawWheel = source.luckyWheel && typeof source.luckyWheel === 'object' ? source.luckyWheel : {};
  const luckyWheel = {
    lastFreeDate: normalizeDate(rawWheel.lastFreeDate),
    paidSpins: safeInt(rawWheel.paidSpins),
    totalSpins: safeInt(rawWheel.totalSpins),
    dailySpinDate: normalizeDate(rawWheel.dailySpinDate),
    dailySpinCount: safeInt(rawWheel.dailySpinCount, 0, WHEEL_FREE_SPINS_PER_DAY),
  };

  const rawRace = source.raceState && typeof source.raceState === 'object' ? source.raceState : {};
  const raceState = {
    lastDate: normalizeDate(rawRace.lastDate),
    dailyRaces: safeInt(rawRace.dailyRaces, 0, 5),
    totalWins: safeInt(rawRace.totalWins),
  };
  return { arenaState, mineState, bountyBoard, worldBossState, luckyWheel, raceState };
};
