import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, ChevronUp, ChevronDown, Weight, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';
import DriverManagement from '@/components/RaceSetup/DriverManagement';

const generateNumberOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => String(start + i).padStart(2, '0'));
};

const generateRangeOptions = (start, end, step = 1) => {
  const options = [];
  for (let i = start; i <= end; i += step) {
    options.push(String(i));
  }
  return options;
};


const RaceSetup = ({ onSetupComplete, initialConfig, isExpanded, onToggleExpand }) => {
  const [raceHours, setRaceHours] = useState(initialConfig ? String(Math.floor(initialConfig.raceDuration / 3600)).padStart(2, '0') : '01');
  const [raceMinutes, setRaceMinutes] = useState(initialConfig ? String(Math.floor((initialConfig.raceDuration % 3600) / 60)).padStart(2, '0') : '00');
  const [referenceBallast, setReferenceBallast] = useState(initialConfig?.referenceBallast || 80);
  const [desiredRelays, setDesiredRelays] = useState(initialConfig?.desiredRelays || (initialConfig?.drivers?.length > 0 ? initialConfig.drivers.length : 1));
  const [drivers, setDrivers] = useState(initialConfig?.drivers || []);
  
  const hourOptions = generateNumberOptions(0, 48);
  const minuteOptions = generateNumberOptions(0, 59);
  const ballastOptions = generateRangeOptions(70, 90, 1);
  const relayOptions = generateRangeOptions(1, 50, 1);

  const calculateTotalRaceDuration = () => (parseInt(raceHours, 10) * 3600) + (parseInt(raceMinutes, 10) * 60);

  const handleSetupComplete = () => {
    const totalRaceDurationSeconds = calculateTotalRaceDuration();
    if (drivers.length === 0) {
      alert("Veuillez ajouter au moins un pilote.");
      return;
    }
    if (parseInt(desiredRelays, 10) <= 0) {
      alert("Le nombre de relais souhaités doit être supérieur à zéro.");
      return;
    }
    if (totalRaceDurationSeconds <=0) {
        alert("La durée de la course doit être positive.");
        return;
    }
    onSetupComplete({ 
      raceDuration: totalRaceDurationSeconds, 
      referenceBallast: parseInt(referenceBallast, 10), 
      desiredRelays: parseInt(desiredRelays, 10), 
      drivers 
    });
  };

  useEffect(() => {
    if (initialConfig) {
        setRaceHours(String(Math.floor(initialConfig.raceDuration / 3600)).padStart(2, '0'));
        setRaceMinutes(String(Math.floor((initialConfig.raceDuration % 3600) / 60)).padStart(2, '0'));
        setReferenceBallast(initialConfig.referenceBallast);
        setDesiredRelays(initialConfig.desiredRelays);
        setDrivers(initialConfig.drivers);
    }
  }, [initialConfig]);


  return (
    <motion.div layout className="w-full">
      <Card className="glassmorphism-card shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-primary/30 flex flex-row justify-between items-center p-4">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
            <Settings className="text-primary h-6 w-6 md:h-7 md:w-7" />
            <span className="gradient-text">Paramètres de course</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onToggleExpand}>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label className="text-sm md:text-md font-semibold text-primary">Durée Course</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Select value={raceHours} onValueChange={setRaceHours}>
                      <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="HH" /></SelectTrigger>
                      <SelectContent>
                        {hourOptions.map(h => <SelectItem key={`h-${h}`} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <span className="text-lg font-bold text-primary">:</span>
                    <Select value={raceMinutes} onValueChange={setRaceMinutes}>
                      <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="MM" /></SelectTrigger>
                      <SelectContent>
                        {minuteOptions.map(m => <SelectItem key={`m-${m}`} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Total: {formatDurationHHMMSS(calculateTotalRaceDuration())}</p>
                </div>
                <div>
                  <Label htmlFor="reference-ballast" className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
                    <Weight className="h-4 w-4"/> Lest de Référence (kg)
                  </Label>
                  <Select value={String(referenceBallast)} onValueChange={(val) => setReferenceBallast(parseInt(val, 10))}>
                    <SelectTrigger id="reference-ballast" className="w-full text-base py-2 mt-1"><SelectValue placeholder="Kg" /></SelectTrigger>
                    <SelectContent>
                      {ballastOptions.map(b => <SelectItem key={`b-${b}`} value={b}>{b} kg</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="desired-relays" className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
                  <Repeat className="h-4 w-4"/> Nb. Relais Souhaités
                </Label>
                 <Select value={String(desiredRelays)} onValueChange={(val) => setDesiredRelays(parseInt(val, 10))}>
                    <SelectTrigger id="desired-relays" className="w-full text-base py-2 mt-1"><SelectValue placeholder="Nb." /></SelectTrigger>
                    <SelectContent>
                      {relayOptions.map(r => <SelectItem key={`r-${r}`} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Nb. arrêts: {Math.max(0, parseInt(desiredRelays, 10) - 1)}</p>
              </div>

              <DriverManagement 
                drivers={drivers} 
                setDrivers={setDrivers} 
                referenceBallast={parseInt(referenceBallast,10)} 
                desiredRelays={parseInt(desiredRelays, 10)}
                setDesiredRelays={(val) => setDesiredRelays(parseInt(val, 10))}
              />
            </CardContent>
            <CardFooter className="border-t border-primary/30 p-4 md:pt-4">
              <Button 
                onClick={handleSetupComplete} 
                disabled={drivers.length === 0 || parseInt(desiredRelays,10) <= 0 || calculateTotalRaceDuration() <=0}
                className="w-full text-sm md:text-md py-2 md:py-3 bg-primary hover:bg-primary/90 transition-opacity duration-300 text-primary-foreground"
              >
                Valider Paramètres
              </Button>
            </CardFooter>
          </motion.div>
        )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default RaceSetup;