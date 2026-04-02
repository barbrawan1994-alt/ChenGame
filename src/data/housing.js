// ==========================================
// 精灵家园系统 - 数据定义
// ==========================================

export const HOUSE_TYPES = [
  { id: 'tent',    name: '帐篷',     price: 1000,   slots: 1, furnitureSlots: 3,  icon: '⛺' },
  { id: 'cabin',   name: '小木屋',   price: 5000,   slots: 2, furnitureSlots: 6,  icon: '🏠' },
  { id: 'house',   name: '花园别墅', price: 20000,  slots: 4, furnitureSlots: 12, icon: '🏡' },
  { id: 'mansion', name: '豪华庄园', price: 100000, slots: 6, furnitureSlots: 20, icon: '🏰' },
  { id: 'castle',  name: '精灵城堡', price: 500000, slots: 10, furnitureSlots: 30, icon: '🏯' },
];

export const FURNITURE_QUALITY = {
  COMMON:    { name: '普通', color: '#AAAAAA', statMult: 1.0, weight: 50 },
  UNCOMMON:  { name: '优秀', color: '#55AA55', statMult: 1.2, weight: 30 },
  RARE:      { name: '精良', color: '#5555FF', statMult: 1.5, weight: 14 },
  EPIC:      { name: '史诗', color: '#AA55AA', statMult: 2.0, weight: 5 },
  LEGENDARY: { name: '传说', color: '#FFAA00', statMult: 3.0, weight: 1 },
};

export const rollQuality = (source = 'pickup', isBoss = false) => {
  const keys = Object.keys(FURNITURE_QUALITY);
  const quals = keys.map(k => FURNITURE_QUALITY[k]);

  let weights;
  if (source === 'shop') {
    weights = [70, 30, 0, 0, 0];
  } else if (source === 'pickup') {
    weights = [55, 30, 12, 3, 0];
  } else {
    weights = isBoss ? [5, 15, 40, 30, 10] : [30, 30, 25, 12, 3];
  }

  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < keys.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return keys[i];
  }
  return 'COMMON';
};

