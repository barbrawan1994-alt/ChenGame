/**
 * PVE 战斗规则处理 — 灵域试炼、生态事件、Boss 机制
 * 由 App.js 在回合开始/结束/伤害计算时调用
 */

import { getSpiritDomainRule } from '../data/spiritDomains';
import { getBossMechanicDef, checkForestWillEcology, getBossPhaseForHp } from '../data/bossMechanics';
import { getAdaptationMult } from '../data/ecoAdaptation';

export function getDomainRuleId(battleState) {
  return battleState?.domainRule;
}

// Fix#15: 双向藤蔓封锁
export function shouldForestVineBlock(battleState, source) {
  const rule = getSpiritDomainRule(battleState?.domainRule);
  if (!rule) return false;
  if (rule.id === 'forest_growth' || battleState.domainRule === 'forest_vine') {
    const interval = rule.vineGrowInterval || 3;
    const turn = (battleState.turnCount || 0) + 1;
    const growBonus = turn > 0 && turn % interval === 0 ? 0.15 : 0;
    const baseChance = (rule.vineBlockChance || 0.25) + growBonus + (battleState._ecoVineBonus || 0);
    const chance = source === 'player' ? baseChance : baseChance * 0.6;
    return Math.random() < chance;
  }
  return false;
}

// Fix#2: 使用传入的真实速度而非 _effectiveSpd
export function shouldGravitySkip(battleState, source, attacker, playerSpd, enemySpd) {
  if (!battleState?._gravityActive) return false;
  const atkSpd = source === 'player' ? playerSpd : enemySpd;
  const otherSpd = source === 'player' ? enemySpd : playerSpd;
  return atkSpd < otherSpd;
}

export function calcFireHeatPPExtra(battleState, move) {
  const rule = getSpiritDomainRule(battleState?.domainRule);
  if (!rule || (rule.id !== 'fire_heat' && battleState.domainRule !== 'fire_heat')) return 0;
  return move?.t === 'WATER' ? (rule.waterPPExtra || 1) : 0;
}

// Fix#8: 非破盾属性仅减伤70%而非完全免疫
export function applyStarShieldDamage(defender, move, dmg, battleState) {
  if (dmg <= 0 || (defender._starShield || 0) <= 0) return dmg;
  if (battleState?.type !== 'world_boss' && !battleState?.ecoBossMechanics) return dmg;
  const def = getBossMechanicDef('star_dream');
  const breakTypes = def?.shieldTypes || ['FAIRY', 'PSYCHIC'];
  if (breakTypes.includes(move?.t)) {
    const absorbed = Math.min(defender._starShield, dmg);
    defender._starShield -= absorbed;
    return dmg - absorbed;
  }
  return Math.floor(dmg * 0.3);
}

// Fix#1 + Fix#16 + Fix#17: 回合开始处理灵域规则 (火热DOT + 风眼重置 + 藤蔓生长 + 草系回血)
export function processDomainTurnStart(state, player, enemy, addLog, getStats) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule) return;
  const turn = (state.turnCount || 0) + 1;

  if (rule.id === 'fire_heat' || state.domainRule === 'fire_heat') {
    [player, enemy].forEach(u => {
      if (!u || u.currentHp <= 0) return;
      const types = [u.type, u.secondaryType, u.type2].filter(Boolean);
      if (types.some(t => rule.heatTypes?.includes(t))) return;
      const maxHp = getStats ? getStats(u).maxHp : (u.maxHp || 100);
      const dot = Math.max(1, Math.floor(maxHp * (rule.heatDotPct || 0.02)));
      u.currentHp = Math.max(0, u.currentHp - dot);
      if (addLog) addLog(`🔥 高温灼烧！${u.name} 受到 ${dot} 点伤害`);
    });
  }

  if (rule.id === 'wind_tower' || state.domainRule === 'wind_tower') {
    if (turn % (rule.windEyeInterval || 5) === 0) {
      if (player) player._windFatigue = 0;
      if (enemy) enemy._windFatigue = 0;
      if (addLog) addLog('💨 风眼出现！双方疲劳清零');
    }
  }

  if (rule.id === 'forest_growth' && turn % (rule.vineGrowInterval || 3) === 0) {
    state._vineActive = true;
    if (addLog) addLog('🌿 藤蔓格生长！木系站在藤蔓上会回血');
  }

  // Fix#16: 草系/植物系站藤蔓回血
  if (state._vineActive) {
    [player, enemy].forEach(u => {
      if (!u || u.currentHp <= 0) return;
      const types = [u.type, u.secondaryType, u.type2].filter(Boolean);
      if (types.some(t => ['GRASS', 'BUG'].includes(t))) {
        const maxHp = getStats ? getStats(u).maxHp : (u.maxHp || 100);
        const heal = Math.max(1, Math.floor(maxHp * (rule.grassHealPct || 0.05)));
        u.currentHp = Math.min(maxHp, u.currentHp + heal);
        if (addLog) addLog(`🌿 ${u.name} 借助藤蔓恢复了 ${heal} HP`);
      }
    });
  }
}

