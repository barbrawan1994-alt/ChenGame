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

export const EnhancedMoveButton = ({ move, onClick, disabled, disabledReason, forecast }) => {
  const c = TYPE_COLORS[move.t] || '#90A4AE';
  const tName = TYPE_NAMES[move.t] || move.t;
  const maxPpCap = move.maxPP ?? move.maxPp ?? 15;
  const pp = Math.max(0, move.pp || 0);
  const readableDisabledReason = disabledReason
    ? String(disabledReason).replace(/[()]/g, '').replace('CD:', '冷却 ')
    : '';
  const forecastA11yLabel = forecast?.a11yLabel ? String(forecast.a11yLabel) : '';
  const jutsuTooltipExtra = move.isJutsu && move.nature ? (JUTSU_NATURE_EMOJI[move.nature] || '') : '';
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
  const category = move.isMartialArt ? '武学' : move.isFruitMove ? '果实' : move.isJutsu ? '忍术' : move.isCursed ? '咒术' : move.isExtra ? '装备' : '';

  return (
    <button
      type="button"
      title={buttonTitle}
      className="battle-move-button"
      aria-label={buttonAriaLabel}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      style={{ '--move-accent': c }}
    >
      <span className="battle-move-heading">
        <strong className="battle-move-name">{move.name}</strong>
        <span className="battle-move-type">{tName}</span>
      </span>
      <span className="battle-move-stats">
        <span>威力 <b>{(move.p ?? move.power ?? 0) > 0 ? (move.p ?? move.power) : '-'}</b></span>
        <span className={pp <= 1 ? 'is-low' : ''}>PP <b>{pp}/{maxPpCap}</b></span>
        {category && <span className="battle-move-category">{category}</span>}
      </span>
      <span className="battle-move-forecast">
        {forecast?.label ? (
          <span className="battle-move-effect" title={forecastChipTitle || forecast.label}
            style={{ background: forecastChipStyle.background, borderColor: forecastChipStyle.borderColor }}>{forecast.label}</span>
        ) : null}
        <span>{[forecast?.multiplierLabel, forecast?.accuracyLabel].filter(Boolean).join(' · ')}</span>
      </span>
      <span className="battle-move-note">
        {disabled && readableDisabledReason ? <span className="battle-move-unavailable">{readableDisabledReason}</span> : (
          <span>{move.desc || forecast?.targetName || ''}</span>
        )}
        {move.isCursed && move.ceCost > 0 && <b>咒力 {move.ceCost}</b>}
        {move.isJutsu && move.chakraCost > 0 && <b>查克拉 {move.chakraCost}</b>}
        {move.isMartialArt && move.momentumCost > 0 && <b>气势 {move.momentumCost}</b>}
      </span>
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
