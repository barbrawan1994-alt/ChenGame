import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, MapControls, Text, Float, SoftShadows, RoundedBox, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// --- 🎨 1. 视觉配置 ---
const TILE_SIZE = 1;
const GRID_W = 30;
const GRID_H = 20;

const PALETTE = {
  GRASS_BASE: '#a8d5ba',    
  GRASS_ALT: '#81c784',     
  WATER: '#4fc3f7',    
  SEA_BASE: '#0288D1',      // 深海底色
  ROCK_DARK: '#5d4037',     
  SNOW: '#eceff1',          
  SAND: '#ffe082',          
  TREE_TRUNK: '#795548',    
  TREE_LEAF: '#2e7d32',     
  ROOF_SHOP: '#ffa726',     
  ROOF_CENTER: '#ec407a',   
  PLAYER: '#ff5252',        
  HIGHLIGHT: '#ffd700'      
};

// --- 🌊 2. 无尽之海组件 (解决虚空感) ---
const InfiniteSea = () => {
  return (
    <group position={[15, -0.8, 10]}>
       {/* 深海基底 */}
       <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
         <planeGeometry args={[500, 500]} />
         <meshStandardMaterial color={PALETTE.SEA_BASE} />
       </mesh>
       {/* 海面反光层 */}
       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
         <planeGeometry args={[500, 500]} />
         <meshPhysicalMaterial 
            color={PALETTE.WATER} 
            transparent opacity={0.6} 
            roughness={0.1} metalness={0.1} 
         />
       </mesh>
    </group>
  );
};

