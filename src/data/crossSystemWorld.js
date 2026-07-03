/** v15.0 跨体系大世界玩法框架 — 忍术/果实/呼吸法/门派/国战融合 */

import { FUSION_UNLOCK_SCHEDULE } from './systemFusion';

/** 五层构筑定位 */
export const PLAYER_BUILD_LAYERS = [
  { id: 'pets', name: '精灵队伍', icon: '🐾', desc: '核心战斗与探索单位' },
  { id: 'player_style', name: '玩家流派', icon: '🧑', desc: '主修忍者/呼吸法/武修，副修一项' },
  { id: 'devil_fruit', name: '恶魔果实', icon: '🍎', desc: '绑定精灵，改变规则（每精灵1枚）' },
  { id: 'sect', name: '门派心法', icon: '📜', desc: '长期成长与副本解法差异' },
  { id: 'nation', name: '国家与将魂', icon: '🏰', desc: '宏观战略与 PVE 战术' },
];

/** 玩家本体流派：只影响 PVE 解法，不直接改战斗面板 */
export const PLAYER_STYLES = {
  trainer: { id: 'trainer', name: '精灵指挥流', icon: '🔴', source: '精灵', desc: '围绕队伍配置、属性克制与伙伴协作', pveFocus: ['捕获', '守护', '稳定'] },
  ninja: { id: 'ninja', name: '忍者流', icon: '🍥', source: '忍术', desc: '结印、分身、封印、潜入', pveFocus: ['净化', '解谜', '潜行'] },
  breathing: { id: 'breathing', name: '呼吸法流', icon: '🌀', source: '呼吸法', desc: '连段、爆发、夜战斩鬼', pveFocus: ['首领', '夜战', '守护'] },
  fruit: { id: 'fruit', name: '果实规则流', icon: '🍎', source: '果实', desc: '利用果实规则处理特殊战场与首领机制', pveFocus: ['首领', '捕获', '机关'] },
  sect: { id: 'sect', name: '武修流', icon: '🥋', source: '门派', desc: '心法、防守、持续作战', pveFocus: ['守护', '国战', '生态'] },
  commander: { id: 'commander', name: '国战统御流', icon: '🏰', source: '名将/国战', desc: '用职位、名将和后勤资源提高战役效率', pveFocus: ['国战', '护送', '资源'] },
};

