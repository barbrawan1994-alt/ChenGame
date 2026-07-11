/**
 * Historical identity is intentionally separate from the five strategic war camps.
 * A war camp owns territory; a political faction owns a general's loyalty and decisions.
 */

export const GENERAL_ROSTER_FACTIONS = Object.freeze({
  wei: { id: 'wei', name: '曹魏', shortName: '魏', color: '#2563EB', lightColor: '#60A5FA', warCamp: 'wei' },
  shu: { id: 'shu', name: '蜀汉', shortName: '蜀', color: '#15803D', lightColor: '#4ADE80', warCamp: 'shu' },
  wu: { id: 'wu', name: '孙吴', shortName: '吴', color: '#C2410C', lightColor: '#FB923C', warCamp: 'wu' },
  western_jin: { id: 'western_jin', name: '西晋系', shortName: '西晋', color: '#7E22CE', lightColor: '#C084FC', warCamp: 'jin' },
  eastern_jin: { id: 'eastern_jin', name: '东晋诸方', shortName: '东晋', color: '#0F766E', lightColor: '#5EEAD4', warCamp: 'jin' },
  liu_song: { id: 'liu_song', name: '刘宋', shortName: '刘宋', color: '#B45309', lightColor: '#FBBF24', warCamp: 'jin' },
  northern_wei: { id: 'northern_wei', name: '北魏', shortName: '北魏', color: '#9F1239', lightColor: '#FDA4AF', warCamp: 'jin' },
  sixteen_kingdoms: { id: 'sixteen_kingdoms', name: '十六国诸国', shortName: '十六国', color: '#4338CA', lightColor: '#A5B4FC', warCamp: 'jin' },
  neutral: { id: 'neutral', name: '汉末群雄', shortName: '群雄', color: '#52525B', lightColor: '#A1A1AA', warCamp: 'qun' },
});

export const GENERAL_ROSTER_FACTION_IDS = Object.freeze(Object.keys(GENERAL_ROSTER_FACTIONS));

export const HISTORICAL_POLITICAL_FACTIONS = Object.freeze({
  wei: { id: 'wei', name: '曹魏', shortName: '魏', icon: '🔵', color: '#2563EB', rosterFaction: 'wei', warCamp: 'wei' },
  shu: { id: 'shu', name: '蜀汉', shortName: '蜀', icon: '🟢', color: '#15803D', rosterFaction: 'shu', warCamp: 'shu' },
  wu: { id: 'wu', name: '孙吴', shortName: '吴', icon: '🟠', color: '#C2410C', rosterFaction: 'wu', warCamp: 'wu' },
  western_jin: { id: 'western_jin', name: '西晋', shortName: '西晋', icon: '🏛️', color: '#7E22CE', rosterFaction: 'western_jin', warCamp: 'jin' },
  eastern_jin: { id: 'eastern_jin', name: '东晋', shortName: '东晋', icon: '🌊', color: '#0F766E', rosterFaction: 'eastern_jin', warCamp: 'jin' },
  huan_chu: { id: 'huan_chu', name: '桓楚', shortName: '桓楚', icon: '⚔️', color: '#A21CAF', rosterFaction: 'eastern_jin', warCamp: 'jin' },
  sun_en: { id: 'sun_en', name: '孙恩势力', shortName: '孙恩', icon: '🌀', color: '#0369A1', rosterFaction: 'eastern_jin', warCamp: 'jin' },
  liu_song: { id: 'liu_song', name: '刘宋', shortName: '刘宋', icon: '🐯', color: '#B45309', rosterFaction: 'liu_song', warCamp: 'jin' },
  northern_wei: { id: 'northern_wei', name: '北魏', shortName: '北魏', icon: '🐎', color: '#9F1239', rosterFaction: 'northern_wei', warCamp: 'jin' },
  former_qin: { id: 'former_qin', name: '前秦', shortName: '前秦', icon: '🦅', color: '#92400E', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  former_yan: { id: 'former_yan', name: '前燕', shortName: '前燕', icon: '🐉', color: '#BE123C', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  later_yan: { id: 'later_yan', name: '后燕', shortName: '后燕', icon: '🐲', color: '#C026D3', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  southern_yan: { id: 'southern_yan', name: '南燕', shortName: '南燕', icon: '🪶', color: '#E11D48', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  later_liang: { id: 'later_liang', name: '后凉', shortName: '后凉', icon: '🏔️', color: '#A16207', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  hu_xia: { id: 'hu_xia', name: '胡夏', shortName: '胡夏', icon: '🏹', color: '#B91C1C', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  duan_xianbei: { id: 'duan_xianbei', name: '段部鲜卑', shortName: '段部', icon: '⛺', color: '#6D28D9', rosterFaction: 'sixteen_kingdoms', warCamp: 'jin' },
  qun: { id: 'qun', name: '汉末群雄', shortName: '群雄', icon: '🏴', color: '#52525B', rosterFaction: 'neutral', warCamp: 'qun' },
});

export const HISTORICAL_POLITICAL_FACTION_IDS = Object.freeze(Object.keys(HISTORICAL_POLITICAL_FACTIONS));

export const getPoliticalFactionWarCamp = faction => (
  HISTORICAL_POLITICAL_FACTIONS[faction]?.warCamp
  || (['wei', 'shu', 'wu', 'jin', 'qun'].includes(faction) ? faction : 'qun')
);

export const getPoliticalFactionMeta = faction => (
  HISTORICAL_POLITICAL_FACTIONS[faction]
  || HISTORICAL_POLITICAL_FACTIONS.qun
);

export const getRosterFactionMeta = faction => (
  GENERAL_ROSTER_FACTIONS[faction]
  || GENERAL_ROSTER_FACTIONS.neutral
);
