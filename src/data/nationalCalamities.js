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

/** 每周轮换灾厄组合（按年月日计算周数，确保每周不同且不重复） */
export function getActiveNationalCalamities(dateStr, badgeCount) {
  const parts = (dateStr || '').split('-').map(n => parseInt(n, 10) || 0);
  const year = parts[0] || 2026;
  const month = parts[1] || 1;
  const day = parts[2] || 1;
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  let dayOfYear = day;
  for (let m = 1; m < month; m++) dayOfYear += daysInMonth[m] || 30;
  if (month > 2 && isLeap) dayOfYear += 1;
  const weekNumber = Math.floor(dayOfYear / 7) + year * 52;
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