export function processBossMechanicsTurnEnd(state, player, enemy, addLog, getStats) {
  if (!state || enemy?.currentHp <= 0) return { playerDied: false };
  let playerDied = false;
  const wb = state.worldBoss;
  const phases = wb?.phases ?? state.bossPhases;
  if (!phases && !state.ecoBossMechanics) return { playerDied };

  const maxHp = getStats ? getStats(enemy).maxHp : (enemy.maxHp || 1);
  const hpPct = enemy.currentHp / maxHp;
  const phase = getBossPhaseForHp(phases, hpPct);

  // Fix#5: 检查 skipMechanic
  const skipList = state._skipMechanics || [];

  if (phase?.mechanic === 'meteor_summon' && !skipList.includes('meteor_summon') && player?.currentHp > 0 && Math.random() < 0.3) {
    const meteorDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.05));
    player.currentHp = Math.max(0, player.currentHp - meteorDmg);
    if (addLog) addLog(`☄️ 小陨石坠落！${player.name} 受到 ${meteorDmg} 点伤害`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'vine_spread' && !skipList.includes('vine_spread') && player?.currentHp > 0 && Math.random() < 0.35) {
    const vineDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.04));
    player.currentHp = Math.max(0, player.currentHp - vineDmg);
    if (addLog) addLog(`🌿 黑藤吸收生命！${player.name} 失去 ${vineDmg} HP`);
    if (player.currentHp <= 0) playerDied = true;
    if (state._crisisBranch === 'heal') {
      enemy._vineAnger = (enemy._vineAnger || 0) + 1;
    }
  }

  if (phase?.mechanic === 'sand_quicksand' && !skipList.includes('sand_quicksand') && player?.currentHp > 0 && Math.random() < 0.32) {
    const sandDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.045));
    player.currentHp = Math.max(0, player.currentHp - sandDmg);
    if (addLog) addLog(`🏜️ 流沙下陷！${player.name} 失去 ${sandDmg} HP`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'core_rampage' && !skipList.includes('core_rampage') && player?.currentHp > 0 && Math.random() < 0.4) {
    const coreDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.06));
    player.currentHp = Math.max(0, player.currentHp - coreDmg);
    if (addLog) addLog(`💥 砂核蓄力爆发！${player.name} 受到 ${coreDmg} 点冲击`);
    if (player.currentHp <= 0) playerDied = true;
    if (state.battleObjective === 'purify') {
      state._purifyProgress = Math.min(100, (state._purifyProgress ?? 100) + 8);
      if (addLog) addLog(`⚠️ 砂核暴走使净化进度回退！`);
    }
  }

  if (phase?.mechanic === 'rock_armor' && !skipList.includes('rock_armor') && !enemy._rockArmor) {
    enemy._rockArmor = true;
    enemy._ecoShield = (enemy._ecoShield || 0) + Math.floor(maxHp * 0.15);
    if (addLog) addLog(`🪨 ${enemy.name} 岩壁护甲展开！土系攻击更有效`);
  }

  if (phase?.mechanic === 'blood_mist' && !skipList.includes('blood_mist') && player?.currentHp > 0 && Math.random() < 0.28) {
    const mistDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.035));
    player.currentHp = Math.max(0, player.currentHp - mistDmg);
    if (addLog) addLog(`🌫️ 血雾侵蚀！${player.name} 失去 ${mistDmg} HP（光系/封印可驱散）`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'tail_flame' && !skipList.includes('tail_flame') && player?.currentHp > 0 && Math.random() < 0.32) {
    const flameDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.05));
    player.currentHp = Math.max(0, player.currentHp - flameDmg);
    if (addLog) addLog(`🔥 尾炎横扫！${player.name} 受到 ${flameDmg} 点伤害（水系/封印可减伤）`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'chakra_drain' && !skipList.includes('chakra_drain') && player?.currentHp > 0 && Math.random() < 0.3) {
    if (player.moves?.length) {
      const m = player.moves[Math.floor(Math.random() * player.moves.length)];
      if (m && m.pp > 0) m.pp = Math.max(0, m.pp - 1);
    }
    const drainDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : player.maxHp) * 0.025));
    player.currentHp = Math.max(0, player.currentHp - drainDmg);
    if (addLog) addLog(`💧 查克拉吸取！${player.name} PP 被吸走，失去 ${drainDmg} HP（雷系可打断）`);
    if (player.currentHp <= 0) playerDied = true;
  }

  if (phase?.mechanic === 'seal_resist' && !skipList.includes('seal_resist') && !enemy._sealResist) {
    const chakraOk = (state._chapterVars?.chakraReserve ?? 0) >= 50;
    enemy._sealResist = true;
    if (!chakraOk) {
      enemy._ecoShield = (enemy._ecoShield || 0) + Math.floor(maxHp * 0.2);
      if (addLog) addLog(`⛩️ ${enemy.name} 封印抗性展开！查克拉储备不足，输出大幅降低`);
    } else if (addLog) {
      addLog(`⛩️ 查克拉节点已激活，封印抗性被削弱！`);
    }
  }

  if (phase?.mechanic === 'forest_will' && !skipList.includes('forest_will')) {
    const ecology = state._regionEcology;
    if (checkForestWillEcology(ecology)) {
      if (!enemy._forestAid && addLog) {
        addLog('🌳 森林意志相助！黑藤生成速度降低，我方精灵回血');
        enemy._forestAid = true;
      }
      if (player?.currentHp > 0) {
        const pMaxHp = getStats ? getStats(player).maxHp : (player.maxHp || 100);
        const heal = Math.max(1, Math.floor(pMaxHp * 0.03));
        player.currentHp = Math.min(pMaxHp, player.currentHp + heal);
      }
    }
  }

  // Fix#4: 寄生机制 — 标记后治疗会流向Boss
  if (phase?.mechanic === 'parasite' && !state._parasiteApplied && player?.currentHp > 0) {
    state._parasiteApplied = true;
    state._parasiteTarget = 'player';
    if (addLog) addLog(`🦠 ${enemy.name} 寄生了你的 ${player.name}！治疗将部分流向Boss`);
  }

  // Fix#6: mirror_clones 简化实现 — Boss产生分身，攻击假身反伤
  if (phase?.mechanic === 'mirror_clones' && !state._mirrorClonesActive) {
    state._mirrorClonesActive = true;
    state._mirrorCloneHits = 0;
    if (addLog) addLog(`🪞 ${enemy.name} 产生了镜像分身！攻击假身会受到反伤`);
  }

  // Fix#6: skill_echo 简化实现 — Boss复制玩家上一招（35%概率）
  if (phase?.mechanic === 'skill_echo' && !skipList.includes('skill_echo') && player?.currentHp > 0 && state._lastPlayerMove?.p > 0 && Math.random() < 0.35) {
    const echoMove = { ...state._lastPlayerMove, pp: 99 };
    const echoDmg = Math.max(1, Math.floor((getStats ? getStats(player).maxHp : (player.maxHp || 100)) * 0.04));
    player.currentHp = Math.max(0, player.currentHp - echoDmg);
    if (addLog) addLog(`🔄 ${enemy.name} 回响了【${echoMove.name}】！${player.name} 受到 ${echoDmg} 伤害`);
    if (player.currentHp <= 0) playerDied = true;
  }

  // dream_song: 催眠声波 — 30%概率使玩家下回合无法行动
  if (phase?.mechanic === 'dream_song' && !skipList.includes('dream_song') && player?.currentHp > 0 && Math.random() < 0.3) {
    state._playerSkipNextTurn = true;
    if (addLog) addLog(`🎵 ${enemy.name} 发出了催眠歌声！${player.name} 陷入迷惑，下回合无法行动`);
  }

  // rage_stack: 狂怒叠加 — Boss每回合叠加攻击力
  if (phase?.mechanic === 'rage_stack' && !skipList.includes('rage_stack') && enemy?.currentHp > 0) {
    state._bossRageStacks = (state._bossRageStacks || 0) + 1;
    const rageMult = 1 + state._bossRageStacks * 0.08;
    enemy._rageMult = Math.min(2.5, rageMult);
    if (state._bossRageStacks % 3 === 0 && addLog) {
      addLog(`💢 ${enemy.name} 的怒气持续累积！攻击力 ×${enemy._rageMult.toFixed(1)}`);
    }
  }

  state._gravityActive = phase?.mechanic === 'gravity_field';
  if (phase?.mechanic === 'star_dream' && phase.shield && (enemy._starShield || 0) <= 0) {
    enemy._starShield = phase.shield;
    if (addLog) addLog(`✨ ${enemy.name} 展开星海护盾！使用妖精/超能系可破盾`);
  }

  return { playerDied };
}

