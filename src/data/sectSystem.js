/** 武侠门派系统 v15.0 — 玩家身份、心法、武学、共鸣、国战、江湖事件 */
import { SECT_DB, SECT_COUNT } from './sects';
import {
  SECT_MARTIAL_ARTS_EXTENDED,
  SECT_XINFA_EXTENDED,
  SECT_PET_RESONANCE_EXTENDED,
  SECT_FACTION_LEAN_EXTENDED,
  SECT_ARCHETYPE_EXTENDED,
  SECT_COMBO_SKILLS_EXTENDED,
  SECT_REALM_BY_SECT_EXTENDED,
  SECT_TYPE_WEIGHTS_PATCH,
} from './sectSystemExtended';

function mergeTypeWeights(base, patch) {
  const merged = { ...base };
  for (const [type, sids] of Object.entries(patch || {})) {
    merged[type] = [...new Set([...(merged[type] || []), ...sids])];
  }
  return merged;
}

export const SECT_JOIN_REQ_BADGES = 3;
export const SECT_SUB_SECT_REQ_RANK = 5;
export const SECT_SWITCH_REP_COST = 1500;

export const SECT_RANKS = [
  { rank: 1, name: '记名弟子', need: 0, unlocks: ['基础任务', '门派商店'] },
  { rank: 2, name: '外门弟子', need: 200, unlocks: ['初级心法', '低阶武学'] },
  { rank: 3, name: '内门弟子', need: 600, unlocks: ['门派秘境', '阵容加成'] },
  { rank: 4, name: '亲传弟子', need: 1200, unlocks: ['门派绝技', '专属剧情'] },
  { rank: 5, name: '护法', need: 2000, unlocks: ['江湖事件', '副修门派'] },
  { rank: 6, name: '长老', need: 3500, unlocks: ['高级心法', '帮派联动'] },
  { rank: 7, name: '掌门候选', need: 5500, unlocks: ['终极试炼', '镇派绝学'] },
  { rank: 8, name: '代掌门', need: 8000, unlocks: ['门派立场', '国战选择'] },
];

export const SECT_RESOURCE_LABELS = {
  reputation: '门派声望',
  contribution: '门派贡献',
  scrollPage: '武学残页',
  qiEssence: '心法真气',
  masterToken: '掌门令',
};

export const DEFAULT_SECT_RESOURCES = {
  reputation: 0,
  contribution: 0,
  scrollPage: 0,
  qiEssence: 0,
  masterToken: 0,
};

export const DEFAULT_SECT_PLAYER_STATE = {
  playerSect: null,
  playerSubSect: null,
  sectRank: 0,
  sectResources: { ...DEFAULT_SECT_RESOURCES },
  sectXinfaLevels: {},
  sectMartialArts: [],
  sectEventLog: [],
  sectDailyDate: '',
  sectDailyTasks: [],
  sectStances: {},
  sectRealmProgress: {},
  sectChiefTrials: [],
};

const mkArts = (sectId, basic, adv, ult, final_) => [
  { id: `s${sectId}_basic`, sectId, tier: 'basic', needRank: 2, ...basic },
  { id: `s${sectId}_adv`, sectId, tier: 'advanced', needRank: 3, ...adv },
  { id: `s${sectId}_ult`, sectId, tier: 'ultimate', needRank: 5, ...ult },
  { id: `s${sectId}_final`, sectId, tier: 'final', needRank: 7, needTrial: true, ...final_ },
];

