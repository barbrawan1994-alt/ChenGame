// =========================================
// 精致精灵设计师 - 为每只精灵生成精美独特的设计
// =========================================

import React from 'react';

// 类型颜色映射 - 增强版
const TYPE_COLORS = {
  FIRE: { 
    primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD93D', 
    dark: '#CC5555', light: '#FFB8B8', glow: '#FF4444',
    gradient: ['#FF6B6B', '#FF8E8E', '#FFD93D', '#FF4444']
  },
  WATER: { 
    primary: '#4ECDC4', secondary: '#6EDDD6', accent: '#A8E6CF', 
    dark: '#3BA8A0', light: '#B8F0EB', glow: '#00BCD4',
    gradient: ['#4ECDC4', '#6EDDD6', '#A8E6CF', '#00BCD4']
  },
  GRASS: { 
    primary: '#95E1D3', secondary: '#B8E6D8', accent: '#C8E6C9', 
    dark: '#7AB8A8', light: '#D4F4E8', glow: '#4CAF50',
    gradient: ['#95E1D3', '#B8E6D8', '#C8E6C9', '#4CAF50']
  },
  ELECTRIC: { 
    primary: '#FFE66D', secondary: '#FFF89C', accent: '#FFD93D', 
    dark: '#CCB855', light: '#FFF4B8', glow: '#FFEB3B',
    gradient: ['#FFE66D', '#FFF89C', '#FFD93D', '#FFEB3B']
  },
  ICE: { 
    primary: '#A8E6CF', secondary: '#C8F0E0', accent: '#E0F7FA', 
    dark: '#88C6AF', light: '#E8F8F4', glow: '#81D4FA',
    gradient: ['#A8E6CF', '#C8F0E0', '#E0F7FA', '#81D4FA']
  },
  FIGHT: { 
    primary: '#FF8B94', secondary: '#FFA8B0', accent: '#FF6B6B', 
    dark: '#CC6F75', light: '#FFC8D0', glow: '#F44336',
    gradient: ['#FF8B94', '#FFA8B0', '#FF6B6B', '#F44336']
  },
  POISON: { 
    primary: '#C7CEEA', secondary: '#D8DFF0', accent: '#E0BBE4', 
    dark: '#9FA5BB', light: '#E8E8F8', glow: '#9C27B0',
    gradient: ['#C7CEEA', '#D8DFF0', '#E0BBE4', '#9C27B0']
  },
  GROUND: { 
    primary: '#D4A574', secondary: '#E0B890', accent: '#F4D03F', 
    dark: '#AA8459', light: '#F0D4A8', glow: '#FF9800',
    gradient: ['#D4A574', '#E0B890', '#F4D03F', '#FF9800']
  },
  FLYING: { 
    primary: '#B8E6B8', secondary: '#D4F4D4', accent: '#E8F5E8', 
    dark: '#93B893', light: '#E8F8E8', glow: '#8BC34A',
    gradient: ['#B8E6B8', '#D4F4D4', '#E8F5E8', '#8BC34A']
  },
  PSYCHIC: { 
    primary: '#FFB6C1', secondary: '#FFC8D3', accent: '#FFD6E0', 
    dark: '#CC9199', light: '#FFE8ED', glow: '#E91E63',
    gradient: ['#FFB6C1', '#FFC8D3', '#FFD6E0', '#E91E63']
  },
  BUG: { 
    primary: '#C8E6C9', secondary: '#D8F0D8', accent: '#E8F5E8', 
    dark: '#A0B8A1', light: '#E8F8E8', glow: '#4CAF50',
    gradient: ['#C8E6C9', '#D8F0D8', '#E8F5E8', '#4CAF50']
  },
  ROCK: { 
    primary: '#D3D3D3', secondary: '#E0E0E0', accent: '#F0F0F0', 
    dark: '#A8A8A8', light: '#F0F0F0', glow: '#9E9E9E',
    gradient: ['#D3D3D3', '#E0E0E0', '#F0F0F0', '#9E9E9E']
  },
  GHOST: { 
    primary: '#E0BBE4', secondary: '#E8D0EB', accent: '#F0E5F2', 
    dark: '#B395B6', light: '#F0E8F4', glow: '#9C27B0',
    gradient: ['#E0BBE4', '#E8D0EB', '#F0E5F2', '#9C27B0']
  },
  DRAGON: { 
    primary: '#FFD93D', secondary: '#FFE66D', accent: '#FFF89C', 
    dark: '#CCAD30', light: '#FFF4B8', glow: '#FFC107',
    gradient: ['#FFD93D', '#FFE66D', '#FFF89C', '#FFC107']
  },
  STEEL: { 
    primary: '#B8B8B8', secondary: '#D0D0D0', accent: '#E8E8E8', 
    dark: '#939393', light: '#E0E0E0', glow: '#607D8B',
    gradient: ['#B8B8B8', '#D0D0D0', '#E8E8E8', '#607D8B']
  },
  FAIRY: { 
    primary: '#FFB6D9', secondary: '#FFC8E5', accent: '#FFD6ED', 
    dark: '#CC9199', light: '#FFE8F4', glow: '#E91E63',
    gradient: ['#FFB6D9', '#FFC8E5', '#FFD6ED', '#E91E63']
  },
  GOD: { 
    primary: '#FFD700', secondary: '#FFE66D', accent: '#FFF89C', 
    dark: '#CCAD00', light: '#FFF4B8', glow: '#FFC107',
    gradient: ['#FFD700', '#FFE66D', '#FFF89C', '#FFC107']
  },
  NORMAL: { 
    primary: '#F5F5F5', secondary: '#FAFAFA', accent: '#FFFFFF', 
    dark: '#C4C4C4', light: '#FFFFFF', glow: '#9E9E9E',
    gradient: ['#F5F5F5', '#FAFAFA', '#FFFFFF', '#9E9E9E']
  }
};

