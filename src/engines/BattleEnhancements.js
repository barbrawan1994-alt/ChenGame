// =========================================
// 战斗界面增强 - 集成所有引擎
// =========================================

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSpring, animated } from '@react-spring/web';
import { CanvasParticleSystem, ParticlePresets } from './ParticleEngine';
import { EnhancedButton, EnhancedProgressBar } from './UIEnhancement';

// =========================================
// 精灵入场动画组件
// =========================================
export const AnimatedPetSprite = ({ pet, side, onAnimationComplete }) => {
  const spriteRef = useRef(null);
  const [particleSystem, setParticleSystem] = useState(null);

  useEffect(() => {
    if (spriteRef.current) {
      // 入场动画
      gsap.fromTo(spriteRef.current,
        { scale: 0, rotation: -180, opacity: 0, y: 50 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          onComplete: () => {
            if (onAnimationComplete) onAnimationComplete();
          }
        }
      );

      // 持续浮动
      gsap.to(spriteRef.current, {
        y: -10,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, [pet, onAnimationComplete]);

  return (
    <div
      ref={spriteRef}
      style={{
        position: 'relative',
        transform: side === 'player' ? 'scaleX(-1)' : 'none'
      }}
    >
      {/* 粒子系统容器 */}
      <canvas
        id={`particle-canvas-${side}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
    </div>
  );
};

// =========================================
// 技能按钮增强组件
// =========================================
export const EnhancedMoveButton = ({ move, onClick, disabled, index }) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const style = useSpring({
    scale: isHovered && !disabled ? 1.05 : 1,
    boxShadow: isHovered && !disabled
      ? '0 8px 25px rgba(0,0,0,0.3)'
      : '0 4px 15px rgba(0,0,0,0.2)',
    config: { tension: 300, friction: 20 }
  });

  const handleClick = () => {
    if (!disabled && onClick) {
      // 点击动画
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
      onClick();
    }
  };

  const typeColors = {
    FIRE: '#FF5252',
    WATER: '#2196F3',
    GRASS: '#4CAF50',
    ELECTRIC: '#FFEB3B',
    ICE: '#00BCD4',
    FIGHT: '#F44336',
    POISON: '#9C27B0',
    GROUND: '#FF9800',
    FLYING: '#81C784',
    PSYCHIC: '#E91E63',
    BUG: '#8BC34A',
    ROCK: '#9E9E9E',
    GHOST: '#9C27B0',
    DRAGON: '#FFC107',
    STEEL: '#607D8B',
    FAIRY: '#E91E63',
    NORMAL: '#9E9E9E'
  };

  return (
    <animated.button
      ref={buttonRef}
      style={{
        ...style,
        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)`,
        backdropFilter: 'blur(10px)',
        border: `2px solid ${typeColors[move.t] || '#e0e0e0'}`,
        borderRadius: '12px',
        padding: '8px 12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transform: style.scale.to(s => `scale(${s})`),
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* 类型色条 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '15%',
        bottom: '15%',
        width: '5px',
        background: typeColors[move.t] || '#ccc',
        borderRadius: '0 4px 4px 0'
      }} />
      
      {/* 内容 */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
          {move.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#666', flexWrap: 'wrap', gap: '2px' }}>
          <span style={{fontSize: '10px'}}>{move.t}</span>
          <span style={{fontSize: '10px'}}>威力{move.power || 0}</span>
          <span style={{fontSize: '10px', color: move.pp <= 5 ? '#FF5252' : '#666'}}>PP {move.pp}/{move.maxPp}</span>
        </div>
      </div>
    </animated.button>
  );
};

// =========================================
// 伤害数字动画组件
// =========================================
export const AnimatedDamageNumber = ({ damage, x, y, isCritical = false, type = 'NORMAL' }) => {
  const [visible, setVisible] = useState(true);
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      // 伤害数字动画
      gsap.to(elementRef.current, {
        y: -100,
        opacity: 0,
        scale: isCritical ? 1.5 : 1.2,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => setVisible(false)
      });
    }
  }, []);

  if (!visible) return null;

  const typeColors = {
    FIRE: '#FF5252',
    WATER: '#2196F3',
    GRASS: '#4CAF50',
    ELECTRIC: '#FFEB3B',
    NORMAL: '#fff'
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize: isCritical ? '32px' : '24px',
        fontWeight: 'bold',
        color: typeColors[type] || '#fff',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      {isCritical && <span style={{ color: '#FFD700' }}>💥</span>}
      {damage}
    </div>
  );
};

// =========================================
// 技能释放特效组件
// =========================================
export const SkillCastEffect = ({ type, x, y, onComplete }) => {
  const canvasRef = useRef(null);
  const [particleSystem, setParticleSystem] = useState(null);

  useEffect(() => {
    if (canvasRef.current && !particleSystem) {
      const system = new CanvasParticleSystem(`skill-canvas-${type}`, {
        width: 800,
        height: 600,
        transparent: true
      });
      setParticleSystem(system);
      
      // 创建粒子效果
      ParticlePresets.skillCast(system, x, y, type);
      system.start();

      // 清理
      setTimeout(() => {
        system.stop();
        system.clear();
        if (onComplete) onComplete();
      }, 2000);
    }
  }, [type, x, y, onComplete, particleSystem]);

  return (
    <canvas
      ref={canvasRef}
      id={`skill-canvas-${type}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100
      }}
    />
  );
};

// =========================================
// 血条增强组件
// =========================================
export const EnhancedHPBar = ({ current, max, label }) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const style = useSpring({
    width: `${percentage}%`,
    config: { tension: 50, friction: 30 }
  });

  const getColor = () => {
    if (percentage > 50) return '#4CAF50';
    if (percentage > 20) return '#FFC107';
    return '#FF5252';
  };

  return (
    <div style={{ width: '100%', marginTop: '4px' }}>
      {label && (
        <div style={{ fontSize: '12px', marginBottom: '2px', color: '#666' }}>
          {label}
        </div>
      )}
      <div style={{
        width: '100%',
        height: '10px',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <animated.div
          style={{
            ...style,
            height: '100%',
            background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}dd 100%)`,
            borderRadius: '6px',
            boxShadow: `0 0 10px ${getColor()}80`
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
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
  const [visible, setVisible] = useState(true);
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      // 消息出现动画
      gsap.fromTo(messageRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [message]);

  const typeStyles = {
    info: { background: 'rgba(33, 150, 243, 0.9)', color: '#fff' },
    success: { background: 'rgba(76, 175, 80, 0.9)', color: '#fff' },
    warning: { background: 'rgba(255, 193, 7, 0.9)', color: '#000' },
    error: { background: 'rgba(244, 67, 54, 0.9)', color: '#fff' }
  };

  return (
    <div
      ref={messageRef}
      style={{
        ...typeStyles[type],
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {message}
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

