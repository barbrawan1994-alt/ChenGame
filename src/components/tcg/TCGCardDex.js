import React, { useMemo, useState } from 'react';
import { TCG_ALL_CARDS, TCG_POKEMON_CARDS } from '../../data/tcg';
import { TYPES } from '../../data/types';
import TCGCard from './TCGCard';

export default function TCGCardDex({ collection, onBack }) {
  const [filterType, setFilterType] = useState('ALL');
  const [filterRarity, setFilterRarity] = useState('ALL');
  const [filterOwned, setFilterOwned] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const ownedSet = useMemo(() => new Set(collection || []), [collection]);
  const uniqueOwned = useMemo(() => new Set(collection || []), [collection]);

  const cards = useMemo(() => {
    return TCG_ALL_CARDS.filter(c => {
      if (filterType !== 'ALL' && c.type !== filterType && c.cardType !== filterType) return false;
      if (filterRarity !== 'ALL' && c.rarity !== filterRarity) return false;
      if (filterOwned === 'owned' && !ownedSet.has(c.cardId)) return false;
      if (filterOwned === 'missing' && ownedSet.has(c.cardId)) return false;
      return true;
    });
  }, [filterType, filterRarity, filterOwned, ownedSet]);

  const totalPokemon = TCG_POKEMON_CARDS.length;
  const ownedPokemon = TCG_POKEMON_CARDS.filter(c => uniqueOwned.has(c.cardId)).length;

  return (
    <div className="tcg-screen">
      <div className="tcg-header">
        <button className="tcg-back-btn" onClick={onBack}>←</button>
        <div className="tcg-title">卡牌图鉴</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{ownedPokemon}/{totalPokemon}</div>
      </div>
      <div className="tcg-content">
        <div className="tcg-stat-bar"><div className="tcg-stat-fill" style={{ width: `${Math.min(100, (ownedPokemon / totalPokemon) * 100)}%` }} /></div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', margin: '8px 0 12px' }}>收集进度 {Math.round((ownedPokemon / totalPokemon) * 100)}%</div>

        <div className="tcg-filter-bar">
          {['ALL', 'owned', 'missing'].map(f => (
            <button key={f} className={`tcg-filter-btn ${filterOwned === f ? 'active' : ''}`} onClick={() => setFilterOwned(f)}>
              {f === 'ALL' ? '全部' : f === 'owned' ? '已收集' : '未收集'}
            </button>
          ))}
        </div>
        <div className="tcg-filter-bar">
          {['ALL', 'C', 'U', 'R', 'SR', 'UR'].map(r => (
            <button key={r} className={`tcg-filter-btn ${filterRarity === r ? 'active' : ''}`} onClick={() => setFilterRarity(r)}>{r === 'ALL' ? '稀有度' : r}</button>
          ))}
        </div>
        <div className="tcg-filter-bar" style={{ marginBottom: 12 }}>
          <button className={`tcg-filter-btn ${filterType === 'ALL' ? 'active' : ''}`} onClick={() => setFilterType('ALL')}>属性</button>
          {Object.keys(TYPES).slice(0, 12).map(t => (
            <button key={t} className={`tcg-filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)} style={filterType === t ? { background: TYPES[t].color } : {}}>{TYPES[t].name}</button>
          ))}
        </div>

        <div className="tcg-dex-grid">
          {cards.slice(0, 120).map(card => {
            const owned = ownedSet.has(card.cardId);
            return (
              <div key={card.cardId} className={`tcg-dex-card-wrap ${owned ? '' : 'locked'}`} onClick={() => { setSelected(card); setFlipped(false); }}>
                <TCGCard card={card} size="small" />
                {!owned && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>?</div>}
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="tcg-pack-overlay" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <TCGCard card={selected} size="large" showBack={flipped} />
            <div style={{ marginTop: 16, maxWidth: 280 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 8 }}>{selected.desc || selected.ability || `#${selected.dexId || selected.cardId}`}</div>
              {selected.moves && (
                <div style={{ marginTop: 12, textAlign: 'left', fontSize: 11 }}>
                  {selected.moves.map((m, i) => (
                    <div key={i} style={{ marginBottom: 6, padding: 8, background: 'rgba(255,255,255,.06)', borderRadius: 8 }}>
                      <b>{m.name}</b> — 伤害 {m.damage} {m.desc && <span style={{ color: 'rgba(255,255,255,.5)' }}>({m.desc})</span>}
                    </div>
                  ))}
                </div>
              )}
              <button className="tcg-btn tcg-btn-secondary" style={{ marginTop: 12 }} onClick={() => setFlipped(f => !f)}>
                {flipped ? '查看正面' : '查看详情'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
