export const EXPEDITION_BRANCH_EVENTS = [
  {
    id: 'fork_road',
    title: '岔路口',
    desc: '探险队发来讯号：前方出现岔路，如何前进？',
    choices: [
      { id: 'safe', label: '🛡️ 稳妥前行', desc: '奖励×0.9，零风险', rewardMult: 0.9, failChance: 0 },
      { id: 'scout', label: '🔍 侦查探路', desc: '奖励×1.25，小概率受阻', rewardMult: 1.25, failChance: 0.15 },
      { id: 'charge', label: '⚔️ 强行突破', desc: '奖励×1.6，可能遭遇伏击', rewardMult: 1.6, failChance: 0.35 },
    ],
  },
  {
    id: 'ancient_ruins',
    title: '古代遗迹',
    desc: '发现一处半塌的遗迹，队伍请求指示。',
    choices: [
      { id: 'safe', label: '📜 记录坐标', desc: '奖励×1.0，稳妥撤离', rewardMult: 1.0, failChance: 0 },
      { id: 'scout', label: '🏺 小心发掘', desc: '奖励×1.35', rewardMult: 1.35, failChance: 0.2 },
      { id: 'charge', label: '💥 破墙而入', desc: '奖励×1.7，陷阱风险高', rewardMult: 1.7, failChance: 0.4 },
    ],
  },
  {
    id: 'wild_pack',
    title: '野生群落',
    desc: '大量野生精灵挡住去路，它们似乎有领袖。',
    choices: [
      { id: 'safe', label: '🌿 绕路而行', desc: '奖励×0.85，避免冲突', rewardMult: 0.85, failChance: 0 },
      { id: 'scout', label: '🎣 引开首领', desc: '奖励×1.3', rewardMult: 1.3, failChance: 0.18 },
      { id: 'charge', label: '⚡ 正面驱逐', desc: '奖励×1.55，可能受伤减益', rewardMult: 1.55, failChance: 0.3 },
    ],
  },
];

export function pickExpeditionBranchEvent() {
  return EXPEDITION_BRANCH_EVENTS[Math.floor(Math.random() * EXPEDITION_BRANCH_EVENTS.length)];
}

export const EXPEDITION_EVENTS = [
  '🌿 探险队在灌木丛中发现了隐藏的宝箱！',
  '⚔️ 遭遇了一群野生精灵的围攻，成功击退了它们！',
  '🗺️ 找到了一张古老的藏宝图碎片...',
  '🏕️ 在安全的洞穴中休息了一会儿，恢复了体力。',
  '🌟 发现了一处散发着奇异光芒的矿脉！',
  '🦅 一只友善的飞行精灵帮助探险队跨越了峡谷。',
  '🌊 渡过了湍急的河流，在对岸发现了稀有素材。',
  '🔮 遇到了一位神秘的隐者，获得了他的祝福。',
  '💎 在岩壁裂缝中发现了闪闪发光的宝石！',
  '🌈 彩虹桥出现了，引导探险队到达了秘密区域。',
];

