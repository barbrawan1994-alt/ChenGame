// ==========================================
// 游戏剧情脚本 - 完整重制版
// 主线15章 + 咒术篇3章 + 莉可莉丝篇3章
// ==========================================

export const STORY_SCRIPT = [
  // ===== 第一章：微风草原 =====
  {
    chapter: 0,
    mapId: 1,
    title: "第一章：被侵蚀的草原",
    objective: "调查草原精灵狂暴化的原因，揭露日蚀队的阴谋。",
    intro: [
      { name: "大木博士", text: "欢迎来到精灵世界！我是大木博士，精灵生态研究者。" },
      { name: "大木博士", text: "最近微风草原出现了异常——温顺的精灵突然变得极度狂暴！" },
      { name: "大木博士", text: "更糟的是，一个叫做'日蚀队'的神秘组织正在趁机掠夺精灵！" },
      { name: "大木博士", text: "我需要你的帮助——去调查草原深处的黑雾源头。路上小心！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 44, name: '狂暴的 贪吃鼠', text: '吱吱吱！！！（双眼发红，疯狂地向你扑来！黑色的雾气缠绕着它）', emoji: '🐀',
        eliteParty: [{ id: 44, level: 10 }, { id: 38, level: 9 }]
      },
      { step: 1, x: 14, y: 10, type: 'dialog', name: '受伤的护林员', text: "咳咳...谢谢你救了我。日蚀队在北边树林里放了一台奇怪的机器，那些黑雾就是从那里冒出来的！", emoji: '🧑‍🌾' },
      { step: 2, x: 20, y: 5, type: 'battle', enemyId: 101, name: '日蚀队 步兵', text: '哼，别想靠近污染装置！日蚀计划不会因为你而停下！', emoji: '😈',
        eliteParty: [{ id: 101, level: 12 }, { id: 44, level: 10 }]
      },
      { step: 3, x: 20, y: 12, type: 'dialog', name: '被困的 叶苗苗', text: "（小家伙瑟瑟发抖地躲在倒塌的机器残骸后。你关掉了装置，黑雾逐渐消散。它感激地蹭了蹭你的腿。）", emoji: '🌱' },
      { step: 4, x: 15, y: 8, type: 'battle', enemyId: 118, name: '日蚀队 小队长', text: '可恶！装置被破坏了！首领会不高兴的...不过，先把你解决掉再说！', emoji: '😈',
        eliteParty: [{ id: 118, level: 14 }, { id: 101, level: 12 }, { id: 66, level: 11 }]
      },
      { step: 5, x: 22, y: 14, type: 'battle', enemyId: 54, name: '神秘旁观者·厌晚', text: '（远处的树影下，一个黑衣女人静静注视着你。你发现她时，她微微勾唇）...有点意思。让我看看你值不值得关注。', emoji: '🌙',
        eliteParty: [
          { id: 54, level: 13 },
          { id: 93, level: 11 }
        ]
      }
    ],
    midEvent: { enemyId: 118, name: '日蚀队 小队长' },
    outro: [
      { name: "馆主 莉佳", text: "你做得很好！那台机器是用来散播'虚空能量'的——它会让精灵变得狂暴且痛苦。" },
      { name: "馆主 莉佳", text: "日蚀队的规模比我们想象的大得多...但现在，先照顾好这只叶苗苗吧。它认定你了。" },
      { name: "系统", text: "获得奖励：精灵【叶苗苗】加入了队伍！" },
      { name: "系统", text: "获得线索：日蚀队在各地部署了更多'虚空污染装置'..." },
      { name: "系统", text: "那个神秘的黑衣女人是谁？她似乎对你很感兴趣..." }
    ],
    reward: { gold: 1000, items: [{id:'potion', count:5}], pokemon: {id: 1, level: 10} }
  },

  // ===== 第二章：回声山谷 =====
  {
    chapter: 1,
    mapId: 2,
    title: "第二章：山谷中的爆破",
    objective: "阻止日蚀队炸毁山谷隧道，解救被困的精灵和矿工。",
    intro: [
      { name: "登山大叔", text: "不好了！日蚀队封锁了山口，还在隧道里埋了大量炸药！" },
      { name: "登山大叔", text: "他们说要'净化'这片山谷——把一切都炸成废墟！矿工和精灵们都被困在里面！" },
      { name: "???", text: "（一个和你年纪相仿的训练家挡在路口前）哼，又一个自以为是的菜鸟？" },
      { name: "竞争对手·苍", text: "我叫苍。别碍我的事——这些日蚀队的人是我的猎物。" },
      { name: "竞争对手·苍", text: "不过看你这架势...算了，你走东路，我走西路。谁先到终点谁赢。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 15, type: 'battle', enemyId: 64, name: '日蚀队 守卫', text: "此路不通！这里马上就要变成废墟了，你也一起灰飞烟灭吧！", emoji: '🚧',
        eliteParty: [{ id: 64, level: 18 }, { id: 66, level: 16 }]
      },
      { step: 1, x: 15, y: 10, type: 'dialog', name: '被困的矿工', text: "谢谢你！炸弹在更深处...那边还有一只勇敢的小鸟一直在啄引信，它在帮我们！", emoji: '⛏️' },
      { step: 2, x: 22, y: 5, type: 'battle', enemyId: 66, name: '日蚀队 突击兵', text: "为了首领的'新世界'，牺牲是必要的！连同这座山一起消失吧！", emoji: '⚔️',
        eliteParty: [{ id: 66, level: 20 }, { id: 64, level: 18 }, { id: 101, level: 17 }]
      },
      { step: 3, x: 20, y: 10, type: 'battle', enemyId: 15, name: '日蚀队 爆破专家', text: "倒计时30秒！来不及了，你和这座山的命运已经注定了！一起炸飞吧！", emoji: '💣',
        eliteParty: [{ id: 15, level: 22 }, { id: 34, level: 20 }, { id: 66, level: 19 }]
      },
      { step: 4, x: 12, y: 3, type: 'battle', enemyId: 93, name: '暗影观察者·厌晚', text: '（爆炸的硝烟中，一个身影悠然走来）...还活着？不错。那个叫苍的家伙也在附近呢...真热闹。', emoji: '🌙',
        eliteParty: [
          { id: 93, level: 20 },
          { id: 59, level: 18 },
          { id: 54, level: 16 }
        ]
      }
    ],
    midEvent: { enemyId: 15, name: '日蚀队 爆破专家' },
    outro: [
      { name: "竞争对手·苍", text: "...你比我想象的强一点点。但下次我不会输给你。" },
      { name: "馆主 小刚", text: "干得漂亮！炸弹已经被拆除了。这只【小火雀】刚才一直在啄引信，真是勇敢的小家伙。" },
      { name: "馆主 小刚", text: "它似乎认可了你的勇气。带上它一起旅行吧！" },
      { name: "系统", text: "获得奖励：精灵【小火雀】加入了队伍！" },
      { name: "系统", text: "苍头也不回地离开了...你隐约感觉他与日蚀队有着某种联系。" }
    ],
    reward: { gold: 2000, balls: { great: 5 }, pokemon: {id: 16, level: 15} }
  },

  // ===== 第三章：遗迹工厂 =====
  {
    chapter: 2,
    mapId: 3,
    title: "第三章：机械之心",
    objective: "阻止日蚀队劫持人造精灵原型机，揭露'阿尔忒弥斯计划'。",
    intro: [
      { name: "大木博士", text: "紧急情况！遗迹工厂里有一只名为【多边兽】的人造精灵原型机。" },
      { name: "大木博士", text: "日蚀队想要改写它的核心程序，把它变成'活体兵器'！这是他们'阿尔忒弥斯计划'的一部分！" },
      { name: "大木博士", text: "这个计划...如果成功，他们就能批量制造被控制的精灵军队。一定要阻止！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 34, name: '暴走的 插头怪', text: "滋滋...滋滋...入侵者...检测到...抹杀...", emoji: '🔌',
        eliteParty: [{ id: 34, level: 26 }, { id: 40, level: 24 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '工厂AI残留', text: "警告：检测到非法篡改行为。核心数据正在被覆写...请尽快到达中央控制室。还剩余...3%...原始人格...", emoji: '💻' },
      { step: 2, x: 25, y: 5, type: 'battle', enemyId: 40, name: '安保机器人 Mk-II', text: "检测到非法入侵者。启动歼灭协议。日蚀队权限覆写...执行中...", emoji: '🤖',
        eliteParty: [{ id: 40, level: 28 }, { id: 34, level: 26 }, { id: 87, level: 25 }]
      },
      { step: 3, x: 15, y: 15, type: 'battle', enemyId: 81, name: '日蚀队 首席科学家', text: "你来晚了！阿尔忒弥斯计划即将完成！有了这个原型机，我们的军队将无可匹敌！", emoji: '👨‍🔬',
        eliteParty: [{ id: 81, level: 30 }, { id: 40, level: 28 }, { id: 34, level: 27 }, { id: 87, level: 26 }]
      },
      { step: 4, x: 8, y: 3, type: 'battle', enemyId: 93, name: '暗影观察者·厌晚', text: '（控制室的屏幕全部熄灭，黑暗中只有一双冰冷的眼睛）科学家的数据我已经拿到了。顺便...再试试你的深浅。', emoji: '🌙',
        eliteParty: [
          { id: 93, level: 27 },
          { id: 59, level: 25 },
          { id: 94, level: 23 },
          { id: 54, level: 21 }
        ]
      }
    ],
    midEvent: { enemyId: 81, name: '日蚀队 首席科学家' },
    outro: [
      { name: "馆主 马志士", text: "Wow! 你救下了多边兽的核心人格！科学家逃走了，但计划的关键数据已被你摧毁。" },
      { name: "馆主 马志士", text: "不过...他提到的'阿尔忒弥斯计划'只是整个计划的冰山一角。更大的阴谋正在酝酿。" },
      { name: "系统", text: "获得奖励：精灵【多边兽】加入了队伍！" },
      { name: "系统", text: "获得情报：'阿尔忒弥斯计划'——日蚀队正在各地收集特殊能量..." }
    ],
    reward: { gold: 3000, items: [{id:'vit_satk', count:3}], pokemon: {id: 131, level: 20} }
  },

  // ===== 第四章：深蓝海域 =====
  {
    chapter: 3,
    mapId: 4,
    title: "第四章：深海的呼救",
    objective: "清理日蚀队的海洋污染，解救濒死的拉普拉斯族群。",
    intro: [
      { name: "渔夫", text: "听到了吗？那是拉普拉斯的歌声...但不是平时那种悠扬的曲调——它们在痛苦地哀嚎！" },
      { name: "渔夫", text: "日蚀队在海里倾倒了大量'虚空结晶'！整片海域都被污染了！" },
      { name: "竞争对手·苍", text: "（苍出现在码头边，表情复杂）...又是你。听说你在工厂搞砸了科学家的计划。" },
      { name: "竞争对手·苍", text: "我只是...来确认一件事。别多管闲事。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 27, name: '被污染的 触手怪', text: "（浑身散发着黑色的恶臭，向你喷射腐蚀性毒液。它的眼睛里流着浑浊的泪水。）", emoji: '🦑',
        eliteParty: [{ id: 27, level: 33 }, { id: 24, level: 31 }]
      },
      { step: 1, x: 18, y: 8, type: 'dialog', name: '竞争对手·苍', text: "...我曾经也有一只精灵。三年前，日蚀队的第一次实验'成功'了——代价是整个沿海村庄和所有精灵的生命。那天我失去了一切。", emoji: '😔' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 118, name: '日蚀队 潜水员', text: "这片海域已经被征用了！虚空结晶的能量采集不能中断！", emoji: '🤿',
        eliteParty: [{ id: 118, level: 35 }, { id: 27, level: 33 }, { id: 24, level: 32 }]
      },
      { step: 3, x: 10, y: 10, type: 'battle', enemyId: 130, name: '被虚空侵蚀的 暴鲤龙', text: "吼！！！（痛苦地翻滚着，身上的虚空结晶不断生长。它已经失去了理智。）", emoji: '🐉',
        eliteParty: [{ id: 130, level: 38 }, { id: 118, level: 36 }, { id: 27, level: 35 }]
      },
      { step: 4, x: 22, y: 3, type: 'battle', enemyId: 94, name: '暗影执行者·厌晚', text: '（海面上的薄雾中，一只小船缓缓靠岸。厌晚踩着礁石走来）虚空结晶...这东西比我想象的有趣。你呢？比上次有趣了一点。', emoji: '🌙',
        eliteParty: [
          { id: 94, level: 35 },
          { id: 59, level: 33 },
          { id: 93, level: 31 },
          { id: 54, level: 29 },
          { id: 130, level: 27 }
        ]
      }
    ],
    midEvent: { enemyId: 130, name: '被虚空侵蚀的 暴鲤龙' },
    outro: [
      { name: "馆主 小霞", text: "谢谢你净化了大海！暴鲤龙恢复了正常——它之前只是太痛苦了。" },
      { name: "馆主 小霞", text: "这只小拉普拉斯是族群里最小的一只。它亲眼看着你拯救了大海，想要跟随你。" },
      { name: "竞争对手·苍", text: "...（苍远远地看着你，转身离去。你注意到他胸前别着一个日蚀队的旧徽章。）" },
      { name: "系统", text: "获得奖励：精灵【拉普拉斯】加入了队伍！" },
      { name: "系统", text: "苍的过去...和日蚀队究竟有什么关联？" }
    ],
    reward: { gold: 4000, items: [{id:'berry', count:10}], pokemon: {id: 123, level: 25} }
  },

  // ===== 第五章：熔岩火山 =====
  {
    chapter: 4,
    mapId: 5,
    title: "第五章：进化的代价",
    objective: "阻止日蚀队干部的强制进化实验，拯救被折磨的伊布。",
    intro: [
      { name: "大木博士", text: "我截获了日蚀队的通讯——干部·炎正在火山深处进行'强制进化'实验！" },
      { name: "大木博士", text: "他们试图用极端环境强迫精灵进化，完全不顾精灵的意愿和承受能力！" },
      { name: "日蚀队 干部·炎", text: "（远处传来声音）力量！唯有力量才是这个世界的真理！伊布这种弱小的存在，只有被改造才有价值！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 12, type: 'battle', enemyId: 104, name: '狂暴 火花猴', text: "叽叽！！（被高温和虚空能量双重折磨，完全失去了理智）", emoji: '🐒',
        eliteParty: [{ id: 104, level: 42 }, { id: 105, level: 40 }]
      },
      { step: 1, x: 16, y: 6, type: 'dialog', name: '被囚禁的伊布', text: "（透过铁笼的缝隙，你看到一只浑身伤痕的伊布。它的眼神中既有恐惧，又有不屈。）", emoji: '🦊' },
      { step: 2, x: 22, y: 5, type: 'battle', enemyId: 105, name: '日蚀队 精英卫队', text: "干部正在进行伟大的实验！进化是精灵的宿命——不，是义务！", emoji: '💂',
        eliteParty: [{ id: 105, level: 44 }, { id: 104, level: 42 }, { id: 126, level: 41 }]
      },
      { step: 3, x: 12, y: 8, type: 'battle', enemyId: 126, name: '日蚀队 干部·炎', text: "够了！既然你要保护弱者，那就让我展示真正的力量！火焰不是温暖——是毁灭！", emoji: '🔥',
        eliteParty: [{ id: 126, level: 46 }, { id: 105, level: 44 }, { id: 104, level: 43 }, { id: 42, level: 42 }]
      },
      { step: 4, x: 20, y: 14, type: 'battle', enemyId: 94, name: '暗影执行者·厌晚', text: '（岩浆的红光映出她冷峻的侧脸）干部·炎那种货色...还不配当我的对手。你呢？让我看看你有没有资格。', emoji: '🌙',
        eliteParty: [
          { id: 94, level: 40 },
          { id: 59, level: 38 },
          { id: 93, level: 36 },
          { id: 130, level: 34 },
          { id: 54, level: 32 },
          { id: 126, level: 30 }
        ]
      }
    ],
    midEvent: { enemyId: 126, name: '日蚀队 干部·炎' },
    outro: [
      { name: "日蚀队 干部·炎", text: "不可能...我的精灵明明更强...为什么你这种保护弱者的人能赢？" },
      { name: "馆主 夏伯", text: "因为真正的力量不来自强迫——而来自信任。这只伊布，它拥有无限的进化可能性。" },
      { name: "馆主 夏伯", text: "当它准备好的时候，它会自己选择进化的方向。这才是进化的本质。" },
      { name: "系统", text: "获得奖励：精灵【伊布】加入了队伍！（可多分支进化）" },
      { name: "系统", text: "干部·炎逃走了。他提到了'日蚀计划的最终阶段'...一切指向某个终极目标。" }
    ],
    reward: { gold: 5000, balls: { master: 1 }, pokemon: {id: 125, level: 30} }
  },

  // ===== 第六章：赛博都市 =====
  {
    chapter: 5,
    mapId: 6,
    title: "第六章：数字囚笼",
    objective: "夺回被日蚀队控制的城市防御系统，揭露幕后黑手。",
    intro: [
      { name: "神秘黑客·琳", text: "嘿，你就是那个和日蚀队作对的训练家？我是琳——自由黑客，也是这座城市的地下守护者。" },
      { name: "神秘黑客·琳", text: "整座城市的AI防御系统被日蚀队黑入了！所有机械精灵都变成了他们的武器！" },
      { name: "神秘黑客·琳", text: "我能远程协助你，但你需要亲自到达中央控制塔。路上...会很艰难。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 87, name: '巡逻 铁哑铃', text: "目标锁定...入侵者编号#0001...启动排除程序...", emoji: '🔩',
        eliteParty: [{ id: 87, level: 48 }, { id: 40, level: 46 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '神秘黑客·琳', text: "（通讯器响起）好消息！我找到了入侵者的身份——是日蚀队的技术总监'量子'。他比那个首席科学家段位高得多。", emoji: '💻' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 88, name: '重装 金属怪', text: "装甲强度100%...超载模式启动...目标：粉碎。", emoji: '🦾',
        eliteParty: [{ id: 88, level: 50 }, { id: 87, level: 48 }, { id: 40, level: 47 }]
      },
      { step: 3, x: 18, y: 12, type: 'battle', enemyId: 132, name: 'AI 核心守护者', text: "最高级威胁检测...启动歼灭协议...错误...原始指令冲突...保护...还是...毁灭...", emoji: '🤖',
        eliteParty: [{ id: 132, level: 52 }, { id: 88, level: 50 }, { id: 87, level: 49 }, { id: 40, level: 48 }]
      },
      { step: 4, x: 10, y: 3, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（全息屏幕上突然出现她的身影，随后本人从通风管道翻身落下）琳是吧？你的黑客技术不错——但别想查到我的情报。至于你...', emoji: '🌙',
        eliteParty: [
          { id: 94, level: 47 },
          { id: 609, level: 45 },
          { id: 59, level: 44 },
          { id: 93, level: 43 },
          { id: 130, level: 42 },
          { id: 54, level: 41 }
        ]
      }
    ],
    midEvent: { enemyId: 132, name: 'AI 核心守护者' },
    outro: [
      { name: "神秘黑客·琳", text: "成功了！系统恢复正常！那个AI...它在被控制之前一直在保护这座城市。" },
      { name: "馆主 娜姿", text: "这只铁哑铃在恢复自主意识后，第一个行动就是走向你。它想成为你的力量。" },
      { name: "神秘黑客·琳", text: "对了，我在日蚀队的数据库里发现了一份文件：'日蚀计划'的目标是收集所有虚空能量，唤醒某种沉睡的存在..." },
      { name: "系统", text: "获得奖励：精灵【铁哑铃】加入了队伍！" },
      { name: "系统", text: "日蚀计划...唤醒'虚空之神'？传说中毁灭与重生的化身？" }
    ],
    reward: { gold: 6000, items: [{id:'vit_satk', count:5}], pokemon: {id: 87, level: 35} }
  },

  // ===== 第七章：幽灵古堡 =====
  {
    chapter: 6,
    mapId: 7,
    title: "第七章：暗影中的真相",
    objective: "在古堡中发现日蚀队的秘密研究所，揭开苍的过去。",
    intro: [
      { name: "幽灵少女", text: "不要...不要过来...那个紫色的影子会吃掉我们的灵魂..." },
      { name: "大木博士", text: "这座古堡地下有日蚀队的秘密研究所——'幽冥实验室'。据说他们在那里进行最残忍的实验。" },
      { name: "竞争对手·苍", text: "（苍已经站在古堡门口）...这个地方，我来过。三年前，他们在这里...（攥紧拳头）你不用管我。这是我的事。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 54, name: '恶作剧的 飘飘魂', text: "嘻嘻嘻...好久没有活人来了...陪我玩...永远留在这里吧！", emoji: '👻',
        eliteParty: [{ id: 54, level: 52 }, { id: 59, level: 50 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '苍的回忆（幻影）', text: "（古堡的墙壁上浮现出影像：三年前的苍，抱着一只奄奄一息的精灵，绝望地恳求穿白袍的人救它...）", emoji: '😭' },
      { step: 2, x: 25, y: 5, type: 'battle', enemyId: 59, name: '怨念 诅咒娃娃', text: "好恨啊...为什么只有我被抛弃...为什么没有人来救我...", emoji: '🎎',
        eliteParty: [{ id: 59, level: 54 }, { id: 54, level: 52 }, { id: 94, level: 51 }]
      },
      { step: 3, x: 20, y: 12, type: 'battle', enemyId: 94, name: '神秘训练家·厌晚', text: "（一个穿着黑色长裙的女人从阴影中走出，冰冷地注视着你）...你就是最近让日蚀队头疼的小鬼？看在你走到这里的份上，我就用三成的力量陪你玩玩。", emoji: '🌙',
        eliteParty: [
          { id: 609, level: 52 },
          { id: 94, level: 50 },
          { id: 59, level: 49 },
          { id: 93, level: 48 },
          { id: 130, level: 47 },
          { id: 126, level: 46 }
        ]
      },
      { step: 4, x: 15, y: 10, type: 'battle', enemyId: 94, name: '噬魂 耿鬼', text: "多么美味的悲伤和愤怒！让我尝尝你的灵魂——哦，还有那个男孩的...", emoji: '👿',
        eliteParty: [{ id: 94, level: 56 }, { id: 59, level: 54 }, { id: 54, level: 53 }, { id: 93, level: 52 }]
      }
    ],
    midEvent: { enemyId: 94, name: '噬魂 耿鬼' },
    outro: [
      { name: "竞争对手·苍", text: "...三年前，日蚀队承诺能治好我的精灵。我相信了他们。结果...它被改造成了兵器，然后...被销毁了。" },
      { name: "竞争对手·苍", text: "那天之后我发誓要亲手毁掉日蚀队。所以我加入了他们...卧底...三年了。" },
      { name: "玩家", text: "你一直是卧底...？刚才那个叫厌晚的女人是谁？" },
      { name: "竞争对手·苍", text: "...厌晚。日蚀队的'暗影执行者'。她不属于任何派系，只听首领的命令。实力深不可测——刚才她说只用了三成力量，我信。" },
      { name: "竞争对手·苍", text: "别感动。我不是为了正义——是为了复仇。但你...你让我想起了它。那只总是相信人类的傻瓜精灵。" },
      { name: "馆主 松叶", text: "这只烛光灵一直保护着古堡里弱小的幽灵。它愿意陪伴你走接下来的路。" },
      { name: "系统", text: "获得奖励：精灵【烛光灵】加入了队伍！" },
      { name: "系统", text: "苍的真实身份：日蚀队内部的卧底。神秘训练家·厌晚——她的真正实力有多恐怖？" }
    ],
    reward: { gold: 7000, items: [{id:'vit_sdef', count:5}], pokemon: {id: 18, level: 40} }
  },

  // ===== 第八章：天空王座 =====
  {
    chapter: 7,
    mapId: 8,
    title: "第八章：云端的龙脉",
    objective: "在天空之巅寻找龙族的秘密，阻止日蚀队夺取龙之能量。",
    intro: [
      { name: "飞行员", text: "高空的乱流太强了！传说中，这里是龙族的圣地——藏着连接天地的'龙脉'。" },
      { name: "神秘黑客·琳", text: "（通讯）注意！日蚀队的目标就是龙脉中的能量！他们需要它来完成日蚀计划的最后一块拼图！" },
      { name: "竞争对手·苍", text: "日蚀队的副首领亲自来了。这意味着事情很大。我会从内部配合你——但你需要正面突破。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 42, name: '暴怒的 疾风鹰', text: "（锐利的眼神锁定了你。它在守护龙脉入口，绝不允许任何人靠近！）", emoji: '🦅',
        eliteParty: [{ id: 42, level: 58 }, { id: 15, level: 56 }]
      },
      { step: 1, x: 20, y: 5, type: 'battle', enemyId: 142, name: '虚空猎手', text: "（被虚空能量侵蚀的飞龙，发出刺耳的尖啸，周围空间扭曲！）", emoji: '🐉',
        eliteParty: [{ id: 142, level: 60 }, { id: 42, level: 58 }, { id: 130, level: 57 }]
      },
      { step: 2, x: 15, y: 12, type: 'dialog', name: '龙之长老', text: "年轻人...你来得正好。龙脉正在被吸取能量。如果继续下去，天空会崩塌，大地会裂开。请接受龙之考验——只有通过考验的人才能阻止灾难。", emoji: '🐲' },
      { step: 3, x: 14, y: 14, type: 'battle', enemyId: 142, name: '龙脉守护者', text: "（龙之长老化身战斗形态！这是考验——它需要确认你的决心和实力！）", emoji: '🌪️',
        eliteParty: [{ id: 142, level: 62 }, { id: 79, level: 60 }, { id: 42, level: 59 }, { id: 130, level: 58 }]
      },
      { step: 4, x: 8, y: 2, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（云端之上，厌晚负手而立，衣袂猎猎作响）龙脉之力...首领想要，我也有点好奇。不过比起龙脉，我更想知道——你现在能接住我几招？', emoji: '🌙',
        eliteParty: [
          { id: 609, level: 60 },
          { id: 94, level: 58 },
          { id: 603, level: 57 },
          { id: 59, level: 56 },
          { id: 130, level: 55 },
          { id: 93, level: 54 }
        ]
      }
    ],
    midEvent: { enemyId: 142, name: '龙脉守护者' },
    outro: [
      { name: "龙之长老", text: "你通过了考验。拿去——这是龙脉的钥匙。只要你持有它，日蚀队就无法夺取龙之能量。" },
      { name: "龙之长老", text: "这只迷你龙是龙族最年轻的后裔。它的命运与你紧紧相连。" },
      { name: "系统", text: "获得奖励：精灵【迷你龙】加入了队伍！" },
      { name: "系统", text: "获得关键道具：【龙脉之钥】——封印了龙族的远古之力。" }
    ],
    reward: { gold: 8000, items: [{id:'vit_spd', count:5}], pokemon: {id: 79, level: 45} }
  },

  // ===== 第九章：极寒冻土 =====
  {
    chapter: 8,
    mapId: 9,
    title: "第九章：冰封的记忆",
    objective: "日蚀队唤醒了远古冰兽！在极寒中生存，封印失控的力量。",
    intro: [
      { name: "大木博士", text: "这里的温度骤降到了-50℃！日蚀队在挖掘远古冰封的精灵——如果那东西被唤醒，整个大陆都会被冰封！" },
      { name: "大木博士", text: "最令人担忧的是...情报显示，日蚀队的副首领'霜'在亲自指挥这次行动。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 76, name: '领地意识的 冰海豹', text: "（它不是敌人——它在阻止你靠近危险区域。但唯一的路就在它身后。）", emoji: '🦭',
        eliteParty: [{ id: 76, level: 62 }, { id: 199, level: 60 }]
      },
      { step: 1, x: 15, y: 10, type: 'dialog', name: '日蚀队 逃兵', text: "别去了！副首领·霜疯了！她唤醒的那个东西...不是精灵，是灾难！我们的人已经被冻成冰雕了！", emoji: '😱' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 199, name: '狂暴 象牙猪', text: "吼！！！（被远古寒气激活的远古巨兽，獠牙闪着寒冰之光）", emoji: '🐗',
        eliteParty: [{ id: 199, level: 65 }, { id: 76, level: 63 }, { id: 131, level: 62 }]
      },
      { step: 3, x: 16, y: 8, type: 'battle', enemyId: 131, name: '日蚀队 副首领·霜', text: "冰之力量才是永恒的...在绝对零度面前，一切都将停止。包括时间本身！", emoji: '❄️',
        eliteParty: [{ id: 131, level: 68 }, { id: 199, level: 66 }, { id: 76, level: 65 }, { id: 253, level: 64 }, { id: 142, level: 63 }]
      },
      { step: 4, x: 10, y: 4, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: "（寒风中，那个熟悉的身影再次出现）又见面了。上次只用了三成——这次，我用六成。你能活下来吗？", emoji: '🌙',
        eliteParty: [
          { id: 608, level: 65, devilFruit: 'df_yami' },
          { id: 609, level: 63 },
          { id: 610, level: 62 },
          { id: 603, level: 61 },
          { id: 94, level: 60 },
          { id: 604, level: 59 }
        ]
      }
    ],
    midEvent: { enemyId: 131, name: '日蚀队 副首领·霜' },
    outro: [
      { name: "暗影执行者·厌晚", text: "...有意思。你比上次强了不少。不过别高兴太早——我还有一半的力量没用呢。" },
      { name: "暗影执行者·厌晚", text: "（转身消失在暴风雪中）下次再见...就是终局了。" },
      { name: "日蚀队 副首领·霜", text: "不可能...我的冰...在你面前融化了？" },
      { name: "馆主 哈奇库", text: "霜曾经是我的弟子...是对力量的渴望让她走上了歧途。" },
      { name: "馆主 哈奇库", text: "这只小海豹在暴风雪中一直跟着你。它被你的温暖吸引了。" },
      { name: "系统", text: "获得奖励：精灵【雪球海豹】加入了队伍！" },
      { name: "系统", text: "暗影执行者·厌晚再次出现...她的实力远超想象。最终对决，即将到来。" }
    ],
    reward: { gold: 10000, items: [{id:'vit_pdef', count:5}], pokemon: {id: 76, level: 50} }
  },

  // ===== 第十章：流沙荒漠 =====
  {
    chapter: 9,
    mapId: 10,
    title: "第十章：沙暴中的决裂",
    objective: "在流沙荒漠中与日蚀队副首领正面交锋，苍的抉择时刻到来。",
    intro: [
      { name: "竞争对手·苍", text: "（通讯器碎裂般的声音）...我的身份暴露了。日蚀队的另一个副首领'砂'在追杀我。" },
      { name: "竞争对手·苍", text: "我被困在荒漠中心的遗迹里。但这不是求救——我截获了日蚀计划的最终情报。你必须来拿。" },
      { name: "大木博士", text: "苍身陷险境！但他掌握的情报至关重要——关乎整个世界的命运！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 68, name: '潜伏的 穿山甲', text: "（突然从沙地里钻出！沙暴让它变得异常暴躁）", emoji: '🦔',
        eliteParty: [{ id: 68, level: 66 }, { id: 185, level: 64 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '竞争对手·苍', text: "你来了...（浑身是伤）日蚀计划的真相——首领要用收集的所有能量，打开次元裂缝，召唤虚空之神。虚空之神...它不是创造者，而是毁灭者。", emoji: '🩸' },
      { step: 2, x: 25, y: 5, type: 'battle', enemyId: 185, name: '剧毒 龙王蝎', text: "（虚空能量让它的毒性增强了百倍，一击就能让人石化）", emoji: '🦂',
        eliteParty: [{ id: 185, level: 69 }, { id: 68, level: 67 }, { id: 248, level: 66 }]
      },
      { step: 3, x: 20, y: 15, type: 'battle', enemyId: 248, name: '日蚀队 副首领·砂', text: "苍！你这个叛徒！首领给了你一切——力量、地位、复仇的机会！你却为了一个陌生人背叛我们？", emoji: '🦂',
        eliteParty: [{ id: 248, level: 72 }, { id: 185, level: 70 }, { id: 68, level: 69 }, { id: 253, level: 68 }, { id: 142, level: 67 }]
      },
      { step: 4, x: 5, y: 3, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（沙暴中她的身影若隐若现）副首领·砂也不过如此。苍...你选错了阵营。不过没关系，反正最后——所有人都要面对我。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 70, devilFruit: 'df_yami' },
          { id: 609, level: 68, devilFruit: 'df_supa' },
          { id: 94, level: 66 },
          { id: 604, level: 65 },
          { id: 610, level: 64 },
          { id: 603, level: 63 }
        ]
      }
    ],
    midEvent: { enemyId: 248, name: '日蚀队 副首领·砂' },
    outro: [
      { name: "竞争对手·苍", text: "不。我从没有背叛。因为我从未真正属于你们。" },
      { name: "日蚀队 副首领·砂", text: "可恶...连圆陆鲨都背叛了我...你们等着，首领会让你们付出代价！" },
      { name: "竞争对手·苍", text: "（把一个数据芯片交给你）日蚀计划的全部情报都在这里。终点站...是银河空间站上方的虚空裂缝。" },
      { name: "系统", text: "获得奖励：精灵【幼鲨】加入了队伍！" },
      { name: "系统", text: "苍正式成为你的同伴！日蚀计划的真相终于浮出水面..." }
    ],
    reward: { gold: 15000, balls: { master: 2 }, pokemon: {id: 82, level: 55} }
  },

  // ===== 第十一章：糖果王国 =====
  {
    chapter: 10,
    mapId: 11,
    title: "第十一章：梦境与现实",
    objective: "识破日蚀队用幻术制造的'理想世界'，打破甜蜜的谎言。",
    intro: [
      { name: "大木博士", text: "糖果王国...不对，这里不应该是这样！这是日蚀队用精神力制造的'理想幻境'！" },
      { name: "大木博士", text: "他们在测试一种'精神控制器'——如果成功，就能让所有人沉浸在美好的幻象中，永远无法醒来！" },
      { name: "大木博士", text: "记住——不管你看到什么，都不要被迷惑！这里的一切都是假的！" }
    ],
    tasks: [
      { step: 0, x: 15, y: 5, type: 'battle', enemyId: 48, name: '诡异的 粉粉球', text: "来玩吧...这里没有痛苦，没有战斗...永远快乐...永远留下来...", emoji: '🧶',
        eliteParty: [{ id: 48, level: 72 }, { id: 178, level: 70 }]
      },
      { step: 1, x: 8, y: 12, type: 'dialog', name: '幻境中的你', text: "（你看到了自己的幻象——在一个没有日蚀队的世界里，和所有精灵在草原上奔跑。那么平静，那么美好...但你知道这不是真的。）", emoji: '💭' },
      { step: 2, x: 5, y: 15, type: 'battle', enemyId: 178, name: '梦境守门人', text: "醒来干什么？现实只有痛苦和战斗...在这里，你可以拥有一切...", emoji: '🧙',
        eliteParty: [{ id: 178, level: 75 }, { id: 48, level: 73 }, { id: 146, level: 72 }]
      },
      { step: 3, x: 10, y: 12, type: 'battle', enemyId: 146, name: '噩梦核心 达克莱伊', text: "你居然能抵抗理想世界的诱惑？那我就让你体验真正的噩梦！比现实更可怕的深渊！", emoji: '🌑',
        eliteParty: [{ id: 146, level: 78 }, { id: 178, level: 76 }, { id: 150, level: 75 }, { id: 253, level: 74 }]
      },
      { step: 4, x: 20, y: 3, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（幻境崩碎的裂缝中，厌晚的身影从梦境的残片里走出）梦？现实？对我来说没有区别——因为无论在哪个世界，我都是最强的。来吧，在你清醒的时候再打一次。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 76, devilFruit: 'df_yami' },
          { id: 609, level: 74, devilFruit: 'df_supa' },
          { id: 610, level: 73, devilFruit: 'df_hie' },
          { id: 603, level: 72 },
          { id: 94, level: 71 },
          { id: 604, level: 70 }
        ]
      }
    ],
    midEvent: { enemyId: 146, name: '噩梦核心 达克莱伊' },
    outro: [
      { name: "馆主 玛绣", text: "幻境崩塌了。噩梦散去后，才能看见真正的星光。" },
      { name: "馆主 玛绣", text: "这只星之子，它象征着穿越黑夜后的希望之光。" },
      { name: "竞争对手·苍", text: "（通讯）我查到了——日蚀队的首领叫'深渊'。他已经出发前往银河空间站了。" },
      { name: "系统", text: "获得奖励：精灵【星之子】加入了队伍！" },
      { name: "系统", text: "最终决战的时刻即将来临。目标：银河空间站。" }
    ],
    reward: { gold: 20000, items: [{id:'vit_crit', count:3}], pokemon: {id: 60, level: 60} }
  },

  // ===== 第十二章：银河空间站（终章前篇） =====
  {
    chapter: 11,
    mapId: 12,
    title: "终章前篇：逆转命运",
    objective: "突入银河空间站，在虚空裂缝打开之前阻止日蚀队首领·深渊！",
    intro: [
      { name: "大木博士", text: "这是最后的机会了！日蚀队首领·深渊已经启动了虚空共振装置！" },
      { name: "神秘黑客·琳", text: "我已经黑入了空间站的防御系统。你只有30分钟的窗口期！" },
      { name: "竞争对手·苍", text: "我从内部打开了通往核心区的通道。这一次...让我们并肩作战。" },
      { name: "竞争对手·苍", text: "三年了...一切在今天结束。不管付出什么代价。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 10, type: 'battle', enemyId: 253, name: '虚空守门人', text: "首领大人的伟业不可阻挡。在虚空之神面前，你们不过是蝼蚁！", emoji: '🛡️',
        eliteParty: [{ id: 253, level: 78 }, { id: 248, level: 76 }, { id: 142, level: 75 }]
      },
      { step: 1, x: 15, y: 5, type: 'dialog', name: '竞争对手·苍', text: "（苍被日蚀队精英围攻，身负重伤）...走！别管我！阻止深渊比什么都重要！我...已经完成了我的复仇。活着见到这一天...就够了。", emoji: '💔' },
      { step: 2, x: 25, y: 10, type: 'battle', enemyId: 253, name: '虚空处刑者', text: "毁灭即是新生。旧世界已经腐朽——只有虚空能带来纯净的开始！", emoji: '⚔️',
        eliteParty: [{ id: 253, level: 80 }, { id: 248, level: 78 }, { id: 185, level: 77 }, { id: 142, level: 76 }]
      },
      { step: 3, x: 20, y: 8, type: 'battle', enemyId: 607, name: '暗影执行者·厌晚 [全力]', text: "（通往首领的路被厌晚挡住。她缓缓拔出腰间的精灵球，眼中第一次露出认真的神色）...我等这一天很久了。不是为了首领的命令——是为了我自己。在古堡、在冻土...你让我感受到了久违的心跳。这一次，全力以赴。", emoji: '🌙',
        eliteParty: [
          { id: 608, level: 80, devilFruit: 'df_yami' },
          { id: 609, level: 78, devilFruit: 'df_supa' },
          { id: 607, level: 82 },
          { id: 610, level: 79, devilFruit: 'df_hie' },
          { id: 603, level: 77 },
          { id: 604, level: 80 }
        ]
      },
      { step: 4, x: 15, y: 3, type: 'battle', enemyId: 255, name: '日蚀队 首领·深渊', text: "（一个穿着漆黑长袍的男人缓缓转身）...你终于来了。连厌晚都输给了你？有趣...三年前我毁掉了一个村庄，只为测试虚空能量。你的朋友苍——他以为自己在复仇，其实从一开始就是我计划的一部分。现在，见证新世界的诞生吧！", emoji: '⚫',
        eliteParty: [{ id: 255, level: 85 }, { id: 253, level: 83 }, { id: 248, level: 82 }, { id: 146, level: 81 }, { id: 150, level: 80 }, { id: 142, level: 79 }]
      }
    ],
    midEvent: { enemyId: 255, name: '日蚀队 首领·深渊' },
    outro: [
      { name: "暗影执行者·厌晚", text: "（倒在墙边，却微微笑了）...输了。真正地、彻底地、毫无保留地——输了。" },
      { name: "暗影执行者·厌晚", text: "你知道吗...我跟随深渊，只是因为这个世界上再也找不到能让我认真战斗的对手。但你不一样。" },
      { name: "暗影执行者·厌晚", text: "去吧。阻止深渊。然后...等一切结束后...我还想再和你打一次。" },
      { name: "日蚀队 首领·深渊", text: "不...不可能...我的精灵...我的计划...明明已经收集了足够的能量..." },
      { name: "系统", text: "虚空共振装置被破坏了！但...裂缝已经出现了一道微小的缝隙。" },
      { name: "大木博士", text: "虚空裂缝虽然没有完全打开，但虚空的能量已经在泄漏！我们需要想办法彻底封印它！" },
      { name: "竞争对手·苍", text: "（被神秘黑客·琳救下，虚弱地笑着）你做到了...深渊倒下了。但虚空裂缝..." },
      { name: "系统", text: "恭喜通关主线剧情！但旅途还没有结束..." },
      { name: "系统", text: "解锁隐藏章节：【冠军之路】——在世界之巅封印虚空裂缝！" }
    ],
    reward: { gold: 99999, balls: { master: 10 } }
  },

  // ===== 第十三章：冠军之路（隐藏篇） =====
  {
    chapter: 12,
    mapId: 13,
    title: "隐藏篇：巅峰之上",
    objective: "击败五大天王和冠军，证明你有封印虚空裂缝的力量！",
    intro: [
      { name: "神秘人", text: "要封印虚空裂缝，需要能媲美创世之力的强大力量。" },
      { name: "神秘人", text: "冠军之路——只有打败所有天王的训练家，才有资格获得这份力量。" },
      { name: "神秘人", text: "准备好了吗？这是真正的终极挑战。" },
      { name: "竞争对手·苍", text: "（站在你身边）我也要去。这条路...我们一起走到尽头。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 271, name: '天王 元素领主', text: "我是第一天王！万物皆有元素，而我掌控元素的秩序！来展示你驾驭精灵的方式吧！", emoji: '🔥',
        eliteParty: [{ id: 271, level: 88 }, { id: 126, level: 86 }, { id: 131, level: 85 }, { id: 253, level: 84 }, { id: 142, level: 83 }, { id: 104, level: 82 }]
      },
      { step: 1, x: 5, y: 5, type: 'battle', enemyId: 269, name: '天王 秩序圣骑', text: "我是第二天王！绝对的防御就是绝对的正义！你的攻击能突破我的壁垒吗？", emoji: '🛡️',
        eliteParty: [{ id: 269, level: 88 }, { id: 199, level: 86 }, { id: 248, level: 85 }, { id: 88, level: 84 }, { id: 76, level: 83 }, { id: 130, level: 82 }]
      },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 270, name: '天王 武斗神', text: "我是第三天王！无需华丽的技巧——只要最纯粹的力量！用你的拳头来证明！", emoji: '👊',
        eliteParty: [{ id: 270, level: 88 }, { id: 68, level: 86 }, { id: 185, level: 85 }, { id: 105, level: 84 }, { id: 42, level: 83 }, { id: 64, level: 82 }]
      },
      { step: 3, x: 25, y: 5, type: 'battle', enemyId: 280, name: '天王 虫群之心', text: "我是第四天王！千万不要小看微小的力量——亿万虫群的意志是不可阻挡的洪流！", emoji: '🦗',
        eliteParty: [{ id: 280, level: 88 }, { id: 252, level: 86 }, { id: 110, level: 85 }, { id: 293, level: 84 }, { id: 112, level: 83 }, { id: 327, level: 82 }]
      },
      { step: 4, x: 15, y: 2, type: 'battle', enemyId: 283, name: '冠军 创世元灵', text: "你走到了终点。你的旅途、你的决心、你与精灵之间的羁绊——让我全部见证。向创世之力发起挑战吧！", emoji: '👑',
        eliteParty: [{ id: 283, level: 92 }, { id: 254, level: 90 }, { id: 255, level: 89 }, { id: 146, level: 88 }, { id: 150, level: 87 }, { id: 142, level: 86 }]
      },
      { step: 5, x: 15, y: 8, type: 'battle', enemyId: 607, name: '厌晚 [真·全力]', text: '（一切结束后，厌晚独自站在冠军之路的尽头，背对着你）...你真的做到了。打败了深渊，封印了虚空...但我答应过你——等一切结束后，再打一次。这一次...是我作为战士，对你最高的敬意。全力以赴，一个不留！', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 92, devilFruit: 'df_yami' },
          { id: 609, level: 90, devilFruit: 'df_supa' },
          { id: 607, level: 95, devilFruit: 'df_magu' },
          { id: 610, level: 91, devilFruit: 'df_hie' },
          { id: 603, level: 88 },
          { id: 604, level: 90, devilFruit: 'df_gura' }
        ]
      }
    ],
    midEvent: { enemyId: 283, name: '冠军 创世元灵' },
    outro: [
      { name: "冠军", text: "了不起...你的光芒超越了创世之光。虚空裂缝的封印之力——交给你了。" },
      { name: "系统", text: "虚空裂缝被彻底封印！世界恢复了和平！" },
      { name: "竞争对手·苍", text: "...结束了。一切真的结束了。谢谢你——让我知道，这个世界还值得守护。" },
      { name: "大木博士", text: "你是真正的冠军！但精灵世界的冒险永远不会结束——还有更多的精灵等你去遇见！" },
      { name: "系统", text: "恭喜通关全部剧情！获得终极奖励：神兽【起源之光】+【冠军奖杯】！" },
      { name: "系统", text: "（自由探索已解锁：联赛、全副本、活动、图鉴收集...旅途继续！）" }
    ],
    reward: { gold: 500000 }
  },

  // ==========================================
  // 咒术回战篇（独立支线）
  // ==========================================
  {
    chapter: 8,
    mapId: 100,
    title: "咒术篇·序章：觉醒之日",
    objective: "前往都立咒术高专，在五条悟的指导下觉醒咒力。",
    intro: [
      { name: "五条悟", text: "哟～你就是新来的？我是五条悟，都立咒术高专的老师。也是——最强的术师。" },
      { name: "五条悟", text: "我感觉到你的精灵体内蕴含着不一般的咒力...来，让我教你如何引导它。" },
      { name: "五条悟", text: "不过首先，你得通过入学考验。准备好了吗？别紧张，我会在旁边看着～" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 92, name: '低级咒灵', text: "嘎嘎嘎...（一只三级咒灵从阴影中浮现，浑身散发诅咒般的气息）", emoji: '👻',
        eliteParty: [{ id: 92, level: 52 }, { id: 59, level: 50 }]
      },
      { step: 1, x: 20, y: 8, type: 'dialog', name: '五条悟', text: "不错嘛！你的精灵已经能本能地运用咒力了。记住——咒力不是单纯的力量，而是意志的具现。接下来学习'咒力强化'的要诀。", emoji: '👨‍🏫' },
      { step: 2, x: 15, y: 15, type: 'battle', enemyId: 93, name: '二级咒灵', text: "嘶嘶嘶...（一只更强大的咒灵出现！空气中弥漫着令人窒息的咒力压迫感）", emoji: '👹',
        eliteParty: [{ id: 93, level: 56 }, { id: 92, level: 54 }, { id: 59, level: 53 }]
      },
      { step: 3, x: 22, y: 10, type: 'battle', enemyId: 609, name: '不速之客·厌晚', text: '（结界的边缘，一个不属于咒术界的身影悠然步入）咒力？有意思...和虚空能量有些相似呢。五条悟是吧？你的学生，我借来试试。', emoji: '🌙',
        eliteParty: [
          { id: 609, level: 58 },
          { id: 94, level: 56 },
          { id: 59, level: 55 },
          { id: 93, level: 54 },
          { id: 130, level: 53 },
          { id: 603, level: 52 }
        ]
      }
    ],
    midEvent: { enemyId: 93, name: '二级咒灵' },
    outro: [
      { name: "五条悟", text: "恭喜你通过了入学考试！从今天起，你就是咒术高专的学生了。" },
      { name: "五条悟", text: "你的精灵觉醒了咒术能力——每种属性都有对应的术式。好好修炼，说不定有一天你能展开领域呢～" },
      { name: "系统", text: "全队精灵觉醒咒力系统！可以在战斗中使用咒术技能和领域展开！" }
    ],
    reward: { gold: 10000, items: [{id:'potion', count:10}] }
  },
  {
    chapter: 9,
    mapId: 100,
    title: "咒术篇·壹：姊妹校交流会",
    objective: "参加东京校与京都校的交流会对战，在术师之间证明你的实力。",
    intro: [
      { name: "东堂葵", text: "你！你喜欢什么类型的女性？这很重要！决定了我们能不能做好兄弟！" },
      { name: "东堂葵", text: "哈哈哈！不管你的回答是什么——先让我的拳头确认你的实力！" },
      { name: "伏黑惠", text: "无视那个肌肉笨蛋。交流会的规则很简单——所有人都是对手。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 5, type: 'battle', enemyId: 57, name: '京都校 三轮霞', text: "作为术师，保护人类是我们的使命。先让我测试你的决心和实力！", emoji: '⚔️',
        eliteParty: [{ id: 57, level: 58 }, { id: 42, level: 56 }, { id: 76, level: 55 }]
      },
      { step: 1, x: 22, y: 12, type: 'battle', enemyId: 68, name: '东堂葵', text: "好兄弟！来吧！让我们用拳头交流灵魂！Boogie Woogie！", emoji: '💪',
        eliteParty: [{ id: 68, level: 62 }, { id: 105, level: 60 }, { id: 270, level: 59 }, { id: 64, level: 58 }]
      },
      { step: 2, x: 15, y: 3, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（交流会的观众席上，厌晚鼓了鼓掌）打得不错。不过这种程度的对手...让我来提升一下训练的强度吧。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 64, devilFruit: 'df_yami' },
          { id: 609, level: 62 },
          { id: 94, level: 61 },
          { id: 604, level: 60 },
          { id: 59, level: 59 },
          { id: 130, level: 58 }
        ]
      }
    ],
    midEvent: { enemyId: 68, name: '东堂葵' },
    outro: [
      { name: "五条悟", text: "交流会结束了～大家都进步了不少。不过...我感觉到暗中有些不好的气息在蠢蠢欲动..." },
      { name: "五条悟", text: "下次...可能就不是演习了。做好准备。" },
      { name: "系统", text: "获得咒术秘典：解锁更多通用术式！" }
    ],
    reward: { gold: 20000 }
  },
  {
    chapter: 10,
    mapId: 100,
    title: "咒术篇·贰：渋谷事変",
    objective: "渋谷被帳覆盖！五条悟被封印！击败特级咒灵和诅咒之王，拯救一切！",
    intro: [
      { name: "伊地知", text: "紧急情报！！渋谷出现大规模帳！市民全部被困！" },
      { name: "伊地知", text: "五条老师被诱入陷阱...他...被獄門疆封印了！！" },
      { name: "伊地知", text: "特级咒灵真人、漏瑚、花御同时出现！这是百鬼夜行！！所有术师紧急集合！" },
      { name: "伏黑惠", text: "五条老师不在了...现在只能靠我们自己了。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 42, name: '特级咒灵·花御', text: "（植物般的巨大咒灵静静地看着你）...你们人类总是在破坏...去爱自然吧...永远地...", emoji: '🌿',
        eliteParty: [{ id: 42, level: 68 }, { id: 1, level: 66 }, { id: 252, level: 65 }]
      },
      { step: 1, x: 15, y: 10, type: 'battle', enemyId: 146, name: '特级咒灵·漏瑚', text: "渺小的人类！在真正的自然之力面前颤抖吧！大地的咆哮才是这个世界的主旋律！", emoji: '🌋',
        eliteParty: [{ id: 146, level: 72 }, { id: 126, level: 70 }, { id: 104, level: 69 }]
      },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 150, name: '特级咒灵·真人', text: "灵魂的形态...太有趣了！就让我来改造改造吧～無為転変！你的灵魂会变成什么形状呢？", emoji: '🎭',
        eliteParty: [{ id: 150, level: 74 }, { id: 178, level: 72 }, { id: 93, level: 71 }, { id: 59, level: 70 }]
      },
      { step: 3, x: 15, y: 3, type: 'battle', enemyId: 150, name: '诅咒之王·宿傩', text: "...啊，有点意思。你居然能走到这里。让我稍微认真一点——品味一下，绝望的滋味。", emoji: '👹',
        eliteParty: [{ id: 150, level: 78 }, { id: 146, level: 76 }, { id: 142, level: 75 }, { id: 253, level: 74 }, { id: 248, level: 73 }]
      },
      { step: 4, x: 8, y: 8, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（渋谷的废墟中，厌晚踩着碎石缓缓走来）宿傩...咒灵...这个世界比我想的更有意思。趁着混乱——让我好好打一场。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 72, devilFruit: 'df_yami' },
          { id: 609, level: 70, devilFruit: 'df_supa' },
          { id: 610, level: 69 },
          { id: 94, level: 68 },
          { id: 604, level: 67 },
          { id: 603, level: 66 }
        ]
      }
    ],
    midEvent: { enemyId: 150, name: '诅咒之王·宿傩' },
    outro: [
      { name: "五条悟", text: "（被解封后）哟～等了好久啊。不过看到你们的成长...嗯，我这个老师还是很优秀的嘛！" },
      { name: "五条悟", text: "这次渋谷事变让我们付出了惨痛的代价...但你们的实力已经跨越了一个层次。" },
      { name: "系统", text: "渋谷事变结束！全体精灵咒力大幅提升！可以学习高级领域展开！" }
    ],
    reward: { gold: 100000 }
  },

  // ===== 莉可莉丝篇·序章：来自DA的委托 =====
  {
    chapter: 18,
    mapId: 6,
    title: "莉可莉丝篇·序章：来自DA的委托",
    objective: "调查赛博都市中异常暴走的精灵事件，协助DA特工千束和泷奈。",
    intro: [
      { name: "???", text: "嘿嘿～你好呀！我是千束！锦木千束！看起来你很厉害的样子嘛！" },
      { name: "锦木千束", text: "其实呢，我和搭档泷奈正在调查这个城市里突然暴走的精灵事件。" },
      { name: "井之上泷奈", text: "...DA总部收到情报，有人在用特殊装置操控精灵。我们需要协助。" },
      { name: "锦木千束", text: "说白了就是忙不过来啦～所以你来帮帮忙嘛！作为报酬，我请你喝咖啡！" },
      { name: "井之上泷奈", text: "千束...这不是请客喝咖啡的时候。有目击报告说暴走精灵出现在城东。" },
      { name: "锦木千束", text: "好啦好啦～出发！对了，待会带你去我们的咖啡厅坐坐，超棒的哦！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 5, type: 'battle', enemyId: 120, name: '暴走的 雷光兽', text: '呜呜呜呜！！（浑身放出失控的电弧，眼中闪烁着诡异的红光）', emoji: '⚡',
        eliteParty: [{ id: 120, level: 48 }, { id: 87, level: 46 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '锦木千束', text: "做得好！看到了吗，那只精灵身上有个奇怪的装置。这和我们之前调查的一样——有人在用控制芯片操纵精灵！", emoji: '🎀' },
      { step: 2, x: 20, y: 12, type: 'battle', enemyId: 130, name: '暴走的 钢翼鹰', text: '（金属翅膀疯狂拍打，芯片闪烁红光，理智已被完全覆盖）', emoji: '🦅',
        eliteParty: [{ id: 130, level: 50 }, { id: 120, level: 48 }, { id: 42, level: 47 }]
      },
      { step: 3, x: 25, y: 6, type: 'battle', enemyId: 140, name: '暴走的 影幽龙', text: '（龙形的暗影在建筑间穿梭，城市陷入一片混乱）', emoji: '🐉',
        eliteParty: [{ id: 140, level: 52 }, { id: 130, level: 50 }, { id: 142, level: 49 }]
      },
      { step: 4, x: 22, y: 15, type: 'dialog', name: '井之上泷奈', text: "信号源追踪到了城西废弃工厂。千束，准备行动。...你也一起来。", emoji: '🔫' },
      { step: 5, x: 12, y: 3, type: 'battle', enemyId: 145, name: '神秘操控者', text: '你们是DA的人？哼，来晚了。我的控制芯片已经分布在整个城市——你们阻止不了的！', emoji: '🦹',
        eliteParty: [{ id: 145, level: 54 }, { id: 140, level: 52 }, { id: 132, level: 51 }, { id: 88, level: 50 }]
      },
      { step: 6, x: 18, y: 10, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（操控者倒下后，暗处传来拍手声）DA和日蚀队...都是有趣的组织呢。千束、泷奈...你们的搭档战术确实漂亮。不过——比起你们，我更想和这个人打。', emoji: '🌙',
        eliteParty: [
          { id: 609, level: 55 },
          { id: 94, level: 53 },
          { id: 59, level: 52 },
          { id: 93, level: 51 },
          { id: 130, level: 50 },
          { id: 54, level: 49 }
        ]
      }
    ],
    midEvent: { enemyId: 145, name: '神秘操控者' },
    outro: [
      { name: "锦木千束", text: "搞定啦～不过这个人只是小喽啰，幕后黑手还没有抓到。" },
      { name: "井之上泷奈", text: "操控装置的技术很先进...可能和'真岛'有关。我会向上级报告。" },
      { name: "锦木千束", text: "辛苦啦！说好的，请你去我们咖啡厅坐坐！LycoReco咖啡厅现在开放给你了哦！" },
      { name: "系统", text: "莉可莉丝序章通关！解锁【LycoReco咖啡厅】购买权！" }
    ],
    reward: { gold: 15000 }
  },

  // ===== 莉可莉丝篇·第壹章：搭档的意义 =====
  {
    chapter: 19,
    mapId: 11,
    title: "莉可莉丝篇·第壹章：搭档的意义",
    objective: "向千束和泷奈学习'搭档'的力量，掌握协作战斗技巧。",
    intro: [
      { name: "锦木千束", text: "你知道吗？我和泷奈可是最强搭档！不是因为我们各自很强——" },
      { name: "井之上泷奈", text: "——而是因为我们彼此信任，能在战斗中完美配合。" },
      { name: "锦木千束", text: "嘿嘿，泷奈居然会说这种话了！看，搭档就是这么回事！" },
      { name: "锦木千束", text: "今天我来教你'搭档协作'——让你的精灵们学会真正的默契！" },
      { name: "井之上泷奈", text: "搭档系统需要时间培养羁绊。先从实战练习开始。" },
      { name: "锦木千束", text: "先和我们打一场热身赛，然后你自己试试搭档战斗！准备好了吗？" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 100, name: '千束的搭档·风铃鸟', text: '（千束温柔地摸了摸风铃鸟的头）来吧，给新朋友展示一下我们的实力！', emoji: '🐦',
        eliteParty: [{ id: 100, level: 55 }, { id: 42, level: 53 }, { id: 15, level: 52 }]
      },
      { step: 1, x: 18, y: 6, type: 'dialog', name: '锦木千束', text: "看到了吗？搭档之间的默契不是一朝一夕的事。要在战斗中一起成长，羁绊才会越来越深！", emoji: '🎀' },
      { step: 2, x: 22, y: 12, type: 'battle', enemyId: 120, name: '泷奈的搭档·钢拳猿', text: '（泷奈严肃地点了点头）不要留手。我要看看你的精灵之间有没有搭档的潜质。', emoji: '🦍',
        eliteParty: [{ id: 120, level: 57 }, { id: 88, level: 55 }, { id: 87, level: 54 }]
      },
      { step: 3, x: 15, y: 5, type: 'dialog', name: '井之上泷奈', text: "...还不错。你的精灵们之间有潜力。但真正的搭档，需要在生死关头依然信任对方。", emoji: '🔫' },
      { step: 4, x: 8, y: 15, type: 'battle', enemyId: 130, name: 'Alan机关测试者', text: 'DA的小训练家们又来了？Alan机关的实力可不是你们能想象的！搭档？那种东西没有用！', emoji: '🤖',
        eliteParty: [{ id: 130, level: 60 }, { id: 132, level: 58 }, { id: 88, level: 57 }, { id: 140, level: 56 }]
      },
      { step: 5, x: 20, y: 5, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（千束正在庆祝，厌晚从屋顶跳下）搭档的意义？呵...让我这个独行者来检验一下你们的"搭档之力"到底有多少斤两。', emoji: '🌙',
        eliteParty: [
          { id: 609, level: 62, devilFruit: 'df_yami' },
          { id: 94, level: 60 },
          { id: 603, level: 59 },
          { id: 604, level: 58 },
          { id: 59, level: 57 },
          { id: 130, level: 56 }
        ]
      }
    ],
    midEvent: { enemyId: 130, name: 'Alan机关测试者' },
    outro: [
      { name: "锦木千束", text: "太棒了！你打败了那个自大狂！看到了吧，搭档的力量可不是说说而已！" },
      { name: "井之上泷奈", text: "搭档羁绊系统已经可以使用了。选择两只信任彼此的精灵，让它们结为搭档吧。" },
      { name: "锦木千束", text: "记住哦——不是随便凑一对就行的。要让它们一起战斗、一起成长！羁绊值到了才能发动协作技！" },
      { name: "系统", text: "莉可莉丝第壹章通关！解锁【搭档羁绊系统】！可在精灵详情页设置搭档！" }
    ],
    reward: { gold: 20000 }
  },

  // ===== 莉可莉丝篇·第贰章：真岛的挑战 =====
  {
    chapter: 20,
    mapId: 7,
    title: "莉可莉丝篇·第贰章：真岛的挑战",
    objective: "真岛出现，试图暴露精灵世界的秘密。击败他的手下和真岛本人！",
    intro: [
      { name: "井之上泷奈", text: "紧急通讯——真岛出现在幽灵古堡。他宣称要向全世界公开精灵控制技术。" },
      { name: "锦木千束", text: "真岛...又是他。每次都要搞出这么大的动静。" },
      { name: "井之上泷奈", text: "这次他有备而来，带了大量手下和被强化控制的精灵。我们必须阻止他。" },
      { name: "锦木千束", text: "哼，这次可不会让他跑掉！你和你的搭档精灵准备好了吗？" },
      { name: "锦木千束", text: "记住我教你的——在关键时刻相信你的搭档。这就是我们的力量！" },
      { name: "真岛", text: "（广播响起）呵呵...DA的小玩偶们又来了？这次的舞台我可是精心准备的。来吧，让我看看你们的'搭档之力'有多脆弱！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 135, name: '真岛的先锋·影杀手', text: '真岛大人说了，今天谁也别想活着离开这里！品尝恐惧吧！', emoji: '🗡️',
        eliteParty: [{ id: 135, level: 62 }, { id: 59, level: 60 }, { id: 94, level: 59 }]
      },
      { step: 1, x: 12, y: 8, type: 'battle', enemyId: 140, name: '真岛的精锐·暗夜猎手', text: '你以为击败我就完了？后面还有更强的在等着你！真岛大人的计划不可阻挡！', emoji: '🌑',
        eliteParty: [{ id: 140, level: 64 }, { id: 135, level: 62 }, { id: 142, level: 61 }]
      },
      { step: 2, x: 20, y: 5, type: 'dialog', name: '锦木千束', text: "小心！真岛的核心手下就在前方。他们使用的精灵都被芯片强化过，非常棘手。相信你的搭档，我们一起上！", emoji: '🎀' },
      { step: 3, x: 22, y: 12, type: 'battle', enemyId: 145, name: '真岛的副官·幻影', text: '真岛大人的理想——让所有人看到精灵的真实力量！你们DA的秘密都将被揭露！', emoji: '👤',
        eliteParty: [{ id: 145, level: 66 }, { id: 140, level: 64 }, { id: 150, level: 63 }, { id: 132, level: 62 }]
      },
      { step: 4, x: 15, y: 15, type: 'battle', enemyId: 150, name: '真岛', text: '终于来了啊。你知道吗？我也有搭档——不过我的搭档可不需要什么温情脉脉的羁绊。绝对的力量！这才是搭档的真谛！', emoji: '🎭',
        eliteParty: [{ id: 150, level: 70 }, { id: 145, level: 68 }, { id: 142, level: 67 }, { id: 253, level: 66 }, { id: 248, level: 65 }]
      },
      { step: 5, x: 25, y: 8, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（真岛逃走后，古堡深处传来熟悉的脚步声）真岛那种人也配谈力量？哼。你倒是让我越来越期待了——每次见面，你都变得更强。所以...这次我也稍微加点力度。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 70, devilFruit: 'df_yami' },
          { id: 609, level: 68, devilFruit: 'df_supa' },
          { id: 610, level: 67 },
          { id: 94, level: 66 },
          { id: 604, level: 65 },
          { id: 603, level: 64 }
        ]
      }
    ],
    midEvent: { enemyId: 150, name: '真岛' },
    outro: [
      { name: "真岛", text: "...有趣。用'羁绊'击败了我的'力量'吗？哈哈哈...也罢，今天就到这里。" },
      { name: "真岛", text: "但记住——这个世界的秘密迟早会被揭露的。到那时，你们的搭档还能保持信任吗？" },
      { name: "锦木千束", text: "他又跑了...不过这次我们成功阻止了他的计划！" },
      { name: "井之上泷奈", text: "干得好。真岛的威胁暂时解除了。不过...他说的话让我有些在意。" },
      { name: "锦木千束", text: "别想太多啦泷奈！今天是胜利日！回咖啡厅庆祝！我调了最特别的配方等你们！" },
      { name: "系统", text: "莉可莉丝全部通关！获得特殊饮品配方【大师配方】！搭档系统已完全解锁！" }
    ],
    reward: { gold: 50000 }
  }
];
