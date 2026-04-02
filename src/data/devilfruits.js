// ============================================================
// 海贼王恶魔果实系统 - 数据定义
// ============================================================

export const FRUIT_RARITY_CONFIG = {
  COMMON:    { dropRate: 0.08, shopPrice: 3000,  color: '#78909C', label: '普通' },
  RARE:      { dropRate: 0.04, shopPrice: 8000,  color: '#2196F3', label: '稀有' },
  EPIC:      { dropRate: 0.015, shopPrice: 20000, color: '#9C27B0', label: '史诗' },
  LEGENDARY: { dropRate: 0.005, shopPrice: 50000, color: '#FF9800', label: '传说' },
};

export const FRUIT_CATEGORY_NAMES = {
  PARAMECIA: '超人系',
  ZOAN: '动物系',
  LOGIA: '自然系',
};

// ============================================================
// 35种恶魔果实
// ============================================================
export const DEVIL_FRUITS = {
  // ===================== 超人系 (12种) =====================
  df_gomu: {
    id: 'df_gomu', name: '橡胶果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '身体变成橡胶，免疫电系攻击，物攻与速度大幅提升',
    duration: 4,
    transform: {
      atkMult: 1.6, defMult: 1.2, spdMult: 1.3,
      movePowerBoost: 0.3, typeImmune: 'ELECTRIC',
    },
    transformMove: { name: '橡胶火箭炮', t: 'FIGHT', p: 120, pp: 5, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.3 } },
  },
  df_gura: {
    id: 'df_gura', name: '震震果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '引发地震与海啸，无视部分防御，技能威力大增',
    duration: 4,
    transform: {
      atkMult: 1.5, ignoreDefPercent: 0.4, movePowerBoost: 0.35,
    },
    transformMove: { name: '大地裂击', t: 'GROUND', p: 130, pp: 4, acc: 85, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 2, target: 'enemy', chance: 0.5 } },
  },
  df_ope: {
    id: 'df_ope', name: '手术果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '创造ROOM空间，可造成固定比例伤害并增强回复',
    duration: 4,
    transform: {
      sAtkMult: 1.5, healPerTurn: 0.1, fixedDmgPercent: 0.15,
    },
    transformMove: { name: '伽马刀', t: 'PSYCHIC', p: 110, pp: 5, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 0.4, target: 'enemy' } },
  },
  df_ito: {
    id: 'df_ito', name: '线线果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '操纵丝线束缚对手，每回合降低对手速度并造成持续伤害',
    duration: 5,
    transform: {
      sAtkMult: 1.3, spdMult: 1.2,
      dotPerTurn: 0.05, enemySpdDown: 1,
    },
    transformMove: { name: '超级线球', t: 'NORMAL', p: 100, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_mochi: {
    id: 'df_mochi', name: '糯糯果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '身体变成糯米，物理伤害反弹20%，物防大增',
    duration: 5,
    transform: {
      defMult: 1.6, atkMult: 1.2,
      reflectPhysical: 0.2,
    },
    transformMove: { name: '糯糯白连冲', t: 'FIGHT', p: 95, pp: 6, acc: 100, isFruitMove: true },
  },
  df_pero: {
    id: 'df_pero', name: '甜甜果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '甜蜜气息削弱对手，每回合回复HP并降低对手攻击',
    duration: 5,
    transform: {
      healPerTurn: 0.08, enemyAtkDown: 1, defMult: 1.3,
    },
    transformMove: { name: '糖衣炮弹', t: 'FAIRY', p: 85, pp: 8, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, target: 'enemy', chance: 0.4 } },
  },
  df_zushi: {
    id: 'df_zushi', name: '重力果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '操控重力，大幅降低对手速度，飞行系无法闪避地面攻击',
    duration: 5,
    transform: {
      enemySpdDown: 2, groundFlying: true, defMult: 1.2,
    },
    transformMove: { name: '重力压制', t: 'GROUND', p: 90, pp: 6, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy', chance: 0.6 } },
  },
  df_doa: {
    id: 'df_doa', name: '门门果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '创造空间之门，首回合必先手，闪避大幅提升',
    duration: 4,
    transform: {
      spdMult: 1.4, evaBoost: 0.3, firstStrike: true,
    },
    transformMove: { name: '空间斩击', t: 'PSYCHIC', p: 80, pp: 8, acc: 100, isFruitMove: true },
  },
  df_suke: {
    id: 'df_suke', name: '透明果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '变得透明，闪避和暴击率大幅提升',
    duration: 4,
    transform: {
      evaBoost: 0.4, critBoost: 2, spdMult: 1.2,
    },
    transformMove: { name: '隐身突袭', t: 'GHOST', p: 85, pp: 8, acc: 100, isFruitMove: true },
  },
  df_noro: {
    id: 'df_noro', name: '迟缓果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '释放迟缓光子，大幅降低对手速度',
    duration: 5,
    transform: {
      enemySpdDown: 3, spdMult: 1.3,
    },
    transformMove: { name: '迟缓光束', t: 'PSYCHIC', p: 75, pp: 10, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy', chance: 0.7 } },
  },
  df_bomu: {
    id: 'df_bomu', name: '炸弹果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '身体可以产生爆炸，全技能威力+40%但每回合损失5%HP',
    duration: 4,
    transform: {
      movePowerBoost: 0.4, selfDotPerTurn: 0.05, atkMult: 1.3,
    },
    transformMove: { name: '全身爆破', t: 'FIRE', p: 110, pp: 5, acc: 90, isFruitMove: true },
  },
  df_sabi: {
    id: 'df_sabi', name: '锈锈果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '使接触到的金属生锈，攻击时降低对手物防',
    duration: 5,
    transform: {
      atkMult: 1.15, onHitDefDown: 1,
    },
    transformMove: { name: '腐蚀之触', t: 'STEEL', p: 70, pp: 10, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.6 } },
  },

  // ===================== 动物系 (12种) =====================
  df_hito_buddha: {
    id: 'df_hito_buddha', name: '人人果实·大佛形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '化身巨大金佛，全属性大幅提升，冲击波威力极高',
    duration: 3,
    transform: {
      atkMult: 1.4, defMult: 1.4, sAtkMult: 1.4, sDefMult: 1.4, spdMult: 1.1,
    },
    transformMove: { name: '佛之冲击', t: 'FIGHT', p: 140, pp: 3, acc: 85, isFruitMove: true },
  },
  df_ryu_pteranodon: {
    id: 'df_ryu_pteranodon', name: '龙龙果实·翼龙形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '变身远古翼龙，飞行与龙系双增伤，速度大幅提升',
    duration: 4,
    transform: {
      spdMult: 1.6, atkMult: 1.3,
      typeBoost: { FLYING: 1.5, DRAGON: 1.5 },
    },
    transformMove: { name: '翼龙俯冲', t: 'DRAGON', p: 120, pp: 4, acc: 90, isFruitMove: true },
  },
  df_hebi_yamata: {
    id: 'df_hebi_yamata', name: '蛇蛇果实·八岐大蛇', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身八头巨蛇，攻击命中2-3次，附带毒素',
    duration: 4,
    transform: {
      atkMult: 1.2, multiHit: [2, 3],
      onHitPoison: 0.3,
    },
    transformMove: { name: '八头蛇咬', t: 'POISON', p: 50, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.5, target: 'enemy' } },
  },
  df_inu_kyubi: {
    id: 'df_inu_kyubi', name: '犬犬果实·九尾狐形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身九尾妖狐，特攻大增，攻击有概率魅惑对手',
    duration: 4,
    transform: {
      sAtkMult: 1.6, spdMult: 1.2,
      onHitConfuse: 0.25,
    },
    transformMove: { name: '妖狐幻术', t: 'PSYCHIC', p: 100, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'CON', chance: 0.4, target: 'enemy' } },
  },
  df_neko_leopard: {
    id: 'df_neko_leopard', name: '猫猫果实·豹形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身猎豹，速度极大提升，暴击率翻倍',
    duration: 4,
    transform: {
      spdMult: 1.8, atkMult: 1.2, critBoost: 3,
    },
    transformMove: { name: '豹式突袭', t: 'NORMAL', p: 90, pp: 8, acc: 100, isFruitMove: true },
  },
  df_ushi_bison: {
    id: 'df_ushi_bison', name: '牛牛果实·野牛形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身巨大野牛，物攻物防大增，但速度下降',
    duration: 5,
    transform: {
      atkMult: 1.5, defMult: 1.5, spdMult: 0.8,
    },
    transformMove: { name: '暴牛冲锋', t: 'FIGHT', p: 110, pp: 5, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.3 } },
  },
  df_zou_mammoth: {
    id: 'df_zou_mammoth', name: '象象果实·猛犸形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身远古猛犸，HP上限+30%，物防大增',
    duration: 5,
    transform: {
      hpMult: 1.3, defMult: 1.5, atkMult: 1.2,
    },
    transformMove: { name: '猛犸踩踏', t: 'GROUND', p: 95, pp: 6, acc: 95, isFruitMove: true },
  },
  df_tori_phoenix: {
    id: 'df_tori_phoenix', name: '鸟鸟果实·凤凰形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身不死鸟，每回合回复15%HP，火系技能增伤',
    duration: 4,
    transform: {
      healPerTurn: 0.15, spdMult: 1.3,
      typeBoost: { FIRE: 1.5 },
    },
    transformMove: { name: '凤凰烈焰', t: 'FIRE', p: 100, pp: 5, acc: 95, isFruitMove: true },
  },
  df_mushi_kabutomushi: {
    id: 'df_mushi_kabutomushi', name: '虫虫果实·独角仙形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身巨型独角仙，物攻+50%，虫系技能追加',
    duration: 5,
    transform: {
      atkMult: 1.5, defMult: 1.2,
      typeBoost: { BUG: 1.4 },
    },
    transformMove: { name: '巨角猛击', t: 'BUG', p: 95, pp: 6, acc: 95, isFruitMove: true },
  },
  df_uo_seiryu: {
    id: 'df_uo_seiryu', name: '鱼鱼果实·青龙形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身东方青龙，水系与龙系双增伤',
    duration: 4,
    transform: {
      sAtkMult: 1.4, defMult: 1.2,
      typeBoost: { WATER: 1.4, DRAGON: 1.4 },
    },
    transformMove: { name: '青龙吐息', t: 'DRAGON', p: 100, pp: 5, acc: 90, isFruitMove: true },
  },
  df_uma: {
    id: 'df_uma', name: '马马果实', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身骏马，速度大幅提升',
    duration: 5,
    transform: {
      spdMult: 1.4, atkMult: 1.1,
    },
    transformMove: { name: '铁蹄踢击', t: 'NORMAL', p: 75, pp: 10, acc: 100, isFruitMove: true },
  },
  df_inu_wolf: {
    id: 'df_inu_wolf', name: '犬犬果实·狼形态', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身恶狼，物攻提升，暴击率增加',
    duration: 5,
    transform: {
      atkMult: 1.3, critBoost: 2, spdMult: 1.15,
    },
    transformMove: { name: '狼牙撕咬', t: 'DARK', p: 80, pp: 8, acc: 100, isFruitMove: true },
  },

  // ===================== 自然系 (11种) =====================
  df_magu: {
    id: 'df_magu', name: '岩浆果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为岩浆，火系技能威力翻倍，灼伤概率100%',
    duration: 3,
    transform: {
      typeBoost: { FIRE: 2.0 },
      onHitBurn: 1.0, defMult: 1.2,
    },
    transformMove: { name: '犬噬红莲', t: 'FIRE', p: 130, pp: 3, acc: 85, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 1.0, target: 'enemy' } },
  },
  df_yami: {
    id: 'df_yami', name: '暗暗果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '操控黑暗，吸收伤害回复HP，可取消对手果实变身效果',
    duration: 4,
    transform: {
      atkMult: 1.4, hpDrain: 0.2,
      cancelEnemyFruit: true,
    },
    transformMove: { name: '暗水', t: 'DARK', p: 110, pp: 4, acc: 90, isFruitMove: true },
  },
  df_hie: {
    id: 'df_hie', name: '冰冻果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为冰，冰系增伤，冻结概率大增，物防+40%',
    duration: 4,
    transform: {
      defMult: 1.4,
      typeBoost: { ICE: 1.6 },
      onHitFreeze: 0.3,
    },
    transformMove: { name: '冰河时代', t: 'ICE', p: 110, pp: 4, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'FRZ', chance: 0.4, target: 'enemy' } },
  },
  df_goro: {
    id: 'df_goro', name: '闪电果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为闪电，电系增伤，速度+60%，变身首回合必先手',
    duration: 4,
    transform: {
      spdMult: 1.6, firstStrike: true,
      typeBoost: { ELECTRIC: 1.5 },
    },
    transformMove: { name: '万雷', t: 'ELECTRIC', p: 120, pp: 4, acc: 85, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PAR', chance: 0.4, target: 'enemy' } },
  },
  df_pika: {
    id: 'df_pika', name: '光光果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为光，速度极大提升，普通攻击变为光属性',
    duration: 4,
    transform: {
      spdMult: 1.8, sAtkMult: 1.3,
      convertNormalTo: 'ELECTRIC',
    },
    transformMove: { name: '天丛云剑', t: 'ELECTRIC', p: 105, pp: 5, acc: 95, isFruitMove: true },
  },
  df_moku: {
    id: 'df_moku', name: '烟雾果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为烟雾，闪避+40%，降低对手命中',
    duration: 5,
    transform: {
      evaBoost: 0.4, enemyAccDown: 2, defMult: 1.1,
    },
    transformMove: { name: '白藤雨', t: 'FLYING', p: 75, pp: 8, acc: 100, isFruitMove: true },
  },
  df_suna: {
    id: 'df_suna', name: '沙沙果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为砂砾，地面系增伤，物理攻击附带降防',
    duration: 5,
    transform: {
      atkMult: 1.3, onHitDefDown: 1,
      typeBoost: { GROUND: 1.4 },
    },
    transformMove: { name: '沙漠宝刀', t: 'GROUND', p: 90, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_mera: {
    id: 'df_mera', name: '火火果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为火焰，火系增伤50%，灼伤几率提升',
    duration: 5,
    transform: {
      sAtkMult: 1.3,
      typeBoost: { FIRE: 1.5 },
      onHitBurn: 0.35,
    },
    transformMove: { name: '火拳', t: 'FIRE', p: 95, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 0.4, target: 'enemy' } },
  },
  df_yuki: {
    id: 'df_yuki', name: '雪雪果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为冰雪，冰系增伤30%，攻击附带降速',
    duration: 5,
    transform: {
      sAtkMult: 1.2,
      typeBoost: { ICE: 1.3 },
      onHitSpdDown: 1,
    },
    transformMove: { name: '雪兔暴风', t: 'ICE', p: 85, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_doku: {
    id: 'df_doku', name: '毒毒果实', category: 'LOGIA', rarity: 'COMMON',
    desc: '身体充满剧毒，所有攻击附带中毒',
    duration: 5,
    transform: {
      atkMult: 1.15, sAtkMult: 1.15,
      onHitPoison: 0.5,
    },
    transformMove: { name: '毒龙', t: 'POISON', p: 80, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.7, target: 'enemy' } },
  },
  df_beta: {
    id: 'df_beta', name: '黏黏果实', category: 'LOGIA', rarity: 'COMMON',
    desc: '释放黏液降低对手速度，反弹10%伤害',
    duration: 5,
    transform: {
      defMult: 1.2, enemySpdDown: 1,
      reflectAll: 0.1,
    },
    transformMove: { name: '黏液陷阱', t: 'POISON', p: 70, pp: 10, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy', chance: 0.6 } },
  },
};

// 按稀有度分组的果实ID列表（用于随机抽取）
const FRUITS_BY_RARITY = {};
Object.values(DEVIL_FRUITS).forEach(f => {
  if (!FRUITS_BY_RARITY[f.rarity]) FRUITS_BY_RARITY[f.rarity] = [];
  FRUITS_BY_RARITY[f.rarity].push(f.id);
});

export function getRandomFruit(level, mode = 'trainer') {
  const weights = mode === 'wild'
    ? { COMMON: 60, RARE: 30, EPIC: 8, LEGENDARY: 2 }
    : level >= 40
      ? { COMMON: 15, RARE: 35, EPIC: 35, LEGENDARY: 15 }
      : level >= 25
        ? { COMMON: 25, RARE: 40, EPIC: 28, LEGENDARY: 7 }
        : { COMMON: 40, RARE: 40, EPIC: 17, LEGENDARY: 3 };

  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * total;
  for (const [rarity, w] of entries) {
    roll -= w;
    if (roll <= 0) {
      const pool = FRUITS_BY_RARITY[rarity];
      if (pool && pool.length > 0) {
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }
  }
  const fallback = FRUITS_BY_RARITY.COMMON;
  return fallback[Math.floor(Math.random() * fallback.length)];
}

export function getFruitById(id) {
  return DEVIL_FRUITS[id] || null;
}

export function getAllFruits() {
  return Object.values(DEVIL_FRUITS);
}

export function getFruitsByCategory(category) {
  return Object.values(DEVIL_FRUITS).filter(f => f.category === category);
}

export function getShopFruits() {
  return Object.values(DEVIL_FRUITS).filter(f => f.rarity === 'COMMON' || f.rarity === 'RARE');
}

export const FRUIT_ICONS = {
  // === 超人系 (12) ===
  df_gomu:            { bg: 'linear-gradient(135deg, #E53935, #FF8A80)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%)', symbol: '橡', symbolColor: '#fff' },
  df_gura:            { bg: 'linear-gradient(135deg, #6A1B9A, #CE93D8)', pattern: 'repeating-conic-gradient(#6A1B9A 0% 25%, transparent 0% 50%) 50% / 12px 12px', symbol: '震', symbolColor: '#fff' },
  df_ope:             { bg: 'linear-gradient(135deg, #1565C0, #90CAF9)', pattern: 'radial-gradient(circle, rgba(255,255,255,0.3) 30%, transparent 70%)', symbol: '术', symbolColor: '#fff' },
  df_ito:             { bg: 'linear-gradient(135deg, #F06292, #FCE4EC)', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 5px)', symbol: '糸', symbolColor: '#AD1457' },
  df_mochi:           { bg: 'linear-gradient(135deg, #FFB74D, #FFF3E0)', pattern: 'radial-gradient(circle at 60% 60%, rgba(255,255,255,0.5), transparent)', symbol: '糯', symbolColor: '#E65100' },
  df_pero:            { bg: 'linear-gradient(135deg, #F48FB1, #FCE4EC)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.5), transparent)', symbol: '甜', symbolColor: '#880E4F' },
  df_zushi:           { bg: 'linear-gradient(135deg, #5D4037, #BCAAA4)', pattern: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.3), transparent)', symbol: '重', symbolColor: '#fff' },
  df_doa:             { bg: 'linear-gradient(135deg, #7E57C2, #D1C4E9)', pattern: 'linear-gradient(0deg, transparent 45%, rgba(255,255,255,0.2) 50%, transparent 55%)', symbol: '門', symbolColor: '#fff' },
  df_suke:            { bg: 'linear-gradient(135deg, #78909C, #B0BEC5)', pattern: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)', symbol: '透', symbolColor: '#fff' },
  df_noro:            { bg: 'linear-gradient(135deg, #B39DDB, #EDE7F6)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '遅', symbolColor: '#4527A0' },
  df_bomu:            { bg: 'linear-gradient(135deg, #FF6F00, #FFD54F)', pattern: 'radial-gradient(circle at 50% 50%, #FF3D00 20%, transparent 60%)', symbol: '爆', symbolColor: '#fff' },
  df_sabi:            { bg: 'linear-gradient(135deg, #8D6E63, #D7CCC8)', pattern: 'repeating-conic-gradient(#795548 0% 25%, transparent 0% 50%) 50% / 8px 8px', symbol: '锈', symbolColor: '#3E2723' },
  // === 动物系 (12) ===
  df_hito_buddha:     { bg: 'linear-gradient(135deg, #FFD700, #FFF8E1)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), transparent)', symbol: '佛', symbolColor: '#FF6F00' },
  df_ryu_pteranodon:  { bg: 'linear-gradient(135deg, #1B5E20, #A5D6A7)', pattern: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%)', symbol: '翼', symbolColor: '#fff' },
  df_hebi_yamata:     { bg: 'linear-gradient(135deg, #4A148C, #EA80FC)', pattern: 'repeating-linear-gradient(60deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px)', symbol: '蛇', symbolColor: '#fff' },
  df_inu_kyubi:       { bg: 'linear-gradient(135deg, #FF6D00, #FFCC80)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '狐', symbolColor: '#BF360C' },
  df_neko_leopard:    { bg: 'linear-gradient(135deg, #FF8F00, #FFE082)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(139,69,19,0.15) 4px, rgba(139,69,19,0.15) 6px)', symbol: '豹', symbolColor: '#4E342E' },
  df_ushi_bison:      { bg: 'linear-gradient(135deg, #37474F, #B0BEC5)', pattern: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0.2), transparent)', symbol: '牛', symbolColor: '#fff' },
  df_zou_mammoth:     { bg: 'linear-gradient(135deg, #455A64, #CFD8DC)', pattern: 'radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0.15), transparent)', symbol: '象', symbolColor: '#fff' },
  df_tori_phoenix:    { bg: 'linear-gradient(135deg, #FF6D00, #FFAB40)', pattern: 'radial-gradient(circle at 50% 30%, #FFD740, transparent 60%)', symbol: '凰', symbolColor: '#BF360C' },
  df_mushi_kabutomushi: { bg: 'linear-gradient(135deg, #827717, #E6EE9C)', pattern: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3), transparent)', symbol: '虫', symbolColor: '#33691E' },
  df_uo_seiryu:       { bg: 'linear-gradient(135deg, #0D47A1, #42A5F5)', pattern: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px)', symbol: '龍', symbolColor: '#E3F2FD' },
  df_uma:             { bg: 'linear-gradient(135deg, #1A237E, #7986CB)', pattern: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.1) 60%)', symbol: '馬', symbolColor: '#C5CAE9' },
  df_inu_wolf:        { bg: 'linear-gradient(135deg, #37474F, #607D8B)', pattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent)', symbol: '狼', symbolColor: '#ECEFF1' },
  // === 自然系 (11) ===
  df_magu:            { bg: 'linear-gradient(135deg, #B71C1C, #FF5722)', pattern: 'radial-gradient(circle at 60% 70%, #FF3D00, transparent 50%)', symbol: '岩', symbolColor: '#FFD600' },
  df_yami:            { bg: 'linear-gradient(135deg, #212121, #424242)', pattern: 'radial-gradient(circle at 50% 50%, #000 20%, transparent 60%)', symbol: '闇', symbolColor: '#9C27B0' },
  df_hie:             { bg: 'linear-gradient(135deg, #0097A7, #E0F7FA)', pattern: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.6), transparent)', symbol: '氷', symbolColor: '#006064' },
  df_goro:            { bg: 'linear-gradient(135deg, #F9A825, #FFF9C4)', pattern: 'linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.5) 42%, transparent 44%)', symbol: '雷', symbolColor: '#E65100' },
  df_pika:            { bg: 'linear-gradient(135deg, #FFD600, #FFFDE7)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 20%, transparent 50%)', symbol: '光', symbolColor: '#FF6F00' },
  df_moku:            { bg: 'linear-gradient(135deg, #78909C, #CFD8DC)', pattern: 'radial-gradient(circle at 50% 60%, rgba(255,255,255,0.3), transparent 60%)', symbol: '煙', symbolColor: '#37474F' },
  df_suna:            { bg: 'linear-gradient(135deg, #F9A825, #D7CCC8)', pattern: 'repeating-conic-gradient(#C8A415 0% 25%, transparent 0% 50%) 50% / 6px 6px', symbol: '砂', symbolColor: '#4E342E' },
  df_mera:            { bg: 'linear-gradient(135deg, #D50000, #FF8A65)', pattern: 'radial-gradient(circle at 50% 70%, #FF6D00, transparent 60%)', symbol: '炎', symbolColor: '#FFD600' },
  df_yuki:            { bg: 'linear-gradient(135deg, #E1F5FE, #fff)', pattern: 'radial-gradient(circle at 30% 30%, rgba(100,181,246,0.3), transparent 50%)', symbol: '雪', symbolColor: '#0277BD' },
  df_doku:            { bg: 'linear-gradient(135deg, #7B1FA2, #CE93D8)', pattern: 'radial-gradient(circle at 40% 60%, rgba(255,255,255,0.2), transparent)', symbol: '毒', symbolColor: '#E1BEE7' },
  df_beta:            { bg: 'linear-gradient(135deg, #689F38, #C5E1A5)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 30%, transparent)', symbol: '粘', symbolColor: '#33691E' },
};

export function getFruitIcon(fruitId) {
  return FRUIT_ICONS[fruitId] || { bg: 'linear-gradient(135deg, #666, #999)', pattern: '', symbol: '?', symbolColor: '#fff' };
}
