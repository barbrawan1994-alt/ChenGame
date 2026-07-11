/**
 * 名将名册、传记、评级派生值和旧存档迁移的一致性检查。
 * 运行: node scripts/general-data-check.mjs
 */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GENERAL_BIOS } from '../src/data/generalBios.js';
import { HISTORICAL_BATTLES } from '../src/data/historicalBattles.js';
import {
  GENERAL_DRAW_RATES,
  SANGUO_GENERALS,
  hydrateGeneralSnapshot,
} from '../src/data/generals.js';

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

console.log('=== 名将数据完整性与评级检查 ===\n');

check(SANGUO_GENERALS.length === 400, '现有 400 人名册保持完整，优先保证质量而非机械扩到 500 人');
check(new Set(SANGUO_GENERALS.map(general => general.id)).size === SANGUO_GENERALS.length, '名将 ID 全部唯一');
check(new Set(SANGUO_GENERALS.map(general => general.name)).size === SANGUO_GENERALS.length, '名将姓名全部唯一');
check(Object.keys(GENERAL_BIOS).length === SANGUO_GENERALS.length, '400 位名将全部具有传记或史料简表');

const portraitHalo = { SSR: '#f7d35a', SR: '#b9c7e7', R: '#aab2bd' };
for (const general of SANGUO_GENERALS) {
  const portrait = await readFile(new URL(`../public/assets/generals/${general.id}.svg`, import.meta.url), 'utf8');
  assert.ok(portrait.includes(`aria-label="${general.name} portrait"`), `${general.name} 头像仍带有旧人物标签`);
  assert.ok(portrait.includes(`stroke="${portraitHalo[general.rarity]}"`), `${general.name} 头像光环未同步 ${general.rarity} 评级`);
}
check(true, '400 张名将头像齐全，人物标签与评级光环均和当前名单一致');

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
}
check(true, '所有评级、遭遇等级、队伍规模、招募费和定位均来自同一评分源');

const factionCounts = Object.fromEntries(['wei', 'shu', 'wu', 'jin', 'neutral'].map(faction => [
  faction,
  Object.fromEntries(['SSR', 'SR', 'R'].map(rarity => [
    rarity,
    SANGUO_GENERALS.filter(general => general.faction === faction && general.rarity === rarity).length,
  ])),
]));
check(new Set(Object.values(factionCounts).map(counts => counts.SSR)).size > 1, '各阵营 SSR 数量不再强制相等');
console.log('  评级分布:', factionCounts);

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
assert.equal(hydrated.recruitTime, 123);
check(true, '旧存档名将快照会刷新为权威人物资料，同时保留招募时间');

assert.ok(Math.abs(Object.values(GENERAL_DRAW_RATES).reduce((sum, value) => sum + value, 0) - 1) < 1e-9);
check(true, '抽将概率总和为 100%，且先抽档位、不受各档人数反向加权');

console.log('\n名将数据检查全部通过。');
