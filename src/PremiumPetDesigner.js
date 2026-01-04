import React from 'react';

// =========================================
// 精致精灵设计师 - 为每个名字生成独特的精致造型
// =========================================

// 类型颜色映射（更精致的配色）
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

// 基础SVG组件（支持渐变和更精细的控制）
const Circle = ({ cx, cy, r, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', gradient = null }) => (
  <circle cx={cx} cy={cy} r={r} fill={gradient || fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Ellipse = ({ cx, cy, rx, ry, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', gradient = null }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={gradient || fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Rect = ({ x, y, width, height, fill, stroke, strokeWidth = 0, rx = 0, ry = 0, opacity = 1, transform = '', gradient = null }) => (
  <rect x={x} y={y} width={width} height={height} fill={gradient || fill} stroke={stroke} strokeWidth={strokeWidth} rx={rx} ry={ry} opacity={opacity} transform={transform} />
);

const Polygon = ({ points, fill, stroke, strokeWidth = 0, opacity = 1, transform = '', gradient = null }) => (
  <polygon points={points} fill={gradient || fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Path = ({ d, fill, stroke, strokeWidth = 0, opacity = 1, gradient = null }) => (
  <path d={d} fill={gradient || fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
);

// =========================================
// 为每个精灵名字设计独特的精致造型
// =========================================

// 时空之神 - 精致的时间轮盘设计
const designShiKongZhiShen = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const baseR = size * 0.3;
  
  return (
    <g>
      {/* 外圈时间轮盘 */}
      <Circle cx={centerX} cy={centerY} r={baseR * 1.3} fill="none" stroke={colors.glow} strokeWidth={4} opacity={0.6} />
      <Circle cx={centerX} cy={centerY} r={baseR * 1.1} fill="none" stroke={colors.accent} strokeWidth={3} opacity={0.8} />
      
      {/* 时间指针 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i * Math.PI * 2) / 12;
        const x1 = centerX + Math.cos(angle) * baseR * 1.1;
        const y1 = centerY + Math.sin(angle) * baseR * 1.1;
        const x2 = centerX + Math.cos(angle) * baseR * 1.25;
        const y2 = centerY + Math.sin(angle) * baseR * 1.25;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.accent} strokeWidth={2} opacity={0.7} />
        );
      })}
      
      {/* 主体 - 神秘球体 */}
      <Circle cx={centerX} cy={centerY} r={baseR} fill={`url(#bodyGrad-shiKong)`} stroke={colors.glow} strokeWidth={4} />
      <Circle cx={centerX} cy={centerY} r={baseR * 0.7} fill={colors.secondary} opacity={0.6} />
      
      {/* 内部星云 */}
      <Ellipse cx={centerX - baseR * 0.3} cy={centerY - baseR * 0.2} rx={baseR * 0.2} ry={baseR * 0.3} fill={colors.accent} opacity={0.5} />
      <Ellipse cx={centerX + baseR * 0.3} cy={centerY + baseR * 0.2} rx={baseR * 0.25} ry={baseR * 0.2} fill={colors.light} opacity={0.4} />
      
      {/* 眼睛 - 发光的时空之眼 */}
      <Circle cx={centerX - baseR * 0.25} cy={centerY - baseR * 0.15} r={baseR * 0.12} fill={colors.glow} opacity={0.9} />
      <Circle cx={centerX + baseR * 0.25} cy={centerY - baseR * 0.15} r={baseR * 0.12} fill={colors.glow} opacity={0.9} />
      <Circle cx={centerX - baseR * 0.25} cy={centerY - baseR * 0.15} r={baseR * 0.06} fill="#fff" />
      <Circle cx={centerX + baseR * 0.25} cy={centerY - baseR * 0.15} r={baseR * 0.06} fill="#fff" />
      
      {/* 中心神秘符号 */}
      <Path d={`M ${centerX} ${centerY - baseR * 0.4} L ${centerX - baseR * 0.15} ${centerY} L ${centerX} ${centerY + baseR * 0.4} L ${centerX + baseR * 0.15} ${centerY} Z`} 
            fill={colors.accent} opacity={0.7} />
    </g>
  );
};

// 大力神 - 强壮的肌肉造型
const designDaLiShen = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const bodyW = size * 0.4;
  const bodyH = size * 0.5;
  
  return (
    <g>
      {/* 强壮的身体 */}
      <Ellipse cx={centerX} cy={centerY + size * 0.05} rx={bodyW} ry={bodyH} fill={`url(#bodyGrad-daLi)`} stroke={colors.dark} strokeWidth={3} />
      
      {/* 胸部肌肉 */}
      <Ellipse cx={centerX - bodyW * 0.3} cy={centerY} rx={bodyW * 0.25} ry={bodyH * 0.3} fill={colors.secondary} opacity={0.8} />
      <Ellipse cx={centerX + bodyW * 0.3} cy={centerY} rx={bodyW * 0.25} ry={bodyH * 0.3} fill={colors.secondary} opacity={0.8} />
      
      {/* 头部 */}
      <Circle cx={centerX} cy={centerY - bodyH * 0.6} r={bodyW * 0.5} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - bodyW * 0.2} cy={centerY - bodyH * 0.65} r={bodyW * 0.08} fill="#000" />
      <Circle cx={centerX + bodyW * 0.2} cy={centerY - bodyH * 0.65} r={bodyW * 0.08} fill="#000" />
      <Circle cx={centerX - bodyW * 0.2} cy={centerY - bodyH * 0.65} r={bodyW * 0.04} fill="#fff" />
      <Circle cx={centerX + bodyW * 0.2} cy={centerY - bodyH * 0.65} r={bodyW * 0.04} fill="#fff" />
      
      {/* 嘴巴 */}
      <Ellipse cx={centerX} cy={centerY - bodyH * 0.5} rx={bodyW * 0.15} ry={bodyW * 0.08} fill="#000" />
      
      {/* 强壮的手臂 */}
      <Ellipse cx={centerX - bodyW * 0.9} cy={centerY} rx={bodyW * 0.2} ry={bodyH * 0.4} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      <Ellipse cx={centerX + bodyW * 0.9} cy={centerY} rx={bodyW * 0.2} ry={bodyH * 0.4} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 拳头 */}
      <Circle cx={centerX - bodyW * 0.9} cy={centerY + bodyH * 0.3} r={bodyW * 0.25} fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      <Circle cx={centerX + bodyW * 0.9} cy={centerY + bodyH * 0.3} r={bodyW * 0.25} fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 腿部 */}
      <Ellipse cx={centerX - bodyW * 0.3} cy={centerY + bodyH * 0.7} rx={bodyW * 0.2} ry={bodyH * 0.3} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      <Ellipse cx={centerX + bodyW * 0.3} cy={centerY + bodyH * 0.7} rx={bodyW * 0.2} ry={bodyH * 0.3} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    </g>
  );
};

// 超能电池 - 精致的电池设计
const designChaoNengDianChi = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const bodyW = size * 0.35;
  const bodyH = size * 0.5;
  
  return (
    <g>
      {/* 电池主体 */}
      <Rect x={centerX - bodyW} y={centerY - bodyH * 0.6} width={bodyW * 2} height={bodyH * 1.2} 
            fill={`url(#bodyGrad-chaoNeng)`} stroke={colors.dark} strokeWidth={4} rx={bodyW * 0.2} ry={bodyW * 0.2} />
      
      {/* 正极 */}
      <Rect x={centerX - bodyW * 0.3} y={centerY - bodyH * 0.9} width={bodyW * 0.6} height={bodyH * 0.3} 
            fill={colors.accent} stroke={colors.dark} strokeWidth={2} rx={bodyW * 0.1} ry={bodyW * 0.1} />
      
      {/* 电量指示条 */}
      <Rect x={centerX - bodyW * 0.7} y={centerY - bodyH * 0.3} width={bodyW * 1.4} height={bodyH * 0.6} 
            fill={colors.accent} opacity={0.8} rx={bodyW * 0.1} ry={bodyW * 0.1} />
      
      {/* 电池内部细节 */}
      <Rect x={centerX - bodyW * 0.8} y={centerY - bodyH * 0.4} width={bodyW * 1.6} height={bodyH * 0.8} 
            fill="none" stroke={colors.dark} strokeWidth={2} rx={bodyW * 0.15} ry={bodyW * 0.15} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - bodyW * 0.4} cy={centerY} r={bodyW * 0.1} fill="#000" />
      <Circle cx={centerX + bodyW * 0.4} cy={centerY} r={bodyW * 0.1} fill="#000" />
      <Circle cx={centerX - bodyW * 0.4} cy={centerY} r={bodyW * 0.05} fill={colors.glow} />
      <Circle cx={centerX + bodyW * 0.4} cy={centerY} r={bodyW * 0.05} fill={colors.glow} />
      
      {/* 电光效果 */}
      <Path d={`M ${centerX} ${centerY - bodyH * 0.7} L ${centerX - bodyW * 0.2} ${centerY - bodyH * 0.9} L ${centerX} ${centerY - bodyH * 0.8} L ${centerX + bodyW * 0.2} ${centerY - bodyH * 0.9} Z`} 
            fill={colors.glow} opacity={0.7} />
    </g>
  );
};

