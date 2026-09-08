import React from 'react';
import { calculatePetReleaseGold } from '../../utils/petIdentity';
import { getFruitById } from '../../data/devilfruits';
import { HIGH_TIER_POOL } from '../../data';
import { LEGENDARY_POOL } from '../../data';
import { NATURE_DB } from '../../data/traits';
import { TRAIT_DB } from '../../data/traits';
import { TYPES } from '../../data/types';

export default function PCScreen({
  badges,
  box,
  boxRef,
  calculateGrade,
  depositPokemon,
  getAssignedPetUids,
  getStats,
  party,
  pcBatchRelease,
  pcBatchSelected,
  pcFilterType,
  pcMode,
  pcSearch,
  pcSort,
  releasePokemon,
  renderAvatar,
  selectedBoxIdx,
  selectedPartyIdx,
  setConfirmModal,
  setPcBatchRelease,
  setPcBatchSelected,
  setPcFilterType,
  setPcMode,
  setPcSearch,
  setPcSort,
  setSelectedBoxIdx,
  setSelectedPartyIdx,
  setStatTooltip,
  settleBoxPetRelease,
  setViewStatPet,
  showMapToast,
  statTooltip,
  withdrawPokemon
}) {
    if (!pcMode) return null;
    
    const selectedPet = selectedPartyIdx !== null ? party[selectedPartyIdx] : (selectedBoxIdx !== null ? box[selectedBoxIdx] : null);
    const stats = selectedPet ? getStats(selectedPet) : null;
    const nature = selectedPet ? NATURE_DB[selectedPet.nature || 'docile'] : null;

    return (
      <div className="modal-overlay" onClick={() => setPcMode(false)} style={{
        // 🔴 1. 强制全屏居中遮罩
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)', // 深色背景遮罩
        backdropFilter: 'blur(4px)',
        zIndex: 1000
      }}>
        {/* 🔴 2. 模态框主体 (阻止冒泡防止点击关闭) */}
        <div className="pc-modal-tech" onClick={e => e.stopPropagation()} style={{
          width: '95%',
          maxWidth: '1100px', // 足够宽，容纳三列
          height: '85vh',     // 固定高度
          background: '#1a1a2e', // 深色科技背景
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid #333',
          color: '#fff'
        }}>
          
          {/* 顶部标题栏 */}
          <div className="pc-header-tech" style={{
            background: '#16213e', 
            padding: '15px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #333'
          }}>
            <div className="pc-title-tech" style={{fontSize: '18px', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{color:'#00E676', fontSize:'12px'}}>● 在线</span> 
                精灵管理终端
            </div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <button onClick={() => { setPcBatchRelease(p => !p); setPcBatchSelected(new Set()); }} style={{background: pcBatchRelease ? '#E53935' : '#333',border:'1px solid #555',color:'#fff',padding:'4px 10px',borderRadius:'6px',fontSize:'11px',cursor:'pointer'}}>
                {pcBatchRelease ? '取消批量' : '📦 批量放生'}
              </button>
              {pcBatchRelease && pcBatchSelected.size > 0 && (
                <button onClick={() => {
                  const selectedSet = new Set(pcBatchSelected);
                  const selectedPets = [...selectedSet].map(idx => boxRef.current?.[idx]).filter(Boolean);
                  const selectedUids = selectedPets.map(pet => pet.uid).filter(Boolean);
                  if (selectedPets.length !== selectedSet.size || selectedUids.length !== selectedPets.length) {
                    showMapToast('ℹ️', '放生取消', '精灵列表已经变化，请重新选择', 2000);
                    return;
                  }
                  const batchGold = selectedPets.reduce((sum, pet) => sum + calculatePetReleaseGold(pet, { legendaryIds: LEGENDARY_POOL, highTierIds: HIGH_TIER_POOL }), 0);
                  const hasSpecial = selectedPets.some(pet => pet.isShiny || pet.isFusedShiny || LEGENDARY_POOL?.includes(pet.id) || HIGH_TIER_POOL?.includes(pet.id));
                  const assignedUids = getAssignedPetUids();
                  const assignedCount = selectedPets.filter(pet => assignedUids.has(pet.uid)).length;
                  if (assignedCount > 0) {
                    showMapToast('❌', '无法放生', `${assignedCount}只精灵正在训练或远征中，请先召回`, 2500);
                    return;
                  }
                  const execBatch = () => {
                    const result = settleBoxPetRelease(selectedUids);
                    if (!result.ok) {
                      showMapToast('ℹ️', '放生取消', result.reason, 2200);
                      return;
                    }
                    showMapToast('👋', '批量放生', `${result.pets.length}只精灵回归自然，获得 ${result.gold.toLocaleString()} 金币，饰品与果实已返还`, 2800);
                    setPcBatchSelected(new Set());
                    setPcBatchRelease(false);
                  };
                  const baseMsg = `放生后无法恢复！\n将获得 ${batchGold.toLocaleString()} 金币补偿。\n确定吗？`;
                  if (hasSpecial) {
                    setConfirmModal({ title: `批量放生 ${selectedSet.size} 只精灵`, msg: `${baseMsg}\n\n⚠️ 选中含有闪光/传说或珍稀精灵，确定要放生吗？`, onOk: () => {
                      setConfirmModal({ title: '⚠️ 最后确认', msg: `${selectedSet.size} 只精灵将被永久放生，无法找回。已装备的饰品与果实会自动返还。`, onOk: execBatch });
                    }});
                  } else {
                    setConfirmModal({ title: `批量放生 ${selectedSet.size} 只精灵`, msg: baseMsg, onOk: execBatch });
                  }
                }} style={{background:'#E53935',border:'none',color:'#fff',padding:'4px 10px',borderRadius:'6px',fontSize:'11px',cursor:'pointer'}}>
                  确认放生({pcBatchSelected.size})
                </button>
              )}
              <button className="btn-close" style={{background:'transparent', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer'}} onClick={() => { setPcMode(false); setPcBatchRelease(false); setPcBatchSelected(new Set()); }}>✕</button>
            </div>
          </div>
          
          {/* 🔴 3. 三列布局核心区域 */}
          <div className="pc-layout-tech" style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden', // 防止整个页面滚动
              padding: '20px',
              gap: '20px' // 列间距
          }}>
            
            {/* === 左侧：当前队伍 (固定宽度) === */}
            <div className="pc-col-left" style={{ 
                width: '260px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column',
                background: '#16213e',
                borderRadius: '12px',
                padding: '10px'
            }}>
              <div className="pc-section-header" style={{marginBottom:'10px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  当前队伍 ({party.length}/6)
              </div>
              <div className="pc-party-list-tech" style={{overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                {party.map((p, i) => (
                  <div className={`pc-party-card${selectedPartyIdx===i ? ' is-selected' : ''}`} key={i}
                       onClick={() => { setSelectedPartyIdx(i); setSelectedBoxIdx(null); }}
                       onDoubleClick={() => setViewStatPet(p)}
                       style={{
                           display: 'flex', alignItems: 'center', padding: '10px',
                           background: selectedPartyIdx===i ? '#2196F3' : 'rgba(255,255,255,0.05)',
                           borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                           border: selectedPartyIdx===i ? '1px solid #64B5F6' : '1px solid transparent'
                       }}
                  >
                    <div style={{fontSize:'24px', marginRight:'10px'}}>{renderAvatar(p)}</div>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'14px'}}>{p.name}</div>
                      <div style={{fontSize:'11px', opacity:0.7}}>Lv.{p.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === 中间：仓库列表 (自适应宽度) === */}
            <div className="pc-col-mid" style={{ 
                flex: 1, 
                display:'flex', 
                flexDirection:'column', 
                background:'rgba(0,0,0,0.2)', 
                borderRadius:'12px', 
                padding:'10px',
                border: '1px solid #333'
            }}>
              <div style={{marginBottom:'8px', display:'flex', flexDirection:'column', gap:'6px'}}>
                <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
                  <input value={pcSearch} onChange={e => { setPcSearch(e.target.value); setSelectedBoxIdx(null); }}
                    placeholder="🔍 搜索名称..." style={{flex:1, padding:'5px 8px', borderRadius:'8px', border:'1px solid #444', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:'12px', outline:'none'}} />
                  <select value={pcSort} onChange={e => setPcSort(e.target.value)}
                    style={{padding:'5px', borderRadius:'8px', border:'1px solid #444', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:'11px'}}>
                    <option value="default">默认</option><option value="level_desc">等级↓</option><option value="level_asc">等级↑</option>
                    <option value="iv_desc">IV总↓</option><option value="name">名称</option><option value="shiny">闪光优先</option><option value="starred">收藏优先</option>
                  </select>
                </div>
                <div style={{display:'flex', gap:'4px', flexWrap:'wrap'}}>
                  {['all',...Object.keys(TYPES)].map(t => (
                    <button key={t} onClick={() => { setPcFilterType(t); setSelectedBoxIdx(null); }}
                      style={{padding:'2px 6px', borderRadius:'6px', border: pcFilterType===t ? '1px solid #FFB74D' : '1px solid transparent',
                        background: pcFilterType===t ? 'rgba(255,152,0,0.3)' : 'rgba(255,255,255,0.06)', color: pcFilterType===t ? '#FFB74D' : '#999',
                        fontSize:'9px', cursor:'pointer'}}>{t === 'all' ? '全部' : (TYPES[t]?.name || t)}</button>
                  ))}
                </div>
                <div style={{color: box.length >= (500 + (badges?.length||0)*50) - 20 ? '#F44336' : box.length >= (500 + (badges?.length||0)*50) - 50 ? '#FF9800' : '#888', fontSize:'11px', fontWeight: box.length >= (500 + (badges?.length||0)*50) - 50 ? 700 : 400}}>存储箱 ({box.length}/{500 + (badges?.length||0)*50}){box.length >= (500 + (badges?.length||0)*50) - 20 ? ' ⚠️ 即将满！' : box.length >= (500 + (badges?.length||0)*50) - 50 ? ' 空间不足' : ''}</div>
              </div>
              <div className="pc-box-grid-tech" style={{ 
                  display:'grid', 
                  gridTemplateColumns:'repeat(auto-fill, minmax(60px, 1fr))', 
                  gap:'8px', 
                  overflowY:'auto',
                  alignContent: 'start',
                  flex: 1
              }}>
                {(() => {
                  let filtered = box.map((p, i) => ({p, origIdx: i}));
                  if (pcSearch) filtered = filtered.filter(({p}) => p.name?.toLowerCase().includes(pcSearch.toLowerCase()));
                  if (pcFilterType !== 'all') filtered = filtered.filter(({p}) => p.type === pcFilterType || p.secondaryType === pcFilterType);
                  if (pcSort === 'level_desc') filtered.sort((a,b) => (b.p.level||0) - (a.p.level||0));
                  else if (pcSort === 'level_asc') filtered.sort((a,b) => (a.p.level||0) - (b.p.level||0));
                  else if (pcSort === 'iv_desc') filtered.sort((a,b) => {
                    const ivSum = p => Object.values(p.ivs||{}).reduce((s,v) => s+v, 0);
                    return ivSum(b.p) - ivSum(a.p);
                  });
                  else if (pcSort === 'name') filtered.sort((a,b) => (a.p.name||'').localeCompare(b.p.name||''));
                  else if (pcSort === 'shiny') filtered.sort((a,b) => (b.p.isShiny?1:0) - (a.p.isShiny?1:0));
                  else if (pcSort === 'starred') filtered.sort((a,b) => (b.p.starred?1:0) - (a.p.starred?1:0));
                  return filtered.map(({p, origIdx}) => (
                    <div className={`pc-storage-card${selectedBoxIdx===origIdx ? ' is-selected' : ''}${p.isShiny ? ' is-shiny' : ''}${pcBatchRelease && pcBatchSelected.has(origIdx) ? ' is-batch-selected' : ''}`} key={origIdx}
                         onClick={() => { 
                           if (pcBatchRelease) {
                             setPcBatchSelected(prev => { const n = new Set(prev); n.has(origIdx) ? n.delete(origIdx) : n.add(origIdx); return n; });
                           } else {
                             setSelectedBoxIdx(origIdx); setSelectedPartyIdx(null);
                           }
                         }}
                         onDoubleClick={() => { if (!pcBatchRelease) setViewStatPet(p); }}
                         style={{
                             aspectRatio: '1/1',
                             background: pcBatchRelease && pcBatchSelected.has(origIdx) ? '#E53935' : selectedBoxIdx===origIdx ? '#FF9800' : 'rgba(255,255,255,0.1)',
                             borderRadius: '8px',
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             flexDirection: 'column',
                             fontSize: '24px', cursor: 'pointer',
                             border: pcBatchRelease && pcBatchSelected.has(origIdx) ? '2px solid #FF5252' : selectedBoxIdx===origIdx ? '2px solid #FFB74D' : p.isShiny ? '1px solid #FFD700' : 'none',
                             position: 'relative'
                         }}
                    >
                      {pcBatchRelease && pcBatchSelected.has(origIdx) && <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(229,57,53,0.3)',borderRadius:'8px',zIndex:1}}/>}
                      {(() => {
                        const { grade: letter } = calculateGrade(p);
                        const lColor = letter === 'S' ? '#FFD700' : letter === 'A' ? '#FF4081' : letter === 'B' ? '#2196F3' : '#9E9E9E';
                        return <div style={{position:'absolute', top:1, left:2, fontSize:'8px', fontWeight:'bold', color: lColor, textShadow:'0 0 3px rgba(0,0,0,0.8)'}}>{letter}</div>;
                      })()}
                      {renderAvatar(p)}
                      <div style={{fontSize:'9px', color:'#aaa', marginTop:'1px'}}>Lv{p.level}</div>
                      {p.isShiny && <div style={{position:'absolute', top:1, right:2, fontSize:'8px'}}>✨</div>}
                    </div>
                  ));
                })()}
                {box.length > 0 && [...Array(Math.max(0, 8 - box.length))].map((_, i) => (
                    <div className="pc-storage-card is-empty" key={`empty-${i}`} style={{background:'rgba(255,255,255,0.03)', borderRadius:'8px'}}></div>
                ))}
                {box.length === 0 && <div style={{gridColumn:'1/-1', textAlign:'center', padding:'30px 10px', color:'#64748b'}}>
                  <div style={{fontSize:'32px', marginBottom:'8px'}}>📦</div>
                  <div style={{fontSize:'13px', fontWeight:'600'}}>仓库是空的</div>
                  <div style={{fontSize:'11px', marginTop:'4px', color:'#475569'}}>在冒险中捕捉更多精灵吧！超出队伍的精灵会自动存入这里</div>
                </div>}
              </div>
            </div>

            {/* === 右侧：详细数据 (固定宽度，防止挤压) === */}
            <div className="pc-col-right" style={{ 
                width: '320px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column', 
                background:'#232336', 
                borderRadius:'12px', 
                padding:'15px',
                borderLeft: '1px solid #333'
            }}>
              <div className="pc-section-header" style={{marginBottom:'15px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  数据分析模块
              </div>
              
              {selectedPet ? (
                <div className="analysis-panel" style={{overflowY: 'auto', paddingRight: '4px', display:'flex', flexDirection:'column', height:'100%'}}>
                  
                  {/* 1. 基础头部信息 */}
                  <div className="analysis-header" onClick={() => setViewStatPet(selectedPet)} style={{display:'flex', alignItems:'center', marginBottom:'15px', paddingBottom:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)', cursor:'pointer'}}>
                      <div className="analysis-sprite" style={{
                          width:'60px', height:'60px', marginRight:'15px', 
                          background:'rgba(255,255,255,0.1)', borderRadius:'50%', 
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'35px'
                      }}>
                          {renderAvatar(selectedPet)}
                      </div>
                      <div style={{flex:1}}>
                          <div className="analysis-name" style={{fontSize:'18px', fontWeight:'bold', color:'#fff', marginBottom:'6px'}}>
                              {selectedPet.name} {selectedPet.isShiny && <span style={{color:'#FFD700'}}>✨</span>}
                          </div>
                          <div className="analysis-types" style={{display:'flex', gap:'5px'}}>
                            <span className="analysis-tag" style={{background: TYPES[selectedPet.type]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                {TYPES[selectedPet.type]?.name}
                            </span>
                            {(selectedPet.secondaryType || selectedPet.type2) && (
                                <span className="analysis-tag" style={{background: TYPES[selectedPet.secondaryType || selectedPet.type2]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                    {TYPES[selectedPet.secondaryType || selectedPet.type2]?.name}
                                </span>
                            )}
                            <span className="analysis-tag" style={{background:'#444', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px'}}>
                                Lv.{selectedPet.level}
                            </span>
                          </div>
                      </div>
                  </div>
                  {/* 快捷：查看完整详情按钮 */}
                  <button onClick={() => setViewStatPet(selectedPet)} style={{width:'100%', padding:'8px', marginBottom:'15px', background:'linear-gradient(135deg, #7C4DFF, #536DFE)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'bold', letterSpacing:'1px'}}>
                    📋 查看完整详情
                  </button>

                  {/* 2. 性格显示 (带悬停提示) */}
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'8px 12px', borderRadius:'6px', marginBottom:'15px', fontSize:'12px', display:'flex', justifyContent:'space-between', alignItems:'center', overflow:'visible'}}>
                      <span style={{color:'#aaa'}}>性格倾向</span>
                      
                      <div 
                          style={{position:'relative', cursor:'help', display:'flex', alignItems:'center'}}
                          onMouseEnter={() => setStatTooltip('nature')}
                          onMouseLeave={() => setStatTooltip(null)}
                      >
                          <span style={{color:'#fff', fontWeight:'bold', marginRight:'5px', borderBottom:'1px dashed #666'}}>{nature?.name}</span>
                          <span style={{color:'#888'}}>({nature?.desc})</span>

                          {/* 悬停提示框 */}
                          {statTooltip === 'nature' && (
                              <div style={{
                                  position:'absolute', bottom:'130%', right:'-10px', width:'160px',
                                  background:'rgba(0,0,0,0.95)', backdropFilter:'blur(4px)',
                                  border:'1px solid #444', borderRadius:'8px', padding:'10px',
                                  zIndex: 100, boxShadow:'0 4px 15px rgba(0,0,0,0.5)',
                                  pointerEvents:'none', textAlign:'left'
                              }}>
                                  <div style={{color:'#fff', fontWeight:'bold', marginBottom:'6px', borderBottom:'1px solid #555', paddingBottom:'4px', fontSize:'12px'}}>
                                      性格修正详情
                                  </div>
                                  {Object.keys(nature?.stats || {}).length === 0 ? (
                                      <div style={{color:'#ccc', fontSize:'11px'}}>无属性影响</div>
                                  ) : (
                                      Object.entries(nature.stats).map(([key, val]) => {
                                          const statMap = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', hp:'HP' };
                                          const isUp = val > 1;
                                          const pct = Math.round(Math.abs(val - 1) * 100);
                                          return (
                                              <div key={key} style={{display:'flex', justifyContent:'space-between', marginBottom:'3px', fontSize:'11px'}}>
                                                  <span style={{color:'#ccc'}}>{statMap[key]}</span>
                                                  <span style={{color: isUp ? '#FF5252' : '#2196F3', fontWeight:'bold'}}>
                                                      {isUp ? '▲' : '▼'} {pct}%
                                                  </span>
                                              </div>
                                          );
                                      })
                                  )}
                              </div>
                          )}
                      </div>
                  </div>

                  {/* 3. 六维属性网格 */}
                  <div style={{textAlign:'right',fontSize:'10px',color:'rgba(255,255,255,0.3)',marginBottom:'4px'}}>* 属性条参考上限250</div>
                  <div className="stats-grid-tech" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                      {[
                          {l:'HP', v:`${selectedPet.currentHp}/${stats.maxHp}`, c:'#4CAF50', w: stats.maxHp > 0 ? Math.min(100, (selectedPet.currentHp/stats.maxHp)*100) : 0},
                          {l:'速度', v:stats.spd, c:'#FFC107', w: Math.min(100, Math.max(0, (stats.spd/250)*100))},
                          {l:'物攻', v:stats.p_atk, c:'#FF5252', w: Math.min(100, Math.max(0, (stats.p_atk/250)*100))},
                          {l:'物防', v:stats.p_def, c:'#2196F3', w: Math.min(100, Math.max(0, (stats.p_def/250)*100))},
                          {l:'特攻', v:stats.s_atk, c:'#E91E63', w: Math.min(100, Math.max(0, (stats.s_atk/250)*100))},
                          {l:'特防', v:stats.s_def, c:'#3F51B5', w: Math.min(100, Math.max(0, (stats.s_def/250)*100))},
                      ].map((s, i) => (
                          <div key={i} style={{background:'rgba(255,255,255,0.05)', padding:'8px', borderRadius:'6px'}}>
                              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#aaa', marginBottom:'4px'}}>
                                  <span>{s.l}</span>
                                  <span style={{color:'#fff', fontWeight:'bold', fontFamily:'monospace'}}>{s.v}</span>
                              </div>
                              <div style={{height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                  <div style={{width:`${Math.min(100, s.w)}%`, background:s.c, height:'100%'}}></div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* 3.5 资质/特性/亲密度/装备 */}
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'10px 12px', borderRadius:'8px', marginBottom:'15px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', fontSize:'11px'}}>
                    {(() => {
                      const { grade, score } = calculateGrade(selectedPet);
                      const gradeColor = grade === 'S' ? '#FFD700' : grade === 'A' ? '#FF4081' : grade === 'B' ? '#2196F3' : '#9E9E9E';
                      return <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>资质</span><span style={{color: gradeColor, fontWeight:'bold'}}>{grade} ({Math.round(score)}%)</span></div>;
                    })()}
                    <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>亲密度</span><span style={{color:'#fff'}}>{selectedPet.intimacy ?? selectedPet.friendship ?? 0}</span></div>
                    <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>特性</span><span style={{color:'#CE93D8'}}>{TRAIT_DB[selectedPet.trait]?.name || selectedPet.trait || '无'}</span></div>
                    <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>魅力</span><span style={{color:'#fff'}}>{selectedPet.charm ?? 0}</span></div>
                    {selectedPet.devilFruit && <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>果实</span><span style={{color:'#FF8A65'}}>{getFruitById(selectedPet.devilFruit)?.name || selectedPet.devilFruit}</span></div>}
                    {selectedPet.equips?.length > 0 && <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>装备</span><span style={{color:'#81C784'}}>{selectedPet.equips.length}件</span></div>}
                    {selectedPet.sectName && <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>门派</span><span style={{color:'#90CAF9'}}>{selectedPet.sectName} Lv{selectedPet.sectLevel||1}</span></div>}
                    {selectedPet.fatigue > 0 && <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#aaa'}}>疲劳</span><span style={{color: selectedPet.fatigue > 60 ? '#FF5252' : '#FFC107'}}>{selectedPet.fatigue}%</span></div>}
                  </div>

                  {/* 4. 技能列表 */}
                  <div style={{flex:1, overflowY:'auto', marginBottom:'15px'}}>
                      <div style={{fontSize:'12px', color:'#aaa', marginBottom:'8px', borderBottom:'1px solid #444', paddingBottom:'4px'}}>已学会技能</div>
                      <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                          {(selectedPet.moves || []).map((m, i) => (
                              <div key={i} style={{
                                  display:'flex', justifyContent:'space-between', alignItems:'center',
                                  background:'rgba(255,255,255,0.05)', padding:'8px 10px', borderRadius:'6px',
                                  borderLeft: `3px solid ${TYPES[m.t]?.color}`
                              }}>
                                  <div style={{flex:1}}>
                                      <div style={{fontSize:'12px', fontWeight:'bold', color:'#fff'}}>{m.name}</div>
                                      <div style={{fontSize:'10px', color: TYPES[m.t]?.color, marginTop:'2px'}}>{TYPES[m.t]?.name} | 威力 {m.p}</div>
                                  </div>
                                  <div style={{fontSize:'10px', color:'#888', textAlign:'right'}}>
                                      <div>PP</div>
                                      <div style={{color:'#fff'}}>{m.pp}/{m.maxPP||15}</div>
                                  </div>
                              </div>
                          ))}
                          {[...Array(Math.max(0, 4 - (selectedPet.moves || []).length))].map((_, i) => (
                              <div key={`empty-${i}`} style={{
                                  padding:'8px', borderRadius:'6px', border:'1px dashed #444', 
                                  fontSize:'11px', color:'#555', textAlign:'center'
                              }}>
                                  - 空技能槽 -
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* 5. 底部操作按钮 */}
                  <div className="pc-actions-tech" style={{marginTop:'auto', paddingTop:'15px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'10px'}}>
                    {selectedPartyIdx !== null && (
                      <button className="btn-tech primary" onClick={depositPokemon} style={{flex:1, padding:'10px', background:'#2196F3', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                        📥 存入仓库
                      </button>
                    )}
                    {selectedBoxIdx !== null && (
                      <>
                        <button className="btn-tech primary" onClick={withdrawPokemon} style={{flex:1, padding:'10px', background:'#4CAF50', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          📤 取出队伍
                        </button>
                        <button className="btn-tech danger" onClick={releasePokemon} style={{flex:1, padding:'10px', background:'#FF5252', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          👋 放生
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{color: '#666', textAlign: 'center', marginTop: '100px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <span style={{fontSize:'50px', marginBottom:'15px', opacity:0.3}}>🔍</span>
                    <div style={{fontSize:'14px'}}>请从队伍或存储箱中选择一只精灵<br/>查看详细数据分析</div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  
}
