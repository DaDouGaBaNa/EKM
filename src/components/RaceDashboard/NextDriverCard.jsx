import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCheck, Weight, AlertTriangle, Clock, ChevronUp, ChevronDown, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import { calculateBallast } from './utils/dashboardUtils';

const roundToNearest2point5 = (value) => {
  return Math.ceil(value / 2.5) * 2.5;
};

const NextDriverCard = ({ 
  nextDriver, 
  timeToNextRelay, 
  nextRelayStartTime,
  referenceBallast,
  ballastToAddFromFuel,
  isExpanded,
  onToggleExpand
}) => {
  if (!nextDriver) return null;

  const isImminent = timeToNextRelay <= 300; 

  const driverWeight = nextDriver.weight !== null && nextDriver.weight !== undefined ? parseFloat(nextDriver.weight) : 0;
  const refBallast = referenceBallast === "Pas de lest" || referenceBallast === 0 ? driverWeight : parseFloat(referenceBallast); // If no ref ballast, target driver weight
  
  const calculatedAdjustedBallast = refBallast - driverWeight + (ballastToAddFromFuel || 0);
  let adjustedBallastDisplay = null;
  if (calculatedAdjustedBallast > 0) {
    adjustedBallastDisplay = `${roundToNearest2point5(calculatedAdjustedBallast).toFixed(1)} kg`;
  }


  return (
    <motion.div layout className="w-full">
      <Card 
        className={`glassmorphism-card shadow-xl overflow-hidden transition-all duration-500 ${isImminent ? 'next-driver-imminent' : ''}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
          <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <UserCheck className="h-4 w-4 md:h-5 md:w-5" /> Pilote Suivant
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
            <CardContent className="p-3 md:p-4 space-y-1 md:space-y-2">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 md:h-4 md:w-4 rounded-full ${nextDriver.color}`}></span>
                <p className="text-xl md:text-2xl font-semibold">{nextDriver.name}</p>
              </div>
              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                <Weight className="mr-2 h-3 w-3 md:h-4 md:w-4 text-accent" /> Poids: {nextDriver.weight !== null && nextDriver.weight !== undefined ? `${nextDriver.weight} kg` : 'N/A'}
              </div>
              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                <AlertTriangle className="mr-2 h-3 w-3 md:h-4 md:w-4 text-accent" /> Lest Requis (base): {calculateBallast(nextDriver.weight, referenceBallast)} kg
              </div>
              {adjustedBallastDisplay && (
                <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                  <Scale className="mr-2 h-3 w-3 md:h-4 md:w-4 text-accent" /> Lest ajusté (si néc.): {adjustedBallastDisplay}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 mt-2 md:mt-3">
                <div>
                  <p className="text-xs font-medium text-primary">Début Relais Prévu:</p>
                  <p className="text-lg md:text-xl font-bold tabular-nums">{nextRelayStartTime}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">Dans:</p>
                  <p className="text-lg md:text-xl font-bold tabular-nums">{formatDurationHHMMSS(timeToNextRelay)}</p>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default NextDriverCard;