// 泡泡鱼 - 精致的鱼类设计
const designPaoPaoYu = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const bodyW = size * 0.45;
  const bodyH = size * 0.3;
  
  return (
    <g>
      {/* 鱼身 */}
      <Ellipse cx={centerX} cy={centerY} rx={bodyW} ry={bodyH} fill={`url(#bodyGrad-paoPao)`} stroke={colors.dark} strokeWidth={3} />
      
      {/* 鱼头 */}
      <Ellipse cx={centerX - bodyW * 0.4} cy={centerY} rx={bodyW * 0.5} ry={bodyH * 0.9} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - bodyW * 0.5} cy={centerY - bodyH * 0.2} r={bodyH * 0.2} fill="#000" />
      <Circle cx={centerX - bodyW * 0.5} cy={centerY - bodyH * 0.2} r={bodyH * 0.1} fill="#fff" />
      <Circle cx={centerX - bodyW * 0.52} cy={centerY - bodyH * 0.22} r={bodyH * 0.05} fill="#000" />
      
      {/* 嘴巴 */}
      <Ellipse cx={centerX - bodyW * 0.7} cy={centerY} rx={bodyW * 0.1} ry={bodyH * 0.15} fill={colors.dark} />
      
      {/* 背鳍 */}
      <Polygon points={`${centerX - bodyW * 0.2},${centerY - bodyH * 0.6} ${centerX},${centerY - bodyH * 0.9} ${centerX + bodyW * 0.2},${centerY - bodyH * 0.6}`} 
               fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 侧鳍 */}
      <Polygon points={`${centerX - bodyW * 0.3},${centerY - bodyH * 0.3} ${centerX - bodyW * 0.5},${centerY - bodyH * 0.5} ${centerX - bodyW * 0.4},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
      <Polygon points={`${centerX - bodyW * 0.3},${centerY + bodyH * 0.3} ${centerX - bodyW * 0.5},${centerY + bodyH * 0.5} ${centerX - bodyW * 0.4},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
      
      {/* 尾巴 */}
      <Polygon points={`${centerX + bodyW * 0.7},${centerY} ${centerX + bodyW * 1.1},${centerY - bodyH * 0.4} ${centerX + bodyW * 1.1},${centerY + bodyH * 0.4}`} 
               fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 泡泡 */}
      <Circle cx={centerX + bodyW * 0.3} cy={centerY - bodyH * 0.6} r={bodyH * 0.15} fill={colors.accent} opacity={0.6} />
      <Circle cx={centerX + bodyW * 0.5} cy={centerY - bodyH * 0.8} r={bodyH * 0.12} fill={colors.accent} opacity={0.5} />
      <Circle cx={centerX + bodyW * 0.4} cy={centerY - bodyH * 0.9} r={bodyH * 0.1} fill={colors.accent} opacity={0.4} />
    </g>
  );
};

