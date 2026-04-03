export const BALLS = {
  poke:   { id: 'poke',   name: '精灵球', rate: 1.0, price: 200, icon: '🔴', desc: '基础捕获球' },
  great:  { id: 'great',  name: '超级球', rate: 1.5, price: 600, icon: '🔵', desc: '中等概率捕获' },
  ultra:  { id: 'ultra',  name: '高级球', rate: 2.0, price: 1200, icon: '⚫', desc: '高概率捕获' },
  master: { id: 'master', name: '大师球', rate: 255, price: 0,   icon: '🟣', desc: '必定捕获成功！' },
  // 对应深蓝海域(Map4) 和 虫系精灵
  net:    { id: 'net',    name: '网纹球', rate: 3.5, price: 1000, icon: '🕸️', desc: '捕捉水系/虫系效果拔群' },
  // 对应遗迹工厂(Map3)、幽灵古堡(Map7)、银河空间站(Map12)
  dusk:   { id: 'dusk',   name: '黑暗球', rate: 3.5, price: 1000, icon: '🌑', desc: '在工厂/古堡/宇宙或抓幽灵系时效果拔群' },
  // 适合开局直接扔
  quick:  { id: 'quick',  name: '先机球', rate: 5.0, price: 1000, icon: '⚡', desc: '战斗前3回合使用效果极佳' },
  // 适合打神兽/Boss战
  timer:  { id: 'timer',  name: '计时球', rate: 1.0, price: 1000, icon: '⏳', desc: '回合数越多越容易捕捉(10回合后最大)' },
  // 适合捕捉后直接用
  heal:   { id: 'heal',   name: '治愈球', rate: 1.0, price: 300,  icon: '💖', desc: '捕获后恢复满体力' }
};

export const MEDICINES = {
  potion:       { id: 'potion',       name: '伤药',      price: 50,  icon: '💊', type: 'HP', val: 20, desc: '恢复20点HP' },
  super_potion: { id: 'super_potion', name: '好伤药',    price: 100,  icon: '🧪', type: 'HP', val: 60, desc: '恢复60点HP' },
  hyper_potion: { id: 'hyper_potion', name: '厉害伤药',  price: 300, icon: '💉', type: 'HP', val: 200, desc: '恢复200点HP' },
  max_potion:   { id: 'max_potion',   name: '全满药',    price: 500, icon: '✨', type: 'HP', val: 9999, desc: '恢复全部HP' },
  ether:        { id: 'ether',        name: 'PP单补剂',  price: 200,  icon: '💧', type: 'PP', val: 10, desc: '恢复1个技能10点PP' },
  max_ether:    { id: 'max_ether',    name: 'PP全补剂',  price: 500, icon: '🌊', type: 'PP_ALL', val: 10, desc: '恢复所有技能10点PP' },
  antidote:     { id: 'antidote',     name: '解毒药',    price: 100,  icon: '🤢', type: 'STATUS', val: 'PSN', desc: '治愈中毒状态' },
  paralyze_heal:{ id: 'paralyze_heal',name: '解麻药',    price: 100,  icon: '⚡', type: 'STATUS', val: 'PAR', desc: '治愈麻痹状态' },
  burn_heal:    { id: 'burn_heal',    name: '烧伤药',    price: 100,  icon: '🔥', type: 'STATUS', val: 'BRN', desc: '治愈灼伤状态' },
  full_heal:    { id: 'full_heal',    name: '万能药',    price: 400,  icon: '🌟', type: 'STATUS', val: 'ALL', desc: '治愈所有异常状态' },
  revive:       { id: 'revive',       name: '活力块',    price: 800, icon: '💎', type: 'REVIVE', val: 0.5, desc: '复活并恢复一半HP' },
  max_revive:   { id: 'max_revive',   name: '活力星',    price: 1200, icon: '🌟', type: 'REVIVE', val: 1.0, desc: '复活濒死精灵并恢复全部HP' },
};

