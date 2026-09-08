import React from 'react';
import { calcChakraAffinity } from '../../data/naruto';
import { CHAKRA_CONFIG } from '../../data/naruto';
import { CHAKRA_NATURE_MAP } from '../../data/naruto';
import { COMBO_JUTSU_LIST } from '../../data/constants';
import { getJutsuMasteryLevel } from '../../data/naruto';
import { getNinjaRank } from '../../data/naruto';
import { JUTSU_DB } from '../../data/naruto';
import { JUTSU_MASTERY_LEVELS } from '../../data/naruto';
import { NINJA_RANKS } from '../../data/naruto';

export default function JutsuCodexScreen({
  jutsuCodexFilter,
  jutsuCodexTab,
  narutoState,
  ninjaRankAtLeast,
  party,
  partyMatchesComboNatures,
  safeBack,
  setJutsuCodexFilter,
  setJutsuCodexTab,
  setView
}) {
    const { nature: fNature, rank: fRank, cat: fCat, tag: fTag, search: fSearch } = jutsuCodexFilter;
    const allNatures = [{ id: 'ALL', name: '全部', icon: '📖' }, ...CHAKRA_CONFIG.natureTypes.map(n => ({ id: n, name: CHAKRA_NATURE_MAP[n]?.name || n, icon: CHAKRA_NATURE_MAP[n]?.icon || '🔮' })), { id: 'NONE', name: '通用/特殊', icon: '⭐' }];
    const allRanks = ['ALL', 'D', 'C', 'B', 'A', 'S'];
    const allCats = [{ id: 'ALL', name: '全部' }, { id: 'physical', name: '体术' }, { id: 'special', name: '忍术' }, { id: 'status', name: '辅助' }];
    const allTags = [{ id: 'ALL', name: '全部' }, { id: 'kekkei', name: '🩸 血继' }, { id: 'sage', name: '🐸 仙术' }, { id: 'forbidden', name: '⛔ 禁术' }];
    const filtered = JUTSU_DB.filter(j => {
      if (fNature !== 'ALL') { if (fNature === 'NONE') { if (j.nature !== null) return false; } else { if (j.nature !== fNature) return false; } }
      if (fRank !== 'ALL' && j.rank !== fRank) return false;
      if (fCat !== 'ALL' && j.cat !== fCat) return false;
      if (fTag === 'kekkei' && !j.isKekkei) return false;
      if (fTag === 'sage' && !j.isSpecial) return false;
      if (fTag === 'forbidden' && !(j.recoil && j.recoil >= 0.2)) return false;
      if (fSearch && !j.name.includes(fSearch) && !(j.desc || '').includes(fSearch)) return false;
      return true;
    });
    const rankColors = { D: '#B0BEC5', C: '#81C784', B: '#90CAF9', A: '#CE93D8', S: '#FFB74D' };
    const catLabels = { physical: '体', special: '忍', status: '辅' };
    const mastery = narutoState?.jutsuMastery || {};
    const affinity = calcChakraAffinity(mastery);
    const ninjaRkCodex = getNinjaRank(narutoState.examsCompleted || 0);
    return (
      <div className="screen jutsu-codex-screen" style={{background:'linear-gradient(135deg,#0a0a1a,#1a1a2e,#0a0a1a)',color:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',background:'rgba(0,0,0,0.4)',borderBottom:'1px solid rgba(255,152,0,0.15)',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <button onClick={()=>setView(safeBack())} style={{padding:'6px 14px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#aaa',fontSize:'12px',cursor:'pointer'}}>⬅ 返回</button>
          <div style={{fontSize:'16px',fontWeight:'900',letterSpacing:'2px',background:'linear-gradient(90deg,#FF6F00,#FFB74D)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>📖 忍术图鉴</div>
          <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{jutsuCodexTab === 'jutsu' ? `${filtered.length}/${JUTSU_DB.length}` : `${COMBO_JUTSU_LIST.length}`}</div>
        </div>
        <div style={{display:'flex',gap:'0',borderBottom:'2px solid rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.2)',flexShrink:0}}>
          <button type="button" onClick={()=>setJutsuCodexTab('jutsu')} style={{flex:1,padding:'10px',border:'none',background:'transparent',color:jutsuCodexTab==='jutsu'?'#FFB74D':'rgba(255,255,255,0.4)',fontSize:'13px',fontWeight:'700',cursor:'pointer',borderBottom:jutsuCodexTab==='jutsu'?'2px solid #FF6F00':'2px solid transparent'}}>📖 忍术图鉴 ({JUTSU_DB.length})</button>
          <button type="button" onClick={()=>setJutsuCodexTab('combo')} style={{flex:1,padding:'10px',border:'none',background:'transparent',color:jutsuCodexTab==='combo'?'#CE93D8':'rgba(255,255,255,0.4)',fontSize:'13px',fontWeight:'700',cursor:'pointer',borderBottom:jutsuCodexTab==='combo'?'2px solid #9C27B0':'2px solid transparent'}}>🌀 组合忍术 ({COMBO_JUTSU_LIST.length})</button>
        </div>
        {jutsuCodexTab === 'jutsu' && (<div className="jutsu-codex-body">
          <aside className="jutsu-codex-filter">
            <div className="jutsu-filter-title">筛选卷轴</div>
            {affinity && <div className="jutsu-affinity-pill">查克拉亲和: {CHAKRA_NATURE_MAP[affinity]?.icon} {CHAKRA_NATURE_MAP[affinity]?.name}</div>}
            {(() => { const natureStats = {}; const rankStats = {}; JUTSU_DB.forEach(j => { const n = j.nature || 'NONE'; natureStats[n] = (natureStats[n]||0)+1; rankStats[j.rank] = (rankStats[j.rank]||0)+1; }); const collected = (narutoState?.jutsuCollection||[]).length; return (
              <div className="jutsu-stat-panel">
                <div><span>收集</span><strong>{collected}/{JUTSU_DB.length}</strong></div>
                <div className="jutsu-stat-ranks">{allRanks.filter(r=>r!=='ALL').map(r=> <span key={r} style={{color:rankColors[r]||'#888'}}>{r}:{rankStats[r]||0}</span>)}</div>
                <div className="jutsu-stat-natures">{CHAKRA_CONFIG.natureTypes.slice(0,5).map(n=> <span key={n}>{CHAKRA_NATURE_MAP[n]?.icon}{natureStats[n]||0}</span>)}</div>
              </div>
            ); })()}
            <input className="jutsu-search-input" type="text" placeholder="搜索忍术名称或描述..." value={fSearch} onChange={e=>setJutsuCodexFilter(p=>({...p,search:e.target.value}))} />
            <div className="jutsu-filter-group">
              <div className="jutsu-filter-label">性质</div>
              <div className="jutsu-chip-row">{allNatures.map(n => (
                <button key={n.id} className={`jutsu-chip ${fNature===n.id?'active':''}`} onClick={()=>setJutsuCodexFilter(p=>({...p,nature:n.id}))}>{n.icon} {n.name}</button>
              ))}</div>
            </div>
            <div className="jutsu-filter-group">
              <div className="jutsu-filter-label">段位</div>
              <div className="jutsu-chip-row">{allRanks.map(r => (
                <button key={r} className={`jutsu-chip rank-chip ${fRank===r?'active':''}`} onClick={()=>setJutsuCodexFilter(p=>({...p,rank:r}))} style={fRank===r ? {borderColor:rankColors[r]||'rgba(255,255,255,0.2)',color:rankColors[r]||'#fff'} : undefined}>{r === 'ALL' ? '全部' : r}</button>
              ))}</div>
            </div>
            <div className="jutsu-filter-group">
              <div className="jutsu-filter-label">类型</div>
              <div className="jutsu-chip-row">{allCats.map(c => (
                <button key={c.id} className={`jutsu-chip blue ${fCat===c.id?'active':''}`} onClick={()=>setJutsuCodexFilter(p=>({...p,cat:c.id}))}>{c.name}</button>
              ))}</div>
            </div>
            <div className="jutsu-filter-group">
              <div className="jutsu-filter-label">标签</div>
              <div className="jutsu-chip-row">{allTags.map(t => (
                <button key={t.id} className={`jutsu-chip purple ${fTag===t.id?'active':''}`} onClick={()=>setJutsuCodexFilter(p=>({...p,tag:p.tag===t.id?'ALL':t.id}))}>{t.name}</button>
              ))}</div>
            </div>
          </aside>
          <div className="jutsu-codex-results">
            <div className="jutsu-codex-grid">
            {filtered.map(j => {
              const natureInfo = j.nature ? CHAKRA_NATURE_MAP[j.nature] : null;
              const mLevel = getJutsuMasteryLevel(mastery[j.id] || 0);
              const uses = mastery[j.id] || 0;
              const nextLevel = JUTSU_MASTERY_LEVELS.find(l => l.minUses > uses);
              return (
                <div key={j.id} className={`jutsu-card ${j.isKekkei?'kekkei':''} ${j.isSpecial?'special':''}`} style={{'--rank-color':rankColors[j.rank]||'#666','--nature-color':natureInfo?.color||rankColors[j.rank]||'#FF8F00'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                    <span style={{fontSize:'11px',padding:'2px 6px',borderRadius:'4px',background:(rankColors[j.rank]||'#666')+'22',color:rankColors[j.rank]||'#aaa',fontWeight:'800'}}>{j.rank}</span>
                    {natureInfo && <span style={{fontSize:'12px'}}>{natureInfo.icon}</span>}
                    <span style={{fontSize:'13px',fontWeight:'800',flex:1}}>{j.name}</span>
                    <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'4px',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)'}}>{catLabels[j.cat]||j.cat}</span>
                    {j.isKekkei && <span style={{fontSize:'9px',padding:'1px 5px',borderRadius:'3px',background:'rgba(156,39,176,0.15)',color:'#CE93D8'}}>血继</span>}
                    {j.isSpecial && <span style={{fontSize:'9px',padding:'1px 5px',borderRadius:'3px',background:'rgba(255,193,7,0.15)',color:'#FFD54F'}}>特殊</span>}
                  </div>
                  <div className="jutsu-card-desc">{j.desc}</div>
                  <div className="jutsu-mini-stats">
                    {j.p > 0 && <span>威力 <span style={{color:'#FF8A80',fontWeight:'700'}}>{j.p}</span></span>}
                    <span>PP <span style={{fontWeight:'700'}}>{j.pp}</span></span>
                    <span>查克拉 <span style={{color:'#64B5F6',fontWeight:'700'}}>{j.chakraCost}</span></span>
                    {j.recoil && <span style={{color:'#EF5350'}}>反噬 {Math.round(j.recoil*100)}%</span>}
                    {j.effect?.type === 'HEAL' && <span style={{color:'#81C784'}}>回复 {Math.round(j.effect.val*100)}%</span>}
                    {j.effect?.type === 'STATUS' && <span style={{color:'#FFB74D'}}>{j.effect.status} {Math.round((j.effect.chance||1)*100)}%</span>}
                    {j.effect?.type === 'BUFF' && <span style={{color:'#64B5F6'}}>+{j.effect.val} {j.effect.stat}</span>}
                    {j.effect?.type === 'DEBUFF' && <span style={{color:'#EF9A9A'}}>-{j.effect.val} {j.effect.stat}</span>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'10px'}}>
                    <span style={{fontSize:'10px'}}>{mLevel.icon}</span>
                    <span style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}>{mLevel.name}</span>
                    {uses > 0 && <span style={{fontSize:'9px',color:'rgba(255,255,255,0.25)'}}>使用{uses}次</span>}
                    {nextLevel && <div style={{flex:1,height:'3px',borderRadius:'2px',background:'rgba(255,255,255,0.06)',marginLeft:'6px'}}>
                      <div style={{height:'100%',borderRadius:'2px',background:'linear-gradient(90deg,#FF6F00,#FFB74D)',width:`${Math.min(100,(uses/nextLevel.minUses)*100)}%`}}/>
                    </div>}
                    {mLevel.bonus > 0 && <span style={{fontSize:'9px',color:'#FFB74D'}}>+{Math.round(mLevel.bonus*100)}%</span>}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="jutsu-empty-state">暂无匹配的忍术</div>}
            </div>
          </div>
        </div>)}
        {jutsuCodexTab === 'combo' && (
          <div className="jutsu-codex-results">
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.45)',marginBottom:'12px',lineHeight:1.5,maxWidth:'1280px',marginLeft:'auto',marginRight:'auto'}}>当前忍者段位：{ninjaRkCodex.icon} {ninjaRkCodex.name} · 双打战斗中可发动（需场上两只出战精灵满足配方与查克拉）</div>
            <div className="jutsu-codex-grid combo-grid">
              {COMBO_JUTSU_LIST.map((combo) => {
                const rankOk = ninjaRankAtLeast(ninjaRkCodex.id, combo.minRank);
                const partyOk = partyMatchesComboNatures(party, combo.natures);
                const unlocked = rankOk && partyOk;
                const needRankName = NINJA_RANKS.find(x => x.id === combo.minRank)?.name || combo.minRank;
                const cond = [];
                if (!rankOk) cond.push(`段位≥「${needRankName}」`);
                if (!partyOk) cond.push('队伍内需有精灵持有配方所需性质忍术（同性质需不同精灵）');
                return (
                  <div key={combo.id} className={`jutsu-card combo-card ${unlocked ? 'unlocked' : 'locked'}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ fontSize: '26px', lineHeight: 1 }}>{combo.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{combo.name}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.45, marginBottom: '6px' }}>{combo.desc}</div>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: unlocked ? '#A5D6A7' : '#FFAB91' }}>{unlocked ? '✅ 已解锁（图鉴）' : `🔒 未解锁：${cond.join(' · ')}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  
}
