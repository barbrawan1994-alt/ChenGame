import React, { useRef, useEffect, useState, useMemo } from 'react';

// =========================================
// 精灵入场动画组件 (纯CSS)
// =========================================
export const AnimatedPetSprite = ({ pet, side, onAnimationComplete }) => {
  const spriteRef = useRef(null);

  useEffect(() => {
    if (onAnimationComplete) {
      const t = setTimeout(onAnimationComplete, 800);
      return () => clearTimeout(t);
    }
  }, [pet, onAnimationComplete]);

  const petName = pet?.name || pet?.petName || '?';
  const petIcon = pet?.icon || '🐾';

  return (
    <div
      ref={spriteRef}
      className={side === 'player' ? 'anim-entrance-player' : 'anim-entrance-enemy'}
      style={{
        position: 'relative',
        transform: side === 'player' ? 'scaleX(-1)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        minWidth: 60,
        minHeight: 60,
      }}
      title={petName}
    >
      {petIcon}
    </div>
  );
};

// =========================================
// 技能按钮增强组件 (暗色卡片风格)
// =========================================
const TYPE_COLORS = {
  FIRE:'#EF5350',WATER:'#42A5F5',GRASS:'#66BB6A',ELECTRIC:'#FDD835',
  ICE:'#26C6DA',FIGHT:'#EF5350',POISON:'#AB47BC',GROUND:'#FFA726',
  FLYING:'#42A5F5',PSYCHIC:'#EC407A',BUG:'#9CCC65',ROCK:'#8D6E63',
  GHOST:'#7E57C2',DRAGON:'#FF7043',STEEL:'#78909C',FAIRY:'#F06292',
  DARK:'#546E7A',NORMAL:'#90A4AE',GOD:'#FFD54F',HEAL:'#66BB6A',
  WIND:'#81D4FA',LIGHT:'#FFF176',COSMIC:'#1A237E',SOUND:'#AD1457',
  TIME:'#7E57C2',CHAOS:'#4A0072'
};
const TYPE_NAMES = {
  FIRE:'火',WATER:'水',GRASS:'草',ELECTRIC:'电',ICE:'冰',FIGHT:'斗',POISON:'毒',GROUND:'地',
  FLYING:'飞',PSYCHIC:'超',BUG:'虫',ROCK:'岩',GHOST:'鬼',DRAGON:'龙',STEEL:'钢',FAIRY:'妖',
  DARK:'恶',NORMAL:'普',GOD:'神',HEAL:'回',WIND:'风',LIGHT:'光',COSMIC:'宇',SOUND:'音',
  TIME:'时',CHAOS:'混'
};

/** 火影忍术查克拉性质 → 与 CHAKRA_NATURE_MAP 一致的展示用 emoji */
const JUTSU_NATURE_EMOJI = { FIRE: '🔥', WATER: '💧', LIGHTNING: '⚡', WIND: '🌀', EARTH: '🪨' };

const FORECAST_CHIP_STYLES = {
  immune: { background: 'rgba(30,41,59,0.86)', borderColor: 'rgba(203,213,225,0.78)' },
  ineffective: { background: 'rgba(30,41,59,0.86)', borderColor: 'rgba(203,213,225,0.78)' },
  resisted: { background: 'rgba(3,105,161,0.8)', borderColor: 'rgba(186,230,253,0.82)' },
  resist: { background: 'rgba(3,105,161,0.8)', borderColor: 'rgba(186,230,253,0.82)' },
  neutral: { background: 'rgba(71,85,105,0.8)', borderColor: 'rgba(226,232,240,0.72)' },
  effective: { background: 'rgba(21,128,61,0.82)', borderColor: 'rgba(187,247,208,0.82)' },
  super: { background: 'rgba(21,128,61,0.82)', borderColor: 'rgba(187,247,208,0.82)' },
  status: { background: 'rgba(109,40,217,0.82)', borderColor: 'rgba(221,214,254,0.82)' },
  change: { background: 'rgba(109,40,217,0.82)', borderColor: 'rgba(221,214,254,0.82)' },
};