export function getMirrorLakeMove(state) {
  if (state.domainRule !== 'mirror_lake' && getSpiritDomainRule(state.domainRule)?.id !== 'mirror_lake') return null;
  const echo = state._echoQueue?.[0] || state._lastPlayerMove;
  return echo?.p > 0 ? { ...echo, pp: 99 } : null;
}

export function queueMirrorEcho(state, move) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule || rule.id !== 'mirror_lake') {
    if (state.domainRule === 'mirror_lake' && move?.p > 0) {
      state._lastPlayerMove = { name: move.name, p: move.p, t: move.t, cat: move.cat, acc: move.acc || 100, effect: move.effect };
    }
    return;
  }
  if (!move?.p) return;
  const echo = { name: move.name, p: move.p, t: move.t, cat: move.cat, acc: move.acc || 100, effect: move.effect };
  if (move.p >= 80 && rule.bigMoveRecoil) state._echoRecoilPending = rule.bigMoveRecoil;
  state._lastPlayerMove = echo;
  if (!state._echoQueue) state._echoQueue = [];
  state._echoQueue.push(echo);
}

// Fix#7: 应用镜湖大招反伤
export function applyMirrorEchoRecoil(state, player, addLog, getStats) {
  if (!state._echoRecoilPending || !player || player.currentHp <= 0) return false;
  const pct = state._echoRecoilPending;
  state._echoRecoilPending = 0;
  const maxHp = getStats ? getStats(player).maxHp : (player.maxHp || 100);
  const recoil = Math.max(1, Math.floor(maxHp * pct));
  player.currentHp = Math.max(0, player.currentHp - recoil);
  if (addLog) addLog(`🪞 镜湖回声反伤！${player.name} 受到 ${recoil} 点伤害`);
  return player.currentHp <= 0;
}

