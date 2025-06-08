import { useState, useCallback, useEffect } from 'react';

export const useFuelManagement = (initialAutonomySeconds) => {
  const [currentFuelAutonomy, setCurrentFuelAutonomy] = useState(initialAutonomySeconds);
  const [elapsedTimeSinceLastRefuel, setElapsedTimeSinceLastRefuel] = useState(0);
  const [fuelTimerIntervalId, setFuelTimerIntervalId] = useState(null);

  useEffect(() => {
    setCurrentFuelAutonomy(initialAutonomySeconds);
    setElapsedTimeSinceLastRefuel(0); 
  }, [initialAutonomySeconds]);
  
  const consumeFuel = useCallback((secondsToConsume) => {
    setCurrentFuelAutonomy(prev => Math.max(0, prev - secondsToConsume));
    setElapsedTimeSinceLastRefuel(prev => prev + secondsToConsume);
  }, []);

  const refuel = useCallback(() => {
    setCurrentFuelAutonomy(initialAutonomySeconds);
    setElapsedTimeSinceLastRefuel(0);
  }, [initialAutonomySeconds]);

  const resetFuelTimer = useCallback(() => {
    setElapsedTimeSinceLastRefuel(0);
  }, []);


  return {
    currentFuelAutonomy,
    elapsedTimeSinceLastRefuel,
    consumeFuel,
    refuel,
    resetFuelTimer,
  };
};