/** 呼吸法 PVE 战术（轻量，不改战斗属性） */
export const BREATHING_PVE_STYLES = {
  water: { id: 'water', name: '水之呼吸', icon: '🌊', passive: { protectBonus: 0.12, purifyBonus: 5 }, bestFor: ['守护', '持久战'] },
  fire: { id: 'fire', name: '炎之呼吸', icon: '🔥', passive: { bossMultReduce: 0.06, purifyBonus: 8 }, ecoPenalty: { vegetation: -1 }, bestFor: ['首领', '爆发'] },
  thunder: { id: 'thunder', name: '雷之呼吸', icon: '⚡', passive: { bossMultReduce: 0.06, escapeTurnReduce: 1 }, bestFor: ['斩杀', '打断'] },
  wind: { id: 'wind', name: '风之呼吸', icon: '🌀', passive: { captureBonus: 0.1, exploreSpeedBonus: 0.5 }, bestFor: ['群战', '机动'] },
  stone: { id: 'stone', name: '岩之呼吸', icon: '🪨', passive: { protectBonus: 0.14, bossMultReduce: 0.04 }, bestFor: ['守护', '攻城'] },
  flower: { id: 'flower', name: '花之呼吸', icon: '🌸', passive: { purifyBonus: 4, captureBonus: 0.08 }, bestFor: ['安抚', '结契'] },
  beast: { id: 'beast', name: '兽之呼吸', icon: '🐗', passive: { bossMultReduce: 0.04, escapeTurnReduce: 1, exploreSpeedBonus: 0.3 }, bestFor: ['追猎', '突袭'] },
  insect: { id: 'insect', name: '蟲之呼吸', icon: '🦋', passive: { captureBonus: 0.15, purifyBonus: 6 }, bestFor: ['弱点', '斩鬼'] },
  mist: { id: 'mist', name: '霞之呼吸', icon: '🌫️', passive: { puzzleHintBonus: true, captureBonus: 0.12 }, bestFor: ['潜行', '夜战'] },
  sun: { id: 'sun', name: '日之呼吸', icon: '☀️', passive: { bossMultReduce: 0.08, purifyBonus: 6 }, ecoPenalty: { heat: 1 }, bestFor: ['终局首领', '破局'] },
  moon: { id: 'moon', name: '月之呼吸', icon: '🌙', passive: { puzzleHintBonus: true, bossMultReduce: 0.05, captureBonus: 0.06 }, bestFor: ['夜战', '解谜'] },
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
  { id: 'tpl_ghost_night', name: '国土鬼夜灵灾', icon: '🌙', systems: ['呼吸法', '忍术', '门派', '国战'], summary: '白天调查→黄昏布防→夜晚斩鬼与封印' },
  { id: 'tpl_seastone_port', name: '海楼石港口争夺', icon: '⚓', systems: ['恶魔果实', '忍术', '国战', '名将'], summary: '果实受限海域，港口与国战航线' },
  { id: 'tpl_tailed_seal', name: '尾兽级封印战', icon: '⛩️', systems: ['忍术', '呼吸法', '果实', '国战'], summary: '多人封印阵，查克拉节点与破尾' },
  { id: 'tpl_sect_kw', name: '门派国战争夺', icon: '📜', systems: ['门派', '国战', '名将'], summary: '遗迹控制权决定设施类型' },
  { id: 'tpl_demon_fruit', name: '鬼果融合事件', icon: '👹', systems: ['呼吸法', '忍术', '果实', '门派'], summary: '鬼化+果实，净化/封印/击杀多结局' },
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
  { id: 'kw_beastmaster', name: '御兽使', icon: '🐾', sectBias: [5, 7], styleBias: ['trainer', 'sect'] },
  { id: 'kw_engineer', name: '工造官', icon: '⚙️', sectBias: [10, 2], styleBias: ['fruit', 'commander'] },
  { id: 'kw_mediator', name: '抚民使', icon: '🕊️', sectBias: [7, 11], styleBias: ['trainer', 'commander'] },
  { id: 'kw_raider', name: '奇袭将', icon: '🗡️', sectBias: [3, 6], styleBias: ['ninja', 'fruit'] },
];

