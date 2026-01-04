import React from 'react';

// =========================================
// 精灵模型生成器 - 根据名字智能生成SVG模型
// =========================================

// 类型颜色映射
const TYPE_COLORS = {
  FIRE: { primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD93D' },
  WATER: { primary: '#4ECDC4', secondary: '#6EDDD6', accent: '#A8E6CF' },
  GRASS: { primary: '#95E1D3', secondary: '#B8E6D8', accent: '#C8E6C9' },
  ELECTRIC: { primary: '#FFE66D', secondary: '#FFF89C', accent: '#FFD93D' },
  ICE: { primary: '#A8E6CF', secondary: '#C8F0E0', accent: '#E0F7FA' },
  FIGHT: { primary: '#FF8B94', secondary: '#FFA8B0', accent: '#FF6B6B' },
  POISON: { primary: '#C7CEEA', secondary: '#D8DFF0', accent: '#E0BBE4' },
  GROUND: { primary: '#D4A574', secondary: '#E0B890', accent: '#F4D03F' },
  FLYING: { primary: '#B8E6B8', secondary: '#D4F4D4', accent: '#E8F5E8' },
  PSYCHIC: { primary: '#FFB6C1', secondary: '#FFC8D3', accent: '#FFD6E0' },
  BUG: { primary: '#C8E6C9', secondary: '#D8F0D8', accent: '#E8F5E8' },
  ROCK: { primary: '#D3D3D3', secondary: '#E0E0E0', accent: '#F0F0F0' },
  GHOST: { primary: '#E0BBE4', secondary: '#E8D0EB', accent: '#F0E5F2' },
  DRAGON: { primary: '#FFD93D', secondary: '#FFE66D', accent: '#FFF89C' },
  STEEL: { primary: '#B8B8B8', secondary: '#D0D0D0', accent: '#E8E8E8' },
  FAIRY: { primary: '#FFB6D9', secondary: '#FFC8E5', accent: '#FFD6ED' },
  GOD: { primary: '#FFD700', secondary: '#FFE66D', accent: '#FFF89C' },
  NORMAL: { primary: '#F5F5F5', secondary: '#FAFAFA', accent: '#FFFFFF' }
};

// 基础形状组件
const Circle = ({ cx, cy, r, fill, stroke, strokeWidth = 0, opacity = 1 }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
);

const Ellipse = ({ cx, cy, rx, ry, fill, stroke, strokeWidth = 0, opacity = 1, transform = '' }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} transform={transform} />
);

const Rect = ({ x, y, width, height, fill, stroke, strokeWidth = 0, rx = 0, ry = 0, opacity = 1, transform = '' }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} strokeWidth={strokeWidth} rx={rx} ry={ry} opacity={opacity} transform={transform} />
);

const Polygon = ({ points, fill, stroke, strokeWidth = 0, opacity = 1 }) => (
  <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
);

const Path = ({ d, fill, stroke, strokeWidth = 0, opacity = 1 }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} />
);

// 眼睛组件
const Eye = ({ cx, cy, size = 8, color = '#000', type = 'normal' }) => {
  if (type === 'angry') {
    return (
      <g>
        <line x1={cx - size} y1={cy - size/2} x2={cx + size} y2={cy + size/2} stroke={color} strokeWidth={2} />
        <line x1={cx + size} y1={cy - size/2} x2={cx - size} y2={cy + size/2} stroke={color} strokeWidth={2} />
      </g>
    );
  }
  if (type === 'happy') {
    return (
      <g>
        <Ellipse cx={cx} cy={cy} rx={size} ry={size} fill={color} />
        <Ellipse cx={cx - size/3} cy={cy - size/3} rx={size/3} ry={size/3} fill="#fff" />
      </g>
    );
  }
  return (
    <g>
      <Circle cx={cx} cy={cy} r={size} fill={color} />
      <Circle cx={cx - size/3} cy={cy - size/3} r={size/3} fill="#fff" />
    </g>
  );
};

