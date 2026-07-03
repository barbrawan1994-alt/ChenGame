/** 门派秘境 — 各门派生态玩法差异 */

export const SECT_SECRET_REALMS = [
  {
    id: 'sect_qingmu', name: '万木回春', icon: '🌳', reqBadges: 6, sectIds: [5, 12],
    ecoRole: 'heal', summary: '不能过度战斗，修复枯萎植物，精灵情绪稳定度重要。',
    steps: [
      { type: 'puzzle', title: '催生新芽', text: '木系/光系/温和标签精灵修复古树。', reqTypes: ['GRASS', 'FAIRY'], reqTags: ['plant'] },
      { type: 'soothe', title: '安抚暴走', text: '御灵谷心法：减少战斗，多安抚。', avoidBranch: 'fight' },
      { type: 'battle', title: '最后考验', enemyName: '枯萎守卫', pool: [1, 2, 43], lvl: [40, 48], count: 2, objective: 'purify' },
    ],
    reward: { gold: 7000, title: '万木守护者', sectContrib: 100 },
  },
  {
    id: 'sect_yanyang', name: '焚天试炼', icon: '🔥', reqBadges: 6, sectIds: [6, 1],
    ecoRole: 'burst', summary: '控制火焰强度，过强会伤害目标。',
    steps: [
      { type: 'puzzle', title: '控火机关', text: '风系扩大火势也可能失控；水系降温创造安全区。', reqTypes: ['FIRE', 'WATER'] },
      { type: 'battle', title: '焚天守卫', enemyName: '火焰傀儡', pool: [4, 6, 37], lvl: [45, 55], count: 3 },
    ],
    reward: { gold: 8000, title: '焚天行者', sectContrib: 80 },
    ecologyPenalty: { vegetation: -5 },
    ecologyRecovery: { vegetation: 3, taskId: 'eco_fentian_restore' },
  },
  {
    id: 'sect_bingjia', name: '古战演武', icon: '⚔️', reqBadges: 8, sectIds: [9, 2],
    ecoRole: 'defense', summary: '阵法站位、护送兵车、将魂配合。',
    steps: [
      { type: 'explore', title: '演武场', text: '兵家府心法：组织 NPC 防线。', reqSectEco: 'defense' },
      { type: 'battle', title: '阵法试炼', enemyName: '演武傀儡', pool: [65, 74, 95], lvl: [60, 72], count: 4, objective: 'protect', objectiveTurns: 8 },
    ],
    reward: { gold: 12000, generalFragment: 'zhao_yun', title: '演武大师', sectContrib: 120 },
    ecologyPenalty: { stability: -3 },
  },
  {
    id: 'sect_xingji', name: '星机遗迹', icon: '⚙️', reqBadges: 7, sectIds: [10],
    ecoRole: 'puzzle', summary: '古代机关、机械精灵、根系结构分析。',
    steps: [
      { type: 'puzzle', title: '机关解谜', text: '天机阁心法：分析根系结构切断污染。', reqTypes: ['STEEL', 'PSYCHIC'] },
      { type: 'battle', title: '机械失控', enemyName: '失控机械', pool: [35, 87, 88, 132], lvl: [50, 62], count: 3 },
    ],
    reward: { gold: 10000, title: '星机学者', sectContrib: 100 },
  },
  {
    id: 'sect_xiaoyao', name: '逍遥幻境', icon: '🌀', reqBadges: 7, sectIds: [3, 8],
    ecoRole: 'mobility', summary: '潜入、双线侦查、速度试炼。需机动型精灵与敏捷属性。',
    steps: [
      { type: 'explore', title: '幻境潜入', text: '逍遥派心法：提升速度通过幻象迷宫，五毒教识别陷阱。', reqTags: ['small', 'nocturnal'] },
      { type: 'puzzle', title: '双线追踪', text: '分兵两路同时触发机关。需暗系/飞行精灵配合。', reqTypes: ['DARK', 'FLYING'] },
      { type: 'battle', title: '幻境守卫', enemyName: '幻境守卫', pool: [94, 132, 199], lvl: [52, 62], count: 3, objective: 'escape', objectiveTurns: 6 },
    ],
    reward: { gold: 9000, title: '幻境行者', sectContrib: 80 },
  },
  {
    id: 'sect_huashan', name: '华山论道', icon: '⚔️', reqBadges: 6, sectIds: [4, 11],
    ecoRole: 'burst', summary: '单对单精灵技巧试炼，考验精准破防与元素联动。',
    steps: [
      { type: 'battle', title: '剑意试炼', enemyName: '华山弟子', pool: [27, 50, 65], lvl: [42, 52], count: 2 },
      { type: 'puzzle', title: '元素共鸣', text: '华山心法：按正确元素顺序攻击石柱。', reqTypes: ['PSYCHIC', 'FIGHT'] },
      { type: 'boss', title: '华山剑灵', enemyName: '华山剑灵', bossId: 50, lvl: 58, drop: 8000 },
    ],
    reward: { gold: 8500, title: '华山论剑者', sectContrib: 90 },
  },
  {
    id: 'sect_canghai', name: '沧海秘潮', icon: '🌊', reqBadges: 7, sectIds: [7],
    ecoRole: 'control', summary: '冰封净化试炼，控制污染源与湖泊探索。',
    steps: [
      { type: 'explore', title: '冰泉探索', text: '沧海阁心法：冻结污染源，水/冰系精灵可潜入深层。', reqTypes: ['WATER', 'ICE'] },
      { type: 'puzzle', title: '冰封净化', text: '按水温梯度冻结三个污染管道。', reqTypes: ['ICE'] },
      { type: 'battle', title: '污染精英', enemyName: '污水守卫', pool: [22, 24, 26, 88], lvl: [55, 65], count: 3, objective: 'purify' },
    ],
    reward: { gold: 9500, title: '沧海净化者', sectContrib: 90 },
    ecologyReward: { water: 15, pollution: -10 },
  },
  {
    id: 'sect_jianzhong', name: '剑冢试炼', icon: '⚔️', reqBadges: 8, sectIds: [1],
    ecoRole: 'burst', summary: '御剑连击、速度抢占剑阵节点，击败剑灵幻影。',
    steps: [
      { type: 'explore', title: '剑阵穿梭', text: '风系/飞行精灵抢占节点。', reqTypes: ['WIND', 'FLYING'] },
      { type: 'puzzle', title: '剑意共鸣', text: '按剑阵顺序触发机关。', reqTypes: ['FIGHT', 'WIND'] },
      { type: 'boss', title: '剑冢守灵', enemyName: '剑冢守灵', bossId: 182, lvl: 65, drop: 9000 },
    ],
    reward: { gold: 11000, title: '剑冢传人', sectContrib: 120, scrollPage: 2 },
  },
  {
    id: 'sect_shaolin', name: '达摩铜人阵', icon: '🛡️', reqBadges: 8, sectIds: [2],
    ecoRole: 'defense', summary: '连续守关，不能让后排精灵阵亡。',
    steps: [
      { type: 'battle', title: '铜人阵', enemyName: '铜人', pool: [65, 74, 270], lvl: [55, 65], count: 3, objective: 'protect', objectiveTurns: 10 },
      { type: 'puzzle', title: '禅定心法', text: '防御型精灵承受三轮攻击。', reqTypes: ['FIGHT', 'STEEL'] },
      { type: 'boss', title: '达摩幻影', enemyName: '达摩幻影', bossId: 278, lvl: 68, drop: 9500 },
    ],
    reward: { gold: 11500, title: '铜人阵大师', sectContrib: 130 },
  },
  {
    id: 'sect_tangmen', name: '唐门机关楼', icon: '🎯', reqBadges: 7, sectIds: [4],
    ecoRole: 'burst', summary: '暗器机关、毒雾房间，识破陷阱反利用。',
    steps: [
      { type: 'puzzle', title: '拆解除机关', text: '毒系/暗系精灵感知陷阱。', reqTypes: ['POISON', 'DARK'] },
      { type: 'explore', title: '机关楼潜入', text: '避开毒雾区域。', reqTags: ['nocturnal'] },
      { type: 'boss', title: '机关楼主', enemyName: '千手罗刹幻影', bossId: 185, lvl: 62, drop: 8500 },
    ],
    reward: { gold: 10000, title: '机关大师', sectContrib: 100, scrollPage: 3 },
  },
  {
    id: 'sect_wudu', name: '五毒沼泽', icon: '☠️', reqBadges: 7, sectIds: [8],
    ecoRole: 'control', summary: '沼泽持续中毒，需解毒或毒抗，击败五毒蛊王。',
    steps: [
      { type: 'explore', title: '沼泽穿行', text: '毒系精灵免疫沼泽毒素。', reqTypes: ['POISON', 'BUG'] },
      { type: 'puzzle', title: '蛊阵破解', text: '不能乱杀毒虫，否则毒雾扩散。', reqTypes: ['POISON'] },
      { type: 'boss', title: '五毒蛊王', enemyName: '五毒蛊王', bossId: 277, lvl: 60, drop: 8000 },
    ],
    reward: { gold: 9500, title: '蛊术宗师', sectContrib: 110 },
  },
  {
    id: 'sect_gaibang', name: '破庙群雄会', icon: '🥊', reqBadges: 7, sectIds: [9],
    ecoRole: 'defense', summary: '连续群战，补给有限，以战养战。',
    steps: [
      { type: 'battle', title: '群战第一轮', enemyName: '流民武者', pool: [56, 62, 66], lvl: [48, 58], count: 3 },
      { type: 'battle', title: '群战第二轮', enemyName: '叛徒弟子', pool: [68, 72, 270], lvl: [52, 62], count: 3 },
      { type: 'boss', title: '丐帮叛徒', enemyName: '前任叛徒', bossId: 270, lvl: 64, drop: 8800 },
    ],
    reward: { gold: 10500, title: '群雄之首', sectContrib: 100 },
  },
  {
    id: 'sect_wudang', name: '真武太极阵', icon: '☯️', reqBadges: 8, sectIds: [12],
    ecoRole: 'defense', summary: '借力打力，反击为核心，不可硬拼。',
    steps: [
      { type: 'puzzle', title: '太极推演', text: '水系/超能精灵感悟阵法。', reqTypes: ['WATER', 'PSYCHIC'] },
      { type: 'battle', title: '阵法试炼', enemyName: '太极傀儡', pool: [141, 150, 307], lvl: [58, 68], count: 3 },
      { type: 'boss', title: '真武幻影', enemyName: '张三丰幻影', bossId: 150, lvl: 70, drop: 10000 },
    ],
    reward: { gold: 12000, title: '太极真人', sectContrib: 140, scrollPage: 2 },
  },
  {
    id: 'sect_emei', name: '金顶剑阵', icon: '🌸', reqBadges: 7, sectIds: [13, 11],
    ecoRole: 'burst', summary: '连击剑阵试炼，多段输出压制剑灵幻影。',
    steps: [
      { type: 'battle', title: '剑阵试炼', enemyName: '峨眉弟子', pool: [182, 281, 442], lvl: [48, 58], count: 3 },
      { type: 'boss', title: '灭绝幻影', enemyName: '灭绝师太幻影', bossId: 182, lvl: 62, drop: 8500 },
    ],
    reward: { gold: 9000, title: '金顶剑仙', sectContrib: 90 },
  },
  {
    id: 'sect_tiezhang', name: '铁掌崖', icon: '✋', reqBadges: 7, sectIds: [14, 9],
    ecoRole: 'burst', summary: '破甲重击试炼，高防目标压制。',
    steps: [
      { type: 'battle', title: '铁掌试炼', enemyName: '铁掌帮众', pool: [270, 337, 455], lvl: [50, 60], count: 3 },
      { type: 'boss', title: '裘千仞幻影', enemyName: '裘千仞幻影', bossId: 270, lvl: 64, drop: 9000 },
    ],
    reward: { gold: 9500, title: '铁掌宗师', sectContrib: 95 },
  },
  {
    id: 'sect_xuedao', name: '血刀谷', icon: '🩸', reqBadges: 7, sectIds: [15, 8],
    ecoRole: 'burst', summary: '嗜血持久战，低血爆发翻盘。',
    steps: [
      { type: 'battle', title: '血刀试炼', enemyName: '血刀门人', pool: [452, 185, 277], lvl: [52, 62], count: 3 },
      { type: 'boss', title: '血刀老祖幻影', enemyName: '血刀老祖幻影', bossId: 452, lvl: 66, drop: 9200 },
    ],
    reward: { gold: 9800, title: '血刀传人', sectContrib: 100 },
  },
  {
    id: 'sect_riyue', name: '黑木崖', icon: '☀️', reqBadges: 8, sectIds: [16, 4],
    ecoRole: 'burst', summary: '日月双态切换，奇偶回合战术试炼。',
    steps: [
      { type: 'puzzle', title: '日月阵法', text: '按奇偶回合切换攻击顺序。', reqTypes: ['PSYCHIC', 'DARK'] },
      { type: 'boss', title: '东方不败幻影', enemyName: '东方不败幻影', bossId: 185, lvl: 68, drop: 10000 },
    ],
    reward: { gold: 11000, title: '日月使者', sectContrib: 110, scrollPage: 2 },
  },
  {
    id: 'sect_hengshan', name: '恒山铁壁', icon: '🛡️', reqBadges: 7, sectIds: [17, 2],
    ecoRole: 'defense', summary: '屏障护盾试炼，守城防守核心。',
    steps: [
      { type: 'battle', title: '屏障试炼', enemyName: '恒山弟子', pool: [282, 150, 278], lvl: [48, 58], count: 3, objective: 'protect', objectiveTurns: 8 },
      { type: 'boss', title: '定闲幻影', enemyName: '定闲师太幻影', bossId: 282, lvl: 62, drop: 8800 },
    ],
    reward: { gold: 9200, title: '恒山守护者', sectContrib: 100 },
  },
  {
    id: 'sect_gumu', name: '古墓寒潭', icon: '🌙', reqBadges: 7, sectIds: [18, 3],
    ecoRole: 'counter', summary: '反击诱敌试炼，以静制动。',
    steps: [
      { type: 'battle', title: '玉女试炼', enemyName: '古墓守卫', pool: [263, 141, 371], lvl: [50, 60], count: 3 },
      { type: 'boss', title: '小龙女幻影', enemyName: '小龙女幻影', bossId: 263, lvl: 64, drop: 9000 },
    ],
    reward: { gold: 9400, title: '古墓传人', sectContrib: 95 },
  },
  {
    id: 'sect_tianlong', name: '天龙寺', icon: '📿', reqBadges: 8, sectIds: [19, 12],
    ecoRole: 'balance', summary: '六脉均衡试炼，全面发展无短板。',
    steps: [
      { type: 'puzzle', title: '六脉共鸣', text: '多属性精灵依次触发石柱。', reqTypes: ['PSYCHIC', 'NORMAL', 'LIGHT'] },
      { type: 'boss', title: '段誉幻影', enemyName: '段誉幻影', bossId: 150, lvl: 66, drop: 9500 },
    ],
    reward: { gold: 10000, title: '六脉传人', sectContrib: 110 },
  },
  {
    id: 'sect_kongtong', name: '崆峒险峰', icon: '⛰️', reqBadges: 7, sectIds: [20, 6],
    ecoRole: 'burst', summary: '背水一战，低血爆发试炼。',
    steps: [
      { type: 'battle', title: '七伤试炼', enemyName: '崆峒弟子', pool: [455, 270, 275], lvl: [52, 62], count: 3 },
      { type: 'boss', title: '崆峒五老幻影', enemyName: '崆峒五老幻影', bossId: 455, lvl: 65, drop: 9200 },
    ],
    reward: { gold: 9600, title: '崆峒武者', sectContrib: 100 },
  },
  {
    id: 'sect_tianshan', name: '天山雷狱', icon: '⚡', reqBadges: 7, sectIds: [21, 7],
    ecoRole: 'control', summary: '雷法麻痹控场，限制敌方行动。',
    steps: [
      { type: 'battle', title: '雷法试炼', enemyName: '天山弟子', pool: [292, 263, 488], lvl: [50, 60], count: 3 },
      { type: 'boss', title: '童姥幻影', enemyName: '天山童姥幻影', bossId: 292, lvl: 64, drop: 9000 },
    ],
    reward: { gold: 9300, title: '天山雷使', sectContrib: 95 },
  },
  {
    id: 'sect_xingxiu', name: '星宿海', icon: '⭐', reqBadges: 7, sectIds: [22, 8],
    ecoRole: 'control', summary: '化功削弱试炼，持续消耗战。',
    steps: [
      { type: 'explore', title: '星宿毒海', text: '毒系精灵识别污染源头。', reqTypes: ['POISON', 'DARK'] },
      { type: 'boss', title: '丁春秋幻影', enemyName: '丁春秋幻影', bossId: 277, lvl: 63, drop: 8800 },
    ],
    reward: { gold: 9100, title: '星宿毒师', sectContrib: 90 },
  },
  {
    id: 'sect_lingjiu', name: '灵鹫宫', icon: '🦅', reqBadges: 8, sectIds: [23, 5],
    ecoRole: 'control', summary: '威压削弱攻击，保护队友试炼。',
    steps: [
      { type: 'puzzle', title: '折梅手阵', text: '超能/妖精精灵感悟威压阵法。', reqTypes: ['PSYCHIC', 'FAIRY'] },
      { type: 'boss', title: '虚竹幻影', enemyName: '虚竹幻影', bossId: 141, lvl: 67, drop: 9800 },
    ],
    reward: { gold: 10500, title: '灵鹫宫主', sectContrib: 115 },
  },
  {
    id: 'sect_taishan', name: '泰山十八盘', icon: '🏔️', reqBadges: 7, sectIds: [24, 1],
    ecoRole: 'control', summary: '重压降速，控速先手试炼。',
    steps: [
      { type: 'battle', title: '重压试炼', enemyName: '泰山弟子', pool: [337, 455, 281], lvl: [48, 58], count: 3 },
      { type: 'boss', title: '天门道人幻影', enemyName: '天门道人幻影', bossId: 337, lvl: 62, drop: 8600 },
    ],
    reward: { gold: 8900, title: '泰山门人', sectContrib: 88 },
  },
  {
    id: 'sect_diancang', name: '点苍神射台', icon: '🎯', reqBadges: 7, sectIds: [25, 4],
    ecoRole: 'burst', summary: '精准狙击，高命中针对闪避型。',
    steps: [
      { type: 'battle', title: '神射试炼', enemyName: '点苍射手', pool: [281, 442, 514], lvl: [50, 60], count: 3 },
      { type: 'boss', title: '段正淳幻影', enemyName: '段正淳幻影', bossId: 281, lvl: 63, drop: 8700 },
    ],
    reward: { gold: 9000, title: '点苍神射', sectContrib: 90 },
  },
  {
    id: 'sect_hengshan_n', name: '衡山夜雨', icon: '🤝', reqBadges: 7, sectIds: [26, 9],
    ecoRole: 'synergy', summary: '同门协同试炼，团队增益核心。',
    steps: [
      { type: 'battle', title: '同门试炼', enemyName: '衡山弟子', pool: [182, 281, 270], lvl: [48, 58], count: 4 },
      { type: 'boss', title: '莫大幻影', enemyName: '莫大先生幻影', bossId: 182, lvl: 61, drop: 8400 },
    ],
    reward: { gold: 8800, title: '衡山同门', sectContrib: 85 },
  },
  {
    id: 'sect_xueshan', name: '雪山飞狐', icon: '❄️', reqBadges: 7, sectIds: [27, 7],
    ecoRole: 'weather', summary: '风雪天气联动，天时地利试炼。',
    steps: [
      { type: 'explore', title: '雪山穿行', text: '冰/风系精灵在风雪中探索。', reqTypes: ['ICE', 'WIND'] },
      { type: 'boss', title: '白自在幻影', enemyName: '白自在幻影', bossId: 263, lvl: 64, drop: 9000 },
    ],
    reward: { gold: 9400, title: '雪山剑客', sectContrib: 92 },
  },
  {
    id: 'sect_qingcheng', name: '青城快剑阁', icon: '⚔️', reqBadges: 7, sectIds: [28, 11],
    ecoRole: 'burst', summary: '首回合爆发，速攻先手试炼。',
    steps: [
      { type: 'battle', title: '快剑试炼', enemyName: '青城弟子', pool: [223, 319, 512], lvl: [48, 58], count: 3, objective: 'escape', objectiveTurns: 5 },
      { type: 'boss', title: '余沧海幻影', enemyName: '余沧海幻影', bossId: 223, lvl: 62, drop: 8600 },
    ],
    reward: { gold: 8700, title: '青城快剑', sectContrib: 88 },
  },
  {
    id: 'sect_songshan', name: '嵩山铁壁阵', icon: '🦁', reqBadges: 8, sectIds: [29, 2],
    ecoRole: 'defense', summary: '不屈护命，濒死防守试炼。',
    steps: [
      { type: 'battle', title: '铁壁试炼', enemyName: '嵩山弟子', pool: [278, 353, 437], lvl: [55, 65], count: 3, objective: 'protect', objectiveTurns: 10 },
      { type: 'boss', title: '左冷禅幻影', enemyName: '左冷禅幻影', bossId: 278, lvl: 68, drop: 9800 },
    ],
    reward: { gold: 10200, title: '嵩山铁壁', sectContrib: 120 },
  },
  {
    id: 'sect_shenxiao', name: '神霄雷坛', icon: '🌩️', reqBadges: 8, sectIds: [30, 10],
    ecoRole: 'burst', summary: '雷罚真伤，百分比伤害试炼。',
    steps: [
      { type: 'puzzle', title: '雷法阵', text: '电/光系精灵引雷破阵。', reqTypes: ['ELECTRIC', 'LIGHT'] },
      { type: 'boss', title: '林灵素幻影', enemyName: '神霄真人幻影', bossId: 292, lvl: 70, drop: 10500 },
    ],
    reward: { gold: 11500, title: '神霄雷使', sectContrib: 130, scrollPage: 3 },
  },
];

export function getSectRealmById(id) {
  return SECT_SECRET_REALMS.find(r => r.id === id);
}

export function getAvailableSectRealms(badgeCount, partySectIds = [], cleared = []) {
  return SECT_SECRET_REALMS.filter(r => {
    if (badgeCount < r.reqBadges || cleared.includes(r.id)) return false;
    if (!r.sectIds?.length) return true;
    return r.sectIds.some(sid => partySectIds.includes(sid));
  });
}
