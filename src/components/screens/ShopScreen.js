import React from 'react';
import { ACCESSORY_DB } from '../../data/items';
import { BALLS } from '../../data/items';
import { BERRIES } from '../../data/items';
import { ChevronsUp } from 'lucide-react';
import { countOwnedAccessory } from '../../utils/shopRules';
import { CURSED_ITEMS } from '../../data/items';
import { EVO_STONES } from '../../data/items';
import { getMapShopTMs } from '../../utils/skillTms';
import { GROWTH_ITEMS } from '../../data/items';
import { MAPS } from '../../data';
import { MEDICINES } from '../../data/items';
import { Minus } from 'lucide-react';
import { MISC_ITEMS } from '../../data/items';
import { Plus } from 'lucide-react';
import { renderAccCSS } from '../../components/ItemIcons';
import { renderBallCSS } from '../../components/ItemIcons';
import { renderGrowthCSS } from '../../components/ItemIcons';
import { renderMedCSS } from '../../components/ItemIcons';
import { renderMiscCSS } from '../../components/ItemIcons';
import { renderStoneCSS } from '../../components/ItemIcons';
import { renderTMCSS } from '../../components/ItemIcons';
import { TYPES } from '../../data/types';

export default function ShopScreen({
  accessories,
  ALL_SKILL_TMS,
  badges,
  box,
  buyCounts,
  buyItemPro,
  currentMapId,
  gold,
  inventory,
  normalizeBerriesInventory,
  party,
  setBuyCounts,
  setShopMode,
  setShopTab,
  setShopTMFilter,
  setShopTmsVisibleCount,
  shopMode,
  shopTab,
  shopTMFilter,
  shopTmsVisibleCount,
  updateBuyCount
}) {
    if (!shopMode) return null;
    const mapInfo = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const badgeCount = badges?.length || 0;
    const tier = badgeCount < 3 ? 1 : badgeCount < 6 ? 2 : badgeCount < 9 ? 3 : 4;
    const tierName = ['', '初级商店', '进阶商店', '高级商店', '顶级商店'][tier];
    const tierColor = ['', '#78909C', '#2196F3', '#9C27B0', '#FF6F00'][tier];

    const ballsByTier = {
      1: ['poke','great','heal'],
      2: ['poke','great','ultra','heal','net','dusk'],
      3: ['poke','great','ultra','heal','net','dusk','quick','timer'],
      4: ['poke','great','ultra','heal','net','dusk','quick','timer'],
    };
    const availMedsAll = Object.values(MEDICINES).filter(m => m.mapTier <= tier);
    const availMedIds = availMedsAll.map(m => m.id);
    const availTMs = getMapShopTMs(ALL_SKILL_TMS, currentMapId || 1, tier);
    const growthByTier = {
      1: [],
      2: ['vit_hp','vit_patk','vit_pdef','exp_candy'],
      3: ['vit_hp','vit_patk','vit_pdef','vit_satk','vit_sdef','vit_spd','exp_candy'],
      4: ['vit_hp','vit_patk','vit_pdef','vit_satk','vit_sdef','vit_spd','vit_crit','exp_candy','max_candy'],
    };
    const accByTier = {
      1: ['a1','a3','a10'],
      2: ['a1','a3','a10','a11'],
      3: ['a1','a3','a10','a11','a22','a23','a24'],
      4: ['a1','a3','a10','a11','a22','a23','a24','a28','a12'],
    };
    const showStones = tier >= 2;
    const showCursed = tier >= 3;
    const showSpecial = tier >= 4;

    const availBalls = ballsByTier[tier];
    const availMeds = availMedIds;
    const availBerryIds = Object.values(BERRIES).filter(b => b.mapTier <= tier).map(b => b.id);
    const availGrowth = growthByTier[tier];
    const availAcc = accByTier[tier];
    const shelfTypes = new Set(availTMs.map(id => ALL_SKILL_TMS.find(tm => tm.id === id)?.type));
    const activeShopTMFilter = shelfTypes.has(shopTMFilter) ? shopTMFilter : null;
    const filteredShopTmIds = availTMs.filter(tmId => !activeShopTMFilter || ((ALL_SKILL_TMS.find(t => t.id === tmId)?.type || 'NORMAL') === activeShopTMFilter));
    const pagedShopTmIds = filteredShopTmIds.slice(0, shopTmsVisibleCount);
    const nextTierNeed = tier === 1 ? 3 : tier === 2 ? 6 : tier === 3 ? 9 : null;
    const nextTierLeft = nextTierNeed ? Math.max(0, nextTierNeed - badgeCount) : 0;
    const shelfCounts = {
      balls: availBalls.length,
      items: availMeds.length,
      berries: availBerryIds.length,
      tms: filteredShopTmIds.length,
      stones: showStones ? Object.keys(EVO_STONES).length : 0,
      growth: availGrowth.length,
      accessories: availAcc.length,
      cursed: showCursed ? Object.values(CURSED_ITEMS).filter(item => item && item.price > 0).length : 0,
      special: showSpecial ? 1 : 0,
    };

    const renderShopCard = (key, icon, name, desc, unitPrice, buyType, extra) => {
                const count = buyCounts[key] || 1;
      const totalPrice = unitPrice * count;
                return (
        <article key={key} className="market-item-card" style={{
          '--market-accent': extra?.borderColor || tierColor,
          background:'linear-gradient(145deg, #ffffff, #f8f9ff)', borderRadius:'16px',
          padding:'18px 14px 14px', display:'flex', flexDirection:'column', alignItems:'center',
          textAlign:'center', border:'1px solid #e8eaf6', position:'relative',
          transition:'all 0.25s ease', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
          ...(extra?.borderColor ? {borderLeft:`3px solid ${extra.borderColor}`} : {})
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}
        >
          {extra?.tag && <span className="market-item-tag" style={{background:extra.tagColor||'#4CAF50'}}>{extra.tag}</span>}
          <div className="market-item-icon">{icon}</div>
          <div className="market-item-name">{name}</div>
          <div className="market-item-desc" title={desc}>{desc}</div>
          {buyType === 'ball' && <div className="market-owned">持有: {inventory.balls?.[key.replace('ball_','')]||0}</div>}
          {buyType === 'item' && <div className="market-owned">持有: {inventory.meds?.[key] || inventory[key] || 0}</div>}
          {buyType === 'berry' && <div className="market-owned">持有: {normalizeBerriesInventory(inventory.berries)[key] || 0}</div>}
          {buyType === 'stone' && <div className="market-owned">持有: {inventory.stones?.[key] || 0}</div>}
          {buyType === 'cursed' && <div className="market-owned">持有: {(inventory.cursed || {})[key] || 0}</div>}
          <div className="market-price">{count > 1 ? `💰 ${unitPrice.toLocaleString()} × ${count} = ${totalPrice.toLocaleString()}金` : `💰 ${totalPrice.toLocaleString()}金`}</div>
          <div className="market-qty-stepper">
            <button type="button" aria-label={`减少${name}购买数量`} title="减少数量" disabled={count <= 1} onClick={()=>updateBuyCount(key,-1)}><Minus size={14}/></button>
            <span>{count}</span>
            <button type="button" aria-label={`增加${name}购买数量`} title="增加数量" disabled={count >= 99} onClick={()=>updateBuyCount(key,1)}><Plus size={14}/></button>
            <button type="button" className="is-max" aria-label={`${name}最大可购数量`} title="最大可购数量（最多99）" disabled={gold < unitPrice} onClick={()=>{const maxAfford=Math.min(99,Math.floor(gold/unitPrice));if(maxAfford>0)setBuyCounts(p=>({...p,[key]:maxAfford}))}}><ChevronsUp size={15}/></button>
                    </div>
          <button onClick={()=>buyItemPro(key,unitPrice,buyType)} disabled={gold < totalPrice}
            className="market-buy-btn"
            style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=totalPrice?'pointer':'not-allowed',
              background:gold>=totalPrice?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
              color:gold>=totalPrice?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=totalPrice?'0 3px 8px rgba(0,0,0,0.15)':'none'
          }}>购买</button>
                  </article>
                );
    };

    const tabs = [
      {id:'balls',label:'精灵球',icon:'🔴'},
      {id:'items',label:'药品',icon:'💊'},
      {id:'berries',label:'树果',icon:'🍇'},
      {id:'tms',label:'技能书',icon:'📀'},
      ...(showStones?[{id:'stones',label:'进化石',icon:'💎'}]:[]),
      ...(availGrowth.length>0?[{id:'growth',label:'增强',icon:'💪'}]:[]),
      {id:'accessories',label:'饰品',icon:'💍'},
      ...(showCursed?[{id:'cursed',label:'咒具',icon:'🔮'}]:[]),
      ...(showSpecial?[{id:'special',label:'特殊',icon:'✨'}]:[]),
    ];
    const activeShelf = tabs.find(t => t.id === shopTab) || tabs[0];

                return (
      <div className="modal-overlay market-overlay">
        <div className="shop-modal-pro market-console" style={{'--market-accent': tierColor, background:'linear-gradient(180deg,#f8f9ff,#eef1ff)',borderRadius:'20px'}}>
          <aside className="shop-nav-sidebar market-sidebar" style={{background:'linear-gradient(180deg,#1a1a2e,#16213e)',borderRight:'none',padding:'0',borderRadius:'20px 0 0 20px'}}>
            <div className="market-brand">
              <span>{mapInfo.name}</span>
              <strong>{tierName}</strong>
              <small>{badgeCount} 枚徽章 · {nextTierNeed ? `距下一阶 ${nextTierLeft} 枚` : '最高阶货架'}</small>
                    </div>
            <div className="market-nav-list">
            {tabs.map(t=>(
              <button key={t.id} type="button" className={`shop-nav-item market-nav-item ${shopTab===t.id?'active':''}`}
                style={{padding:'12px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',fontWeight:'600',
                  color:shopTab===t.id?'#fff':'rgba(255,255,255,0.5)',
                  background:shopTab===t.id?`linear-gradient(90deg,${tierColor}40,transparent)`:'transparent',
                  borderLeft:shopTab===t.id?`3px solid ${tierColor}`:'3px solid transparent',
                  transition:'background 0.35s ease, color 0.25s ease, border-color 0.35s ease, padding 0.2s ease'}}
                onClick={()=>setShopTab(t.id)}>
                <span>{t.icon}</span>
                <strong>{t.label}</strong>
                <small>{shelfCounts[t.id] || 0}</small>
                  </button>
            ))}
            </div>
            <div className="market-wallet">
              <span>持有金币</span>
              <strong>💰 {gold.toLocaleString()}</strong>
                    </div>
            <button className="market-close-btn" style={{margin:'8px 12px 14px',padding:'8px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',color:'rgba(255,255,255,0.7)',fontSize:'12px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShopMode(false)}>关闭商店</button>
                  </aside>

          <div className="shop-content-area shop-tab-content-enter" style={{padding:'20px',overflowY:'auto',transition:'opacity 0.35s ease, transform 0.3s ease'}} key={shopTab}>
            <div className="market-shelf-hero" style={{marginBottom:'14px',padding:'10px 14px',borderRadius:'12px',background:`linear-gradient(90deg,${tierColor}22,transparent)`,border:`1px solid ${tierColor}44`,fontSize:'12px',fontWeight:'700',color:'#1a1a2e',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'6px',flexWrap:'wrap'}}>
              <div className="market-shelf-title">
                <span className="market-shelf-icon">{activeShelf.icon}</span>
                <div>
                  <strong>{activeShelf.label}</strong>
                  <small>{shelfCounts[shopTab] || 0} 件可购 · {['', '初级', '进阶', '高级', '顶级'][tier]}货架</small>
                </div>
                <b>💰 {gold.toLocaleString()}</b>
              </div>
              <div className="market-unlock-note" style={{fontSize:'11px',fontWeight:'600',color:'#546e7a',lineHeight:1.45}}>
                解锁条件：初级需徽章{'<'}3枚 · 进阶3~5枚 · 高级6~8枚 · 顶级≥9枚。{tier < 4 ? `再获得 ${Math.max(0, (tier === 1 ? 3 : tier === 2 ? 6 : 9) - badgeCount)} 枚徽章升至「${['','进阶','高级','顶级'][tier]}商店」。` : '已解锁顶级商品池。'}
              </div>
            </div>
            {shopTab==='tms' && (
              <div className="market-type-filters" style={{display:'flex',gap:'4px',flexWrap:'wrap',marginBottom:'10px'}}>
                <button aria-pressed={activeShopTMFilter === null} onClick={()=>setShopTMFilter(null)}>全部</button>
                {Object.entries(TYPES).filter(([k])=>shelfTypes.has(k)).map(([k,v])=>(
                  <button key={k} aria-pressed={activeShopTMFilter === k} onClick={()=>setShopTMFilter(k)}>{v.name||k}</button>
                ))}
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'14px'}}>
              {shopTab==='balls' && availBalls.map(type=>{
                const item=BALLS[type]; if(!item) return null;
                return renderShopCard(`ball_${type}`,renderBallCSS(type,36)||item.icon,item.name,item.desc,item.price,'ball');
              })}
              {shopTab==='items' && availMeds.map(key=>{
                const item=MEDICINES[key]; if(!item) return null;
                return renderShopCard(key,renderMedCSS(key,36)||<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'item');
              })}
              {shopTab==='berries' && availBerryIds.map(key=>{
                const item=BERRIES[key]; if(!item) return null;
                return renderShopCard(key,<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'berry');
              })}
              {shopTab==='tms' && filteredShopTmIds.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px 16px', color: '#78909C', fontSize: '13px', lineHeight: 1.6 }}>
                  当前筛选下暂无可购技能书。<br />
                  <span style={{ fontSize: '12px', opacity: 0.9 }}>更多强力技能书可从副本/活动获得。威力&gt;70 的进阶技能需副本掉落、道馆首胜、矿洞兑换、探险、联盟夺冠、世界Boss 等途径；也可调整属性筛选或提升商店阶位后再试。</span>
                </div>
              )}
              {shopTab==='tms' && pagedShopTmIds.map(tmId=>{
                const tm=ALL_SKILL_TMS.find(t=>t.id===tmId); if(!tm) return null;
                const alreadyOwned = (inventory.tms?.[tmId]||0) > 0;
                const tierLabel = tm.tier===1?'基础':tm.tier===2?'进阶':'高级';
                const tierTagColor = tm.tier===1?'#78909C':tm.tier===2?'#43A047':'#FB8C00';
                const typeColor = TYPES[tm.type]?.color||'#888';
                const displayPrice = tm.price;
                        return (
                  <div className="market-item-card market-unique-card" key={tmId} style={{
                    background: alreadyOwned?'linear-gradient(145deg,#f0f0f0,#e8e8e8)':'linear-gradient(145deg, #ffffff, #f8f9ff)',borderRadius:'16px',
                    padding:'18px 14px 14px',display:'flex',flexDirection:'column',alignItems:'center',
                    textAlign:'center',border:alreadyOwned?'1px solid #ccc':`1px solid #e8eaf6`,position:'relative',
                    transition:'all 0.25s ease',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft:`3px solid ${alreadyOwned?'#aaa':typeColor}`,opacity:alreadyOwned?0.7:1,
                  }}
                  onMouseEnter={e=>{if(!alreadyOwned){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}>
                    <span style={{position:'absolute',top:'-6px',right:'8px',background:tierTagColor,color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700',boxShadow:'0 2px 4px rgba(0,0,0,0.15)'}}>{tierLabel}</span>
                    <span style={{ position:'absolute', top:'-6px', left:'8px', background:'#FF6F00', color:'#fff', fontSize:'9px', padding:'2px 8px', borderRadius:'8px', fontWeight:'700', zIndex:1 }}>限购1</span>
                    <div style={{fontSize:'36px',marginBottom:'8px',filter:alreadyOwned?'grayscale(1)':'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{renderTMCSS(tm.type||'NORMAL',36)}</div>
                    <div className="market-item-name">{tm.name}</div>
                    <div className="market-item-desc">{TYPES[tm.type]?.name||''} · 威力{tm.p}</div>
                    <div className="market-price">💰 {displayPrice.toLocaleString()}</div>
                    {alreadyOwned?(
                      <div className="market-owned">已拥有</div>
                    ):(
                      <button className="market-buy-btn" onClick={()=>buyItemPro(tm.id,displayPrice,'tm')} disabled={gold<displayPrice}
                        style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=displayPrice?'pointer':'not-allowed',
                          background:gold>=displayPrice?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
                          color:gold>=displayPrice?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=displayPrice?'0 3px 8px rgba(0,0,0,0.15)':'none'
                        }}>购买</button>
                    )}
                        </div>
                        );
                    })}
              {shopTab==='tms' && filteredShopTmIds.length > shopTmsVisibleCount && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8px 0 4px' }}>
                  <button
                    type="button"
                    onClick={() => setShopTmsVisibleCount(c => c + 50)}
                    style={{
                      padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,111,0,0.35)',
                      background: 'linear-gradient(135deg,#fff,#f8f9ff)', color: '#E65100', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    加载更多（已显示 {Math.min(shopTmsVisibleCount, filteredShopTmIds.length)}/{filteredShopTmIds.length}）
                  </button>
                </div>
              )}
              {shopTab==='stones' && Object.keys(EVO_STONES).map(key=>{
                const item=EVO_STONES[key];
                return renderShopCard(key,renderStoneCSS(key,36)||<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'stone',{borderColor:'#9C27B0'});
              })}
              {shopTab==='growth' && availGrowth.map(gId=>{
                const item=GROWTH_ITEMS.find(g=>g.id===gId); if(!item) return null;
                const extra = gId==='max_candy'?{tag:'稀有',tagColor:'#E91E63'}:gId==='exp_candy'?{tag:'热卖',tagColor:'#4CAF50'}:{};
                return renderShopCard(item.id,renderGrowthCSS(item.id,36)||<span style={{fontSize:30}}>{item.emoji}</span>,item.name,item.desc,item.price,'item',extra);
              })}
              {shopTab==='accessories' && availAcc.map(accId=>{
                const acc=ACCESSORY_DB.find(a=>a.id===accId); if(!acc) return null;
                const accOwned = countOwnedAccessory(accId, accessories, [...party, ...box]);
                        return (
                  <div className="market-item-card market-unique-card" key={accId} style={{
                    background:accOwned>0?'linear-gradient(145deg,#f0f0f0,#e8e8e8)':'linear-gradient(145deg,#ffffff,#f8f9ff)',borderRadius:'16px',
                    padding:'18px 14px 14px',display:'flex',flexDirection:'column',alignItems:'center',
                    textAlign:'center',border:accOwned>0?'1px solid #ccc':'1px solid #e8eaf6',position:'relative',
                    transition:'all 0.25s ease',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft:`3px solid ${accOwned>0?'#aaa':'#EC407A'}`,opacity:accOwned>0?0.7:1,
                  }}
                  onMouseEnter={e=>{if(!accOwned){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}>
                    <span style={{position:'absolute',top:'-6px',left:'8px',background:'#FF6F00',color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700'}}>限购1</span>
                    <div style={{fontSize:'36px',marginBottom:'8px',filter:accOwned>0?'grayscale(1)':'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{renderAccCSS(acc.id,36)||<span style={{fontSize:30}}>{acc.icon}</span>}</div>
                    <div className="market-item-name">{acc.name}</div>
                    <div className="market-item-desc">{acc.desc}</div>
                    <div className="market-price">💰 {acc.price.toLocaleString()}</div>
                    {accOwned>0?(
                      <div className="market-owned">已拥有</div>
                    ):(
                      <button className="market-buy-btn" onClick={()=>buyItemPro(acc.id,acc.price,'acc')} disabled={gold<acc.price}
                        style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=acc.price?'pointer':'not-allowed',
                          background:gold>=acc.price?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
                          color:gold>=acc.price?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=acc.price?'0 3px 8px rgba(0,0,0,0.15)':'none'
                        }}>购买</button>
                    )}
                        </div>
                        );
                    })}
              {shopTab==='cursed' && Object.keys(CURSED_ITEMS).map(key=>{
                const item=CURSED_ITEMS[key]; if(!item||item.price<=0) return null;
                return renderShopCard(key,<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'cursed',{borderColor:'#4A148C'});
              })}
              {shopTab==='special' && (
                <>
                  {renderShopCard(MISC_ITEMS.rebirth_pill.id,renderMiscCSS(36),MISC_ITEMS.rebirth_pill.name,MISC_ITEMS.rebirth_pill.desc,MISC_ITEMS.rebirth_pill.price,'item',{tag:'特殊',tagColor:'#E91E63',borderColor:'#E91E63'})}
                </>
              )}
                    </div>
          </div>
        </div>
      </div>
    );
  
}
