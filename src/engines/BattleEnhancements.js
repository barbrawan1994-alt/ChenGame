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

  return (
    <div
      ref={spriteRef}
      className={side === 'player' ? 'anim-entrance-player' : 'anim-entrance-enemy'}
      style={{
        position: 'relative',
        transform: side === 'player' ? 'scaleX(-1)' : 'none'
      }}
    />
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
  WIND:'#81D4FA',LIGHT:'#FFF176'
};
const TYPE_NAMES = {
  FIRE:'火',WATER:'水',GRASS:'草',ELECTRIC:'电',ICE:'冰',FIGHT:'斗',POISON:'毒',GROUND:'地',
  FLYING:'飞',PSYCHIC:'超',BUG:'虫',ROCK:'岩',GHOST:'鬼',DRAGON:'龙',STEEL:'钢',FAIRY:'妖',
  DARK:'恶',NORMAL:'普',GOD:'神',HEAL:'回',WIND:'风',LIGHT:'光',COSMIC:'宇',SOUND:'音'
};

/** 火影忍术查克拉性质 → 与 CHAKRA_NATURE_MAP 一致的展示用 emoji */
const JUTSU_NATURE_EMOJI = { FIRE: '🔥', WATER: '💧', LIGHTNING: '⚡', WIND: '🌀', EARTH: '🪨' };

