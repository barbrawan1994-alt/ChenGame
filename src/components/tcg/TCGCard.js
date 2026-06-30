import React from 'react';
import { TYPES } from '../../data/types';
import { getCard } from '../../data/tcg';

export default function TCGCard({ cardId, card: cardProp, size = '', onClick, selected, showBack }) {
  const card = cardProp || getCard(cardId);
  if (!card) return null;
  const typeInfo = TYPES[card.type] || { name: card.type, color: '#888' };
  const cls = ['tcg-card', `rarity-${card.rarity || 'C'}`, size, card.cardType === 'energy' ? 'tcg-energy-card' : '', card.cardType === 'trainer' ? 'tcg-trainer-card' : '', selected ? 'selected' : ''].filter(Boolean).join(' ');

  if (showBack) {
    return (
      <div className={cls} onClick={onClick} style={selected ? { outline: '2px solid #fbbf24' } : undefined}>
        <div className="tcg-card-inner" style={{ background: 'linear-gradient(160deg,#0f172a,#1e293b)', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 28, opacity: 0.5 }}>🃏</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 8 }}>精灵卡牌</div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'energy') {
    return (
      <div className={cls} onClick={onClick} style={selected ? { outline: '2px solid #fbbf24' } : undefined}>
        <div className="tcg-card-inner" style={{ borderColor: card.color || typeInfo.color }}>
          <div className="tcg-energy-icon">{card.emoji || '⚡'}</div>
          <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8 }}>{card.name}</div>
          <div className="tcg-rarity-badge">{card.rarity}</div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'trainer') {
    return (
      <div className={cls} onClick={onClick} style={selected ? { outline: '2px solid #fbbf24' } : undefined}>
        <div className="tcg-card-inner">
          <div className="tcg-card-top"><span>{card.name}</span><span>支援</span></div>
          <div className="tcg-card-art">{card.emoji || '🎴'}</div>
          <div style={{ fontSize: 9, textAlign: 'center', color: 'rgba(255,255,255,.7)' }}>{card.desc}</div>
          <div className="tcg-rarity-badge">{card.rarity}</div>
        </div>
      </div>
    );
  }

  const battleHp = card.currentHp ?? card.hp;
  return (
    <div className={cls} onClick={onClick} style={{ ...(selected ? { outline: '2px solid #fbbf24' } : {}), ...(card.cardType === 'pokemon' ? { borderColor: typeInfo.color } : {}) }}>
      <div className="tcg-card-inner" style={{ background: `linear-gradient(160deg, ${typeInfo.color}22, #16213e)` }}>
        <div className="tcg-card-top">
          <span style={{ color: typeInfo.color }}>{card.name}</span>
          <span className="tcg-card-hp">HP {battleHp}</span>
        </div>
        <div className="tcg-card-art" style={{ background: `${typeInfo.color}18` }}>{card.emoji || '✨'}</div>
        <div className="tcg-card-moves">
          {(card.moves || []).slice(0, 2).map((m, i) => (
            <div key={i} className="tcg-card-move">
              <span>{m.name}</span>
              <span style={{ color: '#ffd54f' }}>{m.damage || '-'}</span>
            </div>
          ))}
        </div>
        <div className="tcg-card-footer">
          <span>弱:{TYPES[card.weakness]?.name || '-'}</span>
          <span>退:{card.retreatCost || 1}</span>
        </div>
        <div className="tcg-rarity-badge">{card.rarity}</div>
        {card.attachedEnergy?.length > 0 && (
          <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, color: '#fbbf24' }}>⚡{card.attachedEnergy.length}</div>
        )}
      </div>
    </div>
  );
}
