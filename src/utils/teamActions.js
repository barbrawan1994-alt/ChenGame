import { CHAKRA_NATURE_MAP } from '../data/naruto';
import { getEffectiveChakraCost } from './combatRules';

export function buildPartnerCommand(unit, partner, combo, bond) {
  if (!unit || !partner || !combo || !bond) return null;
  const effect = {...combo.effect};
  if (effect.defDown || effect.spdDown) Object.assign(effect,{type:'DEBUFF',stat:effect.defDown ? 'p_def' : 'spd',val:effect.defDown || effect.spdDown,target:'enemy',chance:1});
  return {id:'partner_combo',name:combo.name,p:Math.floor(combo.power*bond.powerMult*0.8),t:combo.type || unit.type,cat:combo.cat || 'physical',acc:100,pp:99,isBattleCommand:true,isPartnerCombo:true,partnerUid:partner.uid || partner.id,effect};
}

// Both participants commit their action. Payment happens only after both can act.
export async function resolveTeamAction(battle, action, context) {
  const {getStats,checkReady,performAction,addLog} = context;
  const members = action.participantIdxs.map(index=>battle.playerCombatStates[index]);
  const combo = action.combo;
  if (members.some(unit=>!unit || unit.currentHp<=0)) {
    addLog(`${combo.name} 中断：参与伙伴已倒下。`);
    return;
  }
  const targetIndex = battle.enemyParty[action.targetIdx]?.currentHp>0 ? action.targetIdx : (battle.enemyActiveIdxs || []).find(index=>battle.enemyParty[index]?.currentHp>0);
  const target = battle.enemyParty[targetIndex];
  if (!target) return;
  const move = {name:combo.name,p:combo.power || 0,t:CHAKRA_NATURE_MAP[combo.natures?.[0]]?.gameType || 'PSYCHIC',cat:combo.cat || 'special',acc:95,pp:99,isComboJutsu:true,effect:combo.effect || null};
  const readiness = [];
  for (const member of members) readiness.push(await checkReady(member,target,move,'player',battle));
  if (readiness.some(ready=>!ready)) { addLog(`${combo.name} 中断：双方未能完成配合，未消耗查克拉。`); return; }
  const cost = getEffectiveChakraCost(combo,battle._resonanceFx || {});
  if ((battle.sharedPlayerChakra || 0)<cost) { addLog(`${combo.name} 中断：共享查克拉不足。`); return; }
  battle.sharedPlayerChakra -= cost;
  for (const member of members) member.chakra = Math.min(member.maxChakra || 0,battle.sharedPlayerChakra);
  addLog(`${members.map(unit=>unit.name).join('与')} 发动 ${combo.name}，消耗 ${cost} 查克拉。`);
  if (combo.id==='medical') {
    for (const member of members) {
      const max = getStats(member).maxHp;
      const healed = Math.min(max-member.currentHp,Math.floor(max*0.3));
      member.currentHp += healed;
      addLog(`${member.name} 恢复 ${healed} HP。`);
      await context.feedback?.(member,`+${healed}`,'heal');
    }
    return;
  }
  if (combo.id==='barrier') {
    for (const member of members) {
      member.volatiles = {...member.volatiles,comboBarrierTurns:2};
      await context.feedback?.(member,'联合结界','guard');
    }
    addLog('双方获得联合结界：两回合内，各抵御一次直接伤害的50%。');
    return;
  }
  const attackStat = combo.cat==='physical' ? 'p_atk' : 's_atk';
  const attacker = getStats(members[0])[attackStat]>=getStats(members[1])[attackStat] ? members[0] : members[1];
  const actorIndex = battle.playerCombatStates.indexOf(attacker);
  if (combo.id==='sealing') Object.assign(move,{p:90,effect:{type:'DEBUFF',stat:'s_def',val:2,chance:1,target:'enemy'}});
  if (combo.id==='genjutsu') Object.assign(move,{p:0,acc:85,effect:{type:'STATUS',status:'SLP',chance:1,target:'enemy'}});
  const targets = combo.id==='genjutsu' ? battle.enemyActiveIdxs : [targetIndex];
  for (const index of targets) {
    const defender = battle.enemyParty[index];
    if (!defender || defender.currentHp<=0 || attacker.currentHp<=0) continue;
    battle.activeIdx = actorIndex;
    battle.enemyActiveIdx = index;
    battle._doubleAnimCtx = {source:'player',atkSlot:battle.activeIdxs.indexOf(actorIndex),defSlot:battle.enemyActiveIdxs.indexOf(index)};
    await performAction(attacker,defender,{...move,effect:move.effect ? {...move.effect} : null},'player',battle,{actionGatePassed:true});
  }
}
