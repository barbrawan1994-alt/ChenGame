// ==========================================
// 国战 · 名城攻城（兵力 / 六兵种克制 / 群雄）
// 纯数值推演，不依赖战斗引擎，避免与主战斗耦合导致崩溃
// ==========================================

import { CONTESTED_MAP_IDS, RECRUIT_CONFIG, getInstabilityMult, buildSiegeCombatParams } from './kingdom';
import { getGeneralById } from './generals';
import { MANPOWER_RESERVE_CAP } from './kingdomConstants';

export const CONTESTED_SIEGE_MAP_IDS = CONTESTED_MAP_IDS;

/** 争夺条参与方：魏蜀吴晋 + 群雄 AI */
export const CONTEST_BAR_IDS = ['wei', 'shu', 'wu', 'jin', 'qun'];

export { MANPOWER_RESERVE_CAP };

/** 控制城池所需的占领积分阈值（四势力拉锯） */
export const CONTEST_CAPTURE_THRESHOLD = 28;

/** 六兵种：环形克制 — 每个兵种克制顺时针下两种 */
export const KW_TROOP_TYPES = [
  { id: 'shield', name: '盾卫', icon: '🛡️', desc: '善挡矢石与器械，惧侧翼奇袭与铁骑冲阵' },
  { id: 'spear', name: '枪阵', icon: '🔱', desc: '善制骑兵与轻甲，惧远射与火攻压制' },
  { id: 'cavalry', name: '骁骑', icon: '🐎', desc: '善冲弓弩与器械本队，惧枪林与重盾' },
  { id: 'archer', name: '弓弩', icon: '🏹', desc: '善射枪甲薄弱处，惧重盾与强袭贴脸' },
  { id: 'siege', name: '攻城器', icon: '🪨', desc: '善破盾墙与营垒，惧奇袭与骑军抄后' },
  { id: 'raider', name: '奇袭', icon: '🗡️', desc: '善扰器械与弓队，惧盾墙推进与枪阵' },
];

export const KW_TROOP_IDS = KW_TROOP_TYPES.map(t => t.id);

const TROOP_IDX = KW_TROOP_IDS.reduce((acc, id, i) => { acc[id] = i; return acc; }, {});

/** 兵种对兵种伤害倍率：环形，克制 2 档，被克 2 档，正对/neutral */
export const getTroopMatchMult = (attackerType, defenderType) => {
  const ia = TROOP_IDX[attackerType];
  const ib = TROOP_IDX[defenderType];
  if (ia == null || ib == null) return 1;
  if (ia === ib) return 1;
  const d = (ib - ia + 6) % 6;
  if (d === 1 || d === 2) return 1.27; // 攻方克制守方兵种
  if (d === 4 || d === 5) return 0.79;
  return 1; // 对位 (相差3) 视为风格互有胜负，不额外惩罚
};

const TROOP_WEIGHT = {
  shield: 1.02,
  spear: 1.06,
  cavalry: 1.14,
  archer: 1.08,
  siege: 1.22,
  raider: 0.94,
};

const QUN_LEADERS = ['吕布', '袁绍', '董卓残部', '西凉铁骑', '黄巾余党', '汉中张鲁', '南中蛮兵'];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** 与 generals.js 一致：稀有度为字符串 SSR / SR / R（兼容旧数字 3/2/1） */
const rarityLeadership = (r) => {
  if (r === 'SSR' || r === 3) return 0.11;
  if (r === 'SR' || r === 2) return 0.065;
  return 0.038;
};

const normalizeAllocation = (allocation) => {
  const out = {};
  for (const id of KW_TROOP_IDS) out[id] = Math.max(0, Math.floor(Number(allocation?.[id]) || 0));
  return out;
};

const sumAlloc = (a) => KW_TROOP_IDS.reduce((s, id) => s + (a[id] || 0), 0);