export const EXPEDITION_ZONES = [
  {
    id: 'dark_forest', name: '幽暗森林', icon: '🌲', desc: '浓雾笼罩的神秘森林，草系、虫系和毒系精灵的乐园',
    color: '#2E7D32', reqBadges: 0, duration: 3 * 60 * 1000,
    bonusTypes: ['GRASS', 'BUG', 'POISON'],
    bonusMultiplier: 1.3,
    rewards: [
      { type: 'gold', min: 500, max: 1500, weight: 40 },
      { type: 'med', id: 'potion', count: 3, weight: 30 },
      { type: 'stone', id: 'leaf_stone', count: 1, weight: 15 },
      { type: 'berry', count: 5, weight: 15 },
    ]
  },
  {
    id: 'volcano', name: '火山洞窟', icon: '🌋', desc: '炽热的岩浆地带，火系、岩石系和地面系精灵聚集',
    color: '#D84315', reqBadges: 2, duration: 5 * 60 * 1000,
    bonusTypes: ['FIRE', 'ROCK', 'GROUND'],
    bonusMultiplier: 1.3,
    rewards: [
      { type: 'gold', min: 1000, max: 3000, weight: 35 },
      { type: 'stone', id: 'fire_stone', count: 1, weight: 25 },
      { type: 'med', id: 'potion', count: 5, weight: 20 },
      { type: 'mineral', id: 'copper', count: 3, weight: 20 },
    ]
  },
  {
    id: 'deep_sea', name: '深海遗迹', icon: '🏛️', desc: '沉没的古代文明，水系、冰系和龙系精灵守护着秘密',
    color: '#0277BD', reqBadges: 4, duration: 8 * 60 * 1000,
    bonusTypes: ['WATER', 'ICE', 'DRAGON'],
    bonusMultiplier: 1.4,
    rewards: [
      { type: 'gold', min: 2000, max: 5000, weight: 30 },
      { type: 'stone', id: 'water_stone', count: 1, weight: 20 },
      { type: 'tm', weight: 25 },
      { type: 'mineral', id: 'silver', count: 2, weight: 25 },
    ]
  },
  {
    id: 'sky_city', name: '天空之城', icon: '🏰', desc: '云端之上的浮空城堡，飞行系、超能力系和妖精系的圣地',
    color: '#7E57C2', reqBadges: 6, duration: 12 * 60 * 1000,
    bonusTypes: ['FLYING', 'PSYCHIC', 'FAIRY'],
    bonusMultiplier: 1.4,
    rewards: [
      { type: 'gold', min: 3000, max: 8000, weight: 25 },
      { type: 'accessory', count: 1, weight: 30 },
      { type: 'mineral', id: 'gold_ore', count: 2, weight: 25 },
      { type: 'tm', weight: 20 },
    ]
  },
  {
    id: 'time_rift', name: '时空裂隙', icon: '🌀', desc: '连接异次元的裂缝，幽灵系、恶系和钢系精灵在此游荡',
    color: '#4527A0', reqBadges: 8, duration: 12 * 60 * 1000,
    bonusTypes: ['GHOST', 'DARK', 'STEEL'],
    bonusMultiplier: 1.5,
    rewards: [
      { type: 'gold', min: 5000, max: 12000, weight: 20 },
      { type: 'egg', level: 40, weight: 25 },
      { type: 'mineral', id: 'jade', count: 1, weight: 30 },
      { type: 'mineral', id: 'stardust', count: 1, weight: 25 },
    ]
  },
  {
    id: 'divine_realm', name: '神域秘境', icon: '✨', desc: '传说中神兽栖息的净土，所有属性都能获得加成',
    color: '#FFB300', reqBadges: 10, duration: 15 * 60 * 1000,
    bonusTypes: ['ALL'],
    bonusMultiplier: 1.5,
    rewards: [
      { type: 'gold', min: 8000, max: 20000, weight: 18 },
      { type: 'mineral', id: 'stardust', count: 2, weight: 22 },
      { type: 'accessory', count: 1, weight: 20 },
      { type: 'shiny_egg', level: 50, weight: 15 },
      { type: 'egg', level: 60, weight: 25 },
    ]
  },
  {
    id: 'ninja_war', name: '忍界大战战场', icon: '🍥', desc: '第四次忍界大战的遗迹，火系、格斗系、电系、风系精灵获得加成',
    color: '#FF6F00', reqBadges: 6, duration: 12 * 60 * 1000,
    bonusTypes: ['FIRE', 'FIGHT', 'ELECTRIC', 'WIND'],
    bonusMultiplier: 1.45,
    rewards: [
      { type: 'gold', min: 3000, max: 8000, weight: 20 },
      { type: 'tm', weight: 20 },
      { type: 'accessory', count: 1, weight: 25 },
      { type: 'mineral', id: 'gold_ore', count: 2, weight: 10 },
      { type: 'jutsu_scroll', count: 1, weight: 15 },
      { type: 'egg', level: 45, weight: 15 },
    ]
  }
];

export function calcExpeditionBonus(teamPets, zone) {
  if (!teamPets || !zone || !zone.bonusTypes) return 1.0;
  const isAllType = zone.bonusTypes.includes('ALL');
  const matchCount = teamPets.filter(p => {
    if (!p) return false;
    if (isAllType) return true;
    return zone.bonusTypes.includes(p.type) || zone.bonusTypes.includes(p.secondaryType);
  }).length;
  const maxMatches = isAllType ? Math.min(matchCount, 3) : matchCount;
  const typeBonus = maxMatches > 0 ? 1 + maxMatches * 0.15 : 1.0;
  const zoneMult = zone.bonusMultiplier || 1.0;
  return typeBonus * zoneMult;
}

export const DEFAULT_EXPEDITIONS = {
  teams: [],
  lastDate: '',
  startedToday: 0,
  speedBoosts: 0, // 预留字段，暂未实现
};
