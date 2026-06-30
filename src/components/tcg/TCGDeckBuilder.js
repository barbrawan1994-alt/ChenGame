import React, { useMemo, useState } from 'react';
import {
  TCG_DECK_SIZE, TCG_MAX_COPIES, TCG_STARTER_DECKS, validateDeck, getCard,
} from '../../data/tcg';
import TCGCard from './TCGCard';

export default function TCGDeckBuilder({ tcgState, setTcgState, collection, onBack, showToast }) {
  const [editingCards, setEditingCards] = useState(() => {
    const deck = tcgState.decks?.[tcgState.activeDeck || 0];
    return deck?.cards ? [...deck.cards] : [...TCG_STARTER_DECKS[0].cards];
  });
  const [deckName, setDeckName] = useState(tcgState.decks?.[tcgState.activeDeck || 0]?.name || '我的卡组');

  const collectionCounts = useMemo(() => {
    const m = {};
    (collection || []).forEach(id => { m[id] = (m[id] || 0) + 1; });
    return m;
  }, [collection]);

  const deckCounts = useMemo(() => {
    const m = {};
    editingCards.forEach(id => { m[id] = (m[id] || 0) + 1; });
    return m;
  }, [editingCards]);

  const uniqueCollection = useMemo(() => [...new Set(collection || [])], [collection]);

  const addCard = (cardId) => {
    if (editingCards.length >= TCG_DECK_SIZE) {
      showToast?.('❌', '卡组已满', `最多${TCG_DECK_SIZE}张`, 1500);
      return;
    }
    if ((deckCounts[cardId] || 0) >= TCG_MAX_COPIES) {
      showToast?.('❌', '数量限制', '同名卡最多2张', 1500);
      return;
    }
    if ((deckCounts[cardId] || 0) >= (collectionCounts[cardId] || 0)) {
      showToast?.('❌', '收藏不足', '你没有更多该卡', 1500);
      return;
    }
    setEditingCards(prev => [...prev, cardId]);
  };

  const removeCard = (idx) => {
    setEditingCards(prev => prev.filter((_, i) => i !== idx));
  };

  const saveDeck = () => {
    const check = validateDeck(editingCards);
    if (!check.ok) {
      showToast?.('❌', '卡组无效', check.reason, 2000);
      return;
    }
    setTcgState(prev => {
      const decks = [...(prev.decks || [])];
      const idx = prev.activeDeck || 0;
      while (decks.length <= idx) decks.push({ name: '卡组', cards: [] });
      decks[idx] = { name: deckName, cards: [...editingCards] };
      return { ...prev, decks };
    });
    showToast?.('✅', '保存成功', '卡组已更新', 1500);
  };

  const loadPreset = (preset) => {
    setEditingCards([...preset.cards]);
    setDeckName(preset.name);
  };

  const validation = validateDeck(editingCards);

  return (
    <div className="tcg-screen">
      <div className="tcg-header">
        <button className="tcg-back-btn" onClick={onBack}>←</button>
        <div className="tcg-title">组卡组</div>
        <button className="tcg-btn tcg-btn-primary" style={{ padding: '6px 12px', fontSize: 11 }} onClick={saveDeck}>保存</button>
      </div>
      <div className="tcg-content">
        <input
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)', color: '#fff', marginBottom: 12, boxSizing: 'border-box' }}
          placeholder="卡组名称"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
          <span>{editingCards.length}/{TCG_DECK_SIZE} 张</span>
          <span style={{ color: validation.ok ? '#4ade80' : '#f87171' }}>{validation.ok ? '✓ 合法' : validation.reason}</span>
        </div>
        <div className="tcg-stat-bar"><div className="tcg-stat-fill" style={{ width: `${(editingCards.length / TCG_DECK_SIZE) * 100}%` }} /></div>

        <div style={{ margin: '16px 0 8px', fontSize: 13, fontWeight: 700 }}>预设卡组</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {TCG_STARTER_DECKS.map(p => (
            <button key={p.name} className="tcg-btn tcg-btn-secondary" onClick={() => loadPreset(p)}>{p.name}</button>
          ))}
        </div>

        <div className="tcg-deck-editor">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>当前卡组</div>
            <div className="tcg-deck-slots">
              {editingCards.map((id, i) => {
                const c = getCard(id);
                return (
                  <div key={`${id}_${i}`} className="tcg-slot-chip" onClick={() => removeCard(i)}>
                    {c?.emoji || '🃏'} {c?.name || id} ✕
                  </div>
                );
              })}
              {editingCards.length === 0 && <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12 }}>从右侧添加卡牌</div>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>收藏卡牌</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
              {uniqueCollection.map(id => {
                const c = getCard(id);
                const left = (collectionCounts[id] || 0) - (deckCounts[id] || 0);
                if (!c || left <= 0) return null;
                return (
                  <div key={id} onClick={() => addCard(id)} style={{ cursor: 'pointer', position: 'relative' }}>
                    <TCGCard card={c} size="small" />
                    <div style={{ position: 'absolute', top: 2, left: 2, fontSize: 9, background: 'rgba(0,0,0,.6)', padding: '1px 4px', borderRadius: 4 }}>x{left}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
