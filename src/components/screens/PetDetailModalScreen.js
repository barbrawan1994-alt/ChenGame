import React from 'react';
import { ACCESSORY_DB } from '../../data/items';
import { BERRIES } from '../../data/items';
import { BOND_LEVELS } from '../../data/lycoris';
import { canAwakenPet } from '../../data/resonance';
import { checkAwakeningTier } from '../../data';
import { flushSync } from 'react-dom';
import { FRUIT_CATEGORY_NAMES } from '../../data/devilfruits';
import { FRUIT_RARITY_CONFIG } from '../../data/devilfruits';
import { getBondLevel } from '../../data/lycoris';
import { getCurseGrade } from '../../data/jujutsu';
import { getFruitById } from '../../data/devilfruits';
import { getPetAwakeningTier } from '../../data';
import { getSectUpgradeCost } from '../../data';
import { GROWTH_ITEMS } from '../../data/items';
import { inferPetTags } from '../../data';
import { NATURE_DB } from '../../data/traits';
import { PET_TAG_DEFS } from '../../data';
import { POKEDEX } from '../../data/pets';
import { renderFruitCSSIcon } from '../../components/ItemIcons';
import { SECT_DB } from '../../data';
import { TRAINING_MAX_EV } from '../../data';
import { TRAINING_TOTAL_MAX_EV } from '../../data';
import { TRAIT_DB } from '../../data/traits';
import { TYPE_BIAS } from '../../data/types';
import { TYPES } from '../../data/types';

