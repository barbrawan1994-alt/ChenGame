/** v15.0 — 存档键名保留 V17 历史前缀；当前 saveVersion = 32（见 App.js buildSavePayload）。 */
export const SAVE_KEY = 'DREAM_RPG_LEGEND_V17_FIXED'; 
export const GAME_NAME = '超级精灵';
export const GAME_EN_NAME = 'Super Spirit';
export const GAME_VERSION = '15.0';
export const GAME_VERSION_LABEL = 'v15.0 四国争霸·三十门派·跨体系融合';
export const GAME_TAGLINE = '收集、进化、对战，打造你的冠军精灵队伍';
export const GAME_DESCRIPTION = '超级精灵：以精灵收集、属性克制、回合对战和队伍养成为核心的超大型像素 RPG。';
export const COVER_IMG = 'https://d41chssnpqdne.cloudfront.net/user_upload_by_module/chat_bot/files/171335642/8ThZtYs6LuFfKPT5.png?Expires=1765643832&Signature=nYen2ZAHB0FN036pzpJDQpFyDHbzrmVIWNL4H5K6gKh4R46tWLw-67EyT64rL3IlpRhhoI6ZYYgJbyCcP6PVS~KmhS9WfVnCgJFnaSLRiZw0PU4nw8XBc9Z2LUw7bQjJe~-Dk1pw~vceXBW0x-3wQRVhODCC8j1yMR3TG7NmXingA9XzEiiwHbyPjpzdwdsBLmuGXDVchwAflfIHrbK9ztGF5SXMEKPhOy9AznZi4p1NFk-BunegV2Kj24ObI2IRN-4R3bPglupHpZHYFdTfmUYk9GXq295CEMkQtdSDZS5kLkDyPrXd~JiZk3tuFn~s7O5QKj3B67jZo~tYfTSYzg__&Key-Pair-Id=K3USGZIKWMDCSX';
export const GRID_W = 32; 
export const GRID_H = 22; 

