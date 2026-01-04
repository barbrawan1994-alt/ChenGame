# 游戏引擎系统

本目录包含了用于增强游戏视觉效果和交互体验的免费引擎系统。

## 已集成的引擎

### 1. GSAP (GreenSock Animation Platform)
- **用途**: 强大的动画库，用于流畅的动画效果
- **功能**: 精灵入场、技能释放、UI动画等
- **免费版**: 功能完整，无需许可证

### 2. React Spring
- **用途**: React动画库，用于组件动画
- **功能**: 浮动效果、淡入淡出、数字计数等
- **特点**: 基于物理的动画，非常流畅

### 3. Anime.js
- **用途**: 轻量级动画库
- **功能**: 粒子效果、波浪动画、旋转进入等
- **特点**: 体积小，性能好

### 4. PixiJS
- **用途**: 2D WebGL渲染引擎
- **功能**: 高性能粒子系统、特效渲染
- **特点**: 硬件加速，适合大量粒子

### 5. Lottie React
- **用途**: 播放Lottie动画
- **功能**: 复杂的矢量动画效果
- **特点**: 支持After Effects导出的动画

## 使用方法

### 动画引擎 (AnimationEngine.js)

```javascript
import { GSAPAnimations, SpringAnimations } from './engines/AnimationEngine';

// GSAP 动画
const elementRef = useRef(null);
GSAPAnimations.petEntry(elementRef.current, 0.2);

// React Spring 组件
<SpringAnimations.Floating intensity={15} speed={2}>
  <div>浮动的内容</div>
</SpringAnimations.Floating>
```

### 粒子引擎 (ParticleEngine.js)

```javascript
import { ParticleSystem } from './engines/ParticleEngine';

const particleSystem = new ParticleSystem('canvas-id', {
  width: 800,
  height: 600
});

// 创建火花效果
particleSystem.createSparkParticles(50, x, y, 0xFFD700);
particleSystem.start();
```

### UI增强 (UIEnhancement.js)

```javascript
import { EnhancedButton, EnhancedCard, EnhancedProgressBar } from './engines/UIEnhancement';

// 华丽的按钮
<EnhancedButton 
  variant="primary" 
  size="large"
  onClick={handleClick}
>
  点击我
</EnhancedButton>

// 卡片组件
<EnhancedCard hover={true}>
  <h3>标题</h3>
  <p>内容</p>
</EnhancedCard>

// 进度条
<EnhancedProgressBar 
  value={75} 
  max={100} 
  color="#667eea"
  animated={true}
/>
```

## 在战斗界面中使用

### 精灵入场动画
```javascript
const spriteRef = useRef(null);
useEffect(() => {
  if (spriteRef.current) {
    GSAPAnimations.petEntry(spriteRef.current);
  }
}, []);
```

### 技能释放效果
```javascript
const handleSkillCast = (skillType) => {
  CombinedAnimations.epicSkillCast(skillElement, skillType);
  ParticlePresets.skillCast(particleSystem, x, y, skillType);
};
```

### 伤害数字动画
```javascript
const showDamage = (damage, isCritical) => {
  GSAPAnimations.damageNumber(damageElement, damage, isCritical);
  ParticlePresets.damageNumber(particleSystem, x, y, isCritical);
};
```

## 性能优化建议

1. **粒子系统**: 使用Canvas版本（CanvasParticleSystem）而不是PixiJS，如果粒子数量较少
2. **动画**: 使用CSS动画处理简单的动画，GSAP处理复杂动画
3. **React Spring**: 适合需要与React状态同步的动画
4. **Lottie**: 用于复杂的预渲染动画，避免过度使用

## 注意事项

- 所有引擎都是免费使用的
- GSAP免费版功能完整，无需担心许可证
- 粒子系统会消耗GPU资源，注意控制粒子数量
- 动画应该适度使用，避免过度动画影响性能

