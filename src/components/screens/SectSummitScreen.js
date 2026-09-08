import React from 'react';
import { DEFAULT_SECT_RESOURCES } from '../../data';
import { evaluateSectStrategy } from '../../data';
import { FACTIONS } from '../../data/kingdom';
import { getActiveJianghuEvent } from '../../data';
import { getAvailableSectRealms } from '../../data';
import { getComboSkillKey } from '../../data';
import { getSectFactionStance } from '../../data';
import { getSectMartialArts } from '../../data';
import { getSectRankInfo } from '../../data';
import { POKEDEX } from '../../data/pets';
import { SECT_ALLIANCES } from '../../data';
import { SECT_CHIEFS_CONFIG } from '../../data';
import { SECT_COMBO_SKILLS } from '../../data';
import { SECT_DB } from '../../data';
import { SECT_JOIN_REQ_BADGES } from '../../data';
import { SECT_RANKS } from '../../data';
import { SECT_RESOURCE_LABELS } from '../../data';
import { SECT_SHOP_ITEMS } from '../../data';
import { SECT_SUB_SECT_REQ_RANK } from '../../data';
import { SECT_SWITCH_REP_COST } from '../../data';
import { SECT_TEAMS } from '../../data';
import { SECT_XINFA } from '../../data';

export default function SectSummitScreen({
  badges,
  buyFromSectShop,
  changeSectFactionStance,
  claimAllSectDaily,
  currentTitle,
  fusionState,
  getSectEventCycleKey,
  handleJianghuEventChoice,
  joinPlayerSect,
  kingdomWar,
  learnSectMartialArt,
  openSectTeamDetail,
  party,
  safeBack,
  sectHubTab,
  sectJoinFocus,
  sectPlayer,
  sectTitles,
  setCurrentTitle,
  setPlayerSubSectFn,
  setSectHubTab,
  setSectJoinFocus,
  setView,
  showMapToast,
  startChiefTrial,
  startSectChallenge,
  startSectRealmFromHub,
  switchPlayerSect,
  upgradePlayerXinfa
}) {
    const ps = sectPlayer;
    const mainSect = ps.playerSect ? SECT_DB[ps.playerSect] : null;
    const rankInfo = getSectRankInfo(ps.sectRank || 0);
    const res = ps.sectResources || DEFAULT_SECT_RESOURCES;
    const tabs = [
      { id: 'overview', label: '总览' },
      { id: 'join', label: ps.playerSect ? '身份' : '拜入' },
      { id: 'xinfa', label: '心法', lock: !ps.playerSect },
      { id: 'martial', label: '武学', lock: !ps.playerSect },
      { id: 'daily', label: '日常', lock: !ps.playerSect },
      { id: 'shop', label: '商店', lock: !ps.playerSect },
      { id: 'realm', label: '秘境', lock: (ps.sectRank || 0) < 3 },
      { id: 'jianghu', label: '江湖', lock: (ps.sectRank || 0) < 5 },
      { id: 'challenge', label: '挑战' },
    ];
    const partySectIds = [...new Set(party.map(p => p.sectId).filter(Boolean))];
    const availRealms = getAvailableSectRealms(badges.length, partySectIds, fusionState.sectRealmsCleared || []);
    const jianghuEvt = getActiveJianghuEvent();
    const jianghuCycle = getSectEventCycleKey();
    const jianghuChoiceLog = jianghuEvt
      ? (ps.sectEventLog || []).find(entry => entry.eventId === jianghuEvt.id && entry.cycle === jianghuCycle)
      : null;
    const comboKey = getComboSkillKey(ps.playerSect, ps.playerSubSect);
    const comboSkill = comboKey ? SECT_COMBO_SKILLS[comboKey] : null;
    const sectStrategy = evaluateSectStrategy({ sectPlayer: ps, kingdomWar, party, badges: badges.length, territories: kingdomWar?.territories || {} });
    const sectJoinIds = Object.keys(SECT_DB).map(Number).sort((a, b) => a - b);
    const focusedSectId = SECT_DB[sectJoinFocus] ? sectJoinFocus : (ps.playerSect || sectJoinIds[0] || 1);
    const focusedSect = SECT_DB[focusedSectId] || SECT_DB[sectJoinIds[0]];
    const focusedChief = SECT_CHIEFS_CONFIG[focusedSectId] || {};
    const focusedArts = getSectMartialArts(focusedSectId).slice(0, 3);
    const focusedTeam = (SECT_TEAMS[focusedSectId] || []).slice(0, 6).map(pid => POKEDEX.find(p => p.id === pid)).filter(Boolean);
    const focusedEffect = typeof focusedSect?.effect === 'function' ? focusedSect.effect(3) : (focusedSect?.desc || '门派被动');
    const joinProgress = Math.min(100, Math.round((badges.length / Math.max(1, SECT_JOIN_REQ_BADGES)) * 100));
    const canJoinFocused = !ps.playerSect && badges.length >= SECT_JOIN_REQ_BADGES;
    const canSubFocused = ps.playerSect && ps.playerSect !== focusedSectId && (ps.sectRank || 0) >= SECT_SUB_SECT_REQ_RANK && ps.playerSubSect !== focusedSectId;
    const canSwitchFocused = ps.playerSect && ps.playerSect !== focusedSectId;

    return (
      <div className="screen sect-hub-screen" style={{background: '#121212', color: '#fff', display:'flex', flexDirection:'column'}}>
        <div className="nav-header sect-hub-header" style={{ borderBottom:'1px solid #333', background: '#1e1e1e', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <button className="btn-back" onClick={() => setView(safeBack())} style={{ color:'#fff', background: '#333', border: '1px solid #555', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>🔙 返回</button>
          <div className="nav-title" style={{fontSize:'17px', fontWeight:'bold', color:'#fff'}}>🏔️ 武侠门派</div>
          <div style={{ fontSize:'11px', color:'#FFD700', textAlign:'right' }}>{mainSect ? <span>{mainSect.emoji} {rankInfo.name}</span> : <span>未拜入</span>}</div>
        </div>
        {ps.playerSect && (
          <div style={{ padding:'10px 16px', background:'#1a1a1a', borderBottom:'1px solid #333', display:'flex', flexWrap:'wrap', gap:'8px', fontSize:'11px' }}>
            {Object.entries(SECT_RESOURCE_LABELS).map(([k, label]) => (
              <span key={k} style={{ background:'#2a2a2a', padding:'4px 8px', borderRadius:'6px' }}>{label}: <b style={{color:'#FFD700'}}>{res[k] || 0}</b></span>
            ))}
          </div>
        )}
        <div className="sect-hub-tabs" style={{ display:'flex', gap:'4px', padding:'8px 12px', overflowX:'auto', flexShrink:0, borderBottom:'1px solid #333', background:'#161616' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => !t.lock && setSectHubTab(t.id)} disabled={t.lock}
              style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor: t.lock ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:'bold', whiteSpace:'nowrap',
                background: sectHubTab === t.id ? '#4CAF50' : '#333', color: t.lock ? '#666' : '#fff', opacity: t.lock ? 0.5 : 1 }}>
              {t.label}{t.lock ? '🔒' : ''}
            </button>
          ))}
        </div>
        <div className="sect-hub-body" style={{flex:1, overflowY:'auto', padding:'16px'}}>
          {sectHubTab === 'overview' && (
            <div>
              {ps.playerSect ? (
                <div style={{ background:`linear-gradient(135deg, ${mainSect.color}33, #161b22 58%, #0b1220)`, border:`1px solid ${mainSect.color}66`, borderRadius:'14px', padding:'16px', marginBottom:'16px', boxShadow:`0 12px 34px ${mainSect.color}18` }}>
                  <div style={{display:'flex', gap:'14px', alignItems:'flex-start', marginBottom:'14px'}}>
                    <div style={{width:'54px', height:'54px', borderRadius:'14px', background:`linear-gradient(135deg, ${mainSect.color}, #111827)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', boxShadow:`0 8px 20px ${mainSect.color}30`}}>{mainSect.emoji}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{ fontSize:'22px', fontWeight:'900', color: '#fff', letterSpacing:'1px' }}>{mainSect.name} · {sectStrategy.archetype.role}</div>
                      <div style={{ fontSize:'12px', color:'#cbd5e1', marginTop:'5px', lineHeight:1.6 }}>{sectStrategy.archetype.plan}</div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'8px'}}>
                        {sectStrategy.archetype.tags.map(tag => <span key={tag} style={{fontSize:'10px', padding:'3px 8px', borderRadius:'999px', background:`${mainSect.color}22`, color:mainSect.color, border:`1px solid ${mainSect.color}40`, fontWeight:'800'}}>{tag}</span>)}
                        <span style={{fontSize:'10px', padding:'3px 8px', borderRadius:'999px', background:'rgba(255,255,255,0.08)', color:'#e5e7eb'}}>身份 {rankInfo.name}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))', gap:'8px', marginBottom:'12px'}}>
                    {sectStrategy.metrics.map(m => (
                      <div key={m.label} style={{background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'10px'}}>
                        <div style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700'}}>{m.label}</div>
                        <div style={{fontSize:'15px', color:'#fff', fontWeight:'900', marginTop:'3px'}}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:'12px', background:`linear-gradient(135deg, ${sectStrategy.difficulty.color}22, rgba(0,0,0,0.18))`, border:`1px solid ${sectStrategy.difficulty.color}55`, borderRadius:'12px', padding:'11px 12px', display:'flex', justifyContent:'space-between', gap:'12px', alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:'12px', color:sectStrategy.difficulty.color, fontWeight:'900'}}>修行难度 · {sectStrategy.difficulty.label}</div>
                      <div style={{fontSize:'10px', color:'#cbd5e1', lineHeight:1.5, marginTop:'3px'}}>{sectStrategy.difficulty.desc}</div>
                    </div>
                    <div style={{fontSize:'18px', color:'#fff', fontWeight:'900', flexShrink:0}}>{sectStrategy.difficultyScore}</div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'10px'}}>
                    <div style={{background:'rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'12px'}}>
                      <div style={{fontSize:'12px', fontWeight:'900', color:'#e5e7eb', marginBottom:'8px'}}>下一步优先级</div>
                      {sectStrategy.priorities.slice(0, 3).map((p, i) => (
                        <div key={p.label} style={{display:'flex', gap:'8px', marginTop:i ? '8px' : 0}}>
                          <span style={{width:'20px', height:'20px', borderRadius:'8px', background:`${mainSect.color}30`, color:mainSect.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', flexShrink:0}}>{i + 1}</span>
                          <div>
                            <div style={{fontSize:'12px', color:'#fff', fontWeight:'800'}}>{p.label}</div>
                            <div style={{fontSize:'10px', color:'#94a3b8', lineHeight:1.5}}>{p.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'12px'}}>
                      <div style={{fontSize:'12px', fontWeight:'900', color:'#e5e7eb', marginBottom:'8px'}}>国战立场推荐</div>
                      {sectStrategy.stanceOptions.slice(0, 4).map(opt => {
                        const f = FACTIONS[opt.factionId];
                        return (
                          <button key={opt.factionId} type="button" disabled={(ps.sectRank || 0) < 8}
                            onClick={() => changeSectFactionStance(ps.playerSect, opt.factionId)}
                            style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', marginBottom:'6px', padding:'7px 9px', borderRadius:'9px', border:`1px solid ${opt.current ? f.color : 'rgba(255,255,255,0.1)'}`, background: opt.current ? `${f.color}22` : 'rgba(255,255,255,0.05)', color:'#fff', cursor:(ps.sectRank || 0) < 8 ? 'not-allowed' : 'pointer', opacity:(ps.sectRank || 0) < 8 ? 0.5 : 1}}>
                            <span style={{fontSize:'11px', fontWeight:'800'}}>{f.icon} {f.fullName}</span>
                            <span style={{fontSize:'10px', color: opt.current ? f.lightColor : '#94a3b8'}}>{opt.current ? '当前' : opt.label}</span>
                          </button>
                        );
                      })}
                      {(ps.sectRank || 0) < 8 && <div style={{fontSize:'10px', color:'#94a3b8', lineHeight:1.5}}>代掌门后可调整立场，当前仅展示推荐。</div>}
                    </div>
                    <div style={{background:'rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'12px'}}>
                      <div style={{fontSize:'12px', fontWeight:'900', color:'#e5e7eb', marginBottom:'8px'}}>路线取舍</div>
                      {sectStrategy.depthRules.map(rule => (
                        <div key={rule.label} style={{marginBottom:'8px'}}>
                          <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
                            <span style={{fontSize:'11px', color:'#fff', fontWeight:'800'}}>{rule.label}</span>
                            <span style={{fontSize:'10px', color:mainSect.color, fontWeight:'900'}}>{rule.value}</span>
                          </div>
                          <div style={{fontSize:'10px', color:'#94a3b8', lineHeight:1.45, marginTop:'2px'}}>{rule.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {ps.playerSubSect && <div style={{ marginTop:'10px', fontSize:'12px', color:'#81C784' }}>副修：{SECT_DB[ps.playerSubSect]?.name}</div>}
                  {comboSkill && <div style={{ marginTop:'8px', fontSize:'12px', color:'#FFD54F' }}>组合技：{comboSkill.name} — {comboSkill.desc}</div>}
                  {(ps.sectRank || 0) >= 8 && ps.playerSect && (
                    <div style={{ marginTop:'12px' }}>
                      <div style={{ fontSize:'11px', color:'#aaa', marginBottom:'6px' }}>门派国战立场（代掌门可改）</div>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {['wei','shu','wu','jin'].map(fid => (
                          <button key={fid} onClick={() => changeSectFactionStance(ps.playerSect, fid)}
                            disabled={(ps.sectRank || 0) < 8}
                            style={{ padding:'4px 10px', borderRadius:'6px', border:'1px solid #555', background: getSectFactionStance(ps.playerSect, ps.sectStances) === fid ? '#4CAF50' : ((ps.sectRank || 0) < 8 ? '#222' : '#333'), color: (ps.sectRank || 0) < 8 ? '#666' : '#fff', fontSize:'11px', cursor: (ps.sectRank || 0) < 8 ? 'not-allowed' : 'pointer', opacity: (ps.sectRank || 0) < 8 ? 0.5 : 1 }}>
                            {FACTIONS[fid]?.fullName || fid}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'30px', color:'#aaa' }}>
                  <div style={{ fontSize:'48px' }}>🏔️</div>
                  <div style={{ marginTop:'12px' }}>获得 {SECT_JOIN_REQ_BADGES} 枚徽章后可拜入门派</div>
                  <button className="sect-primary-action" onClick={() => setSectHubTab('join')} style={{ marginTop:'16px', padding:'10px 24px', background:'#4CAF50', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'bold', cursor:'pointer' }}>选择门派</button>
                </div>
              )}
              <div style={{ fontSize:'13px', fontWeight:'bold', marginBottom:'8px' }}>门派联盟</div>
              {Object.values(SECT_ALLIANCES).map(al => (
                <div key={al.name} style={{ background:'#1e1e1e', borderRadius:'8px', padding:'10px', marginBottom:'8px', border:'1px solid #333' }}>
                  <div style={{ fontWeight:'bold', color:'#FFD700' }}>{al.name}</div>
                  <div style={{ fontSize:'11px', color:'#aaa' }}>{al.desc}</div>
                  <div style={{ display:'flex', gap:'6px', marginTop:'6px', flexWrap:'wrap' }}>
                    {al.sects.map(sid => <span key={sid} style={{ fontSize:'11px', background:'#333', padding:'2px 6px', borderRadius:'4px' }}>{SECT_DB[sid]?.emoji} {SECT_DB[sid]?.name}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {sectHubTab === 'join' && (
            <div className="sect-join-workspace" style={{ '--sect-color': focusedSect?.color || '#4CAF50' }}>
              <section className="sect-join-hero">
                <div>
                  <span className="sect-join-kicker">SECT COMMAND</span>
                  <h2>{ps.playerSect ? '门派身份与改修' : '选择主修门派'}</h2>
                  <p>{ps.playerSect ? '比较各派路线，安排副修、改修或查看掌门挑战情报。' : '先看战斗风格、守关阵容和资源门槛，再决定第一门派。'}</p>
                </div>
                <div className="sect-join-stats">
                  <div><span>徽章</span><strong>{badges.length}/{SECT_JOIN_REQ_BADGES}</strong></div>
                  <div><span>身份</span><strong>{rankInfo.name}</strong></div>
                  <div><span>声望</span><strong>{res.reputation || 0}</strong></div>
                  <div><span>可选门派</span><strong>{sectJoinIds.length}</strong></div>
                </div>
              </section>

              {!ps.playerSect && (
                <div className="sect-join-unlock">
                  <div>
                    <strong>拜入进度</strong>
                    <span>{badges.length >= SECT_JOIN_REQ_BADGES ? '已满足入门条件' : `还需要 ${Math.max(0, SECT_JOIN_REQ_BADGES - badges.length)} 枚徽章`}</span>
                  </div>
                  <div className="sect-join-progress"><span style={{ width: `${joinProgress}%` }} /></div>
                </div>
              )}

              <div className="sect-join-layout">
                <aside className="sect-join-list" aria-label="门派列表">
                  <div className="sect-panel-title">
                    <span>门派名录</span>
                    <b>{sectJoinIds.length}</b>
                  </div>
                  <div className="sect-join-list-scroll">
                    {sectJoinIds.map(id => {
                      const sect = SECT_DB[id];
                      const chief = SECT_CHIEFS_CONFIG[id] || {};
                      const isMain = ps.playerSect === id;
                      const isSub = ps.playerSubSect === id;
                      const isFocused = focusedSectId === id;
                      return (
                        <button key={id} type="button" onClick={() => setSectJoinFocus(id)}
                          className={`sect-list-row${isFocused ? ' is-active' : ''}${isMain ? ' is-main' : ''}${isSub ? ' is-sub' : ''}`}
                          style={{ '--sect-color': sect.color }}>
                          <span className="sect-list-icon">{sect.emoji}</span>
                          <span className="sect-list-copy">
                            <strong>{sect.name}</strong>
                            <small>{chief.buffName || sect.desc}</small>
                          </span>
                          <em>{isMain ? '主修' : isSub ? '副修' : '查看'}</em>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <section className="sect-detail-panel">
                  <div className="sect-detail-head">
                    <div className="sect-detail-mark">{focusedSect?.emoji}</div>
                    <div>
                      <span>{focusedChief?.title || '江湖门派'}</span>
                      <h3>{focusedSect?.name}</h3>
                      <p>{focusedSect?.desc}</p>
                    </div>
                  </div>

                  <div className="sect-detail-grid">
                    <div className="sect-info-block is-wide">
                      <span>核心被动</span>
                      <strong>{focusedEffect}</strong>
                    </div>
                    <div className="sect-info-block">
                      <span>掌门/首席</span>
                      <strong>{focusedChief?.name || '未知'}</strong>
                    </div>
                    <div className="sect-info-block">
                      <span>首席增益</span>
                      <strong>{focusedChief?.buffName || '门派加成'}</strong>
                    </div>
                  </div>

                  <div className="sect-detail-two-col">
                    <div className="sect-mini-panel">
                      <div className="sect-panel-title"><span>入门判断</span></div>
                      <div className="sect-check-list">
                        <div className={badges.length >= SECT_JOIN_REQ_BADGES ? 'is-ok' : 'is-warn'}>
                          <span>徽章门槛</span><b>{badges.length}/{SECT_JOIN_REQ_BADGES}</b>
                        </div>
                        <div className={(ps.sectRank || 0) >= SECT_SUB_SECT_REQ_RANK ? 'is-ok' : 'is-warn'}>
                          <span>副修资格</span><b>{(ps.sectRank || 0) >= SECT_SUB_SECT_REQ_RANK ? '可用' : SECT_RANKS[4]?.name}</b>
                        </div>
                        <div className={(res.reputation || 0) >= SECT_SWITCH_REP_COST ? 'is-ok' : 'is-warn'}>
                          <span>改修声望</span><b>{res.reputation || 0}/{SECT_SWITCH_REP_COST}</b>
                        </div>
                      </div>
                    </div>

                    <div className="sect-mini-panel">
                      <div className="sect-panel-title"><span>武学预览</span></div>
                      <div className="sect-art-list">
                        {focusedArts.length ? focusedArts.map(art => (
                          <div key={art.id}>
                            <strong>{art.name}</strong>
                            <span>{art.type} · 威力{art.power || '--'}</span>
                          </div>
                        )) : <p>暂无可预览武学</p>}
                      </div>
                    </div>
                  </div>

                  <div className="sect-team-preview">
                    <div className="sect-panel-title">
                      <span>守关阵容</span>
                      <button type="button" onClick={() => openSectTeamDetail(focusedSectId)}>查看详情</button>
                    </div>
                    <div className="sect-team-row">
                      {focusedTeam.map(pet => (
                        <span key={pet.id} title={pet.name}>{pet.emoji || '✦'}<small>{pet.name}</small></span>
                      ))}
                    </div>
                  </div>

                  <div className="sect-action-row">
                    {!ps.playerSect && (
                      <button type="button" disabled={!canJoinFocused} onClick={() => joinPlayerSect(focusedSectId)} className="sect-primary-action">
                        {canJoinFocused ? '拜入此派' : `需要 ${SECT_JOIN_REQ_BADGES} 枚徽章`}
                      </button>
                    )}
                    {canSubFocused && <button type="button" onClick={() => setPlayerSubSectFn(focusedSectId)}>设为副修</button>}
                    {canSwitchFocused && <button type="button" onClick={() => switchPlayerSect(focusedSectId)}>改修此派</button>}
                    {ps.playerSect === focusedSectId && <span className="sect-current-badge">当前主修门派</span>}
                    {ps.playerSubSect === focusedSectId && <span className="sect-current-badge is-sub">当前副修门派</span>}
                  </div>
                </section>
              </div>
            </div>
          )}
          {sectHubTab === 'xinfa' && ps.playerSect && (
            <div>
              {[ps.playerSect, ps.playerSubSect].filter(Boolean).map(sid => {
                const xf = SECT_XINFA[sid];
                const curTier = ps.sectXinfaLevels?.[sid] || 1;
                const isSub = sid === ps.playerSubSect;
                return (
                  <div key={sid} style={{ background:'#1e1e1e', borderRadius:'10px', padding:'14px', marginBottom:'12px', border:'1px solid #333' }}>
                    <div style={{ fontWeight:'bold', color: SECT_DB[sid]?.color }}>{SECT_DB[sid]?.emoji} {xf?.name}{isSub ? ' (副修·最高中阶)' : ''}</div>
                    {xf?.tiers.map(t => (
                      <div key={t.tier} style={{ marginTop:'8px', padding:'8px', background: curTier >= t.tier ? 'rgba(76,175,80,0.15)' : '#252525', borderRadius:'6px', fontSize:'12px' }}>
                        <span style={{ fontWeight:'bold' }}>{t.name}</span> {curTier >= t.tier ? '✓' : ''} — {t.desc || '初阶心法（现有战斗被动）'}
                        {curTier === t.tier && t.tier < 3 && !isSub && (
                          <button onClick={() => upgradePlayerXinfa(sid)} style={{ marginLeft:'8px', padding:'4px 10px', background:'#FF9800', border:'none', borderRadius:'4px', color:'#fff', fontSize:'11px', cursor:'pointer' }}>
                            突破（{(SECT_XINFA[sid]?.tiers?.[t.tier]?.qiCost) || 0}真气）
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {sectHubTab === 'martial' && ps.playerSect && (
            <div>
              {getSectMartialArts(ps.playerSect).map(art => {
                const learned = (ps.sectMartialArts || []).includes(art.id);
                return (
                  <div key={art.id} style={{ background:'#1e1e1e', borderRadius:'8px', padding:'12px', marginBottom:'8px', border: learned ? '1px solid #4CAF50' : '1px solid #333' }}>
                    <div style={{ fontWeight:'bold' }}>{learned ? '✓ ' : ''}{art.name} <span style={{ fontSize:'10px', color:'#888' }}>[{art.type}] 威力{art.power}</span></div>
                    <div style={{ fontSize:'11px', color:'#aaa' }}>{art.desc}</div>
                    {!learned && (
                      <button onClick={() => learnSectMartialArt(art.id)} style={{ marginTop:'6px', padding:'6px 12px', background:'#673AB7', border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', cursor:'pointer' }}>
                        领悟（需{getSectRankInfo(art.needRank)?.name} · {art.scrollCost || 0}残页）
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {sectHubTab === 'daily' && ps.playerSect && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
                <span style={{ fontWeight:'bold' }}>今日门派任务</span>
                <button onClick={claimAllSectDaily} style={{ padding:'6px 12px', background:'#4CAF50', border:'none', borderRadius:'6px', color:'#fff', fontSize:'11px', cursor:'pointer' }}>查看进度</button>
              </div>
              {(ps.sectDailyTasks || []).map(t => (
                <div key={t.id} style={{ background:'#1e1e1e', borderRadius:'8px', padding:'10px', marginBottom:'8px', border: t.completed ? '1px solid #4CAF50' : '1px solid #333' }}>
                  <div style={{ fontWeight:'bold', fontSize:'13px' }}>{t.name} {t.completed ? '✅' : ''}</div>
                  <div style={{ fontSize:'11px', color:'#aaa' }}>{t.desc}</div>
                  <div style={{ fontSize:'11px', marginTop:'4px' }}>进度 {t.progress || 0}/{t.target} · 声望+{t.rep} 贡献+{t.contrib}</div>
                </div>
              ))}
            </div>
          )}
          {sectHubTab === 'shop' && ps.playerSect && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px' }}>
              {SECT_SHOP_ITEMS.map(item => (
                <div key={item.id} style={{ background:'#1e1e1e', borderRadius:'8px', padding:'12px', border:'1px solid #333' }}>
                  <div style={{ fontWeight:'bold' }}>{item.name}</div>
                  <div style={{ fontSize:'11px', color:'#aaa' }}>{item.desc || ''}</div>
                  <div style={{ fontSize:'11px', color:'#FFD700', marginTop:'4px' }}>{item.cost} {SECT_RESOURCE_LABELS[item.resource] || '贡献'}</div>
                  <button onClick={() => buyFromSectShop(item)} style={{ width:'100%', marginTop:'8px', padding:'6px', background:'#FF9800', border:'none', borderRadius:'6px', color:'#fff', cursor:'pointer', fontSize:'11px' }}>兑换</button>
                </div>
              ))}
            </div>
          )}
          {sectHubTab === 'realm' && (
            <div>
              {availRealms.length === 0 ? <div style={{ color:'#aaa', textAlign:'center', padding:'20px' }}>暂无可用秘境（需内门弟子身份+对应门派精灵）</div> : availRealms.map(realm => {
                const stepIdx = ps.sectRealmProgress?.[realm.id] || 0;
                const cleared = (fusionState.sectRealmsCleared || []).includes(realm.id);
                return (
                  <div key={realm.id} style={{ background:'#1e1e1e', borderRadius:'10px', padding:'12px', marginBottom:'10px', border: cleared ? '1px solid #4CAF50' : '1px solid #333' }}>
                    <div style={{ fontWeight:'bold' }}>{realm.icon} {realm.name} {cleared ? '✓已通关' : `步骤 ${stepIdx + 1}/${realm.steps?.length || 0}`}</div>
                    <div style={{ fontSize:'11px', color:'#aaa' }}>{realm.summary || realm.desc}</div>
                    {!cleared && <button onClick={() => startSectRealmFromHub(realm.id)} style={{ marginTop:'8px', padding:'8px 16px', background:'#9C27B0', border:'none', borderRadius:'6px', color:'#fff', cursor:'pointer' }}>进入秘境</button>}
                  </div>
                );
              })}
            </div>
          )}
          {sectHubTab === 'jianghu' && !jianghuEvt && (
            <div style={{ background:'#1e1e1e', borderRadius:'12px', padding:'24px', textAlign:'center', color:'#888' }}>
              <div style={{ fontSize:'32px', marginBottom:'8px' }}>🍃</div>
              <div style={{ fontSize:'14px' }}>江湖暂时风平浪静</div>
              <div style={{ fontSize:'11px', color:'#666', marginTop:'6px' }}>事件每周轮换，请稍后再来</div>
            </div>
          )}
          {sectHubTab === 'jianghu' && jianghuEvt && (
            <div style={{ background:'#1e1e1e', borderRadius:'12px', padding:'16px', border:'1px solid #444' }}>
              <div style={{ fontSize:'20px', fontWeight:'bold' }}>{jianghuEvt.icon} {jianghuEvt.name}</div>
              <div style={{ fontSize:'13px', color:'#ccc', margin:'10px 0' }}>{jianghuEvt.desc}</div>
              {jianghuEvt.choices.map(c => (
                <button key={c.id} disabled={Boolean(jianghuChoiceLog)} onClick={() => handleJianghuEventChoice(jianghuEvt.id, c.id)}
                  style={{ display:'block', width:'100%', marginBottom:'8px', padding:'10px', background:jianghuChoiceLog?.choiceId === c.id ? '#1b5e20' : '#333', border:`1px solid ${jianghuChoiceLog?.choiceId === c.id ? '#66bb6a' : '#555'}`, borderRadius:'8px', color:'#fff', textAlign:'left', cursor:jianghuChoiceLog?'default':'pointer', fontSize:'13px', opacity:jianghuChoiceLog && jianghuChoiceLog.choiceId !== c.id ? 0.45 : 1 }}>
                  {c.label}{jianghuChoiceLog?.choiceId === c.id ? ' · 本周已选择' : ''}
                </button>
              ))}
            </div>
          )}
          {sectHubTab === 'challenge' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'15px' }}>
            {Object.keys(SECT_DB).map(key => {
                const id = parseInt(key);
                const sect = SECT_DB[id];
                const chief = SECT_CHIEFS_CONFIG[id];
                const teamIds = SECT_TEAMS[id] || [];
                const isConquered = sectTitles.includes(id);
                const isActive = isConquered && currentTitle === chief.title;
                return (
                    <div key={id} style={{ background: isActive ? `linear-gradient(135deg, ${sect.color}66, #000)` : (isConquered ? '#2a2a2a' : '#1e1e1e'), border: isActive ? `2px solid ${sect.color}` : '1px solid #333', borderRadius: '12px', padding: '15px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{position:'absolute', right:'-10px', bottom:'-10px', fontSize:'80px', opacity:0.1, pointerEvents:'none'}}>{sect.emoji}</div>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                            <div style={{fontSize:'32px'}}>{sect.emoji}</div>
                            <div>
                                <div style={{fontWeight:'bold', fontSize:'18px', color: sect.color}}>{sect.name}</div>
                                <div style={{fontSize:'11px', color:'#aaa'}}>👑 {chief.title}：{chief.name}</div>
                            </div>
                        </div>
                        <div style={{fontSize:'12px', color:'#ccc', background:'rgba(0,0,0,0.3)', padding:'8px', borderRadius:'8px', marginBottom:'10px' }}>
                            <strong>{chief.buffName}</strong>: {chief.buffDesc}
                        </div>
                        <div onClick={() => openSectTeamDetail(id)} style={{ marginBottom:'10px', cursor:'pointer', fontSize:'10px', color: sect.color }}>🔍 查看守关阵容 ({teamIds.length}只)</div>
                        <div style={{marginTop:'auto', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                            <button onClick={() => startSectChallenge(id)} style={{ flex:1, minWidth:'100px', padding:'8px', borderRadius:'8px', border:'none', cursor:'pointer', background: isConquered ? '#333' : sect.color, color: isConquered ? '#aaa' : '#fff', fontWeight:'bold' }}>
                                {isConquered ? '守关切磋' : '守关挑战'}
                            </button>
                            {(ps.sectRank || 0) >= 4 && (
                              <button onClick={() => startChiefTrial(id)} style={{ flex:1, minWidth:'100px', padding:'8px', borderRadius:'8px', border:'none', cursor:'pointer', background:'#9C27B0', color:'#fff', fontWeight:'bold', fontSize:'11px' }}>
                                掌门试炼
                              </button>
                            )}
                            {isConquered && !isActive && (
                                <button onClick={() => { setCurrentTitle(chief.title); showMapToast('🏅', '称号已激活', `${chief.title} · ${sect.name}加成已生效`, 2500); }}
                                    style={{ flex:1, padding:'8px', borderRadius:'8px', border:'none', cursor:'pointer', background: '#2196F3', color: '#fff', fontWeight: 'bold' }}>
                                    佩戴称号
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
            </div>
          )}
        </div>
      </div>
    );
  
}
