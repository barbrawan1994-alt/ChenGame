export const STORY_SCRIPT = [
  {
    chapter: 0,
    mapId: 1, // 微风草原
    title: "第一章：枯萎与新生",
    objective: "击败狂暴的野生精灵，从日蚀队手中救下妙蛙种子。",
    intro: [
      { name: "大木博士", text: "情况比想象中更糟！虚空能量不仅让植物枯萎，还让温顺的精灵变得极度狂暴！" },
      { name: "大木博士", text: "我探测到一只珍贵的【叶苗苗】正在被日蚀队追捕，快去救它！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 44, name: '狂暴的 贪吃鼠', text: '吱吱吱！！！（双眼发红，疯狂地向你扑来）', emoji: '🐀' },
      { step: 1, x: 20, y: 12, type: 'dialog', name: '被困的 叶苗苗', text: "（小家伙瑟瑟发抖地躲在树桩后，它的腿受伤了。你给它进行了简单的包扎。）", emoji: '🌱' },
      { step: 2, x: 15, y: 8, type: 'battle', enemyId: 118, name: '日蚀队 捕猎者', text: '那是我的猎物！这种稀有实验体能换不少钱呢！', emoji: '😈' }
    ],
    midEvent: { enemyId: 118, name: '日蚀队 捕猎者' }, 
    outro: [
      { name: "馆主 莉佳", text: "太好了，这孩子得救了。看，它似乎很想跟随你。" },
      { name: "系统", text: "获得奖励：精灵【叶苗苗】(御三家)！" }
    ],
    // 【新增】reward.pokemon 字段
    reward: { gold: 1000, items: [{id:'potion', count:5}], pokemon: {id: 1, level: 10} }
  },
  {
    chapter: 1,
    mapId: 2, // 回声山谷
    title: "第二章：坚如磐石",
    objective: "突破日蚀队的封锁线，阻止爆破计划。",
    intro: [
      { name: "登山大叔", text: "日蚀队封锁了山口！他们不仅埋了炸弹，还派了重兵把守！" },
      { name: "登山大叔", text: "小刚馆主正在最深处拆弹，我们必须帮他清理外围的敌人！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 15, type: 'battle', enemyId: 64, name: '日蚀队 守卫', text: "此路不通！这里即将成为废墟！", emoji: '🚧' },
      { step: 1, x: 22, y: 5, type: 'battle', enemyId: 66, name: '日蚀队 突击兵', text: "为了首领的宏愿，牺牲是必要的！", emoji: '⚔️' },
      { step: 2, x: 20, y: 10, type: 'battle', enemyId: 15, name: '日蚀队 爆破专家', text: "倒计时30秒！来不及了！一起炸飞吧！", emoji: '💣' }
    ],
    midEvent: { enemyId: 15, name: '日蚀队 爆破专家' },
    outro: [
      { name: "馆主 小刚", text: "干得漂亮！这只【小火雀】刚才一直在试图啄断引信，真是勇敢的小家伙。" },
      { name: "馆主 小刚", text: "它似乎认可了你的实力，带上它一起旅行吧。" },
      { name: "系统", text: "获得奖励：精灵【小火雀】(稀有火系)！" }
    ],
    reward: { gold: 2000, balls: { great: 5 }, pokemon: {id: 16, level: 15} }
  },
  {
    chapter: 2,
    mapId: 3, // 遗迹工厂
    title: "第三章：被遗弃的数据",
    objective: "击败失控的机械守卫，获取多边兽原型机。",
    intro: [
      { name: "大木博士", text: "这座工厂里藏着一只名为【多边兽】的人造精灵原型机。" },
      { name: "大木博士", text: "日蚀队想要改写它的程序，把它变成杀戮机器。一定要赶在他们之前找到它！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 34, name: '暴走的 插头怪', text: "滋滋... 滋滋... 靠近者... 抹杀...", emoji: '🔌' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 40, name: '安保机器人 Mk-II', text: "检测到非法入侵。启动防御协议。", emoji: '🤖' },
      { step: 2, x: 15, y: 15, type: 'battle', enemyId: 81, name: '日蚀队 首席科学家', text: "原型机是我的！只要有了它，我就能黑入世界银行！", emoji: '👨‍🔬' }
    ],
    midEvent: { enemyId: 81, name: '日蚀队 首席科学家' }, 
    outro: [
      { name: "馆主 马志士", text: "Wow! 你救下了这堆数据代码。它看起来很喜欢你的图鉴装置。" },
      { name: "系统", text: "获得奖励：精灵【多边兽】(稀有)！" }
    ],
    reward: { gold: 3000, items: [{id:'vit_satk', count:3}], pokemon: {id: 131, level: 20} }
  },
  {
    chapter: 3,
    mapId: 4, // 深蓝海域
    title: "第四章：深海的呼救",
    objective: "清理剧毒污染物，解救被困的拉普拉斯。",
    intro: [
      { name: "渔夫", text: "听到了吗？那是拉普拉斯（乘龙）的歌声，它在求救！" },
      { name: "渔夫", text: "日蚀队在海里倾倒了大量毒素，还派出了水下部队阻拦救援！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 27, name: '剧毒 触手怪', text: "（浑身散发着恶臭，向你喷射毒液）", emoji: '🦑' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 118, name: '日蚀队 潜水员', text: "这片海域已经被征用了！滚开！", emoji: '🤿' },
      { step: 2, x: 10, y: 10, type: 'battle', enemyId: 130, name: '被侵蚀的 暴鲤龙', text: "吼！！！（痛苦地翻滚着，试图摆脱身上的油污）", emoji: '🐉' }
    ],
    midEvent: { enemyId: 130, name: '被侵蚀的 暴鲤龙' }, 
    outro: [
      { name: "馆主 小霞", text: "谢谢你净化了大海。这只【拉普拉斯】是族群里最小的一只，它希望能跟随你报恩。" },
      { name: "系统", text: "获得奖励：精灵【拉普拉斯】(强力冰/水)！" }
    ],
    reward: { gold: 4000, items: [{id:'berry', count:10}], pokemon: {id: 123, level: 25} }
  },
  {
    chapter: 4,
    mapId: 5, // 熔岩火山
    title: "第五章：进化的可能性",
    objective: "在火山深处寻找进化的契机，击败火焰干部。",
    intro: [
      { name: "日蚀队 干部·炎", text: "伊布这种弱小的生物，只有在极端的环境下才能进化成强大的形态！" },
      { name: "玩家", text: "强迫进化是错误的！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 12, type: 'battle', enemyId: 104, name: '狂暴 火花猴', text: "叽叽！！（被高温折磨得失去了理智）", emoji: '🐒' },
      { step: 1, x: 22, y: 5, type: 'battle', enemyId: 105, name: '日蚀队 精英卫队', text: "干部正在进行伟大的实验，禁止打扰！", emoji: '💂' },
      { step: 2, x: 12, y: 8, type: 'battle', enemyId: 126, name: '日蚀队 干部·炎', text: "既然你这么想保护它，那就让这只伊布看看，什么是真正的力量！", emoji: '🔥' }
    ],
    midEvent: { enemyId: 126, name: '日蚀队 干部·炎' }, 
    outro: [
      { name: "馆主 夏伯", text: "你救下了这只【伊布】。它拥有无限的可能性，好好培养它吧。" },
      { name: "系统", text: "获得奖励：精灵【伊布】(可多分支进化)！" }
    ],
    reward: { gold: 5000, balls: { master: 1 }, pokemon: {id: 125, level: 30} }
  },
  {
    chapter: 5,
    mapId: 6, // 赛博都市
    title: "第六章：钢铁意志",
    objective: "突破机械军团，夺回城市控制权。",
    intro: [
      { name: "神秘黑客", text: "整座城市的防御系统都被激活了！你必须一路打进去！" },
      { name: "神秘黑客", text: "小心，他们部署了最新的合金宝可梦。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 87, name: '巡逻 铁哑铃', text: "目标锁定... 排除...", emoji: '🔩' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 88, name: '重装 金属怪', text: "装甲强度 100%... 准备撞击...", emoji: '🦾' },
      { step: 2, x: 18, y: 12, type: 'battle', enemyId: 132, name: 'AI 核心守护者', text: "检测到最高级威胁... 启动歼灭模式... 目标：排除。", emoji: '🤖' }
    ],
    midEvent: { enemyId: 132, name: 'AI 核心守护者' }, 
    outro: [
      { name: "馆主 娜姿", text: "系统恢复了。这只【铁哑铃】似乎摆脱了控制，它想成为你的力量。" },
      { name: "系统", text: "获得奖励：精灵【铁哑铃】(准神幼体)！" }
    ],
    reward: { gold: 6000, items: [{id:'vit_satk', count:5}], pokemon: {id: 87, level: 35} }
  },
  {
    chapter: 6,
    mapId: 7, // 幽灵古堡
    title: "第七章：暗影中的微光",
    objective: "在充满恶意的古堡中，寻找纯净的灵魂。",
    intro: [
      { name: "幽灵", text: "不要... 不要过来... 那个紫色的影子会吃掉我们..." },
      { name: "大木博士", text: "日蚀队在利用幽灵系宝可梦制造恐惧！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 54, name: '恶作剧的 飘飘魂', text: "嘻嘻嘻... 陪我玩... 永远留在这里吧！", emoji: '👻' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 59, name: '怨念 诅咒娃娃', text: "好恨啊... 为什么只有我被抛弃...", emoji: '🎎' },
      { step: 2, x: 15, y: 10, type: 'battle', enemyId: 94, name: '噬魂 耿鬼', text: "多么美味的恐惧！让我尝尝你的灵魂！", emoji: '👿' }
    ],
    midEvent: { enemyId: 94, name: '噬魂 耿鬼' }, 
    outro: [
      { name: "馆主 松叶", text: "这只【烛光灵】一直保护着其他弱小的幽灵。它是一盏指引之灯。" },
      { name: "系统", text: "获得奖励：精灵【烛光灵】(特攻强力)！" }
    ],
    reward: { gold: 7000, items: [{id:'vit_sdef', count:5}], pokemon: {id: 18, level: 40} }
  },
  {
    chapter: 7,
    mapId: 8, // 天空王座
    title: "第八章：龙之血脉",
    objective: "登上云端，证明你有驾驭龙的力量。",
    intro: [
      { name: "飞行员", text: "高空的乱流太强了！只有最强的飞行系宝可梦才能在这里生存。" },
      { name: "飞行员", text: "传说中，这里栖息着龙族的后裔。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 42, name: '巡空 疾风鹰', text: "（锐利的眼神锁定了你，俯冲而下！）", emoji: '🦅' },
      { step: 1, x: 20, y: 5, type: 'battle', enemyId: 142, name: '虚空 猎手', text: "（发出刺耳的尖啸，试图阻止你靠近裂缝）", emoji: '🦇' },
      { step: 2, x: 14, y: 14, type: 'battle', enemyId: 142, name: '虚空裂缝守护者', text: "（它守护着裂缝，周围的空间都在扭曲！）", emoji: '🌪️' }
    ],
    midEvent: { enemyId: 142, name: '虚空裂缝守护者' }, 
    outro: [
      { name: "馆主 娜琪", text: "你征服了天空。这只【迷你蛇】（迷你龙）感受到了你的霸气，它愿意追随未来的龙之大师。" },
      { name: "系统", text: "获得奖励：精灵【迷你蛇】(准神幼体)！" }
    ],
    reward: { gold: 8000, items: [{id:'vit_spd', count:5}], pokemon: {id: 79, level: 45} }
  },
  {
    chapter: 8,
    mapId: 9, // 极寒冻土
    title: "第九章：冰封的守护",
    objective: "击败极寒守卫，获得冰系强者的认可。",
    intro: [
      { name: "大木博士", text: "这里的温度低得可怕！日蚀队唤醒了沉睡的古代冰兽。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 76, name: '领地意识的 海豹', text: "（它不允许任何人靠近它的领地）", emoji: '🦭' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 199, name: '狂暴 象牙猪', text: "吼！！！（巨大的獠牙能粉碎一切）", emoji: '🐗' },
      { step: 2, x: 16, y: 8, type: 'battle', enemyId: 131, name: '极寒 乘龙', text: "（周围的空气瞬间凝固，连时间仿佛都被冻结了）", emoji: '❄️' }
    ],
    midEvent: { enemyId: 131, name: '极寒 乘龙' }, 
    outro: [
      { name: "馆主 哈奇库", text: "这只【雪球海豹】在刚才的战斗中一直注视着你。它想去看看外面的世界。" },
      { name: "系统", text: "获得奖励：精灵【雪球海豹】！" }
    ],
    reward: { gold: 10000, items: [{id:'vit_pdef', count:5}], pokemon: {id: 76, level: 50} }
  },
  {
    chapter: 9,
    mapId: 10, // 流沙荒漠
    title: "第十章：沙暴中的利刃",
    objective: "在沙暴中生存下来，击败地面的霸主。",
    intro: [
      { name: "日蚀队 副首领", text: "欢迎来到我的主场。这里的沙暴会剥夺你所有的体力！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 68, name: '潜伏的 穿山甲', text: "（突然从沙地里钻了出来！）", emoji: '🦔' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 185, name: '剧毒 龙王蝎', text: "（尾巴上的毒针闪烁着紫光）", emoji: '🦂' },
      { step: 2, x: 20, y: 15, type: 'battle', enemyId: 248, name: '日蚀队 副首领', text: "感受绝望吧！沙暴葬送！", emoji: '🦂' }
    ],
    midEvent: { enemyId: 248, name: '日蚀队 副首领' }, 
    outro: [
      { name: "日蚀队 副首领", text: "可恶... 连【幼鲨】（圆陆鲨）都背叛了我吗？" },
      { name: "系统", text: "获得奖励：精灵【幼鲨】(准神幼体)！" }
    ],
    reward: { gold: 15000, balls: { master: 2 }, pokemon: {id: 82, level: 55} }
  },
  {
    chapter: 10,
    mapId: 11, // 糖果王国
    title: "第十一章：梦境的终结",
    objective: "打破甜蜜的噩梦，直面内心的恐惧。",
    intro: [
      { name: "大木博士", text: "不要被表象迷惑！这里的一切都是幻觉！" }
    ],
    tasks: [
      { step: 0, x: 15, y: 5, type: 'battle', enemyId: 48, name: '诡异的 粉粉球', text: "来玩吧... 永远留在这里...", emoji: '🧶' },
      { step: 1, x: 5, y: 15, type: 'battle', enemyId: 178, name: '梦境 守门人', text: "你醒不过来的... 放弃吧...", emoji: '🧙' },
      { step: 2, x: 10, y: 12, type: 'battle', enemyId: 146, name: '噩梦神 达克莱伊', text: "为什么要醒来？现实只有痛苦... 沉睡吧... 永远...", emoji: '🌑' }
    ],
    midEvent: { enemyId: 146, name: '噩梦神 达克莱伊' }, 
    outro: [
      { name: "馆主 玛绣", text: "噩梦消散了。这只【星之子】是希望的象征，请带上它。" },
      { name: "系统", text: "获得奖励：精灵【星之子】！" }
    ],
    reward: { gold: 20000, items: [{id:'vit_crit', count:3}], pokemon: {id: 60, level: 60} }
  },
  {
    chapter: 11,
    mapId: 12, // 银河空间站
    title: "终章：创世与终焉",
    objective: "在宇宙边缘击败日蚀队首领与虚空之神。",
    intro: [
      { name: "日蚀队 首领", text: "欢迎来到世界的尽头。旧世界已经腐朽，唯有虚空能带来新生。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 10, type: 'battle', enemyId: 253, name: '虚空 守门人', text: "此路不通。", emoji: '🛡️' },
      { step: 1, x: 25, y: 10, type: 'battle', enemyId: 253, name: '虚空 处刑者', text: "毁灭即是新生。", emoji: '⚔️' },
      { step: 2, x: 15, y: 5, type: 'battle', enemyId: 255, name: '虚空之神', text: "（不可名状的咆哮，周围的空间开始崩塌）", emoji: '⚫' }
    ],
    midEvent: { enemyId: 255, name: '虚空之神' }, 
    outro: [
      { name: "系统", text: "虚空之神发出最后一声哀鸣，消散在宇宙尘埃中..." },
      { name: "大木博士", text: "你做到了！你拯救了世界！" },
      { name: "系统", text: "恭喜通关一周目！你已成为传说中的宝可梦大师！" },
      { name: "系统", text: "（提示：集齐12枚徽章后，可前往【冠军之路】挑战隐藏的巅峰强者...）" }
    ],
    reward: { gold: 99999, balls: { master: 10 } }
  },
  {
    chapter: 12,
    mapId: 13, // 冠军之路
    title: "隐藏篇：巅峰对决",
    objective: "击败五大天王，登顶世界之巅！",
    intro: [
      { name: "神秘人", text: "呵呵呵... 看来新的挑战者出现了。来【冠军之路】吧，我们五大天王在等着你。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 271, name: '天王 元素领主', text: "我是第一天王！万物皆有元素，而我掌控一切！", emoji: '🔥' },
      { step: 1, x: 5, y: 5, type: 'battle', enemyId: 269, name: '天王 秩序圣骑', text: "我是第二天王！你的攻击在绝对的秩序面前毫无意义！", emoji: '🛡️' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 270, name: '天王 武斗神', text: "我是第三天王！无需多言，用拳头来交流吧！", emoji: '👊' },
      { step: 3, x: 25, y: 5, type: 'battle', enemyId: 280, name: '天王 虫群之心', text: "我是第四天王！感受亿万虫群的恐惧吧！", emoji: '🦗' },
      { step: 4, x: 15, y: 2, type: 'battle', enemyId: 283, name: '冠军 创世元灵', text: "终于来了... 你战胜了我的四位护法。现在，向神发起挑战吧！", emoji: '👑' }
    ],
    midEvent: { enemyId: 283, name: '冠军 创世元灵' }, 
    outro: [
      { name: "冠军", text: "了不起... 你的光芒甚至超越了创世之光。" },
      { name: "系统", text: "恭喜！你已通关二周目！" },
      { name: "系统", text: "获得终极奖励：神兽【起源之光】 + 【冠军奖杯】！" }
    ],
    reward: { gold: 500000 } 
  }
];
