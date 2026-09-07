export function buildCampaignParty(campaign, createPet, random = Math.random) {
  const teamSize = Math.max(1, Math.min(6, Math.floor(campaign.teamSize || 6)));
  const bossId = campaign.boss || 1;
  const bossLevel = campaign.bossLvl || 30;
  const pool = campaign.pool?.length ? campaign.pool : [bossId];
  return Array.from({ length: teamSize }, (_, index) => {
    const isBoss = index === teamSize - 1;
    const id = isBoss ? bossId : pool[Math.floor(random() * pool.length)];
    const level = isBoss ? bossLevel : Math.max(campaign.lvl || bossLevel - 15, bossLevel - Math.floor(random() * 10));
    return createPet(id, level, true, isBoss);
  });
}
