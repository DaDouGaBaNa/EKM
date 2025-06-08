import { useState, useEffect, useCallback } from 'react';
import { formatDurationMMSS, parseDurationMMSS as parseMMSS } from '@/utils/timeFormatters';

export const useRelayOrderManagement = ({
  drivers,
  raceDuration,
  initialDesiredRelays,
  initialPlannedRelays = [],
  onRelayOrderUpdate,
  currentRelayIndex, 
  isRunning, 
  quickChangeActive,
}) => {
  const [relayPlan, setRelayPlanInternal] = useState(initialPlannedRelays);
  const [editingRelay, setEditingRelay] = useState(null);
  const [editDriverId, setEditDriverId] = useState('');
  const [editDuration, setEditDuration] = useState('');

  const distributeRelayTimeEqually = useCallback((currentPlanArg) => {
    let currentPlan = [...currentPlanArg];
    if (!drivers || drivers.length === 0 || currentPlan.length === 0) {
        onRelayOrderUpdate(currentPlan); 
        return currentPlan;
    }

    const totalRaceTime = raceDuration;
    
    const driverTargetTimes = drivers.reduce((acc, driver) => {
        acc[driver.id] = 0;
        return acc;
    }, {});
    
    const driverRelayCounts = drivers.reduce((acc, driver) => ({ ...acc, [driver.id]: 0 }), {});
    currentPlan.forEach(relay => {
        driverRelayCounts[relay.driverId]++;
    });

    drivers.forEach(driver => {
        if (driverRelayCounts[driver.id] > 0) {
            const numDriversWithRelays = drivers.filter(d => driverRelayCounts[d.id] > 0).length;
            if (numDriversWithRelays > 0) {
                 driverTargetTimes[driver.id] = Math.floor(totalRaceTime / numDriversWithRelays);
            } else {
                 driverTargetTimes[driver.id] = 0;
            }
        }
    });
    
    let extraTimeTotal = 0;
    const numDriversWithRelays = drivers.filter(d => driverRelayCounts[d.id] > 0).length;
    if(numDriversWithRelays > 0){
        extraTimeTotal = totalRaceTime % numDriversWithRelays;
    }


    for (let i = 0; i < drivers.length && extraTimeTotal > 0; i++) {
        const driver = drivers[i];
        if (driverRelayCounts[driver.id] > 0) {
            driverTargetTimes[driver.id]++;
            extraTimeTotal--;
        }
    }

    const updatedPlan = currentPlan.map(relay => {
        const driver = drivers.find(d => d.id === relay.driverId);
        if (!driver || driverRelayCounts[driver.id] === 0) return {...relay, duration: 0};

        const avgTimePerRelayForDriver = Math.floor(driverTargetTimes[driver.id] / driverRelayCounts[driver.id]);
        return { ...relay, duration: avgTimePerRelayForDriver };
    });
    
    drivers.forEach(driver => {
        if (driverRelayCounts[driver.id] > 0) {
            let driverAssignedTime = updatedPlan
                .filter(r => r.driverId === driver.id)
                .reduce((sum, r) => sum + r.duration, 0);
            let driverTimeRemainder = driverTargetTimes[driver.id] - driverAssignedTime;
            
            for (let i = 0; i < updatedPlan.length && driverTimeRemainder > 0; i++) {
                if (updatedPlan[i].driverId === driver.id) {
                    updatedPlan[i].duration++;
                    driverTimeRemainder--;
                }
            }
        }
    });
    
    let totalCalculatedTime = updatedPlan.reduce((sum, r) => sum + r.duration, 0);
    let overallDifference = totalRaceTime - totalCalculatedTime;

    for (let i = 0; i < updatedPlan.length && overallDifference !== 0; i++) {
        const relayToAdjust = updatedPlan[i % updatedPlan.length];
        if (relayToAdjust && driverRelayCounts[relayToAdjust.driverId] > 0) {
            if (overallDifference > 0) {
                relayToAdjust.duration++;
                overallDifference--;
            } else if (overallDifference < 0 && relayToAdjust.duration > 0) {
                relayToAdjust.duration--;
                overallDifference++;
            }
        }
    }
    const finalPlan = updatedPlan.map(relay => ({...relay, isRefuelStop: relay.isRefuelStop || (quickChangeActive === 'yes') }));
    return finalPlan;

  }, [drivers, raceDuration, quickChangeActive]);


  useEffect(() => {
    if (initialPlannedRelays && initialPlannedRelays.length > 0) {
        const planWithQuickChange = initialPlannedRelays.map(relay => ({
            ...relay,
            isRefuelStop: relay.isRefuelStop || (quickChangeActive === 'yes')
        }));
        setRelayPlanInternal(planWithQuickChange);
    } else if (drivers.length > 0 && initialDesiredRelays > 0) {
        const initialPlan = Array.from({ length: initialDesiredRelays }).map((_, index) => {
            const driverIndex = index % drivers.length;
            const driver = drivers[driverIndex];
            return {
                id: `${Date.now()}-${index}-${Math.random()}`,
                driverId: driver.id,
                driverName: driver.name,
                driverColor: driver.color,
                duration: 0,
                originalIndex: index,
                isRefuelStop: quickChangeActive === 'yes',
            };
        });
        const finalPlan = distributeRelayTimeEqually(initialPlan);
        setRelayPlanInternal(finalPlan);
        onRelayOrderUpdate(finalPlan); 
    } else {
        setRelayPlanInternal([]);
        onRelayOrderUpdate([]); 
    }
  }, [drivers, raceDuration, initialDesiredRelays, distributeRelayTimeEqually, onRelayOrderUpdate, initialPlannedRelays, quickChangeActive]);

  const getRelayStatus = useCallback((relayIdx, currentRelayIdx, isRaceRunning) => {
    if (relayIdx < currentRelayIdx) return 'Terminé';
    if (relayIdx === currentRelayIdx && isRaceRunning) return 'En cours';
    return 'Planifié';
  }, []);

  const handleEditRelay = useCallback((relay, index) => {
    const status = getRelayStatus(index, currentRelayIndex, isRunning);
    if (status === 'Terminé') {
      alert("Impossible de modifier un relais terminé.");
      return;
    }
    setEditingRelay({ ...relay, planIndex: index });
    setEditDriverId(relay.driverId);
    setEditDuration(formatDurationMMSS(relay.duration));
  }, [currentRelayIndex, isRunning, getRelayStatus]);

  const handleSaveRelayEdit = useCallback(() => {
    if (!editingRelay) return;
    const newDurationInSeconds = parseMMSS(editDuration);
    if (newDurationInSeconds <= 0) {
      alert("La durée du relais doit être positive.");
      return;
    }
    const driver = drivers.find(d => d.id === editDriverId);
    if (!driver) return;

    const updatedPlan = relayPlan.map((r, idx) =>
      idx === editingRelay.planIndex
        ? { ...r, driverId: editDriverId, driverName: driver.name, driverColor: driver.color, duration: newDurationInSeconds }
        : r
    );
    setRelayPlanInternal(updatedPlan);
    onRelayOrderUpdate(updatedPlan);
    setEditingRelay(null);
  }, [editingRelay, editDuration, editDriverId, drivers, relayPlan, onRelayOrderUpdate]);

  const handleCancelRelayEdit = useCallback(() => setEditingRelay(null), []);

  const handleMoveRelayOrder = useCallback((index, direction) => {
    const newPosition = index + direction;
    if (newPosition < 0 || newPosition >= relayPlan.length) return;

    const statusOfRelayBeingMoved = getRelayStatus(index, currentRelayIndex, isRunning);
    const statusOfRelayAtNewPosition = getRelayStatus(newPosition, currentRelayIndex, isRunning);

    if (statusOfRelayBeingMoved === 'Terminé' || statusOfRelayAtNewPosition === 'Terminé' ||
        statusOfRelayBeingMoved === 'En cours' || statusOfRelayAtNewPosition === 'En cours') {
      alert("Impossible de déplacer un relais terminé ou en cours, ou de le placer sur un tel relais.");
      return;
    }

    const newPlan = [...relayPlan];
    const item = newPlan.splice(index, 1)[0];
    newPlan.splice(newPosition, 0, item);
    setRelayPlanInternal(newPlan);
    onRelayOrderUpdate(newPlan);
  }, [relayPlan, currentRelayIndex, isRunning, onRelayOrderUpdate, getRelayStatus]);

  const handleDeleteRelayOrder = useCallback((index) => {
    const status = getRelayStatus(index, currentRelayIndex, isRunning);
    if (status === 'Terminé' || status === 'En cours') {
      alert("Impossible de supprimer un relais passé ou en cours.");
      return;
    }
    if (relayPlan.length <= 1 && index === 0) {
      alert("Il doit y avoir au moins un relais.");
      return;
    }
    const newPlan = relayPlan.filter((_, i) => i !== index);
    const finalPlan = distributeRelayTimeEqually(newPlan);
    setRelayPlanInternal(finalPlan);
    onRelayOrderUpdate(finalPlan);
  }, [relayPlan, currentRelayIndex, isRunning, distributeRelayTimeEqually, onRelayOrderUpdate, getRelayStatus]);

  const handleAddRelayOrder = useCallback((atIndex) => {
    if (drivers.length === 0) {
      alert("Veuillez d'abord ajouter des pilotes.");
      return;
    }
    const newRelay = {
      id: `${Date.now()}-${Math.random()}`,
      driverId: drivers[0].id,
      driverName: drivers[0].name,
      driverColor: drivers[0].color,
      duration: 0,
      originalIndex: atIndex,
      isRefuelStop: quickChangeActive === 'yes',
    };
    const newPlan = [...relayPlan];
    newPlan.splice(atIndex, 0, newRelay);
    const finalPlan = distributeRelayTimeEqually(newPlan);
    setRelayPlanInternal(finalPlan);
    onRelayOrderUpdate(finalPlan);
  }, [drivers, relayPlan, distributeRelayTimeEqually, onRelayOrderUpdate, quickChangeActive]);

  const toggleRelayRefuelStop = useCallback((index) => {
    const status = getRelayStatus(index, currentRelayIndex, isRunning);
    if (status === 'Terminé') {
      alert("Impossible de modifier un relais terminé.");
      return;
    }
    const newPlan = relayPlan.map((relay, i) =>
      i === index ? { ...relay, isRefuelStop: !relay.isRefuelStop } : relay
    );
    setRelayPlanInternal(newPlan);
    onRelayOrderUpdate(newPlan);
  }, [relayPlan, currentRelayIndex, isRunning, onRelayOrderUpdate, getRelayStatus]);

  return {
    relayPlan,
    setRelayPlan: setRelayPlanInternal, 
    distributeRelayTimeEqually,
    editingRelay,
    editDriverId,
    setEditDriverId,
    editDuration,
    setEditDuration,
    handleEditRelay,
    handleSaveRelayEdit,
    handleCancelRelayEdit,
    handleMoveRelayOrder,
    handleDeleteRelayOrder,
    handleAddRelayOrder,
    getRelayStatus,
    toggleRelayRefuelStop,
  };
};