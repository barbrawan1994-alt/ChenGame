import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
// ThreeMap 和 NativePetDesigner 已移除，使用2D地图和emoji渲染
// 导入引擎系统
import { GSAPAnimations, SpringAnimations, CombinedAnimations } from './engines/AnimationEngine';
import { EnhancedButton, EnhancedCard, EnhancedProgressBar, EnhancedModal } from './engines/UIEnhancement';
import { CanvasParticleSystem, ParticlePresets } from './engines/ParticleEngine';
// 导入战斗增强组件
import { 
  EnhancedMoveButton, 
  EnhancedHPBar, 
  AnimatedDamageNumber, 
  SkillCastEffect,
  EnhancedBattleMessage 
} from './engines/BattleEnhancements';
import { SAVE_KEY, COVER_IMG, GRID_W, GRID_H, STARTER_POOL_IDS, BGM_SOURCES, THEME_CONFIG } from './data/constants';
import { TYPES, TYPE_CHARM_BASE, TYPE_BIAS } from './data/types';
import {
  BALLS,
  MEDICINES,
  TMS,
  MISC_ITEMS,
  ACCESSORY_DB,
  RANDOM_EQUIP_DB,
  EVO_STONES,
  GROWTH_ITEMS,
  CURSED_ITEMS,
} from './data/items';
import { TRAIT_DB, NATURE_DB } from './data/traits';
import { BALL_ICONS, MED_ICONS, STONE_ICONS, ACC_ICONS, GROWTH_ICONS, TM_COLORS as TM_ICON_COLORS } from './data/itemIcons';
import { SKILL_DB, STATUS_SKILLS_DB, SIDE_EFFECT_SKILLS } from './data/skills';
import { POKEDEX, STONE_EVO_RULES } from './data/pets';
import ACHIEVEMENTS, { ACH_CATEGORY, ACH_RARITY, DEFAULT_ACH_STATS } from './data/achievements';
import GAME_GUIDE from './data/gameGuide';
import { generateSprite } from './SpriteGenerator';
import { getSpriteUrl, getSpriteFallbackUrls, TRAINER_SPRITES, NPC_SPRITES, getNpcSprite } from './SpriteMap';
import {
  SECT_DB,
  SECT_CHIEFS_CONFIG,
  SECT_TEAMS,
  getSectUpgradeCost,
  TIME_PHASES,
  WEATHERS,
  MAPS,
  STORY_SCRIPT,
  TRAINER_NAMES,
  CHALLENGES,
  CONTEST_CONFIG,
  DUNGEONS,
  MOON_DEMONS,
  NEW_GOD_IDS,
  FINAL_GOD_IDS,
  LEGENDARY_POOL,
  HIGH_TIER_POOL,
  ROCK_POOL,
  WATER_POOL,
  JJK_CHALLENGES,
  HYAKKI_DUNGEON,
  EXTRA_DUNGEONS,
} from './data';
import {
  CURSED_ENERGY_CONFIG, CURSE_GRADES, getCurseGrade, getMaxCE, generateCurseTalent,
  COMMON_TECHNIQUES, TYPE_TECHNIQUES, DOMAINS, BINDING_VOWS,
  JJK_NPCS, HYAKKI_YAKO_CONFIG, AWAKENING_CONDITIONS, GOD_TECHNIQUES,
} from './data/jujutsu';
import {
  HOUSE_TYPES, FURNITURE_QUALITY, FURNITURE_DB, FURNITURE_SETS,
  HOUSING_SCORE_TIERS, rollQuality, getHousingScoreTier, calcHouseScore,
  calcResidentBenefits, DEFAULT_HOUSING_STATE, FURNITURE_TILE,
  GARDEN_PLANTS, getGardenSlots, SEED_DROP_TABLE,
  TREASURE_COLLECTIONS,
} from './data/housing';
import {
  DEVIL_FRUITS, FRUIT_RARITY_CONFIG, FRUIT_CATEGORY_NAMES,
  getRandomFruit, getFruitById, getAllFruits, getFruitIcon,
} from './data/devilfruits';
import {
  BOND_LEVELS, getBondLevel, PARTNER_COMBOS, getPartnerComboKey,
  SAME_TYPE_COMBO, DEFAULT_COMBO, BOND_PER_TURN, BOND_PER_KO,
  CAFE_BUILDING, CAFE_LEVELS, getCafeLevel, CAFE_DRINKS, DEFAULT_CAFE_STATE, DRINK_LOOT_TABLES,
  DRINK_BREW_BASE_MS, DRINK_MIN_WORKER_STATS, calcBrewTimeMs,
} from './data/lycoris';

const BREATHING_BUFFS = [
  { id: 'atk_up', name: '🔥 火之神神乐', desc: '全队攻击力 +20%', effect: (p) => p.customBaseStats.p_atk = Math.floor(p.customBaseStats.p_atk * 1.2) },
  { id: 'def_up', name: '🪨 岩之呼吸', desc: '全队防御力 +20%', effect: (p) => p.customBaseStats.p_def = Math.floor(p.customBaseStats.p_def * 1.2) },
  { id: 'spd_up', name: '⚡ 雷之呼吸', desc: '全队速度 +15%', effect: (p) => p.customBaseStats.spd = Math.floor(p.customBaseStats.spd * 1.15) },
  { id: 'heal_turn', name: '🌊 水之呼吸', desc: '每回合恢复 5% HP', type: 'passive' }, // 需要战斗逻辑支持，这里简化为进场加血上限
  { id: 'crit_up', name: '🐗 兽之呼吸', desc: '暴击率 +10%', effect: (p) => p.customBaseStats.crit += 10 },
  { id: 'heal_all', name: '🦋 虫之呼吸', desc: '立即恢复全队 50% HP', type: 'instant', effect: (p) => p.currentHp = Math.min(getStats(p).maxHp, p.currentHp + getStats(p).maxHp * 0.5) }
];
const ALL_SKILL_TMS = (() => {
  const existingKeys = new Set(TMS.map(t => `${t.type}_${t.name}`));
  const generated = [];
  Object.entries(SKILL_DB).forEach(([typeKey, skills]) => {
    if (typeKey === 'GOD') return;
    skills.forEach(skill => {
      const sType = skill.t || typeKey;
      const key = `${sType}_${skill.name}`;
      if (!existingKeys.has(key)) {
        generated.push({
          id: `tmg_${sType}_${skill.name}`,
          name: skill.name, type: sType,
          p: skill.p || 0, pp: skill.pp || 10,
          desc: skill.desc || `${sType}系技能`,
          effect: skill.effect, val: skill.val,
        });
      }
    });
  });
  return [...TMS, ...generated];
})();

export default function RPG(props) {
  // =================================================================
  // 🔥 [核心修复 1] 启动瞬间同步读取存档 (防止存档“丢失”)
  // =================================================================
  let savedData = {};
  try {
    const raw = localStorage.getItem(SAVE_KEY); // 直接读取，不等待
    if (raw) {
      savedData = JSON.parse(raw);
      console.log("✅ 成功读取存档:", savedData.trainerName);
    }
  } catch (e) {
    console.error("存档读取失败", e);
  }

  // =================================================================
  // 🔥 [核心修复 2] 使用读取到的 savedData 直接初始化所有状态
  // =================================================================
  
  // 基础视图
  const [view, setView] = useState('menu'); 
  const encounterTimerRef = useRef(null);
  
  // 玩家身份 (优先用存档里的名字，没有才用默认)
  const [trainerName, setTrainerName] = useState(savedData.trainerName || '小智');
  const [trainerAvatar, setTrainerAvatar] = useState(savedData.trainerAvatar && savedData.trainerAvatar.startsWith('http') ? savedData.trainerAvatar : TRAINER_SPRITES[0].url);
  const [unlockedTitles, setUnlockedTitles] = useState(savedData.unlockedTitles || ['见习训练家']);
  const [currentTitle, setCurrentTitle] = useState(savedData.currentTitle || '见习训练家');

  // 核心资产 (金币/背包/队伍)
  const [gold, setGold] = useState(savedData.gold || 1000);
  const migrateCurseTalent = (pets) => (pets || []).map(p => p.curseTalent != null ? p : { ...p, curseTalent: generateCurseTalent() });
  const [party, setParty] = useState(migrateCurseTalent(savedData.party));
  const [box, setBox] = useState(migrateCurseTalent(savedData.box));
  const [accessories, setAccessories] = useState(savedData.accessories || []);
  
  // 背包初始化 (防止旧存档缺字段导致报错)
  const defaultInventory = { 
    balls: { poke: 10, great: 0, ultra: 0, master: 0, net:0, dusk:0, quick:0, timer:0, heal:0 }, 
    meds: {}, tms: {}, misc: {}, stones: {}, berries: 0 
  };
  const [inventory, setInventory] = useState({ ...defaultInventory, ...(savedData.inventory || {}) });
  const [fruitInventory, setFruitInventory] = useState(savedData.fruitInventory || []);
  const [fruitDexCatFilter, setFruitDexCatFilter] = useState('ALL');
  const [fruitDexRarFilter, setFruitDexRarFilter] = useState('ALL');
  const [fruitDexSelected, setFruitDexSelected] = useState(null);
  const [vowModal, setVowModal] = useState(false);
  const [battleFruitDetail, setBattleFruitDetail] = useState(null);
  const sectBadgeRef = React.useRef(null);

  // 游戏进度
  const [mapProgress, setMapProgress] = useState(savedData.mapProgress || {});
  const [caughtDex, setCaughtDex] = useState(savedData.caughtDex || []);
  const [completedChallenges, setCompletedChallenges] = useState(savedData.completedChallenges || []);
  const [badges, setBadges] = useState(savedData.badges || []);
  const [viewedIntros, setViewedIntros] = useState(savedData.viewedIntros || []);
  const [sectTitles, setSectTitles] = useState(savedData.sectTitles || []);
  const [leagueWins, setLeagueWins] = useState(savedData.leagueWins || 0);

  // 家园系统
  const [housing, setHousing] = useState(savedData.housing || { ...DEFAULT_HOUSING_STATE });
  const [housingTab, setHousingTab] = useState('overview');

  // 搭档羁绊系统
  const [partnerModal, setPartnerModal] = useState(false);
  const [comboUsedThisBattle, setComboUsedThisBattle] = useState(false);

  // LycoReco咖啡厅
  const [cafe, setCafe] = useState(savedData.cafe || { ...DEFAULT_CAFE_STATE });
  const [cafeTab, setCafeTab] = useState('overview');

  // 成就系统
  const [achStats, setAchStats] = useState(savedData.achStats || { ...DEFAULT_ACH_STATS });
  const [unlockedAchs, setUnlockedAchs] = useState(savedData.unlockedAchs || []);
  const [achNotification, setAchNotification] = useState(null);
  const [achCatFilter, setAchCatFilter] = useState('ALL');
  const [fruitPickModal, setFruitPickModal] = useState(null);

  // 存档状态标记 (关键！直接根据是否读到金币来判断是否有存档)
  const [hasSave, setHasSave] = useState(!!savedData.gold); 
  const [loaded, setLoaded] = useState(true); // 直接设为加载完成，不需要 useEffect 等待

  // 临时状态 (不需要存入 savedData 的部分)
  const [activityRecords, setActivityRecords] = useState({ bug: 0, fishing: 0, beauty: 0 });
  const [dungeonCooldowns, setDungeonCooldowns] = useState({});
  const [resultData, setResultData] = useState(null); 

  // 环境与天气系统
  const [weather, setWeather] = useState('CLEAR');    
  const [mapWeathers, setMapWeathers] = useState({}); 
  const [timePhase, setTimePhase] = useState('DAY');
  useEffect(() => {
    const wk = mapWeathers[currentMapId] || 'CLEAR';
    if (weather !== wk) setWeather(wk);
  }, [currentMapId, mapWeathers]); 
  const [gameTime, setGameTime] = useState(0);

  

// 2. [新增] 天气生成算法 (根据地图类型决定天气权重)
const generateWeatherForMap = (mapType) => {
    const rand = Math.random();
    
    // 极寒冻土: 50%雪, 40%晴, 10%雨(冻雨)
    if (mapType === 'ice') return rand < 0.5 ? 'SNOW' : (rand < 0.9 ? 'CLEAR' : 'RAIN');
    
    // 流沙荒漠: 40%沙暴, 40%晴, 20%大晴天(酷热)
    if (mapType === 'ground' || mapType === 'rock') return rand < 0.4 ? 'SAND' : (rand < 0.8 ? 'CLEAR' : 'SUN');
    
    // 熔岩火山: 50%大晴天, 50%晴
    if (mapType === 'fire') return rand < 0.5 ? 'SUN' : 'CLEAR';
    
    // 深蓝海域: 40%雨, 60%晴
    if (mapType === 'water') return rand < 0.4 ? 'RAIN' : 'CLEAR';
    
    // 其他区域 (草原/城市等): 70%晴, 20%雨, 10%大晴天
    return rand < 0.7 ? 'CLEAR' : (rand < 0.9 ? 'RAIN' : 'SUN');
};

// 3. [核心] 时间流逝与天气轮转控制 Hook
useEffect(() => {
    const timer = setInterval(() => {
        setGameTime(prev => {
            const nextTime = prev + 1;
            
            // --- A. 时间流逝逻辑 (全局统一) ---
            // 周期: 4500秒 (75分钟) = 1天
            // 0-1800: 白天 | 1800-2700: 黄昏 | 2700-4500: 夜晚
            const cycle = nextTime % 4500;
            let newPhase = 'DAY';
            if (cycle >= 1800 && cycle < 2700) newPhase = 'DUSK';
            else if (cycle >= 2700) newPhase = 'NIGHT';
            
            if (newPhase !== timePhase) setTimePhase(newPhase);

            // --- B. 天气轮转逻辑 (各地区独立) ---
            // 每 300秒 (5分钟) 刷新一次全地图天气
            // 或者初始化时 (prev === 0) 立即刷新
            if (prev === 0 || nextTime % 300 === 0) {
                const newWeathers = {};
                MAPS.forEach(m => {
                    newWeathers[m.id] = generateWeatherForMap(m.type);
                });
                setMapWeathers(newWeathers);
                
                if (prev > 0) addGlobalLog(`🌍 各地的天气发生了变化...`);
            }

            // 家园系统：每900秒结算一次入住收益
            if (nextTime % 900 === 0 && housing.currentHouse) {
                const placed = housing.furniture.filter(f => f.placed);
                const ben = calcResidentBenefits(placed);
                const residentIds = housing.residents.filter(Boolean);
                if (residentIds.length > 0 && (ben.hpRegen > 0 || ben.expBonus > 0 || ben.intimacyBonus > 0)) {
                    setBox(prevBox => prevBox.map(p => {
                        if (!residentIds.includes(p.uid || p.id)) return p;
                        const maxHp = getStats(p).maxHp;
                        return {
                            ...p,
                            currentHp: Math.min(maxHp, (p.currentHp || maxHp) + ben.hpRegen),
                            intimacy: Math.min(255, (p.intimacy || 0) + ben.intimacyBonus),
                        };
                    }));
                    setParty(prevParty => prevParty.map(p => {
                        if (!residentIds.includes(p.uid || p.id)) return p;
                        const maxHp = getStats(p).maxHp;
                        return {
                            ...p,
                            currentHp: Math.min(maxHp, (p.currentHp || maxHp) + ben.hpRegen),
                            intimacy: Math.min(255, (p.intimacy || 0) + ben.intimacyBonus),
                        };
                    }));
                }
            }
            
            return nextTime;
        });
    }, 1000); // 1秒 = 游戏内1秒 (可根据需要调整流逝速度，例如 100ms)

    return () => clearInterval(timer);
}, [timePhase]); // 依赖项

  const [skillFilter, setSkillFilter] = useState('ALL'); 
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
 const [storyProgress, setStoryProgress] = useState(savedData.storyProgress || 0);
  const [storyStep, setStoryStep] = useState(savedData.storyStep || 0);
  const [dialogQueue, setDialogQueue] = useState([]); // 当前待播放的对话队列
  const [isDialogVisible, setIsDialogVisible] = useState(false); // 是否显示对话框
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0); // 当前对话说到第几句
 
    // ==========================================
  // [修复] 缺失的无限城逻辑函数
  // ==========================================

  // 1. 进入下一层
  const nextInfinityFloor = () => {
    setInfinityState(prev => {
      const newFloor = prev.floor + 1;
      updateAchStat({ maxInfinityFloor: newFloor });
      return { ...prev, floor: newFloor, status: 'selecting' };
    });
  };

  // 2. 选择呼吸法 Buff
  const selectInfinityBuff = (buff) => {
    // A. 如果是即时恢复类
    if (buff.type === 'instant') {
      const newParty = party.map(p => {
        if (p.currentHp > 0) {
          const stats = getStats(p);
          // 恢复 50% 血量
          const heal = Math.floor(stats.maxHp * 0.5);
          return { ...p, currentHp: Math.min(stats.maxHp, p.currentHp + heal) };
        }
        return p;
      });
      setParty(newParty);
      alert("✨ 呼吸法生效：全队体力大幅恢复！");
    } 
    // B. 如果是属性加成类 (修改 customBaseStats)
    else if (buff.effect) {
      const newParty = party.map(p => {
        // 复制对象
        const newPet = { ...p };
        // 如果还没有自定义种族值，先锁定当前种族值
        if (!newPet.customBaseStats) {
            const base = POKEDEX.find(d => d.id === newPet.id) || POKEDEX[0];
            // 简单的种族值快照
            newPet.customBaseStats = {
                hp: base.hp, p_atk: base.atk, p_def: base.def, 
                s_atk: base.atk, s_def: base.def, spd: base.spd, crit: 5
            };
        }
        // 执行 Buff 函数 (修改 customBaseStats)
        buff.effect(newPet);
        return newPet;
      });
      setParty(newParty);
      
      // 记录已获得的 Buff
      setInfinityState(prev => ({
        ...prev,
        buffs: [...prev.buffs, buff]
      }));
      alert(`🔥 呼吸法生效：${buff.desc}`);
    }

    // 选完后进入下一层
    nextInfinityFloor();
  };

// 【新增】用于存储对话结束后要执行的任务
const [pendingTask, setPendingTask] = useState(null); 
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // [修正] 1. 图片数据源映射逻辑 (参考成功示例优化)
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  const imageMap = React.useMemo(() => {
    const map = {};
    // 注意：这里 pokemon_images 要和 manifest.json 里的 data_source_id 一致
    const sourceItems = props?.data?.pokemon_images?.items || [];
    
    sourceItems.forEach(item => {
      // 1. 获取 ID (确保是数字)
      const id = Number(item.pet_id?.value);
      
      // 2. 获取图片 URL (使用更兼容的读取方式)
      let imgUrl = null;
      const files = item.pet_img?.value;
      
      if (Array.isArray(files) && files.length > 0) {
        const firstFile = files[0];
        // 优先尝试获取中等尺寸缩略图 (link.medium)，如果没有则尝试直接获取 link 或 url
        // 伙伴云的图片对象结构可能是 { link: { medium: "..." } } 也可能是 { url: "..." }
        imgUrl = firstFile?.link?.medium || firstFile?.link || firstFile?.url;
      }

      // 3. 只有当 ID 和 图片地址 都存在时才存入映射表
      if (id && imgUrl) {
        map[id] = imgUrl;
      }
    });
    
    // [调试] 打印一下看看读到了多少图片
    console.log(`🔥 [图库调试] 成功加载了 ${Object.keys(map).length} 张精灵图片`, map);
    
    return map;
  }, [props.data]);

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // [优化] 2. 核心头像渲染函数 (支持 CSS 类控制大小)
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  
  const renderAvatarImg = (url, size = 40) => {
    if (!url || !url.startsWith('http')) {
      return <span style={{fontSize: size * 0.75}}>{url || '🧢'}</span>;
    }
    return <img src={url} alt="avatar" style={{width: size, height: size, objectFit: 'contain', imageRendering: 'auto'}} onError={e => { e.target.style.display='none'; }} />;
  };

  const generatePetVisual = (pet) => {
    if (!pet) return null;
    const imgUrl = imageMap[pet.id];
    if (imgUrl) {
      return { type: 'image', url: imgUrl, emoji: pet.emoji };
    }
    
    const spriteUrl = getSpriteUrl(pet);
    if (spriteUrl) {
      return { type: 'image', url: spriteUrl, emoji: pet.emoji };
    }

    const pixelUrl = generateSprite(pet, POKEDEX);
    if (pixelUrl) {
      return { type: 'pixel', url: pixelUrl };
    }
    
    return { type: 'emoji', emoji: pet.emoji || '🐾' };
  };
  
  const renderAvatar = (pet, isEnemy = false) => {
    if (!pet) return null;
    const visual = generatePetVisual(pet);
    
    if (visual.type === 'image' || visual.type === 'pixel') {
      const fallbackUrls = getSpriteFallbackUrls(pet);
      const tc = TYPES[pet.type]?.color || '#999';
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img 
            src={visual.url} 
            alt={pet.name} 
            className={visual.type === 'pixel' ? 'pet-avatar-pixel' : 'pet-avatar-img'}
            onError={e => {
              const img = e.target;
              const tried = parseInt(img.dataset.retryIdx || '0', 10);
              const nextUrl = fallbackUrls[tried + 1];
              if (nextUrl && img.src !== nextUrl) {
                img.dataset.retryIdx = String(tried + 1);
                img.src = nextUrl;
              } else {
                img.style.display = 'none';
                const fb = img.parentElement?.querySelector('.avatar-fallback');
                if (fb) fb.style.display = 'flex';
              }
            }}
          />
          <div className="avatar-fallback" style={{
            display:'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center',
            background: `linear-gradient(135deg, ${tc}40, ${tc}15)`,
            borderRadius:'50%', fontSize:'clamp(14px, 38%, 42px)', fontWeight:'900',
            color: tc, textShadow: `0 1px 4px ${tc}60`
          }}>
            {(pet.name || '?')[0]}
          </div>
          {pet.isFusedShiny ? (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(45deg, rgba(213,0,249,0.25), rgba(123,31,162,0.2), rgba(255,255,255,0.15))',
              animation: 'shiny-flash 2s infinite',
              pointerEvents: 'none',
              borderRadius: 'inherit'
            }} />
          ) : pet.isShiny ? (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,215,0,0.3), rgba(255,255,255,0.3))',
              animation: 'shiny-flash 2s infinite',
              pointerEvents: 'none',
              borderRadius: 'inherit'
            }} />
          ) : null}
        </div>
      );
    }
    
    return <span className="pet-avatar-emoji">{visual.emoji || pet.emoji || '🐾'}</span>;
  };
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    // 缓存技能列表 (避免重复计算)
  const allSkills = React.useMemo(() => {
    let list = [];
    
    // SKILL_DB 已经被注入了所有技能，所以只需要遍历它
    Object.keys(SKILL_DB).forEach(type => {
      SKILL_DB[type].forEach(move => {
        // 动态判断分类：如果威力为0或有特效，则为变化技能
        const isStatus = move.p === 0 || move.effect;
        
        list.push({ 
            ...move, 
            t: type, 
            category: isStatus ? 'status' : 'damage' 
        });
      });
    });

    // 不需要再遍历 STATUS_SKILLS_DB 了，否则会重复
    
    return list.sort((a, b) => a.t.localeCompare(b.t));
  }, []);






  
  // 临时的输入状态
  const [tempName, setTempName] = useState(''); 

 
  // 1. 在 useState 区域添加这两个状态
  const [selectedBagItem, setSelectedBagItem] = useState(null); // 当前选中的物品详情
  const [usingItem, setUsingItem] = useState(null); // 当前准备使用的物品
  // [新增] 战斗内背包的标签页状态
  const [battleBagTab, setBattleBagTab] = useState('balls');
    // 装备系统状态
  const [equipModalOpen, setEquipModalOpen] = useState(false);
  const [targetEquipSlot, setTargetEquipSlot] = useState({ petIdx: 0, slotIdx: 0 });

  // 初始精灵三选一
  const [starterOptions, setStarterOptions] = useState([]);
const [fusionParent, setFusionParent] = useState(null); // 融合父本
  const [fusionChild, setFusionChild] = useState(null);   // 融合母本
  const [fusionSlot, setFusionSlot] = useState(null);     // 当前正在选择哪个槽位 ('parent' 或 'child')
  // 融合系统状态
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionSlots, setFusionSlots] = useState([null, null]); // [ParentA_Index, ParentB_Index]
  const [viewSectTeam, setViewSectTeam] = useState(null); 



  // 界面状态
  const [currentMapId, setCurrentMapId] = useState(1);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [mapGrid, setMapGrid] = useState([]); // 随机生成的网格数据

  const [leagueRound, setLeagueRound] = useState(0); // 当前轮次: 0=未参加, 1=16强, 2=8强, 3=半决赛, 4=决赛
  // 在 RPG 组件内部

// 还需要一个控制头像选择弹窗的状态
const [showAvatarSelector, setShowAvatarSelector] = useState(false);

// 【新增】全局探索日志状态
  const [globalLogs, setGlobalLogs] = useState([
    { time: '系统', msg: '欢迎来到宝可梦 RPG 世界！' },
    { time: '系统', msg: '请使用方向键或 WASD 移动。' }
  ]);
   const [messageBox, setMessageBox] = useState(null); 
  // ✨ 新增：全局键盘监听 (空格键关闭弹窗/返回)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // 如果按下了空格键 (Space)
      if (e.code === 'Space') {
        // 1. 如果当前有自定义弹窗，关闭它
        if (messageBox) {
            e.preventDefault(); // 防止页面滚动
            const cb = messageBox.callback;
            setMessageBox(null);
            if (cb) cb(); // 执行回调
            return;
        }
        
        // 2. 如果当前在“功能未开放”界面，相当于点击返回
        if (view === 'locked') {
            e.preventDefault();
            setView(hasSave && party.length > 0 ? getBackToMapView() : 'menu');
            return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [messageBox, view]);

  // ✨ 辅助函数：用来替代 alert()
  // 用法：showMessage("岩石挡住了路！", () => { console.log("关闭了"); });
  const showMessage = (text, callback = null) => {
      setMessageBox({ text, callback });
  };

  // 【新增】添加日志的辅助函数
  const addGlobalLog = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
    setGlobalLogs(prev => [{ time, msg }, ...prev].slice(0, 20));
  };  
  // 界面模态框状态
  const [teamMode, setTeamMode] = useState(false);
  const [shopMode, setShopMode] = useState(false);
  const [pcMode, setPcMode] = useState(false);
  const [selectedPartyIdx, setSelectedPartyIdx] = useState(null);
  const [selectedBoxIdx, setSelectedBoxIdx] = useState(null);
  const [statTooltip, setStatTooltip] = React.useState(null); 
  // 筛选和详情
  const [dexFilter, setDexFilter] = useState('all'); 
  const [selectedDexId, setSelectedDexId] = useState(null);
const [infinityState, setInfinityState] = useState(null); 
  // 商店
  const [shopTab, setShopTab] = useState('balls'); 
  const [buyCounts, setBuyCounts] = useState({}); 

  // 地图/挑战切换
  const [mapTab, setMapTab] = useState('maps'); 

  // 战斗与事件
  const [battle, setBattle] = useState(null);
   // 🎵 [新增] 音频控制 Ref 和 State
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false); // 静音状态
  const [currentTrack, setCurrentTrack] = useState(''); // 当前播放的曲目

  // 🎵 [最终优化] BGM 自动切换逻辑
  // 逻辑：只有当“目标曲目”和“当前曲目”不一样时，才切歌。否则保持播放，绝不打断。
  useEffect(() => {
    if (!audioRef.current) return;

    let targetSrc = '';

    // 1. 定义【菜单音乐组】：这三个界面都用 MENU 音乐
    // 这样在它们之间切换时，targetSrc 不变，音乐就不会断
    if (view === 'menu' || view === 'name_input' || view === 'starter_select') {
      targetSrc = BGM_SOURCES.MENU;
    } 
    // 2. 定义【地图音乐组】
    else if (view === 'world_map' || view === 'grid_map' || view === 'sect_summit') {
      targetSrc = BGM_SOURCES.MAP;
    }
    // 3. 定义【战斗音乐组】
    else if (view === 'battle') {
      if (battle && (battle.isBoss || battle.isGym || battle.isChallenge || battle.type === 'eclipse_leader')) {
        targetSrc = BGM_SOURCES.BOSS;
      } else {
        targetSrc = BGM_SOURCES.BATTLE;
      }
    }

    // 4. 执行播放逻辑
    const audio = audioRef.current;

    if (targetSrc && targetSrc !== currentTrack) {
        setCurrentTrack(targetSrc);
        audio.src = targetSrc;
        audio.volume = 0.5;
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    } else if (targetSrc === currentTrack && audio.paused && !isMuted) {
        audio.play().catch(() => {});
    }

  }, [view, battle, currentTrack, isMuted]);


  const [eventData, setEventData] = useState(null);
  const [animEffect, setAnimEffect] = useState(null);
  const [showBallMenu, setShowBallMenu] = useState(false);

  // 技能学习状态
  const [pendingMove, setPendingMove] = useState(null);
  const [learningPetIdx, setLearningPetIdx] = useState(null);

  // 引用，用于地图滚动
  const mapContainerRef = useRef(null);
  const handleMove = useCallback((dx, dy) => {
  setPlayerPos(prevPos => {
    const nx = prevPos.x + dx;
    const ny = prevPos.y + dy;
    return { x: nx, y: ny, dx, dy, intent: true }; 
  });
}, []);
const [viewStatPet, setViewStatPet] = useState(null);
  const [rebirthData, setRebirthData] = useState(null);
  const [showNatureTip, setShowNatureTip] = useState(false); 
  // ➕ [新增] 背包分类标签页状态
  const [bagTab, setBagTab] = useState('balls'); 
  const [pvpMode, setPvpMode] = useState(false); 
  const [pvpCodeInput, setPvpCodeInput] = useState('');
  const [activeContest, setActiveContest] = useState(null);
  const [fishingState, setFishingState] = useState({ status: 'idle', timer: 0, target: null, fish: null, weight: 0, msg: '' });
   const [evoAnim, setEvoAnim] = useState(null); // { oldPet, newPet, targetIdx, step: 0-3 }
  const [beautyState, setBeautyState] = useState({ round: 1, appeal: 0, history: [], log: [] });
  const [activityModal, setActivityModal] = useState(null); 
  const [battleTooltip, setBattleTooltip] = useState(null);
  const [guideSearch, setGuideSearch] = useState('');
  const [guideExpanded, setGuideExpanded] = useState({});
  const [guideCat, setGuideCat] = useState(null);
    // ==========================================
  
  // [新增] 核心逻辑函数群
  // ==========================================

  // 1. 计算捕获率 (修正版：适配地图和属性 + 神兽/稀有度惩罚)
  const calculateCatchRate = (ballType, enemy) => {
      if (ballType === 'master') return 1.0;
      const ball = BALLS[ballType];
      let rate = ball.rate;
      
      if (!battle) return 0.5;
      const mapInfo = MAPS.find(m => m.id === battle.mapId);
      const turnCount = Math.floor((battle.logs || []).length / 2);

      // 网纹球：水系或虫系
      if (ballType === 'net') {
          if (enemy.type === 'WATER' || enemy.type === 'BUG') rate = 3.5;
      }
      // 黑暗球：特定地图(工厂/古堡/太空) 或 幽灵/超能/毒系
      if (ballType === 'dusk') {
          const isDarkMap = mapInfo && ['factory', 'ghost', 'space'].includes(mapInfo.type);
          const isDarkType = ['GHOST', 'PSYCHIC', 'POISON'].includes(enemy.type);
          if (isDarkMap || isDarkType) rate = 3.5;
      }
      // 先机球：前 3 回合
      if (ballType === 'quick') {
          if (turnCount <= 3) rate = 5.0;
      }
      // 计时球：回合越久越强
      if (ballType === 'timer') {
          rate = 1.0 + (turnCount * 0.3);
          if (rate > 4.0) rate = 4.0;
      }

      const maxHp = getStats(enemy).maxHp;
      const hpRate = enemy.currentHp / maxHp;
      let baseRate = ((1 - hpRate) * 0.8 + 0.1) * rate;

      // 稀有度惩罚：神兽/高阶精灵大幅降低捕获率
      const eid = enemy.id;
      if (FINAL_GOD_IDS && FINAL_GOD_IDS.includes(eid)) {
          baseRate *= 0.08;
      } else if (NEW_GOD_IDS && NEW_GOD_IDS.includes(eid)) {
          baseRate *= 0.12;
      } else if (LEGENDARY_POOL && LEGENDARY_POOL.includes(eid)) {
          baseRate *= 0.2;
      } else if (HIGH_TIER_POOL && HIGH_TIER_POOL.includes(eid)) {
          baseRate *= 0.4;
      }

      // 等级差惩罚：敌方等级远超我方首发时更难抓
      const myLead = party[0];
      if (myLead) {
          const lvlDiff = enemy.level - myLead.level;
          if (lvlDiff > 20) baseRate *= 0.3;
          else if (lvlDiff > 10) baseRate *= 0.5;
          else if (lvlDiff > 5) baseRate *= 0.7;
      }

      // 异常状态加成：睡眠/冰冻×2，麻痹/灼伤/中毒×1.5
      if (enemy.status === 'SLP' || enemy.status === 'FRZ') baseRate *= 2.0;
      else if (enemy.status === 'PAR' || enemy.status === 'BRN' || enemy.status === 'PSN') baseRate *= 1.5;

      return Math.min(baseRate, 0.95);
  };

  // 2. 使用洗练药
   // 2. 使用洗练药 (旧版直接使用逻辑)
  const useRebirthPill = (petIdx) => {
    if ((inventory.misc.rebirth_pill || 0) <= 0) return;
    if (!confirm(`⚠️ 确定要对 ${party[petIdx].name} 使用洗练药吗？\n属性、性格将重新随机，有概率变闪光！`)) return;

    const newParty = [...party];
    const pet = newParty[petIdx];

    setInventory(prev => ({...prev, misc: {...prev.misc, rebirth_pill: prev.misc.rebirth_pill - 1}}));

    const randIV = () => Math.floor(Math.random() * 32); 
    pet.ivs = { hp: randIV(), p_atk: randIV(), p_def: randIV(), s_atk: randIV(), s_def: randIV(), spd: randIV(), crit: Math.floor(Math.random() * 10) };
    
    const natureKeys = Object.keys(NATURE_DB);
    pet.nature = natureKeys[Math.floor(Math.random() * natureKeys.length)];
    pet.isShiny = Math.random() < 0.04; 
    
    // ▼▼▼ 新增：重置波动 ▼▼▼
    pet.diversityRng = Math.floor(Math.random() * 9) - 4;
    pet.speedRng = Math.floor(Math.random() * 71) + 40;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const stats = getStats(pet);
    pet.currentHp = stats.maxHp; // 洗练后回满血

    setParty(newParty);
    let msg = `✨ 洗练完成！\n性格变为：${NATURE_DB[pet.nature].name}`;
    if (pet.isShiny) msg += "\n🌟 哇！刷出了闪光精灵！";
    alert(msg);
  };


  // 3. 使用技能书
  const useTM = (petIdx, tmId) => {
    const tm = TMS.find(t => t.id === tmId);
    if (!tm || (inventory.tms[tmId] || 0) <= 0) return;
    const pet = party[petIdx];

    if (pet.type !== tm.type && pet.secondaryType !== tm.type) {
        alert(`❌ 无法学习！\n${pet.name} 不是 ${TYPES[tm.type].name} 属性。`);
        return;
    }
    if (pet.moves.some(m => m.name === tm.name)) {
        alert("已经学会了这个技能！");
        return;
    }

    setInventory(prev => ({...prev, tms: {...prev.tms, [tmId]: prev.tms[tmId] - 1}}));
    const newMove = { name: tm.name, p: tm.p, t: tm.type, pp: tm.pp, maxPP: tm.pp, desc: tm.desc };
    
    if (pet.moves.length < 4) {
        const newParty = [...party];
        // 正确：创建一个新对象
        newParty[petIdx] = {
            ...newParty[petIdx],
            moves: [...newParty[petIdx].moves, newMove]
        };
        setParty(newParty);
        alert(`📖 ${pet.name} 学会了 [${tm.name}]!`);
    } else {
        const newParty = [...party];
        // 正确：创建一个新对象
        newParty[petIdx] = {
            ...newParty[petIdx],
            pendingLearnMove: newMove
        };
        setParty(newParty);
        setLearningPetIdx(petIdx);
        setPendingMove(newMove);
        setView('move_forget');
    }
  };

    // 4. 战斗中使用药品 (消耗回合)
  const useBattleItem = async (itemKey, category) => {
    if (!battle) return;
    const p = party[battle.activeIdx];
    const pState = battle.playerCombatStates?.[battle.activeIdx];
    if (!p || !pState) return;
    let used = false;
    let logMsg = "";

    if (category === 'meds') {
        const item = MEDICINES[itemKey];
        if (!item || !item.type) return;
        if ((inventory.meds?.[itemKey] || 0) <= 0) return;

        if (item.type === 'HP') {
            const max = getStats(p).maxHp;
            if (p.currentHp >= max) { alert("体力已满！"); return; }
            const heal = item.val === 9999 ? max : item.val;
            p.currentHp = Math.min(max, p.currentHp + heal);
            logMsg = `使用了 ${item.name}，恢复了体力！`;
            used = true;
        } else if (item.type === 'STATUS') {
            if (item.val === 'ALL') {
                if (!pState.status) { alert("没有异常状态！"); return; }
                pState.status = null;
                logMsg = `使用了 ${item.name}，状态恢复正常！`;
                used = true;
            } else {
                if (pState.status !== item.val) { alert("无效的药品！"); return; }
                pState.status = null;
                logMsg = `使用了 ${item.name}，治愈了异常状态!`;
                used = true;
            }
        } else if (item.type && item.type.includes('PP')) {
             (p.moves || []).forEach(m => m.pp = Math.min(m.maxPP||15, m.pp + item.val));
             logMsg = `使用了 ${item.name}，PP得到了恢复！`;
             used = true;
        } else if (item.type === 'REVIVE') {
             // 战斗中通常不能对出战精灵用复活药(因为出战的肯定是活的)，除非是给替补用
             // 但 useBattleItem 目前逻辑是针对 activeIdx 的
             alert("无法在战斗中对当前精灵使用活力块！");
             return;
        }

        if (used) {
            setInventory(prev => ({...prev, meds: {...(prev.meds||{}), [itemKey]: ((prev.meds||{})[itemKey] || 0) - 1}}));
            p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
        }
    }

    // 战斗中使用咒具
    if (category === 'cursed') {
      const cItem = CURSED_ITEMS[itemKey];
      if (!cItem || ((inventory.cursed || {})[itemKey] || 0) <= 0) return;

      if (cItem.type === 'CE_HEAL') {
        const maxCE = pState.maxCE || 0;
        if (maxCE <= 0) { alert("该精灵没有咒力！"); return; }
        const heal = Math.floor(maxCE * cItem.val);
        pState.cursedEnergy = Math.min(maxCE, (pState.cursedEnergy || 0) + heal);
        logMsg = `使用了 ${cItem.name}，恢复了 ${heal} 咒力!`;
        used = true;
      } else if (cItem.type === 'CE_RESTORE') {
        if ((pState.maxCE || 0) <= 0) { alert("该精灵没有咒力！"); return; }
        pState.cursedEnergy = Math.min(pState.maxCE, (pState.cursedEnergy || 0) + cItem.val);
        logMsg = `使用了 ${cItem.name}，恢复了 ${cItem.val} 咒力!`;
        used = true;
      } else if (cItem.type === 'CE_BOOST') {
        pState.cursedBoost = (pState.cursedBoost || 0) + cItem.val;
        logMsg = `使用了 ${cItem.name}，术式威力提升 ${cItem.val * 100}%!`;
        used = true;
      } else if (cItem.type === 'ANTI_DOMAIN') {
        const state = battle;
        if (state.activeDomain && state.activeDomain.ownerSide === 'enemy') {
          state.activeDomain = null;
          logMsg = `使用了 ${cItem.name}，破除了敌方领域!`;
          used = true;
        } else { alert("当前没有敌方领域！"); return; }
      } else if (cItem.type === 'SEAL') {
        const enemy = battle.enemyParty?.[battle.enemyActiveIdx];
        if (enemy && !battle.isBoss) {
          if (Math.random() < cItem.val) {
            enemy.currentHp = 0;
            logMsg = `使用了 ${cItem.name}，成功封印了 ${enemy.name}!`;
            used = true;
          } else {
            logMsg = `使用了 ${cItem.name}，但封印失败了...`;
            used = true;
          }
        } else { alert(battle.isBoss ? "对Boss无效！" : "无效目标！"); return; }
      }

      if (used) {
        setInventory(prev => ({ ...prev, cursed: { ...(prev.cursed || {}), [itemKey]: ((prev.cursed || {})[itemKey] || 0) - 1 } }));
      }
    }

    if (used) {
        setShowBallMenu(false); 
        addLog(logMsg);
        setAnimEffect({ type: 'HEAL', target: 'player' });
        await wait(800);
        setAnimEffect(null);
        await enemyTurn();
    }
  };


    // ==========================================
  // [修正] 初始精灵确认 (初始化新版背包结构)
  // ==========================================
  const confirmStarter = (preGeneratedPet) => {
    // 🔥 关键修改：不再调用 createPet，而是直接使用传进来的对象
    // 只需要更新一下 uid 确保唯一性即可
    const newPet = { ...preGeneratedPet, uid: Date.now() };
    // 2. 初始化玩家状态
    setParty([newPet]);
    setCaughtDex([newPet.id]);
    setGold(1000);
    
    // ▼▼▼▼▼▼▼▼▼▼ 核心修复点 ▼▼▼▼▼▼▼▼▼▼
    // 必须使用包含 meds, tms, misc 的新结构
    setInventory({ 
        balls: { poke: 10, great: 0, ultra: 0, master: 0, net:0, dusk:0, quick:0, timer:0, heal:0 }, 
        meds: { potion: 5 }, // 初始送5个伤药，放在 meds 里
      stones: {}, // <--- 新增
        tms: {},  
        misc: {}, 
        berries: 5 
    });
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    
    // 3. 初始化剧情
    setStoryProgress(0);
    setStoryStep(0);
    setViewedIntros([]);

    // 4. 进入第一张地图 (触发剧情对话)
    enterMap(1);

    // 5. 成就：选择初始精灵
    updateAchStat({ starterChosen: true, totalCaught: 1 });
    
    // 6. 提示
    alert(`🎉 恭喜！你获得了 ${newPet.name}！\n冒险开始了！`);
  };

    // ==========================================
  // [核心] 属性计算函数 (含特性修正)
  // ==========================================
  function getStats(pet, stages = null, status = null) {
    const growth = 1 + pet.level * 0.05; 
    const shinyMod = pet.isFusedShiny ? 1.35 : (pet.isShiny ? 1.2 : 1.0);

    let ivs = pet.ivs || { hp:0, p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, crit:0 };
    const evs = pet.evs || {};
    const natureKey = pet.nature || 'docile'; 
    const natureStats = NATURE_DB[natureKey]?.stats || {};

    const baseInfo = POKEDEX.find(p => p.id === pet.id) || POKEDEX[0];
    const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };

    const diversity = (pet.diversityRng !== undefined) ? pet.diversityRng : ((baseInfo.id % 5) * 2 - 4);
    const fallbackSpeed = (pet.speedRng !== undefined) ? pet.speedRng : (40 + (baseInfo.id * 7 % 70));

    const baseStats = pet.customBaseStats || {
        hp: baseInfo.hp || 60,
        p_atk: Math.floor((baseInfo.atk || 50) * bias.p) + diversity,
        p_def: Math.floor((baseInfo.def || 50) * bias.p),
        s_atk: Math.floor((baseInfo.atk || 50) * bias.s) - diversity,
        s_def: Math.floor((baseInfo.def || 50) * bias.s),
        spd: baseInfo.spd || fallbackSpeed, 
        crit: 5
    };

    const getStageMult = (stage) => {
        if (!stage) return 1.0;
        const s = Math.max(-6, Math.min(6, stage));
        if (s >= 0) return (2 + s) / 2;
        return 2 / (2 + Math.abs(s));
    };

    let chiefBonus = {}; 
    if (pet.sectId && SECT_CHIEFS_CONFIG[pet.sectId]) {
        const config = SECT_CHIEFS_CONFIG[pet.sectId];
        if (currentTitle === config.title) {
            chiefBonus = config.stats; 
        }
    }
const CHARM_RANK_COLORS = {
    '万人迷': '#FF4081', // 亮粉色
    '人气王': '#FFD700', // 金色
    '可爱鬼': '#2196F3', // 蓝色
    '呆萌':   '#8BC34A', // 绿色
    '凶萌':   '#9E9E9E'  // 灰色
};
    const calc = (base, ivKey, evKey, isHp = false) => {
        const iv = ivs[ivKey] || 0;
        const ev = evs[evKey] || 0;
        
        let val = Math.floor((base + iv) * growth * shinyMod);
        if (isHp) val = Math.floor(val * 2.5); 

        if (natureStats[ivKey]) val = Math.floor(val * natureStats[ivKey]);
        
        const currentEquips = pet.equips || [null, null];
        currentEquips.forEach(equip => {
            if (!equip) return;
            let accData = null;
            if (typeof equip === 'string') accData = ACCESSORY_DB.find(c => c.id === equip);
            else if (typeof equip === 'object') accData = equip; 

            if (accData) {
                 const aType = accData.type || accData.stat; 
                 if (isHp && aType === 'HP') val += accData.val;
                 if ((ivKey === 'p_atk' || ivKey === 's_atk') && aType === 'ATK') val += accData.val;
                 if (ivKey === 's_atk' && aType === 'SATK') val += accData.val;
                 if ((ivKey === 'p_def' || ivKey === 's_def') && aType === 'DEF') val += accData.val;
                 if (ivKey === 's_def' && aType === 'SDEF') val += accData.val;
                 if (ivKey === 'spd' && aType === 'SPD') val += accData.val;
            }
        });

        val += ev;

        if (chiefBonus[ivKey]) {
            val = Math.floor(val * chiefBonus[ivKey]);
        }

        // ▼▼▼ [新增] 特性面板修正 ▼▼▼
        const trait = TRAIT_DB[pet.trait];
        if (trait && trait.type === 'STAT') {
            // 大力士：物攻翻倍
            if (pet.trait === 'huge_power' && ivKey === 'p_atk') val = Math.floor(val * 2);
            // 毅力：异常状态下物攻1.5倍
            if (pet.trait === 'guts' && ivKey === 'p_atk' && status) val = Math.floor(val * 1.5);
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        if (!isHp && stages && stages[ivKey] !== undefined) {
            val = Math.floor(val * getStageMult(stages[ivKey]));
        }

        if (status === 'PAR' && ivKey === 'spd') val = Math.floor(val * 0.5); 
        if (status === 'BRN' && ivKey === 'p_atk') val = Math.floor(val * 0.5); 

        return val;
    };

    let finalCrit = Math.floor((baseStats.crit||5) + (ivs.crit||0) + (evs.crit||0) + (pet.level * 0.2));
    if (chiefBonus.crit) finalCrit += chiefBonus.crit;
    (pet.equips||[]).forEach(equip => {
      if (!equip) return;
      const accData = typeof equip === 'string' ? ACCESSORY_DB.find(c=>c.id===equip) : equip;
      if (accData && (accData.type||accData.stat) === 'CRIT') finalCrit += accData.val;
    });

    const sectId = pet.sectId || 1;
    const sectLv = pet.sectLevel || 1;
    let finalSpd = calc(baseStats.spd, 'spd', 'spd');
    
    if (sectId === 3) {
        finalSpd = Math.floor(finalSpd * (1 + (sectLv * 0.02))); 
    }

    if (pet.fruitTransformed && pet.fruitEffects?.spdMult) {
        finalSpd = Math.floor(finalSpd * pet.fruitEffects.spdMult);
    }

    return {
      maxHp: calc(baseStats.hp, 'hp', 'maxHp', true),
      p_atk: calc(baseStats.p_atk, 'p_atk', 'p_atk'),
      p_def: calc(baseStats.p_def, 'p_def', 'p_def'),
      s_atk: calc(baseStats.s_atk, 's_atk', 's_atk'),
      s_def: calc(baseStats.s_def, 's_def', 's_def'),
      spd:   finalSpd,
      crit:  finalCrit,
      atk: calc(baseStats.p_atk, 'p_atk', 'p_atk'), 
      def: calc(baseStats.p_def, 'p_def', 'p_def')
    };
  }

  // ==========================================
  // [新增] 启动门派首席挑战
  // ==========================================
  const startSectChallenge = (sectId) => {
      const config = SECT_CHIEFS_CONFIG[sectId];
      const sectInfo = SECT_DB[sectId];

      if (party.length < 3) {
          alert("⚠️ 门派试炼非常危险，请至少携带 3 只精灵！");
          return;
      }

      if (confirm(`⚔️ 挑战【${sectInfo.name}】首席？...`)) {
      
      const enemyParty = [];
      const teamIds = SECT_TEAMS[sectId] || []; // 获取固定阵容

      // 遍历阵容ID生成精灵
      teamIds.forEach((petId, idx) => {
          const isAce = idx === 0; // 第一个是王牌
          const level = isAce ? 100 : 95; // 王牌100级，随从95级
          
          const pet = createPet(petId, level, true, isAce); // 王牌可能是闪光
          pet.sectId = parseInt(sectId);
          pet.sectLevel = isAce ? 10 : 8;
          
          if (isAce) pet.name = `[首席] ${pet.name}`;
          
          enemyParty.push(pet);
      });


          // 启动战斗
          startBattle({ 
              id: 8000 + sectId, // 特殊ID段
              name: `${config.title} ${config.name}`, 
              customParty: enemyParty,
              drop: 10000 // 高额金币奖励
          }, 'sect_challenge');
      }
  };
    // ==========================================
  // [新增] 打开门派阵容详情
  // ==========================================
  const openSectTeamDetail = (sectId) => {
      const teamIds = SECT_TEAMS[sectId] || [];
      const sectInfo = SECT_DB[sectId];
      
      // 模拟生成敌方配置 (与战斗逻辑一致)
      const previewTeam = teamIds.map((id, idx) => {
          const isAce = idx === 0;
          const level = isAce ? 100 : 95; // 首席100级，随从95级
          
          // 创建临时对象用于展示
          const pet = createPet(id, level, true, isAce); 
          pet.sectId = sectId;
          pet.sectLevel = isAce ? 10 : 8; // 模拟高层心法
          if (isAce) pet.name = `[首席] ${pet.name}`;
          
          return pet;
      });

      setViewSectTeam({
          name: sectInfo.name,
          color: sectInfo.color,
          team: previewTeam
      });
  };

   // ==========================================
  // [完整版] 门派顶峰界面 (含阵容预览与点击交互)
  // ==========================================
  const renderSectSummit = () => {
    return (
      <div className="screen" style={{background: '#121212', color: '#fff', display:'flex', flexDirection:'column'}}>
               {/* 顶部导航 - [修正] 移除 glass-panel，强制深色背景以适配白字 */}
        <div className="nav-header" style={{
            borderBottom:'1px solid #333', 
            background: '#1e1e1e', // 🟢 强制深色背景 (解决白底看不见字的问题)
            padding: '15px 20px',  // 增加一点内边距
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'sticky', top: 0, zIndex: 10 // 保持在顶部
        }}>
          <button className="btn-back" onClick={() => setView('grid_map')} style={{
              color:'#fff', 
              background: '#333',
              border: '1px solid #555',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '5px'
          }}>
              <span>🔙</span> 返回
          </button>
          
          <div className="nav-title" style={{fontSize:'18px', fontWeight:'bold', color:'#fff'}}>🏔️ 门派顶峰</div>
          
          <div className="nav-coin" style={{
              background:'#333', color:'#FFD700', 
              padding:'5px 12px', borderRadius:'20px', 
              fontSize:'12px', fontWeight:'bold', border:'1px solid #555'
          }}>
              🏆 已征服: {sectTitles.length}/10
          </div>
        </div>

        {/* 门派列表 */}
        <div style={{flex:1, overflowY:'auto', padding:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'15px'}}>
            {Object.keys(SECT_DB).map(key => {
                const id = parseInt(key);
                const sect = SECT_DB[id];
                const chief = SECT_CHIEFS_CONFIG[id];
                const teamIds = SECT_TEAMS[id] || []; // 获取该门派的阵容
                const isConquered = sectTitles.includes(id);
                // 🔥 检查当前是否激活 (已征服 且 佩戴了对应称号)
                const isActive = isConquered && currentTitle === chief.title;

                return (
                    <div key={id} style={{
                        background: isActive ? `linear-gradient(135deg, ${sect.color}66, #000)` : (isConquered ? '#2a2a2a' : '#1e1e1e'),
                        border: isActive ? `2px solid ${sect.color}` : '1px solid #333',
                        borderRadius: '12px', padding: '15px', position: 'relative', overflow: 'hidden',
                        boxShadow: isActive ? `0 0 20px ${sect.color}66` : 'none',
                        transition: '0.3s',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        {/* 背景水印 */}
                        <div style={{position:'absolute', right:'-10px', bottom:'-10px', fontSize:'80px', opacity:0.1, pointerEvents:'none'}}>
                            {sect.emoji}
                        </div>

                        {/* 卡片头部：图标与名称 */}
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'10px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div style={{fontSize:'32px', background:'#333', width:'50px', height:'50px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    {sect.emoji}
                                </div>
                                <div>
                                    <div style={{fontWeight:'bold', fontSize:'18px', color: sect.color}}>{sect.name}</div>
                                    <div style={{fontSize:'11px', color:'#aaa'}}>{sect.desc}</div>
                                </div>
                            </div>
                            {isConquered && (
                                <div style={{
                                    background: isActive ? '#00E676' : '#555', 
                                    color:'#fff', padding:'4px 8px', borderRadius:'4px', fontSize:'10px', fontWeight:'bold'
                                }}>
                                    {isActive ? '✨ 已激活' : '未佩戴'}
                                </div>
                            )}
                        </div>

                        {/* 首席信息与Buff */}
                        <div style={{fontSize:'12px', color:'#ccc', lineHeight:'1.5', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
                            <div style={{marginBottom:'4px'}}>👑 <span style={{fontWeight:'bold'}}>{chief.title}：{chief.name}</span></div>
                            <div style={{fontStyle:'italic', opacity:0.8, marginBottom:'8px'}}>"{chief.quote}"</div>
                            
                            {/* 显示 Buff 详情 */}
                            <div style={{borderTop:'1px dashed #555', paddingTop:'8px', color: isActive ? '#fff' : '#888'}}>
                                <span style={{background: sect.color, color:'#fff', padding:'1px 4px', borderRadius:'3px', fontSize:'10px', marginRight:'5px'}}>Buff</span>
                                <strong>{chief.buffName}</strong>: {chief.buffDesc}
                            </div>
                        </div>

                        {/* ▼▼▼ 守关阵容展示区 (可点击) ▼▼▼ */}
                        <div 
                            onClick={() => openSectTeamDetail(id)} 
                            style={{
                                marginBottom:'15px', cursor: 'pointer', 
                                transition: 'transform 0.2s',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                padding: '8px'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }}
                        >
                            <div style={{fontSize:'10px', color:'#666', marginBottom:'5px', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>
                                <span>守关阵容</span>
                                <span style={{color: sect.color, opacity: 0.8}}>🔍 点击查看详情</span>
                            </div>
                            <div style={{display:'flex', gap:'6px', overflowX:'auto'}}>
                                {teamIds.map((petId, idx) => {
                                    // 获取精灵信息用于展示头像
                                    const petInfo = POKEDEX.find(p => p.id === petId) || { emoji: '❓' };
                                    return (
                                        <div key={idx} title={petInfo.name} style={{
                                            width:'32px', height:'32px', borderRadius:'50%', 
                                            background:'#333', border:`1px solid ${idx===0 ? '#FFD700' : '#555'}`, // 队长金色边框
                                            display:'flex', alignItems:'center', justifyContent:'center',
                                            fontSize:'20px', flexShrink:0, position:'relative'
                                        }}>
                                            {renderAvatar(petInfo)}
                                            {idx === 0 && <div style={{position:'absolute', bottom:'-2px', right:'-2px', fontSize:'8px'}}>👑</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}

                        {/* 底部操作按钮 */}
                        <div style={{marginTop:'auto', display:'flex', gap:'10px'}}>
                            <button 
                                onClick={() => startSectChallenge(id)}
                                style={{
                                    flex:1, padding:'10px', borderRadius:'8px', border:'none', cursor:'pointer',
                                    background: isConquered ? '#333' : sect.color,
                                    color: isConquered ? '#aaa' : '#fff',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isConquered ? '再次切磋' : '发起挑战'}
                            </button>
                            
                            {/* 快捷佩戴按钮 */}
                            {isConquered && !isActive && (
                                <button 
                                    onClick={() => {
                                        setCurrentTitle(chief.title);
                                        alert(`已佩戴称号【${chief.title}】\n${sect.name}的加成已激活！`);
                                    }}
                                    style={{
                                        flex:1, padding:'10px', borderRadius:'8px', border:'none', cursor:'pointer',
                                        background: '#2196F3', color: '#fff', fontWeight: 'bold'
                                    }}
                                >
                                    佩戴称号
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  // ==========================================
  // [新增] 门派阵容详情弹窗
  // ==========================================
  const renderSectTeamModal = () => {
    if (!viewSectTeam) return null;

    return (
      <div className="modal-overlay" onClick={() => setViewSectTeam(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div onClick={e => e.stopPropagation()} style={{
            width: '90%', maxWidth: '800px', maxHeight: '80vh',
            background: '#1a1a2e', borderRadius: '20px', border: `2px solid ${viewSectTeam.color}`,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: `0 0 50px ${viewSectTeam.color}44`
        }}>
            {/* 标题栏 */}
            <div style={{
                padding: '15px 20px', background: `linear-gradient(90deg, ${viewSectTeam.color}44, #1a1a2e)`,
                borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{fontSize: '18px', fontWeight: 'bold', color: viewSectTeam.color, display:'flex', alignItems:'center', gap:'10px'}}>
                    <span>⚔️</span> {viewSectTeam.name} · 守关阵容详情
                </div>
                <button onClick={() => setViewSectTeam(null)} style={{background:'transparent', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer'}}>×</button>
            </div>

            {/* 列表区域 */}
            <div style={{flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '15px'}}>
                {viewSectTeam.team.map((pet, i) => {
                    const stats = getStats(pet);
                    const isAce = i === 0;
                    
                    return (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px',
                            border: isAce ? '1px solid #FFD700' : '1px solid #333', position: 'relative'
                        }}>
                            {isAce && <div style={{position:'absolute', top:0, right:0, background:'#FFD700', color:'#000', fontSize:'10px', fontWeight:'bold', padding:'2px 8px', borderRadius:'0 10px 0 10px'}}>ACE</div>}
                            
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <div style={{fontSize: '36px', marginRight: '10px'}}>{renderAvatar(pet)}</div>
                                <div>
                                    <div style={{fontWeight: 'bold', color: '#fff', fontSize: '14px'}}>{pet.name}</div>
                                    <div style={{display:'flex', gap:'5px', marginTop:'4px'}}>
                                        <span style={{fontSize: '10px', background: TYPES[pet.type]?.color, padding: '1px 6px', borderRadius: '4px'}}>{TYPES[pet.type]?.name}</span>
                                        {/* 修复后的等级标签 */}
<span style={{
    fontSize: '10px', 
    background: '#333', 
    color: '#fff',      // <--- 加上这一行，强制文字变白
    padding: '1px 6px', 
    borderRadius: '4px',
    fontWeight: 'bold'
}}>
    Lv.{pet.level}
</span>

                                    </div>
                                </div>
                            </div>

                            {/* 属性简略条 */}
                            <div style={{fontSize: '11px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom:'10px'}}>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>HP</span> <span style={{color:'#fff'}}>{stats.maxHp}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>攻击</span> <span style={{color:'#fff'}}>{stats.p_atk} / {stats.s_atk}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>防御</span> <span style={{color:'#fff'}}>{stats.p_def} / {stats.s_def}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between'}}><span>速度</span> <span style={{color:'#fff'}}>{stats.spd}</span></div>
                            </div>

                            {/* 技能预览 */}
                            <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'6px', padding:'6px'}}>
                                <div style={{fontSize:'10px', color:'#666', marginBottom:'4px'}}>携带技能</div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px'}}>
                                    {pet.moves.map((m, mi) => (
                                        <div key={mi} style={{fontSize:'10px', color: TYPES[m.t]?.color}}>{m.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
  };

    // ==========================================
  // [修复] 剧情对话框组件 (解决跳过战斗问题)
  // ==========================================
  const renderDialogOverlay = () => {
    if (!isDialogVisible || dialogQueue.length === 0) return null;

    const currentLine = dialogQueue[currentDialogIndex];
    const isLastLine = currentDialogIndex === dialogQueue.length - 1;

    const handleNext = () => {
      if (isLastLine) {
        // 1. 关闭对话框
        setIsDialogVisible(false);
        setDialogQueue([]);
        setCurrentDialogIndex(0);

        // 2. 处理挂起任务 (如战斗)
        if (pendingTask) {
           if (pendingTask.type === 'battle') {
              startBattle({ 
                id: 999, 
                name: pendingTask.name, 
                pool: [pendingTask.enemyId],
                eliteParty: pendingTask.eliteParty || null,
                storyTaskStep: pendingTask.step,
              }, 'story_task');
              
              setPendingTask(null);
              return; 
           } else {
              const nextStep = pendingTask.step + 1;
              setStoryStep(nextStep);
              console.log('[Story] Dialog task done, advancing to step', nextStep);
              
              const currentChapter = STORY_SCRIPT[storyProgress];
              const nextTask = currentChapter?.tasks?.find(t => t.step === nextStep);
              if(nextTask) {
                  setMapGrid(prev => {
                      const newGrid = prev.map(row => [...row]);
                      if(newGrid[nextTask.y]) newGrid[nextTask.y][nextTask.x] = 99;
                      return newGrid;
                  });
                  alert(`✅ 剧情推进！\n\n📍 下一个目标: ${nextTask.name}\n📌 位置: 坐标 (${nextTask.x}, ${nextTask.y})\n\n${nextTask.type === 'battle' ? '⚔️ 前方有敌人！' : '💬 前方有人等待...'}`);
              } else {
                  alert("🎉 本章剧情任务全部完成！\n现在可以去挑战道馆馆主了！");
              }
           }
           setPendingTask(null);
        }
        
        
      } else {
        setCurrentDialogIndex(prev => prev + 1);
      }
    };

    return (
      <div className="dialog-overlay" onClick={handleNext}>
        <div className="dialog-box">
          <div className="dialog-header">
             <span className="dialog-name">{currentLine.name}</span>
          </div>
          <div className="dialog-text">{currentLine.text}</div>
          <div className="dialog-hint">▼ 点击继续</div>
        </div>
      </div>
    );
  };

 const getMoveCategory = (type) => {
    // 物理系属性
    const physicalTypes = ['NORMAL', 'FIGHT', 'FLYING', 'GROUND', 'ROCK', 'BUG', 'GHOST', 'POISON', 'STEEL'];
    // 特殊系属性 (其余均为特殊)
    return physicalTypes.includes(type) ? 'physical' : 'special';
  };
  
  const handleItemUseOnPet = (petIdx) => {
    if (!usingItem) return;
    
    const newParty = [...party];
    const pet = newParty[petIdx];
    if (!pet) { alert("无效的精灵序号！"); return; }
    const stats = getStats(pet);
    let consumed = false;
    let msg = "";

    // --- 进化石逻辑 (保持不变) ---
        // ... 在 handleItemUseOnPet 函数内部 ...
    // --- 进化石逻辑 ---
    if (usingItem.category === 'stone') {
        const stoneId = usingItem.id;
        const rules = STONE_EVO_RULES[pet.id];
        
        if (rules && rules[stoneId]) {
            const targetId = rules[stoneId];
            const targetPetInfo = POKEDEX.find(p => p.id === targetId);
            
            if (targetPetInfo) {
                // 1. 扣除石头
                setInventory(prev => ({...prev, stones: {...prev.stones, [stoneId]: prev.stones[stoneId] - 1}}));
                
                // 2. 🔥 触发动画
                setEvoAnim({
                    targetIdx: petIdx,
                    oldPet: pet,
                    newPet: targetPetInfo,
                    step: 0
                });
                
                // 3. 关闭背包界面，让玩家看动画
                setUsingItem(null);
                setTeamMode(false); 
                return; 
            }
        } else {
            alert("它似乎不喜欢这个石头。");
            return;
        }
    }

    // --- 药品逻辑 (修改部分) ---
    if (usingItem.category === 'meds') {
        const med = usingItem.data;
        if (!med || !med.type) { alert("该物品数据异常，无法使用。"); return; }
        if (med.type === 'REVIVE') {
            if (pet.currentHp > 0) { alert("它还很精神呢，不需要复活！"); return; }
            const healAmt = Math.floor(stats.maxHp * med.val);
            pet.currentHp = healAmt;
            consumed = true;
            msg = `${pet.name} 复活了！恢复了 ${healAmt} 点体力！`;
        } 
        // 普通药
        else {
            if (pet.currentHp <= 0) { alert("它已经晕厥了，无法使用这个药物！\n请使用【活力块】或【活力星】。"); return; }
            
            if (med.type === 'HP') {
                if (pet.currentHp >= stats.maxHp) { alert("体力已满！"); return; }
                const heal = med.val === 9999 ? stats.maxHp : med.val;
                pet.currentHp = Math.min(stats.maxHp, pet.currentHp + heal);
                consumed = true;
                msg = `恢复了体力！`;
            } else if (med.type && med.type.includes('PP')) {
                 pet.moves.forEach(m => m.pp = m.maxPP || 15);
                 consumed = true;
                 msg = `所有技能 PP 已恢复！`;
            } else if (med.type === 'STATUS') {
                 // 简单的状态药逻辑，假设非战斗状态下只清空 status 字段
                 // 实际上非战斗状态很少有持续的异常状态(除了中毒)，这里简单处理
                 if(pet.status) {
                     pet.status = null;
                     consumed = true;
                     msg = `异常状态已治愈！`;
                 } else {
                     alert("它很健康，没有异常状态。");
                     return;
                 }
            } else {
                 alert("该药物暂无效果或不适用。");
                 return;
            }
        }
        
        if (consumed) {
            if (med.id === 'berry') {
                setInventory(prev => ({...prev, berries: Math.max(0, (prev.berries || 0) - 1)}));
            } else {
                setInventory(prev => ({...prev, meds: {...prev.meds, [med.id]: (prev.meds[med.id] || 0) - 1}}));
            }
            pet.intimacy = Math.min(255, (pet.intimacy || 0) + 2);
            msg += ` (亲密度 +2)`;
        }
    }
    // --- 技能书 (TM) ---
    else if (usingItem.category === 'tm') {
        if (pet.currentHp <= 0) { alert("晕厥的精灵无法学习技能！"); return; }
        const tm = usingItem.data;
        if (!tm) { alert("技能书数据异常！"); return; }
        if (pet.type !== tm.type && pet.secondaryType !== tm.type) {
            alert(`❌ 无法学习！属性不匹配。`); return;
        }
        if ((pet.moves || []).some(m => m.name === tm.name)) {
            alert("已经学会了这个技能！"); return;
        }
        const newMove = { name: tm.name, p: tm.p, t: tm.type, pp: tm.pp, maxPP: tm.pp, desc: tm.desc };
        if (pet.moves.length < 4) {
            pet.moves.push(newMove);
            consumed = true;
            msg = `📖 ${pet.name} 学会了 [${tm.name}]!`;
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: prev.tms[tm.id] - 1}}));
        } else {
            pet.pendingLearnMove = newMove;
            setParty(newParty);
            setLearningPetIdx(petIdx);
            setPendingMove(newMove);
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: prev.tms[tm.id] - 1}}));
            setUsingItem(null);
            setView('move_forget');
            return;
        }
    }
    // --- 属性增强 ---
    else if (usingItem.category === 'growth') {
        if (pet.currentHp <= 0) { alert("晕厥的精灵无法使用！"); return; }
        const item = usingItem.data;
        if (!item) { alert("道具数据异常！"); return; }
      
        if (item.id === 'max_candy') {
            if (pet.level >= 100) { alert("它已经达到等级上限了！"); return; }
            
            pet.level = 100;
            pet.exp = 0;
            pet.nextExp = 999999; 
            
            const newStats = getStats(pet);
            pet.currentHp = newStats.maxHp; 
            
            consumed = true;
            msg = `不可思议！${pet.name} 瞬间升到了 Lv.100！`;
            setInventory(prev => ({...prev, [item.id]: prev[item.id] - 1}));
        } else {
            if (!pet.evs) pet.evs = {};
            if (!pet.evs[item.stat]) pet.evs[item.stat] = 0;
            pet.evs[item.stat] += item.val;
            if (item.stat === 'maxHp') pet.currentHp += item.val;
            consumed = true;
            msg = `${pet.name} 的能力提升了！`;
            setInventory(prev => ({...prev, [item.id]: prev[item.id] - 1}));
        }
        
        // ▼▼▼ [新增] 增强剂也增加亲密度 ▼▼▼
        if(consumed) {
            pet.intimacy = Math.min(255, (pet.intimacy || 0) + 3); // 贵重物品加更多
            msg += ` (亲密度 +3)`;
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    }

    if (consumed) {
        setParty(newParty);
        alert(`✅ 使用成功！\n${msg}`);
        
        let remaining = 0;
        if (usingItem.category === 'meds') {
            remaining = usingItem.id === 'berry' ? (inventory.berries || 0) - 1 : (inventory.meds[usingItem.id] || 0) - 1;
        }
        else if (usingItem.category === 'tm') remaining = (inventory.tms[usingItem.id] || 0) - 1;
        else if (usingItem.category === 'stone') remaining = ((inventory.stones || {})[usingItem.id] || 0) - 1;
        else if (usingItem.category === 'growth') remaining = (inventory[usingItem.id] || 0) - 1;
        
        if (remaining <= 0) {
            setUsingItem(null);
            setView('bag');
        }
    }
  };

  // ==========================================
  // [新增] 生成随机技能装备
  // ==========================================
  const createUniqueEquip = (baseId) => {
    const base = RANDOM_EQUIP_DB.find(i => i.id === baseId);
    if (!base) return null;

    // 随机抽取一个技能 (过滤掉太弱的，威力<40且非变化技能排除)
    const validSkills = allSkills.filter(s => s.category === 'status' || s.p >= 40);
    const randomSkill = _.sample(validSkills);

    return {
      ...base,
      uid: Date.now() + Math.random(), // 唯一标识，允许拥有多个同名装备
      isUnique: true, // 标记为特殊装备
      extraSkill: randomSkill, // 附带的技能数据
      // 动态生成名字，例如：[喷射火焰] 古老卷轴
      displayName: `[${randomSkill.name}] ${base.name}`
    };
  };

  // ==========================================
  // [核心修复] 创建精灵 (含特性/亲密度/宠物风魅力评级)
  // ==========================================
  function createPet(dexId, level, isBoss = false, forceShiny = false) {
    let finalId = dexId;

    // --- 1. 向下回溯 (De-evolution) ---
    while (true) {
        const preForm = POKEDEX.find(p => p.evo === finalId);
        if (!preForm) break;
        if (level < preForm.evoLvl) {
            finalId = preForm.id;
        } else {
            break;
        }
    }

    // --- 2. 向上进化 (Evolution) ---
    for(let k=0; k<5; k++) {
        const info = POKEDEX.find(p => p.id === finalId);
        if (!info) break; 
        if (info.evo && level >= info.evoLvl) {
            finalId = info.evo; 
        } else {
            break; 
        }
    }

    const base = POKEDEX.find(p => p.id === finalId) || POKEDEX[0];
    const isShiny = forceShiny || (!isBoss && Math.random() < 0.01);
    
    const randIV = () => Math.floor(Math.random() * 32); 
    const ivs = {
        hp: randIV(), p_atk: randIV(), p_def: randIV(),
        s_atk: randIV(), s_def: randIV(), spd: randIV(),
        crit: Math.floor(Math.random() * 6) 
    };

    const natureKeys = Object.keys(NATURE_DB);
    const randomNature = natureKeys[Math.floor(Math.random() * natureKeys.length)];
    const natureData = NATURE_DB[randomNature];
    const expMod = natureData.exp || 1.0;

    const diversityRng = Math.floor(Math.random() * 9) - 4; 
    const speedRng = Math.floor(Math.random() * 71) + 40;

    const sectId = Math.floor(Math.random() * 12) + 1; 
    let autoSectLv = Math.floor(level / 10) + 1;
    if (isBoss || isShiny) autoSectLv += 2;
    const sectLevel = Math.max(1, Math.min(10, autoSectLv));

    // --- [新增] 特性 (Trait) ---
    const traitKeys = Object.keys(TRAIT_DB);
    const randomTrait = traitKeys[Math.floor(Math.random() * traitKeys.length)];
    
    // --- [新增] 魅力值 (Charm) 与 宠物风评级 (Rank) ---
    // 1. 获取属性基准分
    const typeBaseCharm = TYPE_CHARM_BASE[base.type] || 30;
    
    // 2. 随机波动 (0-20)
    const rngCharm = Math.floor(Math.random() * 21);
    
    // 3. 特殊加成
    const shinyBonus = isShiny ? 30 : 0; 
    const bossBonus = isBoss ? 20 : 0;   
    
    // 4. 计算总和 (上限100)
    const charmVal = Math.min(100, typeBaseCharm + rngCharm + shinyBonus + bossBonus);

    // 5. 计算魅力评级 (宠物风格)
    let charmRank = '凶萌'; // 默认 D级
    if (charmVal >= 90) charmRank = '万人迷';      // S级
    else if (charmVal >= 75) charmRank = '人气王'; // A级
    else if (charmVal >= 50) charmRank = '可爱鬼'; // B级
    else if (charmVal >= 25) charmRank = '呆萌';   // C级
    
    // --- [新增] 亲密度 (Intimacy) ---
    const intimacy = 70; 

    const curseTalent = generateCurseTalent();

    let newPet = {
      ...base,
      uid: Date.now() + Math.random(),
      level,
      exp: 0,
      nextExp: Math.floor(level * 100 * expMod),
      nature: randomNature,
      equip: null,
      equips: [null, null],
      moves: [], 
      isBoss,
      isShiny,
      ivs, 
      evs: {},
      diversityRng, 
      speedRng,
      sectId: sectId,
      sectLevel: sectLevel,
      trait: randomTrait,
      charm: charmVal,
      charmRank: charmRank,
      intimacy: intimacy,
      curseTalent: curseTalent,
    };

    // --- 技能生成逻辑 ---
    const moves = [];
    const maxSkillIndex = Math.floor(level / 5);
    const startIdx = Math.max(0, maxSkillIndex - 3);
    
    for (let i = startIdx; i <= maxSkillIndex; i++) {
        const moveData = getMoveByLevel(base.type, i * 5); 
        moves.push(moveData);
    }

    const hasDamageMove = moves.some(m => m.p > 0);
    if (!hasDamageMove) {
        let fallbackMove = { name: '撞击', p: 40, t: 'NORMAL', pp: 35, maxPP: 35, acc: 100, desc: '用身体猛撞对手的基本攻击' };
        const typeSkills = SKILL_DB[base.type];
        if (typeSkills && typeSkills.length > 0) {
            const basicStab = typeSkills.find(s => s.p > 0);
            if (basicStab) {
                fallbackMove = {
                    name: basicStab.name,
                    p: basicStab.p,
                    t: base.type, 
                    pp: basicStab.pp || 35,
                    maxPP: basicStab.pp || 35,
                    acc: basicStab.acc || 100,
                    effect: basicStab.effect,
                    desc: basicStab.desc || ''
                };
            }
        }
        if (moves.length < 4) {
            moves.push(fallbackMove);
        } else {
            moves[0] = fallbackMove;
        }
    }

    newPet.moves = moves;

    const stats = getStats(newPet);
    newPet.currentHp = stats.maxHp;

    return newPet;
  }

// ... 在其他的 useEffect 附近添加 ...

// 🎵 [修复] 全局交互监听：解决浏览器禁止自动播放的问题
useEffect(() => {
  const unlockAudioContext = () => {
    if (audioRef.current) {
      // 尝试恢复播放（如果处于暂停状态且有源）
      if (audioRef.current.paused && audioRef.current.src) {
        audioRef.current.play().catch(e => console.log("等待音频加载...", e));
      }
    }
    // 只要用户交互过一次，就移除监听，避免性能浪费
    // 注意：如果你希望每次点击都尝试恢复，可以不移除，但通常一次就够了
    // window.removeEventListener('click', unlockAudioContext);
    // window.removeEventListener('keydown', unlockAudioContext);
  };

  window.addEventListener('click', unlockAudioContext);
  window.addEventListener('keydown', unlockAudioContext);

  return () => {
    window.removeEventListener('click', unlockAudioContext);
    window.removeEventListener('keydown', unlockAudioContext);
  };
}, []);

 // 滚动视图的核心逻辑
  useEffect(() => {
    if (mapContainerRef.current) {
      const TILE_SIZE = 40; 
      const container = mapContainerRef.current;
      const targetScrollX = (playerPos.x * TILE_SIZE) - (container.clientWidth / 2) + (TILE_SIZE / 2);
      const targetScrollY = (playerPos.y * TILE_SIZE) - (container.clientHeight / 2) + (TILE_SIZE / 2);
      
      container.scrollTo({
        left: targetScrollX,
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  }, [playerPos]);

     

// ----------------------------------------------------------------
// [升级版] 0.5 雷达图组件 (支持自定义文字颜色)
// ----------------------------------------------------------------
const RadarChart = ({ stats, color = '#2196F3', size = 140, textColor = "rgba(255,255,255,0.9)" }) => {
  const maxVal = 150;
  const center = size / 2;
  const radius = (size / 2) - 30; 
  
  const data = [
    stats.maxHp, stats.p_atk, stats.p_def, 
    stats.spd, stats.s_def, stats.s_atk
  ];
  
  const labels = ['HP', '物攻', '物防', '速度', '特防', '特攻'];

  const getPoint = (value, index, scale = 1) => {
    const angle = (Math.PI / 3) * index - (Math.PI / 2);
    const r = (Math.min(value, maxVal) / maxVal) * radius * scale;
    return { 
      x: center + r * Math.cos(angle), 
      y: center + r * Math.sin(angle) 
    };
  };

  const pointsString = data.map((v, i) => {
    const p = getPoint(v, i);
    return `${p.x},${p.y}`;
  }).join(' ');

  // 动态计算网格颜色：如果文字是深色，网格也深一点
  const gridColor = textColor.startsWith('#') && textColor !== '#fff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';

  return (
    <div className="radar-chart-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{overflow: 'visible'}}>
        {/* 网格 */}
        {[0.33, 0.66, 1.0].map((level, idx) => (
           <polygon 
             key={idx} 
             points={data.map((_, i) => {
               const p = getPoint(maxVal, i, level);
               return `${p.x},${p.y}`;
             }).join(' ')} 
             fill="none" 
             stroke={gridColor}
             strokeWidth="1" 
             strokeDasharray={level < 1 ? "2,2" : ""}
           />
        ))}
        
        {/* 轴线 */}
        {data.map((_, i) => {
           const p = getPoint(maxVal, i);
           return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke={gridColor} strokeWidth="1" />;
        })}

        {/* 数据区域 */}
        <polygon points={pointsString} fill={color} fillOpacity="0.6" stroke={color} strokeWidth="2" />
        
        {/* 数据点 */}
        {data.map((v, i) => {
          const p = getPoint(v, i);
          return <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#fff" strokeWidth="1" />;
        })}

        {/* 文字标签 (使用传入的 textColor) */}
        {labels.map((label, i) => {
            const angle = (Math.PI / 3) * i - (Math.PI / 2);
            const r = radius + 18;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            
            return (
                <text 
                  key={i} x={x} y={y} 
                  fill={textColor} 
                  fontSize="10" fontWeight="bold"
                  textAnchor="middle" dominantBaseline="middle" 
                  style={{fontFamily: 'Arial', textShadow: textColor==='#fff'?'0 1px 2px rgba(0,0,0,0.5)':'none'}}
                >
                    {label}
                </text>
            );
        })}
      </svg>
    </div>
  );
};

   // 修改 manualSave (存档逻辑)
  const manualSave = () => {
     const dataToSave = {
       trainerName, 
       trainerAvatar, 
       gold, 
       party, 
       box, 
       accessories, 
       sectTitles,
       inventory, 
       mapProgress, 
       caughtDex, 
       completedChallenges, 
       badges, 
       viewedIntros, 
       leagueWins, 
       unlockedTitles, 
       currentTitle,
       housing,
       fruitInventory,
       achStats,
       unlockedAchs,
       storyProgress,
       storyStep,
       cafe,
     };
     localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
     setHasSave(true);
     alert("✅ 存档保存成功！");
  };
  // ==========================================
  // 成就系统 - 核心函数
  // ==========================================
  const updateAchStat = useCallback((updates) => {
    setAchStats(prev => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(updates)) {
        if (typeof v === 'function') next[k] = v(prev[k]);
        else if (typeof v === 'boolean') next[k] = v;
        else if (k.startsWith('max')) next[k] = Math.max(prev[k] || 0, v);
        else next[k] = (prev[k] || 0) + v;
      }
      return next;
    });
  }, []);

  const checkAchievements = useCallback((statsOverride) => {
    const stats = statsOverride || achStats;
    const newUnlocks = [];
    ACHIEVEMENTS.forEach(ach => {
      if (unlockedAchs.includes(ach.id)) return;
      try {
        if (ach.check(stats)) {
          newUnlocks.push(ach);
        }
      } catch (e) { /* skip broken checks */ }
    });
    if (newUnlocks.length > 0) {
      const newIds = newUnlocks.map(a => a.id);
      setUnlockedAchs(prev => [...prev, ...newIds]);
      let totalGoldReward = 0;
      newUnlocks.forEach(ach => {
        if (ach.reward) {
          if (ach.reward.gold) totalGoldReward += ach.reward.gold;
          if (ach.reward.title) unlockTitle(ach.reward.title);
        }
      });
      if (totalGoldReward > 0) setGold(g => g + totalGoldReward);
      setAchNotification(newUnlocks[0]);
      if (newUnlocks.length > 1) {
        let idx = 1;
        const showNext = () => {
          if (idx < newUnlocks.length) {
            setAchNotification(newUnlocks[idx]);
            idx++;
            setTimeout(showNext, 2500);
          }
        };
        setTimeout(showNext, 2500);
      }
      setTimeout(() => setAchNotification(null), 2500 * newUnlocks.length + 500);
    }
  }, [achStats, unlockedAchs]);

  useEffect(() => {
    checkAchievements();
  }, [achStats]);

  const syncAchStats = useCallback(() => {
    setAchStats(prev => {
      const next = { ...prev };
      next.dexCount = caughtDex.length;
      next.badgeCount = badges.length;
      next.leagueWins = leagueWins;
      next.sectChiefsDefeated = (sectTitles || []).length;
      next.uniqueFruits = [...new Set(fruitInventory || [])].length;
      next.challengesCompleted = (completedChallenges || []).filter(c => c && c.startsWith && c.startsWith('c')).length;
      next.achievementCount = unlockedAchs.length;
      const allPets = [...(party || []), ...(box || [])];
      next.maxPetLevel = Math.max(0, ...allPets.map(p => p?.level || 0));
      if (party && party.length > 0) {
        next.starterLevel = party[0]?.level || 0;
      }
      const team = party || [];
      next.eliteTeamReady = team.length >= 6 && team.every(p => (p?.level || 0) >= 50);
      const types = new Set();
      (caughtDex || []).forEach(id => {
        const p = POKEDEX.find(pk => pk.id === id);
        if (p) types.add(p.type);
      });
      next.typesCollected = types.size;
      next.houseLevel = (['tent','cabin','house','mansion','castle'].indexOf(housing?.houseType || 'tent'));
      next.furnitureCount = (housing?.furniture || []).length;
      next.mapsVisited = Object.keys(mapProgress || {}).length;
      // 隐藏成就：队伍属性多样性
      const partyTypes = new Set((party || []).map(p => p?.type).filter(Boolean));
      next.partyTypeDiv = partyTypes.size;
      // 隐藏成就：全队闪光
      next.fullShinyTeam = (party || []).length >= 6 && (party || []).every(p => p?.isShiny || p?.isFusedShiny);
      // 队伍门派多样性
      const partySects = new Set((party || []).map(p => p?.sect).filter(Boolean));
      next.partySectDiv = partySects.size;
      // 50级以上精灵数量
      const allP = [...(party || []), ...(box || [])];
      next.lv50PetCount = allP.filter(p => (p?.level || 0) >= 50).length;
      return next;
    });
  }, [caughtDex, badges, leagueWins, sectTitles, fruitInventory, completedChallenges, unlockedAchs, party, box, housing, mapProgress]);

  useEffect(() => {
    syncAchStats();
  }, [caughtDex, badges, leagueWins, sectTitles, fruitInventory, completedChallenges, party, box, housing, mapProgress]);

    // [新增] 解锁称号通用函数
  const unlockTitle = (title) => {
      if (!unlockedTitles.includes(title)) {
          setUnlockedTitles(prev => [...prev, title]);
          // 播放特效或提示
          addGlobalLog(`🏆 获得新称号：[${title}]`);
          alert(`🎉 恭喜！你达成了隐藏条件！\n获得新称号：【${title}】\n(请在训练家卡片中佩戴)`);
      }
  };

  // [新增] 检查图鉴类称号 (每次捕获/进化后调用)
  const checkDexTitles = (currentCount) => {
      if (currentCount >= 50) unlockTitle('新手收藏家');
      if (currentCount >= 100) unlockTitle('图鉴达人');
      if (currentCount >= 230) unlockTitle('博学大师');
      if (currentCount >= 380) unlockTitle('全图鉴霸主');
  };

  const handleStartGame = () => {
    if (hasSave) {
      setView('world_map');
    } else {
      setView('name_input'); 
    }
  };
    // 打开装备选择弹窗
  const openEquipModal = (petIdx, slotIdx) => {
    setTargetEquipSlot({ petIdx, slotIdx });
    setEquipModalOpen(true);
  };

    const handleEquipAccessory = (accOrId) => {
    const { petIdx, slotIdx } = targetEquipSlot;
    const newParty = [...party];
    const pet = newParty[petIdx];
    if (!pet.equips) pet.equips = [null, null];

    const otherSlot = slotIdx === 0 ? 1 : 0;
    const otherEquip = pet.equips[otherSlot];
    if (typeof accOrId === 'string' && otherEquip === accOrId) {
      alert('❌ 同一只精灵不能装备两个相同的饰品！'); return;
    }
    if (typeof accOrId === 'object' && typeof otherEquip === 'object' && accOrId.uid === otherEquip?.uid) {
      alert('❌ 同一只精灵不能装备两个相同的饰品！'); return;
    }

    const oldEquip = pet.equips[slotIdx];
    const newAccessories = [...accessories];

    // 1. 卸下旧装备 (放回背包)
    if (oldEquip) {
        newAccessories.push(oldEquip);
    }

    // 2. 从背包移除新装备
    // 如果是对象(唯一装备)，通过 uid 查找；如果是字符串(普通饰品)，通过值查找
    let accIndex = -1;
    if (typeof accOrId === 'object') {
        accIndex = newAccessories.findIndex(a => a.uid === accOrId.uid);
    } else {
        accIndex = newAccessories.indexOf(accOrId);
    }
    
    if (accIndex > -1) {
        newAccessories.splice(accIndex, 1);
    }

    // 3. 装备
    pet.equips[slotIdx] = accOrId;

    setParty(newParty);
    setAccessories(newAccessories);
    setEquipModalOpen(false);
  };


  // 卸下当前饰品
  const handleUnequip = () => {
    const { petIdx, slotIdx } = targetEquipSlot;
    const newParty = [...party];
    const pet = newParty[petIdx];
    
    if (!pet.equips || !pet.equips[slotIdx]) {
        setEquipModalOpen(false);
        return;
    }

    const oldAccId = pet.equips[slotIdx];
    
    // 放回背包
    setAccessories(prev => [...prev, oldAccId]);
    // 清空槽位
    pet.equips[slotIdx] = null;

    setParty(newParty);
    setEquipModalOpen(false);
  };

    // ==========================================
  // [修改] 核心融合逻辑 
  // 1. 种族值混合: Min*0.9 ~ Max*1.1 之间随机
  // 2. 等级: (父+母)/2
  // 3. IV: 随机生成
  // ==========================================
  const processFusion = () => {
    if (fusionSlots[0] === null || fusionSlots[1] === null) {
        alert("请先选择两只精灵进行融合！");
        return;
    }
    if (gold < 500) {
        alert("金币不足！融合需要 500 金币。");
        return;
    }
    if (party.length < 2) {
        alert("队伍中精灵数量不足。");
        return;
    }

    const p1Idx = fusionSlots[0];
    const p2Idx = fusionSlots[1];
    const p1 = party[p1Idx];
    const p2 = party[p2Idx];

    if (p1.uid === p2.uid) {
        alert("不能融合同一只精灵！");
        return;
    }

    // 1. 扣除金币
    setGold(g => g - 500);

    // 2. 决定基础形象 (50% 概率)
    const baseParent = Math.random() < 0.5 ? p1 : p2;
    
    // 3. 决定是否异色 (20%)
    const isFusedShiny = Math.random() < 0.2;

    // 4. 决定是否双属性 (20%)
    const isDualType = Math.random() < 0.2;
    const primaryType = baseParent.type;
    let secondaryType = null;
    if (isDualType) {
        const otherParent = baseParent.uid === p1.uid ? p2 : p1;
        if (otherParent.type !== primaryType) {
            secondaryType = otherParent.type;
        }
    }

    // 5. 种族值混合算法
    // 获取父母当前的种族值 (如果是融合过的，取 customBaseStats；如果是原版，查表)
    const getBase = (pet) => pet.customBaseStats || (POKEDEX.find(d=>d.id===pet.id) || POKEDEX[0]);
    const b1 = getBase(p1);
    const b2 = getBase(p2);

    const mixStat = (key) => {
        // 兼容处理：有些数据源可能只有 atk/def 字段
        const v1 = b1[key] || (key.includes('atk') ? b1.atk : b1.def) || 50;
        const v2 = b2[key] || (key.includes('atk') ? b2.atk : b2.def) || 50;
        
        // 核心规则：Min*0.9 ~ Max*1.1
        const min = Math.min(v1, v2) * 0.9;
        const max = Math.max(v1, v2) * 1.1;
        return Math.floor(min + Math.random() * (max - min));
    };

    const newBaseStats = {
        hp: mixStat('hp'),
        p_atk: mixStat('p_atk'),
        p_def: mixStat('p_def'),
        s_atk: mixStat('s_atk'),
        s_def: mixStat('s_def'),
        spd: mixStat('spd'),
        crit: Math.max(b1.crit||5, b2.crit||5) // 暴击率取较高的那个
    };

    // 6. 技能融合 (随机取4个)
    const poolMoves = [...p1.moves, ...p2.moves];
    const uniqueMoves = _.uniqBy(poolMoves, 'name');
    const finalMoves = _.sampleSize(uniqueMoves, 4);

    // 7. 等级计算 (取平均值)
    const avgLevel = Math.floor((p1.level + p2.level) / 2);
    
    // 计算该等级所需的升级经验
    const natureData = NATURE_DB[baseParent.nature || 'docile'];
    const expMod = natureData?.exp || 1.0;
    const newNextExp = Math.floor(avgLevel * 100 * expMod);

    // 定义随机 IV
    const randIV = () => Math.floor(Math.random() * 32); 

    // 8. 生成新精灵对象
    const newPet = {
        ...baseParent, 
        uid: Date.now(),
        name: `融合·${baseParent.name}`,
        
        // 设定为平均等级
        level: avgLevel, 
        exp: 0,
        nextExp: newNextExp,
        
        moves: finalMoves,
        customBaseStats: newBaseStats, // 写入混合后的种族值
        secondaryType: secondaryType,
        isFusedShiny: isFusedShiny,
        isShiny: isFusedShiny,
        equip: null,
        
        // 随机生成个体值
        ivs: { 
            hp: randIV(), p_atk: randIV(), p_def: randIV(), 
            s_atk: randIV(), s_def: randIV(), spd: randIV(), 
            crit: Math.floor(Math.random() * 10) 
        },
        evs: {}
    };

    // 9. 重新计算面板属性
    // getStats 会使用 newPet.level (平均等级) 和 newBaseStats (新种族值) 来计算
    const finalStats = getStats(newPet);
    newPet.currentHp = finalStats.maxHp; // 满血复活

    // 10. 更新队伍
    const remainingParty = party.filter((_, i) => i !== p1Idx && i !== p2Idx);
    const newParty = [newPet, ...remainingParty]; 

    setParty(newParty);
    setFusionSlots([null, null]);
    setFusionMode(false);
    updateAchStat({ totalFusions: 1 });

    // 11. 提示信息
    let msg = `🌀 融合成功！\n获得了 Lv.${newPet.level} ${newPet.name}！`;
    if (isFusedShiny) msg += "\n✨ 发生突变！是异色闪光精灵！";
    if (isDualType) msg += `\n⚡ 觉醒了双重属性：${TYPES[primaryType].name} / ${TYPES[secondaryType].name}`;
    
    alert(msg);
    setAnimEffect({ type: 'EVOLUTION', target: 'player' }); 
    setTimeout(() => setAnimEffect(null), 1500);
  };
  // --- 融合逻辑处理函数 (使用完整混合算法) ---
  const handleFusion = () => {
    if (!fusionParent || !fusionChild) return;
    if (gold < 500) { alert("金币不足！"); return; }
    
    const p1 = fusionParent;
    const p2 = fusionChild;
    if (p1.uid === p2.uid) { alert("不能融合同一只精灵！"); return; }

    setGold(g => g - 500);

    const baseParent = Math.random() < 0.5 ? p1 : p2;
    const otherParent = baseParent.uid === p1.uid ? p2 : p1;
    
    const isFusedShiny = Math.random() < 0.2;

    const isDualType = Math.random() < 0.2;
    let secondaryType = null;
    if (isDualType && otherParent.type !== baseParent.type) {
        secondaryType = otherParent.type;
    }

    const getBase = (pet) => pet.customBaseStats || (POKEDEX.find(d=>d.id===pet.id) || POKEDEX[0]);
    const b1 = getBase(p1);
    const b2 = getBase(p2);
    const mixStat = (key) => {
        const v1 = b1[key] || (key.includes('atk') ? b1.atk : b1.def) || 50;
        const v2 = b2[key] || (key.includes('atk') ? b2.atk : b2.def) || 50;
        const min = Math.min(v1, v2) * 0.9;
        const max = Math.max(v1, v2) * 1.1;
        return Math.floor(min + Math.random() * (max - min));
    };
    const newBaseStats = {
        hp: mixStat('hp'), p_atk: mixStat('p_atk'), p_def: mixStat('p_def'),
        s_atk: mixStat('s_atk'), s_def: mixStat('s_def'), spd: mixStat('spd'),
        crit: Math.max(b1.crit||5, b2.crit||5)
    };

    const poolMoves = [...(p1.moves||[]), ...(p2.moves||[])];
    const uniqueMoves = _.uniqBy(poolMoves, 'name');
    const finalMoves = _.sampleSize(uniqueMoves, 4);

    const avgLevel = Math.floor((p1.level + p2.level) / 2);
    const natureData = NATURE_DB[baseParent.nature || 'docile'];
    const newNextExp = Math.floor(avgLevel * 100 * (natureData?.exp || 1.0));

    const randIV = () => Math.floor(Math.random() * 32);
    const newPet = {
        ...baseParent,
        uid: Date.now() + Math.random(),
        name: `融合·${baseParent.name}`,
        level: avgLevel, exp: 0, nextExp: newNextExp,
        moves: finalMoves,
        customBaseStats: newBaseStats,
        secondaryType: secondaryType,
        isFusedShiny: isFusedShiny,
        isShiny: isFusedShiny,
        equip: null,
        ivs: { hp: randIV(), p_atk: randIV(), p_def: randIV(),
               s_atk: randIV(), s_def: randIV(), spd: randIV(), crit: Math.floor(Math.random()*10) },
        evs: {},
        canEvolve: false,
    };

    const finalStats = getStats(newPet);
    newPet.currentHp = finalStats.maxHp;

    const newParty = party.filter(p => p.uid !== fusionParent.uid && p.uid !== fusionChild.uid);
    newParty.push(newPet);
    setParty(newParty);
    
    setFusionParent(null);
    setFusionChild(null);

    let msg = `🧬 融合成功！\n获得了 Lv.${newPet.level} ${newPet.name}！`;
    if (isFusedShiny) msg += "\n✨ 发生突变！是异色闪光精灵！(全属性+35%)";
    if (isDualType && secondaryType) msg += `\n⚡ 觉醒了双重属性：${TYPES[baseParent.type]?.name||baseParent.type} / ${TYPES[secondaryType]?.name||secondaryType}`;
    msg += `\n📊 种族值由父母双方混合产生`;
    alert(msg);
  };

    // ==========================================
  // [重构] 基因融合实验室 (居中弹窗版)
  // ==========================================
  const renderFusion = () => {
    if (!fusionMode) return null; 
    return (
      <div className="screen fusion-screen">
        {/* 1. 全屏遮罩与居中容器 */}
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          
          {/* 2. 实验室主卡片 */}
          <div className="fusion-card-centered" style={{
              width: '420px', background: '#1a1a2e', borderRadius: '24px',
              border: '1px solid #333', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              position: 'relative', color: '#fff'
          }}>
            
            {/* 标题栏 */}
            <div style={{
                padding: '15px 20px', background: 'linear-gradient(90deg, #303f9f, #1a1a2e)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold', fontSize:'16px'}}>
                    <span style={{fontSize:'20px'}}>🧬</span> 基因融合实验室
                </div>
                <button onClick={() => setFusionMode(false)} style={{
                    background:'transparent', border:'none', color:'#aaa', fontSize:'24px', cursor:'pointer'
                }}>×</button>
            </div>

            {/* 融合槽位区 */}
            <div style={{padding: '30px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                {/* 父本 */}
                <div onClick={() => setFusionSlot('parent')} style={{
                    width: '100px', height: '100px', borderRadius: '16px',
                    border: fusionParent ? '2px solid #4CAF50' : '2px dashed #555',
                    background: fusionParent ? '#222' : 'rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: '0.2s'
                }}>
                    {fusionParent ? (
                        <>
                            <div style={{fontSize:'36px'}}>{renderAvatar(fusionParent)}</div>
                            <div style={{fontSize:'10px', marginTop:'4px', color:'#aaa'}}>{fusionParent.name}</div>
                        </>
                    ) : (
                        <span style={{color:'#555', fontSize:'12px'}}>选择父本</span>
                    )}
                </div>

                <div style={{fontSize: '24px', color: '#555', fontWeight: 'bold'}}>+</div>

                {/* 母本 */}
                <div onClick={() => setFusionSlot('child')} style={{
                    width: '100px', height: '100px', borderRadius: '16px',
                    border: fusionChild ? '2px solid #E91E63' : '2px dashed #555',
                    background: fusionChild ? '#222' : 'rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: '0.2s'
                }}>
                    {fusionChild ? (
                        <>
                            <div style={{fontSize:'36px'}}>{renderAvatar(fusionChild)}</div>
                            <div style={{fontSize:'10px', marginTop:'4px', color:'#aaa'}}>{fusionChild.name}</div>
                        </>
                    ) : (
                        <span style={{color:'#555', fontSize:'12px'}}>选择母本</span>
                    )}
                </div>
            </div>

            {/* 信息提示区 */}
            <div style={{padding: '0 20px', fontSize: '12px', color: '#ccc', lineHeight: '1.6'}}>
                <div style={{marginBottom: '8px', color: '#FFD700'}}>💰 费用: 500 金币</div>
                <div style={{background: 'rgba(255,167,38,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,167,38,0.2)'}}>
                    <div style={{color: '#FFA726', fontWeight: 'bold', marginBottom: '4px'}}>⚠️ 警告</div>
                    融合后父母将消失，生成一只全新的子代。
                </div>
                <div style={{marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div>🧬 20% 概率变异为【异色】(属性大幅增强)</div>
                    <div>⚡ 20% 概率觉醒【双属性】</div>
                </div>
            </div>

            {/* 底部按钮 */}
            <div style={{padding: '20px'}}>
                <button 
                    disabled={!fusionParent || !fusionChild || gold < 500}
                    onClick={handleFusion}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                        background: (!fusionParent || !fusionChild || gold < 500) ? '#333' : 'linear-gradient(90deg, #303f9f, #7b1fa2)',
                        color: (!fusionParent || !fusionChild || gold < 500) ? '#666' : '#fff',
                        fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                        boxShadow: (!fusionParent || !fusionChild || gold < 500) ? 'none' : '0 4px 15px rgba(123, 31, 162, 0.4)'
                    }}
                >
                    {gold < 500 ? '金币不足' : '开始融合'}
                </button>
            </div>

            {/* 队伍选择抽屉 (嵌入在卡片底部或作为覆盖层) */}
            {fusionSlot && (
                <div style={{
                    position: 'absolute', top: '60px', left: 0, right: 0, bottom: 0,
                    background: '#1a1a2e', zIndex: 10, padding: '15px',
                    display: 'flex', flexDirection: 'column', borderTop: '1px solid #333',
                    animation: 'slideUp 0.2s ease-out'
                }}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'12px', color:'#aaa'}}>
                        <span>从队伍中选择 {fusionSlot==='parent'?'父本':'母本'}:</span>
                        <span onClick={() => setFusionSlot(null)} style={{cursor:'pointer', color:'#fff'}}>取消</span>
                    </div>
                    <div style={{flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignContent: 'start'}}>
                        {party.map((p, i) => {
                            const isSelected = (fusionParent && fusionParent.uid === p.uid) || (fusionChild && fusionChild.uid === p.uid);
                            return (
                                <div key={i} onClick={() => {
                                    if (isSelected) return;
                                    if (fusionSlot === 'parent') setFusionParent(p);
                                    else setFusionChild(p);
                                    setFusionSlot(null);
                                }} style={{
                                    background: isSelected ? '#222' : '#2a2a40',
                                    borderRadius: '10px', padding: '10px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    opacity: isSelected ? 0.3 : 1, cursor: isSelected ? 'default' : 'pointer',
                                    border: '1px solid #333'
                                }}>
                                    <div style={{fontSize:'24px'}}>{renderAvatar(p)}</div>
                                    <div style={{fontSize:'10px', marginTop:'4px', color:'#fff'}}>{p.name}</div>
                                    <div style={{fontSize:'9px', color:'#666'}}>Lv.{p.level}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    );
  };
     const renderInfinityCastle = () => {
    if (!infinityState) return null;
    const { floor, status, buffs, buffOptions } = infinityState;

    return (
      <div className="screen" style={{
          background: 'linear-gradient(180deg, #1a0b2e 0%, #000 100%)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* 顶部信息 */}
        <div style={{width:'100%', padding:'20px', display:'flex', justifyContent:'space-between', background:'rgba(255,255,255,0.05)'}}>
            <div style={{fontSize:'20px', fontWeight:'bold', color:'#E040FB'}}>🏯 无限城 - 第 {floor} 层</div>
            <button onClick={() => {
                if(confirm("确定要退出吗？进度将丢失，Buff也会重置。")) {
                    // 退出时建议重置队伍状态(可选)，防止Buff带出副本
                    // 这里简单处理直接退出
                    setInfinityState(null); setView('grid_map');
                }
            }} style={{background:'transparent', border:'1px solid #666', color:'#aaa', padding:'5px 15px', borderRadius:'20px', fontSize:'12px'}}>放弃</button>
        </div>

        {/* 已获 Buff 展示栏 */}
        <div style={{width:'100%', padding:'10px', display:'flex', gap:'8px', overflowX:'auto', background:'rgba(0,0,0,0.3)'}}>
            {buffs.length === 0 && <span style={{fontSize:'12px', color:'#666', paddingLeft:'10px'}}>暂无呼吸法加成</span>}
            {buffs.map((b, i) => (
                <span key={i} style={{
                    fontSize:'10px', background:'#4A148C', color:'#E1BEE7', 
                    padding:'4px 8px', borderRadius:'4px', whiteSpace:'nowrap',
                    border:'1px solid #7B1FA2'
                }}>{b.name}</span>
            ))}
        </div>

        {/* 主体内容 */}
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
            
            {/* 1. 选门阶段 */}
            {status === 'selecting' && (
                <div style={{textAlign:'center', animation:'fadeIn 0.5s'}}>
                    <div style={{fontSize:'16px', marginBottom:'40px', color:'#ccc'}}>
                        <div style={{fontSize:'40px', marginBottom:'10px'}}>👹</div>
                        选择前进的道路...
                    </div>
                    <div style={{display:'flex', gap:'20px', justifyContent:'center'}}>
                        {/* 普通门 */}
                        <div onClick={() => startInfinityBattle('normal')} className="door-card" style={{
                            width:'140px', padding:'20px', background:'#333', borderRadius:'12px', cursor:'pointer', border:'2px solid #555'
                        }}>
                            <div style={{fontSize:'60px'}}>🚪</div>
                            <div style={{marginTop:'15px', fontWeight:'bold'}}>普通鬼气</div>
                            <div style={{fontSize:'10px', color:'#888', marginTop:'5px'}}>稳扎稳打</div>
                        </div>
                        {/* 精英门 */}
                        <div onClick={() => startInfinityBattle('hard')} className="door-card" style={{
                            width:'140px', padding:'20px', background:'#3E2723', borderRadius:'12px', cursor:'pointer', border:'2px solid #FF5252'
                        }}>
                            <div style={{fontSize:'60px', filter:'drop-shadow(0 0 10px red)'}}>⛩️</div>
                            <div style={{marginTop:'15px', fontWeight:'bold', color:'#FF5252'}}>强烈的鬼气</div>
                            <div style={{fontSize:'10px', color:'#aaa', marginTop:'5px'}}>高风险高回报</div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Buff 选择阶段 */}
            {status === 'buff_select' && (
                <div style={{textAlign:'center', width:'90%', maxWidth:'600px', animation:'slideUp 0.5s'}}>
                    <div style={{fontSize:'24px', marginBottom:'10px', color:'#FFD700', textShadow:'0 0 10px #FFD700'}}>✨ 呼吸法领悟 ✨</div>
                    <div style={{fontSize:'12px', color:'#aaa', marginBottom:'30px'}}>通过了试炼，你的队伍变得更强了...</div>
                    
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'15px'}}>
                        {buffOptions.map((buff, i) => (
                            <div key={i} onClick={() => selectInfinityBuff(buff)} style={{
                                background:'linear-gradient(135deg, #311B92 0%, #000 100%)', 
                                padding:'25px 15px', borderRadius:'16px',
                                cursor:'pointer', border:'1px solid #7B1FA2', 
                                transition:'0.3s', position:'relative', overflow:'hidden',
                                boxShadow:'0 10px 30px rgba(0,0,0,0.5)'
                            }} 
                            onMouseOver={e=>{e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.borderColor='#E040FB'}}
                            onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#7B1FA2'}}
                            >
                                <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'10px', color:'#E1BEE7'}}>{buff.name}</div>
                                <div style={{fontSize:'12px', color:'#ccc', lineHeight:'1.5'}}>{buff.desc}</div>
                                <div style={{
                                    position:'absolute', bottom:'-10px', right:'-10px', 
                                    fontSize:'60px', opacity:0.1, pointerEvents:'none'
                                }}>⚔️</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    );
  };
  // ==========================================
  // 9. [新增] 锁定界面
  // ==========================================
  // ==========================================
  // 精灵家园系统 - 完整UI
  // ==========================================
  const renderHousing = () => {
    const currentHouseDef = HOUSE_TYPES.find(h => h.id === housing.currentHouse);
    const nextHouseIdx = currentHouseDef ? HOUSE_TYPES.indexOf(currentHouseDef) + 1 : 0;
    const nextHouseDef = HOUSE_TYPES[nextHouseIdx] || null;
    const placedFurniture = (housing.furniture || []).filter(f => f.placed);
    const unplacedFurniture = (housing.furniture || []).filter(f => !f.placed);
    const benefits = calcResidentBenefits(placedFurniture);
    const furnitureScore = calcHouseScore(placedFurniture);
    const treasureScore = (housing.treasures || []).reduce((s, tid) => {
      for (const col of TREASURE_COLLECTIONS) {
        const item = col.items.find(i => i.id === tid);
        if (item) { s += item.score; break; }
      }
      return s;
    }, 0);
    const treasureSetBonus = TREASURE_COLLECTIONS.reduce((s, col) => {
      const allCollected = col.items.every(it => (housing.treasures || []).includes(it.id));
      return s + (allCollected ? col.setBonus.score : 0);
    }, 0);
    const score = furnitureScore + treasureScore + treasureSetBonus;
    const tier = getHousingScoreTier(score);

    const completedSets = FURNITURE_SETS.filter(set =>
      set.items.every(itemId => placedFurniture.some(f => f.baseId === itemId))
    );

    const buyHouse = (houseDef) => {
      if (gold < houseDef.price) { alert(`金币不足! 需要 ${houseDef.price}`); return; }
      if (!confirm(`购买 ${houseDef.icon} ${houseDef.name}？\n价格: ${houseDef.price} 金币\n精灵槽: ${houseDef.slots} | 家具槽: ${houseDef.furnitureSlots}`)) return;
      setGold(g => g - houseDef.price);
      setHousing(prev => ({
        ...prev,
        currentHouse: houseDef.id,
        residents: Array(houseDef.slots).fill(null),
      }));
      alert(`🎉 成功购买 ${houseDef.name}!`);
    };

    const placeFurniture = (furnitureIdx) => {
      if (!currentHouseDef) { alert('请先购买房屋!'); return; }
      if (placedFurniture.length >= currentHouseDef.furnitureSlots) { alert('家具槽已满!'); return; }
      setHousing(prev => {
        const updated = [...prev.furniture];
        updated[furnitureIdx] = { ...updated[furnitureIdx], placed: true, slotIdx: placedFurniture.length };
        return { ...prev, furniture: updated };
      });
    };

    const removeFurniture = (furnitureIdx) => {
      setHousing(prev => {
        const updated = [...prev.furniture];
        updated[furnitureIdx] = { ...updated[furnitureIdx], placed: false, slotIdx: null };
        return { ...prev, furniture: updated };
      });
    };

    const assignResident = (slotIdx) => {
      if (!currentHouseDef) return;
      const available = [...box, ...party].filter(p => p.currentHp > 0 && !housing.residents.includes(p.uid));
      if (available.length === 0) { alert('没有可入住的精灵!'); return; }
      const names = available.map((p, i) => `${i + 1}. ${p.emoji || '🔵'} ${p.name} Lv.${p.level}`).join('\n');
      const choice = prompt(`选择入住精灵:\n${names}\n\n输入序号:`);
      const idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < available.length) {
        const pet = available[idx];
        setHousing(prev => {
          const newResidents = [...prev.residents];
          newResidents[slotIdx] = pet.uid || pet.id;
          return { ...prev, residents: newResidents };
        });
      }
    };

    const removeResident = (slotIdx) => {
      setHousing(prev => {
        const newResidents = [...prev.residents];
        newResidents[slotIdx] = null;
        return { ...prev, residents: newResidents };
      });
    };

    const findPetByUid = (uid) => [...party, ...box].find(p => (p.uid || p.id) === uid);

    const plantSeed = (plantId) => {
      const plant = GARDEN_PLANTS.find(p => p.id === plantId);
      if (!plant || !plant.seedPrice) return;
      const maxSlots = getGardenSlots(housing.currentHouse);
      const plots = housing.garden?.plots || [];
      if (plots.length >= maxSlots) { alert('花园已满！升级住宅可获得更多种植槽。'); return; }
      if (gold < plant.seedPrice) { alert(`金币不足！需要 ${plant.seedPrice} 金币`); return; }
      setGold(g => g - plant.seedPrice);
      setHousing(prev => ({
        ...prev,
        garden: {
          ...(prev.garden || { plots: [], waterLog: {} }),
          plots: [...(prev.garden?.plots || []), { plantId, plantedAt: Date.now(), adjustedGrowth: plant.growthMs }],
        },
      }));
      alert(`🌱 种下了 ${plant.icon} ${plant.name}！`);
    };

    const waterPlant = (plotIdx) => {
      const today = new Date().toISOString().slice(0, 10);
      const key = `${plotIdx}_${today}`;
      if ((housing.garden?.waterLog || {})[key]) { alert('今天已经浇过水了！'); return; }
      setHousing(prev => {
        const garden = { ...(prev.garden || { plots: [], waterLog: {} }) };
        const plots = [...(garden.plots || [])];
        if (!plots[plotIdx]) return prev;
        const plot = { ...plots[plotIdx] };
        plot.adjustedGrowth = Math.floor((plot.adjustedGrowth || GARDEN_PLANTS.find(p => p.id === plot.plantId)?.growthMs || 60000) * 0.75);
        plots[plotIdx] = plot;
        return { ...prev, garden: { ...garden, plots, waterLog: { ...garden.waterLog, [key]: true } } };
      });
      alert('💧 浇水成功！生长时间缩短25%');
    };

    const harvestPlant = (plotIdx) => {
      const plots = housing.garden?.plots || [];
      const plot = plots[plotIdx];
      if (!plot) return;
      const plantDef = GARDEN_PLANTS.find(p => p.id === plot.plantId);
      if (!plantDef) return;
      const elapsed = Date.now() - plot.plantedAt;
      if (elapsed < (plot.adjustedGrowth || plantDef.growthMs)) { alert('还没有成熟！'); return; }

      let rewardMsg = '';
      if (plantDef.category === 'flower' || plantDef.category === 'rare') {
        const quality = plantDef.rarity === 'LEGENDARY' ? 'LEGENDARY' : plantDef.rarity === 'EPIC' ? 'EPIC' : rollQuality('battle', plantDef.rarity === 'RARE');
        setHousing(prev => ({
          ...prev,
          furniture: [...prev.furniture, { baseId: 'flower_garden', quality, placed: false, slotIdx: null }],
        }));
        rewardMsg = `${plantDef.icon} 装饰花卉 (${FURNITURE_QUALITY[quality]?.name}) +${plantDef.scoreValue || 0}评分`;
      } else if (plantDef.harvestItem) {
        const hi = plantDef.harvestItem;
        if (hi.chance && Math.random() > hi.chance) {
          rewardMsg = '这次没有收获到稀有材料...获得树果 x2 作为安慰';
          setInventory(prev => ({ ...prev, berries: (prev.berries || 0) + 2 }));
        } else if (hi.type === 'berry') {
          setInventory(prev => ({ ...prev, berries: (prev.berries || 0) + hi.count }));
          rewardMsg = `树果 x${hi.count}`;
        } else if (hi.type === 'med') {
          setInventory(prev => ({ ...prev, meds: { ...prev.meds, [hi.id]: (prev.meds[hi.id] || 0) + hi.count } }));
          rewardMsg = `药品 x${hi.count}`;
        } else if (hi.type === 'stone') {
          const stoneKeys = Object.keys(EVO_STONES);
          const sid = stoneKeys[Math.floor(Math.random() * stoneKeys.length)];
          setInventory(prev => ({ ...prev, stones: { ...prev.stones, [sid]: (prev.stones[sid] || 0) + hi.count } }));
          rewardMsg = `${EVO_STONES[sid].name} x${hi.count}`;
        } else if (hi.type === 'misc') {
          setInventory(prev => ({ ...prev, misc: { ...prev.misc, [hi.id]: (prev.misc[hi.id] || 0) + hi.count } }));
          rewardMsg = `${hi.id === 'rebirth_pill' ? '洗练药' : hi.id} x${hi.count}`;
        } else if (hi.type === 'candy') {
          setInventory(prev => ({ ...prev, [hi.id]: (prev[hi.id] || 0) + hi.count }));
          rewardMsg = `${hi.id === 'exp_candy' ? '经验糖果' : hi.id === 'max_candy' ? '极限糖果' : hi.id} x${hi.count}`;
        } else if (hi.type === 'growth') {
          const item = GROWTH_ITEMS[Math.floor(Math.random() * GROWTH_ITEMS.length)];
          setInventory(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + hi.count }));
          rewardMsg = `${item.name} x${hi.count}`;
        }
      }

      let bonusSeedMsg = '';
      const rarityKey = plantDef.rarity === 'LEGENDARY' ? 'RARE' : plantDef.rarity === 'EPIC' ? 'UNCOMMON' : 'COMMON';
      const seedTable = SEED_DROP_TABLE[rarityKey];
      if (seedTable && Math.random() < 0.2) {
        const tw = seedTable.reduce((s, e) => s + e.weight, 0);
        let r = Math.random() * tw;
        let seedPlant = seedTable[0];
        for (const e of seedTable) { r -= e.weight; if (r <= 0) { seedPlant = e; break; } }
        const sp = GARDEN_PLANTS.find(p => p.id === seedPlant.plantId);
        if (sp) {
          bonusSeedMsg = `\n🌱 额外获得稀有种子: ${sp.icon} ${sp.name}！`;
          setHousing(prev => ({
            ...prev,
            garden: {
              ...(prev.garden || { plots: [], waterLog: {} }),
              seedInventory: { ...(prev.garden?.seedInventory || {}), [seedPlant.plantId]: ((prev.garden?.seedInventory || {})[seedPlant.plantId] || 0) + 1 },
            },
          }));
        }
      }

      setHousing(prev => {
        const newPlots = [...(prev.garden?.plots || [])];
        newPlots.splice(plotIdx, 1);
        return { ...prev, garden: { ...(prev.garden || {}), plots: newPlots } };
      });
      alert(`🌾 收获了 ${plantDef.icon} ${plantDef.name}！\n🎁 ${rewardMsg}${bonusSeedMsg}`);
    };

    const checkTreasureUnlock = (condType, condData) => {
      const owned = housing.treasures || [];
      const newTreasures = [];
      for (const col of TREASURE_COLLECTIONS) {
        for (const item of col.items) {
          if (owned.includes(item.id)) continue;
          if (item.condition === condType) {
            if (condType === 'gym' && condData.mapId === item.mapId) newTreasures.push(item);
            else if (condType === 'story' && condData.chapter >= item.chapter) newTreasures.push(item);
            else if (condType === 'challenge' && condData.challengeId === item.challengeId) newTreasures.push(item);
            else if (condType === 'explore' && condData.mapId === item.mapId) newTreasures.push(item);
            else if (condType === 'event' && condData.eventType === item.eventType) newTreasures.push(item);
            else if (condType === 'catch_legendary') newTreasures.push(item);
            else if (condType === 'cafe_lv5' && item.condition === 'cafe_lv5') newTreasures.push(item);
            else if (condType === 'housing_score' && item.condition === 'housing_score' && condData.score >= item.minScore) newTreasures.push(item);
          }
        }
      }
      if (newTreasures.length > 0) {
        setHousing(prev => ({
          ...prev,
          treasures: [...(prev.treasures || []), ...newTreasures.map(t => t.id)],
        }));
        newTreasures.forEach(t => {
          setTimeout(() => alert(`✨ 获得珍藏品: ${t.icon} ${t.name}！\n家园评分 +${t.score}`), 500);
        });
      }
    };

    const buyFurnitureFromShop = (def) => {
      if (!def.shopPrice) return;
      if (gold < def.shopPrice) { alert('金币不足!'); return; }
      if (!confirm(`购买 ${def.icon} ${def.name}？\n价格: ${def.shopPrice} 金币`)) return;
      setGold(g => g - def.shopPrice);
      const quality = rollQuality('shop');
      setHousing(prev => ({
        ...prev,
        furniture: [...prev.furniture, { baseId: def.id, quality, placed: false, slotIdx: null }],
      }));
      alert(`🎉 获得 ${def.icon} ${def.name} (${FURNITURE_QUALITY[quality].name})`);
    };

    return (
      <div className="screen" style={{background:'linear-gradient(135deg, #EFEBE9, #D7CCC8)', minHeight:'100vh'}}>
        <div className="nav-header glass-panel">
          <button className="btn-back" onClick={() => setView(getBackToMapView())}>⬅ 返回地图</button>
          <div className="nav-title">🏡 精灵家园</div>
          <div className="nav-coin">💰 {gold}</div>
        </div>

        <div style={{display:'flex', gap:'8px', justifyContent:'center', margin:'10px 0'}}>
          {['overview','furniture','residents','garden','treasure','shop','upgrade','cafe'].map(tab => (
            <button key={tab} onClick={() => setHousingTab(tab)}
              style={{padding:'6px 12px', borderRadius:'20px', border:'none', cursor:'pointer',
                background: housingTab === tab ? (tab === 'cafe' ? '#C62828' : tab === 'garden' ? '#43A047' : tab === 'treasure' ? '#FF8F00' : '#8D6E63') : '#fff',
                color: housingTab === tab ? '#fff' : '#666', fontWeight:'bold', fontSize:'11px',
                boxShadow: housingTab === tab ? '0 4px 12px rgba(141,110,99,0.4)' : 'none'}}>
              {{overview:'🏠 概览', furniture:'🪑 家具', residents:'🐾 入住', garden:'🌱 花园', treasure:'✨ 珍藏', shop:'🛒 商店', upgrade:'⬆️ 升级', cafe:'☕ 咖啡厅'}[tab]}
            </button>
          ))}
        </div>

        <div style={{padding:'0 20px 20px', maxHeight:'calc(100vh - 140px)', overflow:'auto'}}>

          {housingTab === 'overview' && (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize:'48px', textAlign:'center'}}>{currentHouseDef?.icon || '🏕️'}</div>
                <div style={{textAlign:'center', fontWeight:'bold', fontSize:'18px', margin:'8px 0'}}>{currentHouseDef?.name || '露宿野外'}</div>
                <div style={{textAlign:'center', color:'#888', fontSize:'13px'}}>
                  {currentHouseDef ? `精灵槽: ${housing.residents.filter(r => r).length}/${currentHouseDef.slots} | 家具槽: ${placedFurniture.length}/${currentHouseDef.furnitureSlots}` : '还没有家呢...去商店看看吧!'}
                </div>
              </div>
              <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
                <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'12px'}}>📊 家园评分</div>
                <div style={{fontSize:'32px', fontWeight:'bold', color:'#8D6E63', textAlign:'center'}}>{score}</div>
                <div style={{textAlign:'center', color: tier.buff ? '#4CAF50' : '#999', fontWeight:'bold', fontSize:'14px', margin:'4px 0'}}>🏅 {tier.title}</div>
                {tier.buff && <div style={{fontSize:'11px', color:'#666', textAlign:'center'}}>
                  {tier.buff.allStats ? `全属性+${tier.buff.allStats} ` : ''}
                  {tier.buff.expBonus ? `经验+${Math.floor(tier.buff.expBonus*100)}% ` : ''}
                  {tier.buff.intimacyMult ? `亲密度x${tier.buff.intimacyMult} ` : ''}
                </div>}
              </div>
              <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', gridColumn:'span 2'}}>
                <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>📋 每日收益 (入住精灵)</div>
                <div style={{display:'flex', gap:'20px', justifyContent:'center', fontSize:'13px'}}>
                  <span>❤️ HP恢复: +{benefits.hpRegen}</span>
                  <span>⭐ 经验: +{(benefits.expBonus * 100).toFixed(0)}%</span>
                  <span>💕 亲密度: +{benefits.intimacyBonus}</span>
                  {benefits.ceRegen > 0 && <span>🔮 咒力恢复: +{benefits.ceRegen}</span>}
                </div>
                {completedSets.length > 0 && (
                  <div style={{marginTop:'8px', borderTop:'1px solid #eee', paddingTop:'8px'}}>
                    <div style={{fontSize:'12px', color:'#4CAF50', fontWeight:'bold'}}>✨ 已激活套装:</div>
                    {completedSets.map(s => <div key={s.id} style={{fontSize:'11px', color:'#666', marginTop:'2px'}}>{s.name}: {s.desc}</div>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {housingTab === 'furniture' && (
            <div>
              {placedFurniture.length > 0 && (
                <div style={{marginBottom:'16px'}}>
                  <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>🪑 已放置的家具</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'8px'}}>
                    {housing.furniture.map((f, idx) => {
                      if (!f.placed) return null;
                      const def = FURNITURE_DB.find(d => d.id === f.baseId);
                      if (!def) return null;
                      const qual = FURNITURE_QUALITY[f.quality];
                      return (
                        <div key={idx} style={{background:'#fff', borderRadius:'12px', padding:'10px', border:`2px solid ${qual.color}`, cursor:'pointer', position:'relative'}} onClick={() => removeFurniture(idx)}>
                          <div style={{fontSize:'24px', textAlign:'center'}}>{def.icon}</div>
                          <div style={{fontSize:'11px', fontWeight:'bold', textAlign:'center', marginTop:'4px'}}>{def.name}</div>
                          <div style={{fontSize:'10px', textAlign:'center', color: qual.color, fontWeight:'bold'}}>{qual.name}</div>
                          <div style={{position:'absolute', top:'4px', right:'4px', fontSize:'10px', cursor:'pointer', color:'#f44336'}}>✕</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'8px'}}>📦 背包中的家具 ({unplacedFurniture.length}件)</div>
              {unplacedFurniture.length === 0 && <div style={{color:'#999', textAlign:'center', padding:'20px'}}>背包空空如也... 去冒险获取家具吧!</div>}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'8px'}}>
                {housing.furniture.map((f, idx) => {
                  if (f.placed) return null;
                  const def = FURNITURE_DB.find(d => d.id === f.baseId);
                  if (!def) return null;
                  const qual = FURNITURE_QUALITY[f.quality];
                  return (
                    <div key={idx} style={{background:'#fff', borderRadius:'12px', padding:'10px', border:'1px solid #eee', cursor:'pointer'}} onClick={() => placeFurniture(idx)}>
                      <div style={{fontSize:'24px', textAlign:'center'}}>{def.icon}</div>
                      <div style={{fontSize:'11px', fontWeight:'bold', textAlign:'center', marginTop:'4px'}}>{def.name}</div>
                      <div style={{fontSize:'10px', textAlign:'center', color: qual.color, fontWeight:'bold'}}>{qual.name}</div>
                      <div style={{fontSize:'9px', textAlign:'center', color:'#4CAF50'}}>点击放置</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {housingTab === 'residents' && (
            <div>
              {!currentHouseDef && <div style={{textAlign:'center', padding:'40px', color:'#999'}}>请先购买房屋!</div>}
              {currentHouseDef && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'12px'}}>
                  {housing.residents.map((uid, idx) => {
                    const pet = uid ? findPetByUid(uid) : null;
                    return (
                      <div key={idx} style={{background:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', textAlign:'center', border: pet ? '2px solid #4CAF50' : '2px dashed #ccc', minHeight:'120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        {pet ? (
                          <>
                            <div style={{width:48, height:48}}>{renderAvatar(pet)}</div>
                            <div style={{fontWeight:'bold', fontSize:'13px', marginTop:'4px'}}>{pet.name}</div>
                            <div style={{fontSize:'11px', color:'#888'}}>Lv.{pet.level}</div>
                            <button onClick={() => removeResident(idx)} style={{marginTop:'8px', padding:'4px 12px', borderRadius:'12px', border:'none', background:'#ffebee', color:'#f44336', fontSize:'11px', cursor:'pointer'}}>召回</button>
                          </>
                        ) : (
                          <>
                            <div style={{fontSize:'36px', opacity:0.3}}>🏠</div>
                            <div style={{color:'#999', fontSize:'12px', marginTop:'4px'}}>空槽位</div>
                            <button onClick={() => assignResident(idx)} style={{marginTop:'8px', padding:'4px 12px', borderRadius:'12px', border:'none', background:'#E8F5E9', color:'#4CAF50', fontSize:'11px', cursor:'pointer'}}>分配精灵</button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {housingTab === 'shop' && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'12px'}}>
              {FURNITURE_DB.filter(f => f.shopPrice).map(def => (
                <div key={def.id} style={{background:'#fff', borderRadius:'12px', padding:'14px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', cursor:'pointer', transition:'0.2s'}} onClick={() => buyFurnitureFromShop(def)}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'28px'}}>{def.icon}</span>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'13px'}}>{def.name}</div>
                      <div style={{fontSize:'10px', color:'#888'}}>{{REST:'休息类',TRAIN:'训练类',PLAY:'娱乐类',DECO:'装饰类'}[def.category] || def.category}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px', alignItems:'center'}}>
                    <span style={{fontSize:'12px', color:'#FF9800', fontWeight:'bold'}}>💰 {def.shopPrice}</span>
                    <span style={{fontSize:'10px', color:'#4CAF50'}}>品质: 普通~优秀</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {housingTab === 'upgrade' && (
            <div style={{maxWidth:'500px', margin:'0 auto'}}>
              {HOUSE_TYPES.map((h, idx) => {
                const isOwned = housing.currentHouse === h.id;
                const ownedIdx = HOUSE_TYPES.findIndex(ht => ht.id === housing.currentHouse);
                const isNext = idx === ownedIdx + 1 || (!housing.currentHouse && idx === 0);
                const isPast = idx <= ownedIdx;
                return (
                  <div key={h.id} style={{background:'#fff', borderRadius:'16px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', border: isOwned ? '2px solid #4CAF50' : isNext ? '2px solid #FF9800' : '1px solid #eee', opacity: isPast && !isOwned ? 0.5 : 1}}>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                      <span style={{fontSize:'36px'}}>{h.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'16px'}}>{h.name} {isOwned && <span style={{color:'#4CAF50', fontSize:'12px'}}>✓ 当前</span>}</div>
                        <div style={{fontSize:'12px', color:'#888'}}>精灵槽: {h.slots} | 家具槽: {h.furnitureSlots}</div>
                      </div>
                      {isNext && <button onClick={() => buyHouse(h)} style={{padding:'8px 20px', borderRadius:'20px', border:'none', background:'linear-gradient(135deg,#FF9800,#F57C00)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'13px'}} disabled={gold < h.price}>💰 {h.price}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== 花园 ========== */}
          {housingTab === 'garden' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              {!housing.currentHouse ? (
                <div style={{textAlign:'center', padding:'40px 20px', color:'#888'}}>
                  <div style={{fontSize:'48px', marginBottom:'16px'}}>🌱</div>
                  <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'8px'}}>需要先拥有住宅</div>
                  <div style={{fontSize:'13px'}}>购买住宅后即可开启花园种植</div>
                </div>
              ) : (
                <div>
                  <div style={{background:'linear-gradient(135deg,#43A047,#66BB6A)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{fontWeight:'bold', fontSize:'18px'}}>🌱 精灵花园</div>
                    <div style={{fontSize:'12px', opacity:0.8}}>种植槽 {(housing.garden?.plots || []).length}/{getGardenSlots(housing.currentHouse)} · 种植花草收获装饰和道具</div>
                  </div>
                  {/* 种植槽 */}
                  <div style={{background:'#fff', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>种植槽</div>
                    {(housing.garden?.plots || []).length === 0 && (
                      <div style={{textAlign:'center', padding:'20px', color:'#aaa', fontSize:'13px'}}>还没有种植任何植物，在下方选择种子开始种植吧！</div>
                    )}
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {(housing.garden?.plots || []).map((plot, idx) => {
                        const plantDef = GARDEN_PLANTS.find(p => p.id === plot.plantId);
                        if (!plantDef) return null;
                        const now = Date.now();
                        const elapsed = now - plot.plantedAt;
                        const totalGrowth = plot.adjustedGrowth || plantDef.growthMs;
                        const progress = Math.min(100, (elapsed / totalGrowth) * 100);
                        const isReady = elapsed >= totalGrowth;
                        const today = new Date().toISOString().slice(0, 10);
                        const canWater = !((housing.garden?.waterLog || {})[`${idx}_${today}`]);
                        const remaining = Math.max(0, totalGrowth - elapsed);
                        const remMins = Math.floor(remaining / 60000);
                        const remHrs = Math.floor(remMins / 60);
                        const timeStr = remHrs > 0 ? `${remHrs}时${remMins%60}分` : `${remMins}分钟`;
                        return (
                          <div key={idx} style={{padding:'12px', borderRadius:'12px', background: isReady ? '#E8F5E9' : '#FAFAFA', border: isReady ? '2px solid #4CAF50' : '1px solid #eee'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                              <span style={{fontSize:'24px'}}>{plantDef.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:'bold', fontSize:'13px'}}>{plantDef.name} <span style={{fontSize:'10px', color:'#888'}}>({FURNITURE_QUALITY[plantDef.rarity]?.name || plantDef.rarity})</span></div>
                                <div style={{fontSize:'11px', color:'#888'}}>{isReady ? '已成熟，可以收获！' : `剩余 ${timeStr}`}</div>
                              </div>
                              {isReady ? (
                                <button onClick={() => harvestPlant(idx)} style={{padding:'6px 16px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#43A047,#66BB6A)', color:'#fff', fontWeight:'bold', fontSize:'12px', cursor:'pointer'}}>收获</button>
                              ) : canWater ? (
                                <button onClick={() => waterPlant(idx)} style={{padding:'6px 14px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#1E88E5,#42A5F5)', color:'#fff', fontWeight:'bold', fontSize:'11px', cursor:'pointer'}}>💧 浇水</button>
                              ) : (
                                <span style={{fontSize:'10px', color:'#aaa'}}>今日已浇</span>
                              )}
                            </div>
                            <div style={{width:'100%', height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden'}}>
                              <div style={{width:`${progress}%`, height:'100%', background: isReady ? '#4CAF50' : 'linear-gradient(90deg,#81C784,#43A047)', borderRadius:'3px', transition:'width 1s'}} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* 种子列表 */}
                  <div style={{background:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'4px'}}>种子商店</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>购买种子种植到花园，收获装饰品(加评分)或道具</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                      {GARDEN_PLANTS.filter(p => p.seedPrice !== null).map(plant => {
                        const plots = housing.garden?.plots || [];
                        const maxSlots = getGardenSlots(housing.currentHouse);
                        const full = plots.length >= maxSlots;
                        const rarityColors = { COMMON:'#78909C', UNCOMMON:'#43A047', RARE:'#1E88E5', EPIC:'#8E24AA', LEGENDARY:'#FF6F00' };
                        const growMins = Math.round(plant.growthMs / 60000);
                        const growStr = growMins >= 60 ? `${Math.floor(growMins/60)}时${growMins%60}分` : `${growMins}分`;
                        return (
                          <div key={plant.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', background:'#fafafa', border:'1px solid #eee'}}>
                            <span style={{fontSize:'20px'}}>{plant.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'12px'}}>{plant.name} <span style={{fontSize:'10px', color:rarityColors[plant.rarity]}}>{FURNITURE_QUALITY[plant.rarity]?.name}</span></div>
                              <div style={{fontSize:'10px', color:'#999'}}>{plant.desc} · ⏱{growStr}</div>
                            </div>
                            <button onClick={() => plantSeed(plant.id)} disabled={full || gold < plant.seedPrice} style={{
                              padding:'5px 12px', borderRadius:'14px', border:'none', fontSize:'11px', fontWeight:'bold', cursor: full || gold < plant.seedPrice ? 'not-allowed' : 'pointer',
                              background: full || gold < plant.seedPrice ? '#e0e0e0' : 'linear-gradient(135deg,#43A047,#66BB6A)', color: full || gold < plant.seedPrice ? '#999' : '#fff'
                            }}>{full ? '已满' : `💰${plant.seedPrice}`}</button>
                          </div>
                        );
                      })}
                    </div>
                    {GARDEN_PLANTS.filter(p => p.seedPrice === null).length > 0 && (
                      <div style={{marginTop:'12px', padding:'10px', borderRadius:'10px', background:'#FFF3E0', border:'1px solid #FFE0B2', fontSize:'11px', color:'#E65100'}}>
                        💡 稀有/传说种子无法购买，只能通过收获其他植物时随机获得！
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== 珍藏阁 ========== */}
          {housingTab === 'treasure' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              <div style={{background:'linear-gradient(135deg,#FF8F00,#FFA726)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                <div style={{fontWeight:'bold', fontSize:'18px'}}>✨ 珍藏阁</div>
                <div style={{fontSize:'12px', opacity:0.8}}>已收集 {(housing.treasures || []).length}/{TREASURE_COLLECTIONS.reduce((s,c) => s+c.items.length, 0)} · 展示珍贵纪念品加家园评分</div>
              </div>
              {TREASURE_COLLECTIONS.map(col => {
                const owned = housing.treasures || [];
                const ownedInSet = col.items.filter(it => owned.includes(it.id));
                const allCollected = ownedInSet.length === col.items.length;
                const setScore = col.items.reduce((s, it) => s + (owned.includes(it.id) ? it.score : 0), 0) + (allCollected ? col.setBonus.score : 0);
                return (
                  <div key={col.id} style={{background:'#fff', borderRadius:'16px', padding:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                      <span style={{fontSize:'24px'}}>{col.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'bold', fontSize:'14px'}}>{col.name} <span style={{fontSize:'11px', color:'#888'}}>({ownedInSet.length}/{col.items.length})</span></div>
                        <div style={{fontSize:'11px', color:'#888'}}>{col.desc}</div>
                      </div>
                      <div style={{fontSize:'12px', fontWeight:'bold', color: allCollected ? '#4CAF50' : '#999'}}>+{setScore}分</div>
                    </div>
                    {allCollected && (
                      <div style={{padding:'6px 12px', borderRadius:'8px', background:'#E8F5E9', border:'1px solid #C8E6C9', fontSize:'11px', color:'#2E7D32', fontWeight:'bold', marginBottom:'8px'}}>
                        🎉 系列集齐！额外 +{col.setBonus.score} 家园评分
                      </div>
                    )}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))', gap:'6px'}}>
                      {col.items.map(item => {
                        const has = owned.includes(item.id);
                        return (
                          <div key={item.id} style={{
                            padding:'8px', borderRadius:'10px', textAlign:'center',
                            background: has ? '#FFFDE7' : '#f5f5f5', border: has ? '1px solid #FDD835' : '1px dashed #ddd',
                            opacity: has ? 1 : 0.5
                          }}>
                            <div style={{fontSize:'20px', marginBottom:'2px', filter: has ? 'none' : 'grayscale(1)'}}>{item.icon}</div>
                            <div style={{fontSize:'10px', fontWeight:'bold', color: has ? '#333' : '#bbb'}}>{has ? item.name : '???'}</div>
                            {has && <div style={{fontSize:'9px', color:'#888'}}>+{item.score}分</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== 咖啡厅 ========== */}
          {housingTab === 'cafe' && (
            <div style={{maxWidth:'600px', margin:'0 auto'}}>
              {!cafe.owned ? (
                <div style={{textAlign:'center', padding:'40px 20px'}}>
                  <div style={{fontSize:'48px', marginBottom:'16px'}}>☕</div>
                  <div style={{fontWeight:'bold', fontSize:'18px', marginBottom:'8px', color:'#C62828'}}>LycoReco 咖啡厅</div>
                  <div style={{fontSize:'13px', color:'#888', marginBottom:'20px'}}>通关莉可莉丝剧情序章后可购买</div>
                  {isLycorisStoryCompleted(18) ? (
                    <button onClick={buyCafe} style={{padding:'12px 30px', borderRadius:'25px', border:'none', background:'linear-gradient(135deg,#C62828,#FF5252)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'14px', boxShadow:'0 4px 15px rgba(198,40,40,0.4)'}}>
                      购买咖啡厅 (💰 {CAFE_BUILDING.price})
                    </button>
                  ) : (
                    <div style={{fontSize:'12px', color:'#999', padding:'10px', background:'#f5f5f5', borderRadius:'10px'}}>
                      需要先通关「莉可莉丝篇·序章」才能解锁
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* 咖啡厅状态 */}
                  <div style={{background:'linear-gradient(135deg,#C62828,#D32F2F)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                      <div>
                        <div style={{fontWeight:'bold', fontSize:'18px'}}>☕ LycoReco 咖啡厅</div>
                        <div style={{fontSize:'12px', opacity:0.8}}>等级 {getCafeLevel(cafe.totalWorkCount).level} · 累计打工 {cafe.totalWorkCount} 次</div>
                      </div>
                      <div style={{background:'rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>
                        金币倍率 x{getCafeLevel(cafe.totalWorkCount).goldMult}
                      </div>
                    </div>
                    <div style={{fontSize:'11px', opacity:0.7}}>
                      打工种族值合计: {getWorkerStatTotal()} · 影响酿造速度与可酿等级
                    </div>
                  </div>

                  {/* 打工精灵 */}
                  <div style={{background:'#fff', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>打工精灵 ({cafe.workers.length}/{CAFE_BUILDING.workerSlots})</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'10px'}}>每5分钟产出 {Math.floor(CAFE_BUILDING.goldPerTick * getCafeLevel(cafe.totalWorkCount).goldMult)} 金币 + 亲密度+2</div>
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {party.map(p => {
                        const uid = p.uid || p.id;
                        const isWorking = cafe.workers.includes(uid);
                        const base = POKEDEX.find(d => d.id === p.id) || {};
                        const bst = (base.hp||0) + (base.atk||0) + (base.def||0) + (base.spd||0);
                        return (
                          <div key={uid} onClick={() => assignCafeWorker(p)} style={{
                            display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', cursor:'pointer',
                            background: isWorking ? '#FFF3E0' : '#f5f5f5', border: isWorking ? '2px solid #FF9800' : '1px solid #eee'
                          }}>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'13px'}}>{p.name} <span style={{fontSize:'10px', color:'#888'}}>Lv.{p.level}</span></div>
                              <div style={{fontSize:'10px', color:'#aaa'}}>种族值: {bst}</div>
                            </div>
                            <div style={{fontSize:'11px', color: isWorking ? '#E65100' : '#999', fontWeight:'bold'}}>{isWorking ? '打工中' : '空闲'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 酿造状态 */}
                  {(cafe.brewing || cafe.readyDrink) && (
                    <div style={{background:'#fff', borderRadius:'16px', padding:'16px', marginBottom:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                      <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'12px'}}>酿造状态</div>
                      {cafe.brewing && (() => {
                        const now = Date.now();
                        const elapsed = now - cafe.brewing.startTime;
                        const remaining = Math.max(0, cafe.brewing.duration - elapsed);
                        const progress = Math.min(100, (elapsed / cafe.brewing.duration) * 100);
                        const brewDrink = CAFE_DRINKS.find(d => d.id === cafe.brewing.drinkId);
                        const mins = Math.floor(remaining / 60000);
                        const secs = Math.ceil((remaining % 60000) / 1000);
                        return (
                          <div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                              <span style={{fontSize:'13px', fontWeight:'bold'}}>☕ {brewDrink?.name || '未知'}</span>
                              <span style={{fontSize:'11px', color:'#1565C0'}}>⏱ {remaining > 0 ? `${mins}分${secs}秒` : '即将完成...'}</span>
                            </div>
                            <div style={{width:'100%', height:'8px', background:'#eee', borderRadius:'4px', overflow:'hidden', marginBottom:'8px'}}>
                              <div style={{width:`${progress}%`, height:'100%', background:'linear-gradient(90deg,#FF9800,#F44336)', borderRadius:'4px', transition:'width 1s ease'}} />
                            </div>
                            <button onClick={cancelBrewing} style={{padding:'4px 12px', borderRadius:'12px', border:'1px solid #e0e0e0', background:'#fafafa', fontSize:'10px', color:'#999', cursor:'pointer'}}>取消酿造</button>
                          </div>
                        );
                      })()}
                      {cafe.readyDrink && (() => {
                        const readyDrink = CAFE_DRINKS.find(d => d.id === cafe.readyDrink.drinkId);
                        const tierColors = ['', '#78909C', '#43A047', '#1E88E5', '#8E24AA', '#FF6F00'];
                        return (
                          <div style={{textAlign:'center', padding:'8px 0'}}>
                            <div style={{fontSize:'32px', marginBottom:'8px'}}>☕</div>
                            <div style={{fontWeight:'bold', fontSize:'15px', marginBottom:'4px', color:'#2E7D32'}}>「{readyDrink?.name}」酿造完成!</div>
                            <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>支付金币领取，获得随机道具奖励</div>
                            <button onClick={claimBrewedDrink} disabled={gold < (readyDrink?.price || 0)} style={{
                              padding:'10px 28px', borderRadius:'20px', border:'none', fontWeight:'bold', fontSize:'13px', cursor: gold < (readyDrink?.price||0) ? 'not-allowed':'pointer',
                              background: gold < (readyDrink?.price||0) ? '#e0e0e0' : `linear-gradient(135deg,${tierColors[readyDrink?.tier||1]},${tierColors[readyDrink?.tier||1]}CC)`,
                              color: gold < (readyDrink?.price||0) ? '#999' : '#fff', boxShadow: gold < (readyDrink?.price||0) ? 'none' : '0 4px 12px rgba(0,0,0,0.2)'
                            }}>💰 {readyDrink?.price} 领取</button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 饮品菜单 */}
                  <div style={{background:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <div style={{fontWeight:'bold', fontSize:'14px', marginBottom:'4px'}}>酿造饮品</div>
                    <div style={{fontSize:'11px', color:'#888', marginBottom:'12px'}}>选择饮品开始酿造 → 等待完成 → 支付领取 · 每日限量</div>
                    {cafe.workers.length === 0 && (
                      <div style={{padding:'10px 14px', borderRadius:'10px', background:'#FFF3E0', border:'1px solid #FFE0B2', marginBottom:'8px', fontSize:'12px', color:'#E65100'}}>
                        ⚠️ 没有精灵在打工，无法酿造！请先安排精灵到咖啡厅。
                      </div>
                    )}
                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                      {CAFE_DRINKS.map(drink => {
                        const unlocked = isDrinkUnlocked(drink);
                        const tierColors = ['', '#78909C', '#43A047', '#1E88E5', '#8E24AA', '#FF6F00'];
                        const tierNames = ['', '★', '★★', '★★★', '★★★★', '★★★★★'];
                        const used = getDrinkDailyUsed(drink.id);
                        const atLimit = used >= drink.dailyLimit;
                        const workerStats = getWorkerStatTotal();
                        const minStats = DRINK_MIN_WORKER_STATS[drink.tier] || 0;
                        const statsTooLow = workerStats < minStats;
                        const isBrewing = !!cafe.brewing;
                        const hasReady = !!cafe.readyDrink;
                        const noWorkers = cafe.workers.length === 0;
                        const cantBrew = !unlocked || atLimit || isBrewing || hasReady || noWorkers || statsTooLow;
                        const brewTime = calcBrewTimeMs(drink.tier, workerStats);
                        const brewMins = Math.ceil(brewTime / 60000);
                        return (
                          <div key={drink.id} style={{
                            display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderRadius:'12px',
                            background: unlocked ? '#fff' : '#f5f5f5', border: unlocked ? '1px solid #eee' : '1px dashed #ddd',
                            opacity: unlocked ? 1 : 0.5
                          }}>
                            <div style={{width:'36px', height:'36px', borderRadius:'50%', background: unlocked ? `linear-gradient(135deg,${tierColors[drink.tier]},${tierColors[drink.tier]}88)` : '#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:'#fff', flexShrink:0}}>☕</div>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:'bold', fontSize:'13px', color: unlocked ? '#333' : '#999'}}>{drink.name} <span style={{fontSize:'10px', color:tierColors[drink.tier]}}>{tierNames[drink.tier]}</span></div>
                              <div style={{fontSize:'11px', color:'#888'}}>{drink.desc}</div>
                              {unlocked && (
                                <div style={{fontSize:'10px', marginTop:'3px', display:'flex', gap:'8px', flexWrap:'wrap', color:'#888'}}>
                                  <span style={{color: atLimit ? '#d32f2f' : '#666'}}>今日 {used}/{drink.dailyLimit}</span>
                                  <span>💰{drink.price}</span>
                                  <span>⏱{brewMins}分钟</span>
                                  {statsTooLow && <span style={{color:'#d32f2f'}}>需种族值≥{minStats}</span>}
                                </div>
                              )}
                            </div>
                            {unlocked ? (
                              <button onClick={() => startBrewing(drink.id)} disabled={cantBrew} style={{
                                padding:'6px 14px', borderRadius:'16px', border:'none', fontSize:'11px', fontWeight:'bold', cursor: cantBrew ? 'not-allowed' : 'pointer',
                                background: cantBrew ? '#e0e0e0' : `linear-gradient(135deg,${tierColors[drink.tier]},${tierColors[drink.tier]}CC)`, color: cantBrew ? '#999' : '#fff'
                              }}>{atLimit ? '已售罄' : statsTooLow ? '种族值不足' : isBrewing||hasReady ? '忙碌中' : '酿造'}</button>
                            ) : (
                              <span style={{fontSize:'10px', color:'#bbb'}}>未解锁</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // 游戏说明
  // ==========================================

  const renderGuide = () => {
    const filtered = guideCat ? GAME_GUIDE.filter(g => g.id === guideCat) : GAME_GUIDE;
    const q = guideSearch.trim().toLowerCase();
    const results = q
      ? filtered.map(cat => ({
          ...cat,
          sections: cat.sections.filter(s => {
            if (s.title.toLowerCase().includes(q)) return true;
            if (s.content && s.content.toLowerCase().includes(q)) return true;
            if (s.sub && s.sub.some(item => item.t.toLowerCase().includes(q) || item.c.toLowerCase().includes(q))) return true;
            return false;
          }),
        })).filter(cat => cat.sections.length > 0)
      : filtered;

    return (
      <div style={{position:'fixed', inset:0, background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', zIndex:9999, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        {/* 顶栏 */}
        <div style={{padding:'16px 20px 12px', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px'}}>
            <button onClick={() => { setView(party.length > 0 ? getBackToMapView() : 'menu'); setGuideSearch(''); setGuideCat(null); }}
              style={{background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', borderRadius:'10px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:'600'}}>
              返回
            </button>
            <div style={{fontSize:'18px', fontWeight:'800', color:'#fff', letterSpacing:'1px'}}>游戏说明</div>
            <div style={{width:'60px'}} />
          </div>
          {/* 搜索栏 */}
          <div style={{position:'relative', marginBottom:'10px'}}>
            <input
              type="text" placeholder="搜索规则/系统..."
              value={guideSearch} onChange={e => setGuideSearch(e.target.value)}
              style={{width:'100%', padding:'8px 12px 8px 32px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:'13px', outline:'none', boxSizing:'border-box'}}
            />
            <span style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', fontSize:'14px'}}>&#128269;</span>
          </div>
          {/* 分类标签 */}
          <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px', scrollbarWidth:'none'}}>
            <button onClick={() => setGuideCat(null)}
              style={{padding:'4px 12px', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.1)', fontSize:'11px', fontWeight:'600', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap',
                background: !guideCat ? 'rgba(255,255,255,0.15)' : 'transparent', color: !guideCat ? '#fff' : 'rgba(255,255,255,0.5)'}}>
              全部
            </button>
            {GAME_GUIDE.map(g => (
              <button key={g.id} onClick={() => setGuideCat(g.id)}
                style={{padding:'4px 12px', borderRadius:'20px', border:`1px solid ${guideCat === g.id ? g.color+'60' : 'rgba(255,255,255,0.1)'}`, fontSize:'11px', fontWeight:'600', cursor:'pointer', flexShrink:0, whiteSpace:'nowrap',
                  background: guideCat === g.id ? g.color+'25' : 'transparent', color: guideCat === g.id ? g.color : 'rgba(255,255,255,0.5)'}}>
                {g.icon} {g.title}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区 */}
        <div style={{flex:1, overflowY:'auto', padding:'12px 16px', scrollbarWidth:'thin', scrollbarColor:'rgba(255,255,255,0.15) transparent'}}>
          {results.length === 0 && (
            <div style={{textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.3)'}}>
              <div style={{fontSize:'40px', marginBottom:'12px'}}>&#128270;</div>
              <div style={{fontSize:'14px'}}>没有找到匹配的内容</div>
            </div>
          )}
          {results.map(cat => {
            const isExpanded = guideExpanded[cat.id] !== false;
            return (
              <div key={cat.id} style={{marginBottom:'16px'}}>
                {/* 分类标题 */}
                <div
                  onClick={() => setGuideExpanded(prev => ({...prev, [cat.id]: !isExpanded}))}
                  style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'12px', cursor:'pointer',
                    background:`linear-gradient(135deg, ${cat.color}15, ${cat.color}08)`, border:`1px solid ${cat.color}30`,
                    transition:'all 0.2s'}}>
                  <span style={{fontSize:'22px'}}>{cat.icon}</span>
                  <span style={{flex:1, fontSize:'15px', fontWeight:'700', color:'#fff', letterSpacing:'0.5px'}}>{cat.title}</span>
                  <span style={{fontSize:'10px', color:'rgba(255,255,255,0.3)', marginRight:'4px'}}>{cat.sections.length}项</span>
                  <span style={{color:'rgba(255,255,255,0.3)', fontSize:'12px', transition:'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none'}}>&#9654;</span>
                </div>
                {/* 子条目 - 支持sub二级折叠 */}
                {isExpanded && (
                  <div style={{marginTop:'6px', marginLeft:'8px', borderLeft:`2px solid ${cat.color}30`, paddingLeft:'12px'}}>
                    {cat.sections.map((sec, si) => {
                      const secKey = `${cat.id}_${si}`;
                      const autoOpen = q && sec.sub && sec.sub.some(item => item.t.toLowerCase().includes(q) || item.c.toLowerCase().includes(q));
                      const secOpen = autoOpen || (guideExpanded[secKey] !== undefined ? guideExpanded[secKey] : false);
                      const hasSub = sec.sub && sec.sub.length > 0;
                      return (
                        <div key={si} style={{marginBottom:'4px'}}>
                          <div
                            onClick={() => hasSub && setGuideExpanded(prev => ({...prev, [secKey]: !secOpen}))}
                            style={{padding:'10px 12px', borderRadius:'8px', background: secOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.04)', cursor: hasSub ? 'pointer' : 'default', transition:'background 0.15s', display:'flex', alignItems:'center', gap:'8px'}}
                            onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; }}
                            onMouseOut={e => { e.currentTarget.style.background= secOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'; }}>
                            <span style={{width:'6px', height:'6px', borderRadius:'50%', background:cat.color, flexShrink:0}} />
                            <span style={{flex:1, fontSize:'13px', fontWeight:'700', color:'rgba(255,255,255,0.92)'}}>{sec.title}</span>
                            {hasSub && <span style={{fontSize:'10px', color:'rgba(255,255,255,0.3)', marginRight:'2px'}}>{sec.sub.length}条</span>}
                            {hasSub && <span style={{color:'rgba(255,255,255,0.3)', fontSize:'10px', transition:'transform 0.2s', transform: secOpen ? 'rotate(90deg)' : 'none'}}>▶</span>}
                          </div>
                          {hasSub && secOpen && (
                            <div style={{marginLeft:'16px', marginTop:'4px', display:'flex', flexDirection:'column', gap:'3px'}}>
                              {sec.sub.map((item, idx) => (
                                <div key={idx} style={{padding:'8px 12px', borderRadius:'6px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)'}}>
                                  <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.95)', marginBottom:'4px'}}>{item.t}</div>
                                  <div style={{fontSize:'11.5px', lineHeight:'1.75', color:'rgba(255,255,255,0.85)', whiteSpace:'pre-line'}}>
                                    {q ? highlightSearch(item.c, q) : item.c}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {!hasSub && sec.content && (
                            <div style={{padding:'4px 12px 8px 20px', fontSize:'12px', lineHeight:'1.7', color:'rgba(255,255,255,0.88)', whiteSpace:'pre-line'}}>
                              {q ? highlightSearch(sec.content, q) : sec.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const highlightSearch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={i} style={{background:'rgba(255,193,7,0.3)', color:'#FFD54F', borderRadius:'2px', padding:'0 1px'}}>{part}</span>
        : part
    );
  };

  // ==========================================
  // 成就系统 - 渲染
  // ==========================================
  const renderAchievements = () => {
    const total = ACHIEVEMENTS.length;
    const unlocked = unlockedAchs.length;
    const pct = Math.round((unlocked / total) * 100);
    const cats = ['ALL', ...Object.keys(ACH_CATEGORY)];
    const filtered = achCatFilter === 'ALL' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === achCatFilter);
    return (
      <div style={{position:'fixed', inset:0, background:'linear-gradient(170deg, #0a0a1a 0%, #111827 50%, #0a1628 100%)', zIndex:3000, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        {/* Header */}
        <div style={{padding:'20px 24px 16px', background:'rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px'}}>
            <button onClick={() => setView(hasSave && party.length > 0 ? (mapGrid.length > 0 ? 'grid_map' : 'world_map') : 'menu')} style={{background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', padding:'8px 16px', borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:'600'}}>← 返回</button>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'22px', fontWeight:'900', color:'#fff', letterSpacing:'2px'}}>成就大厅</div>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'2px'}}>{unlocked} / {total} 已解锁</div>
            </div>
            <div style={{width:'70px'}} />
          </div>
          {/* Progress bar */}
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{flex:1, height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden'}}>
              <div style={{width:`${pct}%`, height:'100%', borderRadius:'4px', background:'linear-gradient(90deg, #FFD700, #FF8F00)', transition:'width 0.5s', boxShadow:'0 0 10px rgba(255,215,0,0.3)'}} />
            </div>
            <span style={{fontSize:'13px', color:'#FFD700', fontWeight:'800', flexShrink:0}}>{pct}%</span>
          </div>
          {/* Category tabs */}
          <div style={{display:'flex', gap:'6px', marginTop:'12px', overflowX:'auto', paddingBottom:'4px'}}>
            {cats.map(c => {
              const isAll = c === 'ALL';
              const cat = ACH_CATEGORY[c];
              const active = achCatFilter === c;
              return (
                <button key={c} onClick={() => setAchCatFilter(c)} style={{
                  background: active ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
                  border: active ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: active ? '#FFD700' : 'rgba(255,255,255,0.5)',
                  padding:'5px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:'700',
                  cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s'
                }}>
                  {isAll ? '全部' : `${cat.icon} ${cat.name}`}
                </button>
              );
            })}
          </div>
        </div>
        {/* Achievement grid - 滚动容器与Grid分离，防止flex+grid压缩行高 */}
        <div style={{flex:1, overflowY:'auto', padding:'16px 20px'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'10px'}}>
            {filtered.map(ach => {
              const done = unlockedAchs.includes(ach.id);
              const cat = ACH_CATEGORY[ach.cat];
              const rar = ACH_RARITY[ach.rarity];
              const isHidden = ach.hidden && !done;
              return (
                <div key={ach.id} style={{
                  background: done ? `linear-gradient(135deg, ${rar.color}12, ${rar.color}06)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${done ? `${rar.color}40` : 'rgba(255,255,255,0.04)'}`,
                  borderRadius:'14px', padding:'14px 16px', position:'relative',
                  opacity: done ? 1 : 0.6, transition:'all 0.2s'
                }}>
                  {done && <div style={{position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${rar.color}, transparent)`, borderRadius:'14px 14px 0 0'}} />}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', flex:1, minWidth:0}}>
                      <div style={{
                        width:'36px', height:'36px', borderRadius:'10px', flexShrink:0,
                        background: done ? `linear-gradient(135deg, ${rar.color}30, ${rar.color}15)` : 'rgba(255,255,255,0.04)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'18px', border: done ? `1px solid ${rar.color}40` : '1px solid rgba(255,255,255,0.06)'
                      }}>
                        {done ? (cat?.icon || '🏆') : (isHidden ? '❓' : cat?.icon || '📋')}
                      </div>
                      <div style={{minWidth:0, flex:1}}>
                        <div style={{fontSize:'13px', fontWeight:'800', color: done ? '#fff' : 'rgba(255,255,255,0.5)'}}>
                          {isHidden ? '???' : ach.name}
                        </div>
                        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'1px', lineHeight:'1.4'}}>
                          {isHidden ? (ach.hint || '达成隐藏条件后解锁') : ach.desc}
                        </div>
                      </div>
                    </div>
                    <div style={{flexShrink:0, fontSize:'10px', letterSpacing:'1px', color: done ? rar.color : 'rgba(255,255,255,0.15)', marginLeft:'6px'}}>
                      {'★'.repeat(rar.stars)}{'☆'.repeat(5 - rar.stars)}
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'4px', flexWrap:'wrap'}}>
                    <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:`${rar.color}15`, color:rar.color, fontWeight:'700', border:`1px solid ${rar.color}20`}}>
                      {rar.name}
                    </span>
                    {ach.reward?.gold && (
                      <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:'rgba(255,215,0,0.1)', color:'#FFD700', fontWeight:'700'}}>
                        +{ach.reward.gold.toLocaleString()} 金币
                      </span>
                    )}
                    {ach.reward?.title && (
                      <span style={{fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:'rgba(156,39,176,0.1)', color:'#CE93D8', fontWeight:'700'}}>
                        称号: {ach.reward.title}
                      </span>
                    )}
                    {done && <span style={{marginLeft:'auto', fontSize:'10px', color:'#43a047', fontWeight:'700'}}>✓ 已完成</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLocked = () => (
      <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
         <div style={{fontSize: '60px', marginBottom: '20px'}}>🔒</div>
         <h2 style={{marginBottom: '10px'}}>功能尚未开放</h2>
         <button onClick={() => setView(hasSave && party.length > 0 ? getBackToMapView() : 'menu')} style={{padding: '12px 40px', fontSize: '16px', borderRadius: '25px', border: 'none', cursor: 'pointer', background: '#fff', color: '#333', fontWeight: 'bold'}}>返回 (Space)</button>
      </div>
  );


    // ==========================================
  // [修复] 战斗联盟界面 (修复了未解锁状态的语法错误)
  // ==========================================
  const renderLeague = () => {
    // 检查解锁条件 (通关冠军之路后解锁)
    const isUnlocked = storyProgress >= 12;

    // --- 1. 未解锁状态 (显示锁定提示) ---
    if (!isUnlocked) {
        return (
            <div className="screen" style={{background:'#263238', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexDirection:'column'}}>
                <div style={{fontSize:'50px', marginBottom:'20px'}}>🔒</div>
                <div>战斗联盟尚未开放</div>
                <div style={{fontSize:'12px', color:'#999', marginTop:'10px'}}>需通关【冠军之路】剧情后解锁</div>
                
                {/* 返回按钮 */}
                <button 
                    style={{
                        marginTop:'30px', color:'#fff', background:'#304FFE',
                        border:'1px solid #fff', padding:'10px 30px', 
                        borderRadius:'20px', cursor:'pointer', fontWeight:'bold'
                    }} 
                    onClick={() => setView('grid_map')} // 返回地图
                >
                    🔙 返回
                </button>
            </div>
        );
    }

    // --- 2. 已解锁状态 (显示联盟主界面) ---
    const rounds = [
        { id: 1, name: '16强赛', opponents: 16 },
        { id: 2, name: '8强赛', opponents: 8 },
        { id: 3, name: '半决赛', opponents: 4 },
        { id: 4, name: '总决赛', opponents: 2 }
    ];

    return (
      <div className="screen" style={{background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', color:'#fff', display:'flex', flexDirection:'column'}}>
        <div className="nav-header glass-panel" style={{background:'rgba(0,0,0,0.3)', borderBottom:'none'}}>
          <button className="btn-back" 
            style={{
                color:'#fff', 
                background:'#304FFE', 
                border:'1px solid #fff', 
                padding:'5px 15px', 
                borderRadius:'20px', 
                cursor:'pointer',
                fontWeight: 'bold'
            }} 
            onClick={() => setView('grid_map')}
          >
            🔙 退出联盟
          </button>
          <div className="nav-title">🏆 世界战斗联盟</div>
          <div style={{width:60}}></div>
        </div>

        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'20px', overflowY:'auto'}}>
            
            {/* 冠军奖杯展示 */}
            <div style={{textAlign:'center', marginBottom:'30px'}}>
                <div style={{fontSize:'60px', filter:'drop-shadow(0 0 10px gold)'}}>🏆</div>
                <div style={{fontSize:'24px', fontWeight:'bold', margin:'10px 0'}}>
                    历史夺冠次数: <span style={{color:'#FFD700', fontSize:'32px'}}>{leagueWins}</span>
                </div>
                <div style={{fontSize:'12px', opacity:0.8}}>与世界各地的顶尖训练家一决高下！</div>
            </div>

            {/* 赛程进度 */}
            <div style={{width:'100%', maxWidth:'400px', display:'flex', flexDirection:'column', gap:'15px'}}>
                {rounds.map(r => {
                    const isCurrent = leagueRound === r.id;
                    const isPassed = leagueRound > r.id;
                    const isFuture = leagueRound < r.id && leagueRound !== 0;
                    
                    let statusColor = '#5c6bc0'; // 默认蓝
                    if (isCurrent) statusColor = '#FFD700'; // 当前金
                    else if (isPassed) statusColor = '#4CAF50'; // 已过绿
                    else if (leagueRound === 0) statusColor = '#78909c'; // 未开始灰

                    return (
                        <div key={r.id} style={{
                            background: isCurrent ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `2px solid ${statusColor}`,
                            borderRadius: '12px', padding: '15px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            opacity: isFuture ? 0.5 : 1,
                            transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                            transition: '0.3s'
                        }}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div style={{
                                    width:'30px', height:'30px', borderRadius:'50%', 
                                    background: statusColor, color: isCurrent?'#000':'#fff',
                                    display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'
                                }}>
                                    {isPassed ? '✓' : r.id}
                                </div>
                                <div style={{fontWeight:'bold', fontSize:'16px', color: isCurrent?'#FFD700':'#fff'}}>
                                    {r.name}
                                </div>
                            </div>
                            <div style={{fontSize:'12px', opacity:0.7}}>
                                {isCurrent ? '正在进行' : (isPassed ? '已晋级' : '等待中')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 操作按钮 */}
            <div style={{marginTop:'auto', width:'100%', maxWidth:'300px', paddingTop:'20px'}}>
                {leagueRound === 0 ? (
                    <button onClick={() => {
                        if(party.length < 1) { alert("请先携带精灵！"); return; }
                        setLeagueRound(1);
                    }} style={{
                        width:'100%', padding:'15px', borderRadius:'30px', border:'none',
                        background: 'linear-gradient(90deg, #FFC107, #FF9800)',
                        color:'#fff', fontSize:'18px', fontWeight:'bold', cursor:'pointer',
                        boxShadow: '0 5px 15px rgba(255, 152, 0, 0.4)'
                    }}>
                        报名参赛
                    </button>
                ) : (
                    <button onClick={() => startBattle(null, 'league')} style={{
                        width:'100%', padding:'15px', borderRadius:'30px', border:'none',
                        background: 'linear-gradient(90deg, #F44336, #D32F2F)',
                        color:'#fff', fontSize:'18px', fontWeight:'bold', cursor:'pointer',
                        boxShadow: '0 5px 15px rgba(211, 47, 47, 0.4)',
                        animation: 'pulse 1.5s infinite'
                    }}>
                        ⚔️ 开始比赛
                    </button>
                )}
                
                {leagueRound > 0 && (
                    <div style={{textAlign:'center', marginTop:'10px', fontSize:'12px', color:'#aaa', cursor:'pointer', textDecoration:'underline'}}
                         onClick={() => { if(confirm("确定要弃权吗？进度将丢失。")) setLeagueRound(0); }}>
                        放弃比赛
                    </div>
                )}
            </div>

        </div>
      </div>
    );
  };

    // ==========================================
  // [修改] 初始精灵生成 (预先生成完整个体，保证所见即所得)
  // ==========================================
  const generateStarterOptions = () => {
    // 1. 找出所有“是进化型”的ID
    const evolvedIds = new Set();
    POKEDEX.forEach(p => {
      if (p.evo) evolvedIds.add(p.evo);
    });

    // 2. 动态筛选合法的初始精灵(排除进化型、神兽、高级、种族值>450)
    const validStarters = POKEDEX.filter(p => {
      if (!p || !p.id) return false;
      if (evolvedIds.has(p.id)) return false;
      if (LEGENDARY_POOL.includes(p.id)) return false;
      if (HIGH_TIER_POOL.includes(p.id)) return false;
      if (NEW_GOD_IDS.includes(p.id)) return false;
      const bias = TYPE_BIAS[p.type] || { p: 1.0, s: 1.0 };
      const div = (p.id % 5) * 2 - 4;
      const bst = (p.hp || 60) + Math.floor((p.atk || 50) * bias.p) + div + Math.floor((p.def || 50) * bias.p) + Math.floor((p.atk || 50) * bias.s) - div + Math.floor((p.def || 50) * bias.s) + (p.spd || (40 + (p.id * 7 % 70)));
      if (bst > 450) return false;
      return true;
    });

    // 3. 随机取 3 个，并立即实例化 (生成性格/个体值)
    const shuffled = _.shuffle(validStarters);
    const selectedBase = shuffled.slice(0, 3);
    
    // 🔥 关键修改：在这里直接 createPet，锁定数值
    const fullyFormedStarters = selectedBase.map(base => {
        return createPet(base.id, 5); // 生成 5 级精灵
    });
    
    setStarterOptions(fullyFormedStarters);
  };

   // ----------------------------------------
  // [修正] 动态技能生成 (添加 acc 命中率)
  // ----------------------------------------
  const getMoveByLevel = (type, level) => {
    const db = SKILL_DB[type] || SKILL_DB.NORMAL;
    const index = Math.floor(level / 5); 
    
    const template = db[index % db.length];
    let name = template.name;
    let power = (template.p !== undefined) ? template.p : 40;
    let pp = template.pp || 15;
    
    // [Issue 2] 默认命中率 100，威力越大概率越低
    let acc = template.acc || 100; 
    if (power >= 120) acc = 85;
    if (power >= 150) acc = 75; // 强力技能容易打空

    const tier = Math.floor(index / db.length);
    if (power > 0) {
        if (tier === 1) {
            name = `真·${name}`;
            power = Math.floor(power * 1.3);
        } else if (tier === 2) {
            name = `超·${name}`;
            power = Math.floor(power * 1.6);
        } else if (tier >= 3) {
            name = `神·${name}`;
            power = Math.floor(power * 2.2);
        }
    }

    return { name, p: power, t: type, pp, maxPP: pp, val: template.val, effect: template.effect, acc, desc: template.desc || '' };
  };


   const useBerry = (petIdx) => {
    if (inventory.berries <= 0) return;
    const t = [...party];
    const p = t[petIdx];
    const stats = getStats(p);
    
    // 即使满血也可以喂食来增加亲密度，除非亲密度也满了
    if (p.currentHp >= stats.maxHp && (p.intimacy || 0) >= 255) { 
        alert("它已经吃饱了，而且非常喜欢你！"); 
        return; 
    }
    
    // 恢复体力
    p.currentHp = Math.min(stats.maxHp, p.currentHp + 30);
    p.exp += 20;
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    const oldInt = p.intimacy || 0;
    p.intimacy = Math.min(255, oldInt + 3);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    setInventory(prev => ({...prev, berries: prev.berries - 1}));
    
    // 提示变化
    if (p.intimacy > oldInt) {
        // 简单的爱心特效提示，这里用 alert 或者 log 都可以
        // 如果是在战斗外，alert 比较合适
        // alert(`${p.name} 吃得很开心！(亲密度 +3)`); 
    }
  };


   // [修正] 使用伤药 (适配 inventory.meds)
  const usePotion = (petIdx) => {
    if ((inventory.meds.potion || 0) <= 0) { alert("没有伤药了！"); return; }
    
    const t = [...party];
    const p = t[petIdx];
    const stats = getStats(p);
    if (p.currentHp >= stats.maxHp) { alert("体力已满。"); return; }
    
    // 恢复逻辑
    p.currentHp = Math.min(stats.maxHp, p.currentHp + 20); 
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    
    setInventory(prev => ({
        ...prev, 
        meds: { ...prev.meds, potion: prev.meds.potion - 1 }
    }));
    alert(`使用了伤药，${p.name} 恢复了体力！(亲密度 +1)`);
  };

    // [修正] 使用PP补剂 (适配 inventory.meds)
  const useEther = (petIdx) => {
    // 修改点：从 inventory.meds.ether 读取
    if ((inventory.meds.ether || 0) <= 0) { alert("没有PP补剂了！"); return; }
    
    const t = [...party];
    const p = t[petIdx];
    
    let restored = false;
    p.moves.forEach(m => {
      if (m.pp < (m.maxPP || 15)) {
        m.pp = Math.min((m.maxPP || 15), m.pp + 10);
        restored = true;
      }
    });

    if (!restored) {
      alert("技能点数已满，无需使用。");
      return;
    }
    
    // ▼▼▼ [新增] 增加亲密度 ▼▼▼
    p.intimacy = Math.min(255, (p.intimacy || 0) + 1);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(t);
    // 修改点：扣除 inventory.meds.ether
    setInventory(prev => ({
        ...prev, 
        meds: { ...prev.meds, ether: prev.meds.ether - 1 }
    }));
    alert(`${p.name} 的技能 PP 得到了恢复！(亲密度 +1)`);
  };

const useGrowthItem = (petIndex, itemId) => {
    const item = GROWTH_ITEMS.find(i => i.id === itemId);
    if (!item || (inventory[itemId] || 0) <= 0) return;

    const newParty = [...party];
    const pet = newParty[petIndex];

    // 初始化培养加成记录 (evs)
    if (!pet.evs) pet.evs = {};
    if (!pet.evs[item.stat]) pet.evs[item.stat] = 0;

    // 增加属性
    pet.evs[item.stat] += item.val;
    
    // 扣除道具
    const newInv = { ...inventory };
    newInv[itemId]--;

    // 如果是HP道具，顺便回点血
    if (item.stat === 'maxHp') {
        pet.currentHp += item.val;
    }

    setParty(newParty);
    setInventory(newInv);
    
    alert(`${pet.name} 使用了 ${item.name}！\n${item.desc} +${item.val}`);
  };
  const setLeader = (index) => {
    if (index === 0) return;
    const newTeam = [...party];
    const [leader] = newTeam.splice(index, 1);
    newTeam.unshift(leader);
    setParty(newTeam);
  };

      const enterMap = (mapId) => {
    
    setCurrentMapId(mapId);

    // 2. 剧情触发 (保持不变)
    const currentChapter = STORY_SCRIPT[storyProgress];
    if (currentChapter && currentChapter.mapId === mapId && storyStep === 0) {
       if (!viewedIntros.includes(storyProgress)) {
            setDialogQueue(currentChapter.intro);
            setCurrentDialogIndex(0);
            setIsDialogVisible(true);
            setViewedIntros(prev => [...prev, storyProgress]);
        }
    }

    // 3. 生成地图网格
    let newGrid; // <--- 在这里声明

    // ▼▼▼▼▼▼ 特殊地图生成：日蚀要塞 (ID 99) ▼▼▼▼▼▼
    if (mapId === 99) {
        // 创建全障碍地图
        newGrid = Array(GRID_H).fill(0).map(() => Array(GRID_W).fill(1));
        
        // 挖出一条中间大道
        const midY = Math.floor(GRID_H / 2);
        for (let x = 1; x < GRID_W - 1; x++) {
            newGrid[midY][x] = 2;     // 地面
            newGrid[midY-1][x] = 2;   // 宽一点的路
            newGrid[midY+1][x] = 2;
        }

        // 放置敌人 (Tile 11: 杂兵, 12: 干部, 13: 首领)
        const enemyPositions = [
            {x: 4, type: 11}, {x: 6, type: 11}, {x: 8, type: 11}, {x: 10, type: 11}, // 4个杂兵
            {x: 13, type: 12}, {x: 15, type: 12}, {x: 17, type: 12}, // 3个干部
            {x: 20, type: 12}, {x: 22, type: 12}, // 2个精英干部
            {x: 26, type: 13}  // 1个首领
        ];

        enemyPositions.forEach(e => {
            newGrid[midY][e.x] = e.type;
            // 封路，强制战斗
            newGrid[midY-1][e.x] = 1; 
            newGrid[midY+1][e.x] = 1;
        });

        // 出生点
        newGrid[midY][1] = 2;
        newGrid[midY][2] = 8; // 恢复点
        
        setPlayerPos({x: 1, y: midY});
        
        setDialogQueue([
            { name: '系统', text: '警告：检测到极高能量反应！' },
            { name: '大木博士', text: '这里就是日蚀队的总部...他们似乎在进行某种可怕的实验。' },
            { name: '日蚀队广播', text: '入侵者！你竟敢踏入这片圣地！全员戒备，格杀勿论！' }
        ]);
        setCurrentDialogIndex(0);
        setIsDialogVisible(true);

    } else {
        // ▼▼▼▼▼▼ [修正点] 这里不要用 const newGrid，直接赋值给外面的 newGrid ▼▼▼▼▼▼
        newGrid = Array(GRID_H).fill(0).map(() => Array(GRID_W).fill(2));
        
        // ... (这里保留你原有的随机生成逻辑，不要动) ...
        for(let y=0; y<GRID_H; y++) {
          for(let x=0; x<GRID_W; x++) {
            if (y===0 || y===GRID_H-1 || x===0 || x===GRID_W-1) {
              newGrid[y][x] = 1;
            } else {
              const rand = Math.random();
              if (rand < 0.12) newGrid[y][x] = 1; 
              else if (rand < 0.16) newGrid[y][x] = 3; 
              else if (rand < 0.19) newGrid[y][x] = 6; 
              else if (rand < 0.25) newGrid[y][x] = 5; 
              else if (rand < 0.35) newGrid[y][x] = 7; 
            }
          }
        }
        // 清理出生点和固定设施...
        const clearArea = (cx, cy) => {
          for(let dy=-1; dy<=1; dy++) {
            for(let dx=-1; dx<=1; dx++) {
              if (newGrid[cy+dy] && newGrid[cy+dy][cx+dx]) newGrid[cy+dy][cx+dx] = 2;
            }
          }
        };
        clearArea(1, 2); 
        clearArea(GRID_W-2, GRID_H-2); 
        newGrid[1][1] = 8; 
        newGrid[1][2] = 10; 
        newGrid[GRID_H-2][GRID_W-2] = 9; 
        for(let i=0; i<5; i++) {
          let rx, ry;
          do { rx = _.random(1, GRID_W-2); ry = _.random(1, GRID_H-2); } while(newGrid[ry][rx] !== 2);
          newGrid[ry][rx] = 4;
        }
        if (currentChapter && currentChapter.mapId === mapId && currentChapter.tasks) {
           const currentTask = currentChapter.tasks.find(t => t.step === storyStep);
           if (currentTask) {
              newGrid[currentTask.y][currentTask.x] = 99; 
           }
        }
        setPlayerPos({x: 1, y: 2}); 
    }
     // 每张地图都放置活动NPC (捕虫20/钓鱼21/选美22 轮换)
        if (mapId >= 1 && mapId <= 13) {
            const activityTiles = [20, 21, 22];
            const placeActivity = (tileType) => {
                const candidates = [];
                for (let y = 2; y < GRID_H - 2; y++) {
                    for (let x = 2; x < GRID_W - 2; x++) {
                        if (newGrid[y][x] === 2) candidates.push({x, y});
                    }
                }
                if (candidates.length > 0) {
                    const pos = candidates[Math.floor(Math.random() * candidates.length)];
                    newGrid[pos.y][pos.x] = tileType;
                    return true;
                }
                return false;
            };
            activityTiles.forEach(tile => placeActivity(tile));
        }

    // 随机放置家具拾取点 (2-3个, 25%概率出现)
    const furnitureCount = _.random(2, 3);
    for (let fi = 0; fi < furnitureCount; fi++) {
        if (Math.random() < 0.25) continue;
        const fx = _.random(2, GRID_W - 3);
        const fy = _.random(2, GRID_H - 3);
        if (newGrid[fy][fx] === 2) newGrid[fy][fx] = FURNITURE_TILE;
    }

    // 随机放置果实树 (1-2棵, 30%概率)
    const fruitTreeCount = _.random(1, 2);
    for (let ft = 0; ft < fruitTreeCount; ft++) {
        if (Math.random() < 0.3) continue;
        const ftx = _.random(2, GRID_W - 3);
        const fty = _.random(2, GRID_H - 3);
        if (newGrid[fty][ftx] === 2) newGrid[fty][ftx] = 14;
    }

    setMapGrid(newGrid);
    setView('grid_map');
  };

    // ==========================================
  // 核心：移动交互与事件触发逻辑
  // ==========================================
  useEffect(() => {
    if (playerPos.intent) {
      const { x, y, dx, dy } = playerPos;
      // 立即重置意图，防止重复触发
      setPlayerPos(prev => ({...prev, intent: false}));
      
      // ------------------------------------------------
      // 1. 边界检查
      // ------------------------------------------------
      if (x < 0 || x >= GRID_W || y < 0 || y >= GRID_H) {
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      if (!mapGrid[y]) {
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }
      const tileType = mapGrid[y][x];

      // ------------------------------------------------
      // 2. 障碍物 (Tile 1)
      // ------------------------------------------------
      if (tileType === 1) {
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      // ------------------------------------------------
      // 3. 日蚀队敌人 (Tile 11: 杂兵, 12: 干部, 13: 首领)
      // ------------------------------------------------
      if (tileType === 11) {
          // 撞到杂兵 -> 触发战斗 -> 玩家回弹
          const gruntLvl = _.random(80, 85);
          const gruntPool = [169, 181, 185, 186, 188, 189]; 
          startBattle({
              id: 999,
              name: '日蚀队 突击兵',
              lvl: [gruntLvl, gruntLvl],
              pool: gruntPool,
              drop: 800
          }, 'eclipse_grunt');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }

      if (tileType === 12) {
          // 撞到干部 -> 触发战斗 -> 玩家回弹
          const execLvl = _.random(86, 89);
          const execPool = [139, 140, 182, 190, 206, 212]; 
          startBattle({
              id: 999,
              name: '日蚀队 干部',
              lvl: [execLvl, execLvl],
              pool: execPool,
              drop: 1500
          }, 'eclipse_executive');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }

      if (tileType === 13) {
          // 撞到首领 -> 确认 -> 触发战斗 -> 玩家回弹
          if (confirm("⚠️ 前方就是日蚀队首领！\n这是最后的决战，确定要开始吗？")) {
              startBattle(null, 'eclipse_leader');
          }
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      
      // 🔥 [修改] 遇到活动NPC，不再直接 confirm，而是打开详情弹窗
      if (tileType === 20) { // 捕虫
          setActivityModal('bug');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      if (tileType === 21) { // 钓鱼
          setActivityModal('fishing');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      if (tileType === 22) { // 选美
          setActivityModal('beauty');
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); // 回弹
          return;
      }
      // ------------------------------------------------
      // 4. 剧情任务点 (Tile 99)
      // ------------------------------------------------
      if (tileType === 99) {
        if (pendingTask || isDialogVisible) return;
        const currentChapter = STORY_SCRIPT[storyProgress];
        const task = currentChapter?.tasks?.find(t => t.step === storyStep);
        
        if (task) {
           setDialogQueue([{ name: task.name, text: task.text }]);
           setCurrentDialogIndex(0);
           setIsDialogVisible(true);

           setMapGrid(prev => {
               const newGrid = prev.map(row => [...row]);
               newGrid[y][x] = 2;
               return newGrid;
           });

           setPendingTask(task);
        }
        return; 
      }

      // 家具拾取点 (Tile 30)
      if (tileType === FURNITURE_TILE) {
        const pickupPool = FURNITURE_DB.filter(f => f.dropSource === 'pickup');
        if (pickupPool.length > 0) {
          const def = _.sample(pickupPool);
          const quality = rollQuality('pickup');
          const qualInfo = FURNITURE_QUALITY[quality];
          setHousing(prev => ({
            ...prev,
            furniture: [...prev.furniture, { baseId: def.id, quality, placed: false, slotIdx: null }],
          }));
          setMapGrid(prev => {
            const g = prev.map(r => [...r]);
            g[y][x] = 2;
            return g;
          });
          addLog(`🏠 捡到家具: ${def.icon} ${def.name} (${qualInfo.name})`);
          alert(`🏠 发现了 ${def.icon} ${def.name} (${qualInfo.name})!`);
        }
        return; 
      }

      // 果实树 (Tile 14)
      if (tileType === 14) {
        const fruitId = getRandomFruit(party[0]?.level || 10, 'wild');
        const fruit = getFruitById(fruitId);
        if (fruit) {
          setFruitInventory(prev => [...prev, fruitId]);
          setMapGrid(prev => {
            const g = prev.map(r => [...r]);
            g[y][x] = 2;
            return g;
          });
          addLog(`发现恶魔果实: ${fruit.name} [${FRUIT_RARITY_CONFIG[fruit.rarity]?.label}]!`);
          alert(`发现了 ${fruit.name} [${FRUIT_CATEGORY_NAMES[fruit.category]}]!\n${fruit.desc}`);
        }
        return;
      }

      // ------------------------------------------------
      // 5. 特殊地形交互 (水域/岩石)
      // ------------------------------------------------
      // 水域 (Tile 3) - 需要 4 个徽章
      if (tileType === 3) {
        if (badges.length < 4) {
          alert(`前方是深水区！\n需要获得 4 枚徽章才能使用【冲浪】通过。`);
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
          return;
        } else {
           // 有徽章可以通过，30%概率遇敌
           if (Math.random() < 0.3) setTimeout(() => startBattle(null, 'water_special'), 200);
        }
      }

      // 岩石 (Tile 6) - 需要 2 个徽章
      if (tileType === 6) {
        if (badges.length < 2) {
          alert(`巨大的岩石挡住了去路！\n需要获得 2 枚徽章才能使用【碎岩】通过。`);
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
          return;
        } else {
           // 碎岩成功：清除岩石
           setMapGrid(prev => {
               const newGrid = prev.map(row => [...row]);
               newGrid[y][x] = 2;
               return newGrid;
           });
           
           if (Math.random() < 0.5) {
              setTimeout(() => startBattle(null, 'rock_special'), 200);
           } else {
              setEventData({ type: 'LOOT', title: '碎岩成功', desc: '你粉碎了岩石！', reward: {} });
              setView('event');
           }
           return; 
        }
      }

      // ------------------------------------------------
      // 6. 宝箱 (Tile 4) - 综合掉落逻辑
      // ------------------------------------------------
      if (tileType === 4) {
        // 清除宝箱
        updateAchStat({ chestsOpened: 1 });
        setMapGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[y][x] = 2;
            return newGrid;
        });
        
        const rand = Math.random();
        let rewardTitle = "";
        let rewardDesc = "";

        if (rand < 0.3) {
            // 30% 金币
            const amt = _.random(200, 800);
            setGold(g => g + amt);
            rewardTitle = "获得金币"; rewardDesc = `获得 ${amt} 金币`;
        } else if (rand < 0.55) {
            // 25% 树果或普通球
            if (Math.random() < 0.5) {
                setInventory(prev => ({...prev, berries: prev.berries + 3}));
                rewardTitle = "采集成功"; rewardDesc = "获得 树果 x3";
            } else {
                setInventory(prev => ({...prev, balls: {...prev.balls, poke: prev.balls.poke + 3}}));
                rewardTitle = "发现遗失物"; rewardDesc = "获得 精灵球 x3";
            }
        } else if (rand < 0.7) {
            // 20% 药品
            const medKeys = Object.keys(MEDICINES);
            const medKey = _.sample(medKeys);
            const med = MEDICINES[medKey];
            setInventory(prev => ({...prev, meds: {...prev.meds, [medKey]: (prev.meds[medKey]||0) + 1}}));
            rewardTitle = "发现药品"; rewardDesc = `获得 ${med.icon} ${med.name}`;
        } else if (rand < 0.80) { 
            // 🔥 [新增] 10% 概率掉落经验糖果
            setInventory(prev => ({...prev, exp_candy: (prev.exp_candy||0) + 1}));
            rewardTitle = "甜蜜的惊喜"; rewardDesc = `获得 🍬 经验糖果 x1`;
        }  
        else if (rand < 0.9) { 
            // 10% 进化石
            const stoneKeys = Object.keys(EVO_STONES);
            const stoneKey = _.sample(stoneKeys);
            const stone = EVO_STONES[stoneKey];
            setInventory(prev => ({
                ...prev, 
                stones: { ...prev.stones, [stoneKey]: (prev.stones[stoneKey]||0) + 1 }
            }));
            rewardTitle = "神秘的石头"; rewardDesc = `获得 ${stone.icon} ${stone.name}`;
        } else if (rand < 0.93) {
            // 8% 特殊球
            const specialBalls = ['net', 'dusk', 'quick', 'timer', 'heal', 'ultra'];
            const ballKey = _.sample(specialBalls);
            const ball = BALLS[ballKey];
            setInventory(prev => ({...prev, balls: {...prev.balls, [ballKey]: prev.balls[ballKey] + 1}}));
            rewardTitle = "发现珍贵球"; rewardDesc = `获得 ${ball.icon} ${ball.name}`;
        } else if (rand < 0.98) {
            // 5% 技能书
            const tm = _.sample(ALL_SKILL_TMS);
            setInventory(prev => ({...prev, tms: {...prev.tms, [tm.id]: (prev.tms[tm.id]||0) + 1}}));
            rewardTitle = "古老的秘籍"; rewardDesc = `获得 📜 ${tm.name} (技能书)`;
        } else if (rand < 0.99) {
             // 1% 随机装备
             const baseEquip = _.sample(RANDOM_EQUIP_DB);
             const newEquip = createUniqueEquip(baseEquip.id);
             setAccessories(prev => [...prev, newEquip]);
             rewardTitle = "神秘宝藏"; rewardDesc = `获得 ${newEquip.icon} ${newEquip.displayName}`;
        } else {
            // 1% 洗练药
            setInventory(prev => ({...prev, misc: {...prev.misc, rebirth_pill: (prev.misc.rebirth_pill||0) + 1}}));
            rewardTitle = "传说宝藏"; rewardDesc = `获得 💊 洗练药`;
        }
        
        addGlobalLog(rewardDesc);
        setEventData({ type: 'LOOT', title: rewardTitle, desc: rewardDesc, reward: {} });
        setView('event');
        return;
      }

      // ------------------------------------------------
      // 7. 建筑交互 (道馆/中心/商店)
      // ------------------------------------------------
      // 道馆 (Tile 9)
      if (tileType === 9) {
        const mapInfo = MAPS.find(m => m.id === currentMapId);
        
        const currentChapter = STORY_SCRIPT[storyProgress];
        const storyNeedsThisGym = currentChapter && currentChapter.mapId === currentMapId;
        
        if (badges.includes(mapInfo.badge) && !storyNeedsThisGym) { 
          alert("你已经战胜过这里的馆主了！"); 
          setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
          return; 
        }
        
        if (storyNeedsThisGym && currentChapter.tasks) {
            const unfinishedTask = currentChapter.tasks.find(t => t.step >= storyStep);
            if (unfinishedTask) {
                alert(`⛔ 无法进入道馆！\n\n必须先完成剧情任务：\n${currentChapter.objective}`);
                setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
                return;
            }
        }

        if (confirm(`前方是【${mapInfo.name}道馆】\n是否进入？`)) {
            startBattle(mapInfo, 'gym'); 
        } else {
            setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        }
        return;
      }

      // 宝可梦中心 (Tile 8)
      if (tileType === 8) {
        if (confirm("抵达宝可梦中心！\n要恢复所有伙伴的体力吗？")) {
          setParty(prev => prev.map(p => ({
              ...p, 
              currentHp: getStats(p).maxHp, 
              moves: p.moves.map(m=>({...m, pp: m.maxPP || 15})) 
          })));
          alert("队伍已完全恢复！");
        }
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy })); 
        return;
      }

      // 商店 (Tile 10)
      if (tileType === 10) {
        setShopMode(true);
        setPlayerPos(prev => ({ x: prev.x - dx, y: prev.y - dy }));
        return;
      }

      // ------------------------------------------------
      // 8. 暗雷遇敌 (Tile 2, 5, 7)
      // ------------------------------------------------
      // 增加地图探索度
      setMapProgress(prev => ({ ...prev, [currentMapId]: Math.min(100, (prev[currentMapId]||0) + 1) }));
      updateAchStat({ totalSteps: 1 });

      const roll = Math.random();
      const mapInfo = MAPS.find(m => m.id === currentMapId);
      const progress = mapProgress[currentMapId] || 0;
      
      // 区域Boss (探索度满后概率触发)
      if (mapInfo.boss && progress >= 100 && roll < 0.05) { 
        startBattle(mapInfo, 'boss'); 
        return; 
      }

      // 草丛 (Tile 7) 遇敌率更高
      let encounterRate = 0.05; 
      if (tileType === 7) encounterRate = 0.25; 
      
      if (roll < 0.02) {
          // 训练家战斗
          setTimeout(() => startBattle(mapInfo, 'trainer'), 200); 
      } else if (roll < 0.02 + encounterRate) {
          // 野生精灵战斗
          setTimeout(() => startBattle(mapInfo, 'wild'), 200);
      }
    }
  }, [playerPos, mapGrid, currentMapId, mapProgress, badges, inventory, storyProgress, storyStep]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view !== 'grid_map' || shopMode || pcMode) return;
      const hasPending = party.some(p => p.pendingLearnMove);
      if (hasPending) {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','s','a','d'].includes(e.key)) {
           alert("🛑 无法移动！\n队伍中有伙伴需要处理新技能。\n请进入 [伙伴] 界面进行操作。");
           setView('team');
        }
        return;
      }
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': handleMove(0, -1); break;
        case 'ArrowDown': case 's': case 'S': handleMove(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': handleMove(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handleMove, shopMode, pcMode, party]);

  const handleEventConfirm = () => {
    if (eventData.reward.gold) setGold(g => g + eventData.reward.gold);
    setEventData(null);
    setView('grid_map');
  };

    // (dead code removed - actual enterDungeon is in renderWorldMap)

  // ==========================================
  // [新增] 播放闪光特效逻辑
  // ==========================================
  const triggerShinyAnim = async (targetSide, pet) => {
    if (!pet || !pet.isShiny) return;
    
    // 稍微延迟一点，等精灵图片出来后再闪
    await wait(300);
    
    setAnimEffect({ type: 'SHINY_ENTRY', target: targetSide });
    // 播放音效提示 (这里用 log 代替)
    // addLog(`✨ ${pet.name} 闪闪发光！`);
    
    await wait(1000); // 特效持续时间
    setAnimEffect(null);
  };
// ==========================================
// [修复版] 通用结算函数 (自动识别精灵/物品)
// ==========================================
const grantContestReward = (config, score, subjectPet = null) => {
    // 1. 找到符合条件的最高一档奖励
    const rewardTier = config.tiers.find(t => score >= t.min);
    
    if (!rewardTier) {
        alert("系统错误：无法计算奖励");
        setView('grid_map');
        setActiveContest(null);
        return;
    }

    // 2. 更新排行榜
    const typeKey = config.id.split('_')[1]; 
    const currentRecord = activityRecords[typeKey] || 0;
    let isNewRecord = false;
    
    if (score > currentRecord) {
        setActivityRecords(prev => ({ ...prev, [typeKey]: score }));
        isNewRecord = true;
    }

    // 成就追踪
    if (typeKey === 'fishing') { updateAchStat({ fishingWins: 1 }); try { checkTreasureUnlock('event', { eventType: 'fishing' }); } catch(e) {} }
    if (typeKey === 'beauty') { updateAchStat({ beautyWins: 1 }); try { checkTreasureUnlock('event', { eventType: 'contest' }); } catch(e) {} }
    if (typeKey === 'bug') { updateAchStat({ bugContestWins: 1 }); try { checkTreasureUnlock('event', { eventType: 'bug_catching' }); } catch(e) {} }

    // 3. 🔥 核心修复：智能判断奖励类型 🔥
    // 如果配置里写了 type='pet' 或者 ID 是数字，就当作精灵处理
    const isPetReward = rewardTier.type === 'pet' || typeof rewardTier.id === 'number';
    
    let rewardInfo = { name: '', icon: '', type: '' };

    // --- 分支 A: 奖励是精灵 ---
    if (isPetReward) {
        // 奖励等级跟随当前地图等级（不超过地图上限，保证主线地图是核心成长路径）
        const mapInfo = MAPS.find(m => m.id === currentMapId);
        const rewardLvl = mapInfo ? Math.max(rewardTier.level, Math.floor((mapInfo.lvl[0] + mapInfo.lvl[1]) / 2)) : rewardTier.level;
        const rewardPet = createPet(rewardTier.id, rewardLvl, true, rewardTier.shiny);
        rewardPet.name = rewardTier.name; 
        
        // 2. 应用保底个体值
        const guaranteedV = rewardTier.ivs || 0;
        if (guaranteedV > 0) {
            const statKeys = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
            const perfectStats = _.sampleSize(statKeys, guaranteedV);
            perfectStats.forEach(key => { rewardPet.ivs[key] = 31; });
        }
        
        // 3. 重新计算属性并回满血
        const stats = getStats(rewardPet);
        rewardPet.currentHp = stats.maxHp;

        // 4. 🔥 强制入队/入库逻辑 🔥
        // 使用函数式更新确保状态最新
        if (party.length < 6) {
            setParty(prev => [...prev, rewardPet]);
            console.log("奖励精灵已加入队伍:", rewardPet.name);
        } else {
            setBox(prev => [...prev, rewardPet]);
            console.log("奖励精灵已存入盒子:", rewardPet.name);
            // 延迟提示，避免被结算弹窗遮挡
            setTimeout(() => alert(`📦 队伍已满，奖励 [${rewardPet.name}] 已发送到电脑盒子！`), 500);
        }
        
        // 5. 开图鉴
        if (!caughtDex.includes(rewardPet.id)) {
            setCaughtDex(prev => [...prev, rewardPet.id]);
        }

        // 6. 设置弹窗显示信息
        rewardInfo = { name: rewardPet.name, icon: '🐾', type: 'PET', pet: rewardPet };
    } 
    // --- 分支 B: 奖励是物品 ---
    else {
        const count = rewardTier.count || 1;
        const itemId = rewardTier.id;
        
        // 1. 精灵球
        if (['net', 'poke', 'great', 'ultra', 'master', 'dusk', 'quick', 'timer', 'heal'].includes(itemId)) {
            setInventory(prev => ({
                ...prev, 
                balls: {...prev.balls, [itemId]: (prev.balls[itemId]||0) + count}
            }));
            const ball = BALLS[itemId];
            rewardInfo = { name: `${ball.name} x${count}`, icon: ball.icon, type: 'ITEM' };
        } 
        // 2. 进化石
        else if (itemId.includes('stone')) {
            setInventory(prev => ({
                ...prev, 
                stones: {...prev.stones, [itemId]: (prev.stones[itemId]||0) + count}
            }));
            const stone = EVO_STONES[itemId];
            rewardInfo = { name: `${stone.name} x${count}`, icon: stone.icon, type: 'ITEM' };
        } 
        // 3. 增强剂
        else if (itemId.startsWith('vit_')) {
            setInventory(prev => ({...prev, [itemId]: (prev[itemId]||0) + count}));
            const item = GROWTH_ITEMS.find(g => g.id === itemId);
            rewardInfo = { name: `${item.name} x${count}`, icon: item.emoji, type: 'ITEM' };
        } 
        // 4. 默认树果
        else {
            setInventory(prev => ({...prev, berries: prev.berries + count}));
            rewardInfo = { name: `树果 x${count}`, icon: '🍒', type: 'ITEM' };
        }
    }

    // 额外奖励：最高档次有概率获得随机技能装备
    if (rewardTier === config.tiers[0] && Math.random() < 0.3) {
        const bonusBase = _.sample(['rng_grimoire', 'rng_sword', 'rng_shield', 'rng_heart']);
        const bonusEquip = createUniqueEquip(bonusBase);
        if (bonusEquip) {
            setAccessories(prev => [...prev, bonusEquip]);
            setTimeout(() => alert(`🎁 活动冠军额外奖励：${bonusEquip.displayName}！`), 800);
        }
    }

    // 4. 设置结算弹窗数据
    setResultData({
        title: config.name,
        type: config.id,
        score: score,
        subjectPet: subjectPet,
        tierName: rewardTier.name,
        tierMsg: rewardTier.msg,
        reward: rewardInfo,
        rankIdx: config.tiers.indexOf(rewardTier),
        isNewRecord: isNewRecord
    });

    // 退出战斗状态
    setBattle(null); 
};

    // ==========================================
  // [核心修复] 启动战斗 (含特性触发与完整逻辑)
  // ==========================================
  const startBattle = (context, type, challengeId = null) => {
     setIsDialogVisible(false); 
    const isBoss = type === 'boss' || type === 'challenge' || type === 'story_mid' || type === 'story_task' || type === 'eclipse_leader';
    const isGym = type === 'gym';
    const isStory = type === 'story_mid' || type === 'story_task';
    const isTrainer = type === 'trainer' || isGym || isStory || type === 'league' || type === 'pvp' || type === 'sect_challenge' || type.startsWith('eclipse_');
    
    let enemyParty = [];
    let trainerName = null;
    let dropGold = context?.drop || 200;
    let extraBattleData = {};

    // -------------------------------------------------
    // 1. PvP 对战
    // -------------------------------------------------
    if (type === 'pvp') {
        enemyParty = context.customParty.map(p => {
            const safeId = Number(p.id);
            const baseInfo = POKEDEX.find(d => d.id === safeId) || {};
            const stats = getStats(p);
            const moves = p.moves || []; 
            return {
                ...p,
                id: safeId,
                name: p.name || baseInfo.name || '未知精灵',
                emoji: p.emoji || baseInfo.emoji || '❓',
                type: p.type || baseInfo.type || 'NORMAL',
                uid: Date.now() + Math.random(),
                currentHp: stats.maxHp,
                status: null,
                // 确保 PvP 导入的数据也有特性字段，如果没有则随机一个
                trait: p.trait || Object.keys(TRAIT_DB)[Math.floor(Math.random() * 20)],
                stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
                volatiles: { protected: false, confused: 0, sleepTurns: 0, badlyPoisoned: 0 },
                combatMoves: moves,
                maxHp: stats.maxHp
            };
        });
        trainerName = context.trainerName || "神秘挑战者";
        dropGold = 5000;
    } 
    // -------------------------------------------------
    // 2. 战斗联盟
    // -------------------------------------------------
    else if (type === 'league') {
        const roundNames = ['16强赛', '8强赛', '半决赛', '总决赛'];
        const currentRoundName = roundNames[leagueRound - 1] || '比赛';
        trainerName = `联盟选手 (${currentRoundName})`;
        dropGold = 5000 + (leagueRound * 2000);
        for(let i=0; i<6; i++) {
            const pool = i === 5 ? [...FINAL_GOD_IDS, ...NEW_GOD_IDS] : [...HIGH_TIER_POOL, ...LEGENDARY_POOL]; 
            const enemyId = _.sample(pool);
            const isShiny = leagueRound === 4; 
            enemyParty.push(createPet(enemyId, 100, true, isShiny));
        }
    }
    // -------------------------------------------------
    // 3. 挑战塔
    // -------------------------------------------------
    else if (type === 'challenge') {
      const challenge = [...CHALLENGES, ...JJK_CHALLENGES].find(c => c.id === challengeId);
      if (!challenge) { alert("挑战数据未找到"); return; }
      const bossIsShiny = challenge.bossLvl >= 80;
      enemyParty.push(createPet(challenge.boss, challenge.bossLvl, true, bossIsShiny));
      const targetSize = challenge.teamSize || 6;
      while (enemyParty.length < targetSize) {
        const randomDex = _.random(1, 500); 
        const minionLvl = Math.max(10, challenge.bossLvl - _.random(3, 10));
        enemyParty.push(createPet(randomDex, minionLvl, true));
      }
      trainerName = `[挑战] ${challenge.title}`;
      const challengeTier = challenge.bossLvl <= 35 ? 1 : challenge.bossLvl <= 60 ? 2 : challenge.bossLvl <= 85 ? 3 : 4;
      dropGold = [500, 1000, 2000, 3000][challengeTier - 1];
    }
    // -------------------------------------------------
    // 4. 剧情中途 Boss
    // -------------------------------------------------
    else if (type === 'story_mid') {
       const currentChapter = STORY_SCRIPT[storyProgress];
       const enemyId = currentChapter.midEvent.enemyId;
       const mapInfo = MAPS.find(m => m.id === currentMapId);
       const lvl = (mapInfo?.lvl[0] || 5) + 5;
       enemyParty.push(createPet(enemyId, lvl, true)); 
       trainerName = currentChapter.midEvent.name;
       dropGold = 1000;
    }
    // -------------------------------------------------
    // 5. 剧情任务战斗 / 日蚀队杂兵
    // -------------------------------------------------
    else if (type === 'story_task' || type === 'eclipse_grunt') {
       const mapInfo = MAPS.find(m => m.id === currentMapId);
       const baseLvl = context.lvl ? context.lvl[0] : ((mapInfo?.lvl[0] || 5) + 3);
       if (context.eliteParty) {
         context.eliteParty.forEach((ep, i) => {
           const pet = createPet(ep.id, ep.level || baseLvl, true);
           if (ep.moves) pet.moves = ep.moves.map(m => typeof m === 'object' ? m : (SKILL_DB.find(s => s.name === m) || pet.moves[0]));
           if (ep.devilFruit) { pet.devilFruit = ep.devilFruit; pet.fruitUsed = false; pet.fruitTransformed = false; }
           enemyParty.push(pet);
         });
       } else {
         const enemyId = context.pool[0];
         enemyParty.push(createPet(enemyId, baseLvl, true));
       }
       trainerName = context.name;
       dropGold = context.drop || 500;
       if (context.storyTaskStep != null) extraBattleData.storyTaskStep = context.storyTaskStep;
    }
    // -------------------------------------------------
    // 6. 日蚀队干部
    // -------------------------------------------------
    else if (type === 'eclipse_executive') {
       const lvl = context.lvl[0];
       for(let i=0; i<3; i++) {
           enemyParty.push(createPet(_.sample(context.pool), lvl, true));
       }
       trainerName = context.name;
       dropGold = 1500;
    }
    // -------------------------------------------------
    // 7. 日蚀队首领 (最终BOSS)
    // -------------------------------------------------
    else if (type === 'eclipse_leader') {
        trainerName = "日蚀队 首领·虚空";
        dropGold = 10000;
        enemyParty.push(createPet(94, 90)); // 耿鬼
        enemyParty.push(createPet(139, 91)); // 班基拉斯
        enemyParty.push(createPet(182, 91)); // 暴飞龙
        enemyParty.push(createPet(140, 92)); // 巨金怪
        enemyParty.push(createPet(216, 92)); // 三首恶龙
        const boss = createPet(341, 95, true, true); // 暗黑超梦
        boss.name = "暗黑超梦";
        boss.customBaseStats = { hp: 120, p_atk: 160, p_def: 100, s_atk: 160, s_def: 100, spd: 140, crit: 25 };
        enemyParty.push(boss);
    }
    // -------------------------------------------------
    // 8. 道馆战
    // -------------------------------------------------
    else if (isGym) {
      const mapIndex = MAPS.findIndex(m => m.id === context.id);
      const progressRatio = mapIndex / (MAPS.length - 1); 
      const minWild = context.lvl[0];
      const maxWild = context.lvl[1];
      const mapAvg = Math.ceil((minWild + maxWild) / 2);
      const startLvl = Math.floor(mapAvg + (maxWild - mapAvg) * progressRatio * 0.8);
      const aceBonus = Math.floor(mapIndex * 0.8); 
      const aceLvl = maxWild + aceBonus;

      for(let i=0; i < 5; i++) {
        const step = (aceLvl - startLvl) / 5; 
        const currentLvl = Math.floor(startLvl + step * i);
        enemyParty.push(createPet(_.sample(context.pool), currentLvl));
      }
      const leaderPet = createPet(context.gymLeader, aceLvl, true);
      enemyParty.push(leaderPet);
      trainerName = `馆主 ${context.gymName || context.name.slice(0,2)}`;
    }
    // -------------------------------------------------
    // 9. 普通训练家
    // -------------------------------------------------
    else if (type === 'trainer') {
      const count = _.random(2, 3);
      for(let i=0; i<count; i++) {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1])));
      }
      trainerName = _.sample(TRAINER_NAMES);
    }
    // -------------------------------------------------
    // 10. 狩猎地带
    // -------------------------------------------------
    else if (type === 'safari') {
      const safariRoll = Math.random();
      let enemyId;
      if (safariRoll < 0.5) {
          enemyId = _.sample(NEW_GOD_IDS);
          alert("⚠️ 感知到太古神兽的气息！");
      } else if (safariRoll < 0.8) {
          const oldLegends = LEGENDARY_POOL.filter(id => id < 254);
          enemyId = _.sample(oldLegends);
          alert("⚠️ 传说中的精灵出现了！");
      } else {
          enemyId = _.sample(HIGH_TIER_POOL);
      }
      enemyParty.push(createPet(enemyId, _.random(90, 100), true)); 
      dropGold = 5000;
    }
    // -------------------------------------------------
    // 11. 特殊副本 (进化石/属性/闪光)
    // -------------------------------------------------
    else if (type === 'dungeon_stone') {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1]), true));
        dropGold = 1000;
        trainerName = "元素守护者";
    } else if (type === 'dungeon_stat') {
        enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1]), true));
        dropGold = 2000;
        trainerName = "试炼官";
    } else if (type === 'dungeon_shiny') {
        const enemyId = _.sample(context.pool);
        const isShiny = Math.random() < 0.5;
        enemyParty.push(createPet(enemyId, _.random(context.lvl[0], context.lvl[1]), false, isShiny));
        dropGold = 3000;
        trainerName = "稀有精灵";
    }
    // Boss Rush - 连战Boss塔
    else if (type === 'boss_rush') {
        const bossId = _.sample(context.pool);
        const boss = createPet(bossId, _.random(context.lvl[0], context.lvl[1]), true);
        boss.ivs = { hp: 31, p_atk: 31, p_def: 31, s_atk: 31, s_def: 31, spd: 31 };
        boss.currentHp = getStats(boss).maxHp;
        enemyParty.push(boss);
        dropGold = context.drop;
        trainerName = `Boss塔守卫`;
        extraBattleData = { bossRushWave: context.bossRushWave || 1 };
    }
    // 属性试炼场
    else if (type === 'type_challenge') {
        for (let i = 0; i < 2; i++) {
          enemyParty.push(createPet(_.sample(context.pool), _.random(context.lvl[0], context.lvl[1]), true));
        }
        dropGold = context.drop;
        trainerName = "属性导师";
        extraBattleData = { challengeType: context.challengeType };
    }
    // 生存竞技场
    else if (type === 'survival') {
        const enemyId = _.sample(context.pool);
        const survEnemy = createPet(enemyId, _.random(context.lvl[0], context.lvl[1]), true);
        enemyParty.push(survEnemy);
        dropGold = context.drop;
        trainerName = "竞技场挑战者";
        extraBattleData = { survivalWave: context.survivalWave || 1 };
    }
    // -------------------------------------------------
    // 12. 特殊事件 (碎岩/冲浪/神兽)
    // -------------------------------------------------
    else if (type === 'wild_god' || type === 'rock_special' || type === 'water_special') {
       let enemyId, level;
       if (type === 'wild_god') {
           enemyId = context.pool[0];
           level = _.random(context.lvl[0], context.lvl[1]);
           trainerName = "???";
       } else if (type === 'rock_special') {
           enemyId = _.sample(ROCK_POOL);
           level = _.random(20, 50);
           alert("🪨 岩石碎裂，有什么东西钻出来了！");
       } else {
           enemyId = _.sample(WATER_POOL);
           level = _.random(30, 60);
           alert("🌊 水面泛起涟漪，野生精灵出现了！");
       }
       enemyParty.push(createPet(enemyId, level, true));
       dropGold = 1000;
    }
    // -------------------------------------------------
    // 13. 无限城
    // -------------------------------------------------
    else if (type === 'infinity') {
        enemyParty = context.customParty;
        trainerName = context.name;
        dropGold = 0;
    }
    // -------------------------------------------------
    // 14. 门派首席挑战
    // -------------------------------------------------
    else if (type === 'sect_challenge') {
        enemyParty = context.customParty || [];
        trainerName = context.name || '门派首席';
        dropGold = context.drop || 10000;
    }
    // -------------------------------------------------
    // 15. 普通野怪 (兜底逻辑)
    // -------------------------------------------------
    else {
         if (!context || !context.lvl) {
             console.error("StartBattle Error: Invalid context for wild battle", context);
             alert("遭遇错误：无法生成野生精灵");
             return;
         }
         let enemyId;
         let level = _.random(context.lvl[0], context.lvl[1]);
         if (Math.random() < 0.005) {
            enemyId = _.sample(LEGENDARY_POOL);
            level = Math.max(level, 70); 
            dropGold = 5000;
            alert("⚠️ 传说中的神兽降临了！");
         } else {
            enemyId = _.sample(context.pool);
         }
         enemyParty.push(createPet(enemyId, level, isBoss));
    }

    // --- 统一后续处理 ---
    // 恶魔果实分配: 训练家必带，野外30%随机
    if (isTrainer || isGym || type === 'challenge' || isStory || type === 'league') {
      enemyParty.forEach(p => {
        if (!p.devilFruit) p.devilFruit = getRandomFruit(p.level, 'trainer');
      });
    } else {
      enemyParty.forEach(p => {
        if (!p.devilFruit && Math.random() < 0.3) {
          p.devilFruit = getRandomFruit(p.level, 'wild');
        }
      });
    }

    if (isTrainer || type === 'challenge') {
      enemyParty.forEach(p => p.name = `${p.name}`);
    }

    const activeIdx = party.findIndex(p => p.currentHp > 0);
    if (activeIdx === -1) { alert("全员战斗不能！"); setView('menu'); return; }

       // 初始化战斗状态的辅助函数
    const initBattleState = (p) => {
        const equipMoves = (p.equips || []).map(equip => {
            if (equip && typeof equip === 'object' && equip.extraSkill) {
                return { ...equip.extraSkill, isExtra: true };
            }
            return null;
        }).filter(Boolean);
        
        const combatMoves = [...p.moves, ...equipMoves].map(m => ({
            ...m,
            pp: Math.min(m.pp, m.maxPP || m.pp) 
        }));

        const baseStats = POKEDEX.find(pd => pd.id === p.id) || {};
        const grade = getCurseGrade(p.customBaseStats || baseStats, p.curseTalent || 0);
        const maxCE = getMaxCE(p.level, grade.key);
        const typeTech = TYPE_TECHNIQUES[p.type];
        const hasCT = p.cursedTechnique || (p.level >= AWAKENING_CONDITIONS.byLevel && (p.intimacy || 0) >= AWAKENING_CONDITIONS.byIntimacy);
        const cursedMoves = [];
        const normalizeCursedMove = (cm) => ({
            ...cm,
            isCursed: true,
            t: cm.t || cm.moveType || p.type,
            maxPP: cm.pp || 15,
        });
        if (hasCT) {
            const godTech = GOD_TECHNIQUES[p.id];
            const specialAwk = AWAKENING_CONDITIONS.specialAwakenings.find(s => s.petId === p.id);
            if (godTech && !p.cursedTechnique) {
                cursedMoves.push(normalizeCursedMove(godTech));
            } else if (p.cursedTechnique) {
                const allTechs = [...Object.values(TYPE_TECHNIQUES), ...COMMON_TECHNIQUES, ...Object.values(GOD_TECHNIQUES)];
                const ct = allTechs.find(t => t.id === p.cursedTechnique);
                if (ct) cursedMoves.push(normalizeCursedMove(ct));
                else if (typeTech) cursedMoves.push(normalizeCursedMove(typeTech));
            } else if (specialAwk) {
                const allTechs = [...Object.values(TYPE_TECHNIQUES), ...COMMON_TECHNIQUES, ...Object.values(GOD_TECHNIQUES)];
                const ct = allTechs.find(t => t.id === specialAwk.technique);
                if (ct) cursedMoves.push(normalizeCursedMove(ct));
                else if (typeTech) cursedMoves.push(normalizeCursedMove(typeTech));
            } else if (typeTech) {
                cursedMoves.push(normalizeCursedMove(typeTech));
            }
        }
        if (hasCT && cursedMoves.length > 0 && grade.key !== 'GRADE4') {
            const healTech = COMMON_TECHNIQUES.find(t => t.id === 'ct_reverse');
            if (healTech && !cursedMoves.find(m => m.id === 'ct_reverse')) {
                cursedMoves.push(normalizeCursedMove(healTech));
            }
        }
        const canDomain = p.hasDomain || (p.level >= 50 && hasCT && ['SPECIAL','GRADE1','GRADE2'].includes(grade.key));

        return {
            ...p,
            combatMoves: [...combatMoves, ...cursedMoves],
            stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
            
            // ▼▼▼ [修复] 进战斗时，自动清除“混乱”状态 (因为它本应是临时的) ▼▼▼
            status: p.status === 'CON' ? null : p.status, 
            // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
            
            volatiles: { protected: false, confused: 0, sleepTurns: 0, badlyPoisoned: 0 },
            turnCounters: { status: 0, stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 } },
            cursedEnergy: Math.floor(maxCE * (CURSED_ENERGY_CONFIG.initialPercent || 0.3)),
            maxCE,
            curseGrade: grade,
            hasDomain: canDomain,
            domainType: p.domainType || p.type,
            usedDomain: false,
            activeVow: null,
            devilFruit: p.devilFruit || null,
            fruitTransformed: false,
            fruitTurnsLeft: 0,
            fruitUsed: false,
            fruitEffects: null,
        };
    };


    const battleEnemyParty = enemyParty.map(initBattleState);
    const battlePlayerParty = party.map(initBattleState); 

    // ▼▼▼ [新增] 预先计算威吓 (Intimidate) 效果 ▼▼▼
    // 直接修改初始数据，确保第一回合状态正确
    const applyIntimidate = (sourceUnit, targetUnit) => {
        if (sourceUnit.trait === 'intimidate') {
            targetUnit.stages.p_atk = Math.max(-6, (targetUnit.stages.p_atk || 0) - 1);
        }
    };
    
    // 双方互相威吓
    applyIntimidate(battleEnemyParty[0], battlePlayerParty[activeIdx]);
    applyIntimidate(battlePlayerParty[activeIdx], battleEnemyParty[0]);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    let enemyComboUsed = false;
    if ((isTrainer || isGym || isBoss) && battleEnemyParty.length >= 2 && type !== 'pvp') {
      const ep0uid = battleEnemyParty[0].uid || `e_0`;
      const ep1uid = battleEnemyParty[1].uid || `e_1`;
      if (!battleEnemyParty[0].uid) battleEnemyParty[0].uid = ep0uid;
      if (!battleEnemyParty[1].uid) battleEnemyParty[1].uid = ep1uid;
      battleEnemyParty[0].partnerId = ep1uid;
      battleEnemyParty[1].partnerId = ep0uid;
      const bondBase = isBoss ? 200 : isGym ? 120 : 80;
      battleEnemyParty[0].bondPoints = bondBase;
      battleEnemyParty[1].bondPoints = bondBase;
    }

    setBattle({
      enemyParty: battleEnemyParty,
      playerCombatStates: battlePlayerParty,
      enemyActiveIdx: 0, 
      activeIdx, 
      phase: type === 'pvp' ? 'input' : 'input', 
      logs: [type === 'pvp' ? `PvP 对战开始！对手由AI控制，请选择行动` : (isTrainer ? `${trainerName} 发起了挑战!` : `遭遇 ${enemyParty[0].name}!`)],
      mapId: context?.id,
      drop: dropGold,
      isBoss,
      isTrainer,
      isGym,
      isStory,
      isChallenge: type === 'challenge',
      isPvP: type === 'pvp',
      challengeId,
      showSwitch: false,
      trainerName,
      pvpActions: { p1: null, p2: null },
      type: type,
      activeDomain: null,
      activeVows: { player: null, enemy: null },
      turnCount: 0,
      enemyComboUsed: false,
      ...extraBattleData,
    });
    
    setShowBallMenu(false);
    setView('battle');
    
    // 异步播放动画和日志
    setTimeout(async () => {
        await triggerShinyAnim('enemy', enemyParty[0]);
        await triggerShinyAnim('player', party[activeIdx]);
        
        // 补充威吓的文本提示
        if (battleEnemyParty[0].trait === 'intimidate') {
            addLog(`${battleEnemyParty[0].name} 的 [威吓] 降低了你的攻击！`);
        }
        if (battlePlayerParty[activeIdx].trait === 'intimidate') {
            addLog(`${battlePlayerParty[activeIdx].name} 的 [威吓] 降低了对手的攻击！`);
        }
    }, 500);
  };


  // ==========================================
  // [新增] PvP AI控制逻辑
  // ==========================================

  const getPvPAIAction = (state) => {
      const enemy = state.enemyParty?.[state.enemyActiveIdx];
      if (!enemy || enemy.currentHp <= 0) return { type: 'move', index: 0 };
      const player = state.playerCombatStates?.[state.activeIdx];
      const moves = enemy.combatMoves || [];
      if (moves.length === 0) return { type: 'move', index: 0 };
      const enemyHpRatio = enemy.currentHp / (getStats(enemy).maxHp || 1);
      if (enemyHpRatio < 0.25) {
          const aliveBackup = state.enemyParty.findIndex((ep, i) => i !== state.enemyActiveIdx && ep.currentHp > 0);
          if (aliveBackup >= 0 && Math.random() < 0.3) return { type: 'switch', index: aliveBackup };
      }
      let bestIdx = 0;
      let bestScore = -Infinity;
      moves.forEach((m, i) => {
          if (m.pp <= 0) return;
          let score = (m.p || 0);
          if (player) {
              const typeMod = getTypeMod(m.t, player.type);
              score *= typeMod;
          }
          score += Math.random() * 20;
          if (score > bestScore) { bestScore = score; bestIdx = i; }
      });
      return { type: 'move', index: bestIdx };
  };

  // P1选完后AI自动决策P2
  const handlePvPInput = (playerNum, actionType, index) => {
      setBattle(prev => {
          const p1Action = { type: actionType, index };
          const aiAction = getPvPAIAction(prev);
          const finalActions = { p1: p1Action, p2: aiAction };
          setTimeout(() => resolvePvPRound(finalActions), 300);
          return {
              ...prev,
              pvpActions: finalActions,
              phase: 'busy',
              logs: [`已行动，AI 对手正在思考...`, ...prev.logs]
          };
      });
  };

   // ==========================================
  // [修复版] PvP 核心逻辑 (解决状态不同步导致的诈尸Bug)
  // ==========================================

  // 2. 结算 PvP 回合 (速度判定 + 执行)
  const resolvePvPRound = async (actions) => {
      // 获取当前战斗状态的快照 (这是最新的数据源)
      let state = _.cloneDeep(battle); 
      
      const p1Index = state.activeIdx;
      const p2Index = state.enemyActiveIdx;
      const p1 = state.playerCombatStates[p1Index];
      const p2 = state.enemyParty[p2Index];

      const act1 = actions.p1;
      const act2 = actions.p2;

      // 辅助函数：执行单个动作
      const runAction = async (attacker, defender, action, source) => {
          if (attacker.currentHp <= 0) return false; 

          if (action.type === 'switch') {
              const newIdx = action.index;
              const newPet = source === 'player' ? party[newIdx] : state.enemyParty[newIdx];
              
              if (source === 'player') state.activeIdx = newIdx;
              else state.enemyActiveIdx = newIdx;
              
              // 同步更新 UI
              setBattle(prev => ({ 
                  ...prev, 
                  activeIdx: state.activeIdx, 
                  enemyActiveIdx: state.enemyActiveIdx 
              }));

              addLog(`${source==='player'?'我方':'对手'} 交换了 ${newPet.name}!`);
              await triggerShinyAnim(source, newPet);
              await wait(1000);
              return false;
          } 
          else if (action.type === 'move') {
              const move = attacker.combatMoves[action.index];
              return await performAction(attacker, defender, move, source, state);
          }
      };

      // --- 判定先后手 ---
      let first = 'p1';
      if (act1.type === 'switch' && act2.type !== 'switch') first = 'p1';
      else if (act2.type === 'switch' && act1.type !== 'switch') first = 'p2';
      else {
          if (p1.fruitFirstStrike && !p2.fruitFirstStrike) { first = 'p1'; p1.fruitFirstStrike = false; }
          else if (p2.fruitFirstStrike && !p1.fruitFirstStrike) { first = 'p2'; p2.fruitFirstStrike = false; }
          else {
              const s1 = getStats(p1, p1.stages).spd;
              const s2 = getStats(p2, p2.stages).spd;
              if (s2 > s1) first = 'p2';
              else if (s1 === s2 && Math.random() < 0.5) first = 'p2';
              if (p1.fruitFirstStrike) p1.fruitFirstStrike = false;
              if (p2.fruitFirstStrike) p2.fruitFirstStrike = false;
          }
      }

      const firstActor = first === 'p1' ? p1 : p2;
      const firstTarget = first === 'p1' ? p2 : p1;
      const firstAct = first === 'p1' ? act1 : act2;
      const firstSource = first === 'p1' ? 'player' : 'enemy';

      // 1. 执行第一行动
      setBattle(prev => ({ ...prev, ...state })); // 刷新UI
      const isFirstKill = await runAction(firstActor, firstTarget, firstAct, firstSource);
      
      // 2. 如果第一下打死了，直接进入死亡处理 (传入最新的 state!)
      if (isFirstKill) {
          await handlePvPDeath(firstTarget, firstSource === 'player' ? 'enemy' : 'player', state);
          return;
      }

      // 3. 执行第二行动
      const secondActor = first === 'p1' ? p2 : p1;
      const secondTarget = first === 'p1' ? p1 : p2;
      const secondAct = first === 'p1' ? act2 : act1;
      const secondSource = first === 'p1' ? 'enemy' : 'player';

      const isSecondKill = await runAction(secondActor, secondTarget, secondAct, secondSource);
      
      if (isSecondKill) {
          await handlePvPDeath(secondTarget, secondSource === 'player' ? 'enemy' : 'player', state);
          return;
      }

      await wait(500);
      
      // 回合结束，重置为 1P 输入
      setBattle(prev => ({ 
          ...prev, 
          phase: 'input', 
          logs: [`回合结束，请选择行动`, ...prev.logs],
          pvpActions: { p1: null, p2: null }
      }));
  };

  // 3. 处理 PvP 死亡 (修复版：接收 latestState 参数)
  const handlePvPDeath = async (deadPet, deadSide, latestState) => {
      addLog(`${deadPet.name} 倒下了!`);
      await wait(1000);

      // 🔥 关键修复：使用 latestState 来检查存活状态，而不是旧的 battle state
      const team = deadSide === 'player' ? latestState.playerCombatStates : latestState.enemyParty;
      
      // 查找 HP > 0 的精灵 (这里读取的是刚刚扣过血的数据，所以不会诈尸)
      const nextIdx = team.findIndex(p => p.currentHp > 0);
      const hasAlive = nextIdx !== -1;

      if (!hasAlive) {
          // 游戏结束
          const winner = deadSide === 'player' ? '2P (对手)' : '1P (我方)';
          alert(`🏆 战斗结束！\n获胜者是：${winner}`);
          if (deadSide === 'enemy') {
              setGold(g => g + 5000);
              alert("获得获胜奖励：5000 金币");
          }
          setView('grid_map');
          setBattle(null);
      } else {
          if (deadSide === 'player') {
              // 更新 battle 状态中的 activeIdx
              setBattle(prev => ({ 
                  ...prev, 
                  activeIdx: nextIdx, // 切换到下一个活着的
                  logs: [`我方派出了 ${team[nextIdx].name}!`, ...prev.logs],
                  phase: 'input', 
                  pvpActions: { p1: null, p2: null } 
              }));
              await triggerShinyAnim('player', team[nextIdx]);
          } else {
              setBattle(prev => ({ 
                  ...prev, 
                  enemyActiveIdx: nextIdx,
                  logs: [`对手派出了 ${team[nextIdx].name}!`, ...prev.logs],
                  phase: 'input', 
                  pvpActions: { p1: null, p2: null } 
              }));
              await triggerShinyAnim('enemy', team[nextIdx]);
          }
      }
  };


   // ==========================================
  // [修复版] 切换精灵 (含特性触发)
  // ==========================================
  const switchPokemon = async (newIdx) => {
    if (newIdx === battle.activeIdx) return;
    
    const combatStates = battle.playerCombatStates;
    const currentPet = combatStates[battle.activeIdx];
    const isForcedSwitch = currentPet.currentHp <= 0;

    if (combatStates[newIdx].currentHp <= 0) { 
        alert("该精灵已失去战斗能力！"); 
        return; 
    }

    try {
    if (currentPet.trait === 'regenerator' && !isForcedSwitch) {
        const max = getStats(currentPet).maxHp;
        const heal = Math.floor(max / 3);
        currentPet.currentHp = Math.min(max, currentPet.currentHp + heal);
        addLog(`${currentPet.name} 的 [再生力] 恢复了体力！`);
    }

        const newPet = combatStates[newIdx];

    const nextBattleState = {
        ...battle,
        activeIdx: newIdx,
        showSwitch: false,
        phase: 'anim',
        logs: [`去吧 ${newPet.name}!`, ...battle.logs]
    };

    setBattle(nextBattleState);

    await wait(500); 
    await triggerShinyAnim('player', newPet);

    const me = nextBattleState.playerCombatStates[newIdx];
    const opp = nextBattleState.enemyParty[nextBattleState.enemyActiveIdx];
    if (me.trait === 'intimidate' && opp.currentHp > 0) {
        opp.stages.p_atk = Math.max(-6, (opp.stages.p_atk||0) - 1);
        addLog(`${me.name} 的 [威吓] 降低了对手的攻击！`);
        setAnimEffect({ type: 'DEBUFF', target: 'enemy' });
        await wait(800); setAnimEffect(null);
    }

    if (isForcedSwitch) {
        setBattle(prev => ({ ...prev, phase: 'input' }));
    } else {
        await enemyTurn(nextBattleState);
        }
    } catch (e) {
        console.error("Switch Error:", e);
        setBattle(prev => prev ? ({ ...prev, phase: 'input', showSwitch: false }) : null);
    }
  };

    // ==========================================
  // [修复版] 玩家回合 (修复升级UI不刷新)
  // ==========================================
  const executeTurn = async (moveIdx) => {
  if (!battle || battle.phase !== 'input') return;
    setBattle(prev => prev ? ({ ...prev, phase: 'busy' }) : prev);

    try {
        // 这是一个深拷贝，PP 是在这里扣除的
        let tempBattle = _.cloneDeep(battle); 
       const tempPlayerState = tempBattle.playerCombatStates[battle.activeIdx];
        const move = tempPlayerState.combatMoves[moveIdx];
        if (move.isCursed) {
            if ((tempPlayerState.cursedEnergy || 0) < (move.ceCost || 0)) {
                alert("咒力不足！");
                setBattle(prev => ({ ...prev, phase: 'input' }));
                return;
            }
        } else if (move.pp <= 0) {
             alert("PP不足！");
             setBattle(prev => ({ ...prev, phase: 'input' }));
             return;
        }
        const player = tempPlayerState;
        const enemy = tempBattle.enemyParty[battle.enemyActiveIdx];

        // 2. 执行玩家行动 (PP 扣除移入 performAction)
        const enemyDied = await performAction(player, enemy, move, 'player', tempBattle);

        setBattle(prev => ({
            ...prev,
            playerCombatStates: tempBattle.playerCombatStates,
            enemyParty: tempBattle.enemyParty,
        }));

        // 3. 敌人行动或结算
        if (!enemyDied) {
            if (move.effect?.type !== 'PROTECT') {
                tempBattle.playerCombatStates[tempBattle.activeIdx].volatiles.protected = false;
            }
            
            await wait(1200); 
            await enemyTurn(tempBattle);
        } else {
            await wait(800);
            const { newParty, logMsg, activeDidLevelUp } = processDefeatedEnemy(enemy, party, tempBattle);
            
            // 更新全局队伍
            setParty(newParty); 
             addLog(logMsg);
            
            setBattle(prev => {
                const updatedCombatStates = prev.playerCombatStates.map((cs, i) => {
                    const updatedPet = newParty[i];
                    if (!updatedPet) return cs;
                    
                    const equipMoves = (updatedPet.equips || []).map(equip => {
                        if (equip && typeof equip === 'object' && equip.extraSkill) {
                            return { ...equip.extraSkill, isExtra: true };
                        }
                        return null;
                    }).filter(Boolean);

                    const cursedMoves = (cs.combatMoves || []).filter(m => m.isCursed);
                    const newCombatMoves = [...updatedPet.moves, ...equipMoves, ...cursedMoves];

                    return {
                        ...cs,
                        level: updatedPet.level,
                        currentHp: updatedPet.currentHp, 
                        exp: updatedPet.exp,
                        nextExp: updatedPet.nextExp,
                        name: updatedPet.name,
                        moves: updatedPet.moves,
                        combatMoves: newCombatMoves,
                        canEvolve: updatedPet.canEvolve,
                        pendingLearnMove: updatedPet.pendingLearnMove,
                    };
                });
                return {
                    ...prev,
                    playerCombatStates: updatedCombatStates
                };
            });
            if (activeDidLevelUp) {
                setAnimEffect({ type: 'LEVEL_UP', target: 'player' });
                await wait(1200); setAnimEffect(null);
            }

            const nextEnemyIdx = tempBattle.enemyParty.findIndex((p, i) => i > tempBattle.enemyActiveIdx && p.currentHp > 0);
            if (nextEnemyIdx !== -1) {
                setBattle(prev => ({
                    ...prev, enemyActiveIdx: nextEnemyIdx, phase: 'anim', 
                    logs: [`对手派出了 ${prev.enemyParty[nextEnemyIdx].name}!`, ...prev.logs]
                }));
                await triggerShinyAnim('enemy', tempBattle.enemyParty[nextEnemyIdx]);
                await wait(1000);
                setBattle(prev => ({ ...prev, phase: 'input' })); 
            } else {
                await wait(1000);
                handleWin(newParty);
            }
        }

    } catch (e) {
        console.error("Battle Error:", e);
        setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };


  // ==========================================
  // 咒术系统 - 蓄力 (消耗一回合, 回复咒力)
  // ==========================================
  const executeChargeCE = async () => {
    if (battle.phase !== 'input') return;
    setBattle(prev => ({ ...prev, phase: 'busy' }));
    try {
        let tempBattle = _.cloneDeep(battle);
        const player = tempBattle.playerCombatStates[battle.activeIdx];
        const chargeAmt = CURSED_ENERGY_CONFIG.chargeAction;
        player.cursedEnergy = Math.min(player.maxCE, (player.cursedEnergy || 0) + chargeAmt);
        addLog(`🔮 ${player.name} 蓄积咒力! (+${chargeAmt} CE)`);
        setAnimEffect({ type: 'BUFF', target: 'player' });
        await wait(800);
        setAnimEffect(null);
        setBattle(prev => ({
            ...prev,
            playerCombatStates: tempBattle.playerCombatStates,
        }));
        await wait(500);
        await enemyTurn(tempBattle);
    } catch (e) {
        console.error("Charge CE Error:", e);
        setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };

  // ==========================================
  const getBackToMapView = () => mapGrid.length > 0 ? 'grid_map' : 'world_map';

  // 搭档羁绊系统 - 核心逻辑
  // ==========================================
  const isPartnerSystemUnlocked = () => storyProgress >= 18;

  const setPartner = (petA, petB) => {
    if (!isPartnerSystemUnlocked()) { alert('🔒 搭档羁绊系统尚未解锁！\n\n完成【莉可莉丝篇·第壹章：搭档的意义】后解锁。'); return; }
    const update = (list) => list.map(p => {
      const uid = p.uid || p.id;
      if (uid === (petA.uid || petA.id)) return { ...p, partnerId: petB.uid || petB.id, bondPoints: p.partnerId === (petB.uid || petB.id) ? (p.bondPoints || 0) : 0 };
      if (uid === (petB.uid || petB.id)) return { ...p, partnerId: petA.uid || petA.id, bondPoints: p.partnerId === (petA.uid || petA.id) ? (p.bondPoints || 0) : 0 };
      if (uid === p.partnerId && (p.partnerId === (petA.uid || petA.id) || p.partnerId === (petB.uid || petB.id))) return { ...p, partnerId: null, bondPoints: 0 };
      return p;
    });
    setParty(prev => update(prev));
    setBox(prev => update(prev));
    updateAchStat({ partnersFormed: 1 });
  };

  const removePartner = (pet) => {
    const uid = pet.uid || pet.id;
    const partnerId = pet.partnerId;
    const update = (list) => list.map(p => {
      const pUid = p.uid || p.id;
      if (pUid === uid || pUid === partnerId) return { ...p, partnerId: null, bondPoints: 0 };
      return p;
    });
    setParty(prev => update(prev));
    setBox(prev => update(prev));
  };

  const getPartnerInParty = (pet) => {
    if (!pet?.partnerId) return null;
    return party.find(p => (p.uid || p.id) === pet.partnerId);
  };

  const canUseCombo = (battle) => {
    if (!isPartnerSystemUnlocked()) return false;
    if (!battle || comboUsedThisBattle) return false;
    if ((battle.turnCount || 0) < 3) return false;
    const activePet = battle.playerCombatStates?.[battle.activeIdx];
    if (!activePet?.partnerId) return false;
    const partner = battle.playerCombatStates?.find(p => (p.uid || p.id) === activePet.partnerId && p.currentHp > 0);
    if (!partner) return false;
    const bl = getBondLevel(activePet.bondPoints || 0);
    return !!bl;
  };

  const getComboMove = (pet1, pet2) => {
    const t1 = pet1.type || 'NORMAL';
    const t2 = pet2.type || 'NORMAL';
    if (t1 === t2) return { ...SAME_TYPE_COMBO, type: t1 };
    const key = getPartnerComboKey(t1, t2);
    if (key) return PARTNER_COMBOS[key];
    return { ...DEFAULT_COMBO, type: t1 };
  };

  const executeComboAttack = async () => {
    if (!battle || battle.phase !== 'input') return;
    const activePet = battle.playerCombatStates[battle.activeIdx];
    if (!activePet?.partnerId) return;
    const partnerIdx = battle.playerCombatStates.findIndex(p => (p.uid || p.id) === activePet.partnerId && p.currentHp > 0);
    if (partnerIdx < 0) return;
    const partner = battle.playerCombatStates[partnerIdx];
    const bl = getBondLevel(activePet.bondPoints || 0);
    if (!bl) return;

    setBattle(prev => ({ ...prev, phase: 'busy' }));
    try {
      let tempBattle = _.cloneDeep(battle);
      const p = tempBattle.playerCombatStates[battle.activeIdx];
      const pt = tempBattle.playerCombatStates[partnerIdx];
      const e = tempBattle.enemyParty[tempBattle.enemyActiveIdx];
      const combo = getComboMove(p, pt);

      const basePower = combo.power * bl.powerMult * 0.8;
      const power = Math.floor(basePower);
      const pStats = getStats(p);
      const ptStats = getStats(pt);
      const eStats = getStats(e);

      const hpCostP = Math.floor(pStats.maxHp * 0.15);
      const hpCostPt = Math.floor(ptStats.maxHp * 0.15);
      p.currentHp = Math.max(1, p.currentHp - hpCostP);
      pt.currentHp = Math.max(1, pt.currentHp - hpCostPt);
      addLog(`💔 ${p.name} 消耗 ${hpCostP} HP，${pt.name} 消耗 ${hpCostPt} HP 发动协作！`);

      const atk = combo.cat === 'special' ? pStats.s_atk : pStats.p_atk;
      const def = combo.cat === 'special' ? eStats.s_def : eStats.p_def;
      const stab = (combo.type === p.type || combo.type === pt.type) ? 1.5 : 1;
      const typeMod = getTypeMod(combo.type, e.type);
      const isCrit = combo.effect?.crit || Math.random() < 0.1;
      const critMult = isCrit ? 1.5 : 1;
      let dmg = Math.max(1, Math.floor(((p.level * 2 / 5 + 2) * power * atk / def / 50 + 2) * stab * typeMod * critMult * (0.85 + Math.random() * 0.15)));

      addLog(`🤝 ${p.name} 和 ${pt.name} 发动协作技——【${combo.name}】！(Lv${bl.tier})`);
      if (isCrit) addLog(`💥 暴击！`);
      e.currentHp = Math.max(0, e.currentHp - dmg);
      addLog(`💥 ${combo.name} 造成 ${dmg} 点伤害！`);

      if (combo.effect) {
        if (combo.effect.burn && Math.random() < combo.effect.burn) { e.status = 'BRN'; addLog(`🔥 ${e.name} 被灼伤了！`); }
        if (combo.effect.paralyze && Math.random() < combo.effect.paralyze) { e.status = 'PAR'; addLog(`⚡ ${e.name} 被麻痹了！`); }
        if (combo.effect.freeze && Math.random() < combo.effect.freeze) { e.status = 'FRZ'; addLog(`🧊 ${e.name} 被冻结了！`); }
        if (combo.effect.poison && Math.random() < combo.effect.poison) { e.status = 'PSN'; addLog(`☠️ ${e.name} 中毒了！`); }
        if (combo.effect.confuse && Math.random() < combo.effect.confuse) { e.volatiles = { ...(e.volatiles || {}), confused: 3 }; addLog(`😵 ${e.name} 陷入混乱！`); }
        if (combo.effect.healPercent) { const heal = Math.floor(pStats.maxHp * combo.effect.healPercent); p.currentHp = Math.min(pStats.maxHp, p.currentHp + heal); addLog(`💚 ${p.name} 恢复了 ${heal} HP！`); }
        if (combo.effect.atkUp) { p.stages = { ...(p.stages || {}), p_atk: Math.min(6, (p.stages?.p_atk || 0) + combo.effect.atkUp) }; }
        if (combo.effect.spAtkUp) { p.stages = { ...(p.stages || {}), s_atk: Math.min(6, (p.stages?.s_atk || 0) + combo.effect.spAtkUp) }; }
        if (combo.effect.spdUp) { p.stages = { ...(p.stages || {}), spd: Math.min(6, (p.stages?.spd || 0) + combo.effect.spdUp) }; }
        if (combo.effect.defUp) { p.stages = { ...(p.stages || {}), p_def: Math.min(6, (p.stages?.p_def || 0) + combo.effect.defUp) }; }
        if (combo.effect.defDown) { e.stages = { ...(e.stages || {}), p_def: Math.max(-6, (e.stages?.p_def || 0) - combo.effect.defDown) }; }
        if (combo.effect.spdDown) { e.stages = { ...(e.stages || {}), spd: Math.max(-6, (e.stages?.spd || 0) - combo.effect.spdDown) }; }
        if (combo.effect.cureStatus) { p.status = null; addLog(`✨ ${p.name} 的状态异常被清除了！`); }
      }

      updateAchStat({ comboAttacks: 1 });
      setComboUsedThisBattle(true);

      tempBattle.playerCombatStates[battle.activeIdx] = p;
      tempBattle.playerCombatStates[partnerIdx] = pt;
      tempBattle.enemyParty[tempBattle.enemyActiveIdx] = e;

      setBattle(prev => ({
        ...prev,
        playerCombatStates: tempBattle.playerCombatStates,
        enemyParty: tempBattle.enemyParty,
        phase: 'busy',
      }));
      await wait(800);
      await enemyTurn(tempBattle);
    } catch (err) {
      console.error("Combo Attack Error:", err);
      setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };

  // 咖啡厅系统 - 打工产出
  const cafeTick = useCallback(() => {
    setCafe(prev => {
      if (!prev.owned || prev.workers.length === 0) return prev;
      const now = Date.now();
      let changed = { ...prev };
      const elapsed = now - (prev.lastTickTime || now);
      if (elapsed >= CAFE_BUILDING.tickInterval) {
        const ticks = Math.floor(elapsed / CAFE_BUILDING.tickInterval);
        if (ticks > 0) {
          const lvData = getCafeLevel(prev.totalWorkCount);
          const goldEarned = Math.floor(CAFE_BUILDING.goldPerTick * ticks * lvData.goldMult);
          setGold(g => g + goldEarned);
          const newWorkCount = prev.totalWorkCount + ticks * prev.workers.length;
          const intimacyIncrease = ticks * 2;
          const update = (list) => list.map(p => {
            if (prev.workers.includes(p.uid || p.id)) {
              return { ...p, intimacy: Math.min(255, (p.intimacy || 0) + intimacyIncrease) };
            }
            return p;
          });
          setParty(pp => update(pp));
          setBox(bb => update(bb));
          const newLv = getCafeLevel(newWorkCount);
          updateAchStat({ cafeLevel: newLv.level });
          changed = { ...changed, totalWorkCount: newWorkCount, lastTickTime: now };
        }
      }
      if (changed.brewing && !changed.readyDrink) {
        const brewElapsed = now - changed.brewing.startTime;
        if (brewElapsed >= changed.brewing.duration) {
          changed = { ...changed, readyDrink: { drinkId: changed.brewing.drinkId }, brewing: null };
        }
      }
      return changed;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(cafeTick, 60000);
    return () => clearInterval(interval);
  }, [cafeTick]);

  const buyCafe = () => {
    if (cafe.owned) { alert('已拥有咖啡厅！'); return; }
    if (gold < CAFE_BUILDING.price) { alert(`金币不足！需要 ${CAFE_BUILDING.price} 金币`); return; }
    setGold(g => g - CAFE_BUILDING.price);
    setCafe(prev => ({ ...prev, owned: true, lastTickTime: Date.now() }));
    alert('🎉 成功购买 LycoReco咖啡厅！');
  };

  const assignCafeWorker = (pet) => {
    const uid = pet.uid || pet.id;
    setCafe(prev => {
      if (prev.workers.includes(uid)) return { ...prev, workers: prev.workers.filter(w => w !== uid) };
      if (prev.workers.length >= CAFE_BUILDING.workerSlots) { alert(`最多只能安排 ${CAFE_BUILDING.workerSlots} 只精灵打工！`); return prev; }
      return { ...prev, workers: [...prev.workers, uid] };
    });
  };

  const getTodayStr = () => new Date().toISOString().slice(0, 10);

  const getWorkerStatTotal = () => {
    const allPets = [...party, ...box];
    return cafe.workers.reduce((sum, uid) => {
      const pet = allPets.find(p => (p.uid || p.id) === uid);
      if (!pet) return sum;
      const base = POKEDEX.find(d => d.id === pet.id) || {};
      return sum + (base.hp || 0) + (base.atk || 0) + (base.def || 0) + (base.spd || 0);
    }, 0);
  };

  const getDrinkDailyUsed = (drinkId) => {
    const today = getTodayStr();
    const counts = (cafe.dailyResetDate === today) ? (cafe.dailyDrinkCounts || {}) : {};
    return counts[drinkId] || 0;
  };

  const startBrewing = (drinkId) => {
    const drink = CAFE_DRINKS.find(d => d.id === drinkId);
    if (!drink) return;

    if (cafe.workers.length === 0) {
      alert('没有精灵在打工！\n请先安排至少1只精灵到咖啡厅打工才能开始酿造。');
      return;
    }

    if (cafe.brewing) {
      alert('已有饮品正在酿造中！\n请等待当前饮品完成后再酿造新的。');
      return;
    }
    if (cafe.readyDrink) {
      alert('有一杯饮品已酿好待领取！\n请先领取后再酿造新的。');
      return;
    }

    const workerStats = getWorkerStatTotal();
    const minStats = DRINK_MIN_WORKER_STATS[drink.tier] || 0;
    if (workerStats < minStats) {
      alert(`打工精灵种族值总和不足！\n当前: ${workerStats} / 需要: ${minStats}\n请安排更强的精灵来打工，或增加打工精灵数量。`);
      return;
    }

    const today = getTodayStr();
    const counts = (cafe.dailyResetDate === today) ? (cafe.dailyDrinkCounts || {}) : {};
    const used = counts[drinkId] || 0;
    if (used >= drink.dailyLimit) {
      alert(`${drink.name} 今日酿造次数已达上限 (${drink.dailyLimit}次/天)！\n明天再来吧。`);
      return;
    }

    const brewTime = calcBrewTimeMs(drink.tier, workerStats);
    const now = Date.now();
    setCafe(prev => ({
      ...prev,
      brewing: { drinkId, startTime: now, duration: brewTime },
    }));
    const mins = Math.ceil(brewTime / 60000);
    alert(`☕ 开始酿造「${drink.name}」！\n⏱️ 预计需要 ${mins} 分钟\n💡 打工精灵种族值越高，酿造越快`);
  };

  const claimBrewedDrink = () => {
    const ready = cafe.readyDrink;
    if (!ready) return;
    const drink = CAFE_DRINKS.find(d => d.id === ready.drinkId);
    if (!drink) { setCafe(prev => ({ ...prev, readyDrink: null })); return; }

    if (gold < drink.price) {
      alert(`金币不足！领取「${drink.name}」需要 ${drink.price} 金币`);
      return;
    }
    setGold(g => g - drink.price);

    const today = getTodayStr();
    const counts = (cafe.dailyResetDate === today) ? { ...(cafe.dailyDrinkCounts || {}) } : {};
    counts[drink.id] = (counts[drink.id] || 0) + 1;
    setCafe(prev => ({ ...prev, readyDrink: null, dailyDrinkCounts: counts, dailyResetDate: today }));

    const lootTable = DRINK_LOOT_TABLES[drink.tier] || DRINK_LOOT_TABLES[1];
    const totalWeight = lootTable.reduce((s, e) => s + e.weight, 0);
    let roll = Math.random() * totalWeight;
    let picked = lootTable[0];
    for (const entry of lootTable) {
      roll -= entry.weight;
      if (roll <= 0) { picked = entry; break; }
    }

    let rewardMsg = '';
    if (picked.type === 'ball') {
      setInventory(prev => ({ ...prev, balls: { ...prev.balls, [picked.id]: (prev.balls[picked.id] || 0) + picked.count } }));
      rewardMsg = picked.name;
    } else if (picked.type === 'med') {
      setInventory(prev => ({ ...prev, meds: { ...prev.meds, [picked.id]: (prev.meds[picked.id] || 0) + picked.count } }));
      rewardMsg = picked.name;
    } else if (picked.type === 'berry') {
      setInventory(prev => ({ ...prev, berries: (prev.berries || 0) + picked.count }));
      rewardMsg = picked.name;
    } else if (picked.type === 'stone') {
      const stoneKeys = Object.keys(EVO_STONES);
      const stoneId = stoneKeys[Math.floor(Math.random() * stoneKeys.length)];
      setInventory(prev => ({ ...prev, stones: { ...prev.stones, [stoneId]: (prev.stones[stoneId] || 0) + picked.count } }));
      rewardMsg = `${EVO_STONES[stoneId].name} x${picked.count}`;
    } else if (picked.type === 'growth') {
      const item = GROWTH_ITEMS[Math.floor(Math.random() * GROWTH_ITEMS.length)];
      setInventory(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + picked.count }));
      rewardMsg = `${item.emoji} ${item.name} x${picked.count}`;
    } else if (picked.type === 'tm') {
      const tm = ALL_SKILL_TMS[Math.floor(Math.random() * ALL_SKILL_TMS.length)];
      setInventory(prev => ({ ...prev, tms: { ...prev.tms, [tm.id]: (prev.tms[tm.id] || 0) + picked.count } }));
      rewardMsg = `📜 ${tm.name}`;
    } else if (picked.type === 'misc') {
      setInventory(prev => ({ ...prev, misc: { ...prev.misc, [picked.id]: (prev.misc[picked.id] || 0) + picked.count } }));
      rewardMsg = picked.name;
    } else if (picked.type === 'candy') {
      setInventory(prev => ({ ...prev, [picked.id]: (prev[picked.id] || 0) + picked.count }));
      rewardMsg = picked.name;
    } else if (picked.type === 'fruit') {
      const allowedRarities = picked.rarity || ['COMMON'];
      const allFruits = getAllFruits().filter(f => allowedRarities.includes(f.rarity));
      if (allFruits.length > 0) {
        const fruit = allFruits[Math.floor(Math.random() * allFruits.length)];
        setFruitInventory(prev => [...prev, fruit.id]);
        rewardMsg = `🍎 ${fruit.name} [${FRUIT_RARITY_CONFIG[fruit.rarity]?.label}]`;
      } else {
        setInventory(prev => ({ ...prev, misc: { ...prev.misc, rebirth_pill: (prev.misc.rebirth_pill || 0) + 1 } }));
        rewardMsg = '洗练药 x1 (保底)';
      }
    }

    const remaining = drink.dailyLimit - counts[drink.id];
    alert(`☕ ${drink.name} 领取成功！\n🎁 获得: ${rewardMsg}\n📋 今日剩余次数: ${remaining}/${drink.dailyLimit}`);
  };

  const cancelBrewing = () => {
    if (!cafe.brewing) return;
    setCafe(prev => ({ ...prev, brewing: null }));
    alert('已取消当前酿造。');
  };

  const isLycorisStoryCompleted = (chapter) => {
    return storyProgress > chapter;
  };

  const isDrinkUnlocked = (drink) => {
    if (drink.unlock === 'story_lycoris_0') return isLycorisStoryCompleted(18);
    if (drink.unlock === 'story_lycoris_1') return isLycorisStoryCompleted(19);
    if (drink.unlock === 'first_partner') return party.some(p => p.partnerId);
    if (drink.unlock === 'cafe_lv2') return getCafeLevel(cafe.totalWorkCount).level >= 2;
    if (drink.unlock === 'cafe_lv3') return getCafeLevel(cafe.totalWorkCount).level >= 3;
    if (drink.unlock === 'cafe_lv4') return getCafeLevel(cafe.totalWorkCount).level >= 4;
    if (drink.unlock === 'cafe_lv5') return getCafeLevel(cafe.totalWorkCount).level >= 5;
    if (drink.unlock === 'all_lycoris_ach') return (unlockedAchs || []).includes('lycoris_clear');
    return false;
  };

  // ==========================================
  // 咒术系统 - 领域展开
  // ==========================================

  const executeDomainExpansion = async () => {
    if (battle.phase !== 'input') return;
    const state = battle.playerCombatStates[battle.activeIdx];
    const domainDef = DOMAINS[state.domainType];
    if (!domainDef) { alert('该精灵无法展开领域!'); return; }
    if (state.usedDomain) { alert('本场战斗已使用过领域展开!'); return; }
    if ((state.cursedEnergy || 0) < domainDef.ceCost) { alert(`咒力不足! 需要 ${domainDef.ceCost} CE`); return; }
    if (battle.activeDomain) { alert('场上已有领域!'); return; }

    setBattle(prev => ({ ...prev, phase: 'busy' }));
    try {
        let tempBattle = _.cloneDeep(battle);
        const player = tempBattle.playerCombatStates[battle.activeIdx];
        player.cursedEnergy -= domainDef.ceCost;
        player.usedDomain = true;
        tempBattle.activeDomain = {
            name: domainDef.name,
            ownerSide: 'player',
            turnsLeft: domainDef.turns,
            effect: domainDef.effect,
            type: state.domainType,
        };
        addLog(`🌀 ${player.name} 展开领域——${domainDef.name}!`);
        addLog(`📖 ${domainDef.desc}`);
        const achUpdate = { domainsUsed: 1 };
        if (tempBattle.activeDomain?.ownerSide === 'enemy') achUpdate.domainClash = 1;
        updateAchStat(achUpdate);
        setAnimEffect({ type: 'DOMAIN', target: 'player' });
        await wait(1500);
        setAnimEffect(null);
        setBattle(prev => ({
            ...prev,
            playerCombatStates: tempBattle.playerCombatStates,
            activeDomain: tempBattle.activeDomain,
        }));
        await wait(500);
        await enemyTurn(tempBattle);
    } catch (e) {
        console.error("Domain Error:", e);
        setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };

  // ==========================================
  // 咒术系统 - 缚誓
  // ==========================================
  const executeBindingVow = async (vowId) => {
    if (battle.phase !== 'input') return;
    const vow = BINDING_VOWS.find(v => v.id === vowId);
    if (!vow) return;

    setBattle(prev => ({ ...prev, phase: 'busy' }));
    try {
        let tempBattle = _.cloneDeep(battle);
        const player = tempBattle.playerCombatStates[battle.activeIdx];

        if (vow.ceCost && (player.cursedEnergy || 0) < vow.ceCost) {
            addLog(`📜 咒力不足! 需要 ${vow.ceCost} CE`);
            setBattle(prev => ({ ...prev, phase: 'input' }));
            return;
        }
        if (vow.ceCost) {
            player.cursedEnergy = Math.max(0, (player.cursedEnergy || 0) - vow.ceCost);
            addLog(`🔮 消耗 ${vow.ceCost} 咒力`);
        }
        updateAchStat({ vowsUsed: 1 });
        if (vow.sacrifice.hpPercent) {
            const cost = Math.floor(getStats(player).maxHp * vow.sacrifice.hpPercent);
            player.currentHp = Math.max(1, player.currentHp - cost);
            addLog(`📜 ${player.name} 献出 ${cost} HP!`);
        }
        if (vow.sacrifice.cePercent) {
            const cost = Math.floor((player.cursedEnergy || 0) * vow.sacrifice.cePercent);
            player.cursedEnergy = Math.max(0, (player.cursedEnergy || 0) - cost);
            addLog(`🔮 额外燃烧 ${cost} 咒力!`);
        }

        if (vow.sacrifice.noSwitch) {
            addLog(`📜 ${player.name} 缚誓: ${vow.sacrifice.turns}回合内无法换人!`);
        }
        if (vow.sacrifice.defMult && vow.sacrifice.defMult < 1) {
            addLog(`📜 ${player.name} 缚誓代价: 防御降低至${vow.sacrifice.defMult * 100}%!`);
        }
        if (vow.reward.spdMult) {
            const spdBoost = Math.min(6, Math.round(Math.log2(vow.reward.spdMult) * 4));
            player.stages.spd = Math.min(6, (player.stages.spd || 0) + spdBoost);
            addLog(`📜 缚誓效果: ${player.name} 速度大幅提升!`);
        }

        player.activeVow = JSON.parse(JSON.stringify({ ...vow, turnsLeft: vow.reward.turns, side: 'player' }));
        player.vowUsed = true;
        addLog(`📜 [我方] ${player.name} 立下缚誓——${vow.name}!`);
        addLog(`📖 ${vow.desc}`);
        setAnimEffect({ type: 'BUFF', target: 'player' });
        await wait(1000);
        setAnimEffect(null);

        setBattle(prev => ({
            ...prev,
            playerCombatStates: tempBattle.playerCombatStates,
        }));
        await wait(500);
        await enemyTurn(tempBattle);
    } catch (e) {
        console.error("Vow Error:", e);
        setBattle(prev => ({ ...prev, phase: 'input' }));
    }
  };

    // ==========================================
  // 恶魔果实变身
  // ==========================================
  const executeDevilFruit = async (side = 'player', battleStateOverride = null) => {
    if (side === 'player' && battle.phase !== 'input') return;
    const tempBattle = battleStateOverride || _.cloneDeep(battle);
    const unit = side === 'player'
      ? tempBattle.playerCombatStates[tempBattle.activeIdx]
      : tempBattle.enemyParty[tempBattle.enemyActiveIdx];

    if (!unit || !unit.devilFruit || unit.fruitUsed || unit.fruitTransformed) return;
    const fruit = getFruitById(unit.devilFruit);
    if (!fruit) return;

    if (side === 'player') setBattle(prev => ({ ...prev, phase: 'busy' }));

    unit.fruitTransformed = true;
    unit.fruitUsed = true;
    unit.fruitTurnsLeft = fruit.duration;
    unit.fruitEffects = { ...fruit.transform };

    if (fruit.transform.hpMult) {
      const stats = getStats(unit);
      const bonus = Math.floor(stats.maxHp * (fruit.transform.hpMult - 1));
      unit.currentHp = Math.min(unit.currentHp + bonus, Math.floor(stats.maxHp * fruit.transform.hpMult));
    }

    if (fruit.transformMove) {
      unit.combatMoves.push({ ...fruit.transformMove, isFruitMove: true });
    }

    if (fruit.transform.cureStatus && unit.status) {
      addLog(`${unit.name} 的状态异常被果实之力治愈了！`);
      unit.status = null;
    }

    addLog(`${unit.name} 吃下了 ${fruit.name}，果实变身！[${FRUIT_CATEGORY_NAMES[fruit.category]}]`);
    if (side === 'player') updateAchStat({ fruitTransforms: 1 });
    setAnimEffect({ type: 'TRANSFORM', target: side === 'player' ? 'player' : 'enemy' });
    await wait(1500);
    setAnimEffect(null);

    if (fruit.transform.firstStrike) {
      unit.fruitFirstStrike = true;
      addLog(`⚡ ${unit.name} 获得了先手行动权！`);
    }

    if (side === 'player') {
      setBattle(prev => ({
        ...prev,
        playerCombatStates: tempBattle.playerCombatStates,
        enemyParty: tempBattle.enemyParty,
      }));
      await wait(500);
      await enemyTurn(tempBattle);
    }
    return tempBattle;
  };

    // ==========================================
  // [修改] 敌人回合 (含被动特性与天气结算)
  // ==========================================
  const enemyTurn = async (currentBattleState = null) => {
   try {
    await wait(500);

    const state = currentBattleState || battle;
    if (!state) { setBattle(prev => prev ? ({...prev, phase: 'input'}) : null); return; }
    const player = state.playerCombatStates?.[state.activeIdx];
    const enemy = state.enemyParty?.[state.enemyActiveIdx];
    if (!player || !enemy) { setBattle(prev => prev ? ({...prev, phase: 'input'}) : null); return; }

    if (enemy.currentHp <= 0) { setBattle(prev => prev ? ({...prev, phase: 'input'}) : null); return; }

    // 领域 enemySkipChance
    const dom = state.activeDomain;
    if (dom && dom.turnsLeft > 0 && dom.ownerSide === 'player' && dom.effect.enemySkipChance) {
        if (Math.random() < dom.effect.enemySkipChance) {
            addLog(`🌀 ${enemy.name} 被领域压制，无法行动!`);
            await wait(800);
            setBattle(prev => ({ ...prev, phase: 'input' }));
            return;
        }
    }

    // AI: 尝试展开领域 (Boss有50%几率，其他20%几率)
    if (enemy.hasDomain && !enemy.usedDomain && !state.activeDomain &&
        (enemy.cursedEnergy || 0) >= (DOMAINS[enemy.domainType]?.ceCost || 999) &&
        enemy.currentHp < getStats(enemy).maxHp * 0.5) {
        const chance = (state.isBoss || state.isChallenge) ? 0.5 : 0.2;
        if (Math.random() < chance) {
            const domDef = DOMAINS[enemy.domainType];
            enemy.cursedEnergy -= domDef.ceCost;
            enemy.usedDomain = true;
            state.activeDomain = {
                name: domDef.name, ownerSide: 'enemy',
                turnsLeft: domDef.turns, effect: domDef.effect, type: enemy.domainType,
            };
            addLog(`🌀 ${enemy.name} 展开领域——${domDef.name}!`);
            addLog(`📖 ${domDef.desc}`);
            setAnimEffect({ type: 'DOMAIN', target: 'enemy' });
            await wait(1500);
            setAnimEffect(null);

            setBattle(prev => ({
              ...prev, phase: 'input',
              turnCount: (prev?.turnCount || 0) + 1,
              playerCombatStates: state.playerCombatStates,
              enemyParty: state.enemyParty,
              activeDomain: state.activeDomain,
            }));
            return;
        }
    }

    // AI: 尝试果实变身 (回合≥3 且 HP<50% 才允许，与玩家规则一致)
    if (enemy.devilFruit && !enemy.fruitUsed && !enemy.fruitTransformed
        && (state.turnCount || 0) >= 3
        && enemy.currentHp < getStats(enemy).maxHp * 0.5) {
      const transformChance = 0.6;
      if (Math.random() < transformChance) {
        const fruit = getFruitById(enemy.devilFruit);
        if (fruit) {
          enemy.fruitTransformed = true;
          enemy.fruitUsed = true;
          enemy.fruitTurnsLeft = fruit.duration;
          enemy.fruitEffects = { ...fruit.transform };
          if (fruit.transform.hpMult) {
            const stats = getStats(enemy);
            const bonus = Math.floor(stats.maxHp * (fruit.transform.hpMult - 1));
            enemy.currentHp = Math.min(enemy.currentHp + bonus, Math.floor(stats.maxHp * fruit.transform.hpMult));
          }
          if (fruit.transformMove) {
            enemy.combatMoves.push({ ...fruit.transformMove, isFruitMove: true });
          }
          addLog(`${enemy.name} 发动了 ${fruit.name}，果实变身！[${FRUIT_CATEGORY_NAMES[fruit.category]}]`);
          setAnimEffect({ type: 'TRANSFORM', target: 'enemy' });
          await wait(1500);
          setAnimEffect(null);

          setBattle(prev => ({
            ...prev, phase: 'input',
            turnCount: (prev?.turnCount || 0) + 1,
            playerCombatStates: state.playerCombatStates,
            enemyParty: state.enemyParty,
          }));
          return;
        }
      }
    }

    // --- AI: 缚誓决策 ---
    const isHardBattle = state.isTrainer || state.isGym || state.isChallenge || state.isStory || state.isBoss;
    if (!enemy.activeVow && enemy.maxCE > 0 && (enemy.cursedEnergy || 0) >= 15) {
      const vowChance = isHardBattle ? 0.25 : 0.08;
      if (Math.random() < vowChance) {
        const hpRatio = enemy.currentHp / getStats(enemy).maxHp;
        const affordableVows = BINDING_VOWS.filter(v => (enemy.cursedEnergy || 0) >= (v.ceCost || 0));
        if (affordableVows.length > 0) {
          let chosenVow = null;
          if (hpRatio < 0.35 && affordableVows.find(v => v.id === 'vow_power')) {
            chosenVow = affordableVows.find(v => v.id === 'vow_power');
          } else if (hpRatio > 0.6 && affordableVows.find(v => v.id === 'vow_speed')) {
            chosenVow = affordableVows.find(v => v.id === 'vow_speed');
          } else if (hpRatio < 0.5 && affordableVows.find(v => v.id === 'vow_burn')) {
            chosenVow = affordableVows.find(v => v.id === 'vow_burn');
          } else {
            chosenVow = _.sample(affordableVows);
          }
          if (chosenVow) {
            enemy.cursedEnergy = Math.max(0, (enemy.cursedEnergy || 0) - (chosenVow.ceCost || 0));
            if (chosenVow.sacrifice.hpPercent) {
              const cost = Math.floor(getStats(enemy).maxHp * chosenVow.sacrifice.hpPercent);
              enemy.currentHp = Math.max(1, enemy.currentHp - cost);
            }
            if (chosenVow.sacrifice.cePercent) {
              const cost = Math.floor((enemy.cursedEnergy || 0) * chosenVow.sacrifice.cePercent);
              enemy.cursedEnergy = Math.max(0, (enemy.cursedEnergy || 0) - cost);
            }
            if (chosenVow.reward.spdMult) {
              const spdBoost = Math.min(6, Math.round(Math.log2(chosenVow.reward.spdMult) * 4));
              enemy.stages.spd = Math.min(6, (enemy.stages.spd || 0) + spdBoost);
            }
            enemy.activeVow = JSON.parse(JSON.stringify({ ...chosenVow, turnsLeft: chosenVow.reward.turns, side: 'enemy' }));
            addLog(`📜 [敌方] ${enemy.name} 立下缚誓——${chosenVow.name}!`);
            addLog(`📖 ${chosenVow.desc}`);
            setAnimEffect({ type: 'BUFF', target: 'enemy' });
            await wait(1200);
            setAnimEffect(null);

            setBattle(prev => ({
              ...prev, phase: 'input',
              turnCount: (prev?.turnCount || 0) + 1,
              playerCombatStates: state.playerCombatStates,
              enemyParty: state.enemyParty,
            }));
            return;
          }
        }
      }
    }

    // --- AI: 蓄力决策 (CE不足30%且无其他行动时) ---
    if (enemy.maxCE > 0 && (enemy.cursedEnergy || 0) < enemy.maxCE * 0.3 && !enemy.activeVow) {
      const chargeChance = isHardBattle ? 0.2 : 0.05;
      if (Math.random() < chargeChance) {
        const gain = Math.floor(enemy.maxCE * 0.25);
        enemy.cursedEnergy = Math.min(enemy.maxCE, (enemy.cursedEnergy || 0) + gain);
        addLog(`🔮 ${enemy.name} 集中精神蓄积咒力! (+${gain}CE)`);
        setAnimEffect({ type: 'CHARGE_CE', target: 'enemy' });
        await wait(1000);
        setAnimEffect(null);
        setBattle(prev => ({
          ...prev, phase: 'input',
          turnCount: (prev?.turnCount || 0) + 1,
          enemyParty: state.enemyParty,
          playerCombatStates: state.playerCombatStates,
        }));
        return;
      }
    }

    // --- AI: 协作技决策 ---
    if (!state.enemyComboUsed && (state.turnCount || 0) >= 3 && enemy.partnerId && isHardBattle) {
      const enemyPartnerIdx = state.enemyParty.findIndex(ep => (ep.uid || ep.id) === enemy.partnerId && ep.currentHp > 0);
      if (enemyPartnerIdx >= 0) {
        const eBl = getBondLevel(enemy.bondPoints || 0);
        if (eBl && Math.random() < 0.2) {
          const ePt = state.enemyParty[enemyPartnerIdx];
          const eCombo = getComboMove(enemy, ePt);
          const ePower = Math.floor(eCombo.power * eBl.powerMult * 0.8);
          const eStats = getStats(enemy);
          const ePtStats = getStats(ePt);
          const pStats = getStats(player);

          const eHpCost = Math.floor(eStats.maxHp * 0.15);
          const ePtHpCost = Math.floor(ePtStats.maxHp * 0.15);
          enemy.currentHp = Math.max(1, enemy.currentHp - eHpCost);
          ePt.currentHp = Math.max(1, ePt.currentHp - ePtHpCost);

          const eAtk = eCombo.cat === 'special' ? eStats.s_atk : eStats.p_atk;
          const pDef = eCombo.cat === 'special' ? pStats.s_def : pStats.p_def;
          const eStab = (eCombo.type === enemy.type || eCombo.type === ePt.type) ? 1.5 : 1;
          const eTypeMod = getTypeMod(eCombo.type, player.type);
          const eIsCrit = eCombo.effect?.crit || Math.random() < 0.1;
          const eCritMult = eIsCrit ? 1.5 : 1;
          let eDmg = Math.max(1, Math.floor(((enemy.level * 2 / 5 + 2) * ePower * eAtk / pDef / 50 + 2) * eStab * eTypeMod * eCritMult * (0.85 + Math.random() * 0.15)));

          addLog(`🤝 [敌方] ${enemy.name} 和 ${ePt.name} 发动协作技——【${eCombo.name}】！`);
          if (eIsCrit) addLog(`💥 暴击！`);
          player.currentHp = Math.max(0, player.currentHp - eDmg);
          addLog(`💥 ${eCombo.name} 对 ${player.name} 造成 ${eDmg} 点伤害！`);

          if (eCombo.effect) {
            if (eCombo.effect.burn && Math.random() < eCombo.effect.burn && !player.status) { player.status = 'BRN'; addLog(`🔥 ${player.name} 被灼伤了！`); }
            if (eCombo.effect.paralyze && Math.random() < eCombo.effect.paralyze && !player.status) { player.status = 'PAR'; addLog(`⚡ ${player.name} 被麻痹了！`); }
            if (eCombo.effect.freeze && Math.random() < eCombo.effect.freeze && !player.status) { player.status = 'FRZ'; addLog(`🧊 ${player.name} 被冻结了！`); }
            if (eCombo.effect.poison && Math.random() < eCombo.effect.poison && !player.status) { player.status = 'PSN'; addLog(`☠️ ${player.name} 中毒了！`); }
            if (eCombo.effect.defDown) { player.stages = { ...(player.stages || {}), p_def: Math.max(-6, (player.stages?.p_def || 0) - eCombo.effect.defDown) }; }
            if (eCombo.effect.spdDown) { player.stages = { ...(player.stages || {}), spd: Math.max(-6, (player.stages?.spd || 0) - eCombo.effect.spdDown) }; }
          }

          state.enemyComboUsed = true;
          setBattle(prev => ({
            ...prev, phase: 'input', enemyComboUsed: true,
            turnCount: (prev?.turnCount || 0) + 1,
            playerCombatStates: state.playerCombatStates,
            enemyParty: state.enemyParty,
          }));
          await wait(800);
          return;
        }
      }
    }

    // --- AI: 技能选择 ---
    const movesWithPP = (enemy.combatMoves || enemy.moves).filter(m => m.isCursed ? (enemy.cursedEnergy || 0) >= (m.ceCost || 0) : m.pp > 0);
    const smartMoves = movesWithPP.filter(m => {
        if (m.p > 0) return true;
        if (m.effect) {
            if (m.effect.type === 'STATUS' && player.status) return false;
            if (m.effect.type === 'DEBUFF') {
                const currentStage = player.stages[m.effect.stat] || 0;
                if (currentStage <= -6) return false;
            }
            if (m.effect.type === 'BUFF') {
                const currentStage = enemy.stages[m.effect.stat] || 0;
                if (currentStage >= 6) return false;
            }
        }
        return true;
    });

    let enemyMove;
    if (isHardBattle && smartMoves.length > 1) {
      // 训练家AI: 根据局势智能选择技能
      const hpRatio = enemy.currentHp / getStats(enemy).maxHp;
      const playerHpRatio = player.currentHp / getStats(player).maxHp;
      const damageMoves = smartMoves.filter(m => m.p > 0);
      const buffMoves = smartMoves.filter(m => m.effect?.type === 'BUFF');
      const debuffMoves = smartMoves.filter(m => m.effect?.type === 'DEBUFF' || m.effect?.type === 'STATUS');
      const healMoves = smartMoves.filter(m => m.effect?.type === 'HEAL' || m.t === 'HEAL');
      const cursedMoves = smartMoves.filter(m => m.isCursed && m.p > 0);
      const fruitMoves = smartMoves.filter(m => m.isFruitMove || m.isExtra);

      // 缚誓加成下优先高威力
      if (enemy.activeVow?.reward?.atkMult > 1 || enemy.activeVow?.reward?.nextMovePower > 1) {
        const strongest = damageMoves.sort((a, b) => (b.p || 0) - (a.p || 0))[0];
        if (strongest) { enemyMove = strongest; }
      }
      // 玩家残血 → 用最强招收割
      if (!enemyMove && playerHpRatio < 0.25 && damageMoves.length > 0) {
        enemyMove = damageMoves.sort((a, b) => (b.p || 0) - (a.p || 0))[0];
      }
      // 自身高血量开局 → 偶尔用buff/debuff
      if (!enemyMove && hpRatio > 0.7 && Math.random() < 0.35) {
        if (buffMoves.length > 0 && Math.random() < 0.5) {
          enemyMove = _.sample(buffMoves);
        } else if (debuffMoves.length > 0) {
          enemyMove = _.sample(debuffMoves);
        }
      }
      // 有咒术技能且CE充足 → 概率使用
      if (!enemyMove && cursedMoves.length > 0 && Math.random() < 0.4) {
        enemyMove = _.sample(cursedMoves);
      }
      // 有果实技能 → 概率使用
      if (!enemyMove && fruitMoves.length > 0 && Math.random() < 0.3) {
        enemyMove = _.sample(fruitMoves);
      }
      // 兜底: 从攻击技能中随机
      if (!enemyMove) {
        enemyMove = damageMoves.length > 0 ? _.sample(damageMoves) : _.sample(smartMoves);
      }
    } else if (smartMoves.length > 0) {
        enemyMove = _.sample(smartMoves);
    } else if (movesWithPP.length > 0) {
        enemyMove = _.sample(movesWithPP); 
    }

    if (!enemyMove) {
        enemyMove = { name: '挣扎', p: 20, t: 'NORMAL' }; 
    }
    
    let playerDied = await performAction(enemy, player, enemyMove, 'enemy', state);

    // ▼▼▼ [新增] 回合结束特性结算 (加速) ▼▼▼
    const processPassive = async (unit, side) => {
        if (unit.currentHp <= 0) return;
        if (unit.trait === 'speed_boost') {
            const oldSpd = unit.stages.spd || 0;
            if (oldSpd < 6) {
                unit.stages.spd = oldSpd + 1;
                addLog(`${unit.name} 的 [加速] 提升了速度！`);
                setAnimEffect({ type: 'BUFF', target: side });
                await wait(600);
                setAnimEffect(null);
            }
        }
    };
    await processPassive(player, 'player');
    await processPassive(enemy, 'enemy');

    // 天气回合伤害 (沙暴/冰雹)
    const applyWeatherDmg = (unit, isPlayer) => {
        if (unit.currentHp <= 0) return;
        let weatherDmg = 0;
        const maxHp = getStats(unit).maxHp;

        if (weather === 'SAND' && !['ROCK','GROUND','STEEL'].includes(unit.type)) {
            weatherDmg = Math.floor(maxHp / 16);
            addLog(`${unit.name} 受到沙暴伤害！`);
        }
        if (weather === 'SNOW' && unit.type !== 'ICE') {
            weatherDmg = Math.floor(maxHp / 16);
            addLog(`${unit.name} 受到冰雹伤害！`);
        }

        if (weatherDmg > 0) {
            unit.currentHp = Math.max(0, unit.currentHp - weatherDmg);
            if (unit.currentHp <= 0 && isPlayer) playerDied = true;
        }
    };

    applyWeatherDmg(player, true);
    applyWeatherDmg(enemy, false);

    const playerExpLogs = checkEffectExpiration(player, player);
    const enemyExpLogs = checkEffectExpiration(enemy, enemy);
    [...playerExpLogs, ...enemyExpLogs].forEach(l => addLog(l));

    // 咒力自然恢复
    [player, enemy].forEach(u => {
        if (u.maxCE > 0 && u.currentHp > 0) {
            let regen = CURSED_ENERGY_CONFIG.regenPerTurn;
            if (u.activeVow?.reward?.ceMult) regen = Math.floor(regen * u.activeVow.reward.ceMult);
            u.cursedEnergy = Math.min(u.maxCE, (u.cursedEnergy || 0) + regen);
        }
    });

    // 领域展开回合递减 & DoT
    if (state.activeDomain && state.activeDomain.turnsLeft > 0) {
        const dom = state.activeDomain;
        dom.turnsLeft--;
        const eff = dom.effect;
        if (eff.dot > 0) {
            const target = dom.ownerSide === 'player' ? enemy : player;
            const dotDmg = Math.floor(getStats(target).maxHp * eff.dot);
            target.currentHp = Math.max(0, target.currentHp - dotDmg);
            addLog(`🌀 领域效果: ${target.name} 受到 ${dotDmg} 点领域伤害!`);
            if (target === player && target.currentHp <= 0) playerDied = true;
        }
        if (eff.healPerTurn > 0) {
            const owner = dom.ownerSide === 'player' ? player : enemy;
            const heal = Math.floor(getStats(owner).maxHp * eff.healPerTurn);
            owner.currentHp = Math.min(getStats(owner).maxHp, owner.currentHp + heal);
            addLog(`🌀 领域效果: ${owner.name} 恢复了 ${heal} HP!`);
        }
        if (dom.turnsLeft <= 0) {
            addLog(`🌀 ${dom.name} 的领域消散了!`);
            state.activeDomain = null;
        }
    }

    // 缚誓回合递减 (跳过一次性缚誓——以命搏命/焚尽咒力由技能使用时消耗)
    [player, enemy].forEach((u, idx) => {
        if (u.activeVow && u.activeVow.turnsLeft > 0) {
            const isOneShot = u.activeVow.reward.atkMult || u.activeVow.reward.nextMovePower;
            if (isOneShot) return;
            u.activeVow.turnsLeft--;
            if (u.activeVow.turnsLeft <= 0) {
                const sideLabel = idx === 0 ? '[我方]' : '[敌方]';
                addLog(`📜 ${sideLabel} ${u.name} 的缚誓 [${u.activeVow.name}] 已结束`);
                u.activeVow = null;
            }
        }
    });

    // 果实变身回合递减 + 每回合效果
    [player, enemy].forEach(u => {
        if (u.fruitTransformed && u.fruitTurnsLeft > 0) {
            const fe = u.fruitEffects;
            if (fe && fe.healPerTurn && u.currentHp > 0) {
                const heal = Math.floor(getStats(u).maxHp * fe.healPerTurn);
                u.currentHp = Math.min(getStats(u).maxHp, u.currentHp + heal);
                addLog(`${u.name} 的果实回复了 ${heal} HP!`);
            }
            if (fe && fe.selfDotPerTurn && u.currentHp > 0) {
                const dot = Math.floor(getStats(u).maxHp * fe.selfDotPerTurn);
                u.currentHp = Math.max(1, u.currentHp - dot);
                addLog(`${u.name} 受到果实反噬 ${dot} 伤害!`);
            }
            if (fe && fe.dotPerTurn) {
                const target = u === player ? enemy : player;
                if (target.currentHp > 0) {
                    const dot = Math.floor(getStats(target).maxHp * fe.dotPerTurn);
                    target.currentHp = Math.max(0, target.currentHp - dot);
                    addLog(`${target.name} 受到果实束缚 ${dot} 伤害!`);
                }
            }
            if (fe && fe.enemySpdDown) {
                const target = u === player ? enemy : player;
                const drop = Math.min(fe.enemySpdDown, 2);
                target.stages.spd = Math.max(-6, (target.stages.spd || 0) - drop);
            }
            if (fe && fe.enemyAtkDown) {
                const target = u === player ? enemy : player;
                const drop = Math.min(fe.enemyAtkDown, 2);
                target.stages.p_atk = Math.max(-6, (target.stages.p_atk || 0) - drop);
            }
            if (fe && fe.enemyAccDown) {
                const target = u === player ? enemy : player;
                const drop = Math.min(fe.enemyAccDown, 2);
                target.stages.acc = Math.max(-6, (target.stages.acc || 0) - drop);
            }
            u.fruitTurnsLeft--;
            if (u.fruitTurnsLeft <= 0) {
                u.fruitTransformed = false;
                u.fruitEffects = null;
                u.combatMoves = (u.combatMoves || []).filter(m => !m.isFruitMove);
                addLog(`${u.name} 的果实变身结束了!`);
            }
        }
    });

    if (playerDied || player.currentHp <= 0) {
       await wait(500);
       const hasAlive = state.playerCombatStates.some(p => p.currentHp > 0);
       if (hasAlive) {
         setBattle(prev => ({ ...prev, showSwitch: true, phase: 'anim', logs: [`${player.name} 倒下了!`, ...prev.logs] }));
       } else {
         handleDefeat();
       }
    } else {
      state.enemyParty[state.enemyActiveIdx].volatiles.protected = false;
      setBattle(prev => ({ 
          ...prev, 
          playerCombatStates: state.playerCombatStates.map(p => ({...p})), 
          enemyParty: state.enemyParty.map(e => ({...e})), 
          phase: 'input',
          turnCount: (prev?.turnCount || 0) + 1,
      }));
    }
   } catch (e) {
      console.error("Enemy Turn Error:", e);
      setBattle(prev => prev ? ({ ...prev, phase: 'input' }) : null);
    }
  };


  // ==========================================
  // [新增] 属性克制计算 (温和版)
  // 强效: 1.5倍 (原2.0) | 微弱: 0.8倍 (原0.5)
  // ==========================================
  const getTypeMod = (moveType, targetType) => {
    // 简化的克制逻辑表 (你可以根据需要完善)
    const chart = {
      NORMAL:  { weak: ['ROCK', 'STEEL'], strong: [] },
      FIRE:    { weak: ['WATER', 'ROCK', 'GROUND'], strong: ['GRASS', 'ICE', 'BUG', 'STEEL'] },
      WATER:   { weak: ['GRASS', 'ELECTRIC'], strong: ['FIRE', 'GROUND', 'ROCK'] },
      GRASS:   { weak: ['FIRE', 'ICE', 'POISON', 'FLYING', 'BUG'], strong: ['WATER', 'GROUND', 'ROCK'] },
      ELECTRIC:{ weak: ['GROUND'], strong: ['WATER', 'FLYING'] },
      ICE:     { weak: ['FIRE', 'FIGHT', 'ROCK', 'STEEL'], strong: ['GRASS', 'GROUND', 'FLYING', 'DRAGON', 'WIND'] },
      FIGHT:   { weak: ['FLYING', 'PSYCHIC', 'FAIRY'], strong: ['NORMAL', 'ICE', 'ROCK', 'STEEL', 'DARK'] },
      POISON:  { weak: ['GROUND', 'PSYCHIC'], strong: ['GRASS', 'FAIRY'] },
      GROUND:  { weak: ['WATER', 'GRASS', 'ICE'], strong: ['FIRE', 'ELECTRIC', 'POISON', 'ROCK', 'STEEL'] },
      FLYING:  { weak: ['ELECTRIC', 'ICE', 'ROCK'], strong: ['GRASS', 'FIGHT', 'BUG'] },
      PSYCHIC: { weak: ['BUG', 'GHOST', 'DARK'], strong: ['FIGHT', 'POISON'] },
      BUG:     { weak: ['FIRE', 'FLYING', 'ROCK'], strong: ['GRASS', 'PSYCHIC', 'DARK'] },
      ROCK:    { weak: ['WATER', 'GRASS', 'FIGHT', 'GROUND', 'STEEL'], strong: ['FIRE', 'ICE', 'FLYING', 'BUG'] },
      GHOST:   { weak: ['GHOST', 'DARK', 'LIGHT'], strong: ['PSYCHIC', 'GHOST'] },
      DRAGON:  { weak: ['ICE', 'DRAGON', 'FAIRY'], strong: ['DRAGON'] },
      DARK:    { weak: ['FIGHT', 'BUG', 'FAIRY', 'LIGHT'], strong: ['PSYCHIC', 'GHOST'] },
      STEEL:   { weak: ['FIRE', 'FIGHT', 'GROUND'], strong: ['ICE', 'ROCK', 'FAIRY'] },
      FAIRY:   { weak: ['POISON', 'STEEL'], strong: ['FIGHT', 'DRAGON', 'DARK'] },
      WIND:    { weak: ['ICE', 'ROCK', 'ELECTRIC'], strong: ['GRASS', 'BUG', 'FIGHT', 'GROUND'] },
      LIGHT:   { weak: ['DARK', 'GHOST'], strong: ['DARK', 'GHOST', 'POISON'] },
    };

    const info = chart[moveType];
    if (!info) return 1.0;

    if (info.strong && info.strong.includes(targetType)) return 1.5; // 克制倍率降低
    if (info.weak && info.weak.includes(targetType)) return 0.8;     // 抵抗倍率提升
    return 1.0;
  };
  // ==========================================
  // [新增] 检查效果过期逻辑
  // 规则：所有效果从第2回合开始，每回合有40%概率消失
  // ==========================================
  const checkEffectExpiration = (unit, state) => {
    const logs = [];

    // 1. 检查能力等级 (Buff/Debuff)
    Object.keys(state.stages).forEach(stat => {
      if (state.stages[stat] !== 0) {
        // 增加回合计数
        state.turnCounters.stages[stat] = (state.turnCounters.stages[stat] || 0) + 1;
        
        // 判定：回合>=2 且 随机数 < 0.4
        if (state.turnCounters.stages[stat] >= 2 && Math.random() < 0.4) {
           state.stages[stat] = 0; // 清除效果
           state.turnCounters.stages[stat] = 0; // 重置计数
           
           // 转换属性名为中文，方便显示日志
           const statNames = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', acc:'命中', eva:'闪避', crit:'暴击' };
           logs.push(`${unit.name} 的 [${statNames[stat]}] 恢复了正常!`);
        }
      } else {
        // 如果当前没有等级变化，确保计数器归零
        state.turnCounters.stages[stat] = 0;
      }
    });

    // 2. 检查异常状态 (Status)
    if (state.status) {
       state.turnCounters.status = (state.turnCounters.status || 0) + 1;
       
       if (state.turnCounters.status >= 2 && Math.random() < 0.4) {
          const statusNames = { PAR:'麻痹', BRN:'灼伤', PSN:'中毒', SLP:'睡眠', FRZ:'冰冻', CON:'混乱' };
          const sName = statusNames[state.status] || '异常';
          
          state.status = null; // 清除状态
          state.turnCounters.status = 0;
          logs.push(`${unit.name} 的 [${sName}] 状态消失了!`);
       }
    } else {
       state.turnCounters.status = 0;
    }

    return logs;
  };

     // ==========================================
  // [核心修复] 战斗行动逻辑 (含特性/亲密度/天气/时间判定)
  // ==========================================
  const performAction = async (attacker, defender, move, source, battleState) => {
    if (!battleState && !battle) return false;
    if (!attacker || !defender || !move) { setBattle(prev => prev ? ({...prev, phase: 'input'}) : prev); return false; }
    setBattle(prev => prev ? ({ ...prev, phase: 'anim' }) : prev);

    const atkIdx = source === 'player' ? battleState.activeIdx : battleState.enemyActiveIdx;
    const defIdx = source === 'player' ? battleState.enemyActiveIdx : battleState.activeIdx;
    
    const atkState = source === 'player' ? battleState.playerCombatStates[atkIdx] : battleState.enemyParty[atkIdx];
    const defState = source === 'player' ? battleState.enemyParty[defIdx] : battleState.playerCombatStates[defIdx];

    // 1. 异常状态判定
    if (atkState.status === 'SLP') {
        atkState.volatiles.sleepTurns--;
        if (atkState.volatiles.sleepTurns > 0) {
            addLog(`${attacker.name} 正在熟睡...`);
            setAnimEffect({ type: 'SLEEP', target: source === 'player' ? 'player' : 'enemy' }); 
            await wait(1200); setAnimEffect(null);
            return false; 
        } else {
            atkState.status = null;
            addLog(`${attacker.name} 醒过来了!`);
        }
    }
    if (atkState.status === 'FRZ') {
        if (Math.random() < 0.8) {
            addLog(`${attacker.name} 被冻结了，无法动弹!`);
            setAnimEffect({ type: 'FREEZE', target: source === 'player' ? 'player' : 'enemy' }); 
            await wait(1200); setAnimEffect(null);
            return false; 
        } else {
            atkState.status = null;
            addLog(`${attacker.name} 的冰融化了!`);
        }
    }
    if (atkState.status === 'PAR' && Math.random() < 0.25) {
        addLog(`${attacker.name} 身体麻痹，无法行动!`);
        setAnimEffect({ type: 'PARALYSIS', target: source === 'player' ? 'player' : 'enemy' }); 
        await wait(1200); setAnimEffect(null);
        return false; 
    }
    if (atkState.status === 'CON') {
        addLog(`${attacker.name} 混乱了!`);
        setAnimEffect({ type: 'CONFUSION', target: source === 'player' ? 'player' : 'enemy' }); 
        await wait(1000); setAnimEffect(null);
        if (Math.random() < 0.33) {
            addLog(`它攻击了自己!`);
            const selfDmg = Math.floor(getStats(attacker).maxHp * 0.15);
            attacker.currentHp = Math.max(0, attacker.currentHp - selfDmg);
            return false;
        }
    }

    if (move.isCursed && move.ceCost) {
        if (atkState.cursedEnergy < move.ceCost) {
            addLog(`${attacker.name} 咒力不足，无法施展 ${move.name}!`);
            return false;
        }
        atkState.cursedEnergy -= move.ceCost;
        addLog(`🔮 消耗 ${move.ceCost} 咒力`);
    } else if (move.pp > 0) {
        let ppCost = 1;
        if (defState.trait === 'pressure') ppCost = 2; 
        move.pp = Math.max(0, move.pp - ppCost);
    }

    // 2. 技能施放与命中
    addLog(`${attacker.name} 使用 ${move.name}`);
    await wait(1000);

    // 守住逻辑 (移到显示技能名之后)
    const isAttackOrDebuff = move.p > 0 || (move.effect && move.effect.target !== 'self');
    if (defState.volatiles.protected && isAttackOrDebuff) {
        addLog(`✋ ${defender.name} 守住了攻击!`); 
        setAnimEffect({ type: 'PROTECT', target: source === 'player' ? 'enemy' : 'player' }); 
        await wait(1200); 
        setAnimEffect(null);
        return false;
    }
    
    const accStage = atkState.stages.acc || 0;
    const evaStage = defState.stages.eva || 0;
    const stage = Math.max(-6, Math.min(6, accStage - evaStage));
    let accMult = stage >= 0 ? (3 + stage) / 3 : 3 / (3 + Math.abs(stage));
    const domHit = battleState.activeDomain;
    if (domHit && domHit.turnsLeft > 0) {
        if (domHit.ownerSide === source && domHit.effect.enemyAccDown) accMult *= domHit.effect.enemyAccDown;
        if (domHit.ownerSide !== source && domHit.effect.evasionBoost) accMult /= domHit.effect.evasionBoost;
        if (domHit.ownerSide !== source && domHit.effect.enemyAccDown) accMult *= domHit.effect.enemyAccDown;
    }
    const moveAcc = move.acc || 100;
    const finalHitChance = moveAcc * accMult;

    // 果实属性免疫
    const defFE = defState.fruitTransformed ? defState.fruitEffects : null;
    if (defFE && defFE.typeImmune && move.t === defFE.typeImmune && move.p > 0) {
        addLog(`${defender.name} 的果实能力免疫了 ${move.t} 属性攻击!`);
        await wait(1000);
        return false;
    }

    // 果实闪避加成
    if (defFE && defFE.evaBoost) {
        const evaRoll = Math.random();
        if (evaRoll < defFE.evaBoost) {
            addLog(`${defender.name} 借助果实能力闪避了攻击!`);
            await wait(1000);
            return false;
        }
    }

    if (move.p > 0 && Math.random() * 100 > finalHitChance) {
        addLog(`但是没有命中!`);
        await wait(1000);
        return false;
    }

    setAnimEffect({ type: move.t, source: source, target: source === 'player' ? 'enemy' : 'player', isCrit: false });
    await wait(1000); 
    setAnimEffect(null);

    // 3. 伤害/效果结算
    let dmg = 0;
    let isDead = false;

    if ((!move.p || move.p === 0) && move.effect) {
        // === 变化类技能 ===
        const eff = move.effect;
        const targetState = eff.target === 'self' ? atkState : defState;
        const targetName = eff.target === 'self' ? attacker.name : defender.name;
        const targetSide = eff.target === 'self' ? (source==='player'?'player':'enemy') : (source==='player'?'enemy':'player');

        if (eff.type === 'BUFF' || eff.type === 'DEBUFF') {
            const delta = eff.type === 'BUFF' ? eff.val : -eff.val;
            const statName = eff.stat;
            targetState.stages[statName] = Math.max(-6, Math.min(6, (targetState.stages[statName] || 0) + delta));
            if(eff.stat2) targetState.stages[eff.stat2] = Math.max(-6, Math.min(6, (targetState.stages[eff.stat2] || 0) + delta));
            
            const statNames = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', acc:'命中', eva:'闪避', crit:'暴击' };
            const sName = statNames[statName] || statName;
            const action = delta > 0 ? '提升' : '下降';
            const degree = Math.abs(delta) > 1 ? '大幅' : '';
            
            addLog(`${targetName} 的 [${sName}] ${degree}${action}了!`);
            setAnimEffect({ type: eff.type, target: targetSide }); 
        } 
        else if (eff.type === 'STATUS') {
            if (targetState.status) {
                addLog(`但是 ${targetName} 已经有异常状态了!`);
            } else if (Math.random() < (eff.chance || 1.0)) {
                targetState.status = eff.status;
                if (eff.status === 'SLP') targetState.volatiles.sleepTurns = _.random(2, 4);
                addLog(`${targetName} 陷入了异常状态!`);
                setAnimEffect({ type: eff.status, target: targetSide }); 
            } else {
                addLog(`但是失败了!`);
            }
        }
         else if (eff.type === 'PROTECT') {
            // 守住是给自己加状态
            // targetState 在前面已经根据 eff.target 计算好了
            // 如果 eff.target 未定义，默认通常是 self (对于守住来说)
            
            // 强制修正：守住的目标永远是自己
            const actualTargetState = atkState; 
            const actualTargetName = attacker.name;
            const actualTargetSide = source === 'player' ? 'player' : 'enemy';

            actualTargetState.volatiles.protected = true;
            addLog(`${actualTargetName} 摆出了防御架势!`);
            setAnimEffect({ type: 'PROTECT', target: actualTargetSide });
        }
        else if (eff.type === 'HEAL') {
            const cap = Math.min(0.5, eff.val || 0.5); 
            const healAmount = Math.floor(getStats(attacker).maxHp * cap);
            attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + healAmount);
            addLog(`${attacker.name} 恢复了体力!`);
            setAnimEffect({ type: 'HEAL', target: targetSide });
        }
        else if (eff.type === 'RESET') {
             atkState.stages = { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 };
             defState.stages = { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 };
             addLog(`全场的能力变化被重置了!`);
        }
        else if (move.isCursed) {
            if (eff.healPercent) {
                const heal = Math.floor(getStats(attacker).maxHp * eff.healPercent);
                attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
                addLog(`🔮 ${attacker.name} 以反转术式恢复了 ${heal} HP!`);
                setAnimEffect({ type: 'HEAL', target: source === 'player' ? 'player' : 'enemy' });
            }
            if (eff.stat && eff.stages) {
                atkState.stages[eff.stat] = Math.min(6, (atkState.stages[eff.stat] || 0) + eff.stages);
                addLog(`🔮 ${attacker.name} 咒力强化! ${eff.stat === 'p_atk' ? '物攻' : eff.stat}+${eff.stages}!`);
                setAnimEffect({ type: 'BUFF', target: source === 'player' ? 'player' : 'enemy' });
            }
            if (eff.isolate) {
                addLog(`🔮 ${attacker.name} 展开了帳! ${eff.turns}回合内双方无法换人!`);
                if (battleState) battleState.isolateTurns = eff.turns;
            }
            if (eff.antiDomain && battleState.activeDomain && battleState.activeDomain.ownerSide !== source) {
                battleState.activeDomain.turnsLeft = Math.max(0, battleState.activeDomain.turnsLeft - (eff.turns || 2));
                addLog(`🔮 简易领域抵消了 ${eff.turns || 2} 回合的领域效果!`);
                if (battleState.activeDomain.turnsLeft <= 0) {
                    addLog(`🌀 对方的领域被完全抵消了!`);
                    battleState.activeDomain = null;
                }
            }
        }
        await wait(1000); setAnimEffect(null);
    } else {
        // === 伤害类技能 ===
        const statsAtk = getStats(attacker, atkState.stages, atkState.status); 
        const statsDef = getStats(defender, defState.stages, defState.status);
        const category = getMoveCategory(move.t);
        let atkVal = category === 'physical' ? statsAtk.p_atk : statsAtk.s_atk;
        let defVal = category === 'physical' ? statsDef.p_def : statsDef.s_def;

        // 果实变身攻防倍率
        const atkFE = atkState.fruitTransformed ? atkState.fruitEffects : null;
        const _defFE = defState.fruitTransformed ? defState.fruitEffects : null;
        if (atkFE) {
          if (category === 'physical' && atkFE.atkMult) atkVal = Math.floor(atkVal * atkFE.atkMult);
          if (category === 'special' && atkFE.sAtkMult) atkVal = Math.floor(atkVal * atkFE.sAtkMult);
        }
        if (_defFE) {
          if (category === 'physical' && _defFE.defMult) defVal = Math.floor(defVal * _defFE.defMult);
          if (category === 'special' && _defFE.sDefMult) defVal = Math.floor(defVal * _defFE.sDefMult);
        }

        let isCrit = false;
        const ceMoveEff = move.isCursed ? (move.effect || {}) : {};
        let critStage = (atkState.stages.crit || 0) + (move.name === '劈开' ? 1 : 0) + (ceMoveEff.critBoost || 0);
        if (atkFE && atkFE.critBoost) critStage += atkFE.critBoost;
        let critChance = statsAtk.crit * (1 + critStage * 0.5);
        if (Math.random() * 100 < critChance) isCrit = true;

        if (ceMoveEff.ignoreDefense) defVal = Math.floor(defVal * 0.2);
        if (atkFE && atkFE.ignoreDefPercent) defVal = Math.floor(defVal * (1 - atkFE.ignoreDefPercent));

        let typeMod = getTypeMod(move.t, defender.type);
        const levelBase = attacker.level * 0.8 + 5;
        const movePower = move.p || 40;
        const powerFactor = movePower * 0.5 + 10;
        const ratio = atkVal / Math.max(1, defVal);
        const statFactor = Math.pow(ratio, 0.65);

        let rawDmg = (levelBase + powerFactor) * statFactor;
        if (isCrit) rawDmg *= 1.5;
        rawDmg *= typeMod;
        const isSTAB = (move.t === attacker.type || move.t === attacker.secondaryType);
        if (isSTAB) rawDmg *= 1.5;
        rawDmg *= (0.9 + Math.random() * 0.2); 

        // 果实变身增伤
        if (atkFE) {
          if (atkFE.movePowerBoost) rawDmg *= (1 + atkFE.movePowerBoost);
          if (atkFE.typeBoost && atkFE.typeBoost[move.t]) rawDmg *= atkFE.typeBoost[move.t];
          if (atkFE.convertNormalTo && move.t === 'NORMAL') {
            rawDmg *= 1.3;
          }
          if (atkFE.fixedDmgPercent && move.p > 0) {
            const fixedBonus = Math.floor(getStats(defender).maxHp * atkFE.fixedDmgPercent);
            rawDmg += fixedBonus;
          }
        }

        // 暗暗果实: 取消对手果实效果
        if (atkFE && atkFE.cancelEnemyFruit && defState.fruitTransformed) {
          defState.fruitTransformed = false;
          defState.fruitEffects = null;
          defState.fruitTurnsLeft = 0;
          defState.combatMoves = defState.combatMoves.filter(m => !m.isFruitMove);
          addLog(`暗暗果实的力量取消了 ${defender.name} 的果实变身!`);
        }

        // ▼▼▼ 天气/时间 伤害修正 ▼▼▼
        if (weather === 'RAIN') {
            if (move.t === 'WATER') { rawDmg *= 1.5; addLog('🌧️ 雨天增强了水系威力！'); }
            if (move.t === 'FIRE') { rawDmg *= 0.5; }
        }
        if (weather === 'SUN') {
            if (move.t === 'FIRE') { rawDmg *= 1.5; addLog('☀️ 烈日增强了火系威力！'); }
            if (move.t === 'WATER') { rawDmg *= 0.5; }
        }
        if (weather === 'SAND' && ['ROCK','GROUND','STEEL'].includes(attacker.type)) {
             // 沙暴下岩地钢系特防加成，这里简化为伤害减免
             if (category === 'special') rawDmg *= 0.8; 
        }
        if (weather === 'SNOW' && attacker.type === 'ICE') {
             // 冰雹下冰系防御加成
             if (category === 'physical') rawDmg *= 0.8;
        }
        if (timePhase === 'NIGHT' && (move.t === 'GHOST' || move.t === 'DARK')) {
            rawDmg *= 1.2; // 夜晚幽灵/恶系增强
        }
        if (timePhase === 'DAY' && (move.t === 'GRASS' || move.t === 'FIRE')) {
            rawDmg *= 1.1;
        }

        const dom = battleState.activeDomain;
        if (dom && dom.turnsLeft > 0) {
            const isOwner = (dom.ownerSide === source);
            const eff = dom.effect;
            if (isOwner) {
                if (eff.atkBoost) rawDmg *= eff.atkBoost;
                if (eff.defBoost && !isOwner) rawDmg /= eff.defBoost;
            } else {
                if (eff.enemyAtkDown) rawDmg *= eff.enemyAtkDown;
                if (eff.enemyDefDown) rawDmg /= eff.enemyDefDown;
                if (eff.defBoost) rawDmg /= eff.defBoost;
            }
        }

        const vow = atkState.activeVow;
        if (vow && vow.turnsLeft > 0) {
            if (vow.reward.atkMult) { rawDmg *= vow.reward.atkMult; vow.turnsLeft = 0; }
            if (vow.reward.nextMovePower) { rawDmg *= vow.reward.nextMovePower; vow.turnsLeft = 0; }
        }
        const defVow = defState.activeVow;
        if (defVow && defVow.turnsLeft > 0) {
            if (defVow.reward.defMult) rawDmg /= defVow.reward.defMult;
            if (defVow.sacrifice?.defMult && defVow.sacrifice.defMult < 1) {
                rawDmg *= (1 / defVow.sacrifice.defMult);
            }
        }

        // 咒具加成 (咒言放大器)
        if (move.isCursed && atkState.cursedBoost) {
            rawDmg *= (1 + atkState.cursedBoost);
        }

        // 特性修正
        if (['overgrow','blaze','torrent','swarm'].includes(attacker.trait)) {
            const typeMap = { overgrow:'GRASS', blaze:'FIRE', torrent:'WATER', swarm:'BUG' };
            if (move.t === typeMap[attacker.trait] && attacker.currentHp < getStats(attacker).maxHp / 3) {
                rawDmg *= 1.5;
                addLog(`${attacker.name} 的特性发动了！`);
            }
        }
        if (attacker.trait === 'technician' && move.p <= 60) rawDmg *= 1.5;
        if (attacker.trait === 'adaptability' && isSTAB) {
            rawDmg *= (2.0 / 1.5);
        }
        if (isCrit && attacker.trait === 'sniper') rawDmg *= 1.5; 

        let isImmune = false;
        if (defender.trait === 'levitate' && move.t === 'GROUND') {
            rawDmg = 0; isImmune = true; addLog(`${defender.name} 漂浮在空中，免疫了攻击！`);
        }
        if (defender.trait === 'flash_fire' && move.t === 'FIRE') {
            rawDmg = 0; isImmune = true; addLog(`${defender.name} 吸收了火焰！`);
        }
        if (defender.trait === 'multiscale' && defender.currentHp === statsDef.maxHp) {
            rawDmg *= 0.5;
        }

        let isDodged = false;
        // 门派修正
        const atkSect = attacker.sectId || 1;
        const atkSectLv = attacker.sectLevel || 1;
        const defSect = defender.sectId || 1;
        const defSectLv = defender.sectLevel || 1;

        if (atkSect === 1) rawDmg *= (1 + (0.03 + atkSectLv * 0.02)); 
        if (defSect === 2) rawDmg *= (1 - (0.03 + defSectLv * 0.02));
        if (defSect === 3) {
            const dodgeChance = 0.02 + defSectLv * 0.01;
            if (Math.random() < dodgeChance) {
                rawDmg = 0; isDodged = true; addLog(`💨 ${defender.name} 施展凌波微步，闪避了攻击！`);
            }
        }
        if (atkSect === 4 && isCrit) rawDmg *= (1 + (0.1 + atkSectLv * 0.05));
        if (atkSect === 10) rawDmg *= (1 + (0.05 + atkSectLv * 0.02));
        if (atkSect === 11 && category === 'special') rawDmg *= (1 + (0.02 + atkSectLv * 0.01));

        dmg = Math.floor(rawDmg);
        if (!isImmune && !isDodged) {
          dmg = Math.max(1, dmg);
        }

        if (isCrit && !isImmune && !isDodged) {
          setAnimEffect({ type: move.t, target: source === 'player' ? 'enemy' : 'player', isCrit: true });
          await wait(600);
          setAnimEffect(null);
        }

        if (isImmune || isDodged) {
          addLog(`造成 0 伤害`);
        } else {
          let msg = `造成 ${dmg} 伤害`;
          if (isCrit) msg += ` (暴击!)`;
          if (typeMod > 1.2) msg += ` 效果拔群!`;
          if (typeMod < 0.9) msg += ` 收效甚微...`;
          addLog(msg);
        }

        if (source === 'player' && !isImmune && !isDodged) {
          updateAchStat({ maxDamageDealt: dmg });
          if (typeMod > 1.2) updateAchStat({ superEffectiveHits: 1 });
        }

        // 结实 & 亲密度保命
        let survivalMsg = null;
        if (defender.trait === 'sturdy' && defender.currentHp === statsDef.maxHp && dmg >= defender.currentHp) {
            dmg = defender.currentHp - 1;
            survivalMsg = `${defender.name} 的结实特性撑住了！`;
        }
        else if (defender.intimacy >= 200 && dmg >= defender.currentHp && Math.random() < 0.15) {
            dmg = defender.currentHp - 1;
            survivalMsg = `${defender.name} 为了不让你伤心，撑住了攻击！`;
        }

        defender.currentHp = Math.max(0, defender.currentHp - dmg);
        if (isNaN(defender.currentHp)) defender.currentHp = 0;
        if (survivalMsg) addLog(survivalMsg);
        isDead = defender.currentHp <= 0;

        // 果实攻击附带效果
        if (atkFE && !isDead && dmg > 0) {
          if (atkFE.onHitBurn && !defState.status && Math.random() < atkFE.onHitBurn) {
            defState.status = 'BRN'; addLog(`果实之力灼烧了 ${defender.name}!`);
          }
          if (atkFE.onHitPoison && !defState.status && Math.random() < atkFE.onHitPoison) {
            defState.status = 'PSN'; addLog(`果实毒素侵蚀了 ${defender.name}!`);
          }
          if (atkFE.onHitFreeze && !defState.status && Math.random() < atkFE.onHitFreeze) {
            defState.status = 'FRZ'; addLog(`果实冰封了 ${defender.name}!`);
          }
          if (atkFE.onHitConfuse && !defState.volatiles.confused && Math.random() < atkFE.onHitConfuse) {
            defState.volatiles.confused = 3; addLog(`果实幻术迷惑了 ${defender.name}!`);
          }
          if (atkFE.onHitDefDown) {
            defState.stages.p_def = Math.max(-6, (defState.stages.p_def || 0) - atkFE.onHitDefDown);
            addLog(`${defender.name} 的物防下降了!`);
          }
          if (atkFE.onHitSpdDown) {
            defState.stages.spd = Math.max(-6, (defState.stages.spd || 0) - atkFE.onHitSpdDown);
            addLog(`${defender.name} 的速度下降了!`);
          }
          if (atkFE.hpDrain) {
            const heal = Math.floor(dmg * atkFE.hpDrain);
            attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
            addLog(`${attacker.name} 吸收了 ${heal} HP!`);
          }
          if (atkFE.multiHit) {
            const extraHits = _.random(atkFE.multiHit[0], atkFE.multiHit[1]) - 1;
            for (let h = 0; h < extraHits && defender.currentHp > 0; h++) {
              const extraDmg = Math.max(1, Math.floor(dmg * 0.6));
              defender.currentHp = Math.max(0, defender.currentHp - extraDmg);
              addLog(`追加攻击! 造成 ${extraDmg} 伤害`);
            }
            isDead = defender.currentHp <= 0;
          }
        }
        // 果实防御方反弹
        if (_defFE && dmg > 0 && !isDead) {
          if (_defFE.reflectPhysical && category === 'physical') {
            const ref = Math.floor(dmg * _defFE.reflectPhysical);
            attacker.currentHp = Math.max(0, attacker.currentHp - ref);
            addLog(`${defender.name} 的果实反弹了 ${ref} 伤害!`);
          }
          if (_defFE.reflectAll) {
            const ref = Math.floor(dmg * _defFE.reflectAll);
            attacker.currentHp = Math.max(0, attacker.currentHp - ref);
            addLog(`${defender.name} 的果实反弹了 ${ref} 伤害!`);
          }
        }

        // 反伤与状态触发
        if (defSect === 9 && category === 'physical' && move.p > 0 && dmg > 0) {
            const reflectPct = 0.05 + defSectLv * 0.03;
            const reflectDmg = Math.floor(dmg * reflectPct);
            if (reflectDmg > 0) {
                attacker.currentHp = Math.max(0, attacker.currentHp - reflectDmg);
                addLog(`🥊 打狗棒法反弹了 ${reflectDmg} 点伤害！`);
            }
        }
        if (atkSect === 6 && !defender.status && move.p > 0 && Math.random() < (0.05 + atkSectLv * 0.02)) {
            defender.status = 'BRN'; addLog(`🔥 圣火令触发，${defender.name} 灼伤了！`);
        }
        if (defSect === 7 && !attacker.status && move.p > 0 && Math.random() < (0.03 + defSectLv * 0.01)) {
            attacker.status = 'FRZ'; addLog(`❄️ 寒冰劲护体，${attacker.name} 被冻结了！`);
        }
        if (atkSect === 8 && !defender.status && move.p > 0 && Math.random() < (0.05 + atkSectLv * 0.02)) {
            defender.status = 'PSN'; addLog(`☠️ 千蛛手触发，${defender.name} 中毒了！`);
        }
        if (atkSect === 5 && attacker.currentHp > 0) {
            const heal = Math.floor(getStats(attacker).maxHp * (0.02 + atkSectLv * 0.01));
            attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
        }
        if (atkSect === 11 && !isDead && move.p > 0 && !defState.volatiles.confused && Math.random() < (0.03 + atkSectLv * 0.02)) {
            defState.volatiles.confused = 3; addLog(`🏔️ 紫霞神功扰乱心神，${defender.name} 混乱了！`);
        }
        if (defSect === 12 && category === 'special' && move.p > 0 && dmg > 0) {
            const reflectPct = 0.05 + defSectLv * 0.03;
            const reflectDmg = Math.floor(dmg * reflectPct);
            if (reflectDmg > 0) {
                attacker.currentHp = Math.max(0, attacker.currentHp - reflectDmg);
                addLog(`☯️ 太极功以柔克刚，反弹了 ${reflectDmg} 点特攻伤害！`);
            }
        }

        if (category === 'physical' && !isDead) {
            if (defender.trait === 'static' && Math.random() < 0.3 && !attacker.status) {
                attacker.status = 'PAR'; addLog(`${attacker.name} 触碰到静电，麻痹了！`);
            }
            if (defender.trait === 'cute_charm' && Math.random() < 0.3 && !attacker.status) {
                attacker.status = 'CON'; addLog(`${attacker.name} 被 ${defender.name} 迷住了！`);
            }
        }

        if (dom && dom.turnsLeft > 0 && dmg > 0 && dom.ownerSide === source) {
            if (dom.effect.hpDrain) {
                const drainHeal = Math.floor(dmg * dom.effect.hpDrain);
                attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + drainHeal);
                addLog(`🌀 领域效果: ${attacker.name} 吸取了 ${drainHeal} HP!`);
            }
            if (dom.effect.leechBoost && ceMoveEff.leech) {
                const extraHeal = Math.floor(dmg * dom.effect.leechBoost);
                attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + extraHeal);
            }
        }
        if (dom && dom.turnsLeft > 0 && !isDead && dom.ownerSide === source && dom.effect.paralyzeChance && !defender.status) {
            if (Math.random() < dom.effect.paralyzeChance) {
                defState.status = 'PAR'; addLog(`🌀 领域效果: ${defender.name} 被麻痹了!`);
            }
        }

        if (!isDead && move.isCursed && ceMoveEff && dmg > 0) {
            if (ceMoveEff.leech) {
                const heal = Math.floor(dmg * ceMoveEff.leech);
                attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
                addLog(`🔮 ${attacker.name} 吸取了 ${heal} HP!`);
            }
            if (ceMoveEff.hpDrain) {
                const heal = Math.floor(dmg * ceMoveEff.hpDrain);
                attacker.currentHp = Math.min(getStats(attacker).maxHp, attacker.currentHp + heal);
                addLog(`🔮 ${attacker.name} 吸收了 ${heal} HP!`);
            }
            if (ceMoveEff.paralyze && !defender.status && Math.random() < ceMoveEff.paralyze) {
                defState.status = 'PAR'; addLog(`⚡ ${defender.name} 被咒力麻痹了!`);
            }
            if (ceMoveEff.freeze && !defender.status && Math.random() < ceMoveEff.freeze) {
                defState.status = 'FRZ'; addLog(`❄️ ${defender.name} 被咒力冻结了!`);
            }
            if (ceMoveEff.poison && !defender.status) {
                defState.status = 'PSN'; addLog(`☠️ ${defender.name} 被咒力侵蚀，中毒了!`);
            }
            if (ceMoveEff.confuse && Math.random() < ceMoveEff.confuse) {
                defState.volatiles.confused = 3; addLog(`🌀 ${defender.name} 陷入了混乱!`);
            }
            if (ceMoveEff.spdDown) {
                defState.stages.spd = Math.max(-6, (defState.stages.spd || 0) - ceMoveEff.spdDown);
                addLog(`🔮 ${defender.name} 的速度下降了!`);
            }
            if (ceMoveEff.accDown) {
                defState.stages.acc = Math.max(-6, (defState.stages.acc || 0) - ceMoveEff.accDown);
                addLog(`🔮 ${defender.name} 的命中下降了!`);
            }
            if (ceMoveEff.atkDown) {
                defState.stages.p_atk = Math.max(-6, (defState.stages.p_atk || 0) - ceMoveEff.atkDown);
                defState.stages.s_atk = Math.max(-6, (defState.stages.s_atk || 0) - ceMoveEff.atkDown);
                addLog(`🔮 ${defender.name} 的攻击下降了!`);
            }
            if (ceMoveEff.breakBarrier) {
                defState.volatiles.protected = false;
                if (battleState.activeDomain && battleState.activeDomain.ownerSide !== source) {
                    battleState.activeDomain = null;
                    addLog(`🔮 天逆鉾破除了对方的领域!`);
                }
            }
        }

        if (!isDead && move.effect && move.p > 0) {
             const eff = move.effect;
             if (!move.isCursed && Math.random() < (eff.chance || 1.0)) {
                 const targetState = eff.target === 'self' ? atkState : defState;
                 const targetName = eff.target === 'self' ? attacker.name : defender.name;
                 const targetSide = eff.target === 'self' ? (source==='player'?'player':'enemy') : (source==='player'?'enemy':'player');
                 
                 if (eff.type === 'BUFF' || eff.type === 'DEBUFF') {
                     const delta = eff.type === 'BUFF' ? eff.val : -eff.val;
                     const statName = eff.stat;
                     targetState.stages[statName] = Math.max(-6, Math.min(6, (targetState.stages[statName] || 0) + delta));
                     addLog(`追加效果: ${targetName} 的能力变化了!`);
                     setAnimEffect({ type: eff.type, target: targetSide });
                 } else if (eff.type === 'STATUS' && !targetState.status) {
                     targetState.status = eff.status;
                     addLog(`追加效果: ${targetName} 陷入了异常状态!`);
                     setAnimEffect({ type: eff.status, target: targetSide });
                 }
                 await wait(800); setAnimEffect(null);
             }
        }
    }

    // 3.5 以命搏命等一次性缚誓: 无论使用了什么技能都立即失效
    const vowCheck = atkState.activeVow;
    if (vowCheck && (vowCheck.reward.atkMult || vowCheck.reward.nextMovePower)) {
        if (vowCheck.turnsLeft > 0) {
            addLog(`📜 ${attacker.name} 的缚誓 [${vowCheck.name}] 已消耗`);
        }
        atkState.activeVow = null;
    }

    // 4. 回合结束结算 (灼伤/中毒) — 每次行动后对行动方结算
    if (!isDead) {
        const applyDot = (unit, state) => {
            if (unit.currentHp <= 0) return false;
            if (state.status === 'BRN' || state.status === 'PSN') {
                const dot = Math.floor(getStats(unit).maxHp / 8);
                unit.currentHp = Math.max(0, unit.currentHp - dot);
                addLog(`${unit.name} 受到 ${state.status==='BRN'?'灼伤':'毒'} 伤害!`);
                return unit.currentHp <= 0;
            }
            return false;
        };
        
        const atkDiedFromDot = applyDot(atkState, atkState);
        const defDiedFromDot = applyDot(defState, defState);

        if (source === 'player' && defDiedFromDot) isDead = true;
        if (source === 'enemy' && atkDiedFromDot) isDead = true;
        if (source === 'enemy' && defDiedFromDot) isDead = true;
    }

    return isDead;
  };

   // ==========================================
  // [修复版] 战斗结算 (修复无限回血 + PP同步 + 进化条件)
  // ==========================================
  const processDefeatedEnemy = (deadEnemy, currentParty, finalBattleState) => { 
  
    const bState = finalBattleState || battle;
    const baseExp = Math.floor(deadEnemy.level * 30 * (bState.isTrainer ? 1.5 : 1));
    
    let levelUpLog = '';
    let hasPendingSkill = false;
    let activeDidLevelUp = false;

    const newParty = currentParty.map((p, index) => {
      let pet = { ...p };
      
    if (bState && bState.playerCombatStates && bState.playerCombatStates[index]) {
        const combatState = bState.playerCombatStates[index];
        pet.currentHp = combatState.currentHp;
        pet.status = combatState.status || null;
        pet.moves = pet.moves.map(m => {
            const combatMove = combatState.combatMoves.find(cm => cm.name === m.name && !cm.isExtra);
            if (combatMove) {
                return { ...m, pp: combatMove.pp }; 
            }
            return m;
        });
    }

      const isActive = index === bState.activeIdx;
      if (pet.currentHp <= 0 && !isActive) return pet;
      const shareRatio = isActive ? 1.0 : 0.5; 
      const expGain = Math.floor(baseExp * shareRatio);
      
      pet.exp += expGain;
      if (!isActive && expGain > 0) levelUpLog += ` ${pet.name}+${expGain}exp`;

      // 升级逻辑
      while (pet.exp >= pet.nextExp) {
        pet.exp -= pet.nextExp;
        pet.level++;
        
        const nKey = pet.nature || 'docile';
        const expMod = NATURE_DB[nKey]?.exp || 1.0;
        pet.nextExp = Math.floor(pet.level * 100 * expMod); 
        pet.currentHp = getStats(pet).maxHp; 
        pet.moves.forEach(m => m.pp = m.maxPP || 15);
        
        if (isActive) {
          levelUpLog += ` ${pet.name}升到了Lv.${pet.level}!`;
          activeDidLevelUp = true; 
        }

        // ▼▼▼ 进化条件检查 (支持 时间/天气/亲密度/分支进化) ▼▼▼
        let meetsCondition = false;
        
        if (pet.evo && pet.level >= pet.evoLvl) {
            const evoData = POKEDEX.find(p => p.id === pet.id);
            
            // 先检查分支进化 (evoAlt) 是否匹配当前条件
            let altTarget = null;
            if (evoData?.evoAlt) {
              for (const alt of evoData.evoAlt) {
                let altMatch = true;
                if (alt.condition.time && alt.condition.time !== timePhase) altMatch = false;
                if (alt.condition.weather && alt.condition.weather !== weather) altMatch = false;
                if (alt.condition.intimacy && (pet.intimacy || 0) < alt.condition.intimacy) altMatch = false;
                if (altMatch) { altTarget = alt.target; break; }
              }
            }
            
            if (altTarget) {
              // 分支进化条件满足，切换进化目标
              pet.evo = altTarget;
              meetsCondition = true;
            } else {
              // 检查默认进化目标的条件
              meetsCondition = true;
              const defaultEvoData = POKEDEX.find(p => p.id === pet.evo);
              const condition = defaultEvoData?.evoCondition;
              if (condition) {
                if (condition.time && condition.time !== timePhase) meetsCondition = false;
                if (condition.weather && condition.weather !== weather) meetsCondition = false;
                if (condition.intimacy && (pet.intimacy || 0) < condition.intimacy) meetsCondition = false;
              }
            }
        }

        if (meetsCondition) {
           pet.canEvolve = true;
           if (isActive) levelUpLog += ` (✨进化征兆!)`;
        }
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        if (pet.level % 5 === 0) {
          const newMove = getMoveByLevel(pet.type, pet.level);
          const alreadyHas = pet.moves.find(m => m.name === newMove.name);
          const alreadyPending = pet.pendingLearnMove && pet.pendingLearnMove.name === newMove.name;
          
          if (!alreadyHas && !alreadyPending) {
            if (pet.moves.length < 4) {
              pet.moves.push(newMove);
              if (isActive) levelUpLog += ` 学会[${newMove.name}]`;
            } else {
              pet.pendingLearnMove = newMove;
              hasPendingSkill = true;
              if (isActive) levelUpLog += ` 领悟新技能!`;
            }
          }
        }
      }
      return pet;
    });

    return { 
      newParty, 
      logMsg: `击败${deadEnemy.name}! +${baseExp}XP ${levelUpLog}`,
      hasPendingSkill,
      activeDidLevelUp, 
      activeDidEvolve: false 
    };
  };

   const enterInfinityCastle = () => {
    if (party.length < 1) { alert("请先携带精灵！"); return; }
    
    // ▼▼▼ 门槛：Lv.80 ▼▼▼
    if (party[0].level < 80) { 
        alert("⚠️ 极度危险区域！\n无限城内恶鬼横行，建议首发精灵达到 Lv.80 再来挑战。"); 
        return; 
    }
    
    alert("🚪 琵琶声响起... 你掉入了无限城！\n在这里，只有不断战斗才能生存下去。");
    
    setInfinityState({
      floor: 1,
      buffs: [],
      status: 'selecting'
    });
    setView('infinity_castle');
  };


   // [硬核策略版] 生成无限城战斗
  const startInfinityBattle = (difficulty) => {
    const floor = infinityState.floor;
    let enemyPool = [];
    
    // 1. 等级曲线：80级起步，每5层升1级，100层时达到100级 (封顶100)
    let enemyLvl = Math.min(100, 80 + Math.floor(floor / 5)); 

    let bossName = null;
    let isBoss = false;

    // Boss 层逻辑
    if (floor % 10 === 0) {
        if (floor === 100) {
            enemyPool = [MOON_DEMONS.MUZAN];
            bossName = "鬼舞辻·无惨";
            enemyLvl = 100; // 满级
        } else {
            enemyPool = MOON_DEMONS.UPPER;
            bossName = `上弦之鬼 (第${floor}层)`;
        }
        isBoss = true;
    } else {
        enemyPool = difficulty === 'hard' ? MOON_DEMONS.LOWER : [18, 54, 94, 109, 197, 212, 286]; 
    }

    const enemyId = _.sample(enemyPool);
    // 创建基础敌人
    const enemy = createPet(enemyId, enemyLvl, true, isBoss); 
    if (bossName) enemy.name = bossName;

    // ▼▼▼▼▼▼▼▼▼▼ 核心强化逻辑 ▼▼▼▼▼▼▼▼▼▼

    // 2. 门派强化 (Sect)
    // 层数越高，门派等级越高。80层以上必定满级(10级)。
    // 门派效果极其强大，例如10级丐帮反弹35%伤害，10级天机阁无视30%防御
    const minSectLv = Math.floor(floor / 10);
    const maxSectLv = Math.min(10, 3 + Math.floor(floor / 8));
    
    enemy.sectId = _.random(1, 12); // 随机分配一个门派(12个门派)
    enemy.sectLevel = Math.min(10, _.random(minSectLv, maxSectLv));
    
    // 3. 装备技能强化 (Equipment Skills)
    // 敌人也会携带装备，并因此获得额外的第5、第6个技能！
    // 30层以上带1个装备，70层以上带2个装备
    const equipCount = floor > 70 ? 2 : (floor > 30 ? 1 : 0);
    const enemyEquips = [null, null];

    for (let i = 0; i < equipCount; i++) {
        // 随机抽取一个带有技能的装备 (从随机装备库中)
        const baseEquip = _.sample(RANDOM_EQUIP_DB);
        // 使用 createUniqueEquip 生成带随机技能的装备实例
        const fullEquip = createUniqueEquip(baseEquip.id);
        enemyEquips[i] = fullEquip;
    }
    enemy.equips = enemyEquips;

    // 4. 最终Boss (无惨) 特殊强化
    if (floor === 100) {
        enemy.sectId = 10; // 天机阁 (无视防御，刀刀见血)
        enemy.sectLevel = 10; // 满级
        
        // 强制装备两件神装 (模拟)
        // 1. 禁忌魔导书 (带一个强力特攻技能)
        const book = createUniqueEquip('rng_grimoire'); 
        // 2. 龙之心 (大幅加血 + 技能)
        const heart = createUniqueEquip('rng_heart');
        
        enemy.equips = [book, heart];
        
        // 修正属性，使其虽然是100级但数值极高 (模拟Boss面板)
        enemy.customBaseStats = { hp: 150, p_atk: 150, p_def: 120, s_atk: 180, s_def: 120, spd: 140, crit: 30 };
    }

    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 启动战斗 (drop: 0 表示无金币)
    startBattle({ 
        id: 888, 
        name: bossName || `无限城恶鬼 (Lv.${enemyLvl})`, 
        customParty: [enemy], 
        drop: 0 
    }, 'infinity');
  };


      const handleWin = (finalParty) => {
       try {
         if (audioRef.current) {
        audioRef.current.src = BGM_SOURCES.VICTORY;
        audioRef.current.play().catch(() => {});
        audioRef.current.loop = false; 
    }
    
        // 🔥 [捕虫大赛拦截]
            // ▼▼▼ [修复] 捕虫大赛：使用基因评分公式 (解决分数虚高) ▼▼▼
      if (battle.type === 'contest_bug') {
          const syncPartyFromBattle = (currentParty) => {
            return currentParty.map((p, idx) => {
              const cs = battle.playerCombatStates?.[idx];
              if (cs) { p.currentHp = cs.currentHp; p.moves = cs.combatMoves?.slice(0, p.moves?.length) || p.moves; }
              return {...p};
            });
          };
          setParty(prev => syncPartyFromBattle(prev));

          const contestPet = finalParty[0];
          const baseInfo = POKEDEX.find(p => p.id === contestPet.id) || {};
          const baseTotal = (baseInfo.hp||0) + (baseInfo.atk||0) + (baseInfo.def||0) + (baseInfo.spd||0);
          const ivSum = contestPet.ivs ? Object.values(contestPet.ivs).reduce((a, b) => a + b, 0) : 0;
          let score = Math.floor((ivSum * 1.0) + (baseTotal * 0.6));
          if (contestPet.isShiny) score += 100;
          
          grantContestReward(CONTEST_CONFIG.bug, score, contestPet);
          setBattle(null);
          return; 
      }
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    const { enemyParty, mapId, drop, isTrainer, isChallenge, challengeId, isGym, isBoss, type } = battle;

    // ★★★ 剧情推进逻辑 (最优先执行，确保不被后续代码的异常阻断) ★★★
    let storyHandled = false;
    if (type === 'story_task' || type === 'story_mid') {
      try {
        const storyChapter = STORY_SCRIPT[storyProgress];
        if (storyChapter) {
          const resolvedStep = battle.storyTaskStep != null ? battle.storyTaskStep : storyStep;
          const currentTask = storyChapter.tasks?.find(t => t.step === resolvedStep);
          const isStoryMatch = currentTask && currentTask.type === 'battle' &&
              (battle.storyTaskStep != null || battle.trainerName === currentTask.name);
          console.log('[Story] handleWin:', { type, storyProgress, resolvedStep, isStoryMatch, taskName: currentTask?.name });
          if (isStoryMatch) {
            storyHandled = true;
            const nextStep = resolvedStep + 1;
            setStoryStep(nextStep);
            const nextTask = storyChapter.tasks?.find(t => t.step === nextStep);
            console.log('[Story] Advanced to step', nextStep, nextTask ? `→ ${nextTask.name} at (${nextTask.x},${nextTask.y})` : '→ all tasks done');
            if (nextTask) {
              setMapGrid(prevGrid => {
                const g = prevGrid.map(r => [...r]);
                if (g[nextTask.y] && nextTask.x < (g[0]?.length || 0)) g[nextTask.y][nextTask.x] = 99;
                return g;
              });
              setTimeout(() => alert(`✅ 剧情推进！\n\n📍 下一个目标: ${nextTask.name}\n📌 位置: 坐标 (${nextTask.x}, ${nextTask.y})\n\n${nextTask.type === 'battle' ? '⚔️ 前方有敌人！' : '💬 前方有人等待...'}`), 100);
            } else {
              setTimeout(() => alert("🎉 本章剧情任务全部完成！\n\n道路已打通，现在可以去挑战道馆馆主了！"), 100);
            }
            if (storyProgress === 12 && resolvedStep === 4) {
              unlockTitle('巅峰王者');
              setAccessories(prev => [...prev, 'trophy']);
              const godPet = createPet(254, 100, true, true);
              godPet.name = "起源之光(冠军)";
              godPet.customBaseStats = { hp: 200, p_atk: 200, p_def: 200, s_atk: 200, s_def: 200, spd: 200, crit: 50 };
              if (party.length < 6) setParty(prev => [...prev, godPet]);
              else setBox(prev => [...prev, godPet]);
              alert("🏆 恭喜通关二周目！\n\n已获得：\n1. 饰品【冠军奖杯】\n2. 神宠【起源之光】");
            }
          }
        }
      } catch (storyErr) { console.error("[Story] Error in story progression:", storyErr); }
    }
    // ★★★ 剧情推进逻辑结束 ★★★

    let totalBattleExp = 0;
    enemyParty.forEach(e => {
      totalBattleExp += Math.floor(e.level * 50 * (isTrainer ? 1.5 : 1));
    });

    const goldGain = Math.floor((drop + _.random(0, 20)) * (isTrainer ? 1.5 : 1));
    setGold(g => g + goldGain);

    // 家具掉落 (战斗获得, 20%基础概率, Boss/Gym 50%)
    const furnitureDropChance = (isBoss || isGym || isChallenge) ? 0.5 : 0.2;
    if (Math.random() < furnitureDropChance) {
        const battleFurniture = FURNITURE_DB.filter(f => f.dropSource === 'battle');
        if (battleFurniture.length > 0) {
            const droppedDef = _.sample(battleFurniture);
            const quality = rollQuality('battle', isBoss);
            const newFurniture = { baseId: droppedDef.id, quality, placed: false, slotIdx: null };
            setHousing(prev => ({ ...prev, furniture: [...prev.furniture, newFurniture] }));
            const qualInfo = FURNITURE_QUALITY[quality];
            addLog(`🏠 获得家具: ${droppedDef.icon} ${droppedDef.name} (${qualInfo.name})`);
        }
    }

    // 恶魔果实掉落: 击败携带果实的敌人，按稀有度概率掉落
    enemyParty.forEach(ep => {
      if (ep.devilFruit) {
        const fruit = getFruitById(ep.devilFruit);
        if (fruit) {
          const dropRate = FRUIT_RARITY_CONFIG[fruit.rarity]?.dropRate || 0.05;
          const boosted = (battle.isBoss || battle.isChallenge) ? dropRate * 2 : dropRate;
          if (Math.random() < boosted) {
            setFruitInventory(prev => [...prev, fruit.id]);
            addLog(`获得恶魔果实: ${fruit.name} [${FRUIT_RARITY_CONFIG[fruit.rarity]?.label}]!`);
          }
        }
      }
    });

    // 咒具掉落: 训练家/Boss/道馆战斗有概率掉落咒术道具
    if (isTrainer || isGym || isChallenge || type === 'boss') {
      const cursedDropChance = (type === 'boss' || isChallenge) ? 0.15 : (isGym ? 0.1 : 0.05);
      if (Math.random() < cursedDropChance) {
        const cursedKeys = Object.keys(CURSED_ITEMS).filter(k => k !== 'sukuna_finger');
        const dropKey = _.sample(cursedKeys);
        if (dropKey) {
          setInventory(inv => ({ ...inv, cursed: { ...(inv.cursed || {}), [dropKey]: ((inv.cursed || {})[dropKey] || 0) + 1 } }));
          addLog(`获得咒具: ${CURSED_ITEMS[dropKey].icon} ${CURSED_ITEMS[dropKey].name}!`);
        }
      }
      // 宿傩之指: Boss/挑战塔 2%概率掉落
      if ((type === 'boss' || isChallenge) && Math.random() < 0.02) {
        setInventory(inv => ({ ...inv, cursed: { ...(inv.cursed || {}), sukuna_finger: ((inv.cursed || {}).sukuna_finger || 0) + 1 } }));
        addLog(`获得稀有咒具: 🫵 宿傩之指!`);
      }
    }

    // ▼▼▼ 亲密度与魅力值结算逻辑 ▼▼▼
    const updatedParty = finalParty.map((p, index) => {
        let newPet = { ...p };
        
        // 1. 亲密度增长 (Intimacy 0-255)
        // 基础：出战+3，后台+1
        let intGain = (index === battle.activeIdx) ? 3 : 1;
        
        // 加成：道馆/Boss/挑战塔/联盟 翻倍
        if (isGym || type === 'boss' || isChallenge || type === 'league') {
            intGain *= 2;
        }
        
        // 装备加成：如果有安抚之铃(假设id为a4爱心饼干代指)
        if (p.equips && p.equips.includes('a4')) intGain += 2;

        newPet.intimacy = Math.min(255, (newPet.intimacy || 0) + intGain);

        // 2. 魅力值增长 (Charm 0-100)
        // 只有出战的精灵，在击败 馆主/Boss/联盟 时增加
        if (index === battle.activeIdx) {
            if (isGym || type === 'boss' || type === 'league' || type === 'eclipse_leader') {
                // 随机增加 1-2 点
                const charmGain = Math.random() < 0.5 ? 1 : 2;
                newPet.charm = Math.min(100, (newPet.charm || 0) + charmGain);
            }
        }

        return newPet;
    });
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // --- 下面是原有的掉落和结算逻辑 (注意 setParty 使用 updatedParty) ---

    // 1. 元素之塔 -> 掉落进化石
    if (battle.type === 'dungeon_stone') {
        const stoneKeys = Object.keys(EVO_STONES);
        const rewardKey = _.sample(stoneKeys);
        const stone = EVO_STONES[rewardKey];
        
        setInventory(prev => ({
            ...prev, 
            stones: { ...prev.stones, [rewardKey]: (prev.stones[rewardKey]||0) + 1 }
        }));
        addLog(`🎁 副本奖励：获得 ${stone.icon} ${stone.name}！`);
    }
    // 2. 英雄试炼 -> 掉落属性增强剂
    if (battle.type === 'dungeon_stat') {
        const growthItems = GROWTH_ITEMS;
        const rewardItem = _.sample(growthItems);
        
        setInventory(prev => ({
            ...prev, 
            [rewardItem.id]: (prev[rewardItem.id]||0) + 1
        }));
        addLog(`🎁 试炼奖励：获得 ${rewardItem.emoji} ${rewardItem.name}！`);
    }

    // 3. 豪宅金库 -> 额外金币
    if (battle.name === '豪宅金库') {
        addLog(`💰 发财了！从金库中带回了大量金币！`);
    }

    // Boss Rush - 连战Boss塔
    if (battle.type === 'boss_rush') {
      const wave = battle.bossRushWave || 1;
      if (wave < 3) {
        const bossPool = [65, 94, 130, 138, 140, 150, 182, 199, 206];
        const nextLvlBase = Math.min(100, (battle.enemyParty?.[0]?.level || 50) + 5);
        addLog(`🗼 Boss塔第${wave}层通关！准备迎战第${wave + 1}层...`);
        setParty(updatedParty);
        setBattle(null);
        setTimeout(() => {
          startBattle({ id: 992, name: `Boss塔 第${wave+1}层`, lvl: [nextLvlBase, nextLvlBase + 5], pool: bossPool, drop: 2000 + wave * 1000, bossRushWave: wave + 1 }, 'boss_rush');
        }, 1000);
        return;
      } else {
        const bonusGold = 5000;
        setGold(g => g + bonusGold);
        addLog(`🏆 Boss塔全部通关！额外奖励 ${bonusGold} 金币！`);
        const rewardItem = _.sample(GROWTH_ITEMS);
        setInventory(prev => ({ ...prev, [rewardItem.id]: (prev[rewardItem.id]||0) + 1 }));
        addLog(`🎁 通关奖励: ${rewardItem.emoji} ${rewardItem.name}!`);
      }
    }

    // 属性试炼场 - 奖励对应属性TM
    if (battle.type === 'type_challenge') {
      const cType = battle.challengeType;
      if (cType) {
        const matchingTMs = ALL_SKILL_TMS.filter(tm => tm.type === cType);
        if (matchingTMs.length > 0) {
          const rewardTM = _.sample(matchingTMs);
          setInventory(prev => ({ ...prev, tms: { ...prev.tms, [rewardTM.id]: (prev.tms[rewardTM.id]||0) + 1 } }));
          addLog(`📖 属性试炼奖励: ${rewardTM.name}!`);
        }
      }
    }

    // 生存竞技场 - 每波递增，不断变强
    if (battle.type === 'survival') {
      const wave = battle.survivalWave || 1;
      const bonusGold = wave * 500;
      setGold(g => g + bonusGold);
      addLog(`🏟️ 第${wave}波通过！+${bonusGold}金币`);
      // 继续下一波，敌人等级+2
      const nextLvl = Math.min(100, (battle.enemyParty?.[0]?.level || 70) + 2);
      if (confirm(`🏟️ 第${wave}波胜利！\n已累计奖金 ${bonusGold} 金币\n继续挑战第${wave+1}波？(敌人更强)`)) {
        setParty(updatedParty);
        setBattle(null);
        setTimeout(() => {
          startBattle({ id: 990, name: '生存竞技场', lvl: [nextLvl, nextLvl + 3], pool: [...HIGH_TIER_POOL], drop: 0, survivalWave: wave + 1 }, 'survival');
        }, 500);
        return;
      } else {
        addLog(`🏟️ 竞技场结束，共坚持${wave}波！`);
        if (wave >= 5) {
          const rewardItem = _.sample(GROWTH_ITEMS);
          setInventory(prev => ({ ...prev, [rewardItem.id]: (prev[rewardItem.id]||0) + 1 }));
          addLog(`🏅 坚持5波以上！额外获得 ${rewardItem.emoji} ${rewardItem.name}!`);
        }
      }
    }

    // 4. 随机装备掉落
    const dropRate = isTrainer ? 0.1 : 0.02;
    if (Math.random() < dropRate) {
        const baseEquip = _.sample(RANDOM_EQUIP_DB);
        const newEquip = createUniqueEquip(baseEquip.id);
        setAccessories(prev => [...prev, newEquip]);
        addLog(`🎁 意外收获！敌人掉落了 ${newEquip.icon} ${newEquip.displayName}！`);
    }

    // 5. 门派挑战特殊逻辑
    if (battle.type === 'sect_challenge') {
        const sectId = battle.id - 8000;
        const chiefInfo = SECT_CHIEFS_CONFIG[sectId];
        const sectInfo = SECT_DB[sectId];

        if (!sectTitles.includes(sectId)) {
            setSectTitles(prev => [...prev, sectId]);
            unlockTitle(chiefInfo.title);
            const rewardEquip = createUniqueEquip(_.sample(RANDOM_EQUIP_DB).id);
            setAccessories(prev => [...prev, rewardEquip]);
            addLog(`获得战利品: ${rewardEquip.displayName}`);
            alert(`🏆 挑战成功！\n\n你击败了 ${chiefInfo.name}，夺得了【${chiefInfo.title}】的称号！\n\n🎁 宗师光环已获取：\n请在【训练家卡片】或【门派顶峰】界面佩戴该称号，\n即可激活全队${sectInfo.name}加成：\n✨ ${chiefInfo.buffName}: ${chiefInfo.buffDesc}`);
        } else {
            alert(`🥋 切磋结束！\n你再次证明了自己作为【${chiefInfo.title}】的实力！`);
        }
        
        setParty(updatedParty);
        setBattle(null);
        setView('sect_summit'); 
        return; 
    }

    let partyToSave = updatedParty; // 🔥 使用更新了亲密度的队伍

    // 6. 挑战塔逻辑（阶梯奖励）
    if (isChallenge) {
       if (!completedChallenges.includes(challengeId)) {
         setCompletedChallenges(prev => [...prev, challengeId]);
         try { checkTreasureUnlock('challenge', { challengeId }); } catch(e) {}
         
         const cInfo = [...CHALLENGES, ...JJK_CHALLENGES].find(c => c.id === challengeId);
         const cBossLv = cInfo ? cInfo.bossLvl : 50;
         const cTier = cBossLv <= 35 ? 1 : cBossLv <= 60 ? 2 : cBossLv <= 85 ? 3 : 4;
         
         let rewardAlertLines = [];
         
         if (cTier === 1) {
           setInventory(prev => ({...prev, balls: {...prev.balls, great: (prev.balls.great||0) + 3}}));
           rewardAlertLines.push('1. 🟢 高级球 x3');
           const rewardLv = Math.min(cBossLv, 25);
           const rewardPet = createPet(cInfo?.rewardId || _.random(1,200), rewardLv, false, false);
           if (updatedParty.length < 6) { partyToSave = [...updatedParty, rewardPet]; setParty(partyToSave); }
           else { setParty(updatedParty); setBox(b => [...b, rewardPet]); }
           rewardAlertLines.push(`2. 🐾 ${rewardPet.name} Lv.${rewardLv}`);
           addLog(`🎉 挑战完成！获得 高级球x3 + ${rewardPet.name}！`);
         } else if (cTier === 2) {
           setInventory(prev => ({...prev, balls: {...prev.balls, ultra: (prev.balls.ultra||0) + 2}}));
           rewardAlertLines.push('1. 🔵 超级球 x2');
           const rewardLv = Math.min(cBossLv - 5, 40);
           const rewardPet = createPet(cInfo?.rewardId || _.random(1,300), rewardLv, false, false);
           if (updatedParty.length < 6) { partyToSave = [...updatedParty, rewardPet]; setParty(partyToSave); }
           else { setParty(updatedParty); setBox(b => [...b, rewardPet]); }
           rewardAlertLines.push(`2. 🐾 ${rewardPet.name} Lv.${rewardLv}`);
           const equipBase = _.sample(['rng_heart', 'rng_scroll']);
           const equip = createUniqueEquip(equipBase);
           if (equip) { setAccessories(prev => [...prev, equip]); rewardAlertLines.push(`3. 🎁 ${equip.displayName}`); }
           addLog(`🎉 挑战完成！获得 超级球x2 + ${rewardPet.name}！`);
         } else if (cTier === 3) {
           setInventory(prev => ({...prev, balls: {...prev.balls, ultra: (prev.balls.ultra||0) + 3}}));
           rewardAlertLines.push('1. 🔵 超级球 x3');
           const rewardLv = Math.min(cBossLv - 10, 55);
           const isShinyReward = Math.random() < 0.3;
           const rewardPet = createPet(cInfo?.rewardId || _.random(1,400), rewardLv, false, isShinyReward);
           if (updatedParty.length < 6) { partyToSave = [...updatedParty, rewardPet]; setParty(partyToSave); }
           else { setParty(updatedParty); setBox(b => [...b, rewardPet]); }
           rewardAlertLines.push(`2. ${isShinyReward ? '✨ 闪光 ' : '🐾 '}${rewardPet.name} Lv.${rewardLv}`);
           const equipBase = _.sample(['rng_grimoire', 'rng_sword', 'rng_shield', 'rng_heart', 'rng_scroll']);
           const equip = createUniqueEquip(equipBase);
           if (equip) { setAccessories(prev => [...prev, equip]); rewardAlertLines.push(`3. 🎁 ${equip.displayName}`); }
           addLog(`🎉 挑战完成！获得 超级球x3 + ${rewardPet.name}！`);
         } else {
           setInventory(prev => ({...prev, balls: {...prev.balls, master: prev.balls.master + 1}}));
           rewardAlertLines.push('1. 🔮 大师球 x1');
           const rewardLv = Math.min(cBossLv - 5, 70);
           const rewardPet = createPet(cInfo?.rewardId || _.random(1,500), rewardLv, false, true);
           if (updatedParty.length < 6) { partyToSave = [...updatedParty, rewardPet]; setParty(partyToSave); }
           else { setParty(updatedParty); setBox(b => [...b, rewardPet]); }
           rewardAlertLines.push(`2. ✨ 闪光 ${rewardPet.name} Lv.${rewardLv}`);
           const equipBase = _.sample(['rng_grimoire', 'rng_sword', 'rng_shield', 'rng_heart', 'rng_scroll']);
           const equip = createUniqueEquip(equipBase);
           if (equip) { setAccessories(prev => [...prev, equip]); rewardAlertLines.push(`3. 🎁 ${equip.displayName}`); }
           addLog(`🎉 挑战完成！获得 大师球 + 闪光${rewardPet.name}！`);
         }
         
         setTimeout(() => alert(`🏆 挑战通关！\n\n获得奖励：\n${rewardAlertLines.join('\n')}\n\n${updatedParty.length >= 6 ? '(队伍已满，精灵已发送到电脑)' : ''}`), 300);
       } else {
           setParty(updatedParty);
       }
    } else {
        setParty(updatedParty);
    }

    if (battle.name === '狩猎地带') unlockTitle('狩猎大师');
    if (battle.name === '豪宅金库') unlockTitle('大富翁');

    // 7. 无限城逻辑
    if (battle.type === 'infinity') {
        const currentFloor = infinityState.floor;
        if (currentFloor === 100) {
            unlockTitle('日之呼吸'); 
            unlockTitle('继国缘一'); 
            setAccessories(prev => [...prev, 'blue_lily', 'nichirin_blade']);
            const godPet = createPet(183, 100, true, true); 
            godPet.name = "缘一·路卡利欧";
            godPet.isFusedShiny = true; 
            godPet.customBaseStats = { hp: 120, p_atk: 180, p_def: 100, s_atk: 180, s_def: 100, spd: 150, crit: 50 };
            const sunBreathingMove = { name: '火之神神乐', p: 200, t: 'FIRE', pp: 5, maxPP: 5, acc: 100, desc: '日之呼吸第十三型', effect: { type: 'STATUS', status: 'BRN', chance: 1.0 } };
            godPet.moves[0] = sunBreathingMove;

             if (updatedParty.length < 6) setParty([...updatedParty, godPet]);
            else {
                setParty(updatedParty);
                setBox(prev => [...prev, godPet]);
            }
            if (!caughtDex.includes(183)) setCaughtDex(prev => [...prev, 183]);

            alert(`🌅 恭喜通关【无限城 100层】！\n获得传说称号、饰品及神宠！`);
            setInfinityState(null);
            setBattle(null);
            setView('grid_map');
            return;
        }
        
        if ([25, 50, 75].includes(currentFloor)) {
            const equipBases = currentFloor >= 50 ? ['rng_grimoire', 'rng_sword', 'rng_heart'] : ['rng_scroll', 'rng_shield', 'rng_sword'];
            const equipBase = _.sample(equipBases);
            const eqReward = createUniqueEquip(equipBase);
            if (eqReward) {
                setAccessories(prev => [...prev, eqReward]);
                addLog(`🎁 第${currentFloor}层奖励：获得 ${eqReward.displayName}！`);
            }
        }
        if (currentFloor % 5 === 0 || currentFloor % 10 === 0) {
            const options = _.sampleSize(BREATHING_BUFFS, 3);
            setInfinityState(prev => ({ ...prev, status: 'buff_select', buffOptions: options }));
            alert(`🎉 击败了强敌！\n请选择一种【呼吸法】强化自身！`);
        } else {
            nextInfinityFloor();
        }
        setBattle(null);
        setView('infinity_castle'); 
        return; 
    }

    // 8. 战斗联盟逻辑
    if (battle.type === 'league') {
        if (leagueRound < 4) {
           unlockTitle('联盟冠军');
           if (leagueWins + 1 >= 5) unlockTitle('传奇霸主');
           setLeagueRound(prev => prev + 1);
           alert(`🎉 胜利！\n恭喜晋级下一轮！`);
           setBattle(null);
           setView('league'); 
           return; 
        } else {
            setLeagueWins(prev => prev + 1);
            setLeagueRound(0); 
            setCompletedChallenges(prev => [...prev, 'LEAGUE_CHAMPION']); 
            setInventory(prev => ({...prev, max_candy: (prev.max_candy || 0) + 1}));
            const rand = Math.random();
            let rewardPet;
            const validIds = POKEDEX.filter(p => p.id <= 500).map(p => p.id);
            const rewardId = _.sample(validIds);
            if (rand < 0.3) rewardPet = createPet(rewardId, 5, false, true);
            else if (rand < 0.6) { rewardPet = createPet(rewardId, 5, false, true); rewardPet.isFusedShiny = true; rewardPet.name = `异色·${rewardPet.name}`; rewardPet.customBaseStats = getStats(rewardPet); } 
            else rewardPet = createPet(rewardId, 5);

            if (updatedParty.length < 6) setParty([...updatedParty, rewardPet]);
            else {
                setParty(updatedParty);
                setBox(prev => [...prev, rewardPet]);
            }

            alert(`🏆 联盟冠军！\n\n获得奖励：\n1. 🍬 神奇糖果 x1\n2. 🎁 Lv.5 ${rewardPet.name}\n3. 🏆 联盟冠军奖杯数 +1`);
            setBattle(null);
            setView('league'); 
            return;
        }
    }

    // 9. 道馆逻辑
    const storyChapter = STORY_SCRIPT[storyProgress];
    if (isGym && mapId && storyChapter && storyChapter.mapId === mapId) {
          const mapBadge = MAPS.find(m=>m.id===mapId)?.badge;
          const isNewBadge = mapBadge && !badges.includes(mapBadge);
          if (isNewBadge) {
            setBadges(prev => [...prev, mapBadge]);
          }
          try { checkTreasureUnlock('gym', { mapId }); } catch(e) {}
          setDialogQueue(storyChapter.outro);
          setCurrentDialogIndex(0);
          setIsDialogVisible(true);
          if (storyChapter.reward?.gold) setGold(g => g + storyChapter.reward.gold);
          if (storyChapter.reward?.balls) {
             setInventory(inv => {
                const newBalls = {...inv.balls};
                Object.keys(storyChapter.reward.balls).forEach(k => newBalls[k] = (newBalls[k] || 0) + storyChapter.reward.balls[k]);
                return {...inv, balls: newBalls};
             });
          }
          if (storyChapter.reward?.items) {
             setInventory(inv => {
                const newInv = {...inv, meds: {...(inv.meds||{})}, cursed: {...(inv.cursed||{})}};
                storyChapter.reward.items.forEach(it => {
                  if (MEDICINES[it.id]) {
                    newInv.meds[it.id] = (newInv.meds[it.id] || 0) + it.count;
                  } else if (it.id === 'berry') {
                    newInv.berries = (newInv.berries || 0) + it.count;
                  } else if (CURSED_ITEMS[it.id]) {
                    newInv.cursed[it.id] = (newInv.cursed[it.id] || 0) + it.count;
                  } else {
                    newInv[it.id] = (newInv[it.id] || 0) + it.count;
                  }
                });
                return newInv;
             });
          }
          
          if (storyChapter.reward?.pokemon) {
             const rewardPetInfo = storyChapter.reward.pokemon;
             const rewardPet = createPet(rewardPetInfo.id, rewardPetInfo.level);
             if (!caughtDex.includes(rewardPet.id)) setCaughtDex(prev => [...prev, rewardPet.id]);
             if (party.length < 6) {
                 setParty(prev => [...prev, rewardPet]);
                 alert(`🎁 获得了伙伴：${rewardPet.name}！\n已加入队伍。`);
             } else {
                 setBox(prev => [...prev, rewardPet]);
                 alert(`🎁 获得了伙伴：${rewardPet.name}！\n队伍已满，已发送到电脑。`);
             }
          }
          setStoryProgress(prev => {
            const newProgress = prev + 1;
            const lycorisChapters = [18, 19, 20];
            if (lycorisChapters.includes(storyChapter?.chapter)) {
              updateAchStat({ lycorisChaptersCleared: 1 });
            }
            try { checkTreasureUnlock('story', { chapter: newProgress }); } catch(e) {}
            return newProgress;
          });
          setStoryStep(0); 
    }

    if (['eclipse_grunt', 'eclipse_executive'].includes(battle.type)) {
      setMapGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          const { x, y } = playerPos; 
          for(let i=-2; i<=2; i++) {
              for(let j=-2; j<=2; j++) {
                  const ty = y + j;
                  const tx = x + i;
                  if (ty >= 0 && ty < GRID_H && tx >= 0 && tx < GRID_W) {
                      if (newGrid[ty][tx] === 11 || newGrid[ty][tx] === 12) {
                          newGrid[ty][tx] = 2; 
                          if(ty > 0 && newGrid[ty-1][tx] === 1) newGrid[ty-1][tx] = 2;
                          if(ty < GRID_H-1 && newGrid[ty+1][tx] === 1) newGrid[ty+1][tx] = 2;
                      }
                  }
              }
          }
          return newGrid;
      });
      setTimeout(() => alert("敌人撤退了！道路已打通。"), 500);
    }
    if (battle.type === 'eclipse_leader') {
      setCompletedChallenges(prev => [...prev, 'ECLIPSE_HQ_CLEARED']);
      const rewardPet = createPet(341, 50); 
      rewardPet.name = "暗黑超梦";
      rewardPet.customBaseStats = { hp: 106, p_atk: 150, p_def: 90, s_atk: 154, s_def: 90, spd: 130, crit: 10 }; 
      if (party.length < 6) setParty([...updatedParty, rewardPet]);
      else {
          setParty(updatedParty);
          setBox(prev => [...prev, rewardPet]);
      }
      setCaughtDex(prev => [...prev, 341]);
      alert("🏆 战胜了日蚀队首领！\n🎉 获得了传说中的精灵【暗黑超梦】！");
      setBattle(null);
      setView('grid_map');
      return; 
    }

    try { checkTreasureUnlock('explore', { mapId }); } catch(e) {}
    
    addLog(`胜利! 总经验+${totalBattleExp} / 金币+${goldGain}`);

    // 成就追踪 - 战斗胜利
    const winAchUpdates = { battlesWon: 1, totalGoldEarned: goldGain };
    const newStreak = (achStats.currentWinStreak || 0) + 1;
    winAchUpdates.currentWinStreak = p => newStreak;
    winAchUpdates.maxWinStreak = newStreak;
    const activePet = battle.playerCombatStates?.[battle.activeIdx];
    if (activePet) {
      const maxHp = getStats(party[battle.activeIdx] || activePet).maxHp;
      if (activePet.currentHp <= maxHp * 0.1) winAchUpdates.clutchWins = 1;
      if (activePet.currentHp >= maxHp) winAchUpdates.perfectWins = 1;
    }
    if (isTrainer && battle.playerCombatStates) {
      const allAlive = battle.playerCombatStates.every(p => p && p.currentHp > 0);
      if (allAlive) winAchUpdates.sweepWins = 1;
    }
    const eMaxLv = Math.max(0, ...enemyParty.map(e => e?.level || 0));
    const pMinLv = Math.min(Infinity, ...(party || []).map(p => p?.level || 999));
    if (eMaxLv - pMinLv >= 20) winAchUpdates.underdogWins = 1;
    if (battle.turnCount && battle.turnCount <= 3) winAchUpdates.quickWins = 1;
    if (type === 'pvp') winAchUpdates.pvpWins = 1;
    // 隐藏成就追踪
    if (battle.turnCount) winAchUpdates.longestBattle = battle.turnCount;
    if (isTrainer && battle.turnCount && battle.turnCount <= 1) winAchUpdates.oneRoundTrainerWin = 1;
    if (activePet && activePet.activeVow && activePet.currentHp <= 1) winAchUpdates.clutchVowWin = 1;
    const playerHadFruit = battle.playerCombatStates?.some(p => p?.fruitUsed);
    const enemyHadFruit = battle.enemyCombatStates?.some(e => e?.fruitUsed);
    if (playerHadFruit && enemyHadFruit) winAchUpdates.dualFruitBattle = 1;
    if (isGym && party?.filter(p => p?.currentHp > 0).length === 1) {
        const alivePets = (battle.playerCombatStates || []).filter(p => p && p.currentHp > 0);
        if (alivePets.length === 1 && party.length === 1) winAchUpdates.soloGymClear = 1;
    }
    // 三系合一：同一场使用领域+缚誓+果实
    const pStates = battle.playerCombatStates || [];
    const usedDomain = pStates.some(p => p?.usedDomain);
    const usedVow = pStates.some(p => p?.vowUsed);
    const usedFruit = pStates.some(p => p?.fruitUsed);
    if (usedDomain && usedVow && usedFruit) winAchUpdates.tripleSystemBattle = 1;
    // 身无分文
    if (gold === 0) winAchUpdates.zeroGoldWin = 1;
    updateAchStat(winAchUpdates);

    // 搭档羁绊累积（胜利时额外+10）
    const bondUpdates = {};
    (battle.playerCombatStates || []).forEach(p => {
      if (p?.partnerId) {
        const hasPartnerAlive = (battle.playerCombatStates || []).some(pp => (pp.uid || pp.id) === p.partnerId && pp.currentHp > 0);
        if (hasPartnerAlive) {
          bondUpdates[p.uid || p.id] = (bondUpdates[p.uid || p.id] || 0) + BOND_PER_KO + (battle.turnCount || 1) * BOND_PER_TURN;
        }
      }
    });
    if (Object.keys(bondUpdates).length > 0) {
      const applyBond = (list) => list.map(p => {
        const uid = p.uid || p.id;
        if (bondUpdates[uid]) return { ...p, bondPoints: (p.bondPoints || 0) + bondUpdates[uid] };
        return p;
      });
      setParty(pp => {
        const updated = applyBond(pp);
        let maxLv = 0;
        let lv3Pairs = 0;
        const counted = new Set();
        [...updated, ...box].forEach(p => {
          if (p.partnerId && p.bondPoints) {
            const bl = getBondLevel(p.bondPoints);
            if (bl) maxLv = Math.max(maxLv, bl.tier);
            if (bl && bl.tier >= 3 && !counted.has(p.partnerId)) { lv3Pairs++; counted.add(p.uid || p.id); }
          }
        });
        if (maxLv > 0) updateAchStat({ maxBondLevel: maxLv, maxBondLv3Pairs: lv3Pairs });
        return updated;
      });
      setBox(bb => applyBond(bb));
    }

    setComboUsedThisBattle(false);

    const hasPendingSkill = partyToSave.some(p => p.pendingLearnMove);

    if (hasPendingSkill) {
      if (!isDialogVisible) setView('grid_map');
      setBattle(null);
      setTimeout(() => {
        alert("⚠️ 队伍中有伙伴领悟了新技能！\n请在队伍界面处理技能去留，否则无法继续移动。");
        setView('team');
      }, 300);
    } else {
      if (!isDialogVisible) setView('grid_map');
      setBattle(null);
    }
       } catch (e) {
         console.error("HandleWin Error:", e);
         setBattle(null);
         setView('grid_map');
    }
  };

    const handleDefeat = async () => {
    addLog("所有伙伴都倒下了...");
    setAnimEffect({ type: 'BLACKOUT' }); 
    
    await wait(2500);
     if (battle && battle.type === 'infinity') {
        alert(`💀 你倒在了第 ${infinityState.floor} 层...\n\n虽然失败了，但你的勇气值得赞赏。\n(队伍已在城外复活)`);
        const healedParty = party.map(p => ({...p, currentHp: getStats(p).maxHp})); 
        setParty(healedParty);
        setInfinityState(null); 
        setAnimEffect(null);
        setBattle(null);
        setView('grid_map'); 
        return;
    }

    // ▼▼▼ [新增] 失败惩罚：亲密度略微下降 ▼▼▼
    const healedParty = party.map(p => ({
      ...p, 
      currentHp: getStats(p).maxHp,
      moves: p.moves.map(m => ({...m, pp: m.maxPP || 15})),
      status: null,
      stages: { p_atk:0, p_def:0, s_atk:0, s_def:0, spd:0, acc:0, eva:0, crit:0 },
      // 亲密度 -1，最低为0
      intimacy: Math.max(0, (p.intimacy || 0) - 1)
    }));
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    setParty(healedParty);
    updateAchStat({ timesDefeated: 1, currentWinStreak: p => 0 });

    enterMap(currentMapId);

    setAnimEffect(null);
    setBattle(null);
    
    alert("你慌忙逃回了附近的营地...\n伙伴们已经恢复了活力！\n(亲密度略微下降)");
  };

  // ==========================================
  // [新增] 逃跑逻辑 (带概率计算 + PP同步)
  // ==========================================
  const handleRun = async () => {
    // 1. 检查是否允许逃跑
    if (battle.isTrainer || battle.isGym || battle.isChallenge || battle.isStory || battle.isPvP) {
        addLog("⚠️ 这种战斗无法逃跑！必须决出胜负！");
        return;
    }

    const playerPet = party[battle.activeIdx];
    const enemyPet = battle.enemyParty[battle.enemyActiveIdx];

    // 3. 计算逃跑概率
    let escapeChance = 0.8;
    if (enemyPet.level > playerPet.level) {
        const levelDiff = enemyPet.level - playerPet.level;
        escapeChance -= (levelDiff * 0.05);
    }
    const pSpd = getStats(playerPet).spd;
    const eSpd = getStats(enemyPet).spd;
    if (pSpd > eSpd) escapeChance += 0.2;
    escapeChance = Math.max(0.2, Math.min(1.0, escapeChance));

     // 4. 执行判定
    if (Math.random() < escapeChance) {
      if (battle.type === 'contest_bug') {
    if (confirm("🏃 你逃离了战斗。\n\n要继续搜寻下一只吗？")) {
        setBattle(null);
        setTimeout(() => encounterNextBug(), 100);
        return;
    } else {
        alert("你退出了捕虫大赛。");
        setActiveContest(null);
        setBattle(null);
        setView('grid_map');
        return;
    }
}
        // --- 成功 ---
        addLog("🏃💨 成功逃跑了！");
        setBattle(prev => ({ ...prev, phase: 'anim' })); 
        await wait(800);

        // 🔥🔥🔥【核心修复：同步战斗血量和PP到全局队伍】🔥🔥🔥
        const newParty = party.map((p, i) => {
            const combatState = battle.playerCombatStates[i];
            if (!combatState) return p;

            let newPet = { ...p };
            newPet.currentHp = combatState.currentHp;
            
            // 同步 PP
            newPet.moves = newPet.moves.map(m => {
                const cm = combatState.combatMoves.find(c => c.name === m.name && !c.isExtra);
                return cm ? { ...m, pp: cm.pp } : m;
            });
            
            return newPet;
        });
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        setParty(newParty);
        updateAchStat({ timesRun: 1 });
        setBattle(null);
        setView('grid_map');
    } else {
        addLog("🚫 逃跑失败！被对方拦住了！");
        setBattle(prev => ({ ...prev, phase: 'busy' })); 
        
        const screen = document.querySelector('.battle-screen');
        if(screen) screen.classList.add('anim-shake-screen');
        await wait(500);
        if(screen) screen.classList.remove('anim-shake-screen');

        await enemyTurn(); 
    }
  };


  // ==========================================
  // [修复版] 捕捉逻辑 (修复捕虫大赛不进队问题)
  // ==========================================
  const handleCatch = async (ballType) => {
    setShowBallMenu(false);
    if (battle.isTrainer || battle.isGym || battle.isChallenge) return addLog("训练家的精灵不能捕捉！");
    if (inventory.balls[ballType] <= 0) return addLog("球不足！");
    try {
    
    // 1. 扣球并播放投掷动画
    setInventory(prev => ({ ...prev, balls: { ...prev.balls, [ballType]: Math.max(0, (prev.balls[ballType] || 0) - 1) } }));
    setBattle(prev => prev ? ({...prev, phase: 'anim'}) : prev);
    setAnimEffect({ type: 'THROW_BALL', target: 'enemy', ballType });
    addLog(`去吧! ${BALLS[ballType].name}!`);
    
    await wait(1000);

    const enemy = battle.enemyParty[battle.enemyActiveIdx];
    const catchChance = calculateCatchRate(ballType, enemy);
    const roll = Math.random();

    // 1.5 球命中后摇晃（紧张感）
    setAnimEffect({ type: 'BALL_WOBBLE', target: 'enemy', ballType });
    await wait(2200);
    setAnimEffect(null);

    // 2. 判定捕捉结果
    if (roll < catchChance || ballType === 'master') { 
      setAnimEffect({ type: 'CATCH_SUCCESS', target: 'enemy', ballType });
      await wait(2200); 
      setAnimEffect(null);

      addLog(`✨ 成功捕捉 ${enemy.name}!`);
      if (!caughtDex.includes(enemy.id)) setCaughtDex(prev => [...prev, enemy.id]);

      // 成就追踪
      const catchAchUpdates = { totalCaught: 1 };
      if (enemy.isShiny) catchAchUpdates.shinyCaught = 1;
      if (LEGENDARY_POOL && LEGENDARY_POOL.includes(enemy.id)) {
        catchAchUpdates.legendCaught = 1;
        try { checkTreasureUnlock('catch_legendary', {}); } catch(e) {}
      }
      if (ballType === 'master') catchAchUpdates.masterBallUsed = 1;
      updateAchStat(catchAchUpdates);

      // 生成新精灵对象 (野外捕获的精灵不保留恶魔果实)
      const newPet = { ...enemy, uid: Date.now() };
      delete newPet.devilFruit;
      delete newPet.fruitUsed;
      delete newPet.fruitTransformed;
      delete newPet.fruitTurnsLeft;
      delete newPet.fruitEffects;
      if (ballType === 'heal') newPet.currentHp = getStats(newPet).maxHp;

      // 🔥 [核心修复] 同步当前战斗状态 (防止战斗中扣血/PP未保存)
      const syncCurrentParty = (currentParty) => {
          return currentParty.map((p, i) => {
              const combatState = battle.playerCombatStates[i];
              if (!combatState) return p;
              let updatedPet = { ...p, currentHp: combatState.currentHp };
              updatedPet.moves = updatedPet.moves.map(m => {
                  const cm = combatState.combatMoves.find(c => c.name === m.name && !c.isExtra);
                  return cm ? { ...m, pp: cm.pp } : m;
              });
              return updatedPet;
          });
      };

      // ▼▼▼ 捕虫大赛：只通过grantContestReward发放奖励精灵，不重复入队 ▼▼▼
      if (battle.type === 'contest_bug') {
          setParty(prev => syncCurrentParty(prev));
          const baseStats = getStats(newPet);
          let score = Math.floor(baseStats.maxHp * 0.6 + baseStats.p_atk * 0.8 + baseStats.spd * 0.6);
          if (newPet.isShiny) score += 100;
          
          grantContestReward(CONTEST_CONFIG.bug, score, newPet);
          setBattle(null);
          return;
      }
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      // 3. 普通捕捉：入队或存入电脑
      if (party.length < 6) {
        setParty(prev => [...syncCurrentParty(prev), newPet]);
      } else {
        setBox(prev => [...prev, newPet]);
        setParty(prev => syncCurrentParty(prev)); 
        addLog("队伍已满，已发送到电脑。");
      }
      
      await wait(1000);
      setBattle(null);
      setView('grid_map');

    } else {
      setAnimEffect({ type: 'CATCH_FAIL', target: 'enemy', ballType });
      addLog("哎呀! 差点就捉到了!");
      await wait(1000);
      setAnimEffect(null);
      setBattle(prev => prev ? ({...prev, phase: 'input'}) : prev);
      await enemyTurn();
    }
    } catch (e) {
      console.error("Catch Error:", e);
      setBattle(prev => prev ? ({ ...prev, phase: 'input' }) : null);
    }
  };


  const depositPokemon = () => {
    if (selectedPartyIdx === null) return;
    if (party.length <= 1) { alert("至少携带一只！"); return; }
    const p = party[selectedPartyIdx];
    setParty(party.filter((_, i) => i !== selectedPartyIdx));
    setBox([...box, p]); setSelectedPartyIdx(null);
  };

  const withdrawPokemon = () => {
    if (selectedBoxIdx === null) return;
    if (party.length >= 6) { alert("队伍已满！"); return; }
    const p = box[selectedBoxIdx];
    setBox(box.filter((_, i) => i !== selectedBoxIdx));
    setParty([...party, p]); setSelectedBoxIdx(null);
  };

  const releasePokemon = () => {
    if (selectedBoxIdx === null) return;
    if (confirm("⚠️ 确定要放生这只精灵吗？它将回归大自然，无法找回！")) {
      const p = box[selectedBoxIdx];
      setBox(box.filter((_, i) => i !== selectedBoxIdx));
      setGold(g => g + 50); 
      alert(`你放生了 ${p.name}，获得了 50 金币作为补偿。`);
      setSelectedBoxIdx(null);
    }
  };

  const updateBuyCount = (id, delta) => {
    setBuyCounts(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };
   // 🔥 [美化] 钓鱼小游戏
  const renderFishingGame = () => {
    const { status, fish, weight, msg } = fishingState;
    return (
      <div className="screen" style={{
          background: 'linear-gradient(180deg, #0288D1 0%, #01579B 100%)', 
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          position: 'relative', overflow: 'hidden'
      }}>
        {/* 水波纹背景 */}
        <div style={{position:'absolute', inset:0, opacity:0.1, backgroundImage:'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize:'30px 30px'}}></div>
        
        <div className="nav-header glass-panel" style={{zIndex:10}}>
            <button className="btn-back" onClick={() => setView('grid_map')}>退出</button>
            <div className="nav-title">🎣 钓鱼大赛</div>
        </div>

        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', zIndex:5}} onClick={reelIn}>
            {/* 状态指示器 */}
            <div style={{
                width:'200px', height:'200px', borderRadius:'50%', 
                background: status==='bite' ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border: status==='bite' ? '4px solid #FF5252' : '4px solid rgba(255,255,255,0.3)',
                animation: status==='waiting' ? 'pulse 2s infinite' : (status==='bite' ? 'shake 0.5s infinite' : 'none'),
                marginBottom: '30px', transition: '0.3s'
            }}>
                <div style={{fontSize:'80px'}}>
                    {status === 'idle' && '🚣'}
                    {status === 'waiting' && '🌊'}
                    {status === 'bite' && '❗️'}
                    {status === 'success' && '🐟'}
                    {status === 'fail' && '💨'}
                </div>
            </div>

            {/* 提示文字 */}
            <div style={{textAlign:'center', color:'#fff', fontSize:'20px', fontWeight:'bold', textShadow:'0 2px 4px rgba(0,0,0,0.3)', minHeight:'60px'}}>
                {status === 'idle' && "点击按钮抛竿"}
                {status === 'waiting' && "耐心等待..."}
                {status === 'bite' && <span style={{color:'#FF5252', fontSize:'24px'}}>有鱼上钩！快收杆！</span>}
                {status === 'fail' && <div>{msg}<br/><button onClick={(e)=>{e.stopPropagation(); startFishing();}} style={{marginTop:'10px', padding:'8px 20px', borderRadius:'20px', border:'none', cursor:'pointer'}}>再试一次</button></div>}
                
                {status === 'success' && (
                    <div style={{animation:'popIn 0.5s'}}>
                        <div style={{fontSize:'16px', color:'#81D4FA'}}>🎉 钓到了！</div>
                        <div style={{background:'rgba(0,0,0,0.3)', padding:'15px', borderRadius:'12px', marginTop:'10px', display:'flex', alignItems:'center', gap:'15px'}}>
                            <div style={{fontSize:'40px'}}>{renderAvatar(fish)}</div>
                            <div style={{textAlign:'left'}}>
                                <div style={{fontSize:'18px', color:'#fff'}}>{fish.name}</div>
                                <div style={{fontSize:'14px', color:'#FFD700'}}>{weight} kg</div>
                            </div>
                        </div>
                        {/* 🔥 这里的 onClick 已经更新为调用新版 grantContestReward */}
                        <button onClick={(e) => { e.stopPropagation(); grantContestReward(CONTEST_CONFIG.fishing, parseFloat(weight), fish); }} 
                            style={{marginTop:'20px', padding:'12px 40px', borderRadius:'30px', border:'none', background:'linear-gradient(90deg, #FFC107, #FF9800)', color:'#fff', fontWeight:'bold', cursor:'pointer', fontSize:'16px', boxShadow:'0 4px 10px rgba(0,0,0,0.3)'}}>
                            提交成绩
                        </button>
                    </div>
                )}
            </div>

            {/* 操作按钮 */}
            {status === 'idle' && (
                <button onClick={(e)=>{e.stopPropagation(); castRod();}} style={{
                    marginTop:'40px', width:'80px', height:'80px', borderRadius:'50%', border:'4px solid #fff', 
                    background:'#FF9800', color:'#fff', fontWeight:'bold', fontSize:'14px', cursor:'pointer',
                    boxShadow:'0 10px 20px rgba(0,0,0,0.3)'
                }}>
                    抛竿
                </button>
            )}
        </div>
      </div>
    );
  };

  // 🔥 [美化] 选美大赛
  const renderBeautyContest = () => {
    const { pet } = activeContest;
    const { round, appeal, log } = beautyState;
    const isFinished = round > 5;
    
    return (
      <div className="screen" style={{background: '#263238', display:'flex', flexDirection:'column'}}>
        {/* 舞台背景 */}
        <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 50% 0%, #880E4F 0%, #263238 70%)'}}></div>
        {/* 聚光灯 */}
        <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'300px', height:'600px', background:'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 80%)', clipPath:'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', pointerEvents:'none'}}></div>

        <div className="nav-header glass-panel" style={{zIndex:10, background:'rgba(0,0,0,0.3)'}}>
            <button className="btn-back" onClick={() => setView('grid_map')}>退出</button>
            <div className="nav-title">🎀 华丽大赛</div>
        </div>

        <div style={{flex:1, padding:'20px', display:'flex', flexDirection:'column', alignItems:'center', zIndex:5, position:'relative'}}>
            {/* 魅力热度条 */}
            <div style={{width:'100%', maxWidth:'300px', background:'rgba(0,0,0,0.5)', height:'20px', borderRadius:'10px', overflow:'hidden', marginBottom:'20px', border:'1px solid #555'}}>
                <div style={{width:`${Math.min(100, appeal/2)}%`, height:'100%', background:'linear-gradient(90deg, #F48FB1, #E91E63)', transition:'width 0.5s'}}></div>
            </div>
            <div style={{color:'#F48FB1', fontWeight:'bold', fontSize:'18px', marginBottom:'10px'}}>💖 魅力值: {appeal}</div>

            {/* 精灵展示 */}
            <div style={{fontSize:'100px', animation:'bounce 2s infinite', filter:'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}}>
                {renderAvatar(pet)}
            </div>
            <div style={{color:'#fff', marginTop:'10px', fontSize:'14px', opacity:0.8}}>{isFinished ? "表演结束！" : `Round ${round} / 5`}</div>
            
            {/* 技能卡片区 */}
            {!isFinished ? (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', width:'100%', marginTop:'30px'}}>
                    {pet.moves.map((m, i) => (
                        <button key={i} onClick={() => performAppeal(m)} style={{
                            padding:'15px', borderRadius:'12px', border:'none', 
                            background: 'rgba(255,255,255,0.1)', backdropFilter:'blur(5px)',
                            color: TYPES[m.t]?.color || '#fff', borderLeft:`4px solid ${TYPES[m.t]?.color}`,
                            fontWeight:'bold', cursor:'pointer', textAlign:'left',
                            boxShadow:'0 4px 10px rgba(0,0,0,0.2)', transition:'0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                        onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                        >
                            <div style={{fontSize:'14px'}}>{m.name}</div>
                            <div style={{fontSize:'10px', color:'#aaa', marginTop:'4px'}}>展示 {TYPES[m.t]?.name} 魅力</div>
                        </button>
                    ))}
                </div>
            ) : (
                // 🔥 这里的 onClick 已经更新为调用新版 grantContestReward
                <button onClick={() => grantContestReward(CONTEST_CONFIG.beauty, appeal, pet)} 
                    style={{marginTop:'40px', padding:'15px 50px', borderRadius:'30px', border:'none', background:'linear-gradient(90deg, #E91E63, #C2185B)', color:'#fff', fontWeight:'bold', fontSize:'18px', cursor:'pointer', boxShadow:'0 0 20px #E91E63'}}>
                    查看结果
                </button>
            )}

            {/* 日志 */}
            <div style={{marginTop:'auto', width:'100%', height:'100px', overflowY:'auto', background:'rgba(0,0,0,0.5)', borderRadius:'10px', padding:'10px', fontSize:'11px', color:'#ccc'}}>
                {log.map((l, i) => <div key={i} style={{marginBottom:'4px'}}>{l}</div>)}
            </div>
        </div>
      </div>
    );
  };

  // 🔥 [新增] 通用活动结算界面
  const renderResultModal = () => {
    if (!resultData) return null;
    const { title, type, score, subjectPet, tierName, tierMsg, reward, rankIdx, isNewRecord } = resultData;

    let themeColor = '#4CAF50'; // 捕虫绿
    let unit = '分';
    if (type === 'contest_fishing') { themeColor = '#03A9F4'; unit = 'kg'; }
    else if (type === 'contest_beauty') { themeColor = '#E91E63'; unit = '分'; }

    const handleClose = () => {
        setResultData(null);
        setActiveContest(null);
        setView('grid_map');
        if (type === 'contest_fishing') setFishingState({ status: 'idle', timer: 0, target: null });
    };

    return (
      <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
      }}>
        <div style={{
            width: '380px', background: '#fff', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
            position: 'relative', animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            {/* 顶部光效 */}
            <div style={{height: '140px', background: `linear-gradient(135deg, ${themeColor}, #222)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
                <div style={{position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', animation: 'spin 10s linear infinite'}}></div>
                <div style={{fontSize: '80px', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))', animation: 'bounce 2s infinite'}}>
                    {rankIdx === 0 ? '🏆' : (rankIdx === 1 ? '🥈' : (rankIdx === 2 ? '🥉' : '🎗️'))}
                </div>
                <div style={{position: 'absolute', bottom: '10px', color: '#fff', fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>{title} 结算</div>
            </div>

            {/* 内容区 */}
            <div style={{padding: '20px', textAlign: 'center', marginTop: '-30px', position: 'relative', zIndex: 3}}>
                {/* 成绩卡片 */}
                <div style={{background: '#fff', borderRadius: '16px', padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '20px'}}>
                    <div style={{fontSize: '12px', color: '#999', marginBottom: '5px', textTransform: 'uppercase'}}>Final Score</div>
                    <div style={{fontSize: '36px', fontWeight: '900', color: themeColor, lineHeight: '1'}}>
                        {score}<span style={{fontSize: '16px', marginLeft: '2px'}}>{unit}</span>
                    </div>
                    {isNewRecord && <div style={{fontSize:'12px', color:'#FF9800', fontWeight:'bold', marginTop:'5px'}}>🎉 新纪录！</div>}
                    
                    {subjectPet && (
                        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                            <div style={{fontSize: '32px'}}>{renderAvatar(subjectPet)}</div>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontWeight: 'bold', fontSize: '14px'}}>{subjectPet.name}</div>
                                <div style={{fontSize: '10px', color: '#666', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block'}}>
                                    {subjectPet.isShiny ? '✨ 闪光加分' : '表现优异'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 评价与奖励 */}
                <div style={{marginBottom: '25px'}}>
                    <div style={{fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '5px'}}>{tierName}</div>
                    <div style={{fontSize: '13px', color: '#666', marginBottom: '15px'}}>{tierMsg}</div>
                    <div style={{background: `linear-gradient(90deg, ${themeColor}11, ${themeColor}33)`, border: `1px solid ${themeColor}44`, borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div style={{width: '50px', height: '50px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                            {reward.type === 'PET' ? renderAvatar(reward.pet) : reward.icon}
                        </div>
                        <div style={{textAlign: 'left', flex: 1}}>
                            <div style={{fontSize: '10px', color: themeColor, fontWeight: 'bold', textTransform: 'uppercase'}}>REWARD</div>
                            <div style={{fontSize: '14px', fontWeight: 'bold', color: '#333'}}>{reward.name}</div>
                        </div>
                        <div style={{fontSize: '20px'}}>🎁</div>
                    </div>
                </div>

                <button onClick={handleClose} style={{width: '100%', padding: '14px', borderRadius: '30px', border: 'none', background: themeColor, color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 8px 20px ${themeColor}66`, transition: 'transform 0.1s'}}>收入囊中</button>
            </div>
        </div>
      </div>
    );
  };

     // ==========================================
  // [修正] 购买逻辑 (支持所有物品通用购买)
  // ==========================================
  const buyItemPro = (id, price, type) => {
    const count = buyCounts[id] || 1;
    const totalCost = price * count;
    
    if (gold >= totalCost) {
      setGold(g => g - totalCost);
      
      let itemName = '';

      // --- 1. 购买精灵球 ---
      if (type === 'ball') {
         const ballType = id.split('_')[1]; // 例如 'ball_net' -> 'net'
         setInventory(i => ({
             ...i, 
             balls: {
                 ...i.balls, 
                 [ballType]: (i.balls[ballType] || 0) + count
             }
         }));
         itemName = BALLS[ballType].name;
      } 
      else if (type === 'tm') {
         if ((inventory.tms?.[id]||0) > 0) { alert('❌ 每本技能书只能购买一次！'); return; }
         setInventory(i => ({
             ...i, 
             tms: { ...i.tms, [id]: (i.tms[id] || 0) + 1 }
         }));
         const tm = TMS.find(t => t.id === id);
         itemName = tm ? tm.name : '技能书';
      }
        else if (type === 'stone') {
     setInventory(i => ({
         ...i, 
         stones: { ...i.stones, [id]: (i.stones[id] || 0) + count }
     }));
     const stone = EVO_STONES[id];
     itemName = stone ? stone.name : '进化石';
}
            // --- 2. 购买道具 (药品/增强剂/特殊) ---
      else if (type === 'item') {
         // ✅ 修复1：洗练药存入 misc
         if (id === 'rebirth_pill') {
            setInventory(i => ({
                ...i, 
                misc: { ...i.misc, rebirth_pill: (i.misc.rebirth_pill || 0) + count }
            }));
            itemName = MISC_ITEMS.rebirth_pill.name;
         }
         // ✅ 修复2：增强剂/糖果等 GROWTH_ITEMS 存入根目录 (renderBag misc tab 从根目录读)
         else if (GROWTH_ITEMS.some(g => g.id === id)) {
            setInventory(i => ({...i, [id]: (i[id] || 0) + count}));
            const growth = GROWTH_ITEMS.find(g => g.id === id);
            itemName = growth ? growth.name : '增强道具';
         } 
         // ✅ 修复3：普通药品存入 meds
         else {
            setInventory(i => ({
                ...i, 
                meds: { ...i.meds, [id]: (i.meds[id] || 0) + count }
            }));
            const med = MEDICINES[id];
            itemName = med ? med.name : '药品';
         }
      } 

      else if (type === 'acc') {
         const alreadyOwned = accessories.filter(a => a === id).length + party.reduce((s,p) => s + ((p.equips||[]).filter(e => e === id).length), 0);
         if (alreadyOwned > 0) { alert('❌ 每种饰品只能购买一个！'); return; }
         setAccessories(prev => [...prev, id]);
         const acc = ACCESSORY_DB.find(a => a.id === id);
         itemName = acc ? acc.name : '饰品';
      }
      // --- 4. 购买咒具 ---
      else if (type === 'cursed') {
         setInventory(i => ({
             ...i,
             cursed: { ...(i.cursed || {}), [id]: ((i.cursed || {})[id] || 0) + count }
         }));
         const cItem = CURSED_ITEMS[id];
         itemName = cItem ? cItem.name : '咒具';
      }
      
      setBuyCounts(prev => ({...prev, [id]: 1}));
      
      updateAchStat({ maxSinglePurchase: totalCost, totalGoldSpent: totalCost });
      alert(`✅ 购买成功！\n获得了 ${itemName} x${count}\n花费了 ${totalCost} 金币`);
    } else {
      alert("❌ 金币不足！无法购买。");
    }
  };


  const addLog = (msg) => setBattle(prev => prev ? ({...prev, logs: [msg, ...(prev.logs||[])].slice(0, 3)}) : prev);
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const forgetMove = (moveIndex) => {
    if (learningPetIdx === null || !pendingMove) return;
    const newParty = [...party];
    const p = newParty[learningPetIdx];
    if (moveIndex === -1) {
      alert(`${p.name} 放弃了学习 [${pendingMove.name}]。`);
    } else {
      const oldMoveName = p.moves[moveIndex].name;
      p.moves[moveIndex] = pendingMove;
      alert(`${p.name} 忘记了 [${oldMoveName}]，学会了 [${pendingMove.name}]!`);
    }
    p.pendingLearnMove = null; 
    setParty(newParty);
    setPendingMove(null);
    setLearningPetIdx(null);
    const stillHasPending = newParty.some(pet => pet.pendingLearnMove);
    if (stillHasPending) {
      setView('team'); 
    } else {
      setView('grid_map'); 
    }
  };

  const renderMoveForget = () => {
    const p = party[learningPetIdx];
    return (
      <div className="screen" style={{background: 'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 100}}>
        <div className="glass-panel" style={{width:'90%', maxWidth:'400px', padding:'20px', color:'#333'}}>
          <div style={{textAlign:'center', marginBottom:'20px'}}>
            <div style={{width:64, height:64, margin:'0 auto'}}>{renderAvatar(p)}</div>
            <h3 style={{margin:'10px 0'}}>{p.name} 想要学习新技能!</h3>
            <div style={{background:'#FFF9C4', padding:'10px', borderRadius:'8px', border:'2px solid #FBC02D', marginBottom:'15px'}}>
              <div style={{fontWeight:'900', fontSize:'18px'}}>{pendingMove.name}</div>
              <div style={{fontSize:'12px'}}>属性: {TYPES[pendingMove.t].name} / 威力: {pendingMove.p}</div>
            </div>
            <p style={{fontSize:'12px', color:'#666'}}>但技能已满4个，请选择一个遗忘：</p>
          </div>
          <div style={{display:'grid', gap:'10px'}}>
            {p.moves.map((m, i) => (
              <button key={i} onClick={() => forgetMove(i)} style={{padding:'12px', border:'1px solid #ddd', borderRadius:'8px', background:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
                <span style={{fontWeight:'bold'}}>{m.name}</span>
                <span style={{fontSize:'10px', color:'#999'}}>威力:{m.p}</span>
              </button>
            ))}
          </div>
          <div style={{marginTop:'20px', borderTop:'1px solid #eee', paddingTop:'15px'}}>
            <button onClick={() => forgetMove(-1)} style={{width:'100%', padding:'12px', background:'#FF5252', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'bold'}}>放弃学习 {pendingMove.name}</button>
          </div>
        </div>
      </div>
    );
  };

const renderNameInput = () => {
  const nameReady = tempName.trim().length > 0;
  const showStarters = nameReady && starterOptions.length > 0;

  return (
    <div className="screen" style={{
      background: 'radial-gradient(ellipse at 20% 50%, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      minHeight:'100vh', position:'relative', overflow:'auto', padding:'40px 16px 60px'
    }}>
      {/* 背景装饰粒子 */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position:'fixed', width: 4+Math.random()*6, height: 4+Math.random()*6,
          borderRadius:'50%', background:`rgba(${100+Math.random()*155},${150+Math.random()*100},255,${0.15+Math.random()*0.2})`,
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`float ${4+Math.random()*6}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`,
          pointerEvents:'none'
        }} />
      ))}

      {/* 顶部标题区 */}
      <div style={{textAlign:'center', marginBottom:'32px', animation:'popIn 0.6s ease-out', position:'relative', zIndex:1}}>
        <div style={{fontSize:'11px', letterSpacing:'6px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:'8px'}}>Legends RPG</div>
        <div style={{fontSize:'28px', fontWeight:'900', color:'#fff', textShadow:'0 4px 20px rgba(100,140,255,0.4)'}}>开启你的冒险</div>
      </div>

      {/* 名字输入卡片 */}
      <div style={{
        width:'100%', maxWidth:'420px', borderRadius:'24px', overflow:'hidden',
        background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
        animation:'popIn 0.5s ease-out 0.1s backwards', position:'relative', zIndex:1
      }}>
        {/* 博士头像 + 对话 */}
        <div style={{padding:'24px 24px 0', display:'flex', gap:'14px', alignItems:'flex-start'}}>
          <div style={{
            width:'52px', height:'52px', borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg,#667eea,#764ba2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 15px rgba(102,126,234,0.4)'
          }}>
            <img src={NPC_SPRITES.professor} alt="" style={{width:36, height:36, objectFit:'contain'}} />
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:'13px', fontWeight:'700', color:'rgba(255,255,255,0.9)', marginBottom:'4px'}}>大木博士</div>
            <div style={{fontSize:'12px', color:'rgba(255,255,255,0.55)', lineHeight:'1.6'}}>
              {showStarters ? `${tempName}，选择一只精灵作为你的初始伙伴吧！` : '欢迎来到精灵世界！请先告诉我你的名字。'}
            </div>
          </div>
        </div>

        {/* 名字输入区 */}
        <div style={{padding:'16px 24px 20px'}}>
          <div style={{
            display:'flex', alignItems:'center', gap:'10px',
            background:'rgba(255,255,255,0.08)', borderRadius:'16px',
            padding:'4px 4px 4px 16px',
            border: tempName.trim() ? '1.5px solid rgba(102,126,234,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
            transition:'border 0.3s, box-shadow 0.3s',
            boxShadow: tempName.trim() ? '0 0 20px rgba(102,126,234,0.15)' : 'none'
          }}>
            <span style={{fontSize:'16px', opacity:0.5}}>✏️</span>
            <input
              type="text" placeholder="输入你的名字..." value={tempName}
              onChange={e => setTempName(e.target.value)} maxLength={8}
              onKeyDown={e => { if (e.key === 'Enter' && tempName.trim() && starterOptions.length === 0) { setTrainerName(tempName); generateStarterOptions(); } }}
              style={{
                flex:1, padding:'12px 0', border:'none', background:'transparent',
                fontSize:'15px', fontWeight:'600', color:'#fff', outline:'none',
                letterSpacing:'1px'
              }}
            />
            {!showStarters && (
              <button onClick={() => {
                if (!tempName.trim()) { alert('名字不能为空！'); return; }
                setTrainerName(tempName); generateStarterOptions();
              }} style={{
                padding:'10px 20px', borderRadius:'12px', border:'none',
                background: nameReady ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'rgba(255,255,255,0.1)',
                color: nameReady ? '#fff' : 'rgba(255,255,255,0.3)',
                fontSize:'13px', fontWeight:'700', cursor: nameReady ? 'pointer' : 'default',
                transition:'all 0.3s', boxShadow: nameReady ? '0 4px 15px rgba(102,126,234,0.4)' : 'none',
                whiteSpace:'nowrap'
              }}>确认</button>
            )}
            {showStarters && (
              <div style={{padding:'8px 14px', borderRadius:'12px', background:'rgba(76,175,80,0.2)', border:'1px solid rgba(76,175,80,0.3)'}}>
                <span style={{fontSize:'12px', color:'#81C784', fontWeight:'600'}}>✓ {tempName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 精灵选择区 */}
      {showStarters && (
        <div style={{width:'100%', maxWidth:'900px', marginTop:'28px', animation:'popIn 0.6s ease-out', position:'relative', zIndex:1}}>
          <div style={{textAlign:'center', marginBottom:'20px'}}>
            <div style={{fontSize:'12px', letterSpacing:'4px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase'}}>Choose Your Partner</div>
            <div style={{fontSize:'20px', fontWeight:'800', color:'#fff', marginTop:'4px', textShadow:'0 2px 10px rgba(0,0,0,0.3)'}}>选择你的命运伙伴</div>
          </div>

          <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap', padding:'0 8px'}}>
            {starterOptions.map((p, i) => {
              const stats = getStats(p);
              const typeConfig = TYPES[p.type] || TYPES.NORMAL;
              const natureName = NATURE_DB[p.nature]?.name || '未知';
              const baseInfo = POKEDEX.find(d => d.id === p.id) || {};
              const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
              const diversity = (baseInfo.id % 5) * 2 - 4;
              const bstHp = baseInfo.hp || 60;
              const bstPAtk = Math.floor((baseInfo.atk || 50) * bias.p) + diversity;
              const bstPDef = Math.floor((baseInfo.def || 50) * bias.p);
              const bstSAtk = Math.floor((baseInfo.atk || 50) * bias.s) - diversity;
              const bstSDef = Math.floor((baseInfo.def || 50) * bias.s);
              const bstSpd = baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
              const bst = bstHp + bstPAtk + bstPDef + bstSAtk + bstSDef + bstSpd;

              return (
                <div key={i} style={{
                  width:'260px', borderRadius:'20px', overflow:'hidden', cursor:'pointer',
                  background:'rgba(255,255,255,0.05)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  boxShadow:'0 15px 40px rgba(0,0,0,0.25)',
                  transition:'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  animation:`popIn 0.5s ease-out ${0.15+i*0.12}s backwards`,
                  position:'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
                  e.currentTarget.style.boxShadow = `0 25px 60px ${typeConfig.color}40, 0 0 30px ${typeConfig.color}20`;
                  e.currentTarget.style.borderColor = `${typeConfig.color}60`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                onClick={() => confirmStarter(p)}
                >
                  {/* 顶部渐变 + 精灵形象 */}
                  <div style={{
                    height:'140px', position:'relative', overflow:'hidden',
                    background:`linear-gradient(135deg, ${typeConfig.color}cc, ${typeConfig.color}66)`
                  }}>
                    <div style={{
                      position:'absolute', inset:0,
                      background:'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.15) 0%, transparent 60%)'
                    }} />
                    <div style={{
                      position:'absolute', right:'-15px', top:'-15px', fontSize:'90px', fontWeight:'900',
                      color:'rgba(255,255,255,0.08)', transform:'rotate(-15deg)', pointerEvents:'none', lineHeight:1
                    }}>#{String(p.id).padStart(3,'0')}</div>
                    <div style={{
                      position:'absolute', bottom:'-5px', left:'50%', transform:'translateX(-50%)',
                      width:'90px', height:'90px', display:'flex', alignItems:'center', justifyContent:'center',
                      filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
                      animation:`float 3.5s ease-in-out infinite`, animationDelay:`${i*0.3}s`
                    }}>
                      {renderAvatar(p)}
                    </div>
                  </div>

                  {/* 信息区 */}
                  <div style={{padding:'16px'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                      <div style={{fontSize:'18px', fontWeight:'800', color:'#fff'}}>{p.name}</div>
                      <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:'600'}}>Lv.5</div>
                    </div>

                    <div style={{display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap'}}>
                      <span style={{
                        background:`${typeConfig.color}25`, color:typeConfig.color, padding:'3px 10px',
                        borderRadius:'8px', fontSize:'10px', fontWeight:'700', border:`1px solid ${typeConfig.color}40`
                      }}>{typeConfig.name}</span>
                      <span style={{
                        background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', padding:'3px 10px',
                        borderRadius:'8px', fontSize:'10px', fontWeight:'600'
                      }}>{natureName}</span>
                    </div>

                    {/* 六维属性 */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', marginBottom:'12px'}}>
                      {[
                        { l:'HP',  v:stats.maxHp,  c:'#66BB6A', max:400 },
                        { l:'速度', v:stats.spd,    c:'#FFA726', max:250 },
                        { l:'物攻', v:stats.p_atk,  c:'#EF5350', max:250 },
                        { l:'物防', v:stats.p_def,  c:'#42A5F5', max:250 },
                        { l:'特攻', v:stats.s_atk,  c:'#AB47BC', max:250 },
                        { l:'特防', v:stats.s_def,  c:'#5C6BC0', max:250 },
                      ].map((s, idx) => (
                        <div key={idx} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                          <span style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', fontWeight:'600', width:'26px'}}>{s.l}</span>
                          <div style={{flex:1, height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden'}}>
                            <div style={{
                              width:`${Math.min(100, s.v/s.max*100)}%`, height:'100%',
                              background:`linear-gradient(90deg, ${s.c}88, ${s.c})`, borderRadius:'2px',
                              transition:'width 0.8s ease-out', animationDelay:`${0.3+idx*0.1}s`
                            }} />
                          </div>
                          <span style={{fontSize:'11px', color:s.c, fontWeight:'800', width:'30px', textAlign:'right'}}>{s.v}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px',
                      padding:'6px 10px', borderRadius:'8px', background:'rgba(255,255,255,0.04)'}}>
                      <span style={{fontSize:'10px', color:'rgba(255,255,255,0.35)'}}>种族值总和</span>
                      <span style={{fontSize:'13px', fontWeight:'800', color:'rgba(255,255,255,0.8)'}}>{bst}</span>
                    </div>

                    <button style={{
                      width:'100%', padding:'11px', borderRadius:'12px', border:'none',
                      background:`linear-gradient(135deg, ${typeConfig.color}dd, ${typeConfig.color}99)`,
                      color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer',
                      boxShadow:`0 4px 15px ${typeConfig.color}40`,
                      transition:'all 0.2s', letterSpacing:'2px'
                    }}>就决定是你了！</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{textAlign:'center', marginTop:'24px'}}>
            <span style={{fontSize:'11px', color:'rgba(255,255,255,0.3)'}}>* 数值受性格与个体值影响 · 所见即所得</span>
          </div>
        </div>
      )}
    </div>
  );
};


  const renderStarterSelect = () => renderNameInput();

   // ==========================================
  // [优化版] 通用进化树逻辑 (显示清晰的中文条件)
  // ==========================================
  const getFamilyTree = (currentId) => {
    // 1. 向上追溯找到始祖 (Root)
    let rootId = currentId;
    let hasParent = true;
    const visited = new Set(); 

    while (hasParent) {
        if (visited.has(rootId)) break;
        visited.add(rootId);
        hasParent = false;

        // A. 检查等级/条件进化来源
        const levelParent = POKEDEX.find(p => p.evo === rootId);
        if (levelParent) {
            rootId = levelParent.id;
            hasParent = true;
            continue;
        }

        // B. 检查进化石来源
        const stoneParentId = Object.keys(STONE_EVO_RULES).find(baseId => {
            const targets = Object.values(STONE_EVO_RULES[baseId]);
            return targets.includes(rootId);
        });
        if (stoneParentId) {
            rootId = parseInt(stoneParentId);
            hasParent = true;
            continue;
        }
    }

    const rootPet = POKEDEX.find(p => p.id === rootId);
    if (!rootPet) return null;

    // 2. 向下查找子代 (生成显示文本)
    const getChildren = (parentId) => {
        let children = [];
        const parent = POKEDEX.find(p => p.id === parentId);
        if (!parent) return children;

        // A. 等级/特殊条件进化
        if (parent.evo) {
            const levelChild = POKEDEX.find(p => p.id === parent.evo);
            if (levelChild) {
                let methodText = `Lv.${parent.evoLvl}`;
                
                // 🔥 智能识别特殊条件，显示中文
                if (parent.evoCondition) {
                    const c = parent.evoCondition;
                    if (c.time === 'DAY') methodText = '☀️白天升级';
                    else if (c.time === 'NIGHT') methodText = '🌙夜晚升级';
                    else if (c.time === 'DUSK') methodText = '🌇黄昏升级';
                    else if (c.weather === 'RAIN') methodText = '🌧️雨天升级';
                    else if (c.intimacy) methodText = '❤️亲密升级';
                }

                children.push({ 
                    ...levelChild, 
                    method: methodText 
                });
            }
        }

        // B. 进化石分支
        const stoneRules = STONE_EVO_RULES[parentId];
        if (stoneRules) {
            Object.entries(stoneRules).forEach(([stoneKey, targetId]) => {
                const targetPet = POKEDEX.find(p => p.id === targetId);
                const stoneItem = EVO_STONES[stoneKey];
                if (targetPet) {
                    children.push({ 
                        ...targetPet, 
                        // 🔥 修改点：优先显示道具中文名，避免歧义
                        method: stoneItem ? stoneItem.name : '特殊道具' 
                    });
                }
            });
        }
        return children;
    };

    const stage1 = getChildren(rootId);
    let stage2 = [];
    stage1.forEach(child => {
        const grandChildren = getChildren(child.id);
        grandChildren.forEach(gc => stage2.push({ ...gc, parentId: child.id }));
    });

    return { root: rootPet, stage1, stage2 };
  };

  const renderPokedex = () => {
    const total = POKEDEX.length;
    const caughtCount = caughtDex.length;
    const progress = Math.floor((caughtCount / total) * 100);
    const filteredDex = POKEDEX.filter(p => {
      if (dexFilter === 'caught') return caughtDex.includes(p.id);
      if (dexFilter === 'missing') return !caughtDex.includes(p.id);
      return true;
    });

    const selectedPet = selectedDexId ? POKEDEX.find(p => p.id === selectedDexId) : null;

    const syncDexData = () => {
      if (confirm("确定要将图鉴重置为【当前持有的精灵】吗？\n(这将清除已放生精灵的记录)")) {
        const currentIds = new Set([...party.map(p=>p.id), ...box.map(p=>p.id)]);
        setCaughtDex(Array.from(currentIds));
        alert("✅ 图鉴数据已修复！");
      }
    };

    return (
      <div className="screen dex-screen">
        <div className="nav-header glass-panel">
          <button className="btn-back" onClick={() => setView(party.length > 0 ? getBackToMapView() : 'menu')}>🔙 返回</button>
          <div className="nav-title">精灵图鉴</div>
          <button className="btn-icon-only" onClick={syncDexData} style={{fontSize:'18px'}} title="修复图鉴数据">🔄</button>
        </div>
        
        <div className="dex-container">
          <div className="dex-dashboard">
            <div className="dex-progress-circle">
              <div className="dex-progress-inner"><div>{progress}%</div><div className="dex-progress-label">完成度</div></div>
            </div>
            <div className="dex-stats-text">
              <div className="dex-stats-title">收集进度</div>
              <div className="dex-stats-subtitle">已捕获: {caughtCount} / {total}</div>
            </div>
          </div>
          
          <div className="dex-filters">
            <div className={`filter-chip ${dexFilter==='all'?'active':''}`} onClick={()=>setDexFilter('all')}>全部</div>
            <div className={`filter-chip ${dexFilter==='caught'?'active':''}`} onClick={()=>setDexFilter('caught')}>已捕获</div>
            <div className={`filter-chip ${dexFilter==='missing'?'active':''}`} onClick={()=>setDexFilter('missing')}>未捕获</div>
          </div>
          
                    <div className="dex-grid-refined">
            {filteredDex.map(pet => {
              const isCaught = caughtDex.includes(pet.id);
              return (
                <div key={pet.id} className={`dex-item ${isCaught ? 'caught' : 'missing'}`} onClick={() => isCaught && setSelectedDexId(pet.id)}>
                  <div className="dex-item-id">#{String(pet.id).padStart(3, '0')}</div>
                  <div className="dex-item-icon">{renderAvatar(pet)}</div>
                  <div className="dex-item-name">{isCaught ? pet.name : '???'}</div>
                  {isCaught && <div className="dex-type-dot" style={{background: TYPES[pet.type]?.color || '#999'}}></div>}
                </div>
              );
            })}
          </div>
        </div>
               {/* 替换 renderPokedex 中原本的 selectedPet 模态框部分 */}
        {selectedPet && (
          <div className="dex-modal-overlay" onClick={() => setSelectedDexId(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}>
            {/* 🔥 核心修改：宽度改为 340px，增加圆角和阴影，去除 overflow:hidden 以允许头像突出 */}
            <div className="dex-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '340px', background: '#fff', borderRadius: '24px', overflow: 'visible', 
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', paddingBottom: '24px',
              maxHeight: '90vh', overflowY: 'auto'
            }}>
              
              {(() => {
                  // 1. 寻找最强精灵逻辑 (保持不变)
                  const allCaught = [...party, ...box].filter(p => p.id === selectedPet.id);
                  let bestPet = null;
                  let bestScore = -1;
                  let bestGrade = 'B';

                  if (allCaught.length > 0) {
                      allCaught.forEach(p => {
                          const { score, grade } = calculateGrade(p);
                          if (score > bestScore) {
                              bestScore = score;
                              bestPet = p;
                              bestGrade = grade;
                          }
                      });
                 } else {
                      bestPet = { ...selectedPet, level: 1, ivs: {}, nature: null };
                  }

                  const getGradeColor = (g) => {
                      if (g === 'S') return '#FFD700';
                      if (g === 'A') return '#FF4081';
                      if (g === 'B') return '#2196F3';
                      return '#9E9E9E';
                  };
                  const gradeColor = getGradeColor(bestGrade);

                  return (
                      <>
                        {/* 顶部背景 (渐变色) */}
                        <div style={{
                            width: '100%', height: '110px', flexShrink: 0,
                            background: 'linear-gradient(180deg, #E0C3FC 0%, #C2E9FB 100%)', 
                            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                            position: 'absolute', top: 0, left: 0, zIndex: 0
                        }}></div>

                        {/* 评级印章 (右上角) */}
                        {allCaught.length > 0 && (
                            <div style={{
                                position:'absolute', right:'20px', top:'20px', 
                                fontSize:'32px', fontWeight:'900', color: gradeColor,
                                border: `3px solid ${gradeColor}`, borderRadius:'50%', width:'50px', height:'50px',
                                display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(15deg)',
                                background:'#fff', zIndex: 10, boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
                            }}>
                                {bestGrade}
                            </div>
                        )}

                        {/* 头像 (悬浮设计) */}
                        <div style={{
                            width: '90px', height: '90px', background: '#fff', borderRadius: '50%', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '55px',
                            marginTop: '65px', zIndex: 1, position: 'relative',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '5px'
                        }}>
                            {renderAvatar(bestPet)}
                        </div>

                        {/* 基础信息 */}
                        <div style={{textAlign: 'center', marginTop: '10px', zIndex: 1, width: '100%', flexShrink: 0}}>
                            <div style={{color: '#999', fontSize: '13px', fontWeight: '600', letterSpacing: '1px'}}>
                            #{String(selectedPet.id).padStart(3, '0')}
                            </div>
                            <div style={{fontSize: '24px', fontWeight: '800', color: '#333', margin: '4px 0'}}>
                            {selectedPet.name}
                            </div>
                            <div style={{
                                display: 'inline-block', 
                                background: TYPES[selectedPet.type]?.color || '#7038F8', 
                                color: '#fff', padding: '4px 16px', borderRadius: '20px', 
                                fontSize: '12px', fontWeight: 'bold'
                            }}>
                                {TYPES[selectedPet.type]?.name}
                            </div>
                            {allCaught.length > 0 && (
                                <div style={{fontSize:'10px', color:'#666', marginTop:'5px'}}>
                                    展示的是你拥有的最强个体 (Lv.{bestPet.level})
                                </div>
                            )}
                        </div>

                        {/* 属性条 (紧凑版) */}
                        <div style={{width: '100%', padding: '20px 30px 10px'}}>
                            {(() => {
                                const currentStats = getStats(bestPet);
                                const growth = 1 + bestPet.level * 0.05;
                                
                                // 获取种族值逻辑 (简化版，直接用你代码里的逻辑)
                                const baseInfo = POKEDEX.find(p => p.id === bestPet.id) || POKEDEX[0];
                                const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                                const diversity = (baseInfo.id % 5) * 2 - 4;
                                const getBase = (k) => {
                                    if (k === 'hp') return baseInfo.hp || 60;
                                    if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
                                    const bAtk = baseInfo.atk || 50;
                                    const bDef = baseInfo.def || 50;
                                    if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
                                    if (k === 'p_def') return Math.floor(bDef * bias.p);
                                    if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
                                    if (k === 's_def') return Math.floor(bDef * bias.s);
                                    return 50;
                                };

                                const configs = [
                                    {k:'maxHp', n:'HP'}, {k:'p_atk', n:'物攻'}, {k:'p_def', n:'物防'},
                                    {k:'s_atk', n:'特攻'}, {k:'s_def', n:'特防'}, {k:'spd',   n:'速度'}
                                ];

                                return configs.map(cfg => {
                                    const key = cfg.k === 'maxHp' ? 'hp' : cfg.k;
                                    const currVal = currentStats[cfg.k];
                                    let maxStat = (getBase(key) + 31) * growth;
                                    if (key === 'hp') maxStat = maxStat * 2.5;
                                    
                                    const pct = Math.min(100, (currVal / maxStat) * 100);
                                    const color = pct >= 80 ? '#FFD700' : (pct >= 50 ? '#FF4081' : '#2196F3');

                                    return (
                                        <div key={cfg.k} style={{display: 'flex', alignItems: 'center', marginBottom: '10px', fontSize: '12px'}}>
                                            <div style={{width: '32px', color: '#666', fontWeight: '600', textAlign:'left'}}>{cfg.n}</div>
                                            <div style={{flex: 1, height: '8px', background: '#F0F0F0', borderRadius: '4px', margin: '0 10px', position:'relative', overflow:'hidden'}}>
                                                <div style={{width: `${pct}%`, background: color, height: '100%'}}></div>
                                            </div>
                                            <div style={{width: '40px', textAlign: 'right', fontWeight: 'bold', color: '#333'}}>{currVal}</div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                      </>
                  );
              })()}

              <div style={{fontSize:'10px', color:'#ccc', marginBottom:'10px'}}>
                 *金色部分代表因闪光/性格/个体值获得的突破属性
              </div>

              {/* 进化家族 (紧凑横向版) */}
              {(() => {
                  const family = getFamilyTree(selectedPet.id);
                  if (!family || (family.stage1.length === 0)) return null;

                  const EvoNode = ({ pet, method }) => {
                      const isCaught = caughtDex.includes(pet.id);
                      const isCurrent = pet.id === selectedPet.id;
                      return (
                          <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'0 5px'}}>
                              {method && <div style={{fontSize:'9px', color:'#aaa', marginBottom:'2px'}}>{method}</div>}
                              <div 
                                onClick={() => isCaught && setSelectedDexId(pet.id)}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: isCaught ? 'pointer' : 'default'
                                }}
                              >
                                 {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                              </div>
                          </div>
                      );
                  };

                  return (
                    <div style={{
                        width: '90%', padding: '15px 10px', 
                        background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                        marginTop:'5px'
                    }}>
                      <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                         <EvoNode pet={family.root} />
                         {family.stage1.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                         {family.stage2.length > 0 && (
                             <>
                                 <div style={{color:'#ccc', fontSize:'12px'}}>➔</div>
                                 <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                     {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                 </div>
                             </>
                         )}
                      </div>
                    </div>
                  );
              })()}

              {/* 底部关闭按钮 */}
              <button 
                onClick={() => setSelectedDexId(null)} 
                style={{
                  width: '85%', padding: '12px', background: '#F5F7FA', border: 'none', borderRadius: '12px',
                  fontSize: '14px', color: '#666', cursor: 'pointer', fontWeight: '600',
                  marginTop: 'auto', marginBottom: '5px', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#E4E7EB'}
                onMouseOut={(e) => e.target.style.background = '#F5F7FA'}
              >
                关闭
              </button>

            </div>
          </div>
        )}


      </div>
    );
  };

    // ==========================================
  // 5. [修复] 技能大全 (图4修复 - 按钮文字)
  // ==========================================
  const renderSkillDex = () => {
    const filteredSkills = allSkills.filter(s => {
      const matchType = skillFilter === 'ALL' || s.t === skillFilter || (skillFilter === 'STATUS' && s.category === 'status');
      const matchSearch = s.name.includes(skillSearchTerm);
      return matchType && matchSearch;
    });

    const getSkillCategory = (s) => {
      if (s.category === 'status') return '变化';
      if (s.p > 0 && s.t) return s.p >= 100 ? '物理/特殊' : '物理/特殊';
      return '变化';
    };
    const getPowerColor = (p) => {
      if (p >= 120) return '#FF1744';
      if (p >= 80) return '#FF9100';
      if (p >= 40) return '#FFD600';
      if (p > 0) return '#69F0AE';
      return '#616161';
    };
    const getPowerRank = (p) => {
      if (p >= 120) return 'S';
      if (p >= 80) return 'A';
      if (p >= 40) return 'B';
      if (p > 0) return 'C';
      return '-';
    };

    return (
      <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, #0a0a1a 0%, #111133 50%, #0a0a1a 100%)', color:'#fff', overflow:'hidden', display:'flex', flexDirection:'column'}}>
        {/* 顶栏 */}
        <div style={{padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)'}}>
          <button onClick={() => setView(party.length > 0 ? getBackToMapView() : 'menu')} style={{background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer', padding:'4px'}}>←</button>
          <div style={{fontSize:'18px', fontWeight:'800', letterSpacing:'2px', background:'linear-gradient(90deg, #60A5FA, #A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>技能大百科</div>
          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.3)'}}>{filteredSkills.length} 技能</div>
        </div>

        {/* 搜索与筛选 */}
        <div style={{padding:'12px 16px', flexShrink:0}}>
          <div style={{position:'relative', marginBottom:'10px'}}>
            <input type="text" placeholder="搜索技能名称..." value={skillSearchTerm} onChange={e => setSkillSearchTerm(e.target.value)}
              style={{width:'100%', padding:'10px 14px 10px 36px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
            <svg style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', opacity:0.3}} width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>
            <button onClick={()=>setSkillFilter('ALL')} style={{padding:'5px 12px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter==='ALL' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: skillFilter==='ALL' ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>全部</button>
            <button onClick={()=>setSkillFilter('STATUS')} style={{padding:'5px 12px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter==='STATUS' ? '#9C27B0' : 'rgba(255,255,255,0.06)', color: skillFilter==='STATUS' ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>变化</button>
            {Object.keys(TYPES).map(t => (
              <button key={t} onClick={()=>setSkillFilter(t)} style={{padding:'5px 10px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter===t ? TYPES[t].color : 'rgba(255,255,255,0.06)', color: skillFilter===t ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>{TYPES[t].name}</button>
            ))}
          </div>
        </div>

        {/* 技能列表 */}
        <div style={{flex:1, overflowY:'auto', padding:'0 16px 16px'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'10px'}}>
            {filteredSkills.map((skill, idx) => {
              const typeColor = TYPES[skill.t]?.color || '#666';
              const pwrColor = getPowerColor(skill.p);
              const pwrRank = getPowerRank(skill.p);
              return (
                <div key={idx} style={{
                  background:'rgba(255,255,255,0.03)', borderRadius:'14px', padding:'14px',
                  border:`1px solid ${typeColor}20`, position:'relative', overflow:'hidden',
                  transition:'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background=`${typeColor}10`; e.currentTarget.style.borderColor=`${typeColor}40`; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor=`${typeColor}20`; e.currentTarget.style.transform=''; }}
                >
                  {/* 左侧色条 */}
                  <div style={{position:'absolute', left:0, top:'12px', bottom:'12px', width:'3px', borderRadius:'0 3px 3px 0', background:typeColor}} />

                  {/* 威力等级标识 */}
                  {skill.p > 0 && <div style={{position:'absolute', top:'10px', right:'10px', width:'24px', height:'24px', borderRadius:'6px', background:`${pwrColor}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:pwrColor, border:`1px solid ${pwrColor}30`}}>{pwrRank}</div>}

                  <div style={{paddingLeft:'10px'}}>
                    {/* 名称行 */}
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                      <span style={{fontSize:'15px', fontWeight:'800', color:'#fff'}}>{skill.name}</span>
                      <span style={{fontSize:'9px', padding:'2px 8px', borderRadius:'8px', background:typeColor, color:'#fff', fontWeight:'600'}}>{TYPES[skill.t]?.name || '变化'}</span>
                    </div>

                    {/* 数据行 */}
                    <div style={{display:'flex', gap:'12px', fontSize:'11px', marginBottom: skill.desc ? '8px' : '0'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                        <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>威力</span>
                        <span style={{fontWeight:'800', color: skill.p > 0 ? pwrColor : 'rgba(255,255,255,0.25)', fontSize:'14px'}}>{skill.p > 0 ? skill.p : '-'}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                        <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>PP</span>
                        <span style={{fontWeight:'700', color:'#42A5F5'}}>{skill.pp}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                        <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>命中</span>
                        <span style={{fontWeight:'700', color:'#66BB6A'}}>{skill.acc || 100}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                        <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>分类</span>
                        <span style={{fontWeight:'600', color:'rgba(255,255,255,0.6)'}}>{getSkillCategory(skill)}</span>
                      </div>
                    </div>

                    {/* 描述 */}
                    {skill.desc && <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', lineHeight:'1.5', borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:'6px'}}>{skill.desc}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };


const titleSpriteUrls = React.useMemo(() => {
  const ids = [6, 9, 150, 384, 445, 249, 373, 282, 248, 376, 491, 493];
  return ids.map(id => `${getSpriteUrl({id, type:'NORMAL'})}`);
}, []);

// ============ 道具 CSS 图标渲染系统 ============
const renderBallCSS = (ballId, size = 40) => {
  const b = BALL_ICONS[ballId];
  if (!b) return null;
  const bh = Math.max(2, size * 0.08);
  const br = Math.max(6, size * 0.18);
  return (
    <div style={{width:size,height:size,position:'relative',borderRadius:'50%',overflow:'hidden',boxShadow:`0 2px 8px ${b.glow}, inset 0 1px 2px rgba(255,255,255,0.4)`,flexShrink:0}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:b.top}} />
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:b.bottom}} />
      {b.stripes && <><div style={{position:'absolute',top:'12%',left:'8%',right:'8%',height:3,background:'rgba(255,0,0,0.4)',borderRadius:2}} /><div style={{position:'absolute',top:'24%',left:'15%',right:'15%',height:2,background:'rgba(255,0,0,0.3)',borderRadius:2}} /></>}
      {b.bolt && <div style={{position:'absolute',top:'12%',left:'50%',transform:'translateX(-50%)',color:'#FFD600',fontSize:size*0.35,fontWeight:900,textShadow:'0 0 4px #FF6F00',lineHeight:1}}>⚡</div>}
      {b.cross && <div style={{position:'absolute',top:'15%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:size*0.32,fontWeight:900,lineHeight:1}}>+</div>}
      {b.letter && <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',color:'#E040FB',fontSize:size*0.3,fontWeight:900,textShadow:'0 0 6px rgba(224,64,251,0.6)',lineHeight:1}}>{b.letter}</div>}
      {b.mesh && <div style={{position:'absolute',top:0,left:0,right:0,height:'50%',background:'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)'}} />}
      <div style={{position:'absolute',top:'50%',left:0,right:0,height:bh,transform:'translateY(-50%)',background:b.band,zIndex:2}} />
      <div style={{position:'absolute',top:'50%',left:'50%',width:br,height:br,transform:'translate(-50%,-50%)',borderRadius:'50%',background:b.btn,border:`${Math.max(1,size*0.04)}px solid #555`,zIndex:3,boxShadow:'0 0 4px rgba(0,0,0,0.3)'}} />
      <div style={{position:'absolute',top:'4%',left:'15%',width:size*0.2,height:size*0.1,background:'rgba(255,255,255,0.5)',borderRadius:'50%',transform:'rotate(-30deg)'}} />
    </div>
  );
};

const renderMedCSS = (medId, size = 40) => {
  const m = MED_ICONS[medId];
  if (!m) return null;
  const s = size;
  const wrap = {width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0};
  const shineEl = m.shine ? <div style={{position:'absolute',top:'12%',right:'18%',width:4,height:4,background:'#fff',borderRadius:'50%',boxShadow:'0 0 6px #fff'}} /> : null;
  if (m.shape === 'bottle') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'8%',left:'35%',right:'35%',height:'14%',background:m.cap,borderRadius:'3px 3px 0 0'}} />
      <div style={{position:'absolute',top:'20%',left:'24%',right:'24%',height:'70%',background:`linear-gradient(135deg,${m.c},${m.c}dd)`,borderRadius:'4px 4px 8px 8px',boxShadow:`0 2px 8px ${m.c}40`,overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'35%',height:'100%',background:'rgba(255,255,255,0.2)',borderRadius:'4px 0 0 8px'}} />
        {shineEl}
      </div>
      <div style={{position:'absolute',bottom:'22%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.2,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.3)',lineHeight:1}}>{m.label}</div>
    </div>
  );
  if (m.shape === 'flask') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'6%',left:'38%',right:'38%',height:'16%',background:m.cap,borderRadius:'3px 3px 1px 1px'}} />
      <div style={{position:'absolute',top:'20%',left:'20%',right:'20%',height:'68%',background:`linear-gradient(135deg,${m.c},${m.c}cc)`,borderRadius:'30% 30% 50% 50%',boxShadow:`0 2px 8px ${m.c}40`,overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'30%',height:'100%',background:'rgba(255,255,255,0.2)'}} />
        {shineEl}
      </div>
      <div style={{position:'absolute',bottom:'24%',left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.19,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.3)',lineHeight:1}}>{m.label}</div>
    </div>
  );
  if (m.shape === 'tube') return (
    <div style={wrap}>
      <div style={{position:'absolute',top:'14%',left:'30%',right:'30%',height:'62%',background:'linear-gradient(180deg,#f5f5f5,#e0e0e0)',borderRadius:6,boxShadow:'0 1px 4px rgba(0,0,0,0.15)',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:'50%',background:m.c,opacity:0.7}} />
      </div>
      <div style={{position:'absolute',top:'10%',left:'50%',transform:'translateX(-50%)',width:8,height:8,background:m.accent,borderRadius:2}} />
      <div style={{position:'absolute',bottom:'20%',left:'50%',transform:'translateX(-50%)',color:m.accent,fontSize:s*0.28,fontWeight:900,lineHeight:1}}>{m.sym}</div>
    </div>
  );
  if (m.shape === 'crystal') return (
    <div style={wrap}>
      <div style={{width:s*0.6,height:s*0.7,background:`linear-gradient(135deg,${m.c},${m.accent})`,clipPath:'polygon(50% 0%,100% 35%,80% 100%,20% 100%,0% 35%)',boxShadow:`0 2px 10px ${m.c}60`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.3)'}} />
        {shineEl}
      </div>
    </div>
  );
  if (m.shape === 'diamond') return (
    <div style={wrap}>
      <div style={{width:s*0.55,height:s*0.55,background:`linear-gradient(135deg,${m.c},${m.accent})`,transform:'rotate(45deg)',borderRadius:4,boxShadow:`0 2px 10px ${m.c}50`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.3)'}} />
        {shineEl}
      </div>
    </div>
  );
  return null;
};

const renderStoneCSS = (stoneId, size = 40) => {
  const st = STONE_ICONS[stoneId];
  if (!st) return null;
  const s = size;
  const r = s * 0.14;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.72,height:s*0.72,background:`linear-gradient(135deg,${st.c1},${st.c2})`,borderRadius:r,transform:'rotate(12deg)',boxShadow:`0 2px 10px ${st.glow}60, inset 0 1px 2px rgba(255,255,255,0.4)`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'rgba(255,255,255,0.2)',borderRadius:`${r}px 0 0 ${r}px`}} />
        <div style={{position:'absolute',top:'8%',right:'12%',width:s*0.1,height:s*0.1,background:'rgba(255,255,255,0.6)',borderRadius:'50%'}} />
      </div>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#fff',fontSize:s*0.38,fontWeight:900,textShadow:`0 1px 3px rgba(0,0,0,0.3), 0 0 8px ${st.glow}80`,lineHeight:1}}>{st.sym}</div>
    </div>
  );
};

const renderAccCSS = (accId, size = 40) => {
  const a = ACC_ICONS[accId];
  if (!a) return null;
  const s = size;
  const clips = {
    star:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
    crown:'polygon(0% 100%,10% 35%,30% 60%,50% 15%,70% 60%,90% 35%,100% 100%)',
    shield:'polygon(50% 0%,100% 15%,95% 65%,50% 100%,5% 65%,0% 15%)',
    trophy:'polygon(15% 0%,85% 0%,95% 30%,70% 55%,72% 65%,60% 65%,60% 80%,75% 85%,75% 100%,25% 100%,25% 85%,40% 80%,40% 65%,28% 65%,30% 55%,5% 30%)',
    fang:'polygon(50% 0%,100% 30%,80% 100%,50% 85%,20% 100%,0% 30%)',
    round:'',
  };
  const clip = clips[a.shape] || '';
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.78,height:s*0.78,background:`linear-gradient(135deg,${a.c},${a.b})`,clipPath:clip||undefined,borderRadius:clip?undefined:'50%',boxShadow:`0 2px 8px ${a.c}40`,position:'relative'}} />
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#fff',fontSize:s*0.34,fontWeight:900,textShadow:'0 1px 2px rgba(0,0,0,0.4)',lineHeight:1}}>{a.sym}</div>
    </div>
  );
};

const renderGrowthCSS = (growthId, size = 40) => {
  const g = GROWTH_ICONS[growthId];
  if (!g) return null;
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.78,height:s*0.78,background:g.bg,borderRadius:s*0.18,border:`2px solid ${g.c}`,boxShadow:`0 2px 6px ${g.c}30`,position:'relative',overflow:'hidden'}}>
        {g.shine && <div style={{position:'absolute',top:'10%',right:'15%',width:5,height:5,background:'#fff',borderRadius:'50%',boxShadow:`0 0 6px ${g.c}`}} />}
      </div>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:g.c,fontSize:s*0.26,fontWeight:900,lineHeight:1}}>{g.sym}</div>
    </div>
  );
};

const renderTMCSS = (tmType, size = 40) => {
  const color = TM_ICON_COLORS[tmType] || '#78909C';
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.76,height:s*0.76,background:`radial-gradient(circle at 40% 40%,${color}cc,${color})`,borderRadius:'50%',boxShadow:`0 2px 8px ${color}50, inset 0 -2px 4px rgba(0,0,0,0.2)`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',width:s*0.28,height:s*0.28,transform:'translate(-50%,-50%)',background:'rgba(0,0,0,0.25)',borderRadius:'50%'}} />
        <div style={{position:'absolute',top:'50%',left:'50%',width:s*0.08,height:s*0.08,transform:'translate(-50%,-50%)',background:'#fff',borderRadius:'50%'}} />
        <div style={{position:'absolute',top:'6%',left:'22%',width:s*0.18,height:s*0.08,background:'rgba(255,255,255,0.4)',borderRadius:'50%',transform:'rotate(-25deg)'}} />
      </div>
      <div style={{position:'absolute',bottom:1,left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:s*0.16,fontWeight:800,background:color,padding:'0 3px',borderRadius:2,lineHeight:1.3}}>TM</div>
    </div>
  );
};

const renderMiscCSS = (size = 40) => {
  const s = size;
  return (
    <div style={{width:s,height:s,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <div style={{width:s*0.7,height:s*0.7,background:'linear-gradient(135deg,#FCE4EC,#fff)',borderRadius:'50%',border:'2px solid #E91E63',boxShadow:'0 2px 6px rgba(233,30,99,0.3)'}} />
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#E91E63',fontSize:s*0.38,fontWeight:900,lineHeight:1}}>⟳</div>
    </div>
  );
};

const renderItemIcon = (category, itemId, size = 36, tmType) => {
  if (category === 'ball') return renderBallCSS(itemId, size);
  if (category === 'med') return renderMedCSS(itemId, size);
  if (category === 'stone') return renderStoneCSS(itemId, size);
  if (category === 'acc') return renderAccCSS(itemId, size);
  if (category === 'growth') return renderGrowthCSS(itemId, size);
  if (category === 'tm') return renderTMCSS(tmType || 'NORMAL', size);
  if (category === 'misc') return renderMiscCSS(size);
  return null;
};

// 恶魔果实 CSS 图标渲染
const renderFruitCSSIcon = (fruitId, size = 44) => {
  const icon = getFruitIcon(fruitId);
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: icon.bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 2px 8px rgba(0,0,0,0.2)`, flexShrink: 0
    }}>
      {icon.pattern && <div style={{position:'absolute', inset:0, background:icon.pattern, borderRadius:'50%'}} />}
      <span style={{
        position:'relative', zIndex:1, fontWeight:'900',
        fontSize: `${Math.round(size * 0.42)}px`,
        color: icon.symbolColor, textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        lineHeight: 1
      }}>{icon.symbol}</span>
    </div>
  );
};

// ==========================================
// 恶魔果实图鉴
// ==========================================
const renderFruitDex = () => {
  const allFruits = getAllFruits();
  const categories = ['ALL', 'PARAMECIA', 'ZOAN', 'LOGIA'];
  const rarities = ['ALL', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON'];
  const catFilter = fruitDexCatFilter;
  const setCatFilter = setFruitDexCatFilter;
  const rarFilter = fruitDexRarFilter;
  const setRarFilter = setFruitDexRarFilter;
  const selectedFruit = fruitDexSelected;
  const setSelectedFruit = setFruitDexSelected;

  const filtered = allFruits.filter(f => {
    if (catFilter !== 'ALL' && f.category !== catFilter) return false;
    if (rarFilter !== 'ALL' && f.rarity !== rarFilter) return false;
    return true;
  });

  const ownedFruitIds = new Set(fruitInventory);
  party.forEach(p => { if (p.devilFruit) ownedFruitIds.add(p.devilFruit); });

  const catNames = { ALL: '全部', PARAMECIA: '超人系', ZOAN: '动物系', LOGIA: '自然系' };
  const catColors = { ALL: '#666', PARAMECIA: '#FF6F00', ZOAN: '#2E7D32', LOGIA: '#1565C0' };
  const rarNames = { ALL: '全部', LEGENDARY: '传说', EPIC: '史诗', RARE: '稀有', COMMON: '普通' };

  const buildEffectDesc = (tr) => {
    const parts = [];
    if (tr.atkMult) parts.push(`物攻×${tr.atkMult}`);
    if (tr.sAtkMult) parts.push(`特攻×${tr.sAtkMult}`);
    if (tr.defMult) parts.push(`物防×${tr.defMult}`);
    if (tr.sDefMult) parts.push(`特防×${tr.sDefMult}`);
    if (tr.spdMult) parts.push(`速度×${tr.spdMult}`);
    if (tr.hpMult) parts.push(`HP×${tr.hpMult}`);
    if (tr.movePowerBoost) parts.push(`技能威力+${(tr.movePowerBoost*100).toFixed(0)}%`);
    if (tr.critBoost) parts.push(`暴击+${tr.critBoost}级`);
    if (tr.evaBoost) parts.push(`闪避+${(tr.evaBoost*100).toFixed(0)}%`);
    if (tr.ignoreDefPercent) parts.push(`无视${(tr.ignoreDefPercent*100).toFixed(0)}%防御`);
    if (tr.fixedDmgPercent) parts.push(`附加${(tr.fixedDmgPercent*100).toFixed(0)}%固定伤`);
    if (tr.healPerTurn) parts.push(`每回合回${(tr.healPerTurn*100).toFixed(0)}%HP`);
    if (tr.selfDotPerTurn) parts.push(`每回合自损${(tr.selfDotPerTurn*100).toFixed(0)}%HP`);
    if (tr.dotPerTurn) parts.push(`敌方每回合损${(tr.dotPerTurn*100).toFixed(0)}%HP`);
    if (tr.typeImmune) parts.push(`免疫${TYPES[tr.typeImmune]?.name || tr.typeImmune}系`);
    if (tr.reflectPhysical) parts.push(`反弹${(tr.reflectPhysical*100).toFixed(0)}%物理伤`);
    if (tr.reflectAll) parts.push(`反弹${(tr.reflectAll*100).toFixed(0)}%所有伤`);
    if (tr.onHitBurn) parts.push(`${(tr.onHitBurn*100).toFixed(0)}%概率灼伤`);
    if (tr.onHitPoison) parts.push(`${(tr.onHitPoison*100).toFixed(0)}%概率中毒`);
    if (tr.onHitFreeze) parts.push(`${(tr.onHitFreeze*100).toFixed(0)}%概率冰冻`);
    if (tr.onHitConfuse) parts.push(`${(tr.onHitConfuse*100).toFixed(0)}%概率混乱`);
    if (tr.hpDrain) parts.push(`吸血${(tr.hpDrain*100).toFixed(0)}%`);
    if (tr.multiHit) parts.push(`${tr.multiHit}连击`);
    if (tr.enemySpdDown) parts.push(`每回合降速-${tr.enemySpdDown}级`);
    if (tr.enemyAtkDown) parts.push(`每回合降攻-${tr.enemyAtkDown}级`);
    if (tr.enemyAccDown) parts.push(`每回合降命中-${tr.enemyAccDown}级`);
    if (tr.cancelEnemyFruit) parts.push('取消敌方变身');
    if (tr.typeBoost) parts.push(`增伤:${Object.entries(tr.typeBoost).map(([k,v])=>`${TYPES[k]?.name||k}×${v}`).join(',')}`);
    if (tr.convertNormalTo) parts.push(`普通技→${TYPES[tr.convertNormalTo]?.name || tr.convertNormalTo}系`);
    return parts;
  };

  return (
    <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, #1a0a0a 0%, #2d0f0f 40%, #0f0a1a 100%)', color:'#fff', overflow:'hidden', display:'flex', flexDirection:'column'}}>
      {/* 头部 */}
      <div style={{padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0}}>
        <button onClick={() => setView(party.length > 0 ? getBackToMapView() : 'menu')} style={{background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer', padding:'4px'}}>←</button>
        <div>
          <div style={{fontSize:'18px', fontWeight:'800', letterSpacing:'1px'}}>恶魔果实图鉴</div>
          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'2px'}}>共 {allFruits.length} 种 · 已拥有 {ownedFruitIds.size} 种</div>
        </div>
      </div>

      {/* 筛选 */}
      <div style={{padding:'10px 16px', display:'flex', gap:'8px', flexShrink:0, flexWrap:'wrap'}}>
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding:'5px 12px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none',
            background: catFilter === c ? catColors[c] : 'rgba(255,255,255,0.06)',
            color: catFilter === c ? '#fff' : 'rgba(255,255,255,0.5)',
            transition:'all 0.2s'
          }}>{catNames[c]}</button>
        ))}
        <div style={{width:'1px', background:'rgba(255,255,255,0.1)', margin:'0 4px'}} />
        {rarities.map(r => (
          <button key={r} onClick={() => setRarFilter(r)} style={{
            padding:'5px 10px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none',
            background: rarFilter === r ? (FRUIT_RARITY_CONFIG[r]?.color || '#555') : 'rgba(255,255,255,0.06)',
            color: rarFilter === r ? '#fff' : 'rgba(255,255,255,0.5)',
            transition:'all 0.2s'
          }}>{rarNames[r]}</button>
        ))}
      </div>

      {/* 果实列表 */}
      <div style={{flex:1, overflowY:'auto', padding:'0 16px 16px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'10px'}}>
          {filtered.map(fruit => {
            const rc = FRUIT_RARITY_CONFIG[fruit.rarity];
            const owned = ownedFruitIds.has(fruit.id);
            const catC = catColors[fruit.category];
            return (
              <div key={fruit.id} onClick={() => setSelectedFruit(fruit)} style={{
                background: `linear-gradient(160deg, ${rc.color}18, rgba(0,0,0,0.3))`,
                border: `1px solid ${rc.color}${owned ? '60' : '25'}`,
                borderRadius:'14px', padding:'12px 10px', cursor:'pointer',
                transition:'all 0.25s', position:'relative', overflow:'hidden'
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 6px 20px ${rc.color}30`; }}
              onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
              >
                {owned && <div style={{position:'absolute', top:'6px', right:'6px', width:'8px', height:'8px', borderRadius:'50%', background:'#4CAF50', boxShadow:'0 0 6px #4CAF5080'}} />}
                <div style={{margin:'0 auto 8px'}}>
                  {renderFruitCSSIcon(fruit.id, 44)}
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'12px', fontWeight:'700', color:'#fff', marginBottom:'3px', lineHeight:'1.2'}}>{fruit.name}</div>
                  <div style={{display:'flex', gap:'4px', justifyContent:'center', flexWrap:'wrap'}}>
                    <span style={{fontSize:'9px', padding:'1px 6px', borderRadius:'8px', background:`${catC}30`, color:catC, fontWeight:'600'}}>
                      {FRUIT_CATEGORY_NAMES[fruit.category]}
                    </span>
                    <span style={{fontSize:'9px', padding:'1px 6px', borderRadius:'8px', background:`${rc.color}30`, color:rc.color, fontWeight:'600'}}>
                      {rc.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 果实详情弹窗 */}
      {selectedFruit && (() => {
        const f = selectedFruit;
        const rc = FRUIT_RARITY_CONFIG[f.rarity];
        const catC = catColors[f.category];
        const effects = buildEffectDesc(f.transform);
        const tm = f.transformMove;
        const owned = ownedFruitIds.has(f.id);
        return (
          <div onClick={() => setSelectedFruit(null)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width:'90%', maxWidth:'400px', maxHeight:'85vh', overflowY:'auto',
              background:'linear-gradient(170deg, #1e1e2e, #0f0f1f)', borderRadius:'20px',
              border:`1px solid ${rc.color}40`, boxShadow:`0 16px 48px rgba(0,0,0,0.5), 0 0 30px ${rc.color}15`,
              position:'relative'
            }}>
              {/* 顶部光晕 */}
              <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'200px', height:'80px', background:`radial-gradient(ellipse, ${rc.color}25, transparent)`, pointerEvents:'none'}} />

              <div style={{padding:'24px 20px 0', textAlign:'center', position:'relative'}}>
                {/* 果实图标 */}
                <div style={{margin:'0 auto 12px'}}>
                  {renderFruitCSSIcon(f.id, 72)}
                </div>
                <div style={{fontSize:'20px', fontWeight:'800', color:'#fff'}}>{f.name}</div>
                <div style={{display:'flex', gap:'6px', justifyContent:'center', margin:'8px 0 4px'}}>
                  <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:`${catC}25`, color:catC, fontWeight:'700'}}>
                    {FRUIT_CATEGORY_NAMES[f.category]}
                  </span>
                  <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:`${rc.color}25`, color:rc.color, fontWeight:'700'}}>
                    {rc.label}
                  </span>
                  {owned && <span style={{fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:'rgba(76,175,80,0.2)', color:'#4CAF50', fontWeight:'700'}}>已拥有</span>}
                </div>
                <div style={{fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'8px', lineHeight:'1.5'}}>{f.desc}</div>
              </div>

              {/* 变身信息 */}
              <div style={{padding:'16px 20px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>变身效果 · {f.duration}回合</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {effects.map((eff, i) => (
                    <span key={i} style={{
                      fontSize:'11px', padding:'4px 10px', borderRadius:'10px',
                      background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.8)',
                      border:'1px solid rgba(255,255,255,0.08)'
                    }}>{eff}</span>
                  ))}
                </div>
              </div>

              {/* 变身技能 */}
              <div style={{padding:'0 20px 16px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>变身技能</div>
                <div style={{
                  background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'12px',
                  border:'1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <span style={{fontSize:'14px', fontWeight:'700', color:'#fff'}}>{tm.name}</span>
                      <span style={{
                        marginLeft:'8px', fontSize:'9px', padding:'2px 8px', borderRadius:'8px',
                        background: TYPES[tm.t]?.color || '#666', color:'#fff', fontWeight:'600'
                      }}>{TYPES[tm.t]?.name || tm.t}</span>
                    </div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)'}}>PP:{tm.pp}</div>
                  </div>
                  <div style={{display:'flex', gap:'16px', marginTop:'6px', fontSize:'11px', color:'rgba(255,255,255,0.6)'}}>
                    <span>威力: <span style={{color:'#FF7043', fontWeight:'700'}}>{tm.p}</span></span>
                    <span>命中: <span style={{color:'#42A5F5', fontWeight:'700'}}>{tm.acc}</span></span>
                    {tm.effect && <span style={{color:'#AB47BC'}}>附加: {tm.effect.type === 'STATUS' ? tm.effect.status : `${tm.effect.stat}${tm.effect.val > 0 ? '-' : '+'}${Math.abs(tm.effect.val)}`}</span>}
                  </div>
                </div>
              </div>

              {/* 获取方式 */}
              <div style={{padding:'0 20px 20px'}}>
                <div style={{fontSize:'12px', fontWeight:'700', color:'rgba(255,255,255,0.5)', marginBottom:'8px', letterSpacing:'1px'}}>获取方式</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)', lineHeight:'1.6'}}>
                  <div>· 地图果实树随机采集</div>
                  <div>· 击败训练家/野生精灵掉落 (概率{(rc.dropRate*100).toFixed(1)}%)</div>
                  <div>· 特殊副本/活动奖励</div>
                </div>
              </div>

              <button onClick={() => setSelectedFruit(null)} style={{
                position:'absolute', top:'12px', right:'12px', background:'rgba(255,255,255,0.1)',
                border:'none', color:'#fff', width:'30px', height:'30px', borderRadius:'50%',
                fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'
              }}>×</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const renderMenu = () => {
  const resetGame = () => {
    if (confirm("⚠️ 警告：确定要删除所有存档并重新开始吗？")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  const titleSprites = titleSpriteUrls;

  return (
    <div className="screen" style={{
      display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
      background:'linear-gradient(165deg, #0f0c29 0%, #1a1a4e 30%, #24243e 60%, #0f0c29 100%)',
      position:'relative', overflow:'hidden'
    }}>
      {/* 动态星空背景 */}
      <div style={{position:'absolute', inset:0, background:'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.2), transparent), radial-gradient(1.5px 1.5px at 60% 20%, rgba(255,255,255,0.25), transparent), radial-gradient(1px 1px at 80% 50%, rgba(255,255,255,0.15), transparent), radial-gradient(2px 2px at 10% 80%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.3), transparent), radial-gradient(1.5px 1.5px at 90% 10%, rgba(255,255,255,0.2), transparent)', backgroundSize:'200% 200%', animation:'battle-bg-shift 30s ease infinite', opacity:0.8}} />

      {/* 光晕装饰 */}
      <div style={{position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter:'blur(60px)'}} />
      <div style={{position:'absolute', bottom:'-15%', right:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter:'blur(60px)'}} />
      <div style={{position:'absolute', top:'30%', right:'20%', width:'30%', height:'30%', borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter:'blur(50px)'}} />

      {/* 漂浮精灵剪影 */}
      {titleSprites.map((url, i) => (
        <div key={i} style={{
          position:'absolute',
          left: `${5 + (i % 6) * 16}%`,
          top: i < 6 ? `${8 + i * 5}%` : `${55 + (i-6) * 6}%`,
          width: `${40 + (i % 3) * 15}px`,
          height: `${40 + (i % 3) * 15}px`,
          opacity: 0.06 + (i % 3) * 0.02,
          animation: `float ${5 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          filter:'grayscale(1) brightness(2)',
          pointerEvents:'none'
        }}>
          <img src={url} alt="" style={{width:'100%', height:'100%', objectFit:'contain'}} onError={e => e.target.style.display='none'} />
        </div>
      ))}

      {/* 主卡片 */}
          <div style={{
        position:'relative', zIndex:10, width:'90%', maxWidth:'460px',
        background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)',
        border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:'28px', padding:'48px 40px 40px',
        boxShadow:'0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        animation:'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>

        {/* Logo */}
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={{
            fontSize:'13px', fontWeight:'600', letterSpacing:'6px', color:'rgba(255,255,255,0.35)',
            textTransform:'uppercase', marginBottom:'12px'
          }}>Legends RPG</div>
          <div style={{
            fontSize:'48px', fontWeight:'900', letterSpacing:'4px',
            background:'linear-gradient(135deg, #f8fafc 0%, #94a3b8 50%, #f8fafc 100%)',
            backgroundSize:'200% 200%', animation:'title-shimmer 4s ease infinite',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            fontFamily:'"Inter", "SF Pro Display", -apple-system, sans-serif',
            lineHeight:1.1
          }}>POKEMON</div>
          <div style={{
            width:'80px', height:'2px', margin:'16px auto 0',
            background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
          }} />
        </div>

        {/* 主按钮 - 开始游戏 */}
        <button onClick={handleStartGame} style={{
          width:'100%', padding:'18px 24px', borderRadius:'16px', border:'none',
          background:'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'14px',
          transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', position:'relative', overflow:'hidden'
        }}
        onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(99,102,241,0.4)'; }}
        onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.25)'; }}
        onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'}
        onMouseUp={e => e.currentTarget.style.transform='translateY(-2px)'}
        >
          <div style={{position:'absolute', inset:0, background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)', transform:'translateX(-100%)', animation:'btn-shine 3s ease infinite'}} />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
            <path d="M8 5v14l11-7z" fill="white"/>
          </svg>
          <div style={{textAlign:'left'}}>
            <div style={{fontSize:'16px', fontWeight:'700', color:'#fff', letterSpacing:'0.5px'}}>
                    {hasSave ? '继续冒险' : '开始新游戏'}
                </div>
            <div style={{fontSize:'11px', color:'rgba(255,255,255,0.7)', fontWeight:'400', marginTop:'2px'}}>
              {hasSave ? '读取上次的冒险进度' : '踏上全新的传说旅途'}
                </div>
            </div>
        </button>

        {/* 功能按钮组 - 2x2 网格 */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'20px'}}>
            {[
              { key:'pokedex', label:'精灵图鉴', sub:`${caughtDex.length}/${POKEDEX.length}`, color:'#f59e0b', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { key:'skill_dex', label:'技能大全', sub:`${allSkills.length}种`, color:'#3b82f6', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { key:'fruit_dex', label:'果实图鉴', sub:`${getAllFruits().length}种`, color:'#dc2626', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/><path d="M12 3C12 3 8 8 8 12s4 9 4 9" stroke="white" strokeWidth="1.5"/><path d="M12 3C12 3 16 8 16 12s-4 9-4 9" stroke="white" strokeWidth="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.5"/></svg> },
              { key:'achievements', label:'成就大厅', sub:`${unlockedAchs.length}/${ACHIEVEMENTS.length}`, color:'#a855f7', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { key:'guide', label:'游戏说明', sub:'新手必看', color:'#26a69a', wide:true, icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="17" r="0.5" fill="white" stroke="white" strokeWidth="1"/></svg> },
            ].map(btn => (
              <button key={btn.key} onClick={() => setView(btn.key)} style={{
                padding:'12px 14px', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.08)',
                background:'rgba(255,255,255,0.04)', color:'#fff', cursor:'pointer',
                display:'flex', alignItems:'center', gap:'12px',
                transition:'all 0.25s', backdropFilter:'blur(8px)',
                ...(btn.wide ? { gridColumn: '1 / -1', justifyContent:'center', textAlign:'center' } : { textAlign:'left' })
              }}
              onMouseOver={e => { e.currentTarget.style.background=`${btn.color}15`; e.currentTarget.style.borderColor=`${btn.color}40`; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.transform='none'; }}
              >
                <div style={{width:'36px', height:'36px', borderRadius:'10px', background:`linear-gradient(135deg, ${btn.color}, ${btn.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${btn.color}30`}}>
                  {btn.icon}
                </div>
                <div>
                  <div style={{fontSize:'13px', fontWeight:'700', lineHeight:1.2}}>{btn.label}</div>
                  <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', marginTop:'2px'}}>{btn.sub}</div>
                </div>
              </button>
            ))}
        </div>

        {/* 存档信息 */}
        {hasSave && (
          <div style={{
            marginTop:'16px', padding:'12px 16px', borderRadius:'12px',
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
            display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            <div style={{display:'flex', gap:'16px', fontSize:'11px', color:'rgba(255,255,255,0.4)'}}>
              <span>Lv.{party[0]?.level || '?'}</span>
              <span>{caughtDex.length} 图鉴</span>
              <span>{gold?.toLocaleString() || 0} G</span>
            </div>
            <div style={{fontSize:'10px', color:'rgba(255,255,255,0.25)'}}>
              {party.length} 只同行
            </div>
          </div>
        )}

        {/* 底部 */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'20px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <span style={{fontSize:'10px', color:'rgba(255,255,255,0.2)', letterSpacing:'1px'}}>v3.0 · {POKEDEX.length} Creatures</span>
          <span onClick={resetGame} style={{fontSize:'10px', color:'rgba(255,255,255,0.2)', cursor:'pointer', transition:'color 0.2s'}}
            onMouseOver={e => e.currentTarget.style.color='rgba(239,68,68,0.6)'}
            onMouseOut={e => e.currentTarget.style.color='rgba(255,255,255,0.2)'}
          >重置存档</span>
        </div>
      </div>
    </div>
  );
};

   // ==========================================
  // [修改] 渲染世界地图 (优化：天气下沉到卡片)
  // ==========================================
  const renderWorldMap = () => {
    // ... (原有的 enterDungeon 逻辑保持不变) ...
    // 副本冷却检查（每个副本3场战斗后需等5分钟冷却）
    const checkDungeonCooldown = (dungeonId) => {
      const cd = dungeonCooldowns[dungeonId];
      if (!cd) return true;
      if (cd.count >= 3) {
        const elapsed = Date.now() - cd.lastTime;
        if (elapsed < 5 * 60 * 1000) {
          const remaining = Math.ceil((5 * 60 * 1000 - elapsed) / 60000);
          alert(`⏰ 副本冷却中！\n已连续挑战3次，请等待 ${remaining} 分钟后再进入。\n（主线地图随时可以探索！）`);
          return false;
        }
        setDungeonCooldowns(prev => ({ ...prev, [dungeonId]: { count: 0, lastTime: Date.now() } }));
      }
      return true;
    };
    const recordDungeonEntry = (dungeonId) => {
      setDungeonCooldowns(prev => {
        const cd = prev[dungeonId] || { count: 0, lastTime: Date.now() };
        return { ...prev, [dungeonId]: { count: cd.count + 1, lastTime: Date.now() } };
      });
    };

    const enterDungeon = (dungeon) => {
      // --- 狩猎地带 (最高门槛, 最好奖励) ---
      if (dungeon.id === 'safari_zone') {
        if (party[0].level < 100) { alert("⛔ 权限不足！\n狩猎地带仅对顶尖训练家开放。\n要求：首发精灵等级达到 Lv.100"); return; }
        if (badges.length < 12) { alert(`⛔ 权限不足！\n你需要收集全部 12 枚徽章才能进入狩猎地带。\n当前进度: ${badges.length}/12`); return; }
        if (!checkDungeonCooldown('safari_zone')) return;
        recordDungeonEntry('safari_zone');
        alert("🎉 欢迎来到狩猎地带！\n这里充满了传说中的神兽和稀有精灵！");
        startBattle({ id: 997, name: '狩猎地带', lvl: [90, 100], pool: [], drop: 1000 }, 'safari');
        return;
      }

      // 基础门槛检查
      if (party[0].level < dungeon.recLvl) { alert(`⛔ 等级不足！\n需要首发精灵达到 Lv.${dungeon.recLvl}`); return; }

      // 徽章门槛（根据难度要求不同徽章数）
      const badgeReqs = { gold: 2, exp: 1, stone: 5, stat: 5, gold_pro: 6, shiny_hunt: 8, infinity: 8, hyakki: 6 };
      const reqBadges = badgeReqs[dungeon.type] || 0;
      if (badges.length < reqBadges) { alert(`⛔ 徽章不足！\n需要 ${reqBadges} 枚徽章。当前: ${badges.length}/${reqBadges}`); return; }

      // 特殊限制
      if (dungeon.restriction === 'min_lvl_60') { if (party.some(p => p.level < 60)) { alert("⛔ 队伍中所有精灵必须 ≥ Lv.60"); return; } }
      if (dungeon.restriction === 'solo_run') { if (party.length > 1) { alert("⛔ 英雄试炼只能携带 1 只精灵"); return; } }
      if (dungeon.restriction === 'entry_fee') {
        const fee = 5000 + badges.length * 500;
        if (gold < fee) { alert(`⛔ 金币不足 ${fee}`); return; }
        if (confirm(`支付 ${fee} 金币入场？`)) setGold(g => g - fee); else return;
      }
      if (dungeon.restriction === 'lucky_nature') { const lucky = ['naive', 'hasty', 'quirky', 'serious', 'hardy']; if (!lucky.includes(party[0].nature)) { alert("⛔ 首发精灵性格必须是幸运类(天真/急躁/浮躁/严肃/努力)"); return; } }

      // 冷却检查
      if (!checkDungeonCooldown(dungeon.id)) return;
      recordDungeonEntry(dungeon.id);

      // --- 黄金矿洞 (低门槛, 限每日5场, 适度奖励) ---
      if (dungeon.type === 'gold') {
        const goldCd = dungeonCooldowns['gold_rush'] || { count: 0, lastTime: 0 };
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        const isNewDay = goldCd.lastTime < todayStart.getTime();
        const dailyCount = isNewDay ? 0 : goldCd.count;
        if (dailyCount >= 5) { alert("⛔ 黄金矿洞今日次数已用完（每日上限5场）\n明天再来吧！"); return; }
        startBattle({ id: 999, name: '黄金矿洞', lvl: [30, 40], pool: [52], drop: 400 }, 'wild');
      }
      // --- 经验乐园 (等级与玩家匹配, 合理经验) ---
      else if (dungeon.type === 'exp') {
        const expLvlMin = Math.max(20, party[0].level - 5);
        const expLvlMax = Math.min(party[0].level + 5, 80);
        startBattle({ id: 998, name: '经验乐园', lvl: [expLvlMin, expLvlMax], pool: [113, 52, 125], drop: 100 }, 'wild');
      }
      // --- 元素之塔 (中门槛, 进化石) ---
      else if (dungeon.type === 'stone') {
        startBattle({ id: 996, name: '元素之塔', lvl: [55, 65], pool: [126, 127, 128, 129, 130, 196, 197], drop: 500 }, 'dungeon_stone');
      }
      // --- 英雄试炼 (单挑, 增强剂) ---
      else if (dungeon.type === 'stat') {
        startBattle({ id: 995, name: '英雄试炼', lvl: [60, 70], pool: [63, 106, 138, 183, 214, 270], drop: 500 }, 'dungeon_stat');
      }
      // --- 豪宅金库 (高门票, 高风险高回报, 但有冷却限制) ---
      else if (dungeon.type === 'gold_pro') {
        startBattle({ id: 994, name: '豪宅金库', lvl: [60, 75], pool: [118, 119, 364], drop: 8000 }, 'wild');
      }
      // --- 闪光山谷 (高门槛, 高闪光率) ---
      else if (dungeon.type === 'shiny_hunt') {
        startBattle({ id: 993, name: '闪光山谷', lvl: [80, 90], pool: [147, 148, 151, 244, 299], drop: 1000 }, 'dungeon_shiny');
      }
      // --- 无限城 (终局内容) ---
      else if (dungeon.type === 'infinity') { enterInfinityCastle(); }
      // --- 百鬼夜行 (多波连战) ---
      else if (dungeon.type === 'hyakki') {
        if (party[0].level < 80) { alert("⛔ 等级不足！\n百鬼夜行要求首发精灵 Lv.80 以上。"); return; }
        alert("👹 百鬼夜行开始！\n强大的咒灵将向你袭来！");
        startBattle({ id: 998, name: '百鬼夜行', lvl: [75, 90], pool: [92, 93, 94, 130, 144, 146], drop: 3000 }, 'wild');
      }
      // --- 连战Boss塔 ---
      else if (dungeon.type === 'boss_rush') {
        const bossPool = [65, 94, 130, 138, 140, 150, 182, 199, 206];
        const bossLvl = Math.max(40, Math.min(party[0].level + 5, 80));
        alert("🗼 连战Boss塔！\n连续击败3位强力Boss获取奖励！");
        startBattle({ id: 992, name: 'Boss塔 第1层', lvl: [bossLvl - 5, bossLvl], pool: bossPool, drop: 1500, bossRushWave: 1 }, 'boss_rush');
      }
      // --- 属性试炼场 ---
      else if (dungeon.type === 'type_challenge') {
        const types = ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'PSYCHIC', 'DARK', 'FIGHT', 'DRAGON'];
        const chosenType = _.sample(types);
        const typeNames = { FIRE:'火', WATER:'水', GRASS:'草', ELECTRIC:'电', PSYCHIC:'超能', DARK:'暗', FIGHT:'格斗', DRAGON:'龙' };
        const typePools = { FIRE:[11,12,13,14,15], WATER:[22,24,26,28,30], GRASS:[1,2,3,4,41], ELECTRIC:[34,85,87,88,89], PSYCHIC:[63,64,65,100,101], DARK:[54,55,56,59,90], FIGHT:[62,66,68,106,214], DRAGON:[182,183,196,208,447] };
        alert(`🎯 属性试炼场！\n今日指定属性: ${typeNames[chosenType]}系\n只有对应属性才能高效作战！`);
        startBattle({ id: 991, name: `${typeNames[chosenType]}系试炼`, lvl: [30, 50], pool: typePools[chosenType] || [1,2,3], drop: 1500, challengeType: chosenType }, 'type_challenge');
      }
      // --- 生存竞技场 ---
      else if (dungeon.type === 'survival') {
        const survLvl = Math.min(party[0].level + 10, 100);
        alert("🏟️ 生存竞技场！\n敌人将不断变强，坚持越久奖励越好！\n每击败一只，下一只等级+2！");
        startBattle({ id: 990, name: '生存竞技场', lvl: [survLvl - 10, survLvl], pool: [...HIGH_TIER_POOL], drop: 500, survivalWave: 1 }, 'survival');
      }
    };

    // --- 🔥 获取当前时间信息 ---
    const timeInfo = TIME_PHASES[timePhase];

    return (
      <div className="screen map-screen" style={{background:'linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)', minHeight:'100vh'}}>
        {/* 顶部导航 */}
        <div className="nav-header" style={{background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 1px 12px rgba(0,0,0,0.04)'}}>
          <button className="btn-back" onClick={() => setView(hasSave && party.length > 0 ? getBackToMapView() : 'menu')}>⬅ {hasSave && party.length > 0 ? '返回地图' : '返回'}</button>
          <div className="nav-title" style={{fontSize:'17px', fontWeight:'700', letterSpacing:'1px'}}>冒险地图</div>
          <div className="nav-coin" style={{background:'linear-gradient(135deg,#ffd54f,#ffb300)', color:'#5d4037', padding:'4px 12px', borderRadius:'20px', fontWeight:'bold', fontSize:'13px'}}>💰 {gold}</div>
        </div>
        
        {/* 顶部信息栏 */}
        <div style={{
            margin: '12px 20px 0', padding: '12px 22px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
            borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.6)'
        }}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:44, height:44, borderRadius:'14px', background:'linear-gradient(135deg,#667eea,#764ba2)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(102,126,234,0.3)'}}>
                    <span style={{fontSize:'22px'}}>{timeInfo.icon}</span>
                </div>
                <div>
                    <div style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1.5px'}}>World Time</div>
                    <div style={{fontSize:'16px', fontWeight:'700', color:'#1e293b'}}>{timeInfo.name}</div>
                </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <div style={{fontSize:'11px', color:'#64748b', fontStyle:'italic', textAlign:'right', maxWidth:'160px'}}>
                {timePhase === 'DAY' ? '阳光明媚，适合冒险' : (timePhase === 'DUSK' ? '天色渐晚，注意安全' : '深夜是幽灵活跃的时刻...')}
              </div>
              <div style={{background:'linear-gradient(135deg,#e2e8f0,#cbd5e1)', padding:'6px 14px', borderRadius:'12px', fontSize:'12px', fontWeight:'600', color:'#475569'}}>
                🏅 {badges.length} 徽章
              </div>
            </div>
        </div>

        {/* 导航胶囊 */}
        <div className="map-nav-container" style={{display:'flex', justifyContent:'center', margin:'16px 0 20px 0', position:'relative', zIndex:10}}>
          <div style={{background:'rgba(255,255,255,0.88)', backdropFilter:'blur(16px)', padding:'5px', borderRadius:'50px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid rgba(255,255,255,0.5)', display:'flex', gap:'4px'}}>
            {[
              { id: 'maps', icon: '🗺️', label: '区域探索', color: '#3b82f6' },
              { id: 'dungeons', icon: '⚔️', label: '特殊副本', color: '#8b5cf6' },
              { id: 'challenges', icon: '🔥', label: '挑战之路', color: '#ef4444' },
              { id: 'sects', icon: '🏔️', label: '门派顶峰', color: '#14b8a6' },
              { id: 'housing', icon: '🏡', label: '精灵家园', color: '#a78bfa' }
            ].map(tab => {
              const isActive = mapTab === tab.id || (tab.id === 'sects' && view === 'sect_summit');
              return (
                <div key={tab.id} onClick={() => { if (tab.id === 'sects') setView('sect_summit'); else if (tab.id === 'housing') setView('housing'); else { setMapTab(tab.id); if (view === 'sect_summit') setView('world_map'); } }}
                  style={{padding:'9px 20px', borderRadius:'40px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', transition:'all 0.3s cubic-bezier(.4,0,.2,1)',
                    background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}cc)` : 'transparent',
                    color: isActive ? '#fff' : '#64748b', fontWeight: isActive ? '700' : '500', fontSize:'13px',
                    boxShadow: isActive ? `0 4px 16px ${tab.color}44` : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)'}}>
                  <span style={{fontSize:'16px'}}>{tab.icon}</span><span>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 地图网格 */}
        <div className="map-grid-container" style={{display: mapTab==='maps'?'grid':'none', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px', padding:'0 20px 20px'}}>
          {MAPS.map((m, index) => {
            const isCleared = badges.includes(m.badge);
            const mapWeatherKey = mapWeathers[m.id] || 'CLEAR';
            const mapWeatherInfo = WEATHERS[mapWeatherKey];
            
            let isLocked = false;
            let lockReason = "";
            
            if (m.id === 99) {
                if (completedChallenges.includes('ECLIPSE_HQ_CLEARED')) {
                    return (
                        <div key={m.id} className="map-card-pro theme-bg-locked" style={{filter:'grayscale(1)', opacity:0.5, cursor:'not-allowed'}}>
                            <div className="map-lock-mask">
                                <div style={{fontSize:'32px', marginBottom:'6px'}}>🏚️</div>
                                <div style={{fontSize:'13px'}}>日蚀要塞 (已摧毁)</div>
                            </div>
                        </div>
                    );
                }
                if (badges.length < 8) { isLocked = true; lockReason = `需收集 8 枚徽章 (当前${badges.length}枚)`; }
            } else if (index > 0) {
              const prevMap = MAPS[index - 1];
              if (m.id === 9 && !completedChallenges.includes('ECLIPSE_HQ_CLEARED')) { isLocked = true; lockReason = "需摧毁【日蚀要塞】"; }
              else if (!badges.includes(prevMap.badge)) { isLocked = true; lockReason = `需通关【${prevMap.name}】`; }
            }

            const themeClass = isLocked ? 'theme-bg-locked' : `theme-bg-${m.type}`;

            return (
              <div key={m.id} className={`map-card-pro ${themeClass}`} onClick={() => { if (isLocked) alert(`🔒 该区域尚未解锁！\n\n${lockReason}`); else enterMap(m.id); }}>
                {isLocked && (
                  <div className="map-lock-mask">
                    <div style={{width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'8px', border:'2px solid rgba(255,255,255,0.2)'}}>
                      <span style={{fontSize:'22px'}}>🔒</span>
                    </div>
                    <div style={{fontSize:'12px', opacity:0.9}}>{lockReason}</div>
                  </div>
                )}
                
                {/* 顶部区域：名称 + 通关标识 */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                        <div style={{fontSize:'20px', fontWeight:'800', display:'flex', alignItems:'center', gap:'8px', textShadow:'0 2px 8px rgba(0,0,0,0.25)', letterSpacing:'0.5px'}}>
                            <span style={{fontSize:'24px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}>{m.icon}</span> {m.name}
                        </div>
                        <div style={{marginTop:'8px', display:'flex', gap:'6px', flexWrap:'wrap'}}>
                           <span style={{fontSize:'11px', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(4px)', padding:'3px 10px', borderRadius:'12px', color:'#fff', fontWeight:'600', border:'1px solid rgba(255,255,255,0.15)'}}>
                               Lv.{m.lvl[0]}-{m.lvl[1]}
                           </span>
                           {!isLocked && (
                               <span style={{fontSize:'11px', background: mapWeatherKey === 'CLEAR' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.3)',
                                   color:'#fff', padding:'3px 10px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'3px',
                                   border:'1px solid rgba(255,255,255,0.12)', fontWeight:'500', backdropFilter:'blur(4px)'}}>
                                   {mapWeatherInfo.icon} {mapWeatherInfo.name}
                               </span>
                           )}
                        </div>
                    </div>
                    {isCleared && (
                      <div style={{background:'rgba(255,255,255,0.95)', color:'#16a34a', padding:'4px 10px', borderRadius:'10px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                        ✓ CLEAR
                      </div>
                    )}
                </div>
                
                {/* 底部区域：馆主信息 */}
                <div style={{marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <span style={{width:26, height:26, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'13px', border:'1px solid rgba(255,255,255,0.15)'}}>👑</span>
                      <span style={{fontSize:'12px', fontWeight:'600', textShadow:'0 1px 4px rgba(0,0,0,0.2)'}}>馆主 · {m.gymName || '???'}</span>
                    </div>
                    {!isLocked && <span style={{fontSize:'11px', opacity:0.7, fontStyle:'italic'}}>Lv.{m.gymLvl}</span>}
                </div>

                {/* 装饰性背景图标 */}
                <div style={{position:'absolute', right:'-5px', bottom:'-10px', fontSize:'80px', opacity:0.08, pointerEvents:'none', transform:'rotate(-12deg)', zIndex:0}}>{m.icon}</div>
              </div>
            );
          })}
        </div>

        {/* --- 特殊副本列表 (重新设计) --- */}
        <div className="dungeon-list-v2" style={{display: mapTab==='dungeons'?'grid':'none', gridTemplateColumns:'repeat(auto-fill, minmax(420px, 1fr))', gap:'16px', padding:'4px'}}>
             {[...DUNGEONS, HYAKKI_DUNGEON, ...EXTRA_DUNGEONS].map(d => {
             const difficultyStars = '★'.repeat(d.stars || (d.recLvl >= 80 ? 5 : d.recLvl >= 60 ? 4 : d.recLvl >= 40 ? 3 : d.recLvl >= 20 ? 2 : 1));
             const tierLabel = d.rarity || (d.recLvl >= 80 ? '传说' : d.recLvl >= 60 ? '史诗' : d.recLvl >= 40 ? '精英' : '普通');
             const tierColor = tierLabel === '传说' ? '#FF6B35' : tierLabel === '史诗' ? '#9C27B0' : tierLabel === '稀有' ? '#2196F3' : '#4CAF50';

             return (
             <div key={d.id} className="dungeon-card-v2" onClick={() => enterDungeon(d)}
               style={{
                 position:'relative', overflow:'hidden', borderRadius:'20px', cursor:'pointer',
                 background:'#fff', boxShadow:'0 8px 30px rgba(0,0,0,0.08)',
                 transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                 border:'1px solid rgba(0,0,0,0.04)'
               }}
               onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${d.color}30`; }}
               onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.08)'; }}
             >
               {/* 顶部渐变横幅 */}
               <div style={{
                 background:`linear-gradient(135deg, ${d.color}, ${d.color}bb)`,
                 padding:'16px 20px 14px', position:'relative', overflow:'hidden'
               }}>
                 {/* 装饰光效 */}
                 <div style={{position:'absolute', top:'-30px', right:'-30px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.15)'}} />
                 <div style={{position:'absolute', bottom:'-20px', left:'30%', width:'60px', height:'60px', borderRadius:'50%', background:'rgba(255,255,255,0.08)'}} />
                 
                 <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1}}>
                   <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                     <div style={{
                       width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center',
                       fontSize:'24px', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(8px)',
                       boxShadow:'0 4px 12px rgba(0,0,0,0.1)'
                     }}>{d.icon}</div>
                     <div>
                       <div style={{fontSize:'17px', fontWeight:'800', color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,0.2)', letterSpacing:'0.5px'}}>{d.name}</div>
                       <div style={{fontSize:'12px', color:'rgba(255,255,255,0.85)', marginTop:'3px', lineHeight:'1.3'}}>{d.desc}</div>
               </div>
               </div>
                   <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px'}}>
                     <span style={{
                       fontSize:'10px', fontWeight:'700', color:'#fff', background:'rgba(0,0,0,0.2)',
                       padding:'3px 10px', borderRadius:'20px', letterSpacing:'1px'
                     }}>{tierLabel}</span>
                     <span style={{fontSize:'11px', color:'rgba(255,255,255,0.9)', letterSpacing:'2px'}}>{difficultyStars}</span>
                   </div>
                 </div>
               </div>
               
               {/* 内容区域 */}
               <div style={{padding:'14px 20px 16px'}}>
                 {/* 推荐等级 + 限制条件 */}
                 <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                   <span style={{
                     fontSize:'11px', fontWeight:'600', color:tierColor, background:`${tierColor}15`,
                     padding:'4px 10px', borderRadius:'8px', border:`1px solid ${tierColor}30`
                   }}>Lv.{d.recLvl}+</span>
                  {(() => {
                    const badgeReqs = { gold: 2, exp: 1, stone: 5, stat: 5, gold_pro: 6, shiny_hunt: 8, infinity: 8, hyakki: 6, catch: 12, boss_rush: 4, type_challenge: 3, survival: 7 };
                    const req = badgeReqs[d.type] || 0;
                    return req > 0 ? <span style={{fontSize:'10px', color: badges.length >= req ? '#4CAF50' : '#F44336', background: badges.length >= req ? '#E8F5E9' : '#FFF3F0', padding:'3px 8px', borderRadius:'6px', border: badges.length >= req ? '1px solid #C8E6C9' : '1px solid #FFCDD2'}}>🏅 {badges.length}/{req}徽章</span> : null;
                  })()}
                  {d.restriction && d.restriction !== 'none' && (
                    <span style={{
                      fontSize:'10px', color:'#F44336', background:'#FFF3F0',
                      padding:'3px 8px', borderRadius:'6px', border:'1px solid #FFCDD2'
                    }}>
                      {d.restriction === 'min_lvl_60' ? '🔒 全队Lv.60+' :
                       d.restriction === 'solo_run' ? '🎯 单挑模式' :
                       d.restriction === 'entry_fee' ? `💰 门票${5000 + badges.length * 500}G` :
                       d.restriction === 'lucky_nature' ? '🍀 需幸运性格' : ''}
                    </span>
                  )}
                  {d.isJJK && <span style={{fontSize:'10px', color:'#7B1FA2', background:'#F3E5F5', padding:'3px 8px', borderRadius:'6px', border:'1px solid #CE93D8'}}>🔮 咒术</span>}
                  {(() => {
                    const cd = dungeonCooldowns[d.id];
                    if (cd && cd.count >= 3) {
                      const elapsed = Date.now() - cd.lastTime;
                      if (elapsed < 5 * 60 * 1000) return <span style={{fontSize:'10px', color:'#FF9800', background:'#FFF8E1', padding:'3px 8px', borderRadius:'6px', border:'1px solid #FFE0B2'}}>⏰ 冷却中</span>;
                    }
                    return cd ? <span style={{fontSize:'10px', color:'#666', background:'#F5F5F5', padding:'3px 8px', borderRadius:'6px'}}>{cd.count}/3次</span> : null;
                  })()}
                 </div>
                 
                 {/* 奖励展示 */}
                 <div style={{display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap'}}>
                   <span style={{fontSize:'10px', color:'#aaa', fontWeight:'700', letterSpacing:'0.5px', marginRight:'4px'}}>奖励</span>
                   {d.rewards && d.rewards.map((r, idx) => (
                     <div key={idx} style={{
                       background:`linear-gradient(135deg, ${d.color}08, ${d.color}15)`,
                       padding:'5px 12px', borderRadius:'10px', fontSize:'11px',
                       color:'#555', border:`1px solid ${d.color}25`,
                       display:'flex', alignItems:'center', gap:'5px', fontWeight:'600'
                     }}>
                       <span style={{fontSize:'13px'}}>{r.icon}</span>
                       <span>{r.text}</span>
                     </div>
                   ))}
                 </div>
                 
                 {/* 进入按钮 */}
                 <button onClick={(e) => { e.stopPropagation(); enterDungeon(d); }} style={{
                   width:'100%', marginTop:'14px', padding:'11px', border:'none',
                   background:`linear-gradient(135deg, ${d.color}, ${d.color}cc)`,
                   color:'#fff', fontWeight:'700', cursor:'pointer', fontSize:'13px',
                   borderRadius:'12px', letterSpacing:'1px',
                   boxShadow:`0 4px 15px ${d.color}35`,
                   transition:'all 0.2s'
                 }}
                 onMouseOver={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow=`0 6px 20px ${d.color}50`; }}
                 onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 4px 15px ${d.color}35`; }}
                 >进入副本</button>
               </div>
             </div>
           )})}
        </div>

        {/* --- 挑战之路 (保持不变) --- */}
        <div className="challenge-grid-new" style={{display: mapTab==='challenges'?'grid':'none', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px'}}>
          {[...CHALLENGES, ...JJK_CHALLENGES].map(c => {
            const currentCaught = caughtDex.length;
            const isUnlocked = currentCaught >= c.req;
            const isCleared = completedChallenges.includes(c.id);
            const progressPct = Math.min(100, (currentCaught / c.req) * 100);
            const bossInfo = POKEDEX.find(p => p.id === c.boss);
            return (
              <div key={c.id} className="chal-card-pro hover-scale" style={{opacity: isUnlocked ? 1 : 0.8}}>
                <div className="chal-pro-header"><div style={{fontWeight:'bold', color: isUnlocked ? c.color : '#999', fontSize:'15px'}}>{c.isJJK && '🔮 '}{c.title}</div>{isCleared ? (<span style={{fontSize:'10px', background:'#4CAF50', color:'#fff', padding:'2px 8px', borderRadius:'10px'}}>✅ 已通关</span>) : (<span style={{fontSize:'10px', background: isUnlocked ? '#FF9800' : '#ddd', color:'#fff', padding:'2px 8px', borderRadius:'10px'}}>{isUnlocked ? '🔥 进行中' : '🔒 未解锁'}</span>)}</div>
                <div className="chal-pro-body"><div className="chal-boss-box" style={{borderColor: c.color}}>{bossInfo ? renderAvatar(bossInfo) : null}</div><div style={{flex:1}}><div style={{fontSize:'12px', color:'#666', marginBottom:'8px', lineHeight:'1.4'}}>{c.desc}</div><div style={{fontSize:'10px', display:'flex', justifyContent:'space-between', color:'#888', marginBottom:'2px'}}><span>解锁进度</span><span>{currentCaught}/{c.req}</span></div><div className="chal-progress-bar"><div className="chal-progress-fill" style={{width: `${progressPct}%`, background: isUnlocked ? c.color : '#ccc'}}></div></div></div></div>
                <button onClick={() => isUnlocked && startBattle(null, 'challenge', c.id)} disabled={!isUnlocked} style={{width:'100%', padding:'12px', border:'none', background: isUnlocked ? `linear-gradient(90deg, ${c.color}, ${c.color}dd)` : '#f0f0f0', color: isUnlocked ? '#fff' : '#aaa', fontWeight: 'bold', cursor: isUnlocked ? 'pointer' : 'not-allowed', marginTop: 'auto'}}>{isUnlocked ? (isCleared ? '再次挑战' : '开始挑战') : `需收集 ${c.req} 只精灵`}</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

   // ==========================================
  // [修复 & 美化] 左侧面板：用户信息与首发精灵
  // ==========================================
  const renderLeftPanel = () => {
    const leader = party[0];
    const stats = leader ? getStats(leader) : null;
    const hpPercent = leader ? (leader.currentHp / stats.maxHp) * 100 : 0;
    
    // 获取当前首发精灵的属性颜色 (如果没有则默认灰色)
    const typeColor = leader && TYPES[leader.type] ? TYPES[leader.type].color : '#9E9E9E';

    return (
      <div className="side-panel left-panel" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
         
         {/* 1. 训练家卡片 (已修复重复问题) */}
         <div className="panel-card" style={{
             textAlign:'center', padding:'20px 15px', background:'#fff', 
             borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'
         }}>
            {/* 头像区域 */}
            <div style={{position:'relative', width:'70px', height:'70px', margin:'0 auto 10px'}}>
                <div 
                    onClick={() => setShowAvatarSelector(true)}
                    style={{
                        width:'100%', height:'100%', cursor:'pointer', 
                        background:'#f8f9fa', borderRadius:'50%', 
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'40px', border:'3px solid #fff',
                        boxShadow:'0 4px 10px rgba(0,0,0,0.1)',
                        transition:'transform 0.2s, border-color 0.2s',
                        overflow:'hidden'
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#FF9800';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#fff';
                    }}
                    title="点击更换形象"
                >
                    {renderAvatarImg(trainerAvatar, 64)}
                </div>
                <div style={{
                    position:'absolute', bottom:'0', right:'0', 
                    background:'#FF9800', color:'#fff', borderRadius:'50%', 
                    width:'20px', height:'20px', fontSize:'12px', 
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:'2px solid #fff', pointerEvents:'none'
                }}>✏</div>
            </div>

            <div style={{fontWeight:'800', fontSize:'18px', color:'#333', marginBottom:'4px'}}>{trainerName || '训练家'}</div>
            <div style={{
                fontSize:'11px', background:'linear-gradient(90deg, #FF9800, #FF5722)', 
                color:'#fff', padding:'3px 10px', borderRadius:'12px', 
                display:'inline-block', fontWeight:'bold', boxShadow:'0 2px 5px rgba(255,87,34,0.3)'
            }}>
                {currentTitle || '新手上路'}
            </div>
        </div>

        {/* 2. 首发精灵卡片 */}
        {leader && (
            <div className="panel-card" style={{
                padding:'0', background:'#fff', borderRadius:'16px', 
                overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'
            }}>
                {/* 顶部属性条 */}
                <div style={{height:'8px', background: typeColor}}></div>
                
                <div style={{padding:'15px', textAlign:'center'}}>
                    <div style={{fontSize:'48px', filter:'drop-shadow(0 4px 4px rgba(0,0,0,0.1))', animation:'float 3s ease-in-out infinite'}}>
                        {renderAvatar(leader)}
                    </div>
                    <div style={{fontWeight:'bold', fontSize:'16px', marginTop:'5px', color:'#333'}}>
                        {leader.name}
                    </div>
                    <div style={{marginTop:'5px', marginBottom:'10px'}}>
                        <span style={{background:'#333', color:'#fff', fontSize:'10px', padding:'2px 6px', borderRadius:'4px'}}>
                            Lv.{leader.level}
                        </span>
                    </div>

                    {/* HP 条 */}
                    <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'10px', color:'#666', fontWeight:'bold'}}>
                        <span>HP</span>
                        <div style={{flex:1, height:'8px', background:'#eee', borderRadius:'4px', overflow:'hidden'}}>
                            <div style={{
                                width: `${hpPercent}%`, height:'100%', 
                                background: hpPercent > 50 ? '#4CAF50' : (hpPercent > 20 ? '#FF9800' : '#F44336'),
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                        <span>{Math.floor(leader.currentHp)}/{stats.maxHp}</span>
                    </div>
                </div>
            </div>
        )}

        {/* 3. 背包预览 */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:'12px', color:'#999', marginBottom:'10px', fontWeight:'bold', letterSpacing:'1px'}}>🎒 背包概览</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div style={{background:'#f9f9f9', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#555'}}>
                    <span>🔴</span> {inventory.balls.poke}
                </div>
                <div style={{background:'#f9f9f9', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#555'}}>
                    <span>💊</span> {inventory.meds.potion || 0}
                </div>
                <div style={{gridColumn:'span 2', background:'#FFF8E1', padding:'8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:'bold', color:'#F57C00'}}>
                    <span>💰</span> {gold.toLocaleString()}
                </div>
            </div>
        </div>

        {/* 4. 任务目标 */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
             <div style={{fontSize:'12px', color:'#999', marginBottom:'5px', fontWeight:'bold', letterSpacing:'1px'}}>🏆 当前目标</div>
             <div style={{fontSize:'14px', fontWeight:'bold', color:'#333', display:'flex', alignItems:'center', gap:'5px'}}>
                {badges.length < 12 ? (
                    <><span>收集徽章:</span> <span style={{color:'#2196F3'}}>{badges.length} / 12</span></>
                ) : (
                    <span style={{color:'#E91E63'}}>🔥 挑战冠军联盟！</span>
                )}
             </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // [升级版] 右侧面板：地图信息 + 生态扫描 + 日志
  // ==========================================
  const renderRightPanel = () => {
    const currentMap = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const theme = THEME_CONFIG[currentMap.type] || THEME_CONFIG.grass;
    
    // 获取当前地图的精灵分布 (使用 pool 字段)
    const encounters = currentMap.pool || [];
    const totalCount = encounters.length;
    const caughtCount = encounters.filter(id => caughtDex.includes(id)).length;
    const progressPercent = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

    return (
      <div className="side-panel right-panel" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
        
        {/* 1. 地图概况卡片 */}
        <div className="panel-card" style={{
            padding:'20px', background:'#fff', borderRadius:'16px', 
            boxShadow:'0 4px 12px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden',
            borderLeft: `5px solid ${theme.color || '#4CAF50'}`
        }}>
           {/* 背景装饰图标 */}
           <div style={{
               position:'absolute', top:'-10px', right:'-10px', fontSize:'80px', 
               opacity:0.05, pointerEvents:'none', transform:'rotate(-20deg)'
           }}>
               {currentMap.icon}
           </div>
           
           <div style={{position:'relative', zIndex:2}}>
               <div style={{fontSize:'12px', color: theme.color, fontWeight:'bold', letterSpacing:'1px', marginBottom:'5px', textTransform:'uppercase'}}>
                   Current Location
               </div>
               <div style={{fontSize:'22px', fontWeight:'800', color:'#333', display:'flex', alignItems:'center', gap:'8px'}}>
                   {currentMap.name}
               </div>
               <div style={{marginTop:'8px', display:'flex', gap:'8px'}}>
                   <span style={{fontSize:'11px', background:'#f0f2f5', color:'#666', padding:'4px 8px', borderRadius:'6px', fontWeight:'bold'}}>
                       建议 Lv.{currentMap.lvl[0]}-{currentMap.lvl[1]}
                   </span>
                   <span style={{fontSize:'11px', background: theme.bg, color:'#555', padding:'4px 8px', borderRadius:'6px', fontWeight:'bold', border:`1px solid ${theme.color}44`}}>
                       {theme.name || '野外区域'}
                   </span>
               </div>
           </div>
        </div>

        {/* 2. 📍 区域生态 (新增功能) */}
        <div className="panel-card" style={{padding:'15px', background:'#fff', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
            {/* 标题与进度 */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                <div style={{fontSize:'13px', color:'#333', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
                    <span>🔎</span> 区域生态
                </div>
                <div style={{fontSize:'11px', fontWeight:'bold', color: caughtCount===totalCount ? '#4CAF50' : '#666'}}>
                    {caughtCount} / {totalCount}
                </div>
            </div>
            
            {/* 进度条 */}
            <div style={{height:'4px', background:'#f0f0f0', borderRadius:'2px', marginBottom:'12px', overflow:'hidden'}}>
                <div style={{width:`${progressPercent}%`, background: theme.color || '#4CAF50', height:'100%', transition:'width 0.5s'}}></div>
            </div>

            {encounters.length === 0 ? (
                <div style={{textAlign:'center', padding:'10px', color:'#999', fontSize:'12px', fontStyle:'italic'}}>
                    这里似乎很安静...
                </div>
            ) : (
                <div style={{
                    display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(42px, 1fr))', gap:'8px'
                }}>
                    {encounters.map(pokeId => {
                        const poke = POKEDEX.find(p => p.id === pokeId);
                        if (!poke) return null;
                        const isCaught = caughtDex.includes(pokeId);
                        const typeColor = TYPES[poke.type]?.color || '#ccc';

                        return (
                            <div key={pokeId} 
                                title={isCaught ? `${poke.name} [${TYPES[poke.type]?.name}]` : "???"}
                                style={{
                                    aspectRatio:'1/1', borderRadius:'10px',
                                    background: isCaught ? '#fff' : '#f5f5f5',
                                    border: isCaught ? `1px solid ${typeColor}40` : '1px solid #eee',
                                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                                    position:'relative', cursor:'help', overflow:'hidden',
                                    transition:'transform 0.2s',
                                    boxShadow: isCaught ? `0 2px 5px ${typeColor}20` : 'none'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {/* 精灵图标 */}
                                <div style={{
                                    fontSize:'22px', 
                                    filter: isCaught ? 'none' : 'grayscale(100%) opacity(0.3) blur(0.5px)',
                                    transition: '0.3s',
                                    // 如果是未发现的，稍微缩小一点增加神秘感
                                    transform: isCaught ? 'scale(1)' : 'scale(0.8)'
                                }}>
                                    {renderAvatar(poke)}
                                </div>

                                {/* 已捕捉标记 (右上角小勾) */}
                                {isCaught && (
                                    <div style={{
                                        position:'absolute', top:'1px', right:'2px', 
                                        fontSize:'8px', color: typeColor
                                    }}>
                                        ✓
                                    </div>
                                )}
                                
                                {/* 底部属性条 (仅已捕捉显示) */}
                                {isCaught && (
                                    <div style={{
                                        position:'absolute', bottom:0, left:0, right:0, 
                                        height:'3px', background: typeColor
                                    }}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* 3. 探索日志 */}
        <div className="panel-card" style={{
            padding:'15px', background:'#fff', borderRadius:'16px', 
            boxShadow:'0 4px 12px rgba(0,0,0,0.05)', flex:1, display:'flex', flexDirection:'column', minHeight:'150px'
        }}>
          <div style={{fontSize:'12px', color:'#999', marginBottom:'10px', fontWeight:'bold', letterSpacing:'1px', display:'flex', justifyContent:'space-between'}}>
              <span>📜 探索日志</span>
              <span style={{fontSize:'10px', cursor:'pointer', color:'#2196F3'}} onClick={() => setGlobalLogs([])}>清空</span>
          </div>
          
          <div className="log-list-container" style={{
              flex:1, overflowY:'auto', maxHeight:'200px', 
              background:'#f8fafc', borderRadius:'8px', padding:'8px',
              border:'1px solid #edf2f7', fontSize:'11px', lineHeight:'1.6'
          }}>
            {globalLogs.length === 0 ? (
                <div style={{textAlign:'center', color:'#ccc', marginTop:'20px'}}>暂无日志</div>
            ) : (
                globalLogs.map((log, i) => (
                <div key={i} style={{marginBottom:'6px', borderBottom:'1px dashed #e2e8f0', paddingBottom:'4px', display:'flex'}}>
                    <span style={{color:'#94a3b8', marginRight:'6px', minWidth:'35px'}}>[{log.time}]</span>
                    <span style={{color:'#475569'}}>{log.msg}</span>
                </div>
                ))
            )}
          </div>
        </div>

        {/* 4. 图例说明 (精简版) */}
        <div className="panel-card" style={{padding:'12px', background:'#fff', borderRadius:'16px'}}>
          <div style={{display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'center'}}>
            <LegendItem icon={theme.obstacle} label="障碍" />
            <LegendItem icon={theme.water} label="水域" />
            <LegendItem icon="🎁" label="宝箱" />
            <LegendItem icon="🏥" label="中心" />
            <LegendItem icon="🏪" label="商店" />
          </div>
        </div>
      </div>
    );
  };

  // 辅助组件：图例小胶囊 (放在 RPG 组件内部或外部皆可)
  const LegendItem = ({icon, label}) => (
      <div style={{
          display:'flex', alignItems:'center', gap:'4px', 
          fontSize:'10px', color:'#666', background:'#f1f5f9', 
          padding:'3px 8px', borderRadius:'10px'
      }}>
          <span>{icon}</span> {label}
      </div>
  );
    // ==========================================
  // [完整版] 精灵详情弹窗 (含特性/魅力/亲密度)
  // ==========================================
  const renderPetDetailModal = () => {
    if (!viewStatPet) return null;

    // [新增] 魅力评级颜色映射
    const CHARM_RANK_COLORS = {
        '万人迷': '#FF4081', // S级 - 亮粉
        '人气王': '#FFD700', // A级 - 金色
        '可爱鬼': '#2196F3', // B级 - 蓝色
        '呆萌':   '#8BC34A', // C级 - 绿色
        '凶萌':   '#9E9E9E'  // D级 - 灰色
    };

    return (
        <div className="modal-overlay" onClick={() => setViewStatPet(null)} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="stat-modal-card" onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: '460px',
              maxHeight: '90vh', overflowY: 'auto',
              background: '#fff', borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            
            {/* 评级计算与头部 */}
            {(() => {
                const { grade, leftAvg, rightAvg } = calculateGrade(viewStatPet);
                const getGradeColor = (g) => {
                    if (g === 'S') return '#FFD700';
                    if (g === 'A') return '#FF4081';
                    if (g === 'B') return '#2196F3';
                    return '#9E9E9E';
                };
                const gradeColor = getGradeColor(grade);
                const getScoreColor = (sc) => {
                    if (sc >= 80) return '#FFD700';
                    if (sc >= 50) return '#FF4081';
                    if (sc >= 30) return '#2196F3';
                    return '#9E9E9E';
                };
                const getScoreLetter = (sc) => {
                    if (sc >= 80) return 'S';
                    if (sc >= 50) return 'A';
                    if (sc >= 30) return 'B';
                    return 'C';
                };

                return (
                <>
                {/* 1. 头部信息 */}
                <div style={{padding:'20px 20px 0', display:'flex', alignItems:'center', position:'relative'}}>
                    <div style={{
                        position:'absolute', right:'60px', top:'20px', 
                        fontSize:'40px', fontWeight:'900', color: gradeColor,
                        border: `4px solid ${gradeColor}`, borderRadius:'50%', width:'60px', height:'60px',
                        display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-15deg)',
                        opacity: 0.8, zIndex: 10, background: '#fff'
                    }}>
                        {grade}
                    </div>

                    <div style={{fontSize:'45px', borderRadius:'50%', width:'70px', height:'70px', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'15px', overflow:'hidden', padding:'5px', position:'relative',
                      background: viewStatPet.isFusedShiny ? 'linear-gradient(135deg, #F3E5F5, #CE93D8)' : viewStatPet.isShiny ? 'linear-gradient(135deg, #FFF8E1, #FFD54F)' : '#f5f5f5',
                      boxShadow: viewStatPet.isFusedShiny ? '0 0 12px rgba(213,0,249,0.4)' : viewStatPet.isShiny ? '0 0 12px rgba(255,215,0,0.4)' : 'none'
                    }}>
                        {renderAvatar(viewStatPet)}
                    </div>
                    <div>
                        <div style={{fontSize:'20px', fontWeight:'bold'}}>
                          {viewStatPet.name}
                          {viewStatPet.isFusedShiny ? (
                            <span style={{marginLeft:'6px', background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'10px', padding:'2px 8px', borderRadius:'8px', fontWeight:'bold', verticalAlign:'middle'}}>🧬 异色</span>
                          ) : viewStatPet.isShiny ? (
                            <span style={{marginLeft:'6px', background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'10px', padding:'2px 8px', borderRadius:'8px', fontWeight:'bold', verticalAlign:'middle'}}>✨ 闪光</span>
                          ) : null}
                        </div>
                        <div style={{display:'flex', gap:'6px', marginTop:'5px'}}>
                        <span style={{background: TYPES[viewStatPet.type]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            {TYPES[viewStatPet.type]?.name}
                        </span>
                        <span style={{background:'#333', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'10px'}}>
                            Lv.{viewStatPet.level}
                        </span>
                        
                        <span 
                            title={NATURE_DB[viewStatPet.nature||'docile'].desc}
                            onMouseEnter={() => setStatTooltip('header_nature')}
                            onMouseLeave={() => setStatTooltip(null)}
                            style={{
                                border:'1px solid #ddd', color:'#666', padding:'1px 6px', borderRadius:'4px', 
                                fontSize:'10px', cursor:'help', position:'relative', overflow: 'visible'
                            }}
                        >
                            {NATURE_DB[viewStatPet.nature||'docile'].name}
                            {statTooltip === 'header_nature' && (
                                <div style={{
                                    position: 'absolute', bottom: '125%', left: '50%', transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '6px 10px', borderRadius: '6px',
                                    fontSize: '11px', whiteSpace: 'nowrap', zIndex: 999, pointerEvents: 'none'
                                }}>
                                    {NATURE_DB[viewStatPet.nature||'docile'].desc}
                                </div>
                            )}
                        </span>
                        </div>
                    </div>
                    <button onClick={() => setViewStatPet(null)} style={{marginLeft:'auto', border:'none', background:'transparent', fontSize:'24px', color:'#999'}}>×</button>
                </div>

                {/* 2. 属性对比区域 */}
                <div style={{padding:'20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontSize:'12px', fontWeight:'bold', color:'#555'}}>
                        
                        {/* --- 左侧：当前能力 --- */}
                        <div 
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('current_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>当前能力</span>
                            <span style={{color: getScoreColor(leftAvg)}}>{getScoreLetter(leftAvg)}</span>
                            
                            {statTooltip === 'current_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', left: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '10px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#FFD700', marginBottom:'2px'}}>当前属性 / 理论极限</div>
                                    <div style={{color:'#ccc', lineHeight:'1.4'}}>反映该精灵在当前等级下的战斗力水平。</div>
                                </div>
                            )}
                        </div>

                        {/* --- 右侧：成长潜力 --- */}
                        <div 
                            style={{width:'48%', display:'flex', justifyContent:'space-between', cursor:'help', position: 'relative'}}
                            onMouseEnter={() => setStatTooltip('potential_stats')}
                            onMouseLeave={() => setStatTooltip(null)}
                        >
                            <span style={{borderBottom:'1px dashed #999'}}>成长潜力</span>
                            <span style={{color: getScoreColor(rightAvg)}}>{getScoreLetter(rightAvg)}</span>

                            {statTooltip === 'potential_stats' && (
                                <div style={{
                                    position: 'absolute', bottom: '110%', right: '-10px', width: '180px',
                                    background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
                                    color: '#fff', padding: '8px', borderRadius: '8px',
                                    fontSize: '10px', fontWeight: 'normal', zIndex: 100, pointerEvents: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #444'
                                }}>
                                    <div style={{color:'#00E676', marginBottom:'2px'}}>个体值 (IV) / 31</div>
                                    <div style={{color:'#ccc', lineHeight:'1.4'}}>反映精灵的先天基因优劣。</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        {(() => {
                        const currentStats = getStats(viewStatPet);
                        const nextLvlPet = { ...viewStatPet, level: viewStatPet.level + 1 };
                        const nextStats = getStats(nextLvlPet);
                        const baseInfo = POKEDEX.find(p => p.id === viewStatPet.id) || POKEDEX[0];
                        const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
                        const diversity = (baseInfo.id % 5) * 2 - 4;
                        const growth = 1 + viewStatPet.level * 0.05;

                        const getBase = (k) => {
                            if (k === 'hp') return baseInfo.hp || 60;
                            if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
                            const bAtk = baseInfo.atk || 50;
                            const bDef = baseInfo.def || 50;
                            if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
                            if (k === 'p_def') return Math.floor(bDef * bias.p);
                            if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
                            if (k === 's_def') return Math.floor(bDef * bias.s);
                            return 50;
                        };

                        const configs = [
                            {k:'maxHp', n:'HP'}, {k:'p_atk', n:'物攻'}, {k:'p_def', n:'物防'},
                            {k:'s_atk', n:'特攻'}, {k:'s_def', n:'特防'}, {k:'spd',   n:'速度'}
                        ];

                        return configs.map(cfg => {
                            const key = cfg.k === 'maxHp' ? 'hp' : cfg.k;
                            const currVal = currentStats[cfg.k];
                            let maxStat = (getBase(key) + 31) * growth;
                            if (key === 'hp') maxStat = maxStat * 2.5;
                            maxStat = Math.floor(maxStat * 1.2); 
                            
                            const leftPct = Math.min(100, (currVal / maxStat) * 100);
                            const growthVal = nextStats[cfg.k] - currentStats[cfg.k];
                            let baseGrowthFactor = (getBase(key) + 31) * 0.05; 
                            if (key === 'hp') baseGrowthFactor *= 2.5;
                            const maxGrowth = Math.ceil(baseGrowthFactor * 1.55); 
                            const rightPct = Math.min(100, (growthVal / maxGrowth) * 100);

                            const getBarColor = (pct) => {
                                if (pct >= 80) return '#FFD700';
                                if (pct >= 50) return '#FF4081';
                                if (pct >= 30) return '#2196F3';
                                return '#BDBDBD';
                            };

                            return (
                            <div key={cfg.k} style={{display:'flex', alignItems:'center', height:'28px', background:'#f9f9f9', borderRadius:'6px', padding:'0 8px'}}>
                                <div style={{flex:1, display:'flex', alignItems:'center', borderRight:'1px solid #eee', paddingRight:'8px'}}>
                                    <div style={{fontSize:'10px', color:'#666', width:'24px'}}>{cfg.n}</div>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${leftPct}%`, background: getBarColor(leftPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right'}}>{currVal}</div>
                                </div>
                                <div style={{flex:1, display:'flex', alignItems:'center', paddingLeft:'8px'}}>
                                    <div style={{flex:1, height:'6px', background:'#e0e0e0', borderRadius:'3px', overflow:'hidden', margin:'0 6px'}}>
                                        <div style={{width:`${rightPct}%`, background: getBarColor(rightPct), height:'100%'}}></div>
                                    </div>
                                    <div style={{fontSize:'11px', fontWeight:'bold', width:'32px', textAlign:'right', color: rightPct>=80 ? '#E65100' : '#666'}}>
                                        +{growthVal}
                                    </div>
                                </div>
                            </div>
                            );
                        });
                        })()}
                    </div>
                </div>
                </>
                );
            })()}

            {/* 🔥 [修复] 特性/魅力/亲密度 展示卡片 🔥 */}
            <div style={{margin:'0 20px 15px', background:'#fff', borderRadius:'12px', padding:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', justifyContent:'space-between', border:'1px solid #eee'}}>
                
                {/* 特性 */}
                <div style={{flex:1.2, borderRight:'1px solid #eee', paddingRight:'10px'}}>
                    <div style={{fontSize:'10px', color:'#999', marginBottom:'4px', fontWeight:'bold'}}>特性 (Trait)</div>
                    <div style={{fontSize:'13px', fontWeight:'bold', color:'#673AB7', display:'flex', alignItems:'center', gap:'5px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.name || '无'}
                    </div>
                    <div style={{fontSize:'10px', color:'#666', lineHeight:'1.3', marginTop:'2px'}}>
                        {TRAIT_DB[viewStatPet.trait]?.desc || '暂无特殊能力'}
                    </div>
                </div>

                {/* 魅力 & 亲密度 (修复：添加评级显示) */}
                <div style={{flex:0.8, paddingLeft:'15px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'8px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'10px', color:'#999'}}>魅力</span>
                        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                            {/* 🔥 新增：魅力评级标签 */}
                            <span style={{
                                fontSize:'9px', color:'#fff', 
                                background: CHARM_RANK_COLORS[viewStatPet.charmRank || '凶萌'] || '#999', 
                                padding:'1px 4px', borderRadius:'4px', fontWeight:'bold'
                            }}>
                                {viewStatPet.charmRank || '凶萌'}
                            </span>
                            <span style={{fontSize:'12px', fontWeight:'bold', color:'#E91E63', display:'flex', alignItems:'center', gap:'4px'}}>
                                💖 {viewStatPet.charm || 0}
                            </span>
                        </div>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'10px', color:'#999'}}>亲密</span>
                        <span style={{fontSize:'12px', fontWeight:'bold', color:'#F44336', display:'flex', alignItems:'center', gap:'4px'}}>
                            ❤️ {viewStatPet.intimacy || 0}
                        </span>
                    </div>
                    {(() => {
                        const bs = viewStatPet.customBaseStats || POKEDEX.find(pd => pd.id === viewStatPet.id) || {};
                        const g = getCurseGrade(bs, viewStatPet.curseTalent || 0);
                        return (
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span style={{fontSize:'10px', color:'#999'}}>咒级</span>
                                <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                    <span style={{fontSize:'9px', color:'#fff', background: g.color || '#999', padding:'1px 4px', borderRadius:'4px', fontWeight:'bold'}}>{g.name}</span>
                                    <span style={{fontSize:'10px', color:'#aaa'}}>天赋{viewStatPet.curseTalent || 0}</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* 3. 门派详情与升级卡片 */}
            {(() => {
                const sect = SECT_DB[viewStatPet.sectId || 1];
                const lv = viewStatPet.sectLevel || 1;
                const cost = getSectUpgradeCost(lv);
                const isMax = lv >= 10;
                const effectText = sect.effect ? sect.effect(lv) : sect.desc;
                const nextEffectText = (!isMax && sect.effect) ? sect.effect(lv+1) : '';

                const upgradeSect = () => {
                    if (gold < cost) { alert("金币不足！"); return; }
                    setGold(g => g - cost);
                    const newParty = [...party];
                    const idx = newParty.findIndex(p => p.uid === viewStatPet.uid);
                    if (idx !== -1) {
                        newParty[idx].sectLevel = lv + 1;
                        setParty(newParty);
                        setViewStatPet(newParty[idx]);
                        alert(`恭喜！${sect.name} 心法突破到了 第${lv+1}层！`);
                    }
                };

                return (
                    <div style={{margin:'0 20px 15px', background:`linear-gradient(135deg, ${sect.color}22, #fff)`, border:`1px solid ${sect.color}`, borderRadius:'12px', padding:'12px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <div style={{fontSize:'24px', background:'#fff', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
                                    {sect.emoji}
                                </div>
                                <div>
                                    <div style={{fontWeight:'bold', color: sect.color, fontSize:'14px'}}>{sect.name}</div>
                                    <div style={{fontSize:'10px', color:'#666'}}>当前境界: 第 {lv} 层</div>
                                </div>
                            </div>
                            {!isMax ? (
                                <button onClick={upgradeSect} style={{
                                    background: sect.color, color:'#fff', border:'none', padding:'6px 12px', borderRadius:'20px', 
                                    fontSize:'11px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                    修炼 (💰{cost})
                                </button>
                            ) : (
                                <span style={{fontSize:'12px', fontWeight:'bold', color:'#999', background:'#eee', padding:'4px 8px', borderRadius:'10px'}}>已圆满</span>
                            )}
                        </div>
                        <div style={{fontSize:'11px', color:'#555', background:'rgba(255,255,255,0.8)', padding:'8px', borderRadius:'6px', lineHeight:'1.4'}}>
                            <div style={{fontWeight:'bold', marginBottom:'2px'}}>【{sect.desc}】</div>
                            <div>当前效果: {effectText}</div>
                            {!isMax && <div style={{color: sect.color, marginTop:'2px'}}>下一层: {nextEffectText}</div>}
                        </div>
                    </div>
                );
            })()}

            {/* 3.5 恶魔果实 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const equippedFruit = viewStatPet.devilFruit ? getFruitById(viewStatPet.devilFruit) : null;
                const rarityConf = equippedFruit ? FRUIT_RARITY_CONFIG[equippedFruit.rarity] : null;
                return (
                  <div style={{
                    background: equippedFruit
                      ? `linear-gradient(135deg, ${rarityConf?.color || '#666'}15, #fff)`
                      : '#f9f9f9',
                    border: equippedFruit
                      ? `1.5px solid ${rarityConf?.color || '#ccc'}`
                      : '1.5px dashed #ddd',
                    borderRadius:'12px', padding:'12px'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: equippedFruit ? '8px' : '0'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        {equippedFruit
                          ? renderFruitCSSIcon(viewStatPet.devilFruit, 36)
                          : <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#f0f0f0', border:'2px dashed #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', color:'#bbb'}}>+</div>
                        }
                        <div>
                          <div style={{fontWeight:'bold', fontSize:'13px', color: equippedFruit ? rarityConf?.color : '#999'}}>
                            {equippedFruit ? equippedFruit.name : '未装备果实'}
                          </div>
                          {equippedFruit && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              [{FRUIT_CATEGORY_NAMES[equippedFruit.category]}] {FRUIT_RARITY_CONFIG[equippedFruit.rarity]?.label} · 持续{equippedFruit.duration}回合
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'6px'}}>
                        {equippedFruit && (
                          <button onClick={() => {
                            setFruitInventory(prev => [...prev, viewStatPet.devilFruit]);
                            const idx = party.findIndex(p => p.uid === viewStatPet.uid);
                            if (idx !== -1) {
                              const np = [...party]; np[idx] = {...np[idx], devilFruit: null}; setParty(np); setViewStatPet(np[idx]);
                            }
                          }} style={{
                            background:'rgba(0,0,0,0.05)', color:'#999', border:'1px solid #ddd',
                            padding:'5px 10px', borderRadius:'16px', fontSize:'11px', cursor:'pointer'
                          }}>卸下</button>
                        )}
                        <button onClick={() => {
                          if (fruitInventory.length === 0) { alert('背包中没有恶魔果实，通过战斗或活动获得吧！'); return; }
                          setFruitPickModal({ petUid: viewStatPet.uid });
                        }} style={{
                          background: equippedFruit ? '#fff' : 'linear-gradient(135deg, #D32F2F, #FF6F00)',
                          color: equippedFruit ? rarityConf?.color || '#666' : '#fff',
                          border: equippedFruit ? `1px solid ${rarityConf?.color || '#ddd'}` : 'none',
                          padding:'5px 14px', borderRadius:'16px', fontSize:'11px', fontWeight:'bold', cursor:'pointer',
                          boxShadow: equippedFruit ? 'none' : '0 2px 8px rgba(211,47,47,0.3)'
                        }}>
                          {equippedFruit ? '更换' : '装备果实'}
                        </button>
                      </div>
                    </div>
                    {equippedFruit && (
                      <div style={{fontSize:'11px', color:'#555', background:'rgba(255,255,255,0.8)', padding:'6px 8px', borderRadius:'6px', lineHeight:'1.4'}}>
                        {equippedFruit.desc}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 3.6 饰品装备 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const equips = viewStatPet.equips || [null, null];
                return (
                  <div style={{background:'#f9f9f9', border:'1.5px solid #e0e0e0', borderRadius:'12px', padding:'12px'}}>
                    <div style={{fontSize:'12px', fontWeight:'bold', color:'#555', marginBottom:'8px'}}>🛡️ 饰品 ({equips.filter(e => e).length}/2)</div>
                    <div style={{display:'flex', gap:'8px'}}>
                      {[0, 1].map(slotIdx => {
                        const accId = equips[slotIdx];
                        let acc = null;
                        if (typeof accId === 'string') acc = ACCESSORY_DB.find(a => a.id === accId);
                        else if (typeof accId === 'object' && accId) acc = accId;
                        const petIdx = party.findIndex(p => p.uid === viewStatPet.uid);
                        return (
                          <div key={slotIdx} style={{
                            flex:1, background: acc ? 'linear-gradient(135deg,#E8EAF6,#fff)' : '#f0f0f0',
                            border: acc ? '1.5px solid #5C6BC0' : '1.5px dashed #ccc',
                            borderRadius:'10px', padding:'10px', display:'flex', alignItems:'center', gap:'8px',
                            cursor:'pointer', transition:'all 0.2s'
                          }} onClick={() => { if (petIdx >= 0) openEquipModal(petIdx, slotIdx); }}>
                            <span style={{fontSize:'22px'}}>{acc ? (acc.icon || '🛡️') : '➕'}</span>
                            <div style={{flex:1, minWidth:0}}>
                              <div style={{fontSize:'11px', fontWeight:'bold', color: acc ? '#333' : '#aaa', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                {acc ? acc.name : '空槽位'}
                              </div>
                              {acc && <div style={{fontSize:'9px', color:'#888'}}>{acc.desc || ''}</div>}
                            </div>
                            {acc && petIdx >= 0 && (
                              <button onClick={(ev) => {
                                ev.stopPropagation();
                                const np = [...party]; const pet2 = np[petIdx];
                                if (pet2.equips && pet2.equips[slotIdx]) {
                                  setAccessories(prev => [...prev, pet2.equips[slotIdx]]);
                                  pet2.equips[slotIdx] = null;
                                  setParty(np); setViewStatPet({...pet2});
                                }
                              }} style={{
                                background:'rgba(0,0,0,0.05)', color:'#999', border:'1px solid #ddd',
                                padding:'2px 8px', borderRadius:'12px', fontSize:'10px', cursor:'pointer', flexShrink:0
                              }}>卸</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 3.7 搭档羁绊 */}
            <div style={{margin:'0 20px 15px'}}>
              {(() => {
                const partnerPet = [...party, ...box].find(p => (p.uid || p.id) === viewStatPet.partnerId);
                const bl = partnerPet ? getBondLevel(viewStatPet.bondPoints || 0) : null;
                const nextBl = BOND_LEVELS.find(b => (viewStatPet.bondPoints || 0) < b.threshold);
                return (
                  <div style={{
                    background: partnerPet ? 'linear-gradient(135deg, #FCE4EC, #fff)' : '#f9f9f9',
                    border: partnerPet ? '1.5px solid #E91E63' : '1.5px dashed #ddd',
                    borderRadius:'12px', padding:'12px'
                  }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <div style={{width:'36px', height:'36px', borderRadius:'50%', background: partnerPet ? 'linear-gradient(135deg,#E91E63,#FF6090)' : '#f0f0f0', border: partnerPet ? 'none' : '2px dashed #ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color: partnerPet ? '#fff' : '#bbb'}}>
                          {partnerPet ? '🤝' : '+'}
                        </div>
                        <div>
                          <div style={{fontWeight:'bold', fontSize:'13px', color: partnerPet ? '#C2185B' : '#999'}}>
                            {partnerPet ? `搭档: ${partnerPet.name}` : '未设置搭档'}
                          </div>
                          {partnerPet && bl && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              羁绊 Lv{bl.tier} ({bl.name}) · {viewStatPet.bondPoints || 0}点
                              {nextBl && ` (下级: ${nextBl.threshold}点)`}
                            </div>
                          )}
                          {partnerPet && !bl && (
                            <div style={{fontSize:'10px', color:'#888'}}>
                              羁绊 {viewStatPet.bondPoints || 0}/{BOND_LEVELS[0].threshold}点
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'6px'}}>
                        {partnerPet && (
                          <button onClick={() => { removePartner(viewStatPet); setViewStatPet(prev => ({...prev, partnerId: null, bondPoints: 0})); }} style={{
                            background:'rgba(0,0,0,0.05)', color:'#999', border:'1px solid #ddd',
                            padding:'5px 10px', borderRadius:'16px', fontSize:'11px', cursor:'pointer'
                          }}>解除</button>
                        )}
                        <button onClick={() => { if (!isPartnerSystemUnlocked()) { alert('🔒 搭档羁绊系统尚未解锁！\n\n完成【莉可莉丝篇·第壹章】后解锁。'); return; } setPartnerModal(true); }} style={{
                          background: !isPartnerSystemUnlocked() ? '#ccc' : (partnerPet ? '#fff' : 'linear-gradient(135deg, #E91E63, #FF6090)'),
                          color: !isPartnerSystemUnlocked() ? '#999' : (partnerPet ? '#E91E63' : '#fff'),
                          border: partnerPet ? '1px solid #E91E63' : 'none',
                          padding:'5px 14px', borderRadius:'16px', fontSize:'11px', fontWeight:'bold', cursor:'pointer',
                          boxShadow: partnerPet ? 'none' : '0 2px 8px rgba(233,30,99,0.3)'
                        }}>
                          {!isPartnerSystemUnlocked() ? '🔒 未解锁' : (partnerPet ? '更换' : '设置搭档')}
                        </button>
                      </div>
                    </div>
                    {partnerPet && bl && (
                      <div style={{marginTop:'8px'}}>
                        <div style={{height:'4px', background:'#f0f0f0', borderRadius:'2px', overflow:'hidden'}}>
                          <div style={{height:'100%', width: `${Math.min(100, ((viewStatPet.bondPoints || 0) / (nextBl?.threshold || 300)) * 100)}%`, background:'linear-gradient(90deg,#E91E63,#FF6090)', borderRadius:'2px', transition:'width 0.3s'}} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 搭档选择弹窗 */}
            {partnerModal && (
              <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => setPartnerModal(false)}>
                <div style={{background:'#fff', borderRadius:'16px', padding:'20px', maxWidth:'400px', width:'90%', maxHeight:'70vh', overflow:'auto'}} onClick={e => e.stopPropagation()}>
                  <div style={{fontWeight:'bold', fontSize:'16px', marginBottom:'15px', color:'#C2185B'}}>选择搭档精灵</div>
                  <div style={{fontSize:'11px', color:'#888', marginBottom:'10px'}}>选择一只精灵作为 {viewStatPet.name} 的搭档（每只精灵只能有一个搭档）</div>
                  <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                    {[...party, ...box].filter(p => (p.uid || p.id) !== (viewStatPet.uid || viewStatPet.id) && p.currentHp > 0).map(p => {
                      const isCurrentPartner = (p.uid || p.id) === viewStatPet.partnerId;
                      const hasOtherPartner = p.partnerId && p.partnerId !== (viewStatPet.uid || viewStatPet.id);
                      return (
                        <div key={p.uid || p.id} onClick={() => {
                          if (hasOtherPartner) { alert(`${p.name} 已有其他搭档，请先解除！`); return; }
                          setPartner(viewStatPet, p);
                          setViewStatPet(prev => ({...prev, partnerId: p.uid || p.id, bondPoints: prev.partnerId === (p.uid || p.id) ? (prev.bondPoints || 0) : 0 }));
                          setPartnerModal(false);
                          alert(`🤝 ${viewStatPet.name} 和 ${p.name} 结为搭档！`);
                        }} style={{
                          display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px', cursor:'pointer',
                          background: isCurrentPartner ? '#FCE4EC' : '#f5f5f5', border: isCurrentPartner ? '2px solid #E91E63' : '1px solid #eee'
                        }}>
                          <div style={{fontWeight:'bold', fontSize:'13px', flex:1}}>{p.name} <span style={{fontSize:'10px', color:'#888'}}>Lv.{p.level}</span></div>
                          <div style={{fontSize:'10px', color: TYPES[p.type]?.color, fontWeight:'bold'}}>{TYPES[p.type]?.name}</div>
                          {isCurrentPartner && <span style={{fontSize:'10px', color:'#E91E63', fontWeight:'bold'}}>当前搭档</span>}
                          {hasOtherPartner && <span style={{fontSize:'10px', color:'#999'}}>已有搭档</span>}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => setPartnerModal(false)} style={{width:'100%', marginTop:'15px', padding:'10px', background:'#f5f5f5', border:'none', borderRadius:'10px', fontSize:'13px', cursor:'pointer'}}>取消</button>
                </div>
              </div>
            )}

            {/* 4. 道具与培养 */}
            <div style={{padding:'0 20px 20px'}}>
               <div style={{background:'#FFF8E1', color:'#F57F17', padding:'8px', borderRadius:'8px', textAlign:'center', fontSize:'12px', fontWeight:'bold', marginBottom:'15px'}}>
                 幸运值 (暴击率): {getStats(viewStatPet).crit}%
               </div>

               <div onClick={() => openRebirthUI(viewStatPet)} style={{
                    background: 'linear-gradient(90deg, #673AB7, #9C27B0)', color: '#fff', padding: '10px', borderRadius: '10px', 
                    marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)'
                 }}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{fontSize:'20px'}}>🧬</span>
                      <div>
                          <div style={{fontWeight:'bold', fontSize:'14px'}}>基因洗练</div>
                          <div style={{fontSize:'10px', opacity:0.8}}>重置 Lv.5 | 刷新性格与资质</div>
                      </div>
                  </div>
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px', fontSize:'12px'}}>
                      💊 {inventory.misc.rebirth_pill || 0}
                  </div>
               </div>

               <div style={{fontSize:'12px', fontWeight:'bold', marginBottom:'8px'}}>属性培养</div>
               <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px', marginBottom:'15px'}}>
                  {GROWTH_ITEMS.map(item => {
                    const count = inventory[item.id] || 0;
                    return (
                      <button key={item.id} disabled={count<=0} onClick={() => useGrowthItem(party.indexOf(viewStatPet), item.id)}
                        style={{
                            minWidth:'60px', padding:'6px', border:'1px solid #eee', borderRadius:'8px', 
                            background: count>0?'#fff':'#f9f9f9', opacity: count>0?1:0.5,
                            display:'flex', flexDirection:'column', alignItems:'center'
                        }}>
                        <span style={{fontSize:'18px'}}>{item.emoji}</span>
                        <span style={{fontSize:'9px', color:'#666'}}>x{count}</span>
                      </button>
                    )
                  })}
               </div>

               {/* 进化家族树 */}
               {(() => {
                 const currentPet = viewStatPet;
                 const family = getFamilyTree(currentPet.id);
                 if (!family || (family.stage1.length === 0)) return null;

                 const EvoNode = ({ pet, method }) => {
                     const isCaught = caughtDex.includes(pet.id);
                     const isCurrent = pet.id === currentPet.id;
                     return (
                         <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'4px 0', minWidth:'60px'}}>
                             {method && (
                                 <div style={{
                                     fontSize:'9px', color:'#fff', marginBottom:'2px', 
                                     background:'#aaa', padding:'1px 6px', borderRadius:'10px', 
                                     zIndex:2, transform:'scale(0.9)'
                                 }}>
                                     {method}
                                 </div>
                             )}
                             <div 
                                onClick={() => {
                                    if (isCaught && !isCurrent) {
                                        const inParty = party.find(p => p.id === pet.id);
                                        if (inParty) setViewStatPet(inParty);
                                    }
                                }}
                                style={{
                                    width:'40px', height:'40px', 
                                    background: isCurrent ? '#E3F2FD' : '#f9f9f9',
                                    borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px',
                                    border: isCurrent ? '2px solid #2196F3' : '1px solid #eee',
                                    filter: (isCaught || isCurrent) ? 'none' : 'grayscale(100%) opacity(0.6)',
                                    cursor: (isCaught && !isCurrent) ? 'pointer' : 'default',
                                    overflow: 'hidden', padding: '2px',
                                    boxShadow: isCurrent ? '0 2px 6px rgba(33,150,243,0.3)' : 'none',
                                    transition: '0.2s'
                                }}
                             >
                                {(isCaught || isCurrent) ? renderAvatar(pet) : '❓'}
                             </div>
                             <div style={{
                                 fontSize:'10px', color: isCurrent?'#2196F3':'#666', marginTop:'2px', 
                                 fontWeight: isCurrent?'bold':'normal', 
                                 maxWidth:'56px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'
                             }}>
                                {(isCaught || isCurrent) ? pet.name : '???'}
                             </div>
                         </div>
                     );
                 };

                 return (
                   <div style={{
                       width: '100%', padding: '15px 10px', 
                       background:'#F5F7FA', borderRadius:'12px', border:'1px solid #eee', 
                       marginTop:'15px', overflowX: 'auto'
                   }}>
                     <div style={{fontSize:'11px', fontWeight:'bold', color:'#666', marginBottom:'10px', textAlign:'center'}}>进化家族</div>
                     <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                        <EvoNode pet={family.root} />
                        {family.stage1.length > 0 && (
                            <>
                                <div style={{color:'#ccc', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage1.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                        {family.stage2.length > 0 && (
                            <>
                                <div style={{color:'#ccc', fontSize:'14px'}}>➔</div>
                                <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                                    {family.stage2.map(pet => <EvoNode key={pet.id} pet={pet} method={pet.method} />)}
                                </div>
                            </>
                        )}
                     </div>
                   </div>
                 );
               })()}
            </div>

            {/* 5. 技能栏 */}
            <div style={{padding:'0 20px 20px', borderTop:'1px solid #f0f0f0', marginTop:'auto'}}>
               <div style={{fontSize:'12px', fontWeight:'bold', margin:'15px 0 8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <span>已学会技能</span>
                 <button 
                    onClick={() => {
                      const currentCount = inventory.ethers || inventory.meds?.ether || 0;
                      if (currentCount <= 0) { alert("没有PP补剂了！请去商店购买。"); return; }
                      const pIndex = party.findIndex(p => p === viewStatPet || (p.id === viewStatPet.id && p.caughtDate === viewStatPet.caughtDate));
                      if (pIndex === -1) return;
                      const newParty = [...party];
                      const pet = newParty[pIndex];
                      let recovered = false;
                      pet.moves.forEach(m => {
                         const max = m.maxPP || 20; 
                         if ((m.pp || 0) < max) { m.pp = max; recovered = true; }
                      });
                      if (recovered) {
                         setInventory(prev => {
                            const now = prev.meds?.ether || 0;
                            return { ...prev, meds: {...prev.meds, ether: now - 1} };
                         });
                         setParty(newParty);
                         setViewStatPet({...pet}); 
                         alert(`✨ ${pet.name} 的技能 PP 已全部恢复！`);
                      } else {
                         alert('技能 PP 已经是满的，无需使用。');
                      }
                    }}
                    style={{
                      fontSize:'11px', padding:'4px 10px', borderRadius:'12px', border:'none',
                      background: (inventory.meds?.ether || 0) > 0 ? '#E0F7FA' : '#f5f5f5',
                      color: (inventory.meds?.ether || 0) > 0 ? '#006064' : '#ccc',
                      cursor: (inventory.meds?.ether || 0) > 0 ? 'pointer' : 'not-allowed',
                      fontWeight: '600', display:'flex', alignItems:'center', gap:'4px'
                    }}
                 >
                   <span>🧴</span> 补剂 x{inventory.meds?.ether || 0}
                 </button>
               </div>

               <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  {viewStatPet.moves.map((m, i) => (
                    <div key={i} style={{background:'#f5f7fa', padding:'8px', borderRadius:'6px', borderLeft:`3px solid ${TYPES[m.t]?.color}`}}>
                       <div style={{display:'flex', justifyContent:'space-between'}}>
                         <div style={{fontSize:'12px', fontWeight:'bold'}}>{m.name}</div>
                         <div style={{fontSize:'10px', color: m.pp===0?'red':'#999', fontWeight:'bold'}}>PP: {m.pp||20}</div>
                       </div>
                       <div style={{fontSize:'10px', color:'#666', marginTop:'2px'}}>威力: {m.p}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
    );
  };


  // ==========================================
  // [补回] 队伍管理弹窗 (renderTeamModal)
  // ==========================================
  const renderTeamModal = () => {
    if (!teamMode && !usingItem) return null; // 如果没开启且没在使用物品，不显示

    // 关闭逻辑
    const handleClose = () => {
        if (usingItem) {
            setUsingItem(null);
            setView('bag'); // 如果是使用物品中，关闭回背包
        } else {
            setTeamMode(false);
        }
    };

    return (
      <div className="modal-overlay" onClick={handleClose} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500
      }}>
        <div className="team-modal-container" onClick={e => e.stopPropagation()}>
            
            {/* 1. 顶部标题栏 */}
            <div className="team-modal-header">
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'24px'}}>🛡️</span>
                    <div>
                        <div style={{fontSize:'18px', fontWeight:'800', color:'#333'}}>我的伙伴</div>
                        <div style={{fontSize:'11px', color:'#999', letterSpacing:'1px'}}>MY POKEMON TEAM ({party.length}/6)</div>
                    </div>
                </div>
                
                {/* 如果正在使用物品，显示提示 */}
                {usingItem && (
                    <div className="using-item-tip">
                        正在使用: <b>{usingItem.data?.name || usingItem.id}</b>
                        <span style={{fontSize:'10px', marginLeft:'5px'}}>(请选择对象)</span>
                    </div>
                )}

                <button className="btn-close-round" onClick={handleClose}>×</button>
            </div>

            {/* 2. 精灵列表 (2列网格) */}
            <div className="team-modal-grid">
                {/* 渲染现有精灵 */}
                {party.map((p, i) => {
                    const stats = getStats(p);
                    const hpPercent = (p.currentHp / stats.maxHp) * 100;
                    const isFainted = p.currentHp <= 0;
                    const typeConfig = TYPES[p.type] || TYPES.NORMAL;
                    
                    // 装备检查
                    const hasEquip = p.equips && p.equips.some(e => e);

                    return (
                        <div key={i} 
                             className={`team-member-card ${isFainted ? 'fainted' : ''}`}
                             style={{borderLeft: `4px solid ${typeConfig.color}`}}
                             onClick={() => {
                                 if (usingItem) handleItemUseOnPet(i);
                                 else setViewStatPet(p); // 点击查看详情
                             }}
                        >
                            {/* 背景装饰字 */}
                            <div className="card-bg-text">{p.type}</div>

                            {/* 左侧：头像与等级 */}
                            <div className="card-left">
                                <div className="card-avatar-box">
                                    {renderAvatar(p)}
                                    {i === 0 && <div className="leader-badge">👑</div>}
                                </div>
                                <div className="card-lvl-badge" style={{background: typeConfig.color}}>
                                    Lv.{p.level}
                                </div>
                            </div>

                            {/* 右侧：信息与状态 */}
                            <div className="card-right">
                                <div className="card-name-row">
                                    <span className="card-name">{p.name}</span>
                                    <div style={{display:'flex', gap:'4px'}}>
                                        {p.isShiny && <span className="shiny-dot">✨</span>}
                                        {hasEquip && <span className="equip-dot" title="持有装备">🛡️</span>}
                                    </div>
                                </div>

                                {/* 血条 */}
                                <div className="card-bar-group">
                                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#666', marginBottom:'2px'}}>
                                        <span>HP</span>
                                        <span>{Math.floor(p.currentHp)}/{stats.maxHp}</span>
                                    </div>
                                    <div className="bar-track-sm">
                                        <div className="bar-fill-sm" style={{
                                            width: `${hpPercent}%`, 
                                            background: hpPercent > 50 ? '#4CAF50' : (hpPercent > 20 ? '#FFC107' : '#FF5252')
                                        }}></div>
                                    </div>
                                </div>

                                {/* 快捷操作栏 (仅在非物品使用模式下显示) */}
                                {!usingItem && !isFainted && (
                                    <div className="card-actions">
                                        <button onClick={(e) => { e.stopPropagation(); usePotion(i); }} title="快速治疗">💊</button>
                                        <button onClick={(e) => { e.stopPropagation(); useBerry(i); }} title="喂食树果">🍒</button>
                                        {i !== 0 && <button onClick={(e) => { e.stopPropagation(); setLeader(i); }} title="设为首发">⬆️</button>}
                                    </div>
                                )}
                                {isFainted && <div className="fainted-text">濒死状态</div>}
                            </div>
                        </div>
                    );
                })}

                {/* 补齐空槽位 */}
                {[...Array(6 - party.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="team-member-card empty">
                        <div style={{fontSize:'24px', opacity:0.3}}>➕</div>
                        <div style={{fontSize:'12px', color:'#aaa', marginTop:'5px'}}>空槽位</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

   // ==========================================
  // [修改] 队伍管理界面 (移除了内嵌弹窗)
  // ==========================================
  const renderTeam = () => (
    <div className="screen team-screen">
      {/* 顶部导航栏 */}
      <div className="nav-header glass-panel">
        <button className="btn-back" onClick={() => {
            if (usingItem) { setUsingItem(null); setView('bag'); } 
            else setView('grid_map');
        }}>🔙 返回</button>
        <div className="nav-title">我的伙伴 ({party.length}/6)</div>
        <div style={{width: 60}}></div>
      </div>
      
      {/* 物品使用模式提示条 */}
      {usingItem && (
          <div style={{background:'#2196F3', color:'#fff', padding:'10px', textAlign:'center', fontWeight:'bold', boxShadow:'0 2px 5px rgba(0,0,0,0.2)'}}>
              正在使用: {usingItem.data?.name || usingItem.id} <br/>
              <span style={{fontSize:'12px', fontWeight:'normal'}}>请选择一个对象</span>
          </div>
      )}

      {/* 队伍列表内容区 */}
      <div className="team-content">
        <div className="team-grid-modern">
          {party.map((p, i) => {
            const stats = getStats(p);
            const hpPercent = (p.currentHp / stats.maxHp) * 100;
            const expPercent = (p.exp / p.nextExp) * 100;
            
            const isFainted = p.currentHp <= 0;
            const hasPending = !!p.pendingLearnMove; 
            
            // 视觉特效
            const getSpriteStyle = () => {
              if (p.isFusedShiny) return { filter: 'hue-rotate(150deg) drop-shadow(0 0 4px rgba(213,0,249,0.5))' };
              if (p.isShiny) return { filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' };
              return {};
            };
            const shinyStyle = getSpriteStyle();

            const equips = p.equips || [null, null];

            return (
              <div 
                key={i} 
                className={`hero-card bg-${p.type} ${isFainted ? 'fainted-card' : ''}`} 
                style={{
                    ...(hasPending ? {border: '3px solid #FFD700'} : {}),
                    ...(isFainted ? {filter: 'grayscale(100%) opacity(0.8)'} : {})
                }}
                onClick={() => {
                    if (usingItem) {
                        handleItemUseOnPet(i);
                    } else if (!hasPending) {
                        setViewStatPet(p); // 这里设置状态，触发外层弹窗
                    }
                }}
              >
                {isFainted && <div className="fainted-badge">😵 晕厥</div>}
                
                {/* 闪光/异色 徽章 */}
                {p.isFusedShiny ? (
                    <div style={{
                        position:'absolute', top:'0', left:'0',
                        background:'linear-gradient(135deg, #D500F9, #7B1FA2)', 
                        color:'#fff', fontSize:'10px', padding:'2px 8px', 
                        borderRadius:'8px 0 8px 0', fontWeight:'bold', zIndex:5,
                        boxShadow:'2px 2px 5px rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.2)'
                    }}>🧬 异色</div>
                ) : p.isShiny ? (
                    <div style={{
                        position:'absolute', top:'0', left:'0',
                        background:'linear-gradient(135deg, #FFD700, #FF6F00)', 
                        color:'#fff', fontSize:'10px', padding:'2px 8px', 
                        borderRadius:'8px 0 8px 0', fontWeight:'bold', zIndex:5,
                        boxShadow:'2px 2px 5px rgba(0,0,0,0.3)', borderBottom:'1px solid rgba(255,255,255,0.2)',
                        textShadow:'0 1px 1px rgba(0,0,0,0.2)'
                    }}>✨ 闪光</div>
                ) : null}

                <div className="hero-left">
                 <div className="hero-emoji" style={shinyStyle}>
                    {renderAvatar(p)}
                 </div>
                  <div className="hero-lvl-badge">Lv.{p.level}</div>
                </div>
                
                <div className="hero-right">
                  <div className="hero-header">
                    <div className="hero-name">{p.name} {p.isShiny && '✨'}</div>
                    {i === 0 && <div className="hero-leader-icon">👑</div>}
                  </div>
                  
                  {/* 装备槽位 */}
                  {!usingItem && (
                      <div className="equip-slots-row" onClick={e => e.stopPropagation()}>
                        {[0, 1].map(slotIdx => {
                            const accId = equips[slotIdx];
                            let acc = null;
                            if (typeof accId === 'string') acc = ACCESSORY_DB.find(a => a.id === accId);
                            else if (typeof accId === 'object') acc = accId;

                            return (
                                <div 
                                    key={slotIdx} 
                                    className={`equip-slot-box ${acc ? 'filled' : 'empty'}`}
                                    onClick={() => openEquipModal(i, slotIdx)}
                                >
                                    {acc ? <span title={acc.name}>{acc.icon}</span> : <span style={{opacity:0.3}}>🛡️</span>}
                                </div>
                            );
                        })}
                      </div>
                  )}

                 {hasPending ? (
                    <div className="pending-skill-alert" onClick={(e) => { e.stopPropagation(); startLearningMove(i); }}>
                      <div>💡 领悟新技能!</div>
                      <button className="action-btn-sm">学习</button>
                    </div>
                  ) : p.canEvolve && !usingItem ? (
                    <div className="pending-skill-alert" style={{background: 'rgba(0, 230, 118, 0.9)', color:'#fff'}} onClick={(e) => { e.stopPropagation(); handleManualEvolve(i); }}>
                      <div>✨ 进化的光芒!</div>
                      <button className="action-btn-sm" style={{color:'#00E676'}}>进化</button>
                    </div>
                  ) : (
                    <>
                      <div className="hero-bars">
                        <div className="bar-row">
                          <span className="bar-label">HP</span>
                          <div className="bar-track"><div className="bar-fill hp" style={{width: `${hpPercent}%`}}></div></div>
                          <span className="bar-text">{Math.floor(p.currentHp)}/{stats.maxHp}</span>
                        </div>
                        <div className="bar-row">
                          <span className="bar-label">EXP</span>
                          <div className="bar-track"><div className="bar-fill exp" style={{width: `${expPercent}%`}}></div></div>
                        </div>
                      </div>
                      
                      {!usingItem && (
                          <div className="hero-actions" onClick={e => e.stopPropagation()}>
                            <button className="action-btn-sm" onClick={() => useBerry(i)} disabled={inventory.berries <= 0 || isFainted}>🍒 喂食</button>
                            <button className="action-btn-sm" onClick={() => usePotion(i)} disabled={(inventory.meds.potion||0) <= 0 || isFainted}>💊 治疗</button>
                            {i !== 0 && <button className="action-btn-sm" onClick={() => setLeader(i)}>👑 首发</button>}
                          </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* 空槽位补齐 */}
          {[...Array(6 - party.length)].map((_, i) => (
            <div key={`empty-${i}`} className="empty-slot-card">
              <div className="empty-icon">➕</div>
              <div className="empty-text">空槽位</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    // ==========================================
  // [终极修复版] 环境特效图层 (自带样式 + 高对比度)
  // ==========================================
  const renderEnvironmentOverlay = () => {
    // 1. 动态注入 CSS 动画 (确保动画一定生效，无需外部CSS)
    const cssStyles = `
      @keyframes rain-drop {
        0% { transform: translateY(-10vh); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      @keyframes snow-fall {
        0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
        100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
      }
      @keyframes sand-storm {
        0% { transform: translateX(-10vw); opacity: 0; }
        20% { opacity: 0.8; }
        80% { opacity: 0.8; }
        100% { transform: translateX(100vw); opacity: 0; }
      }
      @keyframes sun-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes flash {
        0%, 90%, 100% { opacity: 0; }
        92%, 98% { opacity: 0.3; background: white; }
      }
    `;

    // 2. 昼夜滤镜 (加深颜色)
    let timeOverlay = null;
    if (timePhase === 'DUSK') {
        // 黄昏：明显的橙红色滤镜
        timeOverlay = <div style={{position:'absolute', inset:0, background:'rgba(255, 80, 0, 0.2)', pointerEvents:'none', zIndex:8, mixBlendMode:'multiply'}}></div>;
    } else if (timePhase === 'NIGHT') {
        // 夜晚：深蓝色遮罩
        timeOverlay = <div style={{position:'absolute', inset:0, background:'rgba(0, 0, 50, 0.6)', pointerEvents:'none', zIndex:8, mixBlendMode:'multiply'}}></div>;
    }

    // 3. 天气特效 (高对比度)
    let weatherNode = null;
    
    if (weather === 'RAIN') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(0,0,30,0.15)'}}></div> {/* 整体变暗 */}
                {[...Array(40)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`${Math.random()*100}%`, 
                        top:`-${Math.random()*20}%`,
                        width:'2px', 
                        height:`${20 + Math.random()*20}px`, 
                        background:'rgba(60, 160, 255, 0.8)', // 🔥 改为明显的亮蓝色
                        boxShadow: '0 0 2px rgba(255,255,255,0.5)',
                        animation: `rain-drop ${0.5 + Math.random()*0.3}s linear infinite`, 
                        animationDelay: `-${Math.random()}s`
                    }}></div>
                ))}
                {/* 偶尔闪电特效 */}
                <div style={{position:'absolute', inset:0, animation:'flash 6s infinite', pointerEvents:'none'}}></div>
            </div>
        );
    } else if (weather === 'SNOW') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(255,255,255,0.1)'}}></div>
                {[...Array(30)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`${Math.random()*100}%`, 
                        top:`-${Math.random()*20}%`,
                        color: '#fff',
                        fontSize: `${14 + Math.random()*10}px`, // 🔥 加大雪花尺寸
                        textShadow: '0 0 4px rgba(0,0,0,0.8)', // 🔥 加黑色阴影，保证在白背景下可见
                        animation: `snow-fall ${3 + Math.random()*2}s linear infinite`, 
                        animationDelay: `-${Math.random()*3}s`
                    }}><div style={{width:8+Math.random()*6, height:8+Math.random()*6, background:'#fff', borderRadius:'50%', boxShadow:'0 0 4px #fff'}} /></div>
                ))}
            </div>
        );
    } else if (weather === 'SAND') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, background:'rgba(194, 178, 128, 0.4)', mixBlendMode:'multiply'}}></div>
                {[...Array(20)].map((_,i) => (
                    <div key={i} style={{
                        position:'absolute', 
                        left:`-${Math.random()*20}%`, 
                        top:`${Math.random()*100}%`,
                        width:'200px', 
                        height:'3px', 
                        background:'rgba(139, 69, 19, 0.6)', // 🔥 改为深褐色沙尘
                        boxShadow: '0 0 5px rgba(139, 69, 19, 0.4)',
                        animation: `sand-storm ${0.6 + Math.random()}s linear infinite`, 
                        animationDelay: `-${Math.random()*2}s`
                    }}></div>
                ))}
            </div>
        );
    } else if (weather === 'SUN') {
        weatherNode = (
            <div style={{position:'absolute', inset:0, pointerEvents:'none', zIndex:9, overflow:'hidden'}}>
                {/* 右上角旋转的大太阳 */}
                <div style={{
                    position:'absolute', top:'-40px', right:'-40px', 
                    width:'150px', height:'150px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'sun-spin 20s linear infinite'
                }}>
                    <div style={{width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle, #FFD54F, #FF9800)', boxShadow:'0 0 40px #FFD54F, 0 0 80px #FF980088, 0 0 120px #FFD54F44'}} />
                </div>
                {/* 强烈的暖光滤镜 */}
                <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 90% 10%, rgba(255,200,0,0.25) 0%, transparent 60%)', mixBlendMode:'screen'}}></div>
            </div>
        );
    }

    return (
        <>
            <style>{cssStyles}</style>
            {timeOverlay}
            {weatherNode}
        </>
    );
  };

   // ==========================================
  // 6. [最终版] 探险地图界面 (含实时天气/时间显示)
  // ==========================================
  const renderGridMap = () => {
    if (mapGrid.length === 0) {
      setTimeout(() => setView('world_map'), 0);
      return <div className="screen" style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#1a1a2e',color:'#fff',fontSize:'16px'}}>加载中...</div>;
    }
    const currentMapInfo = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const theme = THEME_CONFIG[currentMapInfo.type] || THEME_CONFIG.grass;
    
    const timeInfo = TIME_PHASES[timePhase];
    
    // 🔥 [核心] 从 mapWeathers 获取当前地图的天气，如果没有则默认 CLEAR
    const currentWeatherKey = mapWeathers[currentMapId] || 'CLEAR';
    // 同步更新全局 weather 状态以便 renderEnvironmentOverlay 使用 (如果有必要，或者直接传参)
    // 天气同步移到 useEffect 中避免在渲染期间 setState
    
    const weatherInfo = WEATHERS[currentWeatherKey];

    const handleExitAndSave = () => {
      const dataToSave = { trainerName, trainerAvatar, gold, party, box, accessories, inventory, mapProgress, caughtDex, completedChallenges, badges, viewedIntros, unlockedTitles, currentTitle, leagueWins, sectTitles, housing, fruitInventory, achStats, unlockedAchs, storyProgress, storyStep, cafe };
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
      setHasSave(true); setView('world_map');
    };
    
    return (
      <div className={`screen grid-screen game-ui-wrapper ${theme.cssClass}`} style={{
          backgroundColor: theme.bg, 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          padding: '10px',
          gap: '15px'
      }}>
        {/* 环境特效层 (下雨/天黑等) */}
        {renderEnvironmentOverlay()}

        <div className="deco-cloud" style={{top: '10%', animationDuration: '60s', width: 80, height: 30, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.4), transparent)', borderRadius: '50%', filter: 'blur(3px)'}} />
        
        {/* 左侧面板 */}
        {renderLeftPanel()}
        
        {/* 中间区域 */}
        <div className="center-area" style={{
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minWidth: 0, 
            zIndex: 5,
            position: 'relative',
            paddingBottom: '0'
        }}>
          
          {/* ▼▼▼▼▼▼ 顶部状态栏 ▼▼▼▼▼▼ */}
          <div className="grid-header glass-panel" style={{
              marginBottom: '10px', flexShrink: 0, display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center', padding: '0 15px',
              height: '50px' 
          }}>
            {/* 左侧：当前地图名称 */}
            <div style={{display:'flex', alignItems:'center', gap:'6px', minWidth:'80px'}}>
              <span style={{fontSize:'14px', fontWeight:'700', color:'#333', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'120px'}}>{currentMapInfo?.name || '未知区域'}</span>
            </div>
            
            {/* 中间：环境仪表盘 (只读显示) */}
            {/* 🔥 [修改] 移除了 onClick 事件，改为纯展示 */}
            <div style={{
                    display:'flex', alignItems:'center', gap:'15px',
                    background: 'rgba(255,255,255,0.9)', 
                    padding: '6px 20px', borderRadius: '30px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    border: '2px solid #fff',
                    userSelect: 'none'
                }}
                title={`当前时间: ${Math.floor(gameTime/60)}分 (循环周期75分)`}
            >
                 {/* 时间显示 */}
                 <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <span style={{fontSize:'20px', filter:'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'}}>{timeInfo.icon}</span>
                    <span style={{fontSize:'14px', fontWeight:'800', color:'#444'}}>{timeInfo.name}</span>
                 </div>
                 
                 <div style={{width:'2px', height:'14px', background:'#ddd'}}></div>
                 
                 {/* 天气显示 */}
                 <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <span style={{fontSize:'20px', filter:'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'}}>{weatherInfo.icon}</span>
                    <span style={{fontSize:'14px', fontWeight:'800', color:'#444'}}>{weatherInfo.name}</span>
                 </div>
            </div>

            {/* 右侧：坐标显示 */}
            <div style={{
                width: '80px', textAlign:'right', fontSize:'12px', 
                color:'#666', fontWeight:'bold', fontFamily:'monospace',
                background:'rgba(255,255,255,0.5)', padding:'2px 8px', borderRadius:'6px'
            }}>
               X:{playerPos.x} Y:{playerPos.y}
            </div>
          </div>
          {/* 当前剧情任务提示条 */}
          {(() => {
            const ch = STORY_SCRIPT[storyProgress];
            if (!ch || ch.mapId !== currentMapId) return null;
            const task = ch.tasks?.find(t => t.step === storyStep);
            if (!task) return (
              <div style={{padding:'4px 12px', background:'rgba(76,175,80,0.15)', borderRadius:'8px', marginBottom:'4px', fontSize:'11px', color:'#4CAF50', fontWeight:'bold', textAlign:'center'}}>
                ✅ 剧情任务已完成 · 前往道馆挑战馆主
              </div>
            );
            return (
              <div style={{padding:'4px 12px', background:'rgba(255,152,0,0.15)', borderRadius:'8px', marginBottom:'4px', fontSize:'11px', color:'#E65100', fontWeight:'bold', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>{task.type === 'battle' ? '⚔️' : '💬'} {task.name}</span>
                <span style={{color:'#FF6D00'}}>📍({task.x},{task.y})</span>
              </div>
            );
          })()}
          {/* 2D 视口地图 - 自适应铺满 */}
          <div className="grid-viewport-v2" ref={el => {
            if (el && !el.dataset.sized) {
              el.dataset.sized = '1';
              const ro = new ResizeObserver(() => { el.dataset.w = el.clientWidth; el.dataset.h = el.clientHeight; });
              ro.observe(el);
            }
          }} style={{
              flex: 1, position: 'relative', borderRadius: '12px',
              overflow: 'hidden', background: '#2d5a3d'
          }}>
            {mapGrid.length > 0 && (() => {
              const vpEl = document.querySelector('.grid-viewport-v2');
              const vpW = vpEl ? vpEl.clientWidth : 700;
              const vpH = vpEl ? vpEl.clientHeight : 500;
              const VW = Math.max(11, Math.ceil(vpW / 52) | 1);
              const VH = Math.max(9, Math.ceil(vpH / 52) | 1);
              const TILE_SZ = Math.max(Math.floor(Math.min(vpW / VW, vpH / VH)), 40);
              const totalW = VW * TILE_SZ;
              const totalH = VH * TILE_SZ;

              const halfW = Math.floor(VW / 2), halfH = Math.floor(VH / 2);
              const camX = Math.max(0, Math.min(GRID_W - VW, playerPos.x - halfW));
              const camY = Math.max(0, Math.min(GRID_H - VH, playerPos.y - halfH));
              const offsetX = -(playerPos.x - halfW - camX) * TILE_SZ;
              const offsetY = -(playerPos.y - halfH - camY) * TILE_SZ;

              const leaderPet = party.find(p => p && p.currentHp > 0) || party[0];
              const leaderSprite = leaderPet ? getSpriteUrl(leaderPet) : null;

              const rows = [];
              for (let vy = 0; vy < VH; vy++) {
                const cells = [];
                for (let vx = 0; vx < VW; vx++) {
                  const wx = camX + vx, wy = camY + vy;
                  if (wx < 0 || wx >= GRID_W || wy < 0 || wy >= GRID_H) {
                    cells.push(<div key={`${vx}-${vy}`} className="mt-void" style={{width:TILE_SZ,height:TILE_SZ}} />);
                    continue;
                  }
                  const type = mapGrid[wy][wx];
                  const isPlayer = wx === playerPos.x && wy === playerPos.y;
                  const isEven = (wx + wy) % 2 === 0;
                  const seed = (wx * 7 + wy * 13) % 10;

                  let tileClass = 'mt-ground';
                  let content = null;

                  if (type === 1) {
                    tileClass = 'mt-tree';
                    content = (<div className="tree-icon"><div className="tree-crown" /><div className="tree-trunk" /></div>);
                  } else if (type === 2) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                  } else if (type === 3) {
                    tileClass = 'mt-water';
                  } else if (type === 4) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="bld-chest"><div className="chest-body" /><div className="chest-lid" /></div>);
                  } else if (type === 5) {
                    tileClass = 'mt-sand';
                  } else if (type === 6) {
                    tileClass = 'mt-rock';
                    content = (<div className="rock-icon" />);
                  } else if (type === 7) {
                    tileClass = 'mt-tallgrass';
                  } else if (type === 8) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="bld-center"><div className="center-cross" /></div>);
                  } else if (type === 9) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="bld-gym"><div className="gym-roof" /><div className="gym-body" /></div>);
                  } else if (type === 10) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="bld-shop"><span>SHOP</span></div>);
                  } else if (type >= 11 && type <= 13) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className={`npc-icon npc-enemy npc-lv${type-10}`}><div className="npc-head" /><div className="npc-body" /></div>);
                  } else if (type >= 20 && type <= 22) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="npc-icon npc-friendly"><div className="npc-head" /><div className="npc-body" /><div className="npc-bubble">!</div></div>);
                  } else if (type === 99) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="story-beacon" />);
                  } else if (type === FURNITURE_TILE) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="bld-chest"><div className="chest-body" style={{background:'#8D6E63'}} /><div className="chest-lid" style={{background:'#6D4C41'}} /></div>);
                  } else if (type === 14) {
                    tileClass = isEven ? 'mt-ground' : 'mt-ground-alt';
                    content = (<div className="fruit-tree-icon"><div className="tree-crown" style={{background:'radial-gradient(circle, #FF6F00 30%, #388E3C 60%)', boxShadow:'0 0 8px rgba(255,111,0,0.4)'}}/><div className="tree-trunk" /></div>);
                  }

                  cells.push(
                    <div key={`${vx}-${vy}`}
                      className={`mt-cell ${tileClass}`}
                      style={{width:TILE_SZ, height:TILE_SZ, animationDelay: type===7||type===3 ? `${seed*0.15}s` : undefined}}
                    >
                      {content}
                      {isPlayer && (
                        <div className="player-marker">
                          {leaderSprite ? (
                            <img src={leaderSprite} alt="" className="player-pet-img" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                          ) : null}
                          <div className="player-fallback" style={{display: leaderSprite ? 'none' : 'flex'}}>
                            {trainerAvatar && trainerAvatar.startsWith('http')
                              ? <img src={trainerAvatar} alt="" style={{width:32,height:32,objectFit:'contain'}} />
                              : (trainerAvatar || '🧢')}
                    </div>
                          <div className="player-shadow" />
                        </div>
                      )}
                  </div>
                );
                }
                rows.push(<div key={vy} style={{display:'flex'}}>{cells}</div>);
              }
              return (
                <div className="map-camera" style={{
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                  transition: 'transform 0.15s ease-out',
                  width: totalW, height: totalH,
                  position: 'absolute',
                  top: '50%', left: '50%',
                  marginTop: -totalH / 2,
                  marginLeft: -totalW / 2,
                }}>
                  {rows}
                </div>
              );
            })()}
            <div className="map-vignette" />
          </div>
          {/* 底部菜单栏 (保持不变) */}
          <div className="map-dock-capsule" style={{
              whiteSpace: 'nowrap'
          }}>
            {[
              { id: 'worldmap', icon: '🗺️', label: '地图', action: () => { handleExitAndSave(); setMapTab('maps'); } },
              { id: 'dungeons', icon: '⚔️', label: '副本', action: () => { handleExitAndSave(); setMapTab('dungeons'); } },
              { id: 'team', icon: '🛡️', label: '伙伴', action: () => setTeamMode(true) },
              { id: 'shop', icon: '🛍️', label: '商店', action: () => setShopMode(true) },
              { id: 'fusion', icon: '🧬', label: '融合', action: () => setFusionMode(true) },
              { id: 'bag', icon: '🎒', label: '背包' },
              { id: 'pvp', icon: '⚔️', label: '对战', action: () => setPvpMode(true) },
              { id: 'league', icon: '🏆', label: '联盟' },
              { id: 'pc', icon: '💻', label: '电脑', action: () => setPcMode(true) },
              { id: 'card', icon: '🆔', label: '卡片', action: () => setView('trainer_card') },
              { id: 'achievements', icon: '🏅', label: '成就', action: () => setView('achievements') },
              { id: 'pokedex', icon: '📖', label: '图鉴', action: () => setView('pokedex') },
              { id: 'fruit_dex', icon: '🍎', label: '果实', action: () => setView('fruit_dex') },
              { id: 'skill_dex', icon: '⚡', label: '技能', action: () => setView('skill_dex') },
              { id: 'housing', icon: '🏡', label: '家园', action: () => setView('housing') },
              { id: 'guide', icon: '❓', label: '说明', action: () => setView('guide') },
            ].map(btn => (
              <button key={btn.id} className="dock-btn-capsule" onClick={btn.action || (() => setView(btn.id))} 
                style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer'}}>
                  <div style={{fontSize: '24px', lineHeight: '1'}}>{btn.icon}</div>
                  <div style={{fontSize: '12px', fontWeight: 'bold', color:'#555'}}>{btn.label}</div>
              </button>
            ))}
            <div className="dock-divider-v" style={{width:'2px', height:'35px', background:'#eee', margin:'0 10px'}}></div>
            <button className="dock-btn-capsule" onClick={manualSave}
                style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer'}}>
                <div style={{fontSize: '24px', lineHeight: '1'}}>💾</div>
                <div style={{fontSize: '12px', fontWeight: 'bold', color:'#555'}}>存档</div>
            </button>
          </div>
        </div>

        {/* 右侧面板 */}
        {renderRightPanel()}
        {renderShop()}
        {renderPC()}
        {renderTeamModal()}
        {renderFusion()}
      </div>
    );
  };


  const renderAvatarSelector = () => {
    if (!showAvatarSelector) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowAvatarSelector(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
            width: '320px', background: '#fff', borderRadius: '16px', padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display:'flex', flexDirection:'column'
        }}>
            <div style={{fontSize:'16px', fontWeight:'bold', marginBottom:'15px', textAlign:'center'}}>选择你的形象</div>
            
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
                maxHeight: '400px', overflowY: 'auto', padding: '5px'
            }}>
                {TRAINER_SPRITES.map((t) => (
                    <div key={t.id} 
                        onClick={() => {
                            setTrainerAvatar(t.url);
                            setShowAvatarSelector(false);
                        }}
                        style={{
                            cursor: 'pointer', 
                            background: trainerAvatar === t.url ? '#E3F2FD' : '#f9f9f9',
                            border: trainerAvatar === t.url ? '2px solid #2196F3' : '1px solid #eee',
                            borderRadius: '10px', padding: '6px 2px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.15s, box-shadow 0.15s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
                    >
                        <img src={t.url} alt={t.name} style={{width:56, height:56, objectFit:'contain'}} onError={e => { e.target.src=''; e.target.alt=t.name; }} />
                        <div style={{fontSize:'10px', color:'#666', marginTop:'2px', whiteSpace:'nowrap'}}>{t.name}</div>
                    </div>
                ))}
            </div>

            <button onClick={() => setShowAvatarSelector(false)} style={{
                marginTop: '15px', padding: '10px', border: 'none', borderRadius: '8px',
                background: '#f0f0f0', color: '#666', fontWeight: 'bold', cursor: 'pointer'
            }}>
                取消
            </button>
        </div>
      </div>
    );
  };
   // ==========================================
  // [新增] 缺失的活动核心逻辑函数
  // ==========================================

  // 1. 捕虫大赛 - 开始
  const startBugContest = () => {
    setActiveContest({ id: 'bug' });
    encounterNextBug(); // 直接调用遇敌逻辑
  };

  // 1.1 捕虫大赛 - 遭遇下一只 (等级跟随当前地图)
  const encounterNextBug = () => {
    const pool = CONTEST_CONFIG.bug.pool;
    const enemyId = _.sample(pool);
    const mapInfo = MAPS.find(m => m.id === currentMapId);
    const mapLvl = mapInfo ? mapInfo.lvl : [2, 10];
    startBattle({
        id: 9001,
        name: '大赛目标',
        pool: [enemyId],
        lvl: mapLvl,
        drop: 0
    }, 'contest_bug'); 
  };

  // 2. 钓鱼大赛 - 开始
  const startFishing = () => {
    setActiveContest({ id: 'fishing' });
    setFishingState({ status: 'idle', timer: 0, target: null, fish: null, weight: 0, msg: '' });
    setView('fishing_game');
  };

  // 2.1 钓鱼 - 抛竿
  const castRod = () => {
    if (fishingState.status !== 'idle') return;
    
    setFishingState(prev => ({ ...prev, status: 'waiting', msg: '等待咬钩...' }));
    
    // 随机等待 2~5 秒
    const waitTime = _.random(2000, 5000);
    
    setTimeout(() => {
        // 只有还在 waiting 状态才触发咬钩
        setFishingState(prev => {
            if (prev.status === 'waiting') {
                // 咬钩后，给 0.6 秒反应时间
                setTimeout(() => {
                    setFishingState(curr => {
                        if (curr.status === 'bite') {
                            return { ...curr, status: 'fail', msg: '鱼跑掉了...' };
                        }
                        return curr;
                    });
                }, 600);
                return { ...prev, status: 'bite', msg: '❗️ 咬钩了！快提竿！' };
            }
            return prev;
        });
    }, waitTime);
  };

  // 2.2 钓鱼 - 提竿 (体重与鱼种/徽章挂钩)
  const reelIn = () => {
    const { status } = fishingState;
    
    if (status === 'waiting') {
        setFishingState(prev => ({ ...prev, status: 'fail', msg: '提竿太早了！吓跑了鱼。' }));
    } 
    else if (status === 'bite') {
        const pool = CONTEST_CONFIG.fishing.pool;
        const fishId = _.sample(pool);
        const progressMult = 1 + badges.length * 0.15;
        const weightTable = { 7: 15, 24: 35, 26: 55, 173: 90 };
        let baseWeight = weightTable[fishId] || 20;
        baseWeight *= progressMult;
        const weight = (Math.random() * baseWeight * 0.7 + baseWeight * 0.1).toFixed(1);
        
        const mapInfo = MAPS.find(m => m.id === currentMapId);
        const fishLvl = mapInfo ? mapInfo.lvl : [5, 15];
        const fish = createPet(fishId, _.random(fishLvl[0], fishLvl[1]));
        
        setFishingState(prev => ({ 
            ...prev, 
            status: 'success', 
            fish: fish, 
            weight: weight, 
            msg: '成功钓起！' 
        }));
    }
  };

  // 3. 华丽大赛 - 开始
  const startBeautyContest = () => {
    if (party.length === 0) return;
    // 默认使用首发精灵参赛
    setActiveContest({ id: 'beauty', pet: party[0] });
    setBeautyState({ round: 1, appeal: 0, history: [], log: [] });
    setView('beauty_contest');
  };

  // 3.1 华丽大赛 - 表演
  const performAppeal = (move) => {
    const { round, appeal, log, history } = beautyState;
    if (round > 5) return;

    let score = 0;
    let msg = "";

    if (move.p === 0) score += 25;
    else if (move.p <= 60) score += 15;
    else score += 8;

    if (['FAIRY', 'WATER', 'ICE', 'GRASS'].includes(move.t)) {
        score += 8;
        msg = `✨ ${move.name} 非常华丽！`;
    } else {
        msg = `使用了 ${move.name}。`;
    }

    // 连续使用同一招会扣分
    if (history && history.length > 0 && history[history.length - 1] === move.name) {
        score -= 10;
        msg += " (重复使用，观众感到无聊！)";
    }

    const rng = _.random(-8, 10);
    score += rng;
    if (rng > 7) msg += " 观众反应热烈！";
    else if (rng < -5) msg += " 观众反应冷淡...";
    score = Math.max(0, score);

    // 更新状态
    setBeautyState(prev => ({
        round: prev.round + 1,
        appeal: prev.appeal + score,
        history: [...prev.history, move.name],
        log: [`Round ${prev.round}: ${msg} (+${score})`, ...prev.log]
    }));
  };

   // 🔥 [美化] 报名弹窗 (含排行榜)
  const renderActivityModal = () => {
    if (!activityModal) return null;
    const config = CONTEST_CONFIG[activityModal];
    if (!config) return null;

    const typeKey = config.id.split('_')[1];
    const myRecord = activityRecords[typeKey] || 0;

          const handleStart = () => {
        if (gold < config.entryFee) { alert("❌ 金币不足，无法报名！"); return; }
        // 活动冷却检查 (3次后等3分钟)
        const cdKey = `contest_${activityModal}`;
        const cd = dungeonCooldowns[cdKey];
        if (cd && cd.count >= 3) {
          const elapsed = Date.now() - cd.lastTime;
          if (elapsed < 3 * 60 * 1000) {
            const remaining = Math.ceil((3 * 60 * 1000 - elapsed) / 60000);
            alert(`⏰ 活动冷却中！已连续参加3次，请等待 ${remaining} 分钟。\n去主线地图探索吧！`);
            return;
          }
          setDungeonCooldowns(prev => ({ ...prev, [cdKey]: { count: 0, lastTime: Date.now() } }));
        }
        setDungeonCooldowns(prev => {
          const c = prev[cdKey] || { count: 0, lastTime: Date.now() };
          return { ...prev, [cdKey]: { count: c.count + 1, lastTime: Date.now() } };
        });
        setGold(g => g - config.entryFee); 
        setActivityModal(null);
        if (activityModal === 'bug') startBugContest();
        else if (activityModal === 'fishing') startFishing();
        else if (activityModal === 'beauty') startBeautyContest();
    };



    return (
      <div className="modal-overlay" onClick={() => setActivityModal(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500}}>
        <div onClick={e => e.stopPropagation()} style={{width: '400px', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s'}}>
            <div style={{height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', position: 'relative'}}>
                <div style={{fontSize: '50px', marginBottom: '5px'}}>{activityModal === 'bug' ? '🦋' : (activityModal === 'fishing' ? '🎣' : '🎀')}</div>
                <div style={{fontSize: '22px', fontWeight: '900', letterSpacing: '1px'}}>{config.name}</div>
                <button onClick={() => setActivityModal(null)} style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer'}}>×</button>
            </div>
            <div style={{padding: '20px'}}>
                {/* 🏆 个人记录展示 */}
                <div style={{background:'#FFF8E1', padding:'10px', borderRadius:'10px', marginBottom:'15px', display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid #FFECB3'}}>
                    <div style={{fontSize:'12px', color:'#F57C00', fontWeight:'bold'}}>🏆 个人最高记录</div>
                    <div style={{fontSize:'16px', fontWeight:'900', color:'#FF6F00'}}>{myRecord} <span style={{fontSize:'10px'}}>{activityModal==='fishing'?'kg':'分'}</span></div>
                </div>

                <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px', textAlign: 'center'}}>{config.desc}</div>
                
                {/* 等级跟随地图提示 */}
                {(() => {
                  const mapInfo = MAPS.find(m => m.id === currentMapId);
                  const mapLvl = mapInfo ? mapInfo.lvl : [2, 10];
                  return (
                    <div style={{background:'#E3F2FD', padding:'8px 12px', borderRadius:'8px', marginBottom:'12px', fontSize:'11px', color:'#1565C0', border:'1px solid #BBDEFB', textAlign:'center'}}>
                      📍 等级随当前地图调整: Lv.{mapLvl[0]}~{mapLvl[1]} | 奖励等级: ~Lv.{Math.floor((mapLvl[0]+mapLvl[1])/2)}
                    </div>
                  );
                })()}
                {/* 冷却提示 */}
                {(() => {
                  const cdKey = `contest_${activityModal}`;
                  const cd = dungeonCooldowns[cdKey];
                  if (cd && cd.count > 0) {
                    const inCooldown = cd.count >= 3 && (Date.now() - cd.lastTime) < 3 * 60 * 1000;
                    return <div style={{background: inCooldown ? '#FFF3E0' : '#F5F5F5', padding:'6px 10px', borderRadius:'6px', marginBottom:'10px', fontSize:'11px', color: inCooldown ? '#E65100' : '#666', border:`1px solid ${inCooldown ? '#FFE0B2' : '#E0E0E0'}`, textAlign:'center'}}>
                      {inCooldown ? `⏰ 冷却中 (${cd.count}/3次)，去主线地图探索吧！` : `已参加 ${cd.count}/3 次`}
                    </div>;
                  }
                  return null;
                })()}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto'}}>
                    <div style={{fontSize: '12px', color: '#666'}}>报名费: <span style={{color: gold < config.entryFee ? '#F44336' : '#4CAF50', fontWeight: 'bold', fontSize: '16px'}}>💰 {config.entryFee}</span></div>
                    <button onClick={handleStart} style={{padding: '12px 30px', borderRadius: '25px', border: 'none', background: gold < config.entryFee ? '#ccc' : 'linear-gradient(90deg, #2196F3, #21CBF3)', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: gold < config.entryFee ? 'not-allowed' : 'pointer', boxShadow: gold < config.entryFee ? 'none' : '0 4px 15px rgba(33, 150, 243, 0.3)'}}>立即报名</button>
                </div>
            </div>
        </div>
      </div>
    );
  };

     // ==========================================
  // [修复] 手动进化处理函数 (修复逻辑死锁)
  // ==========================================
  const handleManualEvolve = async (petIdx) => {
    const newParty = [...party];
    const pet = newParty[petIdx];

    // 1. 再次校验条件
    if (!pet.evo || pet.level < pet.evoLvl) {
        alert("条件不满足，无法进化。");
        return;
    }

    const nextForm = POKEDEX.find(d => d.id === pet.evo);
    
    // 🔥 修复：如果找不到下一形态，直接返回
    if (!nextForm) {
        alert("未知的进化形态！");
        return;
    }

    // 2. 触发动画 (设置状态后直接返回，让渲染层处理动画)
    setEvoAnim({
        targetIdx: petIdx,
        oldPet: pet,
        newPet: nextForm,
        step: 0
    });
  };


   

  const startLearningMove = (petIdx) => {
    setLearningPetIdx(petIdx);
    setPendingMove(party[petIdx].pendingLearnMove);
    setView('move_forget');
  };
    // ==========================================
  // [新增] 洗练系统核心逻辑
  // ==========================================
  
  // 1. 打开洗练界面 (生成初始预览)
  const openRebirthUI = (pet) => {
    if ((inventory.misc.rebirth_pill || 0) <= 0) {
        alert("缺少洗练药！请去商店购买。");
        return;
    }
    
    const idx = party.findIndex(p => p.uid === pet.uid);
    if (idx === -1) return;

    // 生成一个预览用的精灵 (不扣道具，仅预览)
    // 注意：这里我们先不生成新的，而是显示当前状态，点击“洗练”才生成新的
    // 或者为了体验，打开时直接显示“准备洗练”的状态
    setRebirthData({
        petIdx: idx,
        original: pet,
        preview: null // 尚未开始洗练
    });
  };

     // 2. 执行一次洗练 (扣除道具，生成新属性)
  const executeReroll = () => {
    const basePet = rebirthData.original;
    
    // 【需求2修改】：如果是闪光/异色，消耗2个；普通消耗1个
    const cost = basePet.isShiny ? 2 : 1;
    const currentStock = inventory.misc.rebirth_pill || 0;

    if (currentStock < cost) {
        alert(`洗练药不足！\n当前库存: ${currentStock}\n本次需要: ${cost} (闪光精灵消耗加倍)`);
        return;
    }

    // 1. 扣除道具
    setInventory(prev => ({
        ...prev, 
        misc: { ...prev.misc, rebirth_pill: prev.misc.rebirth_pill - cost }
    }));

    // 2. 基于原版生成新数据
    
    // 随机 IVs
    const randIV = () => Math.floor(Math.random() * 32); 
    const newIvs = { 
        hp: randIV(), p_atk: randIV(), p_def: randIV(), 
        s_atk: randIV(), s_def: randIV(), spd: randIV(), 
        crit: Math.floor(Math.random() * 15) 
    };

    // 随机性格
    const natureKeys = Object.keys(NATURE_DB);
    const newNature = natureKeys[Math.floor(Math.random() * natureKeys.length)];

    // 【需求2修改】：闪光/异色逻辑
    let isNewShiny = false;
    if (basePet.isShiny) {
        // 如果原来是闪光，必定保留闪光
        isNewShiny = true;
    } else {
        // 如果原来不是，有 5% 概率变闪光
        isNewShiny = Math.random() < 0.05;
    }

    // ▼▼▼ 新增：洗练也重置种族波动 ▼▼▼
    const newDiversityRng = Math.floor(Math.random() * 9) - 4; 
    const newSpeedRng = Math.floor(Math.random() * 71) + 40;
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 构建预览对象 (回到 5 级)
    const previewPet = {
        ...basePet,
        level: 5,
        exp: 0,
        nextExp: 100, 
        ivs: newIvs,
        nature: newNature,
        isShiny: isNewShiny,
        // 写入新的随机值
        diversityRng: newDiversityRng,
        speedRng: newSpeedRng
    };

    // 计算5级时的属性用于展示
    const stats = getStats(previewPet);
    previewPet.currentHp = stats.maxHp;

    setRebirthData(prev => ({ ...prev, preview: previewPet }));
  };



  // 3. 确认保存结果
  const confirmRebirth = () => {
    if (!rebirthData || !rebirthData.preview) return;

    const newParty = [...party];
    newParty[rebirthData.petIdx] = rebirthData.preview;
    
    setParty(newParty);
    
    // 更新详情页视图
    setViewStatPet(rebirthData.preview);
    
    setRebirthData(null);
    alert("✨ 洗练成功！伙伴获得了新生！");
  };
  
   // ==========================================
  // [重写] 背包界面 (精致美观版)
  // ==========================================
  const renderBag = () => {
    const handleItemClick = (item, category) => { setSelectedBagItem({ ...item, category }); };
    const handleUseBtn = () => {
        if (!selectedBagItem) return;
        if (['meds', 'tm', 'growth', 'stone'].includes(selectedBagItem.category)) {
            setUsingItem({ id: selectedBagItem.id, category: selectedBagItem.category, data: selectedBagItem });
            setSelectedBagItem(null); setView('team'); 
        } else if (selectedBagItem.category === 'cursed') {
            const cItem = CURSED_ITEMS[selectedBagItem.id];
            if (!cItem) return;
            if (cItem.type === 'CE_MAX_UP') {
              const idxStr = prompt(`请选择精灵 (1-${party.length}) 使用 ${cItem.name}:`, "1");
              const idx = parseInt(idxStr) - 1;
              if (!isNaN(idx) && idx >= 0 && idx < party.length) {
                party[idx].maxCE = (party[idx].maxCE || 0) + cItem.val;
                setInventory(inv => ({ ...inv, cursed: { ...inv.cursed, [selectedBagItem.id]: inv.cursed[selectedBagItem.id] - 1 } }));
                alert(`${party[idx].name} 的咒力上限永久提升 +${cItem.val}!`);
              }
            } else { alert(`${cItem.name} 只能在战斗中使用。`); }
            setSelectedBagItem(null);
        } else if (selectedBagItem.id === 'rebirth_pill') {
             const idxStr = prompt(`请输入要洗练的精灵序号 (1-${party.length}):`, "1");
             const idx = parseInt(idxStr) - 1;
             if (!isNaN(idx) && idx >= 0 && idx < party.length) { openRebirthUI(party[idx]); setSelectedBagItem(null); }
        } else if (selectedBagItem.category === 'acc') { alert("请前往 [我的伙伴] 界面，点击精灵进行饰品装备。");
        } else { alert("该物品无法直接使用"); }
    };

    let currentItems = [];
    let currentCat = '';
    if (bagTab === 'balls') { currentCat = 'ball'; Object.keys(inventory.balls || {}).forEach(k => { if ((inventory.balls||{})[k] > 0 && BALLS[k]) currentItems.push({ ...BALLS[k], count: inventory.balls[k] }); });
    } else if (bagTab === 'meds') { currentCat = 'meds'; Object.keys(inventory.meds || {}).forEach(k => { if ((inventory.meds||{})[k] > 0 && MEDICINES[k]) currentItems.push({ ...MEDICINES[k], count: inventory.meds[k] }); }); if (inventory.berries > 0) currentItems.push({ id: 'berry', name: '树果', icon: '🍒', desc: '恢复少量体力', count: inventory.berries, type: 'HP', val: 30 });
    } else if (bagTab === 'tms') { currentCat = 'tm'; Object.keys(inventory.tms || {}).forEach(k => { if ((inventory.tms||{})[k] > 0) { const tm = ALL_SKILL_TMS.find(t => t.id === k); if (tm) currentItems.push({ ...tm, count: inventory.tms[k] }); } });
    } else if (bagTab === 'stones') { currentCat = 'stone'; Object.keys(inventory.stones || {}).forEach(k => { if (inventory.stones[k] > 0) { const s = EVO_STONES[k]; if (s) currentItems.push({ ...s, count: inventory.stones[k] }); } });
    } else if (bagTab === 'misc') { currentCat = 'growth'; GROWTH_ITEMS.forEach(g => { if (inventory[g.id] > 0) currentItems.push({ ...g, count: inventory[g.id], icon: g.emoji }); }); if ((inventory.misc?.rebirth_pill || 0) > 0) currentItems.push({ ...MISC_ITEMS.rebirth_pill, count: inventory.misc.rebirth_pill });
    } else if (bagTab === 'accessories') { currentCat = 'acc'; ACCESSORY_DB.forEach(acc => { const count = accessories.filter(item => item === acc.id).length; if (count > 0) currentItems.push({ ...acc, count }); }); accessories.forEach(item => { if (typeof item === 'object' && item.isUnique) currentItems.push({ ...item, name: item.displayName, count: 1, desc: `${item.desc} | 技能: ${item.extraSkill.name}` }); });
    } else if (bagTab === 'fruits') { currentCat = 'fruit'; const fruitCounts = {}; fruitInventory.forEach(fid => { fruitCounts[fid] = (fruitCounts[fid] || 0) + 1; }); Object.entries(fruitCounts).forEach(([fid, count]) => { const fruit = getFruitById(fid); if (fruit) { const equipped = [...party, ...box].filter(p => p.devilFruit === fid).length; currentItems.push({ id: fid, name: fruit.name, icon: null, fruitId: fid, desc: `[${FRUIT_CATEGORY_NAMES[fruit.category]}] ${fruit.desc}\n持续${fruit.duration}回合`, count, rarity: fruit.rarity, category: fruit.category, equipped }); } });
    } else if (bagTab === 'cursed') { currentCat = 'cursed'; Object.keys(inventory.cursed || {}).forEach(k => { if ((inventory.cursed || {})[k] > 0 && CURSED_ITEMS[k]) currentItems.push({ ...CURSED_ITEMS[k], count: inventory.cursed[k] }); }); }

    const tabConfig = [
      {id:'balls',    label:'精灵球', icon:'🔴', color:'#EF5350'},
      {id:'meds',     label:'药品',   icon:'💊', color:'#66BB6A'},
      {id:'tms',      label:'技能书', icon:'📀', color:'#42A5F5'},
      {id:'stones',   label:'进化石', icon:'💎', color:'#AB47BC'},
      {id:'misc',     label:'道具',   icon:'🎁', color:'#FF9800'},
      {id:'accessories',label:'饰品', icon:'💍', color:'#EC407A'},
      {id:'fruits',   label:'果实',   icon:'🍎', color:'#D32F2F'},
      {id:'cursed',   label:'咒具',   icon:'🔮', color:'#7B1FA2'},
    ];
    const activeTab = tabConfig.find(t=>t.id===bagTab) || tabConfig[0];
    const totalItems = currentItems.reduce((s,i)=>s+i.count,0);

    const renderItemIcon = (item, size) => {
      if (item.fruitId) return renderFruitCSSIcon(item.fruitId, size);
      if (currentCat==='ball') return renderBallCSS(item.id, size);
      if (currentCat==='meds') return renderMedCSS(item.id, size) || <span style={{fontSize:size*0.75}}>{item.icon}</span>;
      if (currentCat==='tm') return renderTMCSS(item.type || 'NORMAL', size);
      if (currentCat==='stone') return renderStoneCSS(item.id, size) || <span style={{fontSize:size*0.75}}>{item.icon}</span>;
      if (currentCat==='growth') return renderGrowthCSS(item.id, size) || (item.id === 'rebirth_pill' ? renderMiscCSS(size) : <span style={{fontSize:size*0.75}}>{item.icon||item.emoji}</span>);
      if (currentCat==='acc') return renderAccCSS(item.id, size) || <span style={{fontSize:size*0.75}}>{item.icon}</span>;
      return <span style={{fontSize:size*0.75}}>{item.icon || item.emoji || '📦'}</span>;
    };

    return (
      <div className="modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(10,10,30,0.7)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
        <div style={{width:'880px',maxWidth:'95vw',height:'600px',maxHeight:'90vh',background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',borderRadius:'24px',display:'flex',overflow:'hidden',boxShadow:'0 25px 60px rgba(0,0,0,0.5),0 0 120px rgba(100,100,255,0.08)',border:'1px solid rgba(255,255,255,0.08)'}}>
            {/* 左侧导航 */}
            <div style={{width:'170px',background:'rgba(0,0,0,0.3)',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',flexShrink:0}}>
                <div style={{padding:'20px 16px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{fontSize:'18px',fontWeight:'900',color:'#fff',letterSpacing:'2px',marginBottom:'4px'}}>🎒 背包</div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.35)'}}>💰 {gold.toLocaleString()} 金币</div>
                </div>
                <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
                  {tabConfig.map(tab=>{
                    const isActive = bagTab===tab.id;
                    return (
                      <div key={tab.id} onClick={()=>setBagTab(tab.id)} style={{
                        padding:'10px 14px',margin:'2px 8px',borderRadius:'10px',cursor:'pointer',
                        display:'flex',alignItems:'center',gap:'8px',transition:'all 0.2s',
                        background:isActive?`linear-gradient(90deg,${tab.color}30,transparent)`:'transparent',
                        borderLeft:isActive?`3px solid ${tab.color}`:'3px solid transparent',
                      }}>
                        <span style={{fontSize:'16px',filter:isActive?'none':'grayscale(0.5) opacity(0.6)'}}>{tab.icon}</span>
                        <span style={{fontSize:'12px',fontWeight:isActive?'700':'500',color:isActive?'#fff':'rgba(255,255,255,0.45)',transition:'all 0.2s'}}>{tab.label}</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setView(party.length>0?getBackToMapView():'menu')} style={{
                  margin:'10px 12px 16px',padding:'10px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',
                  background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.6)',fontSize:'12px',fontWeight:'600',cursor:'pointer',transition:'all 0.2s',
                }}>关闭背包</button>
            </div>

            {/* 右侧物品区 */}
            <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
                {/* 顶栏 */}
                <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <span style={{fontSize:'20px'}}>{activeTab.icon}</span>
                        <span style={{fontSize:'16px',fontWeight:'800',color:'#fff',letterSpacing:'1px'}}>{activeTab.label}</span>
                        <span style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.06)',padding:'2px 10px',borderRadius:'10px'}}>{currentItems.length}种 · {totalItems}件</span>
                    </div>
                </div>

                {/* 物品网格 */}
                <div style={{flex:1,padding:'16px 20px',overflowY:'auto'}}>
                  {currentItems.length === 0 ? (
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:'rgba(255,255,255,0.2)'}}>
                      <div style={{fontSize:'48px',marginBottom:'12px',opacity:0.4}}>📦</div>
                      <div style={{fontSize:'14px',fontWeight:'600'}}>暂无此类物品</div>
                      <div style={{fontSize:'11px',marginTop:'4px',color:'rgba(255,255,255,0.15)'}}>可通过商店购买、战斗掉落或活动获取</div>
                    </div>
                  ) : (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'10px',alignContent:'start'}}>
                      {currentItems.map((item,idx)=>{
                        const isFruit = currentCat === 'fruit';
                        const rarityColor = isFruit && item.rarity ? (FRUIT_RARITY_CONFIG[item.rarity]?.color || '#666') : activeTab.color;
                        return (
                          <div key={idx} onClick={()=>handleItemClick(item,currentCat)} style={{
                            background:'rgba(255,255,255,0.04)',borderRadius:'14px',padding:'14px 10px 12px',
                            display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer',
                            border:`1px solid rgba(255,255,255,0.06)`,position:'relative',transition:'all 0.25s',
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor=`${rarityColor}60`;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 8px 20px ${rarityColor}15`;}}
                          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}>
                            <span style={{position:'absolute',top:'6px',right:'6px',background:`${rarityColor}cc`,color:'#fff',fontSize:'9px',padding:'1px 7px',borderRadius:'8px',fontWeight:'700'}}>x{item.count}</span>
                            {isFruit && item.equipped > 0 && <span style={{position:'absolute',top:'6px',left:'6px',fontSize:'8px',color:'#4CAF50',fontWeight:'700',background:'rgba(76,175,80,0.15)',padding:'1px 5px',borderRadius:'6px'}}>装备{item.equipped}</span>}
                            <div style={{marginBottom:'8px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:36}}>{renderItemIcon(item,36)}</div>
                            <div style={{fontSize:'11px',fontWeight:'700',color:'#fff',textAlign:'center',lineHeight:'1.3',height:'28px',overflow:'hidden',wordBreak:'break-all'}}>{item.name}</div>
                            {isFruit && <div style={{fontSize:'8px',color:rarityColor,fontWeight:'600',marginTop:'2px'}}>{FRUIT_RARITY_CONFIG[item.rarity]?.label}</div>}
                            {currentCat==='tm'&&item.type&&<div style={{fontSize:'8px',color:TYPES[item.type]?.color||'#888',fontWeight:'600',marginTop:'2px'}}>威力{item.p}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
            </div>
        </div>

        {/* 物品详情弹窗 */}
        {selectedBagItem && (
          <div className="modal-overlay" onClick={()=>setSelectedBagItem(null)} style={{zIndex:2000,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)'}}>
            <div onClick={e=>e.stopPropagation()} style={{
              width:'320px',maxWidth:'90vw',background:'linear-gradient(145deg,#1a1a2e,#16213e)',borderRadius:'20px',padding:'24px',
              display:'flex',flexDirection:'column',alignItems:'center',boxShadow:'0 20px 50px rgba(0,0,0,0.4)',border:'1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{width:'72px',height:'72px',borderRadius:'16px',background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'14px'}}>
                {renderItemIcon(selectedBagItem,52)}
              </div>
              <div style={{fontSize:'17px',fontWeight:'800',color:'#fff',marginBottom:'4px'}}>{selectedBagItem.name}</div>
              {selectedBagItem.count && <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginBottom:'10px'}}>持有 x{selectedBagItem.count}</div>}
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',textAlign:'center',background:'rgba(255,255,255,0.04)',padding:'12px 14px',borderRadius:'12px',width:'100%',lineHeight:'1.6',marginBottom:'16px',border:'1px solid rgba(255,255,255,0.04)'}}>{selectedBagItem.desc}</div>
              {selectedBagItem.category === 'fruit' && (
                <div style={{width:'100%',marginBottom:'14px'}}>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'8px',fontWeight:'600'}}>装备到精灵:</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {party.map((pet,pi)=>(
                      <button key={pi} onClick={()=>{
                        if (pet.devilFruit===selectedBagItem.id){setParty(prev=>prev.map((pp,i)=>i===pi?{...pp,devilFruit:null}:pp));setFruitInventory(prev=>[...prev,selectedBagItem.id]);alert(`已从 ${pet.name} 卸下 ${selectedBagItem.name}`);}
                        else{if(pet.devilFruit)setFruitInventory(prev=>[...prev,pet.devilFruit]);const idx=fruitInventory.indexOf(selectedBagItem.id);if(idx===-1){alert('果实不足');return;}setFruitInventory(prev=>{const n=[...prev];n.splice(idx,1);return n;});setParty(prev=>prev.map((pp,i)=>i===pi?{...pp,devilFruit:selectedBagItem.id}:pp));alert(`已将 ${selectedBagItem.name} 装备给 ${pet.name}`);}
                        setSelectedBagItem(null);
                      }} style={{padding:'6px 10px',borderRadius:'8px',fontSize:'10px',cursor:'pointer',fontWeight:'600',
                        border:pet.devilFruit===selectedBagItem.id?'1px solid #4CAF50':'1px solid rgba(255,255,255,0.1)',
                        background:pet.devilFruit===selectedBagItem.id?'rgba(76,175,80,0.15)':'rgba(255,255,255,0.05)',
                        color:pet.devilFruit===selectedBagItem.id?'#4CAF50':'rgba(255,255,255,0.6)',
                      }}>
                        {pet.name} Lv.{pet.level} {pet.devilFruit===selectedBagItem.id?'✓卸下':pet.devilFruit?'↻替换':''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{display:'flex',gap:'10px',width:'100%'}}>
                <button onClick={()=>setSelectedBagItem(null)} style={{flex:1,padding:'11px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',borderRadius:'12px',cursor:'pointer',color:'rgba(255,255,255,0.6)',fontWeight:'600',fontSize:'12px'}}>关闭</button>
                {['meds','tm','growth','acc','stone','cursed'].includes(selectedBagItem.category) && (
                  <button onClick={handleUseBtn} style={{flex:1,padding:'11px',border:'none',background:`linear-gradient(135deg,${activeTab.color},${activeTab.color}cc)`,borderRadius:'12px',fontWeight:'700',color:'#fff',cursor:'pointer',fontSize:'12px',boxShadow:`0 4px 12px ${activeTab.color}40`}}>使用</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // [新增] 核心评级算法
  // ==========================================
  const calculateGrade = (pet) => {
    if (!pet) return { grade: 'B', score: 0, leftAvg: 0, rightAvg: 0 };

    // 1. 获取基础种族值
    const baseInfo = POKEDEX.find(p => p.id === pet.id) || POKEDEX[0];
    const bias = TYPE_BIAS[baseInfo.type] || { p: 1.0, s: 1.0 };
    const diversity = (baseInfo.id % 5) * 2 - 4;
    
    // 辅助：计算某项属性的种族值
    const getBase = (k) => {
        if (k === 'hp') return baseInfo.hp || 60;
        if (k === 'spd') return baseInfo.spd || (40 + (baseInfo.id * 7 % 70));
        const bAtk = baseInfo.atk || 50;
        const bDef = baseInfo.def || 50;
        if (k === 'p_atk') return Math.floor(bAtk * bias.p) + diversity;
        if (k === 'p_def') return Math.floor(bDef * bias.p);
        if (k === 's_atk') return Math.floor(bAtk * bias.s) - diversity;
        if (k === 's_def') return Math.floor(bDef * bias.s);
        return 50;
    };

    const keys = ['hp', 'p_atk', 'p_def', 's_atk', 's_def', 'spd'];
    const currentStats = getStats(pet);
    const growth = 1 + pet.level * 0.05;

    let totalLeftPct = 0;
    let totalRightPct = 0;

    keys.forEach(key => {
        // --- 左侧：当前能力对比 ---
        // 分母：同等级、满IV(31)、性格修正1.0(不考虑性格) 的理论数值
        // 公式：(种族值 + 31) * 成长系数
        let maxStat = (getBase(key) + 31) * growth;
        if (key === 'hp') maxStat = maxStat * 2.5;
        
        // 实际数值
        const currStat = key === 'hp' ? currentStats.maxHp : currentStats[key];
        
        // 计算百分比 (上限100%，超过算100%)
        totalLeftPct += Math.min(1, currStat / maxStat);

        // --- 右侧：潜力(IV)对比 ---
        // 分母：31
        const iv = pet.ivs?.[key === 'hp' ? 'hp' : key] || 0;
        totalRightPct += iv / 31;
    });

    const leftAvg = (totalLeftPct / 6) * 100;
    const rightAvg = (totalRightPct / 6) * 100;
    
    // 综合评分：左右两边取平均
    const finalScore = (leftAvg + rightAvg) / 2;

    // ▼▼▼ 修改评级判定逻辑 ▼▼▼
    let grade = 'C'; // 默认为 C
    if (finalScore >= 80) grade = 'S';
    else if (finalScore >= 50) grade = 'A';
    else if (finalScore >= 30) grade = 'B';
    // 低于 30 保持 C
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    return { grade, score: finalScore, leftAvg, rightAvg };
  };

 
  // ==========================================
  // 3. [优化] 饰品弹窗 (图5修复 - 小巧版)
  // ==========================================
  const renderEquipModal = () => {
    if (!equipModalOpen) return null;
    const { petIdx, slotIdx } = targetEquipSlot;
    const pet = party[petIdx];
    const currentEquipId = pet.equips ? pet.equips[slotIdx] : null;
    const uniqueAccessories = _.uniq(accessories);
    return (
      <div className="modal-overlay" onClick={() => setEquipModalOpen(false)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001}}>
        <div onClick={e => e.stopPropagation()} style={{width: '360px', maxHeight: '500px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          <div style={{padding: '15px', background: '#673AB7', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div style={{fontWeight: 'bold'}}>装备饰品</div><button onClick={() => setEquipModalOpen(false)} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>✕</button></div>
          <div style={{padding: '15px', overflowY: 'auto', flex: 1}}>
             <div style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>正在为 <b>{pet.name}</b> 的第 {slotIdx + 1} 个槽位选择饰品：</div>
             {currentEquipId && (<button onClick={handleUnequip} style={{width: '100%', padding: '10px', marginBottom: '15px', background: '#FFEBEE', color: '#D32F2F', border: '1px solid #FFCDD2', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>卸下当前饰品</button>)}
             <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {uniqueAccessories.length === 0 ? (<div style={{textAlign: 'center', color: '#999', padding: '20px'}}>背包里没有饰品</div>) : (
                    <>
                    {_.uniq(accessories.filter(a => typeof a === 'string')).map((accId, idx) => {
                        const acc = ACCESSORY_DB.find(a => a.id === accId);
                        const count = accessories.filter(id => id === accId).length;
                        if (!acc) return null;
                        return (<div key={`static-${idx}`} onClick={() => handleEquipAccessory(accId)} style={{display: 'flex', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '8px', cursor: 'pointer', border: '1px solid #eee'}}><div style={{fontSize: '20px', marginRight: '10px'}}>{acc.icon}</div><div style={{flex: 1}}><div style={{fontSize: '13px', fontWeight: 'bold'}}>{acc.name}</div><div style={{fontSize: '10px', color: '#666'}}>{acc.desc}</div></div><div style={{fontSize: '11px', fontWeight: 'bold', color: '#673AB7'}}>x{count}</div></div>);
                    })}
                    {accessories.filter(a => typeof a === 'object').map((equip, idx) => (
                        <div key={`unique-${equip.uid}`} onClick={() => handleEquipAccessory(equip)} style={{display: 'flex', alignItems: 'center', padding: '10px', background: '#F3E5F5', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E1BEE7'}}><div style={{fontSize: '20px', marginRight: '10px'}}>{equip.icon}</div><div style={{flex: 1}}><div style={{fontSize: '13px', fontWeight: 'bold', color: '#6A1B9A'}}>{equip.displayName}</div><div style={{fontSize: '10px', color: '#666'}}>技能: {equip.extraSkill.name}</div></div></div>
                    ))}
                    </>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };


  const getTrainerConfig = () => {
    if (!battle.isTrainer && !battle.isGym && !battle.isChallenge) return null;

    let avatar = getNpcSprite(battle.trainerName, battle);
    let title = '路过的训练家';

    if (battle.isGym) {
      switch (battle.mapId) {
        case 1: title = '草系馆主 莉佳'; break; 
        case 2: title = '水系馆主 小霞'; break; 
        case 3: title = '火系馆主 夏伯'; break; 
        case 4: title = '电系馆主 马志士'; break; 
        case 5: title = '格斗馆主 阿四'; break; 
        default: title = '道馆馆主'; break;
      }
    } else if (battle.isChallenge) {
      title = '挑战塔主';
    }

    return { avatar, title };
  };
  // ==========================================
  // [补全] 缺失的队伍状态指示器函数
  // ==========================================
  const renderPartyIndicators = (targetParty, isPlayer) => {
    return (
      <div className="party-indicators">
        {/* 渲染现有队伍的状态 */}
        {targetParty.map((p, i) => (
          <div 
            key={i} 
            className={`party-ball ${p.currentHp > 0 ? 'alive' : 'fainted'}`}
          />
        ))}
        {/* 补齐 6 个球的空位 (显示为灰色) */}
        {[...Array(6 - targetParty.length)].map((_, i) => (
           <div key={`empty-${i}`} className="party-ball" style={{background:'#ddd', opacity:0.3}}></div>
        ))}
      </div>
    );
  };
  // ==========================================
  // [新增] 闪光特效组件 (渲染一圈炸开的星星)
  // ==========================================
  const RenderShinyStars = () => {
    // 定义8颗星星的方向 (x, y)
    const stars = [
      { x: '0px', y: '-60px', color: '#FFD700', delay: '0s' },   // 上
      { x: '40px', y: '-40px', color: '#00E676', delay: '0.1s' }, // 右上
      { x: '60px', y: '0px',   color: '#29B6F6', delay: '0.2s' }, // 右
      { x: '40px', y: '40px',  color: '#FFD700', delay: '0s' },   // 右下
      { x: '0px', y: '60px',   color: '#AB47BC', delay: '0.1s' }, // 下
      { x: '-40px', y: '40px', color: '#29B6F6', delay: '0.2s' }, // 左下
      { x: '-60px', y: '0px',  color: '#FFD700', delay: '0s' },   // 左
      { x: '-40px', y: '-40px',color: '#FF5252', delay: '0.1s' }, // 左上
    ];

    return (
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, display:'flex', alignItems:'center', justifyContent:'center'}}>
        {/* 拟声词 */}
        <div style={{
            position:'absolute', top:'-40px', fontSize:'24px', fontWeight:'900', 
            color:'#FFD700', textShadow:'0 0 5px #000', fontStyle:'italic',
            animation: 'shiny-text-pop 1s ease-out forwards'
        }}>
            SHING! ✨
        </div>

        {/* 炸开的星星 */}
        {stars.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: '24px',
            color: s.color,
            '--tx': s.x,
            '--ty': s.y,
            animation: `shiny-star-explode 0.8s ease-out forwards`,
            animationDelay: s.delay,
            filter: 'drop-shadow(0 0 2px white)'
          }}>
            ✨
          </div>
        ))}
      </div>
    );
  };

   // ==========================================
  // [精致小巧版] 战斗界面 (含环境特效 + 完整UI + 修复布局)
  // ==========================================
  const renderBattle = () => {
    if (!battle) return null;
    
    const p = battle.playerCombatStates?.[battle.activeIdx];
    const e = battle.enemyParty?.[battle.enemyActiveIdx];
    if (!p || !e) return null;
    const pStats = getStats(p);
    const eStats = getStats(e);
    
    // --- 辅助函数 ---
    const renderStatusBadges = (unit) => {
        const badges = [];
        const badgeBase = { color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px', marginLeft: '3px', fontWeight: 'bold', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '2px' };
        const statusConfig = { BRN: { text: '灼伤', bg: '#FF5722' }, PSN: { text: '中毒', bg: '#9C27B0' }, PAR: { text: '麻痹', bg: '#FFC107', color: '#000' }, SLP: { text: '睡眠', bg: '#90A4AE' }, FRZ: { text: '冰冻', bg: '#03A9F4' } };
        if (unit.status && statusConfig[unit.status]) { const cfg = statusConfig[unit.status]; badges.push(<span key="main" style={{...badgeBase, background: cfg.bg, color: cfg.color || '#fff'}}>{cfg.text}</span>); }
        if (unit.volatiles && unit.volatiles.confused) { badges.push(<span key="confused" style={{...badgeBase, background: '#E91E63'}}>混乱</span>); }

        if (unit.activeVow && unit.activeVow.turnsLeft > 0) {
            const vowStyle = {
                'vow_power':   { bg: 'linear-gradient(135deg,#D32F2F,#FF5722)', icon: '🔥' },
                'vow_reveal':  { bg: 'linear-gradient(135deg,#1565C0,#42A5F5)', icon: '📖' },
                'vow_restrict': { bg: 'linear-gradient(135deg,#F9A825,#FFD54F)', icon: '🛡️' },
                'vow_burn':    { bg: 'linear-gradient(135deg,#E65100,#FF9800)', icon: '💥' },
                'vow_speed':   { bg: 'linear-gradient(135deg,#00838F,#26C6DA)', icon: '⚡' },
            };
            const vs = vowStyle[unit.activeVow.id] || { bg: '#555', icon: '📜' };
            badges.push(<span key="vow" style={{...badgeBase, background: vs.bg, boxShadow: '0 0 6px rgba(255,255,255,0.3)', animation: 'vow-pulse 2s infinite'}}>{vs.icon}{unit.activeVow.name}</span>);
        }

        if (unit.fruitTransformed && unit.fruitTurnsLeft > 0) {
            badges.push(<span key="fruit-active" style={{...badgeBase, background: 'linear-gradient(135deg,#6A1B9A,#AB47BC)', boxShadow: '0 0 8px rgba(171,71,188,0.5)', animation: 'vow-pulse 1.5s infinite'}}>🍎变身中({unit.fruitTurnsLeft})</span>);
        }

        return badges;
    };

    // 🔥 门派徽章渲染函数 (胶囊样式 + 点击弹出详情)
    const renderSectBadge = (pet, side) => {
        const s = SECT_DB[pet.sectId || 1];
        const lv = pet.sectLevel || 1; 
        const effectText = s.effect ? s.effect(lv) : s.desc;
        const tooltipKey = `${side}_sect`;

        return (
            <div 
                style={{position: 'relative', display: 'inline-block', marginLeft: '4px', cursor: 'pointer', zIndex: 20}}
                onClick={(e) => { e.stopPropagation(); setBattleTooltip(prev => prev === tooltipKey ? null : tooltipKey); }}
            >
                <div style={{
                    display:'inline-flex', alignItems:'center', gap:'3px',
                    background: `linear-gradient(90deg, ${s.color}, #333)`,
                    padding:'1px 6px 1px 2px', borderRadius:'12px', 
                    border:'1px solid rgba(255,255,255,0.3)', 
                    boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
                    color:'#fff', fontSize:'10px', fontWeight:'bold', whiteSpace: 'nowrap'
                }}>
                    <div style={{width:'14px', height:'14px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#000', lineHeight:1}}>{s.icon}</div>
                    <span style={{textShadow:'0 1px 1px rgba(0,0,0,0.5)'}}>{s.name} <span style={{opacity:0.8, fontSize:'9px'}}>Lv.{lv}</span></span>
                </div>
            </div>
        );
    };

    const renderSectTooltipOverlay = () => {
        if (!battleTooltip || !battleTooltip.endsWith('_sect')) return null;
        const side = battleTooltip.replace('_sect', '');
        const pet = side === 'player' 
            ? battle.playerCombatStates?.[battle.activeIdx]
            : battle.enemyParty?.[battle.enemyActiveIdx];
        if (!pet) return null;
        const s = SECT_DB[pet.sectId || 1];
        const lv = pet.sectLevel || 1;
        const effectText = s.effect ? s.effect(lv) : s.desc;
        return (
            <div onClick={() => setBattleTooltip(null)} style={{
                position:'fixed', inset:0, zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(0,0,0,0.4)', backdropFilter:'blur(3px)'
            }}>
                <div onClick={e => e.stopPropagation()} style={{
                    width:'280px', background:'rgba(15,15,25,0.97)', backdropFilter:'blur(12px)',
                    color:'#fff', padding:'20px', borderRadius:'16px', fontSize:'12px',
                    textAlign:'left', border:`1.5px solid ${s.color}`,
                    boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${s.color}30`
                }}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px', paddingBottom:'10px', borderBottom:`1px solid ${s.color}30`}}>
                        <div style={{width:'32px', height:'32px', borderRadius:'50%', background:`linear-gradient(135deg, ${s.color}, ${s.color}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:'#fff', fontWeight:'900'}}>{s.icon}</div>
                        <div>
                            <div style={{fontSize:'15px', fontWeight:'800', color:s.color}}>{s.name}心法</div>
                            <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)'}}>当前境界: 第{lv}层</div>
                        </div>
                    </div>
                    <div style={{lineHeight:'1.7', color:'#ddd', fontSize:'11px'}}>{effectText}</div>
                    <button onClick={() => setBattleTooltip(null)} style={{
                        width:'100%', marginTop:'12px', padding:'8px', borderRadius:'8px', border:'none',
                        background:`${s.color}20`, color:s.color, fontSize:'12px', fontWeight:'700', cursor:'pointer'
                    }}>关闭</button>
                </div>
            </div>
        );
    };

    const getHpColor = (current, max) => { const pct = (current / max) * 100; if (pct > 50) return '#4CAF50'; if (pct > 20) return '#FFC107'; return '#FF5252'; };
    
    const renderPartyIndicators = (team) => {
        if (!team || !Array.isArray(team)) return null;
        const total = team.length;
        const alive = team.filter(m => m && m.currentHp > 0).length;
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', background:'rgba(0,0,0,0.05)', padding:'4px 8px', borderRadius:'6px'}}>
                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#555', display:'flex', alignItems:'center', gap:'4px'}}>
                    <span style={{fontSize:'8px'}}>🥎</span> <span>{alive} / {total}</span>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                    {team.map((m, i) => (
                        <div key={i} style={{width: '8px', height: '8px', borderRadius: '50%', background: m.currentHp > 0 ? '#FF5252' : '#555', border: '1px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', opacity: m.currentHp > 0 ? 1 : 0.5}} />
                    ))}
                    {[...Array(6 - total)].map((_, i) => <div key={`empty-${i}`} style={{width: '8px', height: '8px', borderRadius: '50%', border: '1px dashed #ccc'}} />)}
                </div>
            </div>
        );
    };

    const VFX_MAP = {
      NORMAL:'vfx-normal', FIRE:'vfx-fire', WATER:'vfx-water', GRASS:'vfx-grass',
      ELECTRIC:'vfx-electric', ICE:'vfx-ice', FIGHT:'vfx-fight', POISON:'vfx-poison',
      GROUND:'vfx-ground', FLYING:'vfx-flying', PSYCHIC:'vfx-psychic', BUG:'vfx-bug',
      ROCK:'vfx-rock', GHOST:'vfx-ghost', DRAGON:'vfx-dragon', STEEL:'vfx-steel',
      FAIRY:'vfx-fairy', DARK:'vfx-dark', GOD:'vfx-god',
      HEAL:'vfx-heal', BUFF:'vfx-heal', DEBUFF:'vfx-fire',
      PROTECT:'vfx-steel', SLEEP:'vfx-psychic', PARALYSIS:'vfx-electric',
      FREEZE:'vfx-ice', CONFUSION:'vfx-psychic',
      THROW_BALL:'vfx-normal', CATCH_SUCCESS:'vfx-fairy',
      LEVEL_UP:'vfx-god', EVOLUTION:'vfx-god', DOMAIN:'vfx-dragon',
      TRANSFORM:'vfx-transform'
    };

    const renderEnhancedVfx = (type, target) => {
      if (!type) return null;
      const cls = VFX_MAP[type] || 'vfx-normal';

      const screenFlash = {
        FIRE:'rgba(255,107,53,0.25)', WATER:'rgba(79,195,247,0.2)', ELECTRIC:'rgba(255,214,0,0.35)',
        ICE:'rgba(179,229,252,0.25)', DRAGON:'rgba(255,180,0,0.3)', PSYCHIC:'rgba(244,143,177,0.2)',
        GHOST:'rgba(126,87,194,0.25)', GOD:'rgba(255,213,79,0.35)', DOMAIN:'rgba(255,213,79,0.3)',
        FIGHT:'rgba(255,112,67,0.2)', FAIRY:'rgba(248,187,208,0.2)',
      }[type];

      const pos = {
        top: target === 'enemy' ? '30%' : '50%',
        left: target === 'enemy' ? '60%' : '40%'
      };

      const mkSparks = (n, distMin, distMax, szMin, szMax) => {
        const out = [];
        for (let i = 0; i < n; i++) {
          const a = (360/n)*i + Math.random()*25;
          const d = distMin + Math.random()*(distMax-distMin);
          out.push(<div key={`s${i}`} className="vfx-spark" style={{
            '--tx':`${Math.cos(a*Math.PI/180)*d}px`, '--ty':`${Math.sin(a*Math.PI/180)*d}px`,
            '--sz':`${szMin+Math.random()*(szMax-szMin)}px`, '--d':`${i*0.04}s`
          }}/>);
        }
        return out;
      };
      const mkRays = (n) => Array.from({length:n},(_,i)=>(
        <div key={`r${i}`} className="vfx-ray" style={{transform:`rotate(${(360/n)*i}deg)`, animationDelay:`${i*0.03}s`}}/>
      ));
      const mkRings = (n) => Array.from({length:n},(_,i)=>(
        <div key={`rn${i}`} className="vfx-ring" style={{animationDelay:`${i*0.12}s`}}/>
      ));

      let inner;
      switch(type) {
        case 'FIRE': {
          const flames = Array.from({length:14},(_,i)=>{
            const x = -40+Math.random()*80; const sz = 8+Math.random()*16;
            return <div key={`fl${i}`} className="vfx-flame" style={{'--fx':`${x}px`,'--fsz':`${sz}px`,'--fd':`${i*0.06}s`}}/>;
          });
          inner = <>{flames}<div className="vfx-core"/>{mkRings(2)}<div className="vfx-sparks">{mkSparks(12,50,100,4,10)}</div></>;
          break;
        }
        case 'WATER': {
          const ripples = Array.from({length:5},(_,i)=>(
            <div key={`wp${i}`} className="vfx-ripple" style={{animationDelay:`${i*0.15}s`}}/>
          ));
          const drops = Array.from({length:10},(_,i)=>{
            const x = -60+Math.random()*120;
            return <div key={`wd${i}`} className="vfx-waterdrop" style={{'--wx':`${x}px`,'--wd':`${i*0.05}s`}}/>;
          });
          inner = <>{ripples}{drops}<div className="vfx-core"/></>;
          break;
        }
        case 'GRASS': {
          const leaves = Array.from({length:12},(_,i)=>{
            const a = (360/12)*i; const d = 40+Math.random()*70;
            return <div key={`lf${i}`} className="vfx-leaf" style={{
              '--lx':`${Math.cos(a*Math.PI/180)*d}px`,'--ly':`${Math.sin(a*Math.PI/180)*d}px`,
              '--lr':`${Math.random()*360}deg`,'--ld':`${i*0.06}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{mkRings(2)}{leaves}<div className="vfx-trail"/></>;
          break;
        }
        case 'ELECTRIC': {
          const bolts = Array.from({length:6},(_,i)=>{
            const a = (360/6)*i;
            return <div key={`bl${i}`} className="vfx-bolt" style={{transform:`rotate(${a}deg)`,'--bd':`${i*0.08}s`}}/>;
          });
          inner = <>{bolts}<div className="vfx-core"/><div className="vfx-sparks">{mkSparks(16,30,110,3,7)}</div></>;
          break;
        }
        case 'ICE': {
          const crystals = Array.from({length:8},(_,i)=>{
            const a = (360/8)*i; const d = 30+Math.random()*50;
            return <div key={`ic${i}`} className="vfx-crystal" style={{
              '--cx':`${Math.cos(a*Math.PI/180)*d}px`,'--cy':`${Math.sin(a*Math.PI/180)*d}px`,
              '--cr':`${a}deg`,'--cd':`${i*0.07}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{crystals}{mkRings(3)}<div className="vfx-frost-overlay"/></>;
          break;
        }
        case 'FIGHT': {
          const impacts = Array.from({length:3},(_,i)=>(
            <div key={`im${i}`} className="vfx-impact-burst" style={{animationDelay:`${i*0.15}s`,'--isc':`${1+i*0.5}`}}/>
          ));
          inner = <><div className="vfx-core"/>{impacts}<div className="vfx-sparks">{mkSparks(14,40,90,6,12)}</div><div className="vfx-rays">{mkRays(12)}</div></>;
          break;
        }
        case 'DRAGON': {
          const spirals = Array.from({length:10},(_,i)=>{
            const a = (360/10)*i;
            return <div key={`ds${i}`} className="vfx-spiral" style={{
              '--sa':`${a}deg`,'--sd':`${i*0.05}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{mkRings(3)}<div className="vfx-rays">{mkRays(10)}</div>{spirals}<div className="vfx-sparks">{mkSparks(14,50,120,5,10)}</div></>;
          break;
        }
        case 'GHOST': {
          const wisps = Array.from({length:6},(_,i)=>{
            const a = (360/6)*i; const d = 40+Math.random()*40;
            return <div key={`wi${i}`} className="vfx-wisp" style={{
              '--wx':`${Math.cos(a*Math.PI/180)*d}px`,'--wy':`${Math.sin(a*Math.PI/180)*d}px`,
              '--wd':`${i*0.12}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{wisps}<div className="vfx-shadow-pulse"/></>;
          break;
        }
        case 'PSYCHIC': {
          const orbits = Array.from({length:6},(_,i)=>(
            <div key={`po${i}`} className="vfx-psy-orbit" style={{'--pa':`${(360/6)*i}deg`,'--pd':`${i*0.1}s`}}/>
          ));
          inner = <><div className="vfx-core"/>{mkRings(3)}{orbits}<div className="vfx-psy-wave"/></>;
          break;
        }
        case 'POISON': {
          const bubbles = Array.from({length:10},(_,i)=>{
            const x = -50+Math.random()*100; const sz = 6+Math.random()*14;
            return <div key={`pb${i}`} className="vfx-poison-bubble" style={{
              '--bx':`${x}px`,'--bsz':`${sz}px`,'--bd':`${i*0.08}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{bubbles}<div className="vfx-toxic-mist"/></>;
          break;
        }
        case 'FAIRY': {
          const stars = Array.from({length:12},(_,i)=>{
            const a = (360/12)*i; const d = 30+Math.random()*70;
            return <div key={`fs${i}`} className="vfx-fairy-star" style={{
              '--fx':`${Math.cos(a*Math.PI/180)*d}px`,'--fy':`${Math.sin(a*Math.PI/180)*d}px`,
              '--fr':`${Math.random()*360}deg`,'--fd':`${i*0.06}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{mkRings(2)}{stars}</>;
          break;
        }
        case 'HEAL': case 'BUFF': {
          const hearts = Array.from({length:8},(_,i)=>{
            const x = -40+Math.random()*80;
            return <div key={`hh${i}`} className="vfx-heal-particle" style={{
              '--hx':`${x}px`,'--hd':`${i*0.1}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{hearts}{mkRings(2)}<div className="vfx-heal-aura"/></>;
          break;
        }
        case 'GROUND': {
          const debris = Array.from({length:10},(_,i)=>{
            const x = -60+Math.random()*120; const sz = 6+Math.random()*12;
            return <div key={`gd${i}`} className="vfx-debris" style={{'--dx':`${x}px`,'--dsz':`${sz}px`,'--dd':`${i*0.05}s`}}/>;
          });
          inner = <><div className="vfx-core"/><div className="vfx-quake-line"/>{debris}{mkRings(2)}</>;
          break;
        }
        case 'ROCK': {
          const rocks = Array.from({length:8},(_,i)=>{
            const a = (360/8)*i; const d = 30+Math.random()*50; const sz = 8+Math.random()*14;
            return <div key={`rk${i}`} className="vfx-rock-shard" style={{
              '--rx':`${Math.cos(a*Math.PI/180)*d}px`,'--ry':`${Math.sin(a*Math.PI/180)*d}px`,
              '--rsz':`${sz}px`,'--rd':`${i*0.05}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{rocks}<div className="vfx-sparks">{mkSparks(8,40,80,6,10)}</div></>;
          break;
        }
        case 'FLYING': {
          const gusts = Array.from({length:5},(_,i)=>(
            <div key={`gw${i}`} className="vfx-gust" style={{animationDelay:`${i*0.12}s`,'--gy':`${-20+i*10}px`}}/>
          ));
          inner = <><div className="vfx-core"/>{gusts}<div className="vfx-sparks">{mkSparks(8,40,90,3,6)}</div></>;
          break;
        }
        case 'STEEL': {
          const shards = Array.from({length:8},(_,i)=>{
            const a = (360/8)*i; const d = 40+Math.random()*50;
            return <div key={`ss${i}`} className="vfx-steel-shard" style={{
              '--sx':`${Math.cos(a*Math.PI/180)*d}px`,'--sy':`${Math.sin(a*Math.PI/180)*d}px`,
              '--sr':`${a}deg`,'--sd':`${i*0.06}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{mkRings(3)}{shards}</>;
          break;
        }
        case 'DARK': {
          const shadows = Array.from({length:8},(_,i)=>{
            const a = (360/8)*i; const d = 30+Math.random()*50;
            return <div key={`dk${i}`} className="vfx-dark-tendril" style={{
              '--dtx':`${Math.cos(a*Math.PI/180)*d}px`,'--dty':`${Math.sin(a*Math.PI/180)*d}px`,
              '--dtd':`${i*0.08}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/><div className="vfx-dark-vortex"/>{shadows}</>;
          break;
        }
        case 'BUG': {
          const bugs = Array.from({length:10},(_,i)=>{
            const a = (360/10)*i; const d = 35+Math.random()*55;
            return <div key={`bg${i}`} className="vfx-bug-mote" style={{
              '--bx':`${Math.cos(a*Math.PI/180)*d}px`,'--by':`${Math.sin(a*Math.PI/180)*d}px`,
              '--bd':`${i*0.06}s`
            }}/>;
          });
          inner = <><div className="vfx-core"/>{bugs}{mkRings(2)}</>;
          break;
        }
        case 'GOD': case 'EVOLUTION': case 'LEVEL_UP': case 'DOMAIN': {
          const godRays = Array.from({length:16},(_,i)=>(
            <div key={`gr${i}`} className="vfx-ray" style={{transform:`rotate(${(360/16)*i}deg)`,animationDelay:`${i*0.02}s`}}/>
          ));
          inner = <><div className="vfx-core"/>{mkRings(4)}<div className="vfx-rays">{godRays}</div><div className="vfx-sparks">{mkSparks(18,40,130,4,10)}</div></>;
          break;
        }
        case 'TRANSFORM': {
          const spirals = Array.from({length:12},(_,i)=>(
            <div key={`ts${i}`} className="vfx-spiral" style={{animationDelay:`${i*0.08}s`, transform:`rotate(${(360/12)*i}deg) translateX(60px)`}}/>
          ));
          inner = <><div className="vfx-core" style={{background:'radial-gradient(circle, #FF6F00, #D32F2F)', width:60,height:60}}/>{mkRings(3)}{spirals}<div className="vfx-sparks">{mkSparks(16,50,120,5,10)}</div></>;
          break;
        }
        default: {
          inner = <><div className="vfx-core"/>{mkRings(3)}<div className="vfx-rays">{mkRays(8)}</div><div className="vfx-sparks">{mkSparks(10,50,100,4,8)}</div><div className="vfx-trail"/></>;
          break;
        }
      }
      
      return (
        <>
          {screenFlash && <div className="vfx-screen-flash" style={{background: screenFlash}} />}
          <div className={`vfx-impact-container ${cls}`} style={{
            position:'absolute', ...pos,
            transform:'translate(-50%,-50%)',
            zIndex:100, pointerEvents:'none'
          }}>
            {inner}
          </div>
        </>
      );
    };
    const getTrainerAvatar = (name) => {
      const spriteUrl = getNpcSprite(name, battle);
      return <img src={spriteUrl} alt="" style={{width:'100%', height:'100%', objectFit:'contain'}} onError={e => { e.target.style.display='none'; }} />;
    };
    
    let bgClass = 'bg-grass'; 
    if (battle.isGym) bgClass = 'bg-city'; else if (battle.isChallenge) bgClass = 'bg-cave'; 
    else { const mapInfo = MAPS.find(m => m.id === battle.mapId); if (mapInfo) { switch (mapInfo.type) { case 'water': bgClass = 'bg-water'; break; case 'fire': bgClass = 'bg-fire'; break; case 'ice': bgClass = 'bg-water'; break; case 'mountain': case 'rock': case 'ground': bgClass = 'bg-cave'; break; case 'city': case 'steel': case 'electric': bgClass = 'bg-city'; break; case 'ghost': case 'factory': case 'space': bgClass = 'bg-cave'; break; default: bgClass = 'bg-grass'; break; } } }

    // 交换精灵弹窗
    if (battle.showSwitch) {
      return (
        <div className="screen battle-screen">
            <div className="modal-overlay" style={{background:'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex:200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '500px', background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#333'}}>选择出战伙伴</div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                        {(battle.playerCombatStates || []).map((pet, idx) => {
                            const maxHp = getStats(pet).maxHp;
                            const isFainted = pet.currentHp <= 0;
                            const isActive = idx === battle.activeIdx;
                            return (
                                <div key={idx} onClick={() => { if(!isActive && !isFainted) switchPokemon(idx); }}
                                     style={{background: isActive ? '#E3F2FD' : '#f5f7fa', border: isActive ? '2px solid #2196F3' : '2px solid transparent', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', cursor: (isActive || isFainted) ? 'default' : 'pointer', opacity: isFainted ? 0.6 : 1, position: 'relative', transition: '0.2s'}}
                                     onMouseOver={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#fff'; }}
                                     onMouseOut={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#f5f7fa'; }}
                                >
                                    <div style={{width: '48px', height: '48px', marginRight: '10px', filter: isFainted ? 'grayscale(1)' : pet.isFusedShiny ? 'drop-shadow(0 0 4px rgba(213,0,249,0.5)) hue-rotate(150deg)' : pet.isShiny ? 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' : 'none'}}>{renderAvatar(pet)}</div>
                                    <div style={{flex: 1}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#333'}}><span>{pet.name} {pet.isFusedShiny ? <span style={{color:'#D500F9',fontSize:'10px'}}>🧬</span> : pet.isShiny ? <span style={{color:'#FFD700',fontSize:'10px'}}>✨</span> : null}</span><span style={{fontSize: '11px', color: '#666'}}>Lv.{pet.level}</span></div>
                                        <div style={{height: '6px', background: '#ddd', borderRadius: '3px', marginTop: '6px', overflow: 'hidden'}}><div style={{width: `${(pet.currentHp/maxHp)*100}%`, background: getHpColor(pet.currentHp, maxHp), height: '100%', transition: 'width 0.3s'}}></div></div>
                                        <div style={{fontSize: '10px', color: '#999', marginTop: '2px', textAlign: 'right'}}>{Math.floor(pet.currentHp)}/{maxHp}</div>
                                    </div>
                                    {isActive && <div style={{position: 'absolute', top: '5px', right: '5px', fontSize: '10px', background: '#2196F3', color: '#fff', padding: '2px 6px', borderRadius: '4px'}}>当前</div>}
                                    {isFainted && <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5252', fontWeight: 'bold', fontSize: '14px'}}>濒死</div>}
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => setBattle(prev => ({...prev, showSwitch: false}))} style={{width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#f0f0f0', color: '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s'}} onMouseOver={e => e.target.style.background='#e0e0e0'} onMouseOut={e => e.target.style.background='#f0f0f0'}>取消</button>
                </div>
            </div>
        </div>
      )
    }

    // 战斗主场景
    return (
      <div className="screen battle-screen">
        {renderEnvironmentOverlay()}
        {battle.activeDomain && (
            <div style={{
                position:'absolute', top:0, left:0, right:0, bottom:0,
                background: battle.activeDomain.ownerSide === 'player'
                    ? 'radial-gradient(ellipse at center, rgba(123,31,162,0.15) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at center, rgba(183,28,28,0.15) 0%, transparent 70%)',
                zIndex:5, pointerEvents:'none',
                animation: 'pulse 2s ease-in-out infinite',
            }}>
                <div style={{position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)',
                    background:'rgba(0,0,0,0.7)', color:'#E040FB', padding:'4px 16px', borderRadius:'20px',
                    fontSize:'12px', fontWeight:'bold', border:'1px solid #E040FB', backdropFilter:'blur(4px)',
                    pointerEvents:'auto', zIndex:10}}>
                    🌀 {battle.activeDomain.name} ({battle.activeDomain.turnsLeft}回合)
                </div>
            </div>
        )}

        <div className={`battle-stage-v2 ${bgClass}`} style={{position:'relative'}}>
            {animEffect?.type === 'BLACKOUT' && <div className="blackout-overlay">眼前一黑...</div>}
            
            <div className="battle-scene-layer" style={{width: '100%', height: '100%', position: 'relative'}}>
                
                {/* ====== 竞技场地面 ====== */}
                <div className="battle-arena-floor" />
                <div className="battle-arena-line" />

                {/* ====== 环境光柱 ====== */}
                {[
                  {l:'8%', w:60, h:'70%', t:0, rot:-4, delay:0},
                  {l:'35%', w:80, h:'80%', t:0, rot:2, delay:2},
                  {l:'65%', w:50, h:'65%', t:0, rot:-1, delay:4},
                  {l:'88%', w:70, h:'75%', t:0, rot:3, delay:1},
                ].map((b,i) => (
                  <div key={`beam${i}`} className="battle-light-beam" style={{
                    left:b.l, top:b.t, width:b.w, height:b.h,
                    animationDelay:`${b.delay}s`, transform:`rotate(${b.rot}deg)`
                  }} />
                ))}

                {/* ====== 远景 - 云朵 + 星光 ====== */}
                <div style={{position:'absolute', top:0, left:0, width:'100%', height:'35%', pointerEvents:'none', zIndex:1, opacity:0.45}}>
                    {[{l:'5%',t:'5%',w:130,h:42,dur:20},{l:'25%',t:'12%',w:100,h:32,dur:25},{l:'50%',t:'4%',w:120,h:38,dur:18},{l:'78%',t:'10%',w:90,h:30,dur:22}].map((c,i) => (
                        <div key={i} style={{position:'absolute', left:c.l, top:c.t, width:c.w, height:c.h,
                            background:'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.6), transparent 70%)',
                            borderRadius:'50%', filter:'blur(4px)',
                            animation:`float ${c.dur}s ease-in-out infinite`, animationDelay:`${i*2}s`
                        }} />
                    ))}
                </div>

                {/* ====== 中景装饰物 (根据地形类型) ====== */}
                {(() => {
                  const terrainDecorations = {
                    'bg-grass': [
                      <div key="tree1" style={{position:'absolute', bottom:'38%', left:'40%', zIndex:3, pointerEvents:'none', opacity:0.5}}>
                        <div style={{width:8, height:35, background:'linear-gradient(180deg, #795548, #5D4037)', borderRadius:'2px', margin:'0 auto'}} />
                        <div style={{width:40, height:30, background:'radial-gradient(ellipse, #66BB6A 40%, #43A047 70%, transparent)', borderRadius:'50%', marginTop:-8, marginLeft:-16}} />
                      </div>,
                      <div key="tree2" style={{position:'absolute', bottom:'42%', right:'38%', zIndex:3, pointerEvents:'none', opacity:0.4, transform:'scale(0.8)'}}>
                        <div style={{width:6, height:28, background:'linear-gradient(180deg, #795548, #5D4037)', borderRadius:'2px', margin:'0 auto'}} />
                        <div style={{width:35, height:25, background:'radial-gradient(ellipse, #81C784 40%, #4CAF50 70%, transparent)', borderRadius:'50%', marginTop:-6, marginLeft:-14}} />
                      </div>,
                      <div key="bush1" className="battle-flora" style={{bottom:'30%', left:'32%', width:20, height:14, background:'radial-gradient(ellipse, rgba(76,175,80,0.6), transparent)', borderRadius:'50%', opacity:0.5}} />,
                      <div key="bush2" className="battle-flora" style={{bottom:'28%', right:'30%', width:16, height:10, background:'radial-gradient(ellipse, rgba(102,187,106,0.5), transparent)', borderRadius:'50%', opacity:0.4}} />,
                      <div key="flower1" className="battle-flora" style={{bottom:'33%', left:'52%', opacity:0.6}}>
                        <div style={{width:6, height:6, background:'#E91E63', borderRadius:'50%', boxShadow:'0 0 4px rgba(233,30,99,0.4)'}} />
                      </div>,
                      <div key="flower2" className="battle-flora" style={{bottom:'36%', left:'60%', opacity:0.5}}>
                        <div style={{width:5, height:5, background:'#FFC107', borderRadius:'50%', boxShadow:'0 0 3px rgba(255,193,7,0.4)'}} />
                      </div>,
                      <div key="rock1" className="battle-rock" style={{bottom:'26%', left:'45%', width:22, height:14, opacity:0.35}} />,
                      <div key="rock2" className="battle-rock" style={{bottom:'32%', right:'42%', width:16, height:10, opacity:0.25, borderRadius:'40% 55% 35% 60%'}} />,
                    ],
                    'bg-fire': [
                      <div key="lava1" className="battle-rock" style={{bottom:'28%', left:'35%', width:30, height:18, opacity:0.4, background:'linear-gradient(145deg, #4E342E, #3E2723)', boxShadow:'inset -2px -3px 4px rgba(0,0,0,0.4), 0 0 10px rgba(255,87,34,0.2)'}} />,
                      <div key="lava2" className="battle-rock" style={{bottom:'34%', right:'35%', width:24, height:14, opacity:0.35, background:'linear-gradient(145deg, #5D4037, #4E342E)', boxShadow:'inset -2px -3px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,152,0,0.15)'}} />,
                      <div key="crack1" style={{position:'absolute', bottom:'25%', left:'42%', width:40, height:2, background:'linear-gradient(90deg, transparent, rgba(255,87,34,0.5), rgba(255,152,0,0.6), rgba(255,87,34,0.5), transparent)', zIndex:3, pointerEvents:'none', filter:'blur(1px)'}} />,
                      <div key="crack2" style={{position:'absolute', bottom:'30%', left:'55%', width:25, height:2, background:'linear-gradient(90deg, transparent, rgba(255,87,34,0.4), transparent)', zIndex:3, pointerEvents:'none', filter:'blur(1px)', transform:'rotate(30deg)'}} />,
                      <div key="glow" style={{position:'absolute', bottom:'20%', left:'48%', width:60, height:30, background:'radial-gradient(ellipse, rgba(255,87,34,0.15), transparent)', zIndex:2, pointerEvents:'none'}} />,
                    ],
                    'bg-water': [
                      <div key="coral1" style={{position:'absolute', bottom:'32%', left:'38%', width:18, height:25, background:'linear-gradient(to top, #E91E63, #F48FB1)', borderRadius:'40% 60% 50% 50%', opacity:0.3, zIndex:3, pointerEvents:'none'}} />,
                      <div key="coral2" style={{position:'absolute', bottom:'28%', right:'36%', width:14, height:20, background:'linear-gradient(to top, #FF9800, #FFCC80)', borderRadius:'50% 40% 60% 50%', opacity:0.25, zIndex:3, pointerEvents:'none'}} />,
                      <div key="seaweed1" style={{position:'absolute', bottom:'26%', left:'50%', width:4, height:30, background:'linear-gradient(to top, #2E7D32, #66BB6A)', borderRadius:'2px', opacity:0.3, zIndex:3, pointerEvents:'none', animation:'float 5s ease-in-out infinite'}} />,
                      <div key="seaweed2" style={{position:'absolute', bottom:'24%', left:'56%', width:3, height:24, background:'linear-gradient(to top, #388E3C, #81C784)', borderRadius:'2px', opacity:0.25, zIndex:3, pointerEvents:'none', animation:'float 7s ease-in-out infinite', animationDelay:'1s'}} />,
                      <div key="caustics" style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.05), transparent 30%), radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.04), transparent 25%)', zIndex:2, pointerEvents:'none', animation:'float 10s ease-in-out infinite'}} />,
                    ],
                    'bg-cave': [
                      <div key="crystal1" style={{position:'absolute', bottom:'32%', left:'40%', zIndex:3, pointerEvents:'none', opacity:0.5}}>
                        <div style={{width:6, height:22, background:'linear-gradient(180deg, #CE93D8, #9C27B0)', borderRadius:'2px 2px 0 0', transform:'rotate(-8deg)', boxShadow:'0 0 8px rgba(156,39,176,0.3)'}} />
                      </div>,
                      <div key="crystal2" style={{position:'absolute', bottom:'30%', left:'44%', zIndex:3, pointerEvents:'none', opacity:0.4}}>
                        <div style={{width:5, height:16, background:'linear-gradient(180deg, #B39DDB, #7B1FA2)', borderRadius:'2px 2px 0 0', transform:'rotate(5deg)', boxShadow:'0 0 6px rgba(123,31,162,0.3)'}} />
                      </div>,
                      <div key="crystal3" style={{position:'absolute', bottom:'35%', right:'38%', zIndex:3, pointerEvents:'none', opacity:0.45}}>
                        <div style={{width:7, height:20, background:'linear-gradient(180deg, #E1BEE7, #AB47BC)', borderRadius:'2px 2px 0 0', transform:'rotate(-3deg)', boxShadow:'0 0 10px rgba(171,71,188,0.4)'}} />
                      </div>,
                      <div key="stalag1" className="battle-rock" style={{bottom:'26%', left:'34%', width:20, height:25, opacity:0.3, background:'linear-gradient(180deg, #616161, #424242)', borderRadius:'30% 30% 50% 50%'}} />,
                      <div key="stalag2" className="battle-rock" style={{bottom:'28%', right:'32%', width:16, height:18, opacity:0.25, background:'linear-gradient(180deg, #757575, #424242)', borderRadius:'35% 40% 45% 50%'}} />,
                    ],
                    'bg-city': [
                      <div key="sign1" style={{position:'absolute', bottom:'35%', left:'42%', zIndex:3, pointerEvents:'none', opacity:0.3}}>
                        <div style={{width:3, height:20, background:'#757575', margin:'0 auto'}} />
                        <div style={{width:20, height:12, background:'linear-gradient(135deg, #42A5F5, #1E88E5)', borderRadius:'2px', marginTop:-1}} />
                      </div>,
                      <div key="cone1" style={{position:'absolute', bottom:'28%', right:'40%', zIndex:3, pointerEvents:'none', opacity:0.25}}>
                        <div style={{width:0, height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderBottom:'16px solid #FF9800', margin:'0 auto'}} />
                        <div style={{width:16, height:3, background:'#FF9800', borderRadius:'1px'}} />
                      </div>,
                      <div key="manhole" style={{position:'absolute', bottom:'24%', left:'50%', width:30, height:8, background:'radial-gradient(ellipse, rgba(100,100,100,0.3), transparent)', borderRadius:'50%', zIndex:3, pointerEvents:'none'}} />,
                    ],
                  };
                  return terrainDecorations[bgClass] || terrainDecorations['bg-grass'] || [];
                })()}

                {/* ====== 环境粒子系统 ====== */}
                {(() => {
                  const particleConfig = {
                    'bg-grass': { cls:'battle-leaf', count:6, colors:['#66BB6A','#43A047','#81C784','#A5D6A7'] },
                    'bg-fire': { cls:'battle-ember', count:8, colors:['#FF5722','#FF9800','#FFC107','#FF6D00'] },
                    'bg-water': { cls:'battle-bubble', count:6, colors:[] },
                    'bg-cave': { cls:'battle-sparkle', count:10, colors:['#CE93D8','#E1BEE7','#AB47BC','#fff'] },
                    'bg-city': { cls:'battle-dust-particle', count:5, colors:['rgba(200,200,200,0.5)','rgba(180,180,180,0.4)'] },
                  };
                  const cfg = particleConfig[bgClass] || particleConfig['bg-grass'];
                  return Array.from({length: cfg.count}, (_, i) => {
                    const left = 15 + Math.random() * 70;
                    const bottom = 15 + Math.random() * 50;
                    const size = 3 + Math.random() * 6;
                    const dur = 4 + Math.random() * 8;
                    const delay = Math.random() * 6;
                    const color = cfg.colors.length > 0 ? cfg.colors[i % cfg.colors.length] : undefined;
                    return <div key={`ptc${i}`} className={cfg.cls} style={{
                      left:`${left}%`, bottom:`${bottom}%`,
                      width: size, height: cfg.cls === 'battle-leaf' ? size * 1.5 : size,
                      animationDuration:`${dur}s`, animationDelay:`${delay}s`,
                      ...(color ? {background: cfg.cls !== 'battle-bubble' ? color : undefined} : {})
                    }} />;
                  });
                })()}

                {/* ====== 中景光点 (通用) ====== */}
                {Array.from({length: 8}, (_, i) => {
                  const left = 20 + Math.random() * 60;
                  const top = 20 + Math.random() * 50;
                  const size = 2 + Math.random() * 3;
                  const dur = 3 + Math.random() * 5;
                  return <div key={`spk${i}`} className="battle-sparkle" style={{
                    left:`${left}%`, top:`${top}%`, width:size, height:size,
                    animationDuration:`${dur}s`, animationDelay:`${i * 0.8}s`
                  }} />;
                })}

                {/* ====== 战场地面 - 渐变色底面 ====== */}
                <div style={{
                    position:'absolute', bottom:0, left:0, width:'100%', height:'45%',
                    background:'linear-gradient(180deg, transparent 0%, rgba(76,175,80,0.12) 20%, rgba(56,142,60,0.25) 100%)',
                    pointerEvents:'none', zIndex:2
                }}>
                    <div style={{position:'absolute', top:0, left:0, width:'100%', height:2,
                        background:'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.3) 50%, transparent 90%)'}} />
                </div>

                {/* ====== 对战能量连线 ====== */}
                <div className="battle-energy-link" />

                {/* ====== 光晕装饰 ====== */}
                <div style={{
                    position:'absolute', top:0, left:0, width:'100%', height:'100%',
                    pointerEvents:'none', zIndex:1, opacity:0.4,
                    background:`
                        radial-gradient(ellipse at 15% 30%, rgba(255,255,255,0.12) 0%, transparent 40%),
                        radial-gradient(ellipse at 85% 70%, rgba(255,255,255,0.08) 0%, transparent 40%),
                        radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)
                    `
                }} />

                {/* ====== 领域展开全局标识 ====== */}
                {battle.activeDomain && battle.activeDomain.turnsLeft > 0 && (
                  <div style={{
                    position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)', zIndex:10,
                    background: battle.activeDomain.ownerSide === 'player'
                      ? 'linear-gradient(135deg, rgba(33,150,243,0.85), rgba(13,71,161,0.9))'
                      : 'linear-gradient(135deg, rgba(211,47,47,0.85), rgba(136,14,79,0.9))',
                    padding:'6px 18px', borderRadius:'20px',
                    boxShadow: battle.activeDomain.ownerSide === 'player'
                      ? '0 0 20px rgba(33,150,243,0.5), 0 0 40px rgba(33,150,243,0.2)'
                      : '0 0 20px rgba(211,47,47,0.5), 0 0 40px rgba(211,47,47,0.2)',
                    display:'flex', alignItems:'center', gap:'8px',
                    animation:'domain-banner-pulse 2s infinite', border:'1px solid rgba(255,255,255,0.3)'
                  }}>
                    <span style={{fontSize:'16px'}}>🌀</span>
                    <span style={{color:'#fff', fontSize:'12px', fontWeight:'bold', textShadow:'0 1px 3px rgba(0,0,0,0.5)'}}>
                      {battle.activeDomain.name}
                    </span>
                    <span style={{
                      background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:'10px',
                      padding:'1px 8px', borderRadius:'10px', fontWeight:'bold'
                    }}>
                      {battle.activeDomain.ownerSide === 'player' ? '我方' : '敌方'} · 剩余{battle.activeDomain.turnsLeft}回合
                    </span>
                  </div>
                )}

                {/* ====== 中央对战标记 ====== */}
                <div style={{
                  position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
                  zIndex:3, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center'
                }}>
                  {/* 能量涟漪 */}
                  <div style={{
                    width:80, height:80, borderRadius:'50%',
                    border:'1px solid rgba(255,255,255,0.08)',
                    boxShadow:'0 0 30px rgba(255,255,255,0.03), inset 0 0 20px rgba(255,255,255,0.02)',
                    animation:'battle-glow 6s ease-in-out infinite', opacity:0.6
                  }}>
                    <div style={{
                      width:'100%', height:'100%', borderRadius:'50%',
                      background:'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
                    }} />
                  </div>
                  {/* 交叉射线 */}
                  <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%) rotate(-20deg)', width:160, height:1,
                    background:'linear-gradient(90deg, transparent, rgba(76,175,80,0.15), rgba(255,255,255,0.1), rgba(244,67,54,0.15), transparent)', filter:'blur(1px)'}} />
                  <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%) rotate(20deg)', width:160, height:1,
                    background:'linear-gradient(90deg, transparent, rgba(76,175,80,0.12), rgba(255,255,255,0.08), rgba(244,67,54,0.12), transparent)', filter:'blur(1px)'}} />
                </div>

                {/* ========================================== */}
                {/* 1. 敌方区域 (右上角) */}
                {/* ========================================== */}
                <div className="enemy-zone-v2" style={{position: 'absolute', top: '2%', right: '4%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    
                    {/* 敌方 HUD */}
                    <div className="hud-card hud-enemy" style={{marginBottom: '8px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'2px'}}>
                            <span style={{fontSize:'13px', fontWeight:'bold', wordBreak:'break-all'}}>
                                {battle.isTrainer ? `${battle.trainerName} 的 ${e.name}` : e.name}
                            </span>
                            <span style={{fontSize:'13px', fontStyle:'italic', marginLeft:'8px', flexShrink:0, color:'#555'}}>Lv.{e.level}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'4px', justifyContent:'flex-end'}}>
                            {e.isFusedShiny ? (
                              <span style={{background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>🧬异色</span>
                            ) : e.isShiny ? (
                              <span style={{background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>✨闪光</span>
                            ) : null}
                            {renderSectBadge(e, 'enemy')}
                            {renderStatusBadges(e)}
                            {e.devilFruit && (() => { const df = getFruitById(e.devilFruit); return df ? (
                              <span className="fruit-badge" onClick={(ev) => { ev.stopPropagation(); setBattleFruitDetail(df); }} style={{background: FRUIT_RARITY_CONFIG[df.rarity]?.color || '#666', color:'#fff', fontSize:'9px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', cursor:'pointer'}}>
                                {df.name}{e.fruitTransformed ? ` (${e.fruitTurnsLeft})` : ''}
                              </span>
                            ) : null; })()}
                        </div>

                        {/* 第三行：血条（使用增强组件） */}
                        <EnhancedHPBar 
                            current={e.currentHp} 
                            max={eStats.maxHp} 
                            label=""
                        />
                        {e.maxCE > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'9px', color: e.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{e.curseGrade?.name || ''}</span>
                                <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                    <div style={{width:`${((e.cursedEnergy||0)/e.maxCE)*100}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#CE93D8'}}>{e.cursedEnergy||0}/{e.maxCE}</span>
                            </div>
                        )}
                        {renderPartyIndicators(battle.enemyParty)}
                    </div>

                    {/* 敌方精灵 */}
                    <div className={`sprite-wrapper enemy-sprite-wrapper ${e.fruitTransformed ? 'fruit-transformed' : ''}`} style={{position: 'relative', marginRight: '10px'}}>
                        {battle.isTrainer && (
                            <div style={{
                                position: 'absolute', bottom: '10px', right: '-70px', zIndex: -1, opacity: 0.9, width: 210, height: 210
                            }}>
                                    {getTrainerAvatar(battle.trainerName)}
                            </div>
                        )}
                        <div className="battle-platform battle-platform-enemy" />
                        
                        <div 
                            key={`enemy-sprite-${battle.enemyActiveIdx}-${e.id}`}
                            ref={(el) => {
                                if (el && !el.dataset.animated) {
                                    el.dataset.animated = 'true';
                                    GSAPAnimations.petEntry(el, 0.2);
                                }
                            }}
                            className={`sprite-v2 ${e.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.target==='enemy' && !['SHINY_ENTRY','THROW_BALL','BALL_WOBBLE','CATCH_SUCCESS','CATCH_FAIL'].includes(animEffect?.type) ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`} 
                            style={{
                                filter: ['BALL_WOBBLE','CATCH_SUCCESS'].includes(animEffect?.type)
                                  ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.2)) brightness(2) saturate(0.3)' 
                                  : animEffect?.type === 'THROW_BALL' 
                                    ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.2)) brightness(1.3)' 
                                    : e.isFusedShiny
                                      ? 'drop-shadow(0 0 5px rgba(213,0,249,0.5)) hue-rotate(150deg)'
                                      : e.isShiny
                                        ? 'drop-shadow(0 0 5px rgba(255,215,0,0.5))'
                                        : 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                                transition: 'transform 0.6s cubic-bezier(.4,0,.2,1), opacity 0.5s, filter 0.4s',
                                transform: animEffect?.type === 'THROW_BALL' ? 'scale(0.85)' : animEffect?.type === 'BALL_WOBBLE' ? 'scale(0)' : animEffect?.type === 'CATCH_SUCCESS' ? 'scale(0)' : undefined,
                                opacity: ['BALL_WOBBLE','CATCH_SUCCESS'].includes(animEffect?.type) ? 0 : 1,
                                animation: (animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'enemy') 
                                           ? 'shiny-flash-body 0.5s' : e.isFusedShiny ? 'fusedshiny-glow-battle 3s infinite' : e.isShiny ? 'shiny-glow-battle 3s infinite' : undefined
                            }}>
                            {renderAvatar(e, true)}
                        </div>
                        {/* 技能释放特效 */}
                        {animEffect && animEffect.target === 'enemy' && animEffect.type !== 'SHINY_ENTRY' && ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE'].includes(animEffect.type) && (
                            <SkillCastEffect
                                type={animEffect.type}
                                x={window.innerWidth * 0.8}
                                y={window.innerHeight * 0.2}
                                onComplete={() => {}}
                            />
                        )}

                        {/* 特效层 */}
                        {animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'enemy' && <RenderShinyStars />}
                        {animEffect && animEffect.target === 'enemy' && !['THROW_BALL','BALL_WOBBLE','CATCH_SUCCESS','CATCH_FAIL'].includes(animEffect.type) && renderEnhancedVfx(animEffect.type, 'enemy')}
                    </div>
                </div>

                {/* ========================================== */}
                {/* 2. 我方区域 (左下角) */}
                {/* ========================================== */}
                <div className="player-zone-v2" style={{position: 'absolute', bottom: '4%', left: '3%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    
                    {/* 我方精灵 */}
                    <div className={`sprite-wrapper player-sprite-wrapper ${p.fruitTransformed ? 'fruit-transformed' : ''}`} style={{position: 'relative', marginBottom: '6px', marginLeft: '5px'}}>
                        <div className="battle-platform battle-platform-player" />
                         <div style={{transform: 'scaleX(-1)'}}>
                         <div 
                             key={`player-sprite-${battle.activeIdx}-${p.id}`}
                             ref={(el) => {
                                 if (el && !el.dataset.animated) {
                                     el.dataset.animated = 'true';
                                     GSAPAnimations.petEntry(el, 0);
                                 }
                             }}
                             className={`sprite-v2 ${p.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.target==='player' && animEffect?.type !== 'SHINY_ENTRY' ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`} 
                             style={{
                                 filter: p.isFusedShiny
                                   ? 'drop-shadow(0 0 5px rgba(213,0,249,0.5)) hue-rotate(150deg)'
                                   : p.isShiny
                                     ? 'drop-shadow(0 0 5px rgba(255,215,0,0.5))'
                                     : 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))',
                                 animation: (animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'player') 
                                            ? 'shiny-flash-body 0.5s' : p.isFusedShiny ? 'fusedshiny-glow-battle 3s infinite' : p.isShiny ? 'shiny-glow-battle 3s infinite' : undefined
                             }}>
                            {renderAvatar(p)}
                        </div>
                        </div>

                        {/* 特效层 */}
                        {animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'player' && <RenderShinyStars />}
                        {animEffect && animEffect.target === 'player' && renderEnhancedVfx(animEffect.type, 'player')}
                        {/* 技能释放特效 */}
                        {animEffect && animEffect.target === 'player' && animEffect.type !== 'SHINY_ENTRY' && ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE'].includes(animEffect.type) && (
                            <SkillCastEffect
                                type={animEffect.type}
                                x={window.innerWidth * 0.2}
                                y={window.innerHeight * 0.6}
                                onComplete={() => {}}
                            />
                        )}
                    </div>

                    {/* 我方 HUD */}
                    <div className="hud-card hud-player">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'2px'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold', wordBreak:'break-all'}}>{p.name}</span>
                            <span style={{fontSize:'13px', fontStyle:'italic', marginLeft:'8px', flexShrink:0, color:'#555'}}>Lv.{p.level}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'4px'}}>
                            {p.isFusedShiny ? (
                              <span style={{background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>🧬异色</span>
                            ) : p.isShiny ? (
                              <span style={{background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>✨闪光</span>
                            ) : null}
                            {renderSectBadge(p, 'player')}
                            {renderStatusBadges(p)}
                            {p.devilFruit && (() => { const df = getFruitById(p.devilFruit); return df ? (
                              <span className="fruit-badge" onClick={(ev) => { ev.stopPropagation(); setBattleFruitDetail(df); }} style={{background: FRUIT_RARITY_CONFIG[df.rarity]?.color || '#666', color:'#fff', fontSize:'9px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', cursor:'pointer'}}>
                                {df.name}{p.fruitTransformed ? ` (${p.fruitTurnsLeft})` : ''}
                              </span>
                            ) : null; })()}
                        </div>

                        {/* 第三行：血条（使用增强组件） */}
                        <EnhancedHPBar 
                            current={p.currentHp} 
                            max={pStats.maxHp} 
                            label=""
                        />
                        {p.maxCE > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'9px', color: p.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{p.curseGrade?.name || ''}</span>
                                <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                    <div style={{width:`${((p.cursedEnergy||0)/p.maxCE)*100}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#CE93D8'}}>{p.cursedEnergy||0}/{p.maxCE}</span>
                            </div>
                        )}
                        {renderPartyIndicators(battle.playerCombatStates)}
                    </div>
                </div>

            </div>


            {/* 战斗日志浮层 - 显示最近多条消息 */}
            {battle.logs && battle.logs.length > 0 && (
                <div className="battle-log-container" style={{
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '620px',
                    textAlign: 'center',
                    zIndex: 20,
                    pointerEvents: 'none' 
                }}>
                    <EnhancedBattleMessage 
                        logs={battle.logs.slice(0, 4)}
                    />
                </div>
            )}

        </div>

        {/* 底部操作栏 */}
        <div className="battle-panel-v2">
            {(battle.phase === 'input' || battle.phase === 'input_p1') ? (
              <div className="controls-area-v2">
                    {battle.isPvP && (
                        <div style={{textAlign:'center', background: '#2196F3', color:'#fff', fontWeight:'bold', padding:'4px', fontSize:'11px', flexShrink: 0, borderRadius:'6px', margin:'0 0 4px'}}>
                            🎮 PvP对战 · 对手由AI控制
                        </div>
                    )}
                    {/* 技能网格 - 占满上方空间 */}
                    <div className="moves-grid-v2">
                        {(() => {
                            const activeMoves = p?.combatMoves || [];
                            return activeMoves.map((m, i) => (
                                <EnhancedMoveButton
                                    key={i}
                                    move={{
                                        t: m.t || 'NORMAL',
                                        name: m.name,
                                        power: m.p || 0,
                                        pp: m.pp,
                                        maxPp: m.maxPP || 15,
                                        acc: m.acc,
                                        desc: m.desc || '',
                                        isCursed: m.isCursed,
                                        ceCost: m.ceCost,
                                        isExtra: m.isExtra,
                                    }}
                                    onClick={() => { 
                                        if (battle.isPvP) {
                                            handlePvPInput(1, 'move', i);
                                        } else {
                                            executeTurn(i);
                                        }
                                    }}
                                    disabled={m.isCursed ? ((p.cursedEnergy || 0) < (m.ceCost || 0)) : (m.pp <= 0)}
                                    index={i}
                                />
                            ));
                        })()}
                    </div>
                    {/* 底部操作按钮 - 横向排列 */}
                    {!battle.isPvP ? (
                        <div className="actions-bar-h">
                            <button className="action-btn-h btn-catch" onClick={() => { setShowBallMenu(true); setBattleBagTab('balls'); }}>背包</button>
                            <button className="action-btn-h btn-switch" onClick={() => setBattle(prev => ({...prev, showSwitch: true}))} disabled={p.activeVow?.sacrifice?.noSwitch}>交换</button>
                            <button className="action-btn-h btn-run" onClick={handleRun} disabled={battle.isTrainer || battle.isGym || battle.isChallenge || battle.isStory}>逃跑</button>
                            {p.devilFruit && !p.fruitUsed && !p.fruitTransformed && (() => {
                              const turnOk = battle.turnCount >= 3;
                              const hpOk = p.currentHp < getStats(p, p.stages).maxHp * 0.5;
                              const canUse = turnOk && hpOk;
                              const hint = !turnOk && !hpOk ? `回合≥3(还需${3-battle.turnCount}回合) 且 HP<50%` : !turnOk ? `回合≥3(还需${3-battle.turnCount}回合)` : 'HP<50%';
                              return <button className="action-btn-h" style={{background: canUse ? 'linear-gradient(135deg,#D32F2F,#FF6F00)' : 'linear-gradient(135deg,#757575,#9E9E9E)', opacity: canUse ? 1 : 0.7}} onClick={() => canUse ? executeDevilFruit('player') : alert(`变身条件未满足！\n需要同时满足：\n① 战斗回合 ≥ 3\n② 当前HP < 50%\n\n未满足: ${hint}`)} disabled={!canUse}>变身{!canUse ? `(${hint})` : ''}</button>;
                            })()}
                            {p.maxCE > 0 && <button className="action-btn-h" style={{background:'linear-gradient(135deg,#7B1FA2,#E040FB)'}} onClick={executeChargeCE}>蓄力</button>}
                            {p.hasDomain && !p.usedDomain && !battle.activeDomain && <button className="action-btn-h" style={{background:'linear-gradient(135deg,#BF360C,#FF6D00)'}} onClick={executeDomainExpansion} disabled={(p.cursedEnergy||0) < (DOMAINS[p.domainType]?.ceCost||999)}>领域</button>}
                            {p.maxCE > 0 && !p.activeVow && <button className="action-btn-h" style={{background:'linear-gradient(135deg,#1A237E,#42A5F5)'}} onClick={() => setVowModal(true)}>缚誓</button>}
                            {(() => {
                              const ap = battle.playerCombatStates?.[battle.activeIdx];
                              const hasPartner = ap?.partnerId && battle.playerCombatStates?.find(pp => (pp.uid || pp.id) === ap.partnerId && pp.currentHp > 0);
                              if (!hasPartner || comboUsedThisBattle) return null;
                              const turnOkC = (battle.turnCount || 0) >= 3;
                              const canCombo = canUseCombo(battle);
                              return <button className="action-btn-h" style={{background: canCombo ? 'linear-gradient(135deg,#E91E63,#FF6090)' : 'linear-gradient(135deg,#757575,#9E9E9E)', opacity: canCombo ? 1 : 0.7}} onClick={() => canCombo ? executeComboAttack() : alert(`协作技需要回合 ≥ 3\n当前回合: ${battle.turnCount || 0}`)} disabled={!canCombo}>{canCombo ? '协作' : `协作(${3-(battle.turnCount||0)}回合)`}</button>;
                            })()}
                        </div>
                    ) : (
                        <div className="actions-bar-h">
                            <button className="action-btn-h" style={{background:'#673AB7'}} onClick={() => { const team = battle.playerCombatStates; const input = prompt("输入要交换的精灵序号 (1-6):"); const idx = parseInt(input) - 1; if (!isNaN(idx) && idx >= 0 && idx < team.length && team[idx]?.currentHp > 0 && idx !== battle.activeIdx) { handlePvPInput(1, 'switch', idx); } }}>换人</button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                    <span style={{color:'rgba(255,255,255,0.5)', fontWeight:'bold', fontSize:'16px', letterSpacing:'1px'}}>{battle.phase === 'busy' ? '回合结算中...' : '等待行动...'}</span>
                    <button style={{padding:'5px 14px', background:'rgba(255,82,82,0.8)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'11px'}} onClick={() => { setBattle(prev => prev ? ({...prev, phase: 'input'}) : null); }}>操作无响应？点击恢复</button>
                </div>
            )}
        </div> 
        
        {/* 战斗内背包弹窗 */}
        {showBallMenu && (
          <div className="ball-menu-overlay" onClick={() => setShowBallMenu(false)}>
            <div className="ball-menu-card" onClick={e => e.stopPropagation()}>
              <div className="bag-header"><div className={`bag-tab ${battleBagTab==='balls'?'active':''}`} onClick={()=>setBattleBagTab('balls')} style={{display:'flex',alignItems:'center',gap:4}}>{renderBallCSS('poke',16)} 精灵球</div><div className={`bag-tab ${battleBagTab==='meds'?'active':''}`} onClick={()=>setBattleBagTab('meds')} style={{display:'flex',alignItems:'center',gap:4}}>{renderMedCSS('potion',16)} 药品</div></div>
              <div className="bag-list-area">
                {battleBagTab === 'balls' && (
                  <>
                    {Object.keys(inventory.balls || {}).filter(k => (inventory.balls||{})[k] > 0).length === 0 && <div className="empty-hint">没有可用的精灵球</div>}
                    {Object.keys(inventory.balls || {}).map(type => { const count = (inventory.balls||{})[type]; if (count <= 0) return null; const ball = BALLS[type]; if (!ball) return null; return ( <div key={type} className="bag-list-item" onClick={() => handleCatch(type)}><div className="item-icon-box">{renderBallCSS(type, 32)}</div><div className="item-info-box"><div className="item-name">{ball.name}</div><div className="item-desc">{ball.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
                  </>
                )}
                {battleBagTab === 'meds' && (
                  <>
                    {Object.keys(inventory.meds || {}).filter(k => (inventory.meds||{})[k] > 0).length === 0 && <div className="empty-hint">没有可用的药品</div>}
                    {Object.keys(inventory.meds || {}).map(key => { const count = (inventory.meds||{})[key]; if (count <= 0) return null; const item = MEDICINES[key]; if (!item) return null; return ( <div key={key} className="bag-list-item" onClick={() => useBattleItem(key, 'meds')}><div className="item-icon-box">{renderMedCSS(key, 32) || <span>{item.icon}</span>}</div><div className="item-info-box"><div className="item-name">{item.name}</div><div className="item-desc">{item.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
                  </>
                )}
              </div>
              <button className="btn-close-bag" onClick={() => setShowBallMenu(false)}>关闭背包</button>
            </div>
          </div>
        )}

        {/* 门派详情浮层 */}
        {renderSectTooltipOverlay()}

        {/* ====== 精灵球投掷/捕获动画 ====== */}
        {animEffect?.type === 'THROW_BALL' && (
          <div className="catch-ball-stage">
            {/* 主球体 - 抛物线飞行 */}
            <div className="catch-ball-sprite">
              {renderBallCSS(animEffect.ballType || 'poke', 40)}
            </div>
            {/* 尾迹粒子 - 沿抛物线分布 */}
            {[
              {bx:'18%',by:'38%',ex:'28%',ey:'52%',d:0.15,dur:'0.5s'},
              {bx:'25%',by:'48%',ex:'40%',ey:'62%',d:0.25,dur:'0.45s'},
              {bx:'35%',by:'58%',ex:'50%',ey:'68%',d:0.35,dur:'0.4s'},
              {bx:'45%',by:'64%',ex:'60%',ey:'66%',d:0.45,dur:'0.35s'},
              {bx:'55%',by:'66%',ex:'68%',ey:'60%',d:0.55,dur:'0.3s'},
              {bx:'65%',by:'62%',ex:'75%',ey:'54%',d:0.65,dur:'0.25s'},
              {bx:'72%',by:'56%',ex:'80%',ey:'50%',d:0.72,dur:'0.2s'},
            ].map((t, i) => (
              <div key={i} className="catch-ball-trail" style={{
                '--t-bx':t.bx,'--t-by':t.by,'--t-ex':t.ex,'--t-ey':t.ey,
                '--trail-dur':t.dur,
                animationDelay:`${t.d}s`,
                width: `${8 - i * 0.5}px`, height: `${8 - i * 0.5}px`,
              }} />
            ))}
            {/* 速度线 */}
            {[
              {b:'55%',l:'30%',a:-35,w:50,d:0.2},
              {b:'62%',l:'45%',a:-20,w:45,d:0.35},
              {b:'68%',l:'55%',a:-5,w:40,d:0.45},
              {b:'60%',l:'65%',a:15,w:35,d:0.55},
              {b:'52%',l:'73%',a:25,w:30,d:0.65},
            ].map((sl, i) => (
              <div key={`sl-${i}`} className="catch-speed-line" style={{
                bottom:sl.b, left:sl.l, transform:`rotate(${sl.a}deg)`,
                '--sl-w':`${sl.w}px`, animationDelay:`${sl.d}s`
              }} />
            ))}
            {/* 命中闪光 */}
            <div className="catch-flash-ring" />
            <div className="catch-hit-flash" />
          </div>
        )}
        {animEffect?.type === 'BALL_WOBBLE' && (
          <div className="catch-ball-stage">
            <div className="catch-ball-sprite landed">
              {renderBallCSS(animEffect.ballType || 'poke', 40)}
            </div>
          </div>
        )}
        {animEffect?.type === 'CATCH_SUCCESS' && (
          <div className="catch-success-stage">
            <div className="catch-sparkle-bg" />
            {[0,1,2].map(i => (
              <div key={`ring-${i}`} className="catch-success-ring" style={{
                '--ring-color': ['#FFD600','#FF6D00','#FF1744'][i],
                animationDelay: `${i * 0.15}s`
              }} />
            ))}
            {Array.from({length:12}).map((_,i) => {
              const angle = (i / 12) * 360;
              const dist = 60 + Math.random() * 40;
              return <div key={`star-${i}`} className="catch-star-particle" style={{
                '--sx': `${Math.cos(angle*Math.PI/180)*dist}px`,
                '--sy': `${Math.sin(angle*Math.PI/180)*dist}px`,
                '--star-color': ['#FFD600','#FF6D00','#FF1744','#E040FB','#2979FF'][i%5],
                animationDelay: `${i * 0.05}s`
              }} />;
            })}
            <div className="catch-gotcha-text">GOTCHA!</div>
          </div>
        )}
        {animEffect?.type === 'CATCH_FAIL' && (
          <div className="catch-ball-stage">
            {Array.from({length:8}).map((_,i) => {
              const angle = (i/8)*360;
              return <div key={i} className="catch-fail-burst" style={{
                '--fx': `${Math.cos(angle*Math.PI/180)*40}px`,
                '--fy': `${Math.sin(angle*Math.PI/180)*40}px`,
                '--shard-color': ['#FF5252','#FF8A80','#FFAB91','#FFD600'][i%4],
                animationDelay: `${i*0.04}s`
              }} />;
            })}
          </div>
        )}
      </div>
    );
  };

     // ==========================================
  // 4. [优化] 联机对战 (居中弹窗版)
  // ==========================================
  const renderPvPModal = () => {
      if (!pvpMode) return null;

      const generatePvPCode = () => {
        if (party.length === 0) return;
        const exportData = { 
            name: trainerName, 
            team: party.map(p => ({ 
                id: p.id, level: p.level, moves: p.moves, ivs: p.ivs, evs: p.evs, 
                nature: p.nature, isShiny: p.isShiny, isFusedShiny: p.isFusedShiny, 
                customBaseStats: p.customBaseStats, equips: p.equips, name: p.name 
            })) 
        };
        try { 
            const code = btoa(encodeURIComponent(JSON.stringify(exportData))); 
            navigator.clipboard.writeText(code).then(() => alert("✅ 对战码已复制！\n请发送给您的对手。")); 
        } catch (e) { alert("生成失败"); }
      };

      const handleImportPvP = () => {
          if (!pvpCodeInput) { alert("请输入对战码！"); return; }
          try {
              const cleanCode = pvpCodeInput.replace(/[\s\n\r]/g, '');
              const data = JSON.parse(decodeURIComponent(atob(cleanCode)));
              if (!data || !data.team) throw new Error("数据错误");
              
              if (confirm(`接受来自【${data.name || '神秘人'}】的挑战？`)) { 
                  setPvpMode(false); 
                  setPvpCodeInput(''); 
                  startBattle({ 
                      id: 9999, 
                      customParty: data.team, 
                      trainerName: data.name 
                  }, 'pvp'); 
              }
          } catch (e) { alert(`❌ 无效的对战码！`); }
      };

      return (
          // 🔥 核心修改：全屏遮罩 + Flex 居中
          <div className="modal-overlay" onClick={() => setPvpMode(false)} style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              zIndex: 3000
          }}>
              {/* 终端卡片主体 */}
              <div onClick={e => e.stopPropagation()} style={{
                  width: '420px', 
                  background: '#1a237e', 
                  color: '#fff', 
                  borderRadius: '20px', 
                  border: '1px solid #536DFE', 
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)', 
                  overflow: 'hidden',
                  animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                  {/* 标题栏 */}
                  <div style={{
                      padding: '15px 20px', 
                      background: 'linear-gradient(90deg, #304FFE, #1a237e)', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}>
                      <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize:'16px'}}>
                          <span style={{fontSize:'20px'}}>⚔️</span> 联机对战终端
                      </div>
                      <button onClick={() => setPvpMode(false)} style={{
                          background:'transparent', border:'none', color:'#fff', fontSize:'24px', cursor:'pointer', opacity:0.8
                      }}>×</button>
                  </div>

                  {/* 内容区域 */}
                  <div style={{padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px'}}>
                      
                      {/* 上半部分：生成 */}
                      <div style={{textAlign: 'center'}}>
                          <div style={{fontSize: '12px', color: '#8C9EFF', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold'}}>
                              我是擂主 (Host)
                          </div>
                          <button onClick={generatePvPCode} style={{
                              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                              background: 'linear-gradient(90deg, #00E676, #00C853)', 
                              color: '#003300', fontWeight: 'bold', fontSize:'15px', cursor:'pointer', 
                              boxShadow: '0 4px 15px rgba(0, 230, 118, 0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}>
                              <span>📤</span> 生成并复制对战码
                          </button>
                          <div style={{fontSize:'10px', color:'rgba(255,255,255,0.5)', marginTop:'8px'}}>
                              将生成的代码发送给朋友，等待挑战
                          </div>
                      </div>

                      {/* 分割线 */}
                      <div style={{display:'flex', alignItems:'center', gap:'10px', opacity:0.3}}>
                          <div style={{flex:1, height:'1px', background:'#fff'}}></div>
                          <div style={{fontSize:'12px'}}>OR</div>
                          <div style={{flex:1, height:'1px', background:'#fff'}}></div>
                      </div>

                      {/* 下半部分：加入 */}
                      <div style={{textAlign: 'center'}}>
                          <div style={{fontSize: '12px', color: '#FF8A80', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight:'bold'}}>
                              我是挑战者 (Guest)
                          </div>
                          <textarea 
                              value={pvpCodeInput} 
                              onChange={(e) => setPvpCodeInput(e.target.value)} 
                              placeholder="在此粘贴对手发来的对战码..." 
                              style={{
                                  width: '100%', height: '70px', borderRadius: '12px', 
                                  border: '1px solid #536DFE', marginBottom: '15px', 
                                  background: 'rgba(0,0,0,0.2)', color: '#fff', padding: '12px', 
                                  fontSize: '13px', resize: 'none', outline: 'none', fontFamily: 'monospace'
                              }} 
                          />
                          <button onClick={handleImportPvP} style={{
                              width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
                              background: 'linear-gradient(90deg, #FF5252, #D32F2F)', 
                              color: '#fff', fontWeight: 'bold', fontSize:'15px', cursor:'pointer', 
                              boxShadow: '0 4px 15px rgba(255, 82, 82, 0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                          }}>
                              <span>⚔️</span> 开始对战
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

      const renderShop = () => {
    if (!shopMode) return null;
    const mapInfo = MAPS.find(m => m.id === currentMapId) || MAPS[0];
    const tier = currentMapId <= 3 ? 1 : currentMapId <= 6 ? 2 : currentMapId <= 9 ? 3 : 4;
    const tierName = ['', '初级商店', '进阶商店', '高级商店', '顶级商店'][tier];
    const tierColor = ['', '#78909C', '#2196F3', '#9C27B0', '#FF6F00'][tier];

    const ballsByTier = {
      1: ['poke','great','heal'],
      2: ['poke','great','ultra','heal','net','dusk'],
      3: ['poke','great','ultra','heal','net','dusk','quick','timer'],
      4: ['poke','great','ultra','heal','net','dusk','quick','timer'],
    };
    const medsByTier = {
      1: ['potion','super_potion','antidote','paralyze_heal','burn_heal'],
      2: ['potion','super_potion','hyper_potion','ether','antidote','paralyze_heal','burn_heal','full_heal'],
      3: ['super_potion','hyper_potion','max_potion','ether','max_ether','full_heal','revive'],
      4: ['hyper_potion','max_potion','ether','max_ether','full_heal','revive','max_revive'],
    };
    const shopTMs = TMS.filter(t=>t.shopSell);
    const tmsByTier = {
      1: shopTMs.filter(t=>t.tier<=1).map(t=>t.id),
      2: shopTMs.filter(t=>t.tier<=2).map(t=>t.id),
      3: shopTMs.filter(t=>t.tier<=2).map(t=>t.id),
      4: shopTMs.map(t=>t.id),
    };
    const growthByTier = {
      1: [],
      2: ['vit_hp','vit_patk','vit_pdef','exp_candy'],
      3: ['vit_hp','vit_patk','vit_pdef','vit_satk','vit_sdef','vit_spd','exp_candy'],
      4: ['vit_hp','vit_patk','vit_pdef','vit_satk','vit_sdef','vit_spd','vit_crit','exp_candy','max_candy'],
    };
    const accByTier = {
      1: ['a1','a3','a10','a11'],
      2: ['a1','a3','a10','a11','a2','a8','a4','a12','a13','a14'],
      3: ['a2','a8','a4','a12','a13','a14','a7','a6','a9','a15','a16','a17','a18'],
      4: ACCESSORY_DB.filter(a=>!['trophy','blue_lily','nichirin_blade'].includes(a.id)).map(a=>a.id),
    };
    const showStones = tier >= 3;
    const showCursed = tier >= 3;
    const showSpecial = tier >= 4;

    const availBalls = ballsByTier[tier];
    const availMeds = medsByTier[tier];
    const availTMs = tmsByTier[tier];
    const availGrowth = growthByTier[tier];
    const availAcc = accByTier[tier];

    const renderShopCard = (key, icon, name, desc, unitPrice, buyType, extra) => {
      const count = buyCounts[key] || 1;
      const totalPrice = unitPrice * count;
      return (
        <div key={key} style={{
          background:'linear-gradient(145deg, #ffffff, #f8f9ff)', borderRadius:'16px',
          padding:'18px 14px 14px', display:'flex', flexDirection:'column', alignItems:'center',
          textAlign:'center', border:'1px solid #e8eaf6', position:'relative',
          transition:'all 0.25s ease', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
          ...(extra?.borderColor ? {borderLeft:`3px solid ${extra.borderColor}`} : {})
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}
        >
          {extra?.tag && <span style={{position:'absolute',top:'-6px',right:'8px',background:extra.tagColor||'#4CAF50',color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700',boxShadow:'0 2px 4px rgba(0,0,0,0.15)'}}>{extra.tag}</span>}
          <div style={{fontSize:'36px',marginBottom:'8px',filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{icon}</div>
          <div style={{fontSize:'13px',fontWeight:'800',color:'#1a1a2e',marginBottom:'3px'}}>{name}</div>
          <div style={{fontSize:'10px',color:'#888',height:'28px',overflow:'hidden',lineHeight:'1.4',marginBottom:'8px'}}>{desc}</div>
          <div style={{fontSize:'14px',fontWeight:'900',color:'#F57C00',marginBottom:'10px'}}>💰 {totalPrice.toLocaleString()}</div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px',background:'#f0f0f5',padding:'3px 6px',borderRadius:'16px'}}>
            <div onClick={()=>updateBuyCount(key,-1)} style={{width:'24px',height:'24px',borderRadius:'50%',background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:'bold',fontSize:'14px',userSelect:'none'}}>-</div>
            <span style={{fontSize:'13px',fontWeight:'700',minWidth:'20px'}}>{count}</span>
            <div onClick={()=>updateBuyCount(key,1)} style={{width:'24px',height:'24px',borderRadius:'50%',background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:'bold',fontSize:'14px',userSelect:'none'}}>+</div>
          </div>
          <button onClick={()=>buyItemPro(key,unitPrice,buyType)} disabled={gold < totalPrice}
            style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=totalPrice?'pointer':'not-allowed',
              background:gold>=totalPrice?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
              color:gold>=totalPrice?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=totalPrice?'0 3px 8px rgba(0,0,0,0.15)':'none'
          }}>购买</button>
        </div>
      );
    };

    const tabs = [
      {id:'balls',label:'精灵球',icon:'🔴'},
      {id:'items',label:'药品',icon:'💊'},
      {id:'tms',label:'技能书',icon:'📀'},
      ...(showStones?[{id:'stones',label:'进化石',icon:'💎'}]:[]),
      ...(availGrowth.length>0?[{id:'growth',label:'增强',icon:'💪'}]:[]),
      {id:'accessories',label:'饰品',icon:'💍'},
      ...(showCursed?[{id:'cursed',label:'咒具',icon:'🔮'}]:[]),
      ...(showSpecial?[{id:'special',label:'特殊',icon:'✨'}]:[]),
    ];

    return (
      <div className="modal-overlay">
        <div className="shop-modal-pro" style={{background:'linear-gradient(180deg,#f8f9ff,#eef1ff)',borderRadius:'20px'}}>
          <div className="shop-nav-sidebar" style={{background:'linear-gradient(180deg,#1a1a2e,#16213e)',borderRight:'none',padding:'0',borderRadius:'20px 0 0 20px'}}>
            <div style={{padding:'18px 12px',textAlign:'center',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.5)',fontWeight:'600',marginBottom:'4px'}}>{mapInfo.name}</div>
              <div style={{fontSize:'14px',fontWeight:'800',color:tierColor,letterSpacing:'1px'}}>{tierName}</div>
            </div>
            {tabs.map(t=>(
              <div key={t.id} className={`shop-nav-item ${shopTab===t.id?'active':''}`}
                style={{padding:'12px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',fontWeight:'600',
                  color:shopTab===t.id?'#fff':'rgba(255,255,255,0.5)',
                  background:shopTab===t.id?`linear-gradient(90deg,${tierColor}40,transparent)`:'transparent',
                  borderLeft:shopTab===t.id?`3px solid ${tierColor}`:'3px solid transparent',
                  transition:'all 0.2s'}}
                onClick={()=>setShopTab(t.id)}>
                <span style={{fontSize:'16px'}}>{t.icon}</span>{t.label}
              </div>
            ))}
            <div style={{marginTop:'auto',padding:'14px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{textAlign:'center',fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'}}>持有金币</div>
              <div style={{textAlign:'center',fontSize:'18px',fontWeight:'900',color:'#FFD54F'}}>💰 {gold.toLocaleString()}</div>
            </div>
            <button style={{margin:'8px 12px 14px',padding:'8px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'10px',color:'rgba(255,255,255,0.7)',fontSize:'12px',fontWeight:'600',cursor:'pointer'}} onClick={()=>setShopMode(false)}>关闭商店</button>
          </div>

          <div className="shop-content-area" style={{padding:'20px',overflowY:'auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'14px'}}>
              {shopTab==='balls' && availBalls.map(type=>{
                const item=BALLS[type]; if(!item) return null;
                return renderShopCard(`ball_${type}`,renderBallCSS(type,36)||item.icon,item.name,item.desc,item.price,'ball');
              })}
              {shopTab==='items' && availMeds.map(key=>{
                const item=MEDICINES[key]; if(!item) return null;
                return renderShopCard(key,renderMedCSS(key,36)||<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'item');
              })}
              {shopTab==='tms' && availTMs.map(tmId=>{
                const tm=TMS.find(t=>t.id===tmId); if(!tm) return null;
                const alreadyOwned = (inventory.tms?.[tmId]||0) > 0;
                const tierLabel = tm.tier===1?'基础':tm.tier===2?'进阶':'高级';
                const tierTagColor = tm.tier===1?'#78909C':tm.tier===2?'#43A047':'#FB8C00';
                const typeColor = TYPES[tm.type]?.color||'#888';
                return (
                  <div key={tmId} style={{
                    background: alreadyOwned?'linear-gradient(145deg,#f0f0f0,#e8e8e8)':'linear-gradient(145deg, #ffffff, #f8f9ff)',borderRadius:'16px',
                    padding:'18px 14px 14px',display:'flex',flexDirection:'column',alignItems:'center',
                    textAlign:'center',border:alreadyOwned?'1px solid #ccc':`1px solid #e8eaf6`,position:'relative',
                    transition:'all 0.25s ease',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft:`3px solid ${alreadyOwned?'#aaa':typeColor}`,opacity:alreadyOwned?0.7:1,
                  }}
                  onMouseEnter={e=>{if(!alreadyOwned){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}>
                    <span style={{position:'absolute',top:'-6px',right:'8px',background:tierTagColor,color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700',boxShadow:'0 2px 4px rgba(0,0,0,0.15)'}}>{tierLabel}</span>
                    <span style={{position:'absolute',top:'-6px',left:'8px',background:'#FF6F00',color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700'}}>限购1</span>
                    <div style={{fontSize:'36px',marginBottom:'8px',filter:alreadyOwned?'grayscale(1)':'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{renderTMCSS(tm.type||'NORMAL',36)}</div>
                    <div style={{fontSize:'13px',fontWeight:'800',color:alreadyOwned?'#999':'#1a1a2e',marginBottom:'3px'}}>{tm.name}</div>
                    <div style={{fontSize:'10px',color:'#888',height:'28px',overflow:'hidden',lineHeight:'1.4',marginBottom:'8px'}}>{TYPES[tm.type]?.name||''} · 威力{tm.p}</div>
                    <div style={{fontSize:'14px',fontWeight:'900',color:alreadyOwned?'#aaa':'#F57C00',marginBottom:'10px'}}>💰 {tm.price.toLocaleString()}</div>
                    {alreadyOwned?(
                      <div style={{width:'100%',padding:'8px',borderRadius:'10px',background:'#e0e0e0',color:'#999',fontWeight:'700',fontSize:'12px',textAlign:'center'}}>✅ 已拥有</div>
                    ):(
                      <button onClick={()=>buyItemPro(tm.id,tm.price,'tm')} disabled={gold<tm.price}
                        style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=tm.price?'pointer':'not-allowed',
                          background:gold>=tm.price?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
                          color:gold>=tm.price?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=tm.price?'0 3px 8px rgba(0,0,0,0.15)':'none'
                        }}>购买</button>
                    )}
                  </div>
                );
              })}
              {shopTab==='stones' && Object.keys(EVO_STONES).map(key=>{
                const item=EVO_STONES[key];
                return renderShopCard(key,renderStoneCSS(key,36)||<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'stone',{borderColor:'#9C27B0'});
              })}
              {shopTab==='growth' && availGrowth.map(gId=>{
                const item=GROWTH_ITEMS.find(g=>g.id===gId); if(!item) return null;
                const extra = gId==='max_candy'?{tag:'稀有',tagColor:'#E91E63'}:gId==='exp_candy'?{tag:'热卖',tagColor:'#4CAF50'}:{};
                return renderShopCard(item.id,renderGrowthCSS(item.id,36)||<span style={{fontSize:30}}>{item.emoji}</span>,item.name,item.desc,item.price,'item',extra);
              })}
              {shopTab==='accessories' && availAcc.map(accId=>{
                const acc=ACCESSORY_DB.find(a=>a.id===accId); if(!acc) return null;
                const accOwned = accessories.filter(a=>a===accId).length + party.reduce((s,p)=>s+((p.equips||[]).filter(e=>e===accId).length),0);
                return (
                  <div key={accId} style={{
                    background:accOwned>0?'linear-gradient(145deg,#f0f0f0,#e8e8e8)':'linear-gradient(145deg,#ffffff,#f8f9ff)',borderRadius:'16px',
                    padding:'18px 14px 14px',display:'flex',flexDirection:'column',alignItems:'center',
                    textAlign:'center',border:accOwned>0?'1px solid #ccc':'1px solid #e8eaf6',position:'relative',
                    transition:'all 0.25s ease',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft:`3px solid ${accOwned>0?'#aaa':'#EC407A'}`,opacity:accOwned>0?0.7:1,
                  }}
                  onMouseEnter={e=>{if(!accOwned){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}>
                    <span style={{position:'absolute',top:'-6px',left:'8px',background:'#FF6F00',color:'#fff',fontSize:'9px',padding:'2px 8px',borderRadius:'8px',fontWeight:'700'}}>限购1</span>
                    <div style={{fontSize:'36px',marginBottom:'8px',filter:accOwned>0?'grayscale(1)':'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>{renderAccCSS(acc.id,36)||<span style={{fontSize:30}}>{acc.icon}</span>}</div>
                    <div style={{fontSize:'13px',fontWeight:'800',color:accOwned>0?'#999':'#1a1a2e',marginBottom:'3px'}}>{acc.name}</div>
                    <div style={{fontSize:'10px',color:'#888',height:'28px',overflow:'hidden',lineHeight:'1.4',marginBottom:'8px'}}>{acc.desc}</div>
                    <div style={{fontSize:'14px',fontWeight:'900',color:accOwned>0?'#aaa':'#F57C00',marginBottom:'10px'}}>💰 {acc.price.toLocaleString()}</div>
                    {accOwned>0?(
                      <div style={{width:'100%',padding:'8px',borderRadius:'10px',background:'#e0e0e0',color:'#999',fontWeight:'700',fontSize:'12px',textAlign:'center'}}>✅ 已拥有</div>
                    ):(
                      <button onClick={()=>buyItemPro(acc.id,acc.price,'acc')} disabled={gold<acc.price}
                        style={{width:'100%',padding:'8px',borderRadius:'10px',border:'none',fontWeight:'700',fontSize:'12px',cursor:gold>=acc.price?'pointer':'not-allowed',
                          background:gold>=acc.price?`linear-gradient(135deg, ${tierColor}, ${tierColor}cc)`:'#ccc',
                          color:gold>=acc.price?'#fff':'#999',transition:'all 0.2s',boxShadow:gold>=acc.price?'0 3px 8px rgba(0,0,0,0.15)':'none'
                        }}>购买</button>
                    )}
                  </div>
                );
              })}
              {shopTab==='cursed' && Object.keys(CURSED_ITEMS).map(key=>{
                const item=CURSED_ITEMS[key]; if(!item||item.price<=0) return null;
                return renderShopCard(key,<span style={{fontSize:30}}>{item.icon}</span>,item.name,item.desc,item.price,'cursed',{borderColor:'#4A148C'});
              })}
              {shopTab==='special' && (
                <>
                  {renderShopCard(MISC_ITEMS.rebirth_pill.id,renderMiscCSS(36),MISC_ITEMS.rebirth_pill.name,MISC_ITEMS.rebirth_pill.desc,MISC_ITEMS.rebirth_pill.price,'item',{tag:'特殊',tagColor:'#E91E63',borderColor:'#E91E63'})}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


    // ==========================================
  // [完整重构] PC 管理终端 (居中大屏版)
  // ==========================================
  const renderPC = () => {
    if (!pcMode) return null;
    
    const selectedPet = selectedPartyIdx !== null ? party[selectedPartyIdx] : (selectedBoxIdx !== null ? box[selectedBoxIdx] : null);
    const stats = selectedPet ? getStats(selectedPet) : null;
    const nature = selectedPet ? NATURE_DB[selectedPet.nature || 'docile'] : null;

    return (
      <div className="modal-overlay" onClick={() => setPcMode(false)} style={{
        // 🔴 1. 强制全屏居中遮罩
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)', // 深色背景遮罩
        backdropFilter: 'blur(4px)',
        zIndex: 1000
      }}>
        {/* 🔴 2. 模态框主体 (阻止冒泡防止点击关闭) */}
        <div className="pc-modal-tech" onClick={e => e.stopPropagation()} style={{
          width: '95%',
          maxWidth: '1100px', // 足够宽，容纳三列
          height: '85vh',     // 固定高度
          background: '#1a1a2e', // 深色科技背景
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid #333',
          color: '#fff'
        }}>
          
          {/* 顶部标题栏 */}
          <div className="pc-header-tech" style={{
            background: '#16213e', 
            padding: '15px 20px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #333'
          }}>
            <div className="pc-title-tech" style={{fontSize: '18px', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{color:'#00E676', fontSize:'12px'}}>● ONLINE</span> 
                PC 宝可梦管理终端
            </div>
            <button className="btn-close" style={{background:'transparent', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer'}} onClick={() => setPcMode(false)}>✕</button>
          </div>
          
          {/* 🔴 3. 三列布局核心区域 */}
          <div className="pc-layout-tech" style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden', // 防止整个页面滚动
              padding: '20px',
              gap: '20px' // 列间距
          }}>
            
            {/* === 左侧：当前队伍 (固定宽度) === */}
            <div className="pc-col-left" style={{ 
                width: '260px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column',
                background: '#16213e',
                borderRadius: '12px',
                padding: '10px'
            }}>
              <div className="pc-section-header" style={{marginBottom:'10px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  当前队伍 ({party.length}/6)
              </div>
              <div className="pc-party-list-tech" style={{overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                {party.map((p, i) => (
                  <div key={i} 
                       onClick={() => { setSelectedPartyIdx(i); setSelectedBoxIdx(null); }}
                       style={{
                           display: 'flex', alignItems: 'center', padding: '10px',
                           background: selectedPartyIdx===i ? '#2196F3' : 'rgba(255,255,255,0.05)',
                           borderRadius: '8px', cursor: 'pointer', transition: '0.2s',
                           border: selectedPartyIdx===i ? '1px solid #64B5F6' : '1px solid transparent'
                       }}
                  >
                    <div style={{fontSize:'24px', marginRight:'10px'}}>{renderAvatar(p)}</div>
                    <div>
                      <div style={{fontWeight:'bold', fontSize:'14px'}}>{p.name}</div>
                      <div style={{fontSize:'11px', opacity:0.7}}>Lv.{p.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === 中间：仓库列表 (自适应宽度) === */}
            <div className="pc-col-mid" style={{ 
                flex: 1, 
                display:'flex', 
                flexDirection:'column', 
                background:'rgba(0,0,0,0.2)', 
                borderRadius:'12px', 
                padding:'10px',
                border: '1px solid #333'
            }}>
              <div className="pc-section-header" style={{marginBottom:'10px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  存储箱 ({box.length})
              </div>
              <div className="pc-box-grid-tech" style={{ 
                  display:'grid', 
                  gridTemplateColumns:'repeat(auto-fill, minmax(60px, 1fr))', 
                  gap:'8px', 
                  overflowY:'auto',
                  alignContent: 'start',
                  flex: 1
              }}>
                {box.map((p, i) => (
                  <div key={i} 
                       onClick={() => { setSelectedBoxIdx(i); setSelectedPartyIdx(null); }}
                       style={{
                           aspectRatio: '1/1',
                           background: selectedBoxIdx===i ? '#FF9800' : 'rgba(255,255,255,0.1)',
                           borderRadius: '8px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '28px', cursor: 'pointer',
                           border: selectedBoxIdx===i ? '2px solid #FFB74D' : 'none'
                       }}
                  >
                    {renderAvatar(p)}
                  </div>
                ))}
                {/* 补几个空格子占位，好看一点 */}
                {[...Array(Math.max(0, 20 - box.length))].map((_, i) => (
                    <div key={`empty-${i}`} style={{background:'rgba(255,255,255,0.03)', borderRadius:'8px'}}></div>
                ))}
              </div>
            </div>

            {/* === 右侧：详细数据 (固定宽度，防止挤压) === */}
            <div className="pc-col-right" style={{ 
                width: '320px', 
                flexShrink: 0, 
                display:'flex', 
                flexDirection:'column', 
                background:'#232336', 
                borderRadius:'12px', 
                padding:'15px',
                borderLeft: '1px solid #333'
            }}>
              <div className="pc-section-header" style={{marginBottom:'15px', color:'#888', fontSize:'12px', fontWeight:'bold'}}>
                  数据分析模块
              </div>
              
              {selectedPet ? (
                <div className="analysis-panel" style={{overflowY: 'auto', paddingRight: '4px', display:'flex', flexDirection:'column', height:'100%'}}>
                  
                  {/* 1. 基础头部信息 */}
                  <div className="analysis-header" style={{display:'flex', alignItems:'center', marginBottom:'15px', paddingBottom:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                      <div className="analysis-sprite" style={{
                          width:'60px', height:'60px', marginRight:'15px', 
                          background:'rgba(255,255,255,0.1)', borderRadius:'50%', 
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'35px'
                      }}>
                          {renderAvatar(selectedPet)}
                      </div>
                      <div style={{flex:1}}>
                          <div className="analysis-name" style={{fontSize:'18px', fontWeight:'bold', color:'#fff', marginBottom:'6px'}}>
                              {selectedPet.name} {selectedPet.isShiny && <span style={{color:'#FFD700'}}>✨</span>}
                          </div>
                          <div className="analysis-types" style={{display:'flex', gap:'5px'}}>
                            <span className="analysis-tag" style={{background: TYPES[selectedPet.type]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                {TYPES[selectedPet.type]?.name}
                            </span>
                            {selectedPet.secondaryType && (
                                <span className="analysis-tag" style={{background: TYPES[selectedPet.secondaryType]?.color, color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'bold'}}>
                                    {TYPES[selectedPet.secondaryType]?.name}
                                </span>
                            )}
                            <span className="analysis-tag" style={{background:'#444', color:'#fff', padding:'2px 8px', borderRadius:'4px', fontSize:'11px'}}>
                                Lv.{selectedPet.level}
                            </span>
                          </div>
                      </div>
                  </div>

                  {/* 2. 性格显示 (带悬停提示) */}
                  <div style={{background:'rgba(0,0,0,0.2)', padding:'8px 12px', borderRadius:'6px', marginBottom:'15px', fontSize:'12px', display:'flex', justifyContent:'space-between', alignItems:'center', overflow:'visible'}}>
                      <span style={{color:'#aaa'}}>性格倾向</span>
                      
                      <div 
                          style={{position:'relative', cursor:'help', display:'flex', alignItems:'center'}}
                          onMouseEnter={() => setStatTooltip('nature')}
                          onMouseLeave={() => setStatTooltip(null)}
                      >
                          <span style={{color:'#fff', fontWeight:'bold', marginRight:'5px', borderBottom:'1px dashed #666'}}>{nature?.name}</span>
                          <span style={{color:'#888'}}>({nature?.desc})</span>

                          {/* 悬停提示框 */}
                          {statTooltip === 'nature' && (
                              <div style={{
                                  position:'absolute', bottom:'130%', right:'-10px', width:'160px',
                                  background:'rgba(0,0,0,0.95)', backdropFilter:'blur(4px)',
                                  border:'1px solid #444', borderRadius:'8px', padding:'10px',
                                  zIndex: 100, boxShadow:'0 4px 15px rgba(0,0,0,0.5)',
                                  pointerEvents:'none', textAlign:'left'
                              }}>
                                  <div style={{color:'#fff', fontWeight:'bold', marginBottom:'6px', borderBottom:'1px solid #555', paddingBottom:'4px', fontSize:'12px'}}>
                                      性格修正详情
                                  </div>
                                  {Object.keys(nature?.stats || {}).length === 0 ? (
                                      <div style={{color:'#ccc', fontSize:'11px'}}>无属性影响</div>
                                  ) : (
                                      Object.entries(nature.stats).map(([key, val]) => {
                                          const statMap = { p_atk:'物攻', p_def:'物防', s_atk:'特攻', s_def:'特防', spd:'速度', hp:'HP' };
                                          const isUp = val > 1;
                                          const pct = Math.round(Math.abs(val - 1) * 100);
                                          return (
                                              <div key={key} style={{display:'flex', justifyContent:'space-between', marginBottom:'3px', fontSize:'11px'}}>
                                                  <span style={{color:'#ccc'}}>{statMap[key]}</span>
                                                  <span style={{color: isUp ? '#FF5252' : '#2196F3', fontWeight:'bold'}}>
                                                      {isUp ? '▲' : '▼'} {pct}%
                                                  </span>
                                              </div>
                                          );
                                      })
                                  )}
                              </div>
                          )}
                      </div>
                  </div>

                  {/* 3. 六维属性网格 */}
                  <div className="stats-grid-tech" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
                      {[
                          {l:'HP', v:`${selectedPet.currentHp}/${stats.maxHp}`, c:'#4CAF50', w: (selectedPet.currentHp/stats.maxHp)*100},
                          {l:'速度', v:stats.spd, c:'#FFC107', w: (stats.spd/250)*100},
                          {l:'物攻', v:stats.p_atk, c:'#FF5252', w: (stats.p_atk/250)*100},
                          {l:'物防', v:stats.p_def, c:'#2196F3', w: (stats.p_def/250)*100},
                          {l:'特攻', v:stats.s_atk, c:'#E91E63', w: (stats.s_atk/250)*100},
                          {l:'特防', v:stats.s_def, c:'#3F51B5', w: (stats.s_def/250)*100},
                      ].map((s, i) => (
                          <div key={i} style={{background:'rgba(255,255,255,0.05)', padding:'8px', borderRadius:'6px'}}>
                              <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#aaa', marginBottom:'4px'}}>
                                  <span>{s.l}</span>
                                  <span style={{color:'#fff', fontWeight:'bold', fontFamily:'monospace'}}>{s.v}</span>
                              </div>
                              <div style={{height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                  <div style={{width:`${Math.min(100, s.w)}%`, background:s.c, height:'100%'}}></div>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* 4. 技能列表 */}
                  <div style={{flex:1, overflowY:'auto', marginBottom:'15px'}}>
                      <div style={{fontSize:'12px', color:'#aaa', marginBottom:'8px', borderBottom:'1px solid #444', paddingBottom:'4px'}}>已学会技能</div>
                      <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                          {selectedPet.moves.map((m, i) => (
                              <div key={i} style={{
                                  display:'flex', justifyContent:'space-between', alignItems:'center',
                                  background:'rgba(255,255,255,0.05)', padding:'8px 10px', borderRadius:'6px',
                                  borderLeft: `3px solid ${TYPES[m.t]?.color}`
                              }}>
                                  <div style={{flex:1}}>
                                      <div style={{fontSize:'12px', fontWeight:'bold', color:'#fff'}}>{m.name}</div>
                                      <div style={{fontSize:'10px', color: TYPES[m.t]?.color, marginTop:'2px'}}>{TYPES[m.t]?.name} | 威力 {m.p}</div>
                                  </div>
                                  <div style={{fontSize:'10px', color:'#888', textAlign:'right'}}>
                                      <div>PP</div>
                                      <div style={{color:'#fff'}}>{m.pp}/{m.maxPP||15}</div>
                                  </div>
                              </div>
                          ))}
                          {[...Array(4 - selectedPet.moves.length)].map((_, i) => (
                              <div key={`empty-${i}`} style={{
                                  padding:'8px', borderRadius:'6px', border:'1px dashed #444', 
                                  fontSize:'11px', color:'#555', textAlign:'center'
                              }}>
                                  - 空技能槽 -
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* 5. 底部操作按钮 */}
                  <div className="pc-actions-tech" style={{marginTop:'auto', paddingTop:'15px', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'10px'}}>
                    {selectedPartyIdx !== null && (
                      <button className="btn-tech primary" onClick={depositPokemon} style={{flex:1, padding:'10px', background:'#2196F3', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                        📥 存入仓库
                      </button>
                    )}
                    {selectedBoxIdx !== null && (
                      <>
                        <button className="btn-tech primary" onClick={withdrawPokemon} style={{flex:1, padding:'10px', background:'#4CAF50', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          📤 取出队伍
                        </button>
                        <button className="btn-tech danger" onClick={releasePokemon} style={{flex:1, padding:'10px', background:'#FF5252', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>
                          👋 放生
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{color: '#666', textAlign: 'center', marginTop: '100px', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <span style={{fontSize:'50px', marginBottom:'15px', opacity:0.3}}>🔍</span>
                    <div style={{fontSize:'14px'}}>请在左侧选择一只精灵<br/>查看详细数据分析</div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

   // ==========================================
  // [新增] 洗练专属界面 UI
  // ==========================================
  const renderRebirthModal = () => {
    if (!rebirthData) return null;

    const { original, preview } = rebirthData;
    const pillCount = inventory.misc.rebirth_pill || 0;
    
    // 【需求2修改】计算显示消耗
    const cost = original.isShiny ? 2 : 1;

    // 辅助显示属性行
    const StatRow = ({ label, oldVal, newVal, max }) => {
        // 计算进度条
        const oldPct = Math.min(100, (oldVal / max) * 100);
        const newPct = newVal ? Math.min(100, (newVal / max) * 100) : 0;
        const diff = newVal ? newVal - oldVal : 0;
        
        return (
            <div style={{display:'flex', alignItems:'center', marginBottom:'8px', fontSize:'12px'}}>
                <div style={{width:'30px', color:'#aaa', fontWeight:'bold'}}>{label}</div>
                <div style={{flex:1, background:'rgba(255,255,255,0.1)', height:'6px', borderRadius:'3px', margin:'0 10px', position:'relative'}}>
                    {/* 旧值 (灰色) */}
                    <div style={{position:'absolute', left:0, top:0, bottom:0, width:`${oldPct}%`, background:'#666', borderRadius:'3px'}}></div>
                    {/* 新值 (彩色) - 只有在预览时显示 */}
                    {newVal && (
                        <div style={{
                            position:'absolute', left:0, top:0, bottom:0, width:`${newPct}%`, 
                            background: diff >= 0 ? '#00E676' : '#FF5252', 
                            borderRadius:'3px', opacity: 0.8
                        }}></div>
                    )}
                </div>
                <div style={{width:'60px', textAlign:'right', fontFamily:'monospace'}}>
                    {newVal ? (
                        <>
                            <span style={{color: diff>=0?'#00E676':'#FF5252'}}>{newVal}</span>
                            {diff !== 0 && <span style={{fontSize:'10px', marginLeft:'2px'}}>{diff>0?'↑':'↓'}</span>}
                        </>
                    ) : (
                        <span style={{color:'#fff'}}>{oldVal}</span>
                    )}
                </div>
            </div>
        );
    };

    // 计算显示的属性 (为了对比，我们将原宠物也临时降级到5级来计算属性，这样对比才公平)
    const oldPetLv5 = { ...original, level: 5 };
    const oldStats = getStats(oldPetLv5);
    const newStats = preview ? getStats(preview) : null;

    // 计算总潜力 (IV总和)
    const getPotentialScore = (p) => Object.values(p.ivs).reduce((a,b)=>a+b,0);
    const oldScore = getPotentialScore(original);
    const newScore = preview ? getPotentialScore(preview) : 0;
    
    const getRank = (score) => {
        if (score > 150) return {t:'S+', c:'#FFD700'};
        if (score > 120) return {t:'S', c:'#FF4081'};
        if (score > 90) return {t:'A', c:'#AB47BC'};
        if (score > 60) return {t:'B', c:'#42A5F5'};
        return {t:'C', c:'#9E9E9E'};
    };

    return (
      <div className="modal-overlay" style={{backdropFilter:'blur(10px)', background:'rgba(0,0,0,0.8)'}}>
        <div className="rebirth-panel" style={{
            width:'90%', maxWidth:'380px', background:'linear-gradient(160deg, #2a1a4a 0%, #1a1a2e 100%)',
            borderRadius:'20px', padding:'20px', color:'#fff', border:'1px solid #4a3b78',
            boxShadow:'0 0 30px rgba(123, 31, 162, 0.4)'
        }}>
            
            {/* 标题 */}
            <div style={{textAlign:'center', marginBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'10px'}}>
                <div style={{fontSize:'20px', fontWeight:'bold', color:'#E1BEE7', textShadow:'0 0 10px #E1BEE7'}}>🧬 基因重组</div>
                <div style={{fontSize:'12px', color:'#B39DDB', marginTop:'4px'}}>重置为 Lv.5 | 刷新资质与性格</div>
            </div>

            {/* 核心对比区 */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                
                {/* 左侧：当前 */}
                <div style={{textAlign:'center', opacity: preview ? 0.5 : 1, transition:'0.3s'}}>
                    <div style={{fontSize:'30px', filter:'grayscale(0.5)'}}>{renderAvatar(original)}</div>
                    <div style={{fontSize:'12px', marginTop:'5px'}}>当前资质</div>
                    <div style={{fontSize:'18px', fontWeight:'bold', color: getRank(oldScore).c}}>{getRank(oldScore).t}</div>
                </div>

                {/* 中间：箭头 */}
                <div style={{fontSize:'24px', color:'#666'}}>➞</div>

                {/* 右侧：预览 */}
                <div style={{textAlign:'center', transform: preview ? 'scale(1.1)' : 'scale(1)', transition:'0.3s'}}>
                    {preview ? (
                        <>
                            <div style={{fontSize:'30px', filter: preview.isShiny ? 'drop-shadow(0 0 5px gold)' : 'none'}}>
                                {renderAvatar(preview)}
                            </div>
                            <div style={{fontSize:'12px', marginTop:'5px', color:'#00E676'}}>新资质</div>
                            <div style={{fontSize:'20px', fontWeight:'bold', color: getRank(newScore).c, textShadow:'0 0 10px currentColor'}}>
                                {getRank(newScore).t}
                            </div>
                        </>
                    ) : (
                        <div style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px dashed #666', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto'}}>
                            <span style={{fontSize:'20px', color:'#666'}}>?</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 属性详情 */}
            <div style={{background:'rgba(0,0,0,0.3)', borderRadius:'12px', padding:'15px', marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'10px', color:'#ccc'}}>
                    <span>性格: {NATURE_DB[original.nature].name}</span>
                    <span>➞</span>
                    <span style={{color: preview ? '#fff' : '#666', fontWeight:'bold'}}>
                        {preview ? NATURE_DB[preview.nature].name : '???'}
                    </span>
                </div>
                
                <StatRow label="HP" oldVal={oldStats.maxHp} newVal={newStats?.maxHp} max={100} />
                <StatRow label="物攻" oldVal={oldStats.p_atk} newVal={newStats?.p_atk} max={80} />
                <StatRow label="物防" oldVal={oldStats.p_def} newVal={newStats?.p_def} max={80} />
                <StatRow label="特攻" oldVal={oldStats.s_atk} newVal={newStats?.s_atk} max={80} />
                <StatRow label="特防" oldVal={oldStats.s_def} newVal={newStats?.s_def} max={80} />
                <StatRow label="速度" oldVal={oldStats.spd} newVal={newStats?.spd} max={80} />
            </div>

            {/* 操作区 */}
            <div style={{display:'flex', gap:'10px'}}>
                <button onClick={() => setRebirthData(null)} style={{
                    flex:1, padding:'12px', borderRadius:'10px', border:'none', background:'#424242', color:'#fff', fontWeight:'bold'
                }}>取消</button>
                
                {preview ? (
                    <button onClick={confirmRebirth} style={{
                        flex:2, padding:'12px', borderRadius:'10px', border:'none', 
                        background:'linear-gradient(90deg, #00C853, #64DD17)', color:'#fff', fontWeight:'bold',
                        boxShadow:'0 4px 10px rgba(0,200,83,0.4)'
                    }}>保存结果</button>
                ) : null}

                {/* 【需求2修改】按钮禁用逻辑和文本显示 */}
                <button onClick={executeReroll} disabled={pillCount < cost} style={{
                    flex:2, padding:'12px', borderRadius:'10px', border:'none', 
                    background: pillCount >= cost ? 'linear-gradient(90deg, #7B1FA2, #E91E63)' : '#555', 
                    color: pillCount >= cost ? '#fff' : '#999', fontWeight:'bold',
                    boxShadow: pillCount >= cost ? '0 4px 10px rgba(123,31,162,0.4)' : 'none',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', lineHeight:'1.2'
                }}>
                    <span>{preview ? '不满意? 重洗' : '开始洗练'}</span>
                    <span style={{fontSize:'10px', opacity:0.8}}>消耗: 💊 {cost} (余 {pillCount})</span>
                </button>
            </div>

        </div>
      </div>
    );
  };

    const renderTrainerCard = () => {
    const dexCount = caughtDex.length;
    const totalDex = POKEDEX.length;
    const progress = ((dexCount / totalDex) * 100).toFixed(1);
    const leader = party[0];

    return (
      <div className="screen" onClick={() => setView(getBackToMapView())} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{
            width: '650px', height: '450px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            border: '6px solid #fff', position: 'relative'
        }}>
          {/* 顶部条 */}
          <div style={{
              height: '70px', background: '#1a237e', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 30px', color: '#fff', borderBottom: '4px solid #FFD700'
          }}>
             <div style={{display:'flex', flexDirection:'column'}}>
                 <span style={{fontSize: '22px', fontWeight: '900', letterSpacing: '2px'}}>TRAINER PASSPORT</span>
                 <span style={{fontSize: '10px', opacity: 0.7, letterSpacing: '1px'}}>ID: {Math.floor(party[0]?.uid || 9527).toString().slice(-8)}</span>
             </div>
             <div style={{textAlign:'right'}}>
                 <div style={{fontSize:'12px', opacity:0.8}}>REGION</div>
                 <div style={{fontWeight:'bold'}}>KANTO</div>
             </div>
          </div>

          {/* 内容区 */}
          <div style={{flex: 1, display: 'flex', padding: '25px'}}>
             
             {/* 左侧：头像与信息 */}
             <div style={{width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '2px dashed #ccc', paddingRight: '25px'}}>
                <div style={{
                    width: '130px', height: '130px', background: '#fff', borderRadius: '50%', 
                    border: '4px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '70px', marginBottom: '15px', overflow: 'hidden', boxShadow:'0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    {renderAvatar(leader) || '🤠'}
                </div>
                
                {/* 名字显示 */}
                <div style={{fontSize: '24px', fontWeight: '900', color: '#333', marginBottom:'5px'}}>{trainerName}</div>
                
                {/* 称号选择器 */}
                <div style={{position:'relative', width:'100%'}}>
                    <select 
                        value={currentTitle} 
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        style={{
                            width:'100%', padding:'5px 10px', borderRadius:'15px', border:'1px solid #2196F3',
                            background:'#E3F2FD', color:'#1565C0', fontWeight:'bold', fontSize:'12px',
                            appearance:'none', textAlign:'center', cursor:'pointer'
                        }}
                    >
                        {unlockedTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', fontSize:'10px', color:'#1565C0', pointerEvents:'none'}}>▼</div>
                </div>
             </div>

             {/* 右侧：数据统计 */}
             <div style={{flex: 1, paddingLeft: '30px', display: 'flex', flexDirection: 'column'}}>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Money</div>
                        <div style={{fontSize: '20px', color: '#FBC02D', fontWeight: '900'}}>💰 {gold}</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Pokedex</div>
                        <div style={{fontSize: '20px', color: '#333', fontWeight: '900'}}>{dexCount} <span style={{fontSize:'12px', color:'#999', fontWeight:'normal'}}>/ {totalDex}</span></div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Champion</div>
                        <div style={{fontSize: '20px', color: '#FF5722', fontWeight: '900'}}>🏆 {leagueWins}</div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.5)', padding:'10px', borderRadius:'10px'}}>
                        <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform:'uppercase'}}>Progress</div>
                        <div style={{fontSize: '20px', color: '#2196F3', fontWeight: '900'}}>{progress}%</div>
                    </div>
                </div>

                {/* 徽章展示区 */}
                <div style={{background: '#fff', borderRadius: '12px', padding: '15px', flex: 1, border:'1px solid #eee', boxShadow:'inset 0 2px 5px rgba(0,0,0,0.05)'}}>
                    <div style={{fontSize: '10px', color: '#aaa', marginBottom: '10px', fontWeight: 'bold', letterSpacing:'1px'}}>BADGES COLLECTION</div>
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                        {badges.length === 0 ? <span style={{fontSize:'12px', color:'#ddd', fontStyle:'italic'}}>暂未获得徽章...</span> : 
                         badges.map((b, i) => (
                             <div key={i} style={{
                                 width:'36px', height:'36px', background:'#f0f0f0', borderRadius:'50%',
                                 display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px',
                                 boxShadow:'0 2px 5px rgba(0,0,0,0.1)', border:'2px solid #fff'
                             }} title="Gym Badge">
                                 {b}
                             </div>
                         ))
                        }
                    </div>
                </div>

             </div>
          </div>

          {/* 底部关闭 */}
          <button onClick={() => setView('grid_map')} style={{
              position: 'absolute', bottom: '20px', right: '20px',
              background: '#333', color: '#fff', border: 'none', padding: '10px 30px',
              borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
              CLOSE
          </button>
        </div>
      </div>
    );
  };
  // ==========================================
  // [修复] 进化动画的 Hooks (必须放在主组件顶层)
  // ==========================================
  
  // 1. 动态注入 CSS 动画
  useEffect(() => {
      const styleId = 'evo-anim-style';
      if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
              @keyframes evo-shake { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(0); } 100% { transform: scale(1); filter: brightness(1); } }
              @keyframes evo-flash { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
              @keyframes evo-pop { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
              @keyframes bg-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `;
          document.head.appendChild(style);
      }
  }, []);

  // 2. 自动推进动画步骤 (监听 evoAnim 状态)
  useEffect(() => {
      if (!evoAnim) return; // 如果没有进化事件，直接返回
      
      const { step } = evoAnim;
      let timer;
      
      if (step === 0) {
          // 阶段0: 展示原形 -> 1.5秒后开始发光
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 1 })), 1500);
      } else if (step === 1) {
          // 阶段1: 快速闪烁/变黑 -> 2.5秒后进化
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 2 })), 2500);
      } else if (step === 2) {
          // 阶段2: 白屏闪光 -> 0.5秒后展示新形态
          timer = setTimeout(() => setEvoAnim(prev => ({ ...prev, step: 3 })), 500);
      }
      return () => clearTimeout(timer);
  }, [evoAnim]); // 依赖项为 evoAnim

    // ==========================================
  // [修复] 经典进化动画场景 (移除内部 Style 标签防止报错)
  // ==========================================
  const renderEvolutionScene = () => {
    if (!evoAnim) return null;
    const { oldPet, newPet, step } = evoAnim;

   
    const finishEvo = () => {
        if (step < 3) return; // 动画没放完不能跳过
        
        const newParty = [...party];
        // 继承旧属性，覆盖新种族值
        Object.assign(newParty[evoAnim.targetIdx], {
            ...newPet,
            uid: oldPet.uid, level: oldPet.level, exp: oldPet.exp, nextExp: oldPet.nextExp,
            moves: oldPet.moves, equip: oldPet.equip, equips: oldPet.equips,
            nature: oldPet.nature, ivs: oldPet.ivs, evs: oldPet.evs,
            isShiny: oldPet.isShiny, isFusedShiny: oldPet.isFusedShiny,
            intimacy: oldPet.intimacy, charm: oldPet.charm,
            trait: newPet.trait || oldPet.trait,
            secondaryType: newPet.type2 || oldPet.secondaryType,
            sectId: oldPet.sectId, sectLevel: oldPet.sectLevel,
            devilFruit: oldPet.devilFruit,
            diversityRng: oldPet.diversityRng, speedRng: oldPet.speedRng,
            cursedTechnique: oldPet.cursedTechnique, hasDomain: oldPet.hasDomain, domainType: oldPet.domainType,
            customBaseStats: oldPet.customBaseStats,
            canEvolve: false, pendingLearnMove: oldPet.pendingLearnMove
        });
        // 进化后回满血
        const stats = getStats(newParty[evoAnim.targetIdx]);
        newParty[evoAnim.targetIdx].currentHp = stats.maxHp;
        
        setParty(newParty);
        
        // 开图鉴
        if (!caughtDex.includes(newPet.id)) setCaughtDex(prev => [...prev, newPet.id]);
        
        updateAchStat({ totalEvolutions: 1 });
        setEvoAnim(null); // 关闭动画
    };

    return (
        <div className="modal-overlay" style={{
            position:'fixed', inset:0, background:'#000', zIndex: 9999,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            color:'#fff'
        }}>
            {/* 背景光效 */}
            <div style={{
                position:'absolute', width:'100vw', height:'100vh', 
                background: step >= 2 ? 'radial-gradient(circle, #FFD700 0%, #000 70%)' : 'radial-gradient(circle, #222 0%, #000 90%)',
                transition: 'background 0.5s'
            }}></div>
            
            {/* 旋转光束 (仅完成时) */}
            {step === 3 && (
                <div style={{
                    position:'absolute', width:'800px', height:'800px', 
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 20deg, transparent 40deg)',
                    animation: 'bg-spin 10s linear infinite'
                }}></div>
            )}

            {/* 核心展示区 */}
            <div style={{position:'relative', zIndex:10, textAlign:'center'}}>
                
                {/* 标题 */}
                <div style={{fontSize:'24px', marginBottom:'40px', minHeight:'30px'}}>
                    {step < 2 ? `什么？ ${oldPet.name} 的样子...` : `恭喜！进化成了 ${newPet.name}！`}
                </div>

                {/* 精灵图 */}
                <div style={{
                    width:'200px', height:'200px', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'120px', margin:'0 auto', position:'relative'
                }}>
                    {/* 旧形态 */}
                    {step < 2 && (
                        <div style={{
                            animation: step === 1 ? 'evo-shake 0.2s infinite' : 'none',
                            transition: '0.5s'
                        }}>
                            {renderAvatar(oldPet)}
                        </div>
                    )}

                    {/* 新形态 */}
                    {step >= 2 && (
                        <div style={{animation: 'evo-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'}}>
                            {renderAvatar(newPet)}
                        </div>
                    )}

                    {/* 白屏闪光遮罩 */}
                    {step === 2 && (
                        <div style={{
                            position:'fixed', inset:0, background:'#fff', 
                            animation: 'evo-flash 0.5s forwards', pointerEvents:'none'
                        }}></div>
                    )}
                </div>

                {/* 按钮 */}
                {step === 3 && (
                    <button onClick={finishEvo} style={{
                        marginTop:'50px', padding:'15px 40px', fontSize:'18px', borderRadius:'30px',
                        border:'none', background:'#FFD700', color:'#333', fontWeight:'bold', cursor:'pointer',
                        animation: 'popIn 0.5s'
                    }}>
                        太棒了！(Space)
                    </button>
                )}
            </div>
        </div>
    );
  };

   // ==========================================
  // [美化] 事件/宝箱弹窗 (已修复崩溃 Bug)
  // ==========================================
  const renderEvent = () => {
    // 🔥 核心修复：如果数据为空，直接不渲染，防止读取 .type 时报错
    if (!eventData) return null;

    return (
      <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
      }}>
        <div className="event-modal-card" style={{
            width: '320px', background: '#fff', borderRadius: '20px',
            padding: '30px 20px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {/* 图标动画 */}
          <div style={{fontSize: '60px', marginBottom: '15px', animation: 'bounce 1s infinite'}}>
              {eventData.type === 'LOOT' ? '🎁' : '🏕️'}
          </div>
          
          {/* 标题 */}
          <h3 style={{margin: '0 0 10px 0', color: '#333', fontSize: '20px', fontWeight: '800'}}>
              {eventData.title}
          </h3>
          
          {/* 描述内容 */}
          <div style={{
              background: '#f5f7fa', padding: '15px', borderRadius: '12px',
              color: '#555', fontSize: '14px', lineHeight: '1.5', marginBottom: '25px',
              border: '1px solid #eee'
          }}>
              {eventData.desc}
          </div>
          
          {/* 确认按钮 */}
          <button 
              className="btn-confirm-refined" 
              onClick={handleEventConfirm}
              style={{
                  width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                  color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
              收下奖励
          </button>
        </div>
      </div>
    );
  };



  if (!loaded) return <div>Loading...</div>;

 return (
    <div className="cute-theme">
         {/* 🎵 [新增] 隐藏的音频元素 */}
      <audio ref={audioRef} loop />

     
      {view === 'menu' && renderMenu()}
      {view === 'starter_select' && renderStarterSelect()}
      {view === 'pokedex' && renderPokedex()}
      {view === 'skill_dex' && renderSkillDex()}
      {view === 'fruit_dex' && renderFruitDex()}
      {view === 'world_map' && renderWorldMap()}
      {view === 'bag' && renderBag()}
      {view === 'grid_map' && renderGridMap()}
      {view === 'battle' && renderBattle()}
      {view === 'team' && renderTeam()}
      {view === 'event' && renderEvent()}
      {view === 'trainer_card' && renderTrainerCard()}
      {view === 'move_forget' && renderMoveForget()}
      {view === 'league' && renderLeague()}
      {view === 'sect_summit' && renderSectSummit()} 
      {view === 'infinity_castle' && renderInfinityCastle()}
      {view === 'name_input' && renderNameInput()}
      {view === 'fishing_game' && renderFishingGame()}
    {view === 'beauty_contest' && renderBeautyContest()}
      {view === 'housing' && renderHousing()}
      {view === 'achievements' && renderAchievements()}
      {view === 'guide' && renderGuide()}
      {view === 'locked' && renderLocked()}
      {renderResultModal()} 
      {renderActivityModal()} 
      {renderEquipModal()} 
      {renderDialogOverlay()} 
      {renderPvPModal()} 
      {renderSectTeamModal()}
      {renderRebirthModal()} 
      {fusionMode && renderFusion()} 
      {renderAvatarSelector()}
      {renderPetDetailModal()}

      {/* 战斗果实详情弹窗 */}
      {battleFruitDetail && (() => {
        const df = battleFruitDetail;
        const rarityConf = FRUIT_RARITY_CONFIG[df.rarity] || {};
        const tf = df.transform || {};
        const tm = df.transformMove;
        const statLabels = [];
        if (tf.atkMult) statLabels.push(`物攻 ×${tf.atkMult}`);
        if (tf.sAtkMult) statLabels.push(`特攻 ×${tf.sAtkMult}`);
        if (tf.defMult) statLabels.push(`物防 ×${tf.defMult}`);
        if (tf.sDefMult) statLabels.push(`特防 ×${tf.sDefMult}`);
        if (tf.spdMult) statLabels.push(`速度 ×${tf.spdMult}`);
        if (tf.movePowerBoost) statLabels.push(`技能威力 +${Math.round(tf.movePowerBoost*100)}%`);
        if (tf.healPerTurn) statLabels.push(`每回合回复 ${Math.round(tf.healPerTurn*100)}% HP`);
        if (tf.typeImmune) statLabels.push(`免疫 ${TYPES[tf.typeImmune]?.name || tf.typeImmune} 属性`);
        if (tf.ignoreDefPercent) statLabels.push(`无视 ${Math.round(tf.ignoreDefPercent*100)}% 防御`);
        if (tf.dotPerTurn) statLabels.push(`每回合持续伤害 ${Math.round(tf.dotPerTurn*100)}%`);
        if (tf.cancelEnemyFruit) statLabels.push('可取消对手果实变身');
        if (tf.fixedDmgPercent) statLabels.push(`固定比例伤害 ${Math.round(tf.fixedDmgPercent*100)}%`);
        if (tf.critBoost) statLabels.push(`暴击率 +${tf.critBoost}`);
        if (tf.selfDotPerTurn) statLabels.push(`每回合自伤 ${Math.round(tf.selfDotPerTurn*100)}%`);
        if (tf.hpDrain) statLabels.push(`吸血 ${Math.round(tf.hpDrain*100)}%`);
        if (tf.accDown) statLabels.push(`降低敌方命中 ${tf.accDown} 级`);
        if (tf.enemySpdDown) statLabels.push(`降低敌方速度 ${tf.enemySpdDown} 级`);
        return (
          <div onClick={() => setBattleFruitDetail(null)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:10600
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              background:'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius:'16px',
              padding:'24px', maxWidth:'420px', width:'90%', color:'#fff', border:`2px solid ${rarityConf.color || '#666'}`,
              boxShadow:`0 0 30px ${rarityConf.color || '#666'}40`
            }}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{fontSize:'28px'}}>{(() => { const fi = getFruitIcon(df.id); return typeof fi === 'object' ? (fi.symbol || '🍎') : fi; })()}</span>
                  <div>
                    <div style={{fontSize:'18px', fontWeight:'bold'}}>{df.name}</div>
                    <div style={{fontSize:'12px', color: rarityConf.color, fontWeight:'bold'}}>
                      {rarityConf.label} · {FRUIT_CATEGORY_NAMES[df.category] || df.category}
                    </div>
                  </div>
                </div>
                <button onClick={() => setBattleFruitDetail(null)} style={{background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'50%', fontSize:'16px', cursor:'pointer'}}>×</button>
              </div>
              <div style={{fontSize:'13px', color:'#b0b0b0', marginBottom:'14px', lineHeight:'1.6'}}>{df.desc}</div>
              <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'12px', marginBottom:'12px'}}>
                <div style={{fontSize:'13px', fontWeight:'bold', color:'#64b5f6', marginBottom:'8px'}}>变身效果 (持续{df.duration}回合)</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                  {statLabels.map((s,i) => (
                    <span key={i} style={{background:'rgba(100,181,246,0.15)', border:'1px solid rgba(100,181,246,0.3)', borderRadius:'6px', padding:'3px 8px', fontSize:'11px', color:'#90caf9'}}>{s}</span>
                  ))}
                </div>
              </div>
              {tm && (
                <div style={{background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'12px'}}>
                  <div style={{fontSize:'13px', fontWeight:'bold', color:'#ff9800', marginBottom:'6px'}}>变身专属技能</div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{background: TYPES[tm.t]?.color || '#888', color:'#fff', padding:'2px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:'bold'}}>{TYPES[tm.t]?.name || tm.t}</span>
                    <span style={{fontWeight:'bold', fontSize:'14px'}}>{tm.name}</span>
                    <span style={{color:'#aaa', fontSize:'12px'}}>威力{tm.p} / 命中{tm.acc} / PP{tm.pp}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 缚誓选择弹窗 */}
      {vowModal && battle && (() => {
        const p = battle.playerCombatStates?.[battle.activeIdx];
        if (!p) return null;
        const curCE = p.cursedEnergy || 0;
        const maxCE = p.maxCE || 0;
        const ceRatio = maxCE > 0 ? curCE / maxCE : 0;
        return (
          <div onClick={() => setVowModal(false)} style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width:'92%', maxWidth:'420px', maxHeight:'80vh', 
              background:'linear-gradient(170deg, #0f0a2e, #1a1040)', borderRadius:'20px',
              border:'1px solid rgba(99,102,241,0.3)', boxShadow:'0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
              display:'flex', flexDirection:'column', overflow:'hidden'
            }}>
              {/* 头部 */}
              <div style={{padding:'20px 20px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'18px', fontWeight:'800', color:'#fff', letterSpacing:'1px'}}>缚誓之术</div>
                    <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'2px'}}>以牺牲换取力量的禁术</div>
                  </div>
                  <button onClick={() => setVowModal(false)} style={{background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'50%', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>×</button>
                </div>
                {/* 咒力条 */}
                <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'8px'}}>
                  <div style={{fontSize:'11px', color:'#CE93D8', fontWeight:'700', flexShrink:0}}>咒力</div>
                  <div style={{flex:1, height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden'}}>
                    <div style={{width:`${ceRatio*100}%`, height:'100%', borderRadius:'4px', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s', boxShadow:'0 0 8px rgba(224,64,251,0.4)'}} />
                  </div>
                  <span style={{fontSize:'12px', color:'#E1BEE7', fontWeight:'700', flexShrink:0}}>{curCE}/{maxCE}</span>
                </div>
              </div>

              {/* 缚誓列表 */}
              <div style={{flex:1, overflowY:'auto', padding:'12px 16px'}}>
                {BINDING_VOWS.map((v, i) => {
                  const canUse = curCE >= (v.ceCost || 0);
                  const costs = [];
                  if (v.ceCost) costs.push({label:`消耗${v.ceCost}CE`, color:'#CE93D8'});
                  if (v.sacrifice.hpPercent) costs.push({label:`HP-${v.sacrifice.hpPercent*100}%`, color:'#EF5350'});
                  if (v.sacrifice.cePercent) costs.push({label:`燃烧${v.sacrifice.cePercent*100}%CE`, color:'#FF7043'});
                  if (v.sacrifice.noSwitch) costs.push({label:`禁换${v.sacrifice.turns}回合`, color:'#78909C'});
                  if (v.sacrifice.defMult) costs.push({label:`防御×${v.sacrifice.defMult}`, color:'#90A4AE'});
                  if (v.sacrifice.revealMoves) costs.push({label:'暴露技能', color:'#78909C'});
                  const rewards = [];
                  if (v.reward.atkMult) rewards.push({label:`伤害×${v.reward.atkMult}`, color:'#FF7043'});
                  if (v.reward.nextMovePower) rewards.push({label:`下招×${v.reward.nextMovePower}`, color:'#FFD54F'});
                  if (v.reward.defMult) rewards.push({label:`防御×${v.reward.defMult}`, color:'#66BB6A'});
                  if (v.reward.spdMult) rewards.push({label:`速度×${v.reward.spdMult}`, color:'#42A5F5'});
                  if (v.reward.ceMult) rewards.push({label:`CE回复×${v.reward.ceMult}`, color:'#CE93D8'});
                  return (
                    <div key={v.id} 
                      onClick={() => { if (canUse) { setVowModal(false); executeBindingVow(v.id); } }}
                      style={{
                        background: canUse ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                        border: `1px solid ${canUse ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)'}`,
                        borderRadius:'14px', padding:'14px', marginBottom:'10px',
                        cursor: canUse ? 'pointer' : 'not-allowed',
                        opacity: canUse ? 1 : 0.45,
                        transition:'all 0.2s'
                      }}
                      onMouseOver={e => { if(canUse) { e.currentTarget.style.background='rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'; } }}
                      onMouseOut={e => { e.currentTarget.style.background=canUse?'rgba(255,255,255,0.04)':'rgba(255,255,255,0.01)'; e.currentTarget.style.borderColor=canUse?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.04)'; }}
                    >
                      {/* 标题行 */}
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <div style={{width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg, #1A237E, #42A5F5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'900', color:'#fff'}}>{i+1}</div>
                          <span style={{fontSize:'15px', fontWeight:'800', color:'#fff'}}>{v.name}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                          {canUse 
                            ? <span style={{fontSize:'10px', padding:'2px 8px', borderRadius:'8px', background:'rgba(76,175,80,0.15)', color:'#66BB6A', fontWeight:'700'}}>可用</span>
                            : <span style={{fontSize:'10px', padding:'2px 8px', borderRadius:'8px', background:'rgba(239,83,80,0.15)', color:'#EF5350', fontWeight:'700'}}>CE不足</span>
                          }
                          <span style={{fontSize:'10px', color:'rgba(255,255,255,0.3)'}}>{v.reward.turns}回合</span>
                        </div>
                      </div>
                      {/* 代价 */}
                      <div style={{marginBottom:'6px'}}>
                        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:'600', marginBottom:'4px', letterSpacing:'0.5px'}}>代价</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                          {costs.map((c, ci) => (
                            <span key={ci} style={{fontSize:'10px', padding:'2px 8px', borderRadius:'6px', background:`${c.color}15`, color:c.color, fontWeight:'600', border:`1px solid ${c.color}20`}}>{c.label}</span>
                          ))}
                        </div>
                      </div>
                      {/* 效果 */}
                      <div>
                        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:'600', marginBottom:'4px', letterSpacing:'0.5px'}}>效果</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                          {rewards.map((r, ri) => (
                            <span key={ri} style={{fontSize:'10px', padding:'2px 8px', borderRadius:'6px', background:`${r.color}15`, color:r.color, fontWeight:'600', border:`1px solid ${r.color}20`}}>{r.label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {renderEvolutionScene()}

      {/* 恶魔果实选择弹窗 */}
      {fruitPickModal && (() => {
        const fruits = fruitInventory.map((fid, i) => ({ idx: i, fid, fruit: getFruitById(fid) })).filter(x => x.fruit);
        const pet = party.find(p => p.uid === fruitPickModal.petUid);
        const currentFruit = pet?.devilFruit ? getFruitById(pet.devilFruit) : null;
        return (
          <div style={{
            position:'fixed', inset:0, zIndex:10500,
            background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)',
            display:'flex', justifyContent:'center', alignItems:'center',
            animation:'fadeIn 0.25s ease-out'
          }} onClick={() => setFruitPickModal(null)}>
            <div style={{
              background:'linear-gradient(160deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius:'20px', width:'90%', maxWidth:'520px', maxHeight:'80vh',
              boxShadow:'0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              display:'flex', flexDirection:'column', overflow:'hidden',
              border:'1px solid rgba(255,255,255,0.08)'
            }} onClick={e => e.stopPropagation()}>
              {/* 头部 */}
              <div style={{
                padding:'18px 20px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)',
                background:'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
              }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'16px', fontWeight:'800', color:'#fff', letterSpacing:'0.5px'}}>
                      选择恶魔果实
                    </div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'3px'}}>
                      为 <span style={{color:'#64B5F6', fontWeight:'600'}}>{pet?.name || '精灵'}</span> 选择一个果实装备
                      {currentFruit && <span> · 当前: <span style={{color: FRUIT_RARITY_CONFIG[currentFruit.rarity]?.color || '#fff'}}>{currentFruit.name}</span></span>}
                    </div>
                  </div>
                  <button onClick={() => setFruitPickModal(null)} style={{
                    width:'32px', height:'32px', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)',
                    background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', fontSize:'16px',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s'
                  }}>✕</button>
                </div>
              </div>
              {/* 果实列表 */}
              <div style={{
                flex:1, overflowY:'auto', padding:'12px 14px',
                display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'10px',
                scrollbarWidth:'thin', scrollbarColor:'rgba(255,255,255,0.15) transparent'
              }}>
                {fruits.length === 0 ? (
                  <div style={{gridColumn:'1/-1', textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.3)', fontSize:'13px'}}>
                    背包中暂无恶魔果实
                  </div>
                ) : fruits.map(({idx, fid, fruit}) => {
                  const rc = FRUIT_RARITY_CONFIG[fruit.rarity] || {};
                  const catName = FRUIT_CATEGORY_NAMES[fruit.category] || '';
                  return (
                    <div key={idx} onClick={() => {
                      setFruitInventory(prev => { const n = [...prev]; n.splice(idx, 1); return n; });
                      const pidx = party.findIndex(p => p.uid === fruitPickModal.petUid);
                      if (pidx !== -1) {
                        const np = [...party];
                        if (np[pidx].devilFruit) setFruitInventory(prev => [...prev, np[pidx].devilFruit]);
                        np[pidx] = {...np[pidx], devilFruit: fid}; setParty(np); setViewStatPet(np[pidx]);
                      }
                      setFruitPickModal(null);
                    }} style={{
                      background:`linear-gradient(145deg, ${rc.color || '#666'}18, rgba(255,255,255,0.03))`,
                      border:`1px solid ${rc.color || '#555'}30`,
                      borderRadius:'14px', padding:'14px 10px 12px', cursor:'pointer',
                      transition:'all 0.25s cubic-bezier(.22,1,.36,1)', position:'relative', overflow:'hidden'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${rc.color || '#666'}30`;
                      e.currentTarget.style.borderColor = `${rc.color || '#666'}60`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                      e.currentTarget.style.borderColor = `${rc.color || '#555'}30`;
                    }}>
                      {/* 稀有度光晕 */}
                      <div style={{
                        position:'absolute', top:'-20px', right:'-20px', width:'60px', height:'60px',
                        background:`radial-gradient(circle, ${rc.color || '#666'}15, transparent 70%)`,
                        borderRadius:'50%', pointerEvents:'none'
                      }} />
                      {/* 图标 */}
                      <div style={{display:'flex', justifyContent:'center', marginBottom:'8px'}}>
                        {renderFruitCSSIcon(fid, 42)}
                      </div>
                      {/* 名称 */}
                      <div style={{
                        textAlign:'center', fontSize:'13px', fontWeight:'700',
                        color: rc.color || '#ccc', lineHeight:'1.3', marginBottom:'4px'
                      }}>{fruit.name}</div>
                      {/* 标签行 */}
                      <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'6px', flexWrap:'wrap'}}>
                        <span style={{
                          fontSize:'9px', padding:'2px 6px', borderRadius:'8px',
                          background:`${rc.color || '#666'}20`, color: rc.color || '#aaa',
                          fontWeight:'600', border:`1px solid ${rc.color || '#666'}25`
                        }}>{rc.label || '普通'}</span>
                        <span style={{
                          fontSize:'9px', padding:'2px 6px', borderRadius:'8px',
                          background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.45)',
                          fontWeight:'600'
                        }}>{catName}</span>
                      </div>
                      {/* 描述 */}
                      <div style={{
                        fontSize:'10px', color:'rgba(255,255,255,0.35)', lineHeight:'1.4',
                        textAlign:'center', display:'-webkit-box', WebkitLineClamp:2,
                        WebkitBoxOrient:'vertical', overflow:'hidden'
                      }}>{fruit.desc}</div>
                      {/* 持续回合 */}
                      <div style={{
                        textAlign:'center', marginTop:'6px', fontSize:'9px',
                        color:'rgba(255,255,255,0.3)'
                      }}>
                        变身持续 <span style={{color:'#FFD740', fontWeight:'600'}}>{fruit.duration}</span> 回合
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 底部提示 */}
              <div style={{
                padding:'10px 16px', borderTop:'1px solid rgba(255,255,255,0.06)',
                display:'flex', justifyContent:'space-between', alignItems:'center'
              }}>
                <span style={{fontSize:'10px', color:'rgba(255,255,255,0.25)'}}>
                  拥有 {fruits.length} 个果实
                </span>
                <button onClick={() => setFruitPickModal(null)} style={{
                  background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)',
                  border:'1px solid rgba(255,255,255,0.08)', padding:'6px 16px',
                  borderRadius:'10px', fontSize:'11px', cursor:'pointer', fontWeight:'600'
                }}>取消</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 成就解锁通知 */}
      {achNotification && (() => {
        const ach = achNotification;
        const rar = ACH_RARITY[ach.rarity];
        const cat = ACH_CATEGORY[ach.cat];
        return (
          <div style={{
            position:'fixed', top:'20px', right:'20px', zIndex:10000,
            background:`linear-gradient(135deg, rgba(15,10,40,0.95), rgba(25,20,50,0.95))`,
            backdropFilter:'blur(20px)',
            border:`1px solid ${rar.color}50`,
            borderRadius:'16px', padding:'14px 18px', minWidth:'280px', maxWidth:'360px',
            boxShadow:`0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${rar.color}20`,
            animation:'achSlideIn 0.4s cubic-bezier(.22,1,.36,1)',
            display:'flex', alignItems:'center', gap:'12px'
          }}>
            <div style={{
              width:'42px', height:'42px', borderRadius:'12px', flexShrink:0,
              background:`linear-gradient(135deg, ${rar.color}30, ${rar.color}10)`,
              border:`1px solid ${rar.color}40`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'
            }}>
              {cat?.icon || '🏆'}
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:'10px', color:rar.color, fontWeight:'700', letterSpacing:'1px', marginBottom:'2px'}}>
                成就解锁 {'★'.repeat(rar.stars)}
              </div>
              <div style={{fontSize:'14px', fontWeight:'800', color:'#fff'}}>
                {ach.name}
              </div>
              <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'1px', lineHeight:'1.4'}}>
                {ach.desc}
              </div>
              {ach.reward?.gold && (
                <div style={{fontSize:'10px', color:'#FFD700', fontWeight:'700', marginTop:'3px'}}>
                  +{ach.reward.gold.toLocaleString()} 金币
                </div>
              )}
            </div>
          </div>
        );
      })()}
      {/* 全局消息弹窗 */}
      {messageBox && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s'}} onClick={() => { if(messageBox.callback) messageBox.callback(); setMessageBox(null); }}>
            <div style={{background: 'white', padding: '25px', borderRadius: '16px', maxWidth: '80%', width: '300px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'scaleIn 0.2s'}} onClick={e => e.stopPropagation()}>
                <div style={{fontSize: '40px', marginBottom: '15px'}}>💡</div>
                <div style={{fontSize: '16px', color: '#333', lineHeight: '1.6', marginBottom: '25px'}}>{messageBox.text}</div>
                <button onClick={() => { if(messageBox.callback) messageBox.callback(); setMessageBox(null); }} style={{background: '#2196F3', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold'}}>确定 (Space)</button>
            </div>
        </div>
      )}
    </div>
  );
}