/** 推荐构筑模板 */
export const BUILD_PRESETS = [
  { id: 'preset_balanced', name: '冠军均衡流', icon: '🔴', main: 'trainer', sub: 'sect', breathing: 'water', kwPosition: 'kw_beastmaster', sectHint: 11, general: 'liu_bei', petTypes: ['NORMAL', 'FIGHT', 'GRASS'], difficulty: '入门', note: '精灵为核心，稳定推进图鉴、守护和安抚' },
  { id: 'preset_capture', name: '图鉴捕获流', icon: '📚', main: 'trainer', sub: 'ninja', breathing: 'wind', kwPosition: 'kw_scout', sectHint: 5, general: 'yang_hu', petTypes: ['FAIRY', 'GRASS', 'FLYING'], difficulty: '入门', note: '提高捕获和探索效率，适合补图鉴' },
  { id: 'preset_water_heal', name: '水系净化流', icon: '💧', main: 'sect', sub: 'trainer', breathing: 'water', kwPosition: 'kw_logistics', sectHint: 7, general: 'hua_tuo', petTypes: ['WATER', 'GRASS'], difficulty: '稳健', note: '鬼化净化、后勤和长线守护更舒服' },
  { id: 'preset_spirit', name: '精灵守护流', icon: '🌿', main: 'trainer', sub: 'sect', breathing: 'flower', kwPosition: 'kw_spirit', sectHint: 5, general: 'liu_bei', petTypes: ['FAIRY', 'GRASS', 'HEAL'], difficulty: '稳健', note: '结契、安抚、生态修复路线' },
  { id: 'preset_fire_burst', name: '火攻爆发流', icon: '🔥', main: 'breathing', sub: 'commander', breathing: 'fire', kwPosition: 'kw_vanguard', sectHint: 6, general: 'zhou_yu', petTypes: ['FIRE', 'DRAGON'], difficulty: '进阶', note: 'Boss 和群怪压制强，生态任务需控火' },
  { id: 'preset_siege', name: '国战防守流', icon: '🧱', main: 'commander', sub: 'sect', breathing: 'stone', kwPosition: 'kw_guard', sectHint: 2, general: 'cao_cao', petTypes: ['STEEL', 'ROCK'], difficulty: '稳健', note: '城防、护送和资源任务的低风险路线' },
  { id: 'preset_mechanic', name: '机械策略流', icon: '⚙️', main: 'fruit', sub: 'ninja', breathing: 'thunder', kwPosition: 'kw_engineer', sectHint: 10, general: 'zhuge_liang', petTypes: ['ELECTRIC', 'STEEL'], difficulty: '进阶', note: '遗迹、机关、砂核和打断路线' },
  { id: 'preset_shadow', name: '暗影潜入流', icon: '🌑', main: 'ninja', sub: 'breathing', breathing: 'mist', kwPosition: 'kw_night', sectHint: 8, general: 'sima_yi', petTypes: ['DARK', 'GHOST'], difficulty: '进阶', note: '夜战、潜入、黑暗地图和解谜' },
  { id: 'preset_venom', name: '弱点毒封流', icon: '🦋', main: 'ninja', sub: 'fruit', breathing: 'insect', kwPosition: 'kw_sealer', sectHint: 8, general: 'pang_tong', petTypes: ['POISON', 'BUG', 'DARK'], difficulty: '进阶', note: '不靠纯伤害，靠弱点、封印和捕获推进' },
  { id: 'preset_raid', name: '奇袭追猎流', icon: '🐺', main: 'fruit', sub: 'ninja', breathing: 'beast', kwPosition: 'kw_raider', sectHint: 3, general: 'gan_ning', petTypes: ['DARK', 'FIGHT', 'FLYING'], difficulty: '高压', note: '高机动突袭，适合限时和逃脱任务' },
  { id: 'preset_formation', name: '八阵控场流', icon: '🧠', main: 'commander', sub: 'ninja', breathing: 'moon', kwPosition: 'kw_strategist', sectHint: 10, general: 'zhuge_liang', petTypes: ['PSYCHIC', 'STEEL'], difficulty: '进阶', note: '解谜、封印、国战调度和控场' },
  { id: 'preset_duel', name: '一骑决斗流', icon: '🐉', main: 'breathing', sub: 'fruit', breathing: 'thunder', kwPosition: 'kw_vanguard', sectHint: 4, general: 'guan_yu', petTypes: ['ELECTRIC', 'FIGHT', 'DRAGON'], difficulty: '高压', note: '单体首领和斩将强，守护任务需补坦度' },
  { id: 'preset_chaos', name: '混沌掌控流', icon: '🌀', main: 'fruit', sub: 'breathing', breathing: 'sun', kwPosition: 'kw_vanguard', sectHint: 4, general: 'lu_bu', petTypes: ['CHAOS', 'TIME'], difficulty: '高压', note: '终局爆发强，但对队伍练度要求高' },
  { id: 'preset_mediator', name: '仁政调停流', icon: '🕊️', main: 'commander', sub: 'trainer', breathing: 'flower', kwPosition: 'kw_mediator', sectHint: 7, general: 'yang_hu', petTypes: ['FAIRY', 'WATER', 'GRASS'], difficulty: '稳健', note: '低战损完成安抚、后勤和生态任务' },
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
  kw_beastmaster: { captureBonus: 0.06, protectBonus: 0.04 },
  kw_engineer: { purifyBonus: 2, bossMultReduce: 0.03 },
  kw_mediator: { purifyBonus: 3, captureBonus: 0.04 },
  kw_raider: { escapeTurnReduce: 1, bossMultReduce: 0.02 },
};

