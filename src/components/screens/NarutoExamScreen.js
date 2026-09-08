import React from 'react';
import { BIJUU_LIST } from '../../data/naruto';
import { calcChakraAffinity } from '../../data/naruto';
import { CHAKRA_NATURE_MAP } from '../../data/naruto';
import { CHUNIN_EXAM_PHASES } from '../../data/naruto';
import { EXAM_FINALS_BRACKETS } from '../../data/naruto';
import { getNinjaRank } from '../../data/naruto';
import { JUTSU_DB } from '../../data/naruto';
import { NARUTO_CHALLENGES } from '../../data/naruto';
import { NARUTO_STORY_CHAPTERS } from '../../data/naruto';
import { NINJA_RANKS } from '../../data/naruto';

export default function NarutoExamScreen({
  advanceForest,
  badges,
  bindBijuuToLead,
  clearNarutoExamRun,
  getExamDifficulty,
  getLocalDateStr,
  narutoExamUI,
  narutoState,
  party,
  safeBack,
  setView,
  startChuninExam,
  startFinalsRound,
  startSurvivalWave
}) {
    const rank = getNinjaRank(narutoState.examsCompleted || 0);
    const nextRank = NINJA_RANKS.find(r => r.minExams > (narutoState.examsCompleted || 0));
    const today = getLocalDateStr();
    const canExam = narutoState.lastExamDate !== today;

    const actHeaderStyle = {padding:'16px 20px',background:'rgba(0,0,0,0.3)',borderBottom:'1px solid rgba(255,255,255,0.06)'};
    const actBtnSecondary = {padding:'8px 16px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#aaa',fontSize:'12px',fontWeight:'600',cursor:'pointer'};

    if (narutoExamUI) {
      // 生存试炼阶段
      if (narutoExamUI.phase === 'survival') {
        const wave = narutoExamUI.survivalWave || 0;
        const totalWaves = narutoExamUI.survivalWaves || 2;
        return (
          <div className="screen" style={{background:'linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)',color:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{...actHeaderStyle,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <button onClick={()=>{clearNarutoExamRun();setView(safeBack());}} style={{...actBtnSecondary}}>⬅ 放弃</button>
              <div style={{fontSize:'16px',fontWeight:'800',letterSpacing:'2px'}}>⚔️ 生存试炼 · {wave}/{totalWaves}</div>
              <div style={{fontSize:'13px',color:'#FFB74D'}}>HP不会恢复</div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',gap:'20px'}}>
              <div style={{fontSize:'48px',opacity:0.8}}>⚔️</div>
              <div style={{fontSize:'20px',fontWeight:'800',color:'#FFB74D'}}>忍者生存试炼</div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',textAlign:'center',maxWidth:'340px',lineHeight:1.6}}>
                连续击败 {totalWaves} 波敌人证明你的实力。<br/>每波之间不会恢复HP，必须以残存战力迎战下一波！
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'8px'}}>
                {Array.from({length: totalWaves}).map((_, i) => (
                  <div key={i} style={{width:'40px',height:'40px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'800',
                    background: i < wave ? 'rgba(76,175,80,0.2)' : i === wave ? 'rgba(255,111,0,0.2)' : 'rgba(255,255,255,0.05)',
                    border: i < wave ? '2px solid #4CAF50' : i === wave ? '2px solid #FF6F00' : '1px solid rgba(255,255,255,0.1)',
                    color: i < wave ? '#4CAF50' : i === wave ? '#FF6F00' : 'rgba(255,255,255,0.3)'}}>
                    {i < wave ? '✓' : i + 1}
                  </div>
                ))}
              </div>
              <button onClick={startSurvivalWave} style={{marginTop:'12px',padding:'14px 40px',borderRadius:'14px',border:'none',
                background:'linear-gradient(135deg,#E65100,#FF6F00)',color:'#fff',fontSize:'16px',fontWeight:'800',cursor:'pointer',
                boxShadow:'0 6px 20px rgba(255,111,0,0.3)',letterSpacing:'2px'}}>
                {wave === 0 ? '开始第1波' : `迎战第${wave + 1}波`}
              </button>
              <div style={{display:'flex',justifyContent:'center',gap:'6px',marginTop:'12px'}}>
                {[{id:'survival',icon:'⚔️',name:'生存试炼'},{id:'forest',icon:'🌲',name:'死亡之森'},{id:'finals',icon:'🏆',name:'淘汰赛'}].map((ph) => (
                  <div key={ph.id} style={{padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',
                    background: narutoExamUI.phase === ph.id ? 'linear-gradient(135deg,#FF6F00,#FF8F00)' : 'rgba(255,255,255,0.05)',
                    color: narutoExamUI.phase === ph.id ? '#fff' : 'rgba(255,255,255,0.3)'}}>
                    {ph.icon} {ph.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      // 死亡之森
      if (narutoExamUI.phase === 'forest') {
        return (
          <div className="screen" style={{background:'linear-gradient(135deg,#001a00,#0a2d0a,#001a00)',color:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{...actHeaderStyle,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <button onClick={()=>{clearNarutoExamRun();setView(safeBack());}} style={{...actBtnSecondary}}>⬅ 放弃</button>
              <div style={{fontSize:'16px',fontWeight:'800',letterSpacing:'2px'}}>🌲 死亡之森</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>进度: {narutoExamUI.forestProgress} 步</div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'24px',gap:'20px'}}>
              <div style={{display:'flex',gap:'24px',marginBottom:'12px'}}>
                <div style={{padding:'12px 24px',borderRadius:'16px',background:narutoExamUI.scrolls.heaven ? 'rgba(100,181,246,0.2)' : 'rgba(255,255,255,0.03)',border:`1px solid ${narutoExamUI.scrolls.heaven ? 'rgba(100,181,246,0.4)' : 'rgba(255,255,255,0.08)'}`,textAlign:'center'}}>
                  <div style={{fontSize:'28px'}}>📜</div>
                  <div style={{fontSize:'12px',color:narutoExamUI.scrolls.heaven ? '#64B5F6' : 'rgba(255,255,255,0.3)',fontWeight:'700',marginTop:'4px'}}>天之卷 {narutoExamUI.scrolls.heaven ? '✅' : '❌'}</div>
                </div>
                <div style={{padding:'12px 24px',borderRadius:'16px',background:narutoExamUI.scrolls.earth ? 'rgba(129,199,132,0.2)' : 'rgba(255,255,255,0.03)',border:`1px solid ${narutoExamUI.scrolls.earth ? 'rgba(129,199,132,0.4)' : 'rgba(255,255,255,0.08)'}`,textAlign:'center'}}>
                  <div style={{fontSize:'28px'}}>📜</div>
                  <div style={{fontSize:'12px',color:narutoExamUI.scrolls.earth ? '#81C784' : 'rgba(255,255,255,0.3)',fontWeight:'700',marginTop:'4px'}}>地之卷 {narutoExamUI.scrolls.earth ? '✅' : '❌'}</div>
                </div>
              </div>
              <button type="button" onClick={advanceForest}
                style={{padding:'16px 48px',borderRadius:'16px',border:'none',background:'linear-gradient(135deg,#2E7D32,#43A047)',color:'#fff',fontSize:'16px',fontWeight:'800',cursor:'pointer',boxShadow:'0 4px 15px rgba(46,125,50,0.3)'}}>
                🌲 继续探索
              </button>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'8px'}}>收集天之卷和地之卷即可通过</div>
              <div style={{display:'flex',justifyContent:'center',gap:'6px',marginTop:'8px'}}>
                {CHUNIN_EXAM_PHASES.map((ph) => (
                  <div key={ph.id} style={{padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',
                    background: narutoExamUI.phase === ph.id ? 'linear-gradient(135deg,#2E7D32,#43A047)' : 'rgba(255,255,255,0.05)',
                    color: narutoExamUI.phase === ph.id ? '#fff' : 'rgba(255,255,255,0.3)'}}>
                    {ph.icon} {ph.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      // 正式对战
      if (narutoExamUI.phase === 'finals') {
        const round = narutoExamUI.finalsRound || 0;
        const allDone = round >= EXAM_FINALS_BRACKETS.length;
        return (
          <div className="screen" style={{background:'linear-gradient(135deg,#1a0000,#2d0a0a,#1a0000)',color:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{...actHeaderStyle,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <button onClick={()=>{clearNarutoExamRun();setView(safeBack());}} style={{...actBtnSecondary}}>⬅ 放弃</button>
              <div style={{fontSize:'16px',fontWeight:'800',letterSpacing:'2px'}}>⚔️ 正式对战</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>轮次 {round}/{EXAM_FINALS_BRACKETS.length}</div>
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'24px',gap:'16px'}}>
              {!allDone && round < EXAM_FINALS_BRACKETS.length && (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'24px',marginBottom:'8px'}}>⚔️</div>
                  <div style={{fontSize:'18px',fontWeight:'800',marginBottom:'4px'}}>{EXAM_FINALS_BRACKETS[round].name}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',marginBottom:'20px'}}>对手等级: 你的等级 +{EXAM_FINALS_BRACKETS[round].enemyLvlRange[0]}~{EXAM_FINALS_BRACKETS[round].enemyLvlRange[1]}</div>
                  <button type="button" onClick={startFinalsRound}
                    style={{padding:'14px 36px',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#E53935,#FF5252)',color:'#fff',fontSize:'15px',fontWeight:'800',cursor:'pointer',boxShadow:'0 4px 15px rgba(229,57,53,0.3)'}}>
                    开始对战
                  </button>
                </div>
              )}
              {allDone && (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'40px',marginBottom:'8px'}}>🏆</div>
                  <div style={{fontSize:'18px',fontWeight:'800'}}>试炼通过！</div>
                </div>
              )}
              <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                {EXAM_FINALS_BRACKETS.map((b, i) => (
                  <div key={i} style={{padding:'6px 12px',borderRadius:'10px',fontSize:'11px',fontWeight:'700',
                    background: i < round ? 'rgba(76,175,80,0.2)' : i === round ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${i < round ? 'rgba(76,175,80,0.4)' : i === round ? 'rgba(255,82,82,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: i < round ? '#81C784' : i === round ? '#FF8A80' : 'rgba(255,255,255,0.3)'}}>
                    {i < round ? '✅' : ''} {b.name}
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'center',gap:'6px',marginTop:'12px'}}>
                {CHUNIN_EXAM_PHASES.map((ph) => (
                  <div key={ph.id} style={{padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',
                    background: narutoExamUI.phase === ph.id ? 'linear-gradient(135deg,#E53935,#FF5252)' : 'rgba(255,255,255,0.05)',
                    color: narutoExamUI.phase === ph.id ? '#fff' : 'rgba(255,255,255,0.3)'}}>
                    {ph.icon} {ph.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    }

    const narutoLocked = badges.length < 3;
    const examBlockReason = narutoLocked ? '需要3枚徽章' : !canExam ? '今日已参加 · 明日再来' : party.filter(pet => pet.currentHp > 0).length < 3 ? '需要3只存活伙伴' : '';

    return (
      <div className="screen activity-screen activity-legacy ninja-overview" style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{...actHeaderStyle,display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <button onClick={()=>setView(safeBack())} style={{...actBtnSecondary}}>⬅ 返回</button>
          <div style={{fontSize:'16px',letterSpacing:'2px',fontWeight:'800'}}>🍥 忍者系统</div>
          <div style={{width:'60px'}}></div>
        </div>
        {narutoLocked && (
          <div style={{padding:'10px 20px',background:'linear-gradient(90deg,rgba(255,111,0,0.15),rgba(255,143,0,0.08))',borderBottom:'1px solid rgba(255,111,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',flexShrink:0}}>
            <span style={{fontSize:'14px'}}>🔒</span>
            <span style={{fontSize:'13px',color:'#FFB74D',fontWeight:'700'}}>需要获得 <span style={{color:'#FF6F00'}}>3 枚徽章</span> 才能使用忍者系统（当前 {badges.length}/3）</span>
          </div>
        )}
        <div className="ninja-overview-body" style={{flex:1,overflow:'auto',padding:'20px'}}>
          {/* 段位信息 */}
          <div className="ninja-rank">
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
              <div style={{fontSize:'36px'}}>{rank.icon}</div>
              <div>
                <div style={{fontSize:'20px',fontWeight:'900',color:'#FFB74D'}}>{rank.name}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>累计通过 {narutoState.examsCompleted || 0} 次试炼</div>
              </div>
            </div>
            {rank.perk && <div style={{fontSize:'12px',color:'#FFCC80',padding:'8px 12px',borderRadius:'8px',background:'rgba(255,111,0,0.08)'}}>{rank.perk}</div>}
            <div style={{fontSize:'11px',color:'rgba(255,200,128,0.7)',marginTop:'6px',padding:'4px 8px',borderRadius:'6px',background:'rgba(255,111,0,0.06)'}}>
              当前试炼难度: 生存{(() => { const d = getExamDifficulty(rank); return d.waves; })()}波 · 敌人等级+{(() => { const d = getExamDifficulty(rank); return d.lvMod; })()}
            </div>
            {nextRank && (
              <div style={{marginTop:'10px'}}>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginBottom:'4px'}}>下一段位: {nextRank.icon} {nextRank.name} (需 {nextRank.minExams} 次试炼)</div>
                <div style={{height:'6px',borderRadius:'3px',background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'3px',background:'linear-gradient(90deg,#FF6F00,#FF8F00)',width:`${Math.min(100, ((narutoState.examsCompleted || 0) / (nextRank.minExams || 1)) * 100)}%`,transition:'width 0.3s'}}></div>
                </div>
              </div>
            )}
          </div>

          <button type="button" className="ninja-start-action activity-primary" onClick={startChuninExam} disabled={!!examBlockReason}>
            {examBlockReason || '开始忍者试炼'}
          </button>
          <button type="button" className="ninja-codex-action" onClick={() => setView('jutsu_codex')}
            style={{padding:'14px',borderRadius:'6px',fontSize:'14px',fontWeight:'700',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
            📖 忍术图鉴 <span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>({JUTSU_DB.length}种忍术)</span>
          </button>

          {/* 尾兽收集 */}
          <div className="ninja-bijuu">
            <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'10px',color:'#FF8A80'}}>🦊 尾兽图鉴 ({(narutoState.bijuuCollected || []).length}/9)</div>
            <div className="ninja-bijuu-grid">
              {BIJUU_LIST.map(b => {
                const has = (narutoState.bijuuCollected || []).includes(b.id);
                const natureInfo = b.nature ? CHAKRA_NATURE_MAP[b.nature] : null;
                return (
                  <div key={b.id} className="ninja-bijuu-item" style={{padding:'10px 12px',borderRadius:'8px',
                    background: has ? 'rgba(255,138,128,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${has ? 'rgba(255,138,128,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    display:'flex',alignItems:'center',gap:'10px'}}>
                    <span style={{fontSize:'22px',opacity:has?1:0.3}}>{b.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',fontWeight:'700',color:has?'#FF8A80':'rgba(255,255,255,0.2)',marginBottom:'2px'}}>{has ? b.name : '??? (' + b.tails + '尾)'}</div>
                      {has && <div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)',display:'flex',gap:'8px',flexWrap:'wrap'}}>
                        {natureInfo && <span>{natureInfo.icon}{natureInfo.name}</span>}
                        <span>攻×{b.transform.atk}</span>
                        <span>防×{b.transform.def}</span>
                        <span>速×{b.transform.spd}</span>
                        <span>{b.duration}回合</span>
                        <span style={{color:'#FFB74D'}}>{b.specialMove.name} (威力{b.specialMove.p})</span>
                      </div>}
                    </div>
                    {has && party[0] && (
                      <button type="button" onClick={() => bindBijuuToLead(b)} disabled={narutoLocked || party[0]?.bijuu?.id === b.id}
                        style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,138,128,0.3)',background:party[0]?.bijuu?.id === b.id?'rgba(76,175,80,0.15)':'rgba(255,138,128,0.1)',color:party[0]?.bijuu?.id === b.id?'#81C784':'#FFAB91',fontSize:'10px',cursor:party[0]?.bijuu?.id === b.id?'default':'pointer',whiteSpace:'nowrap'}}>
                        {party[0]?.bijuu?.id === b.id ? '已与首发结契' : '与首发结契'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 查克拉亲和 & 试炼统计 */}
          <div className="ninja-stats" style={{display:'flex',gap:'10px'}}>
            <div style={{flex:1,padding:'14px',borderRadius:'14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'}}>查克拉亲和</div>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#FFB74D'}}>{(() => { const aff = calcChakraAffinity(narutoState.jutsuMastery); return aff ? `${CHAKRA_NATURE_MAP[aff]?.icon} ${CHAKRA_NATURE_MAP[aff]?.name}` : '尚未确定'; })()}</div>
            </div>
            <div style={{flex:1,padding:'14px',borderRadius:'14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'}}>试炼最高分</div>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#FFB74D'}}>{narutoState.examHighScore || 0}/5</div>
            </div>
            <div style={{flex:1,padding:'14px',borderRadius:'14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'}}>忍术精通</div>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#FFB74D'}}>{Object.keys(narutoState.jutsuMastery || {}).length}种</div>
            </div>
          </div>

          {/* 三阶段说明 */}
          <div className="ninja-phases" style={{display:'flex',gap:'10px'}}>
            {CHUNIN_EXAM_PHASES.map(ph => (
              <div key={ph.id} style={{flex:1,padding:'12px',borderRadius:'12px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',textAlign:'center'}}>
                <div style={{fontSize:'22px',marginBottom:'6px'}}>{ph.icon}</div>
                <div style={{fontSize:'12px',fontWeight:'700',marginBottom:'4px'}}>{ph.name}</div>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>{ph.id === 'survival' ? `连续${getExamDifficulty(rank).waves}波战斗，波间不恢复HP` : ph.desc}</div>
              </div>
            ))}
          </div>

          {/* 忍术挑战 */}
          <div className="ninja-challenges">
            <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'12px'}}>⚔️ 火影挑战试炼</div>
            <button type="button" disabled={narutoLocked} onClick={() => setView('naruto_story')} style={{padding:'12px 14px',borderRadius:'8px',fontSize:'13px',fontWeight:'700',width:'100%',marginBottom:'12px'}}>📜 火影主线剧情 ({NARUTO_STORY_CHAPTERS.filter(ch => (narutoState?.storyProgress || {})[ch.id]?.cleared).length}/{NARUTO_STORY_CHAPTERS.length}章)</button>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {NARUTO_CHALLENGES.map(ch => {
                const unlocked = badges.length >= ch.badgeReq;
                const completed = (narutoState.completedChallenges || []).includes(ch.id) || (narutoState.examsCompleted || 0) >= ch.req;
                return (
                  <div key={ch.id} style={{display:'flex',alignItems:'center',padding:'10px 14px',borderRadius:'10px',
                    background: completed ? 'rgba(76,175,80,0.08)' : unlocked ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${completed ? 'rgba(76,175,80,0.2)' : unlocked ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)'}`,
                    opacity: unlocked ? 1 : 0.4}}>
                    <div style={{fontSize:'11px',fontWeight:'700',color: completed ? '#81C784' : '#fff',flex:1}}>{ch.name}</div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>
                      {completed ? '✅' : unlocked ? `需${ch.badgeReq}徽章` : `🔒 ${ch.badgeReq}徽章`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  
}
