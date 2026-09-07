const assert = require('assert/strict');
const { load, bindAppFunctions, seededRandom } = require('./helpers/project-harness.cjs');
const marriageData = load('src/data/marriage.js');
const items = load('src/data/items.js');

function createMarriageRun(seed = 1) {
  let context;
  let day = 0;
  const random = seededRandom(seed);
  const clock = () => Date.UTC(2026, 0, 1 + day, 12);
  class RunDate extends Date { constructor(...args) { super(...(args.length ? args : [clock()])); } static now() { return clock(); } }
  const initialInventory = {
    berries: Object.fromEntries(Object.keys(items.BERRIES).map(id => [id, 5000])),
    meds: Object.fromEntries(Object.keys(items.MEDICINES).map(id => [id, 5000])),
    balls: Object.fromEntries(Object.keys(items.BALLS).map(id => [id, 5000])),
    stones: Object.fromEntries(Object.keys(items.EVO_STONES).map(id => [id, 5000])),
    misc: {}, tms: Object.fromEntries(items.TMS.map(tm => [tm.id, 5000])),
    ...Object.fromEntries(items.GROWTH_ITEMS.map(item => [item.id, 5000])),
  };
  const globals = {
    ...marriageData, ...items, ALL_SKILL_TMS: items.TMS, Date: RunDate, Math: Object.assign(Object.create(Math), { random }),
    accessories: Array(1000).fill('a30'), accessoriesRef: { current: Array(1000).fill('a30') },
    marriage: structuredClone(marriageData.DEFAULT_MARRIAGE_STATE), marriageRef: { current: null },
    inventory: initialInventory, inventoryRef: { current: initialInventory },
    gold: 10000000, goldRef: { current: 10000000 }, cafeRef: { current: { owned: true } },
    marriageActionLocksRef: { current: new Set() }, unlockedTitles: [], dateEvent: null, dateEventRef: { current: null }, weddingScene: null,
    getLocalDateStr: () => new RunDate().toISOString().slice(0, 10),
    flushSync: fn => fn(), showMapToast: () => {}, updateAchStat: () => {},
  };
  for (const name of ['Marriage', 'Inventory', 'Accessories', 'Gold', 'DateEvent', 'WeddingScene', 'UnlockedTitles', 'ConfirmModal']) {
    const key = name[0].toLowerCase() + name.slice(1);
    globals[`set${name}`] = update => {
      context[key] = typeof update === 'function' ? update(context[key]) : update;
      if (context[`${key}Ref`]) context[`${key}Ref`].current = context[key];
    };
  }
  context = bindAppFunctions(['normalizeBerriesInventory', 'addBerries', 'handleChat', 'handleDate', 'handleDateChoice', 'getGiftableItems', 'handleGift',
    'getQuestProgress', 'updateQuestProgress', 'handlePropose', 'handleWedding', 'advanceWedding', 'claimSpouseGift', 'handleDivorce', 'consumeSpouseReroll'], globals);
  context.marriageRef.current = context.marriage;
  return { context, nextDay: () => { day++; context.marriage = JSON.parse(JSON.stringify(context.marriage)); context.marriageRef.current = context.marriage; }, day: () => day };
}

