import React, { useState, useCallback, useEffect } from 'react';
import { useRaceTimer } from '@/hooks/useRaceTimer';
import { useToast } from '@/components/ui/use-toast';
import { Pause, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainTimerCard from '@/components/RaceDashboard/MainTimerCard';
import PitEventsCard from '@/components/RaceDashboard/PitEventsCard';
import CurrentDriverCard from '@/components/RaceDashboard/CurrentDriverCard';
import NextDriverCard from '@/components/RaceDashboard/NextDriverCard';
import DriverStatsCard from '@/components/RaceDashboard/DriverStatsCard';
import RelayLogCard from '@/components/RaceDashboard/RelayLogCard';
import RelayOrderCard from '@/components/RaceDashboard/RelayOrderCard';
import FuelAndBallastCard from '@/components/RaceDashboard/FuelAndBallastCard';
import LiveTimingSelector from '@/components/LiveTimingSelector';
import { motion } from 'framer-motion';
import { useRelayManagement } from '@/components/RaceDashboard/hooks/useRelayManagement';
import { useDriverTimeCalculations } from '@/components/RaceDashboard/hooks/useDriverTimeCalculations';
import { useRaceDataManagement } from '@/components/RaceDashboard/hooks/useRaceDataManagement';
import { useFuelManagement } from '@/components/RaceDashboard/hooks/useFuelManagement';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRelayOrderManagement } from '@/components/RaceDashboard/hooks/useRelayOrderManagement';
import { useRaceSetupManager } from '@/components/RaceSetup/hooks/useRaceSetupManager'; 