// 通用精致设计生成器 - 根据名字特征生成
const generatePremiumDesign = (name, type, colors, size) => {
  const nameLower = name.toLowerCase();
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 特殊名字的专门设计
  if (name.includes('时空') || name.includes('时间') || name.includes('空间')) {
    return designShiKongZhiShen(colors, size);
  }
  if (name.includes('大力') || name.includes('力量') || name.includes('神') && name.includes('力')) {
    return designDaLiShen(colors, size);
  }
  if (name.includes('超能电池') || (name.includes('电池') && name.includes('超能'))) {
    return designChaoNengDianChi(colors, size);
  }
  if (name.includes('泡泡鱼') || (name.includes('鱼') && name.includes('泡'))) {
    return designPaoPaoYu(colors, size);
  }
  
  // 根据名字特征生成通用但精致的造型
  const features = analyzeNameForDesign(name);
  return generateDesignByFeatures(features, colors, size, centerX, centerY);
};

// 名字特征分析
const analyzeNameForDesign = (name) => {
  const features = {
    bodyShape: 'round',
    hasWings: false,
    hasTail: false,
    hasHorns: false,
    hasFins: false,
    hasShell: false,
    hasSpikes: false,
    eyeCount: 2,
    eyeType: 'normal',
    hasFlame: false,
    hasIce: false,
    hasElectric: false,
    hasLeaves: false,
    size: 'medium'
  };
  
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (char === '鸟' || char === '鹰' || char === '凤' || char === '雕' || char === '雀') {
      features.bodyShape = 'oval';
      features.hasWings = true;
    } else if (char === '鱼' || char === '鲨' || char === '鲸' || char === '海') {
      features.bodyShape = 'oval';
      features.hasFins = true;
    } else if (char === '鹿' || char === '马' || char === '羊') {
      features.bodyShape = 'oval';
      features.hasHorns = true;
    } else if (char === '猫' || char === '狗' || char === '狼' || char === '狐' || char === '虎' || char === '狮') {
      features.bodyShape = 'oval';
      features.hasTail = true;
    } else if (char === '蟹' || char === '贝' || char === '龟') {
      features.bodyShape = 'round';
      features.hasShell = true;
    } else if (char === '火' || char === '炎' || char === '熔' || char === '焰') {
      features.hasFlame = true;
    } else if (char === '冰' || char === '雪' || char === '寒') {
      features.hasIce = true;
    } else if (char === '电' || char === '雷' || char === '闪') {
      features.hasElectric = true;
    } else if (char === '树' || char === '花' || char === '叶' || char === '草') {
      features.hasLeaves = true;
    } else if (char === '小' || char === '幼' || char === '迷') {
      features.size = 'small';
    } else if (char === '大' || char === '巨' || char === '王' || char === '主' || char === '神') {
      features.size = 'large';
    }
  }
  
  return features;
};

