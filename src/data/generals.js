/**
 * Three Kingdoms (三国) generals — recruitment & encounter data for faction-themed RPG.
 * Factions: wei (魏), shu (蜀), wu (吴), neutral (独立/群雄).
 */

const FACTIONS = ['wei', 'shu', 'wu', 'neutral'];

/** @typedef {'wei'|'shu'|'wu'|'neutral'} GeneralFaction */
/** @typedef {'SSR'|'SR'|'R'} GeneralRarity */

/**
 * GeneralBonus — only affects rewards & nation, NOT combat stats.
 * @typedef {Object} GeneralBonus
 * @property {number} gold      - 战斗金币奖励 %
 * @property {number} exp       - 战斗经验奖励 %
 * @property {number} contrib   - 国战贡献加成 %
 * @property {number} territory - 领地防御加成
 * @property {number} trade     - 商队收入加成 %
 * @property {number} recruit   - 招募费用减免 %
 */

/**
 * @typedef {Object} General
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {GeneralFaction} faction
 * @property {GeneralRarity} rarity
 * @property {number} teamLevel
 * @property {number} teamSize
 * @property {number} recruitCost
 * @property {GeneralBonus} bonus
 * @property {string} desc
 * @property {string} icon
 */

/** Rarity-based recruit costs (gold). */
const RECRUIT_COST = {
  SSR: { min: 80000, max: 150000 },
  SR: { min: 30000, max: 60000 },
  R: { min: 10000, max: 25000 },
};

function costFor(rarity, seed) {
  const { min, max } = RECRUIT_COST[rarity];
  const t = ((seed * 7919) % 1000) / 1000;
  return Math.round(min + t * (max - min));
}

/** SSR bonuses: high reward & nation boost, NO combat stats. */
function bonusSSR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    gold: 4 + (h % 3), exp: 4 + ((h >> 1) % 3), contrib: 8 + (h % 5),
    territory: 3 + (h % 2), trade: 4 + ((h >> 2) % 3), recruit: 5 + (h % 3),
  };
}

function bonusSR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    gold: 2 + (h % 3), exp: 2 + ((h >> 1) % 3), contrib: 5 + (h % 4),
    territory: 2 + (h % 2), trade: 2 + ((h >> 2) % 3), recruit: 3 + (h % 3),
  };
}

function bonusR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    gold: 1 + (h % 3), exp: 1 + ((h >> 1) % 3), contrib: 2 + (h % 4),
    territory: 1 + (h % 2), trade: 1 + ((h >> 2) % 2), recruit: 1 + (h % 3),
  };
}

function bonusFor(rarity, id) {
  if (rarity === 'SSR') return bonusSSR(id);
  if (rarity === 'SR') return bonusSR(id);
  return bonusR(id);
}

/**
 * @param {Omit<General, 'recruitCost'|'bonus'> & { recruitCost?: number }} raw
 * @returns {General}
 */
function G(raw) {
  const recruitCost = raw.recruitCost ?? costFor(raw.rarity, raw.id.length + raw.teamLevel);
  return { ...raw, recruitCost, bonus: bonusFor(raw.rarity, raw.id) };
}

