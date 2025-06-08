import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast'; // Already imported
import { CheckCircle, SkipForward, Play, Fuel } from 'lucide-react';


export const useRelayManagement = (
  drivers,
  plannedRelayDurations,
  currentRelayIndex,
  setCurrentRelayIndex,
  currentRelayStartTime,
  setCurrentRelayStartTime,
  isRunning,
  pauseTimer,
  startTimer,
  handleRaceEndCallback,
  completeRelayFunc,
  refuelFunc,
  resetFuelTimerFunc,
  toast // Ensure toast is passed if not already
) => {

  const handleStartRace = useCallback(() => {
    if (!plannedRelayDurations || plannedRelayDurations.length === 0) {
        toast({ variant: "destructive", title: "Erreur Configuration", description: "Le plan de relais est vide. Veuillez configurer les relais."});
        return;
    }
    const currentPlannedRelayConfig = plannedRelayDurations[currentRelayIndex];
    if (!currentPlannedRelayConfig || !drivers.find(d => d.id === currentPlannedRelayConfig.driverId)) {
        toast({ variant: "destructive", title: "Erreur Configuration", description: "Aucun pilote pour le premier relais ou plan de relais manquant."});
        return;
    }
    const currentDriver = drivers.find(d => d.id === currentPlannedRelayConfig.driverId);
    startTimer();
    setCurrentRelayStartTime(new Date());
    resetFuelTimerFunc(); 
    toast({ title: "Course Démarrée!", description: `Pilote: ${currentDriver.name}`, action: <Play className="text-green-500" /> });
  }, [drivers, plannedRelayDurations, currentRelayIndex, startTimer, setCurrentRelayStartTime, toast, resetFuelTimerFunc]);

  const handleNextRelay = useCallback((didRefuel) => {
    const currentPlannedRelayConfig = plannedRelayDurations[currentRelayIndex];
    const currentDriver = currentPlannedRelayConfig ? drivers.find(d => d.id === currentPlannedRelayConfig.driverId) : null;

    if (!isRunning || !currentRelayStartTime || !currentDriver || !currentPlannedRelayConfig) {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de passer au relais suivant (vérifiez état course/pilote)." });
      return;
    }

    const endTime = new Date();
    
    completeRelayFunc(
      currentDriver.id,
      currentDriver.name,
      currentRelayStartTime,
      endTime,
      currentPlannedRelayConfig.duration,
      currentRelayIndex,
      didRefuel // Pass refuel status
    );

    if (didRefuel) { // Use the actual refuel decision from dialog
        refuelFunc(); // This resets the fuel autonomy gauge
        toast({ title: "Ravitaillement effectué!", description: "Autonomie réinitialisée.", action: <Fuel className="text-green-500" /> });
    }


    const nextRelayIdx = currentRelayIndex + 1;
    if (nextRelayIdx >= plannedRelayDurations.length) {
      handleRaceEndCallback(); 
      pauseTimer();
      toast({ title: "Tous les relais planifiés terminés!", action: <CheckCircle className="text-green-500"/> });
      return;
    }

    setCurrentRelayIndex(nextRelayIdx);
    const nextPlannedRelayItem = plannedRelayDurations[nextRelayIdx];
    const nextDriver = drivers.find(d => d.id === nextPlannedRelayItem.driverId);

    if (!nextDriver) {
        toast({ variant: "destructive", title: "Erreur Configuration Relais", description: `Pilote pour relais ${nextRelayIdx + 1} non trouvé.`});
        pauseTimer(); 
        return;
    }
    
    setCurrentRelayStartTime(new Date());
    toast({ title: "Changement de Relais", description: `Pilote: ${nextDriver.name}`, action: <SkipForward className="text-blue-500" /> });
  }, [
    drivers, 
    plannedRelayDurations, 
    currentRelayIndex, 
    isRunning, 
    currentRelayStartTime, 
    setCurrentRelayIndex, 
    setCurrentRelayStartTime, 
    pauseTimer, 
    handleRaceEndCallback, 
    toast,
    completeRelayFunc,
    refuelFunc
  ]);

  return { handleStartRace, handleNextRelay };
};