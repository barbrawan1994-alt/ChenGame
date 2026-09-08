import React from 'react';
import { AFFECTION_STAGES } from '../../data/marriage';
import { CAFE_BUILDING } from '../../data/lycoris';
import { CAFE_DRINKS } from '../../data/lycoris';
import { calcBrewTimeMs } from '../../data/lycoris';
import { calcHouseScore } from '../../data/housing';
import { calcResidentBenefits } from '../../data/housing';
import { checkSynergyMatch } from '../../data';
import { DAILY_DATE_LIMIT } from '../../data/marriage';
import { DAILY_GIFT_LIMIT } from '../../data/marriage';
import { DATE_COST } from '../../data/marriage';
import { DRINK_MIN_WORKER_STATS } from '../../data/lycoris';
import { EVO_STONES } from '../../data/items';
import { flushSync } from 'react-dom';
import { FURNITURE_DB } from '../../data/housing';
import { FURNITURE_QUALITY } from '../../data/housing';
import { FURNITURE_SETS } from '../../data/housing';
import { GARDEN_PLANTS } from '../../data/housing';
import { getAffectionStage } from '../../data/marriage';
import { getCafeLevel } from '../../data/lycoris';
import { getGardenSlots } from '../../data/housing';
import { getHousingScoreTier } from '../../data/housing';
import { getMarriageLevel } from '../../data/marriage';
import { getSanctuaryUpgradeCost } from '../../data';
import { getSpouseBonus } from '../../data/marriage';
import { GROWTH_ITEMS } from '../../data/items';
import { HOUSE_TYPES } from '../../data/housing';
import { MARRIAGE_CANDIDATES } from '../../data/marriage';
import { POKEDEX } from '../../data/pets';
import { PROPOSE_COST } from '../../data/marriage';
import { rollQuality } from '../../data/housing';
import { SANCTUARY_FACILITIES } from '../../data';
import { SANCTUARY_SYNERGY } from '../../data';
import { SEED_DROP_TABLE } from '../../data/housing';
import { TREASURE_COLLECTIONS } from '../../data/housing';
import { WEDDING_COST } from '../../data/marriage';
import { WEDDING_DIALOGUE } from '../../data/marriage';

