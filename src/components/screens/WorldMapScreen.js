import React from 'react';
import _ from 'lodash';
import { ALL_FACTION_IDS } from '../../data/kingdom';
import { applyDefection } from '../../data/kingdom';
import { applyDiplomaticAction } from '../../data/kingdomPolitics';
import { assignTerritoryGuards } from '../../data/kingdom';
import { ATTR_CHALLENGES } from '../../data';
import { buildKingdomStrategicBrief } from '../../data/kingdom';
import { calcGeneralsTotalBonus } from '../../data/generals';
import { calcGrainCap } from '../../data/kingdom';
import { canFactionAttack } from '../../data/kingdomPolitics';
import { canRejoinFaction } from '../../data/kingdom';
import { CAPITAL_MAP_IDS } from '../../data/kingdom';
import { CAPITAL_SIEGE_MAX_TERRITORIES } from '../../data/kingdom';
import { CHALLENGES } from '../../data';
import { checkTagRestriction } from '../../data';
import { CONTEST_BAR_IDS } from '../../data/kwSiege';
import { CONTEST_CAPTURE_THRESHOLD } from '../../data/kwSiege';
import { CONTEST_SIEGE_MIN_DEPLOY } from '../../data/kwSiege';
import { CONTESTED_MAP_IDS } from '../../data/kingdom';
import { CONTESTED_SIEGE_MAP_IDS } from '../../data/kwSiege';
import { DIPLOMACY_CONFIG } from '../../data/kingdomPolitics';
import { DOUBLE_CHALLENGES } from '../../data';
import { DUNGEONS } from '../../data';
import { evaluateKwSiegeBattle } from '../../data/kwSiege';
import { evaluateTerritoryAssault } from '../../data/kingdom';
import { EXTRA_DUNGEONS } from '../../data';
import { FACTION_IDS } from '../../data/kingdom';
import { FACTIONS } from '../../data/kingdom';
import { FINAL_GOD_IDS } from '../../data';
import { flushSync } from 'react-dom';
import { formatDefectionPenaltyLines } from '../../data/kingdom';
import { GANG_PRESETS } from '../../data/gang';
import { GENERAL_RARITY_CONFIG } from '../../data/generals';
import { GENERAL_ROSTER_FACTION_IDS } from '../../data/generals';
import { GENERAL_ROSTER_FACTIONS } from '../../data/generals';
import { generateGarrison } from '../../data/kingdom';
import { getActiveGuards } from '../../data/kingdom';
import { getActiveTreaty } from '../../data/kingdomPolitics';
import { getBattleTimeModifiers } from '../../data/kwSiege';
import { getBondingQuestsForMap } from '../../data';
import { getCapitalSiegeTargets } from '../../data/kingdom';
import { getContestMapProgress } from '../../data/kwSiege';
import { getDefectionStatus } from '../../data/kingdom';
import { getEcoCrisisByMapId } from '../../data';
import { getEcologyTier } from '../../data';
import { getFactionGeneralPower } from '../../data/kingdomPolitics';
import { getFactionPoliticalSummary } from '../../data/kingdomPolitics';
import { getFactionRelation } from '../../data/kingdomPolitics';
import { getFactionTerritoryCount } from '../../data/kingdom';
import { getFactionTerritoryStats } from '../../data/kingdom';
import { getGangSkillBonus } from '../../data/gang';
import { getGangSkills } from '../../data/gang';
import { getGarrisonTotal } from '../../data/kingdom';
import { getGeneralById } from '../../data/generals';
import { getGeneralInvitationPreview } from '../../data/kingdomPolitics';
import { getGeneralPortrait } from '../../data/generals';
import { getHistoricalBattlesByEra } from '../../data/historicalBattles';
import { getHistoricalFactionPoliticalSummaries } from '../../data/kingdomPolitics';
import { getMilitaryRank } from '../../data/kingdom';
import { getQunLordSummaries } from '../../data/kingdomPolitics';
import { getRegionStage } from '../../data';
import { getScoutAdjacentIntel } from '../../data/kingdom';
import { getSpiritDomainByMapId } from '../../data';
import { getTodayBoss } from '../../data';
import { getUnlockedRankPerks } from '../../data/kingdom';
import { HIGH_TIER_POOL } from '../../data';
import { HISTORICAL_BATTLE_ERAS } from '../../data/historicalBattles';
import { HISTORICAL_BATTLES } from '../../data/historicalBattles';
import { HISTORICAL_POLITICAL_FACTIONS } from '../../data/generals';
import { HYAKKI_DUNGEON } from '../../data';
import { initTerritories } from '../../data/kingdom';
import { inviteGeneralToFaction } from '../../data/kingdomPolitics';
import { isMapEcoRestored } from '../../data';
import { JIN_CAMPAIGNS } from '../../data/kingdomWar';
import { JJK_CHALLENGES } from '../../data';
import { KINGDOM_CAMPAIGNS } from '../../data/kingdom';
import { KW_EQUIPMENT } from '../../data';
import { KW_TROOP_IDS } from '../../data/kwSiege';
import { KW_TROOP_TYPES } from '../../data/kwSiege';
import { LEGENDARY_POOL } from '../../data';
import { MANPOWER_RESERVE_CAP } from '../../data/kwSiege';
import { MAPS } from '../../data';
import { MAX_RECRUITED_GENERALS } from '../../data/generals';
import { MILITARY_RANKS } from '../../data/kingdom';
import { MS_PER_DAY } from '../../data/constants';
import { NARUTO_STORY_CHAPTERS } from '../../data/naruto';
import { POKEDEX } from '../../data/pets';
import { POLITICAL_FACTIONS } from '../../data/kingdomPolitics';
import { RANK_PROMOTION_CHALLENGES } from '../../data/kingdom';
import { RECRUIT_CONFIG } from '../../data/kingdom';
import { REGION_CHAINS } from '../../data';
import { resetKingdomDailyCounts } from '../../data/kingdom';
import { runKwSiegeBattle } from '../../data/kwSiege';
import { runThreePhaseSiege } from '../../data/kwSiege';
import { SANGUO_GENERALS } from '../../data/generals';
import { SEASON_CONFIG } from '../../data/kingdom';
import { settleContestSiegeAttempt } from '../../data/kwSiege';
import { SIDE_STORY_LINES } from '../../data/constants';
import { SIEGE_CONFIG } from '../../data/kingdom';
import { PLAYABLE_STORY_SCRIPT as STORY_SCRIPT } from '../../data';
import { syncContestedTerritoryOwners } from '../../data/kwSiege';
import { TIGER_SEAL_ATTACK_MULT } from '../../data/kingdom';
import { TIME_PHASES } from '../../data';
import { TOKEN_SHOP } from '../../data/kingdom';
import { TYPES } from '../../data/types';
import { useRoyalDecree } from '../../data/kingdom';
import { useWarRally } from '../../data/kingdom';
import { validateSiegeDeployment } from '../../data/kwSiege';
import { WAR_MAP_IDS } from '../../data/kingdom';
import { WAR_TICK_CONFIG } from '../../data/kingdom';
import { WEATHERS } from '../../data';
import { WORLD_BOSS_REQ_BADGES } from '../../data';

