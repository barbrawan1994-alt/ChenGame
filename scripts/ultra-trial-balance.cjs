const assert=require('node:assert/strict');
const {createCombatHarness}=require('./longrun-combat-check.cjs');
const {seededRandom}=require('./helpers/project-harness.cjs');

async function run() {
 let random=seededRandom(90412),outcome;
 const {c,d,loader}=createCombatHarness(()=>random(),{
  functions:['executeTurn','scoreCombatMoveForTarget'],globals:{battleRoundLockRef:{current:false},pendingJutsuWinForBountyRef:{current:false},showMapToast:()=>{},triggerShinyAnim:async()=>{},
   handleWin:async()=>{outcome='win';},handleDefeat:async()=>{outcome='loss';},
   processDefeatedEnemy:(_enemy,party,state)=>({newParty:party.map((unit,index)=>({...unit,currentHp:state.playerCombatStates[index].currentHp})),logMsg:''}),
   console:{...console,error:(...args)=>{throw new Error(args.join(' '));}},
  },
 });
 const {createPet}=loader('src/utils/petFactory.js');
 const trials=loader('src/utils/ultraTrials.js');
 const tactics=loader('src/utils/battleTactics.js');
 const ultra=loader('src/utils/ultraRules.js');
 const create=(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw,preserveSpecies:true});
 c.weather='CLEAR';c.narutoState={examsCompleted:20,jutsuMastery:{}};
 const results=[];
 for(const [heroId,level] of [['zoffy',45],['zero',65],['noa',85]]) for(const policy of ['attack','prepared']) {
  const result={heroId,level,policy,wins:0,losses:0,capped:0,rounds:[]};
  for(let seed=0;seed<12;seed++) {
   random=seededRandom(90412+level*100+seed);outcome=null;
   const party=[3,6,9].map(id=>create(id,level));
   const trial=trials.getUltraTrial(heroId,party);
   const enemies=trials.buildUltraTrialParty(trial,{createPet:create,pokedex:d.POKEDEX,getStats:d.getStatsRaw});
   [...party,...enemies].forEach((unit,index)=>{
    Object.assign(unit,{uid:`trial-sample-${index}`,trait:'none',nature:'docile',sectId:0,sectLevel:0,devilFruit:null,equips:[],stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},maxCE:0,cursedEnergy:0,maxChakra:index<3 ? 200 : 0,chakra:index<3 ? 100 : 0,combatMoves:unit.moves.map(move=>({...move,maxPP:move.maxPP || move.pp}))});
    unit.currentHp=d.getStatsRaw(unit).maxHp;
   });
   if(policy==='prepared') for(const unit of party) {
    unit.combatMoves.push(...tactics.buildBreathingMoves('water',6));
    unit.combatMoves.push(...tactics.selectPreparedJutsu(unit,c.narutoState).map(move=>({...move,isJutsu:true,jutsuId:move.id,t:d.CHAKRA_NATURE_MAP[move.nature]?.gameType || 'NORMAL',maxPP:move.pp})));
   }
   Object.assign(party[0],{ultraHeroId:'tiga',ultraFormId:'multi'});
   c.battle={type:'ultra_trial',isTrainer:true,phase:'input',turnCount:0,activeIdx:0,enemyActiveIdx:0,playerCombatStates:party,enemyParty:enemies,sharedPlayerChakra:100,sharedPlayerMaxChakra:200,sharedEnemyChakra:0,sharedEnemyMaxChakra:0,logs:[]};
   c.party=party;c.partyRef.current=party;
   let rounds=0;
   while(!outcome && rounds<60) {
    if(c.battle.showSwitch) {c.battle.activeIdx=c.battle.playerCombatStates.findIndex(unit=>unit.currentHp>0);c.battle.showSwitch=false;c.battle.phase='input';}
    if(policy==='prepared' && c.battle.turnCount===1 && c.battle.activeIdx===0) c.battle=ultra.activateUltra(c.battle,0);
    const actor=c.battle.playerCombatStates[c.battle.activeIdx],target=c.battle.enemyParty[c.battle.enemyActiveIdx];
    if(!actor || !target) break;
    const choices=actor.combatMoves.map((move,index)=>({index,move,score:c.scoreCombatMoveForTarget(c.battle,actor,target,move,'player',{isHardBattle:true})})).filter(item=>Number.isFinite(item.score) && (policy!=='attack' || item.move.p>0)).sort((a,b)=>b.score-a.score);
    let index=choices[0]?.index ?? -10;
    if(policy==='prepared' && actor.ultraTurnsLeft===1) index=actor.combatMoves.findIndex(move=>move.isUltraFinisher);
    await c.executeTurn(index);rounds++;
   }
   result[outcome==='win' ? 'wins' : outcome==='loss' ? 'losses' : 'capped']++;result.rounds.push(rounds);
  }
  result.rounds.sort((a,b)=>a-b);result.medianRounds=result.rounds[6];delete result.rounds;
  assert.equal(result.capped,0,'Trial should finish without stalling');results.push(result);
 }
 console.log(JSON.stringify({suite:'ultra-trial-balance',samples:72,team:'Venusaur, Charizard, Blastoise; no equipment/fruit/sect; actual single battle rules and forced replacements',results},null,2));
}
run().catch(error=>{console.error(error);process.exitCode=1;});