/** 根据敌方混合兵种计算我方「期望克制倍率」 */
const expectedCounterMult = (playerAlloc, defWeights) => {
  const tot = KW_TROOP_IDS.reduce((s, id) => s + (defWeights[id] || 0), 0) || 1;
  let acc = 0;
  let pTot = sumAlloc(playerAlloc);
  if (pTot <= 0) return 0.65;
  for (const pid of KW_TROOP_IDS) {
    const pc = playerAlloc[pid] || 0;
    if (pc <= 0) continue;
    let sub = 0;
    for (const did of KW_TROOP_IDS) {
      const w = (defWeights[did] || 0) / tot;
      sub += w * getTroopMatchMult(pid, did);
    }
    acc += (pc / pTot) * sub;
  }
  return Math.max(0.55, Math.min(1.45, acc));
};

/** 兼容存档里 mapId 为 number / string 两种键 */
export const getContestMapProgress = (contestProgress, mapId) => {
  const cp = contestProgress || {};
  const n = Number(mapId);
  const raw = cp[n] ?? cp[String(n)] ?? {};
  return {
    wei: Math.max(0, Math.floor(Number(raw.wei) || 0)),
    shu: Math.max(0, Math.floor(Number(raw.shu) || 0)),
    wu: Math.max(0, Math.floor(Number(raw.wu) || 0)),
    jin: Math.max(0, Math.floor(Number(raw.jin) || 0)),
    qun: Math.max(0, Math.floor(Number(raw.qun) || 0)),
  };
};

/** 由城池争夺条推导出「守城方兵种倾向」 */
export const inferDefenseWeights = (mapProgress) => {
  const raw = mapProgress || {};
  const p = { wei: 0, shu: 0, wu: 0, jin: 0, qun: 0 };
  for (const k of CONTEST_BAR_IDS) p[k] = Math.max(0, Number(raw[k]) || 0);
  const total = CONTEST_BAR_IDS.reduce((s, k) => s + (p[k] || 0), 0) || 1;
  const base = {
    shield: 0.14,
    spear: 0.18,
    cavalry: 0.18,
    archer: 0.16,
    siege: 0.14,
    raider: 0.2,
  };
  // 魏偏盾骑、蜀偏枪弓、吴偏弓弩与水战奇袭、群雄偏骑与奇袭
  const bias = {
    wei: { shield: 0.08, cavalry: 0.06, spear: 0.02, archer: -0.02, siege: 0.02, raider: -0.04 },
    shu: { spear: 0.08, archer: 0.06, shield: 0.02, raider: 0.02, cavalry: -0.04, siege: -0.02 },
    wu: { archer: 0.08, raider: 0.06, spear: 0.02, shield: -0.02, cavalry: 0.02, siege: -0.04 },
    jin: { cavalry: 0.06, shield: 0.06, siege: 0.04, spear: 0.02, archer: -0.02, raider: -0.04 },
    qun: { cavalry: 0.08, raider: 0.08, spear: 0.02, archer: 0.02, shield: -0.04, siege: -0.04 },
  };
  const w = { ...base };
  for (const fid of CONTEST_BAR_IDS) {
    const share = (p[fid] || 0) / total;
    const b = bias[fid];
    if (!b) continue;
    for (const tid of KW_TROOP_IDS) w[tid] += (b[tid] || 0) * share;
  }
  const s = KW_TROOP_IDS.reduce((acc, tid) => acc + Math.max(0.04, w[tid]), 0);
  const norm = {};
  for (const tid of KW_TROOP_IDS) norm[tid] = Math.max(0.04, w[tid]) / s;
  return norm;
};

/**
 * 判定名城控制者。同分优先保留现任控制方（减少魏序偶然_bias），否则按魏→蜀→吴→群雄次序。
 */
export const resolveContestedMapOwner = (mapProgress, incumbent = null, mapId = 0) => {
  const raw = mapProgress || {};
  const p = { wei: 0, shu: 0, wu: 0, jin: 0, qun: 0 };
  for (const k of CONTEST_BAR_IDS) p[k] = Math.max(0, Number(raw[k]) || 0);
  const PRIORITY = { wei: 0, shu: 1, wu: 2, jin: 3, qun: 4 };
  let maxV = -1;
  for (const fid of CONTEST_BAR_IDS) maxV = Math.max(maxV, p[fid] || 0);
  if (maxV < CONTEST_CAPTURE_THRESHOLD) return 'neutral';
  const tied = CONTEST_BAR_IDS.filter(fid => (p[fid] || 0) === maxV);
  if (tied.length === 1) return tied[0];
  if (incumbent && incumbent !== 'neutral' && tied.includes(incumbent)) return incumbent;
  const salt = Math.abs(Number(mapId)) || 1;
  tied.sort((a, b) => (PRIORITY[a] ?? 9) - (PRIORITY[b] ?? 9));
  return tied[salt % tied.length];
};

