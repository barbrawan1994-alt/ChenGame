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
  const requested = path.resolve(root, relativePath);
  const candidates = path.extname(requested)
    ? [requested]
    : [`${requested}.js`, path.join(requested, 'index.js')];
  const filename = candidates.find(candidate => fs.existsSync(candidate));
  if (!filename) throw new Error(`Cannot resolve project module ${relativePath}`);
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
const fusionRules = loadUtility('src/utils/fusionRules.js');
const petIdentity = loadUtility('src/utils/petIdentity.js');

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
const skillsData = loadProjectModule('src/data/skills.js');
const battleAi = loadProjectModule('src/utils/battleAi.js');
const livePetFactory = loadProjectModule('src/utils/petFactory.js');
const guideData = loadProjectModule('src/data/gameGuide.js');
const statsCalculator = loadProjectModule('src/utils/statsCalculator.js');
const resonanceData = loadProjectModule('src/data/resonance.js');
const pveBattleRules = loadProjectModule('src/utils/pveBattleRules.js');
const expeditionData = loadProjectModule('src/data/expedition.js');
const trainingData = loadProjectModule('src/data/training.js');
const arenaData = loadProjectModule('src/data/arena.js');
const worldBossData = loadProjectModule('src/data/worldBoss.js');
const bountyData = loadProjectModule('src/data/bountyTemplates.js');
const housingData = loadProjectModule('src/data/housing.js');
const infinityData = loadProjectModule('src/data/infinityExpedition.js');
const narutoData = loadProjectModule('src/data/naruto.js');
const saveNormalizer = loadProjectModule('src/utils/saveNormalizer.js');
const pvpImport = loadProjectModule('src/utils/pvpImport.js');

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

check('精灵工厂会归一化非法、字符串和越界等级', () => {
  assert.equal(petFactory.createPet(1, undefined, false, false, { preserveSpecies: true }).level, 1);
  assert.equal(petFactory.createPet(1, '25.9', false, false, { preserveSpecies: true }).level, 25);
  assert.equal(petFactory.createPet(1, Number.NaN, false, false, { preserveSpecies: true }).level, 1);
  assert.equal(petFactory.createPet(1, 999, false, false, { preserveSpecies: true }).level, 100);
});

check('单打敌方目标描述不会被重复包裹成无效目标', () => {
  const unit = { name: '蜂女王', currentHp: 120 };
  const descriptor = { unit, idx: 2 };
  const normalizedDescriptor = battleAi.normalizeCombatTargets(descriptor, 0);
  assert.equal(normalizedDescriptor.length, 1);
  assert.equal(normalizedDescriptor[0], descriptor);

  const normalizedUnit = battleAi.normalizeCombatTargets(unit, 3);
  assert.equal(normalizedUnit.length, 1);
  assert.equal(normalizedUnit[0].unit, unit);
  assert.equal(normalizedUnit[0].idx, 3);
  assert.equal(battleAi.normalizeCombatTargets({ unit: { currentHp: 0 }, idx: 1 }, 0).length, 0);
});

check('高等级敌方精灵拥有可用的真实技能和完整PP', () => {
  const enemy = livePetFactory.createPet(570, 86, true, false, { preserveSpecies: true });
  assert.equal(enemy.name, '格斗猩猩');
  assert.equal(enemy.level, 86);
  assert.ok(enemy.moves.length > 0 && enemy.moves.length <= 4);
  enemy.moves.forEach(move => {
    assert.ok(move.name && move.name !== '挣扎');
    assert.ok(move.pp > 0);
    assert.ok(move.maxPP > 0);
  });
});

check('敌方战斗HUD完整显示军团名，不再使用省略号截断', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const hudStart = app.indexOf('{/* 敌方 HUD */}');
  const hudEnd = app.indexOf('{/* 敌方精灵 */}', hudStart);
  const enemyHud = app.slice(hudStart, hudEnd);
  assert.ok(enemyHud.includes('data-testid="enemy-owner-name"'));
  assert.ok(enemyHud.includes('data-testid="enemy-pet-name"'));
  assert.ok(enemyHud.includes('data-testid="enemy-level"'));
  assert.ok(enemyHud.includes("renderSectBadge(e, 'enemy')"));
  assert.ok(enemyHud.includes("renderTraitBadge(e, 'enemy')"));
  assert.ok(enemyHud.includes("renderBattleFruitBadge(e, 'enemy')"));
  assert.ok(enemyHud.includes("renderBattleGeneralsBadge(battle.enemyGenerals, 'enemy')"));
  assert.ok(enemyHud.includes('data-testid="enemy-gang-badge"'));
  assert.ok(enemyHud.includes('renderBattleStageRow(e, 0, false)'));
  assert.equal(enemyHud.includes("textOverflow:'ellipsis'"), false);
  assert.equal(enemyHud.includes("maxWidth:'160px'"), false);
  assert.equal((app.match(/className="battle-level-badge"/g) || []).length, 4);
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
  const normalWinStart = app.indexOf('// 延迟持久化继续使用本次结算快照', koStart);
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
  assert.ok(runBranch.includes('battleSpecialActionLockRef.current'));
  assert.ok(runBranch.includes('finally'));

  const catchStart = app.indexOf('const handleCatch = async (ballType) =>');
  const catchEnd = app.indexOf('const depositPokemon =', catchStart);
  const catchAction = app.slice(catchStart, catchEnd);
  assert.ok(catchAction.includes('battleSpecialActionLockRef.current'));
  assert.ok(catchAction.includes('inventoryRef.current?.balls'));
  assert.ok(catchAction.includes('kingdomWarRef.current?.warBalls'));
  assert.ok(catchAction.includes('inventoryRef.current = nextInventory'));
  assert.ok(catchAction.includes('kingdomWarRef.current = nextKw'));

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

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const manualStart = app.indexOf('const handleManualEvolve =');
  const manualEnd = app.indexOf('const startLearningMove =', manualStart);
  const manualBranch = app.slice(manualStart, manualEnd);
  assert.ok(manualBranch.includes('getEvolutionReadiness(pet, POKEDEX, { timePhase, weather })'));
  assert.ok(manualBranch.includes('const nextForm = readiness.target'));
  assert.equal(manualBranch.includes('sourceDex?.evoCondition'), false);
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

check('精灵基础数值与进化成长保持在可战斗范围', () => {
  const petById = new Map(petsData.POKEDEX.map(pet => [pet.id, pet]));
  const powerOf = pet => {
    const hp = Number(pet.hp ?? 60);
    const atk = Number(pet.atk ?? 50);
    const def = Number(pet.def ?? 50);
    const spd = Number(pet.spd ?? (40 + (pet.id * 7 % 70)));
    return hp + atk * 2 + def * 2 + spd;
  };
  for (const pet of petsData.POKEDEX) {
    for (const [key, fallback] of [['hp', 60], ['atk', 50], ['def', 50], ['spd', 60]]) {
      const value = Number(pet[key] ?? fallback);
      assert.ok(Number.isFinite(value) && value > 0 && value <= 250, `${pet.id} 的 ${key}=${value} 超出可战斗范围`);
    }
    if (pet.evo != null) {
      const target = petById.get(pet.evo);
      assert.ok(powerOf(target) >= powerOf(pet) * 0.75, `${pet.id} -> ${pet.evo} 进化后基础战力异常下降`);
    }
    assert.ok(pet.evoLvl == null || (pet.evoLvl >= 1 && pet.evoLvl <= 100), `${pet.id} 的进化等级越界`);
  }
});

check('技能库数值、概率、命中与效果结构保持合法', () => {
  const allowedEffectTypes = new Set([
    'STATUS', 'BUFF', 'DEBUFF', 'DRAIN', 'HEAL', 'OHKO', 'PROTECT', 'RESET', 'CURE_STATUS', 'DOUBLE_LOW_HP',
  ]);
  const allMoves = Object.entries(skillsData.SKILL_DB).flatMap(([type, moves]) => (
    (moves || []).map((move, index) => ({ ...move, _type: type, _index: index }))
  ));
  assert.ok(allMoves.length >= 400);
  allMoves.forEach(move => {
    assert.ok(move.name, `${move._type}[${move._index}] 缺少技能名`);
    assert.ok(Number.isFinite(Number(move.p)) && Number(move.p) >= 0, `${move.name} 威力非法`);
    assert.ok(Number.isFinite(Number(move.pp)) && Number(move.pp) > 0, `${move.name} PP非法`);
    if (move.acc != null) assert.ok(Number.isFinite(Number(move.acc)) && Number(move.acc) > 0 && Number(move.acc) <= 100, `${move.name} 命中非法`);
    if (move.effect?.chance != null) assert.ok(Number.isFinite(Number(move.effect.chance)) && Number(move.effect.chance) >= 0 && Number(move.effect.chance) <= 1, `${move.name} 概率非法`);
    if (move.effect?.type) assert.ok(allowedEffectTypes.has(move.effect.type), `${move.name} 效果类型未知: ${move.effect.type}`);
    if (Number(move.p) === 0) assert.ok(move.effect || move.val || move.alwaysHit, `${move.name} 零威力且无效果`);
  });
  Object.entries(skillsData.SKILL_DB).forEach(([type, moves]) => {
    const names = (moves || []).map(move => move.name);
    assert.equal(new Set(names).size, names.length, `${type} 存在同名重复技能`);
  });
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
  const { GUIDE_STATS, GUIDE_UNLOCKS, GUIDE_QUICK_FIXES, GUIDE_SYSTEM_COVERAGE } = guideData;
  const GAME_GUIDE = guideData.default;
  const categoryIds = new Set();
  const targets = new Set();
  let sectionCount = 0;
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
      sectionCount++;
      for (const field of ['steps', 'bullets', 'tips', 'warnings']) {
        if (section[field] != null) assert.ok(Array.isArray(section[field]), `${category.id}/${section.id}.${field} 必须是数组`);
      }
    }
  }
  for (const fix of GUIDE_QUICK_FIXES) {
    assert.ok(targets.has(`${fix.categoryId}/${fix.sectionId}`), `快速排障 ${fix.id} 跳转目标不存在`);
  }
  assert.ok(GAME_GUIDE.length >= 15, `说明分类不足：${GAME_GUIDE.length}`);
  assert.ok(sectionCount >= 100, `说明主题不足：${sectionCount}`);

  const coverageIds = new Set();
  for (const system of GUIDE_SYSTEM_COVERAGE) {
    assert.ok(system.id && system.label, '系统覆盖清单存在空标识');
    assert.equal(coverageIds.has(system.id), false, `系统覆盖 ID ${system.id} 重复`);
    coverageIds.add(system.id);
    assert.ok(targets.has(`${system.categoryId}/${system.sectionId}`), `系统 ${system.label} 的说明目标不存在`);
  }
  assert.ok(GUIDE_SYSTEM_COVERAGE.length >= 85, `系统覆盖数量不足：${GUIDE_SYSTEM_COVERAGE.length}`);
  for (const requiredSystem of [
    'arena', 'mining', 'training', 'world-boss', 'sect', 'gang', 'housing', 'marriage',
    'chakra-jutsu', 'jujutsu', 'devil-fruit', 'kingdom', 'generals', 'eco-crisis',
    'sanctuary', 'calamity', 'fusion-realms', 'strategic-awaken',
  ]) assert.ok(coverageIds.has(requiredSystem), `完整说明缺少系统：${requiredSystem}`);

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

check('两套成长入口共享等级上限，神奇糖果不会从详情页直升满级', () => {
  const expCandy = itemsData.GROWTH_ITEMS.find(item => item.id === 'exp_candy');
  const maxCandy = itemsData.GROWTH_ITEMS.find(item => item.id === 'max_candy');
  assert.equal(progression.getGrowthItemTargetLevel(40, expCandy), 41);
  assert.equal(progression.getGrowthItemTargetLevel(40, maxCandy), 60);
  assert.equal(progression.getGrowthItemTargetLevel(95, maxCandy), 100);
  const level99 = { level: 99, exp: 12, nextExp: 100 };
  assert.equal(progression.normalizeMaxLevelProgress(level99), level99);
  assert.deepEqual(
    JSON.parse(JSON.stringify(progression.normalizeMaxLevelProgress({ level: 100, exp: 12, nextExp: 100 }))),
    { level: 100, exp: 0, nextExp: 999999 },
  );

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const detailStart = app.indexOf('const useGrowthItem =');
  const detailEnd = app.indexOf('const setLeader =', detailStart);
  const detailBranch = app.slice(detailStart, detailEnd);
  assert.ok(detailBranch.includes('getGrowthItemTargetLevel(pet.level, item)'));
  assert.equal(detailBranch.includes("item.stat === 'level_max' ? 100"), false);
  assert.equal(detailBranch.includes('pet.moves.forEach(m => m.pp ='), false);
  assert.ok(detailBranch.includes('refreshPetEvolution(pet, POKEDEX'));
  assert.ok(detailBranch.includes('pet.currentHp + Math.max(0, newMaxHp - oldMaxHp)'));
});

check('跨多级升级会排队保留全部待学技能', () => {
  const basePet = {
    moves: [1, 2, 3, 4].map(id => ({ id, name: `旧技能${id}` })),
    pendingLearnMove: null,
    pendingLearnMoves: [],
  };
  const first = progression.offerMoveToPet(basePet, { id: 10, name: '新技能A', pp: 5 });
  const second = progression.offerMoveToPet(first.pet, { id: 11, name: '新技能B', pp: 8 });
  const duplicate = progression.offerMoveToPet(second.pet, { id: 11, name: '新技能B', pp: 8 });
  assert.equal(first.status, 'pending');
  assert.equal(second.status, 'queued');
  assert.equal(second.pet.pendingLearnMove.name, '新技能A');
  assert.equal(second.pet.pendingLearnMoves.length, 1);
  assert.equal(duplicate.status, 'duplicate');

  const advanced = progression.advancePendingLearnMove({ ...second.pet, pendingLearnMove: null });
  assert.equal(advanced.pendingLearnMove.name, '新技能B');
  assert.equal(advanced.pendingLearnMoves.length, 0);
});

check('闪光晋升统一补齐魅力和门派奖励且不会重复叠加', () => {
  const normal = { isShiny: false, charm: 50, charmRank: '可爱鬼', sectLevel: 1 };
  const shiny = petFactory.promotePetToShiny(normal);
  assert.equal(shiny.isShiny, true);
  assert.equal(shiny.charm, 80);
  assert.equal(shiny.charmRank, '人气王');
  assert.equal(shiny.sectLevel, 2);
  assert.equal(petFactory.promotePetToShiny(shiny), shiny);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('promotePetToShiny(wildPet)'));
  assert.ok(app.includes('const shouldBeShiny = wasShiny ||'));
  assert.equal(
    (app.match(/Math\.random\(\) < 0\.05 \* \(spBonuses\.shinyRate \|\| 1\)/g) || []).length,
    2,
    '直接转生和洗练预览都应应用伴侣的闪光率加成',
  );
  const directRebirthStart = app.indexOf('const useRebirthPill =');
  const directRebirthEnd = app.indexOf('const getSpouseBonuses =', directRebirthStart);
  const directRebirthBranch = app.slice(directRebirthStart, directRebirthEnd);
  assert.ok(directRebirthBranch.includes('const cost = pet.isShiny ? 2 : 1'));
  assert.ok(directRebirthBranch.includes('rebirth_pill: currentStock - cost'));
  assert.ok(directRebirthBranch.includes('inventoryActionLocksRef.current.has(lockKey)'));
  assert.ok(directRebirthBranch.includes('partyRef.current = newParty'));
  assert.ok(directRebirthBranch.includes('inventoryRef.current = nextInventory'));
  assert.equal((directRebirthBranch.match(/crit: Math\.floor\(Math\.random\(\) \* 10\)/g) || []).length, 1);
  const spawnStart = app.indexOf('const spawnWildPet =');
  const spawnEnd = app.indexOf('return wildPet;', spawnStart);
  const spawnBranch = app.slice(spawnStart, spawnEnd);
  assert.ok(spawnBranch.includes('else if (!wildPet.isShiny)'));
  assert.ok(spawnBranch.includes('blessed,'));

  assert.equal(
    resonanceData.getEffectiveShinyBonus({ shinyRateBonus: 0.08 }, { blessed: false, nightPhase: true }),
    0.08,
  );
  assert.equal(
    resonanceData.getEffectiveShinyBonus({ shinyRateBonus: 0.5 }, { blessed: false, nightPhase: true }),
    0.25,
  );
});

