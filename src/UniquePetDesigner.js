import React from 'react';

// =========================================
// 独特精灵设计师 - 为每个名字生成完全不同的造型
// =========================================

// 类型颜色映射
const TYPE_COLORS = {
  FIRE: { primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD93D', dark: '#CC5555', light: '#FFB8B8' },
  WATER: { primary: '#4ECDC4', secondary: '#6EDDD6', accent: '#A8E6CF', dark: '#3BA8A0', light: '#B8F0EB' },
  GRASS: { primary: '#95E1D3', secondary: '#B8E6D8', accent: '#C8E6C9', dark: '#7AB8A8', light: '#D4F4E8' },
  ELECTRIC: { primary: '#FFE66D', secondary: '#FFF89C', accent: '#FFD93D', dark: '#CCB855', light: '#FFF4B8' },
  ICE: { primary: '#A8E6CF', secondary: '#C8F0E0', accent: '#E0F7FA', dark: '#88C6AF', light: '#E8F8F4' },
  FIGHT: { primary: '#FF8B94', secondary: '#FFA8B0', accent: '#FF6B6B', dark: '#CC6F75', light: '#FFC8D0' },
  POISON: { primary: '#C7CEEA', secondary: '#D8DFF0', accent: '#E0BBE4', dark: '#9FA5BB', light: '#E8E8F8' },
  GROUND: { primary: '#D4A574', secondary: '#E0B890', accent: '#F4D03F', dark: '#AA8459', light: '#F0D4A8' },
  FLYING: { primary: '#B8E6B8', secondary: '#D4F4D4', accent: '#E8F5E8', dark: '#93B893', light: '#E8F8E8' },
  PSYCHIC: { primary: '#FFB6C1', secondary: '#FFC8D3', accent: '#FFD6E0', dark: '#CC9199', light: '#FFE8ED' },
  BUG: { primary: '#C8E6C9', secondary: '#D8F0D8', accent: '#E8F5E8', dark: '#A0B8A1', light: '#E8F8E8' },
  ROCK: { primary: '#D3D3D3', secondary: '#E0E0E0', accent: '#F0F0F0', dark: '#A8A8A8', light: '#F0F0F0' },
  GHOST: { primary: '#E0BBE4', secondary: '#E8D0EB', accent: '#F0E5F2', dark: '#B395B6', light: '#F0E8F4' },
  DRAGON: { primary: '#FFD93D', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD30', light: '#FFF4B8' },
  STEEL: { primary: '#B8B8B8', secondary: '#D0D0D0', accent: '#E8E8E8', dark: '#939393', light: '#E0E0E0' },
  FAIRY: { primary: '#FFB6D9', secondary: '#FFC8E5', accent: '#FFD6ED', dark: '#CC9199', light: '#FFE8F4' },
  GOD: { primary: '#FFD700', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD00', light: '#FFF4B8' },
  NORMAL: { primary: '#F5F5F5', secondary: '#FAFAFA', accent: '#FFFFFF', dark: '#C4C4C4', light: '#FFFFFF' }
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
// 名字特征分析器 - 深度分析每个字
// =========================================
const analyzeNameDeeply = (name) => {
  const features = {
    // 形状特征
    bodyShape: 'round', // round, oval, square, triangle, long, star, diamond, hexagon
    headShape: 'round', // round, oval, square, triangle
    size: 'medium', // tiny, small, medium, large, huge
    
    // 身体特征
    hasWings: false,
    hasTail: false,
    hasHorns: false,
    hasFins: false,
    hasShell: false,
    hasSpikes: false,
    hasFur: false,
    hasScales: false,
    hasFeathers: false,
    hasArmor: false,
    
    // 头部特征
    hasAntenna: false,
    hasBeak: false,
    hasTrunk: false,
    hasTusks: false,
    eyeCount: 2, // 1, 2, 3, 4, many
    eyeSize: 'normal', // tiny, small, normal, large, huge
    eyeType: 'normal', // normal, angry, happy, sleepy, glowing
    
    // 特殊特征
    hasFlame: false,
    hasIce: false,
    hasElectric: false,
    hasLeaves: false,
    hasFlowers: false,
    hasCrystals: false,
    hasGems: false,
    
    // 颜色特征
    colorPattern: 'solid', // solid, gradient, striped, spotted, multicolor
    
    // 姿态
    posture: 'standing', // standing, flying, swimming, crawling, floating
  };
  
  // 逐字分析
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    
    // 形状关键词
    if (char === '球' || char === '圆' || char === '珠') {
      features.bodyShape = 'round';
    } else if (char === '方' || char === '块' || char === '砖') {
      features.bodyShape = 'square';
    } else if (char === '角' || char === '尖') {
      features.bodyShape = 'triangle';
    } else if (char === '星' || char === '芒') {
      features.bodyShape = 'star';
    } else if (char === '菱' || char === '钻') {
      features.bodyShape = 'diamond';
    } else if (char === '六' || char === '蜂') {
      features.bodyShape = 'hexagon';
    } else if (char === '蛇' || char === '龙' || char === '虫' || char === '线') {
      features.bodyShape = 'long';
    } else if (char === '鸟' || char === '鹰' || char === '凤' || char === '雕' || char === '雀') {
      features.bodyShape = 'oval';
      features.hasWings = true;
      features.hasFeathers = true;
      features.posture = 'flying';
    } else if (char === '鱼' || char === '鲨' || char === '鲸' || char === '海' || char === '水') {
      features.bodyShape = 'oval';
      features.hasFins = true;
      features.posture = 'swimming';
    } else if (char === '鹿' || char === '马' || char === '羊' || char === '牛') {
      features.bodyShape = 'oval';
      features.hasHorns = true;
      features.hasFur = true;
    } else if (char === '猫' || char === '狗' || char === '狼' || char === '狐' || char === '虎' || char === '狮') {
      features.bodyShape = 'oval';
      features.hasTail = true;
      features.hasFur = true;
    } else if (char === '蟹' || char === '贝' || char === '龟' || char === '螺') {
      features.bodyShape = 'round';
      features.hasShell = true;
    } else if (char === '树' || char === '花' || char === '叶' || char === '草' || char === '藤') {
      features.bodyShape = 'oval';
      features.hasLeaves = true;
      if (char === '花') features.hasFlowers = true;
    } else if (char === '石' || char === '岩' || char === '山') {
      features.bodyShape = 'triangle';
      features.hasArmor = true;
    } else if (char === '钢' || char === '铁' || char === '机' || char === '械') {
      features.bodyShape = 'square';
      features.hasArmor = true;
    } else if (char === '电' || char === '雷' || char === '闪' || char === '磁') {
      features.hasElectric = true;
    } else if (char === '火' || char === '炎' || char === '熔' || char === '焰' || char === '燃') {
      features.hasFlame = true;
    } else if (char === '冰' || char === '雪' || char === '寒' || char === '冻') {
      features.hasIce = true;
    } else if (char === '晶' || char === '钻' || char === '宝') {
      features.hasCrystals = true;
      features.hasGems = true;
    } else if (char === '小' || char === '幼' || char === '迷') {
      features.size = 'small';
    } else if (char === '大' || char === '巨' || char === '王' || char === '主' || char === '神' || char === '皇') {
      features.size = 'large';
      if (char === '神' || char === '皇') features.size = 'huge';
    } else if (char === '魔' || char === '恶' || char === '暗' || char === '鬼' || char === '幽') {
      features.eyeType = 'glowing';
      features.colorPattern = 'gradient';
    } else if (char === '天' || char === '使' || char === '仙' || char === '圣') {
      features.eyeType = 'happy';
      features.hasWings = true;
    } else if (char === '虫' || char === '蝶' || char === '蜂') {
      features.hasAntenna = true;
      features.hasWings = true;
    } else if (char === '象' || char === '鼻') {
      features.hasTrunk = true;
    } else if (char === '犀' || char === '角') {
      features.hasTusks = true;
    } else if (char === '刺' || char === '针' || char === '棘') {
      features.hasSpikes = true;
    } else if (char === '鳞' || char === '龙') {
      features.hasScales = true;
    }
  }
  
  return features;
};

// =========================================
// 独特造型生成器
// =========================================
const generateUniqueDesign = (name, type, colors, size) => {
  const features = analyzeNameDeeply(name);
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 根据大小调整
  let scale = 1;
  if (features.size === 'tiny') scale = 0.6;
  else if (features.size === 'small') scale = 0.8;
  else if (features.size === 'large') scale = 1.3;
  else if (features.size === 'huge') scale = 1.6;
  
  const baseSize = size * 0.35 * scale;
  
  // 生成身体
  const bodyElements = [];
  
  // 主体形状
  if (features.bodyShape === 'round') {
    bodyElements.push(
      <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
              fill={features.colorPattern === 'gradient' ? `url(#bodyGrad-${name})` : colors.primary} 
              stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'oval') {
    bodyElements.push(
      <Ellipse key="body" cx={centerX} cy={centerY} rx={baseSize * 0.9} ry={baseSize} 
               fill={features.colorPattern === 'gradient' ? `url(#bodyGrad-${name})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'square') {
    bodyElements.push(
      <Rect key="body" x={centerX - baseSize} y={centerY - baseSize} width={baseSize * 2} height={baseSize * 2} 
            fill={features.colorPattern === 'gradient' ? `url(#bodyGrad-${name})` : colors.primary} 
            stroke={colors.dark} strokeWidth={3} rx={baseSize * 0.2} ry={baseSize * 0.2} />
    );
  } else if (features.bodyShape === 'triangle') {
    bodyElements.push(
      <Polygon key="body" points={`${centerX},${centerY - baseSize * 1.2} ${centerX - baseSize},${centerY + baseSize * 0.6} ${centerX + baseSize},${centerY + baseSize * 0.6}`} 
               fill={features.colorPattern === 'gradient' ? `url(#bodyGrad-${name})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'star') {
    const starPoints = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const r = i % 2 === 0 ? baseSize : baseSize * 0.5;
      starPoints.push(`${centerX + Math.cos(angle) * r},${centerY + Math.sin(angle) * r}`);
    }
    bodyElements.push(
      <Polygon key="body" points={starPoints.join(' ')} 
               fill={features.colorPattern === 'gradient' ? `url(#bodyGrad-${name})` : colors.primary} 
               stroke={colors.dark} strokeWidth={3} />
    );
  } else if (features.bodyShape === 'long') {
    const segments = name.includes('龙') ? 7 : 5;
    for (let i = 0; i < segments; i++) {
      const offsetX = (i - segments/2) * baseSize * 0.4;
      bodyElements.push(
        <Ellipse key={`segment-${i}`} cx={centerX + offsetX} cy={centerY} 
                 rx={baseSize * 0.3} ry={baseSize * 0.5} 
                 fill={i === 0 ? colors.secondary : colors.primary} 
                 stroke={colors.dark} strokeWidth={2} />
      );
    }
  } else {
    // 默认圆形
    bodyElements.push(
      <Circle key="body" cx={centerX} cy={centerY} r={baseSize} 
              fill={colors.primary} stroke={colors.dark} strokeWidth={3} />
    );
  }
  
  // 头部
  const headSize = baseSize * 0.6;
  const headY = centerY - baseSize * 0.6;
  
  if (features.headShape === 'round') {
    bodyElements.push(
      <Circle key="head" cx={centerX} cy={headY} r={headSize} 
              fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  } else if (features.headShape === 'oval') {
    bodyElements.push(
      <Ellipse key="head" cx={centerX} cy={headY} rx={headSize * 0.8} ry={headSize} 
               fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  } else if (features.headShape === 'square') {
    bodyElements.push(
      <Rect key="head" x={centerX - headSize} y={headY - headSize} width={headSize * 2} height={headSize * 2} 
            fill={colors.secondary} stroke={colors.dark} strokeWidth={2} rx={headSize * 0.2} ry={headSize * 0.2} />
    );
  } else {
    bodyElements.push(
      <Circle key="head" cx={centerX} cy={headY} r={headSize} 
              fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  }
  
  // 眼睛
  const eyeSize = baseSize * (features.eyeSize === 'tiny' ? 0.06 : 
                              features.eyeSize === 'small' ? 0.08 : 
                              features.eyeSize === 'large' ? 0.12 : 
                              features.eyeSize === 'huge' ? 0.15 : 0.1);
  const eyeY = headY - headSize * 0.2;
  
  if (features.eyeCount === 1) {
    bodyElements.push(
      <Circle key="eye" cx={centerX} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.accent : '#000'} 
              stroke={features.eyeType === 'glowing' ? colors.accent : 'none'} strokeWidth={features.eyeType === 'glowing' ? 2 : 0} />
    );
  } else if (features.eyeCount === 3) {
    bodyElements.push(
      <Circle key="eye1" cx={centerX - headSize * 0.3} cy={eyeY} r={eyeSize} fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
    );
    bodyElements.push(
      <Circle key="eye2" cx={centerX} cy={eyeY - headSize * 0.2} r={eyeSize} fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
    );
    bodyElements.push(
      <Circle key="eye3" cx={centerX + headSize * 0.3} cy={eyeY} r={eyeSize} fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
    );
  } else if (features.eyeCount === 4) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const eyeX = centerX + Math.cos(angle) * headSize * 0.25;
      const eyeYPos = eyeY + Math.sin(angle) * headSize * 0.25;
      bodyElements.push(
        <Circle key={`eye${i}`} cx={eyeX} cy={eyeYPos} r={eyeSize} 
                fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
      );
    }
  } else {
    // 默认两只眼睛
    bodyElements.push(
      <Circle key="eye1" cx={centerX - headSize * 0.3} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
    );
    bodyElements.push(
      <Circle key="eye2" cx={centerX + headSize * 0.3} cy={eyeY} r={eyeSize} 
              fill={features.eyeType === 'glowing' ? colors.accent : '#000'} />
    );
    if (features.eyeType !== 'glowing') {
      bodyElements.push(
        <Circle key="eye1-white" cx={centerX - headSize * 0.3} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
      );
      bodyElements.push(
        <Circle key="eye2-white" cx={centerX + headSize * 0.3} cy={eyeY} r={eyeSize * 0.4} fill="#fff" />
      );
    }
  }
  
  // 嘴巴
  if (features.eyeType === 'happy') {
    bodyElements.push(
      <Path key="mouth" d={`M ${centerX - headSize * 0.3} ${headY + headSize * 0.2} Q ${centerX} ${headY + headSize * 0.4} ${centerX + headSize * 0.3} ${headY + headSize * 0.2}`} 
            fill="none" stroke="#000" strokeWidth={2} />
    );
  } else if (features.eyeType === 'angry') {
    bodyElements.push(
      <Path key="mouth" d={`M ${centerX - headSize * 0.3} ${headY + headSize * 0.3} Q ${centerX} ${headY + headSize * 0.2} ${centerX + headSize * 0.3} ${headY + headSize * 0.3}`} 
            fill="none" stroke="#000" strokeWidth={2} />
    );
  } else {
    bodyElements.push(
      <Ellipse key="mouth" cx={centerX} cy={headY + headSize * 0.25} rx={headSize * 0.15} ry={headSize * 0.1} fill="#000" />
    );
  }
  
  // 特殊特征
  if (features.hasWings) {
    bodyElements.push(
      <Ellipse key="wing1" cx={centerX - baseSize * 0.8} cy={centerY} rx={baseSize * 0.4} ry={baseSize * 0.6} 
               fill={colors.secondary} opacity={0.7} transform={`rotate(-25 ${centerX - baseSize * 0.8} ${centerY})`} />
    );
    bodyElements.push(
      <Ellipse key="wing2" cx={centerX + baseSize * 0.8} cy={centerY} rx={baseSize * 0.4} ry={baseSize * 0.6} 
               fill={colors.secondary} opacity={0.7} transform={`rotate(25 ${centerX + baseSize * 0.8} ${centerY})`} />
    );
  }
  
  if (features.hasTail) {
    const tailLength = baseSize * 1.2;
    bodyElements.push(
      <Path key="tail" d={`M ${centerX + baseSize * 0.6} ${centerY} Q ${centerX + tailLength} ${centerY - baseSize * 0.3} ${centerX + tailLength * 0.8} ${centerY + baseSize * 0.2}`} 
            fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
    );
  }
  
  if (features.hasHorns) {
    bodyElements.push(
      <Polygon key="horn1" points={`${centerX - headSize * 0.4},${headY - headSize * 0.6} ${centerX - headSize * 0.3},${headY - headSize * 0.9} ${centerX - headSize * 0.2},${headY - headSize * 0.7}`} 
               fill={colors.accent} />
    );
    bodyElements.push(
      <Polygon key="horn2" points={`${centerX + headSize * 0.4},${headY - headSize * 0.6} ${centerX + headSize * 0.3},${headY - headSize * 0.9} ${centerX + headSize * 0.2},${headY - headSize * 0.7}`} 
               fill={colors.accent} />
    );
  }
  
  if (features.hasFins) {
    bodyElements.push(
      <Polygon key="fin1" points={`${centerX - baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX - baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX - baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
    );
    bodyElements.push(
      <Polygon key="fin2" points={`${centerX + baseSize * 0.7},${centerY - baseSize * 0.3} ${centerX + baseSize * 0.9},${centerY - baseSize * 0.6} ${centerX + baseSize * 0.8},${centerY}`} 
               fill={colors.secondary} opacity={0.8} />
    );
  }
  
  if (features.hasShell) {
    bodyElements.push(
      <Circle key="shell" cx={centerX} cy={centerY} r={baseSize * 1.1} 
              fill={colors.accent} stroke={colors.dark} strokeWidth={4} />
    );
    bodyElements.push(
      <Path key="shell-spiral" d={`M ${centerX} ${centerY - baseSize} A ${baseSize * 0.3} ${baseSize * 0.3} 0 1 1 ${centerX} ${centerY}`} 
            fill="none" stroke={colors.dark} strokeWidth={3} />
    );
  }
  
  if (features.hasSpikes) {
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spikeX = centerX + Math.cos(angle) * baseSize * 1.1;
      const spikeY = centerY + Math.sin(angle) * baseSize * 1.1;
      bodyElements.push(
        <Polygon key={`spike-${i}`} 
                 points={`${spikeX},${spikeY} ${spikeX + Math.cos(angle) * baseSize * 0.2},${spikeY + Math.sin(angle) * baseSize * 0.2 - baseSize * 0.15} ${spikeX - Math.cos(angle) * baseSize * 0.2},${spikeY - Math.sin(angle) * baseSize * 0.2 - baseSize * 0.15}`} 
                 fill={colors.accent} />
      );
    }
  }
  
  if (features.hasAntenna) {
    bodyElements.push(
      <Path key="antenna1" d={`M ${centerX - headSize * 0.2} ${headY - headSize * 0.8} L ${centerX - headSize * 0.3} ${headY - headSize * 1.2}`} 
            fill="none" stroke={colors.dark} strokeWidth={2} />
    );
    bodyElements.push(
      <Circle key="antenna-ball1" cx={centerX - headSize * 0.3} cy={headY - headSize * 1.2} r={headSize * 0.1} fill={colors.accent} />
    );
    bodyElements.push(
      <Path key="antenna2" d={`M ${centerX + headSize * 0.2} ${headY - headSize * 0.8} L ${centerX + headSize * 0.3} ${headY - headSize * 1.2}`} 
            fill="none" stroke={colors.dark} strokeWidth={2} />
    );
    bodyElements.push(
      <Circle key="antenna-ball2" cx={centerX + headSize * 0.3} cy={headY - headSize * 1.2} r={headSize * 0.1} fill={colors.accent} />
    );
  }
  
  if (features.hasLeaves) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const leafX = centerX + Math.cos(angle) * baseSize * 0.8;
      const leafY = centerY + Math.sin(angle) * baseSize * 0.8;
      bodyElements.push(
        <Ellipse key={`leaf-${i}`} cx={leafX} cy={leafY} rx={baseSize * 0.2} ry={baseSize * 0.3} 
                 fill={colors.accent} transform={`rotate(${angle * 180 / Math.PI} ${leafX} ${leafY})`} />
      );
    }
  }
  
  if (features.hasFlowers) {
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const flowerX = centerX + Math.cos(angle) * baseSize * 0.6;
      const flowerY = centerY + Math.sin(angle) * baseSize * 0.6;
      bodyElements.push(
        <Circle key={`flower-${i}`} cx={flowerX} cy={flowerY} r={baseSize * 0.15} fill={colors.accent} />
      );
      for (let j = 0; j < 5; j++) {
        const petalAngle = (j * Math.PI * 2) / 5;
        const petalX = flowerX + Math.cos(petalAngle) * baseSize * 0.2;
        const petalY = flowerY + Math.sin(petalAngle) * baseSize * 0.2;
        bodyElements.push(
          <Ellipse key={`petal-${i}-${j}`} cx={petalX} cy={petalY} rx={baseSize * 0.08} ry={baseSize * 0.12} 
                   fill={colors.light} transform={`rotate(${petalAngle * 180 / Math.PI} ${petalX} ${petalY})`} />
        );
      }
    }
  }
  
  if (features.hasFlame) {
    bodyElements.push(
      <Path key="flame1" d={`M ${centerX} ${headY - headSize * 0.5} L ${centerX - baseSize * 0.2} ${headY - headSize * 0.8} L ${centerX} ${headY - headSize * 0.6} L ${centerX + baseSize * 0.2} ${headY - headSize * 0.8} Z`} 
            fill="#FF6B6B" opacity={0.9} />
    );
    bodyElements.push(
      <Path key="flame2" d={`M ${centerX} ${headY - headSize * 0.6} L ${centerX - baseSize * 0.15} ${headY - headSize * 0.75} L ${centerX} ${headY - headSize * 0.65} L ${centerX + baseSize * 0.15} ${headY - headSize * 0.75} Z`} 
            fill="#FFD93D" opacity={0.8} />
    );
  }
  
  if (features.hasIce) {
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const iceX = centerX + Math.cos(angle) * baseSize * 0.7;
      const iceY = centerY + Math.sin(angle) * baseSize * 0.7;
      bodyElements.push(
        <Polygon key={`ice-${i}`} 
                 points={`${iceX},${iceY - baseSize * 0.1} ${iceX - baseSize * 0.05},${iceY + baseSize * 0.1} ${iceX + baseSize * 0.05},${iceY + baseSize * 0.1}`} 
                 fill="#A8E6CF" opacity={0.8} />
      );
    }
  }
  
  if (features.hasElectric) {
    bodyElements.push(
      <Path key="electric" d={`M ${centerX} ${headY - headSize * 0.4} L ${centerX - baseSize * 0.1} ${centerY - baseSize * 0.2} L ${centerX + baseSize * 0.1} ${centerY - baseSize * 0.1} L ${centerX} ${centerY} L ${centerX - baseSize * 0.1} ${centerY + baseSize * 0.1} L ${centerX + baseSize * 0.1} ${centerY + baseSize * 0.2} L ${centerX} ${centerY + baseSize * 0.3}`} 
            fill="none" stroke="#FFE66D" strokeWidth={4} opacity={0.9} />
    );
  }
  
  if (features.hasCrystals) {
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const crystalX = centerX + Math.cos(angle) * baseSize * 0.5;
      const crystalY = centerY + Math.sin(angle) * baseSize * 0.5;
      bodyElements.push(
        <Polygon key={`crystal-${i}`} 
                 points={`${crystalX},${crystalY - baseSize * 0.15} ${crystalX - baseSize * 0.08},${crystalY} ${crystalX},${crystalY + baseSize * 0.15} ${crystalX + baseSize * 0.08},${crystalY}`} 
                 fill={colors.accent} opacity={0.7} />
      );
    }
  }
  
  return bodyElements;
};

// 主生成函数
export const generatePetModel = (pet, size = 200) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  
  // 根据名字计算唯一的大小调整
  let nameHash = 0;
  for (let i = 0; i < name.length; i++) {
    nameHash = ((nameHash << 5) - nameHash) + name.charCodeAt(i);
    nameHash = nameHash & nameHash;
  }
  const sizeVariation = 0.9 + (Math.abs(nameHash) % 20) / 100; // 0.9-1.1倍变化
  const finalSize = size * sizeVariation;
  
  const elements = generateUniqueDesign(name, type, colors, finalSize);
  
  return (
    <svg width={finalSize} height={finalSize} viewBox={`0 0 ${finalSize} ${finalSize}`} 
         style={{ overflow: 'visible' }}
         className="pet-svg-model">
      <defs>
        {/* 渐变定义 */}
        <linearGradient id={`bodyGrad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
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
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      
      {/* 背景光晕（闪光精灵） */}
      {pet.isShiny && (
        <Circle cx={finalSize/2} cy={finalSize/2} r={finalSize*0.6} fill={`url(#shiny-glow-${pet.id})`} />
      )}
      
      {/* 生成独特模型 */}
      <g filter={`url(#shadow-${pet.id})`}>
        {elements}
      </g>
    </svg>
  );
};

export default generatePetModel;

