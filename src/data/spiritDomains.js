/** 灵域试炼 — 绑定各地图道馆，机制型挑战 */

export const SPIRIT_DOMAIN_RULES = {
  forest_growth: {
    id: 'forest_growth', name: '生长战场', icon: '🌿',
    desc: '每3回合藤蔓生长；木系站藤蔓回血；火系烧藤但全场灼烧',
    vineGrowInterval: 3, vineBlockChance: 0.35, grassHealPct: 0.05, fireBurnField: true,
  },
  fire_heat: {
    id: 'fire_heat', name: '持续高温', icon: '🔥',
    desc: '水系技能+1PP；每回合非火系受到少量灼热伤害',
    waterPPExtra: 1, heatDotPct: 0.02, heatTypes: ['FIRE', 'ROCK', 'GROUND'],
  },
  mirror_lake: {
    id: 'mirror_lake', name: '技能回声', icon: '🪞',
    desc: '敌方延迟复制你上一招；辅助技复制收益翻倍；大招被复制反伤',
    echoDelay: 1, supportEchoDouble: true, bigMoveRecoil: 0.15,
  },
  wind_tower: {
    id: 'wind_tower', name: '速度即资源', icon: '💨',
    desc: '速度快者多行动；疲劳满则跳过；风眼格每5回合清除疲劳',
    fatiguePerFastAction: 25, fatigueThreshold: 100, windEyeInterval: 5, followUpPower: 0.35,
  },
  dark_moon: {
    id: 'dark_moon', name: '信息不完整', icon: '🌑',
    desc: '敌方属性/HP/技能部分隐藏；光/超能系可侦查揭示',
    hideHp: true, hideTypes: true, scoutTypes: ['FAIRY', 'PSYCHIC'],
  },
};

export const SPIRIT_DOMAINS = [
  {
    id: 'domain_forest', name: '森之灵域', mapId: 1, icon: '🌲', rule: 'forest_growth',
    reqBadges: 1, leaderId: 117, leaderName: '森守·莉佳', gymLvl: 20,
    pool: [1, 2, 3, 43, 44, 46, 102, 152, 161],
    reward: { gold: 2500, title: '森之守护者' },
    tips: '火系烧藤快但有代价，木系可反向利用藤蔓回血',
  },
  {
    id: 'domain_water', name: '镜湖灵域', mapId: 4, icon: '🪞', rule: 'mirror_lake',
    reqBadges: 3, leaderId: 23, leaderName: '湖影·小霞', gymLvl: 42,
    pool: [22, 24, 26, 28, 30, 76, 120, 134, 158],
    reward: { gold: 4000, title: '镜湖行者' },
    tips: '先放护盾再群攻，避免大招被回声反打',
  },
  {
    id: 'domain_fire', name: '火之灵域', mapId: 5, icon: '🌋', rule: 'fire_heat',
    reqBadges: 4, leaderId: 106, leaderName: '炎心·夏伯', gymLvl: 50,
    pool: [11, 12, 13, 14, 15, 97, 104, 155, 193],
    reward: { gold: 5000, title: '烈焰征服者' },
    tips: '火系免疫灼热，水系需要更多PP',
  },
  {
    id: 'domain_dark', name: '暗月灵域', mapId: 7, icon: '🌑', rule: 'dark_moon',
    reqBadges: 6, leaderId: 56, leaderName: '月影·松叶', gymLvl: 70,
    pool: [18, 54, 55, 56, 90, 93, 94, 200, 292],
    reward: { gold: 6500, title: '暗月猎手' },
    tips: '带妖精/超能系侦查，观察敌人动作判断属性',
  },
  {
    id: 'domain_wind', name: '风塔灵域', mapId: 8, icon: '🗼', rule: 'wind_tower',
    reqBadges: 7, leaderId: 138, leaderName: '风塔长老', gymLvl: 82,
    pool: [3, 7, 9, 13, 15, 138, 182, 196, 249],
    reward: { gold: 8000, title: '风塔大师' },
    tips: '高速爆发需控制疲劳，稳健队等风眼回合',
  },
];

/** 旧规则 ID 兼容映射 */
const RULE_ALIAS = {
  forest_vine: 'forest_growth',
  mirror_lake: 'mirror_lake',
  fire_heat: 'fire_heat',
  wind_tower: 'wind_tower',
  dark_moon: 'dark_moon',
};

export function getSpiritDomainByMapId(mapId) {
  return SPIRIT_DOMAINS.find(d => d.mapId === mapId);
}

export function getSpiritDomainRule(ruleId) {
  const id = RULE_ALIAS[ruleId] || ruleId;
  return SPIRIT_DOMAIN_RULES[id] || SPIRIT_DOMAIN_RULES[ruleId];
}
