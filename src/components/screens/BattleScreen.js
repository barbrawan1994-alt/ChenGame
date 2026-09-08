import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Backpack } from 'lucide-react';
import { BALLS } from '../../data/items';
import BattleImpact from '../../components/battle/BattleImpact';
import BattleTacticsBar from '../../components/battle/BattleTacticsBar';
import { BERRIES } from '../../data/items';
import { BIJUU_TRANSFORM_COST_PCT } from '../../data/naruto';
import { buildMoveForecast } from '../../utils/moveForecast';
import { calcGeneralsTotalBonus } from '../../data/generals';
import { CombatFamilyTabs } from '../../components/battle/BattleTacticsBar';
import { COMBO_JUTSU_LIST } from '../../data/constants';
import { DOMAINS } from '../../data/jujutsu';
import { EnhancedBattleMessage } from '../../engines/BattleEnhancements';
import { EnhancedHPBar } from '../../engines/BattleEnhancements';
import { EnhancedMoveButton } from '../../engines/BattleEnhancements';
import { FACTION_PORTRAIT_COLORS } from '../../data/generals';
import { FRUIT_RARITY_CONFIG } from '../../data/devilfruits';
import { GENERAL_RARITY_CONFIG } from '../../data/generals';
import { getBurstBlock } from '../../utils/battleTactics';
import { getCombatFamily } from '../../utils/battleTactics';
import { getEffectiveChakraCost } from '../../utils/combatRules';
import { getFruitById } from '../../data/devilfruits';
import { getGangSkillBonus } from '../../data/gang';
import { getGangSkills } from '../../data/gang';
import { getGeneralPortrait } from '../../data/generals';
import { getNinjaRank } from '../../data/naruto';
import { getNpcSprite } from '../../SpriteMap';
import { getSpiritDomainRule } from '../../data';
import { getUltraTransformBlock } from '../../utils/ultraRules';
import { GSAPAnimations } from '../../engines/AnimationEngine';
import { isSelfTargetingCombatMove } from '../../utils/combatRules';
import { KAIJU_RANKS } from '../../data/kaiju';
import { KAIJU_STYLES } from '../../data/kaiju';
import { LogOut } from 'lucide-react';
import { MAPS } from '../../data';
import { MEDICINES } from '../../data/items';
import { renderBallCSS } from '../../components/ItemIcons';
import { renderMedCSS } from '../../components/ItemIcons';
import { SECT_DB } from '../../data';
import { SECT_MOMENTUM_MAX } from '../../utils/sectLogic';
import { Shield } from 'lucide-react';
import { SkillCastEffect } from '../../engines/BattleEnhancements';
import { Sparkles } from 'lucide-react';
import { TacticalStatus } from '../../components/battle/BattleTacticsBar';
import { TRAIT_DB } from '../../data/traits';
import { TYPES } from '../../data/types';
import { ULTRA_BY_ID } from '../../data/ultra';
import { WandSparkles } from 'lucide-react';
import { WEATHERS } from '../../data';