/**
 * 每 3 分钟 War Tick：群雄与 AI 势力缓慢积累争夺条，防止玩家单方面碾压
 */
export const tickContestOccupationAI = (contestProgress, playerFaction, avgLevel = 55) => {
  const cp = { ...(contestProgress || {}) };
  const lv = Math.max(35, Math.min(95, avgLevel || 55));
  const aiScale = Math.min(1.12, Math.max(0.82, 0.85 + (lv - 55) * 0.004));

  for (const mid of CONTESTED_SIEGE_MAP_IDS) {
    const cur = { wei: 0, shu: 0, wu: 0, jin: 0, qun: 0, ...getContestMapProgress(cp, mid) };
    const roll = () => Math.max(0, Math.round((0.75 + Math.random() * 1.35) * aiScale));
    cur.qun = Math.min(480, (cur.qun || 0) + roll() + (Math.random() < 0.22 ? 1 : 0));
    for (const fid of ['wei', 'shu', 'wu', 'jin']) {
      const antiPlayer = playerFaction && fid !== playerFaction ? 1.18 : 1;
      const gain = Math.round(roll() * 0.88 * antiPlayer);
      cur[fid] = Math.min(480, (cur[fid] || 0) + gain);
    }
    if (playerFaction && ['wei', 'shu', 'wu', 'jin'].includes(playerFaction)) {
      cur.qun = Math.max(0, (cur.qun || 0) - (Math.random() < 0.32 ? 1 : 0));
    }
    const sum = CONTEST_BAR_IDS.reduce((s, k) => s + (cur[k] || 0), 0);
    if (sum > 880) {
      const f = 0.93;
      for (const k of CONTEST_BAR_IDS) cur[k] = Math.max(0, Math.floor((cur[k] || 0) * f));
    }
    cp[Number(mid)] = cur;
  }
  return cp;
};

export const syncContestedTerritoryOwners = (contestProgress, territories) => {
  const terr = { ...territories };
  for (const mid of CONTESTED_SIEGE_MAP_IDS) {
    const prog = getContestMapProgress(contestProgress, mid);
    const t = terr[mid];
    if (!t) continue;
    const owner = resolveContestedMapOwner(prog, t.owner, mid);
    terr[mid] = { ...t, owner };
  }
  return terr;
};

const getRiskLabel = (chance) => {
  if (chance >= 0.72) return '优势';
  if (chance >= 0.55) return '可破';
  if (chance >= 0.38) return '胶着';
  return '高危';
};

const getDominantContestFaction = (prog, playerFaction) => {
  return CONTEST_BAR_IDS
    .filter(fid => fid !== playerFaction)
    .sort((a, b) => (prog[b] || 0) - (prog[a] || 0))[0] || 'qun';
};

const getSuggestedAllocation = (defWeights, deploy) => {
  const safeDeploy = Math.max(0, Math.floor(Number(deploy) || 0));
  if (safeDeploy <= 0) return {};
  const weights = {};
  for (const aid of KW_TROOP_IDS) {
    let score = 0.08;
    for (const did of KW_TROOP_IDS) score += (defWeights?.[did] || 0) * getTroopMatchMult(aid, did);
    weights[aid] = Math.max(0.08, score);
  }
  const total = KW_TROOP_IDS.reduce((s, k) => s + weights[k], 0) || 1;
  const out = {};
  let assigned = 0;
  KW_TROOP_IDS.forEach((k, i) => {
    const v = i === KW_TROOP_IDS.length - 1 ? safeDeploy - assigned : Math.floor(safeDeploy * weights[k] / total);
    out[k] = Math.max(0, v);
    assigned += out[k];
  });
  return out;
};