export const EnhancedMoveButton = ({ move, onClick, disabled, disabledReason, index, forecast }) => {
  const [hovered, setHovered] = useState(false);

  const c = TYPE_COLORS[move.t] || '#90A4AE';
  const tName = TYPE_NAMES[move.t] || move.t;
  const moveNameLength = Array.from(String(move.name || '')).length;
  const moveNameFontSize = moveNameLength >= 6 ? '12px' : moveNameLength >= 4 ? '14px' : '16px';
  const maxPpCap = move.maxPP ?? move.maxPp ?? 15;
  const ppRatio = maxPpCap > 0 ? Math.max(0, Math.min(1, (move.pp || 0) / maxPpCap)) : 0;
  const ppColor = ppRatio > 0.5 ? '#4CAF50' : ppRatio > 0.2 ? '#FF9800' : '#F44336';
  const hasDesc = move.desc && move.desc.length > 0;
  const jutsuNatureEmoji = move.isJutsu && move.nature ? (JUTSU_NATURE_EMOJI[move.nature] || '') : '';
  const jutsuTooltipExtra = jutsuNatureEmoji ? `${jutsuNatureEmoji} 忍术` : '';
  const readableDisabledReason = disabledReason
    ? String(disabledReason).replace(/[()]/g, '').replace('CD:', '冷却 ')
    : '';
  const forecastA11yLabel = forecast?.a11yLabel ? String(forecast.a11yLabel) : '';
  const forecastSummary = forecast?.summary ? String(forecast.summary) : '';
  const descriptionText = forecastSummary && hasDesc
    ? `${forecastSummary} · ${move.desc}`
    : forecastSummary || move.desc || '';
  const hasDescriptionLine = forecast ? Boolean(descriptionText) : Boolean(hasDesc);
  const forecastChipStyle = FORECAST_CHIP_STYLES[forecast?.kind] || FORECAST_CHIP_STYLES.neutral;
  const forecastChipTitle = forecast
    ? [forecast.label, forecast.multiplierLabel, forecast.accuracyLabel].filter(Boolean).join(' · ')
    : '';
  const buttonTitle = [move.name, jutsuTooltipExtra, forecastA11yLabel, readableDisabledReason ? `无法使用：${readableDisabledReason}` : '', move.desc].filter(Boolean).join('\n');
  const buttonAriaLabel = [
    move.name,
    forecastA11yLabel,
    readableDisabledReason ? `无法使用：${readableDisabledReason}` : '',
  ].filter(Boolean).join('，');

  return (
    <button
      title={buttonTitle}
      className="move-btn-v2 move-card-polished"
      aria-label={buttonAriaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      style={{
        width:'100%', height:'100%', boxSizing:'border-box',
        background: disabled
          ? 'linear-gradient(135deg, #2d3748, #1a202c)'
          : `linear-gradient(135deg, ${c}dd, ${c}99)`,
        border: 'none',
        borderRadius:'10px', padding:'0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position:'relative', overflow:'hidden',
        transition:'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease',
        transform: hovered && !disabled ? 'translateY(-2px) scale(1.01)' : 'none',
        filter: hovered && !disabled ? 'brightness(1.1)' : 'none',
        boxShadow: hovered && !disabled
          ? `0 8px 24px ${c}50`
          : `0 3px 10px rgba(0,0,0,0.35)`,
        display:'flex', flexDirection:'column', alignItems:'stretch',
        textAlign:'left',
      }}
    >
      {/* 左侧高亮条 */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'4px',
        background:'rgba(255,255,255,0.5)',
        borderRadius:'10px 0 0 10px',
      }} />

      {/* 主内容 */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'8px 14px 7px 14px', gap:'4px', minHeight:0, overflow:'hidden',
        width:'100%', boxSizing:'border-box',
      }}>
        {/* 行1: 技能名 + 属性徽章 + 威力 */}
        <div style={{display:'flex', alignItems:'center', gap:'6px', width:'100%'}}>
          <span style={{
            fontSize:moveNameFontSize, fontWeight:'900', color:'#fff',
            letterSpacing:0, lineHeight:1.2,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            flex:1, minWidth:0,
            textShadow:'0 1px 3px rgba(0,0,0,0.4)',
          }}>{move.name}</span>
          {move.effectivenessHint ? (
            <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: 1 }} title="相对当前目标的属性效果">{move.effectivenessHint}</span>
          ) : null}
          {(move.isCursed || move.isExtra || move.isJutsu || move.isMartialArt || move.isFruitMove) && (
            <span style={{
              fontSize:'11px', padding:'2px 6px', borderRadius:'4px', flexShrink:0,
              background: move.isMartialArt ? 'rgba(198,40,40,0.5)' : move.isFruitMove ? 'rgba(255,152,0,0.5)' : 'rgba(0,0,0,0.3)', color:'#fff', fontWeight:'700', lineHeight:'1.4',
            }}>{move.isMartialArt ? '武' : move.isFruitMove ? '果' : move.isJutsu ? (move.isBijuu ? '兽' : (jutsuNatureEmoji ? `${jutsuNatureEmoji}忍` : '忍')) : move.isCursed ? '咒' : '装'}</span>
          )}
          <span style={{
            fontSize:'11px', padding:'2px 6px', borderRadius:'4px', flexShrink:0,
            background:'rgba(255,255,255,0.25)', color:'#fff', fontWeight:'800',
            lineHeight:'1.4', letterSpacing:'0.5px',
          }}>{tName}</span>
          <span style={{
            fontSize:'16px', fontWeight:'900', flexShrink:0,
            color:'#fff',
            minWidth:'26px', textAlign:'right',
            textShadow:'0 1px 3px rgba(0,0,0,0.3)',
          }}>{(move.p || move.power) > 0 ? (move.p || move.power) : '—'}</span>
        </div>

        {/* 行2: 技能预测与描述 */}
        {hasDescriptionLine && (
          <div style={{
            display:'flex', alignItems:'center', gap:'5px', minWidth:0,
            fontSize:'12px', lineHeight:'1.4',
            color:'rgba(255,255,255,0.85)',
            textShadow:'0 1px 2px rgba(0,0,0,0.3)',
          }}>
            {forecast?.label ? (
              <span title={forecastChipTitle || forecast.label} style={{
                fontSize:'10px', padding:'2px 6px', borderRadius:'4px', flexShrink:0,
                background:forecastChipStyle.background, border:`1px solid ${forecastChipStyle.borderColor}`,
                color:'#fff', fontWeight:'900', lineHeight:'1.3', whiteSpace:'nowrap',
                textShadow:'0 1px 2px rgba(0,0,0,0.45)',
              }}>{forecast.label}</span>
            ) : null}
            <span style={{ minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{descriptionText}</span>
          </div>
        )}

        {/* 行3: PP条 + CE消耗 */}
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'3px', width:'100%'}}>
          <div style={{
            flex:1, height:'6px', borderRadius:'3px',
            background:'rgba(0,0,0,0.25)', overflow:'hidden',
          }}>
            <div style={{
              width:`${ppRatio * 100}%`, height:'100%', borderRadius:'3px',
              background:'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
              transition:'width 0.3s',
            }} />
          </div>
          <span style={{
            fontSize:'12px', fontWeight:'800', flexShrink:0, lineHeight:1,
            color:'rgba(255,255,255,0.9)',
            textShadow:'0 1px 2px rgba(0,0,0,0.3)',
          }}>{move.pp <= 1 && move.pp > 0 && !move.isCursed ? '⚠' : ''}{Math.max(0, move.pp || 0)}/{maxPpCap}</span>
          {move.isCursed && move.ceCost > 0 && (
            <span style={{
              fontSize:'11px', color:'#fff', fontWeight:'700', flexShrink:0,
              background:'rgba(0,0,0,0.3)', padding:'2px 6px', borderRadius:'4px',
            }}>咒{move.ceCost}</span>
          )}
          {move.isJutsu && move.chakraCost > 0 && (
            <span style={{
              fontSize:'11px', color:'#fff', fontWeight:'700', flexShrink:0,
              background:'rgba(0,0,0,0.3)', padding:'2px 6px', borderRadius:'4px',
            }}>🍥{move.chakraCost}</span>
          )}
          {move.isMartialArt && move.momentumCost > 0 && (
            <span style={{
              fontSize:'11px', color:'#fff', fontWeight:'700', flexShrink:0,
              background:'rgba(198,40,40,0.4)', padding:'2px 6px', borderRadius:'4px',
            }}>⚔️{move.momentumCost}</span>
          )}
        </div>
        {disabled && readableDisabledReason ? (
          <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '2px', lineHeight: 1.2, fontWeight: 800 }}>无法使用 · {readableDisabledReason}</div>
        ) : null}
      </div>

      {/* hover 光效 */}
      {hovered && !disabled && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', borderRadius:'12px',
          background:`radial-gradient(ellipse at 30% 20%, ${c}20 0%, transparent 55%)`,
        }} />
      )}
    </button>
  );
};