check('融合概率有明确上限，融合体不能递归融合或参与传承', () => {
  assert.equal(fusionRules.canUseAsFusionMaterial({ isFusion: false }), true);
  assert.equal(fusionRules.canUseAsFusionMaterial({ isFusion: true }), false);
  assert.equal(fusionRules.canUseAsFusionMaterial({ isFusedShiny: true }), false);
  assert.ok(Math.abs(fusionRules.getFusionShinyChance({ level: 1 }, { level: 1 }) - 0.152) < 1e-9);
  assert.equal(fusionRules.getFusionShinyChance({ level: 100, isShiny: true }, { level: 100, isShiny: true }), 0.5);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('!canUseAsFusionMaterial(p1) || !canUseAsFusionMaterial(p2)'));
  assert.ok(app.includes('!p.isFusion && !p.isFusedShiny'));
  assert.ok(app.includes('const fusionCharm ='));
  assert.ok(app.includes('{ ...promotePetToShiny(newPet), isFusedShiny: true }'));
  assert.ok(JSON.stringify(guideData.default).includes('融合体不能再次融合，也不能参与精灵传承'));
});

check('属性面板与实战共用40%暴击上限，满PP与0PP显示不再混淆', () => {
  const base = petsData.POKEDEX[0];
  const stats = statsCalculator.getStats({
    ...base,
    level: 100,
    ivs: { hp: 0, p_atk: 0, p_def: 0, s_atk: 0, s_def: 0, spd: 0, crit: 99 },
    evs: { crit: 999 },
    equips: [],
  });
  assert.equal(statsCalculator.MAX_BATTLE_CRIT_CHANCE, 40);
  assert.equal(stats.crit, 40);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('Math.min(MAX_BATTLE_CRIT_CHANCE, critChance)'));
  assert.ok(app.includes('PP: {m.pp ?? 20}'));
  assert.equal(app.includes('PP: {m.pp||20}'), false);
});

check('PvP 对战码只接受本地物种、技能与限幅养成数据', () => {
  const localPet = petsData.POKEDEX[0];
  const localMove = skillsData.SKILL_DB[localPet.type]?.[0] || skillsData.SKILL_DB.NORMAL[0];
  const team = pvpImport.sanitizeImportedPvpTeam([{
    id: localPet.id,
    level: 100,
    name: '超长名字'.repeat(10),
    type: 'GOD',
    secondaryType: 'CHAOS',
    trait: '__hacked__',
    nature: '__hacked__',
    customBaseStats: { hp: 999999, crit: 999999 },
    equips: [{ val: 999999 }],
    moves: [
      { name: localMove.name, t: localPet.type, p: 999999, pp: 999999, effect: { type: 'OHKO' } },
      { name: '__hacked__', p: 999999, pp: 999999 },
    ],
    ivs: { hp: 999, p_atk: -5, crit: Number.POSITIVE_INFINITY },
    evs: { hp: 252, p_atk: 252, p_def: 252, crit: 999 },
    devilFruit: '__hacked__',
  }], 20);
  assert.equal(team.length, 1);
  assert.equal(team[0].level, 38);
  assert.equal(team[0].type, localPet.type);
  assert.equal(team[0].secondaryType, localPet.type2 || localPet.secondaryType || null);
  assert.equal(team[0].trait, undefined);
  assert.equal(team[0].nature, 'docile');
  assert.equal(team[0].moves.length, 1);
  assert.equal(team[0].moves[0].p, localMove.p);
  assert.equal(team[0].moves[0].effect, localMove.effect);
  assert.ok(team[0].moves[0].pp <= team[0].moves[0].maxPP);
  assert.equal(team[0].ivs.hp, 31);
  assert.equal(team[0].ivs.p_atk, 0);
  assert.equal(team[0].evs.hp + team[0].evs.p_atk + team[0].evs.p_def, 510);
  assert.equal(team[0].evs.crit, 40);
  assert.equal(team[0].customBaseStats, undefined);
  assert.equal(team[0].equips, undefined);
  assert.equal(team[0].devilFruit, undefined);
});

