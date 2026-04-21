// =============================================
// 火影忍者系统 — 查克拉 · 忍术 · 尾兽 · 忍者试炼
// =============================================

// --- 查克拉配置 ---
export const CHAKRA_CONFIG = {
  baseAmount: 100,
  perLevelBonus: 3,
  regenPerTurn: 8,
  chargeAmount: 20,
  natureTypes: ['FIRE', 'WATER', 'LIGHTNING', 'WIND', 'EARTH'],
};

/** 尾兽化消耗的查克拉占最大查克拉比例（原 0.40，已下调） */
export const BIJUU_TRANSFORM_COST_PCT = 0.40;

export const CHAKRA_NATURE_MAP = {
  FIRE: { name: '火遁', icon: '🔥', color: '#E53935', strongVs: 'WIND', weakVs: 'WATER', gameType: 'FIRE' },
  WATER: { name: '水遁', icon: '💧', color: '#1E88E5', strongVs: 'FIRE', weakVs: 'EARTH', gameType: 'WATER' },
  LIGHTNING: { name: '雷遁', icon: '⚡', color: '#FDD835', strongVs: 'EARTH', weakVs: 'WIND', gameType: 'ELECTRIC' },
  WIND: { name: '風遁', icon: '🌀', color: '#43A047', strongVs: 'LIGHTNING', weakVs: 'FIRE', gameType: 'WIND' },
  EARTH: { name: '土遁', icon: '🪨', color: '#795548', strongVs: 'WATER', weakVs: 'LIGHTNING', gameType: 'GROUND' },
};

// --- 忍者段位 ---
export const NINJA_RANKS = [
  { id: 'academy', name: '忍者学员', icon: '📖', minExams: 0, perk: null, chakraBonus: 0 },
  { id: 'genin', name: '下忍', icon: '🎯', minExams: 2, perk: '忍术伤害+3%', chakraBonus: 10 },
  { id: 'chunin', name: '中忍', icon: '🌀', minExams: 5, perk: '忍术伤害+6%', chakraBonus: 20 },
  { id: 'jonin', name: '上忍', icon: '⚔️', minExams: 10, perk: '忍术伤害+10%', chakraBonus: 40 },
  { id: 'kage', name: '影', icon: '👤', minExams: 15, perk: '忍术伤害+15%', chakraBonus: 60 },
];

export function getNinjaRank(examsCompleted) {
  for (let i = NINJA_RANKS.length - 1; i >= 0; i--) {
    if (examsCompleted >= NINJA_RANKS[i].minExams) return NINJA_RANKS[i];
  }
  return NINJA_RANKS[0];
}

function fisherYatesCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ranksUnlockedAtLevel(level) {
  if (level < 20) return ['D'];
  if (level < 40) return ['D', 'C'];
  if (level < 60) return ['D', 'C', 'B'];
  if (level < 80) return ['D', 'C', 'B', 'A'];
  return ['D', 'C', 'B', 'A', 'S'];
}

/** 与战斗内忍术随机池一致的段位解锁（导出供 UI/战斗过滤） */
export function getUnlockedJutsuRanks(level) {
  return ranksUnlockedAtLevel(level);
}

