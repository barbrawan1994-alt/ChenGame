// ==========================================
// 国战 · 名城攻城（兵力 / 六兵种克制 / 群雄）
// 纯数值推演，不依赖战斗引擎，避免与主战斗耦合导致崩溃
// ==========================================

import { CONTESTED_MAP_IDS } from './kingdom';

export const CONTESTED_SIEGE_MAP_IDS = CONTESTED_MAP_IDS;

/** 争夺条参与方：魏蜀吴 + 群雄 AI */
export const CONTEST_BAR_IDS = ['wei', 'shu', 'wu', 'qun'];

export const MANPOWER_RESERVE_CAP = 2800;

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

const rarityLeadership = (r) => {
  if (r >= 3) return 0.11;
  if (r === 2) return 0.065;
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
    qun: Math.max(0, Math.floor(Number(raw.qun) || 0)),
  };
};

/** 由城池争夺条推导出「守城方兵种倾向」 */
export const inferDefenseWeights = (mapProgress) => {
  const raw = mapProgress || {};
  const p = { wei: 0, shu: 0, wu: 0, qun: 0 };
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
  const p = { wei: 0, shu: 0, wu: 0, qun: 0 };
  for (const k of CONTEST_BAR_IDS) p[k] = Math.max(0, Number(raw[k]) || 0);
  const PRIORITY = { wei: 0, shu: 1, wu: 2, qun: 3 };
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
    const cur = { wei: 0, shu: 0, wu: 0, qun: 0, ...getContestMapProgress(cp, mid) };
    const roll = () => Math.max(0, Math.round((0.75 + Math.random() * 1.35) * aiScale));
    cur.qun = Math.min(480, (cur.qun || 0) + roll() + (Math.random() < 0.22 ? 1 : 0));
    for (const fid of ['wei', 'shu', 'wu']) {
      const antiPlayer = playerFaction && fid !== playerFaction ? 1.18 : 1;
      const gain = Math.round(roll() * 0.88 * antiPlayer);
      cur[fid] = Math.min(480, (cur[fid] || 0) + gain);
    }
    if (playerFaction && ['wei', 'shu', 'wu'].includes(playerFaction)) {
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
  const alloc = normalizeAllocation(allocation);
  const deploy = sumAlloc(alloc);
  if (!playerFaction || !['wei', 'shu', 'wu'].includes(playerFaction)) {
    return { victory: false, occupationGain: 0, manpowerLost: 0, wallRemainPct: 100, detail: '未加入势力，无法攻城。' };
  }
  if (deploy < 80) {
    return { victory: false, occupationGain: 0, manpowerLost: 0, wallRemainPct: 100, detail: '兵力不足 80，无法形成有效攻城阵势。' };
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
  const prog = { wei: 0, shu: 0, wu: 0, qun: 0 };
  for (const k of CONTEST_BAR_IDS) prog[k] = Math.max(0, Number(rawP[k]) || 0);
  const others = CONTEST_BAR_IDS
    .filter(fid => fid !== playerFaction)
    .reduce((s, fid) => s + (prog[fid] || 0), 0);
  const av = Math.min(100, Math.max(15, Number(avgPartyLevel) || 55));
  const wallHp = Math.max(
    52,
    wallBase * (1 + others * 0.0065) * (0.92 + av * 0.0018),
  );

  const atkW = KW_TROOP_IDS.reduce((s, tid) => s + (alloc[tid] || 0) * (TROOP_WEIGHT[tid] || 1), 0);
  let wall = wallHp;
  const rounds = 7;
  for (let r = 0; r < rounds; r++) {
    const noise = 0.88 + Math.random() * 0.26;
    const qunBoost = ((prog.qun || 0) / (1 + others * 0.5)) * 0.012;
    const dmg = atkW * lead * counter * noise * (1.05 - qunBoost * 0.35);
    wall -= dmg;
  }

  const victory = wall <= 0;
  const margin = victory ? Math.min(2.2, Math.abs(wall) / wallHp + 0.4) : Math.max(0, 1 - wall / wallHp);

  const lossRate = victory
    ? 0.12 + Math.random() * 0.1 + (1 - counter) * 0.06
    : 0.22 + Math.random() * 0.14 + (counter < 0.95 ? 0.08 : 0);

  const manpowerLost = Math.min(deploy, Math.floor(deploy * Math.min(0.55, lossRate)));
  const occupationGain = victory
    ? Math.floor(11 + margin * 9 + counter * 5 + Math.min(6, gens.length * 2))
    : Math.floor(2 + Math.random() * 3);

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
  };
};
