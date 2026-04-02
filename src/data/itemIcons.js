// Pure CSS item icon data definitions
// Consumed by renderItemIcon() in App.js to produce React elements

export const BALL_ICONS = {
  poke:   { top:'linear-gradient(180deg,#FF1744,#D50000)', bottom:'linear-gradient(180deg,#FAFAFA,#E0E0E0)', band:'#333', btn:'radial-gradient(circle,#fff 40%,#ccc 60%,#888)', glow:'rgba(255,23,68,0.3)' },
  great:  { top:'linear-gradient(180deg,#2979FF,#1565C0)', bottom:'linear-gradient(180deg,#FAFAFA,#E0E0E0)', band:'#333', btn:'radial-gradient(circle,#fff 40%,#ccc 60%,#888)', glow:'rgba(41,121,255,0.3)', stripes:true },
  ultra:  { top:'linear-gradient(180deg,#222,#111)', bottom:'linear-gradient(180deg,#FFD600,#F9A825)', band:'#FFD600', btn:'radial-gradient(circle,#fff 40%,#ccc 60%,#888)', glow:'rgba(255,214,0,0.3)', accent:'H' },
  master: { top:'linear-gradient(180deg,#9C27B0,#6A1B9A 50%,#4A148C)', bottom:'linear-gradient(180deg,#E8E8E8,#BDBDBD)', band:'#CE93D8', btn:'radial-gradient(circle,#E040FB 30%,#AB47BC 60%,#7B1FA2)', glow:'rgba(156,39,176,0.5)', letter:'M' },
  net:    { top:'linear-gradient(180deg,#00BFA5,#00897B)', bottom:'linear-gradient(180deg,#FAFAFA,#E0E0E0)', band:'#333', btn:'radial-gradient(circle,#fff 40%,#ccc 60%,#888)', glow:'rgba(0,191,165,0.3)', mesh:true },
  dusk:   { top:'linear-gradient(180deg,#1B5E20,#0D3010)', bottom:'linear-gradient(180deg,#333,#111)', band:'#4CAF50', btn:'radial-gradient(circle,#76FF03 30%,#33691E 70%)', glow:'rgba(76,175,80,0.4)' },
  quick:  { top:'linear-gradient(180deg,#FF6F00,#E65100)', bottom:'linear-gradient(180deg,#FFD54F,#FFB300)', band:'#333', btn:'radial-gradient(circle,#fff 40%,#FFE082 60%,#FF8F00)', glow:'rgba(255,111,0,0.4)', bolt:true },
  timer:  { top:'linear-gradient(90deg,#F44336 50%,#fff 50%)', bottom:'linear-gradient(90deg,#fff 50%,#F44336 50%)', band:'#333', btn:'radial-gradient(circle,#fff 40%,#ccc 60%,#888)', glow:'rgba(244,67,54,0.3)' },
  heal:   { top:'linear-gradient(180deg,#F48FB1,#EC407A)', bottom:'linear-gradient(180deg,#FAFAFA,#F5F5F5)', band:'#F06292', btn:'radial-gradient(circle,#FCE4EC 30%,#F48FB1 60%,#EC407A)', glow:'rgba(236,64,122,0.3)', cross:true },
};

export const MED_ICONS = {
  potion:       { shape:'bottle', c:'#7C4DFF', cap:'#5E35B1', label:'+20' },
  super_potion: { shape:'bottle', c:'#FF6D00', cap:'#E65100', label:'+60' },
  hyper_potion: { shape:'bottle', c:'#E91E63', cap:'#AD1457', label:'+200' },
  max_potion:   { shape:'bottle', c:'#FFD600', cap:'#F9A825', label:'MAX', shine:true },
  ether:        { shape:'flask',  c:'#29B6F6', cap:'#0288D1', label:'PP' },
  max_ether:    { shape:'flask',  c:'#00BCD4', cap:'#00838F', label:'ALL', shine:true },
  antidote:     { shape:'tube',   c:'#66BB6A', accent:'#2E7D32', sym:'✕' },
  paralyze_heal:{ shape:'tube',   c:'#FDD835', accent:'#F9A825', sym:'⚡' },
  burn_heal:    { shape:'tube',   c:'#FF7043', accent:'#D84315', sym:'~' },
  full_heal:    { shape:'crystal',c:'#AB47BC', accent:'#7B1FA2', shine:true },
  revive:       { shape:'diamond',c:'#42A5F5', accent:'#1565C0' },
  max_revive:   { shape:'diamond',c:'#FFD600', accent:'#FF6D00', shine:true },
};

