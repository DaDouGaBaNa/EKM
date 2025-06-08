import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';

export const useRaceTimer = (raceDurationSeconds, onTick, onEnd) => {
  const [timeRemaining, setTimeRemaining] = useState(raceDurationSeconds);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeRemaining(raceDurationSeconds);
    setElapsedTime(0);
  }, [raceDurationSeconds]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearTimerInterval();
            setIsRunning(false);
            if (onEnd) onEnd();
            return 0;
          }
          return prevTime - 1;
        });
        setElapsedTime((prevElapsed) => {
          const newElapsed = prevElapsed + 1;
          if (onTick) onTick(newElapsed, timeRemaining -1);
          return newElapsed;
        });
      }, 1000);
    } else {
      clearTimerInterval();
    }
    return clearTimerInterval;
  }, [isRunning, onTick, onEnd, clearTimerInterval, timeRemaining]);


  const startTimer = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [timeRemaining]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    clearTimerInterval();
    setTimeRemaining(raceDurationSeconds);
    setElapsedTime(0);
  }, [raceDurationSeconds, clearTimerInterval]);

  return {
    timeRemaining,
    elapsedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formattedTimeRemaining: formatDurationHHMMSS(timeRemaining),
    formattedElapsedTime: formatDurationHHMMSS(elapsedTime),
  };
};