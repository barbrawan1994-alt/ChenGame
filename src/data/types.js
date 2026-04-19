export const TYPES = {
  NORMAL: { name: '一般', color: '#A8A878', bg: '#F5F5F5' },
  FIRE: { name: '火', color: '#F08030', bg: '#FFEBEE' },
  WATER: { name: '水', color: '#6890F0', bg: '#E3F2FD' },
  GRASS: { name: '草', color: '#78C850', bg: '#E8F5E9' },
  ELECTRIC: { name: '电', color: '#F8D030', bg: '#FFFDE7' },
  ICE: { name: '冰', color: '#98D8D8', bg: '#E0F7FA' },
  FIGHT: { name: '格斗', color: '#C03028', bg: '#FFEBEE' },
  POISON: { name: '毒', color: '#A040A0', bg: '#F3E5F5' },
  GROUND: { name: '地面', color: '#E0C068', bg: '#FFF8E1' },
  FLYING: { name: '飞行', color: '#A890F0', bg: '#EDE7F6' },
  PSYCHIC: { name: '超能', color: '#F85888', bg: '#FCE4EC' },
  BUG: { name: '虫', color: '#A8B820', bg: '#F9FBE7' },
  ROCK: { name: '岩石', color: '#B8A038', bg: '#FFFDE7' },
  GHOST: { name: '幽灵', color: '#705898', bg: '#F3E5F5' },
  DRAGON: { name: '龙', color: '#7038F8', bg: '#E1BEE7' },
  STEEL: { name: '钢', color: '#B8B8D0', bg: '#ECEFF1' },
  FAIRY: { name: '妖精', color: '#EE99AC', bg: '#FCE4EC' },
  DARK: { name: '恶', color: '#705848', bg: '#EFEBE9' },
  WIND: { name: '风', color: '#81D4FA', bg: '#E1F5FE' },
  LIGHT: { name: '光', color: '#FFD54F', bg: '#FFFDE7' },
  HEAL: { name: '治愈', color: '#81C784', bg: '#E8F5E9' },
  COSMIC: { name: '宇宙', color: '#1A237E', bg: '#E8EAF6' },
  SOUND: { name: '音波', color: '#AD1457', bg: '#FCE4EC' },
  GOD: { name: '神', color: '#333333', bg: '#D7CCC8' }
};
// ==========================================
// [新增] 属性魅力基准值 (决定初始魅力下限)
// ==========================================
export const TYPE_CHARM_BASE = {
  FAIRY: 60,   // 妖精系：天生可爱/美丽
  HEAL: 60,    // 治愈系：亲和力高
  GOD: 70,     // 神：威严
  DRAGON: 50,  // 龙：霸气
  PSYCHIC: 50, // 超能：神秘
  ICE: 50,     // 冰：高冷
  WATER: 40,   // 水：柔和
  GRASS: 40,   // 草：自然
  ELECTRIC: 40,// 电：活力
  FIRE: 40,    // 火：热情
  FLYING: 35,  // 飞行：潇洒
  NORMAL: 30,  // 一般：普通
  STEEL: 30,   // 钢：冷硬
  FIGHT: 25,   // 格斗：粗犷
  GROUND: 20,  // 地面：朴实
  ROCK: 15,    // 岩石：坚硬
  BUG: 15,     // 虫：部分人害怕
  GHOST: 15,   // 幽灵：诡异
  POISON: 10,  // 毒：危险
  DARK: 20,    // 恶：阴暗
  WIND: 45,    // 风：飘逸
  LIGHT: 55,   // 光：圣洁
  COSMIC: 60,  // 宇宙：神秘深邃
  SOUND: 35    // 音波：韵律
};

export const TYPE_BIAS = {
  NORMAL:  { p: 1.0, s: 1.0 }, // 平衡
  FIRE:    { p: 1.0, s: 1.2 }, // 偏特攻
  WATER:   { p: 0.9, s: 1.1 }, // 偏特攻
  GRASS:   { p: 1.0, s: 1.1 }, // 偏特攻
  ELECTRIC:{ p: 0.8, s: 1.3 }, // 强特攻
  ICE:     { p: 0.9, s: 1.2 }, // 偏特攻
  FIGHT:   { p: 1.3, s: 0.6 }, // 强物攻
  POISON:  { p: 1.0, s: 1.0 }, // 平衡
  GROUND:  { p: 1.2, s: 0.8 }, // 偏物攻
  FLYING:  { p: 1.1, s: 1.0 }, // 偏物攻
  PSYCHIC: { p: 0.7, s: 1.3 }, // 强特攻
  BUG:     { p: 1.1, s: 0.9 }, // 偏物攻
  ROCK:    { p: 1.3, s: 0.7 }, // 偏物攻
  GHOST:   { p: 0.8, s: 1.3 }, // 强特攻
  DRAGON:  { p: 1.2, s: 1.1 }, // 偏物攻，种族强大
  STEEL:   { p: 1.2, s: 0.7 }, // 偏物攻
  FAIRY:   { p: 0.7, s: 1.3 }, // 偏特攻
  DARK:    { p: 1.1, s: 1.0 },  // 偏物攻
  WIND:    { p: 0.9, s: 1.2 },  // 偏特攻/速度
  LIGHT:   { p: 0.8, s: 1.3 },  // 偏特攻
  HEAL:    { p: 0.7, s: 1.1 },  // 偏特攻，辅助型
  COSMIC:  { p: 0.9, s: 1.3 },  // 偏特攻
  SOUND:   { p: 1.0, s: 1.1 },  // 略偏特攻
  GOD:     { p: 1.2, s: 1.2 }   // 神 (均衡强化但不碾压)
};
