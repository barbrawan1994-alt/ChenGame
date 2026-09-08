import React from 'react';
import { FRUIT_CATEGORY_NAMES } from '../../data/devilfruits';
import { FRUIT_RARITY_CONFIG } from '../../data/devilfruits';
import { getAllFruits } from '../../data/devilfruits';
import { renderFruitCSSIcon } from '../../components/ItemIcons';
import { TYPES } from '../../data/types';

export default function FruitDexScreen({
  fruitDexCatFilter,
  fruitDexRarFilter,
  fruitDexSelected,
  fruitInventory,
  party,
  safeBack,
  setFruitDexCatFilter,
  setFruitDexRarFilter,
  setFruitDexSelected,
  setView
}) {
  const allFruits = getAllFruits();
  const categories = ['ALL', 'PARAMECIA', 'ZOAN', 'LOGIA'];
  const rarities = ['ALL', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON'];
  const catFilter = fruitDexCatFilter;
  const setCatFilter = setFruitDexCatFilter;
  const rarFilter = fruitDexRarFilter;
  const setRarFilter = setFruitDexRarFilter;
  const selectedFruit = fruitDexSelected;
  const setSelectedFruit = setFruitDexSelected;

  const filtered = allFruits.filter(f => {
    if (catFilter !== 'ALL' && f.category !== catFilter) return false;
    if (rarFilter !== 'ALL' && f.rarity !== rarFilter) return false;
    return true;
  });

  const ownedFruitIds = new Set(fruitInventory);
  party.forEach(p => { if (p.devilFruit) ownedFruitIds.add(p.devilFruit); });

  const catNames = { ALL: '全部', PARAMECIA: '超人系', ZOAN: '动物系', LOGIA: '自然系' };
  const catColors = { ALL: '#666', PARAMECIA: '#FF6F00', ZOAN: '#2E7D32', LOGIA: '#1565C0' };
  const rarNames = { ALL: '全部', LEGENDARY: '传说', EPIC: '史诗', RARE: '稀有', COMMON: '普通' };

  const buildEffectDesc = (tr) => {
    const parts = [];
    if (tr.atkMult) parts.push(`物攻×${tr.atkMult}`);
    if (tr.sAtkMult) parts.push(`特攻×${tr.sAtkMult}`);
    if (tr.defMult) parts.push(`物防×${tr.defMult}`);
    if (tr.sDefMult) parts.push(`特防×${tr.sDefMult}`);
    if (tr.spdMult) parts.push(`速度×${tr.spdMult}`);
    if (tr.hpMult) parts.push(`HP×${tr.hpMult}`);
    if (tr.movePowerBoost) parts.push(`技能威力+${(tr.movePowerBoost*100).toFixed(0)}%`);
    if (tr.critBoost) parts.push(`暴击+${tr.critBoost}级`);
    if (tr.evaBoost) parts.push(`闪避+${(tr.evaBoost*100).toFixed(0)}%`);
    if (tr.ignoreDefPercent) parts.push(`无视${(tr.ignoreDefPercent*100).toFixed(0)}%防御`);
    if (tr.fixedDmgPercent) parts.push(`附加${(tr.fixedDmgPercent*100).toFixed(0)}%固定伤`);
    if (tr.healPerTurn) parts.push(`每回合回${(tr.healPerTurn*100).toFixed(0)}%HP`);
    if (tr.selfDotPerTurn) parts.push(`每回合自损${(tr.selfDotPerTurn*100).toFixed(0)}%HP`);
    if (tr.dotPerTurn) parts.push(`敌方每回合损${(tr.dotPerTurn*100).toFixed(0)}%HP`);
    if (tr.typeImmune) parts.push(`免疫${TYPES[tr.typeImmune]?.name || tr.typeImmune}系`);
    if (tr.reflectPhysical) parts.push(`反弹${(tr.reflectPhysical*100).toFixed(0)}%物理伤`);
    if (tr.reflectAll) parts.push(`反弹${(tr.reflectAll*100).toFixed(0)}%所有伤`);
    if (tr.onHitBurn) parts.push(`${(tr.onHitBurn*100).toFixed(0)}%概率灼伤`);
    if (tr.onHitPoison) parts.push(`${(tr.onHitPoison*100).toFixed(0)}%概率中毒`);
    if (tr.onHitFreeze) parts.push(`${(tr.onHitFreeze*100).toFixed(0)}%概率冰冻`);
    if (tr.onHitConfuse) parts.push(`${(tr.onHitConfuse*100).toFixed(0)}%概率混乱`);
    if (tr.hpDrain) parts.push(`吸血${(tr.hpDrain*100).toFixed(0)}%`);
    if (tr.multiHit) parts.push(`${tr.multiHit}连击`);
    if (tr.enemySpdDown) parts.push(`每回合降速-${tr.enemySpdDown}级`);
    if (tr.enemyAtkDown) parts.push(`每回合降攻-${tr.enemyAtkDown}级`);
    if (tr.enemyAccDown) parts.push(`每回合降命中-${tr.enemyAccDown}级`);
    if (tr.cancelEnemyFruit) parts.push('取消敌方变身');
    if (tr.typeBoost) parts.push(`增伤:${Object.entries(tr.typeBoost).map(([k,v])=>`${TYPES[k]?.name||k}×${v}`).join(',')}`);
    if (tr.convertNormalTo) parts.push(`普通技→${TYPES[tr.convertNormalTo]?.name || tr.convertNormalTo}系`);
    return parts;
  };

  const ownedFruitCount = ownedFruitIds.size;
  const fruitProgress = allFruits.length ? Math.round((ownedFruitCount / allFruits.length) * 100) : 0;
  const categoryStats = categories.filter(c => c !== 'ALL').map(c => {
    const items = allFruits.filter(f => f.category === c);
    return { c, total: items.length, owned: items.filter(f => ownedFruitIds.has(f.id)).length };
  });

  return (
    <div className="screen codex-screen is-fruit">
      <div className="codex-shell">
        <header className="codex-hero">
          <button className="codex-back" onClick={() => setView(safeBack())}>← 返回</button>
          <div className="codex-title-block">
            <span>Devil Fruit Archive</span>
            <h1>恶魔果实图鉴</h1>
            <p>按系别与稀有度检索果实，查看变身增益、专属技能和获取方式。</p>
          </div>
          <div className="codex-hero-count"><b>{ownedFruitCount}</b><span>/{allFruits.length} 已拥有</span></div>
        </header>

        <section className="codex-overview">
          <article className="codex-panel codex-progress-panel">
            <div className="codex-ring" style={{'--progress': `${fruitProgress}%`}}>
              <b>{fruitProgress}%</b>
              <span>拥有率</span>
            </div>
            <div className="codex-panel-copy">
              <span>Fruit Vault</span>
              <strong>{filtered.length} 个条目</strong>
              <p>当前筛选为 {catNames[catFilter]} · {rarNames[rarFilter]}，点击果实查看完整能力。</p>
            </div>
          </article>
          <article className="codex-panel codex-stat-panel">
            <div className="codex-panel-head"><span>系别进度</span><b>{ownedFruitCount} 种</b></div>
            <div className="codex-mini-bars">
              {categoryStats.map(({c, total, owned}) => (
                <div key={c} className="codex-mini-bar" style={{'--bar-color': catColors[c]}}>
                  <span>{catNames[c]}</span>
                  <i><em style={{width: `${total ? (owned / total) * 100 : 0}%`}} /></i>
                  <b>{owned}/{total}</b>
                </div>
              ))}
            </div>
          </article>
          <article className="codex-panel codex-insight-panel">
            <span>能力索引</span>
            <strong>{rarNames[rarFilter]} · {catNames[catFilter]}</strong>
            <p>保留原有变身效果、变身技能和掉落说明，便于训练前快速比对。</p>
          </article>
        </section>

        <section className="codex-toolbar">
          <div className="codex-chip-row">
            {categories.map(c => (
              <button key={c} className={`codex-chip ${catFilter === c ? 'active' : ''}`} style={{'--chip-color': catColors[c]}} onClick={() => setCatFilter(c)}>{catNames[c]}</button>
            ))}
            {rarities.map(r => (
              <button key={r} className={`codex-chip ${rarFilter === r ? 'active' : ''}`} style={{'--chip-color': FRUIT_RARITY_CONFIG[r]?.color || '#ff9f43'}} onClick={() => setRarFilter(r)}>{rarNames[r]}</button>
            ))}
          </div>
        </section>

        <div className="codex-grid codex-fruit-grid">
          {filtered.map(fruit => {
            const rc = FRUIT_RARITY_CONFIG[fruit.rarity];
            const owned = ownedFruitIds.has(fruit.id);
            const catC = catColors[fruit.category];
            return (
              <button key={fruit.id} type="button" onClick={() => setSelectedFruit(fruit)} className={`codex-fruit-card ${owned ? 'owned' : ''}`} style={{'--card-color': rc.color, '--fruit-cat': catC}}>
                <span className="codex-fruit-owned">{owned ? '已拥有' : '未拥有'}</span>
                <div className="codex-fruit-icon">
                  {renderFruitCSSIcon(fruit.id, 44)}
                </div>
                <strong>{fruit.name}</strong>
                <div className="codex-card-meta">
                  <span>{FRUIT_CATEGORY_NAMES[fruit.category]}</span>
                  <span>{rc.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 果实详情弹窗 */}
      {selectedFruit && (() => {
        const f = selectedFruit;
        const rc = FRUIT_RARITY_CONFIG[f.rarity];
        const catC = catColors[f.category];
        const effects = buildEffectDesc(f.transform);
        const tm = f.transformMove;
        const owned = ownedFruitIds.has(f.id);
        return (
          <div onClick={() => setSelectedFruit(null)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width:'90%', maxWidth:'400px', maxHeight:'85vh', overflowY:'auto',
              background:'linear-gradient(170deg, #1e1e2e, #0f0f1f)', borderRadius:'20px',
              border:`1px solid ${rc.color}40`, boxShadow:`0 16px 48px rgba(0,0,0,0.5), 0 0 30px ${rc.color}15`,
              position:'relative'
            }}>
              {/* 顶部光晕 */}
              <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'200px', height:'80px', background:`radial-gradient(ellipse, ${rc.color}25, transparent)`, pointerEvents:'none'}} />

              <div style={{padding:'24px 20px 0', textAlign:'center', position:'relative'}}>
                {/* 果实图标 */}
                <div style={{margin:'0 auto 12px'}}>
                  {renderFruitCSSIcon(f.id, 72)}
                </div>
                <div style={{fontSize:'20px', fontWeight:'800', color:'#fff'}}>{f.name}</div>
                <div style={{display:'flex', gap:'6px', justifyContent:'center', margin:'8px 0 4px'}}>
                  <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:`${catC}25`, color:catC, fontWeight:'700'}}>
                    {FRUIT_CATEGORY_NAMES[f.category]}
                  </span>
                  <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:`${rc.color}25`, color:rc.color, fontWeight:'700'}}>
                    {rc.label}
                  </span>
                  {owned && <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:'rgba(76,175,80,0.2)', color:'#4CAF50', fontWeight:'700'}}>已拥有</span>}
                </div>
                <div style={{fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'8px', lineHeight:'1.5'}}>{f.desc}</div>
              </div>

              {/* 变身信息 */}
              <div style={{padding:'16px 20px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>变身效果 · {f.duration}回合</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {effects.map((eff, i) => (
                    <span key={i} style={{
                      fontSize:'11px', padding:'4px 10px', borderRadius:'10px',
                      background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.8)',
                      border:'1px solid rgba(255,255,255,0.08)'
                    }}>{eff}</span>
                  ))}
                </div>
              </div>

              {/* 变身技能 */}
              <div style={{padding:'0 20px 16px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>变身技能</div>
                <div style={{
                  background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px',
                  border:'1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <span style={{fontSize:'14px', fontWeight:'700', color:'#fff'}}>{tm.name}</span>
                      <span style={{
                        marginLeft:'8px', fontSize:'9px', padding:'2px 8px', borderRadius:'8px',
                        background: TYPES[tm.t]?.color || '#666', color:'#fff', fontWeight:'600'
                      }}>{TYPES[tm.t]?.name || tm.t}</span>
                    </div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)'}}>PP:{tm.pp}</div>
                  </div>
                  <div style={{display:'flex', gap:'16px', marginTop:'6px', fontSize:'11px', color:'rgba(255,255,255,0.6)'}}>
                    <span>威力: <span style={{color:'#FF7043', fontWeight:'700'}}>{tm.p}</span></span>
                    <span>命中: <span style={{color:'#42A5F5', fontWeight:'700'}}>{tm.acc}</span></span>
                    {tm.effect && <span style={{color:'#AB47BC'}}>附加: {tm.effect.type === 'STATUS' ? tm.effect.status : `${tm.effect.stat}${tm.effect.val > 0 ? '-' : '+'}${Math.abs(tm.effect.val)}`}</span>}
                  </div>
                </div>
              </div>

              {/* 获取方式 */}
              <div style={{padding:'0 20px 20px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>获取方式</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)', lineHeight:'1.6'}}>
                  <div>· 地图果实树随机采集</div>
                  <div>· 击败训练家/野生精灵掉落 (概率{(rc.dropRate*100).toFixed(1)}%)</div>
                  <div>· 特殊副本/活动奖励</div>
                </div>
              </div>

              <button onClick={() => setSelectedFruit(null)} style={{
                position:'absolute', top:'12px', right:'12px', background:'rgba(255,255,255,0.1)',
                border:'none', color:'#fff', width:'30px', height:'30px', borderRadius:'50%',
                fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'
              }}>×</button>
            </div>
          </div>
        );
      })()}
    </div>
  );

}
