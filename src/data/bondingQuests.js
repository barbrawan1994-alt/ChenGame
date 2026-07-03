/** 精灵结契 — 非战斗追踪与信任建立 */

import { inferPetTags } from './petTags';

export const BONDING_STEP_TYPES = {
  track: { label: '感知追踪', icon: '👣' },
  observe: { label: '不惊扰观察', icon: '👁️' },
  feed: { label: '投喂', icon: '🍎' },
  soothe: { label: '安抚', icon: '🤝' },
  rescue: { label: '救助', icon: '💊' },
  puzzle: { label: '解谜', icon: '🧩' },
  bond: { label: '结契', icon: '💫' },
};

export const WILD_PET_STATES = {
  alert: { name: '警惕', icon: '⚠️', hint: '慢慢靠近、隐藏气息、投喂' },
  angry: { name: '愤怒', icon: '😤', hint: '战斗压制或安抚解除原因' },
  injured: { name: '受伤', icon: '🩹', hint: '治疗、包扎、护送' },
  hungry: { name: '饥饿', icon: '🍽️', hint: '寻找食物、制作精灵食' },
  guard: { name: '守护', icon: '🛡️', hint: '不可靠近巢穴，需取得信任' },
  curious: { name: '好奇', icon: '👀', hint: '用玩具、音乐或同类吸引' },
  lost: { name: '迷路', icon: '🧭', hint: '追踪路线，带回族群' },
  polluted: { name: '被污染', icon: '☠️', hint: '净化、战斗、封印' },
  sleep: { name: '睡眠', icon: '💤', hint: '观察习性，不能惊扰' },
  breeding: { name: '繁殖季', icon: '🥚', hint: '特殊观察、保护幼体' },
};

