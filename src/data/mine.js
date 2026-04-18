export const MINE_ORES = {
  copper:   { id: 'copper',   name: '铜矿',     icon: '🟤', color: '#CD7F32', tier: 1 },
  silver:   { id: 'silver',   name: '银矿',     icon: '⬜', color: '#C0C0C0', tier: 2 },
  gold_ore: { id: 'gold_ore', name: '金矿',     icon: '🟡', color: '#FFD700', tier: 3 },
  jade:     { id: 'jade',     name: '翡翠',     icon: '💚', color: '#00C853', tier: 4 },
  stardust: { id: 'stardust', name: '星辰碎片', icon: '⭐', color: '#7C4DFF', tier: 5 },
};

export const MINE_TILES = {
  empty:    { id: 'empty',    name: '空地',   icon: '💨', weight: 25 },
  copper:   { id: 'copper',   name: '铜矿',   icon: '🟤', weight: 30 },
  silver:   { id: 'silver',   name: '银矿',   icon: '⬜', weight: 18 },
  gold_ore: { id: 'gold_ore', name: '金矿',   icon: '🟡', weight: 8 },
  jade:     { id: 'jade',     name: '翡翠',   icon: '💚', weight: 4 },
  stardust: { id: 'stardust', name: '星辰碎片', icon: '⭐', weight: 2 },
  trap_rock:{ id: 'trap_rock', name: '碎石陷阱', icon: '🪨', weight: 8, penalty: { energyCost: 2, desc: '落石砸中！额外消耗2点体力' } },
  trap_gas: { id: 'trap_gas', name: '毒气陷阱', icon: '☠️', weight: 3, penalty: { energyCost: 3, desc: '毒气弥漫！额外消耗3点体力' } },
  chest:    { id: 'chest',    name: '宝箱',   icon: '🎁', weight: 2 },
};

export const MINE_EXCHANGE = [
  { id: 'copper_gold',    cost: { copper: 10 },              reward: { type: 'gold', amount: 1000 }, desc: '铜矿 x10 → 1000 金币' },
  { id: 'copper_potion',  cost: { copper: 5 },               reward: { type: 'item', id: 'potion', amount: 3 }, desc: '铜矿 x5 → 回复药 x3' },
  { id: 'silver_candy',   cost: { silver: 5 },               reward: { type: 'item', id: 'exp_candy', amount: 1 }, desc: '银矿 x5 → 经验糖果' },
  { id: 'silver_gold',    cost: { silver: 3 },               reward: { type: 'gold', amount: 3000 }, desc: '银矿 x3 → 3000 金币' },
  { id: 'gold_stone',     cost: { gold_ore: 3 },             reward: { type: 'evo_stone', amount: 1 }, desc: '金矿 x3 → 随机进化石' },
  { id: 'gold_tm',        cost: { gold_ore: 5 },             reward: { type: 'tm', amount: 1 }, desc: '金矿 x5 → 随机技能书' },
  { id: 'jade_acc',       cost: { jade: 2 },                 reward: { type: 'accessory', amount: 1 }, desc: '翡翠 x2 → 随机饰品' },
  { id: 'jade_energy',    cost: { jade: 1 },                 reward: { type: 'energy', amount: 10 }, desc: '翡翠 x1 → 恢复10点体力' },
  { id: 'star_legacy',    cost: { stardust: 1 },             reward: { type: 'legacy_stone', amount: 1 }, desc: '星辰碎片 x1 → 传承石' },
  { id: 'star_rebirth',   cost: { stardust: 2 },             reward: { type: 'item', id: 'rebirth_pill', amount: 1 }, desc: '星辰碎片 x2 → 洗练药' },
  { id: 'mixed_ticket',   cost: { copper: 5, silver: 3 },    reward: { type: 'arena_ticket', amount: 2 }, desc: '铜矿x5+银矿x3 → 竞技票 x2' },
];

export const MINE_GRID_SIZE = 6;
export const MINE_MAX_ENERGY = 25;
export const MINE_REGEN_INTERVAL = 8 * 60 * 1000;
export const MINE_REQ_BADGES = 2;

export const DEFAULT_MINE_STATE = {
  energy: 25,
  maxEnergy: 25,
  lastRegenTime: Date.now(),
  depth: 0,
  grid: null,
  revealed: [],
  minerals: { copper: 0, silver: 0, gold_ore: 0, jade: 0, stardust: 0 },
  totalMined: 0,
  legacyStones: 0,
};

export const MINE_DEPTH_MILESTONES = [
  { depth: 5,  reward: { type: 'gold', amount: 2000 }, desc: '🏆 5层里程碑：2000金币' },
  { depth: 10, reward: { type: 'mineral', id: 'jade', amount: 1 }, desc: '🏆 10层里程碑：翡翠 x1' },
  { depth: 20, reward: { type: 'mineral', id: 'stardust', amount: 1 }, desc: '🏆 20层里程碑：星辰碎片 x1' },
  { depth: 30, reward: { type: 'accessory', amount: 1 }, desc: '🏆 30层里程碑：随机饰品' },
  { depth: 50, reward: { type: 'legacy_stone', amount: 2 }, desc: '🏆 50层里程碑：传承石 x2' },
];

export function generateMineGrid(depth) {
  const size = MINE_GRID_SIZE;
  const tiles = Object.values(MINE_TILES);
  const depthBonus = Math.min(depth, 10);
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const adjusted = tiles.map(t => {
        let w = t.weight;
        if (['gold_ore', 'jade', 'stardust', 'chest'].includes(t.id)) w += depthBonus * 0.5;
        if (['trap_rock', 'trap_gas'].includes(t.id)) w += depthBonus * 0.3;
        if (t.id === 'empty') w = Math.max(5, w - depthBonus);
        return { ...t, w };
      });
      const totalW = adjusted.reduce((s, x) => s + x.w, 0);
      let roll = Math.random() * totalW;
      let picked = adjusted[0];
      for (const t of adjusted) {
        roll -= t.w;
        if (roll <= 0) { picked = t; break; }
      }
      row.push(picked.id);
    }
    grid.push(row);
  }
  return grid;
}