/** 120 generals: 30 per faction — SSR / SR / R balanced. */
const RAW_GENERALS = [
  // Wei (30) — 4 SSR / 8 SR / 18 R
  G({ id: 'wei_cao_cao', name: '曹操', title: '魏武帝', faction: 'wei', rarity: 'SSR', teamLevel: 88, teamSize: 6, desc: '乱世奸雄，挟天子以令诸侯。', icon: '🦁' }),
  G({ id: 'wei_sima_yi', name: '司马懿', title: '仲达', faction: 'wei', rarity: 'SSR', teamLevel: 86, teamSize: 6, desc: '深谋远虑，晋朝奠基人。', icon: '🦊' }),
  G({ id: 'wei_xun_yu', name: '荀彧', title: '王佐之才', faction: 'wei', rarity: 'SSR', teamLevel: 84, teamSize: 5, desc: '运筹帷幄，曹魏首席战略家。', icon: '📜' }),
  G({ id: 'wei_cao_pi', name: '曹丕', title: '魏文帝', faction: 'wei', rarity: 'SSR', teamLevel: 82, teamSize: 5, desc: '篡汉建魏，文武双全。', icon: '👑' }),
  G({ id: 'wei_zhang_liao', name: '张辽', title: '征东将军', faction: 'wei', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '威震逍遥津，五子良将之首。', icon: '⚔️' }),
  G({ id: 'wei_xiahou_dun', name: '夏侯惇', title: '大将军', faction: 'wei', rarity: 'SR', teamLevel: 76, teamSize: 5, desc: '拔矢啖睛，忠勇冠世。', icon: '🛡️' }),
  G({ id: 'wei_dian_wei', name: '典韦', title: '古之恶来', faction: 'wei', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '双戟无双，死战不退。', icon: '🪓' }),
  G({ id: 'wei_xu_chu', name: '许褚', title: '虎侯', faction: 'wei', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '力大无穷，人称虎痴。', icon: '🐅' }),
  G({ id: 'wei_xiahou_yuan', name: '夏侯渊', title: '妙才', faction: 'wei', rarity: 'SR', teamLevel: 76, teamSize: 5, desc: '千里奔袭，急如风火。', icon: '💨' }),
  G({ id: 'wei_guo_jia', name: '郭嘉', title: '鬼才', faction: 'wei', rarity: 'SR', teamLevel: 78, teamSize: 4, desc: '算无遗策，天不假年。', icon: '🔮' }),
  G({ id: 'wei_jia_xu', name: '贾诩', title: '毒士', faction: 'wei', rarity: 'SR', teamLevel: 77, teamSize: 4, desc: '奇谋百出，善保全身。', icon: '🐍' }),
  G({ id: 'wei_cao_ren', name: '曹仁', title: '大将军', faction: 'wei', rarity: 'SR', teamLevel: 74, teamSize: 5, desc: '守江陵樊城，宗室名将。', icon: '🏰' }),
  G({ id: 'wei_zhang_he', name: '张郃', title: '巧变', faction: 'wei', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '善处营阵，街亭破马谡。', icon: '🏹' }),
  G({ id: 'wei_xu_huang', name: '徐晃', title: '周亚夫之风', faction: 'wei', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '治军严整，解樊城之围。', icon: '⚒️' }),
  G({ id: 'wei_yu_jin', name: '于禁', title: '左将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '五子良将，然晚节有污。', icon: '⛓️' }),
  G({ id: 'wei_pang_de', name: '庞德', title: '抬棺死战', faction: 'wei', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '抬棺战关羽，宁死不降。', icon: '⚰️' }),
  G({ id: 'wei_le_jin', name: '乐进', title: '先登', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '每战先登，五子良将之一。', icon: '🎯' }),
  G({ id: 'wei_xun_you', name: '荀攸', title: '谋主', faction: 'wei', rarity: 'R', teamLevel: 74, teamSize: 4, desc: '十二奇策，曹操首席军师。', icon: '📋' }),
  G({ id: 'wei_cheng_yu', name: '程昱', title: '刚戾', faction: 'wei', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '兖州定策，仓亭破袁绍。', icon: '🧠' }),
  G({ id: 'wei_man_chong', name: '满宠', title: '刚毅', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '守合肥，抗孙权。', icon: '🏯' }),
  G({ id: 'wei_li_dian', name: '李典', title: '儒将', faction: 'wei', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '好学不倦，逍遥津协战。', icon: '📖' }),
  G({ id: 'wei_cao_zhang', name: '曹彰', title: '黄须儿', faction: 'wei', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '诸子中最善战者。', icon: '🐻' }),
  G({ id: 'wei_cao_zhi', name: '曹植', title: '才高八斗', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '七步成诗，文才冠世。', icon: '✒️' }),
  G({ id: 'wei_deng_ai', name: '邓艾', title: '偷渡阴平', faction: 'wei', rarity: 'R', teamLevel: 78, teamSize: 5, desc: '偷渡阴平灭蜀。', icon: '⛰️' }),
  G({ id: 'wei_zhong_hui', name: '钟会', title: '计绝', faction: 'wei', rarity: 'R', teamLevel: 76, teamSize: 5, desc: '伐蜀主帅，阴怀异志。', icon: '🗝️' }),
  G({ id: 'wei_sima_zhao', name: '司马昭', title: '晋王', faction: 'wei', rarity: 'R', teamLevel: 75, teamSize: 4, desc: '路人皆知其心。', icon: '🦅' }),
  G({ id: 'wei_sima_shi', name: '司马师', title: '大将军', faction: 'wei', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '司马氏掌权之始。', icon: '🔗' }),
  G({ id: 'wei_wen_pin', name: '文聘', title: '后将军', faction: 'wei', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '镇守江夏数十年。', icon: '🏞️' }),
  G({ id: 'wei_zang_ba', name: '臧霸', title: '镇东将军', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '青徐豪霸，镇守东方。', icon: '🗻' }),
  G({ id: 'wei_cao_xiu', name: '曹休', title: '大司马', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '宗族大将，石亭之败。', icon: '🪖' }),

  // Shu (30) — 4 SSR / 8 SR / 18 R
  G({ id: 'shu_zhuge_liang', name: '诸葛亮', title: '卧龙', faction: 'shu', rarity: 'SSR', teamLevel: 90, teamSize: 6, desc: '鞠躬尽瘁，六出祁山。', icon: '🪶' }),
  G({ id: 'shu_guan_yu', name: '关羽', title: '武圣', faction: 'shu', rarity: 'SSR', teamLevel: 89, teamSize: 5, desc: '义绝天下，后世尊为武圣。', icon: '🐉' }),
  G({ id: 'shu_liu_bei', name: '刘备', title: '昭烈帝', faction: 'shu', rarity: 'SSR', teamLevel: 85, teamSize: 5, desc: '三顾茅庐，立国蜀汉。', icon: '👑' }),
  G({ id: 'shu_zhao_yun', name: '赵云', title: '虎威将军', faction: 'shu', rarity: 'SSR', teamLevel: 84, teamSize: 5, desc: '长坂救主，一身是胆。', icon: '🐎' }),
  G({ id: 'shu_zhang_fei', name: '张飞', title: '万人敌', faction: 'shu', rarity: 'SR', teamLevel: 79, teamSize: 4, desc: '长坂断桥，万军辟易。', icon: '⚡' }),
  G({ id: 'shu_ma_chao', name: '马超', title: '锦马超', faction: 'shu', rarity: 'SR', teamLevel: 77, teamSize: 4, desc: '西凉骁将，世代公侯。', icon: '🏇' }),
  G({ id: 'shu_huang_zhong', name: '黄忠', title: '老将', faction: 'shu', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '定军山斩夏侯渊。', icon: '🏹' }),
  G({ id: 'shu_jiang_wei', name: '姜维', title: '麒麟儿', faction: 'shu', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '九伐中原，继承武侯遗志。', icon: '🔥' }),
  G({ id: 'shu_pang_tong', name: '庞统', title: '凤雏', faction: 'shu', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '与卧龙齐名，殒于落凤坡。', icon: '🐦' }),
  G({ id: 'shu_fa_zheng', name: '法正', title: '奇画策算', faction: 'shu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '定蜀取汉中之谋。', icon: '📐' }),
  G({ id: 'shu_wei_yan', name: '魏延', title: '镇北将军', faction: 'shu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '子午奇谋，性刚难容。', icon: '🗡️' }),
  G({ id: 'shu_guan_ping', name: '关平', title: '虎子', faction: 'shu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '关羽长子，荆州殉难。', icon: '🌿' }),
  G({ id: 'shu_ma_dai', name: '马岱', title: '平北将军', faction: 'shu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '斩魏延于马下。', icon: '🏔️' }),
  G({ id: 'shu_guan_xing', name: '关兴', title: '侍中', faction: 'shu', rarity: 'R', teamLevel: 65, teamSize: 4, desc: '关羽次子，随军伐吴。', icon: '🌟' }),
  G({ id: 'shu_zhang_bao', name: '张苞', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 64, teamSize: 4, desc: '张飞长子，与关兴并肩。', icon: '💢' }),
  G({ id: 'shu_liao_hua', name: '廖化', title: '老将', faction: 'shu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '蜀中无大将，廖化作先锋。', icon: '🍂' }),
  G({ id: 'shu_wang_ping', name: '王平', title: '镇北大将军', faction: 'shu', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '街亭谏马谡，后守汉中。', icon: '🏔️' }),
  G({ id: 'shu_huang_quan', name: '黄权', title: '车骑将军', faction: 'shu', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '劝阻伐吴不听，败后降魏。', icon: '⚖️' }),
  G({ id: 'shu_li_yan', name: '李严', title: '中都护', faction: 'shu', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '托孤重臣，因粮草案被贬。', icon: '📦' }),
  G({ id: 'shu_xu_shu', name: '徐庶', title: '元直', faction: 'shu', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '走马荐诸葛，入曹终不设一谋。', icon: '🌅' }),
  G({ id: 'shu_mi_zhu', name: '糜竺', title: '安汉将军', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '资助刘备起兵。', icon: '💰' }),
  G({ id: 'shu_jian_yong', name: '简雍', title: '昭德将军', faction: 'shu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '刘备少时好友，善外交。', icon: '🤝' }),
  G({ id: 'shu_ma_liang', name: '马良', title: '白眉', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '白眉最良，夷陵阵亡。', icon: '🎋' }),
  G({ id: 'shu_ma_su', name: '马谡', title: '幼常', faction: 'shu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '好纸上谈兵，失街亭。', icon: '📝' }),
  G({ id: 'shu_fei_yi', name: '费祎', title: '文伟', faction: 'shu', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '蜀汉四相之一。', icon: '🕊️' }),
  G({ id: 'shu_dong_yun', name: '董允', title: '休昭', faction: 'shu', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '正直敢谏，蜀汉贤臣。', icon: '📣' }),
  G({ id: 'shu_jiang_wan', name: '蒋琬', title: '公琰', faction: 'shu', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '社稷之器，诸葛亮继承人。', icon: '🏛️' }),
  G({ id: 'shu_yan_yan', name: '严颜', title: '老将', faction: 'shu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '断头将军，张飞义释之。', icon: '💀' }),
  G({ id: 'shu_zhou_cang', name: '周仓', title: '护卫', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '关羽忠仆，扛青龙刀。', icon: '🔪' }),
  G({ id: 'shu_liu_feng', name: '刘封', title: '副军将军', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '刘备养子，因不救关羽被赐死。', icon: '⚠️' }),

  // Wu (30) — 4 SSR / 8 SR / 18 R
  G({ id: 'wu_zhou_yu', name: '周瑜', title: '大都督', faction: 'wu', rarity: 'SSR', teamLevel: 87, teamSize: 6, desc: '赤壁火攻，美周郎。', icon: '🔥' }),
  G({ id: 'wu_lu_xun', name: '陆逊', title: '丞相', faction: 'wu', rarity: 'SSR', teamLevel: 85, teamSize: 6, desc: '夷陵破刘备，书生拜大将。', icon: '📚' }),
  G({ id: 'wu_sun_ce', name: '孙策', title: '小霸王', faction: 'wu', rarity: 'SSR', teamLevel: 83, teamSize: 5, desc: '横扫江东，奠定基业。', icon: '💥' }),
  G({ id: 'wu_sun_quan', name: '孙权', title: '吴大帝', faction: 'wu', rarity: 'SSR', teamLevel: 84, teamSize: 5, desc: '据江东三世，称帝立国。', icon: '🐯' }),
  G({ id: 'wu_lv_meng', name: '吕蒙', title: '阿蒙', faction: 'wu', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '白衣渡江，夺荆州。', icon: '🌊' }),
  G({ id: 'wu_gan_ning', name: '甘宁', title: '锦帆贼', faction: 'wu', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '百骑劫魏营。', icon: '⛵' }),
  G({ id: 'wu_taishi_ci', name: '太史慈', title: '信义笃烈', faction: 'wu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '弓马无双。', icon: '🏹' }),
  G({ id: 'wu_sun_jian', name: '孙坚', title: '乌程侯', faction: 'wu', rarity: 'SR', teamLevel: 76, teamSize: 5, desc: '江东猛虎，讨董先锋。', icon: '🐅' }),
  G({ id: 'wu_lu_su', name: '鲁肃', title: '子敬', faction: 'wu', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '联刘抗曹，赤壁之策。', icon: '🤝' }),
  G({ id: 'wu_huang_gai', name: '黄盖', title: '老将', faction: 'wu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '苦肉计，赤壁前锋。', icon: '🔥' }),
  G({ id: 'wu_zhou_tai', name: '周泰', title: '护主', faction: 'wu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '屡护孙权，遍体疮痍。', icon: '🛡️' }),
  G({ id: 'wu_cheng_pu', name: '程普', title: '右都督', faction: 'wu', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '三朝元老，赤壁副都督。', icon: '🏛️' }),
  G({ id: 'wu_ling_tong', name: '凌统', title: '英烈', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '为父复仇，江表勇将。', icon: '⚔️' }),
  G({ id: 'wu_ding_feng', name: '丁奉', title: '雪中奋兵', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '短兵解东兴之围。', icon: '❄️' }),
  G({ id: 'wu_xu_sheng', name: '徐盛', title: '安东将军', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 4, desc: '江表名将。', icon: '🌉' }),
  G({ id: 'wu_han_dang', name: '韩当', title: '石城侯', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '历事三代，弓马娴熟。', icon: '🎯' }),
  G({ id: 'wu_pan_zhang', name: '潘璋', title: '右将军', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '斩关羽，骁勇善战。', icon: '🔪' }),
  G({ id: 'wu_zhu_ran', name: '朱然', title: '左大司马', faction: 'wu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '守江陵击退六月围攻。', icon: '🏯' }),
  G({ id: 'wu_lu_kang', name: '陆抗', title: '大司马', faction: 'wu', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '陆逊之子，吴末砥柱。', icon: '🏔️' }),
  G({ id: 'wu_zhu_ge_ke', name: '诸葛恪', title: '太傅', faction: 'wu', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '少年才俊，后骄纵被诛。', icon: '💡' }),
  G({ id: 'wu_sun_shang_xiang', name: '孙尚香', title: '弓腰姬', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '孙权之妹，英姿飒爽。', icon: '🌸' }),
  G({ id: 'wu_da_qiao', name: '大乔', title: '国色', faction: 'wu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '孙策之妻，江东绝色。', icon: '🌺' }),
  G({ id: 'wu_xiao_qiao', name: '小乔', title: '天香', faction: 'wu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '周瑜之妻，二乔之一。', icon: '🌷' }),
  G({ id: 'wu_gu_yong', name: '顾雍', title: '元叹', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '吴国丞相，善理政务。', icon: '📜' }),
  G({ id: 'wu_zhang_zhao', name: '张昭', title: '辅吴将军', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '东吴文臣之首。', icon: '📋' }),
  G({ id: 'wu_bu_zhi', name: '步骘', title: '丞相', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '安南定交。', icon: '🗺️' }),
  G({ id: 'wu_he_qi', name: '贺齐', title: '后将军', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '平山越，善平叛。', icon: '⛰️' }),
  G({ id: 'wu_quan_cong', name: '全琮', title: '右大司马', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '孙权女婿，屡战有功。', icon: '🎖️' }),
  G({ id: 'wu_zhu_huan', name: '朱桓', title: '前将军', faction: 'wu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '濡须破曹仁，胆气过人。', icon: '💪' }),
  G({ id: 'wu_sun_huan', name: '孙桓', title: '建武将军', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '宗室骁将。', icon: '🌟' }),

  // Neutral (30) — 4 SSR / 8 SR / 18 R
  G({ id: 'neu_lv_bu', name: '吕布', title: '飞将', faction: 'neutral', rarity: 'SSR', teamLevel: 88, teamSize: 5, desc: '天下第一，然反复难制。', icon: '🐺' }),
  G({ id: 'neu_dong_zhuo', name: '董卓', title: '相国', faction: 'neutral', rarity: 'SSR', teamLevel: 82, teamSize: 5, desc: '祸乱洛阳，群雄共讨之。', icon: '👹' }),
  G({ id: 'neu_yuan_shao', name: '袁绍', title: '本初', faction: 'neutral', rarity: 'SSR', teamLevel: 80, teamSize: 5, desc: '河北霸主，四世三公。', icon: '🏯' }),
  G({ id: 'neu_zhang_jiao', name: '张角', title: '天公将军', faction: 'neutral', rarity: 'SSR', teamLevel: 78, teamSize: 5, desc: '苍天已死黄天当立。', icon: '☯️' }),
  G({ id: 'neu_yuan_shu', name: '袁术', title: '仲家帝', faction: 'neutral', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '淮南称帝，众叛亲离。', icon: '💸' }),
  G({ id: 'neu_diao_chan', name: '貂蝉', title: '闭月', faction: 'neutral', rarity: 'SR', teamLevel: 68, teamSize: 3, desc: '连环计间吕布董卓。', icon: '🌙' }),
  G({ id: 'neu_gongsun_zan', name: '公孙瓒', title: '白马将军', faction: 'neutral', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '威震塞北，白马义从。', icon: '🦄' }),
  G({ id: 'neu_ma_teng', name: '马腾', title: '征西将军', faction: 'neutral', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '西凉军阀，马超之父。', icon: '🐎' }),
  G({ id: 'neu_liu_biao', name: '刘表', title: '荆州牧', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '坐拥荆州，名重士林。', icon: '📯' }),
  G({ id: 'neu_yan_liang', name: '颜良', title: '河北上将', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '河北四庭柱之首。', icon: '💀' }),
  G({ id: 'neu_wen_chou', name: '文丑', title: '河北名将', faction: 'neutral', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '河北四庭柱之一。', icon: '⚔️' }),
  G({ id: 'neu_hua_xiong', name: '华雄', title: '都督', faction: 'neutral', rarity: 'SR', teamLevel: 68, teamSize: 4, desc: '关羽温酒斩之。', icon: '🍶' }),
  G({ id: 'neu_zhang_xiu', name: '张绣', title: '建忠将军', faction: 'neutral', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '宛城败曹操。', icon: '🔱' }),
  G({ id: 'neu_tao_qian', name: '陶谦', title: '徐州牧', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '三让徐州与刘备。', icon: '🏺' }),
  G({ id: 'neu_liu_zhang', name: '刘璋', title: '益州牧', faction: 'neutral', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '暗弱守蜀。', icon: '🏔️' }),
  G({ id: 'neu_zhang_lu', name: '张鲁', title: '师君', faction: 'neutral', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '据汉中，归曹封侯。', icon: '🕯️' }),
  G({ id: 'neu_meng_huo', name: '孟获', title: '南王', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 4, desc: '七擒七纵，心服诸葛。', icon: '🐘' }),
  G({ id: 'neu_zhang_bao_hj', name: '张宝', title: '地公将军', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '张角之弟，黄巾主将。', icon: '🌍' }),
  G({ id: 'neu_zhang_liang_hj', name: '张梁', title: '人公将军', faction: 'neutral', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '张角幼弟。', icon: '🌑' }),
  G({ id: 'neu_hua_tuo', name: '华佗', title: '神医', faction: 'neutral', rarity: 'R', teamLevel: 55, teamSize: 2, desc: '外科始祖。', icon: '💊' }),
  G({ id: 'neu_zuo_ci', name: '左慈', title: '仙人', faction: 'neutral', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '方术之士，戏弄曹操。', icon: '🧙' }),
  G({ id: 'neu_yu_ji', name: '于吉', title: '道人', faction: 'neutral', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '仙术惊人，为孙策所杀。', icon: '🌬️' }),
  G({ id: 'neu_liu_yan', name: '刘焉', title: '益州牧', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '益州割据开创者。', icon: '🏺' }),
  G({ id: 'neu_kong_rong', name: '孔融', title: '北海太守', faction: 'neutral', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '让梨美谈，直言触怒曹操。', icon: '🍐' }),
  G({ id: 'neu_lu_zhi', name: '卢植', title: '尚书', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '刘备之师，文武双全。', icon: '📚' }),
  G({ id: 'neu_huang_fu_song', name: '皇甫嵩', title: '左将军', faction: 'neutral', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '平定黄巾主力。', icon: '🔥' }),
  G({ id: 'neu_han_sui', name: '韩遂', title: '镇西将军', faction: 'neutral', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '凉州军阀。', icon: '🐴' }),
  G({ id: 'neu_chen_gong', name: '陈宫', title: '军师', faction: 'neutral', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '辅吕布对抗曹操。', icon: '🎯' }),
  G({ id: 'neu_gao_shun', name: '高顺', title: '陷阵营', faction: 'neutral', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '陷阵营攻无不克。', icon: '🛡️' }),
  G({ id: 'neu_zhu_rong', name: '祝融', title: '南蛮女王', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '孟获之妻，飞刀绝技。', icon: '🔥' }),
];

export const SANGUO_GENERALS = RAW_GENERALS;

export const GENERAL_RARITY_CONFIG = {
  SSR: {
    color: '#D4AF37',
    bgColor: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
    label: '传世',
  },
  SR: {
    color: '#B388FF',
    bgColor: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%)',
    label: '名将',
  },
  R: {
    color: '#90A4AE',
    bgColor: 'linear-gradient(135deg, #263238 0%, #546e7a 100%)',
    label: '勇将',
  },
};

export const MAX_RECRUITED_GENERALS = 12;

const RARITY_WEIGHT = { R: 48, SR: 18, SSR: 4 };
const FACTION_WEIGHT_SAME = 6;
const FACTION_WEIGHT_NEUTRAL = 2.5;
const FACTION_WEIGHT_OTHER = 1;

/**
 * @param {string} id
 * @returns {General|undefined}
 */
export function getGeneralById(id) {
  return SANGUO_GENERALS.find((g) => g.id === id);
}

/**
 * @param {GeneralFaction} faction
 * @returns {General[]}
 */
export function getGeneralsByFaction(faction) {
  return SANGUO_GENERALS.filter((g) => g.faction === faction);
}

export const FACTION_PORTRAIT_COLORS = {
  wei: { bg: 'linear-gradient(135deg, #1565C0, #0D47A1)', border: '#42A5F5', text: '#E3F2FD' },
  shu: { bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)', border: '#66BB6A', text: '#E8F5E9' },
  wu: { bg: 'linear-gradient(135deg, #E65100, #BF360C)', border: '#FF7043', text: '#FBE9E7' },
  neutral: { bg: 'linear-gradient(135deg, #616161, #424242)', border: '#9E9E9E', text: '#F5F5F5' },
};

export function getGeneralPortrait(general) {
  const fc = FACTION_PORTRAIT_COLORS[general.faction] || FACTION_PORTRAIT_COLORS.neutral;
  const rc = GENERAL_RARITY_CONFIG[general.rarity] || {};
  const surname = general.name.charAt(0);
  return { surname, bg: fc.bg, border: fc.border, textColor: fc.text, rarityColor: rc.color || '#999', rarityBg: rc.bgColor || '#333' };
}

export function generateEnemyGenerals(enemyLevel, enemyFaction) {
  if (enemyLevel < 40) return [];
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const count = enemyLevel >= 80 ? rand(2, 4) : enemyLevel >= 60 ? rand(1, 3) : rand(0, 2);
  if (count === 0) return [];
  const fac = ['wei', 'shu', 'wu'].includes(enemyFaction) ? enemyFaction : 'neutral';
  const pool = SANGUO_GENERALS.filter(g => Math.abs(g.teamLevel - enemyLevel) <= 20);
  if (pool.length === 0) return [];
  const result = [];
  const used = new Set();
  for (let i = 0; i < count && i < pool.length; i++) {
    const fPool = pool.filter(g => !used.has(g.id) && (g.faction === fac || g.faction === 'neutral'));
    const pick = fPool.length > 0 ? fPool[Math.floor(Math.random() * fPool.length)] : pool.filter(g => !used.has(g.id))[0];
    if (!pick) break;
    used.add(pick.id);
    result.push({ id: pick.id, name: pick.name, title: pick.title, faction: pick.faction, rarity: pick.rarity, bonus: pick.bonus, icon: pick.icon });
  }
  return result;
}

export function calcGeneralsTotalBonus(generals) {
  return (generals || []).reduce((acc, g) => {
    if (g.bonus) Object.keys(g.bonus).forEach(k => { acc[k] = (acc[k]||0) + (g.bonus[k]||0); });
    return acc;
  }, {});
}

/**
 * Weighted random encounter: level-appropriate, map faction bias, rarity skew, excludes recruited.
 * @param {number} playerLevel
 * @param {GeneralFaction} mapFactionOwner
 * @param {string[]} [recruitedIds=[]]
 * @returns {General|null}
 */
export function getRandomGeneralForEncounter(playerLevel, mapFactionOwner, recruitedIds = []) {
  const recruited = new Set(recruitedIds);
  const pl = Math.max(1, Math.min(99, Number(playerLevel) || 30));
  const mapFac = FACTIONS.includes(mapFactionOwner) ? mapFactionOwner : 'neutral';

  const lo = Math.max(30, pl - 14);
  const hi = Math.min(90, pl + 16);

  let pool = SANGUO_GENERALS.filter((g) => !recruited.has(g.id)).filter(
    (g) => g.teamLevel >= lo && g.teamLevel <= hi,
  );

  if (pool.length === 0) {
    pool = SANGUO_GENERALS.filter((g) => !recruited.has(g.id));
  }
  if (pool.length === 0) return null;

  const weights = pool.map((g) => {
    let w = RARITY_WEIGHT[g.rarity] ?? 10;
    if (g.faction === mapFac) w *= FACTION_WEIGHT_SAME;
    else if (g.faction === 'neutral') w *= FACTION_WEIGHT_NEUTRAL;
    else w *= FACTION_WEIGHT_OTHER;
    const lvlDiff = Math.abs(g.teamLevel - pl);
    w *= Math.max(0.35, 1 - lvlDiff * 0.012);
    return w;
  });

  const sum = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * sum;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}
