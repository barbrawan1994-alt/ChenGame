import { useEffect, useRef } from 'react';

/**
 * useGameTimer - encapsulates the 1-second game timer logic
 * @param {object} params
 * @param {Function} params.onTick - called with (nextTime, helpers) every second
 * @param {boolean} params.enabled - whether the timer is active
 */
export default function useGameTimer({ onTick, enabled = true }) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => {
      if (onTickRef.current) onTickRef.current();
    }, 1000);
    return () => clearInterval(timer);
  }, [enabled]);
}
