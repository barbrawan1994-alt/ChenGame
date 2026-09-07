const assert = require('assert/strict');
const { createLoader, loadAppImports, bindAppDependencyTree, seededRandom } = require('./helpers/project-harness.cjs');

function createCombatHarness(random = seededRandom(90412)) {
  const math = Object.assign(Object.create(Math), { random });
  const loader = createLoader({ Math: math });
  const d = loadAppImports(loader);
  let c;
  const noop = () => {};
  const globals = {
    ...d, Math: math, _: require('lodash'),
    getStats: d.getStatsRaw,
    battle: null, weather: 'SUNNY', timePhase: 'DAY', party: [], gang: {}, kingdomWar: {},
    relics: { owned: [], equipped: [] }, narutoState: { jutsuMastery: {} }, arenaState: {},
    infinityStateRef: { current: null },
    playerTookDamageRef: { current: false },
    sectPlayer: {}, fusionState: {}, fusionStateRef: { current: {} },
    badges: [], housing: {}, currentTitle: '',
    currentMapId: 1, regionEcology: {}, sanctuaryState: {}, box: [],
    setBattle: update => { c.battle = typeof update === 'function' ? update(c.battle) : update; },
    setAnimEffect: noop, addLog: noop, wait: async () => {}, setTimeout: noop,
    advanceBounty: noop, updateAchStat: noop, handleDefeat: noop,
    handleWinRef: { current: noop }, commitNarutoState: noop,
  };
  c = bindAppDependencyTree(['performAction'], globals);
  return { c, d, loader };
}

async function run() {
  const { c, d, loader } = createCombatHarness();
  const { createPet } = loader('src/utils/petFactory.js');
  const pools = {
    standard: Object.entries(d.SKILL_DB).flatMap(([type, moves]) => moves.map(move => ({ ...move, t: move.t || type }))),
    status: d.STATUS_SKILLS_DB,
    secondaryEffects: d.SIDE_EFFECT_SKILLS,
    awakening: Object.values(d.AWAKENING_MOVES),
    fruit: Object.values(d.DEVIL_FRUITS).map(f => f.transformMove).filter(Boolean),
    jutsu: d.JUTSU_DB.map(j => ({ ...j, t: d.CHAKRA_NATURE_MAP[j.nature]?.gameType || 'NORMAL', isJutsu: true, jutsuId: j.id })),
    cursed: [...Object.values(d.TYPE_TECHNIQUES), ...d.COMMON_TECHNIQUES, ...Object.values(d.GOD_TECHNIQUES)].map(move => ({ ...move, isCursed: true, t: move.t || move.moveType || 'NORMAL', pp: move.pp || 15 })),
    martial: Object.values(loader('src/data/sectSystem.js').SECT_MARTIAL_ARTS).flat().map(art => d.buildMartialMove(art.id)),
    tm: d.buildSkillTmCatalog(d.TMS, d.SKILL_DB).map(d.buildMoveFromTm),
    comboJutsu: d.COMBO_JUTSU_LIST.filter(j => j.power > 0).map(j => ({ name: j.name, p: j.power, t: d.CHAKRA_NATURE_MAP[j.natures[0]]?.gameType || 'PSYCHIC', cat: j.cat || 'special', acc: 95, pp: 99, isComboJutsu: true, effect: j.effect || null })),
  };
  const skills = Object.values(pools).flat();
  const fruits = [null, ...Object.values(d.DEVIL_FRUITS)];
  const equips = [null, ...d.ACCESSORY_DB, ...d.RANDOM_EQUIP_DB];
  const weathers = Object.keys(d.WEATHERS);
  const blessingIds = loader('src/data/infinityExpedition.js').IMPLEMENTED_SPIRIT_BLESSINGS;
  const base = createPet(1, 60, false, false, { getStatsForPet: d.getStatsRaw, preserveSpecies: true });
  base.trait = 'none'; base.sectId = 0; base.sectLevel = 0; base.nature = 'docile';
  let cases = 0;
  const pairs = new Set();
  for (let s = 0; s < skills.length; s++) for (let f = 0; f < fruits.length; f++) {
    const e = (s + f) % equips.length;
    const w = (s + 3 * f) % weathers.length;
    const fruit = fruits[f];
    const move = { ...structuredClone(skills[s]), maxPP: skills[s].pp, pp: skills[s].pp };
    const actor = { ...structuredClone(base), equips: [equips[e], null], stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, combatMoves: [move],
      fruitTransformed: Boolean(fruit), fruitEffects: fruit?.transform ? { ...fruit.transform } : null,
      devilFruit: fruit?.id, fruitFirstStrike: Boolean(fruit), cursedEnergy: 1000, maxCE: 1000, chakra: 1000, maxChakra: 1000,
    };
    const target = { ...structuredClone(base), uid: 'target', type: Object.keys(d.TYPES)[(s + f) % Object.keys(d.TYPES).length],
      isEnemy: true, equips: [equips[(e + 1) % equips.length], null], stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, combatMoves: [],
      fruitTransformed: Boolean(fruit), fruitEffects: fruit?.transform ? { ...fruit.transform } : null, devilFruit: fruit?.id,
    };
    actor.currentHp = d.getStatsRaw(actor).maxHp;
    target.currentHp = d.getStatsRaw(target).maxHp;
    const state = { type: 'infinity', _sectMomentum: 100, activeIdx: 0, enemyActiveIdx: 0, playerCombatStates: [actor], enemyParty: [target], turnCount: 4,
      sharedPlayerCE: 1000, sharedPlayerMaxCE: 1000, sharedPlayerChakra: 1000, sharedPlayerMaxChakra: 1000,
    };
    c.battle = state; c.party = [actor]; c.weather = weathers[w];
    c.infinityStateRef.current = { blessings: [blessingIds[(s + f) % blessingIds.length]] };
    try { await c.performAction(actor, target, move, 'player', state); }
    catch (error) { error.message = `${move.name}/${fruit?.id || 'none'}/${equips[e]?.id || 'none'}/${weathers[w]}: ${error.message}`; throw error; }
    for (const p of [actor, target]) {
      assert.ok(Number.isFinite(p.currentHp) && p.currentHp >= 0, `${move.name}: invalid HP`);
      for (const value of Object.values(d.getStatsRaw(p))) assert.ok(Number.isFinite(value) && value >= 0, `${move.name}: invalid stat`);
    }
    assert.ok(move.pp >= 0 && move.pp <= move.maxPP, `${move.name}: invalid PP`);
    assert.ok(move.pp < move.maxPP, `${move.name}: action did not spend PP`);
    for (const [a, b] of [[`s${s}`, `f${f}`], [`s${s}`, `e${e}`], [`s${s}`, `w${w}`], [`f${f}`, `e${e}`], [`f${f}`, `w${w}`], [`e${e}`, `w${w}`]]) pairs.add(`${a}:${b}`);
    cases++;
  }
  const expectedPairs = skills.length * fruits.length + skills.length * equips.length + skills.length * weathers.length + fruits.length * equips.length + fruits.length * weathers.length + equips.length * weathers.length;
  assert.equal(pairs.size, expectedPairs, 'Incomplete pairwise matrix');
  console.log(JSON.stringify({ suite: 'combat', pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.length])), skills: skills.length, fruits: fruits.length - 1, equipment: equips.length - 1, weathers: weathers.length, cases, pairs: pairs.size, fullCartesianSize: skills.length * fruits.length * equips.length * weathers.length, seed: 90412 }));
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run, createCombatHarness };
