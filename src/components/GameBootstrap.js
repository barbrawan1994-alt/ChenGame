import React, { useEffect, useRef, useState } from 'react';
import HomeMenu from './HomeMenu';
import { readGameSave } from '../utils/saveStorage';
import { SAVE_KEY } from '../utils/saveKey';
import './GameBootstrap.css';

let gameImport;
const loadGame = () => {
  if (!gameImport) gameImport = import(/* webpackChunkName: "game" */ '../GameEntry').catch(error => {
    gameImport = null;
    throw error;
  });
  return gameImport;
};

export default function GameBootstrap() {
  const [save] = useState(() => {
    const result = readGameSave(SAVE_KEY);
    try { return JSON.parse(result.raw || '{}') || {}; } catch { return {}; }
  });
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const pending = useRef(false);
  const actionRef = useRef('start');
  useEffect(() => { loadGame().catch(() => {}); }, []);

  const enter = async (action) => {
    if (pending.current) return;
    pending.current = true;
    actionRef.current = action;
    setLoading(true);
    setError(false);
    try {
      const module = await loadGame();
      setGame({ Component: module.default, action });
    } catch {
      setError(true);
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  if (game) return <game.Component initialAction={game.action} />;
  return <div className="spirit-app bootstrap-shell">
    <HomeMenu
      hasSave={Boolean(save.trainerName || save.party?.length)}
      trainerName={save.trainerName}
      badgeCount={Array.isArray(save.badges) ? save.badges.length : 0}
      onStart={() => enter('start')}
      onNavigate={enter}
      onReset={() => enter('reset')}
      loading={loading}
      error={error}
      onRetry={() => enter(actionRef.current)}
    />
  </div>;
}