export const SECT_MARTIAL_ARTS = {
  1: mkArts(1,
    { name: '清风剑', type: 'WIND', power: 60, pp: 20, scrollCost: 0, momentumGain: 8, desc: '速度越高伤害略增' },
    { name: '御剑飞仙', type: 'FLYING', power: 85, pp: 12, scrollCost: 80, momentumGain: 12, desc: '对破防目标伤害+30%' },
    { name: '万剑归宗', type: 'WIND', power: 120, pp: 5, scrollCost: 400, momentumCost: 60, desc: '多段剑气，飞行精灵在场追加' },
    { name: '剑冢破势', type: 'FIGHT', power: 150, pp: 3, scrollCost: 1200, momentumCost: 100, desc: '无视部分护盾' },
  ),
  2: mkArts(2,
    { name: '罗汉拳', type: 'FIGHT', power: 55, pp: 22, scrollCost: 0, momentumGain: 6, desc: '命中后小幅减伤一回合' },
    { name: '金刚伏魔', type: 'FIGHT', power: 80, pp: 14, scrollCost: 80, momentumGain: 10, desc: '对高攻敌人额外伤害' },
    { name: '不动明王身', type: 'STEEL', power: 110, pp: 5, scrollCost: 400, momentumCost: 65, desc: '大幅减伤并吸引攻击' },
    { name: '金钟破邪', type: 'FIGHT', power: 130, pp: 3, scrollCost: 1200, momentumCost: 95, desc: '护盾期间反弹强化' },
  ),
  3: mkArts(3,
    { name: '风刃步', type: 'WIND', power: 50, pp: 24, scrollCost: 0, momentumGain: 10, desc: '闪避后下次攻击增伤' },
    { name: '幻影击', type: 'FLYING', power: 75, pp: 15, scrollCost: 80, momentumGain: 14, desc: '速度差越大伤害越高' },
    { name: '凌波幻影', type: 'WIND', power: 105, pp: 6, scrollCost: 400, momentumCost: 50, desc: '概率使敌方攻击落空' },
    { name: '逍遥无极', type: 'PSYCHIC', power: 125, pp: 3, scrollCost: 1200, momentumCost: 90, desc: '闪避后追加风刃' },
  ),
  4: mkArts(4,
    { name: '毒针', type: 'POISON', power: 45, pp: 25, scrollCost: 0, momentumGain: 8, desc: '概率中毒并叠标记' },
    { name: '暴雨梨花', type: 'DARK', power: 70, pp: 14, scrollCost: 80, momentumGain: 15, desc: '暴击时追加暗器' },
    { name: '千机暗阵', type: 'POISON', power: 110, pp: 5, scrollCost: 400, momentumCost: 65, desc: '优先攻击被标记目标' },
    { name: '暗器绝阵', type: 'DARK', power: 140, pp: 3, scrollCost: 1200, momentumCost: 100, desc: '引爆所有暗器标记' },
  ),
  5: mkArts(5,
    { name: '回春掌', type: 'GRASS', power: 40, pp: 20, scrollCost: 0, momentumGain: 6, healRatio: 0.15, desc: '攻击同时恢复己方' },
    { name: '百草针', type: 'FAIRY', power: 65, pp: 16, scrollCost: 80, momentumGain: 10, healRatio: 0.2, desc: '清除一个负面状态' },
    { name: '九转还魂', type: 'HEAL', power: 0, pp: 4, scrollCost: 400, momentumCost: 70, healRatio: 0.45, desc: '复苏濒死队友' },
    { name: '长生无极', type: 'GRASS', power: 90, pp: 4, scrollCost: 1200, momentumCost: 85, healRatio: 0.35, desc: '全队恢复并解毒' },
  ),
  6: mkArts(6,
    { name: '圣火掌', type: 'FIRE', power: 65, pp: 20, scrollCost: 0, momentumGain: 9, burnChance: 0.2, desc: '概率灼伤' },
    { name: '烈焰冲击', type: 'FIRE', power: 90, pp: 12, scrollCost: 80, momentumGain: 12, burnChance: 0.35, desc: '对灼伤目标伤害+25%' },
    { name: '圣火燎原', type: 'FIRE', power: 125, pp: 4, scrollCost: 400, momentumCost: 70, burnChance: 0.5, desc: '全场点燃' },
    { name: '明尊降世', type: 'FIRE', power: 140, pp: 2, scrollCost: 1200, momentumCost: 100, burnChance: 0.6, desc: '灼烧死亡扩散' },
  ),
  7: mkArts(7,
    { name: '寒霜指', type: 'ICE', power: 55, pp: 22, scrollCost: 0, momentumGain: 7, freezeChance: 0.12, desc: '概率减速' },
    { name: '冰封诀', type: 'ICE', power: 82, pp: 14, scrollCost: 80, momentumGain: 11, freezeChance: 0.2, desc: '对减速目标伤害+20%' },
    { name: '冰封万里', type: 'ICE', power: 115, pp: 5, scrollCost: 400, momentumCost: 60, desc: '概率冻结全场' },
    { name: '昆仑绝寒', type: 'WATER', power: 135, pp: 3, scrollCost: 1200, momentumCost: 95, desc: '生成冰域地形' },
  ),
  8: mkArts(8,
    { name: '蛊毒手', type: 'POISON', power: 50, pp: 24, scrollCost: 0, momentumGain: 8, poisonChance: 0.25, desc: '叠毒层' },
    { name: '蛛网缚', type: 'BUG', power: 72, pp: 15, scrollCost: 80, momentumGain: 10, poisonChance: 0.3, desc: '降低敌方治疗' },
    { name: '万蛊噬心', type: 'POISON', power: 108, pp: 5, scrollCost: 400, momentumCost: 65, desc: '引爆毒层' },
    { name: '五毒归元', type: 'DARK', power: 138, pp: 3, scrollCost: 1200, momentumCost: 100, desc: '毒雾传播' },
  ),
  9: mkArts(9,
    { name: '打狗棒法', type: 'FIGHT', power: 58, pp: 22, scrollCost: 0, momentumGain: 8, desc: '连击同一目标破甲' },
    { name: '降龙掌', type: 'FIGHT', power: 88, pp: 12, scrollCost: 80, momentumGain: 14, desc: '对护盾目标额外破甲' },
    { name: '降龙十八掌', type: 'FIGHT', power: 120, pp: 5, scrollCost: 400, momentumCost: 70, desc: '多段重击' },
    { name: '天下无狗', type: 'GROUND', power: 145, pp: 3, scrollCost: 1200, momentumCost: 95, desc: '格斗精灵协同攻击' },
  ),
  10: mkArts(10,
    { name: '机关弹', type: 'STEEL', power: 52, pp: 22, scrollCost: 0, momentumGain: 7, desc: '识破一个弱点' },
    { name: '天机推演', type: 'PSYCHIC', power: 78, pp: 14, scrollCost: 80, momentumGain: 11, desc: '攻击弱点伤害+25%' },
    { name: '天机百解', type: 'STEEL', power: 112, pp: 5, scrollCost: 400, momentumCost: 60, desc: '暴露敌方弱点' },
    { name: '万象机关', type: 'ELECTRIC', power: 142, pp: 3, scrollCost: 1200, momentumCost: 95, desc: '机械Boss护盾削弱' },
  ),
  11: mkArts(11,
    { name: '紫霞剑气', type: 'PSYCHIC', power: 62, pp: 20, scrollCost: 0, momentumGain: 9, desc: '蓄力紫霞真气' },
    { name: '夺命连环剑', type: 'FIGHT', power: 86, pp: 12, scrollCost: 80, momentumGain: 13, desc: '对单体Boss破防' },
    { name: '独孤破势', type: 'PSYCHIC', power: 118, pp: 5, scrollCost: 400, momentumCost: 68, desc: '先削盾再伤害' },
    { name: '紫霞破云', type: 'WIND', power: 148, pp: 3, scrollCost: 1200, momentumCost: 100, desc: '剑气宗终极一击' },
  ),
  12: mkArts(12,
    { name: '太极推手', type: 'WATER', power: 48, pp: 24, scrollCost: 0, momentumGain: 8, reflectBoost: 0.05, desc: '受击概率反击' },
    { name: '两仪剑', type: 'PSYCHIC', power: 76, pp: 14, scrollCost: 80, momentumGain: 12, reflectBoost: 0.08, desc: '反击获护盾' },
    { name: '太极两仪阵', type: 'WATER', power: 100, pp: 6, scrollCost: 400, momentumCost: 65, desc: '伤害转化为反击' },
    { name: '真武无极', type: 'FAIRY', power: 132, pp: 3, scrollCost: 1200, momentumCost: 90, desc: '两仪阵持续强化' },
  ),
};