export const STONE_ICONS = {
  fire_stone:    { c1:'#FF5722', c2:'#FF9800', sym:'🜂', glow:'#FF5722' },
  water_stone:   { c1:'#1976D2', c2:'#42A5F5', sym:'≈', glow:'#1976D2' },
  thunder_stone: { c1:'#FDD835', c2:'#FFEE58', sym:'⚡', glow:'#FDD835' },
  leaf_stone:    { c1:'#388E3C', c2:'#66BB6A', sym:'♣', glow:'#388E3C' },
  moon_stone:    { c1:'#5C6BC0', c2:'#7986CB', sym:'☽', glow:'#5C6BC0' },
  sun_stone:     { c1:'#FF8F00', c2:'#FFB74D', sym:'☀', glow:'#FF8F00' },
  ice_stone:     { c1:'#4FC3F7', c2:'#B3E5FC', sym:'❅', glow:'#4FC3F7' },
  dusk_stone:    { c1:'#37474F', c2:'#78909C', sym:'◐', glow:'#78909C' },
  dawn_stone:    { c1:'#CE93D8', c2:'#F3E5F5', sym:'✦', glow:'#CE93D8' },
  shiny_stone:   { c1:'#FFD54F', c2:'#FFF9C4', sym:'✧', glow:'#FFD54F' },
};

export const ACC_ICONS = {
  a1:     { c:'#FF9800', b:'#E65100', shape:'star',   sym:'★' },
  a2:     { c:'#F44336', b:'#C62828', shape:'round',  sym:'✊' },
  a3:     { c:'#9C27B0', b:'#6A1B9A', shape:'round',  sym:'≈' },
  a4:     { c:'#795548', b:'#4E342E', shape:'round',  sym:'♥' },
  a5:     { c:'#FFD600', b:'#F9A825', shape:'crown',  sym:'♛' },
  a6:     { c:'#90CAF9', b:'#42A5F5', shape:'round',  sym:'◎' },
  a7:     { c:'#ECEFF1', b:'#B0BEC5', shape:'fang',   sym:'⋀' },
  a8:     { c:'#78909C', b:'#455A64', shape:'shield', sym:'◇' },
  a9:     { c:'#8BC34A', b:'#558B2F', shape:'round',  sym:'●' },
  trophy: { c:'#FFD600', b:'#FF6F00', shape:'trophy', sym:'♛' },
};

export const GROWTH_ICONS = {
  vit_hp:    { c:'#4CAF50', sym:'HP', bg:'#E8F5E9' },
  vit_patk:  { c:'#F44336', sym:'ATK',bg:'#FFEBEE' },
  vit_pdef:  { c:'#2196F3', sym:'DEF',bg:'#E3F2FD' },
  vit_satk:  { c:'#9C27B0', sym:'SP', bg:'#F3E5F5' },
  vit_sdef:  { c:'#009688', sym:'SD', bg:'#E0F2F1' },
  vit_spd:   { c:'#FF9800', sym:'SPD',bg:'#FFF3E0' },
  vit_crit:  { c:'#E91E63', sym:'★', bg:'#FCE4EC' },
  exp_candy: { c:'#7C4DFF', sym:'EXP',bg:'#EDE7F6' },
  max_candy: { c:'#FFD600', sym:'LV', bg:'#FFFDE7', shine:true },
};

export const TM_COLORS = {
  FIRE:'#FF5722', WATER:'#2196F3', GRASS:'#4CAF50', ELECTRIC:'#FDD835',
  ICE:'#4FC3F7', GROUND:'#8D6E63', PSYCHIC:'#EC407A', GHOST:'#7E57C2',
  DRAGON:'#5C6BC0', FIGHT:'#D84315', POISON:'#AB47BC', NORMAL:'#9E9E9E',
  FLYING:'#81D4FA', BUG:'#8BC34A', ROCK:'#A1887F', DARK:'#616161',
  STEEL:'#90A4AE', FAIRY:'#F48FB1', HEAL:'#66BB6A', GOD:'#FFD600',
};
