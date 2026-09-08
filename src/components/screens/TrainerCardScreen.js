import React from 'react';
import ACHIEVEMENTS from '../../data/achievements';
import { FACTIONS } from '../../data/kingdom';
import { GAME_VERSION_LABEL } from '../../data/constants';
import { GANG_PRESETS } from '../../data/gang';
import { GENERAL_RARITY_CONFIG } from '../../data/generals';
import { getMilitaryRank } from '../../data/kingdom';
import { getNinjaRank } from '../../data/naruto';
import { MAPS } from '../../data';
import { MARRIAGE_CANDIDATES } from '../../data/marriage';
import { POKEDEX } from '../../data/pets';
import { SECT_COUNT } from '../../data';

export default function TrainerCardScreen({
  achStats,
  badges,
  buildRankStats,
  caughtDex,
  currentMapId,
  currentTitle,
  formatPlayTime,
  gang,
  getCurrentPlayTimeMs,
  getStats,
  gold,
  infinityState,
  kingdomWar,
  leagueWins,
  marriage,
  narutoState,
  party,
  renderAvatar,
  safeBack,
  savedData,
  setCurrentTitle,
  setView,
  trainerName,
  unlockedAchs,
  unlockedTitles
}) {
    const dexCount = caughtDex.length;
    const totalDex = POKEDEX.length;
    const progress = ((dexCount / Math.max(1, totalDex)) * 100).toFixed(1);
    const leader = party[0] || null;
    const kw = kingdomWar || {};
    const myFaction = kw.faction ? FACTIONS[kw.faction] : null;
    const myRank = kw.faction ? getMilitaryRank(kw.warContribution || 0, buildRankStats(kw)) : null;
    const recruitedGens = kw.recruitedGenerals || [];
    const gangInfo = gang?.gangId ? (GANG_PRESETS || []).find(g => g.id === gang.gangId) : null;
    const mapInfo = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const factionColor = myFaction?.color || '#6366f1';
    const totalBattles = (achStats.battlesWon || 0);
    const spouseName = marriage?.spouse ? (MARRIAGE_CANDIDATES.find(c => c.id === marriage.spouse)?.name) : null;

    return (
      <div onClick={() => setView(safeBack())} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          animation: 'modalFadeIn 0.3s ease-out'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
            width: '520px', maxWidth:'95vw', maxHeight: '90vh', overflowY: 'auto',
            background: 'linear-gradient(160deg, #0a0e1a 0%, #111827 40%, #1a1033 100%)',
            borderRadius: '24px', boxShadow: `0 30px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)`,
            position: 'relative'
        }}>
          {/* 顶部装饰横幅 */}
          <div style={{height:'80px', background:`linear-gradient(135deg, ${factionColor}40, #fbbf2420, ${factionColor}40)`, borderRadius:'24px 24px 0 0', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)'}} />
            <div style={{position:'absolute', bottom:0, left:0, right:0, height:'40px', background:'linear-gradient(to top, #0a0e1a, transparent)'}} />
          </div>

          {/* 头像浮出 */}
          <div style={{padding:'0 28px', marginTop:'-48px', position:'relative', zIndex:2}}>
            <div style={{display:'flex', gap:'18px', alignItems:'flex-end'}}>
              <div style={{
                width:'96px', height:'96px', borderRadius:'20px',
                background:'linear-gradient(135deg, #1e293b, #0f172a)',
                border:'3px solid rgba(255,255,255,0.12)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'56px',
                overflow:'hidden', flexShrink:0
              }}>
                {renderAvatar(leader) || '🧢'}
              </div>
              <div style={{flex:1, minWidth:0, paddingBottom:'4px'}}>
                <div style={{fontSize:'24px', fontWeight:'900', color:'#f1f5f9', letterSpacing:'1.5px', marginBottom:'4px', textShadow:'0 2px 8px rgba(0,0,0,0.5)'}}>{trainerName}</div>
                <div style={{position:'relative', display:'inline-block'}}>
                  <select value={currentTitle} onChange={e => setCurrentTitle(e.target.value)}
                    style={{padding:'4px 24px 4px 10px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.12)',
                      background:'rgba(255,255,255,0.06)', color:'#93c5fd', fontWeight:'600', fontSize:'11px',
                      appearance:'none', cursor:'pointer', outline:'none'}}>
                    {unlockedTitles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span style={{position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', fontSize:'8px', color:'#93c5fd', pointerEvents:'none'}}>▼</span>
                </div>
                <div style={{fontSize:'10px', color:'#475569', marginTop:'4px'}}>ID: {Math.floor(party[0]?.uid || 9527).toString().slice(-8)} · {mapInfo?.name || '关都'}</div>
              </div>
            </div>
            <button onClick={() => setView(safeBack())} style={{
              position:'absolute', top:'-28px', right:'16px', width:'32px', height:'32px', borderRadius:'50%',
              background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)',
              color:'#94a3b8', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)'
            }}>×</button>
          </div>

          {/* 核心数据面板 */}
          <div style={{padding:'20px 28px 16px'}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap:'10px'}}>
              {[
                { label:'金币', val: gold >= 1000000 ? (gold/10000).toFixed(0)+'万' : gold.toLocaleString(), color:'#fbbf24', icon:'💰' },
                { label:'图鉴', val: `${dexCount}/${totalDex}`, color:'#60a5fa', icon:'📚' },
                { label:'胜场', val: totalBattles.toLocaleString(), color:'#f87171', icon:'⚔️' },
                { label:'忍者', val: getNinjaRank(narutoState?.examsCompleted || 0)?.name || '学员', color:'#FF6F00', icon: getNinjaRank(narutoState?.examsCompleted || 0)?.icon || '📖' },
              ].map(s => (
                <div key={s.label} style={{background:'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', borderRadius:'14px', padding:'14px 8px', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)', transition:'transform 0.2s'}}>
                  <div style={{fontSize:'20px', marginBottom:'4px'}}>{s.icon}</div>
                  <div style={{fontSize:'16px', fontWeight:'900', color:s.color, letterSpacing:'0.5px'}}>{s.val}</div>
                  <div style={{fontSize:'9px', color:'#64748b', marginTop:'4px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'1px'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 我的队伍 — 展示所有精灵完整信息 */}
          <div style={{padding:'0 28px 18px'}}>
            <div style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', letterSpacing:'1.5px', display:'flex', alignItems:'center', gap:'6px'}}>
              <span>我的队伍</span>
              <span style={{fontSize:'10px', color:'#475569', fontWeight:'500'}}>({party.filter(p=>p.currentHp>0).length}/{party.length} 存活)</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'8px'}}>
              {Array.from({length:6}).map((_, i) => {
                const p = party[i];
                const stats = p ? getStats(p) : null;
                const hpPct = stats ? Math.min(100, (p.currentHp / Math.max(1, stats.maxHp) * 100)) : 0;
                return (
                  <div key={i} style={{
                    borderRadius:'14px', padding:'8px 4px',
                    background: p ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' : 'rgba(255,255,255,0.015)',
                    border: p ? `1px solid ${p.isShiny ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}` : '1px dashed rgba(255,255,255,0.05)',
                    textAlign:'center', minHeight:'90px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px',
                    boxShadow: p?.isShiny ? '0 0 12px rgba(251,191,36,0.15)' : 'none'
                  }}>
                    {p ? (<>
                      <div style={{width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center'}}>{renderAvatar(p)}</div>
                      <div style={{fontSize:'9px', color:'#e2e8f0', fontWeight:'700', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {p.isShiny && '✨'}{p.name}
                      </div>
                      <div style={{fontSize:'9px', color:'#64748b', fontWeight:'600'}}>Lv.{p.level}</div>
                      <div style={{width:'80%', height:'3px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden'}}>
                        <div style={{height:'100%', width:`${hpPct}%`, background: hpPct > 50 ? '#22c55e' : hpPct > 20 ? '#eab308' : '#ef4444', borderRadius:'2px', transition:'width 0.3s'}} />
                      </div>
                    </>) : <div style={{fontSize:'20px', opacity:0.1}}>+</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 徽章 */}
          <div style={{padding:'0 28px 16px'}}>
            <div style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', letterSpacing:'1.5px'}}>徽章收集 ({badges.length})</div>
            <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
              {badges.length === 0 
                ? <div style={{fontSize:'11px', color:'#475569', fontStyle:'italic'}}>尚未获得徽章</div>
                : badges.map((b, i) => (
                  <div key={i} style={{
                    width:'34px', height:'34px', borderRadius:'10px',
                    background:'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
                    border:'1px solid rgba(251,191,36,0.25)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
                    boxShadow:'0 2px 8px rgba(251,191,36,0.1)'
                  }}>{b}</div>
                ))
              }
            </div>
          </div>

          {/* 势力信息 */}
          {(myFaction || gangInfo || spouseName) && (
            <div style={{padding:'0 28px 16px'}}>
              <div style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', letterSpacing:'1.5px'}}>势力与社交</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'8px'}}>
                {myFaction && (
                  <div style={{padding:'12px 14px', borderRadius:'12px', background:`linear-gradient(135deg, ${factionColor}15, ${factionColor}05)`, border:`1px solid ${factionColor}25`}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                      <span style={{fontSize:'18px'}}>{myFaction.icon}</span>
                      <span style={{fontSize:'13px', fontWeight:'800', color:factionColor}}>{myFaction.fullName || myFaction.name}</span>
                    </div>
                    {myRank && <div style={{fontSize:'11px', color:'#e2e8f0'}}>{myRank.icon} {myRank.name} · 战功 {(kw.warContribution||0).toLocaleString()}</div>}
                  </div>
                )}
                {gangInfo && (
                  <div style={{padding:'12px 14px', borderRadius:'12px', background:'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))', border:'1px solid rgba(139,92,246,0.2)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <span style={{fontSize:'18px'}}>{gangInfo.icon}</span>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'700', color:'#c4b5fd'}}>{gangInfo.name}</div>
                        <div style={{fontSize:'10px', color:'#64748b'}}>帮贡 {(gang.contribution||0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
                {spouseName && (
                  <div style={{padding:'12px 14px', borderRadius:'12px', background:'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.03))', border:'1px solid rgba(236,72,153,0.2)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <span style={{fontSize:'18px'}}>💕</span>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'700', color:'#f9a8d4'}}>{spouseName}</div>
                        <div style={{fontSize:'10px', color:'#64748b'}}>好感度 {(marriage.affections?.[marriage.spouse]||0)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 麾下名将 */}
          {recruitedGens.length > 0 && (
            <div style={{padding:'0 28px 16px'}}>
              <div style={{fontSize:'12px', fontWeight:'700', color:'#94a3b8', marginBottom:'10px', letterSpacing:'1.5px'}}>麾下名将 ({recruitedGens.length})</div>
              <div style={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
                {recruitedGens.slice(0, 16).map((g, i) => {
                  const rc = GENERAL_RARITY_CONFIG?.[g.rarity] || {};
                  return (
                    <div key={i} title={g.name} style={{
                      width:'36px', height:'42px', borderRadius:'8px',
                      background:`linear-gradient(180deg, ${rc.color || '#666'}22, ${rc.color || '#666'}08)`,
                      border:`1px solid ${rc.color || '#666'}33`,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
                    }}>
                      <div style={{fontSize:'16px', fontWeight:'900', color:rc.color || '#aaa', fontFamily:'serif'}}>{(g.name||'?')[0]}</div>
                      <div style={{fontSize:'9px', color:'#64748b', marginTop:'1px'}}>{rc.label || ''}</div>
                    </div>
                  );
                })}
                {recruitedGens.length > 16 && <div style={{fontSize:'10px', color:'#475569', alignSelf:'center'}}>+{recruitedGens.length - 16}</div>}
              </div>
            </div>
          )}

          {/* 底部综合数据 */}
          <div style={{padding:'16px 28px 24px', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(0,0,0,0.15)', borderRadius:'0 0 24px 24px'}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:'12px'}}>
              {[
                { label:'冠军次数', val: leagueWins || 0, icon:'🏆' },
                { label:'门派掌门', val: `${achStats.sectChiefsDefeated || 0}/${SECT_COUNT}`, icon:'🏔️' },
                { label:'成就', val: `${unlockedAchs.length}/${ACHIEVEMENTS.length}`, icon:'🎖️' },
                { label:'最佳连胜', val: achStats.maxWinStreak || 0, icon:'🔥' },
                { label:'无限城', val: `${infinityState?.bestFloor || 0}F`, icon:'🏯' },
                { label:'游玩时长', val: formatPlayTime(getCurrentPlayTimeMs()), icon:'⏱️' },
              ].map(s => (
                <div key={s.label} style={{textAlign:'center'}}>
                  <div style={{fontSize:'14px', marginBottom:'2px'}}>{s.icon}</div>
                  <div style={{fontSize:'14px', fontWeight:'800', color:'#e2e8f0'}}>{s.val}</div>
                  <div style={{fontSize:'9px', color:'#475569', marginTop:'2px', letterSpacing:'0.5px'}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:'10px',color:'rgba(255,255,255,0.2)',marginTop:'8px'}}>游戏版本 {GAME_VERSION_LABEL} · 存档版本 V{savedData.saveVersion || '?'}</div>
          </div>
        </div>
      </div>
    );
  
}