// 根据特征生成精致设计
const generateDesignByFeatures = (features, colors, size, centerX, centerY) => {
  const baseSize = size * (features.size === 'small' ? 0.25 : features.size === 'large' ? 0.4 : 0.35);
  const elements = [];
  
  // 主体
  if (features.bodyShape === 'round') {
    elements.push(
      <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
              fill={`url(#bodyGrad-${features.bodyShape})`} stroke={colors.dark} strokeWidth={3} />
    );
  } else {
    elements.push(
      <Ellipse key="body" cx={centerX} cy={centerY} rx={baseSize * 0.9} ry={baseSize} 
               fill={`url(#bodyGrad-${features.bodyShape})`} stroke={colors.dark} strokeWidth={3} />
    );
  }
  
  // 头部
  const headR = baseSize * 0.5;
  elements.push(
    <Circle key="head" cx={centerX} cy={centerY - baseSize * 0.6} r={headR} 
            fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
  );
  
  // 眼睛
  const eyeR = headR * 0.2;
  if (features.eyeCount === 2) {
    elements.push(
      <Circle key="eye1" cx={centerX - headR * 0.3} cy={centerY - baseSize * 0.65} r={eyeR} fill="#000" />,
      <Circle key="eye2" cx={centerX + headR * 0.3} cy={centerY - baseSize * 0.65} r={eyeR} fill="#000" />,
      <Circle key="eye1-white" cx={centerX - headR * 0.3} cy={centerY - baseSize * 0.65} r={eyeR * 0.5} fill="#fff" />,
      <Circle key="eye2-white" cx={centerX + headR * 0.3} cy={centerY - baseSize * 0.65} r={eyeR * 0.5} fill="#fff" />
    );
  }
  
  // 嘴巴
  elements.push(
    <Ellipse key="mouth" cx={centerX} cy={centerY - baseSize * 0.5} rx={headR * 0.2} ry={headR * 0.15} fill="#000" />
  );
  
  // 特殊特征
  if (features.hasWings) {
    elements.push(
      <Ellipse key="wing1" cx={centerX - baseSize * 0.8} cy={centerY} rx={baseSize * 0.4} ry={baseSize * 0.6} 
               fill={colors.secondary} opacity={0.7} transform={`rotate(-25 ${centerX - baseSize * 0.8} ${centerY})`} />,
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
      <Polygon key="horn1" points={`${centerX - headR * 0.4},${centerY - baseSize * 0.8} ${centerX - headR * 0.3},${centerY - baseSize * 1.0} ${centerX - headR * 0.2},${centerY - baseSize * 0.85}`} 
               fill={colors.accent} />,
      <Polygon key="horn2" points={`${centerX + headR * 0.4},${centerY - baseSize * 0.8} ${centerX + headR * 0.3},${centerY - baseSize * 1.0} ${centerX + headR * 0.2},${centerY - baseSize * 0.85}`} 
               fill={colors.accent} />
    );
  }
  
  if (features.hasFins) {
    elements.push(
      <Polygon key="fin1" points={`${centerX - baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX - baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX - baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />,
      <Polygon key="fin2" points={`${centerX + baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX + baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX + baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
    );
  }
  
  if (features.hasFlame) {
    elements.push(
      <Path key="flame1" d={`M ${centerX} ${centerY - baseSize * 0.7} L ${centerX - baseSize * 0.2} ${centerY - baseSize * 0.9} L ${centerX} ${centerY - baseSize * 0.8} L ${centerX + baseSize * 0.2} ${centerY - baseSize * 0.9} Z`} 
            fill="#FF6B6B" opacity={0.9} />,
      <Path key="flame2" d={`M ${centerX} ${centerY - baseSize * 0.75} L ${centerX - baseSize * 0.15} ${centerY - baseSize * 0.85} L ${centerX} ${centerY - baseSize * 0.8} L ${centerX + baseSize * 0.15} ${centerY - baseSize * 0.85} Z`} 
            fill="#FFD93D" opacity={0.8} />
    );
  }
  
  if (features.hasElectric) {
    elements.push(
      <Path key="electric" d={`M ${centerX} ${centerY - baseSize * 0.6} L ${centerX - baseSize * 0.1} ${centerY - baseSize * 0.2} L ${centerX + baseSize * 0.1} ${centerY - baseSize * 0.1} L ${centerX} ${centerY} L ${centerX - baseSize * 0.1} ${centerY + baseSize * 0.1} L ${centerX + baseSize * 0.1} ${centerY + baseSize * 0.2} L ${centerX} ${centerY + baseSize * 0.3}`} 
            fill="none" stroke={colors.glow} strokeWidth={4} opacity={0.9} />
    );
  }
  
  return elements;
};

// 主生成函数
export const generatePetModel = (pet, size = 120) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  
  // 减小默认尺寸，避免遮挡状态栏
  const finalSize = Math.min(size, 120);
  
  const design = generatePremiumDesign(name, type, colors, finalSize);
  
  return (
    <svg width={finalSize} height={finalSize} viewBox={`0 0 ${finalSize} ${finalSize}`} 
         style={{ overflow: 'visible' }}
         className="pet-svg-model">
      <defs>
        {/* 渐变定义 */}
        <linearGradient id={`bodyGrad-shiKong`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
        <linearGradient id={`bodyGrad-daLi`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <linearGradient id={`bodyGrad-chaoNeng`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <linearGradient id={`bodyGrad-paoPao`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <linearGradient id={`bodyGrad-round`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <linearGradient id={`bodyGrad-oval`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
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
      
      {/* 生成精致模型 */}
      <g filter={`url(#shadow-${pet.id})`}>
        {design}
      </g>
    </svg>
  );
};

export default generatePetModel;

