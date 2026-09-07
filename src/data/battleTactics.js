export const BATTLE_TACTICS = {
  version: 1,
  crossoverBonusCap: 0.6,
  openingBonus: 0.2,
  openingDuration: 2,
  breathingFocusBonus: 0.25,
  breathingFocusUses: 2,
  breathingGuardReduction: 0.35,
  guardReduction: 0.5,
  breathingBadgeRequirement: 6,
  burstLimitPerSide: 1,
};

export const COMBAT_FAMILIES = [
  { id:'basic', name:'精灵', color:'#90bca3' },
  { id:'ninja', name:'忍术', color:'#d6ac72' },
  { id:'breathing', name:'呼吸', color:'#8acbd2' },
  { id:'martial', name:'武学', color:'#d2c789' },
  { id:'curse', name:'咒术', color:'#bda0c6' },
  { id:'burst', name:'觉醒', color:'#df8995' },
];

// Breathing is a prepared combat technique. World-route bonuses remain separate.
export const BREATHING_TECHNIQUES = {
  water: { name:'水面斩', p:75, t:'WATER', effect:{type:'BUFF',stat:'p_def',val:1,chance:0.4,target:'self'} },
  fire: { name:'不知火', p:85, t:'FIRE' },
  thunder: { name:'霹雳一闪', p:60, t:'ELECTRIC', priority:1 },
  wind: { name:'尘旋风', p:75, t:'FLYING', acc:110 },
  stone: { name:'蛇纹岩·双极', p:70, t:'ROCK', effect:{type:'BUFF',stat:'p_def',val:1,chance:0.6,target:'self'} },
  flower: { name:'御影梅', p:70, t:'FAIRY', effect:{type:'DEBUFF',stat:'p_atk',val:1,chance:0.5,target:'enemy'} },
  beast: { name:'穿透刺射', p:80, t:'FIGHT' },
  insect: { name:'蝶之舞·戏弄', p:60, t:'BUG', effect:{type:'STATUS',status:'PSN',chance:0.6,target:'enemy'} },
  mist: { name:'垂天远霞', p:70, t:'ICE', effect:{type:'DEBUFF',stat:'acc',val:1,chance:0.5,target:'enemy'} },
  sun: { name:'圆舞', p:80, t:'LIGHT' },
  moon: { name:'暗月·宵之宫', p:75, t:'DARK', effect:{type:'DEBUFF',stat:'s_def',val:1,chance:0.4,target:'enemy'} },
};

export const BREATHING_FOCUS = { id:'breathing_focus', name:'全集中', p:0, t:'NORMAL', category:'status', acc:100, pp:3, maxPP:3, isBreathing:true, effect:{type:'BREATH_FOCUS',target:'self'} };

export const BATTLE_CHARGE = { id:'battle_charge', name:'凝神蓄力', p:0, t:'NORMAL', cat:'status', acc:0, pp:99, isBattleCommand:true, effect:{type:'BATTLE_CHARGE',target:'self'} };
export const BATTLE_GUARD = { id:'battle_guard', name:'防御', p:0, t:'NORMAL', cat:'status', acc:0, pp:99, priority:2, isBattleCommand:true, effect:{type:'TACTICAL_GUARD',target:'self'} };
