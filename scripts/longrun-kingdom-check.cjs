const assert = require('assert/strict');
const { createLoader, seededRandom } = require('./helpers/project-harness.cjs');

function run() {
  let day = 0;
  const now = () => Date.UTC(2026, 0, 1 + day, 12);
  class RunDate extends Date { constructor(...args) { super(...(args.length ? args : [now()])); } static now() { return now(); } }
  let random = seededRandom(90412);
  const load = createLoader({ Date: RunDate, Math: Object.assign(Object.create(Math), { random: () => random() }) });
  const k = load('src/data/kingdom.js');
  const { GANG_PRESETS } = load('src/data/gang.js');
  const { MANPOWER_RESERVE_CAP } = load('src/data/kingdomConstants.js');
  const reports = [];
  const initial = k.initTerritories();
  for (const faction of k.FACTION_IDS) assert.equal(k.getFactionTerritoryCount(faction, initial), 5);
  for (const [index, faction] of k.FACTION_IDS.entries()) {
    day = 0;
    random = seededRandom(90412 + index);
    let state = k.migrateKingdomWarState({ ...k.DEFAULT_KINGDOM_WAR, faction, territories: k.initTerritories(), seasonStartDate: new RunDate().toISOString() });
    const winners = Object.fromEntries(k.ALL_FACTION_IDS.map(id => [id, 0]));
    let draws = 0;
    for (let season = 1; season <= 52; season++) {
      assert.equal(k.checkSeasonEnd(state), null);
      for (let d = 0; d < k.SEASON_CONFIG.durationDays; d++) {
        day++;
        state = k.resetKingdomDailyCounts(state, k.getKingdomDateKey(new RunDate()));
        for (let tick = 0; tick < k.WAR_TICK_CONFIG.maxCatchupTicks; tick++) {
          const result = k.executeWarTick(state.territories, GANG_PRESETS, faction, 80, 0, { politics: state.politics, factionManpower: state.factionManpower });
          state = { ...state, territories: result.territories, politics: result.politics, factionManpower: result.factionManpower };
        }
        state = k.migrateKingdomWarState(JSON.parse(JSON.stringify(state)));
        assert.equal(Object.keys(state.territories).length, k.WAR_MAP_IDS.length);
        for (const territory of Object.values(state.territories)) {
          assert.ok(!territory.owner || territory.owner === 'neutral' || k.ALL_FACTION_IDS.includes(territory.owner));
          assert.ok(Number.isFinite(territory.strength) && territory.strength >= 0 && territory.strength <= 100);
        }
      }
      const result = k.checkSeasonEnd(state);
      assert.equal(result.season, season);
      assert.equal(new Set(result.rankings).size, 5);
      winners[result.rankings[0]]++;
      const before = state;
      state = k.applySeasonRewards(state, result);
      assert.equal(state.season, season + 1);
      assert.equal(state.warContribution, Math.floor(before.warContribution * k.SEASON_CONFIG.contributionCarryover));
      assert.ok(state.kwManpowerReserve <= MANPOWER_RESERVE_CAP);
      assert.ok(state.eliteTroops <= state.kwManpowerReserve);
      assert.ok(state.generalDraws > draws);
      draws = state.generalDraws;
      assert.equal(k.applySeasonRewards(state, result), state, 'Old season rewarded again');
      assert.equal(k.checkSeasonEnd(state), null);
    }
    reports.push({ faction, seasons: 52, days: day, winners, draws });
  }
  for (const rank of [1, 2, 3, 4, 5]) {
    const rankings = [...k.ALL_FACTION_IDS];
    rankings.splice(rankings.indexOf('wei'), 1); rankings.splice(rank - 1, 0, 'wei');
    const state = k.applySeasonRewards({ ...k.DEFAULT_KINGDOM_WAR, faction: 'wei', seasonContribution: 2000, warContribution: 3000 }, { rankings, season: 1 });
    assert.equal(state.tokenReward, (k.SEASON_CONFIG.rewards[rank] || k.SEASON_CONFIG.rewards[3]).tokens + 100);
    assert.equal(state.warContribution, 1500);
  }
  console.log(JSON.stringify({ suite: 'kingdom', reports, ticks: 4 * 52 * 7 * 20, seed: 90412 }));
}
if (require.main === module) run();
module.exports = { run };
