import { GENERAL_EXPANSION } from './generalExpansion.js';
import {
  GENERAL_ROSTER_FACTIONS,
  GENERAL_ROSTER_FACTION_IDS,
  HISTORICAL_POLITICAL_FACTIONS,
  HISTORICAL_POLITICAL_FACTION_IDS,
  getPoliticalFactionWarCamp,
} from './generalFactions.js';

/**
 * Multi-polity historical generals — recruitment & encounter data for faction-themed RPG.
 * `faction` remains the save-compatible strategic camp; historical identity uses the fields below.
 */

const FACTIONS = ['wei', 'shu', 'wu', 'jin', 'neutral'];

/** @typedef {'wei'|'shu'|'wu'|'jin'|'neutral'} GeneralFaction */
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
 * @property {string} rosterFaction - 名将录分组
 * @property {string} politicalFaction - 国战中的真实效忠政权
 * @property {'wei'|'shu'|'wu'|'jin'|'qun'} warCamp - 地图军事联军
 * @property {boolean} canServeAnyWarCamp - 是否可被任一战略阵营延揽
 * @property {GeneralRarity} rarity
 * @property {number} teamLevel
 * @property {number} teamSize
 * @property {number} recruitCost
 * @property {GeneralBonus} bonus
 * @property {number} historicalScore - 史实贡献评分（55-92），是评级与战斗数据的唯一来源
 * @property {'ruler'|'strategist'|'governor'|'defender'|'vanguard'|'cultural'} role
 * @property {string} desc
 * @property {string} icon
 */

/**
 * 评级依据是历史影响、军政实绩与持续影响，不按阵营强行配额，也不以演义知名度替代史实贡献。
 * 未列入 SSR / SR 的人物统一进入 R 档，避免新增人物沿用被替换旧人的评级。
 */
const HISTORICAL_SSR_NAMES = new Set([
  // SSR is reserved for state-shaping rulers and ministers, major-theater commanders,
  // or figures whose documented decisions produced a decisive strategic result.
  // 魏
  '曹操', '曹丕', '荀彧', '贾诩', '张辽', '曹真', '夏侯惇', '夏侯渊',
  '郭嘉', '曹仁', '张郃', '徐晃', '荀攸', '程昱', '满宠', '曹叡', '陈群',
  // 蜀
  '刘备', '诸葛亮', '关羽', '张飞', '赵云', '姜维', '马超', '黄忠', '庞统',
  '法正', '魏延', '蒋琬', '费祎', '董允', '黄权', '王平',
  // 吴
  '孙坚', '孙策', '孙权', '周瑜', '鲁肃', '吕蒙', '陆逊', '陆抗', '甘宁', '太史慈',
  '顾雍', '张昭', '吕范', '朱然', '程普',
  // 晋及两晋南北朝（该阵营覆盖的年代更长，因此人数自然更多）
  '司马懿', '司马师', '司马昭', '司马炎', '羊祜', '杜预', '王濬', '邓艾',
  '谢安', '谢玄', '祖逖', '桓温', '陶侃', '王导', '刘裕', '苻坚', '慕容垂', '檀道济',
  // 群雄
  '董卓', '袁绍', '张角', '皇甫嵩', '卢植', '刘表',
]);

const HISTORICAL_SR_NAMES = new Set([
  // 魏
  '贾逵', '夏侯惇', '典韦', '许褚', '夏侯渊', '郭嘉', '曹仁', '张郃', '徐晃', '于禁',
  '庞德', '乐进', '荀攸', '程昱', '满宠', '李典', '曹彰', '刘馥', '傅嘏', '高柔', '赵俨',
  '文聘', '臧霸', '曹休', '曹叡', '陈群', '刘晔', '郝昭', '田豫', '蒋济', '杜畿', '王基',
  '毌丘俭', '陈泰', '钟繇', '梁习', '曹洪', '曹纯', '郭淮', '王昶', '牵招',
  // 蜀
  '马超', '黄忠', '庞统', '法正', '魏延', '关平', '王平', '黄权', '李严', '徐庶', '马良',
  '费祎', '董允', '蒋琬', '张嶷', '霍弋', '吴懿', '邓芝', '张翼', '马忠', '罗宪', '霍峻',
  '陈到', '李恢', '张裔', '刘巴', '傅佥', '句扶', '柳隐',
  // 吴
  '甘宁', '太史慈', '黄盖', '周泰', '程普', '凌统', '丁奉', '徐盛', '韩当', '朱然', '诸葛恪',
  '顾雍', '张昭', '步骘', '贺齐', '全琮', '朱桓', '吕范', '蒋钦', '诸葛瑾', '吕岱', '朱治',
  '施绩', '孙登', '陶璜', '潘濬', '陆凯', '孙韶', '吾彦',
  // 晋及两晋南北朝
  '钟会', '贾充', '张华', '刘琨', '马隆', '庾亮', '王浑', '陈寿', '裴秀', '卫瓘', '石苞',
  '刘牢之', '温峤', '桓伊', '文鸯', '郗鉴', '桓冲', '谢石', '朱序', '周处', '何无忌',
  '刘弘', '司马睿', '桓玄',
  // 群雄
  '吕布', '袁术', '公孙瓒', '马腾', '颜良', '文丑', '张绣', '刘璋', '张鲁', '韩遂', '陈宫',
  '高顺', '田丰', '沮授', '张任', '李傕', '张燕', '公孙度', '士燮', '王允', '朱儁', '刘虞', '蹋顿',
]);

const HISTORICAL_SCORE_OVERRIDES = {
  曹操: 92, 荀彧: 89, 曹丕: 86, 张辽: 86, 贾诩: 85, 曹真: 85,
  夏侯惇: 84, 夏侯渊: 84, 郭嘉: 84, 曹仁: 85, 张郃: 85, 徐晃: 84, 荀攸: 86,
  程昱: 84, 满宠: 84, 曹叡: 86, 陈群: 87,
  诸葛亮: 92, 刘备: 89, 关羽: 88, 张飞: 85, 赵云: 84, 姜维: 84, 马超: 84, 黄忠: 84,
  庞统: 84, 法正: 85, 魏延: 84, 蒋琬: 86, 费祎: 85, 董允: 85, 黄权: 84, 王平: 84,
  孙权: 89, 周瑜: 88, 陆逊: 87, 孙策: 85, 吕蒙: 85, 孙坚: 84, 鲁肃: 87, 陆抗: 84,
  甘宁: 84, 太史慈: 84, 顾雍: 85, 张昭: 86, 吕范: 84, 朱然: 84, 程普: 84,
  司马懿: 90, 刘裕: 89,
  贾逵: 78, 刘馥: 75, 傅嘏: 74, 高柔: 74, 赵俨: 75, 杜畿: 76,
  陈矫: 69, 梁习: 75, 王观: 69, 吕昭: 68, 黄崇: 66, 张裔: 73,
  陆景: 65, 诸葛融: 64,
};

const GENERAL_ROLE_OVERRIDES = {
  贾逵: 'defender', 刘馥: 'governor', 傅嘏: 'strategist', 高柔: 'governor', 赵俨: 'strategist',
  杜畿: 'governor', 陈矫: 'governor', 梁习: 'governor', 王观: 'governor', 吕昭: 'defender',
  黄崇: 'vanguard', 张裔: 'governor', 董允: 'governor', 陆景: 'defender', 诸葛融: 'defender',
};

const ROLE_LABELS = {
  ruler: '统御', strategist: '谋略', governor: '治政', defender: '守备', vanguard: '征战', cultural: '文教',
};

const EASTERN_JIN_ROSTER_NAMES = new Set([
  '谢安', '谢玄', '祖逖', '桓温', '陶侃', '王导', '庾亮', '刘牢之', '温峤', '桓伊',
  '苏峻', '司马睿', '郗鉴', '桓冲', '谢石', '谢琰', '朱序', '刘毅', '庾翼', '桓玄',
  '毛宝', '何无忌', '王羲之', '顾荣', '何充', '祝伯', '孙恩', '王敦', '王舒', '王彬',
  '王恭', '殷浩', '庾冰', '桓彝', '桓石虔', '桓石民', '桓振', '谢尚', '谢奕', '谢万', '谢朗',
]);
const LIU_SONG_ROSTER_NAMES = new Set([
  '刘裕', '檀道济', '刘道规', '刘敬宣', '檀韶', '檀祗', '王镇恶', '沈田子', '朱龄石',
  '傅弘之', '毛修之', '到彦之', '沈林子', '谢晦', '徐羡之', '傅亮', '王弘', '王华', '刘穆之',
]);
const NORTHERN_WEI_ROSTER_NAMES = new Set(['拓跋珪', '拓跋焘', '崔浩', '长孙嵩', '奚斤', '安颉', '尉眷', '拓跋嗣']);
const SIXTEEN_KINGDOMS_ROSTER_NAMES = new Set([
  '慕容垂', '苻坚', '苻融', '段钦', '慕容恪', '慕容德', '慕容农', '王猛', '吕光', '赫连勃勃',
]);
const WESTERN_JIN_ROSTER_NAMES = new Set([
  '司马懿', '司马炎', '羊祜', '杜预', '司马师', '司马昭', '王濬', '邓艾', '钟会', '贾充',
  '张华', '刘琨', '马隆', '王浑', '陈寿', '裴秀', '荀勖', '卫瓘', '唐彬', '胡奋', '石苞',
  '王戎', '陆机', '陆云', '王经', '文鸯', '诸葛绪', '杨骏', '司马亮', '司马玮', '司马越',
  '司马颖', '段灼', '何攀', '王祥', '山涛', '阮籍', '嵇康', '向秀', '王衍', '周处', '陈骞',
  '周旨', '羊琇', '司马孚', '刘弘',
]);