// 基础SVG组件
const Circle = ({ cx, cy, r, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', filter = '' }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} filter={filter} />
);

const Ellipse = ({ cx, cy, rx, ry, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', filter = '' }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} filter={filter} />
);

const Rect = ({ x, y, width, height, fill, stroke, strokeWidth = 0, rx = 0, ry = 0, opacity = 1, transform = '', filter = '' }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx={rx} ry={ry} opacity={opacity} transform={transform} filter={filter} />
);

const Polygon = ({ points, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', filter = '' }) => (
  <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} filter={filter} />
);

const Path = ({ d, fill, stroke, strokeWidth = 0, opacity = 1, filter = '' }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} filter={filter} />
);

// =========================================
// 生成唯一哈希值
// =========================================
const generateHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// =========================================
// 深度分析名字特征
// =========================================
const analyzeName = (name) => {
  const hash = generateHash(name);
  const nameLower = name.toLowerCase();
  
  return {
    // 基础形状特征
    bodyShape: name.includes('球') || name.includes('圆') || name.includes('珠') ? 'round' :
               name.includes('蛇') || name.includes('龙') || name.includes('虫') ? 'long' :
               name.includes('方') || name.includes('块') || name.includes('石') ? 'square' :
               name.includes('鸟') || name.includes('鹰') || name.includes('凤') ? 'oval' :
               name.includes('鱼') || name.includes('鲨') || name.includes('鲸') ? 'oval' :
               'organic',
    
    // 身体特征
    hasWings: name.includes('鸟') || name.includes('鹰') || name.includes('凤') || name.includes('雕') || name.includes('飞'),
    hasTail: name.includes('猫') || name.includes('狗') || name.includes('狼') || name.includes('狐') || name.includes('虎') || name.includes('狮') || name.includes('龙') || name.includes('蛇'),
    hasHorns: name.includes('鹿') || name.includes('马') || name.includes('羊') || name.includes('牛') || name.includes('角'),
    hasFins: name.includes('鱼') || name.includes('鲨') || name.includes('鲸') || name.includes('海') || name.includes('水'),
    hasShell: name.includes('蟹') || name.includes('贝') || name.includes('龟') || name.includes('螺'),
    hasSpikes: name.includes('刺') || name.includes('针') || name.includes('棘') || name.includes('尖'),
    hasFur: name.includes('猫') || name.includes('狗') || name.includes('狼') || name.includes('狐') || name.includes('熊'),
    hasScales: name.includes('龙') || name.includes('蛇') || name.includes('鱼') || name.includes('鳞'),
    hasFeathers: name.includes('鸟') || name.includes('鹰') || name.includes('凤') || name.includes('羽'),
    hasArmor: name.includes('钢') || name.includes('铁') || name.includes('机') || name.includes('械') || name.includes('甲'),
    
    // 头部特征
    hasAntenna: name.includes('虫') || name.includes('蝶') || name.includes('蜂'),
    hasBeak: name.includes('鸟') || name.includes('鹰') || name.includes('鸭'),
    eyeCount: name.includes('三') ? 3 : name.includes('四') ? 4 : 2,
    eyeSize: name.includes('大') ? 'large' : name.includes('小') ? 'small' : 'normal',
    eyeType: name.includes('魔') || name.includes('恶') || name.includes('暗') || name.includes('鬼') ? 'glowing' : 
             name.includes('天') || name.includes('使') || name.includes('仙') ? 'happy' : 'normal',
    
    // 元素特征
    hasFlame: name.includes('火') || name.includes('炎') || name.includes('熔') || name.includes('焰') || name.includes('燃'),
    hasIce: name.includes('冰') || name.includes('雪') || name.includes('寒') || name.includes('冻'),
    hasElectric: name.includes('电') || name.includes('雷') || name.includes('闪') || name.includes('磁'),
    hasLeaves: name.includes('树') || name.includes('花') || name.includes('叶') || name.includes('草') || name.includes('藤'),
    hasFlowers: name.includes('花') || name.includes('朵'),
    hasCrystals: name.includes('晶') || name.includes('钻') || name.includes('宝') || name.includes('石'),
    
    // 大小
    size: name.includes('小') || name.includes('幼') || name.includes('迷') ? 'small' :
          name.includes('大') || name.includes('巨') || name.includes('王') || name.includes('主') || name.includes('神') || name.includes('皇') ? 'large' : 'medium',
    
    // 唯一ID
    uniqueId: hash,
    designSeed: hash % 1000000
  };
};

// =========================================
// 生成精致的主体设计
// =========================================
const generateRefinedBody = (features, colors, size, centerX, centerY) => {
  const elements = [];
  const baseSize = size * 0.4;
  const hash = features.uniqueId;
  
  // 根据身体形状生成精致的主体
  switch (features.bodyShape) {
    case 'round':
      // 圆形主体 - 使用多层渐变和光效
      elements.push(
        <Circle key="body-shadow" cx={centerX + 2} cy={centerY + 2} r={baseSize} 
                fill={colors.dark} opacity={0.2} />
      );
      elements.push(
        <Circle key="body-main" cx={centerX} cy={centerY} r={baseSize} 
                fill={`url(#bodyGrad-${hash})`} 
                stroke={colors.dark} strokeWidth={3} 
                filter={`url(#glow-${hash})`} />
      );
      // 高光
      elements.push(
        <Ellipse key="body-highlight" cx={centerX - baseSize * 0.2} cy={centerY - baseSize * 0.3} 
                 rx={baseSize * 0.3} ry={baseSize * 0.2} 
                 fill="rgba(255,255,255,0.4)" />
      );
      break;
      
    case 'oval':
      // 椭圆主体 - 更流畅的曲线
      const ovalRx = baseSize * 1.1;
      const ovalRy = baseSize * 0.9;
      elements.push(
        <Ellipse key="body-shadow" cx={centerX + 2} cy={centerY + 2} rx={ovalRx} ry={ovalRy} 
                 fill={colors.dark} opacity={0.2} />
      );
      elements.push(
        <Ellipse key="body-main" cx={centerX} cy={centerY} rx={ovalRx} ry={ovalRy} 
                 fill={`url(#bodyGrad-${hash})`} 
                 stroke={colors.dark} strokeWidth={3} 
                 filter={`url(#glow-${hash})`} />
      );
      // 高光
      elements.push(
        <Ellipse key="body-highlight" cx={centerX - ovalRx * 0.3} cy={centerY - ovalRy * 0.4} 
                 rx={ovalRx * 0.4} ry={ovalRy * 0.3} 
                 fill="rgba(255,255,255,0.4)" />
      );
      break;
      
    case 'long':
      // 长条形主体 - 使用流畅的路径
      const longPath = `M ${centerX - baseSize * 1.5} ${centerY} 
                        Q ${centerX - baseSize * 0.5} ${centerY - baseSize * 0.3} 
                          ${centerX} ${centerY - baseSize * 0.2}
                        Q ${centerX + baseSize * 0.5} ${centerY - baseSize * 0.3} 
                          ${centerX + baseSize * 1.5} ${centerY}
                        Q ${centerX + baseSize * 0.5} ${centerY + baseSize * 0.3} 
                          ${centerX} ${centerY + baseSize * 0.2}
                        Q ${centerX - baseSize * 0.5} ${centerY + baseSize * 0.3} 
                          ${centerX - baseSize * 1.5} ${centerY} Z`;
      elements.push(
        <Path key="body-shadow" d={longPath} transform="translate(2,2)" 
              fill={colors.dark} opacity={0.2} />
      );
      elements.push(
        <Path key="body-main" d={longPath} 
              fill={`url(#bodyGrad-${hash})`} 
              stroke={colors.dark} strokeWidth={3} 
              filter={`url(#glow-${hash})`} />
      );
      break;
      
    case 'square':
      // 方形主体 - 圆角矩形
      const squareSize = baseSize * 1.2;
      elements.push(
        <Rect key="body-shadow" x={centerX - squareSize + 2} y={centerY - squareSize + 2} 
              width={squareSize * 2} height={squareSize * 2} 
              fill={colors.dark} opacity={0.2} rx={squareSize * 0.2} />
      );
      elements.push(
        <Rect key="body-main" x={centerX - squareSize} y={centerY - squareSize} 
              width={squareSize * 2} height={squareSize * 2} 
              fill={`url(#bodyGrad-${hash})`} 
              stroke={colors.dark} strokeWidth={3} 
              rx={squareSize * 0.2} ry={squareSize * 0.2}
              filter={`url(#glow-${hash})`} />
      );
      // 高光
      elements.push(
        <Rect key="body-highlight" x={centerX - squareSize * 0.6} y={centerY - squareSize * 0.8} 
              width={squareSize * 0.5} height={squareSize * 0.3} 
              fill="rgba(255,255,255,0.4)" rx={squareSize * 0.1} />
      );
      break;
      
    default: // organic
      // 有机形状 - 使用贝塞尔曲线
      const organicPath = `M ${centerX} ${centerY - baseSize}
                          Q ${centerX - baseSize * 0.8} ${centerY - baseSize * 0.5} 
                            ${centerX - baseSize * 0.6} ${centerY}
                          Q ${centerX - baseSize * 0.3} ${centerY + baseSize * 0.8} 
                            ${centerX} ${centerY + baseSize}
                          Q ${centerX + baseSize * 0.3} ${centerY + baseSize * 0.8} 
                            ${centerX + baseSize * 0.6} ${centerY}
                          Q ${centerX + baseSize * 0.8} ${centerY - baseSize * 0.5} 
                            ${centerX} ${centerY - baseSize} Z`;
      elements.push(
        <Path key="body-shadow" d={organicPath} transform="translate(2,2)" 
              fill={colors.dark} opacity={0.2} />
      );
      elements.push(
        <Path key="body-main" d={organicPath} 
              fill={`url(#bodyGrad-${hash})`} 
              stroke={colors.dark} strokeWidth={3} 
              filter={`url(#glow-${hash})`} />
      );
      // 高光
      elements.push(
        <Ellipse key="body-highlight" cx={centerX - baseSize * 0.2} cy={centerY - baseSize * 0.4} 
                 rx={baseSize * 0.3} ry={baseSize * 0.25} 
                 fill="rgba(255,255,255,0.4)" />
      );
      break;
  }
  
  return elements;
};

// =========================================
// 生成精致的装饰元素
// =========================================
const generateRefinedDecorations = (features, colors, size, centerX, centerY) => {
  const elements = [];
  const baseSize = size * 0.4;
  const hash = features.uniqueId;
  
  // 翅膀
  if (features.hasWings) {
    const wingSize = baseSize * 0.8;
    for (let side = -1; side <= 1; side += 2) {
      const wingX = centerX + side * baseSize * 0.6;
      const wingPath = `M ${wingX} ${centerY}
                        Q ${wingX + side * wingSize * 0.3} ${centerY - wingSize * 0.2} 
                          ${wingX + side * wingSize * 0.6} ${centerY - wingSize * 0.1}
                        Q ${wingX + side * wingSize * 0.8} ${centerY + wingSize * 0.1} 
                          ${wingX + side * wingSize * 0.5} ${centerY + wingSize * 0.3}
                        Q ${wingX + side * wingSize * 0.2} ${centerY + wingSize * 0.2} 
                          ${wingX} ${centerY} Z`;
      elements.push(
        <Path key={`wing-${side}`} d={wingPath} 
              fill={`url(#wingGrad-${hash}-${side})`} 
              stroke={colors.dark} strokeWidth={2} opacity={0.9} />
      );
    }
  }
  
  // 尾巴
  if (features.hasTail) {
    const tailPath = `M ${centerX} ${centerY + baseSize * 0.5}
                      Q ${centerX + baseSize * 0.3} ${centerY + baseSize * 0.8} 
                        ${centerX + baseSize * 0.6} ${centerY + baseSize * 1.2}
                      Q ${centerX + baseSize * 0.4} ${centerY + baseSize * 1.0} 
                        ${centerX + baseSize * 0.2} ${centerY + baseSize * 0.7}
                      Z`;
    elements.push(
      <Path key="tail" d={tailPath} 
            fill={colors.secondary} 
            stroke={colors.dark} strokeWidth={2} opacity={0.9} />
    );
  }
  
  // 角
  if (features.hasHorns) {
    for (let side = -1; side <= 1; side += 2) {
      const hornX = centerX + side * baseSize * 0.3;
      const hornPath = `M ${hornX} ${centerY - baseSize * 0.6}
                        L ${hornX + side * baseSize * 0.15} ${centerY - baseSize * 1.0}
                        L ${hornX + side * baseSize * 0.05} ${centerY - baseSize * 0.8}
                        Z`;
      elements.push(
        <Path key={`horn-${side}`} d={hornPath} 
              fill={colors.accent} 
              stroke={colors.dark} strokeWidth={2} />
      );
    }
  }
  
  // 鳍
  if (features.hasFins) {
    const finPath = `M ${centerX} ${centerY - baseSize * 0.3}
                     L ${centerX - baseSize * 0.4} ${centerY - baseSize * 0.8}
                     L ${centerX} ${centerY - baseSize * 0.5}
                     L ${centerX + baseSize * 0.4} ${centerY - baseSize * 0.8}
                     Z`;
    elements.push(
      <Path key="fin" d={finPath} 
            fill={colors.secondary} 
            stroke={colors.dark} strokeWidth={2} opacity={0.9} />
    );
  }
  
  // 元素特效
  if (features.hasFlame) {
    for (let i = 0; i < 3; i++) {
      const angle = (i - 1) * 0.3;
      const flameX = centerX + Math.cos(angle) * baseSize * 0.8;
      const flameY = centerY + Math.sin(angle) * baseSize * 0.8;
      const flamePath = `M ${flameX} ${flameY}
                         Q ${flameX - baseSize * 0.1} ${flameY - baseSize * 0.3} 
                           ${flameX} ${flameY - baseSize * 0.4}
                         Q ${flameX + baseSize * 0.1} ${flameY - baseSize * 0.3} 
                           ${flameX} ${flameY} Z`;
      elements.push(
        <Path key={`flame-${i}`} d={flamePath} 
              fill={`url(#flameGrad-${hash}-${i})`} 
              opacity={0.8} filter={`url(#glow-${hash})`} />
      );
    }
  }
  
  if (features.hasIce) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const iceX = centerX + Math.cos(angle) * baseSize * 0.7;
      const iceY = centerY + Math.sin(angle) * baseSize * 0.7;
      const icePath = `M ${iceX} ${iceY}
                       L ${iceX + Math.cos(angle) * baseSize * 0.15} ${iceY + Math.sin(angle) * baseSize * 0.15}
                       L ${iceX + Math.cos(angle + 0.3) * baseSize * 0.1} ${iceY + Math.sin(angle + 0.3) * baseSize * 0.1}
                       Z`;
      elements.push(
        <Path key={`ice-${i}`} d={icePath} 
              fill={colors.accent} 
              stroke={colors.light} strokeWidth={1} opacity={0.7} />
      );
    }
  }
  
  if (features.hasElectric) {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x1 = centerX + Math.cos(angle) * baseSize * 0.6;
      const y1 = centerY + Math.sin(angle) * baseSize * 0.6;
      const x2 = centerX + Math.cos(angle) * baseSize * 0.9;
      const y2 = centerY + Math.sin(angle) * baseSize * 0.9;
      const x3 = centerX + Math.cos(angle + 0.1) * baseSize * 0.85;
      const y3 = centerY + Math.sin(angle + 0.1) * baseSize * 0.85;
      elements.push(
        <Path key={`electric-${i}`} 
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`} 
              fill={colors.glow} 
              opacity={0.8} filter={`url(#glow-${hash})`} />
      );
    }
  }
  
  if (features.hasLeaves) {
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leafX = centerX + Math.cos(angle) * baseSize * 0.7;
      const leafY = centerY + Math.sin(angle) * baseSize * 0.7;
      const leafPath = `M ${leafX} ${leafY}
                        Q ${leafX + Math.cos(angle) * baseSize * 0.2} ${leafY + Math.sin(angle) * baseSize * 0.2} 
                          ${leafX + Math.cos(angle + 0.3) * baseSize * 0.15} ${leafY + Math.sin(angle + 0.3) * baseSize * 0.15}
                        Q ${leafX} ${leafY} 
                          ${leafX + Math.cos(angle - 0.3) * baseSize * 0.15} ${leafY + Math.sin(angle - 0.3) * baseSize * 0.15}
                        Z`;
      elements.push(
        <Path key={`leaf-${i}`} d={leafPath} 
              fill={colors.accent} 
              stroke={colors.dark} strokeWidth={1} opacity={0.8} />
      );
    }
  }
  
  return elements;
};

