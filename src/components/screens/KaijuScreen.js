import React, { useState } from 'react';
import { ArrowLeft, Swords, ShieldCheck, Coins, BookOpen } from 'lucide-react';
import KaijuDex from './KaijuDex';
import { KAIJU_BY_ID, KAIJU_STYLES } from '../../data/kaiju';
import { KAIJU_RAIDS } from '../../data/kaijuRaids';
import { getRaidBlock, getRaidReward } from '../../utils/kaijuRaids';
import './UltraScreen.css';
import './KaijuScreen.css';

export default function KaijuScreen({progress,raids,party,badges,gold,today,onBack,onRaid,result,initialTab='dex'}) {
  const [tab,setTab]=useState(result ? 'raids' : initialTab);
  const [selected,setSelected]=useState(result?.raidId || KAIJU_RAIDS[0].id);
  const raid=KAIJU_RAIDS.find(item=>item.id===selected) || KAIJU_RAIDS[0];
  const boss=KAIJU_BY_ID[raid.boss];
  const reward=getRaidReward(raids,raid,today);
  const block=getRaidBlock(raid,party,badges.length,gold);
  return <section className="screen ultra-screen" aria-label="怪兽档案">
    <header className="ultra-header"><button className="ultra-icon-button" onClick={onBack} aria-label="返回游戏" title="返回游戏"><ArrowLeft size={20}/></button><div><span className="ultra-eyebrow">KAIJU ARCHIVE</span><h1>怪兽档案</h1></div><nav aria-label="怪兽档案页签"><button aria-pressed={tab==='dex'} onClick={()=>setTab('dex')}><BookOpen size={15}/>怪兽图鉴</button><button aria-pressed={tab==='raids'} onClick={()=>setTab('raids')}><Swords size={15}/>灾厄讨伐</button></nav><span className="ultra-count">讨伐首胜 {raids.clearedIds.length} / {KAIJU_RAIDS.length}</span></header>
    {tab==='dex' ? <KaijuDex progress={progress}/> : <div className="raid-workspace">
      <aside className="ultra-chapter-list" aria-label="讨伐任务">{KAIJU_RAIDS.map(item=><button key={item.id} aria-pressed={item.id===selected} onClick={()=>setSelected(item.id)}><img src={KAIJU_BY_ID[item.boss].portrait} width="48" height="48" alt=""/><div><strong>{item.title}</strong><small>Lv.{item.level} · {item.double ? '双打' : '连续单打'}</small></div>{raids.clearedIds.includes(item.id) && <ShieldCheck size={18}/>}</button>)}</aside>
      <main className="raid-briefing"><div className="raid-boss-art"><img src={boss.portrait} alt={boss.name}/><div><span>{boss.series}</span><h2>{raid.title}</h2><p>{boss.name} · Lv.{raid.level}</p></div></div><div className="raid-copy"><p>{raid.story}</p><h3>作战情报</h3><p>{raid.hint}</p><div className="raid-enemies">{[raid.boss,...raid.guards].map((id,index)=><div key={`${id}:${index}`}><img src={KAIJU_BY_ID[id].portrait} alt="" width="56" height="56"/><span>{KAIJU_BY_ID[id].name}<small>{id===raid.boss ? `半血阶段 · ${KAIJU_STYLES[raid.style].name}` : KAIJU_STYLES[KAIJU_BY_ID[id].style].name}</small></span></div>)}</div><dl className="raid-terms"><div><dt>参战条件</dt><dd>{raid.badges} 枚徽章 · 前四名存活伙伴 · 至少 {raid.double ? 3 : 2} 名 · 均需 Lv.{raid.level-10}</dd></div><div><dt>首次奖励</dt><dd>{raid.gold.toLocaleString()} 金币 · 定向能力药剂 ×1 · 文柚果 ×5 · 讨伐首胜记录</dd></div><div><dt>重复奖励</dt><dd>每日每项首胜 {raid.repeatGold} 金币与文柚果 ×2；当天再次胜利仅返还押金</dd></div><div><dt>失败代价</dt><dd>出征扣 {raid.stake} 金币押金，胜利全额退还；战败、撤退或刷新均损失押金</dd></div><div><dt>战场规则</dt><dd>禁止背包与捕获；保留精灵、忍术、呼吸法、装备与变身器。结束后恢复原队伍，不发放常规经验或掉落。</dd></div></dl></div></main>
      <aside className="raid-dispatch"><Coins size={22}/><h3>本次结算预览</h3><p>{reward.firstClear ? '首次讨伐' : reward.gold ? '今日首胜' : '今日奖励已领取'}</p><strong className="raid-reward">+{reward.gold.toLocaleString()} 金币</strong><p>胜利另返还 {raid.stake} 金币押金</p>{reward.vitamin && <p>能力药剂 ×1</p>}{reward.berries>0 && <p>文柚果 ×{reward.berries}</p>}<hr/><p>战败或撤退：损失 {raid.stake} 金币</p>{result?.raidId===raid.id && <p role="status" className="raid-result">{result.won ? `讨伐成功，押金已退还，获得 ${result.gold} 金币奖励。` : `讨伐失败，损失 ${raid.stake} 金币押金。队伍已恢复。`}</p>}{block && <p role="status">{block}</p>}<button className="ultra-primary" disabled={!!block} title={block || `支付 ${raid.stake} 金币押金出征`} onClick={()=>onRaid(raid.id)}><Swords size={17}/>出征讨伐</button></aside>
    </div>}
  </section>;
}