export const TMS = [
  // ★ 基础技能书 (Tier 1) — 威力 50-70, 适合前期
  { id: 'tm_ember',  name: '火花冲击', type: 'FIRE',     p: 65,  pp: 15, price: 1500,  desc: '基础火系攻击，灼热的火焰冲击', tier: 1 },
  { id: 'tm_aqua',   name: '水流喷射', type: 'WATER',    p: 65,  pp: 15, price: 1500,  desc: '基础水系攻击，高压水流冲击', tier: 1 },
  { id: 'tm_vine',   name: '飞叶快刀', type: 'GRASS',    p: 65,  pp: 15, price: 1500,  desc: '基础草系攻击，锋利叶刃切割', tier: 1 },
  { id: 'tm_shock',  name: '电击波',   type: 'ELECTRIC', p: 60,  pp: 15, price: 1200,  desc: '基础电系攻击，释放电流冲击', tier: 1 },
  { id: 'tm_pup',    name: '增强拳',   type: 'FIGHT',    p: 50,  pp: 20, price: 2000,  desc: '攻击的同时提升自身攻击力', tier: 1 },
  // ★★ 进阶技能书 (Tier 2) — 威力 80-95, 适合中期
  { id: 'tm_flame',  name: '喷射火焰', type: 'FIRE',     p: 90,  pp: 12, price: 5000,  desc: '进阶火系技能，稳定火焰攻击，可能灼伤', tier: 2 },
  { id: 'tm_icebeam',name: '急冻光线', type: 'ICE',      p: 90,  pp: 10, price: 5000,  desc: '进阶冰系技能，冰冻光束，概率冻结', tier: 2 },
  { id: 'tm_shadow', name: '暗影球',   type: 'GHOST',    p: 85,  pp: 10, price: 5000,  desc: '进阶幽灵系技能，凝聚暗影之力', tier: 2 },
  { id: 'tm_sludge', name: '污泥炸弹', type: 'POISON',   p: 90,  pp: 8,  price: 6000,  desc: '进阶毒系技能，高概率使目标中毒', tier: 2 },
  { id: 'tm_psy',    name: '精神强念', type: 'PSYCHIC',  p: 90,  pp: 8,  price: 5500,  desc: '进阶超能系技能，精神力集中攻击', tier: 2 },
  // ★★★ 高级技能书 (Tier 3) — 威力 100-120, 适合后期
  { id: 'tm_eq',     name: '地震',     type: 'GROUND',   p: 110, pp: 8,  price: 12000, desc: '高级地面系技能，大地震动席卷全场', tier: 3 },
  { id: 'tm_dragon', name: '龙之波动', type: 'DRAGON',   p: 110, pp: 8,  price: 15000, desc: '高级龙系技能，龙族波动之力', tier: 3 },
  { id: 'tm_fight',  name: '近身战',   type: 'FIGHT',    p: 120, pp: 5,  price: 15000, desc: '高级格斗系技能，猛烈近战但降低双防', tier: 3 },
  { id: 'tm_dark',   name: '暗冥强击', type: 'DARK',     p: 110, pp: 5,  price: 12000, desc: '高级恶系技能，凝聚黑暗之力打击', tier: 3 },
  { id: 'tm_wind',   name: '龙卷天降', type: 'WIND',     p: 110, pp: 5,  price: 12000, desc: '高级风系技能，召唤龙卷风横扫', tier: 3 },
  // ★★★★ 终极大招 (Tier 4) — 威力 130-150, 适合终局
  { id: 'tm_fire',   name: '大字爆炎', type: 'FIRE',     p: 140, pp: 5,  price: 25000, desc: '火系终极大招，毁灭性的爆炎之力', tier: 4 },
  { id: 'tm_water',  name: '水炮',     type: 'WATER',    p: 140, pp: 5,  price: 25000, desc: '水系终极大招，极限高压水炮', tier: 4 },
  { id: 'tm_grass',  name: '日光束',   type: 'GRASS',    p: 145, pp: 5,  price: 28000, desc: '草系终极大招，凝聚太阳之力', tier: 4 },
  { id: 'tm_elec',   name: '打雷',     type: 'ELECTRIC', p: 140, pp: 5,  price: 25000, desc: '电系终极大招，天降雷罚', tier: 4 },
  { id: 'tm_ice',    name: '暴风雪',   type: 'ICE',      p: 140, pp: 5,  price: 25000, desc: '冰系终极大招，绝对零度的暴风雪', tier: 4 },
  { id: 'tm_bolt',   name: '伏特攻击', type: 'ELECTRIC', p: 150, pp: 5,  price: 35000, desc: '电系究极物攻，极限电击带麻痹', tier: 4 },
  { id: 'tm_light',  name: '光子爆发', type: 'LIGHT',    p: 140, pp: 5,  price: 28000, desc: '光系终极大招，光子能量爆炸', tier: 4 },
];

