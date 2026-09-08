import React from 'react';
import { ANCIENT_BATTLEFIELDS } from '../../data';
import { BREATHING_PVE_STYLES } from '../../data';
import { BUILD_PRESETS } from '../../data';
import { calcChakraAffinity } from '../../data/naruto';
import { calcCrossSystemPveBonuses } from '../../data';
import { calcFusionPveBonuses } from '../../data';
import { CHAKRA_NATURE_MAP } from '../../data/naruto';
import { checkJutsuPetSynergy } from '../../data';
import { FRUIT_SEA_ZONES } from '../../data';
import { FUSION_PLAY_TEMPLATES } from '../../data';
import { FUSION_UNLOCK_SCHEDULE } from '../../data';
import { GENERAL_PVE_TACTICS } from '../../data';
import { getActiveNationalCalamities } from '../../data';
import { getCalamityWeekKey } from '../../data';
import { getUnlockedCrossSystems } from '../../data';
import { getUnlockedFusionSystems } from '../../data';
import { JUTSU_SECRET_REALMS } from '../../data';
import { KINGDOM_POSITIONS } from '../../data';
import { KINGDOM_PVE_TASKS } from '../../data';
import { mergePveBonuses } from '../../data';
import { PLAYER_STYLES } from '../../data';
import { SECT_SECRET_REALMS } from '../../data';

