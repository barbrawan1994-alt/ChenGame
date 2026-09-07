const assert = require('node:assert/strict');
const h = require('./helpers/project-harness.cjs');
const d = h.loadAppImports();
const rules = h.load('src/utils/contestRules.js');
const { getLocalDateStr } = h.bindAppFunctions(['getLocalDateStr'], {});
let checks = 0;
function check(name, run) { run(); checks++; console.log(`PASS ${name}`); }

function fishingHarness() {
  let now = 1000, id = 0, ctx;
  const timers = new Map();
  class Clock extends Date { static now() { return now; } }
  const globals = { ...d, ...rules, Date: Clock,
    _: { random: (min, max) => max },
    activeContest: { id: 'fishing' },
    fishingStateRef: { current: { status: 'idle', retries: 0 } },
    fishingCastRef: { current: 0 }, fishingTimersRef: { current: [] },
    lastFishingSpeciesRef: { current: null }, contestRewardLockRef: { current: false },
    badges: [], currentMapId: 1,
    createPet: species => ({ id: species, name: `Species ${species}` }),
    setFishingStateValue: () => {}, setActiveContest: value => { ctx.activeContest = value; }, setView: () => {},
    setTimeout: (fn, delay) => { timers.set(++id, { fn, at: now + delay }); return id; },
    clearTimeout: timer => timers.delete(timer),
  };
  ctx = h.bindAppFunctions(['setFishingState', 'cancelFishingCast', 'startFishing', 'castRod', 'reelIn', 'retryFishing'], globals);
  const advance = ms => {
    const end = now + ms;
    while (true) {
      const entry = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry || entry[1].at > end) break;
      now = entry[1].at; timers.delete(entry[0]); entry[1].fn();
    }
    now = end;
  };
  return { ctx, timers, advance, jump: ms => { now += ms; }, state: () => ctx.fishingStateRef.current };
}

check('Fishing retries ignore both cancelled and already queued callbacks from old casts', () => {
  const { ctx, timers, advance, state } = fishingHarness();
  ctx.castRod(); const oldCallback = [...timers.values()][0].fn;
  advance(1000); ctx.reelIn(); assert.equal(state().status, 'fail');
  ctx.retryFishing(); ctx.retryFishing(); assert.equal(state().retries, 1);
  ctx.castRod(); oldCallback(); assert.equal(state().status, 'waiting');
  advance(4999); assert.equal(state().status, 'waiting');
  advance(1); assert.equal(state().status, 'bite');
  ctx.reelIn(); assert.equal(state().status, 'success');
  const caught = state().fish; ctx.reelIn(); assert.equal(state().fish, caught);
  advance(10000); assert.equal(state().status, 'success');
});
check('Fishing keeps a strict reaction deadline, three casts and no timer after exit', () => {
  const { ctx, timers, advance, state } = fishingHarness();
  for (let attempt = 0; attempt < 3; attempt++) {
    ctx.castRod(); advance(5000 + rules.FISHING_REACTION_MS);
    ctx.reelIn(); assert.equal(state().status, 'fail'); ctx.retryFishing();
  }
  assert.equal(state().status, 'fail'); assert.equal(state().retries, 2);
  ctx.startFishing(); ctx.castRod(); const callback = [...timers.values()][0].fn;
  ctx.cancelFishingCast(); ctx.activeContest = null; callback();
  assert.equal(timers.size, 0); assert.equal(state().status, 'waiting');
});
check('Fishing species history survives subsequent registrations', () => {
  const { ctx } = fishingHarness(); ctx.lastFishingSpeciesRef.current = 24;
  ctx.startFishing(); assert.equal(ctx.lastFishingSpeciesRef.current, 24);
});
check('A throttled escape timer cannot extend the fishing reaction deadline', () => {
  const { ctx, advance, jump, state } = fishingHarness();
  ctx.castRod(); advance(5000); assert.equal(state().status, 'bite');
  jump(rules.FISHING_REACTION_MS); ctx.reelIn(); assert.equal(state().status, 'fail');
});
check('Beauty preview includes exact bounds, typed bonuses and repeat penalty', () => {
  for (const p of [0, 40, 100]) for (const t of ['NORMAL', 'WATER']) for (const repeated of [false, true]) {
    const move = { name: 'Test', p, t };
    const state = { round: 1, appeal: 0, history: repeated ? ['Test'] : [], log: [] };
    const forecast = rules.getAppealPreview(move, state.history.at(-1));
    assert.equal(rules.resolveBeautyAppeal(state, move, () => 0).appeal, forecast.min);
    assert.equal(rules.resolveBeautyAppeal(state, move, () => 0.999).appeal, forecast.max);
  }
});
check('Beauty uses living performers and rejects sixth rounds and foreign moves', () => {
  let ctx;
  const moves = [{ name: 'A', p: 0, t: 'WATER' }, { name: 'B', p: 0, t: 'FAIRY' }];
  ctx = h.bindAppFunctions(['setBeautyState', 'startBeautyContest', 'performAppeal'], { ...rules,
    partyRef: { current: [{ uid: 1, currentHp: 0 }, { uid: 2, currentHp: 20, moves }] },
    beautyStateRef: { current: {} }, contestRewardLockRef: { current: false },
    setBeautyStateValue: () => {}, setActiveContest: value => { ctx.activeContest = value; }, setView: () => {},
  });
  assert.equal(ctx.startBeautyContest(), true); assert.equal(ctx.activeContest.pet.uid, 2);
  ctx.performAppeal({ name: 'not owned', p: 0 }); assert.equal(ctx.beautyStateRef.current.round, 1);
  for (let round = 0; round < 5; round++) ctx.performAppeal(moves[round % 2]);
  const finished = ctx.beautyStateRef.current;
  ctx.performAppeal(moves[0]); assert.equal(ctx.beautyStateRef.current, finished);
  assert.equal(finished.round, 6); assert.equal(finished.history.length, 5);
  ctx.partyRef.current.forEach(pet => { pet.currentHp = 0; }); assert.equal(ctx.startBeautyContest(), false);
});

