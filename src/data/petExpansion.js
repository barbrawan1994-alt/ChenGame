import { SKILL_DB } from './skills.js';

// Each family has a shared learnset, two native attacks and two tactical slots.
export const PET_TACTICS = {
  tempo: { name: '速度控制', moves: [['TIME', '时间减速'], ['WIND', '风之加护']], tip: '压低对手速度，给慢速队友创造先手机会；遇到先制招式时应换防。' },
  medic: { name: '净化续航', moves: [['HEAL', '生命水滴'], ['HEAL', '治愈铃声']], tip: '低输出换取恢复与净化，适合消耗战；面对集火时需要换位或守护。' },
  breaker: { name: '物理破甲', moves: [['NORMAL', '瞪眼'], ['FIGHT', '健美']], tip: '先削弱物防再进攻，双打队友也能利用破甲；灼伤与特攻能压制这条路线。' },
  disruptor: { name: '特防瓦解', moves: [['CHAOS', '熵增'], ['DARK', '大声咆哮']], tip: '削弱特防并压低特攻，辅助光线和忍术输出；物理突击是主要威胁。' },
  bulwark: { name: '物理守卫', moves: [['NORMAL', '守住'], ['STEEL', '铁壁']], tip: '利用守住与物防强化挡住突击；速度慢且特防薄弱，避免久留在特攻手面前。' },
  ward: { name: '光幕守卫', moves: [['LIGHT', '结界'], ['DARK', '大声咆哮']], tip: '适合承接光线与法术，再用降特攻保护全队；强力物理招式可突破防线。' },
  attrition: { name: '异常消耗', moves: [['POISON', '毒粉'], ['NORMAL', '守住']], tip: '先制造中毒再穿插守住；连续守住成功率递减，净化与速攻可破解。' },
  striker: { name: '先制收割', moves: [['NORMAL', '电光一闪'], ['NORMAL', '聚气']], tip: '先制招式收割残血，适合搭配破甲队友；耐久偏低，不适合硬换伤害。' },
  sweeper: { name: '蓄势输出', moves: [['PSYCHIC', '冥想'], ['NORMAL', '守住']], tip: '抓住空隙强化特攻再输出；强化会占用回合，换人后能力阶级重置。' },
  suppressor: { name: '物攻压制', moves: [['NORMAL', '叫声'], ['FIRE', '鬼火']], tip: '用降攻和灼伤压制物理敌人；对火属性、毅力特性或特攻手须及时改变战术。' },
  reset: { name: '强化反制', moves: [['ICE', '黑雾'], ['TIME', '时间减速']], tip: '清除敌我强化，阻止滚雪球；双打释放黑雾前须考虑队友已叠加的增益。' },
  drain: { name: '汲取游击', moves: [['GRASS', '终极吸取'], ['WIND', '风之加护']], tip: '用吸取弥补耐久并争取先手；草系被抵抗时需要副属性招式或替换队友。' },
};

const attack = (type, cap) => {
  const pool = SKILL_DB[type].filter(move => move.p > 0 && move.p <= cap && (move.acc === undefined || move.acc >= 85) && move.pp >= 8 && !move.selfKO && !move.recharge && !move.recoil && !move.effect?.selfDebuff);
  return pool.reduce((best, move) => !best || move.p > best.p ? move : best, null)
    || SKILL_DB[type].filter(move => move.p > 0).reduce((best, move) => !best || move.p < best.p ? move : best, null);
};
const moveRef = (type, name) => `${type}:${name}`;
function learnset(type, type2, tactic) {
  const [first, second] = PET_TACTICS[tactic].moves;
  return [
    ...[1, 20, 45].map((level, i) => ({ level, move: moveRef(type, attack(type, [60, 80, 105][i]).name), slot: 'primary' })),
    ...[5, 25, 50].map((level, i) => ({ level, move: moveRef(type2, attack(type2, [60, 80, 100][i]).name), slot: 'coverage' })),
    { level: 10, move: moveRef(...first), slot: 'utility' },
    { level: 30, move: moveRef(...second), slot: 'flex' },
  ].sort((a, b) => a.level - b.level);
}

