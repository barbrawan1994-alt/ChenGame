export const POLITICAL_FACTIONS = ['wei', 'shu', 'wu', 'jin', 'qun'];

export const QUN_LORDS = Object.freeze([
  { id: 'yuan_shao', name: '河北袁氏', leaderId: 'neu_yuan_shao', icon: '🏯', doctrine: '门生故吏', attack: 1.02, defense: 1.08 },
  { id: 'dong_zhuo', name: '西凉董军', leaderId: 'neu_dong_zhuo', icon: '🔥', doctrine: '暴烈强攻', attack: 1.12, defense: 0.92 },
  { id: 'lv_bu', name: '并州飞骑', leaderId: 'neu_lv_bu', icon: '🐺', doctrine: '精骑突袭', attack: 1.1, defense: 0.94 },
  { id: 'yellow_turban', name: '黄巾诸部', leaderId: 'neu_zhang_jiao', icon: '☯️', doctrine: '民军蜂起', attack: 0.96, defense: 1.02 },
  { id: 'jingzhou', name: '荆州刘氏', leaderId: 'neu_liu_biao', icon: '📯', doctrine: '据险自守', attack: 0.9, defense: 1.14 },
  { id: 'xiliang', name: '关西联军', leaderId: 'neu_ma_teng', icon: '🐎', doctrine: '凉州铁骑', attack: 1.08, defense: 0.98 },
  { id: 'youzhou', name: '幽燕诸侯', leaderId: 'neu_gongsun_zan', icon: '🦄', doctrine: '白马边军', attack: 1.04, defense: 1.02 },
  { id: 'yizhou', name: '益州汉中', leaderId: 'neu_liu_zhang', icon: '🏔️', doctrine: '山川壁垒', attack: 0.9, defense: 1.16 },
  { id: 'nanman', name: '南中诸部', leaderId: 'neu_meng_huo', icon: '🐘', doctrine: '藤甲山战', attack: 1, defense: 1.08 },
  { id: 'han_court', name: '汉廷义军', leaderId: 'neu_zhu_jun', icon: '⚖️', doctrine: '勤王守序', attack: 0.96, defense: 1.06 },
]);

const QUN_LORD_MEMBERS = Object.freeze({
  yuan_shao: [
    'neu_yuan_shao', 'neu_yuan_shu', 'neu_yan_liang', 'neu_wen_chou', 'neu_tian_feng', 'neu_ju_shou',
    'neu_han_fu', 'neu_chen_lin', 'neu_tao_qian2', 'neu_lei_bo', 'neu_yuan_tan', 'neu_yuan_xi',
    'neu_yuan_shang', 'neu_gao_gan', 'neu_shen_pei', 'neu_feng_ji', 'neu_guo_tu', 'neu_xin_ping',
    'neu_qu_yi', 'neu_chunyu_qiong', 'neu_jiang_yiqu',
  ],
  dong_zhuo: ['neu_dong_zhuo', 'neu_hua_xiong', 'neu_li_jue', 'neu_guo_si', 'neu_fan_chou', 'neu_zhang_ji', 'neu_li_ru', 'neu_niu_fu', 'neu_cai_yong', 'neu_wang_yun'],
  lv_bu: [
    'neu_lv_bu', 'neu_diao_chan', 'neu_chen_gong', 'neu_gao_shun', 'neu_ding_yuan', 'neu_zhang_yang',
    'neu_zhang_miao', 'neu_yufuluo', 'neu_huchuquan', 'neu_liu_bao',
  ],
  yellow_turban: ['neu_zhang_jiao', 'neu_zhang_bao_hj', 'neu_zhang_liang_hj', 'neu_zhang_yan', 'neu_yang_feng', 'neu_li_que'],
  jingzhou: [
    'neu_liu_biao', 'neu_liu_cong', 'neu_liu_qi', 'neu_han_xuan', 'neu_liu_du', 'neu_jin_xuan',
    'neu_zhao_fan', 'neu_sha_moke', 'neu_kuai_yue', 'neu_kuai_liang', 'neu_cai_mao', 'neu_huang_zu', 'neu_han_song',
  ],
  xiliang: ['neu_ma_teng', 'neu_han_sui', 'neu_zhang_xiu', 'neu_ma_wan', 'neu_hou_xuan'],
  youzhou: [
    'neu_gongsun_zan', 'neu_gongsun_du', 'neu_gongsun_yuan', 'neu_liu_yu', 'neu_ta_dun', 'neu_kong_rong',
    'neu_gongsun_kang', 'neu_gongsun_gong',
  ],
  yizhou: ['neu_liu_zhang', 'neu_liu_yan', 'neu_zhang_lu', 'neu_zhang_ren', 'neu_tao_qian'],
  nanman: ['neu_meng_huo', 'neu_zhu_rong', 'neu_wu_tugu', 'neu_shi_xie', 'neu_liu_yao'],
});