function growthHarness(batch = false, itemId = 'exp_candy') {
  let ctx, confirmation;
  const callbacks = [], progress = [];
  const pet = h.load('src/utils/petFactory.js').createPet(3, 30, false, false, { getStatsForPet: d.getStatsRaw });
  const inventory = { [itemId]: batch ? 3 : 1 };
  const globals = { ...d, allSkills: [], getStats: d.getStatsRaw,
    partyRef: { current: [pet] }, inventoryRef: { current: inventory }, inventory,
    inventoryActionLocksRef: { current: new Set() }, marriageRef: { current: { pendingPropose: 'sakura' } },
    badges: Array(8).fill('badge'), timePhase: 'DAY', weather: 'CLEAR',
    usingItem: { category: 'growth', id: itemId, data: d.GROWTH_ITEMS.find(item => item.id === itemId), batch },
    flushSync: fn => fn(), setParty: () => {}, setInventory: () => {}, setViewStatPet: () => {},
    setConfirmModal: value => { confirmation = value; }, updateQuestProgress: (...args) => progress.push(args),
    window: { setTimeout: fn => callbacks.push(fn) }, showMapToast: () => {}, setUsingItem: value => { ctx.usingItem = value; },
    setView: () => {}, setPendingMove: () => {}, setLearningPetIdx: () => {},
  };
  ctx = h.bindAppFunctions(['handleItemUseOnPet', 'useGrowthItem'], globals);
  return { ctx, progress, confirm: () => confirmation.onOk(), flush: () => callbacks.splice(0).forEach(fn => fn()) };
}
check('Bag and detail growth actions both record the actual proposal level increase once', () => {
  for (const path of ['bag', 'detail', 'batch', 'max']) {
    const { ctx, progress, confirm } = growthHarness(path === 'batch', path === 'max' ? 'max_candy' : 'exp_candy');
    const startLevel = ctx.partyRef.current[0].level;
    if (path === 'detail') { ctx.useGrowthItem(0, 'exp_candy'); ctx.useGrowthItem(0, 'exp_candy'); }
    else { ctx.handleItemUseOnPet(0); if (path === 'batch') { confirm(); confirm(); } else ctx.handleItemUseOnPet(0); }
    const gained = ctx.partyRef.current[0].level - startLevel;
    assert.ok(gained > 0); assert.equal(progress.length, 1); assert.equal(progress[0][2], gained);
  }
});
check('Full-level and non-level growth items never fabricate proposal progress', () => {
  const { ctx, progress } = growthHarness(false, 'vit_hp');
  ctx.handleItemUseOnPet(0); assert.equal(progress.length, 0);
  const full = growthHarness(); full.ctx.partyRef.current[0].level = 100;
  full.ctx.handleItemUseOnPet(0); assert.equal(full.progress.length, 0); assert.equal(full.ctx.inventoryRef.current.exp_candy, 1);
});