export const BONDING_QUESTS = [
  {
    id: 'bond_mist_deer',
    name: '雾鹿灵结契',
    icon: '🦌',
    mapId: 4,
    reqBadges: 3,
    petId: 901,
    petName: '雾鹿灵',
    types: ['WATER', 'PSYCHIC'],
    summary: '胆小的水/灵属性精灵，需在雾月湖边完成追踪与安抚才能结契。',
    reqTags: ['small'],
    avoidTypes: ['FIRE'],
    steps: [
      { type: 'track', title: '发光蹄印', text: '在雾月湖边发现发光蹄印，感知型精灵可追踪方向。', reqTags: ['beast', 'small'] },
      { type: 'observe', title: '湖边饮水', text: '雾鹿灵在饮水，不能带火系精灵靠太近。', avoidTypes: ['FIRE'] },
      { type: 'feed', title: '月露果', text: '投喂月露果建立初步信任。', reqTypes: ['GRASS', 'FAIRY'] },
      { type: 'soothe', title: '安抚气息', text: '温和性格精灵释放安抚，驱散暗影虫威胁。', reqTypes: ['FAIRY', 'NORMAL'] },
      { type: 'bond', title: '迷雾小径', text: '跟随雾鹿灵穿过迷雾，完成结契。', rewardIntimacy: 80 },
    ],
    reward: { title: '雾鹿之友', gold: 3000 },
    ecology: { water: 10, spirit: 15, stability: 10 },
  },
  {
    id: 'bond_mist_spirit',
    name: '雾隐幼灵',
    icon: '🌫️',
    mapId: 2,
    reqBadges: 6,
    requiresUnlock: 'bond_mist_spirit',
    petId: 902,
    petName: '雾隐幼灵',
    types: ['GHOST', 'FAIRY'],
    summary: '鬼雾山事件后，被保护的幼体精灵愿意与御灵谷路线精灵师结契。',
    steps: [
      { type: 'observe', title: '幼体踪迹', text: '在雾隐村后山发现幼体留下的光痕，需不惊扰观察。', reqTypes: ['FAIRY', 'PSYCHIC'] },
      { type: 'soothe', title: '驱散余雾', text: '光系/水系精灵稳定鬼血残留，建立信任。', reqTypes: ['FAIRY', 'WATER'] },
      { type: 'puzzle', title: '光源小径', text: '布置光源引路，穿过鬼雾残留区。', reqTypes: ['FAIRY', 'LIGHT'] },
      { type: 'bond', title: '雾中结契', text: '幼体认可你的安抚，完成结契。', rewardIntimacy: 75 },
    ],
    reward: { title: '雾隐之友', gold: 4500 },
    ecology: { spirit: 12, stability: 10, pollution: -8 },
  },
  {
    id: 'bond_calamity_spirit',
    name: '灾厄幼灵',
    icon: '🔥',
    mapId: 3,
    reqBadges: 9,
    requiresUnlock: 'bond_calamity_spirit',
    petId: 903,
    petName: '灾厄幼灵',
    types: ['FIRE', 'PSYCHIC'],
    summary: '忍界封印战后，被削弱的灾厄幼体愿意与精灵师结契，成为特殊守护伙伴。',
    steps: [
      { type: 'observe', title: '核心残光', text: '封印核心室残留微弱查克拉光痕，需感知型精灵追踪。', reqTypes: ['PSYCHIC', 'FAIRY'] },
      { type: 'soothe', title: '稳定暴走', text: '光系/水系精灵稳定残余能量，建立初步信任。', reqTypes: ['FAIRY', 'WATER'] },
      { type: 'puzzle', title: '封印共鸣', text: '按查克拉节点顺序激活，打开结契通道。', reqTypes: ['PSYCHIC', 'FIRE'] },
      { type: 'bond', title: '灾厄结契', text: '幼体认可你的封印之道，完成结契。', rewardIntimacy: 80 },
    ],
    reward: { title: '灾厄之友', gold: 6000 },
    ecology: { spirit: 15, stability: 12 },
  },
  {
    id: 'bond_rock_rhino',
    name: '岩甲犀族群',
    icon: '🦏',
    mapId: 5,
    reqBadges: 5,
    requiresUnlock: 'bond_rock_rhino',
    petId: 904,
    petName: '岩甲犀',
    types: ['GROUND', 'ROCK'],
    summary: '矿场破坏了岩甲犀巢穴，修复裂缝后可与族群建立友好关系。',
    steps: [
      { type: 'track', title: '巢穴裂缝', text: '调查矿场下方，发现岩甲犀巢穴被挖穿。', reqTypes: ['GROUND', 'ROCK'] },
      { type: 'puzzle', title: '修复洞穴', text: '土系精灵修复裂缝，降低族群愤怒。', reqTypes: ['GROUND', 'ROCK'] },
      { type: 'soothe', title: '安抚头领', text: '打掉痛苦结晶后安抚暴走头领。', reqTypes: ['FAIRY', 'NORMAL'] },
      { type: 'bond', title: '族群认可', text: '岩甲犀族群停止攻击矿场，愿意与精灵师结契。', rewardIntimacy: 60 },
    ],
    reward: { title: '岩甲犀之友', gold: 5000 },
    ecology: { stability: 20, pollution: -10 },
  },
  {
    id: 'bond_moon_flower',
    name: '月萤花灵',
    icon: '🌸',
    mapId: 1,
    reqBadges: 4,
    petId: 761,
    petName: '月萤花灵',
    types: ['GRASS', 'FAIRY'],
    summary: '满月夜出现在青藤林深处的隐藏守护精灵，需完成生态恢复后才会现身。',
    reqEcology: { vegetation: 60, pollution: 35 },
    steps: [
      { type: 'observe', title: '满月花海', text: '满月夜观察发光花海中的精灵身影。', reqTypes: ['GRASS', 'FAIRY'] },
      { type: 'puzzle', title: '古树之门', text: '用光系净化黑斑，木系催生新芽打开古树门。', reqTypes: ['FAIRY', 'GRASS'] },
      { type: 'rescue', title: '保护幼体', text: '保护月萤花灵幼体免受暗系精灵伏击。', reqTypes: ['FAIRY', 'FIRE'] },
      { type: 'bond', title: '守护觉醒', text: '月萤花灵认可你的生态修复，完成结契。', rewardIntimacy: 100 },
    ],
    reward: { title: '月萤守护者', gold: 8000 },
    ecology: { vegetation: 15, spirit: 20 },
  },
  {
    id: 'bond_sleep_mushroom',
    name: '月斑眠菇',
    icon: '🍄',
    mapId: 1,
    reqBadges: 2,
    petId: 755,
    petName: '月斑眠菇',
    types: ['GRASS', 'FAIRY'],
    summary: '眠菇兽大迁徙事件中出现的稀有变异种，需温和护送完成结契。',
    steps: [
      { type: 'observe', title: '迁徙队伍', text: '不惊扰眠菇兽迁徙队伍，观察月斑个体。', avoidTypes: ['FIRE'] },
      { type: 'soothe', title: '驱散暗影', text: '光系/风系精灵驱散伏击暗影。', reqTypes: ['FAIRY', 'FLYING'] },
      { type: 'bond', title: '月光草地', text: '护送月斑眠菇到达月光草地并完成结契。', rewardIntimacy: 70 },
    ],
    reward: { gold: 2500, item: 'great', itemCount: 5 },
    ecology: { stability: 15, diversity: 10 },
  },
];

