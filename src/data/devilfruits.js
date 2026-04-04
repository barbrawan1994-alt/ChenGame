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
// 98种恶魔果实
// ============================================================
export const DEVIL_FRUITS = {
  // ===================== 超人系 (17种) =====================
  df_gomu: {
    id: 'df_gomu', name: '橡胶果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '身体变成橡胶，免疫电系攻击，物攻与速度大幅提升',
    duration: 4,
    transform: {
      atkMult: 1.4, defMult: 1.2, spdMult: 1.3,
      movePowerBoost: 0.2, typeImmune: 'ELECTRIC',
    },
    transformMove: { name: '橡胶火箭炮', t: 'FIGHT', p: 120, pp: 5, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.3 } },
  },
  df_gura: {
    id: 'df_gura', name: '震震果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '引发地震与海啸，无视部分防御，技能威力大增',
    duration: 4,
    transform: {
      atkMult: 1.5, ignoreDefPercent: 0.2, movePowerBoost: 0.25,
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
    desc: '操控重力，大幅降低对手速度，防御提升',
    duration: 5,
    transform: {
      enemySpdDown: 2, defMult: 1.2,
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
  df_jiki: {
    id: 'df_jiki', name: '磁磁果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '操控磁力场，钢系技能威力大增，可牵引对手降低速度',
    duration: 5,
    transform: {
      sAtkMult: 1.4, typeBoost: { STEEL: 1.5 }, enemySpdDown: 1,
    },
    transformMove: { name: '磁暴轰击', t: 'STEEL', p: 105, pp: 5, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_bari: {
    id: 'df_bari', name: '屏障果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '展开绝对防御屏障，物理伤害大幅减少，反弹部分伤害',
    duration: 5,
    transform: {
      defMult: 1.7, reflectPhysical: 0.25, spdMult: 0.9,
    },
    transformMove: { name: '壁垒压制', t: 'PSYCHIC', p: 80, pp: 8, acc: 100, isFruitMove: true },
  },
  df_wara: {
    id: 'df_wara', name: '草草果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '操控稻草进行攻击，草系增伤，每回合少量恢复',
    duration: 5,
    transform: {
      atkMult: 1.25, healPerTurn: 0.06, typeBoost: { GRASS: 1.4 },
    },
    transformMove: { name: '稻草铡刀', t: 'GRASS', p: 85, pp: 8, acc: 100, isFruitMove: true },
  },
  df_horu: {
    id: 'df_horu', name: '荷尔蒙果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '注入荷尔蒙激发潜能，全属性中等提升并附带状态治疗',
    duration: 4,
    transform: {
      atkMult: 1.25, defMult: 1.25, spdMult: 1.25, cureStatus: true,
    },
    transformMove: { name: '治愈荷尔蒙', t: 'NORMAL', p: 90, pp: 6, acc: 100, isFruitMove: true },
  },
  df_gasu: {
    id: 'df_gasu', name: '瓦斯果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '释放有毒瓦斯，降低对手命中率，攻击附带中毒',
    duration: 5,
    transform: {
      sAtkMult: 1.15, enemyAccDown: 1, onHitPoison: 0.3,
    },
    transformMove: { name: '毒气爆炸', t: 'POISON', p: 75, pp: 10, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.5, target: 'enemy' } },
  },

  // ===================== 动物系 (17种) =====================
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
      spdMult: 1.5, atkMult: 1.3,
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
      sAtkMult: 1.5, spdMult: 1.2,
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
      spdMult: 1.5, atkMult: 1.2, critBoost: 2,
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
  df_ryu_triceratops: {
    id: 'df_ryu_triceratops', name: '龙龙果实·三角龙形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '化身远古三角龙，物防极高，反弹物理伤害，强力冲撞',
    duration: 3,
    transform: {
      defMult: 1.7, atkMult: 1.3, reflectPhysical: 0.3,
    },
    transformMove: { name: '三角猛冲', t: 'ROCK', p: 135, pp: 3, acc: 85, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 2, target: 'enemy', chance: 0.4 } },
  },
  df_kumo_spider: {
    id: 'df_kumo_spider', name: '蜘蛛果实·络新妇形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身巨型蜘蛛，织网降速，攻击附带毒素并可束缚',
    duration: 4,
    transform: {
      sAtkMult: 1.35, spdMult: 1.2, enemySpdDown: 2, onHitPoison: 0.35,
    },
    transformMove: { name: '蛛网毒牙', t: 'BUG', p: 90, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.5, target: 'enemy' } },
  },
  df_wani_croc: {
    id: 'df_wani_croc', name: '鳄鱼果实·远古鳄形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身远古鳄鱼，物攻物防均衡提升，咬击附带降防',
    duration: 5,
    transform: {
      atkMult: 1.35, defMult: 1.35,
    },
    transformMove: { name: '远古噬咬', t: 'WATER', p: 95, pp: 6, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.4 } },
  },
  df_taka_hawk: {
    id: 'df_taka_hawk', name: '鸟鸟果实·隼形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身猛禽隼，速度极大提升，飞行系技能增伤',
    duration: 4,
    transform: {
      spdMult: 1.5, atkMult: 1.2, typeBoost: { FLYING: 1.5 },
    },
    transformMove: { name: '疾风猛禽', t: 'FLYING', p: 90, pp: 6, acc: 100, isFruitMove: true },
  },
  df_kame_turtle: {
    id: 'df_kame_turtle', name: '龟龟果实·玄武形态', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身玄武巨龟，物防特防大增，回复少量HP',
    duration: 6,
    transform: {
      defMult: 1.5, sDefMult: 1.5, healPerTurn: 0.05, spdMult: 0.7,
    },
    transformMove: { name: '玄武壁垒', t: 'WATER', p: 70, pp: 10, acc: 100, isFruitMove: true },
  },

  // ===================== 自然系 (17种) =====================
  df_magu: {
    id: 'df_magu', name: '岩浆果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为岩浆，火系技能威力翻倍，灼伤概率100%',
    duration: 3,
    transform: {
      typeBoost: { FIRE: 1.5 },
      onHitBurn: 0.5, defMult: 1.2,
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
      typeBoost: { ICE: 1.5 },
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
      spdMult: 1.5, firstStrike: true,
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
      spdMult: 1.5, sAtkMult: 1.3,
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
  df_numa: {
    id: 'df_numa', name: '沼沼果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为无底沼泽，吞噬敌方攻击恢复HP，降低命中',
    duration: 4,
    transform: {
      defMult: 1.3, hpDrain: 0.15, enemyAccDown: 2,
    },
    transformMove: { name: '无底沼泽', t: 'GROUND', p: 95, pp: 6, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy', chance: 0.5 } },
  },
  df_kaze: {
    id: 'df_kaze', name: '风风果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为狂风，速度提升，飞行系增伤，每回合降低敌方攻击',
    duration: 4,
    transform: {
      spdMult: 1.5, typeBoost: { FLYING: 1.5 }, enemyAtkDown: 1,
    },
    transformMove: { name: '暴风绝断', t: 'FLYING', p: 110, pp: 4, acc: 90, isFruitMove: true },
  },
  df_tsuchi: {
    id: 'df_tsuchi', name: '土土果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为大地，地面系增伤，物防极高，岩石系免疫',
    duration: 5,
    transform: {
      defMult: 1.5, atkMult: 1.2, typeBoost: { GROUND: 1.4 }, typeImmune: 'ROCK',
    },
    transformMove: { name: '大地粉碎', t: 'GROUND', p: 90, pp: 6, acc: 95, isFruitMove: true },
  },
  df_kusa: {
    id: 'df_kusa', name: '森森果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为森林，草系增伤，每回合回复HP，降低对手速度',
    duration: 5,
    transform: {
      sAtkMult: 1.3, healPerTurn: 0.1, typeBoost: { GRASS: 1.4 }, enemySpdDown: 1,
    },
    transformMove: { name: '森罗万象', t: 'GRASS', p: 90, pp: 6, acc: 95, isFruitMove: true },
  },
  df_plasma: {
    id: 'df_plasma', name: '等离子果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为等离子态，无视部分防御，电系技能威力翻倍',
    duration: 3,
    transform: {
      sAtkMult: 1.5, ignoreDefPercent: 0.15, typeBoost: { ELECTRIC: 1.5 },
    },
    transformMove: { name: '等离子轰击', t: 'ELECTRIC', p: 140, pp: 3, acc: 85, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PAR', chance: 0.5, target: 'enemy' } },
  },
  df_jimen: {
    id: 'df_jimen', name: '磁暴果实', category: 'LOGIA', rarity: 'COMMON',
    desc: '释放磁暴能量，电系增伤，闪避小幅提升',
    duration: 5,
    transform: {
      sAtkMult: 1.2, typeBoost: { ELECTRIC: 1.3 }, evaBoost: 0.2,
    },
    transformMove: { name: '磁暴冲击', t: 'ELECTRIC', p: 80, pp: 8, acc: 95, isFruitMove: true },
  },

  // ===================== 新增超人系 (16种) =====================
  df_nikyu: {
    id: 'df_nikyu', name: '肉球果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '掌心肉球可弹飞一切，攻击无视闪避，将伤害弹回',
    duration: 3,
    transform: { atkMult: 1.4, ignoreEva: true, reflectAll: 0.2 },
    transformMove: { name: '熊之冲击', t: 'FIGHT', p: 130, pp: 3, acc: 100, isFruitMove: true },
  },
  df_hana: {
    id: 'df_hana', name: '花花果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '在任何表面开花出肢体，多段攻击+降对手防御',
    duration: 5,
    transform: { atkMult: 1.2, multiHit: [2, 4], onHitDefDown: 1 },
    transformMove: { name: '千紫万红', t: 'GRASS', p: 45, pp: 10, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_kilo: {
    id: 'df_kilo', name: '轻飘飘果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '自由改变体重，速度大增，攻击附带地面属性',
    duration: 5,
    transform: { spdMult: 1.4, atkMult: 1.15 },
    transformMove: { name: '万吨压顶', t: 'GROUND', p: 85, pp: 8, acc: 90, isFruitMove: true },
  },
  df_baku: {
    id: 'df_baku', name: '吞吞果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '吞噬一切物质化为己用，每次攻击回复HP',
    duration: 5,
    transform: { atkMult: 1.2, hpDrain: 0.15, defMult: 1.15 },
    transformMove: { name: '暴食吞噬', t: 'DARK', p: 80, pp: 8, acc: 100, isFruitMove: true },
  },
  df_supa: {
    id: 'df_supa', name: '快斩果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '身体可变为利刃，暴击率大增，物攻极高',
    duration: 4,
    transform: { atkMult: 1.45, critBoost: 3, spdMult: 1.1 },
    transformMove: { name: '蜘蛛斩', t: 'STEEL', p: 100, pp: 6, acc: 95, isFruitMove: true },
  },
  df_shiro: {
    id: 'df_shiro', name: '城堡果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '身体化为城堡要塞，物防特防极高但速度降低',
    duration: 5,
    transform: { defMult: 1.6, sDefMult: 1.6, spdMult: 0.7, healPerTurn: 0.05 },
    transformMove: { name: '炮台连射', t: 'STEEL', p: 85, pp: 8, acc: 90, isFruitMove: true },
  },
  df_awa: {
    id: 'df_awa', name: '泡泡果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '释放清洁泡沫，降低对手攻防',
    duration: 5,
    transform: { defMult: 1.2, enemyAtkDown: 1, onHitDefDown: 1 },
    transformMove: { name: '黄金泡沫', t: 'WATER', p: 70, pp: 10, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_mane: {
    id: 'df_mane', name: '模仿果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '模仿对手外貌，复制对手部分属性加成',
    duration: 4,
    transform: { atkMult: 1.3, defMult: 1.3, sAtkMult: 1.3, spdMult: 1.1 },
    transformMove: { name: '完美复制', t: 'NORMAL', p: 90, pp: 6, acc: 100, isFruitMove: true },
  },
  df_ori: {
    id: 'df_ori', name: '笼笼果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '制造铁笼束缚对手，降低对手速度和闪避',
    duration: 5,
    transform: { defMult: 1.2, enemySpdDown: 2 },
    transformMove: { name: '铁笼封锁', t: 'STEEL', p: 70, pp: 10, acc: 100, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy', chance: 0.6 } },
  },
  df_toge: {
    id: 'df_toge', name: '荆棘果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '全身长满荆棘，物理攻击者受到反伤',
    duration: 5,
    transform: { defMult: 1.3, reflectPhysical: 0.3, atkMult: 1.1 },
    transformMove: { name: '荆棘鞭击', t: 'GRASS', p: 85, pp: 8, acc: 95, isFruitMove: true },
  },
  df_nui: {
    id: 'df_nui', name: '缝缝果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '缝合一切伤口和裂缝，每回合大量恢复HP',
    duration: 5,
    transform: { healPerTurn: 0.12, defMult: 1.35, sDefMult: 1.35 },
    transformMove: { name: '缝合术', t: 'NORMAL', p: 75, pp: 8, acc: 100, isFruitMove: true },
  },
  df_chiyu: {
    id: 'df_chiyu', name: '治愈果实', category: 'PARAMECIA', rarity: 'LEGENDARY',
    desc: '万物治愈之力，治疗异常状态并持续回复',
    duration: 4,
    transform: { healPerTurn: 0.15, cureStatus: true, defMult: 1.3, sDefMult: 1.3 },
    transformMove: { name: '万物生息', t: 'FAIRY', p: 90, pp: 5, acc: 100, isFruitMove: true },
  },
  df_memo: {
    id: 'df_memo', name: '记忆果实', category: 'PARAMECIA', rarity: 'RARE',
    desc: '操纵记忆，降低对手命中率和攻击',
    duration: 5,
    transform: { sAtkMult: 1.2, enemyAccDown: 2, enemyAtkDown: 1 },
    transformMove: { name: '记忆消除', t: 'PSYCHIC', p: 80, pp: 8, acc: 95, isFruitMove: true },
  },
  df_guru: {
    id: 'df_guru', name: '转转果实', category: 'PARAMECIA', rarity: 'COMMON',
    desc: '高速旋转产生龙卷风，速度提升',
    duration: 5,
    transform: { spdMult: 1.35, atkMult: 1.15 },
    transformMove: { name: '旋风斩', t: 'FLYING', p: 75, pp: 10, acc: 95, isFruitMove: true },
  },
  df_gasha: {
    id: 'df_gasha', name: '扭蛋果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '将对手封入胶囊，概率降低对手全属性',
    duration: 4,
    transform: { sAtkMult: 1.3, enemySpdDown: 1, enemyAtkDown: 1 },
    transformMove: { name: '胶囊封印', t: 'PSYCHIC', p: 95, pp: 6, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_fuku: {
    id: 'df_fuku', name: '幸运果实', category: 'PARAMECIA', rarity: 'EPIC',
    desc: '幸运之力，暴击率大增且攻击回复HP',
    duration: 4,
    transform: { critBoost: 4, hpDrain: 0.1, atkMult: 1.2 },
    transformMove: { name: '幸运一击', t: 'NORMAL', p: 90, pp: 6, acc: 100, isFruitMove: true },
  },

  // ===================== 新增动物系 (16种) =====================
  df_tori_eagle: {
    id: 'df_tori_eagle', name: '鸟鸟果实·鹰形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身猎鹰，速度极快，攻击附带降速',
    duration: 4,
    transform: { spdMult: 1.5, atkMult: 1.25, onHitSpdDown: 1 },
    transformMove: { name: '鹰爪突击', t: 'FLYING', p: 95, pp: 6, acc: 100, isFruitMove: true },
  },
  df_hebi_cobra: {
    id: 'df_hebi_cobra', name: '蛇蛇果实·眼镜蛇形态', category: 'ZOAN', rarity: 'RARE',
    desc: '化身眼镜蛇，攻击必附毒，特攻提升',
    duration: 5,
    transform: { sAtkMult: 1.35, onHitPoison: 0.5, spdMult: 1.15 },
    transformMove: { name: '毒牙射击', t: 'POISON', p: 85, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.6, target: 'enemy' } },
  },
  df_mogu: {
    id: 'df_mogu', name: '鼹鼠果实', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身鼹鼠，地面系增伤，闪避提升',
    duration: 5,
    transform: { atkMult: 1.2, evaBoost: 0.25, typeBoost: { GROUND: 1.3 } },
    transformMove: { name: '掘地突袭', t: 'GROUND', p: 75, pp: 10, acc: 95, isFruitMove: true },
  },
  df_saru: {
    id: 'df_saru', name: '猿猿果实', category: 'ZOAN', rarity: 'RARE',
    desc: '化身巨猿，物攻和速度均衡提升',
    duration: 5,
    transform: { atkMult: 1.3, spdMult: 1.3, critBoost: 1 },
    transformMove: { name: '猿王铁拳', t: 'FIGHT', p: 90, pp: 6, acc: 95, isFruitMove: true },
  },
  df_kuma_bear: {
    id: 'df_kuma_bear', name: '熊熊果实', category: 'ZOAN', rarity: 'RARE',
    desc: '化身巨熊，HP和物防大增',
    duration: 5,
    transform: { hpMult: 1.25, defMult: 1.4, atkMult: 1.2 },
    transformMove: { name: '熊掌重击', t: 'NORMAL', p: 90, pp: 6, acc: 100, isFruitMove: true },
  },
  df_same_shark: {
    id: 'df_same_shark', name: '鲨鲨果实', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身大白鲨，水中增伤，攻击吸血',
    duration: 4,
    transform: { atkMult: 1.4, hpDrain: 0.15, typeBoost: { WATER: 1.5 } },
    transformMove: { name: '鲨齿撕裂', t: 'WATER', p: 100, pp: 5, acc: 95, isFruitMove: true },
  },
  df_ryu_spinosaurus: {
    id: 'df_ryu_spinosaurus', name: '龙龙果实·棘龙形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '化身远古棘龙，攻击与防御兼备的完美形态',
    duration: 3,
    transform: { atkMult: 1.45, defMult: 1.45, spdMult: 1.1 },
    transformMove: { name: '棘龙裂岩', t: 'DRAGON', p: 135, pp: 3, acc: 85, isFruitMove: true },
  },
  df_kirin: {
    id: 'df_kirin', name: '幻兽果实·麒麟形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '化身神兽麒麟，雷电缠身，全属性提升',
    duration: 3,
    transform: { atkMult: 1.35, defMult: 1.35, spdMult: 1.35, typeBoost: { ELECTRIC: 1.5 } },
    transformMove: { name: '麒麟雷鸣', t: 'ELECTRIC', p: 125, pp: 3, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PAR', chance: 0.4, target: 'enemy' } },
  },
  df_tanuki: {
    id: 'df_tanuki', name: '狸猫果实', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身狸猫，闪避和速度提升，擅长欺骗',
    duration: 5,
    transform: { evaBoost: 0.3, spdMult: 1.3, onHitConfuse: 0.2 },
    transformMove: { name: '狸猫幻术', t: 'GHOST', p: 70, pp: 10, acc: 100, isFruitMove: true },
  },
  df_usagi: {
    id: 'df_usagi', name: '兔兔果实', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身灵兔，速度极高，首回合先手',
    duration: 5,
    transform: { spdMult: 1.5, firstStrike: true, atkMult: 1.1 },
    transformMove: { name: '疾风兔踢', t: 'NORMAL', p: 75, pp: 10, acc: 100, isFruitMove: true },
  },
  df_suzume: {
    id: 'df_suzume', name: '雀雀果实·朱雀形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身传说朱雀，火系大增伤，每回合回复',
    duration: 4,
    transform: { sAtkMult: 1.4, typeBoost: { FIRE: 1.5 }, healPerTurn: 0.08 },
    transformMove: { name: '朱雀天焰', t: 'FIRE', p: 110, pp: 4, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 0.4, target: 'enemy' } },
  },
  df_batto: {
    id: 'df_batto', name: '蝙蝠果实·吸血鬼形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身吸血蝙蝠，暗系增伤，大量吸血',
    duration: 4,
    transform: { sAtkMult: 1.3, hpDrain: 0.25, spdMult: 1.2, typeBoost: { DARK: 1.4 } },
    transformMove: { name: '血族之吻', t: 'DARK', p: 95, pp: 6, acc: 95, isFruitMove: true },
  },
  df_okami: {
    id: 'df_okami', name: '幻兽果实·大神形态', category: 'ZOAN', rarity: 'LEGENDARY',
    desc: '化身日本神犬·大神，全属性加成+治愈之力',
    duration: 3,
    transform: { atkMult: 1.3, defMult: 1.3, sAtkMult: 1.3, spdMult: 1.2, healPerTurn: 0.1, cureStatus: true },
    transformMove: { name: '神威裁断', t: 'FAIRY', p: 120, pp: 4, acc: 90, isFruitMove: true },
  },
  df_shika: {
    id: 'df_shika', name: '鹿鹿果实', category: 'ZOAN', rarity: 'RARE',
    desc: '化身神鹿，速度提升，草系增伤',
    duration: 5,
    transform: { spdMult: 1.35, sAtkMult: 1.2, typeBoost: { GRASS: 1.4 }, healPerTurn: 0.06 },
    transformMove: { name: '鹿角冲刺', t: 'GRASS', p: 85, pp: 8, acc: 95, isFruitMove: true },
  },
  df_tora: {
    id: 'df_tora', name: '猫猫果实·虎形态', category: 'ZOAN', rarity: 'EPIC',
    desc: '化身白虎，物攻极高，暴击致命',
    duration: 4,
    transform: { atkMult: 1.5, critBoost: 3, spdMult: 1.2 },
    transformMove: { name: '白虎裂爪', t: 'NORMAL', p: 100, pp: 5, acc: 95, isFruitMove: true },
  },
  df_inoshishi: {
    id: 'df_inoshishi', name: '猪猪果实·野猪形态', category: 'ZOAN', rarity: 'COMMON',
    desc: '化身野猪，猛烈冲撞，物攻物防提升',
    duration: 5,
    transform: { atkMult: 1.3, defMult: 1.3, spdMult: 0.9 },
    transformMove: { name: '蛮力冲锋', t: 'FIGHT', p: 85, pp: 8, acc: 90, isFruitMove: true },
  },

  // ===================== 新增自然系 (15种) =====================
  df_suigin: {
    id: 'df_suigin', name: '水银果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为液态金属，兼具流动性和杀伤力',
    duration: 3,
    transform: { atkMult: 1.4, defMult: 1.4, onHitPoison: 0.4 },
    transformMove: { name: '水银洪流', t: 'STEEL', p: 125, pp: 3, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.5, target: 'enemy' } },
  },
  df_koutetsu: {
    id: 'df_koutetsu', name: '钢铁果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为纯钢，物防极高，钢系增伤',
    duration: 4,
    transform: { defMult: 1.6, atkMult: 1.25, typeBoost: { STEEL: 1.5 }, spdMult: 0.85 },
    transformMove: { name: '铁壁粉碎', t: 'STEEL', p: 100, pp: 5, acc: 95, isFruitMove: true },
  },
  df_acid: {
    id: 'df_acid', name: '酸酸果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为强酸，腐蚀对手防御',
    duration: 5,
    transform: { sAtkMult: 1.25, onHitDefDown: 2 },
    transformMove: { name: '强酸溶解', t: 'POISON', p: 80, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 2, target: 'enemy', chance: 0.6 } },
  },
  df_crystal: {
    id: 'df_crystal', name: '水晶果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为水晶，物防特防大增，反射光线',
    duration: 4,
    transform: { defMult: 1.5, sDefMult: 1.5, reflectAll: 0.15 },
    transformMove: { name: '水晶棱镜', t: 'ROCK', p: 95, pp: 6, acc: 90, isFruitMove: true },
  },
  df_steam: {
    id: 'df_steam', name: '蒸汽果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为高温蒸汽，灼伤概率高，闪避提升',
    duration: 5,
    transform: { evaBoost: 0.3, sAtkMult: 1.2, onHitBurn: 0.4 },
    transformMove: { name: '蒸汽喷射', t: 'WATER', p: 80, pp: 8, acc: 95, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 0.4, target: 'enemy' } },
  },
  df_star: {
    id: 'df_star', name: '星辰果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为星辰能量，特攻极高，妖精系增伤',
    duration: 3,
    transform: { sAtkMult: 1.5, typeBoost: { FAIRY: 1.5 }, spdMult: 1.3 },
    transformMove: { name: '流星风暴', t: 'FAIRY', p: 130, pp: 3, acc: 85, isFruitMove: true },
  },
  df_shadow: {
    id: 'df_shadow', name: '影影果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为影子，闪避极高，暗系增伤',
    duration: 4,
    transform: { evaBoost: 0.4, sAtkMult: 1.3, typeBoost: { DARK: 1.5 } },
    transformMove: { name: '影刃乱舞', t: 'DARK', p: 100, pp: 5, acc: 95, isFruitMove: true },
  },
  df_koori: {
    id: 'df_koori', name: '霜冻果实', category: 'LOGIA', rarity: 'COMMON',
    desc: '释放寒霜，降低对手速度和攻击',
    duration: 5,
    transform: { sAtkMult: 1.15, enemySpdDown: 1, enemyAtkDown: 1, typeBoost: { ICE: 1.2 } },
    transformMove: { name: '霜冻之息', t: 'ICE', p: 75, pp: 10, acc: 95, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy', chance: 0.5 } },
  },
  df_lava: {
    id: 'df_lava', name: '熔岩果实', category: 'LOGIA', rarity: 'RARE',
    desc: '身体化为熔岩流，火地双属性增伤',
    duration: 5,
    transform: { atkMult: 1.3, typeBoost: { FIRE: 1.3, GROUND: 1.3 }, onHitBurn: 0.25 },
    transformMove: { name: '熔岩涌流', t: 'FIRE', p: 90, pp: 6, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'BRN', chance: 0.3, target: 'enemy' } },
  },
  df_void: {
    id: 'df_void', name: '虚空果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为虚空，无视部分防御，鬼系增伤',
    duration: 3,
    transform: { sAtkMult: 1.45, ignoreDefPercent: 0.2, typeBoost: { GHOST: 1.5 } },
    transformMove: { name: '虚空吞噬', t: 'GHOST', p: 130, pp: 3, acc: 85, isFruitMove: true },
  },
  df_radium: {
    id: 'df_radium', name: '辐射果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '释放辐射能量，攻击附带持续伤害',
    duration: 4,
    transform: { sAtkMult: 1.35, dotPerTurn: 0.08, onHitPoison: 0.3 },
    transformMove: { name: '辐射爆发', t: 'POISON', p: 100, pp: 5, acc: 90, isFruitMove: true,
      effect: { type: 'STATUS', status: 'PSN', chance: 0.5, target: 'enemy' } },
  },
  df_aurora: {
    id: 'df_aurora', name: '极光果实', category: 'LOGIA', rarity: 'EPIC',
    desc: '身体化为极光，冰系妖精双增伤，美丽而致命',
    duration: 4,
    transform: { sAtkMult: 1.35, typeBoost: { ICE: 1.3, FAIRY: 1.3 }, evaBoost: 0.2 },
    transformMove: { name: '极光幕帘', t: 'ICE', p: 95, pp: 6, acc: 95, isFruitMove: true },
  },
  df_mizu: {
    id: 'df_mizu', name: '水水果实', category: 'LOGIA', rarity: 'COMMON',
    desc: '身体化为纯水，水系增伤，每回合少量回复',
    duration: 5,
    transform: { sAtkMult: 1.2, typeBoost: { WATER: 1.3 }, healPerTurn: 0.05 },
    transformMove: { name: '水柱冲击', t: 'WATER', p: 75, pp: 10, acc: 100, isFruitMove: true },
  },
  df_quake: {
    id: 'df_quake', name: '地裂果实', category: 'LOGIA', rarity: 'RARE',
    desc: '引发地壳震动，地面系增伤，有概率令对手畏缩',
    duration: 5,
    transform: { atkMult: 1.3, typeBoost: { GROUND: 1.4 }, onHitDefDown: 1 },
    transformMove: { name: '地裂天崩', t: 'GROUND', p: 90, pp: 6, acc: 90, isFruitMove: true,
      effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy', chance: 0.4 } },
  },
  df_cosmic: {
    id: 'df_cosmic', name: '宇宙果实', category: 'LOGIA', rarity: 'LEGENDARY',
    desc: '身体化为宇宙能量，超能力系增伤，全维度压制',
    duration: 3,
    transform: { sAtkMult: 1.5, sDefMult: 1.3, typeBoost: { PSYCHIC: 1.5 }, ignoreDefPercent: 0.1 },
    transformMove: { name: '星陨灭世', t: 'PSYCHIC', p: 135, pp: 3, acc: 85, isFruitMove: true },
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
  df_gomu:            { bg: 'linear-gradient(135deg, #E53935, #FF8A80)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%)', symbol: '🥊', symbolColor: '#fff' },
  df_gura:            { bg: 'linear-gradient(135deg, #6A1B9A, #CE93D8)', pattern: 'repeating-conic-gradient(#6A1B9A 0% 25%, transparent 0% 50%) 50% / 12px 12px', symbol: '💥', symbolColor: '#fff' },
  df_ope:             { bg: 'linear-gradient(135deg, #1565C0, #90CAF9)', pattern: 'radial-gradient(circle, rgba(255,255,255,0.3) 30%, transparent 70%)', symbol: '🔮', symbolColor: '#fff' },
  df_ito:             { bg: 'linear-gradient(135deg, #F06292, #FCE4EC)', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 5px)', symbol: '🕸️', symbolColor: '#AD1457' },
  df_mochi:           { bg: 'linear-gradient(135deg, #FFB74D, #FFF3E0)', pattern: 'radial-gradient(circle at 60% 60%, rgba(255,255,255,0.5), transparent)', symbol: '🍡', symbolColor: '#E65100' },
  df_pero:            { bg: 'linear-gradient(135deg, #F48FB1, #FCE4EC)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.5), transparent)', symbol: '🍬', symbolColor: '#880E4F' },
  df_zushi:           { bg: 'linear-gradient(135deg, #5D4037, #BCAAA4)', pattern: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.3), transparent)', symbol: '⚖️', symbolColor: '#fff' },
  df_doa:             { bg: 'linear-gradient(135deg, #7E57C2, #D1C4E9)', pattern: 'linear-gradient(0deg, transparent 45%, rgba(255,255,255,0.2) 50%, transparent 55%)', symbol: '🚪', symbolColor: '#fff' },
  df_suke:            { bg: 'linear-gradient(135deg, #78909C, #B0BEC5)', pattern: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)', symbol: '👻', symbolColor: '#fff' },
  df_noro:            { bg: 'linear-gradient(135deg, #B39DDB, #EDE7F6)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🐌', symbolColor: '#4527A0' },
  df_bomu:            { bg: 'linear-gradient(135deg, #FF6F00, #FFD54F)', pattern: 'radial-gradient(circle at 50% 50%, #FF3D00 20%, transparent 60%)', symbol: '💣', symbolColor: '#fff' },
  df_sabi:            { bg: 'linear-gradient(135deg, #8D6E63, #D7CCC8)', pattern: 'repeating-conic-gradient(#795548 0% 25%, transparent 0% 50%) 50% / 8px 8px', symbol: '🔧', symbolColor: '#3E2723' },
  df_jiki:            { bg: 'linear-gradient(135deg, #1565C0, #90CAF9)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 20%, transparent 60%)', symbol: '🧲', symbolColor: '#0D47A1' },
  df_bari:            { bg: 'linear-gradient(135deg, #00BCD4, #E0F7FA)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 5px)', symbol: '🛡️', symbolColor: '#006064' },
  df_wara:            { bg: 'linear-gradient(135deg, #8BC34A, #DCEDC8)', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(139,195,74,0.2) 4px, rgba(139,195,74,0.2) 6px)', symbol: '🧸', symbolColor: '#33691E' },
  df_horu:            { bg: 'linear-gradient(135deg, #EC407A, #F8BBD0)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), transparent)', symbol: '💉', symbolColor: '#880E4F' },
  df_gasu:            { bg: 'linear-gradient(135deg, #78909C, #CFD8DC)', pattern: 'radial-gradient(circle at 50% 60%, rgba(156,39,176,0.2), transparent 60%)', symbol: '💨', symbolColor: '#37474F' },
  // === 动物系 (17) ===
  df_hito_buddha:     { bg: 'linear-gradient(135deg, #FFD700, #FFF8E1)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), transparent)', symbol: '🙏', symbolColor: '#FF6F00' },
  df_ryu_pteranodon:  { bg: 'linear-gradient(135deg, #1B5E20, #A5D6A7)', pattern: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%)', symbol: '🦕', symbolColor: '#fff' },
  df_hebi_yamata:     { bg: 'linear-gradient(135deg, #4A148C, #EA80FC)', pattern: 'repeating-linear-gradient(60deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px)', symbol: '🐍', symbolColor: '#fff' },
  df_inu_kyubi:       { bg: 'linear-gradient(135deg, #FF6D00, #FFCC80)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🦊', symbolColor: '#BF360C' },
  df_neko_leopard:    { bg: 'linear-gradient(135deg, #FF8F00, #FFE082)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(139,69,19,0.15) 4px, rgba(139,69,19,0.15) 6px)', symbol: '🐆', symbolColor: '#4E342E' },
  df_ushi_bison:      { bg: 'linear-gradient(135deg, #37474F, #B0BEC5)', pattern: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0.2), transparent)', symbol: '🐃', symbolColor: '#fff' },
  df_zou_mammoth:     { bg: 'linear-gradient(135deg, #455A64, #CFD8DC)', pattern: 'radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0.15), transparent)', symbol: '🐘', symbolColor: '#fff' },
  df_tori_phoenix:    { bg: 'linear-gradient(135deg, #FF6D00, #FFAB40)', pattern: 'radial-gradient(circle at 50% 30%, #FFD740, transparent 60%)', symbol: '🔥', symbolColor: '#BF360C' },
  df_mushi_kabutomushi: { bg: 'linear-gradient(135deg, #827717, #E6EE9C)', pattern: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🪲', symbolColor: '#33691E' },
  df_uo_seiryu:       { bg: 'linear-gradient(135deg, #0D47A1, #42A5F5)', pattern: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px)', symbol: '🐲', symbolColor: '#E3F2FD' },
  df_uma:             { bg: 'linear-gradient(135deg, #1A237E, #7986CB)', pattern: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.1) 60%)', symbol: '🐴', symbolColor: '#C5CAE9' },
  df_inu_wolf:        { bg: 'linear-gradient(135deg, #37474F, #607D8B)', pattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent)', symbol: '🐺', symbolColor: '#ECEFF1' },
  df_ryu_triceratops: { bg: 'linear-gradient(135deg, #4E342E, #A1887F)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 20%, transparent)', symbol: '🦏', symbolColor: '#FFD54F' },
  df_kumo_spider:     { bg: 'linear-gradient(135deg, #4A148C, #9C27B0)', pattern: 'repeating-linear-gradient(60deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 5px)', symbol: '🕷️', symbolColor: '#CE93D8' },
  df_wani_croc:       { bg: 'linear-gradient(135deg, #2E7D32, #81C784)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(0,0,0,0.08) 5px, rgba(0,0,0,0.08) 7px)', symbol: '🐊', symbolColor: '#1B5E20' },
  df_taka_hawk:       { bg: 'linear-gradient(135deg, #5D4037, #D7CCC8)', pattern: 'radial-gradient(circle at 60% 30%, rgba(255,255,255,0.3), transparent)', symbol: '🦅', symbolColor: '#fff' },
  df_kame_turtle:     { bg: 'linear-gradient(135deg, #00695C, #80CBC4)', pattern: 'radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0.15), transparent)', symbol: '🐢', symbolColor: '#E0F2F1' },
  // === 自然系 (17) ===
  df_magu:            { bg: 'linear-gradient(135deg, #B71C1C, #FF5722)', pattern: 'radial-gradient(circle at 60% 70%, #FF3D00, transparent 50%)', symbol: '☄️', symbolColor: '#FFD600' },
  df_yami:            { bg: 'linear-gradient(135deg, #212121, #424242)', pattern: 'radial-gradient(circle at 50% 50%, #000 20%, transparent 60%)', symbol: '🌑', symbolColor: '#9C27B0' },
  df_hie:             { bg: 'linear-gradient(135deg, #0097A7, #E0F7FA)', pattern: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.6), transparent)', symbol: '🧊', symbolColor: '#006064' },
  df_goro:            { bg: 'linear-gradient(135deg, #F9A825, #FFF9C4)', pattern: 'linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.5) 42%, transparent 44%)', symbol: '⚡', symbolColor: '#E65100' },
  df_pika:            { bg: 'linear-gradient(135deg, #FFD600, #FFFDE7)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 20%, transparent 50%)', symbol: '✨', symbolColor: '#FF6F00' },
  df_moku:            { bg: 'linear-gradient(135deg, #78909C, #CFD8DC)', pattern: 'radial-gradient(circle at 50% 60%, rgba(255,255,255,0.3), transparent 60%)', symbol: '🌫️', symbolColor: '#37474F' },
  df_suna:            { bg: 'linear-gradient(135deg, #F9A825, #D7CCC8)', pattern: 'repeating-conic-gradient(#C8A415 0% 25%, transparent 0% 50%) 50% / 6px 6px', symbol: '🏜️', symbolColor: '#4E342E' },
  df_mera:            { bg: 'linear-gradient(135deg, #D50000, #FF8A65)', pattern: 'radial-gradient(circle at 50% 70%, #FF6D00, transparent 60%)', symbol: '🔥', symbolColor: '#FFD600' },
  df_yuki:            { bg: 'linear-gradient(135deg, #E1F5FE, #fff)', pattern: 'radial-gradient(circle at 30% 30%, rgba(100,181,246,0.3), transparent 50%)', symbol: '⛄', symbolColor: '#0277BD' },
  df_doku:            { bg: 'linear-gradient(135deg, #7B1FA2, #CE93D8)', pattern: 'radial-gradient(circle at 40% 60%, rgba(255,255,255,0.2), transparent)', symbol: '☠️', symbolColor: '#E1BEE7' },
  df_beta:            { bg: 'linear-gradient(135deg, #689F38, #C5E1A5)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 30%, transparent)', symbol: '🫠', symbolColor: '#33691E' },
  df_numa:            { bg: 'linear-gradient(135deg, #3E2723, #795548)', pattern: 'radial-gradient(circle at 50% 70%, rgba(0,0,0,0.3), transparent 60%)', symbol: '🌿', symbolColor: '#BCAAA4' },
  df_kaze:            { bg: 'linear-gradient(135deg, #B3E5FC, #E1F5FE)', pattern: 'repeating-conic-gradient(rgba(3,169,244,0.1) 0% 25%, transparent 0% 50%) 50% / 10px 10px', symbol: '🌪️', symbolColor: '#0277BD' },
  df_tsuchi:          { bg: 'linear-gradient(135deg, #6D4C41, #D7CCC8)', pattern: 'repeating-conic-gradient(#5D4037 0% 25%, transparent 0% 50%) 50% / 8px 8px', symbol: '🪨', symbolColor: '#3E2723' },
  df_kusa:            { bg: 'linear-gradient(135deg, #2E7D32, #A5D6A7)', pattern: 'radial-gradient(circle at 40% 50%, rgba(255,255,255,0.3), transparent 60%)', symbol: '🌳', symbolColor: '#1B5E20' },
  df_plasma:          { bg: 'linear-gradient(135deg, #311B92, #7C4DFF)', pattern: 'radial-gradient(circle at 50% 50%, #B388FF 15%, transparent 50%)', symbol: '🔆', symbolColor: '#E8EAF6' },
  df_jimen:           { bg: 'linear-gradient(135deg, #0288D1, #81D4FA)', pattern: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 5px)', symbol: '🌊', symbolColor: '#01579B' },
  // === 新增超人系 ===
  df_nikyu:            { bg: 'linear-gradient(135deg, #E91E63, #F8BBD0)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5) 15%, transparent 40%)', symbol: '🐾', symbolColor: '#fff' },
  df_hana:             { bg: 'linear-gradient(135deg, #E91E63, #FCE4EC)', pattern: 'radial-gradient(circle at 30% 60%, rgba(255,255,255,0.4), transparent)', symbol: '🌸', symbolColor: '#AD1457' },
  df_kilo:             { bg: 'linear-gradient(135deg, #90CAF9, #E3F2FD)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5), transparent)', symbol: '🪶', symbolColor: '#1565C0' },
  df_baku:             { bg: 'linear-gradient(135deg, #5D4037, #A1887F)', pattern: 'radial-gradient(circle at 60% 50%, rgba(0,0,0,0.3), transparent 60%)', symbol: '🫧', symbolColor: '#fff' },
  df_supa:             { bg: 'linear-gradient(135deg, #546E7A, #CFD8DC)', pattern: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.5) 42%, transparent 44%)', symbol: '🗡️', symbolColor: '#263238' },
  df_shiro:            { bg: 'linear-gradient(135deg, #795548, #D7CCC8)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 7px)', symbol: '🏰', symbolColor: '#3E2723' },
  df_awa:              { bg: 'linear-gradient(135deg, #80DEEA, #E0F7FA)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 50%)', symbol: '🫧', symbolColor: '#006064' },
  df_mane:             { bg: 'linear-gradient(135deg, #78909C, #ECEFF1)', pattern: 'linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)', symbol: '🎭', symbolColor: '#37474F' },
  df_ori:              { bg: 'linear-gradient(135deg, #455A64, #90A4AE)', pattern: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 6px)', symbol: '⛓️', symbolColor: '#fff' },
  df_toge:             { bg: 'linear-gradient(135deg, #33691E, #AED581)', pattern: 'repeating-conic-gradient(#33691E 0% 25%, transparent 0% 50%) 50% / 8px 8px', symbol: '🌵', symbolColor: '#1B5E20' },
  df_nui:              { bg: 'linear-gradient(135deg, #F48FB1, #FCE4EC)', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(233,30,99,0.1) 3px, rgba(233,30,99,0.1) 5px)', symbol: '🧵', symbolColor: '#880E4F' },
  df_chiyu:            { bg: 'linear-gradient(135deg, #66BB6A, #C8E6C9)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 20%, transparent 50%)', symbol: '💚', symbolColor: '#1B5E20' },
  df_memo:             { bg: 'linear-gradient(135deg, #7E57C2, #D1C4E9)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🧠', symbolColor: '#311B92' },
  df_guru:             { bg: 'linear-gradient(135deg, #26C6DA, #E0F7FA)', pattern: 'repeating-conic-gradient(rgba(0,188,212,0.2) 0% 25%, transparent 0% 50%) 50% / 10px 10px', symbol: '🌀', symbolColor: '#006064' },
  df_gasha:            { bg: 'linear-gradient(135deg, #FF7043, #FFCCBC)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 25%, transparent 50%)', symbol: '🎰', symbolColor: '#BF360C' },
  df_fuku:             { bg: 'linear-gradient(135deg, #FFD700, #FFF8E1)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), transparent)', symbol: '🍀', symbolColor: '#F57F17' },
  // === 新增动物系 ===
  df_tori_eagle:       { bg: 'linear-gradient(135deg, #4E342E, #BCAAA4)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3), transparent)', symbol: '🦅', symbolColor: '#3E2723' },
  df_hebi_cobra:       { bg: 'linear-gradient(135deg, #1B5E20, #81C784)', pattern: 'repeating-linear-gradient(60deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 5px)', symbol: '🐍', symbolColor: '#fff' },
  df_mogu:              { bg: 'linear-gradient(135deg, #6D4C41, #BCAAA4)', pattern: 'radial-gradient(ellipse at 50% 70%, rgba(0,0,0,0.2), transparent)', symbol: '🦫', symbolColor: '#3E2723' },
  df_saru:              { bg: 'linear-gradient(135deg, #E65100, #FFCC80)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🦍', symbolColor: '#BF360C' },
  df_kuma_bear:         { bg: 'linear-gradient(135deg, #3E2723, #8D6E63)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent)', symbol: '🐻', symbolColor: '#D7CCC8' },
  df_same_shark:        { bg: 'linear-gradient(135deg, #0D47A1, #42A5F5)', pattern: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.2) 60%)', symbol: '🦈', symbolColor: '#E3F2FD' },
  df_ryu_spinosaurus:   { bg: 'linear-gradient(135deg, #BF360C, #FF8A65)', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 6px)', symbol: '🦖', symbolColor: '#fff' },
  df_kirin:             { bg: 'linear-gradient(135deg, #F9A825, #FFFDE7)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.6), transparent 60%)', symbol: '⚡', symbolColor: '#E65100' },
  df_tanuki:            { bg: 'linear-gradient(135deg, #8D6E63, #D7CCC8)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)', symbol: '🦝', symbolColor: '#3E2723' },
  df_usagi:             { bg: 'linear-gradient(135deg, #F8BBD0, #FCE4EC)', pattern: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.5), transparent)', symbol: '🐇', symbolColor: '#AD1457' },
  df_suzume:            { bg: 'linear-gradient(135deg, #C62828, #EF5350)', pattern: 'radial-gradient(circle at 50% 30%, #FF8A00, transparent 60%)', symbol: '🦚', symbolColor: '#FFD600' },
  df_batto:             { bg: 'linear-gradient(135deg, #1A237E, #5C6BC0)', pattern: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.4), transparent 60%)', symbol: '🦇', symbolColor: '#C5CAE9' },
  df_okami:             { bg: 'linear-gradient(135deg, #FFD700, #FFF8E1)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.7), transparent)', symbol: '🐕', symbolColor: '#F57F17' },
  df_shika:             { bg: 'linear-gradient(135deg, #558B2F, #AED581)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent)', symbol: '🦌', symbolColor: '#1B5E20' },
  df_tora:              { bg: 'linear-gradient(135deg, #E65100, #FF9800)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 6px)', symbol: '🐯', symbolColor: '#fff' },
  df_inoshishi:         { bg: 'linear-gradient(135deg, #4E342E, #A1887F)', pattern: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0.2), transparent)', symbol: '🐗', symbolColor: '#D7CCC8' },
  // === 新增自然系 ===
  df_suigin:            { bg: 'linear-gradient(135deg, #78909C, #ECEFF1)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 15%, transparent 50%)', symbol: '🪩', symbolColor: '#37474F' },
  df_koutetsu:          { bg: 'linear-gradient(135deg, #455A64, #B0BEC5)', pattern: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 42%, transparent 44%)', symbol: '⚙️', symbolColor: '#263238' },
  df_acid:              { bg: 'linear-gradient(135deg, #76FF03, #CCFF90)', pattern: 'radial-gradient(circle at 60% 60%, rgba(0,100,0,0.3), transparent)', symbol: '☣️', symbolColor: '#1B5E20' },
  df_crystal:           { bg: 'linear-gradient(135deg, #CE93D8, #F3E5F5)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 50%)', symbol: '💎', symbolColor: '#6A1B9A' },
  df_steam:             { bg: 'linear-gradient(135deg, #90A4AE, #ECEFF1)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.5), transparent 60%)', symbol: '♨️', symbolColor: '#37474F' },
  df_star:              { bg: 'linear-gradient(135deg, #1A237E, #7C4DFF)', pattern: 'radial-gradient(circle at 50% 50%, #FFD600 10%, transparent 40%)', symbol: '⭐', symbolColor: '#FFD600' },
  df_shadow:            { bg: 'linear-gradient(135deg, #212121, #616161)', pattern: 'radial-gradient(circle at 50% 50%, #000 25%, transparent 60%)', symbol: '👤', symbolColor: '#9E9E9E' },
  df_koori:             { bg: 'linear-gradient(135deg, #B3E5FC, #E1F5FE)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5), transparent 50%)', symbol: '❄️', symbolColor: '#0277BD' },
  df_lava:              { bg: 'linear-gradient(135deg, #D84315, #FF8A65)', pattern: 'radial-gradient(circle at 50% 70%, #FF3D00, transparent 50%)', symbol: '🌋', symbolColor: '#FFD600' },
  df_void:              { bg: 'linear-gradient(135deg, #000, #311B92)', pattern: 'radial-gradient(circle at 50% 50%, #7C4DFF 10%, transparent 50%)', symbol: '🕳️', symbolColor: '#B388FF' },
  df_radium:            { bg: 'linear-gradient(135deg, #76FF03, #1B5E20)', pattern: 'radial-gradient(circle at 50% 50%, rgba(118,255,3,0.4) 20%, transparent 50%)', symbol: '☢️', symbolColor: '#FFD600' },
  df_aurora:            { bg: 'linear-gradient(135deg, #00BCD4, #E040FB)', pattern: 'linear-gradient(180deg, rgba(0,188,212,0.3), rgba(224,64,251,0.3))', symbol: '🌈', symbolColor: '#fff' },
  df_mizu:              { bg: 'linear-gradient(135deg, #0288D1, #81D4FA)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), transparent)', symbol: '💧', symbolColor: '#01579B' },
  df_quake:             { bg: 'linear-gradient(135deg, #795548, #D7CCC8)', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 5px)', symbol: '🌍', symbolColor: '#3E2723' },
  df_cosmic:            { bg: 'linear-gradient(135deg, #0D47A1, #1A237E)', pattern: 'radial-gradient(circle at 30% 30%, #fff 2%, transparent 3%), radial-gradient(circle at 70% 60%, #fff 1%, transparent 2%)', symbol: '🌌', symbolColor: '#B388FF' },
};

export function getFruitIcon(fruitId) {
  return FRUIT_ICONS[fruitId] || { bg: 'linear-gradient(135deg, #666, #999)', pattern: '', symbol: '?', symbolColor: '#fff' };
}

const W = 'https://static.wikia.nocookie.net/onepiece/images';
export const FRUIT_IMAGE_URLS = {
  df_gomu: `${W}/1/12/Gomu_Gomu_no_Mi_Infobox.png/revision/latest?cb=20221108072550`,
  df_gura: `${W}/e/e3/Gura_Gura_no_Mi_Infobox.png/revision/latest?cb=20251002184350`,
  df_ope: `${W}/0/0e/Ope_Ope_no_Mi_Infobox.png/revision/latest?cb=20210409181034`,
  df_ito: `${W}/a/ae/Ito_Ito_no_Mi_Infobox.png/revision/latest?cb=20151220070449`,
  df_mochi: `${W}/2/2c/Mochi_Mochi_no_Mi_Infobox.png/revision/latest?cb=20250826143835`,
  df_pero: `${W}/7/77/Pero_Pero_no_Mi_Infobox.png/revision/latest?cb=20230707021540`,
  df_zushi: `${W}/b/ba/Zushi_Zushi_no_Mi_Infobox.png/revision/latest?cb=20230320032400`,
  df_doa: `${W}/0/04/Doa_Doa_no_Mi_Infobox.png/revision/latest?cb=20230117020238`,
  df_suke: `${W}/b/bb/Suke_Suke_no_Mi_Infobox.png/revision/latest?cb=20200112035251`,
  df_noro: `${W}/7/7a/Noro_Noro_no_Mi_Infobox.png/revision/latest?cb=20230516224102`,
  df_bomu: `${W}/1/1a/Bomu_Bomu_no_Mi_Infobox.png/revision/latest?cb=20210204030003`,
  df_sabi: `${W}/7/7c/Sabi_Sabi_no_Mi_Infobox.png/revision/latest?cb=20160708014101`,
  df_jiki: `${W}/1/13/Jiki_Jiki_no_Mi_Infobox.png/revision/latest?cb=20260316222052`,
  df_bari: `${W}/d/de/Bari_Bari_no_Mi_Infobox.png/revision/latest?cb=20160212174221`,
  df_wara: `${W}/b/b4/Wara_Wara_no_Mi_Infobox.png/revision/latest?cb=20180803070246`,
  df_horu: `${W}/5/53/Horu_Horu_no_Mi_Infobox.png/revision/latest?cb=20231111060110`,
  df_gasu: `${W}/c/cf/Gasu_Gasu_no_Mi_Infobox.png/revision/latest?cb=20230902035324`,
  df_nikyu: `${W}/e/e4/Nikyu_Nikyu_no_Mi_Infobox.png/revision/latest?cb=20250525161631`,
  df_hana: `${W}/2/21/Hana_Hana_no_Mi_Infobox.png/revision/latest?cb=20191228120242`,
  df_baku: `${W}/c/c6/Baku_Baku_no_Mi_Infobox.png/revision/latest?cb=20250826143858`,
  df_supa: `${W}/f/f9/Supa_Supa_no_Mi_Infobox.png/revision/latest?cb=20240605221022`,
  df_shiro: `${W}/e/e8/Shiro_Shiro_no_Mi_Infobox.png/revision/latest?cb=20160115065100`,
  df_awa: `${W}/5/51/Awa_Awa_no_Mi_Infobox.png/revision/latest?cb=20240612220456`,
  df_mane: `${W}/1/12/Mane_Mane_no_Mi_Infobox.png/revision/latest?cb=20240605221030`,
  df_ori: `${W}/7/7a/Ori_Ori_no_Mi_Infobox.png/revision/latest?cb=20231125033554`,
  df_toge: `${W}/e/ee/Toge_Toge_no_Mi_Infobox.png/revision/latest?cb=20230120173638`,
  df_nui: `${W}/0/00/Nui_Nui_no_Mi_Infobox.png/revision/latest?cb=20241129154842`,
  df_chiyu: `${W}/b/b2/Chiyu_Chiyu_no_Mi_Infobox.png/revision/latest?cb=20151129192854`,
  df_memo: `${W}/c/c0/Memo_Memo_no_Mi_Infobox.png/revision/latest?cb=20171217105138`,
  df_guru: `${W}/0/0a/Guru_Guru_no_Mi_Infobox.png/revision/latest?cb=20230825080411`,
  df_hito_buddha: `${W}/4/45/Hito_Hito_no_Mi%2C_Model_Daibutsu_Infobox.png/revision/latest?cb=20240813213645`,
  df_ryu_pteranodon: `${W}/9/96/Ryu_Ryu_no_Mi%2C_Model_Pteranodon_Beast_Form.png/revision/latest?cb=20220418123709`,
  df_hebi_yamata: `${W}/3/3e/Hebi_Hebi_no_Mi%2C_Model_Yamata_no_Orochi_Infobox.png/revision/latest?cb=20210307032049`,
  df_inu_kyubi: `${W}/4/4d/Inu_Inu_no_Mi%2C_Model_Kyubi_no_Kitsune_Infobox.png/revision/latest?cb=20210717170215`,
  df_neko_leopard: `${W}/9/98/Neko_Neko_no_Mi%2C_Model_Leopard_Infobox.png/revision/latest?cb=20230306213909`,
  df_ushi_bison: `${W}/b/bf/Ushi_Ushi_no_Mi%2C_Model_Bison_Infobox.png/revision/latest?cb=20220408131623`,
  df_zou_mammoth: `${W}/c/c9/Zou_Zou_no_Mi_Infobox.png/revision/latest?cb=20250301182649`,
  df_tori_phoenix: `${W}/5/51/Tori_Tori_no_Mi%2C_Model_Phoenix_Infobox.png/revision/latest?cb=20251002184357`,
  df_mushi_kabutomushi: `${W}/c/ce/Mushi_Mushi_no_Mi%2C_Model_Kabutomushi_Infobox.png/revision/latest?cb=20141006011335`,
  df_uo_seiryu: `${W}/f/f9/Uo_Uo_no_Mi%2C_Model_Seiryu_Infobox.png/revision/latest?cb=20211204205430`,
  df_uma: `${W}/3/39/Uma_Uma_no_Mi_Infobox.png/revision/latest?cb=20220713111132`,
  df_inu_wolf: `${W}/c/cf/Inu_Inu_no_Mi%2C_Model_Wolf_Hybrid_Form.png/revision/latest?cb=20250314202926`,
  df_ryu_triceratops: `${W}/5/58/Ryu_Ryu_no_Mi%2C_Model_Triceratops_Beast_Form.png/revision/latest?cb=20220529042151`,
  df_kumo_spider: `${W}/7/7c/Kumo_Kumo_no_Mi_Model_Rosamygale_Grauvogeli_Infobox.png/revision/latest?cb=20230818050241`,
  df_taka_hawk: `${W}/e/ea/Tori_Tori_no_Mi%2C_Model_Falcon_Beast_Form.png/revision/latest?cb=20230916035747`,
  df_kame_turtle: `${W}/7/74/Kame_Kame_no_Mi_Infobox.png/revision/latest?cb=20160120235204`,
  df_magu: `${W}/0/07/Magu_Magu_no_Mi_Infobox.png/revision/latest?cb=20231013044624`,
  df_yami: `${W}/f/f5/Yami_Yami_no_Mi_Infobox.png/revision/latest?cb=20240627010252`,
  df_hie: `${W}/5/56/Hie_Hie_no_Mi_Infobox.png/revision/latest?cb=20221101155813`,
  df_goro: `${W}/d/d2/Goro_Goro_no_Mi_Infobox.png/revision/latest?cb=20230907005154`,
  df_pika: `${W}/6/66/Pika_Pika_no_Mi_Infobox.png/revision/latest?cb=20250501014523`,
  df_moku: `${W}/8/8d/Moku_Moku_no_Mi_Infobox.png/revision/latest?cb=20250826143852`,
  df_suna: `${W}/7/7d/Suna_Suna_no_Mi_Infobox.png/revision/latest?cb=20220408131752`,
  df_mera: `${W}/8/8c/Mera_Mera_no_Mi_Infobox.png/revision/latest?cb=20240710204632`,
  df_yuki: `${W}/a/a9/Yuki_Yuki_no_Mi_Infobox.png/revision/latest?cb=20240221181209`,
  df_doku: `${W}/2/21/Doku_Doku_no_Mi_Infobox.png/revision/latest?cb=20160129102538`,
  df_beta: `${W}/d/d9/Beta_Beta_no_Mi_Infobox.png/revision/latest?cb=20231017083240`,
  df_numa: `${W}/d/d3/Numa_Numa_no_Mi_Infobox.png/revision/latest?cb=20230715142546`,
};
