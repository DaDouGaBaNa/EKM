import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flag, Weight, AlertTriangle, User, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import { calculateBallast } from './utils/dashboardUtils';


const CurrentDriverCard = ({ 
  currentDriver, 
  driverRelayTime, 
  driverTotalTime, 
  referenceBallast,
  currentRelayRemainingTime,
  currentRelayEndTime,
  isExpanded,
  onToggleExpand
}) => {
  if (!currentDriver) return null;


  return (
    <motion.div layout className="w-full">
    <Card className="glassmorphism-card shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
        <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
          <User className="h-4 w-4 md:h-5 md:w-5" /> Pilote Actuel
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
              <span className={`h-3 w-3 md:h-4 md:w-4 rounded-full ${currentDriver.color}`}></span>
              <p className="text-xl md:text-2xl font-semibold">{currentDriver.name}</p>
            </div>
            <div className="flex items-center text-xs md:text-sm text-muted-foreground">
              <Weight className="mr-2 h-3 w-3 md:h-4 md:w-4 text-accent" /> Poids: {currentDriver.weight !== null && currentDriver.weight !== undefined ? `${currentDriver.weight} kg` : 'N/A'}
            </div>
            <div className="flex items-center text-xs md:text-sm text-muted-foreground">
              <AlertTriangle className="mr-2 h-3 w-3 md:h-4 md:w-4 text-accent" /> Lest Requis: {calculateBallast(currentDriver.weight, referenceBallast)} kg
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 mt-2 md:mt-3">
              <div>
                <p className="text-xs font-medium text-primary">Relais Écoulé:</p>
                <p className="text-lg md:text-xl font-bold tabular-nums">{formatDurationHHMMSS(driverRelayTime)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-primary">Relais Restant:</p>
                <p className="text-lg md:text-xl font-bold tabular-nums">{formatDurationHHMMSS(currentRelayRemainingTime)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-primary">Fin Relais (estimée):</p>
                <p className="text-lg md:text-xl font-bold tabular-nums">{currentRelayEndTime}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-primary">Temps Total Pilote:</p>
                <p className="text-lg md:text-xl font-bold tabular-nums">{formatDurationHHMMSS(driverTotalTime)}</p>
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

export default CurrentDriverCard;