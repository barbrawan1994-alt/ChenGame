import React from 'react';

// =========================================
// 高级精灵模型生成器 - AI驱动的独特造型系统
// =========================================

// 类型颜色映射（更丰富的配色）
const TYPE_COLORS = {
  FIRE: { primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD93D', dark: '#CC5555' },
  WATER: { primary: '#4ECDC4', secondary: '#6EDDD6', accent: '#A8E6CF', dark: '#3BA8A0' },
  GRASS: { primary: '#95E1D3', secondary: '#B8E6D8', accent: '#C8E6C9', dark: '#7AB8A8' },
  ELECTRIC: { primary: '#FFE66D', secondary: '#FFF89C', accent: '#FFD93D', dark: '#CCB855' },
  ICE: { primary: '#A8E6CF', secondary: '#C8F0E0', accent: '#E0F7FA', dark: '#88C6AF' },
  FIGHT: { primary: '#FF8B94', secondary: '#FFA8B0', accent: '#FF6B6B', dark: '#CC6F75' },
  POISON: { primary: '#C7CEEA', secondary: '#D8DFF0', accent: '#E0BBE4', dark: '#9FA5BB' },
  GROUND: { primary: '#D4A574', secondary: '#E0B890', accent: '#F4D03F', dark: '#AA8459' },
  FLYING: { primary: '#B8E6B8', secondary: '#D4F4D4', accent: '#E8F5E8', dark: '#93B893' },
  PSYCHIC: { primary: '#FFB6C1', secondary: '#FFC8D3', accent: '#FFD6E0', dark: '#CC9199' },
  BUG: { primary: '#C8E6C9', secondary: '#D8F0D8', accent: '#E8F5E8', dark: '#A0B8A1' },
  ROCK: { primary: '#D3D3D3', secondary: '#E0E0E0', accent: '#F0F0F0', dark: '#A8A8A8' },
  GHOST: { primary: '#E0BBE4', secondary: '#E8D0EB', accent: '#F0E5F2', dark: '#B395B6' },
  DRAGON: { primary: '#FFD93D', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD30' },
  STEEL: { primary: '#B8B8B8', secondary: '#D0D0D0', accent: '#E8E8E8', dark: '#939393' },
  FAIRY: { primary: '#FFB6D9', secondary: '#FFC8E5', accent: '#FFD6ED', dark: '#CC9199' },
  GOD: { primary: '#FFD700', secondary: '#FFE66D', accent: '#FFF89C', dark: '#CCAD00' },
  NORMAL: { primary: '#F5F5F5', secondary: '#FAFAFA', accent: '#FFFFFF', dark: '#C4C4C4' }
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
// 独特造型生成器 - 为每个名字创建专门的设计
// =========================================

// 超能电池 - 圆形电池造型
const generateSuperBattery = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const bodyR = size * 0.35;
  
  return (
    <g>
      {/* 主体 - 圆形电池 */}
      <Circle cx={centerX} cy={centerY} r={bodyR} fill={colors.primary} stroke={colors.dark} strokeWidth={3} />
      <Circle cx={centerX} cy={centerY} r={bodyR * 0.7} fill={colors.secondary} />
      
      {/* 正极 */}
      <Rect x={centerX - bodyR * 0.3} y={centerY - bodyR * 1.1} width={bodyR * 0.6} height={bodyR * 0.2} 
            fill={colors.accent} rx={bodyR * 0.1} ry={bodyR * 0.1} />
      
      {/* 电量指示 */}
      <Rect x={centerX - bodyR * 0.5} y={centerY - bodyR * 0.3} width={bodyR} height={bodyR * 0.6} 
            fill={colors.accent} rx={bodyR * 0.1} ry={bodyR * 0.1} opacity={0.8} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - bodyR * 0.2} cy={centerY - bodyR * 0.1} r={bodyR * 0.08} fill="#000" />
      <Circle cx={centerX + bodyR * 0.2} cy={centerY - bodyR * 0.1} r={bodyR * 0.08} fill="#000" />
      
      {/* 电光效果 */}
      <Path d={`M ${centerX} ${centerY - bodyR * 0.5} L ${centerX - bodyR * 0.15} ${centerY - bodyR * 0.7} L ${centerX} ${centerY - bodyR * 0.6} L ${centerX + bodyR * 0.15} ${centerY - bodyR * 0.7} Z`} 
            fill={colors.accent} opacity={0.6} />
    </g>
  );
};

// 泡泡鱼 - 椭圆形鱼造型
const generateBubbleFish = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const bodyW = size * 0.5;
  const bodyH = size * 0.35;
  
  return (
    <g>
      {/* 鱼身 */}
      <Ellipse cx={centerX} cy={centerY} rx={bodyW} ry={bodyH} fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 鱼头 */}
      <Ellipse cx={centerX - bodyW * 0.3} cy={centerY} rx={bodyW * 0.4} ry={bodyH * 0.8} fill={colors.secondary} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - bodyW * 0.4} cy={centerY - bodyH * 0.2} r={bodyH * 0.15} fill="#000" />
      <Circle cx={centerX - bodyW * 0.4} cy={centerY - bodyH * 0.2} r={bodyH * 0.08} fill="#fff" />
      
      {/* 鱼鳍 */}
      <Polygon points={`${centerX - bodyW * 0.2},${centerY - bodyH * 0.5} ${centerX - bodyW * 0.4},${centerY - bodyH * 0.8} ${centerX},${centerY - bodyH * 0.6}`} 
               fill={colors.secondary} opacity={0.8} />
      <Polygon points={`${centerX - bodyW * 0.2},${centerY + bodyH * 0.5} ${centerX - bodyW * 0.4},${centerY + bodyH * 0.8} ${centerX},${centerY + bodyH * 0.6}`} 
               fill={colors.secondary} opacity={0.8} />
      
      {/* 尾巴 */}
      <Polygon points={`${centerX + bodyW * 0.7},${centerY} ${centerX + bodyW * 1.1},${centerY - bodyH * 0.4} ${centerX + bodyW * 1.1},${centerY + bodyH * 0.4}`} 
               fill={colors.secondary} />
      
      {/* 泡泡 */}
      <Circle cx={centerX + bodyW * 0.3} cy={centerY - bodyH * 0.6} r={bodyH * 0.12} fill={colors.accent} opacity={0.6} />
      <Circle cx={centerX + bodyW * 0.5} cy={centerY - bodyH * 0.8} r={bodyH * 0.1} fill={colors.accent} opacity={0.5} />
    </g>
  );
};

