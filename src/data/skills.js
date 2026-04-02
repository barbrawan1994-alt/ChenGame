// ==========================================
// [重构] 全属性技能库 (每系 8-10 个，含威力与PP)
// ==========================================
const SKILL_DB = {
  NORMAL: [
    { name: '撞击', p: 40, pp: 35 }, 
    { name: '电光一闪', p: 40, pp: 30 }, 
    { name: '劈开', p: 70, pp: 20 },
    { name: '必杀门牙', p: 80, pp: 15 }, 
    { name: '猛撞', p: 90, pp: 20 }, 
    { name: '巨声', p: 90, pp: 10 },
    { name: '舍身冲撞', p: 120, pp: 15 }, 
    { name: '破坏死光', p: 150, pp: 5 }, 
    { name: '终极冲击', p: 150, pp: 5 },
    { name: '大爆炸', p: 250, pp: 1 }
  ],
  FIRE: [
    { name: '火花', p: 40, pp: 25 }, 
    { name: '火焰轮', p: 60, pp: 25 }, 
    { name: '火焰拳', p: 75, pp: 15 },
    { name: '喷射火焰', p: 90, pp: 15 }, 
    { name: '热风', p: 95, pp: 10 }, 
    { name: '大字爆炎', p: 110, pp: 5 },
    { name: '闪焰冲锋', p: 120, pp: 15 }, 
    { name: '过热', p: 130, pp: 5 }, 
    { name: '爆裂燃烧', p: 150, pp: 5 },
    { name: 'V热焰', p: 180, pp: 5 }
  ],
  WATER: [
    { name: '水枪', p: 40, pp: 25 }, 
    { name: '泡沫光线', p: 65, pp: 20 }, 
    { name: '水流裂破', p: 85, pp: 10 },
    { name: '冲浪', p: 90, pp: 15 }, 
    { name: '浊流', p: 90, pp: 10 }, 
    { name: '水炮', p: 110, pp: 5 },
    { name: '高压水泵', p: 110, pp: 5 }, 
    { name: '海啸', p: 120, pp: 5 }, 
    { name: '加农水炮', p: 150, pp: 5 },
    { name: '根源波动', p: 110, pp: 10 } // 盖欧卡专属
  ],
  GRASS: [
    { name: '藤鞭', p: 45, pp: 25 }, 
    { name: '飞叶快刀', p: 55, pp: 25 }, 
    { name: '终极吸取', p: 75, pp: 10 },
    { name: '能量球', p: 90, pp: 10 }, 
    { name: '种子炸弹', p: 80, pp: 15 }, 
    { name: '花瓣舞', p: 120, pp: 10 },
    { name: '日光束', p: 120, pp: 10 }, 
    { name: '木槌', p: 120, pp: 15 }, 
    { name: '飞叶风暴', p: 130, pp: 5 },
    { name: '疯狂植物', p: 150, pp: 5 }
  ],
  ELECTRIC: [
    { name: '电击', p: 40, pp: 30 }, 
    { name: '电球', p: 60, pp: 20 }, 
    { name: '雷电拳', p: 75, pp: 15 },
    { name: '放电', p: 80, pp: 15 }, 
    { name: '十万伏特', p: 90, pp: 15 }, 
    { name: '打雷', p: 110, pp: 10 },
    { name: '伏特攻击', p: 120, pp: 15 }, 
    { name: '电磁炮', p: 120, pp: 5 }, 
    { name: '雷击', p: 130, pp: 5 },
    { name: '千万伏特', p: 195, pp: 1 } // 皮卡丘专属Z
  ],
  ICE: [
    { name: '冰砾', p: 40, pp: 30 }, 
    { name: '冰冻牙', p: 65, pp: 15 }, 
    { name: '极光束', p: 65, pp: 20 },
    { name: '冰柱坠击', p: 85, pp: 10 }, 
    { name: '急冻光线', p: 90, pp: 10 }, 
    { name: '冰锤', p: 100, pp: 10 },
    { name: '暴风雪', p: 110, pp: 5 }, 
    { name: '冰封世界', p: 120, pp: 5 }, 
    { name: '绝对零度', p: 200, pp: 1 }
  ],
  FIGHT: [
    { name: '碎岩', p: 40, pp: 15 }, 
    { name: '发劲', p: 60, pp: 10 }, 
    { name: '劈瓦', p: 75, pp: 15 },
    { name: '波导弹', p: 80, pp: 20 }, 
    { name: '流星拳', p: 90, pp: 10 }, 
    { name: '爆裂拳', p: 100, pp: 5 },
    { name: '近身战', p: 120, pp: 5 }, 
    { name: '真气弹', p: 120, pp: 5 }, 
    { name: '真气拳', p: 150, pp: 20 }
  ],
  POISON: [
    { name: '溶解液', p: 40, pp: 30 }, 
    { name: '毒液冲击', p: 65, pp: 10 }, 
    { name: '十字毒刃', p: 70, pp: 20 },
    { name: '毒击', p: 80, pp: 20 }, 
    { name: '污泥炸弹', p: 90, pp: 10 }, 
    { name: '污泥波', p: 95, pp: 10 },
    { name: '垃圾射击', p: 120, pp: 5 }, 
    { name: '无极光束', p: 160, pp: 5 } // 无极汰那
  ],
  GROUND: [
    { name: '泥巴射击', p: 55, pp: 15 }, 
    { name: '重踏', p: 60, pp: 20 }, 
    { name: '挖洞', p: 80, pp: 10 },
    { name: '大地之力', p: 90, pp: 10 }, 
    { name: '十万马力', p: 95, pp: 10 }, 
    { name: '地震', p: 100, pp: 10 },
    { name: '断崖之剑', p: 120, pp: 10 }, 
    { name: '地裂', p: 200, pp: 1 }
  ],
  FLYING: [
    { name: '起风', p: 40, pp: 35 }, 
    { name: '燕返', p: 60, pp: 20 }, 
    { name: '空气斩', p: 75, pp: 15 },
    { name: '钻孔啄', p: 80, pp: 20 }, 
    { name: '飞翔', p: 90, pp: 15 }, 
    { name: '暴风', p: 110, pp: 10 },
    { name: '勇鸟猛攻', p: 120, pp: 15 }, 
    { name: '神鸟特攻', p: 140, pp: 5 }, 
    { name: '画龙点睛', p: 120, pp: 5 }
  ],
  PSYCHIC: [
    { name: '念力', p: 50, pp: 25 }, 
    { name: '幻象光线', p: 65, pp: 20 }, 
    { name: '精神利刃', p: 70, pp: 20 },
    { name: '意念头锤', p: 80, pp: 15 }, 
    { name: '精神强念', p: 90, pp: 10 }, 
    { name: '食梦', p: 100, pp: 15 },
    { name: '精神击破', p: 100, pp: 10 }, 
    { name: '预知未来', p: 120, pp: 10 }, 
    { name: '棱镜镭射', p: 160, pp: 10 }
  ],
  BUG: [
    { name: '连斩', p: 40, pp: 20 }, 
    { name: '虫咬', p: 60, pp: 20 }, 
    { name: '银色旋风', p: 60, pp: 5 },
    { name: '十字剪', p: 80, pp: 15 }, 
    { name: '吸血', p: 80, pp: 10 }, 
    { name: '虫鸣', p: 90, pp: 10 },
    { name: '迎头一击', p: 90, pp: 10 }, 
    { name: '大角撞击', p: 120, pp: 10 }
  ],
  ROCK: [
    { name: '落石', p: 50, pp: 15 }, 
    { name: '原始之力', p: 60, pp: 5 }, 
    { name: '岩崩', p: 75, pp: 10 },
    { name: '力量宝石', p: 80, pp: 20 }, 
    { name: '尖石攻击', p: 100, pp: 5 }, 
    { name: '钻石风暴', p: 100, pp: 5 },
    { name: '流星光束', p: 120, pp: 10 }, 
    { name: '岩石炮', p: 150, pp: 5 }, 
    { name: '双刃头锤', p: 150, pp: 5 }
  ],
  GHOST: [
    { name: '惊吓', p: 30, pp: 15 }, 
    { name: '影子偷袭', p: 40, pp: 30 }, 
    { name: '暗影拳', p: 60, pp: 20 },
    { name: '暗影爪', p: 70, pp: 15 }, 
    { name: '暗影球', p: 80, pp: 15 }, 
    { name: '潜灵奇袭', p: 90, pp: 10 },
    { name: '暗影潜袭', p: 120, pp: 5 }, 
    { name: '星碎', p: 120, pp: 5 } // 专属
  ],
  DRAGON: [
    { name: '龙息', p: 60, pp: 20 }, 
    { name: '龙爪', p: 80, pp: 15 }, 
    { name: '龙之波动', p: 85, pp: 10 },
    { name: '龙之俯冲', p: 100, pp: 10 }, 
    { name: '亚空裂斩', p: 100, pp: 5 }, 
    { name: '巨兽斩', p: 100, pp: 5 },
    { name: '逆鳞', p: 120, pp: 10 }, 
    { name: '流星群', p: 130, pp: 5 }, 
    { name: '时光咆哮', p: 150, pp: 5 }
  ],
  STEEL: [
    { name: '子弹拳', p: 40, pp: 30 }, 
    { name: '金属爪', p: 50, pp: 35 }, 
    { name: '镜光射击', p: 65, pp: 10 },
    { name: '钢翼', p: 70, pp: 25 }, 
    { name: '铁头', p: 80, pp: 15 }, 
    { name: '彗星拳', p: 90, pp: 10 },
    { name: '铁尾', p: 100, pp: 15 }, 
    { name: '巨兽弹', p: 100, pp: 5 }, 
    { name: '破灭之愿', p: 140, pp: 5 }
  ],
  FAIRY: [
    { name: '妖精之风', p: 40, pp: 30 }, 
    { name: '魅惑之声', p: 40, pp: 15 }, 
    { name: '吸取之吻', p: 50, pp: 10 },
    { name: '魔法闪耀', p: 80, pp: 10 }, 
    { name: '嬉闹', p: 90, pp: 10 }, 
    { name: '月亮之力', p: 95, pp: 15 },
    { name: '大地掌控', p: 120, pp: 5 }, 
    { name: '星光灭绝', p: 150, pp: 5 }
  ],
  GOD: [
    { name: '神之裁决', p: 100, pp: 10 }, 
    { name: '虚空破碎', p: 120, pp: 5 }, 
    { name: '创世之光', p: 150, pp: 5 },
    { name: '维度打击', p: 180, pp: 5 }, 
    { name: '因果律', p: 200, pp: 1 }, 
    { name: '万物归零', p: 250, pp: 1 },
    { name: '宇宙大爆炸', p: 300, pp: 1 }, 
    { name: '终焉之刻', p: 999, pp: 1 }
  ],
  HEAL: [
    { name: '自我再生', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' }, 
    { name: '光合作用', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' }, 
    { name: '月光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '祈愿', p: 0, pp: 10, val: 0.5, desc: '下回合恢复50%最大HP' }, // 简化处理，暂按直接恢复
    { name: '生命水滴', p: 0, pp: 15, val: 0.25, desc: '恢复25%最大HP' }, // 这个技能原版就是25%
    { name: '晨光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '治愈波动', p: 0, pp: 10, val: 0.5, desc: '恢复目标50%最大HP' }, 
    { name: '羽栖', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' }
  ]
};
// ==========================================
// [新增] 50种 战术/状态类技能库 (无伤害，纯策略)
// ==========================================
// ==========================================
// [重构] 变化类技能库 (明确百分比与效果)
// ==========================================
const STATUS_SKILLS_DB = [
  // --- 强化自身 (Buff: +1级=+50%, +2级=+100%) ---
  { name: '剑舞', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2 }, desc: '跳起战斗之舞，物攻大幅提升(+100%)' },
  { name: '铁壁', t: 'STEEL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '皮肤硬化如铁，物防大幅提升(+100%)' },
  { name: '诡计', t: 'DARK', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 2 }, desc: '谋划计策，特攻大幅提升(+100%)' },
  { name: '健美', t: 'FIGHT', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def' }, desc: '绷紧肌肉，物攻和物防同时提升(+50%)' },
  { name: '冥想', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def' }, desc: '静心凝神，特攻和特防同时提升(+50%)' },
  { name: '高速移动', t: 'PSYCHIC', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 2 }, desc: '身体放松，速度大幅提升(+100%)' },
  { name: '龙之舞', t: 'DRAGON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'spd' }, desc: '神秘的舞蹈，物攻和速度同时提升(+50%)' },
  { name: '蝶舞', t: 'BUG', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def', stat3: 'spd' }, desc: '特攻、特防、速度全部提升(+50%)' },
  { name: '破壳', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2, stat2: 's_atk', stat3: 'spd' }, desc: '大幅提升双攻和速度(+100%)，但降低防御' },
  { name: '聚气', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'crit', val: 2 }, desc: '集中精神，暴击率大幅提升(+2级)' },
  { name: '变硬', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1 }, desc: '全身用力，物防提升(+50%)' },
  { name: '生长', t: 'GRASS', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 's_atk' }, desc: '身体变大，物攻和特攻同时提升(+50%)' },
  { name: '充电', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1 }, desc: '蓄积电力，特防提升(+50%)' },
  { name: '溶化', t: 'POISON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '身体液化，物防大幅提升(+100%)' },
  { name: '棉花防守', t: 'GRASS', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 3 }, desc: '用绒毛包裹，物防巨幅提升(+150%)' },
  { name: '影分身', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 1 }, desc: '制造残影，闪避率提升(+1级)' },
  { name: '变小', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 2 }, desc: '身体缩小，闪避率大幅提升(+2级)' },

  // --- 削弱对手 (Debuff: -1级=-33%, -2级=-50%) ---
  { name: '叫声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 1 }, desc: '可爱的叫声，降低对手物攻(-33%)' },
  { name: '瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 1 }, desc: '犀利的眼神，降低对手物防(-33%)' },
  { name: '刺耳声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 2 }, desc: '刺耳的噪音，大幅降低对手物防(-50%)' },
  { name: '假哭', t: 'DARK', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '装哭，大幅降低对手特防(-50%)' },
  { name: '金属音', t: 'STEEL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '摩擦金属声，大幅降低对手特防(-50%)' },
  { name: '可怕面孔', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 2 }, desc: '恐怖的表情，大幅降低对手速度(-50%)' },
  { name: '吐丝', t: 'BUG', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 1 }, desc: '缠住对手，降低对手速度(-33%)' },
  { name: '撒娇', t: 'FAIRY', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '可爱的撒娇，大幅降低对手物攻(-50%)' },
  { name: '泼沙', t: 'GROUND', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '向眼睛泼沙，降低对手命中率(-1级)' },
  { name: '闪光', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '强光致盲，降低对手命中率(-1级)' },
  { name: '烟幕', t: 'FIRE', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '喷出烟雾，降低对手命中率(-1级)' },
  { name: '羽毛舞', t: 'FLYING', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '撒落羽毛，大幅降低对手物攻(-50%)' },
  { name: '大声咆哮', t: 'DARK', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_atk', val: 1 }, desc: '狂吠，降低对手特攻(-33%)' },

  // --- 施加异常状态 (Status) ---
  { name: '电磁波', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.9 }, desc: '90%使对手麻痹(速度减半/25%无法行动)' },
  { name: '鬼火', t: 'FIRE', p: 0, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.85 }, desc: '85%使对手灼伤(物攻减半/每回合扣血)' },
  { name: '剧毒', t: 'POISON', p: 0, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.9 }, desc: '90%使对手中剧毒(伤害随回合增加)' },
  { name: '催眠术', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'SLP', chance: 0.6 }, desc: '60%使对手睡眠(1-3回合无法行动)' },
  { name: '唱歌', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.55 }, desc: '55%使对手睡眠(1-3回合无法行动)' },
  { name: '蘑菇孢子', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 1.0 }, desc: '100%使对手睡眠(1-3回合无法行动)' },
  { name: '奇异光线', t: 'GHOST', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%使对手混乱(33%概率攻击自己)' },
  { name: '超音波', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.55 }, desc: '55%使对手混乱(33%概率攻击自己)' },
  { name: '虚张声势', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.85, sideEffect: {type:'BUFF', target:'enemy', stat:'p_atk', val:2} }, desc: '使对手混乱但大幅提升其攻击' },
  { name: '天使之吻', t: 'FAIRY', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.75 }, desc: '75%使对手混乱' },
  { name: '大蛇瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%使对手麻痹' },
  { name: '毒粉', t: 'POISON', p: 0, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.75 }, desc: '75%使对手中毒' },
  { name: '麻痹粉', t: 'GRASS', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 0.75 }, desc: '75%使对手麻痹' },
  { name: '催眠粉', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.75 }, desc: '75%使对手睡眠' },

  // --- 防御与恢复 (Utility) ---
  { name: '守住', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击(连续使用易失败)' },
  { name: '看穿', t: 'FIGHT', p: 0, pp: 5, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击' },
  { name: '光合作用', t: 'GRASS', p: 0, pp: 5, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '自我再生', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '羽栖', t: 'FLYING', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '黑雾', t: 'ICE', p: 0, pp: 30, effect: { type: 'RESET' }, desc: '重置全场所有能力变化' }
];
// ==========================================
// [新增] 伤害+特效 技能库 (50种)
// 格式: { name, t:属性, p:威力, pp, effect: { type, val/status, chance } }
// ==========================================
const SIDE_EFFECT_SKILLS = [
  // --- 1. 灼伤系列 (火系) ---
  { name: '火焰轮', t: 'FIRE', p: 60, pp: 25, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '喷射火焰', t: 'FIRE', p: 90, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '热风', t: 'FIRE', p: 95, pp: 10, effect: { type: 'STATUS', status: 'BRN', chance: 0.2 }, desc: '20%概率灼伤' },
  { name: '炼狱', t: 'FIRE', p: 100, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 1.0 }, desc: '100%必中灼伤，但命中率低' }, // 需配合命中逻辑
  { name: '神圣之火', t: 'FIRE', p: 100, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.5 }, desc: '50%概率灼伤' },

  // --- 2. 麻痹系列 (电/一般) ---
  { name: '电击波', t: 'ELECTRIC', p: 60, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '放电', t: 'ELECTRIC', p: 80, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '泰山压顶', t: 'NORMAL', p: 85, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '蹭蹭脸颊', t: 'ELECTRIC', p: 40, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%麻痹对手' },
  { name: '伏特攻击', t: 'ELECTRIC', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '高威力+30%麻痹' },

  // --- 3. 冰冻/减速系列 (冰系) ---
  { name: '冰冻之风', t: 'ICE', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低对手速度' },
  { name: '急冻光线', t: 'ICE', p: 90, pp: 10, effect: { type: 'STATUS', status: 'FRZ', chance: 0.1 }, desc: '10%概率冰冻' },
  { name: '暴风雪', t: 'ICE', p: 110, pp: 5, effect: { type: 'STATUS', status: 'FRZ', chance: 0.3 }, desc: '30%概率冰冻' },
  { name: '冰柱坠击', t: 'ICE', p: 85, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率畏缩(这里用混乱代替)' },
  { name: '极寒冷焰', t: 'ICE', p: 140, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.3 }, desc: '奇特的冰系技能，30%灼伤' },

  // --- 4. 中毒系列 (毒系) ---
  { name: '毒针', t: 'POISON', p: 30, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '毒击', t: 'POISON', p: 80, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '污泥炸弹', t: 'POISON', p: 90, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '垃圾射击', t: 'POISON', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '十字毒刃', t: 'POISON', p: 70, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '50%概率中毒(高暴击)' },

  // --- 5. 降防系列 (降低物防/特防) ---
  { name: '碎岩', t: 'FIGHT', p: 40, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.5 }, desc: '50%降低物防' },
  { name: '铁尾', t: 'STEEL', p: 100, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '30%降低物防' },
  { name: '咬碎', t: 'DARK', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.2 }, desc: '20%降低物防' },
  { name: '暗影球', t: 'GHOST', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.2 }, desc: '20%降低特防' },
  { name: '大地之力', t: 'GROUND', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '精神强念', t: 'PSYCHIC', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '酸液炸弹', t: 'POISON', p: 40, pp: 20, effect: { type: 'DEBUFF', stat: 's_def', val: 2, chance: 1.0 }, desc: '100%大幅降低特防' },

  // --- 6. 降攻系列 (降低物攻/特攻) ---
  { name: '嬉闹', t: 'FAIRY', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.1 }, desc: '10%降低物攻' },
  { name: '月亮之力', t: 'FAIRY', p: 95, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.3 }, desc: '30%降低特攻' },
  { name: '大声咆哮', t: 'DARK', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '100%降低特攻' },
  { name: '广域破坏', t: 'DRAGON', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%降低物攻' },
  { name: '虫之抵抗', t: 'BUG', p: 50, pp: 20, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '100%降低特攻' },

  // --- 7. 降速/降命中系列 ---
  { name: '岩石封锁', t: 'ROCK', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '泥巴射击', t: 'GROUND', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '重踏', t: 'GROUND', p: 60, pp: 20, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '浊流', t: 'WATER', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.3 }, desc: '30%降低命中' },
  { name: '暗黑爆破', t: 'DARK', p: 85, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.4 }, desc: '40%降低命中' },

  // --- 8. 混乱系列 ---
  { name: '水之波动', t: 'WATER', p: 60, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '20%概率混乱' },
  { name: '信号光束', t: 'BUG', p: 75, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.1 }, desc: '10%概率混乱' },
  { name: '暴风', t: 'FLYING', p: 110, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率混乱' },
  { name: '爆裂拳', t: 'FIGHT', p: 100, pp: 5, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%混乱，但命中低' },

  // --- 9. 强化自身系列 (攻击同时提升自己) ---
  { name: '增强拳', t: 'FIGHT', p: 40, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%提升自身物攻' },
  { name: '蓄能焰袭', t: 'FIRE', p: 50, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%提升自身速度' },
  { name: '钢翼', t: 'STEEL', p: 70, pp: 25, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.1 }, desc: '10%提升自身物防' },
  { name: '原始之力', t: 'ROCK', p: 60, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def', chance: 0.1 }, desc: '10%全属性提升(简化)' },
  { name: '流星光束', t: 'ROCK', p: 120, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 1.0 }, desc: '蓄力攻击，提升特攻' }
];

// ==========================================
// [新增] 50种高级技能 (含复合效果、回血、反伤、天气等)
// ==========================================
const ADVANCED_SKILLS = [
  // --- 火系 (5) ---
  { name: '业火爆炎', t: 'FIRE', p: 130, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.5 }, desc: '释放炼狱之火，130威力+50%灼伤' },
  { name: '灼热践踏', t: 'FIRE', p: 85, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '踩踏烈焰，85威力+50%降速' },
  { name: '阳炎乱舞', t: 'FIRE', p: 75, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 1.0 }, desc: '以热浪为掩护，75威力+提升速度' },
  { name: '火神之怒', t: 'FIRE', p: 110, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '神火焚天，110威力+30%降防' },
  { name: '焰灵咒', t: 'FIRE', p: 95, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '幻焰迷心，95威力+20%混乱' },

  // --- 水系 (5) ---
  { name: '深渊漩涡', t: 'WATER', p: 100, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '深海漩涡卷入，100威力+50%降速' },
  { name: '暴雨洗礼', t: 'WATER', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1, chance: 0.3 }, desc: '雨水滋润，80威力+30%提特防' },
  { name: '水神裁决', t: 'WATER', p: 130, pp: 5, effect: { type: 'STATUS', status: 'FRZ', chance: 0.15 }, desc: '绝对水压，130威力+15%冰冻' },
  { name: '潮汐之力', t: 'WATER', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '潮汐冲刷意志，90威力+30%降物攻' },
  { name: '泡影破灭', t: 'WATER', p: 70, pp: 15, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.5 }, desc: '泡沫爆裂，70威力+50%降特防' },

  // --- 草系 (4) ---
  { name: '藤蔓绞杀', t: 'GRASS', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '藤蔓缠绕，90威力+50%降速' },
  { name: '花粉风暴', t: 'GRASS', p: 80, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.2 }, desc: '花粉催眠，80威力+20%睡眠' },
  { name: '世界树之怒', t: 'GRASS', p: 140, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.5 }, desc: '世界树之力，140威力+50%提防' },
  { name: '光合冲击', t: 'GRASS', p: 85, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 0.3 }, desc: '汲取阳光攻击，85威力+30%提特攻' },

  // --- 电系 (3) ---
  { name: '雷神降世', t: 'ELECTRIC', p: 140, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.5 }, desc: '天雷降临，140威力+50%麻痹' },
  { name: '电磁脉冲', t: 'ELECTRIC', p: 85, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.3 }, desc: '电磁波干扰，85威力+30%大幅降速' },
  { name: '闪电链', t: 'ELECTRIC', p: 75, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.4 }, desc: '连锁闪电，75威力+40%麻痹' },

  // --- 冰系 (3) ---
  { name: '极寒领域', t: 'ICE', p: 100, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.5 }, desc: '冰域降临，100威力+50%大幅降速' },
  { name: '冰晶穿刺', t: 'ICE', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '冰晶贯穿铠甲，90威力+30%降物防' },
  { name: '钻石星尘', t: 'ICE', p: 120, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 1.0 }, desc: '冰晶防护+攻击，120威力+提物防' },

  // --- 格斗 (3) ---
  { name: '百烈拳', t: 'FIGHT', p: 70, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '连续出拳越打越强，70威力+30%提物攻' },
  { name: '气功波', t: 'FIGHT', p: 95, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '精神攻击，95威力+20%混乱' },
  { name: '天罡拳', t: 'FIGHT', p: 120, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.5 }, desc: '破甲重击，120威力+50%降物防' },

  // --- 毒系 (2) ---
  { name: '瘴气弥漫', t: 'POISON', p: 85, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '毒雾笼罩，85威力+50%中毒' },
  { name: '剧毒之牙', t: 'POISON', p: 110, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '毒牙穿刺，110威力+30%降防' },

  // --- 地面 (2) ---
  { name: '大地裁决', t: 'GROUND', p: 110, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '地裂阻敌，110威力+50%降速' },
  { name: '沙暴冲击', t: 'GROUND', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.5 }, desc: '黄沙遮目，80威力+50%降命中' },

  // --- 飞行 (2) ---
  { name: '天翔龙卷', t: 'FLYING', p: 110, pp: 8, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '龙卷风席卷，110威力+30%混乱' },
  { name: '疾风斩', t: 'FLYING', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 0.5 }, desc: '风之加护，80威力+50%提速' },

  // --- 超能 (3) ---
  { name: '精神崩坏', t: 'PSYCHIC', p: 100, pp: 8, effect: { type: 'STATUS', status: 'CON', chance: 0.4 }, desc: '精神冲击，100威力+40%混乱' },
  { name: '念动力场', t: 'PSYCHIC', p: 85, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1, chance: 0.5 }, desc: '念力护盾，85威力+50%提特防' },
  { name: '次元斩击', t: 'PSYCHIC', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.3 }, desc: '切割精神，130威力+30%降特防' },

  // --- 虫系 (2) ---
  { name: '虫群风暴', t: 'BUG', p: 95, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '虫群侵蚀意志，95威力+30%降物攻' },
  { name: '毒鳞粉', t: 'BUG', p: 70, pp: 15, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '有毒鳞粉，70威力+50%中毒' },

  // --- 岩石 (2) ---
  { name: '巨岩压顶', t: 'ROCK', p: 110, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '巨岩压制，110威力+50%降速' },
  { name: '宝石闪光', t: 'ROCK', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.3 }, desc: '宝石折射致盲，80威力+30%降命中' },

  // --- 幽灵 (3) ---
  { name: '怨灵缠身', t: 'GHOST', p: 90, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '怨灵攻击精神，90威力+30%混乱' },
  { name: '冥府之门', t: 'GHOST', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 's_def', val: 2, chance: 0.3 }, desc: '冥界力量，130威力+30%大幅降特防' },
  { name: '诅咒之刃', t: 'GHOST', p: 85, pp: 15, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '被诅咒侵蚀，85威力+30%中毒' },

  // --- 龙系 (2) ---
  { name: '龙神咆哮', t: 'DRAGON', p: 140, pp: 5, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.5 }, desc: '龙之威压，140威力+50%降物攻' },
  { name: '龙鳞守护', t: 'DRAGON', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.5 }, desc: '龙鳞硬化+攻击，80威力+50%提物防' },

  // --- 钢系 (2) ---
  { name: '铁壁突击', t: 'STEEL', p: 100, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.3 }, desc: '钢铁冲锋，100威力+30%提物防' },
  { name: '合金斩', t: 'STEEL', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '合金利刃切割铠甲，90威力+30%降物防' },

  // --- 妖精 (3) ---
  { name: '月华光辉', t: 'FAIRY', p: 100, pp: 10, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.3 }, desc: '圣洁月光，100威力+30%降特攻' },
  { name: '精灵之舞', t: 'FAIRY', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 0.5 }, desc: '舞蹈蓄力，80威力+50%提特攻' },
  { name: '梦幻泡影', t: 'FAIRY', p: 110, pp: 8, effect: { type: 'STATUS', status: 'SLP', chance: 0.15 }, desc: '梦幻之力，110威力+15%催眠' },

  // --- 暗系 (3) ---
  { name: '暗影吞噬', t: 'DARK', p: 95, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.3 }, desc: '暗影侵蚀，95威力+30%降特防' },
  { name: '深渊凝视', t: 'DARK', p: 80, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '深渊之眼，80威力+30%混乱' },
  { name: '黑洞吸引', t: 'DARK', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.5 }, desc: '黑洞引力，130威力+50%大幅降速' },

  // --- 神系 (1) ---
  { name: '天启审判', t: 'GOD', p: 160, pp: 3, effect: { type: 'DEBUFF', stat: 'p_def', val: 2, chance: 0.5 }, desc: '天之审判降临，160威力+50%大幅降防' },
];

// [自动注入] 将新技能合并到 SKILL_DB
const injectStatusSkills = () => {
  STATUS_SKILLS_DB.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复添加
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        // 随机插入到该属性技能列表的中间位置，增加出现概率
        const len = SKILL_DB[skill.t].length;
        const insertIdx = Math.floor(Math.random() * len);
        SKILL_DB[skill.t].splice(insertIdx, 0, skill);
    }
  });
};
// 立即执行注入
injectStatusSkills();
// [自动注入] 将伤害+特效技能合并到 SKILL_DB
const injectSideEffectSkills = () => {
  SIDE_EFFECT_SKILLS.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        // 插入到列表末尾，作为强力技能
        SKILL_DB[skill.t].push(skill);
    }
  });
};
// 立即执行
injectSideEffectSkills();

// [自动注入] 50种高级技能
const injectAdvancedSkills = () => {
  ADVANCED_SKILLS.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
      SKILL_DB[skill.t].push(skill);
    }
  });
};
injectAdvancedSkills();

export { SKILL_DB, STATUS_SKILLS_DB, SIDE_EFFECT_SKILLS, ADVANCED_SKILLS };
