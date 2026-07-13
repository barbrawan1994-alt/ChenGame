/**
 * 帮战目标预估、收益归属与难度标签回归校验。
 * 运行: node scripts/gang-balance-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../src/data/gang.js', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const gang = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const petIdentitySource = await readFile(new URL('../src/utils/petIdentity.js', import.meta.url), 'utf8');
const petIdentity = await import(`data:text/javascript;base64,${Buffer.from(petIdentitySource).toString('base64')}`);
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

// 四国静态帮派总战力会进入后台国战国力，不能让单一国家在开局获得隐性碾压优势。
{
  const totals = Object.fromEntries(['wei', 'shu', 'wu', 'jin'].map(faction => [
    faction,
    gang.GANG_PRESETS.filter(preset => preset.faction === faction).reduce((sum, preset) => sum + preset.power, 0),
  ]));
  const values = Object.values(totals);
  assert.ok(Math.max(...values) / Math.min(...values) <= 1.03, `四国帮派总战力偏差过大: ${JSON.stringify(totals)}`);
  check(true, `四国帮派总战力保持在 3% 内：${Object.entries(totals).map(([faction, value]) => `${faction}:${value}`).join('、')}`);
}

// 实战敌队为 enemyLv 到 enemyLv-5，Lv.75 目标的均级应为 72.5。
{
  const result = evaluate(40);
  assert.equal(result.enemyLv, 75);
  assert.equal(result.enemyAvgLevel, 72.5);
  check(result.winChance === 0.08, `Lv.40 挑战均级 Lv.${result.enemyAvgLevel} 时等级评分压到下限 8%`);
  check(result.riskLabel === '严重越级', '明显越级目标正确标记为“严重越级”');
  check(result.preparation.length >= 2, '高危目标给出升级与配队准备建议');
}

// 均级相当约 50%，高 10 级应明显占优，和实际战斗等级差保持一致。
{
  const even = evaluate(72.5);
  const ahead = evaluate(82.5);
  assert.equal(even.winChance, 0.5);
  assert.ok(Math.abs(ahead.winChance - 0.85) < 1e-9);
  check(even.riskLabel === '等级接近', '双方均级一致时标记为等级接近');
  check(ahead.riskLabel === '等级大优', '玩家均级高 10 级时标记为等级大优');
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

// 帮战预估只计算存活精灵，避免高等级阵亡成员虚高胜率。
{
  const renderGangStart = appSource.indexOf('const renderGang = () => {');
  const renderGangSource = appSource.slice(renderGangStart, renderGangStart + 2200);
  assert.ok(renderGangStart >= 0);
  assert.match(renderGangSource, /const livingPartyForGang = party\.filter\(p => p && \(p\.currentHp \|\| 0\) > 0\);/);
  assert.match(renderGangSource, /livingPartyForGang\.reduce/);
  assert.doesNotMatch(renderGangSource, /party\.reduce\(\(s, p\) => s \+ \(p\?\.level/);
  check(true, '帮战胜率与指挥建议均按存活队伍均级计算，不再计入已阵亡精灵');
}

// 指挥台必须把剩余次数说清楚；副帮主不能被错误承诺会自动晋升为帮主。
{
  const plan = gang.buildGangCommandPlan({
    gangInfo: gang.GANG_PRESETS[0],
    gang: { gangId: gang.GANG_PRESETS[0].id, contribution: 5000, personalSkills: {} },
    dailyCounts: { warCount: 0, taskProgress: {}, taskCompleted: [] },
    kingdomWar: { faction: gang.GANG_PRESETS[0].faction },
    partyAvgLevel: 80,
  });
  assert.equal(plan.metrics.find(metric => metric.label === '剩余帮战')?.value, `2/${gang.GANG_WAR_CONFIG.maxDaily}`);
  assert.equal(plan.metrics.some(metric => metric.label === '今日帮战'), false);
  const overviewStart = appSource.indexOf('{/* 职位晋升提示 */}');
  const overviewSource = appSource.slice(overviewStart, overviewStart + 2200);
  assert.ok(overviewStart >= 0);
  assert.match(overviewSource, /nextRank\.id === 'leader'/);
  assert.match(overviewSource, /副帮主是普通成员可晋升的最高职位/);
  check(true, '指挥台明确显示剩余帮战次数，副帮主不会再收到虚假的自动升任帮主提示');
}

