// ==========================================
// 奥特曼战斗系统 - 数据定义
// ==========================================

// 稀有度配置
export const ULTRA_RARITY = {
  R:   { label: 'R',   color: '#3F88C5', bgGrad: 'linear-gradient(135deg,#3F88C5,#2E6DA4)', statRange: [50, 80], skillCount: 3 },
  SR:  { label: 'SR',  color: '#9B59B6', bgGrad: 'linear-gradient(135deg,#9B59B6,#8E44AD)', statRange: [75, 110], skillCount: 4 },
  SSR: { label: 'SSR', color: '#F39C12', bgGrad: 'linear-gradient(135deg,#F39C12,#E67E22)', statRange: [100, 150], skillCount: 5 },
};

// 阵营配置
export const ULTRA_FACTION = {
  ultra:  { name: '光之巨人', color: '#E53935', icon: '🔴', desc: '来自光之国的正义战士' },
  kaiju:  { name: '怪兽',     color: '#4E342E', icon: '🟤', desc: '拥有强大破坏力的巨兽' },
  alien:  { name: '外星人',   color: '#1565C0', icon: '🔵', desc: '来自宇宙各处的智慧种族' },
};

// 属性类型
export const ULTRA_ROLE = {
  balanced:  { name: '均衡型', desc: '各项能力均衡' },
  attacker:  { name: '攻击型', desc: '物理攻击突出' },
  sp_atk:    { name: '特攻型', desc: '能量攻击突出' },
  tank:      { name: '坦克型', desc: 'HP和防御突出' },
  speed:     { name: '速攻型', desc: '速度极高' },
  control:   { name: '控制型', desc: '擅长控制和debuff' },
  ultimate:  { name: '究极型', desc: '全面强大' },
};