Object.assign(SECT_MARTIAL_ARTS, SECT_MARTIAL_ARTS_EXTENDED);

export const SECT_XINFA = {
  1: { name: '蜀山剑意', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'spd_atk', desc: '速度+5%，10%追加剑气' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'kill_chain', desc: '击败敌人后追加飞剑' },
  ]},
  2: { name: '金刚不坏', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'shield_open', desc: '开场获得护盾，暴击伤害-8%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'low_hp_guard', desc: '低血时额外减伤15%' },
  ]},
  3: { name: '逍遥游', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'dodge_stack', desc: '闪避成功叠逍遥层，下次技能+12%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'control_resist', desc: '被控制时30%概率解除' },
  ]},
  4: { name: '千机暗劲', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'mark_stack', desc: '暴击叠暗器标记' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'mark_burst', desc: '标记满层引爆' },
  ]},
  5: { name: '长生诀', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'heal_boost', desc: '治疗效果+15%，濒死保留1HP一次' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'purify_touch', desc: '治疗低血目标额外恢复' },
  ]},
  6: { name: '圣火心诀', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'burn_stack', desc: '灼伤叠层，火伤+10%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'burn_spread', desc: '低血时火系伤害+20%' },
  ]},
  7: { name: '昆仑寒玉功', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'slow_boost', desc: '对减速目标伤害+15%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'freeze_field', desc: '冻结时回复真气(气势)' },
  ]},
  8: { name: '万毒归心', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'poison_amplify', desc: '中毒伤害+20%，敌方治疗-15%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'poison_burst', desc: '毒层满爆发' },
  ]},
  9: { name: '降龙伏虎', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'combo_armor', desc: '连击同一目标破甲+8%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'morale_boost', desc: '队伍完整时士气+10%攻防' },
  ]},
  10: { name: '天机推演', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'weakpoint', desc: '开战识破弱点，弱点伤害+18%' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'expose_all', desc: '机关战解谜效率+，Boss护盾-10%' },
  ]},
  11: { name: '紫霞神功', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'purple_qi', desc: '每回合积累紫霞真气' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'boss_break', desc: '对Boss破防值+15%' },
  ]},
  12: { name: '太极玄功', tiers: [
    { tier: 1, name: '初阶', qiCost: 0, needRank: 1, effectKey: 'base' },
    { tier: 2, name: '中阶', qiCost: 500, needRank: 3, effectKey: 'reflect_shield', desc: '反击时获护盾' },
    { tier: 3, name: '高阶', qiCost: 1500, needRank: 6, effectKey: 'high_atk_counter', desc: '对高攻敌人反击伤害+25%' },
  ]},
};

Object.assign(SECT_XINFA, SECT_XINFA_EXTENDED);

