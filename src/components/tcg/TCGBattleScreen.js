import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TCG_PRIZE_COUNT, TCG_BENCH_SIZE, TCG_START_HAND,
  cloneBattleCard, getCard, canPayEnergy, calcTCGDamage, buildAIDeck,
} from '../../data/tcg';
import TCGCard from './TCGCard';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawFromDeck(state, side, count = 1) {
  const s = state[side];
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (!s.deck.length) return { state, drawn, empty: true };
    const id = s.deck.pop();
    const card = cloneBattleCard(id);
    if (card.cardType === 'pokemon' || card.cardType === 'trainer') s.hand.push(card);
    else s.hand.push(card);
    drawn.push(card);
  }
  return { state, drawn, empty: false };
}

function findBasicInHand(hand) {
  return hand.findIndex(c => c.cardType === 'pokemon' && c.isBasic);
}

function setupSide(deckIds) {
  let deck = shuffle([...deckIds]);
  let hand = [];
  for (let mulligan = 0; mulligan < 5; mulligan++) {
    hand = [];
    deck = shuffle([...deckIds]);
    for (let i = 0; i < TCG_START_HAND; i++) {
      if (!deck.length) break;
      hand.push(cloneBattleCard(deck.pop()));
    }
    if (findBasicInHand(hand) >= 0) break;
  }
  let active = null;
  const bench = [];
  const basicIdx = findBasicInHand(hand);
  if (basicIdx >= 0) {
    active = hand.splice(basicIdx, 1)[0];
    active.currentHp = active.hp;
  }
  for (let i = 0; i < TCG_BENCH_SIZE; i++) {
    const idx = findBasicInHand(hand);
    if (idx < 0) break;
    const mon = hand.splice(idx, 1)[0];
    mon.currentHp = mon.hp;
    bench.push(mon);
  }
  const prizes = [];
  for (let i = 0; i < TCG_PRIZE_COUNT; i++) {
    if (deck.length) prizes.push(deck.pop());
  }
  return {
    deck, hand, active, bench, discard: [], prizes,
    attachedThisTurn: false, evolvedThisTurn: false, damageBonus: 0,
  };
}

function setupGame(playerDeck, aiDeck) {
  return {
    player: setupSide(playerDeck),
    opponent: setupSide(aiDeck),
    turn: 'player',
    phase: 'main',
    log: ['对战开始！'],
    winner: null,
    turnCount: 1,
  };
}

function checkWinner(state) {
  if (state.player.prizes.length === 0) return 'player';
  if (state.opponent.prizes.length === 0) return 'opponent';
  if (!state.player.active && state.player.bench.every(p => !p || p.currentHp <= 0)) return 'opponent';
  if (!state.opponent.active && state.opponent.bench.every(p => !p || p.currentHp <= 0)) return 'opponent';
  if (state.player.deck.length === 0 && state.player.hand.length === 0) return 'opponent';
  if (state.opponent.deck.length === 0 && state.opponent.hand.length === 0) return 'player';
  return null;
}

function knockOut(state, side) {
  const s = state[side];
  if (s.prizes.length > 0) {
    const prize = s.prizes.pop();
    const card = cloneBattleCard(prize);
    if (card) state[side === 'player' ? 'opponent' : 'player'].hand.push(card);
  }
  s.active = null;
  const benchAlive = s.bench.findIndex(p => p && p.currentHp > 0);
  if (benchAlive >= 0) {
    s.active = s.bench.splice(benchAlive, 1)[0];
  }
  return state;
}

function applyDamage(state, targetSide, dmg) {
  const mon = state[targetSide].active;
  if (!mon) return state;
  mon.currentHp = Math.max(0, mon.currentHp - dmg);
  if (mon.currentHp <= 0) {
    state[targetSide].discard.push(mon);
    state = knockOut(state, targetSide);
    state.log = [...state.log, `${mon.name} 被击倒了！`];
  }
  return state;
}

function aiChooseMove(state, aiLevel) {
  const active = state.opponent.active;
  const playerActive = state.player.active;
  if (!active || !playerActive) return null;
  const moves = active.moves || [];
  const affordable = moves.map((m, i) => ({ m, i })).filter(({ m }) => canPayEnergy(active.attachedEnergy, m.energyCost));
  if (!affordable.length) return null;

  if (aiLevel === 'random') return affordable[Math.floor(Math.random() * affordable.length)].i;

  let best = affordable[0];
  let bestScore = -1;
  affordable.forEach(({ m, i }) => {
    let score = m.damage || 10;
    if (playerActive.weakness === active.type) score *= 2;
    if (playerActive.resistance === active.type) score *= 0.5;
    if (aiLevel === 'expert' && m.effect) score += 15;
    if (score > bestScore) { bestScore = score; best = { m, i }; }
  });
  return best.i;
}

