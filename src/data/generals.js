/**
 * Three Kingdoms (三国) generals — recruitment & encounter data for faction-themed RPG.
 * Factions: wei (魏), shu (蜀), wu (吴), neutral (独立/群雄).
 */

const FACTIONS = ['wei', 'shu', 'wu', 'neutral'];

/** @typedef {'wei'|'shu'|'wu'|'neutral'} GeneralFaction */
/** @typedef {'SSR'|'SR'|'R'} GeneralRarity */

/**
 * @typedef {Object} GeneralBonus
 * @property {number} atk
 * @property {number} def
 * @property {number} spd
 * @property {number} gold
 * @property {number} exp
 * @property {number} contrib
 * @property {number} catchRate
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

/** SSR-tier bonuses (higher totals). id used as deterministic salt. */
function bonusSSR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const atk = 3 + (h % 3);
  const def = 3 + ((h >> 1) % 3);
  const spd = 2 + (h % 2);
  const gold = 3 + ((h >> 2) % 3);
  const exp = 3 + ((h >> 3) % 3);
  const contrib = 7 + (h % 4);
  const catchRate = 2 + (h % 2);
  return { atk, def, spd, gold, exp, contrib, catchRate };
}

function bonusSR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    atk: 2 + (h % 3),
    def: 2 + ((h >> 1) % 3),
    spd: 1 + (h % 3),
    gold: 2 + ((h >> 2) % 3),
    exp: 2 + ((h >> 3) % 3),
    contrib: 4 + (h % 4),
    catchRate: 1 + (h % 3),
  };
}