export const SECT_PET_RESONANCE = {
  1:  { types: ['WIND', 'DRAGON', 'FLYING'], bonus: { atk: 1.10, spd: 1.05 } },
  2:  { types: ['ROCK', 'GROUND', 'STEEL'], bonus: { def: 1.10, hp: 1.05 } },
  3:  { types: ['WIND', 'FLYING', 'PSYCHIC'], bonus: { spd: 1.10, s_atk: 1.04 } },
  4:  { types: ['POISON', 'DARK'], bonus: { critRate: 8, atk: 1.05 } },
  5:  { types: ['GRASS', 'LIGHT', 'HEAL', 'FAIRY'], bonus: { hp: 1.10, def: 1.05 } },
  6:  { types: ['FIRE'], bonus: { atk: 1.10, spd: 1.03 } },
  7:  { types: ['ICE', 'WATER'], bonus: { s_atk: 1.08, s_def: 1.04 } },
  8:  { types: ['POISON', 'BUG', 'DARK'], bonus: { atk: 1.08, spd: 1.04 } },
  9:  { types: ['FIGHT', 'GROUND'], bonus: { hp: 1.08, def: 1.06 } },
  10: { types: ['ELECTRIC', 'STEEL'], bonus: { s_atk: 1.10, spd: 1.04 } },
  11: { types: ['WIND', 'PSYCHIC'], bonus: { s_atk: 1.10, critRate: 5 } },
  12: { types: ['WATER', 'PSYCHIC', 'FAIRY'], bonus: { s_def: 1.10, hp: 1.04 } },
};

Object.assign(SECT_PET_RESONANCE, SECT_PET_RESONANCE_EXTENDED);

export const SECT_TYPE_WEIGHTS = mergeTypeWeights({
  FIRE: [6, 1, 11], WATER: [12, 5, 7], GRASS: [5, 8], ELECTRIC: [10, 4],
  ICE: [7, 12], FIGHT: [2, 9, 11], PSYCHIC: [10, 11, 12, 3], DARK: [4, 8],
  DRAGON: [1, 6], STEEL: [2, 10], FAIRY: [5, 11], NORMAL: [9, 12],
  WIND: [1, 3, 11], LIGHT: [5, 6], COSMIC: [10, 1], SOUND: [11, 3],
  TIME: [10, 12], CHAOS: [4, 8], HEAL: [5], GOD: [2, 12],
  POISON: [8, 4], GROUND: [2, 9], FLYING: [1, 3], BUG: [8],
  ROCK: [2, 7], GHOST: [4, 8],
}, SECT_TYPE_WEIGHTS_PATCH);

export const SECT_FACTION_LEAN = {
  1: { default: 'shu', changeable: true, kwBonus: { attack: 0.06, label: '剑修攻坚' } },
  2: { default: 'shu', changeable: true, kwBonus: { defense: 0.10, label: '城池防守' } },
  3: { default: null, changeable: true, kwBonus: { mobility: 0.08, label: '快速支援' } },
  4: { default: 'jin', changeable: true, kwBonus: { sabotage: 0.07, label: '暗杀破坏' } },
  5: { default: 'shu', changeable: true, kwBonus: { morale: 0.08, label: '民心治疗' } },
  6: { default: 'wu', changeable: true, kwBonus: { siege: 0.07, label: '火攻破城' } },
  7: { default: null, changeable: true, kwBonus: { control: 0.06, label: '冰封控场' } },
  8: { default: 'jin', changeable: true, kwBonus: { weaken: 0.06, label: '毒雾削弱' } },
  9: { default: 'shu', changeable: true, kwBonus: { intel: 0.07, label: '民间情报' } },
  10: { default: 'wei', changeable: true, kwBonus: { fortify: 0.08, label: '机关城防' } },
  11: { default: 'wei', changeable: true, kwBonus: { elite: 0.06, label: '剑修精锐' } },
  12: { default: 'shu', changeable: true, kwBonus: { counter: 0.08, label: '太极守城' } },
};

Object.assign(SECT_FACTION_LEAN, SECT_FACTION_LEAN_EXTENDED);

export const SECT_ALLIANCES = {
  righteous: { name: '正派联盟', sects: [1, 2, 5, 9, 11, 12, 17, 19, 26], desc: '守护秩序与精灵共存' },
  neutral: { name: '江湖中立', sects: [3, 7, 10, 21], desc: '根据局势选择立场' },
  shadow: { name: '暗线势力', sects: [4, 6, 8, 13, 14, 15, 16, 18, 20, 22, 23, 24, 25, 27, 28, 29, 30], desc: '手段激进但非必然邪恶' },
};

export const SECT_DAILY_TASK_POOL = [
  { id: 'sect_challenge', name: '门派切磋', desc: '完成1次门派守关或掌门试炼', target: 1, rep: 40, contrib: 25 },
  { id: 'sect_win', name: '以武会友', desc: '赢得2场战斗', target: 2, rep: 35, contrib: 20 },
  { id: 'sect_catch', name: '收容灵兽', desc: '捕捉3只精灵', target: 3, rep: 30, contrib: 15 },
  { id: 'sect_train', name: '勤修苦练', desc: '升级任意精灵门派等级1次', target: 1, rep: 25, contrib: 30 },
  { id: 'sect_contrib', name: '门派贡献', desc: '消费金币修炼或在门派商店购物', target: 500, rep: 20, contrib: 40 },
];

