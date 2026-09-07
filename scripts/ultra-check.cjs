const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { load, bindAppFunctions } = require('./helpers/project-harness.cjs');
const { createCombatHarness } = require('./longrun-combat-check.cjs');
const u = load('src/utils/ultraRules.js');
const trials = load('src/utils/ultraTrials.js');
const { ULTRA_HEROES, ULTRA_ERAS, ULTRA_ROLES, ULTRA_STARTERS, ULTRA_TRIALS } = load('src/data/ultra.js');

async function run() {
  const { c, d, loader } = createCombatHarness(() => 0.5);
  const { createPet } = loader('src/utils/petFactory.js');
  const base = createPet(1, 45, false, false, { getStatsForPet: d.getStatsRaw, preserveSpecies: true });
  Object.assign(base, { uid: 'host', trait: 'none', nature: 'docile', sectId: 0, equips: [], stages: { ...d.DEFAULT_BATTLE_STAGES }, volatiles: {}, status: null, isShiny: false, customBaseStats: { hp: 100, p_atk: 60, s_atk: 60, p_def: 60, s_def: 60, spd: 60, crit: 0 } });
  base.currentHp = d.getStatsRaw(base).maxHp;
  const allCleared = { version:2,trialWins:ULTRA_HEROES.map(hero=>hero.id),hostUid:'host' };
  const battleFor = (hero, form, extra = {}) => {
    const actor = u.assignUltraContract(structuredClone(base), { ...allCleared, heroId: hero.id, formId: form.id }, 'wild');
    const target = { ...structuredClone(base), uid: 'target', isEnemy: true, combatMoves: [], currentHp: 2000 };
    return u.activateUltra({ type: 'wild', phase: 'input', turnCount: 1, activeIdx: 0, enemyActiveIdx: 0, playerCombatStates: [actor], enemyParty: [target], ...extra }, 0);
  };
  assert.equal(new Set(ULTRA_HEROES.map(hero => hero.id)).size, ULTRA_HEROES.length);
  assert.equal(ULTRA_HEROES.filter(hero => hero.source).length, 58, 'Complete official directory');
  assert.equal(ULTRA_HEROES.filter(hero => u.isUltraUnlocked(u.normalizeUltraState(), hero.id)).length, ULTRA_STARTERS.length);
  for (const raw of [null, {}, { cleared: 'showa', heroId: '__proto__' }, { cleared: [null, 'showa', 'showa', 'unknown'], formId: 'unknown' }]) {
    const state = u.normalizeUltraState(raw);
    assert.ok(ULTRA_HEROES.some(hero => hero.id === state.heroId));
    assert.ok(u.getUltraForm(state.heroId, state.formId));
  }
  let state = u.normalizeUltraState();
  for (const hero of ULTRA_HEROES) {
    const before=state.unlockedHeroIds.length;
    const first = u.completeUltraTrial(state, hero.id);
    assert.ok(first.firstClear);
    assert.equal(first.state.unlockedHeroIds.length-before,ULTRA_STARTERS.includes(hero.id) ? 0 : 1,'Only the challenged hero is unlocked');
    const repeat = u.completeUltraTrial(first.state, hero.id);
    assert.equal(repeat.firstClear, false);
    state = repeat.state;
  }
  assert.ok(ULTRA_HEROES.every(hero => u.isUltraUnlocked(state, hero.id)));
  assert.deepEqual(u.normalizeUltraState(state),state,'Normalization is idempotent');
  const legacy=u.normalizeUltraState({cleared:['showa'],heroId:'zoffy',hostUid:'host'});
  assert.ok(u.isUltraUnlocked(legacy,'zoffy'));
  assert.equal(legacy.trialWins.length,0,'Legacy era clears do not count as individual trial wins');
  assert.equal(u.completeUltraTrial(u.normalizeUltraState(),'showa').firstClear,false,'An era cannot grant new contracts');
  for(const invalid of [undefined,null,'unknown','__proto__']) assert.equal(u.completeUltraTrial(state,invalid).firstClear,false);
  let progression=u.normalizeUltraState();
  const qualified=[{level:90,currentHp:100},{level:90,currentHp:100},{level:90,currentHp:100}];
  for(let pass=0;pass<ULTRA_HEROES.length;pass++) {
    const next=ULTRA_HEROES.find(hero=>!progression.trialWins.includes(hero.id) && !trials.getUltraTrialBlock(trials.getUltraTrial(hero.id,qualified),progression,qualified,8));
    assert.ok(next,'Every hero has a reachable prerequisite route');progression=u.completeUltraTrial(progression,next.id).state;
  }
  for(const hero of ULTRA_HEROES) {
    const trial=trials.getUltraTrial(hero.id,qualified);
    assert.ok(trial.level>=92 && trial.level<=100);
    assert.ok(trials.getUltraTrialBlock(trial,progression,qualified,0));
    assert.ok(trials.getUltraTrialBlock(trial,progression,[qualified[0]],8));
    const opponents=trials.buildUltraTrialParty(trial,{createPet:(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw}),pokedex:d.POKEDEX,getStats:d.getStatsRaw});
    assert.equal(opponents.length,2);assert.equal(opponents[1].trialPortrait,hero.portrait);
    assert.notEqual(opponents[0].moves,opponents[1].moves);
    const projection={...opponents[1],combatMoves:opponents[1].moves};
    for(let round=0;round<8;round++) {
      const action=trials.getUltraTrialAction({type:'ultra_trial',turnCount:round},projection,[{idx:0,unit:qualified[0]}],move=>move.pp>0);
      assert.equal(action.move,projection.combatMoves[projection.trialSequence[round%4]]);
    }
  }
  for (const role of Object.values(ULTRA_ROLES)) assert.ok(Object.values(role.stats).reduce((sum, n) => sum + n - 1, 0) <= .40001);

  const equipment = [null, ...d.ACCESSORY_DB, ...d.RANDOM_EQUIP_DB];
  const weather = Object.keys(d.WEATHERS);
  let cases = 0;
  let forms = 0;
  for (const hero of ULTRA_HEROES) for (const form of hero.forms) {
    forms++;
    assert.ok(ULTRA_ROLES[form.role], hero.id);
    assert.ok(fs.statSync(path.resolve(__dirname, '..', 'public', hero.portrait)).size > 300);
    for (let i = 0; i < Math.max(equipment.length, weather.length); i++) {
      const battle = battleFor(hero, form);
      const actor = battle.playerCombatStates[0];
      const target = battle.enemyParty[0];
      actor.equips = [equipment[i % equipment.length]];
      actor.currentHp = Math.floor(d.getStatsRaw(actor).maxHp * .5);
      const original = d.getStatsRaw(u.clearUltraUnit(actor));
      const boosted = d.getStatsRaw(actor);
      assert.equal(original.maxHp, boosted.maxHp, 'Transformation must not inflate HP');
      for (const key of ['p_atk', 's_atk', 'p_def', 's_def', 'spd']) assert.ok(boosted[key] <= Math.ceil(original[key] * 1.3), `${hero.id} ${key} budget`);
      assert.equal(boosted.atk, boosted.p_atk);
      assert.equal(boosted.def, boosted.p_def);
      const move = actor.combatMoves.at(-1);
      actor.equippedBerry = 'leppa';
      c.battle = battle; c.party = [actor]; c.weather = weather[(i + forms) % weather.length];
      await c.performAction(actor, target, move, 'player', battle);
      assert.equal(move.pp, 0, `${hero.id}/${form.id}: consume finisher`);
      assert.equal(actor.ultraTransformed, false, `${hero.id}: projection ends`);
      assert.equal(actor.equippedBerry, 'leppa', 'Finisher must not waste or exploit PP berry');
      assert.ok(!actor.combatMoves.some(item => item.isUltraFinisher));
      assert.ok(Number.isFinite(actor.currentHp) && actor.currentHp >= 0);
      assert.ok(Number.isFinite(target.currentHp) && target.currentHp >= 0);
      cases++;
    }
  }
  const hero = ULTRA_HEROES.find(item => item.id === 'tiga');
  const fresh = () => battleFor(hero, hero.forms[0]);
  for (const status of ['flinch', 'sleep', 'frozen']) {
    const battle = fresh(), actor = battle.playerCombatStates[0], target = battle.enemyParty[0], move = actor.combatMoves.at(-1);
    if (status === 'flinch') actor.volatiles.flinched = true;
    if (status === 'sleep') { actor.status = 'SLP'; actor.volatiles.sleepTurns = 3; }
    if (status === 'frozen') { actor.status = 'FRZ'; c.Math.random = () => .9; }
    c.battle = battle;
    await c.performAction(actor, target, move, 'player', battle);
    assert.equal(move.pp, 1, status);
    assert.equal(actor.ultraTransformed, true, status);
    c.Math.random = () => .5;
  }
  for (const block of ['miss', 'protect']) {
    const battle = fresh(), actor = battle.playerCombatStates[0], target = battle.enemyParty[0], move = actor.combatMoves.at(-1);
    if (block === 'miss') move.acc = 1;
    else target.volatiles.protected = true;
    c.battle = battle;
    await c.performAction(actor, target, move, 'player', battle);
    assert.equal(move.pp, 0, block);
    assert.equal(actor.ultraTransformed, false, block);
  }
  let timed = fresh();
  for (const turn of [1, 2, 3, 4]) {
    timed = u.settleUltraRound({ ...timed, turnCount: turn, activeIdx: 1 });
    assert.equal(timed.playerCombatStates[0].ultraTurnsLeft, 4 - turn, 'Bench timer');
    assert.deepEqual(u.settleUltraRound(timed), timed, 'Idempotent timer');
  }
  assert.ok(!timed.playerCombatStates[0].combatMoves.some(move => move.isUltraFinisher));
  assert.equal(u.activateUltra(timed, 0), timed, 'Cannot transform twice');
  for (const kind of ['fruitTransformed', 'bijuuTransformed']) {
    const battle = fresh(); battle.ultraUsed = false; battle.playerCombatStates[0][kind] = true;
    assert.ok(u.getUltraTransformBlock(battle, battle.playerCombatStates[0]));
    assert.equal(u.getUltraStatMultiplier(battle.playerCombatStates[0], 's_atk'), 1);
  }
  for (const kind of ['pvp', 'arena', 'contest_bug']) assert.ok(!u.assignUltraContract(base, { ...allCleared, heroId: 'tiga' }, kind).ultraHeroId);
  assert.ok(!u.assignUltraContract(base, { ...allCleared, heroId: 'tiga' }, 'wild', true).ultraHeroId);
  const contaminated = fresh().playerCombatStates[0];
  contaminated.moves = [...base.moves, contaminated.combatMoves.at(-1)];
  const save = bindAppFunctions(['compactSavedPet', 'hydrateSavedPet'], { ...d, _: require('lodash'), STATIC_PET_SAVE_KEYS: [], clearUltraUnit: u.clearUltraUnit });
  assert.ok(!Object.keys(save.compactSavedPet(contaminated)).some(key => key.startsWith('ultra')));
  assert.ok(!save.compactSavedPet(contaminated).moves.some(move => move.isUltraFinisher));
  const trial = bindAppFunctions(['processDefeatedEnemy'], { battle: null });
  const noExp = trial.processDefeatedEnemy(base, [base], { type: 'ultra_trial', playerCombatStates: [base] });
  assert.equal(noExp.newParty[0].exp, base.exp);
  assert.equal(noExp.newParty[0].level, base.level);

  for(const era of ULTRA_ERAS) {
    const raw=ULTRA_TRIALS[era.id].moves.find(move=>move.p===0);
    const move={...structuredClone(raw),pp:4,maxPP:4,acc:100,category:'status'};
    const actor={...structuredClone(base),isEnemy:true,combatMoves:[move]};
    const target={...structuredClone(base),type:'NORMAL',type2:null,secondaryType:null};
    const trialBattle={type:'ultra_trial',activeIdx:0,enemyActiveIdx:0,playerCombatStates:[target],enemyParty:[actor]};
    c.battle=trialBattle;c.party=[target];c.Math.random=()=>.5;
    await c.performAction(actor,target,move,'enemy',trialBattle);
    if(era.id==='showa')assert.equal(actor.stages.s_def,1);
    if(era.id==='heisei')assert.equal(target.status,'PSN');
    if(era.id==='newgen')assert.equal(actor.volatiles.protected,true);
    if(era.id==='reiwa')assert.ok(target.volatiles.confused>0);
    if(era.id==='beyond')assert.equal(actor.stages.eva,1);
    if(era.id==='shadow'){assert.equal(actor.stages.p_atk,2);assert.equal(actor.stages.spd,-1);}
  }

  const timers = [], starts = [], saves = [];
  const trialParty = [structuredClone(base), { ...structuredClone(base), uid:'second', currentHp:1 }];
  const flow = bindAppFunctions(['startUltraTrial', 'finishUltraTrial'], {
    ...d, ...trials, ULTRA_ERAS, ULTRA_TRIALS, completeUltraTrial:u.completeUltraTrial, _:require('lodash'),badges:[1,2,3,4,5,6,7,8],
    battle:null, partyRef:{current:trialParty}, battleResultHandledRef:{current:false},
    ultraTrialStartLockRef:{current:false}, ultraTrialActiveRef:{current:false},
    ultraStateRef:{current:u.normalizeUltraState()}, pendingJutsuWinForBountyRef:{current:false},
    createPet:(id, level)=>createPet(id, level, false, false, {getStatsForPet:d.getStatsRaw}), getStats:d.getStatsRaw,
    window:{setTimeout:fn=>timers.push(fn)}, setTimeout:fn=>timers.push(fn),
    setUltraResult:()=>{}, setUltraState:()=>{}, setParty:()=>{}, setView:()=>{}, setAnimEffect:()=>{},setBattleImpact:()=>{},
    setBattle:value=>{flow.battle=value;}, showMapToast:()=>{}, persistSaveRef:{current:()=>saves.push(true)},
    startBattle:(context,type)=>{ starts.push({context,type}); return true; },
  });
  const flush = () => { while(timers.length)timers.shift()(); };
  flow.startUltraTrial('ginga');
  flow.startUltraTrial('ginga');
  assert.equal(starts.length,1,'Rapid trial start must not create two battles');
  assert.equal(starts[0].context.isDouble,true);
  assert.equal(starts[0].context.customParty.length,2);
  const [boss, escort] = starts[0].context.customParty;
  assert.ok(d.getStatsRaw(escort).maxHp > d.getStatsRaw(boss).maxHp,'Hero projection is stronger than the first guardian');
  assert.notEqual(boss.moves,escort.moves,'Double enemies must not share PP state');
  assert.equal(flow.ultraTrialActiveRef.current,starts[0].context._ultraTrialRunId);
  const snapshot=starts[0].context._ultraPartySnapshot;
  trialParty[0].currentHp=0;
  assert.ok(snapshot[0].currentHp>0,'Trial snapshot must survive combat mutations');
  flow.finishUltraTrial({...starts[0].context},false);flush();
  assert.equal(flow.partyRef.current[0].currentHp,snapshot[0].currentHp);
  assert.equal(flow.partyRef.current[1].currentHp,1);
  assert.equal(flow.ultraTrialActiveRef.current,false);
  assert.equal(flow.ultraStateRef.current.trialWins.length,0,'A loss cannot unlock contracts');
  flow.finishUltraTrial({...starts[0].context,enemyParty:[{currentHp:0}]},true);flush();
  assert.equal(flow.ultraStateRef.current.trialWins.length,0,'A stale victory after exit cannot unlock contracts');
  flow.startUltraTrial('ginga');flush();
  flow.finishUltraTrial({...starts[1].context,enemyParty:[{currentHp:0},{currentHp:0}]},true);flush();
  assert.equal(flow.ultraStateRef.current.trialWins.join(','),'ginga');
  assert.equal(flow.ultraStateRef.current.unlockedHeroIds.length,ULTRA_STARTERS.length+1);
  assert.ok(saves.length>=2);
  flow.partyRef.current=[{...base,currentHp:1}];
  flow.startUltraTrial('ginga');
  assert.equal(starts.length,2,'Double trial requires two living partners');
  flow.partyRef.current=snapshot;
  flow.startBattle=()=>false;
  flow.startUltraTrial('zoffy');flush();
  assert.equal(flow.ultraTrialActiveRef.current,false,'Rejected battle must restore achievement tracking');
  console.log(JSON.stringify({ suite: 'ultra', heroes: ULTRA_HEROES.length, forms, cases, equipment: equipment.length - 1, weather: weather.length, officialPortraits: 58 }));
}
run().catch(error => { console.error(error); process.exitCode = 1; });