check('共享属性计算防御非法等级并保留显式零基础暴击', () => {
  const basePet = { id: petsData.POKEDEX[0].id, level: Number.NaN, customBaseStats: { hp: 50, p_atk: 50, p_def: 50, s_atk: 50, s_def: 50, spd: 50, crit: 0 }, ivs: {}, evs: {} };
  const stats = statsCalculator.getStats(basePet, null, null, {}, {});
  assert.ok(Object.values(stats).every(Number.isFinite));
  assert.equal(stats.crit, 0);
});

check('双打倒下的出战精灵按50%系数获得经验，旧档经验字段会被修复', () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(progression.getActiveBattleSlotIndexes({ isDouble: true, activeIdxs: [0, '2', 2] }))),
    [0, 2],
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(progression.getActiveBattleSlotIndexes({ isDouble: false, activeIdx: 3 }))),
    [3],
  );

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const expStart = app.indexOf('const processDefeatedEnemy =');
  const expEnd = app.indexOf('const enterInfinityCastle =', expStart);
  const expBranch = app.slice(expStart, expEnd);
  assert.ok(expBranch.includes('const activeSlotIdxs = new Set(getActiveBattleSlotIndexes(bState))'));
  assert.ok(expBranch.includes('const isActive = activeSlotIdxs.has(index)'));
  assert.ok(expBranch.includes('const faintedMult = isFainted ? 0.5 : 1.0'));
  assert.ok(expBranch.includes('pet.exp = Math.max(0, Number(pet.exp) || 0) + expGain'));

  const hydrateStart = app.indexOf('const hydrateSavedPet =');
  const hydrateEnd = app.indexOf('const hydrateSavedPetCollections =', hydrateStart);
  const hydrateBranch = app.slice(hydrateStart, hydrateEnd);
  assert.ok(hydrateBranch.includes('hydrated.level = Math.max(1, Math.min(100'));
  assert.ok(hydrateBranch.includes('calcNextExp(hydrated.level, expMod)'));
  assert.ok(hydrateBranch.includes('if (hydrated.isFusedShiny)'));
});

check('单打与双打共用平衡后的灼伤、中毒和剧毒伤害', () => {
  assert.equal(pveBattleRules.calcResidualStatusDamage(160, 'BRN'), 10);
  assert.equal(pveBattleRules.calcResidualStatusDamage(160, 'PSN'), 20);
  assert.equal(pveBattleRules.calcResidualStatusDamage(160, 'PSN', { badlyPoisoned: true, badlyPoisonedTurns: 1 }), 10);
  assert.equal(pveBattleRules.calcResidualStatusDamage(160, 'PSN', { badlyPoisoned: true, badlyPoisonedTurns: 8 }), 40);
  assert.equal(pveBattleRules.calcResidualStatusDamage(160, 'PAR'), 0);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.equal((app.match(/calcResidualStatusDamage\(/g) || []).length, 2);
  assert.equal(app.includes("unit.status !== 'BRN' && unit.status !== 'PSN'"), true);
  assert.equal(app.includes("s.status === 'BRN' || s.status === 'PSN'"), true);
});

check('所有战斗入口保留显式零金币配置，不会回退为默认掉落', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const battleInit = app.slice(app.indexOf('const startBattle ='), app.indexOf('const startTowerChallenge ='));
  assert.equal(/context(?:\?\.)?\.drop\s*\|\|/.test(battleInit), false);
  assert.ok((battleInit.match(/context(?:\?\.)?\.drop\s*\?\?/g) || []).length >= 8);
  assert.ok(app.includes('const normalizedDrop = Math.max(0, Number(drop) || 0)'));
});

check('配置驱动副本与灵域保留显式零掉落', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('drop: step.drop ?? 3000'));
  assert.ok(app.includes('drop: domain.reward?.gold ?? 3000'));
  assert.ok(app.includes('drop: step.drop ?? def.reward?.gold ?? 3000'));
  assert.equal(app.includes('drop: step.drop || 3000'), false);
  assert.equal(app.includes('drop: domain.reward?.gold || 3000'), false);
  assert.equal(app.includes('drop: step.drop || def.reward?.gold || 3000'), false);
});

check('带锁战斗入口在返回失败或抛错时恢复入口状态', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const helper = app.slice(app.indexOf('const attemptBattleStart ='), app.indexOf('const markPlayerTookDamage ='));
  const spirit = app.slice(app.indexOf('const startSpiritDomainBattle ='), app.indexOf('const completeSpiritDomain ='));
  const fusion = app.slice(app.indexOf('const startFusionDungeon ='), app.indexOf('const participateCalamity ='));
  const naruto = app.slice(app.indexOf('const startSurvivalWave ='), app.indexOf('const handleStoryWin ='));
  const activities = app.slice(app.indexOf('const startTowerChallenge ='), app.indexOf('// [新增] PvP AI控制逻辑'));
  const infinity = app.slice(app.indexOf('const startInfinityBattle ='), app.indexOf('const handleWin ='));

  assert.ok(helper.includes('try {'));
  assert.ok(helper.includes('rollback?.();'));
  assert.ok(helper.includes('catch (error)'));
  assert.ok(spirit.includes("attemptBattleStart('灵域挑战'"));
  assert.ok(spirit.includes('spiritDomainStartLockRef.current = false'));
  assert.ok(fusion.includes("attemptBattleStart('秘境副本'"));
  assert.ok(fusion.includes('if (started) setFusionHubOpen(false)'));
  assert.ok(naruto.includes("attemptBattleStart('生存试炼'"));
  assert.ok(naruto.includes("attemptBattleStart('忍者试炼'"));
  assert.ok(naruto.includes("attemptBattleStart('忍界剧情'"));
  assert.ok(activities.includes('setActivityCenter(true)'));
  assert.ok(infinity.includes("attemptBattleStart('无限城'"));
});

check('地图尺寸观察器驱动响应式重算并在离开地图时释放', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const sizing = app.slice(app.indexOf('const mapViewportRef ='), app.indexOf('const mapGridCacheRef ='));
  const viewport = app.slice(app.indexOf('<div className="grid-viewport-v2 map-viewport-frame"'), app.indexOf('const VIEW_COLS'));
  assert.ok(sizing.includes('const observer = new ResizeObserver(updateSize)'));
  assert.ok(sizing.includes('return () => observer.disconnect()'));
  assert.ok(sizing.includes('previous.width === width && previous.height === height'));
  assert.ok(viewport.includes('ref={mapViewportRef}'));
  assert.ok(viewport.includes('const vpW = mapViewportSize.width'));
  assert.equal(viewport.includes('document.querySelector'), false);
});

check('全局提示弹窗在深色主题下保持可读对比度', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const dialogStart = app.indexOf('{/* 全局消息弹窗 */}');
  const dialog = app.slice(dialogStart, dialogStart + 2000);
  assert.ok(dialog.includes('className="global-message-dialog"'));
  assert.ok(dialog.includes("background: '#0b2f47'"));
  assert.ok(dialog.includes("color: '#eef7ff'"));
});

check('名将图鉴详情在深色主题下保留清晰的文字层级', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const theme = fs.readFileSync(path.join(root, 'src/styles/spirit-theme.css'), 'utf8');
  const modalStart = app.indexOf('{/* 名将图鉴详情弹窗 */}');
  const modal = app.slice(modalStart, app.indexOf('{/* 战斗名将详情弹窗 */}', modalStart));
  assert.ok(modal.includes('className="general-dex-detail-modal"'));
  assert.ok(modal.includes('role="dialog"'));
  assert.ok(modal.includes('className="general-dex-detail-heading"'));
  assert.ok(modal.includes('className="general-dex-detail-footer-note"'));
  assert.ok(theme.includes('.general-dex-detail-modal[role="dialog"]'));
  assert.ok(theme.includes('color: #f6d267 !important'));
  assert.ok(theme.includes('color: #c7d9d7 !important'));
  assert.ok(theme.includes('color: #166534 !important'));
});

check('远征仅奖励真实属性契合，单精灵队伍也可正常派遣', () => {
  const zone = expeditionData.EXPEDITION_ZONES.find(entry => entry.id === 'dark_forest');
  assert.equal(expeditionData.calcExpeditionBonus([{ type: 'FIRE' }], zone), 1);
  assert.ok(Math.abs(expeditionData.calcExpeditionBonus([{ type: 'GRASS' }], zone) - 1.495) < 1e-9);
  assert.ok(expeditionData.calcExpeditionBonus([
    { type: 'GRASS' }, { type: 'BUG' }, { type: 'POISON' },
  ], zone) > expeditionData.calcExpeditionBonus([{ type: 'GRASS' }], zone));

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const sendStart = app.indexOf('const sendExpedition =');
  const sendEnd = app.indexOf('const resolveExpeditionBranch =', sendStart);
  const sendBranch = app.slice(sendStart, sendEnd);
  assert.equal(sendBranch.includes('petIds.length >= party.length'), false);
  assert.equal(app.includes('expSelectedPets.length>=party.length'), false);
  assert.ok(app.includes('expeditionClaimLocksRef.current.delete(lockKey);'));
});

check('训练档位成长有效，异常旧档EV会归一化且不会突破总上限', () => {
  const camp = trainingData.TRAINING_CAMPS[0];
  const deterministicGains = trainingData.TRAINING_TIERS.map(tier => (
    trainingData.calcTrainingGain({ evs: {} }, camp, tier, 4, () => 0)
  ));
  assert.equal(Array.from(deterministicGains).join(','), '4,8,14,20');
  assert.ok(deterministicGains.every((gain, index) => index === 0 || gain > deterministicGains[index - 1]));

  const normalized = trainingData.settleTrainingPet(
    { uid: 'legacy', evs: { hp: '250', p_atk: 'not-a-number', p_def: -20, spd: '250' } },
    camp,
    trainingData.TRAINING_TIERS[3],
    10,
    () => 0.999,
  );
  assert.equal(normalized.ok, true);
  assert.equal(normalized.gain, 2);
  assert.equal(normalized.pet.evs.hp, 252);
  assert.equal(normalized.pet.evs.p_atk, 0);
  assert.equal(normalized.pet.evs.p_def, 0);
  assert.equal(Object.values(normalized.pet.evs).reduce((sum, value) => sum + value, 0), 502);

  const capped = trainingData.settleTrainingPet(
    { evs: { hp: 252, p_atk: 252, p_def: 6 } },
    camp,
    trainingData.TRAINING_TIERS[3],
    10,
    () => 0,
  );
  assert.equal(capped.ok, false);
  assert.equal(capped.reason, 'ev_cap');
});

