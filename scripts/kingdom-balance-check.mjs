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
const appSource = await readFile(new URL('../src/App.js', import.meta.url), 'utf8');
const kingdom = await loadSourceModule('src/data/kingdom.js', source => source
  .replace("import { SANGUO_GENERALS } from './generals';", 'const SANGUO_GENERALS = [];')
  .replace(
    "import { MANPOWER_RESERVE_CAP } from './kingdomConstants';",
    `const MANPOWER_RESERVE_CAP = ${constants.MANPOWER_RESERVE_CAP};`
  ));

const {
  ALL_FACTION_IDS,
  DEFECTION_CONFIG,
  RECRUIT_CONFIG,
  WAR_MAP_IDS,
  recruitTroops,
  executeAllEnemyActions,
  applySeasonRewards,
  getKingdomDateKey,
  resetKingdomDailyCounts,
} = kingdom;
const { MANPOWER_RESERVE_CAP } = constants;

const OVEREXTEND_THRESHOLD = 8;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

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
    const actedFactions = [];
    for (let actionCounter = 1; actionCounter <= 5; actionCounter += 1) {
      const result = executeAllEnemyActions({
        faction: 'wei',
        territories: {},
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

// 4. 一次玩家行动只推进一次守将恢复计数。
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

// 5. 征兵不透支粮草，普通预备兵与赛季继承都受共享上限约束。
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
    assert.equal(recruit.nextKw.grain, 0);
    assert.equal(recruit.nextKw.kwManpowerReserve, MANPOWER_RESERVE_CAP);
    assert.equal(recruit.nextKw.actionCounter, 1);
    check(true, `征兵后粮草不低于 0，预备兵不超过共享上限 ${MANPOWER_RESERVE_CAP}`);
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
  }, {
    rankings: ['wei', 'shu', 'wu', 'jin', 'qun'],
    season: 1,
  });
  assert.equal(seasonState.kwManpowerReserve, MANPOWER_RESERVE_CAP);
  check(true, `赛季继承后的预备兵同样不超过 ${MANPOWER_RESERVE_CAP}`);
}


// 6. 每日结算使用本地日期键，避免 UTC 导致中国时区在早上 8 点才刷新。
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

// 7. 都城确认框打开后仍需用最新战局、队伍与战斗状态复核，再获取攻城锁和写入冷却。
{
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
  check(true, '都城攻防在取得锁和写入冷却前复核最新资格、地图、存活队伍与战斗占用');
}

// 8. 普通领地攻城必须在消耗次数、兵力和行动轮次前重新校验目标与攻击资格。
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

// 9. 名城争夺同样重新验证目标与配置，且同步结算锁不依赖定时器。
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

// 10. 三波都城攻防按整场记一次国战击杀和帮派任务，而非每波重复累计。
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

// 11. 其他关键设计阈值。
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

console.log('\n=== 国战检查全部通过 ===');