function runAI(state, aiLevel) {
  let s = { ...state, opponent: { ...state.opponent, hand: [...state.opponent.hand], bench: [...state.opponent.bench] } };
  const opp = s.opponent;

  if (!opp.attachedThisTurn) {
    const energyIdx = opp.hand.findIndex(c => c.cardType === 'energy');
    if (energyIdx >= 0 && opp.active) {
      const e = opp.hand.splice(energyIdx, 1)[0];
      opp.active.attachedEnergy = [...(opp.active.attachedEnergy || []), e.type];
      opp.attachedThisTurn = true;
      s.log = [...s.log, `对手贴了${e.name}`];
    }
  }

  const moveIdx = aiChooseMove(s, aiLevel);
  if (moveIdx !== null && opp.active) {
    const move = opp.active.moves[moveIdx];
    const dmg = calcTCGDamage(opp.active, s.player.active, move, opp.active.type);
    s.log = [...s.log, `对手${opp.active.name}使用${move.name}！造成${dmg}伤害`];
    s = applyDamage(s, 'player', dmg);
  } else {
    s.log = [...s.log, '对手无法攻击'];
  }

  s.player = { ...s.player, attachedThisTurn: false, evolvedThisTurn: false, damageBonus: 0 };
  s.opponent = { ...opp, attachedThisTurn: false, evolvedThisTurn: false };
  s.turn = 'player';
  s.turnCount = (s.turnCount || 1) + 1;

  let tmp = { player: s.player, opponent: s.opponent };
  const draw = drawFromDeck(tmp, 'player', 1);
  s.player = draw.state.player;
  if (draw.empty) s.log = [...s.log, '你无牌可抽！'];

  s.winner = checkWinner(s);
  return s;
}

