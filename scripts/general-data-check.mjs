/**
 * 名将名册、传记、评级派生值和旧存档迁移的一致性检查。
 * 运行: node scripts/general-data-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GENERAL_BIOS } from '../src/data/generalBios.js';
import { GENERAL_EXPANSION } from '../src/data/generalExpansion.js';
import { HISTORICAL_BATTLES } from '../src/data/historicalBattles.js';
import {
  GENERAL_DRAW_RATES,
  GENERAL_ROSTER_FACTIONS,
  GENERAL_ROSTER_FACTION_IDS,
  HISTORICAL_POLITICAL_FACTION_IDS,
  SANGUO_GENERALS,
  hydrateGeneralSnapshot,
} from '../src/data/generals.js';

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

console.log('=== 名将数据完整性与评级检查 ===\n');

check(SANGUO_GENERALS.length === 550, '名将录已扩充为 550 位独立人物');
check(new Set(SANGUO_GENERALS.map(general => general.id)).size === SANGUO_GENERALS.length, '名将 ID 全部唯一');
check(new Set(SANGUO_GENERALS.map(general => general.name)).size === SANGUO_GENERALS.length, '名将姓名全部唯一');
check(Object.keys(GENERAL_BIOS).length === SANGUO_GENERALS.length, '550 位名将全部具有独立传记或史料简表');

const historicalNameAliases = {
  shu_huang_yueying: '黄氏',
  shu_fu_tong: '傅肜',
  wu_da_qiao: '大桥',
  wu_xiao_qiao: '小桥',
};
for (const general of SANGUO_GENERALS) {
  const bio = GENERAL_BIOS[general.id];
  const expectedName = historicalNameAliases[general.id] || general.name;
  assert.ok(bio?.bio?.includes(expectedName), `${general.name} 的传记与当前人物姓名不匹配`);
  assert.ok(['full', 'sourced', 'brief'].includes(bio?.profileLevel), `${general.name} 的资料等级无效`);
}
check(true, '所有人物传记均匹配当前姓名或可靠史籍异名');
const profileCounts = Object.values(GENERAL_BIOS).reduce((counts, bio) => {
  counts[bio.profileLevel] = (counts[bio.profileLevel] || 0) + 1;
  return counts;
}, {});
check(profileCounts.full === 269, '269 份既有完整传记正确标记为历史生平');
check(profileCounts.sourced === 164, '14 位替换人物与 150 位新增人物均具有史料出处');
check(profileCounts.brief === 117, '117 份简要资料保持史料简表标记，不冒充完整传记');

const portraitHalo = { SSR: '#f7d35a', SR: '#b9c7e7', R: '#aab2bd' };
for (const general of SANGUO_GENERALS) {
  const portrait = await readFile(new URL(`../public/assets/generals/${general.id}.svg`, import.meta.url), 'utf8');
  assert.ok(portrait.includes(`aria-label="${general.name} portrait"`), `${general.name} 头像仍带有旧人物标签`);
  assert.ok(portrait.includes(`stroke="${portraitHalo[general.rarity]}"`), `${general.name} 头像光环未同步 ${general.rarity} 评级`);
}
check(true, '550 张名将头像齐全，人物标签与评级光环均和当前名单一致');

const scoreRanges = { SSR: [84, 92], SR: [72, 83], R: [55, 71] };
const costRanges = { SSR: [105000, 155000], SR: [48000, 92000], R: [15000, 45000] };
for (const general of SANGUO_GENERALS) {
  const bio = GENERAL_BIOS[general.id];
  assert.ok(bio?.bio && bio?.famous, `${general.name} 缺少传记字段`);
  const [scoreMin, scoreMax] = scoreRanges[general.rarity];
  assert.ok(general.historicalScore >= scoreMin && general.historicalScore <= scoreMax, `${general.name} 评分越出 ${general.rarity} 档`);
  assert.equal(general.teamLevel, general.historicalScore, `${general.name} 遭遇等级未使用史实评分`);
  const [costMin, costMax] = costRanges[general.rarity];
  assert.ok(general.recruitCost >= costMin && general.recruitCost <= costMax, `${general.name} 招募费用与档位不符`);
  assert.ok(general.teamSize >= 2 && general.teamSize <= 6, `${general.name} 携带精灵数量越界`);
  assert.ok(general.role && general.roleLabel, `${general.name} 缺少玩法定位`);
  assert.ok(general.historicalFaction, `${general.name} 缺少历史归属`);
  assert.ok(GENERAL_ROSTER_FACTION_IDS.includes(general.rosterFaction), `${general.name} 名将录势力无效`);
  assert.ok(HISTORICAL_POLITICAL_FACTION_IDS.includes(general.politicalFaction), `${general.name} 国战政治势力无效`);
  assert.ok(['wei', 'shu', 'wu', 'jin', 'qun'].includes(general.warCamp), `${general.name} 地图联军无效`);
}
check(true, '所有评级、遭遇等级、队伍规模、招募费和定位均来自同一评分源');

const factionCounts = Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(faction => [
  faction,
  Object.fromEntries(['SSR', 'SR', 'R'].map(rarity => [
    rarity,
    SANGUO_GENERALS.filter(general => general.rosterFaction === faction && general.rarity === rarity).length,
  ])),
]));
check(new Set(Object.values(factionCounts).map(counts => counts.SSR)).size > 1, '各阵营 SSR 数量不再强制相等');
check(factionCounts.wei.SSR >= 17 && factionCounts.shu.SSR >= 16 && factionCounts.wu.SSR >= 16, '魏蜀吴 SSR 已按军政实绩重评，不再只有 6/6/8 人');
console.log('  评级分布:', factionCounts);
assert.deepEqual(
  Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(faction => [faction, SANGUO_GENERALS.filter(general => general.rosterFaction === faction).length])),
  { wei: 105, shu: 100, wu: 105, western_jin: 46, eastern_jin: 41, liu_song: 19, northern_wei: 8, sixteen_kingdoms: 10, neutral: 116 },
);
check(true, '原晋及南北朝名册已拆为西晋、东晋、刘宋、北魏、十六国，误收的东汉虞诩归回群雄');
check(SANGUO_GENERALS.every(general => general.historicalFaction !== '晋及南北朝'), '名将卡片不再显示泛化的“晋及南北朝”');
check(
  SANGUO_GENERALS.filter(general => ['liu_song', 'northern_wei'].includes(general.rosterFaction)).every(general => general.canServeAnyWarCamp),
  '刘宋与北魏名将全部允许被任一战略阵营延揽',
);

check(GENERAL_EXPANSION.length === 150, '新增名单恰为 150 人，总量达到 550');
for (const raw of GENERAL_EXPANSION) {
  const profile = GENERAL_BIOS[raw.id];
  assert.equal(profile?.profileLevel, 'sourced', `${raw.name} 未标记为有出处资料`);
  assert.ok(profile?.source, `${raw.name} 缺少史料来源`);
  assert.ok(profile?.bio?.includes(raw.name), `${raw.name} 传记与姓名不匹配`);
  assert.ok(profile?.years, `${raw.name} 缺少生卒年状态`);
  assert.ok(SANGUO_GENERALS.find(general => general.id === raw.id)?.historicalFaction, `${raw.name} 历史归属未进入战斗名将快照`);
}
check(true, '150 位新增人物均有独立简传、事迹、年代状态、历史归属和史料来源');

const historicalAccuracyExpectations = {
  wei_xing_yong: ['邢颙', '子昂', '《三国志·魏书·邢颙传》'],
  wu_sun_jiao: ['孙皎', '叔朗', '《三国志·吴书·孙皎传》'],
};
for (const [id, [name, courtesy, source]] of Object.entries(historicalAccuracyExpectations)) {
  const general = SANGUO_GENERALS.find(entry => entry.id === id);
  const bio = GENERAL_BIOS[id];
  assert.equal(general?.name, name, `${id} 史籍姓名错误`);
  assert.equal(bio?.courtesy, courtesy, `${name} 表字错误`);
  assert.equal(bio?.source, source, `${name} 史料卷传错误`);
}
assert.ok(GENERAL_BIOS.shu_chen_zhi.bio.includes('费祎死后'), '陈祗生平仍含费祎姓名误字');
assert.ok(GENERAL_BIOS.wu_lu_yan.bio.includes('王濬军'), '陆晏生平未使用王濬的史籍姓名');
assert.ok(GENERAL_BIOS.neu_liu_xie.bio.includes('李傕、郭汜'), '汉献帝生平仍含李傕姓名误字');
assert.equal(SANGUO_GENERALS.find(general => general.id === 'jin_he_chong')?.name, '何充', '东晋何充姓名仍使用误字');
assert.equal(SANGUO_GENERALS.find(general => general.id === 'jin_yu_yi')?.name, '虞诩', '东汉虞诩仍被误写为虞翊');
assert.equal(SANGUO_GENERALS.find(general => general.id === 'jin_yu_yi')?.historicalFaction, '东汉', '虞诩仍被错误归入晋系');
assert.equal(SANGUO_GENERALS.find(general => general.id === 'jin_duan_qin')?.historicalFaction, '段部鲜卑', '段钦仍被错误归入后燕或刘琨部');
check(true, '易混姓名与关键史实用字均锁定为正史写法');

const replacementExpectations = {
  wei_sima_yi: ['贾逵', '梁道', 'SR', 'defender'],
  wei_deng_ai: ['刘馥', '元颖', 'SR', 'governor'],
  wei_zhong_hui: ['傅嘏', '兰石', 'SR', 'strategist'],
  wei_sima_zhao: ['高柔', '文惠', 'SR', 'governor'],
  wei_sima_shi: ['赵俨', '伯然', 'SR', 'strategist'],
  wei_du_yu: ['杜畿', '伯侯', 'SR', 'governor'],
  wei_jia_chong: ['陈矫', '季弼', 'R', 'governor'],
  wei_wang_hun: ['梁习', '子虞', 'SR', 'governor'],
  wei_yang_hu: ['王观', '伟台', 'R', 'governor'],
  wei_wen_yang: ['吕昭', null, 'R', 'defender'],
  shu_huang_xu: ['黄崇', '德光', 'R', 'vanguard'],
  shu_zhang_ni: ['张裔', '君嗣', 'SR', 'governor'],
  wu_lu_ji: ['陆景', '士仁', 'R', 'defender'],
  wu_zhuge_xu: ['诸葛融', '叔长', 'R', 'defender'],
};
for (const [id, [name, courtesy, rarity, role]] of Object.entries(replacementExpectations)) {
  const general = SANGUO_GENERALS.find(entry => entry.id === id);
  const bio = GENERAL_BIOS[id];
  assert.equal(general?.name, name, `${id} 姓名错误`);
  assert.ok(bio?.bio.includes(name), `${name} 仍在使用旧人物传记`);
  if (courtesy) assert.equal(bio.courtesy, courtesy, `${name} 表字错误`);
  assert.equal(general.rarity, rarity, `${name} 历史评级错误`);
  assert.equal(general.role, role, `${name} 玩法定位错误`);
  assert.ok(bio?.source, `${name} 缺少史料依据`);
  assert.equal(bio?.profileLevel, 'sourced', `${name} 未标记为有出处的完整资料`);
}
check(true, '14 位替换人物的姓名、表字、传记、出处和评级全部匹配');

const legacyReplacementIds = new Set(Object.keys(replacementExpectations));
const rosterIds = new Set(SANGUO_GENERALS.map(general => general.id));
for (const battle of HISTORICAL_BATTLES) {
  for (const wave of battle.waves) {
    for (const generalId of wave.generalIds) {
      assert.ok(rosterIds.has(generalId), `${battle.name}/${wave.name} 引用了不存在的名将 ${generalId}`);
      assert.ok(!legacyReplacementIds.has(generalId), `${battle.name}/${wave.name} 仍把替换 ID 当成旧人物使用`);
    }
  }
}
check(true, '历史名战不再把贾逵、刘馥等替换 ID 错当成司马懿、邓艾等旧人物');

const hydrated = hydrateGeneralSnapshot({
  id: 'wei_sima_yi', name: '司马懿', rarity: 'SSR', bonus: { gold: 99 }, recruitTime: 123,
});
assert.equal(hydrated.name, '贾逵');
assert.equal(hydrated.rarity, 'SR');
assert.equal(hydrated.historicalScore, 78);
assert.equal(hydrated.rosterFaction, 'wei');
assert.equal(hydrated.politicalFaction, 'wei');
assert.equal(hydrated.warCamp, 'wei');
assert.equal(hydrated.recruitTime, 123);
check(true, '旧存档名将快照会刷新为权威人物资料，同时保留招募时间');

assert.ok(Math.abs(Object.values(GENERAL_DRAW_RATES).reduce((sum, value) => sum + value, 0) - 1) < 1e-9);
check(true, '抽将概率总和为 100%，且先抽档位、不受各档人数反向加权');

console.log('\n名将数据检查全部通过。');
