import { useEffect, useRef, useState } from 'react';
import { advanceCombatClock, appendCombatSample, createCombatSample, normalizeCombatMetrics } from '../utils/combatMetrics';

export function useCombatMetrics(initial, battle, context) {
  const [metrics, setMetrics] = useState(() => normalizeCombatMetrics(initial));
  const metricsRef = useRef(metrics);
  const live = useRef(null);
  const contextRef = useRef(context);
  contextRef.current = context;
  const tick = () => {
    const run = live.current;
    if (!run) return;
    advanceCombatClock(run, performance.now());
  };
  const finish = (snapshot, result) => {
    const run = live.current;
    if (!run || run.sample.id !== snapshot?._metricsId) return;
    tick();
    const sample = { ...run.sample, turns: snapshot.turnCount || 0, result };
    live.current = null;
    metricsRef.current = appendCombatSample(metricsRef.current, sample);
    setMetrics(metricsRef.current);
  };
  const start = snapshot => {
    if (live.current) finish(live.current.snapshot, 'interrupted');
    const now = performance.now();
    live.current = { snapshot, sample: createCombatSample(snapshot, contextRef.current), started: now, lastTick: now, lastInput: now, visible: !document.hidden, autoBattle: contextRef.current.autoBattle };
  };
  const command = source => {
    if (!live.current) return;
    tick();
    live.current.sample[source === 'auto' ? 'autoCommands' : 'manualCommands']++;
    if (source !== 'auto') live.current.lastInput = performance.now();
  };
  useEffect(() => {
    tick();
    if (live.current) live.current.autoBattle = context.autoBattle;
  }, [context.autoBattle]);
  useEffect(() => {
    if (battle && live.current?.sample.id === battle._metricsId) live.current.snapshot = battle;
    else if (!battle && live.current) finish(live.current.snapshot, 'interrupted');
  }, [battle]);
  useEffect(() => {
    const visibility = () => { tick(); if (live.current) live.current.visible = !document.hidden; };
    const input = () => { if (live.current) { tick(); live.current.lastInput = performance.now(); live.current.sample.interactions++; } };
    const exit = () => { if (live.current) finish(live.current.snapshot, 'interrupted'); };
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('pointerdown', input);
    document.addEventListener('keydown', input);
    window.addEventListener('pagehide', exit);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('pointerdown', input);
      document.removeEventListener('keydown', input);
      window.removeEventListener('pagehide', exit);
    };
  }, []);
  return { metrics, metricsRef, start, finish, command };
}