// Fix#9: 风塔追击 — 双方都有疲劳限制
export function processWindTowerFollowUp(state, player, enemy, performAction, addLog, getStats) {
  const rule = getSpiritDomainRule(state?.domainRule);
  if (!rule || (rule.id !== 'wind_tower' && state.domainRule !== 'wind_tower')) return null;
  if (!player || !enemy || player.currentHp <= 0 || enemy.currentHp <= 0) return null;
  const pSpd = getStats(player, player.stages, player.status).spd * (player._adaptMult || 1);
  const eSpd = getStats(enemy, enemy.stages, enemy.status).spd;
  if (pSpd === eSpd) return null;
  const fasterSide = pSpd > eSpd ? 'player' : 'enemy';
  const faster = pSpd > eSpd ? player : enemy;
  const slower = pSpd > eSpd ? enemy : player;
  const power = Math.max(20, Math.floor((faster.level || 30) * (rule.followUpPower || 0.35)));
  const followMove = { name: '风塔追击', p: power, t: 'FLYING', cat: 'special', acc: 100, pp: 99 };
  // 双方都累积疲劳
  faster._windFatigue = (faster._windFatigue || 0) + (rule.fatiguePerFastAction || 25);
  if (faster._windFatigue >= (rule.fatigueThreshold || 100)) {
    if (addLog) addLog(`💨 ${faster.name} 疲劳过度，跳过追击！`);
    faster._windFatigue = 0;
    return null;
  }
  if (addLog) addLog(`💨 风塔乱流！${faster.name} 发动追击！`);
  return { faster, slower, followMove, fasterSide };
}

