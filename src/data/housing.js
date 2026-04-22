// ==========================================
// 精灵家园系统 - 数据定义
// ==========================================

export const HOUSE_TYPES = [
  { id: 'tent',    name: '帐篷',     price: 3000,   slots: 1, furnitureSlots: 3,  gardenSlots: 1, icon: '⛺' },
  { id: 'cabin',   name: '小木屋',   price: 15000,  slots: 2, furnitureSlots: 6,  gardenSlots: 2, icon: '🏠' },
  { id: 'house',   name: '花园别墅', price: 60000,  slots: 4, furnitureSlots: 12, gardenSlots: 3, icon: '🏡' },
  { id: 'mansion', name: '豪华庄园', price: 200000, slots: 6, furnitureSlots: 20, gardenSlots: 4, icon: '🏰' },
  { id: 'castle',  name: '精灵城堡', price: 800000, slots: 10, furnitureSlots: 30, gardenSlots: 5, icon: '🏯' },
  { id: 'beach_house',    name: '海滨小屋',   price: 120000, slots: 4, furnitureSlots: 10, gardenSlots: 3, icon: '🏖️', requireMarriage: true, desc: '面朝大海的浪漫小屋', specialEffect: { waterIntimacy: 1.5 } },
  { id: 'garden_villa',   name: '繁花庄园',   price: 180000, slots: 4, furnitureSlots: 10, gardenSlots: 6, icon: '🌺', requireMarriage: true, desc: '被鲜花环绕的温馨庄园', specialEffect: { autoWater: true } },
  { id: 'cloud_loft',     name: '云端阁楼',   price: 250000, slots: 5, furnitureSlots: 14, gardenSlots: 3, icon: '☁️', requireMarriage: true, desc: '建于云端之上的浪漫阁楼', specialEffect: { flyIntimacy: 1.5 } },
  { id: 'crystal_palace', name: '水晶宫殿',   price: 500000, slots: 7, furnitureSlots: 23, gardenSlots: 4, icon: '💎', requireMarriage: true, desc: '用水晶打造的梦幻宫殿', specialEffect: { allEfficiency: 1.2 } },
  { id: 'world_tree',     name: '世界树居',   price: 1000000, slots: 10, furnitureSlots: 30, gardenSlots: 8, icon: '🌳', requireMarriage: true, desc: '古老世界树中的传说居所', specialEffect: { allEfficiency: 1.3, autoWater: true, giftQuality: 1 } },
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

  // --- 新增家具 (50种) ---
  // REST — battle
  { id: 'rest_starlight_cot', name: '星屑睡榻', category: 'REST', baseEffect: { hpRegen: 16 },
    icon: '🌠', shopPrice: null, dropSource: 'battle' },
  { id: 'rest_comet_blanket', name: '彗星绒毯', category: 'REST', baseEffect: { hpRegen: 15 },
    icon: '☄️', shopPrice: null, dropSource: 'battle' },
  { id: 'rest_dawn_hearth', name: '黎明暖炉', category: 'REST', baseEffect: { hpRegen: 14, scoreBonus: 8 },
    icon: '🔆', shopPrice: null, dropSource: 'battle' },
  { id: 'rest_legend_bell', name: '传说接待铃', category: 'REST', baseEffect: { hpRegen: 17 },
    icon: '🛎️', shopPrice: null, dropSource: 'battle' },
  // REST — pickup
  { id: 'rest_dew_bottle', name: '朝露润瓶', category: 'REST', baseEffect: { hpRegen: 5 },
    icon: '🧴', shopPrice: null, dropSource: 'pickup' },
  { id: 'rest_autumn_leaf', name: '落叶软垫', category: 'REST', baseEffect: { hpRegen: 4 },
    icon: '🍂', shopPrice: null, dropSource: 'pickup' },
  { id: 'rest_picnic_hamper', name: '野餐篮床', category: 'REST', baseEffect: { hpRegen: 5 },
    icon: '🧺', shopPrice: null, dropSource: 'pickup' },
  { id: 'rest_hedgehog_den', name: '刺刺午睡窝', category: 'REST', baseEffect: { hpRegen: 6 },
    icon: '🦔', shopPrice: null, dropSource: 'pickup' },
  // REST — shop
  { id: 'rest_wicker_stool', name: '藤编圆凳', category: 'REST', baseEffect: { hpRegen: 2 },
    icon: '🪑', shopPrice: 200, dropSource: 'shop' },
  { id: 'rest_spa_lather', name: '泡沫皂角', category: 'REST', baseEffect: { hpRegen: 3 },
    icon: '🧼', shopPrice: 650, dropSource: 'shop' },

  // TRAIN — battle
  { id: 'train_arcade_pod', name: '街机修行舱', category: 'TRAIN', baseEffect: { expBonus: 0.18 },
    icon: '🎮', shopPrice: null, dropSource: 'battle' },
  { id: 'train_sage_puzzle', name: '智慧拼图碑', category: 'TRAIN', baseEffect: { expBonus: 0.19 },
    icon: '🧩', shopPrice: null, dropSource: 'battle' },
  { id: 'train_sky_ladder', name: '天梯木架', category: 'TRAIN', baseEffect: { expBonus: 0.20 },
    icon: '🪜', shopPrice: null, dropSource: 'battle' },
  // TRAIN — pickup
  { id: 'train_route_signpost', name: '路牌训练架', category: 'TRAIN', baseEffect: { expBonus: 0.08 },
    icon: '🪧', shopPrice: null, dropSource: 'pickup' },
  { id: 'train_compass_roost', name: '罗盘定向台', category: 'TRAIN', baseEffect: { expBonus: 0.07 },
    icon: '🧭', shopPrice: null, dropSource: 'pickup' },
  { id: 'train_card_spread', name: '卡牌演武台', category: 'TRAIN', baseEffect: { expBonus: 0.09 },
    icon: '🃏', shopPrice: null, dropSource: 'pickup' },
  { id: 'train_lucky_dice', name: '骰子特训场', category: 'TRAIN', baseEffect: { expBonus: 0.08 },
    icon: '🎲', shopPrice: null, dropSource: 'pickup' },
  // TRAIN — shop
  { id: 'train_rhythm_drum', name: '节拍鼓阵', category: 'TRAIN', baseEffect: { expBonus: 0.05 },
    icon: '🥁', shopPrice: 500, dropSource: 'shop' },
  { id: 'train_melody_guitar', name: '旋律吉他架', category: 'TRAIN', baseEffect: { expBonus: 0.06 },
    icon: '🎸', shopPrice: 1100, dropSource: 'shop' },
  { id: 'train_yoyo_dojo', name: '溜溜球道场', category: 'TRAIN', baseEffect: { expBonus: 0.04 },
    icon: '🪀', shopPrice: 380, dropSource: 'shop' },

  // PLAY — battle
  { id: 'play_circus_tent', name: '马戏团大帐篷', category: 'PLAY', baseEffect: { intimacyBonus: 14, scoreBonus: 10 },
    icon: '🎪', shopPrice: null, dropSource: 'battle' },
  { id: 'play_carousel_mini', name: '迷你旋转木马', category: 'PLAY', baseEffect: { intimacyBonus: 15 },
    icon: '🎠', shopPrice: null, dropSource: 'battle' },
  { id: 'play_coaster_bits', name: '迷你过山车轨', category: 'PLAY', baseEffect: { intimacyBonus: 16 },
    icon: '🎢', shopPrice: null, dropSource: 'battle' },
  { id: 'play_teddy_throne', name: '绒毛王座', category: 'PLAY', baseEffect: { intimacyBonus: 13 },
    icon: '🧸', shopPrice: null, dropSource: 'battle' },
  // PLAY — pickup
  { id: 'play_kite_lane', name: '风筝跑道', category: 'PLAY', baseEffect: { intimacyBonus: 5 },
    icon: '🪁', shopPrice: null, dropSource: 'pickup' },
  { id: 'play_confetti_pit', name: '彩纸池', category: 'PLAY', baseEffect: { intimacyBonus: 4 },
    icon: '🎊', shopPrice: null, dropSource: 'pickup' },
  { id: 'play_balloon_arch', name: '气球拱门', category: 'PLAY', baseEffect: { intimacyBonus: 5 },
    icon: '🎈', shopPrice: null, dropSource: 'pickup' },
  // PLAY — shop
  { id: 'play_violin_corner', name: '小提琴角', category: 'PLAY', baseEffect: { intimacyBonus: 3, scoreBonus: 8 },
    icon: '🎻', shopPrice: 750, dropSource: 'shop' },
  { id: 'play_juice_bar', name: '能量果汁吧', category: 'PLAY', baseEffect: { intimacyBonus: 3 },
    icon: '🧃', shopPrice: 420, dropSource: 'shop' },
  { id: 'play_sunbask_rock', name: '日浴蜥蜴台', category: 'PLAY', baseEffect: { intimacyBonus: 2 },
    icon: '🦎', shopPrice: 280, dropSource: 'shop' },

  // DECO — battle
  { id: 'deco_beetle_sconce', name: '甲虫壁灯', category: 'DECO', baseEffect: { scoreBonus: 38 },
    icon: '🪲', shopPrice: null, dropSource: 'battle' },
  { id: 'deco_toy_train', name: '蒸汽小火车景', category: 'DECO', baseEffect: { scoreBonus: 40 },
    icon: '🚂', shopPrice: null, dropSource: 'battle' },
  { id: 'deco_rune_stone', name: '符文立石', category: 'DECO', baseEffect: { scoreBonus: 42, expBonus: 0.05 },
    icon: '🪨', shopPrice: null, dropSource: 'battle' },
  // DECO — pickup
  { id: 'deco_butterfly_mobile', name: '蝶翼风铃架', category: 'DECO', baseEffect: { scoreBonus: 18 },
    icon: '🦋', shopPrice: null, dropSource: 'pickup' },
  { id: 'deco_beehive_lamp', name: '蜂窝暖灯', category: 'DECO', baseEffect: { scoreBonus: 16 },
    icon: '🐝', shopPrice: null, dropSource: 'pickup' },
  { id: 'deco_chipmunk_shelf', name: '花栗鼠置物架', category: 'DECO', baseEffect: { scoreBonus: 14 },
    icon: '🐿️', shopPrice: null, dropSource: 'pickup' },
  { id: 'deco_seashell_frame', name: '贝壳相框墙', category: 'DECO', baseEffect: { scoreBonus: 17 },
    icon: '🐚', shopPrice: null, dropSource: 'pickup' },
  // DECO — shop
  { id: 'deco_red_packet', name: '红包墙饰', category: 'DECO', baseEffect: { scoreBonus: 9 },
    icon: '🧧', shopPrice: 220, dropSource: 'shop' },
  { id: 'deco_maple_garland', name: '枫叶花环', category: 'DECO', baseEffect: { scoreBonus: 10 },
    icon: '🍁', shopPrice: 480, dropSource: 'shop' },
  { id: 'deco_coral_corner', name: '珊瑚角饰', category: 'DECO', baseEffect: { scoreBonus: 11 },
    icon: '🪸', shopPrice: 1550, dropSource: 'shop' },

  // SPECIAL — battle
  { id: 'spec_mala_beads', name: '念珠咒链', category: 'SPECIAL', baseEffect: { ceRegen: 8, scoreBonus: 32 },
    icon: '📿', shopPrice: null, dropSource: 'battle' },
  { id: 'spec_nazar_amulet', name: '邪眼护符', category: 'SPECIAL', baseEffect: { ceRegen: 7, expBonus: 0.06 },
    icon: '🧿', shopPrice: null, dropSource: 'battle' },
  { id: 'spec_hamsa_table', name: '法蒂玛壁挂', category: 'SPECIAL', baseEffect: { ceRegen: 9, intimacyBonus: 4 },
    icon: '🪬', shopPrice: null, dropSource: 'battle' },
  // SPECIAL — pickup
  { id: 'spec_wish_candle', name: '许愿蜡烛阵', category: 'SPECIAL', baseEffect: { ceRegen: 4, hpRegen: 3 },
    icon: '🕯️', shopPrice: null, dropSource: 'pickup' },
  { id: 'spec_mycelium_altar', name: '菌丝祭坛', category: 'SPECIAL', baseEffect: { ceRegen: 5, scoreBonus: 15 },
    icon: '🍄', shopPrice: null, dropSource: 'pickup' },
  // SPECIAL — shop
  { id: 'spec_diya_lamp', name: '排灯小灯台', category: 'SPECIAL', baseEffect: { ceRegen: 3 },
    icon: '🪔', shopPrice: 1400, dropSource: 'shop' },
  { id: 'spec_char_tooth_cup', name: '咒纹洗漱杯架', category: 'SPECIAL', baseEffect: { ceRegen: 2 },
    icon: '🪥', shopPrice: 320, dropSource: 'shop' },
  { id: 'spec_ice_cluster', name: '冰咒晶簇', category: 'SPECIAL', baseEffect: { ceRegen: 4 },
    icon: '🧊', shopPrice: 2200, dropSource: 'shop' },
  { id: 'spec_ce_battery', name: '蓄咒电池', category: 'SPECIAL', baseEffect: { ceRegen: 3, expBonus: 0.03 },
    icon: '🔋', shopPrice: 900, dropSource: 'shop' },
  { id: 'spec_curse_urn', name: '咒纹陶罐', category: 'SPECIAL', baseEffect: { ceRegen: 2, scoreBonus: 11 },
    icon: '🏺', shopPrice: 780, dropSource: 'shop' },
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
  { minScore: 0,   title: '★ 简陋',   buff: null },
  { minScore: 50,  title: '★★ 温馨',   buff: { intimacyMult: 1.05 } },
  { minScore: 150, title: '★★★ 精致', buff: { intimacyMult: 1.10, hpRegenBonus: 2 } },
  { minScore: 300, title: '★★★★ 豪华', buff: { intimacyMult: 1.15, expBonus: 0.05 } },
  { minScore: 500, title: '★★★★★ 传奇', buff: { intimacyMult: 1.20, expBonus: 0.10, allStats: 3 } },
  { minScore: 1000, title: '✦ 传说家园', buff: { intimacyMult: 1.30, expBonus: 0.15, allStats: 5 } },
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
    const baseScore = def.baseEffect.scoreBonus || (def.category === 'DECO' ? 5 : 2);
    score += Math.floor(baseScore * qual.statMult);
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
  garden: { plots: [], waterLog: {} },
  treasures: [],
};

