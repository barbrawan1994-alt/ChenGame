// ==========================================
// [新增] 特性数据库 (精确数值版)
// ==========================================
export const TRAIT_DB = {
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

  // --- 世界首领 / 天气与场地类 ---
  ice_body:    { name: '冰之躯', desc: '冰雹天气时每回合恢复1/16HP', type: 'PASSIVE' },
  dark_aura:   { name: '暗黑气场', desc: '场上所有恶系技能威力提升33%', type: 'BATTLE' },
  flame_body:  { name: '火焰之躯', desc: '受接触攻击时30%概率灼伤对手', type: 'BATTLE' },
  sand_stream: { name: '扬沙', desc: '出场时召唤沙暴天气', type: 'ENTRY' },
  magic_guard: { name: '魔法防御', desc: '不受技能以外的伤害（天气/中毒/灼伤等）', type: 'PASSIVE' },
  magic_bounce: { name: '魔法反射', desc: '将对手的变化技能反弹回去', type: 'BATTLE' },
  fairy_aura:  { name: '妖精气场', desc: '场上所有妖精系技能威力提升33%', type: 'BATTLE' },
};

// ==========================================
// [新增] 20种性格数据库 (平衡设计)
// stats: 属性修正倍率 (1.15 = +15%, 0.85 = -15%)
// exp: 升级经验需求倍率 (0.8 = 升级快, 1.2 = 升级慢)
// ==========================================
export const NATURE_DB = {
  // --- 均衡与天才组 (属性加成少，但升级快) ---
  hardy:   { name: '努力', desc: '全属性微增，升级较快', stats: { hp:1.01, p_atk:1.01, p_def:1.01, s_atk:1.01, s_def:1.01, spd:1.01 }, exp: 0.9 },
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
  bold:    { name: '大胆', desc: '物防++ / 物攻--', stats: { p_def: 1.18, p_atk: 0.82 }, exp: 1.05 },
  impish:  { name: '淘气', desc: '物防++ / 特攻--', stats: { p_def: 1.18, s_atk: 0.82 }, exp: 1.05 },
  calm:    { name: '温和', desc: '特防++ / 物攻--', stats: { s_def: 1.18, p_atk: 0.82 }, exp: 1.05 },
  careful: { name: '慎重', desc: '特防++ / 特攻--', stats: { s_def: 1.18, s_atk: 0.82 }, exp: 1.05 },
};
