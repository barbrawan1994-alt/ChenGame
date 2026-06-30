import React, { useEffect, useState } from 'react';
import { openPack, getCard, TCG_PACKS } from '../../data/tcg';
import TCGCard from './TCGCard';

export default function TCGPackOpening({ packId, onComplete, onClose }) {
  const [phase, setPhase] = useState('shake');
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState(0);

  const pack = TCG_PACKS[packId];

  useEffect(() => {
    if (phase === 'shake') {
      const ids = openPack(packId);
      setCards(ids);
    }
  }, [phase, packId]);

  const handleOpen = () => {
    setPhase('reveal');
    setRevealed(0);
    const timer = setInterval(() => {
      setRevealed(r => {
        if (r >= cards.length - 1) {
          clearInterval(timer);
          return cards.length;
        }
        return r + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  };

  const handleDone = () => {
    onComplete?.(cards);
    onClose?.();
  };

  return (
    <div className="tcg-pack-overlay">
      {phase === 'shake' && (
        <>
          <div className="tcg-pack-box" onClick={handleOpen}>{pack?.icon || '📦'}</div>
          <div style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,.7)' }}>点击卡包开启 {pack?.name}</div>
          <button className="tcg-btn tcg-btn-secondary" style={{ marginTop: 20 }} onClick={onClose}>取消</button>
        </>
      )}
      {phase === 'reveal' && (
        <>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>开包结果</div>
          <div className="tcg-pack-cards">
            {cards.map((id, i) => (
              <div key={`${id}_${i}`} className="tcg-pack-card-reveal" style={{ animationDelay: `${i * 0.15}s`, opacity: i < revealed ? 1 : 0 }}>
                <TCGCard cardId={id} size={i === cards.length - 1 && getCard(id)?.rarity === 'UR' ? 'large' : ''} />
                <div style={{ textAlign: 'center', fontSize: 11, marginTop: 4, color: getCard(id)?.rarity === 'UR' ? '#fbbf24' : 'rgba(255,255,255,.6)' }}>
                  {getCard(id)?.name} [{getCard(id)?.rarity}]
                </div>
              </div>
            ))}
          </div>
          {revealed >= cards.length && (
            <button className="tcg-btn tcg-btn-primary" style={{ marginTop: 24 }} onClick={handleDone}>收下卡牌</button>
          )}
        </>
      )}
    </div>
  );
}
