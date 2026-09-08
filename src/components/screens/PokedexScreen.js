import React from 'react';
import { flushSync } from 'react-dom';
import { MAPS } from '../../data';
import { POKEDEX } from '../../data/pets';
import { TYPE_BIAS } from '../../data/types';
import { TYPES } from '../../data/types';

export default function PokedexScreen({
  box,
  calculateGrade,
  caughtDex,
  createPet,
  dexFilter,
  dexMilestoneClaimed,
  dexMilestoneClaimLocksRef,
  dexPageRef,
  dexSearchTerm,
  getFamilyTree,
  getStats,
  party,
  persistSaveRef,
  renderAvatar,
  safeBack,
  selectedDexId,
  setBox,
  setCaughtDex,
  setConfirmModal,
  setDexFilter,
  setDexMilestoneClaimed,
  setDexSearchTerm,
  setGold,
  setInventory,
  setSelectedDexId,
  setView,
  showMapToast,
  unlockTitle,
  updateAchStat
}) {
    const total = POKEDEX.length;
    const caughtCount = caughtDex.length;
    const progress = Math.floor((caughtCount / total) * 100);
    const filteredDex = POKEDEX.filter(p => {
      if (dexFilter === 'caught') return caughtDex.includes(p.id);
      if (dexFilter === 'missing') return !caughtDex.includes(p.id);
      if (dexFilter.startsWith('type_')) {
        const t = dexFilter.replace('type_', '');
        return p.type === t || p.type2 === t;
      }
      return true;
    }).filter(p => {
      const _debouncedDexTerm = dexSearchTerm;
      if (!_debouncedDexTerm) return true;
      const term = _debouncedDexTerm.toLowerCase();
      return p.name.toLowerCase().includes(term) || String(p.id).includes(term);
    });

    const DEX_PAGE_SIZE = 60;
    const dexPageCount = Math.ceil(filteredDex.length / DEX_PAGE_SIZE);
    const dexPage = Math.min(dexPageRef.current || 0, Math.max(0, dexPageCount - 1));
    const pagedDex = filteredDex.slice(dexPage * DEX_PAGE_SIZE, (dexPage + 1) * DEX_PAGE_SIZE);

    const selectedPet = selectedDexId ? POKEDEX.find(p => p.id === selectedDexId) : null;

    const syncDexData = () => {
      setConfirmModal({ title: '图鉴数据重置', desc: '确定要将图鉴重置为【当前持有的精灵】吗？\n这将清除已放生精灵的记录。', onConfirm: () => {
        const currentIds = new Set([...party.map(p=>p.id), ...box.map(p=>p.id)]);
        setCaughtDex(Array.from(currentIds));
        showMapToast('✅', '图鉴重置', '图鉴数据已修复！', 2000);
      }});
    };

    const dexMilestoneDefs = [
      { key: 'p10', need: Math.floor(POKEDEX.length * 0.1), text: `10% (${Math.floor(POKEDEX.length * 0.1)}种): 金币1000` },
      { key: 'p25', need: Math.floor(POKEDEX.length * 0.25), text: '25%: 稀有球×5' },
      { key: 'p50', need: Math.floor(POKEDEX.length * 0.5), text: '50%: 大师球×1' },
      { key: 'p100', need: POKEDEX.length - 1, text: '99.9%: 传说称号+始源混沌神(收集899种后自动获得)' },
    ];
    const claimDexMilestone = (m) => {
      if (dexMilestoneClaimed[m.key]) { showMapToast('ℹ️', '已领取', '该档奖励已领取过', 1500); return; }
      if (caughtDex.length < m.need) { showMapToast('❌', '未达成', `需要收集至少 ${m.need} 种`, 1500); return; }
      if (dexMilestoneClaimLocksRef.current.has(m.key)) {
        showMapToast('ℹ️', '领取中', '该档奖励正在领取', 1500);
        return;
      }
      dexMilestoneClaimLocksRef.current.add(m.key);
      let didClaim = false;
      flushSync(() => setDexMilestoneClaimed(prev => {
        if (prev[m.key]) return prev;
        didClaim = true;
        return { ...prev, [m.key]: true };
      }));
      if (!didClaim) {
        dexMilestoneClaimLocksRef.current.delete(m.key);
        showMapToast('ℹ️', '已领取', '该档奖励已领取过', 1500);
        return;
      }
      if (m.key === 'p10') { setGold(g => g + 1000); updateAchStat({ totalGoldEarned: 1000 }); showMapToast('🎁', '图鉴奖励', '获得 1000 金币！', 2500); }
      else if (m.key === 'p25') { setInventory(inv => ({ ...inv, balls: { ...inv.balls, ultra: (inv.balls.ultra || 0) + 5 } })); showMapToast('🎁', '图鉴奖励', '获得 超级球×5！', 2500); }
      else if (m.key === 'p50') { setInventory(inv => ({ ...inv, balls: { ...inv.balls, master: (inv.balls.master || 0) + 1 } })); showMapToast('🎁', '图鉴奖励', '获得 大师球×1！', 2500); }
      else if (m.key === 'p100') {
        unlockTitle('终极图鉴大师');
        const pet900 = POKEDEX.find(p => p.id === 900);
        if (pet900) {
          const rewardPet = createPet(900, 80, false, true);
          setBox(prev => [...prev, rewardPet]);
          if (!caughtDex.includes(900)) setCaughtDex(prev => prev.includes(900) ? prev : [...prev, 900]);
          showMapToast('🎁', '图鉴终极奖励', '解锁称号+获得始源混沌神！已送入电脑', 3500);
        } else {
          showMapToast('🎁', '图鉴奖励', '解锁称号：终极图鉴大师！', 2500);
        }
      }
      setTimeout(() => persistSaveRef.current(true), 0);
    };

    const missingCount = total - caughtCount;

    return (
      <div className="screen codex-screen is-pet">
        <div className="codex-shell">
          <header className="codex-hero">
            <button className="codex-back" onClick={() => setView(safeBack())}>← 返回</button>
            <div className="codex-title-block">
              <span>Spirit Archive</span>
              <h1>精灵图鉴</h1>
              <p>记录捕获、进化线、出没线索与图鉴奖励，训练家的长期研究档案。</p>
            </div>
            <button className="codex-tool-btn" onClick={syncDexData} title="修复图鉴数据">↻</button>
          </header>

          <section className="codex-overview">
            <article className="codex-panel codex-progress-panel">
              <div className="codex-ring" style={{'--progress': `${progress}%`}}>
                <b>{progress}%</b>
                <span>完成度</span>
              </div>
              <div className="codex-panel-copy">
                <span>Collection Progress</span>
                <strong>{caughtCount} / {total}</strong>
                <p>{missingCount} 种等待登记，当前筛选命中 {filteredDex.length} 种。</p>
              </div>
            </article>

            <article className="codex-panel codex-reward-panel">
              <div className="codex-panel-head">
                <span>图鉴奖励</span>
                <b>{dexMilestoneDefs.filter(m => dexMilestoneClaimed[m.key]).length}/{dexMilestoneDefs.length}</b>
              </div>
              <div className="codex-reward-list">
                {dexMilestoneDefs.map(m => {
                  const done = caughtDex.length >= m.need;
                  const claimed = !!dexMilestoneClaimed[m.key];
                  return (
                    <button key={m.key} type="button" className={`codex-reward ${done ? 'is-ready' : ''} ${claimed ? 'is-claimed' : ''}`} onClick={() => claimDexMilestone(m)}>
                      <span>{claimed ? '已领' : done ? '可领' : `${Math.min(caughtCount, m.need)}/${m.need}`}</span>
                      <b>{m.text}</b>
                    </button>
                  );
                })}
              </div>
            </article>

            <article className="codex-panel codex-insight-panel">
              <span>研究焦点</span>
              <strong>{dexFilter === 'caught' ? '已归档伙伴' : dexFilter === 'missing' ? '未捕获目标' : dexFilter.startsWith('type_') ? `${TYPES[dexFilter.replace('type_', '')]?.name || '属性'}系样本` : '全域样本库'}</strong>
              <p>点击任意条目查看捕获状态、获取方式、最佳个体和进化家族。</p>
            </article>
          </section>

          <section className="codex-toolbar">
            <div className="codex-chip-row">
              {[
                ['all', '全部'],
                ['caught', '已捕获'],
                ['missing', '未捕获'],
              ].map(([key, label]) => (
                <button key={key} className={`codex-chip ${dexFilter === key ? 'active' : ''}`} onClick={() => { setDexFilter(key); setSelectedDexId(null); }}>{label}</button>
              ))}
              <select className="codex-select" aria-label="按属性筛选" value={dexFilter.startsWith('type_') ? dexFilter : ''} onChange={e => {setDexFilter(e.target.value || 'all'); setSelectedDexId(null);}}>
                <option value="">按属性</option>
                {Object.entries(TYPES).map(([k, v]) => <option key={k} value={`type_${k}`}>{v.name}</option>)}
              </select>
            </div>
            <label className="codex-search">
              <span>⌕</span>
              <input type="text" aria-label="搜索精灵名称或编号" placeholder="搜索精灵名称或编号..." value={dexSearchTerm} onChange={e => setDexSearchTerm(e.target.value)} />
            </label>
          </section>

          <div className="codex-grid codex-pet-grid">
            {filteredDex.length === 0 && (
              <div className="codex-empty">
                <strong>未找到匹配的精灵</strong>
                <span>请尝试其他搜索条件或清除筛选。</span>
              </div>
            )}
            {pagedDex.map(pet => {
              const isCaught = caughtDex.includes(pet.id);
              return (
                <button key={pet.id} type="button" className={`codex-pet-card ${isCaught ? 'caught' : 'missing'}`} onClick={() => setSelectedDexId(pet.id)}>
                  <span className="codex-card-id">#{String(pet.id).padStart(3, '0')}</span>
                  <span className="codex-caught-dot" />
                  <div className="codex-pet-avatar" style={!isCaught ? {filter:'brightness(0.35) saturate(0)'} : {}}>{renderAvatar(pet)}</div>
                  <strong>{pet.name}</strong>
                  <div className="codex-type-row">
                    <i style={{background: TYPES[pet.type]?.color || '#999'}} />
                    {pet.type2 && <i style={{background: TYPES[pet.type2]?.color || '#999'}} />}
                  </div>
                </button>
              );
            })}
          </div>

          {dexPageCount > 1 && (
            <div className="codex-pagination">
              <button onClick={() => { dexPageRef.current = Math.max(0, dexPage - 1); setSelectedDexId(null); }} disabled={dexPage === 0}>← 上页</button>
              <span>{dexPage + 1} / {dexPageCount} · {filteredDex.length} 种</span>
              <button onClick={() => { dexPageRef.current = Math.min(dexPageCount - 1, dexPage + 1); setSelectedDexId(null); }} disabled={dexPage >= dexPageCount - 1}>下页 →</button>
            </div>
          )}
        </div>
               {/* 替换 renderPokedex 中原本的 selectedPet 模态框部分 */}
        {selectedPet && (
          <div className="dex-modal-overlay" onClick={() => setSelectedDexId(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
            <div className="dex-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: '340px', background: '#fff', borderRadius: '24px', overflow: 'visible', 
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', paddingBottom: '24px',
              maxHeight: '90vh', overflowY: 'auto'
            }}>
              
              {!caughtDex.includes(selectedPet.id) ? (() => {
                const tc = TYPES[selectedPet.type]?.color || '#999';
                const preEvo = POKEDEX.find(p => p.evo === selectedPet.id);
                const spawnMaps = MAPS.filter(m => m.pool && m.pool.includes(selectedPet.id));
                const isGod = (selectedPet.id >= 601 && selectedPet.id <= 610) || (selectedPet.id >= 691 && selectedPet.id <= 700);
                let howToGet = [];
                if (preEvo) howToGet.push(`由 ${preEvo.name}(#${preEvo.id}) ${preEvo.evoLvl ? `Lv.${preEvo.evoLvl}` : '使用进化石'}进化`);
                if (spawnMaps.length > 0) howToGet.push(`野外出没: ${spawnMaps.map(m => m.name).join('、')}`);
                if (isGod) howToGet.push('神兽 — 第6章后高级地图稀有遭遇');
                if (howToGet.length === 0) howToGet.push('通过剧情任务、活动或特殊途径获得');
                return (
                <>
                  <div style={{
                    width: '100%', height: '110px', flexShrink: 0,
                    background: `linear-gradient(180deg, ${tc}99 0%, ${tc}44 100%)`, 
                    borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                    position: 'absolute', top: 0, left: 0, zIndex: 0
                  }}></div>
                  <div style={{
                    width: '90px', height: '90px', background: '#f5f5f5', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
                    marginTop: '65px', zIndex: 1, position: 'relative',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '5px',
                    filter: 'brightness(0.4) saturate(0)'
                  }}>
                    {renderAvatar(selectedPet)}
                  </div>
                  <div style={{textAlign: 'center', marginTop: '10px', zIndex: 1, width: '100%', padding: '0 30px'}}>
                    <div style={{color: '#999', fontSize: '13px', fontWeight: '600', letterSpacing: '1px'}}>
                      #{String(selectedPet.id).padStart(3, '0')}
                    </div>
                    <div style={{fontSize: '24px', fontWeight: '800', color: '#555', margin: '4px 0'}}>{selectedPet.name}</div>
                    <div style={{display:'flex', gap:'6px', justifyContent:'center'}}>
                    <div style={{
                      display: 'inline-block', background: tc, color: '#fff',
                      padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                    }}>{TYPES[selectedPet.type]?.name || selectedPet.type}</div>
                    {selectedPet.type2 && <div style={{
                      display: 'inline-block', background: TYPES[selectedPet.type2]?.color || '#666', color: '#fff',
                      padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                    }}>{TYPES[selectedPet.type2]?.name}</div>}
                    </div>
                  </div>
                  {selectedPet.desc && <div style={{width:'100%', padding:'12px 30px 0', textAlign:'center'}}>
                    <div style={{fontSize:'12px', color:'#888', fontStyle:'italic', lineHeight:1.5}}>"{selectedPet.desc}"</div>
                  </div>}
                  <div style={{
                    width: '100%', padding: '20px 30px', textAlign: 'center', color: '#999'
                  }}>
                    <div style={{fontSize: '28px', marginBottom: '10px'}}>🔒</div>
                    <div style={{fontSize: '14px', fontWeight: '700', color: '#666', marginBottom: '10px'}}>尚未捕获</div>
                    <div style={{textAlign:'left', width:'100%'}}>
                      <div style={{fontSize:'12px', fontWeight:'700', color:'#888', marginBottom:'6px'}}>📍 获取方式</div>
                      {howToGet.map((t, i) => (
                        <div key={i} style={{fontSize:'12px', color:'#777', lineHeight:1.7, paddingLeft:'12px', position:'relative'}}>
                          <span style={{position:'absolute', left:0}}>•</span>{t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setSelectedDexId(null)} style={{
                    padding: '8px 32px', borderRadius: '20px', border: 'none',
                    background: tc, color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                    opacity: 0.8
                  }}>关闭</button>
                </>
                );
              })() : null}

              {caughtDex.includes(selectedPet.id) && (() => {
                  const allCaught = [...party, ...box].filter(p => p.id === selectedPet.id);
                  let bestPet = null;
                  let bestScore = -1;
                  let bestGrade = 'B';

                  if (allCaught.length > 0) {
                      allCaught.forEach(p => {
                          const { score, grade } = calculateGrade(p);
                          if (score > bestScore) {
                              bestScore = score;
                              bestPet = p;
                              bestGrade = grade;
                          }
                      });
                 } else {
                      bestPet = { ...selectedPet, level: 1, ivs: {}, nature: null };
                  }

                  const getGradeColor = (g) => {
                      if (g === 'S') return '#FFD700';
                      if (g === 'A') return '#FF4081';
                      if (g === 'B') return '#2196F3';
                      return '#9E9E9E';
                  };
                  const gradeColor = getGradeColor(bestGrade);

                  return (
                      <>
                        {/* 顶部背景 (渐变色) */}
                        <div style={{
                            width: '100%', height: '110px', flexShrink: 0,
                            background: 'linear-gradient(180deg, #E0C3FC 0%, #C2E9FB 100%)', 
                            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                            position: 'absolute', top: 0, left: 0, zIndex: 0
                        }}></div>

                        {/* 评级印章 (右上角) */}
                        {allCaught.length > 0 && (
                            <div style={{
                                position:'absolute', right:'20px', top:'20px', 
                                fontSize:'32px', fontWeight:'900', color: gradeColor,
                                border: `3px solid ${gradeColor}`, borderRadius:'50%', width:'50px', height:'50px',
                                display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(15deg)',
                                background:'#fff', zIndex: 10, boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                {bestGrade}
                            </div>
                        )}

                        {/* 头像 (悬浮设计) */}
                        <div style={{
                            width: '90px', height: '90px', background: '#fff', borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '55px',
                            marginTop: '65px', zIndex: 1, position: 'relative',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '5px'
                        }}>
                            {renderAvatar(bestPet)}
                        </div>

                        {/* 基础信息 */}
                        <div style={{textAlign: 'center', marginTop: '10px', zIndex: 1, width: '100%', flexShrink: 0}}>
                            <div style={{color: '#999', fontSize: '13px', fontWeight: '600', letterSpacing: '1px'}}>
                            #{String(selectedPet.id).padStart(3, '0')}
                            </div>
                            <div style={{fontSize: '24px', fontWeight: '800', color: '#333', margin: '4px 0'}}>
                            {selectedPet.name}
                            </div>
                            <div style={{display:'flex', gap:'6px', justifyContent:'center'}}>
                            <div style={{
                                display: 'inline-block', 
                                background: TYPES[selectedPet.type]?.color || '#7038F8', 
                                color: '#fff', padding: '4px 16px', borderRadius: '20px', 
                                fontSize: '12px', fontWeight: 'bold'
                            }}>
                                {TYPES[selectedPet.type]?.name}
                                </div>
                                {selectedPet.type2 && <div style={{
                                    display: 'inline-block', 
                                    background: TYPES[selectedPet.type2]?.color || '#7038F8', 
                                    color: '#fff', padding: '4px 16px', borderRadius: '20px', 
                                    fontSize: '12px', fontWeight: 'bold'
                                }}>
                                    {TYPES[selectedPet.type2]?.name}
                                </div>}
                            </div>
                            {allCaught.length > 0 && (
                                <div style={{fontSize:'10px', color:'#666', marginTop:'5px'}}>
                                    展示的是你拥有的最强个体 (Lv.{bestPet.level})
                                </div>
                            )}
                        </div>

                        {/* 属性条 (紧凑版) */}
                        <div style={{width: '100%', padding: '20px 30px 10px'}}>
                            {(() => {
                                const currentStats = getStats(bestPet);
                                const growth = 1 + bestPet.level * 0.05;
                                
                                // 获取种族值逻辑 (简化版，直接用你代码里的逻辑)
                                const baseInfo = POKEDEX.find(p => p.id === bestPet.id) || POKEDEX[0];
                                const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                                const diversity = (baseInfo.id % 5) * 2 - 4;
                                const getBase = (k) => {
                                    if (k === 'hp') return baseInfo.hp || 60;
                                    if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
                                    const bAtk = baseInfo.atk || 50;
                                    const bDef = baseInfo.def || 50;
                                    if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
                                    if (k === 'p_def') return Math.floor(bDef * bias.p);
                                    if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
                                    if (k === 's_def') return Math.floor(bDef * bias.s);
                                    return 50;
                                };

                                const configs = [
                                    {k:'maxHp', n:'HP'}, {k:'p_atk', n:'物攻'}, {k:'p_def', n:'物防'},
                                    {k:'s_atk', n:'特攻'}, {k:'s_def', n:'特防'}, {k:'spd',   n:'速度'}
                                ];

                                return configs.map(cfg => {
                                    const key = cfg.k === 'maxHp' ? 'hp' : cfg.k;
                                    const currVal = currentStats[cfg.k];
                                    let maxStat = (getBase(key) + 31) * growth;
                                    if (key === 'hp') maxStat = maxStat * 2.5;
                                    
                                    const pct = Math.min(100, (currVal / maxStat) * 100);
                                    const color = pct >= 80 ? '#FFD700' : (pct >= 50 ? '#FF4081' : '#2196F3');

                                    return (
                                        <div key={cfg.k} style={{display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '12px'}}>
                                            <div style={{width: '32px', color: '#666', fontWeight: '600', textAlign:'left'}}>{cfg.n}</div>
                                            <div style={{flex: 1, height: '8px', background: '#F0F0F0', borderRadius: '4px', margin: '0 10px', position:'relative', overflow:'hidden'}}>
                                                <div style={{width: `${pct}%`, background: color, height: '100%'}}></div>
                                            </div>
                                            <div style={{width: '40px', textAlign: 'right', fontWeight: 'bold', color: '#333'}}>{currVal}</div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                      </>
                  );
              })()}

              {caughtDex.includes(selectedPet.id) && <div style={{fontSize:'10px', color:'#ccc', marginBottom:'10px'}}>
                 *金色部分代表因闪光/性格/个体值获得的突破属性
              </div>}

              {caughtDex.includes(selectedPet.id) && (() => {
                  const family = getFamilyTree(selectedPet.id);
                  if (!family || (family.stage1.length === 0)) return null;

                  const EvoNode = ({ pet, method }) => {
                      const isCaught = caughtDex.includes(pet.id);
                      const isCurrent = pet.id === selectedPet.id;
                      return (
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'0 5px'}}>
                              {method && <div style={{fontSize:'9px', color:'#aaa', marginBottom:'2px'}}>{method}</div>}
                              <div 
                                onClick={() => isCaught && setSelectedDexId(pet.id)}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: isCaught ? 'pointer' : 'default'
                                }}
                              >
                                 {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                              </div>
                          </div>
                      );
                  };

                  return (
                    <div style={{
                        width: '90%', padding: '15px 10px', 
                        background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                        marginTop:'5px'
                    }}>
                      <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                         <EvoNode pet={family.root} />
                         {family.stage1.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                         {family.stage2.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                         {family.stage3 && family.stage3.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage3.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                      </div>
                    </div>
                  );
              })()}

              {caughtDex.includes(selectedPet.id) && <button 
                onClick={() => setSelectedDexId(null)} 
                style={{
                  width: '85%', padding: '12px', background: '#F5F7FA', border: 'none', borderRadius: '12px',
                  fontSize: '14px', color: '#666', cursor: 'pointer', fontWeight: '600',
                  marginTop: 'auto', marginBottom: '5px', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#E4E7EB'}
                onMouseOut={(e) => e.target.style.background = '#F5F7FA'}
              >
                关闭
              </button>}

            </div>
          </div>
        )}


      </div>
    );
  
}
