import React from 'react';
import { applyGangGoldDonation } from '../../data/gang';
import { buildGangCommandPlan } from '../../data/gang';
import { DEFAULT_GANG_STATE } from '../../data/gang';
import { evaluateGangWarTarget } from '../../data/gang';
import { FACTION_IDS } from '../../data/kingdom';
import { FACTIONS } from '../../data/kingdom';
import { flushSync } from 'react-dom';
import { GANG_LEVEL_UP_COST } from '../../data/gang';
import { GANG_MAX_MEMBERS } from '../../data/gang';
import { GANG_PRESETS } from '../../data/gang';
import { GANG_RANKS } from '../../data/gang';
import { GANG_SKILL_COST_MULT } from '../../data/gang';
import { GANG_SKILLS } from '../../data/gang';
import { GANG_TASKS } from '../../data/gang';
import { GANG_WAR_CONFIG } from '../../data/gang';
import { generateCafeRecruits } from '../../data/gang';
import { getGangMaxSkills } from '../../data/gang';
import { getGangRank } from '../../data/gang';
import { getGangSkillBonus } from '../../data/gang';
import { getGangSkills } from '../../data/gang';
import { getGangWarLevel } from '../../data/gang';
import { getGangWarReward } from '../../data/gang';
import { initTerritories } from '../../data/kingdom';
import { PERSONAL_SKILL_BASE_COST } from '../../data/gang';
import { PERSONAL_SKILL_COST_MULT } from '../../data/gang';
import { POKEDEX } from '../../data/pets';
import { removeSinglePetByUid } from '../../utils/petIdentity';
import { syncContestedTerritoryOwners } from '../../data/kwSiege';

