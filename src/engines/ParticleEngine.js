// =========================================
// 粒子特效引擎 - 使用 PixiJS 和 Canvas
// =========================================

import * as PIXI from 'pixi.js';

// =========================================
// PixiJS 粒子系统
// =========================================
export class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.app = new PIXI.Application({
      width: options.width || 800,
      height: options.height || 600,
      backgroundColor: options.backgroundColor || 0x000000,
      transparent: options.transparent !== false,
      antialias: true
    });

    const canvas = document.getElementById(canvasId);
    if (canvas) {
      canvas.appendChild(this.app.view);
    }

    this.particles = [];
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
  }

  // 创建火花粒子
  createSparkParticles(count = 50, x, y, color = 0xFFD700) {
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 3 + 1);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 10;
      particle.vy = (Math.random() - 0.5) * 10;
      particle.life = 1.0;
      particle.decay = Math.random() * 0.02 + 0.01;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  // 创建火焰粒子
  createFireParticles(count = 30, x, y) {
    const colors = [0xFF6B6B, 0xFF8E8E, 0xFFD93D, 0xFF4444];
    
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 4 + 2);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      particle.vx = (Math.random() - 0.5) * 3;
      particle.vy = -Math.random() * 5 - 2;
      particle.life = 1.0;
      particle.decay = Math.random() * 0.03 + 0.02;
      particle.gravity = 0.1;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  // 创建水花粒子
  createWaterParticles(count = 40, x, y) {
    const colors = [0x4ECDC4, 0x6EDDD6, 0xA8E6CF];
    
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 3 + 1);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = 1.0;
      particle.decay = Math.random() * 0.02 + 0.01;
      particle.gravity = 0.2;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  // 创建电光粒子
  createElectricParticles(count = 60, x, y) {
    const colors = [0xFFE66D, 0xFFF89C, 0xFFFFFF];
    
    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 2 + 1);
      particle.endFill();
      
      particle.x = x;
      particle.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = 1.0;
      particle.decay = Math.random() * 0.05 + 0.03;

      this.container.addChild(particle);
      this.particles.push(particle);
    }
  }

  // 更新粒子
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 应用重力
      if (particle.gravity) {
        particle.vy += particle.gravity;
      }
      
      // 更新生命值
      particle.life -= particle.decay;
      particle.alpha = particle.life;
      
      // 移除死亡粒子
      if (particle.life <= 0) {
        this.container.removeChild(particle);
        this.particles.splice(i, 1);
      }
    }
  }

  // 启动动画循环
  start() {
    this.app.ticker.add(() => this.update());
  }

  // 停止动画
  stop() {
    this.app.ticker.remove(() => this.update());
  }

  // 清除所有粒子
  clear() {
    this.particles.forEach(particle => {
      this.container.removeChild(particle);
    });
    this.particles = [];
  }

  // 销毁
  destroy() {
    this.clear();
    this.app.destroy(true);
  }
}

// =========================================
// Canvas 粒子系统（轻量级替代方案）
// =========================================
export class CanvasParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = options.width || 800;
    this.canvas.height = options.height || 600;
    
    this.particles = [];
    this.animationId = null;
  }

  // 创建粒子
  createParticles(count, x, y, options = {}) {
    const {
      color = '#FFD700',
      size = 3,
      speed = 5,
      life = 1.0,
      gravity = 0
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * speed + 1;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * size + 1,
        color,
        life,
        maxLife: life,
        gravity,
        decay: Math.random() * 0.02 + 0.01
      });
    }
  }

  // 创建火花粒子
  createSparkParticles(count = 50, x, y, color = '#FFD700') {
    this.createParticles(count, x, y, {
      color,
      size: 3,
      speed: 5,
      life: 1.0,
      gravity: 0
    });
  }

  // 创建火焰粒子
  createFireParticles(count = 30, x, y) {
    const colors = ['#FF6B6B', '#FF8E8E', '#FFD93D', '#FF4444'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.createParticles(1, x, y, {
        color,
        size: 4,
        speed: 3,
        life: 1.0,
        gravity: 0.1
      });
    }
  }

  // 创建水花粒子
  createWaterParticles(count = 40, x, y) {
    const colors = ['#4ECDC4', '#6EDDD6', '#A8E6CF'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.createParticles(1, x, y, {
        color,
        size: 3,
        speed,
        life: 1.0,
        gravity: 0.2
      });
    }
  }

  // 创建电光粒子
  createElectricParticles(count = 60, x, y) {
    const colors = ['#FFE66D', '#FFF89C', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.createParticles(1, x, y, {
        color,
        size: 2,
        speed,
        life: 1.0,
        gravity: 0
      });
    }
  }

  // 更新粒子
  update() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      
      // 应用重力
      if (p.gravity) {
        p.vy += p.gravity;
      }
      
      // 更新生命值
      p.life -= p.decay;
      
      // 绘制粒子
      const alpha = p.life / p.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      
      // 移除死亡粒子
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.update());
    }
  }

  // 启动
  start() {
    if (this.animationId) return;
    this.update();
  }

  // 停止
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // 清除
  clear() {
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// =========================================
// 预设粒子效果
// =========================================
export const ParticlePresets = {
  // 技能释放效果
  skillCast: (system, x, y, type) => {
    if (!system || typeof system.createParticles !== 'function') {
      console.warn('Particle system not initialized properly');
      return;
    }
    
    switch (type) {
      case 'FIRE':
        if (system.createFireParticles) {
          system.createFireParticles(50, x, y);
        } else {
          system.createParticles(50, x, y, { color: '#FF6B6B', size: 4, speed: 3, gravity: 0.1 });
        }
        break;
      case 'WATER':
        if (system.createWaterParticles) {
          system.createWaterParticles(60, x, y);
        } else {
          system.createParticles(60, x, y, { color: '#4ECDC4', size: 3, speed: 5, gravity: 0.2 });
        }
        break;
      case 'ELECTRIC':
        if (system.createElectricParticles) {
          system.createElectricParticles(70, x, y);
        } else {
          system.createParticles(70, x, y, { color: '#FFE66D', size: 2, speed: 8, gravity: 0 });
        }
        break;
      default:
        if (system.createSparkParticles) {
          system.createSparkParticles(40, x, y);
        } else {
          system.createParticles(40, x, y, { color: '#FFD700', size: 3, speed: 5 });
        }
    }
  },

  // 伤害数字效果
  damageNumber: (system, x, y, isCritical = false) => {
    if (!system || typeof system.createParticles !== 'function') return;
    
    const count = isCritical ? 80 : 50;
    const color = isCritical ? '#FF4444' : '#FFD700';
    if (system.createSparkParticles) {
      system.createSparkParticles(count, x, y, color);
    } else {
      system.createParticles(count, x, y, { color, size: 3, speed: 5 });
    }
  },

  // 胜利效果
  victory: (system, x, y) => {
    if (!system || typeof system.createParticles !== 'function') return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        if (system.createSparkParticles) {
          system.createSparkParticles(30, x, y, '#FFD700');
        } else {
          system.createParticles(30, x, y, { color: '#FFD700', size: 3, speed: 5 });
        }
      }, i * 100);
    }
  }
};

export default {
  ParticleSystem,
  CanvasParticleSystem,
  Presets: ParticlePresets
};

