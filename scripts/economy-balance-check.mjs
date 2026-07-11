import assert from 'node:assert/strict';
import {
  ACCESSORY_DB, BALLS, BERRIES, CURSED_ITEMS, EVO_STONES, GROWTH_ITEMS, MEDICINES, MISC_ITEMS, TMS,
} from '../src/data/items.js';
import { EXPEDITION_ZONES } from '../src/data/expedition.js';
import { TRAINING_TIERS } from '../src/data/training.js';
import { CAFE_DRINKS, DRINK_LOOT_TABLES } from '../src/data/lycoris.js';
import { WHEEL_FREE_SPINS_PER_DAY, WHEEL_PAID_SPIN_COST, WHEEL_PITY_INTERVAL } from '../src/data/constants.js';

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
};

console.log('\n=== 基础经济与时间收益检查 ===\n');

check('所有公开售卖物品都有有限正价格，隐藏物品不会以负价进入商店', () => {
  const groups = [
    ...Object.values(BALLS), ...Object.values(MEDICINES), ...Object.values(BERRIES),
    ...Object.values(EVO_STONES), ...Object.values(MISC_ITEMS), ...Object.values(CURSED_ITEMS),
    ...TMS, ...GROWTH_ITEMS, ...ACCESSORY_DB,
  ];
  groups.forEach(item => {
    assert.ok(Number.isFinite(item.price), `${item.id} price must be finite`);
    if (item.shopHide) assert.ok(item.price <= 0, `${item.id} hidden price should not be purchasable`);
    else assert.ok(item.price > 0, `${item.id} public price must be positive`);
  });
});

check('基础捕获球按强度递增定价，特化球没有低于基础球形成无条件替代', () => {
  assert.ok(BALLS.poke.price < BALLS.great.price);
  assert.ok(BALLS.great.price < BALLS.ultra.price);
  ['net', 'dusk', 'quick', 'timer'].forEach(id => assert.ok(BALLS[id].price >= BALLS.great.price));
});

check('轮盘非保底直接金币期望低于付费成本，且每日付费敞口受控', () => {
  const weightedGold = 500 * 25 + 2000 * 15 + 8000 * 5 + 3000 * 4;
  const totalWeight = 25 + 15 + 5 + 18 + 14 + 12 + 6 + 5 + 4;
  const directGoldEv = weightedGold / totalWeight;
  assert.ok(directGoldEv < WHEEL_PAID_SPIN_COST);
  assert.ok(WHEEL_FREE_SPINS_PER_DAY >= 1 && WHEEL_FREE_SPINS_PER_DAY <= 3);
  assert.ok(WHEEL_PITY_INTERVAL >= 8 && WHEEL_PITY_INTERVAL <= 20);
  assert.ok((WHEEL_FREE_SPINS_PER_DAY - 1) * WHEEL_PAID_SPIN_COST <= 2500);
});

check('咖啡厅一星配方的商店等价回报接近领取价格，不是无门槛套利源', () => {
  const drink = CAFE_DRINKS.find(entry => entry.tier === 1);
  const loot = DRINK_LOOT_TABLES[1];
  const valueOf = entry => {
    if (entry.type === 'ball') return (BALLS[entry.id]?.price || 0) * entry.count;
    if (entry.type === 'med') return (MEDICINES[entry.id]?.price || 0) * entry.count;
    if (entry.type === 'berry') return BERRIES.oran.price * entry.count;
    return 0;
  };
  const totalWeight = loot.reduce((sum, entry) => sum + entry.weight, 0);
  const expectedValue = loot.reduce((sum, entry) => sum + valueOf(entry) * entry.weight, 0) / totalWeight;
  assert.ok(expectedValue >= drink.price * 0.75 && expectedValue <= drink.price * 1.25);
});

check('训练档位用更高金币成本交换时间效率，单点EV成本保持有限', () => {
  let previousDuration = 0;
  let previousCost = 0;
  TRAINING_TIERS.forEach(tier => {
    const averageGain = (tier.gain[0] + tier.gain[1]) / 2;
    assert.ok(tier.duration > previousDuration);
    assert.ok(tier.cost > previousCost);
    assert.ok(tier.cost / averageGain >= 80 && tier.cost / averageGain <= 250);
    assert.ok(averageGain / (tier.duration / 60000) >= 0.35);
    previousDuration = tier.duration;
    previousCost = tier.cost;
  });
});

check('远征直接金币收益维持在每分钟100至350金币且随区域时间受限', () => {
  EXPEDITION_ZONES.forEach(zone => {
    const totalWeight = zone.rewards.reduce((sum, reward) => sum + Math.max(0, reward.weight || 0), 0);
    assert.ok(totalWeight > 0);
    const goldPerRoll = zone.rewards.reduce((sum, reward) => {
      if (reward.type !== 'gold') return sum;
      return sum + (((reward.min || 0) + (reward.max || 0)) / 2) * reward.weight / totalWeight;
    }, 0);
    const expectedGoldPerMinute = goldPerRoll * 1.5 / (zone.duration / 60000);
    assert.ok(expectedGoldPerMinute >= 100 && expectedGoldPerMinute <= 350, `${zone.id}: ${expectedGoldPerMinute}`);
  });
});

console.log(`\n基础经济检查全部通过：${passed} 项\n`);