const samples = { varied: 0, repeated: 0, variedTopPrize: 0 };
check('Ninja registration rejects locked and fainted teams before consuming the daily attempt', () => {
  let started = 0;
  const stateRef = { current: { examsCompleted: 4 } };
  const ctx = h.bindAppFunctions(['getExamDifficulty', 'startChuninExam'], { ...d, getLocalDateStr,
    badges: [], partyRef: { current: Array.from({ length: 3 }, () => ({ currentHp: 10 })) },
    narutoStateRef: stateRef, narutoActionLocksRef: { current: new Set() },
    showMapToast: () => {}, commitNarutoState: updater => { stateRef.current = updater(stateRef.current); },
    setNarutoExamUI: () => { started++; },
  });
  ctx.startChuninExam(); assert.equal(stateRef.current.lastExamDate, undefined);
  ctx.badges = ['a', 'b', 'c']; ctx.partyRef.current[0].currentHp = 0;
  ctx.startChuninExam(); assert.equal(stateRef.current.lastExamDate, undefined);
  ctx.partyRef.current[0].currentHp = 10; ctx.startChuninExam(); ctx.startChuninExam();
  assert.equal(started, 1); assert.equal(stateRef.current.lastExamDate, getLocalDateStr());
});

check('Skill shelves cover every sellable element with deterministic valid stock across all maps', () => {
  const { buildSkillTmCatalog, getMapShopTMs } = h.load('src/utils/skillTms.js');
  const catalog = buildSkillTmCatalog(d.TMS, d.SKILL_DB);
  for (const tier of [1, 2, 3, 4]) {
    const reached = new Set();
    const shelfKeys = new Set();
    for (const map of d.MAPS) {
      const ids = getMapShopTMs(catalog, map.id, tier);
      assert.equal(ids.length, 8); assert.equal(new Set(ids).size, 8);
      assert.deepEqual(ids, getMapShopTMs(catalog, map.id, tier)); shelfKeys.add(ids.join(','));
      ids.forEach(id => {
        const tm = catalog.find(entry => entry.id === id);
        assert.ok(tm.shopSell && tm.tier <= tier); reached.add(tm.type);
      });
    }
    assert.deepEqual([...reached].sort(), [...new Set(catalog.filter(tm => tm.shopSell && tm.tier <= tier).map(tm => tm.type))].sort());
    assert.ok(shelfKeys.size > d.MAPS.length * 0.8);
  }
});