// 火绒狐 - 狐狸造型
const generateFireFox = (colors, size) => {
  const centerX = size / 2;
  const centerY = size / 2;
  
  return (
    <g>
      {/* 身体 */}
      <Ellipse cx={centerX} cy={centerY + size * 0.1} rx={size * 0.25} ry={size * 0.2} fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 头部 */}
      <Circle cx={centerX - size * 0.15} cy={centerY - size * 0.1} r={size * 0.2} fill={colors.secondary} stroke={colors.dark} strokeWidth={2} />
      
      {/* 耳朵 */}
      <Polygon points={`${centerX - size * 0.25},${centerY - size * 0.25} ${centerX - size * 0.35},${centerY - size * 0.4} ${centerX - size * 0.2},${centerY - size * 0.3}`} 
               fill={colors.primary} />
      <Polygon points={`${centerX - size * 0.05},${centerY - size * 0.25} ${centerX + size * 0.05},${centerY - size * 0.4} ${centerX - size * 0.02},${centerY - size * 0.3}`} 
               fill={colors.primary} />
      
      {/* 眼睛 */}
      <Circle cx={centerX - size * 0.2} cy={centerY - size * 0.12} r={size * 0.05} fill="#000" />
      <Circle cx={centerX - size * 0.1} cy={centerY - size * 0.12} r={size * 0.05} fill="#000" />
      
      {/* 鼻子 */}
      <Polygon points={`${centerX - size * 0.15},${centerY - size * 0.05} ${centerX - size * 0.12},${centerY} ${centerX - size * 0.18},${centerY}`} 
               fill="#000" />
      
      {/* 尾巴 */}
      <Ellipse cx={centerX + size * 0.3} cy={centerY} rx={size * 0.15} ry={size * 0.25} fill={colors.primary} transform={`rotate(30 ${centerX + size * 0.3} ${centerY})`} />
      
      {/* 火焰效果 */}
      <Path d={`M ${centerX + size * 0.35} ${centerY - size * 0.1} L ${centerX + size * 0.4} ${centerY - size * 0.2} L ${centerX + size * 0.38} ${centerY - size * 0.15} L ${centerX + size * 0.42} ${centerY - size * 0.25} L ${centerX + size * 0.4} ${centerY - size * 0.2} Z`} 
            fill="#FF6B6B" opacity={0.8} />
    </g>
  );
};

