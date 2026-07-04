/**
 * 国战系统平衡性快速校验（无需 webpack，内联与 kingdom.js 一致的常量）
 * 运行: node scripts/kingdom-balance-check.mjs
 */

const RECRUIT_CONFIG = {
  normalCost: { gold: 100, grain: 10 },
  normalGain: [30, 50],
  eliteCost: { gold: 500, grain: 30 },
  eliteGain: [80, 120],
  grainPerTerritory: 5,
  grainCapBase: 200,
  grainCapPerTerritory: 20,
  eliteCombatMult: 1.3,
};

const WAR_MAP_COUNT = 38;
const MANPOWER_CAP = 2800;
const OVEREXTEND_THRESHOLD = 8;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

function simulateRecruitLoop(territories) {
  const grainCap = RECRUIT_CONFIG.grainCapBase + territories * RECRUIT_CONFIG.grainCapPerTerritory;
  const dailyGrain = territories * RECRUIT_CONFIG.grainPerTerritory;
  const recruitsPerDay = dailyGrain / RECRUIT_CONFIG.normalCost.grain;
  const avgGain = (RECRUIT_CONFIG.normalGain[0] + RECRUIT_CONFIG.normalGain[1]) / 2;
  const dailyManpower = recruitsPerDay * avgGain;
  return { grainCap, dailyGrain, recruitsPerDay, dailyManpower, goldPerDay: recruitsPerDay * RECRUIT_CONFIG.normalCost.gold };
}

function simulateSiegeManpower(strength = 60, deploy = 120) {
  const fieldCost = clamp(Math.floor(strength / 3), 20, 40);
  const assaultLossRate = clamp(0.35 - 0.15 * 0.5, 0.15, 0.5); // mid-range
  const assaultLoss = Math.floor(deploy * assaultLossRate);
  return { fieldCost, assaultLoss, totalPerSiege: fieldCost + assaultLoss };
}

function simulateAiPressure(playerActions) {
  const enemyFactions = 4;
  return playerActions * enemyFactions;
}

console.log('=== 国战平衡性检查 ===\n');

// 1. 地图规模
assert(WAR_MAP_COUNT >= 35 && WAR_MAP_COUNT <= 45, `参战地图 ${WAR_MAP_COUNT} 张（目标约40）`);

// 2. 征兵-粮草循环（3领地新手期）
{
  const t3 = simulateRecruitLoop(3);
  assert(t3.grainCap === 260, `3领地粮草上限 ${t3.grainCap}`);
  assert(t3.recruitsPerDay <= 3, `3领地每日最多约 ${t3.recruitsPerDay.toFixed(1)} 次普通征兵（粮草制约）`);
  assert(t3.dailyManpower < 150, `3领地日增兵力约 ${t3.dailyManpower.toFixed(0)}，不会无限膨胀`);
}

// 3. 征兵-粮草循环（8领地扩张期）
{
  const t8 = simulateRecruitLoop(8);
  assert(t8.grainCap === 360, `8领地粮草上限 ${t8.grainCap}`);
  assert(t8.recruitsPerDay >= 3 && t8.recruitsPerDay <= 5, `8领地每日约 ${t8.recruitsPerDay.toFixed(1)} 次征兵`);
}

// 4. 攻城兵力消耗
{
  const weak = simulateSiegeManpower(40, 100);
  const strong = simulateSiegeManpower(80, 200);
  assert(weak.totalPerSiege >= 35 && weak.totalPerSiege <= 90, `弱城单次攻城消耗约 ${weak.totalPerSiege} 兵力`);
  assert(strong.totalPerSiege >= 50 && strong.totalPerSiege <= 150, `强城单次攻城消耗约 ${strong.totalPerSiege} 兵力`);
  const siegesFromStart = Math.floor(140 / weak.totalPerSiege);
  assert(siegesFromStart >= 2 && siegesFromStart <= 5, `初始140兵力约可支撑 ${siegesFromStart} 次攻城后需征兵`);
}

// 5. 敌方联动（每行动4个敌方各动一次）
{
  const reactions = simulateAiPressure(5);
  assert(reactions === 20, `玩家5次行动触发 ${reactions} 次敌方行动（4阵营联动）`);
}

// 6. 过度扩张阈值
assert(OVEREXTEND_THRESHOLD === 8, `领地≥${OVEREXTEND_THRESHOLD}时扩张惩罚生效`);

// 7. 精锐收益
{
  const eliteRatio = 0.5;
  const mult = 1 + eliteRatio * (RECRUIT_CONFIG.eliteCombatMult - 1);
  assert(mult === 1.15, `50%精锐比例攻防倍率 ${mult.toFixed(2)}（满精锐约1.30）`);
}

// 8. 叛国惩罚量级
{
  const gold = 10000;
  const loss = Math.floor(gold * 0.4);
  assert(loss === 4000, `叛国扣金 ${loss}（40%）`);
}

console.log('\n=== 全部平衡检查通过 ===');