export const SECT_SHOP_ITEMS = [
  { id: 'qi_small', name: '真气丹', cost: 80, resource: 'contribution', grant: { qiEssence: 50 }, desc: '恢复50点心法真气' },
  { id: 'scroll_pack', name: '武学残页×3', cost: 120, resource: 'contribution', grant: { scrollPage: 3 } },
  { id: 'master_token', name: '掌门令', cost: 500, resource: 'contribution', grant: { masterToken: 1 }, needRank: 4 },
  { id: 'rep_boost', name: '门派推荐信', cost: 400, resource: 'contribution', needRank: 3, grant: { reputation: 80 }, desc: '提升门派声望（每日限购1次）', dailyLimit: 1 },
  { id: 'exp_candy_sect', name: '经验糖果×2', cost: 150, resource: 'contribution', itemGrant: 'exp_candy', itemGrantCount: 2, desc: '获得2颗经验糖果' },
  { id: 'ultra_ball', name: '超级球×3', cost: 100, resource: 'contribution', balls: { ultra: 3 } },
];

export const SECT_JIANGHU_EVENTS = [
  { id: 'evt_zhenxie', name: '正邪论剑', icon: '⚔️', weekSlot: 0, sects: [1, 11, 12, 6, 4],
    desc: '华山论剑召开，各派争夺江湖排名。', choices: [
      { id: 'support_right', label: '支持正派', rep: { 1: 80, 2: 60, 11: 60, 12: 60 }, penalty: { 6: -20, 4: -20 } },
      { id: 'support_fire', label: '支持明教', rep: { 6: 100, 4: 40 }, penalty: { 2: -30, 12: -20 } },
      { id: 'mediate', label: '调停论剑', rep: { 3: 80, 12: 50 }, grant: { scrollPage: 2 } },
    ]},
  { id: 'evt_wudu', name: '五毒入侵药王谷', icon: '☠️', weekSlot: 1, sects: [5, 8, 4],
    desc: '药王谷附近精灵中毒，五毒教卷入风波。', choices: [
      { id: 'help_yaowang', label: '帮药王谷解毒', rep: { 5: 120, 2: 30 }, grant: { qiEssence: 80 } },
      { id: 'help_wudu', label: '帮五毒研究', rep: { 8: 100 }, penalty: { eco: -5 } },
      { id: 'investigate', label: '调查黑市嫁祸', rep: { 10: 60, 5: 40, 8: 40 }, grant: { masterToken: 1 } },
    ]},
  { id: 'evt_kunlun', name: '昆仑雪灾', icon: '❄️', weekSlot: 2, sects: [7, 12, 5],
    desc: '寒潮扩散，冻住大量野生精灵。', choices: [
      { id: 'rescue', label: '救助冻僵精灵', rep: { 5: 80, 7: 60 }, grant: { contribution: 50 } },
      { id: 'seal_ice', label: '冰封污染源', rep: { 7: 100, 12: 40 } },
      { id: 'ignore', label: '观望', rep: { 3: 30 } },
    ]},
  { id: 'evt_tangmen', name: '唐门机关失控', icon: '🎯', weekSlot: 3, sects: [4, 10, 2],
    desc: '机关楼暴走，需选择处理方式。', choices: [
      { id: 'smash', label: '暴力破坏', rep: { 2: 50, 9: 40 }, grant: { scrollPage: 3 } },
      { id: 'hack', label: '天机阁破解', rep: { 10: 100, 4: 40 }, grant: { qiEssence: 60 } },
      { id: 'seal', label: '少林封印', rep: { 2: 90, 12: 30 } },
    ]},
  { id: 'evt_mingjiao', name: '明教圣火暴走', icon: '🔥', weekSlot: 4, sects: [6, 7, 12, 5],
    desc: '圣火失控点燃山谷。', choices: [
      { id: 'keep_fire', label: '保留圣火', rep: { 6: 110 }, penalty: { eco: -8 } },
      { id: 'heal_pets', label: '救助受伤精灵', rep: { 5: 90, 9: 30 }, grant: { reputation: 50 } },
      { id: 'freeze_fire', label: '昆仑冰封火源', rep: { 7: 80, 12: 50 } },
    ]},
];

