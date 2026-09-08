import React from 'react';
import { MAPS } from '../../data';
import { NARUTO_STORY_CHAPTERS } from '../../data/naruto';

export default function NarutoStoryScreen({
  badges,
  narutoState,
  party,
  setStoryViewChapter,
  setView,
  showMapToast,
  startStoryBattle,
  storyViewChapter
}) {
    const sp = narutoState?.storyProgress || {};
    const totalCleared = NARUTO_STORY_CHAPTERS.filter(ch => sp[ch.id]?.cleared).length;
    const selectedChapter = storyViewChapter ? NARUTO_STORY_CHAPTERS.find(c => c.id === storyViewChapter) : null;

    if (selectedChapter) {
      const cp = sp[selectedChapter.id] || { stages: [] };
      const isCleared = cp.cleared;
      return (
        <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#1a0a00 0%,#2d1810 40%,#0d0d2b 100%)',zIndex:900,overflow:'auto',color:'#fff'}}>
          <div style={{maxWidth:700,margin:'0 auto',padding:'20px 16px 80px'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <button onClick={() => setStoryViewChapter(null)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:'8px 14px',color:'#fff',cursor:'pointer',fontSize:14}}>← 返回</button>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:'rgba(255,160,60,0.7)',letterSpacing:2}}>{selectedChapter.arc}</div>
                <div style={{fontSize:20,fontWeight:800,background:'linear-gradient(90deg,#FF6F00,#FFD54F)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>第{selectedChapter.id}章 · {selectedChapter.title}</div>
              </div>
              {isCleared && <div style={{background:'linear-gradient(135deg,#FFD700,#FF8F00)',padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700}}>✅ 通关</div>}
            </div>
            {(() => { const sm = selectedChapter.mapId ? MAPS.find(m => m.id === selectedChapter.mapId) : null; return sm ? (
              <div style={{background:'rgba(255,140,0,0.04)',border:'1px solid rgba(255,140,0,0.12)',borderRadius:12,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:22}}>{sm.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#FFD54F'}}>{sm.name}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',marginTop:2}}>{sm.desc}</div>
                </div>
                <div style={{fontSize:11,color:'rgba(255,200,60,0.6)',whiteSpace:'nowrap'}}>Lv.{sm.lvl[0]}~{sm.lvl[1]}</div>
              </div>
            ) : null; })()}
            <div style={{background:'rgba(255,140,0,0.06)',border:'1px solid rgba(255,140,0,0.15)',borderRadius:14,padding:16,marginBottom:20,fontSize:13,lineHeight:1.8,color:'rgba(255,255,255,0.85)'}}>
              {selectedChapter.intro}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
              {selectedChapter.stages.map((stage, idx) => {
                const done = (cp.stages || []).includes(idx);
                const prevDone = idx === 0 || (cp.stages || []).includes(idx - 1);
                const canPlay = prevDone && !done && badges.length >= selectedChapter.badgeReq;
                const maxLv = party.length > 0 ? Math.max(...party.map(p => p.level || 1)) : 1;
                const lvOk = maxLv >= selectedChapter.minLevel;
                return (
                  <div key={idx} style={{background: done ? 'rgba(76,175,80,0.08)' : canPlay ? 'rgba(255,140,0,0.08)' : 'rgba(255,255,255,0.03)',border:`1px solid ${done ? 'rgba(76,175,80,0.25)' : canPlay ? 'rgba(255,140,0,0.25)' : 'rgba(255,255,255,0.08)'}`,borderRadius:12,padding:14,opacity: !prevDone && !done ? 0.4 : 1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{fontSize:14,fontWeight:700,color: done ? '#81C784' : '#fff'}}>
                        {done ? '✅ ' : `⚔️ `}{stage.name}
                        {stage.isDouble && <span style={{fontSize:10,background:'rgba(255,152,0,0.2)',padding:'2px 6px',borderRadius:4,marginLeft:6}}>双打</span>}
                      </div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>Lv.{stage.bossLevel} × {stage.bossCount}</div>
                    </div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:8}}>{stage.desc}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:11,color:'rgba(255,200,60,0.7)'}}>
                        💰{stage.reward.gold}{stage.reward.title ? ` · 🏅${stage.reward.title}` : ''}{stage.reward.jutsu ? ` · 📜忍术` : ''}
                      </div>
                      {canPlay && lvOk && <button onClick={() => startStoryBattle(selectedChapter, idx)} style={{background:'linear-gradient(135deg,#FF6F00,#E65100)',border:'none',borderRadius:8,padding:'6px 16px',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer'}}>⚔️ 挑战</button>}
                      {canPlay && !lvOk && <div style={{fontSize:11,color:'#FF5252'}}>需 Lv.{selectedChapter.minLevel}+</div>}
                      {!canPlay && !done && <div style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>🔒 未解锁</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            {isCleared && selectedChapter.epilogue && (
              <div style={{background:'linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,140,0,0.03))',border:'1px solid rgba(255,215,0,0.2)',borderRadius:14,padding:16}}>
                <div style={{fontSize:12,fontWeight:700,color:'#FFD54F',marginBottom:8}}>📖 章节结语</div>
                <div style={{fontSize:13,lineHeight:1.9,color:'rgba(255,255,255,0.85)',whiteSpace:'pre-line'}}>{selectedChapter.epilogue}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{position:'fixed',inset:0,background:'linear-gradient(135deg,#1a0a00 0%,#2d1810 40%,#0d0d2b 100%)',zIndex:900,overflow:'auto',color:'#fff'}}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'20px 16px 80px'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <button onClick={() => setView('grid_map')} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:'8px 14px',color:'#fff',cursor:'pointer',fontSize:14}}>← 返回</button>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:900,background:'linear-gradient(90deg,#FF6F00,#FFD54F,#FF8F00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>📜 火影忍者 · 主线剧情</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>已通关 {totalCleared}/{NARUTO_STORY_CHAPTERS.length} 章</div>
            </div>
          </div>
          <div style={{background:'rgba(255,140,0,0.06)',borderRadius:12,padding:12,marginBottom:16,border:'1px solid rgba(255,140,0,0.12)'}}>
            <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${(totalCleared / NARUTO_STORY_CHAPTERS.length) * 100}%`,background:'linear-gradient(90deg,#FF6F00,#FFD54F)',borderRadius:3,transition:'width 0.5s'}} />
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:6,textAlign:'center'}}>
              {totalCleared === NARUTO_STORY_CHAPTERS.length ? '🎉 全章通关！你是真正的火影！' : `当前进度 ${Math.round((totalCleared / NARUTO_STORY_CHAPTERS.length) * 100)}%`}
            </div>
          </div>
          {(() => {
            const arcs = [];
            let currentArc = null;
            NARUTO_STORY_CHAPTERS.forEach(ch => {
              if (!currentArc || currentArc.name !== ch.arc) { currentArc = { name: ch.arc, chapters: [] }; arcs.push(currentArc); }
              currentArc.chapters.push(ch);
            });
            return arcs.map((arc, ai) => (
              <div key={ai} style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:700,color:'rgba(255,160,60,0.8)',marginBottom:10,paddingLeft:4,borderLeft:'3px solid #FF6F00',lineHeight:'20px',paddingTop:0}}>{arc.name}</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {arc.chapters.map(ch => {
                    const cleared = sp[ch.id]?.cleared;
                    const stagesCleared = (sp[ch.id]?.stages || []).length;
                    const unlocked = badges.length >= ch.badgeReq;
                    const canStart = unlocked && !cleared;
                    return (
                      <div key={ch.id} onClick={() => unlocked ? setStoryViewChapter(ch.id) : showMapToast('🔒','未解锁',`需要 ${ch.badgeReq} 枚徽章`,1500)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:12,cursor:unlocked ? 'pointer' : 'default',background: cleared ? 'rgba(76,175,80,0.06)' : canStart ? 'rgba(255,140,0,0.06)' : 'rgba(255,255,255,0.02)',border:`1px solid ${cleared ? 'rgba(76,175,80,0.2)' : canStart ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.06)'}`,opacity: unlocked ? 1 : 0.4,transition:'all 0.2s'}}>
                        <div style={{width:36,height:36,borderRadius:10,background: cleared ? 'linear-gradient(135deg,#4CAF50,#2E7D32)' : canStart ? 'linear-gradient(135deg,#FF6F00,#E65100)' : 'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff',flexShrink:0}}>{cleared ? '✓' : ch.id}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:700,color: cleared ? '#81C784' : '#fff'}}>{ch.title}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:2}}>
                            {(() => { const sm = ch.mapId ? MAPS.find(m => m.id === ch.mapId) : null; return sm ? `${sm.icon} ${sm.name} · ` : ''; })()}
                            {ch.stages.length}关 · Lv.{ch.minLevel}+ · {ch.badgeReq}徽章
                            {stagesCleared > 0 && !cleared && ` · 进度 ${stagesCleared}/${ch.stages.length}`}
                          </div>
                        </div>
                        <div style={{fontSize:18}}>{cleared ? '📖' : unlocked ? '⚔️' : '🔒'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    );
  
}