function bonusR(id) {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    atk: 0 + (h % 4),
    def: 0 + ((h >> 1) % 4),
    spd: 0 + (h % 4),
    gold: 0 + ((h >> 2) % 6),
    exp: 0 + ((h >> 3) % 6),
    contrib: 0 + (h % 8),
    catchRate: 0 + (h % 4),
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

/** 60 generals: 15 per faction — 8 SSR, 20 SR, 32 R globally. */
const RAW_GENERALS = [
  // —— 魏 Wei (2 SSR / 5 SR / 8 R) ——
  G({ id: 'wei_cao_cao', name: '曹操', title: '魏武帝', faction: 'wei', rarity: 'SSR', teamLevel: 88, teamSize: 6, desc: '乱世奸雄，挟天子以令诸侯，奠定曹魏基业。', icon: '🦁' }),
  G({ id: 'wei_sima_yi', name: '司马懿', title: '仲达', faction: 'wei', rarity: 'SSR', teamLevel: 86, teamSize: 6, desc: '深谋远虑，高平陵之变后掌魏权，晋朝奠基人。', icon: '🦊' }),
  G({ id: 'wei_zhang_liao', name: '张辽', title: '征东将军', faction: 'wei', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '威震逍遥津，江东小儿闻其名不敢夜啼。', icon: '⚔️' }),
  G({ id: 'wei_xiahou_dun', name: '夏侯惇', title: '大将军', faction: 'wei', rarity: 'SR', teamLevel: 76, teamSize: 5, desc: '曹氏宗亲砥柱，拔矢啖睛，忠勇冠世。', icon: '🛡️' }),
  G({ id: 'wei_dian_wei', name: '典韦', title: '古之恶来', faction: 'wei', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '濮阳护主，双戟无双，死战不退。', icon: '🪓' }),
  G({ id: 'wei_xu_chu', name: '许褚', title: '虎侯', faction: 'wei', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '曹操虎卫，力大无穷，人称“虎痴”。', icon: '🐅' }),
  G({ id: 'wei_xun_yu', name: '荀彧', title: '王佐之才', faction: 'wei', rarity: 'SR', teamLevel: 80, teamSize: 4, desc: '运筹帷幄，为曹操规划战略与人才。', icon: '📜' }),
  G({ id: 'wei_guo_jia', name: '郭嘉', title: '鬼才', faction: 'wei', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '算无遗策，可惜天不假年。', icon: '🔮' }),
  G({ id: 'wei_jia_xu', name: '贾诩', title: '毒士', faction: 'wei', rarity: 'R', teamLevel: 77, teamSize: 4, desc: '奇谋百出，善保身全族于乱世。', icon: '🐍' }),
  G({ id: 'wei_zhang_he', name: '张郃', title: '巧变', faction: 'wei', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '善处营阵，街亭破马谡。', icon: '🏹' }),
  G({ id: 'wei_xu_huang', name: '徐晃', title: '周亚夫之风', faction: 'wei', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '治军严整，解樊城之围。', icon: '⚒️' }),
  G({ id: 'wei_yu_jin', name: '于禁', title: '左将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '五子良将之一，然晚节有污。', icon: '⛓️' }),
  G({ id: 'wei_cao_ren', name: '曹仁', title: '大将军', faction: 'wei', rarity: 'R', teamLevel: 74, teamSize: 5, desc: '守江陵樊城，曹魏宗室名将。', icon: '🏰' }),
  G({ id: 'wei_pang_de', name: '庞德', title: '抬棺死战', faction: 'wei', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '抬棺战关羽，宁死不降。', icon: '⚰️' }),
  G({ id: 'wei_le_jin', name: '乐进', title: '先登', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '每战先登，五子良将之一。', icon: '🎯' }),

  // —— 蜀 Shu (2 SSR / 5 SR / 8 R) ——
  G({ id: 'shu_zhuge_liang', name: '诸葛亮', title: '卧龙', faction: 'shu', rarity: 'SSR', teamLevel: 90, teamSize: 6, desc: '鞠躬尽瘁，六出祁山，千古名相。', icon: '🪶' }),
  G({ id: 'shu_guan_yu', name: '关羽', title: '武圣', faction: 'shu', rarity: 'SSR', teamLevel: 89, teamSize: 5, desc: '义绝天下，威震华夏，后世尊为武圣。', icon: '🐉' }),
  G({ id: 'shu_liu_bei', name: '刘备', title: '昭烈帝', faction: 'shu', rarity: 'SR', teamLevel: 82, teamSize: 5, desc: '织席贩履而起，三顾茅庐，立国蜀汉。', icon: '👑' }),
  G({ id: 'shu_zhang_fei', name: '张飞', title: '万人敌', faction: 'shu', rarity: 'SR', teamLevel: 79, teamSize: 4, desc: '长坂断桥，万军辟易。', icon: '⚡' }),
  G({ id: 'shu_zhao_yun', name: '赵云', title: '虎威将军', faction: 'shu', rarity: 'SR', teamLevel: 81, teamSize: 5, desc: '长坂救主，一身是胆。', icon: '🐎' }),
  G({ id: 'shu_ma_chao', name: '马超', title: '锦马超', faction: 'shu', rarity: 'SR', teamLevel: 77, teamSize: 4, desc: '西凉骁将，世代公侯。', icon: '🏇' }),
  G({ id: 'shu_huang_zhong', name: '黄忠', title: '老将', faction: 'shu', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '定军山斩夏侯，老当益壮。', icon: '🏹' }),
  G({ id: 'shu_jiang_wei', name: '姜维', title: '麒麟儿', faction: 'shu', rarity: 'R', teamLevel: 76, teamSize: 5, desc: '继承武侯遗志，九伐中原。', icon: '🔥' }),
  G({ id: 'shu_wei_yan', name: '魏延', title: '镇北将军', faction: 'shu', rarity: 'R', teamLevel: 74, teamSize: 4, desc: '子午奇谋未行，性刚难容。', icon: '🗡️' }),
  G({ id: 'shu_pang_tong', name: '庞统', title: '凤雏', faction: 'shu', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '与卧龙齐名，殒于落凤坡。', icon: '🐦' }),
  G({ id: 'shu_fa_zheng', name: '法正', title: '奇画策算', faction: 'shu', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '定蜀取汉中，奇谋辅先主。', icon: '📐' }),
  G({ id: 'shu_ma_dai', name: '马岱', title: '平北将军', faction: 'shu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '西凉旧部，随姜维北伐。', icon: '🏔️' }),
  G({ id: 'shu_guan_xing', name: '关兴', title: '侍中', faction: 'shu', rarity: 'R', teamLevel: 65, teamSize: 4, desc: '关羽次子，随军伐吴。', icon: '🌟' }),
  G({ id: 'shu_zhang_bao', name: '张苞', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 64, teamSize: 4, desc: '张飞长子，与关兴并肩。', icon: '💢' }),
  G({ id: 'shu_liao_hua', name: '廖化', title: '老将', faction: 'shu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '蜀中无大将，廖化作先锋。', icon: '🍂' }),

  // —— 吴 Wu (2 SSR / 5 SR / 8 R) ——
  G({ id: 'wu_zhou_yu', name: '周瑜', title: '大都督', faction: 'wu', rarity: 'SSR', teamLevel: 87, teamSize: 6, desc: '赤壁火攻，雄姿英发，美周郎。', icon: '🔥' }),
  G({ id: 'wu_lu_xun', name: '陆逊', title: '丞相', faction: 'wu', rarity: 'SSR', teamLevel: 85, teamSize: 6, desc: '夷陵破刘备，书生拜大将。', icon: '📚' }),
  G({ id: 'wu_sun_quan', name: '孙权', title: '吴大帝', faction: 'wu', rarity: 'SR', teamLevel: 83, teamSize: 5, desc: '据江东三世，称帝立国。', icon: '🐯' }),
  G({ id: 'wu_sun_ce', name: '孙策', title: '小霸王', faction: 'wu', rarity: 'SR', teamLevel: 80, teamSize: 5, desc: '横扫江东，奠定孙氏基业。', icon: '💥' }),
  G({ id: 'wu_lv_meng', name: '吕蒙', title: '阿蒙', faction: 'wu', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '白衣渡江，擒关羽夺荆州。', icon: '🌊' }),
  G({ id: 'wu_gan_ning', name: '甘宁', title: '锦帆贼', faction: 'wu', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '百骑劫魏营，江表虎臣。', icon: '⛵' }),
  G({ id: 'wu_taishi_ci', name: '太史慈', title: '信义笃烈', faction: 'wu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '神亭酣战孙策，弓马无双。', icon: '🏹' }),
  G({ id: 'wu_sun_jian', name: '孙坚', title: '乌程侯', faction: 'wu', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '江东猛虎，讨董先锋。', icon: '🐅' }),
  G({ id: 'wu_lu_su', name: '鲁肃', title: '子敬', faction: 'wu', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '联刘抗曹，赤壁之策主谋之一。', icon: '🤝' }),
  G({ id: 'wu_huang_gai', name: '黄盖', title: '老将', faction: 'wu', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '苦肉计诈降，赤壁火攻前锋。', icon: '🔥' }),
  G({ id: 'wu_zhou_tai', name: '周泰', title: '护主', faction: 'wu', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '屡护孙权，遍体疮痍。', icon: '🛡️' }),
  G({ id: 'wu_ling_tong', name: '凌统', title: '英烈', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '为父复仇，江表勇将。', icon: '⚔️' }),
  G({ id: 'wu_ding_feng', name: '丁奉', title: '雪中奋兵', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '短兵解东兴之围，老而弥坚。', icon: '❄️' }),
  G({ id: 'wu_xu_sheng', name: '徐盛', title: '安东将军', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 4, desc: '守南郡御曹休，江表名将。', icon: '🌉' }),
  G({ id: 'wu_han_dang', name: '韩当', title: '石城侯', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '历事孙氏三代，弓马娴熟。', icon: '🎯' }),

  // —— 中立 Neutral (2 SSR / 5 SR / 8 R) ——
  G({ id: 'neu_lv_bu', name: '吕布', title: '飞将', faction: 'neutral', rarity: 'SSR', teamLevel: 88, teamSize: 5, desc: '辕门射戟，天下第一，然反复难制。', icon: '🐺' }),
  G({ id: 'neu_dong_zhuo', name: '董卓', title: '相国', faction: 'neutral', rarity: 'SSR', teamLevel: 82, teamSize: 5, desc: '祸乱洛阳，天下群雄共讨之。', icon: '👹' }),
  G({ id: 'neu_yuan_shao', name: '袁绍', title: '本初', faction: 'neutral', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '河北霸主，官渡一败势去难回。', icon: '🏯' }),
  G({ id: 'neu_yuan_shu', name: '袁术', title: '仲家帝', faction: 'neutral', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '淮南称帝，众叛亲离。', icon: '💸' }),
  G({ id: 'neu_diao_chan', name: '貂蝉', title: '闭月', faction: 'neutral', rarity: 'SR', teamLevel: 68, teamSize: 3, desc: '连环计间吕布董卓，传说美人。', icon: '🌙' }),
  G({ id: 'neu_zhang_jiao', name: '张角', title: '天公将军', faction: 'neutral', rarity: 'SR', teamLevel: 75, teamSize: 5, desc: '黄巾起义，苍天已死黄天当立。', icon: '☯️' }),
  G({ id: 'neu_gongsun_zan', name: '公孙瓒', title: '白马将军', faction: 'neutral', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '威震塞北，白马义从。', icon: '🦄' }),
  G({ id: 'neu_ma_teng', name: '马腾', title: '征西将军', faction: 'neutral', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '西凉军阀，马超之父。', icon: '🐎' }),
  G({ id: 'neu_liu_biao', name: '刘表', title: '荆州牧', faction: 'neutral', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '坐拥荆州，名重士林。', icon: '📯' }),
  G({ id: 'neu_zhang_xiu', name: '张绣', title: '建忠将军', faction: 'neutral', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '宛城败曹操，北地枪王传说所系。', icon: '🔱' }),
  G({ id: 'neu_tao_qian', name: '陶谦', title: '徐州牧', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '三让徐州与刘备。', icon: '🏺' }),
  G({ id: 'neu_liu_zhang', name: '刘璋', title: '益州牧', faction: 'neutral', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '暗弱守蜀，终为刘备所取。', icon: '🏔️' }),
  G({ id: 'neu_zhang_lu', name: '张鲁', title: '师君', faction: 'neutral', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '据汉中五斗米道，归曹封侯。', icon: '🕯️' }),
  G({ id: 'neu_meng_huo', name: '孟获', title: '南王', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 4, desc: '七擒七纵，心服诸葛。', icon: '🐘' }),
  G({ id: 'neu_wen_chou', name: '文丑', title: '河北名将', faction: 'neutral', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '袁绍麾下猛将，河北四庭柱之一。', icon: '⚔️' }),
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

export const MAX_RECRUITED_GENERALS = 8;

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
