// ==========================================
// 婚姻伴侣系统 - 数据定义
// ==========================================

export const AFFECTION_STAGES = [
  { id: 'stranger',  name: '陌生',  min: 0,    icon: '❓', color: '#9E9E9E' },
  { id: 'acquaint',  name: '认识',  min: 100,  icon: '👋', color: '#2196F3' },
  { id: 'friend',    name: '朋友',  min: 300,  icon: '😊', color: '#4CAF50' },
  { id: 'lover',     name: '恋人',  min: 600,  icon: '💕', color: '#E91E63' },
  { id: 'married',   name: '已婚',  min: 1000, icon: '💍', color: '#FF6F00' },
];

export const MARRIAGE_LEVELS = [
  { level: 0, name: '新婚',     min: 1000, bonusMult: 1.0 },
  { level: 1, name: '甜蜜',     min: 2000, bonusMult: 1.05 },
  { level: 2, name: '默契',     min: 4000, bonusMult: 1.10 },
  { level: 3, name: '灵魂伴侣', min: 8000, bonusMult: 1.20 },
];

export const getAffectionStage = (val) => {
  let stage = AFFECTION_STAGES[0];
  for (const s of AFFECTION_STAGES) { if (val >= s.min) stage = s; }
  return stage;
};

export const getMarriageLevel = (val) => {
  let lv = MARRIAGE_LEVELS[0];
  for (const l of MARRIAGE_LEVELS) { if (val >= l.min) lv = l; }
  return lv;
};

