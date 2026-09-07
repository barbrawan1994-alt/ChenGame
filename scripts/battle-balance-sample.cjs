const assert = require('node:assert/strict');
const {createCombatHarness} = require('./longrun-combat-check.cjs');
const {seededRandom} = require('./helpers/project-harness.cjs');

async function run() {
  let random = seededRandom(90412), outcome;
  const {c,d,loader} = createCombatHarness(()=>random(),{
    functions:['executeTurn','scoreCombatMoveForTarget'],
    globals:{
      battleRoundLockRef:{current:false},pendingJutsuWinForBountyRef:{current:false},
      showMapToast:()=>{},triggerShinyAnim:async()=>{},
      handleWin:async()=>{outcome='win';},handleDefeat:async()=>{outcome='loss';},
      processDefeatedEnemy:(_enemy,party,state)=>({newParty:party.map((unit,index)=>({...unit,currentHp:state.playerCombatStates[index].currentHp})),logMsg:''}),
      console:{...console,error:(...args)=>{throw new Error(args.join(' '));}},
    },
  });
  const {createPet}=loader('src/utils/petFactory.js');
  const rules=loader('src/utils/battleTactics.js');
  const ultra=loader('src/utils/ultraRules.js');
  const report=[];
  c.narutoState={examsCompleted:99,jutsuMastery:{}};
  c.weather='CLEAR';
  for (const build of ['basic','breathing','ninja','ultra']) {
    const row={build,battles:0,wins:0,losses:0,capped:0,turns:[],health:[]};
    for(const level of [30,60,90]) for(let sample=0;sample<20;sample++) {
      random=seededRandom(90412+level*100+sample);outcome=null;
      const units=[createPet([1,4,7,25][sample%4],level,false,false,{getStatsForPet:d.getStatsRaw}),createPet([4,7,25,74,1][sample%5],Math.min(100,level+[-3,0,3][sample%3]),false,false,{getStatsForPet:d.getStatsRaw})];
      units.forEach((unit,index)=>{
        Object.assign(unit,{uid:`sample-${index}`,trait:'none',sectId:0,sectLevel:0,devilFruit:null,equips:[],stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},maxCE:0,cursedEnergy:0,maxChakra:200,chakra:100,combatMoves:unit.moves.map(move=>({...move,maxPP:move.maxPP || move.pp}))});
        unit.currentHp=d.getStatsRaw(unit).maxHp;
      });
      const [player,enemy]=units;
      if(build==='breathing') player.combatMoves.push(...rules.buildBreathingMoves('water',6));
      if(build==='ninja') player.combatMoves.push(...rules.selectPreparedJutsu(player,c.narutoState).map(move=>({...move,isJutsu:true,jutsuId:move.id,t:d.CHAKRA_NATURE_MAP[move.nature]?.gameType || 'NORMAL',cat:move.category || 'special',maxPP:move.pp})));
      if(build==='ultra') Object.assign(player,{ultraHeroId:'tiga',ultraFormId:'multi'});
      c.battle={type:'ultra_trial',phase:'input',turnCount:0,activeIdx:0,enemyActiveIdx:0,playerCombatStates:[player],enemyParty:[enemy],sharedPlayerChakra:100,sharedPlayerMaxChakra:200,sharedEnemyChakra:100,sharedEnemyMaxChakra:200,logs:[]};
      c.party=[player];c.partyRef.current=c.party;
      let turns=0;
      while(!outcome && turns<60) {
        if(build==='ultra' && c.battle.turnCount===1) c.battle=ultra.activateUltra(c.battle,0);
        const actor=c.battle.playerCombatStates[0],target=c.battle.enemyParty[0];
        const choices=actor.combatMoves.map((move,index)=>({index,score:c.scoreCombatMoveForTarget(c.battle,actor,target,move,'player',{isHardBattle:true})})).filter(item=>Number.isFinite(item.score));
        choices.sort((a,b)=>b.score-a.score);
        let index=choices[0]?.index || 0;
        if(build==='breathing' && turns===0) index=actor.combatMoves.findIndex(move=>move.id==='breathing_focus');
        if(build==='ultra' && actor.ultraTurnsLeft===1) index=actor.combatMoves.findIndex(move=>move.isUltraFinisher);
        await c.executeTurn(Math.max(0,index));
        turns++;
      }
      row.battles++;row[outcome==='win' ? 'wins' : outcome==='loss' ? 'losses' : 'capped']++;
      row.turns.push(turns);row.health.push(Math.max(0,c.battle.playerCombatStates[0].currentHp)/d.getStatsRaw(c.battle.playerCombatStates[0]).maxHp);
    }
    assert.equal(row.wins+row.losses+row.capped,row.battles);
    row.turns.sort((a,b)=>a-b);
    report.push({build,battles:row.battles,wins:row.wins,losses:row.losses,capped:row.capped,medianTurns:row.turns[Math.floor(row.turns.length/2)],p90Turns:row.turns[Math.floor(row.turns.length*.9)],meanRemainingHp:Math.round(row.health.reduce((a,b)=>a+b,0)/row.battles*1000)/10});
  }
  console.log(JSON.stringify({suite:'battle-balance-sample',seed:90412,levels:[30,60,90],policy:'Score-based solo play; water focus on turn one; light finisher on final light turn; no equipment, sect or weather bonuses. Descriptive sample, not equal-power proof.',report},null,2));
}
if(require.main===module) run().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={run};