const RaceDashboard = ({ raceConfig, onResetRace, onBackToSetup }) => {
  const { toast } = useToast();
  const { 
    drivers, raceDuration, referenceBallast, 
    desiredRelays: initialDesiredRelays, 
    fuelAutonomy: initialFuelAutonomyProp, 
    minPitStopTime,
    advancedSettings 
  } = raceConfig;

  const fullTankWeight = advancedSettings?.fullTankWeight || 0;
  const weighingExitPitStatus = advancedSettings?.weighingExitPit || 'no';
  const quickChangeStatus = advancedSettings?.quickChangeActive || 'no';

  const {
    currentRelayIndex, setCurrentRelayIndex,
    relayHistory, setRelayHistory,
    driverTimes, setDriverTimes,
    currentRelayStartTime, setCurrentRelayStartTime,
    plannedRelayDurations, setPlannedRelayDurations,
    handleRelayOrderUpdate: updatePlannedRelaysInRaceData, 
    handleRaceEndLogic,
    completeRelay
  } = useRaceDataManagement(drivers, raceConfig.plannedRelayDurations || [], 0);
  
  const {
    relayPlan,
    distributeRelayTimeEqually,
    handleEditRelay,
    handleSaveRelayEdit,
    handleCancelRelayEdit,
    handleMoveRelayOrder,
    handleDeleteRelayOrder,
    handleAddRelayOrder,
    getRelayStatus,
    toggleRelayRefuelStop,
    editingRelay,
    editDriverId,
    setEditDriverId: setEditDriverIdInOrder,
    editDuration,
    setEditDuration: setEditDurationInOrder,
  } = useRelayOrderManagement({
    drivers,
    raceDuration,
    initialDesiredRelays,
    initialPlannedRelays: plannedRelayDurations,
    onRelayOrderUpdate: updatePlannedRelaysInRaceData, 
    currentRelayIndex,
    isRunning: false, 
    quickChangeActive: quickChangeStatus,
  });


  const {
    currentFuelAutonomy,
    elapsedTimeSinceLastRefuel,
    refuel,
    resetFuelTimer,
  } = useFuelManagement(initialFuelAutonomyProp);


  const [expandedSections, setExpandedSections] = useState({
    timer: true, currentDriver: true, nextDriver: true, relayOrder: true,
    log: true, stats: true, fuelBallast: true, pitEvents: true,
  });

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [raceReallyEnded, setRaceReallyEnded] = useState(false);
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleActualRaceEnd = useCallback(() => {
    const currentPlannedRelayItem = plannedRelayDurations[currentRelayIndex];
    handleRaceEndLogic(drivers, currentPlannedRelayItem, currentRelayStartTime, currentRelayIndex);
    setShowExportDialog(true); 
  }, [handleRaceEndLogic, drivers, plannedRelayDurations, currentRelayIndex, currentRelayStartTime]);

  const handleCloseExportDialog = () => {
  setShowExportDialog(false);
  setRaceReallyEnded(true);
};
  const driverCalculationsHook = useDriverTimeCalculations(
    drivers,
    plannedRelayDurations,
    currentRelayIndex,
    relayHistory,
    driverTimes, 
    setDriverTimes,
    currentRelayStartTime,
  );

  const {
    elapsedTime,
    timeRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useRaceTimer(raceDuration, (newElapsed, newRemaining) => {
     if (driverCalculationsHook && typeof driverCalculationsHook.updateDrivingTimes === 'function') {
      driverCalculationsHook.updateDrivingTimes(newElapsed, newRemaining);
    }
  
  }, handleActualRaceEnd);

  
  driverCalculationsHook.isRunning = isRunning; 

  const { currentDriver, driverCurrentRelayTime, driverTotalTime, currentRelayRemainingTime, currentRelayEndTimeDisplay } = driverCalculationsHook.getCurrentDriverDetails();
  const { nextDriver, timeToNextRelay, nextRelayStartTimeDisplay } = driverCalculationsHook.getNextDriverDetails(currentRelayRemainingTime);
  
  const {
    handleStartRace,
    handleNextRelay
  } = useRelayManagement(
    drivers,
    plannedRelayDurations,
    currentRelayIndex,
    setCurrentRelayIndex,
    currentRelayStartTime,
    setCurrentRelayStartTime,
    isRunning,
    pauseTimer,
    startTimer,
    handleActualRaceEnd,
    completeRelay,
    refuel, 
    resetFuelTimer,
    toast 
  );

  const handlePauseRace = () => {
    pauseTimer();
    toast({ title: "Course en Pause", action: <Pause className="text-yellow-500" /> });
  };

  const handleStopRace = () => {
    pauseTimer();
    handleActualRaceEnd();
  };

  const raceProgress = raceDuration > 0 ? (elapsedTime / raceDuration) * 100 : 0;

  const handleFullReset = () => {
    resetTimer();
    refuel(); 
    onResetRace();
  };

  const isLastRelay = currentRelayIndex >= plannedRelayDurations.length - 1;

  const currentRelayPlannedDurationForControls = plannedRelayDurations[currentRelayIndex]?.duration || 0;
  const currentRelayActualDurationForControls = driverCurrentRelayTime || 0;
  const isCurrentRelayFuelStopPlannedForControls = plannedRelayDurations[currentRelayIndex]?.isRefuelStop || false;


  useEffect(() => {
    if (raceConfig && raceConfig.plannedRelayDurations) {
      setPlannedRelayDurations(raceConfig.plannedRelayDurations);
      
      if(relayPlan.length === 0 && raceConfig.plannedRelayDurations.length > 0){
        distributeRelayTimeEqually(raceConfig.plannedRelayDurations);
      }
    }
  }, [raceConfig, setPlannedRelayDurations, relayPlan.length, distributeRelayTimeEqually]);

  const handleExportData = () => {
      const dataToExport = {
        raceConfig: { ...raceConfig, fuelAutonomy: initialFuelAutonomyProp, minPitStopTime, advancedSettings },
        relayHistory,
        driverTimes,
        finalElapsedTime: elapsedTime,
        finalTimeRemaining: timeRemaining,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = `race_data_${new Date().toISOString().slice(0,10)}.json`;
      link.click();
      setShowExportDialog(false);
      toast({ title: "Données Exportées", description: "Les données de la course ont été téléchargées.", action: <Download className="text-green-500" /> });
    };

  let ballastToAddFromFuelCard = 0;
  if (initialFuelAutonomyProp > 0 && fullTankWeight > 0) {
    const fuelConsumedRatio = elapsedTimeSinceLastRefuel / initialFuelAutonomyProp;
    ballastToAddFromFuelCard = (fullTankWeight * fuelConsumedRatio);
    ballastToAddFromFuelCard = Math.min(ballastToAddFromFuelCard, fullTankWeight);
    ballastToAddFromFuelCard = Math.max(ballastToAddFromFuelCard, 0);
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-3 md:space-y-4"
    >
      <MainTimerCard
        timeRemaining={timeRemaining}
        elapsedTime={elapsedTime}
        raceProgress={raceProgress}
        isRunning={isRunning}
        raceReallyEnded={raceReallyEnded}
        raceDuration={raceDuration}
        onStartRace={handleStartRace}
        onPauseRace={handlePauseRace}
        onNextRelay={handleNextRelay}
        onStopRace={handleStopRace}
        isExpanded={expandedSections.timer}
        onToggleExpand={() => toggleSection('timer')}
        currentRelayPlannedDuration={currentRelayPlannedDurationForControls}
        currentRelayActualDuration={currentRelayActualDurationForControls}
        isLastRelay={isLastRelay}
        isCurrentRelayFuelStopPlanned={isCurrentRelayFuelStopPlannedForControls}
        currentFuelAutonomy={currentFuelAutonomy}
        initialFuelAutonomy={initialFuelAutonomyProp}
      />
      <PitEventsCard 
        advancedSettings={advancedSettings}
        elapsedTime={elapsedTime}
        isRunning={isRunning}
      />
      
      <FuelAndBallastCard
        initialFuelAutonomy={initialFuelAutonomyProp}
        currentFuelAutonomy={currentFuelAutonomy}
        fullTankWeight={fullTankWeight}
        elapsedTimeSinceLastRefuel={elapsedTimeSinceLastRefuel}
        weighingExitPit={weighingExitPitStatus}
        isExpanded={expandedSections.fuelBallast}
        onToggleExpand={() => toggleSection('fuelBallast')}
      />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {currentDriver && (
          <CurrentDriverCard
            currentDriver={currentDriver}
            driverRelayTime={driverCurrentRelayTime}
            driverTotalTime={driverTotalTime}
            referenceBallast={referenceBallast}
            currentRelayRemainingTime={currentRelayRemainingTime}
            currentRelayEndTime={currentRelayEndTimeDisplay}
            isExpanded={expandedSections.currentDriver}
            onToggleExpand={() => toggleSection('currentDriver')}
          />
        )}
         {nextDriver && !isLastRelay && (
          <NextDriverCard
            nextDriver={nextDriver}
            timeToNextRelay={timeToNextRelay}
            nextRelayStartTime={nextRelayStartTimeDisplay}
            referenceBallast={referenceBallast}
            ballastToAddFromFuel={ballastToAddFromFuelCard}
            isExpanded={expandedSections.nextDriver}
            onToggleExpand={() => toggleSection('nextDriver')}
          />
        )}
      </div>


      <RelayOrderCard
        drivers={drivers}
        referenceBallast={referenceBallast}
        currentRelayIndex={currentRelayIndex}
        isRunning={isRunning} 
        isExpanded={expandedSections.relayOrder}
        onToggleExpand={() => toggleSection('relayOrder')}
        fuelAutonomy={initialFuelAutonomyProp}
        minPitStopTime={minPitStopTime}
        
        relayPlan={relayPlan}
        editingRelay={editingRelay}
        editDriverId={editDriverId}
        setEditDriverId={setEditDriverIdInOrder}
        editDuration={editDuration}
        setEditDuration={setEditDurationInOrder}
        onEditRelay={handleEditRelay}
        onSaveRelayEdit={handleSaveRelayEdit}
        onCancelRelayEdit={handleCancelRelayEdit}
        onMoveRelay={handleMoveRelayOrder}
        onDeleteRelay={handleDeleteRelayOrder}
        onAddRelay={handleAddRelayOrder}
        onToggleRefuelStop={toggleRelayRefuelStop}
        getRelayStatus={(idx) => getRelayStatus(idx, currentRelayIndex, isRunning)} 
        
        onRelayOrderUpdate={updatePlannedRelaysInRaceData}
        distributeRelayTimeEqually={distributeRelayTimeEqually}
      />

      <RelayLogCard
        relays={relayHistory}
        drivers={drivers}
        isExpanded={expandedSections.log}
        onToggleExpand={() => toggleSection('log')}
      />

      <DriverStatsCard
        drivers={drivers}
        driverTimes={driverTimes}
        relays={relayHistory}
        plannedRelayDurations={plannedRelayDurations}
        raceDuration={raceDuration}
        isExpanded={expandedSections.stats}
        onToggleExpand={() => toggleSection('stats')}
      />
      <LiveTimingSelector />
      
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Course Terminée</AlertDialogTitle>
            <AlertDialogDescription>
              La course est terminée. Souhaitez-vous exporter les données de la course ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseExportDialog}>Non merci</AlertDialogCancel>
            <AlertDialogAction onClick={() => { handleExportData(); handleCloseExportDialog(); }}>Exporter les Données</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <Button 
          onClick={onBackToSetup} 
          variant="outline" 
          className="w-full sm:w-auto py-2 px-4 md:py-3 md:px-6 text-xs md:text-md"
          disabled={isRunning && elapsedTime > 0}
        >
          Modifier Paramètres
        </Button>
        <Button 
          onClick={handleFullReset} 
          variant="destructive" 
          className="w-full sm:w-auto py-2 px-4 md:py-3 md:px-6 text-xs md:text-md"
          disabled={isRunning && elapsedTime > 0}
        >
          <RotateCcw className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> Réinitialiser Course
        </Button>
      </div>
    </motion.div>
  );
};

export default RaceDashboard;