import { useEffect, useRef, useCallback } from 'react';
import { BGM_SOURCES } from '../data/constants';

/**
 * useAudio - manages background music playback
 * @param {object} params
 * @param {string} params.view - current view
 * @param {object|null} params.battle - current battle state
 * @param {boolean} params.isMuted - whether audio is muted
 */
export default function useAudio({ view, battle, isMuted }) {
  const audioRef = useRef(null);
  const currentTrackRef = useRef('');

  const getTargetTrack = useCallback(() => {
    if (battle) {
      return battle.type === 'boss' || battle.type === 'gym' || battle.type === 'league'
        ? BGM_SOURCES.BOSS
        : BGM_SOURCES.BATTLE;
    }
    if (view === 'menu' || view === 'title') return BGM_SOURCES.MENU;
    return BGM_SOURCES.MAP;
  }, [view, battle]);

  useEffect(() => {
    if (isMuted || !audioRef.current) return;
    const target = getTargetTrack();
    if (target !== currentTrackRef.current) {
      currentTrackRef.current = target;
      audioRef.current.src = target;
      audioRef.current.play().catch(() => {});
    }
  }, [isMuted, getTargetTrack]);

  useEffect(() => {
    if (isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMuted]);

  return { audioRef, currentTrack: currentTrackRef.current };
}
