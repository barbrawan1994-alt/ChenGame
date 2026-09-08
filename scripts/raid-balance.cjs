const assert=require('node:assert/strict');
const {createCombatHarness}=require('./longrun-combat-check.cjs');
const {seededRandom}=require('./helpers/project-harness.cjs');

async function run(){
  let random=seededRandom(90412),outcome;
  const {c,d,loader}=createCombatHarness(()=>random(),{functions:['executeTurn','executeDoubleRound','scoreCombatMoveForTarget'],globals:{
    battleRoundLockRef:{current:false},pendingJutsuWinForBountyRef:{current:false},showMapToast:()=>{},triggerShinyAnim:async()=>{},
    handleWin:async()=>{outcome='win';},handleDefeat:async()=>{outcome='loss';},finishUltraTrial:(_battle,won)=>{outcome=won?'win':'loss';},
    processDefeatedEnemy:(_enemy,party,state)=>({newParty:party.map((unit,index)=>({...unit,currentHp:state.playerCombatStates[index].currentHp})),logMsg:''}),
    console:{...console,error:(...args)=>{throw new Error(args.join(' '));}},
  }});
  const {buildRaidParty}=loader('src/utils/kaijuRaids.js'),{KAIJU_RAIDS}=loader('src/data/kaijuRaids.js');
  const {createPet}=loader('src/utils/petFactory.js');
  const create=(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw,preserveSpecies:true});
  const results=[];
  c.weather='CLEAR';
  for(const raid of KAIJU_RAIDS)for(const build of ['entry','trained','alternate']){
    const row={raid:raid.id,build,wins:0,losses:0,rounds:0};
    for(let seed=0;seed<10;seed++){
      random=seededRandom(20260908+seed);outcome=null;
      const party=(build==='alternate'?[943,925,928,976]:[3,6,9,94]).map(id=>create(id,build==='entry'?raid.level-10:raid.level));
      const enemies=buildRaidParty(raid,{createPet:create,pokedex:d.POKEDEX,getStats:d.getStatsRaw});
      for(const unit of enemies){
        unit.customBaseStats.hp*=Number(process.env.RAID_HP_MULT||1);
        unit.customBaseStats.p_atk*=Number(process.env.RAID_ATTACK_MULT||1);
        unit.customBaseStats.s_atk*=Number(process.env.RAID_ATTACK_MULT||1);
      }
      [...party,...enemies].forEach((unit,index)=>{
        Object.assign(unit,{uid:`raid-${index}`,trait:'none',nature:'docile',sectId:0,sectLevel:0,devilFruit:null,equips:[],isShiny:false,
          stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},maxCE:0,cursedEnergy:0,maxChakra:0,chakra:0,
          combatMoves:unit.moves.map(move=>({...move,maxPP:move.maxPP||move.pp}))});
        if(index<party.length && build!=='entry')unit.evs={hp:252,p_atk:126,s_atk:126};
        unit.currentHp=d.getStatsRaw(unit).maxHp;unit.maxHp=unit.currentHp;
      });
      c.battle={type:'ultra_trial',phase:'input',turnCount:0,activeIdx:0,enemyActiveIdx:0,playerCombatStates:party,enemyParty:enemies,isDouble:raid.double,
        activeIdxs:raid.double?[0,1]:null,enemyActiveIdxs:raid.double?[0,1]:null,sharedPlayerChakra:0,sharedPlayerMaxChakra:0,sharedEnemyChakra:0,sharedEnemyMaxChakra:0,logs:[]};
      c.party=party;c.partyRef.current=party;let rounds=0;
      while(!outcome && rounds<80){
        if(c.battle.showSwitch){c.battle.activeIdx=c.battle.playerCombatStates.findIndex(unit=>unit.currentHp>0);c.battle.showSwitch=false;c.battle.phase='input';}
        const choose=idx=>{
          const actor=c.battle.playerCombatStates[idx];
          const targets=(raid.double?c.battle.enemyActiveIdxs:[c.battle.enemyActiveIdx]).filter(i=>c.battle.enemyParty[i]?.currentHp>0);
          const choices=targets.flatMap(targetIdx=>actor.combatMoves.map((move,moveIdx)=>({moveIdx,targetIdx,score:c.scoreCombatMoveForTarget(c.battle,actor,c.battle.enemyParty[targetIdx],move,'player',{isHardBattle:true})}))).filter(item=>Number.isFinite(item.score)).sort((a,b)=>b.score-a.score);
          return {...(choices[0]||{moveIdx:-10,targetIdx:targets[0]}),activeIdx:idx};
        };
        if(raid.double)await c.executeDoubleRound(c.battle.activeIdxs.filter(idx=>c.battle.playerCombatStates[idx]?.currentHp>0).map(choose));
        else await c.executeTurn(choose(c.battle.activeIdx).moveIdx);
        rounds++;
      }
      assert.ok(outcome,`${raid.id}/${build}/${seed} stalled`);
      row[outcome==='win'?'wins':'losses']++;row.rounds+=rounds;
    }
    row.meanRounds=row.rounds/10;delete row.rounds;results.push(row);
  }
  console.log(JSON.stringify({suite:'raid-balance',samples:240,policy:'Best scored normal move, no items, transformations, equipment or jutsu; entry at boss level minus 10, trained same team at boss level with 504 EVs, alternate different species',results},null,2));
}
run().catch(error=>{console.error(error);process.exitCode=1;});
