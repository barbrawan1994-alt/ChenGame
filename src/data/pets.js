// ==========================================
// [更新] 基础图鉴 (已为30只弱势精灵添加了强力进化链)
// ==========================================
const BASE_POKEDEX = [
  { id: 1, name: '叶苗苗', type: 'GRASS', emoji: '🌱', hp: 45, atk: 49, def: 49, evo: 2, evoLvl: 16 },
  { id: 2, name: '灵叶鹿', type: 'GRASS', emoji: '🦌', hp: 60, atk: 62, def: 63, evo: 3, evoLvl: 32 },
  { id: 3, name: '森之主', type: 'GRASS', emoji: '🌳', hp: 85, atk: 85, def: 90 },
  { id: 4, name: '火绒狐', type: 'FIRE', emoji: '🦊', hp: 39, atk: 52, def: 43, evo: 5, evoLvl: 16 },
  { id: 5, name: '炎尾狼', type: 'FIRE', emoji: '🐺', hp: 58, atk: 64, def: 58, evo: 6, evoLvl: 36 },
  { id: 6, name: '炼狱魔狼', type: 'FIRE', emoji: '👹', hp: 78, atk: 104, def: 78 },
  { id: 7, name: '泡泡鱼', type: 'WATER', emoji: '🐟', hp: 44, atk: 48, def: 65, evo: 8, evoLvl: 16 },
  { id: 8, name: '激流鲨', type: 'WATER', emoji: '🦈', hp: 59, atk: 63, def: 80, evo: 9, evoLvl: 36 },
  { id: 9, name: '深海霸主', type: 'WATER', emoji: '🐋', hp: 90, atk: 95, def: 100 },
  { id: 10, name: '藤蔓怪', type: 'GRASS', emoji: '🧶', hp: 65, atk: 55, def: 100, evo: 301, evoLvl: 40 }, // 新增进化
  { id: 11, name: '火绒狐', type: 'FIRE', emoji: '🦊', hp: 39, atk: 52, def: 43, evo: 12, evoLvl: 16 },
  { id: 12, name: '炎尾狼', type: 'FIRE', emoji: '🐺', hp: 58, atk: 64, def: 58, evo: 13, evoLvl: 36 },
  { id: 13, name: '炼狱魔狼', type: 'FIRE', emoji: '👹', hp: 78, atk: 104, def: 78 },
  { id: 14, name: '燃煤怪', type: 'FIRE', emoji: '⚫', hp: 40, atk: 40, def: 70, evo: 15, evoLvl: 25 },
  { id: 15, name: '熔岩巨像', type: 'ROCK', emoji: '🗿', hp: 90, atk: 90, def: 120 },
  { id: 16, name: '小火雀', type: 'FIRE', emoji: '🐤', hp: 45, atk: 60, def: 40, evo: 17, evoLvl: 18 },
  { id: 17, name: '炽羽凤', type: 'FIRE', emoji: '🦅', hp: 75, atk: 95, def: 60, evo: 242, evoLvl: 50 }, // 连接到火凤凰
  { id: 18, name: '烛光灵', type: 'GHOST', emoji: '🕯️', hp: 30, atk: 70, def: 30, evo: 19, evoLvl: 30 },
  { id: 19, name: '幽冥灯笼', type: 'GHOST', emoji: '🏮', hp: 60, atk: 125, def: 60 },
  { id: 20, name: '爆爆狮', type: 'FIRE', emoji: '🦁', hp: 80, atk: 110, def: 80, evo: 302, evoLvl: 55 }, // 新增进化
  { id: 21, name: '泡泡鱼', type: 'WATER', emoji: '🐟', hp: 44, atk: 48, def: 65, evo: 22, evoLvl: 16 },
  { id: 22, name: '激流鲨', type: 'WATER', emoji: '🦈', hp: 59, atk: 63, def: 80, evo: 23, evoLvl: 36 },
  { id: 23, name: '深海霸主', type: 'WATER', emoji: '🐋', hp: 90, atk: 95, def: 100 },
  { id: 24, name: '珍珠贝', type: 'WATER', emoji: '🐚', hp: 50, atk: 40, def: 85, evo: 25, evoLvl: 20 },
  { id: 25, name: '铠甲蟹', type: 'WATER', emoji: '🦀', hp: 70, atk: 100, def: 115 },
  { id: 26, name: '水灵水母', type: 'WATER', emoji: '🎐', hp: 60, atk: 50, def: 100, evo: 27, evoLvl: 30 },
  { id: 27, name: '剧毒海妖', type: 'POISON', emoji: '🦑', hp: 90, atk: 70, def: 120 },
  { id: 28, name: '呆呆鸭', type: 'WATER', emoji: '🦆', hp: 60, atk: 60, def: 60, evo: 29, evoLvl: 33 },
  { id: 29, name: '念力鸭皇', type: 'PSYCHIC', emoji: '👑', hp: 90, atk: 95, def: 85 },
  { id: 30, name: '冰晶企鹅', type: 'ICE', emoji: '🐧', hp: 60, atk: 70, def: 60, evo: 303, evoLvl: 42 }, // 新增进化
  { id: 31, name: '静电球', type: 'ELECTRIC', emoji: '🟡', hp: 40, atk: 55, def: 40, evo: 32, evoLvl: 22 },
  { id: 32, name: '闪电猫', type: 'ELECTRIC', emoji: '🐱', hp: 65, atk: 85, def: 60, evo: 33, evoLvl: 36 },
  { id: 33, name: '雷霆狮王', type: 'ELECTRIC', emoji: '🦁', hp: 85, atk: 115, def: 75 },
  { id: 34, name: '插头怪', type: 'ELECTRIC', emoji: '🔌', hp: 50, atk: 60, def: 50, evo: 35, evoLvl: 25 },
  { id: 35, name: '磁暴塔', type: 'ELECTRIC', emoji: '🗼', hp: 80, atk: 100, def: 90 },
  { id: 36, name: '电飞鼠', type: 'ELECTRIC', emoji: '🦇', hp: 60, atk: 80, def: 60, evo: 304, evoLvl: 40 }, // 新增进化
  { id: 37, name: '雷云云', type: 'ELECTRIC', emoji: '☁️', hp: 70, atk: 90, def: 70, evo: 305, evoLvl: 45 }, // 新增进化
  { id: 38, name: '脉冲虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 50, def: 55, evo: 39, evoLvl: 20 },
  { id: 39, name: '电光甲虫', type: 'ELECTRIC', emoji: '🪲', hp: 75, atk: 105, def: 85 },
  { id: 40, name: '超能电池', type: 'STEEL', emoji: '🔋', hp: 60, atk: 60, def: 100, evo: 306, evoLvl: 48 }, // 新增进化
  { id: 41, name: '信使鸟', type: 'FLYING', emoji: '🐦', hp: 40, atk: 45, def: 40, evo: 42, evoLvl: 18 },
  { id: 42, name: '疾风鹰', type: 'FLYING', emoji: '🦅', hp: 60, atk: 70, def: 55, evo: 43, evoLvl: 32 },
  { id: 43, name: '暴风神雕', type: 'FLYING', emoji: '🌪️', hp: 85, atk: 100, def: 75 },
  { id: 44, name: '贪吃鼠', type: 'NORMAL', emoji: '🐀', hp: 35, atk: 50, def: 35, evo: 45, evoLvl: 20 },
  { id: 45, name: '大牙猛鼠', type: 'NORMAL', emoji: '🐁', hp: 70, atk: 90, def: 60 },
  { id: 46, name: '幸运猫', type: 'NORMAL', emoji: '😺', hp: 50, atk: 50, def: 50, evo: 47, evoLvl: 25 },
  { id: 47, name: '贵族猫', type: 'NORMAL', emoji: '🐈', hp: 75, atk: 80, def: 65, evo: 307, evoLvl: 50 }, // 新增进化
  { id: 48, name: '粉粉球', type: 'FAIRY', emoji: '🧶', hp: 90, atk: 45, def: 40, evo: 49, evoLvl: 30 },
  { id: 49, name: '治愈天使', type: 'FAIRY', emoji: '👼', hp: 130, atk: 70, def: 70 },
  { id: 50, name: '瞌睡熊', type: 'NORMAL', emoji: '🐻', hp: 150, atk: 110, def: 80, evo: 308, evoLvl: 60 }, // 新增进化
  { id: 51, name: '冥想童子', type: 'PSYCHIC', emoji: '🧘', hp: 30, atk: 30, def: 30, evo: 52, evoLvl: 16 },
  { id: 52, name: '念力法师', type: 'PSYCHIC', emoji: '🧙', hp: 50, atk: 80, def: 50, evo: 53, evoLvl: 36 },
  { id: 53, name: '大魔导士', type: 'PSYCHIC', emoji: '🔮', hp: 70, atk: 135, def: 65 },
  { id: 54, name: '飘飘魂', type: 'GHOST', emoji: '👻', hp: 30, atk: 40, def: 30, evo: 55, evoLvl: 25 },
  { id: 55, name: '恶作剧鬼', type: 'GHOST', emoji: '😜', hp: 50, atk: 80, def: 50, evo: 56, evoLvl: 40 },
  { id: 56, name: '暗影魔王', type: 'GHOST', emoji: '👿', hp: 70, atk: 120, def: 70 },
  { id: 57, name: '食梦貘', type: 'PSYCHIC', emoji: '🐘', hp: 70, atk: 60, def: 60, evo: 58, evoLvl: 28 },
  { id: 58, name: '梦境行者', type: 'PSYCHIC', emoji: '🌌', hp: 95, atk: 85, def: 85 },
  { id: 59, name: '诅咒娃娃', type: 'GHOST', emoji: '🎎', hp: 60, atk: 115, def: 65, evo: 309, evoLvl: 48 }, // 新增进化
  { id: 60, name: '星之子', type: 'FAIRY', emoji: '⭐', hp: 50, atk: 50, def: 50, evo: 61, evoLvl: 30 },
  { id: 61, name: '星光舞者', type: 'FAIRY', emoji: '💃', hp: 70, atk: 85, def: 75 },
  { id: 62, name: '功夫小子', type: 'FIGHT', emoji: '🥋', hp: 50, atk: 70, def: 50, evo: 63, evoLvl: 25 },
  { id: 63, name: '武道宗师', type: 'FIGHT', emoji: '👊', hp: 80, atk: 110, def: 70 },
  { id: 64, name: '小石怪', type: 'ROCK', emoji: '🪨', hp: 40, atk: 80, def: 100, evo: 65, evoLvl: 25 },
  { id: 65, name: '巨岩兵', type: 'ROCK', emoji: '🧱', hp: 70, atk: 105, def: 130 },
  { id: 66, name: '钻地鼠', type: 'GROUND', emoji: '🐹', hp: 30, atk: 60, def: 40, evo: 67, evoLvl: 26 },
  { id: 67, name: '三头地鼠', type: 'GROUND', emoji: '🥜', hp: 50, atk: 100, def: 60 },
  { id: 68, name: '穿山甲', type: 'GROUND', emoji: '🦔', hp: 60, atk: 80, def: 90, evo: 69, evoLvl: 22 },
  { id: 69, name: '钢爪王', type: 'GROUND', emoji: '💅', hp: 80, atk: 105, def: 115, evo: 310, evoLvl: 50 }, // 新增进化
  { id: 70, name: '波导狗', type: 'FIGHT', emoji: '🐕', hp: 40, atk: 70, def: 40, evo: 71, evoLvl: 30 },
  { id: 71, name: '波导勇者', type: 'FIGHT', emoji: '🐺', hp: 75, atk: 115, def: 75 },
  { id: 72, name: '相扑力士', type: 'FIGHT', emoji: '🖐️', hp: 140, atk: 120, def: 60 },
  { id: 73, name: '化石翼龙', type: 'ROCK', emoji: '🦕', hp: 80, atk: 105, def: 65, evo: 311, evoLvl: 60 }, // 新增进化
  { id: 74, name: '水晶大岩蛇', type: 'ICE', emoji: '💎', hp: 70, atk: 70, def: 160 },
  { id: 75, name: '沼泽怪', type: 'GROUND', emoji: '💩', hp: 100, atk: 85, def: 85, evo: 312, evoLvl: 55 }, // 新增进化
  { id: 76, name: '雪球海豹', type: 'ICE', emoji: '🦭', hp: 70, atk: 40, def: 50, evo: 77, evoLvl: 32 },
  { id: 77, name: '冰牙海狮', type: 'ICE', emoji: '🦷', hp: 90, atk: 60, def: 70, evo: 78, evoLvl: 44 },
  { id: 78, name: '极地海皇', type: 'ICE', emoji: '👑', hp: 110, atk: 85, def: 95 },
  { id: 79, name: '迷你蛇', type: 'DRAGON', emoji: '🐍', hp: 41, atk: 64, def: 45, evo: 80, evoLvl: 30 },
  { id: 80, name: '神秘龙', type: 'DRAGON', emoji: '🐉', hp: 61, atk: 84, def: 65, evo: 81, evoLvl: 55 },
  { id: 81, name: '守护神龙', type: 'DRAGON', emoji: '🐲', hp: 91, atk: 134, def: 95 },
  { id: 82, name: '幼鲨', type: 'DRAGON', emoji: '🦈', hp: 58, atk: 70, def: 45, evo: 83, evoLvl: 24 },
  { id: 83, name: '利刃鲨', type: 'DRAGON', emoji: '🦖', hp: 68, atk: 90, def: 65, evo: 84, evoLvl: 48 },
  { id: 84, name: '陆地狂鲨', type: 'DRAGON', emoji: '✈️', hp: 108, atk: 130, def: 95 },
  { id: 85, name: '古铜镜', type: 'STEEL', emoji: '🪞', hp: 57, atk: 24, def: 86, evo: 86, evoLvl: 33 },
  { id: 86, name: '古铜钟', type: 'STEEL', emoji: '🔔', hp: 67, atk: 89, def: 116 },
  { id: 87, name: '铁哑铃', type: 'STEEL', emoji: '🔩', hp: 40, atk: 55, def: 80, evo: 88, evoLvl: 20 },
  { id: 88, name: '金属怪', type: 'STEEL', emoji: '🦾', hp: 60, atk: 75, def: 100, evo: 89, evoLvl: 45 },
  { id: 89, name: '合金巨蟹', type: 'STEEL', emoji: '🦀', hp: 80, atk: 135, def: 130 },
  { id: 90, name: '雪妖女', type: 'ICE', emoji: '👘', hp: 70, atk: 80, def: 70, evo: 313, evoLvl: 50 }, // 新增进化
  { id: 91, name: '急冻神鸟', type: 'ICE', emoji: '❄️', hp: 90, atk: 95, def: 100 },
  { id: 92, name: '雷霆神鸟', type: 'ELECTRIC', emoji: '⚡', hp: 90, atk: 100, def: 85 },
  { id: 93, name: '火焰神鸟', type: 'FIRE', emoji: '🔥', hp: 90, atk: 110, def: 90 },
  { id: 94, name: '超能主宰', type: 'PSYCHIC', emoji: '👽', hp: 106, atk: 130, def: 90 },
  { id: 95, name: '幻之基因', type: 'PSYCHIC', emoji: '🧬', hp: 100, atk: 100, def: 100 },
  { id: 96, name: '海神洛奇', type: 'FLYING', emoji: '🐋', hp: 106, atk: 90, def: 130 },
  { id: 97, name: '彩虹凤王', type: 'FIRE', emoji: '🦚', hp: 106, atk: 130, def: 90 },
  { id: 98, name: '天空之龙', type: 'DRAGON', emoji: '🐉', hp: 105, atk: 150, def: 90 },
  { id: 99, name: '大地之神', type: 'GROUND', emoji: '🌋', hp: 100, atk: 150, def: 140 },
  { id: 100, name: '海洋之神', type: 'WATER', emoji: '🌊', hp: 100, atk: 120, def: 100 },
  { id: 101, name: '嫩叶龙', type: 'GRASS', emoji: '🦖', hp: 45, atk: 55, def: 50, evo: 102, evoLvl: 16 },
  { id: 102, name: '丛林龙', type: 'GRASS', emoji: '🐊', hp: 65, atk: 75, def: 65, evo: 103, evoLvl: 34 },
  { id: 103, name: '森林霸主', type: 'GRASS', emoji: '🐉', hp: 85, atk: 105, def: 85 },
  { id: 104, name: '火花猴', type: 'FIRE', emoji: '🐒', hp: 44, atk: 58, def: 44, evo: 105, evoLvl: 16 },
  { id: 105, name: '烈焰猿', type: 'FIRE', emoji: '🦍', hp: 64, atk: 78, def: 52, evo: 106, evoLvl: 36 },
  { id: 106, name: '斗战胜佛', type: 'FIRE', emoji: '👹', hp: 76, atk: 104, def: 71, evo: 314, evoLvl: 70 }, // 新增进化
  { id: 107, name: '水跃蛙', type: 'WATER', emoji: '🐸', hp: 50, atk: 50, def: 50, evo: 108, evoLvl: 16 },
  { id: 108, name: '沼泽蛙', type: 'WATER', emoji: '🧘', hp: 70, atk: 70, def: 70, evo: 109, evoLvl: 36 },
  { id: 109, name: '忍蛙', type: 'WATER', emoji: '🥷', hp: 72, atk: 103, def: 67, evo: 315, evoLvl: 70 }, // 新增进化
  { id: 110, name: '绿毛虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 30, def: 35, evo: 111, evoLvl: 7 },
  { id: 111, name: '铁甲蛹', type: 'BUG', emoji: '🥜', hp: 50, atk: 20, def: 55, evo: 112, evoLvl: 10 },
  { id: 112, name: '巴大蝶', type: 'BUG', emoji: '🦋', hp: 60, atk: 90, def: 50, evo: 316, evoLvl: 40 }, // 新增进化
  { id: 113, name: '超音蝠', type: 'POISON', emoji: '🦇', hp: 40, atk: 45, def: 35, evo: 114, evoLvl: 22 },
  { id: 114, name: '大嘴蝠', type: 'POISON', emoji: '🧛', hp: 75, atk: 80, def: 70, evo: 317, evoLvl: 45 }, // 新增进化
  { id: 115, name: '走路草', type: 'GRASS', emoji: '🌱', hp: 45, atk: 50, def: 55, evo: 116, evoLvl: 21 },
  { id: 116, name: '臭臭花', type: 'POISON', emoji: '🌺', hp: 60, atk: 65, def: 70, evo: 117, evoLvl: 30 },
  { id: 117, name: '霸王花', type: 'GRASS', emoji: '🍄', hp: 75, atk: 85, def: 85, evo: 318, evoLvl: 50 }, // 新增进化
  { id: 118, name: '喵喵', type: 'NORMAL', emoji: '😺', hp: 40, atk: 45, def: 35, evo: 119, evoLvl: 28 },
  { id: 119, name: '猫老大', type: 'NORMAL', emoji: '🐆', hp: 65, atk: 70, def: 60, evo: 319, evoLvl: 50 }, // 新增进化
  { id: 120, name: '可达鸭', type: 'WATER', emoji: '🐥', hp: 50, atk: 52, def: 48, evo: 28, evoLvl: 33 },
  { id: 121, name: '肯泰罗', type: 'NORMAL', emoji: '🐂', hp: 75, atk: 100, def: 95, evo: 320, evoLvl: 45 }, // 新增进化
  { id: 122, name: '大奶罐', type: 'NORMAL', emoji: '🐄', hp: 95, atk: 80, def: 105, evo: 321, evoLvl: 45 }, // 新增进化
  { id: 123, name: '拉普拉斯', type: 'ICE', emoji: '🦕', hp: 130, atk: 85, def: 80, evo: 322, evoLvl: 60 }, // 新增进化
  { id: 124, name: '百变怪', type: 'NORMAL', emoji: '🫠', hp: 48, atk: 48, def: 48, evo: 323, evoLvl: 50 }, // 新增进化
  { id: 125, name: '伊布', type: 'NORMAL', emoji: '🐕', hp: 55, atk: 55, def: 50 },
  { id: 126, name: '水伊布', type: 'WATER', emoji: '🧜', hp: 130, atk: 65, def: 60 },
  { id: 127, name: '雷伊布', type: 'ELECTRIC', emoji: '⚡', hp: 65, atk: 110, def: 60 },
  { id: 128, name: '火伊布', type: 'FIRE', emoji: '🔥', hp: 65, atk: 130, def: 60 },
  { id: 129, name: '太阳伊布', type: 'PSYCHIC', emoji: '🔮', hp: 65, atk: 130, def: 60 },
  { id: 130, name: '月亮伊布', type: 'GHOST', emoji: '🌙', hp: 95, atk: 65, def: 110 },
  { id: 131, name: '多边兽', type: 'NORMAL', emoji: '🦆', hp: 65, atk: 60, def: 70, evo: 132, evoLvl: 30 },
  { id: 132, name: '多边兽Z', type: 'NORMAL', emoji: '🤖', hp: 85, atk: 135, def: 70, evo: 324, evoLvl: 60 }, // 新增进化
  { id: 133, name: '菊石兽', type: 'ROCK', emoji: '🐚', hp: 35, atk: 40, def: 100, evo: 134, evoLvl: 40 },
  { id: 134, name: '多刺菊石兽', type: 'ROCK', emoji: '🐌', hp: 70, atk: 60, def: 125, evo: 325, evoLvl: 55 }, // 新增进化
  { id: 135, name: '化石盔', type: 'ROCK', emoji: '🪳', hp: 30, atk: 80, def: 90, evo: 136, evoLvl: 40 },
  { id: 136, name: '镰刀盔', type: 'ROCK', emoji: '🦂', hp: 60, atk: 115, def: 105, evo: 326, evoLvl: 55 }, // 新增进化
  { id: 137, name: '卡比兽', type: 'NORMAL', emoji: '🛌', hp: 160, atk: 110, def: 65 },
  { id: 138, name: '快龙', type: 'DRAGON', emoji: '🐲', hp: 91, atk: 134, def: 95 },
  { id: 139, name: '班基拉斯', type: 'ROCK', emoji: '🦖', hp: 100, atk: 134, def: 110 },
  { id: 140, name: '巨金怪', type: 'STEEL', emoji: '🕷️', hp: 80, atk: 135, def: 130 },
  { id: 141, name: '水都守护', type: 'DRAGON', emoji: '✈️', hp: 80, atk: 90, def: 80 },
  { id: 142, name: '时空之神', type: 'DRAGON', emoji: '🦕', hp: 100, atk: 120, def: 100 },
  { id: 143, name: '空间之神', type: 'DRAGON', emoji: '🦖', hp: 100, atk: 120, def: 100 },
  { id: 144, name: '冥王龙', type: 'GHOST', emoji: '🐛', hp: 150, atk: 100, def: 100 },
  { id: 145, name: '美梦神', type: 'PSYCHIC', emoji: '🌙', hp: 120, atk: 70, def: 120 },
  { id: 146, name: '噩梦神', type: 'GHOST', emoji: '🧛', hp: 70, atk: 90, def: 90 },
  { id: 147, name: '雪拉比', type: 'GRASS', emoji: '🧚', hp: 100, atk: 100, def: 100 },
  { id: 148, name: '基拉祈', type: 'STEEL', emoji: '⭐', hp: 100, atk: 100, def: 100 },
  { id: 149, name: '代欧奇希斯', type: 'PSYCHIC', emoji: '🧬', hp: 50, atk: 150, def: 50 },
  { id: 150, name: '创世神', type: 'NORMAL', emoji: '🌌', hp: 120, atk: 120, def: 120 },
  { id: 151, name: '梦幻', type: 'PSYCHIC', emoji: '🧬', hp: 100, atk: 100, def: 100 },
  { id: 152, name: '草苗龟', type: 'GRASS', emoji: '🐢', hp: 55, atk: 68, def: 64, evo: 153, evoLvl: 18 },
  { id: 153, name: '树林龟', type: 'GRASS', emoji: '🌳', hp: 75, atk: 89, def: 85, evo: 154, evoLvl: 32 },
  { id: 154, name: '土台龟', type: 'GROUND', emoji: '🏝️', hp: 95, atk: 109, def: 105 },
  { id: 155, name: '小火焰猴', type: 'FIRE', emoji: '🐒', hp: 44, atk: 58, def: 44, evo: 156, evoLvl: 14 },
   { id: 156, name: '猛火猴', type: 'FIRE', emoji: '🦍', hp: 64, atk: 78, def: 52, evo: 157, evoLvl: 36 },
  { id: 157, name: '烈焰猴', type: 'FIRE', emoji: '🔥', hp: 76, atk: 104, def: 71 },
  { id: 158, name: '波加曼', type: 'WATER', emoji: '🐧', hp: 53, atk: 61, def: 56, evo: 159, evoLvl: 16 },
  { id: 159, name: '波皇子', type: 'WATER', emoji: '🤴', hp: 64, atk: 66, def: 68, evo: 160, evoLvl: 36 },
  { id: 160, name: '帝王拿波', type: 'STEEL', emoji: '🔱', hp: 84, atk: 86, def: 88 },
  { id: 161, name: '姆克儿', type: 'FLYING', emoji: '🐦', hp: 40, atk: 55, def: 30, evo: 162, evoLvl: 14 },
  { id: 162, name: '姆克鸟', type: 'FLYING', emoji: '🦅', hp: 55, atk: 75, def: 50, evo: 163, evoLvl: 34 },
  { id: 163, name: '姆克鹰', type: 'FLYING', emoji: '🦅', hp: 85, atk: 120, def: 70 },
  { id: 164, name: '大牙狸', type: 'NORMAL', emoji: '🦫', hp: 59, atk: 45, def: 40, evo: 165, evoLvl: 15 },
  { id: 165, name: '大尾狸', type: 'WATER', emoji: '🦦', hp: 79, atk: 85, def: 60 },
  { id: 166, name: '小猫怪', type: 'ELECTRIC', emoji: '🦁', hp: 45, atk: 65, def: 34, evo: 167, evoLvl: 15 },
  { id: 167, name: '勒克猫', type: 'ELECTRIC', emoji: '⚡', hp: 60, atk: 85, def: 49, evo: 168, evoLvl: 30 },
  { id: 168, name: '伦琴猫', type: 'ELECTRIC', emoji: '🐯', hp: 80, atk: 120, def: 79 },
  { id: 169, name: '战槌龙', type: 'ROCK', emoji: '🦕', hp: 97, atk: 165, def: 60 },
  { id: 170, name: '护城龙', type: 'STEEL', emoji: '🛡️', hp: 60, atk: 52, def: 168 },
  { id: 171, name: '蜂女王', type: 'BUG', emoji: '🐝', hp: 70, atk: 80, def: 102, evo: 327, evoLvl: 55 }, // 新增进化
  { id: 172, name: '帕奇利兹', type: 'ELECTRIC', emoji: '🐿️', hp: 60, atk: 45, def: 70, evo: 328, evoLvl: 40 }, // 新增进化
  { id: 173, name: '泳圈鼬', type: 'WATER', emoji: '🦦', hp: 55, atk: 65, def: 35, evo: 174, evoLvl: 26 },
  { id: 174, name: '浮潜鼬', type: 'WATER', emoji: '🌊', hp: 85, atk: 105, def: 55 },
  { id: 175, name: '樱花儿', type: 'GRASS', emoji: '🌸', hp: 70, atk: 60, def: 70, evo: 329, evoLvl: 40 }, // 新增进化
  { id: 176, name: '海兔兽', type: 'GROUND', emoji: '🐌', hp: 111, atk: 83, def: 68 },
  { id: 177, name: '双尾怪手', type: 'NORMAL', emoji: '🐒', hp: 75, atk: 100, def: 66, evo: 330, evoLvl: 45 }, // 新增进化
  { id: 178, name: '梦妖魔', type: 'GHOST', emoji: '🧙', hp: 60, atk: 60, def: 60 },
    { id: 179, name: '乌鸦头头', type: 'FLYING', emoji: '🎩', hp: 100, atk: 125, def: 52 },
  { id: 180, name: '东施喵', type: 'NORMAL', emoji: '😼', hp: 71, atk: 82, def: 64 },
  { id: 181, name: '坦克臭鼬', type: 'POISON', emoji: '🦨', hp: 103, atk: 93, def: 67 },
  { id: 182, name: '烈咬陆鲨', type: 'DRAGON', emoji: '🦈', hp: 108, atk: 130, def: 95  },
  { id: 183, name: '路卡利欧', type: 'FIGHT', emoji: '🐺', hp: 70, atk: 110, def: 70 },
  { id: 184, name: '河马兽', type: 'GROUND', emoji: '🦛', hp: 108, atk: 112, def: 118 },
  { id: 185, name: '龙王蝎', type: 'POISON', emoji: '🦂', hp: 70, atk: 90, def: 110 },
  { id: 186, name: '毒骷蛙', type: 'FIGHT', emoji: '🐸', hp: 83, atk: 106, def: 65 },
  { id: 187, name: '暴雪王', type: 'ICE', emoji: '🌲', hp: 90, atk: 92, def: 75 },
  { id: 188, name: '玛狃拉', type: 'ICE', emoji: '😼', hp: 70, atk: 120, def: 65 },
  { id: 189, name: '自爆磁怪', type: 'ELECTRIC', emoji: '🧲', hp: 70, atk: 70, def: 115 },
  { id: 190, name: '超甲狂犀', type: 'ROCK', emoji: '🦏', hp: 115, atk: 140, def: 130 },
  { id: 191, name: '巨蔓藤', type: 'GRASS', emoji: '🧶', hp: 100, atk: 100, def: 125 },
  { id: 192, name: '电击魔兽', type: 'ELECTRIC', emoji: '🦍', hp: 75, atk: 123, def: 67 },
  { id: 193, name: '鸭嘴炎兽', type: 'FIRE', emoji: '🔥', hp: 75, atk: 95, def: 67 },
  { id: 194, name: '波克基斯', type: 'FAIRY', emoji: '🕊️', hp: 85, atk: 50, def: 95 },
  { id: 195, name: '远古巨廷', type: 'BUG', emoji: '🦗', hp: 86, atk: 76, def: 86 },
  { id: 196, name: '叶伊布', type: 'GRASS', emoji: '🍃', hp: 65, atk: 110, def: 130 },
  { id: 197, name: '冰伊布', type: 'ICE', emoji: '❄️', hp: 65, atk: 60, def: 110 },
  { id: 198, name: '天蝎王', type: 'GROUND', emoji: '🦇', hp: 75, atk: 95, def: 125 },
  { id: 199, name: '象牙猪', type: 'ICE', emoji: '🐗', hp: 110, atk: 130, def: 80 },
  { id: 200, name: '大宇怪', type: 'PSYCHIC', emoji: '👽', hp: 75, atk: 75, def: 75 },
  
  // --- 新增 50 种随机生成的精灵 (ID 201-250) ---
  { id: 201, name: '熔岩蜗牛', type: 'FIRE', emoji: '🐌', hp: 50, atk: 50, def: 100, evo: 202, evoLvl: 30 },
  { id: 202, name: '熔岩巨像', type: 'FIRE', emoji: '🌋', hp: 80, atk: 80, def: 150 },
  { id: 203, name: '雪虫', type: 'ICE', emoji: '🐛', hp: 40, atk: 40, def: 40, evo: 204, evoLvl: 25 },
  { id: 204, name: '极光蛾', type: 'ICE', emoji: '🦋', hp: 70, atk: 100, def: 70 },
  { id: 205, name: '铁甲犀牛II', type: 'STEEL', emoji: '🦏', hp: 60, atk: 60, def: 100, evo: 206, evoLvl: 40 },
  { id: 206, name: '合金暴龙', type: 'STEEL', emoji: '🦖', hp: 95, atk: 125, def: 105 },
  { id: 207, name: '幻影猫', type: 'GHOST', emoji: '🐈‍⬛', hp: 50, atk: 70, def: 40, evo: 208, evoLvl: 30 },
  { id: 208, name: '暗影刺客', type: 'GHOST', emoji: '🥷', hp: 60, atk: 130, def: 60 },
  { id: 209, name: '雷鸣鸟', type: 'ELECTRIC', emoji: '🐦', hp: 50, atk: 70, def: 50, evo: 210, evoLvl: 35 },
  { id: 210, name: '雷电法王', type: 'ELECTRIC', emoji: '🧙‍♂️', hp: 70, atk: 135, def: 70 },
  { id: 211, name: '深海灯笼', type: 'WATER', emoji: '🏮', hp: 80, atk: 60, def: 60, evo: 212, evoLvl: 32 },
  { id: 212, name: '深海巨兽', type: 'WATER', emoji: '🦑', hp: 100, atk: 90, def: 90 },
  { id: 213, name: '拳击袋鼠', type: 'FIGHT', emoji: '🦘', hp: 60, atk: 80, def: 50, evo: 214, evoLvl: 28 },
  { id: 214, name: '格斗大师', type: 'FIGHT', emoji: '🥋', hp: 90, atk: 120, def: 85 },
  { id: 215, name: '翡翠龙', type: 'DRAGON', emoji: '🐉', hp: 70, atk: 80, def: 70, evo: 216, evoLvl: 45 },
  { id: 216, name: '终极龙', type: 'DRAGON', emoji: '🐲', hp: 110, atk: 140, def: 110 },
  { id: 217, name: '花仙子', type: 'FAIRY', emoji: '🧚‍♀️', hp: 50, atk: 60, def: 60, evo: 218, evoLvl: 25 },
  { id: 218, name: '月亮神', type: 'FAIRY', emoji: '🌙', hp: 110, atk: 100, def: 130 },
  { id: 219, name: '泥巴怪', type: 'GROUND', emoji: '💩', hp: 70, atk: 60, def: 60, evo: 220, evoLvl: 30 },
  { id: 220, name: '大地之母', type: 'GROUND', emoji: '👵', hp: 120, atk: 80, def: 110 },
  { id: 221, name: '超能球', type: 'PSYCHIC', emoji: '🔮', hp: 40, atk: 80, def: 40, evo: 222, evoLvl: 35 },
  { id: 222, name: '念力王', type: 'PSYCHIC', emoji: '🧠', hp: 80, atk: 125, def: 80 },
  { id: 223, name: '镰刀螳螂', type: 'BUG', emoji: '🦗', hp: 60, atk: 100, def: 60, evo: 224, evoLvl: 30 },
  { id: 224, name: '钢甲虫', type: 'STEEL', emoji: '🐞', hp: 65, atk: 95, def: 125 },
  { id: 225, name: '岩石巨人', type: 'ROCK', emoji: '🗿', hp: 80, atk: 80, def: 100, evo: 226, evoLvl: 40 },
  { id: 226, name: '钻石兽', type: 'ROCK', emoji: '💎', hp: 70, atk: 80, def: 150 },
  { id: 227, name: '风暴云', type: 'FLYING', emoji: '☁️', hp: 60, atk: 80, def: 50, evo: 228, evoLvl: 35 },
  { id: 228, name: '天空霸主', type: 'FLYING', emoji: '🦅', hp: 90, atk: 115, def: 80 },
  { id: 229, name: '剧毒蛇', type: 'POISON', emoji: '🐍', hp: 50, atk: 70, def: 50, evo: 230, evoLvl: 28 },
  { id: 230, name: '毒气弹', type: 'POISON', emoji: '💣', hp: 70, atk: 110, def: 70 },
  { id: 231, name: '普通的狗', type: 'NORMAL', emoji: '🐕', hp: 50, atk: 60, def: 50, evo: 232, evoLvl: 20 },
  { id: 232, name: '丛林猎手', type: 'GRASS', emoji: '🐆', hp: 75, atk: 115, def: 70 },
  { id: 233, name: '太阳神', type: 'FIRE', emoji: '☀️', hp: 110, atk: 130, def: 100 },
  { id: 234, name: '冰霜巨龙', type: 'ICE', emoji: '🦕', hp: 100, atk: 110, def: 95 },
  { id: 235, name: '海啸王', type: 'WATER', emoji: '🌊', hp: 90, atk: 105, def: 90 },
  { id: 236, name: '幽灵船长', type: 'GHOST', emoji: '🏴‍☠️', hp: 85, atk: 110, def: 85 },
  { id: 237, name: '超能猫', type: 'PSYCHIC', emoji: '🐱', hp: 65, atk: 100, def: 65 },
  { id: 238, name: '毒液怪', type: 'POISON', emoji: '🧪', hp: 80, atk: 90, def: 90 },
  { id: 239, name: '蜘蛛女皇', type: 'BUG', emoji: '🕷️', hp: 75, atk: 105, def: 75 },
  { id: 240, name: '普通熊', type: 'NORMAL', emoji: '🐻', hp: 80, atk: 90, def: 70, evo: 241, evoLvl: 35 },
  { id: 241, name: '懒惰王', type: 'NORMAL', emoji: '🛌', hp: 140, atk: 140, def: 80 },
  { id: 242, name: '火凤凰', type: 'FIRE', emoji: '🦚', hp: 95, atk: 120, def: 95 },
  { id: 243, name: '雪人王', type: 'ICE', emoji: '⛄', hp: 110, atk: 100, def: 90 },
  { id: 244, name: '妖精龙', type: 'DRAGON', emoji: '🦎', hp: 85, atk: 105, def: 85 },
  { id: 245, name: '治愈花', type: 'GRASS', emoji: '🌼', hp: 90, atk: 70, def: 90 },
  { id: 246, name: '章鱼博士', type: 'WATER', emoji: '🐙', hp: 80, atk: 110, def: 80 },
  { id: 247, name: '电磁怪', type: 'ELECTRIC', emoji: '🧲', hp: 70, atk: 90, def: 110 },
  { id: 248, name: '沙漠暴君', type: 'GROUND', emoji: '🦂', hp: 95, atk: 115, def: 95 },
  { id: 249, name: '音速鸟', type: 'FLYING', emoji: '🕊️', hp: 65, atk: 105, def: 65 },
  { id: 250, name: '陨石怪', type: 'ROCK', emoji: '☄️', hp: 85, atk: 100, def: 100 },
  { id: 251, name: '大力神', type: 'FIGHT', emoji: '💪', hp: 100, atk: 130, def: 90 },
  { id: 252, name: '圣甲虫', type: 'BUG', emoji: '🪲', hp: 75, atk: 85, def: 115 },
  { id: 253, name: '欧米茄', type: 'STEEL', emoji: '🤖', hp: 120, atk: 120, def: 120 }
];
// ==========================================
// [新增] 30只 远古神兽/圣兽 (ID 254-283)
// ==========================================
const GOD_PETS = [
  { id: 254, name: '起源之光', type: 'GOD', emoji: '✨', desc: '万物的起源' },
  { id: 255, name: '终焉之暗', type: 'GHOST', emoji: '⚫', desc: '吞噬一切的虚无' },
  { id: 256, name: '日轮神', type: 'FIRE', emoji: '☀️', desc: '太阳的化身' },
  { id: 257, name: '月华神', type: 'FAIRY', emoji: '🌙', desc: '月亮的守护者' },
  { id: 258, name: '星界龙王', type: 'DRAGON', emoji: '🪐', desc: '穿梭星系的巨龙' },
  { id: 259, name: '大地泰坦', type: 'GROUND', emoji: '🗿', desc: '支撑大陆的巨人' },
  { id: 260, name: '深海利维坦', type: 'WATER', emoji: '🐋', desc: '引发海啸的巨兽' },
  { id: 261, name: '天空主宰', type: 'FLYING', emoji: '🦅', desc: '统治苍穹的霸主' },
  { id: 262, name: '雷霆宙斯', type: 'ELECTRIC', emoji: '⚡', desc: '掌控雷罚的神明' },
  { id: 263, name: '极寒冰帝', type: 'ICE', emoji: '❄️', desc: '冻结时间的帝王' },
  { id: 264, name: '生命之树', type: 'GRASS', emoji: '🌳', desc: '赋予万物生机' },
  { id: 265, name: '死亡之翼', type: 'GHOST', emoji: '💀', desc: '带来凋零的使者' },
  { id: 266, name: '时光守护者', type: 'PSYCHIC', emoji: '⏳', desc: '穿梭过去未来' },
  { id: 267, name: '空间撕裂者', type: 'PSYCHIC', emoji: '🌌', desc: '斩断维度的利刃' },
  { id: 268, name: '混沌魔君', type: 'POISON', emoji: '👿', desc: '混乱与无序的源头' },
  { id: 269, name: '秩序圣骑', type: 'STEEL', emoji: '🛡️', desc: '绝对的正义与法则' },
  { id: 270, name: '武斗神', type: 'FIGHT', emoji: '👊', desc: '武道的极致' },
  { id: 271, name: '元素领主', type: 'NORMAL', emoji: '🎨', desc: '融合所有元素之力' },
  { id: 272, name: '机械降神', type: 'STEEL', emoji: '🤖', desc: '超越生物的科技顶点' },
  { id: 273, name: '梦境编织者', type: 'FAIRY', emoji: '🦄', desc: '编织现实与梦境' },
  { id: 274, name: '深渊凝视者', type: 'GHOST', emoji: '👁️', desc: '来自深渊的恐怖' },
  { id: 275, name: '熔岩魔神', type: 'FIRE', emoji: '🌋', desc: '沐浴岩浆的魔神' },
  { id: 276, name: '风暴之怒', type: 'FLYING', emoji: '🌪️', desc: '永不停息的飓风' },
  { id: 277, name: '剧毒母皇', type: 'POISON', emoji: '🕷️', desc: '万毒之祖' },
  { id: 278, name: '金刚不坏', type: 'ROCK', emoji: '💎', desc: '永恒不灭的躯体' },
  { id: 279, name: '幻影之王', type: 'PSYCHIC', emoji: '🎭', desc: '真假难辨的幻术' },
  { id: 280, name: '虫群之心', type: 'BUG', emoji: '🦗', desc: '统御亿万虫群' },
  { id: 281, name: '斩铁剑圣', type: 'STEEL', emoji: '⚔️', desc: '一剑开天' },
  { id: 282, name: '治愈女神', type: 'HEAL', emoji: '🧚‍♀️', desc: '抚平一切伤痛' },
  { id: 283, name: '创世元灵', type: 'GOD', emoji: '💠', desc: '一切的开始与结束' }
];
// ==========================================
// [新增] 填补 ID 284-300 的全新进化链
// 包含 5 组三段进化 + 1 组二段进化
// ==========================================
const NEW_EVO_CHAINS = [
  // --- 1. 幽灵/火系：鬼火链 (高特攻/高速度) ---
  { id: 284, name: '鬼火球', type: 'GHOST', emoji: '🔥', hp: 40, atk: 60, def: 40, evo: 285, evoLvl: 18, desc: '徘徊在墓地的微弱火苗' },
  { id: 285, name: '噬魂灯笼', type: 'GHOST', emoji: '🏮', hp: 65, atk: 90, def: 60, evo: 286, evoLvl: 38, desc: '会吸取路人灵魂的灯笼' },
  { id: 286, name: '冥界鬼王', type: 'FIRE', emoji: '👹', hp: 85, atk: 135, def: 85, desc: '统御万鬼的炼狱霸主' },

  // --- 2. 冰/钢系：极寒链 (高防御/高HP) ---
  { id: 287, name: '冰棱锥', type: 'ICE', emoji: '💎', hp: 50, atk: 40, def: 70, evo: 288, evoLvl: 20, desc: '坚硬的万年玄冰碎片' },
  { id: 288, name: '冰霜巨像', type: 'ICE', emoji: '⛄', hp: 80, atk: 70, def: 100, evo: 289, evoLvl: 45, desc: '不知疲倦的极寒守卫' },
  { id: 289, name: '永恒要塞', type: 'STEEL', emoji: '🏯', hp: 110, atk: 90, def: 150, desc: '无法被攻破的移动堡垒' },

  // --- 3. 电/超能系：脑波链 (极高特攻/脆皮) ---
  { id: 290, name: '脑波水母', type: 'ELECTRIC', emoji: '👾', hp: 35, atk: 65, def: 35, evo: 291, evoLvl: 22, desc: '通过电流交流的浮游生物' },
  { id: 291, name: '神经网络', type: 'PSYCHIC', emoji: '🧠', hp: 55, atk: 95, def: 55, evo: 292, evoLvl: 42, desc: '数千个大脑连接而成的网络' },
  { id: 292, name: '宇宙主脑', type: 'PSYCHIC', emoji: '👁️', hp: 75, atk: 145, def: 75, desc: '全知全能的各种族智慧顶点' },

  // --- 4. 虫/毒系：瘟疫链 (高攻击/异常状态) ---
  { id: 293, name: '寄生幼虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 55, def: 45, evo: 294, evoLvl: 15, desc: '潜伏在暗处的危险幼虫' },
  { id: 294, name: '尸骨魔茧', type: 'POISON', emoji: '🏺', hp: 60, atk: 40, def: 110, evo: 295, evoLvl: 35, desc: '散发着剧毒气体的硬茧' },
  { id: 295, name: '瘟疫领主', type: 'POISON', emoji: '🦂', hp: 95, atk: 130, def: 95, desc: '所过之处寸草不生的毒皇' },

  // --- 5. 地面/格斗系：掘地链 (高物攻/高HP) ---
  { id: 296, name: '掘地小子', type: 'GROUND', emoji: '👷', hp: 50, atk: 60, def: 50, evo: 297, evoLvl: 25, desc: '整天拿着铲子挖洞的少年' },
  { id: 297, name: '钻头狂人', type: 'GROUND', emoji: '🔩', hp: 80, atk: 90, def: 70, evo: 298, evoLvl: 48, desc: '双手改造成钻头的疯狂矿工' },
  { id: 298, name: '地心破坏者', type: 'FIGHT', emoji: '🚜', hp: 120, atk: 140, def: 100, desc: '能粉碎地壳的究极兵器' },

  // --- 6. 妖精/龙系：虹光链 (二段进化，准神级) ---
  { id: 299, name: '幼龙仙子', type: 'FAIRY', emoji: '🦎', hp: 60, atk: 70, def: 60, evo: 300, evoLvl: 55, desc: '传说中诞生于彩虹的幼龙' },
  { id: 300, name: '虹光龙神', type: 'DRAGON', emoji: '🌈', hp: 100, atk: 135, def: 100, desc: '驾驭七色光芒的梦幻龙神' }
];
// ==========================================
// [新增] 30只 强力进化型 (ID 301-330)
// 这些是为原版较弱精灵设计的终极进化，数值接近准神
// ==========================================
const EXTRA_EVOS = [
  { id: 301, name: '远古巨蔓藤', type: 'GRASS', emoji: '🌳', hp: 110, atk: 120, def: 130, desc: '藤蔓怪的古代形态' },
  { id: 302, name: '炼狱狮王', type: 'FIRE', emoji: '🦁', hp: 100, atk: 145, def: 90, desc: '爆爆狮的觉醒形态' },
  { id: 303, name: '极地帝企鹅', type: 'ICE', emoji: '🐧', hp: 100, atk: 110, def: 100, desc: '统御冰原的皇帝' },
  { id: 304, name: '雷霆飞鼠', type: 'ELECTRIC', emoji: '🦇', hp: 80, atk: 120, def: 80, desc: '速度超越闪电' },
  { id: 305, name: '风暴雷神', type: 'ELECTRIC', emoji: '🌩️', hp: 90, atk: 135, def: 90, desc: '驾驭风暴的化身' },
  { id: 306, name: '量子反应堆', type: 'STEEL', emoji: '☢️', hp: 90, atk: 90, def: 150, desc: '无限能源的核心' },
  { id: 307, name: '皇家狮鹫', type: 'NORMAL', emoji: '🦅', hp: 95, atk: 125, def: 95, desc: '贵族猫的究极进化' },
  { id: 308, name: '泰坦巨熊', type: 'NORMAL', emoji: '🐻', hp: 180, atk: 140, def: 100, desc: '撼动大地的力量' },
  { id: 309, name: '巫毒人偶王', type: 'GHOST', emoji: '🎎', hp: 80, atk: 150, def: 80, desc: '诅咒之力的顶点' },
  { id: 310, name: '大地撕裂者', type: 'GROUND', emoji: '💅', hp: 100, atk: 145, def: 120, desc: '钢爪王的完全体' },
  { id: 311, name: '天空霸主龙', type: 'ROCK', emoji: '🐲', hp: 100, atk: 135, def: 95, desc: '化石翼龙的返祖形态' },
  { id: 312, name: '污泥魔神', type: 'GROUND', emoji: '🦠', hp: 130, atk: 110, def: 110, desc: '沼泽怪的变异体' },
  { id: 313, name: '冰霜女皇', type: 'ICE', emoji: '👑', hp: 90, atk: 130, def: 90, desc: '雪妖女的最终形态' },
  { id: 314, name: '齐天大圣', type: 'FIRE', emoji: '🐵', hp: 100, atk: 150, def: 100, desc: '斗战胜佛的真身' },
  { id: 315, name: '影流之主', type: 'WATER', emoji: '🥷', hp: 90, atk: 140, def: 80, desc: '忍蛙的禁忌形态' },
  { id: 316, name: '梦幻凤蝶', type: 'BUG', emoji: '🦋', hp: 90, atk: 120, def: 90, desc: '巴大蝶的幻之形态' },
  { id: 317, name: '吸血魔蝠', type: 'POISON', emoji: '🧛', hp: 100, atk: 115, def: 100, desc: '大嘴蝠的暗夜形态' },
  { id: 318, name: '腐化食人花', type: 'GRASS', emoji: '🌺', hp: 110, atk: 120, def: 110, desc: '霸王花的剧毒变种' },
  { id: 319, name: '暗夜猎豹', type: 'NORMAL', emoji: '🐆', hp: 90, atk: 130, def: 90, desc: '猫老大的狩猎形态' },
  { id: 320, name: '狂暴牛魔', type: 'NORMAL', emoji: '🐂', hp: 110, atk: 140, def: 110, desc: '肯泰罗的狂化形态' },
  { id: 321, name: '丰饶女神', type: 'NORMAL', emoji: '🐄', hp: 140, atk: 100, def: 130, desc: '大奶罐的神圣形态' },
  { id: 322, name: '极光海龙', type: 'ICE', emoji: '🐉', hp: 150, atk: 110, def: 110, desc: '拉普拉斯的龙化形态' },
  { id: 323, name: '拟态之神', type: 'NORMAL', emoji: '🫠', hp: 120, atk: 100, def: 100, desc: '百变怪的完美形态' },
  { id: 324, name: '赛博主脑', type: 'NORMAL', emoji: '🧠', hp: 100, atk: 160, def: 90, desc: '多边兽Z的最终升级' },
  { id: 325, name: '深海克拉肯', type: 'ROCK', emoji: '🦑', hp: 100, atk: 120, def: 140, desc: '多刺菊石兽的古神形态' },
  { id: 326, name: '虚空掠夺者', type: 'ROCK', emoji: '🦂', hp: 90, atk: 150, def: 110, desc: '镰刀盔的虚空形态' },
  { id: 327, name: '虫群主宰', type: 'BUG', emoji: '🐝', hp: 100, atk: 110, def: 130, desc: '蜂女王的统御形态' },
  { id: 328, name: '闪电松鼠王', type: 'ELECTRIC', emoji: '🐿️', hp: 90, atk: 100, def: 120, desc: '帕奇利兹的巨大化' },
  { id: 329, name: '樱花女神', type: 'GRASS', emoji: '🌸', hp: 100, atk: 120, def: 100, desc: '樱花儿的绽放形态' },
  { id: 330, name: '四臂修罗', type: 'NORMAL', emoji: '👹', hp: 100, atk: 140, def: 90, desc: '双尾怪手的修罗形态' }
];
// ==========================================
// [新增] 10只 终极神兽 (ID 331-340)
// 压轴登场的宇宙级存在
// ==========================================
const FINAL_GODS = [
  { id: 331, name: '时光沙漏', type: 'STEEL', emoji: '⏳', hp: 120, atk: 100, def: 150, desc: '掌控时间流逝的永恒机械' },
  { id: 332, name: '维度魔神', type: 'PSYCHIC', emoji: '🌌', hp: 110, atk: 160, def: 90, desc: '来自高维空间的不可名状之物' },
  { id: 333, name: '瘟疫之源', type: 'POISON', emoji: '🦠', hp: 130, atk: 110, def: 130, desc: '散播终极病毒的灭世者' },
  { id: 334, name: '雷霆领主', type: 'ELECTRIC', emoji: '⛈️', hp: 100, atk: 155, def: 100, desc: '居住在雷暴中心的闪电化身' },
  { id: 335, name: '沧海之王', type: 'WATER', emoji: '🔱', hp: 140, atk: 130, def: 110, desc: '统御四海的波塞冬' },
  { id: 336, name: '天空之神', type: 'FLYING', emoji: '🌪️', hp: 100, atk: 150, def: 100, desc: '永远漂浮在平流层的风暴之眼' },
  { id: 337, name: '崩山巨兽', type: 'GROUND', emoji: '🏔️', hp: 150, atk: 140, def: 140, desc: '一步就能引发地震的巨兽' },
  { id: 338, name: '摄魂死神', type: 'GHOST', emoji: '💀', hp: 90, atk: 170, def: 90, desc: '收割万物灵魂的终结者' },
  { id: 339, name: '圣灵仙子', type: 'FAIRY', emoji: '🧚‍♀️', hp: 120, atk: 120, def: 120, desc: '净化世间一切邪恶的光芒' },
  { id: 340, name: '灭世魔龙', type: 'DRAGON', emoji: '🐲', hp: 130, atk: 180, def: 110, desc: '传说中将吞噬世界的终焉之龙' }
];
// ==========================================
// [新增] 2. 进化石专属进化形态 (ID 342-371)
// 均基于原本无进化或弱势的单形态精灵设计
// ==========================================
const STONE_EVO_PETS = [
  // --- 基于 ID 245 治愈花 (草) ---
  { id: 342, name: '花神', type: 'GRASS', emoji: '🌺', hp: 110, atk: 85, def: 110, desc: '治愈花使用叶之石进化' },
  // --- 基于 ID 247 电磁怪 (电) ---
  { id: 343, name: '磁力聚变兽', type: 'ELECTRIC', emoji: '⚛️', hp: 90, atk: 130, def: 100, desc: '电磁怪使用雷之石进化' },
  // --- 基于 ID 249 音速鸟 (飞) ---
  { id: 344, name: '光速神鹰', type: 'FLYING', emoji: '🦅', hp: 80, atk: 120, def: 80, desc: '音速鸟使用光之石进化' },
  // --- 基于 ID 250 陨石怪 (岩) ---
  { id: 345, name: '星际陨落', type: 'ROCK', emoji: '☄️', hp: 100, atk: 120, def: 120, desc: '陨石怪使用月之石进化' },
  // --- 基于 ID 252 圣甲虫 (虫) ---
  { id: 346, name: '太阳神甲虫', type: 'BUG', emoji: '🌞', hp: 95, atk: 135, def: 105, desc: '圣甲虫使用日之石进化' },
  // --- 基于 ID 236 幽灵船长 (鬼) ---
  { id: 347, name: '幽灵舰队', type: 'GHOST', emoji: '🚢', hp: 120, atk: 110, def: 110, desc: '幽灵船长使用暗之石进化' },
  // --- 基于 ID 237 超能猫 (超) ---
  { id: 348, name: '预言猫', type: 'PSYCHIC', emoji: '🔮', hp: 85, atk: 125, def: 85, desc: '超能猫使用觉醒石进化' },
  // --- 基于 ID 238 毒液怪 (毒) ---
  { id: 349, name: '毒液共生体', type: 'POISON', emoji: '🦠', hp: 130, atk: 100, def: 100, desc: '毒液怪使用暗之石进化' },
  // --- 基于 ID 239 蜘蛛女皇 (虫) -> 变异为冰 ---
  { id: 350, name: '冰晶蛛后', type: 'ICE', emoji: '🕸️', hp: 90, atk: 115, def: 90, desc: '蜘蛛女皇使用冰之石进化' },
  // --- 基于 ID 246 章鱼博士 (水) ---
  { id: 351, name: '深海克苏鲁', type: 'WATER', emoji: '🐙', hp: 110, atk: 120, def: 110, desc: '章鱼博士使用水之石进化' },
  // --- 基于 ID 248 沙漠暴君 (地) -> 玻璃化为火 ---
  { id: 352, name: '晶化暴君', type: 'FIRE', emoji: '🦂', hp: 100, atk: 130, def: 100, desc: '沙漠暴君使用火之石进化' },
  // --- 基于 ID 251 大力神 (斗) ---
  { id: 353, name: '泰坦神', type: 'FIGHT', emoji: '🗿', hp: 120, atk: 150, def: 100, desc: '大力神使用觉醒石进化' },
  // --- 基于 ID 200 大宇怪 (超) ---
  { id: 354, name: '灰人首领', type: 'PSYCHIC', emoji: '👽', hp: 95, atk: 115, def: 95, desc: '大宇怪使用月之石进化' },
  // --- 基于 ID 195 远古巨廷 (虫) ---
  { id: 355, name: '史前霸主', type: 'BUG', emoji: '🦖', hp: 105, atk: 125, def: 105, desc: '远古巨廷使用叶之石进化' },
  // --- 基于 ID 185 龙王蝎 (毒) ---
  { id: 356, name: '深渊魔蝎', type: 'POISON', emoji: '🦂', hp: 90, atk: 130, def: 120, desc: '龙王蝎使用暗之石进化' },
  // --- 基于 ID 178 梦妖魔 (鬼) ---
  { id: 357, name: '幻梦魔女', type: 'GHOST', emoji: '🧙‍♀️', hp: 80, atk: 120, def: 80, desc: '梦妖魔使用觉醒石进化' },
  // --- 基于 ID 137 卡比兽 (普) ---
  { id: 358, name: '暴食君王', type: 'NORMAL', emoji: '👑', hp: 180, atk: 130, def: 90, desc: '卡比兽使用觉醒石进化' },
  // --- 基于 ID 116 臭臭花 (毒) -> 分支进化 ---
  { id: 359, name: '美丽花', type: 'GRASS', emoji: '💃', hp: 85, atk: 90, def: 100, desc: '臭臭花使用日之石进化' },
  // --- 基于 ID 61 星光舞者 (妖) ---
  { id: 360, name: '月光女神', type: 'FAIRY', emoji: '🌙', hp: 90, atk: 110, def: 90, desc: '星光舞者使用月之石进化' },
  // --- 基于 ID 86 古铜钟 (钢) ---
  { id: 361, name: '古文明遗物', type: 'STEEL', emoji: '🔔', hp: 90, atk: 100, def: 140, desc: '古铜钟使用觉醒石进化' },
  // --- 基于 ID 14 燃煤怪 (火) -> 分支 ---
  { id: 362, name: '蒸汽机车', type: 'FIRE', emoji: '🚂', hp: 100, atk: 110, def: 120, desc: '燃煤怪使用火之石进化' },
  // --- 基于 ID 31 静电球 (电) -> 分支 ---
  { id: 363, name: '球状闪电', type: 'ELECTRIC', emoji: '⚡', hp: 70, atk: 130, def: 70, desc: '静电球使用雷之石进化' },
  // --- 基于 ID 118 喵喵 (普) -> 分支 ---
  { id: 364, name: '招财金猫', type: 'NORMAL', emoji: '💰', hp: 80, atk: 90, def: 80, desc: '喵喵使用光之石进化' },
  // --- 基于 ID 133 菊石兽 (岩) -> 分支 ---
  { id: 365, name: '鹦鹉螺神', type: 'ROCK', emoji: '🐚', hp: 90, atk: 100, def: 130, desc: '菊石兽使用水之石进化' },
  // --- 基于 ID 135 化石盔 (岩) -> 分支 ---
  { id: 366, name: '三叶虫王', type: 'ROCK', emoji: '🪳', hp: 80, atk: 125, def: 105, desc: '化石盔使用水之石进化' },
  // --- 基于 ID 161 姆克儿 (飞) -> 分支 ---
  { id: 367, name: '白鸽信使', type: 'FLYING', emoji: '🕊️', hp: 70, atk: 90, def: 70, desc: '姆克儿使用光之石进化' },
  // --- 基于 ID 41 信使鸟 (飞) -> 强化 ---
  { id: 368, name: '圣诞老人', type: 'ICE', emoji: '🎅', hp: 100, atk: 100, def: 100, desc: '信使鸟使用冰之石进化' },
  // --- 基于 ID 125 伊布 (普) -> 仙子伊布 ---
  { id: 369, name: '仙子伊布', type: 'FAIRY', emoji: '🎀', hp: 95, atk: 110, def: 130, desc: '伊布使用光之石进化' },
  // --- 基于 ID 201 熔岩蜗牛 (火) ---
  { id: 370, name: '岩浆巨像', type: 'FIRE', emoji: '🌋', hp: 90, atk: 90, def: 160, desc: '熔岩蜗牛使用火之石进化' },
  // --- 基于 ID 203 雪虫 (冰) ---
  { id: 371, name: '冰雪女王', type: 'ICE', emoji: '👑', hp: 80, atk: 125, def: 80, desc: '雪虫使用觉醒石进化' }
];
const TIME_WEATHER_PETS = [
  // ------------------------------------------------------
  // [组1：昼夜双子] 同一种幼体，根据时间进化为不同形态
  // ------------------------------------------------------
  { id: 381, name: '时之沙', type: 'NORMAL', emoji: '⏳', hp: 45, atk: 45, def: 45, evo: 382, evoLvl: 20, evoAlt: [{ target: 383, condition: { time: 'NIGHT' } }], desc: '身体里流淌着时间的沙砾，对光线非常敏感' },
  // 白天进化 -> 光系战士
  { id: 382, name: '晨曦卫士', type: 'FIGHT', emoji: '🌞', hp: 80, atk: 110, def: 70, evoCondition: { time: 'DAY' }, desc: '只在白天进化。吸收阳光作为铠甲，正义感极强' },
  // 夜晚进化 -> 暗系刺客
  { id: 383, name: '暮夜行者', type: 'DARK', emoji: '🥷', hp: 70, atk: 120, def: 60, evoCondition: { time: 'NIGHT' }, desc: '只在夜晚进化。潜伏在阴影中，无声无息' },

  // ------------------------------------------------------
  // [组2：天气预报员] 漂浮泡泡的远亲，根据天气变异
  // ------------------------------------------------------
  { id: 384, name: '云团团', type: 'FLYING', emoji: '☁️', hp: 50, atk: 40, def: 40, evo: 385, evoLvl: 25, evoAlt: [{ target: 386, condition: { weather: 'SUN' } }, { target: 387, condition: { weather: 'SNOW' } }], desc: '一团不稳定的水汽，极易受天气影响' },
  // 雨天 -> 暴风雨形态
  { id: 385, name: '雷雨君主', type: 'ELECTRIC', emoji: '⛈️', hp: 85, atk: 105, def: 80, evoCondition: { weather: 'RAIN' }, desc: '在暴雨中吸收雷电进化，性格暴躁' },
  // 晴天 -> 热气球形态
  { id: 386, name: '热能气旋', type: 'FIRE', emoji: '🎈', hp: 90, atk: 90, def: 90, evoCondition: { weather: 'SUN' }, desc: '在烈日下膨胀进化，体内充满高压热气' },
  // 雪天 -> 冰晶形态
  { id: 387, name: '绝对零度', type: 'ICE', emoji: '❄️', hp: 70, atk: 80, def: 130, evoCondition: { weather: 'SNOW' }, desc: '在冰雹中凝结进化，防御力极高' },

  // ------------------------------------------------------
  // [组3：黄昏的挽歌] 只能在黄昏(15分钟窗口期)进化的幽灵
  // ------------------------------------------------------
  { id: 388, name: '迷途灵', type: 'GHOST', emoji: '👻', hp: 40, atk: 60, def: 40, evo: 389, evoLvl: 30, desc: '在逢魔之时徘徊的弱小灵体' },
  { id: 389, name: '黄昏钟摆', type: 'STEEL', emoji: '🕰️', hp: 70, atk: 90, def: 90, evo: 390, evoLvl: 45, evoCondition: { time: 'DUSK' }, desc: '只在黄昏进化。身体变成了古老的时钟' },
  { id: 390, name: '终焉时刻', type: 'GHOST', emoji: '⚰️', hp: 90, atk: 130, def: 100, evoCondition: { time: 'DUSK' }, desc: '敲响丧钟的死神，掌控着时间的终结' },

  // ------------------------------------------------------
  // [组4：沙漠的霸主] 需沙暴天气进化
  // ------------------------------------------------------
  { id: 391, name: '沙丘虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 55, def: 60, evo: 392, evoLvl: 22, desc: '躲在沙子底下的虫子' },
  { id: 392, name: '岩壳蛹', type: 'ROCK', emoji: '🪨', hp: 60, atk: 40, def: 110, evo: 393, evoLvl: 40, evoCondition: { weather: 'SAND' }, desc: '在沙暴中磨砺外壳，坚硬无比' },
  { id: 393, name: '荒漠暴君', type: 'GROUND', emoji: '🦂', hp: 95, atk: 135, def: 115, evoCondition: { weather: 'SAND' }, desc: '沙暴的化身，能瞬间制造流沙陷阱' },

  // ------------------------------------------------------
  // [组5：极光的恩赐] 需夜晚+冰雹 (极难条件)
  // ------------------------------------------------------
  { id: 394, name: '星光海豹', type: 'WATER', emoji: '🦭', hp: 60, atk: 50, def: 50, evo: 395, evoLvl: 35, desc: '喜欢仰望星空的小海豹' },
  { id: 395, name: '极光海妖', type: 'ICE', emoji: '🧜‍♀️', hp: 100, atk: 120, def: 95, evoCondition: { time: 'NIGHT', weather: 'SNOW' }, desc: '只有在飘雪的夜晚才会进化，美丽而致命' },

  // ------------------------------------------------------
  // [组6：光合作用] 需白天+大晴天
  // ------------------------------------------------------
  { id: 396, name: '枯萎草', type: 'GRASS', emoji: '🍂', hp: 30, atk: 30, def: 30, evo: 397, evoLvl: 20, desc: '极度缺乏能量，看起来快枯死了' },
  { id: 397, name: '复苏之叶', type: 'GRASS', emoji: '🌿', hp: 60, atk: 70, def: 60, evo: 398, evoLvl: 40, evoCondition: { time: 'DAY', weather: 'SUN' }, desc: '在烈日下获得了新生' },
  { id: 398, name: '太阳神木', type: 'GRASS', emoji: '🌳', hp: 110, atk: 100, def: 110, evoCondition: { time: 'DAY', weather: 'SUN' }, desc: '吸收了过量的太阳能，树冠如火焰般燃烧' },

  // ------------------------------------------------------
  // [组7：情感的羁绊] 纯亲密度进化 (需 Intimacy > 220)
  // ------------------------------------------------------
  { id: 399, name: '黏人猫', type: 'NORMAL', emoji: '🐱', hp: 50, atk: 60, def: 50, evo: 400, evoLvl: 1, evoCondition: { intimacy: 220 }, desc: '一刻也不想离开主人的小猫' },
  { id: 400, name: '心灵伴侣', type: 'PSYCHIC', emoji: '😻', hp: 85, atk: 115, def: 85, desc: '与训练家心灵相通，能预知主人的想法' },

  { id: 401, name: '护主犬', type: 'NORMAL', emoji: '🐶', hp: 55, atk: 65, def: 55, evo: 402, evoLvl: 1, evoCondition: { intimacy: 220 }, desc: '为了保护主人敢于挑战强敌' },
  { id: 402, name: '圣盾骑士', type: 'STEEL', emoji: '🛡️', hp: 90, atk: 100, def: 130, desc: '化身为守护之盾，防御力惊人' },

  // ------------------------------------------------------
  // [组8：被遗弃的怨念] 低亲密度进化 (需 Intimacy < 50，设定上很难达成)
  // 这里为了游戏性，改为：夜晚 + 亲密度 >= 100 (安抚怨灵)
  // ------------------------------------------------------
  { id: 403, name: '破布偶', type: 'GHOST', emoji: '🧸', hp: 40, atk: 80, def: 30, evo: 404, evoLvl: 30, desc: '被遗弃的玩偶，充满了怨气' },
  { id: 404, name: '复仇傀儡', type: 'GHOST', emoji: '🔪', hp: 60, atk: 110, def: 60, evo: 405, evoLvl: 50, evoCondition: { time: 'NIGHT', intimacy: 150 }, desc: '被爱感化后进化。虽然外表可怕，但发誓守护主人' },
  { id: 405, name: '救赎之灵', type: 'HEAL', emoji: '🧚‍♀️', hp: 100, atk: 90, def: 120, desc: '彻底净化了怨气，转化为治愈的力量' },

  // ------------------------------------------------------
  // [组9：雨林生态] 需雨天进化
  // ------------------------------------------------------
  { id: 406, name: '青苔石', type: 'ROCK', emoji: '🪨', hp: 50, atk: 50, def: 80, evo: 407, evoLvl: 25, evoCondition: { weather: 'RAIN' }, desc: '只有在湿润环境下才会生长' },
  { id: 407, name: '丛林巨像', type: 'GRASS', emoji: '🗿', hp: 90, atk: 110, def: 100, desc: '岩石与植物的完美共生体' },

  { id: 408, name: '小水滴', type: 'WATER', emoji: '💧', hp: 30, atk: 30, def: 30, evo: 409, evoLvl: 15, evoCondition: { weather: 'RAIN' }, desc: '极其脆弱的水元素' },
  { id: 409, name: '激流之灵', type: 'WATER', emoji: '🌊', hp: 60, atk: 80, def: 60, evo: 410, evoLvl: 40, evoCondition: { weather: 'RAIN' }, desc: '在暴雨中欢快起舞' },
  { id: 410, name: '海啸领主', type: 'WATER', emoji: '🔱', hp: 100, atk: 120, def: 90, desc: '能够引发海啸的深海霸主' },

  // ------------------------------------------------------
  // [组10：星空观测者] 需夜晚进化
  // ------------------------------------------------------
  { id: 411, name: '望远镜怪', type: 'STEEL', emoji: '🔭', hp: 50, atk: 70, def: 50, evo: 412, evoLvl: 30, evoCondition: { time: 'NIGHT' }, desc: '总是盯着星星看' },
  { id: 412, name: '星轨观测站', type: 'PSYCHIC', emoji: '📡', hp: 80, atk: 130, def: 80, desc: '接收来自宇宙的神秘信号' },

  { id: 413, name: '萤火虫', type: 'BUG', emoji: '🪰', hp: 35, atk: 45, def: 35, evo: 414, evoLvl: 20, evoCondition: { time: 'NIGHT' }, desc: '尾部发出微弱的光' },
  { id: 414, name: '星光飞蛾', type: 'FAIRY', emoji: '🦋', hp: 70, atk: 100, def: 70, desc: '翅膀上的鳞粉如同星尘般闪耀' },

  // ------------------------------------------------------
  // [组11：太阳能机械] 需白天进化
  // ------------------------------------------------------
  { id: 415, name: '光能电池', type: 'ELECTRIC', emoji: '🔋', hp: 50, atk: 50, def: 60, evo: 416, evoLvl: 30, evoCondition: { time: 'DAY' }, desc: '需要阳光充电' },
  { id: 416, name: '聚能加农炮', type: 'STEEL', emoji: '🔫', hp: 80, atk: 140, def: 80, desc: '将吸收的太阳能转化为毁灭光束' },

  // ------------------------------------------------------
  // [组12：季节变换] 模拟季节 (通过天气)
  // ------------------------------------------------------
  { id: 417, name: '四季鹿', type: 'NORMAL', emoji: '🦌', hp: 60, atk: 60, def: 60, evo: 418, evoLvl: 30, evoAlt: [{ target: 419, condition: { weather: 'SNOW' } }], desc: '根据进化时的天气改变属性' },
  // 晴天进化 -> 春之鹿 (草)
  { id: 418, name: '繁花神鹿', type: 'GRASS', emoji: '🌸', hp: 95, atk: 100, def: 95, evoCondition: { weather: 'SUN' }, desc: '象征春天的到来，所过之处鲜花盛开' },
  // 雪天进化 -> 冬之鹿 (冰)
  { id: 419, name: '凛冬神鹿', type: 'ICE', emoji: '❄️', hp: 95, atk: 100, def: 95, evoCondition: { weather: 'SNOW' }, desc: '象征冬天的严寒，呼出的气息能冻结空气' },

  // ------------------------------------------------------
  // [组13：剧毒沼泽] 需雨天 (模拟湿地)
  // ------------------------------------------------------
  { id: 420, name: '泥浆怪', type: 'POISON', emoji: '💩', hp: 60, atk: 50, def: 60, evo: 421, evoLvl: 35, evoCondition: { weather: 'RAIN' }, desc: '干燥时会变硬，喜欢雨天' },
  { id: 421, name: '腐化沼泽王', type: 'POISON', emoji: '🧟', hp: 110, atk: 95, def: 100, desc: '身体由剧毒的淤泥构成' },

  // ------------------------------------------------------
  // [组14：风暴骑士] 需雨天 (模拟雷暴)
  // ------------------------------------------------------
  { id: 422, name: '静电飞鼠', type: 'ELECTRIC', emoji: '🐿️', hp: 50, atk: 70, def: 40, evo: 423, evoLvl: 30, evoCondition: { weather: 'RAIN' }, desc: '利用雷雨天的静电飞行' },
  { id: 423, name: '雷霆狮鹫', type: 'FLYING', emoji: '🦅', hp: 80, atk: 120, def: 80, desc: '驾驭雷电的神兽，速度极快' },

  // ------------------------------------------------------
  // [组15：熔岩锻造] 需大晴天 (模拟高温)
  // ------------------------------------------------------
  { id: 424, name: '铁矿石', type: 'ROCK', emoji: '🪨', hp: 60, atk: 40, def: 80, evo: 425, evoLvl: 35, evoCondition: { weather: 'SUN' }, desc: '普通的铁矿石' },
  { id: 425, name: '熔岩铠甲', type: 'FIRE', emoji: '🦾', hp: 90, atk: 110, def: 130, desc: '在高温下重铸了身体，流淌着岩浆' },

  // ------------------------------------------------------
  // [组16：极地探险家] 需冰雹
  // ------------------------------------------------------
  { id: 426, name: '登山雪人', type: 'ICE', emoji: '⛄', hp: 70, atk: 70, def: 60, evo: 427, evoLvl: 40, evoCondition: { weather: 'SNOW' }, desc: '在暴风雪中迷路的雪人' },
  { id: 427, name: '雪山守护神', type: 'ICE', emoji: '🦍', hp: 120, atk: 130, def: 100, desc: '守护着雪山的古老生物' },

  // ------------------------------------------------------
  // [组17：古代遗迹] 需沙暴
  // ------------------------------------------------------
  { id: 428, name: '陶土偶', type: 'GROUND', emoji: '🏺', hp: 50, atk: 50, def: 70, evo: 429, evoLvl: 30, evoCondition: { weather: 'SAND' }, desc: '古代文明的遗物' },
  { id: 429, name: '沙暴魔神', type: 'PSYCHIC', emoji: '🧞', hp: 80, atk: 140, def: 80, desc: '从沙暴中苏醒的古代魔神' },
  // ------------------------------------------------------
  // [组18：终极羁绊] 需满亲密度 (255) + 黄昏 (最难条件)
  // ------------------------------------------------------
  // 初始形态：流星之子
  { 
    id: 430, 
    name: '流星之子', 
    type: 'NORMAL', 
    emoji: '💫', 
    hp: 50, atk: 50, def: 50, 
    // 设定进化目标为 431
    evo: 431, 
    evoLvl: 1, // 等级不限，只要满足条件
    // 核心条件：亲密度满 + 黄昏时段
    evoCondition: { intimacy: 255, time: 'DUSK' }, 
    desc: '从天而降的微弱星光，只有在最真挚的羁绊下才会觉醒。' 
  },
  
  // 终极形态：奇迹之星
  { 
    id: 431, 
    name: '奇迹之星', 
    type: 'GOD', 
    emoji: '🌟', 
    hp: 120, atk: 120, def: 120, 
    desc: '【全服唯一】只有与训练家达到心灵合一，并在昼夜交替的奇迹时刻才能诞生的传说精灵。它代表着可能性的极限。' 
  }];

const UNIQUE_REWARD_PET = { 
  id: 341, 
  name: '暗黑超梦', 
  type: 'PSYCHIC', 
  emoji: '😈', 
  hp: 106, atk: 150, def: 90, 
  desc: '日蚀队集结全科技力量制造的终极兵器，身穿抑制力量的装甲。' 
};

// ==========================================
// [新增] 填补 ID 284-300 的全新进化链
// 包含 5 组三段进化 + 1 组二段进化
// ==========================================
// [新增] 灵晶兽家族 (ID 372-380)
// 设定：透明的晶体生物，根据石头改变属性和形态
// ==========================================
const CRYSTAL_PETS = [
  // --- 基础形态 ---
  { 
    id: 372, name: '灵晶兽', type: 'NORMAL', emoji: '💎', 
    hp: 55, atk: 55, def: 55, 
    desc: '身体由纯净水晶构成的神秘生物，体内蕴含着无限的可能性。' 
  },

  // --- 1. 火之石 -> 物理攻击型 ---
  { 
    id: 373, name: '赤红晶卫', type: 'FIRE', emoji: '🔴', 
    hp: 65, atk: 130, def: 60, 
    desc: '吸收了火焰能量，晶体变得如岩浆般滚烫，擅长粉碎敌人的物理攻击。' 
  },

  // --- 2. 水之石 -> 高HP肉盾型 ---
  { 
    id: 374, name: '碧蓝晶卫', type: 'WATER', emoji: '🔵', 
    hp: 130, atk: 65, def: 60, 
    desc: '身体如同深海般深邃，拥有极强的自我修复能力和生命力。' 
  },

  // --- 3. 雷之石 -> 极速特攻型 ---
  { 
    id: 375, name: '紫电晶卫', type: 'ELECTRIC', emoji: '⚡', 
    hp: 60, atk: 65, def: 60, 
    desc: '化作一道紫色的闪电，速度快到肉眼无法捕捉。' 
  },

  // --- 4. 叶之石 -> 物理防御型 ---
  { 
    id: 376, name: '翠绿晶卫', type: 'GRASS', emoji: '❇️', 
    hp: 65, atk: 90, def: 130, 
    desc: '与大自然融为一体，晶体表面覆盖着坚硬的藤蔓装甲。' 
  },

  // --- 5. 冰之石 -> 特殊防御型 ---
  { 
    id: 377, name: '苍白晶卫', type: 'ICE', emoji: '❄️', 
    hp: 65, atk: 60, def: 95, 
    desc: '散发着绝对零度的寒气，能冻结接近的一切，拥有极强的魔法抗性。' 
  },

  // --- 6. 月之石 -> 幽灵/干扰型 ---
  { 
    id: 378, name: '幽夜晶卫', type: 'GHOST', emoji: '🟣', 
    hp: 60, atk: 65, def: 60, 
    desc: '身体变得半透明且虚无，潜伏在阴影中收割灵魂。' 
  },

  // --- 7. 日之石 -> 超能/爆发型 ---
  { 
    id: 379, name: '辉光晶卫', type: 'PSYCHIC', emoji: '🌟', 
    hp: 60, atk: 60, def: 60, 
    desc: '折射太阳的光辉，能释放出毁灭性的精神念力波。' 
  },

  // --- 8. 暗之石 -> 毒/刺客型 ---
  { 
    id: 380, name: '黑曜晶卫', type: 'POISON', emoji: '⬛', 
    hp: 80, atk: 110, def: 75, 
    desc: '晶体变成了吸收光线的黑曜石，浑身流淌着剧毒。' 
  }
];
// ==========================================
// [新增] 3. 进化规则表 (BaseID -> { StoneID: TargetID })
// ==========================================
const STONE_EVO_RULES = {
  245: { leaf_stone: 342 }, // 治愈花 -> 花神
  247: { thunder_stone: 343 }, // 电磁怪 -> 磁力聚变兽
  249: { shiny_stone: 344 }, // 音速鸟 -> 光速神鹰
  250: { moon_stone: 345 }, // 陨石怪 -> 星际陨落
  252: { sun_stone: 346 }, // 圣甲虫 -> 太阳神甲虫
  236: { dusk_stone: 347 }, // 幽灵船长 -> 幽灵舰队
  237: { dawn_stone: 348 }, // 超能猫 -> 预言猫
  238: { dusk_stone: 349 }, // 毒液怪 -> 毒液共生体
  239: { ice_stone: 350 }, // 蜘蛛女皇 -> 冰晶蛛后
  246: { water_stone: 351 }, // 章鱼博士 -> 深海克苏鲁
  248: { fire_stone: 352 }, // 沙漠暴君 -> 晶化暴君
  251: { dawn_stone: 353 }, // 大力神 -> 泰坦神
  200: { moon_stone: 354 }, // 大宇怪 -> 灰人首领
  195: { leaf_stone: 355 }, // 远古巨廷 -> 史前霸主
  185: { dusk_stone: 356 }, // 龙王蝎 -> 深渊魔蝎
  178: { dawn_stone: 357 }, // 梦妖魔 -> 幻梦魔女
  137: { dawn_stone: 358 }, // 卡比兽 -> 暴食君王
  116: { sun_stone: 359 }, // 臭臭花 -> 美丽花
  61:  { moon_stone: 360 }, // 星光舞者 -> 月光女神
  86:  { dawn_stone: 361 }, // 古铜钟 -> 古文明遗物
  14:  { fire_stone: 362 }, // 燃煤怪 -> 蒸汽机车
  31:  { thunder_stone: 363 }, // 静电球 -> 球状闪电
  118: { shiny_stone: 364 }, // 喵喵 -> 招财金猫
  133: { water_stone: 365 }, // 菊石兽 -> 鹦鹉螺神
  135: { water_stone: 366 }, // 化石盔 -> 三叶虫王
  161: { shiny_stone: 367 }, // 姆克儿 -> 白鸽信使
  41:  { ice_stone: 368 }, // 信使鸟 -> 圣诞老人
  372: {
  fire_stone: 373,    // -> 赤红晶卫
  water_stone: 374,   // -> 碧蓝晶卫
  thunder_stone: 375, // -> 紫电晶卫
  leaf_stone: 376,    // -> 翠绿晶卫
  ice_stone: 377,     // -> 苍白晶卫
  moon_stone: 378,    // -> 幽夜晶卫
  sun_stone: 379,     // -> 辉光晶卫
  dusk_stone: 380     // -> 黑曜晶卫
},

  // ✅ 修改后的伊布进化规则 (包含太阳/月亮伊布)
125: { 
    fire_stone: 128,    // 火伊布
    water_stone: 126,   // 水伊布
    thunder_stone: 127, // 雷伊布
    leaf_stone: 196,    // 叶伊布
    ice_stone: 197,     // 冰伊布
    shiny_stone: 369,   // 仙子伊布
    sun_stone: 129,     // 太阳伊布 (新增)
    moon_stone: 130     // 月亮伊布 (新增)
}, 

  201: { fire_stone: 370 }, // 熔岩蜗牛 -> 岩浆巨像
  203: { dawn_stone: 371 } // 雪虫 -> 冰雪女王
};

// ==========================================
// [新增] 69只新精灵 (ID 432-500)
// 包含: 8组三段进化 + 12组二段进化 + 10只神兽 + 11只独立精灵
// ==========================================
const NEW_PETS_500 = [
  // === 三段进化链 ===
  // 1. 暗影猫家族 (DARK)
  { id: 432, name: '暗影幼猫', type: 'DARK', emoji: '🐈‍⬛', hp: 40, atk: 55, def: 35, evo: 433, evoLvl: 18, desc: '在月光下出生的黑猫，瞳孔中映射着星空。' },
  { id: 433, name: '黑夜猎豹', type: 'DARK', emoji: '🐆', hp: 65, atk: 85, def: 55, evo: 434, evoLvl: 38, desc: '行走于暗夜的猎手，速度快如闪电。' },
  { id: 434, name: '虚无之主', type: 'DARK', emoji: '👁️', hp: 85, atk: 115, def: 75, desc: '统御暗影的王者，据说它能吞噬一切光芒。' },

  // 2. 格斗家族 (FIGHT)
  { id: 435, name: '拳击仔', type: 'FIGHT', emoji: '🥊', hp: 50, atk: 60, def: 40, evo: 436, evoLvl: 20, desc: '戴着过大拳套的小家伙，充满斗志。' },
  { id: 436, name: '格斗勇士', type: 'FIGHT', emoji: '🤼', hp: 70, atk: 85, def: 60, evo: 437, evoLvl: 40, desc: '经过千锤百炼的格斗家，拳风可碎巨石。' },
  { id: 437, name: '无双霸王', type: 'FIGHT', emoji: '💪', hp: 95, atk: 120, def: 80, desc: '传说中的武道巅峰者，一拳之力可裂山川。' },

  // 3. 萤光蛾家族 (BUG)
  { id: 438, name: '萤火虫', type: 'BUG', emoji: '🪲', hp: 35, atk: 30, def: 40, evo: 439, evoLvl: 16, desc: '夜晚发出温暖微光的小虫子。' },
  { id: 439, name: '幻光蛾', type: 'BUG', emoji: '🦋', hp: 55, atk: 65, def: 55, evo: 440, evoLvl: 34, desc: '翅膀上的鳞粉能折射出梦幻光芒。' },
  { id: 440, name: '彩翼天蛾', type: 'BUG', emoji: '🪻', hp: 75, atk: 100, def: 80, desc: '翅膀展开时如同七色彩虹，是森林的守护者。' },

  // 4. 飞行家族 (FLYING)
  { id: 441, name: '微风雀', type: 'FLYING', emoji: '🕊️', hp: 38, atk: 45, def: 35, evo: 442, evoLvl: 17, desc: '轻盈的小鸟，总是追着风跑。' },
  { id: 442, name: '疾风鹰', type: 'FLYING', emoji: '🦅', hp: 60, atk: 80, def: 55, evo: 443, evoLvl: 36, desc: '翱翔于高空的猛禽，俯冲速度惊人。' },
  { id: 443, name: '暴风之翼', type: 'FLYING', emoji: '🌪️', hp: 80, atk: 110, def: 75, desc: '振翅即可掀起暴风的传说飞禽。' },

  // 5. 花精灵家族 (FAIRY)
  { id: 444, name: '花蕾精', type: 'FAIRY', emoji: '🌸', hp: 45, atk: 35, def: 45, evo: 445, evoLvl: 19, desc: '住在花苞里的小精灵，散发甜蜜芳香。' },
  { id: 445, name: '花瓣仙', type: 'FAIRY', emoji: '🌺', hp: 65, atk: 60, def: 70, evo: 446, evoLvl: 38, desc: '飘舞的花瓣就是她的魔法，能治愈伤痛。' },
  { id: 446, name: '百花女王', type: 'FAIRY', emoji: '👸', hp: 90, atk: 85, def: 100, desc: '花之国度的女王，所过之处百花盛开。' },

  // 6. 龙族家族 (DRAGON)
  { id: 447, name: '龙蛋仔', type: 'DRAGON', emoji: '🥚', hp: 50, atk: 50, def: 55, evo: 448, evoLvl: 25, desc: '刚从龙蛋中孵化的幼龙，好奇心旺盛。' },
  { id: 448, name: '翔龙', type: 'DRAGON', emoji: '🐉', hp: 72, atk: 80, def: 70, evo: 449, evoLvl: 45, desc: '学会飞翔的年轻巨龙，正在磨练龙息。' },
  { id: 449, name: '天空龙王', type: 'DRAGON', emoji: '🐲', hp: 100, atk: 120, def: 95, desc: '君临苍穹的龙王，龙息可融化钢铁。' },

  // 7. 暗影狼家族 (DARK)
  { id: 450, name: '暗影狼崽', type: 'DARK', emoji: '🐕', hp: 42, atk: 50, def: 38, evo: 451, evoLvl: 22, desc: '独自在黑暗中嚎叫的小狼。' },
  { id: 451, name: '幽冥战狼', type: 'DARK', emoji: '🐺', hp: 68, atk: 82, def: 60, evo: 452, evoLvl: 42, desc: '在月下狩猎的暗影之狼，獠牙淬有暗能。' },
  { id: 452, name: '黑暗天狼', type: 'DARK', emoji: '🌑', hp: 90, atk: 110, def: 80, desc: '暗夜的最终支配者，传说它是月亮的影子。' },

  // 8. 大地家族 (GROUND)
  { id: 453, name: '掘地鼠', type: 'GROUND', emoji: '🐹', hp: 40, atk: 50, def: 45, evo: 454, evoLvl: 20, desc: '在地下快速挖洞的小鼠，爪子坚硬如铁。' },
  { id: 454, name: '穿山兽', type: 'GROUND', emoji: '🦔', hp: 65, atk: 75, def: 80, evo: 455, evoLvl: 40, desc: '全身覆盖岩石鳞甲，能穿透最坚硬的地层。' },
  { id: 455, name: '大地巨人', type: 'GROUND', emoji: '🏔️', hp: 95, atk: 100, def: 115, desc: '传说中的地底王者，每一步都能引发地震。' },

  // === 二段进化链 ===
  // 9. 露珠精灵 (FAIRY)
  { id: 456, name: '露珠精灵', type: 'FAIRY', emoji: '💧', hp: 48, atk: 40, def: 50, evo: 457, evoLvl: 28, desc: '住在清晨露珠里的微小精灵。' },
  { id: 457, name: '晨露仙子', type: 'FAIRY', emoji: '✨', hp: 78, atk: 70, def: 85, desc: '在朝阳中翩翩起舞的仙子，带来一天的好运。' },

  // 10. 甲虫 (BUG)
  { id: 458, name: '角甲虫', type: 'BUG', emoji: '🪳', hp: 45, atk: 55, def: 60, evo: 459, evoLvl: 26, desc: '头上有巨大犄角的甲虫，力量惊人。' },
  { id: 459, name: '铠甲独角仙', type: 'BUG', emoji: '🪲', hp: 75, atk: 95, def: 90, desc: '浑身铠甲的巨型甲虫，角上的力量能掀翻巨石。' },

  // 11. 武僧 (FIGHT)
  { id: 460, name: '修行僧', type: 'FIGHT', emoji: '🧘', hp: 55, atk: 50, def: 55, evo: 461, evoLvl: 32, desc: '在山中修行的武僧，追求武道真谛。' },
  { id: 461, name: '悟道大师', type: 'FIGHT', emoji: '🥋', hp: 85, atk: 90, def: 85, desc: '参透武道奥义的大师，一招一式皆有禅意。' },

  // 12. 暗鸦 (DARK)
  { id: 462, name: '影子鸦', type: 'DARK', emoji: '🐦‍⬛', hp: 40, atk: 60, def: 35, evo: 463, evoLvl: 30, desc: '在暗处窥视的乌鸦，眼中闪烁诡异光芒。' },
  { id: 463, name: '暗鸦领主', type: 'DARK', emoji: '🦉', hp: 70, atk: 95, def: 65, desc: '统领群鸦的黑暗之王，能操纵影子攻击敌人。' },

  // 13. 气球鸟 (FLYING)
  { id: 464, name: '气球鸟', type: 'FLYING', emoji: '🎈', hp: 55, atk: 35, def: 35, evo: 465, evoLvl: 24, desc: '身体轻如气球的奇妙鸟类，随风飘荡。' },
  { id: 465, name: '飞艇翼龙', type: 'FLYING', emoji: '🛩️', hp: 85, atk: 75, def: 70, desc: '进化后获得了强劲的飞行能力，能穿越暴风。' },

  // 14. 海马龙 (DRAGON)
  { id: 466, name: '小海马龙', type: 'DRAGON', emoji: '🐴', hp: 42, atk: 55, def: 48, evo: 467, evoLvl: 35, desc: '海中的龙种后裔，鳞片闪烁着蓝光。' },
  { id: 467, name: '海龙王', type: 'DRAGON', emoji: '🐳', hp: 80, atk: 100, def: 85, desc: '统治深海的龙王，能引发巨大海啸。' },

  // 15. 治愈草 (HEAL)
  { id: 468, name: '小药草', type: 'HEAL', emoji: '🌿', hp: 55, atk: 30, def: 45, evo: 469, evoLvl: 30, desc: '具有强大治愈力的小草，散发清新气息。' },
  { id: 469, name: '生命之树', type: 'HEAL', emoji: '🌲', hp: 100, atk: 55, def: 90, desc: '千年古树化身的精灵，触碰它即可恢复元气。' },

  // 16. 蝙蝠 (DARK)
  { id: 470, name: '暗影蝠', type: 'DARK', emoji: '🦇', hp: 38, atk: 55, def: 30, evo: 471, evoLvl: 28, desc: '在洞穴深处栖息的蝙蝠，超声波能迷惑敌人。' },
  { id: 471, name: '吸血伯爵', type: 'DARK', emoji: '🧛', hp: 70, atk: 90, def: 60, desc: '传说中的暗夜贵族，吸取敌人生命力为己用。' },

  // 17. 黄金甲虫 (BUG)
  { id: 472, name: '粪球虫', type: 'BUG', emoji: '🐛', hp: 40, atk: 45, def: 55, evo: 473, evoLvl: 26, desc: '滚动着小石球的勤劳虫子。' },
  { id: 473, name: '黄金甲虫', type: 'BUG', emoji: '🏅', hp: 72, atk: 80, def: 90, desc: '进化后全身覆盖金色甲壳，坚硬无比。' },

  // 18. 糖果精灵 (FAIRY)
  { id: 474, name: '糖果精灵', type: 'FAIRY', emoji: '🍬', hp: 50, atk: 40, def: 40, evo: 475, evoLvl: 22, desc: '散发甜蜜气息的小精灵，让人心情愉悦。' },
  { id: 475, name: '甜梦天使', type: 'FAIRY', emoji: '🍭', hp: 80, atk: 75, def: 70, desc: '能让敌人陷入甜蜜美梦的天使。' },

  // 19. 机甲 (STEEL)
  { id: 476, name: '铁皮人', type: 'STEEL', emoji: '🤖', hp: 50, atk: 50, def: 70, evo: 477, evoLvl: 35, desc: '古代遗迹中出土的小型机械人。' },
  { id: 477, name: '机甲战士', type: 'STEEL', emoji: '🦾', hp: 82, atk: 85, def: 105, desc: '全面升级的钢铁战士，装甲可抵御任何攻击。' },

  // 20. 毒蘑菇 (POISON)
  { id: 478, name: '毒蘑菇', type: 'POISON', emoji: '🍄', hp: 48, atk: 55, def: 40, evo: 479, evoLvl: 28, desc: '颜色鲜艳的毒蘑菇，散发致命孢子。' },
  { id: 479, name: '剧毒菌王', type: 'POISON', emoji: '☠️', hp: 78, atk: 90, def: 70, desc: '蘑菇森林的统治者，毒雾可覆盖整座山谷。' },

  // === 神兽级别 (独立无进化，高基础属性) ===
  { id: 480, name: '暗黑龙神', type: 'DARK', emoji: '🐉', hp: 105, atk: 130, def: 90, desc: '【神兽】诞生于混沌之中的暗黑龙，能撕裂空间的缝隙。' },
  { id: 481, name: '光明凤凰', type: 'FAIRY', emoji: '🔥', hp: 100, atk: 110, def: 110, desc: '【神兽】传说中涅槃重生的光之凤凰，翅膀闪耀圣洁光辉。' },
  { id: 482, name: '时间之蛇', type: 'PSYCHIC', emoji: '⏳', hp: 95, atk: 115, def: 100, desc: '【神兽】盘踞在时间长河中的巨蛇，能窥视过去与未来。' },
  { id: 483, name: '空间之鲸', type: 'WATER', emoji: '🐋', hp: 120, atk: 100, def: 100, desc: '【神兽】遨游于空间裂缝的巨鲸，身体中藏着无数星系。' },
  { id: 484, name: '混沌魔神', type: 'GHOST', emoji: '💀', hp: 90, atk: 125, def: 95, desc: '【神兽】万物归于虚无前的最终守望者，掌控生与死的平衡。' },
  { id: 485, name: '大地母神', type: 'GROUND', emoji: '🌍', hp: 130, atk: 85, def: 120, desc: '【神兽】孕育万物的大地之母，所到之处草木繁茂。' },
  { id: 486, name: '永恒之树', type: 'GRASS', emoji: '🌳', hp: 125, atk: 80, def: 125, desc: '【神兽】存在了亿万年的世界树，连接天地的生命之源。' },
  { id: 487, name: '雷霆战神', type: 'ELECTRIC', emoji: '⚡', hp: 90, atk: 130, def: 85, desc: '【神兽】云端之上的雷电之主，一击可劈开群山。' },
  { id: 488, name: '钢铁巨像', type: 'STEEL', emoji: '🗽', hp: 110, atk: 100, def: 130, desc: '【神兽】远古文明建造的终极守卫，千年不朽的钢铁之躯。' },
  { id: 489, name: '冰霜女帝', type: 'ICE', emoji: '❄️', hp: 95, atk: 115, def: 105, desc: '【神兽】统治极地冰原的女帝，呼吸即可冻结万物。' },

  // === 独立精灵 (普通至稀有) ===
  { id: 490, name: '竹叶熊猫', type: 'FIGHT', emoji: '🐼', hp: 80, atk: 85, def: 75, desc: '以竹子为食的功夫熊猫，看似慵懒实则身手矫健。' },
  { id: 491, name: '珊瑚海马', type: 'WATER', emoji: '🪸', hp: 55, atk: 60, def: 70, desc: '生活在珊瑚礁中的海马，身上长满了彩色珊瑚。' },
  { id: 492, name: '陨石精灵', type: 'ROCK', emoji: '☄️', hp: 70, atk: 90, def: 80, desc: '从天而降的陨石中诞生的精灵，蕴含宇宙能量。' },
  { id: 493, name: '彩虹鹦鹉', type: 'FLYING', emoji: '🦜', hp: 60, atk: 70, def: 55, desc: '拥有七色羽毛的鹦鹉，叫声能改变天气。' },
  { id: 494, name: '沙漠蝎王', type: 'POISON', emoji: '🦂', hp: 75, atk: 95, def: 85, desc: '在沙漠深处潜伏的剧毒蝎子，尾刺一击致命。' },
  { id: 495, name: '极光鹿', type: 'ICE', emoji: '🦌', hp: 70, atk: 65, def: 70, desc: '鹿角上闪烁着极光的神鹿，是北国的守护兽。' },
  { id: 496, name: '熔岩蜥蜴', type: 'FIRE', emoji: '🦎', hp: 60, atk: 80, def: 65, desc: '在火山口生活的蜥蜴，皮肤下流淌着岩浆。' },
  { id: 497, name: '闪电貂', type: 'ELECTRIC', emoji: '⚡', hp: 55, atk: 75, def: 50, desc: '速度极快的小型电属性精灵，身体放出电火花。' },
  { id: 498, name: '幽灵船长', type: 'GHOST', emoji: '🏴‍☠️', hp: 72, atk: 85, def: 65, desc: '传说中的幽灵海盗船长，漂泊在迷雾之海。' },
  { id: 499, name: '岩石泰坦', type: 'ROCK', emoji: '🪨', hp: 90, atk: 85, def: 100, desc: '由巨岩构成的泰坦巨人，每一步都震动大地。' },
  { id: 500, name: '催眠师', type: 'PSYCHIC', emoji: '🔮', hp: 65, atk: 80, def: 60, desc: '拥有强大催眠能力的超能力者，能操控他人梦境。' },
];

// Build POKEDEX
const POKEDEX = [];
const ALL_SOURCE_DATA = [
    ...BASE_POKEDEX, ...GOD_PETS, ...NEW_EVO_CHAINS, ...EXTRA_EVOS,
    ...FINAL_GODS, ...STONE_EVO_PETS, ...TIME_WEATHER_PETS,
    UNIQUE_REWARD_PET, ...CRYSTAL_PETS, ...NEW_PETS_500
];
const MAX_DEX_ID = Math.max(...ALL_SOURCE_DATA.map(p => p.id), 500);
for(let i=1; i<=MAX_DEX_ID; i++) {
  const existing = ALL_SOURCE_DATA.find(p => p.id === i);
  if (existing) {
    POKEDEX.push(existing);
  } else {
    POKEDEX.push({ id: i, name: `野生精灵#${i}`, type: 'NORMAL', emoji: '🐾', hp: 50, atk: 50, def: 50 });
  }
}

export { POKEDEX, BASE_POKEDEX, EXTRA_EVOS, FINAL_GODS, CRYSTAL_PETS, NEW_EVO_CHAINS, GOD_PETS, TIME_WEATHER_PETS, STONE_EVO_PETS, STONE_EVO_RULES, UNIQUE_REWARD_PET, NEW_PETS_500 };