export const DIPLOMACY_CONFIG = Object.freeze({
  maxActionsPerDay: 2,
  envoyCost: 5,
  pactCost: 12,
  coalitionCost: 15,
  pactMinRelation: 20,
  pactDurationTicks: 8,
  coalitionDurationTicks: 6,
  intrigueChancePerTick: 0.16,
  generalEventCooldownTicks: 8,
  recentEventLimit: 30,
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const factionOf = (faction) => faction === 'neutral' ? 'qun' : (POLITICAL_FACTIONS.includes(faction) ? faction : 'qun');
const hashText = (value) => String(value || '').split('').reduce((hash, char) => ((hash * 33) ^ char.charCodeAt(0)) >>> 0, 2166136261);
const pairKey = (a, b) => [a, b].sort().join(':');
const finiteOr = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const qunLordById = id => QUN_LORDS.find(lord => lord.id === id) || null;
const getHomeQunLordId = (general) => {
  if (general?.faction !== 'neutral') return null;
  const matched = Object.entries(QUN_LORD_MEMBERS).find(([, ids]) => ids.includes(general.id));
  return matched?.[0] || 'han_court';
};

const INITIAL_RELATIONS = {
  'shu:wei': -24,
  'wei:wu': -12,
  'jin:wei': -6,
  'shu:wu': 14,
  'jin:shu': -8,
  'jin:wu': -5,
  'qun:wei': -16,
  'qun:shu': -10,
  'qun:wu': -10,
  'jin:qun': -14,
};

const makeGeneralState = (general) => {
  const hash = hashText(general.id);
  const homeFaction = factionOf(general.faction);
  const rarityBase = general.rarity === 'SSR' ? 12 : general.rarity === 'SR' ? 6 : 0;
  const command = Number(general.teamLevel) || 60;
  const homeLordId = getHomeQunLordId(general);
  return {
    id: general.id,
    homeFaction,
    allegiance: homeFaction,
    loyalty: clamp(56 + rarityBase + (hash % 25), 35, 96),
    ambition: clamp(18 + ((hash >>> 5) % 73), 10, 94),
    cunning: clamp(22 + ((hash >>> 11) % 71), 15, 96),
    role: general.rarity === 'SSR' || command >= 82 ? 'commander' : general.rarity === 'SR' || command >= 72 ? 'deputy' : 'officer',
    status: 'serving',
    homeLordId,
    lordId: homeLordId,
    cooldownUntilTick: 0,
  };
};

export const createDefaultKingdomPolitics = (generals = []) => {
  const relations = {};
  for (let i = 0; i < POLITICAL_FACTIONS.length; i += 1) {
    for (let j = i + 1; j < POLITICAL_FACTIONS.length; j += 1) {
      const key = pairKey(POLITICAL_FACTIONS[i], POLITICAL_FACTIONS[j]);
      relations[key] = INITIAL_RELATIONS[key] ?? ((hashText(key) % 13) - 6);
    }
  }
  return {
    version: 2,
    worldTick: 0,
    trust: 50,
    relations,
    treaties: [],
    coalitions: [],
    plots: [],
    prestige: Object.fromEntries(POLITICAL_FACTIONS.map(fid => [fid, 0])),
    qunLords: Object.fromEntries(QUN_LORDS.map((lord, index) => [lord.id, {
      id: lord.id,
      cohesion: 54 + ((index * 7) % 19),
      influence: 10,
      lastActionTick: 0,
    }])),
    generals: Object.fromEntries(generals.map(general => [general.id, makeGeneralState(general)])),
    recentEvents: [],
    dailyActionDate: null,
    dailyActionCount: 0,
  };
};

export const migrateKingdomPolitics = (saved, generals = []) => {
  const base = createDefaultKingdomPolitics(generals);
  const raw = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  const next = { ...base, ...raw };
  next.worldTick = Math.max(0, Math.floor(Number(next.worldTick) || 0));
  next.trust = clamp(Math.floor(finiteOr(next.trust, 50)), 0, 100);
  next.relations = { ...base.relations };
  Object.entries(raw.relations || {}).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(next.relations, key)) next.relations[key] = clamp(Math.floor(Number(value) || 0), -100, 100);
  });
  next.generals = { ...base.generals };
  generals.forEach(general => {
    const fallback = base.generals[general.id];
    const current = raw.generals?.[general.id] || {};
    next.generals[general.id] = {
      ...fallback,
      ...current,
      homeFaction: factionOf(current.homeFaction || fallback.homeFaction),
      allegiance: factionOf(current.allegiance || fallback.allegiance),
      loyalty: clamp(Math.floor(finiteOr(current.loyalty, fallback.loyalty)), 0, 100),
      ambition: clamp(Math.floor(finiteOr(current.ambition, fallback.ambition)), 0, 100),
      cunning: clamp(Math.floor(finiteOr(current.cunning, fallback.cunning)), 0, 100),
      homeLordId: qunLordById(current.homeLordId)?.id || fallback.homeLordId,
      lordId: factionOf(current.allegiance || fallback.allegiance) === 'qun'
        ? (qunLordById(current.lordId)?.id || fallback.homeLordId || 'han_court')
        : null,
      cooldownUntilTick: Math.max(0, Math.floor(Number(current.cooldownUntilTick) || 0)),
    };
  });
  next.qunLords = Object.fromEntries(QUN_LORDS.map(lord => {
    const current = raw.qunLords?.[lord.id] || {};
    const fallback = base.qunLords[lord.id];
    return [lord.id, {
      id: lord.id,
      cohesion: clamp(Math.floor(Number(current.cohesion) || fallback.cohesion), 20, 90),
      influence: clamp(Math.floor(Number(current.influence) || fallback.influence), 0, 100),
      lastActionTick: Math.max(0, Math.floor(Number(current.lastActionTick) || 0)),
    }];
  }));
  const validFaction = value => POLITICAL_FACTIONS.includes(value);
  next.treaties = (Array.isArray(raw.treaties) ? raw.treaties : []).filter(treaty => (
    validFaction(treaty?.a) && validFaction(treaty?.b) && treaty.a !== treaty.b && Number(treaty.expiresTick) > next.worldTick
  )).map(treaty => ({ ...treaty, expiresTick: Math.floor(Number(treaty.expiresTick)) }));
  next.coalitions = (Array.isArray(raw.coalitions) ? raw.coalitions : []).filter(coalition => (
    Array.isArray(coalition?.members) && coalition.members.every(validFaction) && validFaction(coalition.target) && Number(coalition.expiresTick) > next.worldTick
  )).map(coalition => ({ ...coalition, members: [...new Set(coalition.members)], expiresTick: Math.floor(Number(coalition.expiresTick)) }));
  next.plots = (Array.isArray(raw.plots) ? raw.plots : []).filter(plot => plot?.generalId && validFaction(plot.homeFaction) && validFaction(plot.targetFaction));
  next.prestige = Object.fromEntries(POLITICAL_FACTIONS.map(fid => [fid, Math.max(0, Math.floor(Number(raw.prestige?.[fid]) || 0))]));
  next.recentEvents = (Array.isArray(raw.recentEvents) ? raw.recentEvents : []).filter(Boolean).slice(-DIPLOMACY_CONFIG.recentEventLimit);
  next.dailyActionDate = typeof raw.dailyActionDate === 'string' ? raw.dailyActionDate : null;
  next.dailyActionCount = Math.max(0, Math.floor(Number(raw.dailyActionCount) || 0));
  return next;
};

