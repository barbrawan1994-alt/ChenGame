const assert=require('node:assert/strict');
const fs=require('fs');
const path=require('path');
const {load,root,seededRandom,bindAppFunctions}=require('./helpers/project-harness.cjs');
const {createCombatHarness}=require('./longrun-combat-check.cjs');

async function run() {
  const {KAIJU,KAIJU_BY_ID,KAIJU_STYLES,KAIJU_RANKS}=load('src/data/kaiju.js');
  const k=load('src/utils/kaijuRules.js'),u=load('src/utils/ultraRules.js'),trials=load('src/utils/ultraTrials.js');
  const {ULTRA_HEROES}=load('src/data/ultra.js');
  const {ULTRA_NEMESES}=load('src/data/kaijuTrials.js');
  const {c,d,loader}=createCombatHarness(()=>0.25);
  const {createPet}=loader('src/utils/petFactory.js');
  const create=(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw,preserveSpecies:true});
  const base=create(9,80);
  Object.assign(base,{trait:'none',nature:'docile',sectId:0,equips:[],devilFruit:null,type:'NORMAL',type2:null,isShiny:false,customBaseStats:{hp:300,p_atk:90,s_atk:90,p_def:100,s_def:100,spd:80,crit:0}});
  const sources=JSON.parse(fs.readFileSync(path.join(root,'public/assets/kaiju/sources.json'),'utf8'));
  assert.ok(KAIJU.length>=200);
  for(const key of ['id','name'])assert.equal(new Set(KAIJU.map(item=>item[key])).size,KAIJU.length,`Duplicate ${key}`);
  assert.equal(new Set(KAIJU.map(item=>sources[item.id]?.url)).size,KAIJU.length,'Do not count the same canonical species twice');
  for(const id of Object.values(ULTRA_NEMESES))assert.ok(KAIJU_BY_ID[id],`Missing nemesis ${id}`);
  let movesTested=0;
  const weather=Object.keys(d.WEATHERS);
  for(const item of KAIJU) {
    assert.ok(d.TYPES[item.type] && KAIJU_STYLES[item.style] && KAIJU_RANKS[item.rank]);
    assert.ok(sources[item.id]?.image && sources[item.id]?.url);
    if(!process.argv.includes('--skip-art'))assert.ok(fs.statSync(path.join(root,'public',item.portrait)).size>1000,item.id);
    const unit=k.buildKaijuUnit(item.id,80,{createPet:create,pokedex:d.POKEDEX,getStats:d.getStatsRaw});
    assert.equal(unit.moves.length,4);assert.equal(unit.name,item.name);assert.equal(unit.moves[3].name,item.signature);
    assert.equal(unit.devilFruit,null);assert.equal(unit.cursedTechnique,null);
    for(const value of Object.values(d.getStatsRaw(unit)))assert.ok(Number.isFinite(value) && value>=0);
    for(const sky of weather) for(let index=0;index<4;index++) {
      const actor={...structuredClone(unit),stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},status:null,combatMoves:structuredClone(unit.moves)};
      const target={...structuredClone(base),uid:'target',stages:{...d.DEFAULT_BATTLE_STAGES},volatiles:{},status:null,combatMoves:[]};
      actor.currentHp=Math.floor(d.getStatsRaw(actor).maxHp*.35);target.currentHp=d.getStatsRaw(target).maxHp;
      const move=actor.combatMoves[index];
      const state={type:'wild',activeIdx:0,enemyActiveIdx:0,playerCombatStates:[target],enemyParty:[actor],turnCount:1};
      c.battle=state;c.party=[target];c.weather=sky;
      await c.performAction(actor,target,move,'enemy',state);
      assert.ok(actor.currentHp>=0 && Number.isFinite(actor.currentHp));assert.ok(target.currentHp>=0 && Number.isFinite(target.currentHp));
      assert.equal(move.pp,move.maxPP-1,`${item.id}: skill must spend PP`);
      if(index===2) {
        const effect=move.effect;
        if(effect.type==='HEAL')assert.ok(actor.currentHp>Math.floor(d.getStatsRaw(actor).maxHp*.35));
        if(effect.type==='BUFF')assert.equal(actor.stages[effect.stat],effect.val);
        if(effect.type==='DEBUFF')assert.equal(target.stages[effect.stat],-effect.val);
        if(effect.type==='STATUS' && effect.status==='CON')assert.ok(target.volatiles.confused>0);
        if(effect.type==='STATUS' && effect.status!=='CON')assert.equal(target.status,effect.status);
      }
      movesTested++;
    }
  }
  const qualified=[{level:100,currentHp:100},{level:100,currentHp:100},{level:100,currentHp:100}];
  const routes=new Set();
  for(const hero of ULTRA_HEROES) for(const route of [0,1,2]) {
    const trial=trials.getUltraTrial(hero.id,qualified,route);
    assert.equal(trial.monsters.length,2);
    assert.notEqual(trial.monsters[0].id,trial.monsters[1].id);
    assert.notEqual(trial.monsters[0].style,trial.monsters[1].style);
    routes.add(`${trial.monsters.map(item=>item.id).join(':')}:${trial.isDouble}`);
    assert.equal(route===2 ? trial.isDouble : true,true);
  }
  assert.ok(routes.size>=ULTRA_HEROES.length*2,'Trial monster lineups should be meaningfully varied');
  const invalid=k.normalizeKaijuProgress({seenIds:[undefined,null,'__proto__','gomora','gomora','unknown'],defeatedIds:['zetton'],recentIds:KAIJU.map(x=>x.id),wildSinceEncounter:Infinity});
  assert.equal(invalid.seenIds.join(','),'gomora,zetton');assert.equal(invalid.recentIds.length,10);
  assert.deepEqual(k.normalizeKaijuProgress(invalid),invalid);
  const projected=k.recordKaijuBattle({},[{name:'hero projection',currentHp:0},{kaijuId:'gomora',currentHp:0}],{defeated:true});
  assert.equal(projected.seenIds.join(','),'gomora');assert.equal(projected.defeatedIds.join(','),'gomora');
  const restored=u.normalizeUltraState({heroId:'tiga',kaiju:invalid});assert.deepEqual(restored.kaiju,invalid);
  assert.deepEqual(u.completeUltraTrial(restored,'zoffy').state.kaiju,invalid,'Contract unlock must preserve dex');
  const map=d.MAPS.find(item=>item.id===3);
  assert.equal(k.getKaijuEncounterPool({map,badgeCount:1,party:qualified,level:100}).length,0);
  assert.equal(k.getKaijuEncounterPool({map,badgeCount:8,party:qualified,level:17}).length,0);
  assert.ok(k.getKaijuEncounterPool({map,badgeCount:2,party:qualified,level:100}).every(item=>item.rank===0));
  const random=seededRandom(90412),seen=new Set();let progress=k.normalizeKaijuProgress(),encounters=0,local=0,nonRifts=0;
  for(let i=0;i<18000;i++) {
    const currentMap=d.MAPS[i%d.MAPS.length];
    const options={map:currentMap,party:qualified,badgeCount:8,level:95,weather:weather[i%weather.length],timePhase:i%2 ? 'NIGHT' : 'DAY',progress,isDouble:i%3===0};
    const encounter=k.rollKaijuEncounter(options,random);
    if(encounter) {
      assert.ok(encounter.ids.every(id=>!progress.recentIds.includes(id)),'Recent ten must not repeat');
      assert.equal(new Set(encounter.ids).size,encounter.ids.length,'Double encounter cannot duplicate species');
      if(!encounter.rift) {nonRifts++;if(KAIJU_BY_ID[encounter.ids[0]].habitats.includes({forest:'grass',capital:'city'}[currentMap.type]||currentMap.type))local++;}
      const enemies=encounter.ids.map(id=>({kaijuId:id,currentHp:0}));
      progress=k.recordKaijuBattle(progress,enemies,{wild:true});
      const reward=k.getKaijuReward(enemies,random);
      assert.ok(d.BERRIES[reward.berry] && reward.goldMult>=1.8 && reward.goldMult<=3.2);
      if(reward.vitamin)assert.ok(d.GROWTH_ITEMS.some(item=>item.id===reward.vitamin));
      if(reward.stone)assert.ok(d.EVO_STONES[reward.stone]);
      encounter.ids.forEach(id=>seen.add(id));encounters++;
      assert.equal(k.rollKaijuEncounter({...options,progress},()=>0),null,'At least one normal battle between kaiju');
    } else progress=k.recordKaijuBattle(progress,[],{eligible:true});
    if(i%113===0)progress=k.normalizeKaijuProgress(JSON.parse(JSON.stringify(progress)));
  }
  assert.equal(seen.size,KAIJU.length,'Every species reachable through natural encounters');
  assert.ok(local/nonRifts>0.55,'Biome still needs to matter');
  const pity=k.rollKaijuEncounter({map,party:qualified,badgeCount:8,level:80,progress:{wildSinceEncounter:10}},()=>.999);
  assert.ok(pity,'Ten ordinary eligible battles guarantee the next encounter');
  const guard=bindAppFunctions(['handleCatch'],{battle:{_kaijuEncounter:true},battleSpecialActionLockRef:{current:false},setShowBallMenu:()=>{},addLog:message=>message});
  assert.ok((await guard.handleCatch('master')).includes('无法'));
  assert.equal(guard.battleSpecialActionLockRef.current,false,'Blocked capture releases its lock without spending inventory');
  console.log(JSON.stringify({suite:'kaiju',species:KAIJU.length,movesTested,trialRoutes:routes.size,randomBattles:18000,kaijuEncounters:encounters,reachableSpecies:seen.size,localBiomeShare:Number((local/nonRifts).toFixed(3))}));
}
run().catch(error=>{console.error(error);process.exitCode=1;});
