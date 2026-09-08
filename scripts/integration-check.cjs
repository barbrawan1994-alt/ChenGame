const assert=require('assert/strict');
const fs=require('fs');
const crypto=require('crypto');
const {load,loadAppImports,bindAppFunctions}=require('./helpers/project-harness.cjs');
const d=loadAppImports();
const u=load('src/utils/ultraRules.js'),r=load('src/utils/kaijuRaids.js');
const {ULTRA_DEVICES}=load('src/data/ultraDevices.js');
const {KAIJU_RAIDS}=load('src/data/kaijuRaids.js');
const {KAIJU}=load('src/data/kaiju.js');
const sprite=load('src/SpriteMap.js');
const manifest=require('../public/assets/spirits/manifest.json');
const sources=require('../public/assets/kaiju/sources.json');
assert.equal(KAIJU.length,400);
for(const key of ['id','name','wiki'])assert.equal(new Set(KAIJU.map(x=>x[key])).size,400,key);
assert.equal(new Set(KAIJU.map(x=>sources[x.id].pageId || sources[x.id].url)).size,400,'Canonical species pages must be distinct');
assert.equal(new Set(KAIJU.map(x=>crypto.createHash('sha256').update(fs.readFileSync(`public/${x.portrait}`)).digest('hex'))).size,400);
assert.equal(Object.keys(manifest).length,96);
assert.equal(new Set(Object.values(manifest).map(x=>x.sha256)).size,96);
for(let id=905;id<=1000;id++){
  for(const url of sprite.getSpriteFallbackUrls({id}))assert.ok(url.startsWith(`assets/spirits/${id}.`));
  const bytes=fs.readFileSync(`public/${sprite.getSpriteUrl({id})}`);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),manifest[id].sha256);
}
const newSave=u.normalizeUltraState();
assert.equal(newSave.deviceIds.length,0);
const legacy=u.normalizeUltraState({version:2,heroId:'leo',trialWins:['leo'],unlockedHeroIds:['leo'],hostUid:'host'});
assert.ok(legacy.deviceIds.includes('device_leo'));
assert.deepEqual(u.normalizeUltraState(legacy),legacy);
assert.equal(ULTRA_DEVICES.length,93);
for(const device of ULTRA_DEVICES){
  const result=u.completeUltraTrial(newSave,device.heroId);
  assert.equal(result.state.deviceIds.join(','),device.id);
  assert.equal(u.completeUltraTrial(result.state,device.heroId).firstClear,false);
  const pet={uid:'host',currentHp:100,moves:[]};
  assert.equal(u.assignUltraContract(pet,{...result.state,hostUid:'host',heroId:device.heroId},'wild').ultraDeviceId,device.id);
  assert.equal(u.assignUltraContract(pet,{...newSave,hostUid:'host',heroId:device.heroId},'wild').ultraDeviceId,undefined);
  const actor={...pet,ultraHeroId:device.heroId};
  assert.match(u.getUltraTransformBlock({phase:'input',turnCount:1},actor),/变身器/);
}
const {calcTrainingGain,TRAINING_CAMPS,TRAINING_TIERS}=load('src/data/training.js');
assert.equal(calcTrainingGain({evs:{hp:252,p_atk:250,crit:200}},TRAINING_CAMPS[2],TRAINING_TIERS[3],10,()=>1),8);
const {getExpeditionEggPool}=load('src/utils/speciesAvailability.js');
for(const zone of d.EXPEDITION_ZONES){
  const pool=getExpeditionEggPool(d.POKEDEX,d.MAPS,d.LEGEND_OBTAIN_RULES,zone,60);
  assert.ok(pool.length>0,zone.id);
  assert.ok(pool.every(p=>p.acquisition!=='trial'));
}
assert.ok(getExpeditionEggPool(d.POKEDEX,d.MAPS,d.LEGEND_OBTAIN_RULES,{bonusTypes:['ALL']},100).some(p=>p.id===992));
const {createPet}=load('src/utils/petFactory.js');
const make=(id,level)=>createPet(id,level,false,false,{getStatsForPet:d.getStatsRaw,preserveSpecies:true});
const party=[943,907,925,992].map(id=>make(id,100));
for(const raid of KAIJU_RAIDS){
  const foes=r.buildRaidParty(raid,{createPet:make,pokedex:d.POKEDEX,getStats:d.getStatsRaw});
  assert.equal(foes.length,raid.guards.length+1);
  assert.equal(r.getRaidBlock(raid,party,16,raid.stake),'');
  assert.ok(r.getRaidBlock(raid,party,16,raid.stake-1));
  const reward=r.getRaidReward({},raid,'2026-09-08');
  assert.equal(reward.gold,raid.gold);
  assert.equal(r.getRaidReward(reward.state,raid,'2026-09-08').gold,0);
  const next=r.getRaidReward(reward.state,raid,'2026-09-09');
  assert.equal(next.gold,raid.repeatGold);assert.equal(next.vitamin,null);
  const boss=foes.find(x=>x.kaijuId===raid.boss);boss.maxHp=d.getStatsRaw(boss).maxHp;boss.currentHp=1;
  const kaiju=load('src/utils/kaijuRules.js');
  const action=kaiju.getKaijuAction({turnCount:0},boss,[{idx:0,unit:party[0]}],m=>m.pp>0);
  assert.equal(action.move,boss.moves[raid.phaseSequence[boss.kaijuSlot%raid.phaseSequence.length]]);
}
const timers=[],starts=[],saved=[];let inventory={berries:{},meds:{}};let result;
const f=bindAppFunctions(['normalizeBerriesInventory','addBerries','startKaijuRaid','finishUltraTrial'],{...d,...r,_:require('lodash'),
  partyRef:{current:party},goldRef:{current:50000},badges:Array(16).fill(1),battle:null,battleResultHandledRef:{current:false},
  ultraTrialStartLockRef:{current:false},ultraTrialActiveRef:{current:false},ultraStateRef:{current:newSave},pendingJutsuWinForBountyRef:{current:false},
  createPet:make,getStats:d.getStatsRaw,flushSync:fn=>fn(),setTimeout:fn=>timers.push(fn),window:{setTimeout:fn=>timers.push(fn)},
  setGold:()=>{},setRaidResult:v=>result=v,setUltraResult:()=>{},setKaijuTab:()=>{},setUltraState:()=>{},setParty:()=>{},setView:()=>{},setBattle:()=>{},setAnimEffect:()=>{},setBattleImpact:()=>{},
  showMapToast:()=>{},recordKaijuProgress:()=>{},combatMetrics:{finish:()=>{}},updateAchStat:()=>{},getLocalDateStr:()=> '2026-09-08',
  setInventory:fn=>{inventory=fn(inventory);},persistSaveRef:{current:()=>saved.push(f.goldRef.current)},
  startBattle:(context,type)=>{starts.push(context);return true;},
});
const flush=()=>{while(timers.length)timers.shift()();};
const raid=KAIJU_RAIDS[0];
f.startKaijuRaid(raid.id);f.startKaijuRaid(raid.id);
assert.equal(starts.length,1);assert.equal(f.goldRef.current,50000-raid.stake);assert.equal(saved[0],50000-raid.stake);
f.finishUltraTrial({...starts[0],enemyParty:starts[0].customParty},false);flush();
assert.equal(result.won,false);assert.equal(f.goldRef.current,50000-raid.stake);
f.startKaijuRaid(raid.id);flush();
const snapshot={...starts[1],enemyParty:starts[1].customParty.map(p=>({...p,currentHp:0}))};
f.finishUltraTrial(snapshot,true);flush();
assert.equal(f.goldRef.current,50000-raid.stake+raid.gold);assert.equal(inventory[raid.vitamin],1);
assert.equal(inventory.meds[raid.vitamin],undefined,'Vitamins must be usable from the growth inventory');
f.finishUltraTrial(snapshot,true);assert.equal(inventory[raid.vitamin],1,'No duplicate settlement');
const before=f.goldRef.current;f.startBattle=()=>false;f.startKaijuRaid(raid.id);flush();assert.equal(f.goldRef.current,before);
console.log(JSON.stringify({species:400,uniqueSpiritArt:96,devices:93,raids:8,penaltyAndRewards:true,trainingAndEggPools:true}));