// 8位NPC候选人
export const MARRIAGE_CANDIDATES = [
  {
    id: 'sakura', name: '小樱', icon: '🌸', portrait: '🌸',
    personality: '温柔', title: '花艺师',
    desc: '热爱花草的温柔花艺师，总是被各种花香环绕。她相信每一朵花都有自己的语言。',
    favoriteGifts: ['seed', 'berry'],
    hatedGifts: ['poison'],
    bonus: { gardenYield: 0.3, seedQuality: 1 },
    bonusDesc: '花园产出+30%，种子品质提升',
    unlockCondition: null,
    dialogues: {
      stranger: [
        '你好呀，要来看看花吗？',
        '这朵花开得真美呢...',
        '你的精灵看起来很有精神！',
      ],
      acquaint: [
        '又来了呀！今天想看什么花？',
        '我新种了一株月见草，要来看看吗？',
        '和你聊天的时间总是过得很快呢。',
      ],
      friend: [
        '能和你做朋友真的好开心！',
        '下次一起去采花吧，我知道一个秘密花田。',
        '我给你编了一个花环，喜欢吗？',
      ],
      lover: [
        '看到你来，我的心就像花儿一样绽放了...',
        '我...我给你准备了特别的花束。',
        '只要和你在一起，哪里都像花园。',
      ],
      married: [
        '亲爱的，今天的花开得格外灿烂呢。',
        '我把花园打理得很漂亮，你快来看！',
        '你回来啦！我给你泡了花茶。',
      ],
    },
  },
  {
    id: 'xingchen', name: '星辰', icon: '🔮', portrait: '🔮',
    personality: '神秘', title: '占星师',
    desc: '神秘的占星师，能从星空中窥见未来。她的预言时灵时不灵，但总是很有趣。',
    favoriteGifts: ['stone', 'crystal'],
    hatedGifts: ['junk'],
    bonus: { freeReroll: 1, ivBoost: 2 },
    bonusDesc: '每日免费洗练1次，IV判定+2',
    unlockCondition: null,
    dialogues: {
      stranger: [
        '星星告诉我，今天会有有趣的人来...就是你？',
        '我看到了...你的运势还不错。',
        '你相信命运吗？',
      ],
      acquaint: [
        '今晚的星空很适合占卜呢。',
        '我在你的星盘上看到了冒险的征兆。',
        '每次见到你，我的水晶球都会发光。',
      ],
      friend: [
        '不是占卜告诉我的...是我自己想见你。',
        '星星说我们是命中注定的朋友！',
        '想知道你的桃花运吗？嘻嘻。',
      ],
      lover: [
        '我不需要占卜也知道...我喜欢你。',
        '星空为我们写了一个浪漫的故事。',
        '你是我所有预言中，最美好的那个。',
      ],
      married: [
        '今天的星象说我们会一直幸福下去。',
        '不用算了，和你在一起的每一天都是最好的。',
        '亲爱的，我看到了我们美好的未来。',
      ],
    },
  },
  {
    id: 'sherry', name: '雪莉', icon: '🍰', portrait: '🍰',
    personality: '活泼', title: '甜点师',
    desc: '活泼开朗的甜点师，做的蛋糕让人欲罢不能。她的笑容比甜点还甜。',
    favoriteGifts: ['candy', 'sugar'],
    hatedGifts: ['medicine'],
    bonus: { cafeGold: 0.25, brewCooldown: 0.8 },
    bonusDesc: '咖啡馆金币+25%，饮品冷却-20%',
    unlockCondition: null,
    dialogues: {
      stranger: [
        '要尝尝我新做的蛋糕吗？免费哦！',
        '甜食是世界上最棒的东西！',
        '我正在研究新配方，你来得正好！',
      ],
      acquaint: [
        '这个曲奇是专门为你做的！',
        '你觉得草莓味和巧克力味哪个好？',
        '一起来做甜点吧，会很有趣的！',
      ],
      friend: [
        '只有你吃我的甜点时，我才最开心。',
        '我偷偷给你留了最大的一块蛋糕！',
        '下次约会...不，一起做甜点吧！',
      ],
      lover: [
        '你比我做过最甜的糖果还要甜...',
        '我想做一辈子甜点给你吃。',
        '如果你是蛋糕，我一定舍不得切开。',
      ],
      married: [
        '今天做了你最爱的提拉米苏！',
        '亲爱的，来帮我试味嘛～',
        '我们的生活，比蜜糖还甜呢。',
      ],
    },
  },
  {
    id: 'raiko', name: '雷光', icon: '⚡', portrait: '⚡',
    personality: '热血', title: '训练家',
    desc: '充满热情的精灵训练家，总是精力充沛。他相信努力和汗水是通往强大的唯一道路。',
    favoriteGifts: ['protein', 'vitamin'],
    hatedGifts: ['sweet'],
    bonus: { expBoost: 0.15, intimacyBoost: 0.2 },
    bonusDesc: '全队经验+15%，亲密度+20%',
    unlockCondition: null,
    dialogues: {
      stranger: [
        '来一场对战吧！我的精灵可是很强的！',
        '训练！训练！每一天都要变强！',
        '你看起来是个不错的训练家！',
      ],
      acquaint: [
        '下次一起训练吧，互相切磋！',
        '你的精灵进步很大嘛！',
        '努力的人最帅了，就像你一样！',
      ],
      friend: [
        '和你一起训练，感觉特别有动力！',
        '我...偷偷观察你训练很久了。',
        '你是我最好的训练搭档！',
      ],
      lover: [
        '不只是搭档...你是我最重要的人。',
        '我会变得更强来保护你！',
        '和你在一起，每天都热血沸腾！',
      ],
      married: [
        '一起晨跑吧！然后吃我做的早餐！',
        '今天也要加油训练！...不过先亲一个。',
        '我最大的力量来源，就是你！',
      ],
    },
  },
  {
    id: 'yuehua', name: '月华', icon: '🌙', portrait: '🌙',
    personality: '温和', title: '治愈师',
    desc: '沉静温和的治愈师，能安抚受伤精灵的心灵。她的声音有让人安心的力量。',
    favoriteGifts: ['herb', 'potion'],
    hatedGifts: ['weapon'],
    bonus: { healEfficiency: 0.3 },
    bonusDesc: '精灵入住家园回复效率+30%',
    unlockCondition: null,
    dialogues: {
      stranger: [
        '你的精灵受伤了吗？让我看看。',
        '治愈，是我最擅长的事。',
        '每一个生命都值得被温柔对待。',
      ],
      acquaint: [
        '来喝杯草药茶吧，对身体好。',
        '你今天看起来有点疲惫呢。',
        '我新研制了一种疗伤药膏。',
      ],
      friend: [
        '你受伤的时候...我会很心疼的。',
        '能治愈你，是我最幸福的事。',
        '在你身边，我觉得自己也被治愈了。',
      ],
      lover: [
        '我想成为你一辈子的专属治愈师。',
        '不管什么伤痛，我都会陪你度过。',
        '你的笑容，就是最好的药。',
      ],
      married: [
        '好好休息吧，我来照顾一切。',
        '今天的药草汤加了蜂蜜，应该好喝一些。',
        '有你在身边，我的心也被治愈了。',
      ],
    },
  },
  {
    id: 'canglan', name: '苍岚', icon: '🗺️', portrait: '🗺️',
    personality: '豪爽', title: '冒险家',
    desc: '走遍世界的豪爽冒险家，总有讲不完的故事。他的背包里永远装着意想不到的宝物。',
    favoriteGifts: ['ball', 'rare'],
    hatedGifts: ['common'],
    bonus: { dropQuality: 1 },
    bonusDesc: '宝箱/装备掉落品质+1档',
    unlockCondition: { badges: 6 },
    dialogues: {
      stranger: [
        '嘿！你看起来像个有故事的人！',
        '知道吗？我刚从一个秘密遗迹回来！',
        '冒险的人生才精彩！',
      ],
      acquaint: [
        '下次冒险带上你，怎么样？',
        '我在远古遗迹找到了个好东西给你！',
        '你是我遇到过最有意思的人！',
      ],
      friend: [
        '不管去哪里冒险，我都会想着你。',
        '这是我最珍贵的宝物...送给你。',
        '有你在的冒险，才是真正的冒险。',
      ],
      lover: [
        '我走遍了世界，最美的风景是你。',
        '以后的冒险...我只想和你一起。',
        '你就是我最伟大的发现。',
      ],
      married: [
        '今天发现了一个秘密洞穴，一起去探险？',
        '我从外面带回了好东西，快看！',
        '家是最好的港湾，因为有你在。',
      ],
    },
  },
  {
    id: 'liuli', name: '琉璃', icon: '💎', portrait: '💎',
    personality: '优雅', title: '宝石匠',
    desc: '优雅精致的宝石匠，能将普通石头打磨成绝美宝石。她对美的追求近乎偏执。',
    favoriteGifts: ['gem', 'accessory'],
    hatedGifts: ['dirt'],
    bonus: { furnitureQuality: 1, homeScore: 0.15 },
    bonusDesc: '家具品质概率提升，家园评分+15%',
    unlockCondition: { houseType: 'house' },
    dialogues: {
      stranger: [
        '这颗宝石...不，你的眼睛更闪耀。',
        '品味是天生的，你似乎也有不错的品味。',
        '美，是这个世界上最珍贵的东西。',
      ],
      acquaint: [
        '我为你打磨了一颗特别的宝石。',
        '你对装饰有什么想法？我可以帮你设计。',
        '和你在一起，灵感源源不断。',
      ],
      friend: [
        '你就像一颗未经打磨的宝石...完美。',
        '我想为你打造世界上最美的饰品。',
        '在我眼里，你比任何宝石都珍贵。',
      ],
      lover: [
        '我愿意用一生来雕琢我们的爱情。',
        '你是我最珍贵的作品...不，是宝物。',
        '每颗宝石里，我都看见了你的影子。',
      ],
      married: [
        '我又做了新的家具装饰，你觉得如何？',
        '家里需要更多美丽的东西...就像你一样。',
        '亲爱的，你今天也闪闪发光呢。',
      ],
    },
  },
  {
    id: 'lingshuang', name: '凌霜', icon: '🗡️', portrait: '🗡️',
    personality: '冷傲', title: '剑客',
    desc: '沉默寡言的冷傲剑客，剑术精湛但不善言辞。她用行动表达一切，内心其实很温柔。',
    favoriteGifts: ['tm', 'equipment'],
    hatedGifts: ['cute'],
    bonus: { ivBase: 3, shinyRate: 1.2 },
    bonusDesc: '野外精灵IV基础+3，闪光率x1.2',
    unlockCondition: { badges: 8 },
    dialogues: {
      stranger: [
        '......不要挡路。',
        '你的剑术...还行。',
        '...走吧。',
      ],
      acquaint: [
        '...你又来了。',
        '今天的风...还不错。',
        '你比看起来要强。',
      ],
      friend: [
        '...和你在一起，不讨厌。',
        '这把剑...是备用的，给你。',
        '下次...一起练剑？',
      ],
      lover: [
        '我...不擅长说那种话。但是...你很重要。',
        '只有你...能让我放下剑。',
        '我的剑，今后只为你而战。',
      ],
      married: [
        '...饭做好了，别让它凉了。',
        '今天我去巡逻了...顺便采了些花给你。',
        '你回来了...嗯，我等了一会儿。',
      ],
    },
  },
];

