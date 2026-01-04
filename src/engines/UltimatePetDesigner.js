// =========================================
// 终极精灵设计师 - 为每只精灵生成完全独特的精致造型
// =========================================

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

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
// 为每个精灵名字生成独特的哈希值
// =========================================
const generateNameHash = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// =========================================
// 深度分析名字特征
// =========================================
const analyzeName = (name) => {
  const hash = generateNameHash(name);
  const features = {
    // 基础形状
    bodyShape: ['round', 'oval', 'square', 'triangle', 'diamond', 'star', 'hexagon', 'long'][hash % 8],
    headShape: ['round', 'oval', 'square', 'triangle'][(hash >> 3) % 4],
    
    // 身体特征
    hasWings: name.includes('鸟') || name.includes('鹰') || name.includes('凤') || name.includes('雕') || name.includes('雀') || name.includes('飞'),
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
    hasTrunk: name.includes('象') || name.includes('鼻'),
    hasTusks: name.includes('犀') || name.includes('牙'),
    eyeCount: name.includes('三') ? 3 : name.includes('四') ? 4 : 2,
    eyeSize: name.includes('大') ? 'large' : name.includes('小') ? 'small' : 'normal',
    eyeType: name.includes('魔') || name.includes('恶') || name.includes('暗') || name.includes('鬼') ? 'glowing' : 
             name.includes('天') || name.includes('使') || name.includes('仙') ? 'happy' : 'normal',
    
    // 特殊特征
    hasFlame: name.includes('火') || name.includes('炎') || name.includes('熔') || name.includes('焰') || name.includes('燃'),
    hasIce: name.includes('冰') || name.includes('雪') || name.includes('寒') || name.includes('冻'),
    hasElectric: name.includes('电') || name.includes('雷') || name.includes('闪') || name.includes('磁'),
    hasLeaves: name.includes('树') || name.includes('花') || name.includes('叶') || name.includes('草') || name.includes('藤'),
    hasFlowers: name.includes('花') || name.includes('朵'),
    hasCrystals: name.includes('晶') || name.includes('钻') || name.includes('宝') || name.includes('石'),
    hasGems: name.includes('宝') || name.includes('钻') || name.includes('石'),
    
    // 大小
    size: name.includes('小') || name.includes('幼') || name.includes('迷') ? 'small' :
          name.includes('大') || name.includes('巨') || name.includes('王') || name.includes('主') || name.includes('神') || name.includes('皇') ? 'large' : 'medium',
    
    // 颜色模式
    colorPattern: name.includes('魔') || name.includes('恶') || name.includes('暗') ? 'gradient' : 'solid',
    
    // 姿态
    posture: name.includes('鸟') || name.includes('鹰') || name.includes('飞') ? 'flying' :
             name.includes('鱼') || name.includes('海') || name.includes('水') ? 'swimming' : 'standing',
    
    // 唯一特征（基于哈希）
    uniqueId: hash
  };
  
  return features;
};

