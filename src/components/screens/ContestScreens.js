import React from 'react';
import { Fish, Waves, Trophy, RotateCcw, Sparkles, Check, Anchor } from 'lucide-react';
import ActivityScreen from './ActivityScreen';
import { FISHING_MAX_RETRIES, FISHING_REACTION_MS, getAppealPreview } from '../../utils/contestRules';
import './ContestScreens.css';

function PrizeLadder({ tiers, score, unit }) {
  const current = score == null ? -1 : tiers.findIndex(tier => score >= tier.min);
  return <section className="contest-prizes" aria-label="奖项分数线">
    <h2><Trophy size={16}/>奖项</h2>
    {tiers.map((tier, index) => <div key={tier.min} className={current === index ? 'is-current' : ''}>
      <span className="contest-rank">{String(index + 1).padStart(2, '0')}</span>
      <div><strong>{tier.name}</strong><span>{tier.min > 0 ? `${tier.min} ${unit}起` : '参与奖'}</span></div>
      {current === index && <Check size={17} aria-label="当前奖项"/>}
    </div>)}
  </section>;
}

export function FishingScreen({ state, tiers, candidates, renderAvatar, onBack, onCast, onReel, onRetry, onSubmit }) {
  const { status, fish, weight, msg, retries = 0 } = state;
  const active = status === 'waiting' || status === 'bite';
  const labels = { idle: '岸边准备', waiting: '浮标观察', bite: '咬钩信号', success: '渔获入档', fail: '本竿结束' };
  return <ActivityScreen title="钓鱼王杯" className="contest-screen fishing-screen" onBack={onBack}
    status={<span>第 {retries + 1} / {FISHING_MAX_RETRIES + 1} 竿</span>}>
    <div className="contest-layout">
      <main className={`contest-stage fishing-stage is-${status}`}>
        <div className="contest-stage-heading"><span>ANGLER'S CUP</span><h2>{labels[status]}</h2></div>
        <div className="fishing-scene" aria-hidden="true">
          {status === 'success' && fish ? <div className="contest-pet-art">{renderAvatar(fish)}</div>
            : <><Waves className="fishing-water" size={160} strokeWidth={1}/><Anchor className="fishing-float" size={48} strokeWidth={1.5}/></>}
        </div>
        <div className="contest-live-status" role="status">
          {status === 'success' ? <><strong>{fish.name}</strong><span className="contest-score">{weight}<small> kg</small></span></>
            : <><strong>{status === 'idle' ? '水面平静' : status === 'waiting' ? '浮标已入水' : status === 'bite' ? '立即收竿' : msg}</strong><span>{status === 'fail' ? (retries < FISHING_MAX_RETRIES ? `剩余 ${FISHING_MAX_RETRIES - retries} 次机会` : '本轮机会已用完') : status === 'waiting' ? '等待咬钩' : status === 'bite' ? '鱼正在挣脱' : '本轮最多三竿'}</span></>}
        </div>
        <div className="fishing-signal" aria-hidden="true">{status === 'bite' && <span key={state.biteDeadline} style={{ animationDuration: `${FISHING_REACTION_MS}ms` }}/>}</div>
        <div className="contest-main-action">
          {(status === 'idle' || active) && <button type="button" className="activity-primary" onClick={active ? onReel : onCast}><Fish size={18}/>{active ? '收竿' : '抛竿'}</button>}
          {status === 'fail' && <button type="button" className="activity-primary" disabled={retries >= FISHING_MAX_RETRIES} onClick={onRetry}><RotateCcw size={17}/>{retries >= FISHING_MAX_RETRIES ? '机会已用完' : '再试一竿'}</button>}
          {status === 'success' && <button type="button" className="activity-primary" onClick={onSubmit}><Trophy size={17}/>提交成绩</button>}
        </div>
      </main>
      <aside className="contest-sidebar">
        <PrizeLadder tiers={tiers} score={status === 'success' ? Number(weight) : null} unit="kg"/>
        <section className="fishing-species"><h2>本场鱼种</h2>{candidates.map(pet => <div key={pet.id}><span>{renderAvatar(pet)}</span><strong>{pet.name}</strong></div>)}</section>
      </aside>
    </div>
  </ActivityScreen>;
}

export function BeautyScreen({ state, pet, tiers, types, renderAvatar, onBack, onAppeal, onSubmit }) {
  const finished = state.round > 5;
  return <ActivityScreen title="华丽大赛" className="contest-screen beauty-screen" onBack={onBack}
    status={<span>{finished ? '演出结束' : `第 ${state.round} / 5 轮`}</span>}>
    <div className="contest-layout">
      <main className="contest-stage beauty-stage">
        <div className="contest-stage-heading"><span>SPIRIT SHOWCASE</span><h2>{pet.nickname || pet.name}</h2></div>
        <div className="beauty-performance"><div className="contest-pet-art">{renderAvatar(pet)}</div><div className="beauty-score"><small>当前魅力</small><strong>{state.appeal}</strong><span>{5 - Math.min(5, state.round - 1)} 轮剩余</span></div></div>
        <div className="beauty-rounds" aria-label="表演进度">{Array.from({ length: 5 }, (_, index) => <span key={index} className={index < state.round - 1 ? 'is-done' : ''}>{index < state.round - 1 ? <Check size={16}/> : index + 1}</span>)}</div>
        {!finished ? <div className="beauty-moves">{(pet.moves || []).map(move => {
          const preview = getAppealPreview(move, state.history.at(-1));
          return <button type="button" key={move.name} onClick={() => onAppeal(move)} style={{ '--move-color': types[move.t]?.color || '#a4c9b3' }}>
            <div><strong>{move.name}</strong><span>{types[move.t]?.name || move.t}</span></div>
            <span className="beauty-estimate">{preview.min} - {preview.max}<small> 预计魅力</small></span>
            <small className={preview.repeated ? 'is-warning' : ''}>{preview.repeated ? '连续重复 -10' : preview.elegant ? '华丽属性 +8' : move.p === 0 ? '变化招式' : '力量展示'}</small>
          </button>;
        })}</div> : <div className="contest-main-action"><button type="button" className="activity-primary" onClick={onSubmit}><Sparkles size={18}/>查看结果</button></div>}
      </main>
      <aside className="contest-sidebar"><PrizeLadder tiers={tiers} score={state.appeal} unit="分"/>
        <section className="beauty-history"><h2>评审记录</h2><div role="log">{state.log.length ? state.log.map((entry, index) => <p key={index}>{entry}</p>) : <p>评审就席</p>}</div></section>
      </aside>
    </div>
  </ActivityScreen>;
}
