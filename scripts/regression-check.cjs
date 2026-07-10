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


const projectModuleCache = new Map();
function loadProjectModule(relativePath) {
  let filename = path.resolve(root, relativePath);
  if (!path.extname(filename)) filename += '.js';
  if (projectModuleCache.has(filename)) return projectModuleCache.get(filename).exports;

  const source = fs.readFileSync(filename, 'utf8');
  const transformed = babel.transformSync(source, {
    filename,
    presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
    babelrc: false,
    configFile: false,
    sourceMaps: false,
  }).code;
  const module = { exports: {} };
  projectModuleCache.set(filename, module);
  const localRequire = specifier => {
    if (!specifier.startsWith('.')) throw new Error(`Unexpected dependency ${specifier} while loading ${filename}`);
    return loadProjectModule(path.resolve(path.dirname(filename), specifier));
  };
  vm.runInNewContext(transformed, {
    module,
    exports: module.exports,
    require: localRequire,
    console,
    Date,
    Math,
    Set,
    Map,
    Number,
    Object,
    Array,
  }, { filename });
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

const petsData = loadProjectModule('src/data/pets.js');
const mapsData = loadProjectModule('src/data/maps.js');
const storyData = loadProjectModule('src/data/story.js');
const battlesData = loadProjectModule('src/data/battles.js');
const itemsData = loadProjectModule('src/data/items.js');
const typesData = loadProjectModule('src/data/types.js');
const guideData = loadProjectModule('src/data/gameGuide.js');

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


check('昼夜、天气和亲密度进化只在真实条件满足时开放', () => {
  const dex = [
    { id: 10, evo: 11, evoLvl: 20, evoCondition: { time: 'NIGHT' } },
    { id: 11 },
    { id: 20, evo: 21, evoLvl: 20, evoCondition: { weather: 'RAIN' } },
    { id: 21 },
    { id: 30, evo: 31, evoLvl: 20, evoCondition: { intimacy: 180 } },
    { id: 31 },
  ];
  assert.equal(progression.getEvolutionReadiness({ id: 10, level: 20 }, dex, { timePhase: 'day' }).ready, false);
  assert.equal(progression.getEvolutionReadiness({ id: 10, level: 20 }, dex, { timePhase: 'night' }).ready, true);
  assert.equal(progression.getEvolutionReadiness({ id: 20, level: 20 }, dex, { weather: 'SUN' }).ready, false);
  assert.equal(progression.getEvolutionReadiness({ id: 20, level: 20 }, dex, { weather: 'rain' }).ready, true);
  assert.equal(progression.getEvolutionReadiness({ id: 30, level: 20, intimacy: 179 }, dex).ready, false);
  assert.equal(progression.getEvolutionReadiness({ id: 30, level: 20, intimacy: 180 }, dex).ready, true);
});

check('道具进化必须主动使用匹配的进化石，升级和错误石头都不能代替', () => {
  const pet = { id: 40, level: 30 };
  const dex = [
    { id: 40, evo: 41, evoLvl: 20, evoCondition: { item: ['leaf_stone', 'sun_stone'] } },
    { id: 41 },
  ];
  assert.equal(progression.getEvolutionReadiness(pet, dex).ready, false);
  assert.equal(progression.getEvolutionReadiness(pet, dex, { allowItem: true }).ready, false);
  assert.equal(progression.getEvolutionReadiness(pet, dex, { allowItem: true, itemId: 'fire_stone' }).ready, false);
  assert.equal(progression.getEvolutionReadiness(pet, dex, { allowItem: true, itemId: 'leaf_stone' }).ready, true);
});

check('分支进化按当前环境选择目标，普通条件仍回退默认目标', () => {
  const dex = [
    { id: 50, evo: 51, evoLvl: 20, evoAlt: [{ target: 52, condition: { time: 'NIGHT' } }] },
    { id: 51 },
    { id: 52 },
  ];
  const day = progression.getEvolutionReadiness({ id: 50, level: 20 }, dex, { timePhase: 'DAY' });
  const night = progression.getEvolutionReadiness({ id: 50, level: 20 }, dex, { timePhase: 'NIGHT' });
  assert.equal(day.ready, true);
  assert.equal(day.targetId, 51);
  assert.equal(night.ready, true);
  assert.equal(night.targetId, 52);
});

check('旧存档中间形态会恢复后续进化，终端形态会清除陈旧目标', () => {
  const dex = [
    { id: 60, evo: 61, evoLvl: 16 },
    { id: 61, evo: 62, evoLvl: 36 },
    { id: 62 },
  ];
  const middle = progression.refreshPetEvolution({ id: 61, level: 40, evo: null, evoLvl: null, isEvolved: true, canEvolve: false }, dex);
  assert.equal(middle.evo, 62);
  assert.equal(middle.evoLvl, 36);
  assert.equal(middle.isEvolved, false);
  assert.equal(middle.canEvolve, true);

  const terminal = progression.refreshPetEvolution({ id: 62, level: 80, evo: 999, evoLvl: 99, isEvolved: false, canEvolve: true }, dex);
  assert.equal(terminal.evo, null);
  assert.equal(terminal.evoLvl, null);
  assert.equal(terminal.isEvolved, true);
  assert.equal(terminal.canEvolve, false);
});

check('进化队列无变化保持原引用，有变化才返回新数组', () => {
  const dex = [{ id: 70, evo: 71, evoLvl: 20 }, { id: 71 }];
  const stablePet = { id: 70, level: 10, evo: 71, evoLvl: 20, canEvolve: false, isEvolved: false };
  const stableRoster = [stablePet];
  assert.equal(progression.refreshEvolutionRoster(stableRoster, dex), stableRoster);

  const staleRoster = [{ ...stablePet, level: 20, canEvolve: false }];
  const refreshed = progression.refreshEvolutionRoster(staleRoster, dex);
  assert.notEqual(refreshed, staleRoster);
  assert.equal(refreshed[0].canEvolve, true);
});

check('进化石来源不会被陈旧 isEvolved 标记提前阻挡，详情说明以图鉴为准', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const stoneStart = app.indexOf("if (usingItem.category === 'stone')");
  const stoneEnd = app.indexOf('// --- 药品逻辑', stoneStart);
  assert.ok(stoneStart >= 0 && stoneEnd > stoneStart, '未找到进化石处理分支');
  const stoneBranch = app.slice(stoneStart, stoneEnd);
  assert.equal(stoneBranch.includes('if (pet.isEvolved)'), false);
  assert.ok(stoneBranch.includes('STONE_EVO_RULES[pet.id]'));
  assert.ok(stoneBranch.includes('{ allowItem: true, itemId: stoneId }'));
  assert.equal(app.includes('if (!nextDex || viewStatPet.isEvolved) return null;'), false);
  assert.ok(app.includes('if (!nextDex) return null;'));
});