export const FURNITURE_TILE = 30;

// ==========================================
// 花园种植系统
// ==========================================

export const GARDEN_PLANTS = [
  { id: 'sunflower',    name: '向日葵',     icon: '🌻', category: 'flower', growthMs: 15*60000,  scoreValue: 12, rarity: 'COMMON',    seedPrice: 100,  desc: '阳光灿烂的花朵' },
  { id: 'rose',         name: '玫瑰',       icon: '🌹', category: 'flower', growthMs: 30*60000,  scoreValue: 20, rarity: 'COMMON',    seedPrice: 200,  desc: '优雅的红玫瑰' },
  { id: 'tulip',        name: '郁金香',     icon: '🌷', category: 'flower', growthMs: 45*60000,  scoreValue: 25, rarity: 'UNCOMMON',  seedPrice: 350,  desc: '高贵典雅的球根花' },
  { id: 'cherry_blossom', name: '樱花树',   icon: '🌸', category: 'flower', growthMs: 90*60000,  scoreValue: 45, rarity: 'RARE',      seedPrice: 800,  desc: '绽放粉色花瓣的小树' },
  { id: 'crystal_flower', name: '水晶花',   icon: '💎', category: 'flower', growthMs: 180*60000, scoreValue: 80, rarity: 'EPIC',      seedPrice: null, desc: '闪耀着神秘光芒的奇花' },
  { id: 'rainbow_bloom', name: '虹光之花',  icon: '🌈', category: 'flower', growthMs: 360*60000, scoreValue: 150, rarity: 'LEGENDARY', seedPrice: null, desc: '传说中开出七色光芒的神花' },
  { id: 'berry_bush_g', name: '树果灌木',   icon: '🫐', category: 'fruit',  growthMs: 20*60000,  rarity: 'COMMON',    seedPrice: 150,  harvestItem: { type:'berry', id:'berry', count:5 },  desc: '结出美味树果' },
  { id: 'heal_herb',    name: '回复草',     icon: '🌿', category: 'fruit',  growthMs: 40*60000,  rarity: 'COMMON',    seedPrice: 250,  harvestItem: { type:'med', id:'potion', count:3 },   desc: '可制成伤药的药草' },
  { id: 'golden_apple', name: '金苹果树',   icon: '🍎', category: 'fruit',  growthMs: 120*60000, rarity: 'RARE',      seedPrice: 600,  harvestItem: { type:'med', id:'hyper_potion', count:2 }, desc: '结出金色苹果' },
  { id: 'evo_vine',     name: '进化藤',     icon: '🍇', category: 'fruit',  growthMs: 180*60000, rarity: 'EPIC',      seedPrice: null, harvestItem: { type:'stone', id:'leaf', count:1 },     desc: '结出蕴含进化能量的果实' },
  { id: 'mint',         name: '薄荷',       icon: '🍃', category: 'herb',   growthMs: 10*60000,  rarity: 'COMMON',    seedPrice: 80,   harvestItem: { type:'misc', id:'rebirth_pill', count:1, chance:0.15 }, desc: '清爽的药用植物' },
  { id: 'lucky_clover', name: '四叶草',     icon: '🍀', category: 'herb',   growthMs: 60*60000,  rarity: 'UNCOMMON',  seedPrice: 400,  harvestItem: { type:'candy', id:'exp_candy', count:2 }, desc: '传说能带来好运' },
  { id: 'moonlight_fern', name: '月光蕨',   icon: '🌙', category: 'herb',   growthMs: 120*60000, rarity: 'RARE',      seedPrice: 700,  harvestItem: { type:'growth', id:null, count:1 },    desc: '在月光下发光的蕨类' },
  { id: 'world_tree',   name: '世界树苗',   icon: '🌳', category: 'rare',   growthMs: 480*60000, scoreValue: 200, rarity: 'LEGENDARY', seedPrice: null, desc: '连接精灵世界的神树种子' },
  { id: 'starfruit',    name: '星辰果',     icon: '⭐', category: 'rare',   growthMs: 300*60000, rarity: 'EPIC',      seedPrice: null, harvestItem: { type:'candy', id:'max_candy', count:1 }, desc: '蕴含星辰之力的奇果' },
];