// 全灭、目标失效或已有战斗应在取得帮战锁之前被拦截，避免按钮永久失效。
{
  const handlerStart = appSource.indexOf('<button disabled={warCount >= GANG_WAR_CONFIG.maxDaily}');
  const handler = appSource.slice(handlerStart, handlerStart + 1800);
  assert.ok(handlerStart >= 0);
  const targetCheck = handler.indexOf('if (!target?.id)');
  const aliveCheck = handler.indexOf("(partyRef.current || []).some");
  const battleCheck = handler.indexOf('if (battle && !battleResultHandledRef.current)');
  const lockAcquire = handler.indexOf("gangActionLocksRef.current.add('gang_war')");
  assert.ok(targetCheck >= 0 && aliveCheck > targetCheck && battleCheck > aliveCheck && lockAcquire > battleCheck);
  assert.match(handler, /const started = startBattle\(\{ gangWarTarget: target \}, 'gang_war'\);/);
  assert.match(handler, /if \(!started\) gangActionLocksRef\.current\.delete\('gang_war'\);/);
  assert.match(handler, /catch \(err\) \{[\s\S]{0,160}gangActionLocksRef\.current\.delete\('gang_war'\)/);

  const startBattleStart = appSource.indexOf('const startBattle = (context, type, challengeId = null) => {');
  const startBattleEnd = appSource.indexOf('const startTowerChallenge = () => {', startBattleStart);
  const startBattleSource = appSource.slice(startBattleStart, startBattleEnd);
  assert.ok(startBattleStart >= 0 && startBattleEnd > startBattleStart);
  assert.match(startBattleSource, /startBattle blocked: already in battle'\); return false;/);
  assert.match(startBattleSource, /setView\('battle'\);[\s\S]*return true;\s*};\s*$/);
  check(true, '帮战启动前依次校验目标、存活队伍和战斗占用，拒绝启动或初始化异常都会释放并发锁');
}

// 帮战目标的技能必须进入敌方实战属性，且初始化后的当前 HP 不能高于最终最大 HP。
{
  const gangWarStart = appSource.indexOf("else if (type === 'gang_war') {");
  const gangWarEnd = appSource.indexOf("else if (type === 'kingdom_war') {", gangWarStart);
  const gangWarSource = appSource.slice(gangWarStart, gangWarEnd);
  assert.ok(gangWarStart >= 0 && gangWarEnd > gangWarStart);
  assert.match(gangWarSource, /extraBattleData\.trainerGangBonus = getGangSkillBonus\(targetSkills\);/);
  assert.match(gangWarSource, /extraBattleData\.trainerGang = \{ id: target\.id/);

  const enemyInitStart = appSource.indexOf('const battleEnemyParty = enemyParty.map');
  const enemyInitEnd = appSource.indexOf('if (extraBattleData.carryOverParty', enemyInitStart);
  const enemyInitSource = appSource.slice(enemyInitStart, enemyInitEnd);
  assert.ok(enemyInitStart >= 0 && enemyInitEnd > enemyInitStart);
  assert.match(enemyInitSource, /s\._gangBonus = extraBattleData\.trainerGangBonus \|\| \{\};/);
  assert.match(enemyInitSource, /const finalMaxHp = Math\.max\(1, finalStats\.maxHp\);/);
  assert.match(enemyInitSource, /enemy\.currentHp = finalMaxHp;/);
  assert.match(enemyInitSource, /enemy\.maxHp = finalMaxHp;/);

  const statsWrapperStart = appSource.indexOf('function getStats(pet, stages = null, status = null, gangBonusOverride = undefined)');
  const statsWrapperSource = appSource.slice(statsWrapperStart, statsWrapperStart + 1000);
  assert.match(statsWrapperSource, /pet\?\.isEnemy \? \(pet\._gangBonus \|\| \{\}\) : undefined/);
  check(true, '帮战敌方技能会参与攻防、治疗和最大 HP 计算，入场 HP 与 HUD 上限保持一致');
}

// 金币捐献必须将“帮派状态 + 金币余额”作为一个事务计算，失败时不得产生半完成扣费。
{
  const baseGang = {
    gangId: 'test_gang',
    contribution: 0,
    dailyCounts: { resetDate: '2026-07-10', taskProgress: {}, taskCompleted: [] },
  };

  const leftGang = gang.applyGangGoldDonation({
    gang: { ...baseGang, gangId: null },
    dailyCounts: baseGang.dailyCounts,
    currentGold: 10000,
  });
  assert.deepEqual(leftGang, { ok: false, reason: 'not_in_gang' });

  const completed = gang.applyGangGoldDonation({
    gang: baseGang,
    dailyCounts: { ...baseGang.dailyCounts, taskCompleted: ['donate_gold'] },
    currentGold: 10000,
  });
  assert.deepEqual(completed, { ok: false, reason: 'already_completed' });

  const insufficient = gang.applyGangGoldDonation({
    gang: baseGang,
    dailyCounts: baseGang.dailyCounts,
    currentGold: 4999,
  });
  assert.equal(insufficient.ok, false);
  assert.equal(insufficient.reason, 'insufficient_gold');
  assert.equal(insufficient.cost, 5000);

  const success = gang.applyGangGoldDonation({
    gang: baseGang,
    dailyCounts: baseGang.dailyCounts,
    currentGold: 10000,
  });
  assert.equal(success.ok, true);
  assert.equal(success.cost, 5000);
  assert.equal(success.nextGold, 5000);
  assert.equal(success.nextGang.dailyCounts.taskProgress.donate_gold, 5000);
  assert.deepEqual(success.nextGang.dailyCounts.taskCompleted, ['donate_gold']);
  assert.deepEqual(baseGang.dailyCounts, { resetDate: '2026-07-10', taskProgress: {}, taskCompleted: [] });

  const donationStart = appSource.indexOf('{/* 捐献金币 */}');
  const donationEnd = appSource.indexOf('{/* 上交精灵 */}', donationStart);
  const donationSource = appSource.slice(donationStart, donationEnd);
  const transaction = donationSource.indexOf('const donation = applyGangGoldDonation');
  const lockAcquire = donationSource.indexOf('gangActionLocksRef.current.add(lockKey)');
  const gangRefCommit = donationSource.indexOf('gangRef.current = donation.nextGang');
  const goldCommit = donationSource.indexOf('goldRef.current = donation.nextGold');
  const lockRelease = donationSource.indexOf('gangActionLocksRef.current.delete(lockKey)');
  assert.ok(
    donationStart >= 0 && donationEnd > donationStart && transaction >= 0 &&
    lockAcquire > transaction && gangRefCommit > lockAcquire && goldCommit > gangRefCommit &&
    lockRelease > goldCommit
  );
  assert.match(donationSource, /try \{[\s\S]*setGang\(donation\.nextGang\);[\s\S]*setGold\(donation\.nextGold\);[\s\S]*} finally \{/);
  assert.doesNotMatch(donationSource, /updateGangTaskProgress\('donate_gold'/);
  assert.doesNotMatch(donationSource, /setTimeout\(\(\) => gangActionLocksRef\.current\.delete/);
  check(true, '离帮、重复完成、金币不足均不会扣费；成功捐献恰好扣一次并同步完成任务');
}

// 帮战预览必须明确是等级估算；胜败结算各消耗一次次数，奖励只基于最新权威状态发放。
{
  const uiStart = appSource.indexOf('const renderGangWar = () => {');
  const uiEnd = appSource.indexOf('const renderGangSkills = () => {', uiStart);
  const uiSource = appSource.slice(uiStart, uiEnd);
  assert.ok(uiStart >= 0 && uiEnd > uiStart);
  assert.match(uiSource, /等级差 \{preview\.levelDelta >= 0 \? '\+' : ''\}\{preview\.levelDelta\}/);
  assert.match(uiSource, /等级参考/);
  assert.match(uiSource, /仅比较存活队伍平均等级；属性、技能、装备、特性与克制决定实战结果/);
  assert.doesNotMatch(uiSource, /等级估算 \{Math\.round\(preview\.winChance/);
  assert.doesNotMatch(uiSource, />胜率 \{Math\.round\(preview\.winChance/);

  const winStart = appSource.indexOf("if (battleSnapshot.type === 'gang_war')");
  const winSource = appSource.slice(winStart, winStart + 5200);
  const defeatStart = appSource.indexOf("} else if (battleType === 'gang_war') {");
  const defeatSource = appSource.slice(defeatStart, defeatStart + 1200);
  assert.ok(winStart >= 0 && defeatStart >= 0);
  assert.equal((winSource.match(/warCount:/g) || []).length, 1);
  assert.equal((defeatSource.match(/warCount:/g) || []).length, 1);
  assert.match(winSource, /const currentGang = gangRef\.current \|\| \{\};/);
  assert.match(winSource, /const freshGangDc = getFreshGangDailyCounts\(currentGang\.dailyCounts, todayStr\);/);
  assert.doesNotMatch(winSource, /setGang\(prev =>/);

  const dailyCapGuard = winSource.indexOf('if ((freshGangDc.warCount || 0) >= GANG_WAR_CONFIG.maxDaily)');
  const capReturn = winSource.indexOf('return;', dailyCapGuard);
  const nextGangCommit = winSource.indexOf('const nextGang =');
  const refCommit = winSource.indexOf('gangRef.current = nextGang');
  const stateCommit = winSource.indexOf('setGang(nextGang)');
  const chestRewards = winSource.indexOf('const chestRewards =');
  assert.ok(
    dailyCapGuard >= 0 && capReturn > dailyCapGuard && nextGangCommit > capReturn &&
    refCommit > nextGangCommit && stateCommit > refCommit && chestRewards > stateCommit
  );
  assert.match(winSource, /if \(currentGang\.isOwner && currentGang\.customGang\) \{[\s\S]{0,220}funds: \(currentGang\.customGang\.funds \|\| 0\) \+ reward\.funds/);
  assert.match(winSource, /const mainRewardText = nextGang\.isOwner/);
  assert.match(winSource, /isGangKingdomAligned\(nextGang, kingdomWar\)/);

  const defeatRefCommit = defeatSource.indexOf('gangRef.current = nextGang');
  const defeatStateCommit = defeatSource.indexOf('setGang(nextGang)');
  assert.ok(defeatRefCommit >= 0 && defeatStateCommit > defeatRefCommit);
  assert.doesNotMatch(defeatSource, /funds\s*:/);
  check(true, '帮战只展示等级差参考而不伪装实际胜率；日上限前置，胜败均只结算一次且帮主资金归属正确');
}

// 旧存档中的缺失/重复 uid 必须被修复，且删除操作只能移除一只精灵。
{
  const original = [
    { id: 1, uid: 'keep_uid', name: '保留' },
    { id: 2, name: '缺失' },
    { id: 3, uid: 'duplicate_uid', name: '重复一' },
    { id: 4, uid: 'duplicate_uid', name: '重复二' },
  ];
  const normalized = petIdentity.ensureUniquePetUids(
    original,
    (_pet, index, attempt) => `generated_${index}_${attempt}`,
  );
  assert.equal(normalized[0], original[0]);
  assert.equal(normalized[0].uid, 'keep_uid');
  assert.equal(normalized[2].uid, 'duplicate_uid');
  assert.notEqual(normalized[3].uid, 'duplicate_uid');
  assert.equal(new Set(normalized.map(pet => pet.uid)).size, normalized.length);

  const duplicated = [
    { uid: 'same', name: '第一只' },
    { uid: 'same', name: '第二只' },
    { uid: 'other', name: '第三只' },
  ];
  const removal = petIdentity.removeSinglePetByUid(duplicated, 'same');
  assert.equal(removal.removed?.name, '第一只');
  assert.deepEqual(removal.pets.map(pet => pet.name), ['第二只', '第三只']);
  const missing = petIdentity.removeSinglePetByUid(duplicated, 'missing');
  assert.equal(missing.removed, null);
  assert.equal(missing.pets, duplicated);
  check(true, '旧存档精灵身份会补齐并全局去重，上交按 uid 只删除一只');
}

// 上交任务必须保护训练/远征精灵、保留最后一只队员，并在真实删除后才推进任务。
{
  const hydrationStart = appSource.indexOf('const hydrateSavedPetCollections =');
  const hydrationEnd = appSource.indexOf('const compactMapGridCache', hydrationStart);
  const hydrationSource = appSource.slice(hydrationStart, hydrationEnd);
  assert.ok(hydrationStart >= 0 && hydrationEnd > hydrationStart);
  assert.match(hydrationSource, /ensureUniquePetUids\(\[\.\.\.hydratedParty, \.\.\.hydratedBox\]\)/);

  const donationStart = appSource.indexOf('{/* 上交精灵 */}');
  const donationEnd = appSource.indexOf('const renderGangWar', donationStart);
  const donationSource = appSource.slice(donationStart, donationEnd);
  assert.ok(donationStart >= 0 && donationEnd > donationStart);
  const dailyLockCheck = donationSource.indexOf('gangActionLocksRef.current.has(lockKey)');
  const taskRefresh = donationSource.indexOf('getFreshGangDailyCounts');
  const lastPetCheck = donationSource.indexOf('currentParty.length <= 1');
  const assignedCheck = donationSource.indexOf('getAssignedPetUids().has(petToGive.uid)');
  const removePet = donationSource.indexOf('removeSinglePetByUid');
  const removalGuard = donationSource.indexOf('if (!removal.removed');
  const lockAcquire = donationSource.indexOf('gangActionLocksRef.current.add(lockKey)');
  const partyCommit = donationSource.indexOf('partyRef.current = removal.pets');
  const taskProgress = donationSource.indexOf("updateGangTaskProgress('donate_pet', 1)");
  assert.ok(
    dailyLockCheck >= 0 && taskRefresh > dailyLockCheck && lastPetCheck > taskRefresh &&
    assignedCheck > lastPetCheck && removePet > assignedCheck && removalGuard > removePet &&
    lockAcquire > removalGuard && partyCommit > lockAcquire && taskProgress > partyCommit
  );
  assert.match(donationSource, /reclaimRemovedPetAssets\(\[removal\.removed\]\)/);
  assert.match(donationSource, /clearRemovedPetLinks\(\[petToGive\.uid\]\)/);
  assert.doesNotMatch(donationSource, /prev\.filter\(p => p\.uid !== petToGive\.uid\)/);
  check(true, '精灵上交会复核最新任务和队伍状态，保护占用中的精灵，并在删除成功后原子推进任务');
}

console.log('\n=== 帮战检查全部通过 ===');