// =========================================
// 技能释放特效组件 (纯CSS)
// =========================================
export const SkillCastEffect = ({ type, x, y, onComplete }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); if (onComplete) onComplete(); }, 600);
    return () => clearTimeout(t);
  }, [type, onComplete]);

  if (!visible) return null;
  const colors = { FIRE:'#FF5722', WATER:'#2196F3', ELECTRIC:'#FFC107', GRASS:'#4CAF50', ICE:'#00BCD4', FIGHT:'#E53935', POISON:'#9C27B0', GROUND:'#795548', FLYING:'#64B5F6', PSYCHIC:'#E91E63', BUG:'#8BC34A', ROCK:'#A1887F', GHOST:'#7E57C2', DRAGON:'#7C4DFF', DARK:'#424242', STEEL:'#90A4AE', FAIRY:'#F48FB1', WIND:'#81D4FA', LIGHT:'#FFF176', COSMIC:'#B388FF', SOUND:'#80DEEA', GOD:'#FFD54F', HEAL:'#66BB6A', NORMAL:'#BDBDBD', TIME:'#9575CD', CHAOS:'#D32F2F' };
  const c = colors[type] || '#fff';
  return (
    <div style={{position:'absolute', left:x||'50%', top:y||'50%', transform:'translate(-50%,-50%)', width:'40px', height:'40px', borderRadius:'50%', background:`radial-gradient(circle, ${c}80, transparent)`, animation:'shiny-flash 0.6s ease-out', pointerEvents:'none', zIndex:100}} />
  );
};