// =========================================
// 生成精致的眼睛
// =========================================
const generateRefinedEyes = (features, colors, size, centerX, centerY) => {
  const elements = [];
  const baseSize = size * 0.4;
  const eyeSize = baseSize * 0.12;
  const eyeY = centerY - baseSize * 0.3;
  
  if (features.eyeCount === 2) {
    // 两只眼睛
    for (let side = -1; side <= 1; side += 2) {
      const eyeX = centerX + side * baseSize * 0.25;
      // 眼白
      elements.push(
        <Circle key={`eye-white-${side}`} cx={eyeX} cy={eyeY} r={eyeSize * 1.2} 
                fill="#FFFFFF" stroke={colors.dark} strokeWidth={1.5} />
      );
      // 眼球
      elements.push(
        <Circle key={`eye-pupil-${side}`} cx={eyeX} cy={eyeY} r={eyeSize} 
                fill="#000000" />
      );
      // 高光
      elements.push(
        <Circle key={`eye-highlight-${side}`} cx={eyeX - eyeSize * 0.3} cy={eyeY - eyeSize * 0.3} r={eyeSize * 0.3} 
                fill="#FFFFFF" />
      );
      // 发光效果
      if (features.eyeType === 'glowing') {
        elements.push(
          <Circle key={`eye-glow-${side}`} cx={eyeX} cy={eyeY} r={eyeSize * 1.5} 
                  fill={colors.glow} opacity={0.4} filter={`url(#glow-${features.uniqueId})`} />
        );
      }
    }
  } else if (features.eyeCount === 1) {
    // 单只眼睛
    elements.push(
      <Circle key="eye-white" cx={centerX} cy={eyeY} r={eyeSize * 1.5} 
              fill={colors.glow} opacity={0.3} />
    );
    elements.push(
      <Circle key="eye-pupil" cx={centerX} cy={eyeY} r={eyeSize * 1.2} 
              fill="#000000" />
    );
    elements.push(
      <Circle key="eye-highlight" cx={centerX - eyeSize * 0.4} cy={eyeY - eyeSize * 0.4} r={eyeSize * 0.4} 
              fill="#FFFFFF" />
    );
  } else {
    // 多只眼睛
    for (let i = 0; i < features.eyeCount; i++) {
      const angle = (i * Math.PI * 2) / features.eyeCount;
      const eyeX = centerX + Math.cos(angle) * baseSize * 0.2;
      const eyeYPos = eyeY + Math.sin(angle) * baseSize * 0.1;
      elements.push(
        <Circle key={`eye-${i}`} cx={eyeX} cy={eyeYPos} r={eyeSize} 
                fill="#000000" />
      );
      elements.push(
        <Circle key={`eye-highlight-${i}`} cx={eyeX - eyeSize * 0.3} cy={eyeYPos - eyeSize * 0.3} r={eyeSize * 0.3} 
                fill="#FFFFFF" />
      );
    }
  }
  
  return elements;
};