export const GIFT_CATEGORY_MAP = {
  seed: ['花种', '草种', '果种'],
  berry: ['树果', '奇异果'],
  stone: ['进化石', '月之石', '太阳石'],
  crystal: ['水晶', '宝石'],
  candy: ['神奇糖果', '经验糖果'],
  sugar: ['甜食', '巧克力'],
  protein: ['蛋白质', '增强剂'],
  vitamin: ['维他命', '钙片'],
  herb: ['草药', '回复草'],
  potion: ['药水', '伤药'],
  ball: ['精灵球', '高级球'],
  rare: ['稀有物品', '大师球'],
  gem: ['宝石', '钻石'],
  accessory: ['饰品', '装备'],
  tm: ['技能书', '秘传机'],
  equipment: ['武器', '铠甲'],
  poison: ['毒草', '毒药'],
  junk: ['废铁', '垃圾'],
  medicine: ['苦药', '解毒剂'],
  weapon: ['利器', '凶器'],
  common: ['普通球', '常见物'],
  dirt: ['泥土', '沙子'],
  cute: ['可爱玩偶', '粉色物品'],
  sweet: ['甜食', '糖果'],
};

export const DATE_EVENTS = [
  {
    id: 'cafe_chat',
    stage: 'acquaint',
    text: '你们在咖啡馆找了个安静的角落坐下。{name}笑着问你：',
    question: '"如果可以去任何地方旅行，你会选哪里？"',
    options: [
      { text: '微风草原，那里是一切开始的地方', affection: 15, reply: '"真浪漫呢！初心最珍贵。"' },
      { text: '银河空间站，去看星星', affection: 25, reply: '"哇！和我想的一样！"' },
      { text: '哪里都行，只要和你在一起', affection: 10, reply: '"（脸红）...别说这种话啦。"' },
    ],
  },
  {
    id: 'gift_taste',
    stage: 'acquaint',
    text: '{name}看着你手中的饮品好奇地问：',
    question: '"你喜欢什么口味的饮品？"',
    options: [
      { text: '甜的，越甜越好', affection: 15, reply: '"甜食控！我也是！"' },
      { text: '苦咖啡，提神醒脑', affection: 20, reply: '"很成熟的选择呢。"' },
      { text: '只要是你推荐的都好', affection: 10, reply: '"（偷笑）真会说话。"' },
    ],
  },
  {
    id: 'pet_talk',
    stage: 'friend',
    text: '你们聊起了各自的精灵。{name}认真地看着你：',
    question: '"你觉得精灵最重要的是什么？"',
    options: [
      { text: '实力，强大才是硬道理', affection: 10, reply: '"力量确实重要...但不是全部。"' },
      { text: '和训练家的羁绊', affection: 25, reply: '"说得太好了！我们想法一致！"' },
      { text: '快乐地成长', affection: 20, reply: '"嗯！精灵的笑容最珍贵。"' },
    ],
  },
  {
    id: 'future_dream',
    stage: 'friend',
    text: '月光洒落在咖啡馆的窗台上。{name}轻声问：',
    question: '"你有没有想过...未来会是什么样？"',
    options: [
      { text: '成为最强的训练家', affection: 15, reply: '"好远大的志向！"' },
      { text: '和重要的人一起生活', affection: 25, reply: '"（心跳加速）...我也是。"' },
      { text: '走遍这个世界的每一个角落', affection: 20, reply: '"真棒，带上我吧！"' },
    ],
  },
  {
    id: 'confession_mood',
    stage: 'lover',
    text: '{name}今天显得格外认真，紧紧握着你的手：',
    question: '"有件事我一直想告诉你..."',
    options: [
      { text: '（静静地看着对方的眼睛）', affection: 30, reply: '"...遇见你，是我这辈子最幸运的事。"' },
      { text: '我也有话想说', affection: 25, reply: '"那...我们一起说？三二一——我喜欢你！"' },
      { text: '（紧紧握住对方的手）', affection: 20, reply: '"（微笑）你什么都不用说，我都懂。"' },
    ],
  },
  {
    id: 'stargazing',
    stage: 'lover',
    text: '你们一起坐在屋顶看星星。{name}靠在你肩上：',
    question: '"你说...我们会一直在一起吗？"',
    options: [
      { text: '会的，我保证', affection: 30, reply: '"（幸福地闭上眼睛）...嗯。"' },
      { text: '只要你愿意', affection: 25, reply: '"笨蛋...我当然愿意。"' },
      { text: '比星星存在的时间还久', affection: 20, reply: '"（笑）你什么时候变得这么会说话了。"' },
    ],
  },
];