// --- 🏔️ 3. 远山背景装饰 ---
const DistantMountains = () => {
  return (
    <group>
      {/* 左侧远山 */}
      <group position={[-25, 0, 5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <coneGeometry args={[8, 12, 8]} />
          <meshStandardMaterial color="#6d7a8a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.3, 0]}>
          <coneGeometry args={[6, 10, 8]} />
          <meshStandardMaterial color="#7d8a9a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.4, 0]}>
          <coneGeometry args={[7, 11, 8]} />
          <meshStandardMaterial color="#6d7a8a" roughness={0.9} />
        </mesh>
      </group>
      {/* 右侧远山 */}
      <group position={[55, 0, 5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <coneGeometry args={[8, 12, 8]} />
          <meshStandardMaterial color="#6d7a8a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.3, 0]}>
          <coneGeometry args={[6, 10, 8]} />
          <meshStandardMaterial color="#7d8a9a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.4, 0]}>
          <coneGeometry args={[7, 11, 8]} />
          <meshStandardMaterial color="#6d7a8a" roughness={0.9} />
        </mesh>
      </group>
      {/* 后方远山 */}
      <group position={[15, 0, -15]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
          <coneGeometry args={[12, 15, 8]} />
          <meshStandardMaterial color="#5d6a7a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.3, 0]}>
          <coneGeometry args={[10, 13, 8]} />
          <meshStandardMaterial color="#6d7a8a" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.35, 0]}>
          <coneGeometry args={[11, 14, 8]} />
          <meshStandardMaterial color="#5d6a7a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// --- ☁️ 4. 云朵装饰 ---
const Clouds = () => {
  const cloudPositions = [
    [-20, 8, -10], [10, 7, -12], [40, 9, -8],
    [-15, 6, 20], [25, 8, 18], [50, 7, 22],
    [-5, 9, 5], [35, 6, 8]
  ];
  
  return (
    <group>
      {cloudPositions.map((pos, i) => (
        <Float 
          key={i} 
          speed={1 + Math.random() * 0.5} 
          rotationIntensity={0.1} 
          floatIntensity={0.3}
          position={pos}
        >
          <group>
            {/* 云朵主体 */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            <mesh position={[-1.5, 0, 0]}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            <mesh position={[1.5, 0, 0]}>
              <sphereGeometry args={[1.8, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[1.6, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
};

// --- 🌲 5. 3D 实体组件库 ---

const Tree = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
      <meshStandardMaterial color={PALETTE.TREE_TRUNK} />
    </mesh>
    <mesh castShadow position={[0, 0.8, 0]}>
      <coneGeometry args={[0.4, 0.8, 8]} />
      <meshStandardMaterial color={PALETTE.TREE_LEAF} roughness={0.8} />
    </mesh>
    <mesh castShadow position={[0, 1.3, 0]}>
      <coneGeometry args={[0.3, 0.6, 8]} />
      <meshStandardMaterial color="#4caf50" roughness={0.8} />
    </mesh>
  </group>
);

const Rock = ({ position, isSnow }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.4, 0]} rotation={[Math.random(), Math.random(), Math.random()]}>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color={isSnow ? PALETTE.SNOW : PALETTE.ROCK_DARK} roughness={0.9} />
    </mesh>
  </group>
);

const Building = ({ type, position }) => {
  let color = PALETTE.ROOF_SHOP;
  let label = '$';
  if (type === 8) { color = PALETTE.ROOF_CENTER; label = '✚'; }
  if (type === 9) { color = '#ab47bc'; label = '⚔'; }

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0]}>
        <coneGeometry args={[0.55, 0.6, 4]} rotation={[0, Math.PI/4, 0]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.4} color={color} anchorY="bottom">
        {label}
      </Text>
    </group>
  );
};

const Chest = ({ position }) => (
  <Float speed={3} rotationIntensity={0.5} floatIntensity={0.2} position={[position[0], position[1] + 0.4, position[2]]}>
    <mesh castShadow>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshStandardMaterial color="#ffb300" metalness={0.6} roughness={0.2} />
    </mesh>
    <pointLight distance={1} intensity={2} color="orange" />
  </Float>
);

const WaterTile = ({ x, y }) => (
  <Float speed={2} rotationIntensity={0} floatIntensity={0.05} floatingRange={[-0.02, 0.02]}>
    <group position={[x * TILE_SIZE, 0.05, y * TILE_SIZE]}>
       <RoundedBox args={[0.95, 0.1, 0.95]} radius={0.02} smoothness={4}>
          <meshPhysicalMaterial 
            color={PALETTE.WATER} 
            transparent opacity={0.8} 
            roughness={0.0} metalness={0.1} transmission={0.6}
          />
       </RoundedBox>
    </group>
  </Float>
);

const Character = ({ type, position }) => {
  const isBoss = type === 13;
  const color = isBoss ? '#d32f2f' : '#78909c';
  return (
    <group position={[position[0], 0.5, position[2]]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.15, 0.5, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.1, 0.2, 0.1]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-0.1, 0.2, 0.1]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}

// 🔥 [关键] 活动 NPC 组件
const ActivityNPC = ({ type, position }) => {
  let color = '#8BC34A'; 
  let icon = '🦋'; 
  
  if (type === 21) { color = '#29B6F6'; icon = '🎣'; } 
  if (type === 22) { color = '#EC407A'; icon = '🎀'; } 

  return (
    <group position={[position[0], 0, position[2]]}>
       <mesh castShadow position={[0, 0.5, 0]}>
         <capsuleGeometry args={[0.18, 0.5, 4, 8]} />
         <meshStandardMaterial color={color} />
       </mesh>
       <mesh castShadow position={[0, 0.9, 0]}>
         <sphereGeometry args={[0.22]} />
         <meshStandardMaterial color="#FFCCBC" />
       </mesh>
       <Float speed={4} rotationIntensity={0.2} floatIntensity={0.2} position={[0, 1.6, 0]}>
         <Text fontSize={0.6} color="white" outlineWidth={0.04} outlineColor="#333">
           {icon}
         </Text>
         <pointLight distance={2} intensity={1} color={color} />
       </Float>
    </group>
  );
};

// --- 🌳 边界装饰树 (需要在 Tree 定义之后) ---
const BorderTrees = () => {
  const treePositions = [
    // 左侧边界
    ...Array.from({ length: 8 }, (_, i) => [-1, 0, i * 2.5]),
    // 右侧边界
    ...Array.from({ length: 8 }, (_, i) => [GRID_W, 0, i * 2.5]),
    // 前方边界
    ...Array.from({ length: 12 }, (_, i) => [i * 2.5, 0, -1]),
    // 后方边界
    ...Array.from({ length: 12 }, (_, i) => [i * 2.5, 0, GRID_H]),
  ];
  
  return (
    <group>
      {treePositions.map((pos, i) => (
        <Tree key={`border-${i}`} position={pos} />
      ))}
    </group>
  );
};

// --- 🧱 7. 地块渲染 ---
const Tile = ({ x, y, type, isPlayer }) => {
  const isEven = (x + y) % 2 === 0;
  const baseColor = isEven ? PALETTE.GRASS_BASE : PALETTE.GRASS_ALT;
  
  if (isPlayer) {
    return (
      <group position={[x * TILE_SIZE, 0, y * TILE_SIZE]}>
        <Float speed={4} rotationIntensity={0.1} floatIntensity={0.2} position={[0, 0.8, 0]}>
          <mesh castShadow>
             <sphereGeometry args={[0.25, 32, 32]} />
             <meshStandardMaterial color={PALETTE.PLAYER} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI, 0, 0]}>
             <coneGeometry args={[0.1, 0.25, 4]} />
             <meshStandardMaterial color="#d32f2f" emissive="#d32f2f" emissiveIntensity={0.5} />
          </mesh>
        </Float>
        <ContactShadows opacity={0.6} scale={1} blur={1.5} far={1} />
        <pointLight position={[0, 1, 0]} distance={3} intensity={1} color={PALETTE.PLAYER} />
      </group>
    );
  }

  let Decoration = null;
  let groundHeight = 0.2;
  let groundColor = baseColor;

  if (type === 1) Decoration = <Tree position={[0, 0, 0]} />; 
  if (type === 3) return <WaterTile x={x} y={y} />; 
  if (type === 4) Decoration = <Chest position={[0, 0, 0]} />;
  if (type === 5) { Decoration = <Rock position={[0, 0, 0]} isSnow={false} />; groundColor = PALETTE.SAND; }
  if (type === 6) { Decoration = <Rock position={[0, 0, 0]} isSnow={true} />; groundColor = PALETTE.SNOW; }
  if (type === 7) { 
      Decoration = (
        <group>
           {[...Array(4)].map((_,i) => (
             <mesh key={i} position={[Math.random()*0.6-0.3, 0.2, Math.random()*0.6-0.3]} rotation={[0,Math.random(),0]}>
               <coneGeometry args={[0.08, 0.3, 4]} />
               <meshStandardMaterial color="#388e3c" />
             </mesh>
           ))}
        </group>
      ); 
  }
  if (type >= 8 && type <= 10) Decoration = <Building type={type} position={[0, 0, 0]} />;
  if (type >= 11 && type <= 13) Decoration = <Character type={type} position={[0, 0, 0]} />;
  
  // 🔥🔥🔥 核心：包含 ActivityNPC 🔥🔥🔥
  if (type >= 20 && type <= 22) Decoration = <ActivityNPC type={type} position={[0, 0, 0]} />;
  
  if (type === 99) Decoration = <Float speed={5} position={[0, 1, 0]}><Text fontSize={0.8} color={PALETTE.HIGHLIGHT} outlineWidth={0.05}>!</Text></Float>;

  return (
    <group position={[x * TILE_SIZE, 0, y * TILE_SIZE]}>
      <RoundedBox args={[0.95, groundHeight, 0.95]} radius={0.05} smoothness={4} position={[0, groundHeight/2 - 0.1, 0]} receiveShadow>
        <meshStandardMaterial color={groundColor} roughness={0.8} />
      </RoundedBox>
      {Decoration}
    </group>
  );
};

// --- 🎥 8. 智能摄像机 ---
const CameraRig = ({ targetPos }) => {
  useFrame((state) => {
    const tX = targetPos.x * TILE_SIZE;
    const tZ = targetPos.y * TILE_SIZE;
    const offset = new THREE.Vector3(10, 10, 10); 
    state.camera.position.lerp(new THREE.Vector3(tX + offset.x, offset.y, tZ + offset.z), 0.08);
    state.camera.lookAt(tX, 0, tZ);
  });
  return null;
};

// --- 🌍 主组件（优化加载性能）---
const ThreeMap = ({ mapGrid, playerPos }) => {
  // 使用 useMemo 优化地图渲染
  const tiles = React.useMemo(() => {
    return mapGrid.map((row, y) =>
      row.map((type, x) => (
        <Tile key={`${x}-${y}`} x={x} y={y} type={type} />
      ))
    );
  }, [mapGrid]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#81D4FA' }}>
      <Canvas shadows dpr={[1, 1.2]}> {/* 降低dpr提升性能 */}
        {/* 🔴 核心修复：Zoom 改回 65！ */}
        <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={65} near={-50} far={200} />
        
        <CameraRig targetPos={playerPos} />

        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]} {/* 降低阴影分辨率提升性能 */}
        >
          <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={-20} />
        </directionalLight>
        
        <Environment preset="park" />
        <SoftShadows size={8} focus={0.5} samples={8} /> {/* 降低阴影质量提升性能 */}
        
        {/* 🔴 核心修复：加回无尽之海！ */}
        <InfiniteSea />
        
        {/* 🏔️ 远山背景装饰 */}
        <DistantMountains />
        
        {/* ☁️ 云朵装饰 */}
        <Clouds />
        
        {/* 🌳 边界装饰树 */}
        <BorderTrees />

        <group>
          {tiles}
          <Tile x={playerPos.x} y={playerPos.y} isPlayer={true} />
        </group>
      </Canvas>
    </div>
  );
};

export default ThreeMap;