export default function TCGBattleScreen({ difficulty, playerDeck, onFinish, onBack, showToast }) {
  const aiDeck = useMemo(() => buildAIDeck(difficulty?.id || 'easy'), [difficulty]);
  const [game, setGame] = useState(() => setupGame(playerDeck, aiDeck));
  const [selectedHand, setSelectedHand] = useState(null);
  const [selectedMove, setSelectedMove] = useState(null);
  const finishedRef = useRef(false);

  const aiLevel = difficulty?.ai || 'random';

  useEffect(() => {
    if (game.winner && !finishedRef.current) {
      finishedRef.current = true;
      const won = game.winner === 'player';
      setTimeout(() => onFinish?.(won), 1500);
    }
  }, [game.winner, onFinish]);

  const attachEnergy = useCallback((handIdx) => {
    setGame(g => {
      if (g.turn !== 'player' || g.phase !== 'main' || g.player.attachedThisTurn) return g;
      const card = g.player.hand[handIdx];
      if (!card || card.cardType !== 'energy' || !g.player.active) return g;
      const player = { ...g.player, hand: [...g.player.hand], active: { ...g.player.active, attachedEnergy: [...(g.player.active.attachedEnergy || [])] } };
      const energy = player.hand.splice(handIdx, 1)[0];
      player.active.attachedEnergy.push(energy.type);
      player.attachedThisTurn = true;
      return { ...g, player, log: [...g.log, `贴上了${energy.name}`] };
    });
    setSelectedHand(null);
  }, []);

  const playTrainer = useCallback((handIdx) => {
    setGame(g => {
      const card = g.player.hand[handIdx];
      if (!card || card.cardType !== 'trainer') return g;
      const player = { ...g.player, hand: [...g.player.hand] };
      const trainer = player.hand.splice(handIdx, 1)[0];
      player.discard.push(trainer);
      let log = [...g.log, `使用了${trainer.name}`];
      const eff = trainer.effect || {};

      if (eff.kind === 'draw') {
        let tmp = { player, opponent: g.opponent };
        for (let i = 0; i < (eff.count || 1); i++) {
          const d = drawFromDeck(tmp, 'player', 1);
          tmp = d.state;
          if (d.empty) break;
        }
        Object.assign(player, tmp.player);
        log = [...log, `抽了${eff.count || 1}张卡`];
      } else if (eff.kind === 'heal' && player.active) {
        player.active = { ...player.active };
        player.active.currentHp = Math.min(player.active.hp, player.active.currentHp + (eff.amount || 30));
        log = [...log, `回复了${eff.amount || 30}HP`];
      } else if (eff.kind === 'search' && eff.cardType === 'energy') {
        const idx = player.deck.findIndex(id => id.startsWith('energy_'));
        if (idx >= 0) {
          const id = player.deck.splice(idx, 1)[0];
          player.hand.push(cloneBattleCard(id));
          log = [...log, '检索到能量卡'];
        }
      }

      return { ...g, player, log };
    });
    setSelectedHand(null);
  }, []);

  const attack = useCallback((moveIdx) => {
    setGame(g => {
      if (g.turn !== 'player' || !g.player.active || !g.opponent.active) return g;
      const move = g.player.active.moves?.[moveIdx];
      if (!move || !canPayEnergy(g.player.active.attachedEnergy, move.energyCost)) return g;

      let s = { ...g, player: { ...g.player, active: { ...g.player.active } }, opponent: { ...g.opponent, active: g.opponent.active ? { ...g.opponent.active } : null } };
      const dmg = calcTCGDamage(s.player.active, s.opponent.active, move, s.player.active.type);
      s.log = [...s.log, `${s.player.active.name}使用${move.name}！造成${dmg}伤害`];
      s = applyDamage(s, 'opponent', dmg);

      s = runAI(s, aiLevel);
      s.winner = checkWinner(s);
      return s;
    });
    setSelectedMove(null);
  }, [aiLevel]);

  const endTurn = useCallback(() => {
    setGame(g => {
      if (g.turn !== 'player') return g;
      let s = runAI(g, aiLevel);
      s.winner = checkWinner(s);
      return s;
    });
  }, [aiLevel]);

  const { player, opponent, log, winner } = game;

  return (
    <div className="tcg-screen">
      <div className="tcg-header">
        <button className="tcg-back-btn" onClick={onBack}>←</button>
        <div className="tcg-title">vs {difficulty?.trainer}</div>
        <div style={{ fontSize: 11 }}>回合 {game.turnCount}</div>
      </div>

      <div className="tcg-battle-field">
        <div className="tcg-battle-zone">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="tcg-side-info">
              <div className="tcg-pile">牌库 {opponent.deck.length}</div>
              <div className="tcg-pile">奖品 {opponent.prizes.length}</div>
            </div>
            <div className="tcg-bench">
              {opponent.bench.map((p, i) => p ? (
                <div key={i} className="tcg-bench-slot"><TCGCard card={p} size="small" /></div>
              ) : <div key={i} className="tcg-bench-slot">空</div>)}
            </div>
            <div className="tcg-pile">弃牌 {opponent.discard.length}</div>
          </div>

          <div className="tcg-battle-row">
            {opponent.active ? (
              <div className="tcg-active-slot"><TCGCard card={opponent.active} /></div>
            ) : <div className="tcg-bench-slot">无战斗精灵</div>}
          </div>

          <div className="tcg-battle-row">
            {player.active ? (
              <div className="tcg-active-slot"><TCGCard card={player.active} /></div>
            ) : <div className="tcg-bench-slot">请上战斗精灵</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="tcg-side-info">
              <div className="tcg-pile">牌库 {player.deck.length}</div>
              <div className="tcg-pile">奖品 {player.prizes.length}</div>
            </div>
            <div className="tcg-bench">
              {player.bench.map((p, i) => p ? (
                <div key={i} className="tcg-bench-slot"><TCGCard card={p} size="small" /></div>
              ) : <div key={i} className="tcg-bench-slot">空</div>)}
            </div>
            <div className="tcg-pile">弃牌 {player.discard.length}</div>
          </div>
        </div>

        <div className="tcg-log">{log.slice(-5).map((l, i) => <div key={i}>{l}</div>)}</div>

        {winner && (
          <div style={{ textAlign: 'center', padding: 12, fontSize: 18, fontWeight: 800, color: winner === 'player' ? '#4ade80' : '#f87171' }}>
            {winner === 'player' ? '🏆 胜利！' : '😢 战败...'}
          </div>
        )}

        {!winner && game.turn === 'player' && (
          <div className="tcg-actions">
            {player.active?.moves?.map((m, i) => (
              <button key={i} className="tcg-btn tcg-btn-primary" disabled={!canPayEnergy(player.active.attachedEnergy, m.energyCost)} onClick={() => attack(i)}>
                {m.name} ({m.damage})
              </button>
            ))}
            <button className="tcg-btn tcg-btn-secondary" onClick={endTurn}>结束回合</button>
          </div>
        )}

        {!winner && game.turn === 'player' && (
          <div className="tcg-hand">
            {player.hand.map((c, i) => (
              <div key={c.instanceId || i} onClick={() => {
                if (c.cardType === 'energy') attachEnergy(i);
                else if (c.cardType === 'trainer') playTrainer(i);
                else setSelectedHand(i);
              }}>
                <TCGCard card={c} size="small" selected={selectedHand === i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
