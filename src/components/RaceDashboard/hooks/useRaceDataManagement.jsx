import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const useRaceDataManagement = (initialDrivers, initialPlannedRelayDurations, initialCurrentRelayIndex) => {
  const { toast } = useToast();
  const [currentRelayIndex, setCurrentRelayIndex] = useState(initialCurrentRelayIndex);
  const [relayHistory, setRelayHistory] = useState([]);
  const [driverTimes, setDriverTimes] = useState(() =>
    initialDrivers.reduce((acc, driver) => ({ ...acc, [driver.id]: { total: 0, currentRelay: 0, relaysDone: 0 } }), {})
  );
  const [currentRelayStartTime, setCurrentRelayStartTime] = useState(null);
  const [plannedRelayDurations, setPlannedRelayDurations] = useState(initialPlannedRelayDurations || []);

  const handleRelayOrderUpdate = useCallback((newPlan) => {
    setPlannedRelayDurations(newPlan);
  }, []);

  const completeRelay = useCallback((driverId, driverName, startTime, endTime, plannedDuration, originalIndex, refueled) => {
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    setRelayHistory(prev => [...prev, {
      id: `${Date.now()}-${originalIndex}`, // Added an ID for unique key prop
      driverId,
      driverName,
      startTime,
      endTime,
      duration,
      plannedDuration,
      originalRelayIndexInPlan: originalIndex,
      isRefuelStop: plannedRelayDurations[originalIndex]?.isRefuelStop || false,
      refueled: refueled || false, // Store if actual refuel happened
    }]);

    setDriverTimes(prev => {
      const existingData = prev[driverId] || { total: 0, currentRelay: 0, relaysDone: 0 };
      return {
        ...prev,
        [driverId]: {
          ...existingData,
          total: existingData.total + duration,
          currentRelay: 0,
          relaysDone: existingData.relaysDone + 1,
        }
      };
    });
  }, [plannedRelayDurations]);


  const handleRaceEndLogic = useCallback((drivers, currentPlannedRelayItem, currentRelayStartTimeValue, currentRelayIndexValue) => {
    toast({
      title: "Course Terminée!",
      description: "La course est arrivée à son terme.",
      action: <CheckCircle className="text-green-500" />,
    });

    if (currentRelayStartTimeValue && currentPlannedRelayItem) {
      const endTime = new Date();
      const driverForThisRelay = drivers.find(d => d.id === currentPlannedRelayItem.driverId);
      if (driverForThisRelay) {
        completeRelay(
          driverForThisRelay.id,
          driverForThisRelay.name,
          currentRelayStartTimeValue,
          endTime,
          currentPlannedRelayItem.duration,
          currentRelayIndexValue,
          false // Assume no refuel on race end unless explicitly handled
        );
      } else {
         toast({ variant: "destructive", title: "Erreur Fin de Relais", description: "Pilote non trouvé pour le dernier relais." });
      }
      setCurrentRelayStartTime(null);
    } else if (!currentRelayStartTimeValue && currentRelayIndexValue > 0) {
      if (currentPlannedRelayItem) {
          const driverForThisRelay = drivers.find(d => d.id === currentPlannedRelayItem.driverId);
          if (driverForThisRelay) {
              toast({ variant: "destructive", title: "Info Fin de Course", description: `Course terminée. Dernier relais pour ${driverForThisRelay.name} non démarré formellement.` });
          }
      } else {
          toast({ title: "Info Fin de Course", description: "La course s'est terminée." });
      }
    } else if (!currentPlannedRelayItem && currentRelayIndexValue >= plannedRelayDurations.length) {
       // All relays done
    } else {
        toast({ title: "Info Fin de Course", description: "La course s'est terminée avant ou pendant le premier relais." });
    }
  }, [toast, completeRelay, plannedRelayDurations]);

  return {
    currentRelayIndex,
    setCurrentRelayIndex,
    relayHistory,
    setRelayHistory,
    driverTimes,
    setDriverTimes,
    currentRelayStartTime,
    setCurrentRelayStartTime,
    plannedRelayDurations,
    setPlannedRelayDurations,
    handleRelayOrderUpdate,
    handleRaceEndLogic,
    completeRelay
  };
};