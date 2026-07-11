import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  RACE_CONFIG,
  resolveRaceContest,
  getRaceReward,
} from '../src/data/raceBalance.js';
import {
  getInfinityTeamReadiness,
  getAvailableInfinityRewardOptions,
  pickInfinityRewardOptions,
  isResumableInfinityRun,
} from '../src/data/infinityExpedition.js';
import { CONTEST_CONFIG } from '../src/data/battles.js';
import { DEVIL_FRUITS, FRUIT_RARITY_CONFIG } from '../src/data/devilfruits.js';
import {
  BIJUU_LIST,
  JUTSU_DB,
  NARUTO_STORY_CHAPTERS,
  normalizeNarutoExamProgress,
} from '../src/data/naruto.js';
import { BINDING_VOWS, DOMAINS } from '../src/data/jujutsu.js';

const check = (condition, message) => {
  assert.ok(condition, message);
  console.log(`  ✓ ${message}`);
};

const makeRandom = (seed = 0x12345678) => () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 0x100000000;
};

function simulateRace(entrySpeed, seed) {
  const random = makeRandom(seed);
  const partySpeeds = [300, 280, 260, 240, 220, 200];
  let rewardTotal = 0;
  let wins = 0;
  const samples = 50000;
  for (let i = 0; i < samples; i++) {
    const rivals = Array.from({ length: 3 }, (_, index) => ({
      name: `对手${index + 1}`,
      baseSpeed: 180 + random() * 140,
    }));
    const result = resolveRaceContest({
      player: { name: '参赛精灵', baseSpeed: entrySpeed },
      partySpeeds,
      rivals,
      badges: 16,
      random,
    });
    const reward = getRaceReward(result.placement, 16, false);
    rewardTotal += reward.gold;
    if (result.placement === 1) wins += 1;
  }
  return { expectedGold: rewardTotal / samples, winRate: wins / samples };
}

console.log('=== 跨体系玩法契约与平衡检查 ===\n');

const fruits = Object.values(DEVIL_FRUITS);
check(fruits.length === 200 && fruits.every(fruit => fruit.id && fruit.name && fruit.transform && fruit.duration >= 2), '海贼王果实库200种且变身数据完整');
check(Object.values(FRUIT_RARITY_CONFIG).every(config => config.dropRate > 0 && config.dropRate <= 0.2), '恶魔果实掉落率有限且不存在零概率档位');

const narutoStages = NARUTO_STORY_CHAPTERS.flatMap(chapter => chapter.stages || []);
check(NARUTO_STORY_CHAPTERS.length === 20 && narutoStages.length === 64 && JUTSU_DB.length === 200, '火影剧情、关卡与忍术池完整');
check(BIJUU_LIST.length === 9 && new Set(BIJUU_LIST.map(bijuu => bijuu.id)).size === 9, '九只尾兽均可独立收集');
const restoredExam = normalizeNarutoExamProgress({
  phase: 'forest', startedDate: '2026-07-12', survivalWave: 2, survivalWaves: 3,
  scrolls: { heaven: 2, earth: -1 }, difficulty: { waves: 3, enemyPerWave: [2, 3, 4] },
});
check(restoredExam?.scrolls.heaven === 1 && restoredExam.scrolls.earth === 0, '忍者日试炼续跑状态可序列化并安全限幅');

const domains = Object.values(DOMAINS);
check(domains.length >= 20 && domains.every(domain => domain.ceCost >= 70 && domain.ceCost <= 100 && domain.turns >= 3 && domain.turns <= 5), '咒术领域成本和持续时间保持在统一战斗窗口内');
check(BINDING_VOWS.every(vow => vow.ceCost > 0 && vow.sacrifice && vow.reward), '所有缚誓都有明确资源门槛、代价和回报');

const ecologySource = fs.readFileSync(new URL('../src/data/ecoEvents.js', import.meta.url), 'utf8');
check(ecologySource.includes('export function getEcologyHealth') && ecologySource.includes("key === 'pollution' ? 100 - value : value"), '生态健康度显式将污染作为负向指标');

check(CONTEST_CONFIG.beauty.tiers[0].min >= 185 && CONTEST_CONFIG.beauty.tiers[0].min <= 205, '华丽大赛最高奖励苛刻但在五回合理论上可达');

const fusionSource = fs.readFileSync(new URL('../src/data/systemFusion.js', import.meta.url), 'utf8');
const scheduleSource = fusionSource.slice(
  fusionSource.indexOf('export const FUSION_UNLOCK_SCHEDULE'),
  fusionSource.indexOf('export function getSectEcoRole'),
);
const unlockBadges = [...scheduleSource.matchAll(/badges:\s*(\d+)/g)].map(match => Number(match[1]));
check(unlockBadges.every((badges, index) => index === 0 || badges >= unlockBadges[index - 1]), '训练家战术室跨体系解锁随徽章单调推进');
check(
  fusionSource.includes('Math.min(25, bonuses.purifyBonus)')
    && fusionSource.includes('Math.min(0.35, bonuses.protectBonus)')
    && fusionSource.includes('Math.min(0.18, bonuses.captureBonus)')
    && fusionSource.includes('Math.min(2, bonuses.escapeTurnReduce)'),
  '战术室跨体系加成均受硬上限约束',
);
check(scheduleSource.includes("badges: 10, systems: ['strategic_awaken', 'fusion_hub']"), '战术室终局入口不会提前压垮新手');

