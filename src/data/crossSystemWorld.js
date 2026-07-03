/** v14.2 跨体系大世界玩法框架 — 忍术/果实/呼吸法/门派/国战融合 */

import { FUSION_UNLOCK_SCHEDULE } from './systemFusion';

/** 五层构筑定位 */
export const PLAYER_BUILD_LAYERS = [
  { id: 'pets', name: '精灵队伍', icon: '🐾', desc: '核心战斗与探索单位' },
  { id: 'player_style', name: '玩家流派', icon: '🧑', desc: '主修忍者/呼吸法/武修，副修一项' },
  { id: 'devil_fruit', name: '恶魔果实', icon: '🍎', desc: '绑定精灵，改变规则（每精灵1枚）' },
  { id: 'sect', name: '门派心法', icon: '📜', desc: '长期成长与副本解法差异' },
  { id: 'nation', name: '国家与将魂', icon: '🏰', desc: '宏观战略与 PVE 战术' },
];

/** 玩家本体三大流派 */
export const PLAYER_STYLES = {
  ninja: { id: 'ninja', name: '忍者流', icon: '🍥', source: '忍术', desc: '结印、分身、封印、潜入', pveFocus: ['purify', 'puzzle', 'stealth'] },
  breathing: { id: 'breathing', name: '剑士流', icon: '⚔️', source: '呼吸法', desc: '连段、爆发、夜战斩鬼', pveFocus: ['boss', 'night', 'protect'] },
  sect: { id: 'sect', name: '武修流', icon: '🥋', source: '门派', desc: '心法、防守、持续作战', pveFocus: ['protect', 'kingdom', 'eco'] },
};

/** 呼吸法 PVE 战术（轻量，不改战斗属性） */
export const BREATHING_PVE_STYLES = {
  water: { id: 'water', name: '水之呼吸', icon: '🌊', passive: { protectBonus: 0.12, purifyBonus: 5 }, bestFor: ['protect', 'long_fight'] },
  fire: { id: 'fire', name: '炎之呼吸', icon: '🔥', passive: { bossMultReduce: 0.06, purifyBonus: 8 }, ecoPenalty: { vegetation: -1 }, bestFor: ['boss', 'burst'] },
  thunder: { id: 'thunder', name: '雷之呼吸', icon: '⚡', passive: { bossMultReduce: 0.06, escapeTurnReduce: 1 }, bestFor: ['assassinate', 'interrupt'] },
  wind: { id: 'wind', name: '风之呼吸', icon: '🌀', passive: { captureBonus: 0.1, exploreSpeedBonus: 0.5 }, bestFor: ['swarm', 'mobility'] },
  stone: { id: 'stone', name: '岩之呼吸', icon: '🪨', passive: { protectBonus: 0.14, bossMultReduce: 0.04 }, bestFor: ['protect', 'siege'] },
  insect: { id: 'insect', name: '蟲之呼吸', icon: '🦋', passive: { captureBonus: 0.15, purifyBonus: 6 }, bestFor: ['weak_point', 'demon'] },
  mist: { id: 'mist', name: '霞之呼吸', icon: '🌫️', passive: { puzzleHintBonus: true, captureBonus: 0.12 }, bestFor: ['stealth', 'night'] },
};

/** 跨体系解锁节奏（扩展 v14.1，徽章门槛递进） */
export const CROSS_SYSTEM_UNLOCK = [
  ...FUSION_UNLOCK_SCHEDULE,
  { chapter: 8, badges: 6, systems: ['breathing_pve', 'ghost_chapter', 'night_battle'], label: '呼吸法与夜战' },
  { chapter: 9, badges: 8, systems: ['sea_kw', 'seastone', 'fruit_awaken_t2'], label: '海域国战' },
  { chapter: 10, badges: 9, systems: ['seal_boss', 'chakra_nodes', 'kw_positions'], label: '封印战与国家Boss' },
  { chapter: 11, badges: 10, systems: ['cross_templates', 'build_presets', 'endgame_fusion'], label: '终局跨体系融合' },
].sort((a, b) => a.badges - b.badges || a.chapter - b.chapter);