check('批量经验糖只刷新进化资格，不直接篡改物种身份', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const batchStart = app.indexOf("title: '🍬 批量使用经验糖果'");
  const batchEnd = app.indexOf('const oldLv = pet.level;', batchStart);
  assert.ok(batchStart >= 0 && batchEnd > batchStart, '未找到批量经验糖处理分支');
  const batchBranch = app.slice(batchStart, batchEnd);
  assert.ok(batchBranch.includes('refreshPetEvolution(p, POKEDEX'));
  assert.equal(/\bp\.(id|name|type|secondaryType)\s*=/.test(batchBranch), false);
});

check('图鉴、地图、进化链和活动奖励引用全部有效', () => {
  const { POKEDEX, STONE_EVO_RULES } = petsData;
  const { MAPS } = mapsData;
  const { CONTEST_CONFIG, DUNGEONS } = battlesData;
  const petIds = new Set(POKEDEX.map(pet => pet.id));
  assert.equal(petIds.size, POKEDEX.length, '图鉴存在重复 ID');

  for (const pet of POKEDEX) {
    if (pet.evo != null) {
      assert.ok(petIds.has(pet.evo), `${pet.id} 的进化目标 ${pet.evo} 不存在`);
      assert.notEqual(pet.evo, pet.id, `${pet.id} 不能进化为自身`);
    }
    for (const alt of pet.evoAlt || []) {
      assert.ok(petIds.has(alt.target), `${pet.id} 的分支进化目标 ${alt.target} 不存在`);
    }
  }

  for (const [sourceId, rules] of Object.entries(STONE_EVO_RULES)) {
    assert.ok(petIds.has(Number(sourceId)), `进化石来源 ${sourceId} 不存在`);
    for (const [stoneId, targetId] of Object.entries(rules)) {
      assert.ok(itemsData.EVO_STONES[stoneId], `进化石 ${stoneId} 未定义`);
      assert.ok(petIds.has(targetId), `进化石目标 ${targetId} 不存在`);
    }
  }

  for (const map of MAPS) {
    for (const petId of map.pool || []) assert.ok(petIds.has(petId), `地图 ${map.id} 的池 ${petId} 不存在`);
    if (map.gymLeader != null) assert.ok(petIds.has(map.gymLeader), `地图 ${map.id} 的馆主 ${map.gymLeader} 不存在`);
  }

  for (const config of Object.values(CONTEST_CONFIG)) {
    for (const petId of config.pool || []) assert.ok(petIds.has(petId), `${config.id} 池 ${petId} 不存在`);
    for (const tier of config.tiers || []) assert.ok(petIds.has(tier.id), `${config.id} 奖励 ${tier.id} 不存在`);
  }
  assert.ok(CONTEST_CONFIG.fishing.pool.length > 1, '钓鱼池必须有多个候选物种');

  for (const dungeon of DUNGEONS) {
    if (dungeon.boss != null) assert.ok(petIds.has(dungeon.boss), `副本 ${dungeon.id} 首领 ${dungeon.boss} 不存在`);
    if (dungeon.rewardId != null) assert.ok(petIds.has(dungeon.rewardId), `副本 ${dungeon.id} 奖励 ${dungeon.rewardId} 不存在`);
  }
});

