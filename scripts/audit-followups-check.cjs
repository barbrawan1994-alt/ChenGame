const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');
const h = require('./helpers/project-harness.cjs');
const d = h.loadAppImports();
const metrics = h.load('src/utils/combatMetrics.js');
const noop = () => {};
const berryHelpers = h.bindAppFunctions(['normalizeBerriesInventory', 'addBerries'], { BERRIES: d.BERRIES });
let checks = 0;
function check(name, fn) { fn(); checks++; console.log(`PASS ${name}`); }

check('Combat time excludes hidden and idle intervals, including delayed timer boundaries', () => {
  const run = { sample: { activeMs: 0 }, started: 0, lastTick: 0, lastInput: 0, visible: true, autoBattle: false };
  metrics.advanceCombatClock(run, 59000);
  metrics.advanceCombatClock(run, 120000);
  assert.equal(run.sample.activeMs, 60000);
  run.lastInput = 120000;
  metrics.advanceCombatClock(run, 125000);
  run.visible = false;
  metrics.advanceCombatClock(run, 240000);
  assert.equal(run.sample.activeMs, 65000);
  run.visible = true; run.autoBattle = true;
  metrics.advanceCombatClock(run, 250000);
  assert.equal(run.sample.activeMs, 75000);
  assert.equal(run.sample.elapsedMs, 250000);
});

check('Combat samples deduplicate, survive serialization and keep non-loss outcomes distinct', () => {
  let value = {};
  for (let i = 0; i < 510; i++) {
    const row = { ...metrics.createCombatSample({ _metricsId: `sample-${i}`, type: 'kingdom_war', isDouble: i % 2 === 0 }, { season: i % 3 + 1 }),
      result: ['win', 'loss', 'caught', 'escaped', 'interrupted'][i % 5], activeMs: 1000, turns: 2 };
    value = metrics.appendCombatSample(value, row);
    const once = JSON.stringify(value);
    value = metrics.appendCombatSample(value, row);
    assert.equal(JSON.stringify(value), once);
  }
  value = metrics.normalizeCombatMetrics(JSON.parse(JSON.stringify(value)));
  assert.equal(value.samples.length, 500);
  const groups = metrics.summarizeCombatMetrics(value);
  assert.equal(groups.length, 6);
  assert.equal(groups.reduce((n, row) => n + row.samples, 0), 500);
  assert.equal(groups.reduce((n, row) => n + row.caught + row.escaped + row.interrupted, 0), 300);
  assert.ok(groups.every(row => row.failureRate === row.losses / (row.wins + row.losses)));
  const bad = metrics.normalizeCombatMetrics({ samples: [{ id: 'bad', result: 'win', activeMs: -3, turns: 'NaN' }, { id: 3, result: 'win' }] });
  assert.equal(bad.samples.length, 1); assert.equal(bad.samples[0].activeMs, 0); assert.equal(bad.samples[0].turns, 0);
});

