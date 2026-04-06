// =====================================================================
// 三国历史名战系统 — 20场跨时代战役
// 4大时代 · 60名将全员参战 · 多波次战斗
// =====================================================================

export const HISTORICAL_BATTLE_ERAS = [
  { id: 'era1', name: '群雄割据', desc: '天下大乱，诸侯并起，英雄辈出', icon: '🔥', lvRange: [35, 50] },
  { id: 'era2', name: '三分天下', desc: '赤壁烽火，三足鼎立，大势初成', icon: '⚔️', lvRange: [55, 70] },
  { id: 'era3', name: '鼎足而立', desc: '三国争锋，名将陨落，风云变幻', icon: '🏰', lvRange: [72, 85] },
  { id: 'era4', name: '天下归一', desc: '英雄迟暮，大势所趋，一统山河', icon: '👑', lvRange: [88, 95] },
];

const pool = {
  common:  [6, 9, 65, 94, 130, 143, 149, 168, 199, 241, 434, 437, 443, 446, 449, 452, 455, 459, 461, 463],
  elite:   [33, 69, 134, 135, 136, 138, 139, 140, 160, 169, 182, 190, 206, 225, 376, 467, 469, 471, 479],
  legend:  [248, 249, 282, 373, 384, 445, 491, 493],
};