// 根据名字分析特征
const analyzePetName = (name, type) => {
  const features = {
    shape: 'round', // round, oval, square, triangle, long
    size: 'medium', // small, medium, large
    hasWings: false,
    hasTail: false,
    hasHorns: false,
    hasFins: false,
    hasShell: false,
    hasFlame: false,
    hasIce: false,
    hasElectric: false,
    eyeType: 'normal', // normal, angry, happy
    bodyParts: []
  };

  const nameLower = name.toLowerCase();
  
  // 形状判断
  if (name.includes('球') || name.includes('圆') || name.includes('珠')) {
    features.shape = 'round';
  } else if (name.includes('蛇') || name.includes('龙') || name.includes('虫')) {
    features.shape = 'long';
  } else if (name.includes('方') || name.includes('块') || name.includes('石')) {
    features.shape = 'square';
  } else if (name.includes('鸟') || name.includes('鹰') || name.includes('凤') || name.includes('雕')) {
    features.shape = 'oval';
    features.hasWings = true;
  } else if (name.includes('鱼') || name.includes('鲨') || name.includes('鲸') || name.includes('海')) {
    features.shape = 'oval';
    features.hasFins = true;
  } else if (name.includes('鹿') || name.includes('马') || name.includes('羊')) {
    features.shape = 'oval';
    features.hasHorns = true;
  } else if (name.includes('猫') || name.includes('狗') || name.includes('狼') || name.includes('狐')) {
    features.shape = 'oval';
    features.hasTail = true;
  } else if (name.includes('蟹') || name.includes('贝') || name.includes('龟')) {
    features.shape = 'round';
    features.hasShell = true;
  } else if (name.includes('树') || name.includes('花') || name.includes('叶')) {
    features.shape = 'oval';
  }

  // 属性特征
  if (name.includes('火') || name.includes('炎') || name.includes('熔') || name.includes('焰') || name.includes('燃')) {
    features.hasFlame = true;
  }
  if (name.includes('冰') || name.includes('雪') || name.includes('寒') || name.includes('冻')) {
    features.hasIce = true;
  }
  if (name.includes('电') || name.includes('雷') || name.includes('闪') || name.includes('磁')) {
    features.hasElectric = true;
  }

  // 眼睛类型
  if (name.includes('魔') || name.includes('恶') || name.includes('暗') || name.includes('鬼')) {
    features.eyeType = 'angry';
  } else if (name.includes('天') || name.includes('使') || name.includes('仙') || name.includes('神')) {
    features.eyeType = 'happy';
  }

  // 大小判断
  if (name.includes('小') || name.includes('幼') || name.includes('迷你')) {
    features.size = 'small';
  } else if (name.includes('大') || name.includes('巨') || name.includes('王') || name.includes('主') || name.includes('神')) {
    features.size = 'large';
  }

  return features;
};

// 生成身体形状
const generateBody = (features, colors, size) => {
  const { shape } = features;
  const baseSize = size * 0.4;
  
  if (shape === 'round') {
    return <Circle cx={size/2} cy={size/2} r={baseSize} fill={colors.primary} stroke={colors.accent} strokeWidth={2} />;
  } else if (shape === 'oval') {
    return <Ellipse cx={size/2} cy={size/2} rx={baseSize * 0.8} ry={baseSize} fill={colors.primary} stroke={colors.accent} strokeWidth={2} />;
  } else if (shape === 'square') {
    return <Rect x={size/2 - baseSize} y={size/2 - baseSize} width={baseSize * 2} height={baseSize * 2} fill={colors.primary} stroke={colors.accent} strokeWidth={2} rx={baseSize * 0.2} ry={baseSize * 0.2} />;
  } else if (shape === 'long') {
    return <Ellipse cx={size/2} cy={size/2} rx={baseSize * 1.2} ry={baseSize * 0.6} fill={colors.primary} stroke={colors.accent} strokeWidth={2} />;
  }
  return <Circle cx={size/2} cy={size/2} r={baseSize} fill={colors.primary} stroke={colors.accent} strokeWidth={2} />;
};

