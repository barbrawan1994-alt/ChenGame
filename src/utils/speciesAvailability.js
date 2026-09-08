export function getExpeditionEggPool(pokedex,maps,legendRules,zone,level) {
  const special=new Set(legendRules.map(rule=>rule.petId));
  const evolved=new Set(pokedex.map(pet=>pet.evo).filter(Boolean));
  const habitats=new Set(maps.filter(map=>Array.isArray(map.lvl) && map.lvl[0]<=level).flatMap(map=>map.pool || []));
  const pool=pokedex.filter(pet=>habitats.has(pet.id) && !evolved.has(pet.id) && !pet.hidden && !special.has(pet.id) && pet.acquisition!=='trial');
  const flavored=pool.filter(pet=>zone.bonusTypes.includes('ALL') || [pet.type,pet.type2,pet.secondaryType].some(type=>zone.bonusTypes.includes(type)));
  return flavored.length ? flavored : pool;
}