/** 融合玩法模板（PVE 导向） */
export const FUSION_PLAY_TEMPLATES = [
  { id: 'tpl_ghost_night', name: '国土鬼夜灵灾', icon: '🌙', systems: ['breathing', 'jutsu', 'sect', 'kingdom'], summary: '白天调查→黄昏布防→夜晚斩鬼与封印' },
  { id: 'tpl_seastone_port', name: '海楼石港口争夺', icon: '⚓', systems: ['devil_fruit', 'jutsu', 'kingdom', 'general'], summary: '果实受限海域，港口与国战航线' },
  { id: 'tpl_tailed_seal', name: '尾兽级封印战', icon: '⛩️', systems: ['jutsu', 'breathing', 'fruit', 'kingdom'], summary: '多人封印阵，查克拉节点与破尾' },
  { id: 'tpl_sect_kw', name: '门派国战争夺', icon: '📜', systems: ['sect', 'kingdom', 'general'], summary: '遗迹控制权决定设施类型' },
  { id: 'tpl_demon_fruit', name: '鬼果融合事件', icon: '👹', systems: ['breathing', 'jutsu', 'fruit', 'sect'], summary: '鬼化+果实，净化/封印/击杀多结局' },
];

/** 国战职位（与门派/系统偏好） */
export const KINGDOM_POSITIONS = [
  { id: 'kw_vanguard', name: '前锋', icon: '⚔️', sectBias: [1, 4, 6], styleBias: ['breathing', 'ninja'] },
  { id: 'kw_guard', name: '守将', icon: '🛡️', sectBias: [2, 9], styleBias: ['sect', 'breathing'] },
  { id: 'kw_strategist', name: '军师', icon: '🧠', sectBias: [10, 11], styleBias: ['ninja', 'sect'] },
  { id: 'kw_logistics', name: '后勤', icon: '🌾', sectBias: [5, 7], styleBias: ['sect', 'breathing'] },
  { id: 'kw_scout', name: '斥候', icon: '👁️', sectBias: [3, 8], styleBias: ['ninja', 'breathing'] },
  { id: 'kw_spirit', name: '御灵官', icon: '💫', sectBias: [5, 12], styleBias: ['sect'] },
  { id: 'kw_sealer', name: '封印师', icon: '⛩️', sectBias: [10, 8], styleBias: ['ninja'] },
  { id: 'kw_night', name: '夜巡官', icon: '🌙', sectBias: [8, 3], styleBias: ['breathing'] },
];

/** 推荐构筑模板 */
export const BUILD_PRESETS = [
  { id: 'preset_fire_burst', name: '火攻爆发流', icon: '🔥', main: 'breathing', breathing: 'fire', sectHint: 6, general: 'zhou_yu', petTypes: ['FIRE', 'DRAGON'], note: '生态任务需控火' },
  { id: 'preset_water_heal', name: '水系净化流', icon: '💧', main: 'sect', breathing: 'water', sectHint: 7, general: 'hua_tuo', petTypes: ['WATER', 'GRASS'], note: '鬼化净化与后勤' },
  { id: 'preset_shadow', name: '暗影潜入流', icon: '🌑', main: 'ninja', breathing: 'mist', sectHint: 8, general: 'sima_yi', petTypes: ['DARK', 'GHOST'], note: '夜战与黑市' },
  { id: 'preset_siege', name: '国战防守流', icon: '🧱', main: 'sect', breathing: 'stone', sectHint: 2, general: 'cao_cao', petTypes: ['STEEL', 'ROCK'], note: '城防与护送' },
  { id: 'preset_spirit', name: '精灵守护流', icon: '🌿', main: 'sect', breathing: 'water', sectHint: 5, general: 'liu_bei', petTypes: ['FAIRY', 'GRASS', 'HEAL'], note: '结契与安抚' },
  { id: 'preset_mechanic', name: '机械策略流', icon: '⚙️', main: 'ninja', breathing: 'thunder', sectHint: 10, general: 'zhuge_liang', petTypes: ['ELECTRIC', 'STEEL'], note: '遗迹与砂核' },
  { id: 'preset_chaos', name: '混沌掌控流', icon: '🌀', main: 'breathing', breathing: 'thunder', sectHint: 4, general: 'lu_bu', petTypes: ['CHAOS', 'TIME'], note: '混沌觉醒与强攻' },
  { id: 'preset_balanced', name: '均衡成长流', icon: '⚖️', main: 'sect', breathing: 'wind', sectHint: 11, general: 'sun_ce', petTypes: ['NORMAL', 'FIGHT'], note: '平衡发展新手推荐' },
];

export function getUnlockedCrossSystems(badgeCount) {
  const unlocked = new Set(['pet']);
  CROSS_SYSTEM_UNLOCK.forEach(s => {
    if (badgeCount >= s.badges) s.systems.forEach(sys => unlocked.add(sys));
  });
  return [...unlocked];
}

export function getBreathingStyle(id) {
  return BREATHING_PVE_STYLES[id] || null;
}