export const WEDDING_DIALOGUE = [
  { name: '司仪', text: '各位来宾！今天我们在这里见证一对新人的结合！' },
  { name: '司仪', text: '在精灵们的祝福下，你们将携手共度未来的每一天。' },
  { name: '{spouse}', text: '我...我真的好开心。谢谢你选择了我。' },
  { name: '{spouse}', text: '从今以后，不管遇到什么困难，我都会陪在你身边。' },
  { name: '司仪', text: '请交换戒指！' },
  { name: '系统', text: '🎊 恭喜！你们正式结为伴侣！获得称号「新婚快乐」！' },
  { name: '{spouse}', text: '这是我一生中最幸福的时刻...我爱你。' },
];

export const PROPOSE_COST = 50000;
export const WEDDING_COST = 100000;
export const DATE_COST = 1000;
export const DAILY_DATE_LIMIT = 3;
export const DAILY_GIFT_LIMIT = 2;
export const DIVORCE_COOLDOWN_DAYS = 7;

export const PROPOSAL_QUESTS = {
  sakura: {
    name: '小樱的心愿',
    steps: [
      { id: 'collect_flowers', desc: '在花园中种植并收获3次植物', type: 'garden_harvest', target: 3, icon: '🌸' },
      { id: 'win_battles', desc: '和小樱一起赢得5场战斗', type: 'battle_win', target: 5, icon: '⚔️' },
      { id: 'gift_favorite', desc: '送给小樱3份她喜欢的礼物', type: 'gift_favorite', target: 3, icon: '🎁' },
    ],
  },
  xingchen: {
    name: '星辰的占卜',
    steps: [
      { id: 'catch_pokemon', desc: '捕捉3只不同的精灵', type: 'catch', target: 3, icon: '🔮' },
      { id: 'win_battles', desc: '在星辰的注视下赢得5场战斗', type: 'battle_win', target: 5, icon: '⚔️' },
      { id: 'earn_gold', desc: '累计获得20000金币', type: 'earn_gold', target: 20000, icon: '💰' },
    ],
  },
  sherry: {
    name: '雪莉的甜点派对',
    steps: [
      { id: 'brew_drinks', desc: '在咖啡厅酿造3杯饮品', type: 'brew', target: 3, icon: '☕' },
      { id: 'win_battles', desc: '一起赢得5场战斗', type: 'battle_win', target: 5, icon: '⚔️' },
      { id: 'gift_favorite', desc: '送给雪莉3份她喜欢的礼物', type: 'gift_favorite', target: 3, icon: '🎁' },
    ],
  },
  raiko: {
    name: '雷光的试炼',
    steps: [
      { id: 'level_up', desc: '将任意精灵提升5个等级', type: 'level_up', target: 5, icon: '⬆️' },
      { id: 'win_battles', desc: '赢得8场战斗证明实力', type: 'battle_win', target: 8, icon: '⚔️' },
      { id: 'train_intimacy', desc: '将1只精灵亲密度提升到100', type: 'intimacy', target: 100, icon: '💕' },
    ],
  },
  yuehua: {
    name: '月华的祝福',
    steps: [
      { id: 'heal_pokemon', desc: '在家园中让精灵恢复HP 5次', type: 'housing_heal', target: 5, icon: '💚' },
      { id: 'win_battles', desc: '一起赢得5场战斗', type: 'battle_win', target: 5, icon: '⚔️' },
      { id: 'gift_favorite', desc: '送给月华3份她喜欢的礼物', type: 'gift_favorite', target: 3, icon: '🎁' },
    ],
  },
  canglan: {
    name: '苍岚的冒险',
    steps: [
      { id: 'explore_maps', desc: '探索3张不同的地图', type: 'explore', target: 3, icon: '🗺️' },
      { id: 'win_battles', desc: '赢得8场激烈战斗', type: 'battle_win', target: 8, icon: '⚔️' },
      { id: 'open_chests', desc: '打开5个宝箱', type: 'chest', target: 5, icon: '📦' },
    ],
  },
  liuli: {
    name: '琉璃的品鉴',
    steps: [
      { id: 'furniture', desc: '放置5件家具装饰家园', type: 'place_furniture', target: 5, icon: '🪑' },
      { id: 'win_battles', desc: '一起赢得5场战斗', type: 'battle_win', target: 5, icon: '⚔️' },
      { id: 'home_score', desc: '家园评分达到200', type: 'home_score', target: 200, icon: '⭐' },
    ],
  },
  lingshuang: {
    name: '凌霜的剑道',
    steps: [
      { id: 'win_streak', desc: '连续赢得3场战斗', type: 'win_streak', target: 3, icon: '🗡️' },
      { id: 'win_battles', desc: '赢得10场战斗', type: 'battle_win', target: 10, icon: '⚔️' },
      { id: 'catch_shiny', desc: '拥有1只闪光精灵', type: 'own_shiny', target: 1, icon: '✨' },
    ],
  },
};

