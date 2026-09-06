import React, { useEffect, useState } from 'react';
import { Check, Coins, Clock, Dumbbell } from 'lucide-react';
import ActivityScreen from './ActivityScreen';
import { TRAINING_CAMPS, TRAINING_TIERS, TRAINING_MAX_SLOTS, calcTrainingGain } from '../../data/training';
import { getTrainingAvailability } from '../../utils/activityRules';

export default function TrainingScreen({ party, box, training, expeditions, workers, badges, gold, today, onBack, onStart, onCollect, renderAvatar }) {
  const [selection, setSelection] = useState(null);
  const [now, setNow] = useState(Date.now());
  const slots = training.slots || [];
  const dailyCount = training.lastResetDate === today ? training.dailyCount || {} : {};
  useEffect(() => {
    if (!slots.length) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [slots.length]);

  return (
    <ActivityScreen title="精灵特训" status={<><span><Coins size={16} /> {gold.toLocaleString()}</span><span>训练位 {slots.length}/{TRAINING_MAX_SLOTS}</span></>} onBack={onBack} className="training-screen">
      {slots.length > 0 && <section className="training-active">
        <h2>进行中的训练</h2>
        {slots.map((slot, index) => {
          const pet = [...party, ...box].find(p => p.uid === slot.petUid);
          const remaining = Math.max(0, slot.duration - (now - slot.startTime));
          const camp = TRAINING_CAMPS.find(c => c.id === slot.campId);
          return <div className="training-session" key={`${slot.petUid}:${slot.startTime}`}>
            <div><strong>{pet?.nickname || pet?.name || '伙伴'}</strong><span>{camp?.name}</span></div>
            <progress max={slot.duration} value={Math.max(0, slot.duration - remaining)} aria-label="训练进度" />
            {remaining > 0 ? <span className="training-time"><Clock size={15} /> {Math.floor(Math.ceil(remaining / 1000) / 60)}:{String(Math.ceil(remaining / 1000) % 60).padStart(2, '0')}</span>
              : <button type="button" onClick={() => onCollect(index)} className="activity-primary"><Check size={16} /> 领取成果</button>}
          </div>;
        })}
      </section>}
      <div className="activity-section-heading"><h2>队伍训练计划</h2><span>每日每位伙伴 1 次</span></div>
      <div className="training-roster">
        {party.map(pet => {
          const reason = getTrainingAvailability(pet, { slots, dailyCount, expeditions, workers });
          const selected = selection?.uid === pet.uid;
          const camp = selected && TRAINING_CAMPS.find(c => c.id === selection.campId);
          const tier = TRAINING_TIERS[selection?.tierIdx || 0];
          const range = camp ? [0, 0.999999].map(roll => calcTrainingGain(pet, camp, tier, badges, () => roll)) : [];
          const canStart = selected && !reason && slots.length < TRAINING_MAX_SLOTS && gold >= tier.cost && range[1] > 0;
          return <article className={`training-pet-row ${selected ? 'is-selected' : ''}`} key={pet.uid}>
            <div className="training-identity"><div className="training-avatar">{renderAvatar(pet)}</div><div><h3>{pet.nickname || pet.name}</h3><span>Lv.{pet.level} · {reason || '可训练'}</span></div></div>
            <div className="training-stats">
              {TRAINING_CAMPS.filter(c => badges >= c.reqBadges).map(c => {
                const ev = pet.evs?.[c.stat] || 0;
                return <button type="button" key={c.id} disabled={!!reason || ev >= 252} aria-pressed={selected && camp?.id === c.id} aria-label={`${pet.nickname || pet.name} ${c.name}`} onClick={() => setSelection({ uid: pet.uid, campId: c.id, tierIdx: selection?.tierIdx || 0 })}>
                  <span>{c.name.replace('训练场', '')}</span><strong>{ev}<small> / 252</small></strong><progress value={ev} max={252} aria-label={`${c.name}努力值`} />
                </button>;
              })}
            </div>
            {selected && <div className="training-plan">
              <div className="training-tier-options" role="group" aria-label="训练强度">
                {TRAINING_TIERS.map((option, index) => badges >= option.reqBadges && <button type="button" key={option.tier} aria-pressed={selection.tierIdx === index} onClick={() => setSelection(p => ({ ...p, tierIdx: index }))}><strong>{option.name}</strong><span>{option.duration / 60000} 分钟 · {option.cost.toLocaleString()} 金币</span></button>)}
              </div>
              <div className="training-plan-footer"><span>{camp.name.replace('训练场', '')}努力值 <strong>+{range[0]}{range[0] !== range[1] ? ` ~ ${range[1]}` : ''}</strong></span><span>{gold < tier.cost ? '金币不足' : slots.length >= TRAINING_MAX_SLOTS ? '训练位已满' : reason || ''}</span><button type="button" className="activity-primary" disabled={!canStart} onClick={() => { onStart(pet.uid, camp.id, selection.tierIdx); setSelection(null); }}><Dumbbell size={16} /> 开始训练</button></div>
            </div>}
          </article>;
        })}
      </div>
    </ActivityScreen>
  );
}
