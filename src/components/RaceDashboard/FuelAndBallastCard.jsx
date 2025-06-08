import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Fuel, Weight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';

const FuelAndBallastCard = ({
  initialFuelAutonomy,
  currentFuelAutonomy,
  fullTankWeight,
  elapsedTimeSinceLastRefuel,
  weighingExitPit,
  isExpanded,
  onToggleExpand
}) => {
  const fuelPercentage = initialFuelAutonomy > 0 ? (currentFuelAutonomy / initialFuelAutonomy) * 100 : 0;
  
  let ballastToAdd = 0;
  if (initialFuelAutonomy > 0 && fullTankWeight > 0) {
    const fuelConsumedRatio = elapsedTimeSinceLastRefuel / initialFuelAutonomy;
    ballastToAdd = (fullTankWeight * fuelConsumedRatio);
    ballastToAdd = Math.min(ballastToAdd, fullTankWeight); 
    ballastToAdd = Math.max(ballastToAdd, 0); 
  }

  const showBallastInfo = weighingExitPit === 'yes';

  return (
    <motion.div layout className="w-full">
      <Card className="glassmorphism-card shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
          <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <Fuel className="h-4 w-4 md:h-5 md:w-5" /> Autonomie {showBallastInfo ? '& Ajustement Lest' : 'Essence'}
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
              <CardContent className="p-3 md:p-6 space-y-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Autonomie Essence Restante</p>
                  <Progress value={fuelPercentage} className="w-full h-3 md:h-4" />
                  <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-1">
                    <span>{formatDurationHHMMSS(currentFuelAutonomy)}</span>
                    <span>{formatDurationHHMMSS(initialFuelAutonomy)}</span>
                  </div>
                </div>
                {showBallastInfo && (
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Lest à Ajouter (pour compenser essence)</p>
                    <p className="text-2xl md:text-3xl font-bold text-accent tabular-nums">
                      {ballastToAdd.toFixed(2)} kg
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      Basé sur {fullTankWeight || 0} kg de carburant pour {formatDurationHHMMSS(initialFuelAutonomy)} d'autonomie.
                    </p>
                  </div>
                )}
                 {!showBallastInfo && (
                  <p className="text-xs text-muted-foreground/80 italic">
                    Le calcul du lest à ajouter est désactivé (Pesée sorties pits non activée dans les paramètres).
                  </p>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FuelAndBallastCard;