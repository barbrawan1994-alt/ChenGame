// 捕获球商店价：精灵球200 · 超级球600 · 高级球1200 · 先机球1500 · 治愈球250
export const BALLS = {
  poke:   { id: 'poke',   name: '精灵球', rate: 1.0, price: 200, icon: '🔴', desc: '基础捕获球' },
  great:  { id: 'great',  name: '超级球', rate: 1.5, price: 600, icon: '🔵', desc: '中等概率捕获' },
  ultra:  { id: 'ultra',  name: '高级球', rate: 2.0, price: 1200, icon: '⚫', desc: '高概率捕获' },
  master: { id: 'master', name: '大师球', rate: 255, price: -1,  icon: '🟣', desc: '必定捕获成功！(不可购买)', shopHide: true },
  // 对应深蓝海域(Map4) 和 虫系精灵
  net:    { id: 'net',    name: '网纹球', rate: 3.5, price: 1000, icon: '🕸️', desc: '捕捉水系/虫系效果拔群' },
  // 对应遗迹工厂(Map3)、幽灵古堡(Map7)、银河空间站(Map12)
  dusk:   { id: 'dusk',   name: '黑暗球', rate: 3.5, price: 1000, icon: '🌑', desc: '在工厂/古堡/宇宙或抓幽灵系时效果拔群' },
  // 适合开局直接扔
  quick:  { id: 'quick',  name: '先机球', rate: 5.0, price: 1500, icon: '⚡', desc: '战斗前3回合使用效果极佳' },
  // 适合打神兽/Boss战
  timer:  { id: 'timer',  name: '计时球', rate: 1.0, price: 1000, icon: '⏳', desc: '回合越多捕获率越高；倍率1+回合×0.3，上限4.0倍（与战斗结算一致）' },
  // 适合捕捉后直接用
  heal:   { id: 'heal',   name: '治愈球', rate: 1.2, price: 250,  icon: '💖', desc: '捕获率×1.2，捕获后恢复满体力' }
};

export const MEDICINES = {
  // === 初级药品 (mapTier: 1, 前3张地图可买) ===
  potion:       { id: 'potion',       name: '伤药',      price: 50,  icon: '💊', type: 'HP', val: 35, desc: '恢复35点HP', mapTier: 1 },
  super_potion: { id: 'super_potion', name: '好伤药',    price: 150,  icon: '🧪', type: 'HP', val: 80, desc: '恢复80点HP', mapTier: 1 },
  antidote:     { id: 'antidote',     name: '解毒药',    price: 100,  icon: '🤢', type: 'STATUS', val: 'PSN', desc: '治愈中毒状态', mapTier: 1 },
  paralyze_heal:{ id: 'paralyze_heal',name: '解麻药',    price: 100,  icon: '⚡', type: 'STATUS', val: 'PAR', desc: '治愈麻痹状态', mapTier: 1 },
  burn_heal:    { id: 'burn_heal',    name: '烧伤药',    price: 100,  icon: '🔥', type: 'STATUS', val: 'BRN', desc: '治愈灼伤状态', mapTier: 1 },
  awakening:    { id: 'awakening',   name: '清醒药',    price: 150,  icon: '💤', type: 'STATUS', val: 'SLP', desc: '治愈睡眠状态', mapTier: 1 },
  ice_heal:     { id: 'ice_heal',    name: '解冻药',    price: 150,  icon: '❄️', type: 'STATUS', val: 'FRZ', desc: '治愈冰冻状态', mapTier: 1 },
  energy_powder: { id: 'energy_powder', name: '元气粉',  price: 80, icon: '🌿', type: 'HP', val: 50, desc: '恢复50HP(味道苦涩)', mapTier: 1 },

  // === 中级药品 (mapTier: 2, 4-6张地图可买) ===
  hyper_potion: { id: 'hyper_potion', name: '厉害伤药',  price: 400, icon: '💉', type: 'HP', val: 200, desc: '恢复200点HP', mapTier: 2 },
  ether:        { id: 'ether',        name: 'PP单补剂',  price: 200,  icon: '💧', type: 'PP', val: 10, desc: '恢复1个技能10点PP', mapTier: 2 },
  full_heal:    { id: 'full_heal',    name: '万能药',    price: 400,  icon: '🌟', type: 'STATUS', val: 'ALL', desc: '治愈所有异常状态', mapTier: 2 },
  revive:       { id: 'revive',       name: '活力块',    price: 800, icon: '💎', type: 'REVIVE', val: 0.5, desc: '复活并恢复一半HP', mapTier: 2 },
  moomoo_milk:  { id: 'moomoo_milk',  name: '哞哞鲜奶', price: 300, icon: '🥛', type: 'HP', val: 120, desc: '恢复120HP,美味的鲜奶', mapTier: 2 },
  lemonade:     { id: 'lemonade',     name: '柠檬苏打', price: 250, icon: '🍋', type: 'HP', val: 100, desc: '恢复100HP,清爽解渴', mapTier: 2 },
  x_attack:     { id: 'x_attack',     name: 'X攻击',    price: 500, icon: '⚔️', type: 'BUFF', val: 'ATK', desc: '战斗中攻击力提升1级', mapTier: 2 },
  x_defense:    { id: 'x_defense',    name: 'X防御',    price: 500, icon: '🛡️', type: 'BUFF', val: 'DEF', desc: '战斗中防御力提升1级', mapTier: 2 },
  x_speed:      { id: 'x_speed',      name: 'X速度',    price: 500, icon: '💨', type: 'BUFF', val: 'SPD', desc: '战斗中速度提升1级', mapTier: 2 },

  // === 高级药品 (mapTier: 3, 7-9张地图可买) ===
  max_potion:   { id: 'max_potion',   name: '全满药',    price: 800, icon: '✨', type: 'HP', val: 9999, desc: '恢复全部HP', mapTier: 3 },
  max_ether:    { id: 'max_ether',    name: 'PP全补剂',  price: 500, icon: '🌊', type: 'PP_ALL', val: 10, desc: '恢复所有技能10点PP', mapTier: 3 },
  max_revive:   { id: 'max_revive',   name: '活力星',    price: 1200, icon: '🌟', type: 'REVIVE', val: 1.0, desc: '复活濒死精灵并恢复全部HP', mapTier: 3 },
  full_restore: { id: 'full_restore', name: '全复药',    price: 1500, icon: '💫', type: 'FULL_RESTORE', val: 9999, desc: '恢复全部HP并治愈异常', mapTier: 3 },
  pp_max:       { id: 'pp_max',       name: 'PP极限',   price: 2000, icon: '🔋', type: 'PP_ALL', val: 99, desc: '恢复所有技能全部PP', mapTier: 3 },
  x_sp_atk:     { id: 'x_sp_atk',    name: 'X特攻',    price: 600, icon: '🔮', type: 'BUFF', val: 'SATK', desc: '战斗中特攻提升1级', mapTier: 3 },
  x_sp_def:     { id: 'x_sp_def',    name: 'X特防',    price: 600, icon: '🧠', type: 'BUFF', val: 'SDEF', desc: '战斗中特防提升1级', mapTier: 3 },

  // === 顶级药品 (mapTier: 4, 10+地图/冠军之路可买) ===
  sacred_ash:   { id: 'sacred_ash',   name: '圣灰',      price: 3000, icon: '🏛️', type: 'REVIVE_ALL', val: 1.0, desc: '复活全队并恢复满HP(战斗外)', mapTier: 4 },
  max_elixir:   { id: 'max_elixir',   name: '万能特效药', price: 2500, icon: '⭐', type: 'FULL_RESTORE', val: 9999, desc: '恢复HP+PP+异常全满', mapTier: 4 },
  dire_hit:     { id: 'dire_hit',     name: '要害攻击',  price: 800, icon: '🎯', type: 'BUFF', val: 'CRIT', desc: '战斗中暴击率大幅提升', mapTier: 4 },
  guard_spec:   { id: 'guard_spec',   name: '防御指令',  price: 1000, icon: '🏰', type: 'BUFF', val: 'GUARD', desc: '5回合内防止能力被降低', mapTier: 4 },
};