export default function BattleScreen({
  achStats,
  animEffect,
  autoBattle,
  battle,
  battleBagTab,
  battleImpact,
  battleMoveFamily,
  battleSpeed,
  battleTooltip,
  calculateCatchRate,
  canUseCombatMove,
  canUseCombo,
  comboUsedThisBattle,
  executeBijuuTransform,
  executeChargeCE,
  executeComboAttack,
  executeDevilFruit,
  executeDomainExpansion,
  executeDoubleRound,
  executeDoubleTurn,
  executeTurn,
  executeUltraTransform,
  gang,
  getBattleDirectiveStatus,
  getBattleResourceValue,
  getFruitMinTurn,
  getGangInfo,
  getMoveTypeMultiplier,
  getStats,
  getTypeMod,
  getUnitTypeList,
  handleCatch,
  handleDefeat,
  handlePvPInput,
  handleRun,
  inventory,
  isComboJutsuAvailableInDouble,
  kingdomWar,
  narutoState,
  normalizeBerriesInventory,
  party,
  reducedBattleEffects,
  renderAvatar,
  renderEnvironmentOverlay,
  renderGeneralPortraitFace,
  RenderShinyStars,
  sectPlayer,
  setAutoBattle,
  setBattle,
  setBattleBagTab,
  setBattleFruitDetail,
  setBattleGangDetail,
  setBattleGeneralDetail,
  setBattleMoveFamily,
  setBattleSpeed,
  setBattleTooltip,
  setPetPicker,
  setReducedBattleEffects,
  setShowBallMenu,
  setShowKeyHelp,
  setShowTypeChart,
  setViewStatPet,
  setVowModal,
  showBallMenu,
  showMapToast,
  switchPokemon,
  useBattleItem,
  weather
}) {
    if (!battle) { return null; }
    if (!Array.isArray(battle.playerCombatStates) || !Array.isArray(battle.enemyParty)) {
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', width: '100%', color: '#fff', fontSize: '16px', fontWeight: '600' }}>⏳ 战斗状态恢复中...</div>;
    }
    
    const isDoubleBattle = battle.isDouble;
    const p = isDoubleBattle
      ? battle.playerCombatStates?.[battle.activeIdxs?.[0]]
      : battle.playerCombatStates?.[battle.activeIdx];
    const e = isDoubleBattle
      ? battle.enemyParty?.[battle.enemyActiveIdxs?.[0]]
      : battle.enemyParty?.[battle.enemyActiveIdx];
    if (!p || !e) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', width: '100%', color: '#fff', fontSize: '16px', fontWeight: '600' }}>⏳ 战斗加载中...</div>;
    const pStats = getStats(p);
    const eStats = getStats(e, e.stages, e.status);
    
    const p2 = isDoubleBattle && battle.activeIdxs?.[1] >= 0 ? battle.playerCombatStates?.[battle.activeIdxs[1]] : null;
    const e2 = isDoubleBattle && battle.enemyActiveIdxs?.[1] >= 0 ? battle.enemyParty?.[battle.enemyActiveIdxs[1]] : null;
    const p2Stats = p2 ? getStats(p2) : null;
    const e2Stats = e2 ? getStats(e2, e2.stages, e2.status) : null;
    const doubleCurrentPet = isDoubleBattle ? battle.playerCombatStates?.[battle.activeIdxs?.[battle.phase === 'double_input_2' ? 1 : 0]] : null;
    const isDarkMoon = battle.domainRule === 'dark_moon';
    const domainRuleInfo = battle.domainRule ? getSpiritDomainRule(battle.domainRule) : null;
    const enemyOwnerName = battle.trainerName || ((battle.isTrainer || battle.isGym || battle.isChallenge || battle.isBoss || battle.isStory) ? '对手训练家' : '');

    const renderBattleStageRow = (pet, slotInParty, showPetDetails = true) => {
      if (!pet) return null;
      const st = pet.stages || {};
      const keys = ['p_atk', 'p_def', 's_atk', 's_def', 'spd', 'acc', 'eva', 'crit'];
      const short = { p_atk: '物', p_def: '防', s_atk: '特', s_def: '特', spd: '速', acc: '命', eva: '闪', crit: '暴' };
      const chips = keys.filter(k => st[k]).map(k => {
        const v = st[k];
        return (
          <span key={k} title={`${k} ${v}`} style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '4px', background: v > 0 ? 'rgba(76,175,80,0.22)' : 'rgba(244,67,54,0.2)', color: v > 0 ? '#2E7D32' : '#C62828', fontWeight: 700 }}>
            {short[k]}{v > 0 ? '+' : ''}{v}
          </span>
        );
      });
      const pi = typeof slotInParty === 'number' ? (isDoubleBattle ? battle.activeIdxs?.[slotInParty] : battle.activeIdx) : battle.activeIdx;
      const partyPet = typeof pi === 'number' && pi >= 0 ? party[pi] : null;
      return (
        <div data-testid={!showPetDetails ? `enemy-stage-row${slotInParty > 0 ? '-secondary' : ''}` : undefined} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', color: '#888' }}>能力</span>
              {chips}
            </div>
          )}
          {showPetDetails && partyPet && (
            <button type="button" onClick={() => setViewStatPet(partyPet)} style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(33,150,243,0.45)', background: 'rgba(33,150,243,0.08)', color: '#1565C0', cursor: 'pointer', fontWeight: 700 }}>
              详情
            </button>
          )}
        </div>
      );
    };
    
    // --- 名将头像组件 ---
    const GeneralPortraitIcon = ({gen, size = 36, showName = false, onClick}) => {
      const p = getGeneralPortrait(gen);
      const rc = GENERAL_RARITY_CONFIG[gen.rarity] || {};
      const isSSR = gen.rarity === 'SSR';
      return (
        <div onClick={onClick} style={{display:'inline-flex', flexDirection:'column', alignItems:'center', gap:'2px', cursor: onClick ? 'pointer' : 'default'}}>
          <div style={{
            width: size, height: size, borderRadius: '50%', background: p.bg,
            border: `2px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: Math.floor(size * 0.5), fontWeight: '900', color: p.textColor,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)', position: 'relative', overflow:'hidden',
            boxShadow: isSSR ? `0 0 8px ${p.border}80, inset 0 -2px 4px rgba(0,0,0,0.3)` : `inset 0 -2px 4px rgba(0,0,0,0.3)`,
          }}>
            {renderGeneralPortraitFace(gen, p, p.surname)}
            <div style={{
              position:'absolute', bottom: -2, right: -2, fontSize: Math.max(8, Math.floor(size * 0.22)),
              background: rc.bgColor || '#333', color: rc.color || '#999', padding: '0 3px',
              borderRadius: '4px', fontWeight: '800', lineHeight: '1.3', border: `1px solid ${rc.color || '#666'}40`,
            }}>{rc.label?.charAt(0) || '将'}</div>
          </div>
          {showName && <span style={{fontSize:'9px', fontWeight:'700', color:'#1e293b', maxWidth: size + 10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{gen.name}</span>}
        </div>
      );
    };

    // --- 战斗名将徽章 ---
    const renderBattleGeneralsBadge = (generals, side) => {
      if (!generals || generals.length === 0) return null;
      const isPlayer = side === 'player';
      const totalBonus = calcGeneralsTotalBonus(generals);
      const bgColor = isPlayer ? 'rgba(76,175,80,0.85)' : 'rgba(255,143,0,0.85)';
      return (
        <span data-testid={`${side}-generals-badge`} onClick={(ev) => { ev.stopPropagation(); setBattleGeneralDetail({ generals, side, totalBonus }); }}
          style={{
            display:'inline-flex', alignItems:'center', gap:'3px',
            background: bgColor, color:'#fff', fontSize:'9px', padding:'1px 6px',
            borderRadius:'10px', fontWeight:'bold', whiteSpace:'nowrap',
            border:'1px solid rgba(255,255,255,0.25)', cursor:'pointer',
          }}>
          ⚔️{generals.length}将
          {generals.slice(0, 2).map((g, i) => (
            <span key={i} style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:'14px', height:'14px', borderRadius:'50%',
              background: (FACTION_PORTRAIT_COLORS[g.faction] || FACTION_PORTRAIT_COLORS.neutral).bg,
              fontSize:'8px', fontWeight:'900', color:'#fff', textShadow:'0 1px 1px rgba(0,0,0,0.5)',
              border:'1px solid rgba(255,255,255,0.3)', overflow:'hidden',
            }}>{renderGeneralPortraitFace(g, getGeneralPortrait(g), (g.name || '?').charAt(0))}</span>
          ))}
          {generals.length > 2 && <span style={{fontSize:'8px', opacity:0.8}}>+{generals.length - 2}</span>}
        </span>
      );
    };

    // --- 辅助函数 ---
    const renderStatusBadges = (unit) => {
        const badges = [];
        const badgeBase = { color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px', marginLeft: '3px', fontWeight: 'bold', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '2px' };
        const statusConfig = {
            BRN: { text: '灼伤', bg: '#FF5722', title: '每回合受到少量持续伤害，物理攻击威力降低' },
            PSN: { text: '中毒', bg: '#9C27B0', title: '每回合受到中毒伤害（若为重毒则随回合加重）' },
            PAR: { text: '麻痹', bg: '#FFC107', color: '#000', title: '有时无法行动，速度降低' },
            SLP: { text: '睡眠', bg: '#90A4AE', title: '无法使用招式，受到伤害后可能醒来' },
            FRZ: { text: '冰冻', bg: '#03A9F4', title: '无法使用招式，被火系招式命中可能解除冰冻' },
            CON: { text: '混乱', bg: '#E91E63', title: '使用招式时约有三分之一概率自伤' },
        };
        if (unit.status && statusConfig[unit.status]) { const cfg = statusConfig[unit.status]; badges.push(<span key="main" title={cfg.title} style={{...badgeBase, background: cfg.bg, color: cfg.color || '#fff'}}>{cfg.text}</span>); }
        if (unit.volatiles && unit.volatiles.confused) { badges.push(<span key="confused" title={statusConfig.CON.title} style={{...badgeBase, background: statusConfig.CON.bg}}>混乱</span>); }

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

        if (unit.ultraTransformed && unit.ultraTurnsLeft > 0) {
            badges.push(<span key="ultra-active" data-testid="ultra-timer" title="光能耗尽或必杀出手后解除变身" style={{...badgeBase, background: unit.ultraTurnsLeft === 1 ? '#ab3549' : '#286657', whiteSpace:'normal'}}><Sparkles size={11} />{ULTRA_BY_ID[unit.ultraHeroId]?.name} · 光能 {unit.ultraTurnsLeft}</span>);
        }

        if(unit.kaijuId) badges.push(<span key="kaiju" title={KAIJU_STYLES[unit.kaijuStyle]?.hint} style={{...badgeBase,background:'#803f43'}}>{KAIJU_RANKS[unit.kaijuRank]?.name} · {KAIJU_STYLES[unit.kaijuStyle]?.name}</span>);
        return badges;
    };

    const renderTraitBadge = (pet, side, slot = 0) => {
        const trait = TRAIT_DB[pet?.trait];
        if (!trait) return null;
        const suffix = slot > 0 ? '-secondary' : '';
        return (
          <span
            data-testid={`${side}-trait-badge${suffix}`}
            title={trait.desc || trait.name}
            style={{fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:'rgba(79,70,229,0.22)', color:'#c7d2fe', border:'1px solid rgba(165,180,252,0.38)', fontWeight:'800', whiteSpace:'normal', overflowWrap:'anywhere'}}
          >
            特性·{trait.name}
          </span>
        );
    };

    const renderBattleFruitBadge = (pet, side, slot = 0) => {
        if (!pet?.devilFruit) return null;
        const fruit = getFruitById(pet.devilFruit);
        if (!fruit) return null;
        const suffix = slot > 0 ? '-secondary' : '';
        return (
          <span
            className="fruit-badge"
            data-testid={`${side}-fruit-badge${suffix}`}
            title={fruit.desc || fruit.name}
            onClick={(ev) => { ev.stopPropagation(); setBattleFruitDetail(fruit); }}
            style={{background: FRUIT_RARITY_CONFIG[fruit.rarity]?.color || '#666', color:'#fff', fontSize:'9px', padding:'1px 5px', borderRadius:'4px', fontWeight:'bold', whiteSpace:'normal', overflowWrap:'anywhere', cursor:'pointer'}}
          >
            {fruit.name}{pet.fruitTransformed ? ` (${pet.fruitTurnsLeft})` : ''}
          </span>
        );
    };

    // 🔥 门派徽章渲染函数 (胶囊样式 + 点击弹出详情)
    const renderSectBadge = (pet, side, slot = 0) => {
        if (!pet.sectId) return null;
        const s = SECT_DB[pet.sectId];
        if (!s) return null;
        const lv = pet.sectLevel || 1; 
        const effectText = s.effect ? s.effect(lv) : s.desc;
        const tooltipKey = `${side}_${slot}_sect`;
        const suffix = slot > 0 ? '-secondary' : '';

        return (
            <div 
                data-testid={`${side}-sect-badge${suffix}`}
                title={`查看${s.name}心法详情`}
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
                    <div style={{width:'14px', height:'14px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#000', lineHeight:1}}>{s.emoji}</div>
                    <span style={{textShadow:'0 1px 1px rgba(0,0,0,0.5)'}}>{s.name} <span style={{opacity:0.8, fontSize:'9px'}}>Lv.{lv}</span></span>
                </div>
            </div>
        );
    };

    const renderSectTooltipOverlay = () => {
        if (!battleTooltip || !battleTooltip.endsWith('_sect')) return null;
        const [side, slotText] = battleTooltip.replace('_sect', '').split('_');
        const slot = Number(slotText) || 0;
        const pet = side === 'player' 
            ? battle.playerCombatStates?.[battle.isDouble ? battle.activeIdxs?.[slot] : battle.activeIdx]
            : battle.enemyParty?.[battle.isDouble ? battle.enemyActiveIdxs?.[slot] : battle.enemyActiveIdx];
        if (!pet || !pet.sectId) return null;
        const s = SECT_DB[pet.sectId];
        if (!s) return null;
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
                        <div style={{width:'32px', height:'32px', borderRadius:'50%', background:`linear-gradient(135deg, ${s.color}, ${s.color}80)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:'#fff', fontWeight:'900'}}>{s.emoji}</div>
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

    const getHpColor = (current, max) => { const pct = max > 0 ? (current / max) * 100 : 0; if (pct > 50) return '#4CAF50'; if (pct > 20) return '#FFC107'; return '#FF5252'; };
    
    const renderPartyIndicators = (team) => {
        if (!team || !Array.isArray(team)) return null;
        const total = team.length;
        const alive = team.filter(m => m && m.currentHp > 0).length;
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', background:'rgba(0,0,0,0.05)', padding:'4px 8px', borderRadius:'6px'}}>
                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#555', display:'flex', alignItems:'center', gap:'4px'}}>
                    <span>{alive} / {total}</span>
                </div>
                <div style={{display: 'flex', gap: '3px'}}>
                    {team.map((m, i) => (
                        <div key={i} style={{width: '10px', height: '10px', borderRadius: '50%', background: m.currentHp > 0 ? 'linear-gradient(180deg, #FF5252 50%, #fff 50%)' : '#666', border: '1px solid #333', boxShadow: '0 1px 2px rgba(0,0,0,0.3)', opacity: m.currentHp > 0 ? 1 : 0.4}} />
                    ))}
                    {[...Array(Math.max(0, 6 - total))].map((_, i) => <div key={`empty-${i}`} style={{width: '10px', height: '10px', borderRadius: '50%', border: '1px dashed rgba(0,0,0,0.15)'}} />)}
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
      WIND:'vfx-flying', LIGHT:'vfx-fairy', COSMIC:'vfx-dragon', SOUND:'vfx-psychic',
      TIME:'vfx-psychic', CHAOS:'vfx-fire',
      HEAL:'vfx-heal', BUFF:'vfx-heal', DEBUFF:'vfx-fire',
      PROTECT:'vfx-steel', SLEEP:'vfx-psychic', PARALYSIS:'vfx-electric',
      FREEZE:'vfx-ice', CONFUSION:'vfx-psychic',
      THROW_BALL:'vfx-normal', CATCH_SUCCESS:'vfx-fairy',
      LEVEL_UP:'vfx-god', EVOLUTION:'vfx-god', DOMAIN:'vfx-dragon',
      TRANSFORM:'vfx-transform'
    };

    const getTrainerAvatar = (name) => {
      if (battle.generalEncounter) {
        const gen = battle.generalEncounter;
        const portrait = getGeneralPortrait(gen);
        const rc = GENERAL_RARITY_CONFIG[gen.rarity] || {};
        return (
          <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
            <div style={{
              width:'120px', height:'120px', borderRadius:'50%', background: portrait.bg,
              border: `4px solid ${portrait.border}`, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'60px', fontWeight:'900', color: portrait.textColor,
              textShadow:'2px 2px 6px rgba(0,0,0,0.6)',
              boxShadow: gen.rarity === 'SSR' ? `0 0 20px ${portrait.border}60, 0 0 40px ${portrait.border}30` : `0 0 12px rgba(0,0,0,0.3)`,
              overflow:'hidden',
            }}>
              {renderGeneralPortraitFace(gen, portrait, portrait.surname)}
            </div>
            <div style={{position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', background:rc.bgColor||'#333', color:rc.color||'#999', fontSize:'12px', fontWeight:'800', padding:'2px 10px', borderRadius:'6px', whiteSpace:'nowrap', border:`1px solid ${rc.color||'#666'}40`}}>
              {gen.name} · {gen.title}
            </div>
          </div>
        );
      }
      const spriteUrl = getNpcSprite(name, battle);
      return <img src={spriteUrl} alt="精灵" style={{width:'100%', height:'100%', objectFit:'contain'}} onError={e => { e.target.style.display='none'; e.target.parentNode.insertAdjacentHTML('beforeend', '<span style="font-size:48px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🧢</span>'); }} />;
    };
    
    let bgClass = 'bg-grass'; 
    if (battle.isGym) bgClass = 'bg-city'; else if (battle.isChallenge) bgClass = 'bg-cave'; 
    else { const mapInfo = MAPS.find(m => m.id === battle.mapId); if (mapInfo) { switch (mapInfo.type) { case 'water': bgClass = 'bg-water'; break; case 'fire': bgClass = 'bg-fire'; break; case 'ice': bgClass = 'bg-ice'; break; case 'mountain': case 'rock': case 'ground': bgClass = 'bg-cave'; break; case 'city': case 'steel': case 'electric': bgClass = 'bg-city'; break; case 'ghost': case 'dark': bgClass = 'bg-dark'; break; case 'factory': case 'space': bgClass = 'bg-cave'; break; default: bgClass = 'bg-grass'; break; } } }
    const activeCommandPet = isDoubleBattle ? (doubleCurrentPet || p) : p;
    const commandMoveCount = activeCommandPet?.combatMoves?.length || 0;
    const visibleMoveFamily = activeCommandPet?.combatMoves?.some(move=>getCombatFamily(move)===battleMoveFamily) ? battleMoveFamily : getCombatFamily(activeCommandPet?.combatMoves?.[0]);
    const playerHpPct = Math.min(100, Math.max(0, Math.round((p.currentHp / Math.max(1, pStats.maxHp)) * 100)));
    const enemyHpPct = Math.min(100, Math.max(0, Math.round((e.currentHp / Math.max(1, eStats.maxHp)) * 100)));
    const battleModeLabel = battle.isPvP ? 'PvP' : isDoubleBattle ? '双打' : battle.isTrainer ? '训练家战' : battle.isGym ? '道馆战' : battle.isBoss ? '首领战' : '野外战';
    const tempoLabel = playerHpPct >= enemyHpPct + 15 ? '优势' : enemyHpPct >= playerHpPct + 15 ? '承压' : '均势';
    const liveDirectiveStatus = getBattleDirectiveStatus(battle);
    const trainerIntelVisible = Boolean(
      battle.trainerTactic || battle.trainerPressure || battle.trainerCoverage || battle.battleDirective,
    );
    const pressureLabel = battle.trainerPressure?.name || (battle.trainerTactic ? '常态压力' : null);
    const coverageTypes = (battle.trainerCoverage?.types || [])
      .map(type => TYPES[type]?.name || type)
      .join('/');

    // 交换精灵弹窗
    if (battle.showSwitch) {
      return (
        <div className="screen battle-screen battle-switch-screen">
            <div className="modal-overlay" style={{background:'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex:200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 'min(500px, 92vw)', background: '#fff', borderRadius: '20px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', maxHeight:'85vh', overflowY:'auto'}}>
                    <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#333'}}>选择出战伙伴</div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px'}}>
                        {(battle.playerCombatStates || []).map((pet, idx) => {
                            const maxHp = getStats(pet).maxHp;
                            const isFainted = pet.currentHp <= 0;
                            const isActive = battle.isDouble ? (battle.activeIdxs?.includes(idx)) : (idx === battle.activeIdx);
                            return (
                                <button type="button" key={idx} disabled={isActive || isFainted} onClick={() => switchPokemon(idx)}
                                     style={{width:'100%', font:'inherit', textAlign:'left', background: isActive ? '#E3F2FD' : '#f5f7fa', border: isActive ? '2px solid #2196F3' : '2px solid transparent', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', cursor: (isActive || isFainted) ? 'default' : 'pointer', opacity: isFainted ? 0.6 : 1, position: 'relative', transition: '0.2s'}}
                                     onMouseOver={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#fff'; }}
                                     onMouseOut={e => { if(!isActive && !isFainted) e.currentTarget.style.background = '#f5f7fa'; }}
                                >
                                    <div style={{width: '48px', height: '48px', marginRight: '10px', filter: isFainted ? 'grayscale(1)' : pet.isFusedShiny ? 'drop-shadow(0 0 4px rgba(213,0,249,0.5)) hue-rotate(150deg)' : pet.isShiny ? 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' : 'none'}}>{renderAvatar(pet)}</div>
                                    <div style={{flex: 1}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#333'}}><span>{pet.name} {pet.isFusedShiny ? <span style={{color:'#D500F9',fontSize:'11px'}}>🧬</span> : pet.isShiny ? <span style={{color:'#FFD700',fontSize:'11px'}}>✨</span> : null}</span><span style={{fontSize: '11px', color: '#666'}}>Lv.{pet.level}</span></div>
                                        <div style={{height: '6px', background: '#ddd', borderRadius: '3px', marginTop: '6px', overflow: 'hidden'}}><div style={{width: `${Math.min(100, (pet.currentHp/Math.max(1,maxHp))*100)}%`, background: getHpColor(pet.currentHp, maxHp), height: '100%', transition: 'width 0.3s'}}></div></div>
                                        <div style={{fontSize: '11px', color: '#999', marginTop: '2px', display:'flex', justifyContent:'space-between'}}>
                                          <span>{pet.status ? ({PSN:'🟣毒',PAR:'⚡麻',BRN:'🔥烧',SLP:'💤眠',FRZ:'❄冻'}[pet.status]||pet.status) : ''}</span>
                                          <span>{Math.floor(pet.currentHp).toLocaleString()}/{maxHp.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {isActive && <div style={{position: 'absolute', top: '5px', right: '5px', fontSize: '11px', background: '#2196F3', color: '#fff', padding: '2px 6px', borderRadius: '4px'}}>当前</div>}
                                    {isFainted && <div style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5252', fontWeight: 'bold', fontSize: '14px'}}>濒死</div>}
                                </button>
                            );
                        })}
                    </div>
                    <button onClick={() => { const activePet = battle.playerCombatStates?.[battle.activeIdx]; if (activePet && activePet.currentHp <= 0) { showMapToast('⚠️', '提示', '当前精灵已濒死，必须换人！', 1500); return; } setBattle(prev => ({...prev, showSwitch: false})); }} style={{width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: '#f0f0f0', color: '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: '0.2s'}} onMouseOver={e => e.target.style.background='#e0e0e0'} onMouseOut={e => e.target.style.background='#f0f0f0'}>取消</button>
                </div>
            </div>
        </div>
      )
    }

    // 战斗主场景
    return (
      <div className={`screen battle-screen pc-battle-screen ${reducedBattleEffects ? 'reduce-battle-motion' : ''}`} style={{
        '--command-height': 'min(350px, 48dvh)',
        '--compact-command-height': 'min(330px, 50dvh)',
      }}>
        {renderEnvironmentOverlay()}
        {battle.activeDomain && (
            <div style={{
                position:'absolute', top:0, left:0, right:0, bottom:0,
                background: battle.activeDomain.ownerSide === 'player'
                    ? 'radial-gradient(ellipse at center, rgba(123,31,162,0.15) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at center, rgba(183,28,28,0.15) 0%, transparent 70%)',
                zIndex:5, pointerEvents:'none',
                animation: 'pulse 2s ease-in-out infinite',
            }} />
        )}
        {domainRuleInfo && (
          <div style={{
            position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)', zIndex:25,
            background:'linear-gradient(90deg, rgba(76,175,80,0.9), rgba(56,142,60,0.85))',
            color:'#fff', fontSize:'13px', fontWeight:'700', padding:'6px 16px', borderRadius:'20px',
            boxShadow:'0 4px 12px rgba(0,0,0,0.25)', whiteSpace:'nowrap', pointerEvents:'none',
          }}>
            {domainRuleInfo.icon} 灵域规则：{domainRuleInfo.name} — {domainRuleInfo.desc}
          </div>
        )}
        {battle.type === 'world_boss' && battle.worldBoss && (
          <div style={{
            position:'absolute', top: domainRuleInfo ? '36px' : '8px', left:'50%', transform:'translateX(-50%)', zIndex:25,
            background:'linear-gradient(90deg, rgba(183,28,28,0.9), rgba(136,14,79,0.85))',
            color:'#fff', fontSize:'10px', fontWeight:'700', padding:'4px 12px', borderRadius:'16px',
            boxShadow:'0 4px 12px rgba(0,0,0,0.25)', pointerEvents:'none',
          }}>
            {battle.worldBoss.emoji} 世界首领 · {(battle.enemyParty?.[0]?._starShield || 0) > 0 ? `星海护盾 ${battle.enemyParty[0]._starShield.toLocaleString()}` : battle._gravityActive ? '重力扭曲中' : '阶段机制激活'}
          </div>
        )}
        {/* Fix#19: 战斗机制状态chips */}
        {(battle.domainRule || battle._vineActive || battle._parasiteApplied || battle._mirrorClonesActive || battle._gravityActive) && (
          <div style={{ position:'absolute', top: (domainRuleInfo ? 36 : 8) + (battle.type === 'world_boss' ? 28 : 0), right: 8, zIndex: 25, display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '180px' }}>
            {battle._vineActive && <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'8px', background:'rgba(76,175,80,0.2)', color:'#2E7D32', fontWeight:700 }}>🌿 藤蔓</span>}
            {battle._parasiteApplied && <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'8px', background:'rgba(156,39,176,0.2)', color:'#7B1FA2', fontWeight:700 }}>🦠 寄生</span>}
            {battle._mirrorClonesActive && <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'8px', background:'rgba(33,150,243,0.2)', color:'#1565C0', fontWeight:700 }}>🪞 分身</span>}
            {battle._gravityActive && <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'8px', background:'rgba(103,58,183,0.2)', color:'#4527A0', fontWeight:700 }}>🌌 重力</span>}
            {battle._darkMoonScouted && <span style={{ fontSize:'9px', padding:'2px 6px', borderRadius:'8px', background:'rgba(255,152,0,0.2)', color:'#E65100', fontWeight:700 }}>🔍 侦查</span>}
          </div>
        )}

        <div className={`battle-stage-v2 ${bgClass} ${isDoubleBattle ? 'battle-stage-double' : ''}`} style={{position:'relative'}}>
            <BattleImpact event={battleImpact} reduced={reducedBattleEffects}/>
            <button type="button" className="battle-control-pill" style={{top:160}} onClick={()=>setReducedBattleEffects(value=>!value)} aria-pressed={!reducedBattleEffects} aria-label="战斗特效" title={reducedBattleEffects ? '特效：精简' : '特效：完整'}><WandSparkles size={16}/></button>
            <button className="battle-control-pill" onClick={() => setBattleSpeed(s => s >= 3 ? 1 : s + 1)} title="点击切换战斗速度 (1x/2x/3x)" style={{ top: 8 }}>⏩ {battleSpeed}x</button>
            <button className={autoBattle ? 'battle-control-pill is-on' : 'battle-control-pill'} onClick={() => setAutoBattle(a => !a)} title="自动战斗：开启后AI自动选择最优技能出招" style={{ top: 46 }}>{autoBattle ? '自动中' : '自动'}</button>
            <button className="battle-control-pill" onClick={() => setShowTypeChart(true)} style={{ top: 84 }}>属性表</button>
            <button className="battle-control-pill" onClick={() => setShowKeyHelp(h => !h)} style={{ top: 122, fontSize: '11px' }} title="快捷键: 1-4选技能 R逃跑 A自动">⌨️</button>
            {(battle.sharedPlayerMaxChakra > 0 || battle.sharedPlayerMaxCE > 0) && (
              <div className="battle-shared-energy" style={{
                position:'absolute', top:100, left:8, right:'auto', zIndex:20, pointerEvents:'none',
                fontSize:'9px', color:'rgba(255,230,180,0.95)', textAlign:'left',
                background:'rgba(15,18,28,0.72)', padding:'5px 10px', borderRadius:12,
                border:'1px solid rgba(255,152,67,0.28)', maxWidth:'min(70vw, 280px)',
                lineHeight:1.35, boxShadow:'0 2px 10px rgba(0,0,0,0.28)', backdropFilter:'blur(6px)'
              }}>
                本回合队伍能量
                {(battle.sharedPlayerMaxChakra || 0) > 0 && <> · 查克拉 {battle.sharedPlayerChakra ?? 0}/{battle.sharedPlayerMaxChakra || 100}</>}
                {(battle.sharedPlayerMaxCE || 0) > 0 && <> · 咒力 {battle.sharedPlayerCE ?? 0}/{battle.sharedPlayerMaxCE || 100}</>}
              </div>
            )}
            {!isDoubleBattle && (
            <div style={{
              position:'absolute', top:8, left:8, zIndex:20, display:'flex', flexDirection:'column', gap:'4px'
            }}>
              {battle?.turnCount > 0 && <div style={{background:'rgba(0,0,0,0.6)', color:'#81D4FA',
                border:'1px solid rgba(129,212,250,0.2)', borderRadius:16, padding:'3px 10px', fontSize:11,
                fontWeight:700, backdropFilter:'blur(4px)', textAlign:'center'
              }}>R{battle.turnCount}</div>}
              {(achStats.currentWinStreak || 0) >= 3 && <div style={{background:'rgba(0,0,0,0.6)', color: (achStats.currentWinStreak||0) >= 20 ? '#FF5722' : (achStats.currentWinStreak||0) >= 10 ? '#FFB300' : '#81C784',
                border:'1px solid rgba(255,255,255,0.2)', borderRadius:16, padding:'3px 10px', fontSize:11,
                fontWeight:700, backdropFilter:'blur(4px)'
              }}>🔥{achStats.currentWinStreak}连胜{(achStats.currentWinStreak||0) >= 5 ? ` +${(achStats.currentWinStreak||0) >= 20 ? '50' : (achStats.currentWinStreak||0) >= 10 ? '30' : '15'}%💰` : ''}</div>}
            </div>
            )}
            {animEffect?.type === 'BLACKOUT' && <div className="blackout-overlay">眼前一黑...</div>}
            
            <div className="battle-scene-layer" style={{width: '100%', height: '100%', position: 'relative'}}>
                
                <img className="battle-backdrop" src="assets/spirit-ui-sky-bg.webp" alt="" />

                {/* ====== 双打：天气 / 领域 / 回合等顶栏（单行 flex 换行，避免重叠） ====== */}
                {isDoubleBattle && (
                  <div style={{
                    position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)', zIndex:12,
                    display:'flex', gap:'4px', flexWrap:'wrap', justifyContent:'center', alignItems:'center', maxWidth:'96%', pointerEvents:'none'
                  }}>
                    {weather && weather !== 'CLEAR' && (
                      <div style={{
                        background:'rgba(0,0,0,0.55)', color:'#E1F5FE', border:'1px solid rgba(129,212,250,0.35)', borderRadius:14,
                        padding:'4px 10px', fontSize:11, fontWeight:700, backdropFilter:'blur(4px)'
                      }}>
                        <span style={{ marginRight: 4 }}>{WEATHERS[weather]?.icon || '🌤️'}</span>
                        {WEATHERS[weather]?.name || weather}
                      </div>
                    )}
                    {battle.activeDomain && battle.activeDomain.turnsLeft > 0 && (
                      <div style={{
                        background: battle.activeDomain.ownerSide === 'player'
                          ? 'linear-gradient(135deg, rgba(33,150,243,0.85), rgba(13,71,161,0.9))'
                          : 'linear-gradient(135deg, rgba(211,47,47,0.85), rgba(136,14,79,0.9))',
                        padding:'5px 12px', borderRadius:18,
                        boxShadow: battle.activeDomain.ownerSide === 'player'
                          ? '0 2px 12px rgba(33,150,243,0.35)' : '0 2px 12px rgba(211,47,47,0.35)',
                        display:'flex', alignItems:'center', gap:6,
                        animation:'domain-banner-pulse 2s infinite', border:'1px solid rgba(255,255,255,0.25)'
                      }}>
                        <span style={{fontSize:14}}>🌀</span>
                        <span style={{color:'#fff', fontSize:11, fontWeight:700}}>{battle.activeDomain.name}</span>
                        <span style={{ background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:9, padding:'1px 6px', borderRadius:8, fontWeight:700 }}>
                          {battle.activeDomain.ownerSide === 'player' ? '我方' : '敌方'} · 剩余{battle.activeDomain.turnsLeft}回合
                        </span>
                      </div>
                    )}
                    <div className="battle-double-indicator" title="双打战斗：每回合两只精灵各选一个技能" style={{
                      background:'linear-gradient(135deg, rgba(255,152,0,0.92), rgba(255,87,34,0.88))',
                      padding:'4px 12px', borderRadius:14, border:'1px solid rgba(255,255,255,0.25)',
                      color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:6
                    }}>
                      <span>⚔️</span><span>双打</span>
                      <span style={{background:'rgba(255,255,255,0.2)', padding:'1px 6px', borderRadius:8, fontSize:10, fontWeight:700}}>
                        {(battle.phase === 'input' || battle.phase === 'double_input_2') ? `精灵${(battle.doubleSlot || 0) + 1}行动` : '回合中'}
                      </span>
                    </div>
                    {battle?.turnCount > 0 && (
                      <div style={{ background:'rgba(0,0,0,0.55)', color:'#81D4FA', border:'1px solid rgba(129,212,250,0.25)', borderRadius:14, padding:'4px 10px', fontSize:11, fontWeight:700 }}>
                        R{battle.turnCount}
                      </div>
                    )}
                    {(achStats.currentWinStreak || 0) >= 3 && (
                      <div style={{
                        background:'rgba(0,0,0,0.55)', color: (achStats.currentWinStreak||0) >= 20 ? '#FF5722' : (achStats.currentWinStreak||0) >= 10 ? '#FFB300' : '#81C784',
                        borderRadius:14, padding:'4px 10px', fontSize:11, fontWeight:700, border:'1px solid rgba(255,255,255,0.15)'
                      }}>
                        🔥{achStats.currentWinStreak}连胜{(achStats.currentWinStreak||0) >= 5 ? ` +${(achStats.currentWinStreak||0) >= 20 ? '50' : (achStats.currentWinStreak||0) >= 10 ? '30' : '15'}%💰` : ''}
                      </div>
                    )}
                  </div>
                )}

                {/* ====== 领域展开全局标识（单打） ====== */}
                {!isDoubleBattle && battle.activeDomain && battle.activeDomain.turnsLeft > 0 && (
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

                
                {/* ========================================== */}
                {/* 1. 敌方区域 (右上角 / 双打时偏右) */}
                {/* ========================================== */}
                <div className={`enemy-zone-v2 ${isDoubleBattle ? 'double-mode' : ''}`} style={{position: 'absolute', top: '2%', right: isDoubleBattle ? '1%' : '4%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    
                    {/* 敌方 HUD */}
                    <div className={`hud-card hud-enemy ${isDoubleBattle ? 'hud-card--double' : ''}`} style={{marginBottom: '8px'}}>
                        {enemyOwnerName && (
                          <div className="battle-enemy-owner" data-testid="enemy-owner-name">
                            {enemyOwnerName}
                          </div>
                        )}
                        <div className="battle-enemy-meta">
                            <span className="battle-enemy-pet-name" data-testid="enemy-pet-name">{e.name}</span>
                            <span className="battle-level-badge" data-testid="enemy-level">Lv.{e.level}</span>
                            {!isDarkMoon && (
                              <>
                                <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[e.type]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[e.type]?.name || e.type}</span>
                                {e.secondaryType && e.secondaryType !== e.type && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[e.secondaryType]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[e.secondaryType]?.name}</span>}
                              </>
                            )}
                            {isDarkMoon && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background:'#333', color:'#aaa', fontWeight:'bold'}}>???</span>}
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'3px', flexWrap:'wrap', marginBottom:'3px'}}>
                            {renderSectBadge(e, 'enemy')}
                            {renderTraitBadge(e, 'enemy')}
                            {battle.trainerGang && (
                              <span data-testid="enemy-gang-badge" onClick={(ev) => { ev.stopPropagation(); setBattleGangDetail({name: battle.trainerGang.name, icon: battle.trainerGang.icon, bonus: battle.trainerGangBonus, side:'enemy'}); }} style={{display:'inline-flex', alignItems:'center', gap:'2px', background:'rgba(220,38,38,0.72)', color:'#fff', fontSize:'9px', padding:'1px 6px', borderRadius:'4px', fontWeight:'bold', whiteSpace:'normal', cursor:'pointer'}}>
                                {battle.trainerGang.icon}{battle.trainerGang.name}
                              </span>
                            )}
                            {renderBattleGeneralsBadge(battle.enemyGenerals, 'enemy')}
                            {renderBattleFruitBadge(e, 'enemy')}
                            {!isDarkMoon && (() => { const weakTypes = Object.keys(TYPES || {}).filter(t => { let mod = getTypeMod(t, e.type); if (e.secondaryType && e.secondaryType !== e.type) mod *= getTypeMod(t, e.secondaryType); return mod >= 1.5; }); return weakTypes.length > 0 ? <span style={{fontSize:'8px',padding:'1px 4px',borderRadius:'4px',background:'rgba(244,67,54,0.15)',color:'#EF5350',fontWeight:'700'}}>弱:{weakTypes.slice(0,2).map(t => TYPES[t]?.name || t).join('/')}</span> : null; })()}
                            {(e.isFusedShiny || e.isShiny) && <span style={{fontSize:'7px', padding:'1px 4px', borderRadius:'4px', background: e.isFusedShiny ? '#7B1FA2' : '#FF8F00', color:'#fff', fontWeight:'bold'}}>{e.isFusedShiny ? '🧬异色' : '✨闪光'}</span>}
                            {renderStatusBadges(e)}<TacticalStatus unit={e} turn={battle.turnCount || 0}/>
                        </div>
                        {renderBattleStageRow(e, 0, false)}
                        <EnhancedHPBar current={Math.min(e.currentHp, eStats.maxHp)} max={eStats.maxHp} label="" />
                        <div style={{fontSize:'9px', color:'#888', textAlign:'right', marginTop:'1px'}}>
                          {isDarkMoon && battle._darkMoonScouted !== true ? 'HP ???' : `HP ${Math.max(0, Math.min(eStats.maxHp, Math.floor(e.currentHp)))}/${eStats.maxHp} (${Math.min(100, Math.round((e.currentHp / Math.max(1, eStats.maxHp)) * 100))}%)`}
                        </div>
                        {e.maxCE > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'9px', color: e.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{e.curseGrade?.name || ''}</span>
                                <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                    <div style={{width:`${Math.min(100, ((e.cursedEnergy||0)/Math.max(1,e.maxCE))*100)}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#CE93D8'}}>{e.cursedEnergy||0}/{e.maxCE}<span style={{fontSize:'8px',color:'#9C27B0',marginLeft:'2px'}}>队</span></span>
                            </div>
                        )}
                        {(e.maxChakra || 0) > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'10px', color:'#FF6F00', fontWeight:'bold'}}>🍥</span>
                                <div style={{flex:1, height:'5px', background:'rgba(255,111,0,0.15)', borderRadius:'3px', overflow:'hidden', border:'1px solid rgba(255,111,0,0.2)'}}>
                                    <div style={{width:`${Math.min(100, ((e.chakra||0)/Math.max(1,e.maxChakra))*100)}%`, height:'100%', background:'linear-gradient(90deg, #E65100, #FF6F00, #FFB74D)', transition:'width 0.3s', borderRadius:'3px', boxShadow:'0 0 4px rgba(255,111,0,0.4)'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#FFB74D', fontWeight:'700'}}>{e.chakra||0}/{e.maxChakra}<span style={{fontSize:'8px',color:'#E65100',marginLeft:'2px'}}>队</span></span>
                                {e.bijuuTransformed && <span style={{fontSize:'8px', color:'#FF5722', fontWeight:'bold', animation:'shiny-flash 1.5s infinite'}}>🦊尾兽化</span>}
                            </div>
                        )}
                        {renderPartyIndicators(battle.enemyParty)}
                    </div>

                    {/* 敌方精灵 */}
                    <div
                      className={`sprite-wrapper enemy-sprite-wrapper ${e.fruitTransformed ? 'fruit-transformed' : ''}`}
                      style={{
                        position: 'relative',
                        marginRight: '10px',
                        ...(isDoubleBattle ? {
                          border: battle.targetIdx === battle.enemyActiveIdxs?.[0] ? '3px solid #FFD54F' : '2px solid transparent',
                          borderRadius: '12px',
                          boxSizing: 'border-box',
                          boxShadow: battle.targetIdx === battle.enemyActiveIdxs?.[0] ? '0 0 0 4px rgba(255,213,79,0.18), 0 0 24px rgba(255,213,79,0.45)' : 'none',
                          cursor: battle.pendingDoubleMove !== undefined && e.currentHp > 0 ? 'pointer' : undefined,
                        } : {}),
                      }}
                      onClick={isDoubleBattle ? () => {
                        if (battle.pendingDoubleMove === undefined || e.currentHp <= 0) return;
                        const ix = battle.enemyActiveIdxs?.[0];
                        if (ix !== undefined) {
                          const moveIndex = battle.pendingDoubleMove;
                          setBattle(prev => prev ? { ...prev, pendingDoubleMove:undefined, targetIdx:ix } : null);
                          executeDoubleTurn(moveIndex,ix);
                        }
                      } : undefined}
                      role={isDoubleBattle && battle.pendingDoubleMove!==undefined ? 'button' : undefined}
                      tabIndex={isDoubleBattle && battle.pendingDoubleMove!==undefined ? 0 : undefined}
                      aria-label={isDoubleBattle ? `选择目标 ${e.name}` : undefined}
                      onKeyDown={event=>{if(event.key==='Enter' || event.key===' ') {event.preventDefault();event.currentTarget.click();}}}
                    >
                        {battle.type !== 'ultra_trial' && (battle.isTrainer || battle.isGym || battle.isChallenge || battle.isBoss) && (
                            <div style={{
                                position: 'absolute', bottom: '-10px', right: isDoubleBattle ? '-40px' : '-70px', zIndex: 0, opacity: 0.55, width: isDoubleBattle ? 140 : 200, height: isDoubleBattle ? 140 : 200,
                                filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.4))', pointerEvents: 'none'
                            }}>
                                    {getTrainerAvatar(battle.trainerName)}
                            </div>
                        )}
                        <div className="battle-platform battle-platform-enemy" />
                        
                        <div 
                            key={`enemy-sprite-${isDoubleBattle ? battle.enemyActiveIdxs?.[0] : battle.enemyActiveIdx}-${e.id}`}
                            ref={(el) => {
                                if (el && !el.dataset.animated) {
                                    el.dataset.animated = 'true';
                                    GSAPAnimations.petEntry(el, 0.2);
                                }
                            }}
                            className={`sprite-v2 ${e.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.isHit && animEffect?.target==='enemy' && (!isDoubleBattle || animEffect?.slot === 0 || animEffect?.slot === undefined) && !['SHINY_ENTRY','THROW_BALL','BALL_WOBBLE','CATCH_SUCCESS','CATCH_FAIL'].includes(animEffect?.type) ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`}
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
                        {/* 特效层 */}
                        {animEffect?.type === 'SHINY_ENTRY' && animEffect?.target === 'enemy' && <RenderShinyStars />}
                    </div>
                </div>

                {/* ========================================== */}
                {/* 1b. 敌方区域2 (左上角, 仅双打) */}
                {/* ========================================== */}
                {isDoubleBattle && e2 && (
                  <div className="enemy-zone-v2 double-mode battle-slot-secondary" style={{position:'absolute', top:'2%', left:'1%', display:'flex', flexDirection:'column', alignItems:'flex-start', zIndex:5, opacity: e2.currentHp <= 0 ? 0.4 : 1}}>
                    <div className="hud-card hud-enemy hud-card--double" style={{marginBottom:'8px'}}>
                      {enemyOwnerName && (
                        <div className="battle-enemy-owner" data-testid="enemy-owner-name-secondary">
                          {enemyOwnerName}
                        </div>
                      )}
                      <div className="battle-enemy-meta">
                        <span className="battle-enemy-pet-name" data-testid="enemy-pet-name-secondary">{e2.name} {e2.currentHp <= 0 ? '💀' : ''}</span>
                        <span className="battle-level-badge">Lv.{e2.level}</span>
                        {!isDarkMoon && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[e2.type]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[e2.type]?.name || e2.type}</span>}
                        {!isDarkMoon && e2.secondaryType && e2.secondaryType !== e2.type && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[e2.secondaryType]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[e2.secondaryType]?.name}</span>}
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'4px', justifyContent:'flex-end'}}>
                        {e2.isFusedShiny ? (
                          <span style={{background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>🧬异色</span>
                        ) : e2.isShiny ? (
                          <span style={{background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>✨闪光</span>
                        ) : null}
                        {renderSectBadge(e2, 'enemy', 1)}
                        {renderTraitBadge(e2, 'enemy', 1)}
                        {renderStatusBadges(e2)}<TacticalStatus unit={e2} turn={battle.turnCount || 0}/>
                        {renderBattleFruitBadge(e2, 'enemy', 1)}
                      </div>
                      {renderBattleStageRow(e2, 1, false)}
                      <EnhancedHPBar current={Math.min(e2.currentHp, e2Stats.maxHp)} max={e2Stats.maxHp} label="" />
                      <div style={{fontSize:'10px', color:'#666', textAlign:'right', marginTop:'2px'}}>
                        HP {Math.max(0, Math.min(e2Stats.maxHp, Math.floor(e2.currentHp))).toLocaleString()}/{e2Stats.maxHp.toLocaleString()} ({Math.min(100, Math.round((e2.currentHp / Math.max(1, e2Stats.maxHp)) * 100))}%)
                      </div>
                      {e2.maxCE > 0 && (
                        <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                          <span style={{fontSize:'9px', color: e2.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{e2.curseGrade?.name || ''}</span>
                          <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                            <div style={{width:`${Math.min(100, ((e2.cursedEnergy||0)/Math.max(1,e2.maxCE))*100)}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                          </div>
                          <span style={{fontSize:'9px', color:'#CE93D8'}}>{e2.cursedEnergy||0}/{e2.maxCE}<span style={{fontSize:'8px',color:'#9C27B0',marginLeft:'2px'}}>队</span></span>
                        </div>
                      )}
                      {(e2.maxChakra || 0) > 0 && (
                        <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                          <span style={{fontSize:'10px', color:'#FF6F00', fontWeight:'bold'}}>🍥</span>
                          <div style={{flex:1, height:'5px', background:'rgba(255,111,0,0.15)', borderRadius:'3px', overflow:'hidden', border:'1px solid rgba(255,111,0,0.2)'}}>
                            <div style={{width:`${Math.min(100, ((e2.chakra||0)/Math.max(1,e2.maxChakra))*100)}%`, height:'100%', background:'linear-gradient(90deg, #E65100, #FF6F00, #FFB74D)', transition:'width 0.3s', borderRadius:'3px'}}></div>
                          </div>
                          <span style={{fontSize:'9px', color:'#FFB74D', fontWeight:'700'}}>{e2.chakra||0}/{e2.maxChakra}<span style={{fontSize:'8px',color:'#E65100',marginLeft:'2px'}}>队</span></span>
                        </div>
                      )}
                    </div>
                    <div
                      className="sprite-wrapper"
                      style={{
                        position:'relative',
                        border: `3px solid ${battle.targetIdx === battle.enemyActiveIdxs?.[1] ? '#FFD54F' : 'transparent'}`,
                        borderRadius:'12px',
                        boxSizing:'border-box',
                        boxShadow: battle.targetIdx === battle.enemyActiveIdxs?.[1] ? '0 0 0 4px rgba(255,213,79,0.18), 0 0 24px rgba(255,213,79,0.45)' : 'none',
                        cursor: battle.pendingDoubleMove !== undefined && e2.currentHp > 0 ? 'pointer' : undefined,
                      }}
                      onClick={() => {
                        if (battle.pendingDoubleMove === undefined || e2.currentHp <= 0) return;
                        const ix = battle.enemyActiveIdxs?.[1];
                        if (ix !== undefined) {
                          const moveIndex = battle.pendingDoubleMove;
                          setBattle(prev => prev ? { ...prev, pendingDoubleMove:undefined, targetIdx:ix } : null);
                          executeDoubleTurn(moveIndex,ix);
                        }
                      }}
                      role={battle.pendingDoubleMove!==undefined ? 'button' : undefined}
                      tabIndex={battle.pendingDoubleMove!==undefined ? 0 : undefined}
                      aria-label={`选择目标 ${e2.name}`}
                      onKeyDown={event=>{if(event.key==='Enter' || event.key===' ') {event.preventDefault();event.currentTarget.click();}}}
                    >
                      <div className="battle-platform battle-platform-enemy" />
                      <div className={`sprite-v2 ${e2.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.isHit && animEffect?.target==='enemy' && animEffect?.slot === 1 && !['SHINY_ENTRY','THROW_BALL','BALL_WOBBLE','CATCH_SUCCESS','CATCH_FAIL'].includes(animEffect?.type) ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`}
                        style={{filter: e2.isFusedShiny ? 'drop-shadow(0 0 5px rgba(213,0,249,0.5)) hue-rotate(150deg)' : e2.isShiny ? 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' : 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))'}}>
                        {renderAvatar(e2, true)}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================== */}
                {/* 2. 我方区域 (左下角) */}
                {/* ========================================== */}
                <div className={`player-zone-v2 ${isDoubleBattle ? 'double-mode' : ''}`} style={{position: 'absolute', bottom: '4%', left: isDoubleBattle ? '1%' : '3%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    
                    {/* 我方精灵 */}
                    <div className={`sprite-wrapper player-sprite-wrapper ${p.fruitTransformed ? 'fruit-transformed' : ''}`} style={{position: 'relative', marginBottom: '6px', marginLeft: '5px'}}>
                        <div className="battle-platform battle-platform-player" />
                         <div style={{transform: 'scaleX(-1)'}}>
                         <div 
                             key={`player-sprite-${isDoubleBattle ? battle.activeIdxs?.[0] : battle.activeIdx}-${p.id}`}
                             ref={(el) => {
                                 if (el && !el.dataset.animated) {
                                     el.dataset.animated = 'true';
                                     GSAPAnimations.petEntry(el, 0);
                                 }
                             }}
                             className={`sprite-v2 ${p.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.isHit && animEffect?.target==='player' && (!isDoubleBattle || animEffect?.slot === 0 || animEffect?.slot === undefined) && animEffect?.type !== 'SHINY_ENTRY' ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`}
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
                    <div className={`hud-card hud-player ${isDoubleBattle ? 'hud-card--double' : ''}`} style={isDoubleBattle ? {border: battle.doubleSlot === 0 && (battle.phase === 'input') ? '2px solid #FF9800' : undefined, boxShadow: battle.doubleSlot === 0 && battle.phase === 'input' ? '0 0 12px rgba(255,152,0,0.5)' : undefined} : undefined}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'2px'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold', whiteSpace:'nowrap'}}>
                              {isDoubleBattle && battle.doubleSlot === 0 && battle.phase === 'input' && <span style={{color:'#FF9800', marginRight:'3px'}}>▶</span>}
                              {p.name}
                            </span>
                            <span className="battle-level-badge" data-testid="player-level">Lv.{p.level}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'4px'}}>
                            <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[p.type]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[p.type]?.name || p.type}</span>
                            {p.secondaryType && p.secondaryType !== p.type && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[p.secondaryType]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[p.secondaryType]?.name}</span>}
                            {p.isFusedShiny ? (
                              <span style={{background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>🧬异色</span>
                            ) : p.isShiny ? (
                              <span style={{background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>✨闪光</span>
                            ) : null}
                            {renderSectBadge(p, 'player')}
                            {renderTraitBadge(p, 'player')}
                            {gang?.gangId && (() => {
                              const gi = getGangInfo();
                              return gi ? (
                                <span onClick={(ev) => { ev.stopPropagation(); const pb = getGangSkillBonus(getGangSkills(gang)); setBattleGangDetail({name: gi.name, icon: gi.icon, bonus: pb, side:'player'}); }} style={{display:'inline-flex', alignItems:'center', gap:'2px', background:'linear-gradient(90deg, rgba(76,175,80,0.8), rgba(56,142,60,0.6))', color:'#fff', fontSize:'9px', padding:'1px 6px', borderRadius:'10px', fontWeight:'bold', whiteSpace:'nowrap', border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer'}}>
                                  {gi.icon}{gi.name}
                                </span>
                              ) : null;
                            })()}
                            {renderBattleGeneralsBadge(battle.playerGenerals, 'player')}
                            {renderStatusBadges(p)}<TacticalStatus unit={p} turn={battle.turnCount || 0}/>
                            {renderBattleFruitBadge(p, 'player')}
                        </div>
                        {renderBattleStageRow(p, 0)}

                        <EnhancedHPBar 
                            current={p.currentHp} 
                            max={pStats.maxHp} 
                            label=""
                        />
                        {p.maxCE > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'9px', color: p.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{p.curseGrade?.name || ''}</span>
                                <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                                    <div style={{width:`${Math.min(100, ((p.cursedEnergy||0)/Math.max(1,p.maxCE))*100)}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#CE93D8'}}>{p.cursedEnergy||0}/{p.maxCE}<span style={{fontSize:'8px',color:'#9C27B0',marginLeft:'2px'}}>队</span></span>
                            </div>
                        )}
                        {(p.maxChakra || 0) > 0 && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'10px', color:'#FF6F00', fontWeight:'bold'}}>🍥</span>
                                <div style={{flex:1, height:'6px', background:'rgba(255,111,0,0.15)', borderRadius:'3px', overflow:'hidden', border:'1px solid rgba(255,111,0,0.2)'}}>
                                    <div style={{width:`${Math.min(100, ((p.chakra||0)/Math.max(1,p.maxChakra))*100)}%`, height:'100%', background:'linear-gradient(90deg, #E65100, #FF6F00, #FFB74D)', transition:'width 0.3s', borderRadius:'3px', boxShadow:'0 0 4px rgba(255,111,0,0.4)'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#FFB74D', fontWeight:'700'}}>{p.chakra||0}/{p.maxChakra}<span style={{fontSize:'8px',color:'#E65100',marginLeft:'2px'}}>队</span></span>
                                {p.bijuuTransformed && <span style={{fontSize:'8px', color:'#FF5722', fontWeight:'bold', animation:'shiny-flash 1.5s infinite'}}>🦊尾兽化</span>}
                            </div>
                        )}
                        {renderPartyIndicators(battle.playerCombatStates)}
                        {(battle.sharedPlayerMaxChakra > 0 || battle.sharedPlayerMaxCE > 0) && (
                        <div style={{fontSize:'9px', color:'rgba(255,200,100,0.5)', textAlign:'center', marginTop:'2px'}}>
                          本回合可用
                          {(battle.sharedPlayerMaxChakra || 0) > 0 && ` · 查克拉 ${getBattleResourceValue(battle, isDoubleBattle ? (doubleCurrentPet || p) : p, 'player', 'chakra')}/${battle.sharedPlayerMaxChakra || 100}`}
                          {(battle.sharedPlayerMaxCE || 0) > 0 && ` · 咒力 ${getBattleResourceValue(battle, isDoubleBattle ? (doubleCurrentPet || p) : p, 'player', 'ce')}/${battle.sharedPlayerMaxCE || 100}`}
                        </div>
                        )}
                        {sectPlayer?.playerSect && battle._sectMomentum != null && (
                            <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                                <span style={{fontSize:'10px', color:'#C62828', fontWeight:'bold'}}>⚔️气势</span>
                                <div style={{flex:1, height:'6px', background:'rgba(198,40,40,0.15)', borderRadius:'3px', overflow:'hidden', border:'1px solid rgba(198,40,40,0.2)'}}>
                                    <div style={{width:`${Math.min(100, ((battle._sectMomentum||0)/SECT_MOMENTUM_MAX)*100)}%`, height:'100%', background:'linear-gradient(90deg, #B71C1C, #E53935)', transition:'width 0.3s'}}></div>
                                </div>
                                <span style={{fontSize:'9px', color:'#EF9A9A'}}>{battle._sectMomentum||0}/{SECT_MOMENTUM_MAX}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================== */}
                {/* 2b. 我方区域2 (右下角, 仅双打) */}
                {/* ========================================== */}
                {isDoubleBattle && p2 && (
                  <div className="player-zone-v2 double-mode battle-slot-secondary" style={{position:'absolute', bottom:'4%', right:'2%', display:'flex', flexDirection:'column', alignItems:'flex-end', zIndex:5, opacity: p2.currentHp <= 0 ? 0.4 : 1}}>
                    <div className={`sprite-wrapper player-sprite-wrapper ${p2.fruitTransformed ? 'fruit-transformed' : ''}`} style={{position:'relative', marginBottom:'6px'}}>
                      <div className="battle-platform battle-platform-player" />
                      <div style={{transform:'scaleX(-1)'}}>
                        <div className={`sprite-v2 ${p2.currentHp <= 0 ? 'anim-faint' : 'anim-idle-float'} ${animEffect?.isHit && animEffect?.target==='player' && animEffect?.slot === 1 && animEffect?.type !== 'SHINY_ENTRY' ? (animEffect?.isCrit ? 'anim-shake-crit anim-hit-flash' : 'anim-shake anim-hit-flash') : ''}`}
                          style={{filter: p2.isFusedShiny ? 'drop-shadow(0 0 5px rgba(213,0,249,0.5)) hue-rotate(150deg)' : p2.isShiny ? 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' : 'drop-shadow(0 8px 12px rgba(0,0,0,0.2))'}}>
                          {renderAvatar(p2)}
                        </div>
                      </div>
                    </div>
                    <div className="hud-card hud-player hud-card--double" style={{border: battle.doubleSlot === 1 && (battle.phase === 'input' || battle.phase === 'double_input_2') ? '2px solid #FF9800' : undefined, boxShadow: battle.doubleSlot === 1 && battle.phase === 'double_input_2' ? '0 0 12px rgba(255,152,0,0.5)' : undefined}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'2px'}}>
                        <span style={{fontSize:'14px', fontWeight:'bold', whiteSpace:'nowrap'}}>
                          {battle.doubleSlot === 1 && battle.phase === 'double_input_2' && <span style={{color:'#FF9800', marginRight:'3px'}}>▶</span>}
                          {p2.name}
                        </span>
                        <span className="battle-level-badge">Lv.{p2.level}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap', marginBottom:'4px'}}>
                        <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[p2.type]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[p2.type]?.name || p2.type}</span>
                        {p2.secondaryType && p2.secondaryType !== p2.type && <span style={{fontSize:'8px', padding:'1px 4px', borderRadius:'4px', background: TYPES[p2.secondaryType]?.color || '#888', color:'#fff', fontWeight:'bold'}}>{TYPES[p2.secondaryType]?.name}</span>}
                        {p2.isFusedShiny ? (
                          <span style={{background:'linear-gradient(135deg,#D500F9,#7B1FA2)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>🧬异色</span>
                        ) : p2.isShiny ? (
                          <span style={{background:'linear-gradient(135deg,#FFD700,#FF6F00)', color:'#fff', fontSize:'8px', padding:'1px 5px', borderRadius:'8px', fontWeight:'bold', whiteSpace:'nowrap', animation:'shiny-flash 2s infinite'}}>✨闪光</span>
                        ) : null}
                        {renderSectBadge(p2, 'player', 1)}
                        {renderTraitBadge(p2, 'player', 1)}
                        {renderStatusBadges(p2)}<TacticalStatus unit={p2} turn={battle.turnCount || 0}/>
                        {renderBattleFruitBadge(p2, 'player', 1)}
                      </div>
                      {renderBattleStageRow(p2, 1)}
                      <EnhancedHPBar current={p2.currentHp} max={p2Stats.maxHp} label="" />
                      {p2.maxCE > 0 && (
                        <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                          <span style={{fontSize:'9px', color: p2.curseGrade?.color || '#999', fontWeight:'bold'}}>🔮{p2.curseGrade?.name || ''}</span>
                          <div style={{flex:1, height:'4px', background:'#333', borderRadius:'2px', overflow:'hidden'}}>
                            <div style={{width:`${Math.min(100, ((p2.cursedEnergy||0)/Math.max(1,p2.maxCE))*100)}%`, height:'100%', background:'linear-gradient(90deg, #7B1FA2, #E040FB)', transition:'width 0.3s'}}></div>
                          </div>
                          <span style={{fontSize:'9px', color:'#CE93D8'}}>{p2.cursedEnergy||0}/{p2.maxCE}<span style={{fontSize:'8px',color:'#9C27B0',marginLeft:'2px'}}>队</span></span>
                        </div>
                      )}
                      {(p2.maxChakra || 0) > 0 && (
                        <div style={{display:'flex', alignItems:'center', gap:'4px', marginTop:'3px'}}>
                          <span style={{fontSize:'10px', color:'#FF6F00', fontWeight:'bold'}}>🍥</span>
                          <div style={{flex:1, height:'6px', background:'rgba(255,111,0,0.15)', borderRadius:'3px', overflow:'hidden', border:'1px solid rgba(255,111,0,0.2)'}}>
                            <div style={{width:`${Math.min(100, ((p2.chakra||0)/Math.max(1,p2.maxChakra))*100)}%`, height:'100%', background:'linear-gradient(90deg, #E65100, #FF6F00, #FFB74D)', transition:'width 0.3s', borderRadius:'3px', boxShadow:'0 0 4px rgba(255,111,0,0.4)'}}></div>
                          </div>
                          <span style={{fontSize:'9px', color:'#FFB74D', fontWeight:'700'}}>{p2.chakra||0}/{p2.maxChakra}<span style={{fontSize:'8px',color:'#E65100',marginLeft:'2px'}}>队</span></span>
                          {p2.bijuuTransformed && <span style={{fontSize:'8px', color:'#FF5722', fontWeight:'bold', animation:'shiny-flash 1.5s infinite'}}>🦊尾兽化</span>}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                        logs={battle.logs.slice(0, 12)}
                    />
                </div>
            )}

        </div>

        {/* 底部操作栏 */}
        <div className="battle-command-deck" aria-label="战斗指令">
            <BattleTacticsBar battle={battle} onUndo={()=>setBattle(prev=>prev && prev.phase==='double_input_2' ? {...prev,phase:'input',doubleSlot:0,doubleActions:[],pendingDoubleMove:undefined} : prev)}/>
            <div className="battle-command-topline">
              <div>
                <span>{battleModeLabel}</span>
                <strong>R{(battle.turnCount || 0)+1}</strong>
              </div>
              <div>
                <span>行动</span>
                <strong>{activeCommandPet?.name || '待命'}</strong>
              </div>
              <div className={`battle-tempo-pill is-${tempoLabel === '优势' ? 'good' : tempoLabel === '承压' ? 'danger' : 'even'}`}>
                <span>{tempoLabel}</span>
                <strong>{playerHpPct}% / {enemyHpPct}%</strong>
              </div>
            </div>
            {trainerIntelVisible && (
              <details className="battle-tactical-intel">
                <summary>
                  <span className="battle-intel-title">🎯 战术情报</span>
                  {battle.trainerTactic && <span className="battle-intel-chip">战术 · {battle.trainerTactic.name}</span>}
                  {pressureLabel && <span className="battle-intel-chip">压力 · {pressureLabel}</span>}
                  {battle.trainerCoverage && (
                    <span className="battle-intel-chip">覆盖 · {battle.trainerCoverage.target}{coverageTypes ? ` (${coverageTypes})` : ''}</span>
                  )}
                  {battle.battleDirective && (
                    <span className="battle-intel-chip is-objective">目标 · {battle.battleDirective.name} · {liveDirectiveStatus.progress}</span>
                  )}
                  <span className="battle-intel-toggle">详情</span>
                </summary>
                <div className="battle-intel-grid">
                  {battle.trainerTactic && (
                    <div><strong>对手战术 · {battle.trainerTactic.name}</strong><span>{battle.trainerTactic.desc}</span></div>
                  )}
                  {pressureLabel && (
                    <div><strong>动态压力 · {pressureLabel}</strong><span>{battle.trainerPressure?.desc || '对手按当前地图强度正常出战，没有额外等级或阵容强化。'}</span></div>
                  )}
                  {battle.trainerCoverage && (
                    <div><strong>针对首发 · {battle.trainerCoverage.target}</strong><span>对手准备了可覆盖 {coverageTypes || '当前属性'} 的出战位，但不会保证硬克制。</span></div>
                  )}
                  {battle.battleDirective && (
                    <div><strong>追加目标 · {battle.battleDirective.name}</strong><span>{battle.battleDirective.desc} · 当前：{liveDirectiveStatus.progress}</span></div>
                  )}
                </div>
              </details>
            )}
            {(battle.phase === 'input' || battle.phase === 'input_p1' || battle.phase === 'double_input_2') ? (
              <div className="battle-command-body">
                <div className="battle-move-pane">
                    <CombatFamilyTabs moves={activeCommandPet?.combatMoves || []} family={visibleMoveFamily} onChange={setBattleMoveFamily}/>
                    {battle.isPvP && (
                        <div style={{textAlign:'center', background: '#2196F3', color:'#fff', fontWeight:'bold', padding:'4px', fontSize:'11px', flexShrink: 0, borderRadius:'6px', margin:'0 0 4px'}}>
                            🎮 PvP对战 · 对手由AI控制
                        </div>
                    )}
                    {isDoubleBattle && (
                        <div className="battle-double-step">
                          <span>指令 {battle.phase==='double_input_2' ? '2' : '1'}/2</span>
                          <span>
                            {battle.pendingDoubleMove !== undefined
                              ? '攻击目标待确认'
                              : doubleCurrentPet?.name || p?.name}
                          </span>
                        </div>
                    )}
                    {/* 双打目标选择 */}
                    {isDoubleBattle && battle.pendingDoubleMove !== undefined && (() => {
                      const aliveEnemies = (battle.enemyActiveIdxs || []).filter(idx => battle.enemyParty?.[idx]?.currentHp > 0);
                      return (
                        <div className="battle-target-options" style={{display:'flex', gap:'8px', justifyContent:'center', margin:'0 0 8px', flexWrap:'wrap'}}>
                          {aliveEnemies.map(eIdx => {
                            const ep = battle.enemyParty[eIdx];
                            return (
                              <button key={eIdx} onMouseEnter={() => setBattle(prev => prev ? { ...prev, targetIdx: eIdx } : null)} onClick={() => {
                                const mi = battle.pendingDoubleMove;
                                setBattle(prev => ({ ...prev, pendingDoubleMove: undefined, targetIdx: eIdx }));
                                executeDoubleTurn(mi, eIdx);
                              }} style={{
                                flex:1, minWidth:'100px', maxWidth:'200px', padding:'10px 12px', borderRadius:'12px',
                                background:'linear-gradient(135deg, #E53935, #FF7043)', color:'#fff', border:'2px solid rgba(255,255,255,0.3)',
                                fontWeight:'bold', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                                boxShadow:'0 2px 8px rgba(229,57,53,0.4)', transition:'transform 0.15s'
                              }}>
                                <span>🎯</span>
                                <span>{ep.name}</span>
                                <span style={{fontSize:'10px', opacity:0.8}}>Lv.{ep.level}</span>
                              </button>
                            );
                          })}
                          <button onClick={() => setBattle(prev => ({ ...prev, pendingDoubleMove: undefined }))} style={{
                            padding:'8px 16px', borderRadius:'10px', background:'rgba(255,255,255,0.1)', color:'#aaa',
                            border:'1px solid rgba(255,255,255,0.2)', fontSize:'12px', cursor:'pointer'
                          }}>取消</button>
                        </div>
                      );
                    })()}
                    {/* 速度先手指示 */}
                    {!isDoubleBattle && (() => {
                      let mySpd = getStats(p, p.stages, p.status).spd;
                      const eRaw = battle.enemyParty?.[battle.enemyActiveIdx];
                      let eSpd = eRaw ? getStats(eRaw, eRaw.stages, eRaw.status).spd : 0;
                      const domSpd = battle.activeDomain;
                      if (domSpd && domSpd.turnsLeft > 0 && domSpd.effect) {
                        if (domSpd.ownerSide === 'player') {
                          if (domSpd.effect.spdBoost) mySpd = Math.floor(mySpd * domSpd.effect.spdBoost);
                          if (domSpd.effect.enemySpdDown) eSpd = Math.floor(eSpd * domSpd.effect.enemySpdDown);
                        } else {
                          if (domSpd.effect.spdBoost) eSpd = Math.floor(eSpd * domSpd.effect.spdBoost);
                          if (domSpd.effect.enemySpdDown) mySpd = Math.floor(mySpd * domSpd.effect.enemySpdDown);
                        }
                      }
                      const faster = mySpd > eSpd;
                      const tied = mySpd === eSpd;
                      return <div className="battle-turn-order" style={{color:faster?'#9de2bf':tied?'#f4d484':'#f7aaa4'}}>
                        {faster ? `⚡先手 (${mySpd} vs ${eSpd})` : tied ? `⚖同速 (${mySpd})` : `🐢后手 (${mySpd} vs ${eSpd})`}
                      </div>;
                    })()}
                    {/* 技能网格 - 占满上方空间 */}
                    {(!isDoubleBattle || battle.pendingDoubleMove === undefined) && (
                    <div className="battle-move-grid" aria-label="可用技能">
                            {(() => {
                            const skillPet = isDoubleBattle ? (doubleCurrentPet || p) : p;
                            const activeMoves = skillPet?.combatMoves || [];
                                const selectedPreviewEnemyIdx = isDoubleBattle
                                  && Number.isInteger(battle.targetIdx)
                                  && battle.enemyParty?.[battle.targetIdx]?.currentHp > 0
                                  ? battle.targetIdx
                                  : undefined;
                                const previewEnemyIdx = isDoubleBattle
                                  ? (selectedPreviewEnemyIdx ?? battle.enemyActiveIdxs?.find(idx => battle.enemyParty?.[idx]?.currentHp > 0) ?? battle.enemyActiveIdx)
                                  : battle.enemyActiveIdx;
                                const activeEnemy = battle.enemyParty?.[previewEnemyIdx];
                                return activeMoves.map((m, i) => {
                                    if (getCombatFamily(m)!==visibleMoveFamily) return null;
                                    const cp = isDoubleBattle ? doubleCurrentPet : p;
                                    const effectiveChakraCost = getEffectiveChakraCost(m, battle._resonanceFx || {});
                                    let moveDisabledReason = '';
                                    if (m.isCursed) {
                                      const cCd = cp?.cursedCooldowns?.[m.id || m.name] || 0;
                                      if (cCd > 0) moveDisabledReason = `(CD:${cCd})`;
                                      else if ((m.pp || 0) <= 0) moveDisabledReason = '(无PP)';
                                      else if (getBattleResourceValue(battle, cp, 'player', 'ce') < (m.ceCost || 0)) moveDisabledReason = '(咒力不足)';
                                    } else if (m.isMartialArt) {
                                      const mcost = m.momentumCost || 0;
                                      if (mcost > 0 && (battle._sectMomentum || 0) < mcost) moveDisabledReason = '(气势不足)';
                                      else if ((m.pp || 0) <= 0) moveDisabledReason = '(无PP)';
                                    } else if (m.isJutsu) {
                                      const jCd = cp?.jutsuCooldowns?.[m.jutsuId || m.name] || 0;
                                      if (jCd > 0) moveDisabledReason = `(CD:${jCd})`;
                                      else if ((m.pp || 0) <= 0) moveDisabledReason = '(无PP)';
                                      else if (getBattleResourceValue(battle, cp, 'player', 'chakra') < effectiveChakraCost) moveDisabledReason = '(查克拉不足)';
                                    } else if ((m.pp || 0) <= 0) {
                                      moveDisabledReason = '(无PP)';
                                    }
                                    const movePower = m.p ?? m.power ?? 0;
                                    const forecastTarget = isSelfTargetingCombatMove(m) ? skillPet : activeEnemy;
                                    const forecast = buildMoveForecast({
                                      multiplier: activeEnemy && movePower > 0
                                        ? getMoveTypeMultiplier(m, activeEnemy, battle)
                                        : 1,
                                      power: movePower,
                                      accuracy: m.acc,
                                      alwaysHit: m.alwaysHit,
                                      isStab: movePower > 0 && !!m.t && getUnitTypeList(skillPet).includes(m.t),
                                      targetName: forecastTarget?.name,
                                    });
                                    return (
                                    <EnhancedMoveButton
                                        key={i}
                                        forecast={forecast}
                                        move={{
                                            t: m.t || 'NORMAL',
                                            name: m.name,
                                            power: movePower,
                                            pp: m.pp,
                                        maxPp: m.maxPP || 15,
                                        acc: m.acc,
                                        desc: m.desc || '',
                                        isCursed: m.isCursed,
                                        ceCost: m.ceCost,
                                        isExtra: m.isExtra,
                                        isFruitMove: m.isFruitMove,
                                        isUltraFinisher: m.isUltraFinisher,
                                        isJutsu: m.isJutsu,
                                        chakraCost: effectiveChakraCost,
                                        isMartialArt: m.isMartialArt,
                                        momentumCost: m.momentumCost,
                                        isBijuu: m.isBijuu,
                                        }}
                                        onClick={() => { 
                                            if (battle.isPvP) {
                                              handlePvPInput(1, 'move', i);
                                            } else if (isDoubleBattle) {
                                              const aliveEnemies = (battle.enemyActiveIdxs || []).filter(idx => battle.enemyParty?.[idx]?.currentHp > 0);
                                              if (aliveEnemies.length > 1 && !isSelfTargetingCombatMove(m)) {
                                                const defT = aliveEnemies[0];
                                                setBattle(prev => ({ ...prev, pendingDoubleMove: i, targetIdx: defT }));
                                              } else if (aliveEnemies.length >= 1) {
                                                executeDoubleTurn(i, aliveEnemies[0]);
                                              } else {
                                                const fallbackIdx = battle.enemyParty?.findIndex(ep => ep.currentHp > 0) ?? 0;
                                                executeDoubleTurn(i, fallbackIdx);
                                              }
                                            } else {
                                                executeTurn(i);
                                            }
                                        }}
                                    disabled={!canUseCombatMove(battle, cp, m, 'player')}
                                        disabledReason={moveDisabledReason}
                                        index={i}
                                    />
                                ); });
                            })()}
                        </div>
                    )}
                    {battle.isDouble && !battle.isPvP && battle.phase === 'input' && (battle.doubleSlot || 0) === 0 && (!isDoubleBattle || battle.pendingDoubleMove === undefined) && (() => {
                      const slot0Idx = battle.activeIdxs?.[0];
                      const slot1Idx = battle.activeIdxs?.[1];
                      const pet0 = battle.playerCombatStates?.[slot0Idx];
                      const pet1 = battle.playerCombatStates?.[slot1Idx];
                      if (!pet0 || !pet1 || pet0.currentHp <= 0 || pet1.currentHp <= 0) return null;
                      const ninjaRk = getNinjaRank(narutoState?.examsCompleted || 0);
                      const availCombos = COMBO_JUTSU_LIST.filter((combo) =>
                        isComboJutsuAvailableInDouble(combo, {
                          pet0,
                          pet1,
                          ninjaRankId: ninjaRk.id,
                          party,
                          availableChakra: battle.sharedPlayerChakra,
                          chakraCostMult: battle._resonanceFx?.chakraCostMult || 1,
                        }),
                      );
                      if (availCombos.length === 0) return null;
                      return (
                        <details className="battle-combo-options">
                          <summary style={{ fontSize: '11px', color: '#FFD54F', fontWeight: '800', cursor: 'pointer', listStyle: 'none', marginBottom: '6px' }}>
                            🌀 组合忍术（点击展开 · 双方精灵联合施放）
                          </summary>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                            {availCombos.map((combo) => (
                              <button
                                key={combo.id}
                                type="button"
                                onClick={() => {
                                  const aliveEnemies = (battle.enemyActiveIdxs || []).filter((idx) => battle.enemyParty?.[idx]?.currentHp > 0);
                                  const tgt = aliveEnemies[0] ?? battle.enemyActiveIdxs?.[0];
                                  const newActions = [{ moveIdx: -3, activeIdx: slot0Idx, comboJutsuId: combo.id, targetEnemyIdx: tgt }];
                                  setBattle((prev) => ({ ...prev, phase: 'busy', doubleActions: newActions }));
                                  void executeDoubleRound(newActions);
                                }}
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '8px',
                                  fontSize: '10px',
                                  fontWeight: '700',
                                  background: 'linear-gradient(135deg, rgba(156,39,176,0.3), rgba(255,152,0,0.2))',
                                  border: '1px solid rgba(255,152,0,0.4)',
                                  color: '#FFD54F',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                              >
                                <div>{combo.icon} {combo.name}</div>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                                  威力{combo.power} · {getEffectiveChakraCost(combo, battle._resonanceFx || {})}查克拉
                                  {getEffectiveChakraCost(combo, battle._resonanceFx || {}) < combo.chakraCost ? `（原${combo.chakraCost}）` : ''}
                                </div>
                              </button>
                            ))}
                          </div>
                        </details>
                      );
                    })()}
                </div>
                    {/* 独立操作区，不参与技能网格的高度分配。 */}
                        {!battle.isPvP ? (
                        <div className="battle-action-list" aria-label="其他行动">
                            <button type="button" className="action-btn-h" onClick={()=>executeTurn(-10)} title="优先级+2，本回合下一次直接伤害减半"><Shield size={16}/>防御</button>
                            <button className="action-btn-h btn-catch" onClick={() => { setShowBallMenu(true); setBattleBagTab('balls'); }} disabled={isDoubleBattle || battle.type === 'ultra_trial'} title={battle.type === 'ultra_trial' ? '模拟试炼禁用道具' : isDoubleBattle ? '双打模式中无法使用背包' : ''}><Backpack size={16} aria-hidden="true" />背包</button>
                            <button className="action-btn-h btn-switch" onClick={() => setBattle(prev => ({...prev, showSwitch: true}))} disabled={p.activeVow?.sacrifice?.noSwitch || isDoubleBattle} title={isDoubleBattle ? '双打模式中无法交换' : ''}><ArrowLeftRight size={16} aria-hidden="true" />交换</button>
                            {battle.type === 'ultra_trial' && <button type="button" className="action-btn-h" onClick={handleDefeat}><LogOut size={16} />结束试炼</button>}
                            {battle.type !== 'ultra_trial' && <button className="action-btn-h btn-run" onClick={handleRun} disabled={battle.isTrainer || battle.isGym || battle.isChallenge || battle.isStory || battle.isPvP || battle.isBoss || battle.type === 'naruto_story' || battle.type === 'naruto_exam' || battle.type === 'world_boss' || battle.type === 'arena' || battle.type === 'tower' || battle.type === 'elemental_trial' || battle.type === 'gang_war' || battle.type === 'kingdom_war' || battle.type === 'capital_siege' || battle.type === 'infinity' || battle.type === 'boss_rush' || battle.type === 'league' || battle.type === 'spirit_domain' || battle.type === 'eco_crisis' || !!battle.dungeonId}><LogOut size={16} aria-hidden="true" />逃跑</button>}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; return cp.devilFruit && !cp.fruitUsed && !cp.fruitTransformed && !cp.ultraTransformed && !cp.bijuuTransformed ? (() => {
                              const minTurn = getFruitMinTurn();
                              const turnOk = battle.turnCount >= minTurn;
                              const hpOk = cp.currentHp <= getStats(cp, cp.stages).maxHp * 0.6;
                              const canUse = turnOk && hpOk && !getBurstBlock(battle);
                              const hint = getBurstBlock(battle) || (!turnOk ? `需完成${minTurn}回合，HP不高于60%` : 'HP不高于60%');
                              return <button className="action-btn-h" title={canUse ? '果实觉醒' : hint} disabled={!canUse} onClick={executeDevilFruit}>果实觉醒</button>;
                            })() : null; })()}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; return (cp.maxCE > 0 || (cp.maxChakra || 0) > 0) ? <button className="action-btn-h" style={{background:'linear-gradient(135deg,#7B1FA2,#E040FB)'}} onClick={executeChargeCE}>蓄力</button> : null; })()}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; const availableCE = getBattleResourceValue(battle, cp, 'player', 'ce'); return cp.hasDomain && !cp.usedDomain && battle.activeDomain?.ownerSide !== 'player' ? <button className="action-btn-h" style={{background:'linear-gradient(135deg,#BF360C,#FF6D00)'}} onClick={executeDomainExpansion} disabled={availableCE < (DOMAINS[cp.domainType]?.ceCost||999)}>{battle.activeDomain?.ownerSide === 'enemy' ? '领域对撞' : '领域'}</button> : null; })()}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; return cp.maxCE > 0 && !cp.activeVow ? <button className="action-btn-h" style={{background:'linear-gradient(135deg,#1A237E,#42A5F5)'}} onClick={() => setVowModal(true)}>缚誓</button> : null; })()}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; const available = getBattleResourceValue(battle, cp, 'player', 'chakra'); const cost = Math.floor((cp.maxChakra || 1) * BIJUU_TRANSFORM_COST_PCT); return cp.bijuuData && !cp.bijuuUsed && !cp.bijuuTransformed && !cp.fruitTransformed && !cp.ultraTransformed ? <button className="action-btn-h" style={{background:'linear-gradient(135deg,#FF6F00,#FF8F00)', opacity: available >= cost ? 1 : 0.5}} onClick={executeBijuuTransform} disabled={available < cost}>🦊尾兽化</button> : null; })()}
                            {(() => { const cp = isDoubleBattle ? (doubleCurrentPet || p) : p; if (!cp.ultraHeroId) return null; const reason = getUltraTransformBlock(battle, cp); return <button type="button" className="action-btn-h" style={{background:cp.ultraTransformed ? '#286657' : '#91394c'}} disabled={!!reason} title={reason || `${ULTRA_BY_ID[cp.ultraHeroId]?.name} · 三回合光能，必杀后解除`} onClick={executeUltraTransform}><Sparkles size={15} />{cp.ultraTransformed ? `光能 ${cp.ultraTurnsLeft}` : battle.ultraUsed ? '光能已用' : '光之变身'}</button>; })()}
                            {!isDoubleBattle && (() => {
                              const ap = battle.playerCombatStates?.[battle.activeIdx];
                              const hasPartner = ap?.partnerId && battle.playerCombatStates?.find(pp => (pp.uid || pp.id) === ap.partnerId && pp.currentHp > 0);
                              if (!hasPartner || comboUsedThisBattle) return null;
                              const turnOkC = (battle.turnCount || 0) >= 3;
                              const canCombo = canUseCombo(battle);
                              return <button className="action-btn-h" style={{background: canCombo ? 'linear-gradient(135deg,#E91E63,#FF6090)' : 'linear-gradient(135deg,#757575,#9E9E9E)', opacity: canCombo ? 1 : 0.7}} onClick={() => canCombo ? executeComboAttack() : showMapToast('⚠️', '协作技', `需要 ≥3 回合 · 当前 ${battle.turnCount || 0}`, 1500)} disabled={!canCombo}>{canCombo ? '协作' : `协作(${3-(battle.turnCount||0)}回合)`}</button>;
                            })()}
                            </div>
                        ) : (
                        <div className="battle-action-list" aria-label="其他行动">
                            <button className="action-btn-h" style={{background:'#673AB7'}} onClick={() => { const team = battle.playerCombatStates; const available = team.map((p, i) => ({...p, _idx: i})).filter((p, i) => p.currentHp > 0 && i !== battle.activeIdx); setPetPicker({ title: '选择替补精灵', list: available, onSelect: (pet) => { handlePvPInput(1, 'switch', pet._idx); setPetPicker(null); } }); }}>换人</button>
                            </div>
                        )}
                </div>
            ) : (
                <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                    <span role="status" style={{color:'#b8c5c7', fontWeight:600, fontSize:13, letterSpacing:0}}>{battle.phase === 'busy' ? '行动结算中' : battle.phase === 'anim' ? '行动进行中' : battle.showSwitch ? '等待替补' : '处理中'}</span>
                </div>
            )}
        </div> 
        
        {/* 战斗内背包弹窗 */}
        {showBallMenu && (
          <div className="ball-menu-overlay" onClick={() => setShowBallMenu(false)}>
            <div className="ball-menu-card" onClick={e => e.stopPropagation()}>
              <div className="bag-header"><div className={`bag-tab ${battleBagTab==='balls'?'active':''}`} onClick={()=>setBattleBagTab('balls')} style={{display:'flex',alignItems:'center',gap:4}}>{renderBallCSS('poke',16)} 精灵球</div><div className={`bag-tab ${battleBagTab==='meds'?'active':''}`} onClick={()=>setBattleBagTab('meds')} style={{display:'flex',alignItems:'center',gap:4}}>{renderMedCSS('potion',16)} 药品</div><div className={`bag-tab ${battleBagTab==='berries'?'active':''}`} onClick={()=>setBattleBagTab('berries')} style={{display:'flex',alignItems:'center',gap:4}}><span style={{fontSize:14}}>🍇</span> 树果</div></div>
              <div className="bag-list-area">
                {battleBagTab === 'balls' && battle._kaijuEncounter && <div className="empty-hint">怪兽无法捕捉 · 击败后收录讨伐档案</div>}
                {battleBagTab === 'balls' && !battle._kaijuEncounter && (
                  <>
                    {Object.keys(inventory.balls || {}).filter(k => (inventory.balls||{})[k] > 0).length === 0 && (kingdomWar?.warBalls || 0) <= 0 && <div className="empty-hint">没有可用的精灵球</div>}
                    {Object.keys(inventory.balls || {}).map(type => { const count = (inventory.balls||{})[type]; if (count <= 0) return null; const ball = BALLS[type]; if (!ball) return null; const catchTargetIdx = battle?.isDouble ? (battle?.targetIdx ?? battle?.enemyActiveIdxs?.find(idx => battle?.enemyParty?.[idx]?.currentHp > 0) ?? battle?.enemyActiveIdx) : battle?.enemyActiveIdx; const enemy = battle?.enemyParty?.[catchTargetIdx]; const catchPct = enemy ? Math.min(100, Math.round(calculateCatchRate(type, enemy) * 100)) : 0; const catchColor = catchPct >= 60 ? '#4CAF50' : catchPct >= 30 ? '#FF9800' : '#F44336'; return ( <div key={type} className="bag-list-item" onClick={() => handleCatch(type)}><div className="item-icon-box">{renderBallCSS(type, 32)}</div><div className="item-info-box"><div className="item-name">{ball.name}{enemy && <span style={{fontSize:'10px',marginLeft:'6px',color:catchColor,fontWeight:700}}>{type==='master'?'必捕':catchPct+'%'}</span>}</div><div className="item-desc">{ball.desc}{battle?.isDouble && enemy ? ` · 目标：${enemy.name}` : ''}</div></div><div className="item-count">x{count}</div></div> ); })}
                    {(kingdomWar?.warBalls || 0) > 0 && (() => { const catchTargetIdx = battle?.isDouble ? (battle?.targetIdx ?? battle?.enemyActiveIdxs?.find(idx => battle?.enemyParty?.[idx]?.currentHp > 0) ?? battle?.enemyActiveIdx) : battle?.enemyActiveIdx; const enemy = battle?.enemyParty?.[catchTargetIdx]; const catchPct = enemy ? Math.min(100, Math.round(calculateCatchRate('war', enemy) * 100)) : 0; const catchColor = catchPct >= 60 ? '#4CAF50' : catchPct >= 30 ? '#FF9800' : '#F44336'; return ( <div key="war" className="bag-list-item" onClick={() => handleCatch('war')}><div className="item-icon-box"><span style={{fontSize:28}}>⚔️</span></div><div className="item-info-box"><div className="item-name">国战精灵球{enemy && <span style={{fontSize:'10px',marginLeft:'6px',color:catchColor,fontWeight:700}}>{catchPct}%</span>}</div><div className="item-desc">捕获率3.0x，消耗国战商店购买的专用球{battle?.isDouble && enemy ? ` · 目标：${enemy.name}` : ''}</div></div><div className="item-count">x{kingdomWar.warBalls}</div></div> ); })()}
                  </>
                )}
                {battleBagTab === 'meds' && (
                  <>
                    {Object.keys(inventory.meds || {}).filter(k => (inventory.meds||{})[k] > 0).length === 0 && <div className="empty-hint">没有可用的药品</div>}
                    {Object.keys(inventory.meds || {}).map(key => { const count = (inventory.meds||{})[key]; if (count <= 0) return null; const item = MEDICINES[key]; if (!item) return null; return ( <div key={key} className="bag-list-item" onClick={() => useBattleItem(key, 'meds')}><div className="item-icon-box">{renderMedCSS(key, 32) || <span>{item.icon}</span>}</div><div className="item-info-box"><div className="item-name">{item.name}</div><div className="item-desc">{item.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
                  </>
                )}
                {battleBagTab === 'berries' && (
                  <>
                    {Object.keys(normalizeBerriesInventory(inventory.berries)).filter(k => (normalizeBerriesInventory(inventory.berries)[k] || 0) > 0).length === 0 && <div className="empty-hint">没有可用的树果</div>}
                    {Object.keys(BERRIES).map(key => { const count = normalizeBerriesInventory(inventory.berries)[key] || 0; if (count <= 0) return null; const item = BERRIES[key]; return ( <div key={key} className="bag-list-item" onClick={() => useBattleItem(key, 'berries')}><div className="item-icon-box"><span style={{fontSize:26}}>{item.icon}</span></div><div className="item-info-box"><div className="item-name">{item.name}</div><div className="item-desc">{item.desc}</div></div><div className="item-count">x{count}</div></div> ); })}
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
              const tc = battle?.turnCount || 0;
              const dist = 60 + ((i * 7919 + tc * 1301) % 41);
              return <div key={`star-${i}`} className="catch-star-particle" style={{
                '--sx': `${Math.cos(angle*Math.PI/180)*dist}px`,
                '--sy': `${Math.sin(angle*Math.PI/180)*dist}px`,
                '--star-color': ['#FFD600','#FF6D00','#FF1744','#E040FB','#2979FF'][i%5],
                animationDelay: `${i * 0.05}s`
              }} />;
            })}
            <div className="catch-gotcha-text">捕获成功！</div>
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
  
}
