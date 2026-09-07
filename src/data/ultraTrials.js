export const ULTRA_TRIAL_TIERS = [
  {name:'精英',minLevel:30,badges:4,wins:0,levelBonus:2,hp:160,attack:110,defense:100},
  {name:'大师',minLevel:50,badges:6,wins:3,levelBonus:3,hp:185,attack:128,defense:110},
  {name:'传奇',minLevel:70,badges:8,wins:12,levelBonus:5,hp:220,attack:148,defense:120},
];

export const ULTRA_TRIAL_PREREQUISITES = {
  king:['father','mother'],noa:['nexus'],legend:['cosmos','justice'],saga:['zero','dyna','cosmos'],
  reiga:['ginga','victory','x','orb','geed','taiga'],ginga_victory:['ginga','victory'],
  ruebe:['rosso','blu'],gruebe:['rosso','blu','grigio'],zagi:['nexus'],
};

export const ULTRA_TRIAL_ROLES = {
  balanced:{name:'攻守轮换',hint:'先提升物防，再交替释放属性攻击和必杀；特攻能绕开物防强化。',effect:{type:'BUFF',stat:'p_def',val:1,target:'self'}},
  striker:{name:'蓄势强袭',hint:'蓄势提高物攻但降低速度；看见必杀意图时防御，随后争取先手。',effect:{type:'BUFF',stat:'p_atk',val:1,target:'self',selfDebuff:{stat:'spd',val:1}}},
  beam:{name:'光线压制',hint:'先降低目标特防，再准备光线必杀；用特防伙伴接招或控制打断。',effect:{type:'DEBUFF',stat:'s_def',val:1,chance:1,target:'enemy'}},
  swift:{name:'速度争夺',hint:'减速后争夺先手；优先级招式、防御或麻痹可以改变行动顺序。',effect:{type:'DEBUFF',stat:'spd',val:1,chance:1,target:'enemy'}},
  guardian:{name:'坚壁反击',hint:'逐步提高特防后反击；物理输出和破绽配合更适合突破。',effect:{type:'BUFF',stat:'s_def',val:1,target:'self'}},
  healer:{name:'续航考验',hint:'先强化防御，第3回合用医疗必杀回复，治疗只有3次；集中输出或控制能阻止回复。',effect:{type:'BUFF',stat:'p_def',val:1,target:'self'}},
};