export const HISTORICAL_BATTLES = [
  // ==================== Era 1: 群雄割据 (Lv.35-50) ====================
  {
    id: 'hb_huangjin', era: 'era1', name: '黄巾之乱', icon: '🔥', lvl: 35, difficulty: 1,
    desc: '苍天已死，黄天当立', lore: '中平元年，张角创太平道，率黄巾军席卷八州。各路诸侯奉诏讨贼，天下自此大乱。',
    waves: [
      { name: '黄巾先锋', generalIds: [], minionPool: pool.common, minionCount: 4, lvl: 33 },
      { name: '张角·天公将军', generalIds: ['neu_zhang_jiao'], minionPool: pool.common, minionCount: 3, lvl: 36 },
    ],
    reward: { gold: 8000, tokens: 5, contribution: 20 },
    unlockReq: null,
    bg: 'linear-gradient(135deg, #827717, #9E9D24)',
  },
  {
    id: 'hb_dongzhuo', era: 'era1', name: '讨伐董卓', icon: '🗡️', lvl: 40, difficulty: 2,
    desc: '十八路诸侯会盟讨董', lore: '董卓废少帝，立献帝，挟天子以令诸侯。曹操发矫诏，十八路诸侯共讨之。',
    waves: [
      { name: '西凉铁骑', generalIds: ['neu_zhang_xiu'], minionPool: pool.common, minionCount: 4, lvl: 38 },
      { name: '吕布·先锋', generalIds: ['neu_lv_bu'], minionPool: pool.elite, minionCount: 3, lvl: 40 },
      { name: '董卓·本阵', generalIds: ['neu_dong_zhuo'], minionPool: pool.elite, minionCount: 3, lvl: 42 },
    ],
    reward: { gold: 10000, tokens: 6, contribution: 25 },
    unlockReq: null,
    bg: 'linear-gradient(135deg, #4E342E, #6D4C41)',
  },
  {
    id: 'hb_hulao', era: 'era1', name: '虎牢关之战', icon: '🐅', lvl: 45, difficulty: 2,
    desc: '三英战吕布，天下震动', lore: '虎牢关前，吕布持方天画戟，无人能挡。刘关张三兄弟合力战之，始有三英战吕布之威名。',
    waves: [
      { name: '并州狼骑', generalIds: ['neu_zhang_lu', 'neu_tao_qian'], minionPool: pool.common, minionCount: 3, lvl: 43 },
      { name: '飞将吕布', generalIds: ['neu_lv_bu', 'neu_diao_chan'], minionPool: pool.elite, minionCount: 2, lvl: 46 },
    ],
    reward: { gold: 11000, tokens: 7, contribution: 28 },
    unlockReq: 'hb_dongzhuo',
    bg: 'linear-gradient(135deg, #B71C1C, #D32F2F)',
  },
  {
    id: 'hb_baima', era: 'era1', name: '白马之围', icon: '🐴', lvl: 48, difficulty: 2,
    desc: '关羽斩颜良、诛文丑', lore: '袁绍遣大将颜良、文丑围白马。关羽策马阵前，万军之中取颜良首级，如探囊取物。',
    waves: [
      { name: '颜良先锋', generalIds: ['neu_wen_chou'], minionPool: pool.common, minionCount: 4, lvl: 46 },
      { name: '袁军主力', generalIds: ['neu_yuan_shao', 'neu_gongsun_zan'], minionPool: pool.elite, minionCount: 3, lvl: 49 },
    ],
    reward: { gold: 12000, tokens: 8, contribution: 30 },
    unlockReq: 'hb_huangjin',
    bg: 'linear-gradient(135deg, #1A237E, #283593)',
  },
  {
    id: 'hb_qunxiong', era: 'era1', name: '群雄逐鹿', icon: '👑', lvl: 50, difficulty: 3,
    desc: '诸侯争霸，逐鹿中原', lore: '各路诸侯割据一方，袁绍、袁术、公孙瓒、刘表、刘璋各怀野心，天下纷争不休。',
    waves: [
      { name: '袁术称帝', generalIds: ['neu_yuan_shu', 'neu_liu_zhang'], minionPool: pool.common, minionCount: 3, lvl: 48 },
      { name: '河北袁绍', generalIds: ['neu_yuan_shao', 'neu_liu_biao'], minionPool: pool.elite, minionCount: 3, lvl: 50 },
      { name: '白马公孙瓒', generalIds: ['neu_gongsun_zan', 'neu_ma_teng'], minionPool: pool.elite, minionCount: 3, lvl: 52 },
    ],
    reward: { gold: 14000, tokens: 8, contribution: 35 },
    unlockReq: 'hb_baima',
    bg: 'linear-gradient(135deg, #4A148C, #6A1B9A)',
  },

  // ==================== Era 2: 三分天下 (Lv.55-70) ====================
  {
    id: 'hb_guandu', era: 'era2', name: '官渡之战', icon: '⚔️', lvl: 55, difficulty: 3,
    desc: '曹操以少胜多，奠定北方霸业', lore: '建安五年，袁绍七十万大军南下，曹操仅七万迎敌。许攸献计火烧乌巢，曹操一战定乾坤。',
    waves: [
      { name: '颜良文丑', generalIds: ['neu_wen_chou', 'wei_xu_huang'], minionPool: pool.common, minionCount: 3, lvl: 53 },
      { name: '张郃·高览', generalIds: ['wei_zhang_he', 'wei_xu_chu'], minionPool: pool.elite, minionCount: 3, lvl: 55 },
      { name: '袁绍本阵', generalIds: ['neu_yuan_shao'], minionPool: pool.elite, minionCount: 4, lvl: 58 },
    ],
    reward: { gold: 15000, tokens: 10, contribution: 40 },
    unlockReq: null,
    bg: 'linear-gradient(135deg, #0D47A1, #1565C0)',
  },
  {
    id: 'hb_changban', era: 'era2', name: '长坂坡之战', icon: '🐎', lvl: 58, difficulty: 3,
    desc: '赵云七进七出，救幼主', lore: '曹军追击刘备于长坂坡，赵子龙单骑救主，怀抱幼主七进七出，斩曹军名将五十余员。',
    waves: [
      { name: '曹军先锋', generalIds: ['wei_cao_ren', 'wei_le_jin'], minionPool: pool.common, minionCount: 4, lvl: 56 },
      { name: '虎豹骑追击', generalIds: ['wei_xu_chu', 'wei_dian_wei', 'wei_zhang_liao'], minionPool: pool.elite, minionCount: 2, lvl: 60 },
    ],
    reward: { gold: 14000, tokens: 9, contribution: 38 },
    unlockReq: 'hb_guandu',
    bg: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
  },
  {
    id: 'hb_chibi', era: 'era2', name: '赤壁之战', icon: '🔥', lvl: 62, difficulty: 4,
    desc: '周瑜火攻破曹，三分天下', lore: '建安十三年，曹操率八十万大军南征。孙刘联盟，周瑜用火攻之计，一夜之间焚尽曹军战船。',
    waves: [
      { name: '曹军水寨', generalIds: ['wei_yu_jin', 'wei_pang_de'], minionPool: pool.common, minionCount: 4, lvl: 60 },
      { name: '铁锁连环', generalIds: ['wei_cao_ren', 'wei_zhang_liao'], minionPool: pool.elite, minionCount: 3, lvl: 63 },
      { name: '曹操本阵', generalIds: ['wei_cao_cao', 'wei_xun_yu'], minionPool: pool.elite, minionCount: 3, lvl: 66 },
    ],
    reward: { gold: 18000, tokens: 12, contribution: 45 },
    unlockReq: 'hb_changban',
    bg: 'linear-gradient(135deg, #BF360C, #E64A19)',
  },
  {
    id: 'hb_tongguan', era: 'era2', name: '潼关之战', icon: '🏔️', lvl: 65, difficulty: 3,
    desc: '曹操大战马超，割须弃袍', lore: '马超、韩遂联军进犯潼关。曹操割须弃袍始得脱身，后用离间计败之。西凉铁骑之威，令曹操叹服。',
    waves: [
      { name: '西凉铁骑', generalIds: ['neu_ma_teng', 'shu_ma_dai'], minionPool: pool.elite, minionCount: 3, lvl: 63 },
      { name: '锦马超', generalIds: ['shu_ma_chao'], minionPool: pool.elite, minionCount: 4, lvl: 67 },
    ],
    reward: { gold: 15000, tokens: 10, contribution: 42 },
    unlockReq: 'hb_guandu',
    bg: 'linear-gradient(135deg, #37474F, #546E7A)',
  },
  {
    id: 'hb_hefei', era: 'era2', name: '合肥之战', icon: '🛡️', lvl: 68, difficulty: 3,
    desc: '张辽八百破十万', lore: '建安二十年，张辽以八百骑兵突袭孙权十万大军，直冲孙权本阵。孙权几乎被擒，大败而归。',
    waves: [
      { name: '吴军先锋', generalIds: ['wu_gan_ning', 'wu_ling_tong'], minionPool: pool.common, minionCount: 4, lvl: 66 },
      { name: '孙权中军', generalIds: ['wu_sun_quan', 'wu_taishi_ci', 'wu_zhou_tai'], minionPool: pool.elite, minionCount: 2, lvl: 70 },
    ],
    reward: { gold: 16000, tokens: 11, contribution: 44 },
    unlockReq: 'hb_chibi',
    bg: 'linear-gradient(135deg, #01579B, #0277BD)',
  },

  // ==================== Era 3: 鼎足而立 (Lv.72-85) ====================
  {
    id: 'hb_hanzhong', era: 'era3', name: '汉中之战', icon: '⛰️', lvl: 72, difficulty: 4,
    desc: '刘备争夺汉中，立蜀之基', lore: '建安二十四年，刘备率军攻汉中。法正为军师，黄忠斩夏侯渊于定军山，刘备遂据汉中称王。',
    waves: [
      { name: '曹军前哨', generalIds: ['wei_xu_huang', 'wei_zhang_he'], minionPool: pool.elite, minionCount: 3, lvl: 70 },
      { name: '夏侯渊防线', generalIds: ['wei_xiahou_dun', 'wei_cao_ren'], minionPool: pool.elite, minionCount: 3, lvl: 73 },
      { name: '曹操亲征', generalIds: ['wei_cao_cao', 'wei_sima_yi'], minionPool: pool.legend, minionCount: 2, lvl: 76 },
    ],
    reward: { gold: 20000, tokens: 13, contribution: 55 },
    unlockReq: null,
    bg: 'linear-gradient(135deg, #33691E, #558B2F)',
  },
  {
    id: 'hb_dingjun', era: 'era3', name: '定军山之战', icon: '🗻', lvl: 75, difficulty: 4,
    desc: '黄忠斩夏侯渊，威震天下', lore: '老将黄忠居高临下，一鼓作气斩杀曹军主帅夏侯渊。蜀军士气大振，汉中之战由此逆转。',
    waves: [
      { name: '曹军守备', generalIds: ['wei_zhang_he', 'wei_xu_huang'], minionPool: pool.elite, minionCount: 3, lvl: 73 },
      { name: '夏侯渊·妙才', generalIds: ['wei_xiahou_dun', 'wei_dian_wei'], minionPool: pool.elite, minionCount: 3, lvl: 77 },
    ],
    reward: { gold: 22000, tokens: 14, contribution: 58 },
    unlockReq: 'hb_hanzhong',
    bg: 'linear-gradient(135deg, #2E7D32, #388E3C)',
  },
  {
    id: 'hb_fancheng', era: 'era3', name: '樊城之战', icon: '🌊', lvl: 78, difficulty: 4,
    desc: '关羽水淹七军，威震华夏', lore: '关羽围樊城，乘秋雨水涨，放水淹于禁七军。斩庞德，擒于禁，威震华夏，曹操欲迁都以避其锋。',
    waves: [
      { name: '于禁七军', generalIds: ['wei_yu_jin', 'wei_pang_de'], minionPool: pool.elite, minionCount: 4, lvl: 76 },
      { name: '曹仁守城', generalIds: ['wei_cao_ren', 'wei_xu_chu'], minionPool: pool.elite, minionCount: 3, lvl: 79 },
      { name: '徐晃救援', generalIds: ['wei_xu_huang', 'wei_zhang_liao'], minionPool: pool.legend, minionCount: 2, lvl: 82 },
    ],
    reward: { gold: 24000, tokens: 15, contribution: 62 },
    unlockReq: 'hb_dingjun',
    bg: 'linear-gradient(135deg, #0D47A1, #1976D2)',
  },
  {
    id: 'hb_jingzhou', era: 'era3', name: '荆州之战', icon: '🏯', lvl: 80, difficulty: 4,
    desc: '白衣渡江，吕蒙袭荆州', lore: '吕蒙称病，陆逊献计白衣渡江，偷袭荆州。关羽腹背受敌，败走麦城，英雄末路。',
    waves: [
      { name: '陆逊伏兵', generalIds: ['wu_lu_xun', 'wu_xu_sheng'], minionPool: pool.elite, minionCount: 3, lvl: 78 },
      { name: '吕蒙主力', generalIds: ['wu_lv_meng', 'wu_ding_feng'], minionPool: pool.elite, minionCount: 3, lvl: 81 },
      { name: '孙权围城', generalIds: ['wu_sun_quan', 'wu_gan_ning', 'wu_taishi_ci'], minionPool: pool.legend, minionCount: 2, lvl: 84 },
    ],
    reward: { gold: 25000, tokens: 15, contribution: 65 },
    unlockReq: 'hb_fancheng',
    bg: 'linear-gradient(135deg, #00695C, #00897B)',
  },
  {
    id: 'hb_yiling', era: 'era3', name: '夷陵之战', icon: '🔥', lvl: 85, difficulty: 5,
    desc: '陆逊火烧连营七百里', lore: '刘备为报关羽之仇，举全国之力伐吴。陆逊坚守不出，待蜀军懈怠，以火攻大破连营七百里。',
    waves: [
      { name: '吴军前哨', generalIds: ['wu_han_dang', 'wu_zhou_tai', 'wu_ling_tong'], minionPool: pool.elite, minionCount: 2, lvl: 82 },
      { name: '甘宁水军', generalIds: ['wu_gan_ning', 'wu_sun_ce'], minionPool: pool.elite, minionCount: 3, lvl: 85 },
      { name: '陆逊·火攻', generalIds: ['wu_lu_xun', 'wu_lv_meng'], minionPool: pool.legend, minionCount: 3, lvl: 88 },
    ],
    reward: { gold: 28000, tokens: 16, contribution: 70 },
    unlockReq: 'hb_jingzhou',
    bg: 'linear-gradient(135deg, #E65100, #F57C00)',
  },

  // ==================== Era 4: 天下归一 (Lv.88-95) ====================
  {
    id: 'hb_wuzhang', era: 'era4', name: '五丈原之战', icon: '⭐', lvl: 88, difficulty: 5,
    desc: '鞠躬尽瘁，死而后已', lore: '建兴十二年，诸葛亮第六次北伐，屯兵五丈原。司马懿坚壁不出，诸葛亮积劳成疾，星落秋风五丈原。',
    waves: [
      { name: '魏军坚守', generalIds: ['wei_zhang_he', 'wei_guo_jia'], minionPool: pool.elite, minionCount: 3, lvl: 86 },
      { name: '司马懿·龟缩', generalIds: ['wei_sima_yi', 'wei_jia_xu'], minionPool: pool.legend, minionCount: 3, lvl: 89 },
      { name: '魏军反击', generalIds: ['wei_cao_cao', 'wei_sima_yi', 'wei_dian_wei'], minionPool: pool.legend, minionCount: 2, lvl: 92 },
    ],
    reward: { gold: 30000, tokens: 18, contribution: 75 },
    unlockReq: null,
    bg: 'linear-gradient(135deg, #1A237E, #311B92)',
  },
  {
    id: 'hb_jieting', era: 'era4', name: '街亭之战', icon: '🏔️', lvl: 90, difficulty: 5,
    desc: '马谡失街亭，诸葛泪斩', lore: '诸葛亮第一次北伐，马谡违令于街亭山上扎营。张郃断水围困，蜀军大败，诸葛亮挥泪斩马谡。',
    waves: [
      { name: '张郃先锋', generalIds: ['wei_zhang_he', 'wei_xu_huang'], minionPool: pool.elite, minionCount: 4, lvl: 88 },
      { name: '魏军围困', generalIds: ['wei_sima_yi', 'wei_cao_ren', 'wei_zhang_liao'], minionPool: pool.legend, minionCount: 2, lvl: 92 },
    ],
    reward: { gold: 32000, tokens: 20, contribution: 80 },
    unlockReq: 'hb_wuzhang',
    bg: 'linear-gradient(135deg, #455A64, #607D8B)',
  },
  {
    id: 'hb_tielongshan', era: 'era4', name: '铁笼山之战', icon: '🦅', lvl: 92, difficulty: 5,
    desc: '姜维最后的北伐', lore: '诸葛亮去世后，姜维继承遗志九伐中原。铁笼山一役，姜维以寡敌众，虽败犹荣，不愧武侯传人。',
    waves: [
      { name: '魏军前锋', generalIds: ['wei_guo_jia', 'wei_jia_xu'], minionPool: pool.elite, minionCount: 3, lvl: 90 },
      { name: '邓艾·钟会', generalIds: ['wei_zhang_he', 'wei_xu_chu'], minionPool: pool.legend, minionCount: 3, lvl: 92 },
      { name: '司马懿本阵', generalIds: ['wei_sima_yi', 'wei_cao_cao'], minionPool: pool.legend, minionCount: 3, lvl: 95 },
    ],
    reward: { gold: 35000, tokens: 22, contribution: 85 },
    unlockReq: 'hb_wuzhang',
    bg: 'linear-gradient(135deg, #3E2723, #5D4037)',
  },
  {
    id: 'hb_shiting', era: 'era4', name: '石亭之战', icon: '🌊', lvl: 93, difficulty: 5,
    desc: '陆逊大破曹休', lore: '吴国大都督陆逊于石亭设伏，大败曹休。此战奠定了吴国江防的铁壁，令魏国不敢再轻易南犯。',
    waves: [
      { name: '吴军诱敌', generalIds: ['wu_lu_su', 'wu_huang_gai'], minionPool: pool.elite, minionCount: 3, lvl: 91 },
      { name: '周瑜遗计', generalIds: ['wu_zhou_yu', 'wu_sun_ce'], minionPool: pool.legend, minionCount: 3, lvl: 93 },
      { name: '陆逊·决战', generalIds: ['wu_lu_xun', 'wu_sun_quan', 'wu_lv_meng'], minionPool: pool.legend, minionCount: 2, lvl: 96 },
    ],
    reward: { gold: 38000, tokens: 23, contribution: 90 },
    unlockReq: 'hb_jieting',
    bg: 'linear-gradient(135deg, #004D40, #00695C)',
  },
  {
    id: 'hb_unify', era: 'era4', name: '天下一统', icon: '🏆', lvl: 95, difficulty: 5,
    desc: '终极决战，一统山河', lore: '天下大势，分久必合。魏蜀吴三国名将齐聚，最终之战，将决定谁能结束这乱世，开创太平盛世！',
    waves: [
      { name: '蜀汉群英', generalIds: ['shu_guan_yu', 'shu_zhang_fei', 'shu_zhao_yun', 'shu_huang_zhong'], minionPool: pool.legend, minionCount: 2, lvl: 93 },
      { name: '东吴豪杰', generalIds: ['wu_zhou_yu', 'wu_lu_xun', 'wu_gan_ning', 'wu_sun_ce'], minionPool: pool.legend, minionCount: 2, lvl: 95 },
      { name: '魏国精锐', generalIds: ['wei_cao_cao', 'wei_sima_yi', 'wei_zhang_liao', 'wei_dian_wei'], minionPool: pool.legend, minionCount: 2, lvl: 97 },
      { name: '飞将吕布', generalIds: ['neu_lv_bu', 'shu_zhuge_liang', 'neu_dong_zhuo'], minionPool: pool.legend, minionCount: 3, lvl: 100 },
    ],
    reward: { gold: 50000, tokens: 25, contribution: 100 },
    unlockReq: 'hb_shiting',
    bg: 'linear-gradient(135deg, #B71C1C, #880E4F, #4A148C)',
  },
];

export const getHistoricalBattleById = (id) => HISTORICAL_BATTLES.find(b => b.id === id) || null;
export const getHistoricalBattlesByEra = (eraId) => HISTORICAL_BATTLES.filter(b => b.era === eraId);