export const evaluateKwSiegeBattle = ({
  mapId,
  playerFaction,
  allocation,
  generalIds,
  recruitedGenerals = [],
  mapProgress,
  mapLvlMin = 50,
  mapLvlMax = 80,
  avgPartyLevel = 55,
}) => {
  const alloc = normalizeAllocation(allocation);
  const deploy = sumAlloc(alloc);
  if (!playerFaction || !['wei', 'shu', 'wu', 'jin'].includes(playerFaction)) {
    return { canAttack: false, reason: '未加入可参战势力', winChance: 0, riskLabel: '不可攻', allocation: alloc, deploy };
  }
  if (deploy < 80) {
    return { canAttack: false, reason: '兵力不足 80，无法形成攻城阵势', winChance: 0, riskLabel: '不可攻', allocation: alloc, deploy };
  }

  const uniqIds = [...new Set((generalIds || []).map(x => String(x)))].slice(0, 3);
  const gens = uniqIds.map(id => recruitedGenerals.find(g => String(g?.id) === id)).filter(Boolean);
  let lead = 1;
  gens.forEach(g => { lead += rarityLeadership(g.rarity || 1); });
  lead = Math.min(1.38, lead);

  const defWeights = inferDefenseWeights(mapProgress);
  const counter = expectedCounterMult(alloc, defWeights);
  const lo = Math.max(1, Number(mapLvlMin) || 50);
  const hi = Math.max(lo, Number(mapLvlMax) || 80);
  const midLv = (lo + hi) / 2;
  const wallBase = 138 + (midLv - 50) * 2.05;
  const rawP = mapProgress || {};
  const prog = { wei: 0, shu: 0, wu: 0, jin: 0, qun: 0 };
  for (const k of CONTEST_BAR_IDS) prog[k] = Math.max(0, Number(rawP[k]) || 0);
  const others = CONTEST_BAR_IDS
    .filter(fid => fid !== playerFaction)
    .reduce((s, fid) => s + (prog[fid] || 0), 0);
  const av = Math.min(100, Math.max(15, Number(avgPartyLevel) || 55));
  const wallHp = Math.max(52, wallBase * (1 + others * 0.0065) * (0.92 + av * 0.0018));
  const atkW = KW_TROOP_IDS.reduce((s, tid) => s + (alloc[tid] || 0) * (TROOP_WEIGHT[tid] || 1), 0);
  const qunBoost = ((prog.qun || 0) / (1 + others * 0.5)) * 0.012;
  const expectedRoundDamage = atkW * lead * counter * (1.05 - qunBoost * 0.35);
  const expectedDamage = expectedRoundDamage * 7;
  const pressure = expectedDamage / Math.max(1, wallHp);
  const winChance = clamp(0.06 + (pressure / (pressure + 1.05)) * 0.88, 0.06, 0.94);
  const expectedLossRate = clamp(0.24 - winChance * 0.1 + Math.max(0, 1 - counter) * 0.08 + (others > 120 ? 0.035 : 0), 0.1, 0.52);
  const expectedLoss = Math.min(deploy, Math.floor(deploy * expectedLossRate));
  const expectedOccupationGain = winChance >= 0.5
    ? Math.floor(10 + pressure * 8 + counter * 5 + Math.min(6, gens.length * 2))
    : Math.floor(2 + winChance * 5);
  const dominantFaction = getDominantContestFaction(prog, playerFaction);
  const advice = [];
  if (counter < 0.96) advice.push('兵种克制不足，建议按推荐配兵调整');
  if ((prog.qun || 0) > 80) advice.push('群雄盘踞较深，战损会偏高');
  if (gens.length < 2) advice.push('携带 2 到 3 名武将可提升破城稳定性');
  if (winChance < 0.45) advice.push('建议先继续征兵或等待争夺条削弱守方');

  return {
    canAttack: true,
    reason: '',
    mapId,
    allocation: alloc,
    deploy,
    selectedGenerals: gens,
    defWeights,
    suggestedAllocation: getSuggestedAllocation(defWeights, deploy),
    counter,
    leadership: lead,
    wallHp,
    expectedDamage,
    pressure,
    winChance,
    riskLabel: getRiskLabel(winChance),
    expectedLoss,
    expectedLossRate,
    expectedOccupationGain,
    dominantFaction,
    advice: advice.length ? advice : ['当前攻城配置稳定，可执行'],
  };
};