export const SECT_COMBO_SKILLS = {
  '1_11': { name: '剑气合璧', power: 130, type: 'WIND', desc: '蜀山+华山：剑气连击破防' },
  '2_12': { name: '太极金钟', power: 0, type: 'STEEL', desc: '少林+武当：全队护盾+反击', shieldRatio: 0.2 },
  '3_1': { name: '御剑逍遥', power: 110, type: 'FLYING', desc: '逍遥+蜀山：高速剑舞' },
  '4_8': { name: '毒暗双绝', power: 125, type: 'POISON', desc: '唐门+五毒：毒爆+标记' },
  '5_12': { name: '太极回春', power: 0, type: 'HEAL', desc: '药王谷+武当：治疗+净化', healRatio: 0.35 },
  '6_7': { name: '冰火相克', power: 115, type: 'FIRE', desc: '明教+昆仑：灼烧+冻结' },
};

Object.assign(SECT_COMBO_SKILLS, SECT_COMBO_SKILLS_EXTENDED);

export const SECT_REALM_BY_SECT = {
  1: 'sect_jianzhong', 2: 'sect_shaolin', 3: 'sect_xiaoyao', 4: 'sect_tangmen',
  5: 'sect_qingmu', 6: 'sect_yanyang', 7: 'sect_canghai', 8: 'sect_wudu',
  9: 'sect_gaibang', 10: 'sect_xingji', 11: 'sect_huashan', 12: 'sect_wudang',
};

Object.assign(SECT_REALM_BY_SECT, SECT_REALM_BY_SECT_EXTENDED);

export { SECT_COUNT };

export function getSectRankByRep(rep) {
  let rank = 0;
  for (const r of SECT_RANKS) {
    if (rep >= r.need) rank = r.rank;
    else break;
  }
  return rank;
}

export function getSectRankInfo(rank) {
  if (!rank || rank <= 0) return { rank: 0, name: '无门派', need: 0 };
  return SECT_RANKS.find(r => r.rank === rank) || SECT_RANKS[0];
}

export function pickSectIdForPet(petBase, rng = Math.random) {
  const types = [petBase?.type, petBase?.type2, petBase?.secondaryType].filter(Boolean);
  const weights = {};
  for (const t of types) {
    (SECT_TYPE_WEIGHTS[t] || []).forEach((sid, i) => {
      weights[sid] = (weights[sid] || 0) + (3 - i);
    });
  }
  const keys = Object.keys(weights);
  if (keys.length === 0) return Math.floor(rng() * SECT_COUNT) + 1;
  const total = keys.reduce((s, k) => s + weights[k], 0);
  let roll = rng() * total;
  for (const k of keys) {
    roll -= weights[k];
    if (roll <= 0) return parseInt(k, 10);
  }
  return parseInt(keys[0], 10);
}

export function getMartialArtById(artId) {
  for (const arts of Object.values(SECT_MARTIAL_ARTS)) {
    const found = arts.find(a => a.id === artId);
    if (found) return found;
  }
  return null;
}

export function getSectMartialArts(sectId) {
  return SECT_MARTIAL_ARTS[sectId] || [];
}

export function getLearnableMartialArts(sectId, sectRank, learned, isSub = false) {
  const maxTier = isSub ? 'advanced' : 'final';
  const tierOrder = { basic: 1, advanced: 2, ultimate: 3, final: 4 };
  const cap = tierOrder[maxTier] || 4;
  return getSectMartialArts(sectId).filter(a => {
    if ((tierOrder[a.tier] || 1) > cap) return false;
    if (a.needRank > sectRank) return false;
    if (learned.includes(a.id)) return false;
    return true;
  });
}

export function calcSectResonanceBonus(pet, playerSect, playerSubSect) {
  if (!pet?.sectId) return null;
  const matchMain = playerSect && pet.sectId === playerSect;
  const matchSub = playerSubSect && pet.sectId === playerSubSect;
  if (!matchMain && !matchSub) return null;
  const cfg = SECT_PET_RESONANCE[pet.sectId];
  if (!cfg) return null;
  const types = [pet.type, pet.secondaryType, pet.type2].filter(Boolean);
  const typeMatch = types.some(t => cfg.types.includes(t));
  const mult = matchMain ? 1 : 0.5;
  const bonus = { ...cfg.bonus };
  if (!typeMatch) {
    Object.keys(bonus).forEach(k => {
      if (typeof bonus[k] === 'number' && bonus[k] > 1) bonus[k] = 1 + (bonus[k] - 1) * 0.6;
      else if (typeof bonus[k] === 'number') bonus[k] = Math.floor(bonus[k] * 0.6);
    });
  }
  if (mult < 1) {
    Object.keys(bonus).forEach(k => {
      if (typeof bonus[k] === 'number' && bonus[k] > 1) bonus[k] = 1 + (bonus[k] - 1) * mult;
      else if (typeof bonus[k] === 'number') bonus[k] = Math.floor(bonus[k] * mult);
    });
  }
  return { bonus, typeMatch, matchMain, matchSub };
}

export function getXinfaTier(sectXinfaLevels, sectId) {
  return sectXinfaLevels?.[sectId] || sectXinfaLevels?.[String(sectId)] || 1;
}

