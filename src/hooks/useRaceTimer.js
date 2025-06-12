import { useState, useRef, useEffect, useCallback } from 'react';

export function useRaceTimer(raceDuration, onTick, onEnd) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedBeforeStart, setElapsedBeforeStart] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [, forceRerender] = useState(0);

  // Calcul du temps réel
  const elapsedTime = isRunning && startTimestamp
    ? elapsedBeforeStart + (Date.now() - startTimestamp) / 1000
    : elapsedBeforeStart;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      forceRerender(v => v + 1); // juste pour rafraîchir le composant
      if (onTick) onTick(elapsedTime, Math.max(0, raceDuration - elapsedTime));
      if (elapsedTime >= raceDuration && onEnd) onEnd();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, elapsedTime, onTick, onEnd, raceDuration]);

  // ...startTimer, pauseTimer, resetTimer comme avant...

  return {
    elapsedTime,
    timeRemaining: Math.max(0, raceDuration - elapsedTime),
    isRunning,
    startTimer: () => {
      if (!isRunning) {
        setStartTimestamp(Date.now());
        setIsRunning(true);
      }
    },
    pauseTimer: () => {
      if (isRunning && startTimestamp) {
        setElapsedBeforeStart(prev => prev + (Date.now() - startTimestamp) / 1000);
        setIsRunning(false);
        setStartTimestamp(null);
      }
    },
    resetTimer: () => {
      setElapsedBeforeStart(0);
      setStartTimestamp(null);
      setIsRunning(false);
    },
  };
}