/**
 * 攻城推演：玩家派遣兵力 + 至多 3 名已招募武将
 * @returns {{ victory:boolean, occupationGain:number, manpowerLost:number, wallRemainPct:number, detail:string }}
 */
export const runKwSiegeBattle = ({
  mapId,
  playerFaction,
  allocation,
  generalIds,
  recruitedGenerals = [],
  mapProgress,
  mapLvlMin = 50,
  mapLvlMax = 80,
  avgPartyLevel = 55,
}) => {
  const preview = evaluateKwSiegeBattle({
    mapId,
    playerFaction,
    allocation,
    generalIds,
    recruitedGenerals,
    mapProgress,
    mapLvlMin,
    mapLvlMax,
    avgPartyLevel,
  });
  const alloc = preview.allocation || normalizeAllocation(allocation);
  const deploy = preview.deploy || sumAlloc(alloc);
  if (!playerFaction || !['wei', 'shu', 'wu', 'jin'].includes(playerFaction)) {
    return { victory: false, occupationGain: 0, manpowerLost: 0, wallRemainPct: 100, detail: '未加入势力，无法攻城。' };
  }
  if (deploy < 80) {
    return { victory: false, occupationGain: 0, manpowerLost: 0, wallRemainPct: 100, detail: '兵力不足 80，无法形成有效攻城阵势。' };
  }

  const uniqIds = [...new Set((generalIds || []).map(x => String(x)))].slice(0, 3);
  const gens = uniqIds.map(id => recruitedGenerals.find(g => String(g?.id) === id)).filter(Boolean);
  const wallHp = preview.wallHp || 100;
  const wall = wallHp - (preview.expectedDamage || 0) * (0.82 + Math.random() * 0.36);

  const victory = wall <= 0;
  const margin = victory ? Math.min(2.2, Math.abs(wall) / wallHp + 0.4) : Math.max(0, 1 - wall / wallHp);

  const lossRate = victory
    ? (preview.expectedLossRate || 0.18) * (0.78 + Math.random() * 0.28)
    : (preview.expectedLossRate || 0.26) * (1.06 + Math.random() * 0.34);

  const manpowerLost = Math.min(deploy, Math.floor(deploy * Math.min(0.55, lossRate)));
  const occupationGain = victory
    ? Math.floor((preview.expectedOccupationGain || 14) * (0.82 + margin * 0.24))
    : 0;

  const wallRemainPct = Math.max(0, Math.round((Math.max(0, wall) / wallHp) * 100));
  const qunName = QUN_LEADERS[Math.floor(Math.random() * QUN_LEADERS.length)];
  const genNames = gens.map(g => (g && g.name) ? g.name : '将领').join('、');
  const detail = victory
    ? `城防被撕开！${genNames || '诸军'}率部突入，${qunName}等部被迫后撤。`
    : `城头箭如雨下，${qunName}部与守军联防，未能破城（城防剩余约 ${wallRemainPct}%）。`;

  return {
    victory,
    occupationGain,
    manpowerLost,
    wallRemainPct,
    detail,
    winChance: preview.winChance,
    riskLabel: preview.riskLabel,
    counter: preview.counter,
  };
};

// ==========================================
// 日战 / 夜战
// ==========================================

/** 夜战：18:00-6:00 */
export const isNightBattle = () => {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
};

export const getBattleTimeModifiers = () => {
  if (!isNightBattle()) {
    return { label: '日战', attackMult: 1, defenseMult: 1, contribMult: 1, nightVision: false };
  }
  return {
    label: '夜战',
    attackMult: 0.92,
    defenseMult: 1.15,
    contribMult: 1.5,
    nightVision: true,
    desc: '守方防御+15%，夜战胜利战功x1.5',
  };
};

// ==========================================
// 武将单挑
// ==========================================

export const getGeneralDuelStats = (general) => {
  if (!general) return { force: 50, intellect: 50, command: 50 };
  const base = general.teamLevel || 50;
  const rarityMult = (general.rarity === 'SSR' || general.rarity === 3) ? 1.3
    : (general.rarity === 'SR' || general.rarity === 2) ? 1.15 : 1;
  return {
    force: Math.floor(base * rarityMult * 0.9),
    intellect: Math.floor(base * rarityMult * 0.75),
    command: Math.floor(base * rarityMult * 0.85),
  };
};

