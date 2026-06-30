/** 生态危机 / 灵灾调查 — 探索、推理、分支、战斗结合 */

export const MORAL_BRANCHES = {
  fight: { id: 'fight', label: '⚔️ 战斗压制', desc: '快速解决，但生态恢复慢', ecology: { pollution: -15, stability: 10 }, bossMult: 1.0 },
  soothe: { id: 'soothe', label: '🤝 安抚救助', desc: '需要条件，高亲密稀有结契', ecology: { stability: 20, diversity: 10 }, bossMult: 0.85, reqTypes: ['FAIRY', 'NORMAL'] },
  heal: { id: 'heal', label: '🌿 生态修复', desc: '最复杂，区域永久收益', ecology: { vegetation: 25, pollution: -25, water: 15 }, bossMult: 0.8, reqTypes: ['GRASS', 'FAIRY'] },
  trade: { id: 'trade', label: '💰 资源交换', desc: '花费资源换取捷径', cost: { gold: 3000 }, ecology: { stability: 5 }, bossMult: 1.1 },
  relocate: { id: 'relocate', label: '🏠 迁移巢穴', desc: '帮它寻找新巢穴，生态恢复最佳', cost: { gold: 1500 }, ecology: { stability: 25, diversity: 15 }, bossMult: 0.9, reqTypes: ['GROUND', 'ROCK'] },
};