function run() {
  const reports = [];
  for (const candidate of marriageData.MARRIAGE_CANDIDATES) {
    const run = createMarriageRun(candidate.id.length);
    const c = run.context;
    let proposalDay = null;
    let weddingDay = null;
    const gifts = c.getGiftableItems();
    const favorite = gifts.find(item => marriageData.getGiftPreference?.(candidate, item) === 'favorite');
    assert.ok(favorite, `${candidate.id}: no favorite gift is available in the actual gift selector`);
    for (let day = 0; day < 200; day++) {
      c.handleChat(candidate.id);
      const afterChat = c.marriage.affections[candidate.id];
      c.handleChat(candidate.id);
      assert.equal(c.marriage.affections[candidate.id], afterChat, 'Daily chat duplicated');
      for (let i = 0; i < marriageData.DAILY_DATE_LIMIT; i++) {
        c.handleDate(candidate.id);
        if (c.dateEvent) c.handleDateChoice((day + i) % c.dateEvent.options.length);
      }
      const goldAfterDates = c.gold;
      c.handleDate(candidate.id);
      assert.equal(c.gold, goldAfterDates, 'Fourth date charged');
      for (let i = 0; i < marriageData.DAILY_GIFT_LIMIT; i++) {
        const before = c.getGiftableItems().find(item => item.key === favorite.key)?.count || 0;
        c.handleGift(candidate.id, favorite.key);
        assert.equal(c.getGiftableItems().find(item => item.key === favorite.key)?.count || 0, before - 1, 'Gift was not consumed');
      }
      const inventoryAfterGifts = JSON.stringify(c.inventory);
      c.handleGift(candidate.id, favorite.key);
      assert.equal(JSON.stringify(c.inventory), inventoryAfterGifts, 'Third gift consumed');
      if (!c.marriage.spouse && !c.marriage.pendingPropose && c.marriage.affections[candidate.id] >= 1000) {
        assert.equal(marriageData.getAffectionStage(c.marriage.affections[candidate.id]).id, 'lover');
        c.handlePropose(candidate.id);
        assert.equal(c.marriage.pendingPropose, candidate.id);
        proposalDay = day;
      }
      if (c.marriage.pendingPropose) {
        for (const step of marriageData.PROPOSAL_QUESTS[candidate.id].steps) {
          if (step.type !== 'gift_favorite') c.updateQuestProgress(candidate.id, step.type, 1, `${day}`);
        }
        if (c.getQuestProgress(candidate.id).allDone) {
          c.handleWedding();
          for (let step = 0; step < marriageData.WEDDING_DIALOGUE.length; step++) c.advanceWedding();
          assert.equal(c.marriage.spouse, candidate.id);
          const afterWedding = c.gold;
          c.advanceWedding();
          assert.equal(c.gold, afterWedding, 'Wedding charged twice');
          weddingDay = day;
        }
      }
      if (c.marriage.spouse) {
        assert.equal(marriageData.getAffectionStage(c.marriage.affections[candidate.id], true).id, 'married');
        c.claimSpouseGift();
        const after = JSON.stringify([c.gold, c.inventory]);
        c.claimSpouseGift();
        assert.equal(JSON.stringify([c.gold, c.inventory]), after, 'Spouse gift duplicated');
      }
      assert.ok(c.gold >= 0);
      run.nextDay();
    }
    assert.notEqual(weddingDay, null, `${candidate.id} wedding unreachable`);
    assert.equal(marriageData.getMarriageLevel(c.marriage.affections[candidate.id]).level, 3);
    c.handleDivorce(); c.confirmModal.onConfirm();
    assert.equal(c.marriage.spouse, null);
    c.marriage.affections[candidate.id] = 1000;
    c.handlePropose(candidate.id);
    assert.equal(c.marriage.pendingPropose, null, 'Divorce cooldown bypassed');
    for (let i = 0; i < marriageData.DIVORCE_COOLDOWN_DAYS; i++) run.nextDay();
    c.handlePropose(candidate.id);
    assert.equal(c.marriage.pendingPropose, candidate.id);
    reports.push({ candidate: candidate.id, proposalDay, weddingDay, simulatedDays: run.day() });
  }
  const { context: free } = createMarriageRun();
  free.marriage.spouse = 'xingchen';
  const today = free.getLocalDateStr();
  assert.equal(marriageData.getSpouseRerollCost(free.marriage, { isShiny: true }, today), 0);
  free.consumeSpouseReroll(0);
  assert.equal(marriageData.getSpouseRerollCost(free.marriage, { isShiny: true }, today), 2);
  assert.equal(marriageData.getSpouseRerollCost(free.marriage, { isShiny: true }, '2026-01-02'), 0);
  free.marriage.spouse = null;
  free.marriage.pendingPropose = 'xingchen';
  free.updateQuestProgress('xingchen', 'catch', 1, '25');
  free.updateQuestProgress('xingchen', 'catch', 1, '25');
  assert.equal(free.getQuestProgress('xingchen').steps[0].current, 1);
  for (const candidate of marriageData.MARRIAGE_CANDIDATES) {
    let previous = marriageData.getSpouseBonus(candidate, 0);
    for (let level = 1; level <= 3; level++) {
      const bonus = marriageData.getSpouseBonus(candidate, level);
      for (const key of Object.keys(bonus)) {
        assert.ok(key === 'brewCooldown' ? bonus[key] <= previous[key] : bonus[key] >= previous[key]);
        if (['ivBoost', 'ivBase', 'freeReroll'].includes(key)) assert.ok(Number.isInteger(bonus[key]));
      }
      previous = bonus;
    }
  }
  for (const event of marriageData.DATE_EVENTS) {
    for (let index = 0; index < event.options.length; index++) {
      const { context: c } = createMarriageRun(index);
      c.dateEvent = c.dateEventRef.current = { ...event, candidateId: 'sakura' };
      c.handleDateChoice(index);
      assert.equal(c.marriage.affections.sakura, 15 + event.options[index].affection);
      c.handleDateChoice(index);
      assert.equal(c.marriage.affections.sakura, 15 + event.options[index].affection, 'Date choice duplicated');
    }
  }
  console.log(JSON.stringify({ suite: 'marriage', reports, dateChoices: marriageData.DATE_EVENTS.reduce((n, event) => n + event.options.length, 0) }, null, 2));
  return reports;
}

if (require.main === module) run();
module.exports = { run, createMarriageRun };
