import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Timer, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import TimerControls from '@/components/RaceDashboard/TimerControls';

const MainTimerCard = ({ 
  timeRemaining, 
  elapsedTime, 
  raceProgress, 
  isRunning, 
  raceDuration,
  onStartRace, 
  onPauseRace, 
  onNextRelay, 
  onStopRace,
  isExpanded,
  onToggleExpand,
  currentRelayPlannedDuration,
  currentRelayActualDuration,
  isLastRelay,
  isCurrentRelayFuelStopPlanned,
  currentFuelAutonomy,
  initialFuelAutonomy,
}) => {
  return (
    <motion.div layout className="w-full">
    <Card className="glassmorphism-card shadow-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
        <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
          <Timer className="h-4 w-4 md:h-5 md:w-5" /> Chronomètre Course
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-7 w-7 md:h-8 md:w-8">
          {isExpanded ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
        </Button>
      </CardHeader>
      <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="p-3 md:p-6">
            <div className="text-center mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-muted-foreground">Temps Restant</p>
              <p className="text-4xl md:text-6xl font-bold gradient-text tabular-nums">
                {formatDurationHHMMSS(timeRemaining)}
              </p>
            </div>
            <Progress value={raceProgress} className="w-full h-2 md:h-3 mb-3 md:mb-4" />
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-3 md:mb-6">
              <span>Écoulé: {formatDurationHHMMSS(elapsedTime)}</span>
              <span>Total: {formatDurationHHMMSS(raceDuration)}</span>
            </div>
            <TimerControls 
              isRunning={isRunning}
              elapsedTime={elapsedTime}
              raceDuration={raceDuration}
              onStart={onStartRace}
              onPause={onPauseRace}
              onNextRelay={onNextRelay}
              onStop={onStopRace}
              currentRelayPlannedDuration={currentRelayPlannedDuration}
              currentRelayActualDuration={currentRelayActualDuration}
              isLastRelay={isLastRelay}
              isCurrentRelayFuelStopPlanned={isCurrentRelayFuelStopPlanned}
              currentFuelAutonomy={currentFuelAutonomy}
              initialFuelAutonomy={initialFuelAutonomy}
            />
          </CardContent>
        </motion.div>
      )}
      </AnimatePresence>
    </Card>
    </motion.div>
  );
};

export default MainTimerCard;