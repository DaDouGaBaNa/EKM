import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap, Fuel, Wrench } from 'lucide-react';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import { cn } from '@/lib/utils';

const Indicator = ({ icon: Icon, title, status, isExpanded, onToggleExpand }) => {
  return (
    <motion.div
  layout
  className="flex-1 min-w-[220px] max-w-full sm:max-w-[350px] md:max-w-[320px]">
      <Card className="glassmorphism-card shadow-lg overflow-hidden h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 border-b border-primary/30">
          <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
            <Icon className="h-4 w-4" /> {title}
          </CardTitle>
          <button onClick={onToggleExpand} className="focus:outline-none">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-5 h-5 rounded-full shrink-0", status.color)}></div>
                  <span className="text-xs text-card-foreground">{status.text}</span>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};


const PitLaneIndicatorLogic = ({ pitOpenTimeTotal, pitCloseTimeTotal, elapsedTime, isRunning }) => {
  const [status, setStatus] = useState({ color: 'bg-gray-500', text: 'Pitlane: Données non définies' });

  useEffect(() => {
  if (!isRunning) {
    setStatus({ color: 'bg-gray-500', text: 'Pitlane: Course non démarrée' });
    return;
  }

  if (
    pitOpenTimeTotal === undefined || pitOpenTimeTotal === null || pitOpenTimeTotal === 0 ||
  pitCloseTimeTotal === undefined || pitCloseTimeTotal === null || pitCloseTimeTotal === 0
  ) {
    setStatus({ color: 'bg-gray-500', text: 'Pitlane: Données non définies' });
    return;
  }

  const update = () => {
    if (elapsedTime < pitOpenTimeTotal) {
      const timeToOpen = pitOpenTimeTotal - elapsedTime;
      setStatus({
        color: 'bg-red-500',
        text: `Pitlane fermée – Ouverture dans ${formatDurationHHMMSS(timeToOpen)}`,
      });
    } else if (elapsedTime >= pitOpenTimeTotal && elapsedTime < pitCloseTimeTotal) {
      const timeToClose = pitCloseTimeTotal - elapsedTime;
      setStatus({
        color: 'bg-green-500',
        text: `Pitlane ouverte – Fermeture dans ${formatDurationHHMMSS(timeToClose)}`,
      });
    } else {
      setStatus({
        color: 'bg-black text-white',
        text: 'Pitlane fermée jusqu’à la fin de course',
      });
    }
  };

  update();
}, [pitOpenTimeTotal, pitCloseTimeTotal, elapsedTime, isRunning]);
  
  return status;
};

const RefuelWindowIndicatorLogic = ({ refuelWindows, elapsedTime, isRunning }) => {
  const [status, setStatus] = useState({ color: 'bg-gray-500', text: 'Fenêtre Refuel: Données non définies' });

  useEffect(() => {
    if (!refuelWindows || refuelWindows.length === 0) {
      setStatus({ color: 'bg-gray-500', text: 'Fenêtre Refuel: Aucune fenêtre définie' });
      return;
    }
    if (!isRunning) {
      setStatus({ color: 'bg-gray-500', text: 'Fenêtre Refuel: Course non démarrée' });
      return;
    }
    
    const sortedWindows = [...refuelWindows].sort((a, b) => a.start.total - b.start.total);

    const update = () => {
      let currentWindow = null;
      let nextWindow = null;

      for (const win of sortedWindows) {
        if (elapsedTime >= win.start.total && elapsedTime < win.end.total) {
          currentWindow = win;
          break;
        }
        if (elapsedTime < win.start.total && (!nextWindow || win.start.total < nextWindow.start.total)) {
          nextWindow = win;
        }
      }

      if (currentWindow) {
        const timeToClose = currentWindow.end.total - elapsedTime;
        setStatus({
          color: 'bg-green-500',
          text: `Ravitaillement autorisé. Fermeture dans ${formatDurationHHMMSS(timeToClose)}`,
        });
      } else if (nextWindow) {
        const timeToOpen = nextWindow.start.total - elapsedTime;
        setStatus({
          color: 'bg-red-500',
          text: `Ravitaillement impossible. Ouverture dans ${formatDurationHHMMSS(timeToOpen)}`,
        });
      } else {
        const lastWindow = sortedWindows[sortedWindows.length - 1];
        if (elapsedTime >= lastWindow.end.total) {
          setStatus({
            color: 'bg-black text-white',
            text: 'Ravitaillement terminé jusqu’à la fin de course',
          });
        } else {
           setStatus({ color: 'bg-gray-500', text: 'Fenêtre Refuel: Statut indéterminé' });
        }
      }
    };
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [refuelWindows, elapsedTime, isRunning]);

  return status;
};

const TechnicalStopWindowIndicatorLogic = ({ technicalPitStopWindows, elapsedTime, isRunning }) => {
  const [status, setStatus] = useState({ color: 'bg-gray-500', text: 'Fenêtre Arrêt Tech.: Données non définies' });

  useEffect(() => {
    if (!technicalPitStopWindows || technicalPitStopWindows.length === 0) {
      setStatus({ color: 'bg-gray-500', text: 'Fenêtre Arrêt Tech.: Aucune fenêtre définie' });
      return;
    }
    if (!isRunning) {
      setStatus({ color: 'bg-gray-500', text: 'Fenêtre Arrêt Tech.: Course non démarrée' });
      return;
    }

    const sortedWindows = [...technicalPitStopWindows].sort((a, b) => a.start.total - b.start.total);
    
    const update = () => {
      let currentWindow = null;
      let nextWindow = null;

      for (const win of sortedWindows) {
        if (elapsedTime >= win.start.total && elapsedTime < win.end.total) {
          currentWindow = win;
          break;
        }
        if (elapsedTime < win.start.total && (!nextWindow || win.start.total < nextWindow.start.total)) {
          nextWindow = win;
        }
      }

      if (currentWindow) {
        const timeToClose = currentWindow.end.total - elapsedTime;
        setStatus({
          color: 'bg-green-500',
          text: `Arrêt technique autorisé. Fermeture dans ${formatDurationHHMMSS(timeToClose)}`,
        });
      } else if (nextWindow) {
        const timeToOpen = nextWindow.start.total - elapsedTime;
        setStatus({
          color: 'bg-red-500',
          text: `Arrêt technique impossible. Ouverture dans ${formatDurationHHMMSS(timeToOpen)}`,
        });
      } else {
        const lastWindow = sortedWindows[sortedWindows.length - 1];
        if (elapsedTime >= lastWindow.end.total) {
          setStatus({
            color: 'bg-black text-white',
            text: 'Atelier fermé jusqu’à la fin de course',
          });
        } else {
           setStatus({ color: 'bg-gray-500', text: 'Fenêtre Arrêt Tech.: Statut indéterminé' });
        }
      }
    };
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [technicalPitStopWindows, elapsedTime, isRunning]);

  return status;
};


const PitEventsCard = ({ advancedSettings, elapsedTime, isRunning }) => {
  const [expandedIndicators, setExpandedIndicators] = useState({
    pitlane: true,
    refuel: true,
    technical: true,
  });

  const toggleIndicator = (indicatorName) => {
    setExpandedIndicators(prev => ({ ...prev, [indicatorName]: !prev[indicatorName] }));
  };

  const pitLaneStatus = PitLaneIndicatorLogic({
    pitOpenTimeTotal: advancedSettings?.pitOpenTimeTotal,
    pitCloseTimeTotal: advancedSettings?.pitCloseTimeTotal,
    elapsedTime,
    isRunning,
  });

  const refuelStatus = RefuelWindowIndicatorLogic({
    refuelWindows: advancedSettings?.refuelWindows,
    elapsedTime,
    isRunning,
  });

  const technicalStatus = TechnicalStopWindowIndicatorLogic({
    technicalPitStopWindows: advancedSettings?.technicalPitStopWindows,
    elapsedTime,
    isRunning,
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4 w-full">
        <Indicator
          icon={Zap}
          title="Pitlane"
          status={pitLaneStatus}
          isExpanded={expandedIndicators.pitlane}
          onToggleExpand={() => toggleIndicator('pitlane')}
        />
        <Indicator
          icon={Fuel}
          title="Fenêtre Refuel"
          status={refuelStatus}
          isExpanded={expandedIndicators.refuel}
          onToggleExpand={() => toggleIndicator('refuel')}
        />
        <Indicator
          icon={Wrench}
          title="Fenêtre Arrêt Tech."
          status={technicalStatus}
          isExpanded={expandedIndicators.technical}
          onToggleExpand={() => toggleIndicator('technical')}
        />
      </div>
    </div>
  );
};

export default PitEventsCard;