export function generateSectDailyTasks(dateStr, playerSect) {
  const pool = [...SECT_DAILY_TASK_POOL];
  const picked = [];
  while (picked.length < 5 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push({ ...pool.splice(idx, 1)[0], progress: 0, completed: false, date: dateStr });
  }
  if (playerSect) {
    picked[0] = { ...picked[0], id: 'sect_challenge', name: `${SECT_DB[playerSect]?.name || '门派'}修行`, desc: '完成1次门派相关挑战' };
  }
  return picked;
}

export function getActiveJianghuEvent(date = new Date()) {
  const weekNum = Math.floor(date.getTime() / (7 * 86400000));
  const slot = weekNum % 5;
  return SECT_JIANGHU_EVENTS.find(e => e.weekSlot === slot) || SECT_JIANGHU_EVENTS[0];
}

export function getSectFactionStance(sectId, sectStances) {
  const lean = SECT_FACTION_LEAN[sectId];
  if (!lean) return null;
  return sectStances?.[sectId] || sectStances?.[String(sectId)] || lean.default;
}

export function calcSectKingdomPowerBonus(playerSect, sectRank, sectStances, playerFaction) {
  if (!playerSect || sectRank < 3) return 0;
  let bonus = 0;
  for (let sid = 1; sid <= SECT_COUNT; sid++) {
    const hasExplicitStance = sectStances?.[sid] || sectStances?.[String(sid)];
    if (!hasExplicitStance && sid !== playerSect && sectRank < 8) continue;
    const stance = getSectFactionStance(sid, sectStances);
    if (stance && stance === playerFaction) {
      const rep = sectRank >= 5 ? 1.2 : 1;
      bonus += Math.floor(15 * rep * (sid === playerSect ? 1.5 : 0.4));
    }
  }
  return bonus;
}

const SECT_ARCHETYPE = {
  1: { role: '突击', plan: '优先攻打城防偏低的前线，靠剑修攻坚快速打开缺口。', tags: ['攻城', '爆发'] },
  2: { role: '镇守', plan: '适合防守关键城池，配合领地守护和盾卫降低战损。', tags: ['防守', '减伤'] },
  3: { role: '机动', plan: '适合支援接壤战场，避开远征补给差的孤城。', tags: ['支援', '机动'] },
  4: { role: '暗袭', plan: '适合消耗强敌城防，优先挑守军偏少但归属强国的目标。', tags: ['削弱', '奇袭'] },
  5: { role: '后勤', plan: '适合拉长赛季收益，先补兵、稳收入，再打名城。', tags: ['续航', '资源'] },
  6: { role: '火攻', plan: '适合名城与高城防目标，攻城器和弓弩收益更高。', tags: ['破城', '火攻'] },
  7: { role: '控场', plan: '适合胶着战，先压低敌方优势城池再集中推进。', tags: ['控场', '拖战'] },
  8: { role: '削弱', plan: '适合对付领地多的强势阵营，靠持续削弱降低反扑。', tags: ['毒耗', '压制'] },
  9: { role: '民望', plan: '适合补足弱势阵营，优先做战功和日常声望任务。', tags: ['战功', '民心'] },
  10: { role: '机关', plan: '适合守城与侦察，优先强化己方关键边境。', tags: ['城防', '情报'] },
  11: { role: '精锐', plan: '适合高等级队伍打精英战役，收益稳定但需要名将支援。', tags: ['精英', '破防'] },
  12: { role: '反制', plan: '适合防守反击，在己方领地较少时收益更明显。', tags: ['反击', '稳守'] },
  ...SECT_ARCHETYPE_EXTENDED,
};

