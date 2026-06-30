import React, { useState } from 'react';
import { openPack, TCG_DIFFICULTIES, TCG_PACKS, TCG_DAILY_FREE_BATTLES, countCollectionByRarity } from '../../data/tcg';
import TCGCardDex from './TCGCardDex';
import TCGDeckBuilder from './TCGDeckBuilder';
import TCGBattleScreen from './TCGBattleScreen';
import TCGPackOpening from './TCGPackOpening';

export default function TCGScreen({
  tcgState,
  setTcgState,
  gold,
  setGold,
  onBack,
  showToast,
  getLocalDateStr,
}) {
  const [subView, setSubView] = useState('hub');
  const [packOpening, setPackOpening] = useState(null);
  const [battleConfig, setBattleConfig] = useState(null);

  const today = getLocalDateStr?.() || new Date().toISOString().slice(0, 10);
  const dailyBattles = tcgState.lastBattleDate === today ? (tcgState.dailyBattles || 0) : 0;
  const freeLeft = Math.max(0, TCG_DAILY_FREE_BATTLES - dailyBattles);
  const stats = countCollectionByRarity(tcgState.collection || []);
  const record = tcgState.battleRecord || { wins: 0, losses: 0, streak: 0 };

  const addToCollection = (ids) => {
    setTcgState(prev => {
      const col = [...(prev.collection || [])];
      ids.forEach(id => col.push(id));
      return { ...prev, collection: col, packsPurchased: (prev.packsPurchased || 0) + 1 };
    });
  };

  const buyPack = (packId) => {
    const pack = TCG_PACKS[packId];
    if (!pack) return;
    if (gold < pack.price) {
      showToast?.('❌', '金币不足', `需要 ${pack.price} 金币`, 2000);
      return;
    }
    setGold(g => Math.max(0, g - pack.price));
    setPackOpening({ packId, phase: 'shake' });
  };

  const startBattle = (diff) => {
    const deck = tcgState.decks?.[tcgState.activeDeck || 0];
    if (!deck?.cards?.length) {
      showToast?.('❌', '无卡组', '请先编辑卡组', 2000);
      return;
    }
    if (freeLeft <= 0 && gold < 200) {
      showToast?.('❌', '次数不足', '今日免费次数已用完，需要200金币', 2000);
      return;
    }
    if (freeLeft <= 0) setGold(g => Math.max(0, g - 200));
    setBattleConfig(diff);
    setSubView('battle');
  };

  if (subView === 'dex') {
    return <TCGCardDex collection={tcgState.collection || []} onBack={() => setSubView('hub')} />;
  }
  if (subView === 'deck') {
    return (
      <TCGDeckBuilder
        tcgState={tcgState}
        setTcgState={setTcgState}
        collection={tcgState.collection || []}
        onBack={() => setSubView('hub')}
        showToast={showToast}
      />
    );
  }
  if (subView === 'battle' && battleConfig) {
    return (
      <TCGBattleScreen
        difficulty={battleConfig}
        playerDeck={tcgState.decks?.[tcgState.activeDeck || 0]?.cards || []}
        onFinish={(won) => {
          const todayStr = getLocalDateStr?.() || new Date().toISOString().slice(0, 10);
          const reward = battleConfig.reward || {};
          if (won) {
            if (reward.gold) setGold(g => g + reward.gold);
            const packCards = [];
            (reward.packs || []).forEach(pid => packCards.push(...openPack(pid)));
            if (packCards.length) addToCollection(packCards);
          }
          setTcgState(prev => {
            const wasToday = prev.lastBattleDate === todayStr;
            const battles = wasToday ? (prev.dailyBattles || 0) + 1 : 1;
            const rec = { ...(prev.battleRecord || { wins: 0, losses: 0, streak: 0 }) };
            if (won) { rec.wins += 1; rec.streak = (rec.streak || 0) + 1; }
            else { rec.losses += 1; rec.streak = 0; }
            return { ...prev, dailyBattles: battles, lastBattleDate: todayStr, battleRecord: rec };
          });
          setBattleConfig(null);
          setSubView('hub');
          showToast?.(won ? '🏆' : '😢', won ? '胜利！' : '战败', won ? `获得 💰${reward.gold || 0} + ${(reward.packs || []).length}包` : '再接再厉', 2500);
        }}
        onBack={() => { setBattleConfig(null); setSubView('hub'); }}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="tcg-screen">
      {packOpening && (
        <TCGPackOpening
          packId={packOpening.packId}
          onComplete={(ids) => {
            addToCollection(ids);
            if (!packOpening.silent) showToast?.('🎁', '开包完成', `获得 ${ids.length} 张卡牌`, 2000);
            setPackOpening(null);
          }}
          onClose={() => setPackOpening(null)}
        />
      )}
      <div className="tcg-header">
        <button className="tcg-back-btn" onClick={onBack}>←</button>
        <div className="tcg-title">精灵卡牌</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>💰{gold}</div>
      </div>
      <div className="tcg-content">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 12, background: 'rgba(99,102,241,.15)', border: '1px solid rgba(99,102,241,.3)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>收藏</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{stats.total} 张</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 12, background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>战绩</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{record.wins}胜 {record.losses}负</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 12, background: 'rgba(251,191,36,.12)', border: '1px solid rgba(251,191,36,.25)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>今日对战</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{freeLeft} 次免费</div>
          </div>
        </div>

        <div className="tcg-grid-2" style={{ marginBottom: 20 }}>
          <div className="tcg-menu-card" onClick={() => setSubView('battle_prep')}>
            <div className="tcg-menu-icon">⚔️</div>
            <div className="tcg-menu-name">卡牌对战</div>
            <div className="tcg-menu-desc">挑战AI训练家</div>
          </div>
          <div className="tcg-menu-card" onClick={() => setSubView('deck')}>
            <div className="tcg-menu-icon">📚</div>
            <div className="tcg-menu-name">组卡组</div>
            <div className="tcg-menu-desc">{tcgState.decks?.[tcgState.activeDeck || 0]?.name || '默认卡组'}</div>
          </div>
          <div className="tcg-menu-card" onClick={() => setSubView('dex')}>
            <div className="tcg-menu-icon">📖</div>
            <div className="tcg-menu-name">卡牌图鉴</div>
            <div className="tcg-menu-desc">查看全部卡牌</div>
          </div>
          <div className="tcg-menu-card" onClick={() => setSubView('shop')}>
            <div className="tcg-menu-icon">🛒</div>
            <div className="tcg-menu-name">卡包商店</div>
            <div className="tcg-menu-desc">抽取新卡牌</div>
          </div>
        </div>

        {subView === 'battle_prep' && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>选择对手</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TCG_DIFFICULTIES.map(d => (
                <div key={d.id} className="tcg-difficulty-card" onClick={() => startBattle(d)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 32 }}>{d.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{d.trainer} · {d.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
                        奖励: 💰{d.reward.gold} + {d.reward.packs?.length || 0}包
                      </div>
                    </div>
                    <button className="tcg-btn tcg-btn-primary">挑战</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="tcg-btn tcg-btn-secondary" style={{ marginTop: 12 }} onClick={() => setSubView('hub')}>返回</button>
          </div>
        )}

        {subView === 'shop' && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>卡包商店</div>
            <div className="tcg-shop-grid">
              {Object.values(TCG_PACKS).map(p => (
                <div key={p.id} className="tcg-shop-item" onClick={() => buyPack(p.id)}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', margin: '4px 0' }}>{p.count}张卡</div>
                  <div style={{ color: '#fbbf24', fontWeight: 800 }}>💰{p.price}</div>
                </div>
              ))}
            </div>
            <button className="tcg-btn tcg-btn-secondary" style={{ marginTop: 12 }} onClick={() => setSubView('hub')}>返回</button>
          </div>
        )}
      </div>
    </div>
  );
}
