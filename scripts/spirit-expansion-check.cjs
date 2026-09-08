const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { load, seededRandom, loadAppImports, bindAppDependencyTree } = require('./helpers/project-harness.cjs');
const { createCombatHarness } = require('./longrun-combat-check.cjs');

async function run() {
  const { POKEDEX } = load('src/data/pets.js');
  const { NEW_PETS_900, SPIRIT_TRIALS, PET_TACTICS } = load('src/data/petExpansion.js');
  const { MAPS } = load('src/data/maps.js');
  const { getSpriteUrl } = load('src/SpriteMap.js');
  const { getCombatMovePage, getCombatMoveGroup } = load('src/utils/combatMoveMenu.js');
  const { getCombatFamily } = load('src/utils/battleTactics.js');
  const { getSpeciesLearnedMoves } = load('src/utils/speciesMoves.js');
  const { createPet } = load('src/utils/petFactory.js');
  const { getStats } = load('src/utils/statsCalculator.js');
  assert.equal(POKEDEX.length, 1000);
  assert.deepEqual(Array.from(POKEDEX, p => p.id), Array.from({ length: 1000 }, (_, i) => i + 1));
  assert.ok(POKEDEX.every(p => !p.hidden));
  assert.equal(NEW_PETS_900.length, 96);
  assert.equal(new Set(POKEDEX.map(getSpriteUrl)).size, 1000);
  assert.equal(new Set(NEW_PETS_900.map(p => p.name)).size, 96);
  assert.equal(NEW_PETS_900.filter(p => p.evo).length, 48);
  for (const pet of NEW_PETS_900) {
    assert.ok(PET_TACTICS[pet.tactic]);
    const source = pet.familyId ? POKEDEX.find(p => p.id === pet.familyId) : pet;
    if (source.habitatMapId) {
      const map = MAPS.find(m => m.id === source.habitatMapId);
      assert.ok(map.pool.includes(source.id));
      if (source.evo) assert.ok(map.lvl[0] < source.evoLvl, `${pet.name}: base form must be obtainable`);
    } else {
      assert.ok(SPIRIT_TRIALS.some(t => t.rewardId === pet.id));
      assert.ok(MAPS.every(map => !map.pool?.includes(pet.id)));
    }
    if (pet.evo) {
      assert.equal(createPet(pet.id, pet.evoLvl).id, pet.evo);
      assert.ok(POKEDEX.find(p => p.id === pet.evo).hp > pet.hp);
    }
    const statSum = pet.hp + pet.atk + pet.def + pet.spd;
    assert.ok(statSum <= (pet.acquisition === 'trial' ? 410 : 385), `${pet.name}: power budget`);
    for (const level of [1, 5, 10, 20, 25, 30, 45, 50, 70, 100]) {
      const instance = createPet(pet.id, level, false, false, { preserveSpecies: true });
      assert.ok(instance.moves.length >= 1 && instance.moves.length <= 4);
      assert.ok(instance.moves.some(move => move.p > 0));
      assert.equal(new Set(instance.moves.map(move => move.name)).size, instance.moves.length);
      assert.ok(Object.values(getStats(instance)).every(Number.isFinite));
      assert.ok(getSpeciesLearnedMoves(pet, level).every(move => move.id && move.maxPP > 0));
      if (level >= 50) {
        assert.ok(instance.moves.some(move => move.t === pet.type && move.p > 0));
        assert.ok(instance.moves.some(move => move.t === pet.type2 && move.p > 0));
      }
    }
  }
  for (const trial of SPIRIT_TRIALS) {
    assert.ok(trial.req >= 200 && trial.bossLvl >= 80);
    assert.equal(new Set([trial.boss, ...trial.guardIds]).size, trial.teamSize);
  }
  const moves = Array.from({ length: 73 }, (_, i) => ({ name: `move-${i}`, p: 40, isExtra: i % 3 === 0 }));
  const visited = [];
  for (let page = 0; page < Math.ceil(moves.length / 4); page++) visited.push(...getCombatMovePage(moves, 'all', page).entries.map(entry => entry.index));
  assert.deepEqual(visited, moves.map((_, i) => i));
  const equipment = getCombatMovePage(moves, 'equipment', 999);
  assert.equal(equipment.page, equipment.pages - 1);
  assert.ok(equipment.entries.every(entry => moves[entry.index] === entry.move && getCombatMoveGroup(entry.move) === 'equipment'));
  assert.equal(getCombatFamily(moves[0]), 'basic', 'Equipment tab must not grant new synergy multipliers');
  const portraits = require('../public/assets/ultra/sources.json').manifest;
  assert.ok(portraits.every(entry => entry.source.startsWith('https://')));
  for (const portrait of portraits) assert.equal(fs.statSync(path.join(__dirname, '../public/assets/ultra', `${portrait.id}.webp`)).size, portrait.bytes);

  const imports = loadAppImports();
  const progression = bindAppDependencyTree(['processDefeatedEnemy'], {
    ...imports, battle: null, marriage: {}, gang: {}, kingdomWar: {}, relics: {}, timePhase: 'DAY', weather: 'SUNNY', getStats: imports.getStatsRaw,
  });
  let learningCases = 0;
  for (const species of NEW_PETS_900) for (const entry of species.learnset.filter(entry => entry.level > 1)) {
    const pet = createPet(species.id, entry.level - 1, false, false, { preserveSpecies: true, getStatsForPet: imports.getStatsRaw });
    pet.exp = pet.nextExp - 1;
    const state = { type: 'wild', activeIdx: 0, playerCombatStates: [{ ...pet, combatMoves: pet.moves }] };
    const grown = progression.processDefeatedEnemy({ name: 'learning-check', level: 1 }, [pet], state).newParty[0];
    assert.equal(grown.level, entry.level);
    const offered = [...grown.moves, grown.pendingLearnMove, ...(grown.pendingLearnMoves || [])].filter(Boolean);
    assert.ok(offered.some(move => move.id === entry.move), `${species.name}: level ${entry.level} must offer ${entry.move}`);
    assert.ok(grown.moves.length <= 4, 'Learning never silently exceeds the four prepared pet moves');
    learningCases++;
  }

  const { c, d, loader } = createCombatHarness(seededRandom(1000));
  const factory = loader('src/utils/petFactory.js').createPet;
  let actions = 0;
  for (const species of NEW_PETS_900) for (const weather of Object.keys(d.WEATHERS)) {
    const base = factory(species.id, 60, false, false, { preserveSpecies: true, getStatsForPet: d.getStatsRaw });
    for (const template of base.moves) {
      const move = structuredClone(template);
      const actor = { ...structuredClone(base), stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, combatMoves: [move], trait: 'none', sectId: 0, currentHp: 50 };
      const enemy = { ...factory(84, 60, false, false, { preserveSpecies: true, getStatsForPet: d.getStatsRaw }), uid: 'target', isEnemy: true, stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, combatMoves: [], trait: 'none', sectId: 0 };
      const battle = { type: 'wild', phase: 'input', turnCount: 1, activeIdx: 0, enemyActiveIdx: 0, playerCombatStates: [actor], enemyParty: [enemy] };
      c.battle = battle; c.party = [actor]; c.weather = weather;
      await c.performAction(actor, enemy, move, 'player', battle);
      assert.ok(Number.isFinite(actor.currentHp) && actor.currentHp >= 0);
      assert.ok(Number.isFinite(enemy.currentHp) && enemy.currentHp >= 0);
      assert.ok(move.pp < template.pp, `${species.name}: ${move.name} consumes PP`);
      actions++;
    }
  }
  console.log(JSON.stringify({ species: 1000, added: 96, families: 24, trials: 8, tactics: 12, generationCases: 960, learningCases, battleActions: actions, menuStressMoves: 73, portraits: portraits.length }));
}
run().catch(error => { console.error(error); process.exitCode = 1; });
