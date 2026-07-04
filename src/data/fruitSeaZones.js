/** 恶魔果实海域 — 果实试炼与觉醒材料 */

export const FRUIT_SEA_ZONES = [
  {
    id: 'zone_sunken_orchard',
    name: '沉水果园',
    icon: '🍎',
    reqBadges: 5,
    mapId: 4,
    summary: '古代果园沉入海底。绑定果实的精灵水域受限，水系精灵开路。',
    mechanics: ['water_restriction', 'fruit_trial', 'fruit_copy_boss'],
    steps: [
      { type: 'explore', title: '海底入口', text: '水系精灵可开路；土系筑起临时陆地；冰系冻结水面。', reqTypes: ['WATER'] },
      { type: 'puzzle', title: '果实共鸣', text: '封印忍术可暂时稳定暴走果实能量。', reqJutsu: ['WATER'] },
      { type: 'battle', title: '果实守卫', enemyName: '果实守卫', pool: [22, 24, 26], lvl: [42, 52], count: 3, objective: 'capture_alive', objectiveTurns: 12 },
      { type: 'boss', title: '复制之树', enemyName: '复制之树', bossId: 3, lvl: 55, drop: 8000 },
    ],
    reward: { gold: 9000, item: 'fire_stone', itemCount: 1, fruitTrialClear: true },
    ecologyReward: { water: 15, spirit: 10 },
  },
  {
    id: 'zone_storm_archipelago',
    name: '风暴群岛',
    icon: '🌊',
    reqBadges: 6,
    mapId: 8,
    summary: '暴风海域中的群岛，果实能量与雷电交织。飞行系和风系精灵有优势。',
    mechanics: ['storm_field', 'fruit_lightning', 'island_hop'],
    steps: [
      { type: 'explore', title: '群岛登陆', text: '飞行/风系精灵穿越暴风区；水系精灵可从水下绕行。', reqTypes: ['FLYING', 'WIND'] },
      { type: 'puzzle', title: '雷电导向', text: '将雷电引导至果实祭坛，电系精灵可加速。', reqTypes: ['ELECTRIC'] },
      { type: 'battle', title: '风暴守卫', enemyName: '风暴守卫', pool: [35, 37, 40], lvl: [50, 60], count: 3 },
      { type: 'boss', title: '雷暴巨鹰', enemyName: '雷暴巨鹰', bossId: 33, lvl: 62, drop: 9000 },
    ],
    reward: { gold: 10000, item: 'thunder_stone', itemCount: 1, fruitTrialClear: true },
    ecologyReward: { spirit: 12, stability: 8 },
  },
  {
    id: 'zone_frozen_depths',
    name: '冰封深渊',
    icon: '❄️',
    reqBadges: 7,
    mapId: 9,
    summary: '极寒海底洞穴，果实能量被冰封。需火系或格斗系破冰。',
    mechanics: ['ice_restriction', 'frozen_fruit', 'heat_puzzle'],
    steps: [
      { type: 'explore', title: '冰层潜入', text: '冰系精灵免疫寒冷；火系精灵可融化冰壁。', reqTypes: ['ICE', 'FIRE'] },
      { type: 'puzzle', title: '解冻果实', text: '按温度梯度依次解冻三颗被封印的果实核心。', reqTypes: ['FIRE', 'FIGHT'] },
      { type: 'battle', title: '冰封卫士', enemyName: '冰封卫士', pool: [86, 87, 131], lvl: [58, 68], count: 3, objective: 'protect', objectiveTurns: 10 },
      { type: 'boss', title: '冰渊之主', enemyName: '冰渊之主', bossId: 69, lvl: 72, drop: 10000 },
    ],
    reward: { gold: 12000, item: 'ice_stone', itemCount: 1, fruitTrialClear: true },
    ecologyReward: { water: 10, stability: 12 },
  },
  {
    id: 'zone_gravity_rift',
    name: '重力裂隙',
    icon: '🌀',
    reqBadges: 13,
    mapId: 106,
    summary: '古代核心改变重力。飞行压制，重型精灵稳定。',
    mechanics: ['gravity_field', 'heavy_advantage', 'fruit_gravity_contest'],
    steps: [
      { type: 'explore', title: '裂隙观测', text: '星机阁心法可提前关闭部分机关。', reqSectEco: 'puzzle' },
      { type: 'battle', title: '重力狂化', enemyName: '重力精灵', pool: [86, 87, 144], lvl: [75, 85], count: 4, objective: 'escape', objectiveTurns: 10 },
      { type: 'boss', title: '重力核心', enemyName: '重力核心', bossKey: 'stellar_whale', bossId: 199, lvl: 88, drop: 12000 },
    ],
    reward: { gold: 15000, fruitTrialClear: true, title: '重力行者' },
    ecologyReward: { spirit: 15, diversity: 8 },
  },
];

export function getFruitSeaZoneById(id) {
  return FRUIT_SEA_ZONES.find(z => z.id === id);
}

export function getAvailableFruitSeaZones(badgeCount, cleared = []) {
  return FRUIT_SEA_ZONES.filter(z => badgeCount >= z.reqBadges && !cleared.includes(z.id));
}