export default function PetDetailModalScreen({
  advanceSectDaily,
  assignDevilFruitToPartyPet,
  awakenPet,
  badges,
  box,
  boxRef,
  calculateGrade,
  caughtDex,
  fruitInventory,
  fusionState,
  getActiveResonanceForPet,
  getAllOwnedPets,
  getFamilyTree,
  getStats,
  goldRef,
  inventory,
  inventoryActionLocksRef,
  inventoryRef,
  isPartnerSystemUnlocked,
  kingdomWar,
  openEquipModal,
  openRebirthUI,
  partnerModal,
  party,
  partyRef,
  removePartner,
  renderAvatar,
  sectActionLocksRef,
  sectPlayer,
  setAccessories,
  setBagTab,
  setBox,
  setFruitPickModal,
  setGold,
  setInventory,
  setPartner,
  setPartnerModal,
  setParty,
  setSkillInheritModal,
  setStatTooltip,
  setView,
  setViewStatPet,
  showMapToast,
  skillInheritModal,
  statTooltip,
  updateAchStat,
  upgradeAwakeningTier,
  useEther,
  useGrowthItem,
  viewStatPet
}) {
    if (!viewStatPet) return null;

    // [新增] 魅力评级颜色映射
    const CHARM_RANK_COLORS = {
        '万人迷': '#FF4081', // S级 - 亮粉
        '人气王': '#FFD700', // A级 - 金色
        '可爱鬼': '#2196F3', // B级 - 蓝色
        '呆萌':   '#8BC34A', // C级 - 绿色
        '凶萌':   '#9E9E9E'  // D级 - 灰色
    };

    // 属性、门派与评级颜色来自多套配置；浅色底统一改用深色字，避免白字失去对比度。
    const getReadableTextColor = (backgroundColor, dark = '#173042', light = '#fffaf0') => {
        const getLuminance = (color) => {
            if (typeof color !== 'string') return null;
            const hex = color.trim().replace('#', '');
            if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
            const channels = [0, 2, 4].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
            const [r, g, b] = channels.map(channel => channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4));
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const backgroundLuminance = getLuminance(backgroundColor);
        const darkLuminance = getLuminance(dark);
        const lightLuminance = getLuminance(light);
        if (backgroundLuminance == null || darkLuminance == null || lightLuminance == null) return light;
        const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        return contrast(backgroundLuminance, darkLuminance) >= contrast(backgroundLuminance, lightLuminance) ? dark : light;
    };

    return (
        <div className="modal-overlay spirit-pet-detail-overlay" onClick={() => setViewStatPet(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="stat-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: '460px',
              maxHeight: '90vh', overflowY: 'auto',
              background: '#fff', borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            
            {/* 评级计算与头部 */}
            {(() => {
                const { grade, leftAvg, rightAvg } = calculateGrade(viewStatPet);
                const getGradeColor = (g) => {
                    if (g === 'S') return '#8A5A00';
                    if (g === 'A') return '#B42360';
                    if (g === 'B') return '#0B65A8';
                    return '#5D6870';
                };
                const gradeColor = getGradeColor(grade);
                const getScoreColor = (sc) => {
                    if (sc >= 80) return '#8A5A00';
                    if (sc >= 50) return '#B42360';
                    if (sc >= 30) return '#0B65A8';
                    return '#5D6870';
                };
                const getScoreLetter = (sc) => {
                    if (sc >= 80) return 'S';
                    if (sc >= 50) return 'A';
                    if (sc >= 30) return 'B';
                    return 'C';
                };

                return (
                <>
                {/* 1. 头部信息 */}
                <div className="pet-detail-header" style={{padding:'20px 20px 0', display:'flex', alignItems:'center', position:'relative'}}>
                    <div className="pet-grade-badge" aria-label={`综合评价 ${grade}`} style={{
                        position:'absolute', right:'16px', top:'10px', 
                        fontSize:'28px', fontWeight:'900', color: gradeColor,
                        border: `3px solid ${gradeColor}`, borderRadius:'50%', width:'44px', height:'44px',
                        display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-15deg)',
                        opacity: 0.85, zIndex: 10, background: '#fff', boxShadow:`0 2px 8px ${gradeColor}40`
                    }}>
                        {grade}
                    </div>

                    <div className="pet-detail-avatar" style={{fontSize:'45px', borderRadius:'50%', width:'70px', height:'70px', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'15px', overflow:'hidden', padding:'5px', position:'relative',
                      background: viewStatPet.isFusedShiny ? 'linear-gradient(135deg, #F3E5F5, #CE93D8)' : viewStatPet.isShiny ? 'linear-gradient(135deg, #FFF8E1, #FFD54F)' : '#f5f5f5',
                      boxShadow: viewStatPet.isFusedShiny ? '0 0 12px rgba(213,0,249,0.4)' : viewStatPet.isShiny ? '0 0 12px rgba(255,215,0,0.4)' : 'none'
                    }}>
                        {renderAvatar(viewStatPet)}
                    </div>
                    <div className="pet-detail-identity">
                        <div className="pet-detail-name" style={{fontSize:'20px', fontWeight:'bold'}}>
                          {viewStatPet.name}
                          {viewStatPet.isFusedShiny ? (
                            <span style={{marginLeft:'6px', background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'10px', padding:'2px 8px', borderRadius:'8px', fontWeight:'bold', verticalAlign:'middle'}}>🧬 异色</span>
                          ) : viewStatPet.isShiny ? (
                            <span style={{marginLeft:'6px', background:'linear-gradient(135deg,#FFD700,#FF8F00)', color:'#3A2400', fontSize:'10px', padding:'2px 8px', borderRadius:'8px', fontWeight:'bold', verticalAlign:'middle'}}>✨ 闪光</span>
                          ) : null}
                          {viewStatPet.legacyCount > 0 && (
                            <span style={{marginLeft:'4px', background:'linear-gradient(135deg,#7c3aed,#a78bfa)', color:'#fff', fontSize:'9px', padding:'2px 6px', borderRadius:'6px', fontWeight:'bold', verticalAlign:'middle'}}>🎓 传承×{viewStatPet.legacyCount}</span>
                          )}
                          {viewStatPet.inheritedMove && (
                            <span style={{marginLeft:'4px', background:'linear-gradient(135deg,#6d28d9,#8b5cf6)', color:'#fff', fontSize:'9px', padding:'2px 6px', borderRadius:'6px', fontWeight:'bold', verticalAlign:'middle'}}>📖 继承技·{viewStatPet.inheritedMove}</span>
                          )}
                        </div>
                        <div className="pet-detail-meta" style={{display:'flex', gap:'6px', marginTop:'5px', flexWrap:'wrap'}}>
                        <span style={{background: TYPES[viewStatPet.type]?.color, color:getReadableTextColor(TYPES[viewStatPet.type]?.color), padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            {TYPES[viewStatPet.type]?.name}
                        </span>
                        {viewStatPet.secondaryType && <span style={{background: TYPES[viewStatPet.secondaryType]?.color, color:getReadableTextColor(TYPES[viewStatPet.secondaryType]?.color), padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            {TYPES[viewStatPet.secondaryType]?.name}
                        </span>}
                        <span style={{background:'#333', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            Lv.{viewStatPet.level}
                        </span>
                        
                        {(() => {
                          const nd = NATURE_DB[viewStatPet.nature||'docile'];
                          const statLabels = {p_atk:'物攻',p_def:'物防',s_atk:'特攻',s_def:'特防',spd:'速度',hp:'HP'};
                          const ups = nd.stats ? Object.entries(nd.stats).filter(([,v])=>v>1).map(([k])=>statLabels[k]||k) : [];
                          const downs = nd.stats ? Object.entries(nd.stats).filter(([,v])=>v<1).map(([k])=>statLabels[k]||k) : [];
                          return (
                            <span style={{border:'1px solid #ddd', color:'#666', padding:'1px 6px', borderRadius:'4px', fontSize:'10px'}}>
                              {nd.name}
                              {ups.length > 0 && <span style={{color:'#E53935',marginLeft:'4px',fontWeight:'bold'}}>↑{ups.join(',')}</span>}
                              {downs.length > 0 && <span style={{color:'#1565C0',marginLeft:'2px',fontWeight:'bold'}}>↓{downs.join(',')}</span>}
                            </span>
                          );
                        })()}
                        </div>
                    </div>
                    <button className="pet-detail-close" aria-label="关闭精灵详情" title="关闭" onClick={() => setViewStatPet(null)} style={{marginLeft:'auto', border:'none', background:'transparent', fontSize:'24px', color:'#fffaf0'}}>×</button>
                </div>
                {(() => {
                  const dexE = POKEDEX.find(p => p.id === viewStatPet.id);
                  const nextId = dexE?.evo;
                  const nextDex = nextId ? POKEDEX.find(p => p.id === nextId) : null;
                  if (!nextDex) return null;
                  const needLv = dexE?.evoLvl || 36;
                  return (
                    <div className="pet-detail-section pet-detail-evolution-note" style={{ margin: '0 20px 12px', padding: '10px 12px', background: '#E3F2FD', borderRadius: '10px', fontSize: '11px', color: '#1565C0', border: '1px solid #BBDEFB' }}>
                      <span style={{ fontWeight: '800' }}>⬆ 下一进化：</span> {nextDex.icon || '🐾'} {nextDex.name} · 需 Lv.{needLv}+
                      {(viewStatPet.level || 0) < needLv ? `（还差 ${needLv - (viewStatPet.level || 0)} 级）` : '（已满足等级，可进化）'}
                    </div>
                  );
                })()}

                {/* 1.5 属性克制信息 */}
                <div className="pet-detail-section pet-detail-matchups" style={{margin:'0 20px 10px', background:'#f9f9f9', borderRadius:'10px', padding:'10px 12px', border:'1px solid #eee'}}>
                  {(() => {
                    const chart = {
                      NORMAL:  { weak: ['ROCK', 'STEEL'], strong: [] },
                      FIRE:    { weak: ['WATER', 'ROCK', 'GROUND'], strong: ['GRASS', 'ICE', 'BUG', 'STEEL'] },
                      WATER:   { weak: ['GRASS', 'ELECTRIC'], strong: ['FIRE', 'GROUND', 'ROCK'] },
                      GRASS:   { weak: ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'], strong: ['WATER', 'GROUND', 'ROCK'] },
                      ELECTRIC:{ weak: ['GROUND'], strong: ['WATER', 'FLYING'] },
                      ICE:     { weak: ['FIRE', 'FIGHT', 'ROCK', 'STEEL', 'SOUND'], strong: ['GRASS', 'GROUND', 'FLYING', 'DRAGON', 'WIND'] },
                      FIGHT:   { weak: ['FLYING', 'PSYCHIC', 'FAIRY'], strong: ['NORMAL', 'ICE', 'ROCK', 'STEEL', 'DARK'] },
                      POISON:  { weak: ['GROUND', 'PSYCHIC'], strong: ['GRASS', 'FAIRY'] },
                      GROUND:  { weak: ['WATER', 'GRASS', 'ICE'], strong: ['FIRE', 'ELECTRIC', 'POISON', 'ROCK', 'STEEL', 'SOUND'] },
                      FLYING:  { weak: ['ELECTRIC', 'ICE', 'ROCK', 'COSMIC'], strong: ['GRASS', 'FIGHT', 'BUG'] },
                      PSYCHIC: { weak: ['BUG', 'GHOST', 'DARK', 'SOUND', 'COSMIC'], strong: ['FIGHT', 'POISON'] },
                      BUG:     { weak: ['FIRE', 'FLYING', 'ROCK'], strong: ['GRASS', 'PSYCHIC', 'DARK'] },
                      ROCK:    { weak: ['WATER', 'GRASS', 'FIGHT', 'GROUND', 'STEEL'], strong: ['FIRE', 'ICE', 'FLYING', 'BUG', 'SOUND'] },
                      GHOST:   { weak: ['DARK'], strong: ['PSYCHIC', 'GHOST', 'COSMIC', 'LIGHT', 'TIME'] },
                      DRAGON:  { weak: ['ICE', 'DRAGON', 'FAIRY', 'COSMIC'], strong: ['DRAGON'] },
                      DARK:    { weak: ['FIGHT', 'BUG', 'FAIRY'], strong: ['PSYCHIC', 'GHOST', 'COSMIC', 'LIGHT', 'TIME'] },
                      STEEL:   { weak: ['FIRE', 'FIGHT', 'GROUND'], strong: ['ICE', 'ROCK', 'FAIRY', 'SOUND', 'COSMIC'] },
                      FAIRY:   { weak: ['POISON', 'STEEL', 'SOUND'], strong: ['FIGHT', 'DRAGON', 'DARK', 'CHAOS'] },
                      WIND:    { weak: ['ICE', 'ROCK', 'ELECTRIC'], strong: ['GRASS', 'BUG', 'FIGHT', 'GROUND'] },
                      LIGHT:   { weak: ['STEEL'], strong: ['DARK', 'GHOST', 'POISON', 'BUG', 'CHAOS'] },
                      COSMIC:  { weak: ['DARK', 'GHOST', 'STEEL'], strong: ['DRAGON', 'PSYCHIC', 'FLYING', 'POISON'] },
                      SOUND:   { weak: ['GROUND', 'STEEL', 'ROCK'], strong: ['ICE', 'FAIRY', 'PSYCHIC', 'GHOST', 'BUG'] },
                      GOD:     { weak: ['GOD'], strong: ['DRAGON', 'DARK', 'GHOST', 'PSYCHIC', 'FAIRY'] },
                      HEAL:    { weak: ['POISON', 'DARK', 'GHOST'], strong: ['FIGHT', 'DRAGON', 'BUG'] },
                      TIME:    { weak: ['DARK', 'GHOST'], strong: ['DRAGON', 'PSYCHIC', 'GROUND', 'ICE', 'CHAOS'] },
                      CHAOS:   { weak: ['FAIRY', 'LIGHT'], strong: ['PSYCHIC', 'COSMIC', 'NORMAL', 'STEEL', 'TIME'] },
                    };
                    const t1 = viewStatPet.type;
                    const t2 = viewStatPet.secondaryType;
                    const info1 = chart[t1] || { weak: [], strong: [] };
                    const info2 = t2 ? (chart[t2] || { weak: [], strong: [] }) : null;

                    const weakTo = new Set([...(info1.weak || []), ...(info2 ? info2.weak : [])]);
                    const strongAgainst = new Set();
                    const allTypes = Object.keys(chart);
                    allTypes.forEach(atkType => {
                      const ai = chart[atkType];
                      if (!ai) return;
                      let mod = 1.0;
                      if (ai.strong && ai.strong.includes(t1)) mod *= 1.5;
                      if (ai.weak && ai.weak.includes(t1)) mod *= 0.8;
                      if (t2) {
                        if (ai.strong && ai.strong.includes(t2)) mod *= 1.5;
                        if (ai.weak && ai.weak.includes(t2)) mod *= 0.8;
                      }
                      if (mod > 1.2) weakTo.add(atkType);
                    });

                    allTypes.forEach(defType => {
                      let mod = 1.0;
                      if (info1.strong && info1.strong.includes(defType)) mod *= 1.5;
                      if (info1.weak && info1.weak.includes(defType)) mod *= 0.8;
                      if (info2) {
                        if (info2.strong && info2.strong.includes(defType)) mod *= 1.5;
                        if (info2.weak && info2.weak.includes(defType)) mod *= 0.8;
                      }
                      if (mod > 1.2) strongAgainst.add(defType);
                    });

                    const resistTo = new Set();
                    allTypes.forEach(atkType => {
                      const ai = chart[atkType];
                      if (!ai) return;
                      let mod = 1.0;
                      if (ai.strong && ai.strong.includes(t1)) mod *= 1.5;
                      if (ai.weak && ai.weak.includes(t1)) mod *= 0.8;
                      if (t2) {
                        if (ai.strong && ai.strong.includes(t2)) mod *= 1.5;
                        if (ai.weak && ai.weak.includes(t2)) mod *= 0.8;
                      }
                      if (mod < 0.9) resistTo.add(atkType);
                    });

                    const renderTypePills = (types, style) => [...types].filter(tt => TYPES[tt]).map(tt => (
                      <span key={tt} style={{
                        background: TYPES[tt]?.color, color:getReadableTextColor(TYPES[tt]?.color), padding:'1px 6px',
                        borderRadius:'4px', fontSize:'9px', fontWeight:'bold', ...style
                      }}>{TYPES[tt]?.name}</span>
                    ));

                    return (
                      <div>
                        <div style={{fontSize:'11px', fontWeight:'bold', color:'#555', marginBottom:'6px', display:'flex', alignItems:'center', gap:'4px'}}>
                          ⚔️ 属性克制 {t2 && <span style={{fontSize:'9px', color:'#596875', fontWeight:'normal'}}>({TYPES[t1]?.name}+{TYPES[t2]?.name} 双属性综合)</span>}
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                          <div style={{display:'flex', alignItems:'flex-start', gap:'6px'}}>
                            <span style={{fontSize:'10px', color:'#E53935', minWidth:'50px', fontWeight:'bold', flexShrink:0}}>⬆️ 克制</span>
                            <div style={{display:'flex', gap:'3px', flexWrap:'wrap'}}>
                              {strongAgainst.size > 0 ? renderTypePills(strongAgainst) : <span style={{fontSize:'9px', color:'#596875'}}>无特殊克制</span>}
                            </div>
                          </div>
                          <div style={{display:'flex', alignItems:'flex-start', gap:'6px'}}>
                            <span style={{fontSize:'10px', color:'#1E88E5', minWidth:'50px', fontWeight:'bold', flexShrink:0}}>⬇️ 弱点</span>
                            <div style={{display:'flex', gap:'3px', flexWrap:'wrap'}}>
                              {weakTo.size > 0 ? renderTypePills(weakTo) : <span style={{fontSize:'9px', color:'#596875'}}>无明显弱点</span>}
                            </div>
                          </div>
                          <div style={{display:'flex', alignItems:'flex-start', gap:'6px'}}>
                            <span style={{fontSize:'10px', color:'#43A047', minWidth:'50px', fontWeight:'bold', flexShrink:0}}>🛡️ 抵抗</span>
                            <div style={{display:'flex', gap:'3px', flexWrap:'wrap'}}>
                              {resistTo.size > 0 ? renderTypePills(resistTo) : <span style={{fontSize:'9px', color:'#596875'}}>无特殊抵抗</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. 属性对比区域 */}
                <div className="pet-detail-stats" style={{padding:'20px'}}>
                    <div className="pet-detail-stats-head" style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'12px', fontWeight:'bold', color:'#555'}}>
                        
                        {/* --- 左侧：当前能力 --- */}
                        <div className="pet-detail-score-card"
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('current_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>当前能力</span>
                            <span style={{color: getScoreColor(leftAvg)}}>{getScoreLetter(leftAvg)}</span>
                            
                            {statTooltip === 'current_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', left: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '11px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#FFD76A', marginBottom:'2px'}}>当前属性 / 理论极限</div>
                                    <div style={{color:'#E4EAF0', lineHeight:'1.4'}}>反映该精灵在当前等级下的战斗力水平。</div>
                                </div>
                            )}
                        </div>

                        {/* --- 右侧：成长潜力 --- */}
                        <div className="pet-detail-score-card"
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('potential_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>成长潜力</span>
                            <span style={{color: getScoreColor(rightAvg)}}>{getScoreLetter(rightAvg)}</span>

                            {statTooltip === 'potential_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', right: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '11px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#00E676', marginBottom:'2px'}}>每级成长值</div>
                                    <div style={{color:'#E4EAF0', lineHeight:'1.4'}}>每升1级各项属性加成；数值越高成长越好。</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        {(() => {
                        const currentStats = getStats(viewStatPet);
                        const nextLvlPet = { ...viewStatPet, level: viewStatPet.level + 1 };
                        const nextStats = getStats(nextLvlPet);
                        const baseInfo = POKEDEX.find(p => p.id === viewStatPet.id) || POKEDEX[0];
                        const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                        const diversity = (baseInfo.id % 5) * 2 - 4;
                        const growth = 1 + Math.min(2.5, Math.pow(viewStatPet.level / 100, 0.7) * 3.5);

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
                            maxStat = Math.floor(maxStat * 1.2); 
                            
                            const leftPct = Math.min(100, (currVal / maxStat) * 100);
                            const growthVal = nextStats[cfg.k] - currentStats[cfg.k];
                            let baseGrowthFactor = (getBase(key) + 31) * 0.05; 
                            if (key === 'hp') baseGrowthFactor *= 2.5;
                            const maxGrowth = Math.ceil(baseGrowthFactor * 1.55); 
                            const rightPct = Math.min(100, (growthVal / maxGrowth) * 100);

                            const getBarColor = (pct) => {
                                if (pct >= 80) return '#FFD700';
                                if (pct >= 50) return '#FF4081';
                                if (pct >= 30) return '#2196F3';
                                return '#BDBDBD';
                            };

                            return (
                            <div className="pet-detail-stat-row" key={cfg.k} style={{display:'flex', alignItems:'center', height:'28px', background:'#f9f9f9', borderRadius:'6px', padding:'0 8px'}}>
                                <div style={{flex:1, display:'flex', alignItems:'center', borderRight:'1px solid #eee', paddingRight:'8px'}}>
                                    <div style={{fontSize:'10px', color:'#666', width:'24px'}}>{cfg.n}</div>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${leftPct}%`, background: getBarColor(leftPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right'}}>{currVal}</div>
                                </div>
                                <div style={{flex:1, display:'flex', alignItems:'center', paddingLeft:'8px'}}>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${rightPct}%`, background: getBarColor(rightPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right', color: rightPct>=80 ? '#E65100' : '#666'}}>
                                        +{growthVal}
                                    </div>
                                </div>
                            </div>
                            );
                        });
                        })()}
                    </div>
                    {/* 个体值 (IV) 网格 */}
                    {viewStatPet.ivs && (
                      <div className="pet-detail-iv-card" style={{marginTop:'8px', padding:'8px', background:'#f5f0ff', borderRadius:'8px', border:'1px solid #d0c0f0'}}>
                        <div style={{fontSize:'10px', color:'#7B1FA2', fontWeight:'bold', marginBottom:'6px'}}>
                          个体值 (IV) — 总计 {(() => { const vs = viewStatPet.ivs; const mainKeys = ['maxHp','hp','p_atk','p_def','s_atk','s_def','spd']; return mainKeys.reduce((s,k) => s + (vs[k] || 0), 0); })()}/186
                        </div>
                        <div style={{fontSize:'9px', color:'#725d86', marginTop:'2px', marginBottom:'6px'}}>
                          成长潜力: {'★'.repeat(Math.min(5, Math.ceil((viewStatPet.ivs?.maxHp ?? viewStatPet.ivs?.hp ?? 15) / 6)))}
                        </div>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'4px'}}>
                          {[{k:'maxHp',n:'HP'},{k:'p_atk',n:'物攻'},{k:'p_def',n:'物防'},{k:'s_atk',n:'特攻'},{k:'s_def',n:'特防'},{k:'spd',n:'速度'}].map(e => {
                            const v = viewStatPet.ivs[e.k] ?? viewStatPet.ivs[e.k === 'maxHp' ? 'hp' : e.k] ?? 0;
                            const pct = Math.round(v / 31 * 100);
                            const color = pct >= 90 ? '#8A5A00' : pct >= 70 ? '#7B1FA2' : pct >= 40 ? '#0B65A8' : '#5D6870';
                            return (
                              <div key={e.k} style={{display:'flex',alignItems:'center',gap:'4px'}}>
                                <span style={{fontSize:'9px',color:'#666',width:'24px'}}>{e.n}</span>
                                <div style={{flex:1,height:'4px',background:'#e0d8f0',borderRadius:'2px',overflow:'hidden'}}>
                                  <div style={{width:`${pct}%`,height:'100%',background:color,borderRadius:'2px'}}/>
                                </div>
                                <span style={{fontSize:'10px',fontWeight:'bold',color,width:'18px',textAlign:'right'}}>{v}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {viewStatPet.evs && Object.values(viewStatPet.evs).some(v => v > 0) && (
                      <div className="pet-detail-ev-card" style={{marginTop:'8px', padding:'8px', background:'#f0f9ff', borderRadius:'8px', border:'1px solid #b3e0ff'}}>
                        <div style={{fontSize:'10px', color:'#1565C0', fontWeight:'bold', marginBottom:'6px'}}>
                          努力值 (EV) — 总计 {Object.values(viewStatPet.evs).reduce((s,v)=>s+(v||0),0)}/{TRAINING_TOTAL_MAX_EV || 510}
                        </div>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'4px'}}>
                          {[{k:'hp',n:'HP'},{k:'p_atk',n:'物攻'},{k:'p_def',n:'物防'},{k:'s_atk',n:'特攻'},{k:'s_def',n:'特防'},{k:'spd',n:'速度'}].map(e => {
                            const v = viewStatPet.evs[e.k] || 0;
                            const pct = Math.round(v / (TRAINING_MAX_EV || 252) * 100);
                            const color = pct >= 90 ? '#FF6D00' : pct >= 50 ? '#1565C0' : pct >= 20 ? '#42A5F5' : '#90CAF9';
                            return (
                              <div key={e.k} style={{display:'flex',alignItems:'center',gap:'4px'}}>
                                <span style={{fontSize:'9px',color:'#666',width:'24px'}}>{e.n}</span>
                                <div style={{flex:1,height:'4px',background:'#d0e8ff',borderRadius:'2px',overflow:'hidden'}}>
                                  <div style={{width:`${pct}%`,height:'100%',background:color,borderRadius:'2px'}}/>
                                </div>
                                <span style={{fontSize:'10px',fontWeight:'bold',color,width:'22px',textAlign:'right'}}>{v}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
                </>
                );
            })()}

            {/* 结契标记 */}
            {viewStatPet.bonded && (
              <div className="pet-detail-section pet-detail-bond-note" style={{margin:'0 20px 10px', padding:'8px 14px', borderRadius:'10px', background:'linear-gradient(90deg,#311B92,#512DA8)', color:'#fff', fontSize:'12px', fontWeight:'700', textAlign:'center'}}>
                💫 结契精灵 · 初始亲密度更高
              </div>
            )}

            {/* 精灵标签 */}
            {(() => {
              const tagIds = inferPetTags(viewStatPet);
              if (!tagIds.length) return null;
              return (
                <div className="pet-detail-section pet-detail-tags" style={{margin:'0 20px 12px', background:'linear-gradient(135deg,#f3e5f5,#e8eaf6)', borderRadius:'12px', padding:'12px 14px', border:'1px solid #ce93d8'}}>
                  <div style={{fontSize:'10px', color:'#7B1FA2', fontWeight:'bold', marginBottom:'8px'}}>精灵标签 · 探索与副本适性</div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                    {tagIds.map(tid => {
                      const def = PET_TAG_DEFS[tid];
                      if (!def) return null;
                      return (
                        <span key={tid} title={def.desc} style={{fontSize:'11px', padding:'4px 10px', borderRadius:'14px', background:'#fff', border:'1px solid #b39ddb', color:'#512DA8', fontWeight:'700', cursor:'help'}}>
                          {def.icon} {def.name}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{fontSize:'9px', color:'#888', marginTop:'6px', lineHeight:1.4}}>
                    标签影响副本通行、生态互动与远征祝福。巨型精灵无法进入窄洞，水栖精灵适合水下遗迹。
                  </div>
                </div>
              );
            })()}

            {/* 🔥 [修复] 特性/魅力/亲密度 展示卡片 🔥 */}
            <div className="pet-detail-section pet-detail-traits" style={{margin:'0 20px 15px', background:'#fff', borderRadius:'12px', padding:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', border:'1px solid #eee'}}>
                
                {/* 特性 */}
                <div style={{flex:1.2, borderRight:'1px solid #eee', paddingRight:'10px'}}>
                    <div style={{fontSize:'10px', color:'#596875', marginBottom:'4px', fontWeight:'bold'}}>特性 (Trait)</div>
                    <div style={{fontSize:'13px', fontWeight:'bold', color:'#673AB7', display:'flex', alignItems:'center', gap:'5px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.name || '无'}
                    </div>
                    <div style={{fontSize:'10px', color:'#666', lineHeight:'1.3', marginTop:'2px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.desc || '暂无特殊能力'}
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee', fontSize: '10px', color: '#5D4037' }}>
                      🍒 树果：{viewStatPet.equippedBerry && BERRIES[viewStatPet.equippedBerry] ? `${BERRIES[viewStatPet.equippedBerry].icon} ${BERRIES[viewStatPet.equippedBerry].name}` : '未装备（背包·树果栏使用即可装备）'}
                      <button type="button" onClick={() => { setViewStatPet(null); setBagTab('berries'); setView('bag'); }} style={{ marginLeft: '8px', padding: '2px 8px', fontSize: '9px', borderRadius: '8px', border: '1px solid #8BC34A', background: '#f1f8e9', cursor: 'pointer', color: '#33691E', fontWeight: 700 }}>去装备</button>
                    </div>
                </div>

                {/* 魅力 & 亲密度 (修复：添加评级显示) */}
                <div style={{flex:0.8, paddingLeft:'15px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'10px', color:'#596875'}}>魅力</span>
                        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                            {/* 🔥 新增：魅力评级标签 */}
                            <span style={{
                                fontSize:'9px', color:getReadableTextColor(CHARM_RANK_COLORS[viewStatPet.charmRank || '凶萌'] || '#5D6870'),
                                background: CHARM_RANK_COLORS[viewStatPet.charmRank || '凶萌'] || '#5D6870',
                                padding:'1px 4px', borderRadius:'4px', fontWeight:'bold'
                            }}>
                                {viewStatPet.charmRank || '凶萌'}
                            </span>
                            <span style={{fontSize:'12px', fontWeight:'bold', color:'#E91E63', display:'flex', alignItems:'center', gap:'4px'}}>
                                💖 {viewStatPet.charm || 0}
                            </span>
                        </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px', width:'100%'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <span style={{fontSize:'10px', color:'#596875'}}>亲密</span>
                          <span style={{fontSize:'10px', fontWeight:'bold', color:'#F44336'}}>{viewStatPet.intimacy || 0}/255</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'8px', width:'100%'}} title="亲密度">
                          <span style={{fontSize:'18px', lineHeight:1, filter:'drop-shadow(0 1px 2px rgba(233,30,99,0.35))'}}>❤️</span>
                          <div style={{flex:1, height:'12px', borderRadius:'10px', background:'#ffebee', overflow:'hidden', border:'1px solid #ffcdd2', position:'relative'}}>
                            <div style={{
                              width:`${Math.min(100, ((viewStatPet.intimacy || 0) / 255) * 100)}%`,
                              height:'100%',
                              background:'linear-gradient(90deg,#ff8a80 0%,#e91e63 45%,#c2185b 100%)',
                              transition:'width 0.35s',
                              boxShadow:'inset 0 -2px 0 rgba(255,255,255,0.25)',
                            }} />
                          </div>
                        </div>
                    </div>
                    {(() => {
                        const bs = viewStatPet.customBaseStats || POKEDEX.find(pd => pd.id === viewStatPet.id) || {};
                        const g = getCurseGrade(bs, viewStatPet.curseTalent || 0);
                        return (
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span style={{fontSize:'10px', color:'#596875'}}>咒级</span>
                                <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                    <span style={{fontSize:'9px', color:getReadableTextColor(g.color || '#5D6870'), background: g.color || '#5D6870', padding:'1px 4px', borderRadius:'4px', fontWeight:'bold'}}>{g.name}</span>
                                    <span style={{fontSize:'10px', color:'#596875'}}>天赋{viewStatPet.curseTalent || 0}</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {viewStatPet.intimacy >= 80 && (
              <div className="pet-detail-section pet-detail-talents" style={{margin:'0 20px 12px', padding:'8px', borderRadius:'8px', background:'rgba(255,215,0,0.03)', border:'1px solid rgba(255,215,0,0.08)'}}>
                <div style={{fontSize:'10px', fontWeight:'700', color:'#FFD54F', marginBottom:'4px'}}>🌟 天赋能力</div>
                <div style={{ fontSize: '9px', color: '#5D6870', marginBottom: '6px', lineHeight: 1.45 }}>以下能力随亲密度解锁，仅在战斗中生效；与咒术天赋、门派加成独立计算。</div>
                {[{ need: 100, label: '全力一击 (暴击率+5%)' }, { need: 150, label: '坚韧意志 (HP低于20%时防御+30%)' }, { need: 200, label: '灵魂共鸣 (属性加成+5%)' }].map(row => {
                  const int = viewStatPet.intimacy || 0;
                  const prev = row.need === 100 ? 80 : row.need === 150 ? 100 : 150;
                  const pct = Math.max(0, Math.min(100, ((int - prev) / (row.need - prev)) * 100));
                  const unlocked = int >= row.need;
                  return (
                    <div key={row.need} style={{marginTop:'6px', display:'flex', alignItems:'stretch', gap:'8px'}}>
                      <div style={{width:'44px', flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center'}} title={`亲密度 ${int}/${row.need}`}>
                        <div style={{fontSize:'9px', color:'#637383', marginBottom:'2px'}}>{prev}→{row.need}</div>
                        <div style={{height:'22px', borderRadius:'4px', background:'rgba(0,0,0,0.06)', overflow:'hidden', position:'relative'}}>
                          <div style={{position:'absolute', bottom:0, left:0, right:0, height:`${unlocked ? 100 : pct}%`, background: unlocked ? 'linear-gradient(180deg,#81C784,#4CAF50)' : 'linear-gradient(180deg,#FFD54F,#FF9800)', transition:'height 0.3s'}} />
                        </div>
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:'9px', color:'#536473', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px'}}>
                          <span>{unlocked ? '✅' : '🔒'} {row.label}{!unlocked ? ` · 亲密度${row.need}解锁` : ''}</span>
                        </div>
                        {!unlocked && (
                          <div style={{height:'4px', borderRadius:'3px', background:'rgba(0,0,0,0.06)', marginTop:'4px', overflow:'hidden'}}>
                            <div style={{width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#FFD54F,#FF9800)', borderRadius:'3px', transition:'width 0.3s'}} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. 门派详情与升级卡片 */}
            {(() => {
                const sect = viewStatPet.sectId ? SECT_DB[viewStatPet.sectId] : null;
                if (!sect) return (
                  <div className="pet-detail-section pet-detail-sect" style={{margin:'0 20px 15px', background:'#f5f5f5', border:'1px solid #ddd', borderRadius:'12px', padding:'12px', textAlign:'center', color:'#596875', fontSize:'13px'}}>
                    该精灵尚未加入门派
                  </div>
                );
                const lv = viewStatPet.sectLevel || 1;
                const cost = getSectUpgradeCost(lv);
                const isMax = lv >= 10;
                const effectText = sect.effect ? sect.effect(lv) : sect.desc;
                const nextEffectText = (!isMax && sect.effect) ? sect.effect(lv+1) : '';

                const upgradeSect = () => {
                    const petUid = viewStatPet.uid;
                    const lockKey = `pet-sect:${petUid}`;
                    if (!petUid || sectActionLocksRef.current.has(lockKey)) return;
                    sectActionLocksRef.current.add(lockKey);
                    try {
                    const currentParty = partyRef.current || [];
                    const idx = currentParty.findIndex(p => p.uid === petUid);
                    if (idx === -1) { showMapToast('⚠️', '无法突破', '该精灵不在队伍中', 1500); return; }
                    const currentPet = currentParty[idx];
                    const currentLevel = currentPet.sectLevel || 1;
                    if (currentLevel >= 10) { showMapToast('⬆️', '已满级', '心法已达第10层', 1500); return; }
                    const currentCost = getSectUpgradeCost(currentLevel);
                    if (goldRef.current < currentCost) { showMapToast('💰', '金币不足', '心法突破费用不足', 1500); return; }
                    const upgradedPet = { ...currentPet, sectLevel: currentLevel + 1 };
                    const newParty = currentParty.map((pet, petIdx) => petIdx === idx ? upgradedPet : pet);
                    goldRef.current -= currentCost;
                    partyRef.current = newParty;
                    flushSync(() => { setGold(goldRef.current); setParty(newParty); });
                    updateAchStat({ totalGoldSpent: currentCost });
                    setViewStatPet(upgradedPet);
                    if (sectPlayer?.playerSect) {
                      advanceSectDaily('sect_train', 1);
                      advanceSectDaily('sect_contrib', currentCost);
                    }
                    showMapToast('✅', '心法突破', `${sect.name} 第 ${currentLevel + 1} 层`, 2500);
                    } finally {
                      window.setTimeout(() => sectActionLocksRef.current.delete(lockKey), 0);
                    }
                };

                return (
                    <div className="pet-detail-section pet-detail-sect" style={{margin:'0 20px 15px', background:`linear-gradient(135deg, ${sect.color}22, #fff)`, border:`1px solid ${sect.color}`, borderRadius:'12px', padding:'12px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <div style={{fontSize:'24px', background:'#fff', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                                    {sect.emoji}
                                </div>
                                <div>
                                    <div style={{fontWeight:'bold', color: sect.color, fontSize:'14px'}}>{sect.name}</div>
                                    <div style={{fontSize:'10px', color:'#666'}}>当前境界: 第 {lv} 层</div>
                                </div>
                            </div>
                            {!isMax ? (
                                <button onClick={upgradeSect} style={{
                                    background: sect.color, color:getReadableTextColor(sect.color), border:'none', padding:'6px 12px', borderRadius:'20px',
                                    fontSize:'11px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                    修炼 (💰{cost})
                                </button>
                            ) : (
                                <span style={{fontSize:'12px', fontWeight:'bold', color:'#596875', background:'#e5e8eb', padding:'4px 8px', borderRadius:'10px'}}>已圆满</span>
                            )}
                        </div>
                        <div style={{fontSize:'11px', color:'#555', background:'rgba(255,255,255,0.8)', padding:'8px', borderRadius:'6px', lineHeight:'1.4'}}>
                            <div style={{fontWeight:'bold', marginBottom:'2px'}}>【{sect.desc}】</div>
                            <div>当前效果: {effectText}</div>
                            {!isMax && <div style={{color: sect.color, marginTop:'2px'}}>下一层: {nextEffectText}</div>}
                        </div>
                    </div>
                );
            })()}

            {/* 3.4 跨界共鸣 & 精灵觉醒 */}
            {(() => {
              const resonance = getActiveResonanceForPet(viewStatPet);
              const awakenCheck = canAwakenPet(viewStatPet, getAllOwnedPets());
              return (
                <div className="pet-detail-section pet-detail-resonance" style={{margin:'0 20px 15px', background:'linear-gradient(135deg,#1a1035,#2d1b69)', border:'1px solid rgba(167,139,250,0.35)', borderRadius:'12px', padding:'12px', color:'#fff'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <div style={{fontWeight:'800', fontSize:'14px', color:'#c4b5fd'}}>✨ 跨界共鸣</div>
                    {viewStatPet.awakened && <span style={{fontSize:'11px', background:'rgba(255,213,79,0.2)', color:'#FFD54F', padding:'3px 8px', borderRadius:'8px', fontWeight:'700'}}>已觉醒</span>}
                  </div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'10px'}}>
                    {(resonance.activeCombos || []).length === 0 ? (
                      <span style={{fontSize:'11px', color:'rgba(255,255,255,0.78)'}}>装备咒术/果实/门派并提升忍术精通以激活共鸣</span>
                    ) : (resonance.activeCombos || []).map(c => (
                      <span key={c.id} title={c.desc} style={{fontSize:'10px', padding:'4px 8px', borderRadius:'8px', background:'rgba(167,139,250,0.18)', border:'1px solid rgba(167,139,250,0.35)', color:'#e9d5ff'}}>{c.icon} {c.name}</span>
                    ))}
                  </div>
                  {!viewStatPet.awakened && (
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.82)', lineHeight:1.5}}>
                        觉醒条件：Lv.100 · 亲密度200 · EV400+ · 果实 · 传承
                        {!awakenCheck.ok && <div style={{color:'#fca5a5', marginTop:'2px'}}>{awakenCheck.reason}</div>}
                      </div>
                      <button type="button" disabled={!awakenCheck.ok} onClick={() => awakenPet(viewStatPet.uid)} style={{
                        padding:'8px 14px', borderRadius:'10px', border:'none', cursor: awakenCheck.ok ? 'pointer' : 'not-allowed',
                        background: awakenCheck.ok ? 'linear-gradient(135deg,#FFD54F,#FF8F00)' : 'rgba(255,255,255,0.08)',
                        color: awakenCheck.ok ? '#1a1035' : '#D7DEE7', fontSize:'12px', fontWeight:'800', flexShrink:0
                      }}>🌟 觉醒</button>
                    </div>
                  )}
                  {viewStatPet.awakened && (() => {
                    const curTier = getPetAwakeningTier(viewStatPet.uid, fusionState) || 'normal';
                    const fruitCheck = checkAwakeningTier(viewStatPet, 'fruit', { fusionState, kingdomWar });
                    const stratCheck = checkAwakeningTier(viewStatPet, 'strategic', { fusionState, kingdomWar });
                    return (
                      <div style={{paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', gap:'8px'}}>
                        <div style={{fontSize:'11px', color:'rgba(255,255,255,0.82)'}}>觉醒三档：普通 ✓ · 果实 {curTier === 'fruit' || curTier === 'strategic' ? '✓' : '—'} · 战略 {curTier === 'strategic' ? '✓' : '—'}</div>
                        {curTier === 'normal' && (
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px'}}>
                            <div style={{fontSize:'10px', color:'rgba(255,255,255,0.8)'}}>🍎 果实觉醒：绑定果实 + 完成果实海域试炼{!fruitCheck.ok && <div style={{color:'#fca5a5'}}>{fruitCheck.reason}</div>}</div>
                            <button type="button" disabled={!fruitCheck.ok} onClick={() => upgradeAwakeningTier(viewStatPet.uid, 'fruit')} style={{padding:'6px 12px', borderRadius:'8px', border:'none', cursor: fruitCheck.ok ? 'pointer' : 'not-allowed', background: fruitCheck.ok ? 'linear-gradient(135deg,#ef5350,#ff9800)' : 'rgba(255,255,255,0.08)', color: fruitCheck.ok ? '#fff' : '#D7DEE7', fontSize:'11px', fontWeight:'700'}}>果实觉醒</button>
                          </div>
                        )}
                        {curTier === 'fruit' && (
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px'}}>
                            <div style={{fontSize:'10px', color:'rgba(255,255,255,0.8)'}}>⚔️ 战略觉醒：门派 + 将魂战术 + 国战贡献500 + 古战场{!stratCheck.ok && <div style={{color:'#fca5a5'}}>{stratCheck.reason}</div>}</div>
                            <button type="button" disabled={!stratCheck.ok} onClick={() => upgradeAwakeningTier(viewStatPet.uid, 'strategic')} style={{padding:'6px 12px', borderRadius:'8px', border:'none', cursor: stratCheck.ok ? 'pointer' : 'not-allowed', background: stratCheck.ok ? 'linear-gradient(135deg,#7e57c2,#4527a0)' : 'rgba(255,255,255,0.08)', color: stratCheck.ok ? '#fff' : '#D7DEE7', fontSize:'11px', fontWeight:'700'}}>战略觉醒</button>
                          </div>
                        )}
                        {curTier === 'strategic' && <div style={{fontSize:'10px', color:'#FFD54F'}}>⚔️ 已完成战略觉醒，解锁国战特技与圣域加成</div>}
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* 3.5 恶魔果实 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const equippedFruit = viewStatPet.devilFruit ? getFruitById(viewStatPet.devilFruit) : null;
                const rarityConf = equippedFruit ? FRUIT_RARITY_CONFIG[equippedFruit.rarity] : null;
                return (
                  <div className="pet-detail-surface pet-detail-fruit" style={{
                    background: equippedFruit
                      ? `linear-gradient(135deg, ${rarityConf?.color || '#666'}15, #fff)`
                      : '#f9f9f9',
                    border: equippedFruit
                      ? `1.5px solid ${rarityConf?.color || '#ccc'}`
                      : '1.5px dashed #ddd',
                    borderRadius:'12px', padding:'12px'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: equippedFruit ? '8px' : '0'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        {equippedFruit
                          ? renderFruitCSSIcon(viewStatPet.devilFruit, 36)
                          : <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#e8edf0', border:'2px dashed #9aa6af', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', color:'#596875'}}>+</div>
                        }
                        <div>
                          <div style={{fontWeight:'bold', fontSize:'13px', color: equippedFruit ? rarityConf?.color : '#596875'}}>
                            {equippedFruit ? equippedFruit.name : '未装备果实'}
                          </div>
                          {equippedFruit && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              [{FRUIT_CATEGORY_NAMES[equippedFruit.category]}] {FRUIT_RARITY_CONFIG[equippedFruit.rarity]?.label} · 持续{equippedFruit.duration}回合
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'6px'}}>
                        {equippedFruit && (
                          <button onClick={() => {
                            const idx = (partyRef.current || []).findIndex(p => p.uid === viewStatPet.uid);
                            if (idx !== -1) assignDevilFruitToPartyPet(idx, viewStatPet.devilFruit);
                          }} style={{
                            background:'rgba(23,48,66,0.08)', color:'#596875', border:'1px solid #b9c1c8',
                            padding:'5px 10px', borderRadius:'16px', fontSize:'11px', cursor:'pointer'
                          }}>卸下</button>
                        )}
                        <button onClick={() => {
                          if (fruitInventory.length === 0) { showMapToast('❌', '提示', '背包中没有恶魔果实，通过战斗或活动获得吧！', 1500); return; }
                          setFruitPickModal({ petUid: viewStatPet.uid });
                        }} style={{
                          background: equippedFruit ? '#fff' : 'linear-gradient(135deg, #D32F2F, #FF6F00)',
                          color: equippedFruit ? rarityConf?.color || '#666' : '#fff',
                          border: equippedFruit ? `1px solid ${rarityConf?.color || '#ddd'}` : 'none',
                          padding:'5px 14px', borderRadius:'16px', fontSize:'11px', fontWeight:'bold', cursor:'pointer',
                          boxShadow: equippedFruit ? 'none' : '0 2px 8px rgba(211,47,47,0.3)'
                        }}>
                          {equippedFruit ? '更换' : '装备果实'}
                        </button>
                      </div>
                    </div>
                    {equippedFruit && (
                      <div style={{fontSize:'11px', color:'#555', background:'rgba(255,255,255,0.8)', padding:'6px 8px', borderRadius:'6px', lineHeight:'1.4'}}>
                        {equippedFruit.desc}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 3.6 饰品装备 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const equips = viewStatPet.equips || [null, null];
                return (
                  <div className="pet-detail-surface pet-detail-equipment" style={{background:'#f9f9f9', border:'1.5px solid #e0e0e0', borderRadius:'12px', padding:'12px'}}>
                    <div style={{fontSize:'12px', fontWeight:'bold', color:'#555', marginBottom:'8px'}}>🛡️ 饰品 ({equips.filter(e => e).length}/2)</div>
                    <div style={{display:'flex', gap:'8px'}}>
                      {[0, 1].map(slotIdx => {
                        const accId = equips[slotIdx];
                        let acc = null;
                        if (typeof accId === 'string') acc = ACCESSORY_DB.find(a => a.id === accId);
                        else if (typeof accId === 'object' && accId) acc = accId;
                        const petIdx = party.findIndex(p => p.uid === viewStatPet.uid);
                        return (
                          <div key={slotIdx} style={{
                            flex:1, background: acc ? 'linear-gradient(135deg,#E8EAF6,#fff)' : '#f0f0f0',
                            border: acc ? '1.5px solid #5C6BC0' : '1.5px dashed #ccc',
                            borderRadius:'10px', padding:'10px', display:'flex', alignItems:'center', gap:'8px',
                            cursor:'pointer', transition:'all 0.2s'
                          }} onClick={() => { if (petIdx >= 0) openEquipModal(petIdx, slotIdx); }}>
                            <span style={{fontSize:'22px'}}>{acc ? (acc.icon || '🛡️') : '➕'}</span>
                            <div style={{flex:1, minWidth:0}}>
                              <div style={{fontSize:'11px', fontWeight:'bold', color: acc ? '#333' : '#596875', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                {acc ? acc.name : '空槽位'}
                              </div>
                              {acc && <div style={{fontSize:'9px', color:'#888'}}>{acc.desc || ''}</div>}
                            </div>
                            {acc && petIdx >= 0 && (
                              <button onClick={(ev) => {
                                ev.stopPropagation();
                                const np = [...party]; const pet2 = np[petIdx];
                                if (pet2.equips && pet2.equips[slotIdx]) {
                                  setAccessories(prev => [...prev, pet2.equips[slotIdx]]);
                                  pet2.equips[slotIdx] = null;
                                  setParty(np); setViewStatPet({...pet2});
                                }
                              }} style={{
                                background:'rgba(23,48,66,0.08)', color:'#596875', border:'1px solid #b9c1c8',
                                padding:'2px 8px', borderRadius:'12px', fontSize:'10px', cursor:'pointer', flexShrink:0
                              }}>卸</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 3.7 搭档羁绊 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const partnerPet = [...party, ...box].find(p => (p.uid || p.id) === viewStatPet.partnerId);
                const bl = partnerPet ? getBondLevel(viewStatPet.bondPoints || 0) : null;
                const nextBl = BOND_LEVELS.find(b => (viewStatPet.bondPoints || 0) < b.threshold);
                return (
                  <div className="pet-detail-surface pet-detail-partner" style={{
                    background: partnerPet ? 'linear-gradient(135deg, #FCE4EC, #fff)' : '#f9f9f9',
                    border: partnerPet ? '1.5px solid #E91E63' : '1.5px dashed #ddd',
                    borderRadius:'12px', padding:'12px'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <div style={{width:'36px', height:'36px', borderRadius:'50%', background: partnerPet ? 'linear-gradient(135deg,#E91E63,#FF6090)' : '#e8edf0', border: partnerPet ? 'none' : '2px dashed #9aa6af', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color: partnerPet ? '#fff' : '#596875'}}>
                          {partnerPet ? '🤝' : '+'}
                        </div>
                        <div>
                          <div style={{fontWeight:'bold', fontSize:'13px', color: partnerPet ? '#C2185B' : '#596875'}}>
                            {partnerPet ? `搭档: ${partnerPet.name}` : '未设置搭档'}
                          </div>
                          {partnerPet && bl && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              羁绊 Lv{bl.tier} ({bl.name}) · {viewStatPet.bondPoints || 0}点
                              {nextBl && ` (下级: ${nextBl.threshold}点)`}
                            </div>
                          )}
                          {partnerPet && !bl && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              羁绊 {viewStatPet.bondPoints || 0}/{BOND_LEVELS[0].threshold}点
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'6px'}}>
                        {partnerPet && (
                          <button onClick={() => { removePartner(viewStatPet); setViewStatPet(prev => ({...prev, partnerId: null, bondPoints: 0})); }} style={{
                            background:'rgba(23,48,66,0.08)', color:'#596875', border:'1px solid #b9c1c8',
                            padding:'5px 10px', borderRadius:'16px', fontSize:'11px', cursor:'pointer'
                          }}>解除</button>
                        )}
                        <button onClick={() => { if (!isPartnerSystemUnlocked()) { showMapToast('ℹ️', '提示', '🔒 搭档羁绊系统尚未解锁！ 集齐 3 枚徽章后解锁。', 2000); return; } setPartnerModal(true); }} style={{
                          background: !isPartnerSystemUnlocked() ? '#DCE2E7' : (partnerPet ? '#fff' : 'linear-gradient(135deg, #E91E63, #FF6090)'),
                          color: !isPartnerSystemUnlocked() ? '#52616D' : (partnerPet ? '#E91E63' : '#fff'),
                          border: partnerPet ? '1px solid #E91E63' : 'none',
                          padding:'5px 14px', borderRadius:'16px', fontSize:'11px', fontWeight:'bold', cursor:'pointer',
                          boxShadow: partnerPet ? 'none' : '0 2px 8px rgba(233,30,99,0.3)'
                        }}>
                          {!isPartnerSystemUnlocked() ? '🔒 未解锁' : (partnerPet ? '更换' : '设置搭档')}
                        </button>
                      </div>
                    </div>
                    {partnerPet && bl && (
                      <div style={{marginTop:'8px'}}>
                        <div style={{height:'4px', background:'#f0f0f0', borderRadius:'2px', overflow:'hidden'}}>
                          <div style={{height:'100%', width: `${Math.min(100, ((viewStatPet.bondPoints || 0) / (nextBl?.threshold || 300)) * 100)}%`, background:'linear-gradient(90deg,#E91E63,#FF6090)', borderRadius:'2px', transition:'width 0.3s'}} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 搭档选择弹窗 */}
            {partnerModal && (
              <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => setPartnerModal(false)}>
                <div style={{background:'#fff', borderRadius:'16px', padding:'20px', maxWidth:'400px', width:'90%', maxHeight:'70vh', overflow:'auto'}} onClick={e => e.stopPropagation()}>
                  <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'15px', color:'#C2185B'}}>选择搭档精灵</div>
                  <div style={{fontSize:'11px', color:'#888', marginBottom:'10px'}}>选择一只精灵作为 {viewStatPet.name} 的搭档（每只精灵只能有一个搭档）</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                    {[...party, ...box].filter(p => (p.uid || p.id) !== (viewStatPet.uid || viewStatPet.id) && p.currentHp > 0).map(p => {
                      const isCurrentPartner = (p.uid || p.id) === viewStatPet.partnerId;
                      const hasOtherPartner = p.partnerId && p.partnerId !== (viewStatPet.uid || viewStatPet.id);
                      return (
                        <div key={p.uid || p.id} onClick={() => {
                          if (hasOtherPartner) { showMapToast('⚠️', '搭档', `${p.name} 已有其他搭档`, 1500); return; }
                          setPartner(viewStatPet, p);
                          setViewStatPet(prev => ({...prev, partnerId: p.uid || p.id, bondPoints: prev.partnerId === (p.uid || p.id) ? (prev.bondPoints || 0) : 0 }));
                          setPartnerModal(false);
                          showMapToast('🤝', '结为搭档', `${viewStatPet.name} · ${p.name}`, 2500);
                        }} style={{
                          display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', cursor:'pointer',
                          background: isCurrentPartner ? '#FCE4EC' : '#f5f5f5', border: isCurrentPartner ? '2px solid #E91E63' : '1px solid #eee'
                        }}>
                          <div style={{fontWeight:'bold', fontSize:'13px', flex:1}}>{p.name} <span style={{fontSize:'10px', color:'#888'}}>Lv.{p.level}</span></div>
                          <div style={{fontSize:'10px', color: TYPES[p.type]?.color, fontWeight:'bold'}}>{TYPES[p.type]?.name}</div>
                          {isCurrentPartner && <span style={{fontSize:'10px', color:'#E91E63', fontWeight:'bold'}}>当前搭档</span>}
                          {hasOtherPartner && <span style={{fontSize:'10px', color:'#596875'}}>已有搭档</span>}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setPartnerModal(false)} style={{width:'100%', marginTop:'15px', padding:'10px', background:'#f5f5f5', border:'none', borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>取消</button>
                </div>
              </div>
            )}

            {/* 精灵传承弹窗 */}
            {skillInheritModal && (() => {
              const mentor = skillInheritModal.mentor ? party.find(p => p.uid === skillInheritModal.mentor) : null;
              const apprentice = skillInheritModal.apprentice ? party.find(p => p.uid === skillInheritModal.apprentice) : null;
              const legacyStones = inventory.legacy_stone || 0;
              const MAX_LEGACY = 3;
              const eligibleMentors = party.filter(p => p.level >= 80 && (p.legacyCount || 0) < MAX_LEGACY && !p.isFusion && !p.isFusedShiny);
              const eligibleApprentices = mentor ? party.filter(p => p.uid !== mentor.uid && !(p.inheritedMove) && !p.isFusion && !p.isFusedShiny) : [];
              const mentorMoves = mentor ? (mentor.moves || []).filter(m => m && m.name) : [];
              const selectedMove = skillInheritModal.selectedMove;
              const replaceIdx = skillInheritModal.replaceIdx;

              const doLegacy = () => {
                if (!mentor || !apprentice || !selectedMove) return;
                const lockKey = `legacy:${mentor.uid}:${apprentice.uid}`;
                if (inventoryActionLocksRef.current.has(lockKey)) return;
                inventoryActionLocksRef.current.add(lockKey);
                try {
                  const currentInventory = inventoryRef.current || inventory;
                  const currentParty = partyRef.current || [];
                  const currentBox = boxRef.current || [];
                  const allCurrentPets = [...currentParty, ...currentBox];
                  const currentMentor = allCurrentPets.find(p => p.uid === mentor.uid);
                  const currentApprentice = allCurrentPets.find(p => p.uid === apprentice.uid);
                  const currentMove = (currentMentor?.moves || []).find(move => move.name === selectedMove.name);
                  if (!currentMentor || !currentApprentice || !currentMove || currentMentor.uid === currentApprentice.uid) {
                    showMapToast('ℹ️', '传承取消', '导师、学徒或技能已经变化', 2000); return;
                  }
                  if ((currentInventory.legacy_stone || 0) < 1) { showMapToast('❌', '材料不足', '精灵传承需要 1 个传承石（矿洞产出）', 2000); return; }
                  if ((currentMentor.legacyCount || 0) >= MAX_LEGACY) { showMapToast('❌', '传承上限', `${currentMentor.name} 已传承 ${MAX_LEGACY} 次`, 1500); return; }
                  if (currentApprentice.inheritedMove) { showMapToast('❌', '已传承', `${currentApprentice.name} 已接受过传承`, 1500); return; }
                  const apprenticeMoves = [...(currentApprentice.moves || [])];
                  if (apprenticeMoves.length >= 4 && (replaceIdx === undefined || replaceIdx < 0 || replaceIdx >= apprenticeMoves.length)) {
                    showMapToast('⚠️', '请先选择替换招式', `${currentApprentice.name} 已有4个招式，请点击选择要替换的位置`, 2500); return;
                  }
                  const legacyMove = { ...currentMove, pp: currentMove.maxPp || currentMove.maxPP || currentMove.pp, _legacy: true, _legacyFrom: currentMentor.name };
                  if (replaceIdx !== undefined && replaceIdx >= 0 && replaceIdx < apprenticeMoves.length) apprenticeMoves[replaceIdx] = legacyMove;
                  else apprenticeMoves.push(legacyMove);
                  const applyLegacy = (p) => {
                    if (p.uid === currentMentor.uid) return { ...p, legacyCount: (p.legacyCount || 0) + 1 };
                    if (p.uid === currentApprentice.uid) return { ...p, moves: apprenticeMoves, inheritedMove: currentMove.name };
                    return p;
                  };
                  const nextParty = currentParty.map(applyLegacy);
                  const nextBox = currentBox.map(applyLegacy);
                  const nextInventory = { ...currentInventory, legacy_stone: currentInventory.legacy_stone - 1 };
                  partyRef.current = nextParty;
                  boxRef.current = nextBox;
                  inventoryRef.current = nextInventory;
                  flushSync(() => { setParty(nextParty); setBox(nextBox); setInventory(nextInventory); setSkillInheritModal(null); });
                  showMapToast('✨', '传承成功！', `${currentMentor.name} → ${currentApprentice.name}：继承技·${currentMove.name}`, 3500);
                  updateAchStat({ legacyCount: 1 });
                } finally {
                  window.setTimeout(() => inventoryActionLocksRef.current.delete(lockKey), 0);
                }
              };

              return (
                <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.7)', zIndex:10001, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)'}} onClick={() => setSkillInheritModal(null)}>
                  <div style={{background:'linear-gradient(145deg, #1a1040, #2d1b69, #1a1040)', borderRadius:'20px', padding:'24px', maxWidth:'440px', width:'92%', maxHeight:'80vh', overflow:'auto', border:'1px solid rgba(147,51,234,0.3)', boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(147,51,234,0.15)'}} onClick={e => e.stopPropagation()}>
                    <div style={{textAlign:'center', marginBottom:'16px'}}>
                      <div style={{fontSize:'18px', fontWeight:'900', background:'linear-gradient(90deg, #a78bfa, #c084fc, #e9d5ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>✨ 精灵传承</div>
                      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.76)', marginTop:'4px'}}>传承石: 💎 {legacyStones} · 导师 Lv.80+ · 最多传承 {MAX_LEGACY} 次 · 学徒限 1 次</div>
                    </div>

                    {/* Step 1: 选择导师 */}
                    <div style={{marginBottom:'14px'}}>
                      <div style={{fontSize:'12px', fontWeight:'700', color:'#a78bfa', marginBottom:'6px'}}>① 选择导师 (Lv.80+)</div>
                      <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                        {eligibleMentors.length === 0 ? (
                          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.72)', padding:'12px', textAlign:'center', width:'100%'}}>队伍中无 Lv.80+ 精灵</div>
                        ) : eligibleMentors.map(p => (
                          <div key={p.uid} onClick={() => setSkillInheritModal(prev => ({...prev, mentor: p.uid, apprentice: null, selectedMove: null, replaceIdx: undefined}))}
                            style={{padding:'8px 12px', borderRadius:'10px', cursor:'pointer', border: mentor?.uid === p.uid ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', background: mentor?.uid === p.uid ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)', transition:'all 0.2s'}}>
                            <div style={{fontSize:'12px', fontWeight:'700', color: mentor?.uid === p.uid ? '#c084fc' : 'rgba(255,255,255,0.7)'}}>{p.name} Lv.{p.level}</div>
                            <div style={{fontSize:'9px', color:'rgba(255,255,255,0.68)'}}>传承{p.legacyCount || 0}/{MAX_LEGACY}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: 选择技能 */}
                    {mentor && (
                      <div style={{marginBottom:'14px'}}>
                        <div style={{fontSize:'12px', fontWeight:'700', color:'#a78bfa', marginBottom:'6px'}}>② 选择传授技能</div>
                        <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                          {mentorMoves.map((m, i) => {
                            const tc = TYPES[m.t] || TYPES.NORMAL;
                            return (
                              <div key={i} onClick={() => setSkillInheritModal(prev => ({...prev, selectedMove: m, replaceIdx: undefined}))}
                                style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', borderRadius:'8px', cursor:'pointer', border: selectedMove?.name === m.name ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.06)', background: selectedMove?.name === m.name ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.02)', transition:'all 0.2s'}}>
                                <span style={{fontSize:'11px', padding:'2px 6px', borderRadius:'4px', background:tc.color, color:getReadableTextColor(tc.color), fontWeight:'700'}}>{tc.name?.[0]}</span>
                                <span style={{fontSize:'12px', fontWeight:'600', color:'rgba(255,255,255,0.85)'}}>{m.name}</span>
                                <span style={{fontSize:'10px', color:'rgba(255,255,255,0.7)', marginLeft:'auto'}}>威力{m.p||0} PP{m.maxPP||m.maxPp||m.pp}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 3: 选择学徒 */}
                    {mentor && selectedMove && (
                      <div style={{marginBottom:'14px'}}>
                        <div style={{fontSize:'12px', fontWeight:'700', color:'#a78bfa', marginBottom:'6px'}}>③ 选择学徒</div>
                        <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
                          {eligibleApprentices.length === 0 ? (
                            <div style={{fontSize:'11px', color:'rgba(255,255,255,0.72)', padding:'12px', textAlign:'center', width:'100%'}}>无可用学徒（已传承或融合体不可）</div>
                          ) : eligibleApprentices.map(p => (
                            <div key={p.uid} onClick={() => setSkillInheritModal(prev => ({...prev, apprentice: p.uid, replaceIdx: undefined}))}
                              style={{padding:'8px 12px', borderRadius:'10px', cursor:'pointer', border: apprentice?.uid === p.uid ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.1)', background: apprentice?.uid === p.uid ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)', transition:'all 0.2s'}}>
                              <div style={{fontSize:'12px', fontWeight:'700', color: apprentice?.uid === p.uid ? '#c084fc' : 'rgba(255,255,255,0.7)'}}>{p.name} Lv.{p.level}</div>
                              <div style={{fontSize:'9px', color:'rgba(255,255,255,0.68)'}}>技能{(p.moves||[]).length}/4</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: 技能替换选择 */}
                    {mentor && selectedMove && apprentice && apprentice.moves?.length >= 4 && (
                      <div style={{marginBottom:'14px'}}>
                        <div style={{fontSize:'12px', fontWeight:'700', color:'#a78bfa', marginBottom:'6px'}}>④ 选择替换的技能</div>
                        <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                          {(apprentice.moves || []).map((m, i) => (
                            <div key={i} onClick={() => setSkillInheritModal(prev => ({...prev, replaceIdx: i}))}
                              style={{display:'flex', alignItems:'center', gap:'8px', padding:'6px 10px', borderRadius:'8px', cursor:'pointer', border: replaceIdx === i ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.06)', background: replaceIdx === i ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)'}}>
                              <span style={{fontSize:'11px', color:'rgba(255,255,255,0.6)'}}>{m.name}</span>
                              <span style={{fontSize:'9px', color:'rgba(255,255,255,0.68)', marginLeft:'auto'}}>威力{m.p||0}</span>
                              {replaceIdx === i && <span style={{fontSize:'9px', color:'#ef4444', fontWeight:'700'}}>替换</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 预览 & 确认 */}
                    {mentor && selectedMove && apprentice && (apprentice.moves?.length < 4 || replaceIdx !== undefined) && (
                      <div style={{background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:'12px', padding:'12px', marginBottom:'14px'}}>
                        <div style={{fontSize:'11px', color:'#c084fc', fontWeight:'700', marginBottom:'6px'}}>传承预览</div>
                        <div style={{fontSize:'12px', color:'rgba(255,255,255,0.7)'}}>
                          🎓 导师：{mentor.name} (传承{(mentor.legacyCount||0)+1}/{MAX_LEGACY})<br/>
                          📖 学徒：{apprentice.name} ← 继承技·{selectedMove.name}<br/>
                          💎 消耗：传承石 ×1
                        </div>
                      </div>
                    )}

                    <div style={{display:'flex', gap:'8px'}}>
                    <button onClick={() => setSkillInheritModal(null)} style={{flex:1, padding:'10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.24)', borderRadius:'10px', fontSize:'12px', cursor:'pointer', color:'rgba(255,255,255,0.84)', fontWeight:'600'}}>取消</button>
                      <button onClick={doLegacy} disabled={!mentor || !selectedMove || !apprentice || (apprentice?.moves?.length >= 4 && replaceIdx === undefined) || legacyStones < 1}
                        style={{flex:2, padding:'10px', background: (!mentor||!selectedMove||!apprentice||legacyStones<1) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)', border:'none', borderRadius:'10px', fontSize:'13px', cursor: (!mentor||!selectedMove||!apprentice||legacyStones<1) ? 'not-allowed' : 'pointer', color:'#fff', fontWeight:'700', boxShadow: (mentor&&selectedMove&&apprentice&&legacyStones>=1) ? '0 4px 15px rgba(124,58,237,0.4)' : 'none', opacity: (!mentor||!selectedMove||!apprentice||legacyStones<1) ? 0.4 : 1}}>
                        ✨ 确认传承
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 4. 道具与培养 */}
            <div style={{padding:'0 20px 20px'}}>
               <div style={{background:'#FFF8E1', color:'#F57F17', padding:'8px', borderRadius:'8px', textAlign:'center', fontSize:'12px', fontWeight:'bold', marginBottom:'15px'}}>
                 幸运值 (暴击率): {getStats(viewStatPet).crit}%
               </div>

               <div onClick={() => openRebirthUI(viewStatPet)} style={{
                    background: 'linear-gradient(90deg, #673AB7, #9C27B0)', color: '#fff', padding: '10px', borderRadius: '10px', 
                    marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)'
                 }}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{fontSize:'20px'}}>🧬</span>
                      <div>
                          <div style={{fontWeight:'bold', fontSize:'14px'}}>基因洗练</div>
                          <div style={{fontSize:'10px', opacity:0.8}}>重置 Lv.5 | 刷新性格与资质</div>
                      </div>
                  </div>
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px', fontSize:'12px'}}>
                      💊 {inventory.misc?.rebirth_pill || 0}
                  </div>
               </div>

               {/* 精灵传承 */}
               <div onClick={() => {
                 if (badges.length < 5) { showMapToast('🔒', '未解锁', '获得5枚徽章后解锁精灵传承', 1500); return; }
                 setSkillInheritModal({ mentor: null, apprentice: null, selectedMove: null });
               }} style={{
                 background:'linear-gradient(90deg, #7c3aed, #6d28d9)', color:'#fff', padding:'10px', borderRadius:'10px',
                 marginBottom:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between',
                 boxShadow:'0 4px 10px rgba(124,58,237,0.3)'
               }}>
                 <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                   <span style={{fontSize:'20px'}}>✨</span>
                   <div>
                     <div style={{fontWeight:'bold', fontSize:'14px'}}>精灵传承</div>
                     <div style={{fontSize:'10px', opacity:0.8}}>Lv.80+导师传授技能给学徒</div>
                   </div>
                 </div>
                 <div style={{background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px', fontSize:'12px'}}>
                   💎 {inventory.legacy_stone || 0}{badges.length < 5 ? ' 🔒' : ''}
                 </div>
               </div>

               <div style={{fontSize:'12px', fontWeight:'bold', marginBottom:'8px'}}>属性培养</div>
               <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px', marginBottom:'15px'}}>
                  {GROWTH_ITEMS.map(item => {
                    const count = inventory[item.id] || 0;
                    return (
                      <button key={item.id} disabled={count<=0} onClick={() => useGrowthItem(party.findIndex(p => p.uid === viewStatPet?.uid), item.id)}
                        style={{
                            minWidth:'60px', padding:'6px', border:'1px solid #eee', borderRadius:'8px', 
                            background: count>0?'#fff':'#f9f9f9', opacity: count>0?1:0.5,
                            display:'flex', flexDirection:'column', alignItems:'center'
                        }}>
                        <span style={{fontSize:'18px'}}>{item.emoji}</span>
                        <span style={{fontSize:'9px', color:'#666'}}>x{count}</span>
                      </button>
                    )
                  })}
               </div>

               {/* 进化家族树 */}
               {(() => {
                 const currentPet = viewStatPet;
                 const family = getFamilyTree(currentPet.id);
                 if (!family || (family.stage1.length === 0)) return null;

                 const EvoNode = ({ pet, method }) => {
                     const isCaught = caughtDex.includes(pet.id);
                     const isCurrent = pet.id === currentPet.id;
                     return (
                         <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'4px 0', minWidth:'60px'}}>
                             {method && (
                                 <div style={{
                                     fontSize:'9px', color:'#fff', marginBottom:'2px', 
                                     background:'#596875', padding:'1px 6px', borderRadius:'10px',
                                     zIndex:2, transform:'scale(0.9)'
                                 }}>
                                     {method}
                                 </div>
                             )}
                             <div 
                                onClick={() => {
                                    if (isCaught && !isCurrent) {
                                        const inParty = party.find(p => p.id === pet.id);
                                        if (inParty) setViewStatPet(inParty);
                                    }
                                }}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: (isCaught && !isCurrent) ? 'pointer' : 'default',
                                    overflow: 'hidden', padding: '2px',
                                    boxShadow: isCurrent ? '0 2px 6px rgba(33,150,243,0.3)' : 'none',
                                    transition: '0.2s'
                                }}
                             >
                                {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                             </div>
                             <div style={{
                                 fontSize:'10px', color: isCurrent?'#2196F3':'#666', marginTop:'2px', 
                                 fontWeight: isCurrent?'bold':'normal', 
                                 maxWidth:'56px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
                             }}>
                                {(isCaught || isCurrent) ? pet.name : '???'}
                             </div>
                         </div>
                     );
                 };

                 return (
                   <div style={{
                       width: '100%', padding: '15px 10px', 
                       background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                       marginTop:'15px', overflowX: 'auto'
                   }}>
                     <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                     <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                        <EvoNode pet={family.root} />
                        {family.stage1.length > 0 && (
                            <>
                                <div style={{color:'#6B7884', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                        {family.stage2.length > 0 && (
                            <>
                                <div style={{color:'#6B7884', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                        {family.stage3 && family.stage3.length > 0 && (
                            <>
                                <div style={{color:'#6B7884', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage3.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                     </div>
                   </div>
                 );
               })()}
            </div>

            {/* 5. 技能栏 */}
            <div className="pet-detail-moves" style={{padding:'0 20px 20px', borderTop:'1px solid #f0f0f0', marginTop:'auto'}}>
               <div style={{fontSize:'12px', fontWeight:'bold', margin:'15px 0 8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <span>已学会技能</span>
                 <button 
                    onClick={() => {
                      const currentParty = partyRef.current || [];
                      const pIndex = currentParty.findIndex(p => p.uid === viewStatPet?.uid);
                      if (pIndex >= 0) useEther(pIndex);
                    }}
                    style={{
                      fontSize:'11px', padding:'4px 10px', borderRadius:'12px', border:'none',
                      background: (inventory.meds?.ether || 0) > 0 ? '#E0F7FA' : '#f5f5f5',
                      color: (inventory.meds?.ether || 0) > 0 ? '#006064' : '#596875',
                      cursor: (inventory.meds?.ether || 0) > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: '600', display:'flex', alignItems:'center', gap:'4px'
                    }}
                 >
                   <span>🧴</span> 补剂 x{inventory.meds?.ether || 0}
                 </button>
               </div>

               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  {viewStatPet.moves.map((m, i) => (
                    <div key={i} style={{background:'#f5f7fa', padding:'8px', borderRadius:'6px', borderLeft:`3px solid ${TYPES[m.t]?.color}`}}>
                       <div style={{display:'flex', justifyContent:'space-between'}}>
                         <div style={{fontSize:'12px', fontWeight:'bold'}}>{m.name}</div>
                         <div style={{fontSize:'10px', color: m.pp===0?'#B42318':'#596875', fontWeight:'bold'}}>PP: {m.pp ?? 20}</div>
                       </div>
                       <div style={{fontSize:'10px', color:'#666', marginTop:'2px'}}>威力: {m.p ?? '—'}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
    );
  
}
