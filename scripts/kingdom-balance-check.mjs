/**
 * 国战系统平衡、行动经济与兵力上限回归校验。
 * 运行: node scripts/kingdom-balance-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const loadSourceModule = async (relativePath, transform = source => source) => {
  const sourceUrl = new URL(`../${relativePath}`, import.meta.url);
  const source = transform(await readFile(sourceUrl, 'utf8'));
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};

const constants = await loadSourceModule('src/data/kingdomConstants.js');
const generalsData = await import(new URL('../src/data/generals.js', import.meta.url));
const politicsModuleUrl = new URL('../src/data/kingdomPolitics.js', import.meta.url).href;
const politics = await import(politicsModuleUrl);

const MOCK_GENERALS = ['wei', 'shu', 'wu', 'jin', 'qun'].flatMap(faction => (
  Array.from({ length: 8 }, (_, index) => ({
    id: `${faction}_${index + 1}`,
    name: `${faction.toUpperCase()}将${index + 1}`,
    faction,
    rosterFaction: faction === 'jin' ? 'western_jin' : faction === 'qun' ? 'neutral' : faction,
    politicalFaction: faction === 'jin' ? 'western_jin' : faction,
    warCamp: faction,
    rarity: index < 3 ? 'SSR' : index < 6 ? 'SR' : 'R',
  }))
));
MOCK_GENERALS.push(
  { id: 'neutral_1', name: '中立将1', faction: 'neutral', rosterFaction: 'neutral', politicalFaction: 'qun', warCamp: 'qun', rarity: 'SSR' },
  { id: 'neutral_2', name: '中立将2', faction: 'neutral', rosterFaction: 'neutral', politicalFaction: 'qun', warCamp: 'qun', rarity: 'SR' },
);
const appSource = await readFile(new URL('../src/App.js', import.meta.url), 'utf8');
const kingdomSource = await readFile(new URL('../src/data/kingdom.js', import.meta.url), 'utf8');
const kwSiegeSource = await readFile(new URL('../src/data/kwSiege.js', import.meta.url), 'utf8');
const achievements = await loadSourceModule('src/data/achievements.js');
const kingdom = await loadSourceModule('src/data/kingdom.js', source => source
  .replace(
    "import { hydrateGeneralSnapshot, SANGUO_GENERALS } from './generals';",
    `const SANGUO_GENERALS = ${JSON.stringify(MOCK_GENERALS)};\nconst hydrateGeneralSnapshot = general => general;`
  )
  .replace(
    "import { MANPOWER_RESERVE_CAP } from './kingdomConstants';",
    `const MANPOWER_RESERVE_CAP = ${constants.MANPOWER_RESERVE_CAP};`
  )
  .replace("from './kingdomPolitics';", `from '${politicsModuleUrl}';`));
const gang = await loadSourceModule('src/data/gang.js');
const kwSiege = await loadSourceModule('src/data/kwSiege.js', source => source
  .replace(
    /import \{\s*CONTESTED_MAP_IDS,[\s\S]*?advanceTerritorySiege,\s*\} from '\.\/kingdom';/,
    `const CONTESTED_MAP_IDS = ${JSON.stringify(kingdom.CONTESTED_MAP_IDS)};
const RECRUIT_CONFIG = ${JSON.stringify(kingdom.RECRUIT_CONFIG)};
const SIEGE_CONFIG = ${JSON.stringify(kingdom.SIEGE_CONFIG)};
const getInstabilityMult = () => 1;
const buildSiegeCombatParams = () => ({});
const advanceTerritorySiege = ({ territory }) => ({ territory, captured: false, progressGain: 0 });`
  )
  .replace("import { getGeneralById } from './generals';", 'const getGeneralById = () => null;')
  .replace(
    "import { MANPOWER_RESERVE_CAP } from './kingdomConstants';",
    `const MANPOWER_RESERVE_CAP = ${constants.MANPOWER_RESERVE_CAP};`
  ));

const {
  ALL_FACTION_IDS,
  DEFECTION_CONFIG,
  RECRUIT_CONFIG,
  SIEGE_CONFIG,
  WAR_TICK_CONFIG,
  WAR_MAP_IDS,
  recruitTroops,
  ensureFactionManpower,
  executeAllEnemyActions,
  executeWarTick,
  checkSeasonEnd,
  initTerritories,
  getFactionTerritoryCount,
  getWeakestFaction,
  applySeasonRewards,
  getKingdomDateKey,
  resetKingdomDailyCounts,
  TIGER_SEAL_ATTACK_MULT,
  TOKEN_SHOP,
  CONTESTED_MAP_IDS,
  evaluateTerritoryAssault,
  buildSiegeCombatParams,
  buildKingdomStrategicBrief,
  applyDefection,
  generateGarrison,
  normalizeGarrison,
  getGarrisonTotal,
  assignTerritoryGuards,
  normalizeKingdomTerritory,
  advanceTerritorySiege,
  migrateKingdomWarState,
  CAPITAL_SIEGE_MAX_TERRITORIES,
  getCapitalSiegeTargets,
  KINGDOM_TROOP_KEYS,
  INITIAL_TERRITORIES,
} = kingdom;
const {
  evaluateKwSiegeBattle,
  runKwSiegeBattle,
  getContestMapProgress,
  inferDefenseWeights,
  resolveContestedMapOwner,
  CONTEST_CAPTURE_THRESHOLD,
  CONTEST_SIEGE_MIN_DEPLOY,
  CONTEST_MAX_OCCUPATION_GAIN,
  settleContestSiegeAttempt,
  validateSiegeDeployment,
} = kwSiege;
const {
  DIPLOMACY_CONFIG,
  POLITICAL_FACTIONS,
  QUN_LORDS,
  applyDiplomaticAction,
  advanceKingdomPolitics,
  canFactionAttack,
  createDefaultKingdomPolitics,
  getFactionGeneralPower,
  getFactionPoliticalSummary,
  getHistoricalFactionPoliticalSummaries,
  inviteGeneralToFaction,
  getQunLordSummaries,
  migrateKingdomPolitics,
  resetKingdomPoliticsForSeason,
} = politics;
const {
  SANGUO_GENERALS,
  GENERAL_DRAW_RATES,
  GENERAL_DRAW_PITY,
  drawGeneralFromPool,
} = generalsData;
const {
  default: ACHIEVEMENTS,
  normalizeUnlockedAchievementIds,
  normalizeAchievementTitles,
  normalizeCurrentAchievementTitle,
} = achievements;
const { GANG_PRESETS } = gang;
const { MANPOWER_RESERVE_CAP } = constants;

const OVEREXTEND_THRESHOLD = 8;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const makeSeededRandom = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

const simulateRecruitLoop = territories => {
  const grainCap = RECRUIT_CONFIG.grainCapBase + territories * RECRUIT_CONFIG.grainCapPerTerritory;
  const dailyGrain = territories * RECRUIT_CONFIG.grainPerTerritory;
  const recruitsPerDay = dailyGrain / RECRUIT_CONFIG.normalCost.grain;
  const avgGain = (RECRUIT_CONFIG.normalGain[0] + RECRUIT_CONFIG.normalGain[1]) / 2;
  return {
    grainCap,
    dailyGrain,
    recruitsPerDay,
    dailyManpower: recruitsPerDay * avgGain,
    goldPerDay: recruitsPerDay * RECRUIT_CONFIG.normalCost.gold,
  };
};

const simulateSiegeManpower = (strength = 60, deploy = 120) => {
  const fieldCost = clamp(Math.floor(strength / 3), 20, 40);
  const assaultLossRate = clamp(0.35 - 0.15 * 0.5, 0.15, 0.5);
  const assaultLoss = Math.floor(deploy * assaultLossRate);
  return { fieldCost, assaultLoss, totalPerSiege: fieldCost + assaultLoss };
};

console.log('=== 国战平衡与行动经济检查 ===\n');

// 0. 已下线的“版图扩张”不能继续自动解锁，旧存档完成记录与专属称号也必须清理
{
  assert.equal(ACHIEVEMENTS.some(achievement => achievement.id === 'kw_territory_5'), false);
  assert.equal(ACHIEVEMENTS.some(achievement => achievement.name === '版图扩张'), false);
  assert.deepEqual(
    normalizeUnlockedAchievementIds(['kw_territory_5', 'kw_kill_100', 'kw_kill_100']),
    ['kw_kill_100'],
  );
  assert.deepEqual(
    normalizeAchievementTitles(['版图扩张', '百战铁军', '百战铁军']),
    ['见习训练家', '百战铁军'],
  );
  assert.equal(normalizeCurrentAchievementTitle('版图扩张'), '见习训练家');
  check(true, '已移除“版图扩张”成就，并清理旧存档中的完成记录和专属称号');
}

// 1. 地图规模与基础资源循环。
check(WAR_MAP_IDS.length >= 35 && WAR_MAP_IDS.length <= 45, `参战地图 ${WAR_MAP_IDS.length} 张（目标约 40）`);

{
  const early = simulateRecruitLoop(3);
  assert.equal(early.grainCap, 260);
  check(early.recruitsPerDay <= 3, `3 领地每日约 ${early.recruitsPerDay.toFixed(1)} 次普通征兵`);
  check(early.dailyManpower < 150, `3 领地日均新增约 ${early.dailyManpower.toFixed(0)} 兵力，不会快速膨胀`);

  const expanded = simulateRecruitLoop(8);
  assert.equal(expanded.grainCap, 360);
  check(
    expanded.recruitsPerDay >= 3 && expanded.recruitsPerDay <= 5,
    `8 领地每日约 ${expanded.recruitsPerDay.toFixed(1)} 次普通征兵`
  );
}

// 2. 攻城消耗应形成“连续进攻后需要补给”的节奏。
{
  const weak = simulateSiegeManpower(40, 100);
  const strong = simulateSiegeManpower(80, 200);
  check(weak.totalPerSiege >= 35 && weak.totalPerSiege <= 90, `弱城单次攻城消耗约 ${weak.totalPerSiege} 兵力`);
  check(strong.totalPerSiege >= 50 && strong.totalPerSiege <= 150, `强城单次攻城消耗约 ${strong.totalPerSiege} 兵力`);
  const siegesFromStart = Math.floor(140 / weak.totalPerSiege);
  check(siegesFromStart >= 2 && siegesFromStart <= 5, `初始 140 兵力约可支撑 ${siegesFromStart} 次攻城`);
}

// 3. 每次玩家行动只触发一个敌方行动，并按行动计数轮转全部敌方（含群雄）。
{
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    const enemies = ALL_FACTION_IDS.filter(id => id !== 'wei');
    const rotationTerritories = Object.fromEntries(ALL_FACTION_IDS.map((fid, index) => [WAR_MAP_IDS[index], {
      owner: fid, strength: 100, garrison: {}, guards: [],
    }]));
    const actedFactions = [];
    for (let actionCounter = 1; actionCounter <= 5; actionCounter += 1) {
      const result = executeAllEnemyActions({
        faction: 'wei',
        territories: rotationTerritories,
        factionManpower: { wei: 400, shu: 400, wu: 400, jin: 400, qun: 300 },
        actionCounter,
      }, [], 50);
      assert.ok(result.logs.length <= 1);
      if (result.logs[0]) actedFactions.push(result.logs[0].faction);
    }
    assert.deepEqual(actedFactions, [...enemies, enemies[0]]);
    check(actedFactions.length === 5, '5 次玩家行动仅触发 5 次敌方行动，不再形成四打一行动经济');
    check(actedFactions.includes('qun'), `敌方轮转顺序覆盖 ${enemies.join('、')}，群雄不会漏行动`);
  } finally {
    Math.random = originalRandom;
  }
}

// 4. AI 必须严格使用真实兵力；0 兵力不能被默认值替换后免费攻城。
{
  const [targetMapId, ...ownedMapIds] = WAR_MAP_IDS
    .filter(id => !CONTESTED_MAP_IDS.includes(Number(id)))
    .slice(0, 4);
  const territories = {
    [targetMapId]: { owner: 'wei', strength: 0, garrison: {}, guards: [] },
    ...Object.fromEntries(ownedMapIds.map(id => [id, {
      owner: 'shu', strength: 100, garrison: {}, guards: [],
    }])),
  };
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    const result = executeAllEnemyActions({
      faction: 'wei',
      territories,
      factionManpower: { wei: 400, shu: 0, wu: 400, jin: 400, qun: 300 },
      actionCounter: 1,
    }, [], 50);
    assert.equal(result.kw.territories[targetMapId].owner, 'wei');
    assert.equal(result.logs[0]?.type, 'recruit');
    assert.equal(result.kw.factionManpower.shu, 26);
    check(true, 'AI 兵力为 0 时会先征兵，不会生成幽灵兵力攻占弱城');
  } finally {
    Math.random = originalRandom;
  }

  const normalized = ensureFactionManpower({
    factionManpower: { wei: 0, shu: '125', wu: -50, jin: Number.NaN },
  });
  assert.deepEqual(normalized, { wei: 0, shu: 125, wu: 0, jin: 400, qun: 300 });
  check(true, '旧档中的 0、字符串、负数与非有限兵力会被安全归一化');
}

// 5. 一次玩家行动只推进一次守将恢复计数。
{
  const mapId = WAR_MAP_IDS[0];
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    const result = executeAllEnemyActions({
      faction: 'wei',
      territories: {
        [mapId]: {
          owner: 'wei',
          strength: 100,
          garrison: {},
          guards: [{ generalId: 'test', name: '测试守将', defeated: true, recoverActions: 0 }],
        },
      },
      factionManpower: { wei: 400, shu: 400, wu: 400, jin: 400, qun: 300 },
      actionCounter: 1,
    }, [], 50);
    assert.equal(result.kw.territories[mapId].guards[0].recoverActions, 1);
    check(true, '守将恢复计数每次玩家行动只增加 1 次');
  } finally {
    Math.random = originalRandom;
  }
}

// 6. 征兵不透支粮草，普通预备兵与赛季继承都受共享上限约束。
{
  const originalRandom = Math.random;
  Math.random = () => 0.999999;
  try {
    const recruit = recruitTroops({
      faction: 'wei',
      warContribution: 0,
      grain: RECRUIT_CONFIG.normalCost.grain,
      kwManpowerReserve: MANPOWER_RESERVE_CAP - 10,
      eliteTroops: 0,
      actionCounter: 0,
    }, 'normal');
    assert.equal(recruit.ok, true);
    assert.equal(recruit.nextKw.grain, RECRUIT_CONFIG.normalCost.grain - recruit.grainCost);
    assert.ok(recruit.grainCost > 0 && recruit.grainCost < RECRUIT_CONFIG.normalCost.grain);
    assert.equal(recruit.nextKw.kwManpowerReserve, MANPOWER_RESERVE_CAP);
    assert.equal(recruit.nextKw.actionCounter, 1);
    check(true, `征兵后粮草不低于 0，临近上限按实际入账收费且预备兵不超过 ${MANPOWER_RESERVE_CAP}`);
  } finally {
    Math.random = originalRandom;
  }

  const seasonState = applySeasonRewards({
    faction: 'wei',
    warContribution: 500,
    seasonContribution: 500,
    season: 1,
    seasonTitles: [],
    kwManpowerReserve: 10000,
    grain: 1000,
    eliteTroops: 1000,
    morale: 100,
    attackBuff: true,
  }, {
    rankings: ['wei', 'shu', 'wu', 'jin', 'qun'],
    season: 1,
  });
  assert.equal(seasonState.kwManpowerReserve, MANPOWER_RESERVE_CAP);
  assert.equal(seasonState.attackBuff, true);
  check(true, `赛季继承后的预备兵同样不超过 ${MANPOWER_RESERVE_CAP}，已购买虎符不会被赛季切换吞掉`);
}

// 7. 虎符在普通领地与名城攻城中必须产生一致、可预览的 +50% 攻击收益。
{
  assert.equal(TIGER_SEAL_ATTACK_MULT, 1.5);
  const tigerSeal = TOKEN_SHOP.find(item => item.id === 'tiger_seal');
  assert.ok(tigerSeal);
  assert.match(tigerSeal.desc, /普通领地或名城攻城攻击力 \+50%/);
  assert.doesNotMatch(tigerSeal.desc, /war tick/i);

  const mapId = WAR_MAP_IDS.find(id => !CONTESTED_MAP_IDS.includes(Number(id)));
  const allocation = { shield: 16, spear: 16, cavalry: 16, archer: 16, siege: 16, raider: 16 };
  const territories = {
    [mapId]: {
      owner: 'shu',
      strength: 82,
      garrison: { shield: 30, spear: 30, cavalry: 30, archer: 30, siege: 30, raider: 30 },
      guards: [],
    },
  };
  const baseTerritory = evaluateTerritoryAssault({
    mapId, playerFaction: 'wei', allocation, territories,
    kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
  });
  const buffedTerritory = evaluateTerritoryAssault({
    mapId, playerFaction: 'wei', allocation, territories,
    kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
    external: { attackItemMult: TIGER_SEAL_ATTACK_MULT },
  });
  assert.ok(buffedTerritory.expectedDamage > baseTerritory.expectedDamage);
  assert.ok(buffedTerritory.fieldWinChance >= baseTerritory.fieldWinChance);
  assert.ok(buffedTerritory.winChance > baseTerritory.winChance);
  assert.equal(buffedTerritory.extBonus.itemAttackMult, TIGER_SEAL_ATTACK_MULT);

  const cityArgs = {
    mapId: 204,
    playerFaction: 'wei',
    allocation: { shield: 18, spear: 18, cavalry: 18, archer: 18, siege: 18, raider: 18 },
    generalIds: [],
    recruitedGenerals: [],
    mapProgress: { wei: 8, shu: 30, wu: 12, jin: 10, qun: 18 },
    mapLvlMin: 50,
    mapLvlMax: 80,
    avgPartyLevel: 55,
  };
  const baseCity = evaluateKwSiegeBattle(cityArgs);
  const buffedCity = evaluateKwSiegeBattle({ ...cityArgs, attackPowerMult: TIGER_SEAL_ATTACK_MULT });
  assert.ok(buffedCity.expectedDamage > baseCity.expectedDamage);
  assert.ok(buffedCity.winChance > baseCity.winChance);
  assert.ok(Math.abs(buffedCity.expectedDamage / baseCity.expectedDamage - TIGER_SEAL_ATTACK_MULT) < 1e-9);
  assert.equal(buffedCity.attackPowerMult, TIGER_SEAL_ATTACK_MULT);

  // 名城实战胜败应使用同一预览胜率，而不是因 7 回合总伤害远超城墙就变成必胜。
  assert.ok(baseCity.expectedDamage * 0.82 > baseCity.wallHp, '该配置可复现旧版总伤害导致的伪必胜');
  const originalRandom = Math.random;
  try {
    Math.random = () => Math.max(0, baseCity.winChance - 0.01);
    const expectedWin = runKwSiegeBattle(cityArgs);
    Math.random = () => Math.min(0.999999, baseCity.winChance + 0.01);
    const expectedLoss = runKwSiegeBattle(cityArgs);
    assert.equal(expectedWin.victory, true);
    assert.equal(expectedWin.wallRemainPct, 0);
    assert.equal(expectedLoss.victory, false);
    assert.ok(expectedLoss.wallRemainPct > 0);
  } finally {
    Math.random = originalRandom;
  }
  check(true, '虎符在普通领地和名城中稳定提供 +50% 攻击力，名城实战胜率也与预览一致');
}

// 7. 虎符只在合法攻城真正结算后消耗，War Tick 与非法配置不会吞掉效果。
{
  const warTickStart = appSource.indexOf('// 国战 War Tick');
  const warTickEnd = appSource.indexOf('// 单人国战模拟', warTickStart);
  const warTickSource = appSource.slice(warTickStart, warTickEnd);
  assert.ok(warTickStart >= 0 && warTickEnd > warTickStart);
  assert.doesNotMatch(warTickSource, /attackBuff\s*:\s*false/);
  assert.doesNotMatch(warTickSource, /executeWarTick\([^)]*attackBuff/);
  assert.doesNotMatch(kingdomSource, /executeWarTick\s*=\s*\([^)]*attackBuff/);

  const ordinaryStart = appSource.indexOf('const siegeExternal = {');
  const ordinaryEnd = appSource.indexOf("console.error('territory siege:'", ordinaryStart);
  const ordinarySource = appSource.slice(ordinaryStart, ordinaryEnd);
  const ordinaryValidate = ordinarySource.indexOf('if (!fieldEval.canAttack)');
  const ordinaryRun = ordinarySource.indexOf('const result = runThreePhaseSiege');
  const ordinaryConsume = ordinarySource.indexOf('attackBuff: false');
  assert.match(ordinarySource, /attackItemMult: currentKw\.attackBuff \? TIGER_SEAL_ATTACK_MULT : 1/);
  assert.ok(ordinaryValidate >= 0 && ordinaryRun > ordinaryValidate && ordinaryConsume > ordinaryRun);

  const cityStart = appSource.indexOf('const latestPreview = evaluateKwSiegeBattle');
  const cityEnd = appSource.indexOf("console.error('kw siege:'", cityStart);
  const citySource = appSource.slice(cityStart, cityEnd);
  const cityValidate = citySource.indexOf('if (!latestPreview.canAttack)');
  const cityRun = citySource.indexOf('const siegeResult = runKwSiegeBattle');
  const cityConsume = citySource.indexOf('const settlement = settleContestSiegeAttempt');
  assert.match(citySource, /attackPowerMult: currentKw\.attackBuff \? TIGER_SEAL_ATTACK_MULT : 1/);
  assert.ok(cityValidate >= 0 && cityRun > cityValidate && cityConsume > cityRun);
  assert.match(kwSiegeSource, /settleContestSiegeAttempt[\s\S]*attackBuff:\s*false/);

  const tigerShopStart = appSource.indexOf("item.id === 'tiger_seal' && currentKw.attackBuff");
  assert.ok(tigerShopStart >= 0);
  check(true, 'War Tick 不再清除虎符，普通/名城攻城均先验证并执行，再消费虎符，重复购买也会被阻止');
}

// 8. 每日结算使用本地日期键，避免 UTC 导致中国时区在早上 8 点才刷新。
{
  const fakeLocalDate = {
    getFullYear: () => 2026,
    getMonth: () => 6,
    getDate: () => 10,
  };
  assert.equal(getKingdomDateKey(fakeLocalDate), '2026-07-10');
  const reset = resetKingdomDailyCounts({
    faction: null,
    territories: {},
    dailyCounts: null,
    grain: 0,
  }, '2026-07-10');
  assert.equal(reset.dailyCounts.resetDate, '2026-07-10');
  assert.equal(reset.dailyCounts.territorySieges, 0);
  check(true, '国战每日刷新统一使用本地日期，并兼容旧存档缺少 dailyCounts');
}

// 9. 都城确认框打开后仍需用最新战局、队伍与战斗状态复核，再获取攻城锁和写入冷却。
{
  assert.equal(CAPITAL_SIEGE_MAX_TERRITORIES, 3);
  const capitalGateTerritories = Object.fromEntries(WAR_MAP_IDS.map((mapId, index) => [mapId, {
    owner: index < 4 ? 'shu' : 'wei', strength: 60, garrison: {}, guards: [],
  }]));
  assert.equal(getCapitalSiegeTargets('wei', capitalGateTerritories).includes('shu'), false);
  capitalGateTerritories[WAR_MAP_IDS[3]].owner = 'wei';
  assert.equal(getCapitalSiegeTargets('wei', capitalGateTerritories).includes('shu'), true);
  const confirmStart = appSource.indexOf("setConfirmModal({ title:'⚔️ 攻城确认'");
  const confirmHandler = appSource.slice(confirmStart, confirmStart + 3200);
  assert.ok(confirmStart >= 0);
  const factionCheck = confirmHandler.indexOf("if (!currentKw?.faction)");
  const aliveCheck = confirmHandler.indexOf("(partyRef.current || []).some");
  const battleCheck = confirmHandler.indexOf('if (battle && !battleResultHandledRef.current)');
  const eligibilityCheck = confirmHandler.indexOf('getCapitalSiegeTargets(currentKw.faction, currentKw.territories)');
  const targetMapCheck = confirmHandler.indexOf('const latestCapitalMap = MAPS.find');
  const lockAcquire = confirmHandler.indexOf('kingdomActionLocksRef.current.add(lockKey)');
  const cooldownWrite = confirmHandler.indexOf('lastSiegeTime:');
  assert.ok(
    factionCheck >= 0 && aliveCheck > factionCheck && battleCheck > aliveCheck &&
    eligibilityCheck > battleCheck && targetMapCheck > eligibilityCheck &&
    lockAcquire > targetMapCheck && cooldownWrite > lockAcquire
  );
  assert.match(confirmHandler, /无论胜负均进入 6 小时冷却/);
  assert.match(appSource, /外围尚有.*需压缩至.*城以内/);
  check(true, '都城仅在敌方缩至 3 城时开放，并在取得锁和写入冷却前复核最新资格、队伍与战斗占用');
}

// 10. 普通领地攻城必须在消耗次数、兵力和行动轮次前重新校验目标与攻击资格。
{
  const marker = appSource.indexOf('{getBattleTimeModifiers().label}模式 · 三阶段');
  const handlerStart = appSource.indexOf('<button type="button" onClick={() => {', marker);
  const handler = appSource.slice(handlerStart, handlerStart + 10000);
  assert.ok(marker >= 0 && handlerStart >= 0);
  const targetCheck = handler.indexOf('const currentTarget = currentKw.territories?.[mid]');
  const ownerCheck = handler.indexOf('currentTarget.owner === currentKw.faction');
  const evaluate = handler.indexOf('const fieldEval = evaluateTerritoryAssault');
  const canAttackCheck = handler.indexOf('if (!fieldEval.canAttack)');
  const lockAcquire = handler.indexOf('kingdomActionLocksRef.current.add(lockKey)');
  const runSiege = handler.indexOf('const result = runThreePhaseSiege');
  const consumeAttempt = handler.indexOf('territorySieges:');
  const triggerEnemy = handler.indexOf('triggerEnemyKingdomActions(nextKw)');
  assert.ok(
    targetCheck >= 0 && ownerCheck > targetCheck && evaluate > ownerCheck &&
    canAttackCheck > evaluate && lockAcquire > canAttackCheck && runSiege > lockAcquire &&
    consumeAttempt > runSiege && triggerEnemy > consumeAttempt
  );
  assert.match(handler, /finally \{[\s\S]{0,120}kingdomActionLocksRef\.current\.delete\(acquiredLockKey\)/);
  assert.doesNotMatch(handler, /setTimeout\(\(\) => kingdomActionLocksRef\.current\.delete/);
  check(true, '过期或非法普通攻城目标不会消耗次数、兵力、战功，也不会触发敌方行动；锁始终由 finally 释放');
}

// 11. 名城争夺同样重新验证目标与配置，且同步结算锁不依赖定时器。
{
  const buttonEnd = appSource.indexOf('}}>发动攻城</button>');
  const handlerStart = appSource.lastIndexOf('<button type="button" onClick={() => {', buttonEnd);
  const handler = appSource.slice(handlerStart, buttonEnd);
  assert.ok(buttonEnd >= 0 && handlerStart >= 0);
  const targetCheck = handler.indexOf('CONTESTED_SIEGE_MAP_IDS.includes(Number(m.id))');
  const latestPreview = handler.indexOf('const latestPreview = evaluateKwSiegeBattle');
  const canAttackCheck = handler.indexOf('if (!latestPreview.canAttack)');
  const lockAcquire = handler.indexOf('kingdomActionLocksRef.current.add(lockKey)');
  const runSiege = handler.indexOf('const siegeResult = runKwSiegeBattle');
  assert.ok(targetCheck >= 0 && latestPreview > targetCheck && canAttackCheck > latestPreview && lockAcquire > canAttackCheck && runSiege > lockAcquire);
  assert.match(handler, /finally \{[\s\S]{0,120}kingdomActionLocksRef\.current\.delete\(acquiredLockKey\)/);
  assert.doesNotMatch(handler, /setTimeout\(\(\) => kingdomActionLocksRef\.current\.delete/);
  check(true, '名城争夺在执行前验证最新目标与 canAttack，并在所有返回路径释放并发锁');
}

// 12. 三波都城攻防按整场记一次国战击杀和帮派任务，而非每波重复累计。
{
  const capitalWinStart = appSource.indexOf("if (battleSnapshot.type === 'capital_siege')");
  const capitalWinEnd = appSource.indexOf('// 9c. 国战战役副本胜利', capitalWinStart);
  const capitalWin = appSource.slice(capitalWinStart, capitalWinEnd);
  assert.ok(capitalWinStart >= 0 && capitalWinEnd > capitalWinStart);
  const waveBranch = capitalWin.indexOf('if (currentWave < totalWaves)');
  const finalLockRelease = capitalWin.indexOf('kingdomActionLocksRef.current.delete(`capital-siege:${siegeTarget}`)');
  const statsUpdate = capitalWin.indexOf('updateBattleWinStats(0, { kwKills: 1 })');
  assert.ok(waveBranch >= 0 && finalLockRelease > waveBranch && statsUpdate > finalLockRelease);
  assert.equal((capitalWin.match(/updateBattleWinStats\(0, \{ kwKills: 1 \}\)/g) || []).length, 1);
  assert.equal((capitalWin.match(/updateGangTaskProgress\('kw_kill', 1\)/g) || []).length, 1);
  assert.equal((capitalWin.match(/updateGangTaskProgress\('battle_win', 1\)/g) || []).length, 1);
  check(true, '都城攻防三波视为一场完整战役，最终胜利时只累计一次成就与帮派任务');
}

// 13. 显式 0 是合法的城防与士气状态，旧档/中间态不能被 || 恢复成默认满值。
{
  const mapId = WAR_MAP_IDS.find(id => !CONTESTED_MAP_IDS.includes(Number(id)));
  const zeroState = buildSiegeCombatParams({
    mapId,
    playerFaction: 'wei',
    allocation: { shield: 10, spear: 10, cavalry: 10, archer: 10, siege: 10, raider: 10 },
    territories: {
      [mapId]: {
        owner: 'shu',
        strength: 0,
        garrison: { shield: 10, spear: 10, cavalry: 10, archer: 10, siege: 10, raider: 10 },
        guards: [],
      },
    },
    kw: { faction: 'wei', morale: 0, eliteTroops: 0 },
  });
  assert.equal(zeroState.strength, 0);
  assert.equal(zeroState.moraleMult, 0.6);

  const defected = applyDefection({
    faction: 'wei',
    morale: 0,
    defectionCount: 0,
    militaryRank: 'civilian',
    warContribution: 0,
    lifetimeContribution: 0,
    recruitedGenerals: [],
  }, 0);
  assert.equal(defected.morale, DEFECTION_CONFIG.moraleFloor);

  const seasonFromZero = applySeasonRewards({
    faction: 'wei',
    warContribution: 0,
    seasonContribution: 0,
    season: 1,
    seasonTitles: [],
    kwManpowerReserve: 0,
    grain: 0,
    eliteTroops: 0,
    morale: 0,
  }, {
    rankings: ['wei', 'shu', 'wu', 'jin', 'qun'],
    season: 1,
  });
  assert.equal(seasonFromZero.morale, 60);

  const threePhaseStart = kwSiegeSource.indexOf('export const runThreePhaseSiege =');
  const threePhaseEnd = kwSiegeSource.indexOf('/** 获取攻城时间修正', threePhaseStart);
  const threePhaseSource = kwSiegeSource.slice(threePhaseStart, threePhaseEnd > threePhaseStart ? threePhaseEnd : undefined);
  assert.match(threePhaseSource, /let strength = t\.strength \?\? 50;/);
  assert.match(threePhaseSource, /let currentMorale = morale \?\? 100;/);
  assert.doesNotMatch(threePhaseSource, /strength \|\| 50|morale \|\| 100/);
  assert.doesNotMatch(kingdomSource, /kw(?:\?|)\.morale \|\| 100|strength \|\| (?:50|60|100)/);
  check(true, '城防 0、士气 0 会保留其真实语义，叛国与赛季重置也不会异常回升');
}

// 14. 其他关键设计阈值。
check(OVEREXTEND_THRESHOLD === 8, `领地达到 ${OVEREXTEND_THRESHOLD} 时进入过度扩张风险区`);
{
  const eliteRatio = 0.5;
  const multiplier = 1 + eliteRatio * (RECRUIT_CONFIG.eliteCombatMult - 1);
  assert.equal(multiplier, 1.15);
  check(true, `50% 精锐比例攻防倍率为 ${multiplier.toFixed(2)}（满精锐约 1.30）`);
}
{
  const gold = 10000;
  const loss = Math.floor(gold * DEFECTION_CONFIG.goldLossPct);
  assert.equal(loss, 6500);
  check(
    DEFECTION_CONFIG.goldLossPct >= 0.5 && DEFECTION_CONFIG.goldLossPct < 1,
    `首次叛国扣金 ${loss}（${Math.round(DEFECTION_CONFIG.goldLossPct * 100)}%），惩罚严厉但不清空全部金币`
  );
}


// 15. 征兵容量、实际收益与资源扣除必须一致；赛季招募券作为资源可结转。
{
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    const full = recruitTroops({
      faction: 'wei', grain: 999, kwManpowerReserve: MANPOWER_RESERVE_CAP, eliteTroops: 0,
    }, 'normal');
    assert.equal(full.ok, false);
    assert.match(full.reason, /已达上限/);

    const nearCap = recruitTroops({
      faction: 'wei', grain: 999, kwManpowerReserve: MANPOWER_RESERVE_CAP - 5, eliteTroops: 0, actionCounter: 7,
    }, 'normal');
    assert.equal(nearCap.ok, true);
    assert.equal(nearCap.gain, 5);
    assert.equal(nearCap.nextKw.kwManpowerReserve, MANPOWER_RESERVE_CAP);
    assert.equal(nearCap.nextKw.grain, 999 - nearCap.grainCost);
    assert.ok(nearCap.goldCost > 0 && nearCap.goldCost < RECRUIT_CONFIG.normalCost.gold);
    assert.ok(nearCap.grainCost > 0 && nearCap.grainCost < RECRUIT_CONFIG.normalCost.grain);
    assert.equal(nearCap.nextKw.actionCounter, 8);

    const eliteNearCap = recruitTroops({
      faction: 'wei', grain: 999, kwManpowerReserve: 1200, eliteTroops: 1197,
    }, 'elite');
    assert.equal(eliteNearCap.gain, 3);
    assert.equal(eliteNearCap.nextKw.eliteTroops, 1200);
    assert.ok(eliteNearCap.goldCost < RECRUIT_CONFIG.eliteCost.gold);

    const noUntrainedReserve = recruitTroops({
      faction: 'wei', grain: 999, kwManpowerReserve: 50, eliteTroops: 50,
    }, 'elite');
    assert.equal(noUntrainedReserve.ok, false);
    assert.match(noUntrainedReserve.reason, /全部完成精锐整训/);
  } finally {
    Math.random = originalRandom;
  }

  const seasonCarry = applySeasonRewards({
    faction: 'wei', warContribution: 0, seasonContribution: 0, season: 1,
    seasonTitles: [], kwManpowerReserve: 0, grain: 0, eliteTroops: 0, morale: 100,
    generalDraws: '4',
  }, { rankings: ['wei', 'shu', 'wu', 'jin', 'qun'], season: 1 });
  assert.equal(seasonCarry.generalDraws, 7);
  check(true, '满兵力征兵不消耗资源，临近上限按真实收益折算费用，未用名将招募次数可跨赛季结转');
}

// 16. 后台 War Tick 不与玩家行动联动叠加成四打一；灭亡 AI 不会凭空复活攻城。
{
  assert.equal(WAR_TICK_CONFIG.aiActionsPerTick, 2);
  assert.equal(WAR_TICK_CONFIG.maxAttacksPerDefenderPerTick, 1);
  const originalRandom = Math.random;
  try {
    Math.random = makeSeededRandom(20260710);
    let territories = initTerritories();
    const tick = executeWarTick(territories, GANG_PRESETS, 'wei', 50);
    assert.ok(tick.log.length <= WAR_TICK_CONFIG.aiActionsPerTick);

    const extinctFaction = 'shu';
    territories = Object.fromEntries(Object.entries(initTerritories()).map(([mapId, territory]) => [mapId, {
      ...territory,
      owner: territory.owner === extinctFaction ? 'qun' : territory.owner,
    }]));
    for (let i = 0; i < 12; i += 1) {
      const result = executeWarTick(territories, GANG_PRESETS, 'wei', 50);
      territories = result.territories;
      assert.ok(result.log.every(entry => entry.attacker !== extinctFaction));
    }
    assert.notEqual(getWeakestFaction(territories), extinctFaction);
  } finally {
    Math.random = originalRandom;
  }

  const playerFactions = ['wei', 'shu', 'wu', 'jin'];
  const runs = 80;
  const catchupTicks = WAR_TICK_CONFIG.maxCatchupTicks;
  const summaries = [];
  try {
    for (const playerFaction of playerFactions) {
      const initialCount = getFactionTerritoryCount(playerFaction, initTerritories());
      let totalFinal = 0;
      let zeroCount = 0;
      for (let run = 0; run < runs; run += 1) {
        Math.random = makeSeededRandom(10000 + run * 97 + playerFaction.charCodeAt(0));
        let territories = initTerritories();
        for (let tickIndex = 0; tickIndex < catchupTicks; tickIndex += 1) {
          territories = executeWarTick(territories, GANG_PRESETS, playerFaction, 50).territories;
        }
        const finalCount = getFactionTerritoryCount(playerFaction, territories);
        totalFinal += finalCount;
        if (finalCount <= 0) zeroCount += 1;
      }
      const averageFinal = totalFinal / runs;
      summaries.push(`${playerFaction}:${averageFinal.toFixed(1)}/${initialCount}`);
      assert.equal(zeroCount, 0, `${playerFaction} 不应因一次离线追赶直接灭国`);
      assert.ok(averageFinal >= initialCount * 0.6, `${playerFaction} 离线追赶平均领地保有率应至少 60%`);
    }
  } finally {
    Math.random = originalRandom;
  }
  check(true, `最大 ${catchupTicks} Tick 离线追赶后平均领地 ${summaries.join('、')}，世界持续演化但不会高频清空玩家战果`);
}


// 17. 驻军生成、守将分配与旧档迁移必须保持精确总量和有限状态。
{
  const originalRandom = Math.random;
  try {
    const requestedTotals = [6, 7, 31, 80, 999, 1_000_000, '120', -50, Number.NaN, Number.POSITIVE_INFINITY];
    for (let seed = 1; seed <= 16; seed += 1) {
      for (const requested of requestedTotals) {
        Math.random = makeSeededRandom(seed * 1009 + String(requested).length);
        const generated = generateGarrison(seed % 2 ? 'wei' : 'shu', requested);
        const numericRequested = Number(requested);
        const expectedTotal = Math.min(
          1_000_000,
          Math.max(6, Number.isFinite(numericRequested) ? Math.floor(numericRequested) : 6),
        );
        assert.deepEqual(Object.keys(generated), KINGDOM_TROOP_KEYS);
        assert.ok(Object.values(generated).every(value => Number.isInteger(value) && value >= 1));
        assert.equal(getGarrisonTotal(generated), expectedTotal);
      }
    }
  } finally {
    Math.random = originalRandom;
  }

  const normalized = normalizeGarrison({
    shield: '12.9', spear: -4, cavalry: Number.POSITIVE_INFINITY,
    archer: Number.NaN, siege: '4', raider: 5, unknown: 999999,
  });
  assert.deepEqual(normalized, { shield: 12, spear: 0, cavalry: 0, archer: 0, siege: 4, raider: 5 });
  assert.equal(getGarrisonTotal({ shield: '12', siege: '4', raider: 5, unknown: 999999 }), 21);
  const capped = normalizeGarrison(Object.fromEntries(KINGDOM_TROOP_KEYS.map(key => [key, 999999])));
  assert.equal(getGarrisonTotal(capped), 1_000_000);
  assert.ok(Object.values(capped).every(value => Number.isInteger(value) && value >= 0));

  Math.random = makeSeededRandom(20260710);
  try {
    const guards = assignTerritoryGuards('wei', 80);
    assert.equal(guards.length, 3);
    assert.equal(new Set(guards.map(guard => guard.generalId)).size, 3);
    assert.ok(guards.every(guard => String(guard.generalId).startsWith('wei_')));
  } finally {
    Math.random = originalRandom;
  }

  const zeroGarrison = Object.fromEntries(KINGDOM_TROOP_KEYS.map(key => [key, 0]));
  const migrated = migrateKingdomWarState({
    faction: 'invalid_faction',
    kwManpowerReserve: 999999,
    eliteTroops: Number.POSITIVE_INFINITY,
    grain: '100',
    grainReserve: '50',
    morale: 999,
    warContribution: -10,
    attackBuff: 'false',
    dailyCounts: { income: 'false', capitalReward: '0', kills: '-3', territorySieges: '2' },
    territories: {
      5: {
        owner: 'hacker', strength: 0, garrison: zeroGarrison,
        guards: [
          { generalId: 'wei_1', name: '篡改名', rarity: 'R', defeated: 'false', recoverActions: 2 },
          { generalId: 'wei_1', defeated: true },
          { generalId: 'shu_1', defeated: false },
        ],
        contested: 'true', attackerFaction: 'shu', attackProgress: 999,
      },
    },
  });
  assert.equal(migrated.faction, null);
  assert.equal(migrated.kwManpowerReserve, MANPOWER_RESERVE_CAP);
  assert.equal(migrated.eliteTroops, 0);
  assert.equal(migrated.grain, 150);
  assert.equal(migrated.morale, 120);
  assert.equal(migrated.warContribution, 0);
  assert.equal(migrated.attackBuff, false);
  assert.equal(migrated.dailyCounts.income, false);
  assert.equal(migrated.dailyCounts.capitalReward, false);
  assert.equal(migrated.territories[5].owner, INITIAL_TERRITORIES[5]);
  assert.equal(migrated.territories[5].strength, 0);
  assert.equal(getGarrisonTotal(migrated.territories[5].garrison), 0);
  assert.equal(migrated.territories[5].guards.length, 1);
  assert.equal(migrated.territories[5].guards[0].name, 'WEI将1');
  assert.equal(migrated.territories[5].guards[0].rarity, 'SSR');
  assert.equal(migrated.territories[5].guards[0].defeated, false);
  assert.equal(migrated.territories[5].guards[0].recoverActions, 0);
  assert.equal(migrated.territories[5].attackProgress, 100);

  const missingGarrison = normalizeKingdomTerritory({ owner: 'wei', strength: 60, guards: [] }, 5);
  const explicitEmptyGarrison = normalizeKingdomTerritory({ owner: 'wei', strength: 60, garrison: {}, guards: [] }, 5);
  assert.ok(getGarrisonTotal(missingGarrison.garrison) > 0);
  assert.equal(getGarrisonTotal(explicitEmptyGarrison.garrison), 0);

  const emptyDefense = buildSiegeCombatParams({
    mapId: 5,
    playerFaction: 'shu',
    allocation: Object.fromEntries(KINGDOM_TROOP_KEYS.map(key => [key, 10])),
    territories: { 5: { owner: 'wei', strength: 0, garrison: zeroGarrison, guards: [] } },
    kw: { faction: 'shu', morale: 100, eliteTroops: 0 },
  });
  assert.equal(emptyDefense.counter, 1);
  assert.ok(emptyDefense.fieldPower > 0);
  assert.ok(Number.isFinite(emptyDefense.winChance));

  const malformedAllocation = buildSiegeCombatParams({
    mapId: 5,
    playerFaction: 'shu',
    allocation: { shield: Number.POSITIVE_INFINITY, spear: '60', cavalry: -4 },
    territories: { 5: { owner: 'wei', strength: 60, garrison: generateGarrison('wei', 80), guards: [] } },
    kw: { faction: 'shu', morale: 100, eliteTroops: 0 },
  });
  assert.equal(malformedAllocation.deploy, 60);
  assert.ok(Number.isFinite(malformedAllocation.fieldPower));
  assert.ok(Number.isFinite(malformedAllocation.winChance));

  Math.random = makeSeededRandom(90210);
  try {
    const malformedTerritories = initTerritories();
    malformedTerritories[5] = {
      ...malformedTerritories[5],
      strength: 'invalid',
      garrison: { shield: '9', spear: -5, cavalry: Number.NaN, archer: Number.POSITIVE_INFINITY, siege: 2, raider: 1 },
    };
    const tick = executeWarTick(malformedTerritories, GANG_PRESETS, 'wei', 50);
    for (const territory of Object.values(tick.territories)) {
      assert.ok(Number.isFinite(territory.strength) && territory.strength >= 0 && territory.strength <= WAR_TICK_CONFIG.maxStrength);
      assert.equal(Object.keys(territory.garrison).length, KINGDOM_TROOP_KEYS.length);
      assert.ok(Object.values(territory.garrison).every(value => Number.isInteger(value) && value >= 0));
      assert.ok(getGarrisonTotal(territory.garrison) <= 1_000_000);
    }
  } finally {
    Math.random = originalRandom;
  }

  const safeProgress = getContestMapProgress({ 1: {
    wei: Number.POSITIVE_INFINITY, shu: '30', wu: -1, jin: 9999, qun: Number.NaN,
  } }, 1);
  assert.deepEqual(safeProgress, { wei: 0, shu: 30, wu: 0, jin: 480, qun: 0 });
  assert.equal(
    resolveContestedMapOwner({ wei: Number.POSITIVE_INFINITY, shu: 20, wu: -1, jin: Number.NaN, qun: 0 }, 'wei', 1),
    'wei',
  );
  const weights = inferDefenseWeights({ wei: Number.POSITIVE_INFINITY, shu: '240', wu: Number.NaN, jin: -2, qun: 480 });
  assert.ok(Object.values(weights).every(value => Number.isFinite(value) && value > 0));
  assert.ok(Math.abs(Object.values(weights).reduce((sum, value) => sum + value, 0) - 1) < 1e-9);
  const malformedSiege = evaluateKwSiegeBattle({
    mapId: CONTESTED_MAP_IDS[0],
    playerFaction: 'wei',
    allocation: { shield: '100', spear: Number.POSITIVE_INFINITY, cavalry: -10 },
    generalIds: [],
    mapProgress: { wei: Number.POSITIVE_INFINITY, shu: '240', wu: Number.NaN, jin: -2, qun: 480 },
  });
  assert.equal(malformedSiege.deploy, 100);
  assert.ok(malformedSiege.counter > 0.55 && Number.isFinite(malformedSiege.counter));
  assert.ok(Number.isFinite(malformedSiege.winChance));
  check(true, '驻军/配兵总量、空城克制、守将去重、旧档迁移与名城权重均保持有限且可结算');
}

// 18. 普通城必须经过持续围城，玩家、AI 和后台结算共用的推进器不得一击易主。
{
  assert.equal(SIEGE_CONFIG.minDeploy, 80);
  assert.ok(SIEGE_CONFIG.maxProgressGain * 2 < SIEGE_CONFIG.progressRequired);
  let territory = {
    owner: 'shu', strength: 0, garrison: generateGarrison('shu', 80), guards: [],
    contested: false, attackerFaction: null, attackProgress: 0,
  };
  const first = advanceTerritorySiege({
    territory, attackerFaction: 'wei', success: true,
    strengthDamage: 999, progressGain: 999,
  });
  assert.equal(first.captured, false);
  assert.equal(first.territory.attackProgress, SIEGE_CONFIG.maxProgressGain);
  const second = advanceTerritorySiege({
    territory: first.territory, attackerFaction: 'wei', success: true,
    strengthDamage: 999, progressGain: 999,
  });
  assert.equal(second.captured, false);
  assert.equal(second.territory.attackProgress, SIEGE_CONFIG.maxProgressGain * 2);
  const third = advanceTerritorySiege({
    territory: second.territory, attackerFaction: 'wei', success: true,
    strengthDamage: 999, progressGain: 999,
  });
  assert.equal(third.captured, true);

  const failed = advanceTerritorySiege({
    territory: second.territory, attackerFaction: 'wei', success: false,
  });
  assert.equal(failed.captured, false);
  assert.equal(failed.territory.attackProgress, SIEGE_CONFIG.maxProgressGain * 2 - SIEGE_CONFIG.failProgressLoss);
  const rivalAttack = advanceTerritorySiege({
    territory: second.territory, attackerFaction: 'wu', success: true,
    strengthDamage: 10, progressGain: 30,
  });
  assert.equal(rivalAttack.territory.attackerFaction, 'wu');
  assert.equal(rivalAttack.territory.attackProgress, 30);
  assert.match(appSource, /result\.success \? 'player_siege_progress' : 'player_siege_fail'/);
  assert.match(appSource, /isSiegeProgress \? '🏰 围城推进'/);
  check(true, `普通城即使城防为 0 也至少需要 3 次有效攻势；失败会瓦解围城，换攻方不会继承进度`);
}

// 19. 兵种职责要形成真实取舍：器械攻坚强但野战弱，且最低兵力门槛不可绕过。
{
  const mapId = WAR_MAP_IDS.find(id => !CONTESTED_MAP_IDS.includes(Number(id)));
  const territories = {
    [mapId]: {
      owner: 'shu', strength: 60, garrison: generateGarrison('shu', 100), guards: [],
    },
  };
  const cavalryArmy = buildSiegeCombatParams({
    mapId, playerFaction: 'wei', allocation: { cavalry: 120 }, territories,
    kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
  });
  const siegeArmy = buildSiegeCombatParams({
    mapId, playerFaction: 'wei', allocation: { siege: 120 }, territories,
    kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
  });
  assert.ok(cavalryArmy.fieldTroops > siegeArmy.fieldTroops);
  assert.ok(siegeArmy.assaultTroops > cavalryArmy.assaultTroops);
  assert.ok(siegeArmy.expectedProgressGain > cavalryArmy.expectedProgressGain);
  assert.ok(cavalryArmy.fieldWinChance > siegeArmy.fieldWinChance);

  const underStrength = evaluateTerritoryAssault({
    mapId, playerFaction: 'wei', allocation: { shield: SIEGE_CONFIG.minDeploy - 1 }, territories,
    kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
  });
  assert.equal(underStrength.canAttack, false);
  assert.match(underStrength.reason, new RegExp(String(SIEGE_CONFIG.minDeploy)));
  const duelWeakened = buildSiegeCombatParams({
    mapId, playerFaction: 'wei', allocation: { shield: 60, siege: 60 },
    territories: { [mapId]: { ...territories[mapId], strength: 35, guards: [] } },
    kw: { faction: 'wei', morale: 115, eliteTroops: 0 },
  });
  const duelLost = buildSiegeCombatParams({
    mapId, playerFaction: 'wei', allocation: { shield: 60, siege: 60 },
    territories: { [mapId]: { ...territories[mapId], strength: 70, guards: [{ defeated: false }] } },
    kw: { faction: 'wei', morale: 80, eliteTroops: 0 },
  });
  assert.ok(duelWeakened.assaultCaptureChance > duelLost.assaultCaptureChance);
  assert.match(kwSiegeSource, /const assaultTerritories = \{[\s\S]*strength, guards/);
  assert.match(kwSiegeSource, /const assaultKw = \{ \.\.\.\(kw \|\| \{\}\), morale: currentMorale \};/);
  assert.match(kwSiegeSource, /territories: assaultTerritories[\s\S]*kw: assaultKw/);
  check(true, '骑兵更擅长野战、攻城器更擅长破城；单挑后的城防、守将和士气会真实进入攻坚结算');
}

// 20. 名城同样不能一战易主，精锐也必须始终是预备兵子集。
{
  assert.equal(CONTEST_CAPTURE_THRESHOLD, 100);
  assert.ok(CONTEST_MAX_OCCUPATION_GAIN * 2 < CONTEST_CAPTURE_THRESHOLD);
  assert.equal(resolveContestedMapOwner({ wei: 28, shu: 10 }, 'wei', CONTESTED_MAP_IDS[0]), 'wei');
  const tooSmall = evaluateKwSiegeBattle({
    mapId: CONTESTED_MAP_IDS[0], playerFaction: 'wei',
    allocation: { shield: CONTEST_SIEGE_MIN_DEPLOY - 1 }, generalIds: [], mapProgress: {},
  });
  assert.equal(tooSmall.canAttack, false);

  const migratedElite = migrateKingdomWarState({
    faction: 'wei', kwManpowerReserve: 40, eliteTroops: 999, territories: {},
  });
  assert.equal(migratedElite.eliteTroops, 40);
  const promoted = recruitTroops({
    faction: 'wei', grain: 999, kwManpowerReserve: 120, eliteTroops: 100,
  }, 'elite');
  assert.equal(promoted.ok, true);
  assert.ok(promoted.nextKw.eliteTroops <= promoted.nextKw.kwManpowerReserve);
  check(true, `名城需达到 ${CONTEST_CAPTURE_THRESHOLD} 占领积分且单胜最多 +${CONTEST_MAX_OCCUPATION_GAIN}；精锐不会超过预备兵`);
}

// 21. 三档普通城的预期节奏应可持续，AI 长期能推进但短期不会洗牌。
{
  const cases = [
    { label: '薄弱边城', strength: 40, garrison: 60, deploy: 140, guards: 1 },
    { label: '标准城池', strength: 60, garrison: 80, deploy: 200, guards: 2 },
    { label: '高防重镇', strength: 80, garrison: 120, deploy: 280, guards: 3 },
  ];
  const summaries = cases.map((entry, index) => {
    const mapId = WAR_MAP_IDS.find(id => !CONTESTED_MAP_IDS.includes(Number(id)));
    const siegeCount = Math.floor(entry.deploy * 0.2);
    const fieldCount = entry.deploy - siegeCount;
    const perFieldType = Math.floor(fieldCount / 5);
    const allocation = {
      shield: perFieldType,
      spear: perFieldType,
      cavalry: perFieldType,
      archer: perFieldType,
      raider: fieldCount - perFieldType * 4,
      siege: siegeCount,
    };
    const combat = buildSiegeCombatParams({
      mapId,
      playerFaction: 'wei',
      allocation,
      territories: {
        [mapId]: {
          owner: 'shu', strength: entry.strength,
          garrison: generateGarrison('shu', entry.garrison),
          guards: Array.from({ length: entry.guards }, (_, guardIndex) => ({
            generalId: `shu_${guardIndex + 1}`, defeated: false,
          })),
        },
      },
      kw: { faction: 'wei', morale: 100, eliteTroops: 0 },
      timeMod: { attackMult: 1, defenseMult: 1, contribMult: 1 },
      remainingGuards: entry.guards,
    });
    const effectiveWins = Math.ceil(SIEGE_CONFIG.progressRequired / combat.expectedProgressGain);
    const expectedAttempts = effectiveWins / Math.max(0.01, combat.winChance);
    assert.ok(combat.winChance >= 0.12 && combat.winChance <= 0.68);
    assert.ok(effectiveWins >= 3 && effectiveWins <= 5);
    assert.ok(expectedAttempts >= 4 && expectedAttempts <= 24);
    assert.ok(combat.expectedDamage >= 6 && combat.expectedDamage <= SIEGE_CONFIG.maxStrengthDamage);
    return `${entry.label}:有效胜率${Math.round(combat.winChance * 100)}%、约${expectedAttempts.toFixed(1)}次行动`;
  });

  const originalRandom = Math.random;
  let longRunCaptures = 0;
  let longRunMaxProgress = 0;
  let longRunContested = 0;
  try {
    Math.random = makeSeededRandom(20260711);
    let territories = initTerritories();
    for (let tickIndex = 0; tickIndex < 300; tickIndex += 1) {
      const tick = executeWarTick(territories, GANG_PRESETS, 'wei', 55);
      territories = tick.territories;
      longRunCaptures += tick.log.filter(entry => entry.type === 'capture').length;
    }
    longRunMaxProgress = Math.max(...Object.values(territories).map(territory => territory.attackProgress || 0));
    longRunContested = Object.values(territories).filter(territory => territory.contested).length;
  } finally {
    Math.random = originalRandom;
  }
  assert.ok(longRunCaptures >= 1, `长期世界演化不应完全停滞（最高围城${longRunMaxProgress}，进行中${longRunContested}）`);
  // 两国行动/Tick 下共有 600 次国家行动；易主率仍应低于约 12%。
  assert.ok(longRunCaptures <= 70, `长期世界演化不应重新变成高频易主（实际 ${longRunCaptures}）`);
  check(true, `${summaries.join('；')}；300 Tick 共 ${longRunCaptures} 次易主`);
}

// 22. 名将录扩充必须唯一，并完整迁移到国战政治状态。各阵营不按人头强行平分。
{
  assert.equal(SANGUO_GENERALS.length, 550);
  assert.equal(new Set(SANGUO_GENERALS.map(general => general.id)).size, SANGUO_GENERALS.length);
  assert.equal(new Set(SANGUO_GENERALS.map(general => general.name)).size, SANGUO_GENERALS.length);
  const factionCounts = Object.fromEntries(['wei', 'shu', 'wu', 'western_jin', 'eastern_jin', 'liu_song', 'northern_wei', 'sixteen_kingdoms', 'neutral'].map(fid => [
    fid,
    SANGUO_GENERALS.filter(general => general.rosterFaction === fid).length,
  ]));
  assert.deepEqual(factionCounts, { wei: 105, shu: 100, wu: 105, western_jin: 46, eastern_jin: 41, liu_song: 19, northern_wei: 8, sixteen_kingdoms: 10, neutral: 116 });
  const migrated = migrateKingdomPolitics({ generals: { unknown_general: { allegiance: 'wei' } } }, SANGUO_GENERALS);
  assert.equal(Object.keys(migrated.generals).length, 550);
  assert.equal(migrated.generals.unknown_general, undefined);
  assert.equal(new Set(Object.keys(migrated.generals)).size, 550);
  assert.equal(migrated.version, 3);
  assert.equal(getHistoricalFactionPoliticalSummaries(migrated, SANGUO_GENERALS).reduce((sum, item) => sum + item.count, 0), 550);
  const fullDexAchievement = ACHIEVEMENTS.find(item => item.id === 'kw_gen_dex200');
  assert.equal(fullDexAchievement.check({ kwGenDexTotal: 549 }), false);
  assert.equal(fullDexAchievement.check({ kwGenDexTotal: 550 }), true);
  check(true, '名将录共 550 位不重复人物，晋及南北朝分属真实政权，旧档迁移后每名将恰好进入一个政治阵营');
}

// 22.1 抽将按稀有度先抽档位，不能因 R 卡数量更多把传世概率稀释到 1% 以下。
{
  const counts = { SSR: 0, SR: 0, R: 0 };
  const random = makeSeededRandom(20260712);
  for (let drawIndex = 0; drawIndex < 20000; drawIndex += 1) {
    const result = drawGeneralFromPool(SANGUO_GENERALS, 0, random);
    counts[result.general.rarity] += 1;
  }
  const ssrRate = counts.SSR / 20000;
  const srRate = counts.SR / 20000;
  assert.ok(Math.abs(ssrRate - GENERAL_DRAW_RATES.SSR) < 0.012, `传世实测概率异常: ${ssrRate}`);
  assert.ok(Math.abs(srRate - GENERAL_DRAW_RATES.SR) < 0.02, `名将实测概率异常: ${srRate}`);

  let pity = 0;
  let finalDraw = null;
  for (let drawIndex = 0; drawIndex < GENERAL_DRAW_PITY; drawIndex += 1) {
    finalDraw = drawGeneralFromPool(SANGUO_GENERALS, pity, () => 0.99);
    pity = finalDraw.nextPity;
  }
  assert.equal(finalDraw.general.rarity, 'SSR');
  assert.equal(finalDraw.guaranteed, true);
  assert.equal(finalDraw.nextPity, 0);
  const migrated = migrateKingdomWarState({ faction: 'wei', generalDrawPity: 7 });
  assert.equal(migrated.generalDrawPity, 7);
  check(true, `名将抽取传世约 ${Math.round(ssrRate * 100)}%、名将约 ${Math.round(srRate * 100)}%，且 ${GENERAL_DRAW_PITY} 抽内必得传世`);
}

// 23. 群雄拆为独立诸侯，不能把十路兵权无损叠成一个超级国家。
{
  const politicalState = createDefaultKingdomPolitics(SANGUO_GENERALS);
  const lords = getQunLordSummaries(politicalState, SANGUO_GENERALS);
  assert.equal(lords.length, QUN_LORDS.length);
  assert.ok(lords.every(lord => lord.count > 0 && lord.commander && lord.deputy));
  assert.equal(lords.reduce((sum, lord) => sum + lord.count, 0), 116);
  const totalReadiness = lords.reduce((sum, lord) => sum + lord.readiness, 0);
  const confederationPower = getFactionGeneralPower(politicalState, SANGUO_GENERALS, 'qun');
  assert.ok(confederationPower <= (lords[0].readiness + lords[1].readiness * 0.31));
  assert.ok(confederationPower < totalReadiness * 0.5);
  const initialBrief = buildKingdomStrategicBrief({
    faction: 'wei',
    territories: initTerritories(),
    kwManpowerReserve: 420,
    grain: 200,
    contestProgress: {},
    politics: politicalState,
  }, { today: '2026-07-12', rankIdx: 3, seasonDaysLeft: 7 });
  if (initialBrief.rival?.fid === 'qun') {
    assert.ok(initialBrief.rival.count < initialBrief.rival.actualCount);
    assert.ok(initialBrief.rival.lordCount >= 2);
  }
  assert.ok(initialBrief.campaignDifficulty < 100, `标准开局不应被群雄总城数误判为满压: ${initialBrief.campaignDifficulty}`);
  check(true, `群雄 ${lords.length} 路诸侯各有主副将，联军只能调用最强本部与次强约三成兵权`);
}

// 24. 外交必须有成本门槛、行动上限，并同时约束玩家与 AI 的攻击许可。
{
  let politicalState = createDefaultKingdomPolitics(SANGUO_GENERALS);
  const envoy = applyDiplomaticAction({
    politics: politicalState, generals: SANGUO_GENERALS, actor: 'shu', target: 'wu', action: 'envoy', dateKey: '2026-07-11',
  });
  assert.equal(envoy.ok, true);
  assert.equal(envoy.tokenCost, DIPLOMACY_CONFIG.envoyCost);
  politicalState = envoy.politics;
  const pact = applyDiplomaticAction({
    politics: politicalState, generals: SANGUO_GENERALS, actor: 'shu', target: 'wu', action: 'pact', dateKey: '2026-07-11',
  });
  assert.equal(pact.ok, true);
  assert.equal(canFactionAttack(pact.politics, 'shu', 'wu').ok, false);
  assert.equal(canFactionAttack(pact.politics, 'wu', 'shu').ok, false);
  const targetLockedPolitics = {
    ...pact.politics,
    dailyActionDate: null,
    dailyActionCount: 0,
    relations: Object.fromEntries(Object.keys(pact.politics.relations).map(key => [key, 80])),
  };
  const duplicateTargetPact = applyDiplomaticAction({
    politics: targetLockedPolitics, generals: SANGUO_GENERALS, actor: 'jin', target: 'wu', action: 'pact', dateKey: '2026-07-12',
  });
  assert.equal(duplicateTargetPact.ok, false);
  assert.match(duplicateTargetPact.reason, /双方|一份/);
  const overLimit = applyDiplomaticAction({
    politics: pact.politics, generals: SANGUO_GENERALS, actor: 'shu', target: 'wei', action: 'envoy', dateKey: '2026-07-11',
  });
  assert.equal(overLimit.ok, false);

  const coalition = applyDiplomaticAction({
    politics: createDefaultKingdomPolitics(SANGUO_GENERALS), generals: SANGUO_GENERALS,
    actor: 'shu', target: 'wu', action: 'coalition', dateKey: '2026-07-11',
    territoryCounts: { wei: 5, shu: 5, wu: 4, jin: 6, qun: 12 },
  });
  assert.equal(coalition.ok, true);
  assert.equal(coalition.politics.coalitions[0].target, 'qun');
  const duplicateCoalition = applyDiplomaticAction({
    politics: {
      ...coalition.politics,
      dailyActionDate: null,
      dailyActionCount: 0,
      relations: Object.fromEntries(Object.keys(coalition.politics.relations).map(key => [key, 20])),
    },
    generals: SANGUO_GENERALS,
    actor: 'jin', target: 'wu', action: 'coalition', dateKey: '2026-07-12',
    territoryCounts: { wei: 5, shu: 5, wu: 4, jin: 6, qun: 12 },
  });
  assert.equal(duplicateCoalition.ok, false);
  assert.match(duplicateCoalition.reason, /联合阵线/);
  const tokenSiegeSource = appSource.slice(appSource.indexOf("if (item.id === 'siege')"), appSource.indexOf("if (item.id === 'flag')"));
  assert.ok(tokenSiegeSource.includes('canFactionAttack(currentKw.politics'));
  const capitalSiegeSource = appSource.slice(appSource.indexOf("title:'⚔️ 攻城确认'"), appSource.indexOf("console.error('capital siege start:'"));
  assert.ok(capitalSiegeSource.includes('canFactionAttack(currentKw.politics'));
  check(true, '修好→缔约需要两次行动，盟约双向禁战；目标国不可重复签约或加入多条联合阵线');
}

// 25. 将领事件每 Tick 至多一个，诈降会按期揭晓，自立与兵力变化均有硬上限。
{
  let politicalState = createDefaultKingdomPolitics(SANGUO_GENERALS);
  politicalState.worldTick = 1;
  Object.values(politicalState.generals).forEach(state => { state.cooldownUntilTick = 999; });
  const spy = SANGUO_GENERALS.find(general => general.faction === 'wei');
  Object.assign(politicalState.generals[spy.id], { loyalty: 10, ambition: 20, cunning: 100, cooldownUntilTick: 0 });
  let manpower = { wei: 400, shu: 400, wu: 400, jin: 400, qun: 300 };
  let step = advanceKingdomPolitics({
    politics: politicalState, generals: SANGUO_GENERALS,
    territoryCounts: { wei: 5, shu: 5, wu: 4, jin: 6, qun: 12 }, factionManpower: manpower, random: () => 0,
  });
  assert.equal(step.events.length, 1);
  assert.equal(step.events[0].type, 'feigned_surrender');
  politicalState = step.politics; manpower = step.factionManpower;
  for (let tick = 0; tick < 3; tick += 1) {
    step = advanceKingdomPolitics({
      politics: politicalState, generals: SANGUO_GENERALS,
      territoryCounts: { wei: 5, shu: 5, wu: 4, jin: 6, qun: 12 }, factionManpower: manpower, random: () => 1,
    });
    assert.ok(step.events.length <= 1);
    politicalState = step.politics; manpower = step.factionManpower;
  }
  assert.equal(politicalState.generals[spy.id].allegiance, 'wei');
  assert.equal(politicalState.generals[spy.id].status, 'serving');
  assert.equal(politicalState.plots.length, 0);
  assert.ok(Object.values(manpower).every(value => Number.isFinite(value) && value >= 0));
  assert.equal(Object.keys(politicalState.generals).length, 550);
  const zeroState = migrateKingdomPolitics({
    trust: 0,
    generals: { [spy.id]: { ...politicalState.generals[spy.id], loyalty: 0, ambition: 0, cunning: 0 } },
  }, SANGUO_GENERALS);
  assert.equal(zeroState.trust, 0);
  assert.equal(zeroState.generals[spy.id].loyalty, 0);
  assert.equal(zeroState.generals[spy.id].ambition, 0);
  assert.equal(zeroState.generals[spy.id].cunning, 0);
  zeroState.generals[spy.id].status = 'feigned';
  zeroState.generals[spy.id].allegiance = 'shu';
  const seasonReset = resetKingdomPoliticsForSeason(zeroState, SANGUO_GENERALS);
  assert.equal(seasonReset.generals[spy.id].status, 'serving');
  assert.equal(seasonReset.generals[spy.id].allegiance, 'wei');
  check(true, '诈降三回合后揭晓且将领不丢失；重大阴谋每回合最多一个、兵力不会变成负数');
}

// 25.1 真实政权参与国战，晋系联军有协同折损；南北朝人才可被五方延揽。
{
  const basePolitics = createDefaultKingdomPolitics(SANGUO_GENERALS);
  const campPowers = Object.fromEntries(['wei', 'shu', 'wu', 'jin'].map(fid => [
    fid, getFactionGeneralPower(basePolitics, SANGUO_GENERALS, fid),
  ]));
  const powerValues = Object.values(campPowers);
  assert.ok(Math.max(...powerValues) / Math.min(...powerValues) <= 1.2, `真实政权拆分后联军统御失衡: ${JSON.stringify(campPowers)}`);
  assert.ok(getFactionGeneralPower(basePolitics, SANGUO_GENERALS, 'jin') < getFactionPoliticalSummary(basePolitics, SANGUO_GENERALS, 'jin').power);

  const oldPolitics = migrateKingdomPolitics({
    version: 2,
    worldTick: 1,
    plots: [{ generalId: 'jin_sima_yi', homeFaction: 'jin', targetFaction: 'shu', revealTick: 4 }],
    generals: {
      jin_sima_yi: { homeFaction: 'jin', allegiance: 'shu', loyalty: 70, status: 'feigned' },
      jin_liu_yu: { homeFaction: 'jin', allegiance: 'wei', loyalty: 50 },
    },
  }, SANGUO_GENERALS);
  assert.equal(oldPolitics.generals.jin_sima_yi.homeFaction, 'wei');
  assert.equal(oldPolitics.generals.jin_sima_yi.allegiance, 'shu');
  assert.equal(oldPolitics.plots[0].homeFaction, 'wei');
  assert.equal(oldPolitics.plots[0].targetFaction, 'shu');
  assert.equal(oldPolitics.generals.jin_liu_yu.homeFaction, 'liu_song');
  assert.equal(oldPolitics.generals.jin_liu_yu.allegiance, 'wei');

  const expectedTargets = { wei: 'wei', shu: 'shu', wu: 'wu', jin: 'western_jin', qun: 'qun' };
  for (const [targetWarCamp, expectedAllegiance] of Object.entries(expectedTargets)) {
    const result = inviteGeneralToFaction({
      politics: basePolitics,
      generals: SANGUO_GENERALS,
      generalId: 'jin_tuoba_gui',
      targetWarCamp,
      dateKey: '2026-07-12',
      random: () => 0,
    });
    assert.equal(result.ok, true);
    assert.equal(result.succeeded, true);
    assert.equal(result.politics.generals.jin_tuoba_gui.allegiance, expectedAllegiance);
  }
  const ineligible = inviteGeneralToFaction({
    politics: basePolitics, generals: SANGUO_GENERALS, generalId: 'jin_sima_yan', targetWarCamp: 'shu', dateKey: '2026-07-12', random: () => 0,
  });
  assert.equal(ineligible.ok, false);
  check(true, `真实政权独立计忠诚与主副将；联军统御 ${JSON.stringify(campPowers)}；刘宋/北魏人才可被五方延揽`);
}

// 26. 名城结算失败保持原状态，合法胜利也不能一战夺城。
{
  const mapId = CONTESTED_MAP_IDS[0];
  const baseKw = {
    faction: 'wei', kwManpowerReserve: 200, eliteTroops: 40, contestProgress: {},
    territories: { [mapId]: { owner: 'qun', strength: 80 } },
    warContribution: 0, seasonContribution: 0, lifetimeContribution: 0, factionTokens: 0,
    actionCounter: 0, currentTurn: 0, attackBuff: true,
  };
  const snapshot = JSON.stringify(baseKw);
  const invalid = settleContestSiegeAttempt({
    kw: baseKw, mapId, allocation: { shield: 10 }, siegeResult: { victory: true, occupationGain: 35, manpowerLost: 5 }, dateKey: '2026-07-11',
  });
  assert.equal(invalid.ok, false);
  assert.equal(JSON.stringify(baseKw), snapshot);
  const settled = settleContestSiegeAttempt({
    kw: baseKw, mapId, allocation: { shield: 100 }, siegeResult: { victory: true, occupationGain: 35, manpowerLost: 20 }, dateKey: '2026-07-11',
    contributionGain: 24, tokenGain: 3,
  });
  assert.equal(settled.ok, true);
  assert.equal(settled.kw.territories[mapId].owner, 'qun');
  assert.equal(settled.kw.contestProgress[mapId].wei, 35);
  assert.equal(settled.kw.kwManpowerReserve, 180);
  assert.equal(settled.kw.attackBuff, false);
  const contestedUi = appSource.slice(appSource.indexOf("kwTab === 'contested'"), appSource.indexOf("kwTab === 'capital'"));
  const maxAttemptsDeclaration = contestedUi.indexOf('const maxDailyAttempts = 3');
  const mapLoop = contestedUi.indexOf('contestedMaps.map');
  const settlementCall = contestedUi.indexOf('settleContestSiegeAttempt');
  assert.ok(maxAttemptsDeclaration >= 0 && maxAttemptsDeclaration < mapLoop && settlementCall > mapLoop);
  check(true, '名城非法结算不改档不扣兵；首次合法胜利只推进 35/100 占领度');
}

// 26.1 可调上限不能变成强制满编；最低兵力到当前上限之间都应可出征。
{
  const minimum = validateSiegeDeployment({
    allocation: { shield: CONTEST_SIEGE_MIN_DEPLOY },
    maxDeploy: 600,
    reserve: 500,
  });
  const partial = validateSiegeDeployment({
    allocation: { shield: 120, spear: 120, siege: 110 },
    maxDeploy: 600,
    reserve: 500,
  });
  const tooSmall = validateSiegeDeployment({
    allocation: { shield: CONTEST_SIEGE_MIN_DEPLOY - 1 },
    maxDeploy: 600,
    reserve: 500,
  });
  const aboveCap = validateSiegeDeployment({
    allocation: { shield: 601 },
    maxDeploy: 600,
    reserve: 800,
  });
  const aboveReserve = validateSiegeDeployment({
    allocation: { shield: 501 },
    maxDeploy: 600,
    reserve: 500,
  });
  assert.equal(minimum.ok, true);
  assert.equal(partial.ok, true);
  assert.equal(tooSmall.ok, false);
  assert.equal(aboveCap.ok, false);
  assert.equal(aboveReserve.ok, false);
  assert.equal((appSource.match(/validateSiegeDeployment\(\{/g) || []).length, 2);
  assert.doesNotMatch(appSource, /兵力合计须等于/);
  assert.match(appSource, /最低出征/);
  assert.match(appSource, /均分上限/);
  check(true, '普通城与名城允许最低兵力至军衔上限之间自由配兵，不再强制满编出征');
}

// 26.2 旧档重复名将不能重复占位或叠加全局收益。
{
  const duplicate = { ...MOCK_GENERALS[0], bonus: { gold: 5 } };
  const migrated = migrateKingdomWarState({
    faction: 'wei',
    recruitedGenerals: [duplicate, { ...duplicate }],
    territories: {},
  });
  assert.equal(migrated.recruitedGenerals.length, 1);
  assert.equal(migrated.recruitedGenerals[0].id, duplicate.id);
  check(true, '旧存档重复名将按 ID 去重，无法重复占位或叠加收益');
}

// 27. 静置玩家不享受个人战力加成，赛季胜者不能由初始领地顺序锁死。
{
  assert.match(kingdomSource, /calcFactionPower\(attackerFid, newTerritories, gangPresets, null, 50, 0, politics, qunLord\?\.id\)/);
  const winners = Object.fromEntries(ALL_FACTION_IDS.map(fid => [fid, 0]));
  const seeds = 24;
  const ticksPerRun = 140;
  const originalRandom = Math.random;
  try {
    for (let run = 0; run < seeds; run += 1) {
      Math.random = makeSeededRandom(60000 + run * 7919);
      let territories = initTerritories();
      let politicalState = createDefaultKingdomPolitics(MOCK_GENERALS);
      let factionManpower = { wei: 400, shu: 400, wu: 400, jin: 400, qun: 300 };
      const playerFaction = ['wei', 'shu', 'wu', 'jin'][run % 4];
      for (let tick = 0; tick < ticksPerRun; tick += 1) {
        const result = executeWarTick(territories, GANG_PRESETS, playerFaction, 100, 9999, { politics: politicalState, factionManpower });
        territories = result.territories;
        politicalState = result.politics;
        factionManpower = result.factionManpower;
      }
      const season = checkSeasonEnd({
        seasonStartDate: new Date(Date.now() - 8 * 86400000).toISOString(), season: 1, territories, politics: politicalState,
      });
      winners[season.rankings[0]] += 1;
    }
  } finally {
    Math.random = originalRandom;
  }
  const winnerFactions = Object.values(winners).filter(count => count > 0).length;
  const maxWins = Math.max(...Object.values(winners));
  assert.ok(winnerFactions >= 4, `至少应有四方能夺冠，实际 ${JSON.stringify(winners)}`);
  assert.ok(maxWins <= Math.ceil(seeds * 0.45), `任何一方静置夺冠率不得超过 45%，实际 ${JSON.stringify(winners)}`);
  check(true, `24 组静置赛季胜者分布 ${Object.entries(winners).map(([fid, count]) => `${fid}:${count}`).join('、')}`);
}

console.log('\n=== 国战检查全部通过 ===');
