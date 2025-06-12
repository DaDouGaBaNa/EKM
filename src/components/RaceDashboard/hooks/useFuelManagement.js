import { useState, useCallback } from 'react';

export const useFuelManagement = (initialAutonomySeconds) => {
  const [lastRefuelTimestamp, setLastRefuelTimestamp] = useState(Date.now());

  // Temps écoulé depuis le dernier refuel (en secondes)
  const elapsedTimeSinceLastRefuel = (Date.now() - lastRefuelTimestamp) / 1000;

  // Carburant restant
  const currentFuelAutonomy = Math.max(0, initialAutonomySeconds - elapsedTimeSinceLastRefuel);

  // Ravitaillement
  const refuel = useCallback(() => {
    setLastRefuelTimestamp(Date.now());
  }, []);

  // Reset (équivalent à refuel)
  const resetFuelTimer = useCallback(() => {
    setLastRefuelTimestamp(Date.now());
  }, []);

  return {
    currentFuelAutonomy,
    elapsedTimeSinceLastRefuel,
    refuel,
    resetFuelTimer,
  };
};