export function applyAdaptationToCombatState(state, party, mapId) {
  if (!state?.playerCombatStates || !mapId) return;
  state.playerCombatStates.forEach((cs, i) => {
    const pet = party?.[i];
    if (!pet || !cs) return;
    const mult = getAdaptationMult(pet, mapId);
    cs._adaptMult = mult;
  });
}

export function isDarkMoonHidden(battleState) {
  const rule = getSpiritDomainRule(battleState?.domainRule);
  return (rule?.id === 'dark_moon' || battleState?.domainRule === 'dark_moon') && !battleState?._darkMoonScouted;
}

// Fix#3: 暗月侦查判定（光系/超能系/妖精系可侦查）
export function canDarkMoonScout(move) {
  const rule = getSpiritDomainRule('dark_moon');
  const scoutTypes = rule?.scoutTypes || ['FAIRY', 'PSYCHIC', 'LIGHT'];
  return scoutTypes.includes(move?.t);
}

// Fix#4: 寄生治疗重定向 — 返回实际治疗量(扣除流向Boss的部分)
export function applyParasiteHealRedirect(state, healAmount, enemy, addLog, getStats) {
  if (!state?._parasiteApplied || !enemy || enemy.currentHp <= 0) return healAmount;
  const redirectPct = 0.5;
  const redirected = Math.floor(healAmount * redirectPct);
  const actual = healAmount - redirected;
  if (redirected > 0) {
    const maxHp = getStats ? getStats(enemy).maxHp : (enemy.maxHp || 9999);
    enemy.currentHp = Math.min(maxHp, enemy.currentHp + redirected);
    if (addLog) addLog(`🦠 寄生吸收！${redirected} 点治疗流向了Boss`);
  }
  return actual;
}

// Fix#6: 镜像分身反伤判定
export function checkMirrorCloneReflect(state, source, addLog) {
  if (!state?._mirrorClonesActive || source !== 'player') return 0;
  state._mirrorCloneHits = (state._mirrorCloneHits || 0) + 1;
  if (state._mirrorCloneHits <= 2 && Math.random() < 0.4) {
    if (addLog) addLog(`🪞 攻击击中了镜像分身！`);
    return 0.15;
  }
  if (state._mirrorCloneHits >= 3) {
    state._mirrorClonesActive = false;
    if (addLog) addLog(`🪞 镜像分身消散！`);
  }
  return 0;
}