export const ECO_CRISES = [
  {
    id: 'crisis_forest_rampage',
    name: '失眠的森林',
    mapId: 1,
    icon: '🌲',
    reqBadges: 2,
    color: '#2E7D32',
    summary: '青藤林灵兽连续失眠暴走，需要调查银色粉末与异常回声的真正原因。',
    branches: ['fight', 'heal', 'trade'],
    branchPrompt: '调查后发现商人采走了月眠草。你打算如何解决？',
    steps: [
      { type: 'explore', title: '现场勘查', text: '树上有银色粉末，水源附近有异常回声，夜间传来奇怪铃声。眠菇兽的孢子似乎失效了。' },
      { type: 'puzzle', title: '追踪线索', text: '三条足迹通向不同方向。最浓黑雾的路径通向被采空的月眠草田——真相浮现！', choices: ['调查药田', '追踪黑雾', '询问村民'] },
      { type: 'branch', title: '选择对策' },
      { type: 'battle', title: '驱散暴徒', enemyName: '暴走草系群', pool: [1, 2, 43, 44, 46], lvl: [12, 18], count: 3 },
      { type: 'boss', title: '黑藤鹿王', enemyName: '黑藤鹿王', bossKey: 'black_vine_king', bossId: 117, lvl: 24, drop: 4000 },
    ],
    reward: { gold: 4000, item: 'great_ball', itemCount: 5 },
    ecologyReward: { vegetation: 20, pollution: -20, stability: 15 },
  },
  {
    id: 'crisis_black_lake',
    name: '湖水变黑',
    mapId: 4,
    icon: '🌊',
    reqBadges: 3,
    color: '#0277BD',
    summary: '深蓝海域水质恶化，需要调查污染源并应对镜湖异象。',
    branches: ['fight', 'heal', 'soothe'],
    branchPrompt: '湖水变黑源于管道排污与镜湖巨蚌躁动。你选择？',
    steps: [
      { type: 'explore', title: '取样分析', text: '湖水散发金属腥味，底部有不明管道排放废液。水面倒影似乎在移动…' },
      { type: 'battle', title: '清除污染者', enemyName: '受污精灵', pool: [22, 24, 26, 88, 89], lvl: [30, 38], count: 4 },
      { type: 'puzzle', title: '关闭阀门', text: '按正确顺序关闭三个阀门后，水流恢复清澈，但湖心仍有异象。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '镜湖巨蚌', enemyName: '镜湖巨蚌', bossKey: 'mirror_giant_clam', bossId: 23, lvl: 44, drop: 5500 },
    ],
    reward: { gold: 5500, item: 'hyper_potion', itemCount: 8 },
    ecologyReward: { water: 30, pollution: -25, spirit: 10 },
  },
  {
    id: 'crisis_red_aurora',
    name: '雪原红色极光',
    mapId: 9,
    icon: '❄️',
    reqBadges: 7,
    color: '#4FC3F7',
    summary: '极寒冻土上空出现血色极光，冰系精灵行为异常。',
    branches: ['fight', 'soothe'],
    branchPrompt: '极光源于地下巨型生物苏醒。你打算？',
    steps: [
      { type: 'explore', title: '极光观测', text: '极光频率与地下震动同步，冰系精灵集体朝向震源低鸣。' },
      { type: 'battle', title: '冰原遭遇', enemyName: '狂乱冰系群', pool: [86, 87, 91, 124, 144], lvl: [68, 78], count: 4 },
      { type: 'puzzle', title: '破冰仪式', text: '用火系技能融化冰柱，露出通往地下的裂隙。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '极光之主', enemyName: '赤极光兽', bossId: 199, lvl: 86, drop: 8000 },
    ],
    reward: { gold: 9000, item: 'ice_stone', itemCount: 1 },
    ecologyReward: { spirit: 15, stability: 10 },
  },
  {
    id: 'crisis_desert_freeze',
    name: '荒漠夜晚结冰',
    mapId: 10,
    icon: '🏜️',
    reqBadges: 8,
    color: '#FF8F00',
    summary: '流沙荒漠夜间气温骤降，与雪原极光同源的寒能脉动。',
    branches: ['fight', 'heal', 'trade'],
    branchPrompt: '寒能来自地下古代祭坛失衡。你打算？',
    steps: [
      { type: 'explore', title: '昼夜调查', text: '沙地下方检测到极寒能量，白天火系灵兽焦躁，夜晚地面结冰。' },
      { type: 'puzzle', title: '寻找热源', text: '在沙丘下找到古代火系祭坛，重新点燃后冰层开始融化。' },
      { type: 'branch', title: '选择对策' },
      { type: 'battle', title: '冰封守卫', enemyName: '冰沙傀儡', pool: [27, 50, 74, 95, 104], lvl: [75, 85], count: 5 },
      { type: 'boss', title: '寒沙龙王', enemyName: '寒沙龙王', bossId: 184, lvl: 90, drop: 10000 },
    ],
    reward: { gold: 11000, item: 'fire_stone', itemCount: 1 },
    ecologyReward: { stability: 20, diversity: 10 },
  },
  {
    id: 'crisis_robot_rampage',
    name: '机械灵兽失控',
    mapId: 6,
    icon: '🤖',
    reqBadges: 5,
    color: '#546E7A',
    summary: '赛博都市机械精灵大规模失控，中央控制塔被入侵。',
    branches: ['fight', 'trade', 'soothe'],
    branchPrompt: '黑客入侵了控制塔。你打算？',
    steps: [
      { type: 'explore', title: '城市巡查', text: '机械精灵接收错误指令，市民撤离中。控制塔防火墙有漏洞。' },
      { type: 'battle', title: '镇压失控机', enemyName: '失控机械组', pool: [35, 40, 87, 88, 132], lvl: [45, 55], count: 4 },
      { type: 'puzzle', title: '入侵防火墙', text: '成功输入三段密钥，控制塔恢复部分权限。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '失控主脑', enemyName: '失控主脑', bossId: 140, lvl: 58, drop: 6500 },
    ],
    reward: { gold: 7000, item: 'thunder_stone', itemCount: 1 },
    ecologyReward: { stability: 25, pollution: -15 },
  },
];

export function getEcoCrisisByMapId(mapId) {
  return ECO_CRISES.find(c => c.mapId === mapId);
}

export function getEcoCrisisById(id) {
  return ECO_CRISES.find(c => c.id === id);
}

export function getMoralBranch(branchId) {
  return MORAL_BRANCHES[branchId] || null;
}

export function checkBranchRequirements(branchId, party) {
  const br = MORAL_BRANCHES[branchId];
  if (!br?.reqTypes) return { ok: true };
  const hasType = (party || []).some(p => {
    const types = [p.type, p.secondaryType, p.type2].filter(Boolean);
    return br.reqTypes.some(t => types.includes(t));
  });
  return { ok: hasType, reqTypes: br.reqTypes };
}
