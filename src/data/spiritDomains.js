/** 灵域试炼 — 绑定各地图道馆，进入道馆时可选择挑战 */

export const SPIRIT_DOMAIN_RULES = {
  forest_vine: { id: 'forest_vine', name: '藤蔓封锁', icon: '🌿', desc: '每回合有35%概率藤蔓封锁，本回合技能无效' },
  fire_heat: { id: 'fire_heat', name: '持续高温', icon: '🔥', desc: '水系技能额外消耗1点PP' },
  mirror_lake: { id: 'mirror_lake', name: '镜湖倒影', icon: '🪞', desc: '敌方会复制你上一招进行反击' },
  wind_tower: { id: 'wind_tower', name: '风塔乱流', icon: '💨', desc: '速度更高的一方追加30%威力的追击' },
  dark_moon: { id: 'dark_moon', name: '暗月遮蔽', icon: '🌑', desc: '敌方属性与技能信息部分隐藏' },
};

export const SPIRIT_DOMAINS = [
  {
    id: 'domain_forest', name: '森之灵域', mapId: 1, icon: '🌲', rule: 'forest_vine',
    reqBadges: 1, leaderId: 117, leaderName: '森守·莉佳', gymLvl: 20,
    pool: [1, 2, 3, 43, 44, 46, 102, 152, 161],
    reward: { gold: 2500, title: '森之守护者' },
  },
  {
    id: 'domain_water', name: '镜湖灵域', mapId: 4, icon: '🪞', rule: 'mirror_lake',
    reqBadges: 3, leaderId: 23, leaderName: '湖影·小霞', gymLvl: 42,
    pool: [22, 24, 26, 28, 30, 76, 120, 134, 158],
    reward: { gold: 4000, title: '镜湖行者' },
  },
  {
    id: 'domain_fire', name: '火之灵域', mapId: 5, icon: '🌋', rule: 'fire_heat',
    reqBadges: 4, leaderId: 106, leaderName: '炎心·夏伯', gymLvl: 50,
    pool: [11, 12, 13, 14, 15, 97, 104, 155, 193],
    reward: { gold: 5000, title: '烈焰征服者' },
  },
  {
    id: 'domain_dark', name: '暗月灵域', mapId: 7, icon: '🌑', rule: 'dark_moon',
    reqBadges: 6, leaderId: 56, leaderName: '月影·松叶', gymLvl: 70,
    pool: [18, 54, 55, 56, 90, 93, 94, 200, 292],
    reward: { gold: 6500, title: '暗月猎手' },
  },
  {
    id: 'domain_wind', name: '风塔灵域', mapId: 8, icon: '🗼', rule: 'wind_tower',
    reqBadges: 7, leaderId: 138, leaderName: '风塔长老', gymLvl: 82,
    pool: [3, 7, 9, 13, 15, 138, 182, 196, 249],
    reward: { gold: 8000, title: '风塔大师' },
  },
];

export function getSpiritDomainByMapId(mapId) {
  return SPIRIT_DOMAINS.find(d => d.mapId === mapId);
}

export function getSpiritDomainRule(ruleId) {
  return SPIRIT_DOMAIN_RULES[ruleId];
}