export const EnhancedMoveButton = ({ move, onClick, disabled, disabledReason, index }) => {
  const [hovered, setHovered] = useState(false);

  const c = TYPE_COLORS[move.t] || '#90A4AE';
  const tName = TYPE_NAMES[move.t] || move.t;
  const maxPpCap = (move.maxPP || move.maxPp || 15);
  const ppRatio = maxPpCap > 0 ? Math.max(0, Math.min(1, (move.pp || 0) / maxPpCap)) : 0;
  const ppColor = ppRatio > 0.5 ? '#4CAF50' : ppRatio > 0.2 ? '#FF9800' : '#F44336';
  const hasDesc = move.desc && move.desc.length > 0;
  const jutsuNatureEmoji = move.isJutsu && move.nature ? (JUTSU_NATURE_EMOJI[move.nature] || '') : '';
  const jutsuTooltipExtra = jutsuNatureEmoji ? `${jutsuNatureEmoji} 忍术` : '';
  const readableDisabledReason = disabledReason
    ? String(disabledReason).replace(/[()]/g, '').replace('CD:', '冷却 ')
    : '';
  const buttonTitle = [move.name, jutsuTooltipExtra, readableDisabledReason ? `无法使用：${readableDisabledReason}` : '', move.desc].filter(Boolean).join('\n');

  return (
    <button
      title={buttonTitle}
      className="move-btn-v2 move-card-polished"
      aria-label={`${move.name}${readableDisabledReason ? `，无法使用：${readableDisabledReason}` : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      style={{
        width:'100%', height:'100%', boxSizing:'border-box',
        background: disabled
          ? 'linear-gradient(160deg, rgba(42,42,58,0.75), rgba(25,25,36,0.85))'
          : hovered
            ? `radial-gradient(circle at 18% 0%, ${c}2e, transparent 38%), linear-gradient(160deg, rgba(40,40,69,0.98), rgba(24,24,43,0.96))`
            : `linear-gradient(160deg, rgba(42,42,69,0.96), rgba(27,27,48,0.98))`,
        border:'none', borderRadius:'12px', padding:'0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        position:'relative', overflow:'hidden',
        transition:'transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease, opacity 0.16s ease',
        transform: hovered && !disabled ? 'translateY(-1px) scale(1.02)' : 'none',
        boxShadow: hovered && !disabled
          ? `0 8px 22px ${c}38, inset 0 0 0 1.5px ${c}90, inset 0 1px 0 rgba(255,255,255,0.08)`
          : `0 2px 8px rgba(0,0,0,0.42), inset 0 0 0 1px ${c}30, inset 0 1px 0 rgba(255,255,255,0.04)`,
        display:'flex', flexDirection:'column',
        textAlign:'left',
      }}
    >
      {/* 左侧类型色条 */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'5px',
        background:`linear-gradient(180deg, ${c}, ${c}88)`,
        borderRadius:'12px 0 0 12px',
        boxShadow:`0 0 8px ${c}40`,
      }} />

      {/* 顶部高光 */}
      <div style={{
        position:'absolute', top:0, left:4, right:0, height:'1px',
        background:`linear-gradient(90deg, ${c}40, transparent 60%)`,
      }} />

      {/* 主内容 */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'6px 9px 5px 14px', gap:'3px', minHeight:0, overflow:'hidden',
      }}>
        {/* 行1: 技能名 + 属性徽章 + 威力 */}
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
          <span style={{
            fontSize:'13px', fontWeight:'800', color:'#f8fafc',
            letterSpacing:'0.3px', lineHeight:1.2,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            flex:1, minWidth:0,
            textShadow:'0 1px 2px rgba(0,0,0,0.3)',
          }}>{move.name}</span>
          {move.effectivenessHint ? (
            <span style={{ fontSize: '12px', flexShrink: 0, lineHeight: 1 }} title="相对当前目标的属性效果">{move.effectivenessHint}</span>
          ) : null}
          {(move.isCursed || move.isExtra || move.isJutsu) && (
            <span style={{
              fontSize:'8px', padding:'1px 4px', borderRadius:'3px', flexShrink:0,
              background: move.isJutsu ? (move.isBijuu ? 'linear-gradient(135deg, #d84315, #ff6e40)' : 'linear-gradient(135deg, #e65100, #ff9100)') : move.isCursed ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : 'linear-gradient(135deg, #d97706, #f59e0b)',
              color:'#fff', fontWeight:'700', lineHeight:'1.5',
              boxShadow: move.isJutsu ? '0 0 6px rgba(255,111,0,0.4)' : move.isCursed ? '0 0 6px rgba(124,58,237,0.3)' : '0 0 6px rgba(217,119,6,0.3)',
            }}>{move.isJutsu ? (move.isBijuu ? '兽' : (jutsuNatureEmoji ? `${jutsuNatureEmoji}忍` : '忍')) : move.isCursed ? '咒' : '果'}</span>
          )}
          <span style={{
            fontSize:'9px', padding:'2px 5px', borderRadius:'4px', flexShrink:0,
            background:`${c}dd`, color:'#fff', fontWeight:'800',
            lineHeight:'1.4', letterSpacing:'0.5px',
            boxShadow:`0 1px 4px ${c}40`,
          }}>{tName}</span>
          <span style={{
            fontSize:'12px', fontWeight:'800', flexShrink:0,
            color: move.power > 0
              ? (move.power >= 150 ? '#FF5252' : move.power >= 100 ? c : 'rgba(255,255,255,0.7)')
              : 'rgba(255,255,255,0.2)',
            minWidth:'22px', textAlign:'right',
            textShadow: move.power >= 100 ? `0 0 6px ${c}40` : 'none',
          }}>{move.power > 0 ? move.power : '—'}</span>
        </div>

        {/* 行2: 技能描述 */}
        {hasDesc && (
          <div style={{
            fontSize:'9.5px', lineHeight:'1.35',
            color: hovered ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.42)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            transition:'color 0.15s',
          }}>{move.desc}</div>
        )}

        {/* 行3: PP条 + CE消耗 */}
        <div style={{display:'flex', alignItems:'center', gap:'5px', marginTop:'2px'}}>
          <div style={{
            flex:1, height:'3px', borderRadius:'2px',
            background:'rgba(255,255,255,0.1)', overflow:'hidden',
          }}>
            <div style={{
              width:`${ppRatio * 100}%`, height:'100%', borderRadius:'2px',
              background: `linear-gradient(90deg, ${ppColor}, ${ppColor}cc)`,
              transition:'width 0.3s',
              boxShadow: ppRatio <= 0.2 ? `0 0 4px ${ppColor}` : 'none',
            }} />
          </div>
          <span style={{
            fontSize:'9px', fontWeight:'600', flexShrink:0, lineHeight:1,
            color: ppRatio <= 0.2 ? '#F44336' : 'rgba(255,255,255,0.4)',
          }}>{move.pp <= 1 && move.pp > 0 && !move.isCursed ? '⚠' : ''}{Math.max(0, move.pp || 0)}/{maxPpCap}</span>
          {move.isCursed && move.ceCost > 0 && (
            <span style={{
              fontSize:'8px', color:'#a78bfa', fontWeight:'600', flexShrink:0,
              background:'rgba(124,58,237,0.2)', padding:'1px 4px', borderRadius:'3px',
              boxShadow:'0 0 4px rgba(124,58,237,0.15)',
            }}>咒{move.ceCost}</span>
          )}
          {move.isJutsu && move.chakraCost > 0 && (
            <span style={{
              fontSize:'8px', color:'#FFB74D', fontWeight:'600', flexShrink:0,
              background:'rgba(255,111,0,0.2)', padding:'1px 4px', borderRadius:'3px',
              boxShadow:'0 0 4px rgba(255,111,0,0.15)',
            }}>🍥{move.chakraCost}</span>
          )}
        </div>
        {disabled && readableDisabledReason ? (
          <div style={{ fontSize: '10px', color: '#FCA5A5', marginTop: '2px', lineHeight: 1.2, paddingLeft: '2px', fontWeight: 800 }}>无法使用 · {readableDisabledReason}</div>
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
  const colors = { FIRE:'#FF5722', WATER:'#2196F3', ELECTRIC:'#FFC107', GRASS:'#4CAF50', ICE:'#00BCD4', FIGHT:'#E53935', POISON:'#9C27B0', GROUND:'#795548', FLYING:'#64B5F6', PSYCHIC:'#E91E63', BUG:'#8BC34A', ROCK:'#A1887F', GHOST:'#7E57C2', DRAGON:'#7C4DFF', DARK:'#424242', STEEL:'#90A4AE', FAIRY:'#F48FB1' };
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
  const displayLogs = expanded ? allLogs.slice(1, 13) : allLogs.slice(1, 6);
  const latest = allLogs[0] || '等待行动';
  const classifyLog = (msg) => {
    const text = String(msg || '');
    if (/暴击|效果拔群|捕获成功|胜利|获得|升级|进化/.test(text)) return 'is-good';
    if (/没有效果|失败|晕厥|中毒|灼伤|麻痹|冰冻|睡眠|伤害/.test(text)) return 'is-danger';
    if (/回合|天气|领域|蓄力|交换|派出/.test(text)) return 'is-info';
    return 'is-neutral';
  };

  return (
    <div className="battle-msg-queue" style={{ pointerEvents: 'auto', cursor: allLogs.length > 5 ? 'pointer' : 'default' }} onClick={() => { if (allLogs.length > 5) setExpanded(e => !e); }}>
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
      {allLogs.length > 5 && <div className="battle-msg-toggle">{expanded ? '▲ 收起历史' : `▼ 展开战斗历史 (${allLogs.length})`}</div>}
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
