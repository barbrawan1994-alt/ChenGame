const assert = require('assert/strict');
const { createLoader, loadAppImports, bindAppDependencyTree, seededRandom } = require('./helpers/project-harness.cjs');

function run() {
  const random = seededRandom(90412);
  const load = createLoader({ Math: Object.assign(Object.create(Math), { random }) });
  const d = loadAppImports(load);
  const { createPet } = load('src/utils/petFactory.js');
  const context = bindAppDependencyTree(['processDefeatedEnemy'], {
    ...d, battle: null, marriage: {}, gang: {}, kingdomWar: {}, relics: {}, timePhase: 'DAY', weather: 'SUNNY',
    getStats: d.getStatsRaw,
  });
  const reports = [];
  for (const mode of ['solo', 'fixed-six', 'rotating-six', 'double-six']) {
    let party = Array.from({ length: mode === 'solo' ? 1 : 6 }, (_, i) => {
      const p = createPet([1, 4, 7, 16, 19, 25][i], 5, false, false, { getStatsForPet: d.getStatsRaw, preserveSpecies: true });
      return { ...p, nature: 'docile', exp: 0, nextExp: d.calcNextExp(5), pendingLearnMoves: [] };
    });
    const milestones = {};
    let defeats = 0;
    while (party.some(p => p.level < 100) && defeats < 30000) {
      const index = mode === 'rotating-six' ? defeats % party.length : 0;
      const isDouble = mode === 'double-six';
      const state = { activeIdx: index, activeIdxs: isDouble ? [defeats % 6, (defeats + 1) % 6] : [index], isDouble,
        isTrainer: defeats % 6 === 5, playerCombatStates: party.map(p => ({ ...p, combatMoves: p.moves })) };
      const enemy = { name: 'equal-level', level: Math.max(...state.activeIdxs.map(i => party[i].level)) };
      const before = party.map(p => p.level);
      party = context.processDefeatedEnemy(enemy, party, state).newParty;
      defeats++;
      for (const [i, p] of party.entries()) {
        assert.ok(p.level >= before[i] && p.level <= 100 && Number.isFinite(p.exp) && p.exp >= 0);
        if (p.level === 100) assert.equal(p.exp, 0);
        if (p.pendingLearnMove) p.moves = [...p.moves.slice(1), p.pendingLearnMove];
        p.pendingLearnMove = null;
        p.pendingLearnMoves = [];
      }
      for (const level of [20, 40, 60, 80, 100]) {
        if (!milestones[level] && party.every(p => p.level >= level)) milestones[level] = defeats;
      }
      if (defeats % 25 === 0) party = JSON.parse(JSON.stringify(party));
    }
    assert.ok(party.every(p => p.level === 100), `${mode}: stalled growth`);
    reports.push({ mode, defeats, allPartyMilestones: milestones });
  }
  const catalog = d.buildSkillTmCatalog(d.TMS, d.SKILL_DB);
  for (const moves of Object.values(d.SKILL_DB)) for (const skill of moves) {
    const tm = catalog.find(item => item.id.startsWith('tmg_') && item.name === skill.name);
    if (!tm) continue;
    const learned = d.buildMoveFromTm(tm);
    for (const key of ['acc', 'effect', 'priority', 'recoil', 'selfKO', 'recharge', 'cat']) {
      assert.deepEqual(learned[key], skill[key], `${skill.name}: TM dropped ${key}`);
    }
  }
  const campaigns = d.KINGDOM_CAMPAIGNS;
  for (const campaign of campaigns) {
    for (const roll of [0, 0.5, 0.999999]) {
      const team = d.buildCampaignParty(campaign, (id, level, boss, shiny) => createPet(id, level, boss, shiny, { getStatsForPet: d.getStatsRaw }), () => roll);
      assert.equal(team.length, campaign.teamSize);
      assert.equal(team.at(-1).level, campaign.bossLvl);
      for (const pet of team) {
        assert.ok(pet.level >= campaign.lvl && pet.level <= campaign.bossLvl);
        assert.ok(pet.moves.length > 0 && pet.moves.every(m => m.pp > 0));
        assert.ok(Number.isFinite(pet.currentHp) && pet.currentHp > 0);
      }
    }
  }
  console.log(JSON.stringify({ suite: 'progression', reports, tmCount: catalog.length, campaigns: campaigns.length, campaignRosters: campaigns.length * 3, seed: 90412 }));
}
if (require.main === module) run();
module.exports = { run };