export const BERRIES = {
  oran:     { id: 'oran',     name: '橙橙果',   price: 80,  icon: '🍊', type: 'HP', val: 30, desc: 'HP低于50%时自动恢复30HP', mapTier: 1 },
  sitrus:   { id: 'sitrus',   name: '文柚果',   price: 200, icon: '🍋', type: 'HP_PCT', val: 0.25, desc: 'HP低于50%时恢复25%最大HP', mapTier: 2 },
  leppa:    { id: 'leppa',    name: '苹野果',   price: 150, icon: '🍎', type: 'PP', val: 10, desc: '技能PP用完时恢复10PP', mapTier: 1 },
  lum:      { id: 'lum',      name: '木子果',   price: 250, icon: '🫐', type: 'STATUS', val: 'ALL', desc: '自动治愈任何异常状态', mapTier: 2 },
  chesto:   { id: 'chesto',   name: '零余果',   price: 100, icon: '🫒', type: 'STATUS', val: 'SLP', desc: '自动治愈睡眠', mapTier: 1 },
  rawst:    { id: 'rawst',    name: '樱子果',   price: 100, icon: '🍒', type: 'STATUS', val: 'BRN', desc: '自动治愈灼伤', mapTier: 1 },
  aspear:   { id: 'aspear',   name: '柿仔果',   price: 100, icon: '🍑', type: 'STATUS', val: 'FRZ', desc: '自动治愈冰冻', mapTier: 1 },
  cheri:    { id: 'cheri',    name: '樱桃果',   price: 100, icon: '🍒', type: 'STATUS', val: 'PAR', desc: '自动治愈麻痹', mapTier: 1 },
  pecha:    { id: 'pecha',    name: '桃桃果',   price: 100, icon: '🍑', type: 'STATUS', val: 'PSN', desc: '自动治愈中毒', mapTier: 1 },
  liechi:   { id: 'liechi',   name: '枝荔果',   price: 500, icon: '🍇', type: 'STAT_BOOST', val: 'ATK', desc: 'HP低于25%时攻击力+1级', mapTier: 3 },
  ganlon:   { id: 'ganlon',   name: '龙睛果',   price: 500, icon: '🫐', type: 'STAT_BOOST', val: 'DEF', desc: 'HP低于25%时防御力+1级', mapTier: 3 },
  salac:    { id: 'salac',    name: '沙鳞果',   price: 500, icon: '🥝', type: 'STAT_BOOST', val: 'SPD', desc: 'HP低于25%时速度+1级', mapTier: 3 },
  petaya:   { id: 'petaya',   name: '番荔果',   price: 500, icon: '🥭', type: 'STAT_BOOST', val: 'SATK', desc: 'HP低于25%时特攻+1级', mapTier: 3 },
  lansat:   { id: 'lansat',   name: '蓝檬果',   price: 800, icon: '🍋', type: 'CRIT_BOOST', val: 2, desc: 'HP低于25%时暴击率大幅提升', mapTier: 4 },
  starf:    { id: 'starf',    name: '星桃果',   price: 1000, icon: '⭐', type: 'RANDOM_BOOST', val: 2, desc: 'HP低于25%时随机一项能力+2级', mapTier: 4 },
};