export const getFactionRelation = (politics, a, b) => {
  if (!a || !b || a === b) return 100;
  return clamp(Number(politics?.relations?.[pairKey(a, b)]) || 0, -100, 100);
};

export const getActiveTreaty = (politics, a, b) => (politics?.treaties || []).find(treaty => (
  ((treaty.a === a && treaty.b === b) || (treaty.a === b && treaty.b === a))
  && Number(treaty.expiresTick) > (Number(politics?.worldTick) || 0)
));

export const canFactionAttack = (politics, attacker, defender) => {
  if (!defender || defender === 'neutral' || defender === attacker) return { ok: true, reason: '' };
  const treaty = getActiveTreaty(politics, attacker, defender);
  if (!treaty) return { ok: true, reason: '' };
  return { ok: false, reason: `与${defender}方的互不侵犯盟约仍有 ${treaty.expiresTick - (politics.worldTick || 0)} 个战略回合` };
};

export const getFactionPoliticalSummary = (politics, generals, faction) => {
  const roster = generals.filter(general => politics?.generals?.[general.id]?.allegiance === faction);
  const scored = roster.map(general => {
    const state = politics.generals[general.id];
    const rarity = general.rarity === 'SSR' ? 1.35 : general.rarity === 'SR' ? 1.16 : 1;
    const commandScore = (Number(general.teamLevel) || 60) * rarity * (0.78 + state.loyalty / 260);
    return { general, state, commandScore };
  }).sort((a, b) => b.commandScore - a.commandScore);
  const power = Math.floor(scored.reduce((sum, item) => sum + item.commandScore, 0) / 18);
  return {
    faction,
    count: roster.length,
    commander: scored[0]?.general || null,
    deputy: scored[1]?.general || null,
    power,
    wavering: scored.filter(item => item.state.loyalty < 40).length,
    warlords: scored.filter(item => item.state.status === 'warlord').length,
  };
};

