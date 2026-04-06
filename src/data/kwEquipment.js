/**
 * 国战活动可获得的三国主题饰品/装备 (40)
 * 与 ACCESSORY_DB 条目格式兼容；HYBRID 锻造时随机附加技能。
 */
export const KW_EQUIPMENT = [
  // ========== Tier 2 (15) — val 非HP: 20–30；HP ≈ 4× ==========
  { id: 'kw_t2_yanyue', name: '青龙偃月刀', type: 'ATK', val: 28, icon: '🔪', price: 12800, tier: 2, desc: '攻击力+28（关羽名刀）' },
  { id: 'kw_t2_shemao', name: '丈八蛇矛', type: 'ATK', val: 26, icon: '🐍', price: 12200, tier: 2, desc: '攻击力+26（张飞长矛）' },
  { id: 'kw_t2_shuanggu', name: '雌雄双股剑', type: 'HYBRID', stat: 'ATK', val: 25, icon: '⚔️', price: 13500, tier: 2, desc: '刘备佩剑 (攻+25)，锻造时随机附加技能' },
  { id: 'kw_t2_liannu', name: '诸葛连弩', type: 'SATK', val: 24, icon: '🔩', price: 11800, tier: 2, desc: '特攻+24（元戎弩）' },
  { id: 'kw_t2_tengjia', name: '南蛮藤甲', type: 'DEF', val: 27, icon: '🪵', price: 13200, tier: 2, desc: '防御力+27（藤甲兵）' },
  { id: 'kw_t2_huanggaibian', name: '黄盖铁鞭', type: 'HYBRID', stat: 'DEF', val: 26, icon: '⛓️', price: 13000, tier: 2, desc: '苦肉计铁鞭 (防+26)，锻造时随机附加技能' },
  { id: 'kw_t2_yushan', name: '诸葛羽扇', type: 'SATK', val: 22, icon: '🪶', price: 14500, tier: 2, desc: '特攻+22，每回合恢复3%HP', effect: { id: 'heal_turn', val: 0.03 } },
  { id: 'kw_t2_chitu', name: '赤兔缰绳', type: 'SPD', val: 25, icon: '🐎', price: 13800, tier: 2, desc: '速度+25，额外速度+12', effect: { id: 'bonus_spd', val: 12 } },
  { id: 'kw_t2_qinggang', name: '青釭剑', type: 'ATK', val: 25, icon: '🗡️', price: 12500, tier: 2, desc: '攻击力+25（夏侯恩佩剑）' },
  { id: 'kw_t2_hufu', name: '虎符', type: 'CRIT', val: 8, icon: '🐯', price: 12000, tier: 2, desc: '暴击率+8%' },
  { id: 'kw_t2_mengde', name: '孟德新书', type: 'SDEF', val: 26, icon: '📜', price: 11600, tier: 2, desc: '特防+26（兵书残卷）' },
  { id: 'kw_t2_nanman', name: '蛮王盾', type: 'DEF', val: 24, icon: '🪨', price: 14200, tier: 2, desc: '防御力+24，反弹7%受到伤害', effect: { id: 'reflect', val: 0.07 } },
  { id: 'kw_t2_baima', name: '白马义从饰', type: 'SPD', val: 22, icon: '🦅', price: 11400, tier: 2, desc: '速度+22（公孙瓒部曲）' },
  { id: 'kw_t2_hebei', name: '河北重铠', type: 'HP', val: 100, icon: '🧥', price: 12400, tier: 2, desc: '最大HP+100（袁绍军甲）' },
  { id: 'kw_t2_yuxi', name: '传国玺印', type: 'SATK', val: 21, icon: '🪙', price: 15200, tier: 2, desc: '特攻+21，6%概率先手', effect: { id: 'priority', val: 0.06 } },

  // ========== Tier 3 (15) — val 非HP: 30–50；HP ≈ 4× ==========
  { id: 'kw_t3_fangtian', name: '方天画戟', type: 'ATK', val: 42, icon: '🔱', price: 24800, tier: 3, desc: '攻击力+42（吕布戟）' },
  { id: 'kw_t3_longdan', name: '龙胆亮银枪', type: 'ATK', val: 40, icon: '✨', price: 24200, tier: 3, desc: '攻击力+40（赵云枪）' },
  { id: 'kw_t3_rende', name: '仁德双剑', type: 'HYBRID', stat: 'ATK', val: 38, icon: '💠', price: 26500, tier: 3, desc: '刘备仁德剑 (攻+38)，锻造时随机附加技能' },
  { id: 'kw_t3_qilin', name: '麒麟弓', type: 'SATK', val: 36, icon: '🎯', price: 23500, tier: 3, desc: '特攻+36（黄忠神射）' },
  { id: 'kw_t3_huanshou', name: '环首刀', type: 'ATK', val: 35, icon: '🪓', price: 22800, tier: 3, desc: '攻击力+35（汉军制式）' },
  { id: 'kw_t3_bagua', name: '八卦阵图', type: 'SDEF', val: 42, icon: '☯️', price: 27200, tier: 3, desc: '特防+42，8%闪避攻击', effect: { id: 'dodge', val: 0.08 } },
  { id: 'kw_t3_hesbi', name: '和氏璧佩', type: 'HP', val: 160, icon: '💎', price: 28800, tier: 3, desc: '最大HP+160，每回合恢复4%HP', effect: { id: 'heal_turn', val: 0.04 } },
  { id: 'kw_t3_tongque', name: '铜雀铃', type: 'SATK', val: 40, icon: '🔔', price: 25800, tier: 3, desc: '特攻+40，火系伤害+15%', effect: { id: 'type_boost', moveType: 'FIRE', val: 0.15 } },
  { id: 'kw_t3_weiwu', name: '魏武头盔', type: 'DEF', val: 44, icon: '⛑️', price: 25200, tier: 3, desc: '防御力+44（曹操亲军）' },
  { id: 'kw_t3_zhugejin', name: '诸葛巾', type: 'SDEF', val: 40, icon: '🧢', price: 23800, tier: 3, desc: '特防+40' },
  { id: 'kw_t3_wugou', name: '吴钩', type: 'ATK', val: 36, icon: '🌊', price: 26200, tier: 3, desc: '攻击力+36，攻击吸血9%', effect: { id: 'lifesteal', val: 0.09 } },
  { id: 'kw_t3_yuanmen', name: '辕门弓', type: 'HYBRID', stat: 'SATK', val: 38, icon: '🏹', price: 27000, tier: 3, desc: '吕布辕门射戟 (特攻+38)，锻造时随机附加技能' },
  { id: 'kw_t3_xiliang', name: '西凉铠', type: 'DEF', val: 38, icon: '🔥', price: 26800, tier: 3, desc: '防御力+38，免疫灼伤', effect: { id: 'status_immune', val: 'BRN' } },
  { id: 'kw_t3_huxin', name: '亮银护心镜', type: 'HP', val: 180, icon: '🪞', price: 30500, tier: 3, desc: '最大HP+180，致命一击时以1HP存活(每场1次)', effect: { id: 'endure', val: 1 } },
  { id: 'kw_t3_taishi', name: '太史慈短戟', type: 'HYBRID', stat: 'ATK', val: 34, icon: '🦂', price: 24000, tier: 3, desc: '子义短戟 (攻+34)，锻造时随机附加技能' },

  // ========== Tier 4 (10) — val 非HP: 50–80；HP ≈ 4× ==========
  { id: 'kw_t4_cixiong', name: '雌雄剑·真', type: 'HYBRID', stat: 'ATK', val: 62, icon: '💍', price: 48500, tier: 4, desc: '昭烈帝剑 (攻+62)，锻造时随机附加技能' },
  { id: 'kw_t4_zhouyu', name: '周瑜碧水剑', type: 'HYBRID', stat: 'SATK', val: 65, icon: '💧', price: 49800, tier: 4, desc: '赤壁都督佩剑 (特攻+65)，锻造时随机附加技能' },
  { id: 'kw_t4_tiesuo', name: '铁索连环', type: 'DEF', val: 62, icon: '⛓️‍💥', price: 47200, tier: 4, desc: '防御力+62，反弹12%受到伤害', effect: { id: 'reflect', val: 0.12 } },
  { id: 'kw_t4_mian', name: '帝王冕', type: 'SATK', val: 70, icon: '👑', price: 51000, tier: 4, desc: '特攻+70' },
  { id: 'kw_t4_qijin', name: '七进护符', type: 'HP', val: 280, icon: '🛡️', price: 52500, tier: 4, desc: '最大HP+280，12%闪避攻击', effect: { id: 'dodge', val: 0.12 } },
  { id: 'kw_t4_kongming', name: '孔明灯', type: 'SATK', val: 58, icon: '🏮', price: 48800, tier: 4, desc: '特攻+58，光系伤害+18%', effect: { id: 'type_boost', moveType: 'LIGHT', val: 0.18 } },
  { id: 'kw_t4_yushan', name: '羽扇纶巾', type: 'SDEF', val: 68, icon: '🪭', price: 50200, tier: 4, desc: '特防+68，暴击伤害+30%', effect: { id: 'crit_dmg', val: 0.30 } },
  { id: 'kw_t4_pangtong', name: '庞统锦囊', type: 'HYBRID', stat: 'SATK', val: 56, icon: '🎋', price: 47800, tier: 4, desc: '凤雏策囊 (特攻+56)，锻造时随机附加技能' },
  { id: 'kw_t4_dianwei', name: '典韦双戟', type: 'ATK', val: 70, icon: '🪝', price: 51500, tier: 4, desc: '攻击力+70，无视12%防御', effect: { id: 'ignore_def', val: 0.12 } },
  { id: 'kw_t4_yangyouji', name: '养由基弓', type: 'CRIT', val: 18, icon: '🎐', price: 53200, tier: 4, desc: '暴击率+18%（养由基百步穿杨）' },
];
