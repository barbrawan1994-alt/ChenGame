import React from 'react';
import { ChevronDown, Coins, RotateCw } from 'lucide-react';
import ActivityScreen from './ActivityScreen';
import { WHEEL_FREE_SPINS_PER_DAY, WHEEL_PAID_SPIN_COST, WHEEL_PITY_INTERVAL } from '../../data/constants';

export default function WheelScreen({ wheel, prizes, today, spinning, rotation, result, gold, onSpin, onBack }) {
  const count = wheel.dailySpinDate === today ? wheel.dailySpinCount || 0 : 0;
  const free = wheel.lastFreeDate !== today && count < WHEEL_FREE_SPINS_PER_DAY;
  const angle = 360 / prizes.length;
  const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
  return <ActivityScreen title="幸运轮盘" status={<span><Coins size={16} /> {gold.toLocaleString()}</span>} onBack={onBack} className="wheel-screen">
    <div className="wheel-layout">
      <section className="wheel-play">
        <div className="wheel-board" aria-label="幸运轮盘">
          <ChevronDown className="wheel-pointer" size={34} />
          <div className="wheel-disc" style={{background:`conic-gradient(${prizes.map((p,i)=>`${p.color} ${i*angle}deg ${(i+1)*angle}deg`).join(',')})`,transform:`rotate(${rotation}deg)`}}>
            {prizes.map((p,i)=>{
              const rad=(i+.5)*angle*Math.PI/180;
              return <span key={p.id} style={{left:`${50+34*Math.sin(rad)}%`,top:`${50-34*Math.cos(rad)}%`}}>{p.icon}</span>;
            })}
          </div>
          <span className="wheel-hub"><RotateCw size={26} /></span>
        </div>
        <div className="wheel-result-slot" role="status">
          {spinning ? <span>抽取中</span> : result ? <strong className="wheel-result" data-prize-id={result.id}>{result.icon} {result.name}</strong> : <span>今日剩余 {WHEEL_FREE_SPINS_PER_DAY-count} 次</span>}
        </div>
        <div className="wheel-actions">
          <button type="button" className="activity-primary" disabled={!free || spinning} onClick={()=>onSpin(false)}><RotateCw size={16} /> {free ? '免费转一次' : '免费次数已用'}</button>
          <button type="button" disabled={spinning || count>=WHEEL_FREE_SPINS_PER_DAY || gold<WHEEL_PAID_SPIN_COST} onClick={()=>onSpin(true)}><Coins size={16} /> {WHEEL_PAID_SPIN_COST.toLocaleString()} 金币</button>
        </div>
        <p className="wheel-counts">今日 {count}/{WHEEL_FREE_SPINS_PER_DAY} · 累计 {wheel.totalSpins || 0} 次 · 保底还需 {WHEEL_PITY_INTERVAL-(wheel.totalSpins || 0)%WHEEL_PITY_INTERVAL} 次</p>
      </section>
      <section className="wheel-prizes"><div className="activity-section-heading"><h2>奖池</h2><span>常规概率</span></div>
        {prizes.map(p=><div className={`wheel-prize-row ${result?.id===p.id&&!spinning?'is-selected':''}`} key={p.id}><span>{p.icon}</span><strong>{p.name}</strong><span>{(p.weight/totalWeight*100).toFixed(1)}%</span></div>)}
      </section>
    </div>
  </ActivityScreen>;
}
