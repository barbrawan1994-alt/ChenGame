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
// 技能按钮增强组件
// =========================================
export const EnhancedMoveButton = ({ move, onClick, disabled, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = React.useRef(null);

  const typeColors = {
    FIRE: '#FF5252', WATER: '#2196F3', GRASS: '#4CAF50', ELECTRIC: '#F9A825',
    ICE: '#00BCD4', FIGHT: '#D32F2F', POISON: '#9C27B0', GROUND: '#FF9800',
    FLYING: '#64B5F6', PSYCHIC: '#E91E63', BUG: '#8BC34A', ROCK: '#8D6E63',
    GHOST: '#7E57C2', DRAGON: '#FF7043', STEEL: '#78909C', FAIRY: '#F06292',
    DARK: '#455A64', NORMAL: '#90A4AE', GOD: '#FFD54F'
  };
  const typeBgs = {
    FIRE:'linear-gradient(135deg,#fff5f5,#fff0ee)', WATER:'linear-gradient(135deg,#f0f7ff,#e8f4fd)',
    GRASS:'linear-gradient(135deg,#f2fbf2,#e8f5e9)', ELECTRIC:'linear-gradient(135deg,#fffde7,#fff9c4)',
    ICE:'linear-gradient(135deg,#f0fbff,#e0f7fa)', FIGHT:'linear-gradient(135deg,#fef0f0,#ffebee)',
    POISON:'linear-gradient(135deg,#f9f0ff,#f3e5f5)', GROUND:'linear-gradient(135deg,#fff8f0,#fff3e0)',
    FLYING:'linear-gradient(135deg,#f0f4ff,#e3f2fd)', PSYCHIC:'linear-gradient(135deg,#fff0f5,#fce4ec)',
    BUG:'linear-gradient(135deg,#f5fbf0,#f1f8e9)', ROCK:'linear-gradient(135deg,#f5f0eb,#efebe9)',
    GHOST:'linear-gradient(135deg,#f3f0ff,#ede7f6)', DRAGON:'linear-gradient(135deg,#fff3f0,#fbe9e7)',
    STEEL:'linear-gradient(135deg,#f0f2f5,#eceff1)', FAIRY:'linear-gradient(135deg,#fff0f6,#fce4ec)',
    DARK:'linear-gradient(135deg,#f0f1f3,#eceff1)', NORMAL:'linear-gradient(135deg,#f5f6f8,#eceff1)',
    GOD:'linear-gradient(135deg,#fffef0,#fff8e1)'
  };
  const typeNames = {
    FIRE:'火',WATER:'水',GRASS:'草',ELECTRIC:'电',ICE:'冰',FIGHT:'斗',POISON:'毒',GROUND:'地',
    FLYING:'飞',PSYCHIC:'超',BUG:'虫',ROCK:'岩',GHOST:'鬼',DRAGON:'龙',STEEL:'钢',FAIRY:'妖',
    DARK:'恶',NORMAL:'普',GOD:'神'
  };
  const typeIcons = {
    FIRE:'🔥',WATER:'💧',GRASS:'🌿',ELECTRIC:'⚡',ICE:'❄',FIGHT:'👊',POISON:'☠',GROUND:'🌍',
    FLYING:'🌀',PSYCHIC:'🔮',BUG:'🐛',ROCK:'🪨',GHOST:'👻',DRAGON:'🐉',STEEL:'⚙',FAIRY:'✨',
    DARK:'🌑',NORMAL:'⭐',GOD:'👑',HEAL:'💚'
  };

  const color = typeColors[move.t] || '#90A4AE';
  const bg = typeBgs[move.t] || 'linear-gradient(135deg,#f5f6f8,#eceff1)';
  const ppRatio = move.maxPp > 0 ? move.pp / move.maxPp : 0;
  const ppColor = ppRatio > 0.5 ? '#43a047' : ppRatio > 0.2 ? '#ef6c00' : '#d32f2f';

  const isCursed = move.isCursed;
  const isExtra = move.isExtra;
  const hasDesc = move.desc && move.desc.length > 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasDesc) {
      timerRef.current = setTimeout(() => setShowTooltip(true), 400);
    }
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          width: '100%',
          background: disabled ? '#f0f0f0' : bg,
          border: 'none',
          borderRadius: '12px',
          padding: '0',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
          transform: isHovered && !disabled ? 'translateY(-2px) scale(1.02)' : 'none',
          boxShadow: isHovered && !disabled
            ? `0 6px 20px ${color}30, 0 2px 6px ${color}18`
            : `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`,
          outline: isHovered && !disabled ? `2px solid ${color}50` : '1.5px solid rgba(0,0,0,0.06)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => { if (!disabled && onClick) onClick(); }}
        disabled={disabled}
      >
        {/* top color bar */}
        <div style={{
          height: '3px',
          background: `linear-gradient(90deg, ${color}, ${color}90, ${color}40)`,
          borderRadius: '12px 12px 0 0'
        }} />

        <div style={{ padding: '6px 10px 7px', display:'flex', flexDirection:'column', gap:'4px' }}>
          {/* row 1: name + type badge */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'4px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', minWidth:0, flex:1 }}>
              <span style={{
                fontSize:'13px', fontWeight:'800', color:'#1a1a2e',
                letterSpacing:'0.3px', lineHeight:1.2,
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
              }}>
                {move.name}
              </span>
              {(isCursed || isExtra) && (
                <span style={{
                  fontSize:'8px', padding:'1px 4px', borderRadius:'3px', flexShrink:0,
                  background: isCursed ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                  color:'#fff', fontWeight:'700', lineHeight:'1.4'
                }}>{isCursed ? '咒' : '果'}</span>
              )}
            </div>
            <span style={{
              fontSize:'9px', padding:'2px 7px', borderRadius:'6px', flexShrink:0,
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color:'#fff', fontWeight:'700', lineHeight:'1.4',
              boxShadow: `0 1px 3px ${color}30`
            }}>
              {typeIcons[move.t] || ''} {typeNames[move.t] || move.t}
            </span>
          </div>

          {/* row 2: power + acc + PP */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            {/* power */}
            <div style={{
              display:'flex', alignItems:'center', gap:'2px',
              background: move.power > 0 ? `${color}10` : 'transparent',
              borderRadius:'6px', padding:'1px 6px'
            }}>
              <span style={{ fontSize:'9px', color:'#888', fontWeight:'600' }}>威力</span>
              <span style={{
                fontSize:'15px', fontWeight:'900', lineHeight:1,
                color: move.power > 0
                  ? (move.power >= 150 ? '#c62828' : move.power >= 100 ? color : '#444')
                  : '#bbb',
                textShadow: move.power >= 150 ? '0 0 6px rgba(198,40,40,0.2)' : 'none'
              }}>
                {move.power > 0 ? move.power : '—'}
              </span>
            </div>

            {/* PP bar + text */}
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:'4px' }}>
              <div style={{
                flex:1, height:'4px', borderRadius:'2px',
                background:'rgba(0,0,0,0.06)', overflow:'hidden'
              }}>
                <div style={{
                  width:`${ppRatio * 100}%`, height:'100%', borderRadius:'2px',
                  background: `linear-gradient(90deg, ${ppColor}, ${ppColor}cc)`,
                  transition:'width 0.3s ease'
                }} />
              </div>
              <span style={{
                fontSize:'10px', fontWeight:'700', flexShrink:0, lineHeight:1,
                color: ppRatio <= 0.2 ? '#d32f2f' : '#777'
              }}>
                {move.pp}/{move.maxPp}
              </span>
            </div>
          </div>

          {/* row 3: CE cost (for cursed moves) */}
          {isCursed && move.ceCost > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'3px' }}>
              <span style={{ fontSize:'9px', color:'#7c3aed', fontWeight:'700' }}>
                咒力消耗 {move.ceCost}
              </span>
            </div>
          )}
        </div>

        {/* hover glow */}
        {isHovered && !disabled && (
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none',
            background: `radial-gradient(ellipse at 50% 0%, ${color}12 0%, transparent 70%)`,
            borderRadius:'12px'
          }} />
        )}
      </button>

      {/* tooltip */}
      {showTooltip && hasDesc && !disabled && (
        <div style={{
          position:'absolute',
          bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)',
          background:'rgba(15,15,25,0.94)',
          backdropFilter:'blur(12px)',
          color:'#eee', fontSize:'11px', lineHeight:'1.5',
          padding:'8px 14px', borderRadius:'10px',
          boxShadow:`0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${color}30`,
          whiteSpace:'normal', maxWidth:'220px', minWidth:'120px',
          zIndex:999, pointerEvents:'none',
          animation:'tooltipFadeIn 0.15s ease'
        }}>
          <div style={{ fontWeight:'700', color:color, marginBottom:'3px', fontSize:'12px' }}>
            {typeIcons[move.t] || ''} {move.name}
          </div>
          <div style={{ color:'#ccc' }}>{move.desc}</div>
          {move.power > 0 && (
            <div style={{ marginTop:'4px', display:'flex', gap:'8px', fontSize:'10px', color:'#999' }}>
              <span>威力 <b style={{color:'#fff'}}>{move.power}</b></span>
              {move.acc && <span>命中 <b style={{color:'#fff'}}>{move.acc}</b></span>}
              <span>PP <b style={{color:'#fff'}}>{move.pp}/{move.maxPp}</b></span>
            </div>
          )}
          <div style={{
            position:'absolute', bottom:'-5px', left:'50%', transform:'translateX(-50%) rotate(45deg)',
            width:'10px', height:'10px', background:'rgba(15,15,25,0.94)',
            borderRight:'1px solid ' + color + '30',
            borderBottom:'1px solid ' + color + '30',
          }} />
        </div>
      )}
    </div>
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
