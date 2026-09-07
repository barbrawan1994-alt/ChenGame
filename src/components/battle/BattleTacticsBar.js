import React from 'react';
import { Crosshair, Undo2, Shield, Zap, Swords } from 'lucide-react';
import { COMBAT_FAMILIES } from '../../data/battleTactics';
import { getCombatFamily, getBattleCommand, getBurstBlock } from '../../utils/battleTactics';

export function CombatFamilyTabs({moves,family,onChange}) {
  const available=COMBAT_FAMILIES.filter(item=>moves.some(move=>getCombatFamily(move)===item.id));
  if(available.length<2) return null;
  return <div className="combat-family-tabs" role="tablist" aria-label="招式体系">{available.map(item=><button type="button" key={item.id} role="tab" aria-selected={family===item.id} onClick={()=>onChange(item.id)} style={{'--family-color':item.color}}>{item.name}<span>{moves.filter(move=>getCombatFamily(move)===item.id).length}</span></button>)}</div>;
}

export function TacticalStatus({unit,turn}) {
  return <>
    {unit?.volatiles?.tacticalOpening?.expiresAt>turn && <span className="tactical-status opening" title="另一体系或双打另一伙伴的下一次有效攻击获得20%协同增益，计入60%主动增益上限"><Crosshair size={11}/>破绽</span>}
    {unit?.volatiles?.breathingFocus>0 && <span className="tactical-status focus" title="接下来的呼吸斩技增伤25%"><Swords size={11}/>集中 {unit.volatiles.breathingFocus}</span>}
    {unit?.volatiles?.tacticalGuard?.expiresAt>turn && <span className="tactical-status guard"><Shield size={11}/>防御</span>}
  </>;
}

export default function BattleTacticsBar({battle,onUndo}) {
  if(battle.isPvP) return null;
  const indexes=battle.isDouble ? battle.enemyActiveIdxs : [battle.enemyActiveIdx];
  const action=battle.doubleActions?.[0];
  const queued=action && (getBattleCommand(action.moveIdx) || battle.playerCombatStates[action.activeIdx]?.combatMoves?.[action.moveIdx]);
  return <div className="battle-tactics-bar">
    <div className="battle-intents" aria-label="敌方意图">{indexes.map(index=>{
      const enemy=battle.enemyParty[index],plan=battle.enemyPlans?.[index];
      if(!enemy || enemy.currentHp<=0) return null;
      const hidden=battle.domainRule==='dark_moon' && !battle._darkMoonScouted;
      const target=battle.playerCombatStates[plan?.targetIdx];
      return <div className="battle-intent" key={index} title={hidden ? '暗月规则遮蔽敌方意图' : `${enemy.name}：${plan?.move?.name || '观察中'}${target ? `，目标 ${target.name}` : ''}`}><Crosshair size={13}/><span>{enemy.name}</span><strong>{hidden ? '意图未知' : plan?.move?.name || '观察中'}</strong>{battle.isDouble && target && <small>{target.name}</small>}</div>;
    })}</div>
    {battle.phase==='double_input_2' && queued && <div className="battle-queued-action"><span>{battle.playerCombatStates[action.activeIdx]?.name}</span><strong>{queued.name}</strong><button type="button" onClick={onUndo} aria-label="修改首位指令" title="修改首位指令"><Undo2 size={15}/></button></div>}
    <span className={`battle-burst-status ${getBurstBlock(battle) ? 'spent' : ''}`} title="果实、尾兽与光之变身共享每队每场一次爆发机会"><Zap size={13}/>{getBurstBlock(battle) ? '爆发已用' : '爆发 1/1'}</span>
  </div>;
}
