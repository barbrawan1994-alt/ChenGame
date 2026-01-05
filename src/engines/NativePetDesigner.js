// =========================================
// 原生精灵设计师 - 为每只精灵生成完全独特的设计
// =========================================

import React from 'react';

// 类型颜色映射
const TYPE_COLORS = {
  FIRE: { primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD93D', dark: '#CC5555', light: '#FFB8B8', glow: '#FF4444' },
  WATER: { primary: '#4ECDC4', secondary: '#6EDDD6', accent: '#A8E6CF', dark: '#3BA8A0', light: '#B8F0EB', glow: '#00BCD4' },
  GRASS: { primary: '#95E1D3', secondary: '#B8E6D8', accent: '#C8E6C9', dark: '#7AB8A8', light: '#D4F4E8', glow: '#4CAF50' },
  ELECTRIC: { primary: '#FFE66D', secondary: '#FFF89C', accent: '#FFD93D', dark: '#CCB855', light: '#FFF4B8', glow: '#FFEB3B' },
  ICE: { primary: '#A8E6CF', secondary: '#C8F0E0', accent: '#E0F7FA', dark: '#88C6AF', light: '#E8F8F4', glow: '#81D4FA' },
  FIGHT: { primary: '#FF8B94', secondary: '#FFA8B0', accent: '#FF6B6B', dark: '#CC6F75', light: '#FFC8D0', glow: '#F44336' },
  POISON: { primary: '#C7CEEA', secondary: '#D8DFF0', accent: '#E0BBE4', dark: '#9FA5BB', light: '#E8E8F8', glow: '#9C27B0' },
  GROUND: { primary: '#D4A574', secondary: '#E0B890', accent: '#F4D03F', dark: '#AA8459', light: '#F0D4A8', glow: '#FF9800' },
  FLYING: { primary: '#B8E6B8', secondary: '#D4F4D4', accent: '#E8F5E8', dark: '#93B893', light: '#E8F8E8', glow: '#8BC34A' },
  PSYCHIC: { primary: '#FFB6C1', secondary: '#FFC8D3', accent: '#FFD6E0', dark: '#CC9199', light: '#FFE8ED', glow: '#E91E63' },
  BUG: { primary: '#C8E6C9', secondary: '#D8F0D8', accent: '#E8F5E8', dark: '#A0B8A1', light: '#E8F8E8', glow: '#4CAF50' },
  ROCK: { primary: '#D3D3D3', secondary: '#E0E0E0', accent: '#F0F0F0', dark: '#A8A8A8', light: '#F0F0F0', glow: '#9E9E9E' },
  GHOST: { primary: '#E0BBE4', secondary: '#E8D0EB', accent: '#F0E5F2', dark: '#B395B6', light: '#F0E8F4', glow: '#9C27B0' },
  DRAGON: { primary: '#FFD93D', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD30', light: '#FFF4B8', glow: '#FFC107' },
  STEEL: { primary: '#B8B8B8', secondary: '#D0D0D0', accent: '#E8E8E8', dark: '#939393', light: '#E0E0E0', glow: '#607D8B' },
  FAIRY: { primary: '#FFB6D9', secondary: '#FFC8E5', accent: '#FFD6ED', dark: '#CC9199', light: '#FFE8F4', glow: '#E91E63' },
  GOD: { primary: '#FFD700', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD00', light: '#FFF4B8', glow: '#FFC107' },
  NORMAL: { primary: '#F5F5F5', secondary: '#FAFAFA', accent: '#FFFFFF', dark: '#C4C4C4', light: '#FFFFFF', glow: '#9E9E9E' }
};

// 基础SVG组件
const Circle = ({ cx, cy, r, fill, stroke, strokeWidth = 0, opacity = 1, transform = '' }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Ellipse = ({ cx, cy, rx, ry, fill, stroke, strokeWidth = 0, opacity = 1, transform = '' }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Rect = ({ x, y, width, height, fill, stroke, strokeWidth = 0, rx = 0, ry = 0, opacity = 1, transform = '' }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx={rx} ry={ry} opacity={opacity} transform={transform} />
);

const Polygon = ({ points, fill, stroke, strokeWidth = 0, opacity = 1, transform = '' }) => (
  <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Path = ({ d, fill, stroke, strokeWidth = 0, opacity = 1 }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
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
// 原生设计生成器 - 基于名字生成完全独特的设计
// =========================================
const generateNativeDesign = (name, type, colors, size) => {
  const hash = generateHash(name);
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 基于哈希值生成设计参数
  const designSeed = hash % 1000000;
  const shapeType = designSeed % 12; // 12种基础形状
  const complexity = (designSeed >> 3) % 5 + 3; // 复杂度 3-7
  const symmetry = (designSeed >> 6) % 3; // 对称类型 0-2
  const patternType = (designSeed >> 8) % 8; // 图案类型 0-7
  
  const baseSize = size * 0.35;
  const elements = [];
  const gradientId = `grad-${hash}`;
  
  // 根据形状类型生成主体
  switch (shapeType) {
    case 0: // 圆形主体
      elements.push(
        <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
                fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加内部装饰
      for (let i = 0; i < complexity; i++) {
        const angle = (i * Math.PI * 2) / complexity;
        const r = baseSize * (0.3 + (i % 2) * 0.2);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        elements.push(
          <Circle key={`decoration-${i}`} cx={x} cy={y} r={baseSize * 0.08} 
                  fill={colors.accent} opacity={0.7} />
        );
      }
      break;
      
    case 1: // 椭圆主体
      elements.push(
        <Ellipse key="body" cx={centerX} cy={centerY} rx={baseSize * 0.9} ry={baseSize} 
                 fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加条纹装饰
      for (let i = 0; i < complexity; i++) {
        const offset = (i - complexity/2) * baseSize * 0.15;
        elements.push(
          <Ellipse key={`stripe-${i}`} cx={centerX + offset} cy={centerY} 
                   rx={baseSize * 0.05} ry={baseSize * 0.8} 
                   fill={colors.secondary} opacity={0.6} />
        );
      }
      break;
      
    case 2: // 方形主体
      const squareSize = baseSize * 1.2;
      elements.push(
        <Rect key="body" x={centerX - squareSize} y={centerY - squareSize} 
              width={squareSize * 2} height={squareSize * 2} 
              fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} 
              rx={squareSize * 0.15} ry={squareSize * 0.15} />
      );
      // 添加角装饰
      const corners = [
        { x: centerX - squareSize, y: centerY - squareSize },
        { x: centerX + squareSize, y: centerY - squareSize },
        { x: centerX - squareSize, y: centerY + squareSize },
        { x: centerX + squareSize, y: centerY + squareSize }
      ];
      corners.forEach((corner, i) => {
        elements.push(
          <Circle key={`corner-${i}`} cx={corner.x} cy={corner.y} r={baseSize * 0.15} 
                  fill={colors.accent} opacity={0.8} />
        );
      });
      break;
      
    case 3: // 三角形主体
      const triSize = baseSize * 1.3;
      elements.push(
        <Polygon key="body" 
                 points={`${centerX},${centerY - triSize} ${centerX - triSize},${centerY + triSize * 0.6} ${centerX + triSize},${centerY + triSize * 0.6}`} 
                 fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加内部三角形
      for (let i = 0; i < complexity - 2; i++) {
        const scale = 0.7 - (i * 0.1);
        const innerSize = triSize * scale;
        elements.push(
          <Polygon key={`inner-${i}`} 
                   points={`${centerX},${centerY - innerSize} ${centerX - innerSize},${centerY + innerSize * 0.6} ${centerX + innerSize},${centerY + innerSize * 0.6}`} 
                   fill={colors.secondary} opacity={0.4 - i * 0.05} />
        );
      }
      break;
      
    case 4: // 星形主体
      const starPoints = [];
      const starSize = baseSize * 1.2;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const r = i % 2 === 0 ? starSize : starSize * 0.5;
        starPoints.push(`${centerX + Math.cos(angle) * r},${centerY + Math.sin(angle) * r}`);
      }
      elements.push(
        <Polygon key="body" points={starPoints.join(' ')} 
                 fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加中心装饰
      elements.push(
        <Circle key="center" cx={centerX} cy={centerY} r={baseSize * 0.3} 
                fill={colors.accent} opacity={0.8} />
      );
      break;
      
    case 5: // 菱形主体
      const diamondSize = baseSize * 1.1;
      elements.push(
        <Polygon key="body" 
                 points={`${centerX},${centerY - diamondSize} ${centerX + diamondSize},${centerY} ${centerX},${centerY + diamondSize} ${centerX - diamondSize},${centerY}`} 
                 fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加对角线装饰
      elements.push(
        <Path key="diagonal1" d={`M ${centerX - diamondSize} ${centerY} L ${centerX + diamondSize} ${centerY}`} 
              stroke={colors.accent} strokeWidth={2} opacity={0.6} />
      );
      elements.push(
        <Path key="diagonal2" d={`M ${centerX} ${centerY - diamondSize} L ${centerX} ${centerY + diamondSize}`} 
              stroke={colors.accent} strokeWidth={2} opacity={0.6} />
      );
      break;
      
    case 6: // 六边形主体
      const hexPoints = [];
      const hexSize = baseSize * 1.1;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        hexPoints.push(`${centerX + Math.cos(angle) * hexSize},${centerY + Math.sin(angle) * hexSize}`);
      }
      elements.push(
        <Polygon key="body" points={hexPoints.join(' ')} 
                 fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      // 添加内部六边形
      for (let i = 0; i < complexity - 2; i++) {
        const scale = 0.8 - (i * 0.15);
        const innerHexPoints = [];
        const innerSize = hexSize * scale;
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          innerHexPoints.push(`${centerX + Math.cos(angle) * innerSize},${centerY + Math.sin(angle) * innerSize}`);
        }
        elements.push(
          <Polygon key={`inner-hex-${i}`} points={innerHexPoints.join(' ')} 
                   fill={colors.secondary} opacity={0.3 - i * 0.05} />
        );
      }
      break;
      
    case 7: // 花瓣形主体
      const petalCount = 5 + (designSeed % 4); // 5-8瓣
      const petalSize = baseSize * 1.1;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const x = centerX + Math.cos(angle) * petalSize * 0.5;
        const y = centerY + Math.sin(angle) * petalSize * 0.5;
        elements.push(
          <Ellipse key={`petal-${i}`} cx={x} cy={y} rx={petalSize * 0.4} ry={petalSize * 0.6} 
                   fill={i % 2 === 0 ? colors.primary : colors.secondary} 
                   stroke={colors.dark} strokeWidth={2} 
                   transform={`rotate(${angle * 180 / Math.PI} ${x} ${y})`} />
        );
      }
      // 中心
      elements.push(
        <Circle key="center" cx={centerX} cy={centerY} r={baseSize * 0.3} 
                fill={colors.accent} stroke={colors.dark} strokeWidth={2} />
      );
      break;
      
    case 8: // 螺旋形主体
      const spiralSize = baseSize * 1.2;
      const spiralPath = [];
      for (let i = 0; i < 20; i++) {
        const angle = i * 0.3;
        const r = (i / 20) * spiralSize;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        spiralPath.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
      }
      elements.push(
        <Path key="body" d={spiralPath.join(' ')} 
              fill="none" stroke={colors.primary} strokeWidth={baseSize * 0.15} 
              strokeLinecap="round" />
      );
      // 添加填充圆形
      elements.push(
        <Circle key="fill" cx={centerX} cy={centerY} r={baseSize * 0.4} 
                fill={colors.secondary} opacity={0.6} />
      );
      break;
      
    case 9: // 波浪形主体
      const waveSize = baseSize * 1.3;
      const wavePath = [];
      for (let i = 0; i <= 20; i++) {
        const x = centerX - waveSize + (i / 20) * waveSize * 2;
        const y = centerY + Math.sin(i * 0.5) * waveSize * 0.3;
        wavePath.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
      }
      wavePath.push(`L ${centerX + waveSize} ${centerY + waveSize}`);
      wavePath.push(`L ${centerX - waveSize} ${centerY + waveSize}`);
      wavePath.push('Z');
      elements.push(
        <Path key="body" d={wavePath.join(' ')} 
              fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth={3} />
      );
      break;
      
    case 10: // 分形主体
      const fractalSize = baseSize;
      // 主圆
      elements.push(
        <Circle key="body" cx={centerX} cy={centerY} r={fractalSize} 
                fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      );
      // 分形圆
      for (let i = 0; i < complexity; i++) {
        const angle = (i * Math.PI * 2) / complexity;
        const r = fractalSize * 0.6;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        elements.push(
          <Circle key={`fractal-${i}`} cx={x} cy={y} r={fractalSize * 0.3} 
                  fill={colors.secondary} opacity={0.7} />
        );
        // 二级分形
        for (let j = 0; j < 3; j++) {
          const subAngle = angle + (j * Math.PI * 2) / 3;
          const subR = fractalSize * 0.15;
          const subX = x + Math.cos(subAngle) * subR;
          const subY = y + Math.sin(subAngle) * subR;
          elements.push(
            <Circle key={`fractal-${i}-${j}`} cx={subX} cy={subY} r={fractalSize * 0.1} 
                    fill={colors.accent} opacity={0.8} />
          );
        }
      }
      break;
      
    case 11: // 几何组合主体
      const geoSize = baseSize;
      // 中心圆
      elements.push(
        <Circle key="body" cx={centerX} cy={centerY} r={geoSize} 
                fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      );
      // 周围几何形状
      for (let i = 0; i < complexity; i++) {
        const angle = (i * Math.PI * 2) / complexity;
        const r = geoSize * 0.7;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i % 3 === 0) {
          elements.push(
            <Circle key={`geo-${i}`} cx={x} cy={y} r={geoSize * 0.2} 
                    fill={colors.secondary} opacity={0.8} />
          );
        } else if (i % 3 === 1) {
          elements.push(
            <Rect key={`geo-${i}`} x={x - geoSize * 0.15} y={y - geoSize * 0.15} 
                  width={geoSize * 0.3} height={geoSize * 0.3} 
                  fill={colors.accent} opacity={0.7} rx={geoSize * 0.05} />
          );
        } else {
          const triSize = geoSize * 0.2;
          elements.push(
            <Polygon key={`geo-${i}`} 
                     points={`${x},${y - triSize} ${x - triSize},${y + triSize} ${x + triSize},${y + triSize}`} 
                     fill={colors.light} opacity={0.6} />
          );
        }
      }
      break;
  }
  
  // 添加眼睛（根据对称类型）
  const eyeSize = baseSize * 0.1;
  const eyeY = centerY - baseSize * 0.3;
  
  if (symmetry === 0) {
    // 两只眼睛
    elements.push(
      <Circle key="eye1" cx={centerX - baseSize * 0.25} cy={eyeY} r={eyeSize} fill="#000" />
    );
    elements.push(
      <Circle key="eye2" cx={centerX + baseSize * 0.25} cy={eyeY} r={eyeSize} fill="#000" />
    );
    elements.push(
      <Circle key="eye1-white" cx={centerX - baseSize * 0.25} cy={eyeY} r={eyeSize * 0.5} fill="#fff" />
    );
    elements.push(
      <Circle key="eye2-white" cx={centerX + baseSize * 0.25} cy={eyeY} r={eyeSize * 0.5} fill="#fff" />
    );
  } else if (symmetry === 1) {
    // 单只眼睛
    elements.push(
      <Circle key="eye" cx={centerX} cy={eyeY} r={eyeSize * 1.2} fill={colors.glow} opacity={0.9} />
    );
    elements.push(
      <Circle key="eye-inner" cx={centerX} cy={eyeY} r={eyeSize * 0.6} fill="#000" />
    );
  } else {
    // 三只眼睛
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const eyeX = centerX + Math.cos(angle) * baseSize * 0.2;
      const eyeYPos = eyeY + Math.sin(angle) * baseSize * 0.1;
      elements.push(
        <Circle key={`eye-${i}`} cx={eyeX} cy={eyeYPos} r={eyeSize} fill="#000" />
      );
    }
  }
  
  // 添加嘴巴（根据图案类型）
  const mouthY = centerY + baseSize * 0.2;
  if (patternType % 2 === 0) {
    elements.push(
      <Ellipse key="mouth" cx={centerX} cy={mouthY} rx={baseSize * 0.15} ry={baseSize * 0.1} fill="#000" />
    );
  } else {
    elements.push(
      <Path key="mouth" d={`M ${centerX - baseSize * 0.2} ${mouthY} Q ${centerX} ${mouthY + baseSize * 0.1} ${centerX + baseSize * 0.2} ${mouthY}`} 
            fill="none" stroke="#000" strokeWidth={2} />
    );
  }
  
  // 添加特殊效果（根据类型）
  if (type === 'FIRE') {
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const x = centerX + Math.cos(angle) * baseSize * 0.8;
      const y = centerY + Math.sin(angle) * baseSize * 0.8;
      elements.push(
        <Path key={`flame-${i}`} 
              d={`M ${x} ${y} L ${x - baseSize * 0.1} ${y - baseSize * 0.2} L ${x} ${y - baseSize * 0.15} L ${x + baseSize * 0.1} ${y - baseSize * 0.2} Z`} 
              fill="#FF6B6B" opacity={0.8} />
      );
    }
  } else if (type === 'WATER') {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const x = centerX + Math.cos(angle) * baseSize * 0.7;
      const y = centerY + Math.sin(angle) * baseSize * 0.7;
      elements.push(
        <Circle key={`bubble-${i}`} cx={x} cy={y} r={baseSize * 0.08} 
                fill={colors.accent} opacity={0.6} />
      );
    }
  } else if (type === 'ELECTRIC') {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x1 = centerX + Math.cos(angle) * baseSize * 0.6;
      const y1 = centerY + Math.sin(angle) * baseSize * 0.6;
      const x2 = centerX + Math.cos(angle) * baseSize * 0.9;
      const y2 = centerY + Math.sin(angle) * baseSize * 0.9;
      elements.push(
        <Path key={`electric-${i}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} 
              fill="none" stroke={colors.glow} strokeWidth={3} opacity={0.8} />
      );
    }
  }
  
  return { elements, gradientId };
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
  const { elements, gradientId } = generateNativeDesign(name, type, colors, finalSize);
  
  return (
    <svg 
      width={finalSize} 
      height={finalSize} 
      viewBox={`0 0 ${finalSize} ${finalSize}`} 
      style={{ overflow: 'visible' }}
      className="pet-svg-model"
    >
      <defs>
        {/* 渐变定义 */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
        
        {/* 闪光精灵渐变 */}
        {pet.isShiny && (
          <radialGradient id={`shiny-glow-${pet.id}`}>
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFE66D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        )}
        
        {/* 阴影滤镜 */}
        <filter id={`shadow-${pet.id}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      
      {/* 背景光晕（闪光精灵） */}
      {pet.isShiny && (
        <Circle cx={finalSize/2} cy={finalSize/2} r={finalSize*0.5} fill={`url(#shiny-glow-${pet.id})`} />
      )}
      
      {/* 生成原生设计 */}
      <g filter={`url(#shadow-${pet.id})`}>
        {elements}
      </g>
    </svg>
  );
};

export default generatePetModel;