export const resolveGeneralDuel = (playerGeneral, defenderGeneral) => {
  const p = getGeneralDuelStats(playerGeneral);
  const d = getGeneralDuelStats(defenderGeneral);
  const forceDiff = p.force - d.force;
  const intDiff = p.intellect - d.intellect;
  const cmdDiff = p.command - d.command;
  let winChance = 0.5;
  winChance += (forceDiff / 10) * 0.15;
  winChance += (intDiff / 10) * 0.08;
  winChance += (cmdDiff / 10) * 0.06;
  winChance += (Math.random() - 0.5) * 0.12;
  winChance = clamp(winChance, 0.12, 0.88);
  const victory = Math.random() < winChance;
  const strategy = intDiff >= 15 && Math.random() < 0.35;
  return {
    victory,
    winChance,
    playerStats: p,
    defenderStats: d,
    strategyTriggered: strategy,
    detail: victory
      ? (strategy ? `${playerGeneral?.name || '我方'}以计策破敌，守将${defenderGeneral?.name || ''}败退！城防-15`
        : `${playerGeneral?.name || '我方'}力克${defenderGeneral?.name || '守将'}！城防-15`)
      : `${defenderGeneral?.name || '守将'}坚守不退，${playerGeneral?.name || '我方'}受挫`,
    strengthChange: victory ? -15 : 0,
    moraleChange: victory ? 10 : -20,
  };
};

// ==========================================
// 三阶段攻城
// ==========================================

/**
 * 三阶段攻城：野战 -> 单挑(可选) -> 攻城战
 * @returns 完整攻城结果
 */