export const DEFAULT_MARRIAGE_STATE = {
  spouse: null,
  affections: {},
  dailyCounts: { dates: 0, gifts: 0, chats: {}, resetDate: null },
  weddingDate: null,
  marriageLevel: 0,
  divorceDate: null,
  questProgress: {},
  pendingPropose: null,
};

export const getSpouseBonus = (candidate, marriageLevel) => {
  if (!candidate) return {};
  const ml = MARRIAGE_LEVELS.find(l => l.level === marriageLevel) || MARRIAGE_LEVELS[0];
  const mult = ml.bonusMult;
  const bonus = { ...candidate.bonus };
  for (const key of Object.keys(bonus)) {
    if (typeof bonus[key] === 'number') bonus[key] *= mult;
  }
  bonus.intimacyBoost = 0.1 * mult;
  bonus.cafeGoldBase = 0.1 * mult;
  return bonus;
};

export const getDailyGift = (candidate, marriageLevel) => {
  if (!candidate) return null;
  const ml = MARRIAGE_LEVELS.find(l => l.level === marriageLevel) || MARRIAGE_LEVELS[0];
  const gifts = [
    { type: 'gold', amount: 500 + marriageLevel * 200, text: `💰 ${candidate.name}给你准备了零花钱` },
    { type: 'gold', amount: 800 + marriageLevel * 300, text: `💰 ${candidate.name}卖了些东西换了钱给你` },
    { type: 'item', item: 'potion', amount: 2 + marriageLevel, text: `🧪 ${candidate.name}给你准备了药品` },
    { type: 'item', item: 'candy', amount: 1, text: `🍬 ${candidate.name}给你找到了一颗神奇糖果` },
  ];
  if (ml.level >= 2) {
    gifts.push({ type: 'item', item: 'vitamin', amount: 1, text: `💊 ${candidate.name}给你买了维他命` });
  }
  if (ml.level >= 3) {
    gifts.push({ type: 'item', item: 'rare_candy', amount: 1, text: `⭐ ${candidate.name}找到了稀有物品` });
  }
  return gifts[Math.floor(Math.random() * gifts.length)];
};