export default function HousingScreen({
  addBerries,
  advanceBounty,
  advanceWedding,
  assignCafeWorker,
  box,
  boxRef,
  buyCafe,
  cafe,
  cancelBrewing,
  cancelPropose,
  checkTreasureUnlock,
  claimBrewedDrink,
  claimSpouseGift,
  dateEvent,
  getAvailableCandidates,
  getDrinkDailyUsed,
  getGiftableItems,
  getLocalDateStr,
  getQuestProgress,
  getSpouseBonuses,
  getWorkerStatTotal,
  gold,
  goldRef,
  handleChat,
  handleDate,
  handleDateChoice,
  handleDivorce,
  handleGift,
  handlePropose,
  handleWedding,
  housing,
  housingActionLocksRef,
  housingRef,
  housingTab,
  isDrinkUnlocked,
  isLycorisStoryCompleted,
  marriage,
  marriageRef,
  marriageView,
  party,
  partyRef,
  renderAvatar,
  safeBack,
  sanctuaryState,
  setConfirmModal,
  setGold,
  setHousing,
  setHousingTab,
  setInventory,
  setMarriageView,
  setPetPicker,
  setSanctuaryState,
  setView,
  showMapToast,
  startBrewing,
  updateAchStat,
  updateQuestProgress,
  upgradeSanctuaryFacility,
  weddingScene
}) {
    const currentHouseDef = HOUSE_TYPES.find(h => h.id === housing.currentHouse);
    const nextHouseIdx = currentHouseDef ? HOUSE_TYPES.indexOf(currentHouseDef) + 1 : 0;
    const nextHouseDef = HOUSE_TYPES[nextHouseIdx] || null;
    const placedFurniture = (housing.furniture || []).filter(f => f.placed);
    const unplacedFurniture = (housing.furniture || []).filter(f => !f.placed);
    const benefits = calcResidentBenefits(placedFurniture);
    const furnitureScore = calcHouseScore(placedFurniture, getSpouseBonuses().homeScore || 0);
    const treasureScore = (housing.treasures || []).reduce((s, tid) => {
      for (const col of TREASURE_COLLECTIONS) {
        const item = col.items.find(i => i.id === tid);
        if (item) { s += item.score; break; }
      }
      return s;
    }, 0);
    const treasureSetBonus = TREASURE_COLLECTIONS.reduce((s, col) => {
      const allCollected = col.items.every(it => (housing.treasures || []).includes(it.id));
      return s + (allCollected ? col.setBonus.score : 0);
    }, 0);
    const score = furnitureScore + treasureScore + treasureSetBonus;
    const tier = getHousingScoreTier(score);
    const residentCount = (housing.residents || []).filter(Boolean).length;
    const gardenUsed = (housing.garden?.plots || []).length;
    const gardenMax = getGardenSlots(housing.currentHouse);

    const completedSets = FURNITURE_SETS.filter(set =>
      set.items.every(itemId => placedFurniture.some(f => f.baseId === itemId))
    );

    const buyHouse = (houseDef) => {
      if (gold < houseDef.price) { showMapToast('💰', '金币不足', `需要 ${houseDef.price} 金币`, 1500); return; }
      setConfirmModal({ title:'🏠 购房确认', msg:`购买 ${houseDef.icon} ${houseDef.name}？\n价格: ${houseDef.price} 金币\n精灵槽: ${houseDef.slots} | 家具槽: ${houseDef.furnitureSlots}`, onOk: () => { _doBuyHouse(houseDef); } }); return;
    };
    const _doBuyHouse = (houseDef) => {
      const lockKey = 'house-buy';
      if (housingActionLocksRef.current.has(lockKey)) return;
      housingActionLocksRef.current.add(lockKey);
      try {
        const validHouse = HOUSE_TYPES.find(entry => entry.id === houseDef?.id);
        if (!validHouse) return;
        const currentHousing = housingRef.current || housing;
        if (currentHousing.currentHouse === validHouse.id) { showMapToast('ℹ️', '提示', '已经住在这座住宅中', 1500); return; }
        if (validHouse.requireMarriage && !(marriageRef.current || marriage).spouse) { showMapToast('🔒', '未解锁', '结婚后才能购买这座主题住宅', 1800); return; }
        if (goldRef.current < validHouse.price) { showMapToast('💰', '金币不足', `需要 ${validHouse.price} 金币`, 1500); return; }
        const residents = (currentHousing.residents || []).slice(0, validHouse.slots);
        while (residents.length < validHouse.slots) residents.push(null);
        const nextHousing = { ...currentHousing, currentHouse: validHouse.id, residents };
        goldRef.current -= validHouse.price;
        housingRef.current = nextHousing;
        flushSync(() => { setGold(goldRef.current); setHousing(nextHousing); });
        updateAchStat({ totalGoldSpent: validHouse.price });
        showMapToast('🎉', '购买成功', `已入住 ${validHouse.name}！`, 2000);
      } finally {
        housingActionLocksRef.current.delete(lockKey);
      }
    };

    const placeFurniture = (furnitureIdx) => {
      const currentHousing = housingRef.current || housing;
      const houseDef = HOUSE_TYPES.find(entry => entry.id === currentHousing.currentHouse);
      if (!houseDef) { showMapToast('ℹ️', '提示', '请先购买房屋!', 2000); return; }
      const currentPlaced = (currentHousing.furniture || []).filter(item => item.placed).length;
      const item = currentHousing.furniture?.[furnitureIdx];
      if (!item || item.placed) return;
      if (currentPlaced >= houseDef.furnitureSlots) { showMapToast('❌', '提示', '家具槽已满!', 1500); return; }
      const furniture = [...currentHousing.furniture];
      furniture[furnitureIdx] = { ...item, placed: true, slotIdx: currentPlaced };
      const nextHousing = { ...currentHousing, furniture };
      housingRef.current = nextHousing;
      setHousing(nextHousing);
      try { const score = calcHouseScore(furniture.filter(entry => entry.placed), getSpouseBonuses().homeScore || 0); if (score > 0) checkTreasureUnlock('housing_score', { score }); } catch(e) { console.warn('checkTreasureUnlock error:', e); }
      const currentMarriage = marriageRef.current || marriage;
      if (currentMarriage.pendingPropose) updateQuestProgress(currentMarriage.pendingPropose, 'place_furniture', 1);
    };

    const removeFurniture = (furnitureIdx) => {
      setHousing(prev => {
        const updated = [...prev.furniture];
        updated[furnitureIdx] = { ...updated[furnitureIdx], placed: false, slotIdx: null };
        return { ...prev, furniture: updated };
      });
    };

    const assignResident = (slotIdx) => {
      if (!currentHouseDef) return;
      const currentHousing = housingRef.current || housing;
      const residentIds = new Set((currentHousing.residents || []).filter(Boolean).map(String));
      const available = [...(boxRef.current || []), ...(partyRef.current || [])].filter(p => p.currentHp > 0 && !residentIds.has(String(p.uid || p.id)));
      if (available.length === 0) { showMapToast('⚠️', '无法入住', '没有可入住的精灵', 1500); return; }
      setPetPicker({ title: '选择入住精灵', list: available, onSelect: (pet) => {
        const latestHousing = housingRef.current || housing;
        const latestHouse = HOUSE_TYPES.find(entry => entry.id === latestHousing.currentHouse);
        const uid = pet?.uid || pet?.id;
        const stillOwned = [...(partyRef.current || []), ...(boxRef.current || [])].some(entry => String(entry.uid || entry.id) === String(uid));
        const alreadyResident = (latestHousing.residents || []).some((entry, index) => index !== slotIdx && entry != null && String(entry) === String(uid));
        if (!latestHouse || slotIdx < 0 || slotIdx >= latestHouse.slots || !stillOwned || alreadyResident) {
          showMapToast('⚠️', '无法入住', '入住状态已变化，请重新选择', 1600);
          setPetPicker(null);
          return;
        }
        const newResidents = [...(latestHousing.residents || [])];
        newResidents[slotIdx] = uid;
        const nextHousing = { ...latestHousing, residents: newResidents };
        housingRef.current = nextHousing;
        setHousing(nextHousing);
        setPetPicker(null);
      }});
    };

    const removeResident = (slotIdx) => {
      setHousing(prev => {
        const newResidents = [...prev.residents];
        newResidents[slotIdx] = null;
        return { ...prev, residents: newResidents };
      });
    };

    const findPetByUid = (uid) => [...party, ...box].find(p => (p.uid || p.id) === uid);

    const plantSeed = (plantId) => {
      const lockKey = 'garden-plant';
      if (housingActionLocksRef.current.has(lockKey)) return;
      housingActionLocksRef.current.add(lockKey);
      try {
      const plant = GARDEN_PLANTS.find(p => p.id === plantId);
      if (!plant) return;
      const currentHousing = housingRef.current || housing;
      const maxSlots = getGardenSlots(currentHousing.currentHouse);
      const plots = currentHousing.garden?.plots || [];
      if (plots.length >= maxSlots) { showMapToast('❌', '提示', '花园已满！升级住宅可获得更多种植槽。', 1500); return; }
      const seedCount = (currentHousing.garden?.seedInventory || {})[plantId] || 0;
      if (seedCount <= 0 && plant.seedPrice == null) { showMapToast('🌱', '种子不足', '需要先获得这株植物的种子', 1500); return; }
      if (seedCount <= 0 && goldRef.current < plant.seedPrice) { showMapToast('💰', '金币不足', `需要 ${plant.seedPrice} 金币`, 1500); return; }
      const nextHousing = {
        ...currentHousing,
        garden: {
          ...(currentHousing.garden || { plots: [], waterLog: {} }),
          seedInventory: {
            ...(currentHousing.garden?.seedInventory || {}),
            [plantId]: seedCount > 0 ? seedCount - 1 : 0,
          },
          plots: [...plots, { plantId, plantedAt: Date.now(), adjustedGrowth: plant.growthMs }],
        },
      };
      housingRef.current = nextHousing;
      if (seedCount <= 0) goldRef.current -= plant.seedPrice;
      flushSync(() => {
        setHousing(nextHousing);
        if (seedCount <= 0) setGold(goldRef.current);
      });
      if (seedCount > 0) showMapToast('🌱', '免费种植', `使用库存种子种植 ${plant.name}`, 1500);
      else updateAchStat({ totalGoldSpent: plant.seedPrice });
      showMapToast(plant.icon || '🌱', '种植', `种下了 ${plant.name}`, 2000);
      } finally {
        housingActionLocksRef.current.delete(lockKey);
      }
    };

    const waterPlant = (plotIdx) => {
      const today = getLocalDateStr();
      const currentHousing = housingRef.current || housing;
      const plot = (currentHousing.garden?.plots || [])[plotIdx];
      const plotKey = plot ? `${plot.plantId}_${plot.plantedAt}_${today}` : `${plotIdx}_${today}`;
      if (!plot) return;
      if ((currentHousing.garden?.waterLog || {})[plotKey]) { showMapToast('ℹ️', '提示', '今天已经浇过水了！', 2000); return; }
      if (housingActionLocksRef.current.has(plotKey)) return;
      housingActionLocksRef.current.add(plotKey);
      const updatedPlot = { ...plot, adjustedGrowth: Math.floor((plot.adjustedGrowth || GARDEN_PLANTS.find(pd => pd.id === plot.plantId)?.growthMs || 60000) * 0.75) };
      const nextPlots = [...(currentHousing.garden?.plots || [])];
      nextPlots[plotIdx] = updatedPlot;
      const nextHousing = { ...currentHousing, garden: { ...(currentHousing.garden || {}), plots: nextPlots, waterLog: { ...(currentHousing.garden?.waterLog || {}), [plotKey]: true } } };
      housingRef.current = nextHousing;
      setHousing(nextHousing);
      housingActionLocksRef.current.delete(plotKey);
      showMapToast('✅', '提示', '💧 浇水成功！生长时间缩短25%', 2000);
    };

    const harvestPlant = (plotIdx) => {
      const currentHousing = housingRef.current || housing;
      const plots = currentHousing.garden?.plots || [];
      const plot = plots[plotIdx];
      if (!plot) return;
      const plantDef = GARDEN_PLANTS.find(p => p.id === plot.plantId);
      if (!plantDef) return;
      const elapsed = Date.now() - plot.plantedAt;
      if (elapsed < (plot.adjustedGrowth || plantDef.growthMs)) { showMapToast('❌', '提示', '还没有成熟！', 1500); return; }
      const lockKey = `garden-harvest:${plot.plantId}:${plot.plantedAt}`;
      if (housingActionLocksRef.current.has(lockKey)) return;
      housingActionLocksRef.current.add(lockKey);
      try {
      const remainingPlots = [...plots];
      remainingPlots.splice(plotIdx, 1);
      const consumedHousing = { ...currentHousing, garden: { ...(currentHousing.garden || {}), plots: remainingPlots } };
      housingRef.current = consumedHousing;
      flushSync(() => setHousing(consumedHousing));

      const currentMarriage = marriageRef.current || marriage;
      const spGardenYield = currentMarriage.spouse ? (getSpouseBonus(MARRIAGE_CANDIDATES.find(c => c.id === currentMarriage.spouse), (getMarriageLevel((currentMarriage.affections || {})[currentMarriage.spouse] || 0)).level).gardenYield || 0) : 0;
      const yieldMult = 1 + spGardenYield;

      let rewardMsg = '';
      if (!plantDef.harvestItem && (plantDef.category === 'flower' || plantDef.category === 'rare')) {
        const qualityBoost = getSpouseBonuses().seedQuality || 0;
        const quality = plantDef.rarity === 'LEGENDARY' ? 'LEGENDARY' : plantDef.rarity === 'EPIC' ? (qualityBoost ? 'LEGENDARY' : 'EPIC') : rollQuality('battle', plantDef.rarity === 'RARE', qualityBoost);
        const latestHousing = housingRef.current;
        const nextHousing = { ...latestHousing, furniture: [...(latestHousing.furniture || []), { baseId: 'flower_garden', quality, placed: false, slotIdx: null }] };
        housingRef.current = nextHousing;
        setHousing(nextHousing);
        rewardMsg = `${plantDef.icon} 装饰花卉 (${FURNITURE_QUALITY[quality]?.name}) · 放置后 +${calcHouseScore([{ baseId: 'flower_garden', quality }])}评分`;
      } else if (plantDef.harvestItem) {
        const hi = plantDef.harvestItem;
        const boostedCount = Math.floor((hi.count || 1) * yieldMult);
        if (hi.chance && Math.random() > hi.chance) {
          const consolation = Math.max(2, Math.floor(2 * yieldMult));
          rewardMsg = `这次没有收获到稀有材料...获得树果 x${consolation} 作为安慰`;
          setInventory(prev => ({ ...prev, berries: addBerries(prev.berries, 'oran', consolation) }));
        } else if (hi.type === 'berry') {
          setInventory(prev => ({ ...prev, berries: addBerries(prev.berries, 'oran', boostedCount) }));
          rewardMsg = `树果 x${boostedCount}`;
        } else if (hi.type === 'med') {
          setInventory(prev => ({ ...prev, meds: { ...prev.meds, [hi.id]: (prev.meds[hi.id] || 0) + boostedCount } }));
          rewardMsg = `药品 x${boostedCount}`;
        } else if (hi.type === 'stone') {
          const stoneKeys = Object.keys(EVO_STONES);
          const sid = stoneKeys[Math.floor(Math.random() * stoneKeys.length)];
          setInventory(prev => ({ ...prev, stones: { ...prev.stones, [sid]: (prev.stones[sid] || 0) + boostedCount } }));
          rewardMsg = `${EVO_STONES[sid].name} x${boostedCount}`;
        } else if (hi.type === 'misc') {
          setInventory(prev => ({ ...prev, misc: { ...prev.misc, [hi.id]: (prev.misc[hi.id] || 0) + boostedCount } }));
          rewardMsg = `${hi.id === 'rebirth_pill' ? '洗练药' : hi.id} x${boostedCount}`;
        } else if (hi.type === 'candy') {
          setInventory(prev => ({ ...prev, [hi.id]: (prev[hi.id] || 0) + boostedCount }));
          rewardMsg = `${hi.id === 'exp_candy' ? '经验糖果' : hi.id === 'max_candy' ? '极限糖果' : hi.id} x${boostedCount}`;
        } else if (hi.type === 'growth') {
          const growthPool = GROWTH_ITEMS.filter(i => i.id !== 'max_candy');
          const item = growthPool[Math.floor(Math.random() * growthPool.length)];
          setInventory(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + boostedCount }));
          rewardMsg = `${item.name} x${boostedCount}`;
        }
      }

      let bonusSeedMsg = '';
      const rarityKey = plantDef.rarity === 'LEGENDARY' ? 'RARE' : plantDef.rarity === 'EPIC' ? 'UNCOMMON' : 'COMMON';
      const seedTable = SEED_DROP_TABLE[rarityKey];
      const seedDropChance = Math.min(0.5, 0.2 * yieldMult);
      if (seedTable && Math.random() < seedDropChance) {
        const tw = seedTable.reduce((s, e) => s + e.weight, 0);
        let r = Math.random() * tw;
        let seedPlant = seedTable[0];
        for (const e of seedTable) { r -= e.weight; if (r <= 0) { seedPlant = e; break; } }
        const sp = GARDEN_PLANTS.find(p => p.id === seedPlant.plantId);
        if (sp) {
          bonusSeedMsg = `\n🌱 额外获得稀有种子: ${sp.icon} ${sp.name}！`;
          const latestHousing = housingRef.current;
          const nextHousing = {
            ...latestHousing,
            garden: {
              ...(latestHousing.garden || { plots: [], waterLog: {} }),
              seedInventory: { ...(latestHousing.garden?.seedInventory || {}), [seedPlant.plantId]: ((latestHousing.garden?.seedInventory || {})[seedPlant.plantId] || 0) + 1 },
            },
          };
          housingRef.current = nextHousing;
          setHousing(nextHousing);
        }
      }

      updateAchStat({ gardenHarvests: 1 });
      if (currentMarriage.pendingPropose) updateQuestProgress(currentMarriage.pendingPropose, 'garden_harvest', 1);
      showMapToast(plantDef.icon || '🌾', '收获', `${plantDef.name} · ${rewardMsg}${bonusSeedMsg}`, 2500);
      } finally {
        housingActionLocksRef.current.delete(lockKey);
      }
    };

    const buyFurnitureFromShop = (def) => {
      if (!def.shopPrice) return;
      if (gold < def.shopPrice) { showMapToast('💰', '金币不足', '无法购买该家具', 1500); return; }
      setConfirmModal({ title:'🛋️ 购买确认', msg:`购买 ${def.icon} ${def.name}？\n价格: ${def.shopPrice} 金币`, onOk: () => { _doBuyFurniture(def); } }); return;
    };
    const _doBuyFurniture = (def) => {
      const lockKey = 'furniture-buy';
      if (housingActionLocksRef.current.has(lockKey)) return;
      housingActionLocksRef.current.add(lockKey);
      try {
        const validDef = FURNITURE_DB.find(entry => entry.id === def?.id);
        if (!validDef?.shopPrice) return;
        if (goldRef.current < validDef.shopPrice) { showMapToast('💰', '金币不足', '无法购买该家具', 1500); return; }
        const quality = rollQuality('shop', false, getSpouseBonuses().furnitureQuality || 0);
        const currentHousing = housingRef.current || housing;
        const nextHousing = { ...currentHousing, furniture: [...(currentHousing.furniture || []), { baseId: validDef.id, quality, placed: false, slotIdx: null }] };
        goldRef.current -= validDef.shopPrice;
        housingRef.current = nextHousing;
        flushSync(() => { setGold(goldRef.current); setHousing(nextHousing); });
        updateAchStat({ totalGoldSpent: validDef.shopPrice });
        advanceBounty('spend_gold', null, validDef.shopPrice);
        showMapToast('🎉', '获得家具', `${validDef.icon} ${validDef.name} (${(FURNITURE_QUALITY[quality] || {name:'普通'}).name})`, 2500);
      } finally {
        housingActionLocksRef.current.delete(lockKey);
      }
    };

    return (
      <div className="screen housing-screen-redesign" style={{minHeight:'100vh'}}>
        <div className="nav-header glass-panel housing-topbar">
          <button className="btn-back housing-back-btn" onClick={() => setView(safeBack())}>⬅ 返回地图</button>
          <div className="housing-title-lockup">
            <span>Spirit homestead</span>
            <strong>🏡 精灵家园</strong>
          </div>
          <div className="nav-coin housing-gold-pill">💰 {gold.toLocaleString()}</div>
        </div>

        <section className="housing-hero">
          <div className="housing-hero-main">
            <div className="housing-house-orb">{currentHouseDef?.icon || '🏕️'}</div>
            <div>
              <span className="housing-eyebrow">伙伴休整基地</span>
              <h1>{currentHouseDef?.name || '露宿野外'}</h1>
              <p>{currentHouseDef ? `${tier.title} · ${residentCount} 位伙伴在家休整` : '冒险归来，总有一处灯火。'}</p>
            </div>
          </div>
          <div className="housing-hero-stats">
            <div><strong>{score}</strong><span>家园评分</span></div>
            <div><strong>{residentCount}/{currentHouseDef?.slots || 0}</strong><span>入住精灵</span></div>
            <div><strong>{placedFurniture.length}/{currentHouseDef?.furnitureSlots || 0}</strong><span>家具槽</span></div>
            <div><strong>{gardenUsed}/{gardenMax}</strong><span>花园槽</span></div>
          </div>
        </section>

        <div className="housing-tab-bar" style={{display:'flex', gap:'6px', justifyContent:'flex-start', margin:'10px 0', overflowX:'auto', WebkitOverflowScrolling:'touch', paddingBottom:'4px', scrollbarWidth:'none'}}>
          {['overview','furniture','residents','garden','sanctuary','treasure','shop','upgrade','cafe','dating'].map(tab => (
            <button key={tab} className={housingTab === tab ? 'is-active' : ''} onClick={() => setHousingTab(tab)}
              style={{padding:'6px 12px', borderRadius:'20px', border:'none', cursor:'pointer',
                background: housingTab === tab ? (tab === 'cafe' ? '#C62828' : tab === 'dating' ? '#E91E63' : tab === 'garden' ? '#43A047' : tab === 'sanctuary' ? '#7B1FA2' : tab === 'treasure' ? '#FF8F00' : '#8D6E63') : '#fff',
                color: housingTab === tab ? '#fff' : '#666', fontWeight:'bold', fontSize:'11px',
                boxShadow: housingTab === tab ? '0 4px 12px rgba(141,110,99,0.4)' : 'none'}}>
              {{overview:'🏠 概览', furniture:'🪑 家具', residents:'🐾 入住', garden:'🌱 花园', sanctuary:'⛩️ 圣域', treasure:'✨ 珍藏', shop:'🛒 商店', upgrade:'⬆️ 升级', cafe:'☕ 咖啡厅', dating:'💕 约会'}[tab]}
            </button>
          ))}
        </div>

        <div className="housing-content" style={{padding:'0 20px 20px', maxHeight:'calc(100vh - 140px)', overflow:'auto'}}>

          {housingTab === 'overview' && (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div style={{background:'transparent', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize:'48px', textAlign:'center'}}>{currentHouseDef?.icon || '🏕️'}</div>
                <div style={{textAlign:'center', fontWeight:'bold', fontSize:'18px', margin:'8px 0'}}>{currentHouseDef?.name || '露宿野外'}</div>
                <div style={{textAlign:'center', color:'#888', fontSize:'13px'}}>
                  {currentHouseDef ? `精灵槽: ${housing.residents.filter(r => r).length}/${currentHouseDef.slots} | 家具槽: ${placedFurniture.length}/${currentHouseDef.furnitureSlots}` : <button type="button" onClick={() => setHousingTab('upgrade')}>选购住宅</button>}
                </div>
              </div>
              <div style={{background:'transparent', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
                <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'12px'}}>📊 家园评分</div>
                <div style={{fontSize:'32px', fontWeight:'bold', color:'#8D6E63', textAlign:'center'}}>{score}</div>
                <div style={{textAlign:'center', color: tier.buff ? '#4CAF50' : '#999', fontWeight:'bold', fontSize:'14px', margin:'4px 0'}}>🏅 {tier.title}</div>
                {tier.buff && <div style={{fontSize:'11px', color:'#666', textAlign:'center'}}>
                  {tier.buff.allStats ? `全属性+${tier.buff.allStats} ` : ''}
                  {tier.buff.expBonus ? `经验+${Math.floor(tier.buff.expBonus*100)}% ` : ''}
                  {tier.buff.intimacyMult ? `亲密度x${tier.buff.intimacyMult} ` : ''}
                </div>}
              </div>
              <div style={{background:'transparent', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', gridColumn:'span 2'}}>
                <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>📋 每日收益 (入住精灵)</div>
                <div style={{display:'flex', gap:'20px', justifyContent:'center', fontSize:'13px'}}>
                  <span>❤️ HP恢复: +{benefits.hpRegen}</span>
                  <span>⭐ 经验: +{((benefits.expBonus || 0) * 100).toFixed(0)}%</span>
                  <span>💕 亲密度: +{benefits.intimacyBonus}</span>
                  {benefits.ceRegen > 0 && <span>🔮 咒力恢复: +{benefits.ceRegen}</span>}
                </div>
                {completedSets.length > 0 && (
                  <div style={{marginTop:'8px', borderTop:'1px solid #eee', paddingTop:'8px'}}>
                    <div style={{fontSize:'12px', color:'#4CAF50', fontWeight:'bold'}}>✨ 已激活套装:</div>
                    {completedSets.map(s => <div key={s.id} style={{fontSize:'11px', color:'#666', marginTop:'2px'}}>{s.name}: {s.desc}</div>)}
                  </div>
                )}
              </div>
              {marriage.spouse && (() => {
                const sp = MARRIAGE_CANDIDATES.find(c => c.id === marriage.spouse);
                if (!sp) return null;
                const aff = marriage.affections[marriage.spouse] || 0;
                const ml = getMarriageLevel(aff);
                const bonuses = getSpouseBonuses();
                return (
                  <div style={{background:'transparent', borderRadius:'16px', padding:'16px', boxShadow:'0 4px 20px rgba(233,30,99,0.1)', gridColumn:'span 2', border:'1px solid #F8BBD0', marginTop:'0'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
                      <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#E91E63,#F06292)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', color:'#fff'}}>{sp.icon}</div>
                      <div>
                        <div style={{fontWeight:'bold', fontSize:'14px', color:'#E91E63'}}>💕 配偶：{sp.name}</div>
                        <div style={{fontSize:'11px', color:'#999'}}>{ml.name} · 加成倍率 x{ml.bonusMult}</div>
                      </div>
                      <button onClick={() => setHousingTab('dating')} style={{marginLeft:'auto', padding:'6px 14px', borderRadius:'14px', border:'none', background:'#E91E63', color:'#fff', fontSize:'11px', fontWeight:'bold', cursor:'pointer'}}>前往约会</button>
                    </div>
                    <div style={{fontSize:'11px', color:'#666'}}>
                      {sp.bonusDesc}
                      {bonuses.intimacyBoost ? ` · 亲密度+${Math.round(bonuses.intimacyBoost*100)}%` : ''}
                      {bonuses.cafeGoldBase ? ` · 咖啡厅金币+${Math.round(bonuses.cafeGoldBase*100)}%` : ''}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {housingTab === 'furniture' && (
            <div>
              {placedFurniture.length > 0 && (
                <div style={{marginBottom:'16px'}}>
                  <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>🪑 已放置的家具</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'8px'}}>
                    {housing.furniture.map((f, idx) => {
                      if (!f.placed) return null;
                      const def = FURNITURE_DB.find(d => d.id === f.baseId);
                      if (!def) return null;
                      const qual = FURNITURE_QUALITY[f.quality];
                      return (
                        <div key={idx} role="button" tabIndex={0} aria-label={`收回${def.name}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); removeFurniture(idx); } }} style={{background:'transparent', borderRadius:'12px', padding:'10px', border:`2px solid ${qual.color}`, cursor:'pointer', position:'relative'}} onClick={() => removeFurniture(idx)}>
                          <div style={{fontSize:'24px', textAlign:'center'}}>{def.icon}</div>
                          <div style={{fontSize:'11px', fontWeight:'bold', textAlign:'center', marginTop:'4px'}}>{def.name}</div>
                          <div style={{fontSize:'10px', textAlign:'center', color: qual.color, fontWeight:'bold'}}>{qual.name}</div>
                          <div style={{position:'absolute', top:'4px', right:'4px', fontSize:'10px', cursor:'pointer', color:'#f44336'}}>✕</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>📦 背包中的家具 ({unplacedFurniture.length}件)</div>
              {unplacedFurniture.length === 0 && <div style={{color:'#999', textAlign:'center', padding:'20px'}}>背包空空如也... 去冒险获取家具吧!</div>}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'8px'}}>
                {housing.furniture.map((f, idx) => {
                  if (f.placed) return null;
                  const def = FURNITURE_DB.find(d => d.id === f.baseId);
                  if (!def) return null;
                  const qual = FURNITURE_QUALITY[f.quality];
                  return (
                    <div key={idx} role="button" tabIndex={0} aria-label={`放置${def.name}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); placeFurniture(idx); } }} style={{background:'transparent', borderRadius:'12px', padding:'10px', border:'1px solid #eee', cursor:'pointer'}} onClick={() => placeFurniture(idx)}>
                      <div style={{fontSize:'24px', textAlign:'center'}}>{def.icon}</div>
                      <div style={{fontSize:'11px', fontWeight:'bold', textAlign:'center', marginTop:'4px'}}>{def.name}</div>
                      <div style={{fontSize:'10px', textAlign:'center', color: qual.color, fontWeight:'bold'}}>{qual.name}</div>
                      <div style={{fontSize:'9px', textAlign:'center', color:'#4CAF50'}}>点击放置</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {housingTab === 'residents' && (
            <div>
              {!currentHouseDef && <div style={{textAlign:'center', padding:'40px', color:'#999'}}>请先购买房屋!</div>}
              {currentHouseDef && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'12px'}}>
                  {housing.residents.map((uid, idx) => {
                    const pet = uid ? findPetByUid(uid) : null;
                    return (
                      <div key={idx} style={{background:'transparent', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', textAlign:'center', border: pet ? '2px solid #4CAF50' : '2px dashed #ccc', minHeight:'120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        {pet ? (
                          <>
                            <div style={{width:48, height:48}}>{renderAvatar(pet)}</div>
                            <div style={{fontWeight:'bold', fontSize:'13px', marginTop:'4px'}}>{pet.name}</div>
                            <div style={{fontSize:'11px', color:'#888'}}>Lv.{pet.level}</div>
                            <button onClick={() => removeResident(idx)} style={{marginTop:'8px', padding:'4px 12px', borderRadius:'12px', border:'none', background:'#ffebee', color:'#f44336', fontSize:'11px', cursor:'pointer'}}>召回</button>
                          </>
                        ) : (
                          <>
                            <div style={{fontSize:'36px', opacity:0.3}}>🏠</div>
                            <div style={{color:'#999', fontSize:'12px', marginTop:'4px'}}>空槽位</div>
                            <button onClick={() => assignResident(idx)} style={{marginTop:'8px', padding:'4px 12px', borderRadius:'12px', border:'none', background:'#E8F5E9', color:'#4CAF50', fontSize:'11px', cursor:'pointer'}}>分配精灵</button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {housingTab === 'shop' && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'12px'}}>
              {FURNITURE_DB.filter(f => f.shopPrice).map(def => (
                <div key={def.id} role="button" tabIndex={0} aria-label={`购买${def.name}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buyFurnitureFromShop(def); } }} style={{background:'transparent', borderRadius:'12px', padding:'14px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', cursor:'pointer', transition:'background 0.2s, border-color 0.2s, transform 0.2s'}} onClick={() => buyFurnitureFromShop(def)}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'28px'}}>{def.icon}</span>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'13px'}}>{def.name}</div>
                      <div style={{fontSize:'10px', color:'#888'}}>{{REST:'休息类',TRAIN:'训练类',PLAY:'娱乐类',DECO:'装饰类'}[def.category] || def.category}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', alignItems:'center'}}>
                    <span style={{fontSize:'12px', color:'#FF9800', fontWeight:'bold'}}>💰 {def.shopPrice}</span>
                    <span style={{fontSize:'10px', color:'#4CAF50'}}>品质: 普通~优秀</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {housingTab === 'upgrade' && (
            <div style={{maxWidth:'500px', margin:'0 auto'}}>
              {HOUSE_TYPES.filter(h => !h.requireMarriage).map((h, idx) => {
                const isOwned = housing.currentHouse === h.id;
                const ownedIdx = HOUSE_TYPES.filter(ht => !ht.requireMarriage).findIndex(ht => ht.id === housing.currentHouse);
                const isNext = idx === ownedIdx + 1 || (!housing.currentHouse && idx === 0);
                const isPast = idx <= ownedIdx;
                return (
                  <div key={h.id} style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', border: isOwned ? '2px solid #4CAF50' : isNext ? '2px solid #FF9800' : '1px solid #eee', opacity: isPast && !isOwned ? 0.5 : 1}}>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                      <span style={{fontSize:'36px'}}>{h.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'16px'}}>{h.name} {isOwned && <span style={{color:'#4CAF50', fontSize:'12px'}}>✓ 当前</span>}</div>
                        <div style={{fontSize:'12px', color:'#888'}}>精灵槽: {h.slots} | 家具槽: {h.furnitureSlots} | 花园槽: {h.gardenSlots}</div>
                      </div>
                      {isNext && <button onClick={() => buyHouse(h)} style={{padding:'8px 20px', borderRadius:'20px', border:'none', background:'linear-gradient(135deg,#FF9800,#F57C00)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'13px'}} disabled={gold < h.price}>💰 {h.price}</button>}
                    </div>
                  </div>
                );
              })}
              <div style={{fontWeight:'bold', fontSize:'14px', color:'#E91E63', margin:'20px 0 12px', display:'flex', alignItems:'center', gap:'6px'}}>💕 主题婚房 <span style={{fontSize:'11px', color:'#999', fontWeight:'normal'}}>{marriage.spouse ? '已解锁' : '🔒 需要结婚后解锁'}</span></div>
              {HOUSE_TYPES.filter(h => h.requireMarriage).map(h => {
                const isOwned = housing.currentHouse === h.id;
                const isMarried = !!marriage.spouse;
                const canBuy = isMarried && !isOwned && gold >= h.price;
                return (
                  <div key={h.id} style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(233,30,99,0.08)', border: isOwned ? '2px solid #E91E63' : '1px solid #F8BBD0', opacity: isMarried ? 1 : 0.6, position:'relative'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                      <span style={{fontSize:'36px'}}>{h.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'16px'}}>{h.name} {isOwned && <span style={{color:'#E91E63', fontSize:'12px'}}>✓ 当前</span>}</div>
                        <div style={{fontSize:'12px', color:'#888'}}>精灵槽: {h.slots} | 家具槽: {h.furnitureSlots} | 花园槽: {h.gardenSlots}</div>
                        <div style={{fontSize:'11px', color:'#E91E63', marginTop:'2px'}}>{h.desc}</div>
                        {!isMarried && <div style={{fontSize:'11px', color:'#999', marginTop:'4px'}}>🔒 需要先结婚才能购买</div>}
                      </div>
                      {isMarried && !isOwned && <button onClick={() => buyHouse(h)} style={{padding:'8px 20px', borderRadius:'20px', border:'none', background: canBuy ? 'linear-gradient(135deg,#E91E63,#F06292)' : '#e0e0e0', color: canBuy ? '#fff' : '#999', fontWeight:'bold', cursor: canBuy ? 'pointer' : 'not-allowed', fontSize:'13px'}} disabled={!canBuy}>💰 {h.price?.toLocaleString()}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== 花园 ========== */}
          {housingTab === 'garden' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              {!housing.currentHouse ? (
                <div style={{textAlign:'center', padding:'40px 20px', color:'#888'}}>
                  <div style={{fontSize:'48px', marginBottom:'16px'}}>🌱</div>
                  <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'8px'}}>需要先拥有住宅</div>
                  <div style={{fontSize:'13px'}}>购买住宅后即可开启花园种植</div>
                </div>
              ) : (
                <div>
                  <div style={{background:'linear-gradient(135deg,#43A047,#66BB6A)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{fontWeight:'bold', fontSize:'18px'}}>🌱 精灵花园</div>
                    <div style={{fontSize:'12px', opacity:0.8}}>种植槽 {(housing.garden?.plots || []).length}/{getGardenSlots(housing.currentHouse)} · 种植花草收获装饰和道具</div>
                  </div>
                  {/* 种植槽 */}
                  <div style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>种植槽</div>
                    {(housing.garden?.plots || []).length === 0 && (
                      <div style={{textAlign:'center', padding:'20px', color:'#aaa', fontSize:'13px'}}>还没有种植任何植物，在下方选择种子开始种植吧！</div>
                    )}
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {(housing.garden?.plots || []).map((plot, idx) => {
                        const plantDef = GARDEN_PLANTS.find(p => p.id === plot.plantId);
                        if (!plantDef) return null;
                        const now = Date.now();
                        const elapsed = now - plot.plantedAt;
                        const totalGrowth = plot.adjustedGrowth || plantDef.growthMs;
                        const progress = Math.min(100, (elapsed / totalGrowth) * 100);
                        const isReady = elapsed >= totalGrowth;
                        const today = getLocalDateStr();
                        const canWater = !((housing.garden?.waterLog || {})[`${plot.plantId}_${plot.plantedAt}_${today}`]);
                        const remaining = Math.max(0, totalGrowth - elapsed);
                        const remMins = Math.floor(remaining / 60000);
                        const remHrs = Math.floor(remMins / 60);
                        const timeStr = remHrs > 0 ? `${remHrs}时${remMins%60}分` : `${remMins}分钟`;
                        return (
                          <div key={idx} style={{padding:'12px', borderRadius:'12px', background: isReady ? '#E8F5E9' : '#FAFAFA', border: isReady ? '2px solid #4CAF50' : '1px solid #eee'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                              <span style={{fontSize:'24px'}}>{plantDef.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:'bold', fontSize:'13px'}}>{plantDef.name} <span style={{fontSize:'10px', color:'#888'}}>({FURNITURE_QUALITY[plantDef.rarity]?.name || plantDef.rarity})</span></div>
                                <div style={{fontSize:'11px', color:'#888'}}>{isReady ? '已成熟，可以收获！' : `剩余 ${timeStr}`}</div>
                              </div>
                              {isReady ? (
                                <button onClick={() => harvestPlant(idx)} style={{padding:'6px 16px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#43A047,#66BB6A)', color:'#fff', fontWeight:'bold', fontSize:'12px', cursor:'pointer'}}>收获</button>
                              ) : canWater ? (
                                <button onClick={() => waterPlant(idx)} style={{padding:'6px 14px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#1E88E5,#42A5F5)', color:'#fff', fontWeight:'bold', fontSize:'11px', cursor:'pointer'}}>💧 浇水</button>
                              ) : (
                                <span style={{fontSize:'10px', color:'#aaa'}}>今日已浇</span>
                              )}
                            </div>
                            <progress className="housing-progress" aria-label={`${plantDef.name}生长进度`} max={100} value={progress} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* 种子列表 */}
                  <div style={{background:'transparent', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'4px'}}>种子商店</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>购买种子种植到花园，收获装饰品(加评分)或道具</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      {GARDEN_PLANTS.filter(p => p.seedPrice !== null || (housing.garden?.seedInventory?.[p.id] || 0) > 0).map(plant => {
                        const plots = housing.garden?.plots || [];
                        const maxSlots = getGardenSlots(housing.currentHouse);
                        const full = plots.length >= maxSlots;
                        const rarityColors = { COMMON:'#78909C', UNCOMMON:'#43A047', RARE:'#1E88E5', EPIC:'#8E24AA', LEGENDARY:'#FF6F00' };
                        const growMins = Math.round(plant.growthMs / 60000);
                        const growStr = growMins >= 60 ? `${Math.floor(growMins/60)}时${growMins%60}分` : `${growMins}分`;
                        return (
                          <div key={plant.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', background:'#fafafa', border:'1px solid #eee'}}>
                            <span style={{fontSize:'20px'}}>{plant.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'12px'}}>{plant.name} <span style={{fontSize:'10px', color:rarityColors[plant.rarity]}}>{FURNITURE_QUALITY[plant.rarity]?.name}</span></div>
                              <div style={{fontSize:'10px', color:'#999'}}>{plant.desc} · ⏱{growStr}</div>
                            </div>
                            {(() => { const seedCt = (housing.garden?.seedInventory || {})[plant.id] || 0; const canAfford = seedCt > 0 || (plant.seedPrice !== null && gold >= plant.seedPrice); return <button onClick={() => plantSeed(plant.id)} disabled={full || !canAfford} style={{
                              padding:'5px 12px', borderRadius:'14px', border:'none', fontSize:'11px', fontWeight:'bold', cursor: full || !canAfford ? 'not-allowed' : 'pointer',
                              background: full || !canAfford ? '#e0e0e0' : 'linear-gradient(135deg,#43A047,#66BB6A)', color: full || !canAfford ? '#999' : '#fff'
                            }}>{full ? '已满' : seedCt > 0 ? `🌱种子×${seedCt}` : `💰${plant.seedPrice}`}</button>; })()}
                          </div>
                        );
                      })}
                    </div>
                    {GARDEN_PLANTS.filter(p => p.seedPrice === null).length > 0 && (
                      <div style={{marginTop:'12px', padding:'10px', borderRadius:'10px', background:'#FFF3E0', border:'1px solid #FFE0B2', fontSize:'11px', color:'#E65100'}}>
                        💡 稀有/传说种子无法购买，只能通过收获其他植物时随机获得！
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== 珍藏阁 ========== */}
          {housingTab === 'sanctuary' && (
            <div style={{maxWidth:'640px', margin:'0 auto'}}>
              <div style={{background:'linear-gradient(135deg,#6A1B9A,#8E24AA)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                <div style={{fontWeight:'bold', fontSize:'18px'}}>⛩️ 精灵圣域</div>
                <div style={{fontSize:'12px', opacity:0.85}}>区域生态据点 · 设施升级可提升对应地图生态指标</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'10px'}}>
                {SANCTUARY_FACILITIES.map(f => {
                  const lv = sanctuaryState.facilities?.[f.id] || 0;
                  const cost = getSanctuaryUpgradeCost(f.id, lv);
                  return (
                    <div key={f.id} style={{background:'#fff', borderRadius:'12px', padding:'14px', border:'1px solid #e0e0e0', boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
                      <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'4px'}}>{f.icon} {f.name} <span style={{color:'#7B1FA2'}}>Lv.{lv}/{f.maxLevel}</span></div>
                      <div style={{fontSize:'11px', color:'#666', marginBottom:'10px', lineHeight:1.4}}>{f.desc}</div>
                      <button onClick={() => upgradeSanctuaryFacility(f.id)} disabled={lv >= f.maxLevel}
                        style={{padding:'8px 14px', borderRadius:'10px', border:'none', cursor: lv >= f.maxLevel ? 'default' : 'pointer',
                          background: lv >= f.maxLevel ? '#eee' : 'linear-gradient(135deg,#7B1FA2,#AB47BC)', color: lv >= f.maxLevel ? '#999' : '#fff', fontWeight:'bold', fontSize:'12px'}}>
                        {lv >= f.maxLevel ? '已满级' : `升级 · ${cost?.toLocaleString()}金`}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:'16px', background:'#f3e5f5', borderRadius:'12px', padding:'14px'}}>
                <div style={{fontWeight:'bold', fontSize:'13px', marginBottom:'8px', color:'#6A1B9A'}}>🌺 精灵协同（选择激活一种）</div>
                {SANCTUARY_SYNERGY.map(s => (
                  <div key={s.id} onClick={() => {
                    if (sanctuaryState.synergyActive === s.id) { setSanctuaryState(prev => ({ ...prev, synergyActive: null })); return; }
                    if (!checkSynergyMatch(s.id, sanctuaryState.residents || [])) { showMapToast('⚠️', '协同失败', `缺少所需属性精灵：${s.petNames.join('、')}`, 2500); return; }
                    setSanctuaryState(prev => ({ ...prev, synergyActive: s.id }));
                  }} style={{fontSize:'11px', color: sanctuaryState.synergyActive === s.id ? '#6A1B9A' : '#555', marginBottom:'8px', lineHeight:1.4, padding:'8px 10px', borderRadius:'8px', cursor:'pointer', background: sanctuaryState.synergyActive === s.id ? 'rgba(106,27,154,0.1)' : 'transparent', border: sanctuaryState.synergyActive === s.id ? '1px solid rgba(106,27,154,0.3)' : '1px solid transparent'}}>
                    <strong>{s.name}</strong>（{s.petNames.join(' + ')}）— {s.desc}
                    {sanctuaryState.synergyActive === s.id && <span style={{marginLeft:'8px', color:'#4CAF50', fontWeight:'bold'}}>✓ 已激活</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {housingTab === 'treasure' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              <div style={{background:'linear-gradient(135deg,#FF8F00,#FFA726)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                <div style={{fontWeight:'bold', fontSize:'18px'}}>✨ 珍藏阁</div>
                <div style={{fontSize:'12px', opacity:0.8}}>已收集 {(housing.treasures || []).length}/{TREASURE_COLLECTIONS.reduce((s,c) => s+c.items.length, 0)} · 展示珍贵纪念品加家园评分</div>
              </div>
              {TREASURE_COLLECTIONS.map(col => {
                const owned = housing.treasures || [];
                const ownedInSet = col.items.filter(it => owned.includes(it.id));
                const allCollected = ownedInSet.length === col.items.length;
                const setScore = col.items.reduce((s, it) => s + (owned.includes(it.id) ? it.score : 0), 0) + (allCollected ? col.setBonus.score : 0);
                return (
                  <div key={col.id} style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                      <span style={{fontSize:'24px'}}>{col.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'14px'}}>{col.name} <span style={{fontSize:'11px', color:'#888'}}>({ownedInSet.length}/{col.items.length})</span></div>
                        <div style={{fontSize:'11px', color:'#888'}}>{col.desc}</div>
                      </div>
                      <div style={{fontSize:'12px', fontWeight:'bold', color: allCollected ? '#4CAF50' : '#999'}}>+{setScore}分</div>
                    </div>
                    {allCollected && (
                      <div style={{padding:'6px 12px', borderRadius:'8px', background:'#E8F5E9', border:'1px solid #C8E6C9', fontSize:'11px', color:'#2E7D32', fontWeight:'bold', marginBottom:'8px'}}>
                        🎉 系列集齐！额外 +{col.setBonus.score} 家园评分
                      </div>
                    )}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:'6px'}}>
                      {col.items.map(item => {
                        const has = owned.includes(item.id);
                        return (
                          <div key={item.id} style={{
                            padding:'8px', borderRadius:'10px', textAlign:'center',
                            background: has ? '#FFFDE7' : '#f5f5f5', border: has ? '1px solid #FDD835' : '1px dashed #ddd',
                            opacity: has ? 1 : 0.5
                          }}>
                            <div style={{fontSize:'20px', marginBottom:'2px', filter: has ? 'none' : 'grayscale(1)'}}>{item.icon}</div>
                            <div style={{fontSize:'10px', fontWeight:'bold', color: has ? '#333' : '#bbb'}}>{has ? item.name : '???'}</div>
                            {has && <div style={{fontSize:'9px', color:'#888'}}>+{item.score}分</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== 咖啡厅 ========== */}
          {housingTab === 'cafe' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              {!cafe.owned ? (
                <div style={{textAlign:'center', padding:'40px 20px'}}>
                  <div style={{fontSize:'48px', marginBottom:'16px'}}>☕</div>
                  <div style={{fontWeight:'bold', fontSize:'18px', marginBottom:'8px', color:'#C62828'}}>LycoReco 咖啡厅</div>
                  <div style={{fontSize:'13px', color:'#888', marginBottom:'20px'}}>通关莉可莉丝剧情序章后可购买</div>
                  {isLycorisStoryCompleted(18) ? (
                    <button onClick={buyCafe} style={{padding:'12px 30px', borderRadius:'25px', border:'none', background:'linear-gradient(135deg,#C62828,#FF5252)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'14px', boxShadow:'0 4px 15px rgba(198,40,40,0.4)'}}>
                      购买咖啡厅 (💰 {CAFE_BUILDING.price})
                    </button>
                  ) : (
                    <div style={{fontSize:'12px', color:'#999', padding:'10px', background:'transparent', borderRadius:'10px'}}>
                      需要先通关「莉可莉丝篇·序章」才能解锁
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* 咖啡厅状态 */}
                  <div style={{background:'linear-gradient(135deg,#C62828,#D32F2F)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                      <div>
                        <div style={{fontWeight:'bold', fontSize:'18px'}}>☕ LycoReco 咖啡厅</div>
                        <div style={{fontSize:'12px', opacity:0.8}}>等级 {getCafeLevel(cafe.totalWorkCount).level} · 累计打工 {cafe.totalWorkCount} 次</div>
                      </div>
                      <div style={{background:'rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>
                        金币倍率 x{getCafeLevel(cafe.totalWorkCount).goldMult}
                      </div>
                    </div>
                    <div style={{fontSize:'11px', opacity:0.7}}>
                      打工种族值合计: {getWorkerStatTotal()} · 影响酿造速度与可酿等级
                    </div>
                  </div>

                  {/* 打工精灵 */}
                  <div style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>打工精灵 ({cafe.workers.length}/{CAFE_BUILDING.workerSlots})</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'10px'}}>每5分钟产出 {(() => { const _sp = marriage.spouse; const _spCand = _sp ? MARRIAGE_CANDIDATES.find(c => c.id === _sp) : null; const _spLvl = _sp ? getMarriageLevel(marriage.affections[_sp] || 0).level : 0; const _spBonus = _spCand ? (getSpouseBonus(_spCand, _spLvl).cafeGold || 0) + (getSpouseBonus(_spCand, _spLvl).cafeGoldBase || 0) : 0; const _cafeM = 1 + _spBonus; return Math.floor(CAFE_BUILDING.goldPerTick * getCafeLevel(cafe.totalWorkCount).goldMult * _cafeM * (1 + Math.max(0, cafe.workers.length - 1) * 0.15)); })()} 金币 (等级×{getCafeLevel(cafe.totalWorkCount).goldMult} · 工人×{(1 + Math.max(0, cafe.workers.length - 1) * 0.15).toFixed(1)}{marriage.spouse ? ' · 💕配偶加成' : ''}) + 亲密度+2</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {party.map(p => {
                        const uid = p.uid || p.id;
                        const isWorking = cafe.workers.includes(uid);
                        const base = POKEDEX.find(d => d.id === p.id) || {};
                        const bst = (base.hp||0) + (base.atk||0) + (base.def||0) + (base.spd||0);
                        return (
                          <div key={uid} role="button" tabIndex={0} aria-pressed={isWorking} aria-label={`${isWorking ? '下班' : '安排打工'}${p.name}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); assignCafeWorker(p); } }} onClick={() => assignCafeWorker(p)} style={{
                            display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', cursor:'pointer',
                            background: isWorking ? '#FFF3E0' : '#f5f5f5', border: isWorking ? '2px solid #FF9800' : '1px solid #eee'
                          }}>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'13px'}}>{p.name} <span style={{fontSize:'10px', color:'#888'}}>Lv.{p.level}</span></div>
                              <div style={{fontSize:'10px', color:'#aaa'}}>种族值: {bst}</div>
                            </div>
                            <div style={{fontSize:'11px', color: isWorking ? '#E65100' : '#999', fontWeight:'bold'}}>{isWorking ? '打工中' : '空闲'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 酿造状态 */}
                  {(cafe.brewing || cafe.readyDrink) && (
                    <div style={{background:'transparent', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                      <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>酿造状态</div>
                      {cafe.brewing && (() => {
                        const now = Date.now();
                        const elapsed = now - cafe.brewing.startTime;
                        const remaining = Math.max(0, cafe.brewing.duration - elapsed);
                        const progress = Math.min(100, (elapsed / (cafe.brewing.duration || 1)) * 100);
                        const brewDrink = CAFE_DRINKS.find(d => d.id === cafe.brewing.drinkId);
                        const mins = Math.floor(remaining / 60000);
                        const secs = Math.ceil((remaining % 60000) / 1000);
                        return (
                          <div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                              <span style={{fontSize:'13px', fontWeight:'bold'}}>☕ {brewDrink?.name || '未知'}</span>
                              <span style={{fontSize:'11px', color:'#1565C0'}}>⏱ {remaining > 0 ? `${mins}分${secs}秒` : '即将完成...'}</span>
                            </div>
                            <progress className="housing-progress" aria-label="咖啡酿造进度" max={100} value={progress} style={{marginBottom:'8px'}} />
                            <button onClick={cancelBrewing} style={{padding:'4px 12px', borderRadius:'12px', border:'1px solid #e0e0e0', background:'#fafafa', fontSize:'10px', color:'#999', cursor:'pointer'}}>取消酿造</button>
                          </div>
                        );
                      })()}
                      {cafe.readyDrink && (() => {
                        const readyDrink = CAFE_DRINKS.find(d => d.id === cafe.readyDrink.drinkId);
                        const tierColors = ['#9E9E9E', '#78909C', '#43A047', '#1E88E5', '#8E24AA', '#FF6F00'];
                        return (
                          <div style={{textAlign:'center', padding:'8px 0'}}>
                            <div style={{fontSize:'32px', marginBottom:'8px'}}>☕</div>
                            <div style={{fontWeight:'bold', fontSize:'15px', marginBottom:'4px', color:'#2E7D32'}}>「{readyDrink?.name}」酿造完成!</div>
                            <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>支付金币领取，获得随机道具奖励</div>
                            <button onClick={claimBrewedDrink} disabled={gold < (readyDrink?.price || 0)} style={{
                              padding:'10px 28px', borderRadius:'20px', border:'none', fontWeight:'bold', fontSize:'13px', cursor: gold < (readyDrink?.price||0) ? 'not-allowed':'pointer',
                              background: gold < (readyDrink?.price||0) ? '#e0e0e0' : `linear-gradient(135deg,${tierColors[readyDrink?.tier||1]},${tierColors[readyDrink?.tier||1]}CC)`,
                              color: gold < (readyDrink?.price||0) ? '#999' : '#fff', boxShadow: gold < (readyDrink?.price||0) ? 'none' : '0 4px 12px rgba(0,0,0,0.2)'
                            }}>💰 {readyDrink?.price} 领取</button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 饮品菜单 */}
                  <div style={{background:'transparent', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'4px'}}>酿造饮品</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>选择饮品开始酿造 → 等待完成 → 支付领取 · 每日限量</div>
                    {cafe.workers.length === 0 && (
                      <div style={{padding:'10px 14px', borderRadius:'10px', background:'#FFF3E0', border:'1px solid #FFE0B2', marginBottom:'8px', fontSize:'12px', color:'#E65100'}}>
                        ⚠️ 没有精灵在打工，无法酿造！请先安排精灵到咖啡厅。
                      </div>
                    )}
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {CAFE_DRINKS.map(drink => {
                        const unlocked = isDrinkUnlocked(drink);
                        const tierColors = ['#9E9E9E', '#78909C', '#43A047', '#1E88E5', '#8E24AA', '#FF6F00'];
                        const tierNames = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];
                        const used = getDrinkDailyUsed(drink.id);
                        const atLimit = used >= drink.dailyLimit;
                        const workerStats = getWorkerStatTotal();
                        const minStats = DRINK_MIN_WORKER_STATS[drink.tier] || 0;
                        const statsTooLow = workerStats < minStats;
                        const isBrewing = !!cafe.brewing;
                        const hasReady = !!cafe.readyDrink;
                        const noWorkers = cafe.workers.length === 0;
                        const cantBrew = !unlocked || atLimit || isBrewing || hasReady || noWorkers || statsTooLow;
                        const brewTime = calcBrewTimeMs(drink.tier, workerStats);
                        const brewMins = Math.ceil(brewTime / 60000);
                        return (
                          <div key={drink.id} style={{
                            display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderRadius:'12px',
                            background: unlocked ? '#fff' : '#f5f5f5', border: unlocked ? '1px solid #eee' : '1px dashed #ddd',
                            opacity: unlocked ? 1 : 0.5
                          }}>
                            <div style={{width:'36px', height:'36px', borderRadius:'50%', background: unlocked ? `linear-gradient(135deg,${tierColors[drink.tier]},${tierColors[drink.tier]}88)` : '#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:'#fff', flexShrink:0}}>☕</div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'13px', color: unlocked ? '#333' : '#999'}}>{drink.name} <span style={{fontSize:'10px', color:tierColors[drink.tier]}}>{tierNames[drink.tier]}</span></div>
                              <div style={{fontSize:'11px', color:'#888'}}>{drink.desc}</div>
                              {unlocked && (
                                <div style={{fontSize:'10px', marginTop:'3px', display:'flex', gap:'8px', flexWrap:'wrap', color:'#888'}}>
                                  <span style={{color: atLimit ? '#d32f2f' : '#666'}}>今日 {used}/{drink.dailyLimit}</span>
                                  <span>💰{drink.price}</span>
                                  <span>⏱{brewMins}分钟</span>
                                  {statsTooLow && <span style={{color:'#d32f2f'}}>需种族值≥{minStats}</span>}
                                </div>
                              )}
                            </div>
                            {unlocked ? (
                              <button onClick={() => startBrewing(drink.id)} disabled={cantBrew} style={{
                                padding:'6px 14px', borderRadius:'16px', border:'none', fontSize:'11px', fontWeight:'bold', cursor: cantBrew ? 'not-allowed' : 'pointer',
                                background: cantBrew ? '#e0e0e0' : `linear-gradient(135deg,${tierColors[drink.tier]},${tierColors[drink.tier]}CC)`, color: cantBrew ? '#999' : '#fff'
                              }}>{atLimit ? '已售罄' : statsTooLow ? '种族值不足' : isBrewing||hasReady ? '忙碌中' : '酿造'}</button>
                            ) : (
                              <span style={{fontSize:'10px', color:'#bbb'}}>未解锁</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== 约会角落 ========== */}
          {housingTab === 'dating' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              {/* 婚礼场景 */}
              {weddingScene && (
                <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={advanceWedding}>
                  <div style={{background:'linear-gradient(135deg,#FFF8E1,#FFE0B2)', borderRadius:'24px', padding:'40px', maxWidth:'400px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.5)'}}>
                    <div style={{fontSize:'48px', marginBottom:'16px'}}>💒</div>
                    {(() => {
                      const d = WEDDING_DIALOGUE[weddingScene.step];
                      if (!d) return null;
                      const speaker = d.name.replace('{spouse}', weddingScene.candidate.name);
                      return (<>
                        <div style={{fontWeight:'bold', fontSize:'14px', color:'#E91E63', marginBottom:'8px'}}>{speaker}</div>
                        <div style={{fontSize:'15px', color:'#333', lineHeight:1.8}}>{d.text}</div>
                        <div style={{fontSize:'11px', color:'#999', marginTop:'20px'}}>点击任意处继续 ({weddingScene.step + 1}/{WEDDING_DIALOGUE.length})</div>
                      </>);
                    })()}
                  </div>
                </div>
              )}

              {/* 约会事件弹窗 */}
              {dateEvent && (
                <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
                  <div style={{background:'transparent', borderRadius:'20px', padding:'30px', maxWidth:'400px', width:'100%', boxShadow:'0 16px 48px rgba(0,0,0,0.4)'}}>
                    <div style={{fontSize:'36px', textAlign:'center', marginBottom:'12px'}}>{dateEvent.candidateIcon}</div>
                    <div style={{fontSize:'14px', color:'#333', lineHeight:1.7, marginBottom:'8px'}}>{dateEvent.text.replace('{name}', dateEvent.candidateName)}</div>
                    <div style={{fontSize:'15px', fontWeight:'bold', color:'#E91E63', marginBottom:'16px'}}>{dateEvent.question}</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {dateEvent.options.map((opt, i) => (
                        <button key={i} onClick={() => handleDateChoice(i)} style={{
                          padding:'12px 16px', borderRadius:'12px', border:'2px solid #F8BBD0',
                          background:'transparent', color:'#333', fontSize:'13px', cursor:'pointer', textAlign:'left',
                          transition:'all 0.2s'
                        }}
                        className="quiz-option-btn"
                        >{opt.text}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 配偶状态卡 */}
              {marriage.spouse && (() => {
                const sp = MARRIAGE_CANDIDATES.find(c => c.id === marriage.spouse);
                if (!sp) return null;
                const aff = marriage.affections[marriage.spouse] || 0;
                const ml = getMarriageLevel(aff);
                return (
                  <div style={{background:'linear-gradient(135deg,#E91E63,#F06292)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <div style={{width:'56px', height:'56px', borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px'}}>{sp.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'18px'}}>💕 {sp.name} <span style={{fontSize:'12px', opacity:0.85}}>({sp.title})</span></div>
                        <div style={{fontSize:'12px', opacity:0.85}}>婚姻等级：{ml.name} · 好感度 {aff}</div>
                        {(() => {
                          const MLEVELS = [1000, 2000, 4000, 8000];
                          const curMin = ml.min || 0;
                          const nextIdx = MLEVELS.findIndex(v => v > aff);
                          const nextMin = nextIdx >= 0 ? MLEVELS[nextIdx] : MLEVELS[MLEVELS.length-1];
                          const pct = nextIdx >= 0 ? Math.min(100, Math.round((aff - curMin) / (nextMin - curMin) * 100)) : 100;
                          return <div style={{marginTop:'4px', display:'flex', alignItems:'center', gap:'6px'}}>
                            <progress className="housing-progress" aria-label="婚姻亲密进度" max={100} value={pct} />
                            <span style={{fontSize:'10px', opacity:0.8}}>{pct >= 100 ? '已满' : `${aff}/${nextMin}`}</span>
                          </div>;
                        })()}
                        <div style={{fontSize:'11px', opacity:0.7, marginTop:'2px'}}>结婚日期：{marriage.weddingDate}</div>
                      </div>
                    </div>
                    <div style={{marginTop:'12px', fontSize:'11px', opacity:0.8}}>专属加成：{sp.bonusDesc}</div>
                    <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                      <button onClick={() => handleChat(marriage.spouse)} style={{flex:1, padding:'8px', borderRadius:'10px', border:'none', background:'rgba(255,255,255,0.2)', color:'#fff', fontWeight:'bold', fontSize:'12px', cursor:'pointer'}}>💬 聊天</button>
                      <button onClick={() => handleDate(marriage.spouse)} style={{flex:1, padding:'8px', borderRadius:'10px', border:'none', background:'rgba(255,255,255,0.2)', color:'#fff', fontWeight:'bold', fontSize:'12px', cursor:'pointer'}}>☕ 约会</button>
                      <button onClick={claimSpouseGift} disabled={marriage.lastSpouseGiftDate === getLocalDateStr()} style={{flex:1, padding:'8px', borderRadius:'10px', border:'none', background: marriage.lastSpouseGiftDate === getLocalDateStr() ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)', color:'#fff', fontWeight:'bold', fontSize:'12px', cursor: marriage.lastSpouseGiftDate === getLocalDateStr() ? 'not-allowed' : 'pointer'}}>🎁 {marriage.lastSpouseGiftDate === getLocalDateStr() ? '已领取' : '每日礼物'}</button>
                      <button onClick={handleDivorce} style={{padding:'8px 12px', borderRadius:'10px', border:'none', background:'rgba(0,0,0,0.2)', color:'rgba(255,255,255,0.6)', fontSize:'11px', cursor:'pointer'}}>离婚</button>
                    </div>
                  </div>
                );
              })()}

              {/* 待婚礼 + 任务链 */}
              {marriage.pendingPropose && !marriage.spouse && (() => {
                const pp = MARRIAGE_CANDIDATES.find(c => c.id === marriage.pendingPropose);
                const { quest, steps, allDone } = getQuestProgress(marriage.pendingPropose);
                return (
                  <div style={{background:'linear-gradient(135deg,#FF6F00,#FFA726)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'40px', marginBottom:'8px'}}>💍</div>
                      <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'4px'}}>{pp?.name || '对方'}已经答应了你的求婚！</div>
                      <div style={{fontSize:'12px', opacity:0.85, marginBottom:'12px'}}>完成考验后即可举办婚礼</div>
                    </div>
                    {quest && (
                      <div style={{background:'rgba(0,0,0,0.15)', borderRadius:'12px', padding:'14px', marginBottom:'14px'}}>
                        <div style={{fontWeight:'bold', fontSize:'13px', marginBottom:'10px'}}>📋 {quest.name}</div>
                        {steps.map(s => (
                          <div key={s.id} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                            <span style={{fontSize:'16px'}}>{s.done ? '✅' : s.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:'12px', opacity: s.done ? 0.7 : 1}}>{s.desc}</div>
                              <progress className="housing-progress" aria-label={s.desc} max={s.target || 1} value={Math.min(s.target || 1, s.current)} style={{marginTop:'3px'}} />
                            </div>
                            <span style={{fontSize:'11px', fontWeight:'bold', opacity:0.8}}>{s.current}/{s.target}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{textAlign:'center'}}>
                      {allDone ? (
                        <>
                          <div style={{fontSize:'12px', opacity:0.85, marginBottom:'12px'}}>所有考验已完成！举办婚礼需要 💰 {WEDDING_COST} 金币</div>
                          <button onClick={handleWedding} disabled={gold < WEDDING_COST} style={{
                            padding:'12px 30px', borderRadius:'25px', border:'none', fontWeight:'bold', fontSize:'14px',
                            background: gold < WEDDING_COST ? '#ccc' : '#fff', color: gold < WEDDING_COST ? '#999' : '#E91E63',
                            cursor: gold < WEDDING_COST ? 'not-allowed' : 'pointer', boxShadow:'0 4px 15px rgba(0,0,0,0.2)'
                          }}>🎊 举办婚礼</button>
                        </>
                      ) : (
                        <div style={{fontSize:'12px', opacity:0.7}}>完成所有考验后才能举办婚礼</div>
                      )}
                      <button onClick={cancelPropose} style={{marginTop:'8px',padding:'6px 16px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.3)',background:'transparent',color:'rgba(255,255,255,0.7)',fontSize:'11px',cursor:'pointer'}}>取消求婚</button>
                    </div>
                  </div>
                );
              })()}

              {/* 候选人列表 */}
              <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'12px', color:'#333'}}>
                {marriage.spouse ? '💕 其他认识的人' : '💕 约会角落'}
              </div>
              {!cafe.owned && (
                <div style={{padding:'20px', textAlign:'center', background:'#FFF3E0', borderRadius:'12px', border:'1px solid #FFE0B2', marginBottom:'16px'}}>
                  <div style={{fontSize:'32px', marginBottom:'8px'}}>☕</div>
                  <div style={{fontWeight:'bold', color:'#E65100', marginBottom:'4px'}}>需要先拥有咖啡厅</div>
                  <div style={{fontSize:'12px', color:'#999'}}>通关莉可莉丝篇后购买咖啡厅，即可解锁约会功能</div>
                </div>
              )}
              {cafe.owned && (
                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                  {(() => {
                    const available = getAvailableCandidates();
                    const locked = MARRIAGE_CANDIDATES.filter(c => !available.find(a => a.id === c.id));
                    return (<>
                      {available.map(c => {
                        const aff = marriage.affections[c.id] || 0;
                        const stage = getAffectionStage(aff);
                        const isSpouse = marriage.spouse === c.id;
                        if (isSpouse) return null;
                        const nextStage = AFFECTION_STAGES[AFFECTION_STAGES.indexOf(stage) + 1];
                        return (
                          <div key={c.id} style={{background:'transparent', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', border: stage.id === 'lover' ? '2px solid #E91E63' : '1px solid #eee'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px'}}>
                              <div style={{width:'48px', height:'48px', borderRadius:'50%', background:`linear-gradient(135deg,${stage.color}33,${stage.color}11)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', border:`2px solid ${stage.color}44`}}>{c.icon}</div>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:'bold', fontSize:'14px'}}>{c.name} <span style={{fontSize:'11px', color:'#999'}}>({c.title})</span></div>
                                <div style={{fontSize:'12px', color:stage.color, fontWeight:'bold'}}>{stage.icon} {stage.name} · 好感度 {aff}{nextStage ? ` / ${nextStage.min}` : ''}</div>
                              </div>
                            </div>
                            <div style={{fontSize:'12px', color:'#888', marginBottom:'10px'}}>{c.desc}</div>
                            {nextStage && (
                              <progress className="housing-progress" aria-label={`${c.name}好感进度`} max={Math.max(1, nextStage.min - stage.min)} value={Math.max(0, aff - stage.min)} style={{marginBottom:'10px'}} />
                            )}
                            <div style={{fontSize:'11px', color:'#aaa', marginBottom:'10px'}}>加成：{c.bonusDesc}</div>
                            <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                              {(() => { const chatUsed = marriage.dailyCounts?.chats?.[c.id]; return <button onClick={() => handleChat(c.id)} disabled={!!chatUsed} style={{padding:'6px 14px', borderRadius:'14px', border:'1px solid #E0E0E0', background:chatUsed?'#eee':'#fafafa', fontSize:'11px', fontWeight:'bold', cursor:chatUsed?'not-allowed':'pointer', color:chatUsed?'#bbb':'#666', opacity:chatUsed?0.6:1}}>{chatUsed ? '💬 已聊天' : '💬 聊天'}</button>; })()}
                              {(() => { const dateUsed = (marriage.dailyCounts?.dates || 0) >= DAILY_DATE_LIMIT; return <button onClick={() => handleDate(c.id)} disabled={dateUsed} style={{padding:'6px 14px', borderRadius:'14px', border:'none', background:dateUsed?'#ccc':'linear-gradient(135deg,#E91E63,#F06292)', fontSize:'11px', fontWeight:'bold', cursor:dateUsed?'not-allowed':'pointer', color:'#fff', opacity:dateUsed?0.6:1}}>{dateUsed ? '☕ 已约满' : `☕ 约会 (💰${DATE_COST})`}</button>; })()}
                              <button onClick={() => setMarriageView(c.id)} style={{padding:'6px 14px', borderRadius:'14px', border:'1px solid #E0E0E0', background:'#fafafa', fontSize:'11px', fontWeight:'bold', cursor:'pointer', color:'#666'}}>🎁 送礼</button>
                              {stage.id === 'lover' && aff >= 1000 && !marriage.spouse && !marriage.pendingPropose && (
                                <button onClick={() => handlePropose(c.id)} style={{padding:'6px 14px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#FF6F00,#FFA726)', fontSize:'11px', fontWeight:'bold', cursor:'pointer', color:'#fff'}}>💍 求婚 (💰{PROPOSE_COST})</button>
                              )}
                            </div>
                            {/* 送礼面板 */}
                            {marriageView === c.id && (
                              <div style={{marginTop:'12px', padding:'12px', background:'#f9f9f9', borderRadius:'12px', border:'1px solid #eee'}}>
                                <div style={{fontWeight:'bold', fontSize:'12px', marginBottom:'8px', color:'#666'}}>🎁 选择礼物 (今日 {marriage.dailyCounts?.gifts || 0}/{DAILY_GIFT_LIMIT})</div>
                                {(() => { const gifts = getGiftableItems(); return gifts.length === 0 ? (
                                  <div style={{fontSize:'11px', color:'#999', padding:'10px', textAlign:'center'}}>背包是空的~</div>
                                ) : (
                                  <div style={{display:'flex', flexWrap:'wrap', gap:'6px', maxHeight:'150px', overflow:'auto'}}>
                                    {gifts.map(item => (
                                      <button key={item.key} onClick={() => { handleGift(c.id, item.key); setMarriageView(null); }}
                                        style={{padding:'6px 10px', borderRadius:'8px', border:'1px solid #ddd', background:'transparent', fontSize:'11px', cursor:'pointer', color:'#333'}}>
                                        {item.icon} {item.name} {item.count > 1 ? `x${item.count}` : ''}
                                      </button>
                                    ))}
                                  </div>
                                ); })()}
                                <button onClick={() => setMarriageView(null)} style={{marginTop:'8px', padding:'4px 12px', borderRadius:'10px', border:'1px solid #ddd', background:'transparent', fontSize:'10px', cursor:'pointer', color:'#999'}}>关闭</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {locked.length > 0 && (
                        <div style={{marginTop:'8px'}}>
                          <div style={{fontSize:'12px', color:'#999', marginBottom:'8px'}}>🔒 未解锁</div>
                          {locked.map(c => (
                            <div key={c.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'12px', background:'transparent', borderRadius:'12px', marginBottom:'6px', opacity:0.6}}>
                              <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'}}>❓</div>
                              <div>
                                <div style={{fontWeight:'bold', fontSize:'13px', color:'#999'}}>{c.name}</div>
                                <div style={{fontSize:'10px', color:'#bbb'}}>
                                  {c.unlockCondition?.badges ? `需要 ${c.unlockCondition.badges} 枚徽章` : ''}
                                  {c.unlockCondition?.houseType ? `需要拥有「${HOUSE_TYPES.find(h => h.id === c.unlockCondition.houseType)?.name}」` : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>);
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  
}
