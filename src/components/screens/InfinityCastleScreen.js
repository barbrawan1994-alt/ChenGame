import React from 'react';
import { BREATHING_BUFFS } from '../../data/constants';
import { getInfinityFloorModifier } from '../../data';
import { getInfinityTeamReadiness } from '../../data';
import { INFINITY_MILESTONE_FLOORS } from '../../data';
import { pickRouteOptions } from '../../data';
import { resolveInfinityRunEntries } from '../../data';
import { SPIRIT_BLESSINGS } from '../../data';

export default function InfinityCastleScreen({
  achStats,
  enterInfinityCastle,
  infinityActionLocksRef,
  infinityBattleStartLockRef,
  infinityState,
  infinityStateRef,
  party,
  selectInfinityBuff,
  selectInfinityRoute,
  setConfirmModal,
  setInfinityState,
  setView,
  showMapToast
}) {
    if (!infinityState) {
      const bestFloor = achStats.maxInfinityFloor || 0;
      const shallowReady = getInfinityTeamReadiness(party, 40);
      const normalReady = getInfinityTeamReadiness(party, 80);
      const canShallow = shallowReady.eligible;
      const canNormal = normalReady.eligible;
      return (
        <div className="screen" style={{ background:'linear-gradient(180deg, #1a0b2e 0%, #000 100%)', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{width:'100%', padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.05)'}}>
            <div style={{fontSize:'20px', fontWeight:'bold', color:'#E040FB'}}>🏯 无限城</div>
            <button onClick={() => setView('grid_map')} style={{background:'transparent', border:'1px solid #666', color:'#aaa', padding:'5px 15px', borderRadius:'20px', fontSize:'12px'}}>返回</button>
          </div>
          <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'20px', textAlign:'center', maxWidth:'500px'}}>
            <div style={{fontSize:'64px', marginBottom:'16px'}}>🏯</div>
            <div style={{fontSize:'18px', fontWeight:'bold', color:'#E1BEE7', marginBottom:'8px'}}>欢迎来到无限城</div>
            <div style={{fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:'24px'}}>
              无限城是一座永无尽头的试炼之塔。每层随机遭遇敌人，战斗胜利后可选择路线和呼吸法加成。
              每10层出现强力Boss。层数越高敌人越强，挑战你的极限！
            </div>
            <div style={{fontSize:'12px', color:'#FFD700', marginBottom:'24px'}}>🏆 历史最高纪录：第 {bestFloor} 层</div>
            <div style={{display:'flex', flexDirection:'column', gap:'12px', width:'100%', maxWidth:'300px'}}>
              <button onClick={() => { if (!party?.length) { showMapToast('❌','队伍为空','先组建队伍',1500); return; } enterInfinityCastle('shallow'); }} disabled={!canShallow} style={{
                padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'bold', cursor: canShallow ? 'pointer' : 'not-allowed',
                background: canShallow ? 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)' : 'rgba(255,255,255,0.08)',
                color: canShallow ? '#fff' : '#FFFFFF', border: canShallow ? '1px solid #9C27B0' : '1px solid rgba(191,210,209,0.55)',
              }}>🌙 浅层探索（三只主力平均 Lv.40+）{!canShallow ? ` — 当前 ${Math.floor(shallowReady.averageLevel)}` : ''}</button>
              <button onClick={() => { if (!party?.length) { showMapToast('❌','队伍为空','先组建队伍',1500); return; } enterInfinityCastle('normal'); }} disabled={!canNormal} style={{
                padding:'14px', borderRadius:'12px', fontSize:'14px', fontWeight:'bold', cursor: canNormal ? 'pointer' : 'not-allowed',
                background: canNormal ? 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)' : 'rgba(255,255,255,0.08)',
                color: canNormal ? '#fff' : '#FFFFFF', border: canNormal ? '1px solid #EF5350' : '1px solid rgba(191,210,209,0.55)',
              }}>🔥 深层挑战（三只主力平均 Lv.80+）{!canNormal ? ` — 当前 ${Math.floor(normalReady.averageLevel)}` : ''}</button>
            </div>
            <div style={{marginTop:'24px', fontSize:'11px', color:'rgba(255,255,255,0.35)', lineHeight:1.6}}>
              · 浅层模式敌人较弱，适合练习<br/>
              · 深层模式奖励更丰厚，每5层可选呼吸法加成<br/>
              · 每10层出现Boss，击败后获得大量奖励<br/>
              · 里程碑层（5/15/25/35…95层）有额外补给箱
            </div>
          </div>
        </div>
      );
    }
    const { floor, status, floorModifier, mode } = infinityState;
    const buffs = [
      ...resolveInfinityRunEntries(infinityState.buffs, BREATHING_BUFFS),
      ...resolveInfinityRunEntries(infinityState.blessings, SPIRIT_BLESSINGS),
    ];
    const buffOptions = resolveInfinityRunEntries(
      infinityState.buffOptions || [],
      [...BREATHING_BUFFS, ...SPIRIT_BLESSINGS]
    );
    const mod = floorModifier || getInfinityFloorModifier(floor);
    const bestFloor = Math.max(infinityState.bestFloor || 0, achStats.maxInfinityFloor || 0);
    const nextMilestone = INFINITY_MILESTONE_FLOORS.find(f => f > floor) || (floor < 100 ? (floor % 10 === 0 ? floor + 5 : Math.ceil(floor / 10) * 10) : null);

    return (
      <div className="screen" style={{
          background: 'linear-gradient(180deg, #1a0b2e 0%, #000 100%)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* 顶部信息 */}
        <div style={{width:'100%', padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', background:'rgba(255,255,255,0.05)'}}>
            <div>
              <div style={{fontSize:'20px', fontWeight:'bold', color:'#E040FB'}}>🏯 无限城 - 第 {floor} 层</div>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.45)', marginTop:'4px'}}>最佳纪录 {bestFloor} 层 · {mode === 'shallow' ? '浅层' : '深层'}模式</div>
            </div>
            <button onClick={() => {
                setConfirmModal({ title:'🏯 退出确认', msg:'确定要退出吗？进度将丢失，增益也会重置。', onOk: () => {
                    infinityStateRef.current = null;
                    infinityActionLocksRef.current.clear();
                    infinityBattleStartLockRef.current = false;
                    setInfinityState(null); setView('grid_map');
                }})
            }} style={{background:'transparent', border:'1px solid #666', color:'#aaa', padding:'5px 15px', borderRadius:'20px', fontSize:'12px'}}>放弃</button>
        </div>

        {/* 层数词缀 */}
        <div style={{width:'100%', padding:'8px 16px', display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center', background:'rgba(123,31,162,0.15)', borderBottom:'1px solid rgba(123,31,162,0.25)'}}>
          <span style={{fontSize:'11px', color:'rgba(255,255,255,0.5)'}}>本层词缀</span>
          <span style={{fontSize:'12px', fontWeight:'700', color:'#E1BEE7'}}>{mod.icon} {mod.name}</span>
          <span style={{fontSize:'10px', color:'rgba(255,255,255,0.45)'}}>{mod.desc}</span>
          {nextMilestone && <span style={{marginLeft:'auto', fontSize:'10px', color:'#FFD700'}}>下个宝箱: 第{nextMilestone}层</span>}
        </div>

        {/* 已获 Buff 展示栏 */}
        <div style={{width:'100%', padding:'10px', display:'flex', gap:'8px', overflowX:'auto', background:'rgba(0,0,0,0.3)'}}>
            {buffs.length === 0 && <span style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', paddingLeft:'10px'}}>暂无呼吸法加成</span>}
            {buffs.map((b, i) => (
                <span key={i} style={{
                    fontSize:'10px', background:'#4A148C', color:'#E1BEE7', 
                    padding:'4px 8px', borderRadius:'4px', whiteSpace:'nowrap',
                    border:'1px solid #7B1FA2'
                }}>{b.name}</span>
            ))}
        </div>

        {/* 主体内容 */}
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
            
            {/* 1. 选门阶段 */}
            {status === 'selecting' && (
                <div style={{textAlign:'center', animation:'fadeIn 0.5s', width:'95%', maxWidth:'720px'}}>
                    <div style={{fontSize:'16px', marginBottom:'24px', color:'#ccc'}}>
                        <div style={{fontSize:'40px', marginBottom:'10px'}}>🌀</div>
                        灵境远征 — 选择前进路线
                    </div>
                    <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
                        {(infinityState.routeOptions || pickRouteOptions(floor)).map((route, ri) => (
                        <button type="button" key={ri} onClick={() => selectInfinityRoute(route)} style={{
                            color:'inherit', fontFamily:'inherit', textAlign:'center',
                            width:'130px', padding:'16px 12px', background: route.id === 'elite' ? '#3E2723' : '#2a2a3e',
                            borderRadius:'12px', cursor:'pointer', border: route.id === 'elite' ? '2px solid #FF5252' : '2px solid #555',
                            transition:'transform 0.2s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'none'; }}
                        >
                            <div style={{fontSize:'36px'}}>{route.icon}</div>
                            <div style={{marginTop:'10px', fontWeight:'bold', fontSize:'13px'}}>{route.name}</div>
                            <div style={{fontSize:'10px', color:'#aaa', marginTop:'4px', lineHeight:1.4}}>{route.desc}</div>
                        </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Buff 选择阶段 */}
            {status === 'buff_select' && (
                <div style={{textAlign:'center', width:'90%', maxWidth:'600px', animation:'slideUp 0.5s'}}>
                    <div style={{fontSize:'24px', marginBottom:'10px', color:'#FFD700', textShadow:'0 0 10px #FFD700'}}>✨ 呼吸法领悟 ✨</div>
                    <div style={{fontSize:'12px', color:'#aaa', marginBottom:'30px'}}>通过了试炼，你的队伍变得更强了...</div>
                    
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                        {buffOptions.map((buff, i) => (
                            <button type="button" key={i} onClick={() => selectInfinityBuff(buff)} style={{
                                color:'inherit', fontFamily:'inherit', textAlign:'center',
                                background:'linear-gradient(135deg, #311B92 0%, #000 100%)', 
                                padding:'25px 15px', borderRadius:'16px',
                                cursor:'pointer', border:'1px solid #7B1FA2', 
                                transition:'0.3s', position:'relative', overflow:'hidden',
                                boxShadow:'0 10px 30px rgba(0,0,0,0.5)'
                            }} 
                            onMouseOver={e=>{e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor='#E040FB'}}
                            onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#7B1FA2'}}
                            >
                                <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'10px', color:'#E1BEE7'}}>{buff.name}</div>
                                <div style={{fontSize:'12px', color:'#ccc', lineHeight:'1.5'}}>{buff.desc}</div>
                                <div style={{
                                    position:'absolute', bottom:'-10px', right:'-10px', 
                                    fontSize:'60px', opacity:0.1, pointerEvents:'none'
                                }}>⚔️</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    );
  
}