check('后台与退出存档强制同步，并始终使用最新渲染快照', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('buildSavePayloadRef.current = buildSavePayload'));
  assert.ok(app.includes('JSON.stringify(buildSavePayloadRef.current())'));
  assert.ok(app.includes("persistSaveRef.current(true, true)"));
  assert.ok(app.includes('partyLenRef.current > 0'));
  assert.ok(app.includes("window.addEventListener('pagehide', saveImmediately)"));
  assert.ok(app.includes("document.addEventListener('visibilitychange', onVisibilityChange)"));
  assert.equal(app.includes('setTimeout(() => persistSave(true), 100)'), false);
});

check('门派突破、武学和商店会在最新状态上原子复核资源与限购', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const xinfa = app.slice(app.indexOf('const upgradePlayerXinfa ='), app.indexOf('const learnSectMartialArt ='));
  const martial = app.slice(app.indexOf('const learnSectMartialArt ='), app.indexOf('const buyFromSectShop ='));
  const shop = app.slice(app.indexOf('const buyFromSectShop ='), app.indexOf('const advanceSectDaily ='));
  assert.ok(xinfa.includes('latestTier !== cur'));
  assert.ok(xinfa.includes('qiEssence < tierDef.qiCost'));
  assert.ok(martial.includes("(prev.sectMartialArts || []).includes(artId)"));
  assert.ok(martial.includes('scrollPage < scrollCost'));
  assert.ok(shop.includes('currentResource < cost'));
  assert.ok(shop.includes('bought >= item.dailyLimit'));
  assert.ok(shop.includes('if (!purchased)'));
  assert.equal(shop.includes('new Date().toDateString()'), false);
});

check('移动主页从顶部开始且浏览器音频等待首次用户手势', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/App.css'), 'utf8');
  const audioStart = app.indexOf('const [audioUnlocked, setAudioUnlocked]');
  const audioEnd = app.indexOf('const [eventData, setEventData]', audioStart);
  const audioBranch = app.slice(audioStart, audioEnd);
  assert.ok(audioBranch.includes("window.addEventListener('pointerdown', unlockAudio"));
  assert.ok(audioBranch.includes("window.addEventListener('keydown', unlockAudio"));
  assert.ok(audioBranch.includes('if (!audioUnlocked) return;'));
  const homeCssStart = css.indexOf('Premium home gate redesign');
  const responsiveHomeStart = css.indexOf('@media (max-width: 1180px)', homeCssStart);
  const responsiveHome = css.slice(responsiveHomeStart, css.indexOf('@media (max-width: 760px)', responsiveHomeStart));
  assert.ok(responsiveHome.includes('justify-content: flex-start'));
  assert.ok(responsiveHome.includes('height: 100dvh'));
});

check('游戏首页只保留一个无遮挡的开始游戏入口', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/App.css'), 'utf8');
  const menuStart = app.indexOf('const renderMenu = () => {');
  const menu = app.slice(menuStart, app.indexOf('const renderWorldMap = () => {', menuStart));
  const startActions = menu.match(/onClick=\{handleStartGame\}/g) || [];
  assert.equal(startActions.length, 1);
  assert.ok(menu.includes('className="home-cover-main-start"'));
  assert.ok(menu.includes('<strong>开始游戏</strong>'));
  assert.equal(menu.includes('home-cover-start-panel'), false);
  assert.equal(menu.includes('继续冒险'), false);
  assert.equal(css.includes('.home-cover-start-panel'), false);
  assert.equal(css.includes('.home-gate-primary'), false);
});

check('竞技场胜负、徽章拦截与首次晋级奖励为纯且幂等的状态结算', () => {
  const base = { ...arenaData.DEFAULT_ARENA_STATE, stars: 2, tickets: 5 };
  const blocked = arenaData.resolveArenaResult(base, true, 0);
  assert.equal(blocked.state.rank, 'bronze');
  assert.equal(blocked.state.stars, 3);
  assert.equal(blocked.notices.some(notice => notice.type === 'blocked'), true);

  const promoted = arenaData.resolveArenaResult(base, true, 4);
  assert.equal(promoted.state.rank, 'silver');
  assert.equal(promoted.state.stars, 0);
  assert.equal(promoted.rewards.gold, 15000);
  assert.equal(promoted.state.rewardsClaimed.includes('silver'), true);
  assert.equal(promoted.finalRankIndex, 1);

  const noDuplicate = arenaData.resolveArenaResult({ ...base, rewardsClaimed: ['silver'] }, true, 4);
  assert.equal(noDuplicate.state.rank, 'silver');
  assert.equal(noDuplicate.rewards.gold, 0);

  const loss = arenaData.resolveArenaResult({ ...base, rank: 'silver', stars: 1, winStreak: 4 }, false, 4);
  assert.equal(loss.state.stars, 0);
  assert.equal(loss.state.winStreak, 0);
  assert.equal(loss.state.losses, 1);
});

check('竞技场每日刷新按自然日结算赛季，奖杯进入独立饰品仓库', () => {
  const beforeBoundary = arenaData.resolveArenaDailyRefresh({
    ...arenaData.DEFAULT_ARENA_STATE,
    rank: 'master',
    seasonBestRank: 'master',
    seasonStartDate: '2026-06-01',
    lastTicketDate: '2026-06-13',
    tickets: 14,
  }, '2026-06-14');
  assert.equal(beforeBoundary.seasonReward, null);
  assert.equal(beforeBoundary.state.tickets, 15);

  const settled = arenaData.resolveArenaDailyRefresh({
    ...beforeBoundary.state,
    rank: 'master',
    seasonBestRank: 'master',
    seasonStartDate: '2026-06-01',
    lastTicketDate: '2026-06-14',
  }, '2026-06-15');
  assert.equal(settled.seasonReward.accessory, 'trophy');
  assert.equal(settled.seasonReward.gold, 200000);
  assert.equal(settled.state.rank, 'platinum');
  assert.equal(settled.state.season, 2);

  const repeated = arenaData.resolveArenaDailyRefresh(settled.state, '2026-06-15');
  assert.equal(repeated.state, settled.state);
  assert.equal(repeated.seasonReward, null);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const refreshStart = app.indexOf('const refreshArenaDaily =');
  const refreshEnd = app.indexOf('useEffect(() => {', refreshStart);
  const refreshBranch = app.slice(refreshStart, refreshEnd);
  assert.ok(refreshBranch.includes('setAccessories(current => [...current, reward.accessory])'));
  assert.equal(refreshBranch.includes('setInventory('), false);
  assert.equal(refreshBranch.includes('setArenaState(prev =>'), false);
});

check('幸运轮盘严格限制每日3次并在动画前完成加锁与奖励结算', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('const spinWheel =');
  const end = app.indexOf('const grantBountyReward =', start);
  const branch = app.slice(start, end);
  assert.ok(branch.includes('wheelSpinLockRef.current = true'));
  assert.ok(branch.includes('const maxDaily = WHEEL_FREE_SPINS_PER_DAY'));
  assert.equal(branch.includes('WHEEL_FREE_SPINS_PER_DAY + 2'), false);
  assert.ok(branch.indexOf('picked.action();') < branch.indexOf('setTimeout(() =>'));
  assert.ok(branch.includes('luckyWheelRef.current = nextWheel'));
  assert.ok(branch.includes('totalSpins % WHEEL_PITY_INTERVAL === 0'));
});

check('矿场满体力兑换会在扣除矿石前终止', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('const doMineExchange =');
  const end = app.indexOf('const sendExpedition =', start);
  const branch = app.slice(start, end);
  const guard = branch.indexOf("ex.reward.type === 'energy'");
  const deduction = branch.indexOf('minerals[ore] -= need');
  assert.ok(guard >= 0);
  assert.ok(deduction > guard);
  assert.ok(branch.includes("showMapToast('⚡', '体力已满'"));
});

check('世界首领伤害封顶、里程碑和首次击杀奖励状态只结算一次', () => {
  const boss = worldBossData.WORLD_BOSSES[0];
  const state = {
    ...worldBossData.DEFAULT_WORLD_BOSS_STATE,
    currentBossId: boss.id,
    attempts: 2,
    totalDamage: boss.baseHp - 1000,
    claimedMilestones: boss.milestones.slice(0, 3).map(milestone => milestone.dmg),
  };
  const result = worldBossData.resolveWorldBossResult(state, boss, boss.baseHp, 999999);
  assert.equal(result.appliedDamage, 1000);
  assert.equal(result.state.totalDamage, boss.baseHp);
  assert.equal(result.state.attempts, worldBossData.WORLD_BOSS_MAX_ATTEMPTS);
  assert.equal(result.state.defeated, true);
  assert.equal(result.defeatedNow, true);
  assert.equal(result.milestones.length, 1);
  assert.equal(result.state.totalBossesDefeated, 1);

  const repeated = worldBossData.resolveWorldBossResult(result.state, boss, boss.baseHp, 5000);
  assert.equal(repeated.appliedDamage, 0);
  assert.equal(repeated.milestones.length, 0);
  assert.equal(repeated.defeatedNow, false);
  assert.equal(repeated.state.totalBossesDefeated, 1);
});

check('世界首领入口校验战斗启动，结算不再依赖异步临时字段', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('const startWorldBossFight =');
  const resultStart = app.indexOf('const handleWorldBossResult =', start);
  const resultEnd = app.indexOf('const startArenaFight =', resultStart);
  const startBranch = app.slice(start, resultStart);
  const resultBranch = app.slice(resultStart, resultEnd);
  assert.ok(startBranch.includes('worldBossStartLockRef.current = true'));
  assert.ok(startBranch.includes("started = startBattle({"));
  assert.ok(startBranch.includes('if (!started)'));
  assert.ok(startBranch.includes('worldBossActiveFightRef.current ='));
  assert.ok(startBranch.includes('drop: 0'));
  assert.ok(resultBranch.includes('resolveWorldBossResult('));
  assert.ok(resultBranch.includes('worldBossActiveFightRef.current = null'));
  assert.equal(resultBranch.includes('_pendingMilestones'), false);
  assert.equal(resultBranch.includes('setTimeout(() =>'), false);
});

