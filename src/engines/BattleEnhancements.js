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
    FIRE: '#FF5252', WATER: '#2196F3', GRASS: '#4CAF50', ELECTRIC: '#F9A825',
    ICE: '#00BCD4', FIGHT: '#D32F2F', POISON: '#9C27B0', GROUND: '#FF9800',
    FLYING: '#64B5F6', PSYCHIC: '#E91E63', BUG: '#8BC34A', ROCK: '#8D6E63',
    GHOST: '#7E57C2', DRAGON: '#FF7043', STEEL: '#78909C', FAIRY: '#F06292',
    DARK: '#455A64', NORMAL: '#90A4AE', GOD: '#FFD54F'
  };

  const typeNames = {
    FIRE:'火',WATER:'水',GRASS:'草',ELECTRIC:'电',ICE:'冰',FIGHT:'斗',POISON:'毒',GROUND:'地',
    FLYING:'飞',PSYCHIC:'超',BUG:'虫',ROCK:'岩',GHOST:'鬼',DRAGON:'龙',STEEL:'钢',FAIRY:'妖',
    DARK:'恶',NORMAL:'普',GOD:'神'
  };

  const color = typeColors[move.t] || '#90A4AE';
  const ppRatio = move.maxPp > 0 ? move.pp / move.maxPp : 0;
  const ppBarColor = ppRatio > 0.5 ? '#4CAF50' : ppRatio > 0.2 ? '#FF9800' : '#F44336';
  const isFruit = move.name && (move.isFruitMove || false);

  return (
    <button
      style={{
        background: isHovered && !disabled
          ? `linear-gradient(145deg, ${color}18 0%, rgba(20,20,35,0.95) 100%)`
          : `linear-gradient(145deg, ${color}0D 0%, rgba(15,15,25,0.92) 100%)`,
        backdropFilter: 'blur(12px)',
        border: `1.5px solid ${isHovered && !disabled ? `${color}60` : `${color}25`}`,
        borderRadius: '12px',
        padding: '8px 10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: isHovered && !disabled ? 'translateY(-1px) scale(1.02)' : 'none',
        boxShadow: isHovered && !disabled
          ? `0 6px 20px ${color}25, inset 0 1px 0 ${color}15`
          : `0 2px 8px rgba(0,0,0,0.2)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => { if (!disabled && onClick) onClick(); }}
      disabled={disabled}
    >
      {/* 左侧属性色条 */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0,
        width:'3px', background:`linear-gradient(180deg, ${color}, ${color}60)`,
        borderRadius:'3px 0 0 3px'
      }} />

      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', paddingLeft:'6px', gap:'4px' }}>
        {/* 名称 + 属性标签 */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ fontSize:'13px', fontWeight:'800', color:'#fff', letterSpacing:'0.3px' }}>
            {move.name}
          </span>
          <span style={{
            fontSize:'9px', padding:'1px 5px', borderRadius:'4px',
            background: color, color:'#fff', fontWeight:'700',
            lineHeight:'1.4', flexShrink:0
          }}>{typeNames[move.t] || move.t}</span>
        </div>

        {/* 威力 + PP */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:'2px' }}>
            <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.35)' }}>威力</span>
            <span style={{ fontSize:'14px', fontWeight:'900', color: move.power > 0 ? '#fff' : 'rgba(255,255,255,0.25)', lineHeight:1 }}>
              {move.power > 0 ? move.power : '-'}
            </span>
          </div>
          {/* PP bar */}
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:'4px' }}>
            <div style={{ flex:1, height:'4px', borderRadius:'2px', background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
              <div style={{ width:`${ppRatio * 100}%`, height:'100%', borderRadius:'2px', background:ppBarColor, transition:'width 0.3s' }} />
            </div>
            <span style={{ fontSize:'9px', color: move.pp <= 3 ? '#F44336' : 'rgba(255,255,255,0.4)', fontWeight:'600', flexShrink:0 }}>
              {move.pp}/{move.maxPp}
            </span>
          </div>
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
