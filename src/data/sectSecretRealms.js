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