const story = h.load('src/data/story.js');
check('All 12 playable Sanguo chapters preserve failed objectives and settle exactly once', () => {
  let c;
  const state = { gold: 0, inventory: { meds: {} }, completedSideStories: new Set(), sideStoryStates: { sanguo: { progress: 53, step: 0 } } };
  const setters = Object.fromEntries(['Gold', 'Inventory', 'CompletedSideStories', 'SideStoryStates', 'StoryProgress', 'StoryStep', 'ActiveSideStory', 'SanguoProgress', 'SanguoStep', 'CompletedChallenges'].map(key => {
    const name = key[0].toLowerCase() + key.slice(1);
    return [`set${key}`, update => { state[name] = typeof update === 'function' ? update(state[name]) : update; }];
  }));
  c = h.bindAppFunctions(['completeSanguoChapter'], { ...d, ...setters,
    STORY_SCRIPT: story.PLAYABLE_STORY_SCRIPT, activeSideStory: 'sanguo', goldRef: { current: 0 },
    completedChallengesRef: { current: [] }, mainStoryProgress: 12, mainStoryStep: 5,
    setDialogQueue: noop, setCurrentDialogIndex: noop, setIsDialogVisible: noop, showMapToast: noop, updateAchStat: noop,
  });
  let expectedGold = 0;
  const expectedMeds = {};
  for (let index = 53; index <= 64; index++) {
    const chapter = story.PLAYABLE_STORY_SCRIPT[index];
    const finalTask = chapter.tasks.at(-1);
    assert.equal(chapter.tasks.filter(task => task.chapterFinal).length, 1);
    assert.equal(d.getStoryObjective(chapter, chapter.mapId, finalTask.step + 1)?.kind === 'gym', false);
    for (const task of chapter.tasks.filter(task => task.type === 'battle')) {
      const failed = d.resolveStoryBattleOutcome(task, {}, false);
      assert.equal(failed.retry, true); assert.equal(failed.advance, false);
      for (const entry of task.eliteParty) {
        assert.ok(d.POKEDEX.some(pet => pet.id === entry.id));
        assert.ok(entry.level >= 1 && entry.level <= 100);
      }
    }
    c.storyProgress = index; c.currentMapId = chapter.mapId; c.storyStep = finalTask.step;
    const snapshot = { type: 'story_task', _storyChapter: index, storyTaskStep: finalTask.step, trainerName: finalTask.name, enemyParty: finalTask.eliteParty.map(pet => ({ ...pet, currentHp: 0 })) };
    const before = c.goldRef.current;
    for (const invalid of [{ ...snapshot, _storyChapter: index - 1 }, { ...snapshot, trainerName: 'wrong' }, { ...snapshot, storyTaskStep: 0 }, { ...snapshot, enemyParty: [{ currentHp: 1 }] }]) {
      assert.equal(c.completeSanguoChapter(invalid), false); assert.equal(c.goldRef.current, before);
    }
    c.storyStep = 0; assert.equal(c.completeSanguoChapter(snapshot), false); c.storyStep = finalTask.step;
    assert.equal(c.completeSanguoChapter(JSON.parse(JSON.stringify(snapshot))), true);
    assert.equal(c.completeSanguoChapter(snapshot), false);
    expectedGold += chapter.reward.gold;
    for (const item of chapter.reward.items) expectedMeds[item.id] = (expectedMeds[item.id] || 0) + item.count;
    assert.equal(state.gold, expectedGold); assert.equal(c.goldRef.current, expectedGold);
    assert.equal(JSON.stringify(state.inventory.meds), JSON.stringify(expectedMeds));
    c.completedChallengesRef.current = JSON.parse(JSON.stringify(c.completedChallengesRef.current));
    assert.equal(c.completeSanguoChapter(snapshot), false);
    assert.equal(state.storyProgress, index < 64 ? index + 1 : 12);
  }
  assert.equal(state.storyStep, 5); assert.equal(state.activeSideStory, null);
  assert.equal(state.sanguoProgress, 12); assert.ok(state.completedSideStories.has('sanguo'));
  assert.equal(state.sideStoryStates.sanguo, undefined); assert.equal(c.completedChallengesRef.current.length, 12);
});

// Execute production entry and reward blocks with deterministic state and timers.
const world = fs.readFileSync(`${h.root}/src/components/screens/WorldMapScreen.js`, 'utf8');
const ast = babel.parseSync(world, { parserOpts: { plugins: ['jsx'] }, babelrc: false, configFile: false });
const entrySources = [];
babel.traverse(ast, { VariableDeclarator({ node }) {
  if (['enterDungeon', '_startDungeonAfterFee', 'checkDungeonCooldown', 'recordDungeonEntry'].includes(node.id.name)) entrySources.push(world.slice(node.start, node.end));
} });
const win = h.appFunctionSource('handleWin');
const rewardStart = win.indexOf('const isChainedDungeonWave =');
const rewardEnd = win.indexOf('const avgEnemyLv =', rewardStart);
assert.ok(rewardStart > 0 && rewardEnd > rewardStart);
const rewardSource = win.slice(rewardStart, rewardEnd);

