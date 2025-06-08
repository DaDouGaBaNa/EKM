import { useCallback } from 'react';

export const useDriverTimeCalculations = (
  drivers,
  plannedRelayDurations,
  currentRelayIndex,
  relayHistory,
  driverTimes,
  setDriverTimes,
  currentRelayStartTime
) => {
  
  let isRunningInternal = false; 
  const setIsRunning = (status) => { isRunningInternal = status; };


  const updateDrivingTimes = useCallback((_elapsedRaceTime, _remainingRaceTime) => {
    if (isRunningInternal && currentRelayStartTime && plannedRelayDurations && plannedRelayDurations[currentRelayIndex]) {
      const currentPlannedRelayItem = plannedRelayDurations[currentRelayIndex];
      const currentDriverId = currentPlannedRelayItem.driverId;
      const currentDriver = drivers.find(d => d.id === currentDriverId);

      if (!currentDriver) return;

      const currentRelayElapsedSeconds = (new Date().getTime() - currentRelayStartTime.getTime()) / 1000;
      
      setDriverTimes(prev => {
        if (!prev) return { [currentDriverId]: { total: currentRelayElapsedSeconds, currentRelay: currentRelayElapsedSeconds, relaysDone: 0 } };
        const driverData = prev[currentDriverId] || { total: 0, currentRelay: 0, relaysDone: 0 };
        
        let sumOfPreviousRelaysForDriver = 0;
        relayHistory.forEach(rh => {
            if (rh.driverId === currentDriverId) {
                sumOfPreviousRelaysForDriver += rh.duration;
            }
        });

        return {
          ...prev,
          [currentDriverId]: {
            ...driverData,
            total: sumOfPreviousRelaysForDriver + currentRelayElapsedSeconds,
            currentRelay: currentRelayElapsedSeconds,
          }
        };
      });
    }
  }, [currentRelayStartTime, plannedRelayDurations, currentRelayIndex, drivers, relayHistory, setDriverTimes]);

  const getCurrentDriverDetails = () => {
    if (!plannedRelayDurations || plannedRelayDurations.length === 0 || currentRelayIndex >= plannedRelayDurations.length) {
      return { currentDriver: null, driverCurrentRelayTime: 0, driverTotalTime: 0, currentRelayRemainingTime: 0, currentRelayEndTimeDisplay: "--:--:--" };
    }
    const currentPlannedRelayConfig = plannedRelayDurations[currentRelayIndex];
    const currentDriver = currentPlannedRelayConfig ? drivers.find(d => d.id === currentPlannedRelayConfig.driverId) : null;
    
    const driverCurrentRelayTime = currentDriver && driverTimes && driverTimes[currentDriver.id] ? (driverTimes[currentDriver.id].currentRelay || 0) : 0;
    const currentRelayPlannedDuration = currentPlannedRelayConfig?.duration || 0;
    const currentRelayRemainingTime = Math.max(0, currentRelayPlannedDuration - driverCurrentRelayTime);
    
    const currentRelayEndTimeDisplay = () => {
      if (!isRunningInternal || !currentRelayStartTime || !currentPlannedRelayConfig) return "--:--:--";
      const endTimeMs = currentRelayStartTime.getTime() + (currentPlannedRelayConfig.duration * 1000);
      return new Date(endTimeMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return {
      currentDriver,
      driverCurrentRelayTime,
      driverTotalTime: currentDriver && driverTimes && driverTimes[currentDriver.id] ? (driverTimes[currentDriver.id].total || 0) : 0,
      currentRelayRemainingTime,
      currentRelayEndTimeDisplay: currentRelayEndTimeDisplay()
    };
  };

  const getNextDriverDetails = (currentDriverRelayRemainingTime) => {
    const nextRelayIndex = currentRelayIndex + 1;
    if (!plannedRelayDurations || nextRelayIndex >= plannedRelayDurations.length) {
      return { nextDriver: null, timeToNextRelay: 0, nextRelayStartTimeDisplay: "--:--:--" };
    }
    
    const nextPlannedRelayConfig = plannedRelayDurations[nextRelayIndex];
    const nextDriver = nextPlannedRelayConfig ? drivers.find(d => d.id === nextPlannedRelayConfig.driverId) : null;
    
    const timeToNextRelay = currentDriverRelayRemainingTime || 0;

    const nextRelayStartTimeDisplay = () => {
      if (!isRunningInternal || !currentRelayStartTime || !nextPlannedRelayConfig) return "--:--:--";
      // Assuming currentRelayStartTime is the start of the *current* relay.
      // The next relay starts when the current one ends.
      const currentRelayPlannedDuration = plannedRelayDurations[currentRelayIndex]?.duration || 0;
      const nextRelayStartTimestamp = currentRelayStartTime.getTime() + (currentRelayPlannedDuration * 1000);
      return new Date(nextRelayStartTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return {
      nextDriver,
      timeToNextRelay,
      nextRelayStartTimeDisplay: nextRelayStartTimeDisplay()
    };
  };
  
  return { 
    updateDrivingTimes, 
    getCurrentDriverDetails,
    getNextDriverDetails,
    set isRunning(status) { setIsRunning(status); }, 
    get isRunning() { return isRunningInternal; }
  };
};