export default function WorldMapScreen({
  activeSideStory,
  badges,
  battle,
  battleResultHandledRef,
  bondingProgress,
  buildRankStats,
  buildSiegeExternalBonuses,
  caughtDex,
  completedChallenges,
  completedSideStories,
  createUniqueEquip,
  currentMapId,
  dungeonCooldowns,
  dungeonEntryLockRef,
  ecoCrisisState,
  enterInfinityCastle,
  enterMap,
  formatGeneralBonusChip,
  fusionState,
  gang,
  genDexFilter,
  getLocalDateStr,
  getMapEcology,
  getRankPerkEffects,
  getStats,
  getTodayEcoEvent,
  gold,
  goldRef,
  handleKingdomRecruit,
  kingdomActionLocksRef,
  kingdomWar,
  kingdomWarRef,
  kwSiegeModal,
  kwTab,
  mainStoryProgress,
  mainStoryStep,
  mapGrid,
  mapTab,
  mapWeathers,
  narutoState,
  party,
  partyRef,
  renderAvatar,
  renderGeneralPortraitFace,
  setAccessories,
  setActiveSideStory,
  setBondingModal,
  setConfirmModal,
  setDungeonCooldowns,
  setGang,
  setGenDexDetail,
  setGenDexFilter,
  setGold,
  setKingdomWar,
  setKwSiegeModal,
  setKwTab,
  setMainStoryProgress,
  setMainStoryStep,
  setMapTab,
  setParty,
  setSideStoryStates,
  setStoryProgress,
  setStoryStep,
  setView,
  showMapToast,
  sideStoryStates,
  spiritDomainsCleared,
  startBattle,
  startEcoCrisis,
  startWorldBossFight,
  storyProgress,
  storyStep,
  timePhase,
  triggerEnemyKingdomActions,
  unlockTitle,
  updateAchStat,
  view
}) {
    // ... (原有的 enterDungeon 逻辑保持不变) ...
    // 副本冷却检查（每个副本3场战斗后需等5分钟冷却）
    const checkDungeonCooldown = (dungeonId) => {
      const cd = dungeonCooldowns[dungeonId];
      if (!cd) return true;
      if (cd.count >= 3) {
        const elapsed = Date.now() - cd.lastTime;
        if (elapsed < 5 * 60 * 1000) {
          const remMs = 5 * 60 * 1000 - elapsed;
          const remMin = Math.floor(remMs / 60000);
          const remSec = Math.ceil((remMs % 60000) / 1000);
          showMapToast('⏰', '副本冷却', `请等待 ${remMin > 0 ? remMin + '分' : ''}${remSec}秒`, 2000);
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
      if (!party || party.length === 0 || !party[0]) { showMapToast('❌', '提示', '⛔ 队伍中没有精灵！', 1500); return; }
      if (!party.some(p => p && p.currentHp > 0)) { showMapToast('❌', '提示', '⛔ 所有精灵都已晕厥！', 1500); return; }
      if (dungeon.tagRestriction) {
        const tagCheck = checkTagRestriction(party, dungeon.tagRestriction);
        if (!tagCheck.allowed) {
          showMapToast('⛔', '无法进入', tagCheck.reason || '队伍不符合副本要求', 2500);
          return;
        }
        if (tagCheck.rule?.hint) showMapToast('ℹ️', '副本提示', tagCheck.rule.hint, 2000);
      }
      // --- 狩猎地带 (最高门槛, 最好奖励) ---
      if (dungeon.id === 'safari_zone') {
        if (party[0].level < 85) { showMapToast('❌', '提示', '⛔ 首发精灵等级需达到 Lv.85', 1500); return; }
        if (badges.length < 10) { showMapToast('⛔', '权限不足', `徽章 ${badges.length}/10`, 1500); return; }
        if (!checkDungeonCooldown('safari_zone')) return;
        if (dungeonEntryLockRef.current) {
          showMapToast('⏳', '正在进入', '副本正在准备中', 1200);
          return;
        }
        dungeonEntryLockRef.current = true;
        let started = false;
        try {
          started = startBattle({ id: 997, name: '狩猎地带', lvl: [90, 100], pool: [], drop: 5000, dungeonId: 'safari_zone' }, 'safari');
        } catch (error) {
          dungeonEntryLockRef.current = false;
          console.error('safari dungeon start failed', error);
          showMapToast('❌', '进入失败', '狩猎地带初始化失败，请稍后重试', 1800);
          return;
        }
        if (started) {
          recordDungeonEntry('safari_zone');
          showMapToast('🎉', '狩猎地带', '传说中的神兽和稀有精灵等你来捕获！', 3000);
        } else {
          dungeonEntryLockRef.current = false;
          showMapToast('ℹ️', '未计入次数', '副本未能启动，请确认队伍状态后重试', 1800);
        }
        return;
      }

      // 基础门槛检查
      if (party[0].level < dungeon.recLvl) { showMapToast('⛔', '等级不足', `需要首发 Lv.${dungeon.recLvl}`, 1500); return; }

      // 徽章门槛
      const reqBadges = dungeon.reqBadges || { gold: 2, exp: 1, stone: 5, stat: 5, gold_pro: 6, shiny_hunt: 8, infinity: 10, hyakki: 10 }[dungeon.type] || 0;
      if (badges.length < reqBadges) { showMapToast('⛔', '徽章不足', `需要 ${reqBadges} 枚 · 当前 ${badges.length}`, 1500); return; }

      // 特殊限制
      if (dungeon.restriction === 'min_lvl_60') { if (party.some(p => p.level < 60)) { showMapToast('❌', '提示', '⛔ 队伍中所有精灵必须 ≥ Lv.60', 1500); return; } }
      if (dungeon.restriction === 'solo_run') { if (party.length > 1) { showMapToast('❌', '提示', '⛔ 英雄试炼只能携带 1 只精灵', 1500); return; } }
      if (dungeon.restriction === 'lucky_nature') { const lucky = ['naive', 'hasty', 'quirky', 'serious', 'hardy', 'jolly', 'timid', 'modest', 'adamant', 'bold']; if (!lucky.includes(party[0].nature)) { showMapToast('❌', '提示', '⛔ 首发精灵性格必须是幸运类(天真/急躁/浮躁/严肃/努力/开朗/胆小/内敛/固执/大胆)', 1500); return; } }

      if (dungeon.type === 'ragnarok' && party[0].level < 95) { showMapToast('❌', '提示', '⛔ 诸神黄昏要求首发精灵 Lv.95 以上！', 1500); return; }
      if (dungeon.type === 'double' && party.filter(p => p.currentHp > 0).length < 2) { showMapToast('⚠️', '提示', '双打擂台需要至少2只存活的精灵！', 1500); return; }

      if (!checkDungeonCooldown(dungeon.id)) return;

      if (dungeon.restriction === 'entry_fee') {
        const fee = 5000 + badges.length * 500;
        if (gold < fee) { showMapToast('💰', '金币不足', `需要 ${fee} 金币`, 1500); return; }
        setConfirmModal({ title:'🎫 入场确认', msg:`支付 ${fee} 金币入场？`, onOk: () => {
          if (dungeonEntryLockRef.current) return;
          if (goldRef.current < fee) {
            showMapToast('💰', '金币不足', `需要 ${fee} 金币`, 1500);
            return;
          }
          dungeonEntryLockRef.current = true;
          let started = false;
          try {
            started = _startDungeonAfterFee(dungeon);
          } catch (error) {
            dungeonEntryLockRef.current = false;
            console.error('paid dungeon start failed', error);
            showMapToast('❌', '进入失败', '副本初始化失败，未扣除入场费用', 1800);
            return;
          }
          if (!started) {
            dungeonEntryLockRef.current = false;
            showMapToast('ℹ️', '未扣除费用', '副本未能启动，请确认队伍状态后重试', 1800);
            return;
          }
          goldRef.current = Math.max(0, goldRef.current - fee);
          setGold(goldRef.current);
          updateAchStat({ totalGoldSpent: fee });
        }}); return;
      }

      if (dungeonEntryLockRef.current) {
        showMapToast('⏳', '正在进入', '副本正在准备中', 1200);
        return;
      }
      dungeonEntryLockRef.current = true;
      let started = false;
      try {
        started = _startDungeonAfterFee(dungeon);
      } catch (error) {
        dungeonEntryLockRef.current = false;
        console.error('dungeon start failed', error);
        showMapToast('❌', '进入失败', '副本初始化失败，请稍后重试', 1800);
        return;
      }
      if (!started || dungeon.type === 'infinity') {
        dungeonEntryLockRef.current = false;
      }
      if (!started) showMapToast('ℹ️', '未计入次数', '副本未能启动，请确认队伍状态后重试', 1800);
    };
    const _startDungeonAfterFee = (dungeon) => {
      let started = false;
      const startDungeonBattle = (context, type) => {
        const didStart = startBattle(context, type);
        if (didStart) recordDungeonEntry(dungeon.id);
        return didStart;
      };

      // --- 迷雾森林 (闪光遭遇) ---
      if (dungeon.type === 'mist_forest') {
        const mfLv = Math.max(15, Math.min(40, party[0].level));
        showMapToast('ℹ️', '提示', '🌫️ 迷雾森林！ 浓雾中隐约能看到闪闪发光的身影... （命中率略有下降，但闪光率大幅提升！）', 2000);
        started = startDungeonBattle({ id: 998, name: '迷雾森林', lvl: [mfLv - 5, mfLv + 5], pool: [25, 37, 43, 92, 127, 133, 147], drop: 300, dungeonId: 'mist_forest' }, 'dungeon_shiny');
      }
      // --- 竞速挑战 ---
      else if (dungeon.type === 'speed_run') {
        const srLv = Math.max(20, Math.min(50, party[0].level));
        showMapToast('✅', '提示', '⚡ 竞速挑战！ 3回合内击败敌人可获得额外速度增强剂奖励！', 2000);
        started = startDungeonBattle({ id: 997, name: '竞速挑战', lvl: [srLv - 3, srLv + 3], pool: [26, 58, 78, 85, 135, 162], drop: 500, dungeonId: 'speed_run' }, 'dungeon_stat');
      }
      // --- 野外求生 (3波连战) ---
      else if (dungeon.type === 'wild_survival') {
        const wsLv = Math.max(25, Math.min(55, party[0].level));
        showMapToast('✅', '提示', '🏕️ 野外求生！ 连续3波战斗，HP在波次间不回复！ 挺过去就能获得大量补给品！', 2000);
        started = startDungeonBattle({ id: 992, name: '野外求生 第1波', lvl: [wsLv - 5, wsLv], pool: [1,4,7,10,25,43,66,92], drop: 800, bossRushWave: 1, rushName: '野外求生', dungeonId: 'wild_survival' }, 'boss_rush');
      }
      // --- 回忆试炼 (镜像挑战) ---
      else if (dungeon.type === 'memory_trial') {
        const mtLv = Math.max(30, Math.min(60, party[0].level));
        const mirrorPool = party.slice(0, 3).map(p => p.id);
        showMapToast('👥', '队伍', '🪞 回忆试炼！ 你将面对自己队伍的镜像！ 了解自己的弱点才能变得更强！', 1500);
        started = startDungeonBattle({ id: 991, name: '回忆试炼', lvl: [mtLv - 2, mtLv + 2], pool: mirrorPool.length > 0 ? mirrorPool : [1,4,7], drop: 800, dungeonId: 'memory_trial' }, 'type_challenge');
      }
      // --- 属性轮盘 ---
      else if (dungeon.type === 'type_roulette') {
        const types = ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'PSYCHIC', 'DARK', 'FIGHT', 'DRAGON', 'ICE', 'GHOST', 'COSMIC', 'SOUND', 'TIME', 'CHAOS'];
        const chosenTypes = _.sampleSize(types, 3);
        const typeNames = { FIRE:'火', WATER:'水', GRASS:'草', ELECTRIC:'电', PSYCHIC:'超能', DARK:'暗', FIGHT:'格斗', DRAGON:'龙', ICE:'冰', GHOST:'幽灵', COSMIC:'宇宙', SOUND:'音波', TIME:'时空', CHAOS:'混沌' };
        const typePools = { FIRE:[11,12,13,14,15], WATER:[22,24,26,28,30], GRASS:[1,2,3,4,41], ELECTRIC:[34,85,87,88,89], PSYCHIC:[63,64,65,100,101], DARK:[54,55,56,59,90], FIGHT:[62,66,68,106,214], DRAGON:[182,183,196,208,447], ICE:[86,87,124,144,215], GHOST:[92,93,94,200,292], COSMIC:[832,838,888,789,790], SOUND:[837,866,867,868,818], TIME:[801,804,806,807,809], CHAOS:[811,814,816,819,840] };
        const allPool = chosenTypes.flatMap(t => typePools[t] || [1,2,3]);
        const trLv = Math.max(55, Math.min(85, party[0].level));
        showMapToast('🎰', '属性轮盘', `今日：${chosenTypes.map(t => typeNames[t]).join('+')}`, 2500);
        started = startDungeonBattle({ id: 989, name: '属性轮盘', lvl: [trLv - 5, trLv + 5], pool: allPool, drop: 2000, dungeonId: 'type_roulette', challengeType: _.sample(chosenTypes) }, 'type_challenge');
      }
      // --- 诸神黄昏 (三波神兽军团) ---
      else if (dungeon.type === 'ragnarok') {
        showMapToast('ℹ️', '提示', '⚔️ 诸神黄昏！ 三波神兽军团即将降临！ 第一波：传说精灵 第二波：新世代神兽 第三波：创世之神 准备好迎接终极考验了吗？', 2000);
        started = startDungeonBattle({ id: 985, name: '诸神黄昏 第1波', lvl: [95, 100], pool: [...LEGENDARY_POOL.slice(0, 30)], drop: 5000, bossRushWave: 1, rushName: '诸神黄昏', dungeonId: 'ragnarok' }, 'boss_rush');
      }
      // --- 元素之塔 (中门槛, 进化石) ---
      else if (dungeon.type === 'stone') {
        const stLv = Math.max(55, Math.min(90, party[0].level - 5));
        started = startDungeonBattle({ id: 996, name: '元素之塔', lvl: [stLv, stLv + 10], pool: [126, 127, 128, 129, 130, 196, 197], drop: 500 + stLv * 5, dungeonId: 'stone_tower' }, 'dungeon_stone');
      }
      // --- 英雄试炼 (单挑, 增强剂) ---
      else if (dungeon.type === 'stat') {
        const htLv = Math.max(60, Math.min(95, party[0].level));
        started = startDungeonBattle({ id: 995, name: '英雄试炼', lvl: [htLv - 5, htLv + 5], pool: [63, 106, 138, 183, 214, 270], drop: 500 + htLv * 5, dungeonId: 'hero_trial' }, 'dungeon_stat');
      }
      // --- 闪光山谷 (高门槛, 高闪光率) ---
      else if (dungeon.type === 'shiny_hunt') {
        const shLv = Math.max(80, Math.min(98, party[0].level));
        started = startDungeonBattle({ id: 993, name: '闪光山谷', lvl: [shLv - 5, shLv + 5], pool: [147, 148, 151, 244, 299], drop: 1000 + (shLv - 80) * 50, dungeonId: 'shiny_valley' }, 'dungeon_shiny');
      }
      // --- 无限城 (终局内容) ---
      else if (dungeon.type === 'infinity') {
        if (party[0].level >= 80) { enterInfinityCastle('normal'); started = true; }
        else if (party[0].level >= 40) { enterInfinityCastle('shallow'); started = true; }
        else { showMapToast('⚠️','等级不足','浅层模式需首发Lv.40+',2000); }
      }
      // --- 百鬼夜行 (多波连战) ---
      else if (dungeon.type === 'hyakki') {
        if (party[0].level < 80) { showMapToast('❌', '提示', '⛔ 等级不足！ 百鬼夜行要求首发精灵 Lv.80 以上。', 1500); return; }
        showMapToast('ℹ️', '提示', '👹 百鬼夜行开始！ 强大的咒灵将向你袭来！', 2000);
        const hyLv = Math.max(75, Math.min(98, party[0].level - 2));
        started = startDungeonBattle({ id: 998, name: '百鬼夜行', lvl: [hyLv - 5, hyLv + 5], pool: [92, 93, 94, 130, 144, 146], drop: 3000 + (hyLv - 75) * 100, dungeonId: 'hyakki_yako' }, 'boss');
      }
      // --- 连战Boss塔 ---
      else if (dungeon.type === 'boss_rush') {
        const bossPool = [65, 94, 130, 138, 140, 150, 182, 199, 206];
        const bossLvl = Math.max(40, Math.min(party[0].level + 5, 95));
        showMapToast('🗼', dungeon.name, '连续 3 首领', 2500);
        started = startDungeonBattle({ id: 992, name: `${dungeon.name} 第1层`, lvl: [bossLvl - 5, bossLvl], pool: bossPool, drop: 1500, bossRushWave: 1, rushName: dungeon.name, dungeonId: dungeon.id }, 'boss_rush');
      }
      // --- 属性试炼场 ---
      else if (dungeon.type === 'type_challenge') {
        const types = ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'PSYCHIC', 'DARK', 'FIGHT', 'DRAGON', 'ICE', 'GHOST', 'COSMIC', 'SOUND', 'TIME', 'CHAOS'];
        const chosenType = _.sample(types);
        const typeNames = { FIRE:'火', WATER:'水', GRASS:'草', ELECTRIC:'电', PSYCHIC:'超能', DARK:'暗', FIGHT:'格斗', DRAGON:'龙', ICE:'冰', GHOST:'幽灵', COSMIC:'宇宙', SOUND:'音波', TIME:'时空', CHAOS:'混沌' };
        const typePools = { FIRE:[11,12,13,14,15], WATER:[22,24,26,28,30], GRASS:[1,2,3,4,41], ELECTRIC:[34,85,87,88,89], PSYCHIC:[63,64,65,100,101], DARK:[54,55,56,59,90], FIGHT:[62,66,68,106,214], DRAGON:[182,183,196,208,447], ICE:[86,87,124,144,215], GHOST:[92,93,94,200,292], COSMIC:[832,838,888,789,790], SOUND:[837,866,867,868,818], TIME:[801,804,806,807,809], CHAOS:[811,814,816,819,840] };
        showMapToast('🎯', '属性试炼', `今日：${typeNames[chosenType]} 系`, 2500);
        const tcLvl = Math.max(30, Math.min(party[0].level, 90));
        started = startDungeonBattle({ id: 991, name: `${typeNames[chosenType]}系试炼`, lvl: [tcLvl - 5, tcLvl + 5], pool: typePools[chosenType] || [1,2,3], drop: 1500, challengeType: chosenType, dungeonId: dungeon.id }, 'type_challenge');
      }
      // --- 生存竞技场 ---
      else if (dungeon.type === 'survival') {
        const survLvl = Math.min(party[0].level + 10, 100);
        showMapToast('ℹ️', '提示', '🏟️ 生存竞技场！ 敌人将不断变强，坚持越久奖励越好！ 每击败一只，下一只等级+3！', 2000);
        started = startDungeonBattle({ id: 990, name: '生存竞技场', lvl: [survLvl - 10, survLvl], pool: [...HIGH_TIER_POOL], drop: 500, survivalWave: 1, dungeonId: dungeon.id }, 'survival');
      }
      // --- 逆位空间 ---
      else if (dungeon.type === 'reverse') {
        const revLvl = Math.min(party[0].level + 5, 100);
        showMapToast('ℹ️', '提示', '🔄 逆位空间！ 这里的属性克制完全反转！ 原本克制的属性变为被克制，请重新思考你的策略！', 2000);
        started = startDungeonBattle({ id: 989, name: '逆位空间', lvl: [revLvl - 8, revLvl], pool: [...HIGH_TIER_POOL, ...LEGENDARY_POOL.slice(0, 20)], drop: 5000, isReversed: true, dungeonId: 'reverse_world' }, 'wild');
      }
      // --- 双打擂台 ---
      else if (dungeon.type === 'elite_rotation') {
        const dayIdx = Math.floor(Date.now() / MS_PER_DAY) % 5;
        const rotationThemes = [
          { name: '炎之试炼', type: 'FIRE', pool: [...HIGH_TIER_POOL], bonus: '火系强敌' },
          { name: '冰雪行军', type: 'ICE', pool: [...HIGH_TIER_POOL], bonus: '冰系强敌' },
          { name: '龙之巅峰', type: 'DRAGON', pool: [...LEGENDARY_POOL], bonus: '龙系传说' },
          { name: '暗影深渊', type: 'DARK', pool: [...HIGH_TIER_POOL], bonus: '暗系精锐' },
          { name: '钢铁堡垒', type: 'STEEL', pool: [...HIGH_TIER_POOL], bonus: '钢系防线' },
        ];
        const theme = rotationThemes[dayIdx];
        const elLvl = Math.min(party[0].level + 3, 95);
        showMapToast('🔥', theme.name, `今日轮换: ${theme.bonus}`, 2000);
        started = startDungeonBattle({ id: 985, name: theme.name, lvl: [elLvl - 5, elLvl], pool: theme.pool, drop: 6000, bossRushWave: 1, rushName: theme.name, dungeonId: 'elite_rotation' }, 'boss_rush');
      }
      else if (dungeon.type === 'double') {
        const dbLvl = Math.min(party[0].level + 5, 95);
        showMapToast('👥', '队伍', '⚔️ 双打擂台！ 2v2 双打模式！ 你将派出2只精灵同时战斗！', 1500);
        started = startDungeonBattle({ id: 988, name: '双打擂台', lvl: [dbLvl - 5, dbLvl], pool: [...HIGH_TIER_POOL], drop: 3000, isDouble: true, dungeonId: 'double_arena' }, 'wild_double');
      }
      // --- 极限试炼 ---
      else if (dungeon.type === 'extreme') {
        showMapToast('ℹ️', '提示', '☠️ 极限试炼！ 连续击败强敌，每波都更强！ 坚持越久奖励越丰厚！', 2000);
        started = startDungeonBattle({ id: 987, name: '极限试炼 第1波', lvl: [95, 100], pool: [...LEGENDARY_POOL, ...FINAL_GOD_IDS], drop: 5000, survivalWave: 1, isExtreme: true, dungeonId: 'extreme_trial' }, 'survival');
      }
      // --- 宝藏迷宫 ---
      else if (dungeon.type === 'treasure') {
        const mazeLvl = Math.min(party[0].level + 5, 100);
        showMapToast('🗝️', '提示', '🗝️ 宝藏迷宫！ 每层随机宝箱+守卫！ 越深层越有好东西，但也越危险！', 1500);
        started = startDungeonBattle({ id: 986, name: '宝藏迷宫 第1层', lvl: [mazeLvl - 10, mazeLvl], pool: [...HIGH_TIER_POOL], drop: 4000, bossRushWave: 1, rushName: '宝藏迷宫', dungeonId: 'treasure_maze' }, 'boss_rush');
      }
      return started;
    };

    const timeInfo = TIME_PHASES[timePhase];
    const worldMapTabs = [
      { id: 'maps', icon: '🗺️', label: '区域探索', hint: '地图与道馆', color: '#2f6df6' },
      { id: 'dungeons', icon: '⚔️', label: '秘境探险', hint: '副本奖励', color: '#7c3aed' },
      { id: 'challenges', icon: '🔥', label: '图鉴试炼塔', hint: '收集挑战', color: '#ef4444' },
      { id: 'kingdom', icon: '🏴', label: '国战', hint: '势力与领地', color: '#B71C1C' },
      { id: 'sects', icon: '🏔️', label: '门派顶峰', hint: '修行挑战', color: '#14b8a6' },
      { id: 'housing', icon: '🏡', label: '精灵家园', hint: '生活系统', color: '#a78bfa' },
    ];
    const clearedMapCount = MAPS.filter(m => badges.includes(m.badge)).length;
    const alivePartyCount = party.filter(p => p && p.currentHp > 0).length;
    const leadLevel = party[0]?.level || 1;

    return (
      <div className="screen map-screen world-map-screen-redesign" style={{minHeight:'100vh', overflow:'auto'}}>
        {/* 顶部导航 */}
        <div className="nav-header world-map-topbar">
          <button className="btn-back world-map-back-btn" onClick={() => setView(mapGrid.length > 0 ? 'grid_map' : 'menu')}>← {mapGrid.length > 0 ? '返回当前地图' : '返回首页'}</button>
          <div className="world-map-title-lockup">
            <span>SUPER SPIRIT WORLD</span>
            <strong>冒险地图</strong>
          </div>
          <div className="nav-coin world-map-coin">💰 {gold.toLocaleString()}</div>
        </div>
        
        {/* 顶部信息栏 */}
        <section className="world-map-hero world-map-info-bar">
          <div className="world-map-hero-main">
            <div className="world-map-time-orb">{timeInfo.icon}</div>
            <div>
              <span className="world-map-eyebrow">World time · {timeInfo.name}</span>
              <h1>选择下一段精灵冒险</h1>
              <p>{timePhase === 'DAY' ? '阳光明媚，适合推进道馆和捕捉新伙伴。' : (timePhase === 'DUSK' ? '天色渐晚，适合挑战秘境并补足队伍状态。' : '深夜是幽灵活跃的时刻，带上克制属性再出发。')}</p>
            </div>
          </div>
          <div className="world-map-hero-stats" aria-label="冒险概览">
            <div><strong>{badges.length}</strong><span>徽章</span></div>
            <div><strong>{clearedMapCount}/{MAPS.filter(m => m.badge).length}</strong><span>道馆通关</span></div>
            <div><strong>Lv.{leadLevel}</strong><span>首发</span></div>
            <div><strong>{alivePartyCount}/{party.length || 0}</strong><span>存活</span></div>
          </div>
        </section>

        <div className="world-map-content">
          {/* 导航胶囊 */}
          <div className="map-nav-container world-map-nav">
            <div className="world-map-tab-shell">
              {worldMapTabs.map(tab => {
                const isActive = mapTab === tab.id || (tab.id === 'sects' && view === 'sect_summit');
                return (
                  <button key={tab.id} onClick={() => { if (tab.id === 'sects') setView('sect_summit'); else if (tab.id === 'housing') setView('housing'); else { setMapTab(tab.id); if (view === 'sect_summit') setView('world_map'); } }}
                    className={isActive ? 'world-map-tab-btn is-active' : 'world-map-tab-btn'}
                    style={{ '--tab-color': tab.color }}>
                    <span className="world-map-tab-icon">{tab.icon}</span>
                    <span>
                      <strong>{tab.label}</strong>
                      <small>{tab.hint}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        {/* 支线剧情选择 */}
        {mapTab === 'maps' && (() => {
          const availableLines = SIDE_STORY_LINES.filter(l => badges.length >= l.unlockBadges);
          if (availableLines.length === 0) return null;

          const implementedLines = SIDE_STORY_LINES.filter(line => !line.isNarutoArc);
          const allDone = implementedLines.every(line => completedSideStories.has(line.id));
          const hasActive = activeSideStory !== null;
          const activeLine = hasActive ? SIDE_STORY_LINES.find(l => l.id === activeSideStory) : null;
          const activeChIdx = hasActive && activeLine ? storyProgress - activeLine.startIdx + 1 : 0;

          return (
            <div className="world-story-section">
              <div style={{fontSize:'14px', fontWeight:'700', color:'#6366f1', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span style={{fontSize:'18px'}}>📜</span>
                {allDone ? '全部支线已通关！' : hasActive && activeLine ? (
                  <span style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    {`进行中：${activeLine.icon} ${activeLine.name}（${activeChIdx}/${activeLine.chapters}）`}
                    <button type="button" onClick={() => {
                      setSideStoryStates(prev => ({...prev, [activeSideStory]: { progress: storyProgress, step: storyStep }}));
                      setStoryProgress(mainStoryProgress);
                      setStoryStep(mainStoryStep);
                      setActiveSideStory(null);
                    }} style={{fontSize:'11px', padding:'3px 10px', background:'rgba(239,68,68,0.12)', color:'#ef4444', borderRadius:'8px', cursor:'pointer', fontWeight:'600'}}>
                      返回主线
                    </button>
                  </span>
                ) : '支线剧情'}
              </div>
              {!hasActive && (
                <div className="world-story-grid">
                  {availableLines.map(line => {
                    const done = completedSideStories.has(line.id);
                    const hasSave = sideStoryStates[line.id];
                    const isNotReady = false;
                    return (
                      <button type="button" className="world-story-card" key={line.id} disabled={done || isNotReady}
                        onClick={() => {
                          if (done) return;
                          if (isNotReady) return;
                          if (line.isNarutoArc) { setView('naruto_story'); return; }
                          setMainStoryProgress(storyProgress);
                          setMainStoryStep(storyStep);
                          setActiveSideStory(line.id);
                          if (hasSave) {
                            setStoryProgress(hasSave.progress);
                            setStoryStep(hasSave.step);
                            showMapToast(line.icon || '📜', line.name, `前往 ${MAPS.find(m => m.id === STORY_SCRIPT[hasSave.progress]?.mapId)?.name || '目标地图'}`, 3000);
                          } else {
                            setStoryProgress(line.startIdx);
                            setStoryStep(0);
                            const firstChapter = STORY_SCRIPT[line.startIdx];
                            if (firstChapter) {
                              showMapToast(line.icon || '📜', line.name, `前往 ${MAPS.find(m => m.id === firstChapter.mapId)?.name || '目标地图'}`, 3000);
                            }
                          }
                        }}
                        style={{
                          padding:'14px', borderRadius:'12px', cursor: done ? 'default' : 'pointer',
                          background: done ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.85)',
                          border: done ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(139,92,246,0.3)',
                          opacity: done ? 0.6 : 1,
                          transition: 'all 0.2s', boxShadow: done ? 'none' : '0 2px 8px rgba(139,92,246,0.1)',
                        }}
                        onMouseOver={e => { if (!done) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.2)'; }}}
                        onMouseOut={e => { if (!done) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,92,246,0.1)'; }}}
                      >
                        <div style={{fontSize:'24px', marginBottom:'6px'}}>{done ? '✅' : hasSave ? '▶️' : line.icon}</div>
                        <div style={{fontSize:'13px', fontWeight:'700', color: done ? '#999' : '#1e293b'}}>{line.name}</div>
                        <div style={{fontSize:'11px', color: done ? '#bbb' : '#64748b', marginTop:'2px'}}>
                          {done ? '已通关' : isNotReady ? '尚未开放' : line.isNarutoArc ? `${NARUTO_STORY_CHAPTERS.filter(ch => (narutoState?.storyProgress || {})[ch.id]?.cleared).length}/${NARUTO_STORY_CHAPTERS.length}章` : hasSave ? `继续 · 第${hasSave.progress - line.startIdx + 1}/${line.chapters}章` : `${line.chapters}章 · ${line.desc}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* 火影忍者剧情 */}
        {mapTab === 'maps' && badges.length >= 3 && (() => {
          const cleared = NARUTO_STORY_CHAPTERS.filter(ch => (narutoState?.storyProgress || {})[ch.id]?.cleared).length;
          const total = NARUTO_STORY_CHAPTERS.length;
          const hasNew = NARUTO_STORY_CHAPTERS.some(ch => badges.length >= ch.badgeReq && !(narutoState?.storyProgress || {})[ch.id]?.cleared);
          return (
            <div className="world-naruto-journey">
              <div style={{fontSize:'14px', fontWeight:'700', color:'#FF6F00', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span style={{fontSize:'18px'}}>🍥</span>
                {cleared >= total ? '忍界传说 · 全章通关！' : `忍界传说 · 火影主线剧情 (${cleared}/${total})`}
                {hasNew && <span style={{fontSize:'9px', padding:'2px 6px', background:'#FF5722', color:'#fff', borderRadius:'8px', fontWeight:'bold'}}>NEW</span>}
              </div>
              <button onClick={() => setView('naruto_story')} style={{
                padding:'12px 24px', borderRadius:'12px', border:'none', cursor:'pointer',
                background:'linear-gradient(135deg, #E65100, #FF6F00)', color:'#fff',
                fontSize:'13px', fontWeight:'700', boxShadow:'0 2px 8px rgba(255,111,0,0.3)',
                transition:'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(255,111,0,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 8px rgba(255,111,0,0.3)'; }}
              >📜 进入忍界传说</button>
            </div>
          );
        })()}

        {/* 地图网格 */}
        <div className="map-grid-container world-map-grid" style={{display: mapTab==='maps'?'grid':'none'}}>
          {MAPS.map((m, index) => {
            const isCleared = badges.includes(m.badge);
            const mapWeatherKey = mapWeathers[m.id] || 'CLEAR';
            const mapWeatherInfo = WEATHERS[mapWeatherKey];
            
            let isLocked = false;
            let lockReason = "";
            
            // 都城地图：本国直接开放，敌方需攻城战胜利
            if (m.isCapital) {
              if (!kingdomWar.faction) { isLocked = true; lockReason = '需加入国战阵营后开放'; }
              else if (m.capitalFaction !== kingdomWar.faction) {
                const hasSiegeWin = (Array.isArray(kingdomWar.capitalSiegeWins) ? kingdomWar.capitalSiegeWins : []).some(w => w.target === m.capitalFaction && w.season === kingdomWar.season);
                if (!hasSiegeWin) { isLocked = true; lockReason = `需在国战·都城中发起攻城战并胜利`; }
              }
            }
            // 中立争夺城池：加入任意阵营即可探索
            else if (m.isContested) {
              if (!kingdomWar.faction) { isLocked = true; lockReason = '需加入国战阵营后开放'; }
            }
            else if (m.id === 99) {
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
            } else if (m.unlockBadges) {
              if (badges.length < m.unlockBadges) { isLocked = true; lockReason = `需收集 ${m.unlockBadges} 枚徽章 (当前${badges.length}枚)`; }
            } else if (index > 0) {
              const prevMap = MAPS[index - 1];
              if (m.id === 9 && !completedChallenges.includes('ECLIPSE_HQ_CLEARED')) { isLocked = true; lockReason = "需摧毁【日蚀要塞】"; }
              else if (!badges.includes(prevMap.badge)) { isLocked = true; lockReason = `需通关【${prevMap.name}】`; }
            }

            const themeClass = `theme-bg-${m.type}`;
            const isContestedActive = m.isContested;
            const contestOwner = isContestedActive ? kingdomWar.territories?.[m.id]?.owner : null;
            const lvLo = m.lvl?.[0] ?? 1;
            const lvHi = m.lvl?.[1] ?? lvLo;
            const diffAvg = (lvLo + lvHi) / 2;
            const diffTier = diffAvg < 25 ? 0 : diffAvg < 45 ? 1 : diffAvg < 70 ? 2 : 3;
            const pLv = party[0]?.level || 1;
            const mapMid = (lvLo + lvHi) / 2;
            const diff = pLv - mapMid;
            const diffColor = diff < -15 ? '#ef4444' : diff < -5 ? '#f59e0b' : diff < 10 ? '#22c55e' : '#60a5fa';
            const diffLabel = diff < -15 ? '危险' : diff < -5 ? '挑战' : diff < 10 ? '适中' : '轻松';
            const caughtInMap = m.pool?.length ? m.pool.filter(pid => caughtDex.includes(pid)).length : 0;
            const mapDexTotal = m.pool?.length || 0;
            const mapDexPct = mapDexTotal ? Math.round(caughtInMap / mapDexTotal * 100) : 0;
            const mapDexColor = mapDexPct >= 100 ? '#ffd54f' : mapDexPct >= 50 ? '#22c55e' : '#8fd8ff';

            return (
              <article key={m.id} className={`map-card-pro world-region-card ${themeClass} difficulty-${diffTier}`} style={{
                ...(isLocked ? {filter:'brightness(0.8) saturate(0.7)', cursor:'not-allowed'} : undefined),
                ...(isContestedActive && !isLocked ? { border: '1px solid rgba(255,200,0,0.3)'} : {}),
              }} role="button" tabIndex={0} aria-label={`${isLocked ? '查看解锁条件' : '进入'}：${m.name}`}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.currentTarget.click();
                  }
                }}
                onClick={() => { if (isLocked) showMapToast('🔒', '区域锁定', lockReason, 2000); else enterMap(m.id); }}>
                {isContestedActive && !isLocked && (
                  <div style={{position:'absolute', inset:0, borderRadius:'inherit', overflow:'hidden', pointerEvents:'none', zIndex:1}}>
                    <div style={{position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, transparent, rgba(255,200,0,0.6), transparent)', animation:'warFlash 2s ease-in-out infinite'}} />
                  </div>
                )}
                {isLocked && (
                  <div className="map-lock-mask">
                    <span style={{fontSize:'14px'}}>🔒</span>
                    <span>{lockReason}</span>
                  </div>
                )}
                
                <div className="world-region-card__top">
                  <div className="world-region-card__identity">
                    <span className="world-region-card__icon">{m.icon}</span>
                    <div>
                      <h2>{m.name}</h2>
                      <p>{m.isCapital ? '阵营都城' : m.isContested ? '国战争夺区' : '道馆区域'}</p>
                    </div>
                  </div>
                  <div className="world-region-card__status">
                      {isCleared && (
                        <div className="world-region-badge is-clear">
                          ✓ CLEAR
                        </div>
                      )}
                      {(WAR_MAP_IDS.includes(m.id) || m.isCapital) && (() => {
                        const t = kingdomWar.territories?.[m.id];
                        if (!t && !m.isCapital) return null;
                        const owner = m.isCapital ? m.capitalFaction : t?.owner;
                        const ownerF = FACTIONS[owner];
                        const isMine = kingdomWar.faction && owner === kingdomWar.faction;
                        const isNeutral = owner === 'neutral';
                        const isContested = m.isContested && !isNeutral;
                        return (
                          <div className="world-region-badge is-owner" style={{ '--owner-color': isNeutral ? '#78909c' : ownerF?.color || '#666', animation: isContested ? 'pulse 2s infinite' : 'none' }}>
                            {(t?.contested || m.isContested) && <span style={{animation:'pulse 1.5s infinite'}}>⚔️</span>}
                            {isNeutral ? '中立' : `${ownerF?.icon || ''} ${ownerF?.name || ''}`}
                            {isMine && ' ✅'}
                          </div>
                        );
                      })()}
                  </div>
                </div>

                <div className="world-region-card__metrics">
                  <span style={{ '--metric-color': diffColor }}>Lv.{lvLo}-{lvHi} · {diffLabel}</span>
                  <span>{mapWeatherInfo.icon} {mapWeatherInfo.name}</span>
                  {mapDexTotal > 0 && <span style={{ '--metric-color': mapDexColor }}>📖 {caughtInMap}/{mapDexTotal}</span>}
                  {(() => {
                    const eco = getMapEcology(m.id);
                    const tier = getEcologyTier(eco);
                    const rStage = getRegionStage(m.id, eco, ecoCrisisState.cleared || [], badges.length);
                    const chainAlerts = REGION_CHAINS.filter(chain => {
                      if (chain.toMap !== m.id && !chain.global) return false;
                      const fromEco = getMapEcology(chain.fromMap);
                      return Object.entries(chain.condition || {}).every(([k, cond]) => {
                        const val = fromEco[k] ?? 50;
                        if (cond.min != null) return val >= cond.min;
                        if (cond.max != null) return val <= cond.max;
                        return true;
                      });
                    });
                    return (
                      <>
                        <span style={{ '--metric-color': tier.color, fontSize:'10px' }}>🌿 {tier.label}</span>
                        <span style={{ '--metric-color': '#7B1FA2', fontSize:'10px' }} title={rStage.desc}>{rStage.icon} 阶段{rStage.stage}</span>
                        {chainAlerts.slice(0, 1).map((chain, ci) => (
                          <span key={ci} style={{ '--metric-color': '#E65100', fontSize:'10px' }} title={chain.label}>🔗 连锁</span>
                        ))}
                      </>
                    );
                  })()}
                </div>

                {mapDexTotal > 0 && (
                  <div className="world-region-card__progress" aria-label={`图鉴进度 ${mapDexPct}%`}>
                    <span style={{ width: `${mapDexPct}%`, background: mapDexColor }} />
                  </div>
                )}

                {(() => {
                  const crisis = getEcoCrisisByMapId(m.id, ecoCrisisState.cleared || [], badges.length);
                  const mapEcoRestored = isMapEcoRestored(m.id, ecoCrisisState.cleared || []);
                  const todayBoss = getTodayBoss(getLocalDateStr());
                  const bossHere = todayBoss?.spawnMapId === m.id && badges.length >= WORLD_BOSS_REQ_BADGES && !isLocked;
                  const domain = getSpiritDomainByMapId(m.id);
                  const domainOpen = domain && badges.length >= domain.reqBadges && !spiritDomainsCleared.includes(domain.id);
                  const ecoEvt = !isLocked ? getTodayEcoEvent(m.id) : null;
                  if (!crisis && !bossHere && !domainOpen && !mapEcoRestored && !ecoEvt) return null;
                  return (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'8px', position:'relative', zIndex:3 }} onClick={e => e.stopPropagation()}>
                      {ecoEvt && (
                        <span style={{ fontSize:'12px', padding:'5px 10px', borderRadius:'8px', background: (ecoEvt.color || '#2E7D32') + '33', color: ecoEvt.color || '#2E7D32', fontWeight:'700' }} title={ecoEvt.summary}>{ecoEvt.icon} {ecoEvt.name}</span>
                      )}
                      {crisis && !isLocked && badges.length >= crisis.reqBadges && (
                        <button type="button" onClick={() => startEcoCrisis(crisis.id)} style={{ fontSize:'12px', fontWeight:'700', padding:'5px 12px', borderRadius:'10px', border:'none', cursor:'pointer', background: crisis.color || '#2E7D32', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
                          {crisis.icon} 调查·{crisis.name}
                        </button>
                      )}
                      {mapEcoRestored && (
                        <span style={{ fontSize:'12px', padding:'5px 10px', borderRadius:'8px', background:'rgba(76,175,80,0.15)', color:'#2E7D32', fontWeight:'700' }}>✅ 生态已恢复</span>
                      )}
                      {bossHere && (
                        <button type="button" onClick={() => { enterMap(m.id); setTimeout(() => startWorldBossFight(), 400); }} style={{ fontSize:'12px', fontWeight:'700', padding:'5px 12px', borderRadius:'10px', border:'none', cursor:'pointer', background:'linear-gradient(90deg,#B71C1C,#880E4F)', color:'#fff' }}>
                          {todayBoss.emoji} 异象·{todayBoss.name}
                        </button>
                      )}
                      {domainOpen && (
                        <span style={{ fontSize:'12px', padding:'5px 10px', borderRadius:'8px', background:'rgba(129,199,132,0.2)', color:'#1B5E20', fontWeight:'700' }}>{domain.icon} 道馆可挑战灵域试炼</span>
                      )}
                      {getBondingQuestsForMap(m.id, badges.length, Object.keys(bondingProgress).filter(k => bondingProgress[k]?.completed), getMapEcology(m.id), fusionState.crisisUnlocks || []).slice(0, 1).map(q => (
                        <button key={q.id} type="button" onClick={() => setBondingModal(q)} style={{ fontSize:'12px', fontWeight:'700', padding:'5px 12px', borderRadius:'10px', border:'none', cursor:'pointer', background:'#7B1FA2', color:'#fff' }}>
                          {q.icon} 结契·{q.name}
                        </button>
                      ))}
                    </div>
                  );
                })()}
                
                <div className="world-region-card__footer">
                  <div>
                    <span className="world-region-card__boss-icon">{m.isCapital ? '🐲' : m.isContested ? '⚔️' : '👑'}</span>
                    <strong>
                      {m.isCapital ? `君主 · ${m.lordName || '待揭晓'}` : m.isContested ? `守将 · ${(() => { const t = kingdomWar.territories?.[m.id]; return t && t.owner !== 'neutral' ? FACTIONS[t.owner]?.name + '军' : '无'; })()}` : `馆主 · ${m.gymName || '待揭晓'}`}
                    </strong>
                  </div>
                  <em>{m.isCapital ? (m.lordTitle || '称号待揭晓') : m.isContested ? `Lv.${m.lvl?.[0] || '?'}-${m.lvl?.[1] || '?'}` : `Lv.${m.gymLvl || m.lvl?.[1] || '?'}`}</em>
                </div>

                {/* 装饰性背景图标 */}
                <div className="world-region-card__watermark">{m.icon}</div>
              </article>
            );
          })}
        </div>

        {/* --- 秘境探险 --- */}
        <div className="world-dungeons" style={{display: mapTab==='dungeons'?'block':'none', padding:'0 4px', paddingBottom:'40px'}}>
          {[
            { tier: 1, title: '初阶秘境', subtitle: '适合刚起步的训练师', gradient: 'linear-gradient(135deg, #43A047, #66BB6A)', icon: '🌿' },
            { tier: 2, title: '进阶秘境', subtitle: '实力经受考验的舞台', gradient: 'linear-gradient(135deg, #1976D2, #42A5F5)', icon: '⚔️' },
            { tier: 3, title: '精英秘境', subtitle: '只有精英训练师才能涉足', gradient: 'linear-gradient(135deg, #7B1FA2, #AB47BC)', icon: '💎' },
            { tier: 4, title: '终极秘境', subtitle: '传说中的终极挑战', gradient: 'linear-gradient(135deg, #E65100, #FF8F00)', icon: '👑' },
          ].map(tierGroup => {
            const tierDungeons = [...DUNGEONS, HYAKKI_DUNGEON, ...EXTRA_DUNGEONS].filter(d => {
              if (d.tier) return d.tier === tierGroup.tier;
              const t = d.tier || (d.recLvl >= 85 ? 4 : d.recLvl >= 65 ? 3 : d.recLvl >= 35 ? 2 : 1);
              return t === tierGroup.tier;
            });
            if (tierDungeons.length === 0) return null;
            return (
              <div key={tierGroup.tier} style={{marginBottom:'24px'}}>
                <div className="world-dungeon-heading" style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px', padding:'12px 18px', position:'relative', overflow:'hidden'}}>
                  <div style={{position:'absolute', right:'-10px', top:'-10px', fontSize:'60px', opacity:0.12, pointerEvents:'none'}}>{tierGroup.icon}</div>
                  <span style={{fontSize:'28px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>{tierGroup.icon}</span>
                  <div>
                    <div style={{fontSize:'16px', fontWeight:'800', color:'#fff', letterSpacing:'1px', textShadow:'0 1px 3px rgba(0,0,0,0.2)'}}>{tierGroup.title}</div>
                    <div style={{fontSize:'11px', color:'rgba(255,255,255,0.8)', marginTop:'2px'}}>{tierGroup.subtitle}</div>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'12px'}}>
                  {tierDungeons.map(d => {
                    const req = d.reqBadges || 0;
                    const isLocked = badges.length < req;
                    const tagRule = d.tagRestriction ? checkTagRestriction(party, d.tagRestriction) : null;
                    const cd = dungeonCooldowns[d.id];
                    const isCooling = cd && cd.count >= 3 && (Date.now() - cd.lastTime) < 5 * 60 * 1000;
                    const coolRemainMs = isCooling ? Math.max(0, 5 * 60 * 1000 - (Date.now() - cd.lastTime)) : 0;
                    const coolRemainMin = Math.floor(coolRemainMs / 60000);
                    const coolRemainSec = Math.ceil((coolRemainMs % 60000) / 1000);
                    const coolRemain = coolRemainMin > 0 ? `${coolRemainMin}分${coolRemainSec}秒` : `${coolRemainSec}秒`;
                    return (
                      <div className="world-dungeon-card" key={d.id} role="button" tabIndex={isLocked || isCooling ? -1 : 0} aria-disabled={isLocked || isCooling}
                        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!isLocked && !isCooling) enterDungeon(d); } }}
                        onClick={() => !isLocked && !isCooling && enterDungeon(d)}
                        style={{
                          position:'relative', borderRadius:'16px', cursor: (isLocked || isCooling) ? 'not-allowed' : 'pointer',
                          background: isLocked ? '#f5f5f5' : isCooling ? '#FFFDE7' : '#fff',
                          border: isLocked ? '1px solid #e0e0e0' : isCooling ? '1px solid #FFE082' : `1px solid ${d.color}20`,
                          boxShadow: isLocked ? 'none' : `0 4px 20px ${d.color}15`,
                          transition:'all 0.25s ease', overflow:'hidden',
                          opacity: (isLocked || isCooling) ? 0.6 : 1,
                        }}
                        onMouseOver={e => { if(!isLocked && !isCooling) { e.currentTarget.style.transform='translateY(-3px) scale(1.01)'; e.currentTarget.style.boxShadow=`0 8px 28px ${d.color}25`; }}}
                        onMouseOut={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow= isLocked ? 'none' : `0 4px 20px ${d.color}15`; }}
                      >
                        <div style={{display:'flex', alignItems:'stretch'}}>
                          <div className="world-dungeon-icon" style={{
                            width:'56px', minHeight:'100%', background:`linear-gradient(180deg, ${d.color}, ${d.color}cc)`,
                            display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', flexShrink:0,
                            position:'relative', overflow:'hidden'
                          }}>
                            <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(255,255,255,0.1)'}} />
                            <span style={{position:'relative', zIndex:1, filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}}>{d.icon}</span>
                          </div>
                          <div style={{flex:1, padding:'12px 14px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
                              <span className="world-dungeon-title" style={{fontSize:'14px', fontWeight:'700'}}>{d.name}</span>
                              <div style={{display:'flex', gap:'4px', alignItems:'center'}}>
                                <span style={{fontSize:'10px', color: d.color, letterSpacing:'1px'}}>{'★'.repeat(d.stars || 1)}</span>
                                {isLocked && <span style={{fontSize:'16px'}}>🔒</span>}
                                {isCooling && <span style={{fontSize:'9px', color:'#FF9800', background:'#FFF8E1', padding:'1px 5px', borderRadius:'4px'}}>⏰ {coolRemain}</span>}
                              </div>
                            </div>
                            <div className="world-dungeon-desc" style={{fontSize:'12px', lineHeight:'1.5', marginBottom:'8px'}}>{d.desc}</div>
                            <div className="world-dungeon-meta" style={{display:'flex', alignItems:'center', gap:'5px', flexWrap:'wrap'}}>
                              <span style={{fontSize:'10px', fontWeight:'700', color:'#fff', background: d.color, padding:'2px 7px', borderRadius:'4px'}}>Lv.{d.recLvl}+</span>
                              {party[0] && <span style={{fontSize:'9px', fontWeight:'600', color: party[0].level >= d.recLvl ? '#4caf50' : '#e53935', background: party[0].level >= d.recLvl ? '#E8F5E9' : '#FFEBEE', padding:'1px 5px', borderRadius:'4px'}}>你Lv.{party[0].level}</span>}
                              {req > 0 && <span style={{fontSize:'10px', color: isLocked ? '#e53935' : '#4caf50', fontWeight:'600'}}>🏅{req}徽章</span>}
                              {d.restriction && d.restriction !== 'none' && (
                                <span style={{fontSize:'9px', color:'#F57C00', background:'#FFF3E0', padding:'1px 5px', borderRadius:'4px'}}>
                                  {d.restriction === 'solo_run' ? '单挑' : d.restriction === 'entry_fee' ? '需门票' : d.restriction === 'lucky_nature' ? '幸运性格' : '特殊'}
                                </span>
                              )}
                              {tagRule && <span className="dungeon-entry-rule" style={{fontSize:'12px', color:tagRule.allowed ? '#b6c6be' : '#f3b6a0'}}>{tagRule.reason || tagRule.rule?.hint}</span>}
                              {d.rewards && d.rewards.slice(0,2).map((r,i) => (
                                <span key={i} style={{fontSize:'9px', color:'#666', background:'#f5f5f5', padding:'1px 5px', borderRadius:'4px'}}>{r.icon} {r.text}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 图鉴试炼塔 --- */}
        <div className="world-challenges" style={{display: mapTab==='challenges'?'block':'none', paddingBottom:'40px'}}>
          {(() => {
            const currentCaught = caughtDex.length;
            const allChallenges = [...CHALLENGES, ...ATTR_CHALLENGES, ...DOUBLE_CHALLENGES, ...JJK_CHALLENGES];
            const cleared = allChallenges.filter(c => completedChallenges.includes(c.id)).length;
            const totalPct = Math.min(100, (currentCaught / Math.max(1, POKEDEX.length)) * 100);

            const sectionConfigs = [
              { key: 'collect', label: '图鉴收集试炼', icon: '📖', data: CHALLENGES, accent: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#f97316)', tierFn: (idx) => { const t = idx < 4 ? 0 : idx < 8 ? 1 : idx < 12 ? 2 : idx < 15 ? 3 : 4; return { color: ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444'][t], name: ['入门','中级','高级','大师','传说'][t] }; } },
              { key: 'attr', label: '属性大师试炼', icon: '⚡', data: ATTR_CHALLENGES, accent: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', tierFn: (idx, c) => { const ti = TYPES[c.attrType]; return { color: ti?.color || '#6b7280', name: ti?.name || '属性' }; } },
              { key: 'double', label: '双打试炼', icon: '⚔️', data: DOUBLE_CHALLENGES, accent: '#ff5722', gradient: 'linear-gradient(135deg,#ff5722,#ff9800)', tierFn: () => ({ color: '#ff5722', name: '双打' }), isDouble: true },
              { key: 'jjk', label: '咒术回战试炼', icon: '🔮', data: JJK_CHALLENGES, accent: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)', tierFn: () => ({ color: '#7c3aed', name: '咒术' }) },
            ];

            const renderChallengeCard = (c, idx, section) => {
              const isUnlocked = currentCaught >= c.req;
              const isCleared = completedChallenges.includes(c.id);
              const progressPct = Math.min(100, (currentCaught / c.req) * 100);
              const bossInfo = POKEDEX.find(p => p.id === c.boss);
              const tier = section.tierFn(idx, c);
              const tc = tier.color;

              return (
                <div className="world-challenge-card" key={c.id} role="button" tabIndex={isUnlocked ? 0 : -1} aria-disabled={!isUnlocked}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
                  onClick={() => {
                    if (!isUnlocked) return;
                    if ((section.isDouble || c.isDouble) && party.filter(p => p.currentHp > 0).length < 2) { showMapToast('⚠️', '提示', '双打试炼需要至少2只存活精灵！', 1500); return; }
                    startBattle(null, 'challenge', c.id);
                  }}
                  style={{
                    borderRadius:'16px', cursor: isUnlocked ? 'pointer' : 'default',
                    background: isCleared ? `linear-gradient(145deg, ${tc}08, ${tc}15)` : isUnlocked ? 'linear-gradient(145deg, #ffffff, #f8fafc)' : '#f8f9fa',
                    border: isCleared ? `2px solid ${tc}60` : isUnlocked ? '1px solid #e2e8f0' : '1px solid #eef0f2',
                    transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)', position:'relative', overflow:'hidden',
                    boxShadow: isCleared ? `0 4px 20px ${tc}20` : isUnlocked ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    opacity: isUnlocked ? 1 : 0.6,
                  }}
                  onMouseOver={e => { if(isUnlocked) { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=isCleared ? `0 8px 30px ${tc}25` : `0 8px 24px ${tc}15`; }}}
                  onMouseOut={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=isCleared ? `0 4px 20px ${tc}20` : isUnlocked ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'; }}
                >
                  {isCleared && <div style={{position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg, ${tc}, ${tc}80)`}} />}
                  <div style={{padding:'14px 16px'}}>
                    <div style={{display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'10px'}}>
                      <div style={{
                        width:'44px', height:'44px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                        background: isCleared ? `linear-gradient(135deg, ${tc}20, ${tc}35)` : isUnlocked ? `linear-gradient(135deg, ${tc}08, ${tc}18)` : '#f1f5f9',
                        border: isCleared ? `2px solid ${tc}50` : `1px solid ${tc}20`,
                        boxShadow: isCleared ? `0 2px 8px ${tc}20` : 'none',
                      }}>
                        {isCleared ? <span style={{fontSize:'22px'}}>🏆</span> : bossInfo ? <div style={{width:'36px',height:'36px'}}>{renderAvatar(bossInfo)}</div> : <span style={{fontSize:'18px', opacity:0.4}}>?</span>}
                      </div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6px'}}>
                          <div className="world-challenge-title" style={{fontSize:'14px', fontWeight:'700', lineHeight:'1.4'}}>{c.title}</div>
                          <span style={{fontSize:'9px', fontWeight:'700', color:'#fff', background: isCleared ? `linear-gradient(135deg, ${tc}, ${tc}cc)` : tc, padding:'2px 7px', borderRadius:'6px', flexShrink:0, letterSpacing:'0.5px', boxShadow: `0 1px 3px ${tc}30`}}>{tier.name}</span>
                        </div>
                        <div className="world-challenge-desc" style={{fontSize:'12px', marginTop:'3px', lineHeight:'1.5'}}>{c.desc}</div>
                        <div style={{fontSize:'10px', color: isUnlocked ? tc : '#64748b', marginTop:'2px', fontWeight:'600'}}>Lv.{c.bossLvl}{c.isDouble ? ' · 双打' : ' · 单打'} {isCleared ? <span style={{color:'#22c55e'}}>| ✅ 已通关</span> : <span style={{ color: tc }}>| 需 {c.req} 只</span>}</div>
                      </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      <div style={{flex:1, height:'5px', background: isUnlocked ? '#e5e7eb' : '#f1f5f9', borderRadius:'3px', overflow:'hidden'}}>
                        <div style={{width:`${progressPct}%`, height:'100%', background: isCleared ? `linear-gradient(90deg, ${tc}, ${tc}99)` : isUnlocked ? `linear-gradient(90deg, ${tc}cc, ${tc})` : '#d1d5db', borderRadius:'3px', transition:'width 0.6s ease'}} />
                      </div>
                      <span style={{fontSize:'10px', fontWeight:'700', color: isCleared ? '#22c55e' : isUnlocked ? tc : '#a0aec0', minWidth:'52px', textAlign:'right'}}>
                        {isCleared ? '✓ 通关' : `${currentCaught}/${c.req}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            };

            return (<>
              <div className="world-challenge-summary" style={{margin:'0 0 24px', padding:'20px 24px', background:'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)', borderRadius:'20px', color:'#fff', position:'relative', overflow:'hidden'}}>
                <div style={{position:'absolute', top:'-30px', right:'-10px', fontSize:'120px', opacity:0.04, pointerEvents:'none', transform:'rotate(-15deg)'}}>🏆</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px'}}>
                  <div>
                    <div style={{fontSize:'10px', color:'#64748b', fontWeight:'600', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'4px'}}>COLLECTION PROGRESS</div>
                    <div style={{fontSize:'32px', fontWeight:'800', lineHeight:1}}>{currentCaught} <span style={{fontSize:'14px', color:'#475569', fontWeight:'500'}}>/ {POKEDEX.length}</span></div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'10px', color:'#64748b', letterSpacing:'1px', marginBottom:'4px'}}>CLEARED</div>
                    <div style={{fontSize:'28px', fontWeight:'800', color:'#fbbf24', lineHeight:1}}>{cleared} <span style={{fontSize:'13px', color:'#475569', fontWeight:'500'}}>/ {allChallenges.length}</span></div>
                  </div>
                </div>
                <div style={{height:'8px', background:'rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden', position:'relative'}}>
                  <div style={{width:`${totalPct}%`, height:'100%', background:'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)', borderRadius:'4px', transition:'width 0.6s ease', boxShadow:'0 0 12px rgba(251,191,36,0.4)'}} />
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'12px', gap:'6px'}}>
                  {sectionConfigs.map(s => {
                    const sc = s.data.filter(c => completedChallenges.includes(c.id)).length;
                    return (
                      <div key={s.key} style={{flex:1, padding:'8px 10px', background:'rgba(255,255,255,0.04)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.06)'}}>
                        <div style={{fontSize:'9px', color:'#64748b', marginBottom:'2px'}}>{s.icon} {s.label}</div>
                        <div style={{fontSize:'14px', fontWeight:'700', color: sc === s.data.length ? '#22c55e' : '#e2e8f0'}}>{sc}/{s.data.length}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {sectionConfigs.map(section => section.data.length > 0 && (
                <div key={section.key} style={{marginBottom:'24px'}}>
                  <div className="world-challenge-section-heading" style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px', padding:'0 4px'}}>
                    <div style={{width:'4px', height:'24px', background: section.gradient, borderRadius:'2px'}} />
                    <span style={{fontSize:'15px', fontWeight:'800', color:'#1e293b'}}>{section.icon} {section.label}</span>
                    <span style={{fontSize:'11px', color:'#64748b', fontWeight:'500'}}>{section.data.length} 座</span>
                    <div style={{flex:1}} />
                    <span style={{fontSize:'10px', color:'#64748b', background:'#f1f5f9', padding:'3px 10px', borderRadius:'8px', fontWeight:'600'}}>
                      {section.data.filter(c => completedChallenges.includes(c.id)).length}/{section.data.length} 通关
                    </span>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'12px'}}>
                    {section.data.map((c, idx) => renderChallengeCard(c, idx, section))}
                  </div>
                </div>
              ))}
            </>);
          })()}
        </div>

        {/* --- 国战 --- */}
        <div className="kingdom-command-panel" style={{display: mapTab==='kingdom'?'block':'none', paddingBottom:'40px'}}>
          {(() => {
            const kw = kingdomWar;
            const validFactionIds = FACTION_IDS.filter(fid => FACTIONS[fid]);
            const hasJoined = !!(kw.faction && FACTIONS[kw.faction]);

            if (!hasJoined) {
              const fd = {
                wei: { generals: '张辽、夏侯惇、许褚、典韦', strategy: '铁骑破阵', capital: '洛阳', stronghold: '兵精粮足，铁骑天下' },
                shu: { generals: '关羽、张飞、赵云、马超', strategy: '仁义为先', capital: '成都', stronghold: '卧龙凤雏，天下归心' },
                wu: { generals: '周瑜、吕蒙、陆逊、甘宁', strategy: '水战称雄', capital: '建业', stronghold: '江东子弟，破浪乘风' },
                jin: { generals: '谢玄、刘裕、拓跋焘、王猛', strategy: '多朝合纵', capital: '洛阳', stronghold: '政权独立，联军协同' },
              };
              return (<div className="kingdom-faction-select" style={{padding:'0'}}><div className="kingdom-faction-hero" style={{textAlign:'center', padding:'30px 20px 20px'}}><div style={{fontSize:'12px', letterSpacing:'6px', color:'#8B6914', fontWeight:'500', marginBottom:'6px'}}>━━ 群 雄 并 起 ━━</div><div style={{fontSize:'28px', fontWeight:'900', background:'linear-gradient(135deg, #8B4513, #DAA520, #8B4513)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'4px'}}>天下争霸</div><div style={{fontSize:'11px', color:'#64748b', marginTop:'8px'}}>四方势力并立，争夺天下{WAR_MAP_IDS.length}城 · 择一阵营，建功立业</div></div>{(() => { const ban = canRejoinFaction(kw); if (ban.ok) return null; return (<div style={{margin:'0 16px 12px', padding:'12px 14px', borderRadius:'12px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.35)', textAlign:'center'}}><div style={{fontSize:'13px', fontWeight:'800', color:'#b91c1c'}}>🏴 叛国流亡禁诏</div><div style={{fontSize:'11px', color:'#64748b', marginTop:'4px', lineHeight:1.5}}>{ban.reason}</div></div>); })()}<div className="kingdom-faction-grid" style={{display:'flex', gap:'12px', padding:'0 12px 20px', alignItems:'stretch'}}>{validFactionIds.map((fid, idx) => { const f = FACTIONS[fid]; const detail = fd[fid] || { generals: '群英荟萃', strategy: f.bonusDesc || '稳扎稳打', capital: f.capital || f.fullName || '未知都城', stronghold: f.motto || '整军待发' }; const gangs = GANG_PRESETS.filter(g => g.faction === fid); return (<div key={fid} className="kingdom-faction-card" style={{'--faction-color': f.color, flex:1, borderRadius:'16px', overflow:'hidden', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', border:'2px solid transparent', cursor:'pointer', transition:'all 0.35s ease', animation:'popIn 0.5s ease-out '+(0.1+idx*0.12)+'s backwards'}} onClick={() => { const rejoinCheck = canRejoinFaction(kw); if (!rejoinCheck.ok) { showMapToast('❌','叛国禁诏',rejoinCheck.reason,3500); return; } const gangFaction = gang?.gangId ? GANG_PRESETS.find(gg => gg.id === gang.gangId)?.faction : null; if (gangFaction && gangFaction !== fid) { showMapToast('❌','阵营冲突','你当前帮派「'+(GANG_PRESETS.find(gg => gg.id === gang.gangId)?.name || '')+'」属于'+FACTIONS[gangFaction]?.fullName+'，请先退帮再加入其他阵营',3000); return; } setConfirmModal({ title:'⚔️ 选择阵营', msg:'确定加入'+f.fullName+'吗？\n\n👑 主公: '+f.lord+'\n📍 国都: '+detail.capital+'\n💫 国运: '+f.bonusDesc+'\n\n⚠️ 加入后5天内不可叛国，叛国将承受极重惩罚（金币/兵力/名将/战功大幅损失，7天禁诏）', onOk: () => { setKingdomWar(prev => { const terr0 = Object.keys(prev.territories || {}).length > 0 ? prev.territories : initTerritories(); const terr1 = syncContestedTerritoryOwners(prev.contestProgress || {}, terr0); return { ...prev, faction: fid, factionJoinDate: new Date().toISOString(), territories: terr1, lastTick: Date.now(), seasonStartDate: prev.seasonStartDate || new Date().toISOString(), dailyCounts: { ...prev.dailyCounts, resetDate: getLocalDateStr() } }; }); }}); }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow='0 16px 48px '+f.color+'35'; e.currentTarget.style.borderColor=f.color+'90'; }} onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor='transparent'; }}><div style={{background:'linear-gradient(180deg, '+f.color+', '+f.darkColor+')', padding:'20px 16px 16px', textAlign:'center'}}><div style={{width:'52px', height:'52px', borderRadius:'50%', margin:'0 auto 10px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', border:'2px solid rgba(255,255,255,0.3)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)'}}>{f.icon}</div><div style={{fontSize:'20px', fontWeight:'900', color:'#fff', letterSpacing:'3px', textShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>{f.fullName}</div><div style={{fontSize:'11px', color:'rgba(255,255,255,0.8)', fontStyle:'italic', marginTop:'4px'}}>「{f.motto}」</div></div><div style={{padding:'14px 14px 16px'}}><div style={{fontSize:'12px', color:'#475569', lineHeight:'1.7', marginBottom:'12px', minHeight:'36px'}}>{f.desc}</div><div style={{display:'flex', flexDirection:'column', gap:'6px', marginBottom:'10px'}}>{[['👑 君主', f.lord],['📍 国都', detail.capital],['🎯 战略', detail.strategy]].map(([label, val]) => (<div key={label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(0,0,0,0.02)', borderRadius:'8px', padding:'7px 10px'}}><span style={{fontSize:'10px', color:'#64748b', fontWeight:'600'}}>{label}</span><span style={{fontSize:'12px', fontWeight:'700', color:'#1e293b'}}>{val}</span></div>))}</div><div style={{background:'rgba(0,0,0,0.02)', borderRadius:'8px', padding:'8px 10px', marginBottom:'8px'}}><div style={{fontSize:'10px', color:'#64748b', fontWeight:'600', marginBottom:'3px'}}>⚔️ 名将</div><div style={{fontSize:'11px', fontWeight:'600', color:'#334155'}}>{detail.generals}</div></div><div style={{background:f.color+'10', borderRadius:'8px', padding:'8px 10px', border:'1px solid '+f.color+'20', marginBottom:'8px'}}><div style={{fontSize:'10px', color:f.color, fontWeight:'700', marginBottom:'2px'}}>💫 国运</div><div style={{fontSize:'11px', color:'#475569', fontWeight:'600'}}>{f.bonusDesc}</div></div><div style={{display:'flex', gap:'4px', flexWrap:'wrap', marginBottom:'8px'}}>{gangs.map(g => (<span key={g.id} style={{background:'rgba(0,0,0,0.04)', padding:'2px 7px', borderRadius:'12px', fontSize:'10px', color:'#64748b', fontWeight:'500'}}>{g.icon} {g.name}</span>))}</div><div style={{textAlign:'center', paddingTop:'8px', borderTop:'1px solid rgba(0,0,0,0.06)', fontSize:'11px', color:f.color, fontWeight:'600', letterSpacing:'1px'}}>{detail.stronghold}</div></div></div>); })}</div></div>);
            }

            // 已加入阵营 - 国战主界面
            const myFaction = FACTIONS[kw.faction];
            const rankStats = buildRankStats(kw);
            const rank = getMilitaryRank(kw.warContribution || 0, rankStats);
            const nextRank = MILITARY_RANKS[MILITARY_RANKS.indexOf(rank) + 1] || null;
            const rankIdx = MILITARY_RANKS.indexOf(rank);
            const progressToNext = nextRank ? Math.min(100, ((kw.warContribution||0) - rank.minContribution) / (nextRank.minContribution - rank.minContribution) * 100) : 100;
            const terrCounts = {};
            ALL_FACTION_IDS.forEach(fid => { terrCounts[fid] = getFactionTerritoryCount(fid, kw.territories); });
            terrCounts.neutral = Object.values(kw.territories).filter(t => t.owner === 'neutral').length;
            const myTerrCount = terrCounts[kw.faction] || 0;
            const totalWarMaps = WAR_MAP_IDS.length;
            const seasonDaysLeft = kw.seasonStartDate ? Math.max(0, SEASON_CONFIG.durationDays - Math.floor((Date.now() - new Date(kw.seasonStartDate).getTime()) / MS_PER_DAY)) : 7;

            const today = getLocalDateStr();
            const dailyReset = kw.dailyCounts.resetDate !== today;
            const canClaimIncome = dailyReset || !kw.dailyCounts.income;
            const strategicBrief = buildKingdomStrategicBrief(kw, { today, rankIdx, seasonDaysLeft });
            const territorySiegeAttempts = kw.dailyCounts?.resetDate === today ? (kw.dailyCounts?.territorySieges || 0) : 0;
            const maxTerritorySieges = 5;
            const politicalSummaries = POLITICAL_FACTIONS.map(fid => ({
              ...getFactionPoliticalSummary(kw.politics, SANGUO_GENERALS, fid),
              power: getFactionGeneralPower(kw.politics, SANGUO_GENERALS, fid),
            }));
            const historicalPoliticalSummaries = getHistoricalFactionPoliticalSummaries(kw.politics, SANGUO_GENERALS);
            const qunLordSummaries = getQunLordSummaries(kw.politics, SANGUO_GENERALS);
            const activePoliticalGenerals = politicalSummaries.reduce((sum, item) => sum + item.count, 0);
            const relationLabel = value => value >= 60 ? '亲密' : value >= 20 ? '友善' : value >= 0 ? '中立' : value >= -35 ? '紧张' : '敌对';
            const runDiplomaticCommand = (target, action) => {
              const currentKw = kingdomWarRef.current;
              if (!currentKw?.faction) return;
              const counts = Object.fromEntries(POLITICAL_FACTIONS.map(fid => [fid, getFactionTerritoryCount(fid, currentKw.territories || {})]));
              const result = applyDiplomaticAction({
                politics: currentKw.politics,
                generals: SANGUO_GENERALS,
                actor: currentKw.faction,
                target,
                action,
                dateKey: getLocalDateStr(),
                territoryCounts: counts,
              });
              if (!result.ok) {
                showMapToast('📜', '外交未成', result.reason, 2400);
                return;
              }
              if ((currentKw.factionTokens || 0) < result.tokenCost) {
                showMapToast('🎖️', '令牌不足', `本次外交需要 ${result.tokenCost} 枚阵营令牌`, 2200);
                return;
              }
              const nextKw = {
                ...currentKw,
                politics: result.politics,
                factionTokens: Math.max(0, (currentKw.factionTokens || 0) - result.tokenCost),
                morale: Math.max(0, (currentKw.morale ?? 100) - result.moraleLoss),
                warLog: [...(currentKw.warLog || []).slice(-49), {
                  time: Date.now(), type: `diplomacy_${action}`, attacker: currentKw.faction, defender: target,
                  msg: result.message,
                }],
              };
              kingdomWarRef.current = nextKw;
              setKingdomWar(nextKw);
              showMapToast('🤝', '外交行动', `${result.message}${result.tokenCost ? ` · 令牌-${result.tokenCost}` : ''}`, 3200);
            };
            const runGeneralInvitation = (general) => {
              const currentKw = kingdomWarRef.current;
              if (!currentKw?.faction) return;
              if ((currentKw.factionTokens || 0) < DIPLOMACY_CONFIG.invitationCost) {
                showMapToast('🎖️', '令牌不足', `延揽名将需要 ${DIPLOMACY_CONFIG.invitationCost} 枚阵营令牌`, 2200);
                return;
              }
              const personallyRecruited = (currentKw.recruitedGenerals || []).some(item => item.id === general.id);
              const result = inviteGeneralToFaction({
                politics: currentKw.politics,
                generals: SANGUO_GENERALS,
                generalId: general.id,
                targetWarCamp: currentKw.faction,
                dateKey: getLocalDateStr(),
                personallyRecruited,
              });
              if (!result.ok) {
                showMapToast('📜', '延揽未成', result.reason, 2600);
                return;
              }
              const nextKw = {
                ...currentKw,
                politics: result.politics,
                factionTokens: Math.max(0, (currentKw.factionTokens || 0) - result.tokenCost),
                warLog: [...(currentKw.warLog || []).slice(-49), {
                  time: Date.now(), type: result.succeeded ? 'general_invited' : 'general_invitation_refused',
                  attacker: currentKw.faction, defender: general.politicalFaction, msg: result.message,
                }],
              };
              kingdomWarRef.current = nextKw;
              setKingdomWar(nextKw);
              showMapToast(result.succeeded ? '🤝' : '📜', result.succeeded ? '延揽成功' : '延揽被拒', `${result.message} · 令牌-${result.tokenCost}`, 3400);
            };

            const promoChallenge = nextRank ? RANK_PROMOTION_CHALLENGES[nextRank.id] : null;
            const defectStatus = getDefectionStatus(kw);
            const defectPenaltyLines = formatDefectionPenaltyLines(kw, gold);
            const handleDefectionConfirm = () => {
              setConfirmModal({
                title: '⚠️ 叛国确认 — 不可撤销',
                msg: `你将以叛国罪名脱离 ${myFaction.fullName}，并承受以下全部惩罚：\n\n${defectPenaltyLines.map(l => `· ${l}`).join('\n')}\n\n确定叛国？`,
                onOk: () => {
                  const applied = applyDefection(kw, gold);
                  setGold(g => Math.max(0, g - (applied.goldLoss || 0)));
                  if (applied.gangLeave && (gang?.gangId || gang?.customGang)) {
                    setGang(prev => ({
                      ...prev,
                      gangId: null,
                      joinDate: null,
                      contribution: 0,
                      isOwner: false,
                      customGang: null,
                      skills: [],
                      tasks: [],
                    }));
                  }
                  setKingdomWar(prev => ({
                    ...prev,
                    faction: applied.faction,
                    factionJoinDate: applied.factionJoinDate,
                    kwManpowerReserve: applied.kwManpowerReserve,
                    eliteTroops: applied.eliteTroops,
                    grain: applied.grain,
                    seasonContribution: applied.seasonContribution,
                    factionTokens: applied.factionTokens,
                    warContribution: applied.warContribution,
                    lifetimeContribution: applied.lifetimeContribution,
                    generalDraws: applied.generalDraws,
                    morale: applied.morale,
                    recruitedGenerals: applied.recruitedGenerals,
                    militaryRank: applied.militaryRank,
                    defectionCount: applied.defectionCount,
                    defectionBanUntil: applied.defectionBanUntil,
                    instabilityDebuffUntil: applied.instabilityDebuffUntil,
                    warLog: [...(prev.warLog || []), { time: Date.now(), type: 'defection', msg: `叛离${myFaction.fullName}，流亡禁诏${defectStatus.penalties.rejoinBanDays}天` }].slice(-20),
                  }));
                  const lostNames = (applied.lostGenerals || []).map(g => g.name).join('、') || '无';
                  showMapToast('🏴', '叛国完成', `名将充公：${lostNames}。${defectStatus.penalties.rejoinBanDays}天内不可择主`, 4500);
                },
              });
            };
            const renderDefectionPanel = (compact = false) => (
              <div style={{
                background: 'linear-gradient(135deg, #1a0f14, #2d1520)',
                borderRadius: '14px',
                padding: compact ? '12px' : '14px 16px',
                border: '1px solid rgba(239,68,68,0.35)',
                boxShadow: '0 4px 14px rgba(239,68,68,0.12)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: compact ? '8px' : '10px' }}>
                  <div>
                    <div style={{ fontSize: compact ? '12px' : '13px', fontWeight: '800', color: '#fecaca' }}>🏴 阵营外交 · 叛国</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
                      效忠 {myFaction.fullName}
                      {defectStatus.isRepeat ? ` · 曾叛 ${defectStatus.defectionCount} 次（惩罚加重）` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', flexShrink: 0 }}>极重惩罚</span>
                </div>
                {!compact && (
                  <div style={{ display: 'grid', gap: '4px', marginBottom: '10px' }}>
                    {defectPenaltyLines.map(line => (
                      <div key={line} style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.45 }}>· {line}</div>
                    ))}
                  </div>
                )}
                {compact && (
                  <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
                    {defectPenaltyLines.slice(0, 3).join(' · ')} 等 {defectPenaltyLines.length} 项重罚
                  </div>
                )}
                <button
                  type="button"
                  disabled={!defectStatus.canDefect}
                  onClick={handleDefectionConfirm}
                  style={{
                    width: '100%',
                    padding: compact ? '9px' : '11px',
                    border: 'none',
                    borderRadius: '10px',
                    background: defectStatus.canDefect ? 'linear-gradient(135deg, #b91c1c, #7f1d1d)' : '#475569',
                    color: '#fff',
                    fontSize: compact ? '11px' : '12px',
                    fontWeight: '800',
                    cursor: defectStatus.canDefect ? 'pointer' : 'not-allowed',
                    opacity: defectStatus.canDefect ? 1 : 0.75,
                  }}
                >
                  {defectStatus.canDefect ? '🏴 叛国投诚（不可撤销）' : `🔒 冷却中 · 还需 ${defectStatus.daysUntilReady} 天`}
                </button>
                {!defectStatus.canDefect && defectStatus.reason && (
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>{defectStatus.reason}</div>
                )}
              </div>
            );

            const kwSubTabs = [
              { id: 'overview', label: '概览', icon: '📊' },
              { id: 'rank', label: '官职', icon: '🏛️' },
              { id: 'generals', label: '将领', icon: '⚔️' },
              { id: 'diplomacy', label: '外交', icon: '🤝' },
              { id: 'campaigns', label: '战役', icon: '🗡️' },
              { id: 'history', label: '名战', icon: '📜' },
              { id: 'contested', label: '争夺', icon: '🏰' },
              { id: 'capital', label: '都城', icon: '🏯' },
              { id: 'territory', label: '领土', icon: '🗺️' },
              { id: 'warlog', label: '战报', icon: '📜' },
              { id: 'shop', label: '商店', icon: '🏪' },
              { id: 'season', label: '赛季', icon: '🏆' },
            ];

            return (
              <div className="kingdom-dashboard" style={{padding:'0 12px', background:'linear-gradient(180deg, #0d1117, #161b22)', borderRadius:'12px', margin:'0 -4px', paddingTop:'12px', paddingBottom:'12px'}}>
                {/* 阵营横幅 */}
                <div className="kingdom-banner" style={{
                  background:`linear-gradient(135deg, ${myFaction.darkColor}, ${myFaction.color})`,
                  borderRadius:'16px', padding:'16px', color:'#fff', marginBottom:'12px',
                  boxShadow:`0 4px 15px ${myFaction.color}40`,
                  '--faction-color': myFaction.color,
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}>
                    <span style={{fontSize:'28px'}}>{myFaction.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'16px', fontWeight:'800'}}>{myFaction.fullName} · {rank.icon} {rank.name}</div>
                      <div style={{fontSize:'10px', opacity:0.85}}>战功: {(kw.warContribution||0).toLocaleString()}{nextRank
                        ? (kw.warContribution || 0) >= nextRank.minContribution
                          ? ` → ${nextRank.name}（战功已达标，待完成晋升条件）`
                          : ` → ${nextRank.name}（还差 ${(nextRank.minContribution - (kw.warContribution || 0)).toLocaleString()}）`
                        : ' (最高官职)'}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'14px', fontWeight:'bold'}}>🎖️ {(kw.factionTokens||0)}</div>
                      <div style={{fontSize:'10px', opacity:0.7}}>令牌</div>
                    </div>
                  </div>
                  {nextRank && <div style={{height:'4px', borderRadius:'2px', background:'rgba(0,0,0,0.25)', marginBottom:'6px', overflow:'hidden'}}>
                    <div style={{height:'100%', width:progressToNext+'%', background:'rgba(255,255,255,0.6)', borderRadius:'2px', transition:'width 0.3s'}} />
                  </div>}
                  {rank.perkDesc && <div style={{fontSize:'10px', background:'rgba(255,255,255,0.15)', padding:'3px 10px', borderRadius:'6px', marginBottom:'6px'}}>✨ {rank.perkDesc}</div>}
                  <div style={{display:'flex', gap:'6px', flexWrap:'wrap', fontSize:'10px'}}>
                    <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px'}}>领地 {myTerrCount}/{totalWarMaps}</span>
                    <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px'}}>S{kw.season || 1} · {seasonDaysLeft}天</span>
                    <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px'}}>击杀 {kw.dailyCounts?.kills || 0}</span>
                    <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px'}}>将领 {(kw.recruitedGenerals||[]).length}/{rank.maxGenerals||12}</span>
                  </div>
                </div>
                <div className="kingdom-war-summary" aria-label="国战态势">
                  <div><span>我方领地</span><strong>{myTerrCount}/{totalWarMaps}</strong></div>
                  <div><span>赛季剩余</span><strong>{seasonDaysLeft}天</strong></div>
                  <div><span>今日收入</span><strong>{canClaimIncome ? '可领取' : '已领取'}</strong></div>
                  <div><span>阵营令牌</span><strong>{kw.factionTokens || 0}</strong></div>
                  <div><span>名将</span><strong>{(kw.recruitedGenerals||[]).length}/{rank.maxGenerals||12}</strong></div>
                </div>

                {/* 子Tab */}
                <div className="kingdom-subtabs" style={{display:'flex', gap:'6px', marginBottom:'12px', overflowX:'auto', paddingBottom:'4px', scrollMarginTop:'76px'}}>
                  {kwSubTabs.map(tab => (
                    <button key={tab.id} className={kwTab === tab.id ? 'is-active' : ''} onClick={() => setKwTab(tab.id)}
                      style={{
                        background: kwTab === tab.id ? myFaction.color : '#f1f5f9',
                        color: kwTab === tab.id ? '#fff' : '#64748b',
                        border:'none', borderRadius:'10px', padding:'8px 14px', fontSize:'12px', fontWeight:'600',
                        cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s',
                        scrollMarginTop:'76px',
                      }}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {kwTab === 'diplomacy' && (
                  <div style={{display:'grid', gap:'12px'}}>
                    <section style={{background:'#fff', borderRadius:'8px', padding:'14px', border:'1px solid #d7dee8'}}>
                      <div style={{display:'flex', justifyContent:'space-between', gap:'12px', alignItems:'flex-start', flexWrap:'wrap'}}>
                        <div>
                          <div style={{fontSize:'15px', fontWeight:'800', color:'#172033'}}>朝堂与天下</div>
                          <div style={{fontSize:'11px', color:'#64748b', marginTop:'3px'}}>全部 {activePoliticalGenerals}/{SANGUO_GENERALS.length} 名将参与国战 · 每日最多 {DIPLOMACY_CONFIG.maxActionsPerDay} 次使节行动</div>
                        </div>
                        <div style={{display:'flex', gap:'8px', fontSize:'11px'}}>
                          <span style={{padding:'5px 8px', background:'#eef2f7', color:'#334155', borderRadius:'6px'}}>国家信誉 {kw.politics?.trust ?? 50}</span>
                          <span style={{padding:'5px 8px', background:'#fff7ed', color:'#9a3412', borderRadius:'6px'}}>今日使节 {kw.politics?.dailyActionDate === today ? (kw.politics?.dailyActionCount || 0) : 0}/{DIPLOMACY_CONFIG.maxActionsPerDay}</span>
                        </div>
                      </div>
                    </section>

                    <div style={{fontSize:'12px', fontWeight:'800', color:'#334155'}}>战略联军外交</div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'10px'}}>
                      {politicalSummaries.map(summary => {
                        const factionInfo = FACTIONS[summary.faction] || { name:'群雄', fullName:'群雄', icon:'🏴', color:'#64748b' };
                        const isMine = summary.faction === kw.faction;
                        const relation = getFactionRelation(kw.politics, kw.faction, summary.faction);
                        const treaty = !isMine ? getActiveTreaty(kw.politics, kw.faction, summary.faction) : null;
                        return (
                          <article key={summary.faction} style={{background:'#fff', borderRadius:'8px', padding:'12px', border:`1px solid ${isMine ? factionInfo.color : '#d7dee8'}`}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                              <span style={{fontSize:'22px'}}>{factionInfo.icon}</span>
                              <div style={{flex:1, minWidth:0}}>
                                <div style={{fontSize:'13px', fontWeight:'800', color:'#172033'}}>{factionInfo.fullName || factionInfo.name}{isMine ? ' · 我方' : ''}</div>
                                <div style={{fontSize:'10px', color:'#64748b'}}>名将 {summary.count} · 动摇 {summary.wavering} · 自立 {summary.warlords}</div>
                              </div>
                              {!isMine && <span style={{fontSize:'10px', fontWeight:'700', color:relation >= 0 ? '#047857' : '#b91c1c'}}>{relationLabel(relation)} {relation}</span>}
                            </div>
                            <div style={{marginTop:'9px', paddingTop:'8px', borderTop:'1px solid #edf1f5', fontSize:'11px', lineHeight:1.65, color:'#475569'}}>
                              <div>主将：<b style={{color:'#1e293b'}}>{summary.commander?.name || '暂无'}</b></div>
                              <div>副将：<b style={{color:'#1e293b'}}>{summary.deputy?.name || '暂无'}</b></div>
                              <div>将领统御：<b style={{color:'#1e293b'}}>{summary.power}</b></div>
                              {treaty && <div style={{color:'#0369a1'}}>互不侵犯：剩余 {treaty.expiresTick - (kw.politics?.worldTick || 0)} 回合</div>}
                            </div>
                            {!isMine && (
                              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginTop:'9px'}}>
                                <button type="button" onClick={() => runDiplomaticCommand(summary.faction, 'envoy')} style={{padding:'7px', border:'1px solid #cbd5e1', borderRadius:'6px', background:'#f8fafc', color:'#334155', fontSize:'10px', cursor:'pointer'}}>遣使 · {DIPLOMACY_CONFIG.envoyCost}</button>
                                {!treaty ? (
                                  <button type="button" onClick={() => runDiplomaticCommand(summary.faction, 'pact')} style={{padding:'7px', border:'1px solid #93c5fd', borderRadius:'6px', background:'#eff6ff', color:'#1d4ed8', fontSize:'10px', cursor:'pointer'}}>缔约 · {DIPLOMACY_CONFIG.pactCost}</button>
                                ) : (
                                  <button type="button" onClick={() => setConfirmModal({ title:'撕毁盟约', msg:`撕毁与${factionInfo.fullName || factionInfo.name}的盟约将大幅降低关系、信誉与士气，确定继续？`, onOk:() => runDiplomaticCommand(summary.faction, 'break_pact') })} style={{padding:'7px', border:'1px solid #fca5a5', borderRadius:'6px', background:'#fef2f2', color:'#b91c1c', fontSize:'10px', cursor:'pointer'}}>撕毁盟约</button>
                                )}
                                <button type="button" onClick={() => runDiplomaticCommand(summary.faction, 'coalition')} style={{gridColumn:'1 / -1', padding:'7px', border:'1px solid #d8b4fe', borderRadius:'6px', background:'#faf5ff', color:'#7e22ce', fontSize:'10px', cursor:'pointer'}}>联合遏制霸主 · {DIPLOMACY_CONFIG.coalitionCost}</button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>

                    <section style={{background:'#fff', borderRadius:'8px', padding:'14px', border:'1px solid #d7dee8'}}>
                      <div style={{fontSize:'13px', fontWeight:'800', color:'#172033', marginBottom:'4px'}}>真实政权与将领归属</div>
                      <div style={{fontSize:'10px', color:'#64748b', marginBottom:'10px'}}>城池由战略联军争夺；忠诚、投降、诈降、自立和主副将均按下列真实政权独立计算。联军用将存在协同折损，不再把所有晋系人物直接相加。</div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'7px'}}>
                        {historicalPoliticalSummaries.map(summary => (
                          <div key={summary.id} style={{padding:'9px', border:`1px solid ${summary.color}35`, borderRadius:'6px', background:`${summary.color}08`}}>
                            <div style={{display:'flex', justifyContent:'space-between', gap:'6px', color:'#1e293b', fontSize:'11px', fontWeight:'800'}}>
                              <span>{summary.icon} {summary.name}</span><span>{summary.count}将</span>
                            </div>
                            <div style={{fontSize:'10px', color:'#64748b', marginTop:'4px'}}>主将 {summary.commander?.name || '暂无'} · 副将 {summary.deputy?.name || '暂无'}</div>
                            <div style={{fontSize:'10px', color:'#64748b', marginTop:'2px'}}>统御 {summary.power} · 动摇 {summary.wavering} · 自立 {summary.warlords}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section style={{background:'#fff', borderRadius:'8px', padding:'14px', border:'1px solid #d7dee8'}}>
                      <div style={{fontSize:'13px', fontWeight:'800', color:'#172033', marginBottom:'4px'}}>南北朝人才延揽</div>
                      <div style={{fontSize:'10px', color:'#64748b', marginBottom:'10px'}}>刘宋与北魏名将可接受任一战略阵营邀请。忠诚越低越容易成功；已由玩家招募的名将获得显著成功率加成。</div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:'7px', maxHeight:'320px', overflowY:'auto'}}>
                        {SANGUO_GENERALS.filter(general => general.canServeAnyWarCamp).map(general => {
                          const state = kw.politics?.generals?.[general.id];
                          const currentFaction = HISTORICAL_POLITICAL_FACTIONS[state?.allegiance] || HISTORICAL_POLITICAL_FACTIONS[general.politicalFaction];
                          const personallyRecruited = (kw.recruitedGenerals || []).some(item => item.id === general.id);
                          const preview = getGeneralInvitationPreview({ politics: kw.politics, general, targetWarCamp: kw.faction, personallyRecruited });
                          return (
                            <div key={general.id} style={{padding:'9px', border:'1px solid #e2e8f0', borderRadius:'6px', background:'#f8fafc', display:'flex', alignItems:'center', gap:'8px'}}>
                              <div style={{flex:1, minWidth:0}}>
                                <div style={{fontSize:'11px', fontWeight:'800', color:'#1e293b'}}>{general.name} <span style={{color:GENERAL_RARITY_CONFIG[general.rarity]?.color}}>{general.rarity}</span></div>
                                <div style={{fontSize:'9px', color:'#64748b', marginTop:'2px'}}>{currentFaction?.name || general.historicalFaction} · 忠诚 {state?.loyalty ?? '—'}{personallyRecruited ? ' · 已招募' : ''}</div>
                              </div>
                              <button type="button" disabled={!preview.ok} title={preview.ok ? `成功率 ${Math.round(preview.chance * 100)}%` : preview.reason} onClick={() => runGeneralInvitation(general)} style={{padding:'6px 8px', border:'1px solid #cbd5e1', borderRadius:'6px', background:preview.ok ? '#fff7ed' : '#e2e8f0', color:preview.ok ? '#9a3412' : '#94a3b8', fontSize:'9px', fontWeight:'800', cursor:preview.ok ? 'pointer' : 'not-allowed', whiteSpace:'nowrap'}}>
                                {preview.ok ? `延揽 ${Math.round(preview.chance * 100)}%` : '不可延揽'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section style={{background:'#fff', borderRadius:'8px', padding:'14px', border:'1px solid #d7dee8'}}>
                      <div style={{fontSize:'13px', fontWeight:'800', color:'#172033', marginBottom:'8px'}}>群雄诸侯</div>
                      <div style={{fontSize:'10px', color:'#64748b', marginBottom:'10px'}}>群雄不是统一国家。每次只能由一位诸侯出兵，盟主全额统率本部并最多借调次强诸侯三成兵力；地盘越大，联盟离心越重。</div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'7px'}}>
                        {qunLordSummaries.map(lord => (
                          <div key={lord.id} style={{padding:'9px', border:'1px solid #e2e8f0', borderRadius:'6px', background:'#f8fafc'}}>
                            <div style={{display:'flex', justifyContent:'space-between', gap:'6px', color:'#1e293b', fontSize:'11px', fontWeight:'800'}}><span>{lord.icon} {lord.name}</span><span>{lord.readiness}</span></div>
                            <div style={{fontSize:'10px', color:'#64748b', marginTop:'4px'}}>主将 {lord.commander?.name || '暂无'} · 副将 {lord.deputy?.name || '暂无'}</div>
                            <div style={{fontSize:'10px', color:'#64748b', marginTop:'2px'}}>部属 {lord.count} · 凝聚 {lord.cohesion} · 声望 {lord.influence} · {lord.doctrine}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section style={{background:'#101827', borderRadius:'8px', padding:'12px', color:'#e2e8f0'}}>
                      <div style={{fontSize:'12px', fontWeight:'800', marginBottom:'7px'}}>近期朝局</div>
                      {(kw.politics?.recentEvents || []).length === 0 ? (
                        <div style={{fontSize:'10px', color:'#94a3b8'}}>目前没有重大外交或将领事件。</div>
                      ) : (kw.politics.recentEvents || []).slice(-8).reverse().map((event, index) => (
                        <div key={`${event.tick}-${event.type}-${index}`} style={{fontSize:'10px', lineHeight:1.6, color:'#cbd5e1', borderTop:index ? '1px solid #263244' : 'none', paddingTop:index ? '5px' : 0, marginTop:index ? '5px' : 0}}>第 {event.tick} 回合 · {event.message}</div>
                      ))}
                    </section>
                  </div>
                )}

                {/* 官职系统 */}
                {kwTab === 'rank' && (
                  <div style={{display:'grid', gap:'12px'}}>
                    {/* 当前官职卡 */}
                    <div style={{background:'#fff', borderRadius:'16px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{textAlign:'center', marginBottom:'16px'}}>
                        <div style={{fontSize:'40px', marginBottom:'4px'}}>{rank.icon}</div>
                        <div style={{fontSize:'22px', fontWeight:'900', color:'#1e293b'}}>{rank.name}</div>
                        <div style={{fontSize:'12px', color:'#64748b', marginTop:'2px'}}>第 {rankIdx + 1} / {MILITARY_RANKS.length} 级</div>
                        <div style={{fontSize:'13px', color:myFaction.color, fontWeight:'700', marginTop:'6px'}}>战功 {(kw.warContribution||0).toLocaleString()}</div>
                      </div>
                      {rank.perkDesc && (
                        <div style={{padding:'12px', background:'linear-gradient(135deg, #FFF8E1, #FFF3E0)', borderRadius:'12px', border:'1px solid #FFE0B2', marginBottom:'14px', textAlign:'center'}}>
                          <div style={{fontSize:'11px', fontWeight:'800', color:'#E65100', marginBottom:'2px'}}>✨ 当前官职特权</div>
                          <div style={{fontSize:'13px', fontWeight:'700', color:'#BF360C'}}>{rank.perkDesc}</div>
                        </div>
                      )}
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                        <div style={{padding:'10px', background:'#f1f5f9', borderRadius:'10px', textAlign:'center'}}>
                          <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b'}}>{rank.salary.toLocaleString()}</div>
                          <div style={{fontSize:'10px', color:'#64748b'}}>日俸禄(金币)</div>
                        </div>
                        <div style={{padding:'10px', background:'#f1f5f9', borderRadius:'10px', textAlign:'center'}}>
                          <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b'}}>×{rank.incomeMultiplier}</div>
                          <div style={{fontSize:'10px', color:'#64748b'}}>收入倍率</div>
                        </div>
                        <div style={{padding:'10px', background:'#f1f5f9', borderRadius:'10px', textAlign:'center'}}>
                          <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b'}}>{rank.maxGenerals || 12}</div>
                          <div style={{fontSize:'10px', color:'#64748b'}}>名将上限</div>
                        </div>
                        <div style={{padding:'10px', background:'#f1f5f9', borderRadius:'10px', textAlign:'center'}}>
                          <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b'}}>+{rank.tokenBonus || 0}</div>
                          <div style={{fontSize:'10px', color:'#64748b'}}>额外令牌/日</div>
                        </div>
                      </div>
                    </div>

                    {/* 晋升条件 */}
                    {nextRank && (
                      <div style={{background:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                        <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b', marginBottom:'10px'}}>📈 晋升至 {nextRank.icon} {nextRank.name}</div>
                        <div style={{marginBottom:'8px'}}>
                          <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'4px'}}>
                            <span style={{color:'#64748b'}}>战功要求: {nextRank.minContribution.toLocaleString()}</span>
                            <span style={{fontWeight:'700', color: (kw.warContribution||0) >= nextRank.minContribution ? '#4CAF50' : '#ef5350'}}>{(kw.warContribution||0).toLocaleString()} / {nextRank.minContribution.toLocaleString()}</span>
                          </div>
                          <div style={{height:'6px', borderRadius:'3px', background:'#e2e8f0', overflow:'hidden'}}>
                            <div style={{height:'100%', width:progressToNext+'%', background: progressToNext >= 100 ? '#4CAF50' : myFaction.color, borderRadius:'3px', transition:'width 0.3s'}} />
                          </div>
                        </div>
                        {promoChallenge && (
                          <div style={{padding:'10px', background:'#FFF8E1', borderRadius:'10px', border:'1px solid #FFF176'}}>
                            <div style={{fontSize:'11px', fontWeight:'700', color:'#F57F17', marginBottom:'4px'}}>🏆 晋升挑战</div>
                            <div style={{fontSize:'12px', color:'#33691E', fontWeight:'600'}}>{promoChallenge.desc}</div>
                          </div>
                        )}
                        {nextRank.perkDesc && (
                          <div style={{marginTop:'8px', fontSize:'11px', color:'#64748b'}}>
                            <span style={{fontWeight:'700'}}>晋升后解锁：</span>{nextRank.perkDesc}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 官职一览 */}
                    <div style={{background:'#fff', borderRadius:'16px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b', marginBottom:'12px'}}>🏛️ 官职一览</div>
                      <div style={{display:'grid', gap:'6px'}}>
                        {MILITARY_RANKS.map((r, i) => {
                          const isCurrentRank = r.id === rank.id;
                          const isUnlocked = (kw.warContribution||0) >= r.minContribution;
                          return (
                            <div key={r.id} style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 10px', borderRadius:'10px', background: isCurrentRank ? myFaction.color+'12' : isUnlocked ? '#f0fdf4' : '#f8fafc', border:'1px solid '+(isCurrentRank ? myFaction.color+'30' : isUnlocked ? '#bbf7d0' : '#e2e8f0'), opacity: isUnlocked ? 1 : 0.6}}>
                              <span style={{fontSize:'18px', width:'26px', textAlign:'center'}}>{r.icon}</span>
                              <div style={{flex:1, minWidth:0}}>
                                <div style={{fontSize:'12px', fontWeight:'800', color: isCurrentRank ? myFaction.color : '#1e293b'}}>{r.name} {isCurrentRank && '← 当前'}</div>
                                <div style={{fontSize:'9px', color:'#64748b'}}>{r.perkDesc || '基础官职'} · 俸禄{r.salary.toLocaleString()}</div>
                              </div>
                              <div style={{fontSize:'10px', color:'#64748b', fontWeight:'600', textAlign:'right'}}>
                                {r.minContribution > 0 ? r.minContribution.toLocaleString() : '0'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 概览 */}
                {kwTab === 'overview' && (
                  <div style={{display:'grid', gap:'12px'}}>
                    {/* 赛季抽卡提示 */}
                    {(kw.generalDraws || 0) > 0 && (
                      <button type="button" onClick={() => setView('general_dex')} style={{width:'100%', border:'none', textAlign:'left', background:`linear-gradient(135deg, ${myFaction.color}, ${myFaction.darkColor || myFaction.color})`, borderRadius:'14px', padding:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}>
                        <div style={{fontSize:'32px'}}>🎴</div>
                        <div>
                          <div style={{fontSize:'14px', fontWeight:'800', color:'#fff'}}>赛季名将抽卡 x{kw.generalDraws}</div>
                          <div style={{fontSize:'11px', color:'rgba(255,255,255,0.8)', marginTop:'2px'}}>点击前往名将图鉴使用抽卡机会</div>
                        </div>
                      </button>
                    )}
                    <div style={{background:`linear-gradient(135deg, ${myFaction.darkColor}, #0f172a 68%, #111827)`, borderRadius:'16px', padding:'16px', color:'#fff', boxShadow:`0 12px 34px ${myFaction.color}24`, border:`1px solid ${myFaction.color}55`}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'12px'}}>
                        <div>
                          <div style={{fontSize:'11px', color:myFaction.lightColor, fontWeight:'900', letterSpacing:'1.5px'}}>战略态势 · {strategicBrief.posture.tone}</div>
                          <div style={{fontSize:'22px', fontWeight:'900', marginTop:'4px'}}>{strategicBrief.posture.label}</div>
                          <div style={{fontSize:'12px', color:'rgba(255,255,255,0.75)', marginTop:'5px', lineHeight:1.6}}>{strategicBrief.posture.desc}</div>
                          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', marginTop:'8px', padding:'5px 9px', borderRadius:'999px', background:`${strategicBrief.difficulty.color}22`, border:`1px solid ${strategicBrief.difficulty.color}55`, color:strategicBrief.difficulty.color, fontSize:'10px', fontWeight:'900'}}>
                            战局难度 {strategicBrief.campaignDifficulty}/100 · {strategicBrief.difficulty.label}
                          </div>
                        </div>
                        <button type="button" onClick={() => {
                          if (strategicBrief.reserve < SIEGE_CONFIG.readyReserve) {
                            setKwTab('overview');
                            window.setTimeout(() => {
                              document.getElementById('kingdom-recruit-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 0);
                          } else {
                            setKwTab('territory');
                          }
                        }}
                          style={{border:'1px solid rgba(255,255,255,0.24)', background:'rgba(255,255,255,0.12)', color:'#fff', borderRadius:'12px', padding:'8px 12px', fontSize:'11px', fontWeight:'800', cursor:'pointer', flexShrink:0}}>
                          {strategicBrief.reserve < SIEGE_CONFIG.readyReserve ? '去征兵' : '去行动'}
                        </button>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(96px, 1fr))', gap:'8px', marginBottom:'12px'}}>
                        {strategicBrief.metrics.map(m => (
                          <div key={m.label} style={{background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'9px'}}>
                            <div style={{fontSize:'10px', color:'#cbd5e1', fontWeight:'700'}}>{m.label}</div>
                            <div style={{fontSize:'14px', color:'#fff', fontWeight:'900', marginTop:'2px'}}>{m.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', gap:'10px'}}>
                        <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                          <div style={{fontSize:'11px', fontWeight:'900', color:'#e5e7eb', marginBottom:'7px'}}>行动建议</div>
                          {strategicBrief.recommendations.slice(0, 3).map((tip, i) => (
                            <div key={tip} style={{display:'flex', gap:'7px', alignItems:'flex-start', marginTop:i ? '7px' : 0}}>
                              <span style={{width:'18px', height:'18px', borderRadius:'7px', background:`${myFaction.color}44`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'900', flexShrink:0}}>{i + 1}</span>
                              <span style={{fontSize:'11px', color:'#cbd5e1', lineHeight:1.45}}>{tip}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                          <div style={{fontSize:'11px', fontWeight:'900', color:'#e5e7eb', marginBottom:'7px'}}>主要对手</div>
                          {strategicBrief.rival ? (
                            <div style={{display:'flex', alignItems:'center', gap:'9px'}}>
                              <span style={{fontSize:'24px'}}>{FACTIONS[strategicBrief.rival.fid]?.icon || '🏴'}</span>
                              <div>
                                <div style={{fontSize:'13px', color:'#fff', fontWeight:'900'}}>{FACTIONS[strategicBrief.rival.fid]?.fullName || strategicBrief.rival.fid}</div>
                                <div style={{fontSize:'10px', color:'#94a3b8'}}>{strategicBrief.rival.fid === 'qun' && strategicBrief.rival.actualCount > strategicBrief.rival.count
                                  ? `有效兵权 ${strategicBrief.rival.count}城（实际分属 ${strategicBrief.rival.lordCount} 路诸侯、共 ${strategicBrief.rival.actualCount} 城） · 驻军 ${strategicBrief.rival.totalTroops}`
                                  : `领地 ${strategicBrief.rival.count} · 驻军 ${strategicBrief.rival.totalTroops}`}</div>
                              </div>
                            </div>
                          ) : <div style={{fontSize:'11px', color:'#94a3b8'}}>暂无对手数据</div>}
                        </div>
                        <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                          <div style={{fontSize:'11px', fontWeight:'900', color:'#e5e7eb', marginBottom:'7px'}}>战略杠杆</div>
                          {strategicBrief.strategicLevers.map(lever => (
                            <div key={lever.label} style={{marginBottom:'7px'}}>
                              <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
                                <span style={{fontSize:'11px', color:'#fff', fontWeight:'800'}}>{lever.label}</span>
                                <span style={{fontSize:'10px', color:myFaction.lightColor, fontWeight:'900'}}>{lever.value}</span>
                              </div>
                              <div style={{fontSize:'10px', color:'#94a3b8', lineHeight:1.42, marginTop:'2px'}}>{lever.desc}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{background:'rgba(0,0,0,0.22)', borderRadius:'12px', padding:'10px'}}>
                          <div style={{fontSize:'11px', fontWeight:'900', color:'#e5e7eb', marginBottom:'7px'}}>攻城窗口</div>
                          {strategicBrief.assaultWindows.length ? strategicBrief.assaultWindows.map(w => (
                            <button key={w.mapId} type="button" onClick={() => setKwTab('territory')}
                              style={{width:'100%', border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.05)', color:'#fff', borderRadius:'10px', padding:'8px', marginBottom:'6px', textAlign:'left', cursor:'pointer'}}>
                              <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}>
                                <span style={{fontSize:'11px', fontWeight:'900'}}>#{w.mapId} {FACTIONS[w.owner]?.icon || '⚑'} {FACTIONS[w.owner]?.name || '中立'}</span>
                                <span style={{fontSize:'10px', color:w.risk === '高' ? '#fca5a5' : w.risk === '中' ? '#fbbf24' : '#86efac', fontWeight:'900'}}>风险{w.risk}</span>
                              </div>
                              <div style={{fontSize:'10px', color:'#94a3b8', marginTop:'3px'}}>城防 {w.strength} · 驻军 {w.garrison} · {w.supplyLabel}</div>
                              <div style={{fontSize:'10px', color:'#cbd5e1', marginTop:'3px'}}>{w.advice}</div>
                            </button>
                          )) : <div style={{fontSize:'11px', color:'#94a3b8'}}>暂无可攻普通领地，去争夺名城或巩固防线。</div>}
                        </div>
                      </div>
                    </div>
                    {renderDefectionPanel()}
                    {(() => {
                      const grainCap = calcGrainCap(kw);
                      const currentGrain = Math.max(0, Number(kw.grain) || 0);
                      const grainOverCap = currentGrain > grainCap;
                      const res = Math.min(MANPOWER_RESERVE_CAP, Math.max(0, kw.kwManpowerReserve || 0));
                      const timeMod = getBattleTimeModifiers();
                      return (
                        <div id="kingdom-recruit-panel" tabIndex={-1} style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: '14px', padding: '14px 16px', color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', scrollMarginTop:'18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '800' }}>🪖 征兵与战备</div>
                            <span style={{ fontSize: '11px', background: timeMod.nightVision ? 'rgba(99,102,241,0.35)' : 'rgba(251,191,36,0.25)', padding: '3px 10px', borderRadius: '999px', fontWeight: '700' }}>
                              {timeMod.label}{timeMod.nightVision ? ' · 战功x1.5' : ''}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', marginBottom: '10px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '8px' }}>预备兵 {res}/{MANPOWER_RESERVE_CAP}</span>
                            <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '8px' }}>精锐 {kw.eliteTroops || 0}</span>
                            <span title={grainOverCap ? '超储粮草可以继续消耗，但每日补给不会增加，次日结算时会回落到当前容量' : '粮草容量由己方领地数量决定'} style={{ background: grainOverCap ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.12)', color: grainOverCap ? '#fde68a' : '#fff', padding: '4px 10px', borderRadius: '8px' }}>粮草 {currentGrain}/{grainCap}{grainOverCap ? '（超储）' : ''}</span>
                            <span style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '8px' }}>士气 {kw.morale ?? 100}</span>
                          </div>
                          {grainOverCap && <div style={{fontSize:'10px', color:'#fde68a', margin:'-3px 0 9px'}}>领地减少后产生的超储仍可用于征兵；每日补给不会继续增加，次日结算会按当前容量收拢。</div>}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                            <button type="button" onClick={() => handleKingdomRecruit('normal')} style={{ flex: '1 1 120px', padding: '10px', border: 'none', borderRadius: '10px', background: myFaction.color, color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                              普通征兵 ({RECRUIT_CONFIG.normalCost.gold}金+{RECRUIT_CONFIG.normalCost.grain}粮)
                            </button>
                            <button type="button" onClick={() => handleKingdomRecruit('elite')} style={{ flex: '1 1 120px', padding: '10px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg,#B45309,#92400E)', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                              精锐整训 ({RECRUIT_CONFIG.eliteCost.gold}金+{RECRUIT_CONFIG.eliteCost.grain}粮)
                            </button>
                          </div>
                          {(() => {
                            const rankPerks = getUnlockedRankPerks(kw, buildRankStats(kw));
                            const today = getLocalDateStr();
                            const rallyReady = rankPerks.rallyStrength && kw.dailyCounts?.rallyUsed !== today;
                            const decreeReady = rankPerks.decreeStrength && kw.dailyCounts?.decreeUsed !== today;
                            if (!rankPerks.rallyStrength && !rankPerks.decreeStrength) return null;
                            return (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                {rankPerks.rallyStrength ? (
                                  <button type="button" disabled={!rallyReady} onClick={() => {
                                    const r = useWarRally(kw, buildRankStats(kw));
                                    if (!r.ok) { showMapToast('❌', '集结令', r.reason, 2000); return; }
                                    setKingdomWar(prev => ({ ...prev, ...r.nextKw }));
                                    showMapToast('📯', '集结令', `己方 ${r.count} 块领地防御 +${rankPerks.rallyStrength}`, 2500);
                                  }} style={{ flex: '1 1 140px', padding: '9px', border: 'none', borderRadius: '10px', background: rallyReady ? '#2563eb' : '#64748b', color: '#fff', fontWeight: '700', fontSize: '11px', cursor: rallyReady ? 'pointer' : 'not-allowed' }}>
                                    📯 集结令 (+{rankPerks.rallyStrength}){!rallyReady ? ' · 今日已用' : ''}
                                  </button>
                                ) : null}
                                {rankPerks.decreeStrength ? (
                                  <button type="button" disabled={!decreeReady} onClick={() => {
                                    const r = useRoyalDecree(kw, buildRankStats(kw));
                                    if (!r.ok) { showMapToast('❌', '王令', r.reason, 2000); return; }
                                    setKingdomWar(prev => ({ ...prev, ...r.nextKw }));
                                    showMapToast('👑', '王令', `全阵营 ${r.count} 块领地防御 +${rankPerks.decreeStrength}`, 2500);
                                  }} style={{ flex: '1 1 140px', padding: '9px', border: 'none', borderRadius: '10px', background: decreeReady ? '#7c3aed' : '#64748b', color: '#fff', fontWeight: '700', fontSize: '11px', cursor: decreeReady ? 'pointer' : 'not-allowed' }}>
                                    👑 颁布王令 (+{rankPerks.decreeStrength}){!decreeReady ? ' · 今日已用' : ''}
                                  </button>
                                ) : null}
                              </div>
                            );
                          })()}
                          <div style={{ fontSize: '10px', opacity: 0.75, lineHeight: 1.5 }}>
                            每次征兵/领土攻城后，按顺序轮转一个敌方行动。普通领地攻城每日最多 5 次，且需消耗兵力。
                          </div>
                        </div>
                      );
                    })()}
                    {/* 军衔特权：集结令 / 王令 */}
                    {(() => {
                      const perkFx = getRankPerkEffects(kw);
                      const today = getLocalDateStr();
                      const rallyUsed = kw.dailyCounts?.[`rally_${today}`] || false;
                      const decreeUsed = kw.dailyCounts?.[`decree_${today}`] || false;
                      const hasRally = perkFx.rallyStrength > 0;
                      const hasDecree = perkFx.decreeStrength > 0;
                      if (!hasRally && !hasDecree) return null;
                      return (
                        <div style={{background:'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius:'14px', padding:'14px', color:'#fff'}}>
                          <div style={{fontSize:'13px', fontWeight:'800', marginBottom:'8px'}}>🏛️ 军衔特权</div>
                          <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                            {hasRally && (
                              <button type="button" disabled={rallyUsed} onClick={() => {
                                if (rallyUsed) return;
                                setKingdomWar(prev => {
                                  const terr = { ...prev.territories };
                                  const owned = WAR_MAP_IDS.filter(mid => terr[mid]?.owner === prev.faction && !CONTESTED_MAP_IDS.includes(Number(mid)));
                                  if (owned.length === 0) return prev;
                                  const weakest = owned.reduce((best, id) => ((terr[id]?.strength || 100) < (terr[best]?.strength || 100) ? id : best), owned[0]);
                                  terr[weakest] = { ...terr[weakest], strength: Math.min(WAR_TICK_CONFIG.maxStrength, (terr[weakest]?.strength || 50) + (perkFx.rallyStrength || 5)) };
                                  return { ...prev, territories: terr, dailyCounts: { ...prev.dailyCounts, [`rally_${today}`]: true } };
                                });
                                showMapToast('⚔️', '集结令', `最弱领地城防 +${perkFx.rallyStrength}`, 2000);
                              }} style={{flex:'1 1 120px', padding:'10px', border:'none', borderRadius:'10px', background: rallyUsed ? '#334155' : myFaction.color, color:'#fff', fontWeight:'700', fontSize:'12px', cursor: rallyUsed ? 'not-allowed' : 'pointer', opacity: rallyUsed ? 0.5 : 1}}>
                                ⚔️ 集结令 (+{perkFx.rallyStrength}城防) {rallyUsed ? '(已用)' : ''}
                              </button>
                            )}
                            {hasDecree && (
                              <button type="button" disabled={decreeUsed} onClick={() => {
                                if (decreeUsed) return;
                                setKingdomWar(prev => {
                                  const terr = { ...prev.territories };
                                  for (const mid of WAR_MAP_IDS) {
                                    if (CONTESTED_MAP_IDS.includes(Number(mid))) continue;
                                    if (terr[mid]?.owner === prev.faction) {
                                      terr[mid] = { ...terr[mid], strength: Math.min(WAR_TICK_CONFIG.maxStrength, (terr[mid]?.strength || 50) + (perkFx.decreeStrength || 3)) };
                                    }
                                  }
                                  return { ...prev, territories: terr, dailyCounts: { ...prev.dailyCounts, [`decree_${today}`]: true } };
                                });
                                showMapToast('👑', '王令', `全部己方领地城防 +${perkFx.decreeStrength}`, 2500);
                              }} style={{flex:'1 1 120px', padding:'10px', border:'none', borderRadius:'10px', background: decreeUsed ? '#334155' : '#D4AF37', color:'#fff', fontWeight:'700', fontSize:'12px', cursor: decreeUsed ? 'not-allowed' : 'pointer', opacity: decreeUsed ? 0.5 : 1}}>
                                👑 王令 (全领地+{perkFx.decreeStrength}城防) {decreeUsed ? '(已用)' : ''}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                    {/* 五个地图战略联军对比（含群雄）*/}
                    <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b', marginBottom:'12px'}}>五方战略联军对比</div>
                      {ALL_FACTION_IDS.map(fid => {
                        const f = FACTIONS[fid];
                        const cnt = terrCounts[fid] || 0;
                        const fTerritoryStats = getFactionTerritoryStats(kw.territories);
                        const troops = fTerritoryStats[fid]?.totalTroops || 0;
                        const pct = totalWarMaps > 0 ? (cnt / totalWarMaps * 100) : 0;
                        const isMine = fid === kw.faction;
                        return (
                          <div key={fid} style={{marginBottom:'10px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
                              <span style={{fontSize:'12px', fontWeight: isMine ? '800' : '500', color: isMine ? (f?.color || '#333') : '#475569'}}>
                                {f?.icon} {f?.fullName || fid} {isMine ? '(我方)' : ''}
                              </span>
                              <span style={{fontSize:'11px', color:'#64748b', fontWeight:'600'}}>{cnt}城 · 🪖{troops}兵</span>
                            </div>
                            <div style={{height:'8px', background:'#f1f5f9', borderRadius:'4px', overflow:'hidden'}}>
                              <div style={{width:`${pct}%`, height:'100%', background: f?.color || '#999', borderRadius:'4px', transition:'width 0.5s'}} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 每日收入 */}
                    <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b', marginBottom:'8px'}}>每日领地收入 + 军饷</div>
                      {(() => {
                        const perkFxPreview = getRankPerkEffects(kw);
                        const taxMultPrev = perkFxPreview.territoryIncomeMult || 1;
                        const allMultPrev = perkFxPreview.allBonusMult || 1;
                        const incomeBase = Math.min(myTerrCount, 12) * 400;
                        const incomeTotal = Math.floor(Math.min((Math.floor(incomeBase * rank.incomeMultiplier * taxMultPrev) + (rank.salary || 0)) * allMultPrev, 50000));
                        const tokenIncome = myTerrCount * 2 + (rank.tokenBonus || 0);
                        return (
                          <div>
                            <div style={{fontSize:'12px', color:'#64748b', marginBottom:'8px'}}>
                              预计收入: <b style={{color:'#f59e0b'}}>{incomeTotal.toLocaleString()} 金币</b>{taxMultPrev > 1 || allMultPrev > 1 ? <span style={{fontSize:'10px', color:'#22c55e'}}> (含军衔加成)</span> : null} + <b style={{color: myFaction.color}}>{tokenIncome} 令牌</b>{rank.tokenBonus ? <span style={{fontSize:'10px', color:'#64748b'}}> (含军衔+{rank.tokenBonus})</span> : null}
                            </div>
                            <button onClick={() => {
                              const today = getLocalDateStr();
                              const lockKey = `daily-income:${today}`;
                              if (kingdomActionLocksRef.current.has(lockKey)) return;
                              kingdomActionLocksRef.current.add(lockKey);
                              try {
                              const currentKw = resetKingdomDailyCounts(kingdomWarRef.current);
                              if (!currentKw?.faction || currentKw.dailyCounts?.income) { showMapToast('✅', '提示', '今日已领取！', 2000); return; }
                              const currentTerrCount = getFactionTerritoryCount(currentKw.faction, currentKw.territories || {});
                              const currentRank = getMilitaryRank(currentKw.warContribution || 0, buildRankStats(currentKw));
                              const perkFx = getRankPerkEffects(currentKw);
                              const taxMult = perkFx.territoryIncomeMult || 1;
                              const allMult = perkFx.allBonusMult || 1;
                              const base = Math.min(currentTerrCount, 12) * 400;
                              const total = Math.floor(Math.min((Math.floor(base * currentRank.incomeMultiplier * taxMult) + (currentRank.salary || 0)) * allMult, 50000));
                              const tokens = currentTerrCount * 2 + (currentRank.tokenBonus || 0);
                              const nextKw = {
                                ...currentKw,
                                factionTokens: (currentKw.factionTokens || 0) + tokens,
                                dailyCounts: { ...(currentKw.dailyCounts || {}), income: true, resetDate: today },
                              };
                              kingdomWarRef.current = nextKw;
                              goldRef.current += total;
                              flushSync(() => { setGold(goldRef.current); setKingdomWar(nextKw); });
                              if (total > 0) updateAchStat({ totalGoldEarned: total });
                              showMapToast('✅', '领取成功', `${total.toLocaleString()} 金币 · 令牌 ${tokens}`, 2500);
                              } finally {
                                kingdomActionLocksRef.current.delete(lockKey);
                              }
                            }}
                            style={{
                              width:'100%', padding:'10px', borderRadius:'10px', border:'none', fontSize:'13px', fontWeight:'700',
                              background: canClaimIncome ? `linear-gradient(135deg, ${myFaction.color}, ${myFaction.lightColor})` : '#e2e8f0',
                              color: canClaimIncome ? '#fff' : '#94a3b8', cursor: canClaimIncome ? 'pointer' : 'not-allowed',
                            }}>
                              {canClaimIncome ? `领取 ${incomeTotal.toLocaleString()} 金币 + ${tokenIncome} 令牌` : '今日已领取'}
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 军衔信息 */}
                    <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b', marginBottom:'10px'}}>军衔进度</div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'6px'}}>
                        {MILITARY_RANKS.map(r => {
                          const isCurrentOrPast = (kw.warContribution || 0) >= r.minContribution;
                          const isCurrent = r.id === rank.id;
                          return (
                            <div key={r.id} style={{
                              padding:'8px', borderRadius:'10px', textAlign:'center',
                              background: isCurrent ? `${myFaction.color}15` : isCurrentOrPast ? '#f0fdf4' : '#f8fafc',
                              border: isCurrent ? `2px solid ${myFaction.color}` : '1px solid #e2e8f0',
                            }}>
                              <div style={{fontSize:'18px'}}>{r.icon}</div>
                              <div style={{fontSize:'11px', fontWeight: isCurrent ? '800' : '500', color: isCurrent ? myFaction.color : '#475569'}}>{r.name}</div>
                              <div style={{fontSize:'9px', color:'#64748b'}}>{r.minContribution}+</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 将领收集 */}
                {kwTab === 'generals' && (() => {
                  const recruited = kw.recruitedGenerals || [];
                  const totalBonus = recruited.reduce((acc, g) => {
                    if (g.bonus) Object.keys(g.bonus).forEach(k => { acc[k] = (acc[k]||0) + (g.bonus[k]||0); });
                    return acc;
                  }, {});
                  const bonusLabels = {gold:'金币',exp:'经验',contrib:'贡献',territory:'领地防御',trade:'商队收入',recruit:'招募减免'};
                  return (
                    <div style={{display:'grid', gap:'12px'}}>
                      <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                        <div style={{fontSize:'14px', fontWeight:'700', color:'#1e293b', marginBottom:'4px'}}>⚔️ 麾下将领 ({recruited.length}/{rank.maxGenerals || MAX_RECRUITED_GENERALS})</div>
                        <div style={{fontSize:'11px', color:'#64748b', marginBottom:'10px'}}>在野外遭遇历代多势力名将，击败后可花费金币招募。原属不限制玩家延揽；将领提供奖励加成，不直接修改精灵战斗属性。</div>
                        {Object.keys(totalBonus).filter(k => totalBonus[k] > 0).length > 0 && (
                          <div style={{display:'flex', flexWrap:'wrap', gap:'6px', padding:'8px 10px', background:'#f8fafc', borderRadius:'10px', border:'1px solid #e2e8f0'}}>
                            <span style={{fontSize:'10px', color:'#64748b', fontWeight:'600'}}>总加成:</span>
                            {Object.entries(totalBonus).filter(([,v]) => v > 0).map(([k,v]) => (
                              <span key={k} style={{fontSize:'10px', fontWeight:'700', color:myFaction.color, background:myFaction.color+'10', padding:'2px 6px', borderRadius:'4px'}}>{bonusLabels[k]||k}{formatGeneralBonusChip(k, v)}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {recruited.length === 0 ? (
                        <div style={{textAlign:'center', padding:'30px', color:'#64748b'}}>
                          <div style={{fontSize:'40px', marginBottom:'10px'}}>⚔️</div>
                          <div style={{fontSize:'13px'}}>尚未招募任何将领</div>
                          <div style={{fontSize:'11px', marginTop:'4px', color:'#64748b'}}>在野外地图探索时有机会遭遇各历史势力名将</div>
                        </div>
                      ) : (
                        <div style={{display:'grid', gap:'8px'}}>
                          {recruited.map((gen, i) => {
                            const rc = GENERAL_RARITY_CONFIG[gen.rarity] || {};
                            const fData = gen.faction !== 'neutral' ? FACTIONS[gen.faction] : null;
                            const portrait = getGeneralPortrait(gen);
                            return (
                              <div key={i} style={{background:'#fff', borderRadius:'12px', padding:'14px', boxShadow:'0 2px 6px rgba(0,0,0,0.04)', border:'1px solid #e2e8f0', borderLeft:`4px solid ${rc.color||'#ccc'}`}}>
                                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                  <div style={{
                                    width:'44px', height:'44px', borderRadius:'50%', background: portrait.bg,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    fontSize:'22px', fontWeight:'900', color: portrait.textColor,
                                    textShadow:'1px 1px 2px rgba(0,0,0,0.5)',
                                    border: `2px solid ${portrait.border}`,
                                    boxShadow: gen.rarity === 'SSR' ? `0 0 10px ${portrait.border}60` : 'none',
                                    flexShrink: 0, position:'relative', overflow:'hidden',
                                  }}>
                                    {renderGeneralPortraitFace(gen, portrait, portrait.surname)}
                                    <div style={{position:'absolute', bottom:-1, right:-1, fontSize:'8px', background:rc.bgColor||'#333', color:rc.color||'#999', padding:'0 3px', borderRadius:'3px', fontWeight:'800', border:`1px solid ${rc.color||'#666'}30`}}>{rc.label?.charAt(0)}</div>
                                  </div>
                                  <div style={{flex:1}}>
                                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                      <span style={{fontWeight:'800', fontSize:'14px', color:'#1e293b'}}>{gen.name}</span>
                                      <span style={{fontSize:'9px', fontWeight:'700', color:rc.color, background:rc.bgColor, padding:'1px 6px', borderRadius:'4px'}}>{rc.label}</span>
                                      <span style={{fontSize:'9px', color:fData?.color || '#64748b', fontWeight:'600'}}>{fData?.icon || '📜'}{gen.historicalFaction || fData?.name || '汉末群雄'}</span>
                                    </div>
                                    <div style={{fontSize:'11px', color:'#64748b', marginTop:'2px'}}>{gen.title}</div>
                                  </div>
                                  <button onClick={() => {
                                    setConfirmModal({ title:'⚔️ 遣散确认', msg:'确定要遣散将领【'+gen.name+'】吗？\n遣散后可重新在野外遭遇并招募。', onOk: () => {
                                      setKingdomWar(prev => ({...prev, recruitedGenerals: (prev.recruitedGenerals||[]).filter(g => g.id !== gen.id)}));
                                    }});
                                  }} style={{background:'#fef2f2', border:'1px solid #fecaca', color:'#ef4444', fontSize:'10px', padding:'4px 8px', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>遣散</button>
                                </div>
                                <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'8px'}}>
                                  {Object.entries(gen.bonus||{}).filter(([,v]) => v > 0).map(([k,v]) => (
                                    <span key={k} style={{fontSize:'9px', padding:'2px 6px', borderRadius:'4px', background:'#f1f5f9', color:'#475569', fontWeight:'600'}}>{bonusLabels[k]||k}{formatGeneralBonusChip(k, v)}</span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* 名将图鉴 — 完整系统 */}
                      <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                        {(() => {
                          const recruitedIds = new Set(recruited.map(g => g.id));
                          const factionNames = { all:'全部', ...Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(id => [id, GENERAL_ROSTER_FACTIONS[id].shortName])) };
                          const factionColors = Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(id => [id, GENERAL_ROSTER_FACTIONS[id].color]));
                          const rarityNames = { all:'全部', SSR:'SSR', SR:'SR', R:'R' };
                          const filteredGens = SANGUO_GENERALS.filter(g => {
                            if (genDexFilter.faction !== 'all' && g.rosterFaction !== genDexFilter.faction) return false;
                            if (genDexFilter.rarity !== 'all' && g.rarity !== genDexFilter.rarity) return false;
                            if (genDexFilter.search && !g.name.includes(genDexFilter.search) && !g.title.includes(genDexFilter.search) && !g.historicalFaction.includes(genDexFilter.search)) return false;
                            return true;
                          });
                          const totalRecruited = SANGUO_GENERALS.filter(g => recruitedIds.has(g.id)).length;
                          const filteredRecruited = filteredGens.filter(g => recruitedIds.has(g.id)).length;
                          const factionStats = GENERAL_ROSTER_FACTION_IDS.map(f => {
                            const all = SANGUO_GENERALS.filter(g => g.rosterFaction === f);
                            const got = all.filter(g => recruitedIds.has(g.id));
                            return { f, total: all.length, got: got.length };
                          });
                          return (
                            <div>
                              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px'}}>
                                <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b'}}>📖 多势力名将图鉴</div>
                                <div style={{fontSize:'11px', color:'#64748b', fontWeight:'600'}}>{totalRecruited}/{SANGUO_GENERALS.length} 已收集</div>
                              </div>
                              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(66px, 1fr))', gap:'4px', marginBottom:'10px', background:'#f1f5f9', borderRadius:'8px', padding:'3px'}}>
                                {factionStats.map(({f, total, got}) => (
                                  <div key={f} style={{textAlign:'center', padding:'8px 4px', borderRadius:'6px', cursor:'pointer',
                                    background: genDexFilter.faction === f ? '#fff' : 'transparent',
                                    border: genDexFilter.faction === f ? '1px solid #e2e8f0' : '1px solid transparent',
                                    boxShadow: genDexFilter.faction === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                  }} onClick={() => setGenDexFilter(p => ({...p, faction: p.faction === f ? 'all' : f}))}>
                                    <div style={{fontSize:'10px', fontWeight:'700', color: factionColors[f]||'#666'}}>{factionNames[f]}</div>
                                    <div style={{fontSize:'9px', color:'#64748b', marginTop:'1px'}}>{got}/{total}</div>
                                  </div>
                                ))}
                              </div>
                              <div style={{display:'flex', gap:'6px', marginBottom:'10px', alignItems:'center'}}>
                                <div style={{display:'flex', gap:'3px'}}>
                                  {['all','SSR','SR','R'].map(r => (
                                    <button key={r} onClick={() => setGenDexFilter(p => ({...p, rarity: r}))}
                                      style={{fontSize:'9px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px', border:'1px solid', cursor:'pointer',
                                        background: genDexFilter.rarity === r ? (GENERAL_RARITY_CONFIG[r]?.bgColor||'#1e293b') : '#f8fafc',
                                        color: genDexFilter.rarity === r ? (GENERAL_RARITY_CONFIG[r]?.color||'#fff') : '#64748b',
                                        borderColor: genDexFilter.rarity === r ? (GENERAL_RARITY_CONFIG[r]?.color||'#1e293b') : '#e2e8f0',
                                      }}>{rarityNames[r]}</button>
                                  ))}
                                </div>
                                <input type="text" placeholder="搜索名将..." value={genDexFilter.search}
                                  onChange={e => setGenDexFilter(p => ({...p, search: e.target.value}))}
                                  style={{flex:1, fontSize:'11px', padding:'4px 8px', borderRadius:'6px', border:'1px solid #e2e8f0', outline:'none'}} />
                              </div>
                              <div style={{background:'linear-gradient(135deg, #f8fafc, #e2e8f0)', borderRadius:'10px', padding:'8px', marginBottom:'10px'}}>
                                <div style={{display:'flex', gap:'3px', justifyContent:'center'}}>
                                  {Array.from({length: 20}, (_, i) => {
                                    const pct = totalRecruited / SANGUO_GENERALS.length;
                                    const filled = i < Math.floor(pct * 20);
                                    return <div key={i} style={{width:'12px', height:'6px', borderRadius:'2px', background: filled ? myFaction.color : '#d1d5db'}} />;
                                  })}
                                </div>
                                <div style={{textAlign:'center', fontSize:'10px', color:'#64748b', marginTop:'4px', fontWeight:'600'}}>{Math.floor(totalRecruited/SANGUO_GENERALS.length*100)}% 收集进度</div>
                              </div>
                              <div style={{fontSize:'10px', color:'#64748b', marginBottom:'6px', fontWeight:'600'}}>
                                显示 {filteredGens.length} 位名将 {genDexFilter.faction !== 'all' || genDexFilter.rarity !== 'all' || genDexFilter.search ? `(已收集 ${filteredRecruited})` : ''}
                              </div>
                              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(90px, 1fr))', gap:'6px', maxHeight:'400px', overflowY:'auto'}}>
                                {filteredGens.map(gen => {
                                  const isR = recruitedIds.has(gen.id);
                                  const rc = GENERAL_RARITY_CONFIG[gen.rarity] || {};
                                  const pt = getGeneralPortrait(gen);
                                  return (
                                    <div key={gen.id} onClick={() => isR && setGenDexDetail(gen)} style={{
                                      textAlign:'center', padding:'8px 4px', borderRadius:'10px', cursor: isR ? 'pointer' : 'default',
                                      background: isR ? '#fff' : '#f8fafc', border:`1px solid ${isR ? rc.color+'30' : '#e2e8f0'}`,
                                      opacity: isR ? 1 : 0.35, transition:'all 0.2s',
                                    }}>
                                      <div style={{
                                        width:'36px', height:'36px', borderRadius:'50%', margin:'0 auto',
                                        background: isR ? pt.bg : '#d1d5db',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        fontSize:'18px', fontWeight:'900', color: isR ? pt.textColor : '#9ca3af',
                                        textShadow: isR ? '1px 1px 2px rgba(0,0,0,0.4)' : 'none',
                                        border: `2px solid ${isR ? pt.border : '#ccc'}`,
                                        boxShadow: isR && gen.rarity === 'SSR' ? `0 0 8px ${pt.border}60` : 'none',
                                        position:'relative', overflow:'hidden',
                                      }}>
                                        {renderGeneralPortraitFace(gen, pt, isR ? pt.surname : '?', isR)}
                                        <div style={{position:'absolute', bottom:-2, right:-2, fontSize:'9px', background:rc.bgColor||'#333', color:rc.color||'#999', padding:'0 2px', borderRadius:'3px', fontWeight:'800', lineHeight:'1.3'}}>{rc.label?.charAt(0)}</div>
                                      </div>
                                      <div style={{fontSize:'10px', fontWeight:'700', color: isR ? '#1e293b' : '#64748b', marginTop:'4px'}}>{isR ? gen.name : '???'}</div>
                                      <div style={{fontSize:'9px', color: isR ? '#64748b' : '#94a3b8', marginTop:'1px'}}>{isR ? gen.title : '—'}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })()}

                {/* 战役副本 */}
                {kwTab === 'campaigns' && (
                  <div>
                    <div style={{fontSize:'14px', fontWeight:'700', color:'#1e293b', marginBottom:'12px'}}>⚔️ {myFaction.fullName} · 历史战役</div>
                    <div style={{fontSize:'11px', color:'#64748b', marginBottom:'16px'}}>与历代名将并肩作战！通关战役可获得大量战功、令牌和金币。</div>
                    <div style={{display:'grid', gap:'12px'}}>
                      {[...KINGDOM_CAMPAIGNS, ...JIN_CAMPAIGNS].filter(c => c.faction === kw.faction).map(campaign => {
                        const isCompleted = (kw.completedCampaigns || []).includes(campaign.id);
                        const avgLv = party.length > 0 ? Math.floor(party.reduce((s,p) => s + p.level, 0) / party.length) : 1;
                        const tooWeak = avgLv < campaign.lvl - 15;
                        return (
                          <div key={campaign.id} style={{
                            background: campaign.bg, borderRadius:'14px', padding:'16px', color:'#fff',
                            opacity: tooWeak ? 0.6 : 1, position:'relative', overflow:'hidden',
                            boxShadow:'0 4px 15px rgba(0,0,0,0.3)',
                          }}>
                            {isCompleted && <div style={{position:'absolute', top:'8px', right:'8px', background:'rgba(76,175,80,0.9)', padding:'2px 8px', borderRadius:'8px', fontSize:'10px', fontWeight:'700'}}>✅ 已通关</div>}
                            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                              <span style={{fontSize:'28px'}}>{campaign.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontSize:'16px', fontWeight:'800'}}>{campaign.name}</div>
                                <div style={{fontSize:'11px', opacity:0.85}}>推荐等级 Lv.{campaign.lvl} · {campaign.teamSize}v6</div>
                              </div>
                            </div>
                            <div style={{fontSize:'12px', opacity:0.9, marginBottom:'8px', lineHeight:'1.5'}}>{campaign.desc}</div>
                            <div style={{fontSize:'11px', opacity:0.75, fontStyle:'italic', marginBottom:'10px', borderLeft:'2px solid rgba(255,255,255,0.3)', paddingLeft:'8px'}}>{campaign.lore}</div>
                            <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px'}}>
                              <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px', fontSize:'10px'}}>💰 {campaign.reward.gold.toLocaleString()}</span>
                              <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px', fontSize:'10px'}}>🎖️ {campaign.reward.tokens} 令牌</span>
                              <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 8px', borderRadius:'6px', fontSize:'10px'}}>⭐ {campaign.reward.contribution} 战功</span>
                            </div>
                            <button
                              disabled={tooWeak}
                              onClick={() => {
                                if (party.length < 1) { showMapToast('👥', '队伍', '至少需要1只精灵才能战斗！', 1500); return; }
                                startBattle({ ...campaign, campaignData: campaign }, 'kw_campaign');
                              }}
                              style={{
                                width:'100%', padding:'10px', background: tooWeak ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
                                border:'1px solid rgba(255,255,255,0.3)', borderRadius:'10px', color:'#fff',
                                fontSize:'13px', fontWeight:'700', cursor: tooWeak ? 'not-allowed' : 'pointer',
                                transition:'all 0.2s',
                              }}
                              onMouseOver={e => { if (!tooWeak) e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
                              onMouseOut={e => { if (!tooWeak) e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                            >
                              {tooWeak ? `等级不足 (推荐Lv.${campaign.lvl})` : isCompleted ? '🔁 再次挑战' : '⚔️ 出征！'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 历史名战 */}
                {kwTab === 'history' && (() => {
                  const completed = kw.completedHistoricalBattles || [];
                  const avgLv = party.length > 0 ? Math.floor(party.reduce((s,p) => s + p.level, 0) / party.length) : 1;
                  return (
                    <div>
                      <div style={{background:'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius:'14px', padding:'16px', color:'#fff', marginBottom:'14px', position:'relative', overflow:'hidden'}}>
                        <div style={{position:'absolute', top:0, right:0, bottom:0, width:'40%', background:'linear-gradient(90deg, transparent, rgba(255,215,0,0.05))'}} />
                        <div style={{fontSize:'18px', fontWeight:'800', marginBottom:'4px'}}>📜 三国名战录</div>
                        <div style={{fontSize:'12px', opacity:0.8, marginBottom:'8px'}}>纵横三国，重现经典战役。多波次首领连战，HP延续，策略为王！</div>
                        <div style={{display:'flex', gap:'10px', fontSize:'11px'}}>
                          <span style={{background:'rgba(255,215,0,0.15)', padding:'3px 10px', borderRadius:'8px', color:'#FFD700'}}>已通关 {completed.length}/{HISTORICAL_BATTLES.length}</span>
                          <span style={{background:'rgba(100,181,246,0.15)', padding:'3px 10px', borderRadius:'8px', color:'#64B5F6'}}>队伍 Lv.{avgLv}</span>
                        </div>
                      </div>
                      {HISTORICAL_BATTLE_ERAS.map(era => {
                        const eraBattles = getHistoricalBattlesByEra(era.id);
                        const eraCompleted = eraBattles.filter(b => completed.includes(b.id)).length;
                        const prevEra = HISTORICAL_BATTLE_ERAS[HISTORICAL_BATTLE_ERAS.indexOf(era) - 1];
                        const prevEraBattles = prevEra ? getHistoricalBattlesByEra(prevEra.id) : [];
                        const prevEraCompleted = prevEraBattles.filter(b => completed.includes(b.id)).length;
                        const eraUnlocked = !prevEra || prevEraCompleted >= 3;
                        return (
                          <div key={era.id} style={{marginBottom:'16px'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px', padding:'8px 12px', background: eraUnlocked ? 'linear-gradient(90deg, rgba(255,215,0,0.08), transparent)' : '#f5f5f5', borderRadius:'10px', border:'1px solid '+(eraUnlocked ? 'rgba(255,215,0,0.2)' : '#e0e0e0')}}>
                              <span style={{fontSize:'22px'}}>{era.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontSize:'14px', fontWeight:'700', color: eraUnlocked ? '#1e293b' : '#999'}}>{era.name}</div>
                                <div style={{fontSize:'10px', color:'#64748b'}}>{era.desc} · Lv.{era.lvRange[0]}-{era.lvRange[1]}</div>
                              </div>
                              <div style={{fontSize:'11px', fontWeight:'700', color: eraCompleted === eraBattles.length ? '#4caf50' : '#f59e0b'}}>{eraCompleted}/{eraBattles.length}</div>
                            </div>
                            {!eraUnlocked ? (
                              <div style={{textAlign:'center', padding:'16px', color:'#999', fontSize:'12px', background:'#fafafa', borderRadius:'10px', border:'1px dashed #ddd'}}>🔒 需通关上一时代至少3场战役</div>
                            ) : (
                              <div style={{display:'grid', gap:'10px'}}>
                                {eraBattles.map(hb => {
                                  const isCleared = completed.includes(hb.id);
                                  const isLocked = hb.unlockReq && !completed.includes(hb.unlockReq);
                                  const tooWeak = avgLv < hb.lvl - 15;
                                  const disabled = isLocked || tooWeak;
                                  return (
                                    <div key={hb.id} style={{
                                      background: hb.bg, borderRadius:'12px', padding:'14px', color:'#fff',
                                      opacity: disabled ? 0.55 : 1, position:'relative', overflow:'hidden',
                                      boxShadow:'0 3px 12px rgba(0,0,0,0.25)', transition:'transform 0.2s',
                                    }}>
                                      {isCleared && <div style={{position:'absolute', top:'6px', right:'8px', background:'rgba(76,175,80,0.9)', padding:'2px 8px', borderRadius:'6px', fontSize:'9px', fontWeight:'700'}}>✅ 已通关</div>}
                                      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                                        <span style={{fontSize:'24px'}}>{hb.icon}</span>
                                        <div style={{flex:1}}>
                                          <div style={{fontSize:'14px', fontWeight:'800'}}>{hb.name}</div>
                                          <div style={{fontSize:'10px', opacity:0.85}}>Lv.{hb.lvl} · {hb.waves.length}波 · {'⭐'.repeat(hb.difficulty)}</div>
                                        </div>
                                      </div>
                                      <div style={{fontSize:'12px', opacity:0.9, marginBottom:'4px', fontWeight:'600'}}>{hb.desc}</div>
                                      <div style={{fontSize:'10px', opacity:0.7, marginBottom:'8px', fontStyle:'italic', borderLeft:'2px solid rgba(255,255,255,0.3)', paddingLeft:'6px', lineHeight:'1.4'}}>{hb.lore}</div>
                                      <div style={{display:'flex', gap:'4px', flexWrap:'wrap', marginBottom:'8px', alignItems:'center'}}>
                                        <span style={{fontSize:'9px', opacity:0.7, marginRight:'2px'}}>参战将领:</span>
                                        {hb.waves.flatMap(w => w.generalIds).filter((v,i,a) => a.indexOf(v) === i).map(gid => {
                                          const gen = getGeneralById(gid);
                                          if (!gen) return null;
                                          const portrait = getGeneralPortrait(gen);
                                          return (
                                            <div key={gid} title={`${gen.name} · ${gen.title}`} style={{
                                              width:'24px', height:'24px', borderRadius:'50%', background: portrait.bg,
                                              border: `1.5px solid ${portrait.border}`, display:'flex', alignItems:'center', justifyContent:'center',
                                              fontSize:'12px', fontWeight:'900', color: portrait.textColor,
                                              textShadow:'1px 1px 1px rgba(0,0,0,0.4)',
                                              overflow:'hidden',
                                            }}>{renderGeneralPortraitFace(gen, portrait, portrait.surname)}</div>
                                          );
                                        })}
                                      </div>
                                      <div style={{display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'8px'}}>
                                        <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 6px', borderRadius:'5px', fontSize:'9px'}}>💰 {hb.reward.gold.toLocaleString()}</span>
                                        <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 6px', borderRadius:'5px', fontSize:'9px'}}>🎖️ {hb.reward.tokens}</span>
                                        <span style={{background:'rgba(255,255,255,0.2)', padding:'2px 6px', borderRadius:'5px', fontSize:'9px'}}>⭐ +{hb.reward.contribution}</span>
                                        {isCleared && <span style={{background:'rgba(255,255,255,0.15)', padding:'2px 6px', borderRadius:'5px', fontSize:'9px', opacity:0.7}}>重复30%</span>}
                                      </div>
                                      <button
                                        disabled={disabled}
                                        onClick={() => {
                                          if (party.length < 1) { showMapToast('ℹ️', '提示', '至少需要1只精灵！', 2000); return; }
                                          setConfirmModal({ title:'📜 历史名战', msg:`${hb.name}\n\n${hb.lore}\n\n推荐等级: Lv.${hb.lvl} | 共${hb.waves.length}波\nHP在波次间延续，请备好回复道具！\n\n${isCleared ? '(重复挑战奖励为30%)' : ''}\n\n是否出征？`, onOk: () => {
                                            startBattle(
                                              MAPS.find(m => m.id === currentMapId) || MAPS[0],
                                              'historical_battle',
                                              { hbData: hb, waveIdx: 0 }
                                            );
                                          }});
                                        }}
                                        style={{
                                          width:'100%', padding:'8px', background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
                                          border:'1px solid rgba(255,255,255,0.25)', borderRadius:'8px', color:'#fff',
                                          fontSize:'12px', fontWeight:'700', cursor: disabled ? 'not-allowed' : 'pointer', transition:'all 0.2s',
                                        }}
                                        onMouseOver={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
                                        onMouseOut={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                                      >
                                        {isLocked ? `🔒 需先通关 ${HISTORICAL_BATTLES.find(b=>b.id===hb.unlockReq)?.name || '前置战役'}` : tooWeak ? `等级不足 (推荐Lv.${hb.lvl})` : isCleared ? '🔁 再次挑战' : '⚔️ 出征！'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* 都城 */}
                {/* 争夺城池：兵力攻城 + 六兵种克制 + 群雄争夺条 */}
                {kwTab === 'contested' && (() => {
                  const contestedMaps = MAPS.filter(m => m.isContested);
                  const contestData = kw.contestProgress || {};
                  const today = getLocalDateStr();
                  const maxDailyAttempts = 3;
                  const rankIdx = Math.max(0, MILITARY_RANKS.findIndex(r => r.id === (kw.militaryRank || 'civilian')));
                  const reserve = Math.min(MANPOWER_RESERVE_CAP, Math.max(0, kw.kwManpowerReserve || 0));
                  return (
                    <>
                    <div style={{display:'grid', gap:'12px'}}>
                      <div style={{background:'linear-gradient(135deg, #FFD700, #FF8F00)', borderRadius:'14px', padding:'16px', color:'#fff'}}>
                        <div style={{fontSize:'16px', fontWeight:'800', marginBottom:'6px'}}>🏰 天下争夺战</div>
                        <div style={{fontSize:'12px', opacity:0.9, lineHeight:1.55}}>
                          在国战地图上击败训练家或敌国训练师只会获得预备兵；名城需通过多轮攻城把本阵营占领积分推进到 {CONTEST_CAPTURE_THRESHOLD}，单场胜利不会直接易主。<br/>
                          当前预备兵：{reserve} / {MANPOWER_RESERVE_CAP} · 最低出征 {CONTEST_SIEGE_MIN_DEPLOY} · 单次可调上限随军衔提升。
                        </div>
                      </div>
                      {contestedMaps.map(cm => {
                        const territory = kw.territories[cm.id];
                        const owner = territory?.owner || 'neutral';
                        const ownerF = FACTIONS[owner] || { icon: '⚪', name: '中立', color: '#78909C' };
                        const isOurs = owner === kw.faction;
                        const progress = getContestMapProgress(contestData, cm.id);
                        const totalPts = Math.max(1, CONTEST_BAR_IDS.reduce((s, k) => s + (progress[k] || 0), 0));
                        const dailyAttempts = contestData[`${cm.id}_attempts_${today}`] || 0;
                        const canChallenge = dailyAttempts < maxDailyAttempts;
                        const deployCap = Math.min(reserve, 380 + Math.max(0, rankIdx) * 72);
                        return (
                          <div key={cm.id} style={{background:'#fff', borderRadius:'14px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
                            <div style={{
                              background: isOurs ? `linear-gradient(135deg, ${myFaction.color}, ${myFaction.darkColor})`
                                : owner !== 'neutral' ? `linear-gradient(135deg, ${ownerF?.color || '#666'}, ${ownerF?.darkColor || '#333'})`
                                : 'linear-gradient(135deg, #78909C, #546E7A)',
                              padding:'14px 16px', color:'#fff',
                            }}>
                              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <span style={{fontSize:'28px'}}>{cm.icon}</span>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:'15px', fontWeight:'800'}}>{cm.name}</div>
                                  <div style={{fontSize:'11px', opacity:0.85}}>{cm.desc}</div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                  <div style={{fontSize:'12px', fontWeight:'700'}}>{owner === 'neutral' ? '⚪ 中立' : `${ownerF?.icon} ${ownerF?.name}`}</div>
                                  <div style={{fontSize:'10px', opacity:0.7}}>Lv.{cm.lvl[0]}-{cm.lvl[1]}</div>
                                </div>
                              </div>
                            </div>
                            <div style={{padding:'14px 16px'}}>
                              <div style={{fontSize:'12px', fontWeight:'600', color:'#1e293b', marginBottom:'8px'}}>占领态势（魏·蜀·吴·晋·群雄）</div>
                              <div style={{display:'flex', borderRadius:'6px', overflow:'hidden', height:'20px', background:'#e2e8f0', marginBottom:'8px'}}>
                                {CONTEST_BAR_IDS.map(fid => {
                                  const pts = progress[fid] || 0;
                                  const pct = totalPts > 0 ? (pts / totalPts) * 100 : 0;
                                  if (pct < 0.1) return null;
                                  return <div key={fid} style={{width:`${pct}%`, background:FACTIONS[fid]?.color || '#999', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'#fff', fontWeight:'700', minWidth: pct > 5 ? '0' : '18px'}}>{pts}</div>;
                                })}
                              </div>
                              <div style={{display:'flex', flexWrap:'wrap', gap:'8px', justifyContent:'space-between', marginBottom:'10px'}}>
                                {CONTEST_BAR_IDS.map(fid => (
                                  <div key={fid} style={{textAlign:'center', fontSize:'10px', color: fid === kw.faction ? FACTIONS[fid].color : '#64748b', minWidth:'64px'}}>
                                    {FACTIONS[fid]?.icon} {FACTIONS[fid]?.name}: {progress[fid] || 0}
                                  </div>
                                ))}
                              </div>
                              <div style={{background:'#f8fafc', borderRadius:'8px', padding:'8px 10px', fontSize:'11px', color:'#475569', marginBottom:'10px'}}>
                                {cm.contestBonus?.gold > 0 && <span>💰 金币 +{cm.contestBonus.gold}%　</span>}
                                {cm.contestBonus?.exp > 0 && <span>⭐ 经验 +{cm.contestBonus.exp}%　</span>}
                                {cm.contestBonus?.catchRate > 0 && <span>🎯 捕捉率 +{cm.contestBonus.catchRate}%　</span>}
                                {cm.contestBonus?.contribution && <span>🎖️ 战功 +{cm.contestBonus.contribution}%</span>}
                              </div>
                              <button onClick={() => {
                                if (!kw.faction) { showMapToast('❌', '提示', '请先加入国战阵营。', 1800); return; }
                                const attackPermission = canFactionAttack(kw.politics, kw.faction, owner);
                                if (!attackPermission.ok) { showMapToast('🤝', '盟约生效', attackPermission.reason, 2400); return; }
                                if (!canChallenge) { showMapToast('❌', '提示', '今日攻城次数已用完 (每日3次)', 1500); return; }
                                if (deployCap < CONTEST_SIEGE_MIN_DEPLOY) { showMapToast('❌', '兵力不足', `预备兵至少 ${CONTEST_SIEGE_MIN_DEPLOY} 才可攻城，请先征兵整备。`, 2500); return; }
                                const base = Math.floor(deployCap / 6);
                                const rem = deployCap - base * 6;
                                const allocation = {};
                                KW_TROOP_IDS.forEach((tid, i) => { allocation[tid] = base + (i < rem ? 1 : 0); });
                                setKwSiegeModal({ contestMap: cm, allocation, generalIds: [], deployCap });
                              }} style={{
                                color:'#fff', border:'none', borderRadius:'20px', cursor:'pointer', fontWeight:'bold',
                                width:'100%', fontSize:'13px', padding:'10px 0',
                                background: canChallenge && deployCap >= CONTEST_SIEGE_MIN_DEPLOY ? myFaction.color : '#94a3b8', opacity: canChallenge ? 1 : 0.6,
                              }}>
                                🏯 武将带兵攻城 ({dailyAttempts}/{maxDailyAttempts}) · 可调 {deployCap} 兵
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {kwSiegeModal && kwSiegeModal.contestMap && (
                      <div style={{ position:'fixed', inset:0, zIndex:4000, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }} onClick={() => setKwSiegeModal(null)}>
                        <div style={{ background:'#fff', borderRadius:'16px', maxWidth:'420px', width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 12px 40px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                          <div style={{ padding:'16px', borderBottom:'1px solid #e2e8f0' }}>
                            <div style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a' }}>⚔️ {kwSiegeModal.contestMap.name} · 攻城配置</div>
                            <div style={{ fontSize:'11px', color:'#64748b', marginTop:'6px' }}>六兵种环形克制：盾→枪→骑→弓→器→奇→盾。可分配 <strong>{CONTEST_SIEGE_MIN_DEPLOY}-{kwSiegeModal.deployCap}</strong> 单位兵力，并最多选择 3 名已招募武将提升统率。</div>
                          </div>
                          <div style={{ padding:'14px 16px' }}>
                            {KW_TROOP_TYPES.map(tt => (
                              <div key={tt.id} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                                <span style={{ fontSize:'20px', width:'32px' }}>{tt.icon}</span>
                                <div style={{ flex:1, fontSize:'12px' }}>
                                  <div style={{ fontWeight:'700', color:'#1e293b' }}>{tt.name}</div>
                                  <div style={{ fontSize:'10px', color:'#64748b' }}>{tt.desc}</div>
                                </div>
                                <input type="number" min={0} max={kwSiegeModal.deployCap}
                                  value={kwSiegeModal.allocation[tt.id] ?? 0}
                                  onChange={e => {
                                    const v = Math.max(0, Math.min(kwSiegeModal.deployCap, parseInt(e.target.value, 10) || 0));
                                    setKwSiegeModal(prev => prev ? { ...prev, allocation: { ...prev.allocation, [tt.id]: v } } : prev);
                                  }}
                                  style={{ width:'64px', padding:'6px', borderRadius:'8px', border:'1px solid #cbd5e1', fontSize:'13px' }}
                                />
                              </div>
                            ))}
	                        <div style={{ fontSize:'11px', color:'#475569', margin:'10px 0' }}>
	                          已分配 {KW_TROOP_IDS.reduce((s, tid) => s + (kwSiegeModal.allocation[tid] || 0), 0)} / 上限 {kwSiegeModal.deployCap}
	                          <button type="button" onClick={() => {
	                            const total = Math.min(kwSiegeModal.deployCap, CONTEST_SIEGE_MIN_DEPLOY);
	                            const b = Math.floor(total / 6);
	                            const r = total - b * 6;
	                            const allocation = {};
	                            KW_TROOP_IDS.forEach((tid, i) => { allocation[tid] = b + (i < r ? 1 : 0); });
	                            setKwSiegeModal(prev => prev ? { ...prev, allocation } : prev);
	                          }} style={{ marginLeft:'10px', padding:'4px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #94a3b8', background:'#fff', cursor:'pointer' }}>最低出征</button>
	                          <button type="button" onClick={() => {
                                const cap = kwSiegeModal.deployCap;
                                const b = Math.floor(cap / 6);
                                const r = cap - b * 6;
                                const allocation = {};
                                KW_TROOP_IDS.forEach((tid, i) => { allocation[tid] = b + (i < r ? 1 : 0); });
	                                setKwSiegeModal(prev => prev ? { ...prev, allocation } : prev);
	                              }} style={{ marginLeft:'6px', padding:'4px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #94a3b8', background:'#f8fafc', cursor:'pointer' }}>均分上限</button>
	                            </div>
	                            {(() => {
	                              const avgLv = party.length ? Math.floor(party.reduce((s, p) => s + (p?.level || 1), 0) / party.length) : 50;
	                              const preview = evaluateKwSiegeBattle({
	                                mapId: kwSiegeModal.contestMap.id,
	                                playerFaction: kingdomWar?.faction,
	                                allocation: kwSiegeModal.allocation,
	                                generalIds: kwSiegeModal.generalIds || [],
	                                recruitedGenerals: kingdomWar?.recruitedGenerals || [],
	                                mapProgress: getContestMapProgress(kingdomWar?.contestProgress, kwSiegeModal.contestMap.id),
	                                mapLvlMin: kwSiegeModal.contestMap.lvl[0],
	                                mapLvlMax: kwSiegeModal.contestMap.lvl[1],
	                                avgPartyLevel: avgLv,
	                                attackPowerMult: kingdomWar?.attackBuff ? TIGER_SEAL_ATTACK_MULT : 1,
	                              });
	                              const domF = FACTIONS[preview.dominantFaction] || { name: '守军', icon: '🏴' };
	                              return (
	                                <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'10px', marginBottom:'12px'}}>
	                                  <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'6px', marginBottom:'8px'}}>
	                                    {[
	                                      ['破城率', `${Math.round((preview.winChance || 0) * 100)}%`],
	                                      ['风险', preview.riskLabel || '未知'],
	                                      ['战损', `约${preview.expectedLoss || 0}`],
	                                      ['占领', `+${preview.expectedOccupationGain || 0}`],
	                                    ].map(([k, v]) => (
	                                      <div key={k} style={{background:'#fff', borderRadius:'8px', padding:'7px 6px', textAlign:'center'}}>
	                                        <div style={{fontSize:'10px', color:'#64748b'}}>{k}</div>
	                                        <div style={{fontSize:'13px', color:'#0f172a', fontWeight:'800', marginTop:'2px'}}>{v}</div>
	                                      </div>
	                                    ))}
	                                  </div>
	                                  <div style={{fontSize:'11px', color:'#475569', lineHeight:1.55}}>
	                                    主守势力：{domF.icon} {domF.name} · 克制倍率 {(preview.counter || 1).toFixed(2)} · 统率倍率 {(preview.leadership || 1).toFixed(2)}
	                                  </div>
	                                  {(preview.attackPowerMult || 1) > 1 && <div style={{fontSize:'11px', color:'#b45309', fontWeight:'800', marginTop:'6px'}}>🐯 虎符生效：本次攻击力 +{Math.round(((preview.attackPowerMult || 1) - 1) * 100)}%，发动后消耗</div>}
	                                  <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
	                                    {(preview.advice || []).slice(0, 2).map((tip, i) => <span key={i} style={{fontSize:'10px', color:'#92400e', background:'#fef3c7', borderRadius:'999px', padding:'3px 8px'}}>{tip}</span>)}
	                                  </div>
	                                  <button type="button" onClick={() => setKwSiegeModal(prev => prev ? { ...prev, allocation: preview.suggestedAllocation || prev.allocation } : prev)} style={{marginTop:'8px', padding:'5px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #cbd5e1', background:'#fff', cursor:'pointer'}}>采用推荐配兵</button>
	                                </div>
	                              );
	                            })()}
	                            <div style={{ fontSize:'12px', fontWeight:'700', color:'#1e293b', marginBottom:'6px' }}>选择武将（最多3）</div>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' }}>
                              {(kw.recruitedGenerals || []).map(g => {
                                const on = (kwSiegeModal.generalIds || []).includes(g.id);
                                return (
                                  <button type="button" key={g.id} onClick={() => {
                                    setKwSiegeModal(prev => {
                                      if (!prev) return prev;
                                      const cur = [...(prev.generalIds || [])];
                                      const i = cur.indexOf(g.id);
                                      if (i >= 0) cur.splice(i, 1);
                                      else if (cur.length < 3) cur.push(g.id);
                                      return { ...prev, generalIds: cur };
                                    });
                                  }} style={{
                                    padding:'6px 10px', borderRadius:'999px', fontSize:'11px', border:`1px solid ${on ? myFaction.color : '#cbd5e1'}`,
                                    background: on ? `${myFaction.color}22` : '#fff', cursor:'pointer', fontWeight:on ? 800 : 500,
                                  }}>{g.name}</button>
                                );
                              })}
                            </div>
                            <button type="button" onClick={() => {
                              let acquiredLockKey = null;
                              try {
                              const currentKw = kingdomWarRef.current;
                              if (!currentKw?.faction) { showMapToast('❌', '提示', '未加入阵营，无法攻城。', 1800); return; }
	                              const m = kwSiegeModal.contestMap;
                              if (!m || !CONTESTED_SIEGE_MAP_IDS.includes(Number(m.id)) || !Array.isArray(m.lvl)) {
                                showMapToast('ℹ️', '目标已失效', '名城状态已变化，请重新选择攻城目标', 2200);
                                setKwSiegeModal(null);
	                                return;
	                              }
                              const currentContestOwner = currentKw.territories?.[m.id]?.owner || 'neutral';
                              const attackPermission = canFactionAttack(currentKw.politics, currentKw.faction, currentContestOwner);
                              if (!attackPermission.ok) { showMapToast('🤝', '盟约生效', attackPermission.reason, 2400); return; }
                              const lockKey = `siege:${m.id}`;
                              if (kingdomActionLocksRef.current.has(lockKey)) return;
                              const currentReserve = Math.min(MANPOWER_RESERVE_CAP, Math.max(0, currentKw.kwManpowerReserve || 0));
                              const deployment = validateSiegeDeployment({
                                allocation: kwSiegeModal.allocation,
                                maxDeploy: kwSiegeModal.deployCap,
                                reserve: currentReserve,
                                minDeploy: CONTEST_SIEGE_MIN_DEPLOY,
                              });
                              if (!deployment.ok) { showMapToast('❌', '分配有误', deployment.reason, 2200); return; }
                              const alloc = deployment.allocation;
                              const attemptKey = `${m.id}_attempts_${getLocalDateStr()}`;
                              if ((currentKw.contestProgress?.[attemptKey] || 0) >= maxDailyAttempts) { showMapToast('❌', '提示', `今日攻城次数已用完 (每日${maxDailyAttempts}次)`, 1800); return; }
                              const livingSiegeParty = (partyRef.current || []).filter(p => p && (p.currentHp || 0) > 0);
                              const avgLv = livingSiegeParty.length
                                ? Math.floor(livingSiegeParty.reduce((s, p) => s + (p.level || 1), 0) / livingSiegeParty.length)
                                : 50;
                              const genIds = [...new Set(kwSiegeModal.generalIds || [])].slice(0, 3);
                              const mapProgIn = getContestMapProgress(currentKw.contestProgress, m.id);
                              const latestPreview = evaluateKwSiegeBattle({
                                mapId: m.id,
                                playerFaction: currentKw.faction,
                                allocation: alloc,
                                generalIds: genIds,
                                recruitedGenerals: currentKw.recruitedGenerals || [],
                                mapProgress: mapProgIn,
	                                mapLvlMin: m.lvl[0],
	                                mapLvlMax: m.lvl[1],
	                                avgPartyLevel: avgLv,
	                                attackPowerMult: currentKw.attackBuff ? TIGER_SEAL_ATTACK_MULT : 1,
	                              });
                              if (!latestPreview.canAttack) {
                                showMapToast('❌', '无法攻城', latestPreview.reason || '当前配置无法发起攻城', 2200);
                                return;
                              }
                              kingdomActionLocksRef.current.add(lockKey);
                              acquiredLockKey = lockKey;
                              const siegeResult = runKwSiegeBattle({
                                mapId: m.id,
                                playerFaction: currentKw.faction,
                                allocation: alloc,
                                generalIds: genIds,
                                recruitedGenerals: currentKw.recruitedGenerals || [],
                                mapProgress: mapProgIn,
	                                mapLvlMin: m.lvl[0],
	                                mapLvlMax: m.lvl[1],
	                                avgPartyLevel: avgLv,
	                                attackPowerMult: currentKw.attackBuff ? TIGER_SEAL_ATTACK_MULT : 1,
	                              });
                              if (!siegeResult || typeof siegeResult.victory !== 'boolean') {
                                showMapToast('❌', '攻城异常', '请稍后再试。', 2000);
                                return;
                              }
                              const contribGain = siegeResult.victory ? 24 + Math.floor(Math.random() * 14) : 3;
                              const tokenGain = siegeResult.victory ? 3 : 0;
                              let equipDrop = null;
                              if (siegeResult.victory && Array.isArray(KW_EQUIPMENT) && KW_EQUIPMENT.length > 0 && Math.random() < 0.14) {
                                equipDrop = KW_EQUIPMENT[Math.floor(Math.random() * KW_EQUIPMENT.length)];
                              }
                              const settlement = settleContestSiegeAttempt({
                                kw: currentKw,
                                mapId: m.id,
                                allocation: alloc,
                                siegeResult,
                                dateKey: getLocalDateStr(),
                                maxDailyAttempts,
                                contributionGain: contribGain,
                                tokenGain,
                              });
                              if (!settlement.ok) {
                                showMapToast('❌', '攻城未结算', settlement.reason || '攻城状态已变化，请重试', 2600);
                                return;
                              }
                              const nextKw = settlement.kw;
                              nextKw.militaryRank = getMilitaryRank(nextKw.warContribution, buildRankStats(nextKw)).id;
                              kingdomWarRef.current = nextKw;
                              setKingdomWar(nextKw);
                              if (equipDrop) setAccessories(prev => [...prev, { ...equipDrop, uid: Date.now() + Math.random() }]);
                              showMapToast(siegeResult.victory ? '🏯' : '🛡️', siegeResult.victory ? '攻城大捷' : '攻城受挫', `${siegeResult.detail} 占领+${settlement.occupationGain} · 战功+${contribGain} · 令牌+${tokenGain} · 战损-${settlement.manpowerLost}兵`, 4200);
                              triggerEnemyKingdomActions(nextKw);
                              setKwSiegeModal(null);
                              } catch (err) {
                                console.error('kw siege:', err);
                                showMapToast('❌', '攻城失败', err?.message || '攻城数据异常，请保留兵力并重试。', 3000);
                              } finally {
                                if (acquiredLockKey) kingdomActionLocksRef.current.delete(acquiredLockKey);
                              }
                            }} style={{ width:'100%', padding:'12px', border:'none', borderRadius:'12px', background: myFaction.color, color:'#fff', fontWeight:'800', fontSize:'14px', cursor:'pointer' }}>发动攻城</button>
                            <button type="button" onClick={() => setKwSiegeModal(null)} style={{ width:'100%', marginTop:'8px', padding:'8px', border:'1px solid #cbd5e1', borderRadius:'10px', background:'#fff', cursor:'pointer', fontSize:'12px' }}>取消</button>
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                  );
                })()}

                {kwTab === 'capital' && (() => {
                  const capitalMapId = CAPITAL_MAP_IDS[kw.faction];
                  const capitalMap = MAPS.find(m => m.id === capitalMapId);
                  const gangBonus = getGangSkillBonus(getGangSkills(gang));
                  const genTotalBonus = calcGeneralsTotalBonus(kw.recruitedGenerals);
                  const tradeIncome = (gangBonus.trade || 0) + (genTotalBonus.trade || 0);
                  const territoryDefBonus = (gangBonus.territory || 0) + (genTotalBonus.territory || 0);
                  const capitalDailyGold = Math.floor(150 + myTerrCount * 50 + tradeIncome);
                  const hasClaimedCapitalReward = !dailyReset && kw.dailyCounts?.capitalReward;
                  const capitalFeatures = [
                    { icon: '💰', name: '国库领俸', desc: `每日领取${capitalDailyGold}金币 (基于领土数+商队)`, action: 'treasury',
                      disabled: hasClaimedCapitalReward, btnText: hasClaimedCapitalReward ? '已领取' : '领取俸禄' },
                    { icon: '🏋️', name: '校场练兵', desc: '挑战都城精英训练师，获得额外战功+经验', action: 'training',
                      disabled: false, btnText: '前往校场' },
                    { icon: '🗺️', name: '都城探索', desc: `进入${capitalMap?.name || '都城'}探索，捕捉独特精灵`, action: 'explore',
                      disabled: false, btnText: '进入都城' },
                    { icon: '🔮', name: '军师府', desc: '查看全局战况分析和战略建议', action: 'advisor',
                      disabled: false, btnText: '请教军师' },
                  ];
                  return (
                    <div>
                      <div style={{
                        background: `linear-gradient(135deg, ${myFaction.darkColor}, ${myFaction.color})`,
                        borderRadius:'14px', padding:'16px', color:'#fff', marginBottom:'16px',
                        boxShadow:`0 4px 15px ${myFaction.color}40`,
                      }}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                          <span style={{fontSize:'32px'}}>{capitalMap?.icon || '🏯'}</span>
                          <div>
                            <div style={{fontSize:'18px', fontWeight:'800'}}>{capitalMap?.name || '都城'}</div>
                            <div style={{fontSize:'11px', opacity:0.8}}>{capitalMap?.desc || ''}</div>
                          </div>
                        </div>
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap', fontSize:'11px'}}>
                          <span style={{background:'rgba(255,255,255,0.2)', padding:'3px 10px', borderRadius:'8px'}}>🏰 领地防御加成: +{territoryDefBonus}/tick</span>
                          <span style={{background:'rgba(255,255,255,0.2)', padding:'3px 10px', borderRadius:'8px'}}>🐫 商队日收入: {tradeIncome}金</span>
                        </div>
                      </div>
                      <div style={{display:'grid', gap:'10px'}}>
                        {capitalFeatures.map(feat => (
                          <div key={feat.action} style={{
                            background:'#fff', borderRadius:'12px', padding:'14px', border:'1px solid #e2e8f0',
                            display:'flex', alignItems:'center', gap:'12px',
                          }}>
                            <span style={{fontSize:'28px'}}>{feat.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b'}}>{feat.name}</div>
                              <div style={{fontSize:'11px', color:'#64748b', marginTop:'2px'}}>{feat.desc}</div>
                            </div>
                            <button
                              disabled={feat.disabled}
                              onClick={() => {
                                if (feat.action === 'treasury') {
                                  const today = getLocalDateStr();
                                  const lockKey = `capital-treasury:${today}`;
                                  if (kingdomActionLocksRef.current.has(lockKey)) return;
                                  kingdomActionLocksRef.current.add(lockKey);
                                  try {
                                    const currentKw = resetKingdomDailyCounts(kingdomWarRef.current);
                                    if (!currentKw?.faction || currentKw.dailyCounts?.capitalReward) {
                                      showMapToast('✅', '提示', '今日国库俸禄已领取', 1800);
                                      return;
                                    }
                                    const currentTerrCount = getFactionTerritoryCount(currentKw.faction, currentKw.territories || {});
                                    const currentGeneralBonus = calcGeneralsTotalBonus(currentKw.recruitedGenerals);
                                    const currentTradeIncome = (getGangSkillBonus(getGangSkills(gang)).trade || 0) + (currentGeneralBonus.trade || 0);
                                    const currentReward = Math.floor(150 + currentTerrCount * 50 + currentTradeIncome);
                                    const nextKw = { ...currentKw, dailyCounts: { ...(currentKw.dailyCounts || {}), capitalReward: true, resetDate: today } };
                                    kingdomWarRef.current = nextKw;
                                    goldRef.current += currentReward;
                                    flushSync(() => { setGold(goldRef.current); setKingdomWar(nextKw); });
                                    if (currentReward > 0) updateAchStat({ totalGoldEarned: currentReward });
                                    showMapToast('💰', '国库俸禄', `${currentReward.toLocaleString()} 金币`, 2500);
                                  } finally {
                                    kingdomActionLocksRef.current.delete(lockKey);
                                  }
                                } else if (feat.action === 'training') {
                                  if (party.length < 1) { showMapToast('ℹ️', '提示', '至少需要1只精灵！', 2000); return; }
                                  startBattle({
                                    id: capitalMapId, name: `${capitalMap?.name || '都城'}校场`,
                                    lvl: [50, 70], pool: capitalMap?.pool || [], drop: 800,
                                  }, 'kingdom_war');
                                } else if (feat.action === 'explore') {
                                  if (party.length < 1) { showMapToast('ℹ️', '提示', '至少需要1只精灵！', 2000); return; }
                                  enterMap(capitalMapId);
                                } else if (feat.action === 'advisor') {
                                  const strongest = FACTION_IDS.slice().sort((a,b) => (terrCounts[b]||0) - (terrCounts[a]||0));
                                  const contested = Object.entries(kw.territories).filter(([,t]) => t.contested).length;
                                  let advice = '【军师分析】\n\n';
                                  advice += `🏴 当前局势:\n`;
                                  strongest.forEach((fid, i) => { advice += `  ${i+1}. ${FACTIONS[fid].fullName}: ${terrCounts[fid]||0}块领地\n`; });
                                  advice += `  中立: ${terrCounts.neutral||0}块\n\n`;
                                  advice += `⚔️ 交战中: ${contested}块领地\n\n`;
                                  if (myTerrCount >= 6) advice += '💡 建议: 我方领地较多，注意防守，避免过度扩张导致兵力分散。\n';
                                  else if (myTerrCount <= 3) advice += '💡 建议: 我方领地偏少，应集中力量进攻敌方薄弱领地，扭转战局！\n';
                                  else advice += '💡 建议: 局势均衡，可伺机进攻交战中的领地，扩大优势。\n';
                                  advice += '\n🎯 国战地图上击败训练家或敌国训练师可获预备兵；名城占领需在国战页「争夺」发动攻城。';
                                  showMapToast('💡', '军师分析', advice.replace(/\n/g, ' '), 4000);
                                }
                              }}
                              style={{
                                padding:'8px 16px', background: feat.disabled ? '#e2e8f0' : myFaction.color,
                                color: feat.disabled ? '#94a3b8' : '#fff', border:'none', borderRadius:'10px',
                                fontSize:'12px', fontWeight:'600', cursor: feat.disabled ? 'not-allowed' : 'pointer',
                                whiteSpace:'nowrap',
                              }}
                            >
                              {feat.btnText}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 都城攻防战 */}
                      {(() => {
                        const siegeTargets = FACTION_IDS.filter(fid => fid !== kw.faction);
                        const eligibleCapitalTargets = getCapitalSiegeTargets(kw.faction, kw.territories);
                        return (
                          <div style={{marginTop:'16px'}}>
                            <div style={{fontSize:'14px', fontWeight:'800', color:'#C62828', marginBottom:'10px'}}>🔥 都城攻防战</div>
                            <div style={{fontSize:'11px', color:'#64748b', marginBottom:'10px'}}>先将敌方外围压缩至 {CAPITAL_SIEGE_MAX_TERRITORIES} 城以内，才能发起三波制都城决战；战役启动后无论胜负，该目标都进入 6 小时冷却。</div>
                            {siegeTargets.map(fid => {
                              const ef = FACTIONS[fid];
                              const eCapitalMap = MAPS.find(m => m.id === CAPITAL_MAP_IDS[fid]);
                              const siegeCooldown = kw.lastSiegeTime?.[fid] ? Math.max(0, 6 * 60 * 60 * 1000 - (Date.now() - kw.lastSiegeTime[fid])) : 0;
                              const targetTerritoryCount = getFactionTerritoryCount(fid, kw.territories || {});
                              const targetEligible = eligibleCapitalTargets.includes(fid);
                              const canSiege = targetEligible && siegeCooldown <= 0;
                              return (
                                <div key={fid} style={{background:'#fff', borderRadius:'12px', padding:'14px', border:`2px solid ${ef.color}40`, marginBottom:'8px'}}>
                                  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px'}}>
                                    <span style={{fontSize:'24px'}}>{eCapitalMap?.icon || '🏯'}</span>
                                    <div style={{flex:1}}>
                                      <div style={{fontSize:'14px', fontWeight:'700', color:ef.color}}>攻打 {eCapitalMap?.name || ef.fullName + '都城'}</div>
                                      <div style={{fontSize:'11px', color:'#64748b'}}>君主: {eCapitalMap?.lordName || '待揭晓'} · {eCapitalMap?.lordTitle || '称号待揭晓'}</div>
                                    </div>
                                  </div>
                                  <div style={{fontSize:'11px', color:'#475569', marginBottom:'8px'}}>
                                    {targetEligible
                                      ? '攻城条件已满足'
                                      : `外围尚有 ${targetTerritoryCount} 城，需压缩至 ${CAPITAL_SIEGE_MAX_TERRITORIES} 城以内`}
                                    {' · '}攻城胜利奖励: 💰 5000金 · ⭐ 战功+100 · 🎖️ 令牌+20
                                  </div>
                                  <button disabled={!canSiege} onClick={() => {
                                    const attackPermission = canFactionAttack(kw.politics, kw.faction, fid);
                                    if (!attackPermission.ok) { showMapToast('🤝', '盟约生效', attackPermission.reason, 2400); return; }
                                    if (!party.some(p => p && p.currentHp > 0)) { showMapToast('❌', '提示', '你的队伍已全灭！', 1500); return; }
                                    setConfirmModal({ title:'⚔️ 攻城确认', msg:`确定要对${ef.fullName}都城发起攻城战吗？\n\n这将是三波制高难度战役，发起后无论胜负均进入 6 小时冷却。`, onOk: () => {
                                      const currentKw = kingdomWarRef.current;
                                      if (!currentKw?.faction) { showMapToast('❌', '提示', '当前未加入阵营，无法攻城', 1800); return; }
                                      const latestPermission = canFactionAttack(currentKw.politics, currentKw.faction, fid);
                                      if (!latestPermission.ok) { showMapToast('🤝', '盟约生效', latestPermission.reason, 2400); return; }
                                      if (!(partyRef.current || []).some(p => p && (p.currentHp || 0) > 0)) { showMapToast('⚠️', '无法攻城', '队伍中无可战斗精灵，请先治疗', 1800); return; }
                                      if (battle && !battleResultHandledRef.current) { showMapToast('⚠️', '无法攻城', '请先完成当前战斗', 1800); return; }
                                      const eligibleTargets = getCapitalSiegeTargets(currentKw.faction, currentKw.territories);
                                      if (!eligibleTargets.includes(fid)) {
                                        showMapToast('ℹ️', '战局已变化', '该都城已不满足攻城条件，请刷新战况', 2200);
                                        return;
                                      }
                                      const latestCapitalMap = MAPS.find(m => m.id === CAPITAL_MAP_IDS[fid]);
                                      if (!latestCapitalMap) { showMapToast('⚠️', '无法攻城', '都城地图配置异常，本次不会进入冷却', 2200); return; }
                                      const lockKey = `capital-siege:${fid}`;
                                      if (kingdomActionLocksRef.current.has(lockKey)) return;
                                      const nowCooldown = currentKw?.lastSiegeTime?.[fid] ? Math.max(0, 6 * 60 * 60 * 1000 - (Date.now() - currentKw.lastSiegeTime[fid])) : 0;
                                      if (nowCooldown > 0) { showMapToast('⏳', '攻城冷却中', `还需 ${Math.ceil(nowCooldown / 3600000)} 小时`, 2000); return; }
                                      kingdomActionLocksRef.current.add(lockKey);
                                      const nextKw = { ...currentKw, lastSiegeTime: { ...(currentKw.lastSiegeTime || {}), [fid]: Date.now() } };
                                      kingdomWarRef.current = nextKw;
                                      setKingdomWar(nextKw);
                                      try {
                                        startBattle({
                                          id: CAPITAL_MAP_IDS[fid],
                                          name: latestCapitalMap.name || '敌都',
                                          lvl: [80, 100], pool: latestCapitalMap.pool?.length ? latestCapitalMap.pool : HIGH_TIER_POOL,
                                          drop: 2000, siegeTarget: fid,
                                        }, 'capital_siege');
                                      } catch (err) {
                                        kingdomActionLocksRef.current.delete(lockKey);
                                        kingdomWarRef.current = currentKw;
                                        setKingdomWar(currentKw);
                                        console.error('capital siege start:', err);
                                        showMapToast('⚠️', '攻城未能启动', '本次未进入冷却，请稍后重试', 2400);
                                      }
                                    }});
                                  }} style={{
                                    color:'#fff', border:'none', borderRadius:'20px', cursor:'pointer', fontWeight:'bold',
                                    width:'100%', fontSize:'13px', padding:'10px 0',
                                    background: canSiege ? '#C62828' : '#94a3b8',
                                  }}>
                                    {canSiege
                                      ? '⚔️ 发起攻城战'
                                      : !targetEligible
                                        ? `🔒 尚需攻下 ${Math.max(0, targetTerritoryCount - CAPITAL_SIEGE_MAX_TERRITORIES)} 城`
                                        : `冷却中 (${Math.ceil(siegeCooldown / 3600000)}h)`}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* 领土 */}
                {kwTab === 'territory' && (() => {
                  const fStats = getFactionTerritoryStats(kw.territories);
                  const rankIdx = Math.max(0, MILITARY_RANKS.findIndex(r => r.id === (kw.militaryRank || 'civilian')));
                  const reserve = Math.min(MANPOWER_RESERVE_CAP, Math.max(0, kw.kwManpowerReserve || 0));
                  const grainCap = calcGrainCap(kw);
                  const currentGrain = Math.max(0, Number(kw.grain) || 0);
                  const timeMod = getBattleTimeModifiers();
                  return (
                  <div>
                  <div style={{background:'linear-gradient(135deg, #1e293b, #334155)', borderRadius:'14px', padding:'14px', marginBottom:'12px', color:'#fff'}}>
                    <div style={{fontSize:'14px', fontWeight:'800', marginBottom:'8px'}}>🏰 天下大势 · 全图争夺</div>
                    <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'8px'}}>
                      {ALL_FACTION_IDS.map(fid => {
                        const f = FACTIONS[fid];
                        const st = fStats[fid] || { count: 0, totalTroops: 0 };
                        return <div key={fid} style={{flex:1, minWidth:'70px', background:`${f?.color || '#666'}33`, borderRadius:'10px', padding:'8px', textAlign:'center'}}>
                          <div style={{fontSize:'16px'}}>{f?.icon}</div>
                          <div style={{fontSize:'11px', fontWeight:'700'}}>{f?.name}</div>
                          <div style={{fontSize:'10px', opacity:0.8}}>🏴 {st.count}城 · 🪖 {st.totalTroops}兵</div>
                        </div>;
                      })}
                    </div>
                    <div style={{fontSize:'11px', opacity:0.7}}>
                      预备兵 {reserve}/{MANPOWER_RESERVE_CAP} · 精锐 {kw.eliteTroops || 0} · 粮草 {currentGrain}/{grainCap}{currentGrain > grainCap ? '（超储）' : ''} · {timeMod.label} · 普通攻城 {territorySiegeAttempts}/{maxTerritorySieges}
                    </div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px'}}>
                    {WAR_MAP_IDS.filter(mid => !CONTESTED_MAP_IDS.includes(Number(mid))).map(mapId => {
                      const map = MAPS.find(m => m.id === mapId);
                      if (!map) return null;
                      const t = kw.territories[mapId] || { owner: 'neutral', strength: 50 };
                      const ownerFaction = FACTIONS[t.owner];
                      const isMine = t.owner === kw.faction;
                      const isNeutral = t.owner === 'neutral';
                      const borderColor = isNeutral ? '#94a3b8' : (ownerFaction?.color || '#94a3b8');
                      const garrison = t.garrison || {};
	                      const totalG = getGarrisonTotal(garrison);
                      const canSiege = !isMine && kw.faction && reserve >= SIEGE_CONFIG.minDeploy;
                      let assaultPreview = null;
                      if (!isMine && kw.faction && reserve >= SIEGE_CONFIG.minDeploy) {
	                        const cap0 = Math.min(reserve, 200 + rankIdx * 40);
	                        const b0 = Math.floor(cap0 / 6);
	                        const r0 = cap0 - b0 * 6;
	                        const alloc0 = {};
	                        KW_TROOP_IDS.forEach((tid, i) => { alloc0[tid] = b0 + (i < r0 ? 1 : 0); });
	                        assaultPreview = evaluateTerritoryAssault({
	                          mapId,
	                          playerFaction: kw.faction,
	                          allocation: alloc0,
	                          territories: kw.territories,
	                          recruitedGenerals: kw.recruitedGenerals || [],
	                          generalIds: [],
                            kw,
                            external: buildSiegeExternalBonuses(),
	                        });
	                      }
	                      return (
                        <div key={mapId} style={{
                          background:'#fff', borderRadius:'12px', padding:'12px',
                          border: `2px solid ${borderColor}`,
                          boxShadow: t.contested ? `0 0 10px ${borderColor}50` : '0 2px 6px rgba(0,0,0,0.04)',
                          position:'relative', overflow:'hidden',
                        }}>
                          {t.contested && (
                            <div style={{position:'absolute', top:'4px', right:'4px', fontSize:'14px', animation:'pulse 1.5s infinite'}}>⚔️</div>
                          )}
                          <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                            <span style={{fontSize:'20px'}}>{map.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:'12px', fontWeight:'700', color:'#1e293b'}}>{map.name}</div>
                              <div style={{fontSize:'10px', color: borderColor, fontWeight:'600'}}>
                                {isNeutral ? '中立' : `${ownerFaction?.icon || ''} ${ownerFaction?.fullName || t.owner}`}
                                {isMine && ' (我方)'}
                              </div>
                            </div>
                          </div>
                          <div style={{height:'4px', background:'#f1f5f9', borderRadius:'2px', overflow:'hidden', marginBottom:'4px'}}>
                            <div style={{width:`${Math.min(100, t.strength)}%`, height:'100%', background: borderColor, borderRadius:'2px'}} />
                          </div>
                          <div style={{fontSize:'9px', color:'#64748b', marginBottom:'6px'}}>
                            防御 {t.strength}/100 · 总兵 {totalG}
                            {assaultPreview && <> · 胜率 {Math.round((assaultPreview.winChance || 0) * 100)}% · {assaultPreview.riskLabel}</>}
                          </div>
                          {t.contested && (
                            <div style={{marginBottom:'6px'}}>
                              <div style={{display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#b45309', marginBottom:'2px'}}>
                                <span>{FACTIONS[t.attackerFaction]?.icon || '⚔️'} 围城推进</span>
                                <span>{t.attackProgress || 0}/{SIEGE_CONFIG.progressRequired}</span>
                              </div>
                              <div style={{height:'4px', background:'#ffedd5', borderRadius:'2px', overflow:'hidden'}}>
                                <div style={{height:'100%', width:`${Math.min(100, t.attackProgress || 0)}%`, background:'#f97316'}} />
                              </div>
                            </div>
                          )}
                          {(() => {
                            const scoutPerks = getUnlockedRankPerks(kw, buildRankStats(kw));
                            if (!scoutPerks.scoutRange) return null;
                            const intel = getScoutAdjacentIntel(mapId, kw.faction, kw.territories, scoutPerks.scoutRange);
                            if (!intel.length) return null;
                            return (
                              <div style={{ fontSize: '9px', color: '#475569', marginBottom: '4px', lineHeight: 1.4 }}>
                                🔍 邻境：{intel.map(i => {
                                  const ef = FACTIONS[i.owner];
                                  const nm = MAPS.find(m => m.id === i.mapId)?.name || `#${i.mapId}`;
                                  return `${nm} ${ef?.icon || ''}防${i.strength}`;
                                }).join(' · ')}
                              </div>
                            );
                          })()}
                          <div style={{display:'flex', gap:'2px', flexWrap:'wrap', marginBottom:'4px'}}>
                            {(t.guards || getActiveGuards(t)).map((g, gi) => (
                              <span key={gi} title={g.name} style={{fontSize:'9px', background: g.defeated ? 'rgba(0,0,0,0.06)' : 'rgba(239,68,68,0.12)', color: g.defeated ? '#94a3b8' : '#b91c1c', borderRadius:'4px', padding:'1px 5px', fontWeight:'600'}}>
                                {g.defeated ? '💀' : '🛡️'}{g.name}
                              </span>
                            ))}
                          </div>
                          <div style={{display:'flex', gap:'2px', flexWrap:'wrap', marginBottom:'6px'}}>
                            {KW_TROOP_TYPES.map(tt => {
                              const v = garrison[tt.id] || 0;
                              if (v <= 0) return null;
                              return <span key={tt.id} title={tt.name} style={{fontSize:'9px', background:'#f1f5f9', borderRadius:'4px', padding:'1px 4px'}}>{tt.icon}{v}</span>;
                            })}
                          </div>
                          {canSiege && (
                            <button onClick={() => {
                              const attackPermission = canFactionAttack(kw.politics, kw.faction, t.owner);
                              if (!attackPermission.ok) { showMapToast('🤝', '盟约生效', attackPermission.reason, 2400); return; }
                              if (territorySiegeAttempts >= maxTerritorySieges) { showMapToast('❌','攻城次数已用完',`普通领地每日最多 ${maxTerritorySieges} 次`,1800); return; }
                              const cap = Math.min(reserve, 200 + rankIdx * 40);
                              if (cap < SIEGE_CONFIG.minDeploy) { showMapToast('❌','兵力不足',`预备兵至少${SIEGE_CONFIG.minDeploy}才可攻城`,1800); return; }
                              const b = Math.floor(cap / 6);
                              const r = cap - b * 6;
                              const alloc = {};
                              KW_TROOP_IDS.forEach((tid, i) => { alloc[tid] = b + (i < r ? 1 : 0); });
                              setKwSiegeModal({ targetMapId: mapId, targetMapName: map.name, allocation: alloc, generalIds: [], deployCap: cap, isTerritorySiege: true, duelGeneralId: (kw.recruitedGenerals || [])[0]?.id || null, skipDuel: false });
                            }} style={{
                              width:'100%', padding:'6px', border:'none', borderRadius:'8px', fontSize:'11px', fontWeight:'700',
                              background: territorySiegeAttempts >= maxTerritorySieges ? '#94a3b8' : myFaction.color,
                              color:'#fff', cursor: territorySiegeAttempts >= maxTerritorySieges ? 'not-allowed' : 'pointer', opacity: territorySiegeAttempts >= maxTerritorySieges ? 0.65 : 0.9,
                            }}>⚔️ 三阶段攻城 ({territorySiegeAttempts}/{maxTerritorySieges})</button>
                          )}
                          {isMine && <div style={{fontSize:'10px', color:'#22c55e', textAlign:'center', fontWeight:'600'}}>✅ 我方领地</div>}
                        </div>
                      );
                    })}
                  </div>
                  </div>
                  );
                })()}

                {/* 战报 */}
                {kwTab === 'warlog' && (
                  <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                    <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b', marginBottom:'12px'}}>最近战报</div>
                    {(!kw.warLog || kw.warLog.length === 0) ? (
                      <div style={{textAlign:'center', color:'#64748b', padding:'20px', fontSize:'13px'}}>暂无战报</div>
                    ) : (
                      <div style={{display:'flex', flexDirection:'column', gap:'8px', maxHeight:'400px', overflowY:'auto'}}>
                        {[...(kw.warLog || [])].reverse().map((logItem, i) => {
                          const mapInfo = MAPS.find(m => m.id === logItem.mapId);
                          const isCapture = logItem.type === 'capture' || logItem.type === 'player_siege_win';
                          const isSiegeProgress = logItem.type === 'siege_progress' || logItem.type === 'player_siege_progress';
                          const reportColor = isCapture ? '#dc2626' : isSiegeProgress ? '#d97706' : '#16a34a';
                          const atkF = FACTIONS[logItem.attacker];
                          const defF = FACTIONS[logItem.defender];
                          return (
                            <div key={i} style={{
                              padding:'10px', borderRadius:'10px', fontSize:'12px',
                              background: isCapture ? 'rgba(239,68,68,0.05)' : isSiegeProgress ? 'rgba(245,158,11,0.07)' : '#f8fafc',
                              borderLeft: `3px solid ${isCapture ? '#ef4444' : isSiegeProgress ? '#f59e0b' : '#22c55e'}`,
                            }}>
                              <div style={{fontWeight:'600', color: reportColor, marginBottom:'2px'}}>
                                {isCapture ? '⚔️ 领土易主' : isSiegeProgress ? '🏰 围城推进' : '🛡️ 攻防受挫'}{mapInfo ? ` · ${mapInfo.name}` : ''}
                              </div>
                              <div style={{color:'#64748b', fontSize:'11px'}}>{logItem.msg}</div>
                              {logItem.atkTroops && (
                                <div style={{display:'flex', gap:'8px', marginTop:'4px', fontSize:'9px', color:'#475569'}}>
                                  <span>{atkF?.icon || '⚔️'} 攻：{KW_TROOP_TYPES.map(tt => `${tt.icon}${logItem.atkTroops[tt.id]||0}`).join(' ')}</span>
                                </div>
                              )}
                              {logItem.defTroops && (
                                <div style={{display:'flex', gap:'8px', fontSize:'9px', color:'#475569'}}>
                                  <span>{defF?.icon || '🛡️'} 守：{KW_TROOP_TYPES.map(tt => `${tt.icon}${logItem.defTroops[tt.id]||0}`).join(' ')}</span>
                                </div>
                              )}
                              <div style={{color:'#64748b', fontSize:'9px', marginTop:'2px'}}>{new Date(logItem.time).toLocaleString()}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 商店 */}
                {/* 领地攻城弹窗 */}
                {kwSiegeModal && kwSiegeModal.isTerritorySiege && (
                  <div style={{ position:'fixed', inset:0, zIndex:4000, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }} onClick={() => setKwSiegeModal(null)}>
                    <div style={{ background:'#fff', borderRadius:'16px', maxWidth:'420px', width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 12px 40px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                      <div style={{ padding:'16px', borderBottom:'1px solid #e2e8f0' }}>
                        <div style={{ fontSize:'16px', fontWeight:'800', color:'#0f172a' }}>⚔️ {kwSiegeModal.targetMapName} · 领地攻城</div>
                        <div style={{ fontSize:'11px', color:'#64748b', marginTop:'6px' }}>六兵种环形克制：盾→枪→骑→弓→器→奇→盾。可分配 <strong>{SIEGE_CONFIG.minDeploy}-{kwSiegeModal.deployCap}</strong> 单位兵力，选至多3武将。</div>
                      </div>
                      <div style={{ padding:'14px 16px' }}>
                        {KW_TROOP_TYPES.map(tt => (
                          <div key={tt.id} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                            <span style={{ fontSize:'20px', width:'32px' }}>{tt.icon}</span>
                            <div style={{ flex:1, fontSize:'12px' }}>
                              <div style={{ fontWeight:'700', color:'#1e293b' }}>{tt.name}</div>
                              <div style={{ fontSize:'10px', color:'#64748b' }}>{tt.desc}</div>
                            </div>
                            <input type="number" min={0} max={kwSiegeModal.deployCap}
                              value={kwSiegeModal.allocation[tt.id] ?? 0}
                              onChange={e => {
                                const v = Math.max(0, Math.min(kwSiegeModal.deployCap, parseInt(e.target.value, 10) || 0));
                                setKwSiegeModal(prev => prev ? { ...prev, allocation: { ...prev.allocation, [tt.id]: v } } : prev);
                              }}
                              style={{ width:'64px', padding:'6px', borderRadius:'8px', border:'1px solid #cbd5e1', fontSize:'13px' }}
                            />
                          </div>
                        ))}
                        <div style={{ fontSize:'11px', color:'#475569', margin:'10px 0' }}>
	                          已分配 {KW_TROOP_IDS.reduce((s, tid) => s + (kwSiegeModal.allocation[tid] || 0), 0)} / 上限 {kwSiegeModal.deployCap}
	                          <button type="button" onClick={() => {
	                            const total = Math.min(kwSiegeModal.deployCap, SIEGE_CONFIG.minDeploy);
	                            const b = Math.floor(total / 6);
	                            const r = total - b * 6;
	                            const allocation = {};
	                            KW_TROOP_IDS.forEach((tid, i) => { allocation[tid] = b + (i < r ? 1 : 0); });
	                            setKwSiegeModal(prev => prev ? { ...prev, allocation } : prev);
	                          }} style={{ marginLeft:'10px', padding:'4px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #94a3b8', background:'#fff', cursor:'pointer' }}>最低出征</button>
	                          <button type="button" onClick={() => {
                            const cap = kwSiegeModal.deployCap;
                            const b = Math.floor(cap / 6);
                            const r = cap - b * 6;
                            const alloc = {};
                            KW_TROOP_IDS.forEach((tid, i) => { alloc[tid] = b + (i < r ? 1 : 0); });
	                            setKwSiegeModal(prev => prev ? { ...prev, allocation: alloc } : prev);
	                          }} style={{ marginLeft:'6px', padding:'4px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #94a3b8', background:'#f8fafc', cursor:'pointer' }}>均分上限</button>
	                        </div>
	                        {(() => {
	                          const preview = evaluateTerritoryAssault({
	                            mapId: kwSiegeModal.targetMapId,
	                            playerFaction: kingdomWar?.faction,
	                            allocation: kwSiegeModal.allocation,
	                            territories: kingdomWar?.territories || {},
	                            recruitedGenerals: kingdomWar?.recruitedGenerals || [],
	                            generalIds: kwSiegeModal.generalIds || [],
	                            kw: kingdomWar,
	                            external: {
	                              ...buildSiegeExternalBonuses(),
	                              attackItemMult: kingdomWar?.attackBuff ? TIGER_SEAL_ATTACK_MULT : 1,
	                            },
	                          });
	                          return (
	                            <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'10px', marginBottom:'12px'}}>
                              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'6px', marginBottom:'8px'}}>
                                {[
                                  ['胜率', `${Math.round((preview.winChance || 0) * 100)}%`],
                                  ['风险', preview.riskLabel || '未知'],
                                  ['战损', `约${preview.expectedLoss || 0}`],
                                  ['破城', `${preview.expectedStrengthChange || 0}`],
                                  ['围城', `${preview.currentSiegeProgress || 0}+${preview.expectedProgressGain || 0}`],
                                  ['有效攻势', `约${preview.expectedEffectiveAssaults || 1}轮`],
	                                ].map(([k, v]) => (
	                                  <div key={k} style={{background:'#fff', borderRadius:'8px', padding:'7px 6px', textAlign:'center'}}>
	                                    <div style={{fontSize:'10px', color:'#64748b'}}>{k}</div>
	                                    <div style={{fontSize:'13px', color:'#0f172a', fontWeight:'800', marginTop:'2px'}}>{v}</div>
	                                  </div>
	                                ))}
	                              </div>
	                              <div style={{fontSize:'11px', color:'#475569', lineHeight:1.55}}>
                                {preview.supply?.label || '补给'}：{preview.supply?.desc || '根据领地接壤情况影响攻城'} · 克制倍率 {(preview.counter || 1).toFixed(2)}<br/>
                                易主条件：城防 ≤ {SIEGE_CONFIG.captureStrength} 且围城进度达到 {SIEGE_CONFIG.progressRequired}；单次最多推进 {SIEGE_CONFIG.maxProgressGain}。
	                              </div>
	                              {(preview.extBonus?.itemAttackMult || 1) > 1 && <div style={{fontSize:'11px', color:'#b45309', fontWeight:'800', marginTop:'6px'}}>🐯 虎符生效：本次攻击力 +{Math.round(((preview.extBonus?.itemAttackMult || 1) - 1) * 100)}%，发动后消耗</div>}
	                              <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
	                                {(preview.advice || []).slice(0, 2).map((tip, i) => <span key={i} style={{fontSize:'10px', color:'#92400e', background:'#fef3c7', borderRadius:'999px', padding:'3px 8px'}}>{tip}</span>)}
	                              </div>
	                              <button type="button" onClick={() => setKwSiegeModal(prev => prev ? { ...prev, allocation: preview.suggestedAllocation || prev.allocation } : prev)} style={{marginTop:'8px', padding:'5px 10px', fontSize:'11px', borderRadius:'8px', border:'1px solid #cbd5e1', background:'#fff', cursor:'pointer'}}>采用推荐配兵</button>
	                            </div>
	                          );
	                        })()}
	                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#1e293b', marginBottom:'6px' }}>选择参战武将（最多3）</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px' }}>
                          {(kw.recruitedGenerals || []).map(g => {
                            const on = (kwSiegeModal.generalIds || []).includes(g.id);
                            return (
                              <button type="button" key={g.id} onClick={() => {
                                setKwSiegeModal(prev => {
                                  if (!prev) return prev;
                                  const cur = [...(prev.generalIds || [])];
                                  const i = cur.indexOf(g.id);
                                  if (i >= 0) cur.splice(i, 1);
                                  else if (cur.length < 3) cur.push(g.id);
                                  return { ...prev, generalIds: cur };
                                });
                              }} style={{
                                padding:'6px 10px', borderRadius:'999px', fontSize:'11px', border:`1px solid ${on ? myFaction.color : '#cbd5e1'}`,
                                background: on ? `${myFaction.color}22` : '#fff', cursor:'pointer', fontWeight:on ? 800 : 500,
                              }}>{g.name}</button>
                            );
                          })}
                        </div>
                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#1e293b', marginBottom:'6px' }}>单挑武将（可选，击败守将削弱城防）</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px' }}>
                          <button type="button" onClick={() => setKwSiegeModal(prev => prev ? { ...prev, duelGeneralId: null, skipDuel: true } : prev)} style={{ padding:'5px 10px', borderRadius:'8px', fontSize:'11px', border:'1px solid #cbd5e1', background: kwSiegeModal.skipDuel ? '#fef3c7' : '#fff', cursor:'pointer' }}>跳过单挑</button>
                          {(kw.recruitedGenerals || []).map(g => (
                            <button type="button" key={`duel-${g.id}`} onClick={() => setKwSiegeModal(prev => prev ? { ...prev, duelGeneralId: g.id, skipDuel: false } : prev)} style={{
                              padding:'5px 10px', borderRadius:'8px', fontSize:'11px', border:`1px solid ${kwSiegeModal.duelGeneralId === g.id ? '#ef4444' : '#cbd5e1'}`,
                              background: kwSiegeModal.duelGeneralId === g.id ? 'rgba(239,68,68,0.12)' : '#fff', cursor:'pointer',
                            }}>⚔️ {g.name}</button>
                          ))}
                        </div>
                        <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'10px', padding:'8px', background:'#f8fafc', borderRadius:'8px' }}>
                          {getBattleTimeModifiers().label}模式 · 三阶段：野战 → 单挑 → 攻城（消耗兵力，敌方联动行动）
                        </div>
                        <button type="button" onClick={() => {
                          let acquiredLockKey = null;
                          try {
                            const currentKw = kingdomWarRef.current;
                            if (!currentKw?.faction) { showMapToast('❌','提示','未加入阵营',1800); return; }
                            const todayKey = getLocalDateStr();
                            const usedSieges = currentKw.dailyCounts?.resetDate === todayKey ? (currentKw.dailyCounts?.territorySieges || 0) : 0;
                            if (usedSieges >= maxTerritorySieges) { showMapToast('❌','攻城次数已用完',`普通领地每日最多 ${maxTerritorySieges} 次`,2000); return; }
                            const mid = kwSiegeModal.targetMapId;
                            const currentTarget = currentKw.territories?.[mid];
                            if (!currentTarget || currentTarget.owner === currentKw.faction) {
                              showMapToast('ℹ️', '目标状态已变化', '该领地已无法攻击，请重新选择目标', 2200);
                              setKwSiegeModal(null);
                              return;
                            }
                            const attackPermission = canFactionAttack(currentKw.politics, currentKw.faction, currentTarget.owner);
                            if (!attackPermission.ok) { showMapToast('🤝', '盟约生效', attackPermission.reason, 2400); return; }
                            const lockKey = `territory-siege:${mid}`;
                            if (kingdomActionLocksRef.current.has(lockKey)) return;
                            const currentReserve = Math.min(MANPOWER_RESERVE_CAP, Math.max(0, currentKw.kwManpowerReserve || 0));
                            const deployment = validateSiegeDeployment({
                              allocation: kwSiegeModal.allocation,
                              maxDeploy: kwSiegeModal.deployCap,
                              reserve: currentReserve,
                              minDeploy: SIEGE_CONFIG.minDeploy,
                            });
                            if (!deployment.ok) { showMapToast('❌','分配有误',deployment.reason,2200); return; }
                            const alloc = deployment.allocation;
                            const siegeExternal = {
                              ...buildSiegeExternalBonuses(),
                              attackItemMult: currentKw.attackBuff ? TIGER_SEAL_ATTACK_MULT : 1,
                            };
                            const fieldEval = evaluateTerritoryAssault({
                              mapId: mid,
                              playerFaction: currentKw.faction,
                              allocation: alloc,
                              territories: currentKw.territories,
                              recruitedGenerals: currentKw.recruitedGenerals || [],
                              generalIds: kwSiegeModal.generalIds || [],
                              kw: currentKw,
                              external: siegeExternal,
                            });
                            if (!fieldEval.canAttack) {
                              showMapToast('❌', '无法攻城', fieldEval.reason || '当前目标不可攻击', 2200);
                              return;
                            }
                            kingdomActionLocksRef.current.add(lockKey);
                            acquiredLockKey = lockKey;
                            const result = runThreePhaseSiege({
                              mapId: mid,
                              playerFaction: currentKw.faction,
                              allocation: alloc,
                              territories: currentKw.territories,
                              recruitedGenerals: currentKw.recruitedGenerals || [],
                              generalIds: kwSiegeModal.generalIds || [],
                              duelGeneralId: kwSiegeModal.skipDuel ? null : kwSiegeModal.duelGeneralId,
                              skipDuel: !!kwSiegeModal.skipDuel,
                              eliteTroops: currentKw.eliteTroops || 0,
                              morale: currentKw.morale ?? 100,
                              kw: currentKw,
                              fieldEval,
                              external: siegeExternal,
                            });
                            const baseContrib = result.captured ? 18 : result.success ? 8 : 3;
                            const contribGain = Math.floor(baseContrib * (result.contribMult || 1));
                            const tokenGain = result.captured ? 3 : 0;
                            const defenderFaction = currentTarget.owner;
                            const terr = { ...(result.territories || currentKw.territories) };
                            const t = { ...(terr[mid] || {}) };
                            if (result.captured) {
                              t.owner = currentKw.faction;
                              t.qunLordId = null;
                              t.strength = 35;
                              t.garrison = generateGarrison(currentKw.faction, 50);
                              t.guards = assignTerritoryGuards(currentKw.faction, 35);
                              t.contested = false;
                              t.attackerFaction = null;
                            } else if (result.success) {
                              t.strength = Math.max(0, result.strength ?? t.strength);
                              t.guards = result.guards || t.guards;
                            }
                            terr[mid] = t;
                            const nextReserve = Math.max(0, (currentKw.kwManpowerReserve || 0) - (result.totalManpowerLost || 0));
                            const nextKw = {
                              ...currentKw,
                              territories: terr,
                              kwManpowerReserve: nextReserve,
                              eliteTroops: Math.min(nextReserve, Math.max(0, (currentKw.eliteTroops || 0) - (result.eliteLost || 0))),
                              morale: result.morale ?? currentKw.morale,
                              actionCounter: (currentKw.actionCounter || 0) + 1,
                              currentTurn: (currentKw.currentTurn || 0) + 1,
                              dailyCounts: {
                                ...((currentKw.dailyCounts?.resetDate === todayKey) ? (currentKw.dailyCounts || {}) : { resetDate: todayKey, kills: 0 }),
                                territorySieges: (((currentKw.dailyCounts?.resetDate === todayKey) ? (currentKw.dailyCounts?.territorySieges || 0) : 0) + 1),
                              },
                              warContribution: (currentKw.warContribution || 0) + contribGain,
                              seasonContribution: (currentKw.seasonContribution || 0) + contribGain,
                              lifetimeContribution: (currentKw.lifetimeContribution || 0) + contribGain,
                              factionTokens: (currentKw.factionTokens || 0) + tokenGain,
                              attackBuff: false,
                              warLog: [...(currentKw.warLog || []).slice(-19), {
                                time: Date.now(), type: result.captured ? 'player_siege_win' : result.success ? 'player_siege_progress' : 'player_siege_fail',
                                attacker: currentKw.faction, defender: defenderFaction, mapId: Number(mid),
                                atkTroops: result.atkTroops, defTroops: result.defTroops,
                                msg: `${result.timeLabel || ''}三阶段攻城 → ${result.detail} 战损${result.totalManpowerLost} 战功+${contribGain}`,
                              }],
                            };
                            nextKw.militaryRank = getMilitaryRank(nextKw.warContribution, buildRankStats(nextKw)).id;
                            kingdomWarRef.current = nextKw;
                            setKingdomWar(nextKw);
                            triggerEnemyKingdomActions(nextKw);
                            showMapToast(result.captured ? '⚔️' : (result.success ? '🏰' : '🛡️'),
                              result.captured ? '攻占城池！' : (result.success ? '城防削弱' : '攻城失败'),
                              `${result.detail} 战损${result.totalManpowerLost}兵 · 战功+${contribGain}${tokenGain > 0 ? ` · 令牌+${tokenGain}` : ''}`, 4500);
                            setKwSiegeModal(null);
                          } catch (err) {
                            console.error('territory siege:', err);
                            showMapToast('❌','攻城失败','数据异常，请重试。',2500);
                          } finally {
                            if (acquiredLockKey) kingdomActionLocksRef.current.delete(acquiredLockKey);
                          }
                        }} style={{ width:'100%', padding:'12px', border:'none', borderRadius:'12px', background: myFaction.color, color:'#fff', fontWeight:'800', fontSize:'14px', cursor:'pointer' }}>发动三阶段攻城</button>
                        <button type="button" onClick={() => setKwSiegeModal(null)} style={{ width:'100%', marginTop:'8px', padding:'8px', border:'1px solid #cbd5e1', borderRadius:'10px', background:'#fff', cursor:'pointer', fontSize:'12px' }}>取消</button>
                      </div>
                    </div>
                  </div>
                )}

                {kwTab === 'shop' && (
                  <div style={{display:'grid', gap:'10px'}}>
                    <div style={{fontSize:'12px', color:'#64748b', textAlign:'center', marginBottom:'4px'}}>当前令牌: <b style={{color: myFaction.color}}>{kw.factionTokens || 0}</b></div>
                    {TOKEN_SHOP.map(item => {
                      const tigerSealActive = item.id === 'tiger_seal' && !!kw.attackBuff;
                      const canPurchase = (kw.factionTokens || 0) >= item.cost && !tigerSealActive;
                      return (
                        <div key={item.id} style={{
                          background:'#fff', borderRadius:'12px', padding:'14px', boxShadow:'0 2px 6px rgba(0,0,0,0.04)',
                          display:'flex', alignItems:'center', gap:'12px',
                        }}>
                          <span style={{fontSize:'28px'}}>{item.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b'}}>{item.name}</div>
                            <div style={{fontSize:'11px', color:'#64748b'}}>{item.desc}</div>
                          </div>
                          <button onClick={() => {
                            if (tigerSealActive) { showMapToast('🐯', '虎符已生效', '发动下一次普通领地或名城攻城后才会消耗', 2000); return; }
                            if ((kw.factionTokens || 0) < item.cost) { showMapToast('🎖️', '令牌不足', '令牌不足！', 1500); return; }
                            setConfirmModal({
                              title:'🎖️ 令牌购买',
                              msg:`确定花费 ${item.cost} 令牌购买「${item.name}」？`,
                              onOk: () => {
                                const shopLockKey = `token-shop:${item.id}`;
                                if (kingdomActionLocksRef.current.has(shopLockKey)) return;
                                kingdomActionLocksRef.current.add(shopLockKey);
                                try {
                                  const currentKw = kingdomWarRef.current;
                                  if (!currentKw?.faction || (currentKw.factionTokens || 0) < item.cost) {
                                    showMapToast('🎖️', '令牌不足', '令牌不足或阵营状态已变化', 1500);
                                    return;
                                  }
                                  if (item.id === 'tiger_seal' && currentKw.attackBuff) {
                                    showMapToast('🐯', '虎符已生效', '无法重复购买，发动攻城后可再次购买', 2000);
                                    return;
                                  }

                                  if (item.id === 'siege') {
                                    const enemyTerrs = WAR_MAP_IDS.filter(mid => !CONTESTED_MAP_IDS.includes(Number(mid))
                                      && currentKw.territories[mid]?.owner
                                      && currentKw.territories[mid].owner !== currentKw.faction
                                      && currentKw.territories[mid].owner !== 'neutral'
                                      && canFactionAttack(currentKw.politics, currentKw.faction, currentKw.territories[mid].owner).ok);
                                    if (enemyTerrs.length === 0) { showMapToast('⚠️', '无可攻击目标', '没有可攻击的敌方领地', 1500); return; }
                                    const targetId = enemyTerrs[Math.floor(Math.random() * enemyTerrs.length)];
                                    const targetMap = MAPS.find(m => m.id === targetId);
                                    const siegeMult = getRankPerkEffects(currentKw).siegeEffectMult || 1;
                                    const dmg = Math.floor(10 * siegeMult);
                                    const newT = { ...currentKw.territories };
                                    newT[targetId] = { ...newT[targetId], strength: Math.max(WAR_TICK_CONFIG.minStrength, (newT[targetId]?.strength || 50) - dmg) };
                                    const nextKw = { ...currentKw, factionTokens: (currentKw.factionTokens || 0) - item.cost, territories: newT };
                                    kingdomWarRef.current = nextKw;
                                    setKingdomWar(nextKw);
                                    showMapToast('⚔️', '投石', `${targetMap?.name || '目标'} 防御 -${dmg}`, 2000);
                                    return;
                                  }

                                  if (item.id === 'flag') {
                                    const myTerrs = WAR_MAP_IDS.filter(mid => currentKw.territories[mid]?.owner === currentKw.faction);
                                    if (myTerrs.length === 0) { showMapToast('⚠️', '无可操作', '没有己方领地', 1500); return; }
                                    const weakest = [...myTerrs].sort((a, b) => (currentKw.territories[a]?.strength || 0) - (currentKw.territories[b]?.strength || 0))[0];
                                    const wMap = MAPS.find(m => m.id === weakest);
                                    const newT = { ...currentKw.territories };
                                    newT[weakest] = { ...newT[weakest], strength: Math.min(WAR_TICK_CONFIG.maxStrength, (newT[weakest]?.strength || 50) + 15) };
                                    const nextKw = { ...currentKw, factionTokens: (currentKw.factionTokens || 0) - item.cost, territories: newT };
                                    kingdomWarRef.current = nextKw;
                                    setKingdomWar(nextKw);
                                    showMapToast('🚩', '插旗', `${wMap?.name || '领地'} 防御 +15`, 2000);
                                    return;
                                  }

                                  const nextKw = {
                                    ...currentKw,
                                    factionTokens: (currentKw.factionTokens || 0) - item.cost,
                                    ...(item.id === 'exp_buff' ? { expBuffBattles: (currentKw.expBuffBattles || 0) + 10 } : {}),
                                    ...(item.id === 'war_ball' ? { warBalls: (currentKw.warBalls || 0) + 1 } : {}),
                                    ...(item.id === 'tiger_seal' ? { attackBuff: true } : {}),
                                  };
                                  kingdomWarRef.current = nextKw;
                                  setKingdomWar(nextKw);

                                  if (item.id === 'heal_all') {
                                    setParty(prev => prev.map(p => ({ ...p, currentHp: getStats(p).maxHp })));
                                    showMapToast('🍖', '军粮补给', '全队生命已恢复', 1800);
                                  } else if (item.id === 'exp_buff') {
                                    showMapToast('📜', '军功令', '接下来 10 场战斗经验 +50%', 1800);
                                  } else if (item.id === 'war_ball') {
                                    showMapToast('⚔️', '国战精灵球', '已加入背包', 1800);
                                  } else if (item.id === 'tiger_seal') {
                                    showMapToast('🐯', '虎符生效', '下一次普通领地或名城攻城攻击力 +50%', 2200);
                                  } else if (item.id === 'war_armor') {
                                    const armor = { id: `kw_armor_${Date.now()}`, baseId: 'kw_armor', name: `${myFaction.fullName}战甲`, displayName: `${myFaction.fullName}战甲`, stat: 'p_atk', value: 8, rarity: 3, desc: `${myFaction.fullName}国战专属战甲 (物攻/物防 +8%)` };
                                    setAccessories(prev => [...prev, armor]);
                                    showMapToast('🛡️', '获得战甲', `${myFaction.fullName}战甲`, 2000);
                                  } else if (item.id === 'jade_seal') {
                                    const seal = { id: `kw_jade_${Date.now()}`, baseId: 'kw_jade', name: '传国玉玺', displayName: '传国玉玺', stat: 'all', value: 5, rarity: 5, desc: '传说中的传国玉玺 (全属性+5%)' };
                                    setAccessories(prev => [...prev, seal]);
                                    unlockTitle('乱世霸主');
                                    showMapToast('👑', '传国玉玺', '解锁称号「乱世霸主」', 3000);
                                  }
                                } finally {
                                  kingdomActionLocksRef.current.delete(shopLockKey);
                                }
                              },
                            });
                          }}
                          style={{
                            padding:'8px 14px', borderRadius:'10px', border:'none', fontSize:'12px', fontWeight:'700',
                            background: canPurchase ? myFaction.color : '#e2e8f0',
                            color: canPurchase ? '#fff' : '#94a3b8',
                            cursor: canPurchase ? 'pointer' : 'not-allowed',
                            whiteSpace:'nowrap',
                          }}>
                            {tigerSealActive ? '已生效' : `${item.cost} 🎖️`}
                          </button>
                        </div>
                      );
                    })}

                    {/* 三国装备兑换 */}
                    <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'2px solid #e2e8f0'}}>
                      <div style={{fontSize:'14px', fontWeight:'800', color:'#1e293b', marginBottom:'10px'}}>🗡️ 三国装备兑换</div>
                      <div style={{fontSize:'11px', color:'#64748b', marginBottom:'10px'}}>国战活动专属装备，也可通过争夺战/攻城战随机获得</div>
                      <div style={{display:'grid', gap:'8px'}}>
                        {KW_EQUIPMENT.filter(e => e.tier <= 3).map(equip => {
                          const equipCost = equip.tier === 2 ? 30 : equip.tier === 3 ? 60 : 120;
                          const canBuy = (kw.factionTokens || 0) >= equipCost;
                          return (
                            <div key={equip.id} style={{
                              background:'#f8fafc', borderRadius:'10px', padding:'10px 12px',
                              display:'flex', alignItems:'center', gap:'10px', border:'1px solid #e2e8f0',
                            }}>
                              <span style={{fontSize:'22px'}}>{equip.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontSize:'12px', fontWeight:'700', color:'#1e293b'}}>{equip.name} <span style={{fontSize:'10px', color:'#64748b'}}>T{equip.tier}</span></div>
                                <div style={{fontSize:'10px', color:'#64748b'}}>{equip.desc}</div>
                              </div>
                              <button onClick={() => {
                                if (!canBuy) { showMapToast('🎖️', '令牌不足', '令牌不足！', 1500); return; }
                                setConfirmModal({ title:'🎖️ 装备购买', msg:`花费 ${equipCost} 令牌购买「${equip.name}」？`, onOk: () => {
                                const newEquip = equip.type === 'HYBRID' ? createUniqueEquip(null, equip) : { ...equip, uid: Date.now() + Math.random() };
                                setAccessories(prev => [...prev, newEquip || { ...equip, uid: Date.now() }]);
                                setKingdomWar(prev => {
                                  const newTokens = (prev.factionTokens || 0) - equipCost;
                                  if (newTokens < 0) return prev;
                                  return { ...prev, factionTokens: newTokens };
                                });
                                showMapToast('🎁', '获得装备', equip.name, 2000);
                                }});
                              }} style={{
                                padding:'6px 10px', borderRadius:'8px', border:'none', fontSize:'11px', fontWeight:'700',
                                background: canBuy ? myFaction.color : '#e2e8f0',
                                color: canBuy ? '#fff' : '#64748b', whiteSpace:'nowrap',
                              }}>
                                {equipCost} 🎖️
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 赛季 */}
                {kwTab === 'season' && (
                  <div style={{display:'grid', gap:'12px'}}>
                    <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'16px', fontWeight:'800', color:'#1e293b', marginBottom:'8px'}}>赛季 S{kw.season || 1}</div>
                      <div style={{fontSize:'12px', color:'#64748b', marginBottom:'12px'}}>剩余 {seasonDaysLeft} 天结算</div>
                      <div style={{display:'grid', gap:'8px'}}>
                        {FACTION_IDS.slice().sort((a, b) => (terrCounts[b] || 0) - (terrCounts[a] || 0)).map((fid, idx) => {
                          const f = FACTIONS[fid];
                          const cnt = terrCounts[fid] || 0;
                          const reward = SEASON_CONFIG.rewards[idx + 1];
                          return (
                            <div key={fid} style={{
                              display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'10px',
                              background: fid === kw.faction ? `${f.color}10` : '#f8fafc',
                              border: fid === kw.faction ? `1px solid ${f.color}40` : '1px solid #e2e8f0',
                            }}>
                              <span style={{fontSize:'18px', fontWeight:'900', color: idx === 0 ? '#f59e0b' : '#64748b'}}>#{idx + 1}</span>
                              <span style={{fontSize:'20px'}}>{f.icon}</span>
                              <div style={{flex:1}}>
                                <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b'}}>{f.fullName} {fid === kw.faction ? '(我方)' : ''}</div>
                                <div style={{fontSize:'11px', color:'#64748b'}}>{cnt} 领地</div>
                              </div>
                              {reward && (
                                <div style={{textAlign:'right', fontSize:'10px', color:'#64748b'}}>
                                  <div>{reward.gold}G + {reward.tokens}T</div>
                                  {reward.title && <div style={{color:'#f59e0b'}}>"{reward.title}"</div>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {kw.seasonTitles && kw.seasonTitles.length > 0 && (
                      <div style={{background:'#fff', borderRadius:'14px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                        <div style={{fontSize:'13px', fontWeight:'700', color:'#1e293b', marginBottom:'8px'}}>历史荣誉</div>
                        <div style={{display:'flex', flexWrap:'wrap', gap:'6px'}}>
                          {kw.seasonTitles.map((t, i) => (
                            <span key={i} style={{background:'#fef3c7', color:'#92400e', padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'600'}}>{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {renderDefectionPanel(true)}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        </div>
      </div>
    );
  
}