export const getGardenSlots = (houseId) => {
  const h = HOUSE_TYPES.find(t => t.id === houseId);
  return h ? h.gardenSlots : 0;
};

export const SEED_DROP_TABLE = {
  COMMON:    [{ plantId: 'crystal_flower', weight: 2 }, { plantId: 'evo_vine', weight: 3 }, { plantId: 'moonlight_fern', weight: 5 }],
  UNCOMMON:  [{ plantId: 'crystal_flower', weight: 5 }, { plantId: 'evo_vine', weight: 5 }, { plantId: 'starfruit', weight: 3 }],
  RARE:      [{ plantId: 'crystal_flower', weight: 8 }, { plantId: 'starfruit', weight: 5 }, { plantId: 'rainbow_bloom', weight: 2 }, { plantId: 'world_tree', weight: 1 }],
};

// ==========================================
// 珍藏阁系统
// ==========================================

export const TREASURE_COLLECTIONS = [
  {
    id: 'badges', name: '徽章收藏', icon: '🏅', desc: '收集各地道馆的挑战徽章',
    setBonus: { score: 200 },
    items: [
      { id: 'badge_1',  name: '草之徽章',   icon: '🍃', score: 15, condition: 'gym', mapId: 1 },
      { id: 'badge_2',  name: '回音徽章',   icon: '🔊', score: 15, condition: 'gym', mapId: 2 },
      { id: 'badge_3',  name: '齿轮徽章',   icon: '⚙️', score: 15, condition: 'gym', mapId: 3 },
      { id: 'badge_4',  name: '海蓝徽章',   icon: '🌊', score: 15, condition: 'gym', mapId: 4 },
      { id: 'badge_5',  name: '熔岩徽章',   icon: '🌋', score: 15, condition: 'gym', mapId: 5 },
      { id: 'badge_6',  name: '电子徽章',   icon: '💻', score: 20, condition: 'gym', mapId: 6 },
      { id: 'badge_7',  name: '幽魂徽章',   icon: '👻', score: 20, condition: 'gym', mapId: 7 },
      { id: 'badge_8',  name: '天空徽章',   icon: '🌤️', score: 20, condition: 'gym', mapId: 8 },
      { id: 'badge_9',  name: '极寒徽章',   icon: '❄️', score: 20, condition: 'gym', mapId: 9 },
      { id: 'badge_10', name: '流沙徽章',   icon: '🏜️', score: 20, condition: 'gym', mapId: 10 },
      { id: 'badge_11', name: '甜梦徽章',   icon: '🍭', score: 20, condition: 'gym', mapId: 11 },
      { id: 'badge_12', name: '星辰徽章',   icon: '🌌', score: 25, condition: 'gym', mapId: 12 },
      { id: 'badge_13', name: '创世徽章',   icon: '🏆', score: 30, condition: 'gym', mapId: 13 },
      { id: 'badge_99', name: '日蚀徽章',   icon: '💀', score: 25, condition: 'gym', mapId: 99 },
      { id: 'badge_100', name: '咒术徽章',  icon: '🔮', score: 25, condition: 'gym', mapId: 100 },
      { id: 'badge_101', name: 'DA徽章',    icon: '🎀', score: 25, condition: 'gym', mapId: 101 },
      { id: 'badge_102', name: '武道徽章',   icon: '🏯', score: 30, condition: 'gym', mapId: 102 },
    ],
  },
  {
    id: 'boss_trophies', name: 'Boss战利品', icon: '🏆', desc: '击败各大Boss后获得的纪念品',
    setBonus: { score: 150 },
    items: [
      { id: 'trophy_eclipse', name: '日蚀碎章',     icon: '🌑', score: 30, condition: 'story', chapter: 5 },
      { id: 'trophy_elite',   name: '四天王证明',   icon: '👑', score: 30, condition: 'story', chapter: 13 },
      { id: 'trophy_champion', name: '冠军桂冠',    icon: '🎖️', score: 50, condition: 'story', chapter: 14 },
      { id: 'trophy_sukuna',  name: '宿傩封印石',   icon: '🫵', score: 40, condition: 'story', chapter: 17 },
      { id: 'trophy_majima',  name: '真岛的面具',   icon: '🎭', score: 40, condition: 'story', chapter: 20 },
    ],
  },
  {
    id: 'map_souvenirs', name: '地图纪念品', icon: '🗺️', desc: '探索各地获得的珍贵纪念品',
    setBonus: { score: 100 },
    items: [
      { id: 'souvenir_grass',  name: '微风花环',     icon: '💐', score: 10, condition: 'explore', mapId: 1 },
      { id: 'souvenir_valley', name: '回声水晶',     icon: '🔮', score: 10, condition: 'explore', mapId: 2 },
      { id: 'souvenir_factory', name: '古代齿轮',    icon: '⚙️', score: 10, condition: 'explore', mapId: 3 },
      { id: 'souvenir_sea',    name: '深海珍珠',     icon: '🫧', score: 15, condition: 'explore', mapId: 4 },
      { id: 'souvenir_volcano', name: '熔岩晶石',    icon: '💎', score: 15, condition: 'explore', mapId: 5 },
      { id: 'souvenir_cyber',  name: '量子芯片',     icon: '🔲', score: 15, condition: 'explore', mapId: 6 },
    ],
  },
  {
    id: 'legend_relics', name: '传说遗物', icon: '✨', desc: '来自传说精灵的珍贵物品',
    setBonus: { score: 200 },
    items: [
      { id: 'relic_challenge5', name: '试炼者勋章',  icon: '🔱', score: 25, condition: 'challenge', challengeId: 'c5' },
      { id: 'relic_challenge8', name: '征服者勋章',  icon: '⚜️', score: 35, condition: 'challenge', challengeId: 'c8' },
      { id: 'relic_tower_top',  name: '塔顶之星',    icon: '💫', score: 50, condition: 'challenge', challengeId: 'c10' },
      { id: 'relic_god_beast',  name: '神兽之鳞',    icon: '🐉', score: 40, condition: 'catch_legendary' },
    ],
  },
  {
    id: 'event_medals', name: '活动奖章', icon: '🎖️', desc: '各类特殊活动的参与纪念',
    setBonus: { score: 80 },
    items: [
      { id: 'medal_bug',     name: '捕虫冠军章',   icon: '🐛', score: 15, condition: 'event', eventType: 'bug_catching' },
      { id: 'medal_fish',    name: '钓鱼达人章',   icon: '🐟', score: 15, condition: 'event', eventType: 'fishing' },
      { id: 'medal_contest', name: '华丽大赛章',   icon: '🌟', score: 15, condition: 'event', eventType: 'contest' },
      { id: 'medal_cafe',    name: '咖啡大师章',   icon: '☕', score: 20, condition: 'cafe_lv5' },
      { id: 'medal_housing', name: '家园大师章',   icon: '🏡', score: 20, condition: 'housing_score', minScore: 500 },
    ],
  },
];