export const MISC_ITEMS = {
  rebirth_pill: { id: 'rebirth_pill', name: '洗练药', price: 10000, icon: '💊', desc: '随机重置个体值/性格/闪光(概率同野外)' }
};

export const ACCESSORY_DB = [
  { id: 'a1', name: '勇气徽章', type: 'ATK', val: 15, icon: '🎖️', price: 3000, desc: '攻击力+15' },
  { id: 'a2', name: '力量拳套', type: 'ATK', val: 35, icon: '🥊', price: 8000, desc: '攻击力+35' },
  { id: 'a3', name: '守护围巾', type: 'DEF', val: 15, icon: '🧣', price: 3000, desc: '防御力+15' },
  { id: 'a4', name: '爱心饼干', type: 'HP', val: 100, icon: '🍪', price: 5000, desc: '最大HP+100' },
  { id: 'a5', name: '王者皇冠', type: 'ATK', val: 80, icon: '👑', price: 25000, desc: '攻击力+80' },
  { id: 'a6', name: '天使光环', type: 'DEF', val: 60, icon: '😇', price: 20000, desc: '防御力+60' },
  { id: 'a7', name: '龙之牙', type: 'ATK', val: 50, icon: '🦷', price: 12000, desc: '攻击力+50' },
  { id: 'a8', name: '金属涂层', type: 'DEF', val: 40, icon: '🛡️', price: 10000, desc: '防御力+40' },
  { id: 'a9', name: '奇迹种子', type: 'HP', val: 200, icon: '🌰', price: 15000, desc: '最大HP+200' },
  { id: 'trophy', name: '冠军奖杯', type: 'ATK', val: 200, icon: '🏆', price: 99999, desc: '至高荣誉！全属性大幅提升(隐藏效果)' },
  { id: 'blue_lily', name: '蓝色彼岸花', type: 'HP', val: 300, icon: '🌺', price: 99999, desc: '无限城深处绽放的神秘花朵，赋予持有者超凡生命力' },
  { id: 'nichirin_blade', name: '日轮刀', type: 'ATK', val: 250, icon: '⚔️', price: 99999, desc: '以特殊矿石锻造的神器之刃，斩杀一切邪恶' },
];

export const RANDOM_EQUIP_DB = [
  { id: 'rng_scroll', name: '古老卷轴', type: 'SKILL_ONLY', icon: '📜', desc: '记载着某种失传的绝技', price: 2000 },
  { id: 'rng_grimoire', name: '禁忌魔导书', type: 'SKILL_ONLY', icon: '📖', desc: '散发着不祥气息的魔法书', price: 5000 },
  { id: 'rng_sword', name: '符文剑', type: 'HYBRID', stat: 'ATK', val: 25, icon: '🗡️', desc: '刻有符文的剑 (攻+25)', price: 8000 },
  { id: 'rng_shield', name: '元素盾', type: 'HYBRID', stat: 'DEF', val: 25, icon: '🛡️', desc: '流动着元素的盾 (防+25)', price: 8000 },
  { id: 'rng_heart', name: '龙之心', type: 'HYBRID', stat: 'HP', val: 150, icon: '💓', desc: '龙族的心脏 (HP+150)', price: 10000 },
];