export default function GangScreen({
  battle,
  battleResultHandledRef,
  clearRemovedPetLinks,
  createPet,
  gang,
  gangActionLocksRef,
  gangRef,
  gangTab,
  gangTaskClaimLocksRef,
  getAssignedPetUids,
  getCurrentGangRank,
  getFreshGangDailyCounts,
  getGangInfo,
  getLocalDateStr,
  getRankPerkEffects,
  gold,
  goldRef,
  kingdomWar,
  party,
  partyRef,
  reclaimRemovedPetAssets,
  renderAvatar,
  safeBack,
  setConfirmModal,
  setGang,
  setGangTab,
  setGold,
  setKingdomWar,
  setParty,
  setView,
  setViewGangMember,
  showMapToast,
  startBattle,
  trainerName,
  updateAchStat,
  updateGangTaskProgress,
  viewGangMember
}) {
    const gangInfo = getGangInfo();
    const rank = getCurrentGangRank();
    const today = getLocalDateStr();
    const dc = getFreshGangDailyCounts(gang.dailyCounts, today);
    const skills = getGangSkills(gang);
    const bonus = getGangSkillBonus(skills);
    const gangReadyTasks = GANG_TASKS.filter(task => (dc.taskCompleted || []).includes(task.id) && !(dc.taskCompleted || []).includes(task.id + '_claimed')).length;
    const gangDailyDone = (dc.taskCompleted || []).filter(id => String(id).endsWith('_claimed')).length;
    const livingPartyForGang = party.filter(p => p && (p.currentHp || 0) > 0);
    const partyAvgLevelForGang = livingPartyForGang.length
      ? Math.floor(livingPartyForGang.reduce((s, p) => s + (p.level || 1), 0) / livingPartyForGang.length)
      : 1;

    const headerStyle = {background:'rgba(0,0,0,0.4)', borderBottom:'1px solid rgba(255,215,0,0.1)', zIndex:5};
    const cardStyle = {background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'14px', marginBottom:'10px'};
    const btnPrimary = {color:'#fff', background:'linear-gradient(135deg,#FF6F00,#FF8F00)', border:'none', padding:'10px 24px', borderRadius:'20px', cursor:'pointer', fontWeight:'bold', fontSize:'13px', boxShadow:'0 4px 12px rgba(255,111,0,0.3)'};
    const btnSecondary = {color:'#fff', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', padding:'8px 18px', borderRadius:'18px', cursor:'pointer', fontWeight:'bold', fontSize:'12px'};

    // 无帮派: 创建/加入
    const leaveCooldown = gang.leaveTime ? Math.max(0, 24 * 60 * 60 * 1000 - (Date.now() - gang.leaveTime)) : 0;
    const leaveHoursLeft = Math.ceil(leaveCooldown / (60 * 60 * 1000));
    const canJoinGang = leaveCooldown <= 0;

    if (!gang.gangId) {
      return (<div className="screen gang-command-screen gang-join-screen" style={{background:'linear-gradient(135deg,#0d1117,#161b22,#1a2332)', color:'#fff', display:'flex', flexDirection:'column', overflow:'hidden'}}><div className="gang-command-header" style={{...headerStyle, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0, height:'60px'}}><button onClick={() => setView(safeBack())} style={{...btnSecondary}}>⬅ 返回</button><div style={{fontSize:'16px', letterSpacing:'2px', fontWeight:'800', color:'#fff'}}>🏴 帮派系统</div><div style={{width:60}} /></div><div className="gang-command-body" style={{flex:1, overflowY:'auto', padding:'20px'}}>{!canJoinGang && (<div style={{padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', marginBottom:'16px', textAlign:'center'}}><div style={{fontSize:'13px', color:'#ef5350', fontWeight:'bold'}}>⏳ 退帮冷却中</div><div style={{fontSize:'12px', color:'#aaa', marginTop:'4px'}}>还需等待约 {leaveHoursLeft} 小时才能加入新帮派</div></div>)}<div className="gang-join-hero" style={{textAlign:'center', marginBottom:'24px'}}><div style={{fontSize:'28px', fontWeight:'900', background:'linear-gradient(135deg, #DAA520, #FFD700)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'3px', marginBottom:'8px'}}>帮派系统</div><div style={{fontSize:'12px', color:'#8b949e', lineHeight:'1.6'}}>加入帮派后可领俸禄、做任务、打帮战、学技能<br/>{kingdomWar.faction ? <span style={{color: FACTIONS[kingdomWar.faction]?.lightColor || '#90CAF9'}}>已加入{FACTIONS[kingdomWar.faction]?.fullName} · 显示同阵营帮派</span> : '每个国家各有4个特色帮派可供选择'}</div></div>{(kingdomWar.faction ? [kingdomWar.faction] : FACTION_IDS).map(fid => { const faction = FACTIONS[fid]; const fGangs = GANG_PRESETS.filter(g => g.faction === fid); return (<div key={fid} className="gang-faction-section" style={{marginBottom:'24px'}}><div className="gang-faction-banner" style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px', padding:'12px 16px', borderRadius:'12px', background:'linear-gradient(135deg, '+faction.color+'20, '+faction.darkColor+'15)', border:'1px solid '+faction.color+'30'}}><div style={{width:'40px', height:'40px', borderRadius:'10px', background:faction.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', boxShadow:'0 4px 12px '+faction.color+'40'}}>{faction.icon}</div><div style={{flex:1}}><div style={{fontSize:'16px', fontWeight:'800', color:'#fff', letterSpacing:'2px'}}>{faction.fullName}</div><div style={{fontSize:'11px', color:faction.lightColor, opacity:0.8}}>「{faction.motto}」 · 主公: {faction.lord}</div></div><div style={{textAlign:'right'}}><div style={{fontSize:'10px', color:'#8b949e'}}>国运加成</div><div style={{fontSize:'11px', color:faction.lightColor, fontWeight:'600'}}>{faction.bonusDesc}</div></div></div><div className="gang-preset-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>{fGangs.map(g => (<div key={g.id} className="gang-preset-card" style={{borderRadius:'14px', overflow:'hidden', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', transition:'all 0.3s ease'}} onMouseEnter={e => { e.currentTarget.style.borderColor=faction.color+'60'; e.currentTarget.style.boxShadow='0 8px 24px '+faction.color+'20'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform=''; }}><div style={{padding:'14px 16px 10px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}><div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}><span style={{fontSize:'26px'}}>{g.icon}</span><div style={{flex:1}}><div style={{fontWeight:'800', fontSize:'15px', color:'#e6edf3'}}>{g.name}</div><div style={{fontSize:'10px', color:'#8b949e'}}>{g.style} · Lv.{g.level}</div></div></div><div style={{fontSize:'11px', color:'#8b949e', lineHeight:'1.5'}}>{g.desc}</div></div><div style={{padding:'10px 16px 14px'}}>{g.perkDesc && (<div style={{fontSize:'11px', color:faction.lightColor, marginBottom:'6px', padding:'5px 8px', borderRadius:'6px', background:faction.color+'12', border:'1px solid '+faction.color+'20'}}>🎁 {g.perkDesc}</div>)}<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'11px', color:'#8b949e', marginBottom:'10px'}}><span>帮主: {g.leader}</span><span>成员 {g.members.length}人</span></div><button onClick={() => { if (!canJoinGang) { showMapToast('⏳', '退帮冷却', `还需等待约 ${leaveHoursLeft} 小时`, 2000); return; } setConfirmModal({ title:'🏴 加入帮派', msg:'确定要加入「'+g.name+'」吗？' + (g.faction && !kingdomWar.faction ? '\n\n将自动加入 '+FACTIONS[g.faction]?.fullName+' 阵营' : '') + (g.faction && kingdomWar.faction && g.faction !== kingdomWar.faction ? '\n\n⚠️ 该帮派属于 '+FACTIONS[g.faction]?.fullName+'，与你当前阵营不符！' : ''), onOk: () => { if (g.faction && kingdomWar.faction && g.faction !== kingdomWar.faction) { showMapToast('❌','无法加入','该帮派属于 '+FACTIONS[g.faction]?.fullName+'，与你的阵营 '+FACTIONS[kingdomWar.faction]?.fullName+' 不符',2500); return; } setGang(prev => ({...prev, gangId: g.id, gangName: g.name, role:'member', joinDate: Date.now(), contribution:0, leaveTime: null, dailyCounts: { salary: false, warCount: 0, taskProgress: {}, taskCompleted: [], cafeRecruits: generateCafeRecruits(), resetDate: getLocalDateStr() }, members: [...(g.members || [])]})); if (g.faction && !kingdomWar.faction) { setKingdomWar(prev => { const terr0 = Object.keys(prev.territories || {}).length > 0 ? prev.territories : initTerritories(); const terr1 = syncContestedTerritoryOwners(prev.contestProgress || {}, terr0); return { ...prev, faction: g.faction, territories: terr1, lastTick: Date.now(), seasonStartDate: prev.seasonStartDate || new Date().toISOString(), dailyCounts: { ...prev.dailyCounts, resetDate: getLocalDateStr() } }; }); showMapToast('🎉','加入成功','欢迎加入'+g.name+'！已自动加入'+FACTIONS[g.faction]?.fullName,2000); } else { showMapToast('🎉','加入成功','欢迎加入'+g.name+'！',1500); } }}); }} style={{width:'100%', padding:'10px', border:'none', borderRadius:'10px', cursor:'pointer', background:'linear-gradient(135deg, '+faction.color+', '+faction.darkColor+')', color:'#fff', fontWeight:'700', fontSize:'13px', letterSpacing:'1px', boxShadow:'0 4px 12px '+faction.color+'30', transition:'all 0.2s ease'}}>加入帮派</button></div></div>))}</div></div>); })}</div></div>);
    }

    // 有帮派
    const tabs = [
      { id: 'overview', label: '概览', icon: '🏠' },
      { id: 'tasks', label: '任务', icon: '📋' },
      { id: 'members', label: '成员', icon: '👥' },
      { id: 'war', label: '帮战', icon: '⚔️' },
      { id: 'skills', label: '技能', icon: '📖' },
      { id: 'ranking', label: '排行', icon: '🏆' },
      { id: 'recruit', label: '招募', icon: '📮' },
    ];

    const renderGangOverview = () => {
      const memberCount = gangInfo?.members?.length || 0;
      const maxMembers = GANG_MAX_MEMBERS(gangInfo?.level || 1);
      const commandPlan = buildGangCommandPlan({ gangInfo, gang, dailyCounts: dc, kingdomWar, partyAvgLevel: partyAvgLevelForGang });
      return (
        <div>
          <div style={{...cardStyle, display:'flex', alignItems:'center', gap:'14px', background:'linear-gradient(135deg, rgba(255,111,0,0.15), rgba(255,143,0,0.05))'}}>
            <span style={{fontSize:'48px'}}>{gangInfo?.icon || '🏴'}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:'18px', fontWeight:'bold'}}>{gangInfo?.name || '未知帮派'}</div>
              <div style={{fontSize:'12px', color:'#aaa', marginTop:'2px'}}>{gangInfo?.desc}</div>
              <div style={{fontSize:'12px', color:'#FFD700', marginTop:'4px'}}>帮派等级: Lv.{gangInfo?.level || 1} · 战力 {gangInfo?.power || 0}</div>
              {gangInfo?.perkDesc && <div style={{fontSize:'11px', color:'#66BB6A', marginTop:'3px'}}>🎁 帮派特色: {gangInfo.perkDesc}</div>}
            </div>
          </div>

          <div style={{...cardStyle, background:'linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.86))', border:'1px solid rgba(148,163,184,0.22)', boxShadow:'0 12px 34px rgba(0,0,0,0.18)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'12px'}}>
              <div>
                <div style={{fontSize:'12px', color:'#fbbf24', fontWeight:'900', letterSpacing:'1px'}}>今日指挥台</div>
                <div style={{fontSize:'18px', fontWeight:'900', color:'#fff', marginTop:'3px'}}>{commandPlan.focus.label}</div>
                <div style={{fontSize:'11px', color:'#cbd5e1', marginTop:'4px', lineHeight:1.55}}>{commandPlan.focus.desc}</div>
              </div>
              <button type="button" onClick={() => setGangTab(commandPlan.warLeft > 0 ? 'war' : 'tasks')} style={{...btnPrimary, padding:'8px 14px', borderRadius:'12px', fontSize:'11px', flexShrink:0}}>
                {commandPlan.warLeft > 0 ? '去帮战' : '做任务'}
              </button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(92px, 1fr))', gap:'8px', marginBottom:'12px'}}>
              {commandPlan.metrics.map(m => (
                <div key={m.label} style={{background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'9px'}}>
                  <div style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700'}}>{m.label}</div>
                  <div style={{fontSize:'14px', color:'#fff', fontWeight:'900', marginTop:'2px'}}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'10px'}}>
              <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                <div style={{fontSize:'11px', color:'#e5e7eb', fontWeight:'900', marginBottom:'8px'}}>任务优先</div>
                {commandPlan.taskPlan.slice(0, 3).map(t => (
                  <div key={t.id} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px'}}>
                    <span style={{fontSize:'15px'}}>{t.icon}</span>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:'11px', color:'#fff', fontWeight:'800', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.name}</div>
                      <div style={{fontSize:'10px', color:t.done && !t.claimed ? '#86efac' : '#94a3b8'}}>{t.claimed ? '已领取' : t.done ? '可领取' : `${t.progress}/${t.target}`}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                <div style={{fontSize:'11px', color:'#e5e7eb', fontWeight:'900', marginBottom:'8px'}}>技能路线</div>
                {(commandPlan.skillPlan.length ? commandPlan.skillPlan : GANG_SKILLS.slice(0, 3)).slice(0, 3).map(s => (
                  <div key={s.id} style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px'}}>
                    <span style={{fontSize:'15px'}}>{s.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'11px', color:'#fff', fontWeight:'800'}}>{s.name}</div>
                      <div style={{fontSize:'10px', color:'#94a3b8'}}>Lv.{s.curLv || 0}/{s.maxLv || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                <div style={{fontSize:'11px', color:'#e5e7eb', fontWeight:'900', marginBottom:'8px'}}>经营取舍</div>
                {commandPlan.depthLevers.map(lever => (
                  <div key={lever.label} style={{marginBottom:'8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
                      <span style={{fontSize:'11px', color:'#fff', fontWeight:'800'}}>{lever.label}</span>
                      <span style={{fontSize:'10px', color:'#fbbf24', fontWeight:'900'}}>{lever.value}</span>
                    </div>
                    <div style={{fontSize:'10px', color:'#94a3b8', lineHeight:1.45, marginTop:'2px'}}>{lever.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
            <div style={cardStyle}>
              <div style={{fontSize:'11px', color:'#999'}}>你的职位</div>
              <div style={{fontSize:'16px', fontWeight:'bold', color:'#FFD700'}}>{rank.icon} {rank.name}</div>
            </div>
            <div style={cardStyle}>
              <div style={{fontSize:'11px', color:'#999'}}>帮贡</div>
              <div style={{fontSize:'16px', fontWeight:'bold', color:'#4FC3F7'}}>{gang.contribution}</div>
            </div>
            <div style={cardStyle}>
              <div style={{fontSize:'11px', color:'#999'}}>成员</div>
              <div style={{fontSize:'16px', fontWeight:'bold'}}>{memberCount}/{maxMembers}</div>
            </div>
            <div style={cardStyle}>
              <div style={{fontSize:'11px', color:'#999'}}>帮战胜场</div>
              <div style={{fontSize:'16px', fontWeight:'bold', color:'#66BB6A'}}>{gangInfo?.wins || 0}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{fontSize:'13px', fontWeight:'bold', marginBottom:'8px'}}>💰 每日俸禄</div>
            {dc.salary ? (
              <div style={{color:'#66BB6A', fontSize:'13px'}}>✅ 今日已领取 {Math.floor(rank.salary * (getRankPerkEffects(kingdomWar).gangSalaryMult || 1)).toLocaleString()} 金币</div>
            ) : (
              <button onClick={() => {
                const todayStr = getLocalDateStr();
                const lockKey = `salary:${todayStr}`;
                if (gangTaskClaimLocksRef.current.has(lockKey)) { showMapToast('✅', '提示', '今日已领取俸禄', 2000); return; }
                const freshDc = getFreshGangDailyCounts(gangRef.current?.dailyCounts, todayStr);
                if (freshDc.salary) { showMapToast('✅', '提示', '今日已领取俸禄', 2000); return; }
                gangTaskClaimLocksRef.current.add(lockKey);
                const rankPerk = getRankPerkEffects(kingdomWar);
                const salaryMult = rankPerk.gangSalaryMult || 1;
                const finalSalary = Math.floor(rank.salary * salaryMult);
                const currentGang = gangRef.current;
                const nextGang = { ...currentGang, dailyCounts: { ...freshDc, salary: true } };
                gangRef.current = nextGang;
                goldRef.current += finalSalary;
                flushSync(() => { setGold(goldRef.current); setGang(nextGang); });
                updateAchStat({ totalGoldEarned: finalSalary });
                showMapToast('💰', '领取俸禄', `${finalSalary.toLocaleString()} 金币${salaryMult > 1 ? `（军衔 ×${salaryMult}）` : ''}`, 2000);
              }} style={btnPrimary}>
                领取 {Math.floor(rank.salary * (getRankPerkEffects(kingdomWar).gangSalaryMult || 1)).toLocaleString()} 金币
              </button>
            )}
          </div>

          {/* 职位晋升提示 */}
          {(() => {
            const currentRankIdx = GANG_RANKS.findIndex(r => r.id === rank.id);
            const nextRank = currentRankIdx >= 0 && currentRankIdx < GANG_RANKS.length - 1 ? GANG_RANKS[currentRankIdx + 1] : null;
            if (!nextRank || gang.isOwner) return null;
            if (nextRank.id === 'leader') {
              return (
                <div style={cardStyle}>
                  <div style={{fontSize:'13px', fontWeight:'bold', marginBottom:'6px'}}>🎯 已达成员最高职位</div>
                  <div style={{fontSize:'12px', color:'#aaa'}}>副帮主是普通成员可晋升的最高职位；帮主仅属于帮派创建者，不会由帮贡自动晋升。</div>
                </div>
              );
            }
            const canPromote = gang.contribution >= nextRank.minContribution;
            return (
              <div style={cardStyle}>
                <div style={{fontSize:'13px', fontWeight:'bold', marginBottom:'6px'}}>🎯 下一职位: {nextRank.icon} {nextRank.name}</div>
                <div style={{fontSize:'12px', color:'#aaa'}}>{canPromote ? '已满足晋升条件！' : `还需 ${nextRank.minContribution - gang.contribution} 帮贡`}</div>
                <div style={{width:'100%', height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', marginTop:'6px', overflow:'hidden'}}>
                  <div style={{height:'100%', width:`${Math.min(100, (gang.contribution / (nextRank.minContribution || 1)) * 100)}%`, background:'linear-gradient(90deg,#FFD700,#FF8F00)', borderRadius:'3px'}} />
                </div>
                {canPromote && <div style={{fontSize:'11px', color:'#66BB6A', marginTop:'8px', fontWeight:'700'}}>职位已自动生效</div>}
              </div>
            );
          })()}

          <button onClick={() => {
            const penalty = Math.min(Math.floor((gold || 0) * 0.05), 10000);
            const penaltyText = penalty > 0 ? `\n- 罚款 ${penalty.toLocaleString()} 金币（当前金币的5%，最高10000）` : '';
            setConfirmModal({ title:'⚠️ 退帮确认', msg:`退帮惩罚：\n- 帮贡清零\n- 个人技能全部重置\n- 24小时内无法加入新帮派${penaltyText}\n\n确定要退出帮派吗？`, onOk: () => {
              if (penalty > 0) setGold(g => Math.max(0, g - penalty));
              setGang({ ...DEFAULT_GANG_STATE, leaveTime: Date.now() });
              setGangTab('overview');
              showMapToast('ℹ️', '提示', '你已退出帮派。所有帮派加成已失效，24小时后可加入新帮派。', 2000);
            }});
          }} style={{...btnSecondary, color:'#ef5350', borderColor:'rgba(239,83,80,0.3)', marginTop:'10px', width:'100%'}}>
            退出帮派
          </button>
        </div>
      );
    };

    const renderGangTasks = () => {
      const tp = dc.taskProgress || {};
      const completed = dc.taskCompleted || [];
      return (
        <div>
          <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'12px'}}>📋 每日任务</div>
          {GANG_TASKS.filter(task => !task.reqKingdom || kingdomWar?.faction).map(task => {
            const progress = tp[task.id] || 0;
            const isDone = completed.includes(task.id);
            const isClaimed = completed.includes(task.id + '_claimed');
            return (
              <div key={task.id} style={{...cardStyle, opacity: isClaimed ? 0.5 : 1}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                  <span style={{fontSize:'18px'}}>{task.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold', fontSize:'13px'}}>{task.name}</div>
                    <div style={{fontSize:'11px', color:'#aaa'}}>{task.desc}</div>
                  </div>
                  <span style={{fontSize:'11px', color:'#FFD700'}}>+{task.reward}帮贡</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <div style={{flex:1, height:'5px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                    <div style={{height:'100%', width:`${Math.min(100, (progress / task.target) * 100)}%`, background: isDone ? '#66BB6A' : 'linear-gradient(90deg,#4FC3F7,#29B6F6)', borderRadius:'3px', transition:'width 0.3s'}} />
                  </div>
                  <span style={{fontSize:'11px', color:'#aaa', minWidth:'50px', textAlign:'right'}}>{Math.min(progress, task.target)}/{task.target}</span>
                  {isDone && !isClaimed && (
                    <button onClick={() => {
                      const todayStr = getLocalDateStr();
                      const claimId = `${task.id}_claimed`;
                      const lockKey = `task:${todayStr}:${task.id}`;
                      if (gangTaskClaimLocksRef.current.has(lockKey)) { showMapToast('✅', '提示', '该任务奖励已领取', 1600); return; }
                      const freshDc = getFreshGangDailyCounts(gangRef.current?.dailyCounts, todayStr);
                      const freshCompleted = freshDc.taskCompleted || [];
                      if (!freshCompleted.includes(task.id) || freshCompleted.includes(claimId)) {
                        showMapToast('✅', '提示', freshCompleted.includes(claimId) ? '该任务奖励已领取' : '任务尚未完成', 1600);
                        return;
                      }
                      gangTaskClaimLocksRef.current.add(lockKey);
                      const taskFunds = task.type === 'donate_gold' ? task.target : Math.floor(task.reward * 30);
                      setGang(prev => {
                        const nextDc = getFreshGangDailyCounts(prev.dailyCounts, todayStr);
                        const nextCompleted = nextDc.taskCompleted || [];
                        if (!nextCompleted.includes(task.id) || nextCompleted.includes(claimId)) return prev;
                        const next = {
                          ...prev,
                          contribution: (prev.contribution || 0) + task.reward,
                          dailyCounts: { ...nextDc, taskCompleted: [...nextCompleted, claimId] },
                        };
                        if (prev.isOwner && prev.customGang) {
                          next.customGang = { ...prev.customGang, funds: (prev.customGang.funds || 0) + taskFunds };
                        }
                        return next;
                      });
                      if (task.gold > 0) {
                        goldRef.current += task.gold;
                        setGold(goldRef.current);
                        updateAchStat({ totalGoldEarned: task.gold });
                      }
                      showMapToast('✅', '任务完成', `${task.name} · 帮贡 +${task.reward}${task.gold > 0 ? ` · 金币 +${task.gold}` : ''}${gang.isOwner ? ` · 帮派资金 +${taskFunds}` : ''}`, 2500);
                    }} style={{...btnPrimary, fontSize:'11px', padding:'5px 12px'}}>
                      领取
                    </button>
                  )}
                  {isClaimed && <span style={{fontSize:'11px', color:'#66BB6A'}}>✅</span>}
                </div>
              </div>
            );
          })}
          {/* 捐献金币 */}
          {!completed.includes('donate_gold') && (
            <button onClick={() => {
              const todayStr = getLocalDateStr();
              const lockKey = `donate_gold:${todayStr}`;
              if (gangActionLocksRef.current.has(lockKey)) return;
              const freshDc = getFreshGangDailyCounts(gangRef.current?.dailyCounts, todayStr);
              const donation = applyGangGoldDonation({
                gang: gangRef.current,
                dailyCounts: freshDc,
                currentGold: goldRef.current,
              });
              if (!donation.ok) {
                if (donation.reason === 'not_in_gang') showMapToast('⚠️', '捐献已取消', '当前已不在帮派中', 1800);
                else if (donation.reason === 'already_completed') showMapToast('✅', '提示', '今日已完成金币捐献', 1600);
                else if (donation.reason === 'insufficient_gold') showMapToast('💰', '金币不足', `需要至少 ${donation.cost || 5000} 金币`, 1500);
                else showMapToast('⚠️', '捐献失败', '帮派任务状态异常，请刷新后重试', 1800);
                return;
              }
              gangActionLocksRef.current.add(lockKey);
              try {
                gangRef.current = donation.nextGang;
                goldRef.current = donation.nextGold;
                setGang(donation.nextGang);
                setGold(donation.nextGold);
                updateAchStat({ totalGoldSpent: donation.cost });
                showMapToast('💰', '捐献成功', `已捐献 ${donation.cost.toLocaleString()} 金币，任务可领取`, 1800);
              } finally {
                gangActionLocksRef.current.delete(lockKey);
              }
            }} style={{...btnSecondary, width:'100%', marginTop:'6px'}}>
              💰 捐献 5,000 金币
            </button>
          )}
          {/* 上交精灵 */}
          {!completed.includes('donate_pet') && party.length > 1 && (
            <button onClick={() => {
              const assignedUids = getAssignedPetUids();
              const latestParty = partyRef.current || [];
              const petToGive = [...latestParty].reverse().find(p => p && (p.level || 1) >= 20 && p.uid && !assignedUids.has(p.uid));
              if (!petToGive) { showMapToast('⚠️', '无法上交', '没有 Lv.20 以上且未被派遣或打工的精灵可上交', 1800); return; }
              setConfirmModal({ title:'🐾 上交确认', msg:`确定上交 ${petToGive.name} (Lv.${petToGive.level}) 吗？此操作不可恢复！`, onOk: () => {
                const todayStr = getLocalDateStr();
                const lockKey = `donate_pet:${todayStr}`;
                if (gangActionLocksRef.current.has(lockKey)) return;
                const freshDc = getFreshGangDailyCounts(gangRef.current?.dailyCounts, todayStr);
                if (!gangRef.current?.gangId || (freshDc.taskCompleted || []).includes('donate_pet')) return;
                const currentParty = partyRef.current || [];
                if (currentParty.length <= 1) { showMapToast('⚠️', '无法上交', '队伍至少需要保留 1 只精灵', 1800); return; }
                if (getAssignedPetUids().has(petToGive.uid)) { showMapToast('⚠️', '无法上交', '该精灵正在训练、远征或咖啡厅打工，请先召回', 1800); return; }
                const removal = removeSinglePetByUid(currentParty, petToGive.uid);
                if (!removal.removed || (removal.removed.level || 1) < 20) {
                  showMapToast('ℹ️', '上交已取消', '目标精灵状态已变化，请重新选择', 1800);
                  return;
                }
                gangActionLocksRef.current.add(lockKey);
                partyRef.current = removal.pets;
                setParty(removal.pets);
                reclaimRemovedPetAssets([removal.removed]);
                clearRemovedPetLinks([petToGive.uid]);
                updateGangTaskProgress('donate_pet', 1);
                showMapToast('🐾', '上交成功', `${removal.removed.name || '精灵'} 已上交，任务进度已更新`, 2200);
              }}); return;
            }} style={{...btnSecondary, width:'100%', marginTop:'6px'}}>
              🐾 上交队尾精灵
            </button>
          )}
        </div>
      );
    };

    const renderGangWar = () => {
      const rankObj = getCurrentGangRank();
      const canWar = rankObj && GANG_RANKS.indexOf(rankObj) >= 1;
      const warCount = dc.warCount || 0;
      const targets = GANG_PRESETS
        .filter(g => g.id !== gang.gangId)
        .map(target => ({ target, preview: evaluateGangWarTarget({ targetGang: target, ownGang: gangInfo, kingdomWar, partyAvgLevel: partyAvgLevelForGang, isOwner: gang.isOwner }) }))
        .sort((a, b) => (b.preview?.rewardScore || 0) - (a.preview?.rewardScore || 0));
      return (
        <div>
          <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>⚔️ 帮战</div>
          <div style={{fontSize:'12px', color:'#aaa', marginBottom:'12px'}}>
            已挑战 {warCount}/{GANG_WAR_CONFIG.maxDaily} · 剩余 {Math.max(0, GANG_WAR_CONFIG.maxDaily - warCount)} 次 · {!canWar ? '需达到精英以上才能参与帮战' : '按收益与风险排序，优先打推荐目标'}
          </div>
          {canWar && targets.map(({ target, preview }) => {
            const reward = getGangWarReward(target);
            const enemyLv = getGangWarLevel(target);
            const rewardText = gang.isOwner
              ? `${reward.funds}帮派资金 + ${reward.contribution}帮贡`
              : `${reward.contribution}帮贡`;
            return (
              <div key={target.id} style={{...cardStyle, display:'grid', gridTemplateColumns:'auto minmax(0, 1fr) auto', alignItems:'center', gap:'10px', border: preview?.winChance >= 0.56 ? '1px solid rgba(102,187,106,0.35)' : cardStyle.border}}>
                <span style={{fontSize:'28px'}}>{target.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'bold', fontSize:'13px'}}>{target.name} <span style={{color:'#999', fontSize:'11px'}}>Lv.{target.level}</span></div>
                  <div style={{fontSize:'11px', color:'#aaa'}}>对手等级 ~Lv.{enemyLv} · 奖励 {rewardText}</div>
                  {preview && (
                    <div style={{display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'6px'}}>
                      <span style={{fontSize:'10px', color:'#86efac', background:'rgba(34,197,94,0.12)', padding:'2px 7px', borderRadius:'999px'}}>等级差 {preview.levelDelta >= 0 ? '+' : ''}{preview.levelDelta}</span>
                      <span title="仅比较存活队伍平均等级；属性、技能、装备、特性与克制决定实战结果" style={{fontSize:'10px', color:'#94a3b8', background:'rgba(148,163,184,0.1)', padding:'2px 7px', borderRadius:'999px'}}>等级参考</span>
                      <span style={{fontSize:'10px', color:'#fbbf24', background:'rgba(251,191,36,0.12)', padding:'2px 7px', borderRadius:'999px'}}>{preview.riskLabel}</span>
                      <span style={{fontSize:'10px', color:'#fca5a5', background:'rgba(239,68,68,0.12)', padding:'2px 7px', borderRadius:'999px'}}>等级压力 {preview.difficultyScore}</span>
                      {(preview.advice || []).slice(0, 1).map(tip => <span key={tip} style={{fontSize:'10px', color:'#cbd5e1', background:'rgba(255,255,255,0.07)', padding:'2px 7px', borderRadius:'999px'}}>{tip}</span>)}
                      <span style={{fontSize:'10px', color:'#bae6fd', background:'rgba(56,189,248,0.1)', padding:'2px 7px', borderRadius:'999px'}}>{preview.counterplay}</span>
                      {(preview.preparation || []).slice(0, 1).map(tip => <span key={tip} style={{fontSize:'10px', color:'#ddd6fe', background:'rgba(139,92,246,0.1)', padding:'2px 7px', borderRadius:'999px'}}>{tip}</span>)}
                    </div>
                  )}
                </div>
                <button disabled={warCount >= GANG_WAR_CONFIG.maxDaily} onClick={() => {
                  const freshDc = getFreshGangDailyCounts(gangRef.current?.dailyCounts);
                  if ((freshDc.warCount || 0) >= GANG_WAR_CONFIG.maxDaily) { showMapToast('❌', '提示', '今日帮战次数已用完', 1500); return; }
                  if (!target?.id) { showMapToast('⚠️', '无法参战', '帮战目标已失效，请刷新后重试', 1800); return; }
                  if (!(partyRef.current || []).some(p => p && (p.currentHp || 0) > 0)) { showMapToast('⚠️', '无法参战', '队伍中无可战斗精灵，请先治疗', 1800); return; }
                  if (battle && !battleResultHandledRef.current) { showMapToast('⚠️', '无法参战', '请先完成当前战斗', 1800); return; }
                  if (gangActionLocksRef.current.has('gang_war')) return;
                  gangActionLocksRef.current.add('gang_war');
                  try {
                    const started = startBattle({ gangWarTarget: target }, 'gang_war');
                    if (!started) gangActionLocksRef.current.delete('gang_war');
                  } catch (err) {
                    gangActionLocksRef.current.delete('gang_war');
                    console.error('gang war start:', err);
                    showMapToast('⚠️', '帮战未能启动', '未消耗挑战次数，请稍后重试', 2200);
                  }
                }} style={{...btnPrimary, fontSize:'11px', padding:'8px 14px', opacity: warCount >= GANG_WAR_CONFIG.maxDaily ? 0.5 : 1}}>
                  挑战
                </button>
              </div>
            );
          })}
        </div>
      );
    };

    const renderGangSkills = () => {
      const isOwner = gang.isOwner;
      const funds = gang.customGang?.funds || 0;
      const maxSkills = getGangMaxSkills(gang);
      const personalSk = gang.personalSkills || {};
      const rankIdx = GANG_RANKS.findIndex(r => r.id === (gang.rank || 'member'));
      return (
        <div>
          <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>📖 帮派技能</div>
          {isOwner ? (
            <div style={{fontSize:'12px', color:'#FFD700', marginBottom:'12px'}}>帮派资金: {funds.toLocaleString()} · 升级帮派技能上限（帮主自动获得满级效果）</div>
          ) : (
            <div style={{fontSize:'12px', color:'#aaa', marginBottom:'12px'}}>消耗帮贡升级个人技能等级，上限由帮主设定 · 当前帮贡: <span style={{color:'#4FC3F7'}}>{gang.contribution}</span></div>
          )}
          {GANG_SKILLS.map((skill, idx) => {
            const gangMaxLv = maxSkills[skill.id] || 0;
            const myLv = isOwner ? gangMaxLv : Math.min(personalSk[skill.id] || 0, gangMaxLv);
            const myVal = myLv * skill.valPerLv;
            const gangUpgradeCost = gangMaxLv < skill.maxLv ? skill.costPerLv * (GANG_SKILL_COST_MULT[gangMaxLv] || 1) : 0;
            const personalUpgradeCost = myLv < gangMaxLv ? PERSONAL_SKILL_BASE_COST * (PERSONAL_SKILL_COST_MULT[myLv] || 1) : 0;
            const canUpgradePersonal = !isOwner && myLv < gangMaxLv;

            return (
              <div key={skill.id} style={cardStyle}>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{fontSize:'20px'}}>{skill.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold', fontSize:'13px'}}>
                      {skill.name}
                      <span style={{color:'#4FC3F7', fontSize:'11px', marginLeft:'4px'}}>
                        {isOwner ? `帮派 Lv.${gangMaxLv}/${skill.maxLv}` : `Lv.${myLv}/${gangMaxLv}`}
                      </span>
                      {!isOwner && <span style={{color:'#666', fontSize:'10px', marginLeft:'4px'}}>(帮派上限 {gangMaxLv})</span>}
                    </div>
                    <div style={{fontSize:'11px', color:'#aaa'}}>{skill.desc.replace('{val}', myVal)}</div>
                    {!isOwner && gangMaxLv > 0 && (
                      <div style={{width:'100%', height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', marginTop:'4px', overflow:'hidden'}}>
                        <div style={{height:'100%', width:`${(myLv / gangMaxLv) * 100}%`, background:'linear-gradient(90deg,#4FC3F7,#29B6F6)', borderRadius:'2px', transition:'width 0.3s'}} />
                      </div>
                    )}
                  </div>
                  {isOwner && gangMaxLv < skill.maxLv && (
                    <button onClick={() => {
                      if (funds < gangUpgradeCost) { showMapToast('💰', '帮派资金不足', `升级需要 ${gangUpgradeCost.toLocaleString()}`, 1500); return; }
                      setGang(prev => ({
                        ...prev,
                        customGang: {
                          ...prev.customGang,
                          funds: prev.customGang.funds - gangUpgradeCost,
                          skills: { ...(prev.customGang.skills || {}), [skill.id]: gangMaxLv + 1 },
                        },
                      }));
                    }} style={{...btnSecondary, fontSize:'11px', padding:'5px 10px', flexShrink:0}}>
                      升级上限 ({gangUpgradeCost.toLocaleString()})
                    </button>
                  )}
                  {canUpgradePersonal && (
                    <button onClick={() => {
                      if (gang.contribution < personalUpgradeCost) { showMapToast('⭐', '帮贡不足', `升级需要 ${personalUpgradeCost} 帮贡`, 1500); return; }
                      setGang(prev => ({
                        ...prev,
                        contribution: prev.contribution - personalUpgradeCost,
                        personalSkills: { ...(prev.personalSkills || {}), [skill.id]: myLv + 1 },
                      }));
                    }} style={{...btnSecondary, fontSize:'11px', padding:'5px 10px', flexShrink:0}}>
                      学习 ({personalUpgradeCost} 帮贡)
                    </button>
                  )}
                  {!isOwner && myLv >= gangMaxLv && gangMaxLv > 0 && (
                    <span style={{fontSize:'10px', color:'#66BB6A', fontWeight:'bold', flexShrink:0}}>✅ 已满</span>
                  )}
                  {!isOwner && gangMaxLv === 0 && (
                    <span style={{fontSize:'10px', color:'#666', flexShrink:0}}>未开放</span>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{...cardStyle, background:'rgba(76,175,80,0.1)', border:'1px solid rgba(76,175,80,0.2)'}}>
            <div style={{fontSize:'12px', fontWeight:'bold', color:'#66BB6A', marginBottom:'4px'}}>你的实际加成</div>
            <div style={{fontSize:'11px', color:'#aaa', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px'}}>
              <span>💰 金币 +{bonus.gold}%</span><span>📖 经验 +{bonus.exp}%</span>
              <span>⚔️ 国战贡献 +{bonus.contrib}%</span><span>🏰 领地防御 +{bonus.territory}/tick</span>
              <span>🐫 商队收入 {bonus.trade}金/日</span><span>🎯 捕获率 +{bonus.catchRate}%</span>
            </div>
          </div>
        </div>
      );
    };

    const renderGangRanking = () => {
      const allGangs = [
        ...GANG_PRESETS.map(g => ({
          ...g,
          score: g.level * 100 + (g.members?.length || 0) * 10 + (g.wins || 0) * 5,
        })),
        ...(gang.isOwner && gang.customGang ? [{
          ...gang.customGang,
          score: (gang.customGang.level || 1) * 100 + (gang.customGang.members?.length || 0) * 10 + (gang.customGang.wins || 0) * 5,
        }] : []),
      ].sort((a, b) => b.score - a.score);

      const medals = ['🥇','🥈','🥉'];
      return (
        <div>
          <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'12px'}}>🏆 帮派排行榜</div>
          {allGangs.map((g, i) => (
            <div key={g.id} style={{...cardStyle, display:'flex', alignItems:'center', gap:'10px', background: g.id === gang.gangId || (gang.isOwner && g.id === gang.customGang?.id) ? 'rgba(255,215,0,0.1)' : cardStyle.background}}>
              <span style={{fontSize:'20px', width:'28px', textAlign:'center'}}>{medals[i] || `${i+1}`}</span>
              <span style={{fontSize:'24px'}}>{g.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:'bold', fontSize:'13px'}}>{g.name}</div>
                <div style={{fontSize:'11px', color:'#aaa'}}>Lv.{g.level} · 成员{g.members?.length || 0}人 · {g.wins || 0}胜</div>
              </div>
              <div style={{fontSize:'14px', fontWeight:'bold', color:'#FFD700'}}>{g.score}</div>
            </div>
          ))}
        </div>
      );
    };

    const renderGangRecruit = () => {
      if (!gang.isOwner) return (
        <div style={{textAlign:'center', padding:'40px 0', color:'#999'}}>
          <div style={{fontSize:'40px', marginBottom:'12px'}}>🔒</div>
          <div>只有帮主可以招募成员</div>
        </div>
      );
      const cafeR = dc.cafeRecruits || [];
      const members = gang.customGang?.members || [];
      const maxM = GANG_MAX_MEMBERS(gang.customGang?.level || 1);
      return (
        <div>
          <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>👥 招募成员</div>
          <div style={{fontSize:'12px', color:'#aaa', marginBottom:'12px'}}>当前 {members.length}/{maxM} 人 · 咖啡厅每天可邀请3人</div>

          {cafeR.length > 0 && (
            <>
              <div style={{fontSize:'12px', fontWeight:'bold', color:'#FFD700', marginBottom:'8px'}}>☕ 咖啡厅候选人</div>
              {cafeR.map((npc, i) => (
                <div key={i} style={{...cardStyle, display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{fontSize:'20px'}}>👤</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'bold', fontSize:'13px'}}>{npc.name}</div>
                    <div style={{fontSize:'11px', color:'#aaa'}}>Lv.{npc.level}</div>
                  </div>
                  <button onClick={() => {
                    if (members.length >= maxM) { showMapToast('❌', '提示', '帮派成员已满', 1500); return; }
                    if (members.some(m => m.name === npc.name)) { showMapToast('ℹ️', '提示', '该成员已在帮派中', 1500); return; }
                    setGang(prev => ({
                      ...prev,
                      customGang: { ...prev.customGang, members: [...(prev.customGang.members || []), npc] },
                      dailyCounts: { ...(prev.dailyCounts || {}), cafeRecruits: ((prev.dailyCounts || {}).cafeRecruits || []).filter((_, idx) => idx !== i) },
                    }));
                    showMapToast('🏴', '招募成功', `${npc.name} 加入了帮派`, 2000);
                  }} style={{...btnPrimary, fontSize:'11px', padding:'6px 14px'}}>
                    邀请
                  </button>
                </div>
              ))}
            </>
          )}

          {/* 帮派升级 */}
          {gang.customGang && (
            <div style={{...cardStyle, marginTop:'14px', background:'rgba(255,215,0,0.05)'}}>
              <div style={{fontSize:'13px', fontWeight:'bold', marginBottom:'6px'}}>⬆️ 帮派升级</div>
              <div style={{fontSize:'12px', color:'#aaa', marginBottom:'8px'}}>
                当前 Lv.{gang.customGang.level} · 升级费用: {GANG_LEVEL_UP_COST(gang.customGang.level).toLocaleString()} 帮派资金
              </div>
              <button onClick={() => {
                const cost = GANG_LEVEL_UP_COST(gang.customGang.level);
                if ((gang.customGang.funds || 0) < cost) { showMapToast('💰', '帮派资金不足', `需要 ${cost.toLocaleString()}`, 1500); return; }
                setGang(prev => ({
                  ...prev,
                  customGang: {
                    ...prev.customGang,
                    level: prev.customGang.level + 1,
                    funds: prev.customGang.funds - cost,
                    power: (prev.customGang.power || 100) + 200,
                  },
                }));
                showMapToast('✅', '提示', '帮派升级成功！', 2000);
              }} style={btnPrimary}>
                升级帮派
              </button>
            </div>
          )}

          <div style={{fontSize:'12px', fontWeight:'bold', color:'#4FC3F7', marginTop:'14px', marginBottom:'8px'}}>📜 当前成员</div>
          {members.map((m, i) => (
            <div key={i} style={{...cardStyle, display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px'}}>
              <span style={{fontSize:'14px'}}>👤</span>
              <span style={{fontSize:'13px', fontWeight:'bold'}}>{m.name}</span>
              <span style={{fontSize:'11px', color:'#aaa', marginLeft:'auto'}}>Lv.{m.level} · 贡献 {m.contribution || 0}</span>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="screen gang-command-screen" style={{background:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', color:'#fff', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden'}}>
        <div className="gang-command-header" style={{...headerStyle, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', flexShrink:0, height:'60px'}}>
          <button onClick={() => setView(safeBack())} style={btnSecondary}>⬅ 返回</button>
          <div style={{fontSize:'16px', letterSpacing:'2px', fontWeight:'800', color:'#fff'}}>{gangInfo?.icon} {gangInfo?.name || '帮派'}</div>
          <div style={{fontSize:'12px', color:'#FFD700'}}>{rank.icon} {rank.name}</div>
        </div>

        <div className="gang-command-breadcrumb" style={{padding:'6px 16px',fontSize:'11px',color:'#94a3b8',background:'rgba(0,0,0,0.3)'}}>
          🗺️ 地图 › 🏴 {gangInfo?.name || '帮派'} › {tabs.find(t => t.id === gangTab)?.icon} {tabs.find(t => t.id === gangTab)?.label}
        </div>
        <div className="gang-command-strip" aria-label="帮派今日状态">
          <div><span>今日任务</span><strong>{gangDailyDone}/{GANG_TASKS.filter(t => !t.reqKingdom || kingdomWar?.faction).length}</strong></div>
          <div className={gangReadyTasks > 0 ? 'is-hot' : ''}><span>可领取</span><strong>{gangReadyTasks}</strong></div>
          <div><span>帮战次数</span><strong>{dc.warCount || 0}/{GANG_WAR_CONFIG.maxDaily}</strong></div>
          <div><span>帮贡</span><strong>{gang.contribution || 0}</strong></div>
          <div><span>金币加成</span><strong>+{bonus.gold || 0}%</strong></div>
        </div>
        <div className="gang-command-tabs" style={{display:'flex', gap:'0', borderBottom:'1px solid rgba(255,255,255,0.1)', flexShrink:0, overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'none'}}>
          {tabs.map(tab => (
            <button key={tab.id} className={gangTab === tab.id ? 'is-active' : ''} onClick={() => { setGangTab(tab.id); setViewGangMember(null); }} style={{
              flex:1, padding:'10px 0', background: gangTab === tab.id ? 'rgba(255,215,0,0.1)' : 'transparent',
              border:'none', borderBottom: gangTab === tab.id ? '2px solid #FFD700' : '2px solid transparent',
              color: gangTab === tab.id ? '#FFD700' : 'rgba(255,255,255,0.55)', cursor:'pointer', fontSize:'12px', fontWeight:'bold', whiteSpace:'nowrap',
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="gang-command-content" style={{flex:1, overflowY:'auto', padding:'16px'}}>
          {gangTab === 'overview' && renderGangOverview()}
          {gangTab === 'tasks' && renderGangTasks()}
          {gangTab === 'members' && (() => {
            const npcMembers = gangInfo?.members || [];
            const factionData = gangInfo?.faction ? FACTIONS[gangInfo.faction] : null;
            const myRank = getCurrentGangRank();
            const leaderLv = Math.min(100, (gangInfo?.level || 1) * 15 + 50);
            const basePool = gangInfo?.teamPool || [];
            const genMemberTeam = (seed, lv) => {
              const team = [];
              const used = new Set();
              let s = seed;
              for (let k = 0; k < 6; k++) {
                s = (s * 1103515245 + 12345) & 0x7fffffff;
                const range = Math.max(1, Math.min(POKEDEX.length, Math.floor(lv * 8)));
                let pid = (s % range) + 1;
                let tries = 0;
                while (used.has(pid) && tries < 20) { s = (s * 1103515245 + 12345) & 0x7fffffff; pid = (s % range) + 1; tries++; }
                if (basePool.length > 0 && k < 2) pid = basePool[s % basePool.length];
                used.add(pid);
                team.push(pid);
              }
              return team;
            };
            const allMembers = [
              { name: gangInfo?.leader || '帮主', level: leaderLv, contribution: 99999, isLeader: true, team: genMemberTeam(7919, leaderLv) },
              { name: trainerName || '我', level: party[0]?.level || 1, contribution: gang.contribution || 0, isPlayer: true, team: party.slice(0, 6) },
              ...npcMembers.map((m, i) => ({ ...m, team: genMemberTeam(i * 2654435761 + (m.name || '').charCodeAt(0) || 0, m.level || 40) })),
            ].sort((a, b) => b.contribution - a.contribution);
            const viewMember = viewGangMember;
            const setViewMember = setViewGangMember;
            return (
              <div>
                <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'8px'}}>👥 帮派成员 ({allMembers.length}人)</div>
                {factionData && <div style={{padding:'6px 12px', borderRadius:'8px', background:factionData.color+'10', border:'1px solid '+factionData.color+'20', marginBottom:'8px', fontSize:'11px', color:factionData.lightColor}}>阵营: {factionData.icon} {factionData.fullName}</div>}
                {allMembers.map((m, i) => {
                  const mRank = m.isLeader ? GANG_RANKS[GANG_RANKS.length-1] : m.isPlayer ? myRank : getGangRank(m.contribution, false);
                  const isLeader = m.isLeader;
                  const isMe = m.isPlayer;
                  const bgStyle = isLeader ? {background:'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,143,0,0.04))', border:'1px solid rgba(255,215,0,0.2)'} : isMe ? {background:'linear-gradient(135deg, rgba(100,181,246,0.08), rgba(66,165,245,0.04))', border:'1px solid rgba(100,181,246,0.2)'} : {background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)'};
                  return (
                    <div key={i} onClick={() => setViewMember(viewMember === i ? null : i)} style={{...bgStyle, borderRadius:'10px', padding:'8px 12px', marginBottom:'4px', cursor:'pointer', transition:'all 0.2s'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{width:'34px', height:'34px', borderRadius:'50%', background: isLeader ? 'linear-gradient(135deg, #FFD700, #FF8F00)' : isMe ? 'linear-gradient(135deg, #42A5F5, #1E88E5)' : 'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', border:'1px solid '+(isLeader ? 'rgba(255,215,0,0.4)' : isMe ? 'rgba(66,165,245,0.4)' : 'rgba(255,255,255,0.08)'), flexShrink:0}}>{mRank?.icon || '👤'}</div>
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                            <span style={{fontWeight:'bold', fontSize:'12px', color: isLeader ? '#FFD700' : isMe ? '#64B5F6' : '#fff'}}>{m.name}</span>
                            {isMe && <span style={{fontSize:'9px', padding:'1px 4px', borderRadius:'3px', background:'rgba(100,181,246,0.2)', color:'#64B5F6', fontWeight:'700'}}>你</span>}
                            <span style={{fontSize:'9px', padding:'1px 5px', borderRadius:'3px', background: isLeader ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.06)', color: isLeader ? '#FFD700' : '#aaa', fontWeight:'600'}}>{mRank?.name || '帮众'}</span>
                          </div>
                          <div style={{fontSize:'9px', color:'#777', marginTop:'1px'}}>Lv.{m.level} · 帮贡 {m.isLeader ? '---' : m.contribution}</div>
                        </div>
                        <div style={{display:'flex', gap:'3px'}}>
                          {(isMe ? party.slice(0,6) : m.team?.slice(0,6) || []).map((p, j) => {
                            const pm = isMe ? p : POKEDEX.find(x => x.id === p);
                            return pm ? <div key={j} style={{width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', border:'1px solid rgba(255,255,255,0.1)'}}>{renderAvatar(pm)}</div> : null;
                          })}
                        </div>
                        <span style={{fontSize:'10px', color:'#555', transform: viewMember===i ? 'rotate(180deg)' : 'none', transition:'transform 0.2s'}}>▼</span>
                      </div>
                      {viewMember === i && (
                        <div style={{marginTop:'8px', padding:'10px 12px', background:'rgba(0,0,0,0.2)', borderRadius:'8px'}}>
                          <div style={{fontSize:'10px', color:'#aaa', marginBottom:'8px', fontWeight:'600'}}>精灵阵容</div>
                          <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'8px'}}>
                            {(isMe ? party : (m.team || []).map(pid => { const base = POKEDEX.find(x => x.id === pid); return base ? createPet(base.id, Math.min(100, m.level || 50)) : null; }).filter(Boolean)).map((pet, j) => (
                              <div key={j} style={{textAlign:'center'}}>
                                <div style={{width:'48px', height:'48px', margin:'0 auto 4px', borderRadius:'10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px'}}>{renderAvatar(pet)}</div>
                                <div style={{fontSize:'9px', color:'#ccc', fontWeight:'600', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{pet.name}</div>
                                <div style={{fontSize:'9px', color:'#777'}}>Lv.{pet.level}</div>
                              </div>
                            ))}
                          </div>
                          {isMe && <div style={{fontSize:'9px', color:'#64B5F6', marginTop:'8px'}}>职位特权: {mRank?.privileges || '基础任务'}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          {gangTab === 'war' && renderGangWar()}
          {gangTab === 'skills' && renderGangSkills()}
          {gangTab === 'ranking' && renderGangRanking()}
          {gangTab === 'recruit' && renderGangRecruit()}
        </div>
      </div>
    );
  
}