const KW_POSITION_BONUSES = {
  kw_vanguard: { bossMultReduce: 0.04 },
  kw_guard: { protectBonus: 0.08 },
  kw_strategist: { purifyBonus: 3 },
  kw_logistics: { captureBonus: 0.05 },
  kw_scout: { escapeTurnReduce: 1 },
  kw_spirit: { purifyBonus: 4 },
  kw_sealer: { purifyBonus: 5 },
  kw_night: { bossMultReduce: 0.03 },
};

/** 跨体系 PVE 加成（叠加 fusion 加成，有上限） */
export function calcCrossSystemPveBonuses(ctx = {}) {
  const bonuses = { purifyBonus: 0, protectBonus: 0, captureBonus: 0, escapeTurnReduce: 0, bossMultReduce: 0, skipPuzzleStep: false, skipExploreStep: false, nightBonus: false, exploreSpeedBonus: 0, puzzleHintBonus: false };
  const style = ctx.playerStyle || {};
  if (style.main === 'ninja' && style.sub !== 'ninja') bonuses.purifyBonus += 4;
  if (style.main === 'breathing' || style.sub === 'breathing') {
    const br = getBreathingStyle(style.breathingStyle || 'water');
    if (br?.passive) {
      bonuses.purifyBonus += br.passive.purifyBonus || 0;
      bonuses.protectBonus += br.passive.protectBonus || 0;
      bonuses.captureBonus += br.passive.captureBonus || 0;
      bonuses.escapeTurnReduce += br.passive.escapeTurnReduce || 0;
      bonuses.bossMultReduce += br.passive.bossMultReduce || 0;
      if (br.passive.skipPuzzleStep) bonuses.skipPuzzleStep = true;
      if (br.passive.skipExploreStep) bonuses.skipExploreStep = true;
      if (br.passive.exploreSpeedBonus) bonuses.exploreSpeedBonus += br.passive.exploreSpeedBonus;
      if (br.passive.puzzleHintBonus) bonuses.puzzleHintBonus = true;
    }
    if (br?.ecoPenalty) bonuses.ecoPenalty = br.ecoPenalty;
  }
  if (ctx.nightBattle) {
    if (style.breathingStyle === 'mist') {
      bonuses.purifyBonus += 10;
      bonuses.bossMultReduce += 0.05;
      bonuses.nightBonus = true;
    } else if (style.main === 'breathing') {
      bonuses.purifyBonus += 5;
      bonuses.bossMultReduce += 0.02;
      bonuses.nightBonus = true;
    }
  }
  if (ctx.kwPosition && KW_POSITION_BONUSES[ctx.kwPosition]) {
    const posBonus = KW_POSITION_BONUSES[ctx.kwPosition];
    bonuses.purifyBonus += posBonus.purifyBonus || 0;
    bonuses.protectBonus += posBonus.protectBonus || 0;
    bonuses.captureBonus += posBonus.captureBonus || 0;
    bonuses.escapeTurnReduce += posBonus.escapeTurnReduce || 0;
    bonuses.bossMultReduce += posBonus.bossMultReduce || 0;
  }
  bonuses.purifyBonus = Math.min(35, bonuses.purifyBonus);
  bonuses.bossMultReduce = Math.min(0.15, bonuses.bossMultReduce);
  bonuses.protectBonus = Math.min(0.35, bonuses.protectBonus);
  bonuses.captureBonus = Math.min(0.3, bonuses.captureBonus);
  return bonuses;
}

export function mergePveBonuses(fusionBonuses = {}, crossBonuses = {}) {
  return {
    purifyBonus: Math.min(50, (fusionBonuses.purifyBonus || 0) + (crossBonuses.purifyBonus || 0)),
    protectBonus: Math.min(0.45, (fusionBonuses.protectBonus || 0) + (crossBonuses.protectBonus || 0)),
    captureBonus: Math.min(0.35, (fusionBonuses.captureBonus || 0) + (crossBonuses.captureBonus || 0)),
    escapeTurnReduce: Math.min(3, (fusionBonuses.escapeTurnReduce || 0) + (crossBonuses.escapeTurnReduce || 0)),
    bossMultReduce: Math.min(0.2, (fusionBonuses.bossMultReduce || 0) + (crossBonuses.bossMultReduce || 0)),
    skipPuzzleStep: !!(fusionBonuses.skipPuzzleStep || crossBonuses.skipPuzzleStep),
    skipExploreStep: !!(fusionBonuses.skipExploreStep || crossBonuses.skipExploreStep),
    nightBonus: !!crossBonuses.nightBonus,
    ecoPenalty: crossBonuses.ecoPenalty || null,
    exploreSpeedBonus: Math.min(1.0, crossBonuses.exploreSpeedBonus || 0),
    puzzleHintBonus: !!crossBonuses.puzzleHintBonus,
  };
}
