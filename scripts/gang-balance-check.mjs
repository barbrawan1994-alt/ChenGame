/**
 * 帮战目标预估、收益归属与难度标签回归校验。
 * 运行: node scripts/gang-balance-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/data/gang.js', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const gang = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const appSource = await readFile(new URL('../src/App.js', import.meta.url), 'utf8');

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

const targetGang = {
  id: 'balance_target',
  name: '平衡校验帮派',
  level: 5,
  faction: 'shu',
  skills: { gs_trade: 2, gs_contrib: 2 },
};

const evaluate = (partyAvgLevel, isOwner = false) => gang.evaluateGangWarTarget({
  targetGang,
  ownGang: { funds: 1000 },
  kingdomWar: { faction: 'wei' },
  partyAvgLevel,
  isOwner,
});

console.log('=== 帮战目标与收益平衡检查 ===\n');

// 实战敌队为 enemyLv 到 enemyLv-5，Lv.75 目标的均级应为 72.5。
{
  const result = evaluate(40);
  assert.equal(result.enemyLv, 75);
  assert.equal(result.enemyAvgLevel, 72.5);
  check(result.winChance === 0.08, `Lv.40 挑战均级 Lv.${result.enemyAvgLevel} 时胜率压到下限 8%`);
  check(result.riskLabel === '高危', '明显越级目标正确标记为“高危”');
  check(result.preparation.length >= 2, '高危目标给出升级与配队准备建议');
}

// 均级相当约 50%，高 10 级应明显占优，和实际战斗等级差保持一致。
{
  const even = evaluate(72.5);
  const ahead = evaluate(82.5);
  assert.equal(even.winChance, 0.5);
  assert.ok(Math.abs(ahead.winChance - 0.85) < 1e-9);
  check(even.riskLabel === '胶着', '双方均级一致时预估为 50% 胶着局');
  check(ahead.riskLabel === '稳胜', '玩家均级高 10 级时预估为 85% 稳胜局');
}

// 普通成员不会获得帮派资金，目标排序也不能把无权取得的资金计入收益。
{
  const member = evaluate(72.5, false);
  const owner = evaluate(72.5, true);
  const expectedMemberScore = Math.round(
    member.reward.contribution * 1.4 + member.enemyLv * 0.35
  );
  const expectedOwnerScore = Math.round(
    owner.reward.contribution * 1.4 + owner.reward.funds / 180 + owner.enemyLv * 0.35
  );
  assert.equal(member.rewardScore, expectedMemberScore);
  assert.equal(owner.rewardScore, expectedOwnerScore);
  check(member.rewardScore < owner.rewardScore, '只有帮主的目标收益评分计入帮派资金价值');
  check(
    owner.rewardScore - member.rewardScore >= Math.floor(owner.reward.funds / 180),
    '帮主与普通成员的收益评分差符合资金归属规则'
  );
}

// 全灭状态应在取得帮战锁之前被拦截，避免一次失败启动让按钮永久失效。
{
  const handlerStart = appSource.indexOf('<button disabled={warCount >= GANG_WAR_CONFIG.maxDaily}');
  const handler = appSource.slice(handlerStart, handlerStart + 1400);
  assert.ok(handlerStart >= 0);
  const aliveCheck = handler.indexOf("(partyRef.current || []).some");
  const lockAcquire = handler.indexOf("gangActionLocksRef.current.add('gang_war')");
  assert.ok(aliveCheck >= 0 && lockAcquire > aliveCheck);
  check(true, '帮战启动前校验存活队伍，不会因失败启动遗留并发锁');
}

console.log('\n=== 帮战检查全部通过 ===');