const STYLE_PVE_BONUSES = {
  trainer: { captureBonus: 0.06, protectBonus: 0.04, purifyBonus: 2 },
  ninja: { purifyBonus: 4, exploreSpeedBonus: 0.25 },
  breathing: { bossMultReduce: 0.02 },
  fruit: { captureBonus: 0.04, bossMultReduce: 0.03 },
  sect: { protectBonus: 0.06, purifyBonus: 2 },
  commander: { protectBonus: 0.04, purifyBonus: 2 },
};

function applyScaledBonuses(target, source = {}, scale = 1) {
  target.purifyBonus += Math.round((source.purifyBonus || 0) * scale);
  target.protectBonus += (source.protectBonus || 0) * scale;
  target.captureBonus += (source.captureBonus || 0) * scale;
  target.escapeTurnReduce += Math.floor((source.escapeTurnReduce || 0) * scale);
  target.bossMultReduce += (source.bossMultReduce || 0) * scale;
  target.exploreSpeedBonus += (source.exploreSpeedBonus || 0) * scale;
  if (source.skipPuzzleStep && scale >= 1) target.skipPuzzleStep = true;
  if (source.skipExploreStep && scale >= 1) target.skipExploreStep = true;
  if (source.puzzleHintBonus && scale >= 1) target.puzzleHintBonus = true;
}

/** 跨体系 PVE 加成（叠加 fusion 加成，有上限） */
export function calcCrossSystemPveBonuses(ctx = {}) {
  const bonuses = { purifyBonus: 0, protectBonus: 0, captureBonus: 0, escapeTurnReduce: 0, bossMultReduce: 0, skipPuzzleStep: false, skipExploreStep: false, nightBonus: false, exploreSpeedBonus: 0, puzzleHintBonus: false };
  const style = ctx.playerStyle || {};
  applyScaledBonuses(bonuses, STYLE_PVE_BONUSES[style.main], 1);
  if (style.sub && style.sub !== style.main) applyScaledBonuses(bonuses, STYLE_PVE_BONUSES[style.sub], 0.5);
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
    if (style.breathingStyle === 'mist' || style.breathingStyle === 'moon') {
      bonuses.purifyBonus += style.breathingStyle === 'mist' ? 10 : 6;
      bonuses.bossMultReduce += style.breathingStyle === 'mist' ? 0.05 : 0.03;
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
  if ((style.main === 'trainer' && style.sub === 'sect') || (style.main === 'sect' && style.sub === 'trainer')) {
    bonuses.protectBonus += 0.03;
    bonuses.captureBonus += 0.03;
  }
  if ((style.main === 'ninja' && style.sub === 'fruit') || (style.main === 'fruit' && style.sub === 'ninja')) {
    bonuses.captureBonus += 0.04;
  }
  if ((style.main === 'commander' && style.sub === 'ninja') || (style.main === 'ninja' && style.sub === 'commander')) {
    bonuses.purifyBonus += 2;
    bonuses.puzzleHintBonus = true;
  }
  if ((style.main === 'breathing' && style.sub === 'fruit') || (style.main === 'fruit' && style.sub === 'breathing')) {
    bonuses.bossMultReduce += 0.02;
  }
  bonuses.purifyBonus = Math.min(35, bonuses.purifyBonus);
  bonuses.bossMultReduce = Math.min(0.15, bonuses.bossMultReduce);
  bonuses.protectBonus = Math.min(0.35, bonuses.protectBonus);
  bonuses.captureBonus = Math.min(0.3, bonuses.captureBonus);
  bonuses.escapeTurnReduce = Math.min(2, bonuses.escapeTurnReduce);
  bonuses.exploreSpeedBonus = Math.min(1.0, bonuses.exploreSpeedBonus || 0);
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