check('竞速使用权威金币和每日次数结算，平速排序保持传递性', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('const startRace =');
  const end = app.indexOf('return (', start);
  const branch = app.slice(start, end);
  assert.ok(branch.includes('const latestRace = raceStateRef.current'));
  assert.ok(branch.includes('const latestRacesUsed ='));
  assert.ok(branch.includes('goldRef.current < raceCost'));
  assert.ok(branch.includes('goldRef.current -= raceCost'));
  assert.ok(branch.includes('raceStateRef.current = nextRaceState'));
  assert.ok(branch.includes('a.tieBreaker - b.tieBreaker'));
  assert.equal(branch.includes('Math.random() < 0.5 ? -1 : 1'), false);
});

check('赏金属性与玩法模板随徽章阶段开放，不会给新手生成未解锁任务', () => {
  const earlyTypes = Array.from(bountyData.getBountyEligibleTypes(0));
  assert.equal(earlyTypes.includes('GOD'), false);
  assert.equal(earlyTypes.includes('CHAOS'), false);
  assert.equal(bountyData.getBountyEligibleTypes(6).includes('CHAOS'), true);
  assert.equal(bountyData.getBountyEligibleTypes(10).includes('GOD'), true);

  for (let i = 0; i < 100; i += 1) {
    const quests = bountyData.generateDailyBounties(0);
    assert.equal(quests.length, 5);
    assert.equal(quests.some(quest => ['mine', 'training', 'hatch', 'evolve', 'jutsu_win_battle'].includes(quest.type)), false);
    quests.filter(quest => quest.targetType).forEach(quest => assert.equal(earlyTypes.includes(quest.targetType), true));
  }
});

check('家园训练家具保留经验百分比并折算为有效的被动经验', () => {
  const benefits = housingData.calcResidentBenefits([{ baseId: 'dummy', quality: 'COMMON', placed: true }]);
  assert.ok(Math.abs(benefits.expBonus - 0.05) < 1e-9);
  const setBenefits = housingData.calcResidentBenefits([
    { baseId: 'dummy', quality: 'COMMON', placed: true },
    { baseId: 'punching_bag', quality: 'RARE', placed: true },
  ]);
  assert.ok(setBenefits.expBonus > benefits.expBonus);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('Math.floor((ben.expBonus || 0) * 100)'));
});

check('家园种植、浇水与收获使用同步状态，成熟地块先消费后发奖励', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const plant = app.slice(app.indexOf('const plantSeed ='), app.indexOf('const waterPlant ='));
  const water = app.slice(app.indexOf('const waterPlant ='), app.indexOf('const harvestPlant ='));
  const harvest = app.slice(app.indexOf('const harvestPlant ='), app.indexOf('const buyFurnitureFromShop ='));
  assert.ok(plant.includes('const currentHousing = housingRef.current'));
  assert.ok(plant.includes('housingRef.current = nextHousing'));
  assert.ok(plant.includes('goldRef.current -= plant.seedPrice'));
  assert.ok(water.includes('housingRef.current = nextHousing'));
  assert.ok(water.includes('waterLog:'));
  assert.ok(harvest.includes('const consumedHousing ='));
  assert.ok(harvest.indexOf('flushSync(() => setHousing(consumedHousing))') < harvest.indexOf("if (plantDef.category === 'flower'"));
  assert.equal(harvest.includes('newPlots.splice(plotIdx, 1)'), false);
});

check('住宅、家具、求婚、婚礼与咖啡厅在确认后重新校验权威资源', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const house = app.slice(app.indexOf('const _doBuyHouse ='), app.indexOf('const placeFurniture ='));
  const furniture = app.slice(app.indexOf('const _doBuyFurniture ='), app.indexOf('return (', app.indexOf('const _doBuyFurniture =')));
  const propose = app.slice(app.indexOf('const handlePropose ='), app.indexOf('const cancelPropose ='));
  const wedding = app.slice(app.indexOf('const handleWedding ='), app.indexOf('const handleDivorce ='));
  const cafe = app.slice(app.indexOf('const buyCafe ='), app.indexOf('const assignCafeWorker ='));
  assert.ok(house.includes('goldRef.current < validHouse.price'));
  assert.ok(house.includes('housingRef.current = nextHousing'));
  assert.ok(house.includes('validHouse.requireMarriage'));
  assert.ok(furniture.includes('goldRef.current < validDef.shopPrice'));
  assert.ok(propose.includes('marriageRef.current || marriage'));
  assert.ok(propose.includes('goldRef.current < PROPOSE_COST'));
  assert.equal(app.slice(app.indexOf('const handleWedding ='), app.indexOf('const advanceWedding =')).includes('setGold('), false);
  assert.ok(wedding.includes('goldRef.current -= WEDDING_COST'));
  assert.ok(cafe.includes('cafeRef.current || cafe'));
  assert.ok(cafe.includes('goldRef.current < CAFE_BUILDING.price'));
});

check('咖啡厅清理失效工人且首位工人不会领取空档期离线收益', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const tick = app.slice(app.indexOf('const cafeTick ='), app.indexOf('useEffect(() => {', app.indexOf('const cafeTick =')));
  const assign = app.slice(app.indexOf('const assignCafeWorker ='), app.indexOf('const getTodayStr ='));
  assert.ok(tick.includes('const validIds = new Set'));
  assert.ok(tick.includes('workers: [], lastTickTime: now'));
  assert.ok(assign.includes('cafeRef.current = nextCafe'));
  assert.ok(assign.includes('workers.length === 0 && nextWorkers.length > 0'));
  assert.ok(assign.includes('nextCafe.lastTickTime = Date.now()'));
});

check('咖啡厅待领取饮品会再次复核每日上限且不提前扣费', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const claim = app.slice(app.indexOf('const claimBrewedDrink ='), app.indexOf('const isDrinkUnlocked ='));
  assert.ok(claim.includes('const used = counts[drink.id] || 0'));
  assert.ok(claim.includes('if (used >= drink.dailyLimit)'));
  assert.ok(claim.indexOf('if (used >= drink.dailyLimit)') < claim.indexOf('if (goldRef.current < drink.price)'));
  assert.ok(claim.indexOf('if (used >= drink.dailyLimit)') < claim.indexOf('goldRef.current = nextGold'));
});

check('无限城运行状态可序列化，呼吸法和技能变异只作用于战斗克隆', () => {
  const run = infinityData.normalizeInfinityRunState({
    buffs: [{ id: 'atk' }],
    blessings: [{ id: 'guard' }],
    skillMutations: [{ id: 'wide' }],
    buffOptions: [{ id: 'atk' }],
  });
  assert.deepEqual(Array.from(run.buffs), ['atk']);
  assert.deepEqual(Array.from(run.blessings), ['guard']);
  assert.deepEqual(Array.from(run.skillMutations), ['wide']);

  const permanent = [{ uid: 'p1', id: 1, level: 50, moves: [{ name: '撞击', p: 40, pp: 20 }], currentHp: 80 }];
  const buffs = [{ id: 'atk', effect: pet => { pet.customBaseStats.p_atk += 15; } }];
  const mutations = [{ id: 'wide', name: '范围化', suffix: '·蔓延', powerMult: 0.85 }];
  const clones = infinityData.buildInfinityBattleParty(permanent, run, [{ id: 1, hp: 45, atk: 49, def: 49, spd: 45 }], buffs, mutations);
  assert.equal(permanent[0].customBaseStats, undefined);
  assert.equal(permanent[0].moves[0].name, '撞击');
  assert.equal(clones[0].customBaseStats.p_atk, 64);
  assert.equal(clones[0].moves[0].name, '撞击·蔓延');

  clones[0].moves[0].pp = 7;
  const restored = infinityData.restoreInfinityPartyAfterBattle(permanent, [...clones, { id: 25, _infinityTempPartner: true }]);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].moves[0].name, '撞击');
  assert.equal(restored[0].moves[0].pp, 7);
  assert.equal(restored[0].customBaseStats, undefined);
  assert.equal(restored[0]._infinityBattleClone, undefined);
});

check('无限城入口、商人和首次奖励使用同步锁及持久领取记录', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const buff = app.slice(app.indexOf('const selectInfinityBuff ='), app.indexOf('const selectInfinityRoute ='));
  const route = app.slice(app.indexOf('const selectInfinityRoute ='), app.indexOf('const [pendingTask'));
  const start = app.slice(app.indexOf('const startInfinityBattle ='), app.indexOf('const handleWin ='));
  const rewards = app.slice(app.indexOf('// 7. 无限城逻辑'), app.indexOf('// 8. 战斗联盟逻辑'));
  assert.equal(buff.includes('setParty(prev => prev.map(p => {\n        const newPet'), false);
  assert.ok(route.includes('goldRef.current < cost'));
  assert.ok(route.includes('infinityActionLocksRef.current.has(lockKey)'));
  assert.ok(start.includes('buildInfinityBattleParty'));
  assert.ok(start.includes('_playerParty: runParty'));
  assert.ok(rewards.includes("claimInfinityRewardOnce('completion:100')"));
  assert.ok(rewards.includes('claimInfinityRewardOnce(`milestone:${currentFloor}`)'));
});

check('火影剧情关卡结算幂等且九只尾兽按序均可获得', () => {
  const chapters = [{ id: 1, stages: [{ reward: { gold: 100 } }, { reward: { gold: 200 } }] }];
  const first = narutoData.resolveNarutoStoryStageClear({ storyProgress: {} }, chapters, 1, 0);
  assert.equal(first.firstClear, true);
  assert.deepEqual(Array.from(first.state.storyProgress[1].stages), [0]);
  const duplicate = narutoData.resolveNarutoStoryStageClear(first.state, chapters, 1, 0);
  assert.equal(duplicate.firstClear, false);
  assert.deepEqual(Array.from(duplicate.state.storyProgress[1].stages), [0]);
  const completed = narutoData.resolveNarutoStoryStageClear(first.state, chapters, 1, 1);
  assert.equal(completed.totalCleared, 1);
  assert.equal(completed.state.storyProgress[1].cleared, true);

  const collected = [];
  for (let i = 0; i < narutoData.BIJUU_LIST.length; i += 1) {
    const reward = narutoData.getNextBijuuReward(collected, narutoData.BIJUU_LIST);
    assert.ok(reward);
    collected.push(reward.id);
  }
  assert.equal(new Set(collected).size, 9);
  assert.equal(narutoData.getNextBijuuReward(collected, narutoData.BIJUU_LIST), null);
});

