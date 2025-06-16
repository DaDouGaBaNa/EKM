import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Play, Pause, SkipForward, StopCircle, Fuel } from 'lucide-react';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import { cn } from '@/lib/utils';

const TimerControls = ({ 
  isRunning, 
  elapsedTime, 
  raceDuration, 
  onStart, 
  onPause, 
  onNextRelay, 
  onStop,
  currentRelayPlannedDuration,
  currentRelayActualDuration,
  isLastRelay,
  isCurrentRelayFuelStopPlanned,
  currentFuelAutonomy,
  initialFuelAutonomy,
  raceReallyEnded,
}) => {
  const [showNextRelayDialog, setShowNextRelayDialog] = useState(false);
  const [refuelDecision, setRefuelDecision] = useState(null); 
  const [showFuelWarning, setShowFuelWarning] = useState(false);

  const handleConfirmNextRelay = () => {
    if (refuelDecision === null) {
      alert("Veuillez choisir si vous effectuez un ravitaillement.");
      return;
    }

    const performRefuel = refuelDecision === 'yes';

    if (performRefuel) {
      onNextRelay(true); 
      resetDialogState();
    } else {
      if (isCurrentRelayFuelStopPlanned && currentFuelAutonomy < (initialFuelAutonomy * 0.25)) { // Example: warn if less than 25% fuel and fuel stop was planned
        setShowFuelWarning(true);
        // Don't close dialog yet, let user confirm warning
      } else {
        onNextRelay(false);
        resetDialogState();
      }
    }
  };

  const handleConfirmWarningAndProceed = () => {
    onNextRelay(false); // Proceed without refuel
    resetDialogState();
  };

  const resetDialogState = () => {
    setShowNextRelayDialog(false);
    setRefuelDecision(null);
    setShowFuelWarning(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-around mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
      {!isRunning && elapsedTime === 0 && (
        <Button onClick={onStart} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-md">
          <Play className="mr-2 h-5 w-5" /> Démarrer
        </Button>
      )}
      {isRunning && (
        <Button onClick={onPause} variant="outline" className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 py-3 text-md">
          <Pause className="mr-2 h-5 w-5" /> Pause
        </Button>
      )}
      {!isRunning && elapsedTime > 0 && elapsedTime < raceDuration && !raceReallyEnded && (
        <Button onClick={onStart} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-md">
          <Play className="mr-2 h-5 w-5" /> Reprendre
        </Button>
      )}
      {elapsedTime > 0 && elapsedTime < raceDuration && (
        <AlertDialog open={showNextRelayDialog} onOpenChange={(open) => {
          if (!open) resetDialogState();
          setShowNextRelayDialog(open);
        }}>
          <AlertDialogTrigger asChild>
            <Button 
              disabled={!isRunning || isLastRelay} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-md"
              onClick={() => setShowNextRelayDialog(true)}
            >
              <SkipForward className="mr-2 h-5 w-5" /> Relais Suivant
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            {!showFuelWarning ? (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer le passage de relais ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <span>Temps théorique du relais : {formatDurationHHMMSS(currentRelayPlannedDuration)}</span><br/>
                    <span>Temps réel du relais : {formatDurationHHMMSS(currentRelayActualDuration)}</span><br />
                    <span className="mt-3 font-semibold">Autonomie restante estimée : {formatDurationHHMMSS(currentFuelAutonomy)} / {formatDurationHHMMSS(initialFuelAutonomy)}</span>
                    {isCurrentRelayFuelStopPlanned && <span className="text-yellow-500 font-semibold">Un arrêt FUEL est planifié pour ce relais.</span>}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                  <div className="font-semibold mb-2">Ravitaillement à la fin de ce relais ?</div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setRefuelDecision('yes')}
                      className={cn("flex-1", refuelDecision === 'yes' ? "bg-green-600 hover:bg-green-700" : "bg-black text-white border-2 border-white hover:bg-neutral-500")}
                    >
                      Oui
                    </Button>
                    <Button 
                      onClick={() => setRefuelDecision('no')}
                      className={cn("flex-1", refuelDecision === 'no' ? "bg-red-600 hover:bg-red-700" : "bg-black text-white border-2 border-white hover:bg-neutral-500")}
                    >
                      Non
                    </Button>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={resetDialogState}>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmNextRelay} disabled={refuelDecision === null} className="bg-blue-600 hover:bg-blue-700">Confirmer</AlertDialogAction>
                </AlertDialogFooter>
              </>
            ) : (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-yellow-500">Avertissement Carburant!</AlertDialogTitle>
                  <AlertDialogDescription>
                    <span className="font-semibold text-destructive">Risque de panne d’essence.</span>
                    <span>Un arrêt FUEL était planifié pour ce relais, et l'autonomie est faible.</span>
                    <span>Êtes-vous sûr de vouloir continuer sans ravitailler ?</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => { setRefuelDecision(null); setShowFuelWarning(false);}}>Revoir la décision</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmWarningAndProceed} className="bg-destructive hover:bg-destructive/90">Confirmer et Continuer sans Fuel</AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
       )}
      {elapsedTime > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1 py-3 text-md">
              <StopCircle className="mr-2 h-5 w-5" /> Arrêter
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer l'arrêt</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir arrêter la course ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onStop} className="bg-destructive hover:bg-destructive/90">Arrêter la Course</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default TimerControls;