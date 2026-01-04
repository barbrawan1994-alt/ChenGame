// =========================================
// UI 增强引擎 - 使用 React Spring 和 GSAP
// =========================================

import React, { useEffect, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { gsap } from 'gsap';

// =========================================
// 华丽的按钮组件
// =========================================
export const EnhancedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ...props 
}) => {
  const buttonRef = useRef(null);
  const [style, api] = useSpring(() => ({
    scale: 1,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    config: config.wobbly
  }));

  const handleMouseEnter = () => {
    if (!disabled) {
      api.start({
        scale: 1.05,
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
      });
    }
  };

  const handleMouseLeave = () => {
    api.start({
      scale: 1,
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    });
  };

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

  const variants = {
    primary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    success: { background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    danger: { background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
    warning: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' }
  };

  return (
    <animated.button
      ref={buttonRef}
      style={{
        ...style,
        ...variants[variant],
        ...sizes[size],
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transform: style.scale.to(s => `scale(${s})`),
        transition: 'all 0.3s ease',
        ...props.style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </animated.button>
  );
};

// =========================================
// 卡片组件
// =========================================
export const EnhancedCard = ({ children, hover = true, ...props }) => {
  const cardRef = useRef(null);
  const [style, api] = useSpring(() => ({
    y: 0,
    scale: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    config: config.gentle
  }));

  useEffect(() => {
    if (hover && cardRef.current) {
      const handleMouseEnter = () => {
        api.start({
          y: -10,
          scale: 1.02,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
        });
      };

      const handleMouseLeave = () => {
        api.start({
          y: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        });
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
          cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, [hover, api]);

  return (
    <animated.div
      ref={cardRef}
      style={{
        ...style,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        transform: style.y.to(y => `translateY(${y}px) scale(${style.scale.get()})`),
        ...props.style
      }}
      {...props}
    >
      {children}
    </animated.div>
  );
};

// =========================================
// 进度条组件
// =========================================
export const EnhancedProgressBar = ({ 
  value, 
  max = 100, 
  color = '#667eea',
  showLabel = true,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const style = useSpring({
    width: `${percentage}%`,
    config: animated ? config.slow : { duration: 0 }
  });

  return (
    <div style={{
      width: '100%',
      height: '24px',
      background: 'rgba(0,0,0,0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <animated.div
        style={{
          ...style,
          height: '100%',
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '12px',
          boxShadow: `0 0 10px ${color}80`,
          transition: 'all 0.3s ease'
        }}
      />
      {showLabel && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {Math.floor(value)} / {max}
        </div>
      )}
    </div>
  );
};

// =========================================
// 模态框组件
// =========================================
export const EnhancedModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'medium'
}) => {
  const [style, api] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: config.gentle
  }));

  useEffect(() => {
    if (isOpen) {
      api.start({
        opacity: 1,
        scale: 1
      });
    } else {
      api.start({
        opacity: 0,
        scale: 0.8
      });
    }
  }, [isOpen, api]);

  if (!isOpen) return null;

  const sizes = {
    small: { width: '400px', maxWidth: '90vw' },
    medium: { width: '600px', maxWidth: '90vw' },
    large: { width: '800px', maxWidth: '95vw' }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      opacity: style.opacity.get()
    }} onClick={onClose}>
      <animated.div
        style={{
          ...sizes[size],
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          transform: style.scale.to(s => `scale(${s})`),
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 style={{
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {title}
          </h2>
        )}
        {children}
      </animated.div>
    </div>
  );
};

// =========================================
// 工具提示组件
// =========================================
export const EnhancedTooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [style, api] = useSpring(() => ({
    opacity: 0,
    y: position === 'top' ? -10 : 10,
    config: config.gentle
  }));

  useEffect(() => {
    if (isVisible) {
      api.start({
        opacity: 1,
        y: 0
      });
    } else {
      api.start({
        opacity: 0,
        y: position === 'top' ? -10 : 10
      });
    }
  }, [isVisible, api, position]);

  const positions = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <animated.div
          style={{
            ...style,
            ...positions[position],
            position: 'absolute',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            opacity: style.opacity.get(),
            transform: style.y.to(y => `translateX(-50%) translateY(${y}px)`)
          }}
        >
          {content}
        </animated.div>
      )}
    </div>
  );
};

export default {
  EnhancedButton,
  EnhancedCard,
  EnhancedProgressBar,
  EnhancedModal,
  EnhancedTooltip
};