export const FURNITURE_DB = [
  // --- 休息类（影响HP恢复）---
  { id: 'bed_straw', name: '草垫子', category: 'REST', baseEffect: { hpRegen: 1 },
    icon: '🛏️', shopPrice: 200, dropSource: 'pickup' },
  { id: 'bed_wood', name: '木板床', category: 'REST', baseEffect: { hpRegen: 3 },
    icon: '🪵', shopPrice: 800, dropSource: 'shop' },
  { id: 'bed_spring', name: '弹簧床', category: 'REST', baseEffect: { hpRegen: 5 },
    icon: '🛌', shopPrice: 2000, dropSource: 'shop' },
  { id: 'bed_luxury', name: '天鹅绒大床', category: 'REST', baseEffect: { hpRegen: 8 },
    icon: '👑', shopPrice: null, dropSource: 'battle' },
  { id: 'bed_dream', name: '梦幻水晶床', category: 'REST', baseEffect: { hpRegen: 12 },
    icon: '💎', shopPrice: null, dropSource: 'battle' },
  { id: 'hammock', name: '吊床', category: 'REST', baseEffect: { hpRegen: 2 },
    icon: '🏖️', shopPrice: 500, dropSource: 'pickup' },

  // --- 训练类（影响经验/属性）---
  { id: 'dummy', name: '训练木桩', category: 'TRAIN', baseEffect: { expBonus: 0.05 },
    icon: '🎯', shopPrice: 500, dropSource: 'shop' },
  { id: 'punching_bag', name: '沙袋', category: 'TRAIN', baseEffect: { expBonus: 0.08 },
    icon: '🥊', shopPrice: 1200, dropSource: 'shop' },
  { id: 'gym_set', name: '精灵健身房', category: 'TRAIN', baseEffect: { expBonus: 0.15 },
    icon: '💪', shopPrice: null, dropSource: 'battle' },
  { id: 'dojo', name: '迷你道场', category: 'TRAIN', baseEffect: { expBonus: 0.20 },
    icon: '🥋', shopPrice: null, dropSource: 'battle' },
  { id: 'library', name: '书架', category: 'TRAIN', baseEffect: { expBonus: 0.10 },
    icon: '📚', shopPrice: 1500, dropSource: 'shop' },
  { id: 'meditation_mat', name: '冥想垫', category: 'TRAIN', baseEffect: { expBonus: 0.06 },
    icon: '🧘', shopPrice: 600, dropSource: 'pickup' },

  // --- 娱乐类（影响亲密度）---
  { id: 'ball', name: '弹力球', category: 'PLAY', baseEffect: { intimacyBonus: 1 },
    icon: '⚽', shopPrice: 100, dropSource: 'pickup' },
  { id: 'yarn', name: '毛线球', category: 'PLAY', baseEffect: { intimacyBonus: 1 },
    icon: '🧶', shopPrice: 150, dropSource: 'pickup' },
  { id: 'slide', name: '小滑梯', category: 'PLAY', baseEffect: { intimacyBonus: 3 },
    icon: '🛝', shopPrice: 800, dropSource: 'shop' },
  { id: 'pool', name: '迷你泳池', category: 'PLAY', baseEffect: { intimacyBonus: 5 },
    icon: '🏊', shopPrice: 3000, dropSource: 'shop' },
  { id: 'treehouse', name: '树屋', category: 'PLAY', baseEffect: { intimacyBonus: 8 },
    icon: '🌳', shopPrice: null, dropSource: 'battle' },
  { id: 'ferris_wheel', name: '迷你摩天轮', category: 'PLAY', baseEffect: { intimacyBonus: 12 },
    icon: '🎡', shopPrice: null, dropSource: 'battle' },
  { id: 'music_box', name: '八音盒', category: 'PLAY', baseEffect: { intimacyBonus: 2 },
    icon: '🎵', shopPrice: 400, dropSource: 'pickup' },
  { id: 'tv', name: '迷你电视', category: 'PLAY', baseEffect: { intimacyBonus: 4 },
    icon: '📺', shopPrice: 1500, dropSource: 'shop' },

  // --- 装饰类（影响房屋评分）---
  { id: 'poster', name: '冠军海报', category: 'DECO', baseEffect: { scoreBonus: 10 },
    icon: '🖼️', shopPrice: 300, dropSource: 'shop' },
  { id: 'trophy', name: '锦标赛奖杯', category: 'DECO', baseEffect: { scoreBonus: 25 },
    icon: '🏆', shopPrice: null, dropSource: 'battle' },
  { id: 'gold_frame', name: '金色相框', category: 'DECO', baseEffect: { scoreBonus: 15 },
    icon: '🪞', shopPrice: 2000, dropSource: 'shop' },
  { id: 'plant', name: '盆栽', category: 'DECO', baseEffect: { scoreBonus: 8 },
    icon: '🪴', shopPrice: 200, dropSource: 'pickup' },
  { id: 'fountain', name: '迷你喷泉', category: 'DECO', baseEffect: { scoreBonus: 20 },
    icon: '⛲', shopPrice: 5000, dropSource: 'shop' },
  { id: 'birdhouse', name: '鸟巢小屋', category: 'DECO', baseEffect: { scoreBonus: 12 },
    icon: '🐦', shopPrice: 800, dropSource: 'pickup' },
  { id: 'lantern', name: '纸灯笼', category: 'DECO', baseEffect: { scoreBonus: 6 },
    icon: '🏮', shopPrice: 150, dropSource: 'pickup' },
  { id: 'rug', name: '手工地毯', category: 'DECO', baseEffect: { scoreBonus: 10 },
    icon: '🟫', shopPrice: 600, dropSource: 'shop' },
  { id: 'chandelier', name: '水晶吊灯', category: 'DECO', baseEffect: { scoreBonus: 30 },
    icon: '💡', shopPrice: null, dropSource: 'battle' },
  { id: 'statue', name: '精灵雕像', category: 'DECO', baseEffect: { scoreBonus: 35 },
    icon: '🗿', shopPrice: null, dropSource: 'battle' },
  { id: 'flower_garden', name: '花圃', category: 'DECO', baseEffect: { scoreBonus: 15 },
    icon: '🌸', shopPrice: 1000, dropSource: 'shop' },
  { id: 'wind_chime', name: '风铃', category: 'DECO', baseEffect: { scoreBonus: 5 },
    icon: '🎐', shopPrice: 100, dropSource: 'pickup' },

  // --- 特殊/咒术类 ---
  { id: 'cursed_altar', name: '咒坛', category: 'SPECIAL', baseEffect: { ceRegen: 5, scoreBonus: 40 },
    icon: '⛩️', shopPrice: null, dropSource: 'battle' },
  { id: 'sukuna_finger', name: '宿傩之指', category: 'SPECIAL', baseEffect: { ceRegen: 10, scoreBonus: 80 },
    icon: '🫵', shopPrice: null, dropSource: 'battle' },
  { id: 'cursed_book', name: '咒术典籍', category: 'SPECIAL', baseEffect: { ceRegen: 3, expBonus: 0.05 },
    icon: '📕', shopPrice: null, dropSource: 'battle' },

  // --- 食物/补给类 ---
  { id: 'food_bowl', name: '精灵食盆', category: 'REST', baseEffect: { hpRegen: 2 },
    icon: '🥣', shopPrice: 300, dropSource: 'shop' },
  { id: 'berry_bush', name: '树果丛', category: 'REST', baseEffect: { hpRegen: 4 },
    icon: '🫐', shopPrice: 1200, dropSource: 'shop' },
  { id: 'feast_table', name: '盛宴餐桌', category: 'REST', baseEffect: { hpRegen: 10 },
    icon: '🍽️', shopPrice: null, dropSource: 'battle' },

  // --- 额外装饰/稀有 ---
  { id: 'flag', name: '战旗', category: 'DECO', baseEffect: { scoreBonus: 18 },
    icon: '🚩', shopPrice: null, dropSource: 'battle' },
  { id: 'snow_globe', name: '水晶球', category: 'DECO', baseEffect: { scoreBonus: 22 },
    icon: '🔮', shopPrice: null, dropSource: 'battle' },
  { id: 'campfire', name: '篝火', category: 'DECO', baseEffect: { scoreBonus: 8, hpRegen: 1 },
    icon: '🔥', shopPrice: 400, dropSource: 'pickup' },
  { id: 'sandbox', name: '沙坑', category: 'PLAY', baseEffect: { intimacyBonus: 2 },
    icon: '🏝️', shopPrice: 350, dropSource: 'pickup' },
  { id: 'swing', name: '秋千', category: 'PLAY', baseEffect: { intimacyBonus: 4 },
    icon: '🪂', shopPrice: 1000, dropSource: 'shop' },
  { id: 'aquarium', name: '水族箱', category: 'DECO', baseEffect: { scoreBonus: 20, intimacyBonus: 2 },
    icon: '🐠', shopPrice: 3000, dropSource: 'shop' },
  { id: 'telescope', name: '望远镜', category: 'DECO', baseEffect: { scoreBonus: 15, expBonus: 0.03 },
    icon: '🔭', shopPrice: 2500, dropSource: 'shop' },
  { id: 'piano', name: '迷你钢琴', category: 'PLAY', baseEffect: { intimacyBonus: 6, scoreBonus: 15 },
    icon: '🎹', shopPrice: null, dropSource: 'battle' },
  { id: 'hot_spring', name: '露天温泉', category: 'REST', baseEffect: { hpRegen: 15, intimacyBonus: 5 },
    icon: '♨️', shopPrice: null, dropSource: 'battle' },
];

