import { POKEDEX } from './pets';
import { SKILL_DB } from './skills';
import { TYPES } from './types';
import { LEGENDARY_POOL, HIGH_TIER_POOL, FINAL_GOD_IDS } from './battles';

export const TCG_DECK_SIZE = 30;
export const TCG_MAX_COPIES = 2;
export const TCG_PRIZE_COUNT = 3;
export const TCG_BENCH_SIZE = 3;
export const TCG_START_HAND = 5;
export const TCG_DAILY_FREE_BATTLES = 3;
export const TCG_EXTRA_BATTLE_COST = 200;

const TYPE_CHART = {
  NORMAL: { weak: ['FIGHT'], resist: [] },
  FIRE: { weak: ['WATER', 'GROUND', 'ROCK'], resist: ['GRASS', 'ICE', 'BUG', 'STEEL', 'FAIRY'] },
  WATER: { weak: ['GRASS', 'ELECTRIC'], resist: ['FIRE', 'WATER', 'ICE', 'STEEL'] },
  GRASS: { weak: ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'], resist: ['WATER', 'GRASS', 'ELECTRIC', 'GROUND'] },
  ELECTRIC: { weak: ['GROUND'], resist: ['ELECTRIC', 'FLYING', 'STEEL'] },
  ICE: { weak: ['FIRE', 'FIGHT', 'ROCK', 'STEEL'], resist: ['ICE'] },
  FIGHT: { weak: ['FLYING', 'PSYCHIC', 'FAIRY'], resist: ['ROCK', 'BUG', 'DARK'] },
  POISON: { weak: ['GROUND', 'PSYCHIC'], resist: ['GRASS', 'FIGHT', 'POISON', 'BUG', 'FAIRY'] },
  GROUND: { weak: ['WATER', 'GRASS', 'ICE'], resist: ['POISON', 'ROCK'] },
  FLYING: { weak: ['ELECTRIC', 'ICE', 'ROCK'], resist: ['GRASS', 'FIGHT', 'BUG'] },
  PSYCHIC: { weak: ['BUG', 'GHOST', 'DARK'], resist: ['FIGHT', 'PSYCHIC'] },
  BUG: { weak: ['FIRE', 'FLYING', 'ROCK'], resist: ['GRASS', 'FIGHT', 'GROUND'] },
  ROCK: { weak: ['WATER', 'GRASS', 'FIGHT', 'GROUND', 'STEEL'], resist: ['NORMAL', 'FIRE', 'POISON', 'FLYING'] },
  GHOST: { weak: ['GHOST', 'DARK'], resist: ['POISON', 'BUG'] },
  DRAGON: { weak: ['ICE', 'DRAGON', 'FAIRY'], resist: ['FIRE', 'WATER', 'GRASS', 'ELECTRIC'] },
  STEEL: { weak: ['FIRE', 'FIGHT', 'GROUND'], resist: ['NORMAL', 'GRASS', 'ICE', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'DRAGON', 'STEEL', 'FAIRY'] },
  FAIRY: { weak: ['POISON', 'STEEL'], resist: ['FIGHT', 'BUG', 'DARK'] },
  DARK: { weak: ['FIGHT', 'BUG', 'FAIRY'], resist: ['GHOST', 'DARK'] },
  WIND: { weak: ['ELECTRIC', 'ICE'], resist: ['GRASS', 'FIGHT'] },
  LIGHT: { weak: ['DARK', 'GHOST'], resist: ['FIGHT', 'BUG'] },
  HEAL: { weak: ['POISON', 'DARK'], resist: ['GRASS', 'WATER'] },
  COSMIC: { weak: ['DARK', 'GHOST'], resist: ['PSYCHIC', 'FAIRY'] },
  SOUND: { weak: ['FIGHT', 'STEEL'], resist: ['WATER', 'GRASS'] },
  GOD: { weak: ['GOD'], resist: ['DRAGON', 'DARK', 'GHOST'] },
};

const GOD_SET = new Set(FINAL_GOD_IDS);
const LEGEND_SET = new Set(LEGENDARY_POOL || []);
const HIGH_SET = new Set(HIGH_TIER_POOL || []);

function roundHp(v) {
  return Math.max(40, Math.round(v / 10) * 10);
}

function getRarity(pet, stage) {
  if (GOD_SET.has(pet.id)) return 'UR';
  if (LEGEND_SET.has(pet.id)) return 'SR';
  if (stage >= 2 || HIGH_SET.has(pet.id)) return 'R';
  if (stage === 1) return 'U';
  return 'C';
}

function getStage(pet, evoMap) {
  if (evoMap.has(pet.id)) return 0;
  const parents = [...evoMap.entries()].filter(([, target]) => target === pet.id);
  if (!parents.length) return 2;
  const parentId = parents[0][0];
  if (evoMap.has(parentId)) return 1;
  return 2;
}

function pickWeakness(type) {
  const info = TYPE_CHART[type] || TYPE_CHART.NORMAL;
  return info.weak[0] || 'FIGHT';
}

function pickResistance(type) {
  const info = TYPE_CHART[type] || TYPE_CHART.NORMAL;
  return info.resist[0] || null;
}

function powerToDamage(p, stage) {
  if (!p || p <= 0) return 0;
  const base = Math.max(10, Math.round(p * 0.45));
  return Math.min(150, base + stage * 10);
}

function buildEnergyCost(moveType, petType, idx) {
  const t = moveType || petType || 'NORMAL';
  if (idx === 0) return [{ type: t, count: 1 }];
  return [{ type: t, count: 1 }, { type: 'NORMAL', count: 1 }];
}

function buildMoves(pet, stage) {
  const typeMoves = SKILL_DB[pet.type] || SKILL_DB.NORMAL || [];
  const dmgMoves = typeMoves.filter(m => (m.p || 0) > 0).slice(0, 4);
  const statusMoves = typeMoves.filter(m => !(m.p > 0) && m.effect).slice(0, 2);
  const picks = [];
  if (dmgMoves[0]) picks.push(dmgMoves[0]);
  else picks.push({ name: '撞击', p: 40, desc: '基础攻击' });
  if (dmgMoves[1]) picks.push(dmgMoves[1]);
  else if (statusMoves[0]) picks.push({ name: statusMoves[0].name, p: 20, effect: statusMoves[0].effect, desc: statusMoves[0].desc });
  else picks.push({ name: '猛撞', p: 60, desc: '全力撞击' });

  return picks.slice(0, 2).map((m, i) => ({
    name: m.name,
    damage: powerToDamage(m.p, stage),
    energyCost: buildEnergyCost(m.t || pet.type, pet.type, i),
    effect: m.effect ? normalizeEffect(m.effect) : null,
    desc: m.desc || '',
  }));
}

function normalizeEffect(effect) {
  if (!effect) return null;
  if (effect.type === 'STATUS' && effect.status) {
    return { kind: 'status', status: effect.status, chance: effect.chance || 1 };
  }
  if (effect.type === 'BUFF' || effect.type === 'DEBUFF') {
    return { kind: 'stat', stat: effect.stat, val: effect.val || 1 };
  }
  if (effect.healPercent) return { kind: 'heal', amount: Math.round(effect.healPercent * 30) };
  return null;
}

function buildPokemonCard(pet, evoMap) {
  const stage = getStage(pet, evoMap);
  const rarity = getRarity(pet, stage);
  const hp = roundHp((pet.hp || 50) * (1.2 + stage * 0.25));
  const parents = [...evoMap.entries()].filter(([, target]) => target === pet.id);
  const evolvesFrom = parents.length ? `poke_${String(parents[0][0]).padStart(3, '0')}` : null;
  const evolvesTo = pet.evo ? `poke_${String(pet.evo).padStart(3, '0')}` : null;
  return {
    cardId: `poke_${String(pet.id).padStart(3, '0')}`,
    cardType: 'pokemon',
    dexId: pet.id,
    name: pet.name,
    emoji: pet.emoji || '✨',
    type: pet.type,
    type2: pet.type2 || null,
    hp,
    rarity,
    stage,
    evolvesFrom,
    evolvesTo,
    weakness: pickWeakness(pet.type),
    resistance: pickResistance(pet.type),
    retreatCost: Math.min(4, Math.max(1, 1 + stage)),
    moves: buildMoves(pet, stage),
    ability: rarity === 'UR' ? '神域加护：每回合开始回复10HP' : rarity === 'SR' ? '传说气场：首次攻击+20伤害' : null,
    illustrator: 'ChenGame Studio',
    isBasic: stage === 0,
  };
}

const evoMap = new Map();
POKEDEX.forEach(p => { if (p.evo) evoMap.set(p.id, p.evo); });

export const TCG_POKEMON_CARDS = POKEDEX.map(p => buildPokemonCard(p, evoMap));

export const TCG_ENERGY_CARDS = [
  ...Object.keys(TYPES).map(type => ({
    cardId: `energy_${type}`,
    cardType: 'energy',
    name: `${TYPES[type].name}能量`,
    type,
    rarity: 'C',
    emoji: '⚡',
    color: TYPES[type].color,
  })),
  {
    cardId: 'energy_RAINBOW',
    cardType: 'energy',
    name: '彩虹能量',
    type: 'RAINBOW',
    rarity: 'R',
    emoji: '🌈',
    color: '#E040FB',
    isSpecial: true,
  },
];

export const TCG_TRAINER_CARDS = [
  { cardId: 'trainer_001', cardType: 'trainer', name: '博士的研究', rarity: 'U', emoji: '🔬', effect: { kind: 'draw', count: 2 }, desc: '抽2张卡' },
  { cardId: 'trainer_002', cardType: 'trainer', name: '精灵球', rarity: 'C', emoji: '🔴', effect: { kind: 'search', cardType: 'pokemon', stage: 0 }, desc: '从牌库找1张基础精灵' },
  { cardId: 'trainer_003', cardType: 'trainer', name: '伤药', rarity: 'C', emoji: '💊', effect: { kind: 'heal', amount: 30 }, desc: '战斗精灵回复30HP' },
  { cardId: 'trainer_004', cardType: 'trainer', name: '超级伤药', rarity: 'U', emoji: '💉', effect: { kind: 'heal', amount: 60 }, desc: '战斗精灵回复60HP' },
  { cardId: 'trainer_005', cardType: 'trainer', name: '能量检索', rarity: 'U', emoji: '🔋', effect: { kind: 'search', cardType: 'energy' }, desc: '从牌库找1张能量' },
  { cardId: 'trainer_006', cardType: 'trainer', name: '战斗切换', rarity: 'U', emoji: '🔄', effect: { kind: 'switch' }, desc: '将战斗精灵与后备交换' },
  { cardId: 'trainer_007', cardType: 'trainer', name: '干扰波', rarity: 'R', emoji: '📡', effect: { kind: 'discard', target: 'opponent', count: 1 }, desc: '对手随机弃1张手牌' },
  { cardId: 'trainer_008', cardType: 'trainer', name: '强化药剂', rarity: 'R', emoji: '🧪', effect: { kind: 'buff', stat: 'damage', val: 20 }, desc: '本回合攻击+20伤害' },
  { cardId: 'trainer_009', cardType: 'trainer', name: '紧急撤退', rarity: 'U', emoji: '🏃', effect: { kind: 'retreat_free' }, desc: '免费撤退战斗精灵' },
  { cardId: 'trainer_010', cardType: 'trainer', name: '幸运护符', rarity: 'SR', emoji: '🍀', effect: { kind: 'draw', count: 3 }, desc: '抽3张卡' },
];

export const TCG_ALL_CARDS = [...TCG_POKEMON_CARDS, ...TCG_ENERGY_CARDS, ...TCG_TRAINER_CARDS];
export const TCG_CARD_MAP = Object.fromEntries(TCG_ALL_CARDS.map(c => [c.cardId, c]));

export const TCG_PACKS = {
  basic: { id: 'basic', name: '基础包', price: 200, count: 5, guarantee: ['C','C','C','C','U'], pool: ['C','U'], icon: '📦' },
  rare: { id: 'rare', name: '稀有包', price: 500, count: 5, guarantee: ['C','C','C','U','R'], pool: ['C','U','R'], icon: '💎' },
  legend: { id: 'legend', name: '传说包', price: 1500, count: 5, guarantee: ['U','U','R','R','SR'], pool: ['U','R','SR'], icon: '👑' },
  god: { id: 'god', name: '神域包', price: 3000, count: 3, guarantee: ['R','SR','UR'], pool: ['R','SR','UR'], icon: '🌌' },
};

export const TCG_DIFFICULTIES = [
  { id: 'easy', name: '初学者', trainer: '小智', emoji: '🧢', ai: 'random', reward: { gold: 100, packs: ['basic'], srChance: 0 }, cost: 0 },
  { id: 'medium', name: '进阶', trainer: '劲敌', emoji: '⚔️', ai: 'counter', reward: { gold: 300, packs: ['basic','basic'], srChance: 0.02 }, cost: 0 },
  { id: 'hard', name: '高手', trainer: '冠军', emoji: '🏆', ai: 'smart', reward: { gold: 500, packs: ['rare','basic'], srChance: 0.08 }, cost: 0 },
  { id: 'legend', name: '传说', trainer: '神域守护', emoji: '✨', ai: 'expert', reward: { gold: 1000, packs: ['legend','rare'], srChance: 0.15, urChance: 0.03 }, cost: 0 },
];

const RARITY_WEIGHT = { C: 60, U: 25, R: 10, SR: 4, UR: 1 };

export function getCardsByRarity(rarity, cardType = 'pokemon') {
  return TCG_ALL_CARDS.filter(c => c.cardType === cardType && c.rarity === rarity);
}

export function rollRarity(pool) {
  const weights = pool.map(r => RARITY_WEIGHT[r] || 1);
  const total = weights.reduce((a,b)=>a+b,0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function openPack(packId) {
  const pack = TCG_PACKS[packId];
  if (!pack) return [];
  const results = [];
  const guaranteed = [...pack.guarantee];
  while (guaranteed.length < pack.count) guaranteed.push(rollRarity(pack.pool));
  guaranteed.slice(0, pack.count).forEach(rarity => {
    const pokemonPool = getCardsByRarity(rarity, 'pokemon');
  const trainerChance = Math.random() < 0.12;
    if (trainerChance) {
      const trainers = TCG_TRAINER_CARDS.filter(t => !pack.pool.includes('UR') ? t.rarity !== 'UR' : true);
      if (trainers.length) { results.push(trainers[Math.floor(Math.random() * trainers.length)].cardId); return; }
    }
    const energyChance = Math.random() < 0.18;
    if (energyChance) {
      const energies = pack.pool.includes('UR') ? TCG_ENERGY_CARDS : TCG_ENERGY_CARDS.filter(e => e.type !== 'RAINBOW');
      results.push(energies[Math.floor(Math.random() * energies.length)].cardId);
      return;
    }
    const pick = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
    results.push(pick?.cardId || 'poke_001');
  });
  return results;
}

export function getCard(cardId) {
  return TCG_CARD_MAP[cardId] || null;
}

export function cloneBattleCard(cardId) {
  const def = getCard(cardId);
  if (!def) return null;
  if (def.cardType !== 'pokemon') return { ...def, instanceId: `${cardId}_${Math.random().toString(36).slice(2,8)}` };
  return {
    ...def,
    instanceId: `${cardId}_${Math.random().toString(36).slice(2,8)}`,
    currentHp: def.hp,
    attachedEnergy: [],
    status: null,
    damageBonus: 0,
    canRetreat: true,
    usedAbility: false,
  };
}

export function canPayEnergy(attached, cost) {
  const pool = [...attached];
  for (const req of cost) {
    for (let i = 0; i < req.count; i++) {
      const idxRainbow = pool.findIndex(e => e === 'RAINBOW');
      const idxExact = pool.findIndex(e => e === req.type);
      if (idxExact >= 0) pool.splice(idxExact, 1);
      else if (idxRainbow >= 0) pool.splice(idxRainbow, 1);
      else return false;
    }
  }
  return true;
}

export function calcTCGDamage(attacker, defender, move, attackerType) {
  let dmg = (move.damage || 0) + (attacker.damageBonus || 0);
  if (attackerType && defender.weakness === attackerType) dmg *= 2;
  if (attackerType && defender.resistance === attackerType) dmg = Math.max(10, dmg - 20);
  return Math.max(0, Math.floor(dmg));
}

export function validateDeck(cardIds) {
  const counts = {};
  let basics = 0;
  for (const id of cardIds) {
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] > TCG_MAX_COPIES) return { ok: false, reason: '同名卡不能超过2张' };
    const card = getCard(id);
    if (!card) return { ok: false, reason: '存在无效卡牌' };
    if (card.cardType === 'pokemon' && card.isBasic) basics++;
  }
  if (cardIds.length !== TCG_DECK_SIZE) return { ok: false, reason: `卡组需要${TCG_DECK_SIZE}张` };
  if (basics < 1) return { ok: false, reason: '至少需要1张基础精灵卡' };
  return { ok: true };
}

export const TCG_STARTER_DECKS = [
  {
    name: '青草萌芽',
    desc: '草系速攻，适合新手',
    cards: [
      'poke_001','poke_001','poke_004','poke_004','poke_007','poke_007',
      'energy_GRASS','energy_GRASS','energy_GRASS','energy_GRASS','energy_GRASS','energy_GRASS',
      'energy_NORMAL','energy_NORMAL','energy_NORMAL','energy_NORMAL',
      'energy_WATER','energy_WATER','energy_FIRE','energy_FIRE',
      'trainer_001','trainer_002','trainer_003','trainer_005','trainer_006',
      'poke_002','poke_005','poke_008','trainer_003','trainer_001'
    ],
  },
  {
    name: '烈焰冲击',
    desc: '火系高爆发',
    cards: [
      'poke_004','poke_004','poke_011','poke_011','poke_016','poke_016',
      'energy_FIRE','energy_FIRE','energy_FIRE','energy_FIRE','energy_FIRE','energy_FIRE',
      'energy_NORMAL','energy_NORMAL','energy_NORMAL','energy_NORMAL',
      'energy_GRASS','energy_GRASS','energy_ELECTRIC','energy_ELECTRIC',
      'trainer_001','trainer_003','trainer_005','trainer_008','trainer_006',
      'poke_005','poke_012','poke_017','trainer_002','trainer_003'
    ],
  },
  {
    name: '潮汐掌控',
    desc: '水系稳健运营',
    cards: [
      'poke_007','poke_007','poke_021','poke_021','poke_024','poke_024',
      'energy_WATER','energy_WATER','energy_WATER','energy_WATER','energy_WATER','energy_WATER',
      'energy_NORMAL','energy_NORMAL','energy_NORMAL','energy_NORMAL',
      'energy_GRASS','energy_GRASS','energy_ELECTRIC','energy_ELECTRIC',
      'trainer_001','trainer_002','trainer_003','trainer_004','trainer_005',
      'poke_008','poke_022','poke_025','trainer_006','trainer_009'
    ],
  },
];

export function createDefaultTCGState() {
  const starterIds = [];
  TCG_STARTER_DECKS[0].cards.forEach(id => { if (!starterIds.includes(id)) starterIds.push(id); });
  ['poke_001','poke_004','poke_007','energy_GRASS','energy_FIRE','energy_WATER','energy_NORMAL','trainer_001','trainer_003'].forEach(id => {
    if (!starterIds.includes(id)) starterIds.push(id);
  });
  return {
    collection: starterIds,
    decks: TCG_STARTER_DECKS.map((d, i) => ({ name: d.name, cards: [...d.cards] })),
    activeDeck: 0,
    battleRecord: { wins: 0, losses: 0, streak: 0 },
    dailyBattles: 0,
    lastBattleDate: '',
    packsPurchased: 0,
    milestones: {},
    rankPoints: 0,
    dailyBossDate: '',
    dailyBossCleared: false,
    challengeStreak: 0,
    bestStreak: 0,
  };
}

export const TCG_RANKS = [
  { id: 'bronze', name: '铜牌训练家', icon: '🥉', min: 0 },
  { id: 'silver', name: '银牌训练家', icon: '🥈', min: 80 },
  { id: 'gold', name: '金牌训练家', icon: '🥇', min: 200 },
  { id: 'master', name: '卡牌大师', icon: '👑', min: 450 },
  { id: 'legend', name: '传说决斗者', icon: '✨', min: 800 },
];

export function getRankTier(points = 0) {
  let tier = TCG_RANKS[0];
  for (const r of TCG_RANKS) { if (points >= r.min) tier = r; }
  const next = TCG_RANKS[TCG_RANKS.indexOf(tier) + 1];
  return { ...tier, points, next, progress: next ? Math.min(100, Math.round(((points - tier.min) / (next.min - tier.min)) * 100)) : 100 };
}

export function calcRankPoints(won, difficultyId, streak = 0) {
  if (!won) return 0;
  const base = { easy: 15, medium: 25, hard: 40, legend: 60, boss: 50, streak: 20 }[difficultyId] || 15;
  const streakBonus = Math.min(30, Math.floor(streak / 2) * 5);
  return base + streakBonus;
}

export const TCG_CHALLENGES = [
  { id: 'boss', name: '每日首领', trainer: '试炼守护者', emoji: '👹', desc: '首领HP+50%，击败得稀有包', ai: 'smart', hpMult: 1.5, reward: { gold: 400, packs: ['rare'], points: 50 }, daily: true },
  { id: 'streak', name: '连胜挑战', trainer: '连胜守卫', emoji: '🔥', desc: '连胜越高奖励越多，败北即重置', ai: 'counter', reward: { gold: 200, packs: ['basic'], points: 20 }, streakMode: true },
];

export function applyStatusEffect(defender, effect) {
  if (!effect || effect.kind !== 'status' || !defender) return defender;
  if (Math.random() > (effect.chance ?? 1)) return defender;
  return { ...defender, status: effect.status };
}

export function processStatusDamage(mon) {
  if (!mon?.status) return { mon, damage: 0, skipAttack: false };
  let damage = 0;
  let skipAttack = false;
  if (mon.status === 'PSN') damage = 10;
  if (mon.status === 'BRN') damage = 20;
  if (mon.status === 'PAR' && Math.random() < 0.5) skipAttack = true;
  const currentHp = Math.max(0, (mon.currentHp || 0) - damage);
  return { mon: { ...mon, currentHp }, damage, skipAttack };
}

export function buildBossDeck() {
  const cards = [];
  const pool = getCardsByRarity('R', 'pokemon').concat(getCardsByRarity('SR', 'pokemon'));
  for (let i = 0; i < 8; i++) cards.push(pool[Math.floor(Math.random() * pool.length)]?.cardId || 'poke_003');
  for (let i = 0; i < 10; i++) cards.push(`energy_${['FIRE','WATER','GRASS','ELECTRIC'][i % 4]}`);
  const trainers = TCG_TRAINER_CARDS.filter(t => t.rarity === 'R' || t.rarity === 'U');
  while (cards.length < TCG_DECK_SIZE) cards.push(trainers[Math.floor(Math.random() * trainers.length)].cardId);
  return cards.slice(0, TCG_DECK_SIZE);
}

export function buildAIDeck(difficultyId) {
  const diff = TCG_DIFFICULTIES.find(d => d.id === difficultyId) || TCG_DIFFICULTIES[0];
  const poolRarity = diff.id === 'legend' ? ['R','SR','UR'] : diff.id === 'hard' ? ['U','R','SR'] : diff.id === 'medium' ? ['C','U','R'] : ['C','U'];
  const cards = [];
  const basics = getCardsByRarity(poolRarity[0], 'pokemon').filter(c => c.isBasic);
  const pickBasic = () => basics[Math.floor(Math.random() * basics.length)]?.cardId || 'poke_001';
  cards.push(pickBasic(), pickBasic(), pickBasic(), pickBasic());
  while (cards.length < 18) {
    const r = poolRarity[Math.floor(Math.random() * poolRarity.length)];
    const pool = getCardsByRarity(r, 'pokemon');
    cards.push(pool[Math.floor(Math.random() * pool.length)]?.cardId || 'poke_001');
  }
  const types = [...new Set(cards.map(id => getCard(id)?.type).filter(Boolean))];
  const mainType = types[0] || 'NORMAL';
  for (let i = 0; i < 8; i++) cards.push(`energy_${mainType}`);
  cards.push('energy_NORMAL','energy_NORMAL','energy_NORMAL','energy_NORMAL');
  const trainers = TCG_TRAINER_CARDS.filter(t => t.rarity !== 'UR');
  while (cards.length < TCG_DECK_SIZE) cards.push(trainers[Math.floor(Math.random() * trainers.length)].cardId);
  return cards.slice(0, TCG_DECK_SIZE);
}

export function countCollectionByRarity(collection) {
  const counts = { C:0,U:0,R:0,SR:0,UR:0, total: collection.length };
  collection.forEach(id => { const c = getCard(id); if (c?.rarity) counts[c.rarity] = (counts[c.rarity]||0)+1; });
  return counts;
}