// =========================================
// 血条增强组件
// =========================================
export const EnhancedHPBar = ({ current, max, label }) => {
  const safeMax = Math.max(1, max || 1);
  const safeCurrent = Math.max(0, Math.min(safeMax, current || 0));
  const percentage = safeMax > 0 ? Math.min((safeCurrent / safeMax) * 100, 100) : 0;
  const isLow = percentage > 0 && percentage <= 20;

  const getColor = () => {
    if (percentage > 50) return ['#4CAF50', '#66BB6A'];
    if (percentage > 20) return ['#FFC107', '#FFD54F'];
    return ['#FF5252', '#FF8A80'];
  };

  const [c1, c2] = getColor();

  return (
    <div className={isLow ? 'hp-bar-shell hp-bar-low' : 'hp-bar-shell'} style={{ width: '100%', marginTop: '4px' }}>
      {label && <div style={{ fontSize: '12px', marginBottom: '2px', color: '#666' }}>{label}</div>}
      <div style={{
        width: '100%', height: '11px',
        background: 'rgba(0,0,0,0.08)', borderRadius: '6px',
        overflow: 'hidden', position: 'relative',
        boxShadow: isLow ? `0 0 12px ${c1}66` : 'inset 0 1px 2px rgba(0,0,0,0.18)'
      }}>
        <div
          style={{
            width: `${percentage}%`, height: '100%',
            background: `linear-gradient(90deg, ${c1} 0%, ${c2} 100%)`,
            borderRadius: '6px',
            boxShadow: `0 0 8px ${c1}60`,
            transition: 'width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff', fontSize: '9px', fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'
        }}>
          {Math.floor(safeCurrent).toLocaleString()} / {safeMax.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// =========================================
// 战斗消息增强组件
// =========================================
export const EnhancedBattleMessage = ({ message, type = 'info', logs = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const allLogs = logs.length > 0 ? logs : (message ? [message] : []);
  const hasHistory = allLogs.length > 2;
  const displayLogs = expanded ? allLogs.slice(1, 13) : [];
  const latest = allLogs[0] || '等待行动';
  const classifyLog = (msg) => {
    const text = String(msg || '');
    if (/暴击|效果拔群|捕获成功|胜利|获得|升级|进化|觉醒|结契|净化成功|封印成功|守护成功/.test(text)) return 'is-good';
    if (/没有效果|失败|晕厥|中毒|灼伤|麻痹|冰冻|睡眠|伤害|鬼化|污染|暴走/.test(text)) return 'is-danger';
    if (/回合|天气|领域|蓄力|交换|派出|呼吸法|封印|圣域|夜战/.test(text)) return 'is-info';
    return 'is-neutral';
  };

  return (
    <div className="battle-msg-queue" style={{ pointerEvents: 'auto', cursor: hasHistory ? 'pointer' : 'default' }} onClick={() => { if (hasHistory) setExpanded(e => !e); }}>
      <div className={`battle-msg-summary ${classifyLog(latest)}`}>
        <span>本回合</span>
        <strong>{latest}</strong>
      </div>
      {displayLogs.map((msg, i) => (
        <div key={`bmsg-${i}-${typeof msg === 'string' ? msg.slice(0,20) : i}`} className={`battle-msg-item ${i === 0 ? 'battle-msg-latest' : 'battle-msg-old'} ${classifyLog(msg)}`}
          style={{ opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.25) }}
        >
          {msg}
        </div>
      ))}
      {hasHistory && <div className="battle-msg-toggle">{expanded ? '▲ 收起历史' : `▼ 展开战斗历史 (${allLogs.length})`}</div>}
    </div>
  );
};

// =========================================
// 伤害数字动画组件
// =========================================
export const AnimatedDamageNumber = ({ damage, x, y, isCritical = false, type = 'NORMAL' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, [damage, x, y]);

  if (!visible) return null;

  return (
    <div
      className={`damage-number ${isCritical ? 'crit' : ''}`}
      style={{ left: x, top: y }}
    >
      {isCritical && 'CRIT! '}
      {typeof damage === 'number' ? damage.toLocaleString() : damage}
    </div>
  );
};

export default {
  AnimatedPetSprite,
  EnhancedMoveButton,
  AnimatedDamageNumber,
  SkillCastEffect,
  EnhancedHPBar,
  EnhancedBattleMessage
};