// --- 忍术技能库（200种忍术）---
export const JUTSU_DB = [
  { id: 'fire_spark', name: '火遁·凤仙火', nature: 'FIRE', p: 48, pp: 18, chakraCost: 12, desc: '如火花散开的初级火遁', cat: 'special', rank: 'D' },
  { id: 'fire_stream', name: '火遁·豪火灭却(弱)', nature: 'FIRE', p: 55, pp: 16, chakraCost: 14, desc: '扇形火焰压制', cat: 'special', rank: 'D' },
  { id: 'fire_fan', name: '火遁·龙炎放歌', nature: 'FIRE', p: 72, pp: 14, chakraCost: 20, desc: '多条火龙追击', cat: 'special', rank: 'C' },
  { id: 'fire_phoenix', name: '火遁·凤仙火爪红', nature: 'FIRE', p: 68, pp: 13, chakraCost: 19, desc: '线状火丝切割', cat: 'special', rank: 'C' },
  { id: 'fireball', name: '火遁·豪火球之术', nature: 'FIRE', p: 78, pp: 11, chakraCost: 24, desc: '吐出巨大火球', cat: 'special', rank: 'C', effect: { type: 'STATUS', status: 'BRN', chance: 0.22, target: 'enemy' } },
  { id: 'fire_dragon', name: '火遁·龙火之术', nature: 'FIRE', p: 98, pp: 8, chakraCost: 30, desc: '火龙形态火焰', cat: 'special', rank: 'B' },
  { id: 'fire_running', name: '火遁·豪火灭却', nature: 'FIRE', p: 105, pp: 7, chakraCost: 33, desc: '广域火海席卷', cat: 'special', rank: 'B' },
  { id: 'fire_hiding_ash', name: '火遁·灰积烧', nature: 'FIRE', p: 0, pp: 9, chakraCost: 22, desc: '高温烟灰封锁视野', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'fire_explosive', name: '火遁·起爆炎阵', nature: 'FIRE', p: 92, pp: 8, chakraCost: 28, desc: '符咒连环引爆', cat: 'physical', rank: 'B' },
  { id: 'fire_great', name: '火遁·豪火灭失', nature: 'FIRE', p: 110, pp: 5, chakraCost: 48, desc: '箭矢形爆裂火焰', cat: 'special', rank: 'A' },
  { id: 'amaterasu', name: '天照', nature: 'FIRE', p: 118, pp: 3, chakraCost: 55, desc: '无法熄灭的黑炎', cat: 'special', rank: 'A', isKekkei: true, effect: { type: 'STATUS', status: 'BRN', chance: 0.75, target: 'enemy' } },
  { id: 'fire_enton', name: '炎遁·加具土命', nature: 'FIRE', p: 134, pp: 2, chakraCost: 71, desc: '形态变化的黑炎斩击', cat: 'special', rank: 'S', isKekkei: true, recoil: 0.12 },
  { id: 'water_spurt', name: '水遁·水流鞭', nature: 'WATER', p: 45, pp: 19, chakraCost: 11, desc: '细长水鞭抽击', cat: 'special', rank: 'D' },
  { id: 'water_mist', name: '水遁·雾隐之术', nature: 'WATER', p: 0, pp: 17, chakraCost: 10, desc: '浓雾降低命中', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'water_wall', name: '水遁·水阵壁', nature: 'WATER', p: 0, pp: 14, chakraCost: 16, desc: '水墙提升特防', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 's_def', val: 2, target: 'self' } },
  { id: 'water_shot', name: '水遁·水弾', nature: 'WATER', p: 70, pp: 13, chakraCost: 21, desc: '高速水弹连射', cat: 'special', rank: 'C' },
  { id: 'water_dragon', name: '水遁·水龙弹之术', nature: 'WATER', p: 95, pp: 9, chakraCost: 28, desc: '水龙突击', cat: 'special', rank: 'B' },
  { id: 'water_prison', name: '水遁·水牢之术', nature: 'WATER', p: 0, pp: 8, chakraCost: 20, desc: '水球束缚降速', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy' } },
  { id: 'water_shark', name: '水遁·五食鲛', nature: 'WATER', p: 108, pp: 7, chakraCost: 34, desc: '五条水鲨撕咬', cat: 'special', rank: 'B' },
  { id: 'water_black', name: '水遁·黑雨', nature: 'WATER', p: 0, pp: 8, chakraCost: 28, desc: '油性黑雨削弱特防', cat: 'status', rank: 'A', effect: { type: 'DEBUFF', stat: 's_def', val: 1, target: 'enemy' } },
  { id: 'water_giant', name: '水遁·大瀑布之术', nature: 'WATER', p: 112, pp: 5, chakraCost: 51, desc: '巨量水流冲击', cat: 'special', rank: 'A' },
  { id: 'water_thousand', name: '水遁·千食鲛', nature: 'WATER', p: 118, pp: 6, chakraCost: 46, desc: '成群水鲨围攻', cat: 'special', rank: 'A' },
  { id: 'water_collab', name: '水遁·硬涡水刃', nature: 'WATER', p: 138, pp: 4, chakraCost: 58, desc: '压缩水龙卷', cat: 'special', rank: 'S', isKekkei: true, recoil: 0.10 },
  { id: 'water_needle', name: '水遁·千本', nature: 'WATER', p: 58, pp: 16, chakraCost: 13, desc: '细密水针', cat: 'special', rank: 'D' },
  { id: 'lightning_spark', name: '雷遁·地走', nature: 'LIGHTNING', p: 50, pp: 18, chakraCost: 12, desc: '沿地面传导雷电', cat: 'special', rank: 'D' },
  { id: 'lightning_static', name: '雷遁·静电', nature: 'LIGHTNING', p: 0, pp: 16, chakraCost: 11, desc: '麻痹电场', cat: 'status', rank: 'D', effect: { type: 'STATUS', status: 'PAR', chance: 0.18, target: 'enemy' } },
  { id: 'lightning_pierce', name: '雷遁·雷针', nature: 'LIGHTNING', p: 66, pp: 14, chakraCost: 18, desc: '雷针突刺', cat: 'physical', rank: 'C' },
  { id: 'lightning_net', name: '雷遁·雷网', nature: 'LIGHTNING', p: 0, pp: 12, chakraCost: 19, desc: '电网降速', cat: 'status', rank: 'C', effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy' } },
  { id: 'chidori', name: '千鸟', nature: 'LIGHTNING', p: 88, pp: 10, chakraCost: 26, desc: '雷遁突刺', cat: 'physical', rank: 'B', effect: { type: 'BUFF', stat: 'crit', val: 1, target: 'self', chance: 1 } },
  { id: 'lightning_beast', name: '雷遁·雷兽追牙', nature: 'LIGHTNING', p: 102, pp: 8, chakraCost: 31, desc: '兽形雷电追击', cat: 'special', rank: 'B' },
  { id: 'lightning_chakra_mode', name: '雷遁查克拉模式', nature: 'LIGHTNING', p: 0, pp: 7, chakraCost: 26, desc: '活化细胞提速度', cat: 'status', rank: 'B', effect: { type: 'BUFF', stat: 'spd', val: 2, target: 'self' } },
  { id: 'raikiri', name: '雷切', nature: 'LIGHTNING', p: 107, pp: 5, chakraCost: 46, desc: '千鸟上位', cat: 'physical', rank: 'A', effect: { type: 'BUFF', stat: 'crit', val: 2, target: 'self', chance: 1 } },
  { id: 'lightning_clone', name: '雷遁·影分身', nature: 'LIGHTNING', p: 75, pp: 11, chakraCost: 22, desc: '雷分身炸裂', cat: 'special', rank: 'C' },
  { id: 'lightning_sword', name: '雷遁·雷传', nature: 'LIGHTNING', p: 112, pp: 6, chakraCost: 41, desc: '雷线切割', cat: 'special', rank: 'A' },
  { id: 'kirin', name: '麒麟', nature: 'LIGHTNING', p: 131, pp: 2, chakraCost: 67, desc: '引导天雷', cat: 'special', rank: 'S', isKekkei: true, recoil: 0.1 },
  { id: 'lightning_four', name: '雷遁·雷门', nature: 'LIGHTNING', p: 82, pp: 12, chakraCost: 20, desc: '双雷夹击', cat: 'special', rank: 'C' },
  { id: 'wind_cutter', name: '風遁·镰鼬', nature: 'WIND', p: 46, pp: 19, chakraCost: 11, desc: '真空小刃', cat: 'special', rank: 'D' },
  { id: 'wind_great_break', name: '風遁·大突破', nature: 'WIND', p: 54, pp: 17, chakraCost: 13, desc: '狂风推进', cat: 'special', rank: 'D' },
  { id: 'vacuum_wave', name: '風遁·真空波', nature: 'WIND', p: 72, pp: 14, chakraCost: 17, desc: '压缩空气冲击', cat: 'special', rank: 'C' },
  { id: 'wind_shield', name: '風遁·风阵壁', nature: 'WIND', p: 0, pp: 14, chakraCost: 15, desc: '风壁提升回避', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'eva', val: 2, target: 'self' } },
  { id: 'wind_blade', name: '風遁·风刃', nature: 'WIND', p: 84, pp: 11, chakraCost: 23, desc: '锋利风刃', cat: 'special', rank: 'B' },
  { id: 'wind_drill', name: '風遁·练空弹', nature: 'WIND', p: 96, pp: 9, chakraCost: 29, desc: '高压风弹', cat: 'special', rank: 'B' },
  { id: 'wind_pressure', name: '風遁·压害', nature: 'WIND', p: 104, pp: 8, chakraCost: 32, desc: '暴风球碾压', cat: 'special', rank: 'B' },
  { id: 'wind_repulse', name: '風遁·烈风掌', nature: 'WIND', p: 115, pp: 6, chakraCost: 43, desc: '斥力风压冲击', cat: 'special', rank: 'A' },
  { id: 'wind_vacuum_serial', name: '風遁·真空连波', nature: 'WIND', p: 108, pp: 7, chakraCost: 40, desc: '连续真空斩', cat: 'special', rank: 'A' },
  { id: 'rasenshuriken', name: '風遁·螺旋手里剑', nature: 'WIND', p: 125, pp: 3, chakraCost: 60, desc: '微观风刃风暴', cat: 'special', rank: 'S', isKekkei: true, recoil: 0.15 },
  { id: 'wind_arrow', name: '風遁·散千乌', nature: 'WIND', p: 62, pp: 15, chakraCost: 14, desc: '风矢齐射', cat: 'special', rank: 'C' },
  { id: 'wind_tornado', name: '風遁·龙卷', nature: 'WIND', p: 90, pp: 10, chakraCost: 27, desc: '小型龙卷风', cat: 'special', rank: 'B' },
  { id: 'earth_spike', name: '土遁·土流枪', nature: 'EARTH', p: 52, pp: 18, chakraCost: 13, desc: '地刺突袭', cat: 'physical', rank: 'D' },
  { id: 'earth_mud', name: '土遁·土流河', nature: 'EARTH', p: 0, pp: 16, chakraCost: 12, desc: '泥流降速', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy' } },
  { id: 'earth_clone', name: '土遁·土分身', nature: 'EARTH', p: 64, pp: 14, chakraCost: 17, desc: '土分身撞击', cat: 'physical', rank: 'C' },
  { id: 'earth_wall', name: '土遁·土流壁', nature: 'EARTH', p: 0, pp: 13, chakraCost: 18, desc: '土墙提升物防', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'p_def', val: 2, target: 'self' } },
  { id: 'earth_dragon', name: '土遁·土龙弹', nature: 'EARTH', p: 94, pp: 9, chakraCost: 27, desc: '土龙连弹', cat: 'special', rank: 'B' },
  { id: 'earth_spear', name: '土遁·土矛', nature: 'EARTH', p: 100, pp: 8, chakraCost: 30, desc: '硬化穿刺', cat: 'physical', rank: 'B', effect: { type: 'BUFF', stat: 'p_def', val: 1, target: 'self', chance: 1 } },
  { id: 'earth_prison', name: '土遁·土牢堂无', nature: 'EARTH', p: 0, pp: 8, chakraCost: 25, desc: '半球土牢困敌', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 'eva', val: 2, target: 'enemy' } },
  { id: 'earth_weight', name: '土遁·加重岩之术', nature: 'EARTH', p: 0, pp: 7, chakraCost: 32, desc: '极重岩压', cat: 'status', rank: 'A', effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy' } },
  { id: 'earth_golem', name: '土遁·土石巨人', nature: 'EARTH', p: 120, pp: 6, chakraCost: 45, desc: '巨岩拳击', cat: 'physical', rank: 'A' },
  { id: 'earth_deeper', name: '土遁·地动核', nature: 'EARTH', p: 114, pp: 5, chakraCost: 49, desc: '地层隆起', cat: 'special', rank: 'A' },
  { id: 'earth_mountain', name: '土遁·山土之术', nature: 'EARTH', p: 123, pp: 3, chakraCost: 63, desc: '巨岩夹击', cat: 'physical', rank: 'S', recoil: 0.11 },
  { id: 'earth_barricade', name: '土遁·土阵壁', nature: 'EARTH', p: 58, pp: 15, chakraCost: 14, desc: '矮墙防御反击', cat: 'physical', rank: 'C' },
  { id: 'body_flicker', name: '瞬身术', nature: null, p: 52, pp: 17, chakraCost: 11, desc: '高速体术奇袭', cat: 'physical', rank: 'D', effect: { type: 'BUFF', stat: 'spd', val: 1, target: 'self', chance: 1 } },
  { id: 'tai_double_kick', name: '木叶刚力旋风', nature: null, p: 60, pp: 16, chakraCost: 12, desc: '刚力回旋踢', cat: 'physical', rank: 'D' },
  { id: 'clone_feint', name: '分身诱敌', nature: null, p: 0, pp: 15, chakraCost: 9, desc: '假动作降低命中', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'rope_escape', name: '绳遁·解绳', nature: null, p: 0, pp: 14, chakraCost: 10, desc: '提升脱身闪避', cat: 'status', rank: 'D', effect: { type: 'BUFF', stat: 'eva', val: 1, target: 'self' } },
  { id: 'rasengan', name: '螺旋丸', nature: null, p: 100, pp: 10, chakraCost: 29, desc: '查克拉形态变化', cat: 'physical', rank: 'B' },
  { id: 'shadow_clone', name: '影分身之术', nature: null, p: 0, pp: 8, chakraCost: 21, desc: '分身扰乱', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'eva', val: 2, target: 'self' } },
  { id: 'substitution', name: '替身术', nature: null, p: 0, pp: 5, chakraCost: 15, desc: '木桩替身回避', cat: 'status', rank: 'C', effect: { type: 'PROTECT', target: 'self', successRate: 0.5 } },
  { id: 'tai_primary', name: '表莲华', nature: null, p: 92, pp: 8, chakraCost: 27, desc: '高速抱摔', cat: 'physical', rank: 'B' },
  { id: 'dynamic_entry', name: '动力前奏曲', nature: null, p: 78, pp: 11, chakraCost: 22, desc: '飞踢突袭', cat: 'physical', rank: 'C' },
  { id: 'medical_ninjutsu', name: '医疗忍术', nature: null, p: 0, pp: 5, chakraCost: 45, desc: '回复约28%体力', cat: 'status', rank: 'B', effect: { type: 'HEAL', val: 0.28, target: 'self' } },
  { id: 'mystic_palm', name: '掌仙术', nature: null, p: 0, pp: 6, chakraCost: 22, desc: '持续愈合', cat: 'status', rank: 'C', effect: { type: 'HEAL', val: 0.18, target: 'self' } },
  { id: 'barrier_canopy', name: '四方封印·结界', nature: null, p: 0, pp: 6, chakraCost: 26, desc: '结界提升双防', cat: 'status', rank: 'B', effect: { type: 'BUFF', stat: 'p_def', val: 1, stat2: 's_def', target: 'self' } },
  { id: 'sealing_tag', name: '封符术', nature: null, p: 0, pp: 7, chakraCost: 24, desc: '干扰查克拉流动', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 's_atk', val: 1, target: 'enemy' } },
  { id: 'genjutsu_fear', name: '幻术·奈落见', nature: null, p: 0, pp: 10, chakraCost: 14, desc: '恐惧降特攻', cat: 'status', rank: 'C', effect: { type: 'DEBUFF', stat: 's_atk', val: 1, target: 'enemy' } },
  { id: 'explosive_clone', name: '影分身爆破', nature: null, p: 85, pp: 9, chakraCost: 30, desc: '分身炸裂', cat: 'special', rank: 'B' },
  { id: 'wood_pillar', name: '木遁·树界降诞(枝)', nature: null, p: 112, pp: 7, chakraCost: 38, desc: '巨木穿刺', cat: 'special', rank: 'B', isKekkei: true, combo: 'WOOD' },
  { id: 'wood_dragon', name: '木遁·木龙之术', nature: null, p: 112, pp: 5, chakraCost: 53, desc: '木龙缠绕吸取', cat: 'special', rank: 'A', isKekkei: true, combo: 'WOOD', effect: { drain: 0.12 } },
  { id: 'lava_rubber', name: '熔遁·橡胶', nature: null, p: 118, pp: 6, chakraCost: 47, desc: '弹性熔岩弹', cat: 'special', rank: 'A', isKekkei: true, combo: 'LAVA' },
  { id: 'lava_wash', name: '熔遁·溶怪之术', nature: null, p: 108, pp: 7, chakraCost: 36, desc: '强酸熔流', cat: 'special', rank: 'B', isKekkei: true, combo: 'LAVA', effect: { type: 'STATUS', status: 'BRN', chance: 0.25, target: 'enemy' } },
  { id: 'ice_prison', name: '冰遁·狼牙雪崩', nature: null, p: 102, pp: 8, chakraCost: 34, desc: '冰牙撕咬', cat: 'special', rank: 'B', isKekkei: true, combo: 'ICE_RELEASE', effect: { type: 'STATUS', status: 'FRZ', chance: 0.08, target: 'enemy' } },
  { id: 'ice_mirror', name: '魔镜冰晶', nature: null, p: 116, pp: 4, chakraCost: 56, desc: '镜中连击', cat: 'special', rank: 'A', isKekkei: true, combo: 'ICE_RELEASE' },
  { id: 'storm_line', name: '岚遁·励挫锁苛素', nature: null, p: 109, pp: 5, chakraCost: 51, desc: '激光风暴', cat: 'special', rank: 'A', isKekkei: true, combo: 'STORM' },
  { id: 'storm_cloud', name: '岚遁·雷云腔波', nature: null, p: 98, pp: 8, chakraCost: 33, desc: '带电水雾', cat: 'special', rank: 'B', isKekkei: true, combo: 'STORM', effect: { type: 'STATUS', status: 'PAR', chance: 0.15, target: 'enemy' } },
  { id: 'boil_unrivaled', name: '沸遁·巧雾之术', nature: null, p: 115, pp: 6, chakraCost: 46, desc: '强酸高热雾', cat: 'special', rank: 'A', isKekkei: true, combo: 'BOIL' },
  { id: 'dust_release', name: '尘遁·原界剥离', nature: null, p: 140, pp: 2, chakraCost: 78, desc: '立方分解', cat: 'special', rank: 'S', isKekkei: true, combo: 'DUST', recoil: 0.18 },
  { id: 'sage_sensing', name: '仙术·感知', nature: null, p: 0, pp: 12, chakraCost: 18, desc: '自然能量感知', cat: 'status', rank: 'B', isSpecial: true, effect: { type: 'BUFF', stat: 'acc', val: 2, target: 'self' } },
  { id: 'sage_meditation', name: '仙术·打坐', nature: null, p: 0, pp: 10, chakraCost: 20, desc: '调和仙术查克拉', cat: 'status', rank: 'B', isSpecial: true, effect: { type: 'HEAL', val: 0.22, target: 'self' } },
  { id: 'sage_art_bullet', name: '仙法·五右卫门', nature: null, p: 120, pp: 4, chakraCost: 62, desc: '油风火组合', cat: 'special', rank: 'S', isSpecial: true },
  { id: 'sage_rasengan', name: '仙法·螺旋丸', nature: null, p: 110, pp: 5, chakraCost: 52, desc: '仙术强化螺旋丸', cat: 'physical', rank: 'A', isSpecial: true },
  { id: 'forbidden_heal', name: '禁术·创造再生', nature: null, p: 0, pp: 3, chakraCost: 63, desc: '透支细胞愈合', cat: 'status', rank: 'S', isSpecial: true, effect: { type: 'HEAL', val: 0.40, target: 'self' }, recoil: 0.22 },
  { id: 'edo_summon', name: '秽土转生·契', nature: null, p: 0, pp: 2, chakraCost: 69, desc: '召唤棺木束缚', cat: 'status', rank: 'S', isSpecial: true, effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy' }, recoil: 0.2 },
  { id: 'reaper_death', name: '尸鬼封尽', nature: null, p: 136, pp: 1, chakraCost: 86, desc: '死神换命封印', cat: 'special', rank: 'S', isSpecial: true, recoil: 0.32 },
  { id: 'c0_art', name: '禁术·C0', nature: null, p: 148, pp: 1, chakraCost: 83, desc: '自爆艺术', cat: 'special', rank: 'S', isSpecial: true, recoil: 0.35 },
  { id: 'eight_gates', name: '八门遁甲·朝孔雀', nature: null, p: 121, pp: 4, chakraCost: 58, desc: '极速正拳击', cat: 'physical', rank: 'A', isSpecial: true, recoil: 0.14 },
  { id: 'night_moth', name: '八门遁甲·夕象', nature: null, p: 129, pp: 3, chakraCost: 67, desc: '扭曲空间的拳击', cat: 'physical', rank: 'S', isSpecial: true, recoil: 0.2 },
  { id: 'izanagi', name: '禁术·伊邪那岐', nature: null, p: 0, pp: 2, chakraCost: 75, desc: '梦境改写现实一瞬', cat: 'status', rank: 'S', isSpecial: true, effect: { type: 'BUFF', stat: 'eva', val: 3, target: 'self' }, recoil: 0.25 },
  { id: 'shadow_stitch', name: '影子模仿术', nature: null, p: 0, pp: 10, chakraCost: 16, desc: '束缚行动', cat: 'status', rank: 'C', isSpecial: true, effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy' } },
  { id: 'tsukuyomi_glance', name: '万花筒·月读(余波)', nature: null, p: 0, pp: 6, chakraCost: 44, desc: '精神创伤', cat: 'status', rank: 'A', isSpecial: true, effect: { type: 'DEBUFF', stat: 's_atk', val: 2, target: 'enemy' } },
  { id: 'six_paths_push', name: '六道·地爆天星', nature: null, p: 125, pp: 3, chakraCost: 64, desc: '引力封印', cat: 'special', rank: 'S', isSpecial: true, recoil: 0.16 },
  { id: 'truth_orbs', name: '求道玉·湮灭', nature: null, p: 144, pp: 1, chakraCost: 90, desc: '阴阳遁抹消', cat: 'special', rank: 'S', isSpecial: true, recoil: 0.22 },

  { id: 'nj201', name: '火遁·燐火', nature: 'FIRE', p: 42, pp: 22, chakraCost: 9, desc: '点点飘飞的冷火', cat: 'special', rank: 'D' },
  { id: 'nj202', name: '水遁·水丝', nature: 'WATER', p: 38, pp: 24, chakraCost: 10, desc: '细线般的水流切割', cat: 'special', rank: 'D' },
  { id: 'nj203', name: '雷遁·电啄', nature: 'LIGHTNING', p: 45, pp: 21, chakraCost: 11, desc: '短促如雷鸟啄击', cat: 'physical', rank: 'D' },
  { id: 'nj204', name: '風遁·微尘', nature: 'WIND', p: 41, pp: 23, chakraCost: 8, desc: '扬起尘埃迷眼', cat: 'special', rank: 'D' },
  { id: 'nj205', name: '土遁·砂尘', nature: 'EARTH', p: 0, pp: 20, chakraCost: 12, desc: '沙雾降低命中', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'nj206', name: '体术·贯手', nature: null, p: 48, pp: 19, chakraCost: 10, desc: '指突刺要害', cat: 'physical', rank: 'D' },
  { id: 'nj207', name: '幻术·枷沫', nature: null, p: 0, pp: 18, chakraCost: 12, desc: '泡沫般的精神枷锁', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 's_atk', val: 1, target: 'enemy' } },
  { id: 'nj208', name: '火遁·火线', nature: 'FIRE', p: 52, pp: 17, chakraCost: 13, desc: '笔直延烧的火线', cat: 'special', rank: 'D' },
  { id: 'nj209', name: '水遁·点滴', nature: 'WATER', p: 35, pp: 25, chakraCost: 12, desc: '连续水滴攒射', cat: 'special', rank: 'D' },
  { id: 'nj210', name: '雷遁·萤火', nature: 'LIGHTNING', p: 44, pp: 20, chakraCost: 10, desc: '微弱电火花迸溅', cat: 'special', rank: 'D' },
  { id: 'nj211', name: '風遁·轻岚', nature: 'WIND', p: 49, pp: 16, chakraCost: 14, desc: '轻柔侧风刮面', cat: 'special', rank: 'D' },
  { id: 'nj212', name: '土遁·踏土', nature: 'EARTH', p: 46, pp: 18, chakraCost: 11, desc: '踏地借力猛撞', cat: 'physical', rank: 'D' },
  { id: 'nj213', name: '体术·落叶踢', nature: null, p: 51, pp: 17, chakraCost: 12, desc: '借旋转之势踢击', cat: 'physical', rank: 'D' },
  { id: 'nj214', name: '火遁·灯芯', nature: 'FIRE', p: 40, pp: 22, chakraCost: 8, desc: '如烛芯燃烧', cat: 'special', rank: 'D' },
  { id: 'nj215', name: '水遁·水滴', nature: 'WATER', p: 53, pp: 19, chakraCost: 13, desc: '凝聚水滴冲击', cat: 'special', rank: 'D' },
  { id: 'nj216', name: '雷遁·鸣线', nature: 'LIGHTNING', p: 47, pp: 21, chakraCost: 9, desc: '沿线的微弱电流', cat: 'special', rank: 'D' },
  { id: 'nj217', name: '風遁·软岚', nature: 'WIND', p: 43, pp: 23, chakraCost: 10, desc: '包裹身躯的柔风', cat: 'special', rank: 'D' },
  { id: 'nj218', name: '土遁·踏震', nature: 'EARTH', p: 50, pp: 18, chakraCost: 11, desc: '踏地震动足部', cat: 'physical', rank: 'D' },
  { id: 'nj219', name: '幻术·雾隐瞳', nature: null, p: 0, pp: 17, chakraCost: 11, desc: '瞳中迷雾扰乱瞄准', cat: 'status', rank: 'D', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'nj220', name: '体术·肘崩', nature: null, p: 54, pp: 16, chakraCost: 13, desc: '短程肘击破架', cat: 'physical', rank: 'D' },
  { id: 'nj221', name: '火遁·炭星', nature: 'FIRE', p: 39, pp: 24, chakraCost: 9, desc: '炭火星溅射', cat: 'special', rank: 'D' },
  { id: 'nj222', name: '水遁·涟漪', nature: 'WATER', p: 45, pp: 20, chakraCost: 10, desc: '扩散纹样的水波', cat: 'special', rank: 'D' },
  { id: 'nj223', name: '雷遁·鸣门(弱)', nature: 'LIGHTNING', p: 42, pp: 22, chakraCost: 12, desc: '仿雷门的微弱雷击', cat: 'special', rank: 'D' },
  { id: 'nj224', name: '風遁·回旋', nature: 'WIND', p: 48, pp: 19, chakraCost: 11, desc: '小型回旋气流', cat: 'special', rank: 'D' },
  { id: 'nj225', name: '土遁·砂盔', nature: 'EARTH', p: 0, pp: 16, chakraCost: 15, desc: '砂层硬化体表', cat: 'status', rank: 'D', effect: { type: 'BUFF', stat: 'p_def', val: 1, target: 'self' } },

  { id: 'nj226', name: '火遁·灰烬舞', nature: 'FIRE', p: 66, pp: 16, chakraCost: 18, desc: '灰絮裹烈焰缠绕', cat: 'special', rank: 'C' },
  { id: 'nj227', name: '水遁·水连弹', nature: 'WATER', p: 58, pp: 18, chakraCost: 15, desc: '连珠水弹骚扰', cat: 'special', rank: 'C' },
  { id: 'nj228', name: '雷遁·雷蛇', nature: 'LIGHTNING', p: 72, pp: 14, chakraCost: 20, desc: '蛇形电流游走', cat: 'special', rank: 'C', effect: { type: 'STATUS', status: 'PAR', chance: 0.12, target: 'enemy' } },
  { id: 'nj229', name: '風遁·破空', nature: 'WIND', p: 62, pp: 17, chakraCost: 16, desc: '裂空小斩', cat: 'special', rank: 'C' },
  { id: 'nj230', name: '土遁·硬拳', nature: 'EARTH', p: 68, pp: 15, chakraCost: 19, desc: '岩壳包覆拳击', cat: 'physical', rank: 'C' },
  { id: 'nj231', name: '体术·影击', nature: null, p: 55, pp: 19, chakraCost: 14, desc: '快影交错斩拳', cat: 'physical', rank: 'C' },
  { id: 'nj232', name: '幻术·镜花', nature: null, p: 0, pp: 14, chakraCost: 17, desc: '镜中虚影迷惑', cat: 'status', rank: 'C', effect: { type: 'DEBUFF', stat: 'acc', val: 1, target: 'enemy' } },
  { id: 'nj233', name: '火遁·爆炎符·起', nature: 'FIRE', p: 74, pp: 13, chakraCost: 22, desc: '起爆符连锁火花', cat: 'special', rank: 'C' },
  { id: 'nj234', name: '水遁·水替身', nature: 'WATER', p: 0, pp: 16, chakraCost: 15, desc: '水替身提升回避', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'eva', val: 1, target: 'self' } },
  { id: 'nj235', name: '雷遁·紫电', nature: 'LIGHTNING', p: 70, pp: 15, chakraCost: 18, desc: '偏紫的雷击弧', cat: 'special', rank: 'C' },
  { id: 'nj236', name: '風遁·叶刃', nature: 'WIND', p: 65, pp: 16, chakraCost: 17, desc: '叶片如刃飞斩', cat: 'special', rank: 'C' },
  { id: 'nj237', name: '土遁·潜土', nature: 'EARTH', p: 0, pp: 15, chakraCost: 16, desc: '半身潜入地下伺机', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'eva', val: 2, target: 'self' } },
  { id: 'nj238', name: '体术·狮子连弹(式)', nature: null, p: 61, pp: 17, chakraCost: 15, desc: '仿兽形连踢', cat: 'physical', rank: 'C' },
  { id: 'nj239', name: '火遁·炎柱', nature: 'FIRE', p: 59, pp: 18, chakraCost: 14, desc: '柱状火舌喷发', cat: 'special', rank: 'C' },
  { id: 'nj240', name: '水遁·水流鞭·二式', nature: 'WATER', p: 67, pp: 14, chakraCost: 21, desc: '双鞭夹击', cat: 'special', rank: 'C' },
  { id: 'nj241', name: '雷遁·雷弹', nature: 'LIGHTNING', p: 63, pp: 17, chakraCost: 16, desc: '雷球投掷', cat: 'special', rank: 'C' },
  { id: 'nj242', name: '風遁·气流刃', nature: 'WIND', p: 71, pp: 13, chakraCost: 20, desc: '气流凝成薄刃', cat: 'special', rank: 'C' },
  { id: 'nj243', name: '土遁·岩拳', nature: 'EARTH', p: 64, pp: 16, chakraCost: 18, desc: '岩拳直击', cat: 'physical', rank: 'C' },
  { id: 'nj244', name: '幻术·催眠', nature: null, p: 0, pp: 12, chakraCost: 24, desc: '精神松懈降防', cat: 'status', rank: 'C', effect: { type: 'DEBUFF', stat: 'p_def', val: 1, target: 'enemy' } },
  { id: 'nj245', name: '火遁·炎沫', nature: 'FIRE', p: 56, pp: 19, chakraCost: 15, desc: '细小泡沫状火点', cat: 'special', rank: 'C' },
  { id: 'nj246', name: '水遁·潮打', nature: 'WATER', p: 73, pp: 14, chakraCost: 19, desc: '潮汐般拍击', cat: 'special', rank: 'C' },
  { id: 'nj247', name: '雷遁·落雷(小)', nature: 'LIGHTNING', p: 69, pp: 15, chakraCost: 17, desc: '定向小落雷', cat: 'special', rank: 'C' },
  { id: 'nj248', name: '風遁·气流障', nature: 'WIND', p: 0, pp: 14, chakraCost: 20, desc: '气流屏障偏转', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'eva', val: 1, target: 'self' } },
  { id: 'nj249', name: '土遁·硬化术', nature: 'EARTH', p: 0, pp: 13, chakraCost: 21, desc: '体表硬化', cat: 'status', rank: 'C', effect: { type: 'BUFF', stat: 'p_def', val: 1, target: 'self' } },
  { id: 'nj250', name: '体术·回天(式)', nature: null, p: 57, pp: 20, chakraCost: 14, desc: '半身回旋卸力', cat: 'physical', rank: 'C' },

  { id: 'nj251', name: '火遁·烈焰斩', nature: 'FIRE', p: 86, pp: 11, chakraCost: 28, desc: '火焰刀弧劈砍', cat: 'special', rank: 'B' },
  { id: 'nj252', name: '水遁·水刃连闪', nature: 'WATER', p: 91, pp: 10, chakraCost: 30, desc: '水刃多段切割', cat: 'special', rank: 'B' },
  { id: 'nj253', name: '雷遁·雷虎', nature: 'LIGHTNING', p: 78, pp: 12, chakraCost: 25, desc: '虎形雷电扑杀', cat: 'special', rank: 'B' },
  { id: 'nj254', name: '風遁·烈破', nature: 'WIND', p: 94, pp: 9, chakraCost: 31, desc: '烈风撕裂大气', cat: 'special', rank: 'B' },
  { id: 'nj255', name: '土遁·岩龙咆', nature: 'EARTH', p: 82, pp: 12, chakraCost: 27, desc: '岩龙昂首冲撞', cat: 'physical', rank: 'B' },
  { id: 'nj256', name: '灼遁·过蒸闪', nature: null, p: 88, pp: 10, chakraCost: 29, desc: '急速蒸汽灼伤', cat: 'special', rank: 'B', isKekkei: true, combo: 'SCORCH', effect: { type: 'STATUS', status: 'BRN', chance: 0.2, target: 'enemy' } },
  { id: 'nj257', name: '磁遁·砂铁刺', nature: null, p: 76, pp: 13, chakraCost: 24, desc: '砂铁尖刺贯穿', cat: 'physical', rank: 'B', isKekkei: true, combo: 'MAGNET' },
  { id: 'nj258', name: '体术·怪力(式)', nature: null, p: 99, pp: 9, chakraCost: 32, desc: '查克拉爆发拳击', cat: 'physical', rank: 'B' },
  { id: 'nj259', name: '幻术·枷锁', nature: null, p: 0, pp: 11, chakraCost: 26, desc: '精神枷锁降速', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy' } },
  { id: 'nj260', name: '仙术·蛙叩', nature: null, p: 92, pp: 10, chakraCost: 33, desc: '仙法强化叩击', cat: 'physical', rank: 'B', isSpecial: true },
  { id: 'nj261', name: '火遁·爆炎阵·二', nature: 'FIRE', p: 80, pp: 13, chakraCost: 26, desc: '改良起爆炎阵', cat: 'special', rank: 'B' },
  { id: 'nj262', name: '水遁·浪涛刃', nature: 'WATER', p: 97, pp: 9, chakraCost: 34, desc: '浪涛中藏水刃', cat: 'special', rank: 'B' },
  { id: 'nj263', name: '雷遁·雷狱', nature: 'LIGHTNING', p: 0, pp: 10, chakraCost: 28, desc: '雷场束缚行动', cat: 'status', rank: 'B', effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy' } },
  { id: 'nj264', name: '風遁·裂空连', nature: 'WIND', p: 89, pp: 11, chakraCost: 29, desc: '连环真空斩', cat: 'special', rank: 'B' },
  { id: 'nj265', name: '土遁·地裂', nature: 'EARTH', p: 85, pp: 11, chakraCost: 30, desc: '地面裂隙绊足', cat: 'special', rank: 'B', effect: { type: 'STATUS', status: 'PAR', chance: 0.08, target: 'enemy' } },
  { id: 'nj266', name: '晶遁·翠牢', nature: null, p: 93, pp: 9, chakraCost: 31, desc: '翡翠结晶禁锢', cat: 'special', rank: 'B', isKekkei: true, combo: 'CRYSTAL' },
  { id: 'nj267', name: '火遁·焔旋', nature: 'FIRE', p: 74, pp: 14, chakraCost: 23, desc: '火焰旋风卷敌', cat: 'special', rank: 'B' },
  { id: 'nj268', name: '水遁·漩冲', nature: 'WATER', p: 90, pp: 10, chakraCost: 32, desc: '小型漩涡冲击', cat: 'special', rank: 'B' },
  { id: 'nj269', name: '雷遁·地走连', nature: 'LIGHTNING', p: 84, pp: 12, chakraCost: 27, desc: '地走雷连锁', cat: 'special', rank: 'B' },
  { id: 'nj270', name: '風遁·破岚', nature: 'WIND', p: 100, pp: 8, chakraCost: 35, desc: '岚风破甲', cat: 'special', rank: 'B' },

  { id: 'nj271', name: '火遁·豪焰连斩', nature: 'FIRE', p: 108, pp: 8, chakraCost: 44, desc: '豪火与斩击合一', cat: 'special', rank: 'A' },
  { id: 'nj272', name: '水遁·水铁炮(强)', nature: 'WATER', p: 114, pp: 7, chakraCost: 47, desc: '压缩水炮连射', cat: 'special', rank: 'A' },
  { id: 'nj273', name: '雷遁·神击', nature: 'LIGHTNING', p: 101, pp: 9, chakraCost: 41, desc: '雷光贯胸一击', cat: 'physical', rank: 'A', effect: { type: 'BUFF', stat: 'crit', val: 1, target: 'self', chance: 1 } },
  { id: 'nj274', name: '風遁·大镰', nature: 'WIND', p: 118, pp: 6, chakraCost: 51, desc: '巨镰风刃横斩', cat: 'special', rank: 'A' },
  { id: 'nj275', name: '土遁·山土(式)', nature: 'EARTH', p: 110, pp: 6, chakraCost: 53, desc: '夹击岩壁雏形', cat: 'physical', rank: 'A' },
  { id: 'nj276', name: '钢遁·钢化斩', nature: null, p: 112, pp: 8, chakraCost: 45, desc: '金属硬化斩击', cat: 'physical', rank: 'A', isKekkei: true, combo: 'STEEL' },
  { id: 'nj277', name: '幻术·奈落狱', nature: null, p: 0, pp: 9, chakraCost: 40, desc: '跌入深渊般恐惧', cat: 'status', rank: 'A', effect: { type: 'DEBUFF', stat: 's_atk', val: 2, target: 'enemy' } },
  { id: 'nj278', name: '仙术·油炎弹', nature: null, p: 120, pp: 7, chakraCost: 49, desc: '油与火组合轰击', cat: 'special', rank: 'A', isSpecial: true },
  { id: 'nj279', name: '血继·晶镜连', nature: null, p: 116, pp: 7, chakraCost: 46, desc: '晶遁连折射', cat: 'special', rank: 'A', isKekkei: true, combo: 'CRYSTAL' },
  { id: 'nj280', name: '火遁·炼狱幕', nature: 'FIRE', p: 96, pp: 10, chakraCost: 39, desc: '火幕封锁走位', cat: 'special', rank: 'A', effect: { type: 'DEBUFF', stat: 'eva', val: 1, target: 'enemy' } },
  { id: 'nj281', name: '水遁·海潮壁', nature: 'WATER', p: 0, pp: 8, chakraCost: 43, desc: '水壁提升特防', cat: 'status', rank: 'A', effect: { type: 'BUFF', stat: 's_def', val: 2, target: 'self' } },
  { id: 'nj282', name: '雷遁·岚蹄', nature: 'LIGHTNING', p: 110, pp: 8, chakraCost: 45, desc: '雷光蹄形踏击', cat: 'physical', rank: 'A' },
  { id: 'nj283', name: '風遁·天岚', nature: 'WIND', p: 104, pp: 9, chakraCost: 40, desc: '高空岚涡吸入', cat: 'special', rank: 'A' },
  { id: 'nj284', name: '土遁·天守', nature: 'EARTH', p: 107, pp: 6, chakraCost: 52, desc: '巨岩穹顶镇压', cat: 'special', rank: 'A' },
  { id: 'nj285', name: '体术·朝孔雀(余)', nature: null, p: 111, pp: 6, chakraCost: 48, desc: '孔雀尾焰连击余威', cat: 'physical', rank: 'A', recoil: 0.08 },
  { id: 'nj286', name: '幻术·枷楼罗', nature: null, p: 0, pp: 8, chakraCost: 37, desc: '巨鸟幻影冲心', cat: 'status', rank: 'A', effect: { type: 'DEBUFF', stat: 'spd', val: 1, target: 'enemy' } },
  { id: 'nj287', name: '磁遁·砂金缚', nature: null, p: 119, pp: 7, chakraCost: 47, desc: '砂金金属线束缚', cat: 'special', rank: 'A', isKekkei: true, combo: 'MAGNET' },
  { id: 'nj288', name: '灼遁·炎楼', nature: null, p: 113, pp: 8, chakraCost: 44, desc: '楼形热浪吞噬', cat: 'special', rank: 'A', isKekkei: true, combo: 'SCORCH' },
  { id: 'nj289', name: '岚遁·雷岚矢', nature: null, p: 106, pp: 9, chakraCost: 41, desc: '水雷共导之矢', cat: 'special', rank: 'A', isKekkei: true, combo: 'STORM' },
  { id: 'nj290', name: '水遁·激流葬', nature: 'WATER', p: 113, pp: 5, chakraCost: 55, desc: '激流漩涡葬敌', cat: 'special', rank: 'A' },

  { id: 'nj291', name: '炎遁·黑焰斩', nature: 'FIRE', p: 138, pp: 5, chakraCost: 60, desc: '黑炎与斩击相合', cat: 'special', rank: 'S', isKekkei: true, recoil: 0.11 },
  { id: 'nj292', name: '水遁·海神冲', nature: 'WATER', p: 132, pp: 6, chakraCost: 56, desc: '海量水流一冲', cat: 'special', rank: 'S' },
  { id: 'nj293', name: '雷遁·天罚雷', nature: 'LIGHTNING', p: 125, pp: 4, chakraCost: 63, desc: '垂直天雷灌顶', cat: 'special', rank: 'S', recoil: 0.09 },
  { id: 'nj294', name: '風遁·终岚', nature: 'WIND', p: 120, pp: 5, chakraCost: 59, desc: '终末暴风吞噬', cat: 'special', rank: 'S' },
  { id: 'nj295', name: '土遁·地动·极', nature: 'EARTH', p: 135, pp: 6, chakraCost: 55, desc: '地层翻覆极意', cat: 'special', rank: 'S', recoil: 0.1 },
  { id: 'nj296', name: '磁遁·砂金界法', nature: null, p: 130, pp: 7, chakraCost: 54, desc: '砂金领域封杀', cat: 'special', rank: 'S', isKekkei: true, combo: 'MAGNET' },
  { id: 'nj297', name: '灼遁·蒸灭狱', nature: null, p: 123, pp: 4, chakraCost: 67, desc: '蒸气血雾焚敌', cat: 'special', rank: 'S', isKekkei: true, combo: 'SCORCH', recoil: 0.12 },
  { id: 'nj298', name: '木遁·四柱牢', nature: null, p: 0, pp: 8, chakraCost: 53, desc: '木柱牢笼封镇', cat: 'status', rank: 'S', isKekkei: true, combo: 'WOOD', effect: { type: 'DEBUFF', stat: 'spd', val: 2, target: 'enemy' } },
  { id: 'nj299', name: '冰遁·永冻狱', nature: null, p: 129, pp: 4, chakraCost: 64, desc: '永恒寒气封冻', cat: 'special', rank: 'S', isKekkei: true, combo: 'ICE_RELEASE', effect: { type: 'STATUS', status: 'FRZ', chance: 0.28, target: 'enemy' } },
  { id: 'nj300', name: '尘遁·限界方阵', nature: null, p: 134, pp: 3, chakraCost: 74, desc: '小型立方分解', cat: 'special', rank: 'S', isKekkei: true, combo: 'DUST', recoil: 0.17 },

];

if (JUTSU_DB.length !== 200) {
  // eslint-disable-next-line no-console
  console.warn('[naruto] JUTSU_DB length:', JUTSU_DB.length, '(expected 200)');
}

export function getJutsuByNature(nature) {
  return JUTSU_DB.filter(
    (j) => !j.combo && !j.isSpecial && (j.nature === nature || j.nature === null),
  );
}

export function getJutsuByRank(rank) {
  return JUTSU_DB.filter((j) => j.rank === rank);
}

export function getJutsuByCombo(comboType) {
  return JUTSU_DB.filter((j) => j.combo === comboType);
}

export function getAllJutsuNatures() {
  const out = [];
  const seen = new Set();
  const push = (v) => {
    const key = v === null ? '__NULL__' : String(v);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(v);
  };
  CHAKRA_CONFIG.natureTypes.forEach(push);
  push(null);
  JUTSU_DB.forEach((j) => {
    if (j.combo) push(j.combo);
  });
  return out;
}

export function getRandomJutsu(level, count = 2) {
  const ranks = ranksUnlockedAtLevel(level);
  const pool = fisherYatesCopy(JUTSU_DB.filter((j) => ranks.includes(j.rank)));
  const selected = [];
  for (const j of pool) {
    if (selected.length >= count) break;
    if (!selected.find((s) => s.id === j.id)) selected.push(j);
  }
  return selected;
}

// --- 尾兽系统 ---
export const BIJUU_LIST = [
  { id: 'shukaku', name: '一尾·守鹤', tails: 1, icon: '🦝', nature: 'WIND', transform: { atk: 1.2, def: 1.4, spd: 0.9 }, duration: 4, specialMove: { name: '風遁·砂暴', p: 100, type: 'WIND' } },
  { id: 'matatabi', name: '二尾·又旅', tails: 2, icon: '🐱', nature: 'FIRE', transform: { atk: 1.3, def: 1.1, spd: 1.2 }, duration: 4, specialMove: { name: '猫焰球', p: 110, type: 'FIRE' } },
  { id: 'isobu', name: '三尾·矶的', tails: 3, icon: '🐢', nature: 'WATER', transform: { atk: 1.1, def: 1.5, spd: 0.8 }, duration: 5, specialMove: { name: '水镜之术', p: 90, type: 'WATER' } },
  { id: 'son_goku', name: '四尾·孙悟空', tails: 4, icon: '🦍', nature: 'EARTH', transform: { atk: 1.4, def: 1.2, spd: 1.0 }, duration: 4, specialMove: { name: '熔遁·溶怪之术', p: 120, type: 'GROUND' } },
  { id: 'kokuo', name: '五尾·穆王', tails: 5, icon: '🐴', nature: 'FIRE', transform: { atk: 1.3, def: 1.3, spd: 1.1 }, duration: 4, specialMove: { name: '沸遁·巧雾之术', p: 105, type: 'FIRE' } },
  { id: 'saiken', name: '六尾·犀犬', tails: 6, icon: '🐌', nature: 'WATER', transform: { atk: 1.2, def: 1.2, spd: 1.0 }, duration: 5, specialMove: { name: '泡沫之术', p: 95, type: 'WATER' } },
  { id: 'chomei', name: '七尾·重明', tails: 7, icon: '🪲', nature: 'WIND', transform: { atk: 1.3, def: 1.1, spd: 1.4 }, duration: 4, specialMove: { name: '鳞粉·暴风', p: 80, type: 'WIND' } },
  { id: 'gyuki', name: '八尾·牛鬼', tails: 8, icon: '🐙', nature: 'LIGHTNING', transform: { atk: 1.5, def: 1.3, spd: 1.0 }, duration: 5, specialMove: { name: '尾兽玉·雷遁', p: 140, type: 'ELECTRIC' } },
  { id: 'kurama', name: '九尾·九喇嘛', tails: 9, icon: '🦊', nature: 'FIRE', transform: { atk: 1.6, def: 1.2, spd: 1.3 }, duration: 6, specialMove: { name: '尾兽玉·螺旋手里剑', p: 160, type: 'FIRE' } },
];

export function getBijuuByTails(tails) {
  return BIJUU_LIST.find((b) => b.tails === tails);
}

export function rollBijuu(level, badgeCount) {
  const maxTails = Math.min(9, Math.floor(badgeCount / 1.5) + 1);
  const pool = BIJUU_LIST.filter((b) => b.tails <= maxTails);
  if (pool.length === 0) return BIJUU_LIST[0];
  const weights = pool.map((b) => Math.max(1, 10 - b.tails));
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

// --- 忍者试炼 ---
export const CHUNIN_EXAM_PHASES = [
  { id: 'survival', name: '生存试炼', icon: '⚔️', desc: '连续击败2波敌人不回复HP', duration: 0 },
  { id: 'forest', name: '死亡之森', icon: '🌲', desc: '在森林中收集天地卷轴', duration: 0 },
  { id: 'finals', name: '淘汰赛', icon: '🏆', desc: '4轮对战淘汰赛', duration: 0 },
];

// [已废弃] 笔试已替换为生存试炼，保留数据供未来知识问答玩法使用
export const WRITTEN_EXAM_QUESTIONS = [
  { q: '查克拉的两种基本能量是什么？', opts: ['身体能量与精神能量', '火遁与水遁', '阴遁与阳遁', '仙术与忍术'], ans: 0 },
  { q: '影分身之术与普通分身术的最大区别？', opts: ['消耗更多查克拉', '分身有实体', '需要手印', '只有上忍能用'], ans: 1 },
  { q: '写轮眼属于哪个家族的血继限界？', opts: ['日向一族', '千手一族', '宇智波一族', '奈良一族'], ans: 2 },
  { q: '五大忍村中火之国的忍村是？', opts: ['雾隐村', '砂隐村', '木叶隐村', '岩隐村'], ans: 2 },
  { q: '螺旋丸是由哪位火影创造的？', opts: ['初代火影', '二代火影', '三代火影', '四代火影'], ans: 3 },
  { q: '以下哪个不是三忍之一？', opts: ['自来也', '纲手', '大蛇丸', '卡卡西'], ans: 3 },
  { q: '晓组织的目标是什么？', opts: ['统一五大国', '收集所有尾兽', '消灭木叶', '成为火影'], ans: 1 },
  { q: '查克拉属性有几种基本性质变化？', opts: ['3种', '4种', '5种', '7种'], ans: 2 },
  { q: '仙人模式需要什么才能习得？', opts: ['写轮眼', '尾兽查克拉', '自然能量', '血继限界'], ans: 2 },
  { q: '忍者等级从低到高排列正确的是？', opts: ['中忍→下忍→上忍', '下忍→中忍→上忍', '上忍→中忍→下忍', '下忍→上忍→中忍'], ans: 1 },
  { q: '千鸟是哪种属性变化的忍术？', opts: ['火遁', '水遁', '雷遁', '風遁'], ans: 2 },
  { q: '八门遁甲中最后一门是？', opts: ['生门', '景门', '死门', '惊门'], ans: 2 },
  { q: '木叶村的初代火影全名是？', opts: ['千手扉间', '千手柱间', '波风水门', '猿飞日斩'], ans: 1 },
  { q: '日向一族的白眼主要能力是？', opts: ['复制忍术', '透视与洞察查克拉', '喷火', '隐身'], ans: 1 },
  { q: '尾兽玉主要由哪两种查克拉构成？', opts: ['火与水', '阴与阳', '风与雷', '土与火'], ans: 1 },
  { q: '中忍考试笔试第十题「放弃」意味着？', opts: ['直接淘汰全队', '全队失去资格', '失去资格但队友可继续', '加试一题'], ans: 2 },
  { q: '卡卡西在少年时期属于哪个班？', opts: ['第七班', '水门班', '第八班', '第三班'], ans: 1 },
  { q: '「风影」一般指哪个隐村的领袖？', opts: ['木叶', '砂隐', '雾隐', '岩隐'], ans: 1 },
  { q: '飞雷神之术属于哪类术？', opts: ['幻术', '时空间忍术', '医疗忍术', '体术'], ans: 1 },
  { q: '大蛇丸追求的终极目标是？', opts: ['当火影', '学会所有忍术', '毁灭木叶', '复活初代'], ans: 1 },
  { q: '鸣人母亲漩涡玖辛奈来自哪个家族？', opts: ['宇智波', '漩涡', '千手', '日向'], ans: 1 },
  { q: '佩恩六道的本体长门出身于？', opts: ['木叶', '雨隐', '砂隐', '音隐'], ans: 1 },
  { q: '第四次忍界大战的主要发起方是？', opts: ['晓与带土/斑一方', '木叶单独', '云隐', '雾隐'], ans: 0 },
  { q: '佐助开启永恒万花筒需要？', opts: ['移植兄弟万花筒', '大量写轮眼', '尾兽查克拉', '仙术'], ans: 0 },
  { q: '「木遁」在设定上主要由哪两种性质融合？', opts: ['火+土', '水+土', '风+雷', '水+风'], ans: 1 },
  { q: '木叶白牙是谁？', opts: ['旗木朔茂', '千手柱间', '猿飞阿斯玛', '迈特凯'], ans: 0 },
  { q: '佐助的永恒万花筒写轮眼的能力是？', opts: ['月读', '天照与须佐能乎', '别天神', '伊邪那美'], ans: 1 },
  { q: '六道仙人的本名是？', opts: ['大筒木辉夜', '大筒木羽衣', '大筒木一式', '大筒木桃式'], ans: 1 },
  { q: '下列哪种遁术需要两种性质变化组合？', opts: ['火遁', '水遁', '木遁', '雷遁'], ans: 2 },
  { q: '我爱罗的一尾守鹤属于哪种属性？', opts: ['火', '土', '风', '水'], ans: 2 },
  { q: '暗部的面具通常以什么为造型？', opts: ['恶魔面具', '动物面具', '鬼面具', '花纹面具'], ans: 1 },
  { q: '通灵术需要什么作为媒介？', opts: ['查克拉结晶', '血液', '特殊纸张', '咒印'], ans: 1 },
  { q: '下列谁不是木叶三忍的弟子？', opts: ['鸣人', '佐助', '春野樱', '日向雏田'], ans: 3 },
  { q: '带土的时空间忍术叫什么？', opts: ['飞雷神', '神威', '天送之术', '黄泉比良坂'], ans: 1 },
  { q: '「影」级别的忍者在五大国中共有多少位？', opts: ['3位', '5位', '7位', '10位'], ans: 1 },
  { q: '奈良一族的家传秘术主要与什么相关？', opts: ['影子', '虫', '眼术', '分身'], ans: 0 },
  { q: '秋道一族的秘传忍术「倍化之术」属于？', opts: ['幻术', '体术', '秘传忍术', '血继限界'], ans: 2 },
  { q: '油女志乃操控的是什么？', opts: ['蜘蛛', '寄壊虫', '蝎子', '蜈蚣'], ans: 1 },
  { q: '第二代火影开发了哪项禁术？', opts: ['螺旋丸', '秽土转生', '仙法', '八门遁甲'], ans: 1 },
  { q: '须佐能乎是哪种瞳术的高阶能力？', opts: ['白眼', '轮回眼', '万花筒写轮眼', '转生眼'], ans: 2 },
  { q: '鬼鲛的大刀「鲛肌」有什么特殊能力？', opts: ['吸收查克拉', '切割一切', '放电', '制造幻觉'], ans: 0 },
  { q: '第三代火影被称为？', opts: ['黄色闪光', '忍者教授', '白牙', '忍界之神'], ans: 1 },
  { q: '仙人模式有几种类型？', opts: ['1种', '2种', '3种', '5种'], ans: 2 },
  { q: '宇智波鼬加入晓组织的真正原因是？', opts: ['追求力量', '背叛木叶', '作为木叶间谍', '被强迫加入'], ans: 2 },
  { q: '十尾的人柱力变身后称为？', opts: ['六道仙人', '十尾人柱力', '辉夜', '查克拉之树'], ans: 1 },
  { q: '木叶丸学会的第一个A级忍术是？', opts: ['影分身', '螺旋丸', '变身术', '风遁'], ans: 1 },
  { q: '迈特凯开启八门遁甲的第几门差点杀死斑？', opts: ['第六门', '第七门', '第八门', '第五门'], ans: 2 },
  { q: '下列哪个不是晓组织成员的戒指名称？', opts: ['零', '朱雀', '空', '玉'], ans: 1 },
  { q: '自来也的代号在晓组织的记录中是？', opts: ['山蛤仙人', '传说三忍', '蛤蟆仙人', '妙木山之主'], ans: 2 },
  { q: '长门使用的六道之力来源于？', opts: ['写轮眼', '轮回眼', '白眼', '仙术'], ans: 1 },
];

export function generateExamQuestions(count = 5) {
  const shuffled = fisherYatesCopy(WRITTEN_EXAM_QUESTIONS);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const FOREST_EVENTS = [
  { type: 'battle', desc: '遭遇敌方小队！', enemyCount: 2, levelMod: 0 },
  { type: 'battle', desc: '强敌拦路，必须战斗！', enemyCount: 1, levelMod: 5 },
  { type: 'trap', desc: '触发了陷阱！', damage: 15 },
  { type: 'scroll', desc: '找到了一张卷轴！', scrollType: 'heaven' },
  { type: 'scroll', desc: '发现了地之卷！', scrollType: 'earth' },
  { type: 'heal', desc: '找到了安全休息点', healPct: 30 },
  { type: 'ambush', desc: '被忍者偷袭！', enemyCount: 3, levelMod: -3 },
  { type: 'item', desc: '发现了咒术补给', reward: 'ce_crystal' },
  { type: 'choice', desc: '遇到分岔路口...', options: ['左边小路', '右边大路'] },
  { type: 'battle', desc: '遭遇音忍小队！', enemyCount: 2, levelMod: 3 },
  { type: 'chakra', desc: '找到查克拉回复泉！', healChakra: 30 },
  { type: 'trap', desc: '触发爆炸符！', damage: 20 },
  { type: 'scroll', desc: '击败守卫获得天之卷！', scrollType: 'heaven' },
  { type: 'heal', desc: '发现药师小屋', healPct: 50 },
  { type: 'battle', desc: '遭遇大蛇丸的实验体！', enemyCount: 1, levelMod: 8 },
  { type: 'item', desc: '发现忍术卷轴残页', reward: 'jutsu_scroll' },
];

export const EXAM_FINALS_BRACKETS = [
  { round: 1, name: '预选赛', enemyLvlRange: [0, 5], reward: { gold: 2000 } },
  { round: 2, name: '八强赛', enemyLvlRange: [3, 8], reward: { gold: 3000 } },
  { round: 3, name: '半决赛', enemyLvlRange: [5, 12], reward: { gold: 5000 } },
  { round: 4, name: '决赛', enemyLvlRange: [8, 15], reward: { gold: 8000, title: '忍者试炼冠军' } },
];

export const NARUTO_CHALLENGES = [
  { id: 'nrt_genin_test', name: '下忍毕业考', desc: '击败学院教官', boss: 'iruka', req: 0, isDouble: false, reward: '下忍头巾', badgeReq: 2 },
  { id: 'nrt_bell_test', name: '铃铛测试', desc: '通过卡卡西的铃铛考验', boss: 'kakashi', req: 50, isDouble: true, reward: '写轮眼之力', badgeReq: 3 },
  { id: 'nrt_zabuza', name: '再不斩之战', desc: '击败雾隐叛忍再不斩', boss: 'zabuza', req: 100, isDouble: false, reward: '断刀', badgeReq: 4 },
  { id: 'nrt_orochimaru', name: '大蛇丸之试炼', desc: '在死亡之森对抗大蛇丸', boss: 'orochimaru', req: 200, isDouble: false, reward: '蛇之印记', badgeReq: 6 },
  { id: 'nrt_akatsuki', name: '晓之追踪', desc: '击败晓组织成员', boss: 'akatsuki', req: 300, isDouble: true, reward: '晓袍', badgeReq: 8 },
  { id: 'nrt_pain', name: '佩恩袭击', desc: '保卫木叶！击败佩恩六道', boss: 'pain', req: 400, isDouble: true, reward: '仙人之力', badgeReq: 10 },
  { id: 'nrt_madara', name: '宇智波斑', desc: '对抗传说中的忍者之神', boss: 'madara', req: 500, isDouble: false, reward: '须佐能乎', badgeReq: 12 },
  { id: 'nrt_kaguya', name: '大筒木辉夜', desc: '封印忍界的始祖', boss: 'kaguya', req: 600, isDouble: true, reward: '六道之力', badgeReq: 13 },
];

// --- 火影20章主线剧情 ---
export const NARUTO_STORY_CHAPTERS = [
  {
    id: 1, arc: '忍者学院篇', title: '影之意志', badgeReq: 3, minLevel: 15, mapId: 301,
    intro: '木叶忍者学院的毕业考试即将开始。一股不安的气息笼罩着村子——有人企图窃取初代火影留下的封印卷轴。作为新一届学员中最有潜力的忍者，你必须在考试中证明自己，同时阻止叛忍的阴谋。',
    stages: [
      { name: '学院毕业考', desc: '通过伊鲁卡老师的实战测试', bossName: '伊鲁卡', bossLevel: 18, bossCount: 1, reward: { gold: 2000, title: '木叶下忍' } },
      { name: '封印卷轴事件', desc: '追击窃取卷轴的叛忍水木', bossName: '叛忍水木', bossLevel: 22, bossCount: 1, reward: { gold: 3000 } },
      { name: '第七班结成', desc: '通过卡卡西的铃铛测试——协作才是关键', bossName: '旗木卡卡西', bossLevel: 28, bossCount: 1, isDouble: true, reward: { gold: 4000, jutsu: 'shadow_clone' } },
    ],
    epilogue: '你成为了正式的下忍，加入了第七班。卡卡西老师说过："在忍者世界里，不遵守规则的人是废物，但是抛弃同伴的人比废物还不如。"这句话深深刻在了你的心里。',
  },
  {
    id: 2, arc: '波之国篇', title: '雾中的恶魔', badgeReq: 3, minLevel: 22, mapId: 302,
    intro: '第七班的首个C级任务——护送桥梁建筑师达兹纳前往波之国。然而任务的真相远比想象中危险，雾隐的叛忍桃地再不斩正等待着你们。',
    stages: [
      { name: '鬼兄弟伏击', desc: '击退在路上伏击的雾隐鬼兄弟', bossName: '鬼兄弟', bossLevel: 24, bossCount: 2, reward: { gold: 2500 } },
      { name: '水上对决', desc: '与沉默的杀人鬼再不斩交战', bossName: '桃地再不斩', bossLevel: 32, bossCount: 1, reward: { gold: 4000 } },
      { name: '白的冰镜', desc: '突破白的魔镜冰晶', bossName: '白', bossLevel: 30, bossCount: 1, reward: { gold: 3500, jutsu: 'ice_prison' } },
      { name: '桥上的决战', desc: '再不斩与白的最终之战', bossName: '再不斩 & 白', bossLevel: 35, bossCount: 2, isDouble: true, reward: { gold: 6000, title: '波之国英雄' } },
    ],
    epilogue: '"再不斩……我也想去你要去的地方。"白的话语在冰雪中消散。你第一次见证了忍者的宿命与羁绊的力量。大桥被命名为——「鸣人大桥」。',
  },
  {
    id: 3, arc: '中忍考试篇·上', title: '暗流涌动', badgeReq: 4, minLevel: 28, mapId: 303,
    intro: '中忍选拔考试即将举行，来自各国的年轻忍者齐聚木叶。然而表面的竞争之下暗藏杀机——砂隐和音隐的联合叛乱计划正在酝酿。',
    stages: [
      { name: '死亡之森', desc: '在危机四伏的第44号训练场存活并收集卷轴', bossName: '音忍三人组', bossLevel: 30, bossCount: 3, reward: { gold: 3500 } },
      { name: '大蛇丸的标记', desc: '遭遇S级叛忍大蛇丸的袭击', bossName: '大蛇丸(受限)', bossLevel: 38, bossCount: 1, reward: { gold: 5000 } },
      { name: '预选赛激斗', desc: '在预选淘汰赛中击败对手', bossName: '日向宁次', bossLevel: 33, bossCount: 1, reward: { gold: 4000, jutsu: 'rasengan' } },
    ],
    epilogue: '你在预选赛中展现了惊人的实力和不屈的意志。但是大蛇丸的咒印和暗中部署的间谍让你意识到——这场考试的真正目的远不止选拔中忍。',
  },
  {
    id: 4, arc: '中忍考试篇·下', title: '木叶崩坏', badgeReq: 5, minLevel: 33, mapId: 303,
    intro: '中忍考试决赛当天，砂隐与音隐的叛乱终于爆发。大蛇丸亲自出手刺杀三代火影，一尾人柱力我爱罗暴走。木叶到了最危险的时刻。',
    stages: [
      { name: '决赛——砂之我爱罗', desc: '在决赛中对战被怨恨驱使的我爱罗', bossName: '我爱罗', bossLevel: 37, bossCount: 1, reward: { gold: 5000 } },
      { name: '一尾守鹤觉醒', desc: '我爱罗失控，一尾觉醒！用意志压制守鹤', bossName: '一尾·守鹤', bossLevel: 42, bossCount: 1, isDouble: true, reward: { gold: 7000, jutsu: 'body_flicker' } },
      { name: '保卫木叶', desc: '在混乱中击退入侵的音忍', bossName: '音忍精英队', bossLevel: 36, bossCount: 3, reward: { gold: 4500, title: '木叶守护者' } },
    ],
    epilogue: '三代火影猿飞日斩以生命为代价封印了大蛇丸的双手。"树叶飞舞之处，火亦生生不息"——这是火之意志的传承。你在这场浩劫中蜕变，不再只是一个新手忍者。',
  },
  {
    id: 5, arc: '寻找纲手篇', title: '传说的三忍', badgeReq: 5, minLevel: 38, mapId: 304,
    intro: '木叶需要新的火影。自来也带你踏上旅途，寻找最后的传说三忍——医疗忍者纲手。但大蛇丸也在暗中行动，企图利用纲手的医术修复他被封印的双手。',
    stages: [
      { name: '药师兜的阻击', desc: '大蛇丸的间谍药师兜出手拦截', bossName: '药师兜', bossLevel: 40, bossCount: 1, reward: { gold: 5000 } },
      { name: '三忍大战', desc: '协助自来也与大蛇丸对峙', bossName: '大蛇丸', bossLevel: 46, bossCount: 1, isDouble: true, reward: { gold: 8000, jutsu: 'sage_rasengan' } },
      { name: '说服纲手', desc: '向迷失的传说医忍证明忍者的梦想还活着', bossName: '纲手(试炼)', bossLevel: 44, bossCount: 1, reward: { gold: 6000, jutsu: 'medical_ninjutsu' } },
    ],
    epilogue: '纲手被你的决心打动，决定回到木叶担任第五代火影。在她戴上火影的斗笠那一刻，木叶终于从崩坏的阴影中走了出来。自来也看着你，眼中满是对未来的期许。',
  },
  {
    id: 6, arc: '佐助追回篇', title: '最好的朋友', badgeReq: 6, minLevel: 42, mapId: 305,
    intro: '佐助被大蛇丸的力量诱惑，决定叛离木叶。五人小队紧急出动追赶，却在路上遭遇大蛇丸的精英手下——音忍四人众。每一个同伴都留下来为你断后。',
    stages: [
      { name: '多由也的幻术', desc: '突破笛声幻术的控制', bossName: '多由也', bossLevel: 43, bossCount: 1, reward: { gold: 5000 } },
      { name: '鬼童丸之网', desc: '在密网中找到破绽', bossName: '鬼童丸', bossLevel: 44, bossCount: 1, reward: { gold: 5000 } },
      { name: '终末之谷', desc: '在初代与斑的雕像之间，与最好的朋友决战', bossName: '宇智波佐助', bossLevel: 48, bossCount: 1, reward: { gold: 10000, jutsu: 'chidori', title: '羁绊之证' } },
    ],
    epilogue: '你没能带回佐助。雨水混着泪水打在终末之谷的石像上。但你立下了不会放弃的誓言——"我会变强，强到足以把你带回来！"从这一天起，你踏上了为期两年半的修行之路。',
  },
  {
    id: 7, arc: '晓之阴影篇', title: '红云黑袍', badgeReq: 7, minLevel: 48, mapId: 306,
    intro: '两年半的修行结束。你从妙木山归来，实力突飞猛进。然而暗云密布——晓组织正式展开对尾兽人柱力的猎杀行动。一尾人柱力我爱罗被掳走。',
    stages: [
      { name: '宇智波鼬的幻术', desc: '在追踪途中遭遇鼬的分身阻截', bossName: '鼬(分身)', bossLevel: 50, bossCount: 1, reward: { gold: 6000 } },
      { name: '蝎的百傀儡', desc: '与砂隐傀儡大师赤砂之蝎交战', bossName: '赤砂之蝎', bossLevel: 53, bossCount: 1, reward: { gold: 7000 } },
      { name: '迪达拉的艺术', desc: '追击带走我爱罗的爆炸艺术家迪达拉', bossName: '迪达拉', bossLevel: 52, bossCount: 1, reward: { gold: 7000, jutsu: 'c0_art' } },
      { name: '救出风影', desc: '解除封印，唤醒沉睡的我爱罗', bossName: '晓封印守卫', bossLevel: 55, bossCount: 2, isDouble: true, reward: { gold: 10000, title: '晓之克星' } },
    ],
    epilogue: '千代婆婆用"己生转生"换回了我爱罗的生命。目送她安详离去的身影，你更加坚定了守护羁绊的决心。但晓组织还有更多令人胆寒的成员在暗中等待……',
  },
  {
    id: 8, arc: '不死搭档篇', title: '诅咒与信仰', badgeReq: 7, minLevel: 53, mapId: 306,
    intro: '守护者十二士之一的地陆叛变，而更大的威胁来自晓的不死搭档——飞段与角都。猿飞阿斯玛老师在与飞段的战斗中壮烈牺牲。第十班立誓复仇。',
    stages: [
      { name: '飞段的诅咒', desc: '对抗邪神教徒的不死之身和血之诅咒', bossName: '飞段', bossLevel: 55, bossCount: 1, reward: { gold: 7000 } },
      { name: '角都的五颗心脏', desc: '击破五遁心脏组合体', bossName: '角都', bossLevel: 58, bossCount: 1, isDouble: true, reward: { gold: 8000, jutsu: 'rasenshuriken' } },
      { name: '风遁·螺旋手里剑', desc: '以全新的S级忍术终结角都', bossName: '角都(全力)', bossLevel: 62, bossCount: 1, reward: { gold: 10000, title: '风之传承者' } },
    ],
    epilogue: '鹿丸用智慧将飞段永远埋葬在奈良家的鹿林之下。阿斯玛老师留下了遗志和未点燃的烟。"吾王已定——就是木叶的未来。"第十班在悲痛中完成了成长。',
  },
  {
    id: 9, arc: '宇智波真相篇', title: '兄弟的宿命', badgeReq: 8, minLevel: 58, mapId: 307,
    intro: '佐助终于踏上了复仇之路，与宇智波鼬展开了宿命的对决。而你也在追踪佐助的过程中逐渐接近了宇智波一族灭族事件的真相。',
    stages: [
      { name: '蛇小队遭遇', desc: '追踪途中遭遇佐助的新团队"蛇"', bossName: '蛇小队·重吾', bossLevel: 58, bossCount: 1, reward: { gold: 6000 } },
      { name: '鼬的试炼', desc: '鼬故意在你面前现身，测试你的决心', bossName: '宇智波鼬', bossLevel: 65, bossCount: 1, reward: { gold: 12000, jutsu: 'tsukuyomi_glance' } },
      { name: '真相的重量', desc: '带土揭露了鼬的真相——击退面具男的进攻', bossName: '面具男·带土', bossLevel: 68, bossCount: 1, reward: { gold: 12000, title: '真相的守望者' } },
    ],
    epilogue: '鼬用生命守护了佐助和木叶。他不是叛徒，而是最伟大的忍者。"原来鼬……一直在笑着保护着一切。"真相如利刃刺穿了仇恨的迷雾，但佐助选择了更深的黑暗。',
  },
  {
    id: 10, arc: '自来也之死篇', title: '师徒的预言', badgeReq: 8, minLevel: 62, mapId: 308,
    intro: '自来也只身前往雨隐村调查晓组织首领的真实身份。他发现了一个令人心碎的真相——晓的首领佩恩，正是他当年在雨之国收养的弟子长门。',
    stages: [
      { name: '雨隐的暗哨', desc: '协助自来也突入雨隐村', bossName: '雨隐暗部', bossLevel: 62, bossCount: 3, reward: { gold: 7000 } },
      { name: '六道佩恩', desc: '面对拥有轮回眼的六具傀儡体', bossName: '佩恩(畜生道)', bossLevel: 66, bossCount: 2, isDouble: true, reward: { gold: 9000 } },
      { name: '师父的遗志', desc: '从佩恩手中保住自来也留下的密码情报', bossName: '佩恩(天道)', bossLevel: 70, bossCount: 1, reward: { gold: 15000, jutsu: 'sage_art_bullet', title: '不放弃的忍道' } },
    ],
    epilogue: '"永不放弃"——自来也将这个词贯彻到了生命的最后一刻。他留下的密码指向了佩恩的秘密。你拿着沾血的遗稿，发誓要继承师父的一切。妙木山之上，大蛤蟆仙人的预言即将应验。',
  },
  {
    id: 11, arc: '仙术修行篇', title: '妙木山的试炼', badgeReq: 9, minLevel: 66, mapId: 309,
    intro: '为了对抗佩恩，你前往妙木山修炼仙术。在蛤蟆仙人们的指导下，你必须学会感知和运用自然能量——但稍有不慎就会变成石蛙。',
    stages: [
      { name: '自然能量感知', desc: '在静止中感知自然之力', bossName: '仙蛤蟆(修行)', bossLevel: 65, bossCount: 1, reward: { gold: 8000, jutsu: 'sage_sensing' } },
      { name: '仙人模式实战', desc: '用仙术之力击败深作仙人的考验', bossName: '深作仙人', bossLevel: 70, bossCount: 1, reward: { gold: 10000, jutsu: 'sage_meditation' } },
      { name: '仙术极限', desc: '在极限状态下维持仙人模式并战斗', bossName: '妙木山守护兽', bossLevel: 74, bossCount: 1, reward: { gold: 12000, title: '蛤蟆仙人' } },
    ],
    epilogue: '你掌握了完美的仙人模式。橙色的眼影和蟾蜍般的瞳孔标志着你已经超越了绝大多数忍者。自来也未能完成的事，由你来完成。佩恩……我来了。',
  },
  {
    id: 12, arc: '佩恩袭击篇', title: '木叶的毁灭与重生', badgeReq: 9, minLevel: 70, mapId: 310,
    intro: '佩恩六道降临木叶，神罗天征将整个村庄夷为平地。无数忍者倒下。在最绝望的时刻，你从妙木山逆向通灵归来，带着仙术之力迎战毁灭木叶的神。',
    stages: [
      { name: '六道歼灭战', desc: '依次击破佩恩的各道傀儡', bossName: '佩恩·三道', bossLevel: 72, bossCount: 3, reward: { gold: 10000 } },
      { name: '天道佩恩', desc: '对决拥有引力与斥力的天道佩恩', bossName: '佩恩·天道', bossLevel: 78, bossCount: 1, reward: { gold: 15000 } },
      { name: '九尾暴走', desc: '愤怒中九尾力量失控，在意识深处战胜心魔', bossName: '九尾(暴走)', bossLevel: 80, bossCount: 1, reward: { gold: 12000 } },
      { name: '与长门的对话', desc: '找到本体长门，用话语而非拳头化解仇恨', bossName: '长门(本体)', bossLevel: 82, bossCount: 1, reward: { gold: 20000, jutsu: 'six_paths_push', title: '英雄' } },
    ],
    epilogue: '"我相信你就是那个预言之子。"长门用轮回天生之术复活了木叶所有死者，自己也付出了生命的代价。当你踏着废墟归来，整个村子都在呼喊着你的名字。从今天起——你是木叶的英雄。',
  },
  {
    id: 13, arc: '五影会谈篇', title: '影的觉悟', badgeReq: 10, minLevel: 74, mapId: 311,
    intro: '晓组织的威胁迫使五大忍村史无前例地联合起来。然而五影会谈现场却被面具男宣战搅局——第四次忍界大战即将爆发。宇智波佐助也在暗中行动。',
    stages: [
      { name: '佐助袭击会场', desc: '拦截冲入五影会谈的佐助', bossName: '佐助(须佐能乎)', bossLevel: 76, bossCount: 1, reward: { gold: 12000, jutsu: 'amaterasu' } },
      { name: '团藏的真面目', desc: '揭露志村团藏的黑暗交易', bossName: '志村团藏', bossLevel: 78, bossCount: 1, reward: { gold: 10000, jutsu: 'izanagi' } },
      { name: '宣战——月之眼计划', desc: '击退面具男的试探性进攻', bossName: '面具男(宣战)', bossLevel: 80, bossCount: 1, isDouble: true, reward: { gold: 15000, title: '忍界联军先锋' } },
    ],
    epilogue: '"我要把所有尾兽全部收集……发动无限月读！"面具男的宣言震惊了所有影。五大国数百年的恩怨在这一刻化为统一的决心。忍者联军结成——第四次忍界大战，开战！',
  },
  {
    id: 14, arc: '九尾之力篇', title: '与九尾和解', badgeReq: 10, minLevel: 78, mapId: 311,
    intro: '大战前夕，你被安排在龟之岛修炼以控制九尾之力。然而内心深处的九尾并不打算轻易臣服——你必须用意志和行动证明自己配得上这份力量。',
    stages: [
      { name: '瀑布中的自我', desc: '在真实之瀑布面对内心的黑暗面', bossName: '暗之自我', bossLevel: 78, bossCount: 1, reward: { gold: 10000 } },
      { name: '八尾奇拉比', desc: '向完美人柱力奇拉比学习尾兽控制', bossName: '奇拉比(修行)', bossLevel: 82, bossCount: 1, reward: { gold: 12000 } },
      { name: '九尾查克拉争夺', desc: '在精神世界中与九尾九喇嘛正面对峙', bossName: '九尾·九喇嘛', bossLevel: 88, bossCount: 1, reward: { gold: 20000, jutsu: 'eight_gates', title: '人柱力' } },
    ],
    epilogue: '"你就是我的——搭档。"九喇嘛第一次叫出了你的名字。你与尾兽不再是宿主与囚笼的关系，而是并肩作战的伙伴。金色的九尾查克拉衣笼罩全身，忍界大战的胜利之光在远方闪耀。',
  },
  {
    id: 15, arc: '忍界大战·前篇', title: '百万人的意志', badgeReq: 11, minLevel: 82, mapId: 312,
    intro: '第四次忍界大战全面爆发。秽土转生将无数传说忍者从死者中召回，白绝大军铺天盖地。忍界联军各师团分散应对，而你必须在关键战场扭转战局。',
    stages: [
      { name: '白绝军团', desc: '击退第一波白绝入侵', bossName: '白绝精英', bossLevel: 80, bossCount: 4, reward: { gold: 10000 } },
      { name: '秽土转生·二代水影', desc: '对抗被秽土转生召回的历代影级忍者', bossName: '二代水影', bossLevel: 84, bossCount: 1, reward: { gold: 12000 } },
      { name: '秽土转生·三代雷影', desc: '找到传说雷影不死之身的弱点', bossName: '三代雷影', bossLevel: 86, bossCount: 1, reward: { gold: 12000, jutsu: 'lightning_chakra_mode' } },
      { name: '金角银角兄弟', desc: '阻止九尾查克拉被六道仙人之宝具封印', bossName: '金角·银角', bossLevel: 85, bossCount: 2, isDouble: true, reward: { gold: 15000, title: '联军之盾' } },
    ],
    epilogue: '白绝大军被击退，秽土转生的历代英魂被逐一解放。但这只是开始——带土已经将十尾的复活仪式推进到了最后阶段。真正的战斗才刚刚开始。',
  },
  {
    id: 16, arc: '忍界大战·中篇', title: '十尾的复活', badgeReq: 11, minLevel: 86, mapId: 312,
    intro: '带土与兜联手，十尾外道魔像开始吸收尾兽查克拉。历代火影被秽土转生召回参战。战场的规模前所未有——忍界的命运将在这一刻决定。',
    stages: [
      { name: '宇智波带土', desc: '揭开面具后的真正敌人——旗木卡卡西的故友', bossName: '带土(面具碎裂)', bossLevel: 88, bossCount: 1, reward: { gold: 15000, jutsu: 'raikiri' } },
      { name: '十尾觉醒', desc: '在十尾的巨大力量面前守住战线', bossName: '十尾(不完全体)', bossLevel: 92, bossCount: 1, isDouble: true, reward: { gold: 18000 } },
      { name: '历代火影参战', desc: '与秽土转生的四位火影并肩作战', bossName: '十尾分裂体', bossLevel: 90, bossCount: 3, reward: { gold: 15000, title: '火影之继承者' } },
    ],
    epilogue: '四位火影的灵魂展开四赤阳阵封印十尾。二代火影扉间感叹道："后辈的火之意志比我们更耀眼。"但带土做出了最疯狂的决定——成为十尾人柱力。',
  },
  {
    id: 17, arc: '忍界大战·后篇', title: '六道之力', badgeReq: 12, minLevel: 90, mapId: 312,
    intro: '带土成为了十尾人柱力，拥有了近乎神的力量。但在佐助和你的联手攻击下，六道仙人的灵魂出现了，赋予了你们阴阳之力。然而宇智波斑才是最终的阴谋家。',
    stages: [
      { name: '十尾人柱力·带土', desc: '对决拥有六道之力的带土', bossName: '六道·带土', bossLevel: 93, bossCount: 1, reward: { gold: 18000, jutsu: 'truth_orbs' } },
      { name: '宇智波斑降临', desc: '真正的幕后黑手登场——传说中的宇智波斑', bossName: '宇智波斑(双轮回眼)', bossLevel: 96, bossCount: 1, reward: { gold: 22000 } },
      { name: '无限月读', desc: '斑发动了无限月读——在幻术之树的根须中拯救被困的同伴', bossName: '神树分身', bossLevel: 94, bossCount: 3, isDouble: true, reward: { gold: 18000, jutsu: 'forbidden_heal', title: '六道之力觉醒者' } },
    ],
    epilogue: '无限月读将整个世界笼罩在幻术的梦境中。在神树的光芒中，只有拥有六道之力的你和佐助还站在战场上。但一个更古老、更可怕的存在正在觉醒——大筒木辉夜。',
  },
  {
    id: 18, arc: '辉夜篇', title: '忍界的始祖', badgeReq: 12, minLevel: 94, mapId: 313,
    intro: '大筒木辉夜——查克拉之祖、六道仙人之母，借斑之躯复活。她拥有支配空间的神力，能将战场切换至熔岩、冰原、重力、沙漠等异次元。这是超越忍术的神话级战斗。',
    stages: [
      { name: '熔岩次元', desc: '在熔岩世界中与辉夜的分身交战', bossName: '辉夜·熔岩化身', bossLevel: 96, bossCount: 1, reward: { gold: 20000 } },
      { name: '重力次元', desc: '在超重力环境下突破辉夜的骨灰脉', bossName: '辉夜·重力化身', bossLevel: 97, bossCount: 1, reward: { gold: 20000 } },
      { name: '始祖的封印', desc: '用阴阳之力执行六道·地爆天星', bossName: '大筒木辉夜', bossLevel: 100, bossCount: 1, isDouble: true, reward: { gold: 30000, jutsu: 'six_paths_push', title: '封印之英雄' } },
    ],
    epilogue: '"六道·地爆天星！"你与佐助同时按下阴阳之印。辉夜被重新封印，化为新的月亮。带土在最后关头选择了救赎，用神威送回了被困异次元的众人。大战结束了——但还有最后一战。',
  },
  {
    id: 19, arc: '终末之谷篇', title: '宿命的终章', badgeReq: 13, minLevel: 96, mapId: 305,
    intro: '佐助宣布要杀死所有五影、独自背负世界的仇恨。在终末之谷的初代与斑的雕像前，你与佐助展开了最后的决战。这不是为了仇恨，而是为了救赎。',
    stages: [
      { name: '须佐能乎 vs 九尾', desc: '佐助的完全体须佐能乎对阵九尾查克拉', bossName: '佐助(完全体须佐)', bossLevel: 98, bossCount: 1, reward: { gold: 20000 } },
      { name: '因陀罗之矢 vs 尾兽螺旋手里剑', desc: '双方倾尽最后的力量进行终极碰撞', bossName: '佐助(六道)', bossLevel: 100, bossCount: 1, reward: { gold: 25000 } },
      { name: '和解之印', desc: '用最后的力气——不是为了击败他，而是为了拉住他的手', bossName: '佐助(真·最终)', bossLevel: 100, bossCount: 1, reward: { gold: 30000, jutsu: 'reaper_death', title: '忍道的证明' } },
    ],
    epilogue: '你们各失去了一条手臂，倒在终末之谷的废墟中。佐助终于笑了——"认输了。"你解开了束缚他多年的仇恨之链。初代和斑的石像崩塌了，但在同一个地方，将筑起新时代的基石。',
  },
  {
    id: 20, arc: '新时代篇', title: '火之意志永续', badgeReq: 13, minLevel: 100, mapId: 314,
    intro: '战争结束了。世界迎来了前所未有的和平。你面临最后的选择——成为新一代火影的候选人。但和平并不意味着没有威胁，大筒木一族的残余力量蠢蠢欲动……',
    stages: [
      { name: '火影就任试炼', desc: '在所有影级忍者面前证明你的实力', bossName: '历代影·试炼幻象', bossLevel: 100, bossCount: 2, isDouble: true, reward: { gold: 25000 } },
      { name: '大筒木残党', desc: '击退从月球降临的大筒木分家后裔', bossName: '大筒木·桃式', bossLevel: 100, bossCount: 1, reward: { gold: 30000, jutsu: 'night_moth' } },
      { name: '终极之战——大筒木一式', desc: '面对大筒木一族的最强者', bossName: '大筒木一式', bossLevel: 100, bossCount: 1, reward: { gold: 50000, jutsu: 'truth_orbs', title: '七代目火影' } },
    ],
    epilogue: '你站在火影岩上，俯瞰着和平的木叶村。身后是刻着历代火影面容的山崖，面前是无边的蓝天。从忍者学院的新生，到拯救忍界的英雄，再到守护和平的火影——你的忍道，就是永不放弃。\n\n"只要有树叶飞舞的地方，火就会燃烧。火的影子将照耀着村子，并且让新的树叶发芽。"\n\n——完——',
  },
];

export const DEFAULT_NARUTO_STATE = {
  ninjaRank: 'academy',
  examsCompleted: 0,
  examPhase: null,
  examProgress: null,
  bijuuCollected: [],
  jutsuScrolls: [],
  totalChakraUsed: 0,
  examHighScore: 0,
  lastExamDate: null,
  jutsuMastery: {},
  jutsuCollection: [],
  chakraAffinity: null,
  storyProgress: {},
};

export const NARUTO_WORLD_BOSSES = [
  {
    id: 'wb_naruto_kurama',
    name: '暴走九尾',
    icon: '🦊',
    baseHp: 80000,
    baseLv: 80,
    phases: [
      { hpPct: 0.7, desc: '尾兽化加速', effect: { spdMult: 1.5 } },
      { hpPct: 0.3, desc: '尾兽玉蓄力', effect: { atkMult: 2.0, defMult: 0.7 } },
    ],
  },
  {
    id: 'wb_juubi',
    name: '十尾',
    icon: '👁️',
    baseHp: 120000,
    baseLv: 95,
    phases: [
      { hpPct: 0.5, desc: '分裂形态', effect: { defMult: 1.8 } },
      { hpPct: 0.2, desc: '神树觉醒', effect: { atkMult: 2.5, spdMult: 1.3 } },
    ],
  },
];

// --- 忍术精通系统 ---
export const JUTSU_MASTERY_LEVELS = [
  { level: 0, name: '未习得', icon: '⬜', minUses: 0, bonus: 0 },
  { level: 1, name: '入门', icon: '🟩', minUses: 3, bonus: 0.02 },
  { level: 2, name: '熟练', icon: '🟦', minUses: 10, bonus: 0.05 },
  { level: 3, name: '精通', icon: '🟪', minUses: 25, bonus: 0.08 },
  { level: 4, name: '极意', icon: '🟧', minUses: 50, bonus: 0.12 },
  { level: 5, name: '奥义', icon: '🟥', minUses: 100, bonus: 0.15 },
];

export function getJutsuMasteryLevel(uses) {
  for (let i = JUTSU_MASTERY_LEVELS.length - 1; i >= 0; i--) {
    if (uses >= JUTSU_MASTERY_LEVELS[i].minUses) return JUTSU_MASTERY_LEVELS[i];
  }
  return JUTSU_MASTERY_LEVELS[0];
}

export function getJutsuMasteryBonus(jutsuId, masteryMap) {
  const uses = (masteryMap || {})[jutsuId] || 0;
  return getJutsuMasteryLevel(uses).bonus;
}

// --- 查克拉亲和判定 ---
export function calcChakraAffinity(masteryMap) {
  if (!masteryMap) return null;
  const natureCounts = {};
  for (const [jutsuId, uses] of Object.entries(masteryMap)) {
    const jutsu = JUTSU_DB.find(j => j.id === jutsuId);
    if (!jutsu || !jutsu.nature) continue;
    natureCounts[jutsu.nature] = (natureCounts[jutsu.nature] || 0) + uses;
  }
  let best = null;
  let bestCount = 0;
  for (const [nature, count] of Object.entries(natureCounts)) {
    if (count > bestCount) { best = nature; bestCount = count; }
  }
  return best;
}