export const STARTER_POOL_IDS = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 109, 110, 116, 118, 120, 129, 133, 147, 152, 155, 158, 161, 164, 166, 172];
export const BGM_SOURCES = {
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
export const THEME_CONFIG = {
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
  space: { bg: '#311B92', boardBg: '#4527A0', obstacle: '☄️', ground: '🌑', water: '🌌', rock: '🪐', deco: '⭐', cssClass: 'theme-space' },
  gold: { bg: '#FFF8E1', boardBg: '#FFFDE7', obstacle: '🏛️', ground: '🟡', water: '✨', rock: '🪙', deco: '👑', cssClass: 'theme-gold' },
  forest: { bg: '#A5D6A7', boardBg: '#C8E6C9', obstacle: '🌳', ground: '🍂', water: '💧', rock: '🪵', deco: '🍄', cssClass: 'theme-forest' },
  rock: { bg: '#D7CCC8', boardBg: '#EFEBE9', obstacle: '⛰️', ground: '🪨', water: '💎', rock: '🗻', deco: '🦎', cssClass: 'theme-rock' }
};

export const TRAINER_AVATARS = [
  '🧢', '👧', '👦', '👩', '👨', 
  '🕵️', '👩‍🚀', '👨‍🚀', '👮', '👮‍♀️',
  '🧙‍♂️', '🧙‍♀️', '🧛', '🧛‍♀️', '🧟', 
  '🧝', '🧝‍♀️', '🧞', '🧞‍♀️', '🦸',
  '🦹', '🎅', '🤶', '🤴', '👸'
];

export const DEFAULT_BATTLE_STAGES = Object.freeze({ p_atk: 0, p_def: 0, s_atk: 0, s_def: 0, spd: 0, acc: 0, eva: 0, crit: 0 });
export const MS_PER_DAY = 86400000;
export const MS_PER_MINUTE = 60000;
export const STAT_BUFF_MAP = Object.freeze({ ATK: 'p_atk', DEF: 'p_def', SPD: 'spd', SATK: 's_atk', SDEF: 's_def' });
export const LEAGUE_ROUNDS = Object.freeze([
  { name: '16强赛', level: 85, teamSize: 4 },
  { name: '8强赛', level: 90, teamSize: 5 },
  { name: '半决赛', level: 95, teamSize: 6 },
  { name: '总决赛', level: 100, teamSize: 6 },
]);
export const WHEEL_FREE_SPINS_PER_DAY = 3;
export const WHEEL_PAID_SPIN_COST = 1000;
export const WHEEL_PITY_INTERVAL = 10;

export const SEASON_NPC_NAMES = ['红莲','青岚','紫电','金刚','银河','碧落','玄武','朱雀','白虎','苍龙','烈焰','冰霜','雷神','风王','地藏','星辰','月华','日轮','天罡','地煞'];

export const NINJA_ID_ORDER = { academy: 0, genin: 1, chunin: 2, jonin: 3, kage: 4 };

export const SIDE_STORY_LINES = [
  { id: 'jjk',     name: '咒术回战篇', icon: '⛩️', startIdx: 13, endIdx: 22, chapters: 10, unlockBadges: 7, desc: '觉醒咒术之力，从涩谷事变到终结千年诅咒之王' },
  { id: 'lycoris', name: '莉可莉丝篇', icon: '🎀', startIdx: 23, endIdx: 25, chapters: 3, unlockBadges: 4, desc: '搭档羁绊之旅，解锁搭档系统' },
  { id: 'sect',    name: '门派风云篇',  icon: '⚔️', startIdx: 26, endIdx: 34, chapters: 9, unlockBadges: 8, desc: '三十门派与厌晚的史诗篇章' },
  { id: 'crossworld', name: '异界征途篇', icon: '🌍', startIdx: 35, endIdx: 52, chapters: 18, unlockBadges: 13, desc: '次元裂隙降临，跨越七界的史诗冒险' },
  { id: 'naruto', name: '火影忍者篇', icon: '🍥', startIdx: 0, endIdx: 19, chapters: 20, unlockBadges: 5, desc: '踏上忍者之路，从学院到影级的忍道传说', isNarutoArc: true },
  { id: 'sanguo', name: '三国志篇', icon: '⚔️', startIdx: 0, endIdx: 11, chapters: 12, unlockBadges: 13, desc: '四国争霸时代，体验三国英雄的史诗征途', isSanguoArc: true },
];

export const BREATHING_BUFFS = [
  { id: 'atk_up', name: '🔥 火之神神乐', desc: '全队攻击力 +15', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.p_atk = (p.customBaseStats.p_atk || 50) + 15; } },
  { id: 'def_up', name: '🪨 岩之呼吸', desc: '全队防御力 +15', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.p_def = (p.customBaseStats.p_def || 50) + 15; } },
  { id: 'spd_up', name: '⚡ 雷之呼吸', desc: '全队速度 +10', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.spd = (p.customBaseStats.spd || 50) + 10; } },
  { id: 'heal_turn', name: '🌊 水之呼吸', desc: '全队HP上限 +12', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.hp = (p.customBaseStats.hp || 50) + 12; } },
  { id: 'crit_up', name: '🐗 兽之呼吸', desc: '暴击率 +8%', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.crit = (p.customBaseStats.crit || 0) + 8; } },
  { id: 'heal_all', name: '🦋 虫之呼吸', desc: '立即恢复全队 50% HP', type: 'instant' },
  { id: 'chakra_atk', name: '🍥 螺旋丸之力', desc: '全队特攻+12 攻击+8', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.s_atk = (p.customBaseStats.s_atk || 50) + 12; p.customBaseStats.p_atk = (p.customBaseStats.p_atk || 50) + 8; } },
  { id: 'chakra_def', name: '🛡️ 须佐能乎', desc: '全队双防+12', effect: (p) => { if (!p.customBaseStats) return; p.customBaseStats.p_def = (p.customBaseStats.p_def || 50) + 12; p.customBaseStats.s_def = (p.customBaseStats.s_def || 50) + 12; } },
  { id: 'chakra_all', name: '🦊 九尾查克拉', desc: '全队全属性+6', effect: (p) => { if (!p.customBaseStats) return; ['hp','p_atk','p_def','s_atk','s_def','spd'].forEach(s => { p.customBaseStats[s] = (p.customBaseStats[s] || 50) + 6; }); } },
];