// ==========================================
// 技能数据库 (60种技能)
// ==========================================
export const ULTRA_SKILLS = [
  // === 光之巨人通用技能 ===
  { id: 'us_spacium',     name: '斯派修姆光线',   p: 90,  cat: 'special', pp: 5, effect: null, desc: '双臂交叉释放的经典光线' },
  { id: 'us_emerium',     name: '艾梅利姆光线',   p: 85,  cat: 'special', pp: 6, effect: { accDown: 1 }, desc: '从额头宝石射出的精准光线' },
  { id: 'us_metalium',    name: '梅塔利姆光线',   p: 95,  cat: 'special', pp: 4, effect: { burn: 0.2 }, desc: '极高温度的必杀光线' },
  { id: 'us_storium',     name: '斯托利姆光线',   p: 100, cat: 'special', pp: 3, effect: null, desc: '奥特六兄弟中最强的光线之一' },
  { id: 'us_zepellion',   name: '哉佩利敖光线',   p: 110, cat: 'special', pp: 3, effect: { defDown: 1 }, desc: '迪迦的终极必杀光线' },
  { id: 'us_solget',      name: '索尔杰特光线',   p: 95,  cat: 'special', pp: 4, effect: null, desc: '戴拿的强力光线' },
  { id: 'us_photon_edge', name: '光子冰刃',       p: 80,  cat: 'special', pp: 6, effect: { freeze: 0.15 }, desc: '盖亚的冰属性光线' },
  { id: 'us_wide_shot',   name: '广域射线',       p: 70,  cat: 'special', pp: 8, effect: null, desc: '覆盖范围极广的光线' },
  { id: 'us_twin_shoot',  name: '赛罗双射',       p: 105, cat: 'special', pp: 3, effect: null, desc: '双眼同时发射的强力光线' },
  { id: 'us_mebium',      name: '梦比姆射线',     p: 85,  cat: 'special', pp: 5, effect: { atkUp: 1 }, desc: '梦比优斯的标志性光线' },
  { id: 'us_timer_flash', name: '计时器闪光',     p: 120, cat: 'special', pp: 2, effect: { selfDmg: 0.1 }, desc: '消耗大量能量的终极一击' },
  { id: 'us_ultra_slash', name: '奥特斩',         p: 75,  cat: 'physical', pp: 8, effect: null, desc: '手刀形态的能量斩击' },
  { id: 'us_ultra_punch', name: '奥特拳',         p: 70,  cat: 'physical', pp: 10, effect: null, desc: '蕴含光能的强力拳击' },
  { id: 'us_ultra_kick',  name: '奥特踢',         p: 75,  cat: 'physical', pp: 8, effect: null, desc: '飞身踢击' },
  { id: 'us_barrier',     name: '奥特屏障',       p: 0,   cat: 'status', pp: 5, effect: { type: 'PROTECT' }, desc: '生成光之防护罩' },
  { id: 'us_teleport',    name: '瞬间移动',       p: 0,   cat: 'status', pp: 5, effect: { type: 'BUFF', stat: 'spd', stages: 2 }, desc: '超高速移动提升速度' },
  { id: 'us_heal_light',  name: '治愈之光',       p: 0,   cat: 'status', pp: 3, effect: { type: 'HEAL', val: 0.3 }, desc: '光能恢复生命力' },
  { id: 'us_color_timer', name: '彩色计时器',     p: 0,   cat: 'status', pp: 2, effect: { type: 'BUFF', stat: 'p_atk', stages: 2 }, desc: '燃烧生命力强化攻击' },
  { id: 'us_head_dart',   name: '头镖',           p: 80,  cat: 'physical', pp: 6, effect: null, desc: '赛文的标志性武器' },
  { id: 'us_bracelet',    name: '奥特手镯',       p: 85,  cat: 'physical', pp: 5, effect: null, desc: '杰克的万能武器' },
  { id: 'us_infinite',    name: '无限形态',       p: 0,   cat: 'status', pp: 1, effect: { type: 'BUFF', stat: 'p_atk', stages: 3 }, desc: '赛罗的究极形态强化' },
  { id: 'us_mebium_burst',name: '梦比优斯爆裂',   p: 130, cat: 'special', pp: 2, effect: { selfDmg: 0.15 }, desc: '燃烧一切的终极奥义' },
  { id: 'us_galaxy',      name: '银河火花',       p: 95,  cat: 'special', pp: 4, effect: null, desc: '银河奥特曼的火花光线' },
  { id: 'us_xio_slash',   name: '艾克斯斩击',     p: 85,  cat: 'physical', pp: 5, effect: { defDown: 1 }, desc: '数据化斩击' },

  // === 怪兽技能 ===
  { id: 'ms_super_osc',   name: '超振动波',       p: 95,  cat: 'physical', pp: 4, effect: { defDown: 1 }, desc: '哥莫拉的标志性必杀' },
  { id: 'ms_rock_throw',  name: '岩石投掷',       p: 65,  cat: 'physical', pp: 10, effect: null, desc: '投掷巨大岩石' },
  { id: 'ms_thunder',     name: '雷电冲击',       p: 80,  cat: 'special', pp: 6, effect: { paralyze: 0.2 }, desc: '强力雷击' },
  { id: 'ms_fire_ball',   name: '火球',           p: 85,  cat: 'special', pp: 6, effect: { burn: 0.2 }, desc: '喷射灼热火球' },
  { id: 'ms_tail_whip',   name: '尾击',           p: 70,  cat: 'physical', pp: 10, effect: null, desc: '巨大尾巴的横扫攻击' },
  { id: 'ms_body_press',  name: '肉弹冲击',       p: 90,  cat: 'physical', pp: 5, effect: null, desc: '以巨大身躯冲撞' },
  { id: 'ms_beam_absorb', name: '能量吸收',       p: 0,   cat: 'status', pp: 4, effect: { type: 'HEAL', val: 0.25 }, desc: '吸收能量恢复体力' },
  { id: 'ms_roar',        name: '怪兽咆哮',       p: 0,   cat: 'status', pp: 5, effect: { type: 'DEBUFF', stat: 'p_atk', stages: -1 }, desc: '震慑对手降低攻击' },
  { id: 'ms_mega_claw',   name: '巨爪撕裂',       p: 85,  cat: 'physical', pp: 5, effect: null, desc: '锋利巨爪的撕裂攻击' },
  { id: 'ms_zetton_fire', name: '杰顿火球',       p: 100, cat: 'special', pp: 3, effect: { burn: 0.3 }, desc: '杰顿的终极火球' },
  { id: 'ms_zetton_wall', name: '杰顿屏障',       p: 0,   cat: 'status', pp: 3, effect: { type: 'PROTECT' }, desc: '反射一切光线的屏障' },
  { id: 'ms_tyrant_beam', name: '合体怪兽光线',   p: 110, cat: 'special', pp: 2, effect: null, desc: '泰兰特的合体能量光线' },
  { id: 'ms_five_king',   name: '超级C光线',       p: 120, cat: 'special', pp: 2, effect: { selfDmg: 0.1 }, desc: '五帝兽的终极破坏光线' },
  { id: 'ms_ground_drill',name: '地底突袭',       p: 80,  cat: 'physical', pp: 6, effect: null, desc: '从地底发起突袭' },
  { id: 'ms_mech_punch',  name: '机械拳击',       p: 75,  cat: 'physical', pp: 8, effect: null, desc: '钢铁拳头的重击' },
  { id: 'ms_hyper_beam',  name: '次元破坏光线',   p: 140, cat: 'special', pp: 1, effect: { selfDmg: 0.2 }, desc: '海帕杰顿的毁灭光线' },
  { id: 'ms_acid_spray',  name: '强酸喷射',       p: 70,  cat: 'special', pp: 8, effect: { defDown: 1 }, desc: '腐蚀性液体攻击' },
  { id: 'ms_horn_charge', name: '犄角冲锋',       p: 80,  cat: 'physical', pp: 6, effect: null, desc: '用巨角猛力冲锋' },
  { id: 'ms_magma_burst', name: '岩浆喷发',       p: 90,  cat: 'special', pp: 4, effect: { burn: 0.25 }, desc: '喷射滚烫岩浆' },

  // === 外星人技能 ===
  { id: 'as_clone',       name: '分身术',         p: 0,   cat: 'status', pp: 3, effect: { type: 'BUFF', stat: 'eva', stages: 2 }, desc: '制造分身提升回避' },
  { id: 'as_gravity',     name: '重力风暴',       p: 80,  cat: 'special', pp: 5, effect: { spdDown: 1 }, desc: '操控重力压制对手' },
  { id: 'as_dark_bolt',   name: '暗黑能量弹',     p: 85,  cat: 'special', pp: 5, effect: null, desc: '暗黑能量凝聚的弹丸' },
  { id: 'as_whip',        name: '鞭击',           p: 70,  cat: 'physical', pp: 8, effect: null, desc: '触手或鞭状武器的攻击' },
  { id: 'as_assassin',    name: '暗杀术',         p: 85,  cat: 'physical', pp: 5, effect: { critBoost: 2 }, desc: '隐匿后的致命一击' },
  { id: 'as_dim_cut',     name: '次元切割',       p: 90,  cat: 'special', pp: 4, effect: { defDown: 1 }, desc: '切割空间的能量刃' },
  { id: 'as_capsule',     name: '胶囊封印',       p: 0,   cat: 'status', pp: 2, effect: { type: 'DEBUFF', stat: 'spd', stages: -3 }, desc: '将对手封入胶囊' },
  { id: 'as_death_scythe',name: '死镰斩',         p: 105, cat: 'physical', pp: 3, effect: null, desc: '贝利亚的标志性武器攻击' },
  { id: 'as_belial_burst',name: '贝利亚爆裂',     p: 120, cat: 'special', pp: 2, effect: { selfDmg: 0.1 }, desc: '暗黑能量的终极爆发' },
  { id: 'as_dark_spark',  name: '黑暗火花',       p: 95,  cat: 'special', pp: 4, effect: null, desc: '暗黑火花的能量攻击' },
  { id: 'as_dim_move',    name: '次元移动',       p: 0,   cat: 'status', pp: 3, effect: { type: 'BUFF', stat: 'spd', stages: 2 }, desc: '穿越次元的移动术' },
  { id: 'as_dark_thunder',name: '暗黑雷击光线',   p: 130, cat: 'special', pp: 2, effect: { paralyze: 0.3 }, desc: '暗黑扎基的终极光线' },
  { id: 'as_mind_ctrl',   name: '精神控制',       p: 0,   cat: 'status', pp: 3, effect: { type: 'DEBUFF', stat: 'p_atk', stages: -2 }, desc: '操控对手精神' },
  { id: 'as_energy_drain',name: '能量掠夺',       p: 75,  cat: 'special', pp: 5, effect: { leech: 0.3 }, desc: '吸取对手能量恢复自身' },
  { id: 'as_space_beam',  name: '宇宙光线',       p: 80,  cat: 'special', pp: 6, effect: null, desc: '宇宙能量凝聚的光线' },
  { id: 'as_trap',        name: '陷阱设置',       p: 0,   cat: 'status', pp: 3, effect: { type: 'DEBUFF', stat: 'p_def', stages: -2 }, desc: '设置陷阱削弱对手防御' },
];

