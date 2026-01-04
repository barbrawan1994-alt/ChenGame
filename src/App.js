import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import ThreeMap from './ThreeMap'; // 确保路径正确
import { generatePetModel } from './engines/UltimatePetDesigner'; // 导入终极精灵设计师
// 导入引擎系统
import { GSAPAnimations, SpringAnimations, CombinedAnimations } from './engines/AnimationEngine';
import { EnhancedButton, EnhancedCard, EnhancedProgressBar, EnhancedModal } from './engines/UIEnhancement';
import { CanvasParticleSystem, ParticlePresets } from './engines/ParticleEngine';
// 导入战斗增强组件
import { 
  EnhancedMoveButton, 
  EnhancedHPBar, 
  AnimatedDamageNumber, 
  SkillCastEffect,
  EnhancedBattleMessage 
} from './engines/BattleEnhancements';
const SAVE_KEY = 'DREAM_RPG_LEGEND_V17_FIXED'; 
const COVER_IMG = 'https://d41chssnpqdne.cloudfront.net/user_upload_by_module/chat_bot/files/171335642/8ThZtYs6LuFfKPT5.png?Expires=1765643832&Signature=nYen2ZAHB0FN036pzpJDQpFyDHbzrmVIWNL4H5K6gKh4R46tWLw-67EyT64rL3IlpRhhoI6ZYYgJbyCcP6PVS~KmhS9WfVnCgJFnaSLRiZw0PU4nw8XBc9Z2LUw7bQjJe~-Dk1pw~vceXBW0x-3wQRVhODCC8j1yMR3TG7NmXingA9XzEiiwHbyPjpzdwdsBLmuGXDVchwAflfIHrbK9ztGF5SXMEKPhOy9AznZi4p1NFk-BunegV2Kj24ObI2IRN-4R3bPglupHpZHYFdTfmUYk9GXq295CEMkQtdSDZS5kLkDyPrXd~JiZk3tuFn~s7O5QKj3B67jZo~tYfTSYzg__&Key-Pair-Id=K3USGZIKWMDCSX';
const GRID_W = 30; 
const GRID_H = 20; 

// ==========================================
// 1. 静态数据配置
// ==========================================


const STARTER_POOL_IDS = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 109, 111, 116, 118, 120, 129, 133, 147, 152, 155, 158, 161, 164, 166, 172];
const BGM_SOURCES = {
  // 菜单：使用一段轻松的测试音乐
  MENU: 'https://jetta.vgmtreasurechest.com/soundtracks/pok-mon-25-the-album-2021/ibkutimk/10.%20Only%20Wanna%20Be%20With%20You%20-%20Pok%C3%A9mon%2025%20Version.mp3',
  
  // 地图：使用一段背景音
  MAP:  'https://nu.vgmtreasurechest.com/soundtracks/pokemon-emerald-re-engineered-soundtrack-2004/ugvlumej/05.%20Littleroot%20Town.mp3',

  // 战斗：使用一段快节奏音乐
  BATTLE: 'https://nu.vgmtreasurechest.com/soundtracks/pokemon-emerald-re-engineered-soundtrack-2004/wbqcpqlj/09.%20Battle%21%20%28Wild%20Pok%C3%A9mon%29.mp3',
  
  // Boss：使用一段激昂的音乐
  BOSS:   'https://nu.vgmtreasurechest.com/soundtracks/pokemon-emerald-re-engineered-soundtrack-2004/njdraysu/45.%20Battle%21%20%28Gym%20Leader%29.mp3',
  
  // 胜利：使用一段短促的音效
  VICTORY:'https://lambda.vgmtreasurechest.com/soundtracks/pokemon-art-academy-nintendo-3ds-gamerip/wgpfkgbn/01.%203DS%20Banner.mp3'
};
const TYPES = {
  NORMAL: { name: '一般', color: '#A8A878', bg: '#F5F5F5' },
  FIRE: { name: '火', color: '#F08030', bg: '#FFEBEE' },
  WATER: { name: '水', color: '#6890F0', bg: '#E3F2FD' },
  GRASS: { name: '草', color: '#78C850', bg: '#E8F5E9' },
  ELECTRIC: { name: '电', color: '#F8D030', bg: '#FFFDE7' },
  ICE: { name: '冰', color: '#98D8D8', bg: '#E0F7FA' },
  FIGHT: { name: '格斗', color: '#C03028', bg: '#FFEBEE' },
  POISON: { name: '毒', color: '#A040A0', bg: '#F3E5F5' },
  GROUND: { name: '地面', color: '#E0C068', bg: '#FFF8E1' },
  FLYING: { name: '飞行', color: '#A890F0', bg: '#EDE7F6' },
  PSYCHIC: { name: '超能', color: '#F85888', bg: '#FCE4EC' },
  BUG: { name: '虫', color: '#A8B820', bg: '#F9FBE7' },
  ROCK: { name: '岩石', color: '#B8A038', bg: '#FFFDE7' },
  GHOST: { name: '幽灵', color: '#705898', bg: '#F3E5F5' },
  DRAGON: { name: '龙', color: '#7038F8', bg: '#E1BEE7' },
  STEEL: { name: '钢', color: '#B8B8D0', bg: '#ECEFF1' },
  FAIRY: { name: '妖精', color: '#EE99AC', bg: '#FCE4EC' },
  HEAL: { name: '治愈', color: '#81C784', bg: '#E8F5E9' },
  GOD: { name: '神', color: '#333333', bg: '#D7CCC8' }
};
// ==========================================
// [新增] 属性魅力基准值 (决定初始魅力下限)
// ==========================================
const TYPE_CHARM_BASE = {
  FAIRY: 60,   // 妖精系：天生可爱/美丽
  HEAL: 60,    // 治愈系：亲和力高
  GOD: 70,     // 神：威严
  DRAGON: 50,  // 龙：霸气
  PSYCHIC: 50, // 超能：神秘
  ICE: 50,     // 冰：高冷
  WATER: 40,   // 水：柔和
  GRASS: 40,   // 草：自然
  ELECTRIC: 40,// 电：活力
  FIRE: 40,    // 火：热情
  FLYING: 35,  // 飞行：潇洒
  NORMAL: 30,  // 一般：普通
  STEEL: 30,   // 钢：冷硬
  FIGHT: 25,   // 格斗：粗犷
  GROUND: 20,  // 地面：朴实
  ROCK: 15,    // 岩石：坚硬
  BUG: 15,     // 虫：部分人害怕
  GHOST: 15,   // 幽灵：诡异
  POISON: 10   // 毒：危险
};

const TYPE_BIAS = {
  NORMAL:  { p: 1.0, s: 1.0 }, // 平衡
  FIRE:    { p: 1.1, s: 1.1 }, // 双刀流
  WATER:   { p: 0.9, s: 1.1 }, // 偏特攻
  GRASS:   { p: 1.0, s: 1.1 }, // 偏特攻
  ELECTRIC:{ p: 0.8, s: 1.3 }, // 强特攻
  ICE:     { p: 0.9, s: 1.2 }, // 偏特攻
  FIGHT:   { p: 1.3, s: 0.6 }, // 强物攻
  POISON:  { p: 1.0, s: 1.0 }, // 平衡
  GROUND:  { p: 1.2, s: 0.8 }, // 偏物攻
  FLYING:  { p: 1.1, s: 1.0 }, // 偏物攻
  PSYCHIC: { p: 0.6, s: 1.4 }, // 极强特攻
  BUG:     { p: 1.1, s: 0.9 }, // 偏物攻
  ROCK:    { p: 1.4, s: 0.6 }, // 强物攻
  GHOST:   { p: 0.8, s: 1.3 }, // 强特攻
  DRAGON:  { p: 1.2, s: 1.2 }, // 种族强大
  STEEL:   { p: 1.2, s: 0.7 }, // 偏物攻
  FAIRY:   { p: 0.7, s: 1.3 }, // 偏特攻
  HEAL:    { p: 0.5, s: 1.0 },
  GOD:     { p: 1.5, s: 1.5 }  // 神
};
// ==========================================
// [修正] 精灵球配置 (适配游戏地图)
// ==========================================
const BALLS = {
  poke:   { id: 'poke',   name: '精灵球', rate: 1.0, price: 200, icon: '🔴', desc: '基础捕获球' },
  great:  { id: 'great',  name: '超级球', rate: 1.5, price: 600, icon: '🔵', desc: '中等概率捕获' },
  ultra:  { id: 'ultra',  name: '高级球', rate: 2.0, price: 1200, icon: '⚫', desc: '高概率捕获' },
  master: { id: 'master', name: '大师球', rate: 255, price: 0,   icon: '🟣', desc: '必定捕获成功！' },
  // 对应深蓝海域(Map4) 和 虫系精灵
  net:    { id: 'net',    name: '网纹球', rate: 3.5, price: 1000, icon: '🕸️', desc: '捕捉水系/虫系效果拔群' },
  // 对应遗迹工厂(Map3)、幽灵古堡(Map7)、银河空间站(Map12)
  dusk:   { id: 'dusk',   name: '黑暗球', rate: 3.5, price: 1000, icon: '🌑', desc: '在工厂/古堡/宇宙或抓幽灵系时效果拔群' },
  // 适合开局直接扔
  quick:  { id: 'quick',  name: '先机球', rate: 5.0, price: 1000, icon: '⚡', desc: '战斗前3回合使用效果极佳' },
  // 适合打神兽/Boss战
  timer:  { id: 'timer',  name: '计时球', rate: 1.0, price: 1000, icon: '⏳', desc: '回合数越多越容易捕捉(10回合后最大)' },
  // 适合捕捉后直接用
  heal:   { id: 'heal',   name: '治愈球', rate: 1.0, price: 300,  icon: '💖', desc: '捕获后恢复满体力' }
};

// 2. [新增] 药品数据库
const MEDICINES = {
  potion:       { id: 'potion',       name: '伤药',      price: 50,  icon: '💊', type: 'HP', val: 20, desc: '恢复20点HP' },
  super_potion: { id: 'super_potion', name: '好伤药',    price: 100,  icon: '🧪', type: 'HP', val: 60, desc: '恢复60点HP' },
  hyper_potion: { id: 'hyper_potion', name: '厉害伤药',  price: 300, icon: '💉', type: 'HP', val: 200, desc: '恢复200点HP' },
  max_potion:   { id: 'max_potion',   name: '全满药',    price: 500, icon: '✨', type: 'HP', val: 9999, desc: '恢复全部HP' },
  ether:        { id: 'ether',        name: 'PP单补剂',  price: 200,  icon: '💧', type: 'PP', val: 10, desc: '恢复1个技能10点PP' },
  max_ether:    { id: 'max_ether',    name: 'PP全补剂',  price: 500, icon: '🌊', type: 'PP_ALL', val: 10, desc: '恢复所有技能10点PP' },
  antidote:     { id: 'antidote',     name: '解毒药',    price: 100,  icon: '🤢', type: 'STATUS', val: 'PSN', desc: '治愈中毒状态' },
  paralyze_heal:{ id: 'paralyze_heal',name: '解麻药',    price: 100,  icon: '⚡', type: 'STATUS', val: 'PAR', desc: '治愈麻痹状态' },
  burn_heal:    { id: 'burn_heal',    name: '烧伤药',    price: 100,  icon: '🔥', type: 'STATUS', val: 'BRN', desc: '治愈灼伤状态' },
  full_heal:    { id: 'full_heal',    name: '万能药',    price: 400,  icon: '🌟', type: 'STATUS', val: 'ALL', desc: '治愈所有异常状态' },
  revive:       { id: 'revive',       name: '活力块',    price: 800, icon: '💎', type: 'REVIVE', val: 0.5, desc: '复活并恢复一半HP' },
  max_revive:   { id: 'max_revive',   name: '活力星',    price: 1200, icon: '🌟', type: 'REVIVE', val: 1.0, desc: '复活濒死精灵并恢复全部HP' },
};

// 3. [新增] 技能书 (TM)
const TMS = [
  { id: 'tm_fire',  name: '大字爆炎', type: 'FIRE',     p: 110, pp: 5,  price: 5000, desc: '火系大招，高威力' },
  { id: 'tm_water', name: '水炮',     type: 'WATER',    p: 110, pp: 5,  price: 5000, desc: '水系大招，高威力' },
  { id: 'tm_grass', name: '日光束',   type: 'GRASS',    p: 120, pp: 10, price: 5000, desc: '草系大招，需蓄力' },
  { id: 'tm_elec',  name: '打雷',     type: 'ELECTRIC', p: 110, pp: 10, price: 5000, desc: '电系大招，高威力' },
  { id: 'tm_ice',   name: '暴风雪',   type: 'ICE',      p: 110, pp: 5,  price: 5000, desc: '冰系大招，可能冰冻' },
  { id: 'tm_eq',    name: '地震',     type: 'GROUND',   p: 100, pp: 10, price: 8000, desc: '地面系神技，全场攻击' },
  { id: 'tm_psy',   name: '精神强念', type: 'PSYCHIC',  p: 90,  pp: 10, price: 5000, desc: '超能系强力攻击' },
  { id: 'tm_shadow',name: '暗影球',   type: 'GHOST',    p: 80,  pp: 15, price: 5000, desc: '幽灵系强力攻击' },
  { id: 'tm_dragon',name: '龙之波动', type: 'DRAGON',   p: 85,  pp: 10, price: 8000, desc: '龙系强力攻击' },
  { id: 'tm_fight', name: '近身战',   type: 'FIGHT',    p: 120, pp: 5,  price: 8000, desc: '格斗系大招，降低双防' },
  { id: 'tm_sludge', name: '污泥炸弹', type: 'POISON', p: 90, pp: 10, price: 6000, desc: '高概率使对手中毒' },
  { id: 'tm_bolt',   name: '伏特攻击', type: 'ELECTRIC', p: 120, pp: 5, price: 12000, desc: '电系最强物攻，带麻痹效果' },
  { id: 'tm_icebeam',name: '急冻光线', type: 'ICE',    p: 90, pp: 10, price: 8000, desc: '有概率冻结对手' },
  { id: 'tm_pup',    name: '增强拳',   type: 'FIGHT',  p: 40, pp: 20, price: 4000, desc: '攻击的同时提升攻击力' },
  { id: 'tm_flame',  name: '喷射火焰', type: 'FIRE',   p: 90, pp: 15, price: 8000, desc: '稳定的火系强攻，带灼伤' }
];
// ==========================================
// [新增] 伤害+特效 技能库 (50种)
// 格式: { name, t:属性, p:威力, pp, effect: { type, val/status, chance } }
// ==========================================
const SIDE_EFFECT_SKILLS = [
  // --- 1. 灼伤系列 (火系) ---
  { name: '火焰轮', t: 'FIRE', p: 60, pp: 25, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '喷射火焰', t: 'FIRE', p: 90, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '热风', t: 'FIRE', p: 95, pp: 10, effect: { type: 'STATUS', status: 'BRN', chance: 0.2 }, desc: '20%概率灼伤' },
  { name: '炼狱', t: 'FIRE', p: 100, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 1.0 }, desc: '100%必中灼伤，但命中率低' }, // 需配合命中逻辑
  { name: '神圣之火', t: 'FIRE', p: 100, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.5 }, desc: '50%概率灼伤' },

  // --- 2. 麻痹系列 (电/一般) ---
  { name: '电击波', t: 'ELECTRIC', p: 60, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '放电', t: 'ELECTRIC', p: 80, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '泰山压顶', t: 'NORMAL', p: 85, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '蹭蹭脸颊', t: 'ELECTRIC', p: 40, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%麻痹对手' },
  { name: '伏特攻击', t: 'ELECTRIC', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '高威力+30%麻痹' },

  // --- 3. 冰冻/减速系列 (冰系) ---
  { name: '冰冻之风', t: 'ICE', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低对手速度' },
  { name: '急冻光线', t: 'ICE', p: 90, pp: 10, effect: { type: 'STATUS', status: 'FRZ', chance: 0.1 }, desc: '10%概率冰冻' },
  { name: '暴风雪', t: 'ICE', p: 110, pp: 5, effect: { type: 'STATUS', status: 'FRZ', chance: 0.3 }, desc: '30%概率冰冻' },
  { name: '冰柱坠击', t: 'ICE', p: 85, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率畏缩(这里用混乱代替)' },
  { name: '极寒冷焰', t: 'ICE', p: 140, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.3 }, desc: '奇特的冰系技能，30%灼伤' },

  // --- 4. 中毒系列 (毒系) ---
  { name: '毒针', t: 'POISON', p: 30, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '毒击', t: 'POISON', p: 80, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '污泥炸弹', t: 'POISON', p: 90, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '垃圾射击', t: 'POISON', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '十字毒刃', t: 'POISON', p: 70, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '50%概率中毒(高暴击)' },

  // --- 5. 降防系列 (降低物防/特防) ---
  { name: '碎岩', t: 'FIGHT', p: 40, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.5 }, desc: '50%降低物防' },
  { name: '铁尾', t: 'STEEL', p: 100, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '30%降低物防' },
  { name: '咬碎', t: 'DARK', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.2 }, desc: '20%降低物防' },
  { name: '暗影球', t: 'GHOST', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.2 }, desc: '20%降低特防' },
  { name: '大地之力', t: 'GROUND', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '精神强念', t: 'PSYCHIC', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '酸液炸弹', t: 'POISON', p: 40, pp: 20, effect: { type: 'DEBUFF', stat: 's_def', val: 2, chance: 1.0 }, desc: '100%大幅降低特防' },

  // --- 6. 降攻系列 (降低物攻/特攻) ---
  { name: '嬉闹', t: 'FAIRY', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.1 }, desc: '10%降低物攻' },
  { name: '月亮之力', t: 'FAIRY', p: 95, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.3 }, desc: '30%降低特攻' },
  { name: '大声咆哮', t: 'DARK', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '100%降低特攻' },
  { name: '广域破坏', t: 'DRAGON', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%降低物攻' },
  { name: '虫之抵抗', t: 'BUG', p: 50, pp: 20, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '100%降低特攻' },

  // --- 7. 降速/降命中系列 ---
  { name: '岩石封锁', t: 'ROCK', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '泥巴射击', t: 'GROUND', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '重踏', t: 'GROUND', p: 60, pp: 20, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '浊流', t: 'WATER', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.3 }, desc: '30%降低命中' },
  { name: '暗黑爆破', t: 'DARK', p: 85, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.4 }, desc: '40%降低命中' },

  // --- 8. 混乱系列 ---
  { name: '水之波动', t: 'WATER', p: 60, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '20%概率混乱' },
  { name: '信号光束', t: 'BUG', p: 75, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.1 }, desc: '10%概率混乱' },
  { name: '暴风', t: 'FLYING', p: 110, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率混乱' },
  { name: '爆裂拳', t: 'FIGHT', p: 100, pp: 5, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%混乱，但命中低' },

  // --- 9. 强化自身系列 (攻击同时提升自己) ---
  { name: '增强拳', t: 'FIGHT', p: 40, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%提升自身物攻' },
  { name: '蓄能焰袭', t: 'FIRE', p: 50, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%提升自身速度' },
  { name: '钢翼', t: 'STEEL', p: 70, pp: 25, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.1 }, desc: '10%提升自身物防' },
  { name: '原始之力', t: 'ROCK', p: 60, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def', chance: 0.1 }, desc: '10%全属性提升(简化)' },
  { name: '流星光束', t: 'ROCK', p: 120, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 1.0 }, desc: '蓄力攻击，提升特攻' }
];

// 4. [新增] 特殊道具
const MISC_ITEMS = {
  rebirth_pill: { id: 'rebirth_pill', name: '洗练药', price: 10000, icon: '💊', desc: '随机重置个体值/性格/闪光(概率同野外)' }
};
const THEME_CONFIG = {
  grass: { bg: '#C8E6C9', boardBg: '#E8F5E9', obstacle: '🌲', ground: '🌿', water: '🌊', rock: '🪨', deco: '🌸', cssClass: 'theme-grass' },
  mountain: { bg: '#D7CCC8', boardBg: '#EFEBE9', obstacle: '⛰️', ground: '🟫', water: '💧', rock: '🪨', deco: '🍄', cssClass: 'theme-mountain' },
  factory: { bg: '#E1BEE7', boardBg: '#F3E5F5', obstacle: '🏭', ground: '⚙️', water: '🧪', rock: '🚧', deco: '💡', cssClass: 'theme-factory' },
  water: { bg: '#B3E5FC', boardBg: '#E1F5FE', obstacle: '🪸', ground: '🟦', water: '🌊', rock: '🪨', deco: '🐠', cssClass: 'theme-water' },
  fire: { bg: '#FFCCBC', boardBg: '#FFEBEE', obstacle: '🌋', ground: '🟪', water: '🔥', rock: '🪨', deco: '🦴', cssClass: 'theme-fire' },
  city: { bg: '#CFD8DC', boardBg: '#ECEFF1', obstacle: '🏢', ground: '⬜', water: '⛲', rock: '🚧', deco: '🌳', cssClass: 'theme-city' },
  ghost: { bg: '#D1C4E9', boardBg: '#EDE7F6', obstacle: '⚰️', ground: '🕸️', water: '🌫️', rock: '🪦', deco: '🕯️', cssClass: 'theme-ghost' },
  sky: { bg: '#FFE0B2', boardBg: '#FFF3E0', obstacle: '☁️', ground: '🌫️', water: '🌈', rock: '🌑', deco: '✨', cssClass: 'theme-sky' },
  ice: { bg: '#E0F7FA', boardBg: '#E1F5FE', obstacle: '🧊', ground: '❄️', water: '🌊', rock: '🪨', deco: '⛄', cssClass: 'theme-ice' },
  ground: { bg: '#FFE082', boardBg: '#FFF8E1', obstacle: '🌵', ground: '🟨', water: '💧', rock: '🪨', deco: '💀', cssClass: 'theme-ground' },
  fairy: { bg: '#F8BBD0', boardBg: '#FCE4EC', obstacle: '🏰', ground: '🌸', water: '🍫', rock: '🧁', deco: '🍭', cssClass: 'theme-fairy' },
  space: { bg: '#311B92', boardBg: '#4527A0', obstacle: '☄️', ground: '🌑', water: '🌌', rock: '🪐', deco: '⭐', cssClass: 'theme-space' }
};

const ACCESSORY_DB = [
  { id: 'a1', name: '勇气徽章', type: 'ATK', val: 15, icon: '🎖️', price: 500, desc: '攻击力+15' },
  { id: 'a2', name: '力量拳套', type: 'ATK', val: 35, icon: '🥊', price: 1200, desc: '攻击力+35' },
  { id: 'a3', name: '守护围巾', type: 'DEF', val: 15, icon: '🧣', price: 500, desc: '防御力+15' },
  { id: 'a4', name: '爱心饼干', type: 'HP', val: 100, icon: '🍪', price: 800, desc: '最大HP+100' },
  { id: 'a5', name: '王者皇冠', type: 'ATK', val: 80, icon: '👑', price: 5000, desc: '攻击力+80' },
  { id: 'a6', name: '天使光环', type: 'DEF', val: 60, icon: '😇', price: 4500, desc: '防御力+60' },
  { id: 'a7', name: '龙之牙', type: 'ATK', val: 50, icon: '🦷', price: 2500, desc: '攻击力+50' },
  { id: 'a8', name: '金属涂层', type: 'DEF', val: 40, icon: '🛡️', price: 2000, desc: '防御力+40' },
  { id: 'a9', name: '奇迹种子', type: 'HP', val: 200, icon: '🌰', price: 3000, desc: '最大HP+200' },
  { id: 'trophy', name: '冠军奖杯', type: 'ATK', val: 200, icon: '🏆', price: 99999, desc: '至高荣誉！全属性大幅提升(隐藏效果)' },
];
// ==========================================
// [新增] 随机技能装备原型库
// type: 'SKILL_ONLY' (仅技能) | 'HYBRID' (属性+技能)
// ==========================================
const RANDOM_EQUIP_DB = [
  { id: 'rng_scroll', name: '古老卷轴', type: 'SKILL_ONLY', icon: '📜', desc: '记载着某种失传的绝技', price: 2000 },
  { id: 'rng_grimoire', name: '禁忌魔导书', type: 'SKILL_ONLY', icon: '📖', desc: '散发着不祥气息的魔法书', price: 5000 },
  { id: 'rng_sword', name: '符文剑', type: 'HYBRID', stat: 'ATK', val: 25, icon: '🗡️', desc: '刻有符文的剑 (攻+25)', price: 8000 },
  { id: 'rng_shield', name: '元素盾', type: 'HYBRID', stat: 'DEF', val: 25, icon: '🛡️', desc: '流动着元素的盾 (防+25)', price: 8000 },
  { id: 'rng_heart', name: '龙之心', type: 'HYBRID', stat: 'HP', val: 150, icon: '💓', desc: '龙族的心脏 (HP+150)', price: 10000 },
];
// ==========================================
// [新增] 特性数据库 (精确数值版)
// ==========================================
const TRAIT_DB = {
  // --- 危机增幅类 (1.5倍) ---
  overgrow:    { name: '茂盛', desc: 'HP<1/3时，草系技能威力提升50%', type: 'BATTLE' },
  blaze:       { name: '猛火', desc: 'HP<1/3时，火系技能威力提升50%', type: 'BATTLE' },
  torrent:     { name: '激流', desc: 'HP<1/3时，水系技能威力提升50%', type: 'BATTLE' },
  swarm:       { name: '虫之预感', desc: 'HP<1/3时，虫系技能威力提升50%', type: 'BATTLE' },

  // --- 面板修正类 ---
  huge_power:  { name: '大力士', desc: '物理攻击力变为原来的2倍', type: 'STAT' },
  guts:        { name: '毅力', desc: '处于异常状态时，物攻提升50%', type: 'STAT' },
  
  // --- 出场触发类 (ENTRY) ---
  intimidate:  { name: '威吓', desc: '出场时，令对手物攻下降1级(-33%)', type: 'ENTRY' }, 
  
  // --- 战斗/免疫类 ---
  static:      { name: '静电', desc: '受到接触攻击时，30%概率令对手麻痹', type: 'BATTLE' },
  levitate:    { name: '漂浮', desc: '免疫所有地面属性的伤害', type: 'BATTLE' },
  flash_fire:  { name: '引火', desc: '免疫火系攻击，且火系技能威力提升50%', type: 'BATTLE' },
  technician:  { name: '技术高手', desc: '威力≤60的技能，伤害提升50%', type: 'BATTLE' },
  sniper:      { name: '狙击手', desc: '击中要害时，伤害由1.5倍变为2.25倍', type: 'BATTLE' },
  sturdy:      { name: '结实', desc: '满HP时受到致死攻击，必定保留1点HP', type: 'BATTLE' },
  adaptability:{ name: '适应力', desc: '属性一致加成(STAB)由1.5倍变为2.0倍', type: 'BATTLE' },
  multiscale:  { name: '多重鳞片', desc: 'HP全满时，受到的伤害减半', type: 'BATTLE' },
  pressure:    { name: '压迫感', desc: '对手使用技能时多消耗1点PP', type: 'BATTLE' },
  cute_charm:  { name: '迷人之躯', desc: '受接触攻击时，30%概率令对手混乱', type: 'BATTLE' }, // 简化着迷为混乱

  // --- 回合/退场类 ---
  speed_boost: { name: '加速', desc: '每回合结束时，速度提升1级(+50%)', type: 'PASSIVE' },
  regenerator: { name: '再生力', desc: '交换下场或战斗结束时，恢复1/3最大HP', type: 'OTHER' },
  prankster:   { name: '恶作剧之心', desc: '变化类技能(无伤害)必定先手', type: 'BATTLE' },
};

// ==========================================
// [重构] 全属性技能库 (每系 8-10 个，含威力与PP)
// ==========================================
const SKILL_DB = {
  NORMAL: [
    { name: '撞击', p: 40, pp: 35 }, 
    { name: '电光一闪', p: 40, pp: 30 }, 
    { name: '劈开', p: 70, pp: 20 },
    { name: '必杀门牙', p: 80, pp: 15 }, 
    { name: '猛撞', p: 90, pp: 20 }, 
    { name: '巨声', p: 90, pp: 10 },
    { name: '舍身冲撞', p: 120, pp: 15 }, 
    { name: '破坏死光', p: 150, pp: 5 }, 
    { name: '终极冲击', p: 150, pp: 5 },
    { name: '大爆炸', p: 250, pp: 1 }
  ],
  FIRE: [
    { name: '火花', p: 40, pp: 25 }, 
    { name: '火焰轮', p: 60, pp: 25 }, 
    { name: '火焰拳', p: 75, pp: 15 },
    { name: '喷射火焰', p: 90, pp: 15 }, 
    { name: '热风', p: 95, pp: 10 }, 
    { name: '大字爆炎', p: 110, pp: 5 },
    { name: '闪焰冲锋', p: 120, pp: 15 }, 
    { name: '过热', p: 130, pp: 5 }, 
    { name: '爆裂燃烧', p: 150, pp: 5 },
    { name: 'V热焰', p: 180, pp: 5 }
  ],
  WATER: [
    { name: '水枪', p: 40, pp: 25 }, 
    { name: '泡沫光线', p: 65, pp: 20 }, 
    { name: '水流裂破', p: 85, pp: 10 },
    { name: '冲浪', p: 90, pp: 15 }, 
    { name: '浊流', p: 90, pp: 10 }, 
    { name: '水炮', p: 110, pp: 5 },
    { name: '高压水泵', p: 110, pp: 5 }, 
    { name: '海啸', p: 120, pp: 5 }, 
    { name: '加农水炮', p: 150, pp: 5 },
    { name: '根源波动', p: 110, pp: 10 } // 盖欧卡专属
  ],
  GRASS: [
    { name: '藤鞭', p: 45, pp: 25 }, 
    { name: '飞叶快刀', p: 55, pp: 25 }, 
    { name: '终极吸取', p: 75, pp: 10 },
    { name: '能量球', p: 90, pp: 10 }, 
    { name: '种子炸弹', p: 80, pp: 15 }, 
    { name: '花瓣舞', p: 120, pp: 10 },
    { name: '日光束', p: 120, pp: 10 }, 
    { name: '木槌', p: 120, pp: 15 }, 
    { name: '飞叶风暴', p: 130, pp: 5 },
    { name: '疯狂植物', p: 150, pp: 5 }
  ],
  ELECTRIC: [
    { name: '电击', p: 40, pp: 30 }, 
    { name: '电球', p: 60, pp: 20 }, 
    { name: '雷电拳', p: 75, pp: 15 },
    { name: '放电', p: 80, pp: 15 }, 
    { name: '十万伏特', p: 90, pp: 15 }, 
    { name: '打雷', p: 110, pp: 10 },
    { name: '伏特攻击', p: 120, pp: 15 }, 
    { name: '电磁炮', p: 120, pp: 5 }, 
    { name: '雷击', p: 130, pp: 5 },
    { name: '千万伏特', p: 195, pp: 1 } // 皮卡丘专属Z
  ],
  ICE: [
    { name: '冰砾', p: 40, pp: 30 }, 
    { name: '冰冻牙', p: 65, pp: 15 }, 
    { name: '极光束', p: 65, pp: 20 },
    { name: '冰柱坠击', p: 85, pp: 10 }, 
    { name: '急冻光线', p: 90, pp: 10 }, 
    { name: '冰锤', p: 100, pp: 10 },
    { name: '暴风雪', p: 110, pp: 5 }, 
    { name: '冰封世界', p: 120, pp: 5 }, 
    { name: '绝对零度', p: 200, pp: 1 }
  ],
  FIGHT: [
    { name: '碎岩', p: 40, pp: 15 }, 
    { name: '发劲', p: 60, pp: 10 }, 
    { name: '劈瓦', p: 75, pp: 15 },
    { name: '波导弹', p: 80, pp: 20 }, 
    { name: '流星拳', p: 90, pp: 10 }, 
    { name: '爆裂拳', p: 100, pp: 5 },
    { name: '近身战', p: 120, pp: 5 }, 
    { name: '真气弹', p: 120, pp: 5 }, 
    { name: '真气拳', p: 150, pp: 20 }
  ],
  POISON: [
    { name: '溶解液', p: 40, pp: 30 }, 
    { name: '毒液冲击', p: 65, pp: 10 }, 
    { name: '十字毒刃', p: 70, pp: 20 },
    { name: '毒击', p: 80, pp: 20 }, 
    { name: '污泥炸弹', p: 90, pp: 10 }, 
    { name: '污泥波', p: 95, pp: 10 },
    { name: '垃圾射击', p: 120, pp: 5 }, 
    { name: '无极光束', p: 160, pp: 5 } // 无极汰那
  ],
  GROUND: [
    { name: '泥巴射击', p: 55, pp: 15 }, 
    { name: '重踏', p: 60, pp: 20 }, 
    { name: '挖洞', p: 80, pp: 10 },
    { name: '大地之力', p: 90, pp: 10 }, 
    { name: '十万马力', p: 95, pp: 10 }, 
    { name: '地震', p: 100, pp: 10 },
    { name: '断崖之剑', p: 120, pp: 10 }, 
    { name: '地裂', p: 200, pp: 1 }
  ],
  FLYING: [
    { name: '起风', p: 40, pp: 35 }, 
    { name: '燕返', p: 60, pp: 20 }, 
    { name: '空气斩', p: 75, pp: 15 },
    { name: '钻孔啄', p: 80, pp: 20 }, 
    { name: '飞翔', p: 90, pp: 15 }, 
    { name: '暴风', p: 110, pp: 10 },
    { name: '勇鸟猛攻', p: 120, pp: 15 }, 
    { name: '神鸟特攻', p: 140, pp: 5 }, 
    { name: '画龙点睛', p: 120, pp: 5 }
  ],
  PSYCHIC: [
    { name: '念力', p: 50, pp: 25 }, 
    { name: '幻象光线', p: 65, pp: 20 }, 
    { name: '精神利刃', p: 70, pp: 20 },
    { name: '意念头锤', p: 80, pp: 15 }, 
    { name: '精神强念', p: 90, pp: 10 }, 
    { name: '食梦', p: 100, pp: 15 },
    { name: '精神击破', p: 100, pp: 10 }, 
    { name: '预知未来', p: 120, pp: 10 }, 
    { name: '棱镜镭射', p: 160, pp: 10 }
  ],
  BUG: [
    { name: '连斩', p: 40, pp: 20 }, 
    { name: '虫咬', p: 60, pp: 20 }, 
    { name: '银色旋风', p: 60, pp: 5 },
    { name: '十字剪', p: 80, pp: 15 }, 
    { name: '吸血', p: 80, pp: 10 }, 
    { name: '虫鸣', p: 90, pp: 10 },
    { name: '迎头一击', p: 90, pp: 10 }, 
    { name: '大角撞击', p: 120, pp: 10 }
  ],
  ROCK: [
    { name: '落石', p: 50, pp: 15 }, 
    { name: '原始之力', p: 60, pp: 5 }, 
    { name: '岩崩', p: 75, pp: 10 },
    { name: '力量宝石', p: 80, pp: 20 }, 
    { name: '尖石攻击', p: 100, pp: 5 }, 
    { name: '钻石风暴', p: 100, pp: 5 },
    { name: '流星光束', p: 120, pp: 10 }, 
    { name: '岩石炮', p: 150, pp: 5 }, 
    { name: '双刃头锤', p: 150, pp: 5 }
  ],
  GHOST: [
    { name: '惊吓', p: 30, pp: 15 }, 
    { name: '影子偷袭', p: 40, pp: 30 }, 
    { name: '暗影拳', p: 60, pp: 20 },
    { name: '暗影爪', p: 70, pp: 15 }, 
    { name: '暗影球', p: 80, pp: 15 }, 
    { name: '潜灵奇袭', p: 90, pp: 10 },
    { name: '暗影潜袭', p: 120, pp: 5 }, 
    { name: '星碎', p: 120, pp: 5 } // 专属
  ],
  DRAGON: [
    { name: '龙息', p: 60, pp: 20 }, 
    { name: '龙爪', p: 80, pp: 15 }, 
    { name: '龙之波动', p: 85, pp: 10 },
    { name: '龙之俯冲', p: 100, pp: 10 }, 
    { name: '亚空裂斩', p: 100, pp: 5 }, 
    { name: '巨兽斩', p: 100, pp: 5 },
    { name: '逆鳞', p: 120, pp: 10 }, 
    { name: '流星群', p: 130, pp: 5 }, 
    { name: '时光咆哮', p: 150, pp: 5 }
  ],
  STEEL: [
    { name: '子弹拳', p: 40, pp: 30 }, 
    { name: '金属爪', p: 50, pp: 35 }, 
    { name: '镜光射击', p: 65, pp: 10 },
    { name: '钢翼', p: 70, pp: 25 }, 
    { name: '铁头', p: 80, pp: 15 }, 
    { name: '彗星拳', p: 90, pp: 10 },
    { name: '铁尾', p: 100, pp: 15 }, 
    { name: '巨兽弹', p: 100, pp: 5 }, 
    { name: '破灭之愿', p: 140, pp: 5 }
  ],
  FAIRY: [
    { name: '妖精之风', p: 40, pp: 30 }, 
    { name: '魅惑之声', p: 40, pp: 15 }, 
    { name: '吸取之吻', p: 50, pp: 10 },
    { name: '魔法闪耀', p: 80, pp: 10 }, 
    { name: '嬉闹', p: 90, pp: 10 }, 
    { name: '月亮之力', p: 95, pp: 15 },
    { name: '大地掌控', p: 120, pp: 5 }, 
    { name: '星光灭绝', p: 150, pp: 5 }
  ],
  GOD: [
    { name: '神之裁决', p: 100, pp: 10 }, 
    { name: '虚空破碎', p: 120, pp: 5 }, 
    { name: '创世之光', p: 150, pp: 5 },
    { name: '维度打击', p: 180, pp: 5 }, 
    { name: '因果律', p: 200, pp: 1 }, 
    { name: '万物归零', p: 250, pp: 1 },
    { name: '宇宙大爆炸', p: 300, pp: 1 }, 
    { name: '终焉之刻', p: 999, pp: 1 }
  ],
  HEAL: [
    { name: '自我再生', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' }, 
    { name: '光合作用', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' }, 
    { name: '月光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '祈愿', p: 0, pp: 10, val: 0.5, desc: '下回合恢复50%最大HP' }, // 简化处理，暂按直接恢复
    { name: '生命水滴', p: 0, pp: 15, val: 0.25, desc: '恢复25%最大HP' }, // 这个技能原版就是25%
    { name: '晨光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '治愈波动', p: 0, pp: 10, val: 0.5, desc: '恢复目标50%最大HP' }, 
    { name: '羽栖', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' }
  ]
};
// ==========================================
// [新增] 50种 战术/状态类技能库 (无伤害，纯策略)
// ==========================================
// ==========================================
// [重构] 变化类技能库 (明确百分比与效果)
// ==========================================
const STATUS_SKILLS_DB = [
  // --- 强化自身 (Buff: +1级=+50%, +2级=+100%) ---
  { name: '剑舞', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2 }, desc: '跳起战斗之舞，物攻大幅提升(+100%)' },
  { name: '铁壁', t: 'STEEL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '皮肤硬化如铁，物防大幅提升(+100%)' },
  { name: '诡计', t: 'DARK', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 2 }, desc: '谋划计策，特攻大幅提升(+100%)' },
  { name: '健美', t: 'FIGHT', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def' }, desc: '绷紧肌肉，物攻和物防同时提升(+50%)' },
  { name: '冥想', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def' }, desc: '静心凝神，特攻和特防同时提升(+50%)' },
  { name: '高速移动', t: 'PSYCHIC', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 2 }, desc: '身体放松，速度大幅提升(+100%)' },
  { name: '龙之舞', t: 'DRAGON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'spd' }, desc: '神秘的舞蹈，物攻和速度同时提升(+50%)' },
  { name: '蝶舞', t: 'BUG', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def', stat3: 'spd' }, desc: '特攻、特防、速度全部提升(+50%)' },
  { name: '破壳', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2, stat2: 's_atk', stat3: 'spd' }, desc: '大幅提升双攻和速度(+100%)，但降低防御' },
  { name: '聚气', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'crit', val: 2 }, desc: '集中精神，暴击率大幅提升(+2级)' },
  { name: '变硬', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1 }, desc: '全身用力，物防提升(+50%)' },
  { name: '生长', t: 'GRASS', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 's_atk' }, desc: '身体变大，物攻和特攻同时提升(+50%)' },
  { name: '充电', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1 }, desc: '蓄积电力，特防提升(+50%)' },
  { name: '溶化', t: 'POISON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '身体液化，物防大幅提升(+100%)' },
  { name: '棉花防守', t: 'GRASS', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 3 }, desc: '用绒毛包裹，物防巨幅提升(+150%)' },
  { name: '影分身', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 1 }, desc: '制造残影，闪避率提升(+1级)' },
  { name: '变小', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 2 }, desc: '身体缩小，闪避率大幅提升(+2级)' },

  // --- 削弱对手 (Debuff: -1级=-33%, -2级=-50%) ---
  { name: '叫声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 1 }, desc: '可爱的叫声，降低对手物攻(-33%)' },
  { name: '瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 1 }, desc: '犀利的眼神，降低对手物防(-33%)' },
  { name: '刺耳声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 2 }, desc: '刺耳的噪音，大幅降低对手物防(-50%)' },
  { name: '假哭', t: 'DARK', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '装哭，大幅降低对手特防(-50%)' },
  { name: '金属音', t: 'STEEL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '摩擦金属声，大幅降低对手特防(-50%)' },
  { name: '可怕面孔', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 2 }, desc: '恐怖的表情，大幅降低对手速度(-50%)' },
  { name: '吐丝', t: 'BUG', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 1 }, desc: '缠住对手，降低对手速度(-33%)' },
  { name: '撒娇', t: 'FAIRY', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '可爱的撒娇，大幅降低对手物攻(-50%)' },
  { name: '泼沙', t: 'GROUND', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '向眼睛泼沙，降低对手命中率(-1级)' },
  { name: '闪光', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '强光致盲，降低对手命中率(-1级)' },
  { name: '烟幕', t: 'FIRE', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '喷出烟雾，降低对手命中率(-1级)' },
  { name: '羽毛舞', t: 'FLYING', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '撒落羽毛，大幅降低对手物攻(-50%)' },
  { name: '大声咆哮', t: 'DARK', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_atk', val: 1 }, desc: '狂吠，降低对手特攻(-33%)' },

  // --- 施加异常状态 (Status) ---
  { name: '电磁波', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.9 }, desc: '90%使对手麻痹(速度减半/25%无法行动)' },
  { name: '鬼火', t: 'FIRE', p: 0, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.85 }, desc: '85%使对手灼伤(物攻减半/每回合扣血)' },
  { name: '剧毒', t: 'POISON', p: 0, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.9 }, desc: '90%使对手中剧毒(伤害随回合增加)' },
  { name: '催眠术', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'SLP', chance: 0.6 }, desc: '60%使对手睡眠(1-3回合无法行动)' },
  { name: '唱歌', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.55 }, desc: '55%使对手睡眠(1-3回合无法行动)' },
  { name: '蘑菇孢子', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 1.0 }, desc: '100%使对手睡眠(1-3回合无法行动)' },
  { name: '奇异光线', t: 'GHOST', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%使对手混乱(33%概率攻击自己)' },
  { name: '超音波', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.55 }, desc: '55%使对手混乱(33%概率攻击自己)' },
  { name: '虚张声势', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.85, sideEffect: {type:'BUFF', target:'enemy', stat:'p_atk', val:2} }, desc: '使对手混乱但大幅提升其攻击' },
  { name: '天使之吻', t: 'FAIRY', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.75 }, desc: '75%使对手混乱' },
  { name: '大蛇瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%使对手麻痹' },
  { name: '毒粉', t: 'POISON', p: 0, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.75 }, desc: '75%使对手中毒' },
  { name: '麻痹粉', t: 'GRASS', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 0.75 }, desc: '75%使对手麻痹' },
  { name: '催眠粉', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.75 }, desc: '75%使对手睡眠' },

  // --- 防御与恢复 (Utility) ---
  { name: '守住', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击(连续使用易失败)' },
  { name: '看穿', t: 'FIGHT', p: 0, pp: 5, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击' },
  { name: '光合作用', t: 'GRASS', p: 0, pp: 5, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '自我再生', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '羽栖', t: 'FLYING', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '黑雾', t: 'ICE', p: 0, pp: 30, effect: { type: 'RESET' }, desc: '重置全场所有能力变化' }
];

// [自动注入] 将新技能合并到 SKILL_DB
const injectStatusSkills = () => {
  STATUS_SKILLS_DB.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复添加
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        // 随机插入到该属性技能列表的中间位置，增加出现概率
        const len = SKILL_DB[skill.t].length;
        const insertIdx = Math.floor(Math.random() * len);
        SKILL_DB[skill.t].splice(insertIdx, 0, skill);
    }
  });
};
// 立即执行注入
injectStatusSkills();
// [自动注入] 将伤害+特效技能合并到 SKILL_DB
const injectSideEffectSkills = () => {
  SIDE_EFFECT_SKILLS.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        // 插入到列表末尾，作为强力技能
        SKILL_DB[skill.t].push(skill);
    }
  });
};
// 立即执行
injectSideEffectSkills();


  // ==========================================
  // [新增] 20种性格数据库 (平衡设计)
  // stats: 属性修正倍率 (1.15 = +15%, 0.85 = -15%)
  // exp: 升级经验需求倍率 (0.8 = 升级快, 1.2 = 升级慢)
  // ==========================================
  const NATURE_DB = {
    // --- 均衡与天才组 (属性加成少，但升级快) ---
    hardy:   { name: '努力', desc: '全属性微增，升级极快', stats: { hp:1.02, p_atk:1.02, p_def:1.02, s_atk:1.02, s_def:1.02, spd:1.02 }, exp: 0.8 },
    docile:  { name: '坦率', desc: '无属性修正，升级较快', stats: {}, exp: 0.85 },
    serious: { name: '严肃', desc: '速度微增，升级较快',   stats: { spd: 1.05 }, exp: 0.9 },
    bashful: { name: '害羞', desc: '特防微增，升级较快',   stats: { s_def: 1.05 }, exp: 0.9 },
    quirky:  { name: '浮躁', desc: '物攻微增，升级较快',   stats: { p_atk: 1.05 }, exp: 0.9 },

    // --- 物理特化组 (物攻大幅提升) ---
    adamant: { name: '固执', desc: '物攻++ / 特攻--', stats: { p_atk: 1.15, s_atk: 0.85 }, exp: 1.0 },
    brave:   { name: '勇敢', desc: '物攻++ / 速度--', stats: { p_atk: 1.15, spd: 0.85 }, exp: 1.0 },
    lonely:  { name: '寂寞', desc: '物攻++ / 物防--', stats: { p_atk: 1.15, p_def: 0.85 }, exp: 1.0 },
    naughty: { name: '顽皮', desc: '物攻++ / 特防--', stats: { p_atk: 1.15, s_def: 0.85 }, exp: 1.0 },

    // --- 特殊特化组 (特攻大幅提升) ---
    modest:  { name: '内敛', desc: '特攻++ / 物攻--', stats: { s_atk: 1.15, p_atk: 0.85 }, exp: 1.0 },
    quiet:   { name: '冷静', desc: '特攻++ / 速度--', stats: { s_atk: 1.15, spd: 0.85 }, exp: 1.0 },
    mild:    { name: '慢吞吞', desc: '特攻++ / 物防--', stats: { s_atk: 1.15, p_def: 0.85 }, exp: 1.0 },
    rash:    { name: '马虎', desc: '特攻++ / 特防--', stats: { s_atk: 1.15, s_def: 0.85 }, exp: 1.0 },

    // --- 速度特化组 (天下武功唯快不破) ---
    timid:   { name: '胆小', desc: '速度++ / 物攻--', stats: { spd: 1.15, p_atk: 0.85 }, exp: 1.0 },
    jolly:   { name: '爽朗', desc: '速度++ / 特攻--', stats: { spd: 1.15, s_atk: 0.85 }, exp: 1.0 },
    hasty:   { name: '急躁', desc: '速度++ / 物防--', stats: { spd: 1.15, p_def: 0.85 }, exp: 1.0 },

    // --- 防御与生存组 (肉盾首选，升级稍慢) ---
    bold:    { name: '大胆', desc: '物防++ / 物攻--', stats: { p_def: 1.2, p_atk: 0.8 }, exp: 1.1 },
    impish:  { name: '淘气', desc: '物防++ / 特攻--', stats: { p_def: 1.2, s_atk: 0.8 }, exp: 1.1 },
    calm:    { name: '温和', desc: '特防++ / 物攻--', stats: { s_def: 1.2, p_atk: 0.8 }, exp: 1.1 },
    careful: { name: '慎重', desc: '特防++ / 特攻--', stats: { s_def: 1.2, s_atk: 0.8 }, exp: 1.1 },
  };
// ... (在 NATURE_DB 结束的大括号后面添加)

// ==========================================
// [新增] 门派系统配置 (10大门派)
// ==========================================
const SECT_DB = {
  1: { name: '蜀山派', emoji: '⚔️', color: '#2196F3', desc: '御剑术：提升造成的伤害', 
       effect: (lv) => `最终伤害提升 ${3 + lv * 2}%` },
  2: { name: '少林寺', emoji: '🛡️', color: '#FFC107', desc: '金钟罩：减少受到的伤害', 
       effect: (lv) => `受到伤害减少 ${3 + lv * 2}%` },
  3: { name: '逍遥派', emoji: '💨', color: '#00BCD4', desc: '凌波微步：提升速度与闪避', 
       effect: (lv) => `速度+${lv*2}，${2 + lv}% 概率完全闪避` },
  4: { name: '唐门',   emoji: '🎯', color: '#9C27B0', desc: '暴雨梨花：提升暴击率与爆伤', 
       effect: (lv) => `暴击率+${lv}%，暴击伤害+${10 + lv * 5}%` },
  5: { name: '药王谷', emoji: '🌿', color: '#4CAF50', desc: '长生诀：每回合恢复体力', 
       effect: (lv) => `回合结束恢复 ${2 + lv}% 最大HP` },
  6: { name: '明教',   emoji: '🔥', color: '#FF5722', desc: '圣火令：攻击概率灼伤', 
       effect: (lv) => `攻击时 ${5 + lv * 2}% 概率灼伤对手` },
  7: { name: '昆仑派', emoji: '❄️', color: '#3F51B5', desc: '寒冰劲：受击概率冻结对手', 
       effect: (lv) => `受击时 ${3 + lv}% 概率冻结对手` },
  8: { name: '五毒教', emoji: '☠️', color: '#673AB7', desc: '千蛛手：攻击概率中毒', 
       effect: (lv) => `攻击时 ${5 + lv * 2}% 概率使对手中毒` },
  9: { name: '丐帮',   emoji: '🥊', color: '#795548', desc: '打狗棒：反弹物理伤害', 
       effect: (lv) => `受到物理攻击反弹 ${5 + lv * 3}% 伤害` },
  10:{ name: '天机阁', emoji: '🔮', color: '#607D8B', desc: '天眼通：无视部分防御', 
       effect: (lv) => `攻击无视对手 ${5 + lv * 2}% 的防御值` },
};
// ==========================================
// [更新] 门派首席配置 (含专属Buff定义)
// ==========================================
const SECT_CHIEFS_CONFIG = {
  1: { 
      name: '李逍遥', title: '蜀山首席', ace: 281, // 斩铁剑圣
      quote: '御剑乘风来，除魔天地间！', 
      buffName: '万剑归宗',
      buffDesc: '物攻+10%，速度+5%',
      // stats: 属性修正倍率
      stats: { p_atk: 1.10, spd: 1.05 } 
  }, 
  2: { 
      name: '扫地僧·法海', title: '少林方丈', ace: 278, // 金刚不坏
      quote: '金刚不坏，万法不侵。', 
      buffName: '金钟罩',
      buffDesc: '物防+10%，特防+10%',
      stats: { p_def: 1.10, s_def: 1.10 }
  },
  3: { 
      name: '逍遥子', title: '逍遥散人', ace: 141, // 水都守护
      quote: '乘天地之正，而御六气之辩。', 
      buffName: '凌波微步',
      buffDesc: '速度+15%',
      stats: { spd: 1.15 }
  },
  4: { 
      name: '唐门姥姥', title: '千手罗刹', ace: 185, // 龙王蝎
      quote: '暴雨梨花，例不虚发。', 
      buffName: '暴雨梨花',
      buffDesc: '暴击率+10%',
      stats: { crit: 10 } // 暴击是加法
  },
  5: { 
      name: '药圣·孙思邈', title: '药王谷主', ace: 282, // 治愈女神
      quote: '悬壶济世，妙手回春。', 
      buffName: '枯木逢春',
      buffDesc: '最大HP+20%',
      stats: { hp: 1.20 }
  },
  6: { 
      name: '阳顶天', title: '明教教主', ace: 275, // 熔岩魔神
      quote: '焚我残躯，熊熊圣火。', 
      buffName: '圣火燎原',
      buffDesc: '物攻+15%',
      stats: { p_atk: 1.15 }
  },
  7: { 
      name: '何足道', title: '昆仑三圣', ace: 263, // 极寒冰帝
      quote: '昆仑之巅，冰封万里。', 
      buffName: '寒冰真气',
      buffDesc: '特攻+15%',
      stats: { s_atk: 1.15 }
  },
  8: { 
      name: '蓝凤凰', title: '五毒教主', ace: 277, // 剧毒母皇
      quote: '万毒噬心，无药可救。', 
      buffName: '万毒归心',
      buffDesc: '双防+5%，HP+5%',
      stats: { p_def: 1.05, s_def: 1.05, hp: 1.05 }
  },
  9: { 
      name: '洪七公', title: '丐帮帮主', ace: 270, // 武斗神
      quote: '降龙十八掌，打狗棒法！', 
      buffName: '降龙伏虎',
      buffDesc: 'HP+10%，物攻+5%',
      stats: { hp: 1.10, p_atk: 1.05 }
  },
  10:{ 
      name: '百晓生', title: '天机阁主', ace: 292, // 宇宙主脑
      quote: '天机不可泄露。', 
      buffName: '天人合一',
      buffDesc: '特攻+10%，特防+5%',
      stats: { s_atk: 1.10, s_def: 1.05 }
  },
};


// 门派升级消耗公式 (指数增长)
const getSectUpgradeCost = (currentLv) => {
    if (currentLv >= 10) return 0;
    return currentLv * 2000; // 1级升2级2000，9级升10级18000
};
// ==========================================
// [新增] 门派对战阵容预览 (ID对应 POKEDEX)
// ==========================================
const SECT_TEAMS = {
  1: [281, 182, 223, 249, 136, 84],   // 蜀山 (剑/龙): 斩铁剑圣, 烈咬陆鲨, 镰刀螳螂, 音速鸟, 镰刀盔, 陆地狂鲨
  2: [278, 206, 270, 65, 106, 190],   // 少林 (硬/斗): 金刚不坏, 合金暴龙, 武斗神, 巨岩兵, 斗战胜佛, 超甲狂犀
  3: [141, 163, 174, 290, 127, 249],  // 逍遥 (速/飞): 水都守护, 姆克鹰, 浮潜鼬, 脑波水母, 雷伊布, 音速鸟
  4: [185, 208, 94, 169, 224, 43],    // 唐门 (爆/毒): 龙王蝎, 暗影刺客, 超能主宰(替), 战槌龙, 钢甲虫, 暴风神雕
  5: [282, 245, 122, 154, 191, 117],  // 药王 (草/奶): 治愈女神, 治愈花, 大奶罐, 土台龟, 巨蔓藤, 霸王花
  6: [275, 6, 17, 157, 128, 56],      // 明教 (火/暗): 熔岩魔神, 炼狱魔狼, 炽羽凤, 烈焰猴, 火伊布, 暗影魔王
  7: [263, 234, 91, 199, 123, 131],   // 昆仑 (冰): 极寒冰帝, 冰霜巨龙, 急冻鸟, 象牙猪, 拉普拉斯, 多边兽
  8: [277, 27, 186, 114, 229, 295],   // 五毒 (毒): 剧毒母皇, 剧毒海妖, 毒骷蛙, 大嘴蝠, 剧毒蛇, 瘟疫领主
  9: [270, 138, 259, 184, 67, 214],   // 丐帮 (龙/地): 武斗神, 快龙, 大地泰坦, 河马兽, 三头地鼠, 格斗大师
  10:[292, 140, 129, 237, 151, 222],  // 天机 (超/钢): 宇宙主脑, 巨金怪, 太阳伊布, 超能猫, 梦幻, 念力王
};


// ==========================================
// [新增] 1. 进化石道具配置
// ==========================================
const EVO_STONES = {
  fire_stone:   { id: 'fire_stone',   name: '火之石',   price: 3000, icon: '🔥', desc: '炽热的石头，能激发潜能' },
  water_stone:  { id: 'water_stone',  name: '水之石',   price: 3000, icon: '💧', desc: '澄澈的石头，能激发潜能' },
  thunder_stone:{ id: 'thunder_stone',name: '雷之石',   price: 3000, icon: '⚡', desc: '带电的石头，能激发潜能' },
  leaf_stone:   { id: 'leaf_stone',   name: '叶之石',   price: 3000, icon: '🍃', desc: '有着叶脉的石头，能激发潜能' },
  moon_stone:   { id: 'moon_stone',   name: '月之石',   price: 4000, icon: '🌙', desc: '如夜空般深邃，能让神秘精灵进化' },
  sun_stone:    { id: 'sun_stone',    name: '日之石',   price: 4000, icon: '☀️', desc: '如太阳般耀眼，能让特定精灵进化' },
  ice_stone:    { id: 'ice_stone',    name: '冰之石',   price: 3500, icon: '❄️', desc: '冻结的石头，能让冰系精灵进化' },
  dusk_stone:   { id: 'dusk_stone',   name: '暗之石',   price: 4500, icon: '🌑', desc: '黑暗中的石头，能让幽灵/恶系进化' },
  dawn_stone:   { id: 'dawn_stone',   name: '觉醒石',   price: 4500, icon: '✨', desc: '闪耀光芒的石头，能唤醒特定性别' },
  shiny_stone:  { id: 'shiny_stone',  name: '光之石',   price: 5000, icon: '🌟', desc: '光辉灿烂，能让稀有精灵进化' }
};

// ==========================================
// [新增] 2. 进化石专属进化形态 (ID 342-371)
// 均基于原本无进化或弱势的单形态精灵设计
// ==========================================
const STONE_EVO_PETS = [
  // --- 基于 ID 245 治愈花 (草) ---
  { id: 342, name: '花神', type: 'GRASS', emoji: '🌺', hp: 110, atk: 85, def: 110, desc: '治愈花使用叶之石进化' },
  // --- 基于 ID 247 电磁怪 (电) ---
  { id: 343, name: '磁力聚变兽', type: 'ELECTRIC', emoji: '⚛️', hp: 90, atk: 130, def: 100, desc: '电磁怪使用雷之石进化' },
  // --- 基于 ID 249 音速鸟 (飞) ---
  { id: 344, name: '光速神鹰', type: 'FLYING', emoji: '🦅', hp: 80, atk: 120, def: 80, desc: '音速鸟使用光之石进化' },
  // --- 基于 ID 250 陨石怪 (岩) ---
  { id: 345, name: '星际陨落', type: 'ROCK', emoji: '☄️', hp: 100, atk: 120, def: 120, desc: '陨石怪使用月之石进化' },
  // --- 基于 ID 252 圣甲虫 (虫) ---
  { id: 346, name: '太阳神甲虫', type: 'BUG', emoji: '🌞', hp: 95, atk: 135, def: 105, desc: '圣甲虫使用日之石进化' },
  // --- 基于 ID 236 幽灵船长 (鬼) ---
  { id: 347, name: '幽灵舰队', type: 'GHOST', emoji: '🚢', hp: 120, atk: 110, def: 110, desc: '幽灵船长使用暗之石进化' },
  // --- 基于 ID 237 超能猫 (超) ---
  { id: 348, name: '预言猫', type: 'PSYCHIC', emoji: '🔮', hp: 85, atk: 125, def: 85, desc: '超能猫使用觉醒石进化' },
  // --- 基于 ID 238 毒液怪 (毒) ---
  { id: 349, name: '毒液共生体', type: 'POISON', emoji: '🦠', hp: 130, atk: 100, def: 100, desc: '毒液怪使用暗之石进化' },
  // --- 基于 ID 239 蜘蛛女皇 (虫) -> 变异为冰 ---
  { id: 350, name: '冰晶蛛后', type: 'ICE', emoji: '🕸️', hp: 90, atk: 115, def: 90, desc: '蜘蛛女皇使用冰之石进化' },
  // --- 基于 ID 246 章鱼博士 (水) ---
  { id: 351, name: '深海克苏鲁', type: 'WATER', emoji: '🐙', hp: 110, atk: 120, def: 110, desc: '章鱼博士使用水之石进化' },
  // --- 基于 ID 248 沙漠暴君 (地) -> 玻璃化为火 ---
  { id: 352, name: '晶化暴君', type: 'FIRE', emoji: '🦂', hp: 100, atk: 130, def: 100, desc: '沙漠暴君使用火之石进化' },
  // --- 基于 ID 251 大力神 (斗) ---
  { id: 353, name: '泰坦神', type: 'FIGHT', emoji: '🗿', hp: 120, atk: 150, def: 100, desc: '大力神使用觉醒石进化' },
  // --- 基于 ID 200 大宇怪 (超) ---
  { id: 354, name: '灰人首领', type: 'PSYCHIC', emoji: '👽', hp: 95, atk: 115, def: 95, desc: '大宇怪使用月之石进化' },
  // --- 基于 ID 195 远古巨廷 (虫) ---
  { id: 355, name: '史前霸主', type: 'BUG', emoji: '🦖', hp: 105, atk: 125, def: 105, desc: '远古巨廷使用叶之石进化' },
  // --- 基于 ID 185 龙王蝎 (毒) ---
  { id: 356, name: '深渊魔蝎', type: 'POISON', emoji: '🦂', hp: 90, atk: 130, def: 120, desc: '龙王蝎使用暗之石进化' },
  // --- 基于 ID 178 梦妖魔 (鬼) ---
  { id: 357, name: '幻梦魔女', type: 'GHOST', emoji: '🧙‍♀️', hp: 80, atk: 120, def: 80, desc: '梦妖魔使用觉醒石进化' },
  // --- 基于 ID 137 卡比兽 (普) ---
  { id: 358, name: '暴食君王', type: 'NORMAL', emoji: '👑', hp: 180, atk: 130, def: 90, desc: '卡比兽使用觉醒石进化' },
  // --- 基于 ID 116 臭臭花 (毒) -> 分支进化 ---
  { id: 359, name: '美丽花', type: 'GRASS', emoji: '💃', hp: 85, atk: 90, def: 100, desc: '臭臭花使用日之石进化' },
  // --- 基于 ID 61 星光舞者 (妖) ---
  { id: 360, name: '月光女神', type: 'FAIRY', emoji: '🌙', hp: 90, atk: 110, def: 90, desc: '星光舞者使用月之石进化' },
  // --- 基于 ID 86 古铜钟 (钢) ---
  { id: 361, name: '古文明遗物', type: 'STEEL', emoji: '🔔', hp: 90, atk: 100, def: 140, desc: '古铜钟使用觉醒石进化' },
  // --- 基于 ID 14 燃煤怪 (火) -> 分支 ---
  { id: 362, name: '蒸汽机车', type: 'FIRE', emoji: '🚂', hp: 100, atk: 110, def: 120, desc: '燃煤怪使用火之石进化' },
  // --- 基于 ID 31 静电球 (电) -> 分支 ---
  { id: 363, name: '球状闪电', type: 'ELECTRIC', emoji: '⚡', hp: 70, atk: 130, def: 70, desc: '静电球使用雷之石进化' },
  // --- 基于 ID 118 喵喵 (普) -> 分支 ---
  { id: 364, name: '招财金猫', type: 'NORMAL', emoji: '💰', hp: 80, atk: 90, def: 80, desc: '喵喵使用光之石进化' },
  // --- 基于 ID 133 菊石兽 (岩) -> 分支 ---
  { id: 365, name: '鹦鹉螺神', type: 'ROCK', emoji: '🐚', hp: 90, atk: 100, def: 130, desc: '菊石兽使用水之石进化' },
  // --- 基于 ID 135 化石盔 (岩) -> 分支 ---
  { id: 366, name: '三叶虫王', type: 'ROCK', emoji: '🪳', hp: 80, atk: 125, def: 105, desc: '化石盔使用水之石进化' },
  // --- 基于 ID 161 姆克儿 (飞) -> 分支 ---
  { id: 367, name: '白鸽信使', type: 'FLYING', emoji: '🕊️', hp: 70, atk: 90, def: 70, desc: '姆克儿使用光之石进化' },
  // --- 基于 ID 41 信使鸟 (飞) -> 强化 ---
  { id: 368, name: '圣诞老人', type: 'ICE', emoji: '🎅', hp: 100, atk: 100, def: 100, desc: '信使鸟使用冰之石进化' },
  // --- 基于 ID 125 伊布 (普) -> 仙子伊布 ---
  { id: 369, name: '仙子伊布', type: 'FAIRY', emoji: '🎀', hp: 95, atk: 110, def: 130, desc: '伊布使用光之石进化' },
  // --- 基于 ID 201 熔岩蜗牛 (火) ---
  { id: 370, name: '岩浆巨像', type: 'FIRE', emoji: '🌋', hp: 90, atk: 90, def: 160, desc: '熔岩蜗牛使用火之石进化' },
  // --- 基于 ID 203 雪虫 (冰) ---
  { id: 371, name: '冰雪女王', type: 'ICE', emoji: '👑', hp: 80, atk: 125, def: 80, desc: '雪虫使用觉醒石进化' }
];

// ==========================================
// [新增] 3. 进化规则表 (BaseID -> { StoneID: TargetID })
// ==========================================
const STONE_EVO_RULES = {
  245: { leaf_stone: 342 }, // 治愈花 -> 花神
  247: { thunder_stone: 343 }, // 电磁怪 -> 磁力聚变兽
  249: { shiny_stone: 344 }, // 音速鸟 -> 光速神鹰
  250: { moon_stone: 345 }, // 陨石怪 -> 星际陨落
  252: { sun_stone: 346 }, // 圣甲虫 -> 太阳神甲虫
  236: { dusk_stone: 347 }, // 幽灵船长 -> 幽灵舰队
  237: { dawn_stone: 348 }, // 超能猫 -> 预言猫
  238: { dusk_stone: 349 }, // 毒液怪 -> 毒液共生体
  239: { ice_stone: 350 }, // 蜘蛛女皇 -> 冰晶蛛后
  246: { water_stone: 351 }, // 章鱼博士 -> 深海克苏鲁
  248: { fire_stone: 352 }, // 沙漠暴君 -> 晶化暴君
  251: { dawn_stone: 353 }, // 大力神 -> 泰坦神
  200: { moon_stone: 354 }, // 大宇怪 -> 灰人首领
  195: { leaf_stone: 355 }, // 远古巨廷 -> 史前霸主
  185: { dusk_stone: 356 }, // 龙王蝎 -> 深渊魔蝎
  178: { dawn_stone: 357 }, // 梦妖魔 -> 幻梦魔女
  137: { dawn_stone: 358 }, // 卡比兽 -> 暴食君王
  116: { sun_stone: 359 }, // 臭臭花 -> 美丽花
  61:  { moon_stone: 360 }, // 星光舞者 -> 月光女神
  86:  { dawn_stone: 361 }, // 古铜钟 -> 古文明遗物
  14:  { fire_stone: 362 }, // 燃煤怪 -> 蒸汽机车
  31:  { thunder_stone: 363 }, // 静电球 -> 球状闪电
  118: { shiny_stone: 364 }, // 喵喵 -> 招财金猫
  133: { water_stone: 365 }, // 菊石兽 -> 鹦鹉螺神
  135: { water_stone: 366 }, // 化石盔 -> 三叶虫王
  161: { shiny_stone: 367 }, // 姆克儿 -> 白鸽信使
  41:  { ice_stone: 368 }, // 信使鸟 -> 圣诞老人
  372: {
  fire_stone: 373,    // -> 赤红晶卫
  water_stone: 374,   // -> 碧蓝晶卫
  thunder_stone: 375, // -> 紫电晶卫
  leaf_stone: 376,    // -> 翠绿晶卫
  ice_stone: 377,     // -> 苍白晶卫
  moon_stone: 378,    // -> 幽夜晶卫
  sun_stone: 379,     // -> 辉光晶卫
  dusk_stone: 380     // -> 黑曜晶卫
},

  // ✅ 修改后的伊布进化规则 (包含太阳/月亮伊布)
125: { 
    fire_stone: 128,    // 火伊布
    water_stone: 126,   // 水伊布
    thunder_stone: 127, // 雷伊布
    leaf_stone: 196,    // 叶伊布
    ice_stone: 197,     // 冰伊布
    shiny_stone: 369,   // 仙子伊布
    sun_stone: 129,     // 太阳伊布 (新增)
    moon_stone: 130     // 月亮伊布 (新增)
}, 

  201: { fire_stone: 370 }, // 熔岩蜗牛 -> 岩浆巨像
  203: { dawn_stone: 371 } // 雪虫 -> 冰雪女王
};

// ==========================================
// [修正] 属性增强道具 (高价奢侈品版)
// 请替换掉代码约 180 行左右的旧 GROWTH_ITEMS
// ==========================================
const GROWTH_ITEMS = [
  { id: 'vit_hp',   name: 'HP增强剂',   emoji: '🍏', price: 10000, desc: '永久HP+10', stat: 'maxHp', val: 10 },
  { id: 'vit_patk', name: '力量精华',   emoji: '⚔️', price: 10000, desc: '永久物攻+5', stat: 'p_atk', val: 5 },
  { id: 'vit_pdef', name: '硬化涂层',   emoji: '🛡️', price: 10000, desc: '永久物防+5', stat: 'p_def', val: 5 },
  { id: 'vit_satk', name: '智慧水晶',   emoji: '🔮', price: 10000, desc: '永久特攻+5', stat: 's_atk', val: 5 },
  { id: 'vit_sdef', name: '精神披风',   emoji: '🧩', price: 10000, desc: '永久特防+5', stat: 's_def', val: 5 },
  { id: 'vit_spd',  name: '极速之羽',   emoji: '🪶', price: 10000, desc: '永久速度+5', stat: 'spd', val: 5 },
  { id: 'vit_crit', name: '幸运四叶草', emoji: '🍀', price: 30000, desc: '永久暴击+1%', stat: 'crit', val: 1 },
   { id: 'exp_candy', name: '经验糖果', emoji: '🍬', price: 3000, desc: '给宝可梦吃下后，等级提升1级', stat: 'level_up', val: 1 },
  { id: 'max_candy', name: '神奇糖果', emoji: '🍬', price: 99999, desc: '瞬间升至 Lv.100 (仅限非满级精灵)', stat: 'level_max', val: 100 },
];

// ==========================================
// [更新] 基础图鉴 (已为30只弱势精灵添加了强力进化链)
// ==========================================
const BASE_POKEDEX = [
  { id: 1, name: '叶苗苗', type: 'GRASS', emoji: '🌱', hp: 45, atk: 49, def: 49, evo: 2, evoLvl: 16 },
  { id: 2, name: '灵叶鹿', type: 'GRASS', emoji: '🦌', hp: 60, atk: 62, def: 63, evo: 3, evoLvl: 32 },
  { id: 3, name: '森之主', type: 'GRASS', emoji: '🌳', hp: 85, atk: 85, def: 90 },
  { id: 4, name: '火绒狐', type: 'FIRE', emoji: '🦊', hp: 39, atk: 52, def: 43, evo: 5, evoLvl: 16 },
  { id: 5, name: '炎尾狼', type: 'FIRE', emoji: '🐺', hp: 58, atk: 64, def: 58, evo: 6, evoLvl: 36 },
  { id: 6, name: '炼狱魔狼', type: 'FIRE', emoji: '👹', hp: 78, atk: 104, def: 78 },
  { id: 7, name: '泡泡鱼', type: 'WATER', emoji: '🐟', hp: 44, atk: 48, def: 65, evo: 8, evoLvl: 16 },
  { id: 8, name: '激流鲨', type: 'WATER', emoji: '🦈', hp: 59, atk: 63, def: 80, evo: 9, evoLvl: 36 },
  { id: 9, name: '深海霸主', type: 'WATER', emoji: '🐋', hp: 90, atk: 95, def: 100 },
  { id: 10, name: '藤蔓怪', type: 'GRASS', emoji: '🧶', hp: 65, atk: 55, def: 100, evo: 301, evoLvl: 40 }, // 新增进化
  { id: 11, name: '火绒狐', type: 'FIRE', emoji: '🦊', hp: 39, atk: 52, def: 43, evo: 12, evoLvl: 16 },
  { id: 12, name: '炎尾狼', type: 'FIRE', emoji: '🐺', hp: 58, atk: 64, def: 58, evo: 13, evoLvl: 36 },
  { id: 13, name: '炼狱魔狼', type: 'FIRE', emoji: '👹', hp: 78, atk: 104, def: 78 },
  { id: 14, name: '燃煤怪', type: 'FIRE', emoji: '⚫', hp: 40, atk: 40, def: 70, evo: 15, evoLvl: 25 },
  { id: 15, name: '熔岩巨像', type: 'ROCK', emoji: '🗿', hp: 90, atk: 90, def: 120 },
  { id: 16, name: '小火雀', type: 'FIRE', emoji: '🐤', hp: 45, atk: 60, def: 40, evo: 17, evoLvl: 18 },
  { id: 17, name: '炽羽凤', type: 'FIRE', emoji: '🦅', hp: 75, atk: 95, def: 60, evo: 242, evoLvl: 50 }, // 连接到火凤凰
  { id: 18, name: '烛光灵', type: 'GHOST', emoji: '🕯️', hp: 30, atk: 70, def: 30, evo: 19, evoLvl: 30 },
  { id: 19, name: '幽冥灯笼', type: 'GHOST', emoji: '🏮', hp: 60, atk: 125, def: 60 },
  { id: 20, name: '爆爆狮', type: 'FIRE', emoji: '🦁', hp: 80, atk: 110, def: 80, evo: 302, evoLvl: 55 }, // 新增进化
  { id: 21, name: '泡泡鱼', type: 'WATER', emoji: '🐟', hp: 44, atk: 48, def: 65, evo: 22, evoLvl: 16 },
  { id: 22, name: '激流鲨', type: 'WATER', emoji: '🦈', hp: 59, atk: 63, def: 80, evo: 23, evoLvl: 36 },
  { id: 23, name: '深海霸主', type: 'WATER', emoji: '🐋', hp: 90, atk: 95, def: 100 },
  { id: 24, name: '珍珠贝', type: 'WATER', emoji: '🐚', hp: 50, atk: 40, def: 85, evo: 25, evoLvl: 20 },
  { id: 25, name: '铠甲蟹', type: 'WATER', emoji: '🦀', hp: 70, atk: 100, def: 115 },
  { id: 26, name: '水灵水母', type: 'WATER', emoji: '🎐', hp: 60, atk: 50, def: 100, evo: 27, evoLvl: 30 },
  { id: 27, name: '剧毒海妖', type: 'POISON', emoji: '🦑', hp: 90, atk: 70, def: 120 },
  { id: 28, name: '呆呆鸭', type: 'WATER', emoji: '🦆', hp: 60, atk: 60, def: 60, evo: 29, evoLvl: 33 },
  { id: 29, name: '念力鸭皇', type: 'PSYCHIC', emoji: '👑', hp: 90, atk: 95, def: 85 },
  { id: 30, name: '冰晶企鹅', type: 'ICE', emoji: '🐧', hp: 60, atk: 70, def: 60, evo: 303, evoLvl: 42 }, // 新增进化
  { id: 31, name: '静电球', type: 'ELECTRIC', emoji: '🟡', hp: 40, atk: 55, def: 40, evo: 32, evoLvl: 22 },
  { id: 32, name: '闪电猫', type: 'ELECTRIC', emoji: '🐱', hp: 65, atk: 85, def: 60, evo: 33, evoLvl: 36 },
  { id: 33, name: '雷霆狮王', type: 'ELECTRIC', emoji: '🦁', hp: 85, atk: 115, def: 75 },
  { id: 34, name: '插头怪', type: 'ELECTRIC', emoji: '🔌', hp: 50, atk: 60, def: 50, evo: 35, evoLvl: 25 },
  { id: 35, name: '磁暴塔', type: 'ELECTRIC', emoji: '🗼', hp: 80, atk: 100, def: 90 },
  { id: 36, name: '电飞鼠', type: 'ELECTRIC', emoji: '🦇', hp: 60, atk: 80, def: 60, evo: 304, evoLvl: 40 }, // 新增进化
  { id: 37, name: '雷云云', type: 'ELECTRIC', emoji: '☁️', hp: 70, atk: 90, def: 70, evo: 305, evoLvl: 45 }, // 新增进化
  { id: 38, name: '脉冲虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 50, def: 55, evo: 39, evoLvl: 20 },
  { id: 39, name: '电光甲虫', type: 'ELECTRIC', emoji: '🪲', hp: 75, atk: 105, def: 85 },
  { id: 40, name: '超能电池', type: 'STEEL', emoji: '🔋', hp: 60, atk: 60, def: 100, evo: 306, evoLvl: 48 }, // 新增进化
  { id: 41, name: '信使鸟', type: 'FLYING', emoji: '🐦', hp: 40, atk: 45, def: 40, evo: 42, evoLvl: 18 },
  { id: 42, name: '疾风鹰', type: 'FLYING', emoji: '🦅', hp: 60, atk: 70, def: 55, evo: 43, evoLvl: 32 },
  { id: 43, name: '暴风神雕', type: 'FLYING', emoji: '🌪️', hp: 85, atk: 100, def: 75 },
  { id: 44, name: '贪吃鼠', type: 'NORMAL', emoji: '🐀', hp: 35, atk: 50, def: 35, evo: 45, evoLvl: 20 },
  { id: 45, name: '大牙猛鼠', type: 'NORMAL', emoji: '🐁', hp: 70, atk: 90, def: 60 },
  { id: 46, name: '幸运猫', type: 'NORMAL', emoji: '😺', hp: 50, atk: 50, def: 50, evo: 47, evoLvl: 25 },
  { id: 47, name: '贵族猫', type: 'NORMAL', emoji: '🐈', hp: 75, atk: 80, def: 65, evo: 307, evoLvl: 50 }, // 新增进化
  { id: 48, name: '粉粉球', type: 'FAIRY', emoji: '🧶', hp: 90, atk: 45, def: 40, evo: 49, evoLvl: 30 },
  { id: 49, name: '治愈天使', type: 'FAIRY', emoji: '👼', hp: 130, atk: 70, def: 70 },
  { id: 50, name: '瞌睡熊', type: 'NORMAL', emoji: '🐻', hp: 150, atk: 110, def: 80, evo: 308, evoLvl: 60 }, // 新增进化
  { id: 51, name: '冥想童子', type: 'PSYCHIC', emoji: '🧘', hp: 30, atk: 30, def: 30, evo: 52, evoLvl: 16 },
  { id: 52, name: '念力法师', type: 'PSYCHIC', emoji: '🧙', hp: 50, atk: 80, def: 50, evo: 53, evoLvl: 36 },
  { id: 53, name: '大魔导士', type: 'PSYCHIC', emoji: '🔮', hp: 70, atk: 135, def: 65 },
  { id: 54, name: '飘飘魂', type: 'GHOST', emoji: '👻', hp: 30, atk: 40, def: 30, evo: 55, evoLvl: 25 },
  { id: 55, name: '恶作剧鬼', type: 'GHOST', emoji: '😜', hp: 50, atk: 80, def: 50, evo: 56, evoLvl: 40 },
  { id: 56, name: '暗影魔王', type: 'GHOST', emoji: '👿', hp: 70, atk: 120, def: 70 },
  { id: 57, name: '食梦貘', type: 'PSYCHIC', emoji: '🐘', hp: 70, atk: 60, def: 60, evo: 58, evoLvl: 28 },
  { id: 58, name: '梦境行者', type: 'PSYCHIC', emoji: '🌌', hp: 95, atk: 85, def: 85 },
  { id: 59, name: '诅咒娃娃', type: 'GHOST', emoji: '🎎', hp: 60, atk: 115, def: 65, evo: 309, evoLvl: 48 }, // 新增进化
  { id: 60, name: '星之子', type: 'FAIRY', emoji: '⭐', hp: 50, atk: 50, def: 50, evo: 61, evoLvl: 30 },
  { id: 61, name: '星光舞者', type: 'FAIRY', emoji: '💃', hp: 70, atk: 85, def: 75 },
  { id: 62, name: '功夫小子', type: 'FIGHT', emoji: '🥋', hp: 50, atk: 70, def: 50, evo: 63, evoLvl: 25 },
  { id: 63, name: '武道宗师', type: 'FIGHT', emoji: '👊', hp: 80, atk: 110, def: 70 },
  { id: 64, name: '小石怪', type: 'ROCK', emoji: '🪨', hp: 40, atk: 80, def: 100, evo: 65, evoLvl: 25 },
  { id: 65, name: '巨岩兵', type: 'ROCK', emoji: '🧱', hp: 70, atk: 105, def: 130 },
  { id: 66, name: '钻地鼠', type: 'GROUND', emoji: '🐹', hp: 30, atk: 60, def: 40, evo: 67, evoLvl: 26 },
  { id: 67, name: '三头地鼠', type: 'GROUND', emoji: '🥜', hp: 50, atk: 100, def: 60 },
  { id: 68, name: '穿山甲', type: 'GROUND', emoji: '🦔', hp: 60, atk: 80, def: 90, evo: 69, evoLvl: 22 },
  { id: 69, name: '钢爪王', type: 'GROUND', emoji: '💅', hp: 80, atk: 105, def: 115, evo: 310, evoLvl: 50 }, // 新增进化
  { id: 70, name: '波导狗', type: 'FIGHT', emoji: '🐕', hp: 40, atk: 70, def: 40, evo: 71, evoLvl: 30 },
  { id: 71, name: '波导勇者', type: 'FIGHT', emoji: '🐺', hp: 75, atk: 115, def: 75 },
  { id: 72, name: '相扑力士', type: 'FIGHT', emoji: '🖐️', hp: 140, atk: 120, def: 60 },
  { id: 73, name: '化石翼龙', type: 'ROCK', emoji: '🦕', hp: 80, atk: 105, def: 65, evo: 311, evoLvl: 60 }, // 新增进化
  { id: 74, name: '水晶大岩蛇', type: 'ICE', emoji: '💎', hp: 70, atk: 70, def: 160 },
  { id: 75, name: '沼泽怪', type: 'GROUND', emoji: '💩', hp: 100, atk: 85, def: 85, evo: 312, evoLvl: 55 }, // 新增进化
  { id: 76, name: '雪球海豹', type: 'ICE', emoji: '🦭', hp: 70, atk: 40, def: 50, evo: 77, evoLvl: 32 },
  { id: 77, name: '冰牙海狮', type: 'ICE', emoji: '🦷', hp: 90, atk: 60, def: 70, evo: 78, evoLvl: 44 },
  { id: 78, name: '极地海皇', type: 'ICE', emoji: '👑', hp: 110, atk: 85, def: 95 },
  { id: 79, name: '迷你蛇', type: 'DRAGON', emoji: '🐍', hp: 41, atk: 64, def: 45, evo: 80, evoLvl: 30 },
  { id: 80, name: '神秘龙', type: 'DRAGON', emoji: '🐉', hp: 61, atk: 84, def: 65, evo: 81, evoLvl: 55 },
  { id: 81, name: '守护神龙', type: 'DRAGON', emoji: '🐲', hp: 91, atk: 134, def: 95 },
  { id: 82, name: '幼鲨', type: 'DRAGON', emoji: '🦈', hp: 58, atk: 70, def: 45, evo: 83, evoLvl: 24 },
  { id: 83, name: '利刃鲨', type: 'DRAGON', emoji: '🦖', hp: 68, atk: 90, def: 65, evo: 84, evoLvl: 48 },
  { id: 84, name: '陆地狂鲨', type: 'DRAGON', emoji: '✈️', hp: 108, atk: 130, def: 95 },
  { id: 85, name: '古铜镜', type: 'STEEL', emoji: '🪞', hp: 57, atk: 24, def: 86, evo: 86, evoLvl: 33 },
  { id: 86, name: '古铜钟', type: 'STEEL', emoji: '🔔', hp: 67, atk: 89, def: 116 },
  { id: 87, name: '铁哑铃', type: 'STEEL', emoji: '🔩', hp: 40, atk: 55, def: 80, evo: 88, evoLvl: 20 },
  { id: 88, name: '金属怪', type: 'STEEL', emoji: '🦾', hp: 60, atk: 75, def: 100, evo: 89, evoLvl: 45 },
  { id: 89, name: '合金巨蟹', type: 'STEEL', emoji: '🦀', hp: 80, atk: 135, def: 130 },
  { id: 90, name: '雪妖女', type: 'ICE', emoji: '👘', hp: 70, atk: 80, def: 70, evo: 313, evoLvl: 50 }, // 新增进化
  { id: 91, name: '急冻神鸟', type: 'ICE', emoji: '❄️', hp: 90, atk: 95, def: 100 },
  { id: 92, name: '雷霆神鸟', type: 'ELECTRIC', emoji: '⚡', hp: 90, atk: 100, def: 85 },
  { id: 93, name: '火焰神鸟', type: 'FIRE', emoji: '🔥', hp: 90, atk: 110, def: 90 },
  { id: 94, name: '超能主宰', type: 'PSYCHIC', emoji: '👽', hp: 106, atk: 130, def: 90 },
  { id: 95, name: '幻之基因', type: 'PSYCHIC', emoji: '🧬', hp: 100, atk: 100, def: 100 },
  { id: 96, name: '海神洛奇', type: 'FLYING', emoji: '🐋', hp: 106, atk: 90, def: 130 },
  { id: 97, name: '彩虹凤王', type: 'FIRE', emoji: '🦚', hp: 106, atk: 130, def: 90 },
  { id: 98, name: '天空之龙', type: 'DRAGON', emoji: '🐉', hp: 105, atk: 150, def: 90 },
  { id: 99, name: '大地之神', type: 'GROUND', emoji: '🌋', hp: 100, atk: 150, def: 140 },
  { id: 100, name: '海洋之神', type: 'WATER', emoji: '🌊', hp: 100, atk: 120, def: 100 },
  { id: 101, name: '嫩叶龙', type: 'GRASS', emoji: '🦖', hp: 45, atk: 55, def: 50, evo: 102, evoLvl: 16 },
  { id: 102, name: '丛林龙', type: 'GRASS', emoji: '🐊', hp: 65, atk: 75, def: 65, evo: 103, evoLvl: 34 },
  { id: 103, name: '森林霸主', type: 'GRASS', emoji: '🐉', hp: 85, atk: 105, def: 85 },
  { id: 104, name: '火花猴', type: 'FIRE', emoji: '🐒', hp: 44, atk: 58, def: 44, evo: 105, evoLvl: 16 },
  { id: 105, name: '烈焰猿', type: 'FIRE', emoji: '🦍', hp: 64, atk: 78, def: 52, evo: 106, evoLvl: 36 },
  { id: 106, name: '斗战胜佛', type: 'FIRE', emoji: '👹', hp: 76, atk: 104, def: 71, evo: 314, evoLvl: 70 }, // 新增进化
  { id: 107, name: '水跃蛙', type: 'WATER', emoji: '🐸', hp: 50, atk: 50, def: 50, evo: 108, evoLvl: 16 },
  { id: 108, name: '沼泽蛙', type: 'WATER', emoji: '🧘', hp: 70, atk: 70, def: 70, evo: 109, evoLvl: 36 },
  { id: 109, name: '忍蛙', type: 'WATER', emoji: '🥷', hp: 72, atk: 103, def: 67, evo: 315, evoLvl: 70 }, // 新增进化
  { id: 110, name: '绿毛虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 30, def: 35, evo: 111, evoLvl: 7 },
  { id: 111, name: '铁甲蛹', type: 'BUG', emoji: '🥜', hp: 50, atk: 20, def: 55, evo: 112, evoLvl: 10 },
  { id: 112, name: '巴大蝶', type: 'BUG', emoji: '🦋', hp: 60, atk: 90, def: 50, evo: 316, evoLvl: 40 }, // 新增进化
  { id: 113, name: '超音蝠', type: 'POISON', emoji: '🦇', hp: 40, atk: 45, def: 35, evo: 114, evoLvl: 22 },
  { id: 114, name: '大嘴蝠', type: 'POISON', emoji: '🧛', hp: 75, atk: 80, def: 70, evo: 317, evoLvl: 45 }, // 新增进化
  { id: 115, name: '走路草', type: 'GRASS', emoji: '🌱', hp: 45, atk: 50, def: 55, evo: 116, evoLvl: 21 },
  { id: 116, name: '臭臭花', type: 'POISON', emoji: '🌺', hp: 60, atk: 65, def: 70, evo: 117, evoLvl: 30 },
  { id: 117, name: '霸王花', type: 'GRASS', emoji: '🍄', hp: 75, atk: 85, def: 85, evo: 318, evoLvl: 50 }, // 新增进化
  { id: 118, name: '喵喵', type: 'NORMAL', emoji: '😺', hp: 40, atk: 45, def: 35, evo: 119, evoLvl: 28 },
  { id: 119, name: '猫老大', type: 'NORMAL', emoji: '🐆', hp: 65, atk: 70, def: 60, evo: 319, evoLvl: 50 }, // 新增进化
  { id: 120, name: '可达鸭', type: 'WATER', emoji: '🐥', hp: 50, atk: 52, def: 48, evo: 28, evoLvl: 33 },
  { id: 121, name: '肯泰罗', type: 'NORMAL', emoji: '🐂', hp: 75, atk: 100, def: 95, evo: 320, evoLvl: 45 }, // 新增进化
  { id: 122, name: '大奶罐', type: 'NORMAL', emoji: '🐄', hp: 95, atk: 80, def: 105, evo: 321, evoLvl: 45 }, // 新增进化
  { id: 123, name: '拉普拉斯', type: 'ICE', emoji: '🦕', hp: 130, atk: 85, def: 80, evo: 322, evoLvl: 60 }, // 新增进化
  { id: 124, name: '百变怪', type: 'NORMAL', emoji: '🫠', hp: 48, atk: 48, def: 48, evo: 323, evoLvl: 50 }, // 新增进化
  { id: 125, name: '伊布', type: 'NORMAL', emoji: '🐕', hp: 55, atk: 55, def: 50 },
  { id: 126, name: '水伊布', type: 'WATER', emoji: '🧜', hp: 130, atk: 65, def: 60 },
  { id: 127, name: '雷伊布', type: 'ELECTRIC', emoji: '⚡', hp: 65, atk: 110, def: 60 },
  { id: 128, name: '火伊布', type: 'FIRE', emoji: '🔥', hp: 65, atk: 130, def: 60 },
  { id: 129, name: '太阳伊布', type: 'PSYCHIC', emoji: '🔮', hp: 65, atk: 130, def: 60 },
  { id: 130, name: '月亮伊布', type: 'GHOST', emoji: '🌙', hp: 95, atk: 65, def: 110 },
  { id: 131, name: '多边兽', type: 'NORMAL', emoji: '🦆', hp: 65, atk: 60, def: 70, evo: 132, evoLvl: 30 },
  { id: 132, name: '多边兽Z', type: 'NORMAL', emoji: '🤖', hp: 85, atk: 135, def: 70, evo: 324, evoLvl: 60 }, // 新增进化
  { id: 133, name: '菊石兽', type: 'ROCK', emoji: '🐚', hp: 35, atk: 40, def: 100, evo: 134, evoLvl: 40 },
  { id: 134, name: '多刺菊石兽', type: 'ROCK', emoji: '🐌', hp: 70, atk: 60, def: 125, evo: 325, evoLvl: 55 }, // 新增进化
  { id: 135, name: '化石盔', type: 'ROCK', emoji: '🪳', hp: 30, atk: 80, def: 90, evo: 136, evoLvl: 40 },
  { id: 136, name: '镰刀盔', type: 'ROCK', emoji: '🦂', hp: 60, atk: 115, def: 105, evo: 326, evoLvl: 55 }, // 新增进化
  { id: 137, name: '卡比兽', type: 'NORMAL', emoji: '🛌', hp: 160, atk: 110, def: 65 },
  { id: 138, name: '快龙', type: 'DRAGON', emoji: '🐲', hp: 91, atk: 134, def: 95 },
  { id: 139, name: '班基拉斯', type: 'ROCK', emoji: '🦖', hp: 100, atk: 134, def: 110 },
  { id: 140, name: '巨金怪', type: 'STEEL', emoji: '🕷️', hp: 80, atk: 135, def: 130 },
  { id: 141, name: '水都守护', type: 'DRAGON', emoji: '✈️', hp: 80, atk: 90, def: 80 },
  { id: 142, name: '时空之神', type: 'DRAGON', emoji: '🦕', hp: 100, atk: 120, def: 100 },
  { id: 143, name: '空间之神', type: 'DRAGON', emoji: '🦖', hp: 100, atk: 120, def: 100 },
  { id: 144, name: '冥王龙', type: 'GHOST', emoji: '🐛', hp: 150, atk: 100, def: 100 },
  { id: 145, name: '美梦神', type: 'PSYCHIC', emoji: '🌙', hp: 120, atk: 70, def: 120 },
  { id: 146, name: '噩梦神', type: 'GHOST', emoji: '🧛', hp: 70, atk: 90, def: 90 },
  { id: 147, name: '雪拉比', type: 'GRASS', emoji: '🧚', hp: 100, atk: 100, def: 100 },
  { id: 148, name: '基拉祈', type: 'STEEL', emoji: '⭐', hp: 100, atk: 100, def: 100 },
  { id: 149, name: '代欧奇希斯', type: 'PSYCHIC', emoji: '🧬', hp: 50, atk: 150, def: 50 },
  { id: 150, name: '创世神', type: 'NORMAL', emoji: '🌌', hp: 120, atk: 120, def: 120 },
  { id: 151, name: '梦幻', type: 'PSYCHIC', emoji: '🧬', hp: 100, atk: 100, def: 100 },
  { id: 152, name: '草苗龟', type: 'GRASS', emoji: '🐢', hp: 55, atk: 68, def: 64, evo: 153, evoLvl: 18 },
  { id: 153, name: '树林龟', type: 'GRASS', emoji: '🌳', hp: 75, atk: 89, def: 85, evo: 154, evoLvl: 32 },
  { id: 154, name: '土台龟', type: 'GROUND', emoji: '🏝️', hp: 95, atk: 109, def: 105 },
  { id: 155, name: '小火焰猴', type: 'FIRE', emoji: '🐒', hp: 44, atk: 58, def: 44, evo: 156, evoLvl: 14 },
   { id: 156, name: '猛火猴', type: 'FIRE', emoji: '🦍', hp: 64, atk: 78, def: 52, evo: 157, evoLvl: 36 },
  { id: 157, name: '烈焰猴', type: 'FIRE', emoji: '🔥', hp: 76, atk: 104, def: 71 },
  { id: 158, name: '波加曼', type: 'WATER', emoji: '🐧', hp: 53, atk: 61, def: 56, evo: 159, evoLvl: 16 },
  { id: 159, name: '波皇子', type: 'WATER', emoji: '🤴', hp: 64, atk: 66, def: 68, evo: 160, evoLvl: 36 },
  { id: 160, name: '帝王拿波', type: 'STEEL', emoji: '🔱', hp: 84, atk: 86, def: 88 },
  { id: 161, name: '姆克儿', type: 'FLYING', emoji: '🐦', hp: 40, atk: 55, def: 30, evo: 162, evoLvl: 14 },
  { id: 162, name: '姆克鸟', type: 'FLYING', emoji: '🦅', hp: 55, atk: 75, def: 50, evo: 163, evoLvl: 34 },
  { id: 163, name: '姆克鹰', type: 'FLYING', emoji: '🦅', hp: 85, atk: 120, def: 70 },
  { id: 164, name: '大牙狸', type: 'NORMAL', emoji: '🦫', hp: 59, atk: 45, def: 40, evo: 165, evoLvl: 15 },
  { id: 165, name: '大尾狸', type: 'WATER', emoji: '🦦', hp: 79, atk: 85, def: 60 },
  { id: 166, name: '小猫怪', type: 'ELECTRIC', emoji: '🦁', hp: 45, atk: 65, def: 34, evo: 167, evoLvl: 15 },
  { id: 167, name: '勒克猫', type: 'ELECTRIC', emoji: '⚡', hp: 60, atk: 85, def: 49, evo: 168, evoLvl: 30 },
  { id: 168, name: '伦琴猫', type: 'ELECTRIC', emoji: '🐯', hp: 80, atk: 120, def: 79 },
  { id: 169, name: '战槌龙', type: 'ROCK', emoji: '🦕', hp: 97, atk: 165, def: 60 },
  { id: 170, name: '护城龙', type: 'STEEL', emoji: '🛡️', hp: 60, atk: 52, def: 168 },
  { id: 171, name: '蜂女王', type: 'BUG', emoji: '🐝', hp: 70, atk: 80, def: 102, evo: 327, evoLvl: 55 }, // 新增进化
  { id: 172, name: '帕奇利兹', type: 'ELECTRIC', emoji: '🐿️', hp: 60, atk: 45, def: 70, evo: 328, evoLvl: 40 }, // 新增进化
  { id: 173, name: '泳圈鼬', type: 'WATER', emoji: '🦦', hp: 55, atk: 65, def: 35, evo: 174, evoLvl: 26 },
  { id: 174, name: '浮潜鼬', type: 'WATER', emoji: '🌊', hp: 85, atk: 105, def: 55 },
  { id: 175, name: '樱花儿', type: 'GRASS', emoji: '🌸', hp: 70, atk: 60, def: 70, evo: 329, evoLvl: 40 }, // 新增进化
  { id: 176, name: '海兔兽', type: 'GROUND', emoji: '🐌', hp: 111, atk: 83, def: 68 },
  { id: 177, name: '双尾怪手', type: 'NORMAL', emoji: '🐒', hp: 75, atk: 100, def: 66, evo: 330, evoLvl: 45 }, // 新增进化
  { id: 178, name: '梦妖魔', type: 'GHOST', emoji: '🧙', hp: 60, atk: 60, def: 60 },
    { id: 179, name: '乌鸦头头', type: 'FLYING', emoji: '🎩', hp: 100, atk: 125, def: 52 },
  { id: 180, name: '东施喵', type: 'NORMAL', emoji: '😼', hp: 71, atk: 82, def: 64 },
  { id: 181, name: '坦克臭鼬', type: 'POISON', emoji: '🦨', hp: 103, atk: 93, def: 67 },
  { id: 182, name: '烈咬陆鲨', type: 'DRAGON', emoji: '🦈', hp: 108, atk: 130, def: 95  },
  { id: 183, name: '路卡利欧', type: 'FIGHT', emoji: '🐺', hp: 70, atk: 110, def: 70 },
  { id: 184, name: '河马兽', type: 'GROUND', emoji: '🦛', hp: 108, atk: 112, def: 118 },
  { id: 185, name: '龙王蝎', type: 'POISON', emoji: '🦂', hp: 70, atk: 90, def: 110 },
  { id: 186, name: '毒骷蛙', type: 'FIGHT', emoji: '🐸', hp: 83, atk: 106, def: 65 },
  { id: 187, name: '暴雪王', type: 'ICE', emoji: '🌲', hp: 90, atk: 92, def: 75 },
  { id: 188, name: '玛狃拉', type: 'ICE', emoji: '😼', hp: 70, atk: 120, def: 65 },
  { id: 189, name: '自爆磁怪', type: 'ELECTRIC', emoji: '🧲', hp: 70, atk: 70, def: 115 },
  { id: 190, name: '超甲狂犀', type: 'ROCK', emoji: '🦏', hp: 115, atk: 140, def: 130 },
  { id: 191, name: '巨蔓藤', type: 'GRASS', emoji: '🧶', hp: 100, atk: 100, def: 125 },
  { id: 192, name: '电击魔兽', type: 'ELECTRIC', emoji: '🦍', hp: 75, atk: 123, def: 67 },
  { id: 193, name: '鸭嘴炎兽', type: 'FIRE', emoji: '🔥', hp: 75, atk: 95, def: 67 },
  { id: 194, name: '波克基斯', type: 'FAIRY', emoji: '🕊️', hp: 85, atk: 50, def: 95 },
  { id: 195, name: '远古巨廷', type: 'BUG', emoji: '🦗', hp: 86, atk: 76, def: 86 },
  { id: 196, name: '叶伊布', type: 'GRASS', emoji: '🍃', hp: 65, atk: 110, def: 130 },
  { id: 197, name: '冰伊布', type: 'ICE', emoji: '❄️', hp: 65, atk: 60, def: 110 },
  { id: 198, name: '天蝎王', type: 'GROUND', emoji: '🦇', hp: 75, atk: 95, def: 125 },
  { id: 199, name: '象牙猪', type: 'ICE', emoji: '🐗', hp: 110, atk: 130, def: 80 },
  { id: 200, name: '大宇怪', type: 'PSYCHIC', emoji: '👽', hp: 75, atk: 75, def: 75 },
  
  // --- 新增 50 种随机生成的精灵 (ID 201-250) ---
  { id: 201, name: '熔岩蜗牛', type: 'FIRE', emoji: '🐌', hp: 50, atk: 50, def: 100, evo: 202, evoLvl: 30 },
  { id: 202, name: '熔岩巨像', type: 'FIRE', emoji: '🌋', hp: 80, atk: 80, def: 150 },
  { id: 203, name: '雪虫', type: 'ICE', emoji: '🐛', hp: 40, atk: 40, def: 40, evo: 204, evoLvl: 25 },
  { id: 204, name: '极光蛾', type: 'ICE', emoji: '🦋', hp: 70, atk: 100, def: 70 },
  { id: 205, name: '铁甲犀牛II', type: 'STEEL', emoji: '🦏', hp: 60, atk: 60, def: 100, evo: 206, evoLvl: 40 },
  { id: 206, name: '合金暴龙', type: 'STEEL', emoji: '🦖', hp: 95, atk: 125, def: 105 },
  { id: 207, name: '幻影猫', type: 'GHOST', emoji: '🐈‍⬛', hp: 50, atk: 70, def: 40, evo: 208, evoLvl: 30 },
  { id: 208, name: '暗影刺客', type: 'GHOST', emoji: '🥷', hp: 60, atk: 130, def: 60 },
  { id: 209, name: '雷鸣鸟', type: 'ELECTRIC', emoji: '🐦', hp: 50, atk: 70, def: 50, evo: 210, evoLvl: 35 },
  { id: 210, name: '雷电法王', type: 'ELECTRIC', emoji: '🧙‍♂️', hp: 70, atk: 135, def: 70 },
  { id: 211, name: '深海灯笼', type: 'WATER', emoji: '🏮', hp: 80, atk: 60, def: 60, evo: 212, evoLvl: 32 },
  { id: 212, name: '深海巨兽', type: 'WATER', emoji: '🦑', hp: 100, atk: 90, def: 90 },
  { id: 213, name: '拳击袋鼠', type: 'FIGHT', emoji: '🦘', hp: 60, atk: 80, def: 50, evo: 214, evoLvl: 28 },
  { id: 214, name: '格斗大师', type: 'FIGHT', emoji: '🥋', hp: 90, atk: 120, def: 85 },
  { id: 215, name: '翡翠龙', type: 'DRAGON', emoji: '🐉', hp: 70, atk: 80, def: 70, evo: 216, evoLvl: 45 },
  { id: 216, name: '终极龙', type: 'DRAGON', emoji: '🐲', hp: 110, atk: 140, def: 110 },
  { id: 217, name: '花仙子', type: 'FAIRY', emoji: '🧚‍♀️', hp: 50, atk: 60, def: 60, evo: 218, evoLvl: 25 },
  { id: 218, name: '月亮神', type: 'FAIRY', emoji: '🌙', hp: 110, atk: 100, def: 130 },
  { id: 219, name: '泥巴怪', type: 'GROUND', emoji: '💩', hp: 70, atk: 60, def: 60, evo: 220, evoLvl: 30 },
  { id: 220, name: '大地之母', type: 'GROUND', emoji: '👵', hp: 120, atk: 80, def: 110 },
  { id: 221, name: '超能球', type: 'PSYCHIC', emoji: '🔮', hp: 40, atk: 80, def: 40, evo: 222, evoLvl: 35 },
  { id: 222, name: '念力王', type: 'PSYCHIC', emoji: '🧠', hp: 80, atk: 125, def: 80 },
  { id: 223, name: '镰刀螳螂', type: 'BUG', emoji: '🦗', hp: 60, atk: 100, def: 60, evo: 224, evoLvl: 30 },
  { id: 224, name: '钢甲虫', type: 'STEEL', emoji: '🐞', hp: 65, atk: 95, def: 125 },
  { id: 225, name: '岩石巨人', type: 'ROCK', emoji: '🗿', hp: 80, atk: 80, def: 100, evo: 226, evoLvl: 40 },
  { id: 226, name: '钻石兽', type: 'ROCK', emoji: '💎', hp: 70, atk: 80, def: 150 },
  { id: 227, name: '风暴云', type: 'FLYING', emoji: '☁️', hp: 60, atk: 80, def: 50, evo: 228, evoLvl: 35 },
  { id: 228, name: '天空霸主', type: 'FLYING', emoji: '🦅', hp: 90, atk: 115, def: 80 },
  { id: 229, name: '剧毒蛇', type: 'POISON', emoji: '🐍', hp: 50, atk: 70, def: 50, evo: 230, evoLvl: 28 },
  { id: 230, name: '毒气弹', type: 'POISON', emoji: '💣', hp: 70, atk: 110, def: 70 },
  { id: 231, name: '普通的狗', type: 'NORMAL', emoji: '🐕', hp: 50, atk: 60, def: 50, evo: 232, evoLvl: 20 },
  { id: 232, name: '丛林猎手', type: 'GRASS', emoji: '🐆', hp: 75, atk: 115, def: 70 },
  { id: 233, name: '太阳神', type: 'FIRE', emoji: '☀️', hp: 110, atk: 130, def: 100 },
  { id: 234, name: '冰霜巨龙', type: 'ICE', emoji: '🦕', hp: 100, atk: 110, def: 95 },
  { id: 235, name: '海啸王', type: 'WATER', emoji: '🌊', hp: 90, atk: 105, def: 90 },
  { id: 236, name: '幽灵船长', type: 'GHOST', emoji: '🏴‍☠️', hp: 85, atk: 110, def: 85 },
  { id: 237, name: '超能猫', type: 'PSYCHIC', emoji: '🐱', hp: 65, atk: 100, def: 65 },
  { id: 238, name: '毒液怪', type: 'POISON', emoji: '🧪', hp: 80, atk: 90, def: 90 },
  { id: 239, name: '蜘蛛女皇', type: 'BUG', emoji: '🕷️', hp: 75, atk: 105, def: 75 },
  { id: 240, name: '普通熊', type: 'NORMAL', emoji: '🐻', hp: 80, atk: 90, def: 70, evo: 241, evoLvl: 35 },
  { id: 241, name: '懒惰王', type: 'NORMAL', emoji: '🛌', hp: 140, atk: 140, def: 80 },
  { id: 242, name: '火凤凰', type: 'FIRE', emoji: '🦚', hp: 95, atk: 120, def: 95 },
  { id: 243, name: '雪人王', type: 'ICE', emoji: '⛄', hp: 110, atk: 100, def: 90 },
  { id: 244, name: '妖精龙', type: 'DRAGON', emoji: '🦎', hp: 85, atk: 105, def: 85 },
  { id: 245, name: '治愈花', type: 'GRASS', emoji: '🌼', hp: 90, atk: 70, def: 90 },
  { id: 246, name: '章鱼博士', type: 'WATER', emoji: '🐙', hp: 80, atk: 110, def: 80 },
  { id: 247, name: '电磁怪', type: 'ELECTRIC', emoji: '🧲', hp: 70, atk: 90, def: 110 },
  { id: 248, name: '沙漠暴君', type: 'GROUND', emoji: '🦂', hp: 95, atk: 115, def: 95 },
  { id: 249, name: '音速鸟', type: 'FLYING', emoji: '🕊️', hp: 65, atk: 105, def: 65 },
  { id: 250, name: '陨石怪', type: 'ROCK', emoji: '☄️', hp: 85, atk: 100, def: 100 },
  { id: 251, name: '大力神', type: 'FIGHT', emoji: '💪', hp: 100, atk: 130, def: 90 },
  { id: 252, name: '圣甲虫', type: 'BUG', emoji: '🪲', hp: 75, atk: 85, def: 115 },
  { id: 253, name: '欧米茄', type: 'STEEL', emoji: '🤖', hp: 120, atk: 120, def: 120 }
];

// ==========================================
// [新增] 30只 强力进化型 (ID 301-330)
// 这些是为原版较弱精灵设计的终极进化，数值接近准神
// ==========================================
const EXTRA_EVOS = [
  { id: 301, name: '远古巨蔓藤', type: 'GRASS', emoji: '🌳', hp: 110, atk: 120, def: 130, desc: '藤蔓怪的古代形态' },
  { id: 302, name: '炼狱狮王', type: 'FIRE', emoji: '🦁', hp: 100, atk: 145, def: 90, desc: '爆爆狮的觉醒形态' },
  { id: 303, name: '极地帝企鹅', type: 'ICE', emoji: '🐧', hp: 100, atk: 110, def: 100, desc: '统御冰原的皇帝' },
  { id: 304, name: '雷霆飞鼠', type: 'ELECTRIC', emoji: '🦇', hp: 80, atk: 120, def: 80, desc: '速度超越闪电' },
  { id: 305, name: '风暴雷神', type: 'ELECTRIC', emoji: '🌩️', hp: 90, atk: 135, def: 90, desc: '驾驭风暴的化身' },
  { id: 306, name: '量子反应堆', type: 'STEEL', emoji: '☢️', hp: 90, atk: 90, def: 150, desc: '无限能源的核心' },
  { id: 307, name: '皇家狮鹫', type: 'NORMAL', emoji: '🦅', hp: 95, atk: 125, def: 95, desc: '贵族猫的究极进化' },
  { id: 308, name: '泰坦巨熊', type: 'NORMAL', emoji: '🐻', hp: 180, atk: 140, def: 100, desc: '撼动大地的力量' },
  { id: 309, name: '巫毒人偶王', type: 'GHOST', emoji: '🎎', hp: 80, atk: 150, def: 80, desc: '诅咒之力的顶点' },
  { id: 310, name: '大地撕裂者', type: 'GROUND', emoji: '💅', hp: 100, atk: 145, def: 120, desc: '钢爪王的完全体' },
  { id: 311, name: '天空霸主龙', type: 'ROCK', emoji: '🐲', hp: 100, atk: 135, def: 95, desc: '化石翼龙的返祖形态' },
  { id: 312, name: '污泥魔神', type: 'GROUND', emoji: '🦠', hp: 130, atk: 110, def: 110, desc: '沼泽怪的变异体' },
  { id: 313, name: '冰霜女皇', type: 'ICE', emoji: '👑', hp: 90, atk: 130, def: 90, desc: '雪妖女的最终形态' },
  { id: 314, name: '齐天大圣', type: 'FIRE', emoji: '🐵', hp: 100, atk: 150, def: 100, desc: '斗战胜佛的真身' },
  { id: 315, name: '影流之主', type: 'WATER', emoji: '🥷', hp: 90, atk: 140, def: 80, desc: '忍蛙的禁忌形态' },
  { id: 316, name: '梦幻凤蝶', type: 'BUG', emoji: '🦋', hp: 90, atk: 120, def: 90, desc: '巴大蝶的幻之形态' },
  { id: 317, name: '吸血魔蝠', type: 'POISON', emoji: '🧛', hp: 100, atk: 115, def: 100, desc: '大嘴蝠的暗夜形态' },
  { id: 318, name: '腐化食人花', type: 'GRASS', emoji: '🌺', hp: 110, atk: 120, def: 110, desc: '霸王花的剧毒变种' },
  { id: 319, name: '暗夜猎豹', type: 'NORMAL', emoji: '🐆', hp: 90, atk: 130, def: 90, desc: '猫老大的狩猎形态' },
  { id: 320, name: '狂暴牛魔', type: 'NORMAL', emoji: '🐂', hp: 110, atk: 140, def: 110, desc: '肯泰罗的狂化形态' },
  { id: 321, name: '丰饶女神', type: 'NORMAL', emoji: '🐄', hp: 140, atk: 100, def: 130, desc: '大奶罐的神圣形态' },
  { id: 322, name: '极光海龙', type: 'ICE', emoji: '🐉', hp: 150, atk: 110, def: 110, desc: '拉普拉斯的龙化形态' },
  { id: 323, name: '拟态之神', type: 'NORMAL', emoji: '🫠', hp: 120, atk: 100, def: 100, desc: '百变怪的完美形态' },
  { id: 324, name: '赛博主脑', type: 'NORMAL', emoji: '🧠', hp: 100, atk: 160, def: 90, desc: '多边兽Z的最终升级' },
  { id: 325, name: '深海克拉肯', type: 'ROCK', emoji: '🦑', hp: 100, atk: 120, def: 140, desc: '多刺菊石兽的古神形态' },
  { id: 326, name: '虚空掠夺者', type: 'ROCK', emoji: '🦂', hp: 90, atk: 150, def: 110, desc: '镰刀盔的虚空形态' },
  { id: 327, name: '虫群主宰', type: 'BUG', emoji: '🐝', hp: 100, atk: 110, def: 130, desc: '蜂女王的统御形态' },
  { id: 328, name: '闪电松鼠王', type: 'ELECTRIC', emoji: '🐿️', hp: 90, atk: 100, def: 120, desc: '帕奇利兹的巨大化' },
  { id: 329, name: '樱花女神', type: 'GRASS', emoji: '🌸', hp: 100, atk: 120, def: 100, desc: '樱花儿的绽放形态' },
  { id: 330, name: '四臂修罗', type: 'NORMAL', emoji: '👹', hp: 100, atk: 140, def: 90, desc: '双尾怪手的修罗形态' }
];
// ==========================================
// [新增] 10只 终极神兽 (ID 331-340)
// 压轴登场的宇宙级存在
// ==========================================
const FINAL_GODS = [
  { id: 331, name: '时光沙漏', type: 'STEEL', emoji: '⏳', hp: 120, atk: 100, def: 150, desc: '掌控时间流逝的永恒机械' },
  { id: 332, name: '维度魔神', type: 'PSYCHIC', emoji: '🌌', hp: 110, atk: 160, def: 90, desc: '来自高维空间的不可名状之物' },
  { id: 333, name: '瘟疫之源', type: 'POISON', emoji: '🦠', hp: 130, atk: 110, def: 130, desc: '散播终极病毒的灭世者' },
  { id: 334, name: '雷霆领主', type: 'ELECTRIC', emoji: '⛈️', hp: 100, atk: 155, def: 100, desc: '居住在雷暴中心的闪电化身' },
  { id: 335, name: '沧海之王', type: 'WATER', emoji: '🔱', hp: 140, atk: 130, def: 110, desc: '统御四海的波塞冬' },
  { id: 336, name: '天空之神', type: 'FLYING', emoji: '🌪️', hp: 100, atk: 150, def: 100, desc: '永远漂浮在平流层的风暴之眼' },
  { id: 337, name: '崩山巨兽', type: 'GROUND', emoji: '🏔️', hp: 150, atk: 140, def: 140, desc: '一步就能引发地震的巨兽' },
  { id: 338, name: '摄魂死神', type: 'GHOST', emoji: '💀', hp: 90, atk: 170, def: 90, desc: '收割万物灵魂的终结者' },
  { id: 339, name: '圣灵仙子', type: 'FAIRY', emoji: '🧚‍♀️', hp: 120, atk: 120, def: 120, desc: '净化世间一切邪恶的光芒' },
  { id: 340, name: '灭世魔龙', type: 'DRAGON', emoji: '🐲', hp: 130, atk: 180, def: 110, desc: '传说中将吞噬世界的终焉之龙' }
];
// ==========================================
// [新增] 灵晶兽家族 (ID 372-380)
// 设定：透明的晶体生物，根据石头改变属性和形态
// ==========================================
const CRYSTAL_PETS = [
  // --- 基础形态 ---
  { 
    id: 372, name: '灵晶兽', type: 'NORMAL', emoji: '💎', 
    hp: 55, atk: 55, def: 55, 
    desc: '身体由纯净水晶构成的神秘生物，体内蕴含着无限的可能性。' 
  },

  // --- 1. 火之石 -> 物理攻击型 ---
  { 
    id: 373, name: '赤红晶卫', type: 'FIRE', emoji: '🔴', 
    hp: 65, atk: 130, def: 60, 
    desc: '吸收了火焰能量，晶体变得如岩浆般滚烫，擅长粉碎敌人的物理攻击。' 
  },

  // --- 2. 水之石 -> 高HP肉盾型 ---
  { 
    id: 374, name: '碧蓝晶卫', type: 'WATER', emoji: '🔵', 
    hp: 130, atk: 65, def: 60, 
    desc: '身体如同深海般深邃，拥有极强的自我修复能力和生命力。' 
  },

  // --- 3. 雷之石 -> 极速特攻型 ---
  { 
    id: 375, name: '紫电晶卫', type: 'ELECTRIC', emoji: '⚡', 
    hp: 60, atk: 65, def: 60, 
    desc: '化作一道紫色的闪电，速度快到肉眼无法捕捉。' 
  },

  // --- 4. 叶之石 -> 物理防御型 ---
  { 
    id: 376, name: '翠绿晶卫', type: 'GRASS', emoji: '❇️', 
    hp: 65, atk: 90, def: 130, 
    desc: '与大自然融为一体，晶体表面覆盖着坚硬的藤蔓装甲。' 
  },

  // --- 5. 冰之石 -> 特殊防御型 ---
  { 
    id: 377, name: '苍白晶卫', type: 'ICE', emoji: '❄️', 
    hp: 65, atk: 60, def: 95, 
    desc: '散发着绝对零度的寒气，能冻结接近的一切，拥有极强的魔法抗性。' 
  },

  // --- 6. 月之石 -> 幽灵/干扰型 ---
  { 
    id: 378, name: '幽夜晶卫', type: 'GHOST', emoji: '🟣', 
    hp: 60, atk: 65, def: 60, 
    desc: '身体变得半透明且虚无，潜伏在阴影中收割灵魂。' 
  },

  // --- 7. 日之石 -> 超能/爆发型 ---
  { 
    id: 379, name: '辉光晶卫', type: 'PSYCHIC', emoji: '🌟', 
    hp: 60, atk: 60, def: 60, 
    desc: '折射太阳的光辉，能释放出毁灭性的精神念力波。' 
  },

  // --- 8. 暗之石 -> 毒/刺客型 ---
  { 
    id: 380, name: '黑曜晶卫', type: 'POISON', emoji: '⬛', 
    hp: 80, atk: 110, def: 75, 
    desc: '晶体变成了吸收光线的黑曜石，浑身流淌着剧毒。' 
  }
];

const UNIQUE_REWARD_PET = { 
  id: 341, 
  name: '暗黑超梦', 
  type: 'PSYCHIC', 
  emoji: '😈', 
  hp: 106, atk: 150, def: 90, 
  desc: '日蚀队集结全科技力量制造的终极兵器，身穿抑制力量的装甲。' 
};

// ==========================================
// [新增] 填补 ID 284-300 的全新进化链
// 包含 5 组三段进化 + 1 组二段进化
// ==========================================
const NEW_EVO_CHAINS = [
  // --- 1. 幽灵/火系：鬼火链 (高特攻/高速度) ---
  { id: 284, name: '鬼火球', type: 'GHOST', emoji: '🔥', hp: 40, atk: 60, def: 40, evo: 285, evoLvl: 18, desc: '徘徊在墓地的微弱火苗' },
  { id: 285, name: '噬魂灯笼', type: 'GHOST', emoji: '🏮', hp: 65, atk: 90, def: 60, evo: 286, evoLvl: 38, desc: '会吸取路人灵魂的灯笼' },
  { id: 286, name: '冥界鬼王', type: 'FIRE', emoji: '👹', hp: 85, atk: 135, def: 85, desc: '统御万鬼的炼狱霸主' },

  // --- 2. 冰/钢系：极寒链 (高防御/高HP) ---
  { id: 287, name: '冰棱锥', type: 'ICE', emoji: '💎', hp: 50, atk: 40, def: 70, evo: 288, evoLvl: 20, desc: '坚硬的万年玄冰碎片' },
  { id: 288, name: '冰霜巨像', type: 'ICE', emoji: '⛄', hp: 80, atk: 70, def: 100, evo: 289, evoLvl: 45, desc: '不知疲倦的极寒守卫' },
  { id: 289, name: '永恒要塞', type: 'STEEL', emoji: '🏯', hp: 110, atk: 90, def: 150, desc: '无法被攻破的移动堡垒' },

  // --- 3. 电/超能系：脑波链 (极高特攻/脆皮) ---
  { id: 290, name: '脑波水母', type: 'ELECTRIC', emoji: '👾', hp: 35, atk: 65, def: 35, evo: 291, evoLvl: 22, desc: '通过电流交流的浮游生物' },
  { id: 291, name: '神经网络', type: 'PSYCHIC', emoji: '🧠', hp: 55, atk: 95, def: 55, evo: 292, evoLvl: 42, desc: '数千个大脑连接而成的网络' },
  { id: 292, name: '宇宙主脑', type: 'PSYCHIC', emoji: '👁️', hp: 75, atk: 145, def: 75, desc: '全知全能的各种族智慧顶点' },

  // --- 4. 虫/毒系：瘟疫链 (高攻击/异常状态) ---
  { id: 293, name: '寄生幼虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 55, def: 45, evo: 294, evoLvl: 15, desc: '潜伏在暗处的危险幼虫' },
  { id: 294, name: '尸骨魔茧', type: 'POISON', emoji: '🏺', hp: 60, atk: 40, def: 110, evo: 295, evoLvl: 35, desc: '散发着剧毒气体的硬茧' },
  { id: 295, name: '瘟疫领主', type: 'POISON', emoji: '🦂', hp: 95, atk: 130, def: 95, desc: '所过之处寸草不生的毒皇' },

  // --- 5. 地面/格斗系：掘地链 (高物攻/高HP) ---
  { id: 296, name: '掘地小子', type: 'GROUND', emoji: '👷', hp: 50, atk: 60, def: 50, evo: 297, evoLvl: 25, desc: '整天拿着铲子挖洞的少年' },
  { id: 297, name: '钻头狂人', type: 'GROUND', emoji: '🔩', hp: 80, atk: 90, def: 70, evo: 298, evoLvl: 48, desc: '双手改造成钻头的疯狂矿工' },
  { id: 298, name: '地心破坏者', type: 'FIGHT', emoji: '🚜', hp: 120, atk: 140, def: 100, desc: '能粉碎地壳的究极兵器' },

  // --- 6. 妖精/龙系：虹光链 (二段进化，准神级) ---
  { id: 299, name: '幼龙仙子', type: 'FAIRY', emoji: '🦎', hp: 60, atk: 70, def: 60, evo: 300, evoLvl: 55, desc: '传说中诞生于彩虹的幼龙' },
  { id: 300, name: '虹光龙神', type: 'DRAGON', emoji: '🌈', hp: 100, atk: 135, def: 100, desc: '驾驭七色光芒的梦幻龙神' }
];

// ==========================================
// [新增] 30只 远古神兽/圣兽 (ID 254-283)
// ==========================================
const GOD_PETS = [
  { id: 254, name: '起源之光', type: 'GOD', emoji: '✨', desc: '万物的起源' },
  { id: 255, name: '终焉之暗', type: 'GHOST', emoji: '⚫', desc: '吞噬一切的虚无' },
  { id: 256, name: '日轮神', type: 'FIRE', emoji: '☀️', desc: '太阳的化身' },
  { id: 257, name: '月华神', type: 'FAIRY', emoji: '🌙', desc: '月亮的守护者' },
  { id: 258, name: '星界龙王', type: 'DRAGON', emoji: '🪐', desc: '穿梭星系的巨龙' },
  { id: 259, name: '大地泰坦', type: 'GROUND', emoji: '🗿', desc: '支撑大陆的巨人' },
  { id: 260, name: '深海利维坦', type: 'WATER', emoji: '🐋', desc: '引发海啸的巨兽' },
  { id: 261, name: '天空主宰', type: 'FLYING', emoji: '🦅', desc: '统治苍穹的霸主' },
  { id: 262, name: '雷霆宙斯', type: 'ELECTRIC', emoji: '⚡', desc: '掌控雷罚的神明' },
  { id: 263, name: '极寒冰帝', type: 'ICE', emoji: '❄️', desc: '冻结时间的帝王' },
  { id: 264, name: '生命之树', type: 'GRASS', emoji: '🌳', desc: '赋予万物生机' },
  { id: 265, name: '死亡之翼', type: 'GHOST', emoji: '💀', desc: '带来凋零的使者' },
  { id: 266, name: '时光守护者', type: 'PSYCHIC', emoji: '⏳', desc: '穿梭过去未来' },
  { id: 267, name: '空间撕裂者', type: 'PSYCHIC', emoji: '🌌', desc: '斩断维度的利刃' },
  { id: 268, name: '混沌魔君', type: 'POISON', emoji: '👿', desc: '混乱与无序的源头' },
  { id: 269, name: '秩序圣骑', type: 'STEEL', emoji: '🛡️', desc: '绝对的正义与法则' },
  { id: 270, name: '武斗神', type: 'FIGHT', emoji: '👊', desc: '武道的极致' },
  { id: 271, name: '元素领主', type: 'NORMAL', emoji: '🎨', desc: '融合所有元素之力' },
  { id: 272, name: '机械降神', type: 'STEEL', emoji: '🤖', desc: '超越生物的科技顶点' },
  { id: 273, name: '梦境编织者', type: 'FAIRY', emoji: '🦄', desc: '编织现实与梦境' },
  { id: 274, name: '深渊凝视者', type: 'GHOST', emoji: '👁️', desc: '来自深渊的恐怖' },
  { id: 275, name: '熔岩魔神', type: 'FIRE', emoji: '🌋', desc: '沐浴岩浆的魔神' },
  { id: 276, name: '风暴之怒', type: 'FLYING', emoji: '🌪️', desc: '永不停息的飓风' },
  { id: 277, name: '剧毒母皇', type: 'POISON', emoji: '🕷️', desc: '万毒之祖' },
  { id: 278, name: '金刚不坏', type: 'ROCK', emoji: '💎', desc: '永恒不灭的躯体' },
  { id: 279, name: '幻影之王', type: 'PSYCHIC', emoji: '🎭', desc: '真假难辨的幻术' },
  { id: 280, name: '虫群之心', type: 'BUG', emoji: '🦗', desc: '统御亿万虫群' },
  { id: 281, name: '斩铁剑圣', type: 'STEEL', emoji: '⚔️', desc: '一剑开天' },
  { id: 282, name: '治愈女神', type: 'HEAL', emoji: '🧚‍♀️', desc: '抚平一切伤痛' },
  { id: 283, name: '创世元灵', type: 'GOD', emoji: '💠', desc: '一切的开始与结束' }
];
// ==========================================
// [新增] 时间与天气配置
// ==========================================
const TIME_PHASES = {
  DAY:   { name: '白天', color: 'transparent', icon: '☀️', duration: 1800 }, // 30分钟
  DUSK:  { name: '黄昏', color: 'rgba(255, 167, 38, 0.3)', icon: '🌇', duration: 900 }, // 15分钟
  NIGHT: { name: '夜晚', color: 'rgba(20, 20, 60, 0.6)', icon: '🌙', duration: 1800 } // 30分钟
};

const WEATHERS = {
  CLEAR: { name: '晴朗', desc: '无特殊效果', icon: '☀️' },
  RAIN:  { name: '下雨', desc: '水系威力↑ 火系威力↓', icon: '🌧️' },
  SUN:   { name: '大晴天', desc: '火系威力↑ 水系威力↓', icon: '🔥' },
  SAND:  { name: '沙暴', desc: '岩/地/钢特防↑ 其他受伤害', icon: '🌪️' },
  SNOW:  { name: '冰雹', desc: '冰系防御↑ 其他受伤害', icon: '❄️' }
};

// ==========================================
// [重制] 50只 机制专属进化精灵 (ID 381-430)
// 拒绝填充怪，全员具备特殊进化条件
// ==========================================
const TIME_WEATHER_PETS = [
  // ------------------------------------------------------
  // [组1：昼夜双子] 同一种幼体，根据时间进化为不同形态
  // ------------------------------------------------------
  { id: 381, name: '时之沙', type: 'NORMAL', emoji: '⏳', hp: 45, atk: 45, def: 45, evo: 382, evoLvl: 20, desc: '身体里流淌着时间的沙砾，对光线非常敏感' },
  // 白天进化 -> 光系战士
  { id: 382, name: '晨曦卫士', type: 'FIGHT', emoji: '🌞', hp: 80, atk: 110, def: 70, evoCondition: { time: 'DAY' }, desc: '只在白天进化。吸收阳光作为铠甲，正义感极强' },
  // 夜晚进化 -> 暗系刺客
  { id: 383, name: '暮夜行者', type: 'DARK', emoji: '🥷', hp: 70, atk: 120, def: 60, evoCondition: { time: 'NIGHT' }, desc: '只在夜晚进化。潜伏在阴影中，无声无息' },

  // ------------------------------------------------------
  // [组2：天气预报员] 漂浮泡泡的远亲，根据天气变异
  // ------------------------------------------------------
  { id: 384, name: '云团团', type: 'FLYING', emoji: '☁️', hp: 50, atk: 40, def: 40, evo: 385, evoLvl: 25, desc: '一团不稳定的水汽，极易受天气影响' },
  // 雨天 -> 暴风雨形态
  { id: 385, name: '雷雨君主', type: 'ELECTRIC', emoji: '⛈️', hp: 85, atk: 105, def: 80, evoCondition: { weather: 'RAIN' }, desc: '在暴雨中吸收雷电进化，性格暴躁' },
  // 晴天 -> 热气球形态
  { id: 386, name: '热能气旋', type: 'FIRE', emoji: '🎈', hp: 90, atk: 90, def: 90, evoCondition: { weather: 'SUN' }, desc: '在烈日下膨胀进化，体内充满高压热气' },
  // 雪天 -> 冰晶形态
  { id: 387, name: '绝对零度', type: 'ICE', emoji: '❄️', hp: 70, atk: 80, def: 130, evoCondition: { weather: 'SNOW' }, desc: '在冰雹中凝结进化，防御力极高' },

  // ------------------------------------------------------
  // [组3：黄昏的挽歌] 只能在黄昏(15分钟窗口期)进化的幽灵
  // ------------------------------------------------------
  { id: 388, name: '迷途灵', type: 'GHOST', emoji: '👻', hp: 40, atk: 60, def: 40, evo: 389, evoLvl: 30, desc: '在逢魔之时徘徊的弱小灵体' },
  { id: 389, name: '黄昏钟摆', type: 'STEEL', emoji: '🕰️', hp: 70, atk: 90, def: 90, evo: 390, evoLvl: 45, evoCondition: { time: 'DUSK' }, desc: '只在黄昏进化。身体变成了古老的时钟' },
  { id: 390, name: '终焉时刻', type: 'GHOST', emoji: '⚰️', hp: 90, atk: 130, def: 100, evoCondition: { time: 'DUSK' }, desc: '敲响丧钟的死神，掌控着时间的终结' },

  // ------------------------------------------------------
  // [组4：沙漠的霸主] 需沙暴天气进化
  // ------------------------------------------------------
  { id: 391, name: '沙丘虫', type: 'BUG', emoji: '🐛', hp: 45, atk: 55, def: 60, evo: 392, evoLvl: 22, desc: '躲在沙子底下的虫子' },
  { id: 392, name: '岩壳蛹', type: 'ROCK', emoji: '🪨', hp: 60, atk: 40, def: 110, evo: 393, evoLvl: 40, evoCondition: { weather: 'SAND' }, desc: '在沙暴中磨砺外壳，坚硬无比' },
  { id: 393, name: '荒漠暴君', type: 'GROUND', emoji: '🦂', hp: 95, atk: 135, def: 115, evoCondition: { weather: 'SAND' }, desc: '沙暴的化身，能瞬间制造流沙陷阱' },

  // ------------------------------------------------------
  // [组5：极光的恩赐] 需夜晚+冰雹 (极难条件)
  // ------------------------------------------------------
  { id: 394, name: '星光海豹', type: 'WATER', emoji: '🦭', hp: 60, atk: 50, def: 50, evo: 395, evoLvl: 35, desc: '喜欢仰望星空的小海豹' },
  { id: 395, name: '极光海妖', type: 'ICE', emoji: '🧜‍♀️', hp: 100, atk: 120, def: 95, evoCondition: { time: 'NIGHT', weather: 'SNOW' }, desc: '只有在飘雪的夜晚才会进化，美丽而致命' },

  // ------------------------------------------------------
  // [组6：光合作用] 需白天+大晴天
  // ------------------------------------------------------
  { id: 396, name: '枯萎草', type: 'GRASS', emoji: '🍂', hp: 30, atk: 30, def: 30, evo: 397, evoLvl: 20, desc: '极度缺乏能量，看起来快枯死了' },
  { id: 397, name: '复苏之叶', type: 'GRASS', emoji: '🌿', hp: 60, atk: 70, def: 60, evo: 398, evoLvl: 40, evoCondition: { time: 'DAY', weather: 'SUN' }, desc: '在烈日下获得了新生' },
  { id: 398, name: '太阳神木', type: 'GRASS', emoji: '🌳', hp: 110, atk: 100, def: 110, evoCondition: { time: 'DAY', weather: 'SUN' }, desc: '吸收了过量的太阳能，树冠如火焰般燃烧' },

  // ------------------------------------------------------
  // [组7：情感的羁绊] 纯亲密度进化 (需 Intimacy > 220)
  // ------------------------------------------------------
  { id: 399, name: '黏人猫', type: 'NORMAL', emoji: '🐱', hp: 50, atk: 60, def: 50, evo: 400, evoLvl: 1, evoCondition: { intimacy: 220 }, desc: '一刻也不想离开主人的小猫' },
  { id: 400, name: '心灵伴侣', type: 'PSYCHIC', emoji: '😻', hp: 85, atk: 115, def: 85, desc: '与训练家心灵相通，能预知主人的想法' },

  { id: 401, name: '护主犬', type: 'NORMAL', emoji: '🐶', hp: 55, atk: 65, def: 55, evo: 402, evoLvl: 1, evoCondition: { intimacy: 220 }, desc: '为了保护主人敢于挑战强敌' },
  { id: 402, name: '圣盾骑士', type: 'STEEL', emoji: '🛡️', hp: 90, atk: 100, def: 130, desc: '化身为守护之盾，防御力惊人' },

  // ------------------------------------------------------
  // [组8：被遗弃的怨念] 低亲密度进化 (需 Intimacy < 50，设定上很难达成)
  // 这里为了游戏性，改为：夜晚 + 亲密度 >= 100 (安抚怨灵)
  // ------------------------------------------------------
  { id: 403, name: '破布偶', type: 'GHOST', emoji: '🧸', hp: 40, atk: 80, def: 30, evo: 404, evoLvl: 30, desc: '被遗弃的玩偶，充满了怨气' },
  { id: 404, name: '复仇傀儡', type: 'GHOST', emoji: '🔪', hp: 60, atk: 110, def: 60, evo: 405, evoLvl: 50, evoCondition: { time: 'NIGHT', intimacy: 150 }, desc: '被爱感化后进化。虽然外表可怕，但发誓守护主人' },
  { id: 405, name: '救赎之灵', type: 'HEAL', emoji: '🧚‍♀️', hp: 100, atk: 90, def: 120, desc: '彻底净化了怨气，转化为治愈的力量' },

  // ------------------------------------------------------
  // [组9：雨林生态] 需雨天进化
  // ------------------------------------------------------
  { id: 406, name: '青苔石', type: 'ROCK', emoji: '🪨', hp: 50, atk: 50, def: 80, evo: 407, evoLvl: 25, evoCondition: { weather: 'RAIN' }, desc: '只有在湿润环境下才会生长' },
  { id: 407, name: '丛林巨像', type: 'GRASS', emoji: '🗿', hp: 90, atk: 110, def: 100, desc: '岩石与植物的完美共生体' },

  { id: 408, name: '小水滴', type: 'WATER', emoji: '💧', hp: 30, atk: 30, def: 30, evo: 409, evoLvl: 15, evoCondition: { weather: 'RAIN' }, desc: '极其脆弱的水元素' },
  { id: 409, name: '激流之灵', type: 'WATER', emoji: '🌊', hp: 60, atk: 80, def: 60, evo: 410, evoLvl: 40, evoCondition: { weather: 'RAIN' }, desc: '在暴雨中欢快起舞' },
  { id: 410, name: '海啸领主', type: 'WATER', emoji: '🔱', hp: 100, atk: 120, def: 90, desc: '能够引发海啸的深海霸主' },

  // ------------------------------------------------------
  // [组10：星空观测者] 需夜晚进化
  // ------------------------------------------------------
  { id: 411, name: '望远镜怪', type: 'STEEL', emoji: '🔭', hp: 50, atk: 70, def: 50, evo: 412, evoLvl: 30, evoCondition: { time: 'NIGHT' }, desc: '总是盯着星星看' },
  { id: 412, name: '星轨观测站', type: 'PSYCHIC', emoji: '📡', hp: 80, atk: 130, def: 80, desc: '接收来自宇宙的神秘信号' },

  { id: 413, name: '萤火虫', type: 'BUG', emoji: '🪰', hp: 35, atk: 45, def: 35, evo: 414, evoLvl: 20, evoCondition: { time: 'NIGHT' }, desc: '尾部发出微弱的光' },
  { id: 414, name: '星光飞蛾', type: 'FAIRY', emoji: '🦋', hp: 70, atk: 100, def: 70, desc: '翅膀上的鳞粉如同星尘般闪耀' },

  // ------------------------------------------------------
  // [组11：太阳能机械] 需白天进化
  // ------------------------------------------------------
  { id: 415, name: '光能电池', type: 'ELECTRIC', emoji: '🔋', hp: 50, atk: 50, def: 60, evo: 416, evoLvl: 30, evoCondition: { time: 'DAY' }, desc: '需要阳光充电' },
  { id: 416, name: '聚能加农炮', type: 'STEEL', emoji: '🔫', hp: 80, atk: 140, def: 80, desc: '将吸收的太阳能转化为毁灭光束' },

  // ------------------------------------------------------
  // [组12：季节变换] 模拟季节 (通过天气)
  // ------------------------------------------------------
  { id: 417, name: '四季鹿', type: 'NORMAL', emoji: '🦌', hp: 60, atk: 60, def: 60, evo: 418, evoLvl: 30, desc: '根据进化时的天气改变属性' },
  // 晴天进化 -> 春之鹿 (草)
  { id: 418, name: '繁花神鹿', type: 'GRASS', emoji: '🌸', hp: 95, atk: 100, def: 95, evoCondition: { weather: 'SUN' }, desc: '象征春天的到来，所过之处鲜花盛开' },
  // 雪天进化 -> 冬之鹿 (冰)
  { id: 419, name: '凛冬神鹿', type: 'ICE', emoji: '❄️', hp: 95, atk: 100, def: 95, evoCondition: { weather: 'SNOW' }, desc: '象征冬天的严寒，呼出的气息能冻结空气' },

  // ------------------------------------------------------
  // [组13：剧毒沼泽] 需雨天 (模拟湿地)
  // ------------------------------------------------------
  { id: 420, name: '泥浆怪', type: 'POISON', emoji: '💩', hp: 60, atk: 50, def: 60, evo: 421, evoLvl: 35, evoCondition: { weather: 'RAIN' }, desc: '干燥时会变硬，喜欢雨天' },
  { id: 421, name: '腐化沼泽王', type: 'POISON', emoji: '🧟', hp: 110, atk: 95, def: 100, desc: '身体由剧毒的淤泥构成' },

  // ------------------------------------------------------
  // [组14：风暴骑士] 需雨天 (模拟雷暴)
  // ------------------------------------------------------
  { id: 422, name: '静电飞鼠', type: 'ELECTRIC', emoji: '🐿️', hp: 50, atk: 70, def: 40, evo: 423, evoLvl: 30, evoCondition: { weather: 'RAIN' }, desc: '利用雷雨天的静电飞行' },
  { id: 423, name: '雷霆狮鹫', type: 'FLYING', emoji: '🦅', hp: 80, atk: 120, def: 80, desc: '驾驭雷电的神兽，速度极快' },

  // ------------------------------------------------------
  // [组15：熔岩锻造] 需大晴天 (模拟高温)
  // ------------------------------------------------------
  { id: 424, name: '铁矿石', type: 'ROCK', emoji: '🪨', hp: 60, atk: 40, def: 80, evo: 425, evoLvl: 35, evoCondition: { weather: 'SUN' }, desc: '普通的铁矿石' },
  { id: 425, name: '熔岩铠甲', type: 'FIRE', emoji: '🦾', hp: 90, atk: 110, def: 130, desc: '在高温下重铸了身体，流淌着岩浆' },

  // ------------------------------------------------------
  // [组16：极地探险家] 需冰雹
  // ------------------------------------------------------
  { id: 426, name: '登山雪人', type: 'ICE', emoji: '⛄', hp: 70, atk: 70, def: 60, evo: 427, evoLvl: 40, evoCondition: { weather: 'SNOW' }, desc: '在暴风雪中迷路的雪人' },
  { id: 427, name: '雪山守护神', type: 'ICE', emoji: '🦍', hp: 120, atk: 130, def: 100, desc: '守护着雪山的古老生物' },

  // ------------------------------------------------------
  // [组17：古代遗迹] 需沙暴
  // ------------------------------------------------------
  { id: 428, name: '陶土偶', type: 'GROUND', emoji: '🏺', hp: 50, atk: 50, def: 70, evo: 429, evoLvl: 30, evoCondition: { weather: 'SAND' }, desc: '古代文明的遗物' },
  { id: 429, name: '沙暴魔神', type: 'PSYCHIC', emoji: '🧞', hp: 80, atk: 140, def: 80, desc: '从沙暴中苏醒的古代魔神' },
  // ------------------------------------------------------
  // [组18：终极羁绊] 需满亲密度 (255) + 黄昏 (最难条件)
  // ------------------------------------------------------
  // 初始形态：流星之子
  { 
    id: 430, 
    name: '流星之子', 
    type: 'NORMAL', 
    emoji: '💫', 
    hp: 50, atk: 50, def: 50, 
    // 设定进化目标为 431
    evo: 431, 
    evoLvl: 1, // 等级不限，只要满足条件
    // 核心条件：亲密度满 + 黄昏时段
    evoCondition: { intimacy: 255, time: 'DUSK' }, 
    desc: '从天而降的微弱星光，只有在最真挚的羁绊下才会觉醒。' 
  },
  
  // 终极形态：奇迹之星
  { 
    id: 431, 
    name: '奇迹之星', 
    type: 'GOD', 
    emoji: '🌟', 
    hp: 120, atk: 120, def: 120, 
    desc: '【全服唯一】只有与训练家达到心灵合一，并在昼夜交替的奇迹时刻才能诞生的传说精灵。它代表着可能性的极限。' 
  }];

// ==========================================
// 3. 处理 POKEDEX 初始化 (合并所有数据源)
// ==========================================
const POKEDEX = [];

// 1. 合并所有数据源
// 顺序：基础 -> 旧神兽 -> 新进化链 -> 强力进化型 -> 终极神兽
const ALL_SOURCE_DATA = [
    ...BASE_POKEDEX, 
    ...GOD_PETS, 
    ...NEW_EVO_CHAINS, 
    ...EXTRA_EVOS,
    ...FINAL_GODS ,// <--- 插入这一行
  ...STONE_EVO_PETS, // <--- 添加这一行
   ...TIME_WEATHER_PETS, // <--- 添加这一行
     UNIQUE_REWARD_PET,
   ...CRYSTAL_PETS
];

// 2. 找出最大ID (目前是 340)
const MAX_DEX_ID = Math.max(...ALL_SOURCE_DATA.map(p => p.id), 341);

// 3. 填充图鉴... (保持不变)
for(let i=1; i<=MAX_DEX_ID; i++) {
  const existing = ALL_SOURCE_DATA.find(p => p.id === i);
  if (existing) {
    POKEDEX.push(existing);
  } else {
    POKEDEX.push({ id: i, name: `野生精灵#${i}`, type: 'NORMAL', emoji: '🐾', hp: 50, atk: 50, def: 50 });
  }
}




// ==========================================
// 4. 补充缺失的常量定义 (修复 MAPS is not defined)
// ==========================================

const TRAINER_NAMES = ['小智', '小霞', '捕虫少年', '短裤小子', '精英训练师', '火箭队手下', '阿金', '希罗娜', '大吾', '赤红', 'N', '露西', '短裙少女', '登山大叔', '钓鱼佬', '超能力者', '空手道王', '暴走族', '研究员', '富家少爷', '双子星'];

const CHALLENGES = [
  { 
    id: 'c1', 
    title: '闪光伊布的试炼', 
    desc: '初级训练师的入门战', 
    req: 5, 
    boss: 125, // 伊布
    bossLvl: 20, 
    teamSize: 3, 
    rewardId: 125, 
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', 
    color: '#E65100'
  },
  { 
    id: 'c2', 
    title: '燃烧的九尾', 
    desc: '对抗火焰的精英小队', 
    req: 20, 
    boss: 11, 
    bossLvl: 35, 
    teamSize: 4, 
    rewardId: 11, 
    bg: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)', 
    color: '#C62828'
  },
  { 
    id: 'c3', 
    title: '深海巨兽', 
    desc: '海洋霸主与其护卫', 
    req: 40, 
    boss: 123, 
    bossLvl: 50, 
    teamSize: 4, 
    rewardId: 123, 
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', 
    color: '#1565C0'
  },
  { 
    id: 'c4', 
    title: '合金风暴', 
    desc: '坚不可摧的钢铁防线', 
    req: 60, 
    boss: 140, 
    bossLvl: 60, 
    teamSize: 5, 
    rewardId: 140, 
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)', 
    color: '#455A64'
  },
  { 
    id: 'c5', 
    title: '龙之逆鳞', 
    desc: '准神兽的满员战队', 
    req: 80, 
    boss: 182, 
    bossLvl: 70, 
    teamSize: 6, 
    rewardId: 182, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', 
    color: '#6A1B9A'
  },
  { 
    id: 'c6', 
    title: '绝对零度', 
    desc: '传说中的急冻鸟', 
    req: 100, 
    boss: 91, 
    bossLvl: 80, 
    teamSize: 6, 
    rewardId: 91, 
    bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', 
    color: '#00838F'
  },
  { 
    id: 'c7', 
    title: '雷霆主宰', 
    desc: '传说中的闪电鸟', 
    req: 120, 
    boss: 92, 
    bossLvl: 85, 
    teamSize: 6, 
    rewardId: 92, 
    bg: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)', 
    color: '#F9A825'
  },
  { 
    id: 'c8', 
    title: '创世降临', 
    desc: '挑战宝可梦之神', 
    req: 150, 
    boss: 150, 
    bossLvl: 99, 
    teamSize: 6, 
    rewardId: 150, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', 
    color: '#4A148C'
  },
   { 
    id: 'c9', 
    title: '超能念力场', 
    desc: '对抗精神力量的极致', 
    req: 180, // 需要收集 180 只
    boss: 94, // 超能主宰 (超梦原型)
    bossLvl: 85, 
    teamSize: 6, 
    rewardId: 94, 
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 100%)', 
    color: '#8E24AA'
  },
  { 
    id: 'c10', 
    title: '钢铁长城', 
    desc: '无法被攻破的绝对防御', 
    req: 200, 
    boss: 206, // 合金暴龙
    bossLvl: 90, 
    teamSize: 6, 
    rewardId: 206, 
    bg: 'linear-gradient(135deg, #ECEFF1 0%, #B0BEC5 100%)', 
    color: '#455A64'
  },
  { 
    id: 'c11', 
    title: '远古巨兽', 
    desc: '来自史前的原始力量', 
    req: 220, 
    boss: 259, // 大地泰坦
    bossLvl: 95, 
    teamSize: 6, 
    rewardId: 259, 
    bg: 'linear-gradient(135deg, #EFEBE9 0%, #A1887F 100%)', 
    color: '#5D4037'
  },
  { 
    id: 'c12', 
    title: '光与暗之歌', 
    desc: '同时面对光神与暗神', 
    req: 250, 
    boss: 254, // 起源之光 (实际上会在战斗逻辑里生成双Boss或强力Boss)
    bossLvl: 99, 
    teamSize: 6, 
    rewardId: 255, // 终焉之暗
    bg: 'linear-gradient(135deg, #212121 0%, #000000 100%)', 
    color: '#FFD700'
  }
];

// ==========================================
// [更新] 地图配置 (已注入 ID 381+ 的特殊进化精灵)
// ==========================================
const MAPS = [
  { 
    id: 1, name: '微风草原', lvl: [2, 10], 
    // 新增: 384(云团团), 396(枯萎草), 399(黏人猫), 401(护主犬), 413(萤火虫), 417(四季鹿), 422(静电飞鼠)
    pool: [1, 4, 8, 16, 21, 41, 44, 46, 11, 101, 104, 107, 110, 115, 118, 125, 152, 161, 164, 172, 216, 232, 171, 175, 177, 231, 251, 384, 396, 399, 401, 413, 417, 422], 
    drop: 50, type: 'grass', color: '#C8E6C9', gymLeader: 117, gymLvl: 15, badge: '🍃', icon: '🌿' 
  },
  { 
    id: 2, name: '回声山谷', lvl: [10, 25], 
    // 新增: 406(青苔石), 424(铁矿石)
    pool: [6, 14, 31, 34, 38, 51, 62, 64, 66, 68, 111, 113, 121, 133, 135, 166, 169, 198, 190, 213, 230, 245, 296, 372, 73, 205, 406, 424], 
    drop: 100, type: 'mountain', color: '#FFF9C4', gymLeader: 65, gymLvl: 28, badge: '🪨', icon: '⛰️' 
  },
  { 
    id: 3, name: '遗迹工厂', lvl: [20, 40], 
    // 新增: 415(光能电池)
    pool: [34, 40, 54, 57, 60, 85, 87, 18, 5, 114, 116, 131, 119, 124, 127, 128, 189, 192, 200, 203, 219, 235, 239, 293, 247, 415], 
    drop: 200, boss: 140, type: 'factory', color: '#E1BEE7', gymLeader: 35, gymLvl: 42, badge: '⚡', icon: '🏭' 
  },
  { 
    id: 4, name: '深蓝海域', lvl: [30, 55], 
    // 新增: 408(小水滴), 420(泥浆怪)
    pool: [22, 24, 26, 28, 30, 76, 79, 82, 27, 108, 120, 123, 126, 134, 136, 158, 173, 176, 206, 222, 238, 408, 420], 
    drop: 350, boss: 100, type: 'water', color: '#B3E5FC', gymLeader: 23, gymLvl: 58, badge: '💧', icon: '🌊' 
  },
  { 
    id: 5, name: '熔岩火山', lvl: [40, 65], 
    // 火山保持原样，或者可以放一些耐热的
    pool: [11, 12, 13, 14, 15, 16, 17, 20, 93, 104, 105, 106, 128, 155, 193, 201, 217, 233], 
    drop: 400, boss: 97, type: 'fire', color: '#FFCCBC', gymLeader: 106, gymLvl: 68, badge: '🔥', icon: '🌋' 
  },
  { 
    id: 6, name: '赛博都市', lvl: [50, 75], 
    // 新增: 411(望远镜怪)
    pool: [35, 40, 87, 88, 89, 132, 140, 148, 149, 160, 170, 189, 200, 250, 290, 209, 411], 
    drop: 450, boss: 150, type: 'city', color: '#CFD8DC', gymLeader: 140, gymLvl: 78, badge: '🤖', icon: '🏙️' 
  },
  { 
    id: 7, name: '幽灵古堡', lvl: [55, 80], 
    // 新增: 388(迷途灵)
    pool: [18, 19, 54, 55, 56, 59, 90, 130, 144, 146, 178, 179, 185, 188, 204, 225, 240, 284, 207, 388], 
    drop: 480, boss: 144, type: 'ghost', color: '#D1C4E9', gymLeader: 56, gymLvl: 82, badge: '👻', icon: '🏰' 
  },
  { 
    id: 8, name: '天空王座', lvl: [70, 100], 
    // 新增: 430(流星之子) - 稀有
    pool: [3, 7, 9, 13, 15, 17, 19, 23, 33, 35, 39, 43, 49, 50, 53, 56, 59, 63, 65, 69, 71, 78, 81, 84, 94, 103, 106, 109, 112, 117, 122, 129, 130, 132, 137, 138, 139, 141, 144, 149, 182, 183, 196, 197, 199, 208, 229, 244, 249, 37, 215, 227, 430], 
    drop: 600, boss: 150, type: 'sky', color: '#FFE0B2', gymLeader: 138, gymLvl: 95, badge: '👑', icon: '☁️' 
  },
  { 
    id: 9, name: '极寒冻土', lvl: [60, 85], 
    // 新增: 394(星光海豹), 426(登山雪人)
    pool: [86, 87, 90, 91, 124, 131, 144, 187, 188, 197, 199, 203, 204, 234, 243, 287, 394, 426], 
    drop: 550, type: 'ice', color: '#E0F7FA', gymLeader: 199, gymLvl: 88, badge: '❄️', icon: '🏔️' 
  },
  { 
    id: 10, name: '流沙荒漠', lvl: [45, 70], 
    // 新增: 381(时之沙), 391(沙丘虫), 428(陶土偶)
    pool: [27, 28, 50, 51, 74, 75, 76, 95, 104, 105, 111, 112, 184, 185, 190, 219, 220, 248, 223, 252, 381, 391, 428], 
    drop: 420, type: 'ground', color: '#FFE082', gymLeader: 184, gymLvl: 72, badge: '🏜️', icon: '🐪' 
  },
  { 
    id: 11, name: '糖果王国', lvl: [35, 60], 
    // 新增: 403(破布偶)
    pool: [35, 36, 39, 40, 113, 122, 124, 173, 174, 183, 194, 217, 218, 299, 403], 
    drop: 380, type: 'fairy', color: '#F8BBD0', gymLeader: 194, gymLvl: 62, badge: '🍭', icon: '🏰' 
  },
  { 
    id: 12, name: '银河空间站', lvl: [80, 99], 
    pool: [63, 64, 65, 81, 82, 100, 101, 132, 137, 145, 150, 151, 189, 200, 221, 222, 237, 253], 
    drop: 800, type: 'space', color: '#311B92', gymLeader: 150, gymLvl: 100, badge: '🌌', icon: '🚀' 
  },
  { 
    id: 13, name: '冠军之路', lvl: [100, 100], 
    pool: [254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340], 
    drop: 2000, type: 'gold', color: '#FFD700', gymLeader: 340, gymLvl: 120, badge: '🏆', icon: '🏛️' 
  },
  // 日蚀要塞
  { 
    id: 99, name: '日蚀要塞', lvl: [80, 90], pool: [], 
    drop: 0, type: 'factory', color: '#263238', gymLeader: 350, gymLvl: 95, badge: '💀', icon: '🏯' 
  }
];

// ==========================================
// [终极剧情版] 史诗剧情脚本 (多重战斗 + 精灵奖励)
// ==========================================
const STORY_SCRIPT = [
  {
    chapter: 0,
    mapId: 1, // 微风草原
    title: "第一章：枯萎与新生",
    objective: "击败狂暴的野生精灵，从日蚀队手中救下妙蛙种子。",
    intro: [
      { name: "大木博士", text: "情况比想象中更糟！虚空能量不仅让植物枯萎，还让温顺的精灵变得极度狂暴！" },
      { name: "大木博士", text: "我探测到一只珍贵的【叶苗苗】正在被日蚀队追捕，快去救它！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 6, type: 'battle', enemyId: 44, name: '狂暴的 贪吃鼠', text: '吱吱吱！！！（双眼发红，疯狂地向你扑来）', emoji: '🐀' },
      { step: 1, x: 20, y: 12, type: 'dialog', name: '被困的 叶苗苗', text: "（小家伙瑟瑟发抖地躲在树桩后，它的腿受伤了。你给它进行了简单的包扎。）", emoji: '🌱' },
      { step: 2, x: 15, y: 8, type: 'battle', enemyId: 118, name: '日蚀队 捕猎者', text: '那是我的猎物！这种稀有实验体能换不少钱呢！', emoji: '😈' }
    ],
    midEvent: { enemyId: 118, name: '日蚀队 捕猎者' }, 
    outro: [
      { name: "馆主 莉佳", text: "太好了，这孩子得救了。看，它似乎很想跟随你。" },
      { name: "系统", text: "获得奖励：精灵【叶苗苗】(御三家)！" }
    ],
    // 【新增】reward.pokemon 字段
    reward: { gold: 1000, items: [{id:'potion', count:5}], pokemon: {id: 1, level: 10} }
  },
  {
    chapter: 1,
    mapId: 2, // 回声山谷
    title: "第二章：坚如磐石",
    objective: "突破日蚀队的封锁线，阻止爆破计划。",
    intro: [
      { name: "登山大叔", text: "日蚀队封锁了山口！他们不仅埋了炸弹，还派了重兵把守！" },
      { name: "登山大叔", text: "小刚馆主正在最深处拆弹，我们必须帮他清理外围的敌人！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 15, type: 'battle', enemyId: 64, name: '日蚀队 守卫', text: "此路不通！这里即将成为废墟！", emoji: '🚧' },
      { step: 1, x: 22, y: 5, type: 'battle', enemyId: 66, name: '日蚀队 突击兵', text: "为了首领的宏愿，牺牲是必要的！", emoji: '⚔️' },
      { step: 2, x: 20, y: 10, type: 'battle', enemyId: 15, name: '日蚀队 爆破专家', text: "倒计时30秒！来不及了！一起炸飞吧！", emoji: '💣' }
    ],
    midEvent: { enemyId: 15, name: '日蚀队 爆破专家' },
    outro: [
      { name: "馆主 小刚", text: "干得漂亮！这只【小火雀】刚才一直在试图啄断引信，真是勇敢的小家伙。" },
      { name: "馆主 小刚", text: "它似乎认可了你的实力，带上它一起旅行吧。" },
      { name: "系统", text: "获得奖励：精灵【小火雀】(稀有火系)！" }
    ],
    reward: { gold: 2000, balls: { great: 5 }, pokemon: {id: 16, level: 15} }
  },
  {
    chapter: 2,
    mapId: 3, // 遗迹工厂
    title: "第三章：被遗弃的数据",
    objective: "击败失控的机械守卫，获取多边兽原型机。",
    intro: [
      { name: "大木博士", text: "这座工厂里藏着一只名为【多边兽】的人造精灵原型机。" },
      { name: "大木博士", text: "日蚀队想要改写它的程序，把它变成杀戮机器。一定要赶在他们之前找到它！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 34, name: '暴走的 插头怪', text: "滋滋... 滋滋... 靠近者... 抹杀...", emoji: '🔌' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 40, name: '安保机器人 Mk-II', text: "检测到非法入侵。启动防御协议。", emoji: '🤖' },
      { step: 2, x: 15, y: 15, type: 'battle', enemyId: 81, name: '日蚀队 首席科学家', text: "原型机是我的！只要有了它，我就能黑入世界银行！", emoji: '👨‍🔬' }
    ],
    midEvent: { enemyId: 81, name: '日蚀队 首席科学家' }, 
    outro: [
      { name: "馆主 马志士", text: "Wow! 你救下了这堆数据代码。它看起来很喜欢你的图鉴装置。" },
      { name: "系统", text: "获得奖励：精灵【多边兽】(稀有)！" }
    ],
    reward: { gold: 3000, items: [{id:'vit_satk', count:3}], pokemon: {id: 131, level: 20} }
  },
  {
    chapter: 3,
    mapId: 4, // 深蓝海域
    title: "第四章：深海的呼救",
    objective: "清理剧毒污染物，解救被困的拉普拉斯。",
    intro: [
      { name: "渔夫", text: "听到了吗？那是拉普拉斯（乘龙）的歌声，它在求救！" },
      { name: "渔夫", text: "日蚀队在海里倾倒了大量毒素，还派出了水下部队阻拦救援！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 27, name: '剧毒 触手怪', text: "（浑身散发着恶臭，向你喷射毒液）", emoji: '🦑' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 118, name: '日蚀队 潜水员', text: "这片海域已经被征用了！滚开！", emoji: '🤿' },
      { step: 2, x: 10, y: 10, type: 'battle', enemyId: 130, name: '被侵蚀的 暴鲤龙', text: "吼！！！（痛苦地翻滚着，试图摆脱身上的油污）", emoji: '🐉' }
    ],
    midEvent: { enemyId: 130, name: '被侵蚀的 暴鲤龙' }, 
    outro: [
      { name: "馆主 小霞", text: "谢谢你净化了大海。这只【拉普拉斯】是族群里最小的一只，它希望能跟随你报恩。" },
      { name: "系统", text: "获得奖励：精灵【拉普拉斯】(强力冰/水)！" }
    ],
    reward: { gold: 4000, items: [{id:'berry', count:10}], pokemon: {id: 123, level: 25} }
  },
  {
    chapter: 4,
    mapId: 5, // 熔岩火山
    title: "第五章：进化的可能性",
    objective: "在火山深处寻找进化的契机，击败火焰干部。",
    intro: [
      { name: "日蚀队 干部·炎", text: "伊布这种弱小的生物，只有在极端的环境下才能进化成强大的形态！" },
      { name: "玩家", text: "强迫进化是错误的！" }
    ],
    tasks: [
      { step: 0, x: 8, y: 12, type: 'battle', enemyId: 104, name: '狂暴 火花猴', text: "叽叽！！（被高温折磨得失去了理智）", emoji: '🐒' },
      { step: 1, x: 22, y: 5, type: 'battle', enemyId: 105, name: '日蚀队 精英卫队', text: "干部正在进行伟大的实验，禁止打扰！", emoji: '💂' },
      { step: 2, x: 12, y: 8, type: 'battle', enemyId: 126, name: '日蚀队 干部·炎', text: "既然你这么想保护它，那就让这只伊布看看，什么是真正的力量！", emoji: '🔥' }
    ],
    midEvent: { enemyId: 126, name: '日蚀队 干部·炎' }, 
    outro: [
      { name: "馆主 夏伯", text: "你救下了这只【伊布】。它拥有无限的可能性，好好培养它吧。" },
      { name: "系统", text: "获得奖励：精灵【伊布】(可多分支进化)！" }
    ],
    reward: { gold: 5000, balls: { master: 1 }, pokemon: {id: 125, level: 30} }
  },
  {
    chapter: 5,
    mapId: 6, // 赛博都市
    title: "第六章：钢铁意志",
    objective: "突破机械军团，夺回城市控制权。",
    intro: [
      { name: "神秘黑客", text: "整座城市的防御系统都被激活了！你必须一路打进去！" },
      { name: "神秘黑客", text: "小心，他们部署了最新的合金宝可梦。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 87, name: '巡逻 铁哑铃', text: "目标锁定... 排除...", emoji: '🔩' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 88, name: '重装 金属怪', text: "装甲强度 100%... 准备撞击...", emoji: '🦾' },
      { step: 2, x: 18, y: 12, type: 'battle', enemyId: 132, name: 'AI 核心守护者', text: "检测到最高级威胁... 启动歼灭模式... 目标：排除。", emoji: '🤖' }
    ],
    midEvent: { enemyId: 132, name: 'AI 核心守护者' }, 
    outro: [
      { name: "馆主 娜姿", text: "系统恢复了。这只【铁哑铃】似乎摆脱了控制，它想成为你的力量。" },
      { name: "系统", text: "获得奖励：精灵【铁哑铃】(准神幼体)！" }
    ],
    reward: { gold: 6000, items: [{id:'vit_satk', count:5}], pokemon: {id: 87, level: 35} }
  },
  {
    chapter: 6,
    mapId: 7, // 幽灵古堡
    title: "第七章：暗影中的微光",
    objective: "在充满恶意的古堡中，寻找纯净的灵魂。",
    intro: [
      { name: "幽灵", text: "不要... 不要过来... 那个紫色的影子会吃掉我们..." },
      { name: "大木博士", text: "日蚀队在利用幽灵系宝可梦制造恐惧！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 54, name: '恶作剧的 飘飘魂', text: "嘻嘻嘻... 陪我玩... 永远留在这里吧！", emoji: '👻' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 59, name: '怨念 诅咒娃娃', text: "好恨啊... 为什么只有我被抛弃...", emoji: '🎎' },
      { step: 2, x: 15, y: 10, type: 'battle', enemyId: 94, name: '噬魂 耿鬼', text: "多么美味的恐惧！让我尝尝你的灵魂！", emoji: '👿' }
    ],
    midEvent: { enemyId: 94, name: '噬魂 耿鬼' }, 
    outro: [
      { name: "馆主 松叶", text: "这只【烛光灵】一直保护着其他弱小的幽灵。它是一盏指引之灯。" },
      { name: "系统", text: "获得奖励：精灵【烛光灵】(特攻强力)！" }
    ],
    reward: { gold: 7000, items: [{id:'vit_sdef', count:5}], pokemon: {id: 18, level: 40} }
  },
  {
    chapter: 7,
    mapId: 8, // 天空王座
    title: "第八章：龙之血脉",
    objective: "登上云端，证明你有驾驭龙的力量。",
    intro: [
      { name: "飞行员", text: "高空的乱流太强了！只有最强的飞行系宝可梦才能在这里生存。" },
      { name: "飞行员", text: "传说中，这里栖息着龙族的后裔。" }
    ],
    tasks: [
      { step: 0, x: 10, y: 10, type: 'battle', enemyId: 42, name: '巡空 疾风鹰', text: "（锐利的眼神锁定了你，俯冲而下！）", emoji: '🦅' },
      { step: 1, x: 20, y: 5, type: 'battle', enemyId: 142, name: '虚空 猎手', text: "（发出刺耳的尖啸，试图阻止你靠近裂缝）", emoji: '🦇' },
      { step: 2, x: 14, y: 14, type: 'battle', enemyId: 142, name: '虚空裂缝守护者', text: "（它守护着裂缝，周围的空间都在扭曲！）", emoji: '🌪️' }
    ],
    midEvent: { enemyId: 142, name: '虚空裂缝守护者' }, 
    outro: [
      { name: "馆主 娜琪", text: "你征服了天空。这只【迷你蛇】（迷你龙）感受到了你的霸气，它愿意追随未来的龙之大师。" },
      { name: "系统", text: "获得奖励：精灵【迷你蛇】(准神幼体)！" }
    ],
    reward: { gold: 8000, items: [{id:'vit_spd', count:5}], pokemon: {id: 79, level: 45} }
  },
  {
    chapter: 8,
    mapId: 9, // 极寒冻土
    title: "第九章：冰封的守护",
    objective: "击败极寒守卫，获得冰系强者的认可。",
    intro: [
      { name: "大木博士", text: "这里的温度低得可怕！日蚀队唤醒了沉睡的古代冰兽。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 5, type: 'battle', enemyId: 76, name: '领地意识的 海豹', text: "（它不允许任何人靠近它的领地）", emoji: '🦭' },
      { step: 1, x: 25, y: 15, type: 'battle', enemyId: 199, name: '狂暴 象牙猪', text: "吼！！！（巨大的獠牙能粉碎一切）", emoji: '🐗' },
      { step: 2, x: 16, y: 8, type: 'battle', enemyId: 131, name: '极寒 乘龙', text: "（周围的空气瞬间凝固，连时间仿佛都被冻结了）", emoji: '❄️' }
    ],
    midEvent: { enemyId: 131, name: '极寒 乘龙' }, 
    outro: [
      { name: "馆主 哈奇库", text: "这只【雪球海豹】在刚才的战斗中一直注视着你。它想去看看外面的世界。" },
      { name: "系统", text: "获得奖励：精灵【雪球海豹】！" }
    ],
    reward: { gold: 10000, items: [{id:'vit_pdef', count:5}], pokemon: {id: 76, level: 50} }
  },
  {
    chapter: 9,
    mapId: 10, // 流沙荒漠
    title: "第十章：沙暴中的利刃",
    objective: "在沙暴中生存下来，击败地面的霸主。",
    intro: [
      { name: "日蚀队 副首领", text: "欢迎来到我的主场。这里的沙暴会剥夺你所有的体力！" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 68, name: '潜伏的 穿山甲', text: "（突然从沙地里钻了出来！）", emoji: '🦔' },
      { step: 1, x: 25, y: 5, type: 'battle', enemyId: 185, name: '剧毒 龙王蝎', text: "（尾巴上的毒针闪烁着紫光）", emoji: '🦂' },
      { step: 2, x: 20, y: 15, type: 'battle', enemyId: 248, name: '日蚀队 副首领', text: "感受绝望吧！沙暴葬送！", emoji: '🦂' }
    ],
    midEvent: { enemyId: 248, name: '日蚀队 副首领' }, 
    outro: [
      { name: "日蚀队 副首领", text: "可恶... 连【幼鲨】（圆陆鲨）都背叛了我吗？" },
      { name: "系统", text: "获得奖励：精灵【幼鲨】(准神幼体)！" }
    ],
    reward: { gold: 15000, balls: { master: 2 }, pokemon: {id: 82, level: 55} }
  },
  {
    chapter: 10,
    mapId: 11, // 糖果王国
    title: "第十一章：梦境的终结",
    objective: "打破甜蜜的噩梦，直面内心的恐惧。",
    intro: [
      { name: "大木博士", text: "不要被表象迷惑！这里的一切都是幻觉！" }
    ],
    tasks: [
      { step: 0, x: 15, y: 5, type: 'battle', enemyId: 48, name: '诡异的 粉粉球', text: "来玩吧... 永远留在这里...", emoji: '🧶' },
      { step: 1, x: 5, y: 15, type: 'battle', enemyId: 178, name: '梦境 守门人', text: "你醒不过来的... 放弃吧...", emoji: '🧙' },
      { step: 2, x: 10, y: 12, type: 'battle', enemyId: 146, name: '噩梦神 达克莱伊', text: "为什么要醒来？现实只有痛苦... 沉睡吧... 永远...", emoji: '🌑' }
    ],
    midEvent: { enemyId: 146, name: '噩梦神 达克莱伊' }, 
    outro: [
      { name: "馆主 玛绣", text: "噩梦消散了。这只【星之子】是希望的象征，请带上它。" },
      { name: "系统", text: "获得奖励：精灵【星之子】！" }
    ],
    reward: { gold: 20000, items: [{id:'vit_crit', count:3}], pokemon: {id: 60, level: 60} }
  },
  {
    chapter: 11,
    mapId: 12, // 银河空间站
    title: "终章：创世与终焉",
    objective: "在宇宙边缘击败日蚀队首领与虚空之神。",
    intro: [
      { name: "日蚀队 首领", text: "欢迎来到世界的尽头。旧世界已经腐朽，唯有虚空能带来新生。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 10, type: 'battle', enemyId: 253, name: '虚空 守门人', text: "此路不通。", emoji: '🛡️' },
      { step: 1, x: 25, y: 10, type: 'battle', enemyId: 253, name: '虚空 处刑者', text: "毁灭即是新生。", emoji: '⚔️' },
      { step: 2, x: 15, y: 5, type: 'battle', enemyId: 255, name: '虚空之神', text: "（不可名状的咆哮，周围的空间开始崩塌）", emoji: '⚫' }
    ],
    midEvent: { enemyId: 255, name: '虚空之神' }, 
    outro: [
      { name: "系统", text: "虚空之神发出最后一声哀鸣，消散在宇宙尘埃中..." },
      { name: "大木博士", text: "你做到了！你拯救了世界！" },
      { name: "系统", text: "恭喜通关一周目！你已成为传说中的宝可梦大师！" },
      { name: "系统", text: "（提示：集齐12枚徽章后，可前往【冠军之路】挑战隐藏的巅峰强者...）" }
    ],
    reward: { gold: 99999, balls: { master: 10 } }
  },
  {
    chapter: 12,
    mapId: 13, // 冠军之路
    title: "隐藏篇：巅峰对决",
    objective: "击败五大天王，登顶世界之巅！",
    intro: [
      { name: "神秘人", text: "呵呵呵... 看来新的挑战者出现了。来【冠军之路】吧，我们五大天王在等着你。" }
    ],
    tasks: [
      { step: 0, x: 5, y: 15, type: 'battle', enemyId: 271, name: '天王 元素领主', text: "我是第一天王！万物皆有元素，而我掌控一切！", emoji: '🔥' },
      { step: 1, x: 5, y: 5, type: 'battle', enemyId: 269, name: '天王 秩序圣骑', text: "我是第二天王！你的攻击在绝对的秩序面前毫无意义！", emoji: '🛡️' },
      { step: 2, x: 25, y: 15, type: 'battle', enemyId: 270, name: '天王 武斗神', text: "我是第三天王！无需多言，用拳头来交流吧！", emoji: '👊' },
      { step: 3, x: 25, y: 5, type: 'battle', enemyId: 280, name: '天王 虫群之心', text: "我是第四天王！感受亿万虫群的恐惧吧！", emoji: '🦗' },
      { step: 4, x: 15, y: 2, type: 'battle', enemyId: 283, name: '冠军 创世元灵', text: "终于来了... 你战胜了我的四位护法。现在，向神发起挑战吧！", emoji: '👑' }
    ],
    midEvent: { enemyId: 283, name: '冠军 创世元灵' }, 
    outro: [
      { name: "冠军", text: "了不起... 你的光芒甚至超越了创世之光。" },
      { name: "系统", text: "恭喜！你已通关二周目！" },
      { name: "系统", text: "获得终极奖励：神兽【起源之光】 + 【冠军奖杯】！" }
    ],
    reward: { gold: 500000 } 
  }
];

const CONTEST_CONFIG = {
  // 1. 捕虫大赛 (Map 1 微风草原)
  bug: {
    id: 'contest_bug',
    name: '捕虫大会',
    desc: '捕捉虫系精灵！分数越高，奖励越稀有！',
    entryFee: 500,
    // 修正野怪池：110绿毛虫(弱), 38脉冲虫(中), 293寄生幼虫(中), 252圣甲虫(强/稀有)
    pool: [110, 38, 293, 252], 
    // 分级奖励 (按分数从高到低)
    tiers: [
      // 🏆 600分：必须抓到【闪光】的【强力虫子】才能达到
      { min: 600, id: 327, name: '虫群主宰(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 奇迹！你抓到了传说中的虫族霸主！' },
      
      // 🥇 450分：需要抓到【满个体值】的【强力虫子】(如圣甲虫)，或者【闪光】的【普通虫子】
      { min: 450, id: 252, name: '圣甲虫', level: 5, shiny: false, ivs: 4, msg: '🥇 冠军！这只甲虫力大无穷！' },
      
      // 🥈 300分：需要抓到【强力虫子】(圣甲虫)，或者个体值极高的中等虫子
      { min: 300, id: 112, name: '巴大蝶', level: 5, shiny: false, ivs: 3, msg: '🥈 优胜！这只蝴蝶翅膀很漂亮！' },
      
      // 🥉 0分：抓到绿毛虫通常只能拿这个
      { min: 0,   id: 110, name: '绿毛虫', level: 5, shiny: false, ivs: 2, msg: '🥉 参与奖。继续加油！' }
    ]
  },

  // ... (钓鱼和选美保持不变，或者你可以按同样逻辑调整)
  fishing: {
    id: 'contest_fishing',
    name: '钓鱼王杯',
    desc: '钓起大鱼！重量决定奖励！',
    entryFee: 500,
    pool: [7, 24, 26, 173], 
    tiers: [
      { min: 200.0, id: 410, name: '海啸领主(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 钓鱼之神！传说中的深海霸主！' },
      { min: 100.0, id: 235, name: '海啸王', level: 5, shiny: false, ivs: 4, msg: '🥇 冠军！这可是稀有的海怪！' },
      { min: 50.0,  id: 22,  name: '激流鲨', level: 5, shiny: false, ivs: 3, msg: '🥈 亚军！这条鲨鱼很凶猛！' },
      { min: 0,     id: 7,   name: '泡泡鱼', level: 5, shiny: false, ivs: 2, msg: '🥉 只有一条泡泡鱼... 拿去煲汤吧。' }
    ]
  },
  beauty: {
    id: 'contest_beauty',
    name: '华丽大赛',
    desc: '展示魅力！赢取华丽的精灵！',
    entryFee: 1000,
    tiers: [
      { min: 250, id: 369, name: '仙子伊布(闪光)', level: 5, shiny: true, ivs: 5, msg: '🏆 完美演出！全场为你欢呼！' },
      { min: 180, id: 329, name: '樱花女神', level: 5, shiny: false, ivs: 4, msg: '🥇 优胜！最美的精灵归你了！' },
      { min: 100, id: 61,  name: '星光舞者', level: 5, shiny: false, ivs: 3, msg: '🥈 表现不错！舞姿很优美。' },
      { min: 0,   id: 48,  name: '粉粉球', level: 5, shiny: false, ivs: 2, msg: '🥉 还需要练习哦。' }
    ]
  }
};

// ==========================================
// [修改] 特殊副本数据 (添加 rewards 字段)
// ==========================================
const DUNGEONS = [
  { 
    id: 'gold_rush', name: '黄金矿洞', desc: '遍地金币！', type: 'gold', color: '#FFD700', icon: '💰', recLvl: 30,
    rewards: [
        { icon: '💰', text: '1W~5W 金币' },
        { icon: '💎', text: '金珠/大金珠' }
    ]
  },
  { 
    id: 'exp_paradise', name: '经验乐园', desc: '极速升级！', type: 'exp', color: '#00E676', icon: '🎓', recLvl: 20,
    rewards: [
        { icon: '🍬', text: '经验糖果(L)' },
        { icon: '📘', text: '高级经验书' }
    ]
  },
  { 
    id: 'safari_zone', name: '狩猎地带', desc: '神兽出没！(需Lv.100 + 12徽章)', type: 'catch', color: '#FF7043', icon: '🐾', recLvl: 100,
    rewards: [
        { icon: '🐲', text: '随机神兽' },
        { icon: '🔴', text: '红色品质装备' }
    ]
  },
  { 
    id: 'stone_tower', name: '元素之塔', desc: '掉落进化石！(限制: 需 Lv.60 以上进入)', type: 'stone', color: '#7B1FA2', icon: '🔮', recLvl: 60, restriction: 'min_lvl_60',
    rewards: [
        { icon: '⚡', text: '全属性进化石' },
        { icon: '✨', text: '觉醒/暗之石' }
    ]
  },
  { 
    id: 'hero_trial', name: '英雄试炼', desc: '掉落属性增强剂！(限制: 仅限单只精灵出战)', type: 'stat', color: '#F44336', icon: '💪', recLvl: 60, restriction: 'solo_run',
    rewards: [
        { icon: '💪', text: '努力值药剂' },
        { icon: '🧬', text: '属性增强剂' }
    ]
  },
  { 
    id: 'rich_man', name: '豪宅金库', desc: '海量金币！(门票: 5000金币)', type: 'gold_pro', color: '#FFC107', icon: '🏦', recLvl: 50, restriction: 'entry_fee',
    rewards: [
        { icon: '🏆', text: '巨大金珠' },
        { icon: '💰', text: '20W+ 金币' }
    ]
  },
  { 
    id: 'shiny_valley', name: '闪光山谷', desc: '高概率闪光！(限制: 需携带"幸运"性格精灵)', type: 'shiny_hunt', color: '#00E676', icon: '✨', recLvl: 80, restriction: 'lucky_nature',
    rewards: [
        { icon: '✨', text: '高闪光概率' },
        { icon: '🍀', text: '幸运加成' }
    ]
  },
  { 
    id: 'infinity_castle', name: '无限城', desc: '无尽的迷宫与恶鬼！(Roguelike模式)', type: 'infinity', color: '#7B1FA2', icon: '🏯', recLvl: 80, restriction: 'none',
    rewards: [
        { icon: '👹', text: '鬼杀队遗物' },
        { icon: '⚔️', text: '呼吸法秘籍' }
    ]
  }
];
const TRAINER_AVATARS = [
  '🧢', '👧', '👦', '👩', '👨', 
  '🕵️', '👩‍🚀', '👨‍🚀', '👮', '👮‍♀️',
  '🧙‍♂️', '🧙‍♀️', '🧛', '🧛‍♀️', '🧟', 
  '🧝', '🧝‍♀️', '🧞', '🧞‍♀️', '🦸',
  '🦹', '🎅', '🤶', '🤴', '👸'
];
const MOON_DEMONS = {
  LOWER: [94, 146, 208, 236, 265, 274], // 下弦 (耿鬼, 噩梦神等)
  UPPER: [144, 150, 216, 248, 255, 280], // 上弦 (冥王龙, 虚空等)
  MUZAN: 341 // 鬼王 (暗黑超梦)
};
const BREATHING_BUFFS = [
  { id: 'atk_up', name: '🔥 火之神神乐', desc: '全队攻击力 +20%', effect: (p) => p.customBaseStats.p_atk = Math.floor(p.customBaseStats.p_atk * 1.2) },
  { id: 'def_up', name: '🪨 岩之呼吸', desc: '全队防御力 +20%', effect: (p) => p.customBaseStats.p_def = Math.floor(p.customBaseStats.p_def * 1.2) },
  { id: 'spd_up', name: '⚡ 雷之呼吸', desc: '全队速度 +15%', effect: (p) => p.customBaseStats.spd = Math.floor(p.customBaseStats.spd * 1.15) },
  { id: 'heal_turn', name: '🌊 水之呼吸', desc: '每回合恢复 5% HP', type: 'passive' }, // 需要战斗逻辑支持，这里简化为进场加血上限
  { id: 'crit_up', name: '🐗 兽之呼吸', desc: '暴击率 +10%', effect: (p) => p.customBaseStats.crit += 10 },
  { id: 'heal_all', name: '🦋 虫之呼吸', desc: '立即恢复全队 50% HP', type: 'instant', effect: (p) => p.currentHp = Math.min(getStats(p).maxHp, p.currentHp + getStats(p).maxHp * 0.5) }
];
// 补充特殊遭遇池
const NEW_GOD_IDS = Array.from({length: 30}, (_, i) => 254 + i);
const FINAL_GOD_IDS = [331, 332, 333, 334, 335, 336, 337, 338, 339, 340];
const LEGENDARY_POOL = [144, 145, 146, 150, 151, 216, 218, 220, 222, 228, 233, 234, 235, 236, 242, 243, 244, 253, ...NEW_GOD_IDS,...FINAL_GOD_IDS]; 
const HIGH_TIER_POOL = [3, 6, 9, 18, 33, 65, 69, 94, 130, 138, 139, 140, 143, 149, 160, 168, 182, 190, 199, 206, 241]; 
const ROCK_POOL = [64, 65, 73, 74, 95, 133, 134, 135, 136, 139, 169, 190, 225, 226, 250]; 
const WATER_POOL = [7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28, 76, 77, 78, 107, 108, 109, 120, 123, 126, 129, 130, 158, 159, 165, 173, 174, 211, 212, 235, 246];
export default function RPG(props) {
  // =================================================================
  // 🔥 [核心修复 1] 启动瞬间同步读取存档 (防止存档“丢失”)
  // =================================================================
  let savedData = {};
  try {
    const raw = localStorage.getItem(SAVE_KEY); // 直接读取，不等待
    if (raw) {
      savedData = JSON.parse(raw);
      console.log("✅ 成功读取存档:", savedData.trainerName);
    }
  } catch (e) {
    console.error("存档读取失败", e);
  }

  // =================================================================
  // 🔥 [核心修复 2] 使用读取到的 savedData 直接初始化所有状态
  // =================================================================
  
  // 基础视图
  const [view, setView] = useState('menu'); 
  const encounterTimerRef = useRef(null);
  
  // 玩家身份 (优先用存档里的名字，没有才用默认)
  const [trainerName, setTrainerName] = useState(savedData.trainerName || '小智');
  const [trainerAvatar, setTrainerAvatar] = useState(savedData.trainerAvatar || '🧢');
  const [unlockedTitles, setUnlockedTitles] = useState(savedData.unlockedTitles || ['见习训练家']);
  const [currentTitle, setCurrentTitle] = useState(savedData.currentTitle || '见习训练家');

  // 核心资产 (金币/背包/队伍)
  const [gold, setGold] = useState(savedData.gold || 1000);
  const [party, setParty] = useState(savedData.party || []);
  const [box, setBox] = useState(savedData.box || []);
  const [accessories, setAccessories] = useState(savedData.accessories || []);
  
  // 背包初始化 (防止旧存档缺字段导致报错)
  const defaultInventory = { 
    balls: { poke: 10, great: 0, ultra: 0, master: 0, net:0, dusk:0, quick:0, timer:0, heal:0 }, 
    meds: {}, tms: {}, misc: {}, stones: {}, berries: 0 
  };
  const [inventory, setInventory] = useState({ ...defaultInventory, ...(savedData.inventory || {}) });

  // 游戏进度
  const [mapProgress, setMapProgress] = useState(savedData.mapProgress || {});
  const [caughtDex, setCaughtDex] = useState(savedData.caughtDex || []);
  const [completedChallenges, setCompletedChallenges] = useState(savedData.completedChallenges || []);
  const [badges, setBadges] = useState(savedData.badges || []);
  const [viewedIntros, setViewedIntros] = useState(savedData.viewedIntros || []);
  const [sectTitles, setSectTitles] = useState(savedData.sectTitles || []);
  const [leagueWins, setLeagueWins] = useState(savedData.leagueWins || 0);

  // 存档状态标记 (关键！直接根据是否读到金币来判断是否有存档)
  const [hasSave, setHasSave] = useState(!!savedData.gold); 
  const [loaded, setLoaded] = useState(true); // 直接设为加载完成，不需要 useEffect 等待

  // 临时状态 (不需要存入 savedData 的部分)
  const [activityRecords, setActivityRecords] = useState({ bug: 0, fishing: 0, beauty: 0 });
  const [resultData, setResultData] = useState(null); 

  // 环境与天气系统
  const [weather, setWeather] = useState('CLEAR');    
  const [mapWeathers, setMapWeathers] = useState({}); 
  const [timePhase, setTimePhase] = useState('DAY'); 
  const [gameTime, setGameTime] = useState(0);

  

// 2. [新增] 天气生成算法 (根据地图类型决定天气权重)
const generateWeatherForMap = (mapType) => {
    const rand = Math.random();
    
    // 极寒冻土: 50%雪, 40%晴, 10%雨(冻雨)
    if (mapType === 'ice') return rand < 0.5 ? 'SNOW' : (rand < 0.9 ? 'CLEAR' : 'RAIN');
    
    // 流沙荒漠: 40%沙暴, 40%晴, 20%大晴天(酷热)
    if (mapType === 'ground' || mapType === 'rock') return rand < 0.4 ? 'SAND' : (rand < 0.8 ? 'CLEAR' : 'SUN');
    
    // 熔岩火山: 50%大晴天, 50%晴
    if (mapType === 'fire') return rand < 0.5 ? 'SUN' : 'CLEAR';
    
    // 深蓝海域: 40%雨, 60%晴
    if (mapType === 'water') return rand < 0.4 ? 'RAIN' : 'CLEAR';
    
    // 其他区域 (草原/城市等): 70%晴, 20%雨, 10%大晴天
    return rand < 0.7 ? 'CLEAR' : (rand < 0.9 ? 'RAIN' : 'SUN');
};

// 3. [核心] 时间流逝与天气轮转控制 Hook
useEffect(() => {
    const timer = setInterval(() => {
        setGameTime(prev => {
            const nextTime = prev + 1;
            
            // --- A. 时间流逝逻辑 (全局统一) ---
            // 周期: 4500秒 (75分钟) = 1天
            // 0-1800: 白天 | 1800-2700: 黄昏 | 2700-4500: 夜晚
            const cycle = nextTime % 4500;
            let newPhase = 'DAY';
            if (cycle >= 1800 && cycle < 2700) newPhase = 'DUSK';
            else if (cycle >= 2700) newPhase = 'NIGHT';
            
            if (newPhase !== timePhase) setTimePhase(newPhase);

            // --- B. 天气轮转逻辑 (各地区独立) ---
            // 每 300秒 (5分钟) 刷新一次全地图天气
            // 或者初始化时 (prev === 0) 立即刷新
            if (prev === 0 || nextTime % 300 === 0) {
                const newWeathers = {};
                MAPS.forEach(m => {
                    newWeathers[m.id] = generateWeatherForMap(m.type);
                });
                setMapWeathers(newWeathers);
                
                if (prev > 0) addGlobalLog(`🌍 各地的天气发生了变化...`);
            }
            
            return nextTime;
        });
    }, 1000); // 1秒 = 游戏内1秒 (可根据需要调整流逝速度，例如 100ms)

    return () => clearInterval(timer);
}, [timePhase]); // 依赖项

  const [skillFilter, setSkillFilter] = useState('ALL'); 
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
 const [storyProgress, setStoryProgress] = useState(0); // 当前进行到第几章
  const [storyStep, setStoryStep] = useState(0); // 0:刚进图, 1:完成中途事件, 2:已通关
  const [dialogQueue, setDialogQueue] = useState([]); // 当前待播放的对话队列
  const [isDialogVisible, setIsDialogVisible] = useState(false); // 是否显示对话框
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0); // 当前对话说到第几句
 
    // ==========================================
  // [修复] 缺失的无限城逻辑函数
  // ==========================================

  // 1. 进入下一层
  const nextInfinityFloor = () => {
    setInfinityState(prev => ({
      ...prev,
      floor: prev.floor + 1,
      status: 'selecting' // 回到选门状态
    }));
  };

  // 2. 选择呼吸法 Buff
  const selectInfinityBuff = (buff) => {
    // A. 如果是即时恢复类
    if (buff.type === 'instant') {
      const newParty = party.map(p => {
        if (p.currentHp > 0) {
          const stats = getStats(p);
          // 恢复 50% 血量
          const heal = Math.floor(stats.maxHp * 0.5);
          return { ...p, currentHp: Math.min(stats.maxHp, p.currentHp + heal) };
        }
        return p;
      });
      setParty(newParty);
      alert("✨ 呼吸法生效：全队体力大幅恢复！");
    } 
    // B. 如果是属性加成类 (修改 customBaseStats)
    else if (buff.effect) {
      const newParty = party.map(p => {
        // 复制对象
        const newPet = { ...p };
        // 如果还没有自定义种族值，先锁定当前种族值
        if (!newPet.customBaseStats) {
            const base = POKEDEX.find(d => d.id === newPet.id) || POKEDEX[0];
            // 简单的种族值快照
            newPet.customBaseStats = {
                hp: base.hp, p_atk: base.atk, p_def: base.def, 
                s_atk: base.atk, s_def: base.def, spd: base.spd, crit: 5
            };
        }
        // 执行 Buff 函数 (修改 customBaseStats)
        buff.effect(newPet);
        return newPet;
      });
      setParty(newParty);
      
      // 记录已获得的 Buff
      setInfinityState(prev => ({
        ...prev,
        buffs: [...prev.buffs, buff]
      }));
      alert(`🔥 呼吸法生效：${buff.desc}`);
    }

    // 选完后进入下一层
    nextInfinityFloor();
  };

// 【新增】用于存储对话结束后要执行的任务
const [pendingTask, setPendingTask] = useState(null); 
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // [修正] 1. 图片数据源映射逻辑 (参考成功示例优化)
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  const imageMap = React.useMemo(() => {
    const map = {};
    // 注意：这里 pokemon_images 要和 manifest.json 里的 data_source_id 一致
    const sourceItems = props?.data?.pokemon_images?.items || [];
    
    sourceItems.forEach(item => {
      // 1. 获取 ID (确保是数字)
      const id = Number(item.pet_id?.value);
      
      // 2. 获取图片 URL (使用更兼容的读取方式)
      let imgUrl = null;
      const files = item.pet_img?.value;
      
      if (Array.isArray(files) && files.length > 0) {
        const firstFile = files[0];
        // 优先尝试获取中等尺寸缩略图 (link.medium)，如果没有则尝试直接获取 link 或 url
        // 伙伴云的图片对象结构可能是 { link: { medium: "..." } } 也可能是 { url: "..." }
        imgUrl = firstFile?.link?.medium || firstFile?.link || firstFile?.url;
      }

      // 3. 只有当 ID 和 图片地址 都存在时才存入映射表
      if (id && imgUrl) {
        map[id] = imgUrl;
      }
    });
    
    // [调试] 打印一下看看读到了多少图片
    console.log(`🔥 [图库调试] 成功加载了 ${Object.keys(map).length} 张精灵图片`, map);
    
    return map;
  }, [props.data]);

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // [优化] 2. 核心头像渲染函数 (支持 CSS 类控制大小)
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  
  // 🔥 [新增] 智能精灵视觉生成系统
  const generatePetVisual = (pet) => {
    if (!pet) return null;
    const imgUrl = imageMap[pet.id];
    
    // 如果有图片，优先使用图片
    if (imgUrl) {
      return {
        type: 'image',
        url: imgUrl,
        emoji: pet.emoji
      };
    }
    
    // 根据精灵名字和类型生成增强的视觉表现
    const name = pet.name || '';
    const type = pet.type || 'NORMAL';
    const baseInfo = POKEDEX.find(p => p.id === pet.id) || {};
    
    // 类型颜色映射
    const typeColors = {
      FIRE: '#FF6B6B', WATER: '#4ECDC4', GRASS: '#95E1D3', 
      ELECTRIC: '#FFE66D', ICE: '#A8E6CF', FIGHT: '#FF8B94',
      POISON: '#C7CEEA', GROUND: '#D4A574', FLYING: '#B8E6B8',
      PSYCHIC: '#FFB6C1', BUG: '#C8E6C9', ROCK: '#D3D3D3',
      GHOST: '#E0BBE4', DRAGON: '#FFD93D', STEEL: '#B8B8B8',
      FAIRY: '#FFB6D9', GOD: '#FFD700', NORMAL: '#F5F5F5'
    };
    
    // 根据名字关键词生成特殊效果
    let visualStyle = {
      emoji: pet.emoji,
      color: typeColors[type] || '#F5F5F5',
      effects: [],
      glow: false,
      particles: []
    };
    
    // 名字关键词匹配
    if (name.includes('火') || name.includes('炎') || name.includes('熔') || name.includes('焰')) {
      visualStyle.effects.push('fire');
      visualStyle.glow = true;
      visualStyle.particles.push('🔥');
    }
    if (name.includes('水') || name.includes('海') || name.includes('波') || name.includes('流')) {
      visualStyle.effects.push('water');
      visualStyle.particles.push('💧');
    }
    if (name.includes('草') || name.includes('叶') || name.includes('森') || name.includes('花')) {
      visualStyle.effects.push('grass');
      visualStyle.particles.push('🍃');
    }
    if (name.includes('电') || name.includes('雷') || name.includes('闪')) {
      visualStyle.effects.push('electric');
      visualStyle.glow = true;
      visualStyle.particles.push('⚡');
    }
    if (name.includes('冰') || name.includes('雪') || name.includes('寒')) {
      visualStyle.effects.push('ice');
      visualStyle.particles.push('❄️');
    }
    if (name.includes('龙') || name.includes('神') || name.includes('王') || name.includes('主')) {
      visualStyle.effects.push('dragon');
      visualStyle.glow = true;
      visualStyle.particles.push('✨');
    }
    if (name.includes('鬼') || name.includes('幽') || name.includes('暗')) {
      visualStyle.effects.push('ghost');
      visualStyle.particles.push('👻');
    }
    if (name.includes('钢') || name.includes('铁') || name.includes('机')) {
      visualStyle.effects.push('steel');
    }
    if (name.includes('妖精') || name.includes('仙')) {
      visualStyle.effects.push('fairy');
      visualStyle.particles.push('✨');
    }
    
    return {
      type: 'enhanced',
      visual: visualStyle
    };
  };
  
  const renderAvatar = (pet) => {
    if (!pet) return null;
    const visual = generatePetVisual(pet);
    
    // 如果有图片，渲染图片
    if (visual.type === 'image') {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img 
            src={visual.url} 
            alt={pet.name} 
            className="pet-avatar-img" 
            style={{ objectFit: 'contain' }} 
          />
          {/* 添加闪光效果 */}
          {pet.isShiny && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,215,0,0.3), rgba(255,255,255,0.3))',
              animation: 'shiny-flash 2s infinite',
              pointerEvents: 'none'
            }} />
          )}
        </div>
      );
    }
    
    // 🔥 [升级] 使用精致SVG模型生成器
    // 计算合适的尺寸 - 增大尺寸让精灵更明显
    const getModelSize = () => {
      // 尝试从不同场景获取容器大小
      if (typeof window !== 'undefined') {
        // 战斗场景 - 增大尺寸
        const battleContainer = document.querySelector('.sprite-v2');
        if (battleContainer) {
          const containerWidth = battleContainer.offsetWidth || 180;
          // 增大到85%，让精灵更明显
          return Math.min(containerWidth * 0.85, 160);
        }
        // 图鉴/背包场景
        const smallContainer = document.querySelector('.pet-avatar-img, .pet-avatar-emoji');
        if (smallContainer) {
          const containerWidth = smallContainer.offsetWidth || 36;
          return Math.max(containerWidth, 36);
        }
      }
      return 160; // 默认大小（战斗场景）- 增大了
    };
    
    try {
      const modelSize = getModelSize();
      const svgModel = generatePetModel(pet, modelSize);
      
      if (svgModel) {
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            animation: 'float 3s ease-in-out infinite'
          }}>
            {svgModel}
            {/* 闪光特效叠加 */}
            {pet.isShiny && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle, rgba(255,215,0,0.3), transparent)',
                animation: 'shiny-rotate 3s linear infinite',
                pointerEvents: 'none',
                borderRadius: '50%'
              }} />
            )}
          </div>
        );
      }
    } catch (error) {
      console.warn('SVG模型生成失败，使用回退方案:', error);
    }
    
    // 如果生成失败，回退到增强的emoji渲染
    if (visual.type === 'enhanced') {
      const v = visual.visual;
      return (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span 
            className="pet-avatar-emoji"
            style={{
              filter: v.glow ? `drop-shadow(0 0 10px ${v.color}) drop-shadow(0 0 20px ${v.color}66)` : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              animation: v.effects.includes('fire') ? 'fire-glow 1.5s infinite' :
                         v.effects.includes('electric') ? 'electric-pulse 1s infinite' :
                         v.effects.includes('dragon') ? 'dragon-aura 2s infinite' : 'float 3s ease-in-out infinite'
            }}
          >
            {v.emoji}
          </span>
        </div>
      );
    }
    
    // 最终回退
    return <span className="pet-avatar-emoji">{pet.emoji}</span>;
  };
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    // 缓存技能列表 (避免重复计算)
  const allSkills = React.useMemo(() => {
    let list = [];
    
    // SKILL_DB 已经被注入了所有技能，所以只需要遍历它
    Object.keys(SKILL_DB).forEach(type => {
      SKILL_DB[type].forEach(move => {
        // 动态判断分类：如果威力为0或有特效，则为变化技能
        const isStatus = move.p === 0 || move.effect;
        
        list.push({ 
            ...move, 
            t: type, 
            category: isStatus ? 'status' : 'damage' 
        });
      });
    });

    // 不需要再遍历 STATUS_SKILLS_DB 了，否则会重复
    
    return list.sort((a, b) => a.t.localeCompare(b.t));
  }, []);






  
  // 临时的输入状态
  const [tempName, setTempName] = useState(''); 

 
  // 1. 在 useState 区域添加这两个状态
  const [selectedBagItem, setSelectedBagItem] = useState(null); // 当前选中的物品详情
  const [usingItem, setUsingItem] = useState(null); // 当前准备使用的物品
  // [新增] 战斗内背包的标签页状态
  const [battleBagTab, setBattleBagTab] = useState('balls');
    // 装备系统状态
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [targetEquipSlot, setTargetEquipSlot] = useState({ petIdx: 0, slotIdx: 0 });

  // 初始精灵三选一
  const [starterOptions, setStarterOptions] = useState([]);
const [fusionParent, setFusionParent] = useState(null); // 融合父本
  const [fusionChild, setFusionChild] = useState(null);   // 融合母本
  const [fusionSlot, setFusionSlot] = useState(null);     // 当前正在选择哪个槽位 ('parent' 或 'child')
  // 融合系统状态
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionSlots, setFusionSlots] = useState([null, null]); // [ParentA_Index, ParentB_Index]
  const [viewSectTeam, setViewSectTeam] = useState(null); 



  // 界面状态
  const [currentMapId, setCurrentMapId] = useState(1);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [mapGrid, setMapGrid] = useState([]); // 随机生成的网格数据

  const [leagueRound, setLeagueRound] = useState(0); // 当前轮次: 0=未参加, 1=16强, 2=8强, 3=半决赛, 4=决赛
  // 在 RPG 组件内部

// 还需要一个控制头像选择弹窗的状态
const [showAvatarSelector, setShowAvatarSelector] = useState(false);

// 【新增】全局探索日志状态
  const [globalLogs, setGlobalLogs] = useState([
    { time: '系统', msg: '欢迎来到宝可梦 RPG 世界！' },
    { time: '系统', msg: '请使用方向键或 WASD 移动。' }
  ]);
   const [messageBox, setMessageBox] = useState(null); 
  // ✨ 新增：全局键盘监听 (空格键关闭弹窗/返回)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // 如果按下了空格键 (Space)
      if (e.code === 'Space') {
        // 1. 如果当前有自定义弹窗，关闭它
        if (messageBox) {
            e.preventDefault(); // 防止页面滚动
            const cb = messageBox.callback;
            setMessageBox(null);
            if (cb) cb(); // 执行回调
            return;
        }
        
        // 2. 如果当前在“功能未开放”界面，相当于点击返回
        if (view === 'locked') {
            e.preventDefault();
            setView('world_map');
            return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [messageBox, view]);

  // ✨ 辅助函数：用来替代 alert()
  // 用法：showMessage("岩石挡住了路！", () => { console.log("关闭了"); });
  const showMessage = (text, callback = null) => {
      setMessageBox({ text, callback });
  };

  // 【新增】添加日志的辅助函数
  const addGlobalLog = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
    setGlobalLogs(prev => [{ time, msg }, ...prev].slice(0, 20));
  };  
  // 界面模态框状态
  const [teamMode, setTeamMode] = useState(false);
  const [shopMode, setShopMode] = useState(false);
  const [pcMode, setPcMode] = useState(false);
  const [selectedPartyIdx, setSelectedPartyIdx] = useState(null);
  const [selectedBoxIdx, setSelectedBoxIdx] = useState(null);
  const [statTooltip, setStatTooltip] = React.useState(null); 
  // 筛选和详情
  const [dexFilter, setDexFilter] = useState('all'); 
  const [selectedDexId, setSelectedDexId] = useState(null);
const [infinityState, setInfinityState] = useState(null); 
  // 商店
  const [shopTab, setShopTab] = useState('balls'); 
  const [buyCounts, setBuyCounts] = useState({}); 

  // 地图/挑战切换
  const [mapTab, setMapTab] = useState('maps'); 

  // 战斗与事件
  const [battle, setBattle] = useState(null);
   // 🎵 [新增] 音频控制 Ref 和 State
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false); // 静音状态
  const [currentTrack, setCurrentTrack] = useState(''); // 当前播放的曲目

  // 🎵 [最终优化] BGM 自动切换逻辑
  // 逻辑：只有当“目标曲目”和“当前曲目”不一样时，才切歌。否则保持播放，绝不打断。
  useEffect(() => {
    if (!audioRef.current) return;

    let targetSrc = '';

    // 1. 定义【菜单音乐组】：这三个界面都用 MENU 音乐
    // 这样在它们之间切换时，targetSrc 不变，音乐就不会断
    if (view === 'menu' || view === 'name_input' || view === 'starter_select') {
      targetSrc = BGM_SOURCES.MENU;
    } 
    // 2. 定义【地图音乐组】
    else if (view === 'world_map' || view === 'grid_map' || view === 'sect_summit') {
      targetSrc = BGM_SOURCES.MAP;
    }
    // 3. 定义【战斗音乐组】
    else if (view === 'battle') {
      if (battle && (battle.isBoss || battle.isGym || battle.isChallenge || battle.type === 'eclipse_leader')) {
        targetSrc = BGM_SOURCES.BOSS;
      } else {
        targetSrc = BGM_SOURCES.BATTLE;
      }
    }

    // 4. 执行播放逻辑
    const audio = audioRef.current;

    // 情况 A：需要切歌（目标曲目变了）
    if (targetSrc && targetSrc !== currentTrack) {
        console.log("🎵 切换 BGM:", targetSrc);
        setCurrentTrack(targetSrc);
        audio.src = targetSrc;
        audio.volume = 0.5; // 音量适中
        audio.load(); // 加载新歌
        
        // 尝试播放
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log("⏳ 等待用户点击屏幕以开始播放...");
            });
        }
    }
    // 情况 B：曲目没变，但可能因为刚进游戏被浏览器暂停了
    else if (targetSrc === currentTrack && audio.paused) {
        // 尝试恢复播放
        audio.play().catch(() => {});
    }
    // 情况 C：曲目没变，且正在播放 -> 什么都不做，让音乐继续流淌 🎶

  }, [view, battle, currentTrack]); 


  const [eventData, setEventData] = useState(null);
  const [animEffect, setAnimEffect] = useState(null);
  const [showBallMenu, setShowBallMenu] = useState(false);

  // 技能学习状态
  const [pendingMove, setPendingMove] = useState(null);
  const [learningPetIdx, setLearningPetIdx] = useState(null);

  // 引用，用于地图滚动
  const mapContainerRef = useRef(null);
  const handleMove = useCallback((dx, dy) => {
  setPlayerPos(prevPos => {
    const nx = prevPos.x + dx;
    const ny = prevPos.y + dy;
    return { x: nx, y: ny, dx, dy, intent: true }; 
  });
}, []);
const [viewStatPet, setViewStatPet] = useState(null);
  const [rebirthData, setRebirthData] = useState(null);
  const [showNatureTip, setShowNatureTip] = useState(false); 
  // ➕ [新增] 背包分类标签页状态
  const [bagTab, setBagTab] = useState('balls'); 
  const [pvpMode, setPvpMode] = useState(false); 
  const [pvpCodeInput, setPvpCodeInput] = useState('');
  const [activeContest, setActiveContest] = useState(null);
  const [fishingState, setFishingState] = useState({ status: 'idle', timer: 0, target: null, fish: null, weight: 0, msg: '' });
   const [evoAnim, setEvoAnim] = useState(null); // { oldPet, newPet, targetIdx, step: 0-3 }
  const [beautyState, setBeautyState] = useState({ round: 1, appeal: 0, history: [], log: [] });
  const [activityModal, setActivityModal] = useState(null); 
  const [battleTooltip, setBattleTooltip] = useState(null); 
    // ==========================================
  
  // [新增] 核心逻辑函数群
  // ==========================================

  // 1. 计算捕获率 (修正版：适配地图和属性)
  const calculateCatchRate = (ballType, enemy) => {
      const ball = BALLS[ballType];
      let rate = ball.rate;
      
      // 获取当前地图信息
      const mapInfo = MAPS.find(m => m.id === battle.mapId);
      // 计算当前回合数 (根据战斗日志数量估算)
      const turnCount = Math.floor(battle.logs.length / 2);

      // 网纹球：水系或虫系
      if (ballType === 'net') {
          if (enemy.type === 'WATER' || enemy.type === 'BUG') rate = 3.5;
      }
      
      // 黑暗球：特定地图(工厂/古堡/太空) 或 幽灵/超能/毒系
      if (ballType === 'dusk') {
          const isDarkMap = mapInfo && ['factory', 'ghost', 'space'].includes(mapInfo.type);
          const isDarkType = ['GHOST', 'PSYCHIC', 'POISON'].includes(enemy.type);
          if (isDarkMap || isDarkType) rate = 3.5;
      }
      
      // 先机球：前 3 回合
      if (ballType === 'quick') {
          if (turnCount <= 3) rate = 5.0;
      }
      
      // 计时球：回合越久越强
      if (ballType === 'timer') {
          rate = 1.0 + (turnCount * 0.3);
          if (rate > 4.0) rate = 4.0;
      }

      const maxHp = getStats(enemy).maxHp;
      const hpRate = enemy.currentHp / maxHp;
      return ((1 - hpRate) * 0.8 + 0.1) * rate;
  };

  // 2. 使用洗练药
   // 2. 使用洗练药 (旧版直接使用逻辑)
  const useRebirthPill = (petIdx) => {
    if ((inventory.misc.rebirth_pill || 0) <= 0) return;
    if (!confirm(`⚠️ 确定要对 ${party[petIdx].name} 使用洗练药吗？\n属性、性格将重新随机，有概率变闪光！`)) return;

    const newParty = [...party];
    const pet = newParty[petIdx];

    setInventory(prev => ({...prev, misc: {...prev.misc, rebirth_pill: prev.misc.rebirth_pill - 1}}));

    const randIV = () => Math.floor(Math.random() * 32); 
    pet.ivs = { hp: randIV(), p_atk: randIV(), p_def: randIV(), s_atk: randIV(), s_def: randIV(), spd: randIV(), crit: Math.floor(Math.random() * 10) };
    
    const natureKeys = Object.keys(NATURE_DB);
    pet.nature = natureKeys[Math.floor(Math.random() * natureKeys.length)];
    pet.isShiny = Math.random() < 0.04; 
    
    // ▼▼▼ 新增：重置波动 ▼▼▼
    pet.diversityRng = Math.floor(Math.random() * 9) - 4;
    pet.speedRng = Math.floor(Math.random() * 71) + 40;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const stats = getStats(pet);
    pet.currentHp = stats.maxHp; // 洗练后回满血

    setParty(newParty);
    let msg = `✨ 洗练完成！\n性格变为：${NATURE_DB[pet.nature].name}`;
    if (pet.isShiny) msg += "\n🌟 哇！刷出了闪光精灵！";
    alert(msg);
  };


  // 3. 使用技能书
  const useTM = (petIdx, tmId) => {
    const tm = TMS.find(t => t.id === tmId);
    if (!tm || (inventory.tms[tmId] || 0) <= 0) return;
    const pet = party[petIdx];

    if (pet.type !== tm.type && pet.secondaryType !== tm.type) {
        alert(`❌ 无法学习！\n${pet.name} 不是 ${TYPES[tm.type].name} 属性。`);
        return;
    }
    if (pet.moves.some(m => m.name === tm.name)) {
        alert("已经学会了这个技能！");
        return;
    }

    setInventory(prev => ({...prev, tms: {...prev.tms, [tmId]: prev.tms[tmId] - 1}}));
    const newMove = { name: tm.name, p: tm.p, t: tm.type, pp: tm.pp, maxPP: tm.pp, desc: tm.desc };
    
    if (pet.moves.length < 4) {
        const newParty = [...party];
        // 正确：创建一个新对象
        newParty[petIdx] = {
            ...newParty[petIdx],
            moves: [...newParty[petIdx].moves, newMove]
        };
        setParty(newParty);
        alert(`📖 ${pet.name} 学会了 [${tm.name}]!`);
    } else {
        const newParty = [...party];
        // 正确：创建一个新对象
        newParty[petIdx] = {
            ...newParty[petIdx],
            pendingLearnMove: newMove
        };
        setParty(newParty);
        setLearningPetIdx(petIdx);
        setPendingMove(newMove);
        setView('move_forget');
    }
  };

    // 4. 战斗中使用药品 (消耗回合)
  const useBattleItem = async (itemKey, category) => {
    if (!battle) return;
    const p = party[battle.activeIdx];
    const pState = battle.playerCombatStates[battle.activeIdx];
    let used = false;
    let logMsg = "";

    if (category === 'meds') {
        const item = MEDICINES[itemKey];
        if ((inventory.meds[itemKey] || 0) <= 0) return;

        // --- 效果判定逻辑 (保持不变) ---
        if (item.type === 'HP') {
            const max = getStats(p).maxHp;
            if (p.currentHp >= max) { alert("体力已满！"); return; }
            const heal = item.val === 9999 ? max : item.val;
            p.currentHp = Math.min(max, p.currentHp + heal);
            logMsg = `使用了 ${item.name}，恢复了体力！`;
            used = true;
        } else if (item.type === 'STATUS') {
            if (item.val === 'ALL') {
                if (!pState.status) { alert("没有异常状态！"); return; }
                pState.status = null;
                logMsg = `使用了 ${item.name}，状态恢复正常！`;
                used = true;
            } else {
                if (pState.status !== item.val) { alert("无效的药品！"); return; }
                pState.status = null;
                logMsg = `使用了 ${item.name}，治愈了异常状态!`;
                used = true;
            }
        } else if (item.type.includes('PP')) {
             p.moves.forEach(m => m.pp = Math.min(m.maxPP||15, m.pp + item.val));
             logMsg = `使用了 ${item.name}，PP得到了恢复！`;
             used = true;
        } else if (item.type === 'REVIVE') {
             // 战斗中通常不能对出战精灵用复活药(因为出战的肯定是活的)，除非是给替补用
             // 但 useBattleItem 目前逻辑是针对 activeIdx 的
             alert("无法在战斗中对当前精灵使用活力块！");
             return;
        }

        if (used) {
            setInventory(prev => ({...prev, meds: {...prev.meds, [itemKey]: prev.meds[itemKey] - 1}}));
            
            // ▼▼▼ [新增] 战斗中吃药增加亲密度 ▼▼▼
            // 战斗中被照顾会感到安心，亲密度 +1
            p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        }
    }

    if (used) {
        setShowBallMenu(false); 
        addLog(logMsg);
        setAnimEffect({ type: 'HEAL', target: 'player' });
        await wait(800);
        setAnimEffect(null);
        await enemyTurn(); // 消耗一回合
    }
  };


    // ==========================================
  // [修正] 初始精灵确认 (初始化新版背包结构)
  // ==========================================
  const confirmStarter = (preGeneratedPet) => {
    // 🔥 关键修改：不再调用 createPet，而是直接使用传进来的对象
    // 只需要更新一下 uid 确保唯一性即可
    const newPet = { ...preGeneratedPet, uid: Date.now() };
    // 2. 初始化玩家状态
    setParty([newPet]);
    setCaughtDex([newPet.id]);
    setGold(1000);
    
    // ▼▼▼▼▼▼▼▼▼▼ 核心修复点 ▼▼▼▼▼▼▼▼▼▼
    // 必须使用包含 meds, tms, misc 的新结构
    setInventory({ 
        balls: { poke: 10, great: 0, ultra: 0, master: 0, net:0, dusk:0, quick:0, timer:0, heal:0 }, 
        meds: { potion: 5 }, // 初始送5个伤药，放在 meds 里
      stones: {}, // <--- 新增
        tms: {},  
        misc: {}, 
        berries: 5 
    });
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    
    // 3. 初始化剧情
    setStoryProgress(0);
    setStoryStep(0);
    setViewedIntros([]);

    // 4. 进入第一张地图 (触发剧情对话)
    enterMap(1);
    
    // 5. 提示
    alert(`🎉 恭喜！你获得了 ${newPet.name}！\n冒险开始了！`);
  };

    // ==========================================
  // [核心] 属性计算函数 (含特性修正)
  // ==========================================
  function getStats(pet, stages = null, status = null) {
    const growth = 1 + pet.level * 0.05; 
    const shinyMod = pet.isFusedShiny ? 1.35 : (pet.isShiny ? 1.2 : 1.0);

    let ivs = pet.ivs || { hp:0, p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, crit:0 };
    const evs = pet.evs || {};
    const natureKey = pet.nature || 'docile'; 
    const natureStats = NATURE_DB[natureKey]?.stats || {};

    const baseInfo = POKEDEX.find(p => p.id === pet.id) || POKEDEX[0];
    const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };

    const diversity = (pet.diversityRng !== undefined) ? pet.diversityRng : ((baseInfo.id % 5) * 2 - 4);
    const fallbackSpeed = (pet.speedRng !== undefined) ? pet.speedRng : (40 + (baseInfo.id * 7 % 70));

    const baseStats = pet.customBaseStats || {
        hp: baseInfo.hp || 60,
        p_atk: Math.floor((baseInfo.atk || 50) * bias.p) + diversity,
        p_def: Math.floor((baseInfo.def || 50) * bias.p),
        s_atk: Math.floor((baseInfo.atk || 50) * bias.s) - diversity,
        s_def: Math.floor((baseInfo.def || 50) * bias.s),
        spd: baseInfo.spd || fallbackSpeed, 
        crit: 5
    };

    const getStageMult = (stage) => {
        if (!stage) return 1.0;
        const s = Math.max(-6, Math.min(6, stage));
        if (s >= 0) return (2 + s) / 2;
        return 2 / (2 + Math.abs(s));
    };

    let chiefBonus = {}; 
    if (pet.sectId && SECT_CHIEFS_CONFIG[pet.sectId]) {
        const config = SECT_CHIEFS_CONFIG[pet.sectId];
        if (currentTitle === config.title) {
            chiefBonus = config.stats; 
        }
    }
const CHARM_RANK_COLORS = {
    '万人迷': '#FF4081', // 亮粉色
    '人气王': '#FFD700', // 金色
    '可爱鬼': '#2196F3', // 蓝色
    '呆萌':   '#8BC34A', // 绿色
    '凶萌':   '#9E9E9E'  // 灰色
};
    const calc = (base, ivKey, evKey, isHp = false) => {
        const iv = ivs[ivKey] || 0;
        const ev = evs[evKey] || 0;
        
        let val = Math.floor((base + iv) * growth * shinyMod);
        if (isHp) val = Math.floor(val * 2.5); 

        if (natureStats[ivKey]) val = Math.floor(val * natureStats[ivKey]);
        
        const currentEquips = pet.equips || [null, null];
        currentEquips.forEach(equip => {
            if (!equip) return;
            let accData = null;
            if (typeof equip === 'string') accData = ACCESSORY_DB.find(c => c.id === equip);
            else if (typeof equip === 'object') accData = equip; 

            if (accData) {
                 const type = accData.type || accData.stat; 
                 if (isHp && (accData.stat === 'HP' || type === 'HP')) val += accData.val;
                 if ((ivKey === 'p_atk' || ivKey === 's_atk') && (type === 'ATK' || accData.stat === 'ATK')) val += accData.val;
                 if ((ivKey === 'p_def' || ivKey === 's_def') && (type === 'DEF' || accData.stat === 'DEF')) val += accData.val;
            }
        });

        val += ev;

        if (chiefBonus[ivKey]) {
            val = Math.floor(val * chiefBonus[ivKey]);
        }

        // ▼▼▼ [新增] 特性面板修正 ▼▼▼
        const trait = TRAIT_DB[pet.trait];
        if (trait && trait.type === 'STAT') {
            // 大力士：物攻翻倍
            if (pet.trait === 'huge_power' && ivKey === 'p_atk') val = Math.floor(val * 2);
            // 毅力：异常状态下物攻1.5倍
            if (pet.trait === 'guts' && ivKey === 'p_atk' && status) val = Math.floor(val * 1.5);
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        if (!isHp && stages && stages[ivKey] !== undefined) {
            val = Math.floor(val * getStageMult(stages[ivKey]));
        }

        if (status === 'PAR' && ivKey === 'spd') val = Math.floor(val * 0.5); 
        if (status === 'BRN' && ivKey === 'p_atk') val = Math.floor(val * 0.5); 

        return val;
    };

    let finalCrit = Math.floor((baseStats.crit||5) + (ivs.crit||0) + (evs.crit||0) + (pet.level * 0.2));
    if (chiefBonus.crit) finalCrit += chiefBonus.crit; 

    const sectId = pet.sectId || 1;
    const sectLv = pet.sectLevel || 1;
    let finalSpd = calc(baseStats.spd, 'spd', 'spd');
    
    if (sectId === 3) {
        finalSpd = Math.floor(finalSpd * (1 + (sectLv * 0.02))); 
    }

    return {
      maxHp: calc(baseStats.hp, 'hp', 'maxHp', true),
      p_atk: calc(baseStats.p_atk, 'p_atk', 'p_atk'),
      p_def: calc(baseStats.p_def, 'p_def', 'p_def'),
      s_atk: calc(baseStats.s_atk, 's_atk', 's_atk'),
      s_def: calc(baseStats.s_def, 's_def', 's_def'),
      spd:   finalSpd,
      crit:  finalCrit,
      atk: calc(baseStats.p_atk, 'p_atk', 'p_atk'), 
      def: calc(baseStats.p_def, 'p_def', 'p_def')
    };
  }

  // ==========================================
  // [新增] 启动门派首席挑战
  // ==========================================
  const startSectChallenge = (sectId) => {
      const config = SECT_CHIEFS_CONFIG[sectId];
      const sectInfo = SECT_DB[sectId];

      if (party.length < 3) {
          alert("⚠️ 门派试炼非常危险，请至少携带 3 只精灵！");
          return;
      }

      if (confirm(`⚔️ 挑战【${sectInfo.name}】首席？...`)) {
      
      const enemyParty = [];
      const teamIds = SECT_TEAMS[sectId] || []; // 获取固定阵容

      // 遍历阵容ID生成精灵
      teamIds.forEach((petId, idx) => {
          const isAce = idx === 0; // 第一个是王牌
          const level = isAce ? 100 : 95; // 王牌100级，随从95级
          
          const pet = createPet(petId, level, true, isAce); // 王牌可能是闪光
          pet.sectId = parseInt(sectId);
          pet.sectLevel = isAce ? 10 : 8;
          
          if (isAce) pet.name = `[首席] ${pet.name}`;
          
          enemyParty.push(pet);
      });


          // 启动战斗
          startBattle({ 
              id: 8000 + sectId, // 特殊ID段
              name: `${config.title} ${config.name}`, 
              customParty: enemyParty,
              drop: 10000 // 高额金币奖励
          }, 'sect_challenge');
      }
  };
    // ==========================================
  // [新增] 打开门派阵容详情
  // ==========================================
  const openSectTeamDetail = (sectId) => {
      const teamIds = SECT_TEAMS[sectId] || [];
      const sectInfo = SECT_DB[sectId];
      
      // 模拟生成敌方配置 (与战斗逻辑一致)
      const previewTeam = teamIds.map((id, idx) => {
          const isAce = idx === 0;
          const level = isAce ? 100 : 95; // 首席100级，随从95级
          
          // 创建临时对象用于展示
          const pet = createPet(id, level, true, isAce); 
          pet.sectId = sectId;
          pet.sectLevel = isAce ? 10 : 8; // 模拟高层心法
          if (isAce) pet.name = `[首席] ${pet.name}`;
          
          return pet;
      });

      setViewSectTeam({
          name: sectInfo.name,
          color: sectInfo.color,
          team: previewTeam
      });
  };

   // ==========================================
  // [完整版] 门派顶峰界面 (含阵容预览与点击交互)
  // ==========================================
  const renderSectSummit = () => {
    return (
      <div className="screen" style={{background: '#121212', color: '#fff', display:'flex', flexDirection:'column'}}>
               {/* 顶部导航 - [修正] 移除 glass-panel，强制深色背景以适配白字 */}
        <div className="nav-header" style={{
            borderBottom:'1px solid #333', 
            background: '#1e1e1e', // 🟢 强制深色背景 (解决白底看不见字的问题)
            padding: '15px 20px',  // 增加一点内边距
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'sticky', top: 0, zIndex: 10 // 保持在顶部
        }}>
          <button className="btn-back" onClick={() => setView('world_map')} style={{
              color:'#fff', 
              background: '#333', // 🟢 给按钮加个深灰背景，更像按钮
              border: '1px solid #555',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '5px'
          }}>
              <span>🔙</span> 返回
          </button>
          
          <div className="nav-title" style={{fontSize:'18px', fontWeight:'bold', color:'#fff'}}>🏔️ 门派顶峰</div>
          
          <div className="nav-coin" style={{
              background:'#333', color:'#FFD700', 
              padding:'5px 12px', borderRadius:'20px', 
              fontSize:'12px', fontWeight:'bold', border:'1px solid #555'
          }}>
              🏆 已征服: {sectTitles.length}/10
          </div>
        </div>

        {/* 门派列表 */}
        <div style={{flex:1, overflowY:'auto', padding:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'15px'}}>
            {Object.keys(SECT_DB).map(key => {
                const id = parseInt(key);
                const sect = SECT_DB[id];
                const chief = SECT_CHIEFS_CONFIG[id];
                const teamIds = SECT_TEAMS[id] || []; // 获取该门派的阵容
                const isConquered = sectTitles.includes(id);
                // 🔥 检查当前是否激活 (已征服 且 佩戴了对应称号)
                const isActive = isConquered && currentTitle === chief.title;

                return (
                    <div key={id} style={{
                        background: isActive ? `linear-gradient(135deg, ${sect.color}66, #000)` : (isConquered ? '#2a2a2a' : '#1e1e1e'),
                        border: isActive ? `2px solid ${sect.color}` : '1px solid #333',
                        borderRadius: '12px', padding: '15px', position: 'relative', overflow: 'hidden',
                        boxShadow: isActive ? `0 0 20px ${sect.color}66` : 'none',
                        transition: '0.3s',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        {/* 背景水印 */}
                        <div style={{position:'absolute', right:'-10px', bottom:'-10px', fontSize:'80px', opacity:0.1, pointerEvents:'none'}}>
                            {sect.emoji}
                        </div>

                        {/* 卡片头部：图标与名称 */}
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div style={{fontSize:'32px', background:'#333', width:'50px', height:'50px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    {sect.emoji}
                                </div>
                                <div>
                                    <div style={{fontWeight:'bold', fontSize:'18px', color: sect.color}}>{sect.name}</div>
                                    <div style={{fontSize:'11px', color:'#aaa'}}>{sect.desc}</div>
                                </div>
                            </div>
                            {isConquered && (
                                <div style={{
                                    background: isActive ? '#00E676' : '#555', 
                                    color:'#fff', padding:'4px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'
                                }}>
                                    {isActive ? '✨ 已激活' : '未佩戴'}
                                </div>
                            )}
                        </div>

                        {/* 首席信息与Buff */}
                        <div style={{fontSize:'12px', color:'#ccc', lineHeight:'1.5', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                            <div style={{marginBottom:'4px'}}>👑 <span style={{fontWeight:'bold'}}>{chief.title}：{chief.name}</span></div>
                            <div style={{fontStyle:'italic', opacity:0.8, marginBottom:'8px'}}>"{chief.quote}"</div>
                            
                            {/* 显示 Buff 详情 */}
                            <div style={{borderTop:'1px dashed #555', paddingTop:'8px', color: isActive ? '#fff' : '#888'}}>
                                <span style={{background: sect.color, color:'#fff', padding:'1px 4px', borderRadius:'3px', fontSize:'10px', marginRight:'5px'}}>Buff</span>
                                <strong>{chief.buffName}</strong>: {chief.buffDesc}
                            </div>
                        </div>

                        {/* ▼▼▼ 守关阵容展示区 (可点击) ▼▼▼ */}
                        <div 
                            onClick={() => openSectTeamDetail(id)} 
                            style={{
                                marginBottom:'15px', cursor: 'pointer', 
                                transition: 'transform 0.2s',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '8px'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }}
                        >
                            <div style={{fontSize:'10px', color:'#666', marginBottom:'5px', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>
                                <span>守关阵容</span>
                                <span style={{color: sect.color, opacity: 0.8}}>🔍 点击查看详情</span>
                            </div>
                            <div style={{display:'flex', gap:'6px', overflowX:'auto'}}>
                                {teamIds.map((petId, idx) => {
                                    // 获取精灵信息用于展示头像
                                    const petInfo = POKEDEX.find(p => p.id === petId) || { emoji: '❓' };
                                    return (
                                        <div key={idx} title={petInfo.name} style={{
                                            width:'32px', height:'32px', borderRadius:'50%', 
                                            background:'#333', border:`1px solid ${idx===0 ? '#FFD700' : '#555'}`, // 队长金色边框
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            fontSize:'20px', flexShrink:0, position:'relative'
                                        }}>
                                            {renderAvatar(petInfo)}
                                            {idx === 0 && <div style={{position:'absolute', bottom:'-2px', right:'-2px', fontSize:'8px'}}>👑</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

                        {/* 底部操作按钮 */}
                        <div style={{marginTop:'auto', display:'flex', gap:'10px'}}>
                            <button 
                                onClick={() => startSectChallenge(id)}
                                style={{
                                    flex:1, padding:'10px', borderRadius:'8px', border:'none', cursor:'pointer',
                                    background: isConquered ? '#333' : sect.color,
                                    color: isConquered ? '#aaa' : '#fff',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isConquered ? '再次切磋' : '发起挑战'}
                            </button>
                            
                            {/* 快捷佩戴按钮 */}
                            {isConquered && !isActive && (
                                <button 
                                    onClick={() => {
                                        setCurrentTitle(chief.title);
                                        alert(`已佩戴称号【${chief.title}】\n${sect.name}的加成已激活！`);
                                    }}
                                    style={{
                                        flex:1, padding:'10px', borderRadius:'8px', border:'none', cursor:'pointer',
                                        background: '#2196F3', color: '#fff', fontWeight: 'bold'
                                    }}
                                >
                                    佩戴称号
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  // ==========================================
  // [新增] 门派阵容详情弹窗
  // ==========================================
  const renderSectTeamModal = () => {
    if (!viewSectTeam) return null;

    return (
      <div className="modal-overlay" onClick={() => setViewSectTeam(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div onClick={e => e.stopPropagation()} style={{
            width: '90%', maxWidth: '800px', maxHeight: '80vh',
            background: '#1a1a2e', borderRadius: '20px', border: `2px solid ${viewSectTeam.color}`,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: `0 0 50px ${viewSectTeam.color}44`
        }}>
            {/* 标题栏 */}
            <div style={{
                padding: '15px 20px', background: `linear-gradient(90deg, ${viewSectTeam.color}44, #1a1a2e)`,
                borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: viewSectTeam.color, display:'flex', alignItems:'center', gap:'10px'}}>
                    <span>⚔️</span> {viewSectTeam.name} · 守关阵容详情
                </div>
                <button onClick={() => setViewSectTeam(null)} style={{background:'transparent', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer'}}>×</button>
            </div>

            {/* 列表区域 */}
            <div style={{flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px'}}>
                {viewSectTeam.team.map((pet, i) => {
                    const stats = getStats(pet);
                    const isAce = i === 0;
                    
                    return (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px',
                            border: isAce ? '1px solid #FFD700' : '1px solid #333', position: 'relative'
                        }}>
                            {isAce && <div style={{position:'absolute', top:0, right:0, background:'#FFD700', color:'#000', fontSize:'10px', fontWeight:'bold', padding:'2px 8px', borderRadius:'0 10px 0 10px'}}>ACE</div>}
                            
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <div style={{fontSize: '36px', marginRight: '10px'}}>{renderAvatar(pet)}</div>
                                <div>
                                    <div style={{fontWeight: 'bold', color: '#fff', fontSize: '14px'}}>{pet.name}</div>
                                    <div style={{display:'flex', gap:'5px', marginTop:'4px'}}>
                                        <span style={{fontSize: '10px', background: TYPES[pet.type]?.color, padding: '1px 6px', borderRadius: '4px'}}>{TYPES[pet.type]?.name}</span>
                                        {/* 修复后的等级标签 */}
<span style={{
    fontSize: '10px', 
    background: '#333', 
    color: '#fff',      // <--- 加上这一行，强制文字变白
    padding: '1px 6px', 
    borderRadius: '4px',
    fontWeight: 'bold'
}}>
    Lv.{pet.level}
</span>

                                    </div>
                                </div>
                            </div>

                            {/* 属性简略条 */}
                            <div style={{fontSize: '11px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom:'10px'}}>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>HP</span> <span style={{color:'#fff'}}>{stats.maxHp}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>攻击</span> <span style={{color:'#fff'}}>{stats.p_atk} / {stats.s_atk}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>防御</span> <span style={{color:'#fff'}}>{stats.p_def} / {stats.s_def}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>速度</span> <span style={{color:'#fff'}}>{stats.spd}</span></div>
                            </div>

                            {/* 技能预览 */}
                            <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'6px', padding:'6px'}}>
                                <div style={{fontSize:'10px', color:'#666', marginBottom:'4px'}}>携带技能</div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px'}}>
                                    {pet.moves.map((m, mi) => (
                                        <div key={mi} style={{fontSize:'10px', color: TYPES[m.t]?.color}}>{m.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  };

    // ==========================================
  // [修复] 剧情对话框组件 (解决跳过战斗问题)
  // ==========================================
  const renderDialogOverlay = () => {
    if (!isDialogVisible || dialogQueue.length === 0) return null;

    const currentLine = dialogQueue[currentDialogIndex];
    const isLastLine = currentDialogIndex === dialogQueue.length - 1;

    const handleNext = () => {
      if (isLastLine) {
        // 1. 关闭对话框
        setIsDialogVisible(false);
        setDialogQueue([]);
        setCurrentDialogIndex(0);

        // 2. 处理挂起任务 (如战斗)
        if (pendingTask) {
           if (pendingTask.type === 'battle') {
              // 启动战斗
              startBattle({ 
                id: 999, 
                name: pendingTask.name, 
                pool: [pendingTask.enemyId] 
              }, 'story_task');
              
              // 清空任务
              setPendingTask(null);
              
              // 【关键修复】触发战斗后直接返回，不再执行后续的 setView('grid_map')
              return; 
           } else {
              // 纯对话任务：推进剧情
              setStoryStep(prev => prev + 1);
              
              const currentChapter = STORY_SCRIPT[storyProgress];
              const nextTask = currentChapter?.tasks?.find(t => t.step === storyStep + 1);
              if(nextTask) {
                  alert(`✅ 线索已收集！\n新的目标出现在坐标 (${nextTask.x}, ${nextTask.y})`);
                  // 刷新地图显示新任务点
                  setMapGrid(prev => {
                      const newGrid = prev.map(row => [...row]);
                      if(newGrid[nextTask.y]) newGrid[nextTask.y][nextTask.x] = 99;
                      return newGrid;
                  });
              } else {
                  alert("🎉 阶段任务全部完成！\n现在可以去挑战道馆馆主了！");
              }
           }
           setPendingTask(null);
        }
        
        
      } else {
        setCurrentDialogIndex(prev => prev + 1);
      }
    };

    return (
      <div className="dialog-overlay" onClick={handleNext}>
        <div className="dialog-box">
          <div className="dialog-header">
             <span className="dialog-name">{currentLine.name}</span>
          </div>
          <div className="dialog-text">{currentLine.text}</div>
          <div className="dialog-hint">▼ 点击继续</div>
        </div>
      </div>
    );
  };

 const getMoveCategory = (type) => {
    // 物理系属性
    const physicalTypes = ['NORMAL', 'FIGHT', 'FLYING', 'GROUND', 'ROCK', 'BUG', 'GHOST', 'POISON', 'STEEL'];
    // 特殊系属性 (其余均为特殊)
    return physicalTypes.includes(type) ? 'physical' : 'special';
  };
  
  const handleItemUseOnPet = (petIdx) => {
    if (!usingItem) return;
    
    const newParty = [...party];
    const pet = newParty[petIdx];
    const stats = getStats(pet);
    let consumed = false;
    let msg = "";

    // --- 进化石逻辑 (保持不变) ---
        // ... 在 handleItemUseOnPet 函数内部 ...
    // --- 进化石逻辑 ---
    if (usingItem.category === 'stone') {
        const stoneId = usingItem.id;
        const rules = STONE_EVO_RULES[pet.id];
        
        if (rules && rules[stoneId]) {
            const targetId = rules[stoneId];
            const targetPetInfo = POKEDEX.find(p => p.id === targetId);
            
            if (targetPetInfo) {
                // 1. 扣除石头
                setInventory(prev => ({...prev, stones: {...prev.stones, [stoneId]: prev.stones[stoneId] - 1}}));
                
                // 2. 🔥 触发动画
                setEvoAnim({
                    targetIdx: petIdx,
                    oldPet: pet,
                    newPet: targetPetInfo,
                    step: 0
                });
                
                // 3. 关闭背包界面，让玩家看动画
                setUsingItem(null);
                setTeamMode(false); 
                return; 
            }
        } else {
            alert("它似乎不喜欢这个石头。");
            return;
        }
    }

    // --- 药品逻辑 (修改部分) ---
    if (usingItem.category === 'meds') {
        const med = usingItem.data;
        // 复活药
        if (med.type === 'REVIVE') {
            if (pet.currentHp > 0) { alert("它还很精神呢，不需要复活！"); return; }
            const healAmt = Math.floor(stats.maxHp * med.val);
            pet.currentHp = healAmt;
            consumed = true;
            msg = `${pet.name} 复活了！恢复了 ${healAmt} 点体力！`;
        } 
        // 普通药
        else {
            if (pet.currentHp <= 0) { alert("它已经晕厥了，无法使用这个药物！\n请使用【活力块】或【活力星】。"); return; }
            
            if (med.type === 'HP') {
                if (pet.currentHp >= stats.maxHp) { alert("体力已满！"); return; }
                const heal = med.val === 9999 ? stats.maxHp : med.val;
                pet.currentHp = Math.min(stats.maxHp, pet.currentHp + heal);
                consumed = true;
                msg = `恢复了体力！`;
            } else if (med.type.includes('PP')) {
                 pet.moves.forEach(m => m.pp = m.maxPP || 15);
                 consumed = true;
                 msg = `所有技能 PP 已恢复！`;
            } else if (med.type === 'STATUS') {
                 // 简单的状态药逻辑，假设非战斗状态下只清空 status 字段
                 // 实际上非战斗状态很少有持续的异常状态(除了中毒)，这里简单处理
                 if(pet.status) {
                     pet.status = null;
                     consumed = true;
                     msg = `异常状态已治愈！`;
                 } else {
                     alert("它很健康，没有异常状态。");
                     return;
                 }
            } else {
                 alert("该药物暂无效果或不适用。");
                 return;
            }
        }
        
        if (consumed) {
            setInventory(prev => ({...prev, meds: {...prev.meds, [med.id]: prev.meds[med.id] - 1}}));
            
            // ▼▼▼ [新增] 非战斗吃药增加亲密度 ▼▼▼
            // 闲暇时的照料，亲密度 +2
            pet.intimacy = Math.min(255, (pet.intimacy || 0) + 2);
            msg += ` (亲密度 +2)`;
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
        }
    }
    // --- 技能书 (TM) ---
    else if (usingItem.category === 'tm') {
        if (pet.currentHp <= 0) { alert("晕厥的精灵无法学习技能！"); return; }
        const tm = usingItem.data;
        if (pet.type !== tm.type && pet.secondaryType !== tm.type) {
            alert(`❌ 无法学习！属性不匹配。`); return;
        }
        if (pet.moves.some(m => m.name === tm.name)) {
            alert("已经学会了这个技能！"); return;
        }
        const newMove = { name: tm.name, p: tm.p, t: tm.type, pp: tm.pp, maxPP: tm.pp, desc: tm.desc };
        if (pet.moves.length < 4) {
            pet.moves.push(newMove);
            consumed = true;
            msg = `📖 ${pet.name} 学会了 [${tm.name}]!`;
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: prev.tms[tm.id] - 1}}));
        } else {
            pet.pendingLearnMove = newMove;
            setParty(newParty);
            setLearningPetIdx(petIdx);
            setPendingMove(newMove);
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: prev.tms[tm.id] - 1}}));
            setUsingItem(null);
            setView('move_forget');
            return;
        }
    }
    // --- 属性增强 ---
    else if (usingItem.category === 'growth') {
        if (pet.currentHp <= 0) { alert("晕厥的精灵无法使用！"); return; }
        const item = usingItem.data;
      
        if (item.id === 'max_candy') {
            if (pet.level >= 100) { alert("它已经达到等级上限了！"); return; }
            
            pet.level = 100;
            pet.exp = 0;
            pet.nextExp = 999999; 
            
            const newStats = getStats(pet);
            pet.currentHp = newStats.maxHp; 
            
            consumed = true;
            msg = `不可思议！${pet.name} 瞬间升到了 Lv.100！`;
            setInventory(prev => ({...prev, [item.id]: prev[item.id] - 1}));
        } else {
            if (!pet.evs) pet.evs = {};
            if (!pet.evs[item.stat]) pet.evs[item.stat] = 0;
            pet.evs[item.stat] += item.val;
            if (item.stat === 'maxHp') pet.currentHp += item.val;
            consumed = true;
            msg = `${pet.name} 的能力提升了！`;
            setInventory(prev => ({...prev, [item.id]: prev[item.id] - 1}));
        }
        
        // ▼▼▼ [新增] 增强剂也增加亲密度 ▼▼▼
        if(consumed) {
            pet.intimacy = Math.min(255, (pet.intimacy || 0) + 3); // 贵重物品加更多
            msg += ` (亲密度 +3)`;
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    }

    if (consumed) {
        setParty(newParty);
        alert(`✅ 使用成功！\n${msg}`);
        
        let remaining = 0;
        if (usingItem.category === 'meds') remaining = inventory.meds[usingItem.id] - 1;
        else if (usingItem.category === 'tm') remaining = inventory.tms[usingItem.id] - 1;
        else if (usingItem.category === 'stone') remaining = inventory.stones[usingItem.id] - 1;
        else if (usingItem.category === 'growth') remaining = inventory[usingItem.id] - 1;
        
        if (remaining < 0) {
            setUsingItem(null);
            setView('bag');
        }
    }
  };

  // ==========================================
  // [新增] 生成随机技能装备
  // ==========================================
  const createUniqueEquip = (baseId) => {
    const base = RANDOM_EQUIP_DB.find(i => i.id === baseId);
    if (!base) return null;

    // 随机抽取一个技能 (过滤掉太弱的，威力<40且非变化技能排除)
    const validSkills = allSkills.filter(s => s.category === 'status' || s.p >= 40);
    const randomSkill = _.sample(validSkills);

    return {
      ...base,
      uid: Date.now() + Math.random(), // 唯一标识，允许拥有多个同名装备
      isUnique: true, // 标记为特殊装备
      extraSkill: randomSkill, // 附带的技能数据
      // 动态生成名字，例如：[喷射火焰] 古老卷轴
      displayName: `[${randomSkill.name}] ${base.name}`
    };
  };

  // ==========================================
  // [核心修复] 创建精灵 (含特性/亲密度/宠物风魅力评级)
  // ==========================================
  function createPet(dexId, level, isBoss = false, forceShiny = false) {
    let finalId = dexId;

    // --- 1. 向下回溯 (De-evolution) ---
    while (true) {
        const preForm = POKEDEX.find(p => p.evo === finalId);
        if (!preForm) break;
        if (level < preForm.evoLvl) {
            finalId = preForm.id;
        } else {
            break;
        }
    }

    // --- 2. 向上进化 (Evolution) ---
    for(let k=0; k<5; k++) {
        const info = POKEDEX.find(p => p.id === finalId);
        if (!info) break; 
        if (info.evo && level >= info.evoLvl) {
            finalId = info.evo; 
        } else {
            break; 
        }
    }

    const base = POKEDEX.find(p => p.id === finalId) || POKEDEX[0];
    const isShiny = forceShiny || (!isBoss && Math.random() < 0.04);
    
    const randIV = () => Math.floor(Math.random() * 32); 
    const ivs = {
        hp: randIV(), p_atk: randIV(), p_def: randIV(),
        s_atk: randIV(), s_def: randIV(), spd: randIV(),
        crit: Math.floor(Math.random() * 6) 
    };

    const natureKeys = Object.keys(NATURE_DB);
    const randomNature = natureKeys[Math.floor(Math.random() * natureKeys.length)];
    const natureData = NATURE_DB[randomNature];
    const expMod = natureData.exp || 1.0;

    const diversityRng = Math.floor(Math.random() * 9) - 4; 
    const speedRng = Math.floor(Math.random() * 71) + 40;

    const sectId = Math.floor(Math.random() * 10) + 1; 
    let autoSectLv = Math.floor(level / 10) + 1;
    if (isBoss || isShiny) autoSectLv += 2;
    const sectLevel = Math.max(1, Math.min(10, autoSectLv));

    // --- [新增] 特性 (Trait) ---
    const traitKeys = Object.keys(TRAIT_DB);
    const randomTrait = traitKeys[Math.floor(Math.random() * traitKeys.length)];
    
    // --- [新增] 魅力值 (Charm) 与 宠物风评级 (Rank) ---
    // 1. 获取属性基准分
    const typeBaseCharm = TYPE_CHARM_BASE[base.type] || 30;
    
    // 2. 随机波动 (0-20)
    const rngCharm = Math.floor(Math.random() * 21);
    
    // 3. 特殊加成
    const shinyBonus = isShiny ? 30 : 0; 
    const bossBonus = isBoss ? 20 : 0;   
    
    // 4. 计算总和 (上限100)
    const charmVal = Math.min(100, typeBaseCharm + rngCharm + shinyBonus + bossBonus);

    // 5. 计算魅力评级 (宠物风格)
    let charmRank = '凶萌'; // 默认 D级
    if (charmVal >= 90) charmRank = '万人迷';      // S级
    else if (charmVal >= 75) charmRank = '人气王'; // A级
    else if (charmVal >= 50) charmRank = '可爱鬼'; // B级
    else if (charmVal >= 25) charmRank = '呆萌';   // C级
    
    // --- [新增] 亲密度 (Intimacy) ---
    const intimacy = 70; 

    let newPet = {
      ...base,
      uid: Date.now() + Math.random(),
      level,
      exp: 0,
      nextExp: Math.floor(level * 100 * expMod),
      nature: randomNature,
      equip: null,
      equips: [null, null],
      moves: [], 
      isBoss,
      isShiny,
      ivs, 
      evs: {},
      diversityRng, 
      speedRng,
      sectId: sectId,
      sectLevel: sectLevel,
      // ▼▼▼ 新属性注入 ▼▼▼
      trait: randomTrait,
      charm: charmVal,
      charmRank: charmRank, // 直接存中文名称
      intimacy: intimacy
    };

    // --- 技能生成逻辑 ---
    const moves = [];
    const maxSkillIndex = Math.floor(level / 5);
    const startIdx = Math.max(0, maxSkillIndex - 3);
    
    for (let i = startIdx; i <= maxSkillIndex; i++) {
        const moveData = getMoveByLevel(base.type, i * 5); 
        moves.push(moveData);
    }

    const hasDamageMove = moves.some(m => m.p > 0);
    if (!hasDamageMove) {
        let fallbackMove = { name: '撞击', p: 40, t: 'NORMAL', pp: 35, maxPP: 35, acc: 100 };
        const typeSkills = SKILL_DB[base.type];
        if (typeSkills && typeSkills.length > 0) {
            const basicStab = typeSkills.find(s => s.p > 0);
            if (basicStab) {
                fallbackMove = {
                    name: basicStab.name,
                    p: basicStab.p,
                    t: base.type, 
                    pp: basicStab.pp || 35,
                    maxPP: basicStab.pp || 35,
                    acc: basicStab.acc || 100,
                    effect: basicStab.effect
                };
            }
        }
        if (moves.length < 4) {
            moves.push(fallbackMove);
        } else {
            moves[0] = fallbackMove;
        }
    }

    newPet.moves = moves;

    const stats = getStats(newPet);
    newPet.currentHp = stats.maxHp;

    return newPet;
  }

// ... 在其他的 useEffect 附近添加 ...

// 🎵 [修复] 全局交互监听：解决浏览器禁止自动播放的问题
useEffect(() => {
  const unlockAudioContext = () => {
    if (audioRef.current) {
      // 尝试恢复播放（如果处于暂停状态且有源）
      if (audioRef.current.paused && audioRef.current.src) {
        audioRef.current.play().catch(e => console.log("等待音频加载...", e));
      }
    }
    // 只要用户交互过一次，就移除监听，避免性能浪费
    // 注意：如果你希望每次点击都尝试恢复，可以不移除，但通常一次就够了
    // window.removeEventListener('click', unlockAudioContext);
    // window.removeEventListener('keydown', unlockAudioContext);
  };

  window.addEventListener('click', unlockAudioContext);
  window.addEventListener('keydown', unlockAudioContext);

  return () => {
    window.removeEventListener('click', unlockAudioContext);
    window.removeEventListener('keydown', unlockAudioContext);
  };
}, []);

 // 滚动视图的核心逻辑
  useEffect(() => {
    if (mapContainerRef.current) {
      const TILE_SIZE = 40; 
      const container = mapContainerRef.current;
      const targetScrollX = (playerPos.x * TILE_SIZE) - (container.clientWidth / 2) + (TILE_SIZE / 2);
      const targetScrollY = (playerPos.y * TILE_SIZE) - (container.clientHeight / 2) + (TILE_SIZE / 2);
      
      container.scrollTo({
        left: targetScrollX,
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  }, [playerPos]);

     

// ----------------------------------------------------------------
// [升级版] 0.5 雷达图组件 (支持自定义文字颜色)
// ----------------------------------------------------------------
const RadarChart = ({ stats, color = '#2196F3', size = 140, textColor = "rgba(255,255,255,0.9)" }) => {
  const maxVal = 150;
  const center = size / 2;
  const radius = (size / 2) - 30; 
  
  const data = [
    stats.maxHp, stats.p_atk, stats.p_def, 
    stats.spd, stats.s_def, stats.s_atk
  ];
  
  const labels = ['HP', '物攻', '物防', '速度', '特防', '特攻'];

  const getPoint = (value, index, scale = 1) => {
    const angle = (Math.PI / 3) * index - (Math.PI / 2);
    const r = (Math.min(value, maxVal) / maxVal) * radius * scale;
    return { 
      x: center + r * Math.cos(angle), 
      y: center + r * Math.sin(angle) 
    };
  };

  const pointsString = data.map((v, i) => {
    const p = getPoint(v, i);
    return `${p.x},${p.y}`;
  }).join(' ');

  // 动态计算网格颜色：如果文字是深色，网格也深一点
  const gridColor = textColor.startsWith('#') && textColor !== '#fff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';

  return (
    <div className="radar-chart-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{overflow: 'visible'}}>
        {/* 网格 */}
        {[0.33, 0.66, 1.0].map((level, idx) => (
           <polygon 
             key={idx} 
             points={data.map((_, i) => {
               const p = getPoint(maxVal, i, level);
               return `${p.x},${p.y}`;
             }).join(' ')} 
             fill="none" 
             stroke={gridColor}
             strokeWidth="1" 
             strokeDasharray={level < 1 ? "2,2" : ""}
           />
        ))}
        
        {/* 轴线 */}
        {data.map((_, i) => {
           const p = getPoint(maxVal, i);
           return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke={gridColor} strokeWidth="1" />;
        })}

        {/* 数据区域 */}
        <polygon points={pointsString} fill={color} fillOpacity="0.6" stroke={color} strokeWidth="2" />
        
        {/* 数据点 */}
        {data.map((v, i) => {
          const p = getPoint(v, i);
          return <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#fff" strokeWidth="1" />;
        })}

        {/* 文字标签 (使用传入的 textColor) */}
        {labels.map((label, i) => {
            const angle = (Math.PI / 3) * i - (Math.PI / 2);
            const r = radius + 18;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            
            return (
                <text 
                  key={i} x={x} y={y} 
                  fill={textColor} 
                  fontSize="10" fontWeight="bold"
                  textAnchor="middle" dominantBaseline="middle" 
                  style={{fontFamily: 'Arial', textShadow: textColor==='#fff'?'0 1px 2px rgba(0,0,0,0.5)':'none'}}
                >
                    {label}
                </text>
            );
        })}
      </svg>
    </div>
  );
};

   // 修改 manualSave (存档逻辑)
  const manualSave = () => {
     const dataToSave = {
       trainerName, 
       trainerAvatar, 
       gold, 
       party, 
       box, 
       accessories, 
       sectTitles,
       inventory, 
       mapProgress, 
       caughtDex, 
       completedChallenges, 
       badges, 
       viewedIntros, 
       leagueWins, 
       unlockedTitles, 
       currentTitle
     };
     localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
     setHasSave(true);
     alert("✅ 存档保存成功！");
  };
    // [新增] 解锁称号通用函数
  const unlockTitle = (title) => {
      if (!unlockedTitles.includes(title)) {
          setUnlockedTitles(prev => [...prev, title]);
          // 播放特效或提示
          addGlobalLog(`🏆 获得新称号：[${title}]`);
          alert(`🎉 恭喜！你达成了隐藏条件！\n获得新称号：【${title}】\n(请在训练家卡片中佩戴)`);
      }
  };

  // [新增] 检查图鉴类称号 (每次捕获/进化后调用)
  const checkDexTitles = (currentCount) => {
      if (currentCount >= 50) unlockTitle('新手收藏家');
      if (currentCount >= 100) unlockTitle('图鉴达人');
      if (currentCount >= 230) unlockTitle('博学大师');
      if (currentCount >= 380) unlockTitle('全图鉴霸主');
  };

  const handleStartGame = () => {
    if (hasSave) {
      setView('world_map');
    } else {
      setView('name_input'); 
    }
  };
    // 打开装备选择弹窗
  const openEquipModal = (petIdx, slotIdx) => {
    setTargetEquipSlot({ petIdx, slotIdx });
    setEquipModalOpen(true);
  };

    const handleEquipAccessory = (accOrId) => {
    const { petIdx, slotIdx } = targetEquipSlot;
    const newParty = [...party];
    const pet = newParty[petIdx];
    if (!pet.equips) pet.equips = [null, null];

    const oldEquip = pet.equips[slotIdx];
    const newAccessories = [...accessories];

    // 1. 卸下旧装备 (放回背包)
    if (oldEquip) {
        newAccessories.push(oldEquip);
    }

    // 2. 从背包移除新装备
    // 如果是对象(唯一装备)，通过 uid 查找；如果是字符串(普通饰品)，通过值查找
    let accIndex = -1;
    if (typeof accOrId === 'object') {
        accIndex = newAccessories.findIndex(a => a.uid === accOrId.uid);
    } else {
        accIndex = newAccessories.indexOf(accOrId);
    }
    
    if (accIndex > -1) {
        newAccessories.splice(accIndex, 1);
    }

    // 3. 装备
    pet.equips[slotIdx] = accOrId;

    setParty(newParty);
    setAccessories(newAccessories);
    setEquipModalOpen(false);
  };


  // 卸下当前饰品
  const handleUnequip = () => {
    const { petIdx, slotIdx } = targetEquipSlot;
    const newParty = [...party];
    const pet = newParty[petIdx];
    
    if (!pet.equips || !pet.equips[slotIdx]) {
        setEquipModalOpen(false);
        return;
    }

    const oldAccId = pet.equips[slotIdx];
    
    // 放回背包
    setAccessories(prev => [...prev, oldAccId]);
    // 清空槽位
    pet.equips[slotIdx] = null;

    setParty(newParty);
    setEquipModalOpen(false);
  };

    // ==========================================
  // [修改] 核心融合逻辑 
  // 1. 种族值混合: Min*0.9 ~ Max*1.1 之间随机
  // 2. 等级: (父+母)/2
  // 3. IV: 随机生成
  // ==========================================
  const processFusion = () => {
    if (fusionSlots[0] === null || fusionSlots[1] === null) {
        alert("请先选择两只精灵进行融合！");
        return;
    }
    if (gold < 500) {
        alert("金币不足！融合需要 500 金币。");
        return;
    }
    if (party.length < 2) {
        alert("队伍中精灵数量不足。");
        return;
    }

    const p1Idx = fusionSlots[0];
    const p2Idx = fusionSlots[1];
    const p1 = party[p1Idx];
    const p2 = party[p2Idx];

    if (p1.uid === p2.uid) {
        alert("不能融合同一只精灵！");
        return;
    }

    // 1. 扣除金币
    setGold(g => g - 500);

    // 2. 决定基础形象 (50% 概率)
    const baseParent = Math.random() < 0.5 ? p1 : p2;
    
    // 3. 决定是否异色 (20%)
    const isFusedShiny = Math.random() < 0.2;

    // 4. 决定是否双属性 (20%)
    const isDualType = Math.random() < 0.2;
    const primaryType = baseParent.type;
    let secondaryType = null;
    if (isDualType) {
        const otherParent = baseParent.uid === p1.uid ? p2 : p1;
        if (otherParent.type !== primaryType) {
            secondaryType = otherParent.type;
        }
    }

    // 5. 种族值混合算法
    // 获取父母当前的种族值 (如果是融合过的，取 customBaseStats；如果是原版，查表)
    const getBase = (pet) => pet.customBaseStats || (POKEDEX.find(d=>d.id===pet.id) || POKEDEX[0]);
    const b1 = getBase(p1);
    const b2 = getBase(p2);

    const mixStat = (key) => {
        // 兼容处理：有些数据源可能只有 atk/def 字段
        const v1 = b1[key] || (key.includes('atk') ? b1.atk : b1.def) || 50;
        const v2 = b2[key] || (key.includes('atk') ? b2.atk : b2.def) || 50;
        
        // 核心规则：Min*0.9 ~ Max*1.1
        const min = Math.min(v1, v2) * 0.9;
        const max = Math.max(v1, v2) * 1.1;
        return Math.floor(min + Math.random() * (max - min));
    };

    const newBaseStats = {
        hp: mixStat('hp'),
        p_atk: mixStat('p_atk'),
        p_def: mixStat('p_def'),
        s_atk: mixStat('s_atk'),
        s_def: mixStat('s_def'),
        spd: mixStat('spd'),
        crit: Math.max(b1.crit||5, b2.crit||5) // 暴击率取较高的那个
    };

    // 6. 技能融合 (随机取4个)
    const poolMoves = [...p1.moves, ...p2.moves];
    const uniqueMoves = _.uniqBy(poolMoves, 'name');
    const finalMoves = _.sampleSize(uniqueMoves, 4);

    // 7. 等级计算 (取平均值)
    const avgLevel = Math.floor((p1.level + p2.level) / 2);
    
    // 计算该等级所需的升级经验
    const natureData = NATURE_DB[baseParent.nature || 'docile'];
    const expMod = natureData?.exp || 1.0;
    const newNextExp = Math.floor(avgLevel * 100 * expMod);

    // 定义随机 IV
    const randIV = () => Math.floor(Math.random() * 32); 

    // 8. 生成新精灵对象
    const newPet = {
        ...baseParent, 
        uid: Date.now(),
        name: `融合·${baseParent.name}`,
        
        // 设定为平均等级
        level: avgLevel, 
        exp: 0,
        nextExp: newNextExp,
        
        moves: finalMoves,
        customBaseStats: newBaseStats, // 写入混合后的种族值
        secondaryType: secondaryType,
        isFusedShiny: isFusedShiny,
        isShiny: isFusedShiny,
        equip: null,
        
        // 随机生成个体值
        ivs: { 
            hp: randIV(), p_atk: randIV(), p_def: randIV(), 
            s_atk: randIV(), s_def: randIV(), spd: randIV(), 
            crit: Math.floor(Math.random() * 10) 
        },
        evs: {}
    };

    // 9. 重新计算面板属性
    // getStats 会使用 newPet.level (平均等级) 和 newBaseStats (新种族值) 来计算
    const finalStats = getStats(newPet);
    newPet.currentHp = finalStats.maxHp; // 满血复活

    // 10. 更新队伍
    const remainingParty = party.filter((_, i) => i !== p1Idx && i !== p2Idx);
    const newParty = [newPet, ...remainingParty]; 

    setParty(newParty);
    setFusionSlots([null, null]);
    setFusionMode(false);

    // 11. 提示信息
    let msg = `🌀 融合成功！\n获得了 Lv.${newPet.level} ${newPet.name}！`;
    if (isFusedShiny) msg += "\n✨ 发生突变！是异色闪光精灵！";
    if (isDualType) msg += `\n⚡ 觉醒了双重属性：${TYPES[primaryType].name} / ${TYPES[secondaryType].name}`;
    
    alert(msg);
    setAnimEffect({ type: 'EVOLUTION', target: 'player' }); 
    setTimeout(() => setAnimEffect(null), 1500);
  };
  // --- 融合逻辑处理函数 ---
  const handleFusion = () => {
    if (!fusionParent || !fusionChild) return;
    if (gold < 500) { alert("金币不足！"); return; }
    
    // 1. 扣除金币
    setGold(g => g - 500);

    // 2. 生成子代 (以母本为原型，等级重置为1)
    // 注意：这里假设你有一个 createPokemon 函数，如果没有，请替换为你生成精灵的逻辑
    const newPet = { ...JSON.parse(JSON.stringify(POKEDEX.find(p => p.id === fusionChild.id) || fusionChild)) };
    newPet.uid = Date.now() + Math.random(); // 生成新ID
    newPet.level = 1;
    newPet.currentHp = newPet.hp; // 假设基础hp
    newPet.exp = 0;
    newPet.nextExp = 100;
    
    // 3. 融合特性：概率异色 (20%)
    if (Math.random() < 0.2) {
        newPet.isFusedShiny = true; // 标记为融合异色
    }

    // 4. 继承父本的一个技能 (如果有)
    if (fusionParent.moves && fusionParent.moves.length > 0) {
        const inheritMove = fusionParent.moves[Math.floor(Math.random() * fusionParent.moves.length)];
        if (!newPet.moves) newPet.moves = [];
        // 避免重复
        if (!newPet.moves.find(m => m.name === inheritMove.name)) {
            newPet.moves.push(inheritMove);
        }
    }

    // 5. 更新队伍：移除父母，添加子代
    const newParty = party.filter(p => p.uid !== fusionParent.uid && p.uid !== fusionChild.uid);
    newParty.push(newPet);
    setParty(newParty);
    
    // 6. 重置并提示
    setFusionParent(null);
    setFusionChild(null);
    alert(`🧬 融合成功！\n父母消失了，一只全新的 ${newPet.name} (Lv.1) 诞生了！\n${newPet.isFusedShiny ? "✨ 哇！发生了基因突变，是异色个体！" : ""}`);
  };

    // ==========================================
  // [重构] 基因融合实验室 (居中弹窗版)
  // ==========================================
  const renderFusion = () => {
    if (!fusionMode) return null; 
    return (
      <div className="screen fusion-screen">
        {/* 1. 全屏遮罩与居中容器 */}
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          
          {/* 2. 实验室主卡片 */}
          <div className="fusion-card-centered" style={{
              width: '420px', background: '#1a1a2e', borderRadius: '24px',
              border: '1px solid #333', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              position: 'relative', color: '#fff'
          }}>
            
            {/* 标题栏 */}
            <div style={{
                padding: '15px 20px', background: 'linear-gradient(90deg, #303f9f, #1a1a2e)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold', fontSize:'16px'}}>
                    <span style={{fontSize:'20px'}}>🧬</span> 基因融合实验室
                </div>
                <button onClick={() => setFusionMode(false)} style={{
                    background:'transparent', border:'none', color:'#aaa', fontSize:'24px', cursor:'pointer'
                }}>×</button>
            </div>

            {/* 融合槽位区 */}
            <div style={{padding: '30px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                {/* 父本 */}
                <div onClick={() => setFusionSlot('parent')} style={{
                    width: '100px', height: '100px', borderRadius: '16px',
                    border: fusionParent ? '2px solid #4CAF50' : '2px dashed #555',
                    background: fusionParent ? '#222' : 'rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: '0.2s'
                }}>
                    {fusionParent ? (
                        <>
                            <div style={{fontSize:'36px'}}>{renderAvatar(fusionParent)}</div>
                            <div style={{fontSize:'10px', marginTop:'4px', color:'#aaa'}}>{fusionParent.name}</div>
                        </>
                    ) : (
                        <span style={{color:'#555', fontSize:'12px'}}>选择父本</span>
                    )}
                </div>

                <div style={{fontSize: '24px', color: '#555', fontWeight: 'bold'}}>+</div>

                {/* 母本 */}
                <div onClick={() => setFusionSlot('child')} style={{
                    width: '100px', height: '100px', borderRadius: '16px',
                    border: fusionChild ? '2px solid #E91E63' : '2px dashed #555',
                    background: fusionChild ? '#222' : 'rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: '0.2s'
                }}>
                    {fusionChild ? (
                        <>
                            <div style={{fontSize:'36px'}}>{renderAvatar(fusionChild)}</div>
                            <div style={{fontSize:'10px', marginTop:'4px', color:'#aaa'}}>{fusionChild.name}</div>
                        </>
                    ) : (
                        <span style={{color:'#555', fontSize:'12px'}}>选择母本</span>
                    )}
                </div>
            </div>

            {/* 信息提示区 */}
            <div style={{padding: '0 20px', fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                <div style={{marginBottom: '8px', color: '#FFD700'}}>💰 费用: 500 金币</div>
                <div style={{background: 'rgba(255,167,38,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,167,38,0.2)'}}>
                    <div style={{color: '#FFA726', fontWeight: 'bold', marginBottom: '4px'}}>⚠️ 警告</div>
                    融合后父母将消失，生成一只全新的子代。
                </div>
                <div style={{marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div>🧬 20% 概率变异为【异色】(属性大幅增强)</div>
                    <div>⚡ 20% 概率觉醒【双属性】</div>
                </div>
            </div>

            {/* 底部按钮 */}
            <div style={{padding: '20px'}}>
                <button 
                    disabled={!fusionParent || !fusionChild || gold < 500}
                    onClick={handleFusion}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                        background: (!fusionParent || !fusionChild || gold < 500) ? '#333' : 'linear-gradient(90deg, #303f9f, #7b1fa2)',
                        color: (!fusionParent || !fusionChild || gold < 500) ? '#666' : '#fff',
                        fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                        boxShadow: (!fusionParent || !fusionChild || gold < 500) ? 'none' : '0 4px 15px rgba(123, 31, 162, 0.4)'
                    }}
                >
                    {gold < 500 ? '金币不足' : '开始融合'}
                </button>
            </div>

            {/* 队伍选择抽屉 (嵌入在卡片底部或作为覆盖层) */}
            {fusionSlot && (
                <div style={{
                    position: 'absolute', top: '60px', left: 0, right: 0, bottom: 0,
                    background: '#1a1a2e', zIndex: 10, padding: '15px',
                    display: 'flex', flexDirection: 'column', borderTop: '1px solid #333',
                    animation: 'slideUp 0.2s ease-out'
                }}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'12px', color:'#aaa'}}>
                        <span>从队伍中选择 {fusionSlot==='parent'?'父本':'母本'}:</span>
                        <span onClick={() => setFusionSlot(null)} style={{cursor:'pointer', color:'#fff'}}>取消</span>
                    </div>
                    <div style={{flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignContent: 'start'}}>
                        {party.map((p, i) => {
                            const isSelected = (fusionParent && fusionParent.uid === p.uid) || (fusionChild && fusionChild.uid === p.uid);
                            return (
                                <div key={i} onClick={() => {
                                    if (isSelected) return;
                                    if (fusionSlot === 'parent') setFusionParent(p);
                                    else setFusionChild(p);
                                    setFusionSlot(null);
                                }} style={{
                                    background: isSelected ? '#222' : '#2a2a40',
                                    borderRadius: '10px', padding: '10px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    opacity: isSelected ? 0.3 : 1, cursor: isSelected ? 'default' : 'pointer',
                                    border: '1px solid #333'
                                }}>
                                    <div style={{fontSize:'24px'}}>{renderAvatar(p)}</div>
                                    <div style={{fontSize:'10px', marginTop:'4px', color:'#fff'}}>{p.name}</div>
                                    <div style={{fontSize:'9px', color:'#666'}}>Lv.{p.level}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    );
  };
     const renderInfinityCastle = () => {
    if (!infinityState) return null;
    const { floor, status, buffs, buffOptions } = infinityState;

    return (
      <div className="screen" style={{
          background: 'linear-gradient(180deg, #1a0b2e 0%, #000 100%)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* 顶部信息 */}
        <div style={{width:'100%', padding:'20px', display:'flex', justifyContent:'space-between', background:'rgba(255,255,255,0.05)'}}>
            <div style={{fontSize:'20px', fontWeight:'bold', color:'#E040FB'}}>🏯 无限城 - 第 {floor} 层</div>
            <button onClick={() => {
                if(confirm("确定要退出吗？进度将丢失，Buff也会重置。")) {
                    // 退出时建议重置队伍状态(可选)，防止Buff带出副本
                    // 这里简单处理直接退出
                    setInfinityState(null); setView('world_map');
                }
            }} style={{background:'transparent', border:'1px solid #666', color:'#aaa', padding:'5px 15px', borderRadius:'20px', fontSize:'12px'}}>放弃</button>
        </div>

        {/* 已获 Buff 展示栏 */}
        <div style={{width:'100%', padding:'10px', display:'flex', gap:'8px', overflowX:'auto', background:'rgba(0,0,0,0.3)'}}>
            {buffs.length === 0 && <span style={{fontSize:'12px', color:'#666', paddingLeft:'10px'}}>暂无呼吸法加成</span>}
            {buffs.map((b, i) => (
                <span key={i} style={{
                    fontSize:'10px', background:'#4A148C', color:'#E1BEE7', 
                    padding:'4px 8px', borderRadius:'4px', whiteSpace:'nowrap',
                    border:'1px solid #7B1FA2'
                }}>{b.name}</span>
            ))}
        </div>

        {/* 主体内容 */}
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
            
            {/* 1. 选门阶段 */}
            {status === 'selecting' && (
                <div style={{textAlign:'center', animation:'fadeIn 0.5s'}}>
                    <div style={{fontSize:'16px', marginBottom:'40px', color:'#ccc'}}>
                        <div style={{fontSize:'40px', marginBottom:'10px'}}>👹</div>
                        选择前进的道路...
                    </div>
                    <div style={{display:'flex', gap:'20px', justifyContent:'center'}}>
                        {/* 普通门 */}
                        <div onClick={() => startInfinityBattle('normal')} className="door-card" style={{
                            width:'140px', padding:'20px', background:'#333', borderRadius:'12px', cursor:'pointer', border:'2px solid #555'
                        }}>
                            <div style={{fontSize:'60px'}}>🚪</div>
                            <div style={{marginTop:'15px', fontWeight:'bold'}}>普通鬼气</div>
                            <div style={{fontSize:'10px', color:'#888', marginTop:'5px'}}>稳扎稳打</div>
                        </div>
                        {/* 精英门 */}
                        <div onClick={() => startInfinityBattle('hard')} className="door-card" style={{
                            width:'140px', padding:'20px', background:'#3E2723', borderRadius:'12px', cursor:'pointer', border:'2px solid #FF5252'
                        }}>
                            <div style={{fontSize:'60px', filter:'drop-shadow(0 0 10px red)'}}>⛩️</div>
                            <div style={{marginTop:'15px', fontWeight:'bold', color:'#FF5252'}}>强烈的鬼气</div>
                            <div style={{fontSize:'10px', color:'#aaa', marginTop:'5px'}}>高风险高回报</div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Buff 选择阶段 */}
            {status === 'buff_select' && (
                <div style={{textAlign:'center', width:'90%', maxWidth:'600px', animation:'slideUp 0.5s'}}>
                    <div style={{fontSize:'24px', marginBottom:'10px', color:'#FFD700', textShadow:'0 0 10px #FFD700'}}>✨ 呼吸法领悟 ✨</div>
                    <div style={{fontSize:'12px', color:'#aaa', marginBottom:'30px'}}>通过了试炼，你的队伍变得更强了...</div>
                    
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                        {buffOptions.map((buff, i) => (
                            <div key={i} onClick={() => selectInfinityBuff(buff)} style={{
                                background:'linear-gradient(135deg, #311B92 0%, #000 100%)', 
                                padding:'25px 15px', borderRadius:'16px',
                                cursor:'pointer', border:'1px solid #7B1FA2', 
                                transition:'0.3s', position:'relative', overflow:'hidden',
                                boxShadow:'0 10px 30px rgba(0,0,0,0.5)'
                            }} 
                            onMouseOver={e=>{e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor='#E040FB'}}
                            onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#7B1FA2'}}
                            >
                                <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'10px', color:'#E1BEE7'}}>{buff.name}</div>
                                <div style={{fontSize:'12px', color:'#ccc', lineHeight:'1.5'}}>{buff.desc}</div>
                                <div style={{
                                    position:'absolute', bottom:'-10px', right:'-10px', 
                                    fontSize:'60px', opacity:0.1, pointerEvents:'none'
                                }}>⚔️</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    );
  };
  // ==========================================
  // 9. [新增] 锁定界面
  // ==========================================
  const renderLocked = () => (
      <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
         <div style={{fontSize: '60px', marginBottom: '20px'}}>🔒</div>
         <h2 style={{marginBottom: '10px'}}>功能尚未开放</h2>
         <button onClick={() => setView('world_map')} style={{padding: '12px 40px', fontSize: '16px', borderRadius: '25px', border: 'none', cursor: 'pointer', background: '#fff', color: '#333', fontWeight: 'bold'}}>返回 (Space)</button>
      </div>
  );


    // ==========================================
  // [修复] 战斗联盟界面 (修复了未解锁状态的语法错误)
  // ==========================================
  const renderLeague = () => {
    // 检查解锁条件 (通关冠军之路后解锁)
    const isUnlocked = storyProgress >= 12;

    // --- 1. 未解锁状态 (显示锁定提示) ---
    if (!isUnlocked) {
        return (
            <div className="screen" style={{background:'#263238', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexDirection:'column'}}>
                <div style={{fontSize:'50px', marginBottom:'20px'}}>🔒</div>
                <div>战斗联盟尚未开放</div>
                <div style={{fontSize:'12px', color:'#999', marginTop:'10px'}}>需通关【冠军之路】剧情后解锁</div>
                
                {/* 返回按钮 */}
                <button 
                    style={{
                        marginTop:'30px', color:'#fff', background:'#304FFE',
                        border:'1px solid #fff', padding:'10px 30px', 
                        borderRadius:'20px', cursor:'pointer', fontWeight:'bold'
                    }} 
                    onClick={() => setView('grid_map')} // 返回地图
                >
                    🔙 返回
                </button>
            </div>
        );
    }

    // --- 2. 已解锁状态 (显示联盟主界面) ---
    const rounds = [
        { id: 1, name: '16强赛', opponents: 16 },
        { id: 2, name: '8强赛', opponents: 8 },
        { id: 3, name: '半决赛', opponents: 4 },
        { id: 4, name: '总决赛', opponents: 2 }
    ];

    return (
      <div className="screen" style={{background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', color:'#fff', display:'flex', flexDirection:'column'}}>
        <div className="nav-header glass-panel" style={{background:'rgba(0,0,0,0.3)', borderBottom:'none'}}>
          <button className="btn-back" 
            style={{
                color:'#fff', 
                background:'#304FFE', 
                border:'1px solid #fff', 
                padding:'5px 15px', 
                borderRadius:'20px', 
                cursor:'pointer',
                fontWeight: 'bold'
            }} 
            onClick={() => setView('grid_map')}
          >
            🔙 退出联盟
          </button>
          <div className="nav-title">🏆 世界战斗联盟</div>
          <div style={{width:60}}></div>
        </div>

        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'20px', overflowY:'auto'}}>
            
            {/* 冠军奖杯展示 */}
            <div style={{textAlign:'center', marginBottom:'30px'}}>
                <div style={{fontSize:'60px', filter:'drop-shadow(0 0 10px gold)'}}>🏆</div>
                <div style={{fontSize:'24px', fontWeight:'bold', margin:'10px 0'}}>
                    历史夺冠次数: <span style={{color:'#FFD700', fontSize:'32px'}}>{leagueWins}</span>
                </div>
                <div style={{fontSize:'12px', opacity:0.8}}>与世界各地的顶尖训练家一决高下！</div>
            </div>

            {/* 赛程进度 */}
            <div style={{width:'100%', maxWidth:'400px', display:'flex', flexDirection:'column', gap:'15px'}}>
                {rounds.map(r => {
                    const isCurrent = leagueRound === r.id;
                    const isPassed = leagueRound > r.id;
                    const isFuture = leagueRound < r.id && leagueRound !== 0;
                    
                    let statusColor = '#5c6bc0'; // 默认蓝
                    if (isCurrent) statusColor = '#FFD700'; // 当前金
                    else if (isPassed) statusColor = '#4CAF50'; // 已过绿
                    else if (leagueRound === 0) statusColor = '#78909c'; // 未开始灰

                    return (
                        <div key={r.id} style={{
                            background: isCurrent ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `2px solid ${statusColor}`,
                            borderRadius: '12px', padding: '15px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            opacity: isFuture ? 0.5 : 1,
                            transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                            transition: '0.3s'
                        }}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div style={{
                                    width:'30px', height:'30px', borderRadius:'50%', 
                                    background: statusColor, color: isCurrent?'#000':'#fff',
                                    display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'
                                }}>
                                    {isPassed ? '✓' : r.id}
                                </div>
                                <div style={{fontWeight:'bold', fontSize:'16px', color: isCurrent?'#FFD700':'#fff'}}>
                                    {r.name}
                                </div>
                            </div>
                            <div style={{fontSize:'12px', opacity:0.7}}>
                                {isCurrent ? '正在进行' : (isPassed ? '已晋级' : '等待中')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 操作按钮 */}
            <div style={{marginTop:'auto', width:'100%', maxWidth:'300px', paddingTop:'20px'}}>
                {leagueRound === 0 ? (
                    <button onClick={() => {
                        if(party.length < 1) { alert("请先携带精灵！"); return; }
                        setLeagueRound(1);
                    }} style={{
                        width:'100%', padding:'15px', borderRadius:'30px', border:'none',
                        background: 'linear-gradient(90deg, #FFC107, #FF9800)',
                        color:'#fff', fontSize:'18px', fontWeight:'bold', cursor:'pointer',
                        boxShadow: '0 5px 15px rgba(255, 152, 0, 0.4)'
                    }}>
                        报名参赛
                    </button>
                ) : (
                    <button onClick={() => startBattle(null, 'league')} style={{
                        width:'100%', padding:'15px', borderRadius:'30px', border:'none',
                        background: 'linear-gradient(90deg, #F44336, #D32F2F)',
                        color:'#fff', fontSize:'18px', fontWeight:'bold', cursor:'pointer',
                        boxShadow: '0 5px 15px rgba(211, 47, 47, 0.4)',
                        animation: 'pulse 1.5s infinite'
                    }}>
                        ⚔️ 开始比赛
                    </button>
                )}
                
                {leagueRound > 0 && (
                    <div style={{textAlign:'center', marginTop:'10px', fontSize:'12px', color:'#aaa', cursor:'pointer', textDecoration:'underline'}}
                         onClick={() => { if(confirm("确定要弃权吗？进度将丢失。")) setLeagueRound(0); }}>
                        放弃比赛
                    </div>
                )}
            </div>

        </div>
      </div>
    );
  };

    // ==========================================
  // [修改] 初始精灵生成 (预先生成完整个体，保证所见即所得)
  // ==========================================
  const generateStarterOptions = () => {
    // 1. 找出所有“是进化型”的ID
    const evolvedIds = new Set();
    POKEDEX.forEach(p => {
      if (p.evo) evolvedIds.add(p.evo);
    });

    // 2. 动态筛选合法的初始精灵
    const validStarters = POKEDEX.filter(p => {
      if (!p || !p.id) return false;
      if (evolvedIds.has(p.id)) return false;
      if (LEGENDARY_POOL.includes(p.id)) return false;
      if (HIGH_TIER_POOL.includes(p.id)) return false;
      if (NEW_GOD_IDS.includes(p.id)) return false;
      if (p.id >= 254) return false;
      return true;
    });

    // 3. 随机取 3 个，并立即实例化 (生成性格/个体值)
    const shuffled = _.shuffle(validStarters);
    const selectedBase = shuffled.slice(0, 3);
    
    // 🔥 关键修改：在这里直接 createPet，锁定数值
    const fullyFormedStarters = selectedBase.map(base => {
        return createPet(base.id, 5); // 生成 5 级精灵
    });
    
    setStarterOptions(fullyFormedStarters);
  };

   // ----------------------------------------
  // [修正] 动态技能生成 (添加 acc 命中率)
  // ----------------------------------------
  const getMoveByLevel = (type, level) => {
    const db = SKILL_DB[type] || SKILL_DB.NORMAL;
    const index = Math.floor(level / 5); 
    
    const template = db[index % db.length];
    let name = template.name;
    let power = (template.p !== undefined) ? template.p : 40;
    let pp = template.pp || 15;
    
    // [Issue 2] 默认命中率 100，威力越大概率越低
    let acc = template.acc || 100; 
    if (power >= 120) acc = 85;
    if (power >= 150) acc = 75; // 强力技能容易打空

    const tier = Math.floor(index / db.length);
    if (power > 0) {
        if (tier === 1) {
            name = `真·${name}`;
            power = Math.floor(power * 1.3);
        } else if (tier === 2) {
            name = `超·${name}`;
            power = Math.floor(power * 1.6);
        } else if (tier >= 3) {
            name = `神·${name}`;
            power = Math.floor(power * 2.2);
        }
    }

    return { name, p: power, t: type, pp, maxPP: pp, val: template.val, effect: template.effect, acc };
  };


   const useBerry = (petIdx) => {
    if (inventory.berries <= 0) return;
    const t = [...party];
    const p = t[petIdx];
    const stats = getStats(p);
    
    // 即使满血也可以喂食来增加亲密度，除非亲密度也满了
    if (p.currentHp >= stats.maxHp && (p.intimacy || 0) >= 255) { 
        alert("它已经吃饱了，而且非常喜欢你！"); 
        return; 
    }
    
    // 恢复体力
    p.currentHp = Math.min(stats.maxHp, p.currentHp + 30);
    p.exp += 20;
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    const oldInt = p.intimacy || 0;
    p.intimacy = Math.min(255, oldInt + 3);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    setInventory(prev => ({...prev, berries: prev.berries - 1}));
    
    // 提示变化
    if (p.intimacy > oldInt) {
        // 简单的爱心特效提示，这里用 alert 或者 log 都可以
        // 如果是在战斗外，alert 比较合适
        // alert(`${p.name} 吃得很开心！(亲密度 +3)`); 
    }
  };


   // [修正] 使用伤药 (适配 inventory.meds)
  const usePotion = (petIdx) => {
    if ((inventory.meds.potion || 0) <= 0) { alert("没有伤药了！"); return; }
    
    const t = [...party];
    const p = t[petIdx];
    const stats = getStats(p);
    if (p.currentHp >= stats.maxHp) { alert("体力已满。"); return; }
    
    // 恢复逻辑
    p.currentHp = Math.min(stats.maxHp, p.currentHp + 20); 
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    
    setInventory(prev => ({
        ...prev, 
        meds: { ...prev.meds, potion: prev.meds.potion - 1 }
    }));
    alert(`使用了伤药，${p.name} 恢复了体力！(亲密度 +1)`);
  };

    // [修正] 使用PP补剂 (适配 inventory.meds)
  const useEther = (petIdx) => {
    // 修改点：从 inventory.meds.ether 读取
    if ((inventory.meds.ether || 0) <= 0) { alert("没有PP补剂了！"); return; }
    
    const t = [...party];
    const p = t[petIdx];
    
    let restored = false;
    p.moves.forEach(m => {
      if (m.pp < (m.maxPP || 15)) {
        m.pp = Math.min((m.maxPP || 15), m.pp + 10);
        restored = true;
      }
    });

    if (!restored) {
      alert("技能点数已满，无需使用。");
      return;
    }
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    // 修改点：扣除 inventory.meds.ether
    setInventory(prev => ({
        ...prev, 
        meds: { ...prev.meds, ether: prev.meds.ether - 1 }
    }));
    alert(`${p.name} 的技能 PP 得到了恢复！(亲密度 +1)`);
  };

const useGrowthItem = (petIndex, itemId) => {
    const item = GROWTH_ITEMS.find(i => i.id === itemId);
    if (!item || (inventory[itemId] || 0) <= 0) return;

    const newParty = [...party];
    const pet = newParty[petIndex];

    // 初始化培养加成记录 (evs)
    if (!pet.evs) pet.evs = {};
    if (!pet.evs[item.stat]) pet.evs[item.stat] = 0;

    // 增加属性
    pet.evs[item.stat] += item.val;
    
    // 扣除道具
    const newInv = { ...inventory };
    newInv[itemId]--;

    // 如果是HP道具，顺便回点血
    if (item.stat === 'maxHp') {
        pet.currentHp += item.val;
    }

    setParty(newParty);
    setInventory(newInv);
    
    alert(`${pet.name} 使用了 ${item.name}！\n${item.desc} +${item.val}`);
  };
  const setLeader = (index) => {
    if (index === 0) return;
    const newTeam = [...party];
    const [leader] = newTeam.splice(index, 1);
    newTeam.unshift(leader);
    setParty(newTeam);
  };

      const enterMap = (mapId) => {
    // 1. 检查球 (保持不变)
    const totalBalls = Object.values(inventory.balls).reduce((a,b)=>a+b, 0);
    if (totalBalls === 0) {
       setInventory(prev => ({...prev, balls: {...prev.balls, poke: 5}}));
       alert("检测到你没有捕获球，系统赠送了 5 个精灵球！");
    }
    
    setCurrentMapId(mapId);

    // 2. 剧情触发 (保持不变)
    const currentChapter = STORY_SCRIPT[storyProgress];
    if (currentChapter && currentChapter.mapId === mapId && storyStep === 0) {
       if (!viewedIntros.includes(storyProgress)) {
            setDialogQueue(currentChapter.intro);
            setCurrentDialogIndex(0);
            setIsDialogVisible(true);
            setViewedIntros(prev => [...prev, storyProgress]);
        }
    }

    // 3. 生成地图网格
    let newGrid; // <--- 在这里声明

    // ▼▼▼▼▼▼ 特殊地图生成：日蚀要塞 (ID 99) ▼▼▼▼▼▼
    if (mapId === 99) {
        // 创建全障碍地图
        newGrid = Array(GRID_H).fill(0).map(() => Array(GRID_W).fill(1));
        
        // 挖出一条中间大道
        const midY = Math.floor(GRID_H / 2);
        for (let x = 1; x < GRID_W - 1; x++) {
            newGrid[midY][x] = 2;     // 地面
            newGrid[midY-1][x] = 2;   // 宽一点的路
            newGrid[midY+1][x] = 2;
        }

        // 放置敌人 (Tile 11: 杂兵, 12: 干部, 13: 首领)
        const enemyPositions = [
            {x: 4, type: 11}, {x: 6, type: 11}, {x: 8, type: 11}, {x: 10, type: 11}, // 4个杂兵
            {x: 13, type: 12}, {x: 15, type: 12}, {x: 17, type: 12}, // 3个干部
            {x: 20, type: 12}, {x: 22, type: 12}, // 2个精英干部
            {x: 26, type: 13}  // 1个首领
        ];

        enemyPositions.forEach(e => {
            newGrid[midY][e.x] = e.type;
            // 封路，强制战斗
            newGrid[midY-1][e.x] = 1; 
            newGrid[midY+1][e.x] = 1;
        });

        // 出生点
        newGrid[midY][1] = 2;
        newGrid[midY][2] = 8; // 恢复点
        
        setPlayerPos({x: 1, y: midY});
        
        setDialogQueue([
            { name: '系统', text: '警告：检测到极高能量反应！' },
            { name: '大木博士', text: '这里就是日蚀队的总部...他们似乎在进行某种可怕的实验。' },
            { name: '日蚀队广播', text: '入侵者！你竟敢踏入这片圣地！全员戒备，格杀勿论！' }
        ]);
        setCurrentDialogIndex(0);
        setIsDialogVisible(true);

    } else {
        // ▼▼▼▼▼▼ [修正点] 这里不要用 const newGrid，直接赋值给外面的 newGrid ▼▼▼▼▼▼
        newGrid = Array(GRID_H).fill(0).map(() => Array(GRID_W).fill(2));
        
        // ... (这里保留你原有的随机生成逻辑，不要动) ...
        for(let y=0; y<GRID_H; y++) {
          for(let x=0; x<GRID_W; x++) {
            if (y===0 || y===GRID_H-1 || x===0 || x===GRID_W-1) {
              newGrid[y][x] = 1;
            } else {
              const rand = Math.random();
              if (rand < 0.12) newGrid[y][x] = 1; 
              else if (rand < 0.16) newGrid[y][x] = 3; 
              else if (rand < 0.19) newGrid[y][x] = 6; 
              else if (rand < 0.25) newGrid[y][x] = 5; 
              else if (rand < 0.35) newGrid[y][x] = 7; 
            }
          }
        }
        // 清理出生点和固定设施...
        const clearArea = (cx, cy) => {
          for(let dy=-1; dy<=1; dy++) {
            for(let dx=-1; dx<=1; dx++) {
              if (newGrid[cy+dy] && newGrid[cy+dy][cx+dx]) newGrid[cy+dy][cx+dx] = 2;
            }
          }
        };
        clearArea(1, 2); 
        clearArea(GRID_W-2, GRID_H-2); 
        newGrid[1][1] = 8; 
        newGrid[1][2] = 10; 
        newGrid[GRID_H-2][GRID_W-2] = 9; 
        for(let i=0; i<5; i++) {
          let rx, ry;
          do { rx = _.random(1, GRID_W-2); ry = _.random(1, GRID_H-2); } while(newGrid[ry][rx] !== 2);
          newGrid[ry][rx] = 4;
        }
        if (currentChapter && currentChapter.mapId === mapId && currentChapter.tasks) {
           const currentTask = currentChapter.tasks.find(t => t.step === storyStep);
           if (currentTask) {
              newGrid[currentTask.y][currentTask.x] = 99; 
           }
        }
        setPlayerPos({x: 1, y: 2}); 
    }
     // ▼▼▼ [新增] 放置大赛 NPC (Tile ID: 20=捕虫, 21=钓鱼, 22=选美) ▼▼▼
        if (mapId === 1) { // 微风草原 -> 捕虫
            newGrid[3][3] = 20; 
        }
        else if (mapId === 4) { // 深蓝海域 -> 钓鱼
            newGrid[4][4] = 21;
        }
        else if (mapId === 11) { // 糖果王国 -> 选美
            newGrid[5][15] = 22;
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    setMapGrid(newGrid);
    setView('grid_map');
  };

    // ==========================================
  // 核心：移动交互与事件触发逻辑
  // ==========================================
  useEffect(() => {
    if (playerPos.intent) {
      const { x, y, dx, dy } = playerPos;
      // 立即重置意图，防止重复触发
      setPlayerPos(prev => ({...prev, intent: false}));
      
      // ------------------------------------------------
      // 1. 边界检查
      // ------------------------------------------------
      if (x < 0 || x >= GRID_W || y < 0 || y >= GRID_H) {
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      const tileType = mapGrid[y][x];

      // ------------------------------------------------
      // 2. 障碍物 (Tile 1)
      // ------------------------------------------------
      if (tileType === 1) {
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      // ------------------------------------------------
      // 3. 日蚀队敌人 (Tile 11: 杂兵, 12: 干部, 13: 首领)
      // ------------------------------------------------
      if (tileType === 11) {
          // 撞到杂兵 -> 触发战斗 -> 玩家回弹
          const gruntLvl = _.random(80, 85);
          const gruntPool = [169, 181, 185, 186, 188, 189]; 
          startBattle({
              id: 999,
              name: '日蚀队 突击兵',
              lvl: [gruntLvl, gruntLvl],
              pool: gruntPool,
              drop: 800
          }, 'eclipse_grunt');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }

      if (tileType === 12) {
          // 撞到干部 -> 触发战斗 -> 玩家回弹
          const execLvl = _.random(86, 89);
          const execPool = [139, 140, 182, 190, 206, 212]; 
          startBattle({
              id: 999,
              name: '日蚀队 干部',
              lvl: [execLvl, execLvl],
              pool: execPool,
              drop: 1500
          }, 'eclipse_executive');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }

      if (tileType === 13) {
          // 撞到首领 -> 确认 -> 触发战斗 -> 玩家回弹
          if (confirm("⚠️ 前方就是日蚀队首领！\n这是最后的决战，确定要开始吗？")) {
              startBattle(null, 'eclipse_leader');
          }
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      
      // 🔥 [修改] 遇到活动NPC，不再直接 confirm，而是打开详情弹窗
      if (tileType === 20) { // 捕虫
          setActivityModal('bug');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      if (tileType === 21) { // 钓鱼
          setActivityModal('fishing');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      if (tileType === 22) { // 选美
          setActivityModal('beauty');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      // ------------------------------------------------
      // 4. 剧情任务点 (Tile 99)
      // ------------------------------------------------
      if (tileType === 99) {
        const currentChapter = STORY_SCRIPT[storyProgress];
        const task = currentChapter?.tasks?.find(t => t.step === storyStep);
        
        if (task) {
           // 1. 播放对话
           setDialogQueue([{ name: task.name, text: task.text }]);
           setCurrentDialogIndex(0);
           setIsDialogVisible(true);

           // 2. 清除地图上的这个点 (视觉上变为平地)
           setMapGrid(prev => {
               const newGrid = prev.map(row => [...row]);
               newGrid[y][x] = 2;
               return newGrid;
           });

           // 3. 将任务存入挂起状态，等待对话结束后执行(战斗或推进剧情)
           setPendingTask(task);
        }
        // 踩上去不回弹，停在格子上
        return; 
      }

      // ------------------------------------------------
      // 5. 特殊地形交互 (水域/岩石)
      // ------------------------------------------------
      // 水域 (Tile 3) - 需要 4 个徽章
      if (tileType === 3) {
        if (badges.length < 4) {
          alert(`前方是深水区！\n需要获得 4 枚徽章才能使用【冲浪】通过。`);
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
          return;
        } else {
           // 有徽章可以通过，30%概率遇敌
           if (Math.random() < 0.3) setTimeout(() => startBattle(null, 'water_special'), 200);
        }
      }

      // 岩石 (Tile 6) - 需要 2 个徽章
      if (tileType === 6) {
        if (badges.length < 2) {
          alert(`巨大的岩石挡住了去路！\n需要获得 2 枚徽章才能使用【碎岩】通过。`);
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
          return;
        } else {
           // 碎岩成功：清除岩石
           setMapGrid(prev => {
               const newGrid = prev.map(row => [...row]);
               newGrid[y][x] = 2;
               return newGrid;
           });
           
           if (Math.random() < 0.5) {
              setTimeout(() => startBattle(null, 'rock_special'), 200);
           } else {
              setEventData({ type: 'LOOT', title: '碎岩成功', desc: '你粉碎了岩石！', reward: {} });
              setView('event');
           }
           return; 
        }
      }

      // ------------------------------------------------
      // 6. 宝箱 (Tile 4) - 综合掉落逻辑
      // ------------------------------------------------
      if (tileType === 4) {
        // 清除宝箱
        setMapGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[y][x] = 2;
            return newGrid;
        });
        
        const rand = Math.random();
        let rewardTitle = "";
        let rewardDesc = "";

        if (rand < 0.3) {
            // 30% 金币
            const amt = _.random(200, 800);
            setGold(g => g + amt);
            rewardTitle = "获得金币"; rewardDesc = `获得 ${amt} 金币`;
        } else if (rand < 0.55) {
            // 25% 树果或普通球
            if (Math.random() < 0.5) {
                setInventory(prev => ({...prev, berries: prev.berries + 3}));
                rewardTitle = "采集成功"; rewardDesc = "获得 树果 x3";
            } else {
                setInventory(prev => ({...prev, balls: {...prev.balls, poke: prev.balls.poke + 3}}));
                rewardTitle = "发现遗失物"; rewardDesc = "获得 精灵球 x3";
            }
        } else if (rand < 0.7) {
            // 20% 药品
            const medKeys = Object.keys(MEDICINES);
            const medKey = _.sample(medKeys);
            const med = MEDICINES[medKey];
            setInventory(prev => ({...prev, meds: {...prev.meds, [medKey]: (prev.meds[medKey]||0) + 1}}));
            rewardTitle = "发现药品"; rewardDesc = `获得 ${med.icon} ${med.name}`;
        } else if (rand < 0.80) { 
            // 🔥 [新增] 10% 概率掉落经验糖果
            setInventory(prev => ({...prev, exp_candy: (prev.exp_candy||0) + 1}));
            rewardTitle = "甜蜜的惊喜"; rewardDesc = `获得 🍬 经验糖果 x1`;
        }  
        else if (rand < 0.9) { 
            // 10% 进化石
            const stoneKeys = Object.keys(EVO_STONES);
            const stoneKey = _.sample(stoneKeys);
            const stone = EVO_STONES[stoneKey];
            setInventory(prev => ({
                ...prev, 
                stones: { ...prev.stones, [stoneKey]: (prev.stones[stoneKey]||0) + 1 }
            }));
            rewardTitle = "神秘的石头"; rewardDesc = `获得 ${stone.icon} ${stone.name}`;
        } else if (rand < 0.93) {
            // 8% 特殊球
            const specialBalls = ['net', 'dusk', 'quick', 'timer', 'heal', 'ultra'];
            const ballKey = _.sample(specialBalls);
            const ball = BALLS[ballKey];
            setInventory(prev => ({...prev, balls: {...prev.balls, [ballKey]: prev.balls[ballKey] + 1}}));
            rewardTitle = "发现珍贵球"; rewardDesc = `获得 ${ball.icon} ${ball.name}`;
        } else if (rand < 0.98) {
            // 5% 技能书
            const tm = _.sample(TMS);
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: (prev.tms[tm.id]||0) + 1}}));
            rewardTitle = "古老的秘籍"; rewardDesc = `获得 📜 ${tm.name} (技能书)`;
        } else if (rand < 0.99) {
             // 1% 随机装备
             const baseEquip = _.sample(RANDOM_EQUIP_DB);
             const newEquip = createUniqueEquip(baseEquip.id);
             setAccessories(prev => [...prev, newEquip]);
             rewardTitle = "神秘宝藏"; rewardDesc = `获得 ${newEquip.icon} ${newEquip.displayName}`;
        } else {
            // 1% 洗练药
            setInventory(prev => ({...prev, misc: {...prev.misc, rebirth_pill: (prev.misc.rebirth_pill||0) + 1}}));
            rewardTitle = "传说宝藏"; rewardDesc = `获得 💊 洗练药`;
        }
        
        addGlobalLog(rewardDesc);
        setEventData({ type: 'LOOT', title: rewardTitle, desc: rewardDesc, reward: {} });
        setView('event');
        return;
      }

      // ------------------------------------------------
      // 7. 建筑交互 (道馆/中心/商店)
      // ------------------------------------------------
      // 道馆 (Tile 9)
      if (tileType === 9) {
        const mapInfo = MAPS.find(m => m.id === currentMapId);
        
        // 检查是否已通关
        if (badges.includes(mapInfo.badge)) { 
          alert("你已经战胜过这里的馆主了！"); 
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
          return; 
        }
        
        // 检查前置剧情任务是否完成
        const currentChapter = STORY_SCRIPT[storyProgress];
        if (currentChapter && currentChapter.mapId === currentMapId && currentChapter.tasks) {
            const unfinishedTask = currentChapter.tasks.find(t => t.step >= storyStep);
            if (unfinishedTask) {
                alert(`⛔ 无法进入道馆！\n\n必须先完成剧情任务：\n${currentChapter.objective}`);
                setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
                return;
            }
        }

        if (confirm(`前方是【${mapInfo.name}道馆】\n是否进入？`)) {
            startBattle(mapInfo, 'gym'); 
        } else {
            setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        }
        return;
      }

      // 宝可梦中心 (Tile 8)
      if (tileType === 8) {
        if (confirm("抵达宝可梦中心！\n要恢复所有伙伴的体力吗？")) {
          setParty(prev => prev.map(p => ({
              ...p, 
              currentHp: getStats(p).maxHp, 
              moves: p.moves.map(m=>({...m, pp: m.maxPP || 15})) 
          })));
          alert("队伍已完全恢复！");
        }
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
        return;
      }

      // 商店 (Tile 10)
      if (tileType === 10) {
        setShopMode(true);
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      // ------------------------------------------------
      // 8. 暗雷遇敌 (Tile 2, 5, 7)
      // ------------------------------------------------
      // 增加地图探索度
      setMapProgress(prev => ({ ...prev, [currentMapId]: Math.min(100, (prev[currentMapId]||0) + 1) }));
      
      const roll = Math.random();
      const mapInfo = MAPS.find(m => m.id === currentMapId);
      const progress = mapProgress[currentMapId] || 0;
      
      // 区域Boss (探索度满后概率触发)
      if (mapInfo.boss && progress >= 100 && roll < 0.05) { 
        startBattle(mapInfo, 'boss'); 
        return; 
      }

      // 草丛 (Tile 7) 遇敌率更高
      let encounterRate = 0.05; 
      if (tileType === 7) encounterRate = 0.25; 
      
      if (roll < 0.02) {
          // 训练家战斗
          setTimeout(() => startBattle(mapInfo, 'trainer'), 200); 
      } else if (roll < 0.02 + encounterRate) {
          // 野生精灵战斗
          setTimeout(() => startBattle(mapInfo, 'wild'), 200);
      }
    }
  }, [playerPos, mapGrid, currentMapId, mapProgress, badges, inventory, storyProgress, storyStep]);
  // 🎵 [核心修复] BGM 自动切换与播放逻辑
  useEffect(() => {
    if (!audioRef.current) return;

    let targetSrc = '';

    // 1. 根据当前视图决定播放哪首曲子
    if (view === 'menu' || view === 'name_input' || view === 'starter_select') {
      targetSrc = BGM_SOURCES.MENU;
    } 
    else if (view === 'battle') {
      if (battle && (battle.isBoss || battle.isGym || battle.isChallenge || battle.type === 'eclipse_leader')) {
        targetSrc = BGM_SOURCES.BOSS;
      } else {
        targetSrc = BGM_SOURCES.BATTLE;
      }
    } 
    else if (view === 'world_map' || view === 'grid_map' || view === 'sect_summit') {
      targetSrc = BGM_SOURCES.MAP;
    }

    // 2. 执行播放逻辑
    const audio = audioRef.current;

    // 如果目标曲目变了，或者当前虽然没变但处于暂停状态（且不是静音模式），则尝试播放
    if (targetSrc && (targetSrc !== currentTrack || (audio.paused && !isMuted))) {
      
      // 只有切歌时才重置 src，避免循环重置导致卡顿
      if (targetSrc !== currentTrack) {
          console.log("🎵 正在加载音乐:", targetSrc);
          setCurrentTrack(targetSrc);
          audio.src = targetSrc;
          audio.volume = 0.4;
          audio.load(); // 🔥 强制加载新链接
      }

      // 尝试播放 (必须在用户交互后才能成功)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("⚠️ 等待用户点击屏幕以开始播放...");
        });
      }
    }
  }, [view, battle, isMuted, currentTrack]); 
  // 🎵 [新增] 全局点击监听：一旦用户点击屏幕，立即恢复音频
  useEffect(() => {
    const enableAudio = () => {
      if (audioRef.current && audioRef.current.paused && currentTrack) {
        audioRef.current.play().catch(e => {});
      }
    };
    
    window.addEventListener('click', enableAudio);
    return () => window.removeEventListener('click', enableAudio);
  }, [currentTrack]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== 'grid_map' || shopMode || pcMode) return;
      const hasPending = party.some(p => p.pendingLearnMove);
      if (hasPending) {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','s','a','d'].includes(e.key)) {
           alert("🛑 无法移动！\n队伍中有伙伴需要处理新技能。\n请进入 [伙伴] 界面进行操作。");
           setView('team');
        }
        return;
      }
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': handleMove(0, -1); break;
        case 'ArrowDown': case 's': case 'S': handleMove(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': handleMove(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleMove, shopMode, pcMode, party]);

  const handleEventConfirm = () => {
    if (eventData.reward.gold) setGold(g => g + eventData.reward.gold);
    setEventData(null);
    setView('grid_map');
  };

    const enterDungeon = (dungeon) => {
    // 1. 狩猎地带逻辑 (保持不变)
    if (dungeon.id === 'safari_zone') {
      if (party[0].level < 100) {
        alert("⛔ 权限不足！\n狩猎地带仅对顶尖训练家开放。\n要求：首发精灵等级达到 Lv.100");
        return;
      }
      if (badges.length < 12) {
        alert(`⛔ 权限不足！\n你需要收集全部 12 枚徽章才能进入狩猎地带。\n当前进度: ${badges.length}/12`);
        return;
      }
      alert("🎉 欢迎来到狩猎地带！\n这里充满了传说中的神兽和稀有精灵！");
      startBattle({ id: 997, name: '狩猎地带', lvl: [90, 100], pool: [], drop: 1000 }, 'safari');
      return;
    }

    // 2. 基础等级检查
    if (party[0].level < dungeon.recLvl) {
      alert(`等级不足！建议等级: Lv.${dungeon.recLvl}`);
      return;
    }

    // --- 新增：特殊限制检查逻辑 ---

    // A. 元素之塔：等级限制 (Max Lv.50)
    if (dungeon.restriction === 'min_lvl_60') {
        const isOverLevel = party.some(p => p.level < 60);
        if (isOverLevel) {
            alert("⛔ 进入失败！\n规则限制：队伍中所有精灵等级不得超过 Lv.50。");
            return;
        }
    }

    // B. 英雄试炼：单挑限制 (Team Size = 1)
    if (dungeon.restriction === 'solo_run') {
        if (party.length > 1) {
            alert("⛔ 进入失败！\n规则限制：只能携带 1 只精灵进行英雄试炼。");
            return;
        }
    }

    // C. 豪宅金库：门票收费
    if (dungeon.restriction === 'entry_fee') {
        if (gold < 5000) {
            alert("⛔ 进入失败！\n你需要支付 5000 金币作为入场费。");
            return;
        }
        if (!confirm("💰 确定支付 5000 金币进入豪宅金库吗？\n(通关后可获得约 20000 金币回报)")) {
            return;
        }
        setGold(g => g - 5000); // 扣费
    }

    // D. 闪光山谷：性格限制 (首发必须是"幸运"类性格 - 这里用 'naive'/'hasty'/'quirky' 模拟)
    if (dungeon.restriction === 'lucky_nature') {
        // 假设 'naive'(天真), 'hasty'(急躁), 'quirky'(浮躁) 算作幸运性格
        const luckyNatures = ['naive', 'hasty', 'quirky', 'serious', 'hardy']; 
        const leaderNature = party[0].nature;
        if (!luckyNatures.includes(leaderNature)) {
            alert(`⛔ 进入失败！\n首发精灵必须是"幸运"性格之一：\n(天真/急躁/浮躁/严肃/努力)\n当前性格: ${NATURE_DB[leaderNature]?.name || '未知'}`);
            return;
        }
    }

    // 3. 触发战斗 (根据类型分发)
    if (dungeon.type === 'gold') {
      alert("进入黄金矿洞！这里全是喵喵！");
      startBattle({ id: 999, name: '黄金矿洞', lvl: [30, 40], pool: [52], drop: 2000 }, 'wild'); 
    } 
    else if (dungeon.type === 'exp') {
      alert("进入经验乐园！这里全是差不多娃娃！");
      startBattle({ id: 998, name: '经验乐园', lvl: [20, 50], pool: [113], drop: 100 }, 'wild'); 
    }
    // --- 新增副本的战斗触发 ---
    else if (dungeon.type === 'stone') {
        alert("进入元素之塔！\n这里的精灵守护着进化石。");
        // 敌人池：伊布家族 (126-130)
        startBattle({ id: 996, name: '元素之塔', lvl: [40, 50], pool: [126, 127, 128, 129, 130, 196, 197], drop: 500 }, 'dungeon_stone');
    }
    else if (dungeon.type === 'stat') {
        alert("进入英雄试炼！\n证明你的力量吧！");
        // 敌人池：格斗系/龙系强敌
        startBattle({ id: 995, name: '英雄试炼', lvl: [60, 65], pool: [63, 106, 138, 183, 214, 270], drop: 800 }, 'dungeon_stat');
    }
    else if (dungeon.type === 'gold_pro') {
        alert("进入豪宅金库！\n遍地都是金子！");
        // 敌人池：喵喵(118), 猫老大(119), 招财金猫(364)
        startBattle({ id: 994, name: '豪宅金库', lvl: [50, 60], pool: [118, 119, 364], drop: 15000 }, 'wild'); // drop 极高
    }
    else if (dungeon.type === 'shiny_hunt') {
        alert("进入闪光山谷！\n这里的空气闪烁着奇异的光芒...");
        // 敌人池：稀有精灵
        startBattle({ id: 993, name: '闪光山谷', lvl: [80, 90], pool: [147, 148, 151, 244, 299], drop: 1000 }, 'dungeon_shiny');
    }
      else if (dungeon.type === 'infinity') {
        enterInfinityCastle();
        return;
    }
  };

  // ==========================================
  // [新增] 播放闪光特效逻辑
  // ==========================================
  const triggerShinyAnim = async (targetSide, pet) => {
    if (!pet || !pet.isShiny) return;
    
    // 稍微延迟一点，等精灵图片出来后再闪
    await wait(300);
    
    setAnimEffect({ type: 'SHINY_ENTRY', target: targetSide });
    // 播放音效提示 (这里用 log 代替)
    // addLog(`✨ ${pet.name} 闪闪发光！`);
    
    await wait(1000); // 特效持续时间
    setAnimEffect(null);
  };
// ==========================================
// [修复版] 通用结算函数 (自动识别精灵/物品)
// ==========================================
const grantContestReward = (config, score, subjectPet = null) => {
    // 1. 找到符合条件的最高一档奖励
    const rewardTier = config.tiers.find(t => score >= t.min);
    
    if (!rewardTier) {
        alert("系统错误：无法计算奖励");
        setView('grid_map');
        setActiveContest(null);
        return;
    }

    // 2. 更新排行榜
    const typeKey = config.id.split('_')[1]; 
    const currentRecord = activityRecords[typeKey] || 0;
    let isNewRecord = false;
    
    if (score > currentRecord) {
        setActivityRecords(prev => ({ ...prev, [typeKey]: score }));
        isNewRecord = true;
    }

    // 3. 🔥 核心修复：智能判断奖励类型 🔥
    // 如果配置里写了 type='pet' 或者 ID 是数字，就当作精灵处理
    const isPetReward = rewardTier.type === 'pet' || typeof rewardTier.id === 'number';
    
    let rewardInfo = { name: '', icon: '', type: '' };

    // --- 分支 A: 奖励是精灵 ---
    if (isPetReward) {
        // 1. 创建精灵
        const rewardPet = createPet(rewardTier.id, rewardTier.level, true, rewardTier.shiny);
        rewardPet.name = rewardTier.name; 
        
        // 2. 应用保底个体值
        const guaranteedV = rewardTier.ivs || 0;
        if (guaranteedV > 0) {
            const statKeys = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
            const perfectStats = _.sampleSize(statKeys, guaranteedV);
            perfectStats.forEach(key => { rewardPet.ivs[key] = 31; });
        }
        
        // 3. 重新计算属性并回满血
        const stats = getStats(rewardPet);
        rewardPet.currentHp = stats.maxHp;

        // 4. 🔥 强制入队/入库逻辑 🔥
        // 使用函数式更新确保状态最新
        if (party.length < 6) {
            setParty(prev => [...prev, rewardPet]);
            console.log("奖励精灵已加入队伍:", rewardPet.name);
        } else {
            setBox(prev => [...prev, rewardPet]);
            console.log("奖励精灵已存入盒子:", rewardPet.name);
            // 延迟提示，避免被结算弹窗遮挡
            setTimeout(() => alert(`📦 队伍已满，奖励 [${rewardPet.name}] 已发送到电脑盒子！`), 500);
        }
        
        // 5. 开图鉴
        if (!caughtDex.includes(rewardPet.id)) {
            setCaughtDex(prev => [...prev, rewardPet.id]);
        }

        // 6. 设置弹窗显示信息
        rewardInfo = { name: rewardPet.name, icon: '🐾', type: 'PET', pet: rewardPet };
    } 
    // --- 分支 B: 奖励是物品 ---
    else {
        const count = rewardTier.count || 1;
        const itemId = rewardTier.id;
        
        // 1. 精灵球
        if (['net', 'poke', 'great', 'ultra', 'master', 'dusk', 'quick', 'timer', 'heal'].includes(itemId)) {
            setInventory(prev => ({
                ...prev, 
                balls: {...prev.balls, [itemId]: (prev.balls[itemId]||0) + count}
            }));
            const ball = BALLS[itemId];
            rewardInfo = { name: `${ball.name} x${count}`, icon: ball.icon, type: 'ITEM' };
        } 
        // 2. 进化石
        else if (itemId.includes('stone')) {
            setInventory(prev => ({
                ...prev, 
                stones: {...prev.stones, [itemId]: (prev.stones[itemId]||0) + count}
            }));
            const stone = EVO_STONES[itemId];
            rewardInfo = { name: `${stone.name} x${count}`, icon: stone.icon, type: 'ITEM' };
        } 
        // 3. 增强剂
        else if (itemId.startsWith('vit_')) {
            setInventory(prev => ({...prev, [itemId]: (prev[itemId]||0) + count}));
            const item = GROWTH_ITEMS.find(g => g.id === itemId);
            rewardInfo = { name: `${item.name} x${count}`, icon: item.emoji, type: 'ITEM' };
        } 
        // 4. 默认树果
        else {
            setInventory(prev => ({...prev, berries: prev.berries + count}));
            rewardInfo = { name: `树果 x${count}`, icon: '🍒', type: 'ITEM' };
        }
    }

    // 4. 设置结算弹窗数据
    setResultData({
        title: config.name,
        type: config.id,
        score: score,
        subjectPet: subjectPet,
        tierName: rewardTier.name,
        tierMsg: rewardTier.msg,
        reward: rewardInfo,
        rankIdx: config.tiers.indexOf(rewardTier),
        isNewRecord: isNewRecord
    });

    // 退出战斗状态
    setBattle(null); 
};

    // ==========================================
  // [核心修复] 启动战斗 (含特性触发与完整逻辑)
  // ==========================================
  const startBattle = (context, type, challengeId = null) => {
     setIsDialogVisible(false); 
    const isBoss = type === 'boss' || type === 'challenge' || type === 'story_mid' || type === 'story_task' || type === 'eclipse_leader';
    const isGym = type === 'gym';
    const isStory = type === 'story_mid' || type === 'story_task';
    const isTrainer = type === 'trainer' || isGym || isStory || type === 'league' || type === 'pvp' || type.startsWith('eclipse_');
    
    let enemyParty = [];
    let trainerName = null;
    let dropGold = context?.drop || 200;

    // -------------------------------------------------
    // 1. PvP 对战
    // -------------------------------------------------
    if (type === 'pvp') {
        enemyParty = context.customParty.map(p => {
            const safeId = Number(p.id);
            const baseInfo = POKEDEX.find(d => d.id === safeId) || {};
            const stats = getStats(p);
            const moves = p.moves || []; 
            return {
                ...p,
                id: safeId,
                name: p.name || baseInfo.name || '未知精灵',
                emoji: p.emoji || baseInfo.emoji || '❓',
                type: p.type || baseInfo.type || 'NORMAL',
                uid: Date.now() + Math.random(),
                currentHp: stats.maxHp,
                status: null,
                // 确保 PvP 导入的数据也有特性字段，如果没有则随机一个
                trait: p.trait || Object.keys(TRAIT_DB)[Math.floor(Math.random() * 20)],
                stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
                volatiles: { protected: false, confused: 0, sleepTurns: 0, badlyPoisoned: 0 },
                combatMoves: moves,
                maxHp: stats.maxHp
            };
        });
        trainerName = context.trainerName || "神秘挑战者";
        dropGold = 5000;
    } 
    // -------------------------------------------------
    // 2. 战斗联盟
    // -------------------------------------------------
    else if (type === 'league') {
        const roundNames = ['16强赛', '8强赛', '半决赛', '总决赛'];
        const currentRoundName = roundNames[leagueRound - 1] || '比赛';
        trainerName = `联盟选手 (${currentRoundName})`;
        dropGold = 5000 + (leagueRound * 2000);
        for(let i=0; i<6; i++) {
            const pool = i === 5 ? [...FINAL_GOD_IDS, ...NEW_GOD_IDS] : [...HIGH_TIER_POOL, ...LEGENDARY_POOL]; 
            const enemyId = _.sample(pool);
            const isShiny = leagueRound === 4; 
            enemyParty.push(createPet(enemyId, 100, true, isShiny));
        }
    }
    // -------------------------------------------------
    // 3. 挑战塔
    // -------------------------------------------------
    else if (type === 'challenge') {
      const challenge = CHALLENGES.find(c => c.id === challengeId);
      enemyParty.push(createPet(challenge.boss, challenge.bossLvl, true, true));
      const minionCount = (challenge.teamSize || 3) - 1; 
      for(let i=0; i<minionCount; i++) {
        const randomDex = _.random(1, 250); 
        const minionLvl = Math.max(5, challenge.bossLvl - _.random(2, 5));
        enemyParty.push(createPet(randomDex, minionLvl));
      }
      trainerName = `[挑战] ${challenge.title}`;
      dropGold = 2000;
    }
    // -------------------------------------------------
    // 4. 剧情中途 Boss
    // -------------------------------------------------
    else if (type === 'story_mid') {
       const currentChapter = STORY_SCRIPT[storyProgress];
       const enemyId = currentChapter.midEvent.enemyId;
       const mapInfo = MAPS.find(m => m.id === currentMapId);
       const lvl = (mapInfo?.lvl[0] || 5) + 5;
       enemyParty.push(createPet(enemyId, lvl, true)); 
       trainerName = currentChapter.midEvent.name;
       dropGold = 1000;
    }
    // -------------------------------------------------
    // 5. 剧情任务战斗 / 日蚀队杂兵
    // -------------------------------------------------
    else if (type === 'story_task' || type === 'eclipse_grunt') {
       const enemyId = context.pool[0]; 
       const mapInfo = MAPS.find(m => m.id === currentMapId);
       const lvl = context.lvl ? context.lvl[0] : ((mapInfo?.lvl[0] || 5) + 3);
       enemyParty.push(createPet(enemyId, lvl, true)); 
       trainerName = context.name;
       dropGold = context.drop || 500;
    }
    // -------------------------------------------------
    // 6. 日蚀队干部
    // -------------------------------------------------
    else if (type === 'eclipse_executive') {
       const lvl = context.lvl[0];
       for(let i=0; i<3; i++) {
           enemyParty.push(createPet(_.sample(context.pool), lvl, true));
       }
       trainerName = context.name;
       dropGold = 1500;
    }
    // -------------------------------------------------
    // 7. 日蚀队首领 (最终BOSS)
    // -------------------------------------------------
    else if (type === 'eclipse_leader') {
        trainerName = "日蚀队 首领·虚空";
        dropGold = 10000;
        enemyParty.push(createPet(94, 90)); // 耿鬼
        enemyParty.push(createPet(139, 91)); // 班基拉斯
        enemyParty.push(createPet(182, 91)); // 暴飞龙
        enemyParty.push(createPet(140, 92)); // 巨金怪
        enemyParty.push(createPet(216, 92)); // 三首恶龙
        const boss = createPet(341, 95, true, true); // 暗黑超梦
        boss.name = "暗黑超梦";
        boss.customBaseStats = { hp: 120, p_atk: 160, p_def: 100, s_atk: 160, s_def: 100, spd: 140, crit: 25 };
        enemyParty.push(boss);
    }
    // -------------------------------------------------
    // 8. 道馆战
    // -------------------------------------------------
    else if (isGym) {
      const mapIndex = MAPS.findIndex(m => m.id === context.id);
      const progressRatio = mapIndex / (MAPS.length - 1); 
      const minWild = context.lvl[0];
      const maxWild = context.lvl[1];
      const mapAvg = Math.ceil((minWild + maxWild) / 2);
      const startLvl = Math.floor(mapAvg + (maxWild - mapAvg) * progressRatio * 0.8);
      const aceBonus = Math.floor(mapIndex * 0.8); 
      const aceLvl = maxWild + aceBonus;

      for(let i=0; i < 5; i++) {
        const step = (aceLvl - startLvl) / 5; 
        const currentLvl = Math.floor(startLvl + step * i);
        enemyParty.push(createPet(_.sample(context.pool), currentLvl));
      }
      const leaderPet = createPet(context.gymLeader, aceLvl, true);
      enemyParty.push(leaderPet);
      trainerName = `馆主 ${context.name.slice(0,2)}`;
    }
    // -------------------------------------------------
    // 9. 普通训练家
    // -------------------------------------------------
    else if (type === 'trainer') {
      const count = _.random(2, 3);
      for(let i=0; i<count; i++) {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1])));
      }
      trainerName = _.sample(TRAINER_NAMES);
    }
    // -------------------------------------------------
    // 10. 狩猎地带
    // -------------------------------------------------
    else if (type === 'safari') {
      const safariRoll = Math.random();
      let enemyId;
      if (safariRoll < 0.5) {
          enemyId = _.sample(NEW_GOD_IDS);
          alert("⚠️ 感知到太古神兽的气息！");
      } else if (safariRoll < 0.8) {
          const oldLegends = LEGENDARY_POOL.filter(id => id < 254);
          enemyId = _.sample(oldLegends);
          alert("⚠️ 传说中的精灵出现了！");
      } else {
          enemyId = _.sample(HIGH_TIER_POOL);
      }
      enemyParty.push(createPet(enemyId, _.random(90, 100), true)); 
      dropGold = 5000;
    }
    // -------------------------------------------------
    // 11. 特殊副本 (进化石/属性/闪光)
    // -------------------------------------------------
    else if (type === 'dungeon_stone') {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1]), true));
        dropGold = 1000;
        trainerName = "元素守护者";
    } else if (type === 'dungeon_stat') {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1]), true));
        dropGold = 2000;
        trainerName = "试炼官";
    } else if (type === 'dungeon_shiny') {
        const enemyId = _.sample(context.pool);
        const isShiny = Math.random() < 0.5;
        enemyParty.push(createPet(enemyId, _.random(context.lvl[0], context.lvl[1]), false, isShiny));
        dropGold = 3000;
        trainerName = "稀有精灵";
    }
    // -------------------------------------------------
    // 12. 特殊事件 (碎岩/冲浪/神兽)
    // -------------------------------------------------
    else if (type === 'wild_god' || type === 'rock_special' || type === 'water_special') {
       let enemyId, level;
       if (type === 'wild_god') {
           enemyId = context.pool[0];
           level = _.random(context.lvl[0], context.lvl[1]);
           trainerName = "???";
       } else if (type === 'rock_special') {
           enemyId = _.sample(ROCK_POOL);
           level = _.random(20, 50);
           alert("🪨 岩石碎裂，有什么东西钻出来了！");
       } else {
           enemyId = _.sample(WATER_POOL);
           level = _.random(30, 60);
           alert("🌊 水面泛起涟漪，野生精灵出现了！");
       }
       enemyParty.push(createPet(enemyId, level, true));
       dropGold = 1000;
    }
    // -------------------------------------------------
    // 13. 无限城
    // -------------------------------------------------
    else if (type === 'infinity') {
        // 无限城逻辑已经在外部处理好 customParty
        enemyParty = context.customParty;
        trainerName = context.name;
        dropGold = 0;
    }
    // -------------------------------------------------
    // 14. 普通野怪 (兜底逻辑)
    // -------------------------------------------------
    else {
         if (!context || !context.lvl) {
             console.error("StartBattle Error: Invalid context for wild battle", context);
             alert("遭遇错误：无法生成野生精灵");
             return;
         }
         let enemyId;
         let level = _.random(context.lvl[0], context.lvl[1]);
         if (Math.random() < 0.02) {
            enemyId = _.sample(LEGENDARY_POOL);
            level = Math.max(level, 70); 
            dropGold = 5000;
            alert("⚠️ 传说中的神兽降临了！");
         } else {
            enemyId = _.sample(context.pool);
         }
         enemyParty.push(createPet(enemyId, level, isBoss));
    }

    // --- 统一后续处理 ---
    if (isTrainer || type === 'challenge') {
      enemyParty.forEach(p => p.name = `${p.name}`);
    }

    const activeIdx = party.findIndex(p => p.currentHp > 0);
    if (activeIdx === -1) { alert("全员战斗不能！"); setView('menu'); return; }

       // 初始化战斗状态的辅助函数
    const initBattleState = (p) => {
        const equipMoves = (p.equips || []).map(equip => {
            if (equip && typeof equip === 'object' && equip.extraSkill) {
                return { ...equip.extraSkill, isExtra: true };
            }
            return null;
        }).filter(Boolean);
        
        const combatMoves = [...p.moves, ...equipMoves].map(m => ({
            ...m,
            pp: Math.min(m.pp, m.maxPP || m.pp) 
        }));

        return {
            ...p,
            combatMoves,
            stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
            
            // ▼▼▼ [修复] 进战斗时，自动清除“混乱”状态 (因为它本应是临时的) ▼▼▼
            status: p.status === 'CON' ? null : p.status, 
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            
            volatiles: { protected: false, confused: 0, sleepTurns: 0, badlyPoisoned: 0 },
            turnCounters: { status: 0, stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 } }
        };
    };


    const battleEnemyParty = enemyParty.map(initBattleState);
    const battlePlayerParty = party.map(initBattleState); 

    // ▼▼▼ [新增] 预先计算威吓 (Intimidate) 效果 ▼▼▼
    // 直接修改初始数据，确保第一回合状态正确
    const applyIntimidate = (sourceUnit, targetUnit) => {
        if (sourceUnit.trait === 'intimidate') {
            // 降低1级物攻，最低-6
            targetUnit.stages.p_atk = Math.max(-6, -1);
        }
    };
    
    // 双方互相威吓
    applyIntimidate(battleEnemyParty[0], battlePlayerParty[activeIdx]);
    applyIntimidate(battlePlayerParty[activeIdx], battleEnemyParty[0]);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setBattle({
      enemyParty: battleEnemyParty,
      playerCombatStates: battlePlayerParty,
      enemyActiveIdx: 0, 
      activeIdx, 
      // 如果是 PvP，初始阶段设为 'input_p1'
      phase: type === 'pvp' ? 'input_p1' : 'input', 
      logs: [type === 'pvp' ? `PvP 对战开始！请 1P 选择行动` : (isTrainer ? `${trainerName} 发起了挑战!` : `遭遇 ${enemyParty[0].name}!`)],
      mapId: context?.id,
      drop: dropGold,
      isBoss,
      isTrainer,
      isGym,
      isStory,
      isChallenge: type === 'challenge',
      isPvP: type === 'pvp',
      challengeId,
      showSwitch: false,
      trainerName,
      pvpActions: { p1: null, p2: null },
      type: type // 记录战斗类型，方便结算判断
    });
    
    setShowBallMenu(false);
    setView('battle');
    
    // 异步播放动画和日志
    setTimeout(async () => {
        await triggerShinyAnim('enemy', enemyParty[0]);
        await triggerShinyAnim('player', party[activeIdx]);
        
        // 补充威吓的文本提示
        if (battleEnemyParty[0].trait === 'intimidate') {
            addLog(`${battleEnemyParty[0].name} 的 [威吓] 降低了你的攻击！`);
        }
        if (battlePlayerParty[activeIdx].trait === 'intimidate') {
            addLog(`${battlePlayerParty[activeIdx].name} 的 [威吓] 降低了对手的攻击！`);
        }
    }, 500);
  };


  // ==========================================
  // [新增] PvP 双人同屏控制逻辑
  // ==========================================

  // 1. 处理 PvP 输入 (缓存动作 -> 触发结算)
  const handlePvPInput = (playerNum, actionType, index) => {
      // actionType: 'move' (技能) | 'switch' (换人)
      
      setBattle(prev => {
          const newActions = { ...prev.pvpActions, [`p${playerNum}`]: { type: actionType, index } };
          
          // 如果是 1P 选完 -> 切到 2P 界面
          if (playerNum === 1) {
              return {
                  ...prev,
                  pvpActions: newActions,
                  phase: 'input_p2', // 切换阶段
                  logs: [`1P 已就绪，请 2P (对手) 选择行动...`, ...prev.logs]
              };
          }
          
          // 如果是 2P 选完 -> 进入结算阶段
          if (playerNum === 2) {
              // 延迟 100ms 触发结算，让 UI 先更新为“结算中”
              setTimeout(() => resolvePvPRound(newActions), 100);
              return {
                  ...prev,
                  pvpActions: newActions,
                  phase: 'busy', // 锁定界面
                  logs: [`双方已就绪，正在结算回合...`, ...prev.logs]
              };
          }
          return prev;
      });
  };

   // ==========================================
  // [修复版] PvP 核心逻辑 (解决状态不同步导致的诈尸Bug)
  // ==========================================

  // 2. 结算 PvP 回合 (速度判定 + 执行)
  const resolvePvPRound = async (actions) => {
      // 获取当前战斗状态的快照 (这是最新的数据源)
      let state = _.cloneDeep(battle); 
      
      const p1Index = state.activeIdx;
      const p2Index = state.enemyActiveIdx;
      const p1 = state.playerCombatStates[p1Index];
      const p2 = state.enemyParty[p2Index];

      const act1 = actions.p1;
      const act2 = actions.p2;

      // 辅助函数：执行单个动作
      const runAction = async (attacker, defender, action, source) => {
          if (attacker.currentHp <= 0) return false; 

          if (action.type === 'switch') {
              const newIdx = action.index;
              const newPet = source === 'player' ? party[newIdx] : state.enemyParty[newIdx];
              
              if (source === 'player') state.activeIdx = newIdx;
              else state.enemyActiveIdx = newIdx;
              
              // 同步更新 UI
              setBattle(prev => ({ 
                  ...prev, 
                  activeIdx: state.activeIdx, 
                  enemyActiveIdx: state.enemyActiveIdx 
              }));

              addLog(`${source==='player'?'我方':'对手'} 交换了 ${newPet.name}!`);
              await triggerShinyAnim(source, newPet);
              await wait(1000);
              return false;
          } 
          else if (action.type === 'move') {
              const move = attacker.combatMoves[action.index];
              return await performAction(attacker, defender, move, source, state);
          }
      };

      // --- 判定先后手 ---
      let first = 'p1';
      if (act1.type === 'switch' && act2.type !== 'switch') first = 'p1';
      else if (act2.type === 'switch' && act1.type !== 'switch') first = 'p2';
      else {
          const s1 = getStats(p1, p1.stages).spd;
          const s2 = getStats(p2, p2.stages).spd;
          if (s2 > s1) first = 'p2';
          else if (s1 === s2 && Math.random() < 0.5) first = 'p2';
      }

      const firstActor = first === 'p1' ? p1 : p2;
      const firstTarget = first === 'p1' ? p2 : p1;
      const firstAct = first === 'p1' ? act1 : act2;
      const firstSource = first === 'p1' ? 'player' : 'enemy';

      // 1. 执行第一行动
      setBattle(prev => ({ ...prev, ...state })); // 刷新UI
      const isFirstKill = await runAction(firstActor, firstTarget, firstAct, firstSource);
      
      // 2. 如果第一下打死了，直接进入死亡处理 (传入最新的 state!)
      if (isFirstKill) {
          await handlePvPDeath(firstTarget, firstSource === 'player' ? 'enemy' : 'player', state);
          return;
      }

      // 3. 执行第二行动
      const secondActor = first === 'p1' ? p2 : p1;
      const secondTarget = first === 'p1' ? p1 : p2;
      const secondAct = first === 'p1' ? act2 : act1;
      const secondSource = first === 'p1' ? 'enemy' : 'player';

      const isSecondKill = await runAction(secondActor, secondTarget, secondAct, secondSource);
      
      if (isSecondKill) {
          await handlePvPDeath(secondTarget, secondSource === 'player' ? 'enemy' : 'player', state);
          return;
      }

      await wait(500);
      
      // 回合结束，重置为 1P 输入
      setBattle(prev => ({ 
          ...prev, 
          phase: 'input_p1', 
          logs: [`回合结束，请 1P 选择行动`, ...prev.logs],
          pvpActions: { p1: null, p2: null }
      }));
  };

  // 3. 处理 PvP 死亡 (修复版：接收 latestState 参数)
  const handlePvPDeath = async (deadPet, deadSide, latestState) => {
      addLog(`${deadPet.name} 倒下了!`);
      await wait(1000);

      // 🔥 关键修复：使用 latestState 来检查存活状态，而不是旧的 battle state
      const team = deadSide === 'player' ? latestState.playerCombatStates : latestState.enemyParty;
      
      // 查找 HP > 0 的精灵 (这里读取的是刚刚扣过血的数据，所以不会诈尸)
      const nextIdx = team.findIndex(p => p.currentHp > 0);
      const hasAlive = nextIdx !== -1;

      if (!hasAlive) {
          // 游戏结束
          const winner = deadSide === 'player' ? '2P (对手)' : '1P (我方)';
          alert(`🏆 战斗结束！\n获胜者是：${winner}`);
          if (deadSide === 'enemy') {
              setGold(g => g + 5000);
              alert("获得获胜奖励：5000 金币");
          }
          setView('world_map');
          setBattle(null);
      } else {
          // 强制换人
          if (deadSide === 'player') {
              // 更新 battle 状态中的 activeIdx
              setBattle(prev => ({ 
                  ...prev, 
                  activeIdx: nextIdx, // 切换到下一个活着的
                  logs: [`我方派出了 ${team[nextIdx].name}!`, ...prev.logs],
                  phase: 'input_p1', 
                  pvpActions: { p1: null, p2: null } 
              }));
              await triggerShinyAnim('player', team[nextIdx]);
          } else {
              setBattle(prev => ({ 
                  ...prev, 
                  enemyActiveIdx: nextIdx, // 切换对手
                  logs: [`对手派出了 ${team[nextIdx].name}!`, ...prev.logs],
                  phase: 'input_p1', 
                  pvpActions: { p1: null, p2: null } 
              }));
              await triggerShinyAnim('enemy', team[nextIdx]);
          }
      }
  };


   // ==========================================
  // [修复版] 切换精灵 (含特性触发)
  // ==========================================
  const switchPokemon = async (newIdx) => {
    if (newIdx === battle.activeIdx) return;
    
    const currentPet = party[battle.activeIdx];
    const isForcedSwitch = currentPet.currentHp <= 0;

    if (party[newIdx].currentHp <= 0) { 
        alert("该精灵已失去战斗能力！"); 
        return; 
    }

    // ▼▼▼ [新增] 再生力 (Regenerator) ▼▼▼
    // 下场时恢复 1/3 血量
    if (currentPet.trait === 'regenerator' && !isForcedSwitch) {
        const max = getStats(currentPet).maxHp;
        const heal = Math.floor(max / 3);
        currentPet.currentHp = Math.min(max, currentPet.currentHp + heal);
        addLog(`${currentPet.name} 的 [再生力] 恢复了体力！`);
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const newPet = party[newIdx];

    const nextBattleState = {
        ...battle,
        activeIdx: newIdx,
        showSwitch: false,
        phase: 'anim',
        logs: [`去吧 ${newPet.name}!`, ...battle.logs]
    };

    setBattle(nextBattleState);

    await wait(500); 
    await triggerShinyAnim('player', newPet);

    // ▼▼▼ [新增] 触发新上场精灵的特性 (威吓) ▼▼▼
    const me = nextBattleState.playerCombatStates[newIdx];
    const opp = nextBattleState.enemyParty[nextBattleState.enemyActiveIdx];
    if (me.trait === 'intimidate' && opp.currentHp > 0) {
        opp.stages.p_atk = Math.max(-6, (opp.stages.p_atk||0) - 1);
        addLog(`${me.name} 的 [威吓] 降低了对手的攻击！`);
        setAnimEffect({ type: 'DEBUFF', target: 'enemy' });
        await wait(800); setAnimEffect(null);
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    if (isForcedSwitch) {
        setBattle(prev => ({ ...prev, phase: 'input' }));
    } else {
        await enemyTurn(nextBattleState);
    }
  };

    // ==========================================
  // [修复版] 玩家回合 (修复升级UI不刷新)
  // ==========================================
  const executeTurn = async (moveIdx) => {
  if (battle.phase !== 'input') return;
    setBattle(prev => ({ ...prev, phase: 'busy' }));

    try {
        // 这是一个深拷贝，PP 是在这里扣除的
        let tempBattle = _.cloneDeep(battle); 
       const tempPlayerState = tempBattle.playerCombatStates[battle.activeIdx];
        if (tempPlayerState.combatMoves[moveIdx].pp <= 0) {
             alert("PP不足！");
             setBattle(prev => ({ ...prev, phase: 'input' }));
             return;
        }
        
        const move = tempPlayerState.combatMoves[moveIdx];
        const player = tempPlayerState;
        const enemy = tempBattle.enemyParty[battle.enemyActiveIdx];

        // 2. 执行玩家行动 (PP 扣除移入 performAction)
        const enemyDied = await performAction(player, enemy, move, 'player', tempBattle);

        setBattle(prev => ({
            ...prev,
            playerCombatStates: tempBattle.playerCombatStates,
            enemyParty: tempBattle.enemyParty,
        }));

        // 3. 敌人行动或结算
        if (!enemyDied) {
            if (move.effect?.type !== 'PROTECT') {
                tempBattle.playerCombatStates[tempBattle.activeIdx].volatiles.protected = false;
            }
            
            await wait(1000); 
            await enemyTurn(tempBattle);
        } else {
            // 敌人死亡结算
            await wait(500);
            const { newParty, logMsg, activeDidLevelUp } = processDefeatedEnemy(enemy, party, tempBattle);
            
            // 更新全局队伍
            setParty(newParty); 
             addLog(logMsg);
            
            // 🔥🔥🔥 [核心修复] 立即同步战斗状态，并重新生成 combatMoves 🔥🔥🔥
            setBattle(prev => {
                const updatedCombatStates = prev.playerCombatStates.map((cs, i) => {
                    const updatedPet = newParty[i];
                    
                    // 1. 重新获取装备带来的技能
                    const equipMoves = (updatedPet.equips || []).map(equip => {
                        if (equip && typeof equip === 'object' && equip.extraSkill) {
                            return { ...equip.extraSkill, isExtra: true };
                        }
                        return null;
                    }).filter(Boolean);

                    // 2. 重新组合战斗技能列表 (新学会的技能在 updatedPet.moves 里)
                    const newCombatMoves = [...updatedPet.moves, ...equipMoves];

                    return {
                        ...cs,
                        level: updatedPet.level,
                        currentHp: updatedPet.currentHp, 
                        exp: updatedPet.exp,
                        nextExp: updatedPet.nextExp,
                        moves: updatedPet.moves, // 更新基础技能数据
                        combatMoves: newCombatMoves, // <--- 关键：更新UI渲染用的技能列表
                        ...updatedPet 
                    };
                });
                return {
                    ...prev,
                    playerCombatStates: updatedCombatStates
                };
            });
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            if (activeDidLevelUp) {
                setAnimEffect({ type: 'LEVEL_UP', target: 'player' });
                await wait(1200); setAnimEffect(null);
            }

            const nextEnemyIdx = battle.enemyParty.findIndex((p, i) => i > battle.enemyActiveIdx && p.currentHp > 0);
            if (nextEnemyIdx !== -1) {
                setBattle(prev => ({
                    ...prev, enemyActiveIdx: nextEnemyIdx, phase: 'anim', 
                    logs: [`对手派出了 ${prev.enemyParty[nextEnemyIdx].name}!`, ...prev.logs]
                }));
                await triggerShinyAnim('enemy', battle.enemyParty[nextEnemyIdx]);
                await wait(1000);
                setBattle(prev => ({ ...prev, phase: 'input' })); 
            } else {
                await wait(1000);
                handleWin(newParty);
            }
        }

    } catch (e) {
        console.error("Battle Error:", e);
        setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };


    // ==========================================
  // [修改] 敌人回合 (含被动特性与天气结算)
  // ==========================================
  const enemyTurn = async (currentBattleState = null) => {
    await wait(500);

    const state = currentBattleState || battle;
    const player = state.playerCombatStates[state.activeIdx];
    const enemy = state.enemyParty[state.enemyActiveIdx];

    if (enemy.currentHp <= 0) return;

    const movesWithPP = enemy.moves.filter(m => m.pp > 0);
    const smartMoves = movesWithPP.filter(m => {
        if (m.p > 0) return true;
        if (m.effect) {
            if (m.effect.type === 'STATUS' && player.status) return false;
            if (m.effect.type === 'DEBUFF') {
                const currentStage = player.stages[m.effect.stat] || 0;
                if (currentStage <= -6) return false;
            }
            if (m.effect.type === 'BUFF') {
                const currentStage = enemy.stages[m.effect.stat] || 0;
                if (currentStage >= 6) return false;
            }
        }
        return true;
    });

    let enemyMove;
    if (smartMoves.length > 0) {
        enemyMove = _.sample(smartMoves);
    } else if (movesWithPP.length > 0) {
        enemyMove = _.sample(movesWithPP); 
    } else {
        enemyMove = { name: '挣扎', p: 20, t: 'NORMAL' }; 
    }
    
    let playerDied = await performAction(enemy, player, enemyMove, 'enemy', state);

    // ▼▼▼ [新增] 回合结束特性结算 (加速) ▼▼▼
    const processPassive = async (unit, side) => {
        if (unit.currentHp <= 0) return;
        if (unit.trait === 'speed_boost') {
            const oldSpd = unit.stages.spd || 0;
            if (oldSpd < 6) {
                unit.stages.spd = oldSpd + 1;
                addLog(`${unit.name} 的 [加速] 提升了速度！`);
                setAnimEffect({ type: 'BUFF', target: side });
                await wait(600);
                setAnimEffect(null);
            }
        }
    };
    await processPassive(player, 'player');
    await processPassive(enemy, 'enemy');

    // ▼▼▼ [新增] 天气回合伤害 (沙暴/冰雹) ▼▼▼
    const applyWeatherDmg = (unit) => {
        if (unit.currentHp <= 0) return;
        let weatherDmg = 0;
        const maxHp = getStats(unit).maxHp;

        if (weather === 'SAND' && !['ROCK','GROUND','STEEL'].includes(unit.type)) {
            weatherDmg = Math.floor(maxHp / 16);
            addLog(`${unit.name} 受到沙暴伤害！`);
        }
        if (weather === 'SNOW' && unit.type !== 'ICE') {
            weatherDmg = Math.floor(maxHp / 16);
            addLog(`${unit.name} 受到冰雹伤害！`);
        }

        if (weatherDmg > 0) {
            unit.currentHp = Math.max(0, unit.currentHp - weatherDmg);
            if (unit.currentHp <= 0) playerDied = true; // 如果是玩家死了
        }
    };

    // 对双方执行天气伤害
    applyWeatherDmg(player);
    applyWeatherDmg(enemy);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    if (playerDied || player.currentHp <= 0) {
       await wait(500);
       const hasAlive = state.playerCombatStates.some(p => p.currentHp > 0);
       if (hasAlive) {
         setBattle(prev => ({ ...prev, showSwitch: true, phase: 'anim', logs: [`${player.name} 倒下了!`, ...prev.logs] }));
       } else {
         handleDefeat();
       }
    } else {
      state.enemyParty[state.enemyActiveIdx].volatiles.protected = false;
      setBattle(prev => ({ 
          ...prev, 
          playerCombatStates: state.playerCombatStates.map(p => ({...p})), 
          enemyParty: state.enemyParty.map(e => ({...e})), 
          phase: 'input' 
      }));
    }
  };


  // ==========================================
  // [新增] 属性克制计算 (温和版)
  // 强效: 1.5倍 (原2.0) | 微弱: 0.8倍 (原0.5)
  // ==========================================
  const getTypeMod = (moveType, targetType) => {
    // 简化的克制逻辑表 (你可以根据需要完善)
    const chart = {
      FIRE:    { weak: ['WATER', 'ROCK', 'GROUND'], strong: ['GRASS', 'ICE', 'BUG', 'STEEL'] },
      WATER:   { weak: ['GRASS', 'ELECTRIC'], strong: ['FIRE', 'GROUND', 'ROCK'] },
      GRASS:   { weak: ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'], strong: ['WATER', 'GROUND', 'ROCK'] },
      ELECTRIC:{ weak: ['GROUND'], strong: ['WATER', 'FLYING'] },
      ICE:     { weak: ['FIRE', 'FIGHT', 'ROCK', 'STEEL'], strong: ['GRASS', 'GROUND', 'FLYING', 'DRAGON'] },
      FIGHT:   { weak: ['FLYING', 'PSYCHIC', 'FAIRY'], strong: ['NORMAL', 'ICE', 'ROCK', 'STEEL'] },
      GROUND:  { weak: ['WATER', 'GRASS', 'ICE'], strong: ['FIRE', 'ELECTRIC', 'POISON', 'ROCK', 'STEEL'] },
      FLYING:  { weak: ['ELECTRIC', 'ICE', 'ROCK'], strong: ['GRASS', 'FIGHT', 'BUG'] },
      PSYCHIC: { weak: ['BUG', 'GHOST'], strong: ['FIGHT', 'POISON'] },
      ROCK:    { weak: ['WATER', 'GRASS', 'FIGHT', 'GROUND', 'STEEL'], strong: ['FIRE', 'ICE', 'FLYING', 'BUG'] },
      GHOST:   { weak: ['GHOST'], strong: ['PSYCHIC', 'GHOST'] },
      DRAGON:  { weak: ['ICE', 'DRAGON', 'FAIRY'], strong: ['DRAGON'] },
      STEEL:   { weak: ['FIRE', 'FIGHT', 'GROUND'], strong: ['ICE', 'ROCK', 'FAIRY'] },
      FAIRY:   { weak: ['POISON', 'STEEL'], strong: ['FIGHT', 'DRAGON'] },
      // ... 其他属性默认 1.0
    };

    const info = chart[moveType];
    if (!info) return 1.0;

    if (info.strong && info.strong.includes(targetType)) return 1.5; // 克制倍率降低
    if (info.weak && info.weak.includes(targetType)) return 0.8;     // 抵抗倍率提升
    return 1.0;
  };
  // ==========================================
  // [新增] 检查效果过期逻辑
  // 规则：所有效果从第2回合开始，每回合有40%概率消失
  // ==========================================
  const checkEffectExpiration = (unit, state) => {
    const logs = [];

    // 1. 检查能力等级 (Buff/Debuff)
    Object.keys(state.stages).forEach(stat => {
      if (state.stages[stat] !== 0) {
        // 增加回合计数
        state.turnCounters.stages[stat] = (state.turnCounters.stages[stat] || 0) + 1;
        
        // 判定：回合>=2 且 随机数 < 0.4
        if (state.turnCounters.stages[stat] >= 2 && Math.random() < 0.4) {
           state.stages[stat] = 0; // 清除效果
           state.turnCounters.stages[stat] = 0; // 重置计数
           
           // 转换属性名为中文，方便显示日志
           const statNames = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', acc:'命中', eva:'闪避', crit:'暴击' };
           logs.push(`${unit.name} 的 [${statNames[stat]}] 恢复了正常!`);
        }
      } else {
        // 如果当前没有等级变化，确保计数器归零
        state.turnCounters.stages[stat] = 0;
      }
    });

    // 2. 检查异常状态 (Status)
    if (state.status) {
       state.turnCounters.status = (state.turnCounters.status || 0) + 1;
       
       if (state.turnCounters.status >= 2 && Math.random() < 0.4) {
          const statusNames = { PAR:'麻痹', BRN:'灼伤', PSN:'中毒', SLP:'睡眠', FRZ:'冰冻', CON:'混乱' };
          const sName = statusNames[state.status] || '异常';
          
          state.status = null; // 清除状态
          state.turnCounters.status = 0;
          logs.push(`${unit.name} 的 [${sName}] 状态消失了!`);
       }
    } else {
       state.turnCounters.status = 0;
    }

    return logs;
  };

     // ==========================================
  // [核心修复] 战斗行动逻辑 (含特性/亲密度/天气/时间判定)
  // ==========================================
  const performAction = async (attacker, defender, move, source, battleState) => {
    setBattle(prev => ({ ...prev, phase: 'anim' }));

    const atkIdx = source === 'player' ? battleState.activeIdx : battleState.enemyActiveIdx;
    const defIdx = source === 'player' ? battleState.enemyActiveIdx : battleState.activeIdx;
    
    const atkState = source === 'player' ? battleState.playerCombatStates[atkIdx] : battleState.enemyParty[atkIdx];
    const defState = source === 'player' ? battleState.enemyParty[defIdx] : battleState.playerCombatStates[defIdx];

    // 1. 异常状态判定
    if (atkState.status === 'SLP') {
        atkState.volatiles.sleepTurns--;
        if (atkState.volatiles.sleepTurns > 0) {
            addLog(`${attacker.name} 正在熟睡...`);
            setAnimEffect({ type: 'SLEEP', target: source === 'player' ? 'player' : 'enemy' }); 
            await wait(800); setAnimEffect(null);
            return false; 
        } else {
            atkState.status = null;
            addLog(`${attacker.name} 醒过来了!`);
        }
    }
    if (atkState.status === 'FRZ') {
        if (Math.random() < 0.8) {
            addLog(`${attacker.name} 被冻结了，无法动弹!`);
            setAnimEffect({ type: 'FREEZE', target: source === 'player' ? 'player' : 'enemy' }); 
            await wait(800); setAnimEffect(null);
            return false; 
        } else {
            atkState.status = null;
            addLog(`${attacker.name} 的冰融化了!`);
        }
    }
    if (atkState.status === 'PAR' && Math.random() < 0.25) {
        addLog(`${attacker.name} 身体麻痹，无法行动!`);
        setAnimEffect({ type: 'PARALYSIS', target: source === 'player' ? 'player' : 'enemy' }); 
        await wait(800); setAnimEffect(null);
        return false; 
    }
    if (atkState.status === 'CON') {
        addLog(`${attacker.name} 混乱了!`);
        setAnimEffect({ type: 'CONFUSION', target: source === 'player' ? 'player' : 'enemy' }); 
        await wait(500); setAnimEffect(null);
        if (Math.random() < 0.33) {
            addLog(`它攻击了自己!`);
            const selfDmg = Math.floor(getStats(attacker).maxHp * 0.15);
            attacker.currentHp = Math.max(0, attacker.currentHp - selfDmg);
        }
    }

    // 扣除 PP (含压迫感特性)
    if (move.pp > 0) {
        let ppCost = 1;
        if (defState.trait === 'pressure') ppCost = 2; 
        move.pp = Math.max(0, move.pp - ppCost);
    }

    // 2. 技能施放与命中
    addLog(`${attacker.name} 使用 ${move.name}`);
    await wait(600); // 🔥 [新增] 增加等待，让玩家看清使用了什么技能

    // 守住逻辑 (移到显示技能名之后)
    const isAttackOrDebuff = move.p > 0 || (move.effect && move.effect.target !== 'self');
    if (defState.volatiles.protected && isAttackOrDebuff) {
        addLog(`✋ ${defender.name} 守住了攻击!`); 
        setAnimEffect({ type: 'PROTECT', target: source === 'player' ? 'enemy' : 'player' }); 
        await wait(800); 
        setAnimEffect(null);
        return false;
    }
    
    const accStage = atkState.stages.acc || 0;
    const evaStage = defState.stages.eva || 0;
    const stage = Math.max(-6, Math.min(6, accStage - evaStage));
    const accMult = stage >= 0 ? (3 + stage) / 3 : 3 / (3 + Math.abs(stage));
    const moveAcc = move.acc || 100;
    const finalHitChance = moveAcc * accMult;

    if (move.p > 0 && Math.random() * 100 > finalHitChance) {
        addLog(`但是没有命中!`);
        await wait(500);
        return false;
    }

    setAnimEffect({ type: move.t, source: source, target: source === 'player' ? 'enemy' : 'player' });
    await wait(600); 
    setAnimEffect(null);

    // 3. 伤害/效果结算
    let dmg = 0;
    let isDead = false;

    if (move.p === 0 && move.effect) {
        // === 变化类技能 ===
        const eff = move.effect;
        const targetState = eff.target === 'self' ? atkState : defState;
        const targetName = eff.target === 'self' ? attacker.name : defender.name;
        const targetSide = eff.target === 'self' ? (source==='player'?'player':'enemy') : (source==='player'?'enemy':'player');

        if (eff.type === 'BUFF' || eff.type === 'DEBUFF') {
            const delta = eff.type === 'BUFF' ? eff.val : -eff.val;
            const statName = eff.stat;
            targetState.stages[statName] = Math.max(-6, Math.min(6, (targetState.stages[statName] || 0) + delta));
            if(eff.stat2) targetState.stages[eff.stat2] = Math.max(-6, Math.min(6, (targetState.stages[eff.stat2] || 0) + delta));
            
            const statNames = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', acc:'命中', eva:'闪避', crit:'暴击' };
            const sName = statNames[statName] || statName;
            const action = delta > 0 ? '提升' : '下降';
            const degree = Math.abs(delta) > 1 ? '大幅' : '';
            
            addLog(`${targetName} 的 [${sName}] ${degree}${action}了!`);
            setAnimEffect({ type: eff.type, target: targetSide }); 
        } 
        else if (eff.type === 'STATUS') {
            if (targetState.status) {
                addLog(`但是 ${targetName} 已经有异常状态了!`);
            } else if (Math.random() < (eff.chance || 1.0)) {
                targetState.status = eff.status;
                if (eff.status === 'SLP') targetState.volatiles.sleepTurns = _.random(2, 4);
                addLog(`${targetName} 陷入了异常状态!`);
                setAnimEffect({ type: eff.status, target: targetSide }); 
            } else {
                addLog(`但是失败了!`);
            }
        }
         else if (eff.type === 'PROTECT') {
            // 守住是给自己加状态
            // targetState 在前面已经根据 eff.target 计算好了
            // 如果 eff.target 未定义，默认通常是 self (对于守住来说)
            
            // 强制修正：守住的目标永远是自己
            const actualTargetState = atkState; 
            const actualTargetName = attacker.name;
            const actualTargetSide = source === 'player' ? 'player' : 'enemy';

            actualTargetState.volatiles.protected = true;
            addLog(`${actualTargetName} 摆出了防御架势!`);
            setAnimEffect({ type: 'PROTECT', target: actualTargetSide });
        }
        else if (eff.type === 'HEAL') {
            const cap = Math.min(0.5, eff.val || 0.5); 
            const healAmount = Math.floor(getStats(attacker).maxHp * cap);
            attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + healAmount);
            addLog(`${attacker.name} 恢复了体力!`);
            setAnimEffect({ type: 'HEAL', target: targetSide });
        }
        else if (eff.type === 'RESET') {
             atkState.stages = { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 };
             defState.stages = { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 };
             addLog(`全场的能力变化被重置了!`);
        }
        await wait(500); setAnimEffect(null);
    } else {
        // === 伤害类技能 ===
        const statsAtk = getStats(attacker, atkState.stages, atkState.status); 
        const statsDef = getStats(defender, defState.stages, defState.status);
        const category = getMoveCategory(move.t);
        let atkVal = category === 'physical' ? statsAtk.p_atk : statsAtk.s_atk;
        let defVal = category === 'physical' ? statsDef.p_def : statsDef.s_def;

        let isCrit = false;
        let critStage = (atkState.stages.crit || 0) + (move.name === '劈开' ? 1 : 0); 
        if (Math.random() * 100 < (statsAtk.crit * (1 + critStage * 0.5))) isCrit = true;

        let typeMod = getTypeMod(move.t, defender.type);
        const levelBase = attacker.level * 0.8 + 5;
        const powerFactor = move.p * 0.5 + 10;
        const ratio = atkVal / Math.max(1, defVal);
        const statFactor = Math.pow(ratio, 0.65);

        let rawDmg = (levelBase + powerFactor) * statFactor;
        if (isCrit) rawDmg *= 1.5;
        rawDmg *= typeMod;
        rawDmg *= (0.9 + Math.random() * 0.2); 

        // ▼▼▼ [新增] 天气/时间 伤害修正 ▼▼▼
        if (weather === 'RAIN') {
            if (move.t === 'WATER') { rawDmg *= 1.5; addLog('🌧️ 雨天增强了水系威力！'); }
            if (move.t === 'FIRE') { rawDmg *= 0.5; }
        }
        if (weather === 'SUN') {
            if (move.t === 'FIRE') { rawDmg *= 1.5; addLog('☀️ 烈日增强了火系威力！'); }
            if (move.t === 'WATER') { rawDmg *= 0.5; }
        }
        if (weather === 'SAND' && ['ROCK','GROUND','STEEL'].includes(attacker.type)) {
             // 沙暴下岩地钢系特防加成，这里简化为伤害减免
             if (category === 'special') rawDmg *= 0.8; 
        }
        if (weather === 'SNOW' && attacker.type === 'ICE') {
             // 冰雹下冰系防御加成
             if (category === 'physical') rawDmg *= 0.8;
        }
        if (timePhase === 'NIGHT' && (move.t === 'GHOST' || move.t === 'DARK')) {
            rawDmg *= 1.2; // 夜晚幽灵/恶系增强
        }
        if (timePhase === 'DAY' && (move.t === 'GRASS' || move.t === 'FIRE')) {
            rawDmg *= 1.1; // 白天草/火系微增
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 特性修正
        if (['overgrow','blaze','torrent','swarm'].includes(attacker.trait)) {
            const typeMap = { overgrow:'GRASS', blaze:'FIRE', torrent:'WATER', swarm:'BUG' };
            if (move.t === typeMap[attacker.trait] && attacker.currentHp < getStats(attacker).maxHp / 3) {
                rawDmg *= 1.5;
                addLog(`${attacker.name} 的特性发动了！`);
            }
        }
        if (attacker.trait === 'technician' && move.p <= 60) rawDmg *= 1.5;
        if (attacker.trait === 'adaptability' && (attacker.type === move.t || attacker.secondaryType === move.t)) {
            rawDmg *= 1.33;
        }
        if (isCrit && attacker.trait === 'sniper') rawDmg *= 1.5; 

        if (defender.trait === 'levitate' && move.t === 'GROUND') {
            rawDmg = 0; addLog(`${defender.name} 漂浮在空中，免疫了攻击！`);
        }
        if (defender.trait === 'flash_fire' && move.t === 'FIRE') {
            rawDmg = 0; addLog(`${defender.name} 吸收了火焰！`);
        }
        if (defender.trait === 'multiscale' && defender.currentHp === statsDef.maxHp) {
            rawDmg *= 0.5;
        }

        // 门派修正
        const atkSect = attacker.sectId || 1;
        const atkSectLv = attacker.sectLevel || 1;
        const defSect = defender.sectId || 1;
        const defSectLv = defender.sectLevel || 1;

        if (atkSect === 1) rawDmg *= (1 + (0.03 + atkSectLv * 0.02)); 
        if (defSect === 2) rawDmg *= (1 - (0.03 + defSectLv * 0.02));
        if (defSect === 3) {
            const dodgeChance = 0.02 + defSectLv * 0.01;
            if (Math.random() < dodgeChance) {
                rawDmg = 0; addLog(`💨 ${defender.name} 施展凌波微步，闪避了攻击！`);
            }
        }
        if (atkSect === 4 && isCrit) rawDmg *= (1 + (0.1 + atkSectLv * 0.05));
        if (atkSect === 10) rawDmg *= (1 + (0.05 + atkSectLv * 0.02));

        dmg = Math.floor(rawDmg);
        dmg = Math.max(1, dmg); 

        let msg = `造成 ${dmg} 伤害`;
        if (isCrit) msg += ` (暴击!)`;
        if (typeMod > 1.2) msg += ` 效果拔群!`;
        if (typeMod < 0.9) msg += ` 收效甚微...`;
        addLog(msg);

        // 结实 & 亲密度保命
        let survivalMsg = null;
        if (defender.trait === 'sturdy' && defender.currentHp === statsDef.maxHp && dmg >= defender.currentHp) {
            dmg = defender.currentHp - 1;
            survivalMsg = `${defender.name} 的结实特性撑住了！`;
        }
        else if (defender.intimacy >= 200 && dmg >= defender.currentHp && Math.random() < 0.15) {
            dmg = defender.currentHp - 1;
            survivalMsg = `${defender.name} 为了不让你伤心，撑住了攻击！`;
        }

        defender.currentHp = Math.max(0, defender.currentHp - dmg);
        if (survivalMsg) addLog(survivalMsg);
        isDead = defender.currentHp <= 0;

        // 反伤与状态触发
        if (defSect === 9 && category === 'physical' && move.p > 0 && dmg > 0) {
            const reflectPct = 0.05 + defSectLv * 0.03;
            const reflectDmg = Math.floor(dmg * reflectPct);
            if (reflectDmg > 0) {
                attacker.currentHp = Math.max(0, attacker.currentHp - reflectDmg);
                addLog(`🥊 打狗棒法反弹了 ${reflectDmg} 点伤害！`);
            }
        }
        if (atkSect === 6 && !defender.status && move.p > 0 && Math.random() < (0.05 + atkSectLv * 0.02)) {
            defender.status = 'BRN'; addLog(`🔥 圣火令触发，${defender.name} 灼伤了！`);
        }
        if (defSect === 7 && !attacker.status && move.p > 0 && Math.random() < (0.03 + defSectLv * 0.01)) {
            attacker.status = 'FRZ'; addLog(`❄️ 寒冰劲护体，${attacker.name} 被冻结了！`);
        }
        if (atkSect === 8 && !defender.status && move.p > 0 && Math.random() < (0.05 + atkSectLv * 0.02)) {
            defender.status = 'PSN'; addLog(`☠️ 千蛛手触发，${defender.name} 中毒了！`);
        }
        if (atkSect === 5 && attacker.currentHp > 0) {
            const heal = Math.floor(getStats(attacker).maxHp * (0.02 + atkSectLv * 0.01));
            attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
        }

        if (category === 'physical' && !isDead) {
            if (defender.trait === 'static' && Math.random() < 0.3 && !attacker.status) {
                attacker.status = 'PAR'; addLog(`${attacker.name} 触碰到静电，麻痹了！`);
            }
            if (defender.trait === 'cute_charm' && Math.random() < 0.3 && !attacker.status) {
                attacker.status = 'CON'; addLog(`${attacker.name} 被 ${defender.name} 迷住了！`);
            }
        }

        if (!isDead && move.effect && move.p > 0) {
             const eff = move.effect;
             if (Math.random() < (eff.chance || 1.0)) {
                 const targetState = eff.target === 'self' ? atkState : defState;
                 const targetName = eff.target === 'self' ? attacker.name : defender.name;
                 const targetSide = eff.target === 'self' ? (source==='player'?'player':'enemy') : (source==='player'?'enemy':'player');
                 
                 if (eff.type === 'BUFF' || eff.type === 'DEBUFF') {
                     const delta = eff.type === 'BUFF' ? eff.val : -eff.val;
                     const statName = eff.stat;
                     targetState.stages[statName] = Math.max(-6, Math.min(6, (targetState.stages[statName] || 0) + delta));
                     addLog(`追加效果: ${targetName} 的能力变化了!`);
                     setAnimEffect({ type: eff.type, target: targetSide });
                 } else if (eff.type === 'STATUS' && !targetState.status) {
                     targetState.status = eff.status;
                     addLog(`追加效果: ${targetName} 陷入了异常状态!`);
                     setAnimEffect({ type: eff.status, target: targetSide });
                 }
                 await wait(400); setAnimEffect(null);
             }
        }
    }

    // 4. 回合结束结算 (灼伤/中毒)
    if (!isDead && source === 'enemy') { 
        const applyDot = (unit, state) => {
            if (unit.currentHp <= 0) return false;
            if (state.status === 'BRN' || state.status === 'PSN') {
                const dot = Math.floor(getStats(unit).maxHp / 8);
                unit.currentHp = Math.max(0, unit.currentHp - dot);
                addLog(`${unit.name} 受到 ${state.status==='BRN'?'灼伤':'毒'} 伤害!`);
                return unit.currentHp <= 0;
            }
            return false;
        };
        
        const playerInBattle = battleState.playerCombatStates[battleState.activeIdx];
        const enemyInBattle = battleState.enemyParty[battleState.enemyActiveIdx];

        const playerDiedFromDot = applyDot(playerInBattle, playerInBattle);
        const enemyDiedFromDot = applyDot(enemyInBattle, enemyInBattle);

        if (playerDiedFromDot) isDead = true; 
    }

    return isDead;
  };

   // ==========================================
  // [修复版] 战斗结算 (修复无限回血 + PP同步 + 进化条件)
  // ==========================================
  const processDefeatedEnemy = (deadEnemy, currentParty, finalBattleState) => { 
  
    // 基础经验系数
    const baseExp = Math.floor(deadEnemy.level * 30 * (battle.isTrainer ? 1.5 : 1));
    
    let levelUpLog = '';
    let hasPendingSkill = false;
    let activeDidLevelUp = false;

    const newParty = currentParty.map((p, index) => {
      let pet = { ...p };
      
     const sourceState = finalBattleState || battle; 
    
    if (sourceState && sourceState.playerCombatStates && sourceState.playerCombatStates[index]) {
        const combatState = sourceState.playerCombatStates[index];
        pet.currentHp = combatState.currentHp;
        pet.moves = pet.moves.map(m => {
            const combatMove = combatState.combatMoves.find(cm => cm.name === m.name && !cm.isExtra);
            if (combatMove) {
                return { ...m, pp: combatMove.pp }; 
            }
            return m;
        });
    }

      const isActive = index === battle.activeIdx;
      const shareRatio = isActive ? 1.0 : 0.5; 
      const expGain = Math.floor(baseExp * shareRatio);
      
      pet.exp += expGain;

      // 升级逻辑
      while (pet.exp >= pet.nextExp) {
        pet.exp -= pet.nextExp;
        pet.level++;
        
        const nKey = pet.nature || 'docile';
        const expMod = NATURE_DB[nKey]?.exp || 1.0;
        pet.nextExp = Math.floor(pet.level * 100 * expMod); 
        pet.currentHp = getStats(pet).maxHp; 
        pet.moves.forEach(m => m.pp = m.maxPP || 15);
        
        if (isActive) {
          levelUpLog += ` ${pet.name}升到了Lv.${pet.level}!`;
          activeDidLevelUp = true; 
        }

        // ▼▼▼ [修改] 进化条件检查 (支持 时间/天气/亲密度) ▼▼▼
        let meetsCondition = false;
        
        if (pet.evo && pet.level >= pet.evoLvl) {
            meetsCondition = true;
            const evoData = POKEDEX.find(p => p.id === pet.id); // 获取原始数据
            const condition = evoData?.evoCondition;

            if (condition) {
                // 检查时间
                if (condition.time && condition.time !== timePhase) meetsCondition = false;
                // 检查天气
                if (condition.weather && condition.weather !== weather) meetsCondition = false;
                // 检查亲密度
                if (condition.intimacy && (pet.intimacy || 0) < condition.intimacy) meetsCondition = false;
            }
        }

        if (meetsCondition) {
           pet.canEvolve = true;
           if (isActive) levelUpLog += ` (✨进化征兆!)`;
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        if (pet.level % 5 === 0) {
          const newMove = getMoveByLevel(pet.type, pet.level);
          const alreadyHas = pet.moves.find(m => m.name === newMove.name);
          const alreadyPending = pet.pendingLearnMove && pet.pendingLearnMove.name === newMove.name;
          
          if (!alreadyHas && !alreadyPending) {
            if (pet.moves.length < 4) {
              pet.moves.push(newMove);
              if (isActive) levelUpLog += ` 学会[${newMove.name}]`;
            } else {
              pet.pendingLearnMove = newMove;
              hasPendingSkill = true;
              if (isActive) levelUpLog += ` 领悟新技能!`;
            }
          }
        }
      }
      return pet;
    });

    return { 
      newParty, 
      logMsg: `击败${deadEnemy.name}! +${baseExp}XP ${levelUpLog}`,
      hasPendingSkill,
      activeDidLevelUp, 
      activeDidEvolve: false 
    };
  };

   const enterInfinityCastle = () => {
    if (party.length < 1) { alert("请先携带精灵！"); return; }
    
    // ▼▼▼ 门槛：Lv.80 ▼▼▼
    if (party[0].level < 80) { 
        alert("⚠️ 极度危险区域！\n无限城内恶鬼横行，建议首发精灵达到 Lv.80 再来挑战。"); 
        return; 
    }
    
    alert("🚪 琵琶声响起... 你掉入了无限城！\n在这里，只有不断战斗才能生存下去。");
    
    setInfinityState({
      floor: 1,
      buffs: [],
      status: 'selecting'
    });
    setView('infinity_castle');
  };


   // [硬核策略版] 生成无限城战斗
  const startInfinityBattle = (difficulty) => {
    const floor = infinityState.floor;
    let enemyPool = [];
    
    // 1. 等级曲线：80级起步，每5层升1级，100层时达到100级 (封顶100)
    let enemyLvl = Math.min(100, 80 + Math.floor(floor / 5)); 

    let bossName = null;
    let isBoss = false;

    // Boss 层逻辑
    if (floor % 10 === 0) {
        if (floor === 100) {
            enemyPool = [MOON_DEMONS.MUZAN];
            bossName = "鬼舞辻·无惨";
            enemyLvl = 100; // 满级
        } else {
            enemyPool = MOON_DEMONS.UPPER;
            bossName = `上弦之鬼 (第${floor}层)`;
        }
        isBoss = true;
    } else {
        enemyPool = difficulty === 'hard' ? MOON_DEMONS.LOWER : [18, 54, 94, 109, 197, 212, 286]; 
    }

    const enemyId = _.sample(enemyPool);
    // 创建基础敌人
    const enemy = createPet(enemyId, enemyLvl, true, isBoss); 
    if (bossName) enemy.name = bossName;

    // ▼▼▼▼▼▼▼▼▼▼ 核心强化逻辑 ▼▼▼▼▼▼▼▼▼▼

    // 2. 门派强化 (Sect)
    // 层数越高，门派等级越高。80层以上必定满级(10级)。
    // 门派效果极其强大，例如10级丐帮反弹35%伤害，10级天机阁无视30%防御
    const minSectLv = Math.floor(floor / 10);
    const maxSectLv = Math.min(10, 3 + Math.floor(floor / 8));
    
    enemy.sectId = _.random(1, 10); // 随机分配一个门派
    enemy.sectLevel = Math.min(10, _.random(minSectLv, maxSectLv));
    
    // 3. 装备技能强化 (Equipment Skills)
    // 敌人也会携带装备，并因此获得额外的第5、第6个技能！
    // 30层以上带1个装备，70层以上带2个装备
    const equipCount = floor > 70 ? 2 : (floor > 30 ? 1 : 0);
    const enemyEquips = [null, null];

    for (let i = 0; i < equipCount; i++) {
        // 随机抽取一个带有技能的装备 (从随机装备库中)
        const baseEquip = _.sample(RANDOM_EQUIP_DB);
        // 使用 createUniqueEquip 生成带随机技能的装备实例
        const fullEquip = createUniqueEquip(baseEquip.id);
        enemyEquips[i] = fullEquip;
    }
    enemy.equips = enemyEquips;

    // 4. 最终Boss (无惨) 特殊强化
    if (floor === 100) {
        enemy.sectId = 10; // 天机阁 (无视防御，刀刀见血)
        enemy.sectLevel = 10; // 满级
        
        // 强制装备两件神装 (模拟)
        // 1. 禁忌魔导书 (带一个强力特攻技能)
        const book = createUniqueEquip('rng_grimoire'); 
        // 2. 龙之心 (大幅加血 + 技能)
        const heart = createUniqueEquip('rng_heart');
        
        enemy.equips = [book, heart];
        
        // 修正属性，使其虽然是100级但数值极高 (模拟Boss面板)
        enemy.customBaseStats = { hp: 150, p_atk: 150, p_def: 120, s_atk: 180, s_def: 120, spd: 140, crit: 30 };
    }

    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 启动战斗 (drop: 0 表示无金币)
    startBattle({ 
        id: 888, 
        name: bossName || `无限城恶鬼 (Lv.${enemyLvl})`, 
        customParty: [enemy], 
        drop: 0 
    }, 'infinity');
  };


      const handleWin = (finalParty) => {
         if (audioRef.current) {
        audioRef.current.src = BGM_SOURCES.VICTORY;
        audioRef.current.play();
        // 胜利音乐通常不循环，或者你可以手动设置 loop={false}
        audioRef.current.loop = false; 
    }
    
        // 🔥 [捕虫大赛拦截]
            // ▼▼▼ [修复] 捕虫大赛：使用基因评分公式 (解决分数虚高) ▼▼▼
      if (battle.type === 'contest_bug') {
          // 1. 执行入队逻辑
          if (party.length < 6) {
              setParty(prev => [...syncCurrentParty(prev), newPet]);
              addLog(`🦋 ${newPet.name} 已加入队伍！`);
          } else {
              setBox(prev => [...prev, newPet]);
              setParty(prev => syncCurrentParty(prev));
              addLog(`🦋 ${newPet.name} 已发送到电脑盒子。`);
          }

          // 2. 🔥 [核心修改] 基因评分公式 🔥
          // 获取基础种族值 (固定值，不受等级影响)
          const baseInfo = POKEDEX.find(p => p.id === newPet.id) || {};
          // 计算种族值总和 (衡量品种稀有度)
          const baseTotal = (baseInfo.hp||0) + (baseInfo.atk||0) + (baseInfo.def||0) + (baseInfo.spd||0); // 简单累加
          
          // 获取个体值总和 (衡量先天资质, Max ~186)
          const ivSum = Object.values(newPet.ivs).reduce((a, b) => a + b, 0);

          // 🧮 最终公式：(个体值 x 1.5) + (种族值 x 0.8) + (闪光加分 300)
          // 绿毛虫(弱): 种族约180 -> 分数约 144 + 个体值(0~270) = 150~400分
          // 圣甲虫(强): 种族约400 -> 分数约 320 + 个体值(0~270) = 350~600分
          let score = Math.floor((ivSum * 1.5) + (baseTotal * 0.8));
          
          if (newPet.isShiny) {
              score += 300; // 闪光大幅加分
          }
          
          // 触发结算弹窗
          grantContestReward(CONTEST_CONFIG.bug, score, newPet);
          return; 
      }
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const { enemyParty, mapId, drop, isTrainer, isChallenge, challengeId, isGym, type } = battle;
    
    let totalBattleExp = 0;
    enemyParty.forEach(e => {
      totalBattleExp += Math.floor(e.level * 50 * (isTrainer ? 1.5 : 1));
    });

    const goldGain = Math.floor((drop + _.random(0, 20)) * (isTrainer ? 1.5 : 1));
    setGold(g => g + goldGain);

    // ▼▼▼ [新增] 亲密度与魅力值结算逻辑 ▼▼▼
    const updatedParty = finalParty.map((p, index) => {
        let newPet = { ...p };
        
        // 1. 亲密度增长 (Intimacy 0-255)
        // 基础：出战+3，后台+1
        let intGain = (index === battle.activeIdx) ? 3 : 1;
        
        // 加成：道馆/Boss/挑战塔/联盟 翻倍
        if (isGym || type === 'boss' || isChallenge || type === 'league') {
            intGain *= 2;
        }
        
        // 装备加成：如果有安抚之铃(假设id为a4爱心饼干代指)
        if (p.equips && p.equips.includes('a4')) intGain += 2;

        newPet.intimacy = Math.min(255, (newPet.intimacy || 0) + intGain);

        // 2. 魅力值增长 (Charm 0-100)
        // 只有出战的精灵，在击败 馆主/Boss/联盟 时增加
        if (index === battle.activeIdx) {
            if (isGym || type === 'boss' || type === 'league' || type === 'eclipse_leader') {
                // 随机增加 1-2 点
                const charmGain = Math.random() < 0.5 ? 1 : 2;
                newPet.charm = Math.min(100, (newPet.charm || 0) + charmGain);
            }
        }

        return newPet;
    });
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // --- 下面是原有的掉落和结算逻辑 (注意 setParty 使用 updatedParty) ---

    // 1. 元素之塔 -> 掉落进化石
    if (battle.type === 'dungeon_stone') {
        const stoneKeys = Object.keys(EVO_STONES);
        const rewardKey = _.sample(stoneKeys);
        const stone = EVO_STONES[rewardKey];
        
        setInventory(prev => ({
            ...prev, 
            stones: { ...prev.stones, [rewardKey]: (prev.stones[rewardKey]||0) + 1 }
        }));
        addLog(`🎁 副本奖励：获得 ${stone.icon} ${stone.name}！`);
    }
    // 2. 英雄试炼 -> 掉落属性增强剂
    if (battle.type === 'dungeon_stat') {
        const growthItems = GROWTH_ITEMS;
        const rewardItem = _.sample(growthItems);
        
        setInventory(prev => ({
            ...prev, 
            [rewardItem.id]: (prev[rewardItem.id]||0) + 1
        }));
        addLog(`🎁 试炼奖励：获得 ${rewardItem.emoji} ${rewardItem.name}！`);
    }

    // 3. 豪宅金库 -> 额外金币
    if (battle.name === '豪宅金库') {
        addLog(`💰 发财了！从金库中带回了大量金币！`);
    }

    // 4. 随机装备掉落
    const dropRate = isTrainer ? 0.1 : 0.02;
    if (Math.random() < dropRate) {
        const baseEquip = _.sample(RANDOM_EQUIP_DB);
        const newEquip = createUniqueEquip(baseEquip.id);
        setAccessories(prev => [...prev, newEquip]);
        addLog(`🎁 意外收获！敌人掉落了 ${newEquip.icon} ${newEquip.displayName}！`);
    }

    // 5. 门派挑战特殊逻辑
    if (battle.type === 'sect_challenge') {
        const sectId = battle.id - 8000;
        const chiefInfo = SECT_CHIEFS_CONFIG[sectId];
        const sectInfo = SECT_DB[sectId];

        if (!sectTitles.includes(sectId)) {
            setSectTitles(prev => [...prev, sectId]);
            unlockTitle(chiefInfo.title);
            const rewardEquip = createUniqueEquip(_.sample(RANDOM_EQUIP_DB).id);
            setAccessories(prev => [...prev, rewardEquip]);
            addLog(`获得战利品: ${rewardEquip.displayName}`);
            alert(`🏆 挑战成功！\n\n你击败了 ${chiefInfo.name}，夺得了【${chiefInfo.title}】的称号！\n\n🎁 宗师光环已获取：\n请在【训练家卡片】或【门派顶峰】界面佩戴该称号，\n即可激活全队${sectInfo.name}加成：\n✨ ${chiefInfo.buffName}: ${chiefInfo.buffDesc}`);
        } else {
            alert(`🥋 切磋结束！\n你再次证明了自己作为【${chiefInfo.title}】的实力！`);
        }
        
        setParty(updatedParty); // 🔥 使用更新了亲密度的队伍
        setView('sect_summit'); 
        return; 
    }

    let partyToSave = updatedParty; // 🔥 使用更新了亲密度的队伍

    // 6. 挑战塔逻辑
    if (isChallenge) {
       if (!completedChallenges.includes(challengeId)) {
         setCompletedChallenges(prev => [...prev, challengeId]);
         setInventory(prev => ({...prev, balls: {...prev.balls, master: prev.balls.master + 1}})); 
         
         const randomRewardId = _.random(1, 250);
         const shinyReward = createPet(randomRewardId, 50, false, true); 
         
         addLog(`🎉 挑战完成！获得 大师球 + 闪光${shinyReward.name}！`);

         if (updatedParty.length < 6) {
            partyToSave = [...updatedParty, shinyReward];
            setParty(partyToSave);
         } else {
            setParty(updatedParty); // 保持当前队伍更新
            setBox(b => [...b, shinyReward]);
            addLog("奖励已发送到电脑。");
         }
       } else {
           setParty(updatedParty); // 即使挑战过也要更新亲密度
       }
    } else {
        setParty(updatedParty); // 普通战斗更新队伍
    }

    if (battle.name === '狩猎地带') unlockTitle('狩猎大师');
    if (battle.name === '豪宅金库') unlockTitle('大富翁');

    // 7. 无限城逻辑
    if (battle.type === 'infinity') {
        const currentFloor = infinityState.floor;
        if (currentFloor === 100) {
            unlockTitle('日之呼吸'); 
            unlockTitle('继国缘一'); 
            setAccessories(prev => [...prev, 'blue_lily', 'nichirin_blade']);
            const godPet = createPet(183, 100, true, true); 
            godPet.name = "缘一·路卡利欧";
            godPet.isFusedShiny = true; 
            godPet.customBaseStats = { hp: 120, p_atk: 180, p_def: 100, s_atk: 180, s_def: 100, spd: 150, crit: 50 };
            const sunBreathingMove = { name: '火之神神乐', p: 200, t: 'FIRE', pp: 5, maxPP: 5, acc: 100, desc: '日之呼吸第十三型', effect: { type: 'STATUS', status: 'BRN', chance: 1.0 } };
            godPet.moves[0] = sunBreathingMove;

             if (updatedParty.length < 6) setParty([...updatedParty, godPet]);
            else {
                setParty(updatedParty);
                setBox(prev => [...prev, godPet]);
            }
            if (!caughtDex.includes(183)) setCaughtDex(prev => [...prev, 183]);

            alert(`🌅 恭喜通关【无限城 100层】！\n获得传说称号、饰品及神宠！`);
            setInfinityState(null);
            setView('world_map');
            return;
        }
        
        if (currentFloor % 5 === 0 || currentFloor % 10 === 0) {
            const options = _.sampleSize(BREATHING_BUFFS, 3);
            setInfinityState(prev => ({ ...prev, status: 'buff_select', buffOptions: options }));
            alert(`🎉 击败了强敌！\n请选择一种【呼吸法】强化自身！`);
        } else {
            nextInfinityFloor();
        }
        setView('infinity_castle'); 
        return; 
    }

    // 8. 战斗联盟逻辑
    if (battle.type === 'league') {
        if (leagueRound < 4) {
           unlockTitle('联盟冠军');
           if (leagueWins + 1 >= 5) unlockTitle('传奇霸主');
           setLeagueRound(prev => prev + 1);
           alert(`🎉 胜利！\n恭喜晋级下一轮！`);
           setView('league'); 
           return; 
        } else {
            setLeagueWins(prev => prev + 1);
            setLeagueRound(0); 
            setCompletedChallenges(prev => [...prev, 'LEAGUE_CHAMPION']); 
            setInventory(prev => ({...prev, max_candy: (prev.max_candy || 0) + 1}));
            const rand = Math.random();
            let rewardPet;
            const validIds = POKEDEX.filter(p => p.id < 254).map(p => p.id);
            const rewardId = _.sample(validIds);
            if (rand < 0.3) rewardPet = createPet(rewardId, 5, false, true);
            else if (rand < 0.6) { rewardPet = createPet(rewardId, 5, false, true); rewardPet.isFusedShiny = true; rewardPet.name = `异色·${rewardPet.name}`; rewardPet.customBaseStats = getStats(rewardPet); } 
            else rewardPet = createPet(rewardId, 5);

            if (updatedParty.length < 6) setParty([...updatedParty, rewardPet]);
            else {
                setParty(updatedParty);
                setBox(prev => [...prev, rewardPet]);
            }

            alert(`🏆 联盟冠军！\n\n获得奖励：\n1. 🍬 神奇糖果 x1\n2. 🎁 Lv.5 ${rewardPet.name}\n3. 🏆 联盟冠军奖杯数 +1`);
            setView('league'); 
            return;
        }
    }

    // 9. 剧情逻辑
    const currentChapter = STORY_SCRIPT[storyProgress];
    const currentTask = currentChapter?.tasks?.find(t => t.step === storyStep);
    
    if (currentTask && currentTask.type === 'battle' && battle.trainerName === currentTask.name) {
        const nextStep = storyStep + 1;
        setStoryStep(nextStep);
        const nextTask = currentChapter.tasks.find(t => t.step === nextStep);
        if (nextTask) {
            setMapGrid(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]); 
                if (newGrid[nextTask.y]) newGrid[nextTask.y][nextTask.x] = 99; 
                return newGrid;
            });
            alert(`✅ 威胁已清除！\n\n新的线索出现在坐标 (${nextTask.x}, ${nextTask.y})`);
        } else {
            alert("🎉 阶段任务全部完成！\n\n道路已打通，现在可以去挑战道馆馆主了！");
        }

        if (storyProgress === 12 && storyStep === 4) {
           unlockTitle('巅峰王者'); 
            setAccessories(prev => [...prev, 'trophy']);
            const godPet = createPet(254, 100, true, true); 
            godPet.name = "起源之光(冠军)";
            godPet.customBaseStats = { hp: 200, p_atk: 200, p_def: 200, s_atk: 200, s_def: 200, spd: 200, crit: 50 };
            if (party.length < 6) setParty(prev => [...prev, godPet]);
            else setBox(prev => [...prev, godPet]);
            alert("🏆 恭喜通关二周目！\n\n已获得：\n1. 饰品【冠军奖杯】\n2. 神宠【起源之光】");
        }
    }

    if (battle.isGym && mapId && currentChapter && currentChapter.mapId === mapId) {
       if (!badges.includes(MAPS.find(m=>m.id===mapId).badge)) {
          setBadges(prev => [...prev, MAPS.find(m=>m.id===mapId).badge]);
          setDialogQueue(currentChapter.outro);
          setCurrentDialogIndex(0);
          setIsDialogVisible(true);
          if (currentChapter.reward.gold) setGold(g => g + currentChapter.reward.gold);
          if (currentChapter.reward.balls) {
             setInventory(inv => {
                const newBalls = {...inv.balls};
                Object.keys(currentChapter.reward.balls).forEach(k => newBalls[k] += currentChapter.reward.balls[k]);
                return {...inv, balls: newBalls};
             });
          }
          if (currentChapter.reward.items) {
             setInventory(inv => {
                const newInv = {...inv};
                currentChapter.reward.items.forEach(it => newInv[it.id] = (newInv[it.id]||0) + it.count);
                return newInv;
             });
          }
          
          if (['eclipse_grunt', 'eclipse_executive'].includes(battle.type)) {
            setMapGrid(prev => {
                const newGrid = prev.map(row => [...row]);
                const { x, y } = playerPos; 
                for(let i=-2; i<=2; i++) {
                    for(let j=-2; j<=2; j++) {
                        const ty = y + j;
                        const tx = x + i;
                        if (ty >= 0 && ty < GRID_H && tx >= 0 && tx < GRID_W) {
                            if (newGrid[ty][tx] === 11 || newGrid[ty][tx] === 12) {
                                newGrid[ty][tx] = 2; 
                                if(ty > 0 && newGrid[ty-1][tx] === 1) newGrid[ty-1][tx] = 2;
                                if(ty < GRID_H-1 && newGrid[ty+1][tx] === 1) newGrid[ty+1][tx] = 2;
                            }
                        }
                    }
                }
                return newGrid;
            });
            setTimeout(() => alert("敌人撤退了！道路已打通。"), 500);
          }

          if (battle.type === 'eclipse_leader') {
            setCompletedChallenges(prev => [...prev, 'ECLIPSE_HQ_CLEARED']);
            const rewardPet = createPet(341, 50); 
            rewardPet.name = "暗黑超梦";
            rewardPet.customBaseStats = { hp: 106, atk: 150, def: 90, s_atk: 154, s_def: 90, spd: 130, crit: 10 }; 
            if (party.length < 6) setParty([...updatedParty, rewardPet]); // 使用 updatedParty
            else {
                setParty(updatedParty); // 先更新队伍数据
                setBox(prev => [...prev, rewardPet]);
            }
            setCaughtDex(prev => [...prev, 341]);
            alert("🏆 战胜了日蚀队首领！\n🎉 获得了传说中的精灵【暗黑超梦】！");
            setView('world_map');
            return; 
          }

          if (currentChapter.reward.pokemon) {
             const rewardPetInfo = currentChapter.reward.pokemon;
             const rewardPet = createPet(rewardPetInfo.id, rewardPetInfo.level);
             if (!caughtDex.includes(rewardPet.id)) setCaughtDex(prev => [...prev, rewardPet.id]);
             if (party.length < 6) {
                 setParty(prev => [...prev, rewardPet]);
                 alert(`🎁 获得了伙伴：${rewardPet.name}！\n已加入队伍。`);
             } else {
                 setBox(prev => [...prev, rewardPet]);
                 alert(`🎁 获得了伙伴：${rewardPet.name}！\n队伍已满，已发送到电脑。`);
             }
          }
          setStoryProgress(prev => prev + 1);
          setStoryStep(0); 
       }
    }
    
    addLog(`胜利! 总经验+${totalBattleExp} / 金币+${goldGain}`);

    const hasPendingSkill = partyToSave.some(p => p.pendingLearnMove);

    if (hasPendingSkill) {
      setTimeout(() => {
        alert("⚠️ 队伍中有伙伴领悟了新技能！\n请在队伍界面处理技能去留，否则无法继续移动。");
        setView('team');
      }, 1500);
    } else {
      if (!isDialogVisible) {
         setTimeout(() => setView('grid_map'), 2000);
      }
    }
  };

    const handleDefeat = async () => {
    addLog("所有伙伴都倒下了...");
    setAnimEffect({ type: 'BLACKOUT' }); 
    
    await wait(2500);
     if (battle && battle.type === 'infinity') {
        alert(`💀 你倒在了第 ${infinityState.floor} 层...\n\n虽然失败了，但你的勇气值得赞赏。\n(队伍已在城外复活)`);
        const healedParty = party.map(p => ({...p, currentHp: getStats(p).maxHp})); 
        setParty(healedParty);
        setInfinityState(null); 
        setAnimEffect(null);
        setBattle(null);
        setView('world_map'); 
        return;
    }

    // ▼▼▼ [新增] 失败惩罚：亲密度略微下降 ▼▼▼
    const healedParty = party.map(p => ({
      ...p, 
      currentHp: getStats(p).maxHp,
      moves: p.moves.map(m => ({...m, pp: m.maxPP || 15})),
      status: null,
      stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
      // 亲密度 -1，最低为0
      intimacy: Math.max(0, (p.intimacy || 0) - 1)
    }));
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(healedParty);

    enterMap(currentMapId);

    setAnimEffect(null);
    setBattle(null);
    
    alert("你慌忙逃回了附近的营地...\n伙伴们已经恢复了活力！\n(亲密度略微下降)");
  };

  // ==========================================
  // [新增] 逃跑逻辑 (带概率计算 + PP同步)
  // ==========================================
  const handleRun = async () => {
    // 1. 检查是否允许逃跑
    if (battle.isTrainer || battle.isGym || battle.isChallenge || battle.isStory || battle.isPvP) {
        addLog("⚠️ 这种战斗无法逃跑！必须决出胜负！");
        return;
    }

    const playerPet = party[battle.activeIdx];
    const enemyPet = battle.enemyParty[battle.enemyActiveIdx];

    // 3. 计算逃跑概率
    let escapeChance = 0.8;
    if (enemyPet.level > playerPet.level) {
        const levelDiff = enemyPet.level - playerPet.level;
        escapeChance -= (levelDiff * 0.05);
    }
    const pSpd = getStats(playerPet).spd;
    const eSpd = getStats(enemyPet).spd;
    if (pSpd > eSpd) escapeChance += 0.2;
    escapeChance = Math.max(0.2, Math.min(1.0, escapeChance));

     // 4. 执行判定
    if (Math.random() < escapeChance) {
      if (battle.type === 'contest_bug') {
    if (confirm("🏃 你逃离了战斗。\n\n要继续搜寻下一只吗？")) {
        setBattle(null);
        setTimeout(() => encounterNextBug(), 100);
        return;
    } else {
        alert("你退出了捕虫大赛。");
        setActiveContest(null);
        setBattle(null);
        setView('grid_map');
        return;
    }
}
        // --- 成功 ---
        addLog("🏃💨 成功逃跑了！");
        setBattle(prev => ({ ...prev, phase: 'anim' })); 
        await wait(800);

        // 🔥🔥🔥【核心修复：同步战斗血量和PP到全局队伍】🔥🔥🔥
        const newParty = party.map((p, i) => {
            const combatState = battle.playerCombatStates[i];
            if (!combatState) return p;

            let newPet = { ...p };
            newPet.currentHp = combatState.currentHp;
            
            // 同步 PP
            newPet.moves = newPet.moves.map(m => {
                const cm = combatState.combatMoves.find(c => c.name === m.name && !c.isExtra);
                return cm ? { ...m, pp: cm.pp } : m;
            });
            
            return newPet;
        });
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        setParty(newParty);
        setBattle(null); // 结束战斗
        setView('grid_map'); // 回地图
    } else {
        // --- 失败 ---
        addLog("🚫 逃跑失败！被对方拦住了！");
        setBattle(prev => ({ ...prev, phase: 'busy' })); 
        
        const screen = document.querySelector('.battle-screen');
        if(screen) screen.classList.add('anim-shake-screen');
        await wait(500);
        if(screen) screen.classList.remove('anim-shake-screen');

        await enemyTurn(); 
    }
  };


  // ==========================================
  // [修复版] 捕捉逻辑 (修复捕虫大赛不进队问题)
  // ==========================================
  const handleCatch = async (ballType) => {
    setShowBallMenu(false);
    if (battle.isTrainer || battle.isGym || battle.isChallenge) return addLog("训练家的精灵不能捕捉！");
    if (inventory.balls[ballType] <= 0) return addLog("球不足！");
    
    // 1. 扣球并播放投掷动画
    setInventory(prev => ({ ...prev, balls: { ...prev.balls, [ballType]: prev.balls[ballType] - 1 } }));
    setBattle(prev => ({...prev, phase: 'anim'}));
    setAnimEffect({ type: 'THROW_BALL', target: 'enemy', ballType: ballType });
    addLog(`去吧! ${BALLS[ballType].name}!`);
    
    await wait(800); 
    setAnimEffect(null);

    const enemy = battle.enemyParty[battle.enemyActiveIdx];
    const catchChance = calculateCatchRate(ballType, enemy);
    const roll = Math.random();

    // 2. 判定捕捉结果
    if (roll < catchChance || ballType === 'master') { 
      // 播放成功动画
      setAnimEffect({ type: 'CATCH_SUCCESS', ballType: ballType });
      await wait(1500); 
      setAnimEffect(null);

      addLog(`✨ 成功捕捉 ${enemy.name}!`);
      if (!caughtDex.includes(enemy.id)) setCaughtDex(prev => [...prev, enemy.id]);

      // 生成新精灵对象
      const newPet = { ...enemy, uid: Date.now() };
      if (ballType === 'heal') newPet.currentHp = getStats(newPet).maxHp;

      // 🔥 [核心修复] 同步当前战斗状态 (防止战斗中扣血/PP未保存)
      const syncCurrentParty = (currentParty) => {
          return currentParty.map((p, i) => {
              const combatState = battle.playerCombatStates[i];
              if (!combatState) return p;
              let updatedPet = { ...p, currentHp: combatState.currentHp };
              updatedPet.moves = updatedPet.moves.map(m => {
                  const cm = combatState.combatMoves.find(c => c.name === m.name && !c.isExtra);
                  return cm ? { ...m, pp: cm.pp } : m;
              });
              return updatedPet;
          });
      };

      // ▼▼▼ [修复] 捕虫大赛：先入队/入库，再结算 ▼▼▼
      if (battle.type === 'contest_bug') {
          // 1. 执行入队逻辑
          if (party.length < 6) {
              setParty(prev => [...syncCurrentParty(prev), newPet]);
              addLog(`🦋 ${newPet.name} 已加入队伍！`);
          } else {
              setBox(prev => [...prev, newPet]);
              setParty(prev => syncCurrentParty(prev)); // 即使存入电脑，也要同步当前队伍状态
              addLog(`🦋 ${newPet.name} 已发送到电脑盒子。`);
          }

          // 2. 计算分数并结算
          const baseStats = getStats(newPet);
          let score = baseStats.maxHp + baseStats.p_atk + baseStats.spd;
          if (newPet.isShiny) score += 200;
          
          // 触发结算弹窗
          grantContestReward(CONTEST_CONFIG.bug, score, newPet);
          return; // 结束函数
      }
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      // 3. 普通捕捉：入队或存入电脑
      if (party.length < 6) {
        setParty(prev => [...syncCurrentParty(prev), newPet]);
      } else {
        setBox(prev => [...prev, newPet]);
        setParty(prev => syncCurrentParty(prev)); 
        addLog("队伍已满，已发送到电脑。");
      }
      
      await wait(1000);
      setView('grid_map');

    } else {
      // 捕捉失败
      addLog("哎呀! 差点就捉到了!");
      await wait(500);
      setBattle(prev => ({...prev, phase: 'input'}));
      await enemyTurn();
    }
  };


  const depositPokemon = () => {
    if (selectedPartyIdx === null) return;
    if (party.length <= 1) { alert("至少携带一只！"); return; }
    const p = party[selectedPartyIdx];
    setParty(party.filter((_, i) => i !== selectedPartyIdx));
    setBox([...box, p]); setSelectedPartyIdx(null);
  };

  const withdrawPokemon = () => {
    if (selectedBoxIdx === null) return;
    if (party.length >= 6) { alert("队伍已满！"); return; }
    const p = box[selectedBoxIdx];
    setBox(box.filter((_, i) => i !== selectedBoxIdx));
    setParty([...party, p]); setSelectedBoxIdx(null);
  };

  const releasePokemon = () => {
    if (selectedBoxIdx === null) return;
    if (confirm("⚠️ 确定要放生这只精灵吗？它将回归大自然，无法找回！")) {
      const p = box[selectedBoxIdx];
      setBox(box.filter((_, i) => i !== selectedBoxIdx));
      setGold(g => g + 50); 
      alert(`你放生了 ${p.name}，获得了 50 金币作为补偿。`);
      setSelectedBoxIdx(null);
    }
  };

  const updateBuyCount = (id, delta) => {
    setBuyCounts(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };
   // 🔥 [美化] 钓鱼小游戏
  const renderFishingGame = () => {
    const { status, fish, weight, msg } = fishingState;
    return (
      <div className="screen" style={{
          background: 'linear-gradient(180deg, #0288D1 0%, #01579B 100%)', 
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          position: 'relative', overflow: 'hidden'
      }}>
        {/* 水波纹背景 */}
        <div style={{position:'absolute', inset:0, opacity:0.1, backgroundImage:'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize:'30px 30px'}}></div>
        
        <div className="nav-header glass-panel" style={{zIndex:10}}>
            <button className="btn-back" onClick={() => setView('grid_map')}>退出</button>
            <div className="nav-title">🎣 钓鱼大赛</div>
        </div>

        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', zIndex:5}} onClick={reelIn}>
            {/* 状态指示器 */}
            <div style={{
                width:'200px', height:'200px', borderRadius:'50%', 
                background: status==='bite' ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border: status==='bite' ? '4px solid #FF5252' : '4px solid rgba(255,255,255,0.3)',
                animation: status==='waiting' ? 'pulse 2s infinite' : (status==='bite' ? 'shake 0.5s infinite' : 'none'),
                marginBottom: '30px', transition: '0.3s'
            }}>
                <div style={{fontSize:'80px'}}>
                    {status === 'idle' && '🚣'}
                    {status === 'waiting' && '🌊'}
                    {status === 'bite' && '❗️'}
                    {status === 'success' && '🐟'}
                    {status === 'fail' && '💨'}
                </div>
            </div>

            {/* 提示文字 */}
            <div style={{textAlign:'center', color:'#fff', fontSize:'20px', fontWeight:'bold', textShadow:'0 2px 4px rgba(0,0,0,0.3)', minHeight:'60px'}}>
                {status === 'idle' && "点击按钮抛竿"}
                {status === 'waiting' && "耐心等待..."}
                {status === 'bite' && <span style={{color:'#FF5252', fontSize:'24px'}}>有鱼上钩！快收杆！</span>}
                {status === 'fail' && <div>{msg}<br/><button onClick={(e)=>{e.stopPropagation(); startFishing();}} style={{marginTop:'10px', padding:'8px 20px', borderRadius:'20px', border:'none', cursor:'pointer'}}>再试一次</button></div>}
                
                {status === 'success' && (
                    <div style={{animation:'popIn 0.5s'}}>
                        <div style={{fontSize:'16px', color:'#81D4FA'}}>🎉 钓到了！</div>
                        <div style={{background:'rgba(0,0,0,0.3)', padding:'15px', borderRadius:'12px', marginTop:'10px', display:'flex', alignItems:'center', gap:'15px'}}>
                            <div style={{fontSize:'40px'}}>{renderAvatar(fish)}</div>
                            <div style={{textAlign:'left'}}>
                                <div style={{fontSize:'18px', color:'#fff'}}>{fish.name}</div>
                                <div style={{fontSize:'14px', color:'#FFD700'}}>{weight} kg</div>
                            </div>
                        </div>
                        {/* 🔥 这里的 onClick 已经更新为调用新版 grantContestReward */}
                        <button onClick={(e) => { e.stopPropagation(); grantContestReward(CONTEST_CONFIG.fishing, parseFloat(weight), fish); }} 
                            style={{marginTop:'20px', padding:'12px 40px', borderRadius:'30px', border:'none', background:'linear-gradient(90deg, #FFC107, #FF9800)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'16px', boxShadow:'0 4px 10px rgba(0,0,0,0.3)'}}>
                            提交成绩
                        </button>
                    </div>
                )}
            </div>

            {/* 操作按钮 */}
            {status === 'idle' && (
                <button onClick={(e)=>{e.stopPropagation(); castRod();}} style={{
                    marginTop:'40px', width:'80px', height:'80px', borderRadius:'50%', border:'4px solid #fff', 
                    background:'#FF9800', color:'#fff', fontWeight:'bold', fontSize:'14px', cursor:'pointer',
                    boxShadow:'0 10px 20px rgba(0,0,0,0.3)'
                }}>
                    抛竿
                </button>
            )}
        </div>
      </div>
    );
  };

  // 🔥 [美化] 选美大赛
  const renderBeautyContest = () => {
    const { pet } = activeContest;
    const { round, appeal, log } = beautyState;
    const isFinished = round > 5;
    
    return (
      <div className="screen" style={{background: '#263238', display:'flex', flexDirection:'column'}}>
        {/* 舞台背景 */}
        <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 50% 0%, #880E4F 0%, #263238 70%)'}}></div>
        {/* 聚光灯 */}
        <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'300px', height:'600px', background:'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 80%)', clipPath:'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', pointerEvents:'none'}}></div>

        <div className="nav-header glass-panel" style={{zIndex:10, background:'rgba(0,0,0,0.3)'}}>
            <button className="btn-back" onClick={() => setView('grid_map')}>退出</button>
            <div className="nav-title">🎀 华丽大赛</div>
        </div>

        <div style={{flex:1, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', zIndex:5, position:'relative'}}>
            {/* 魅力热度条 */}
            <div style={{width:'100%', maxWidth:'300px', background:'rgba(0,0,0,0.5)', height:'20px', borderRadius:'10px', overflow:'hidden', marginBottom:'20px', border:'1px solid #555'}}>
                <div style={{width:`${Math.min(100, appeal/2)}%`, height:'100%', background:'linear-gradient(90deg, #F48FB1, #E91E63)', transition:'width 0.5s'}}></div>
            </div>
            <div style={{color:'#F48FB1', fontWeight:'bold', fontSize:'18px', marginBottom:'10px'}}>💖 魅力值: {appeal}</div>

            {/* 精灵展示 */}
            <div style={{fontSize:'100px', animation:'bounce 2s infinite', filter:'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}}>
                {renderAvatar(pet)}
            </div>
            <div style={{color:'#fff', marginTop:'10px', fontSize:'14px', opacity:0.8}}>{isFinished ? "表演结束！" : `Round ${round} / 5`}</div>
            
            {/* 技能卡片区 */}
            {!isFinished ? (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', width:'100%', marginTop:'30px'}}>
                    {pet.moves.map((m, i) => (
                        <button key={i} onClick={() => performAppeal(m)} style={{
                            padding:'15px', borderRadius:'12px', border:'none', 
                            background: 'rgba(255,255,255,0.1)', backdropFilter:'blur(5px)',
                            color: TYPES[m.t]?.color || '#fff', borderLeft:`4px solid ${TYPES[m.t]?.color}`,
                            fontWeight:'bold', cursor:'pointer', textAlign:'left',
                            boxShadow:'0 4px 10px rgba(0,0,0,0.2)', transition:'0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                        onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                        >
                            <div style={{fontSize:'14px'}}>{m.name}</div>
                            <div style={{fontSize:'10px', color:'#aaa', marginTop:'4px'}}>展示 {TYPES[m.t]?.name} 魅力</div>
                        </button>
                    ))}
                </div>
            ) : (
                // 🔥 这里的 onClick 已经更新为调用新版 grantContestReward
                <button onClick={() => grantContestReward(CONTEST_CONFIG.beauty, appeal, pet)} 
                    style={{marginTop:'40px', padding:'15px 50px', borderRadius:'30px', border:'none', background:'linear-gradient(90deg, #E91E63, #C2185B)', color:'#fff', fontWeight:'bold', fontSize:'18px', cursor:'pointer', boxShadow:'0 0 20px #E91E63'}}>
                    查看结果
                </button>
            )}

            {/* 日志 */}
            <div style={{marginTop:'auto', width:'100%', height:'100px', overflowY:'auto', background:'rgba(0,0,0,0.5)', borderRadius:'10px', padding:'10px', fontSize:'11px', color:'#ccc'}}>
                {log.map((l, i) => <div key={i} style={{marginBottom:'4px'}}>{l}</div>)}
            </div>
        </div>
      </div>
    );
  };

  // 🔥 [新增] 通用活动结算界面
  const renderResultModal = () => {
    if (!resultData) return null;
    const { title, type, score, subjectPet, tierName, tierMsg, reward, rankIdx, isNewRecord } = resultData;

    let themeColor = '#4CAF50'; // 捕虫绿
    let unit = '分';
    if (type === 'contest_fishing') { themeColor = '#03A9F4'; unit = 'kg'; }
    else if (type === 'contest_beauty') { themeColor = '#E91E63'; unit = '分'; }

    const handleClose = () => {
        setResultData(null);
        setActiveContest(null);
        setView('grid_map');
        if (type === 'contest_fishing') setFishingState({ status: 'idle', timer: 0, target: null });
    };

    return (
      <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
      }}>
        <div style={{
            width: '380px', background: '#fff', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            {/* 顶部光效 */}
            <div style={{height: '140px', background: `linear-gradient(135deg, ${themeColor}, #222)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', animation: 'spin 10s linear infinite'}}></div>
                <div style={{fontSize: '80px', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))', animation: 'bounce 2s infinite'}}>
                    {rankIdx === 0 ? '🏆' : (rankIdx === 1 ? '🥈' : (rankIdx === 2 ? '🥉' : '🎗️'))}
                </div>
                <div style={{position: 'absolute', bottom: '10px', color: '#fff', fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>{title} 结算</div>
            </div>

            {/* 内容区 */}
            <div style={{padding: '20px', textAlign: 'center', marginTop: '-30px', position: 'relative', zIndex: 3}}>
                {/* 成绩卡片 */}
                <div style={{background: '#fff', borderRadius: '16px', padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
                    <div style={{fontSize: '12px', color: '#999', marginBottom: '5px', textTransform: 'uppercase'}}>Final Score</div>
                    <div style={{fontSize: '36px', fontWeight: '900', color: themeColor, lineHeight: '1'}}>
                        {score}<span style={{fontSize: '16px', marginLeft: '2px'}}>{unit}</span>
                    </div>
                    {isNewRecord && <div style={{fontSize:'12px', color:'#FF9800', fontWeight:'bold', marginTop:'5px'}}>🎉 新纪录！</div>}
                    
                    {subjectPet && (
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                            <div style={{fontSize: '32px'}}>{renderAvatar(subjectPet)}</div>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontWeight: 'bold', fontSize: '14px'}}>{subjectPet.name}</div>
                                <div style={{fontSize: '10px', color: '#666', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block'}}>
                                    {subjectPet.isShiny ? '✨ 闪光加分' : '表现优异'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 评价与奖励 */}
                <div style={{marginBottom: '25px'}}>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '5px'}}>{tierName}</div>
                    <div style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>{tierMsg}</div>
                    <div style={{background: `linear-gradient(90deg, ${themeColor}11, ${themeColor}33)`, border: `1px solid ${themeColor}44`, borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div style={{width: '50px', height: '50px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                            {reward.type === 'PET' ? renderAvatar(reward.pet) : reward.icon}
                        </div>
                        <div style={{textAlign: 'left', flex: 1}}>
                            <div style={{fontSize: '10px', color: themeColor, fontWeight: 'bold', textTransform: 'uppercase'}}>REWARD</div>
                            <div style={{fontSize: '14px', fontWeight: 'bold', color: '#333'}}>{reward.name}</div>
                        </div>
                        <div style={{fontSize: '20px'}}>🎁</div>
                    </div>
                </div>

                <button onClick={handleClose} style={{width: '100%', padding: '14px', borderRadius: '30px', border: 'none', background: themeColor, color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 8px 20px ${themeColor}66`, transition: 'transform 0.1s'}}>收入囊中</button>
            </div>
        </div>
      </div>
    );
  };

     // ==========================================
  // [修正] 购买逻辑 (支持所有物品通用购买)
  // ==========================================
  const buyItemPro = (id, price, type) => {
    const count = buyCounts[id] || 1;
    const totalCost = price * count;
    
    if (gold >= totalCost) {
      setGold(g => g - totalCost);
      
      let itemName = '';

      // --- 1. 购买精灵球 ---
      if (type === 'ball') {
         const ballType = id.split('_')[1]; // 例如 'ball_net' -> 'net'
         setInventory(i => ({
             ...i, 
             balls: {
                 ...i.balls, 
                 [ballType]: (i.balls[ballType] || 0) + count
             }
         }));
         itemName = BALLS[ballType].name;
      } 
         // ➕ [新增] 2. 购买技能书 (修复不保存问题)
      else if (type === 'tm') {
         // 这里的 id 直接就是 tm_fire 等
         setInventory(i => ({
             ...i, 
             tms: { ...i.tms, [id]: (i.tms[id] || 0) + count }
         }));
         const tm = TMS.find(t => t.id === id);
         itemName = tm ? tm.name : '技能书';
      }
        else if (type === 'stone') {
     setInventory(i => ({
         ...i, 
         stones: { ...i.stones, [id]: (i.stones[id] || 0) + count }
     }));
     const stone = EVO_STONES[id];
     itemName = stone ? stone.name : '进化石';
}
            // --- 2. 购买道具 (药品/增强剂/特殊) ---
      else if (type === 'item') {
         // ✅ 修复1：洗练药存入 misc
         if (id === 'rebirth_pill') {
            setInventory(i => ({
                ...i, 
                misc: { ...i.misc, rebirth_pill: (i.misc.rebirth_pill || 0) + count }
            }));
            itemName = MISC_ITEMS.rebirth_pill.name;
         }
         // ✅ 修复2：增强剂存入根目录 (保持不变，因为 renderBag 是从根目录读的)
         else if (id.startsWith('vit_')) {
            setInventory(i => ({...i, [id]: (i[id] || 0) + count}));
            const growth = GROWTH_ITEMS.find(g => g.id === id);
            itemName = growth ? growth.name : '增强剂';
         } 
         // ✅ 修复3：普通药品存入 meds
         else {
            setInventory(i => ({
                ...i, 
                meds: { ...i.meds, [id]: (i.meds[id] || 0) + count }
            }));
            const med = MEDICINES[id];
            itemName = med ? med.name : '药品';
         }
      } 

      // --- 3. 购买饰品 ---
      else if (type === 'acc') {
         for(let k=0; k<count; k++) setAccessories(prev => [...prev, id]);
         const acc = ACCESSORY_DB.find(a => a.id === id);
         itemName = acc ? acc.name : '饰品';
      }
      
      setBuyCounts(prev => ({...prev, [id]: 1}));
      
      alert(`✅ 购买成功！\n获得了 ${itemName} x${count}\n花费了 ${totalCost} 金币`);
    } else {
      alert("❌ 金币不足！无法购买。");
    }
  };


  const addLog = (msg) => setBattle(prev => ({...prev, logs: [msg, ...prev.logs].slice(0, 3)}));
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const forgetMove = (moveIndex) => {
    if (learningPetIdx === null || !pendingMove) return;
    const newParty = [...party];
    const p = newParty[learningPetIdx];
    if (moveIndex === -1) {
      alert(`${p.name} 放弃了学习 [${pendingMove.name}]。`);
    } else {
      const oldMoveName = p.moves[moveIndex].name;
      p.moves[moveIndex] = pendingMove;
      alert(`${p.name} 忘记了 [${oldMoveName}]，学会了 [${pendingMove.name}]!`);
    }
    p.pendingLearnMove = null; 
    setParty(newParty);
    setPendingMove(null);
    setLearningPetIdx(null);
    const stillHasPending = newParty.some(pet => pet.pendingLearnMove);
    if (stillHasPending) {
      setView('team'); 
    } else {
      setView('grid_map'); 
    }
  };

  const renderMoveForget = () => {
    const p = party[learningPetIdx];
    return (
      <div className="screen" style={{background: 'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 100}}>
        <div className="glass-panel" style={{width:'90%', maxWidth:'400px', padding:'20px', color:'#333'}}>
          <div style={{textAlign:'center', marginBottom:'20px'}}>
            <div style={{fontSize:'40px'}}>{p.emoji}</div>
            <h3 style={{margin:'10px 0'}}>{p.name} 想要学习新技能!</h3>
            <div style={{background:'#FFF9C4', padding:'10px', borderRadius:'8px', border:'2px solid #FBC02D', marginBottom:'15px'}}>
              <div style={{fontWeight:'900', fontSize:'18px'}}>{pendingMove.name}</div>
              <div style={{fontSize:'12px'}}>属性: {TYPES[pendingMove.t].name} / 威力: {pendingMove.p}</div>
            </div>
            <p style={{fontSize:'12px', color:'#666'}}>但技能已满4个，请选择一个遗忘：</p>
          </div>
          <div style={{display:'grid', gap:'10px'}}>
            {p.moves.map((m, i) => (
              <button key={i} onClick={() => forgetMove(i)} style={{padding:'12px', border:'1px solid #ddd', borderRadius:'8px', background:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
                <span style={{fontWeight:'bold'}}>{m.name}</span>
                <span style={{fontSize:'10px', color:'#999'}}>威力:{m.p}</span>
              </button>
            ))}
          </div>
          <div style={{marginTop:'20px', borderTop:'1px solid #eee', paddingTop:'15px'}}>
            <button onClick={() => forgetMove(-1)} style={{width:'100%', padding:'12px', background:'#FF5252', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'bold'}}>放弃学习 {pendingMove.name}</button>
          </div>
        </div>
      </div>
    );
  };

const renderNameInput = () => (
  <div className="screen" style={{
      background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // 清新蓝绿渐变
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
  }}>
    {/* 装饰性背景元素 */}
    <div style={{position:'absolute', top:'10%', left:'10%', fontSize:'80px', opacity:0.2, animation:'float 5s infinite'}}>🍃</div>
    <div style={{position:'absolute', bottom:'10%', right:'10%', fontSize:'80px', opacity:0.2, animation:'float 7s infinite'}}>💧</div>

    <div style={{
        background: '#fff', padding: '40px', borderRadius: '30px', 
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)', textAlign: 'center', 
        width: '90%', maxWidth: '400px', position: 'relative',
        border: '8px solid #fff' // 模拟卡片边框
    }}>
        {/* 顶部大木博士头像 */}
        <div style={{
            width: '100px', height: '100px', background: '#eee', borderRadius: '50%', 
            margin: '-90px auto 20px', border: '8px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
            🧙‍♂️
        </div>

        <h2 style={{color: '#333', marginBottom: '5px', fontSize: '24px'}}>欢迎来到宝可梦世界！</h2>
        <p style={{color: '#666', marginBottom: '30px', fontSize: '14px'}}>我是大木博士。在开始冒险之前，<br/>请告诉我你的名字是？</p>
        
        <div style={{
            background: '#f0f2f5', padding: '10px', borderRadius: '15px', 
            border: '2px solid #e1e4e8', marginBottom: '25px', display: 'flex', alignItems: 'center'
        }}>
            <span style={{fontSize: '24px', padding: '0 10px'}}>🧢</span>
            <input 
                type="text" 
                placeholder="你的名字..." 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)} 
                maxLength={8} 
                style={{
                    flex: 1, padding: '10px', borderRadius: '10px', border: 'none', 
                    fontSize: '18px', background: 'transparent', fontWeight: 'bold', color: '#333', outline: 'none'
                }}
            />
        </div>

        <button onClick={() => { 
            if(!tempName.trim()) { alert("名字不能为空！"); return; } 
            setTrainerName(tempName); 
            generateStarterOptions(); 
            setView('starter_select'); 
        }} style={{
            width: '100%', padding: '18px', borderRadius: '30px', border: 'none', 
            background: 'linear-gradient(90deg, #00C6FF, #0072FF)', 
            color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0, 114, 255, 0.3)', transition: 'transform 0.1s'
        }}>
            确认登记
        </button>
    </div>
  </div>
);


   // ==========================================
  // [修改] 初始选择界面 (显示全属性，所见即所得)
  // ==========================================
  const renderStarterSelect = () => {
    return (
      <div className="screen starter-screen" style={{
          background: 'radial-gradient(circle at center, #2b32b2 0%, #141e30 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center', marginBottom: '30px', color: '#fff', animation: 'popIn 0.5s'}}>
          <div style={{fontSize: '14px', opacity: 0.8, letterSpacing: '4px', textTransform: 'uppercase'}}>Adventure Begins</div>
          <div style={{fontSize: '32px', fontWeight: '900', textShadow: '0 4px 10px rgba(0,0,0,0.5)'}}>选择你的命运伙伴</div>
        </div>
        
        <div style={{
            display: 'flex', gap: '20px', width: '100%', maxWidth: '1000px', 
            justifyContent: 'center', flexWrap: 'wrap', padding: '0 20px'
        }}>
          {starterOptions.map((p, i) => {
            // 🔥 直接获取当前对象的属性 (因为已经是生成的实例了)
            const stats = getStats(p);
            const typeConfig = TYPES[p.type] || TYPES.NORMAL;
            const natureName = NATURE_DB[p.nature]?.name || '未知';
            
            return (
              <div key={i} className="starter-card-pro" 
                   onClick={() => confirmStarter(p)}
                   style={{
                      width: '280px', background: '#fff', borderRadius: '24px', 
                      overflow: 'hidden', cursor: 'pointer', position: 'relative',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      animation: `popIn 0.5s ease-out ${i * 0.1}s backwards`
                   }}
                   onMouseEnter={e => {
                       e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                       e.currentTarget.style.boxShadow = `0 30px 60px ${typeConfig.color}66`;
                   }}
                   onMouseLeave={e => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
                   }}
              >
                {/* 顶部：属性背景 + 头像 */}
                <div style={{
                    height: '130px', background: typeConfig.color, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', fontSize: '100px', fontWeight: '900', 
                        color: 'rgba(255,255,255,0.1)', transform: 'rotate(-20deg)', pointerEvents: 'none'
                    }}>
                        {p.type}
                    </div>
                    <div style={{
                        fontSize: '80px', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        {renderAvatar(p)}
                    </div>
                </div>

                {/* 内容区 */}
                <div style={{padding: '15px', textAlign: 'center'}}>
                    <div style={{fontSize: '22px', fontWeight: '800', color: '#333', marginBottom: '5px'}}>
                        {p.name}
                    </div>
                    <div style={{display:'flex', justifyContent:'center', gap:'10px', marginBottom:'15px'}}>
                        <span style={{background: typeConfig.bg, color: typeConfig.color, padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'}}>
                            {typeConfig.name}
                        </span>
                        <span style={{background: '#eee', color: '#555', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'}}>
                            {natureName}性格
                        </span>
                    </div>

                    {/* 🔥 6维属性预览 (补全了物防/特防) */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', 
                        background: '#f8f9fa', padding: '12px', borderRadius: '16px'
                    }}>
                        {[
                            { l: 'HP', v: stats.maxHp, c: '#4CAF50' },
                            { l: '速度', v: stats.spd, c: '#FF9800' },
                            { l: '物攻', v: stats.p_atk, c: '#F44336' },
                            { l: '物防', v: stats.p_def, c: '#2196F3' },
                            { l: '特攻', v: stats.s_atk, c: '#9C27B0' },
                            { l: '特防', v: stats.s_def, c: '#3F51B5' },
                        ].map((s, idx) => (
                            <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'11px'}}>
                                <span style={{color:'#888', fontWeight:'bold'}}>{s.l}</span>
                                <span style={{color: s.c, fontWeight:'900'}}>{s.v}</span>
                            </div>
                        ))}
                    </div>

                    <button style={{
                        marginTop: '15px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                        background: '#333', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        就决定是你了！
                    </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{marginTop: '30px', color: 'rgba(255,255,255,0.5)', fontSize: '12px'}}>
            * 数值受性格与个体值影响，所见即所得
        </div>
      </div>
    );
  };

   // ==========================================
  // [优化版] 通用进化树逻辑 (显示清晰的中文条件)
  // ==========================================
  const getFamilyTree = (currentId) => {
    // 1. 向上追溯找到始祖 (Root)
    let rootId = currentId;
    let hasParent = true;
    const visited = new Set(); 

    while (hasParent) {
        if (visited.has(rootId)) break;
        visited.add(rootId);
        hasParent = false;

        // A. 检查等级/条件进化来源
        const levelParent = POKEDEX.find(p => p.evo === rootId);
        if (levelParent) {
            rootId = levelParent.id;
            hasParent = true;
            continue;
        }

        // B. 检查进化石来源
        const stoneParentId = Object.keys(STONE_EVO_RULES).find(baseId => {
            const targets = Object.values(STONE_EVO_RULES[baseId]);
            return targets.includes(rootId);
        });
        if (stoneParentId) {
            rootId = parseInt(stoneParentId);
            hasParent = true;
            continue;
        }
    }

    const rootPet = POKEDEX.find(p => p.id === rootId);
    if (!rootPet) return null;

    // 2. 向下查找子代 (生成显示文本)
    const getChildren = (parentId) => {
        let children = [];
        const parent = POKEDEX.find(p => p.id === parentId);
        if (!parent) return children;

        // A. 等级/特殊条件进化
        if (parent.evo) {
            const levelChild = POKEDEX.find(p => p.id === parent.evo);
            if (levelChild) {
                let methodText = `Lv.${parent.evoLvl}`;
                
                // 🔥 智能识别特殊条件，显示中文
                if (parent.evoCondition) {
                    const c = parent.evoCondition;
                    if (c.time === 'DAY') methodText = '☀️白天升级';
                    else if (c.time === 'NIGHT') methodText = '🌙夜晚升级';
                    else if (c.time === 'DUSK') methodText = '🌇黄昏升级';
                    else if (c.weather === 'RAIN') methodText = '🌧️雨天升级';
                    else if (c.intimacy) methodText = '❤️亲密升级';
                }

                children.push({ 
                    ...levelChild, 
                    method: methodText 
                });
            }
        }

        // B. 进化石分支
        const stoneRules = STONE_EVO_RULES[parentId];
        if (stoneRules) {
            Object.entries(stoneRules).forEach(([stoneKey, targetId]) => {
                const targetPet = POKEDEX.find(p => p.id === targetId);
                const stoneItem = EVO_STONES[stoneKey];
                if (targetPet) {
                    children.push({ 
                        ...targetPet, 
                        // 🔥 修改点：优先显示道具中文名，避免歧义
                        method: stoneItem ? stoneItem.name : '特殊道具' 
                    });
                }
            });
        }
        return children;
    };

    const stage1 = getChildren(rootId);
    let stage2 = [];
    stage1.forEach(child => {
        const grandChildren = getChildren(child.id);
        grandChildren.forEach(gc => stage2.push({ ...gc, parentId: child.id }));
    });

    return { root: rootPet, stage1, stage2 };
  };

  const renderPokedex = () => {
    const total = POKEDEX.length;
    const caughtCount = caughtDex.length;
    const progress = Math.floor((caughtCount / total) * 100);
    const filteredDex = POKEDEX.filter(p => {
      if (dexFilter === 'caught') return caughtDex.includes(p.id);
      if (dexFilter === 'missing') return !caughtDex.includes(p.id);
      return true;
    });

    const selectedPet = selectedDexId ? POKEDEX.find(p => p.id === selectedDexId) : null;

    const syncDexData = () => {
      if (confirm("确定要将图鉴重置为【当前持有的精灵】吗？\n(这将清除已放生精灵的记录)")) {
        const currentIds = new Set([...party.map(p=>p.id), ...box.map(p=>p.id)]);
        setCaughtDex(Array.from(currentIds));
        alert("✅ 图鉴数据已修复！");
      }
    };

    return (
      <div className="screen dex-screen">
        <div className="nav-header glass-panel">
          <button className="btn-back" onClick={() => setView('menu')}>🔙 返回</button>
          <div className="nav-title">精灵图鉴</div>
          <button className="btn-icon-only" onClick={syncDexData} style={{fontSize:'18px'}} title="修复图鉴数据">🔄</button>
        </div>
        
        <div className="dex-container">
          <div className="dex-dashboard">
            <div className="dex-progress-circle">
              <div className="dex-progress-inner"><div>{progress}%</div><div className="dex-progress-label">完成度</div></div>
            </div>
            <div className="dex-stats-text">
              <div className="dex-stats-title">收集进度</div>
              <div className="dex-stats-subtitle">已捕获: {caughtCount} / {total}</div>
            </div>
          </div>
          
          <div className="dex-filters">
            <div className={`filter-chip ${dexFilter==='all'?'active':''}`} onClick={()=>setDexFilter('all')}>全部</div>
            <div className={`filter-chip ${dexFilter==='caught'?'active':''}`} onClick={()=>setDexFilter('caught')}>已捕获</div>
            <div className={`filter-chip ${dexFilter==='missing'?'active':''}`} onClick={()=>setDexFilter('missing')}>未捕获</div>
          </div>
          
                    <div className="dex-grid-refined">
            {filteredDex.map(pet => {
              const isCaught = caughtDex.includes(pet.id);
              return (
                <div key={pet.id} className={`dex-item ${isCaught ? 'caught' : 'missing'}`} onClick={() => isCaught && setSelectedDexId(pet.id)}>
                  <div className="dex-item-id">#{String(pet.id).padStart(3, '0')}</div>
                  <div className="dex-item-icon">{renderAvatar(pet)}</div>
                  <div className="dex-item-name">{isCaught ? pet.name : '???'}</div>
                  {isCaught && <div className="dex-type-dot" style={{background: TYPES[pet.type]?.color || '#999'}}></div>}
                </div>
              );
            })}
          </div>
        </div>
               {/* 替换 renderPokedex 中原本的 selectedPet 模态框部分 */}
        {selectedPet && (
          <div className="dex-modal-overlay" onClick={() => setSelectedDexId(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
            {/* 🔥 核心修改：宽度改为 340px，增加圆角和阴影，去除 overflow:hidden 以允许头像突出 */}
            <div className="dex-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '340px', background: '#fff', borderRadius: '24px', overflow: 'visible', 
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', paddingBottom: '24px',
              maxHeight: '90vh', overflowY: 'auto'
            }}>
              
              {(() => {
                  // 1. 寻找最强精灵逻辑 (保持不变)
                  const allCaught = [...party, ...box].filter(p => p.id === selectedPet.id);
                  let bestPet = null;
                  let bestScore = -1;
                  let bestGrade = 'B';

                  if (allCaught.length > 0) {
                      allCaught.forEach(p => {
                          const { score, grade } = calculateGrade(p);
                          if (score > bestScore) {
                              bestScore = score;
                              bestPet = p;
                              bestGrade = grade;
                          }
                      });
                 } else {
                      bestPet = { ...selectedPet, level: 1, ivs: {}, nature: null };
                  }

                  const getGradeColor = (g) => {
                      if (g === 'S') return '#FFD700';
                      if (g === 'A') return '#FF4081';
                      if (g === 'B') return '#2196F3';
                      return '#9E9E9E';
                  };
                  const gradeColor = getGradeColor(bestGrade);

                  return (
                      <>
                        {/* 顶部背景 (渐变色) */}
                        <div style={{
                            width: '100%', height: '110px', flexShrink: 0,
                            background: 'linear-gradient(180deg, #E0C3FC 0%, #C2E9FB 100%)', 
                            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                            position: 'absolute', top: 0, left: 0, zIndex: 0
                        }}></div>

                        {/* 评级印章 (右上角) */}
                        {allCaught.length > 0 && (
                            <div style={{
                                position:'absolute', right:'20px', top:'20px', 
                                fontSize:'32px', fontWeight:'900', color: gradeColor,
                                border: `3px solid ${gradeColor}`, borderRadius:'50%', width:'50px', height:'50px',
                                display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(15deg)',
                                background:'#fff', zIndex: 10, boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                {bestGrade}
                            </div>
                        )}

                        {/* 头像 (悬浮设计) */}
                        <div style={{
                            width: '90px', height: '90px', background: '#fff', borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '55px',
                            marginTop: '65px', zIndex: 1, position: 'relative',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '5px'
                        }}>
                            {renderAvatar(bestPet)}
                        </div>

                        {/* 基础信息 */}
                        <div style={{textAlign: 'center', marginTop: '10px', zIndex: 1, width: '100%', flexShrink: 0}}>
                            <div style={{color: '#999', fontSize: '13px', fontWeight: '600', letterSpacing: '1px'}}>
                            #{String(selectedPet.id).padStart(3, '0')}
                            </div>
                            <div style={{fontSize: '24px', fontWeight: '800', color: '#333', margin: '4px 0'}}>
                            {selectedPet.name}
                            </div>
                            <div style={{
                                display: 'inline-block', 
                                background: TYPES[selectedPet.type]?.color || '#7038F8', 
                                color: '#fff', padding: '4px 16px', borderRadius: '20px', 
                                fontSize: '12px', fontWeight: 'bold'
                            }}>
                                {TYPES[selectedPet.type]?.name}
                            </div>
                            {allCaught.length > 0 && (
                                <div style={{fontSize:'10px', color:'#666', marginTop:'5px'}}>
                                    展示的是你拥有的最强个体 (Lv.{bestPet.level})
                                </div>
                            )}
                        </div>

                        {/* 属性条 (紧凑版) */}
                        <div style={{width: '100%', padding: '20px 30px 10px'}}>
                            {(() => {
                                const currentStats = getStats(bestPet);
                                const growth = 1 + bestPet.level * 0.05;
                                
                                // 获取种族值逻辑 (简化版，直接用你代码里的逻辑)
                                const baseInfo = POKEDEX.find(p => p.id === bestPet.id) || POKEDEX[0];
                                const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                                const diversity = (baseInfo.id % 5) * 2 - 4;
                                const getBase = (k) => {
                                    if (k === 'hp') return baseInfo.hp || 60;
                                    if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
                                    const bAtk = baseInfo.atk || 50;
                                    const bDef = baseInfo.def || 50;
                                    if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
                                    if (k === 'p_def') return Math.floor(bDef * bias.p);
                                    if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
                                    if (k === 's_def') return Math.floor(bDef * bias.s);
                                    return 50;
                                };

                                const configs = [
                                    {k:'maxHp', n:'HP'}, {k:'p_atk', n:'物攻'}, {k:'p_def', n:'物防'},
                                    {k:'s_atk', n:'特攻'}, {k:'s_def', n:'特防'}, {k:'spd',   n:'速度'}
                                ];

                                return configs.map(cfg => {
                                    const key = cfg.k === 'maxHp' ? 'hp' : cfg.k;
                                    const currVal = currentStats[cfg.k];
                                    let maxStat = (getBase(key) + 31) * growth;
                                    if (key === 'hp') maxStat = maxStat * 2.5;
                                    
                                    const pct = Math.min(100, (currVal / maxStat) * 100);
                                    const color = pct >= 80 ? '#FFD700' : (pct >= 50 ? '#FF4081' : '#2196F3');

                                    return (
                                        <div key={cfg.k} style={{display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '12px'}}>
                                            <div style={{width: '32px', color: '#666', fontWeight: '600', textAlign:'left'}}>{cfg.n}</div>
                                            <div style={{flex: 1, height: '8px', background: '#F0F0F0', borderRadius: '4px', margin: '0 10px', position:'relative', overflow:'hidden'}}>
                                                <div style={{width: `${pct}%`, background: color, height: '100%'}}></div>
                                            </div>
                                            <div style={{width: '40px', textAlign: 'right', fontWeight: 'bold', color: '#333'}}>{currVal}</div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                      </>
                  );
              })()}

              <div style={{fontSize:'10px', color:'#ccc', marginBottom:'10px'}}>
                 *金色部分代表因闪光/性格/个体值获得的突破属性
              </div>

              {/* 进化家族 (紧凑横向版) */}
              {(() => {
                  const family = getFamilyTree(selectedPet.id);
                  if (!family || (family.stage1.length === 0)) return null;

                  const EvoNode = ({ pet, method }) => {
                      const isCaught = caughtDex.includes(pet.id);
                      const isCurrent = pet.id === selectedPet.id;
                      return (
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'0 5px'}}>
                              {method && <div style={{fontSize:'9px', color:'#aaa', marginBottom:'2px'}}>{method}</div>}
                              <div 
                                onClick={() => isCaught && setSelectedDexId(pet.id)}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: isCaught ? 'pointer' : 'default'
                                }}
                              >
                                 {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                              </div>
                          </div>
                      );
                  };

                  return (
                    <div style={{
                        width: '90%', padding: '15px 10px', 
                        background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                        marginTop:'5px'
                    }}>
                      <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                         <EvoNode pet={family.root} />
                         {family.stage1.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                         {family.stage2.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                      </div>
                    </div>
                  );
              })()}

              {/* 底部关闭按钮 */}
              <button 
                onClick={() => setSelectedDexId(null)} 
                style={{
                  width: '85%', padding: '12px', background: '#F5F7FA', border: 'none', borderRadius: '12px',
                  fontSize: '14px', color: '#666', cursor: 'pointer', fontWeight: '600',
                  marginTop: 'auto', marginBottom: '5px', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#E4E7EB'}
                onMouseOut={(e) => e.target.style.background = '#F5F7FA'}
              >
                关闭
              </button>

            </div>
          </div>
        )}


      </div>
    );
  };

    // ==========================================
  // 5. [修复] 技能大全 (图4修复 - 按钮文字)
  // ==========================================
  const renderSkillDex = () => {
    const filteredSkills = allSkills.filter(s => {
      const matchType = skillFilter === 'ALL' || s.t === skillFilter || (skillFilter === 'STATUS' && s.category === 'status');
      const matchSearch = s.name.includes(skillSearchTerm);
      return matchType && matchSearch;
    });
    return (
      <div className="screen dex-screen" style={{background: '#1a1a2e'}}>
        <div className="nav-header glass-panel" style={{background: 'rgba(30,30,40,0.9)', borderBottom:'1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px'}}>
          <button className="btn-back" onClick={() => setView('menu')} style={{color: '#fff', background: 'transparent', border: '1px solid #555', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px'}}>🔙 返回</button>
          <div className="nav-title" style={{color:'#fff', fontSize: '18px', fontWeight: 'bold'}}>技能大百科</div>
          <div style={{width: 60}}></div>
        </div>
        <div className="dex-filters" style={{background: '#16213e', borderBottom: '1px solid #333', padding: '15px'}}>
          <input type="text" placeholder="🔍 搜索技能名称..." value={skillSearchTerm} onChange={e => setSkillSearchTerm(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#0f3460', color: '#fff', marginBottom: '10px'}}/>
          <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px'}}>
            <div className={`filter-chip ${skillFilter==='ALL'?'active':''}`} onClick={()=>setSkillFilter('ALL')}>全部</div>
            <div className={`filter-chip ${skillFilter==='STATUS'?'active':''}`} onClick={()=>setSkillFilter('STATUS')} style={{background:'#9C27B0', borderColor:'#9C27B0', color:'#fff'}}>变化系</div>
            {Object.keys(TYPES).map(t => (<div key={t} className={`filter-chip ${skillFilter===t?'active':''}`} onClick={()=>setSkillFilter(t)} style={skillFilter===t ? {background: TYPES[t].color, borderColor: TYPES[t].color, color:'#fff'} : {}}>{TYPES[t].name}</div>))}
          </div>
        </div>
        <div className="dex-grid-refined" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', padding: '20px', gap: '15px'}}>
          {filteredSkills.map((skill, idx) => (
            <div key={idx} className="skill-card-pro" style={{borderLeft: `4px solid ${TYPES[skill.t]?.color}`}}>
              <div className="skill-card-header"><span className="skill-name">{skill.name}</span><span className="skill-type-badge" style={{background: TYPES[skill.t]?.color}}>{TYPES[skill.t]?.name}</span></div>
              <div className="skill-card-stats">
                <div className="stat-pill"><span className="label">威力</span><span className="val" style={{color: skill.p > 0 ? '#FF5252' : '#999'}}>{skill.p > 0 ? skill.p : '-'}</span></div>
                <div className="stat-pill"><span className="label">PP</span><span className="val">{skill.pp}</span></div>
                <div className="stat-pill"><span className="label">分类</span><span className="val">{skill.category === 'status' ? '变化' : '物理/特殊'}</span></div>
              </div>
              {skill.desc && <div className="skill-desc">{skill.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };


const renderMenu = () => {
  const resetGame = () => {
    if (confirm("⚠️ 警告：确定要删除所有存档并重新开始吗？")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className="screen happy-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      
      {/* 背景装饰：漂浮的圆圈 */}
      <div className="floating-shape" style={{width: 200, height: 200, top: '10%', left: '10%', animation: 'float 6s infinite'}}></div>
      <div className="floating-shape" style={{width: 150, height: 150, bottom: '20%', right: '15%', animation: 'float 8s infinite reverse'}}></div>
      
      {/* 跑动的装饰 (可以用 Emoji 或图片) */}
      <div style={{
          position: 'absolute', bottom: '10%', fontSize: '60px', 
          animation: 'run-across 15s linear infinite', zIndex: 1
      }}>⚡️🐕</div>

      <div className="menu-content-pro" style={{
          textAlign: 'center', zIndex: 10, width: '90%', maxWidth: '420px', 
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
          padding: '40px', borderRadius: '30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 0 0 5px rgba(255,255,255,0.5)',
          animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        
        {/* LOGO 区域 */}
        <div style={{marginBottom: '40px', transform: 'rotate(-2deg)'}}>
          <div style={{
              fontSize: '56px', fontWeight: '900', color: '#FFD700', 
              textShadow: '4px 4px 0px #3B4CCA, 8px 8px 0px rgba(0,0,0,0.2)', 
              letterSpacing: '2px', fontFamily: 'Arial Black, sans-serif',
              animation: 'float 3s ease-in-out infinite'
          }}>
            POKÉMON
          </div>
          <div style={{
              fontSize: '16px', color: '#3B4CCA', fontWeight: 'bold', 
              letterSpacing: '6px', marginTop: '-5px', textTransform: 'uppercase',
              background: '#fff', display: 'inline-block', padding: '2px 10px', borderRadius: '10px'
          }}>
            Legends RPG
          </div>
        </div>

        {/* 主按钮 */}
        <button onClick={handleStartGame} style={{
            width: '100%', padding: '20px', borderRadius: '50px', border: 'none', 
            background: 'linear-gradient(180deg, #4FC3F7 0%, #2196F3 100%)', 
            boxShadow: '0 10px 20px rgba(33, 150, 243, 0.4), inset 0 2px 0 rgba(255,255,255,0.4)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
            transition: 'transform 0.1s', animation: 'pulse-glow 2s infinite'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <span style={{fontSize: '32px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'}}>🚀</span>
            <div style={{textAlign: 'left'}}>
                <div style={{fontSize: '20px', fontWeight: '900', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}>
                    {hasSave ? '继续冒险' : '开始新游戏'}
                </div>
                <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '500'}}>
                    {hasSave ? '读取上次的进度' : '踏上全新的旅程'}
                </div>
            </div>
        </button>

        {/* 次级按钮网格 */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'}}>
            <button onClick={() => setView('pokedex')} style={{
                padding: '15px', borderRadius: '20px', border: 'none', 
                background: '#FFF3E0', color: '#F57C00', cursor: 'pointer', 
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                boxShadow: '0 5px 0 #FFE0B2', transition: 'transform 0.1s'
            }}>
                <span style={{fontSize: '28px', marginBottom: '5px'}}>📖</span>
                <span style={{fontSize: '14px', fontWeight: 'bold'}}>图鉴</span>
            </button>
            <button onClick={() => setView('skill_dex')} style={{
                padding: '15px', borderRadius: '20px', border: 'none', 
                background: '#E3F2FD', color: '#1976D2', cursor: 'pointer', 
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                boxShadow: '0 5px 0 #BBDEFB', transition: 'transform 0.1s'
            }}>
                <span style={{fontSize: '28px', marginBottom: '5px'}}>⚡</span>
                <span style={{fontSize: '14px', fontWeight: 'bold'}}>技能</span>
            </button>
        </div>

        <div onClick={resetGame} style={{
            marginTop: '30px', color: '#aaa', fontSize: '12px', cursor: 'pointer', 
            textDecoration: 'underline', opacity: 0.6
        }}>
            重置存档 (Fix Data)
        </div>
      </div>
    </div>
  );
};

   // ==========================================
  // [修改] 渲染世界地图 (优化：天气下沉到卡片)
  // ==========================================
  const renderWorldMap = () => {
    // ... (原有的 enterDungeon 逻辑保持不变) ...
    const enterDungeon = (dungeon) => {
      if (dungeon.id === 'safari_zone') {
        if (party[0].level < 100) { alert("⛔ 权限不足！\n狩猎地带仅对顶尖训练家开放。\n要求：首发精灵等级达到 Lv.100"); return; }
        if (badges.length < 8) { alert(`⛔ 权限不足！\n你需要收集全部 8 枚徽章才能进入狩猎地带。\n当前进度: ${badges.length}/8`); return; }
        alert("🎉 欢迎来到狩猎地带！\n这里充满了传说中的神兽和稀有精灵！");
        startBattle({ id: 997, name: '狩猎地带', lvl: [90, 100], pool: [], drop: 1000 }, 'safari');
        return;
      }
      if (party[0].level < dungeon.recLvl) { alert(`等级不足！建议等级: Lv.${dungeon.recLvl}`); return; }
      if (dungeon.restriction === 'min_lvl_60') { if (party.some(p => p.level < 60)) { alert("⛔ 队伍中所有精灵必须 > Lv.60"); return; } }
      if (dungeon.restriction === 'solo_run') { if (party.length > 1) { alert("⛔ 只能携带 1 只精灵"); return; } }
      if (dungeon.restriction === 'entry_fee') { if (gold < 5000) { alert("⛔ 金币不足 5000"); return; } if (confirm("支付 5000 金币入场？")) setGold(g => g - 5000); else return; }
      if (dungeon.restriction === 'lucky_nature') { const lucky = ['naive', 'hasty', 'quirky', 'serious', 'hardy']; if (!lucky.includes(party[0].nature)) { alert("⛔ 首发精灵性格必须是幸运类"); return; } }

      if (dungeon.type === 'gold') startBattle({ id: 999, name: '黄金矿洞', lvl: [30, 40], pool: [52], drop: 2000 }, 'wild'); 
      else if (dungeon.type === 'exp') startBattle({ id: 998, name: '经验乐园', lvl: [20, 50], pool: [113], drop: 100 }, 'wild'); 
      else if (dungeon.type === 'stone') startBattle({ id: 996, name: '元素之塔', lvl: [40, 50], pool: [126, 127, 128, 129, 130, 196, 197], drop: 500 }, 'dungeon_stone');
      else if (dungeon.type === 'stat') startBattle({ id: 995, name: '英雄试炼', lvl: [60, 65], pool: [63, 106, 138, 183, 214, 270], drop: 800 }, 'dungeon_stat');
      else if (dungeon.type === 'gold_pro') startBattle({ id: 994, name: '豪宅金库', lvl: [50, 60], pool: [118, 119, 364], drop: 15000 }, 'wild'); 
      else if (dungeon.type === 'shiny_hunt') startBattle({ id: 993, name: '闪光山谷', lvl: [80, 90], pool: [147, 148, 151, 244, 299], drop: 1000 }, 'dungeon_shiny');
      else if (dungeon.type === 'infinity') enterInfinityCastle();
    };

    // --- 🔥 获取当前时间信息 ---
    const timeInfo = TIME_PHASES[timePhase];

    return (
      <div className="screen map-screen">
        {/* 顶部导航 */}
        <div className="nav-header glass-panel">
          <button className="btn-back" onClick={() => setView('menu')}>🔙 返回</button>
          <div className="nav-title">冒险地图</div>
          <div className="nav-coin">💰 {gold}</div>
        </div>
        
        {/* 🔥 [修改] 顶部仪表盘：只显示时间，移除天气 🔥 */}
        <div style={{
            margin: '10px 20px 0',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.5)'
        }}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                {/* 时间显示 (放大显示) */}
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'28px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{timeInfo.icon}</span>
                    <div>
                        <div style={{fontSize:'10px', color:'#888', fontWeight:'bold', textTransform:'uppercase'}}>World Time</div>
                        <div style={{fontSize:'16px', fontWeight:'bold', color:'#333'}}>{timeInfo.name}</div>
                    </div>
                </div>
            </div>

            {/* 右侧提示改为时间相关 */}
            <div style={{fontSize:'11px', color:'#666', fontStyle:'italic', textAlign:'right'}}>
                {timePhase === 'DAY' ? '阳光明媚，适合冒险' : (timePhase === 'DUSK' ? '天色渐晚，注意安全' : '深夜是幽灵活跃的时刻...')}
            </div>
        </div>

        {/* --- 导航胶囊 --- */}
        <div className="map-nav-container" style={{display: 'flex', justifyContent: 'center', margin: '20px 0 25px 0', position: 'relative', zIndex: 10}}>
          <div className="glass-capsule" style={{background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', padding: '6px', borderRadius: '50px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)', border: '1px solid rgba(255, 255, 255, 0.4)', display: 'flex', gap: '8px'}}>
            {[
              { id: 'maps', icon: '🗺️', label: '区域探索', color: '#2196F3' },
              { id: 'dungeons', icon: '⚔️', label: '特殊副本', color: '#9C27B0' },
              { id: 'challenges', icon: '🔥', label: '挑战之路', color: '#FF5722' },
              { id: 'sects', icon: '🏔️', label: '门派顶峰', color: '#009688' }
            ].map(tab => {
              const isActive = mapTab === tab.id || (tab.id === 'sects' && view === 'sect_summit');
              return (
                <div key={tab.id} onClick={() => { if (tab.id === 'sects') setView('sect_summit'); else { setMapTab(tab.id); if (view === 'sect_summit') setView('world_map'); } }}
                  style={{padding: '10px 24px', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s', background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` : 'transparent', color: isActive ? '#fff' : '#666', fontWeight: isActive ? 'bold' : '500', boxShadow: isActive ? `0 4px 15px ${tab.color}66` : 'none', transform: isActive ? 'scale(1.05)' : 'scale(1)'}}>
                  <span style={{fontSize: '18px'}}>{tab.icon}</span><span style={{fontSize: '15px'}}>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- 地图列表 --- */}
        <div className="map-grid-container" style={{display: mapTab==='maps'?'grid':'none', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px'}}>
          {MAPS.map((m, index) => {
            const isCleared = badges.includes(m.badge);
            const progress = mapProgress[m.id] || 0;
            const gymLeaderInfo = POKEDEX.find(p => p.id === m.gymLeader);
            
            // 🔥 [新增] 获取该地图的独立天气
            const mapWeatherKey = mapWeathers[m.id] || 'CLEAR';
            const mapWeatherInfo = WEATHERS[mapWeatherKey];
            
            let isLocked = false;
            let lockReason = "";
            
            if (m.id === 99) {
                if (completedChallenges.includes('ECLIPSE_HQ_CLEARED')) {
                    return (
                        <div key={m.id} className="map-card-pro theme-bg-locked" style={{filter: 'grayscale(100%)', opacity: 0.6, cursor:'not-allowed'}}>
                            <div className="map-lock-mask" style={{background:'rgba(0,0,0,0.6)', color:'#fff'}}>
                                <div style={{fontSize:'30px', marginBottom:'5px'}}>🏚️</div>
                                <div>日蚀要塞 (已摧毁)</div>
                            </div>
                        </div>
                    );
                }
                if (badges.length < 8) { isLocked = true; lockReason = "需收集 8 枚徽章"; }
            } else if (index > 0) {
              const prevMap = MAPS[index - 1];
              if (m.id === 9 && !completedChallenges.includes('ECLIPSE_HQ_CLEARED')) { isLocked = true; lockReason = "需摧毁【日蚀要塞】"; }
              else if (!badges.includes(prevMap.badge)) { isLocked = true; lockReason = `需通关【${prevMap.name}】`; }
            }

            const themeClass = isLocked ? 'theme-bg-locked' : `theme-bg-${m.type}`;

            return (
              <div key={m.id} className={`map-card-pro hover-scale ${themeClass}`} onClick={() => { if (isLocked) alert(`🔒 该区域尚未解锁！\n\n${lockReason}`); else enterMap(m.id); }}>
                {isLocked && <div className="map-lock-mask"><div style={{fontSize:'24px', marginBottom:'5px'}}>🔒</div><div style={{fontSize:'12px'}}>{lockReason}</div></div>}
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', zIndex: 2}}>
                    <div>
                        <div style={{fontSize:'18px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'6px', textShadow:'0 2px 4px rgba(0,0,0,0.2)'}}>
                            {m.icon} {m.name}
                        </div>
                        
                        {/* 🔥 [修改] 在这里添加天气胶囊 🔥 */}
                        <div style={{marginTop:'6px', display:'flex', gap:'6px', flexWrap:'wrap'}}>
                           <span style={{fontSize:'11px', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(2px)', padding:'2px 8px', borderRadius:'10px', color:'#fff'}}>
                               Lv.{m.lvl[0]}-{m.lvl[1]}
                           </span>
                           
                           {/* 天气显示 */}
                           {!isLocked && (
                               <span style={{
                                   fontSize:'11px', 
                                   background: mapWeatherKey === 'CLEAR' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', 
                                   color: '#fff', 
                                   padding:'2px 8px', borderRadius:'10px', 
                                   display:'flex', alignItems:'center', gap:'4px',
                                   border: '1px solid rgba(255,255,255,0.3)'
                               }}>
                                   {mapWeatherInfo.icon} {mapWeatherInfo.name}
                               </span>
                           )}
                        </div>
                    </div>
                    
                    {isCleared && <div style={{background:'#fff', color:'#4CAF50', padding:'2px 6px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'}}>CLEAR</div>}
                </div>
                
                <div style={{marginTop:'auto', zIndex: 2}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'4px', opacity:0.9}}><span>镇守: {gymLeaderInfo?.name || '???'}</span><span>{progress}%</span></div>
                    <div style={{height:'4px', background:'rgba(0,0,0,0.2)', borderRadius:'2px', overflow:'hidden'}}><div style={{width: `${progress}%`, background:'#fff', height:'100%'}}></div></div>
                </div>
                <div style={{position:'absolute', right:'-10px', bottom:'-15px', fontSize:'90px', opacity:0.15, pointerEvents:'none', transform: 'rotate(-10deg)'}}>{m.icon}</div>
              </div>
            );
          })}
        </div>

        {/* --- 副本列表 (保持不变) --- */}
        <div className="dungeon-list" style={{display: mapTab==='dungeons'?'flex':'none', flexDirection:'column', gap:'12px'}}>
             {DUNGEONS.map(d => {
             let runner = '🏃'; let particle = '✨';
             if (d.type === 'gold' || d.type === 'gold_pro') { runner = '🤠'; particle = '💰'; }
             else if (d.type === 'exp') { runner = '🤓'; particle = '📚'; }
             else if (d.type === 'catch') { runner = '🦁'; particle = '🍃'; }
             else if (d.type === 'stone') { runner = '🧙‍♂️'; particle = '🔮'; }
             else if (d.type === 'stat') { runner = '🥋'; particle = '💪'; }
             else if (d.type === 'shiny_hunt') { runner = '😎'; particle = '✨'; }
             else if (d.type === 'infinity') { runner = '🥷'; particle = '👻'; }

             return (
             <div key={d.id} className="dungeon-card" onClick={() => enterDungeon(d)} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', background: '#fff', borderRadius: '16px', borderLeft: `6px solid ${d.color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'}} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.01)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
               <div style={{display: 'flex', alignItems: 'center', gap: '15px', width: '280px', flexShrink: 0}}>
                   <div className="dungeon-icon-wrapper" style={{background: d.color, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: '#fff', flexShrink: 0, boxShadow: `0 4px 10px ${d.color}66`}}>{d.icon}</div>
                   <div className="dungeon-info"><div className="dungeon-name" style={{fontSize: '16px', fontWeight: 'bold', color: '#333'}}>{d.name}</div><div className="dungeon-desc" style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>{d.desc}</div><div className="dungeon-req" style={{fontSize: '11px', color: '#999', marginTop: '2px', background:'#f0f0f0', display:'inline-block', padding:'2px 6px', borderRadius:'4px'}}>推荐 Lv.{d.recLvl}</div></div>
               </div>
               <div className="dungeon-middle-stage"><div className="anim-runner" style={{animationDelay: '0s'}}>{runner}</div><div className="anim-particle" style={{left: '20%', animationDelay: '0.5s'}}>{particle}</div><div className="anim-particle" style={{left: '50%', animationDelay: '1.2s', fontSize:'10px'}}>{particle}</div><div className="anim-particle" style={{left: '80%', animationDelay: '2.5s'}}>{particle}</div></div>
               <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '20px', paddingRight: '20px', borderRight: '1px dashed #eee', minWidth: '180px'}}>
                  <div style={{fontSize: '10px', color: '#aaa', marginBottom: '5px', fontWeight: 'bold', letterSpacing:'1px'}}>REWARD PREVIEW</div>
                  <div style={{display: 'flex', gap: '8px'}}>{d.rewards && d.rewards.map((r, idx) => (<div key={idx} style={{background: '#fafafa', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', color: '#555', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500'}}><span style={{fontSize:'12px'}}>{r.icon}</span><span>{r.text}</span></div>))}</div>
               </div>
               <button className="btn-enter-dungeon" style={{background: `linear-gradient(135deg, ${d.color}, ${d.color}dd)`, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: `0 4px 15px ${d.color}44`, flexShrink: 0}}>进入</button>
             </div>
           )})}
        </div>

        {/* --- 挑战之路 (保持不变) --- */}
        <div className="challenge-grid-new" style={{display: mapTab==='challenges'?'grid':'none', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px'}}>
          {CHALLENGES.map(c => {
            const currentCaught = caughtDex.length;
            const isUnlocked = currentCaught >= c.req;
            const isCleared = completedChallenges.includes(c.id);
            const progressPct = Math.min(100, (currentCaught / c.req) * 100);
            const bossInfo = POKEDEX.find(p => p.id === c.boss);
            return (
              <div key={c.id} className="chal-card-pro hover-scale" style={{opacity: isUnlocked ? 1 : 0.8}}>
                <div className="chal-pro-header"><div style={{fontWeight:'bold', color: isUnlocked ? c.color : '#999', fontSize:'15px'}}>{c.title}</div>{isCleared ? (<span style={{fontSize:'10px', background:'#4CAF50', color:'#fff', padding:'2px 8px', borderRadius:'10px'}}>✅ 已通关</span>) : (<span style={{fontSize:'10px', background: isUnlocked ? '#FF9800' : '#ddd', color:'#fff', padding:'2px 8px', borderRadius:'10px'}}>{isUnlocked ? '🔥 进行中' : '🔒 未解锁'}</span>)}</div>
                <div className="chal-pro-body"><div className="chal-boss-box" style={{borderColor: c.color}}>{bossInfo?.emoji}</div><div style={{flex:1}}><div style={{fontSize:'12px', color:'#666', marginBottom:'8px', lineHeight:'1.4'}}>{c.desc}</div><div style={{fontSize:'10px', display:'flex', justifyContent:'space-between', color:'#888', marginBottom:'2px'}}><span>解锁进度</span><span>{currentCaught}/{c.req}</span></div><div className="chal-progress-bar"><div className="chal-progress-fill" style={{width: `${progressPct}%`, background: isUnlocked ? c.color : '#ccc'}}></div></div></div></div>
                <button onClick={() => isUnlocked && startBattle(null, 'challenge', c.id)} disabled={!isUnlocked} style={{width:'100%', padding:'12px', border:'none', background: isUnlocked ? `linear-gradient(90deg, ${c.color}, ${c.color}dd)` : '#f0f0f0', color: isUnlocked ? '#fff' : '#aaa', fontWeight: 'bold', cursor: isUnlocked ? 'pointer' : 'not-allowed', marginTop: 'auto'}}>{isUnlocked ? (isCleared ? '再次挑战' : '开始挑战') : `需收集 ${c.req} 只精灵`}</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

   // ==========================================
  // [修复 & 美化] 左侧面板：用户信息与首发精灵
  // ==========================================
  const renderLeftPanel = () => {
    const leader = party[0];
    const stats = leader ? getStats(leader) : null;
    const hpPercent = leader ? (leader.currentHp / stats.maxHp) * 100 : 0;
    
    // 获取当前首发精灵的属性颜色 (如果没有则默认灰色)
    const typeColor = leader && TYPES[leader.type] ? TYPES[leader.type].color : '#9E9E9E';

    return (
      <div className="side-panel left-panel" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
         
         {/* 1. 训练家卡片 (已修复重复问题) */}
         <div className="panel-card" style={{
             textAlign:'center', padding:'20px 15px', background:'#fff', 
             borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'
         }}>
            {/* 头像区域 */}
            <div style={{position:'relative', width:'70px', height:'70px', margin:'0 auto 10px'}}>
                <div 
                    onClick={() => setShowAvatarSelector(true)}
                    style={{
                        width:'100%', height:'100%', cursor:'pointer', 
                        background:'#f8f9fa', borderRadius:'50%', 
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'40px', border:'3px solid #fff',
                        boxShadow:'0 4px 10px rgba(0,0,0,0.1)',
                        transition:'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#FF9800';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#fff';
                    }}
                    title="点击更换形象"
                >
                    {trainerAvatar}
                </div>
                {/* 编辑小图标 */}
                <div style={{
                    position:'absolute', bottom:'0', right:'0', 
                    background:'#FF9800', color:'#fff', borderRadius:'50%', 
                    width:'20px', height:'20px', fontSize:'12px', 
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:'2px solid #fff', pointerEvents:'none'
                }}>✏️</div>
            </div>

            <div style={{fontWeight:'800', fontSize:'18px', color:'#333', marginBottom:'4px'}}>{trainerName || '训练家'}</div>
            <div style={{
                fontSize:'11px', background:'linear-gradient(90deg, #FF9800, #FF5722)', 
                color:'#fff', padding:'3px 10px', borderRadius:'12px', 
                display:'inline-block', fontWeight:'bold', boxShadow:'0 2px 5px rgba(255,87,34,0.3)'
            }}>
                {currentTitle || '新手上路'}
            </div>
        </div>

        {/* 2. 首发精灵卡片 */}
        {leader && (
            <div className="panel-card" style={{
                padding:'0', background:'#fff', borderRadius:'16px', 
                overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'
            }}>
                {/* 顶部属性条 */}
                <div style={{height:'8px', background: typeColor}}></div>
                
                <div style={{padding:'15px', textAlign:'center'}}>
                    <div style={{fontSize:'48px', filter:'drop-shadow(0 4px 4px rgba(0,0,0,0.1))', animation:'float 3s ease-in-out infinite'}}>
                        {renderAvatar(leader)}
                    </div>
                    <div style={{fontWeight:'bold', fontSize:'16px', marginTop:'5px', color:'#333'}}>
                        {leader.name}
                    </div>
                    <div style={{marginTop:'5px', marginBottom:'10px'}}>
                        <span style={{background:'#333', color:'#fff', fontSize:'10px', padding:'2px 6px', borderRadius:'4px'}}>
                            Lv.{leader.level}
                        </span>
                    </div>

                    {/* HP 条 */}
                    <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'10px', color:'#666', fontWeight:'bold'}}>
                        <span>HP</span>
                        <div style={{flex:1, height:'8px', background:'#eee', borderRadius:'4px', overflow:'hidden'}}>
                            <div style={{
                                width: `${hpPercent}%`, height:'100%', 
                                background: hpPercent > 50 ? '#4CAF50' : (hpPercent > 20 ? '#FF9800' : '#F44336'),
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <span>{Math.floor(leader.currentHp)}/{stats.maxHp}</span>
                    </div>
                </div>
            </div>
        )}

        {/* 3. 背包预览 */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:'12px', color:'#999', marginBottom:'10px', fontWeight:'bold', letterSpacing:'1px'}}>🎒 背包概览</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div style={{background:'#f9f9f9', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#555'}}>
                    <span>🔴</span> {inventory.balls.poke}
                </div>
                <div style={{background:'#f9f9f9', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#555'}}>
                    <span>💊</span> {inventory.meds.potion || 0}
                </div>
                <div style={{gridColumn:'span 2', background:'#FFF8E1', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#F57C00'}}>
                    <span>💰</span> {gold.toLocaleString()}
                </div>
            </div>
        </div>

        {/* 4. 任务目标 */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
             <div style={{fontSize:'12px', color:'#999', marginBottom:'5px', fontWeight:'bold', letterSpacing:'1px'}}>🏆 当前目标</div>
             <div style={{fontSize:'14px', fontWeight:'bold', color:'#333', display:'flex', alignItems:'center', gap:'5px'}}>
                {badges.length < 12 ? (
                    <><span>收集徽章:</span> <span style={{color:'#2196F3'}}>{badges.length} / 12</span></>
                ) : (
                    <span style={{color:'#E91E63'}}>🔥 挑战冠军联盟！</span>
                )}
             </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // [升级版] 右侧面板：地图信息 + 生态扫描 + 日志
  // ==========================================
  const renderRightPanel = () => {
    const currentMap = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const theme = THEME_CONFIG[currentMap.type] || THEME_CONFIG.grass;
    
    // 获取当前地图的精灵分布 (使用 pool 字段)
    const encounters = currentMap.pool || [];
    const totalCount = encounters.length;
    const caughtCount = encounters.filter(id => caughtDex.includes(id)).length;
    const progressPercent = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

    return (
      <div className="side-panel right-panel" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
        
        {/* 1. 地图概况卡片 */}
        <div className="panel-card" style={{
            padding:'20px', background:'#fff', borderRadius:'16px', 
            boxShadow:'0 4px 12px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden',
            borderLeft: `5px solid ${theme.color || '#4CAF50'}`
        }}>
           {/* 背景装饰图标 */}
           <div style={{
               position:'absolute', top:'-10px', right:'-10px', fontSize:'80px', 
               opacity:0.05, pointerEvents:'none', transform:'rotate(-20deg)'
           }}>
               {currentMap.icon}
           </div>
           
           <div style={{position:'relative', zIndex:2}}>
               <div style={{fontSize:'12px', color: theme.color, fontWeight:'bold', letterSpacing:'1px', marginBottom:'5px', textTransform:'uppercase'}}>
                   Current Location
               </div>
               <div style={{fontSize:'22px', fontWeight:'800', color:'#333', display:'flex', alignItems:'center', gap:'8px'}}>
                   {currentMap.name}
               </div>
               <div style={{marginTop:'8px', display:'flex', gap:'8px'}}>
                   <span style={{fontSize:'11px', background:'#f0f2f5', color:'#666', padding:'4px 8px', borderRadius:'6px', fontWeight:'bold'}}>
                       建议 Lv.{currentMap.lvl[0]}-{currentMap.lvl[1]}
                   </span>
                   <span style={{fontSize:'11px', background: theme.bg, color:'#555', padding:'4px 8px', borderRadius:'6px', fontWeight:'bold', border:`1px solid ${theme.color}44`}}>
                       {theme.name || '野外区域'}
                   </span>
               </div>
           </div>
        </div>

        {/* 2. 📍 区域生态 (新增功能) */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
            {/* 标题与进度 */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                <div style={{fontSize:'13px', color:'#333', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
                    <span>🔎</span> 区域生态
                </div>
                <div style={{fontSize:'11px', fontWeight:'bold', color: caughtCount===totalCount ? '#4CAF50' : '#666'}}>
                    {caughtCount} / {totalCount}
                </div>
            </div>
            
            {/* 进度条 */}
            <div style={{height:'4px', background:'#f0f0f0', borderRadius:'2px', marginBottom:'12px', overflow:'hidden'}}>
                <div style={{width:`${progressPercent}%`, background: theme.color || '#4CAF50', height:'100%', transition:'width 0.5s'}}></div>
            </div>

            {encounters.length === 0 ? (
                <div style={{textAlign:'center', padding:'10px', color:'#999', fontSize:'12px', fontStyle:'italic'}}>
                    这里似乎很安静...
                </div>
            ) : (
                <div style={{
                    display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(42px, 1fr))', gap:'8px'
                }}>
                    {encounters.map(pokeId => {
                        const poke = POKEDEX.find(p => p.id === pokeId);
                        if (!poke) return null;
                        const isCaught = caughtDex.includes(pokeId);
                        const typeColor = TYPES[poke.type]?.color || '#ccc';

                        return (
                            <div key={pokeId} 
                                title={isCaught ? `${poke.name} [${TYPES[poke.type]?.name}]` : "???"}
                                style={{
                                    aspectRatio:'1/1', borderRadius:'10px',
                                    background: isCaught ? '#fff' : '#f5f5f5',
                                    border: isCaught ? `1px solid ${typeColor}40` : '1px solid #eee',
                                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                                    position:'relative', cursor:'help', overflow:'hidden',
                                    transition:'transform 0.2s',
                                    boxShadow: isCaught ? `0 2px 5px ${typeColor}20` : 'none'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* 精灵图标 */}
                                <div style={{
                                    fontSize:'22px', 
                                    filter: isCaught ? 'none' : 'grayscale(100%) opacity(0.3) blur(0.5px)',
                                    transition: '0.3s',
                                    // 如果是未发现的，稍微缩小一点增加神秘感
                                    transform: isCaught ? 'scale(1)' : 'scale(0.8)'
                                }}>
                                    {renderAvatar(poke)}
                                </div>

                                {/* 已捕捉标记 (右上角小勾) */}
                                {isCaught && (
                                    <div style={{
                                        position:'absolute', top:'1px', right:'2px', 
                                        fontSize:'8px', color: typeColor
                                    }}>
                                        ✓
                                    </div>
                                )}
                                
                                {/* 底部属性条 (仅已捕捉显示) */}
                                {isCaught && (
                                    <div style={{
                                        position:'absolute', bottom:0, left:0, right:0, 
                                        height:'3px', background: typeColor
                                    }}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* 3. 探索日志 */}
        <div className="panel-card" style={{
            padding:'15px', background:'#fff', borderRadius:'16px', 
            boxShadow:'0 4px 12px rgba(0,0,0,0.05)', flex:1, display:'flex', flexDirection:'column', minHeight:'150px'
        }}>
          <div style={{fontSize:'12px', color:'#999', marginBottom:'10px', fontWeight:'bold', letterSpacing:'1px', display:'flex', justifyContent:'space-between'}}>
              <span>📜 探索日志</span>
              <span style={{fontSize:'10px', cursor:'pointer', color:'#2196F3'}} onClick={() => setGlobalLogs([])}>清空</span>
          </div>
          
          <div className="log-list-container" style={{
              flex:1, overflowY:'auto', maxHeight:'200px', 
              background:'#f8fafc', borderRadius:'8px', padding:'8px',
              border:'1px solid #edf2f7', fontSize:'11px', lineHeight:'1.6'
          }}>
            {globalLogs.length === 0 ? (
                <div style={{textAlign:'center', color:'#ccc', marginTop:'20px'}}>暂无日志</div>
            ) : (
                globalLogs.map((log, i) => (
                <div key={i} style={{marginBottom:'6px', borderBottom:'1px dashed #e2e8f0', paddingBottom:'4px', display:'flex'}}>
                    <span style={{color:'#94a3b8', marginRight:'6px', minWidth:'35px'}}>[{log.time}]</span>
                    <span style={{color:'#475569'}}>{log.msg}</span>
                </div>
                ))
            )}
          </div>
        </div>

        {/* 4. 图例说明 (精简版) */}
        <div className="panel-card" style={{padding:'12px', background:'#fff', borderRadius:'16px'}}>
          <div style={{display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center'}}>
            <LegendItem icon={theme.obstacle} label="障碍" />
            <LegendItem icon={theme.water} label="水域" />
            <LegendItem icon="🎁" label="宝箱" />
            <LegendItem icon="🏥" label="中心" />
            <LegendItem icon="🏪" label="商店" />
          </div>
        </div>
      </div>
    );
  };

  // 辅助组件：图例小胶囊 (放在 RPG 组件内部或外部皆可)
  const LegendItem = ({icon, label}) => (
      <div style={{
          display:'flex', alignItems:'center', gap:'4px', 
          fontSize:'10px', color:'#666', background:'#f1f5f9', 
          padding:'3px 8px', borderRadius:'10px'
      }}>
          <span>{icon}</span> {label}
      </div>
  );
    // ==========================================
  // [完整版] 精灵详情弹窗 (含特性/魅力/亲密度)
  // ==========================================
  const renderPetDetailModal = () => {
    if (!viewStatPet) return null;

    // [新增] 魅力评级颜色映射
    const CHARM_RANK_COLORS = {
        '万人迷': '#FF4081', // S级 - 亮粉
        '人气王': '#FFD700', // A级 - 金色
        '可爱鬼': '#2196F3', // B级 - 蓝色
        '呆萌':   '#8BC34A', // C级 - 绿色
        '凶萌':   '#9E9E9E'  // D级 - 灰色
    };

    return (
        <div className="modal-overlay" onClick={() => setViewStatPet(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="stat-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: '460px',
              maxHeight: '90vh', overflowY: 'auto',
              background: '#fff', borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            
            {/* 评级计算与头部 */}
            {(() => {
                const { grade, leftAvg, rightAvg } = calculateGrade(viewStatPet);
                const getGradeColor = (g) => {
                    if (g === 'S') return '#FFD700';
                    if (g === 'A') return '#FF4081';
                    if (g === 'B') return '#2196F3';
                    return '#9E9E9E';
                };
                const gradeColor = getGradeColor(grade);
                const getScoreColor = (sc) => {
                    if (sc >= 80) return '#FFD700';
                    if (sc >= 50) return '#FF4081';
                    if (sc >= 30) return '#2196F3';
                    return '#9E9E9E';
                };
                const getScoreLetter = (sc) => {
                    if (sc >= 80) return 'S';
                    if (sc >= 50) return 'A';
                    if (sc >= 30) return 'B';
                    return 'C';
                };

                return (
                <>
                {/* 1. 头部信息 */}
                <div style={{padding:'20px 20px 0', display:'flex', alignItems:'center', position:'relative'}}>
                    <div style={{
                        position:'absolute', right:'60px', top:'20px', 
                        fontSize:'40px', fontWeight:'900', color: gradeColor,
                        border: `4px solid ${gradeColor}`, borderRadius:'50%', width:'60px', height:'60px',
                        display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-15deg)',
                        opacity: 0.8, zIndex: 10, background: '#fff'
                    }}>
                        {grade}
                    </div>

                    <div style={{fontSize:'45px', background:'#f5f5f5', borderRadius:'50%', width:'70px', height:'70px', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'15px', overflow:'hidden', padding:'5px'}}>
                        {renderAvatar(viewStatPet)}
                    </div>
                    <div>
                        <div style={{fontSize:'20px', fontWeight:'bold'}}>{viewStatPet.name} {viewStatPet.isShiny && '✨'}</div>
                        <div style={{display:'flex', gap:'6px', marginTop:'5px'}}>
                        <span style={{background: TYPES[viewStatPet.type]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            {TYPES[viewStatPet.type]?.name}
                        </span>
                        <span style={{background:'#333', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            Lv.{viewStatPet.level}
                        </span>
                        
                        <span 
                            title={NATURE_DB[viewStatPet.nature||'docile'].desc}
                            onMouseEnter={() => setStatTooltip('header_nature')}
                            onMouseLeave={() => setStatTooltip(null)}
                            style={{
                                border:'1px solid #ddd', color:'#666', padding:'1px 6px', borderRadius:'4px', 
                                fontSize:'10px', cursor:'help', position:'relative', overflow: 'visible'
                            }}
                        >
                            {NATURE_DB[viewStatPet.nature||'docile'].name}
                            {statTooltip === 'header_nature' && (
                                <div style={{
                                    position: 'absolute', bottom: '125%', left: '50%', transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '6px 10px', borderRadius: '6px',
                                    fontSize: '11px', whiteSpace: 'nowrap', zIndex: 999, pointerEvents: 'none'
                                }}>
                                    {NATURE_DB[viewStatPet.nature||'docile'].desc}
                                </div>
                            )}
                        </span>
                        </div>
                    </div>
                    <button onClick={() => setViewStatPet(null)} style={{marginLeft:'auto', border:'none', background:'transparent', fontSize:'24px', color:'#999'}}>×</button>
                </div>

                {/* 2. 属性对比区域 */}
                <div style={{padding:'20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'12px', fontWeight:'bold', color:'#555'}}>
                        
                        {/* --- 左侧：当前能力 --- */}
                        <div 
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('current_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>当前能力</span>
                            <span style={{color: getScoreColor(leftAvg)}}>{getScoreLetter(leftAvg)}</span>
                            
                            {statTooltip === 'current_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', left: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '10px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#FFD700', marginBottom:'2px'}}>当前属性 / 理论极限</div>
                                    <div style={{color:'#ccc', lineHeight:'1.4'}}>反映该精灵在当前等级下的战斗力水平。</div>
                                </div>
                            )}
                        </div>

                        {/* --- 右侧：成长潜力 --- */}
                        <div 
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('potential_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>成长潜力</span>
                            <span style={{color: getScoreColor(rightAvg)}}>{getScoreLetter(rightAvg)}</span>

                            {statTooltip === 'potential_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', right: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '10px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#00E676', marginBottom:'2px'}}>个体值 (IV) / 31</div>
                                    <div style={{color:'#ccc', lineHeight:'1.4'}}>反映精灵的先天基因优劣。</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        {(() => {
                        const currentStats = getStats(viewStatPet);
                        const nextLvlPet = { ...viewStatPet, level: viewStatPet.level + 1 };
                        const nextStats = getStats(nextLvlPet);
                        const baseInfo = POKEDEX.find(p => p.id === viewStatPet.id) || POKEDEX[0];
                        const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                        const diversity = (baseInfo.id % 5) * 2 - 4;
                        const growth = 1 + viewStatPet.level * 0.05;

                        const getBase = (k) => {
                            if (k === 'hp') return baseInfo.hp || 60;
                            if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
                            const bAtk = baseInfo.atk || 50;
                            const bDef = baseInfo.def || 50;
                            if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
                            if (k === 'p_def') return Math.floor(bDef * bias.p);
                            if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
                            if (k === 's_def') return Math.floor(bDef * bias.s);
                            return 50;
                        };

                        const configs = [
                            {k:'maxHp', n:'HP'}, {k:'p_atk', n:'物攻'}, {k:'p_def', n:'物防'},
                            {k:'s_atk', n:'特攻'}, {k:'s_def', n:'特防'}, {k:'spd',   n:'速度'}
                        ];

                        return configs.map(cfg => {
                            const key = cfg.k === 'maxHp' ? 'hp' : cfg.k;
                            const currVal = currentStats[cfg.k];
                            let maxStat = (getBase(key) + 31) * growth;
                            if (key === 'hp') maxStat = maxStat * 2.5;
                            maxStat = Math.floor(maxStat * 1.2); 
                            
                            const leftPct = Math.min(100, (currVal / maxStat) * 100);
                            const growthVal = nextStats[cfg.k] - currentStats[cfg.k];
                            let baseGrowthFactor = (getBase(key) + 31) * 0.05; 
                            if (key === 'hp') baseGrowthFactor *= 2.5;
                            const maxGrowth = Math.ceil(baseGrowthFactor * 1.55); 
                            const rightPct = Math.min(100, (growthVal / maxGrowth) * 100);

                            const getBarColor = (pct) => {
                                if (pct >= 80) return '#FFD700';
                                if (pct >= 50) return '#FF4081';
                                if (pct >= 30) return '#2196F3';
                                return '#BDBDBD';
                            };

                            return (
                            <div key={cfg.k} style={{display:'flex', alignItems:'center', height:'28px', background:'#f9f9f9', borderRadius:'6px', padding:'0 8px'}}>
                                <div style={{flex:1, display:'flex', alignItems:'center', borderRight:'1px solid #eee', paddingRight:'8px'}}>
                                    <div style={{fontSize:'10px', color:'#666', width:'24px'}}>{cfg.n}</div>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${leftPct}%`, background: getBarColor(leftPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right'}}>{currVal}</div>
                                </div>
                                <div style={{flex:1, display:'flex', alignItems:'center', paddingLeft:'8px'}}>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${rightPct}%`, background: getBarColor(rightPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right', color: rightPct>=80 ? '#E65100' : '#666'}}>
                                        +{growthVal}
                                    </div>
                                </div>
                            </div>
                            );
                        });
                        })()}
                    </div>
                </div>
                </>
                );
            })()}

            {/* 🔥 [修复] 特性/魅力/亲密度 展示卡片 🔥 */}
            <div style={{margin:'0 20px 15px', background:'#fff', borderRadius:'12px', padding:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', border:'1px solid #eee'}}>
                
                {/* 特性 */}
                <div style={{flex:1.2, borderRight:'1px solid #eee', paddingRight:'10px'}}>
                    <div style={{fontSize:'10px', color:'#999', marginBottom:'4px', fontWeight:'bold'}}>特性 (Trait)</div>
                    <div style={{fontSize:'13px', fontWeight:'bold', color:'#673AB7', display:'flex', alignItems:'center', gap:'5px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.name || '无'}
                    </div>
                    <div style={{fontSize:'10px', color:'#666', lineHeight:'1.3', marginTop:'2px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.desc || '暂无特殊能力'}
                    </div>
                </div>

                {/* 魅力 & 亲密度 (修复：添加评级显示) */}
                <div style={{flex:0.8, paddingLeft:'15px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'10px', color:'#999'}}>魅力</span>
                        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                            {/* 🔥 新增：魅力评级标签 */}
                            <span style={{
                                fontSize:'9px', color:'#fff', 
                                background: CHARM_RANK_COLORS[viewStatPet.charmRank || '凶萌'] || '#999', 
                                padding:'1px 4px', borderRadius:'4px', fontWeight:'bold'
                            }}>
                                {viewStatPet.charmRank || '凶萌'}
                            </span>
                            <span style={{fontSize:'12px', fontWeight:'bold', color:'#E91E63', display:'flex', alignItems:'center', gap:'4px'}}>
                                💖 {viewStatPet.charm || 0}
                            </span>
                        </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'10px', color:'#999'}}>亲密</span>
                        <span style={{fontSize:'12px', fontWeight:'bold', color:'#F44336', display:'flex', alignItems:'center', gap:'4px'}}>
                            ❤️ {viewStatPet.intimacy || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. 门派详情与升级卡片 */}
            {(() => {
                const sect = SECT_DB[viewStatPet.sectId || 1];
                const lv = viewStatPet.sectLevel || 1;
                const cost = getSectUpgradeCost(lv);
                const isMax = lv >= 10;
                const effectText = sect.effect ? sect.effect(lv) : sect.desc;
                const nextEffectText = (!isMax && sect.effect) ? sect.effect(lv+1) : '';

                const upgradeSect = () => {
                    if (gold < cost) { alert("金币不足！"); return; }
                    setGold(g => g - cost);
                    const newParty = [...party];
                    const idx = newParty.findIndex(p => p.uid === viewStatPet.uid);
                    if (idx !== -1) {
                        newParty[idx].sectLevel = lv + 1;
                        setParty(newParty);
                        setViewStatPet(newParty[idx]);
                        alert(`恭喜！${sect.name} 心法突破到了 第${lv+1}层！`);
                    }
                };

                return (
                    <div style={{margin:'0 20px 15px', background:`linear-gradient(135deg, ${sect.color}22, #fff)`, border:`1px solid ${sect.color}`, borderRadius:'12px', padding:'12px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <div style={{fontSize:'24px', background:'#fff', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                                    {sect.emoji}
                                </div>
                                <div>
                                    <div style={{fontWeight:'bold', color: sect.color, fontSize:'14px'}}>{sect.name}</div>
                                    <div style={{fontSize:'10px', color:'#666'}}>当前境界: 第 {lv} 层</div>
                                </div>
                            </div>
                            {!isMax ? (
                                <button onClick={upgradeSect} style={{
                                    background: sect.color, color:'#fff', border:'none', padding:'6px 12px', borderRadius:'20px', 
                                    fontSize:'11px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                    修炼 (💰{cost})
                                </button>
                            ) : (
                                <span style={{fontSize:'12px', fontWeight:'bold', color:'#999', background:'#eee', padding:'4px 8px', borderRadius:'10px'}}>已圆满</span>
                            )}
                        </div>
                        <div style={{fontSize:'11px', color:'#555', background:'rgba(255,255,255,0.8)', padding:'8px', borderRadius:'6px', lineHeight:'1.4'}}>
                            <div style={{fontWeight:'bold', marginBottom:'2px'}}>【{sect.desc}】</div>
                            <div>当前效果: {effectText}</div>
                            {!isMax && <div style={{color: sect.color, marginTop:'2px'}}>下一层: {nextEffectText}</div>}
                        </div>
                    </div>
                );
            })()}

            {/* 4. 道具与培养 */}
            <div style={{padding:'0 20px 20px'}}>
               <div style={{background:'#FFF8E1', color:'#F57F17', padding:'8px', borderRadius:'8px', textAlign:'center', fontSize:'12px', fontWeight:'bold', marginBottom:'15px'}}>
                 幸运值 (暴击率): {getStats(viewStatPet).crit}%
               </div>

               <div onClick={() => openRebirthUI(viewStatPet)} style={{
                    background: 'linear-gradient(90deg, #673AB7, #9C27B0)', color: '#fff', padding: '10px', borderRadius: '10px', 
                    marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)'
                 }}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{fontSize:'20px'}}>🧬</span>
                      <div>
                          <div style={{fontWeight:'bold', fontSize:'14px'}}>基因洗练</div>
                          <div style={{fontSize:'10px', opacity:0.8}}>重置 Lv.5 | 刷新性格与资质</div>
                      </div>
                  </div>
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px', fontSize:'12px'}}>
                      💊 {inventory.misc.rebirth_pill || 0}
                  </div>
               </div>

               <div style={{fontSize:'12px', fontWeight:'bold', marginBottom:'8px'}}>属性培养</div>
               <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px', marginBottom:'15px'}}>
                  {GROWTH_ITEMS.map(item => {
                    const count = inventory[item.id] || 0;
                    return (
                      <button key={item.id} disabled={count<=0} onClick={() => useGrowthItem(party.indexOf(viewStatPet), item.id)}
                        style={{
                            minWidth:'60px', padding:'6px', border:'1px solid #eee', borderRadius:'8px', 
                            background: count>0?'#fff':'#f9f9f9', opacity: count>0?1:0.5,
                            display:'flex', flexDirection:'column', alignItems:'center'
                        }}>
                        <span style={{fontSize:'18px'}}>{item.emoji}</span>
                        <span style={{fontSize:'9px', color:'#666'}}>x{count}</span>
                      </button>
                    )
                  })}
               </div>

               {/* 进化家族树 */}
               {(() => {
                 const currentPet = viewStatPet;
                 const family = getFamilyTree(currentPet.id);
                 if (!family || (family.stage1.length === 0)) return null;

                 const EvoNode = ({ pet, method }) => {
                     const isCaught = caughtDex.includes(pet.id);
                     const isCurrent = pet.id === currentPet.id;
                     return (
                         <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'4px 0', minWidth:'60px'}}>
                             {method && (
                                 <div style={{
                                     fontSize:'9px', color:'#fff', marginBottom:'2px', 
                                     background:'#aaa', padding:'1px 6px', borderRadius:'10px', 
                                     zIndex:2, transform:'scale(0.9)'
                                 }}>
                                     {method}
                                 </div>
                             )}
                             <div 
                                onClick={() => {
                                    if (isCaught && !isCurrent) {
                                        const inParty = party.find(p => p.id === pet.id);
                                        if (inParty) setViewStatPet(inParty);
                                    }
                                }}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: (isCaught && !isCurrent) ? 'pointer' : 'default',
                                    overflow: 'hidden', padding: '2px',
                                    boxShadow: isCurrent ? '0 2px 6px rgba(33,150,243,0.3)' : 'none',
                                    transition: '0.2s'
                                }}
                             >
                                {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                             </div>
                             <div style={{
                                 fontSize:'10px', color: isCurrent?'#2196F3':'#666', marginTop:'2px', 
                                 fontWeight: isCurrent?'bold':'normal', 
                                 maxWidth:'56px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
                             }}>
                                {(isCaught || isCurrent) ? pet.name : '???'}
                             </div>
                         </div>
                     );
                 };

                 return (
                   <div style={{
                       width: '100%', padding: '15px 10px', 
                       background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                       marginTop:'15px', overflowX: 'auto'
                   }}>
                     <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                     <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                        <EvoNode pet={family.root} />
                        {family.stage1.length > 0 && (
                            <>
                                <div style={{color:'#ccc', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                        {family.stage2.length > 0 && (
                            <>
                                <div style={{color:'#ccc', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                     </div>
                   </div>
                 );
               })()}
            </div>

            {/* 5. 技能栏 */}
            <div style={{padding:'0 20px 20px', borderTop:'1px solid #f0f0f0', marginTop:'auto'}}>
               <div style={{fontSize:'12px', fontWeight:'bold', margin:'15px 0 8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <span>已学会技能</span>
                 <button 
                    onClick={() => {
                      const currentCount = inventory.ethers || inventory.meds?.ether || 0;
                      if (currentCount <= 0) { alert("没有PP补剂了！请去商店购买。"); return; }
                      const pIndex = party.findIndex(p => p === viewStatPet || (p.id === viewStatPet.id && p.caughtDate === viewStatPet.caughtDate));
                      if (pIndex === -1) return;
                      const newParty = [...party];
                      const pet = newParty[pIndex];
                      let recovered = false;
                      pet.moves.forEach(m => {
                         const max = m.maxPP || 20; 
                         if ((m.pp || 0) < max) { m.pp = max; recovered = true; }
                      });
                      if (recovered) {
                         setInventory(prev => {
                            const now = prev.meds?.ether || 0;
                            return { ...prev, meds: {...prev.meds, ether: now - 1} };
                         });
                         setParty(newParty);
                         setViewStatPet({...pet}); 
                         alert(`✨ ${pet.name} 的技能 PP 已全部恢复！`);
                      } else {
                         alert('技能 PP 已经是满的，无需使用。');
                      }
                    }}
                    style={{
                      fontSize:'11px', padding:'4px 10px', borderRadius:'12px', border:'none',
                      background: (inventory.meds?.ether || 0) > 0 ? '#E0F7FA' : '#f5f5f5',
                      color: (inventory.meds?.ether || 0) > 0 ? '#006064' : '#ccc',
                      cursor: (inventory.meds?.ether || 0) > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: '600', display:'flex', alignItems:'center', gap:'4px'
                    }}
                 >
                   <span>🧴</span> 补剂 x{inventory.meds?.ether || 0}
                 </button>
               </div>

               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  {viewStatPet.moves.map((m, i) => (
                    <div key={i} style={{background:'#f5f7fa', padding:'8px', borderRadius:'6px', borderLeft:`3px solid ${TYPES[m.t]?.color}`}}>
                       <div style={{display:'flex', justifyContent:'space-between'}}>
                         <div style={{fontSize:'12px', fontWeight:'bold'}}>{m.name}</div>
                         <div style={{fontSize:'10px', color: m.pp===0?'red':'#999', fontWeight:'bold'}}>PP: {m.pp||20}</div>
                       </div>
                       <div style={{fontSize:'10px', color:'#666', marginTop:'2px'}}>威力: {m.p}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
    );
  };


  // ==========================================
  // [补回] 队伍管理弹窗 (renderTeamModal)
  // ==========================================
  const renderTeamModal = () => {
    if (!teamMode && !usingItem) return null; // 如果没开启且没在使用物品，不显示

    // 关闭逻辑
    const handleClose = () => {
        if (usingItem) {
            setUsingItem(null);
            setView('bag'); // 如果是使用物品中，关闭回背包
        } else {
            setTeamMode(false);
        }
    };

    return (
      <div className="modal-overlay" onClick={handleClose} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500
      }}>
        <div className="team-modal-container" onClick={e => e.stopPropagation()}>
            
            {/* 1. 顶部标题栏 */}
            <div className="team-modal-header">
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'24px'}}>🛡️</span>
                    <div>
                        <div style={{fontSize:'18px', fontWeight:'800', color:'#333'}}>我的伙伴</div>
                        <div style={{fontSize:'11px', color:'#999', letterSpacing:'1px'}}>MY POKEMON TEAM ({party.length}/6)</div>
                    </div>
                </div>
                
                {/* 如果正在使用物品，显示提示 */}
                {usingItem && (
                    <div className="using-item-tip">
                        正在使用: <b>{usingItem.data.name}</b>
                        <span style={{fontSize:'10px', marginLeft:'5px'}}>(请选择对象)</span>
                    </div>
                )}

                <button className="btn-close-round" onClick={handleClose}>×</button>
            </div>

            {/* 2. 精灵列表 (2列网格) */}
            <div className="team-modal-grid">
                {/* 渲染现有精灵 */}
                {party.map((p, i) => {
                    const stats = getStats(p);
                    const hpPercent = (p.currentHp / stats.maxHp) * 100;
                    const isFainted = p.currentHp <= 0;
                    const typeConfig = TYPES[p.type] || TYPES.NORMAL;
                    
                    // 装备检查
                    const hasEquip = p.equips && p.equips.some(e => e);

                    return (
                        <div key={i} 
                             className={`team-member-card ${isFainted ? 'fainted' : ''}`}
                             style={{borderLeft: `4px solid ${typeConfig.color}`}}
                             onClick={() => {
                                 if (usingItem) handleItemUseOnPet(i);
                                 else setViewStatPet(p); // 点击查看详情
                             }}
                        >
                            {/* 背景装饰字 */}
                            <div className="card-bg-text">{p.type}</div>

                            {/* 左侧：头像与等级 */}
                            <div className="card-left">
                                <div className="card-avatar-box">
                                    {renderAvatar(p)}
                                    {i === 0 && <div className="leader-badge">👑</div>}
                                </div>
                                <div className="card-lvl-badge" style={{background: typeConfig.color}}>
                                    Lv.{p.level}
                                </div>
                            </div>

                            {/* 右侧：信息与状态 */}
                            <div className="card-right">
                                <div className="card-name-row">
                                    <span className="card-name">{p.name}</span>
                                    <div style={{display:'flex', gap:'4px'}}>
                                        {p.isShiny && <span className="shiny-dot">✨</span>}
                                        {hasEquip && <span className="equip-dot" title="持有装备">🛡️</span>}
                                    </div>
                                </div>

                                {/* 血条 */}
                                <div className="card-bar-group">
                                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#666', marginBottom:'2px'}}>
                                        <span>HP</span>
                                        <span>{Math.floor(p.currentHp)}/{stats.maxHp}</span>
                                    </div>
                                    <div className="bar-track-sm">
                                        <div className="bar-fill-sm" style={{
                                            width: `${hpPercent}%`, 
                                            background: hpPercent > 50 ? '#4CAF50' : (hpPercent > 20 ? '#FFC107' : '#FF5252')
                                        }}></div>
                                    </div>
                                </div>

                                {/* 快捷操作栏 (仅在非物品使用模式下显示) */}
                                {!usingItem && !isFainted && (
                                    <div className="card-actions">
                                        <button onClick={(e) => { e.stopPropagation(); usePotion(i); }} title="快速治疗">💊</button>
                                        <button onClick={(e) => { e.stopPropagation(); useBerry(i); }} title="喂食树果">🍒</button>
                                        {i !== 0 && <button onClick={(e) => { e.stopPropagation(); setLeader(i); }} title="设为首发">⬆️</button>}
                                    </div>
                                )}
                                {isFainted && <div className="fainted-text">濒死状态</div>}
                            </div>
                        </div>
                    );
                })}

                {/* 补齐空槽位 */}
                {[...Array(6 - party.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="team-member-card empty">
                        <div style={{fontSize:'24px', opacity:0.3}}>➕</div>
                        <div style={{fontSize:'12px', color:'#aaa', marginTop:'5px'}}>空槽位</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

   // ==========================================
  // [修改] 队伍管理界面 (移除了内嵌弹窗)
  // ==========================================
  const renderTeam = () => (
    <div className="screen team-screen">
      {/* 顶部导航栏 */}
      <div className="nav-header glass-panel">
        <button className="btn-back" onClick={() => {
            if (usingItem) { setUsingItem(null); setView('bag'); } 
            else setView('grid_map');
        }}>🔙 返回</button>
        <div className="nav-title">我的伙伴 ({party.length}/6)</div>
        <div style={{width: 60}}></div>
      </div>
      
      {/* 物品使用模式提示条 */}
      {usingItem && (
          <div style={{background:'#2196F3', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'}}>
              正在使用: {usingItem.data.name} <br/>
              <span style={{fontSize:'12px', fontWeight:'normal'}}>请选择一个对象</span>
          </div>
      )}

      {/* 队伍列表内容区 */}
      <div className="team-content">
        <div className="team-grid-modern">
          {party.map((p, i) => {
            const stats = getStats(p);
            const hpPercent = (p.currentHp / stats.maxHp) * 100;
            const expPercent = (p.exp / p.nextExp) * 100;
            
            const isFainted = p.currentHp <= 0;
            const hasPending = !!p.pendingLearnMove; 
            
            // 视觉特效
            const getSpriteStyle = () => {
              if (p.isFusedShiny) return { filter: 'hue-rotate(150deg) drop-shadow(0 0 6px #D500F9)' };
              if (p.isShiny) return { filter: 'brightness(1.1) drop-shadow(0 0 5px #FFD700)' };
              return {};
            };
            const shinyStyle = getSpriteStyle();

            const equips = p.equips || [null, null];

            return (
              <div 
                key={i} 
                className={`hero-card bg-${p.type} ${isFainted ? 'fainted-card' : ''}`} 
                style={{
                    ...(hasPending ? {border: '3px solid #FFD700'} : {}),
                    ...(isFainted ? {filter: 'grayscale(100%) opacity(0.8)'} : {})
                }}
                onClick={() => {
                    if (usingItem) {
                        handleItemUseOnPet(i);
                    } else if (!hasPending) {
                        setViewStatPet(p); // 这里设置状态，触发外层弹窗
                    }
                }}
              >
                {isFainted && <div className="fainted-badge">😵 晕厥</div>}
                
                {/* 闪光/异色 徽章 */}
                {p.isFusedShiny ? (
                    <div style={{
                        position:'absolute', top:'0', left:'0',
                        background:'linear-gradient(135deg, #D500F9, #7B1FA2)', 
                        color:'#fff', fontSize:'10px', padding:'2px 8px', 
                        borderRadius:'8px 0 8px 0', fontWeight:'bold', zIndex:5,
                        boxShadow:'2px 2px 5px rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.2)'
                    }}>🧬 异色</div>
                ) : p.isShiny ? (
                    <div style={{
                        position:'absolute', top:'0', left:'0',
                        background:'linear-gradient(135deg, #FFD700, #FF6F00)', 
                        color:'#fff', fontSize:'10px', padding:'2px 8px', 
                        borderRadius:'8px 0 8px 0', fontWeight:'bold', zIndex:5,
                        boxShadow:'2px 2px 5px rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.2)',
                        textShadow:'0 1px 1px rgba(0,0,0,0.2)'
                    }}>✨ 闪光</div>
                ) : null}

                <div className="hero-left">
                 <div className="hero-emoji" style={shinyStyle}>
                    {renderAvatar(p)}
                 </div>
                  <div className="hero-lvl-badge">Lv.{p.level}</div>
                </div>
                
                <div className="hero-right">
                  <div className="hero-header">
                    <div className="hero-name">{p.name} {p.isShiny && '✨'}</div>
                    {i === 0 && <div className="hero-leader-icon">👑</div>}
                  </div>
                  
                  {/* 装备槽位 */}
                  {!usingItem && (
                      <div className="equip-slots-row" onClick={e => e.stopPropagation()}>
                        {[0, 1].map(slotIdx => {
                            const accId = equips[slotIdx];
                            let acc = null;
                            if (typeof accId === 'string') acc = ACCESSORY_DB.find(a => a.id === accId);
                            else if (typeof accId === 'object') acc = accId;

                            return (
                                <div 
                                    key={slotIdx} 
                                    className={`equip-slot-box ${acc ? 'filled' : 'empty'}`}
                                    onClick={() => openEquipModal(i, slotIdx)}
                                >
                                    {acc ? <span title={acc.name}>{acc.icon}</span> : <span style={{opacity:0.3}}>🛡️</span>}
                                </div>
                            );
                        })}
                      </div>
                  )}

                 {hasPending ? (
                    <div className="pending-skill-alert" onClick={(e) => { e.stopPropagation(); startLearningMove(i); }}>
                      <div>💡 领悟新技能!</div>
                      <button className="action-btn-sm">学习</button>
                    </div>
                  ) : p.canEvolve && !usingItem ? (
                    <div className="pending-skill-alert" style={{background: 'rgba(0, 230, 118, 0.9)', color:'#fff'}} onClick={(e) => { e.stopPropagation(); handleManualEvolve(i); }}>
                      <div>✨ 进化的光芒!</div>
                      <button className="action-btn-sm" style={{color:'#00E676'}}>进化</button>
                    </div>
                  ) : (
                    <>
                      <div className="hero-bars">
                        <div className="bar-row">
                          <span className="bar-label">HP</span>
                          <div className="bar-track"><div className="bar-fill hp" style={{width: `${hpPercent}%`}}></div></div>
                          <span className="bar-text">{Math.floor(p.currentHp)}/{stats.maxHp}</span>
                        </div>
                        <div className="bar-row">
                          <span className="bar-label">EXP</span>
                          <div className="bar-track"><div className="bar-fill exp" style={{width: `${expPercent}%`}}></div></div>
                        </div>
                      </div>
                      
                      {!usingItem && (
                          <div className="hero-actions" onClick={e => e.stopPropagation()}>
                            <button className="action-btn-sm" onClick={() => useBerry(i)} disabled={inventory.berries <= 0 || isFainted}>🍒 喂食</button>
                            <button className="action-btn-sm" onClick={() => usePotion(i)} disabled={(inventory.meds.potion||0) <= 0 || isFainted}>💊 治疗</button>
                            {i !== 0 && <button className="action-btn-sm" onClick={() => setLeader(i)}>👑 首发</button>}
                          </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* 空槽位补齐 */}
          {[...Array(6 - party.length)].map((_, i) => (
            <div key={`empty-${i}`} className="empty-slot-card">
              <div className="empty-icon">➕</div>
              <div className="empty-text">空槽位</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    // ==========================================
  // [终极修复版] 环境特效图层 (自带样式 + 高对比度)
  // ==========================================
  const renderEnvironmentOverlay = () => {
    // 1. 动态注入 CSS 动画 (确保动画一定生效，无需外部CSS)
    const cssStyles = `
      @keyframes rain-drop {
        0% { transform: translateY(-10vh); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      @keyframes snow-fall {
        0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
        100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
      }
      @keyframes sand-storm {
        0% { transform: translateX(-10vw); opacity: 0; }
        20% { opacity: 0.8; }
        80% { opacity: 0.8; }
        100% { transform: translateX(100vw); opacity: 0; }
      }
      @keyframes sun-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes flash {
        0%, 90%, 100% { opacity: 0; }
        92%, 98% { opacity: 0.3; background: white; }
      }
    `;

    // 2. 昼夜滤镜 (加深颜色)
    let timeOverlay = null;
    if (timePhase === 'DUSK') {
        // 黄昏：明显的橙红色滤镜
        timeOverlay = <div style={{position:'absolute', inset:0, background:'rgba(255, 80, 0, 0.2)', pointerEvents:'none', zIndex:8, mixBlendMode:'multiply'}}></div>;
    } else if (timePhase === 'NIGHT') {
        // 夜晚：深蓝色遮罩
        timeOverlay = <div style={{position:'absolute', inset:0, background:'rgba(0, 0, 50, 0.6)', pointerEvents:'none', zIndex:8, mixBlendMode:'multiply'}}></div>;
    }

    // 3. 天气特效 (高对比度)
    let weatherNode = null;
    
    if (weather === 'RAIN') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(0,0,30,0.15)'}}></div> {/* 整体变暗 */}
                {[...Array(40)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`${Math.random()*100}%`, 
                        top:`-${Math.random()*20}%`,
                        width:'2px', 
                        height:`${20 + Math.random()*20}px`, 
                        background:'rgba(60, 160, 255, 0.8)', // 🔥 改为明显的亮蓝色
                        boxShadow: '0 0 2px rgba(255,255,255,0.5)',
                        animation: `rain-drop ${0.5 + Math.random()*0.3}s linear infinite`, 
                        animationDelay: `-${Math.random()}s`
                    }}></div>
                ))}
                {/* 偶尔闪电特效 */}
                <div style={{position:'absolute', inset:0, animation:'flash 6s infinite', pointerEvents:'none'}}></div>
            </div>
        );
    } else if (weather === 'SNOW') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,0.1)'}}></div>
                {[...Array(30)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`${Math.random()*100}%`, 
                        top:`-${Math.random()*20}%`,
                        color: '#fff',
                        fontSize: `${14 + Math.random()*10}px`, // 🔥 加大雪花尺寸
                        textShadow: '0 0 4px rgba(0,0,0,0.8)', // 🔥 加黑色阴影，保证在白背景下可见
                        animation: `snow-fall ${3 + Math.random()*2}s linear infinite`, 
                        animationDelay: `-${Math.random()*3}s`
                    }}>❄️</div>
                ))}
            </div>
        );
    } else if (weather === 'SAND') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(194, 178, 128, 0.4)', mixBlendMode:'multiply'}}></div>
                {[...Array(20)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`-${Math.random()*20}%`, 
                        top:`${Math.random()*100}%`,
                        width:'200px', 
                        height:'3px', 
                        background:'rgba(139, 69, 19, 0.6)', // 🔥 改为深褐色沙尘
                        boxShadow: '0 0 5px rgba(139, 69, 19, 0.4)',
                        animation: `sand-storm ${0.6 + Math.random()}s linear infinite`, 
                        animationDelay: `-${Math.random()*2}s`
                    }}></div>
                ))}
            </div>
        );
    } else if (weather === 'SUN') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                {/* 右上角旋转的大太阳 */}
                <div style={{
                    position:'absolute', top:'-40px', right:'-40px', 
                    width:'150px', height:'150px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'sun-spin 20s linear infinite'
                }}>
                    <div style={{fontSize:'100px', filter:'drop-shadow(0 0 20px orange)'}}>☀️</div>
                </div>
                {/* 强烈的暖光滤镜 */}
                <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 90% 10%, rgba(255,200,0,0.25) 0%, transparent 60%)', mixBlendMode:'screen'}}></div>
            </div>
        );
    }

    return (
        <>
            <style>{cssStyles}</style>
            {timeOverlay}
            {weatherNode}
        </>
    );
  };

   // ==========================================
  // 6. [最终版] 探险地图界面 (含实时天气/时间显示)
  // ==========================================
  const renderGridMap = () => {
    const currentMapInfo = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const theme = THEME_CONFIG[currentMapInfo.type] || THEME_CONFIG.grass;
    
    // 🔥 [修改] 获取当前环境信息
    const timeInfo = TIME_PHASES[timePhase];
    
    // 🔥 [核心] 从 mapWeathers 获取当前地图的天气，如果没有则默认 CLEAR
    const currentWeatherKey = mapWeathers[currentMapId] || 'CLEAR';
    // 同步更新全局 weather 状态以便 renderEnvironmentOverlay 使用 (如果有必要，或者直接传参)
    // 这里我们做个小技巧：在渲染前把 weather 状态对齐，确保特效层正确
    if (weather !== currentWeatherKey) setWeather(currentWeatherKey);
    
    const weatherInfo = WEATHERS[currentWeatherKey];

    const handleExitAndSave = () => {
      const dataToSave = { trainerName, trainerAvatar, gold, party, box, accessories, inventory, mapProgress, caughtDex, completedChallenges, badges, viewedIntros, unlockedTitles, currentTitle, leagueWins, sectTitles };
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
      setHasSave(true); setView('world_map');
    };
    
    return (
      <div className={`screen grid-screen game-ui-wrapper ${theme.cssClass}`} style={{
          backgroundColor: theme.bg, 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          padding: '10px',
          gap: '15px'
      }}>
        {/* 环境特效层 (下雨/天黑等) */}
        {renderEnvironmentOverlay()}

        <div className="deco-cloud" style={{top: '10%', animationDuration: '60s'}}>☁️</div>
        
        {/* 左侧面板 */}
        {renderLeftPanel()}
        
        {/* 中间区域 */}
        <div className="center-area" style={{
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minWidth: 0, 
            zIndex: 5,
            position: 'relative',
            paddingBottom: '0'
        }}>
          
          {/* ▼▼▼▼▼▼ 顶部状态栏 ▼▼▼▼▼▼ */}
          <div className="grid-header glass-panel" style={{
              marginBottom: '10px', flexShrink: 0, display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center', padding: '0 15px',
              height: '50px' 
          }}>
            {/* 左侧：退出按钮 */}
            <button className="btn-back-sm" onClick={handleExitAndSave} style={{width:'80px'}}>⬅ 退出</button>
            
            {/* 中间：环境仪表盘 (只读显示) */}
            {/* 🔥 [修改] 移除了 onClick 事件，改为纯展示 */}
            <div style={{
                    display:'flex', alignItems:'center', gap:'15px',
                    background: 'rgba(255,255,255,0.9)', 
                    padding: '6px 20px', borderRadius: '30px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '2px solid #fff',
                    userSelect: 'none'
                }}
                title={`当前时间: ${Math.floor(gameTime/60)}分 (循环周期75分)`}
            >
                 {/* 时间显示 */}
                 <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <span style={{fontSize:'20px', filter:'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'}}>{timeInfo.icon}</span>
                    <span style={{fontSize:'14px', fontWeight:'800', color:'#444'}}>{timeInfo.name}</span>
                 </div>
                 
                 <div style={{width:'2px', height:'14px', background:'#ddd'}}></div>
                 
                 {/* 天气显示 */}
                 <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <span style={{fontSize:'20px', filter:'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'}}>{weatherInfo.icon}</span>
                    <span style={{fontSize:'14px', fontWeight:'800', color:'#444'}}>{weatherInfo.name}</span>
                 </div>
            </div>

            {/* 右侧：坐标显示 */}
            <div style={{
                width: '80px', textAlign:'right', fontSize:'12px', 
                color:'#666', fontWeight:'bold', fontFamily:'monospace',
                background:'rgba(255,255,255,0.5)', padding:'2px 8px', borderRadius:'6px'
            }}>
               X:{playerPos.x} Y:{playerPos.y}
            </div>
          </div>
          {/* 🔥🔥🔥🔥🔥 核心修改区域开始 🔥🔥🔥🔥🔥 */}
          {/* 原本的 grid-viewport (2D) 已被移除，替换为下面的 3D 容器 */}
          
          <div style={{
              flex: 1, 
              position: 'relative', 
              borderRadius: '12px', 
              overflow: 'hidden', // 必须隐藏溢出，否则 canvas 可能撑大
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)', // 加个内阴影增加深邃感
              marginBottom: '0',
              background: '#000' // 3D 加载前的底色
          }}>
              {/* 传入关键数据：地图网格 和 玩家位置 */}
              <ThreeMap mapGrid={mapGrid} playerPos={playerPos} />
          </div>
          {/* 🔥🔥🔥🔥🔥 核心修改区域结束 🔥🔥🔥🔥🔥 */}
          {/* 底部菜单栏 (保持不变) */}
          <div className="map-dock-capsule" style={{
              position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(255,255,255,0.95)', padding: '12px 30px', borderRadius: '50px', 
              boxShadow: '0 15px 40px rgba(0,0,0,0.25)', zIndex: 100, whiteSpace: 'nowrap'
          }}>
            {[
              { id: 'team', icon: '🛡️', label: '伙伴', action: () => setTeamMode(true) },
              { id: 'shop', icon: '🛍️', label: '商店', action: () => setShopMode(true) },
              { id: 'fusion', icon: '🧬', label: '融合', action: () => setFusionMode(true) },
              { id: 'bag', icon: '🎒', label: '背包' },
              { id: 'pvp', icon: '⚔️', label: '对战', action: () => setPvpMode(true) },
              { id: 'league', icon: '🏆', label: '联盟' },
              { id: 'pc', icon: '💻', label: '电脑', action: () => setPcMode(true) },
              { id: 'card', icon: '🆔', label: '卡片', action: () => setView('trainer_card') },
            ].map(btn => (
              <button key={btn.id} className="dock-btn-capsule" onClick={btn.action || (() => setView(btn.id))} 
                style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer'}}>
                  <div style={{fontSize: '24px', lineHeight: '1'}}>{btn.icon}</div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', color:'#555'}}>{btn.label}</div>
              </button>
            ))}
            <div className="dock-divider-v" style={{width:'2px', height:'35px', background:'#eee', margin:'0 10px'}}></div>
            <button className="dock-btn-capsule" onClick={manualSave}
                style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer'}}>
                <div style={{fontSize: '24px', lineHeight: '1'}}>💾</div>
                <div style={{fontSize: '12px', fontWeight: 'bold', color:'#555'}}>存档</div>
            </button>
          </div>
        </div>

        {/* 右侧面板 */}
        {renderRightPanel()}
        {renderShop()}
        {renderPC()}
        {renderTeamModal()}
        {renderFusion()}
      </div>
    );
  };


  const renderAvatarSelector = () => {
    if (!showAvatarSelector) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowAvatarSelector(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
            width: '320px', background: '#fff', borderRadius: '16px', padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display:'flex', flexDirection:'column'
        }}>
            <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'15px', textAlign:'center'}}>选择你的形象</div>
            
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px',
                maxHeight: '300px', overflowY: 'auto', padding: '5px'
            }}>
                {TRAINER_AVATARS.map((avatar, i) => (
                    <div key={i} 
                        onClick={() => {
                            setTrainerAvatar(avatar);
                            setShowAvatarSelector(false);
                        }}
                        style={{
                            fontSize: '28px', cursor: 'pointer', 
                            background: trainerAvatar === avatar ? '#E3F2FD' : '#f9f9f9',
                            border: trainerAvatar === avatar ? '2px solid #2196F3' : '1px solid #eee',
                            borderRadius: '8px', width: '45px', height: '45px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        {avatar}
                    </div>
                ))}
            </div>

            <button onClick={() => setShowAvatarSelector(false)} style={{
                marginTop: '15px', padding: '10px', border: 'none', borderRadius: '8px',
                background: '#f0f0f0', color: '#666', fontWeight: 'bold', cursor: 'pointer'
            }}>
                取消
            </button>
        </div>
      </div>
    );
  };
   // ==========================================
  // [新增] 缺失的活动核心逻辑函数
  // ==========================================

  // 1. 捕虫大赛 - 开始
  const startBugContest = () => {
    setActiveContest({ id: 'bug' });
    encounterNextBug(); // 直接调用遇敌逻辑
  };

  // 1.1 捕虫大赛 - 遭遇下一只 (用于开始和逃跑后)
  const encounterNextBug = () => {
    const pool = CONTEST_CONFIG.bug.pool;
    const enemyId = _.sample(pool);
    
    // 启动一场特殊类型的战斗
    startBattle({
        id: 9001,
        name: '大赛目标',
        pool: [enemyId],
        lvl: [15, 25], // 比赛等级区间
        drop: 0 // 比赛没有金币掉落
    }, 'contest_bug'); 
  };

  // 2. 钓鱼大赛 - 开始
  const startFishing = () => {
    setActiveContest({ id: 'fishing' });
    setFishingState({ status: 'idle', timer: 0, target: null, fish: null, weight: 0, msg: '' });
    setView('fishing_game');
  };

  // 2.1 钓鱼 - 抛竿
  const castRod = () => {
    if (fishingState.status !== 'idle') return;
    
    setFishingState(prev => ({ ...prev, status: 'waiting', msg: '等待咬钩...' }));
    
    // 随机等待 2~5 秒
    const waitTime = _.random(2000, 5000);
    
    setTimeout(() => {
        // 只有还在 waiting 状态才触发咬钩
        setFishingState(prev => {
            if (prev.status === 'waiting') {
                // 咬钩后，给 1 秒反应时间
                setTimeout(() => {
                    setFishingState(curr => {
                        if (curr.status === 'bite') {
                            return { ...curr, status: 'fail', msg: '鱼跑掉了...' };
                        }
                        return curr;
                    });
                }, 1000);
                return { ...prev, status: 'bite', msg: '❗️ 咬钩了！快提竿！' };
            }
            return prev;
        });
    }, waitTime);
  };

  // 2.2 钓鱼 - 提竿
  const reelIn = () => {
    const { status } = fishingState;
    
    if (status === 'waiting') {
        setFishingState(prev => ({ ...prev, status: 'fail', msg: '提竿太早了！吓跑了鱼。' }));
    } 
    else if (status === 'bite') {
        // 成功！生成鱼的数据
        const pool = CONTEST_CONFIG.fishing.pool;
        const fishId = _.sample(pool);
        // 随机生成鱼的重量 (1.0kg ~ 250.0kg)
        let baseWeight = fishId === 130 ? 200 : (fishId === 119 ? 30 : 10); 
        const weight = (Math.random() * baseWeight + 1).toFixed(1);
        
        const fish = createPet(fishId, _.random(10, 40));
        
        setFishingState(prev => ({ 
            ...prev, 
            status: 'success', 
            fish: fish, 
            weight: weight, 
            msg: '成功钓起！' 
        }));
    }
  };

  // 3. 华丽大赛 - 开始
  const startBeautyContest = () => {
    if (party.length === 0) return;
    // 默认使用首发精灵参赛
    setActiveContest({ id: 'beauty', pet: party[0] });
    setBeautyState({ round: 1, appeal: 0, history: [], log: [] });
    setView('beauty_contest');
  };

  // 3.1 华丽大赛 - 表演
  const performAppeal = (move) => {
    const { round, appeal, log } = beautyState;
    if (round > 5) return;

    let score = 0;
    let msg = "";

    // 基础分：威力越低，表演分通常越高 (变化类技能加分)
    if (move.p === 0) score += 30; // 变化技能
    else if (move.p <= 60) score += 20; // 小威力技能
    else score += 10; // 大招通常不够优雅

    // 属性加成：妖精/水/冰/草 系比较华丽
    if (['FAIRY', 'WATER', 'ICE', 'GRASS'].includes(move.t)) {
        score += 10;
        msg = `✨ ${move.name} 非常华丽！`;
    } else {
        msg = `使用了 ${move.name}。`;
    }

    // 随机波动
    const rng = _.random(-5, 15);
    score += rng;
    if (rng > 10) msg += " 观众反应热烈！";

    // 更新状态
    setBeautyState(prev => ({
        round: prev.round + 1,
        appeal: prev.appeal + score,
        history: [...prev.history, move.name],
        log: [`Round ${prev.round}: ${msg} (+${score})`, ...prev.log]
    }));
  };

   // 🔥 [美化] 报名弹窗 (含排行榜)
  const renderActivityModal = () => {
    if (!activityModal) return null;
    const config = CONTEST_CONFIG[activityModal];
    if (!config) return null;

    const typeKey = config.id.split('_')[1];
    const myRecord = activityRecords[typeKey] || 0;

          const handleStart = () => {
        if (gold < config.entryFee) { alert("❌ 金币不足，无法报名！"); return; }
        
        // 🔥 [修复] 增加扣款逻辑
        setGold(g => g - config.entryFee); 
        
        setActivityModal(null);
        if (activityModal === 'bug') startBugContest();
        else if (activityModal === 'fishing') startFishing();
        else if (activityModal === 'beauty') startBeautyContest();
    };



    return (
      <div className="modal-overlay" onClick={() => setActivityModal(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500}}>
        <div onClick={e => e.stopPropagation()} style={{width: '400px', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s'}}>
            <div style={{height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', position: 'relative'}}>
                <div style={{fontSize: '50px', marginBottom: '5px'}}>{activityModal === 'bug' ? '🦋' : (activityModal === 'fishing' ? '🎣' : '🎀')}</div>
                <div style={{fontSize: '22px', fontWeight: '900', letterSpacing: '1px'}}>{config.name}</div>
                <button onClick={() => setActivityModal(null)} style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer'}}>×</button>
            </div>
            <div style={{padding: '20px'}}>
                {/* 🏆 个人记录展示 */}
                <div style={{background:'#FFF8E1', padding:'10px', borderRadius:'10px', marginBottom:'15px', display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid #FFECB3'}}>
                    <div style={{fontSize:'12px', color:'#F57C00', fontWeight:'bold'}}>🏆 个人最高记录</div>
                    <div style={{fontSize:'16px', fontWeight:'900', color:'#FF6F00'}}>{myRecord} <span style={{fontSize:'10px'}}>{activityModal==='fishing'?'kg':'分'}</span></div>
                </div>

                <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center'}}>{config.desc}</div>
                
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                    <div style={{fontSize: '12px', color: '#666'}}>报名费: <span style={{color: gold < config.entryFee ? '#F44336' : '#4CAF50', fontWeight: 'bold', fontSize: '16px'}}>💰 {config.entryFee}</span></div>
                    <button onClick={handleStart} style={{padding: '12px 30px', borderRadius: '25px', border: 'none', background: gold < config.entryFee ? '#ccc' : 'linear-gradient(90deg, #2196F3, #21CBF3)', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: gold < config.entryFee ? 'not-allowed' : 'pointer', boxShadow: gold < config.entryFee ? 'none' : '0 4px 15px rgba(33, 150, 243, 0.3)'}}>立即报名</button>
                </div>
            </div>
        </div>
      </div>
    );
  };

     // ==========================================
  // [修复] 手动进化处理函数 (修复逻辑死锁)
  // ==========================================
  const handleManualEvolve = async (petIdx) => {
    const newParty = [...party];
    const pet = newParty[petIdx];

    // 1. 再次校验条件
    if (!pet.evo || pet.level < pet.evoLvl) {
        alert("条件不满足，无法进化。");
        return;
    }

    const nextForm = POKEDEX.find(d => d.id === pet.evo);
    
    // 🔥 修复：如果找不到下一形态，直接返回
    if (!nextForm) {
        alert("未知的进化形态！");
        return;
    }

    // 2. 触发动画 (设置状态后直接返回，让渲染层处理动画)
    setEvoAnim({
        targetIdx: petIdx,
        oldPet: pet,
        newPet: nextForm,
        step: 0
    });
  };


   

  const startLearningMove = (petIdx) => {
    setLearningPetIdx(petIdx);
    setPendingMove(party[petIdx].pendingLearnMove);
    setView('move_forget');
  };
    // ==========================================
  // [新增] 洗练系统核心逻辑
  // ==========================================
  
  // 1. 打开洗练界面 (生成初始预览)
  const openRebirthUI = (pet) => {
    if ((inventory.misc.rebirth_pill || 0) <= 0) {
        alert("缺少洗练药！请去商店购买。");
        return;
    }
    
    const idx = party.findIndex(p => p.uid === pet.uid);
    if (idx === -1) return;

    // 生成一个预览用的精灵 (不扣道具，仅预览)
    // 注意：这里我们先不生成新的，而是显示当前状态，点击“洗练”才生成新的
    // 或者为了体验，打开时直接显示“准备洗练”的状态
    setRebirthData({
        petIdx: idx,
        original: pet,
        preview: null // 尚未开始洗练
    });
  };

     // 2. 执行一次洗练 (扣除道具，生成新属性)
  const executeReroll = () => {
    const basePet = rebirthData.original;
    
    // 【需求2修改】：如果是闪光/异色，消耗2个；普通消耗1个
    const cost = basePet.isShiny ? 2 : 1;
    const currentStock = inventory.misc.rebirth_pill || 0;

    if (currentStock < cost) {
        alert(`洗练药不足！\n当前库存: ${currentStock}\n本次需要: ${cost} (闪光精灵消耗加倍)`);
        return;
    }

    // 1. 扣除道具
    setInventory(prev => ({
        ...prev, 
        misc: { ...prev.misc, rebirth_pill: prev.misc.rebirth_pill - cost }
    }));

    // 2. 基于原版生成新数据
    
    // 随机 IVs
    const randIV = () => Math.floor(Math.random() * 32); 
    const newIvs = { 
        hp: randIV(), p_atk: randIV(), p_def: randIV(), 
        s_atk: randIV(), s_def: randIV(), spd: randIV(), 
        crit: Math.floor(Math.random() * 15) 
    };

    // 随机性格
    const natureKeys = Object.keys(NATURE_DB);
    const newNature = natureKeys[Math.floor(Math.random() * natureKeys.length)];

    // 【需求2修改】：闪光/异色逻辑
    let isNewShiny = false;
    if (basePet.isShiny) {
        // 如果原来是闪光，必定保留闪光
        isNewShiny = true;
    } else {
        // 如果原来不是，有 5% 概率变闪光
        isNewShiny = Math.random() < 0.05;
    }

    // ▼▼▼ 新增：洗练也重置种族波动 ▼▼▼
    const newDiversityRng = Math.floor(Math.random() * 9) - 4; 
    const newSpeedRng = Math.floor(Math.random() * 71) + 40;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 构建预览对象 (回到 5 级)
    const previewPet = {
        ...basePet,
        level: 5,
        exp: 0,
        nextExp: 100, 
        ivs: newIvs,
        nature: newNature,
        isShiny: isNewShiny,
        // 写入新的随机值
        diversityRng: newDiversityRng,
        speedRng: newSpeedRng
    };

    // 计算5级时的属性用于展示
    const stats = getStats(previewPet);
    previewPet.currentHp = stats.maxHp;

    setRebirthData(prev => ({ ...prev, preview: previewPet }));
  };



  // 3. 确认保存结果
  const confirmRebirth = () => {
    if (!rebirthData || !rebirthData.preview) return;

    const newParty = [...party];
    newParty[rebirthData.petIdx] = rebirthData.preview;
    
    setParty(newParty);
    
    // 更新详情页视图
    setViewStatPet(rebirthData.preview);
    
    setRebirthData(null);
    alert("✨ 洗练成功！伙伴获得了新生！");
  };
  
   // ==========================================
  // [重写] 背包界面 (紧凑弹窗版)
  // ==========================================
  const renderBag = () => {
    // 点击物品处理
    const handleItemClick = (item, category) => {
        setSelectedBagItem({ ...item, category });
    };

    // 使用/装备按钮逻辑
    const handleUseBtn = () => {
        if (!selectedBagItem) return;
        if (['meds', 'tm', 'growth', 'stone'].includes(selectedBagItem.category)) {
            setUsingItem({ id: selectedBagItem.id, category: selectedBagItem.category, data: selectedBagItem });
            setSelectedBagItem(null); setView('team'); 
        } else if (selectedBagItem.id === 'rebirth_pill') {
             const idxStr = prompt(`请输入要洗练的精灵序号 (1-${party.length}):`, "1");
             const idx = parseInt(idxStr) - 1;
             if (!isNaN(idx) && idx >= 0 && idx < party.length) {
                 openRebirthUI(party[idx]); setSelectedBagItem(null);
             }
        } else if (selectedBagItem.category === 'acc') {
            alert("请前往 [我的伙伴] 界面，点击精灵进行饰品装备。");
        } else { alert("该物品无法直接使用"); }
    };

    // === 准备数据 (保持原有逻辑) ===
    let currentItems = [];
    let currentCat = '';
    if (bagTab === 'balls') {
        currentCat = 'ball';
        Object.keys(inventory.balls).forEach(k => { if (inventory.balls[k] > 0) currentItems.push({ ...BALLS[k], count: inventory.balls[k] }); });
    } else if (bagTab === 'meds') {
        currentCat = 'meds';
        Object.keys(inventory.meds).forEach(k => { if (inventory.meds[k] > 0) currentItems.push({ ...MEDICINES[k], count: inventory.meds[k] }); });
        if (inventory.berries > 0) currentItems.push({ id: 'berry', name: '树果', icon: '🍒', desc: '恢复少量体力', count: inventory.berries });
    } else if (bagTab === 'tms') {
        currentCat = 'tm';
        Object.keys(inventory.tms).forEach(k => { if (inventory.tms[k] > 0) { const tm = TMS.find(t => t.id === k); if (tm) currentItems.push({ ...tm, count: inventory.tms[k] }); } });
    } else if (bagTab === 'stones') { 
        currentCat = 'stone';
        Object.keys(inventory.stones || {}).forEach(k => { if (inventory.stones[k] > 0) { const s = EVO_STONES[k]; if (s) currentItems.push({ ...s, count: inventory.stones[k] }); } });
    } else if (bagTab === 'misc') {
        currentCat = 'growth';
        GROWTH_ITEMS.forEach(g => { if (inventory[g.id] > 0) currentItems.push({ ...g, count: inventory[g.id], icon: g.emoji }); });
        if (inventory.misc.rebirth_pill > 0) currentItems.push({ ...MISC_ITEMS.rebirth_pill, count: inventory.misc.rebirth_pill });
    } else if (bagTab === 'accessories') {
        currentCat = 'acc';
        ACCESSORY_DB.forEach(acc => { const count = accessories.filter(item => item === acc.id).length; if (count > 0) currentItems.push({ ...acc, count }); });
        accessories.forEach(item => { if (typeof item === 'object' && item.isUnique) currentItems.push({ ...item, name: item.displayName, count: 1, desc: `${item.desc} | 技能: ${item.extraSkill.name}` }); });
    }

    return (
      <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}>
        <div style={{
            width: '800px', height: '550px', background: '#fff', borderRadius: '16px',
            display: 'flex', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
            {/* 左侧侧边栏 */}
            <div style={{width: '180px', background: '#f5f7fa', borderRight: '1px solid #eee', padding: '20px 0'}}>
                <div style={{padding: '0 20px 20px', fontWeight: 'bold', fontSize: '18px', color: '#333', borderBottom: '1px solid #eee', marginBottom: '10px'}}>我的背包</div>
                {['balls', 'meds', 'tms', 'stones', 'misc', 'accessories'].map(tab => (
                    <div key={tab} onClick={()=>setBagTab(tab)} style={{
                        padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        background: bagTab===tab ? '#E3F2FD' : 'transparent',
                        color: bagTab===tab ? '#1976D2' : '#666',
                        fontWeight: bagTab===tab ? 'bold' : 'normal',
                        borderRight: bagTab===tab ? '3px solid #1976D2' : '3px solid transparent'
                    }}>
                        <span>{tab==='balls'?'🔴':tab==='meds'?'💊':tab==='tms'?'💿':tab==='stones'?'🔮':tab==='misc'?'💎':'💍'}</span>
                        <span>{tab==='balls'?'精灵球':tab==='meds'?'药品':tab==='tms'?'技能':tab==='stones'?'进化石':tab==='misc'?'道具':'饰品'}</span>
                    </div>
                ))}
                <button onClick={() => setView('grid_map')} style={{
                    margin: '20px', width: '140px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd',
                    background: '#fff', cursor: 'pointer', fontSize: '14px'
                }}>🔙 关闭背包</button>
            </div>

            {/* 右侧内容区 */}
            <div style={{flex: 1, padding: '20px', background: '#fff', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666', fontSize: '12px'}}>
                    <span>当前分类物品</span>
                    <span style={{color: '#FF9800', fontWeight: 'bold'}}>💰 {gold}</span>
                </div>
                
                <div style={{
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', // 调整格子大小
                    gridAutoRows: 'max-content',
                    gap: '12px', overflowY: 'auto', flex: 1, alignContent: 'start'
                }}>
                    {currentItems.length === 0 ? (
                        <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#ccc', marginTop: '50px'}}>
                            <div style={{fontSize: '40px', marginBottom: '10px'}}>📦</div>
                            <div>暂无此类物品</div>
                        </div>
                    ) : (
                        currentItems.map((item, idx) => (
                            <div key={idx} onClick={() => handleItemClick(item, currentCat)} style={{
                                border: '1px solid #eee', borderRadius: '10px', padding: '10px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                cursor: 'pointer', transition: '0.2s', position: 'relative',
                                background: '#fafafa'
                            }} onMouseOver={e => e.currentTarget.style.borderColor = '#2196F3'}
                               onMouseOut={e => e.currentTarget.style.borderColor = '#eee'}>
                                <div style={{fontSize: '32px', marginBottom: '5px'}}>{item.icon || item.emoji}</div>
                                <div style={{fontSize: '12px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2', height: '28px', overflow: 'hidden'}}>{item.name}</div>
                                <div style={{
                                    position: 'absolute', top: '5px', right: '5px', 
                                    background: '#2196F3', color: '#fff', fontSize: '10px', 
                                    padding: '1px 6px', borderRadius: '10px'
                                }}>x{item.count}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* 详情弹窗 (保持原逻辑，微调样式) */}
        {selectedBagItem && (
            <div className="modal-overlay" onClick={() => setSelectedBagItem(null)} style={{zIndex: 2000, background:'rgba(0,0,0,0.3)'}}>
                <div className="bag-detail-card" onClick={e => e.stopPropagation()} style={{
                    width:'300px', background:'#fff', borderRadius:'16px', padding:'20px',
                    display:'flex', flexDirection:'column', alignItems:'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}>
                    <div style={{fontSize:'60px', marginBottom:'15px'}}>{selectedBagItem.icon || selectedBagItem.emoji || '📦'}</div>
                    <div style={{fontSize:'18px', fontWeight:'bold', color:'#333', marginBottom:'5px'}}>{selectedBagItem.name}</div>
                    <div style={{fontSize:'13px', color:'#666', margin:'10px 0', textAlign:'center', background:'#f5f5f5', padding:'10px', borderRadius:'8px', width:'100%'}}>{selectedBagItem.desc}</div>
                    <div style={{display:'flex', gap:'10px', width:'100%'}}>
                        <button onClick={() => setSelectedBagItem(null)} style={{flex:1, padding:'10px', border:'1px solid #ddd', background:'#fff', borderRadius:'8px', cursor:'pointer'}}>关闭</button>
                        {['meds', 'tm', 'growth', 'acc', 'stone'].includes(selectedBagItem.category) && (
                            <button onClick={handleUseBtn} style={{flex:1, padding:'10px', border:'none', background: '#2196F3', borderRadius:'8px', fontWeight:'bold', color:'#fff', cursor:'pointer'}}>使用</button>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  // ==========================================
  // [新增] 核心评级算法
  // ==========================================
  const calculateGrade = (pet) => {
    if (!pet) return { grade: 'B', score: 0, leftAvg: 0, rightAvg: 0 };

    // 1. 获取基础种族值
    const baseInfo = POKEDEX.find(p => p.id === pet.id) || POKEDEX[0];
    const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
    const diversity = (baseInfo.id % 5) * 2 - 4;
    
    // 辅助：计算某项属性的种族值
    const getBase = (k) => {
        if (k === 'hp') return baseInfo.hp || 60;
        if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
        const bAtk = baseInfo.atk || 50;
        const bDef = baseInfo.def || 50;
        if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
        if (k === 'p_def') return Math.floor(bDef * bias.p);
        if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
        if (k === 's_def') return Math.floor(bDef * bias.s);
        return 50;
    };

    const keys = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
    const currentStats = getStats(pet);
    const growth = 1 + pet.level * 0.05;

    let totalLeftPct = 0;
    let totalRightPct = 0;

    keys.forEach(key => {
        // --- 左侧：当前能力对比 ---
        // 分母：同等级、满IV(31)、性格修正1.0(不考虑性格) 的理论数值
        // 公式：(种族值 + 31) * 成长系数
        let maxStat = (getBase(key) + 31) * growth;
        if (key === 'hp') maxStat = maxStat * 2.5;
        
        // 实际数值
        const currStat = key === 'hp' ? currentStats.maxHp : currentStats[key];
        
        // 计算百分比 (上限100%，超过算100%)
        totalLeftPct += Math.min(1, currStat / maxStat);

        // --- 右侧：潜力(IV)对比 ---
        // 分母：31
        const iv = pet.ivs?.[key === 'hp' ? 'hp' : key] || 0;
        totalRightPct += iv / 31;
    });

    const leftAvg = (totalLeftPct / 6) * 100;
    const rightAvg = (totalRightPct / 6) * 100;
    
    // 综合评分：左右两边取平均
    const finalScore = (leftAvg + rightAvg) / 2;

    // ▼▼▼ 修改评级判定逻辑 ▼▼▼
    let grade = 'C'; // 默认为 C
    if (finalScore >= 80) grade = 'S';
    else if (finalScore >= 50) grade = 'A';
    else if (finalScore >= 30) grade = 'B';
    // 低于 30 保持 C
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    return { grade, score: finalScore, leftAvg, rightAvg };
  };

 
  // ==========================================
  // 3. [优化] 饰品弹窗 (图5修复 - 小巧版)
  // ==========================================
  const renderEquipModal = () => {
    if (!equipModalOpen) return null;
    const { petIdx, slotIdx } = targetEquipSlot;
    const pet = party[petIdx];
    const currentEquipId = pet.equips ? pet.equips[slotIdx] : null;
    const uniqueAccessories = _.uniq(accessories);
    return (
      <div className="modal-overlay" onClick={() => setEquipModalOpen(false)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000}}>
        <div onClick={e => e.stopPropagation()} style={{width: '360px', maxHeight: '500px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          <div style={{padding: '15px', background: '#673AB7', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div style={{fontWeight: 'bold'}}>装备饰品</div><button onClick={() => setEquipModalOpen(false)} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>✕</button></div>
          <div style={{padding: '15px', overflowY: 'auto', flex: 1}}>
             <div style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>正在为 <b>{pet.name}</b> 的第 {slotIdx + 1} 个槽位选择饰品：</div>
             {currentEquipId && (<button onClick={handleUnequip} style={{width: '100%', padding: '10px', marginBottom: '15px', background: '#FFEBEE', color: '#D32F2F', border: '1px solid #FFCDD2', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>卸下当前饰品</button>)}
             <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {uniqueAccessories.length === 0 ? (<div style={{textAlign: 'center', color: '#999', padding: '20px'}}>背包里没有饰品</div>) : (
                    <>
                    {_.uniq(accessories.filter(a => typeof a === 'string')).map((accId, idx) => {
                        const acc = ACCESSORY_DB.find(a => a.id === accId);
                        const count = accessories.filter(id => id === accId).length;
                        if (!acc) return null;
                        return (<div key={`static-${idx}`} onClick={() => handleEquipAccessory(accId)} style={{display: 'flex', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', cursor: 'pointer', border: '1px solid #eee'}}><div style={{fontSize: '20px', marginRight: '10px'}}>{acc.icon}</div><div style={{flex: 1}}><div style={{fontSize: '13px', fontWeight: 'bold'}}>{acc.name}</div><div style={{fontSize: '10px', color: '#666'}}>{acc.desc}</div></div><div style={{fontSize: '11px', fontWeight: 'bold', color: '#673AB7'}}>x{count}</div></div>);
                    })}
                    {accessories.filter(a => typeof a === 'object').map((equip, idx) => (
                        <div key={`unique-${equip.uid}`} onClick={() => handleEquipAccessory(equip)} style={{display: 'flex', alignItems: 'center', padding: '10px', background: '#F3E5F5', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E1BEE7'}}><div style={{fontSize: '20px', marginRight: '10px'}}>{equip.icon}</div><div style={{flex: 1}}><div style={{fontSize: '13px', fontWeight: 'bold', color: '#6A1B9A'}}>{equip.displayName}</div><div style={{fontSize: '10px', color: '#666'}}>技能: {equip.extraSkill.name}</div></div></div>
                    ))}
                    </>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };


  const getTrainerConfig = () => {
    if (!battle.isTrainer && !battle.isGym && !battle.isChallenge) return null;

    let avatar = '🧢'; 
    let title = '路过的训练家';

    if (battle.isGym) {
      switch (battle.mapId) {
        case 1: avatar = '👩‍🌾'; title = '草系馆主 莉佳'; break; 
        case 2: avatar = '🏊‍♂️'; title = '水系馆主 小霞'; break; 
        case 3: avatar = '👨‍🚒'; title = '火系馆主 夏伯'; break; 
        case 4: avatar = '🎸'; title = '电系馆主 马志士'; break; 
        case 5: avatar = '🥋'; title = '格斗馆主 阿四'; break; 
        default: avatar = '🎩'; title = '道馆馆主'; break;
      }
    } else if (battle.isChallenge) {
      avatar = '🧛'; title = '挑战塔主';
    } else {
      avatar = '🧢'; 
    }

    return { avatar, title };
  };
  // ==========================================
  // [补全] 缺失的队伍状态指示器函数
  // ==========================================
  const renderPartyIndicators = (targetParty, isPlayer) => {
    return (
      <div className="party-indicators">
        {/* 渲染现有队伍的状态 */}
        {targetParty.map((p, i) => (
          <div 
            key={i} 
            className={`party-ball ${p.currentHp > 0 ? 'alive' : 'fainted'}`}
          />
        ))}
        {/* 补齐 6 个球的空位 (显示为灰色) */}
        {[...Array(6 - targetParty.length)].map((_, i) => (
           <div key={`empty-${i}`} className="party-ball" style={{background:'#ddd', opacity:0.3}}></div>
        ))}
      </div>
    );
  };
  // ==========================================
  // [新增] 闪光特效组件 (渲染一圈炸开的星星)
  // ==========================================
  const RenderShinyStars = () => {
    // 定义8颗星星的方向 (x, y)
    const stars = [
      { x: '0px', y: '-60px', color: '#FFD700', delay: '0s' },   // 上
      { x: '40px', y: '-40px', color: '#00E676', delay: '0.1s' }, // 右上
      { x: '60px', y: '0px',   color: '#29B6F6', delay: '0.2s' }, // 右
      { x: '40px', y: '40px',  color: '#FFD700', delay: '0s' },   // 右下
      { x: '0px', y: '60px',   color: '#AB47BC', delay: '0.1s' }, // 下
      { x: '-40px', y: '40px', color: '#29B6F6', delay: '0.2s' }, // 左下
      { x: '-60px', y: '0px',  color: '#FFD700', delay: '0s' },   // 左
      { x: '-40px', y: '-40px',color: '#FF5252', delay: '0.1s' }, // 左上
    ];

    return (
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, display:'flex', alignItems:'center', justifyContent:'center'}}>
        {/* 拟声词 */}
        <div style={{
            position:'absolute', top:'-40px', fontSize:'24px', fontWeight:'900', 
            color:'#FFD700', textShadow:'0 0 5px #000', fontStyle:'italic',
            animation: 'shiny-text-pop 1s ease-out forwards'
        }}>
            SHING! ✨
        </div>

        {/* 炸开的星星 */}
        {stars.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: '24px',
            color: s.color,
            '--tx': s.x,
            '--ty': s.y,
            animation: `shiny-star-explode 0.8s ease-out forwards`,
            animationDelay: s.delay,
            filter: 'drop-shadow(0 0 2px white)'
          }}>
            ✨
          </div>
        ))}
      </div>
    );
  };

   // ==========================================
  // [精致小巧版] 战斗界面 (含环境特效 + 完整UI + 修复布局)
  // ==========================================
  const renderBattle = () => {
    if (!battle) return null;
    
    const p = battle.playerCombatStates[battle.activeIdx];
    const e = battle.enemyParty[battle.enemyActiveIdx];
    const pStats = getStats(p);
    const eStats = getStats(e);
    
    // --- 辅助函数 ---
    const renderStatusBadges = (unit) => {
        const badges = [];
        const statusConfig = { BRN: { text: '灼伤', bg: '#FF5722' }, PSN: { text: '中毒', bg: '#9C27B0' }, PAR: { text: '麻痹', bg: '#FFC107', color: '#000' }, SLP: { text: '睡眠', bg: '#90A4AE' }, FRZ: { text: '冰冻', bg: '#03A9F4' } };
        if (unit.status && statusConfig[unit.status]) { const cfg = statusConfig[unit.status]; badges.push(<span key="main" style={{background: cfg.bg, color: cfg.color || '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold'}}>{cfg.text}</span>); }
        if (unit.volatiles && unit.volatiles.confused) { badges.push(<span key="confused" style={{background: '#E91E63', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold'}}>混乱</span>); }
        return badges;
    };

    // 🔥 门派徽章渲染函数 (胶囊样式)
    const renderSectBadge = (pet, side) => {
        const s = SECT_DB[pet.sectId || 1];
        const lv = pet.sectLevel || 1; 
        const effectText = s.effect ? s.effect(lv) : s.desc;
        const tooltipKey = `${side}_sect`;

        return (
            <div 
                style={{position: 'relative', display: 'inline-block', marginLeft: '4px', cursor: 'help', zIndex: 20}}
                onMouseEnter={() => setBattleTooltip(tooltipKey)}
                onMouseLeave={() => setBattleTooltip(null)}
            >
                <div style={{
                    display:'inline-flex', alignItems:'center', gap:'3px',
                    background: `linear-gradient(90deg, ${s.color}, #333)`,
                    padding:'1px 6px 1px 2px', borderRadius:'12px', 
                    border:'1px solid rgba(255,255,255,0.3)', 
                    boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
                    color:'#fff', fontSize:'10px', fontWeight:'bold', whiteSpace: 'nowrap'
                }}>
                    <div style={{width:'14px', height:'14px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#000', lineHeight:1}}>{s.icon}</div>
                    <span style={{textShadow:'0 1px 1px rgba(0,0,0,0.5)'}}>{s.name} <span style={{opacity:0.8, fontSize:'9px'}}>Lv.{lv}</span></span>
                </div>

                {battleTooltip === tooltipKey && (
                    <div style={{
                        position: 'absolute', bottom: '130%', left: side === 'enemy' ? 'auto' : '50%', right: side === 'enemy' ? '-10px' : 'auto',
                        transform: side === 'player' ? 'translateX(-50%)' : 'none', width: '200px', background: 'rgba(20, 20, 30, 0.95)', 
                        backdropFilter: 'blur(8px)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '11px', zIndex: 100, 
                        textAlign: 'left', border: `1px solid ${s.color}`, boxShadow: `0 4px 20px ${s.color}66`
                    }}>
                        <div style={{fontWeight:'bold', color: s.color, marginBottom:'4px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'4px'}}>{s.icon} {s.name}心法</div>
                        <div style={{lineHeight:'1.4', color:'#ddd', fontSize:'10px'}}>{effectText}</div>
                    </div>
                )}
            </div>
        );
    };

    const getHpColor = (current, max) => { const pct = (current / max) * 100; if (pct > 50) return '#4CAF50'; if (pct > 20) return '#FFC107'; return '#FF5252'; };
    
    const renderPartyIndicators = (team) => {
        const total = team.length;
        const alive = team.filter(m => m.currentHp > 0).length;
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', background:'rgba(0,0,0,0.05)', padding:'4px 8px', borderRadius:'6px'}}>
                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#555', display:'flex', alignItems:'center', gap:'4px'}}>
                    <span style={{fontSize:'8px'}}>🥎</span> <span>{alive} / {total}</span>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                    {team.map((m, i) => (
                        <div key={i} style={{width: '8px', height: '8px', borderRadius: '50%', background: m.currentHp > 0 ? '#FF5252' : '#555', border: '1px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', opacity: m.currentHp > 0 ? 1 : 0.5}} />
                    ))}
                    {[...Array(6 - total)].map((_, i) => <div key={`empty-${i}`} style={{width: '8px', height: '8px', borderRadius: '50%', border: '1px dashed #ccc'}} />)}
                </div>
            </div>
        );
    };

    // 🔥 [升级] 增强的技能特效配置
    const getVfxConfig = (type) => { 
      const map = { 
        NORMAL: { emoji: '💥', class: 'vfx-normal', particles: ['💥', '✨'] }, 
        FIRE: { emoji: '🔥', class: 'vfx-fire', particles: ['🔥', '🔥', '🔥'] }, 
        WATER: { emoji: '🌊', class: 'vfx-water', particles: ['💧', '🌊', '💧'] }, 
        GRASS: { emoji: '🍃', class: 'vfx-grass', particles: ['🍃', '🌿', '🍃'] }, 
        ELECTRIC: { emoji: '⚡', class: 'vfx-electric', particles: ['⚡', '⚡', '⚡'] }, 
        ICE: { emoji: '❄️', class: 'vfx-ice', particles: ['❄️', '❄️', '❄️'] }, 
        FIGHT: { emoji: '👊', class: 'vfx-normal', particles: ['💥', '👊'] }, 
        POISON: { emoji: '☠️', class: 'vfx-normal', particles: ['💜', '☠️'] }, 
        GROUND: { emoji: '🪨', class: 'vfx-normal', particles: ['🪨', '💥'] }, 
        FLYING: { emoji: '🌪️', class: 'vfx-normal', particles: ['🌪️', '💨'] }, 
        PSYCHIC: { emoji: '🔮', class: 'vfx-normal', particles: ['🔮', '✨'] }, 
        BUG: { emoji: '🕸️', class: 'vfx-normal', particles: ['🕸️', '💚'] }, 
        ROCK: { emoji: '🧱', class: 'vfx-normal', particles: ['🧱', '💥'] }, 
        GHOST: { emoji: '👻', class: 'vfx-normal', particles: ['👻', '💜'] }, 
        DRAGON: { emoji: '🐲', class: 'vfx-dragon', particles: ['🐲', '✨', '🌟'] }, 
        STEEL: { emoji: '⚔️', class: 'vfx-normal', particles: ['⚔️', '✨'] }, 
        FAIRY: { emoji: '✨', class: 'vfx-normal', particles: ['✨', '💖', '✨'] }, 
        GOD: { emoji: '🌌', class: 'vfx-dragon', particles: ['🌟', '✨', '🌌', '🌟'] }, 
        HEAL: { emoji: '💚', class: 'vfx-normal', particles: ['💚', '✨'] }, 
        BUFF: { emoji: '💪', class: 'vfx-normal', particles: ['💪', '✨'] }, 
        DEBUFF: { emoji: '💢', class: 'vfx-normal', particles: ['💢', '💥'] }, 
        PROTECT: { emoji: '🛡️', class: 'vfx-normal', particles: ['🛡️', '✨'] }, 
        SLEEP: { emoji: '💤', class: 'vfx-normal', particles: ['💤', '💤'] }, 
        PARALYSIS: { emoji: '⚡', class: 'vfx-electric', particles: ['⚡', '⚡'] }, 
        FREEZE: { emoji: '🧊', class: 'vfx-ice', particles: ['🧊', '❄️'] }, 
        CONFUSION: { emoji: '💫', class: 'vfx-normal', particles: ['💫', '✨'] }, 
        THROW_BALL: { emoji: '🔴', class: 'vfx-normal', particles: ['🔴'] }, 
        CATCH_SUCCESS: { emoji: '✨', class: 'vfx-normal', particles: ['✨', '🌟', '✨'] }, 
        LEVEL_UP: { emoji: '🆙', class: 'vfx-normal', particles: ['🆙', '✨'] }, 
        EVOLUTION: { emoji: '🧬', class: 'vfx-normal', particles: ['🧬', '✨', '🌟'] } 
      }; 
      return map[type] || { emoji: '💥', class: 'vfx-normal', particles: ['💥'] }; 
    };
    
    // 🔥 [新增] 渲染增强的技能特效
    const renderEnhancedVfx = (vfxConfig, target) => {
      if (!vfxConfig) return null;
      
      return (
        <div className={`vfx-impact-container ${vfxConfig.class}`} style={{
          position: 'absolute',
          top: target === 'enemy' ? '20%' : '60%',
          left: target === 'enemy' ? '70%' : '20%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          pointerEvents: 'none'
        }}>
          {/* 主特效emoji */}
          <div className="vfx-emoji" style={{fontSize:'120px'}}>
            {vfxConfig.emoji}
          </div>
          
          {/* 粒子特效 */}
          <div className="vfx-particles">
            {vfxConfig.particles.map((p, i) => {
              const angle = (360 / vfxConfig.particles.length) * i;
              const distance = 100;
              const tx = Math.cos(angle * Math.PI / 180) * distance;
              const ty = Math.sin(angle * Math.PI / 180) * distance;
              
              return (
                <div 
                  key={i}
                  className="vfx-particle"
                  style={{
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    left: '50%',
                    top: '50%',
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  {p}
                </div>
              );
            })}
          </div>
          
          {/* 属性特效背景 */}
          {vfxConfig.class !== 'vfx-normal' && (
            <div className={vfxConfig.class} style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }} />
          )}
        </div>
      );
    };
    const getTrainerAvatar = (name) => { if (!name) return '🧢'; if (name.includes('捕虫')) return '🕸️'; if (name.includes('功夫') || name.includes('格斗')) return '🥋'; if (name.includes('登山')) return '🧗'; if (name.includes('钓鱼')) return '🎣'; if (name.includes('火箭') || name.includes('日蚀')) return '🕵️'; if (name.includes('馆主')) return '🎖️'; if (name.includes('冠军') || name.includes('首领')) return '👑'; return '🧢'; };
    
    let bgClass = 'bg-grass'; 
    if (battle.isGym) bgClass = 'bg-city'; else if (battle.isChallenge) bgClass = 'bg-cave'; 
    else { const mapInfo = MAPS.find(m => m.id === battle.mapId); if (mapInfo) { switch (mapInfo.type) { case 'water': bgClass = 'bg-water'; break; case 'fire': bgClass = 'bg-fire'; break; case 'ice': bgClass = 'bg-water'; break; case 'mountain': case 'rock': case 'ground': bgClass = 'bg-cave'; break; case 'city': case 'steel': case 'electric': bgClass = 'bg-city'; break; case 'ghost': case 'factory': case 'space': bgClass = 'bg-cave'; break; default: bgClass = 'bg-grass'; break; } } }

    // 交换精灵弹窗
    if (battle.showSwitch) {
      return (
        <div className="screen battle-screen">
            <div className="modal-overlay" style={{background:'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex:200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '500px', background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#333'}}>选择出战伙伴</div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                        {battle.playerCombatStates.map((pet, idx) => {
                            const maxHp = getStats(pet).maxHp;
                            const isFainted = pet.currentHp <= 0;
                            const isActive = idx === battle.activeIdx;
                            return (
                                <div key={idx} onClick={() => { if(!isActive && !isFainted) switchPokemon(idx); }}
                                     style={{background: isActive ? '#E3F2FD' : '#f5f7fa', border: isActive ? '2px solid #2196F3' : '2px solid transparent', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', cursor: (isActive || isFainted) ? 'default' : 'pointer', opacity: isFainted ? 0.6 : 1, position: 'relative', transition: '0.2s'}}
                                     onMouseOver={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#fff'; }}
                                     onMouseOut={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#f5f7fa'; }}
                                >
                                    <div style={{fontSize: '32px', marginRight: '10px', filter: isFainted ? 'grayscale(1)' : 'none'}}>{pet.emoji}</div>
                                    <div style={{flex: 1}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#333'}}><span>{pet.name}</span><span style={{fontSize: '11px', color: '#666'}}>Lv.{pet.level}</span></div>
                                        <div style={{height: '6px', background: '#ddd', borderRadius: '3px', marginTop: '6px', overflow: 'hidden'}}><div style={{width: `${(pet.currentHp/maxHp)*100}%`, background: getHpColor(pet.currentHp, maxHp), height: '100%', transition: 'width 0.3s'}}></div></div>
                                        <div style={{fontSize: '10px', color: '#999', marginTop: '2px', textAlign: 'right'}}>{Math.floor(pet.currentHp)}/{maxHp}</div>
                                    </div>
                                    {isActive && <div style={{position: 'absolute', top: '5px', right: '5px', fontSize: '10px', background: '#2196F3', color: '#fff', padding: '2px 6px', borderRadius: '4px'}}>当前</div>}
                                    {isFainted && <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5252', fontWeight: 'bold', fontSize: '14px'}}>濒死</div>}
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => setBattle(prev => ({...prev, showSwitch: false}))} style={{width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#f0f0f0', color: '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s'}} onMouseOver={e => e.target.style.background='#e0e0e0'} onMouseOut={e => e.target.style.background='#f0f0f0'}>取消</button>
                </div>
            </div>
        </div>
      )
    }

    // 战斗主场景
    return (
      <div className="screen battle-screen">
        {/* 🔥 插入环境特效层 (天气/昼夜) 🔥 */}
        {renderEnvironmentOverlay()}

        <div className={`battle-stage-v2 ${bgClass}`} style={{position:'relative'}}>
            {animEffect?.type === 'BLACKOUT' && <div className="blackout-overlay">😵 眼前一黑...</div>}
            
            <div className="battle-scene-layer" style={{width: '100%', height: '100%', position: 'relative'}}>
                
                {/* ========================================== */}
                {/* 1. 敌方区域 (右上角) */}
                {/* ========================================== */}
                <div className="enemy-zone-v2" style={{position: 'absolute', top: '10%', right: '10%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    
                    {/* 敌方 HUD (血条) */}
                    <div className="hud-card hud-enemy" style={{transform: 'scale(1.1)', transformOrigin: 'right top', marginBottom: '10px'}}>
                        {/* 第一行：名字 + 门派 + 状态 */}
                        <div className="hud-name-row" style={{
                            display:'flex', alignItems:'center', gap:'6px', flexWrap:'nowrap', 
                            justifyContent: 'flex-end', width: '100%'
                        }}>
                            <span style={{fontSize:'14px', fontWeight:'bold', whiteSpace: 'nowrap'}}>
                                {battle.isTrainer ? `${battle.trainerName} 的 ${e.name}` : e.name}
                            </span>
                            {renderSectBadge(e, 'enemy')}
                            {renderStatusBadges(e)}
                        </div>

                        {/* 🔥 [修改] 第二行：等级 (右对齐，放在血条上方) */}
                        <div style={{fontSize:'14px', fontStyle:'italic', textAlign:'right', marginTop:'4px', marginRight:'2px'}}>
                            Lv.{e.level}
                        </div>

                        {/* 第三行：血条（使用增强组件） */}
                        <EnhancedHPBar 
                            current={e.currentHp} 
                            max={eStats.maxHp} 
                            label=""
                        />
                        {renderPartyIndicators(battle.enemyParty)}
                    </div>

                    {/* 敌方精灵图片 - 减小尺寸避免遮挡 */}
                    <div className="sprite-wrapper" style={{position: 'relative', transform: 'scale(0.85)', transformOrigin: 'center bottom', marginRight: '15px'}}>
                        {battle.isTrainer && (
                            <div className="trainer-avatar-wrapper" style={{
                                position: 'absolute', bottom: '25px', right: '-35px', zIndex: -1, opacity: 0.9, transition: '0.3s'
                            }}>
                                <div className="trainer-emoji" style={{fontSize: '100px', filter: 'drop-shadow(-5px 5px 10px rgba(0,0,0,0.3))'}}>
                                    {getTrainerAvatar(battle.trainerName)}
                                </div>
                            </div>
                        )}
                        
                        <div 
                            ref={(el) => {
                                if (el && !el.dataset.animated) {
                                    el.dataset.animated = 'true';
                                    GSAPAnimations.petEntry(el, 0.2);
                                }
                            }}
                            className={`sprite-v2 ${animEffect?.target==='enemy'?'anim-shake':''}`} 
                            style={{
                                filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                                animation: (animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'enemy') 
                                           ? 'shiny-flash-body 0.5s' : 'none'
                            }}>
                            {renderAvatar(e)}
                        </div>
                        {/* 技能释放特效 */}
                        {animEffect && animEffect.target === 'enemy' && animEffect.type !== 'SHINY_ENTRY' && ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE'].includes(animEffect.type) && (
                            <SkillCastEffect
                                type={animEffect.type}
                                x={window.innerWidth * 0.8}
                                y={window.innerHeight * 0.2}
                                onComplete={() => {}}
                            />
                        )}

                        {/* 特效层 */}
                        {animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'enemy' && <RenderShinyStars />}
                        {animEffect && animEffect.target === 'enemy' && renderEnhancedVfx(getVfxConfig(animEffect.type), 'enemy')}
                        {animEffect?.type === 'CATCH_SUCCESS' && animEffect?.target === 'enemy' && (
                          <div className="catch-success-anim" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '48px',
                            fontWeight: '900',
                            color: '#FFD700',
                            textShadow: '0 0 20px rgba(255,215,0,0.8)',
                            animation: 'shiny-text-pop 1s ease-out forwards',
                            zIndex: 200
                          }}>GOTCHA!</div>
                        )}
                    </div>
                </div>

                {/* ========================================== */}
                {/* 2. 我方区域 (左下角) */}
                {/* ========================================== */}
                <div className="player-zone-v2" style={{position: 'absolute', bottom: '25%', left: '10%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    
                    {/* 我方精灵图片 - 使用增强动画组件 */}
                    <div className="sprite-wrapper" style={{position: 'relative', transform: 'scale(1.0)', transformOrigin: 'center bottom', marginBottom: '10px', marginLeft: '20px'}}>
                         <div 
                             ref={(el) => {
                                 if (el && !el.dataset.animated) {
                                     el.dataset.animated = 'true';
                                     GSAPAnimations.petEntry(el, 0);
                                 }
                             }}
                             className={`sprite-v2 ${animEffect?.target==='player'?'anim-shake':''}`} 
                             style={{
                                 transform: 'scaleX(-1)', // 镜像翻转，背对玩家
                                 filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                                 animation: (animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'player') 
                                            ? 'shiny-flash-body 0.5s' : 'none'
                             }}>
                            {renderAvatar(p)}
                        </div>

                        {/* 特效层 */}
                        {animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'player' && <RenderShinyStars />}
                        {animEffect && animEffect.target === 'player' && renderEnhancedVfx(getVfxConfig(animEffect.type), 'player')}
                        {/* 技能释放特效 */}
                        {animEffect && animEffect.target === 'player' && animEffect.type !== 'SHINY_ENTRY' && ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE'].includes(animEffect.type) && (
                            <SkillCastEffect
                                type={animEffect.type}
                                x={window.innerWidth * 0.2}
                                y={window.innerHeight * 0.6}
                                onComplete={() => {}}
                            />
                        )}
                    </div>

                    {/* 我方 HUD (血条) */}
                    <div className="hud-card hud-player" style={{transform: 'scale(1.1)', transformOrigin: 'left bottom'}}>
                        {/* 第一行：名字 + 门派 + 状态 */}
                        <div className="hud-name-row" style={{display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold'}}>{p.name}</span>
                            {renderSectBadge(p, 'player')}
                            {renderStatusBadges(p)}
                        </div>
                        
                        {/* 🔥 [修改] 第二行：等级 (右对齐，放在血条上方，与敌方保持一致) */}
                        <div style={{fontSize:'14px', fontStyle:'italic', textAlign:'right', marginTop:'4px', marginRight:'2px'}}>
                            Lv.{p.level}
                        </div>

                        {/* 第三行：血条（使用增强组件） */}
                        <EnhancedHPBar 
                            current={p.currentHp} 
                            max={pStats.maxHp} 
                            label=""
                        />
                        {renderPartyIndicators(battle.playerCombatStates)}
                    </div>
                </div>

            </div>


            {/* 醒目的战斗日志浮层（使用增强组件） */}
            {battle.logs[0] && (
                <div className="battle-log-container" style={{
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '90%',
                    textAlign: 'center',
                    zIndex: 20,
                    pointerEvents: 'none' 
                }}>
                    <EnhancedBattleMessage 
                        key={battle.logs[0]}
                        message={battle.logs[0]}
                        type={battle.logs[0].includes('倒下了') ? 'error' : 
                              battle.logs[0].includes('胜利') || battle.logs[0].includes('成功') ? 'success' : 
                              battle.logs[0].includes('警告') ? 'warning' : 'info'}
                    />
                </div>
            )}

        </div>

        {/* 底部操作栏 */}
        <div className="battle-panel-v2" style={{height: '25%', minHeight: '180px'}}>
            {(battle.phase === 'input' || battle.phase === 'input_p1' || battle.phase === 'input_p2') ? (
              <div className="controls-area-v2">
                    {battle.isPvP && (
                        <div style={{textAlign:'center', background: (battle.phase === 'input' || battle.phase === 'input_p1') ? '#2196F3' : '#FF5252', color:'#fff', fontWeight:'bold', padding:'6px', fontSize:'12px', flexShrink: 0}}>
                            {(battle.phase === 'input' || battle.phase === 'input_p1') ? '🔵 1P (我方) 请行动' : '🔴 2P (对手) 请行动'}
                        </div>
                    )}
                    <div className="battle-row-layout">
                        {/* 技能按钮区 (使用增强组件) */}
                        <div className="moves-grid-v2" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gridTemplateRows: 'repeat(2, 1fr)',    
                            gap: '8px',
                            width: '100%',
                            height: '100%',
                            minHeight: '140px' 
                        }}>
                            {(() => {
                                const isP2Turn = battle.phase === 'input_p2';
                                const activeMoves = isP2Turn ? e.combatMoves : p.combatMoves;
                                return activeMoves.map((m, i) => (
                                    <EnhancedMoveButton
                                        key={i}
                                        move={{
                                            t: m.t || 'NORMAL',
                                            name: m.name,
                                            power: m.p || 0,
                                            pp: m.pp,
                                            maxPp: m.maxPP || 15
                                        }}
                                        onClick={() => { 
                                            if (battle.isPvP) {
                                                handlePvPInput(isP2Turn ? 2 : 1, 'move', i);
                                            } else {
                                                executeTurn(i);
                                            }
                                        }}
                                        disabled={m.pp <= 0}
                                        index={i}
                                    />
                                ));
                            })()}
                        </div>

                        {/* 侧边操作按钮 */}
                        {!battle.isPvP ? (
                            <div className="actions-sidebar">
                                <button className="action-btn-v2 btn-catch" onClick={() => { setShowBallMenu(true); setBattleBagTab('balls'); }}><span>🎒</span><span>背包</span></button>
                                <button className="action-btn-v2 btn-switch" onClick={() => setBattle(prev => ({...prev, showSwitch: true}))}><span>🔄</span><span>交换</span></button>
                                <button className="action-btn-v2 btn-run" onClick={handleRun} disabled={battle.isTrainer || battle.isGym || battle.isChallenge || battle.isStory}><span>🏃</span><span>逃跑</span></button>
                            </div>
                        ) : (
                            <div className="actions-sidebar">
                                <button className="action-btn-v2" style={{background:'#673AB7', height:'100%'}} onClick={() => { const team = (battle.phase === 'input_p2') ? battle.enemyParty : battle.playerCombatStates; const input = prompt("输入要交换的精灵序号 (1-6):"); const idx = parseInt(input) - 1; if (!isNaN(idx) && idx >= 0 && idx < team.length) { handlePvPInput((battle.phase === 'input_p2') ? 2 : 1, 'switch', idx); } }}><span>🔄</span><span>换人</span></button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#666', fontWeight:'bold', fontSize:'18px'}}>{battle.phase === 'busy' ? '回合结算中...' : '等待行动...'}</div>
            )}
        </div> 
        
        {/* 战斗内背包弹窗 */}
        {showBallMenu && (
          <div className="ball-menu-overlay" onClick={() => setShowBallMenu(false)}>
            <div className="ball-menu-card" onClick={e => e.stopPropagation()}>
              <div className="bag-header"><div className={`bag-tab ${battleBagTab==='balls'?'active':''}`} onClick={()=>setBattleBagTab('balls')}>🔴 精灵球</div><div className={`bag-tab ${battleBagTab==='meds'?'active':''}`} onClick={()=>setBattleBagTab('meds')}>💊 药品</div></div>
              <div className="bag-list-area">
                {battleBagTab === 'balls' && (
                  <>
                    {Object.keys(inventory.balls).filter(k => inventory.balls[k] > 0).length === 0 && <div className="empty-hint">没有可用的精灵球</div>}
                    {Object.keys(inventory.balls).map(type => { const count = inventory.balls[type]; if (count <= 0) return null; const ball = BALLS[type]; return ( <div key={type} className="bag-list-item" onClick={() => handleCatch(type)}><div className="item-icon-box">{ball.icon}</div><div className="item-info-box"><div className="item-name">{ball.name}</div><div className="item-desc">{ball.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
                  </>
                )}
                {battleBagTab === 'meds' && (
                  <>
                    {Object.keys(inventory.meds).filter(k => inventory.meds[k] > 0).length === 0 && <div className="empty-hint">没有可用的药品</div>}
                    {Object.keys(inventory.meds).map(key => { const count = inventory.meds[key]; if (count <= 0) return null; const item = MEDICINES[key]; return ( <div key={key} className="bag-list-item" onClick={() => useBattleItem(key, 'meds')}><div className="item-icon-box">{item.icon}</div><div className="item-info-box"><div className="item-name">{item.name}</div><div className="item-desc">{item.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
                  </>
                )}
              </div>
              <button className="btn-close-bag" onClick={() => setShowBallMenu(false)}>关闭背包</button>
            </div>
          </div>
        )}
      </div>
    );
  };

     // ==========================================
  // 4. [优化] 联机对战 (居中弹窗版)
  // ==========================================
  const renderPvPModal = () => {
      if (!pvpMode) return null;

      const generatePvPCode = () => {
        if (party.length === 0) return;
        const exportData = { 
            name: trainerName, 
            team: party.map(p => ({ 
                id: p.id, level: p.level, moves: p.moves, ivs: p.ivs, evs: p.evs, 
                nature: p.nature, isShiny: p.isShiny, isFusedShiny: p.isFusedShiny, 
                customBaseStats: p.customBaseStats, equips: p.equips, name: p.name 
            })) 
        };
        try { 
            const code = btoa(encodeURIComponent(JSON.stringify(exportData))); 
            navigator.clipboard.writeText(code).then(() => alert("✅ 对战码已复制！\n请发送给您的对手。")); 
        } catch (e) { alert("生成失败"); }
      };

      const handleImportPvP = () => {
          if (!pvpCodeInput) { alert("请输入对战码！"); return; }
          try {
              const cleanCode = pvpCodeInput.replace(/[\s\n\r]/g, '');
              const data = JSON.parse(decodeURIComponent(atob(cleanCode)));
              if (!data || !data.team) throw new Error("数据错误");
              
              if (confirm(`接受来自【${data.name || '神秘人'}】的挑战？`)) { 
                  setPvpMode(false); 
                  setPvpCodeInput(''); 
                  startBattle({ 
                      id: 9999, 
                      customParty: data.team, 
                      trainerName: data.name 
                  }, 'pvp'); 
              }
          } catch (e) { alert(`❌ 无效的对战码！`); }
      };

      return (
          // 🔥 核心修改：全屏遮罩 + Flex 居中
          <div className="modal-overlay" onClick={() => setPvpMode(false)} style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              zIndex: 3000
          }}>
              {/* 终端卡片主体 */}
              <div onClick={e => e.stopPropagation()} style={{
                  width: '420px', 
                  background: '#1a237e', 
                  color: '#fff', 
                  borderRadius: '20px', 
                  border: '1px solid #536DFE', 
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)', 
                  overflow: 'hidden',
                  animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                  {/* 标题栏 */}
                  <div style={{
                      padding: '15px 20px', 
                      background: 'linear-gradient(90deg, #304FFE, #1a237e)', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}>
                      <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize:'16px'}}>
                          <span style={{fontSize:'20px'}}>⚔️</span> 联机对战终端
                      </div>
                      <button onClick={() => setPvpMode(false)} style={{
                          background:'transparent', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer', opacity:0.8
                      }}>×</button>
                  </div>

                  {/* 内容区域 */}
                  <div style={{padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px'}}>
                      
                      {/* 上半部分：生成 */}
                      <div style={{textAlign: 'center'}}>
                          <div style={{fontSize: '12px', color: '#8C9EFF', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold'}}>
                              我是擂主 (Host)
                          </div>
                          <button onClick={generatePvPCode} style={{
                              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                              background: 'linear-gradient(90deg, #00E676, #00C853)', 
                              color: '#003300', fontWeight: 'bold', fontSize:'15px', cursor:'pointer', 
                              boxShadow: '0 4px 15px rgba(0, 230, 118, 0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}>
                              <span>📤</span> 生成并复制对战码
                          </button>
                          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.5)', marginTop:'8px'}}>
                              将生成的代码发送给朋友，等待挑战
                          </div>
                      </div>

                      {/* 分割线 */}
                      <div style={{display:'flex', alignItems:'center', gap:'10px', opacity:0.3}}>
                          <div style={{flex:1, height:'1px', background:'#fff'}}></div>
                          <div style={{fontSize:'12px'}}>OR</div>
                          <div style={{flex:1, height:'1px', background:'#fff'}}></div>
                      </div>

                      {/* 下半部分：加入 */}
                      <div style={{textAlign: 'center'}}>
                          <div style={{fontSize: '12px', color: '#FF8A80', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold'}}>
                              我是挑战者 (Guest)
                          </div>
                          <textarea 
                              value={pvpCodeInput} 
                              onChange={(e) => setPvpCodeInput(e.target.value)} 
                              placeholder="在此粘贴对手发来的对战码..." 
                              style={{
                                  width: '100%', height: '70px', borderRadius: '12px', 
                                  border: '1px solid #536DFE', marginBottom: '15px', 
                                  background: 'rgba(0,0,0,0.2)', color: '#fff', padding: '12px', 
                                  fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'monospace'
                              }} 
                          />
                          <button onClick={handleImportPvP} style={{
                              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                              background: 'linear-gradient(90deg, #FF5252, #D32F2F)', 
                              color: '#fff', fontWeight: 'bold', fontSize:'15px', cursor:'pointer', 
                              boxShadow: '0 4px 15px rgba(255, 82, 82, 0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}>
                              <span>⚔️</span> 开始对战
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

      const renderShop = () => {
    if (!shopMode) return null;
    const growthItems = GROWTH_ITEMS;
    const specialItems = [MISC_ITEMS.rebirth_pill];

    return (
      <div className="modal-overlay">
      
        <div className="shop-modal-pro">
          {/* 侧边导航栏 */}
          <div className="shop-nav-sidebar">
            <div className={`shop-nav-item ${shopTab==='balls'?'active':''}`} onClick={()=>setShopTab('balls')}>精灵球</div>
            <div className={`shop-nav-item ${shopTab==='items'?'active':''}`} onClick={()=>setShopTab('items')}>药品</div>
            <div className={`shop-nav-item ${shopTab==='tms'?'active':''}`} onClick={()=>setShopTab('tms')}>技能书</div>
            
            {/* 🔥 [新增] 进化石 Tab (获得6个徽章后显示) */}
            {badges.length >= 6 && (
                <div className={`shop-nav-item ${shopTab==='stones'?'active':''}`} onClick={()=>setShopTab('stones')}>进化石</div>
            )}

            <div className={`shop-nav-item ${shopTab==='growth'?'active':''}`} onClick={()=>setShopTab('growth')}>增强</div>
            <div className={`shop-nav-item ${shopTab==='accessories'?'active':''}`} onClick={()=>setShopTab('accessories')}>饰品</div>
            
            <div className="shop-balance-display" style={{marginTop:'auto', padding:'10px', textAlign:'center', borderTop:'1px solid #eee', fontWeight:'bold', color:'#FF9800'}}>
                💰 {gold}
            </div>
            <button className="btn-close" style={{margin:'10px', padding:'5px', background:'#eee', border:'none', borderRadius:'4px'}} onClick={() => setShopMode(false)}>关闭</button>
          </div>

          <div className="shop-content-area">
            <div className="shop-grid-pro">
              
              {/* 1. 精灵球 */}
              {shopTab === 'balls' && Object.keys(BALLS).map(type => {
                if (type === 'master') return null;
                const item = BALLS[type];
                const buyId = `ball_${type}`;
                const count = buyCounts[buyId] || 1;
                const price = item.price * count;
                return (
                  <div key={type} className="shop-card-pro">
                    <div className="shop-pro-icon">{item.icon}</div>
                    <div className="shop-pro-name">{item.name}</div>
                    <div className="shop-pro-desc">{item.desc}</div>
                    <div className="shop-pro-price">💰 {price}</div>
                    <div className="shop-counter">
                      <div className="btn-counter" onClick={() => updateBuyCount(buyId, -1)}>-</div>
                      <div className="counter-val">{count}</div>
                      <div className="btn-counter" onClick={() => updateBuyCount(buyId, 1)}>+</div>
                    </div>
                    <button className="btn-buy-pro" onClick={() => buyItemPro(buyId, item.price, 'ball')} disabled={gold < price}>购买</button>
                  </div>
                );
              })}

              {/* 2. 药品 */}
              {shopTab === 'items' && Object.keys(MEDICINES).map(key => {
                const item = MEDICINES[key];
                const count = buyCounts[key] || 1;
                const price = item.price * count;
                return (
                  <div key={key} className="shop-card-pro">
                    <div className="shop-pro-icon">{item.icon}</div>
                    <div className="shop-pro-name">{item.name}</div>
                    <div className="shop-pro-desc">{item.desc}</div>
                    <div className="shop-pro-price">💰 {price}</div>
                    <div className="shop-counter">
                      <div className="btn-counter" onClick={() => updateBuyCount(key, -1)}>-</div>
                      <div className="counter-val">{count}</div>
                      <div className="btn-counter" onClick={() => updateBuyCount(key, 1)}>+</div>
                    </div>
                    <button className="btn-buy-pro" onClick={() => buyItemPro(key, item.price, 'item')} disabled={gold < price}>购买</button>
                  </div>
                );
              })}

              {/* 3. 技能书 */}
              {shopTab === 'tms' && TMS.map(tm => {
                const count = buyCounts[tm.id] || 1;
                const price = tm.price * count;
                return (
                  <div key={tm.id} className="shop-card-pro" style={{borderLeft: `3px solid ${TYPES[tm.type].color}`}}>
                    <div className="shop-pro-icon">💿</div>
                    <div className="shop-pro-name">{tm.name}</div>
                    <div className="shop-pro-desc" style={{color: TYPES[tm.type].color, fontWeight:'bold'}}>{TYPES[tm.type].name}</div>
                    <div className="shop-pro-desc">{tm.desc}</div>
                    <div className="shop-pro-price">💰 {price}</div>
                    <div className="shop-counter">
                      <div className="btn-counter" onClick={() => updateBuyCount(tm.id, -1)}>-</div>
                      <div className="counter-val">{count}</div>
                      <div className="btn-counter" onClick={() => updateBuyCount(tm.id, 1)}>+</div>
                    </div>
                    <button className="btn-buy-pro" onClick={() => buyItemPro(tm.id, tm.price, 'tm')} disabled={gold < price}>购买</button>
                  </div>
                );
              })}

              {/* 🔥 [新增] 4. 进化石 (核心部分) */}
              {shopTab === 'stones' && Object.keys(EVO_STONES).map(key => {
                const item = EVO_STONES[key];
                const count = buyCounts[key] || 1;
                const price = item.price * count;
                return (
                  <div key={key} className="shop-card-pro" style={{borderColor: '#7B1FA2'}}>
                    <div className="shop-pro-icon">{item.icon}</div>
                    <div className="shop-pro-name" style={{color:'#7B1FA2'}}>{item.name}</div>
                    <div className="shop-pro-desc">{item.desc}</div>
                    <div className="shop-pro-price">💰 {price}</div>
                    <div className="shop-counter">
                      <div className="btn-counter" onClick={() => updateBuyCount(key, -1)}>-</div>
                      <div className="counter-val">{count}</div>
                      <div className="btn-counter" onClick={() => updateBuyCount(key, 1)}>+</div>
                    </div>
                    <button className="btn-buy-pro" onClick={() => buyItemPro(key, item.price, 'stone')} disabled={gold < price}>购买</button>
                  </div>
                );
              })}

              {/* 5. 增强 */}
              {shopTab === 'growth' && (
                <>
                    {growthItems.map(item => {
                        const count = buyCounts[item.id] || 1;
                        const price = item.price * count;
                        return (
                        <div key={item.id} className="shop-card-pro" style={{borderColor: '#FFD700'}}>
                            <div className="shop-pro-icon">{item.emoji}</div>
                            <div className="shop-pro-name" style={{color:'#E65100'}}>{item.name}</div>
                            <div className="shop-pro-desc">{item.desc}</div>
                            <div className="shop-pro-price">💰 {price}</div>
                            <div className="shop-counter">
                            <div className="btn-counter" onClick={() => updateBuyCount(item.id, -1)}>-</div>
                            <div className="counter-val">{count}</div>
                            <div className="btn-counter" onClick={() => updateBuyCount(item.id, 1)}>+</div>
                            </div>
                            <button className="btn-buy-pro" onClick={() => buyItemPro(item.id, item.price, 'item')} disabled={gold < price}>购买</button>
                        </div>
                        );
                    })}
                    {specialItems.map(item => {
                        const count = buyCounts[item.id] || 1;
                        const price = item.price * count;
                        return (
                        <div key={item.id} className="shop-card-pro" style={{borderColor: '#E91E63'}}>
                            <div className="shop-pro-icon">{item.icon}</div>
                            <div className="shop-pro-name" style={{color:'#C2185B'}}>{item.name}</div>
                            <div className="shop-pro-desc">{item.desc}</div>
                            <div className="shop-pro-price">💰 {price}</div>
                            <div className="shop-counter">
                            <div className="btn-counter" onClick={() => updateBuyCount(item.id, -1)}>-</div>
                            <div className="counter-val">{count}</div>
                            <div className="btn-counter" onClick={() => updateBuyCount(item.id, 1)}>+</div>
                            </div>
                            <button className="btn-buy-pro" onClick={() => buyItemPro(item.id, item.price, 'item')} disabled={gold < price}>购买</button>
                        </div>
                        );
                    })}
                </>
              )}

              {/* 6. 饰品 */}
              {shopTab === 'accessories' && ACCESSORY_DB.map(acc => {
                if (acc.id === 'trophy') return null;
                const count = buyCounts[acc.id] || 1;
                const price = acc.price * count;
                return (
                  <div key={acc.id} className="shop-card-pro">
                    <div className="shop-pro-icon">{acc.icon}</div>
                    <div className="shop-pro-name">{acc.name}</div>
                    <div className="shop-pro-desc">{acc.desc}</div>
                    <div className="shop-pro-price">💰 {price}</div>
                    <div className="shop-counter">
                      <div className="btn-counter" onClick={() => updateBuyCount(acc.id, -1)}>-</div>
                      <div className="counter-val">{count}</div>
                      <div className="btn-counter" onClick={() => updateBuyCount(acc.id, 1)}>+</div>
                    </div>
                    <button className="btn-buy-pro" onClick={() => buyItemPro(acc.id, acc.price, 'acc')} disabled={gold < price}>购买</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };


    // ==========================================
  // [完整重构] PC 管理终端 (居中大屏版)
  // ==========================================
  const renderPC = () => {
    if (!pcMode) return null;
    
    const selectedPet = selectedPartyIdx !== null ? party[selectedPartyIdx] : (selectedBoxIdx !== null ? box[selectedBoxIdx] : null);
    const stats = selectedPet ? getStats(selectedPet) : null;
    const nature = selectedPet ? NATURE_DB[selectedPet.nature || 'docile'] : null;

    return (
      <div className="modal-overlay" onClick={() => setPcMode(false)} style={{
        // 🔴 1. 强制全屏居中遮罩
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)', // 深色背景遮罩
        backdropFilter: 'blur(4px)',
        zIndex: 1000
      }}>
        {/* 🔴 2. 模态框主体 (阻止冒泡防止点击关闭) */}
        <div className="pc-modal-tech" onClick={e => e.stopPropagation()} style={{
          width: '95%',
          maxWidth: '1100px', // 足够宽，容纳三列
          height: '85vh',     // 固定高度
          background: '#1a1a2e', // 深色科技背景
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid #333',
          color: '#fff'
        }}>
          
          {/* 顶部标题栏 */}
          <div className="pc-header-tech" style={{
            background: '#16213e', 
            padding: '15px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #333'
          }}>
            <div className="pc-title-tech" style={{fontSize: '18px', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{color:'#00E676', fontSize:'12px'}}>● ONLINE</span> 
                PC 宝可梦管理终端
            </div>
            <button className="btn-close" style={{background:'transparent', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer'}} onClick={() => setPcMode(false)}>✕</button>
          </div>
          
          {/* 🔴 3. 三列布局核心区域 */}
          <div className="pc-layout-tech" style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden', // 防止整个页面滚动
              padding: '20px',
              gap: '20px' // 列间距
          }}>
            
            {/* === 左侧：当前队伍 (固定宽度) === */}
            <div className="pc-col-left" style={{ 
                width: '260px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column',
                background: '#16213e',
                borderRadius: '12px',
                padding: '10px'
            }}>
              <div className="pc-section-header" style={{marginBottom:'10px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  当前队伍 ({party.length}/6)
              </div>
              <div className="pc-party-list-tech" style={{overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                {party.map((p, i) => (
                  <div key={i} 
                       onClick={() => { setSelectedPartyIdx(i); setSelectedBoxIdx(null); }}
                       style={{
                           display: 'flex', alignItems: 'center', padding: '10px',
                           background: selectedPartyIdx===i ? '#2196F3' : 'rgba(255,255,255,0.05)',
                           borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                           border: selectedPartyIdx===i ? '1px solid #64B5F6' : '1px solid transparent'
                       }}
                  >
                    <div style={{fontSize:'24px', marginRight:'10px'}}>{renderAvatar(p)}</div>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'14px'}}>{p.name}</div>
                      <div style={{fontSize:'11px', opacity:0.7}}>Lv.{p.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === 中间：仓库列表 (自适应宽度) === */}
            <div className="pc-col-mid" style={{ 
                flex: 1, 
                display:'flex', 
                flexDirection:'column', 
                background:'rgba(0,0,0,0.2)', 
                borderRadius:'12px', 
                padding:'10px',
                border: '1px solid #333'
            }}>
              <div className="pc-section-header" style={{marginBottom:'10px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  存储箱 ({box.length})
              </div>
              <div className="pc-box-grid-tech" style={{ 
                  display:'grid', 
                  gridTemplateColumns:'repeat(auto-fill, minmax(60px, 1fr))', 
                  gap:'8px', 
                  overflowY:'auto',
                  alignContent: 'start',
                  flex: 1
              }}>
                {box.map((p, i) => (
                  <div key={i} 
                       onClick={() => { setSelectedBoxIdx(i); setSelectedPartyIdx(null); }}
                       style={{
                           aspectRatio: '1/1',
                           background: selectedBoxIdx===i ? '#FF9800' : 'rgba(255,255,255,0.1)',
                           borderRadius: '8px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '28px', cursor: 'pointer',
                           border: selectedBoxIdx===i ? '2px solid #FFB74D' : 'none'
                       }}
                  >
                    {renderAvatar(p)}
                  </div>
                ))}
                {/* 补几个空格子占位，好看一点 */}
                {[...Array(Math.max(0, 20 - box.length))].map((_, i) => (
                    <div key={`empty-${i}`} style={{background:'rgba(255,255,255,0.03)', borderRadius:'8px'}}></div>
                ))}
              </div>
            </div>

            {/* === 右侧：详细数据 (固定宽度，防止挤压) === */}
            <div className="pc-col-right" style={{ 
                width: '320px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column', 
                background:'#232336', 
                borderRadius:'12px', 
                padding:'15px',
                borderLeft: '1px solid #333'
            }}>
              <div className="pc-section-header" style={{marginBottom:'15px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  数据分析模块
              </div>
              
              {selectedPet ? (
                <div className="analysis-panel" style={{overflowY: 'auto', paddingRight: '4px', display:'flex', flexDirection:'column', height:'100%'}}>
                  
                  {/* 1. 基础头部信息 */}
                  <div className="analysis-header" style={{display:'flex', alignItems:'center', marginBottom:'15px', paddingBottom:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                      <div className="analysis-sprite" style={{
                          width:'60px', height:'60px', marginRight:'15px', 
                          background:'rgba(255,255,255,0.1)', borderRadius:'50%', 
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'35px'
                      }}>
                          {renderAvatar(selectedPet)}
                      </div>
                      <div style={{flex:1}}>
                          <div className="analysis-name" style={{fontSize:'18px', fontWeight:'bold', color:'#fff', marginBottom:'6px'}}>
                              {selectedPet.name} {selectedPet.isShiny && <span style={{color:'#FFD700'}}>✨</span>}
                          </div>
                          <div className="analysis-types" style={{display:'flex', gap:'5px'}}>
                            <span className="analysis-tag" style={{background: TYPES[selectedPet.type]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                {TYPES[selectedPet.type]?.name}
                            </span>
                            {selectedPet.secondaryType && (
                                <span className="analysis-tag" style={{background: TYPES[selectedPet.secondaryType]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                    {TYPES[selectedPet.secondaryType]?.name}
                                </span>
                            )}
                            <span className="analysis-tag" style={{background:'#444', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px'}}>
                                Lv.{selectedPet.level}
                            </span>
                          </div>
                      </div>
                  </div>

                  {/* 2. 性格显示 (带悬停提示) */}
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'8px 12px', borderRadius:'6px', marginBottom:'15px', fontSize:'12px', display:'flex', justifyContent:'space-between', alignItems:'center', overflow:'visible'}}>
                      <span style={{color:'#aaa'}}>性格倾向</span>
                      
                      <div 
                          style={{position:'relative', cursor:'help', display:'flex', alignItems:'center'}}
                          onMouseEnter={() => setStatTooltip('nature')}
                          onMouseLeave={() => setStatTooltip(null)}
                      >
                          <span style={{color:'#fff', fontWeight:'bold', marginRight:'5px', borderBottom:'1px dashed #666'}}>{nature?.name}</span>
                          <span style={{color:'#888'}}>({nature?.desc})</span>

                          {/* 悬停提示框 */}
                          {statTooltip === 'nature' && (
                              <div style={{
                                  position:'absolute', bottom:'130%', right:'-10px', width:'160px',
                                  background:'rgba(0,0,0,0.95)', backdropFilter:'blur(4px)',
                                  border:'1px solid #444', borderRadius:'8px', padding:'10px',
                                  zIndex: 100, boxShadow:'0 4px 15px rgba(0,0,0,0.5)',
                                  pointerEvents:'none', textAlign:'left'
                              }}>
                                  <div style={{color:'#fff', fontWeight:'bold', marginBottom:'6px', borderBottom:'1px solid #555', paddingBottom:'4px', fontSize:'12px'}}>
                                      性格修正详情
                                  </div>
                                  {Object.keys(nature?.stats || {}).length === 0 ? (
                                      <div style={{color:'#ccc', fontSize:'11px'}}>无属性影响</div>
                                  ) : (
                                      Object.entries(nature.stats).map(([key, val]) => {
                                          const statMap = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', hp:'HP' };
                                          const isUp = val > 1;
                                          const pct = Math.round(Math.abs(val - 1) * 100);
                                          return (
                                              <div key={key} style={{display:'flex', justifyContent:'space-between', marginBottom:'3px', fontSize:'11px'}}>
                                                  <span style={{color:'#ccc'}}>{statMap[key]}</span>
                                                  <span style={{color: isUp ? '#FF5252' : '#2196F3', fontWeight:'bold'}}>
                                                      {isUp ? '▲' : '▼'} {pct}%
                                                  </span>
                                              </div>
                                          );
                                      })
                                  )}
                              </div>
                          )}
                      </div>
                  </div>

                  {/* 3. 六维属性网格 */}
                  <div className="stats-grid-tech" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                      {[
                          {l:'HP', v:`${selectedPet.currentHp}/${stats.maxHp}`, c:'#4CAF50', w: (selectedPet.currentHp/stats.maxHp)*100},
                          {l:'速度', v:stats.spd, c:'#FFC107', w: (stats.spd/250)*100},
                          {l:'物攻', v:stats.p_atk, c:'#FF5252', w: (stats.p_atk/250)*100},
                          {l:'物防', v:stats.p_def, c:'#2196F3', w: (stats.p_def/250)*100},
                          {l:'特攻', v:stats.s_atk, c:'#E91E63', w: (stats.s_atk/250)*100},
                          {l:'特防', v:stats.s_def, c:'#3F51B5', w: (stats.s_def/250)*100},
                      ].map((s, i) => (
                          <div key={i} style={{background:'rgba(255,255,255,0.05)', padding:'8px', borderRadius:'6px'}}>
                              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#aaa', marginBottom:'4px'}}>
                                  <span>{s.l}</span>
                                  <span style={{color:'#fff', fontWeight:'bold', fontFamily:'monospace'}}>{s.v}</span>
                              </div>
                              <div style={{height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                  <div style={{width:`${Math.min(100, s.w)}%`, background:s.c, height:'100%'}}></div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* 4. 技能列表 */}
                  <div style={{flex:1, overflowY:'auto', marginBottom:'15px'}}>
                      <div style={{fontSize:'12px', color:'#aaa', marginBottom:'8px', borderBottom:'1px solid #444', paddingBottom:'4px'}}>已学会技能</div>
                      <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                          {selectedPet.moves.map((m, i) => (
                              <div key={i} style={{
                                  display:'flex', justifyContent:'space-between', alignItems:'center',
                                  background:'rgba(255,255,255,0.05)', padding:'8px 10px', borderRadius:'6px',
                                  borderLeft: `3px solid ${TYPES[m.t]?.color}`
                              }}>
                                  <div style={{flex:1}}>
                                      <div style={{fontSize:'12px', fontWeight:'bold', color:'#fff'}}>{m.name}</div>
                                      <div style={{fontSize:'10px', color: TYPES[m.t]?.color, marginTop:'2px'}}>{TYPES[m.t]?.name} | 威力 {m.p}</div>
                                  </div>
                                  <div style={{fontSize:'10px', color:'#888', textAlign:'right'}}>
                                      <div>PP</div>
                                      <div style={{color:'#fff'}}>{m.pp}/{m.maxPP||15}</div>
                                  </div>
                              </div>
                          ))}
                          {[...Array(4 - selectedPet.moves.length)].map((_, i) => (
                              <div key={`empty-${i}`} style={{
                                  padding:'8px', borderRadius:'6px', border:'1px dashed #444', 
                                  fontSize:'11px', color:'#555', textAlign:'center'
                              }}>
                                  - 空技能槽 -
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* 5. 底部操作按钮 */}
                  <div className="pc-actions-tech" style={{marginTop:'auto', paddingTop:'15px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'10px'}}>
                    {selectedPartyIdx !== null && (
                      <button className="btn-tech primary" onClick={depositPokemon} style={{flex:1, padding:'10px', background:'#2196F3', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                        📥 存入仓库
                      </button>
                    )}
                    {selectedBoxIdx !== null && (
                      <>
                        <button className="btn-tech primary" onClick={withdrawPokemon} style={{flex:1, padding:'10px', background:'#4CAF50', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          📤 取出队伍
                        </button>
                        <button className="btn-tech danger" onClick={releasePokemon} style={{flex:1, padding:'10px', background:'#FF5252', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          👋 放生
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{color: '#666', textAlign: 'center', marginTop: '100px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <span style={{fontSize:'50px', marginBottom:'15px', opacity:0.3}}>🔍</span>
                    <div style={{fontSize:'14px'}}>请在左侧选择一只精灵<br/>查看详细数据分析</div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

   // ==========================================
  // [新增] 洗练专属界面 UI
  // ==========================================
  const renderRebirthModal = () => {
    if (!rebirthData) return null;

    const { original, preview } = rebirthData;
    const pillCount = inventory.misc.rebirth_pill || 0;
    
    // 【需求2修改】计算显示消耗
    const cost = original.isShiny ? 2 : 1;

    // 辅助显示属性行
    const StatRow = ({ label, oldVal, newVal, max }) => {
        // 计算进度条
        const oldPct = Math.min(100, (oldVal / max) * 100);
        const newPct = newVal ? Math.min(100, (newVal / max) * 100) : 0;
        const diff = newVal ? newVal - oldVal : 0;
        
        return (
            <div style={{display:'flex', alignItems:'center', marginBottom:'8px', fontSize:'12px'}}>
                <div style={{width:'30px', color:'#aaa', fontWeight:'bold'}}>{label}</div>
                <div style={{flex:1, background:'rgba(255,255,255,0.1)', height:'6px', borderRadius:'3px', margin:'0 10px', position:'relative'}}>
                    {/* 旧值 (灰色) */}
                    <div style={{position:'absolute', left:0, top:0, bottom:0, width:`${oldPct}%`, background:'#666', borderRadius:'3px'}}></div>
                    {/* 新值 (彩色) - 只有在预览时显示 */}
                    {newVal && (
                        <div style={{
                            position:'absolute', left:0, top:0, bottom:0, width:`${newPct}%`, 
                            background: diff >= 0 ? '#00E676' : '#FF5252', 
                            borderRadius:'3px', opacity: 0.8
                        }}></div>
                    )}
                </div>
                <div style={{width:'60px', textAlign:'right', fontFamily:'monospace'}}>
                    {newVal ? (
                        <>
                            <span style={{color: diff>=0?'#00E676':'#FF5252'}}>{newVal}</span>
                            {diff !== 0 && <span style={{fontSize:'10px', marginLeft:'2px'}}>{diff>0?'↑':'↓'}</span>}
                        </>
                    ) : (
                        <span style={{color:'#fff'}}>{oldVal}</span>
                    )}
                </div>
            </div>
        );
    };

    // 计算显示的属性 (为了对比，我们将原宠物也临时降级到5级来计算属性，这样对比才公平)
    const oldPetLv5 = { ...original, level: 5 };
    const oldStats = getStats(oldPetLv5);
    const newStats = preview ? getStats(preview) : null;

    // 计算总潜力 (IV总和)
    const getPotentialScore = (p) => Object.values(p.ivs).reduce((a,b)=>a+b,0);
    const oldScore = getPotentialScore(original);
    const newScore = preview ? getPotentialScore(preview) : 0;
    
    const getRank = (score) => {
        if (score > 150) return {t:'S+', c:'#FFD700'};
        if (score > 120) return {t:'S', c:'#FF4081'};
        if (score > 90) return {t:'A', c:'#AB47BC'};
        if (score > 60) return {t:'B', c:'#42A5F5'};
        return {t:'C', c:'#9E9E9E'};
    };

    return (
      <div className="modal-overlay" style={{backdropFilter:'blur(10px)', background:'rgba(0,0,0,0.8)'}}>
        <div className="rebirth-panel" style={{
            width:'90%', maxWidth:'380px', background:'linear-gradient(160deg, #2a1a4a 0%, #1a1a2e 100%)',
            borderRadius:'20px', padding:'20px', color:'#fff', border:'1px solid #4a3b78',
            boxShadow:'0 0 30px rgba(123, 31, 162, 0.4)'
        }}>
            
            {/* 标题 */}
            <div style={{textAlign:'center', marginBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'10px'}}>
                <div style={{fontSize:'20px', fontWeight:'bold', color:'#E1BEE7', textShadow:'0 0 10px #E1BEE7'}}>🧬 基因重组</div>
                <div style={{fontSize:'12px', color:'#B39DDB', marginTop:'4px'}}>重置为 Lv.5 | 刷新资质与性格</div>
            </div>

            {/* 核心对比区 */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                
                {/* 左侧：当前 */}
                <div style={{textAlign:'center', opacity: preview ? 0.5 : 1, transition:'0.3s'}}>
                    <div style={{fontSize:'30px', filter:'grayscale(0.5)'}}>{renderAvatar(original)}</div>
                    <div style={{fontSize:'12px', marginTop:'5px'}}>当前资质</div>
                    <div style={{fontSize:'18px', fontWeight:'bold', color: getRank(oldScore).c}}>{getRank(oldScore).t}</div>
                </div>

                {/* 中间：箭头 */}
                <div style={{fontSize:'24px', color:'#666'}}>➞</div>

                {/* 右侧：预览 */}
                <div style={{textAlign:'center', transform: preview ? 'scale(1.1)' : 'scale(1)', transition:'0.3s'}}>
                    {preview ? (
                        <>
                            <div style={{fontSize:'30px', filter: preview.isShiny ? 'drop-shadow(0 0 5px gold)' : 'none'}}>
                                {renderAvatar(preview)}
                            </div>
                            <div style={{fontSize:'12px', marginTop:'5px', color:'#00E676'}}>新资质</div>
                            <div style={{fontSize:'20px', fontWeight:'bold', color: getRank(newScore).c, textShadow:'0 0 10px currentColor'}}>
                                {getRank(newScore).t}
                            </div>
                        </>
                    ) : (
                        <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px dashed #666', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'}}>
                            <span style={{fontSize:'20px', color:'#666'}}>?</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 属性详情 */}
            <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'12px', padding:'15px', marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'10px', color:'#ccc'}}>
                    <span>性格: {NATURE_DB[original.nature].name}</span>
                    <span>➞</span>
                    <span style={{color: preview ? '#fff' : '#666', fontWeight:'bold'}}>
                        {preview ? NATURE_DB[preview.nature].name : '???'}
                    </span>
                </div>
                
                <StatRow label="HP" oldVal={oldStats.maxHp} newVal={newStats?.maxHp} max={100} />
                <StatRow label="物攻" oldVal={oldStats.p_atk} newVal={newStats?.p_atk} max={80} />
                <StatRow label="物防" oldVal={oldStats.p_def} newVal={newStats?.p_def} max={80} />
                <StatRow label="特攻" oldVal={oldStats.s_atk} newVal={newStats?.s_atk} max={80} />
                <StatRow label="特防" oldVal={oldStats.s_def} newVal={newStats?.s_def} max={80} />
                <StatRow label="速度" oldVal={oldStats.spd} newVal={newStats?.spd} max={80} />
            </div>

            {/* 操作区 */}
            <div style={{display:'flex', gap:'10px'}}>
                <button onClick={() => setRebirthData(null)} style={{
                    flex:1, padding:'12px', borderRadius:'10px', border:'none', background:'#424242', color:'#fff', fontWeight:'bold'
                }}>取消</button>
                
                {preview ? (
                    <button onClick={confirmRebirth} style={{
                        flex:2, padding:'12px', borderRadius:'10px', border:'none', 
                        background:'linear-gradient(90deg, #00C853, #64DD17)', color:'#fff', fontWeight:'bold',
                        boxShadow:'0 4px 10px rgba(0,200,83,0.4)'
                    }}>保存结果</button>
                ) : null}

                {/* 【需求2修改】按钮禁用逻辑和文本显示 */}
                <button onClick={executeReroll} disabled={pillCount < cost} style={{
                    flex:2, padding:'12px', borderRadius:'10px', border:'none', 
                    background: pillCount >= cost ? 'linear-gradient(90deg, #7B1FA2, #E91E63)' : '#555', 
                    color: pillCount >= cost ? '#fff' : '#999', fontWeight:'bold',
                    boxShadow: pillCount >= cost ? '0 4px 10px rgba(123,31,162,0.4)' : 'none',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', lineHeight:'1.2'
                }}>
                    <span>{preview ? '不满意? 重洗' : '开始洗练'}</span>
                    <span style={{fontSize:'10px', opacity:0.8}}>消耗: 💊 {cost} (余 {pillCount})</span>
                </button>
            </div>

        </div>
      </div>
    );
  };

    const renderTrainerCard = () => {
    const dexCount = caughtDex.length;
    const totalDex = POKEDEX.length;
    const progress = ((dexCount / totalDex) * 100).toFixed(1);
    const leader = party[0];

    return (
      <div className="screen" onClick={() => setView('grid_map')} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{
            width: '650px', height: '450px', // 稍微加高一点
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '6px solid #fff', position: 'relative'
        }}>
          {/* 顶部条 */}
          <div style={{
              height: '70px', background: '#1a237e', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 30px', color: '#fff', borderBottom: '4px solid #FFD700'
          }}>
             <div style={{display:'flex', flexDirection:'column'}}>
                 <span style={{fontSize: '22px', fontWeight: '900', letterSpacing: '2px'}}>TRAINER PASSPORT</span>
                 <span style={{fontSize: '10px', opacity: 0.7, letterSpacing: '1px'}}>ID: {Math.floor(party[0]?.uid || 9527).toString().slice(-8)}</span>
             </div>
             <div style={{textAlign:'right'}}>
                 <div style={{fontSize:'12px', opacity:0.8}}>REGION</div>
                 <div style={{fontWeight:'bold'}}>KANTO</div>
             </div>
          </div>

          {/* 内容区 */}
          <div style={{flex: 1, display: 'flex', padding: '25px'}}>
             
             {/* 左侧：头像与信息 */}
             <div style={{width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '2px dashed #ccc', paddingRight: '25px'}}>
                <div style={{
                    width: '130px', height: '130px', background: '#fff', borderRadius: '50%', 
                    border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '70px', marginBottom: '15px', overflow: 'hidden', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    {renderAvatar(leader) || '🤠'}
                </div>
                
                {/* 名字显示 */}
                <div style={{fontSize: '24px', fontWeight: '900', color: '#333', marginBottom:'5px'}}>{trainerName}</div>
                
                {/* 称号选择器 */}
                <div style={{position:'relative', width:'100%'}}>
                    <select 
                        value={currentTitle} 
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        style={{
                            width:'100%', padding:'5px 10px', borderRadius:'15px', border:'1px solid #2196F3',
                            background:'#E3F2FD', color:'#1565C0', fontWeight:'bold', fontSize:'12px',
                            appearance:'none', textAlign:'center', cursor:'pointer'
                        }}
                    >
                        {unlockedTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', fontSize:'10px', color:'#1565C0', pointerEvents:'none'}}>▼</div>
                </div>
             </div>

             {/* 右侧：数据统计 */}
             <div style={{flex: 1, paddingLeft: '30px', display: 'flex', flexDirection: 'column'}}>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Money</div>
                        <div style={{fontSize: '20px', color: '#FBC02D', fontWeight: '900'}}>💰 {gold}</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Pokedex</div>
                        <div style={{fontSize: '20px', color: '#333', fontWeight: '900'}}>{dexCount} <span style={{fontSize:'12px', color:'#999', fontWeight:'normal'}}>/ {totalDex}</span></div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Champion</div>
                        <div style={{fontSize: '20px', color: '#FF5722', fontWeight: '900'}}>🏆 {leagueWins}</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Progress</div>
                        <div style={{fontSize: '20px', color: '#2196F3', fontWeight: '900'}}>{progress}%</div>
                    </div>
                </div>

                {/* 徽章展示区 */}
                <div style={{background: '#fff', borderRadius: '12px', padding: '15px', flex: 1, border:'1px solid #eee', boxShadow:'inset 0 2px 5px rgba(0,0,0,0.05)'}}>
                    <div style={{fontSize: '10px', color: '#aaa', marginBottom: '10px', fontWeight: 'bold', letterSpacing:'1px'}}>BADGES COLLECTION</div>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                        {badges.length === 0 ? <span style={{fontSize:'12px', color:'#ddd', fontStyle:'italic'}}>暂未获得徽章...</span> : 
                         badges.map((b, i) => (
                             <div key={i} style={{
                                 width:'36px', height:'36px', background:'#f0f0f0', borderRadius:'50%',
                                 display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px',
                                 boxShadow:'0 2px 5px rgba(0,0,0,0.1)', border:'2px solid #fff'
                             }} title="Gym Badge">
                                 {b}
                             </div>
                         ))
                        }
                    </div>
                </div>

             </div>
          </div>

          {/* 底部关闭 */}
          <button onClick={() => setView('grid_map')} style={{
              position: 'absolute', bottom: '20px', right: '20px',
              background: '#333', color: '#fff', border: 'none', padding: '10px 30px',
              borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
              CLOSE
          </button>
        </div>
      </div>
    );
  };
  // ==========================================
  // [修复] 进化动画的 Hooks (必须放在主组件顶层)
  // ==========================================
  
  // 1. 动态注入 CSS 动画
  useEffect(() => {
      const styleId = 'evo-anim-style';
      if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
              @keyframes evo-shake { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(0); } 100% { transform: scale(1); filter: brightness(1); } }
              @keyframes evo-flash { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
              @keyframes evo-pop { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
              @keyframes bg-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `;
          document.head.appendChild(style);
      }
  }, []);

  // 2. 自动推进动画步骤 (监听 evoAnim 状态)
  useEffect(() => {
      if (!evoAnim) return; // 如果没有进化事件，直接返回
      
      const { step } = evoAnim;
      let timer;
      
      if (step === 0) {
          // 阶段0: 展示原形 -> 1.5秒后开始发光
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 1 })), 1500);
      } else if (step === 1) {
          // 阶段1: 快速闪烁/变黑 -> 2.5秒后进化
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 2 })), 2500);
      } else if (step === 2) {
          // 阶段2: 白屏闪光 -> 0.5秒后展示新形态
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 3 })), 500);
      }
      return () => clearTimeout(timer);
  }, [evoAnim]); // 依赖项为 evoAnim

    // ==========================================
  // [修复] 经典进化动画场景 (移除内部 Style 标签防止报错)
  // ==========================================
  const renderEvolutionScene = () => {
    if (!evoAnim) return null;
    const { oldPet, newPet, step } = evoAnim;

   
    const finishEvo = () => {
        if (step < 3) return; // 动画没放完不能跳过
        
        const newParty = [...party];
        // 继承旧属性，覆盖新种族值
        Object.assign(newParty[evoAnim.targetIdx], {
            ...newPet,
            uid: oldPet.uid, level: oldPet.level, exp: oldPet.exp, nextExp: oldPet.nextExp,
            moves: oldPet.moves, equip: oldPet.equip, equips: oldPet.equips,
            nature: oldPet.nature, ivs: oldPet.ivs, evs: oldPet.evs,
            isShiny: oldPet.isShiny, isFusedShiny: oldPet.isFusedShiny,
            intimacy: oldPet.intimacy, charm: oldPet.charm, trait: oldPet.trait,
            canEvolve: false, pendingLearnMove: oldPet.pendingLearnMove
        });
        // 进化后回满血
        const stats = getStats(newParty[evoAnim.targetIdx]);
        newParty[evoAnim.targetIdx].currentHp = stats.maxHp;
        
        setParty(newParty);
        
        // 开图鉴
        if (!caughtDex.includes(newPet.id)) setCaughtDex(prev => [...prev, newPet.id]);
        
        setEvoAnim(null); // 关闭动画
    };

    return (
        <div className="modal-overlay" style={{
            position:'fixed', inset:0, background:'#000', zIndex: 9999,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            color:'#fff'
        }}>
            {/* 背景光效 */}
            <div style={{
                position:'absolute', width:'100vw', height:'100vh', 
                background: step >= 2 ? 'radial-gradient(circle, #FFD700 0%, #000 70%)' : 'radial-gradient(circle, #222 0%, #000 90%)',
                transition: 'background 0.5s'
            }}></div>
            
            {/* 旋转光束 (仅完成时) */}
            {step === 3 && (
                <div style={{
                    position:'absolute', width:'800px', height:'800px', 
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 20deg, transparent 40deg)',
                    animation: 'bg-spin 10s linear infinite'
                }}></div>
            )}

            {/* 核心展示区 */}
            <div style={{position:'relative', zIndex:10, textAlign:'center'}}>
                
                {/* 标题 */}
                <div style={{fontSize:'24px', marginBottom:'40px', minHeight:'30px'}}>
                    {step < 2 ? `什么？ ${oldPet.name} 的样子...` : `恭喜！进化成了 ${newPet.name}！`}
                </div>

                {/* 精灵图 */}
                <div style={{
                    width:'200px', height:'200px', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'120px', margin:'0 auto', position:'relative'
                }}>
                    {/* 旧形态 */}
                    {step < 2 && (
                        <div style={{
                            animation: step === 1 ? 'evo-shake 0.2s infinite' : 'none',
                            transition: '0.5s'
                        }}>
                            {renderAvatar(oldPet)}
                        </div>
                    )}

                    {/* 新形态 */}
                    {step >= 2 && (
                        <div style={{animation: 'evo-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'}}>
                            {renderAvatar(newPet)}
                        </div>
                    )}

                    {/* 白屏闪光遮罩 */}
                    {step === 2 && (
                        <div style={{
                            position:'fixed', inset:0, background:'#fff', 
                            animation: 'evo-flash 0.5s forwards', pointerEvents:'none'
                        }}></div>
                    )}
                </div>

                {/* 按钮 */}
                {step === 3 && (
                    <button onClick={finishEvo} style={{
                        marginTop:'50px', padding:'15px 40px', fontSize:'18px', borderRadius:'30px',
                        border:'none', background:'#FFD700', color:'#333', fontWeight:'bold', cursor:'pointer',
                        animation: 'popIn 0.5s'
                    }}>
                        太棒了！(Space)
                    </button>
                )}
            </div>
        </div>
    );
  };

   // ==========================================
  // [美化] 事件/宝箱弹窗 (已修复崩溃 Bug)
  // ==========================================
  const renderEvent = () => {
    // 🔥 核心修复：如果数据为空，直接不渲染，防止读取 .type 时报错
    if (!eventData) return null;

    return (
      <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div className="event-modal-card" style={{
            width: '320px', background: '#fff', borderRadius: '20px',
            padding: '30px 20px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* 图标动画 */}
          <div style={{fontSize: '60px', marginBottom: '15px', animation: 'bounce 1s infinite'}}>
              {eventData.type === 'LOOT' ? '🎁' : '🏕️'}
          </div>
          
          {/* 标题 */}
          <h3 style={{margin: '0 0 10px 0', color: '#333', fontSize: '20px', fontWeight: '800'}}>
              {eventData.title}
          </h3>
          
          {/* 描述内容 */}
          <div style={{
              background: '#f5f7fa', padding: '15px', borderRadius: '12px',
              color: '#555', fontSize: '14px', lineHeight: '1.5', marginBottom: '25px',
              border: '1px solid #eee'
          }}>
              {eventData.desc}
          </div>
          
          {/* 确认按钮 */}
          <button 
              className="btn-confirm-refined" 
              onClick={handleEventConfirm}
              style={{
                  width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                  color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
              收下奖励
          </button>
        </div>
      </div>
    );
  };



  if (!loaded) return <div>Loading...</div>;

 return (
    <div className="cute-theme">
         {/* 🎵 [新增] 隐藏的音频元素 */}
      <audio ref={audioRef} loop />

     
      {view === 'menu' && renderMenu()}
      {view === 'starter_select' && renderStarterSelect()}
      {view === 'pokedex' && renderPokedex()}
      {view === 'skill_dex' && renderSkillDex()}
      {view === 'world_map' && renderWorldMap()}
      {view === 'bag' && renderBag()}
      {view === 'grid_map' && renderGridMap()}
      {view === 'battle' && renderBattle()}
      {view === 'team' && renderTeam()}
      {view === 'event' && renderEvent()}
      {view === 'trainer_card' && renderTrainerCard()}
      {view === 'move_forget' && renderMoveForget()}
      {view === 'league' && renderLeague()}
      {view === 'sect_summit' && renderSectSummit()} 
      {view === 'infinity_castle' && renderInfinityCastle()}
      {view === 'name_input' && renderNameInput()}
      {view === 'fishing_game' && renderFishingGame()}
    {view === 'beauty_contest' && renderBeautyContest()}
      {view === 'locked' && renderLocked()}
      {renderResultModal()} 
      {renderActivityModal()} 
      {renderEquipModal()} 
      {renderDialogOverlay()} 
      {renderPvPModal()} 
      {renderSectTeamModal()}
      {renderRebirthModal()} 
      {fusionMode && renderFusion()} 
      {renderAvatarSelector()}
      {renderPetDetailModal()}
      {renderEvolutionScene()} 
      {/* 全局消息弹窗 */}
      {messageBox && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s'}} onClick={() => { if(messageBox.callback) messageBox.callback(); setMessageBox(null); }}>
            <div style={{background: 'white', padding: '25px', borderRadius: '16px', maxWidth: '80%', width: '300px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'scaleIn 0.2s'}} onClick={e => e.stopPropagation()}>
                <div style={{fontSize: '40px', marginBottom: '15px'}}>💡</div>
                <div style={{fontSize: '16px', color: '#333', lineHeight: '1.6', marginBottom: '25px'}}>{messageBox.text}</div>
                <button onClick={() => { if(messageBox.callback) messageBox.callback(); setMessageBox(null); }} style={{background: '#2196F3', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold'}}>确定 (Space)</button>
            </div>
        </div>
      )}
    </div>
  );
}