export const EVO_STONES = {
  fire_stone:   { id: 'fire_stone',   name: '火之石',   price: 3000, icon: '🔥', desc: '炽热的石头，能激发潜能' },
  water_stone:  { id: 'water_stone',  name: '水之石',   price: 3000, icon: '💧', desc: '澄澈的石头，能激发潜能' },
  thunder_stone:{ id: 'thunder_stone',name: '雷之石',   price: 3000, icon: '⚡', desc: '带电的石头，能激发潜能' },
  leaf_stone:   { id: 'leaf_stone',   name: '叶之石',   price: 3000, icon: '🍃', desc: '有着叶脉的石头，能激发潜能' },
  moon_stone:   { id: 'moon_stone',   name: '月之石',   price: 4000, icon: '🌙', desc: '如夜空般深邃，能让神秘精灵进化' },
  sun_stone:    { id: 'sun_stone',    name: '日之石',   price: 4000, icon: '☀️', desc: '如太阳般耀眼，能让特定精灵进化' },
  ice_stone:    { id: 'ice_stone',    name: '冰之石',   price: 3500, icon: '❄️', desc: '冻结的石头，能让冰系精灵进化' },
  dusk_stone:   { id: 'dusk_stone',   name: '暗之石',   price: 4500, icon: '🌑', desc: '黑暗中的石头，能让幽灵/恶系进化' },
  dawn_stone:   { id: 'dawn_stone',   name: '觉醒石',   price: 4500, icon: '✨', desc: '闪耀光芒的石头，能唤醒特定性别' },
  shiny_stone:  { id: 'shiny_stone',  name: '光之石',   price: 5000, icon: '🌟', desc: '光辉灿烂，能让稀有精灵进化' }
};

export const GROWTH_ITEMS = [
  { id: 'vit_hp',   name: 'HP增强剂',   emoji: '🍏', price: 10000, desc: '永久HP+10', stat: 'maxHp', val: 10 },
  { id: 'vit_patk', name: '力量精华',   emoji: '⚔️', price: 10000, desc: '永久物攻+5', stat: 'p_atk', val: 5 },
  { id: 'vit_pdef', name: '硬化涂层',   emoji: '🛡️', price: 10000, desc: '永久物防+5', stat: 'p_def', val: 5 },
  { id: 'vit_satk', name: '智慧水晶',   emoji: '🔮', price: 10000, desc: '永久特攻+5', stat: 's_atk', val: 5 },
  { id: 'vit_sdef', name: '精神披风',   emoji: '🧩', price: 10000, desc: '永久特防+5', stat: 's_def', val: 5 },
  { id: 'vit_spd',  name: '极速之羽',   emoji: '🪶', price: 10000, desc: '永久速度+5', stat: 'spd', val: 5 },
  { id: 'vit_crit', name: '幸运四叶草', emoji: '🍀', price: 30000, desc: '永久暴击+1%', stat: 'crit', val: 1 },
   { id: 'exp_candy', name: '经验糖果', emoji: '🍬', price: 3000, desc: '给宝可梦吃下后，等级提升1级', stat: 'level_up', val: 1 },
  { id: 'max_candy', name: '神奇糖果', emoji: '🌟', price: 300000, desc: '瞬间升至 Lv.100 (仅限非满级精灵)', stat: 'level_max', val: 100 },
];

// ==========================================
// 咒术回战 - 咒具与道具
// ==========================================
export const CURSED_ITEMS = {
  ce_crystal: { id: 'ce_crystal', name: '咒力结晶', price: 5000, icon: '🔮',
    desc: '使用后恢复30%咒力上限', type: 'CE_HEAL', val: 0.3 },
  cursed_speech_amp: { id: 'cursed_speech_amp', name: '咒言放大器', price: 15000, icon: '📢',
    desc: '持有者术式威力+20%', type: 'CE_BOOST', val: 0.2 },
  inverted_spear: { id: 'inverted_spear', name: '天逆鉾', price: 50000, icon: '🔱',
    desc: '特级咒具，否定一切术式 (破除对方领域)', type: 'ANTI_DOMAIN', val: 1 },
  prison_realm: { id: 'prison_realm', name: '獄門疆', price: 100000, icon: '📦',
    desc: '特级咒具，一定概率封印对手 (Boss无效)', type: 'SEAL', val: 0.3 },
  sukuna_finger: { id: 'sukuna_finger', name: '宿傩之指', price: 0, icon: '🫵',
    desc: '诅咒之王的手指，使用后永久提升咒力上限+10', type: 'CE_MAX_UP', val: 10 },
  cursed_energy_pill: { id: 'cursed_energy_pill', name: '咒力丹', price: 3000, icon: '💊',
    desc: '恢复50点咒力', type: 'CE_RESTORE', val: 50 },
  binding_scroll: { id: 'binding_scroll', name: '缚誓卷轴', price: 8000, icon: '📜',
    desc: '允许在战斗外设立缚誓，持续整场战斗', type: 'VOW_SCROLL', val: 1 },
};