// ==========================================
// 变身器数据库 (100种)
// ==========================================
export const ULTRA_DB = [
  // =====================
  // 光之巨人 (35种)
  // =====================
  // --- R级 (15种) ---
  { id: 'u_jack',        name: '杰克奥特曼',     faction: 'ultra', rarity: 'R',   role: 'attacker', skills: ['us_bracelet','us_ultra_punch','us_ultra_kick'], emoji: '🔴', desc: '归来的奥特曼，使用万能的奥特手镯' },
  { id: 'u_80',          name: '爱迪奥特曼',     faction: 'ultra', rarity: 'R',   role: 'balanced', skills: ['us_wide_shot','us_ultra_slash','us_barrier'], emoji: '🔴', desc: '曾担任学校老师的温柔战士' },
  { id: 'u_chuck',       name: '乔尼亚斯奥特曼', faction: 'ultra', rarity: 'R',   role: 'attacker', skills: ['us_ultra_punch','us_ultra_kick','us_wide_shot'], emoji: '🔴', desc: 'U40出身的巨大奥特战士' },
  { id: 'u_great',       name: '葛雷奥特曼',     faction: 'ultra', rarity: 'R',   role: 'tank',     skills: ['us_wide_shot','us_barrier','us_ultra_punch'], emoji: '🔴', desc: '在澳大利亚战斗的奥特战士' },
  { id: 'u_powered',     name: '帕瓦特奥特曼',   faction: 'ultra', rarity: 'R',   role: 'attacker', skills: ['us_ultra_punch','us_ultra_kick','us_heal_light'], emoji: '🔴', desc: '在美国战斗的力量型奥特战士' },
  { id: 'u_nice',        name: '奈斯奥特曼',     faction: 'ultra', rarity: 'R',   role: 'balanced', skills: ['us_wide_shot','us_ultra_slash','us_heal_light'], emoji: '🔴', desc: '短暂登场的友善奥特战士' },
  { id: 'u_neos',        name: '奈欧斯奥特曼',   faction: 'ultra', rarity: 'R',   role: 'speed',    skills: ['us_wide_shot','us_teleport','us_ultra_kick'], emoji: '🔴', desc: '新世代防卫队的搭档奥特战士' },
  { id: 'u_seven21',     name: '赛文21',         faction: 'ultra', rarity: 'R',   role: 'sp_atk',   skills: ['us_emerium','us_barrier','us_wide_shot'], emoji: '🔴', desc: '赛文的后辈战士' },
  { id: 'u_max',         name: '麦克斯奥特曼',   faction: 'ultra', rarity: 'R',   role: 'speed',    skills: ['us_wide_shot','us_teleport','us_ultra_slash'], emoji: '🔴', desc: '拥有最强速度的奥特战士' },
  { id: 'u_xenon',       name: '杰诺奥特曼',     faction: 'ultra', rarity: 'R',   role: 'balanced', skills: ['us_wide_shot','us_ultra_punch','us_barrier'], emoji: '🔴', desc: '麦克斯的搭档战士' },
  { id: 'u_scott',       name: '史考特奥特曼',   faction: 'ultra', rarity: 'R',   role: 'attacker', skills: ['us_ultra_punch','us_ultra_kick','us_ultra_slash'], emoji: '🔴', desc: '奥特力量三勇士之一' },
  { id: 'u_chuck2',      name: '查克奥特曼',     faction: 'ultra', rarity: 'R',   role: 'attacker', skills: ['us_ultra_kick','us_ultra_punch','us_wide_shot'], emoji: '🔴', desc: '奥特力量三勇士之一' },
  { id: 'u_beth',        name: '贝斯奥特曼',     faction: 'ultra', rarity: 'R',   role: 'sp_atk',   skills: ['us_wide_shot','us_heal_light','us_barrier'], emoji: '🔴', desc: '首位女性奥特战士' },
  { id: 'u_ribut',       name: '利布特奥特曼',   faction: 'ultra', rarity: 'R',   role: 'balanced', skills: ['us_ultra_slash','us_ultra_kick','us_barrier'], emoji: '🔴', desc: '来自马来西亚的奥特战士' },
  { id: 'u_fuma',        name: '风马奥特曼',     faction: 'ultra', rarity: 'R',   role: 'speed',    skills: ['us_ultra_slash','us_teleport','us_ultra_kick'], emoji: '🔴', desc: 'O-50出身的忍者风格战士' },

  // --- SR级 (12种) ---
  { id: 'u_man',         name: '初代奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'balanced', skills: ['us_spacium','us_ultra_slash','us_barrier','us_ultra_punch'], emoji: '🌟', desc: '来自M78星云的初代光之巨人' },
  { id: 'u_seven',       name: '赛文奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'sp_atk',   skills: ['us_emerium','us_head_dart','us_wide_shot','us_barrier'], emoji: '🌟', desc: '使用头镖的智慧型战士' },
  { id: 'u_ace',         name: '艾斯奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'sp_atk',   skills: ['us_metalium','us_ultra_slash','us_barrier','us_heal_light'], emoji: '🌟', desc: '斩击技术最强的奥特兄弟' },
  { id: 'u_taro',        name: '泰罗奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'balanced', skills: ['us_storium','us_ultra_punch','us_barrier','us_color_timer'], emoji: '🌟', desc: '奥特之父与之母之子' },
  { id: 'u_leo',         name: '雷欧奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'attacker', skills: ['us_ultra_kick','us_ultra_punch','us_ultra_slash','us_teleport'], emoji: '🌟', desc: 'L77出身的格斗之王' },
  { id: 'u_dyna',        name: '戴拿奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'attacker', skills: ['us_solget','us_ultra_punch','us_ultra_kick','us_barrier'], emoji: '🌟', desc: '光的继承者，迪迦的后继' },
  { id: 'u_gaia',        name: '盖亚奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'tank',     skills: ['us_photon_edge','us_barrier','us_heal_light','us_ultra_punch'], emoji: '🌟', desc: '大地之光的化身' },
  { id: 'u_agul',        name: '阿古茹奥特曼',   faction: 'ultra', rarity: 'SR',  role: 'sp_atk',   skills: ['us_photon_edge','us_wide_shot','us_barrier','us_ultra_slash'], emoji: '🌟', desc: '海洋之光的化身' },
  { id: 'u_cosmos',      name: '高斯奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'control',  skills: ['us_wide_shot','us_heal_light','us_barrier','us_teleport'], emoji: '🌟', desc: '追求和平共存的温柔战士' },
  { id: 'u_hikari',      name: '希卡利奥特曼',   faction: 'ultra', rarity: 'SR',  role: 'sp_atk',   skills: ['us_emerium','us_ultra_slash','us_barrier','us_color_timer'], emoji: '🌟', desc: '蓝族的骑士型奥特战士' },
  { id: 'u_ginga',       name: '银河奥特曼',     faction: 'ultra', rarity: 'SR',  role: 'balanced', skills: ['us_galaxy','us_ultra_slash','us_barrier','us_heal_light'], emoji: '🌟', desc: '持有银河火花的神秘战士' },
  { id: 'u_x',           name: '艾克斯奥特曼',   faction: 'ultra', rarity: 'SR',  role: 'attacker', skills: ['us_xio_slash','us_wide_shot','us_barrier','us_ultra_punch'], emoji: '🌟', desc: '能数据化融合的电子战士' },

  // --- SSR级 (8种) ---
  { id: 'u_tiga',        name: '迪迦奥特曼',     faction: 'ultra', rarity: 'SSR', role: 'ultimate', skills: ['us_zepellion','us_ultra_slash','us_barrier','us_heal_light','us_timer_flash'], emoji: '💎', desc: '超古代之光，三千万年前的巨人' },
  { id: 'u_zero',        name: '赛罗奥特曼',     faction: 'ultra', rarity: 'SSR', role: 'speed',    skills: ['us_twin_shoot','us_ultra_slash','us_infinite','us_teleport','us_ultra_kick'], emoji: '💎', desc: '赛文之子，新生代最强战士' },
  { id: 'u_mebius',      name: '梦比优斯奥特曼', faction: 'ultra', rarity: 'SSR', role: 'balanced', skills: ['us_mebium','us_mebium_burst','us_ultra_punch','us_barrier','us_color_timer'], emoji: '💎', desc: '继承六兄弟之力的年轻战士' },
  { id: 'u_nexus',       name: '奈克瑟斯奥特曼', faction: 'ultra', rarity: 'SSR', role: 'sp_atk',   skills: ['us_timer_flash','us_barrier','us_heal_light','us_ultra_slash','us_wide_shot'], emoji: '💎', desc: '传递希望之光的神秘奥特曼' },
  { id: 'u_noa',         name: '诺亚奥特曼',     faction: 'ultra', rarity: 'SSR', role: 'ultimate', skills: ['us_timer_flash','us_teleport','us_barrier','us_heal_light','us_ultra_slash'], emoji: '💎', desc: '传说中的最古之光' },
  { id: 'u_king',        name: '奥特之王',       faction: 'ultra', rarity: 'SSR', role: 'ultimate', skills: ['us_timer_flash','us_heal_light','us_barrier','us_spacium','us_color_timer'], emoji: '💎', desc: 'M78星云最强的传说存在' },
  { id: 'u_legend',      name: '传说奥特曼',     faction: 'ultra', rarity: 'SSR', role: 'ultimate', skills: ['us_timer_flash','us_heal_light','us_barrier','us_wide_shot','us_teleport'], emoji: '💎', desc: '高斯与杰斯提斯合体的究极战士' },
  { id: 'u_saga',        name: '赛迦奥特曼',     faction: 'ultra', rarity: 'SSR', role: 'ultimate', skills: ['us_timer_flash','us_twin_shoot','us_ultra_slash','us_barrier','us_teleport'], emoji: '💎', desc: '迪迦·戴拿·盖亚三位一体的合体战士' },

  // =====================
  // 怪兽 (35种)
  // =====================
  // --- R级 (15种) ---
  { id: 'm_ragon',       name: '拉贡',           faction: 'kaiju', rarity: 'R',   role: 'tank',     skills: ['ms_tail_whip','ms_body_press','ms_roar'], emoji: '🦎', desc: '远古海底怪兽' },
  { id: 'm_neronga',     name: '奈隆加',         faction: 'kaiju', rarity: 'R',   role: 'sp_atk',   skills: ['ms_thunder','ms_tail_whip','ms_roar'], emoji: '🦎', desc: '能隐身的透明怪兽' },
  { id: 'm_gabora',      name: '加波拉',         faction: 'kaiju', rarity: 'R',   role: 'tank',     skills: ['ms_body_press','ms_tail_whip','ms_acid_spray'], emoji: '🦎', desc: '吞食铀矿的放射怪兽' },
  { id: 'm_telesdon',    name: '特莱斯顿',       faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_fire_ball','ms_ground_drill','ms_tail_whip'], emoji: '🦎', desc: '地底怪兽' },
  { id: 'm_gudon',       name: '古顿',           faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_mega_claw','ms_tail_whip','ms_body_press'], emoji: '🦎', desc: '鞭状手臂的古代怪兽' },
  { id: 'm_twin_tail',   name: '双尾怪',         faction: 'kaiju', rarity: 'R',   role: 'balanced', skills: ['ms_tail_whip','ms_body_press','ms_roar'], emoji: '🦎', desc: '古顿的天敌怪兽' },
  { id: 'm_bemstar',     name: '贝蒙斯坦',       faction: 'kaiju', rarity: 'R',   role: 'tank',     skills: ['ms_beam_absorb','ms_body_press','ms_horn_charge'], emoji: '🦎', desc: '腹部能吸收一切的宇宙大怪兽' },
  { id: 'm_birdon',      name: '巴顿',           faction: 'kaiju', rarity: 'R',   role: 'speed',    skills: ['ms_mega_claw','ms_fire_ball','ms_tail_whip'], emoji: '🦎', desc: '拥有剧毒嘴喙的超兽' },
  { id: 'm_muruchi',     name: '姆鲁奇',         faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_tail_whip','ms_body_press','ms_acid_spray'], emoji: '🦎', desc: '海栖的凶暴怪兽' },
  { id: 'm_eleking',     name: '艾雷王',         faction: 'kaiju', rarity: 'R',   role: 'speed',    skills: ['ms_thunder','ms_tail_whip','ms_roar'], emoji: '🦎', desc: '操控电击的怪兽' },
  { id: 'm_pandon',      name: '潘顿',           faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_fire_ball','ms_mega_claw','ms_body_press'], emoji: '🦎', desc: '两头怪兽' },
  { id: 'm_arstron',     name: '阿斯特隆',       faction: 'kaiju', rarity: 'R',   role: 'tank',     skills: ['ms_horn_charge','ms_magma_burst','ms_body_press'], emoji: '🦎', desc: '火山地带的凶暴怪兽' },
  { id: 'm_sadola',      name: '萨德拉',         faction: 'kaiju', rarity: 'R',   role: 'balanced', skills: ['ms_mega_claw','ms_tail_whip','ms_acid_spray'], emoji: '🦎', desc: '岩石地带的地底怪兽' },
  { id: 'm_demaaga',     name: '德玛加',         faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_fire_ball','ms_body_press','ms_roar'], emoji: '🦎', desc: '新世代的代表性怪兽' },
  { id: 'm_skull_gom',   name: '骷髅哥莫拉',     faction: 'kaiju', rarity: 'R',   role: 'attacker', skills: ['ms_super_osc','ms_body_press','ms_tail_whip'], emoji: '🦎', desc: '哥莫拉的暴走形态' },

  // --- SR级 (12种) ---
  { id: 'm_gomora',      name: '哥莫拉',         faction: 'kaiju', rarity: 'SR',  role: 'attacker', skills: ['ms_super_osc','ms_horn_charge','ms_tail_whip','ms_body_press'], emoji: '🔶', desc: '古代怪兽之王' },
  { id: 'm_red_king',    name: '雷德王',         faction: 'kaiju', rarity: 'SR',  role: 'tank',     skills: ['ms_rock_throw','ms_body_press','ms_roar','ms_tail_whip'], emoji: '🔶', desc: '称霸多多良岛的怪兽之王' },
  { id: 'm_king_joe',    name: '金古桥',         faction: 'kaiju', rarity: 'SR',  role: 'tank',     skills: ['ms_mech_punch','ms_beam_absorb','ms_body_press','ms_roar'], emoji: '🔶', desc: '佩丹星人的超级机器人' },
  { id: 'm_zetton',      name: '杰顿',           faction: 'kaiju', rarity: 'SR',  role: 'sp_atk',   skills: ['ms_zetton_fire','ms_zetton_wall','ms_body_press','ms_tail_whip'], emoji: '🔶', desc: '击败初代的宇宙恐龙' },
  { id: 'm_dada',        name: '达达',           faction: 'kaiju', rarity: 'SR',  role: 'control',  skills: ['ms_beam_absorb','ms_roar','ms_acid_spray','ms_thunder'], emoji: '🔶', desc: '三面怪人' },
  { id: 'm_goldras',     name: '哥尔德拉斯',     faction: 'kaiju', rarity: 'SR',  role: 'balanced', skills: ['ms_thunder','ms_fire_ball','ms_tail_whip','ms_roar'], emoji: '🔶', desc: '超力怪兽' },
  { id: 'm_gan_q',       name: '甘Q',             faction: 'kaiju', rarity: 'SR',  role: 'control',  skills: ['ms_beam_absorb','ms_acid_spray','ms_roar','ms_body_press'], emoji: '🔶', desc: '大眼球怪兽' },
  { id: 'm_vakishim',    name: '巴基西姆',       faction: 'kaiju', rarity: 'SR',  role: 'sp_atk',   skills: ['ms_fire_ball','ms_mega_claw','ms_body_press','ms_roar'], emoji: '🔶', desc: '来自亚波人的超兽' },
  { id: 'm_antlar',      name: '安特拉',         faction: 'kaiju', rarity: 'SR',  role: 'control',  skills: ['ms_ground_drill','ms_mega_claw','ms_roar','ms_body_press'], emoji: '🔶', desc: '操控磁力的沙漠怪兽' },
  { id: 'm_golza',       name: '哥尔赞',         faction: 'kaiju', rarity: 'SR',  role: 'tank',     skills: ['ms_fire_ball','ms_body_press','ms_horn_charge','ms_roar'], emoji: '🔶', desc: '超古代怪兽' },
  { id: 'm_melba',       name: '美尔巴',         faction: 'kaiju', rarity: 'SR',  role: 'speed',    skills: ['ms_fire_ball','ms_mega_claw','ms_tail_whip','ms_body_press'], emoji: '🔶', desc: '与哥尔赞搭档的飞行超古代怪兽' },
  { id: 'm_guvila',      name: '古维拉',         faction: 'kaiju', rarity: 'SR',  role: 'attacker', skills: ['ms_ground_drill','ms_horn_charge','ms_body_press','ms_tail_whip'], emoji: '🔶', desc: '地底的钻头怪兽' },

  // --- SSR级 (8种) ---
  { id: 'm_tyrant',      name: '泰兰特',         faction: 'kaiju', rarity: 'SSR', role: 'attacker', skills: ['ms_tyrant_beam','ms_mega_claw','ms_fire_ball','ms_body_press','ms_horn_charge'], emoji: '👑', desc: '合体怪兽暴君' },
  { id: 'm_five_king',   name: '五帝兽',         faction: 'kaiju', rarity: 'SSR', role: 'ultimate', skills: ['ms_five_king','ms_zetton_fire','ms_super_osc','ms_mega_claw','ms_zetton_wall'], emoji: '👑', desc: '五大怪兽合体的究极怪兽' },
  { id: 'm_hyper_zet',   name: '海帕杰顿',       faction: 'kaiju', rarity: 'SSR', role: 'ultimate', skills: ['ms_hyper_beam','ms_zetton_fire','ms_zetton_wall','ms_body_press','ms_roar'], emoji: '👑', desc: '杰顿的究极进化形态' },
  { id: 'm_arch_belial', name: '拱门贝利亚',     faction: 'kaiju', rarity: 'SSR', role: 'ultimate', skills: ['ms_hyper_beam','ms_fire_ball','ms_body_press','ms_roar','ms_beam_absorb'], emoji: '👑', desc: '吸收大量能量的巨大化贝利亚' },
  { id: 'm_greeza',      name: '格里扎',         faction: 'kaiju', rarity: 'SSR', role: 'sp_atk',   skills: ['ms_hyper_beam','ms_acid_spray','ms_roar','ms_beam_absorb','ms_fire_ball'], emoji: '👑', desc: '虚空怪兽，不存在的存在' },
  { id: 'm_magata',      name: '玛伽大蛇',       faction: 'kaiju', rarity: 'SSR', role: 'tank',     skills: ['ms_magma_burst','ms_body_press','ms_roar','ms_beam_absorb','ms_horn_charge'], emoji: '👑', desc: '魔王兽之首' },
  { id: 'm_grimdo',      name: '格里姆德',       faction: 'kaiju', rarity: 'SSR', role: 'ultimate', skills: ['ms_hyper_beam','ms_fire_ball','ms_beam_absorb','ms_roar','ms_body_press'], emoji: '👑', desc: '封印罗索布鲁的邪神怪兽' },
  { id: 'm_giga_finalizer', name: '终极合体兽',  faction: 'kaiju', rarity: 'SSR', role: 'ultimate', skills: ['ms_five_king','ms_hyper_beam','ms_zetton_fire','ms_beam_absorb','ms_roar'], emoji: '👑', desc: '最终决战兵器级怪兽' },

  // =====================
  // 外星人 (30种)
  // =====================
  // --- R级 (12种) ---
  { id: 'a_reBrando',    name: '雷布朗星人',     faction: 'alien', rarity: 'R',   role: 'attacker', skills: ['as_whip','as_space_beam','as_trap'], emoji: '👽', desc: '操控电磁鞭的宇宙人' },
  { id: 'a_nackle',      name: '纳克尔星人',     faction: 'alien', rarity: 'R',   role: 'balanced', skills: ['as_assassin','as_dark_bolt','as_whip'], emoji: '👽', desc: '狡猾的策略型宇宙人' },
  { id: 'a_guts',        name: '古茨星人',       faction: 'alien', rarity: 'R',   role: 'attacker', skills: ['as_whip','as_dark_bolt','as_space_beam'], emoji: '👽', desc: '以残暴闻名的宇宙人' },
  { id: 'a_pitt',        name: '皮特星人',       faction: 'alien', rarity: 'R',   role: 'control',  skills: ['as_mind_ctrl','as_space_beam','as_trap'], emoji: '👽', desc: '擅长变身术的宇宙人' },
  { id: 'a_shaplay',     name: '夏普雷星人',     faction: 'alien', rarity: 'R',   role: 'control',  skills: ['as_mind_ctrl','as_clone','as_space_beam'], emoji: '👽', desc: '卑鄙的宇宙间谍' },
  { id: 'a_magma',       name: '玛格玛星人',     faction: 'alien', rarity: 'R',   role: 'sp_atk',   skills: ['as_dark_bolt','as_space_beam','as_trap'], emoji: '👽', desc: '火山般暴烈的宇宙人' },
  { id: 'a_chibull',     name: '奇布尔星人',     faction: 'alien', rarity: 'R',   role: 'control',  skills: ['as_mind_ctrl','as_trap','as_space_beam'], emoji: '👽', desc: '制造机器人的科学宇宙人' },
  { id: 'a_sturm',       name: '斯特尔星人',     faction: 'alien', rarity: 'R',   role: 'sp_atk',   skills: ['as_dark_bolt','as_dim_move','as_space_beam'], emoji: '👽', desc: '暗中操纵的阴谋家' },
  { id: 'a_pedan',       name: '佩丹星人',       faction: 'alien', rarity: 'R',   role: 'balanced', skills: ['as_space_beam','as_dark_bolt','as_trap'], emoji: '👽', desc: '金古桥的制造者' },
  { id: 'a_godola',      name: '戈德拉星人',     faction: 'alien', rarity: 'R',   role: 'attacker', skills: ['as_whip','as_assassin','as_space_beam'], emoji: '👽', desc: '残忍的宇宙猎手' },
  { id: 'a_kemur',       name: '凯姆尔人',       faction: 'alien', rarity: 'R',   role: 'speed',    skills: ['as_dim_move','as_clone','as_energy_drain'], emoji: '👽', desc: '来自未来的怪异宇宙人' },
  { id: 'a_dada',        name: '达达星人',       faction: 'alien', rarity: 'R',   role: 'control',  skills: ['as_mind_ctrl','as_clone','as_trap'], emoji: '👽', desc: '拥有三张面孔的宇宙人' },

  // --- SR级 (11种) ---
  { id: 'a_baltan',      name: '巴尔坦星人',     faction: 'alien', rarity: 'SR',  role: 'control',  skills: ['as_clone','as_gravity','as_space_beam','as_mind_ctrl'], emoji: '🛸', desc: '最著名的宇宙侵略者' },
  { id: 'a_mefilas',     name: '美菲拉斯星人',   faction: 'alien', rarity: 'SR',  role: 'sp_atk',   skills: ['as_dark_bolt','as_mind_ctrl','as_gravity','as_clone'], emoji: '🛸', desc: '自称宇宙第一的策略家' },
  { id: 'a_hipporit',    name: '希波利特星人',   faction: 'alien', rarity: 'SR',  role: 'control',  skills: ['as_capsule','as_dark_bolt','as_trap','as_mind_ctrl'], emoji: '🛸', desc: '使用胶囊封印的宇宙人' },
  { id: 'a_yapool',      name: '亚波人',         faction: 'alien', rarity: 'SR',  role: 'sp_atk',   skills: ['as_dim_cut','as_dark_bolt','as_dim_move','as_trap'], emoji: '🛸', desc: '异次元的邪恶存在' },
  { id: 'a_temperor',    name: '坦佩拉星人',     faction: 'alien', rarity: 'SR',  role: 'balanced', skills: ['as_dark_bolt','as_whip','as_clone','as_space_beam'], emoji: '🛸', desc: '极端星际盟约的领袖' },
  { id: 'a_villain',     name: '维兰星人',       faction: 'alien', rarity: 'SR',  role: 'sp_atk',   skills: ['as_dark_bolt','as_gravity','as_space_beam','as_trap'], emoji: '🛸', desc: '策划侵略的智慧型宇宙人' },
  { id: 'a_empera',      name: '安培拉星人',     faction: 'alien', rarity: 'SR',  role: 'tank',     skills: ['as_dark_bolt','as_gravity','as_dark_spark','as_mind_ctrl'], emoji: '🛸', desc: '暗黑宇宙大皇帝' },
  { id: 'a_bat',         name: '巴特星人',       faction: 'alien', rarity: 'SR',  role: 'control',  skills: ['as_mind_ctrl','as_clone','as_trap','as_dark_bolt'], emoji: '🛸', desc: '操控怪兽的宇宙人' },
  { id: 'a_shadow',      name: '夏德星人',       faction: 'alien', rarity: 'SR',  role: 'speed',    skills: ['as_assassin','as_dim_move','as_clone','as_dark_bolt'], emoji: '🛸', desc: '暗影中的刺客' },
  { id: 'a_juda',        name: '朱达',           faction: 'alien', rarity: 'SR',  role: 'sp_atk',   skills: ['as_dark_bolt','as_dim_cut','as_gravity','as_dark_spark'], emoji: '🛸', desc: '与格兰并称的宇宙恶魔' },
  { id: 'a_gina',        name: '吉娜',           faction: 'alien', rarity: 'SR',  role: 'attacker', skills: ['as_whip','as_dark_bolt','as_clone','as_space_beam'], emoji: '🛸', desc: '贝利亚的女儿' },

  // --- SSR级 (7种) ---
  { id: 'a_belial',      name: '贝利亚',         faction: 'alien', rarity: 'SSR', role: 'ultimate', skills: ['as_death_scythe','as_belial_burst','as_dark_spark','as_gravity','as_clone'], emoji: '🌑', desc: '堕入黑暗的叛逆奥特战士' },
  { id: 'a_tregear',     name: '托雷基亚',       faction: 'alien', rarity: 'SSR', role: 'sp_atk',   skills: ['as_dark_spark','as_belial_burst','as_dim_cut','as_mind_ctrl','as_clone'], emoji: '🌑', desc: '堕入黑暗的前光之国战士' },
  { id: 'a_dark_zagi',   name: '黑暗扎基',       faction: 'alien', rarity: 'SSR', role: 'ultimate', skills: ['as_dark_thunder','as_dark_spark','as_gravity','as_clone','as_dim_cut'], emoji: '🌑', desc: '诺亚的黑暗模仿体' },
  { id: 'a_ultra_dark',  name: '暗黑欧布',       faction: 'alien', rarity: 'SSR', role: 'attacker', skills: ['as_dark_spark','as_death_scythe','as_dim_cut','as_gravity','as_clone'], emoji: '🌑', desc: '欧布的暗黑形态' },
  { id: 'a_carmeara',    name: '卡尔蜜拉',       faction: 'alien', rarity: 'SSR', role: 'control',  skills: ['as_dark_spark','as_mind_ctrl','as_capsule','as_dim_cut','as_clone'], emoji: '🌑', desc: '超古代暗黑巨人' },
  { id: 'a_absolute',    name: '绝对灭亡·塔尔塔罗斯', faction: 'alien', rarity: 'SSR', role: 'ultimate', skills: ['as_dark_thunder','as_belial_burst','as_dim_cut','as_gravity','as_capsule'], emoji: '🌑', desc: '绝对之力的持有者' },
  { id: 'a_dark_lugiel', name: '黑暗路基艾尔',   faction: 'alien', rarity: 'SSR', role: 'sp_atk',   skills: ['as_dark_spark','as_dark_thunder','as_mind_ctrl','as_gravity','as_clone'], emoji: '🌑', desc: '将一切化为火花人偶的黑暗之主' },
];

// ==========================================
// 生成变身器实例 (随机属性)
// ==========================================
export const generateTransformer = (templateId) => {
  const template = ULTRA_DB.find(u => u.id === templateId);
  if (!template) return null;

  const rarityConf = ULTRA_RARITY[template.rarity];
  const [minStat, maxStat] = rarityConf.statRange;
  const randStat = () => Math.floor(minStat + Math.random() * (maxStat - minStat + 1));

  const roleBonus = {
    balanced:  { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 },
    attacker:  { hp: -5, atk: 20, def: -5, spAtk: -5, spDef: -5, spd: 5 },
    sp_atk:    { hp: -5, atk: -5, def: -5, spAtk: 20, spDef: 5, spd: -5 },
    tank:      { hp: 20, atk: -5, def: 15, spAtk: -5, spDef: 10, spd: -15 },
    speed:     { hp: -5, atk: 5, def: -10, spAtk: -5, spDef: -10, spd: 25 },
    control:   { hp: 0, atk: -10, def: 5, spAtk: 10, spDef: 5, spd: 0 },
    ultimate:  { hp: 10, atk: 10, def: 5, spAtk: 10, spDef: 5, spd: 5 },
  };
  const bonus = roleBonus[template.role] || roleBonus.balanced;

  return {
    uid: `tf_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    templateId: template.id,
    name: template.name,
    faction: template.faction,
    rarity: template.rarity,
    role: template.role,
    level: 1,
    exp: 0,
    stats: {
      hp:    Math.max(30, randStat() + bonus.hp),
      atk:   Math.max(10, randStat() + bonus.atk),
      def:   Math.max(10, randStat() + bonus.def),
      spAtk: Math.max(10, randStat() + bonus.spAtk),
      spDef: Math.max(10, randStat() + bonus.spDef),
      spd:   Math.max(10, randStat() + bonus.spd),
    },
    skills: template.skills.slice(0, rarityConf.skillCount),
    emoji: template.emoji,
    desc: template.desc,
  };
};

// 变身器升级
export const getTransformerUpgradeCost = (level) => level * 2000;
export const TRANSFORMER_MAX_LEVEL = 10;
export const upgradeTransformer = (transformer) => {
  if (transformer.level >= TRANSFORMER_MAX_LEVEL) return transformer;
  const mult = 1 + transformer.level * 0.03;
  return {
    ...transformer,
    level: transformer.level + 1,
    exp: 0,
    stats: {
      hp:    Math.floor(transformer.stats.hp * mult),
      atk:   Math.floor(transformer.stats.atk * mult),
      def:   Math.floor(transformer.stats.def * mult),
      spAtk: Math.floor(transformer.stats.spAtk * mult),
      spDef: Math.floor(transformer.stats.spDef * mult),
      spd:   Math.floor(transformer.stats.spd * mult),
    }
  };
};

// 获取技能数据
export const getUltraSkill = (skillId) => ULTRA_SKILLS.find(s => s.id === skillId) || null;

// 获取模板数据
export const getUltraTemplate = (templateId) => ULTRA_DB.find(u => u.id === templateId) || null;

// 随机抽取变身器
export const rollTransformer = () => {
  const roll = Math.random();
  let pool;
  if (roll < 0.05) pool = ULTRA_DB.filter(u => u.rarity === 'SSR');
  else if (roll < 0.30) pool = ULTRA_DB.filter(u => u.rarity === 'SR');
  else pool = ULTRA_DB.filter(u => u.rarity === 'R');

  const template = pool[Math.floor(Math.random() * pool.length)];
  return generateTransformer(template.id);
};

// 默认状态
export const DEFAULT_ULTRA_STATE = {
  transformers: [],
  equippedId: null,
  collection: [],
  ultraBattleWins: 0,
  ultraBattleLosses: 0,
  perfectWins: 0,
};

// 变身器战斗状态初始化
export const initUltraCombatState = (transformer) => {
  if (!transformer) return null;
  const template = getUltraTemplate(transformer.templateId);
  const levelMult = 1 + (transformer.level - 1) * 0.05;
  const maxHp = Math.floor(transformer.stats.hp * 3 * levelMult);

  return {
    ...transformer,
    currentHp: maxHp,
    maxHp,
    combatStats: {
      atk:   Math.floor(transformer.stats.atk * levelMult),
      def:   Math.floor(transformer.stats.def * levelMult),
      spAtk: Math.floor(transformer.stats.spAtk * levelMult),
      spDef: Math.floor(transformer.stats.spDef * levelMult),
      spd:   Math.floor(transformer.stats.spd * levelMult),
    },
    combatSkills: transformer.skills.map(sid => {
      const sk = getUltraSkill(sid);
      return sk ? { ...sk, currentPp: sk.pp } : null;
    }).filter(Boolean),
    stages: { atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0, acc: 0, eva: 0 },
    status: null,
    isProtected: false,
  };
};

// 随机生成敌方变身器 (根据玩家等级)
export const generateEnemyTransformer = (playerLevel) => {
  let rarity = 'R';
  if (playerLevel >= 60) rarity = Math.random() < 0.3 ? 'SSR' : 'SR';
  else if (playerLevel >= 30) rarity = Math.random() < 0.4 ? 'SR' : 'R';

  const pool = ULTRA_DB.filter(u => u.rarity === rarity);
  const template = pool[Math.floor(Math.random() * pool.length)];
  const tf = generateTransformer(template.id);

  const tfLevel = Math.min(TRANSFORMER_MAX_LEVEL, Math.max(1, Math.floor(playerLevel / 10)));
  tf.level = tfLevel;
  const mult = 1 + (tfLevel - 1) * 0.03;
  tf.stats = {
    hp:    Math.floor(tf.stats.hp * mult),
    atk:   Math.floor(tf.stats.atk * mult),
    def:   Math.floor(tf.stats.def * mult),
    spAtk: Math.floor(tf.stats.spAtk * mult),
    spDef: Math.floor(tf.stats.spDef * mult),
    spd:   Math.floor(tf.stats.spd * mult),
  };

  return tf;
};
