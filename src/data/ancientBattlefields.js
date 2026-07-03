/** 四国古战场 — 名将将魂碎片与战术副本 */

export const BOSS_STAT_MULTIPLIER = 2.2;
export const BOSS_HP_MULTIPLIER = 3.0;

export const ANCIENT_BATTLEFIELDS = [
  {
    id: 'bf_chibi', name: '赤壁古战场', icon: '🔥', reqBadges: 7,
    theme: '火攻·风向·水域·连环',
    generalBonus: 'zhou_yu',
    summary: '火攻与风系联携，水域导电，过度火攻降低生态评分。',
    steps: [
      { type: 'puzzle', title: '风向观测', text: '风系精灵可扩大火势；需控制强度避免生态惩罚。', reqTypes: ['FIRE', 'FLYING'] },
      { type: 'battle', title: '连环船战', enemyName: '连环水军', pool: [22, 24, 26, 88], lvl: [55, 65], count: 4 },
      { type: 'boss', title: '赤壁都督', enemyName: '赤壁都督', bossId: 6, lvl: 68, drop: 10000 },
    ],
    reward: { gold: 12000, generalFragment: 'zhou_yu', title: '赤壁见证者' },
    ecologyPenalty: { vegetation: -8 },
    ecologyRecovery: { vegetation: 4, taskId: 'eco_chibi_replant' },
  },
  {
    id: 'bf_changban', name: '长坂坡古战场', icon: '🏇', reqBadges: 6,
    theme: '救援·突围·护送',
    generalBonus: 'zhao_yun',
    summary: '保护 NPC 和幼年精灵撤离，不能恋战。赵云将魂共鸣。',
    steps: [
      { type: 'explore', title: '突围路线', text: '小型精灵走隐蔽小路；飞行精灵侦查；土系堵路。', reqTags: ['small', 'flying'] },
      { type: 'battle', title: '追兵遭遇', enemyName: '追兵', pool: [65, 74, 95], lvl: [42, 52], count: 5, objective: 'escape', objectiveTurns: 8 },
      { type: 'boss', title: '曹军先锋', enemyName: '曹军先锋', bossId: 65, lvl: 58, drop: 8000, objective: 'protect', objectiveTurns: 10 },
    ],
    reward: { gold: 10000, generalFragment: 'zhao_yun', title: '长坂英雄' },
    ecologyPenalty: { stability: -3 },
    ecologyRecovery: { stability: 3, diversity: 2, taskId: 'eco_changban_calm' },
  },
  {
    id: 'bf_guandu', name: '官渡古战场', icon: '🌾', reqBadges: 8,
    theme: '粮草·奇袭·持久战',
    generalBonus: 'cao_cao',
    summary: '粮草管理，奇袭乌巢，曹操将魂战术。',
    steps: [
      { type: 'puzzle', title: '粮草调度', text: '完成国战护送粮草任务可跳过此步。', kwTask: 'kw_escort_grain' },
      { type: 'battle', title: '官渡对决', enemyName: '袁绍军', pool: [65, 95, 104], lvl: [62, 72], count: 4 },
      { type: 'boss', title: '颜良文丑', enemyName: '颜良', bossId: 95, lvl: 75, drop: 11000 },
    ],
    reward: { gold: 14000, generalFragment: 'cao_cao', title: '官渡战神' },
  },
  {
    id: 'bf_wuzhang', name: '五丈原古战场', icon: '☯️', reqBadges: 9,
    theme: '阵法·消耗·天象',
    generalBonus: 'zhuge_liang',
    summary: '诸葛亮阵法，元素联动，净化/守护战。',
    steps: [
      { type: 'puzzle', title: '八阵图', text: '诸葛亮将魂：跳过解谜步骤。', generalTactic: 'zhuge_liang' },
      { type: 'battle', title: '蜀魏对峙', enemyName: '魏军', pool: [87, 88, 132], lvl: [70, 82], count: 4, objective: 'purify' },
      { type: 'boss', title: '仲达', enemyName: '仲达', bossId: 200, lvl: 85, drop: 15000 },
    ],
    reward: { gold: 18000, generalFragment: 'zhuge_liang', title: '五丈原军师' },
  },
  {
    id: 'bf_yiling', name: '夷陵古战场', icon: '🌋', reqBadges: 8,
    theme: '火势蔓延·地形控制',
    generalBonus: 'lu_xun',
    summary: '火势蔓延控制，生态修复类任务中慎用火攻。陆逊将魂共鸣。',
    steps: [
      { type: 'battle', title: '连营火攻', enemyName: '蜀军', pool: [4, 6, 37, 74], lvl: [58, 68], count: 4 },
      { type: 'boss', title: '陆逊', enemyName: '陆逊', bossId: 37, lvl: 72, drop: 12000 },
    ],
    reward: { gold: 13000, generalFragment: 'lu_xun', title: '夷陵战术家' },
    ecologyPenalty: { vegetation: -10 },
    ecologyRecovery: { vegetation: 5, taskId: 'eco_yiling_restore' },
  },
  {
    id: 'bf_hefei', name: '合肥古战场', icon: '🏰', reqBadges: 7,
    theme: '少打多·守城·突袭',
    generalBonus: 'zhang_liao',
    summary: '守城战，以少敌多，据点保护。张辽将魂共鸣。',
    steps: [
      { type: 'battle', title: '守城战', enemyName: '孙权军', pool: [22, 24, 65], lvl: [52, 62], count: 6, objective: 'protect', objectiveTurns: 10 },
      { type: 'boss', title: '张辽突击', enemyName: '张辽', bossId: 104, lvl: 65, drop: 9000 },
    ],
    reward: { gold: 11000, generalFragment: 'zhang_liao', title: '合肥守将' },
    ecologyPenalty: { stability: -4 },
    ecologyRecovery: { stability: 4, taskId: 'eco_hefei_restore' },
  },
  {
    id: 'bf_xiangyang', name: '襄阳古战场', icon: '🏯', reqBadges: 8,
    theme: '围城·水淹·攻防',
    generalBonus: 'sima_yi',
    summary: '晋国战术副本，围城与智谋较量。司马懿将魂共鸣。',
    steps: [
      { type: 'puzzle', title: '围城布阵', text: '计算攻城器械调配顺序，可用机关门派跳过。', reqSectEco: 'puzzle' },
      { type: 'battle', title: '攻城战', enemyName: '守军', pool: [65, 87, 95, 104], lvl: [65, 75], count: 4 },
      { type: 'boss', title: '司马昭', enemyName: '司马昭', bossId: 132, lvl: 78, drop: 13000 },
    ],
    reward: { gold: 15000, generalFragment: 'sima_yi', title: '襄阳智将' },
  },
  {
    id: 'bf_mianzhu', name: '绵竹关古战场', icon: '⚔️', reqBadges: 9,
    theme: '强攻·破关·速战',
    generalBonus: 'deng_ai',
    summary: '晋国偷渡阴平、奇袭绵竹。邓艾将魂共鸣。',
    steps: [
      { type: 'explore', title: '阴平小道', text: '飞行/小型精灵可穿越险峻山道。', reqTags: ['small', 'flying'] },
      { type: 'battle', title: '绵竹攻防', enemyName: '蜀军', pool: [6, 65, 95, 130], lvl: [72, 82], count: 4 },
      { type: 'boss', title: '诸葛瞻', enemyName: '诸葛瞻', bossId: 130, lvl: 82, drop: 14000 },
    ],
    reward: { gold: 16000, generalFragment: 'deng_ai', title: '绵竹先锋' },
  },
];

export function getBattlefieldById(id) {
  return ANCIENT_BATTLEFIELDS.find(b => b.id === id);
}

export function getAvailableBattlefields(badgeCount, cleared = []) {
  return ANCIENT_BATTLEFIELDS.filter(b => badgeCount >= b.reqBadges && !cleared.includes(b.id));
}