const rosterFactionFor = (raw) => {
  if (raw.id === 'jin_yu_yi') return 'neutral';
  if (raw.faction !== 'jin') return raw.faction;
  if (EASTERN_JIN_ROSTER_NAMES.has(raw.name)) return 'eastern_jin';
  if (LIU_SONG_ROSTER_NAMES.has(raw.name)) return 'liu_song';
  if (NORTHERN_WEI_ROSTER_NAMES.has(raw.name)) return 'northern_wei';
  if (SIXTEEN_KINGDOMS_ROSTER_NAMES.has(raw.name)) return 'sixteen_kingdoms';
  if (WESTERN_JIN_ROSTER_NAMES.has(raw.name)) return 'western_jin';
  throw new Error(`晋及南北朝名将未配置真实势力: ${raw.id}/${raw.name}`);
};

const HISTORICAL_FACTION_OVERRIDES = {
  司马懿: '曹魏/西晋', 司马师: '曹魏/西晋', 司马昭: '曹魏/西晋', 邓艾: '曹魏', 钟会: '曹魏',
  王经: '曹魏', 诸葛绪: '曹魏', 司马孚: '曹魏/西晋', 文鸯: '曹魏/西晋', 王祥: '曹魏/西晋',
  山涛: '曹魏/西晋', 石苞: '曹魏/西晋', 陈骞: '曹魏/西晋', 陈寿: '蜀汉/西晋', 陆机: '孙吴/西晋',
  陆云: '孙吴/西晋', 刘琨: '西晋/东晋', 祖逖: '西晋/东晋', 陶侃: '西晋/东晋', 顾荣: '西晋/东晋',
  桓玄: '桓楚', 桓振: '桓楚', 孙恩: '孙恩势力', 朱序: '东晋/前秦', 刘裕: '东晋/刘宋',
  檀道济: '东晋/刘宋', 刘道规: '东晋（刘裕集团）', 刘敬宣: '东晋', 王镇恶: '东晋（刘裕集团）',
  沈田子: '东晋（刘裕集团）', 朱龄石: '东晋（刘裕集团）', 傅弘之: '东晋/刘宋', 毛修之: '东晋/刘宋/北魏',
  刘穆之: '东晋（刘裕集团）', 慕容垂: '前燕/后燕', 苻坚: '前秦', 苻融: '前秦', 段钦: '段部鲜卑',
  慕容恪: '前燕', 慕容德: '后燕/南燕', 慕容农: '后燕', 王猛: '前秦', 吕光: '前秦/后凉',
  赫连勃勃: '胡夏', 虞诩: '东汉',
};

const defaultHistoricalFaction = (raw, rosterFaction) => (
  HISTORICAL_FACTION_OVERRIDES[raw.name]
  || raw.historicalFaction
  || ({
    wei: '曹魏', shu: '蜀汉', wu: '孙吴', western_jin: '西晋', eastern_jin: '东晋',
    liu_song: '刘宋', northern_wei: '北魏', sixteen_kingdoms: '十六国', neutral: '汉末群雄',
  }[rosterFaction])
  || '历史势力'
);

const POLITICAL_FACTION_OVERRIDES = {
  司马懿: 'wei', 司马师: 'wei', 司马昭: 'wei', 邓艾: 'wei', 钟会: 'wei', 王经: 'wei', 诸葛绪: 'wei',
  桓玄: 'huan_chu', 桓振: 'huan_chu', 孙恩: 'sun_en',
  慕容垂: 'later_yan', 苻坚: 'former_qin', 苻融: 'former_qin', 段钦: 'duan_xianbei',
  慕容恪: 'former_yan', 慕容德: 'southern_yan', 慕容农: 'later_yan', 王猛: 'former_qin',
  吕光: 'later_liang', 赫连勃勃: 'hu_xia', 虞诩: 'qun',
};

const politicalFactionFor = (raw, rosterFaction) => (
  POLITICAL_FACTION_OVERRIDES[raw.name]
  || ({ neutral: 'qun', sixteen_kingdoms: null }[rosterFaction])
  || rosterFaction
);

const inferGeneralRole = (raw) => {
  if (raw.role) return raw.role;
  if (GENERAL_ROLE_OVERRIDES[raw.name]) return GENERAL_ROLE_OVERRIDES[raw.name];
  const text = `${raw.title || ''}${raw.desc || ''}`;
  if (/(帝|君主|国主|建国|立国|统一|诸侯|太子|王$)/.test(text)) return 'ruler';
  if (/(谋|策|军师|智|运筹|识见|使臣|外交|说客|辩)/.test(text)) return 'strategist';
  if (/(坚守|镇守|守城|死守|防|城|关|都督|边疆|抗|拒|刺史)/.test(text)) return 'defender';
  if (/(治|政|法|农|水利|财政|太守|司徒|司空|尚书|丞相|三公)/.test(text)) return 'governor';
  if (/(文|诗|书法|经学|名士|才女|医|术数)/.test(text)) return 'cultural';
  return 'vanguard';
};

const resolveHistoricalRarity = (raw) => (
  raw.historicalRarity
  || (HISTORICAL_SSR_NAMES.has(raw.name) ? 'SSR' : HISTORICAL_SR_NAMES.has(raw.name) ? 'SR' : 'R')
);

const scoreFor = (raw, rarity) => {
  const ranges = { SSR: [84, 92], SR: [72, 83], R: [55, 71] };
  const [min, max] = ranges[rarity];
  const proposed = raw.historicalScore ?? HISTORICAL_SCORE_OVERRIDES[raw.name] ?? Number(raw.teamLevel) ?? min;
  return Math.max(min, Math.min(max, Math.round(proposed)));
};

const teamSizeFor = (score) => (
  score >= 88 ? 6 : score >= 78 ? 5 : score >= 66 ? 4 : score >= 58 ? 3 : 2
);

/** Rarity- and score-based recruit costs (gold). */
const RECRUIT_COST = {
  SSR: { min: 105000, max: 155000, scoreMin: 84, scoreMax: 92 },
  SR: { min: 48000, max: 92000, scoreMin: 72, scoreMax: 83 },
  R: { min: 15000, max: 45000, scoreMin: 55, scoreMax: 71 },
};

function costFor(rarity, score) {
  const { min, max, scoreMin, scoreMax } = RECRUIT_COST[rarity];
  const t = (score - scoreMin) / Math.max(1, scoreMax - scoreMin);
  return Math.round((min + Math.max(0, Math.min(1, t)) * (max - min)) / 1000) * 1000;
}

/** 奖励加成由评级和人物定位决定，不再用 ID 哈希随机生成。 */
function bonusFor(rarity, role, score) {
  const base = {
    SSR: { gold: 4, exp: 4, contrib: 8, territory: 3, trade: 4, recruit: 5 },
    SR: { gold: 2, exp: 2, contrib: 5, territory: 2, trade: 2, recruit: 3 },
    R: { gold: 1, exp: 1, contrib: 2, territory: 1, trade: 1, recruit: 1 },
  }[rarity];
  const focus = {
    ruler: { contrib: 3, recruit: 2, territory: 1 },
    strategist: { exp: 2, contrib: 2, recruit: 1 },
    governor: { gold: 2, territory: 1, trade: 3, recruit: 1 },
    defender: { territory: 2, contrib: 2, exp: 1 },
    vanguard: { contrib: 3, gold: 1, exp: 1 },
    cultural: { exp: 3, gold: 1, trade: 1 },
  }[role];
  const scoreBonus = score >= 88 ? 1 : 0;
  return Object.fromEntries(Object.keys(base).map(key => [
    key,
    base[key] + (focus[key] || 0) + (scoreBonus && ['contrib', 'territory'].includes(key) ? 1 : 0),
  ]));
}

/**
 * @param {Omit<General, 'recruitCost'|'bonus'> & { recruitCost?: number }} raw
 * @returns {General}
 */
function G(raw) {
  const { profile: _profile, historicalRarity: _historicalRarity, ...generalData } = raw;
  const rarity = resolveHistoricalRarity(raw);
  const historicalScore = scoreFor(raw, rarity);
  const role = inferGeneralRole(raw);
  const rosterFaction = rosterFactionFor(raw);
  const politicalFaction = politicalFactionFor(raw, rosterFaction);
  if (!GENERAL_ROSTER_FACTION_IDS.includes(rosterFaction)) {
    throw new Error(`名将录势力无效: ${raw.id}/${rosterFaction}`);
  }
  if (!HISTORICAL_POLITICAL_FACTION_IDS.includes(politicalFaction)) {
    throw new Error(`国战政治势力无效: ${raw.id}/${politicalFaction}`);
  }
  const teamLevel = historicalScore;
  const teamSize = teamSizeFor(historicalScore);
  const recruitCost = costFor(rarity, historicalScore);
  return {
    ...generalData,
    rarity,
    historicalScore,
    role,
    roleLabel: ROLE_LABELS[role],
    rosterFaction,
    politicalFaction,
    warCamp: getPoliticalFactionWarCamp(politicalFaction),
    canServeAnyWarCamp: rosterFaction === 'liu_song' || rosterFaction === 'northern_wei',
    historicalFaction: defaultHistoricalFaction(raw, rosterFaction),
    teamLevel,
    teamSize,
    recruitCost,
    bonus: bonusFor(rarity, role, historicalScore),
  };
}

