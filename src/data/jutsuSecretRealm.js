/** 忍术秘境 — 获取忍术卷轴与材料 */

export const JUTSU_SECRET_REALMS = [
  {
    id: 'realm_seal_forest',
    name: '封印之森',
    icon: '⛩️',
    reqBadges: 3,
    mapId: 1,
    summary: '结印机关、封印柱、感知解谜。错误属性召唤守卫。',
    mechanics: ['seal_pillars', 'element_sequence', 'perception_hint', 'fruit_seal_boss'],
    steps: [
      { type: 'puzzle', title: '封印柱激活', text: '按火→水→风顺序激活三根封印柱。感知精灵可提前识别顺序。', reqJutsu: ['FIRE', 'WATER', 'WIND'] },
      { type: 'battle', title: '守卫战', enemyName: '封印守卫', pool: [43, 44, 46], lvl: [28, 36], count: 3 },
      { type: 'boss', title: '封印之主', enemyName: '封印之主', bossId: 94, lvl: 40, drop: 5000 },
    ],
    reward: { gold: 6000, item: 'great', itemCount: 5, jutsuMastery: 50 },
    ecologyReward: { spirit: 10, stability: 8 },
  },
  {
    id: 'realm_shadow_cave',
    name: '影遁洞窟',
    icon: '🌑',
    reqBadges: 5,
    mapId: 7,
    summary: '潜入路线、分身解谜、查克拉节点。',
    mechanics: ['stealth_route', 'clone_puzzle', 'chakra_nodes'],
    steps: [
      { type: 'explore', title: '潜入入口', text: '小型/灵体标签精灵可走隐蔽小路。' },
      { type: 'puzzle', title: '分身机关', text: '需要分身忍术或暗系精灵诱导守卫。', reqTags: ['small', 'spirit'] },
      { type: 'battle', title: '影忍试炼', enemyName: '影忍', pool: [94, 132, 199], lvl: [45, 55], count: 3 },
    ],
    reward: { gold: 8000, jutsuMastery: 80 },
  },
  {
    id: 'realm_chakra_spring',
    name: '查克拉泉',
    icon: '💧',
    reqBadges: 7,
    mapId: 4,
    summary: '查克拉节点恢复、医疗忍术试炼。',
    mechanics: ['chakra_restore', 'heal_jutsu_trial'],
    steps: [
      { type: 'puzzle', title: '节点共鸣', text: '水/超能系精灵激活查克拉泉。', reqTypes: ['WATER', 'PSYCHIC'] },
      { type: 'battle', title: '医疗试炼', enemyName: '试炼傀儡', pool: [22, 24, 88], lvl: [50, 60], count: 2, objective: 'protect', objectiveTurns: 6 },
    ],
    reward: { gold: 10000, title: '查克拉行者' },
  },
];

export function getJutsuRealmById(id) {
  return JUTSU_SECRET_REALMS.find(r => r.id === id);
}

export function getAvailableJutsuRealms(badgeCount, cleared = []) {
  return JUTSU_SECRET_REALMS.filter(r => badgeCount >= r.reqBadges && !cleared.includes(r.id));
}
