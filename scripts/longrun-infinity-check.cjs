const assert = require('assert/strict');
const { createLoader, bindAppFunctions, seededRandom } = require('./helpers/project-harness.cjs');

function run() {
  const random = seededRandom(90412);
  const math = Object.assign(Object.create(Math), { random });
  const load = createLoader({ Math: math });
  const data = load('src/data/infinityExpedition.js');
  const floors = load('src/data/infinityCastle.js');
  const { BREATHING_BUFFS } = load('src/data/constants.js');
  const { POKEDEX } = load('src/data/pets.js');
  const { createPet } = load('src/utils/petFactory.js');
  const { getStats } = load('src/utils/statsCalculator.js');
  let c;
  const party = [1, 4, 7].map(id => createPet(id, 90, false, false, { getStatsForPet: getStats }));
  party.forEach(p => { p.currentHp = Math.floor(getStats(p).maxHp / 2); });
  c = bindAppFunctions(['nextInfinityFloor', 'selectInfinityRoute', 'selectInfinityBuff', 'enterInfinityCastle'], {
    ...data, ...floors, BREATHING_BUFFS, Math: math, getStats,
    _: { sample: a => a[Math.floor(random() * a.length)] }, ENV_PUZZLES: [{ name: 'test' }],
    reduceFatigue: (p, n) => Math.max(0, (p.fatigue || 0) - n),
    infinityState: null, infinityStateRef: { current: null }, party, partyRef: { current: party },
    goldRef: { current: 10000000 }, infinityActionLocksRef: { current: new Set() },
    infinityBattleStartLockRef: { current: false }, achStats: {},
    setInfinityState: value => { c.infinityState = c.infinityStateRef.current = value; },
    setParty: update => { c.party = c.partyRef.current = update(c.party); },
    setView: () => {}, setGold: () => {}, showMapToast: () => {}, updateAchStat: () => {},
    startInfinityBattle: () => { c.battleStarted = true; return true; },
  });
  const routesSeen = new Set();
  const rewardIds = new Set();
  for (const mode of ['shallow', 'normal']) {
    c.infinityStateRef.current = null;
    c.enterInfinityCastle(mode);
    for (let floor = 1; floor <= 1000; floor++) {
      const state = c.infinityStateRef.current;
      assert.equal(state.floor, floor);
      assert.equal(new Set(state.routeOptions.map(r => r.id)).size, state.routeOptions.length);
      assert.equal(state.routeOptions.some(r => r.id === 'boss_gate'), floor % 10 === 0);
      const route = state.routeOptions[Math.floor(random() * state.routeOptions.length)];
      routesSeen.add(route.id);
      c.battleStarted = false;
      c.selectInfinityRoute(route, floor);
      const after = JSON.stringify([c.infinityStateRef.current, c.goldRef.current, c.party]);
      c.selectInfinityRoute(route, floor);
      assert.equal(JSON.stringify([c.infinityStateRef.current, c.goldRef.current, c.party]), after, 'Stale route advanced or rewarded twice');
      if (c.battleStarted) {
        const original = JSON.stringify(c.party);
        const combat = data.buildInfinityBattleParty(c.party, state, POKEDEX, BREATHING_BUFFS, data.SKILL_MUTATIONS);
        assert.equal(JSON.stringify(c.party), original, 'Temporary progression contaminated permanent party');
        for (const p of combat) for (const move of p.moves) assert.ok(Number.isFinite(move.p) && move.p <= 250);
        const restored = data.restoreInfinityPartyAfterBattle(c.party, combat);
        assert.equal(JSON.stringify(restored.map(p => p.moves)), JSON.stringify(c.party.map(p => p.moves)));
        if (floor % 5 === 0) {
          const options = data.pickInfinityRewardOptions(state, BREATHING_BUFFS, data.SPIRIT_BLESSINGS, { random, partyNeedsHealing: c.party.some(p => p.currentHp < getStats(p).maxHp) });
          if (options.length) {
            c.infinityStateRef.current = { ...state, status: 'buff_select', buffOptions: options.map(o => o.id) };
            c.enterInfinityCastle(mode);
            assert.equal(c.infinityStateRef.current.status, 'buff_select', 'Resume skipped reward');
            const reward = options[Math.floor(random() * options.length)];
            rewardIds.add(reward.id);
            c.selectInfinityBuff(reward, floor);
            const postReward = JSON.stringify(c.infinityStateRef.current);
            c.selectInfinityBuff(reward, floor);
            assert.equal(JSON.stringify(c.infinityStateRef.current), postReward, 'Reward duplicated');
          } else c.nextInfinityFloor();
        } else c.nextInfinityFloor();
      }
      c.infinityStateRef.current = c.infinityState = data.normalizeInfinityRunState(JSON.parse(JSON.stringify(c.infinityStateRef.current)));
      assert.ok(c.infinityState.skillMutations.length <= data.SKILL_MUTATIONS.length);
      assert.ok(c.infinityState.blessings.length <= 6);
    }
  }
  for (const mutation of data.SKILL_MUTATIONS) {
    const status = { name: 'status', p: 0 };
    assert.equal(data.applySkillMutation(status, mutation), status);
    let move = { name: 'attack', p: 100 };
    for (let i = 0; i < 10000; i++) move = data.applySkillMutation(move, mutation);
    assert.ok(move.p <= 110 && move.p >= 80, 'Unbounded repeated mutation');
  }
  assert.equal(routesSeen.size, data.INFINITY_ROUTE_TYPES.length);
  assert.ok([...rewardIds].every(id => BREATHING_BUFFS.some(b => b.id === id) || data.IMPLEMENTED_SPIRIT_BLESSINGS.includes(id)));
  c.infinityStateRef.current = { ...c.infinityStateRef.current, floor: 5, mode: 'normal', status: 'buff_select', buffs: [], blessings: [], buffOptions: ['unimplemented_legacy'] };
  c.enterInfinityCastle('normal');
  assert.equal(c.infinityStateRef.current.status, 'buff_select');
  assert.ok(c.infinityStateRef.current.buffOptions.length > 0, 'Legacy reward must be replaced');
  assert.ok(!c.infinityStateRef.current.buffOptions.includes('unimplemented_legacy'));
  const legacy = data.normalizeInfinityRunState({ ...c.infinityStateRef.current, buffOptions: ['unimplemented_legacy'] }, BREATHING_BUFFS, { partyNeedsHealing: false });
  assert.ok(legacy.buffOptions.length && !legacy.buffOptions.includes('unimplemented_legacy'));
  const exhausted = data.normalizeInfinityRunState({ ...legacy, buffs: BREATHING_BUFFS.filter(b => b.type !== 'instant').flatMap(b => [b.id, b.id, b.id]), blessings: data.IMPLEMENTED_SPIRIT_BLESSINGS.slice(0, 6), buffOptions: ['unimplemented_legacy'] }, BREATHING_BUFFS, { partyNeedsHealing: false });
  assert.equal(exhausted.floor, legacy.floor + 1);
  assert.equal(exhausted.status, 'selecting');
  const cleaned = data.normalizeInfinityRunState({ floor: 7, blessings: ['crit_chain', 'crit_chain', 'unimplemented_legacy'], skillMutations: ['range', 'range'] }, BREATHING_BUFFS);
  assert.deepEqual(Array.from(cleaned.blessings), ['crit_chain']);
  assert.deepEqual(Array.from(cleaned.skillMutations), ['range']);
  for (const reward of [...BREATHING_BUFFS, ...data.SPIRIT_BLESSINGS.filter(b => data.IMPLEMENTED_SPIRIT_BLESSINGS.includes(b.id))]) {
    c.party.forEach(p => { p.currentHp = Math.max(1, Math.floor(getStats(p).maxHp / 2)); });
    c.infinityActionLocksRef.current.clear();
    c.infinityStateRef.current = { ...c.infinityStateRef.current, floor: 10, status: 'buff_select', buffs: [], blessings: [], buffOptions: [reward.id] };
    c.selectInfinityBuff(reward, 10);
    assert.equal(c.infinityStateRef.current.floor, 11, `Reward ${reward.id} did not advance`);
  }
  console.log(JSON.stringify({ suite: 'infinity', floors: 2000, routes: [...routesSeen], rewards: [...rewardIds], seed: 90412 }));
}
if (require.main === module) run();
module.exports = { run };
