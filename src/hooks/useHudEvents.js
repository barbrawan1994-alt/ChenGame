import React, { useEffect, useMemo, useRef, useState } from 'react';

const MAX_FEED_ITEMS = 4;
const FEED_TTL_MS = 5000;

const sumPartyHp = (party = []) => party.reduce((acc, pet) => {
  const maxHp = Number(pet?.maxHp || pet?.stats?.maxHp || pet?.hp || 0);
  const currentHp = Number(pet?.currentHp ?? maxHp);
  return {
    current: acc.current + Math.max(0, currentHp || 0),
    max: acc.max + Math.max(0, maxHp || 0),
    alive: acc.alive + (currentHp > 0 ? 1 : 0),
  };
}, { current: 0, max: 0, alive: 0 });

const getBattleUnitSnapshot = (battle, side) => {
  if (!battle) return null;
  const isPlayer = side === 'player';
  const idx = isPlayer
    ? (battle.isDouble ? battle.activeIdxs?.[0] : battle.activeIdx)
    : (battle.isDouble ? battle.enemyActiveIdxs?.[0] : battle.enemyActiveIdx);
  const list = isPlayer ? battle.playerCombatStates : battle.enemyParty;
  const unit = Array.isArray(list) && idx != null ? list[idx] : null;
  if (!unit) return null;
  return {
    id: unit.uid || unit.id || idx,
    name: unit.name || (isPlayer ? '我方' : '敌方'),
    hp: Math.max(0, Number(unit.currentHp || 0)),
    maxHp: Math.max(1, Number(unit.maxHp || unit.hp || unit.currentHp || 1)),
    status: unit.status || '',
  };
};

const buildSnapshot = ({ party, gold, battle, view }) => {
  const partyHp = sumPartyHp(party);
  const player = getBattleUnitSnapshot(battle, 'player');
  const enemy = getBattleUnitSnapshot(battle, 'enemy');
  return {
    view,
    gold: Number(gold || 0),
    partyAlive: partyHp.alive,
    partySize: (party || []).length,
    partyHpCurrent: Math.round(partyHp.current),
    partyHpMax: Math.round(partyHp.max),
    battleTurn: battle?.turnCount || 0,
    battlePhase: battle?.phase || '',
    player,
    enemy,
  };
};

const hpPercent = (unit) => unit ? Math.round((unit.hp / Math.max(1, unit.maxHp)) * 100) : 0;

const diffSnapshots = (prev, next) => {
  if (!prev) return [];
  const events = [];

  if (prev.gold !== next.gold) {
    const delta = next.gold - prev.gold;
    events.push({
      type: delta > 0 ? 'gain' : 'spend',
      title: delta > 0 ? '金币增加' : '金币消耗',
      detail: `${delta > 0 ? '+' : ''}${delta.toLocaleString()}`,
    });
  }

  if (prev.partyAlive !== next.partyAlive) {
    events.push({
      type: next.partyAlive > prev.partyAlive ? 'recover' : 'danger',
      title: '队伍状态',
      detail: `${next.partyAlive}/${next.partySize || next.partyAlive} 可出战`,
    });
  }

  if (next.view === 'battle' && prev.battleTurn !== next.battleTurn && next.battleTurn > 0) {
    events.push({
      type: 'turn',
      title: '战斗回合',
      detail: `R${next.battleTurn}`,
    });
  }

  if (next.player && prev.player && next.player.id === prev.player.id && next.player.hp !== prev.player.hp) {
    const delta = next.player.hp - prev.player.hp;
    events.push({
      type: delta > 0 ? 'recover' : 'danger',
      title: next.player.name,
      detail: `${delta > 0 ? '+' : ''}${delta} HP (${hpPercent(next.player)}%)`,
    });
  }

  if (next.enemy && prev.enemy && next.enemy.id === prev.enemy.id && next.enemy.hp !== prev.enemy.hp) {
    const delta = next.enemy.hp - prev.enemy.hp;
    events.push({
      type: delta > 0 ? 'enemyRecover' : 'hit',
      title: next.enemy.name,
      detail: `${delta > 0 ? '+' : ''}${delta} HP (${hpPercent(next.enemy)}%)`,
    });
  }

  return events;
};

export function useHudEvents(input) {
  const [events, setEvents] = useState([]);
  const previousSnapshot = useRef(null);
  const timers = useRef([]);
  const snapshot = useMemo(() => buildSnapshot(input), [input.party, input.gold, input.battle, input.view]);

  useEffect(() => {
    const nextEvents = diffSnapshots(previousSnapshot.current, snapshot);
    previousSnapshot.current = snapshot;
    if (nextEvents.length === 0) return;

    const stamped = nextEvents.map((event) => ({
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }));

    setEvents((current) => [...stamped, ...current].slice(0, MAX_FEED_ITEMS));

    stamped.forEach((event) => {
      const timer = setTimeout(() => {
        setEvents((current) => current.filter((item) => item.id !== event.id));
      }, FEED_TTL_MS);
      timers.current.push(timer);
    });
  }, [snapshot]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  return events;
}

export function HudEventFeed({ events }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="hud-event-feed" aria-live="polite" aria-atomic="false">
      {events.map((event) => (
        <div key={event.id} className={`hud-event-item is-${event.type}`}>
          <span className="hud-event-title">{event.title}</span>
          <strong>{event.detail}</strong>
        </div>
      ))}
    </div>
  );
}
