const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');

function loadUtility(relativePath, globals = {}) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const transformed = babel.transformSync(source, {
    filename,
    presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
    babelrc: false,
    configFile: false,
    sourceMaps: false,
  }).code;
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: specifier => {
      if (Object.prototype.hasOwnProperty.call(globals, specifier)) return globals[specifier];
      throw new Error(`Unexpected dependency ${specifier} while loading ${relativePath}`);
    },
    console,
    Date,
    Math,
    Set,
    Number,
    Object,
    Array,
  };
  vm.runInNewContext(transformed, sandbox, { filename });
  return module.exports;
}

const contest = loadUtility('src/utils/contestUtils.js');
const progression = loadUtility('src/utils/progressionFlow.js');
const grade = loadUtility('src/utils/petGrade.js');

const fakePokedex = [
  { id: 1, name: '幼体', type: 'GRASS', hp: 45, atk: 49, def: 49, evo: 2, evoLvl: 16 },
  { id: 2, name: '成体', type: 'GRASS', hp: 60, atk: 62, def: 63 },
];
const fakeSkills = {
  GRASS: [{ name: '飞叶', p: 40, pp: 25, acc: 100 }],
  NORMAL: [{ name: '撞击', p: 40, pp: 35, acc: 100 }],
};
const petFactory = loadUtility('src/utils/petFactory.js', {
  '../data/pets': { POKEDEX: fakePokedex },
  '../data/traits': { NATURE_DB: { hardy: { exp: 1 } }, TRAIT_DB: { brave: {} } },
  '../data/types': { TYPE_CHARM_BASE: { GRASS: 30 } },
  '../data/skills': { SKILL_DB: fakeSkills },
  '../data/jujutsu': { generateCurseTalent: () => null },
  './statsCalculator': { calcNextExp: level => level * 100 },
  '../data/sectSystem': { pickSectIdForPet: () => 'test_sect' },
});

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log(`✓ ${name}`);
}

check('活动池 preserveSpecies 保持指定物种，默认创建仍按等级自动进化', () => {
  const originalRandom = Math.random;
  Math.random = () => 0.25;
  try {
    assert.equal(petFactory.createPet(1, 20, false, false, { preserveSpecies: true }).id, 1);
    assert.equal(petFactory.createPet(1, 20).id, 2);
  } finally {
    Math.random = originalRandom;
  }
});

check('钓鱼和捕虫多候选池不会连续返回上一物种', () => {
  assert.equal(contest.selectContestSpecies([7, 24, 26], 7, () => 0), 24);
  assert.equal(contest.selectContestSpecies([110, 38, 293], 38, () => 0.999), 293);
  assert.equal(contest.selectContestSpecies([7], 7, () => 0.5), 7);
});

check('捕获对象 UID 唯一，并移除战斗态与临时 Boss 强化', () => {
  const enemy = {
    id: 110,
    name: '测试虫',
    isBoss: true,
    customStatMult: { hp: 2 },
    devilFruit: 'temp',
    ivs: { hp: 28, spd: 30 },
    evs: { hp: 12, spd: 4 },
    moves: [{ name: '虫咬', pp: 12, maxPP: 20 }, { name: '吐丝', pp: 30, maxPP: 30 }],
    combatMoves: [{ name: '虫咬', pp: 4 }, { name: '额外技能', pp: 1, isExtra: true }],
    stages: { atk: 2 },
  };
  const first = contest.prepareCaughtPet(enemy, { now: () => 1234, random: () => 0.1 });
  const second = contest.prepareCaughtPet(enemy, { now: () => 1234, random: () => 0.1 });
  assert.notEqual(first.uid, second.uid);
  assert.equal(first.isBoss, false);
  assert.equal(first.moves[0].pp, 4);
  assert.equal(first.moves[1].pp, 30);
  assert.equal('combatMoves' in first, false);
  assert.equal('stages' in first, false);
  assert.equal('customStatMult' in first, false);
  assert.equal('devilFruit' in first, false);
  first.ivs.hp = 31;
  first.evs.hp = 99;
  assert.equal(enemy.ivs.hp, 28);
  assert.equal(enemy.evs.hp, 12);
});

check('战斗资源同步只回写 HP、状态和同名永久技能 PP', () => {
  const permanent = [{
    uid: 'p1',
    currentHp: 50,
    status: null,
    moves: [{ name: '撞击', pp: 20 }, { name: '守住', pp: 10 }],
    trait: 'keep-me',
  }];
  const combat = [{
    currentHp: 7,
    status: 'POISON',
    combatMoves: [{ name: '撞击', pp: 3 }, { name: '临时招式', pp: 1, isExtra: true }],
    trait: 'battle-only',
  }];
  const synced = contest.syncPartyBattleResources(permanent, combat);
  assert.equal(synced[0].currentHp, 7);
  assert.equal(synced[0].status, 'POISON');
  assert.equal(synced[0].moves[0].pp, 3);
  assert.equal(synced[0].moves[1].pp, 10);
  assert.equal(synced[0].moves.length, 2);
  assert.equal(synced[0].trait, 'keep-me');
});

check('学技能后的流程优先处理剩余技能，再保留进化入口', () => {
  const pending = progression.getPostMoveResolution([
    { pendingLearnMove: null, canEvolve: true },
    { pendingLearnMove: { name: '新技能' }, canEvolve: false },
  ]);
  assert.equal(pending.view, 'move_forget');
  assert.equal(pending.pendingIndex, 1);
  assert.equal(pending.pendingMove.name, '新技能');
  assert.equal(progression.getPostMoveResolution([{ canEvolve: true }]).view, 'team');
  assert.equal(progression.getPostMoveResolution([{ canEvolve: false }]).view, 'grid_map');
});