check('主线章节、任务坐标和战斗引用全部有效', () => {
  const mapById = new Map(mapsData.MAPS.map(map => [map.id, map]));
  const petIds = new Set(petsData.POKEDEX.map(pet => pet.id));
  for (const chapter of storyData.STORY_SCRIPT) {
    assert.ok(mapById.has(chapter.mapId), `章节 ${chapter.chapter} 地图 ${chapter.mapId} 不存在`);
    const taskSteps = (chapter.tasks || []).map(task => task.step);
    assert.equal(new Set(taskSteps).size, taskSteps.length, `章节 ${chapter.chapter} 任务 step 重复`);
    taskSteps.slice().sort((a, b) => a - b).forEach((step, index) => assert.equal(step, index, `章节 ${chapter.chapter} 的任务 step 不连续`));
    for (const task of chapter.tasks || []) {
      assert.ok(Number.isFinite(task.x) && Number.isFinite(task.y), `章节 ${chapter.chapter} 任务缺少坐标`);
      assert.ok(task.x >= 0 && task.x < 30 && task.y >= 0 && task.y < 20, `章节 ${chapter.chapter} 任务坐标越界`);
      if (task.enemyId != null) assert.ok(petIds.has(task.enemyId), `章节 ${chapter.chapter} 敌人 ${task.enemyId} 不存在`);
      for (const enemy of task.eliteParty || []) assert.ok(petIds.has(enemy.id), `章节 ${chapter.chapter} 队伍敌人 ${enemy.id} 不存在`);
    }
  }
});

check('游戏说明结构、跳转、动态统计与真实配置一致', () => {
  const { GUIDE_STATS, GUIDE_UNLOCKS, GUIDE_QUICK_FIXES } = guideData;
  const GAME_GUIDE = guideData.default;
  const categoryIds = new Set();
  const targets = new Set();
  for (const category of GAME_GUIDE) {
    assert.ok(category.id && category.title && Array.isArray(category.sections), '说明分类字段不完整');
    assert.equal(categoryIds.has(category.id), false, `说明分类 ID ${category.id} 重复`);
    categoryIds.add(category.id);
    const sectionIds = new Set();
    for (const section of category.sections) {
      assert.ok(section.id && section.title && section.summary, `${category.id} 存在不完整章节`);
      assert.equal(sectionIds.has(section.id), false, `${category.id}/${section.id} 重复`);
      sectionIds.add(section.id);
      targets.add(`${category.id}/${section.id}`);
      for (const field of ['steps', 'bullets', 'tips', 'warnings']) {
        if (section[field] != null) assert.ok(Array.isArray(section[field]), `${category.id}/${section.id}.${field} 必须是数组`);
      }
    }
  }
  for (const fix of GUIDE_QUICK_FIXES) {
    assert.ok(targets.has(`${fix.categoryId}/${fix.sectionId}`), `快速排障 ${fix.id} 跳转目标不存在`);
  }

  const unlockBadges = GUIDE_UNLOCKS.map(row => row.badges);
  assert.equal(new Set(unlockBadges).size, unlockBadges.length, '徽章解锁档位重复');
  assert.deepEqual(unlockBadges, unlockBadges.slice().sort((a, b) => a - b), '徽章解锁档位未升序');

  const statMap = Object.fromEntries(GUIDE_STATS.map(stat => [stat.id, stat.value]));
  assert.equal(statMap.pets, petsData.POKEDEX.length);
  assert.equal(statMap.maps, mapsData.MAPS.length);
  assert.equal(statMap.story, storyData.STORY_SCRIPT.length);
  assert.equal(statMap.dungeons, battlesData.DUNGEONS.length);
  assert.equal(statMap.types, Object.keys(typesData.TYPES).length);
  assert.equal(statMap.badges, mapsData.MAIN_GYM_BADGE_COUNT);
});

check('游戏说明明确覆盖本次五项修复且不保留旧错误说法', () => {
  const guideText = JSON.stringify(guideData.default);
  for (const required of [
    '每次随机抽取，并避免紧接着重复上一物种',
    '把虫子打倒会判定捕虫失败',
    '学习技能不会取消已经满足的进化资格',
    '评级只按六项 IV 的平均值计算',
    '第四章击败“暗影执行者·厌晚”后',
  ]) assert.ok(guideText.includes(required), `说明缺少关键规则：${required}`);
  for (const forbidden of ['击倒也奖励巴大蝴', '副本 21 个']) {
    assert.equal(guideText.includes(forbidden), false, `说明仍包含错误说法：${forbidden}`);
  }
});


check('成长道具说明与实际等级规则一致', () => {
  const growthItems = new Map(itemsData.GROWTH_ITEMS.map(item => [item.id, item]));
  assert.ok(growthItems.get('exp_candy')?.desc.includes('提升1级'));
  assert.ok(growthItems.get('max_candy')?.desc.includes('最多提升20级'));
  assert.ok(growthItems.get('max_candy')?.desc.includes('需8徽章'));

  const guideText = JSON.stringify(guideData.default);
  assert.ok(guideText.includes('经验糖每颗提升 1 级'));
  assert.ok(guideText.includes('神奇糖果需要 8 枚徽章，每颗最多提升 20 级'));
});

console.log(`\nRegression checks passed: ${passed}`);
