/** 国土灵灾 — 国战与生态 PVE 融合 */

export const NATIONAL_CALAMITIES = [
  {
    id: 'calamity_black_vine', name: '黑藤灵灾', icon: '🌿', reqBadges: 5,
    type: 'forest_pollution', durationDays: 7,
    summary: '森林污染扩散，需净化和防守据点。',
    nationEffects: { pollution: 12, stability: -8 },
    playerActions: ['purify_nodes', 'defend_outpost', 'boss_clear'],
    bossKey: 'black_vine_king',
    reward: { kwContrib: 100, guardianScore: 15, gold: 8000 },
  },
  {
    id: 'calamity_black_tide', name: '黑潮灵灾', icon: '🌊', reqBadges: 6,
    type: 'water_pollution', durationDays: 7,
    summary: '水域污染，水系精灵暴走。',
    nationEffects: { water: -15, pollution: 10 },
    playerActions: ['purify_water', 'capture_alive', 'soothe_beasts'],
    bossKey: 'black_tide_serpent',
    reward: { kwContrib: 90, guardianScore: 12, gold: 7000 },
  },
  {
    id: 'calamity_sandstorm', name: '沙暴灵灾', icon: '🏜️', reqBadges: 7,
    type: 'desert', durationDays: 5,
    summary: '边境沙化，商路被切断。',
    nationEffects: { stability: -10, diversity: -5 },
    playerActions: ['escort_caravan', 'repair_oasis', 'boss_clear'],
    bossKey: 'sand_core_golem',
    reward: { kwContrib: 80, gold: 6000, kwManpower: 30 },
  },
  {
    id: 'calamity_mechanical', name: '机械灵灾', icon: '🤖', reqBadges: 6,
    type: 'factory', durationDays: 6,
    summary: '古代机械精灵失控。',
    nationEffects: { pollution: 8, spirit: -5 },
    playerActions: ['seal_tower', 'battle_suppress', 'puzzle_repair'],
    bossKey: 'mech_overlord',
    reward: { kwContrib: 95, guardianScore: 10, gold: 7500 },
  },
  {
    id: 'calamity_nightmare', name: '梦魇灵灾', icon: '🌙', reqBadges: 8,
    type: 'dream', durationDays: 5,
    summary: '国土进入梦境异常，暗系增强。',
    nationEffects: { spirit: 15, stability: -12 },
    playerActions: ['dream_puzzle', 'soothe_sleep', 'boss_clear'],
    bossKey: 'nightmare_lord',
    reward: { kwContrib: 110, guardianScore: 18, gold: 9000, title: '梦魇驱离者' },
  },
  {
    id: 'calamity_ghost_night', name: '鬼夜灵灾', icon: '👹', reqBadges: 7,
    type: 'demon_night', durationDays: 5,
    summary: '边境夜晚鬼化精灵入侵，需呼吸法斩鬼与封印支援。',
    nationEffects: { stability: -12, spirit: 10 },
    playerActions: ['night_patrol', 'purify_nodes', 'boss_clear'],
    bossKey: 'mist_oni',
    reward: { kwContrib: 100, guardianScore: 15, gold: 8500, title: '夜巡守护者' },
  },
  {
    id: 'calamity_stellar', name: '星陨灵灾', icon: '☄️', reqBadges: 9,
    type: 'gravity', durationDays: 4,
    summary: '陨石降临，区域重力异常。',
    nationEffects: { spirit: 20, pollution: 5 },
    playerActions: ['track_meteor', 'escape_survive', 'boss_clear'],
    bossKey: 'stellar_whale',
    reward: { kwContrib: 150, guardianScore: 25, gold: 14000, title: '星陨守护者' },
  },
  {
    id: 'calamity_seal_break', name: '封印崩坏灵灾', icon: '⛩️', reqBadges: 9,
    type: 'seal_break', durationDays: 6,
    summary: '国土封印松动，尾兽级灾厄能量外泄，需全国动员封印。',
    nationEffects: { stability: -15, spirit: 25, pollution: 10 },
    playerActions: ['seal_nodes', 'chakra_restore', 'boss_clear'],
    bossKey: 'tailed_calamity',
    reward: { kwContrib: 130, guardianScore: 22, gold: 12000, title: '封印守护者' },
  },
];

/** 根据本地日期字符串生成稳定的 ISO 周键，避免跨月或时区导致周次错乱。 */
export function getCalamityWeekKey(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || '');
  const year = match ? Number(match[1]) : 2026;
  const month = match ? Number(match[2]) : 1;
  const day = match ? Number(match[3]) : 1;
  const date = new Date(Date.UTC(year, Math.max(0, month - 1), Math.max(1, day)));
  const isoDay = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - isoDay);
  const weekYear = date.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return `${weekYear}-W${String(week).padStart(2, '0')}`;
}

export function getActiveNationalCalamities(dateStr, badgeCount) {
  const weekKey = getCalamityWeekKey(dateStr);
  const [weekYear, week] = weekKey.split('-W').map(Number);
  const weekNumber = weekYear * 53 + week;
  const available = NATIONAL_CALAMITIES.filter(c => badgeCount >= c.reqBadges);
  if (!available.length) return [];
  if (available.length === 1) return [available[0]];
  const count = available.length >= 5 ? 3 : 2;
  const seed = weekNumber * 7 + 13;
  const picked = new Set();
  const result = [];
  for (let i = 0; i < count; i++) {
    let idx = (seed * (i + 1) + i * 11) % available.length;
    let tries = 0;
    while (picked.has(idx) && tries < available.length) {
      idx = (idx + 1) % available.length;
      tries++;
    }
    if (!picked.has(idx)) {
      picked.add(idx);
      result.push(available[idx]);
    }
  }
  return result;
}

export function getCalamityById(id) {
  return NATIONAL_CALAMITIES.find(c => c.id === id);
}
