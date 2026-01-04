# 引擎集成指南

## 已完成的优化

### ✅ 1. 终极精灵设计师 (UltimatePetDesigner.js)
- **功能**: 为每只精灵生成完全独特的造型
- **特点**: 
  - 基于名字哈希生成唯一特征
  - 支持8种身体形状、多种特征组合
  - 自动识别名字中的关键词（鸟、鱼、龙、火、电等）
  - 每只精灵都有独特的颜色、形状和特征

**使用方法**:
```javascript
import { generatePetModel } from './engines/UltimatePetDesigner';

// 在 renderAvatar 函数中已经自动使用
const svgModel = generatePetModel(pet, size);
```

### ✅ 2. 战斗界面增强组件 (BattleEnhancements.js)
已创建以下组件，可以在战斗界面中使用：

#### AnimatedPetSprite - 带动画的精灵显示
```javascript
import { AnimatedPetSprite } from './engines/BattleEnhancements';

<AnimatedPetSprite 
  pet={p} 
  side="player" 
  onAnimationComplete={() => console.log('动画完成')}
/>
```

#### EnhancedMoveButton - 增强的技能按钮
```javascript
import { EnhancedMoveButton } from './engines/BattleEnhancements';

<EnhancedMoveButton
  move={m}
  onClick={() => executeTurn(i)}
  disabled={m.pp <= 0}
  index={i}
/>
```

#### AnimatedDamageNumber - 动画伤害数字
```javascript
import { AnimatedDamageNumber } from './engines/BattleEnhancements';

<AnimatedDamageNumber
  damage={damage}
  x={x}
  y={y}
  isCritical={isCritical}
  type={moveType}
/>
```

#### SkillCastEffect - 技能释放特效
```javascript
import { SkillCastEffect } from './engines/BattleEnhancements';

<SkillCastEffect
  type="FIRE"
  x={centerX}
  y={centerY}
  onComplete={() => console.log('特效完成')}
/>
```

#### EnhancedHPBar - 增强的血条
```javascript
import { EnhancedHPBar } from './engines/BattleEnhancements';

<EnhancedHPBar
  current={p.currentHp}
  max={pStats.maxHp}
  label="HP"
/>
```

### ✅ 3. 地图加载性能优化 (ThreeMap.js)
- 使用 `useMemo` 优化地图渲染
- 降低 DPR 从 1.5 到 1.2
- 降低阴影分辨率从 2048 到 1024
- 降低阴影采样数从 10 到 8

### ✅ 4. 粒子特效系统 (ParticleEngine.js)
已创建粒子系统，支持：
- 火花粒子
- 火焰粒子
- 水花粒子
- 电光粒子
- Canvas 轻量级版本

**使用方法**:
```javascript
import { CanvasParticleSystem, ParticlePresets } from './engines/ParticleEngine';

const particleSystem = new CanvasParticleSystem('canvas-id', {
  width: 800,
  height: 600
});

// 技能释放效果
ParticlePresets.skillCast(particleSystem, x, y, 'FIRE');
particleSystem.start();
```

### ✅ 5. UI增强组件 (UIEnhancement.js)
已创建以下组件：
- `EnhancedButton` - 华丽的按钮
- `EnhancedCard` - 卡片组件
- `EnhancedProgressBar` - 进度条
- `EnhancedModal` - 模态框
- `EnhancedTooltip` - 工具提示

## 下一步集成建议

### 在 App.js 中集成战斗增强组件

1. **替换技能按钮**:
```javascript
// 在 renderBattle 函数中，找到技能按钮部分
// 将原来的 <button className="move-btn-v2"> 替换为：
import { EnhancedMoveButton } from './engines/BattleEnhancements';

{activeMoves.map((m, i) => (
  <EnhancedMoveButton
    key={i}
    move={m}
    onClick={() => executeTurn(i)}
    disabled={m.pp <= 0}
    index={i}
  />
))}
```

2. **添加伤害数字动画**:
```javascript
import { AnimatedDamageNumber } from './engines/BattleEnhancements';

// 在伤害计算后显示
{showDamage && (
  <AnimatedDamageNumber
    damage={damage}
    x={damageX}
    y={damageY}
    isCritical={isCritical}
    type={moveType}
  />
)}
```

3. **添加技能特效**:
```javascript
import { SkillCastEffect } from './engines/BattleEnhancements';

// 在技能释放时
{castingSkill && (
  <SkillCastEffect
    type={currentMoveType}
    x={targetX}
    y={targetY}
    onComplete={() => setCastingSkill(false)}
  />
)}
```

4. **替换血条**:
```javascript
import { EnhancedHPBar } from './engines/BattleEnhancements';

// 替换原来的血条
<EnhancedHPBar
  current={p.currentHp}
  max={pStats.maxHp}
  label="HP"
/>
```

## 性能优化建议

1. **地图加载**: 已优化，如果还慢可以：
   - 进一步降低 DPR 到 1.0
   - 减少装饰元素数量
   - 使用 LOD (Level of Detail) 系统

2. **动画性能**: 
   - 使用 CSS 动画处理简单动画
   - GSAP 处理复杂动画
   - 避免同时运行过多动画

3. **粒子系统**:
   - 使用 Canvas 版本而不是 PixiJS（如果粒子数量 < 100）
   - 及时清理粒子系统
   - 限制同时存在的粒子数量

## 注意事项

1. 所有引擎都是免费使用的
2. 精灵模型已经自动使用新的生成系统
3. 战斗界面增强组件需要手动集成到 App.js
4. 地图性能已优化，如果还慢可以进一步调整

## 测试建议

1. 测试不同精灵的模型生成
2. 测试战斗界面的动画效果
3. 测试粒子特效的性能
4. 测试地图加载速度