// 生成头部
const generateHead = (features, colors, size) => {
  const headSize = size * 0.25;
  const headY = size * 0.3;
  
  return <Circle cx={size/2} cy={headY} r={headSize} fill={colors.secondary} stroke={colors.accent} strokeWidth={2} />;
};

// 生成翅膀
const generateWings = (features, colors, size) => {
  if (!features.hasWings) return null;
  
  const wingSize = size * 0.15;
  const centerX = size/2;
  const centerY = size/2;
  return (
    <g>
      <Ellipse cx={centerX - size*0.25} cy={centerY} rx={wingSize} ry={wingSize * 1.5} fill={colors.secondary} opacity={0.7} transform={`rotate(-20 ${centerX - size*0.25} ${centerY})`} />
      <Ellipse cx={centerX + size*0.25} cy={centerY} rx={wingSize} ry={wingSize * 1.5} fill={colors.secondary} opacity={0.7} transform={`rotate(20 ${centerX + size*0.25} ${centerY})`} />
    </g>
  );
};

// 生成尾巴
const generateTail = (features, colors, size) => {
  if (!features.hasTail) return null;
  
  return (
    <Path 
      d={`M ${size/2 + size*0.2} ${size/2} Q ${size/2 + size*0.4} ${size/2 + size*0.1} ${size/2 + size*0.3} ${size/2 + size*0.2}`}
      fill={colors.secondary}
      stroke={colors.accent}
      strokeWidth={2}
    />
  );
};

// 生成角
const generateHorns = (features, colors, size) => {
  if (!features.hasHorns) return null;
  
  const hornY = size * 0.2;
  return (
    <g>
      <Polygon points={`${size/2 - size*0.15},${hornY} ${size/2 - size*0.05},${hornY - size*0.1} ${size/2 - size*0.1},${hornY}`} fill={colors.accent} />
      <Polygon points={`${size/2 + size*0.15},${hornY} ${size/2 + size*0.05},${hornY - size*0.1} ${size/2 + size*0.1},${hornY}`} fill={colors.accent} />
    </g>
  );
};

// 生成鳍
const generateFins = (features, colors, size) => {
  if (!features.hasFins) return null;
  
  return (
    <g>
      <Polygon points={`${size/2 - size*0.3},${size/2} ${size/2 - size*0.4},${size/2 - size*0.1} ${size/2 - size*0.35},${size/2 + size*0.1}`} fill={colors.secondary} opacity={0.8} />
      <Polygon points={`${size/2 + size*0.3},${size/2} ${size/2 + size*0.4},${size/2 - size*0.1} ${size/2 + size*0.35},${size/2 + size*0.1}`} fill={colors.secondary} opacity={0.8} />
    </g>
  );
};

// 生成壳
const generateShell = (features, colors, size) => {
  if (!features.hasShell) return null;
  
  const shellSize = size * 0.35;
  return (
    <g>
      <Circle cx={size/2} cy={size/2} r={shellSize} fill={colors.accent} stroke={colors.primary} strokeWidth={3} />
      <Circle cx={size/2} cy={size/2} r={shellSize * 0.7} fill={colors.secondary} />
      {/* 螺旋纹路 */}
      <Path d={`M ${size/2} ${size/2 - shellSize} A ${shellSize*0.3} ${shellSize*0.3} 0 1 1 ${size/2} ${size/2}`} fill="none" stroke={colors.primary} strokeWidth={2} />
    </g>
  );
};

// 生成火焰效果
const generateFlame = (features, colors, size) => {
  if (!features.hasFlame) return null;
  
  const flameY = size * 0.2;
  return (
    <g>
      <Path d={`M ${size/2} ${flameY} L ${size/2 - size*0.1} ${flameY - size*0.15} L ${size/2} ${flameY - size*0.1} L ${size/2 + size*0.1} ${flameY - size*0.15} Z`} fill="#FF6B6B" opacity={0.8} />
      <Path d={`M ${size/2} ${flameY - size*0.05} L ${size/2 - size*0.08} ${flameY - size*0.12} L ${size/2} ${flameY - size*0.08} L ${size/2 + size*0.08} ${flameY - size*0.12} Z`} fill="#FFD93D" opacity={0.9} />
    </g>
  );
};

