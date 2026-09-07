const assert=require('node:assert/strict');
const {createCombatHarness}=require('./longrun-combat-check.cjs');
const {seededRandom}=require('./helpers/project-harness.cjs');

async function run() {
 let random=seededRandom(90412),outcome;
 const {c,d,loader}=createCombatHarness(()=>random(),{functions:['executeTurn','executeDoubleRound','scoreCombatMoveForTarget'],globals:{
   battleRoundLockRef:{current:false},pendingJutsuWinForBountyRef:{current:false},showMapToast:()=>{},triggerShinyAnim:async()=>{},
   handleWin:async()=>{outcome='win';},handleDefeat:async()=>{outcome='loss';},
   processDefeatedEnemy:(_enemy,party,state)=>({newParty:party.map((unit,index)=>({...unit,currentHp:state.playerCombatStates[index].currentHp})),logMsg:''}),
   console:{...console,error:(...args)=>{throw new Error(args.join(' '));}},
 }});
 const k=loader('src/utils/kaijuRules.js'),{KAIJU}=loader('src/data/kaiju.js');
 const {createPet}=loader('src/utils/petFactory.js');
 const create=(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw,preserveSpecies:true});
 const results={ordinary:{wins:0,losses:0,rounds:[]},kaiju:{wins:0,losses:0,rounds:[]},double:{wins:0,losses:0,rounds:[]}};
 c.weather='CLEAR';
 for(const [number,entry] of KAIJU.entries()) for(const mode of ['ordinary','kaiju',...(number%8===0 ? ['double'] : [])]) {
  random=seededRandom(20260908+number);outcome=null;
  const party=[3,6,9].map(id=>create(id,65));
  const monster=k.buildKaijuUnit(entry.id,67,{createPet:create,pokedex:d.POKEDEX,getStats:d.getStatsRaw});
  const enemies=mode==='ordinary' ? [create(monster.id,65)] : [monster];
  if(mode==='double')enemies.push(k.buildKaijuUnit(KAIJU[(number+13)%KAIJU.length].id,67,{createPet:create,pokedex:d.POKEDEX,getStats:d.getStatsRaw,slot:1}));
  [...party,...enemies].forEach((unit,index)=>{
   Object.assign(unit,{uid:`sample-${index}`,trait:'none',nature:'docile',sectId:0,sectLevel:0,devilFruit:null,equips:[],isShiny:false,
    stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},maxCE:0,cursedEnergy:0,maxChakra:0,chakra:0,
    combatMoves:unit.moves.map(move=>({...move,maxPP:move.maxPP || move.pp}))});
   unit.currentHp=d.getStatsRaw(unit).maxHp;unit.maxHp=unit.currentHp;
  });
  const double=mode==='double';
  c.battle={type:'wild',phase:'input',turnCount:0,activeIdx:0,enemyActiveIdx:0,playerCombatStates:party,enemyParty:enemies,isDouble:double,
   activeIdxs:double ? [0,1] : null,enemyActiveIdxs:double ? [0,1] : null,sharedPlayerChakra:0,sharedPlayerMaxChakra:0,sharedEnemyChakra:0,sharedEnemyMaxChakra:0,logs:[]};
  c.party=party;c.partyRef.current=party;let rounds=0;
  while(!outcome && rounds<60) {
   if(c.battle.showSwitch) {c.battle.activeIdx=c.battle.playerCombatStates.findIndex(unit=>unit.currentHp>0);c.battle.showSwitch=false;c.battle.phase='input';}
   const choose=idx=>{
    const actor=c.battle.playerCombatStates[idx];
    const targets=(double ? c.battle.enemyActiveIdxs : [c.battle.enemyActiveIdx]).filter(i=>c.battle.enemyParty[i]?.currentHp>0);
    const choices=targets.flatMap(targetIdx=>actor.combatMoves.map((move,moveIdx)=>({moveIdx,targetIdx,score:c.scoreCombatMoveForTarget(c.battle,actor,c.battle.enemyParty[targetIdx],move,'player',{isHardBattle:true})}))).filter(item=>Number.isFinite(item.score)).sort((a,b)=>b.score-a.score);
    return {...(choices[0] || {moveIdx:-10,targetIdx:targets[0]}),activeIdx:idx};
   };
   if(double)await c.executeDoubleRound(c.battle.activeIdxs.filter(idx=>c.battle.playerCombatStates[idx]?.currentHp>0).map(choose));
   else await c.executeTurn(choose(c.battle.activeIdx).moveIdx);
   rounds++;
  }
  assert.ok(outcome,`${entry.id}/${mode} stalled`);
  results[mode][outcome==='win' ? 'wins' : 'losses']++;results[mode].rounds.push(rounds);
 }
 for(const result of Object.values(results)) {result.samples=result.rounds.length;result.meanRounds=Number((result.rounds.reduce((a,b)=>a+b,0)/result.samples).toFixed(2));delete result.rounds;}
 assert.ok(results.kaiju.meanRounds>results.ordinary.meanRounds,'Kaiju should last longer than ordinary backing species');
 console.log(JSON.stringify({suite:'kaiju-balance',team:'Lv65 final-stage starters, no equipment/fruit/sect; best scored normal move; kaiju Lv67',results},null,2));
}
run().catch(error=>{console.error(error);process.exitCode=1;});