export function getBondingQuestById(id) {
  return BONDING_QUESTS.find(q => q.id === id);
}

export function getBondingQuestsForMap(mapId, badges = 0, cleared = [], ecology = null, crisisUnlocks = []) {
  return BONDING_QUESTS.filter(q => {
    if (q.mapId !== mapId || badges < (q.reqBadges || 0) || cleared.includes(q.id)) return false;
    if (q.requiresUnlock && !crisisUnlocks.includes(q.requiresUnlock)) return false;
    if (ecology && !checkBondingEcology(q, ecology)) return false;
    return true;
  });
}

export function getStepHints(step) {
  const hints = [];
  if (step.avoidTypes?.length) hints.push(`⚠️ 不能携带 ${step.avoidTypes.join('/')} 系`);
  if (step.reqTypes?.length) hints.push(`✓ 需要 ${step.reqTypes.join('/')} 系精灵`);
  if (step.reqTags?.length) hints.push(`✓ 需要 ${step.reqTags.join('/')} 标签精灵`);
  return hints;
}

export function checkBondingStepRequirements(step, party) {
  const pets = party || [];
  if (step.avoidTypes?.length) {
    const hasAvoid = pets.some(p => {
      const types = [p.type, p.secondaryType, p.type2].filter(Boolean);
      return step.avoidTypes.some(t => types.includes(t));
    });
    if (hasAvoid) return { ok: false, reason: `队伍中不能有 ${step.avoidTypes.join('/')} 系精灵` };
  }
  if (step.reqTypes?.length) {
    const hasType = pets.some(p => {
      const types = [p.type, p.secondaryType, p.type2].filter(Boolean);
      return step.reqTypes.some(t => types.includes(t));
    });
    if (!hasType) return { ok: false, reason: `需要 ${step.reqTypes.join('/')} 系精灵` };
  }
  if (step.reqTags?.length) {
    const hasTag = pets.some(p => inferPetTags(p).some(t => step.reqTags.includes(t)));
    if (!hasTag) return { ok: false, reason: `需要带有 ${step.reqTags.join('/')} 标签的精灵` };
  }
  return { ok: true };
}

export function checkBondingEcology(quest, ecology) {
  if (!quest?.reqEcology) return true;
  return Object.entries(quest.reqEcology).every(([k, v]) => {
    const val = ecology?.[k] ?? 50;
    if (k === 'pollution') return val <= v;
    return val >= v;
  });
}