function dungeonHarness() {
  let c;
  const timers = [], records = [], starts = [], errors = [];
  const state = { gold: 1000000, inventory: { meds: {}, balls: {}, stones: {}, tms: {}, berries: {} }, accessories: [], box: [], dungeonCooldowns: {} };
  const party = [{ id: 3, level: 100, currentHp: 100, moves: [], nature: 'jolly' }];
  const set = key => update => { state[key] = typeof update === 'function' ? update(state[key]) : update; };
  const globals = { ...d, addBerries: berryHelpers.addBerries, _: require('lodash'), party, updatedParty: party, badges: Array(24).fill('b'),
    Math: Object.assign(Object.create(Math), { random: () => 0 }),
    gold: state.gold, goldRef: { current: state.gold }, dungeonCooldowns: {}, dungeonCooldownsRef: { current: {} },
    dungeonEntryLockRef: { current: false }, dungeonContinuationLockRef: { current: false }, caughtDexRef: { current: [] },
    setGold: set('gold'), setInventory: set('inventory'), setAccessories: set('accessories'), setBox: set('box'), setDungeonCooldowns: set('dungeonCooldowns'),
    setConfirmModal: modal => { state.confirm = modal; }, setCaughtDex: noop, extraDrops: [], goldGain: 0,
    setBattle: noop, setView: noop, showMapToast: noop, updateAchStat: noop, updateBattleWinStats: noop, addLog: noop, unlockTitle: noop,
    didPlayerTakeBattleDamage: () => false, commitPartyToSave: noop, getLocalDateStr: () => '2026-09-08',
    setTimeout: fn => timers.push(fn), console: { error: (...args) => errors.push(args) },
    createUniqueEquip: id => ({ id, displayName: id }), createPet: id => ({ id, currentHp: 100, name: String(id) }),
    recordDungeonCompletion: id => records.push(id),
    enterInfinityCastle: mode => { starts.push({ type: 'infinity', dungeonId: 'infinity_castle', _infinityFloor: 10, mode }); return true; },
    startBattle: (context, type) => { starts.push({ ...context, type }); return true; },
    sampleWeightedTM: pool => pool[0], ALL_SKILL_TMS: d.buildSkillTmCatalog(d.TMS, d.SKILL_DB),
  };
  c = vm.createContext(globals);
  vm.runInContext(`${entrySources.map(source => `var ${source};`).join('\n')}\nvar settle = battleSnapshot => { const enemyParty = battleSnapshot.enemyParty; ${rewardSource} };`, c);
  return { c, state, records, starts, errors, flush: () => timers.splice(0).forEach(fn => fn()) };
}

for (const dungeon of [...d.DUNGEONS, d.HYAKKI_DUNGEON]) check(`Dungeon ${dungeon.id}: full configured reward path`, () => {
  const { c, state, records, starts, errors, flush } = dungeonHarness();
  if (dungeon.type === 'double') c.party.push({ ...c.party[0], id: 6 });
  c.enterDungeon(dungeon);
  if (state.confirm) { state.confirm.onOk(); state.confirm = null; }
  assert.equal(starts.length, 1, dungeon.id);
  const first = starts[0];
  const maxWaves = first.type === 'boss_rush' ? (dungeon.id === 'ladder_trial' ? 5 : 3) : first.type === 'survival' ? (first.isExtreme ? 5 : 3) : 1;
  for (let wave = 1; wave <= maxWaves; wave++) {
    const config = starts.at(-1);
    c.settle({ ...config, enemyParty: [{ id: 1, level: config.lvl?.[0] || 100, currentHp: 0 }], turnCount: 3 });
    if (first.type === 'survival') {
      assert.equal(records.length, 0);
      const decision = state.confirm;
      if (wave < maxWaves) { decision.onOk(); decision.onOk(); decision.onCancel(); }
      else { decision.onCancel(); const once = JSON.stringify(state.inventory); decision.onCancel(); decision.onOk(); assert.equal(JSON.stringify(state.inventory), once); }
    }
    flush();
    if (wave < maxWaves) {
      assert.equal(records.length, 0); assert.equal(starts.length, wave + 1);
      if (first.isExtreme) assert.deepEqual(Array.from(starts.at(-1).pool), [...d.LEGENDARY_POOL, ...d.FINAL_GOD_IDS]);
    }
  }
  assert.equal(records.length, 1); assert.equal(records[0], dungeon.id); assert.deepEqual(errors, []);
});

check('Survival high waves keep finite rewards, cap enemy levels, and reject stale exits', () => {
  for (const isExtreme of [false, true]) for (const wave of [1, 2, 3, 5, 7, 10, 1000]) {
    const { c, state, records, starts, flush } = dungeonHarness();
    c.settle({ type: 'survival', survivalWave: wave, isExtreme, dungeonId: isExtreme ? 'extreme_trial' : 'survival_arena', enemyParty: [{ id: 1, currentHp: 0, level: 100 }] });
    assert.ok(Number.isFinite(state.gold));
    const decision = state.confirm;
    decision.onCancel(); const once = JSON.stringify([state.inventory, state.accessories, records]);
    decision.onCancel(); decision.onOk(); flush();
    assert.equal(JSON.stringify([state.inventory, state.accessories, records]), once); assert.equal(starts.length, 0);
    assert.equal(records.length, wave >= (isExtreme ? 5 : 3) ? 1 : 0);
  }
});

console.log(JSON.stringify({ suite: 'audit-followups', checks }));
