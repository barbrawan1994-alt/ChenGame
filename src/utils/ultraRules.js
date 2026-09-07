import { ULTRA_BY_ID, ULTRA_HEROES, ULTRA_ROLES, ULTRA_STARTERS, ULTRA_DURATION, ULTRA_MIN_TURN } from '../data/ultra';
import { getBurstBlock } from './battleTactics';

export function normalizeUltraState(raw) {
  const validIds = values => [...new Set((Array.isArray(values) ? values : []).filter(id=>typeof id==='string' && ULTRA_BY_ID[id]?.id===id))];
  const trialWins = validIds(raw?.trialWins);
  const legacy = raw?.version>=2 ? [] : ULTRA_HEROES.filter(hero=>Array.isArray(raw?.cleared) && raw.cleared.includes(hero.era)).map(hero=>hero.id);
  const unlockedHeroIds = validIds([...ULTRA_STARTERS,...legacy,...validIds(raw?.unlockedHeroIds),...trialWins]);
  const heroId = unlockedHeroIds.includes(raw?.heroId) ? raw.heroId : 'tiga';
  const hero = ULTRA_BY_ID[heroId];
  return { version: 2, unlockedHeroIds, trialWins, heroId, formId: hero.forms.some(form => form.id === raw?.formId) ? raw.formId : hero.forms[0].id, hostUid: ['string', 'number'].includes(typeof raw?.hostUid) ? raw.hostUid : null };
}

export function isUltraUnlocked(state, heroId) {
  return ULTRA_BY_ID[heroId]?.id===heroId && (state?.version===2 && Array.isArray(state.unlockedHeroIds) ? state.unlockedHeroIds : normalizeUltraState(state).unlockedHeroIds).includes(heroId);
}

export function getUltraForm(heroId, formId) {
  const hero = ULTRA_BY_ID[heroId];
  return hero?.forms.find(form => form.id === formId) || hero?.forms[0] || null;
}

export function getUltraStatMultiplier(unit, stat) {
  if (!unit?.ultraTransformed || unit.ultraTurnsLeft <= 0 || unit.fruitTransformed || unit.bijuuTransformed) return 1;
  const form = getUltraForm(unit.ultraHeroId, unit.ultraFormId);
  return ULTRA_ROLES[form?.role]?.stats[stat] || 1;
}

export function clearUltraUnit(unit) {
  if (!unit) return unit;
  const next = { ...unit };
  for (const key of Object.keys(next)) if (key.startsWith('ultra')) delete next[key];
  if (next.moves) next.moves = next.moves.filter(move => !move.isUltraFinisher);
  if (next.combatMoves) next.combatMoves = next.combatMoves.filter(move => !move.isUltraFinisher);
  return next;
}

export function assignUltraContract(unit, state, battleType, isEnemy = false) {
  const clean = clearUltraUnit(unit);
  if (isEnemy || ['pvp', 'arena', 'contest_bug', 'race'].includes(battleType)) return clean;
  const normalized = normalizeUltraState(state);
  if (unit.uid !== normalized.hostUid) return clean;
  return { ...clean, ultraHeroId: normalized.heroId, ultraFormId: normalized.formId, ultraTransformed: false, ultraTurnsLeft: 0 };
}

export function getUltraTransformBlock(battle, unit) {
  if (!battle || !['input', 'double_input_2'].includes(battle.phase)) return '等待行动阶段';
  if (['pvp', 'arena', 'contest_bug', 'race'].includes(battle.type)) return '本场规则禁止光之变身';
  if (!unit || unit.currentHp <= 0 || !ULTRA_BY_ID[unit.ultraHeroId]) return '当前伙伴未缔结契约';
  if (getBurstBlock(battle)) return getBurstBlock(battle);
  if (unit.fruitTransformed || unit.bijuuTransformed) return '需先结束果实或尾兽变身';
  if ((battle.turnCount || 0) < ULTRA_MIN_TURN) return '第一回合结束后可变身';
  return '';
}

export function buildUltraFinisher(heroId, formId) {
  const form = getUltraForm(heroId, formId);
  if (!form) return null;
  const role = ULTRA_ROLES[form.role];
  return { id: `ultra_${heroId}_${form.id}`, name: form.finisher, p: role.power, t: role.type, category: role.category, acc: 100, pp: 1, maxPP: 1, isUltraFinisher: true, ...(form.role === 'healer' ? { effect: { type: 'HEAL', target: 'self', val: 0.30 } } : {}) };
}

export function activateUltra(battle, index) {
  const unit = battle?.playerCombatStates?.[index];
  if (getUltraTransformBlock(battle, unit)) return battle;
  const transformed = { ...unit, ultraTransformed: true, ultraTurnsLeft: ULTRA_DURATION, ultraExpiresAt: (battle.turnCount || 0) + ULTRA_DURATION,
    combatMoves: [...(unit.combatMoves || []).filter(move => !move.isUltraFinisher), buildUltraFinisher(unit.ultraHeroId, unit.ultraFormId)] };
  return { ...battle, ultraUsed: true, burstUsed: {...battle.burstUsed,player:'ultra'}, playerCombatStates: battle.playerCombatStates.map((pet, i) => i === index ? transformed : pet), logs: [...(battle.logs || []), `${unit.name} 与 ${ULTRA_BY_ID[unit.ultraHeroId].name} 同步，光能计时启动！`] };
}

// Keep the contract and team expenditure; only the temporary projection expires.
export function endUltra(unit) {
  unit.ultraTransformed = false;
  unit.ultraTurnsLeft = 0;
  delete unit.ultraExpiresAt;
  unit.combatMoves = (unit.combatMoves || []).filter(move => !move.isUltraFinisher);
}

// Absolute round deadlines make repeated settlement idempotent, including bench slots.
export function settleUltraRound(battle) {
  if (!battle?.playerCombatStates?.some(unit => unit.ultraTransformed)) return battle;
  return { ...battle, playerCombatStates: battle.playerCombatStates.map(unit => {
    if (!unit.ultraTransformed) return unit;
    const next = { ...unit, ultraTurnsLeft: Math.max(0, (unit.ultraExpiresAt || 0) - (battle.turnCount || 0)) };
    if (next.currentHp <= 0 || next.ultraTurnsLeft <= 0) endUltra(next);
    return next;
  }) };
}

export function completeUltraTrial(state, heroId) {
  const normalized = normalizeUltraState(state);
  if (typeof heroId!=='string' || ULTRA_BY_ID[heroId]?.id!==heroId || normalized.trialWins.includes(heroId)) return { state: normalized, firstClear: false, newlyUnlocked:false };
  const newlyUnlocked = !normalized.unlockedHeroIds.includes(heroId);
  return { state: { ...normalized, trialWins:[...normalized.trialWins,heroId],unlockedHeroIds:newlyUnlocked ? [...normalized.unlockedHeroIds,heroId] : normalized.unlockedHeroIds }, firstClear: true, newlyUnlocked };
}