check('忍者试炼和尾兽化使用同步入口、双打标记及共享查克拉', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const story = app.slice(app.indexOf('const startStoryBattle ='), app.indexOf('const handleStoryWin ='));
  const finals = app.slice(app.indexOf('const startFinalsRound ='), app.indexOf('const startStoryBattle ='));
  const bijuu = app.slice(app.indexOf('const executeBijuuTransform ='), app.indexOf('const bindBijuuToLead ='));
  assert.ok(story.includes('isDouble: Boolean(stage.isDouble)'));
  assert.ok(story.includes('narutoBattleStartLockRef.current'));
  assert.ok(finals.includes('if (started) setNarutoExamUI'));
  assert.ok(bijuu.includes('battle.sharedPlayerChakra'));
  assert.ok(bijuu.includes('next.sharedPlayerChakra = remaining'));
});

check('领域、缚誓和果实在双打沿用同一战斗快照并按共享资源结算', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const domain = app.slice(app.indexOf('const executeDomainExpansion ='), app.indexOf('const executeBindingVow ='));
  const vow = app.slice(app.indexOf('const executeBindingVow ='), app.indexOf('const executeDevilFruit ='));
  const fruit = app.slice(app.indexOf('const executeDevilFruit ='), app.indexOf('const enemyTurn ='));
  assert.ok(domain.includes('battleSpecialActionLockRef.current'));
  assert.ok(domain.includes('executeDoubleRound(newActions, tempBattle)'));
  assert.ok(vow.includes('tempBattle.sharedPlayerCE'));
  assert.ok(vow.includes('executeDoubleRound(newActions, tempBattle)'));
  assert.ok(vow.includes('vowCooldowns'));
  assert.ok(fruit.includes('executeDoubleRound(newActions, tempBattle)'));
  assert.ok(fruit.includes("finally"));
  assert.ok(app.includes("['jutsuCooldowns', 'cursedCooldowns', 'vowCooldowns']"));
});

check('恶魔果实装备通过权威背包执行原子交换', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const assign = app.slice(app.indexOf('const assignDevilFruitToPartyPet ='), app.indexOf('const awakenPet ='));
  assert.ok(assign.includes('fruitInventoryRef.current'));
  assert.ok(assign.includes('fruitAssignmentLocksRef.current.has(lockKey)'));
  assert.ok(assign.includes('nextInventory.splice(selectedIndex, 1)'));
  assert.ok(assign.includes('flushSync(() =>'));
  assert.equal(app.includes('if(pet.devilFruit)setFruitInventory'), false);
});

check('成就奖励先写同步领取集合，同帧重复检查不会重复发奖', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const branch = app.slice(app.indexOf('const checkAchievements ='), app.indexOf('const syncAchStats ='));
  assert.ok(branch.includes('const unlockedIds = new Set(unlockedAchsRef.current'));
  assert.ok(branch.includes('unlockedIds.add(ach.id)'));
  assert.ok(branch.includes('unlockedAchsRef.current = [...unlockedIds]'));
  assert.ok(branch.indexOf('unlockedAchsRef.current = [...unlockedIds]') < branch.indexOf('newUnlocks.forEach(ach =>'));
});

check('交换、存取与放生按 UID 原子结算并保护训练远征精灵', () => {
  const pets = [{ uid: 'a', level: 10 }, { uid: 'b', level: 100, id: 99, isShiny: true }, { uid: 'c', level: 20 }];
  const removal = petIdentity.removePetsByUids(pets, ['a', 'c']);
  assert.deepEqual(Array.from(removal.pets, pet => pet.uid), ['b']);
  assert.deepEqual(Array.from(removal.removed, pet => pet.uid), ['a', 'c']);
  assert.equal(petIdentity.calculatePetReleaseGold(pets[1], { legendaryIds: [99] }), 5000);
  assert.equal(petIdentity.calculatePetReleaseGold({ level: 10, id: 1 }), 400);

  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const trade = app.slice(app.indexOf('const executeDailyPetTrade ='), app.indexOf('const renderActivityCenter ='));
  const transfer = app.slice(app.indexOf('const depositPokemon ='), app.indexOf('const settleBoxPetRelease ='));
  const release = app.slice(app.indexOf('const settleBoxPetRelease ='), app.indexOf('const updateBuyCount ='));
  assert.ok(trade.includes('lastPetTradeDateRef.current === today'));
  assert.ok(trade.includes('tail.uid !== expectedTailUid'));
  assert.ok(trade.includes('getAssignedPetUids().has(tail.uid)'));
  assert.ok(trade.includes('reclaimRemovedPetAssets([tail])'));
  assert.ok(transfer.includes('removeSinglePetByUid(currentParty, selected.uid)'));
  assert.ok(transfer.includes('removeSinglePetByUid(boxRef.current || [], selected.uid)'));
  assert.ok(release.includes('removePetsByUids(currentBox, uniqueUids)'));
  assert.ok(release.includes('calculatePetReleaseGold'));
  assert.ok(release.includes('reclaimRemovedPetAssets(removal.removed)'));
  assert.ok(release.includes('getAssignedPetUids()'));
});

check('旧存档跨类型重复 UID 会按占用系统的字符串键全局去重', () => {
  const pets = [
    { id: 1, uid: 1 },
    { id: 2, uid: '1' },
    { id: 3, uid: null },
  ];
  const generated = ['1', 'fresh', 'fresh', 'fresh-2'];
  let call = 0;
  const normalized = petIdentity.ensureUniquePetUids(pets, () => generated[call++]);
  const keys = normalized.map(pet => String(pet.uid));
  assert.equal(new Set(keys).size, pets.length);
  assert.deepEqual(keys, ['1', 'fresh', 'fresh-2']);
});

check('塔、联赛与灵域入口使用战斗锁，灵域金币只结算一次', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const tower = app.slice(app.indexOf('const startTowerChallenge ='), app.indexOf('const startElementalTrial ='));
  const league = app.slice(app.indexOf('const registerLeagueRun ='), app.indexOf('const renderLeague ='));
  const spirit = app.slice(app.indexOf('const startSpiritDomainBattle ='), app.indexOf('const applyChapterStepProgress ='));
  assert.ok(tower.includes('towerStartLockRef.current'));
  assert.ok(tower.includes("attemptBattleStart('挑战塔'"));
  assert.ok(tower.includes('towerStartLockRef.current = false'));
  assert.ok(league.includes('leagueStartLockRef.current'));
  assert.ok(league.includes("attemptBattleStart('战斗联盟'"));
  assert.ok(league.includes('leagueStartLockRef.current = false'));
  assert.ok(spirit.includes('spiritDomainStartLockRef.current'));
  assert.ok(app.includes("'spirit_domain'"));
  assert.ok(app.includes("noStandardGoldTypes = new Set(['arena', 'world_boss', 'naruto_exam', 'naruto_survival', 'gang_war', 'capital_siege', 'spirit_domain'])"));
});

check('主线终章、求婚探索、结契与国战任务使用幂等进度', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const story = app.slice(app.indexOf('// ★★★ 剧情推进逻辑'), app.indexOf('const rankBattlePerk'));
  const proposal = app.slice(app.indexOf('const updateQuestProgress ='), app.indexOf('const handlePropose ='));
  const bonding = app.slice(app.indexOf('const advanceBondingStep ='), app.indexOf('const upgradeSanctuaryFacility ='));
  const kingdomTask = app.slice(app.indexOf('const completeKingdomPveTask ='), app.indexOf('const setGeneralTactic ='));
  assert.ok(story.includes('MAIN_STORY_CHAMPION_REWARD'));
  assert.ok(app.includes('MAIN_STORY_COMPLETE'));
  assert.ok(proposal.includes('visited.includes(detail)'));
  assert.ok(proposal.includes('marriageRef.current = nextMarriage'));
  assert.ok(bonding.includes('bondingActionLocksRef.current.has(lockKey)'));
  assert.ok(bonding.indexOf('setBondingProgress(completedProgress)') < bonding.indexOf('partyRef.current = [...currentParty, newPet]'));
  assert.ok(kingdomTask.includes('Object.prototype.hasOwnProperty.call(kwCooldowns, taskId)'));
  assert.ok(kingdomTask.includes('kingdomActionLocksRef.current.add(lockKey)'));
});

check('商店、融合与装备在权威资源上原子提交', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const shop = app.slice(app.indexOf('const doBuyItemPro ='), app.indexOf('const addLog ='));
  const fusion = app.slice(app.indexOf('const handleFusion ='), app.indexOf('const renderFusion'));
  const equip = app.slice(app.indexOf('const handleEquipAccessory ='), app.indexOf('// ==========================================', app.indexOf('const handleEquipAccessory =')));
  assert.ok(shop.includes('shopPurchaseLocksRef.current.has(lockKey)'));
  assert.ok(shop.includes('goldRef.current < totalCost'));
  assert.ok(shop.includes('inventoryRef.current'));
  assert.ok(fusion.includes('fusionActionLockRef.current'));
  assert.ok(fusion.includes('partyRef.current'));
  assert.ok(fusion.includes('goldRef.current'));
  assert.ok(equip.includes('equipmentActionLockRef.current'));
  assert.ok(equip.includes('accessoriesRef.current'));
  assert.ok(equip.includes('partyRef.current = newParty'));
});

check('连战只在完整结束时记副本通关，并保留专属后续敌人池', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const completion = app.slice(app.indexOf('const recordDungeonCompletion ='), app.indexOf('const formatAchievementReward ='));
  const dungeon = app.slice(app.indexOf('const isChainedDungeonWave ='), app.indexOf('const avgEnemyLv ='));
  assert.ok(completion.includes('achStatsRef.current'));
  assert.ok(completion.includes('clearedDungeonList'));
  assert.ok(dungeon.includes("battleSnapshot.type === 'boss_rush' || battleSnapshot.type === 'survival'"));
  assert.ok(dungeon.includes('recordDungeonCompletion(battleSnapshot.dungeonId)'));
  assert.ok(dungeon.includes('bossPool = nextWave >= 3 ? [...FINAL_GOD_IDS] : [...NEW_GOD_IDS]'));
  assert.ok(dungeon.includes('started = startBattle({'));
  assert.ok(dungeon.includes("showMapToast('⚠️', '连战中止'"));
  assert.ok(dungeon.includes('_dungeonRunNoDamage: runNoDamage'));
  assert.ok(dungeon.includes('_dungeonRunNoDamage: survivalRunNoDamage'));
  assert.ok(app.includes(': (partyRef.current || party);'));
  assert.ok(dungeon.includes("lastFullRewardDate !== today"));
  assert.ok(dungeon.includes('闪光神兽每日仅首通保底'));
});

