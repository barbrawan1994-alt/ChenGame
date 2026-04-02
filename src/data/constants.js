export const SAVE_KEY = 'DREAM_RPG_LEGEND_V17_FIXED'; 
export const COVER_IMG = 'https://d41chssnpqdne.cloudfront.net/user_upload_by_module/chat_bot/files/171335642/8ThZtYs6LuFfKPT5.png?Expires=1765643832&Signature=nYen2ZAHB0FN036pzpJDQpFyDHbzrmVIWNL4H5K6gKh4R46tWLw-67EyT64rL3IlpRhhoI6ZYYgJbyCcP6PVS~KmhS9WfVnCgJFnaSLRiZw0PU4nw8XBc9Z2LUw7bQjJe~-Dk1pw~vceXBW0x-3wQRVhODCC8j1yMR3TG7NmXingA9XzEiiwHbyPjpzdwdsBLmuGXDVchwAflfIHrbK9ztGF5SXMEKPhOy9AznZi4p1NFk-BunegV2Kj24ObI2IRN-4R3bPglupHpZHYFdTfmUYk9GXq295CEMkQtdSDZS5kLkDyPrXd~JiZk3tuFn~s7O5QKj3B67jZo~tYfTSYzg__&Key-Pair-Id=K3USGZIKWMDCSX';
export const GRID_W = 30; 
export const GRID_H = 20; 

export const STARTER_POOL_IDS = [1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96, 98, 100, 102, 104, 109, 111, 116, 118, 120, 129, 133, 147, 152, 155, 158, 161, 164, 166, 172];
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
  space: { bg: '#311B92', boardBg: '#4527A0', obstacle: '☄️', ground: '🌑', water: '🌌', rock: '🪐', deco: '⭐', cssClass: 'theme-space' }
};

export const TRAINER_AVATARS = [
  '🧢', '👧', '👦', '👩', '👨', 
  '🕵️', '👩‍🚀', '👨‍🚀', '👮', '👮‍♀️',
  '🧙‍♂️', '🧙‍♀️', '🧛', '🧛‍♀️', '🧟', 
  '🧝', '🧝‍♀️', '🧞', '🧞‍♀️', '🦸',
  '🦹', '🎅', '🤶', '🤴', '👸'
];
