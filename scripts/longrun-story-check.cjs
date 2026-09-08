const assert = require('assert/strict');
const { load, bindAppFunctions } = require('./helpers/project-harness.cjs');
const eco = load('src/data/ecoCrises.js');
const chapters = Object.assign({}, ...['canyonMineChapter', 'ghostMistChapter', 'sealWarChapter'].map(name => load(`src/data/${name}.js`)));

function createChapterRun(crisis) {
  let c;
  c = bindAppFunctions(['selectEcoRoute', 'selectEcoBranch', 'applyChapterStepProgress', 'getChapterVars', 'resolveChapterEnding', 'advanceEcoCrisis'], {
    ...eco, ...chapters,
    fusionStateRef: { current: {} }, ecoCrisisRoutesRef: { current: {} }, ecoCrisisChoicesRef: { current: {} },
    ecoCrisisStateRef: { current: { active: { crisisId: crisis.id, step: 0 }, cleared: [] } },
    ecoActionLocksRef: { current: new Set() }, goldRef: { current: 100000 },
    party: ['FAIRY', 'NORMAL', 'GROUND', 'ROCK', 'GRASS', 'PSYCHIC', 'LIGHT', 'DARK', 'GHOST', 'ICE', 'FIGHT', 'FIRE', 'STEEL'].map(type => ({ type, currentHp: 100 })),
    commitFusionState: update => { c.fusionStateRef.current = update(c.fusionStateRef.current); },
    runEcoCrisisStep: (crisisId, step) => { c.ecoCrisisStateRef.current.active = { crisisId, step }; },
    setEcoCrisisRoutes: () => {}, setEcoCrisisChoices: () => {}, setEcoRouteModal: () => {}, setEcoBranchModal: () => {},
    setEcoCrisisModal: () => {}, setGold: () => {}, applyMapEcologyDelta: () => {}, updateAchStat: () => {},
    addGuardianScore: () => {}, getGuardianPointsForBranch: () => 0, showMapToast: () => {}, setTimeout: fn => fn(),
  });
  return c;
}

function run() {
  const reports = [];
  const unreachable = [];
  let combinations = 0;
  for (const crisis of eco.ECO_CRISES) {
    const reached = new Set();
    const paths = [];
    for (const route of crisis.routes || [null]) for (const branchId of crisis.branches) {
      const c = createChapterRun(crisis);
      for (let i = 0; i < crisis.steps.length; i++) {
        const step = crisis.steps[i];
        c.ecoCrisisStateRef.current.active.step = i;
        if (route && !c.ecoCrisisRoutesRef.current[crisis.id] && (step.type === 'route' || i === (crisis.routeStep ?? Math.max(0, crisis.steps.findIndex(s => s.type === 'route'))))) {
          c.selectEcoRoute(crisis.id, i, route.id);
          const snapshot = JSON.stringify(c.fusionStateRef.current);
          c.selectEcoRoute(crisis.id, i, route.id);
          assert.equal(JSON.stringify(c.fusionStateRef.current), snapshot, 'Route applied twice');
          assert.equal(c.ecoCrisisStateRef.current.active.step, step.type === 'route' ? i + 1 : i, `${crisis.id}: route skipped a playable step`);
        }
        if (step.type === 'branch') c.selectEcoBranch(crisis.id, i, branchId);
        else if (step.type !== 'route') c.advanceEcoCrisis(crisis.id, i);
        c.fusionStateRef.current = JSON.parse(JSON.stringify(c.fusionStateRef.current));
      }
      const vars = c.getChapterVars(crisis.id);
      const ending = c.resolveChapterEnding(crisis.id, crisis, route?.id, branchId, vars);
      if (crisis.endings) assert.ok(ending, `${crisis.id}: missing ending`);
      if (ending) reached.add(ending.id);
      paths.push({ route: route?.id, branch: branchId, ending: ending?.id, vars });
      combinations++;
    }
    for (const ending of crisis.endings || []) if (!reached.has(ending.id)) unreachable.push(`${crisis.id}/${ending.id}`);
    reports.push({ chapter: crisis.id, paths });
  }
  console.log(JSON.stringify({ suite: 'story', combinations, reports, unreachable }, null, 2));
  assert.deepEqual(unreachable, [], 'Configured endings unreachable through actual route and step handlers');

  const { PLAYABLE_STORY_SCRIPT } = load('src/data/story.js');
  const { resolveStoryBattleOutcome } = load('src/utils/progressionFlow.js');
  const { POKEDEX } = load('src/data/pets.js');
  const dexIds = new Set(POKEDEX.map(p => p.id));
  const seen = new Set();
  let battleOutcomes = 0;
  let tasks = 0;
  for (const chapter of PLAYABLE_STORY_SCRIPT) {
    const key = `${chapter.mapId}:${chapter.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const [i, task] of chapter.tasks.entries()) {
      assert.equal(task.step, i, `${chapter.title}: non-contiguous task`);
      if (task.type === 'battle') {
        for (const enemy of task.eliteParty || []) assert.ok(dexIds.has(enemy.id), `${chapter.title}: invalid species ${enemy.id}`);
        for (const won of [true, false]) {
          const result = resolveStoryBattleOutcome(task, {}, won);
          assert.ok(result.advance || result.retry);
          if (result.advance) assert.equal(result.nextStep, i + 1);
          battleOutcomes++;
        }
      }
      tasks++;
    }
  }
  console.log(JSON.stringify({ chapters: seen.size, tasks, battleOutcomes }));
  return reports;
}
if (require.main === module) run();
module.exports = { run, createChapterRun };