export const getQunLordSummaries = (politics, generals = []) => QUN_LORDS.map(lord => {
  const roster = generals.filter(general => {
    const state = politics?.generals?.[general.id];
    return state?.allegiance === 'qun' && state.lordId === lord.id;
  });
  const scored = roster.map(general => {
    const state = politics.generals[general.id];
    const rarity = general.rarity === 'SSR' ? 1.35 : general.rarity === 'SR' ? 1.16 : 1;
    return { general, state, commandScore: (Number(general.teamLevel) || 60) * rarity * (0.78 + state.loyalty / 260) };
  }).sort((a, b) => b.commandScore - a.commandScore);
  const lordState = politics?.qunLords?.[lord.id] || { cohesion: 50, influence: 10, lastActionTick: 0 };
  const rawPower = Math.floor(scored.reduce((sum, item) => sum + item.commandScore, 0) / 18);
  const readiness = Math.floor(rawPower * (0.55 + lordState.cohesion / 200) * lord.attack);
  return {
    ...lord,
    count: roster.length,
    commander: scored[0]?.general || null,
    deputy: scored[1]?.general || null,
    cohesion: lordState.cohesion,
    influence: lordState.influence,
    lastActionTick: lordState.lastActionTick,
    rawPower,
    readiness,
  };
}).sort((a, b) => b.readiness - a.readiness || b.influence - a.influence || a.id.localeCompare(b.id));

export const getFactionGeneralPower = (politics, generals, faction) => {
  if (faction !== 'qun') return getFactionPoliticalSummary(politics, generals, faction).power;
  const lords = getQunLordSummaries(politics, generals);
  // 群雄不会共享全部兵权：盟主可全额号令本部，只能借调次强诸侯的三成兵力。
  return Math.floor((lords[0]?.readiness || 0) + (lords[1]?.readiness || 0) * 0.3);
};

export const selectQunLordForAction = (politics, generals = [], random = Math.random, eligibleLordIds = null) => {
  const eligible = Array.isArray(eligibleLordIds) ? new Set(eligibleLordIds) : null;
  const candidates = getQunLordSummaries(politics, generals).filter(lord => (
    lord.count > 0 && lord.cohesion >= 25 && (!eligible || eligible.has(lord.id))
  ));
  return chooseWeighted(candidates, lord => Math.max(1, lord.readiness) * (0.6 + lord.influence / 100), random);
};

export const recordQunLordBattle = (politics, lordId, { success = false, captured = false } = {}) => {
  const state = politics?.qunLords?.[lordId];
  if (!state) return politics;
  state.lastActionTick = politics.worldTick || 0;
  state.influence = clamp(state.influence + (captured ? 8 : success ? 3 : -2), 0, 100);
  state.cohesion = clamp(state.cohesion + (captured ? 2 : success ? 0 : -1), 20, 90);
  return politics;
};

const addEvent = (politics, event) => {
  politics.recentEvents = [...(politics.recentEvents || []), event].slice(-DIPLOMACY_CONFIG.recentEventLimit);
};