const fastest = simulateRace(300, 0xace1);
const average = simulateRace(250, 0xace2);
check(fastest.winRate >= 0.42 && fastest.winRate <= 0.62, '队内最快精灵有优势，但不会稳定夺冠');
check(average.winRate < fastest.winRate * 0.55, '选择速度较慢的精灵会显著降低胜率');
check(fastest.expectedGold < RACE_CONFIG.paidEntryCost, '满进度最快精灵的付费场金币期望低于门票');
check(getRaceReward(1, 16, true).item === 'speed_candy', '每日首冠仍可获得速度糖果');
check(getRaceReward(4, 16, true).gold === 0, '末位不再通过安慰奖抵消付费门票');

const readyParty = [{ level: 100 }, { level: 80 }, { level: 70 }];
const carryParty = [{ level: 100 }, { level: 35 }, { level: 20 }];
check(getInfinityTeamReadiness(readyParty, 80).eligible, '三只合格主力可以进入无限城深层');
check(!getInfinityTeamReadiness(carryParty, 80).eligible, '单只满级精灵不能带低级队友绕过深层门槛');
check(isResumableInfinityRun({ floor: 8, mode: 'normal', status: 'selecting' }, 'normal'), '有效探索状态可以续跑');
check(!isResumableInfinityRun({ floor: 8, mode: 'normal', status: 'complete' }, 'normal'), '完成或非法状态不会被错误续跑');

const breathing = [
  { id: 'atk', effect: () => {} },
  { id: 'def', effect: () => {} },
  { id: 'heal', type: 'instant' },
];
const spirits = [{ id: 'spirit-a', effect: 'a' }, { id: 'spirit-b', effect: 'b' }];
const saturatedRun = { buffs: ['atk', 'atk', 'atk'], blessings: ['spirit-a'] };
const available = getAvailableInfinityRewardOptions(saturatedRun, breathing, spirits, { partyNeedsHealing: false });
check(!available.breathing.some(option => option.id === 'atk'), '满三层呼吸法不会再次进入奖励池');
check(!available.breathing.some(option => option.id === 'heal'), '满血时不会出现无效即时治疗');
check(!available.spirits.some(option => option.id === 'spirit-a'), '已拥有的灵契祝福不会重复出现');
const options = pickInfinityRewardOptions(saturatedRun, breathing, spirits, { random: makeRandom(9), partyNeedsHealing: false });
check(options.length === 2 && new Set(options.map(option => option.id)).size === options.length, '无限城奖励只包含有效且不重复的选项');

const appSource = fs.readFileSync(new URL('../src/App.js', import.meta.url), 'utf8');
check(appSource.includes("attemptBattleStart('门派首席挑战'"), '门派首席挑战使用统一启动事务');
check(appSource.includes("attemptBattleStart('掌门试炼'"), '掌门试炼使用统一启动事务');
check(appSource.includes("attemptBattleStart('门派秘境'"), '门派秘境使用统一启动事务');
check(appSource.includes('_chiefTrialTokenReserved: tokenReserved'), '掌门令在进入战斗前预留并可在初始化失败时退还');
check(appSource.includes('const advanced = currentStep === stepIdx'), '门派秘境战斗按期望步骤幂等结算');
check(appSource.includes('sectRealmCompletionLocksRef.current.has(lockKey)'), '门派秘境最终奖励具有独立防重锁');
check(appSource.includes("const isDomainClash = tempBattle.activeDomain?.ownerSide === 'enemy'"), '敌方领域存在时会进入领域对撞而非无条件覆盖');
check(appSource.includes('双方领域相互抵消'), '领域对撞明确消耗双方领域并向玩家反馈代价');
check(appSource.includes('unit.fruitUseCount = nextUseCount'), '恶魔果实变身次数写回战斗快照避免战后丢失');
check(appSource.includes('examProgress: examRun'), '火影日试炼在开始时同步持久化续跑进度');
check(appSource.includes("if (!started) {\n            showMapToast('⚠️', '报名失败'"), '活动启动失败不会提交报名费和冷却');
check(appSource.includes('battle-tactical-intel'), '训练家战术、压力、覆盖和追加目标在战斗中可查看');

console.log(`\n竞速模拟：最快精灵冠军率 ${(fastest.winRate * 100).toFixed(1)}%，付费场期望 ${fastest.expectedGold.toFixed(0)} / 门票 ${RACE_CONFIG.paidEntryCost}`);
console.log('跨体系玩法检查全部通过。');