check('训练与远征互斥并按同步槽位、金币和每日次数提交', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const expedition = app.slice(app.indexOf('const sendExpedition ='), app.indexOf('const getMapEcology ='));
  const training = app.slice(app.indexOf('const startTraining ='), app.indexOf('const collectTraining ='));
  assert.ok(expedition.includes('expeditionsRef.current'));
  assert.ok(expedition.includes('trainingStateRef.current'));
  assert.ok(expedition.includes('cafeRef.current?.workers'));
  assert.ok(expedition.includes('badges.length < zone.reqBadges'));
  assert.ok(expedition.includes('.slice(0, 3)'));
  assert.ok(expedition.includes('startedToday: dailyCount + 1'));
  assert.ok(training.includes('goldRef.current < tier.cost'));
  assert.ok(training.includes('expeditionsRef.current?.teams'));
  assert.ok(training.includes('cafeRef.current?.workers'));
  assert.ok(training.includes('trainingStateRef.current = nextTraining'));
  assert.ok(training.includes('goldRef.current -= tier.cost'));
});

check('旧存档派遣状态按权威槽位、UID、时长和分支奖励归一化', () => {
  const now = 1_800_000_000_000;
  const saved = {
    party: [{ uid: 'p1', currentHp: 10 }, { uid: 'p2', currentHp: 10 }, { uid: 'p3', currentHp: 10 }, { uid: 'p4', currentHp: 10 }],
    box: [],
    trainingState: {
      slots: [
        { petUid: 'p1', campId: 'hp', tierIdx: 0, startTime: now + 999999, duration: 1 },
        { petUid: 'missing', campId: 'hp', tierIdx: 0, startTime: 0, duration: 1 },
      ],
      dailyCount: { p1: 5, missing: 1 },
      totalSessions: -4,
    },
    expeditions: {
      teams: [
        { zoneId: 'dark_forest', petUids: ['p1', 'p2', 'p2'], startTime: 0, duration: 1, branchEventId: 'fork_road', branchResolved: true, branchChoice: { id: 'charge', rewardMult: 99 } },
        { zoneId: 'volcano', petUids: ['p3'], startTime: now + 1, duration: 1, branchEventId: 'bad_event', branchResolved: false },
      ],
      startedToday: 99,
    },
    cafe: {
      owned: true,
      workers: ['p1', 'p2', 'p3', 'p4', 'p4'],
      totalWorkCount: -10,
      _pendingSideEffects: { ticks: 999999, workers: ['p4'] },
    },
    housing: { currentHouse: 'cabin', residents: ['p1', 'p1', 'missing'] },
  };
  const normalized = saveNormalizer.normalizeOperationalSaveState(saved, now);
  assert.equal(normalized.trainingState.slots.length, 1);
  assert.equal(normalized.trainingState.slots[0].startTime, now);
  assert.equal(normalized.trainingState.slots[0].duration, trainingData.TRAINING_TIERS[0].duration);
  assert.equal(JSON.stringify(normalized.trainingState.dailyCount), JSON.stringify({ p1: 1 }));
  assert.equal(JSON.stringify(normalized.expeditions.teams[0].petUids), JSON.stringify(['p2']));
  assert.equal(normalized.expeditions.teams[0].duration, expeditionData.EXPEDITION_ZONES[0].duration);
  assert.equal(normalized.expeditions.teams[0].branchChoice.rewardMult, 1.6);
  assert.equal(normalized.expeditions.teams[1].branchResolved, true);
  assert.equal(normalized.expeditions.startedToday, 6);
  assert.equal(JSON.stringify(normalized.cafe.workers), JSON.stringify(['p4']));
  assert.equal(normalized.cafe.totalWorkCount, 0);
  assert.equal(normalized.cafe._pendingSideEffects, undefined);
  assert.equal(JSON.stringify(normalized.housing.residents), JSON.stringify(['p1', null]));

  const core = saveNormalizer.normalizeCoreSaveState({
    trainerName: { bad: true },
    gold: -50,
    party: 'bad',
    relics: { equipped: ['r1', 'r1'], owned: 'bad' },
    inventory: {
      balls: { poke: -3, great: '4.9', ultra: Number.POSITIVE_INFINITY },
      exp_candy: '-2',
      eggs: [{ speciesId: '25', stepsLeft: '-8', hatchLevel: 999 }, { bad: true }],
    },
  });
  assert.equal(core.trainerName, '');
  assert.equal(core.gold, 0);
  assert.equal(JSON.stringify(core.party), '[]');
  assert.equal(JSON.stringify(core.relics.equipped), JSON.stringify(['r1']));
  assert.equal(core.inventory.balls.poke, 0);
  assert.equal(core.inventory.balls.great, 4);
  assert.equal(core.inventory.balls.ultra, 0);
  assert.equal(core.inventory.exp_candy, 0);
  assert.equal(core.inventory.eggs[0].stepsLeft, 0);
  assert.equal(core.inventory.eggs[0].hatchLevel, 100);

  const activity = saveNormalizer.normalizeActivitySaveState({
    arenaState: { rank: 'bad', stars: 999, tickets: -2, rewardsClaimed: ['silver', 'silver', 'bad'] },
    mineState: { energy: '999', depth: -5, grid: [['bad']], revealed: 'bad', minerals: { copper: '-4', jade: '7.8' } },
    bountyBoard: { date: 'bad', quests: 'bad', allCompleted: true, masterChestClaimed: true },
    worldBossState: { attempts: 99, totalDamage: -5, claimedMilestones: [100, 100, -2] },
    luckyWheel: { dailySpinCount: 99, totalSpins: -2 },
    raceState: { dailyRaces: 99, totalWins: -1 },
  }, now);
  assert.equal(activity.arenaState.rank, 'bronze');
  assert.equal(activity.arenaState.tickets, 0);
  assert.equal(activity.mineState.energy, 25);
  assert.equal(activity.mineState.depth, 1);
  assert.equal(activity.mineState.grid, null);
  assert.equal(activity.mineState.minerals.copper, 0);
  assert.equal(activity.mineState.minerals.jade, 7);
  assert.equal(activity.bountyBoard.allCompleted, false);
  assert.equal(activity.bountyBoard.masterChestClaimed, false);
  assert.equal(activity.worldBossState.attempts, worldBossData.WORLD_BOSS_MAX_ATTEMPTS);
  assert.equal(JSON.stringify(activity.worldBossState.claimedMilestones), JSON.stringify([100]));
  assert.equal(activity.luckyWheel.dailySpinCount, 3);
  assert.equal(activity.raceState.dailyRaces, 5);
});

check('咖啡厅派工与住家收益遵守跨系统占用状态', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const assigned = app.slice(app.indexOf('const getAssignedPetUids ='), app.indexOf('const reclaimRemovedPetAssets ='));
  const cafe = app.slice(app.indexOf('const assignCafeWorker ='), app.indexOf('const getTodayStr ='));
  const housingTick = app.slice(app.indexOf('// 家园系统：每900秒结算一次入住收益'), app.indexOf('// C. UI状态同步'));
  assert.ok(assigned.includes('cafeRef.current?.workers'));
  assert.ok(cafe.includes('trainingStateRef.current?.slots'));
  assert.ok(cafe.includes('expeditionsRef.current?.teams'));
  assert.ok(cafe.includes('cafeClaimLockRef.current'));
  assert.ok(housingTick.includes('unavailableResidents'));
  assert.ok(housingTick.includes('cafeRef.current?.workers'));
  assert.ok(housingTick.includes('pet.currentHp > 0 ? Math.min(maxHp'));
  assert.equal(housingTick.includes('pet.currentHp || maxHp'), false);
});

check('名将招募与国战任务在同步国战快照上一次性提交', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const draw = app.slice(app.indexOf('const doGeneralDraw ='), app.indexOf('const buyCafe ='));
  const task = app.slice(app.indexOf('const completeKingdomPveTask ='), app.indexOf('const startFusionDungeon ='));
  assert.ok(draw.includes('generalDrawLockRef.current'));
  assert.ok(draw.includes('const currentKw = kingdomWarRef.current'));
  assert.ok(draw.includes('kingdomWarRef.current = nextKw'));
  assert.equal(draw.includes('setKingdomWar(prev =>'), false);
  assert.ok(task.includes('const currentKingdom = kingdomWarRef.current'));
  assert.ok(task.includes('kingdomWarRef.current = nextKingdom'));
  assert.ok(task.includes('setKingdomWar(nextKingdom)'));
  assert.equal(task.includes('setKingdomWar(prev =>'), false);
});

check('国战胜利扣减驻军时保留零兵种语义，不会凭空补兵', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const branch = app.slice(app.indexOf('// 9b. 国战胜利'), app.indexOf('// 9c.', app.indexOf('// 9b. 国战胜利')));
  assert.ok(branch.includes('(t.garrison[rk] ?? 0) - Math.floor'));
  assert.equal(branch.includes('(t.garrison[rk] || 5) - Math.floor'), false);
});

check('帮派精灵上交保护所有占用并返还随身资产', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('{/* 上交精灵 */}');
  const donation = app.slice(start, app.indexOf('const renderGangWar =', start));
  assert.ok(donation.includes('getAssignedPetUids()'));
  assert.ok(donation.includes('reclaimRemovedPetAssets([removal.removed])'));
  assert.ok(donation.includes('clearRemovedPetLinks([petToGive.uid])'));
});

check('遗物、生态里程碑与国战日收先占位再发奖励', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const relic = app.slice(app.indexOf('const equipRelic ='), app.indexOf('const getResonanceContext ='));
  const incomeStart = app.indexOf("const lockKey = `daily-income:${today}`");
  const income = app.slice(incomeStart, app.indexOf('}}', incomeStart) + 2);
  const treasuryStart = app.indexOf("const lockKey = `capital-treasury:${today}`");
  const treasury = app.slice(treasuryStart, app.indexOf("} else if (feat.action === 'training')", treasuryStart));
  assert.ok(relic.includes('relicsRef.current = next'));
  assert.ok(relic.includes('guardianMilestonesClaimedRef.current = [...new Set'));
  assert.ok(relic.indexOf('setGuardianMilestonesClaimed') < relic.indexOf('unclaimed.forEach(m =>'));
  assert.ok(income.includes('kingdomActionLocksRef.current.has(lockKey)'));
  assert.ok(income.includes('currentKw.dailyCounts?.income'));
  assert.ok(income.includes('kingdomWarRef.current = nextKw'));
  assert.ok(treasury.includes('currentKw.dailyCounts?.capitalReward'));
  assert.ok(treasury.includes('kingdomWarRef.current = nextKw'));
});

