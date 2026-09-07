const assert = require('assert/strict');
const { createCombatHarness } = require('./longrun-combat-check.cjs');

async function run() {
  let roll = 0.1;
  const { c, d, loader } = createCombatHarness(() => roll);
  const { createPet } = loader('src/utils/petFactory.js');
  const base = createPet(1, 60, false, false, { getStatsForPet: d.getStatsRaw, preserveSpecies: true });
  const fresh = () => ({ ...structuredClone(base), type: 'NORMAL', type2: null, secondaryType: null, trait: 'none', sectId: 0, sectLevel: 0, intimacy: 0, equips: [],
    stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, combatMoves: [], status: null, currentHp: 100 });
  async function action(ids, moveFields, { source = 'player', actorPatch = {}, targetPatch = {}, flags = {} } = {}) {
    const actor = Object.assign(fresh(), actorPatch);
    const target = Object.assign(fresh(), { uid: 'target', currentHp: 99999 }, targetPatch);
    const move = { name: 'probe', t: 'NORMAL', cat: 'physical', p: 10, pp: 10, maxPP: 10, acc: 100, ...moveFields };
    actor.combatMoves = [move];
    const state = { type: 'infinity', activeIdx: 0, enemyActiveIdx: 0, turnCount: 4,
      playerCombatStates: [source === 'player' ? actor : target], enemyParty: [source === 'player' ? target : actor], ...flags };
    c.battle = state; c.party = state.playerCombatStates;
    c.infinityStateRef.current = { blessings: ids };
    await c.performAction(actor, target, move, source, state);
    return { actor, target, state, move };
  }
  assert.equal((await action(['burn_spread'], { t: 'FIRE' })).target.status, 'BRN');
  assert.equal((await action(['burn_spread'], { t: 'FIRE' }, { targetPatch: { type: 'FIRE' } })).target.status, null);
  assert.equal((await action(['ice_frost'], { t: 'ICE' })).target.status, 'FRZ');
  assert.equal((await action(['ice_frost'], { t: 'ICE' }, { targetPatch: { type: 'ICE' } })).target.status, null);
  assert.equal((await action(['vine_mutate'], { t: 'GRASS' })).target.volatiles.flinched, true);
  assert.equal((await action([], { _mutation: 'silence' })).target.volatiles.flinched, true);
  assert.ok((await action([], { _mutation: 'lifesteal' })).actor.currentHp > 100);
  const heal = { p: 0, effect: { type: 'HEAL', target: 'self', val: 0.5 } };
  assert.ok((await action(['heal_shield'], heal)).actor._sectShield > 0);
  assert.ok((await action(['tide_echo'], heal, { actorPatch: { type: 'WATER' } })).actor._sectShield > 0);
  assert.equal((await action(['tide_echo'], heal)).actor._sectShield, undefined);
  const normal = await action([], { t: 'ELECTRIC' });
  const thunder = await action(['thunder_chain'], { t: 'ELECTRIC' });
  assert.ok(thunder.target.currentHp < normal.target.currentHp);
  const physical = await action([], {}, { source: 'enemy', targetPatch: { type: 'GROUND' } });
  const defended = await action(['ground_fortify'], {}, { source: 'enemy', targetPatch: { type: 'GROUND' } });
  assert.ok(defended.target.currentHp > physical.target.currentHp);
  const special = await action(['ground_fortify'], { cat: 'special' }, { source: 'enemy', targetPatch: { type: 'GROUND' } });
  const specialBase = await action([], { cat: 'special' }, { source: 'enemy', targetPatch: { type: 'GROUND' } });
  assert.equal(special.target.currentHp, specialBase.target.currentHp);
  const endured = await action(['endure_once'], { p: 200 }, { source: 'enemy', targetPatch: { currentHp: 1 } });
  assert.equal(endured.target.currentHp, 1);
  assert.equal(endured.state._blessingEndureUsed, true);
  const spentEndure = await action(['endure_once'], { p: 200 }, { source: 'enemy', targetPatch: { currentHp: 1 }, flags: { _blessingEndureUsed: true } });
  assert.equal(spentEndure.target.currentHp, 0);
  roll = 0.8;
  const chain = await action(['crit_chain'], {}, { flags: { _critChainActive: true } });
  const plain = await action([], {});
  assert.ok(chain.target.currentHp < plain.target.currentHp);
  assert.equal(chain.state._critChainActive, false);
  roll = 0;
  assert.equal((await action(['crit_chain'], {})).state._critChainActive, true);
  const blocked = await action(['ice_frost'], { t: 'ICE' }, { targetPatch: { volatiles: { protected: true } } });
  assert.equal(blocked.target.status, null);
  console.log(JSON.stringify({ suite: 'infinity-combat', blessings: 9, mutationsWithEffects: 2, checked: 'actual action, activation, immunity, duration, reuse, healing and damage' }));
}
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