// 套装系统
export const FURNITURE_SETS = [
  { id: 'champion_set', name: '冠军套装', items: ['trophy', 'poster', 'gold_frame'],
    bonus: { allStats: 5 }, desc: '集齐冠军系列，全队属性+5' },
  { id: 'nature_set', name: '自然之家', items: ['plant', 'fountain', 'birdhouse'],
    bonus: { intimacyMult: 1.2 }, desc: '集齐自然系列，亲密度提升20%' },
  { id: 'cursed_set', name: '咒术收藏', items: ['cursed_altar', 'sukuna_finger', 'cursed_book'],
    bonus: { ceMaxBonus: 20 }, desc: '集齐咒术系列，咒力上限+20' },
  { id: 'cozy_set', name: '温馨套装', items: ['bed_wood', 'rug', 'lantern'],
    bonus: { hpRegenMult: 1.3 }, desc: '集齐温馨系列，HP恢复效果+30%' },
  { id: 'training_set', name: '修行套装', items: ['dummy', 'punching_bag', 'dojo'],
    bonus: { expMult: 1.5 }, desc: '集齐修行系列，经验获取+50%' },
  { id: 'fun_set', name: '游乐套装', items: ['slide', 'pool', 'ferris_wheel'],
    bonus: { intimacyMult: 1.5 }, desc: '集齐游乐系列，亲密度提升50%' },
  { id: 'luxury_set', name: '奢华套装', items: ['chandelier', 'bed_dream', 'hot_spring'],
    bonus: { allStats: 10, hpRegenMult: 1.5 }, desc: '集齐奢华系列，全属性+10，恢复+50%' },
];