// First ID, names, native types, role, habitat, evolution levels, final HP/Atk/Def/Speed.
const FAMILIES = [
  [905, ['铃芽雀', '回音林雀', '森铃乐师'], 'SOUND', 'GRASS', 'tempo', 1, [16, 34], [82, 82, 78, 112]],
  [908, ['药绒虫', '露药蛹', '甘露灵蛾'], 'HEAL', 'BUG', 'medic', 1, [14, 32], [98, 60, 92, 74]],
  [911, ['轻羽狸', '巡风狸', '逐风游侠'], 'WIND', 'NORMAL', 'striker', 1, [18, 36], [72, 102, 60, 126]],
  [914, ['石鼓童', '震岩鼓手', '磐音卫士'], 'SOUND', 'ROCK', 'breaker', 2, [22, 40], [96, 100, 110, 48]],
  [917, ['砂针灵', '刻砂使', '流沙计时官'], 'TIME', 'GROUND', 'reset', 2, [24, 42], [90, 80, 88, 94]],
  [920, ['泉心贝', '清泉蚌', '溯泉医者'], 'HEAL', 'WATER', 'medic', 4, [36, 54], [110, 58, 98, 60]],
  [923, ['镜铆灵', '明镜铠', '折光盾卫'], 'LIGHT', 'STEEL', 'ward', 3, [28, 46], [88, 76, 112, 70]],
  [926, ['星火团', '磁星灵', '轨道巡游者'], 'COSMIC', 'ELECTRIC', 'tempo', 3, [28, 48], [78, 94, 72, 116]],
  [929, ['雾笛苗', '毒簧灵', '瘴音指挥'], 'SOUND', 'POISON', 'attrition', 2, [22, 42], [90, 76, 94, 92]],
  [932, ['潮羽雏', '涡流鹭', '御潮风使'], 'WIND', 'WATER', 'striker', 4, [36, 54], [74, 98, 66, 122]],
  [935, ['糖露团', '蜜露灵', '甜露圣使'], 'HEAL', 'FAIRY', 'suppressor', 1, [20, 38], [102, 62, 88, 86]],
  [938, ['霜刻灵', '冰钟使', '寒钟守望'], 'TIME', 'ICE', 'reset', 3, [30, 48], [94, 84, 96, 70]],
  [941, ['烛芯鸟', '暖辉鸦', '朝焰明使'], 'LIGHT', 'FIRE', 'sweeper', 5, [44, 62], [78, 108, 72, 98]],
  [944, ['裂芽种', '失序藤', '悖生花冠'], 'CHAOS', 'GRASS', 'drain', 2, [24, 44], [88, 90, 82, 96]],
  [947, ['风拳童', '岚步客', '流岚武师'], 'WIND', 'FIGHT', 'breaker', 2, [24, 44], [82, 108, 76, 98]],
  [950, ['星铆球', '环轨甲', '天穹重卫'], 'COSMIC', 'STEEL', 'bulwark', 3, [30, 50], [108, 78, 122, 38]],
  [953, ['电拨鼠', '弧弦手', '雷弦演奏家'], 'SOUND', 'ELECTRIC', 'disruptor', 3, [28, 48], [76, 100, 70, 112]],
  [956, ['泥药团', '岩药童', '厚土药师'], 'HEAL', 'GROUND', 'suppressor', 2, [24, 44], [112, 64, 108, 46]],
  [959, ['暮灯灵', '幽光巡使', '灯夜司仪'], 'LIGHT', 'GHOST', 'ward', 3, [30, 50], [84, 90, 78, 102]],
  [962, ['潮星卵', '浮星水灵', '星潮引路者'], 'COSMIC', 'WATER', 'disruptor', 4, [38, 56], [100, 88, 86, 76]],
  [965, ['墨拍灵', '夜奏使', '静夜咏者'], 'SOUND', 'DARK', 'suppressor', 3, [30, 50], [88, 84, 82, 104]],
  [968, ['旋砂团', '风沙侍', '沙岚斥候'], 'WIND', 'GROUND', 'tempo', 2, [24, 44], [80, 88, 80, 114]],
  [971, ['齿轮秒针', '巡刻机', '纪时校准官'], 'TIME', 'STEEL', 'bulwark', 3, [30, 50], [100, 84, 118, 44]],
  [974, ['祝芽灵', '祈铃使', '和鸣守誓者'], 'GOD', 'SOUND', 'ward', 6, [54, 72], [94, 82, 92, 84]],
];