export const TMS = [
  // ★ 基础技能书 (Tier 1) — 威力 50-70, 适合前期 (商店可售)
  { id: 'tm_ember',  name: '火花冲击', type: 'FIRE',     p: 65,  pp: 15, price: 3000,  desc: '基础火系攻击，灼热的火焰冲击', tier: 1, shopSell: true },
  { id: 'tm_aqua',   name: '水流喷射', type: 'WATER',    p: 65,  pp: 15, price: 3000,  desc: '基础水系攻击，高压水流冲击', tier: 1, shopSell: true },
  { id: 'tm_vine',   name: '飞叶快刀', type: 'GRASS',    p: 55,  pp: 25, price: 3000,  desc: '基础草系攻击，锋利叶刃切割', tier: 1, shopSell: true },
  { id: 'tm_shock',  name: '电击波',   type: 'ELECTRIC', p: 60,  pp: 15, price: 2500,  desc: '基础电系攻击，释放电流冲击', tier: 1, shopSell: true },
  { id: 'tm_pup',    name: '增强拳',   type: 'FIGHT',    p: 40,  pp: 20, price: 2500,  desc: '攻击的同时提升自身攻击力', tier: 1, shopSell: true },
  // ★★ 进阶技能书 (Tier 2) — 威力 80-95, 适合中期 (商店可售)
  { id: 'tm_flame',  name: '喷射火焰', type: 'FIRE',     p: 90,  pp: 12, price: 8000,  desc: '进阶火系技能，稳定火焰攻击，可能灼伤', tier: 2 },
  { id: 'tm_icebeam',name: '急冻光线', type: 'ICE',      p: 90,  pp: 10, price: 8000,  desc: '进阶冰系技能，冰冻光束，概率冻结', tier: 2 },
  { id: 'tm_shadow', name: '暗影球',   type: 'GHOST',    p: 80,  pp: 15, price: 7500,  desc: '进阶幽灵系技能，凝聚暗影之力', tier: 2 },
  { id: 'tm_sludge', name: '污泥炸弹', type: 'POISON',   p: 90,  pp: 8,  price: 8500,  desc: '进阶毒系技能，高概率使目标中毒', tier: 2 },
  { id: 'tm_psy',    name: '精神强念', type: 'PSYCHIC',  p: 90,  pp: 8,  price: 8000,  desc: '进阶超能系技能，精神力集中攻击', tier: 2 },
  // ★★★ 高级/终极技能书 — 威力 100+, 不在商店出售, 只能通过掉落/奖励获得
  { id: 'tm_eq',     name: '地震',     type: 'GROUND',   p: 100, pp: 10, price: 12000, desc: '地面系高级技能，大地震动席卷全场', tier: 3 },
  { id: 'tm_dragon', name: '龙之波动', type: 'DRAGON',   p: 85, pp: 10,  price: 15000, desc: '龙系高级技能，龙族波动之力', tier: 3 },
  { id: 'tm_fight',  name: '近身战',   type: 'FIGHT',    p: 120, pp: 5,  price: 15000, desc: '格斗系高级技能，猛烈近战但降低双防', tier: 3 },
  { id: 'tm_dark',   name: '暗冥强击', type: 'DARK',     p: 110, pp: 5,  price: 12000, desc: '恶系高级技能，凝聚黑暗之力打击', tier: 3 },
  { id: 'tm_wind',   name: '龙卷天降', type: 'WIND',     p: 110, pp: 5,  price: 12000, desc: '风系高级技能，召唤龙卷风横扫', tier: 3 },
  { id: 'tm_fire',   name: '大字爆炎', type: 'FIRE',     p: 110, pp: 5,  price: 25000, desc: '火系终极大招，毁灭性的爆炎之力', tier: 4 },
  { id: 'tm_water',  name: '水炮',     type: 'WATER',    p: 110, pp: 5,  price: 25000, desc: '水系终极大招，极限高压水炮', tier: 4 },
  { id: 'tm_grass',  name: '日光束',   type: 'GRASS',    p: 120, pp: 5,  price: 28000, desc: '草系终极大招，凝聚太阳之力', tier: 4 },
  { id: 'tm_elec',   name: '打雷',     type: 'ELECTRIC', p: 110, pp: 10, price: 25000, desc: '电系终极大招，天降雷罚', tier: 4 },
  { id: 'tm_ice',    name: '暴风雪',   type: 'ICE',      p: 110, pp: 5,  price: 25000, desc: '冰系终极大招，极寒暴风雪席卷全场', tier: 4 },
  { id: 'tm_bolt',   name: '伏特攻击', type: 'ELECTRIC', p: 120, pp: 5,  price: 35000, desc: '电系究极物攻，极限电击带麻痹', tier: 4 },
  { id: 'tm_light',  name: '光子爆发', type: 'LIGHT',    p: 110, pp: 5,  price: 28000, desc: '光系终极大招，光子能量爆炸', tier: 4 },
  { id: 'tm_cosmic1', name: '星云旋涡', type: 'COSMIC',  p: 75,  pp: 15, price: 3500,  desc: '宇宙系基础技能，卷起星云攻击', tier: 1 },
  { id: 'tm_cosmic2', name: '银河射线', type: 'COSMIC',  p: 100, pp: 8,  price: 8500,  desc: '宇宙系进阶技能，贯穿银河', tier: 2 },
  { id: 'tm_cosmic3', name: '虚空坍缩', type: 'COSMIC',  p: 135, pp: 3,  price: 28000, desc: '宇宙系终极大招，空间坍缩', tier: 4 },
  { id: 'tm_sound1',  name: '共鸣爆破', type: 'SOUND',   p: 70,  pp: 15, price: 3000,  desc: '音波系基础技能，共鸣频率爆破', tier: 1, shopSell: true },
  { id: 'tm_sound2',  name: '死亡咏叹', type: 'SOUND',   p: 100, pp: 8,  price: 8000,  desc: '音波系进阶技能，死亡之歌', tier: 2 },
  { id: 'tm_sound3',  name: '寂灭之音', type: 'SOUND',   p: 130, pp: 3,  price: 25000, desc: '音波系终极大招，万物寂灭', tier: 4 },
];