/** 550 generals across five gameplay factions; roster and rarity counts follow historical coverage rather than equal quotas. */
const RAW_GENERALS = [
  // Wei (50) — 6 SSR / 12 SR / 32 R
  G({ id: 'wei_cao_cao', name: '曹操', title: '魏武帝', faction: 'wei', rarity: 'SSR', teamLevel: 88, teamSize: 6, desc: '乱世奸雄，挟天子以令诸侯。', icon: '🦁' }),
  G({ id: 'wei_sima_yi', name: '贾逵', title: '建威将军', faction: 'wei', rarity: 'SSR', teamLevel: 86, teamSize: 6, desc: '文武兼备，治郡有方，多次挫败东吴攻势。', icon: '🦊' }),
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
  G({ id: 'wei_deng_ai', name: '刘馥', title: '扬州刺史', faction: 'wei', rarity: 'R', teamLevel: 78, teamSize: 5, desc: '单骑赴任，兴修水利并筑合肥城。', icon: '⛰️' }),
  G({ id: 'wei_zhong_hui', name: '傅嘏', title: '尚书', faction: 'wei', rarity: 'R', teamLevel: 76, teamSize: 5, desc: '识见深远，屡论边事与用兵得失。', icon: '🗝️' }),
  G({ id: 'wei_sima_zhao', name: '高柔', title: '太尉', faction: 'wei', rarity: 'R', teamLevel: 75, teamSize: 4, desc: '执法持正，历仕曹魏数朝。', icon: '🦅' }),
  G({ id: 'wei_sima_shi', name: '赵俨', title: '骠骑将军', faction: 'wei', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '统协调度诸军，镇守关中有功。', icon: '🔗' }),
  G({ id: 'wei_wen_pin', name: '文聘', title: '后将军', faction: 'wei', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '镇守江夏数十年。', icon: '🏞️' }),
  G({ id: 'wei_zang_ba', name: '臧霸', title: '镇东将军', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '青徐豪霸，镇守东方。', icon: '🗻' }),
  G({ id: 'wei_cao_xiu', name: '曹休', title: '大司马', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '宗族大将，石亭之败。', icon: '🪖' }),
  // Wei expansion (+20)
  G({ id: 'wei_cao_zhen', name: '曹真', title: '大将军', faction: 'wei', rarity: 'SSR', teamLevel: 85, teamSize: 5, desc: '曹魏宗室柱石，数次抵御诸葛亮北伐。', icon: '🦾' }),
  G({ id: 'wei_cao_rui', name: '曹叡', title: '魏明帝', faction: 'wei', rarity: 'SSR', teamLevel: 80, teamSize: 5, desc: '明察善断，稳固曹魏基业。', icon: '🏛️' }),
  G({ id: 'wei_chen_qun', name: '陈群', title: '九品中正', faction: 'wei', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '创九品中正制，选贤任能。', icon: '📊' }),
  G({ id: 'wei_liu_ye', name: '刘晔', title: '佐命之臣', faction: 'wei', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '善谋略，辅佐曹氏三代。', icon: '🎭' }),
  G({ id: 'wei_hao_zhao', name: '郝昭', title: '陈仓守将', faction: 'wei', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '以千人守陈仓，退诸葛亮数万大军。', icon: '🧱' }),
  G({ id: 'wei_tian_yu', name: '田豫', title: '边疆名将', faction: 'wei', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '镇守北疆数十年，功勋卓著。', icon: '🏔️' }),
  G({ id: 'wei_hua_xin', name: '华歆', title: '太尉', faction: 'wei', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '博学多识，位居三公。', icon: '🎓' }),
  G({ id: 'wei_wang_lang', name: '王朗', title: '司徒', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '经学名家，朝堂重臣。', icon: '📕' }),
  G({ id: 'wei_jiang_ji', name: '蒋济', title: '太尉', faction: 'wei', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '从征四方，智谋深远。', icon: '⚙️' }),
  G({ id: 'wei_mao_jie', name: '毛玠', title: '尚书仆射', faction: 'wei', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '清廉方正，奉天子以令天下之策。', icon: '📏' }),
  G({ id: 'wei_zhu_ling', name: '朱灵', title: '后将军', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '历仕曹魏，征战无数。', icon: '🗡️' }),
  G({ id: 'wei_niu_jin', name: '牛金', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '勇冠三军，为曹仁救。', icon: '🐂' }),
  G({ id: 'wei_sima_lang', name: '司马朗', title: '兖州刺史', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '司马八达之长兄。', icon: '🔗' }),
  G({ id: 'wei_zhuge_dan', name: '诸葛诞', title: '镇东将军', faction: 'wei', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '诸葛氏之虎，淮南起兵。', icon: '🐯' }),
  G({ id: 'wei_cao_shuang', name: '曹爽', title: '大将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '曹魏权臣，高平陵之变败亡。', icon: '💧' }),
  G({ id: 'wei_huan_fan', name: '桓范', title: '大司农', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '智囊谋士，人称智囊。', icon: '💼' }),
  G({ id: 'wei_du_yu', name: '杜畿', title: '河东太守', faction: 'wei', rarity: 'R', teamLevel: 74, teamSize: 4, desc: '治河东十六年，安民兴业而足军资。', icon: '🏆' }),
  G({ id: 'wei_wang_ji', name: '王基', title: '征南将军', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '稳重持重，善守善攻。', icon: '🛡️' }),
  G({ id: 'wei_guanqiu_jian', name: '毌丘俭', title: '镇东将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '征高句丽，淮南举兵。', icon: '🏹' }),
  G({ id: 'wei_wen_qin', name: '文钦', title: '前将军', faction: 'wei', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '骁勇善战，父子名将。', icon: '⚡' }),
  // Wei expansion-2 (+25)
  G({ id: 'wei_yang_xiu', name: '杨修', title: '主簿', faction: 'wei', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '才思敏捷，恃才放旷终被杀。', icon: '✏️' }),
  G({ id: 'wei_xu_you', name: '许攸', title: '谋士', faction: 'wei', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '官渡献乌巢之计，居功自傲被杀。', icon: '🔑' }),
  G({ id: 'wei_dian_man', name: '典满', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '典韦之子，承父遗志。', icon: '🪓' }),
  G({ id: 'wei_xu_zhu2', name: '徐质', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '曹魏后期猛将，力战姜维。', icon: '💪' }),
  G({ id: 'wei_wang_shuang', name: '王双', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '勇猛过人，被魏延所斩。', icon: '⚔️' }),
  G({ id: 'wei_chen_tai', name: '陈泰', title: '征西将军', faction: 'wei', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '陈群之子，抗姜维有功。', icon: '🏔️' }),
  G({ id: 'wei_zhong_yao', name: '钟繇', title: '太傅', faction: 'wei', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '书法大家，曹魏重臣。', icon: '🖊️' }),
  G({ id: 'wei_jia_chong', name: '陈矫', title: '司徒', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '刚直果断，曹魏开国重臣。', icon: '🗡️' }),
  G({ id: 'wei_wang_hun', name: '梁习', title: '并州刺史', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '整顿并州，迁豪强而安边民。', icon: '⚓' }),
  G({ id: 'wei_yang_hu', name: '王观', title: '司空', faction: 'wei', rarity: 'SR', teamLevel: 76, teamSize: 5, desc: '清俭持正，治郡理军皆有政绩。', icon: '🕊️' }),
  G({ id: 'wei_deng_zhong', name: '邓忠', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '邓艾之子，随父灭蜀。', icon: '⛰️' }),
  G({ id: 'wei_shi_bao', name: '师纂', title: '将军', faction: 'wei', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '邓艾麾下先锋。', icon: '🏹' }),
  G({ id: 'wei_wen_yang', name: '吕昭', title: '镇北将军', faction: 'wei', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '久镇北疆，统军谨严。', icon: '🐎' }),
  G({ id: 'wei_cao_hong', name: '曹洪', title: '骠骑将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '宗室大将，数救曹操于危难。', icon: '🛡️' }),
  G({ id: 'wei_cao_chun', name: '曹纯', title: '虎豹骑督', faction: 'wei', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '统领虎豹骑精锐。', icon: '🐆' }),
  G({ id: 'wei_li_tong', name: '李通', title: '汝南太守', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '忠义守土，为曹操安定后方。', icon: '🏰' }),
  G({ id: 'wei_han_hao', name: '韩浩', title: '中护军', faction: 'wei', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '屯田有功，魏初名臣。', icon: '🌾' }),
  G({ id: 'wei_ren_jun', name: '任峻', title: '典农中郎将', faction: 'wei', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '屯田制奠基者。', icon: '🌱' }),
  G({ id: 'wei_lu_qian', name: '吕虔', title: '徐州刺史', faction: 'wei', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '镇守徐州，赠刀王祥。', icon: '🗡️' }),
  G({ id: 'wei_xin_pi', name: '辛毗', title: '侍中', faction: 'wei', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '直言敢谏，持节督司马懿。', icon: '📏' }),
  G({ id: 'wei_dong_zhao', name: '董昭', title: '司徒', faction: 'wei', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '劝曹操进爵，谋略深远。', icon: '📊' }),
  G({ id: 'wei_guo_huai', name: '郭淮', title: '车骑将军', faction: 'wei', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '雍凉名将，多次击退蜀军北伐。', icon: '🏔️' }),
  G({ id: 'wei_sun_li', name: '孙礼', title: '司隶校尉', faction: 'wei', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '刚直不阿，勇战有功。', icon: '⚖️' }),
  G({ id: 'wei_wang_ling', name: '王凌', title: '太尉', faction: 'wei', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '淮南第一叛，密谋废立。', icon: '🔗' }),
  G({ id: 'wei_cao_ang', name: '曹昂', title: '丰愍公', faction: 'wei', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '曹操长子，宛城让马救父而死。', icon: '🐴' }),
  // Wei expansion-3 (+5)
  G({ id: 'wei_wang_chang', name: '王昶', title: '征南大将军', faction: 'wei', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '曹魏后期名将，治军严整，伐吴有功。', icon: '🛡️' }),
  G({ id: 'wei_qian_zhao', name: '牵招', title: '雁门太守', faction: 'wei', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '镇守北疆，威服乌桓鲜卑。', icon: '🏹' }),
  G({ id: 'wei_xiahou_shang', name: '夏侯尚', title: '征南大将军', faction: 'wei', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '曹魏宗室名将，平定上庸。', icon: '⚔️' }),
  G({ id: 'wei_cao_yu', name: '曹宇', title: '燕王', faction: 'wei', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '曹操之子，曾受命辅政。', icon: '👑' }),
  G({ id: 'wei_jiang_gan', name: '蒋干', title: '说客', faction: 'wei', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '善辩有仪容，曾奉命游说周瑜。', icon: '📜' }),

  // Shu (50) — 6 SSR / 12 SR / 32 R
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
  // Shu expansion (+20)
  G({ id: 'shu_huang_yueying', name: '黄月英', title: '才女', faction: 'shu', rarity: 'SSR', teamLevel: 82, teamSize: 5, desc: '诸葛亮之妻，传说发明木牛流马。', icon: '🔧' }),
  G({ id: 'shu_guan_yinping', name: '关银屏', title: '银屏公主', faction: 'shu', rarity: 'SSR', teamLevel: 80, teamSize: 5, desc: '关羽之女，继承父志，武艺超群。', icon: '🌸' }),
  G({ id: 'shu_zhang_yi', name: '张嶷', title: '荡寇将军', faction: 'shu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '蜀汉后期名将，平定南中。', icon: '🛡️' }),
  G({ id: 'shu_huo_yi', name: '霍弋', title: '南中都督', faction: 'shu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '蜀亡后坚守南中，忠义感天。', icon: '🏔️' }),
  G({ id: 'shu_wu_yi', name: '吴懿', title: '车骑将军', faction: 'shu', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '蜀汉宿将，屡立战功。', icon: '🏇' }),
  G({ id: 'shu_deng_zhi', name: '邓芝', title: '车骑将军', faction: 'shu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '出使东吴修复联盟，才兼文武。', icon: '🕊️' }),
  G({ id: 'shu_zhang_yi_r', name: '张翼', title: '左车骑将军', faction: 'shu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '北伐先锋，屡战不退。', icon: '🦅' }),
  G({ id: 'shu_ma_zhong', name: '马忠', title: '镇南大将军', faction: 'shu', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '镇守南中，威名远播。', icon: '🎖️' }),
  G({ id: 'shu_luo_xian', name: '罗宪', title: '巴东太守', faction: 'shu', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '蜀亡后独守永安，击退吴军。', icon: '🏰' }),
  G({ id: 'shu_qiao_zhou', name: '谯周', title: '光禄大夫', faction: 'shu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '蜀汉文臣，力劝刘禅降魏。', icon: '📜' }),
  G({ id: 'shu_meng_da', name: '孟达', title: '新城太守', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '反复无常，终为司马懿所灭。', icon: '🔄' }),
  G({ id: 'shu_fu_tong', name: '傅彤', title: '中军护卫', faction: 'shu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '夷陵之战殿后战死。', icon: '💀' }),
  G({ id: 'shu_xiang_chong', name: '向宠', title: '中部督', faction: 'shu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '诸葛亮出师表中推荐之将。', icon: '📣' }),
  G({ id: 'shu_zong_yu', name: '宗预', title: '镇军大将军', faction: 'shu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '蜀汉后期忠臣良将。', icon: '🗡️' }),
  G({ id: 'shu_chen_zhen', name: '陈震', title: '卫尉', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '蜀汉外交使臣，忠诚刚直。', icon: '🤝' }),
  G({ id: 'shu_cheng_ji', name: '程畿', title: '从事祭酒', faction: 'shu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '夷陵殉难，忠烈之士。', icon: '🔥' }),
  G({ id: 'shu_huo_jun', name: '霍峻', title: '梓潼太守', faction: 'shu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '以数百人守葭萌关一年。', icon: '🏯' }),
  G({ id: 'shu_wu_ban', name: '吴班', title: '骠骑将军', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '蜀汉骁将，伐吴先锋。', icon: '⚔️' }),
  G({ id: 'shu_wang_kang', name: '王伉', title: '永昌太守', faction: 'shu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '镇守永昌，抵御南蛮。', icon: '🏔️' }),
  G({ id: 'shu_mi_fang', name: '糜芳', title: '南郡太守', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '献荆州降吴，千古骂名。', icon: '😔' }),
  // Shu expansion-2 (+25)
  G({ id: 'shu_zhuge_zhan', name: '诸葛瞻', title: '卫将军', faction: 'shu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '诸葛亮之子，绵竹殉国。', icon: '🔥' }),
  G({ id: 'shu_zhuge_shang', name: '诸葛尚', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '诸葛瞻之子，父子同殉。', icon: '💀' }),
  G({ id: 'shu_guan_suo', name: '关索', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '关羽三子，传说南征先锋。', icon: '🌟' }),
  G({ id: 'shu_zhang_xuan', name: '张遵', title: '尚书', faction: 'shu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '张飞之孙，绵竹战死。', icon: '⚔️' }),
  G({ id: 'shu_li_hui', name: '李恢', title: '庲降都督', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '平定南中功臣。', icon: '🏔️' }),
  G({ id: 'shu_yang_yi', name: '杨仪', title: '中军师', faction: 'shu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '撤军有功，后因怨言废为庶人。', icon: '📝' }),
  G({ id: 'shu_chen_dao', name: '陈到', title: '征西将军', faction: 'shu', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '白毦兵统帅，与赵云齐名。', icon: '🛡️' }),
  G({ id: 'shu_huang_xu', name: '黄崇', title: '尚书郎', faction: 'shu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '黄权之子，绵竹力劝诸葛瞻速占险要，后奋战殉国。', icon: '⚖️' }),
  G({ id: 'shu_wu_lan', name: '吴兰', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '入蜀先锋，下辩战死。', icon: '💀' }),
  G({ id: 'shu_lei_tong', name: '雷铜', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 59, teamSize: 3, desc: '随军入蜀，战死沙场。', icon: '⚡' }),
  G({ id: 'shu_zhuo_ying', name: '卓膺', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '蜀汉早期将领。', icon: '🏹' }),
  G({ id: 'shu_zhao_tong', name: '赵统', title: '虎贲中郎将', faction: 'shu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '赵云长子，继承父爵。', icon: '🐎' }),
  G({ id: 'shu_zhao_guang', name: '赵广', title: '牙门将', faction: 'shu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '赵云次子，沓中战死。', icon: '🗡️' }),
  G({ id: 'shu_liu_ba', name: '刘巴', title: '尚书令', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '才干过人，助理蜀汉财政。', icon: '💰' }),
  G({ id: 'shu_yi_ji', name: '伊籍', title: '昭文将军', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '外交使臣，参与制定蜀科。', icon: '📜' }),
  G({ id: 'shu_qin_mi', name: '秦宓', title: '大司农', faction: 'shu', rarity: 'R', teamLevel: 59, teamSize: 3, desc: '辩才无双，舌战张温。', icon: '🗣️' }),
  G({ id: 'shu_zhang_ni', name: '张裔', title: '辅汉将军', faction: 'shu', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '才干敏捷，出使与治政皆有声名。', icon: '🛡️' }),
  G({ id: 'shu_fu_qian', name: '傅佥', title: '关中都督', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '蜀亡时死守阳安关。', icon: '🏰' }),
  G({ id: 'shu_liu_min', name: '刘敏', title: '左护军', faction: 'shu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '兴势之战有功。', icon: '⚔️' }),
  G({ id: 'shu_ma_miao', name: '马邈', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 57, teamSize: 3, desc: '江油关守将，降邓艾。', icon: '🏳️' }),
  G({ id: 'shu_liao_li', name: '廖立', title: '长水校尉', faction: 'shu', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '才高气傲，遭诸葛亮废黜。', icon: '📋' }),
  G({ id: 'shu_peng_yang', name: '彭羕', title: '太守', faction: 'shu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '才高不羁，因言获罪被诛。', icon: '⚠️' }),
  G({ id: 'shu_sun_qian', name: '孙乾', title: '秉忠将军', faction: 'shu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '刘备早期谋士，善外交。', icon: '🤝' }),
  G({ id: 'shu_deng_xian', name: '邓贤', title: '将军', faction: 'shu', rarity: 'R', teamLevel: 57, teamSize: 3, desc: '绵竹战殉国之将。', icon: '💀' }),
  G({ id: 'shu_liu_shan', name: '刘禅', title: '后主', faction: 'shu', rarity: 'R', teamLevel: 55, teamSize: 3, desc: '乐不思蜀，蜀汉末代君主。', icon: '👑' }),
  // Shu expansion-3 (+5)
  G({ id: 'shu_ju_fu', name: '句扶', title: '左将军', faction: 'shu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '忠勇宽厚，与王平齐名。', icon: '🛡️' }),
  G({ id: 'shu_liu_yin', name: '柳隐', title: '黄金围督', faction: 'shu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '蜀亡之际坚守黄金城，数拒魏军。', icon: '🏰' }),
  G({ id: 'shu_dong_jue', name: '董厥', title: '辅国大将军', faction: 'shu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '蜀汉末期重臣，统军拒敌。', icon: '📋' }),
  G({ id: 'shu_fan_jian', name: '樊建', title: '尚书令', faction: 'shu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '持重守正，蜀亡后入晋。', icon: '📜' }),
  G({ id: 'shu_li_qiu', name: '李球', title: '羽林右部督', faction: 'shu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '绵竹之战随诸葛瞻奋战殉国。', icon: '🔥' }),

  // Wu (50) — 6 SSR / 12 SR / 32 R
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
  // Wu expansion (+20)
  G({ id: 'wu_lv_fan', name: '吕范', title: '大司马', faction: 'wu', rarity: 'SSR', teamLevel: 80, teamSize: 5, desc: '东吴柱国重臣，创建军制。', icon: '🏛️' }),
  G({ id: 'wu_jiang_qin', name: '蒋钦', title: '右护军', faction: 'wu', rarity: 'SSR', teamLevel: 78, teamSize: 5, desc: '江表虎臣，赤壁先锋。', icon: '⚓' }),
  G({ id: 'wu_zhuge_jin', name: '诸葛瑾', title: '大将军', faction: 'wu', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '诸葛亮之兄，一心为吴。', icon: '🪶' }),
  G({ id: 'wu_lv_dai', name: '吕岱', title: '大司马', faction: 'wu', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '平定交州，镇守南疆。', icon: '🌴' }),
  G({ id: 'wu_sun_yi', name: '孙翊', title: '丹阳太守', faction: 'wu', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '孙坚三子，勇猛如兄。', icon: '💥' }),
  G({ id: 'wu_zhu_zhi', name: '朱治', title: '安国将军', faction: 'wu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '孙吴开国元勋。', icon: '🌅' }),
  G({ id: 'wu_liu_zan', name: '留赞', title: '左将军', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '吴国老将，征战数十年。', icon: '🗡️' }),
  G({ id: 'wu_zhang_wen', name: '张温', title: '太子太傅', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '才学出众，出使蜀汉。', icon: '📝' }),
  G({ id: 'wu_xue_zong', name: '薛综', title: '选曹尚书', faction: 'wu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '文章华丽，学问精深。', icon: '📋' }),
  G({ id: 'wu_yu_fan', name: '虞翻', title: '骑都尉', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '博学多才，性情刚直。', icon: '📚' }),
  G({ id: 'wu_kan_ze', name: '阚泽', title: '太子太傅', faction: 'wu', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '赤壁献诈降书之人。', icon: '📜' }),
  G({ id: 'wu_chen_wu', name: '陈武', title: '偏将军', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '合肥血战殉国。', icon: '💀' }),
  G({ id: 'wu_dong_xi', name: '董袭', title: '偏将军', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '濡须暴风中坚守船舰。', icon: '🌊' }),
  G({ id: 'wu_song_qian', name: '宋谦', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '孙策麾下旧部。', icon: '🏹' }),
  G({ id: 'wu_luo_tong', name: '骆统', title: '偏将军', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '清廉爱民，忠勇兼备。', icon: '🌿' }),
  G({ id: 'wu_wu_can', name: '吾粲', title: '屯骑校尉', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '东吴忠臣，因直谏被害。', icon: '📣' }),
  G({ id: 'wu_teng_yin', name: '滕胤', title: '大司马', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '吴末重臣。', icon: '🏺' }),
  G({ id: 'wu_shi_ji', name: '施绩', title: '左大司马', faction: 'wu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '吴末名将，屡抗晋军。', icon: '🛡️' }),
  G({ id: 'wu_jia_hua', name: '贾华', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '孙权侍卫长。', icon: '⚔️' }),
  G({ id: 'wu_sun_hao', name: '孙皓', title: '归命侯', faction: 'wu', rarity: 'R', teamLevel: 55, teamSize: 3, desc: '吴末帝，暴虐亡国。', icon: '💔' }),
  // Wu expansion-2 (+25)
  G({ id: 'wu_lu_ji', name: '陆景', title: '偏将军', faction: 'wu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '陆抗之子，吴亡之际坚守乐乡。', icon: '✒️' }),
  G({ id: 'wu_sun_lin', name: '孙綝', title: '大将军', faction: 'wu', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '吴末权臣，废立天子。', icon: '👹' }),
  G({ id: 'wu_sun_jun', name: '孙峻', title: '丞相', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '诛杀诸葛恪夺权。', icon: '🗡️' }),
  G({ id: 'wu_sun_lu_ban', name: '孙鲁班', title: '全公主', faction: 'wu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '孙权长女，权斗高手。', icon: '🌸' }),
  G({ id: 'wu_he_qi2', name: '濮阳兴', title: '丞相', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '吴末丞相，被孙皓诛杀。', icon: '📜' }),
  G({ id: 'wu_zhang_ti', name: '张悌', title: '丞相', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '吴末丞相，晋军渡江时殉国。', icon: '💀' }),
  G({ id: 'wu_shen_ying', name: '沈莹', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '丹杨刀盾兵精锐统帅。', icon: '🛡️' }),
  G({ id: 'wu_zhuge_xu', name: '诸葛融', title: '奋威将军', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '诸葛瑾之子，统兵驻公安。', icon: '⚔️' }),
  G({ id: 'wu_sun_deng', name: '孙登', title: '太子', faction: 'wu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '孙权嫡长子，仁德英才早逝。', icon: '🌅' }),
  G({ id: 'wu_sun_he', name: '孙和', title: '文帝', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '二宫之争失势被废。', icon: '👑' }),
  G({ id: 'wu_sun_liang', name: '孙亮', title: '会稽王', faction: 'wu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '少帝聪慧却被权臣废黜。', icon: '📖' }),
  G({ id: 'wu_sun_xiu', name: '孙休', title: '景帝', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '诛孙綝夺权，一度中兴。', icon: '🏛️' }),
  G({ id: 'wu_wan_yu', name: '万彧', title: '右丞相', faction: 'wu', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '拥立孙皓，后被猜忌赐死。', icon: '😔' }),
  G({ id: 'wu_tao_huang', name: '陶璜', title: '交州牧', faction: 'wu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '镇守交州，吴末名将。', icon: '🌴' }),
  G({ id: 'wu_wu_jing', name: '吴景', title: '丹阳太守', faction: 'wu', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '孙坚妻弟，助孙策起兵。', icon: '🤝' }),
  G({ id: 'wu_zhu_yi', name: '朱异', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '朱桓之子，被孙綝冤杀。', icon: '😢' }),
  G({ id: 'wu_tang_zi', name: '唐咨', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '善造兵器弩机。', icon: '🔧' }),
  G({ id: 'wu_zhong_li_mu', name: '钟离牧', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '清廉为民，有德之将。', icon: '🌿' }),
  G({ id: 'wu_xue_xu', name: '薛珝', title: '将军', faction: 'wu', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '出使蜀汉，察蜀汉衰相。', icon: '👁️' }),
  G({ id: 'wu_sun_yu', name: '孙瑜', title: '丹阳太守', faction: 'wu', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '孙权族侄，好学善战。', icon: '📚' }),
  G({ id: 'wu_sun_huan2', name: '孙奂', title: '扬威将军', faction: 'wu', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '孙坚之侄孙，镇守江陵。', icon: '🏯' }),
  G({ id: 'wu_pan_jun', name: '潘濬', title: '太常', faction: 'wu', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '原蜀臣降吴，治政有方。', icon: '📋' }),
  G({ id: 'wu_shi_yi', name: '是仪', title: '侍中', faction: 'wu', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '清廉谨慎，侍奉四朝。', icon: '🎖️' }),
  G({ id: 'wu_xia_hou_cheng', name: '贺邵', title: '中书令', faction: 'wu', rarity: 'R', teamLevel: 59, teamSize: 3, desc: '忠言逆耳，被孙皓杀害。', icon: '📣' }),
  G({ id: 'wu_lou_xuan', name: '楼玄', title: '宫下镇', faction: 'wu', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '直言进谏，遭孙皓流放。', icon: '🏔️' }),
  // Wu expansion-3 (+5)
  G({ id: 'wu_lu_kai', name: '陆凯', title: '左丞相', faction: 'wu', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '陆逊族子，屡次直谏孙皓。', icon: '📜' }),
  G({ id: 'wu_sun_shao', name: '孙韶', title: '镇北将军', faction: 'wu', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '镇守江北数十年，屡挫魏军。', icon: '🏹' }),
  G({ id: 'wu_gu_li', name: '谷利', title: '亲近监', faction: 'wu', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '逍遥津死战护主，救孙权脱险。', icon: '🛡️' }),
  G({ id: 'wu_chen_biao', name: '陈表', title: '偏将军', faction: 'wu', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '陈武之子，轻财爱士，深得军心。', icon: '⚔️' }),
  G({ id: 'wu_wu_yan', name: '吾彦', title: '建平太守', faction: 'wu', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '吴末坚守西陵，预警晋军伐吴。', icon: '🏯' }),

  // Jin (75) — 6 SSR / 16 SR / 53 R
  G({ id: 'jin_sima_yi', name: '司马懿', title: '宣帝', faction: 'jin', rarity: 'SSR', teamLevel: 90, teamSize: 6, desc: '鹰视狼顾，三代谋权终统天下。', icon: '🦊' }),
  G({ id: 'jin_sima_yan', name: '司马炎', title: '武帝', faction: 'jin', rarity: 'SSR', teamLevel: 85, teamSize: 5, desc: '代魏建晋，一统三国。', icon: '👑' }),
  G({ id: 'jin_yang_hu', name: '羊祜', title: '征南大将军', faction: 'jin', rarity: 'SSR', teamLevel: 86, teamSize: 5, desc: '仁德将军，灭吴总设计师。', icon: '🕊️' }),
  G({ id: 'jin_du_yu', name: '杜预', title: '征南大将军', faction: 'jin', rarity: 'SSR', teamLevel: 84, teamSize: 5, desc: '文武全才，破竹之势灭东吴。', icon: '🎋' }),
  G({ id: 'jin_xie_an', name: '谢安', title: '太傅', faction: 'jin', rarity: 'SSR', teamLevel: 88, teamSize: 6, desc: '东山再起，淝水之战总指挥。', icon: '⛰️' }),
  G({ id: 'jin_xie_xuan', name: '谢玄', title: '北府将军', faction: 'jin', rarity: 'SSR', teamLevel: 86, teamSize: 5, desc: '北府兵缔造者，淝水大捷。', icon: '🦁' }),
  G({ id: 'jin_sima_shi', name: '司马师', title: '大将军', faction: 'jin', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '铁腕治国，废曹芳立曹髦。', icon: '🔗' }),
  G({ id: 'jin_sima_zhao', name: '司马昭', title: '晋王', faction: 'jin', rarity: 'SR', teamLevel: 77, teamSize: 5, desc: '路人皆知其心，灭蜀总策划。', icon: '🦅' }),
  G({ id: 'jin_wang_jun', name: '王濬', title: '龙骧将军', faction: 'jin', rarity: 'SR', teamLevel: 79, teamSize: 5, desc: '楼船下益州，金陵王气收。', icon: '🚢' }),
  G({ id: 'jin_deng_ai', name: '邓艾', title: '征西将军', faction: 'jin', rarity: 'SR', teamLevel: 80, teamSize: 5, desc: '偷渡阴平，奇兵灭蜀。', icon: '⛰️' }),
  G({ id: 'jin_zhong_hui', name: '钟会', title: '镇西将军', faction: 'jin', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '伐蜀主帅，野心勃勃。', icon: '🗝️' }),
  G({ id: 'jin_jia_chong', name: '贾充', title: '车骑将军', faction: 'jin', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '开国功臣，谋定社稷。', icon: '🎭' }),
  G({ id: 'jin_zhang_hua', name: '张华', title: '司空', faction: 'jin', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '博学多才，力主灭吴。', icon: '📚' }),
  G({ id: 'jin_zu_ti', name: '祖逖', title: '奋威将军', faction: 'jin', rarity: 'SR', teamLevel: 78, teamSize: 5, desc: '闻鸡起舞，中流击楫。', icon: '🐓' }),
  G({ id: 'jin_huan_wen', name: '桓温', title: '大司马', faction: 'jin', rarity: 'SR', teamLevel: 79, teamSize: 5, desc: '三次北伐，权倾朝野。', icon: '🗡️' }),
  G({ id: 'jin_liu_kun', name: '刘琨', title: '并州刺史', faction: 'jin', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '孤城抗胡，闻鸡起舞。', icon: '🌅' }),
  G({ id: 'jin_tao_kan', name: '陶侃', title: '大将军', faction: 'jin', rarity: 'SR', teamLevel: 77, teamSize: 5, desc: '运甓之勤，平定苏峻。', icon: '🧱' }),
  G({ id: 'jin_wang_dao', name: '王导', title: '丞相', faction: 'jin', rarity: 'SR', teamLevel: 76, teamSize: 4, desc: '江左管夷吾，东晋开国。', icon: '📜' }),
  G({ id: 'jin_ma_long', name: '马隆', title: '平虏护军', faction: 'jin', rarity: 'SR', teamLevel: 75, teamSize: 4, desc: '平定凉州，威震西陲。', icon: '🏔️' }),
  G({ id: 'jin_yu_liang', name: '庾亮', title: '征西将军', faction: 'jin', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '南渡名臣，掌握朝政。', icon: '🌙' }),
  G({ id: 'jin_wang_hun', name: '王浑', title: '征东大将军', faction: 'jin', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '伐吴功臣，横江破敌。', icon: '⚓' }),
  G({ id: 'jin_chen_shou', name: '陈寿', title: '治书侍御史', faction: 'jin', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '《三国志》作者，史家之绝唱。', icon: '📖' }),
  G({ id: 'jin_pei_xiu', name: '裴秀', title: '司空', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '地图学之父，制图六体。', icon: '🗺️' }),
  G({ id: 'jin_xun_xu', name: '荀勖', title: '中书监', faction: 'jin', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '博学善音律，西晋名臣。', icon: '🎵' }),
  G({ id: 'jin_wei_guan', name: '卫瓘', title: '太保', faction: 'jin', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '计杀邓艾钟会，平定蜀乱。', icon: '⚖️' }),
  G({ id: 'jin_tang_bin', name: '唐彬', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '灭吴水战先锋。', icon: '⚓' }),
  G({ id: 'jin_hu_fen', name: '胡奋', title: '镇南将军', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '西晋名将，镇守荆州。', icon: '🛡️' }),
  G({ id: 'jin_shi_bao2', name: '石苞', title: '大司马', faction: 'jin', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '伐吴功臣，镇守淮南。', icon: '🏰' }),
  G({ id: 'jin_wang_rong', name: '王戎', title: '司徒', faction: 'jin', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '竹林七贤之一，灭吴有功。', icon: '🎍' }),
  G({ id: 'jin_lu_ji', name: '陆机', title: '文学家', faction: 'jin', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '陆逊之孙，文才绝世。', icon: '✒️' }),
  G({ id: 'jin_lu_yun', name: '陆云', title: '清河太守', faction: 'jin', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '与兄陆机齐名，清正有为。', icon: '☁️' }),
  G({ id: 'jin_liu_lao_zhi', name: '刘牢之', title: '北府将军', faction: 'jin', rarity: 'R', teamLevel: 73, teamSize: 4, desc: '北府兵猛将，淝水先锋。', icon: '🐎' }),
  G({ id: 'jin_wen_qiao', name: '温峤', title: '骠骑将军', faction: 'jin', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '平定王敦之乱，燃犀照水。', icon: '🔥' }),
  G({ id: 'jin_huan_yi', name: '桓伊', title: '右军将军', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '淝水之战先锋，善吹笛。', icon: '🎶' }),
  G({ id: 'jin_su_jun', name: '苏峻', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '流民帅叛乱，攻陷建康。', icon: '⚔️' }),
  G({ id: 'jin_wang_jing', name: '王经', title: '雍州刺史', faction: 'jin', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '洮西败于姜维，死节不屈。', icon: '💀' }),
  G({ id: 'jin_wen_yang', name: '文鸯', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 74, teamSize: 4, desc: '单骑退雄兵，勇冠当世。', icon: '🐎' }),
  G({ id: 'jin_zhuge_xu', name: '诸葛绪', title: '雍州刺史', faction: 'jin', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '伐蜀偏师，未竟全功。', icon: '🏔️' }),
  G({ id: 'jin_yang_jun', name: '杨骏', title: '太傅', faction: 'jin', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '晋武帝岳父，八王之乱祸首。', icon: '⚠️' }),
  G({ id: 'jin_sima_liang', name: '司马亮', title: '汝南王', faction: 'jin', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '八王之乱首殉者。', icon: '🔗' }),
  G({ id: 'jin_sima_wei', name: '司马玮', title: '楚王', faction: 'jin', rarity: 'R', teamLevel: 66, teamSize: 4, desc: '少年勇武，卷入八王之乱。', icon: '🗡️' }),
  G({ id: 'jin_sima_yue', name: '司马越', title: '东海王', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '八王之乱最终胜者。', icon: '👑' }),
  G({ id: 'jin_sima_ying', name: '司马颖', title: '成都王', faction: 'jin', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '八王之乱中势大一时。', icon: '🏰' }),
  G({ id: 'jin_sima_rui', name: '司马睿', title: '元帝', faction: 'jin', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '衣冠南渡，建立东晋。', icon: '🌊' }),
  G({ id: 'jin_xi_jian', name: '郗鉴', title: '车骑将军', faction: 'jin', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '东晋重臣，平苏峻之乱。', icon: '🛡️' }),
  G({ id: 'jin_huan_chong', name: '桓冲', title: '车骑将军', faction: 'jin', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '桓温之弟，忠于晋室。', icon: '🏔️' }),
  G({ id: 'jin_xie_shi', name: '谢石', title: '卫将军', faction: 'jin', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '淝水之战前线总指挥。', icon: '⚔️' }),
  G({ id: 'jin_xie_yan', name: '谢琰', title: '卫将军', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '谢安之子，守御有功。', icon: '🌟' }),
  G({ id: 'jin_zhu_xu', name: '朱序', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '襄阳守将，淝水阵前呼"败了"。', icon: '📣' }),
  G({ id: 'jin_duan_zhi', name: '段灼', title: '散骑常侍', faction: 'jin', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '为邓艾鸣冤上书。', icon: '📜' }),
  G({ id: 'jin_he_pan', name: '何攀', title: '廷尉', faction: 'jin', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '灭吴参谋，献计有功。', icon: '💡' }),
  G({ id: 'jin_wang_xiang', name: '王祥', title: '太保', faction: 'jin', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '卧冰求鲤，至孝典范。', icon: '❄️' }),
  G({ id: 'jin_shan_tao', name: '山涛', title: '吏部尚书', faction: 'jin', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '竹林七贤之一，善鉴识人才。', icon: '🎋' }),
  G({ id: 'jin_ruan_ji', name: '阮籍', title: '步兵校尉', faction: 'jin', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '竹林七贤，佯狂避祸。', icon: '🍶' }),
  G({ id: 'jin_ji_kang', name: '嵇康', title: '中散大夫', faction: 'jin', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '竹林七贤之首，广陵绝响。', icon: '🎵' }),
  G({ id: 'jin_xiang_xiu', name: '向秀', title: '散骑侍郎', faction: 'jin', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '竹林七贤，思旧赋传世。', icon: '🍂' }),
  G({ id: 'jin_wang_rong2', name: '王衍', title: '太尉', faction: 'jin', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '清谈误国，西晋亡国罪臣。', icon: '💬' }),
  G({ id: 'jin_liu_yi', name: '刘毅', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '北府名将，与刘裕争锋。', icon: '⚔️' }),
  G({ id: 'jin_yu_liang_chi', name: '庾翼', title: '安西将军', faction: 'jin', rarity: 'R', teamLevel: 67, teamSize: 4, desc: '庾亮之弟，北伐未成。', icon: '🏹' }),
  G({ id: 'jin_huan_xuan', name: '桓玄', title: '楚帝', faction: 'jin', rarity: 'R', teamLevel: 72, teamSize: 4, desc: '桓温之子，篡晋称帝。', icon: '👹' }),
  G({ id: 'jin_liu_yu', name: '刘裕', title: '宋武帝', faction: 'jin', rarity: 'R', teamLevel: 78, teamSize: 5, desc: '气吞万里如虎，灭晋建宋。', icon: '🐯' }),
  G({ id: 'jin_mu_rong_chui', name: '慕容垂', title: '燕主', faction: 'jin', rarity: 'R', teamLevel: 75, teamSize: 4, desc: '十六国名将，败桓温于枋头。', icon: '🐉' }),
  G({ id: 'jin_fu_jian', name: '苻坚', title: '天王', faction: 'jin', rarity: 'R', teamLevel: 76, teamSize: 5, desc: '百万之师淝水惨败。', icon: '💀' }),
  G({ id: 'jin_fu_rong', name: '苻融', title: '阳平公', faction: 'jin', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '苻坚之弟，淝水阵亡。', icon: '😢' }),
  G({ id: 'jin_duan_qin', name: '段钦', title: '段部将领', faction: 'jin', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '辽西鲜卑段部首领宗族，活跃于十六国乱局。', icon: '🏰' }),
  G({ id: 'jin_zhou_chu', name: '周处', title: '平西将军', faction: 'jin', rarity: 'R', teamLevel: 71, teamSize: 4, desc: '除三害之英雄，战死沙场。', icon: '🐉' }),
  G({ id: 'jin_mao_bao', name: '毛宝', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 66, teamSize: 3, desc: '放龟获救，传奇名将。', icon: '🐢' }),
  G({ id: 'jin_he_wu_ji', name: '何无忌', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '北府名将，讨伐桓玄功臣。', icon: '⚔️' }),
  G({ id: 'jin_tan_dao_ji', name: '檀道济', title: '征南将军', faction: 'jin', rarity: 'R', teamLevel: 74, teamSize: 4, desc: '唱筹量沙，三十六计。', icon: '🧮' }),
  G({ id: 'jin_wang_xian_zhi', name: '王羲之', title: '右军将军', faction: 'jin', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '书圣，兰亭序传世。', icon: '✒️' }),
  G({ id: 'jin_gu_rong_zhi', name: '顾荣', title: '散骑常侍', faction: 'jin', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '南渡功臣，辅佐司马睿。', icon: '🌊' }),
  G({ id: 'jin_he_chong', name: '何充', title: '骠骑将军', faction: 'jin', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '东晋重臣，辅政持重，参与朝廷中枢决策。', icon: '🎖️' }),
  G({ id: 'jin_zhu_bo', name: '祝伯', title: '将军', faction: 'jin', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '淝水之战左翼将领。', icon: '🏹' }),
  G({ id: 'jin_sun_en', name: '孙恩', title: '乱贼', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '五斗米道叛乱，扰乱东晋。', icon: '🌀' }),
  G({ id: 'jin_yu_yi', name: '虞诩', title: '武都太守', faction: 'jin', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '东汉名臣，以增灶计迷惑羌军并解武都之围。', icon: '🔥' }),
  // Jin expansion-3 (+5)
  G({ id: 'jin_chen_qian', name: '陈骞', title: '大司马', faction: 'jin', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '西晋开国名将，镇守荆扬。', icon: '🛡️' }),
  G({ id: 'jin_zhou_zhi', name: '周旨', title: '牙门将', faction: 'jin', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '随杜预奇袭乐乡，截断吴军归路。', icon: '⚔️' }),
  G({ id: 'jin_yang_xiu', name: '羊琇', title: '中护军', faction: 'jin', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '司马炎旧交，参与晋初军政。', icon: '🏛️' }),
  G({ id: 'jin_sima_fu', name: '司马孚', title: '安平献王', faction: 'jin', rarity: 'R', teamLevel: 69, teamSize: 4, desc: '司马懿之弟，历仕魏晋而持守臣节。', icon: '📜' }),
  G({ id: 'jin_liu_hong', name: '刘弘', title: '镇南将军', faction: 'jin', rarity: 'R', teamLevel: 70, teamSize: 4, desc: '镇守荆州，选贤任能，境内安定。', icon: '🌿' }),

  // Neutral (50) — 6 SSR / 12 SR / 32 R
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
  // Neutral expansion (+20)
  G({ id: 'neu_cai_wenji', name: '蔡文姬', title: '才女', faction: 'neutral', rarity: 'SSR', teamLevel: 75, teamSize: 4, desc: '才冠古今，胡笳十八拍传世。', icon: '🎵' }),
  G({ id: 'neu_guan_lu', name: '管辂', title: '神算', faction: 'neutral', rarity: 'SSR', teamLevel: 70, teamSize: 3, desc: '三国第一相士，占卜通神。', icon: '🔮' }),
  G({ id: 'neu_tian_feng', name: '田丰', title: '冀州谋士', faction: 'neutral', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '袁绍谋士，刚而犯上，官渡前谏不听。', icon: '📋' }),
  G({ id: 'neu_ju_shou', name: '沮授', title: '监军', faction: 'neutral', rarity: 'SR', teamLevel: 74, teamSize: 4, desc: '袁绍首席谋士，忠贞不屈。', icon: '⚖️' }),
  G({ id: 'neu_zhang_ren', name: '张任', title: '益州名将', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '刘璋麾下第一猛将，射杀庞统。', icon: '🏹' }),
  G({ id: 'neu_li_jue', name: '李傕', title: '车骑将军', faction: 'neutral', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '董卓余部，把持朝政。', icon: '👹' }),
  G({ id: 'neu_guo_si', name: '郭汜', title: '后将军', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '与李傕共霸长安。', icon: '🗡️' }),
  G({ id: 'neu_fan_chou', name: '樊稠', title: '右将军', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '董卓旧部猛将。', icon: '⚔️' }),
  G({ id: 'neu_zhang_ji', name: '张济', title: '骠骑将军', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '张绣之叔，宛城之主。', icon: '🏯' }),
  G({ id: 'neu_li_ru', name: '李儒', title: '谋士', faction: 'neutral', rarity: 'R', teamLevel: 67, teamSize: 3, desc: '董卓首席谋士，鸩杀少帝。', icon: '🐍' }),
  G({ id: 'neu_niu_fu', name: '牛辅', title: '中郎将', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '董卓女婿，军纪败坏。', icon: '🐂' }),
  G({ id: 'neu_cai_yong', name: '蔡邕', title: '侍中', faction: 'neutral', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '大学者，蔡文姬之父。', icon: '📖' }),
  G({ id: 'neu_he_jin', name: '何进', title: '大将军', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 4, desc: '外戚权臣，引董卓入京致乱。', icon: '💧' }),
  G({ id: 'neu_xu_shao', name: '许劭', title: '品鉴师', faction: 'neutral', rarity: 'R', teamLevel: 55, teamSize: 2, desc: '月旦评天下英雄。', icon: '🏷️' }),
  G({ id: 'neu_chen_lin', name: '陈琳', title: '建安七子', faction: 'neutral', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '檄文退曹操头风。', icon: '✒️' }),
  G({ id: 'neu_mi_heng', name: '祢衡', title: '狂士', faction: 'neutral', rarity: 'R', teamLevel: 55, teamSize: 2, desc: '裸衣骂曹，击鼓痛骂。', icon: '🥁' }),
  G({ id: 'neu_guan_ning', name: '管宁', title: '高士', faction: 'neutral', rarity: 'R', teamLevel: 57, teamSize: 2, desc: '割席断交，高洁隐士。', icon: '🪑' }),
  G({ id: 'neu_bing_yuan', name: '邴原', title: '名士', faction: 'neutral', rarity: 'R', teamLevel: 56, teamSize: 2, desc: '幼年好学，品性高洁。', icon: '🎋' }),
  G({ id: 'neu_yan_xiang', name: '严象', title: '扬州刺史', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '曹操举荐扬州刺史。', icon: '🏺' }),
  G({ id: 'neu_liu_yao', name: '刘繇', title: '扬州刺史', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '被孙策逐出江东。', icon: '🏃' }),
  // Neutral expansion-2 (+25)
  G({ id: 'neu_zhang_yan', name: '张燕', title: '黑山将军', faction: 'neutral', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '黑山军首领，后归降曹操。', icon: '🏴' }),
  G({ id: 'neu_gongsun_du', name: '公孙度', title: '辽东太守', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '割据辽东，自立称王。', icon: '🏯' }),
  G({ id: 'neu_gongsun_yuan', name: '公孙渊', title: '燕王', faction: 'neutral', rarity: 'R', teamLevel: 68, teamSize: 4, desc: '辽东最后霸主，为司马懿所灭。', icon: '🦅' }),
  G({ id: 'neu_shi_xie', name: '士燮', title: '交州牧', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '交州王，四十年安定南疆。', icon: '🌴' }),
  G({ id: 'neu_liu_cong', name: '刘琮', title: '荆州牧', faction: 'neutral', rarity: 'R', teamLevel: 58, teamSize: 3, desc: '刘表次子，降曹献荆州。', icon: '🏳️' }),
  G({ id: 'neu_liu_qi', name: '刘琦', title: '荆州刺史', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '刘表长子，赤壁后病逝。', icon: '🍂' }),
  G({ id: 'neu_han_xuan', name: '韩玄', title: '长沙太守', faction: 'neutral', rarity: 'R', teamLevel: 57, teamSize: 3, desc: '猜忌黄忠，为部将所杀。', icon: '😨' }),
  G({ id: 'neu_liu_du', name: '刘度', title: '零陵太守', faction: 'neutral', rarity: 'R', teamLevel: 56, teamSize: 3, desc: '荆南四郡太守之一。', icon: '🏺' }),
  G({ id: 'neu_jin_xuan', name: '金旋', title: '武陵太守', faction: 'neutral', rarity: 'R', teamLevel: 56, teamSize: 3, desc: '荆南太守，降于刘备。', icon: '🏺' }),
  G({ id: 'neu_zhao_fan', name: '赵范', title: '桂阳太守', faction: 'neutral', rarity: 'R', teamLevel: 57, teamSize: 3, desc: '降刘备后复叛。', icon: '🔄' }),
  G({ id: 'neu_wu_tugu', name: '兀突骨', title: '乌戈国主', faction: 'neutral', rarity: 'SR', teamLevel: 70, teamSize: 4, desc: '藤甲兵首领，被诸葛亮火攻。', icon: '🔥' }),
  G({ id: 'neu_sha_moke', name: '沙摩柯', title: '五溪蛮王', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '五溪蛮族首领，夷陵助蜀。', icon: '🏹' }),
  G({ id: 'neu_yang_feng', name: '杨奉', title: '将军', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '护献帝东迁，后被曹操击败。', icon: '🛡️' }),
  G({ id: 'neu_li_que', name: '李乐', title: '白波将军', faction: 'neutral', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '白波黄巾首领。', icon: '🌊' }),
  G({ id: 'neu_zhang_yang', name: '张杨', title: '河内太守', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '吕布故交，为部下所杀。', icon: '😢' }),
  G({ id: 'neu_tao_qian2', name: '臧洪', title: '东郡太守', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '反袁死节，壮烈殉义。', icon: '💀' }),
  G({ id: 'neu_qiao_mao', name: '桥瑁', title: '东郡太守', faction: 'neutral', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '讨董联军发起者之一。', icon: '📯' }),
  G({ id: 'neu_bao_xin', name: '鲍信', title: '济北相', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '推举曹操为兖州牧，战死黄巾。', icon: '🤝' }),
  G({ id: 'neu_wang_yun', name: '王允', title: '司徒', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '连环计诛董卓之主谋。', icon: '📋' }),
  G({ id: 'neu_ding_yuan', name: '丁原', title: '执金吾', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '吕布义父，被吕布所杀。', icon: '😱' }),
  G({ id: 'neu_zhang_miao', name: '张邈', title: '陈留太守', faction: 'neutral', rarity: 'R', teamLevel: 62, teamSize: 3, desc: '曹操故友，背叛迎吕布。', icon: '🔄' }),
  G({ id: 'neu_kong_zhou', name: '孔伷', title: '豫州刺史', faction: 'neutral', rarity: 'R', teamLevel: 59, teamSize: 3, desc: '讨董联军参与者。', icon: '📯' }),
  G({ id: 'neu_wang_kuang', name: '王匡', title: '河内太守', faction: 'neutral', rarity: 'R', teamLevel: 60, teamSize: 3, desc: '讨董联军先锋。', icon: '⚔️' }),
  G({ id: 'neu_han_fu', name: '韩馥', title: '冀州牧', faction: 'neutral', rarity: 'R', teamLevel: 61, teamSize: 3, desc: '让冀州于袁绍，忧惧自杀。', icon: '😔' }),
  G({ id: 'neu_zhu_jun', name: '朱儁', title: '车骑将军', faction: 'neutral', rarity: 'SR', teamLevel: 71, teamSize: 4, desc: '平定黄巾名将，忠于汉室。', icon: '🔥' }),
  // Neutral expansion-3 (+5)
  G({ id: 'neu_liu_yu', name: '刘虞', title: '幽州牧', faction: 'neutral', rarity: 'SR', teamLevel: 72, teamSize: 4, desc: '宽政安边，深得幽州士民与胡人拥戴。', icon: '🕊️' }),
  G({ id: 'neu_ta_dun', name: '蹋顿', title: '乌桓单于', faction: 'neutral', rarity: 'SR', teamLevel: 73, teamSize: 4, desc: '统一三郡乌桓，后于白狼山败亡。', icon: '🐎' }),
  G({ id: 'neu_ma_wan', name: '马玩', title: '关中将领', faction: 'neutral', rarity: 'R', teamLevel: 65, teamSize: 3, desc: '关中联军八部将之一，曾拒曹操。', icon: '🏇' }),
  G({ id: 'neu_hou_xuan', name: '侯选', title: '关中将领', faction: 'neutral', rarity: 'R', teamLevel: 64, teamSize: 3, desc: '割据河东，与马超韩遂合兵潼关。', icon: '🛡️' }),
  G({ id: 'neu_lei_bo', name: '雷薄', title: '仲家将领', faction: 'neutral', rarity: 'R', teamLevel: 63, teamSize: 3, desc: '袁术部将，后据山自立。', icon: '⚡' }),
  ...GENERAL_EXPANSION.map(G),
];

export const SANGUO_GENERALS = RAW_GENERALS;
export {
  GENERAL_ROSTER_FACTIONS,
  GENERAL_ROSTER_FACTION_IDS,
  HISTORICAL_POLITICAL_FACTIONS,
  HISTORICAL_POLITICAL_FACTION_IDS,
};

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

export const GENERAL_DRAW_RATES = { SSR: 0.06, SR: 0.26, R: 0.68 };
export const GENERAL_DRAW_PITY = 10;

export function drawGeneralFromPool(availableGenerals, pity = 0, random = Math.random) {
  const pool = Array.isArray(availableGenerals) ? availableGenerals.filter(Boolean) : [];
  if (pool.length === 0) return { general: null, nextPity: Math.max(0, Math.floor(Number(pity) || 0)), guaranteed: false };

  const safePity = Math.max(0, Math.floor(Number(pity) || 0));
  const byRarity = {
    SSR: pool.filter(general => general.rarity === 'SSR'),
    SR: pool.filter(general => general.rarity === 'SR'),
    R: pool.filter(general => general.rarity === 'R'),
  };
  const guaranteed = safePity >= GENERAL_DRAW_PITY - 1 && byRarity.SSR.length > 0;
  let rarity = 'R';
  if (guaranteed) {
    rarity = 'SSR';
  } else {
    const roll = random();
    if (roll < GENERAL_DRAW_RATES.SSR) rarity = 'SSR';
    else if (roll < GENERAL_DRAW_RATES.SSR + GENERAL_DRAW_RATES.SR) rarity = 'SR';
  }

  const fallbackOrder = rarity === 'SSR' ? ['SSR', 'SR', 'R'] : rarity === 'SR' ? ['SR', 'R', 'SSR'] : ['R', 'SR', 'SSR'];
  const rarityPool = fallbackOrder.map(key => byRarity[key]).find(group => group.length > 0) || pool;
  const general = rarityPool[Math.min(rarityPool.length - 1, Math.floor(random() * rarityPool.length))];
  return {
    general,
    nextPity: general.rarity === 'SSR' ? 0 : Math.min(GENERAL_DRAW_PITY - 1, safePity + 1),
    guaranteed,
  };
}

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

/** Refreshes old save snapshots from the authoritative roster while preserving save-only fields. */
export function hydrateGeneralSnapshot(savedGeneral) {
  const canonical = getGeneralById(savedGeneral?.id);
  if (!canonical) return null;
  return {
    ...savedGeneral,
    id: canonical.id,
    name: canonical.name,
    title: canonical.title,
    faction: canonical.faction,
    rosterFaction: canonical.rosterFaction,
    politicalFaction: canonical.politicalFaction,
    warCamp: canonical.warCamp,
    canServeAnyWarCamp: canonical.canServeAnyWarCamp,
    historicalFaction: canonical.historicalFaction,
    rarity: canonical.rarity,
    historicalScore: canonical.historicalScore,
    role: canonical.role,
    roleLabel: canonical.roleLabel,
    teamLevel: canonical.teamLevel,
    teamSize: canonical.teamSize,
    recruitCost: canonical.recruitCost,
    bonus: { ...canonical.bonus },
    icon: canonical.icon,
  };
}

/**
 * @param {GeneralFaction} faction
 * @returns {General[]}
 */
export function getGeneralsByFaction(faction) {
  return SANGUO_GENERALS.filter((g) => g.rosterFaction === faction);
}

export const FACTION_PORTRAIT_COLORS = {
  wei: { bg: 'linear-gradient(135deg, #1565C0, #0D47A1)', border: '#42A5F5', text: '#E3F2FD' },
  shu: { bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)', border: '#66BB6A', text: '#E8F5E9' },
  wu: { bg: 'linear-gradient(135deg, #E65100, #BF360C)', border: '#FF7043', text: '#FBE9E7' },
  jin: { bg: 'linear-gradient(135deg, #4A148C, #311B92)', border: '#9C27B0', text: '#F3E5F5' },
  western_jin: { bg: 'linear-gradient(135deg, #6B21A8, #3B0764)', border: '#C084FC', text: '#FAF5FF' },
  eastern_jin: { bg: 'linear-gradient(135deg, #0F766E, #134E4A)', border: '#5EEAD4', text: '#F0FDFA' },
  liu_song: { bg: 'linear-gradient(135deg, #B45309, #78350F)', border: '#FBBF24', text: '#FFFBEB' },
  northern_wei: { bg: 'linear-gradient(135deg, #9F1239, #4C0519)', border: '#FDA4AF', text: '#FFF1F2' },
  sixteen_kingdoms: { bg: 'linear-gradient(135deg, #4338CA, #312E81)', border: '#A5B4FC', text: '#EEF2FF' },
  neutral: { bg: 'linear-gradient(135deg, #616161, #424242)', border: '#9E9E9E', text: '#F5F5F5' },
};

export function getGeneralPortrait(general) {
  const fc = FACTION_PORTRAIT_COLORS[general.rosterFaction] || FACTION_PORTRAIT_COLORS[general.faction] || FACTION_PORTRAIT_COLORS.neutral;
  const rc = GENERAL_RARITY_CONFIG[general.rarity] || {};
  const surname = general.name.charAt(0);
  const imageUrl = general.portrait || (general.id ? `/assets/generals/${general.id}.svg` : null);
  return { surname, imageUrl, bg: fc.bg, border: fc.border, textColor: fc.text, rarityColor: rc.color || '#999', rarityBg: rc.bgColor || '#333' };
}

export function generateEnemyGenerals(enemyLevel, enemyFaction) {
  if (enemyLevel < 40) return [];
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const count = enemyLevel >= 80 ? rand(2, 4) : enemyLevel >= 60 ? rand(1, 3) : rand(0, 2);
  if (count === 0) return [];
  const fac = ['wei', 'shu', 'wu', 'jin'].includes(enemyFaction) ? enemyFaction : 'qun';
  const pool = SANGUO_GENERALS.filter(g => Math.abs(g.teamLevel - enemyLevel) <= 20);
  if (pool.length === 0) return [];
  const result = [];
  const used = new Set();
  for (let i = 0; i < count && i < pool.length; i++) {
    const fPool = pool.filter(g => !used.has(g.id) && (g.warCamp === fac || g.warCamp === 'qun'));
    const pick = fPool.length > 0 ? fPool[Math.floor(Math.random() * fPool.length)] : pool.filter(g => !used.has(g.id))[0];
    if (!pick) break;
    used.add(pick.id);
    result.push({ ...pick, bonus: { ...pick.bonus } });
  }
  return result;
}

export function calcGeneralsTotalBonus(generals) {
  const valuesByBonus = {};
  for (const general of generals || []) {
    for (const [key, rawValue] of Object.entries(general?.bonus || {})) {
      const value = Number(rawValue);
      if (!Number.isFinite(value) || value <= 0) continue;
      if (!valuesByBonus[key]) valuesByBonus[key] = [];
      valuesByBonus[key].push(value);
    }
  }

  return Object.fromEntries(Object.entries(valuesByBonus).map(([key, values]) => {
    // The six strongest contributors apply in full. Reserve generals still help,
    // but at half value, so recruiting a new general can never lower an old bonus.
    const total = values
      .sort((a, b) => b - a)
      .reduce((sum, value, index) => sum + value * (index < 6 ? 1 : 0.5), 0);
    return [key, Math.round(total)];
  }));
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
    if (g.warCamp === (mapFac === 'neutral' ? 'qun' : mapFac)) w *= FACTION_WEIGHT_SAME;
    else if (g.warCamp === 'qun') w *= FACTION_WEIGHT_NEUTRAL;
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
