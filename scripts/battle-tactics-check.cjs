const assert = require('node:assert/strict');
const { createCombatHarness } = require('./longrun-combat-check.cjs');
const { seededRandom } = require('./helpers/project-harness.cjs');

async function run() {
  const logs = [];
  const {c,d,loader} = createCombatHarness(seededRandom(703), {
    functions:['performAction','executeTurn','executeDoubleRound','executeChargeCE'],
    globals:{
      battleRoundLockRef:{current:false},pendingJutsuWinForBountyRef:{current:false},
      showMapToast:()=>{},triggerShinyAnim:async()=>{},handleWin:()=>{},
      processDefeatedEnemy:()=>{throw new Error('Unexpected knockout in turn fixture');},
      addLog:message=>logs.push(message),
      console:{...console,error:(...args)=>{throw new Error(args.join(' '));}},
    },
  });
  const rules = loader('src/utils/battleTactics.js');
  const commands = loader('src/utils/crossoverCommands.js');
  const {createPet} = loader('src/utils/petFactory.js');
  let checks = 0;
  const check = async (name,fn) => { logs.length=0; await fn(); checks++; console.log(`PASS ${name}`); };
  const pet = (uid,isEnemy=false) => {
    const unit = createPet(1,60,false,false,{preserveSpecies:true,getStatsForPet:d.getStatsRaw});
    Object.assign(unit,{uid,isEnemy,name:uid,type:'NORMAL',secondaryType:null,type2:null,trait:'none',sectId:0,sectLevel:0,devilFruit:null,bijuuData:null,ultraTransformed:false,equips:[],stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},maxCE:200,cursedEnergy:100,maxChakra:200,chakra:100,
      customBaseStats:{hp:1000,p_atk:50,s_atk:50,p_def:100,s_def:100,spd:50,crit:0},
      combatMoves:[{name:'试验击',p:40,t:'NORMAL',cat:'physical',acc:0,pp:20,maxPP:20}],
    });
    unit.currentHp=d.getStatsRaw(unit).maxHp;
    return unit;
  };
  const state = (double=false) => {
    const value = {type:'ultra_trial',phase:'input',turnCount:3,isDouble:double,activeIdx:0,enemyActiveIdx:0,activeIdxs:double?[0,1]:[0],enemyActiveIdxs:double?[0,1]:[0],playerCombatStates:[pet('p0'),...(double?[pet('p1')]:[])],enemyParty:[pet('e0',true),...(double?[pet('e1',true)]:[])],sharedPlayerCE:100,sharedPlayerMaxCE:200,sharedPlayerChakra:100,sharedPlayerMaxChakra:200,sharedEnemyCE:100,sharedEnemyMaxCE:200,sharedEnemyChakra:100,sharedEnemyMaxChakra:200,logs:[]};
    c.battle=value; c.party=value.playerCombatStates; c.partyRef.current=c.party;
    return value;
  };
  await check('固定忍术准备、等级段位门槛与无效旧档回退',()=>{
    const p=pet('p'); p.type='FIRE';
    const ninja={examsCompleted:99,jutsuMastery:{}};
    const available=rules.getEligiblePreparedJutsu(p,ninja);
    assert.ok(available.length>1);
    p.preparedJutsu=[available[0].id,available[0].id,'invalid'];
    assert.equal(rules.selectPreparedJutsu(p,ninja)[0].id,available[0].id);
    assert.equal(new Set(rules.selectPreparedJutsu(p,ninja).map(move=>move.id)).size,2);
    assert.deepEqual(Array.from(rules.selectPreparedJutsu({...p,level:5},ninja)),[]);
    assert.equal(JSON.stringify(rules.selectPreparedJutsu(p,ninja)),JSON.stringify(rules.selectPreparedJutsu(p,ninja)));
  });
  await check('呼吸法进场门槛与高级呼吸解锁',()=>{
    assert.equal(rules.buildBreathingMoves('sun',5).length,0);
    assert.equal(rules.buildBreathingMoves('sun',6)[1].id,'breathing_water');
    assert.equal(rules.buildBreathingMoves('sun',6,['breathing_unlock'])[1].id,'breathing_sun');
  });
  await check('主动增益按加法计算并封顶60%',()=>{
    assert.equal(rules.getCrossoverMultiplier([1.2,1.3]),1.5);
    assert.equal(rules.getCrossoverMultiplier([9,4,3]),1.6);
    assert.equal(rules.getCrossoverMultiplier([NaN,Infinity,1]),1);
    assert.equal(rules.getCrossoverMultiplier([1.6,0.5]),0.8);
  });
  await check('真实削弱产生破绽；同体系不能兑现；跨体系命中后消费',async()=>{
    const b=state(), p=b.playerCombatStates[0],e=b.enemyParty[0];
    await c.performAction(p,e,{name:'试验削弱',p:0,t:'NORMAL',pp:10,acc:0,effect:{type:'DEBUFF',target:'enemy',stat:'p_def',val:1}},'player',b);
    assert.ok(e.volatiles.tacticalOpening);
    assert.equal(rules.hasTacticalOpening(e,b,p,p.combatMoves[0]),false);
    await c.performAction(p,e,{...rules.buildBreathingMoves('fire',6)[1],acc:0},'player',b);
    assert.equal(e.volatiles.tacticalOpening,undefined);
    assert.ok(logs.some(log=>log.includes('协同追击')));
  });
  await check('落空、免疫与守住不虚构破绽或追击',async()=>{
    const b=state(), p=b.playerCombatStates[0],e=b.enemyParty[0];
    e.volatiles.protected=true;
    await c.performAction(p,e,{name:'削弱',p:0,t:'NORMAL',pp:10,acc:0,effect:{type:'DEBUFF',target:'enemy',stat:'p_def',val:1}},'player',b);
    assert.equal(e.volatiles.tacticalOpening,undefined);
    e.volatiles.protected=false; e.type='GHOST';
    e.volatiles.tacticalOpening={family:'ninja',ownerUid:'p0',expiresAt:5};
    await c.performAction(p,e,p.combatMoves[0],'player',b);
    assert.ok(e.volatiles.tacticalOpening);
  });
  await check('镜像完全抵消实际伤害时保留破绽，飘字不会虚报伤害',async()=>{
    const b=state(),p=b.playerCombatStates[0],e=b.enemyParty[0];
    b._mirrorClonesActive=true;e.volatiles.tacticalOpening={family:'ninja',ownerUid:'p0',expiresAt:5};
    const originals=[c.checkMirrorCloneReflect,c.setBattleImpact];let impact;
    c.checkMirrorCloneReflect=()=>.1;c.setBattleImpact=event=>{impact=event;};
    const hp=e.currentHp;
    try {
      await c.performAction(p,e,p.combatMoves[0],'player',b);
      assert.equal(e.currentHp,hp);assert.ok(e.volatiles.tacticalOpening);assert.equal(impact.damage,0);assert.equal(impact.opening,false);
    } finally {[c.checkMirrorCloneReflect,c.setBattleImpact]=originals;}
  });
  await check('全集中占行动并准备两次斩技；受控不消耗准备次数',async()=>{
    const b=state(),p=b.playerCombatStates[0],e=b.enemyParty[0];
    const [focus,cut]=rules.buildBreathingMoves('fire',6);
    await c.performAction(p,e,focus,'player',b);
    assert.equal(p.volatiles.breathingFocus,2);
    p.status='SLP';p.volatiles.sleepTurns=3;
    await c.performAction(p,e,cut,'player',b);
    assert.equal(p.volatiles.breathingFocus,2);
    p.status=null;
    await c.performAction(p,e,cut,'player',b);
    assert.equal(p.volatiles.breathingFocus,1);
  });
  await check('果实真实HP上限与全队爆发互斥',()=>{
    const b=state(true),p=b.playerCombatStates[0],mate=b.playerCombatStates[1];
    const max=d.getStatsRaw(p).maxHp;p.currentHp=Math.floor(max*.5);
    assert.equal(commands.applyFruitTransform(b,p,'player',{duration:3,transform:{hpMult:3}},max),true);
    assert.equal(p.currentHp,max);
    mate.ultraHeroId='tiga';mate.ultraFormId='multi';
    assert.ok(d.getUltraTransformBlock(b,mate));
    assert.equal(rules.spendTeamBurst(b,'player','bijuu'),false);
    assert.equal(rules.spendTeamBurst(b,'enemy','fruit'),true);
  });
  await check('双打预留果实爆发与束缚全部咒力，防止第二位超额承诺',()=>{
    const b=state(true);b.phase='double_input_2';b.doubleActions=[{activeIdx:0,moveIdx:{isBattleCommand:true,effect:{type:'BATTLE_FRUIT'}}}];
    assert.ok(rules.getBurstBlock(b).includes('预留'));
    const {getQueuedDoubleMoveResourceCost}=loader('src/utils/combatRules.js');
    b.doubleActions[0].moveIdx=commands.buildVowCommand({id:'test',name:'焚尽',ceCost:10,sacrifice:{cePercent:1},reward:{nextMovePower:2}});
    assert.equal(getQueuedDoubleMoveResourceCost(b,'ce'),100);
    assert.equal(rules.getBurstBlock(b),'');
  });
  await check('单打两次行动后统一回合结算与尾兽到期',async()=>{
    const b=state();b.playerCombatStates[0].bijuuTransformed=true;b.playerCombatStates[0].bijuuTurnsLeft=1;
    b.playerCombatStates[0].customBaseStats.spd=1;
    await c.executeTurn(0);
    assert.equal(c.battle.turnCount,4);
    assert.equal(c.battle.playerCombatStates[0].combatMoves[0].pp,19);
    assert.equal(c.battle.enemyParty[0].combatMoves[0].pp,19);
    assert.equal(c.battle.playerCombatStates[0].bijuuTransformed,false);
    assert.ok(c.battle.sharedPlayerChakra>100);
    assert.equal(c.battle.phase,'input');
  });
  await check('双打蓄力选择不回能；睡眠阻止蓄力，仍只有一次自然恢复',async()=>{
    const b=state(true);b.sharedPlayerCE=0;b.sharedPlayerChakra=0;
    b.playerCombatStates[0].status='SLP';b.playerCombatStates[0].volatiles.sleepTurns=3;
    await c.executeChargeCE();
    assert.equal(c.battle.phase,'double_input_2');assert.equal(c.battle.sharedPlayerCE,0);
    await c.executeDoubleRound([{moveIdx:-2,activeIdx:0},{moveIdx:0,activeIdx:1,targetEnemyIdx:0}],c.battle);
    assert.equal(c.battle.sharedPlayerCE,d.CURSED_ENERGY_CONFIG.regenPerTurn);
    assert.equal(c.battle.turnCount,4);
  });
  await check('联合技等待较慢伙伴，受控中断不扣查克拉',async()=>{
    const {resolveTeamAction}=loader('src/utils/teamActions.js');const b=state(true);
    const before=b.sharedPlayerChakra;b.playerCombatStates[1].status='SLP';b.playerCombatStates[1].volatiles.sleepTurns=3;
    await resolveTeamAction(b,{combo:{name:'测试联合',power:100,chakraCost:50,natures:['fire']},participantIdxs:[0,1],targetIdx:0},{getStats:d.getStatsRaw,checkReady:c.checkBattleActionReady,performAction:c.performAction,addLog:message=>logs.push(message)});
    assert.equal(b.sharedPlayerChakra,before);
    assert.ok(logs.some(log=>log.includes('中断')));
  });
  await check('敌方意图固定且读取真实技能PP对象',()=>{
    const b=state(),enemy=b.enemyParty[0],targets=[{unit:b.playerCombatStates[0],idx:0}];
    const first=c.getPlannedEnemyAction(b,enemy,targets);
    assert.equal(c.getPlannedEnemyAction(b,enemy,targets).move,first.move);
  });
  await check('防御先于濒死保护，超额重击仍只留下1HP',async()=>{
    const b=state(),p=b.playerCombatStates[0],e=b.enemyParty[0];
    e.trait='sturdy';e.currentHp=d.getStatsRaw(e).maxHp;
    p.customBaseStats.p_atk=999999;
    rules.applyTacticalGuard(e,b);
    await c.performAction(p,e,{name:'重击',p:9999,t:'NORMAL',cat:'physical',acc:0,pp:5},'player',b);
    assert.equal(e.currentHp,1);
    assert.equal(e.volatiles.tacticalGuard,undefined);
  });
  await check('单打击倒仍结算中毒、能量、回合与替补，不重复奖励',async()=>{
    const b=state();const p=b.playerCombatStates[0],e=b.enemyParty[0];
    p.customBaseStats.spd=999;p.status='PSN';p.bijuuTransformed=true;p.bijuuTurnsLeft=1;
    e.currentHp=1;b.enemyParty.push(pet('e1',true));
    const before=p.currentHp;let rewards=0;
    const old=c.processDefeatedEnemy;
    c.processDefeatedEnemy=(_e,party,current)=>{rewards++;return {newParty:party.map((unit,index)=>({...unit,currentHp:current.playerCombatStates[index].currentHp})),logMsg:'奖励',activeDidLevelUp:false};};
    try {
      await c.executeTurn(0);
      assert.equal(rewards,1);assert.equal(c.battle.enemyActiveIdx,1);assert.equal(c.battle.turnCount,4);
      assert.equal(c.battle.playerCombatStates[0].currentHp,before-Math.floor(d.getStatsRaw(p).maxHp/8));
      assert.equal(c.battle.playerCombatStates[0].bijuuTransformed,false);
      assert.ok(c.battle.sharedPlayerChakra>100);
      assert.equal(c.battle.enemyParty[0].currentHp,0);
    } finally {c.processDefeatedEnemy=old;}
  });
  await check('双方同时倒下不会胜利或被回复复活，有替补则进入换人',async()=>{
    for(const backup of [false,true]) {
      const b=state();b.playerCombatStates[0].currentHp=0;b.enemyParty[0].currentHp=0;
      if(backup) {b.playerCombatStates.push(pet('backup'));b.enemyParty.push(pet('reserve',true));}
      let wins=0,losses=0;
      const originals=[c.handleWin,c.handleDefeat,c.processDefeatedEnemy];
      c.handleWin=async()=>{wins++;};c.handleDefeat=async()=>{losses++;};
      c.processDefeatedEnemy=(_e,party)=>({newParty:party,logMsg:'奖励'});
      try {
        await c.settleSingleRound(b);
        assert.equal(wins,0);assert.equal(losses,backup?0:1);
        assert.equal(b.playerCombatStates[0].currentHp,0);
        if(backup) {assert.equal(c.battle.showSwitch,true);assert.equal(c.battle.enemyActiveIdx,1);}
      } finally {[c.handleWin,c.handleDefeat,c.processDefeatedEnemy]=originals;}
    }
  });
  await check('协作技受控制、守住与队伍一次限制，不能绕开通用结算',async()=>{
    const {buildPartnerCommand}=loader('src/utils/teamActions.js');
    const b=state();const p=b.playerCombatStates[0],e=b.enemyParty[0],partner=pet('mate');b.playerCombatStates.push(partner);
    p.partnerId=partner.uid;const move=buildPartnerCommand(p,partner,{name:'搭档合击',power:100,type:'NORMAL'}, {powerMult:1});
    partner.status='SLP';partner.volatiles.sleepTurns=3;
    const before=p.currentHp;
    await c.performAction(p,e,move,'player',b);
    assert.equal(p.currentHp,before);assert.equal(b.partnerComboUsed,undefined);
    partner.status=null;e.volatiles.protected=true;
    const enemyHp=e.currentHp;
    await c.performAction(p,e,move,'player',b);
    assert.equal(e.currentHp,enemyHp);assert.equal(b.partnerComboUsed.player,true);
    assert.equal(p.currentHp,before-Math.floor(d.getStatsRaw(p).maxHp*.15));
    const after=p.currentHp;await c.performAction(p,e,move,'player',b);assert.equal(p.currentHp,after);
  });
  await check('成长同步保留战斗临时技能和消耗的PP，不复活倒下单位',()=>{
    const unit=pet('p');unit.combatMoves.push(...rules.buildBreathingMoves('water',6));unit.combatMoves[1].pp=1;
    const next=rules.mergeBattleGrowth(unit,{...unit,currentHp:0,level:61,moves:[{name:'新技能',pp:7}]});
    assert.equal(next.currentHp,0);assert.equal(next.level,61);
    assert.equal(next.combatMoves.find(move=>move.id==='breathing_focus').pp,1);
    assert.equal(next.combatMoves[0].name,'新技能');
  });
  await check('双打联合技按较慢成员速度排队，先手睡眠能中断并保留资源',async()=>{
    const b=state(true);b.playerCombatStates[0].customBaseStats.spd=999;b.playerCombatStates[1].customBaseStats.spd=1;
    b.enemyParty[0].customBaseStats.spd=500;
    b.enemyParty[0].combatMoves=[{name:'先手催眠',p:0,t:'PSYCHIC',acc:0,pp:10,effect:{type:'STATUS',status:'SLP',chance:1,target:'enemy'}}];
    b.enemyPlansTurn=3;b.enemyPlans={0:{uid:'e0',moveIndex:0,targetIdx:1},1:{uid:'e1',moveIndex:0,targetIdx:0}};
    const old=c.isComboJutsuAvailableInDouble;c.isComboJutsuAvailableInDouble=()=>true;
    const combo=d.COMBO_JUTSU_LIST.find(move=>move.power>0);
    try {
      await c.executeDoubleRound([{moveIdx:-3,activeIdx:0,comboJutsuId:combo.id},{moveIdx:-3,activeIdx:1}]);
      assert.ok(logs.some(log=>log.includes('中断')));
      assert.ok(c.battle.sharedPlayerChakra>=100);
      assert.equal(c.battle.turnCount,4);
    } finally {c.isComboJutsuAvailableInDouble=old;}
  });
  console.log(JSON.stringify({suite:'battle-tactics',checks}));
}
if (require.main===module) run().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={run};