export const HOUSING_SCORE_TIERS = [
  { minScore: 0,   title: '流浪者',   buff: null },
  { minScore: 50,  title: '安居者',   buff: { intimacyMult: 1.05 } },
  { minScore: 150, title: '温馨小窝', buff: { intimacyMult: 1.10, hpRegenBonus: 2 } },
  { minScore: 300, title: '精灵乐园', buff: { intimacyMult: 1.15, expBonus: 0.05 } },
  { minScore: 500, title: '豪华庄园', buff: { intimacyMult: 1.20, expBonus: 0.10, allStats: 3 } },
  { minScore: 1000, title: '传说家园', buff: { intimacyMult: 1.30, expBonus: 0.15, allStats: 5 } },
];

export const getHousingScoreTier = (score) => {
  let current = HOUSING_SCORE_TIERS[0];
  for (const tier of HOUSING_SCORE_TIERS) {
    if (score >= tier.minScore) current = tier;
    else break;
  }
  return current;
};

export const calcHouseScore = (placedFurniture) => {
  let score = 0;
  for (const f of placedFurniture) {
    const def = FURNITURE_DB.find(d => d.id === f.baseId);
    if (!def) continue;
    const qual = FURNITURE_QUALITY[f.quality] || FURNITURE_QUALITY.COMMON;
    score += Math.floor((def.baseEffect.scoreBonus || 5) * qual.statMult);
  }
  return score;
};

export const calcResidentBenefits = (placedFurniture) => {
  let hpRegen = 0, expBonus = 0, intimacyBonus = 0, ceRegen = 0;
  for (const f of placedFurniture) {
    const def = FURNITURE_DB.find(d => d.id === f.baseId);
    if (!def) continue;
    const qual = FURNITURE_QUALITY[f.quality] || FURNITURE_QUALITY.COMMON;
    const mult = qual.statMult;
    const eff = def.baseEffect;
    hpRegen += Math.floor((eff.hpRegen || 0) * mult);
    expBonus += (eff.expBonus || 0) * mult;
    intimacyBonus += Math.floor((eff.intimacyBonus || 0) * mult);
    ceRegen += Math.floor((eff.ceRegen || 0) * mult);
  }
  return { hpRegen, expBonus, intimacyBonus, ceRegen };
};

export const DEFAULT_HOUSING_STATE = {
  currentHouse: null,
  furniture: [],
  residents: [],
  score: 0,
  lastTickTime: Date.now(),
};

export const FURNITURE_TILE = 30;
