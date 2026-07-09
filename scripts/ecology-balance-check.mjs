/**
 * 生态玩法平衡与边界回归校验。
 * 运行: node scripts/ecology-balance-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const loadSourceModule = async (relativePath, transform = source => source) => {
  const sourceUrl = new URL(`../${relativePath}`, import.meta.url);
  const source = transform(await readFile(sourceUrl, 'utf8'));
  const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return import(dataUrl);
};

const eco = await loadSourceModule('src/data/ecoEvents.js', source =>
  source.replace(
    "import { getEcoCrisisByMapId } from './ecoCrises';",
    'const getEcoCrisisByMapId = () => null;'
  )
);
const calamities = await loadSourceModule('src/data/nationalCalamities.js');
const appSource = await readFile(new URL('../src/App.js', import.meta.url), 'utf8');

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

console.log('=== 生态玩法平衡与边界检查 ===\n');

// 1. 0 是合法生态值，不应被 || 默认值覆盖。
{
  const zeroEcology = {
    water: 0,
    vegetation: 0,
    spirit: 0,
    pollution: 0,
    stability: 0,
    diversity: 0,
  };
  const health = eco.getEcologyHealth(zeroEcology);
  assert.equal(health, 100 / eco.ECO_METRIC_KEYS.length);
  check(
    health < 20,
    `全零生态健康度为 ${health.toFixed(2)}，水源等 0 值未错误回退为 50`
  );

  const cleanPollutionHealth = eco.getEcologyHealth({
    ...eco.DEFAULT_ECOLOGY,
    pollution: 0,
  });
  const expected = (
    eco.DEFAULT_ECOLOGY.water +
    eco.DEFAULT_ECOLOGY.vegetation +
    eco.DEFAULT_ECOLOGY.spirit +
    100 +
    eco.DEFAULT_ECOLOGY.stability +
    eco.DEFAULT_ECOLOGY.diversity
  ) / eco.ECO_METRIC_KEYS.length;
  assert.equal(cleanPollutionHealth, expected);
  check(
    cleanPollutionHealth === expected,
    '污染值 0 按“完全清洁”计分，未回退到默认污染 30'
  );
}

// 2. 污染必须是负向指标，并同时影响生态评级和区域阶段。
{
  const base = {
    water: 70,
    vegetation: 70,
    spirit: 70,
    pollution: 0,
    stability: 70,
    diversity: 70,
  };
  const polluted = { ...base, pollution: 90 };
  const cleanHealth = eco.getEcologyHealth(base);
  const pollutedHealth = eco.getEcologyHealth(polluted);
  check(
    cleanHealth > pollutedHealth,
    `污染从 0 升至 90 后健康度由 ${cleanHealth.toFixed(2)} 降至 ${pollutedHealth.toFixed(2)}`
  );
  assert.equal(eco.getEcologyTier(polluted).tier, 'polluted');
  check(true, '高污染生态正确标记为“污染严重”');

  const cleanStage = eco.getRegionStage(1, base, [], 99).stage;
  const pollutedStage = eco.getRegionStage(1, polluted, [], 99).stage;
  check(
    cleanStage > pollutedStage,
    `同一地区高污染使阶段由 ${cleanStage} 降至 ${pollutedStage}`
  );
}

// 3. 区域连锁只能由本次发生变化的来源地图触发，避免跨图误结算。
{
  const chains = [{
    fromMap: 1,
    toMap: 4,
    condition: { pollution: { min: 55 } },
    effect: { water: -10, pollution: 8 },
  }];
  const ecologyByMap = {
    1: { ...eco.DEFAULT_ECOLOGY, pollution: 60 },
    4: { ...eco.DEFAULT_ECOLOGY, water: 80, pollution: 20 },
    5: { ...eco.DEFAULT_ECOLOGY, pollution: 10 },
  };

  const unrelated = eco.applyRegionChains(ecologyByMap, chains, 5);
  assert.deepEqual(unrelated, ecologyByMap);
  check(true, '修改无关地图 5 时，不会误触地图 1 → 4 的区域连锁');

  const related = eco.applyRegionChains(ecologyByMap, chains, 1);
  assert.equal(related[4].water, 70);
  assert.equal(related[4].pollution, 28);
  check(true, '修改正确来源地图 1 时，只结算对应的下游生态影响');
}

// 4. 全国灵灾使用 ISO 周键，周一切换且跨月仍保持同周一致。
{
  const monday = calamities.getCalamityWeekKey('2026-06-29');
  const sunday = calamities.getCalamityWeekKey('2026-07-05');
  const nextMonday = calamities.getCalamityWeekKey('2026-07-06');
  assert.equal(monday, sunday);
  assert.notEqual(sunday, nextMonday);
  check(monday === '2026-W27', `2026-06-29 的 ISO 周键为 ${monday}`);
  check(sunday === monday, '跨月的 2026-07-05 仍与 2026-06-29 属于同一周');
  check(nextMonday === '2026-W28', `2026-07-06 正确切换为下一周 ${nextMonday}`);

  const mondaySet = calamities.getActiveNationalCalamities('2026-06-29', 99).map(c => c.id);
  const sundaySet = calamities.getActiveNationalCalamities('2026-07-05', 99).map(c => c.id);
  assert.deepEqual(mondaySet, sundaySet);
  check(true, '同一 ISO 周内跨月日期生成完全一致的全国灵灾列表');
}

// 5. 战斗救助只发放一次结构化事件奖励，且战斗入口必须允许显式 0 掉落。
{
  assert.match(appSource, /let dropGold = context\?\.drop \?\? baseGold;/);
  assert.match(appSource, /else if \(type === 'eco_crisis'\) \{[\s\S]{0,240}dropGold = context\.drop \?\? 2000;/);
  assert.match(appSource, /drop: 0,\s*_nonCombatRescue: event\.id,/);
  assert.match(appSource, /const randomDropBonus = normalizedDrop > 0 \? _\.random\(0, 20\) : 0;/);
  assert.doesNotMatch(appSource, /const baseDropGold = \(drop \+ _\.random\(0, 20\)\)/);
  assert.match(appSource, /grantNonCombatReward\(rescueEvt\);/);
  const fightBranchStart = appSource.indexOf("if (event.branches && branchId === 'fight')");
  const fightBranch = appSource.slice(fightBranchStart, fightBranchStart + 1400);
  assert.ok(fightBranchStart >= 0);
  assert.ok(fightBranch.indexOf('livingLead') >= 0);
  assert.ok(fightBranch.indexOf('livingLead') < fightBranch.indexOf('ecoActionLocksRef.current.add(lockKey)'));
  check(true, '战斗救助显式 0 掉落贯穿战斗入口与结算，且全灭队伍不会占用救助锁');
}

console.log('\n=== 生态玩法检查全部通过 ===');
