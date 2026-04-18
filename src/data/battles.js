export const TRAINER_NAMES = ['小智', '小霞', '捕虫少年', '短裤小子', '精英训练师', '火箭队手下', '阿金', '希罗娜', '大吾', '赤红', 'N', '露西', '短裙少女', '登山大叔', '钓鱼佬', '超能力者', '空手道王', '暴走族', '研究员', '富家少爷', '双子星'];
export const CHALLENGES = [
  { id: 'c1', title: '闪光伊布的试炼', desc: '初级训练师的入门战',
    req: 5, boss: 125, bossLvl: 15, teamSize: 3, rewardId: 125,
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', color: '#E65100' },
  { id: 'c2', title: '燃烧的九尾', desc: '对抗火焰的精英小队',
    req: 20, boss: 11, bossLvl: 30, teamSize: 4, rewardId: 11,
    bg: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)', color: '#C62828' },
  { id: 'c3', title: '深海巨兽', desc: '海洋霸主与其护卫',
    req: 50, boss: 123, bossLvl: 45, teamSize: 4, rewardId: 123,
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', color: '#1565C0' },
  { id: 'c4', title: '合金风暴', desc: '坚不可摧的钢铁防线',
    req: 80, boss: 140, bossLvl: 55, teamSize: 5, rewardId: 140,
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)', color: '#455A64' },
  { id: 'c5', title: '龙之逆鳞', desc: '准神兽的满员战队',
    req: 120, boss: 182, bossLvl: 65, teamSize: 6, rewardId: 182,
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', color: '#6A1B9A' },
  { id: 'c6', title: '绝对零度', desc: '传说中的急冻鸟',
    req: 160, boss: 91, bossLvl: 75, teamSize: 6, rewardId: 91,
    bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', color: '#00838F' },
  { id: 'c7', title: '雷霆主宰', desc: '传说中的闪电鸟',
    req: 200, boss: 92, bossLvl: 80, teamSize: 6, rewardId: 92,
    bg: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)', color: '#F9A825' },
  { id: 'c8', title: '超能念力场', desc: '对抗精神力量的极致',
    req: 240, boss: 94, bossLvl: 85, teamSize: 6, rewardId: 94,
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', color: '#8E24AA' },
  { id: 'c9', title: '创世降临', desc: '挑战宝可梦之神',
    req: 280, boss: 150, bossLvl: 88, teamSize: 6, rewardId: 150,
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', color: '#4A148C' },
  { id: 'c10', title: '钢铁长城', desc: '无法被攻破的绝对防御',
    req: 320, boss: 206, bossLvl: 90, teamSize: 6, rewardId: 206,
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #B0BEC5 100%)', color: '#455A64' },
  { id: 'c11', title: '远古巨兽', desc: '来自史前的原始力量',
    req: 360, boss: 259, bossLvl: 92, teamSize: 6, rewardId: 259,
    bg: 'linear-gradient(135deg, #EFEBE9 0%, #A1887F 100%)', color: '#5D4037' },
  { id: 'c12', title: '光与暗之歌', desc: '同时面对光神与暗神',
    req: 400, boss: 254, bossLvl: 95, teamSize: 6, rewardId: 254,
    bg: 'linear-gradient(135deg, #212121 0%, #424242 100%)', color: '#FFD700' },
  { id: 'c13', title: '十神降世', desc: '终极神兽的集结号',
    req: 440, boss: 340, bossLvl: 96, teamSize: 6, rewardId: 340,
    bg: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)', color: '#EA80FC' },
  { id: 'c14', title: '异界征服者', desc: '异界兽的终极挑战',
    req: 480, boss: 610, bossLvl: 97, teamSize: 6, rewardId: 610,
    bg: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)', color: '#82B1FF' },
  { id: 'c15', title: '数码暴龙觉醒', desc: '数码世界的王者之战',
    req: 520, boss: 666, bossLvl: 98, teamSize: 6, rewardId: 666,
    bg: 'linear-gradient(135deg, #006064 0%, #00897B 100%)', color: '#A7FFEB' },
  { id: 'c16', title: '万界审判', desc: '次元霸主的终极审判',
    req: 560, boss: 700, bossLvl: 99, teamSize: 6, rewardId: 700,
    bg: 'linear-gradient(135deg, #BF360C 0%, #FF6F00 100%)', color: '#FFD180' },
  { id: 'c17', title: '诸神黄昏', desc: '挑战所有终极神兽的合体之力',
    req: 620, boss: 696, bossLvl: 100, teamSize: 6, rewardId: 696,
    bg: 'linear-gradient(135deg, #311B92 0%, #651FFF 100%)', color: '#B388FF' },
  { id: 'c17b', title: '次元裂隙', desc: '来自异界的强大存在入侵了这个世界',
    req: 700, boss: 750, bossLvl: 100, teamSize: 6, rewardId: 750,
    bg: 'linear-gradient(135deg, #1A237E 0%, #00BCD4 100%)', color: '#80DEEA' },
  { id: 'c18', title: '创世之巅', desc: '800精灵图鉴大师的最终证明',
    req: 780, boss: 800, bossLvl: 100, teamSize: 6, rewardId: 691,
    bg: 'linear-gradient(135deg, #000000 0%, #FFD700 50%, #000000 100%)', color: '#FFD700' },
];

export const ATTR_CHALLENGES = [
  { id: 'ac1', title: '烈焰领主', desc: '火属性精灵的极致战斗',
    req: 30, boss: 97, bossLvl: 50, teamSize: 5, rewardId: 97, attrType: 'FIRE',
    bg: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)', color: '#E64A19' },
  { id: 'ac2', title: '深渊海王', desc: '水属性精灵的深海挑战',
    req: 30, boss: 130, bossLvl: 55, teamSize: 5, rewardId: 130, attrType: 'WATER',
    bg: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)', color: '#0D47A1' },
  { id: 'ac3', title: '雷霆风暴', desc: '电属性精灵的闪电战',
    req: 40, boss: 89, bossLvl: 60, teamSize: 5, rewardId: 89, attrType: 'ELECTRIC',
    bg: 'linear-gradient(135deg, #F9A825 0%, #FFD54F 100%)', color: '#F57F17' },
  { id: 'ac4', title: '森罗万象', desc: '草属性精灵的森林之战',
    req: 40, boss: 3, bossLvl: 55, teamSize: 5, rewardId: 3, attrType: 'GRASS',
    bg: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)', color: '#1B5E20' },
  { id: 'ac5', title: '暗夜侵袭', desc: '恶属性精灵的黑暗笼罩',
    req: 60, boss: 248, bossLvl: 70, teamSize: 6, rewardId: 248, attrType: 'DARK',
    bg: 'linear-gradient(135deg, #37474F 0%, #546E7A 100%)', color: '#263238' },
  { id: 'ac6', title: '妖精之舞', desc: '妖精属性精灵的梦幻盛宴',
    req: 60, boss: 194, bossLvl: 70, teamSize: 6, rewardId: 194, attrType: 'FAIRY',
    bg: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)', color: '#C2185B' },
  { id: 'ac7', title: '钢铁意志', desc: '钢属性精灵的铁壁防线',
    req: 80, boss: 140, bossLvl: 75, teamSize: 6, rewardId: 140, attrType: 'STEEL',
    bg: 'linear-gradient(135deg, #607D8B 0%, #90A4AE 100%)', color: '#455A64' },
  { id: 'ac8', title: '龙族之怒', desc: '龙属性精灵的终极咆哮',
    req: 100, boss: 182, bossLvl: 80, teamSize: 6, rewardId: 182, attrType: 'DRAGON',
    bg: 'linear-gradient(135deg, #4A148C 0%, #7C4DFF 100%)', color: '#6200EA' },
  { id: 'ac9', title: '幽冥裁决', desc: '幽灵属性的灵魂审判',
    req: 80, boss: 144, bossLvl: 75, teamSize: 6, rewardId: 144, attrType: 'GHOST',
    bg: 'linear-gradient(135deg, #4527A0 0%, #7E57C2 100%)', color: '#311B92' },
  { id: 'ac10', title: '格斗宗师', desc: '格斗属性的武道巅峰',
    req: 100, boss: 106, bossLvl: 80, teamSize: 6, rewardId: 106, attrType: 'FIGHT',
    bg: 'linear-gradient(135deg, #BF360C 0%, #E64A19 100%)', color: '#BF360C' },
  { id: 'ac11', title: '冰封世界', desc: '冰属性精灵的极寒考验',
    req: 120, boss: 199, bossLvl: 85, teamSize: 6, rewardId: 199, attrType: 'ICE',
    bg: 'linear-gradient(135deg, #00ACC1 0%, #4DD0E1 100%)', color: '#00838F' },
  { id: 'ac12', title: '念力风暴', desc: '超能属性的精神碾压',
    req: 120, boss: 65, bossLvl: 85, teamSize: 6, rewardId: 65, attrType: 'PSYCHIC',
    bg: 'linear-gradient(135deg, #AD1457 0%, #EC407A 100%)', color: '#880E4F' },
  { id: 'ac13', title: '大地震怒', desc: '地面属性的地壳崩裂',
    req: 150, boss: 184, bossLvl: 88, teamSize: 6, rewardId: 184, attrType: 'GROUND',
    bg: 'linear-gradient(135deg, #795548 0%, #A1887F 100%)', color: '#4E342E' },
  { id: 'ac14', title: '宇宙之眼', desc: '宇宙属性的次元审判',
    req: 200, boss: 607, bossLvl: 95, teamSize: 6, rewardId: 607, attrType: 'COSMIC',
    bg: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)', color: '#0D47A1' },
  { id: 'ac15', title: '圣光制裁', desc: '光属性精灵的神圣净化',
    req: 200, boss: 604, bossLvl: 95, teamSize: 6, rewardId: 604, attrType: 'LIGHT',
    bg: 'linear-gradient(135deg, #FF8F00 0%, #FFD54F 100%)', color: '#FF6F00' },
];

export const DOUBLE_CHALLENGES = [
  { id: 'dc1', title: '双打入门战', desc: '体验2v2双打的基础对决',
    req: 10, boss: 1, bossLvl: 20, teamSize: 2, rewardId: 1, isDouble: true,
    bg: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: '#E65100' },
  { id: 'dc2', title: '火水交锋', desc: '火与水的双打协作战',
    req: 30, boss: 97, bossLvl: 40, teamSize: 2, rewardId: 97, isDouble: true,
    bg: 'linear-gradient(135deg, #FF5722 0%, #2196F3 100%)', color: '#BF360C' },
  { id: 'dc3', title: '雷电双子', desc: '双电属性精灵的闪电攻势',
    req: 60, boss: 89, bossLvl: 55, teamSize: 2, rewardId: 89, isDouble: true,
    bg: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)', color: '#F57F17' },
  { id: 'dc4', title: '龙凤呈祥', desc: '龙系与妖精系的终极对决',
    req: 100, boss: 182, bossLvl: 70, teamSize: 2, rewardId: 182, isDouble: true,
    bg: 'linear-gradient(135deg, #7B1FA2 0%, #EC407A 100%)', color: '#4A148C' },
  { id: 'dc5', title: '光暗双煞', desc: '光与暗的双打终极审判',
    req: 150, boss: 254, bossLvl: 85, teamSize: 2, rewardId: 254, isDouble: true,
    bg: 'linear-gradient(135deg, #FFD54F 0%, #37474F 100%)', color: '#263238' },
  { id: 'dc6', title: '创世双神', desc: '挑战双神兽的究极双打',
    req: 250, boss: 340, bossLvl: 95, teamSize: 2, rewardId: 340, isDouble: true,
    bg: 'linear-gradient(135deg, #D32F2F 0%, #FF6F00 100%)', color: '#B71C1C' },
  { id: 'dc7', title: '万界双打至尊', desc: '双打模式的最终证明',
    req: 400, boss: 700, bossLvl: 100, teamSize: 2, rewardId: 700, isDouble: true,
    bg: 'linear-gradient(135deg, #000000 0%, #FF6F00 50%, #000000 100%)', color: '#FF6F00' },
];
export const CONTEST_CONFIG = {
  bug: {
    id: 'contest_bug',
    name: '捕虫大会',
    desc: '在当前地图捕捉虫系精灵，分数由种族值和个体值综合评定。',
    entryFee: 2000,
    pool: [110, 38, 293, 252],
    tiers: [
      { min: 500, id: 327, name: '虫群主宰', level: 5, shiny: false, ivs: 3, msg: '🏆 传说级捕获！虫族之王认可了你！' },
      { min: 350, id: 252, name: '圣甲虫', level: 5, shiny: false, ivs: 2, msg: '🥇 冠军！这只甲虫实力非凡！' },
      { min: 200, id: 112, name: '巴大蝶', level: 5, shiny: false, ivs: 1, msg: '🥈 优胜！这只蝴蝶翅膀很漂亮！' },
      { min: 0,   id: 110, name: '绿毛虫', level: 5, shiny: false, ivs: 0, msg: '🥉 参与奖。继续加油！' }
    ]
  },

  fishing: {
    id: 'contest_fishing',
    name: '钓鱼王杯',
    desc: '钓起大鱼！体重与鱼种和运气有关，后期徽章越多鱼越大！',
    entryFee: 2000,
    pool: [7, 24, 26, 173],
    tiers: [
      { min: 120.0, id: 410, name: '海啸领主', level: 5, shiny: false, ivs: 3, msg: '🏆 钓鱼之神！你钓到了传说级巨鱼！' },
      { min: 60.0,  id: 235, name: '海啸王', level: 5, shiny: false, ivs: 2, msg: '🥇 冠军！这条大鱼分量十足！' },
      { min: 25.0,  id: 22,  name: '激流鲨', level: 5, shiny: false, ivs: 1, msg: '🥈 亚军！这条鲨鱼很凶猛！' },
      { min: 0,     id: 7,   name: '泡泡鱼', level: 5, shiny: false, ivs: 0, msg: '🥉 只有一条泡泡鱼... 拿去煲汤吧。' }
    ]
  },
  beauty: {
    id: 'contest_beauty',
    name: '华丽大赛',
    desc: '展示精灵的魅力！策略性选择技能，高分需要技巧和运气！',
    entryFee: 1500,
    tiers: [
      { min: 220, id: 369, name: '仙子伊布', level: 5, shiny: false, ivs: 3, msg: '🏆 完美演出！全场为你欢呼！' },
      { min: 150, id: 329, name: '樱花女神', level: 5, shiny: false, ivs: 2, msg: '🥇 优胜！最美的精灵归你了！' },
      { min: 80,  id: 61,  name: '星光舞者', level: 5, shiny: false, ivs: 1, msg: '🥈 表现不错！舞姿很优美。' },
      { min: 0,   id: 48,  name: '粉粉球', level: 5, shiny: false, ivs: 0, msg: '🥉 还需要练习哦。' }
    ]
  }
};
// ==========================================
// 特殊副本体系 — 按难度分层
// ==========================================
export const DUNGEONS = [
  // === Tier 1: 入门级 (1~3徽章) ===
  { id: 'mist_forest', name: '迷雾森林', desc: '浓雾中的神秘遭遇，闪光精灵出没 (需1徽章)',
    type: 'mist_forest', color: '#78909C', icon: '🌫️', recLvl: 15,
    rarity: '普通', stars: 1, tier: 1, reqBadges: 1,
    rewards: [
      { icon: '✨', text: '高闪光率遭遇' },
      { icon: '🔴', text: '随机精灵球奖励' }
    ] },
  { id: 'speed_run', name: '竞速挑战', desc: '以最少回合击败敌人，3回合内通关获稀有奖励 (需2徽章)',
    type: 'speed_run', color: '#FF5722', icon: '⚡', recLvl: 20,
    rarity: '普通', stars: 2, tier: 1, reqBadges: 2,
    rewards: [
      { icon: '⚡', text: '速度类增强剂' },
      { icon: '🏅', text: '3回合内通关额外奖励' }
    ] },
  { id: 'wild_survival', name: '野外求生', desc: '3波连战，HP不回复 (需2徽章)',
    type: 'wild_survival', color: '#4CAF50', icon: '🏕️', recLvl: 25,
    rarity: '普通', stars: 2, tier: 1, reqBadges: 2,
    rewards: [
      { icon: '🍇', text: '大量树果和药品' },
      { icon: '🌿', text: 'HP不回复的紧张连战' }
    ] },
  { id: 'memory_trial', name: '回忆试炼', desc: '对战镜像队伍的自我挑战 (需3徽章)',
    type: 'memory_trial', color: '#9C27B0', icon: '🪞', recLvl: 30,
    rarity: '稀有', stars: 2, tier: 1, reqBadges: 3,
    rewards: [
      { icon: '📖', text: '随机TM技能' },
      { icon: '🪞', text: '挑战自己的镜像' }
    ] },
  { id: 'type_challenge', name: '属性试炼场', desc: '指定属性限定战 (需3徽章)',
    type: 'type_challenge', color: '#1976D2', icon: '🎯', recLvl: 25,
    rarity: '普通', stars: 2, tier: 1, reqBadges: 3,
    rewards: [
      { icon: '📖', text: '属性专精TM' },
      { icon: '💰', text: '1500 金币' }
    ] },
  // === Tier 2: 进阶级 (4~6徽章) ===
  { id: 'boss_rush', name: '连战Boss塔', desc: '连续挑战3个Boss (需4徽章)',
    type: 'boss_rush', color: '#D32F2F', icon: '🗼', recLvl: 35,
    rarity: '稀有', stars: 3, tier: 2, reqBadges: 4,
    rewards: [
      { icon: '🏆', text: '通关奖金按难度(2500~12000)' },
      { icon: '🎁', text: '随机稀有道具' }
    ] },
  { id: 'stone_tower', name: '元素之塔', desc: '进化石掉落 (需5徽章)',
    type: 'stone', color: '#7B1FA2', icon: '🔮', recLvl: 45,
    rarity: '稀有', stars: 3, tier: 2, reqBadges: 5,
    rewards: [
      { icon: '⚡', text: '随机进化石' },
      { icon: '⏰', text: '3场后冷却5分钟' }
    ] },
  { id: 'hero_trial', name: '英雄试炼', desc: '1v1单挑赢取增强剂 (需5徽章)',
    type: 'stat', color: '#F44336', icon: '💪', recLvl: 50, restriction: 'solo_run',
    rarity: '稀有', stars: 3, tier: 2, reqBadges: 5,
    rewards: [
      { icon: '💪', text: '随机增强剂' },
      { icon: '🏅', text: '仅限单挑' }
    ] },
  { id: 'ladder_trial', name: '天梯试炼', desc: '5层逐渐变强的Boss连战 (需5徽章)',
    type: 'boss_rush', color: '#E91E63', icon: '🪜', recLvl: 50,
    rarity: '史诗', stars: 3, tier: 2, reqBadges: 5,
    rewards: [
      { icon: '💪', text: '每层掉落增强剂' },
      { icon: '⚡', text: '通关获得进化石' }
    ] },
  { id: 'type_roulette', name: '属性轮盘', desc: '随机属性对决，考验全方位实力 (需6徽章)',
    type: 'type_roulette', color: '#00BCD4', icon: '🎰', recLvl: 55,
    rarity: '史诗', stars: 3, tier: 2, reqBadges: 6,
    rewards: [
      { icon: '📖', text: '稀有属性TM' },
      { icon: '💪', text: '随机增强剂' }
    ] },
  // === Tier 3: 精英级 (7~10徽章) ===
  { id: 'survival_arena', name: '生存竞技场', desc: '无尽波次生存挑战 (需7徽章)',
    type: 'survival', color: '#FF6F00', icon: '🏟️', recLvl: 65,
    rarity: '史诗', stars: 4, tier: 3, reqBadges: 7,
    rewards: [
      { icon: '🏅', text: '按存活回合奖励' },
      { icon: '💎', text: '高回合高品质装备' }
    ] },
  { id: 'shiny_valley', name: '闪光山谷', desc: '高闪光率捕捉 (需8徽章)',
    type: 'shiny_hunt', color: '#00E676', icon: '✨', recLvl: 70, restriction: 'lucky_nature',
    rarity: '史诗', stars: 4, tier: 3, reqBadges: 8,
    rewards: [
      { icon: '✨', text: '高闪光概率' },
      { icon: '🍀', text: '幸运加成' }
    ] },
  { id: 'reverse_world', name: '逆位空间', desc: '属性克制全部反转 (需9徽章)',
    type: 'reverse', color: '#880E4F', icon: '🔄', recLvl: 78,
    rarity: '史诗', stars: 4, tier: 3, reqBadges: 9,
    rewards: [
      { icon: '🔄', text: '反转世界的挑战' },
      { icon: '💰', text: '15000 金币 + 稀有道具' }
    ] },
  { id: 'double_arena', name: '双打擂台', desc: '2v2双打模式 (需9徽章)',
    type: 'double', color: '#E65100', icon: '⚔️', recLvl: 75,
    rarity: '史诗', stars: 4, tier: 3, reqBadges: 9,
    rewards: [
      { icon: '⚔️', text: '2v2双打奖励' },
      { icon: '🎁', text: '随机装备 + 成长道具' }
    ] },
  // === Tier 4: 终极级 (11~13徽章) ===
  { id: 'infinity_castle', name: '无限城', desc: 'Roguelike无尽挑战 (需10徽章)',
    type: 'infinity', color: '#7B1FA2', icon: '🏯', recLvl: 85,
    rarity: '传说', stars: 5, tier: 4, reqBadges: 10,
    rewards: [
      { icon: '👹', text: '鬼杀队遗物' },
      { icon: '⚔️', text: '呼吸法秘籍' }
    ] },
  { id: 'treasure_maze', name: '宝藏迷宫', desc: '随机房间探索 (需11徽章)',
    type: 'treasure', color: '#FF8F00', icon: '🗝️', recLvl: 90,
    rarity: '传说', stars: 5, tier: 4, reqBadges: 11,
    rewards: [
      { icon: '🗝️', text: '每房间随机宝箱' },
      { icon: '💎', text: '深层出现精灵蛋' }
    ] },
  { id: 'safari_zone', name: '狩猎地带', desc: '传说/神兽高概率出没 (需13徽章)',
    type: 'catch', color: '#FF7043', icon: '🐾', recLvl: 95,
    rarity: '传说', stars: 5, tier: 4, reqBadges: 13,
    rewards: [
      { icon: '🐲', text: '随机神兽' },
      { icon: '🔴', text: '传说品质装备' }
    ] },
  { id: 'ragnarok', name: '诸神黄昏', desc: '挑战三波神兽军团 (需13徽章)',
    type: 'ragnarok', color: '#4A148C', icon: '⚔️', recLvl: 98,
    rarity: '传说', stars: 5, tier: 4, reqBadges: 13,
    rewards: [
      { icon: '🌟', text: '保底闪光神兽' },
      { icon: '🍬', text: '极限糖果+传说装备' }
    ] },
  { id: 'extreme_trial', name: '极限试炼', desc: '每波随机Debuff (需13徽章)',
    type: 'extreme', color: '#B71C1C', icon: '☠️', recLvl: 100,
    rarity: '传说', stars: 5, tier: 4, reqBadges: 13,
    rewards: [
      { icon: '☠️', text: '最高难度挑战' },
      { icon: '👑', text: '冠军级装备+大师球' }
    ] },
];
export const MOON_DEMONS = {
  LOWER: [94, 146, 208, 236, 265, 274], // 下弦 (耿鬼, 噩梦神等)
  UPPER: [144, 150, 216, 248, 255, 280], // 上弦 (冥王龙, 虚空等)
  MUZAN: 341 // 鬼王 (暗黑超梦)
};
// 补充特殊遭遇池
export const NEW_GOD_IDS = Array.from({length: 30}, (_, i) => 254 + i);
export const FINAL_GOD_IDS = [331, 332, 333, 334, 335, 336, 337, 338, 339, 340];
export const NEW_LEGENDARY_IDS = [480, 481, 482, 483, 484, 485, 486, 487, 488, 489];
export const GODS_610_IDS = [601, 602, 603, 604, 605, 606, 607, 608, 609, 610];
export const LEGENDARY_POOL = [96, 97, 98, 99, 142, 144, 145, 146, 147, 150, 151, 216, 218, 220, 222, 228, 233, 234, 235, 236, 242, 243, 244, 253, 351, 355, ...NEW_GOD_IDS,...FINAL_GOD_IDS, ...NEW_LEGENDARY_IDS, ...GODS_610_IDS]; 
export const HIGH_TIER_POOL = [3, 6, 9, 18, 33, 65, 69, 94, 130, 138, 139, 140, 143, 149, 160, 168, 182, 190, 199, 206, 241, 434, 437, 443, 446, 449, 452, 455, 459, 461, 463, 465, 467, 469, 471, 473, 475, 477, 479, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 503, 506, 518, 521, 533, 540, 544, 555, 567, 570, 592, 598, 600]; 
export const ROCK_POOL = [64, 65, 73, 74, 95, 133, 134, 135, 136, 139, 169, 190, 225, 226, 250]; 
export const WATER_POOL = [7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28, 76, 77, 78, 107, 108, 109, 120, 123, 126, 129, 130, 158, 159, 165, 173, 174, 211, 212, 235, 246];

// ==========================================
// 咒术回战 - 挑战与副本
// ==========================================
export const JJK_CHALLENGES = [
  {
    id: 'jjk_exchange', title: '咒术高专交流会', desc: '与京都校的术师切磋',
    req: 30, boss: 68, bossLvl: 55, teamSize: 4, rewardId: 68,
    bg: 'linear-gradient(135deg, #1A237E 0%, #3949AB 100%)', color: '#E8EAF6',
    isJJK: true, hasCE: true,
  },
  {
    id: 'jjk_todo', title: '东堂葵的挑战', desc: '你喜欢哪种类型的女性？',
    req: 40, boss: 57, bossLvl: 65, teamSize: 3, rewardId: 57,
    bg: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)', color: '#F3E5F5',
    isJJK: true, hasCE: true, npc: 'todo',
  },
  {
    id: 'jjk_mahito', title: '讨伐特级咒灵·真人', desc: '灵魂的形态即将被改变',
    req: 60, boss: 150, bossLvl: 70, teamSize: 5, rewardId: 93,
    bg: 'linear-gradient(135deg, #880E4F 0%, #AD1457 100%)', color: '#FCE4EC',
    isJJK: true, hasCE: true, npc: 'mahito', isBoss: true,
  },
  {
    id: 'jjk_jogo', title: '讨伐特级咒灵·漏瑚', desc: '大地燃烧的恐惧',
    req: 65, boss: 146, bossLvl: 75, teamSize: 5, rewardId: 146,
    bg: 'linear-gradient(135deg, #BF360C 0%, #E64A19 100%)', color: '#FBE9E7',
    isJJK: true, hasCE: true, npc: 'jogo', isBoss: true,
  },
  {
    id: 'jjk_geto', title: '夏油杰·百鬼夜行', desc: '曾经的最强术师发动了百鬼夜行',
    req: 75, boss: 94, bossLvl: 80, teamSize: 6, rewardId: 94,
    bg: 'linear-gradient(135deg, #212121 0%, #424242 100%)', color: '#F5F5F5',
    isJJK: true, hasCE: true, npc: 'geto', isBoss: true,
  },
  {
    id: 'jjk_sukuna', title: '诅咒之王·宿傩', desc: '千年前的诅咒之王，你敢挑战吗？',
    req: 90, boss: 150, bossLvl: 100, teamSize: 6, rewardId: 150,
    bg: 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)', color: '#FFEBEE',
    isJJK: true, hasCE: true, npc: 'sukuna', isBoss: true,
  },
  {
    id: 'jjk_gojo_sparring', title: '五条悟的特训', desc: '最强术师亲自指导的特训',
    req: 50, boss: 150, bossLvl: 80, teamSize: 4, rewardId: 65,
    bg: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)', color: '#E3F2FD',
    isJJK: true, hasCE: true, npc: 'gojo',
  },
];

export const HYAKKI_DUNGEON = {
  id: 'hyakki_yako', name: '百鬼夜行', desc: '对战强力咒灵 (需6徽章+Lv.80)',
  type: 'hyakki', color: '#4A148C', icon: '👹', recLvl: 80, restriction: 'none',
  isJJK: true, tier: 3, reqBadges: 6,
  rarity: '史诗', stars: 4,
  rewards: [
    { icon: '👹', text: '3000 金币' },
    { icon: '🔮', text: '咒具掉落' },
  ]
};

// EXTRA_DUNGEONS 已合并入主 DUNGEONS 数组
export const EXTRA_DUNGEONS = [];