function expeditionHarness() {
  let ctx, now = 1000000;
  class Clock extends Date { static now() { return now; } }
  const callbacks = [];
  const minerals = {};
  const ctxGlobals = { ...d, getLocalDateStr, Date: Clock, Math: Object.assign(Object.create(Math), { random: () => 0.6 }),
    badges: Array(12).fill('b'), partyRef: { current: ['a','b','c','d'].map(uid => ({ uid, currentHp: 10, type: 'FIRE' })) }, boxRef: { current: [] },
    expeditionsRef: { current: { ...d.DEFAULT_EXPEDITIONS, teams: [] } },
    trainingStateRef: { current: { slots: [{ petUid: 'b' }] } }, cafeRef: { current: { workers: ['c'] } },
    expeditionClaimLocksRef: { current: new Set() }, collectingExp: false,
    window: { setTimeout: fn => callbacks.push(fn) }, setTimeout: fn => callbacks.push(fn),
    setExpeditions: () => {}, showMapToast: () => {}, setCollectingExp: () => {}, flushSync: fn => fn(),
    setMineState: fn => Object.assign(minerals, fn({ minerals }).minerals), updateAchStat: () => {},
    addGlobalLog: () => {}, advanceBounty: () => {}, persistSaveRef: { current: () => {} },
  };
  ctx = h.bindAppFunctions(['sendExpedition', 'resolveExpeditionBranch', 'collectExpedition'], ctxGlobals);
  return { ctx, minerals, advance: ms => { now += ms; callbacks.splice(0).forEach(fn => fn()); } };
}
check('Accessory limits count both serialized IDs and full items on every owned pet', () => {
  const { countOwnedAccessory } = h.load('src/utils/shopRules.js');
  assert.equal(countOwnedAccessory('a1', ['a1', { id: 'a1' }, 'a3'], [{ equips: ['a1'] }, { equips: [{ id: 'a1' }] }]), 4);
  const callbacks = [];
  const ctx = h.bindAppFunctions(['doBuyItemPro'], { ...d, countOwnedAccessory,
    shopPurchaseLocksRef: { current: new Set() }, goldRef: { current: 10000 },
    inventoryRef: { current: {} }, accessoriesRef: { current: [] },
    partyRef: { current: [] }, boxRef: { current: [{ equips: [{ id: 'a1' }] }] },
    showMapToast: () => {}, window: { setTimeout: fn => callbacks.push(fn) },
    setGold: () => { throw new Error('An owned accessory must not charge gold'); },
  });
  ctx.doBuyItemPro('a1', 500, 'acc', 1); assert.equal(ctx.goldRef.current, 10000);
});
check('Expedition rejects partial invalid teams, caps daily dispatches and respects the 40% branch gate', () => {
  const { ctx, advance } = expeditionHarness();
  ctx.partyRef.current[3].currentHp = 0;
  for (const ids of [['a','b'], ['c'], ['d'], ['missing'], ['a','a']]) {
    assert.ok(!ctx.sendExpedition('dark_forest', ids)); advance(1);
    assert.equal(ctx.expeditionsRef.current.teams.length, 0);
  }
  assert.equal(ctx.sendExpedition('dark_forest', ['a']), true);
  ctx.sendExpedition('dark_forest', ['a']); assert.equal(ctx.expeditionsRef.current.startedToday, 1);
  const team = ctx.expeditionsRef.current.teams[0];
  const choice = d.EXPEDITION_BRANCH_EVENTS.find(event => event.id === team.branchEventId).choices[0];
  advance(team.duration * 0.4 - 1); ctx.resolveExpeditionBranch(0, choice.id);
  assert.equal(ctx.expeditionsRef.current.teams[0].branchResolved, false);
  advance(1); ctx.resolveExpeditionBranch(0, choice.id);
  assert.equal(ctx.expeditionsRef.current.teams[0].branchResolved, true);
  const resolved = ctx.expeditionsRef.current.teams[0]; ctx.resolveExpeditionBranch(0, 'charge');
  assert.equal(ctx.expeditionsRef.current.teams[0], resolved);
  ctx.expeditionsRef.current = { teams: [], lastDate: getLocalDateStr(), startedToday: 6 };
  advance(1); ctx.sendExpedition('dark_forest', ['a']); assert.equal(ctx.expeditionsRef.current.teams.length, 0);
});
check('Failed high-tier expeditions still yield at least one mineral per roll and settle only once', () => {
  const { ctx, minerals, advance } = expeditionHarness();
  const zone = d.EXPEDITION_ZONES.find(entry => entry.id === 'time_rift');
  ctx.expeditionsRef.current.teams = [{ zoneId: zone.id, startTime: 1000000, duration: zone.duration, petUids: ['a'],
    branchEventId: 'fork_road', branchResolved: true, branchChoice: { label: 'Charge', rewardMult: 1.6 }, branchFailed: true }];
  ctx.collectExpedition(0); assert.equal(ctx.expeditionsRef.current.teams.length, 1);
  advance(zone.duration); ctx.collectExpedition(0); ctx.collectExpedition(0);
  assert.equal(ctx.expeditionsRef.current.teams.length, 0); assert.equal(minerals.jade, 2);
});

for (let seed = 0; seed < 2000; seed++) {
  for (const mode of ['varied', 'repeated']) {
    let state = { round: 1, appeal: 0, history: [], log: [] };
    const random = h.seededRandom(seed);
    for (let turn = 0; turn < 5; turn++) state = rules.resolveBeautyAppeal(state, { name: mode === 'varied' ? `Move ${turn % 2}` : 'Move', p: 0, t: 'WATER' }, random);
    samples[mode] += state.appeal / 2000;
    if (mode === 'varied' && state.appeal >= d.CONTEST_CONFIG.beauty.tiers[0].min) samples.variedTopPrize++;
  }
}
assert.ok(samples.varied > samples.repeated + 35);
console.log(JSON.stringify({ checks, beautySamples: 4000, beauty: samples }));