export const runThreePhaseSiege = ({
  mapId,
  playerFaction,
  allocation,
  territories,
  recruitedGenerals = [],
  generalIds = [],
  duelGeneralId = null,
  skipDuel = false,
  eliteTroops = 0,
  morale = 100,
  kw = null,
  fieldEval = null,
  external = null,
}) => {
  const t = territories?.[mapId];
  if (!t || t.owner === playerFaction) {
    return { success: false, captured: false, phases: [], totalManpowerLost: 0, detail: '无法攻击己方领地' };
  }

  const timeMod = getBattleTimeModifiers();
  const phases = [];
  let totalManpowerLost = 0;
  let strength = t.strength || 50;
  let currentMorale = morale || 100;
  const terrCopy = JSON.parse(JSON.stringify(territories));
  let guards = [...(t.guards || [])];

  const alloc = normalizeAllocation(allocation);
  const deploy = sumAlloc(alloc);

  // === 阶段1：野战（与预览共用 buildSiegeCombatParams） ===
  const fieldCombat = buildSiegeCombatParams({
    mapId, playerFaction, allocation: alloc, territories, recruitedGenerals, generalIds, kw,
    external, timeMod, remainingGuards: guards.filter(g => !g.defeated).length,
  });
  const fieldWinChance = fieldCombat.fieldWinChance;
  const fieldCost = Math.max(20, Math.min(40, Math.floor((strength || 50) / 3)));
  const fieldVictory = deploy >= 60 && Math.random() < fieldWinChance;
  const fieldLoss = fieldVictory
    ? Math.floor(fieldCost * (0.7 - fieldWinChance * 0.15))
    : Math.floor(fieldCost * (1.1 + (1 - fieldWinChance) * 0.3));
  totalManpowerLost += fieldLoss;
  if (!fieldVictory) {
    currentMorale = Math.max(20, currentMorale - 15);
    phases.push({ phase: 'field', victory: false, loss: fieldLoss, detail: `${timeMod.label}野战失利，损失 ${fieldLoss} 兵力` });
    return {
      success: false, captured: false, phases, totalManpowerLost, strengthChange: 0,
      morale: currentMorale, detail: `${timeMod.label}野战失利，攻城中止`,
      contribMult: timeMod.contribMult * (fieldCombat.extBonus.contribMult || 1),
      nightVision: timeMod.nightVision,
    };
  }
  totalManpowerLost = Math.max(0, totalManpowerLost - Math.floor(fieldCost * 0.3));
  strength = Math.max(0, strength - Math.floor(5 + fieldWinChance * 8));
  phases.push({ phase: 'field', victory: true, loss: fieldLoss, detail: `${timeMod.label}野战告捷，城防削弱` });

  // === 阶段2：守将单挑 ===
  const activeGuards = guards.filter(g => !g.defeated);
  let duelResult = null;
  if (!skipDuel && activeGuards.length > 0 && duelGeneralId) {
    const playerGen = recruitedGenerals.find(g => g.id === duelGeneralId) || getGeneralById(duelGeneralId);
    const defGuard = activeGuards[0];
    const defGen = getGeneralById(defGuard.generalId) || { name: defGuard.name, teamLevel: 60, rarity: defGuard.rarity || 'R' };
    duelResult = resolveGeneralDuel(playerGen, defGen);
    currentMorale = clamp(currentMorale + (duelResult.moraleChange || 0), 20, 120);
    strength = Math.max(0, strength + (duelResult.strengthChange || 0));
    if (duelResult.victory) {
      guards = guards.map(g => g.generalId === defGuard.generalId ? { ...g, defeated: true, recoverActions: 0 } : g);
    }
    phases.push({ phase: 'duel', victory: duelResult.victory, detail: duelResult.detail });
  } else if (!skipDuel && activeGuards.length > 0) {
    phases.push({ phase: 'duel', victory: null, detail: `守将${activeGuards.map(g => g.name).join('、')}据守，跳过了单挑` });
  }

  // === 阶段3：攻城战（单挑后重算守将惩罚与 siege_master 倍率） ===
  const assaultCombat = buildSiegeCombatParams({
    mapId, playerFaction, allocation: alloc, territories, recruitedGenerals, generalIds, kw,
    external, timeMod, remainingGuards: guards.filter(g => !g.defeated).length,
  });
  const assaultPower = assaultCombat.assaultPower;
  const defPower = assaultCombat.defPower;
  const damage = Math.floor(8 + (assaultPower / Math.max(1, defPower)) * 17 * assaultCombat.extBonus.assaultDamageMult);
  strength = Math.max(0, strength - damage);
  const lossRate = clamp(0.35 - (assaultPower / (assaultPower + defPower + 1)) * 0.15, 0.15, 0.5);
  const assaultLoss = Math.min(deploy, Math.floor(deploy * lossRate));
  totalManpowerLost += assaultLoss;
  const eliteRatio = assaultCombat.eliteRatio;
  const eliteLost = Math.min(eliteTroops || 0, Math.floor(assaultLoss * eliteRatio));
  phases.push({
    phase: 'assault', victory: strength <= 0, loss: assaultLoss,
    detail: strength <= 0 ? `城防崩塌！投入 ${deploy} 兵力攻破城池` : `城防剩余 ${strength}，需再次攻城`,
  });

  const captured = strength <= 0;
  const contribMult = timeMod.contribMult * (duelResult?.victory ? 1.1 : 1) * (assaultCombat.extBonus.contribMult || 1);

  terrCopy[mapId] = {
    ...t,
    strength: captured ? 0 : strength,
    guards,
  };

  return {
    success: true,
    captured,
    phases,
    totalManpowerLost,
    eliteLost,
    strength,
    strengthChange: captured ? -999 : -damage,
    morale: currentMorale,
    territories: terrCopy,
    guards,
    detail: captured
      ? `三阶段攻城成功！${phases.map(p => p.detail).join(' → ')}`
      : `攻城削弱城防至 ${strength}，可继续进攻`,
    contribMult,
    nightVision: timeMod.nightVision,
    timeLabel: timeMod.label,
    winChance: fieldEval?.winChance ?? assaultCombat.winChance,
    atkTroops: alloc,
    defTroops: t.garrison,
    extBonus: assaultCombat.extBonus,
  };
};

const getGarrisonTotalLocal = (garrison) => {
  if (!garrison) return 0;
  return Object.values(garrison).reduce((s, v) => s + (v || 0), 0);
};
