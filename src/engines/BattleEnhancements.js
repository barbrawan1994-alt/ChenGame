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

  const typeColors = {
    FIRE: '#FF5252', WATER: '#2196F3', GRASS: '#4CAF50', ELECTRIC: '#FFEB3B',
    ICE: '#00BCD4', FIGHT: '#F44336', POISON: '#9C27B0', GROUND: '#FF9800',
    FLYING: '#81C784', PSYCHIC: '#E91E63', BUG: '#8BC34A', ROCK: '#9E9E9E',
    GHOST: '#9C27B0', DRAGON: '#FFC107', STEEL: '#607D8B', FAIRY: '#E91E63',
    DARK: '#616161', NORMAL: '#9E9E9E', GOD: '#FFD54F'
  };

  const color = typeColors[move.t] || '#9E9E9E';

  return (
    <button
      style={{
        background: isHovered && !disabled
          ? `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.98) 100%)`
          : `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,249,250,0.92) 100%)`,
        backdropFilter: 'blur(10px)',
        border: `2px solid ${color}`,
        borderRadius: '12px',
        padding: '8px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: isHovered && !disabled ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered && !disabled
          ? `0 8px 25px ${color}33, 0 0 15px ${color}22`
          : `0 4px 12px rgba(0,0,0,0.1)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
    >
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: '4px', background: color, borderRadius: '0 4px 4px 0'
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '4px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '3px' }}>
          {move.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#888', gap: '4px' }}>
          <span style={{
            background: `${color}18`, color: color, padding: '1px 6px',
            borderRadius: '4px', fontWeight: 600, fontSize: '9px'
          }}>{move.t}</span>
          <span>威力 {move.power || 0}</span>
          <span style={{ color: move.pp <= 5 ? '#FF5252' : '#888' }}>PP {move.pp}/{move.maxPp}</span>
        </div>
      </div>
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
export const EnhancedBattleMessage = ({ message, type = 'info' }) => {
  const typeStyles = {
    info: { background: 'rgba(33, 150, 243, 0.9)', color: '#fff' },
    success: { background: 'rgba(76, 175, 80, 0.9)', color: '#fff' },
    warning: { background: 'rgba(255, 193, 7, 0.9)', color: '#000' },
    error: { background: 'rgba(244, 67, 54, 0.9)', color: '#fff' }
  };

  return (
    <div style={{
      ...typeStyles[type],
      padding: '12px 20px', borderRadius: '12px',
      fontSize: '14px', fontWeight: 'bold', textAlign: 'center',
      marginBottom: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      animation: 'dmg-pop-v3 0.4s ease-out forwards'
    }}>
      {message}
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
