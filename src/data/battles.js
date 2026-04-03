export const TRAINER_NAMES = ['小智', '小霞', '捕虫少年', '短裤小子', '精英训练师', '火箭队手下', '阿金', '希罗娜', '大吾', '赤红', 'N', '露西', '短裙少女', '登山大叔', '钓鱼佬', '超能力者', '空手道王', '暴走族', '研究员', '富家少爷', '双子星'];
export const CHALLENGES = [
  { 
    id: 'c1', 
    title: '闪光伊布的试炼', 
    desc: '初级训练师的入门战', 
    req: 5, 
    boss: 125, // 伊布
    bossLvl: 20, 
    teamSize: 3, 
    rewardId: 125, 
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', 
    color: '#E65100'
  },
  { 
    id: 'c2', 
    title: '燃烧的九尾', 
    desc: '对抗火焰的精英小队', 
    req: 20, 
    boss: 11, 
    bossLvl: 35, 
    teamSize: 4, 
    rewardId: 11, 
    bg: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)', 
    color: '#C62828'
  },
  { 
    id: 'c3', 
    title: '深海巨兽', 
    desc: '海洋霸主与其护卫', 
    req: 40, 
    boss: 123, 
    bossLvl: 50, 
    teamSize: 4, 
    rewardId: 123, 
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', 
    color: '#1565C0'
  },
  { 
    id: 'c4', 
    title: '合金风暴', 
    desc: '坚不可摧的钢铁防线', 
    req: 60, 
    boss: 140, 
    bossLvl: 60, 
    teamSize: 5, 
    rewardId: 140, 
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)', 
    color: '#455A64'
  },
  { 
    id: 'c5', 
    title: '龙之逆鳞', 
    desc: '准神兽的满员战队', 
    req: 80, 
    boss: 182, 
    bossLvl: 70, 
    teamSize: 6, 
    rewardId: 182, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', 
    color: '#6A1B9A'
  },
  { 
    id: 'c6', 
    title: '绝对零度', 
    desc: '传说中的急冻鸟', 
    req: 100, 
    boss: 91, 
    bossLvl: 80, 
    teamSize: 6, 
    rewardId: 91, 
    bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', 
    color: '#00838F'
  },
  { 
    id: 'c7', 
    title: '雷霆主宰', 
    desc: '传说中的闪电鸟', 
    req: 120, 
    boss: 92, 
    bossLvl: 85, 
    teamSize: 6, 
    rewardId: 92, 
    bg: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)', 
    color: '#F9A825'
  },
  { 
    id: 'c8', 
    title: '创世降临', 
    desc: '挑战宝可梦之神', 
    req: 150, 
    boss: 150, 
    bossLvl: 99, 
    teamSize: 6, 
    rewardId: 150, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', 
    color: '#4A148C'
  },
   { 
    id: 'c9', 
    title: '超能念力场', 
    desc: '对抗精神力量的极致', 
    req: 180, // 需要收集 180 只
    boss: 94, // 超能主宰 (超梦原型)
    bossLvl: 85, 
    teamSize: 6, 
    rewardId: 94, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', 
    color: '#8E24AA'
  },
  { 
    id: 'c10', 
    title: '钢铁长城', 
    desc: '无法被攻破的绝对防御', 
    req: 200, 
    boss: 206, // 合金暴龙
    bossLvl: 90, 
    teamSize: 6, 
    rewardId: 206, 
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #B0BEC5 100%)', 
    color: '#455A64'
  },
  { 
    id: 'c11', 
    title: '远古巨兽', 
    desc: '来自史前的原始力量', 
    req: 220, 
    boss: 259, // 大地泰坦
    bossLvl: 95, 
    teamSize: 6, 
    rewardId: 259, 
    bg: 'linear-gradient(135deg, #EFEBE9 0%, #A1887F 100%)', 
    color: '#5D4037'
  },
  { 
    id: 'c12', 
    title: '光与暗之歌', 
    desc: '同时面对光神与暗神', 
    req: 250, 
    boss: 254, // 起源之光 (实际上会在战斗逻辑里生成双Boss或强力Boss)
    bossLvl: 99, 
    teamSize: 6, 
    rewardId: 255, // 终焉之暗
    bg: 'linear-gradient(135deg, #212121 0%, #000000 100%)', 
    color: '#FFD700'
  }
];
export const CONTEST_CONFIG = {
  // 1. 捕虫大赛 (Map 1 微风草原)
  bug: {
    id: 'contest_bug',
    name: '捕虫大会',
    desc: '在当前地图捕捉虫系精灵，分数越高奖励越稀有！等级随地图变化',
    entryFee: 500,
    // 修正野怪池：110绿毛虫(弱), 38脉冲虫(中), 293寄生幼虫(中), 252圣甲虫(强/稀有)
    pool: [110, 38, 293, 252], 
    // 分级奖励 (按分数从高到低)
    tiers: [
      // 🏆 600分：必须抓到【闪光】的【强力虫子】才能达到
      { min: 600, id: 327, name: '虫群主宰(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 奇迹！你抓到了传说中的虫族霸主！' },
      
      // 🥇 450分：需要抓到【满个体值】的【强力虫子】(如圣甲虫)，或者【闪光】的【普通虫子】
      { min: 450, id: 252, name: '圣甲虫', level: 5, shiny: false, ivs: 4, msg: '🥇 冠军！这只甲虫力大无穷！' },
      
      // 🥈 300分：需要抓到【强力虫子】(圣甲虫)，或者个体值极高的中等虫子
      { min: 300, id: 112, name: '巴大蝶', level: 5, shiny: false, ivs: 3, msg: '🥈 优胜！这只蝴蝶翅膀很漂亮！' },
      
      // 🥉 0分：抓到绿毛虫通常只能拿这个
      { min: 0,   id: 110, name: '绿毛虫', level: 5, shiny: false, ivs: 2, msg: '🥉 参与奖。继续加油！' }
    ]
  },

  // ... (钓鱼和选美保持不变，或者你可以按同样逻辑调整)
  fishing: {
    id: 'contest_fishing',
    name: '钓鱼王杯',
    desc: '钓起大鱼！体重随徽章数增长，高徽章更容易钓到大鱼！',
    entryFee: 500,
    pool: [7, 24, 26, 173], 
    tiers: [
      { min: 120.0, id: 410, name: '海啸领主(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 钓鱼之神！传说中的深海霸主！' },
      { min: 60.0, id: 235, name: '海啸王', level: 5, shiny: false, ivs: 4, msg: '🥇 冠军！这可是稀有的海怪！' },
      { min: 25.0,  id: 22,  name: '激流鲨', level: 5, shiny: false, ivs: 3, msg: '🥈 亚军！这条鲨鱼很凶猛！' },
      { min: 0,     id: 7,   name: '泡泡鱼', level: 5, shiny: false, ivs: 2, msg: '🥉 只有一条泡泡鱼... 拿去煲汤吧。' }
    ]
  },
  beauty: {
    id: 'contest_beauty',
    name: '华丽大赛',
    desc: '展示魅力！赢取华丽的精灵！',
    entryFee: 1000,
    tiers: [
      { min: 250, id: 369, name: '仙子伊布(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 完美演出！全场为你欢呼！' },
      { min: 180, id: 329, name: '樱花女神', level: 5, shiny: false, ivs: 4, msg: '🥇 优胜！最美的精灵归你了！' },
      { min: 100, id: 61,  name: '星光舞者', level: 5, shiny: false, ivs: 3, msg: '🥈 表现不错！舞姿很优美。' },
      { min: 0,   id: 48,  name: '粉粉球', level: 5, shiny: false, ivs: 2, msg: '🥉 还需要练习哦。' }
    ]
  }
};
// ==========================================
// [修改] 特殊副本数据 (添加 rewards 字段)
// ==========================================
export const DUNGEONS = [
  { 
    id: 'gold_rush', name: '黄金矿洞', desc: '矿洞中散落着金币 (需2徽章)', type: 'gold', color: '#FFD700', icon: '💰', recLvl: 30,
    rarity: '普通', stars: 2,
    rewards: [
        { icon: '💰', text: '800 金币/场' },
        { icon: '⏰', text: '3场后冷却5分钟' }
    ]
  },
  { 
    id: 'exp_paradise', name: '经验乐园', desc: '经验加速区 (需1徽章)', type: 'exp', color: '#00E676', icon: '🎓', recLvl: 20,
    rarity: '普通', stars: 1,
    rewards: [
        { icon: '🍬', text: '等级匹配的经验' },
        { icon: '⏰', text: '3场后冷却5分钟' }
    ]
  },
  { 
    id: 'safari_zone', name: '狩猎地带', desc: '神兽出没！(需Lv.100 + 12徽章)', type: 'catch', color: '#FF7043', icon: '🐾', recLvl: 100,
    rarity: '传说', stars: 5,
    rewards: [
        { icon: '🐲', text: '随机神兽' },
        { icon: '🔴', text: '红色品质装备' }
    ]
  },
  { 
    id: 'stone_tower', name: '元素之塔', desc: '进化石掉落 (需5徽章+全队Lv.60)', type: 'stone', color: '#7B1FA2', icon: '🔮', recLvl: 60, restriction: 'min_lvl_60',
    rarity: '稀有', stars: 3,
    rewards: [
        { icon: '⚡', text: '随机进化石' },
        { icon: '⏰', text: '3场后冷却5分钟' }
    ]
  },
  { 
    id: 'hero_trial', name: '英雄试炼', desc: '属性增强剂 (需5徽章+单挑)', type: 'stat', color: '#F44336', icon: '💪', recLvl: 60, restriction: 'solo_run',
    rarity: '稀有', stars: 3,
    rewards: [
        { icon: '💪', text: '随机增强剂' },
        { icon: '🏅', text: '仅限单挑' }
    ]
  },
  { 
    id: 'rich_man', name: '豪宅金库', desc: '高回报金库 (需6徽章+门票)', type: 'gold_pro', color: '#FFC107', icon: '🏦', recLvl: 50, restriction: 'entry_fee',
    rarity: '史诗', stars: 4,
    rewards: [
        { icon: '💰', text: '8000 金币/场' },
        { icon: '🎫', text: '门票随徽章递增' }
    ]
  },
  { 
    id: 'shiny_valley', name: '闪光山谷', desc: '高闪光率 (需8徽章+幸运性格)', type: 'shiny_hunt', color: '#00E676', icon: '✨', recLvl: 80, restriction: 'lucky_nature',
    rarity: '史诗', stars: 4,
    rewards: [
        { icon: '✨', text: '高闪光概率' },
        { icon: '🍀', text: '幸运加成' }
    ]
  },
  { 
    id: 'infinity_castle', name: '无限城', desc: 'Roguelike模式 (需8徽章)', type: 'infinity', color: '#7B1FA2', icon: '🏯', recLvl: 80, restriction: 'none',
    rarity: '传说', stars: 5,
    rewards: [
        { icon: '👹', text: '鬼杀队遗物' },
        { icon: '⚔️', text: '呼吸法秘籍' }
    ]
  }
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
export const LEGENDARY_POOL = [144, 145, 146, 150, 151, 216, 218, 220, 222, 228, 233, 234, 235, 236, 242, 243, 244, 253, ...NEW_GOD_IDS,...FINAL_GOD_IDS, ...NEW_LEGENDARY_IDS]; 
export const HIGH_TIER_POOL = [3, 6, 9, 18, 33, 65, 69, 94, 130, 138, 139, 140, 143, 149, 160, 168, 182, 190, 199, 206, 241, 434, 437, 443, 446, 449, 452, 455, 459, 461, 463, 465, 467, 469, 471, 473, 475, 477, 479, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500]; 
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
  isJJK: true,
  rarity: '史诗', stars: 4,
  rewards: [
    { icon: '👹', text: '3000 金币' },
    { icon: '🔮', text: '咒具掉落' },
  ]
};

// 新活动副本
export const EXTRA_DUNGEONS = [
  {
    id: 'boss_rush', name: '连战Boss塔', desc: '连续挑战3个Boss (需4徽章)',
    type: 'boss_rush', color: '#D32F2F', icon: '🗼', recLvl: 40,
    rarity: '稀有', stars: 3,
    rewards: [
      { icon: '🏆', text: '通关奖金5000' },
      { icon: '🎁', text: '随机稀有道具' }
    ]
  },
  {
    id: 'type_challenge', name: '属性试炼场', desc: '指定属性限定战 (需3徽章)',
    type: 'type_challenge', color: '#1976D2', icon: '🎯', recLvl: 30,
    rarity: '普通', stars: 2,
    rewards: [
      { icon: '📖', text: '属性专精TM' },
      { icon: '💰', text: '1500 金币' }
    ]
  },
  {
    id: 'survival_arena', name: '生存竞技场', desc: '尽可能存活更多回合 (需7徽章)',
    type: 'survival', color: '#FF6F00', icon: '🏟️', recLvl: 70,
    rarity: '史诗', stars: 4,
    rewards: [
      { icon: '🏅', text: '按存活回合奖励' },
      { icon: '💎', text: '高回合高品质装备' }
    ]
  }
];
