// =========================================
// 动画引擎 - 整合 GSAP、React Spring、Anime.js
// =========================================

import { gsap } from 'gsap';
import { useSpring, animated, config } from '@react-spring/web';
import anime from 'animejs';

// =========================================
// GSAP 动画工具
// =========================================
export const GSAPAnimations = {
  // 精灵入场动画
  petEntry: (element, delay = 0) => {
    return gsap.fromTo(element, 
      { 
        scale: 0, 
        rotation: -180, 
        opacity: 0,
        y: 50
      },
      { 
        scale: 1, 
        rotation: 0, 
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "back.out(1.7)"
      }
    );
  },

  // 战斗伤害数字动画
  damageNumber: (element, damage, isCritical = false) => {
    return gsap.to(element, {
      y: -100,
      opacity: 0,
      scale: isCritical ? 1.5 : 1.2,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
    });
  },

  // 技能释放动画
  skillCast: (element, type) => {
    const effects = {
      fire: { scale: 1.3, rotation: 360, filter: 'brightness(1.5)' },
      water: { scale: 1.2, y: -20, filter: 'blur(2px)' },
      electric: { scale: 1.4, rotation: 180, filter: 'brightness(2)' },
      grass: { scale: 1.2, rotation: -180, filter: 'hue-rotate(90deg)' }
    };

    const effect = effects[type] || effects.fire;
    
    return gsap.to(element, {
      ...effect,
      duration: 0.6,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1
    });
  },

  // UI 面板滑入动画
  panelSlideIn: (element, from = 'left') => {
    const positions = {
      left: { x: -300, y: 0 },
      right: { x: 300, y: 0 },
      top: { x: 0, y: -300 },
      bottom: { x: 0, y: 300 }
    };

    return gsap.fromTo(element,
      { ...positions[from], opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  },

  // 闪光精灵特效
  shinyFlash: (element) => {
    return gsap.timeline({ repeat: -1 })
      .to(element, {
        filter: 'brightness(1.5) saturate(1.5)',
        duration: 0.5,
        ease: "sine.inOut"
      })
      .to(element, {
        filter: 'brightness(1) saturate(1)',
        duration: 0.5,
        ease: "sine.inOut"
      });
  },

  // 震动效果
  shake: (element, intensity = 10) => {
    return gsap.to(element, {
      x: `+=${intensity}`,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: "power1.inOut"
    });
  }
};

// =========================================
// React Spring 动画组件
// =========================================
export const SpringAnimations = {
  // 浮动动画
  Floating: ({ children, intensity = 10, speed = 2 }) => {
    const [style, api] = useSpring(() => ({
      from: { y: 0 },
      to: async (next) => {
        while (1) {
          await next({ y: intensity, config: config.slow });
          await next({ y: -intensity, config: config.slow });
        }
      },
      config: { tension: 50, friction: 20 }
    }));

    return <animated.div style={style}>{children}</animated.div>;
  },

  // 淡入淡出
  FadeIn: ({ children, delay = 0 }) => {
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay,
      config: config.gentle
    });

    return <animated.div style={style}>{children}</animated.div>;
  },

  // 缩放动画
  ScaleIn: ({ children, scale = 1.1 }) => {
    const style = useSpring({
      from: { transform: 'scale(0)' },
      to: { transform: `scale(${scale})` },
      config: config.wobbly
    });

    return <animated.div style={style}>{children}</animated.div>;
  },

  // 数字计数动画
  CountUp: ({ from = 0, to, duration = 1000, format = (n) => n }) => {
    const { number } = useSpring({
      from: { number: from },
      to: { number: to },
      config: config.slow
    });

    return <animated.span>{number.to(n => format(Math.floor(n)))}</animated.span>;
  }
};

// =========================================
// Anime.js 动画工具
// =========================================
export const AnimeAnimations = {
  // 粒子爆炸效果
  particleExplosion: (elements, color = '#FFD700') => {
    return anime({
      targets: elements,
      translateX: () => anime.random(-200, 200),
      translateY: () => anime.random(-200, 200),
      scale: [1, 0],
      opacity: [1, 0],
      duration: anime.random(800, 1200),
      easing: 'easeOutExpo',
      delay: anime.stagger(50)
    });
  },

  // 波浪效果
  wave: (elements) => {
    return anime({
      targets: elements,
      translateY: [0, -20, 0],
      duration: 1000,
      delay: anime.stagger(100),
      easing: 'easeInOutSine',
      loop: true
    });
  },

  // 旋转进入
  rotateIn: (element, direction = 1) => {
    return anime({
      targets: element,
      rotate: [direction * 360, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    });
  },

  // 弹跳效果
  bounce: (element, intensity = 30) => {
    return anime({
      targets: element,
      translateY: [0, -intensity, 0],
      duration: 600,
      easing: 'easeOutElastic(1, .8)'
    });
  }
};

// =========================================
// 组合动画工具
// =========================================
export const CombinedAnimations = {
  // 华丽的技能释放
  epicSkillCast: (element, type) => {
    // GSAP 处理主要动画
    const mainAnim = GSAPAnimations.skillCast(element, type);
    
    // Anime.js 处理粒子效果
    const particles = element.querySelectorAll('.particle');
    if (particles.length > 0) {
      AnimeAnimations.particleExplosion(particles, type === 'fire' ? '#FF6B6B' : '#4ECDC4');
    }

    return mainAnim;
  },

  // 战斗胜利动画
  victorySequence: (elements) => {
    const timeline = gsap.timeline();
    
    // 1. 所有元素同时缩放进入
    timeline.from(elements, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)"
    });

    // 2. 闪光效果
    timeline.to(elements, {
      filter: 'brightness(1.5)',
      duration: 0.3,
      yoyo: true,
      repeat: 3
    });

    // 3. 最终位置
    timeline.to(elements, {
      scale: 1.1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });

    return timeline;
  }
};

export default {
  GSAP: GSAPAnimations,
  Spring: SpringAnimations,
  Anime: AnimeAnimations,
  Combined: CombinedAnimations
};