// =========================================
// 生成精致的嘴巴
// =========================================
const generateRefinedMouth = (features, colors, size, centerX, centerY) => {
  const elements = [];
  const baseSize = size * 0.4;
  const mouthY = centerY + baseSize * 0.2;
  
  if (features.eyeType === 'happy') {
    // 笑脸
    const smilePath = `M ${centerX - baseSize * 0.2} ${mouthY}
                       Q ${centerX} ${mouthY + baseSize * 0.15} 
                         ${centerX + baseSize * 0.2} ${mouthY}`;
    elements.push(
      <Path key="mouth" d={smilePath} 
            fill="none" stroke="#000000" strokeWidth={2.5} strokeLinecap="round" />
    );
  } else {
    // 普通嘴巴
    elements.push(
      <Ellipse key="mouth" cx={centerX} cy={mouthY} rx={baseSize * 0.15} ry={baseSize * 0.08} 
               fill="#000000" />
    );
  }
  
  return elements;
};

// =========================================
// 主生成函数
// =========================================
export const generatePetModel = (pet, size = 180) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  
  const finalSize = size;
  const centerX = finalSize / 2;
  const centerY = finalSize / 2;
  
  // 分析名字特征
  const features = analyzeName(name);
  const hash = features.uniqueId;
  
  // 生成所有元素
  const bodyElements = generateRefinedBody(features, colors, finalSize, centerX, centerY);
  const decorationElements = generateRefinedDecorations(features, colors, finalSize, centerX, centerY);
  const eyeElements = generateRefinedEyes(features, colors, finalSize, centerX, centerY);
  const mouthElements = generateRefinedMouth(features, colors, finalSize, centerX, centerY);
  
  return (
    <svg 
      width={finalSize} 
      height={finalSize} 
      viewBox={`0 0 ${finalSize} ${finalSize}`} 
      style={{ overflow: 'visible' }}
      className="pet-svg-model"
    >
      <defs>
        {/* 主体渐变 */}
        <linearGradient id={`bodyGrad-${hash}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="30%" stopColor={colors.secondary} />
          <stop offset="70%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.primary} />
        </linearGradient>
        
        {/* 翅膀渐变 */}
        {features.hasWings && (
          <>
            <linearGradient id={`wingGrad-${hash}--1`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
            <linearGradient id={`wingGrad-${hash}-1`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
          </>
        )}
        
        {/* 火焰渐变 */}
        {features.hasFlame && [0, 1, 2].map(i => (
          <linearGradient key={`flameGrad-${hash}-${i}`} id={`flameGrad-${hash}-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#FF4444" />
          </linearGradient>
        ))}
        
        {/* 闪光精灵渐变 */}
        {pet.isShiny && (
          <radialGradient id={`shiny-glow-${pet.id}`}>
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFE66D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        )}
        
        {/* 发光滤镜 */}
        <filter id={`glow-${hash}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* 阴影滤镜 */}
        <filter id={`shadow-${pet.id}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>
      
      {/* 背景光晕（闪光精灵） */}
      {pet.isShiny && (
        <Circle cx={centerX} cy={centerY} r={finalSize * 0.55} fill={`url(#shiny-glow-${pet.id})`} />
      )}
      
      {/* 主体 */}
      <g filter={`url(#shadow-${pet.id})`}>
        {bodyElements}
      </g>
      
      {/* 装饰元素 */}
      <g opacity={0.95}>
        {decorationElements}
      </g>
      
      {/* 眼睛 */}
      <g>
        {eyeElements}
      </g>
      
      {/* 嘴巴 */}
      <g>
        {mouthElements}
      </g>
    </svg>
  );
};

export default generatePetModel;