const SPECIALISTS = [
  [977, '潮汐调律师', 'SOUND', 'WATER', 'tempo', 4, [88, 86, 80, 108]],
  [978, '霞光织者', 'LIGHT', 'BUG', 'disruptor', 8, [78, 102, 74, 110]],
  [979, '雾岭药客', 'HEAL', 'WIND', 'medic', 8, [88, 60, 80, 120]],
  [980, '星砂堡垒', 'COSMIC', 'GROUND', 'bulwark', 10, [116, 82, 120, 32]],
  [981, '逆拍舞者', 'TIME', 'SOUND', 'reset', 6, [82, 88, 80, 114]],
  [982, '熵晶猎手', 'CHAOS', 'ICE', 'striker', 9, [70, 116, 64, 116]],
  [983, '青焰药炉', 'HEAL', 'FIRE', 'drain', 5, [104, 78, 100, 52]],
  [984, '破阵铿锵', 'STEEL', 'SOUND', 'breaker', 6, [86, 114, 98, 62]],
  [985, '霁雪信使', 'WIND', 'ICE', 'tempo', 9, [74, 94, 70, 128]],
  [986, '月蚀潜影', 'COSMIC', 'DARK', 'sweeper', 12, [76, 112, 72, 104]],
  [987, '照夜萤将', 'BUG', 'LIGHT', 'striker', 8, [72, 108, 78, 108]],
  [988, '镇瘴医灵', 'HEAL', 'POISON', 'medic', 7, [106, 62, 104, 58]],
  [989, '寂音判官', 'SOUND', 'GHOST', 'disruptor', 7, [86, 100, 88, 90]],
  [990, '晨钟誓卫', 'GOD', 'TIME', 'reset', 12, [98, 86, 104, 70]],
  [991, '裂隙花使', 'CHAOS', 'FAIRY', 'suppressor', 11, [88, 88, 82, 106]],
  [992, '珊瑚风塔', 'WATER', 'ROCK', 'bulwark', 4, [108, 82, 124, 36]],
];

const RARE = [
  [993, '万籁协奏者', 'SOUND', 'COSMIC', 'disruptor', [92, 112, 92, 104], '星海协奏', [977, 953, 979]],
  [994, '生命守灯人', 'HEAL', 'LIGHT', 'medic', [126, 68, 116, 70], '不灭守灯', [988, 923, 983]],
  [995, '长风逐日者', 'WIND', 'FIRE', 'striker', [76, 124, 72, 132], '逐日竞速', [985, 947, 987]],
  [996, '断轮裁时者', 'TIME', 'FIGHT', 'reset', [96, 112, 104, 88], '断轮试炼', [981, 971, 938]],
  [997, '零界棱镜', 'CHAOS', 'STEEL', 'breaker', [98, 122, 118, 60], '棱镜攻防', [984, 950, 982]],
  [998, '极夜星航者', 'COSMIC', 'ICE', 'sweeper', [86, 124, 78, 116], '极夜航道', [986, 926, 980]],
  [999, '净世誓约兽', 'GOD', 'HEAL', 'ward', [112, 88, 116, 78], '誓约之证', [974, 990, 935]],
  [1000, '千律合鸣龙', 'DRAGON', 'SOUND', 'tempo', [104, 110, 98, 94], '千律终章', [993, 996, 995]],
];

// Explicit budgets preserve low attack on supports and low speed on armored units.
function species(id, name, type, type2, tactic, stats, extra = {}) {
  const [hp, atk, def, spd] = stats;
  return { id, name, type, type2, hp, atk, def, spd, emoji: '✦', tactic,
    ...(tactic === 'bulwark' ? { s_def: Math.round(def * 0.65) } : {}),
    ...(tactic === 'ward' ? { p_def: Math.round(def * 0.7) } : {}),
    starterExcluded: true, learnset: learnset(type, type2, tactic),
    desc: `${PET_TACTICS[tactic].name}型精灵。${PET_TACTICS[tactic].tip}`, ...extra };
}
export const NEW_PETS_900 = [
  ...FAMILIES.flatMap(([id, names, type, type2, tactic, mapId, levels, stats]) => names.map((name, stage) => {
    const scale = [0.53, 0.74, 1][stage];
    return species(id + stage, name, type, type2, tactic, stats.map(n => Math.round(n * scale)), {
      familyId: id, habitatMapId: mapId,
      ...(stage < 2 ? { evo: id + stage + 1, evoLvl: levels[stage] } : {}),
    });
  })),
  ...SPECIALISTS.map(([id, name, type, type2, tactic, mapId, stats]) => species(id, name, type, type2, tactic, stats, { habitatMapId: mapId })),
  ...RARE.map(([id, name, type, type2, tactic, stats]) => species(id, name, type, type2, tactic, stats, { acquisition: 'trial', challengeId: `spirit_${id}` })),
];

export const SPIRIT_TRIALS = RARE.map(([id, name, , , tactic, , title, guards], index) => ({
  id: `spirit_${id}`, title, desc: `${name}的契约挑战。${PET_TACTICS[tactic].tip}`,
  req: 200 + index * 50, boss: id, bossLvl: 80 + index * 2, teamSize: 4,
  rewardId: id, guardIds: guards, isDouble: index % 2 === 0,
  bg: '#18352e', color: '#a7d4bd',
}));
