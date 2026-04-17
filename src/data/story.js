// ==========================================
// 游戏剧情脚本 - 完整重制版
// 主线15章 + 咒术篇3章 + 莉可莉丝篇3章 + 门派风云篇9章 + 异界征途篇18章
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
        eliteParty: [{ id: 44, level: 10 }, { id: 38, level: 9 }, { id: 15, level: 7 }]
      },
      { step: 1, x: 14, y: 10, type: 'dialog', name: '受伤的护林员', text: "咳咳...谢谢你救了我。日蚀队在北边树林里放了一台奇怪的机器，那些黑雾就是从那里冒出来的！", emoji: '🧑‍🌾' },
      { step: 2, x: 20, y: 5, type: 'battle', enemyId: 101, name: '日蚀队 步兵', text: '哼，别想靠近污染装置！日蚀计划不会因为你而停下！', emoji: '😈',
        eliteParty: [{ id: 101, level: 12 }, { id: 44, level: 10 }, { id: 48, level: 8 }]
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
        eliteParty: [{ id: 64, level: 18 }, { id: 66, level: 16 }, { id: 57, level: 15 }]
      },
      { step: 1, x: 15, y: 10, type: 'dialog', name: '被困的矿工', text: "谢谢你！炸弹在更深处...那边还有一只勇敢的小鸟一直在啄引信，它在帮我们！", emoji: '⛏️' },
      { step: 2, x: 18, y: 7, type: 'dialog', name: '仙剑大侠·李逍遥', text: "（一道剑光划过，碎石被一剑劈开！一个白衣青年收剑入鞘）...没事吧？这种地方可不适合普通人来。我叫李逍遥，来自...很远的地方。你有一股不错的灵气——希望下次见面你会更强。", emoji: '⚔️' },
      { step: 3, x: 22, y: 5, type: 'battle', enemyId: 66, name: '日蚀队 突击兵', text: "为了首领的'新世界'，牺牲是必要的！连同这座山一起消失吧！", emoji: '⚔️',
        eliteParty: [{ id: 66, level: 20 }, { id: 64, level: 18 }, { id: 101, level: 17 }]
      },
      { step: 4, x: 20, y: 10, type: 'battle', enemyId: 15, name: '日蚀队 爆破专家', text: "倒计时30秒！来不及了，你和这座山的命运已经注定了！一起炸飞吧！", emoji: '💣',
        eliteParty: [{ id: 15, level: 22 }, { id: 34, level: 20 }, { id: 66, level: 19 }]
      },
      { step: 5, x: 12, y: 3, type: 'battle', enemyId: 93, name: '暗影观察者·厌晚', text: '（爆炸的硝烟中，一个身影悠然走来）...还活着？不错。那个叫苍的家伙也在附近呢...真热闹。', emoji: '🌙',
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
      { name: "系统", text: "白衣剑客·李逍遥...他来自何方？又在追寻什么？" },
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
        eliteParty: [{ id: 34, level: 26 }, { id: 40, level: 24 }, { id: 81, level: 23 }]
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
        eliteParty: [{ id: 27, level: 33 }, { id: 24, level: 31 }, { id: 118, level: 30 }]
      },
      { step: 1, x: 18, y: 8, type: 'dialog', name: '竞争对手·苍', text: "...我曾经也有一只精灵。三年前，日蚀队的第一次实验'成功'了——代价是整个沿海村庄和所有精灵的生命。那天我失去了一切。", emoji: '😔' },
      { step: 2, x: 12, y: 12, type: 'battle', enemyId: 1, name: '仙剑大侠·李逍遥', text: '（碧波之上，李逍遥踏浪而来）我们又见面了。听说你在拯救海域...不过光有勇气可不够。来，让我看看你的实力是否配得上你的决心！', emoji: '⚔️',
        eliteParty: [{ id: 1, level: 35 }, { id: 329, level: 33 }, { id: 252, level: 32 }]
      },
      { step: 3, x: 25, y: 15, type: 'battle', enemyId: 118, name: '日蚀队 潜水员', text: "这片海域已经被征用了！虚空结晶的能量采集不能中断！", emoji: '🤿',
        eliteParty: [{ id: 118, level: 35 }, { id: 27, level: 33 }, { id: 24, level: 32 }]
      },
      { step: 4, x: 10, y: 10, type: 'battle', enemyId: 130, name: '被虚空侵蚀的 暴鲤龙', text: "吼！！！（痛苦地翻滚着，身上的虚空结晶不断生长。它已经失去了理智。）", emoji: '🐉',
        eliteParty: [{ id: 130, level: 38 }, { id: 118, level: 36 }, { id: 27, level: 35 }]
      },
      { step: 5, x: 22, y: 3, type: 'battle', enemyId: 94, name: '暗影执行者·厌晚', text: '（海面上的薄雾中，一只小船缓缓靠岸。厌晚踩着礁石走来）虚空结晶...这东西比我想象的有趣。你呢？比上次有趣了一点。', emoji: '🌙',
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
      { name: "仙剑大侠·李逍遥", text: "不错...比我预想的要强。我们后会有期——别让我失望。" },
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
        eliteParty: [{ id: 104, level: 42 }, { id: 105, level: 40 }, { id: 126, level: 38 }, { id: 38, level: 37 }]
      },
      { step: 1, x: 16, y: 6, type: 'dialog', name: '被囚禁的伊布', text: "（透过铁笼的缝隙，你看到一只浑身伤痕的伊布。它的眼神中既有恐惧，又有不屈。）", emoji: '🦊' },
      { step: 2, x: 22, y: 5, type: 'battle', enemyId: 105, name: '日蚀队 精英卫队', text: "干部正在进行伟大的实验！进化是精灵的宿命——不，是义务！", emoji: '💂',
        eliteParty: [{ id: 105, level: 44 }, { id: 104, level: 42 }, { id: 126, level: 41 }, { id: 42, level: 39 }]
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
        eliteParty: [{ id: 87, level: 48 }, { id: 40, level: 46 }, { id: 81, level: 44 }, { id: 34, level: 43 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '神秘黑客·琳', text: "（通讯器响起）好消息！我找到了入侵者的身份——是日蚀队的技术总监'量子'。他比那个首席科学家段位高得多。", emoji: '💻' },
      { step: 2, x: 20, y: 10, type: 'dialog', name: '仙剑大侠·李逍遥', text: "（李逍遥从高楼跃下，单手扶剑）赛博都市...我也在追踪一股诡异的灵力波动，和这里的AI暴走有关。看来我们的敌人是同一个。这次——我们联手。你去正面突破，我从侧面包抄。", emoji: '⚔️' },
      { step: 3, x: 25, y: 15, type: 'battle', enemyId: 88, name: '重装 金属怪', text: "装甲强度100%...超载模式启动...目标：粉碎。", emoji: '🦾',
        eliteParty: [{ id: 88, level: 50 }, { id: 87, level: 48 }, { id: 40, level: 47 }, { id: 604, level: 44 }]
      },
      { step: 4, x: 18, y: 12, type: 'battle', enemyId: 132, name: 'AI 核心守护者', text: "最高级威胁检测...启动歼灭协议...错误...原始指令冲突...保护...还是...毁灭...", emoji: '🤖',
        eliteParty: [{ id: 132, level: 52 }, { id: 88, level: 50 }, { id: 87, level: 49 }, { id: 40, level: 48 }]
      },
      { step: 5, x: 10, y: 3, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（全息屏幕上突然出现她的身影，随后本人从通风管道翻身落下）琳是吧？你的黑客技术不错——但别想查到我的情报。至于你...', emoji: '🌙',
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
        eliteParty: [{ id: 54, level: 52 }, { id: 59, level: 50 }, { id: 93, level: 48 }, { id: 92, level: 47 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '苍的回忆（幻影）', text: "（古堡的墙壁上浮现出影像：三年前的苍，抱着一只奄奄一息的精灵，绝望地恳求穿白袍的人救它...）", emoji: '😭' },
      { step: 2, x: 25, y: 5, type: 'battle', enemyId: 59, name: '怨念 诅咒娃娃', text: "好恨啊...为什么只有我被抛弃...为什么没有人来救我...", emoji: '🎎',
        eliteParty: [{ id: 59, level: 54 }, { id: 54, level: 52 }, { id: 94, level: 51 }, { id: 110, level: 49 }]
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
        eliteParty: [{ id: 94, level: 56 }, { id: 59, level: 54 }, { id: 54, level: 53 }, { id: 93, level: 52 }, { id: 130, level: 50 }]
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
        eliteParty: [{ id: 42, level: 58 }, { id: 15, level: 56 }, { id: 142, level: 54 }, { id: 130, level: 53 }]
      },
      { step: 1, x: 20, y: 5, type: 'battle', enemyId: 142, name: '虚空猎手', text: "（被虚空能量侵蚀的飞龙，发出刺耳的尖啸，周围空间扭曲！）", emoji: '🐉',
        eliteParty: [{ id: 142, level: 60 }, { id: 42, level: 58 }, { id: 130, level: 57 }, { id: 79, level: 55 }]
      },
      { step: 2, x: 15, y: 12, type: 'dialog', name: '龙之长老', text: "年轻人...你来得正好。龙脉正在被吸取能量。如果继续下去，天空会崩塌，大地会裂开。请接受龙之考验——只有通过考验的人才能阻止灾难。", emoji: '🐲' },
      { step: 3, x: 20, y: 8, type: 'battle', enemyId: 329, name: '仙剑大侠·李逍遥', text: '（龙脉光柱之下，李逍遥已经等在那里）龙脉的力量...我也在寻找。不是为了利用它，而是为了回家的路。但龙之长老说只有最强者才配得到钥匙——所以在你面对龙之前，先过我这关！', emoji: '⚔️',
        eliteParty: [{ id: 1, level: 60 }, { id: 329, level: 58 }, { id: 369, level: 57 }, { id: 252, level: 56 }, { id: 60, level: 55 }]
      },
      { step: 4, x: 14, y: 14, type: 'battle', enemyId: 142, name: '龙脉守护者', text: "（龙之长老化身战斗形态！这是考验——它需要确认你的决心和实力！）", emoji: '🌪️',
        eliteParty: [{ id: 142, level: 62 }, { id: 79, level: 60 }, { id: 42, level: 59 }, { id: 130, level: 58 }]
      },
      { step: 5, x: 8, y: 2, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚', text: '（云端之上，厌晚负手而立，衣袂猎猎作响）龙脉之力...首领想要，我也有点好奇。不过比起龙脉，我更想知道——你现在能接住我几招？', emoji: '🌙',
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
      { name: "仙剑大侠·李逍遥", text: "你通过了我的考验。这把【御灵剑碎片】送给你——它能感应龙脉的力量。我们是同路人。" },
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
        eliteParty: [{ id: 76, level: 84 }, { id: 199, level: 82 }, { id: 131, level: 80 }, { id: 142, level: 79 }, { id: 87, level: 81 }]
      },
      { step: 1, x: 15, y: 10, type: 'dialog', name: '日蚀队 逃兵', text: "别去了！副首领·霜疯了！她唤醒的那个东西...不是精灵，是灾难！我们的人已经被冻成冰雕了！", emoji: '😱' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 199, name: '狂暴 象牙猪', text: "吼！！！（被远古寒气激活的远古巨兽，獠牙闪着寒冰之光）", emoji: '🐗',
        eliteParty: [{ id: 199, level: 87 }, { id: 76, level: 85 }, { id: 131, level: 84 }, { id: 253, level: 82 }, { id: 130, level: 81 }]
      },
      { step: 3, x: 16, y: 8, type: 'battle', enemyId: 131, name: '日蚀队 副首领·霜', text: "冰之力量才是永恒的...在绝对零度面前，一切都将停止。包括时间本身！", emoji: '❄️',
        eliteParty: [{ id: 131, level: 90 }, { id: 199, level: 88 }, { id: 76, level: 87 }, { id: 253, level: 86 }, { id: 142, level: 85 }]
      },
      { step: 4, x: 10, y: 4, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: "（寒风中，那个熟悉的身影再次出现）又见面了。上次只用了三成——这次，我用六成。你能活下来吗？", emoji: '🌙',
        eliteParty: [
          { id: 608, level: 88, devilFruit: 'df_yami' },
          { id: 609, level: 86 },
          { id: 610, level: 85 },
          { id: 603, level: 84 },
          { id: 94, level: 83 },
          { id: 604, level: 82 }
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
    reward: { gold: 15000, items: [{id:'vit_pdef', count:5}], pokemon: {id: 76, level: 80} }
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
        eliteParty: [{ id: 68, level: 87 }, { id: 185, level: 85 }, { id: 248, level: 84 }, { id: 142, level: 83 }, { id: 112, level: 84 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '竞争对手·苍', text: "你来了...（浑身是伤）日蚀计划的真相——首领要用收集的所有能量，打开次元裂缝，召唤虚空之神。虚空之神...它不是创造者，而是毁灭者。", emoji: '🩸' },
      { step: 2, x: 10, y: 12, type: 'dialog', name: '仙剑大侠·李逍遥', text: "（沙暴中，一道清光划开迷雾）...我追踪虚空能量来到这里。你的朋友就在前方——我能感应到他的灵力。走，我为你开路。（李逍遥剑指前方，御剑劈开沙暴）再说一件事...我在仙灵界见过类似虚空的力量，它叫'魔界之气'。最终决战时...或许我能帮上忙。", emoji: '⚔️' },
      { step: 3, x: 25, y: 5, type: 'battle', enemyId: 185, name: '剧毒 龙王蝎', text: "（虚空能量让它的毒性增强了百倍，一击就能让人石化）", emoji: '🦂',
        eliteParty: [{ id: 185, level: 90 }, { id: 68, level: 88 }, { id: 248, level: 87 }, { id: 142, level: 86 }, { id: 253, level: 85 }]
      },
      { step: 4, x: 20, y: 15, type: 'battle', enemyId: 248, name: '日蚀队 副首领·砂', text: "苍！你这个叛徒！首领给了你一切——力量、地位、复仇的机会！你却为了一个陌生人背叛我们？", emoji: '🦂',
        eliteParty: [{ id: 248, level: 93 }, { id: 185, level: 91 }, { id: 68, level: 90 }, { id: 253, level: 89 }, { id: 142, level: 88 }]
      },
      { step: 5, x: 5, y: 3, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（沙暴中她的身影若隐若现）副首领·砂也不过如此。苍...你选错了阵营。不过没关系，反正最后——所有人都要面对我。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 92, devilFruit: 'df_yami' },
          { id: 609, level: 90, devilFruit: 'df_supa' },
          { id: 94, level: 88 },
          { id: 604, level: 87 },
          { id: 610, level: 86 },
          { id: 603, level: 85 }
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
    reward: { gold: 20000, balls: { master: 2 }, pokemon: {id: 82, level: 85} }
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
        eliteParty: [{ id: 48, level: 90 }, { id: 178, level: 88 }, { id: 150, level: 87 }, { id: 146, level: 86 }, { id: 93, level: 87 }]
      },
      { step: 1, x: 8, y: 12, type: 'dialog', name: '幻境中的你', text: "（你看到了自己的幻象——在一个没有日蚀队的世界里，和所有精灵在草原上奔跑。那么平静，那么美好...但你知道这不是真的。）", emoji: '💭' },
      { step: 2, x: 5, y: 15, type: 'battle', enemyId: 178, name: '梦境守门人', text: "醒来干什么？现实只有痛苦和战斗...在这里，你可以拥有一切...", emoji: '🧙',
        eliteParty: [{ id: 178, level: 93 }, { id: 48, level: 91 }, { id: 146, level: 90 }, { id: 248, level: 89 }, { id: 142, level: 88 }]
      },
      { step: 3, x: 10, y: 12, type: 'battle', enemyId: 146, name: '噩梦核心 达克莱伊', text: "你居然能抵抗理想世界的诱惑？那我就让你体验真正的噩梦！比现实更可怕的深渊！", emoji: '🌑',
        eliteParty: [{ id: 146, level: 95 }, { id: 178, level: 93 }, { id: 150, level: 92 }, { id: 253, level: 91 }, { id: 248, level: 90 }]
      },
      { step: 4, x: 20, y: 3, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（幻境崩碎的裂缝中，厌晚的身影从梦境的残片里走出）梦？现实？对我来说没有区别——因为无论在哪个世界，我都是最强的。来吧，在你清醒的时候再打一次。', emoji: '🌙',
        eliteParty: [
          { id: 608, level: 95, devilFruit: 'df_yami' },
          { id: 609, level: 93, devilFruit: 'df_supa' },
          { id: 610, level: 92, devilFruit: 'df_hie' },
          { id: 603, level: 91 },
          { id: 94, level: 90 },
          { id: 604, level: 89 }
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
    reward: { gold: 25000, items: [{id:'vit_crit', count:3}], pokemon: {id: 60, level: 88} }
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
        eliteParty: [{ id: 253, level: 78 }, { id: 248, level: 76 }, { id: 142, level: 75 }, { id: 150, level: 73 }, { id: 146, level: 72 }]
      },
      { step: 1, x: 15, y: 5, type: 'dialog', name: '竞争对手·苍', text: "（苍被日蚀队精英围攻，身负重伤）...走！别管我！阻止深渊比什么都重要！我...已经完成了我的复仇。活着见到这一天...就够了。", emoji: '💔' },
      { step: 2, x: 25, y: 10, type: 'battle', enemyId: 253, name: '虚空处刑者', text: "毁灭即是新生。旧世界已经腐朽——只有虚空能带来纯净的开始！", emoji: '⚔️',
        eliteParty: [{ id: 253, level: 80 }, { id: 248, level: 78 }, { id: 185, level: 77 }, { id: 142, level: 76 }, { id: 68, level: 74 }]
      },
      { step: 3, x: 12, y: 5, type: 'battle', enemyId: 329, name: '仙剑大侠·李逍遥 [御剑全开]', text: '（空间站的长廊尽头，李逍遥拔出了一把散发着仙光的长剑。他的表情前所未有的严肃）...前面是深渊和厌晚。如果你连我都赢不了，就别去送死了。这一次——我用全力。当作我给你的...毕业考试！', emoji: '⚔️',
        eliteParty: [{ id: 1, level: 82 }, { id: 329, level: 80 }, { id: 369, level: 79 }, { id: 252, level: 78 }, { id: 60, level: 77 }, { id: 61, level: 76 }]
      },
      { step: 4, x: 20, y: 8, type: 'battle', enemyId: 607, name: '暗影执行者·厌晚 [全力]', text: "（通往首领的路被厌晚挡住。她缓缓拔出腰间的精灵球，眼中第一次露出认真的神色）...我等这一天很久了。不是为了首领的命令——是为了我自己。在古堡、在冻土...你让我感受到了久违的心跳。这一次，全力以赴。", emoji: '🌙',
        eliteParty: [
          { id: 608, level: 80, devilFruit: 'df_yami' },
          { id: 609, level: 78, devilFruit: 'df_supa' },
          { id: 607, level: 82 },
          { id: 610, level: 79, devilFruit: 'df_hie' },
          { id: 603, level: 77 },
          { id: 604, level: 80 }
        ]
      },
      { step: 5, x: 15, y: 3, type: 'battle', enemyId: 255, name: '日蚀队 首领·深渊', text: "（一个穿着漆黑长袍的男人缓缓转身）...你终于来了。连厌晚都输给了你？有趣...三年前我毁掉了一个村庄，只为测试虚空能量。你的朋友苍——他以为自己在复仇，其实从一开始就是我计划的一部分。现在，见证新世界的诞生吧！", emoji: '⚫',
        eliteParty: [{ id: 255, level: 85 }, { id: 253, level: 83 }, { id: 248, level: 82 }, { id: 146, level: 81 }, { id: 150, level: 80 }, { id: 142, level: 79 }]
      }
    ],
    midEvent: { enemyId: 255, name: '日蚀队 首领·深渊' },
    outro: [
      { name: "仙剑大侠·李逍遥", text: "（收剑，微笑）合格了。去吧——前面的敌人，交给你。如果事情真的不可收拾...我会在最后关头出手。" },
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
      { name: "竞争对手·苍", text: "（站在你身边）我也要去。这条路...我们一起走到尽头。" },
      { name: "仙剑大侠·李逍遥", text: "（李逍遥御剑飞来，落在你身旁）虚空裂缝的气息...和仙灵界的魔界裂缝一样。封印它需要极强的灵力——你已经足够了。我在终点等你。" }
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
        eliteParty: [{ id: 92, level: 52 }, { id: 59, level: 50 }, { id: 93, level: 48 }, { id: 48, level: 47 }]
      },
      { step: 1, x: 20, y: 8, type: 'dialog', name: '五条悟', text: "不错嘛！你的精灵已经能本能地运用咒力了。记住——咒力不是单纯的力量，而是意志的具现。接下来学习'咒力强化'的要诀。", emoji: '👨‍🏫' },
      { step: 2, x: 15, y: 15, type: 'battle', enemyId: 93, name: '二级咒灵', text: "嘶嘶嘶...（一只更强大的咒灵出现！空气中弥漫着令人窒息的咒力压迫感）", emoji: '👹',
        eliteParty: [{ id: 93, level: 56 }, { id: 92, level: 54 }, { id: 59, level: 53 }, { id: 130, level: 51 }]
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
        eliteParty: [{ id: 57, level: 58 }, { id: 42, level: 56 }, { id: 76, level: 55 }, { id: 15, level: 53 }]
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
        eliteParty: [{ id: 42, level: 68 }, { id: 1, level: 66 }, { id: 252, level: 65 }, { id: 329, level: 63 }]
      },
      { step: 1, x: 15, y: 10, type: 'battle', enemyId: 146, name: '特级咒灵·漏瑚', text: "渺小的人类！在真正的自然之力面前颤抖吧！大地的咆哮才是这个世界的主旋律！", emoji: '🌋',
        eliteParty: [{ id: 146, level: 72 }, { id: 126, level: 70 }, { id: 104, level: 69 }, { id: 110, level: 67 }]
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
    mapId: 101,
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
        eliteParty: [{ id: 120, level: 48 }, { id: 87, level: 46 }, { id: 81, level: 44 }, { id: 40, level: 43 }]
      },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '锦木千束', text: "做得好！看到了吗，那只精灵身上有个奇怪的装置。这和我们之前调查的一样——有人在用控制芯片操纵精灵！", emoji: '🎀' },
      { step: 2, x: 20, y: 12, type: 'battle', enemyId: 130, name: '暴走的 钢翼鹰', text: '（金属翅膀疯狂拍打，芯片闪烁红光，理智已被完全覆盖）', emoji: '🦅',
        eliteParty: [{ id: 130, level: 50 }, { id: 120, level: 48 }, { id: 42, level: 47 }, { id: 88, level: 45 }]
      },
      { step: 3, x: 25, y: 6, type: 'battle', enemyId: 140, name: '暴走的 影幽龙', text: '（龙形的暗影在建筑间穿梭，城市陷入一片混乱）', emoji: '🐉',
        eliteParty: [{ id: 140, level: 52 }, { id: 130, level: 50 }, { id: 142, level: 49 }, { id: 132, level: 47 }]
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
    mapId: 101,
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
        eliteParty: [{ id: 100, level: 55 }, { id: 42, level: 53 }, { id: 15, level: 52 }, { id: 178, level: 50 }]
      },
      { step: 1, x: 18, y: 6, type: 'dialog', name: '锦木千束', text: "看到了吗？搭档之间的默契不是一朝一夕的事。要在战斗中一起成长，羁绊才会越来越深！", emoji: '🎀' },
      { step: 2, x: 22, y: 12, type: 'battle', enemyId: 120, name: '泷奈的搭档·钢拳猿', text: '（泷奈严肃地点了点头）不要留手。我要看看你的精灵之间有没有搭档的潜质。', emoji: '🦍',
        eliteParty: [{ id: 120, level: 57 }, { id: 88, level: 55 }, { id: 87, level: 54 }, { id: 64, level: 52 }]
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
    mapId: 101,
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
        eliteParty: [{ id: 135, level: 62 }, { id: 59, level: 60 }, { id: 94, level: 59 }, { id: 93, level: 57 }]
      },
      { step: 1, x: 12, y: 8, type: 'battle', enemyId: 140, name: '真岛的精锐·暗夜猎手', text: '你以为击败我就完了？后面还有更强的在等着你！真岛大人的计划不可阻挡！', emoji: '🌑',
        eliteParty: [{ id: 140, level: 64 }, { id: 135, level: 62 }, { id: 142, level: 61 }, { id: 130, level: 59 }]
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
  },

  // ==========================================
  // 门派风云篇（独立支线9章 · 李逍遥/厌晚/十二门派）
  // ==========================================

  // ===== 门派篇·壹 =====
  {
    chapter: 21, mapId: 102,
    title: "门派篇·壹：剑起苍穹",
    objective: "李逍遥发来邀请函——十二门派武道大会即将开幕，各门派暗流涌动。",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "（一封以剑气封印的信笺从天而降）老朋友，好久不见。我现在是蜀山派的代掌门——不，是被那群老头子硬推上去的。" },
      { name: "仙剑大侠·李逍遥", text: "十年一度的'十二门派武道大会'就要开始了。但今年不太一样——有人在暗中挑拨各门派之间的关系。" },
      { name: "仙剑大侠·李逍遥", text: "少林和武当因为一件远古秘宝起了冲突，唐门和五毒教的世仇又爆发了...再这样下去，武林要大乱。" },
      { name: "仙剑大侠·李逍遥", text: "我需要你的帮助——以'蜀山友人'的身份参加大会，调查幕后黑手。你的精灵实力，我信得过。" },
      { name: "系统", text: "解锁门派风云篇！武道大会上暗藏阴谋，真相等待揭晓。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 12, type: 'battle', enemyId: 270, name: '少林首徒·圆慧', text: '阿弥陀佛。蜀山来的朋友？少林武学不靠蛮力——让老衲看看你的禅心。', emoji: '🛡️',
        eliteParty: [{ id: 278, level: 72 }, { id: 206, level: 70 }, { id: 270, level: 69 }, { id: 65, level: 68 }, { id: 106, level: 67 }] },
      { step: 1, x: 12, y: 6, type: 'dialog', name: '唐门少主·唐璃', text: '（一个面带冷笑的年轻人拦住了你）蜀山的走狗？唐门和五毒教的恩怨轮不到外人插嘴。但你若想过这条路——先接下我的暗器。', emoji: '🎯' },
      { step: 2, x: 18, y: 10, type: 'battle', enemyId: 185, name: '唐门少主·唐璃', text: '唐门暗器天下无双！就算是御剑术也防不住我的暴雨梨花针！', emoji: '🎯',
        eliteParty: [{ id: 185, level: 74 }, { id: 208, level: 72 }, { id: 94, level: 71 }, { id: 169, level: 70 }, { id: 224, level: 69 }, { id: 43, level: 68 }] },
      { step: 3, x: 22, y: 5, type: 'dialog', name: '药王谷谷主·苏夕', text: '（一个白衣女子匆匆赶来）不好了！有人在大会现场下了蛊毒——好几位门主中招了！我需要你帮我采集解毒材料...路上可能会遇到阻拦。', emoji: '🌿' },
      { step: 4, x: 8, y: 3, type: 'battle', enemyId: 277, name: '五毒教·毒蝎使', text: '苏夕那个贱人！解毒？做梦！大会上那些老东西就该死在毒中！', emoji: '☠️',
        eliteParty: [{ id: 277, level: 75 }, { id: 27, level: 73 }, { id: 186, level: 72 }, { id: 114, level: 71 }, { id: 229, level: 70 }, { id: 295, level: 69 }] },
      { step: 5, x: 15, y: 14, type: 'battle', enemyId: 281, name: '仙剑大侠·李逍遥 [切磋]', text: '（大会开幕战，你和李逍遥被抽到对阵）哈哈，运气不好啊老朋友！开幕战就遇到我？别怪我不留情面——大会规矩，全力以赴！', emoji: '⚔️',
        eliteParty: [{ id: 281, level: 76 }, { id: 182, level: 74 }, { id: 223, level: 73 }, { id: 249, level: 72 }, { id: 136, level: 71 }, { id: 84, level: 70 }] }
    ],
    midEvent: { enemyId: 277, name: '五毒教·毒蝎使' },
    outro: [
      { name: "仙剑大侠·李逍遥", text: "（笑着拍你肩膀）打得漂亮！看来你这些年没有偷懒。" },
      { name: "药王谷谷主·苏夕", text: "解药配好了！但下毒的不是五毒教教主——是有人假借五毒教之名行事。" },
      { name: "唐门少主·唐璃", text: "（面色一变）不是五毒教？那是谁...等等，有人盗走了唐门的'天机毒经'！" },
      { name: "系统", text: "门派好感度系统已激活！有人在利用门派间的宿怨制造混乱。" }
    ],
    reward: { gold: 30000, items: [{id:'vit_patk', count:5}] }
  },

  // ===== 门派篇·贰 =====
  {
    chapter: 22, mapId: 102,
    title: "门派篇·贰：少林武当之争",
    objective: "少林与武当因'太虚令'反目，阻止两大门派决裂。",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "事情越来越严重了。少林方丈法海和武当祖师张三丰因为一件叫'太虚令'的远古神器反目成仇。" },
      { name: "仙剑大侠·李逍遥", text: "太虚令...传说能打开连接异界的通道。两大门派都声称是自己的祖传之物。" },
      { name: "仙剑大侠·李逍遥", text: "我去调停少林和武当，你先去天机阁找鬼谷子——他说他有线索。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 8, type: 'battle', enemyId: 292, name: '天机阁·试炼傀儡', text: '（天机阁阁主设下的试炼）要见我师父？先过了我这关。能被傀儡打败的人，不配知道真相。', emoji: '🔮',
        eliteParty: [{ id: 292, level: 78 }, { id: 140, level: 76 }, { id: 129, level: 75 }, { id: 237, level: 74 }, { id: 151, level: 73 }] },
      { step: 1, x: 16, y: 5, type: 'dialog', name: '天机阁阁主·鬼谷子', text: '（须发皆白的老者坐在棋盘前）我早就算到你会来。太虚令是假的——真正的太虚令五百年前就碎了。有人用残片伪造了赝品挑拨离间。', emoji: '🔮' },
      { step: 2, x: 20, y: 12, type: 'battle', enemyId: 278, name: '少林护法·金刚', text: '法海方丈说了——谁敢阻拦少林讨回太虚令，就是少林的敌人！施主请回！', emoji: '🛡️',
        eliteParty: [{ id: 278, level: 79 }, { id: 206, level: 77 }, { id: 270, level: 76 }, { id: 65, level: 75 }, { id: 106, level: 74 }, { id: 190, level: 73 }] },
      { step: 3, x: 10, y: 15, type: 'battle', enemyId: 150, name: '武当弟子·玄真', text: '武当太极，以柔克刚！少林要抢我们的祖传之物，武当绝不退让！', emoji: '☯️',
        eliteParty: [{ id: 150, level: 80 }, { id: 141, level: 78 }, { id: 282, level: 77 }, { id: 206, level: 76 }, { id: 65, level: 75 }] },
      { step: 4, x: 15, y: 3, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（御剑飞来落地）好消息！我拿到了太虚令——它确实是赝品，内部刻有太虚教的暗纹。法海和张三丰已经冷静下来了。', emoji: '⚔️' },
      { step: 5, x: 22, y: 8, type: 'battle', enemyId: 252, name: '黑袍人·太虚使者', text: '（戴面具的黑袍人从暗处现身）可惜被你们发现了...不过没关系，门派之间的裂痕已经种下。太虚教的复兴不是你们能阻止的！', emoji: '🎭',
        eliteParty: [{ id: 252, level: 82 }, { id: 253, level: 80 }, { id: 248, level: 79 }, { id: 142, level: 78 }, { id: 150, level: 77 }, { id: 146, level: 76 }] }
    ],
    midEvent: { enemyId: 150, name: '武当弟子·玄真' },
    outro: [
      { name: "天机阁阁主·鬼谷子", text: "太虚教...五百年前被十二门派联手剿灭的邪教。教主临死前发誓——五百年后卷土重来。" },
      { name: "仙剑大侠·李逍遥", text: "太虚使者只是先锋。背后一定还有更大的布局者。" },
      { name: "系统", text: "太虚教阴谋初露端倪。少林武当和解，但危机远未结束。" }
    ],
    reward: { gold: 35000, items: [{id:'vit_pdef', count:5}] }
  },

  // ===== 门派篇·叁 =====
  {
    chapter: 23, mapId: 102,
    title: "门派篇·叁：暗影来袭",
    objective: "神秘人厌晚突然出现在武道大会上，她与太虚教有什么关联？",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "（面色凝重）不好...有一个不请自来的人出现了。武道大会会场上，她一出手就击败了三位门派长老。" },
      { name: "仙剑大侠·李逍遥", text: "一个叫「厌晚」的女人——你应该认识她。她说...来参加武道大会，纯粹是觉得「有趣」。" },
      { name: "仙剑大侠·李逍遥", text: "但我总觉得事情没这么简单。她的出现和太虚教的行动太巧合了。先去确认她的目的。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'dialog', name: '暗影执行者·厌晚', text: '（倚在古堡的廊柱上，漫不经心地把玩着一颗暗色宝珠）哟...又见面了。别这么紧张，我今天不是来打你的——虽然也不排除这个可能。', emoji: '🌙' },
      { step: 1, x: 15, y: 10, type: 'battle', enemyId: 270, name: '丐帮长老·鲁大勇', text: '（一个魁梧的汉子挡在路上）你就是那个和黑衣女人说话的人？来者不善！丐帮的地盘——先过我这关再说！', emoji: '🥊',
        eliteParty: [{ id: 270, level: 78 }, { id: 138, level: 76 }, { id: 259, level: 75 }, { id: 184, level: 74 }, { id: 67, level: 73 }, { id: 214, level: 72 }] },
      { step: 2, x: 22, y: 5, type: 'dialog', name: '暗影执行者·厌晚', text: '（出现在你身后）太虚教？我知道他们。可笑的蝼蚁，还妄图利用我。有个叫太虚使者的人来找我合作——我拒绝了。那种货色...不配做我的盟友。', emoji: '🌙' },
      { step: 3, x: 18, y: 14, type: 'battle', enemyId: 253, name: '太虚教·伏魔使', text: '（太虚教刺客突然偷袭！）厌晚...你竟敢拒绝太虚教的邀请？那就和这些武林蝼蚁一起死吧！', emoji: '⚫',
        eliteParty: [{ id: 253, level: 80 }, { id: 248, level: 78 }, { id: 146, level: 77 }, { id: 142, level: 76 }, { id: 130, level: 75 }, { id: 94, level: 74 }] },
      { step: 4, x: 10, y: 8, type: 'dialog', name: '暗影执行者·厌晚', text: '（看着你击败太虚教刺客，嘴角微扬）...不错。比上次又强了。太虚教的人找我时说了一件事——他们在寻找一种叫「虚空残响」的力量。和日蚀队的虚空能量...很像。', emoji: '🌙' },
      { step: 5, x: 8, y: 3, type: 'battle', enemyId: 609, name: '暗影执行者·厌晚 [试探]', text: '（突然拔出精灵球）既然来了...不打一场太可惜了。别担心，我只用五成力。就当是...武道大会的特别赛。', emoji: '🌙',
        eliteParty: [{ id: 609, level: 80 }, { id: 608, level: 78, devilFruit: 'df_yami' }, { id: 94, level: 77 }, { id: 604, level: 76 }, { id: 603, level: 75 }] }
    ],
    midEvent: { enemyId: 253, name: '太虚教·伏魔使' },
    outro: [
      { name: "暗影执行者·厌晚", text: "（收起精灵球，露出少见的笑容）...有意思。武林这个地方，比我想象的有趣。" },
      { name: "暗影执行者·厌晚", text: "告诉你的剑客朋友——太虚教的目标不是武林，而是「虚空残响」。那是比日蚀队的虚空能量更古老、更危险的东西。" },
      { name: "暗影执行者·厌晚", text: "我会在附近观察。如果太虚教的人变得有趣...我可能会亲自下场。那时候可别挡我的路。" },
      { name: "仙剑大侠·李逍遥", text: "（赶到）厌晚...果然和她有关。但她说的「虚空残响」...这和仙灵界的传说不谋而合。事情比想象的严重。" },
      { name: "系统", text: "厌晚的目的成谜。太虚教在寻找「虚空残响」——一种远古的毁灭之力。" }
    ],
    reward: { gold: 35000, items: [{id:'vit_satk', count:5}] }
  },

  // ===== 门派篇·肆 =====
  {
    chapter: 24, mapId: 102,
    title: "门派篇·肆：毒与药的宿命",
    objective: "唐门与五毒教百年世仇激化，药王谷陷入危机。",
    intro: [
      { name: "药王谷谷主·苏夕", text: "（面色苍白）不好了...五毒教教主蓝凤凰亲自率人围攻了药王谷！她说唐门偷了五毒教的毒经，药王谷是帮凶！" },
      { name: "唐门少主·唐璃", text: "（怒不可遏）是太虚教的栽赃！我唐门何时偷过什么毒经？但蓝凤凰那疯女人根本不听解释！" },
      { name: "仙剑大侠·李逍遥", text: "必须先救药王谷。唐璃，你和我一起去。至于真相——打完再说。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 229, name: '五毒教·蜈蚣使', text: '药王谷替唐门炼解毒药？那就一起毁掉！千蛛万毒噬心！', emoji: '☠️',
        eliteParty: [{ id: 229, level: 80 }, { id: 295, level: 78 }, { id: 27, level: 77 }, { id: 186, level: 76 }, { id: 114, level: 75 }, { id: 277, level: 74 }] },
      { step: 1, x: 15, y: 8, type: 'dialog', name: '药王谷弟子·小茴', text: '（衣衫染血）谷主被五毒教教主困在药圃里了！她们...在对峙。谷主说如果唐门少主来，就能证明唐门的清白。', emoji: '🌿' },
      { step: 2, x: 20, y: 5, type: 'battle', enemyId: 277, name: '五毒教教主·蓝凤凰', text: '（冷笑）唐璃？好，你来了正好。天机毒经是不是你唐门偷的？说！否则药王谷今天就成废墟！', emoji: '☠️',
        eliteParty: [{ id: 277, level: 83 }, { id: 27, level: 81 }, { id: 186, level: 80 }, { id: 295, level: 79 }, { id: 229, level: 78 }, { id: 114, level: 77 }] },
      { step: 3, x: 12, y: 12, type: 'dialog', name: '唐门少主·唐璃', text: '（将一枚太虚教暗纹令牌掷到蓝凤凰面前）看清楚！这是从太虚使者身上搜出来的。天机毒经的失窃、下毒嫁祸——都是太虚教干的！', emoji: '🎯' },
      { step: 4, x: 8, y: 3, type: 'battle', enemyId: 252, name: '太虚教·幻毒师', text: '（一个蒙面人从暗处飞出）可恶，被发现了！天机毒经已经被送回太虚秘境了——你们来不及了！', emoji: '🎭',
        eliteParty: [{ id: 252, level: 84 }, { id: 277, level: 82 }, { id: 248, level: 81 }, { id: 146, level: 80 }, { id: 185, level: 79 }, { id: 94, level: 78 }] },
      { step: 5, x: 18, y: 14, type: 'dialog', name: '五毒教教主·蓝凤凰', text: '（看着太虚教暗纹，长叹一声）...是我冲动了。唐璃，这次是五毒教的错。但你唐门欠我的人情——改天再算。', emoji: '☠️' }
    ],
    midEvent: { enemyId: 277, name: '五毒教教主·蓝凤凰' },
    outro: [
      { name: "唐门少主·唐璃", text: "（对蓝凤凰拱手）百年恩怨，不是一天能解的。但今天——我们有共同的敌人。" },
      { name: "五毒教教主·蓝凤凰", text: "哼...别以为说两句漂亮话就能化解。不过太虚教——我亲自来。天机毒经是五毒教的东西，谁偷了都得还。" },
      { name: "药王谷谷主·苏夕", text: "毒与药本是一体...或许这就是化解百年恩怨的契机。" },
      { name: "系统", text: "唐门与五毒教暂时放下恩怨！太虚教正在收集各门派秘籍。" }
    ],
    reward: { gold: 38000, items: [{id:'vit_sdef', count:5}] }
  },

  // ===== 门派篇·伍 =====
  {
    chapter: 25, mapId: 102,
    title: "门派篇·伍：丐帮风波与逍遥往事",
    objective: "丐帮内部出现叛徒，逍遥派揭露太虚教的古老秘密。",
    intro: [
      { name: "丐帮帮主·洪七公", text: "（怒拍桌子）老叫花子的降龙十八掌还没老到拿不动！但丐帮副帮主竟然投了太虚教——他带走了三成丐帮弟子！" },
      { name: "逍遥派掌门·无崖子", text: "（飘然而至）太虚教的手段比我们想象的深。他们不只挑拨——还在策反各门派的核心成员。" },
      { name: "逍遥派掌门·无崖子", text: "五百年前，逍遥派的祖师和太虚教主是同门师兄弟。我这里有一份当年的真相...但你得先帮洪帮主平定丐帮之乱。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 12, type: 'battle', enemyId: 259, name: '丐帮叛徒·铁掌帮主', text: '洪七公老糊涂了！太虚教才是武林的未来！跟着我投太虚教，荣华富贵享不尽！', emoji: '🥊',
        eliteParty: [{ id: 259, level: 82 }, { id: 184, level: 80 }, { id: 138, level: 79 }, { id: 67, level: 78 }, { id: 214, level: 77 }, { id: 270, level: 76 }] },
      { step: 1, x: 16, y: 6, type: 'dialog', name: '丐帮帮主·洪七公', text: '（大笑）好！打得痛快！这臭小子终于被揍了。来，吃一只叫花鸡庆祝...不过逍遥派的无崖子说有重要事——你先去吧。', emoji: '🥊' },
      { step: 2, x: 22, y: 10, type: 'battle', enemyId: 141, name: '逍遥派·破虚试炼', text: '（无崖子设下的考验）逍遥派的秘密不是谁都能知道的。通过这场试炼，证明你有资格。', emoji: '💨',
        eliteParty: [{ id: 141, level: 84 }, { id: 163, level: 82 }, { id: 174, level: 81 }, { id: 290, level: 80 }, { id: 127, level: 79 }, { id: 249, level: 78 }] },
      { step: 3, x: 12, y: 3, type: 'dialog', name: '逍遥派掌门·无崖子', text: '（展开一幅泛黄的卷轴）五百年前，逍遥派祖师和太虚教主本是同门。太虚教主被一种叫"虚空残响"的力量蛊惑，走火入魔。那不是普通的能量——那是异界裂缝中泄漏的原始毁灭之力。', emoji: '💨' },
      { step: 4, x: 20, y: 14, type: 'battle', enemyId: 253, name: '太虚教·虚空先锋', text: '逍遥派的老东西，五百年前你们的祖师背叛了师兄！今天就让你们付出代价！', emoji: '⚫',
        eliteParty: [{ id: 253, level: 85 }, { id: 252, level: 83 }, { id: 248, level: 82 }, { id: 146, level: 81 }, { id: 142, level: 80 }, { id: 130, level: 79 }] },
      { step: 5, x: 5, y: 8, type: 'dialog', name: '暗影执行者·厌晚', text: '（不知何时出现在树影下）虚空残响...我在日蚀队的时候就在追踪这个东西。看来太虚教和日蚀队的目标是一样的——打开异界之门。（目光锐利地看向你）这件事...我要亲自查。别拦我。', emoji: '🌙' }
    ],
    midEvent: { enemyId: 259, name: '丐帮叛徒·铁掌帮主' },
    outro: [
      { name: "逍遥派掌门·无崖子", text: "虚空残响...五百年前差点毁灭武林的力量。如果太虚教再次唤醒它，后果不堪设想。" },
      { name: "仙剑大侠·李逍遥", text: "（通讯传来）在仙灵界也有虚空残响的记载。它是所有世界的共同威胁——我正在查找封印之法。" },
      { name: "系统", text: "丐帮内乱平定。逍遥派揭露太虚教的最终目标：唤醒虚空残响。厌晚独自展开调查。" }
    ],
    reward: { gold: 40000, items: [{id:'vit_spd', count:5}] }
  },

  // ===== 门派篇·陆 =====
  {
    chapter: 26, mapId: 102,
    title: "门派篇·陆：冰火两重天",
    objective: "明教与昆仑派被太虚教彻底挑拨，在火山之巅爆发全面冲突。",
    intro: [
      { name: "明教教主·阳顶天", text: "（通讯传来愤怒的声音）昆仑派偷袭了明教在熔岩火山的据点！三十名弟子受伤！这次——我绝不忍！" },
      { name: "昆仑派掌门·何足道", text: "（同时传来冰冷的声音）是明教先攻击的昆仑巡逻队！证据确凿！我已命寒冰长老率弟子反击！" },
      { name: "仙剑大侠·李逍遥", text: "又是太虚教的挑拨之计！但这次他们做得更彻底——伪造了战斗现场和证据。我们必须在明教和昆仑派开战之前阻止他们！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 275, name: '明教·炎卫队长', text: '昆仑派的冰冻攻击差点杀了教主！今天不是你死就是我亡！', emoji: '🔥',
        eliteParty: [{ id: 275, level: 84 }, { id: 6, level: 82 }, { id: 17, level: 81 }, { id: 157, level: 80 }, { id: 128, level: 79 }, { id: 56, level: 78 }] },
      { step: 1, x: 15, y: 10, type: 'battle', enemyId: 263, name: '昆仑派·寒冰长老', text: '明教那群疯子先动的手！我昆仑派岂能忍气吞声？寒冰劲——起！', emoji: '❄️',
        eliteParty: [{ id: 263, level: 85 }, { id: 234, level: 83 }, { id: 91, level: 82 }, { id: 199, level: 81 }, { id: 123, level: 80 }, { id: 131, level: 79 }] },
      { step: 2, x: 22, y: 5, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（持剑挡在两派之间）都住手！看清楚——（指向远处的身影）——攻击你们的人，穿的都是太虚教的暗纹战袍！', emoji: '⚔️' },
      { step: 3, x: 18, y: 14, type: 'battle', enemyId: 252, name: '太虚教·焚天使', text: '（伪装被拆穿的太虚教徒）切...被发现了也无所谓。冰与火的仇恨已经种下——你们迟早会再打起来！', emoji: '🎭',
        eliteParty: [{ id: 252, level: 86 }, { id: 275, level: 84 }, { id: 263, level: 83 }, { id: 253, level: 82 }, { id: 146, level: 81 }, { id: 248, level: 80 }] },
      { step: 4, x: 10, y: 8, type: 'battle', enemyId: 608, name: '暗影执行者·厌晚', text: '（从火山口的浓烟中走出，身上沾着灰烬）...我刚在太虚教的秘密据点逛了一圈。他们的"虚空残响"研究已经完成了八成。（看向你）时间不多了。我不是来帮你们的——我只是...想亲眼看看虚空之力到底有多强。顺便...再和你打一场。', emoji: '🌙',
        eliteParty: [{ id: 608, level: 86, devilFruit: 'df_yami' }, { id: 609, level: 84, devilFruit: 'df_supa' }, { id: 610, level: 83 }, { id: 604, level: 82 }, { id: 94, level: 81 }, { id: 603, level: 80 }] },
      { step: 5, x: 8, y: 3, type: 'dialog', name: '明教教主·阳顶天', text: '（将圣火令捏碎，怒火转向太虚教）...原来如此。老夫差点铸成大错。昆仑何兄弟——今日明教向昆仑赔罪。但太虚教...明教的圣火，将焚尽一切邪恶！', emoji: '🔥' }
    ],
    midEvent: { enemyId: 263, name: '昆仑派·寒冰长老' },
    outro: [
      { name: "昆仑派掌门·何足道", text: "（与阳顶天相互抱拳）冰火本相克...但此刻，我们的怒火应该对准同一个方向。" },
      { name: "暗影执行者·厌晚", text: "（对李逍遥丢过一份情报）这是太虚教秘境的位置图。别问我怎么拿到的。就当是...提前预约下一场对决的门票。" },
      { name: "仙剑大侠·李逍遥", text: "（接过情报，苦笑）这个女人...敌友难分。但她给的情报是真的——太虚秘境就在这里。" },
      { name: "系统", text: "明教与昆仑和解！厌晚提供了太虚秘境的情报。十二门派的联盟逐渐成形。" }
    ],
    reward: { gold: 42000, items: [{id:'vit_hp', count:8}] }
  },

  // ===== 门派篇·柒 =====
  {
    chapter: 27, mapId: 102,
    title: "门派篇·柒：天机与独孤",
    objective: "天机阁破解太虚秘境阵法，华山令狐冲发现太虚教的最终计划。",
    intro: [
      { name: "天机阁阁主·鬼谷子", text: "太虚秘境有七层阵法保护。我已经推演出了前五层的破解之法，但最后两层...需要特殊的力量。" },
      { name: "华山派掌门·令狐冲", text: "（拔出长剑）我在太虚教残留的据点找到了线索——他们要用虚空残响打开「万界之门」，让所有世界的力量涌入这个世界！" },
      { name: "华山派掌门·令狐冲", text: "如果万界之门打开...不仅武林会毁灭，整个精灵世界都会被吞噬。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 8, type: 'battle', enemyId: 292, name: '天机阁·第六阵眼', text: '（天机阁的傀儡阵法——第六重考验）天眼通已经看穿了入侵者的弱点。在此阵中，你的速度将被压制！', emoji: '🔮',
        eliteParty: [{ id: 292, level: 86 }, { id: 140, level: 84 }, { id: 129, level: 83 }, { id: 237, level: 82 }, { id: 151, level: 81 }, { id: 222, level: 80 }] },
      { step: 1, x: 16, y: 5, type: 'dialog', name: '天机阁阁主·鬼谷子', text: '第六层已破！但第七层...需要一个曾经接触过虚空能量的人才能共振解除。你在主线和日蚀队战斗时接触过虚空能量——你就是那把钥匙。', emoji: '🔮' },
      { step: 2, x: 22, y: 12, type: 'battle', enemyId: 182, name: '华山派掌门·令狐冲 [独孤九剑]', text: '（令狐冲拔剑横在前方）去太虚秘境之前，让我用独孤九剑考验你。如果你接不住——你就没资格冒这个险。这是华山的规矩，也是我对你的责任。', emoji: '🏔️',
        eliteParty: [{ id: 182, level: 88 }, { id: 223, level: 86 }, { id: 43, level: 85 }, { id: 163, level: 84 }, { id: 94, level: 83 }, { id: 185, level: 82 }] },
      { step: 3, x: 12, y: 15, type: 'battle', enemyId: 253, name: '太虚教·暗杀队', text: '太虚教主有令——不惜一切代价阻止他们破解阵法！杀！', emoji: '⚫',
        eliteParty: [{ id: 253, level: 88 }, { id: 252, level: 86 }, { id: 248, level: 85 }, { id: 146, level: 84 }, { id: 150, level: 83 }, { id: 142, level: 82 }] },
      { step: 4, x: 20, y: 3, type: 'dialog', name: '武当祖师·张三丰', text: '（闭目运功）老道以太极之力牵引万物——第七层阵法...在你的虚空之力和我的太极之间，将产生共振。准备好了，孩子。', emoji: '☯️' },
      { step: 5, x: 15, y: 8, type: 'battle', enemyId: 281, name: '仙剑大侠·李逍遥 [破阵之剑]', text: '（御灵剑发出耀眼光芒）最后一层阵法需要极强的灵力冲击！让我和你联手——不对，先让我确认你现在的全部实力。御灵剑...拔！', emoji: '⚔️',
        eliteParty: [{ id: 281, level: 88 }, { id: 182, level: 86 }, { id: 329, level: 85 }, { id: 223, level: 84 }, { id: 249, level: 83 }, { id: 369, level: 82 }] }
    ],
    midEvent: { enemyId: 253, name: '太虚教·暗杀队' },
    outro: [
      { name: "天机阁阁主·鬼谷子", text: "成功了！七层阵法全部破解。太虚秘境的入口...已经打开。" },
      { name: "华山派掌门·令狐冲", text: "太好了！但太虚教一定有所防备。我们需要十二门派全员出动。" },
      { name: "仙剑大侠·李逍遥", text: "我已经通知了所有门派。明天黎明——十二门派联盟正式出征！" },
      { name: "系统", text: "太虚秘境阵法全部破解！十二门派联盟集结完毕，最终决战在即。" }
    ],
    reward: { gold: 45000, items: [{id:'vit_crit', count:3}] }
  },

  // ===== 门派篇·捌 =====
  {
    chapter: 28, mapId: 102,
    title: "门派篇·捌：厌晚之约",
    objective: "厌晚在太虚秘境入口拦住了你——她要用全力和你决战，无论胜负都会揭露终极秘密。",
    intro: [
      { name: "暗影执行者·厌晚", text: "（独自站在秘境入口，月光下的身影如同雕塑）...你来了。别着急进去。" },
      { name: "暗影执行者·厌晚", text: "我这几天独自潜入了太虚秘境深处。太虚教主已经完成了虚空残响的觉醒仪式——他的力量...比日蚀队的深渊还强。" },
      { name: "暗影执行者·厌晚", text: "但在你进去之前...我有一个请求。" },
      { name: "暗影执行者·厌晚", text: "从我们第一次在微风草原见面，到古堡、到冻土、到空间站...你是唯一一个每次都让我兴奋的对手。" },
      { name: "暗影执行者·厌晚", text: "如果太虚教主真的那么强...这或许是我们最后一次对决的机会。所以——在你去拯救世界之前，先全力和我打一场。不留遗憾的那种。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 607, name: '暗影执行者·厌晚 [全力以赴]', text: '（缓缓拔出六颗精灵球，眼中燃烧着前所未有的战意）不用留手...不用怜悯...不用策略。就用你全部的力量——来击碎我！这一战...是我厌晚的最高敬意。', emoji: '🌙',
        eliteParty: [{ id: 608, level: 90, devilFruit: 'df_yami' }, { id: 609, level: 88, devilFruit: 'df_supa' }, { id: 607, level: 92 }, { id: 610, level: 89, devilFruit: 'df_hie' }, { id: 604, level: 87 }, { id: 603, level: 86 }] },
      { step: 1, x: 15, y: 5, type: 'dialog', name: '暗影执行者·厌晚', text: '（喘着气，露出释然的微笑）...够了。这就是我想要的。谢谢你...让我知道，在这个世界上还有人能让我全力以赴。', emoji: '🌙' },
      { step: 2, x: 20, y: 8, type: 'dialog', name: '暗影执行者·厌晚', text: '现在告诉你太虚秘境的真相——太虚教主不是一个人。他身体里住着五百年前被封印的虚空残响意志。杀他的肉体没用——必须先用灵力净化虚空残响，才能真正消灭他。', emoji: '🌙' },
      { step: 3, x: 22, y: 14, type: 'battle', enemyId: 253, name: '太虚教·守门大将', text: '（太虚秘境入口的最后守卫）不可能！厌晚那个女人怎么把秘密告诉你们了？不管了——太虚教主万岁！', emoji: '⚫',
        eliteParty: [{ id: 253, level: 90 }, { id: 252, level: 88 }, { id: 248, level: 87 }, { id: 255, level: 86 }, { id: 146, level: 85 }, { id: 150, level: 84 }] },
      { step: 4, x: 8, y: 3, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（御剑落地）厌晚的情报至关重要！如果要净化虚空残响...需要仙灵界的净化术和十二门派的武功合力。我来执行净化——你来拖住太虚教主！', emoji: '⚔️' },
      { step: 5, x: 12, y: 12, type: 'dialog', name: '暗影执行者·厌晚', text: '（转身走向秘境深处）我也去。别误会——不是为了帮你。是太虚教主那个老不死的，竟然说我"不配成为他的盟友"。这笔账...我亲自算。', emoji: '🌙' }
    ],
    midEvent: { enemyId: 607, name: '暗影执行者·厌晚 [全力以赴]' },
    outro: [
      { name: "仙剑大侠·李逍遥", text: "所有人都到齐了。十二门派联盟...加上厌晚...加上我的仙灵之力。这一战——决定武林的存亡。" },
      { name: "暗影执行者·厌晚", text: "（与你并肩而立）...别死在太虚教主手里。因为下一个打败你的人——只能是我。" },
      { name: "系统", text: "厌晚以战友身份加入决战！太虚秘境的终极之战即将开始。" }
    ],
    reward: { gold: 50000, items: [{id:'vit_patk', count:8}] }
  },

  // ===== 门派篇·玖 =====
  {
    chapter: 29, mapId: 102,
    title: "门派篇·玖：十二门派·终战",
    objective: "率领十二门派联盟+厌晚+李逍遥，攻入太虚秘境，击败虚空残响！",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "（站在悬崖之巅，十二面门派旗帜在身后猎猎作响）今天，没有蜀山与少林之分，没有唐门与五毒之仇。只有——正道联盟。" },
      { name: "少林方丈·法海", text: "阿弥陀佛。少林七十二绝技，今日倾囊相助。" },
      { name: "武当祖师·张三丰", text: "太极之力，以柔克刚。老夫虽年迈，犹可一战。" },
      { name: "唐门少主·唐璃", text: "暴雨梨花针已经淬好了最强的毒。" },
      { name: "五毒教教主·蓝凤凰", text: "五毒教的万毒——今天只对太虚教使。唐璃小子，别拖后腿。" },
      { name: "丐帮帮主·洪七公", text: "老叫花子许久没这么热血了！降龙十八掌，奉陪到底！" },
      { name: "暗影执行者·厌晚", text: "（站在最后方，双手环胸）...少废话。打完了请我吃饭。" },
      { name: "仙剑大侠·李逍遥", text: "出发——目标太虚秘境核心！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 10, type: 'battle', enemyId: 253, name: '太虚教·四大护法之风', text: '太虚教存续五百年，岂是你们这些小辈能撼动的！风之结界——起！', emoji: '🌪️',
        eliteParty: [{ id: 253, level: 90 }, { id: 249, level: 88 }, { id: 142, level: 87 }, { id: 42, level: 86 }, { id: 163, level: 85 }, { id: 15, level: 84 }] },
      { step: 1, x: 12, y: 5, type: 'battle', enemyId: 248, name: '太虚教·四大护法之地', text: '大地裂变！你们的联盟不过是一盘散沙！', emoji: '🌋',
        eliteParty: [{ id: 248, level: 91 }, { id: 185, level: 89 }, { id: 68, level: 88 }, { id: 184, level: 87 }, { id: 112, level: 86 }, { id: 259, level: 85 }] },
      { step: 2, x: 25, y: 8, type: 'battle', enemyId: 146, name: '太虚教·四大护法之暗', text: '（黑暗中嗤笑）在我的暗之领域里，光明不存在。', emoji: '🌑',
        eliteParty: [{ id: 146, level: 92 }, { id: 608, level: 90 }, { id: 94, level: 89 }, { id: 59, level: 88 }, { id: 609, level: 87 }, { id: 130, level: 86 }] },
      { step: 3, x: 20, y: 12, type: 'dialog', name: '逍遥派掌门·无崖子', text: '（维持阵法通道，汗如雨下）太虚秘境的核心在前方...李逍遥，准备好净化术式。你（看向你）——拖住太虚教主！', emoji: '💨' },
      { step: 4, x: 15, y: 3, type: 'battle', enemyId: 283, name: '太虚教主·太虚真人 [虚空残响]', text: '（浑身缠绕着紫黑色虚空之力的身影睁开了眼，声音中混杂着两个意志）五百年...终于等到了。十二门派的后人们——今天你们将见证万界之门的开启！虚空归一——万物寂灭！', emoji: '⚫',
        eliteParty: [{ id: 283, level: 96 }, { id: 254, level: 94 }, { id: 255, level: 93 }, { id: 253, level: 92 }, { id: 146, level: 91 }, { id: 248, level: 90 }] },
      { step: 5, x: 15, y: 8, type: 'battle', enemyId: 281, name: '仙剑大侠·李逍遥 [御剑·仙灵]', text: '（太虚真人倒下后，虚空残响的力量消散。李逍遥收起净化术式，转身面对你）...一切都结束了。但还有一件事——从回声山谷那个菜鸟到现在，你一直在追赶我。今天...让我用蜀山最强的剑术，送你最后一场毕业战。这不是考验——是剑客之间的最高敬意。', emoji: '⚔️',
        eliteParty: [{ id: 281, level: 98 }, { id: 182, level: 95 }, { id: 223, level: 94 }, { id: 329, level: 93 }, { id: 249, level: 92 }, { id: 369, level: 91 }] }
    ],
    midEvent: { enemyId: 283, name: '太虚教主·太虚真人 [虚空残响]' },
    outro: [
      { name: "仙剑大侠·李逍遥", text: "（收剑入鞘，由衷地笑了）...你赢了。不——是你超越了我。从那个在山谷里被我救的菜鸟，到现在站在我面前的绝世高手...这段旅途，真好。" },
      { name: "少林方丈·法海", text: "阿弥陀佛。太虚教的威胁终于彻底解除了。今日之战，将载入武林史册。" },
      { name: "武当祖师·张三丰", text: "正道不孤。十二门派虽各有恩怨，但大义面前，我等不分彼此。" },
      { name: "唐门少主·唐璃", text: "（看向蓝凤凰）...这次并肩作战，唐门欠你一个人情。旧怨...以后再说。" },
      { name: "五毒教教主·蓝凤凰", text: "（轻笑）人情？唐璃小子，可别后悔说这话。" },
      { name: "暗影执行者·厌晚", text: "（靠在残垣上，难得地仰望星空）...没想到，我竟然会和一群正派人士并肩作战。真讽刺。" },
      { name: "暗影执行者·厌晚", text: "不过...也不坏。（看向你）下次见面，我不会再客气了。那时候——我要看看你到底能强到什么地步。" },
      { name: "仙剑大侠·李逍遥", text: "太虚真人临死前说的话让我在意——'更大的黑暗已经苏醒'。或许...我们的战斗还没有结束。" },
      { name: "仙剑大侠·李逍遥", text: "不过那是以后的事了。今天——我们庆祝。回蜀山，我请你们所有人喝最好的灵酒！" },
      { name: "暗影执行者·厌晚", text: "...只要不是甜的，我去。" },
      { name: "系统", text: "门派风云篇·完。十二门派联盟+厌晚合力击败太虚教！" },
      { name: "系统", text: "奖励：所有门派好感度+50，解锁隐藏称号【武林盟主】，厌晚好感度大幅提升" }
    ],
    reward: { gold: 150000, balls: { master: 5 } }
  },

  // ==========================================
  // 异界征途篇 (18章, STORY_SCRIPT index 28-45)
  // 地图: 103幻境迷宫 / 104龙脊山脉 / 105深渊裂谷 / 106星落平原 / 107彩虹之桥 / 108机械王座 / 109创世神殿
  // 角色: 主角、李逍遥、厌晚、花生、十三、马里奥、林克
  // ==========================================

  // ===== 异界篇·壹：次元裂隙 (Map 103) =====
  {
    chapter: 30, mapId: 103,
    title: "异界篇·壹：次元裂隙",
    objective: "调查幻境迷宫中突然出现的次元裂隙，遭遇来自异世界的不速之客。",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "（神色凝重）最近蜀山的结界频繁震动——空间本身在撕裂。你感觉到了吗？" },
      { name: "暗影执行者·厌晚", text: "...不只是蜀山。我在暗影网络中也探测到了异常的次元波动。东南方向——幻境迷宫。" },
      { name: "仙剑大侠·李逍遥", text: "太虚真人临终说的'更大的黑暗已经苏醒'...恐怕就是这个。" },
      { name: "暗影执行者·厌晚", text: "少废话，去看看就知道了。（转身走向迷宫入口）" },
      { name: "系统", text: "【异界征途篇】开启！次元裂隙正在幻境迷宫中蔓延..." }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 594, name: '次元裂隙·幽影', text: '（从裂隙中涌出的黑暗实体，没有语言，只有纯粹的破坏欲）', emoji: '🌀',
        eliteParty: [{ id: 594, level: 95 }, { id: 595, level: 95 }, { id: 146, level: 94 }, { id: 130, level: 94 }] },
      { step: 1, x: 14, y: 4, type: 'dialog', name: '异次元裂缝', text: '（裂隙中传来微弱的声音）...有人吗？！救命！我被吸进来了！这里全是奇怪的怪物！', emoji: '🌀' },
      { step: 2, x: 20, y: 8, type: 'battle', enemyId: 609, name: '次元守卫·幻影兵', text: '（巨大的幻影凝聚成型，挡住了前进的道路）⬛⬛⬛（发出刺耳的次元噪音）', emoji: '👻',
        eliteParty: [{ id: 609, level: 96 }, { id: 604, level: 95 }, { id: 144, level: 95 }, { id: 178, level: 94 }, { id: 240, level: 94 }] },
      { step: 3, x: 25, y: 6, type: 'dialog', name: '花生', text: '（从裂隙中摔出来，满身灰尘，手里还抱着半个烤红薯）呜哇——！终于出来了！我还以为要在那个黑乎乎的地方待一辈子！...咦？你们是谁？这里是哪里？有吃的吗？', emoji: '🥜' },
      { step: 4, x: 22, y: 10, type: 'battle', enemyId: 605, name: '次元裂隙·暴走体', text: '（花生身后的裂隙中追出了一个巨大的次元生物！）', emoji: '💥',
        eliteParty: [{ id: 605, level: 97 }, { id: 253, level: 96 }, { id: 221, level: 95 }, { id: 150, level: 95 }, { id: 604, level: 94 }] }
    ],
    midEvent: { enemyId: 605, name: '次元裂隙·暴走体' },
    outro: [
      { name: "花生", text: "（拍拍身上的灰）太感谢了！你们好厉害！我叫花生，来自美食大陆。我在做烤红薯的时候，地上突然裂开一个洞，然后我就掉进来了！" },
      { name: "暗影执行者·厌晚", text: "...美食大陆？（挑眉）" },
      { name: "花生", text: "对呀对呀！那里的山是巧克力做的，河是牛奶流的！...呜，好想家。" },
      { name: "仙剑大侠·李逍遥", text: "（摸下巴）看来次元裂隙连接着不同的世界。花生，你先跟着我们。（对你）这件事比想象中严重，我们得继续深入调查。" }
    ],
    reward: { gold: 30000, items: [{id:'potion', count:10}] }
  },

  // ===== 异界篇·贰：迷雾中的暗影 (Map 103) =====
  {
    chapter: 31, mapId: 103,
    title: "异界篇·贰：迷雾中的暗影",
    objective: "在迷宫深处追踪次元波动源头，遭遇神秘的暗杀者。",
    intro: [
      { name: "花生", text: "（东张西望）这个迷宫好大啊...而且雾越来越浓了。嘿，你们有没有带零食？我那个烤红薯已经吃完了..." },
      { name: "暗影执行者·厌晚", text: "闭嘴。（突然拔刀）...有人。三点钟方向，距离二十步。杀气很重。" },
      { name: "仙剑大侠·李逍遥", text: "（手按剑柄）不是普通的气息...也不是这个世界的。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 10, type: 'battle', enemyId: 535, name: '幻影迷雾·吞噬者', text: '（迷雾凝聚成实体，张开了巨大的黑暗之口）', emoji: '🌫️',
        eliteParty: [{ id: 535, level: 96 }, { id: 540, level: 95 }, { id: 432, level: 95 }, { id: 388, level: 94 }] },
      { step: 1, x: 12, y: 3, type: 'battle', enemyId: 681, name: '暗影·十三', text: '（黑色短刀闪过寒光）...第十三条法则：在确认目标之前，先清除所有变数。你们——就是变数。', emoji: '🗡️',
        eliteParty: [{ id: 681, level: 97 }, { id: 608, level: 96 }, { id: 540, level: 95 }, { id: 535, level: 95 }, { id: 146, level: 94 }] },
      { step: 2, x: 18, y: 7, type: 'dialog', name: '十三', text: '（收刀入鞘，冷冷地看着你们）...有意思。你的精灵比我预期的强。第七条法则：实力能够证明的人，值得暂时信任。', emoji: '🗡️' },
      { step: 3, x: 22, y: 5, type: 'dialog', name: '十三', text: '我叫十三。没有姓，没有来历。我在这个迷宫里困了不知道多久——追踪一个叫"次元霸主"的目标。他在收集各个世界的力量。', emoji: '🗡️' },
      { step: 4, x: 25, y: 10, type: 'battle', enemyId: 609, name: '幻境守卫·高阶', text: '（迷宫核心区域的强大守卫挡住去路）', emoji: '🎭',
        eliteParty: [{ id: 609, level: 97 }, { id: 683, level: 96 }, { id: 650, level: 96 }, { id: 605, level: 95 }, { id: 604, level: 95 }, { id: 253, level: 94 }] }
    ],
    midEvent: { enemyId: 681, name: '暗影·十三' },
    outro: [
      { name: "十三", text: "次元霸主...他不属于任何一个世界。他在次元的夹缝中诞生，以吞噬世界的能量为食。这个迷宫就是他制造的'猎场'之一。" },
      { name: "花生", text: "（吞了口口水）听...听起来好可怕。那他为什么要这么做？" },
      { name: "十三", text: "第一条法则：怪物不需要理由。...但如果非要找一个——他想要成为唯一的'神'。" },
      { name: "仙剑大侠·李逍遥", text: "（沉声）一个比太虚真人还要危险的存在...十三，加入我们。一个人追踪太危险了。" },
      { name: "十三", text: "...第五条法则：借力打力。行，暂时合作。" }
    ],
    reward: { gold: 35000, items: [{id:'revive', count:5}] }
  },

  // ===== 异界篇·叁：幻境之主 (Map 103) =====
  {
    chapter: 32, mapId: 103,
    title: "异界篇·叁：幻境之主",
    objective: "击败幻境迷宫的核心守卫——幻影大师，获取第一把次元钥匙。",
    intro: [
      { name: "十三", text: "前方就是迷宫核心。次元霸主在每个猎场都设置了一个'看门人'——他们掌握着通往下一个世界的钥匙。" },
      { name: "暗影执行者·厌晚", text: "看门人...哼。那就打碎门好了。" },
      { name: "花生", text: "（举手）我虽然打不过大怪物，但我可以给大家加油！还有——我背包里有特制的元气便当，战斗完了给你们吃！" },
      { name: "仙剑大侠·李逍遥", text: "（微笑）有后勤保障了。出发！" }
    ],
    tasks: [
      { step: 0, x: 6, y: 8, type: 'battle', enemyId: 604, name: '幻境卫兵·左', text: '此处禁止通行！幻影大师正在进行次元仪式！', emoji: '🛡️',
        eliteParty: [{ id: 604, level: 97 }, { id: 649, level: 96 }, { id: 653, level: 96 }, { id: 526, level: 95 }, { id: 521, level: 95 }] },
      { step: 1, x: 12, y: 4, type: 'battle', enemyId: 650, name: '幻境卫兵·右', text: '你们以为打倒一个就能过去？太天真了！', emoji: '🛡️',
        eliteParty: [{ id: 650, level: 97 }, { id: 654, level: 96 }, { id: 652, level: 96 }, { id: 530, level: 95 }, { id: 605, level: 95 }] },
      { step: 2, x: 18, y: 6, type: 'dialog', name: '花生', text: '（掏出便当）快！趁现在补充体力！我特制的元气便当，吃了之后力量翻倍！...好吧没有翻倍，但至少能恢复精神！', emoji: '🍱' },
      { step: 3, x: 22, y: 8, type: 'battle', enemyId: 609, name: '幻影大师', text: '（从迷雾中现身，面具下发出阴冷的笑声）呵呵呵...能走到这里的人类，数百年来你们是第一批。但这就是终点了——在我的幻境中，没有人能分清虚实！', emoji: '🎭',
        eliteParty: [{ id: 609, level: 99 }, { id: 604, level: 98 }, { id: 650, level: 97 }, { id: 253, level: 97 }, { id: 146, level: 96 }, { id: 683, level: 96 }] },
      { step: 4, x: 25, y: 6, type: 'dialog', name: '幻影大师', text: '（面具碎裂）不...不可能...我的幻术竟然...（化为光点消散，留下一把闪烁的钥匙）', emoji: '🔑' }
    ],
    midEvent: { enemyId: 609, name: '幻影大师' },
    outro: [
      { name: "十三", text: "（拾起钥匙）第一把次元钥匙。还需要六把才能打开通往次元霸主巢穴的大门。" },
      { name: "花生", text: "六把？！那要打六个像这样的大boss？（瘫坐在地上）我的红薯都不够吃的..." },
      { name: "暗影执行者·厌晚", text: "下一个猎场在哪？" },
      { name: "十三", text: "东方——龙脊山脉。那里的看门人据说是一头远古龙王。" },
      { name: "仙剑大侠·李逍遥", text: "龙...（眼中闪过战意）有意思。御剑术对龙族应该不差。走！" },
      { name: "系统", text: "获得【次元钥匙·幻】！（1/7）" }
    ],
    reward: { gold: 50000, items: [{id:'master_ball', count:1}] }
  },

  // ===== 异界篇·肆：龙之试炼 (Map 104) =====
  {
    chapter: 33, mapId: 104,
    title: "异界篇·肆：龙之试炼",
    objective: "攀登龙脊山脉，接受远古龙族的试炼。",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "（仰望巍峨的山脉）龙脊山脉...传说中连神仙都不敢轻易踏足的地方。" },
      { name: "花生", text: "（流口水）龙排骨...龙骨汤...不知道这里的龙好不好吃——" },
      { name: "暗影执行者·厌晚", text: "（冷眼）...在龙的地盘说这种话，你是嫌命长了？" },
      { name: "十三", text: "龙脊山脉的看门人是被次元力量腐蚀的龙王。它原本是这个世界龙族的守护者，但现在已经被黑暗吞噬。" }
    ],
    tasks: [
      { step: 0, x: 7, y: 10, type: 'battle', enemyId: 597, name: '龙脊守卫·青龙', text: '（巨大的身影从云层中俯冲而下）胆敢闯入龙域！接受试炼或者离开！', emoji: '🐉',
        eliteParty: [{ id: 597, level: 96 }, { id: 598, level: 96 }, { id: 155, level: 95 }, { id: 13, level: 95 }, { id: 544, level: 94 }] },
      { step: 1, x: 14, y: 5, type: 'dialog', name: '远古龙碑', text: '（石碑上刻着龙文）"唯有不惧龙焰、不畏龙威、以心御力者，方可踏上龙脊之巅。"', emoji: '📜' },
      { step: 2, x: 20, y: 8, type: 'battle', enemyId: 614, name: '龙脊守卫·炎龙', text: '（通体赤红的龙从岩浆中升起）第二关——龙焰试炼！能承受住我的烈焰吗？！', emoji: '🔥',
        eliteParty: [{ id: 614, level: 97 }, { id: 541, level: 96 }, { id: 13, level: 96 }, { id: 106, level: 95 }, { id: 612, level: 95 }, { id: 233, level: 94 }] },
      { step: 3, x: 24, y: 3, type: 'battle', enemyId: 622, name: '龙脊守卫·圣龙', text: '（金色巨龙俯视众人）最后的试炼——以力量证明你的资格！', emoji: '✨',
        eliteParty: [{ id: 622, level: 98 }, { id: 614, level: 97 }, { id: 599, level: 96 }, { id: 597, level: 96 }, { id: 155, level: 95 }, { id: 694, level: 95 }] }
    ],
    midEvent: { enemyId: 614, name: '龙脊守卫·炎龙' },
    outro: [
      { name: "花生", text: "（浑身冒烟）呜...差点被烤成花生米...不过话说回来，这些龙怎么还挺讲道理的？" },
      { name: "十三", text: "这些是未被腐蚀的守卫龙。真正的龙王在山巅...情况不会这么友好。" },
      { name: "仙剑大侠·李逍遥", text: "不过通过了试炼，我们获得了龙族的认可。明天登顶！" }
    ],
    reward: { gold: 40000, items: [{id:'vit_patk', count:5}] }
  },

  // ===== 异界篇·伍：龙王觉醒 (Map 104) =====
  {
    chapter: 34, mapId: 104,
    title: "异界篇·伍：龙王觉醒",
    objective: "在龙脊山巅对决被次元力量腐蚀的龙王·巴哈姆特。",
    intro: [
      { name: "十三", text: "山巅的气息...很不对。次元力量的浓度比迷宫高出数倍。" },
      { name: "暗影执行者·厌晚", text: "（手按刀柄）做好心理准备。一条被力量腐蚀的远古龙王——不比太虚真人轻松。" },
      { name: "花生", text: "（紧张地吞咽）那...那我在后面帮你们准备恢复药剂！对，后勤很重要的！" },
      { name: "仙剑大侠·李逍遥", text: "你们护住花生。我和（看向你）——我们上前线。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 6, type: 'battle', enemyId: 694, name: '腐蚀龙卫·双头', text: '（被紫黑色雾气笼罩的双头龙，发出痛苦的咆哮）', emoji: '🐲',
        eliteParty: [{ id: 694, level: 97 }, { id: 614, level: 96 }, { id: 622, level: 96 }, { id: 598, level: 95 }, { id: 544, level: 95 }] },
      { step: 1, x: 18, y: 4, type: 'dialog', name: '龙族长老（幻影）', text: '（虚弱的龙影出现）你们...通过了试炼的人类...求你们...救救龙王。那个黑暗的存在...把一块黑色的碎片嵌入了龙王的额头...那是次元力量的核心！', emoji: '🐉' },
      { step: 2, x: 22, y: 8, type: 'battle', enemyId: 614, name: '龙王·巴哈姆特 [次元腐蚀态]', text: '（山巅的巨龙睁开了布满紫色裂纹的眼睛，发出震碎岩石的咆哮）呃啊啊啊！！！（它的理智已经被吞噬，只剩下纯粹的毁灭本能）', emoji: '🐲',
        eliteParty: [{ id: 614, level: 100 }, { id: 694, level: 99 }, { id: 597, level: 98 }, { id: 622, level: 97 }, { id: 544, level: 97 }, { id: 693, level: 96 }] },
      { step: 3, x: 22, y: 6, type: 'dialog', name: '龙王·巴哈姆特', text: '（黑色碎片从额头脱落，龙王恢复了理智）...你们...打败了我？不——是救了我。谢谢你们。这是第二把次元钥匙...前方的路会更加危险。', emoji: '🐉' }
    ],
    midEvent: { enemyId: 614, name: '龙王·巴哈姆特 [次元腐蚀态]' },
    outro: [
      { name: "花生", text: "龙王大人恢复了！太好了！（小声）不过我还是不敢提吃龙肉的事..." },
      { name: "十三", text: "（审视黑色碎片的残骸）...这是次元霸主的力量碎片。他用这种方式控制每个世界的强者作为'看门人'。" },
      { name: "仙剑大侠·李逍遥", text: "看来我们不只是在收集钥匙——还是在拯救每个世界的守护者。下一站？" },
      { name: "十三", text: "深渊裂谷。那里...是我来的地方。" },
      { name: "暗影执行者·厌晚", text: "...你的世界？" },
      { name: "十三", text: "曾经是。（转身不再多说）走吧。" },
      { name: "系统", text: "获得【次元钥匙·龙】！（2/7）" }
    ],
    reward: { gold: 60000, items: [{id:'vit_pdef', count:5}] }
  },

  // ===== 异界篇·陆：深渊来客 (Map 105) =====
  {
    chapter: 35, mapId: 105,
    title: "异界篇·陆：深渊来客",
    objective: "进入深渊裂谷，在黑暗中遭遇来自管道世界的水管工——马里奥。",
    intro: [
      { name: "十三", text: "（站在裂谷边缘，表情罕见地动摇了一瞬）...这里曾经是一片花田。次元霸主把它变成了深渊。" },
      { name: "暗影执行者·厌晚", text: "你的世界？" },
      { name: "十三", text: "...第十三条法则：不要回头看。下去吧。" },
      { name: "花生", text: "（往下看了一眼，脸都白了）这...这下面黑乎乎的什么都看不见啊！有没有不用跳下去的路线？" }
    ],
    tasks: [
      { step: 0, x: 5, y: 8, type: 'battle', enemyId: 540, name: '深渊生物·暗噬虫', text: '（从裂缝中涌出的大群黑暗虫族）', emoji: '🕷️',
        eliteParty: [{ id: 540, level: 96 }, { id: 539, level: 95 }, { id: 577, level: 95 }, { id: 575, level: 94 }, { id: 574, level: 94 }] },
      { step: 1, x: 12, y: 5, type: 'dialog', name: '???', text: '（深渊深处传来一个充满活力的声音）呀吼~~~！！这里有出口吗？！我在管道里转了三天了！前面有个大蘑菇怪挡路！', emoji: '❓' },
      { step: 2, x: 18, y: 10, type: 'battle', enemyId: 576, name: '深渊巨菇·毒孢王', text: '（一个巨大的黑紫色毒蘑菇堵住了整个通道）', emoji: '🍄',
        eliteParty: [{ id: 576, level: 97 }, { id: 575, level: 96 }, { id: 574, level: 96 }, { id: 577, level: 95 }, { id: 498, level: 95 }] },
      { step: 3, x: 22, y: 6, type: 'dialog', name: '马里奥', text: '（从管道中跳出来，红帽子歪了）嘿呀！你们把大蘑菇打跑了？太谢谢了！我叫马里奥，是个水管工——修管道的时候掉进了一个奇怪的管子里，然后就到了这个黑漆漆的地方！', emoji: '🔴' },
      { step: 4, x: 24, y: 4, type: 'battle', enemyId: 544, name: '管道勇者·马里奥 [友谊切磋]', text: '（马里奥拿出自己在管道里收服的精灵，眼睛放光）嘿呀！你们用精灵战斗？太酷了！我在管道世界也收了不少小伙伴！来来来，比一场！让我看看你们到底有多强！', emoji: '🔴',
        eliteParty: [{ id: 544, level: 96 }, { id: 576, level: 95 }, { id: 573, level: 95 }, { id: 572, level: 94 }, { id: 546, level: 94 }, { id: 575, level: 93 }] },
      { step: 5, x: 26, y: 8, type: 'battle', enemyId: 608, name: '深渊猎犬·影噬', text: '（切磋刚结束，三头黑犬从深渊最深处爬上来，对着马里奥身后的管道入口狂吠）', emoji: '🐺',
        eliteParty: [{ id: 608, level: 97 }, { id: 535, level: 96 }, { id: 681, level: 96 }, { id: 697, level: 95 }, { id: 540, level: 95 }, { id: 146, level: 94 }] }
    ],
    midEvent: { enemyId: 576, name: '深渊巨菇·毒孢王' },
    outro: [
      { name: "马里奥", text: "嘿呀！输了！你比我厉害多了！在我的世界，打怪就是跳上去踩一脚——但你们的战斗方式更酷！" },
      { name: "花生", text: "（兴奋地握住马里奥的手）你也是从别的世界来的！太好了不只是我一个异乡人！你那里也有好吃的吗？" },
      { name: "马里奥", text: "蘑菇！超级蘑菇！吃了能变大！还有星星可以无敌！" },
      { name: "暗影执行者·厌晚", text: "...你们两个的世界听起来都不太正常。" },
      { name: "马里奥", text: "（对你竖大拇指）不过说真的，你的精灵太强了！以后有困难尽管找我！管道勇者马里奥，随叫随到！嘿呀！" },
      { name: "十三", text: "（嘴角微动——似乎差点笑了）...第八条法则：队友越奇怪，结局越有趣。继续深入吧。" }
    ],
    reward: { gold: 40000, items: [{id:'potion', count:8}] }
  },

  // ===== 异界篇·柒：黑暗侵蚀 (Map 105) =====
  {
    chapter: 36, mapId: 105,
    title: "异界篇·柒：黑暗侵蚀",
    objective: "深渊的黑暗力量不断侵蚀，十三的过去逐渐浮现。",
    intro: [
      { name: "十三", text: "（突然停下脚步，声音沙哑）...这个味道。是我家乡的花——尽管已经枯萎了。" },
      { name: "仙剑大侠·李逍遥", text: "十三...这里到底发生了什么？" },
      { name: "十三", text: "...我的世界被次元霸主选为第一个'猎场'。他用次元力量把整个世界撕裂...只有我活了下来。因为我被裂隙吸入了迷宫。" },
      { name: "马里奥", text: "（收起平日的笑容，难得地严肃）...那我们更要打败那个次元霸主了。为了你，也为了所有的世界！嘿呀，冲啊！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 4, type: 'battle', enemyId: 697, name: '深渊之影·记忆残骸', text: '（十三世界的残余记忆化为实体——曾经的邻居、朋友，现在只是空壳）', emoji: '💀',
        eliteParty: [{ id: 697, level: 97 }, { id: 699, level: 96 }, { id: 609, level: 96 }, { id: 535, level: 95 }, { id: 146, level: 95 }] },
      { step: 1, x: 14, y: 9, type: 'dialog', name: '十三', text: '（面对曾经熟悉的人变成的怪物，声音终于颤抖了）...第二条法则：不要对敌人产生感情。（闭上眼）对不起...让你们安息吧。', emoji: '🗡️' },
      { step: 2, x: 20, y: 6, type: 'battle', enemyId: 699, name: '深渊回声·世界残响', text: '（十三毁灭的世界发出最后的回声——是痛苦，也是恳求）', emoji: '🌑',
        eliteParty: [{ id: 699, level: 98 }, { id: 697, level: 97 }, { id: 608, level: 96 }, { id: 681, level: 96 }, { id: 540, level: 95 }, { id: 130, level: 95 }] },
      { step: 3, x: 24, y: 4, type: 'dialog', name: '花生', text: '（红着眼眶，把自己最后一个红薯递给十三）十三...吃点东西吧。我知道...我知道吃东西解决不了问题，但至少不要饿着肚子难过。', emoji: '🍠' }
    ],
    midEvent: { enemyId: 699, name: '深渊回声·世界残响' },
    outro: [
      { name: "十三", text: "（接过红薯，沉默了很久）...谢谢。（咬了一口）...很甜。" },
      { name: "暗影执行者·厌晚", text: "（靠在石壁上，看了十三一眼）...我明白那种感觉。失去一切之后，活着本身就是复仇。" },
      { name: "十三", text: "...第九条法则：债要亲手来讨。次元霸主欠我的——我会加倍奉还。" },
      { name: "仙剑大侠·李逍遥", text: "我们所有人都站在你这边，十三。（拍拍他的肩）前面就是深渊之王了。一起结束这个世界的痛苦。" }
    ],
    reward: { gold: 45000, items: [{id:'revive', count:5}] }
  },

  // ===== 异界篇·捌：深渊领主 (Map 105) =====
  {
    chapter: 37, mapId: 105,
    title: "异界篇·捌：深渊领主",
    objective: "在深渊最底层对决深渊之王，为十三的世界讨回公道。",
    intro: [
      { name: "十三", text: "（抽出短刀）...到了。深渊的最底层。" },
      { name: "马里奥", text: "嘿呀！这是最后一关了！大家打起精神！" },
      { name: "仙剑大侠·李逍遥", text: "（御剑悬浮）各位，注意编队。我和厌晚正面突破，十三和马里奥侧翼包抄，花生负责后勤，你（看向主角）——是主攻。" },
      { name: "暗影执行者·厌晚", text: "第一次听你指挥...不过这次就配合一下。" }
    ],
    tasks: [
      { step: 0, x: 8, y: 8, type: 'battle', enemyId: 681, name: '深渊将军·暗牙', text: '深渊之王不允许任何人靠近！退回去！否则——死！', emoji: '⚔️',
        eliteParty: [{ id: 681, level: 98 }, { id: 608, level: 97 }, { id: 540, level: 96 }, { id: 697, level: 96 }, { id: 535, level: 95 }, { id: 146, level: 95 }] },
      { step: 1, x: 15, y: 5, type: 'battle', enemyId: 697, name: '深渊将军·黑翼', text: '嘿嘿嘿...能打败暗牙？那试试我的力量！', emoji: '🦇',
        eliteParty: [{ id: 697, level: 98 }, { id: 699, level: 97 }, { id: 609, level: 97 }, { id: 681, level: 96 }, { id: 608, level: 96 }, { id: 540, level: 95 }] },
      { step: 2, x: 20, y: 8, type: 'battle', enemyId: 608, name: '深渊之王', text: '（从无底深渊的最底层缓缓升起的巨大身影）可笑的人类...你们以为打败两个手下就能挑战我？在这个深渊中，我就是绝对的黑暗！', emoji: '👑',
        eliteParty: [{ id: 608, level: 100 }, { id: 697, level: 99 }, { id: 699, level: 98 }, { id: 681, level: 97 }, { id: 609, level: 97 }, { id: 540, level: 96 }] },
      { step: 3, x: 22, y: 6, type: 'dialog', name: '十三', text: '（将短刀刺入深渊之王的次元碎片）...第十三条法则的续篇：变数被清除后——就轮到你了。这是为我的世界。', emoji: '🗡️' }
    ],
    midEvent: { enemyId: 608, name: '深渊之王' },
    outro: [
      { name: "十三", text: "（握着第三把钥匙，仰望裂谷上方的天空——十三的世界虽然无法复原，但深渊的黑暗终于被驱散了）...走吧。还有四把钥匙。" },
      { name: "花生", text: "（擦擦眼泪）十三...你笑了！你刚才笑了对不对？" },
      { name: "十三", text: "...你看错了。（但嘴角的弧度没有完全消失）" },
      { name: "马里奥", text: "嘿呀！三把了！照这个速度，很快就能收集齐了！下一站是哪里？" },
      { name: "仙剑大侠·李逍遥", text: "星落平原。那里的情报说——有一个沉默的剑客在独自对抗次元侵蚀。" },
      { name: "系统", text: "获得【次元钥匙·渊】！（3/7）" }
    ],
    reward: { gold: 70000, items: [{id:'vit_satk', count:5}] }
  },

  // ===== 异界篇·玖：星辰陨落 (Map 106) =====
  {
    chapter: 38, mapId: 106,
    title: "异界篇·玖：星辰陨落",
    objective: "在星落平原遭遇沉默的传说剑客——林克。",
    intro: [
      { name: "花生", text: "（仰望星空）哇！这里好美啊！流星好多！地上的坑都是陨石砸出来的吗？" },
      { name: "暗影执行者·厌晚", text: "不是普通的陨石——是凝固的次元能量坠落形成的。踩上去可能直接被传送到别的空间。小心脚下。" },
      { name: "马里奥", text: "传送？像管道一样？那我擅长！" },
      { name: "十三", text: "（抬手示意噤声）...前方有战斗的痕迹。很新鲜。而且——只有一个人。" }
    ],
    tasks: [
      { step: 0, x: 6, y: 6, type: 'battle', enemyId: 607, name: '星辰侵蚀体·流星兽', text: '（从陨石坑中爬出的次元生物，浑身覆盖着星辰碎片）', emoji: '☄️',
        eliteParty: [{ id: 607, level: 97 }, { id: 605, level: 96 }, { id: 253, level: 96 }, { id: 221, level: 95 }, { id: 150, level: 95 }] },
      { step: 1, x: 14, y: 4, type: 'dialog', name: '???', text: '（一个身穿绿衣、背负大盾和长剑的青年站在陨石坑边。他没有说话，只是默默地看着你们，目光如剑般锐利。他的剑上还残留着刚斩杀次元生物的痕迹。）', emoji: '🗡️' },
      { step: 2, x: 18, y: 8, type: 'battle', enemyId: 696, name: '林克 [战意试探]', text: '（绿衣剑客抽出了大师之剑，不是敌意——而是要用剑来确认你的实力。他的眼神说：证明给我看。）', emoji: '⚔️',
        eliteParty: [{ id: 696, level: 98 }, { id: 607, level: 97 }, { id: 662, level: 96 }, { id: 614, level: 96 }, { id: 622, level: 95 }, { id: 683, level: 95 }] },
      { step: 3, x: 22, y: 6, type: 'dialog', name: '林克', text: '...（收剑入鞘，点了点头。这是他的语言——沉默本身就是认可。他从怀中取出一块星辰碎片，递给你们。）', emoji: '🗡️' },
      { step: 4, x: 25, y: 10, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（看向林克）...一个字不说就认可了？哈哈，这种人我喜欢。不像某些话痨。（看了花生一眼）' }
    ],
    midEvent: { enemyId: 696, name: '林克 [战意试探]' },
    outro: [
      { name: "花生", text: "他到底会不会说话啊？嘿！林克！你喜欢吃什么？" },
      { name: "林克", text: "...（掏出一个苹果递给花生。）" },
      { name: "花生", text: "（接过苹果，眼睛亮了）哦！谢谢！虽然你不说话，但你人真好！" },
      { name: "十三", text: "他的剑术...很强。一个人在这里对抗次元生物不知多久了。第四条法则：无声者最危险。林克——你也在追踪次元霸主？" },
      { name: "林克", text: "...（郑重地点头。）" },
      { name: "暗影执行者·厌晚", text: "...我忽然觉得这个队伍越来越有意思了。一个话痨、一个杀手、一个水管工、一个哑巴。" },
      { name: "马里奥", text: "还有你——闷骚大姐！嘿呀！" },
      { name: "暗影执行者·厌晚", text: "...叫谁大姐？（拔刀）" }
    ],
    reward: { gold: 45000, items: [{id:'revive', count:3}] }
  },

  // ===== 异界篇·拾：七星集结 (Map 106) =====
  {
    chapter: 39, mapId: 106,
    title: "异界篇·拾：七星集结",
    objective: "激活星落平原上的七座星辰柱，解封星辰守护者的封印。",
    intro: [
      { name: "十三", text: "根据星辰碎片上的信息，这片平原有七座星辰柱。激活它们可以解除看门人的封印——但同时也会引来大量次元生物。" },
      { name: "仙剑大侠·李逍遥", text: "分头行动。我和厌晚去东面三座，十三和马里奥去西面两座，你（指向主角）带着花生和林克去中央两座。" },
      { name: "花生", text: "（紧紧抱住背包）好的队长！虽然我不太能打，但我会尽力的！" },
      { name: "林克", text: "...（拔剑，走向前方——用行动表示同意。）" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 563, name: '星辰柱守卫·第一柱', text: '（星辰柱被触碰的瞬间，守卫从地下涌出）', emoji: '⭐',
        eliteParty: [{ id: 563, level: 97 }, { id: 560, level: 96 }, { id: 559, level: 96 }, { id: 500, level: 95 }, { id: 189, level: 95 }] },
      { step: 1, x: 15, y: 8, type: 'battle', enemyId: 693, name: '星辰柱守卫·第二柱', text: '（第二座星辰柱发出刺眼的光芒，更强大的守卫出现了）', emoji: '⭐',
        eliteParty: [{ id: 693, level: 98 }, { id: 607, level: 97 }, { id: 605, level: 96 }, { id: 692, level: 96 }, { id: 563, level: 95 }, { id: 253, level: 95 }] },
      { step: 2, x: 22, y: 4, type: 'dialog', name: '花生', text: '（虚弱地坐在地上但努力举着发光棒）各...各组注意！七座全部激活了！中央在汇聚巨大的能量！', emoji: '✨' },
      { step: 3, x: 25, y: 8, type: 'battle', enemyId: 695, name: '星辰核心·觉醒', text: '（七座星辰柱的能量汇聚，一个巨大的星辰生命体从地下升起——它是守护封印的最后防线）', emoji: '💫',
        eliteParty: [{ id: 695, level: 99 }, { id: 693, level: 98 }, { id: 607, level: 97 }, { id: 696, level: 97 }, { id: 605, level: 96 }, { id: 692, level: 96 }] }
    ],
    midEvent: { enemyId: 695, name: '星辰核心·觉醒' },
    outro: [
      { name: "仙剑大侠·李逍遥", text: "（全身是伤但笑容满面）东面...搞定了。你们呢？" },
      { name: "暗影执行者·厌晚", text: "（从暗影中走出，衣角有焦痕）废话。" },
      { name: "马里奥", text: "（从管道中弹出来）嘿呀！西面也解决了！十三超厉害的，两刀解决一座！" },
      { name: "十三", text: "三刀。（纠正）" },
      { name: "林克", text: "...（举起大师之剑指向天空——封印被解除了。一道光柱直冲云霄。）" }
    ],
    reward: { gold: 50000, items: [{id:'vit_sdef', count:5}] }
  },

  // ===== 异界篇·拾壹：星辰守护者 (Map 106) =====
  {
    chapter: 40, mapId: 106,
    title: "异界篇·拾壹：星辰守护者",
    objective: "对决被次元力量腐蚀的星辰守护者，获取第四把次元钥匙。",
    intro: [
      { name: "十三", text: "封印解除了...星辰守护者出现了。但和龙王一样——它也被腐蚀了。" },
      { name: "马里奥", text: "那就和打龙王一样！先把它打清醒，然后拔掉黑色碎片！嘿呀！" },
      { name: "林克", text: "...（紧握大师之剑——他的剑在发出微弱的光芒，似乎在感应星辰的力量。）" }
    ],
    tasks: [
      { step: 0, x: 10, y: 6, type: 'battle', enemyId: 605, name: '星辰碎片·左翼', text: '（星辰守护者的碎片化身，疯狂地攻击一切靠近的生物）', emoji: '💥',
        eliteParty: [{ id: 605, level: 98 }, { id: 607, level: 97 }, { id: 693, level: 97 }, { id: 253, level: 96 }, { id: 692, level: 96 }] },
      { step: 1, x: 18, y: 8, type: 'battle', enemyId: 606, name: '星辰碎片·右翼', text: '（另一半碎片守卫从侧面包围了队伍）', emoji: '💥',
        eliteParty: [{ id: 606, level: 98 }, { id: 605, level: 97 }, { id: 610, level: 97 }, { id: 695, level: 96 }, { id: 691, level: 96 }] },
      { step: 2, x: 15, y: 4, type: 'battle', enemyId: 607, name: '星辰守护者 [次元腐蚀态]', text: '（庞大的星辰生命体发出悲鸣——紫黑色的次元裂纹遍布全身）救...救我...不...毁灭一切！！！', emoji: '🌟',
        eliteParty: [{ id: 607, level: 100 }, { id: 605, level: 99 }, { id: 693, level: 98 }, { id: 696, level: 98 }, { id: 695, level: 97 }, { id: 610, level: 97 }] },
      { step: 3, x: 15, y: 6, type: 'dialog', name: '星辰守护者', text: '（次元碎片被拔除，守护者恢复了意识）...谢谢你们。我守护这片星辰已经千年...第四把钥匙，请收好。前方的路...比星空更深邃。', emoji: '🌟' }
    ],
    midEvent: { enemyId: 607, name: '星辰守护者 [次元腐蚀态]' },
    outro: [
      { name: "花生", text: "四把了！过半了！照这个速度——" },
      { name: "十三", text: "不要掉以轻心。第六条法则：越接近终点，陷阱越密。后面的看门人会更强。" },
      { name: "林克", text: "...（他的剑吸收了星辰守护者的部分力量，发出了更强烈的光芒。他看向前方——彩虹之桥的方向。）" },
      { name: "仙剑大侠·李逍遥", text: "彩虹之桥...传说中连接所有世界的通道。走吧，我们离真相越来越近了。" },
      { name: "系统", text: "获得【次元钥匙·星】！（4/7）" }
    ],
    reward: { gold: 70000, balls: { master: 2 } }
  },

  // ===== 异界篇·拾贰：世界之桥 (Map 107) =====
  {
    chapter: 41, mapId: 107,
    title: "异界篇·拾贰：世界之桥",
    objective: "踏上连接万界的彩虹之桥，见证不同世界的交汇。",
    intro: [
      { name: "花生", text: "（目瞪口呆）天...天哪...这就是彩虹之桥？好美啊！七种颜色的光组成了一座桥！" },
      { name: "暗影执行者·厌晚", text: "...确实壮观。（说完似乎后悔暴露了感情）不过——桥上的气息很复杂。多个世界的能量在这里交汇。" },
      { name: "十三", text: "这就是次元霸主的真正目标——彩虹之桥。控制了它，就等于控制了所有世界之间的通道。" },
      { name: "马里奥", text: "就像控制了所有的管道！这可不行！管道应该是大家共享的！嘿呀，冲啊！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 6, type: 'battle', enemyId: 662, name: '彩虹卫兵·赤', text: '（红色光芒凝聚成的战士）这座桥不欢迎入侵者！', emoji: '🔴',
        eliteParty: [{ id: 662, level: 97 }, { id: 544, level: 96 }, { id: 106, level: 96 }, { id: 614, level: 95 }, { id: 693, level: 95 }] },
      { step: 1, x: 12, y: 4, type: 'battle', enemyId: 642, name: '彩虹卫兵·翠', text: '赤已经倒下了？不可能！我来！', emoji: '🟢',
        eliteParty: [{ id: 642, level: 97 }, { id: 555, level: 96 }, { id: 641, level: 96 }, { id: 575, level: 95 }, { id: 640, level: 95 }] },
      { step: 2, x: 18, y: 8, type: 'battle', enemyId: 634, name: '彩虹卫兵·蓝', text: '你们的力量不足以跨越这座桥！', emoji: '🔵',
        eliteParty: [{ id: 634, level: 98 }, { id: 633, level: 97 }, { id: 646, level: 97 }, { id: 631, level: 96 }, { id: 552, level: 96 }] },
      { step: 3, x: 24, y: 6, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（抬头看桥中央）...桥的另一端有一个巨大的身影。那就是这座桥的看门人？' ,emoji: '⚔️' },
      { step: 4, x: 26, y: 10, type: 'battle', enemyId: 666, name: '彩虹卫兵·金', text: '（最强的彩虹卫兵，周身散发着七色光芒）三个卫兵不够？那就由我——七色守卫之首来亲自阻止你们！', emoji: '🟡',
        eliteParty: [{ id: 666, level: 99 }, { id: 662, level: 98 }, { id: 642, level: 97 }, { id: 634, level: 97 }, { id: 622, level: 96 }, { id: 614, level: 96 }] }
    ],
    midEvent: { enemyId: 666, name: '彩虹卫兵·金' },
    outro: [
      { name: "花生", text: "四个卫兵全打完了！前面就是boss了吧？" },
      { name: "十三", text: "...但这些卫兵的实力比前几个世界的守卫强得多。桥的主人一定更加恐怖。" },
      { name: "林克", text: "...（指向桥的中央——那里有一道巨大的光之门。大师之剑在震动。）" }
    ],
    reward: { gold: 55000, items: [{id:'vit_hp', count:5}] }
  },

  // ===== 异界篇·拾叁：次元风暴 (Map 107) =====
  {
    chapter: 42, mapId: 107,
    title: "异界篇·拾叁：次元风暴",
    objective: "彩虹之桥上的次元风暴愈演愈烈，队伍在风暴中艰难前进。",
    intro: [
      { name: "十三", text: "次元风暴在加剧。次元霸主知道我们来了——他在试图摧毁彩虹之桥。" },
      { name: "马里奥", text: "（在风暴中努力站稳）嘿呀！风好大！但是马里奥从来不怕风！在我的世界，风能让我飞得更高！" },
      { name: "暗影执行者·厌晚", text: "...如果桥被毁了，我们怎么到次元霸主的巢穴？" },
      { name: "十三", text: "到不了。所以我们必须在桥断之前通过——并且打败看门人。" },
      { name: "仙剑大侠·李逍遥", text: "那还等什么？全速前进！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 700, name: '次元风暴·实体化', text: '（风暴本身凝聚成了巨大的次元生物！）', emoji: '🌪️',
        eliteParty: [{ id: 700, level: 98 }, { id: 694, level: 97 }, { id: 695, level: 97 }, { id: 693, level: 96 }, { id: 696, level: 96 }] },
      { step: 1, x: 14, y: 4, type: 'dialog', name: '次元霸主（声音）', text: '（从风暴中传来冰冷的声音）...有意思。你们居然走到了这里。但你们不明白——你们越接近我，我就越能感受到你们的力量。而你们的力量...正是我最后需要的食粮。', emoji: '⚫' },
      { step: 2, x: 18, y: 8, type: 'dialog', name: '花生', text: '（被风暴刮得东倒西歪但死死抱住一根柱子）大...大家别管我！先冲过去！我...我撑得住！', emoji: '🥜' },
      { step: 3, x: 18, y: 8, type: 'dialog', name: '林克', text: '（二话不说背起花生，一手持剑劈开风暴，一手稳稳地托住花生。沉默中的温柔——比任何语言都有力。）', emoji: '🗡️' },
      { step: 4, x: 20, y: 5, type: 'dialog', name: '花生', text: '（红着脸从林克背上下来。突然，一群次元生物从身后包围过来，其他人都在前方，只有花生和一堆即将孵化的精灵蛋在此处）不...不行！大家的补给都在我这里！如果被抢走了...大家就没法恢复了！', emoji: '🥜' },
      { step: 5, x: 22, y: 6, type: 'battle', enemyId: 456, name: '美食大陆厨师·花生 [觉醒]', text: '（花生紧握着锅铲，眼中闪烁着前所未有的光芒）我...我不是只会做饭的拖油瓶！在美食大陆，厨师也是战士！食材要自己去猎——这是厨师的骄傲！来吧！今天让你们尝尝花生的实力！', emoji: '🥜',
        eliteParty: [{ id: 456, level: 95 }, { id: 553, level: 94 }, { id: 576, level: 94 }, { id: 574, level: 93 }, { id: 575, level: 93 }, { id: 546, level: 92 }] },
      { step: 6, x: 24, y: 8, type: 'battle', enemyId: 694, name: '次元风暴·核心体', text: '（花生独自击退包围后，风暴的核心——一个扭曲的次元裂隙出现，试图吞噬一切）', emoji: '🌀',
        eliteParty: [{ id: 694, level: 99 }, { id: 700, level: 98 }, { id: 695, level: 98 }, { id: 698, level: 97 }, { id: 607, level: 97 }, { id: 696, level: 96 }] }
    ],
    midEvent: { enemyId: 694, name: '次元风暴·核心体' },
    outro: [
      { name: "十三", text: "（回头看到花生身后一地的次元生物残骸，罕见地瞪大了眼）...你...一个人打的？" },
      { name: "花生", text: "（气喘吁吁但骄傲地叉腰）哼哼！别小看美食大陆的厨师！在我们那里，食材可是要从龙嘴里抢的！我只是...一直觉得你们太强了，不需要我而已。" },
      { name: "马里奥", text: "嘿呀！花生好厉害！原来你一直在藏实力！" },
      { name: "花生", text: "（不好意思地挠头）没...没有藏啦...就是之前的敌人都太恐怖了。但是——如果是为了保护大家的补给和后方，厨师的骄傲不允许我退缩！" },
      { name: "林克", text: "...（郑重地向花生点头——这是剑客对战士的敬意。）" },
      { name: "暗影执行者·厌晚", text: "...不赖嘛，厨子。（嘴角微翘）看来这个队伍没有一个废物。" },
      { name: "十三", text: "...前方就是虹之使者——彩虹之桥最强的看门人。花生，你也上前线。" },
      { name: "花生", text: "（眼眶微红，用力点头）嗯！" }
    ],
    reward: { gold: 55000, items: [{id:'potion', count:10}] }
  },

  // ===== 异界篇·拾肆：桥之守卫 (Map 107) =====
  {
    chapter: 43, mapId: 107,
    title: "异界篇·拾肆：桥之守卫",
    objective: "在崩塌的彩虹之桥上对决虹之使者，获取第五把次元钥匙。",
    intro: [
      { name: "仙剑大侠·李逍遥", text: "桥在崩塌！我们必须在桥断之前解决战斗！" },
      { name: "暗影执行者·厌晚", text: "（看向前方的巨大光影）...那家伙身上同时有七种属性的力量。棘手。" },
      { name: "马里奥", text: "七种属性？那就让我们七个人——每人对付一种！嘿呀！完美的对策！" },
      { name: "十三", text: "...我们只有六个人。主角带着精灵是七个。（思考）确实可行。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 6, type: 'battle', enemyId: 696, name: '虹之使者 [次元腐蚀态]', text: '（桥的中央，一个身披七色铠甲的巨大身影。紫黑色的裂纹从它的心口蔓延到全身）我...是彩虹之桥的...守卫...不...毁灭...守护...矛盾...痛苦...让一切在七色之光中消逝吧！！！', emoji: '🌈',
        eliteParty: [{ id: 696, level: 100 }, { id: 700, level: 99 }, { id: 694, level: 98 }, { id: 695, level: 98 }, { id: 693, level: 97 }, { id: 692, level: 97 }] },
      { step: 1, x: 15, y: 4, type: 'dialog', name: '虹之使者', text: '（次元碎片脱落，七色铠甲恢复了光泽）...你们...你们太强了。谢谢你们解放了我。第五把钥匙...拿去吧。但是——次元霸主比你们想象的更强大。他已经吞噬了无数个世界的力量。', emoji: '🌈' },
      { step: 2, x: 20, y: 8, type: 'dialog', name: '虹之使者', text: '最后两把钥匙在机械世界和创世神殿。去吧...我会用最后的力量维持彩虹之桥。但...时间不多了。', emoji: '🌈' }
    ],
    midEvent: { enemyId: 696, name: '虹之使者 [次元腐蚀态]' },
    outro: [
      { name: "十三", text: "五把了。还差两把。（握紧短刀）...越来越近了。" },
      { name: "花生", text: "（坐在桥边吃最后一个便当，看着远方）大家...我有种感觉。这次冒险的最后...我们可能要面对很可怕的东西。" },
      { name: "马里奥", text: "可怕的东西？我打过的大boss多了去了！大蘑菇、大乌龟、大鬼——每次都是嘿呀一跳就解决了！" },
      { name: "暗影执行者·厌晚", text: "...这次可跳不了。（但嘴角微翘）不过——能走到这里的队伍，应该不会输。" },
      { name: "仙剑大侠·李逍遥", text: "说得对。目标——机械王座！出发！" },
      { name: "系统", text: "获得【次元钥匙·虹】！（5/7）" }
    ],
    reward: { gold: 80000, items: [{id:'vit_patk', count:5}, {id:'vit_satk', count:5}] }
  },

  // ===== 异界篇·拾伍：机械遗迹 (Map 108) =====
  {
    chapter: 44, mapId: 108,
    title: "异界篇·拾伍：机械遗迹",
    objective: "探索失落机械文明的核心区域，解除自律兵器的防御系统。",
    intro: [
      { name: "马里奥", text: "（东张西望）哇！好多机器！像我们世界的工厂一样！但是更高级！" },
      { name: "十三", text: "这是一个已经灭亡的机械文明遗迹。他们的自律兵器仍在按照最后的命令运转——消灭所有入侵者。" },
      { name: "暗影执行者·厌晚", text: "没有感情的机器...只需要找到控制核心，关掉它们就行。" },
      { name: "花生", text: "（对着一个小型机器人挥手）嘿！你好啊！...啊它射我！它射我了！" }
    ],
    tasks: [
      { step: 0, x: 6, y: 8, type: 'battle', enemyId: 600, name: '自律兵器·MK-I', text: '【警告】侵入者检测。启动歼灭程序。', emoji: '🤖',
        eliteParty: [{ id: 600, level: 97 }, { id: 598, level: 96 }, { id: 524, level: 96 }, { id: 525, level: 95 }, { id: 562, level: 95 }] },
      { step: 1, x: 12, y: 4, type: 'battle', enemyId: 698, name: '自律兵器·MK-II', text: '【升级】MK-I被摧毁。启动MK-II战斗协议。火力全开。', emoji: '🤖',
        eliteParty: [{ id: 698, level: 98 }, { id: 600, level: 97 }, { id: 686, level: 96 }, { id: 563, level: 96 }, { id: 599, level: 95 }, { id: 692, level: 95 }] },
      { step: 2, x: 18, y: 6, type: 'dialog', name: '古代终端', text: '（终端闪烁着微弱的光芒）"最终指令...守护...核心...不惜一切...代价..."（一段千年前的录像：一个孩子对着镜头微笑）"爸爸妈妈，这是我做的机器人！它会永远保护我们的家！"', emoji: '💻' },
      { step: 3, x: 24, y: 10, type: 'battle', enemyId: 692, name: '自律兵器·MK-III「终极防线」', text: '【最终协议】核心区域遭到入侵。启动终极防御系统。为了...守护...为了...', emoji: '🤖',
        eliteParty: [{ id: 692, level: 99 }, { id: 698, level: 98 }, { id: 600, level: 97 }, { id: 695, level: 97 }, { id: 686, level: 96 }, { id: 563, level: 96 }] }
    ],
    midEvent: { enemyId: 698, name: '自律兵器·MK-II' },
    outro: [
      { name: "花生", text: "（看着那段录像，眼眶湿润了）...那个小孩的机器人还在守护着他的家...已经过了不知道多少年了..." },
      { name: "十三", text: "...守护。即使文明毁灭了，承诺依然在执行。（沉默了很久）...值得敬佩。" },
      { name: "马里奥", text: "（难得地安静了一会）...我在想，如果有一天我的世界也变成这样...不，不会的！因为有我在！嘿呀！" },
      { name: "仙剑大侠·李逍遥", text: "机械帝王——这里最后的看门人。它应该就在核心深处。" }
    ],
    reward: { gold: 60000, items: [{id:'vit_pdef', count:5}, {id:'vit_sdef', count:5}] }
  },

  // ===== 异界篇·拾陆：机械帝王 (Map 108) =====
  {
    chapter: 45, mapId: 108,
    title: "异界篇·拾陆：机械帝王",
    objective: "对决机械文明最强的自律兵器——机械帝王，获取第六把次元钥匙。",
    intro: [
      { name: "十三", text: "核心区域。机械帝王是这个文明最后的杰作——一台融合了次元力量的超级兵器。" },
      { name: "暗影执行者·厌晚", text: "又是被腐蚀的守护者...次元霸主的手段总是一样。" },
      { name: "花生", text: "（鼓起勇气）这次我也要上！虽然我不太会打架，但我可以用我的便当给精灵加buff！" },
      { name: "林克", text: "...（把一块星辰碎片嵌入花生的背包——为它附上了防护效果。无声的关怀。）" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 686, name: '核心防御系统·外壳', text: '【紧急】核心受到威胁。展开最终防护层。', emoji: '🛡️',
        eliteParty: [{ id: 686, level: 98 }, { id: 692, level: 97 }, { id: 698, level: 97 }, { id: 600, level: 96 }, { id: 525, level: 96 }] },
      { step: 1, x: 15, y: 4, type: 'battle', enemyId: 600, name: '机械帝王 [次元融合态]', text: '（核心中缓缓站起的巨型机械体，眼中闪烁着紫色的次元之光）【错误】...系统异常...守护目标已不存在...新指令接收...「吞噬一切」...执行。', emoji: '⚙️',
        eliteParty: [{ id: 600, level: 100 }, { id: 698, level: 99 }, { id: 692, level: 98 }, { id: 695, level: 98 }, { id: 686, level: 97 }, { id: 563, level: 97 }] },
      { step: 2, x: 20, y: 8, type: 'dialog', name: '机械帝王', text: '（次元碎片被摧毁，机械帝王缓缓跪下）...「原始指令恢复」...守护...完成。文明虽灭...承诺不灭。第六把钥匙...交给你们。去...终结这一切。', emoji: '⚙️' }
    ],
    midEvent: { enemyId: 600, name: '机械帝王 [次元融合态]' },
    outro: [
      { name: "花生", text: "六把了！就差最后一把！次元霸主！等着我们！" },
      { name: "十三", text: "...最后一把钥匙在创世神殿——据说是万界之源，一切世界诞生的地方。次元霸主就在那里。" },
      { name: "暗影执行者·厌晚", text: "...最终决战。（检查刀刃）磨了这么久，该用了。" },
      { name: "仙剑大侠·李逍遥", text: "各位——一路走到这里，我们从陌生人变成了战友。不管接下来面对什么——我们一起。" },
      { name: "马里奥", text: "一起！嘿呀！" },
      { name: "花生", text: "一起！" },
      { name: "十三", text: "...一起。" },
      { name: "林克", text: "...（举起大师之剑——剑尖闪烁着七色光芒。这是他的回答。）" },
      { name: "系统", text: "获得【次元钥匙·械】！（6/7）目标：创世神殿！" }
    ],
    reward: { gold: 80000, balls: { master: 3 } }
  },

  // ===== 异界篇·拾柒：众神黄昏 (Map 109) =====
  {
    chapter: 46, mapId: 109,
    title: "异界篇·拾柒：众神黄昏",
    objective: "进入创世神殿，穿越次元霸主的最终防线，为最终决战做准备。",
    intro: [
      { name: "十三", text: "（凝视神殿大门）...创世神殿。万界之源。次元霸主在这里等了我们很久了。" },
      { name: "仙剑大侠·李逍遥", text: "（御剑悬浮，白衣猎猎）大家听好——进去之后就没有退路了。做好最坏的打算。" },
      { name: "暗影执行者·厌晚", text: "最坏的打算？从踏入幻境迷宫的那一刻起，我就没打算活着回来。" },
      { name: "花生", text: "（紧张地吞咽，但眼中有着坚定的光）...我虽然只是个厨子，但...我不会拖后腿的。" },
      { name: "马里奥", text: "嘿呀！最后一战了！不管对面是什么——打就对了！" },
      { name: "林克", text: "...（拔出大师之剑——剑身闪耀着六把次元钥匙的光芒。他已经准备好了。）" },
      { name: "十三", text: "第十条法则：在最后的战场上，没有法则。只有...活下来。走吧。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 8, type: 'battle', enemyId: 694, name: '创世守卫·混沌', text: '（神殿第一道门前的守卫——混沌的化身）万界之源不容亵渎！', emoji: '🌑',
        eliteParty: [{ id: 694, level: 99 }, { id: 700, level: 98 }, { id: 696, level: 98 }, { id: 695, level: 97 }, { id: 693, level: 97 }, { id: 692, level: 96 }] },
      { step: 1, x: 12, y: 4, type: 'battle', enemyId: 340, name: '创世守卫·秩序', text: '混沌已败...但秩序不灭！世界的法则在我手中！', emoji: '✨',
        eliteParty: [{ id: 340, level: 99 }, { id: 339, level: 98 }, { id: 338, level: 98 }, { id: 337, level: 97 }, { id: 336, level: 97 }, { id: 335, level: 96 }] },
      { step: 2, x: 18, y: 6, type: 'battle', enemyId: 263, name: '创世守卫·终焉', text: '（最后的守卫——终焉之力的化身）你们已经走到了世界的尽头。前方只有虚无。', emoji: '💀',
        eliteParty: [{ id: 263, level: 100 }, { id: 262, level: 99 }, { id: 261, level: 98 }, { id: 260, level: 98 }, { id: 259, level: 97 }, { id: 258, level: 97 }] },
      { step: 3, x: 22, y: 8, type: 'dialog', name: '次元霸主（投影）', text: '（巨大的投影从神殿核心出现）...欢迎来到创世神殿。你们比我预想的更快。六把钥匙已经到手...但第七把——就在我的心脏里。想要？来拿。', emoji: '⚫' },
      { step: 4, x: 15, y: 5, type: 'dialog', name: '十三', text: '（紧握短刀）...等一下。在面对次元霸主之前——我要和你（看向主角）再打一场。第十一条法则：最终决战之前，先确认同伴的极限。', emoji: '🗡️' },
      { step: 5, x: 18, y: 6, type: 'battle', enemyId: 681, name: '暗影刺客·十三 [全力以赴]', text: '（十三拔出双刀，眼中不再有初见时的冷漠，而是战友之间的炙热信任）第十三条法则的真正含义——不是消灭变数，而是相信变数能改变结局。你就是那个变数。来！让我看看你最强的样子！', emoji: '🗡️',
        eliteParty: [{ id: 681, level: 100 }, { id: 608, level: 99 }, { id: 540, level: 98 }, { id: 697, level: 98 }, { id: 699, level: 97 }, { id: 535, level: 97 }] },
      { step: 6, x: 20, y: 4, type: 'battle', enemyId: 544, name: '管道勇者·马里奥 [超级模式]', text: '（马里奥戴上发光的红帽子，浑身散发着星光）嘿呀！十三打完了？轮到我了！在我的世界，打最终boss之前要先吃一个超级蘑菇！但在这个世界——先和最强的朋友打一架才是最好的准备！嘿呀！全力以赴！', emoji: '🔴',
        eliteParty: [{ id: 544, level: 99 }, { id: 576, level: 98 }, { id: 546, level: 98 }, { id: 573, level: 97 }, { id: 572, level: 97 }, { id: 614, level: 96 }] },
      { step: 7, x: 22, y: 8, type: 'battle', enemyId: 456, name: '美食大陆战厨·花生 [料理之魂]', text: '（花生取出全套厨具——锅铲在手中旋转如剑，围裙在风中猎猎作响）我...我也要打！不是因为我觉得自己最强，而是——我想让你记住，在最后的战场上，你的身后有一个会为你做便当的厨师。厨师的骄傲！让你看看美食大陆最强料理人的实力！', emoji: '🥜',
        eliteParty: [{ id: 456, level: 98 }, { id: 553, level: 97 }, { id: 576, level: 97 }, { id: 574, level: 96 }, { id: 642, level: 96 }, { id: 575, level: 95 }] },
      { step: 8, x: 25, y: 6, type: 'battle', enemyId: 696, name: '传说剑客·林克 [大师之剑·觉醒]', text: '（林克缓缓拔出大师之剑——六把次元钥匙的力量在剑身上汇聚，光芒照亮了整个神殿。他没有说话，但他的眼神比任何语言都要清晰：这是剑客之间最高的敬意。让我们用剑来交流。）', emoji: '⚔️',
        eliteParty: [{ id: 696, level: 100 }, { id: 607, level: 99 }, { id: 662, level: 98 }, { id: 614, level: 98 }, { id: 622, level: 97 }, { id: 683, level: 97 }] }
    ],
    midEvent: { enemyId: 263, name: '创世守卫·终焉' },
    outro: [
      { name: "十三", text: "（收刀入鞘，嘴角露出罕见的笑容）...比我预想的还强。第十三条法则最终版：你不是变数——你是答案。" },
      { name: "马里奥", text: "（揉着被打疼的地方但开心得不得了）嘿呀！太过瘾了！这是我打过最爽快的一场！" },
      { name: "花生", text: "（擦擦额头的汗，把一个精心制作的便当递给你）这是我一路上用七个世界的食材做的——'万界极品便当'。最后一战前吃掉，保证你力量全开！" },
      { name: "林克", text: "...（收剑。然后做了一件从未做过的事——他开口了，声音低沉而温暖）...一起赢。（仅此三个字。但每个人都听到了。）" },
      { name: "花生", text: "（惊呆）林...林克说话了？！他说话了！！！" },
      { name: "马里奥", text: "嘿呀！！！林克会说话！！！" },
      { name: "十三", text: "...（愣了一下，然后轻笑）第十四条法则——今天刚写的：奇迹就在最不可能的地方。" },
      { name: "暗影执行者·厌晚", text: "...在进去之前。（从怀中取出一壶酒）我在蜀山偷的灵酒。打完了...回来一起喝。" },
      { name: "仙剑大侠·李逍遥", text: "（郑重地接过）好。打完了——大家一起。" },
      { name: "所有人", text: "（七个拳头碰在一起。无声的誓约。）" }
    ],
    reward: { gold: 100000, items: [{id:'revive', count:10}] }
  },

  // ===== 异界篇·终章：创世之战 (Map 109) =====
  {
    chapter: 47, mapId: 109,
    title: "异界篇·终章：创世之战·次元霸主",
    objective: "在万界之源对决次元霸主，终结跨越七个世界的史诗冒险！",
    intro: [
      { name: "次元霸主", text: "（一个由无数次元碎片组成的巨大存在。它没有固定的形态——时而是龙，时而是人，时而是虚空本身）终于来了...万界旅者。你们知道吗？我曾经也是一个普通的生命。" },
      { name: "次元霸主", text: "但次元的洪流吞噬了我的世界——就像吞噬十三的世界一样。不同的是，我选择了...融入。我成为了次元本身。" },
      { name: "十三", text: "（瞳孔收缩）你...你也是被次元裂隙吞噬的幸存者？" },
      { name: "次元霸主", text: "幸存者？不。我是进化者。我吞噬了无数世界的力量，只为了一个目标——重建一个永远不会被毁灭的世界。为此...我需要万界之源的力量。" },
      { name: "仙剑大侠·李逍遥", text: "用毁灭来换取重建？你以为自己是神吗？！" },
      { name: "次元霸主", text: "我就是。（身躯膨胀到遮蔽整个天空）来吧——证明你们的世界值得存在！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 700, name: '次元霸主 [第一形态·吞噬之龙]', text: '（化为一条由次元碎片组成的巨龙）万界之龙！第一次毁灭——开始！', emoji: '🐉',
        eliteParty: [{ id: 700, level: 100 }, { id: 694, level: 100 }, { id: 614, level: 99 }, { id: 622, level: 99 }, { id: 597, level: 98 }, { id: 693, level: 98 }] },
      { step: 1, x: 14, y: 4, type: 'dialog', name: '花生', text: '（从背包里掏出七色便当）大家！这是我用七个世界收集的食材做的最终便当！吃了恢复全部体力！来！', emoji: '🍱' },
      { step: 2, x: 18, y: 8, type: 'battle', enemyId: 340, name: '次元霸主 [第二形态·万界之王]', text: '（龙形崩碎，重组为一个身披万界铠甲的王者）...有趣。你们逼我使出了第二形态。就用这个形态——毁灭你们所有人的世界！', emoji: '👑',
        eliteParty: [{ id: 340, level: 100 }, { id: 263, level: 100 }, { id: 696, level: 99 }, { id: 700, level: 99 }, { id: 694, level: 98 }, { id: 607, level: 98 }] },
      { step: 3, x: 22, y: 6, type: 'battle', enemyId: 254, name: '次元霸主 [最终形态·虚空本源]', text: '（一切形态消融，化为纯粹的虚空之力——无形无色，却散发着毁灭万物的压迫感）不可能...我已经超越了所有世界的力量极限...你们...只是几个来自不同世界的渺小生命...为什么...为什么还能站起来？！', emoji: '⚫',
        eliteParty: [{ id: 254, level: 100 }, { id: 340, level: 100 }, { id: 263, level: 100 }, { id: 700, level: 100 }, { id: 696, level: 99 }, { id: 607, level: 99 }] },
      { step: 4, x: 15, y: 5, type: 'dialog', name: '仙剑大侠·李逍遥', text: '（将六把次元钥匙的力量注入御剑之中）你问为什么？因为我们不是一个人在战斗——我们是七个世界的意志！！！' ,emoji: '⚔️'},
      { step: 5, x: 15, y: 5, type: 'dialog', name: '十三', text: '（举起短刀——刀身上映照出毁灭世界的花田）第十三条法则的最终篇：生命本身——就是最强的武器。告辞了，次元霸主。', emoji: '🗡️' }
    ],
    midEvent: { enemyId: 254, name: '次元霸主 [最终形态·虚空本源]' },
    outro: [
      { name: "次元霸主", text: "（身躯崩碎，次元碎片四散）...原来如此。不是力量的差距...是'羁绊'...这种东西...我在融入次元的那一刻就失去了...（声音渐渐消散）...也许...重来一次...我会选择...不同的路..." },
      { name: "系统", text: "获得【次元钥匙·源】！七把钥匙全部收集！次元裂隙正在闭合！" },
      { name: "花生", text: "（哭着笑）我们...我们赢了！！！" },
      { name: "马里奥", text: "嘿呀！！！最终boss被打倒了！！！（兴奋地跳了三尺高）" },
      { name: "十三", text: "（看着次元裂隙闭合，手中的短刀终于放下了）...结束了。一切...终于结束了。" },
      { name: "林克", text: "（将大师之剑举向天空——七色光芒划破夜空，宛如一道永恒的彩虹）" },
      { name: "暗影执行者·厌晚", text: "（从怀中取出酒壶——不对，李逍遥在保管。走到李逍遥面前）...酒呢？" },
      { name: "仙剑大侠·李逍遥", text: "（笑着拿出酒壶，倒了七杯）说好的——打完了一起喝。" },
      { name: "花生", text: "（举杯）为了所有的世界！为了我们的冒险！" },
      { name: "十三", text: "（举杯）...为了不再有世界被毁灭。" },
      { name: "马里奥", text: "（举杯）为了管道永远畅通！...呃，我是说为了和平！嘿呀！" },
      { name: "林克", text: "（举杯，微笑。这是他说过最多话的一天——零句。但那个笑容胜过千言万语。）" },
      { name: "暗影执行者·厌晚", text: "（举杯，难得地柔和了语气）...不坏。这次冒险...不坏。" },
      { name: "仙剑大侠·李逍遥", text: "（举杯）从草原上的小鬼到现在跨越七个世界的英雄...（看向主角）你的故事，还远没有结束。干杯！" },
      { name: "系统", text: "【异界征途篇·完】跨越七个次元世界的冒险落幕！" },
      { name: "系统", text: "奖励：解锁隐藏称号【万界旅者】，所有同伴好感度MAX，获得200000金币+大师球×5" }
    ],
    reward: { gold: 200000, balls: { master: 5 } }
  }
];

// ==========================================
// 三国志篇 — 通关主线（第13章地图）后解锁 · chapter 索引 13–24
// ==========================================
export const SANGUO_STORY = [
  {
    chapter: 13,
    mapId: 204,
    title: "第一章：讨伐董卓·群雄会盟",
    objective: "于洛阳天子城会盟诸侯，冲破董军防线，击败飞将吕布，动摇董卓暴政。",
    isSanguo: true,
    intro: [
      { name: "曹操", text: "洛阳宫阙之上，董卓倒行逆施，天下切齿。今日十八路诸侯会盟——正是讨贼之机！" },
      { name: "袁绍", text: "盟主在此！谁愿为先锋，先挫董贼锐气？若能直捣虎牢，天下人心可复！" },
      { name: "王允", text: "宫中密报：董贼遣吕布镇守外郭，其人骑射无双，切不可轻敌……" },
      { name: "刘备", text: "天下苦董久矣。义军既起，我等虽兵微，亦当与天下人共赴此战！" }
    ],
    tasks: [
      { step: 0, x: 10, y: 8, type: 'battle', enemyId: 701, name: '董军先锋·李傕部曲', text: "奉太师令！擅闯会盟者——格杀勿论！", emoji: '⚔️',
        eliteParty: [{ id: 701, level: 52 }, { id: 703, level: 51 }, { id: 704, level: 50 }]
      },
      { step: 1, x: 16, y: 6, type: 'dialog', name: '曹操', text: "好！前军已破，士气可用。昔年温酒之事不必再提——今日之吕布，仍在阵前！", emoji: '🍶' },
      { step: 2, x: 22, y: 10, type: 'battle', enemyId: 707, name: '董军骁骑·郭汜亲兵', text: "虎牢飞将之名，岂容尔等玷污！杀！", emoji: '🐎',
        eliteParty: [{ id: 707, level: 54 }, { id: 705, level: 53 }, { id: 706, level: 52 }]
      }
    ],
    midEvent: { enemyId: 727, name: '飞将·吕布' },
    outro: [
      { name: "曹操", text: "吕布虽勇，亦难独支倾颓之势……董卓暴政，天怒人怨，此战只是开端。" },
      { name: "刘备", text: "天下大势，自此波澜再起。望诸公莫忘今日之盟——为民，为止戈。" },
      { name: "系统", text: "三国志篇开启：群雄逐鹿的烽火，已在中原点燃。" }
    ],
    reward: { gold: 8000, items: [{ id: 'hyper_potion', count: 5 }] }
  },
  {
    chapter: 14,
    mapId: 205,
    title: "第二章：刘备借荆州",
    objective: "在荆州要塞周旋孙刘曹三方，立契借地，为蜀汉争得立足之机。",
    isSanguo: true,
    intro: [
      { name: "刘备", text: "江夏新败，将士思归。若无立足之地，何以安民？" },
      { name: "诸葛亮", text: "荆州北据汉沔，利尽南海，东连吴会，西通巴蜀……主公欲成大业，必先借荆州为基。" },
      { name: "鲁肃", text: "孙刘唇齿相依，共抗北方强敌。借地之事，容我回建业禀明吴侯，再定盟书条款。" },
      { name: "周瑜", text: "刘备枭雄也，诸葛孔明更是人杰——借地？哼，须防养虎为患！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 12, type: 'dialog', name: '鲁肃', text: "子敬愿为担保：盟书在此，借南郡以屯兵，共御曹操。但若背盟……吴军铁骑亦非虚设。", emoji: '📜' },
      { step: 1, x: 14, y: 9, type: 'battle', enemyId: 712, name: '曹军斥候·荆州前线', text: "江北营寨闻孙刘往来频繁——宁可错杀，不可放过！", emoji: '🏹',
        eliteParty: [{ id: 712, level: 56 }, { id: 713, level: 55 }, { id: 714, level: 54 }]
      },
      { step: 2, x: 20, y: 7, type: 'battle', enemyId: 715, name: '江夏疑兵·蔡瑁旧部', text: "荆州水脉我熟！外人休想在此立脚！", emoji: '🌊',
        eliteParty: [{ id: 715, level: 58 }, { id: 716, level: 57 }, { id: 717, level: 56 }]
      }
    ],
    midEvent: { enemyId: 718, name: '大都督·周瑜' },
    outro: [
      { name: "诸葛亮", text: "盟成。荆州暂借，如跨有荆益之策，方可二分天下，以图中原。" },
      { name: "刘备", text: "先生之言，备铭记于心。荆州之民，备必以仁政安之。" },
      { name: "系统", text: "孙刘联盟的张力与共同敌人，将牵动后续无数战局。" }
    ],
    reward: { gold: 12000, items: [{ id: 'hyper_potion', count: 6 }] }
  },
  {
    chapter: 15,
    mapId: 201,
    title: "第三章：挟天子以令诸侯",
    objective: "深入许昌魏都，见证曹操迎驾之策，冲破忠于汉室与魏武两派的暗斗。",
    isSanguo: true,
    intro: [
      { name: "曹操", text: "天子蒙尘，孤迎驾许昌，非为私也——为令天下知正统所在。" },
      { name: "荀彧", text: "明公奉天子以讨不臣，四方之士望风而归。然……尊王与建制，须慎之又慎。" },
      { name: "献帝（旁白）", text: "深宫之中，诏书可出，亦可不出。许昌一城，已成天下政令所出之地。" },
      { name: "司马懿", text: "时势如此。能借势而行者，方能转乾坤于指掌之间。" }
    ],
    tasks: [
      { step: 0, x: 6, y: 10, type: 'battle', enemyId: 719, name: '许都卫尉·司马系校尉', text: "无令擅入宫城者——视同谋逆！", emoji: '🛡️',
        eliteParty: [{ id: 719, level: 60 }, { id: 720, level: 59 }, { id: 721, level: 58 }]
      },
      { step: 1, x: 12, y: 8, type: 'dialog', name: '荀彧', text: "望君知：挟天子以令诸侯，与挟天子以废汉室，只在一念之间。", emoji: '⚖️' },
      { step: 2, x: 18, y: 11, type: 'battle', enemyId: 722, name: '虎贲甲士·典韦旧部', text: "魏公威震中原！逆命者，虽近必诛！", emoji: '🔥',
        eliteParty: [{ id: 722, level: 62 }, { id: 723, level: 61 }, { id: 724, level: 60 }]
      }
    ],
    midEvent: { enemyId: 725, name: '魏武亲军·典韦' },
    outro: [
      { name: "曹操", text: "天下汹汹，非战无以止乱。孤之所行，后世自有评说。" },
      { name: "司马懿", text: "……大势已成。接下来，只看各方如何落子。" },
      { name: "系统", text: "许昌的诏令与兵锋，将成为北方争霸的核心轴心。" }
    ],
    reward: { gold: 16000, items: [{ id: 'hyper_potion', count: 7 }] }
  },
  {
    chapter: 16,
    mapId: 206,
    title: "第四章：汉中争夺战",
    objective: "穿越蜀道咽喉，随刘备军与曹魏名将争夺汉中，定益州北门。",
    isSanguo: true,
    intro: [
      { name: "刘备", text: "汉中若失，益州门户洞开。此战，关系基业存亡！" },
      { name: "黄忠", text: "老夫虽年迈，尚能开弓！定军山前，誓取曹军上将之首级！" },
      { name: "法正", text: "山路迂回，可出奇制胜。主公依计而行，汉中可图。" },
      { name: "夏侯渊", text: "汉中乃西陲咽喉，魏军重兵在此——蜀道再险，也挡不住铁骑！" }
    ],
    tasks: [
      { step: 0, x: 9, y: 9, type: 'battle', enemyId: 726, name: '汉中隘口·曹魏偏师', text: "蜀道难？难不过魏武军令！", emoji: '⛰️',
        eliteParty: [{ id: 726, level: 64 }, { id: 727, level: 63 }, { id: 728, level: 62 }]
      },
      { step: 1, x: 15, y: 6, type: 'dialog', name: '赵云', text: "子龙在此！主公先行，某当殿后——一人一骑，亦可当千军。", emoji: '🐉' },
      { step: 2, x: 21, y: 12, type: 'battle', enemyId: 729, name: '定军斥候·曹魏弓骑', text: "山雾起处，便是埋兵之所……休想越过！", emoji: '🏹',
        eliteParty: [{ id: 729, level: 66 }, { id: 730, level: 65 }, { id: 731, level: 64 }]
      }
    ],
    midEvent: { enemyId: 732, name: '征西将军·夏侯渊' },
    outro: [
      { name: "黄忠", text: "哈哈哈！今日方知老当益壮！汉中震动，曹军胆寒！" },
      { name: "刘备", text: "汉中既下，益州可安。然曹操岂会甘休？北境仍不可懈。" },
      { name: "系统", text: "蜀道与汉中的得失，将反复牵动三国疆界。" }
    ],
    reward: { gold: 20000, items: [{ id: 'hyper_potion', count: 8 }] }
  },
  {
    chapter: 17,
    mapId: 202,
    title: "第五章：入蜀建国",
    objective: "于成都完成益州整合，直面刘璋旧势与蜀中民心，奠基蜀汉。",
    isSanguo: true,
    intro: [
      { name: "庞统", text: "益州富庶，刘季玉暗弱，取之有道，亦可安民——主公勿疑。" },
      { name: "刘备", text: "同宗相争，非我所愿。然百姓苦于苛役久矣，若得蜀中，当与民休息。" },
      { name: "诸葛亮", text: "先取益州，再图中原。隆中之策，今见其半。" },
      { name: "马超", text: "西凉旧怨未了，今日愿为先锋，以报主公知遇！" }
    ],
    tasks: [
      { step: 0, x: 7, y: 7, type: 'battle', enemyId: 733, name: '蜀中豪族·私兵', text: "益州乃吾等根基，岂容外来者轻取！", emoji: '🏯',
        eliteParty: [{ id: 733, level: 68 }, { id: 731, level: 67 }, { id: 732, level: 66 }]
      },
      { step: 1, x: 13, y: 10, type: 'dialog', name: '张飞', text: "大哥心善，俺可不耐烦！挡路者——燕人张翼德在此！", emoji: '⚔️' },
      { step: 2, x: 19, y: 5, type: 'battle', enemyId: 734, name: '剑阁守将·刘璋麾下', text: "剑阁天险，一夫当关！欲入成都，先问手中枪！", emoji: '⚔️',
        eliteParty: [{ id: 734, level: 70 }, { id: 735, level: 69 }, { id: 736, level: 68 }]
      }
    ],
    midEvent: { enemyId: 737, name: '西凉骁骑·马超' },
    outro: [
      { name: "诸葛亮", text: "益州既定，内修政理，外结孙权，北伐方可从容。" },
      { name: "刘备", text: "今日起，愿与蜀中父老共守此土，同承汉祚。" },
      { name: "系统", text: "蜀汉立国之势成，天下三分之局愈明。" }
    ],
    reward: { gold: 24000, items: [{ id: 'hyper_potion', count: 9 }] }
  },
  {
    chapter: 18,
    mapId: 205,
    title: "第六章：关羽水淹七军",
    objective: "于荆州江岸迎战曹魏七军，水涨城崩之际，再现威震华夏之名。",
    isSanguo: true,
    intro: [
      { name: "关羽", text: "樊城之下，七军云集。天象有变，水势将起——此天助我也！" },
      { name: "关平", text: "父亲小心！东吴虽盟，吕蒙陆逊之辈，不可不防！" },
      { name: "庞德", text: "关羽何足惧！魏王麾下勇士在此，宁为鬼雄，不为降虏！" },
      { name: "于禁", text: "七军既出，当速战速决……这、这水涨得不对！" }
    ],
    tasks: [
      { step: 0, x: 11, y: 11, type: 'battle', enemyId: 738, name: '汉水急湍·曹魏舟师', text: "水势异变！快撤——啊！", emoji: '🌊',
        eliteParty: [{ id: 738, level: 70 }, { id: 736, level: 69 }, { id: 737, level: 68 }]
      },
      { step: 1, x: 17, y: 8, type: 'dialog', name: '关羽', text: "舟楫既覆，七军成擒。此非独关某之能，亦天时也。", emoji: '🐉' },
      { step: 2, x: 23, y: 6, type: 'battle', enemyId: 739, name: '樊城残垒·曹魏死士', text: "城在人在！魏王之恩，以死相报！", emoji: '🔥',
        eliteParty: [{ id: 739, level: 72 }, { id: 740, level: 71 }, { id: 741, level: 70 }]
      }
    ],
    midEvent: { enemyId: 742, name: '白马将军·庞德' },
    outro: [
      { name: "关羽", text: "威震华夏，名不虚传。然骄兵必败——后世当以为戒。" },
      { name: "关平", text: "父亲威名已立，回师江陵，尚需防备东吴……" },
      { name: "系统", text: "大水无情，胜负亦无情；荆州之局，暗流更烈。" }
    ],
    reward: { gold: 28000, items: [{ id: 'hyper_potion', count: 10 }] }
  },
  {
    chapter: 19,
    mapId: 203,
    title: "第七章：东吴崛起·赤壁之战",
    objective: "在建业外水寨与长江前线，联吴抗曹，火攻破曹军连环舟楫。",
    isSanguo: true,
    intro: [
      { name: "孙权", text: "曹操挟百万之众南下，江东存亡在此一战！孤意已决——战！" },
      { name: "周瑜", text: "曹军不习水战，又染疫病，连环舟虽固，亦可一火焚之！" },
      { name: "诸葛亮", text: "借东风之事，自有天数与人谋。亮愿助公瑾一臂之力。" },
      { name: "黄盖", text: "苦肉之计已备，只待诈降入营——老夫这把老骨头，尚能点火！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 743, name: '曹军水寨·连环舟前卫', text: "铁索连环，如履平地！江东鼠辈，何敢来犯？", emoji: '⛓️',
        eliteParty: [{ id: 743, level: 74 }, { id: 742, level: 73 }, { id: 741, level: 72 }]
      },
      { step: 1, x: 14, y: 9, type: 'dialog', name: '黄盖', text: "粮船已近——点火！", emoji: '🔥' },
      { step: 2, x: 20, y: 11, type: 'battle', enemyId: 744, name: '赤壁火海·曹军溃阵', text: "火！全是火！这是天亡我也！", emoji: '🌋',
        eliteParty: [{ id: 744, level: 76 }, { id: 745, level: 75 }, { id: 746, level: 74 }]
      }
    ],
    midEvent: { enemyId: 747, name: '水军都督·周瑜' },
    outro: [
      { name: "孙权", text: "赤壁之后，三分之势乃成。江东子弟，不负父兄基业！" },
      { name: "甘宁", text: "百骑劫营何足道！往后更有大战，甘宁愿为先锋！" },
      { name: "系统", text: "长江一炬，烧尽北军锐气；天下格局，自此改写。" }
    ],
    reward: { gold: 32000, items: [{ id: 'hyper_potion', count: 11 }] }
  },
  {
    chapter: 20,
    mapId: 204,
    title: "第八章：三国鼎立·洛阳攻防",
    objective: "洛阳天子城再起兵戈，魏蜀吴三方角力正统与要塞，试炼鼎足之局。",
    isSanguo: true,
    intro: [
      { name: "司马懿", text: "洛阳天下之中，四战之地。鼎立之势虽成，此地仍是最烈之炉。" },
      { name: "陆逊", text: "吴军据东南，未必不能北上争锋——先取实利，再论名分。" },
      { name: "赵云", text: "一身是胆，何惧攻城？为汉室社稷，虽白发亦当先登。" },
      { name: "荀彧（追忆）", text: "昔日奉天子……今日之城，已非旧时之城。（叹息）" }
    ],
    tasks: [
      { step: 0, x: 9, y: 8, type: 'battle', enemyId: 748, name: '洛阳外郭·魏军重步', text: "洛阳城高池深，进得来，未必出得去！", emoji: '🏰',
        eliteParty: [{ id: 748, level: 78 }, { id: 746, level: 77 }, { id: 747, level: 76 }]
      },
      { step: 1, x: 15, y: 5, type: 'dialog', name: '貂蝉', text: "乱世浮沉，红颜如絮。英雄们争的是天下，妾身只盼……少些焚城之火。", emoji: '🌸' },
      { step: 2, x: 21, y: 10, type: 'battle', enemyId: 749, name: '宫阙夹道·三方混战斥候', text: "魏旗蜀帜吴舟影——杀错一个，便是两国之怨！", emoji: '⚔️',
        eliteParty: [{ id: 749, level: 80 }, { id: 750, level: 79 }, { id: 751, level: 78 }]
      }
    ],
    midEvent: { enemyId: 752, name: '洛阳督军·陆逊' },
    outro: [
      { name: "司马懿", text: "攻守之间，胜负未可轻言。然洛阳一动，天下皆知三国无弱者。" },
      { name: "赵云", text: "今日之战，非为私怨。只愿百姓少受刀兵之苦。" },
      { name: "系统", text: "鼎立非静止，而在彼此牵制中延续。" }
    ],
    reward: { gold: 36000, items: [{ id: 'hyper_potion', count: 12 }] }
  },
  {
    chapter: 21,
    mapId: 201,
    title: "第九章：司马懿夺权",
    objective: "许昌宫廷暗涌再起，高平陵阴影笼罩，见证司马氏代魏之机的关键一弈。",
    isSanguo: true,
    intro: [
      { name: "司马懿", text: "魏室栋梁？还是权臣？史笔如刀，后人自断。今日，只问成败。" },
      { name: "曹爽", text: "先帝托孤于我，司马懿老矣——何足惧哉？" },
      { name: "司马昭", text: "父亲隐忍多年，一朝收网。天下将知：司马之名，不在人后。" },
      { name: "荀顗（旁白）", text: "宫门深锁，诏命往来无声。许昌一城，风向已变。" }
    ],
    tasks: [
      { step: 0, x: 6, y: 9, type: 'dialog', name: '曹爽', text: "禁军听令！谁敢擅动——呃，你、你们……", emoji: '😰' },
      { step: 1, x: 12, y: 11, type: 'battle', enemyId: 753, name: '高平陵卫·司马死士', text: "奉令清君侧！阻者——与逆党同罪！", emoji: '🗡️',
        eliteParty: [{ id: 753, level: 82 }, { id: 754, level: 81 }, { id: 755, level: 80 }]
      },
      { step: 2, x: 18, y: 7, type: 'battle', enemyId: 756, name: '许昌城门·曹爽亲卫', text: "护大将军！宁可巷战至死！", emoji: '🛡️',
        eliteParty: [{ id: 756, level: 84 }, { id: 757, level: 83 }, { id: 758, level: 82 }]
      }
    ],
    midEvent: { enemyId: 759, name: '冢虎·司马懿' },
    outro: [
      { name: "司马懿", text: "天下归心非一日之功。魏室气数……各安天命。" },
      { name: "司马昭", text: "父亲今日之举，只是序章。" },
      { name: "系统", text: "权臣与宗室的博弈，将为晋室铺路。" }
    ],
    reward: { gold: 40000, items: [{ id: 'hyper_potion', count: 13 }] }
  },
  {
    chapter: 22,
    mapId: 206,
    title: "第十章：诸葛亮北伐",
    objective: "自汉中再出祁山，与曹魏名将周旋，体验「鞠躬尽瘁」的北伐之志。",
    isSanguo: true,
    intro: [
      { name: "诸葛亮", text: "先帝托孤，臣敢不竭股肱之力？今当北伐，以图中原，非好战也——为止战。" },
      { name: "姜维", text: "丞相！维愿为前驱，虽九死犹未悔！" },
      { name: "魏延", text: "兵贵神速，何不另辟蹊径？若用吾计……（话音未落，众议纷纷）" },
      { name: "司马懿", text: "诸葛孔明善攻，我善守。祁山久战，且看粮道与人心谁先断。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 760, name: '祁山前哨·魏军游骑', text: "蜀军又至！守住营栅！", emoji: '🏕️',
        eliteParty: [{ id: 760, level: 84 }, { id: 758, level: 83 }, { id: 759, level: 82 }]
      },
      { step: 1, x: 16, y: 6, type: 'dialog', name: '诸葛亮', text: "木牛流马，运粮于险道。天时不如地利，地利不如人和——人和，在民心与军纪。", emoji: '📦' },
      { step: 2, x: 22, y: 9, type: 'battle', enemyId: 761, name: '栈道夜袭·魏军弩营', text: "暗夜放箭！休让蜀军过线！", emoji: '🌙',
        eliteParty: [{ id: 761, level: 86 }, { id: 762, level: 85 }, { id: 763, level: 84 }]
      }
    ],
    midEvent: { enemyId: 764, name: '蜀汉丞相·诸葛亮' },
    outro: [
      { name: "姜维", text: "丞相之志，维必继承——纵使千难万险！" },
      { name: "诸葛亮", text: "出师未捷身先死……亦不过是尽人事，听天命。后人莫以成败论英雄。" },
      { name: "系统", text: "北伐的火焰，将在史卷中长明。" }
    ],
    reward: { gold: 44000, items: [{ id: 'hyper_potion', count: 14 }] }
  },
  {
    chapter: 23,
    mapId: 202,
    title: "第十一章：蜀汉危机",
    objective: "成都风雨飘摇，姜维力撑残局，抵御魏军压境，为蜀汉争最后一线气数。",
    isSanguo: true,
    intro: [
      { name: "姜维", text: "丞相既逝，维岂敢忘托孤之重？今魏军压境，益州疲弊——唯有死战！" },
      { name: "刘禅", text: "诸卿……朕、朕当如何……" },
      { name: "陆逊（遗策回响）", text: "三国之争，终在国力与民心。蜀道难，守更难。" },
      { name: "邓艾", text: "阴平小道，可出奇兵。蜀中若乱，一鼓可下！" }
    ],
    tasks: [
      { step: 0, x: 7, y: 8, type: 'battle', enemyId: 765, name: '剑阁余烬·魏军锐卒', text: "蜀汉气数将尽，何不早降！", emoji: '⚔️',
        eliteParty: [{ id: 765, level: 92 }, { id: 766, level: 91 }, { id: 767, level: 90 }]
      },
      { step: 1, x: 13, y: 5, type: 'dialog', name: '刘禅', text: "朕……朕只愿满城百姓，少受屠戮……", emoji: '😢' },
      { step: 2, x: 19, y: 12, type: 'battle', enemyId: 768, name: '成都外郭·魏军云梯', text: "先登者赏千金！破城！", emoji: '🪜',
        eliteParty: [{ id: 768, level: 94 }, { id: 769, level: 93 }, { id: 770, level: 92 }]
      }
    ],
    midEvent: { enemyId: 771, name: '阴平奇袭·邓艾' },
    outro: [
      { name: "姜维", text: "臣等正欲死战，陛下何故先降……（泪下）史笔如刀，维心可昭。" },
      { name: "系统", text: "气数有尽时，忠义无绝期。" },
      { name: "系统", text: "蜀汉篇章落幕，而天下一统的终局已在门外。" }
    ],
    reward: { gold: 47000, items: [{ id: 'hyper_potion', count: 15 }] }
  },
  {
    chapter: 24,
    mapId: 204,
    title: "第十二章：天下归一",
    objective: "于洛阳天子城迎来终局之战，终结百年纷争，见证三分归一统的宿命与新生。",
    isSanguo: true,
    intro: [
      { name: "司马懿", text: "三分归一，非一人一姓之功，乃天下厌乱已久。" },
      { name: "陆逊", text: "江东烟火渐熄，英雄之名，终归尘土与青史。" },
      { name: "诸葛亮（魂音）", text: "鞠躬尽瘁，死而后已。若天下一统，百姓得息——亮，无憾。" },
      { name: "曹操（追忆）", text: "对酒当歌，人生几何？譬如朝露，去日苦多……（余音散尽）" }
    ],
    tasks: [
      { step: 0, x: 10, y: 7, type: 'battle', enemyId: 772, name: '洛阳决战·禁军总阵', text: "最后一战！天下归属，尽在此役！", emoji: '⚔️',
        eliteParty: [{ id: 772, level: 98 }, { id: 773, level: 97 }, { id: 774, level: 96 }]
      },
      { step: 1, x: 16, y: 10, type: 'dialog', name: '孙权', text: "江东孙氏，愿以民为先。战止，才是赢家。", emoji: '🐯' },
      { step: 2, x: 22, y: 6, type: 'battle', enemyId: 775, name: '天命坛前·三国英魂执念', text: "我等未竟之志……汇于此身！", emoji: '👁️',
        eliteParty: [{ id: 775, level: 100 }, { id: 776, level: 99 }, { id: 777, level: 98 }]
      }
    ],
    midEvent: { enemyId: 800, name: '归一之龙·棱镜古龙' },
    outro: [
      { name: "系统", text: "兵戈止息，洛阳晨光破晓。旧史翻篇，新章待书。" },
      { name: "系统", text: "三国志篇完结：英雄去矣，而山河仍在，故事永在人间口耳之间。" },
      { name: "系统", text: "获得丰厚终章奖励——愿你在精灵与天下的旅途上，继续书写自己的传说。" }
    ],
    reward: { gold: 50000, items: [{ id: 'hyper_potion', count: 20 }] }
  }
];