check('旧地图缓存的未知字符回退为普通地块而不是 NaN', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const hydrate = app.slice(app.indexOf('const hydrateMapGridCache ='), app.indexOf('const compactSavedPet ='));
  assert.ok(hydrate.includes('Number.isFinite(numericTile) ? numericTile : 2'));
  assert.equal(hydrate.includes('Number(char) ?? 2'), false);
});

check('有效移动始终扣除孵化步数并保留工厂生成的唯一 UID', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const movement = app.slice(app.indexOf('// 核心：移动交互与事件触发逻辑'), app.indexOf('// 2. 障碍物', app.indexOf('// 核心：移动交互与事件触发逻辑')));
  assert.ok(movement.includes('setInventory(prev => ({ ...prev, eggs: workingEggs }))'));
  assert.equal(movement.includes('workingEggs.length !== curEggs.length'), false);
  assert.equal(movement.includes('hatchedPet.uid = Date.now()'), false);
  assert.ok(movement.includes('caughtDexRef.current'));
});

check('确认弹窗先关闭当前层再执行，并阻止双击重复动作', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const modal = app.slice(app.indexOf('{confirmModal && ('), app.indexOf('{/* 道馆入口', app.indexOf('{confirmModal && (')));
  assert.ok(modal.includes('confirmActionLockRef.current'));
  assert.ok(modal.indexOf('setConfirmModal(null)') < modal.indexOf('try { action?.(); }'));
  assert.ok(modal.includes('const onCancel = confirmModal.onCancel; setConfirmModal(null); onCancel?.();'));
});

check('圣域升级与旅行商人复核权威金币并使用动作锁', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const sanctuary = app.slice(app.indexOf('const upgradeSanctuaryFacility ='), app.indexOf('const completeKingdomPveTask ='));
  const merchant = app.slice(app.indexOf("{view === 'merchant' && merchantItems && ("), app.indexOf("{view === 'battle'", app.indexOf("{view === 'merchant' && merchantItems && (")));
  assert.ok(sanctuary.includes('sanctuaryActionLocksRef.current.has(lockKey)'));
  assert.ok(sanctuary.includes('sanctuaryStateRef.current'));
  assert.ok(sanctuary.includes('goldRef.current < cost'));
  assert.ok(sanctuary.includes('sanctuaryStateRef.current = nextSanctuary'));
  assert.ok(merchant.includes('merchantPurchaseLockRef.current'));
  assert.ok(merchant.includes('goldRef.current >= item.cost'));
  assert.ok(merchant.includes('goldRef.current -= item.cost'));
});

check('设置页提供可校验的存档导出、导入与覆盖前备份', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const saveTools = app.slice(app.indexOf('const exportSaveData ='), app.indexOf('const persistSaveRef ='));
  assert.ok(saveTools.includes("new Blob([serialized], { type: 'application/json' })"));
  assert.ok(saveTools.includes("input.accept = '.json,application/json'"));
  assert.ok(saveTools.includes('file.size > 10 * 1024 * 1024'));
  assert.ok(saveTools.includes('!Array.isArray(parsed.party) || !Array.isArray(parsed.box)'));
  assert.ok(saveTools.includes('`${SAVE_KEY}_before_import`'));
  assert.ok(app.includes('onClick={exportSaveData}'));
  assert.ok(app.includes('onClick={importSaveData}'));
});

check('首徽章速通成就使用持久游玩时长而不是缺失时间戳', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('speedrunFirstBadge: getCurrentPlayTimeMs() <= 2 * 60 * 60 * 1000 ? 1 : 0'));
  assert.equal(app.includes('savedDataRef.current?._startTime'), false);
});

check('赏金、世界旅行、树果反杀与五倒一清场成就均接入真实事件', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  assert.ok(app.includes('updateAchStat({ bountiesCompleted: 1 })'));
  assert.ok(app.includes('catchAchUpdates.mapCaughtSpecies = previous =>'));
  assert.ok(app.includes('next.worldTourComplete = explorableMapIds.length > 0'));
  assert.ok(app.includes('defState._berryClutchArmed = true'));
  assert.ok(app.includes('updateAchStat({ berryClutchKills: 1 })'));
  assert.ok(app.includes('winAchUpdates.revengeSweeps = 1'));
});

check('精灵详情页门派突破复核 UID、当前等级和权威金币', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const start = app.indexOf('const upgradeSect = () =>');
  const branch = app.slice(start, app.indexOf('return (', start));
  assert.ok(branch.includes('sectActionLocksRef.current.has(lockKey)'));
  assert.ok(branch.includes('partyRef.current'));
  assert.ok(branch.includes('goldRef.current < currentCost'));
  assert.ok(branch.includes('partyRef.current = newParty'));
});

check('名将招募与活动报名在确认时复核名额、价格、冷却和金币', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const recruit = app.slice(app.indexOf("const lockKey = `recruit-general:${gen.id}`"), app.indexOf('// 9a-3. 历史名战'));
  const activity = app.slice(app.indexOf('const handleStart = () =>', app.indexOf('const renderActivityModal')), app.indexOf('return (', app.indexOf('const handleStart = () =>', app.indexOf('const renderActivityModal'))));
  assert.ok(recruit.includes('kingdomWarRef.current'));
  assert.ok(recruit.includes('currentRecruited.some'));
  assert.ok(recruit.includes('goldRef.current < currentCost'));
  assert.ok(recruit.includes('kingdomWarRef.current = nextKw'));
  assert.ok(activity.includes('dungeonCooldownsRef.current'));
  assert.ok(activity.includes('goldRef.current < actualFee'));
  assert.ok(activity.includes('dungeonCooldownsRef.current = nextCooldowns'));
});

check('战斗与场外即时道具按同步库存原子消耗并持久化亲密度', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const battleItems = app.slice(app.indexOf('const useBattleItem ='), app.indexOf('const confirmStarter ='));
  const fieldItems = app.slice(app.indexOf('const useBerry ='), app.indexOf('const useGrowthItem ='));
  const tm = app.slice(app.indexOf('const useTM ='), app.indexOf('const useBattleItem ='));
  const forget = app.slice(app.indexOf('const forgetMove ='), app.indexOf('const renderMoveForget ='));
  const reroll = app.slice(app.indexOf('const executeReroll ='), app.indexOf('// 3. 确认保存结果'));
  const teamItems = app.slice(app.indexOf('const handleItemUseOnPet ='), app.indexOf('const createUniqueEquip ='));
  const legacy = app.slice(app.indexOf('const doLegacy ='), app.indexOf('return (', app.indexOf('const doLegacy =')));
  assert.ok(battleItems.includes('battleSpecialActionLockRef.current'));
  assert.ok(battleItems.includes('let currentInventory = inventoryRef.current || inventory'));
  assert.ok(battleItems.includes('inventoryRef.current = nextInventory'));
  assert.ok(battleItems.includes('partyRef.current = nextParty'));
  assert.ok(battleItems.includes('咒力已满，无需使用'));
  assert.ok(fieldItems.includes("const lockKey = 'field-berry'"));
  assert.ok(fieldItems.includes("const lockKey = 'field-potion'"));
  assert.ok(fieldItems.includes("const lockKey = 'field-ether'"));
  assert.ok(fieldItems.includes('currentInventory.meds.potion - 1'));
  assert.ok(fieldItems.includes('currentInventory.meds.ether - 1'));
  assert.ok(tm.includes('const currentInventory = inventoryRef.current || inventory'));
  assert.ok(tm.includes('inventoryRef.current = nextInventory'));
  assert.ok(forget.includes('技能书不足'));
  assert.ok(forget.includes('currentInventory.tms[moveToLearn._tmId] - 1'));
  assert.ok(reroll.includes('rebirth_pill: currentStock - cost'));
  assert.equal(reroll.includes('(prev.misc.rebirth_pill || 0) - cost'), false);
  assert.ok(teamItems.includes('const currentStack = actionItem.category'));
  assert.ok(teamItems.includes('inventoryRef.current = nextInventory'));
  assert.ok(teamItems.includes('partyRef.current = newParty'));
  assert.ok(teamItems.includes('latestInventory.stones[stoneId] - 1'));
  assert.ok(teamItems.includes('availableCandy - usedCount'));
  assert.ok(teamItems.includes('nextBerries = addBerries(nextBerries, pet.equippedBerry, 1)'));
  assert.ok(teamItems.includes("pet.status && (med.val === 'ALL' || pet.status === med.val)"));
  assert.ok(legacy.includes('inventoryActionLocksRef.current.has(lockKey)'));
  assert.ok(legacy.includes('currentInventory.legacy_stone - 1'));
  assert.ok(legacy.includes('currentApprentice.inheritedMove'));
  assert.ok(legacy.includes('partyRef.current = nextParty'));
  assert.ok(legacy.includes('boxRef.current = nextBox'));
});

check('门派日常跨日不漏奖且江湖事件每周期仅结算一次', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  const daily = app.slice(app.indexOf('const advanceSectDaily ='), app.indexOf('const claimAllSectDaily ='));
  const event = app.slice(app.indexOf('const handleJianghuEventChoice ='), app.indexOf('const startChiefTrial ='));
  const summit = app.slice(app.indexOf('const renderSectSummit ='), app.indexOf('const renderSectTeamModal ='));
  assert.ok(app.includes('cycle: Number.isInteger(entry?.cycle)'));
  assert.ok(daily.includes('previousTodayTasks'));
  assert.ok(daily.includes('`${t.date}:${t.id}`'));
  assert.ok(daily.includes('sectPlayerRef.current = next'));
  assert.ok(event.includes('getSectEventCycleKey()'));
  assert.ok(event.includes('alreadyChosen'));
  assert.ok(event.includes('entry.eventId === evt.id && entry.cycle === cycle'));
  assert.ok(event.includes('pollution: ecoPenalty, vegetation: -ecoPenalty'));
  assert.ok(event.includes('sectPlayerRef.current = nextSectPlayer'));
  assert.ok(summit.includes('disabled={Boolean(jianghuChoiceLog)}'));
  assert.ok(summit.includes('本周已选择'));
});

console.log(`\nRegression checks passed: ${passed}`);