export const MISC_ITEMS = {
  rebirth_pill: { id: 'rebirth_pill', name: '洗练药', price: 10000, icon: '💊', desc: '随机重置个体值/性格/闪光(5%概率)' },
  legacy_stone: { id: 'legacy_stone', name: '传承石', price: -1, icon: '💎', desc: '精灵传承必需材料，Lv.80+导师传授技能给学徒（矿洞深层/兑换获取）', shopHide: true }
};

export const ACCESSORY_DB = [
  // =========================================
  //  Tier 1 - 基础饰品 (3000-6000)
  // =========================================
  { id: 'a1',  name: '勇气徽章',   type: 'ATK',  val: 15,  icon: '🎖️', price: 5000,  tier: 1, desc: '攻击力+15' },
  { id: 'a3',  name: '守护围巾',   type: 'DEF',  val: 15,  icon: '🧣', price: 5000,  tier: 1, desc: '防御力+15' },
  { id: 'a10', name: '活力头带',   type: 'HP',   val: 60,  icon: '🎀', price: 5000,  tier: 1, desc: '最大HP+60' },
  { id: 'a11', name: '疾风羽饰',   type: 'SPD',  val: 15,  icon: '🪶', price: 6000,  tier: 1, desc: '速度+15' },
  { id: 'a22', name: '知识水晶',   type: 'SATK', val: 15,  icon: '🔮', price: 5000,  tier: 1, desc: '特攻+15' },
  { id: 'a23', name: '精神头环',   type: 'SDEF', val: 15,  icon: '🧠', price: 5000,  tier: 1, desc: '特防+15' },
  { id: 'a24', name: '幸运铃铛',   type: 'CRIT', val: 5,   icon: '🔔', price: 4000,  tier: 1, desc: '暴击率+5%' },
  { id: 'a25', name: '生命草环',   type: 'HP',   val: 30,  icon: '🌿', price: 4500,  tier: 1, desc: 'HP+30，每回合恢复3%HP', effect: { id: 'heal_turn', val: 0.03 } },
  { id: 'a26', name: '解毒护符',   type: 'HP',   val: 20,  icon: '💚', price: 3500,  tier: 1, desc: 'HP+20，免疫中毒', effect: { id: 'status_immune', val: 'PSN' } },
  { id: 'a27', name: '先攻之爪',   type: 'SPD',  val: 10,  icon: '🐾', price: 5500,  tier: 1, desc: '速度+10，8%概率先手', effect: { id: 'priority', val: 0.08 } },

  // =========================================
  //  Tier 2 - 进阶饰品 (8000-18000)
  // =========================================
  { id: 'a2',  name: '力量拳套',   type: 'ATK',  val: 35,  icon: '🥊', price: 12000, tier: 2, desc: '攻击力+35' },
  { id: 'a8',  name: '金属涂层',   type: 'DEF',  val: 40,  icon: '🛡️', price: 15000, tier: 2, desc: '防御力+40' },
  { id: 'a4',  name: '爱心饼干',   type: 'HP',   val: 100, icon: '🍪', price: 10000, tier: 2, desc: '最大HP+100' },
  { id: 'a12', name: '锐利之爪',   type: 'CRIT', val: 8,   icon: '🦅', price: 12000, tier: 2, desc: '暴击率+8%' },
  { id: 'a13', name: '智慧眼镜',   type: 'SATK', val: 35,  icon: '🥽', price: 12000, tier: 2, desc: '特攻+35' },
  { id: 'a14', name: '坚韧披风',   type: 'SDEF', val: 35,  icon: '🧥', price: 12000, tier: 2, desc: '特防+35' },
  { id: 'a28', name: '迅捷腰带',   type: 'SPD',  val: 25,  icon: '🌊', price: 10000, tier: 2, desc: '速度+25' },
  { id: 'a29', name: '吸血之牙',   type: 'ATK',  val: 10,  icon: '🦇', price: 14000, tier: 2, desc: '攻+10，攻击吸血8%', effect: { id: 'lifesteal', val: 0.08 } },
  { id: 'a30', name: '火焰宝石',   type: 'ATK',  val: 10,  icon: '🔥', price: 13000, tier: 2, desc: '攻+10，火系伤害+15%', effect: { id: 'type_boost', moveType: 'FIRE', val: 0.15 } },
  { id: 'a31', name: '冰霜宝石',   type: 'ATK',  val: 10,  icon: '❄️', price: 13000, tier: 2, desc: '攻+10，冰系伤害+15%', effect: { id: 'type_boost', moveType: 'ICE', val: 0.15 } },
  { id: 'a32', name: '雷鸣宝石',   type: 'ATK',  val: 10,  icon: '⚡', price: 13000, tier: 2, desc: '攻+10，电系伤害+15%', effect: { id: 'type_boost', moveType: 'ELECTRIC', val: 0.15 } },
  { id: 'a33', name: '净化吊坠',   type: 'HP',   val: 50,  icon: '🌸', price: 16000, tier: 2, desc: 'HP+50，免疫所有异常状态', effect: { id: 'status_immune', val: 'ALL' } },
  { id: 'a34', name: '破甲之锥',   type: 'ATK',  val: 15,  icon: '🔩', price: 15000, tier: 2, desc: '攻+15，无视8%防御', effect: { id: 'ignore_def', val: 0.08 } },
  { id: 'a35', name: '荆棘铠甲',   type: 'DEF',  val: 20,  icon: '🌵', price: 14000, tier: 2, desc: '防+20，反弹8%受到伤害', effect: { id: 'reflect', val: 0.08 } },

  // =========================================
  //  Tier 3 - 高级饰品 (20000-35000)
  // =========================================
  { id: 'a7',  name: '龙之牙',     type: 'ATK',  val: 50,  icon: '🦷', price: 20000, tier: 3, desc: '攻击力+50' },
  { id: 'a6',  name: '天使光环',   type: 'DEF',  val: 60,  icon: '😇', price: 25000, tier: 3, desc: '防御力+60' },
  { id: 'a9',  name: '奇迹种子',   type: 'HP',   val: 200, icon: '🌰', price: 22000, tier: 3, desc: '最大HP+200' },
  { id: 'a15', name: '雷神护腕',   type: 'SPD',  val: 40,  icon: '⚡', price: 20000, tier: 3, desc: '速度+40' },
  { id: 'a16', name: '暗杀之刃',   type: 'CRIT', val: 15,  icon: '🗡️', price: 22000, tier: 3, desc: '暴击率+15%' },
  { id: 'a17', name: '贤者之书',   type: 'SATK', val: 60,  icon: '📕', price: 25000, tier: 3, desc: '特攻+60' },
  { id: 'a18', name: '不屈铠甲',   type: 'SDEF', val: 60,  icon: '🎽', price: 25000, tier: 3, desc: '特防+60' },
  { id: 'a36', name: '龙脉宝珠',   type: 'SATK', val: 20,  icon: '🐲', price: 28000, tier: 3, desc: '特攻+20，龙系伤害+20%', effect: { id: 'type_boost', moveType: 'DRAGON', val: 0.20 } },
  { id: 'a37', name: '深海之泪',   type: 'SATK', val: 20,  icon: '🧊', price: 26000, tier: 3, desc: '特攻+20，水系伤害+20%', effect: { id: 'type_boost', moveType: 'WATER', val: 0.20 } },
  { id: 'a38', name: '大地精魂',   type: 'ATK',  val: 20,  icon: '🏔️', price: 26000, tier: 3, desc: '攻+20，地面系伤害+20%', effect: { id: 'type_boost', moveType: 'GROUND', val: 0.20 } },
  { id: 'a39', name: '不死鸟羽',   type: 'HP',   val: 80,  icon: '🪶', price: 30000, tier: 3, desc: 'HP+80，致命一击时以1HP存活(每场1次)', effect: { id: 'endure', val: 1 } },
  { id: 'a40', name: '暗影面罩',   type: 'ATK',  val: 30,  icon: '🎭', price: 28000, tier: 3, desc: '攻+30，恶系伤害+15%', effect: { id: 'type_boost', moveType: 'DARK', val: 0.15 } },
  { id: 'a41', name: '月光石链',   type: 'HP',   val: 80,  icon: '🌙', price: 28000, tier: 3, desc: 'HP+80，每回合恢复5%HP', effect: { id: 'heal_turn', val: 0.05 } },
  { id: 'a42', name: '致命剃刀',   type: 'CRIT', val: 10,  icon: '💀', price: 30000, tier: 3, desc: '暴击+10%，暴击伤害+25%', effect: { id: 'crit_dmg', val: 0.25 } },
  { id: 'a43', name: '圣光宝珠',   type: 'SATK', val: 20,  icon: '✨', price: 26000, tier: 3, desc: '特攻+20，光系伤害+20%', effect: { id: 'type_boost', moveType: 'LIGHT', val: 0.20 } },
  { id: 'a53', name: '草之精华',   type: 'HP',   val: 60,  icon: '🍀', price: 24000, tier: 3, desc: 'HP+60，草系伤害+15%+回合恢复3%', effect: { id: 'type_heal', moveType: 'GRASS', typeVal: 0.15, healVal: 0.03 } },
  { id: 'a54', name: '武神护手',   type: 'ATK',  val: 25,  icon: '🥋', price: 26000, tier: 3, desc: '攻+25，格斗系伤害+20%', effect: { id: 'type_boost', moveType: 'FIGHT', val: 0.20 } },
  { id: 'a55', name: '幽灵水晶',   type: 'SATK', val: 20,  icon: '👻', price: 26000, tier: 3, desc: '特攻+20，幽灵系伤害+20%', effect: { id: 'type_boost', moveType: 'GHOST', val: 0.20 } },
  { id: 'a56', name: '钢之纹章',   type: 'DEF',  val: 30,  icon: '⚙️', price: 26000, tier: 3, desc: '防+30，钢系伤害+15%', effect: { id: 'type_boost', moveType: 'STEEL', val: 0.15 } },
  { id: 'a57', name: '风之羽冠',   type: 'SPD',  val: 25,  icon: '💨', price: 26000, tier: 3, desc: '速度+25，风系伤害+20%', effect: { id: 'type_boost', moveType: 'WIND', val: 0.20 } },
  { id: 'a58', name: '毒蛇之环',   type: 'ATK',  val: 20,  icon: '🐍', price: 24000, tier: 3, desc: '攻+20，毒系伤害+20%', effect: { id: 'type_boost', moveType: 'POISON', val: 0.20 } },

  // =========================================
  //  Tier 4 - 顶级饰品 (40000-65000)
  // =========================================
  { id: 'a5',  name: '王者皇冠',   type: 'ATK',  val: 80,  icon: '👑', price: 40000, tier: 4, desc: '攻击力+80' },
  { id: 'a19', name: '龙鳞战甲',   type: 'DEF',  val: 80,  icon: '🐉', price: 40000, tier: 4, desc: '防御力+80' },
  { id: 'a20', name: '生命之冠',   type: 'HP',   val: 350, icon: '💎', price: 45000, tier: 4, desc: '最大HP+350' },
  { id: 'a21', name: '幻影斗篷',   type: 'SPD',  val: 60,  icon: '🌀', price: 40000, tier: 4, desc: '速度+60' },
  { id: 'a44', name: '破灭之刃',   type: 'ATK',  val: 60,  icon: '⚔️', price: 50000, tier: 4, desc: '攻+60，无视12%防御', effect: { id: 'ignore_def', val: 0.12 } },
  { id: 'a45', name: '天穹之眼',   type: 'SATK', val: 80,  icon: '👁️', price: 48000, tier: 4, desc: '特攻+80' },
  { id: 'a46', name: '不灭盾壁',   type: 'SDEF', val: 80,  icon: '🏛️', price: 50000, tier: 4, desc: '特防+80，特殊伤害减免10%', effect: { id: 'reduce_special', val: 0.10 } },
  { id: 'a47', name: '血族之戒',   type: 'HP',   val: 120, icon: '💍', price: 55000, tier: 4, desc: 'HP+120，攻击吸血15%', effect: { id: 'lifesteal', val: 0.15 } },
  { id: 'a48', name: '极光之翼',   type: 'SPD',  val: 50,  icon: '🦋', price: 52000, tier: 4, desc: '速+50，10%闪避攻击', effect: { id: 'dodge', val: 0.10 } },
  { id: 'a49', name: '灭世之瞳',   type: 'CRIT', val: 20,  icon: '🔮', price: 60000, tier: 4, desc: '暴击+20%，暴击伤害+40%', effect: { id: 'crit_dmg', val: 0.40 } },

  // =========================================
  // Tier 2-4 - 活动/战斗掉落专属饰品 (30种)
  // =========================================
  { id: 'a59', name: '般若鬼面',   type: 'ATK',  val: 22,  icon: '👺', price: 12500, tier: 2, desc: '攻+22，恶系伤害+12%', effect: { id: 'type_boost', moveType: 'DARK', val: 0.12 } },
  { id: 'a60', name: '玄铁护心镜', type: 'DEF',  val: 32,  icon: '🪞', price: 14000, tier: 2, desc: '防+32，反弹7%受到伤害', effect: { id: 'reflect', val: 0.07 } },
  { id: 'a61', name: '蓬莱玉枝',   type: 'SATK', val: 28,  icon: '🎋', price: 13500, tier: 2, desc: '特攻+28，草系伤害+12%', effect: { id: 'type_boost', moveType: 'GRASS', val: 0.12 } },
  { id: 'a62', name: '返魂香囊',   type: 'HP',   val: 85,  icon: '📿', price: 15500, tier: 2, desc: 'HP+85，每回合恢复3%HP', effect: { id: 'heal_turn', val: 0.03 } },
  { id: 'a63', name: '神行草履',   type: 'SPD',  val: 22,  icon: '🥿', price: 11800, tier: 2, desc: '速度+22，6%闪避', effect: { id: 'dodge', val: 0.06 } },
  { id: 'a64', name: '千本樱坠',   type: 'CRIT', val: 8,   icon: '🎴', price: 13000, tier: 2, desc: '暴击+8%，暴击伤害+18%', effect: { id: 'crit_dmg', val: 0.18 } },
  { id: 'a65', name: '镇魂铃',     type: 'SDEF', val: 30,  icon: '📯', price: 14500, tier: 2, desc: '特防+30，免疫麻痹', effect: { id: 'status_immune', val: 'PAR' } },
  { id: 'a66', name: '雷兽牙',     type: 'ATK',  val: 18,  icon: '🔋', price: 13200, tier: 2, desc: '攻+18，电系伤害+14%', effect: { id: 'type_boost', moveType: 'ELECTRIC', val: 0.14 } },
  { id: 'a67', name: '冰心玉',     type: 'DEF',  val: 28,  icon: '💠', price: 13800, tier: 2, desc: '防+28，冰系伤害+12%', effect: { id: 'type_boost', moveType: 'ICE', val: 0.12 } },
  { id: 'a68', name: '鲛人泪珠',   type: 'HP',   val: 70,  icon: '🐚', price: 14800, tier: 2, desc: 'HP+70，水系伤害+12%', effect: { id: 'type_boost', moveType: 'WATER', val: 0.12 } },
  { id: 'a69', name: '刹那足袋',   type: 'SPD',  val: 18,  icon: '🧦', price: 14200, tier: 2, desc: '速度+18，7%概率先手', effect: { id: 'priority', val: 0.07 } },
  { id: 'a70', name: '破军印',     type: 'ATK',  val: 25,  icon: '🔱', price: 15200, tier: 2, desc: '攻+25，无视6%防御', effect: { id: 'ignore_def', val: 0.06 } },
  { id: 'a71', name: '明镜止水佩', type: 'SDEF', val: 32,  icon: '🫧', price: 16800, tier: 3, desc: '特防+32，特殊伤害减免7%', effect: { id: 'reduce_special', val: 0.07 } },
  { id: 'a72', name: '朱雀翎',     type: 'SATK', val: 38,  icon: '🍁', price: 24500, tier: 3, desc: '特攻+38，火系伤害+16%', effect: { id: 'type_boost', moveType: 'FIRE', val: 0.16 } },
  { id: 'a73', name: '玄武甲片',   type: 'DEF',  val: 42,  icon: '🐢', price: 27000, tier: 3, desc: '防+42，反弹9%受到伤害', effect: { id: 'reflect', val: 0.09 } },
  { id: 'a74', name: '青龙逆鳞',   type: 'ATK',  val: 35,  icon: '🎍', price: 28500, tier: 3, desc: '攻+35，龙系伤害+16%', effect: { id: 'type_boost', moveType: 'DRAGON', val: 0.16 } },
  { id: 'a75', name: '白虎獠牙',   type: 'CRIT', val: 12,  icon: '🐯', price: 25500, tier: 3, desc: '暴击+12%，暴击伤害+22%', effect: { id: 'crit_dmg', val: 0.22 } },
  { id: 'a76', name: '续命青灯',   type: 'HP',   val: 100, icon: '🏮', price: 31000, tier: 3, desc: 'HP+100，致命时以1HP存活(每场1次)', effect: { id: 'endure', val: 1 } },
  { id: 'a77', name: '风神羽衣',   type: 'SPD',  val: 32,  icon: '🎐', price: 26500, tier: 3, desc: '速度+32，风系伤害+15%', effect: { id: 'type_boost', moveType: 'WIND', val: 0.15 } },
  { id: 'a78', name: '罗刹骨链',   type: 'ATK',  val: 28,  icon: '🦴', price: 27500, tier: 3, desc: '攻+28，攻击吸血10%', effect: { id: 'lifesteal', val: 0.10 } },
  { id: 'a79', name: '大岳丸盔',   type: 'DEF',  val: 38,  icon: '⛓️', price: 25000, tier: 3, desc: '防+38，钢系伤害+14%', effect: { id: 'type_boost', moveType: 'STEEL', val: 0.14 } },
  { id: 'a80', name: '玉藻前簪',   type: 'SATK', val: 35,  icon: '🦊', price: 26800, tier: 3, desc: '特攻+35，超能系伤害+15%', effect: { id: 'type_boost', moveType: 'PSYCHIC', val: 0.15 } },
  { id: 'a81', name: '黄泉彼岸花', type: 'HP',   val: 95,  icon: '🥀', price: 29000, tier: 3, desc: 'HP+95，毒系伤害+15%', effect: { id: 'type_boost', moveType: 'POISON', val: 0.15 } },
  { id: 'a82', name: '天照御魂',   type: 'SATK', val: 30,  icon: '☀️', price: 29500, tier: 3, desc: '特攻+30，光系伤害+15%', effect: { id: 'type_boost', moveType: 'LIGHT', val: 0.15 } },
  { id: 'a83', name: '不动明王镯', type: 'SDEF', val: 45,  icon: '🧿', price: 28000, tier: 3, desc: '特防+45，免疫灼伤', effect: { id: 'status_immune', val: 'BRN' } },
  { id: 'a84', name: '毗沙门天铠', type: 'DEF',  val: 55,  icon: '🏯', price: 48000, tier: 4, desc: '防+55，地面系伤害+14%', effect: { id: 'type_boost', moveType: 'GROUND', val: 0.14 } },
  { id: 'a85', name: '八岐大蛇瞳', type: 'CRIT', val: 16,  icon: '👁', price: 52000, tier: 4, desc: '暴击+16%，暴击伤害+32%', effect: { id: 'crit_dmg', val: 0.32 } },
  { id: 'a86', name: '须佐之臂',   type: 'ATK',  val: 48,  icon: '🌩️', price: 50000, tier: 4, desc: '攻+48，无视10%防御', effect: { id: 'ignore_def', val: 0.10 } },
  { id: 'a87', name: '高天原羽衣', type: 'SPD',  val: 42,  icon: '🪽', price: 51000, tier: 4, desc: '速度+42，额外速度+18', effect: { id: 'bonus_spd', val: 18 } },
  { id: 'a88', name: '黄泉津印',   type: 'HP',   val: 140, icon: '🪦', price: 54000, tier: 4, desc: 'HP+140，幽灵系伤害+14%', effect: { id: 'type_boost', moveType: 'GHOST', val: 0.14 } },

  // =========================================
  //  传说饰品 - 非卖品(只能通过特殊途径获得)
  // =========================================
  { id: 'trophy',         name: '冠军奖杯',   type: 'ATK',  val: 80, icon: '🏆', price: 99999, tier: 5, desc: '至高荣誉，攻击+80' },
  { id: 'blue_lily',      name: '蓝色彼岸花', type: 'HP',   val: 300, icon: '🌺', price: 99999, tier: 5, desc: '无限城深处绽放的神秘花朵，HP+300' },
  { id: 'nichirin_blade',name: '日轮刀',     type: 'ATK',  val: 100, icon: '⚔️', price: 99999, tier: 5, desc: '特殊矿石锻造的神刃，攻+100' },
  { id: 'a50', name: '创世徽记',   type: 'ATK',  val: 50,  icon: '🌟', price: 99999, tier: 5, desc: '攻+50，每回合恢复3%HP', effect: { id: 'heal_turn', val: 0.03 } },
  { id: 'a51', name: '虚空之心',   type: 'ATK',  val: 100, icon: '🖤', price: 99999, tier: 5, desc: '攻+100，无视15%防御+吸血10%', effect: { id: 'void_heart', ignDef: 0.15, lifesteal: 0.10 } },
  { id: 'a52', name: '仙灵御剑',   type: 'ATK',  val: 80,  icon: '🗡️', price: 99999, tier: 5, desc: '攻+80，速+40(来自蜀山)', effect: { id: 'bonus_spd', val: 40 } },
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
  { id: 'vit_hp',   name: 'HP增强剂',   emoji: '🍏', price: 10000, desc: '永久HP+8', stat: 'hp', val: 8 },
  { id: 'vit_patk', name: '力量精华',   emoji: '⚔️', price: 10000, desc: '永久物攻+5', stat: 'p_atk', val: 5 },
  { id: 'vit_pdef', name: '硬化涂层',   emoji: '🛡️', price: 10000, desc: '永久物防+5', stat: 'p_def', val: 5 },
  { id: 'vit_satk', name: '智慧水晶',   emoji: '🔮', price: 10000, desc: '永久特攻+5', stat: 's_atk', val: 5 },
  { id: 'vit_sdef', name: '精神披风',   emoji: '🧩', price: 10000, desc: '永久特防+5', stat: 's_def', val: 5 },
  { id: 'vit_spd',  name: '极速之羽',   emoji: '🪶', price: 10000, desc: '永久速度+5', stat: 'spd', val: 5 },
  { id: 'vit_crit', name: '幸运四叶草', emoji: '🍀', price: 15000, desc: '永久暴击+2%', stat: 'crit', val: 2 },
   { id: 'exp_candy', name: '经验糖果', emoji: '🍬', price: 5000, desc: '给精灵吃下后，等级提升1级', stat: 'level_up', val: 1 },
  { id: 'spd_candy', name: '速度糖果', emoji: '⚡', price: 5000, desc: '给精灵吃下后，永久速度+3', stat: 'spd', val: 3 },
  { id: 'max_candy', name: '神奇糖果', emoji: '🌟', price: 500000, desc: '瞬间升至 Lv.100 (仅限非满级精灵，需8徽章)', stat: 'level_max', val: 100 },
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
  sukuna_finger: { id: 'sukuna_finger', name: '宿傩之指', price: 0, shopHide: true, icon: '🫵',
    desc: '诅咒之王的手指，使用后永久提升咒力上限+10', type: 'CE_MAX_UP', val: 10 },
  cursed_energy_pill: { id: 'cursed_energy_pill', name: '咒力丹', price: 3000, icon: '💊',
    desc: '恢复50点咒力', type: 'CE_RESTORE', val: 50 },
  binding_scroll: { id: 'binding_scroll', name: '缚誓卷轴', price: 8000, icon: '📜',
    desc: '允许在战斗外设立缚誓，持续整场战斗', type: 'VOW_SCROLL', val: 1 },
};
