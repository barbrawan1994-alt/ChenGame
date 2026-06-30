/** 灵兽标签系统 — 用于副本限制、联携与生态互动 */

export const PET_TAG_DEFS = {
  small: { id: 'small', name: '小型', icon: '🐭', desc: '体型娇小，闪避高但易被击飞' },
  large: { id: 'large', name: '巨型', icon: '🦣', desc: '体型庞大，窄道无法通过' },
  flying: { id: 'flying', name: '飞行', icon: '🦅', desc: '可飞越障碍，风暴区消耗增加' },
  aquatic: { id: 'aquatic', name: '水栖', icon: '🐟', desc: '水下行动自如' },
  nocturnal: { id: 'nocturnal', name: '夜行', icon: '🌙', desc: '夜晚能力增强' },
  mechanical: { id: 'mechanical', name: '机械', icon: '🤖', desc: '受电磁影响，机械塔中可能过载' },
  plant: { id: 'plant', name: '植物', icon: '🌱', desc: '与植被生态强关联' },
  beast: { id: 'beast', name: '兽类', icon: '🐾', desc: '兽群联携加成' },
  spirit: { id: 'spirit', name: '灵体', icon: '👻', desc: '幽影区域不触发陷阱' },
  swarm: { id: 'swarm', name: '群居', icon: '🐝', desc: '群巢副本联携增强' },
  solitary: { id: 'solitary', name: '独行', icon: '🐺', desc: '独行狩猎，不受群居干扰' },
};

const TYPE_TAG_MAP = {
  FLYING: ['flying'],
  WATER: ['aquatic'],
  ICE: ['aquatic'],
  GHOST: ['spirit', 'nocturnal'],
  DARK: ['nocturnal'],
  GRASS: ['plant'],
  BUG: ['swarm', 'small'],
  STEEL: ['mechanical'],
  ELECTRIC: ['mechanical'],
  FAIRY: ['spirit'],
  PSYCHIC: ['spirit'],
  DRAGON: ['large'],
  ROCK: ['large'],
  GROUND: ['large'],
  NORMAL: ['beast'],
  FIGHT: ['beast'],
};

const LARGE_NAMES = /巨|王|霸|神|龙|象|鲸|泰坦|主|魔/;
const SMALL_NAMES = /苗|幼|小|崽|球|灵|鼠|雀|蝶|萤/;

export function inferPetTags(pet) {
  if (!pet) return [];
  const tags = new Set(pet.tags || []);
  const types = [pet.type, pet.secondaryType, pet.type2].filter(Boolean);
  types.forEach(t => (TYPE_TAG_MAP[t] || []).forEach(tag => tags.add(tag)));
  const name = pet.name || '';
  if (LARGE_NAMES.test(name)) tags.add('large');
  if (SMALL_NAMES.test(name)) tags.add('small');
  if (tags.has('large')) tags.delete('small');
  if (!tags.has('swarm') && !tags.has('solitary')) tags.add('beast');
  return [...tags];
}

export const TAG_RESTRICTIONS = {
  narrow_cave: { blocked: ['large'], hint: '巨型灵兽无法进入窄洞' },
  underwater_ruins: { penalized: ['aquatic'], bonus: ['aquatic'], maladaptSpd: 0.7, hint: '非水栖灵兽水下行动变慢' },
  shadow_castle: { bonus: ['spirit'], trapImmune: ['spirit'], hint: '灵体灵兽不触发幽影陷阱' },
  swarm_nest: { bonus: ['swarm'], swarmMult: 1.25, hint: '群居灵兽联携效果增强' },
  mechanical_tower: { risk: ['mechanical'], overloadChance: 0.1, hint: '雷系技能可能过载机械机关' },
};

export function checkTagRestriction(party, restrictionId) {
  const rule = TAG_RESTRICTIONS[restrictionId];
  if (!rule) return { allowed: true };
  const validParty = (party || []).filter(p => p && p.currentHp > 0);
  const blocked = validParty.filter(p => {
    const tags = inferPetTags(p);
    return rule.blocked?.some(t => tags.includes(t));
  });
  if (blocked.length > 0 && blocked.length >= Math.ceil(validParty.length * 0.5)) {
    return { allowed: false, reason: `${rule.hint}（队伍中大多数不满足条件）`, blockedPets: blocked };
  }
  return { allowed: true, rule, hasBlockedPets: blocked.length > 0 };
}

export function getTagBonusMult(pet, restrictionId) {
  const rule = TAG_RESTRICTIONS[restrictionId];
  if (!rule?.bonus) return 1;
  const tags = inferPetTags(pet);
  return rule.bonus.some(t => tags.includes(t)) ? (rule.swarmMult || 1.1) : 1;
}