// 通用生成器 - 根据名字关键词智能生成
const generateUniqueModel = (name, type, colors, size) => {
  const nameLower = name.toLowerCase();
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 特殊名字的专门设计
  if (name.includes('超能电池') || name.includes('电池')) {
    return generateSuperBattery(colors, size);
  }
  if (name.includes('泡泡鱼') || (name.includes('鱼') && name.includes('泡'))) {
    return generateBubbleFish(colors, size);
  }
  if (name.includes('火绒狐') || (name.includes('狐') && name.includes('火'))) {
    return generateFireFox(colors, size);
  }
  
  // 根据关键词生成通用但独特的造型
  let design = null;
  
  if (name.includes('龙') || name.includes('蛇')) {
    // 龙/蛇类 - 长条形身体
    const segments = 5;
    return (
      <g>
        {[...Array(segments)].map((_, i) => (
          <Ellipse key={i} cx={centerX - size * 0.2 + (i * size * 0.1)} cy={centerY} 
                   rx={size * 0.12} ry={size * 0.15} 
                   fill={i === 0 ? colors.secondary : colors.primary} 
                   stroke={colors.dark} strokeWidth={2} />
        ))}
        <Circle cx={centerX - size * 0.25} cy={centerY} r={size * 0.15} fill={colors.secondary} />
        <Circle cx={centerX - size * 0.3} cy={centerY - size * 0.05} r={size * 0.06} fill="#000" />
        <Circle cx={centerX - size * 0.3} cy={centerY + size * 0.05} r={size * 0.06} fill="#000" />
        {name.includes('龙') && (
          <Polygon points={`${centerX - size * 0.35},${centerY - size * 0.1} ${centerX - size * 0.4},${centerY - size * 0.2} ${centerX - size * 0.3},${centerY - size * 0.15}`} 
                   fill={colors.accent} />
        )}
      </g>
    );
  }
  
  if (name.includes('鸟') || name.includes('鹰') || name.includes('凤')) {
    // 鸟类 - 带翅膀
    return (
      <g>
        <Ellipse cx={centerX} cy={centerY} rx={size * 0.25} ry={size * 0.2} fill={colors.primary} stroke={colors.dark} strokeWidth={2} />
        <Circle cx={centerX - size * 0.15} cy={centerY - size * 0.15} r={size * 0.12} fill={colors.secondary} />
        <Polygon points={`${centerX - size * 0.15},${centerY - size * 0.25} ${centerX - size * 0.2},${centerY - size * 0.3} ${centerX - size * 0.1},${centerY - size * 0.28}`} 
                 fill={colors.accent} />
        <Ellipse cx={centerX - size * 0.3} cy={centerY} rx={size * 0.2} ry={size * 0.15} 
                 fill={colors.secondary} opacity={0.7} transform={`rotate(-30 ${centerX - size * 0.3} ${centerY})`} />
        <Ellipse cx={centerX + size * 0.3} cy={centerY} rx={size * 0.2} ry={size * 0.15} 
                 fill={colors.secondary} opacity={0.7} transform={`rotate(30 ${centerX + size * 0.3} ${centerY})`} />
        <Circle cx={centerX - size * 0.18} cy={centerY - size * 0.15} r={size * 0.04} fill="#000" />
      </g>
    );
  }
  
  if (name.includes('树') || name.includes('花') || name.includes('叶')) {
    // 植物类
    return (
      <g>
        <Rect x={centerX - size * 0.05} y={centerY + size * 0.1} width={size * 0.1} height={size * 0.3} 
              fill={colors.dark} rx={size * 0.02} />
        <Circle cx={centerX} cy={centerY} r={size * 0.25} fill={colors.primary} />
        <Circle cx={centerX - size * 0.15} cy={centerY - size * 0.1} r={size * 0.15} fill={colors.secondary} />
        <Circle cx={centerX + size * 0.15} cy={centerY - size * 0.1} r={size * 0.15} fill={colors.secondary} />
        <Circle cx={centerX} cy={centerY - size * 0.2} r={size * 0.15} fill={colors.secondary} />
        <Circle cx={centerX - size * 0.08} cy={centerY - size * 0.05} r={size * 0.06} fill={colors.accent} />
        <Circle cx={centerX + size * 0.08} cy={centerY - size * 0.05} r={size * 0.06} fill={colors.accent} />
      </g>
    );
  }
  
  if (name.includes('石') || name.includes('岩') || name.includes('巨像')) {
    // 岩石类
    return (
      <g>
        <Polygon points={`${centerX},${centerY - size * 0.3} ${centerX - size * 0.25},${centerY} ${centerX + size * 0.25},${centerY} ${centerX},${centerY + size * 0.3}`} 
                 fill={colors.primary} stroke={colors.dark} strokeWidth={3} />
        <Rect x={centerX - size * 0.15} y={centerY - size * 0.1} width={size * 0.3} height={size * 0.2} 
              fill={colors.secondary} rx={size * 0.05} />
        <Circle cx={centerX - size * 0.08} cy={centerY} r={size * 0.04} fill={colors.dark} />
        <Circle cx={centerX + size * 0.08} cy={centerY} r={size * 0.04} fill={colors.dark} />
      </g>
    );
  }
  
  // 默认设计 - 根据类型生成基础但独特的造型
  const baseSize = size * 0.35;
  return (
    <g>
      <Circle cx={centerX} cy={centerY} r={baseSize} fill={colors.primary} stroke={colors.dark} strokeWidth={3} />
      <Circle cx={centerX} cy={centerY} r={baseSize * 0.7} fill={colors.secondary} />
      <Circle cx={centerX - baseSize * 0.25} cy={centerY - baseSize * 0.2} r={baseSize * 0.15} fill="#000" />
      <Circle cx={centerX + baseSize * 0.25} cy={centerY - baseSize * 0.2} r={baseSize * 0.15} fill="#000" />
      <Ellipse cx={centerX} cy={centerY + baseSize * 0.2} rx={baseSize * 0.2} ry={baseSize * 0.1} fill={colors.dark} />
    </g>
  );
};

// 主生成函数
export const generatePetModel = (pet, size = 200) => {
  if (!pet) return null;
  
  const name = pet.name || '';
  const type = pet.type || 'NORMAL';
  const colors = TYPE_COLORS[type] || TYPE_COLORS.NORMAL;
  
  // 根据大小调整
  let finalSize = size;
  if (name.includes('小') || name.includes('幼') || name.includes('迷你')) {
    finalSize *= 0.8;
  } else if (name.includes('大') || name.includes('巨') || name.includes('王') || name.includes('主') || name.includes('神')) {
    finalSize *= 1.2;
  }
  
  return (
    <svg width={finalSize} height={finalSize} viewBox={`0 0 ${finalSize} ${finalSize}`} 
         style={{ overflow: 'visible' }}
         className="pet-svg-model">
      <defs>
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
        {generateUniqueModel(name, type, colors, finalSize)}
      </g>
    </svg>
  );
};

export default generatePetModel;

