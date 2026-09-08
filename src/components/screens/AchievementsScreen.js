import React from 'react';
import { ACH_CATEGORY } from '../../data/achievements';
import { ACH_RARITY } from '../../data/achievements';
import ACHIEVEMENTS from '../../data/achievements';

export default function AchievementsScreen({
  achCatFilter,
  achFilter,
  formatAchievementReward,
  safeBack,
  setAchCatFilter,
  setAchFilter,
  setView,
  unlockedAchs
}) {
    const total = ACHIEVEMENTS.length;
    const unlocked = unlockedAchs.length;
    const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    const unlockedSet = new Set(unlockedAchs);
    const cats = ['ALL', ...Object.keys(ACH_CATEGORY)];
    const catFiltered = achCatFilter === 'ALL' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === achCatFilter);
    const rarityMatch = (a) => {
      if (achFilter === '全部') return true;
      const r = a.rarity || 'COMMON';
      if (achFilter === '普通') return r === 'COMMON';
      if (achFilter === '稀有') return r === 'UNCOMMON' || r === 'RARE';
      if (achFilter === '史诗') return r === 'EPIC';
      if (achFilter === '传说') return r === 'LEGENDARY';
      return true;
    };
    const filtered = catFiltered.filter(rarityMatch);
    const rareUnlocked = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id) && ['EPIC', 'LEGENDARY'].includes(a.rarity)).length;
    const hiddenUnlocked = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id) && a.hidden).length;
    const rewardUnlocked = ACHIEVEMENTS.reduce((sum, ach) => unlockedSet.has(ach.id) ? sum + formatAchievementReward(ach.reward).length : sum, 0);
    const nextTarget = ACHIEVEMENTS.find(ach => !unlockedSet.has(ach.id) && !ach.hidden) || ACHIEVEMENTS.find(ach => !unlockedSet.has(ach.id));
    const rarityFilters = [
      { key: '全部', label: '全部', count: catFiltered.length },
      { key: '普通', label: '普通', count: catFiltered.filter(a => (a.rarity || 'COMMON') === 'COMMON').length },
      { key: '稀有', label: '稀有', count: catFiltered.filter(a => ['UNCOMMON', 'RARE'].includes(a.rarity || 'COMMON')).length },
      { key: '史诗', label: '史诗', count: catFiltered.filter(a => a.rarity === 'EPIC').length },
      { key: '传说', label: '传说', count: catFiltered.filter(a => a.rarity === 'LEGENDARY').length },
    ];

    return (
      <main className="achievement-screen" aria-label="成就大厅">
        <div className="achievement-backdrop" aria-hidden="true" />
        <section className="achievement-shell">
          <header className="achievement-hero">
            <div className="achievement-toolbar">
              <button type="button" className="achievement-back-btn" onClick={() => setView(safeBack())}>
                <span aria-hidden="true">←</span>
                <span>返回</span>
              </button>
              <div className="achievement-title">
                <span className="achievement-kicker">冒险纪事</span>
                <h1>成就大厅</h1>
              </div>
              <div className="achievement-total-pill">{unlocked} / {total}</div>
            </div>

            <div className="achievement-overview">
              <div className="achievement-progress-ring" style={{ '--achievement-progress': `${pct}%` }}>
                <span>{pct}%</span>
                <small>完成度</small>
              </div>
              <div className="achievement-hero-copy">
                <p>记录你的收集、战斗、探索与隐藏挑战进度。</p>
                <div className="achievement-progress-track" aria-label={`成就完成度 ${pct}%`}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <div className="achievement-next">
                  <span>下一目标</span>
                  <strong>{nextTarget ? nextTarget.name : '已完成全部成就'}</strong>
                  <small>{nextTarget ? (nextTarget.hidden ? nextTarget.hint || '隐藏条件等待发现' : nextTarget.desc) : '你已经把大厅点亮了。'}</small>
                </div>
              </div>
              <div className="achievement-stat-stack">
                <div>
                  <span>高阶成就</span>
                  <strong>{rareUnlocked}</strong>
                </div>
                <div>
                  <span>隐藏发现</span>
                  <strong>{hiddenUnlocked}</strong>
                </div>
                <div>
                  <span>奖励领取</span>
                  <strong>{rewardUnlocked}</strong>
                </div>
              </div>
            </div>
          </header>

          <nav className="achievement-category-tabs" aria-label="成就分类">
            {cats.map(c => {
              const isAll = c === 'ALL';
              const cat = ACH_CATEGORY[c] || {};
              const active = achCatFilter === c;
              const catItems = isAll ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === c);
              const catDone = catItems.filter(a => unlockedSet.has(a.id)).length;
              return (
                <button
                  key={c}
                  type="button"
                  className={active ? 'is-active' : ''}
                  onClick={() => setAchCatFilter(c)}
                >
                  <span className="achievement-tab-icon">{isAll ? '🏆' : cat.icon || '◆'}</span>
                  <span>
                    <strong>{isAll ? '全部' : cat.name}</strong>
                    <small>{catDone}/{catItems.length}</small>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="achievement-filter-row" aria-label="稀有度筛选">
            {rarityFilters.map(r => (
              <button
                key={r.key}
                type="button"
                className={achFilter === r.key ? 'is-active' : ''}
                onClick={() => setAchFilter(r.key)}
              >
                <span>{r.label}</span>
                <small>{r.count}</small>
              </button>
            ))}
          </div>

          <section className="achievement-content" aria-label="成就列表">
            <div className="achievement-grid">
              {filtered.map(ach => {
                const done = unlockedSet.has(ach.id);
                const cat = ACH_CATEGORY[ach.cat] || { icon: '🏆', name: '成就' };
                const rar = ACH_RARITY[ach.rarity] || { color: '#888', name: '未知', stars: 1 };
                const isHidden = ach.hidden && !done;
                return (
                  <article
                    key={ach.id}
                    className={`achievement-card ${done ? 'is-unlocked' : 'is-locked'}`}
                    style={{ '--rarity-color': rar.color }}
                  >
                    <div className="achievement-card-glow" aria-hidden="true" />
                    <div className="achievement-card-main">
                      <div className="achievement-medal" aria-hidden="true">
                        {done ? (cat?.icon || '🏆') : (isHidden ? '?' : cat?.icon || '◆')}
                      </div>
                      <div className="achievement-card-copy">
                        <div className="achievement-card-meta">
                          <span>{cat?.name || '成就'}</span>
                          <b>{rar.name}</b>
                        </div>
                        <h2>{isHidden ? '???' : ach.name}</h2>
                        <p>{isHidden ? (ach.hint || '达成隐藏条件后解锁') : ach.desc}</p>
                      </div>
                    </div>
                    <div className="achievement-card-foot">
                      <span className="achievement-stars" aria-label={`${rar.stars || 1} 星`}>
                        {'★'.repeat(rar.stars || 1)}{'☆'.repeat(5 - (rar.stars || 1))}
                      </span>
                      <div className="achievement-reward-row">
                        {formatAchievementReward(ach.reward).slice(0, 3).map(part => <span key={part}>{part}</span>)}
                      </div>
                      <strong>{done ? '已完成' : '未解锁'}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="achievement-empty">
                <strong>没有匹配的成就</strong>
                <span>换一个分类或稀有度看看。</span>
              </div>
            )}
          </section>
        </section>
      </main>
    );
  
}