const changeRelation = (politics, a, b, delta) => {
  if (!a || !b || a === b) return;
  const key = pairKey(a, b);
  politics.relations[key] = clamp((Number(politics.relations[key]) || 0) + delta, -100, 100);
};

export const applyDiplomaticAction = ({ politics: rawPolitics, generals = [], actor, target, action, dateKey, territoryCounts = {} }) => {
  const politics = migrateKingdomPolitics(rawPolitics, generals);
  if (!POLITICAL_FACTIONS.includes(actor) || !POLITICAL_FACTIONS.includes(target) || actor === target) return { ok: false, reason: '外交目标无效' };
  const todayCount = politics.dailyActionDate === dateKey ? politics.dailyActionCount : 0;
  if (todayCount >= DIPLOMACY_CONFIG.maxActionsPerDay && action !== 'break_pact') return { ok: false, reason: '今日使节行动次数已用完' };
  const relation = getFactionRelation(politics, actor, target);
  let tokenCost = 0;
  let moraleLoss = 0;
  let message = '';

  if (action === 'envoy') {
    tokenCost = DIPLOMACY_CONFIG.envoyCost;
    changeRelation(politics, actor, target, 14);
    politics.trust = clamp(politics.trust + 1, 0, 100);
    message = `遣使修好，关系 ${relation} → ${getFactionRelation(politics, actor, target)}`;
  } else if (action === 'pact') {
    if (getActiveTreaty(politics, actor, target)) return { ok: false, reason: '双方已有生效中的互不侵犯盟约' };
    if (relation < DIPLOMACY_CONFIG.pactMinRelation) return { ok: false, reason: `关系至少达到 ${DIPLOMACY_CONFIG.pactMinRelation} 才能缔约` };
    if (politics.treaties.some(treaty => (
      treaty.a === actor || treaty.b === actor || treaty.a === target || treaty.b === target
    ))) return { ok: false, reason: '缔约双方均只能同时维持一份互不侵犯盟约' };
    tokenCost = DIPLOMACY_CONFIG.pactCost;
    politics.treaties.push({ a: actor, b: target, startedTick: politics.worldTick, expiresTick: politics.worldTick + DIPLOMACY_CONFIG.pactDurationTicks });
    changeRelation(politics, actor, target, 6);
    message = `缔结 ${DIPLOMACY_CONFIG.pactDurationTicks} 回合互不侵犯盟约`;
  } else if (action === 'break_pact') {
    const treaty = getActiveTreaty(politics, actor, target);
    if (!treaty) return { ok: false, reason: '双方没有可撕毁的盟约' };
    politics.treaties = politics.treaties.filter(item => item !== treaty);
    changeRelation(politics, actor, target, -38);
    politics.trust = clamp(politics.trust - 18, 0, 100);
    moraleLoss = 12;
    message = '撕毁盟约：关系、国家信誉与士气下降';
  } else if (action === 'coalition') {
    const leader = POLITICAL_FACTIONS.slice().sort((a, b) => (territoryCounts[b] || 0) - (territoryCounts[a] || 0))[0];
    if (!leader || leader === actor || leader === target) return { ok: false, reason: '只有非领跑国家之间才能联合遏制当前霸主' };
    if (relation < 0) return { ok: false, reason: '双方关系至少达到中立才能组成联合阵线' };
    if ((territoryCounts[leader] || 0) < (territoryCounts[actor] || 0) + 2) return { ok: false, reason: '当前领跑优势不足以发动联合遏制' };
    if (politics.coalitions.some(coalition => (
      coalition.members.includes(actor) || coalition.members.includes(target)
    ))) return { ok: false, reason: '缔盟双方已有一方处于联合阵线中' };
    tokenCost = DIPLOMACY_CONFIG.coalitionCost;
    politics.coalitions.push({ members: [actor, target], target: leader, startedTick: politics.worldTick, expiresTick: politics.worldTick + DIPLOMACY_CONFIG.coalitionDurationTicks });
    changeRelation(politics, actor, target, 8);
    changeRelation(politics, actor, leader, -8);
    message = `与${target}组成联合阵线，共同遏制${leader}`;
  } else {
    return { ok: false, reason: '未知外交行动' };
  }

  if (action !== 'break_pact') {
    politics.dailyActionDate = dateKey;
    politics.dailyActionCount = todayCount + 1;
  }
  addEvent(politics, { tick: politics.worldTick, type: `diplomacy_${action}`, actor, target, message });
  return { ok: true, politics, tokenCost, moraleLoss, message };
};

