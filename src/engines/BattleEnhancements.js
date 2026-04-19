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
  DARK:'恶',NORMAL:'普',GOD:'神',HEAL:'回',WIND:'风',LIGHT:'光'
};

/** 火影忍术查克拉性质 → 与 CHAKRA_NATURE_MAP 一致的展示用 emoji */
const JUTSU_NATURE_EMOJI = { FIRE: '🔥', WATER: '💧', LIGHTNING: '⚡', WIND: '🌀', EARTH: '🪨' };

export const EnhancedMoveButton = ({ move, onClick, disabled, index }) => {
  const [hovered, setHovered] = useState(false);

  const c = TYPE_COLORS[move.t] || '#90A4AE';
  const tName = TYPE_NAMES[move.t] || move.t;
  const maxPpCap = (move.maxPP || move.maxPp || 15);
  const ppRatio = maxPpCap > 0 ? move.pp / maxPpCap : 0;
  const ppColor = ppRatio > 0.5 ? '#4CAF50' : ppRatio > 0.2 ? '#FF9800' : '#F44336';
  const hasDesc = move.desc && move.desc.length > 0;
  const jutsuNatureEmoji = move.isJutsu && move.nature ? (JUTSU_NATURE_EMOJI[move.nature] || '') : '';
  const jutsuTooltipExtra = jutsuNatureEmoji ? `${jutsuNatureEmoji} 忍术` : '';
  const buttonTitle = [move.name, jutsuTooltipExtra, move.desc].filter(Boolean).join('\n');

  return (
    <button
      title={buttonTitle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      style={{
        width:'100%', height:'100%', boxSizing:'border-box',
        background: disabled
          ? 'linear-gradient(160deg, #2a2a3a, #222233)'
          : hovered
            ? `linear-gradient(160deg, ${c}18, ${c}0a)`
            : `linear-gradient(160deg, #2a2a45, #30304d)`,
        border:'none', borderRadius:'10px', padding:'0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        position:'relative', overflow:'hidden',
        transition:'all 0.15s ease',
        transform: hovered && !disabled ? 'translateY(-1px) scale(1.02)' : 'none',
        boxShadow: hovered && !disabled
          ? `0 4px 16px ${c}40, inset 0 0 0 1.5px ${c}80`
          : `0 2px 6px rgba(0,0,0,0.4), inset 0 0 0 1px ${c}30`,
        display:'flex', flexDirection:'column',
        textAlign:'left',
      }}
    >
      {/* 左侧类型色条 */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'4px',
        background:`linear-gradient(180deg, ${c}, ${c}88)`,
        borderRadius:'10px 0 0 10px',
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
        padding:'5px 8px 4px 12px', gap:'2px', minHeight:0, overflow:'hidden',
      }}>
        {/* 行1: 技能名 + 属性徽章 + 威力 */}
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
          <span style={{
            fontSize:'13px', fontWeight:'700', color:'#eee',
            letterSpacing:'0.3px', lineHeight:1.2,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            flex:1, minWidth:0,
            textShadow:'0 1px 2px rgba(0,0,0,0.3)',
          }}>{move.name}</span>
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
            background:`${c}dd`, color:'#fff', fontWeight:'700',
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
            fontSize:'9px', lineHeight:'1.3',
            color: hovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)',
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
          }}>{move.pp <= 1 && move.pp > 0 && !move.isCursed ? '⚠' : ''}{move.pp}/{maxPpCap}</span>
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
      </div>

      {/* hover 光效 */}
      {hovered && !disabled && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', borderRadius:'10px',
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
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const getColor = () => {
    if (percentage > 50) return ['#4CAF50', '#66BB6A'];
    if (percentage > 20) return ['#FFC107', '#FFD54F'];
    return ['#FF5252', '#FF8A80'];
  };

  const [c1, c2] = getColor();

  return (
    <div style={{ width: '100%', marginTop: '4px' }}>
      {label && <div style={{ fontSize: '12px', marginBottom: '2px', color: '#666' }}>{label}</div>}
      <div style={{
        width: '100%', height: '10px',
        background: 'rgba(0,0,0,0.08)', borderRadius: '6px',
        overflow: 'hidden', position: 'relative'
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
          {Math.floor(current).toLocaleString()} / {max.toLocaleString()}
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
  const displayLogs = expanded ? allLogs.slice(0, 12) : allLogs.slice(0, 6);

  return (
    <div className="battle-msg-queue" style={{ pointerEvents: 'auto', cursor: allLogs.length > 6 ? 'pointer' : 'default' }} onClick={() => { if (allLogs.length > 6) setExpanded(e => !e); }}>
      {displayLogs.map((msg, i) => (
        <div key={`bmsg-${i}-${typeof msg === 'string' ? msg.slice(0,20) : i}`} className={`battle-msg-item ${i === 0 ? 'battle-msg-latest' : 'battle-msg-old'}`}
          style={{ opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.25) }}
        >
          {msg}
        </div>
      ))}
      {allLogs.length > 6 && <div style={{fontSize:'9px',textAlign:'center',color:'rgba(255,255,255,0.5)',padding:'2px 0'}}>{expanded ? '▲ 收起' : `▼ 展开全部 (${allLogs.length})`}</div>}
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
