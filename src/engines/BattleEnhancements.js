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
  DARK:'#546E7A',NORMAL:'#90A4AE',GOD:'#FFD54F',HEAL:'#66BB6A'
};
const TYPE_NAMES = {
  FIRE:'火',WATER:'水',GRASS:'草',ELECTRIC:'电',ICE:'冰',FIGHT:'斗',POISON:'毒',GROUND:'地',
  FLYING:'飞',PSYCHIC:'超',BUG:'虫',ROCK:'岩',GHOST:'鬼',DRAGON:'龙',STEEL:'钢',FAIRY:'妖',
  DARK:'恶',NORMAL:'普',GOD:'神',HEAL:'回'
};

export const EnhancedMoveButton = ({ move, onClick, disabled, index }) => {
  const [hovered, setHovered] = useState(false);

  const c = TYPE_COLORS[move.t] || '#90A4AE';
  const tName = TYPE_NAMES[move.t] || move.t;
  const ppRatio = move.maxPp > 0 ? move.pp / move.maxPp : 0;
  const ppColor = ppRatio > 0.5 ? '#4CAF50' : ppRatio > 0.2 ? '#FF9800' : '#F44336';
  const hasDesc = move.desc && move.desc.length > 0;

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      style={{
        width:'100%', height:'100%', boxSizing:'border-box',
        background: disabled
          ? 'linear-gradient(160deg, #3a3a3a, #2a2a2a)'
          : `linear-gradient(160deg, #1c1c30, #252540)`,
        border:'none', borderRadius:'10px', padding:'0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        position:'relative', overflow:'hidden',
        transition:'all 0.15s ease',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !disabled
          ? `0 6px 20px ${c}35, inset 0 0 0 1.5px ${c}90`
          : `0 2px 8px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`,
        display:'flex', flexDirection:'column',
        textAlign:'left',
      }}
    >
      {/* 左侧类型色条 */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'3px',
        background:`linear-gradient(180deg, ${c}, ${c}66)`,
        borderRadius:'10px 0 0 10px',
      }} />

      {/* 主内容 */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'4px 8px 4px 10px', gap:'1px', minHeight:0, overflow:'hidden',
      }}>
        {/* 行1: 技能名 + 属性徽章 + 威力 */}
        <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
          {/* 名称 */}
          <span style={{
            fontSize:'12px', fontWeight:'700', color:'#f0f0f0',
            letterSpacing:'0.3px', lineHeight:1.2,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            flex:1, minWidth:0,
          }}>{move.name}</span>
          {/* 特殊标签 */}
          {(move.isCursed || move.isExtra) && (
            <span style={{
              fontSize:'7px', padding:'1px 3px', borderRadius:'3px', flexShrink:0,
              background: move.isCursed ? '#7c3aed' : '#d97706',
              color:'#fff', fontWeight:'700', lineHeight:'1.5',
            }}>{move.isCursed ? '咒' : '果'}</span>
          )}
          {/* 属性 */}
          <span style={{
            fontSize:'8px', padding:'1px 4px', borderRadius:'3px', flexShrink:0,
            background:`${c}cc`, color:'#fff', fontWeight:'700',
            lineHeight:'1.5', letterSpacing:'0.5px',
          }}>{tName}</span>
          {/* 威力数字 */}
          <span style={{
            fontSize:'11px', fontWeight:'800', flexShrink:0,
            color: move.power > 0
              ? (move.power >= 150 ? '#FF5252' : move.power >= 100 ? c : 'rgba(255,255,255,0.6)')
              : 'rgba(255,255,255,0.2)',
            minWidth:'20px', textAlign:'right',
          }}>{move.power > 0 ? move.power : '—'}</span>
        </div>

        {/* 行2: 技能描述 (始终可见) */}
        {hasDesc && (
          <div style={{
            fontSize:'8px', lineHeight:'1.3',
            color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            transition:'color 0.15s',
          }}>{move.desc}</div>
        )}

        {/* 行3: PP条 + CE消耗 */}
        <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'1px'}}>
          {/* PP mini bar */}
          <div style={{
            flex:1, height:'2px', borderRadius:'1px',
            background:'rgba(255,255,255,0.07)', overflow:'hidden',
          }}>
            <div style={{
              width:`${ppRatio * 100}%`, height:'100%', borderRadius:'1px',
              background: ppColor,
              transition:'width 0.3s',
            }} />
          </div>
          <span style={{
            fontSize:'8px', fontWeight:'600', flexShrink:0, lineHeight:1,
            color: ppRatio <= 0.2 ? '#F44336' : 'rgba(255,255,255,0.3)',
          }}>{move.pp}/{move.maxPp}</span>
          {move.isCursed && move.ceCost > 0 && (
            <span style={{
              fontSize:'7px', color:'#a78bfa', fontWeight:'600', flexShrink:0,
              background:'rgba(124,58,237,0.15)', padding:'0 3px', borderRadius:'2px',
            }}>咒{move.ceCost}</span>
          )}
        </div>
      </div>

      {/* hover 光效 */}
      {hovered && !disabled && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', borderRadius:'10px',
          background:`radial-gradient(ellipse at 30% 20%, ${c}14 0%, transparent 55%)`,
        }} />
      )}
    </button>
  );
};

// =========================================
// 技能释放特效组件 (纯CSS)
// =========================================
export const SkillCastEffect = ({ type, x, y, onComplete }) => {
  useEffect(() => {
    const t = setTimeout(() => { if (onComplete) onComplete(); }, 1200);
    return () => clearTimeout(t);
  }, [type, onComplete]);

  return null;
};

// =========================================
// 血条增强组件
// =========================================
export const EnhancedHPBar = ({ current, max, label }) => {
  const percentage = Math.min((current / max) * 100, 100);

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
          {Math.floor(current)} / {max}
        </div>
      </div>
    </div>
  );
};

// =========================================
// 战斗消息增强组件
// =========================================
export const EnhancedBattleMessage = ({ message, type = 'info', logs = [] }) => {
  const allLogs = logs.length > 0 ? logs : (message ? [message] : []);
  const displayLogs = allLogs.slice(0, 4);

  return (
    <div className="battle-msg-queue">
      {displayLogs.map((msg, i) => (
        <div key={`${msg}-${i}`} className={`battle-msg-item ${i === 0 ? 'battle-msg-latest' : 'battle-msg-old'}`}
          style={{ opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.25) }}
        >
          {msg}
        </div>
      ))}
    </div>
  );
};

// =========================================
// 伤害数字动画组件
// =========================================
export const AnimatedDamageNumber = ({ damage, x, y, isCritical = false, type = 'NORMAL' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`damage-number ${isCritical ? 'crit' : ''}`}
      style={{ left: x, top: y }}
    >
      {isCritical && 'CRIT! '}
      {damage}
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