export default function FusionHubScreen({
  badges,
  completeKingdomPveTask,
  fusionHubOpen,
  fusionHubTab,
  fusionState,
  getLocalDateStr,
  narutoState,
  participateCalamity,
  party,
  selectBreathingStyle,
  selectGeneralTactic,
  selectKwPosition,
  selectPlayerStyle,
  setFusionHubOpen,
  setFusionHubTab,
  setFusionState,
  showMapToast,
  startFusionDungeon
}) {
    if (!fusionHubOpen) return null;
    const unlocked = getUnlockedFusionSystems(badges.length);
    const crossUnlocked = getUnlockedCrossSystems(badges.length);
    const tabs = [
      { id: 'overview', label: '总览', icon: '🏛️' },
      { id: 'style', label: '流派构筑', icon: '🧑' },
      { id: 'crossworld', label: '跨体系', icon: '🌍' },
      { id: 'jutsu', label: '忍术秘境', icon: '⛩️', need: 'jutsu_realm' },
      { id: 'fruit', label: '果实海域', icon: '🍎', need: 'fruit_sea' },
      { id: 'sect', label: '门派秘境', icon: '📜', need: 'sect_realm' },
      { id: 'battlefield', label: '古战场', icon: '⚔️', need: 'ancient_battlefield' },
      { id: 'calamity', label: '国土灵灾', icon: '🌊', need: 'national_calamity' },
      { id: 'kingdom', label: '国战任务', icon: '🏰', need: 'kingdom_pve' },
      { id: 'general', label: '将魂战术', icon: '🏇', need: 'general_tactic' },
    ];
    const today = getLocalDateStr();
    const activeCalamities = getActiveNationalCalamities(today, badges.length);
    const currentStyle = PLAYER_STYLES[fusionState.playerStyle?.main] || null;
    const currentSubStyle = PLAYER_STYLES[fusionState.playerStyle?.sub] || null;
    const currentBreathing = BREATHING_PVE_STYLES[fusionState.playerStyle?.breathingStyle || 'water'];
    const currentKwPosition = KINGDOM_POSITIONS.find(p => p.id === fusionState.kwPosition);
    const _crossBonuses = calcCrossSystemPveBonuses({
      playerStyle: fusionState.playerStyle || {},
      kwPosition: fusionState.kwPosition,
    });
    const _chakraAffHub = calcChakraAffinity(narutoState?.jutsuMastery);
    const _jutsuSynergyHub = _chakraAffHub ? checkJutsuPetSynergy(party, CHAKRA_NATURE_MAP[_chakraAffHub]?.gameType) : null;
    const currentBonuses = mergePveBonuses(
      calcFusionPveBonuses({ sectId: party[0]?.sectId, generalTacticId: fusionState.generalTacticId, jutsuSynergy: _jutsuSynergyHub }),
      _crossBonuses
    );
    const unlockedLabels = FUSION_UNLOCK_SCHEDULE.filter(s => badges.length >= s.badges).map(s => s.label);
    const nextUnlock = FUSION_UNLOCK_SCHEDULE.find(s => badges.length < s.badges);
    const readableBonuses = [
      currentBonuses.purifyBonus ? { label: '净化效率', value: `+${currentBonuses.purifyBonus}%`, tone: '#7dd3fc' } : null,
      currentBonuses.protectBonus ? { label: '守护收益', value: `+${Math.round(currentBonuses.protectBonus * 100)}%`, tone: '#86efac' } : null,
      currentBonuses.captureBonus ? { label: '捕获辅助', value: `+${Math.round(currentBonuses.captureBonus * 100)}%`, tone: '#fbbf24' } : null,
      currentBonuses.bossMultReduce ? { label: 'Boss压制', value: `-${Math.round(currentBonuses.bossMultReduce * 100)}%`, tone: '#fca5a5' } : null,
      currentBonuses.escapeTurnReduce ? { label: '逃脱回合', value: `-${currentBonuses.escapeTurnReduce}`, tone: '#c4b5fd' } : null,
      currentBonuses.exploreSpeedBonus ? { label: '探索速度', value: `+${Math.round(currentBonuses.exploreSpeedBonus * 100)}%`, tone: '#67e8f9' } : null,
      currentBonuses.skipPuzzleStep ? { label: '解谜跳过', value: '1次', tone: '#ddd6fe' } : null,
      currentBonuses.skipExploreStep ? { label: '探索跳过', value: '1次', tone: '#bae6fd' } : null,
      currentBonuses.puzzleHintBonus ? { label: '机关提示', value: '开启', tone: '#fde68a' } : null,
      currentBonuses.swarmDamageBonus ? { label: '群战伤害', value: `+${Math.round(currentBonuses.swarmDamageBonus * 100)}%`, tone: '#fb923c' } : null,
      currentBonuses.firstStepBonus ? { label: '首步加成', value: `+${Math.round(currentBonuses.firstStepBonus * 100)}%`, tone: '#f472b6' } : null,
      currentBonuses.intimacyBonus ? { label: '亲密度加成', value: `+${currentBonuses.intimacyBonus}`, tone: '#f9a8d4' } : null,
    ].filter(Boolean);
    const applyBuildPreset = (preset) => {
      const advancedLocked = ['insect', 'mist', 'sun', 'moon'].includes(preset.breathing) && !(fusionState.crisisUnlocks || []).includes('breathing_unlock');
      const kwLocked = !!preset.kwPosition && !crossUnlocked.includes('kw_positions');
      const generalLocked = !!preset.general && !unlocked.includes('general_tactic');
      setFusionState(prev => ({
        ...prev,
        playerStyle: {
          ...(prev.playerStyle || {}),
          main: preset.main,
          sub: preset.sub || null,
          breathingStyle: advancedLocked ? (prev.playerStyle?.breathingStyle || 'water') : preset.breathing,
        },
        kwPosition: kwLocked ? prev.kwPosition : (preset.kwPosition || prev.kwPosition),
        generalTacticId: generalLocked ? prev.generalTacticId : (preset.general || prev.generalTacticId),
      }));
      const lockNotes = [
        advancedLocked ? '高级呼吸法未解锁' : null,
        kwLocked ? '国战职位未解锁' : null,
        generalLocked ? '将魂战术未解锁' : null,
      ].filter(Boolean);
      showMapToast(preset.icon || '🧭', '构筑方案', `已套用 ${preset.name}${lockNotes.length ? `（${lockNotes.join('，')}，已保留当前设置）` : ''}`, 2600);
    };
    const fusionAccentByType = {
      jutsu: '#8b5cf6',
      fruit: '#ef4444',
      sect: '#f59e0b',
      battlefield: '#60a5fa',
    };
    const stepTypeText = {
      puzzle: '解谜',
      battle: '战斗',
      boss: '首领',
      explore: '探索',
      soothe: '安抚',
    };
    const rewardText = (reward = {}) => {
      const parts = [];
      const itemNameMap = { great:'高级精灵球', ultra:'超级精灵球', master:'大师球', fire_stone:'火之石', water_stone:'水之石', thunder_stone:'雷之石', leaf_stone:'叶之石', moon_stone:'月之石', sun_stone:'日之石', ice_stone:'冰之石', dawn_stone:'觉醒之石', dusk_stone:'暗之石', shiny_stone:'光之石' };
      if (reward.gold) parts.push(`${reward.gold.toLocaleString()} 金`);
      if (reward.item) parts.push(`${itemNameMap[reward.item] || reward.item} x${reward.itemCount || 1}`);
      if (reward.jutsuMastery) parts.push(`忍术熟练 +${reward.jutsuMastery}（优先补足低熟练忍术）`);
      if (reward.title) parts.push(`称号「${reward.title}」`);
      return parts.length ? parts.join(' · ') : '特殊资源';
    };
    const renderLockedFusionPanel = ({ icon, title, need, desc }) => (
      <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'18px', textAlign:'center'}}>
        <div style={{fontSize:'34px', marginBottom:'8px'}}>{icon}</div>
        <div style={{fontSize:'15px', fontWeight:'900', color:'#fff'}}>{title}</div>
        <div style={{fontSize:'11px', color:'rgba(255,255,255,0.55)', marginTop:'6px', lineHeight:1.55}}>{desc}</div>
        <div style={{display:'inline-flex', marginTop:'12px', padding:'6px 11px', borderRadius:'999px', background:'rgba(255,255,255,0.08)', color:'#c4b5fd', fontSize:'11px', fontWeight:'900'}}>需要 {need} 枚徽章</div>
      </div>
    );
    const renderDungeonCard = (def, type, clearedKey) => {
      const cleared = (fusionState[clearedKey] || []).includes(def.id);
      const locked = badges.length < def.reqBadges;
      const accent = fusionAccentByType[type] || '#8b5cf6';
      const steps = def.steps || [];
      return (
        <div key={def.id} style={{background:`linear-gradient(160deg, ${accent}16, rgba(255,255,255,0.035))`, border:`1px solid ${cleared ? '#86efac66' : locked ? 'rgba(255,255,255,0.07)' : `${accent}44`}`, borderRadius:'15px', padding:'13px', minHeight:'190px', display:'flex', flexDirection:'column'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px'}}>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:'900', fontSize:'14px', color:'#fff'}}>{def.icon} {def.name}</div>
              <div style={{fontSize:'10px', color:accent, fontWeight:'900', marginTop:'4px'}}>需要 {def.reqBadges} 徽章 · 地图 #{def.mapId || '-'}</div>
            </div>
            <span style={{fontSize:'10px', padding:'4px 8px', borderRadius:'999px', background: cleared ? 'rgba(34,197,94,0.14)' : locked ? 'rgba(255,255,255,0.06)' : `${accent}20`, color: cleared ? '#86efac' : locked ? 'rgba(255,255,255,0.45)' : '#fff', fontWeight:'900', flexShrink:0}}>
              {cleared ? '已通关' : locked ? '未解锁' : '可挑战'}
            </span>
          </div>
          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.62)', marginTop:'8px', lineHeight:1.55}}>{def.summary}</div>
          <div style={{display:'flex', flexWrap:'wrap', gap:'5px', marginTop:'9px'}}>
            {(def.mechanics || []).slice(0, 4).map(m => (
              <span key={m} style={{fontSize:'9px', padding:'3px 7px', borderRadius:'999px', background:'rgba(255,255,255,0.07)', color:'#cbd5e1'}}>{({'seal_pillars':'封印柱','element_sequence':'属性序列','momentum_battle':'气势战','escort_vip':'护送','multi_path':'多路线','darkness':'黑暗','timed_waves':'限时波','puzzle':'解谜','stealth':'潜行','boss_rush':'连战','survival':'生存','trap_maze':'陷阱迷宫','formation':'阵法','wind_pressure':'风压','qi_flow':'气脉','balance':'均衡','meditation':'冥想','speed_run':'竞速','defense':'防御','endurance':'耐力','perception_hint':'感知提示','fruit_seal_boss':'果实封印首领','stealth_route':'潜行路线','clone_puzzle':'分身解谜','chakra_nodes':'查克拉节点','chakra_restore':'查克拉恢复','heal_jutsu_trial':'医疗忍术试炼','water_restriction':'水域限制','fruit_trial':'果实试炼','fruit_copy_boss':'果实复制首领','storm_field':'风暴场','fruit_lightning':'果实雷击','island_hop':'跳岛','ice_restriction':'冰域限制','frozen_fruit':'冰封果实','heat_puzzle':'热力解谜','gravity_field':'重力场','heavy_advantage':'重量优势','fruit_gravity_contest':'重力果实挑战'}[m] || m)}</span>
            ))}
          </div>
          {steps.length > 0 && (
            <div style={{display:'grid', gridTemplateColumns:`repeat(${Math.min(3, steps.length)}, minmax(0, 1fr))`, gap:'6px', marginTop:'10px'}}>
              {steps.slice(0, 3).map((step, idx) => (
                <div key={`${def.id}_${idx}`} style={{background:'rgba(0,0,0,0.22)', borderRadius:'9px', padding:'7px'}}>
                  <div style={{fontSize:'9px', color:accent, fontWeight:'900'}}>{stepTypeText[step.type] || step.type || '阶段'} {idx + 1}</div>
                  <div style={{fontSize:'10px', color:'#fff', fontWeight:'800', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{step.title || step.enemyName || '试炼'}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.48)', lineHeight:1.45, marginTop:'10px'}}>奖励：{rewardText(def.reward)}</div>
          <div style={{marginTop:'auto', paddingTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px'}}>
            <div style={{fontSize:'10px', color:'rgba(255,255,255,0.42)'}}>
              {locked ? `还差 ${Math.max(0, def.reqBadges - badges.length)} 枚徽章` : cleared ? '可作为路线完成记录' : '适合检验当前构筑'}
            </div>
            {cleared ? <span style={{fontSize:'11px', color:'#86efac', fontWeight:'900'}}>完成</span>
              : locked ? <span style={{fontSize:'11px', color:'rgba(255,255,255,0.32)', fontWeight:'900'}}>锁定</span>
              : <button onClick={() => startFusionDungeon(type, def.id)} style={{padding:'7px 12px', borderRadius:'10px', border:'none', background:`linear-gradient(135deg, ${accent}, #4c1d95)`, color:'#fff', fontSize:'11px', fontWeight:'900', cursor:'pointer', flexShrink:0}}>挑战</button>}
          </div>
        </div>
      );
    };
    const renderDungeonSection = ({ icon, title, desc, advice, items, type, clearedKey, need, lockedDesc }) => {
      const locked = !unlocked.includes(type === 'jutsu' ? 'jutsu_realm' : type === 'fruit' ? 'fruit_sea' : type === 'sect' ? 'sect_realm' : 'ancient_battlefield');
      const clearedCount = (fusionState[clearedKey] || []).length;
      const accent = fusionAccentByType[type] || '#8b5cf6';
      if (locked) return renderLockedFusionPanel({ icon, title, need, desc: lockedDesc || desc });
      return (
        <div>
          <div style={{background:`linear-gradient(135deg, ${accent}22, rgba(255,255,255,0.04))`, border:`1px solid ${accent}40`, borderRadius:'16px', padding:'14px', marginBottom:'12px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px'}}>
              <div>
                <div style={{fontSize:'16px', color:'#fff', fontWeight:'900'}}>{icon} {title}</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.62)', lineHeight:1.55, marginTop:'5px'}}>{desc}</div>
              </div>
              <div style={{textAlign:'right', flexShrink:0}}>
                <div style={{fontSize:'18px', color:'#fff', fontWeight:'900'}}>{clearedCount}/{items.length}</div>
                <div style={{fontSize:'10px', color:'rgba(255,255,255,0.45)'}}>完成</div>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'7px', marginTop:'12px'}}>
              {advice.map(a => (
                <div key={a.label} style={{background:'rgba(0,0,0,0.22)', borderRadius:'10px', padding:'8px'}}>
                  <div style={{fontSize:'10px', color:accent, fontWeight:'900'}}>{a.label}</div>
                  <div style={{fontSize:'10px', color:'rgba(255,255,255,0.62)', marginTop:'3px', lineHeight:1.35}}>{a.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(230px, 1fr))', gap:'10px'}}>
            {items.map(r => renderDungeonCard(r, type, clearedKey))}
          </div>
        </div>
      );
    };
    return (
      <div className="modal-overlay" onClick={() => setFusionHubOpen(false)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2600}}>
        <div onClick={e => e.stopPropagation()} style={{width:'min(760px,95vw)', maxHeight:'88vh', background:'linear-gradient(180deg,#17102d,#0e0a1d 62%,#090713)', borderRadius:'20px', border:'1px solid rgba(167,139,250,0.35)', display:'flex', flexDirection:'column', overflow:'hidden', color:'#fff', boxShadow:'0 24px 80px rgba(0,0,0,0.55)'}}>
          <div style={{padding:'18px 20px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'linear-gradient(135deg, rgba(124,58,237,0.24), rgba(15,23,42,0.1))'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontSize:'20px', fontWeight:'900', color:'#ede9fe'}}>🔴 训练家战术室</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.58)', marginTop:'4px'}}>围绕精灵队伍配置跨体系 PVE 构筑：忍术、果实、门派、名将与国战都服务于伙伴养成。</div>
              </div>
              <button onClick={() => setFusionHubOpen(false)} style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.12)', color:'#fff', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'18px'}}>×</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(128px, 1fr))', gap:'8px', marginTop:'14px'}}>
              {[
                { label:'主修', value: currentStyle ? `${currentStyle.icon} ${currentStyle.name}` : '未选择' },
                { label:'副修', value: currentSubStyle ? `${currentSubStyle.icon} ${currentSubStyle.name}` : '可选' },
                { label:'呼吸法', value: currentBreathing ? `${currentBreathing.icon} ${currentBreathing.name}` : '未选择' },
                { label:'国战职位', value: currentKwPosition ? `${currentKwPosition.icon} ${currentKwPosition.name}` : '未设置' },
              ].map(item => (
                <div key={item.label} style={{background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'9px 10px'}}>
                  <div style={{fontSize:'10px', color:'rgba(255,255,255,0.45)', fontWeight:'700'}}>{item.label}</div>
                  <div style={{fontSize:'12px', color:'#fff', fontWeight:'900', marginTop:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:'7px', marginTop:'12px'}}>
              {tabs.map(t => {
                const locked = t.need && !unlocked.includes(t.need);
                return (
                  <button key={t.id} onClick={() => setFusionHubTab(t.id)} style={{
                    padding:'7px 11px', borderRadius:'10px', border:'1px solid '+(fusionHubTab === t.id ? 'rgba(196,181,253,0.5)' : 'rgba(255,255,255,0.08)'), cursor:'pointer', fontSize:'11px', fontWeight:'800',
                    background: fusionHubTab === t.id ? 'rgba(167,139,250,0.34)' : 'rgba(255,255,255,0.06)',
                    color: locked ? 'rgba(255,255,255,0.45)' : fusionHubTab === t.id ? '#fff' : 'rgba(255,255,255,0.62)',
                    opacity: locked ? 0.72 : 1,
                  }}>{t.icon} {t.label}{locked ? ' 🔒' : ''}</button>
                );
              })}
            </div>
          </div>
          <div style={{padding:'14px 18px', overflowY:'auto', flex:1}}>
            {fusionHubTab === 'overview' && (
              <div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'10px', marginBottom:'12px'}}>
                  <div style={{background:'linear-gradient(135deg, rgba(34,211,238,0.16), rgba(124,58,237,0.12))', border:'1px solid rgba(125,211,252,0.26)', borderRadius:'14px', padding:'13px'}}>
                    <div style={{fontSize:'11px', color:'#7dd3fc', fontWeight:'900'}}>这页的作用</div>
                    <div style={{fontSize:'15px', color:'#fff', fontWeight:'900', marginTop:'5px'}}>配置 PVE 解法</div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.62)', lineHeight:1.55, marginTop:'5px'}}>选择主修、副修、呼吸法和职位，影响净化、守护、Boss压制、探索与国战任务效率。</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'13px'}}>
                    <div style={{fontSize:'11px', color:'#c4b5fd', fontWeight:'900'}}>当前进度</div>
                    <div style={{fontSize:'15px', color:'#fff', fontWeight:'900', marginTop:'5px'}}>{badges.length} 枚徽章</div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.58)', lineHeight:1.55, marginTop:'5px'}}>
                      {nextUnlock ? `下一阶段：${nextUnlock.badges} 徽章解锁「${nextUnlock.label}」` : '训练家战术室已进入完整阶段'}
                    </div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'13px'}}>
                    <div style={{fontSize:'11px', color:'#86efac', fontWeight:'900'}}>当前收益</div>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'8px'}}>
                      {readableBonuses.length ? readableBonuses.map(b => (
                        <span key={b.label} style={{fontSize:'10px', padding:'4px 8px', borderRadius:'999px', background:`${b.tone}18`, color:b.tone, border:`1px solid ${b.tone}30`, fontWeight:'800'}}>{b.label} {b.value}</span>
                      )) : <span style={{fontSize:'11px', color:'rgba(255,255,255,0.55)'}}>先到「流派构筑」选择路线</span>}
                    </div>
                  </div>
                </div>
                <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'13px', marginBottom:'12px'}}>
                  <div style={{fontSize:'12px', color:'#fff', fontWeight:'900', marginBottom:'9px'}}>已解锁内容</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'7px'}}>
                    {(unlockedLabels.length ? unlockedLabels : ['精灵生态基础']).map(label => (
                      <span key={label} style={{fontSize:'10px', padding:'5px 9px', borderRadius:'999px', background:'rgba(167,139,250,0.16)', color:'#ddd6fe', border:'1px solid rgba(167,139,250,0.26)', fontWeight:'800'}}>{label}</span>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:'10px'}}>
                  {[
                    { icon:'🧭', title:'先选路线', desc:'在「流派构筑」确定主修和呼吸法，这是所有 PVE 加成的核心。', action:'去构筑', tab:'style' },
                    { icon:'🗺️', title:'再选玩法', desc:'秘境、海域、古战场和国战任务会用到不同解法。', action:'看跨体系', tab:'crossworld' },
                    { icon:'🎯', title:'最后补短板', desc:'缺净化选水/虫，缺守护选岩/武修，缺爆发选炎/剑士。', action:'套方案', tab:'crossworld' },
                  ].map(card => (
                    <button key={card.title} type="button" onClick={() => setFusionHubTab(card.tab)} style={{textAlign:'left', background:'rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'13px', color:'#fff', cursor:'pointer'}}>
                      <div style={{fontSize:'22px'}}>{card.icon}</div>
                      <div style={{fontSize:'13px', fontWeight:'900', marginTop:'5px'}}>{card.title}</div>
                      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.55)', lineHeight:1.5, marginTop:'4px'}}>{card.desc}</div>
                      <div style={{fontSize:'10px', color:'#c4b5fd', fontWeight:'900', marginTop:'9px'}}>{card.action}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {fusionHubTab === 'style' && (
              <div>
                <div style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'14px', padding:'12px', marginBottom:'12px'}}>
                  <div style={{fontSize:'13px', color:'#fff', fontWeight:'900'}}>构筑会影响什么？</div>
                  <div style={{fontSize:'11px', color:'rgba(255,255,255,0.58)', lineHeight:1.6, marginTop:'5px'}}>主修决定解题方向，副修补短板；呼吸法和国战职位提供轻量 PVE 加成，不直接改战斗面板。</div>
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', margin:'0 0 8px'}}>推荐流派模板</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'8px', marginBottom:'14px'}}>
                  {BUILD_PRESETS.map(p => {
                    const active = fusionState.playerStyle?.main === p.main
                      && (fusionState.playerStyle?.sub || null) === (p.sub || null)
                      && fusionState.playerStyle?.breathingStyle === p.breathing
                      && (!p.kwPosition || fusionState.kwPosition === p.kwPosition)
                      && (!p.general || fusionState.generalTacticId === p.general);
                    const advancedLocked = ['insect', 'mist', 'sun', 'moon'].includes(p.breathing) && !(fusionState.crisisUnlocks || []).includes('breathing_unlock');
                    const kwLocked = !!p.kwPosition && !crossUnlocked.includes('kw_positions');
                    const generalLocked = !!p.general && !unlocked.includes('general_tactic');
                    const hasLockedLayer = advancedLocked || kwLocked || generalLocked;
                    return (
                      <button key={p.id} type="button" onClick={() => applyBuildPreset(p)} style={{
                        textAlign:'left', padding:'10px', borderRadius:'12px', color:'#fff', cursor:'pointer',
                        background: active ? 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(167,139,250,0.16))' : 'rgba(255,255,255,0.04)',
                        border: active ? '1px solid rgba(134,239,172,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{display:'flex', justifyContent:'space-between', gap:'8px', alignItems:'center'}}>
                          <span style={{fontSize:'12px', fontWeight:'900'}}>{p.icon} {p.name}</span>
                          <span style={{fontSize:'9px', color: hasLockedLayer ? '#fbbf24' : active ? '#86efac' : '#c4b5fd', fontWeight:'900'}}>{hasLockedLayer ? '部分未解锁' : p.difficulty || '构筑'}</span>
                        </div>
                        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.55)', lineHeight:1.45, marginTop:'5px'}}>{p.note}</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px'}}>
                          <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(167,139,250,0.14)', color:'#ddd6fe'}}>{PLAYER_STYLES[p.main]?.name || p.main}</span>
                          {p.sub && <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(255,255,255,0.07)', color:'#cbd5e1'}}>副修 {PLAYER_STYLES[p.sub]?.name || p.sub}</span>}
                          <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(79,195,247,0.12)', color:'#bae6fd'}}>{BREATHING_PVE_STYLES[p.breathing]?.name || p.breathing}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', margin:'0 0 8px'}}>1. 主修流派</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'9px', marginBottom:'14px'}}>
                  {Object.values(PLAYER_STYLES).map(s => {
                    const active = fusionState.playerStyle?.main === s.id;
                    return (
                      <button key={s.id} type="button" onClick={() => selectPlayerStyle(s.id, fusionState.playerStyle?.sub === s.id ? null : fusionState.playerStyle?.sub)} style={{
                        textAlign:'left', padding:'12px', borderRadius:'14px', cursor:'pointer', color:'#fff',
                        background: active ? 'linear-gradient(135deg, rgba(167,139,250,0.28), rgba(79,70,229,0.16))' : 'rgba(255,255,255,0.04)',
                        border: active ? '1px solid rgba(196,181,253,0.55)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                        <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
                          <span style={{fontWeight:'900', fontSize:'13px'}}>{s.icon} {s.name}</span>
                          {active && <span style={{fontSize:'10px', color:'#86efac', fontWeight:'900'}}>主修</span>}
                        </div>
                        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.55)', marginTop:'5px', lineHeight:1.45}}>{s.desc}</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px'}}>
                          {(s.pveFocus || []).map(f => <span key={f} style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(255,255,255,0.08)', color:'#cbd5e1'}}>{f}</span>)}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', margin:'0 0 8px'}}>2. 副修补强</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'7px', marginBottom:'14px'}}>
                  <button type="button" onClick={() => selectPlayerStyle(fusionState.playerStyle?.main || 'sect', null)} style={{padding:'7px 11px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', background: !fusionState.playerStyle?.sub ? 'rgba(167,139,250,0.24)' : 'rgba(255,255,255,0.05)', color:'#fff', fontSize:'11px', fontWeight:'800', cursor:'pointer'}}>不设副修</button>
                  {Object.values(PLAYER_STYLES).filter(s => s.id !== fusionState.playerStyle?.main).map(s => (
                    <button key={s.id} type="button" onClick={() => selectPlayerStyle(fusionState.playerStyle?.main || s.id, s.id)} style={{padding:'7px 11px', borderRadius:'10px', border:'1px solid '+(fusionState.playerStyle?.sub === s.id ? 'rgba(196,181,253,0.55)' : 'rgba(255,255,255,0.1)'), background: fusionState.playerStyle?.sub === s.id ? 'rgba(167,139,250,0.24)' : 'rgba(255,255,255,0.05)', color:'#fff', fontSize:'11px', fontWeight:'800', cursor:'pointer'}}>{s.icon} {s.name}</button>
                  ))}
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', margin:'0 0 8px'}}>3. 呼吸法 PVE 战术</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'8px'}}>
                {Object.values(BREATHING_PVE_STYLES).map(b => {
                  const advLocked = ['insect', 'mist', 'sun', 'moon'].includes(b.id) && !(fusionState.crisisUnlocks || []).includes('breathing_unlock');
                  return (
                  <button key={b.id} type="button" onClick={() => !advLocked && selectBreathingStyle(b.id)} style={{
                    textAlign:'left', padding:'10px', borderRadius:'12px', cursor: advLocked ? 'not-allowed' : 'pointer', fontSize:'11px', opacity: advLocked ? 0.45 : 1, color:'#fff',
                    background: fusionState.playerStyle?.breathingStyle === b.id ? 'rgba(79,195,247,0.15)' : 'rgba(255,255,255,0.03)',
                    border: fusionState.playerStyle?.breathingStyle === b.id ? '1px solid rgba(79,195,247,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{fontWeight:'900'}}>{b.icon} {b.name}{advLocked ? ' 🔒' : ''}</div>
                    <div style={{fontSize:'10px', color:'rgba(255,255,255,0.55)', marginTop:'4px'}}>
                      {b.passive?.purifyBonus ? `净化+${b.passive.purifyBonus}% ` : ''}
                      {b.passive?.protectBonus ? `守护+${Math.round(b.passive.protectBonus*100)}% ` : ''}
                      {b.passive?.captureBonus ? `捕获+${Math.round(b.passive.captureBonus*100)}% ` : ''}
                      {b.passive?.bossMultReduce ? `Boss压制-${Math.round(b.passive.bossMultReduce*100)}% ` : ''}
                      {b.passive?.exploreSpeedBonus ? `探索+${b.passive.exploreSpeedBonus} ` : ''}
                      {b.passive?.puzzleHintBonus ? '机关提示 ' : ''}
                      {advLocked ? '需鬼雾山完整净化' : ''}
                    </div>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'7px'}}>
                      {(b.bestFor || []).map(f => <span key={f} style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(79,195,247,0.12)', color:'#bae6fd'}}>{f}</span>)}
                    </div>
                  </button>
                  );
                })}
                </div>
                {crossUnlocked.includes('kw_positions') && (
                  <>
                    <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', margin:'14px 0 8px'}}>4. 国战职位偏好</div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:'7px'}}>
                    {KINGDOM_POSITIONS.map(p => (
                      <button key={p.id} type="button" onClick={() => selectKwPosition(p.id)} style={{
                        padding:'8px 10px', borderRadius:'10px', cursor:'pointer', fontSize:'11px', color:'#fff', fontWeight:'800',
                        border:'1px solid '+(fusionState.kwPosition === p.id ? 'rgba(255,213,79,0.45)' : 'rgba(255,255,255,0.08)'),
                        background: fusionState.kwPosition === p.id ? 'rgba(255,213,79,0.14)' : 'rgba(255,255,255,0.04)',
                      }}>{p.icon} {p.name}</button>
                    ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {fusionHubTab === 'crossworld' && (
              <div>
                <div style={{background:'linear-gradient(135deg, rgba(14,165,233,0.16), rgba(124,58,237,0.14))', border:'1px solid rgba(125,211,252,0.24)', borderRadius:'16px', padding:'14px', marginBottom:'12px'}}>
                  <div style={{fontSize:'16px', color:'#fff', fontWeight:'900'}}>🌍 跨体系作战台</div>
                  <div style={{fontSize:'11px', color:'rgba(255,255,255,0.62)', lineHeight:1.55, marginTop:'5px'}}>这里不是单独副本，而是给复杂玩法选“解题模板”：哪些系统一起用、适合什么事件、当前构筑该补什么。</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'7px', marginTop:'12px'}}>
                    {[
                      { label:'当前主轴', value: currentStyle ? currentStyle.name : '未设置' },
                      { label:'战术侧重', value: currentBreathing ? currentBreathing.name : '未设置' },
                      { label:'已解锁模板', value: `${FUSION_PLAY_TEMPLATES.length} 套` },
                      { label:'可套构筑', value: `${BUILD_PRESETS.length} 套` },
                    ].map(item => (
                      <div key={item.label} style={{background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'8px'}}>
                        <div style={{fontSize:'10px', color:'#7dd3fc', fontWeight:'900'}}>{item.label}</div>
                        <div style={{fontSize:'12px', color:'#fff', fontWeight:'900', marginTop:'3px'}}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', marginBottom:'8px'}}>玩法模板</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(210px, 1fr))', gap:'9px', marginBottom:'14px'}}>
                  {FUSION_PLAY_TEMPLATES.map(t => (
                    <div key={t.id} style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'13px', padding:'12px'}}>
                      <div style={{fontWeight:'900', color:'#fff'}}>{t.icon} {t.name}</div>
                      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.55)', marginTop:'5px', lineHeight:1.45}}>{t.summary}</div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px'}}>
                        {(t.systems || []).map(sys => <span key={sys} style={{fontSize:'9px', padding:'2px 6px', borderRadius:'999px', background:'rgba(255,255,255,0.07)', color:'#cbd5e1'}}>{sys}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:'12px', color:'#c4b5fd', fontWeight:'900', marginBottom:'8px'}}>一键推荐构筑</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'8px'}}>
                  {BUILD_PRESETS.map(p => (
                    <button key={p.id} type="button" onClick={() => applyBuildPreset(p)} style={{fontSize:'10px', textAlign:'left', padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', color:'#fff', cursor:'pointer'}}>
                      <div style={{fontSize:'12px', fontWeight:'900'}}>{p.icon} {p.name}</div>
                      <div style={{color:'rgba(255,255,255,0.55)', lineHeight:1.45, marginTop:'4px'}}>{p.note}</div>
                      <div style={{color:'#c4b5fd', marginTop:'7px', fontWeight:'900'}}>主修 {PLAYER_STYLES[p.main]?.name || p.main} · {p.sub ? `副修 ${PLAYER_STYLES[p.sub]?.name || p.sub} · ` : ''}{BREATHING_PVE_STYLES[p.breathing]?.name || p.breathing}</div>
                      <div style={{color:'rgba(255,255,255,0.36)', marginTop:'4px'}}>职位 {KINGDOM_POSITIONS.find(x => x.id === p.kwPosition)?.name || '可选'} · 将魂 {GENERAL_PVE_TACTICS[p.general]?.name || '可选'}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {fusionHubTab === 'jutsu' && renderDungeonSection({
              icon: '⛩️',
              title: '忍术秘境',
              desc: '偏解谜和封印的挑战线，产出忍术熟练、卷轴资源和特殊称号。适合忍者流或需要净化/潜入能力的构筑。',
              lockedDesc: '收集 3 枚徽章后开放。这里会开始引入封印柱、分身机关和查克拉节点。',
              need: 3,
              items: JUTSU_SECRET_REALMS,
              type: 'jutsu',
              clearedKey: 'jutsuRealmsCleared',
              advice: [
                { label:'推荐主修', value:'忍者流最稳，武修流可用高坦度硬过守卫战。' },
                { label:'准备方向', value:'带火/水/风、暗系或灵体标签精灵，能减少试错。' },
                { label:'收益用途', value:'提升忍术熟练，后续封印战和跨体系模板会用到。' },
              ],
            })}
            {fusionHubTab === 'fruit' && renderDungeonSection({
              icon: '🍎',
              title: '果实海域',
              desc: '围绕恶魔果实、海域规则和特殊状态的挑战线，适合给核心精灵补一套规则型能力。',
              lockedDesc: '收集 5 枚徽章后开放。果实海域会把精灵构筑和海域限制联系起来。',
              need: 5,
              items: FRUIT_SEA_ZONES,
              type: 'fruit',
              clearedKey: 'fruitTrialsCleared',
              advice: [
                { label:'推荐主修', value:'剑士流打 Boss 更快，忍者流适合处理特殊机关。' },
                { label:'准备方向', value:'优先带主力精灵和解除异常的道具，注意海域限制。' },
                { label:'收益用途', value:'给精灵补规则能力，适合中后期构筑成型。' },
              ],
            })}
            {fusionHubTab === 'sect' && renderDungeonSection({
              icon: '📜',
              title: '门派秘境',
              desc: '围绕心法、门派立场和阵容共鸣的长期成长线。适合补防守、续航和持续作战能力。',
              lockedDesc: '收集 6 枚徽章后开放。建议先确定主修门派再进入秘境。',
              need: 6,
              items: SECT_SECRET_REALMS,
              type: 'sect',
              clearedKey: 'sectRealmsCleared',
              advice: [
                { label:'推荐主修', value:'武修流收益最高，副修可补忍术或呼吸法短板。' },
                { label:'准备方向', value:'带同门精灵，优先提升门派声望和心法层级。' },
                { label:'收益用途', value:'强化门派路线，影响后续国战和高压 PVE。' },
              ],
            })}
            {fusionHubTab === 'battlefield' && renderDungeonSection({
              icon: '⚔️',
              title: '三国古战场',
              desc: '偏战斗和国战联动的高压挑战线，适合检验队伍强度、将魂战术和攻防取舍。',
              lockedDesc: '收集 7 枚徽章后开放。这里会把战斗强度、名将和国战收益串起来。',
              need: 7,
              items: ANCIENT_BATTLEFIELDS,
              type: 'battlefield',
              clearedKey: 'battlefieldsCleared',
              advice: [
                { label:'推荐主修', value:'剑士流适合速攻，武修流适合守城和持久战。' },
                { label:'准备方向', value:'补好回复、克制属性和国战职位，避免高战损。' },
                { label:'收益用途', value:'推进将魂、古战场和国战贡献的中后期循环。' },
              ],
            })}
            {fusionHubTab === 'calamity' && unlocked.includes('national_calamity') && activeCalamities.map(cal => {
              const thisWeek = getCalamityWeekKey(getLocalDateStr());
              const done = (fusionState.calamitiesParticipated || []).includes(`${cal.id}_${thisWeek}`);
              return (
                <div key={cal.id} style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'12px', marginBottom:'10px'}}>
                  <div style={{fontWeight:'800', fontSize:'14px'}}>{cal.icon} {cal.name}</div>
                  <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)', marginTop:'4px'}}>{cal.summary}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'8px'}}>
                    <span style={{fontSize:'10px', color:'rgba(255,255,255,0.35)'}}>本周活跃 · 需 {cal.reqBadges} 徽章</span>
                    {done ? <span style={{color:'#81C784', fontSize:'11px'}}>已参与</span>
                      : badges.length >= cal.reqBadges ? <button onClick={() => participateCalamity(cal.id)} style={{padding:'6px 12px', borderRadius:'8px', border:'none', background:'#1565C0', color:'#fff', fontSize:'11px', cursor:'pointer'}}>参与净化</button>
                      : <span style={{color:'#888', fontSize:'11px'}}>🔒</span>}
                  </div>
                </div>
              );
            })}
            {fusionHubTab === 'calamity' && !unlocked.includes('national_calamity') && renderLockedFusionPanel({ icon:'🌊', title:'国土灵灾', need:8, desc:'当你获得 8 枚徽章后，国土灵灾将会开放。此玩法涉及大规模事件净化，需要跨体系协作。' })}
            {fusionHubTab === 'kingdom' && unlocked.includes('kingdom_pve') && KINGDOM_PVE_TASKS.map(task => {
              const done = (fusionState.kingdomTasksDone || []).includes(task.id);
              return (
                <div key={task.id} style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'12px', marginBottom:'10px'}}>
                  <div style={{fontWeight:'800', fontSize:'14px'}}>{task.icon} {task.name}</div>
                  <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'4px'}}>需 {task.reqBadges} 徽章 · 奖励 {task.reward?.gold || 0} 金 + 国战贡献</div>
                  <div style={{marginTop:'8px', textAlign:'right'}}>
                    {done ? <span style={{color:'#81C784', fontSize:'11px'}}>已完成</span>
                      : badges.length >= task.reqBadges ? <button onClick={() => completeKingdomPveTask(task.id)} style={{padding:'6px 12px', borderRadius:'8px', border:'none', background:'#2E7D32', color:'#fff', fontSize:'11px', cursor:'pointer'}}>完成</button>
                      : <span style={{color:'#888', fontSize:'11px'}}>🔒</span>}
                  </div>
                </div>
              );
            })}
            {fusionHubTab === 'kingdom' && !unlocked.includes('kingdom_pve') && renderLockedFusionPanel({ icon:'🏰', title:'国战任务', need:8, desc:'当你获得 8 枚徽章后，国战 PVE 任务将会开放。包含护送、进攻和防御等多种任务，产出国战贡献和资源。' })}
            {fusionHubTab === 'general' && unlocked.includes('general_tactic') && Object.values(GENERAL_PVE_TACTICS).map(gt => (
              <div key={gt.generalId} onClick={() => selectGeneralTactic(gt.generalId)} style={{
                background: fusionState.generalTacticId === gt.generalId ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                border: fusionState.generalTacticId === gt.generalId ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius:'12px', padding:'12px', marginBottom:'10px', cursor:'pointer'
              }}>
                <div style={{fontWeight:'800', fontSize:'14px'}}>{gt.icon} {gt.name} <span style={{fontSize:'10px', color:'rgba(255,255,255,0.4)'}}>· PVE战术</span></div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.55)', marginTop:'4px'}}>{gt.passive?.label} — {gt.passive?.desc}</div>
                <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'2px'}}>{gt.order?.label} · 适合：{(gt.bestFor || []).join('、')}</div>
              </div>
            ))}
            {fusionHubTab === 'general' && !unlocked.includes('general_tactic') && renderLockedFusionPanel({ icon:'🏇', title:'将魂战术', need:7, desc:'当你获得 7 枚徽章后，将魂战术将会开放。可以选择一位三国名将，获得独特的 PVE 战术加成。' })}
          </div>
        </div>
      </div>
    );
  
}
