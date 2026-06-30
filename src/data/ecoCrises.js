/** 生态危机 — 绑定地图区域，从世界地图区域卡触发调查 */

export const ECO_CRISES = [
  {
    id: 'crisis_forest_rampage',
    name: '森林灵兽暴走',
    mapId: 1,
    icon: '🌲',
    reqBadges: 2,
    color: '#2E7D32',
    summary: '微风草原的精灵突然变得极具攻击性，需要调查黑雾源头。',
    steps: [
      { type: 'explore', title: '现场勘查', text: '你在草原边缘发现被撕裂的树根，空气中弥漫着虚空能量残留。' },
      { type: 'puzzle', title: '追踪痕迹', text: '三条足迹通向不同方向。你选择了最浓黑雾的路径——正确！', choices: ['跟随黑雾', '绕行安全路', '原路返回'] },
      { type: 'battle', title: '驱散暴徒', enemyName: '暴走草系群', pool: [1, 2, 43, 44, 46], lvl: [12, 18], count: 3 },
      { type: 'boss', title: '净化核心', enemyName: '腐化树精', bossId: 117, lvl: 22, drop: 3500 },
    ],
    reward: { gold: 4000, item: 'great_ball', itemCount: 5 },
  },
  {
    id: 'crisis_black_lake',
    name: '湖水变黑',
    mapId: 4,
    icon: '🌊',
    reqBadges: 3,
    color: '#0277BD',
    summary: '深蓝海域的水质急剧恶化，水下精灵濒临窒息。',
    steps: [
      { type: 'explore', title: '取样分析', text: '湖水散发着金属腥味，底部有不明管道在排放废液。' },
      { type: 'battle', title: '清除污染者', enemyName: '受污精灵', pool: [22, 24, 26, 88, 89], lvl: [30, 38], count: 4 },
      { type: 'puzzle', title: '关闭阀门', text: '你找到了三个阀门，按正确顺序关闭后水流恢复清澈。' },
      { type: 'boss', title: '深渊守卫', enemyName: '墨渊巨牙', bossId: 23, lvl: 42, drop: 5000 },
    ],
    reward: { gold: 5500, item: 'hyper_potion', itemCount: 8 },
  },
  {
    id: 'crisis_red_aurora',
    name: '雪原红色极光',
    mapId: 9,
    icon: '❄️',
    reqBadges: 7,
    color: '#4FC3F7',
    summary: '极寒冻土上空出现血色极光，冰系精灵行为异常。',
    steps: [
      { type: 'explore', title: '极光观测', text: '极光频率与地下震动同步，似乎有巨型生物在冰层下苏醒。' },
      { type: 'battle', title: '冰原遭遇', enemyName: '狂乱冰系群', pool: [86, 87, 91, 124, 144], lvl: [68, 78], count: 4 },
      { type: 'puzzle', title: '破冰仪式', text: '你用火系技能融化冰柱，露出了通往地下的裂隙。' },
      { type: 'boss', title: '极光之主', enemyName: '赤极光兽', bossId: 199, lvl: 86, drop: 8000 },
    ],
    reward: { gold: 9000, item: 'ice_stone', itemCount: 1 },
  },
  {
    id: 'crisis_desert_freeze',
    name: '荒漠夜晚结冰',
    mapId: 10,
    icon: '🏜️',
    reqBadges: 8,
    color: '#FF8F00',
    summary: '流沙荒漠夜间气温骤降，地面结冰，地面系精灵被困。',
    steps: [
      { type: 'explore', title: '昼夜调查', text: '沙地下方检测到极寒能量脉动，与雪原极光同源。' },
      { type: 'puzzle', title: '寻找热源', text: '你在沙丘下找到了古代火系祭坛，重新点燃后冰层开始融化。' },
      { type: 'battle', title: '冰封守卫', enemyName: '冰沙傀儡', pool: [27, 50, 74, 95, 104], lvl: [75, 85], count: 5 },
      { type: 'boss', title: '寒沙龙王', enemyName: '寒沙龙王', bossId: 184, lvl: 90, drop: 10000 },
    ],
    reward: { gold: 11000, item: 'fire_stone', itemCount: 1 },
  },
  {
    id: 'crisis_robot_rampage',
    name: '机械灵兽失控',
    mapId: 6,
    icon: '🤖',
    reqBadges: 5,
    color: '#546E7A',
    summary: '赛博都市的自律型机械精灵大规模失控，威胁市民安全。',
    steps: [
      { type: 'explore', title: '城市巡查', text: '中央控制塔被黑客入侵，机械精灵接收了错误指令。' },
      { type: 'battle', title: '镇压失控机', enemyName: '失控机械组', pool: [35, 40, 87, 88, 132], lvl: [45, 55], count: 4 },
      { type: 'puzzle', title: '入侵防火墙', text: '你成功输入三段密钥，控制塔恢复部分权限。' },
      { type: 'boss', title: '核心主机', enemyName: '失控主脑', bossId: 140, lvl: 58, drop: 6500 },
    ],
    reward: { gold: 7000, item: 'thunder_stone', itemCount: 1 },
  },
];

export function getEcoCrisisByMapId(mapId) {
  return ECO_CRISES.find(c => c.mapId === mapId);
}

export function getEcoCrisisById(id) {
  return ECO_CRISES.find(c => c.id === id);
}