export function evaluateSectStrategy({ sectPlayer, kingdomWar, party = [], badges = 0, territories = {} }) {
  const ps = sectPlayer || DEFAULT_SECT_PLAYER_STATE;
  const mainSectId = ps.playerSect;
  const mainSect = mainSectId ? SECT_DB[mainSectId] : null;
  const rank = getSectRankInfo(ps.sectRank || 0);
  const res = ps.sectResources || DEFAULT_SECT_RESOURCES;
  const partySectCount = party.filter(p => p?.sectId === mainSectId).length;
  const stance = mainSectId ? getSectFactionStance(mainSectId, ps.sectStances) : null;
  const kwFaction = kingdomWar?.faction || null;
  const aligned = !!(stance && kwFaction && stance === kwFaction);
  const archetype = SECT_ARCHETYPE[mainSectId] || { role: '未定', plan: '先拜入门派并完成日常，积累声望解锁国战立场。', tags: ['修行'] };
  const repToNext = (() => {
    const next = SECT_RANKS.find(r => r.rank === (ps.sectRank || 0) + 1);
    if (!next) return null;
    return Math.max(0, next.need - (res.reputation || 0));
  })();
  const ownTerr = kwFaction ? Object.values(territories || {}).filter(t => t.owner === kwFaction).length : 0;
  const resBalance = Math.min(res.reputation || 0, res.contribution || 0, res.qiEssence || 0);
  const subSectReady = !!ps.playerSubSect;
  const dailyOpen = (ps.sectDailyTasks || []).filter(t => !t.completed).length;
  const rankPressure = Math.max(0, 8 - (ps.sectRank || 0)) * 7;
  const synergyPressure = Math.max(0, 2 - partySectCount) * 18;
  const stancePressure = mainSectId && (ps.sectRank || 0) >= 8 && kwFaction && !aligned ? 20 : 0;
  const resourcePressure = resBalance < 120 ? 14 : resBalance < 320 ? 7 : 0;
  const difficultyScore = Math.max(0, Math.min(100, rankPressure + synergyPressure + stancePressure + resourcePressure + (dailyOpen > 2 ? 8 : 0)));
  const difficulty = difficultyScore >= 66
    ? { label: '修行吃紧', desc: '身份、资源或阵容有明显短板，先补基础再打高难玩法。', color: '#EF5350' }
    : difficultyScore >= 38
      ? { label: '路线成型', desc: '核心方向已经明确，但副修、国战立场和同门上阵仍会拉开差距。', color: '#F59E0B' }
      : { label: '可冲高阶', desc: '当前门派体系比较完整，可以把资源投到高收益挑战。', color: '#66BB6A' };

  const stanceOptions = ['wei', 'shu', 'wu', 'jin'].map(fid => {
    const same = fid === kwFaction;
    const current = fid === stance;
    const sectLean = SECT_FACTION_LEAN[mainSectId]?.kwBonus;
    let score = 40;
    if (same) score += 28;
    if (current) score += 16;
    if (ownTerr <= 2 && same) score += 10;
    if (ownTerr >= 7 && same) score -= 8;
    return {
      factionId: fid,
      current,
      score,
      label: sectLean?.label || archetype.role,
      desc: same ? '与当前国战阵营同向，门派国力加成会直接生效。' : '可作为未来转向或牵制思路，但当前收益较低。',
    };
  }).sort((a, b) => b.score - a.score);

  const priorities = [];
  if (!mainSectId) priorities.push({ label: '拜入门派', desc: `获得 ${SECT_JOIN_REQ_BADGES} 枚徽章后选择主修门派。` });
  else if ((ps.sectRank || 0) < 3) priorities.push({ label: '升到内门', desc: repToNext != null ? `还差 ${repToNext} 声望，解锁秘境和阵容加成。` : '继续完成门派任务。' });
  else if ((ps.sectDailyTasks || []).some(t => !t.completed)) priorities.push({ label: '清门派日常', desc: '日常是声望和贡献的稳定来源，优先完成可领取项。' });
  if (mainSectId && partySectCount < 2) priorities.push({ label: '补门派精灵', desc: '队伍里同门精灵越多，心法和共鸣越容易形成主轴。' });
  if (mainSectId && (ps.sectRank || 0) >= 8 && kwFaction && !aligned) priorities.push({ label: '调整国战立场', desc: `建议倾向 ${kwFaction}，让门派加成参与国战。` });
  if (mainSectId && !subSectReady && (ps.sectRank || 0) >= SECT_SUB_SECT_REQ_RANK) priorities.push({ label: '选择副修', desc: '副修会带来组合技和第二成长曲线，但会分散贡献投入。' });
  if (priorities.length === 0) priorities.push({ label: archetype.role + '路线', desc: archetype.plan });

  const depthRules = [
    {
      label: '主修 / 副修取舍',
      value: subSectReady ? '双修开启' : (ps.sectRank || 0) >= SECT_SUB_SECT_REQ_RANK ? '可选副修' : '主修优先',
      desc: subSectReady ? '双修提升上限，但贡献和秘卷会被分流。' : '先把主修心法和身份做起来，避免战力虚高。',
    },
    {
      label: '阵容共鸣',
      value: `${partySectCount}/${Math.max(1, party.length || 0)}`,
      desc: partySectCount >= 2 ? '已具备同门轴心，可追求组合技。' : '同门不足时，门派加成难以稳定转成实战优势。',
    },
    {
      label: '阵营代价',
      value: aligned ? '同向' : kwFaction ? '错位' : '未参战',
      desc: aligned ? '国战收益会放大门派路线。' : '错位时适合刷门派日常，别硬打国战高压目标。',
    },
  ];

  return {
    mainSect,
    rank,
    archetype,
    stance,
    aligned,
    partySectCount,
    repToNext,
    difficulty,
    difficultyScore,
    depthRules,
    priorities,
    stanceOptions,
    metrics: [
      { label: '同门上阵', value: `${partySectCount}/${party.length || 0}` },
      { label: '声望', value: `${res.reputation || 0}` },
      { label: '贡献', value: `${res.contribution || 0}` },
      { label: '国战同向', value: aligned ? '是' : '否' },
      { label: '路线压力', value: `${difficultyScore}/100` },
    ],
  };
}

export function getComboSkillKey(mainSect, subSect) {
  if (!mainSect || !subSect) return null;
  const k1 = `${mainSect}_${subSect}`;
  const k2 = `${subSect}_${mainSect}`;
  return SECT_COMBO_SKILLS[k1] ? k1 : (SECT_COMBO_SKILLS[k2] ? k2 : null);
}