export const getDiplomaticTargetModifier = (politics, attacker, defender, territoryCounts = {}) => {
  if (!defender || defender === 'neutral') return 0;
  if (!canFactionAttack(politics, attacker, defender).ok) return -10000;
  let modifier = -getFactionRelation(politics, attacker, defender) * 0.45;
  const coalition = (politics?.coalitions || []).find(item => item.members.includes(attacker) && item.target === defender && item.expiresTick > politics.worldTick);
  if (coalition) modifier += 95;
  const maxCount = Math.max(...POLITICAL_FACTIONS.map(fid => territoryCounts[fid] || 0));
  if ((territoryCounts[defender] || 0) === maxCount && maxCount >= (territoryCounts[attacker] || 0) + 2) modifier += 38;
  return modifier;
};

const chooseWeighted = (items, weightOf, random) => {
  const weighted = items.map(item => ({ item, weight: Math.max(0, weightOf(item)) })).filter(entry => entry.weight > 0);
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) return null;
  let roll = random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1]?.item || null;
};

export const advanceKingdomPolitics = ({ politics: rawPolitics, generals = [], territoryCounts = {}, factionManpower = {}, random = Math.random }) => {
  const politics = migrateKingdomPolitics(rawPolitics, generals);
  politics.worldTick += 1;
  const tick = politics.worldTick;
  politics.treaties = politics.treaties.filter(treaty => treaty.expiresTick > tick);
  politics.coalitions = politics.coalitions.filter(coalition => coalition.expiresTick > tick);
  const manpower = { ...factionManpower };
  POLITICAL_FACTIONS.forEach(fid => { manpower[fid] = Math.max(0, Math.floor(Number(manpower[fid]) || 0)); });
  const events = [];

  const duePlots = politics.plots.filter(plot => plot.revealTick <= tick);
  politics.plots = politics.plots.filter(plot => plot.revealTick > tick);
  duePlots.forEach(plot => {
    const state = politics.generals[plot.generalId];
    const general = generals.find(item => item.id === plot.generalId);
    if (!state || !general) return;
    state.allegiance = plot.homeFaction;
    state.lordId = plot.homeFaction === 'qun' ? (state.homeLordId || 'han_court') : null;
    state.status = 'serving';
    state.loyalty = clamp(state.loyalty + 12, 0, 100);
    state.cooldownUntilTick = tick + DIPLOMACY_CONFIG.generalEventCooldownTicks;
    manpower[plot.targetFaction] = Math.max(0, manpower[plot.targetFaction] - 36);
    manpower[plot.homeFaction] += 24;
    politics.prestige[plot.homeFaction] += 6;
    changeRelation(politics, plot.homeFaction, plot.targetFaction, -18);
    const message = `${general.name}诈降计成，在${plot.targetFaction}军中纵火后重归${plot.homeFaction}`;
    const event = { tick, type: 'feigned_reveal', generalId: general.id, actor: plot.homeFaction, target: plot.targetFaction, message };
    events.push(event); addEvent(politics, event);
  });

  const averageCount = POLITICAL_FACTIONS.reduce((sum, fid) => sum + (territoryCounts[fid] || 0), 0) / POLITICAL_FACTIONS.length;
  Object.values(politics.qunLords || {}).forEach(lord => {
    const qunCount = territoryCounts.qun || 0;
    const cohesionDrift = qunCount >= averageCount + 2 ? -2 : qunCount <= averageCount - 1 ? 1 : 0;
    lord.cohesion = clamp(lord.cohesion + cohesionDrift, 20, 90);
    lord.influence = clamp(lord.influence + (lord.influence > 10 ? -1 : lord.influence < 10 ? 1 : 0), 0, 100);
  });
  generals.forEach(general => {
    const state = politics.generals[general.id];
    if (!state || state.status === 'feigned') return;
    const count = territoryCounts[state.allegiance] || 0;
    let drift = count <= 2 ? -2 : count >= averageCount + 2 ? 1 : 0;
    if (state.allegiance !== state.homeFaction && (territoryCounts[state.homeFaction] || 0) > count) drift -= 1;
    state.loyalty = clamp(state.loyalty + drift, 0, 100);
  });

  if (events.length === 0 && tick >= 2 && random() < DIPLOMACY_CONFIG.intrigueChancePerTick) {
    const candidates = generals.filter(general => {
      const state = politics.generals[general.id];
      return state && state.status === 'serving' && state.cooldownUntilTick <= tick && (state.loyalty < 46 || state.ambition >= 78);
    });
    const general = chooseWeighted(candidates, item => {
      const state = politics.generals[item.id];
      return Math.max(1, 48 - state.loyalty) + Math.max(0, state.ambition - 66) * 0.7 + Math.max(0, state.cunning - 70) * 0.25;
    }, random);
    if (general) {
      const state = politics.generals[general.id];
      const source = state.allegiance;
      const possibleTargets = POLITICAL_FACTIONS.filter(fid => fid !== source && canFactionAttack(politics, source, fid).ok);
      const strongest = possibleTargets.sort((a, b) => (territoryCounts[b] || 0) - (territoryCounts[a] || 0))[0] || 'qun';
      let type = 'defection';
      let target = strongest;
      let message = '';
      if (state.ambition >= 86 && (territoryCounts[source] || 0) >= 3 && random() < 0.38) {
        type = 'warlord'; target = 'qun'; state.status = 'warlord'; state.allegiance = target;
        state.lordId = state.homeLordId || 'han_court';
        manpower[source] = Math.max(0, manpower[source] - 28); manpower[target] += 22;
        politics.prestige[source] = Math.max(0, politics.prestige[source] - 5); politics.prestige[target] += 4;
        message = `${general.name}野心膨胀，率亲兵脱离${source}拥兵自立`;
      } else if (state.cunning >= 78 && strongest !== source && random() < 0.44) {
        type = 'feigned_surrender'; target = strongest; state.status = 'feigned'; state.allegiance = target;
        state.lordId = target === 'qun' ? (selectQunLordForAction(politics, generals, random)?.id || state.homeLordId || 'han_court') : null;
        politics.plots.push({ generalId: general.id, homeFaction: source, targetFaction: target, revealTick: tick + 3 });
        manpower[source] = Math.max(0, manpower[source] - 12); manpower[target] += 12;
        message = `${general.name}向${target}献书请降，真意难辨`;
      } else {
        state.status = 'serving'; state.allegiance = target;
        state.lordId = target === 'qun' ? (selectQunLordForAction(politics, generals, random)?.id || state.homeLordId || 'han_court') : null;
        manpower[source] = Math.max(0, manpower[source] - 20); manpower[target] += 20;
        const surrender = (territoryCounts[source] || 0) <= 2 || state.loyalty < 22;
        type = surrender ? 'surrender' : 'defection';
        message = surrender ? `${general.name}见${source}大势已去，率部投降${target}` : `${general.name}背弃${source}，转投${target}`;
      }
      state.loyalty = type === 'feigned_surrender' ? state.loyalty : clamp(48 + Math.floor(random() * 24), 0, 100);
      state.cooldownUntilTick = tick + DIPLOMACY_CONFIG.generalEventCooldownTicks;
      changeRelation(politics, source, target, -12);
      const event = { tick, type, generalId: general.id, actor: source, target, message };
      events.push(event); addEvent(politics, event);
    }
  }

  return { politics, factionManpower: manpower, events };
};

export const resetKingdomPoliticsForSeason = (rawPolitics, generals = []) => {
  const politics = migrateKingdomPolitics(rawPolitics, generals);
  politics.worldTick = 0;
  politics.treaties = [];
  politics.coalitions = [];
  politics.plots = [];
  politics.prestige = Object.fromEntries(POLITICAL_FACTIONS.map(fid => [fid, 0]));
  politics.dailyActionDate = null;
  politics.dailyActionCount = 0;
  Object.values(politics.generals).forEach(state => {
    state.loyalty = clamp(state.loyalty + 6, 0, 100);
    state.cooldownUntilTick = 0;
    if (state.status === 'feigned') {
      state.status = 'serving';
      state.allegiance = state.homeFaction;
    }
    state.lordId = state.allegiance === 'qun' ? (state.homeLordId || state.lordId || 'han_court') : null;
  });
  Object.values(politics.qunLords || {}).forEach(lord => {
    lord.cohesion = clamp(lord.cohesion + 4, 20, 90);
    lord.influence = 10;
    lord.lastActionTick = 0;
  });
  return politics;
};
