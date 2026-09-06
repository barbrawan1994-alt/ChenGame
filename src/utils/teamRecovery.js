// Bounded healing plan: maximize recovery, then minimize consumed item value.
export const planTeamRecovery = (party, inventory, medicines, getStats) => {
  const meds = { ...(inventory.meds || {}) };
  const used = {};
  let recoveredHp = 0;
  let healedPets = 0;
  let faintedPets = 0;
  const options = Object.values(medicines).filter(item =>
    item.type === 'HP' && Number.isFinite(item.val) && item.val > 0 &&
    Number.isFinite(item.price) && item.price > 0);

  const nextParty = party.map(pet => {
    if (pet.currentHp <= 0) { faintedPets += 1; return pet; }
    const maxHp = getStats(pet).maxHp;
    const need = Math.ceil(maxHp - pet.currentHp);
    if (!Number.isFinite(need) || need <= 0) return pet;
    const plans = new Array(need + 1);
    plans[0] = { cost: 0, count: 0, items: {} };
    for (const item of options) {
      let available = Math.min(Math.max(0, Math.floor(Number(meds[item.id]) || 0)), Math.ceil(need / item.val));
      // Binary groups keep large inventories from multiplying the search cost.
      for (let group = 1; available > 0; group *= 2) {
        const count = Math.min(group, available);
        available -= count;
        for (let hp = need - 1; hp >= 0; hp -= 1) {
          const plan = plans[hp];
          if (!plan) continue;
          const target = Math.min(need, hp + item.val * count);
          const cost = plan.cost + item.price * count;
          const bottles = plan.count + count;
          const previous = plans[target];
          if (previous && (previous.cost < cost || (previous.cost === cost && previous.count <= bottles))) continue;
          plans[target] = { cost, count: bottles, items: { ...plan.items, [item.id]: (plan.items[item.id] || 0) + count } };
        }
      }
    }
    let recovery = need;
    while (recovery > 0 && !plans[recovery]) recovery -= 1;
    if (!recovery) return pet;
    const plan = plans[recovery];
    Object.entries(plan.items).forEach(([id, count]) => {
      meds[id] = Math.max(0, Number(meds[id]) - count);
      used[id] = (used[id] || 0) + count;
    });
    recoveredHp += Math.min(maxHp - pet.currentHp, recovery);
    healedPets += 1;
    return { ...pet, currentHp: Math.min(maxHp, pet.currentHp + recovery), intimacy: Math.min(255, (pet.intimacy || 0) + plan.count) };
  });
  return { party: nextParty, inventory: { ...inventory, meds }, used, recoveredHp, healedPets, faintedPets };
};