check('进化前后相同 IV 的最终评级保持一致', () => {
  const deps = {
    pokedex: [
      { id: 1, type: 'GRASS', hp: 40, atk: 45, def: 42 },
      { id: 2, type: 'GRASS', hp: 100, atk: 120, def: 100 },
    ],
    typeBias: { GRASS: { p: 1, s: 1 } },
    getStats: pet => ({ maxHp: pet.id === 1 ? 100 : 250, p_atk: 50, p_def: 50, s_atk: 50, s_def: 50, spd: 50 }),
  };
  const ivs = { hp: 27, p_atk: 27, p_def: 27, s_atk: 27, s_def: 27, spd: 27 };
  const before = grade.calculatePetGrade({ id: 1, level: 20, ivs, diversityRng: -2 }, deps);
  const after = grade.calculatePetGrade({ id: 2, level: 20, ivs, diversityRng: -2 }, deps);
  assert.equal(before.grade, 'S');
  assert.equal(after.grade, before.grade);
  assert.equal(after.score, before.score);
});

check('章节最后任务完成后将道馆设为当前主线目标', () => {
  const chapter = {
    mapId: 4,
    tasks: [
      { step: 4, name: '前置任务', x: 10, y: 10 },
      { step: 5, name: '暗影执行者·厌晚', x: 22, y: 3 },
    ],
  };
  const lastTask = progression.getStoryObjective(chapter, 4, 5, { x: 28, y: 18 });
  assert.equal(lastTask.kind, 'task');
  assert.equal(lastTask.name, '暗影执行者·厌晚');
  const gym = progression.getStoryObjective(chapter, 4, 6, { x: 28, y: 18 });
  assert.deepEqual(JSON.parse(JSON.stringify(gym)), { kind: 'gym', name: '挑战道馆馆主', x: 28, y: 18 });
});

check('捕虫击倒分支不发奖励，捕获成功只奖励真实捕获对象一次', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const koStart = app.indexOf("if (battleSnapshot.type === 'contest_bug')");
  const normalWinStart = app.indexOf('// TODO: 建议使用battle快照防止竞态', koStart);
  assert.ok(koStart >= 0 && normalWinStart > koStart, '未找到捕虫击倒专用分支');
  const koBranch = app.slice(koStart, normalWinStart);
  assert.equal(koBranch.includes('grantContestReward'), false);
  assert.ok(koBranch.includes("result: '捕虫失败'"));

  const catchStart = app.indexOf("if (battle.type === 'contest_bug')");
  const catchEnd = app.indexOf('// ▲▲▲', catchStart);
  assert.ok(catchStart >= 0 && catchEnd > catchStart, '未找到捕虫捕获专用分支');
  const catchBranch = app.slice(catchStart, catchEnd);
  assert.ok(catchBranch.includes('grantContestReward(CONTEST_CONFIG.bug, score, newPet, { rewardSubjectPet: true })'));
  assert.equal(catchBranch.includes('return [...synced, newPet]'), false);
});

check('活动逃跑、主动退出与重复结算都有状态保护', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');

  const runStart = app.indexOf('const handleRun = async () =>');
  const runEnd = app.indexOf('battleKeyboardActionRef.current', runStart);
  assert.ok(runStart >= 0 && runEnd > runStart, '未找到逃跑处理函数');
  const runBranch = app.slice(runStart, runEnd);
  assert.ok(runBranch.includes("battle.type === 'contest_bug'"));
  assert.ok(runBranch.includes('syncPartyBattleResources(prev, contestEscapeSnap.playerCombatStates)'));

  const fishingStart = app.indexOf('const renderFishingGame = () =>');
  const fishingEnd = app.indexOf('const renderBeautyContest = () =>', fishingStart);
  assert.ok(fishingStart >= 0 && fishingEnd > fishingStart, '未找到钓鱼界面');
  const fishingView = app.slice(fishingStart, fishingEnd);
  assert.ok(fishingView.includes('setActiveContest(null)'));

  const rewardStart = app.indexOf('const grantContestReward =');
  const rewardEnd = app.indexOf('// [核心修复] 启动战斗', rewardStart);
  assert.ok(rewardStart >= 0 && rewardEnd > rewardStart, '未找到活动结算函数');
  const rewardBranch = app.slice(rewardStart, rewardEnd);
  assert.ok(app.includes('const contestRewardLockRef = useRef(false)'));
  assert.ok(rewardBranch.includes('if (contestRewardLockRef.current) return;'));
  assert.ok(rewardBranch.includes('contestRewardLockRef.current = true;'));
  assert.ok(app.includes('contestRewardLockRef.current = false;\n        setResultData(null);'));
});

check('道馆主线目标具备地图感叹号与高优先级样式', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/App.css'), 'utf8');
  assert.ok(app.includes('gym-quest-bubble'));
  assert.ok(app.includes("storyObjective?.kind === 'gym'"));
  assert.ok(css.includes('.grid-screen-redesign .gym-quest-bubble'));
  assert.ok(css.includes('animation: story-gym-bubble-hop'));
});

console.log(`\nRegression checks passed: ${passed}`);