export const COMBO_JUTSU_LIST = [
  { id: 'fire_combo', name: '火遁·焰皇连弹', natures: ['FIRE', 'FIRE'], desc: '两只精灵同时发动火遁，合击火属性伤害', icon: '🔥🔥', minRank: 'genin', power: 60, chakraCost: 30, cat: 'special' },
  { id: 'water_combo', name: '水遁·双龙暴潮', natures: ['WATER', 'WATER'], desc: '双重水遁形成暴潮', icon: '💧💧', minRank: 'genin', power: 60, chakraCost: 30, cat: 'special' },
  { id: 'wind_combo', name: '风遁·真空大玉', natures: ['WIND', 'WIND'], desc: '双风叠加真空大玉', icon: '🌀🌀', minRank: 'genin', power: 60, chakraCost: 30, cat: 'special' },
  { id: 'earth_combo', name: '土遁·双壁巨阵', natures: ['EARTH', 'EARTH'], desc: '双土壁碾压', icon: '🪨🪨', minRank: 'genin', power: 55, chakraCost: 28, cat: 'physical' },
  { id: 'lightning_combo', name: '雷遁·千鸟双重', natures: ['LIGHTNING', 'LIGHTNING'], desc: '双重千鸟贯穿', icon: '⚡⚡', minRank: 'genin', power: 65, chakraCost: 32, cat: 'special' },
  { id: 'water_fire', name: '沸遁·过热蒸汽', natures: ['WATER', 'FIRE'], desc: '水火交融产生高温蒸汽，造成伤害并降低命中', icon: '💧🔥', minRank: 'chunin', power: 80, chakraCost: 40, cat: 'special', effect: { accDown: 1 } },
  { id: 'wind_fire', name: '灼遁·光轮疾风', natures: ['WIND', 'FIRE'], desc: '风助火势的灼遁追击', icon: '🌀🔥', minRank: 'chunin', power: 85, chakraCost: 42, cat: 'special' },
  { id: 'earth_water', name: '溶遁·熔岩浊流', natures: ['EARTH', 'WATER'], desc: '岩浆与水流的融合攻击', icon: '🪨💧', minRank: 'chunin', power: 78, chakraCost: 38, cat: 'special' },
  { id: 'lightning_water', name: '岚遁·雷云风暴', natures: ['LIGHTNING', 'WATER'], desc: '雷电注入水中的岚遁打击', icon: '⚡💧', minRank: 'jonin', power: 95, chakraCost: 55, cat: 'special' },
  { id: 'wind_lightning', name: '磁遁·砂铁界法', natures: ['WIND', 'LIGHTNING'], desc: '操控磁力进行高速攻击', icon: '🌀⚡', minRank: 'jonin', power: 92, chakraCost: 52, cat: 'special' },
  { id: 'fire_earth', name: '熔遁·鬼灯城壁', natures: ['FIRE', 'EARTH'], desc: '熔岩与土壁的熔遁合击', icon: '🔥🪨', minRank: 'chunin', power: 82, chakraCost: 44, cat: 'special', effect: { burn: 0.25 } },
  { id: 'wind_water', name: '氷遁·黑龙暴风雪', natures: ['WIND', 'WATER'], desc: '风与水交织的暴风雪', icon: '🌀❄️', minRank: 'jonin', power: 98, chakraCost: 58, cat: 'special', effect: { freeze: 0.15 } },
  { id: 'fire_lightning', name: '炎雷·天叢雲剣', natures: ['FIRE', 'LIGHTNING'], desc: '炎与雷合一的斩击', icon: '🔥⚡', minRank: 'jonin', power: 100, chakraCost: 60, cat: 'special' },
  { id: 'earth_lightning', name: '土雷·磁暴岩阵', natures: ['EARTH', 'LIGHTNING'], desc: '土雷磁暴束缚对手', icon: '🪨⚡', minRank: 'chunin', power: 76, chakraCost: 36, cat: 'physical', effect: { paralyze: 0.2 } },
  { id: 'earth_wind', name: '砂遁·砂塵大葬', natures: ['EARTH', 'WIND'], desc: '砂尘遮蔽并拖慢对手', icon: '🪨🌀', minRank: 'chunin', power: 74, chakraCost: 35, cat: 'physical', effect: { spdDown: 0.5 } },
  { id: 'water_lightning_alt', name: '水雷·海神裁决', natures: ['WATER', 'LIGHTNING'], desc: '水雷交织的裁决一击', icon: '💧⚡', minRank: 'jonin', power: 105, chakraCost: 62, cat: 'special' },
  { id: 'fire_wind_alt', name: '火風·灰燼颶風', natures: ['FIRE', 'WIND'], desc: '火风合一的灰烬飓风', icon: '🔥🌀', minRank: 'jonin', power: 108, chakraCost: 65, cat: 'special' },
  { id: 'earth_fire', name: '灰遁·火山灰降', natures: ['EARTH', 'FIRE'], desc: '火山灰遮蔽视线并灼伤', icon: '🪨🔥', minRank: 'jonin', power: 96, chakraCost: 54, cat: 'special', effect: { burn: 0.2, accDown: 0.6 } },
  { id: 'water_wind', name: '海遁·海嘯卷', natures: ['WATER', 'WIND'], desc: '海啸与狂风合一', icon: '💧🌀', minRank: 'jonin', power: 94, chakraCost: 52, cat: 'special' },
  { id: 'triple_nature', name: '仙法·三性质变化', natures: ['FIRE', 'WIND', 'LIGHTNING'], desc: '三种性质同时变化，毁灭性一击', icon: '🔥🌀⚡', minRank: 'kage', power: 130, chakraCost: 90, cat: 'special' },
  { id: 'triple_water', name: '仙法·海神三叉戟', natures: ['WATER', 'EARTH', 'LIGHTNING'], desc: '水·土·雷的仙法合击', icon: '💧🪨⚡', minRank: 'kage', power: 125, chakraCost: 85, cat: 'special' },
  { id: 'triple_ice', name: '仙法·氷遁绝零', natures: ['WATER', 'WIND', 'EARTH'], desc: '零度冰遁三重奏', icon: '❄️🌀🪨', minRank: 'kage', power: 120, chakraCost: 82, cat: 'special' },
  { id: 'triple_fire', name: '仙法·炎帝審判', natures: ['FIRE', 'EARTH', 'WIND'], desc: '炎帝与大地与狂风', icon: '🔥🪨🌀', minRank: 'kage', power: 128, chakraCost: 88, cat: 'special' },
  { id: 'triple_storm', name: '仙法·雷遁風暴', natures: ['LIGHTNING', 'WIND', 'FIRE'], desc: '雷·风·炎的毁灭风暴', icon: '⚡🌀🔥', minRank: 'kage', power: 132, chakraCost: 92, cat: 'special' },
  { id: 'all_five', name: '仙法·五遁大結界', natures: ['FIRE', 'WATER', 'WIND', 'EARTH', 'LIGHTNING'], desc: '集齐五遁的仙法大结界（队伍需至少三只不同性质精灵且场上双宠覆盖五遁）', icon: '🔯✨', minRank: 'kage', power: 140, chakraCost: 100, cat: 'special' },
  { id: 'yin_yang', name: '陰陽遁·創造之力', natures: ['FIRE', 'WATER'], desc: '对立之火水交融的阴阳遁', icon: '☯️', minRank: 'kage', power: 135, chakraCost: 95, cat: 'special' },
  { id: 'sealing', name: '封印忍術·屍鬼封盡', natures: ['FIRE', 'FIRE'], desc: '封印对手大量生命（特殊效果）', icon: '👻', minRank: 'jonin', power: 0, chakraCost: 70, cat: 'special', effect: { sealing: true } },
  { id: 'medical', name: '忍法·百豪之力', natures: ['WATER', 'EARTH'], desc: '回复双方出战精灵体力', icon: '💚', minRank: 'chunin', power: 0, chakraCost: 45, cat: 'special', effect: { medical: true } },
  { id: 'genjutsu', name: '幻術·無限月讀', natures: ['FIRE', 'WATER', 'WIND'], desc: '使敌方全体陷入长眠', icon: '🌙', minRank: 'kage', power: 0, chakraCost: 80, cat: 'special', effect: { genjutsu: true } },
  { id: 'barrier', name: '結界·四紫炎陣', natures: ['FIRE', 'EARTH', 'LIGHTNING'], desc: '双方出战精灵数回合内免疫伤害', icon: '🛡️', minRank: 'jonin', power: 0, chakraCost: 55, cat: 'special', effect: { barrier: true } },
];