// =========================================
// 生成独特的精灵设计
// =========================================
const generateUniqueDesign = (name, type, colors, size) => {
  const features = analyzeName(name);
  const centerX = size / 2;
  const centerY = size / 2;
  const hash = features.uniqueId;
  
  // 根据大小调整基础尺寸
  let baseSize = size * 0.3;
  if (features.size === 'small') baseSize *= 0.8;
  else if (features.size === 'large') baseSize *= 1.2;
  
  const elements = [];
  const gradientId = `grad-${hash}`;
  
  // 主体形状
  if (features.bodyShape === 'round') {
    elements.push(
      <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
              fill={features.colorPattern === 'gradient' ? `url(#${gradientId})` : colors.primary} 
              stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'oval') {
    elements.push(
      <Ellipse key="body" cx={centerX} cy={centerY} rx={baseSize * 0.9} ry={baseSize} 
               fill={features.colorPattern === 'gradient' ? `url(#${gradientId})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'square') {
    elements.push(
      <Rect key="body" x={centerX - baseSize} y={centerY - baseSize} width={baseSize * 2} height={baseSize * 2} 
            fill={features.colorPattern === 'gradient' ? `url(#${gradientId})` : colors.primary} 
            stroke={colors.dark} strokeWidth={3} rx={baseSize * 0.2} ry={baseSize * 0.2} />
    );
  } else if (features.bodyShape === 'triangle') {
    elements.push(
      <Polygon key="body" points={`${centerX},${centerY - baseSize * 1.2} ${centerX - baseSize},${centerY + baseSize * 0.6} ${centerX + baseSize},${centerY + baseSize * 0.6}`} 
               fill={features.colorPattern === 'gradient' ? `url(#${gradientId})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'star') {
    const starPoints = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const r = i % 2 === 0 ? baseSize : baseSize * 0.5;
      starPoints.push(`${centerX + Math.cos(angle) * r},${centerY + Math.sin(angle) * r}`);
    }
    elements.push(
      <Polygon key="body" points={starPoints.join(' ')} 
               fill={features.colorPattern === 'gradient' ? `url(#${gradientId})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'long') {
    const segments = 5 + (hash % 3);
    for (let i = 0; i < segments; i++) {
      const offsetX = (i - segments/2) * baseSize * 0.4;
      elements.push(
        <Ellipse key={`segment-${i}`} cx={centerX + offsetX} cy={centerY} 
                 rx={baseSize * 0.3} ry={baseSize * 0.5} 
                 fill={i === 0 ? colors.secondary : colors.primary} 
                 stroke={colors.dark} strokeWidth={2} />
      );
    }
  } else {
    elements.push(
      <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
              fill={colors.primary} stroke={colors.dark} strokeWidth={3} />
    );
  }
  
  // 头部
  const headSize = baseSize * 0.6;
  const headY = centerY - baseSize * 0.6;
  
  if (features.headShape === 'round') {
    elements.push(
      <Circle key="head" cx={centerX} cy={headY} r={headSize} 
              fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  } else if (features.headShape === 'oval') {
    elements.push(
      <Ellipse key="head" cx={centerX} cy={headY} rx={headSize * 0.8} ry={headSize} 
               fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  } else {
    elements.push(
      <Circle key="head" cx={centerX} cy={headY} r={headSize} 
              fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  }
  
  // 眼睛
  const eyeSize = baseSize * (features.eyeSize === 'tiny' ? 0.06 : 
                              features.eyeSize === 'small' ? 0.08 : 
                              features.eyeSize === 'large' ? 0.12 : 0.1);
  const eyeY = headY - headSize * 0.2;
  
  if (features.eyeCount === 1) {
    elements.push(
      <Circle key="eye" cx={centerX} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.glow : '#000'} 
              stroke={features.eyeType === 'glowing' ? colors.glow : 'none'} strokeWidth={features.eyeType === 'glowing' ? 2 : 0} />
    );
  } else if (features.eyeCount === 3) {
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const eyeX = centerX + Math.cos(angle) * headSize * 0.25;
      const eyeYPos = eyeY + Math.sin(angle) * headSize * 0.25;
      elements.push(
        <Circle key={`eye${i}`} cx={eyeX} cy={eyeYPos} r={eyeSize} 
                fill={features.eyeType === 'glowing' ? colors.glow : '#000'} />
      );
    }
  } else {
    elements.push(
      <Circle key="eye1" cx={centerX - headSize * 0.3} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.glow : '#000'} />
    );
    elements.push(
      <Circle key="eye2" cx={centerX + headSize * 0.3} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.glow : '#000'} />
    );
    if (features.eyeType !== 'glowing') {
      elements.push(
        <Circle key="eye1-white" cx={centerX - headSize * 0.3} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
      );
      elements.push(
        <Circle key="eye2-white" cx={centerX + headSize * 0.3} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
      );
    }
  }
  
  // 嘴巴
  if (features.eyeType === 'happy') {
    elements.push(
      <Path key="mouth" d={`M ${centerX - headSize * 0.3} ${headY + headSize * 0.2} Q ${centerX} ${headY + headSize * 0.4} ${centerX + headSize * 0.3} ${headY + headSize * 0.2}`} 
            fill="none" stroke="#000" strokeWidth={2} />
    );
  } else {
    elements.push(
      <Ellipse key="mouth" cx={centerX} cy={headY + headSize * 0.25} rx={headSize * 0.15} ry={headSize * 0.1} fill="#000" />
    );
  }
  
  // 特殊特征
  if (features.hasWings) {
    elements.push(
      <Ellipse key="wing1" cx={centerX - baseSize * 0.8} cy={centerY} rx={baseSize * 0.4} ry={baseSize * 0.6} 
               fill={colors.secondary} opacity={0.7} transform={`rotate(-25 ${centerX - baseSize * 0.8} ${centerY})`} />
    );
    elements.push(
      <Ellipse key="wing2" cx={centerX + baseSize * 0.8} cy={centerY} rx={baseSize * 0.4} ry={baseSize * 0.6} 
               fill={colors.secondary} opacity={0.7} transform={`rotate(25 ${centerX + baseSize * 0.8} ${centerY})`} />
    );
  }
  
  if (features.hasTail) {
    elements.push(
      <Path key="tail" d={`M ${centerX + baseSize * 0.6} ${centerY} Q ${centerX + baseSize * 1.2} ${centerY - baseSize * 0.3} ${centerX + baseSize * 1.0} ${centerY + baseSize * 0.2}`} 
            fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  }
  
  if (features.hasHorns) {
    elements.push(
      <Polygon key="horn1" points={`${centerX - headSize * 0.4},${headY - headSize * 0.6} ${centerX - headSize * 0.3},${headY - headSize * 0.9} ${centerX - headSize * 0.2},${headY - headSize * 0.7}`} 
               fill={colors.accent} />
    );
    elements.push(
      <Polygon key="horn2" points={`${centerX + headSize * 0.4},${headY - headSize * 0.6} ${centerX + headSize * 0.3},${headY - headSize * 0.9} ${centerX + headSize * 0.2},${headY - headSize * 0.7}`} 
               fill={colors.accent} />
    );
  }
  
  if (features.hasFins) {
    elements.push(
      <Polygon key="fin1" points={`${centerX - baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX - baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX - baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
    );
    elements.push(
      <Polygon key="fin2" points={`${centerX + baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX + baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX + baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
    );
  }
  
  if (features.hasFlame) {
    elements.push(
      <Path key="flame1" d={`M ${centerX} ${headY - headSize * 0.5} L ${centerX - baseSize * 0.2} ${headY - headSize * 0.8} L ${centerX} ${headY - headSize * 0.6} L ${centerX + baseSize * 0.2} ${headY - headSize * 0.8} Z`} 
            fill="#FF6B6B" opacity={0.9} />
    );
    elements.push(
      <Path key="flame2" d={`M ${centerX} ${headY - headSize * 0.6} L ${centerX - baseSize * 0.15} ${headY - headSize * 0.75} L ${centerX} ${headY - headSize * 0.65} L ${centerX + baseSize * 0.15} ${headY - headSize * 0.75} Z`} 
            fill="#FFD93D" opacity={0.8} />
    );
  }
  
  if (features.hasElectric) {
    elements.push(
      <Path key="electric" d={`M ${centerX} ${headY - headSize * 0.4} L ${centerX - baseSize * 0.1} ${centerY - baseSize * 0.2} L ${centerX + baseSize * 0.1} ${centerY - baseSize * 0.1} L ${centerX} ${centerY} L ${centerX - baseSize * 0.1} ${centerY + baseSize * 0.1} L ${centerX + baseSize * 0.1} ${centerY + baseSize * 0.2} L ${centerX} ${centerY + baseSize * 0.3}`} 
            fill="none" stroke={colors.glow} strokeWidth={4} opacity={0.9} />
    );
  }
  
  if (features.hasLeaves) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const leafX = centerX + Math.cos(angle) * baseSize * 0.8;
      const leafY = centerY + Math.sin(angle) * baseSize * 0.8;
      elements.push(
        <Ellipse key={`leaf-${i}`} cx={leafX} cy={leafY} rx={baseSize * 0.2} ry={baseSize * 0.3} 
                 fill={colors.accent} transform={`rotate(${angle * 180 / Math.PI} ${leafX} ${leafY})`} />
      );
    }
  }
  
  return { elements, gradientId, features };
};

// =========================================
// 主生成函数（带动画支持）
// =========================================
export const generatePetModel = (pet, size = 120) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  
  const finalSize = Math.min(size, 120);
  const { elements, gradientId, features } = generateUniqueDesign(name, type, colors, finalSize);
  
  // 返回SVG元素（不包装在组件中，直接返回JSX）
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
      
      {/* 生成独特模型 */}
      <g filter={`url(#shadow-${pet.id})`}>
        {elements}
      </g>
    </svg>
  );
};

export default generatePetModel;