// 生成冰晶效果
const generateIce = (features, colors, size) => {
  if (!features.hasIce) return null;
  
  return (
    <g>
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60) * Math.PI / 180;
        const x = size/2 + Math.cos(angle) * size * 0.25;
        const y = size/2 + Math.sin(angle) * size * 0.25;
        return (
          <Polygon 
            key={i}
            points={`${x},${y - size*0.05} ${x - size*0.02},${y + size*0.05} ${x + size*0.02},${y + size*0.05}`}
            fill="#A8E6CF"
            opacity={0.7}
          />
        );
      })}
    </g>
  );
};

// 生成电光效果
const generateElectric = (features, colors, size) => {
  if (!features.hasElectric) return null;
  
  return (
    <g>
      <Path d={`M ${size/2} ${size*0.2} L ${size/2 - size*0.05} ${size*0.35} L ${size/2 + size*0.05} ${size*0.4} L ${size/2} ${size*0.5} L ${size/2 - size*0.05} ${size*0.6} L ${size/2 + size*0.05} ${size*0.65} L ${size/2} ${size*0.8}`} 
            fill="none" stroke="#FFE66D" strokeWidth={3} opacity={0.8} />
    </g>
  );
};

// 主生成函数
export const generatePetModel = (pet, size = 200) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  const features = analyzePetName(name, type);
  
  // 根据大小调整
  if (features.size === 'small') size *= 0.8;
  if (features.size === 'large') size *= 1.2;
  
  const eyeSize = size * 0.08;
  const eyeY = size * 0.25;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <defs>
        {/* 闪光精灵渐变 */}
        {pet.isShiny && (
          <radialGradient id={`shiny-glow-${pet.id}`}>
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      
      {/* 背景光晕（闪光精灵） */}
      {pet.isShiny && (
        <Circle cx={size/2} cy={size/2} r={size*0.6} fill={`url(#shiny-glow-${pet.id})`} />
      )}
      
      {/* 身体 */}
      {generateBody(features, colors, size)}
      
      {/* 壳（如果有） */}
      {generateShell(features, colors, size)}
      
      {/* 头部 */}
      {generateHead(features, colors, size)}
      
      {/* 翅膀 */}
      {generateWings(features, colors, size)}
      
      {/* 尾巴 */}
      {generateTail(features, colors, size)}
      
      {/* 角 */}
      {generateHorns(features, colors, size)}
      
      {/* 鳍 */}
      {generateFins(features, colors, size)}
      
      {/* 眼睛 */}
      <Eye cx={size/2 - size*0.1} cy={eyeY} size={eyeSize} color="#000" type={features.eyeType} />
      <Eye cx={size/2 + size*0.1} cy={eyeY} size={eyeSize} color="#000" type={features.eyeType} />
      
      {/* 嘴巴 */}
      {features.eyeType === 'happy' ? (
        <Path d={`M ${size/2 - size*0.08} ${size*0.3} Q ${size/2} ${size*0.35} ${size/2 + size*0.08} ${size*0.3}`} 
              fill="none" stroke="#000" strokeWidth={2} />
      ) : features.eyeType === 'angry' ? (
        <Path d={`M ${size/2 - size*0.08} ${size*0.35} Q ${size/2} ${size*0.3} ${size/2 + size*0.08} ${size*0.35}`} 
              fill="none" stroke="#000" strokeWidth={2} />
      ) : (
        <Ellipse cx={size/2} cy={size*0.32} rx={size*0.05} ry={size*0.03} fill="#000" />
      )}
      
      {/* 属性特效 */}
      {generateFlame(features, colors, size)}
      {generateIce(features, colors, size)}
      {generateElectric(features, colors, size)}
    </svg>
  );
};

export default generatePetModel;

