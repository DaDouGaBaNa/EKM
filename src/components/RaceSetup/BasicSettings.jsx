import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Weight, Repeat, Fuel, Clock } from 'lucide-react';
import { formatDurationToCustomFormat } from '@/utils/timeFormatters';
import SettingsImportExport from './SettingsImportExport';

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

const BasicSettings = ({ config, setConfig, isRaceActive }) => {
  const {
    raceHours, raceMinutes, referenceBallast, desiredRelays,
    fuelAutonomyHours, fuelAutonomyMinutes,
    minPitStopTimeMinutes, minPitStopTimeSeconds
  } = config;

  const hourOptions = generateNumberOptions(0, 48);
  const minuteOptions = generateNumberOptions(0, 59);
  const secondOptions = generateNumberOptions(0, 59);
  const fuelAutonomyHourOptions = generateNumberOptions(0, 5);
  const pitStopMinuteOptions = generateNumberOptions(0, 5);
  const ballastOptions = ["Pas de lest", ...generateRangeOptions(70, 90, 1)];
  const relayOptions = generateRangeOptions(1, 50, 1);

  const calculateTotalRaceDuration = () => (parseInt(raceHours || '0', 10) * 3600) + (parseInt(raceMinutes || '0', 10) * 60);
  const calculateFuelAutonomy = () => (parseInt(fuelAutonomyHours || '0', 10) * 3600) + (parseInt(fuelAutonomyMinutes || '0', 10) * 60);
  const calculateMinPitStopTime = () => (parseInt(minPitStopTimeMinutes || '0', 10) * 60) + (parseInt(minPitStopTimeSeconds || '0', 10));

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div>
        <Label className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
          <Clock className="h-4 w-4"/> Durée Course (HH:MM)
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Select value={raceHours} onValueChange={(val) => handleChange('raceHours', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="HH" /></SelectTrigger>
            <SelectContent>
              {hourOptions.map(h => <SelectItem key={`h-${h}`} value={h}>{h}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-lg font-bold text-primary">:</span>
          <Select value={raceMinutes} onValueChange={(val) => handleChange('raceMinutes', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="MM" /></SelectTrigger>
            <SelectContent>
              {minuteOptions.map(m => <SelectItem key={`m-${m}`} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Total: {formatDurationToCustomFormat(calculateTotalRaceDuration(), 'HHMM')}</p>
      </div>
      <div>
        <Label htmlFor="reference-ballast" className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
          <Weight className="h-4 w-4"/> Poids de Référence (kg)
        </Label>
        <Select value={String(referenceBallast)} onValueChange={(val) => handleChange('referenceBallast', val)} disabled={isRaceActive}>
          <SelectTrigger id="reference-ballast" className="w-full text-base py-2 mt-1"><SelectValue placeholder="Kg" /></SelectTrigger>
          <SelectContent>
            {ballastOptions.map(b => <SelectItem key={`b-${b}`} value={b}>{b === "Pas de lest" ? b : `${b} kg`}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
          <Label htmlFor="desired-relays" className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
              <Repeat className="h-4 w-4"/> Nb. Relais Souhaités
          </Label>
          <Select value={String(desiredRelays)} onValueChange={(val) => handleChange('desiredRelays', parseInt(val, 10))} disabled={isRaceActive}>
              <SelectTrigger id="desired-relays" className="w-full text-base py-2 mt-1"><SelectValue placeholder="Nb." /></SelectTrigger>
              <SelectContent>
              {relayOptions.map(r => <SelectItem key={`r-${r}`} value={r}>{r}</SelectItem>)}
              </SelectContent>
          </Select>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Nb. arrêts: {Math.max(0, parseInt(desiredRelays, 10) - 1)}</p>
      </div>
      <div>
        <Label className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
          <Fuel className="h-4 w-4"/> Autonomie Essence (HH:MM)
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Select value={fuelAutonomyHours} onValueChange={(val) => handleChange('fuelAutonomyHours', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="HH" /></SelectTrigger>
            <SelectContent>
              {fuelAutonomyHourOptions.map(h => <SelectItem key={`fh-${h}`} value={h}>{h}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-lg font-bold text-primary">:</span>
          <Select value={fuelAutonomyMinutes} onValueChange={(val) => handleChange('fuelAutonomyMinutes', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="MM" /></SelectTrigger>
            <SelectContent>
              {minuteOptions.map(m => <SelectItem key={`fm-${m}`} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Total: {formatDurationToCustomFormat(calculateFuelAutonomy(), 'HHMM')}</p>
      </div>
      <div>
        <Label className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
          <Clock className="h-4 w-4"/> Durée Min. Arrêt Stand (MM:SS)
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Select value={minPitStopTimeMinutes} onValueChange={(val) => handleChange('minPitStopTimeMinutes', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="MM" /></SelectTrigger>
            <SelectContent>
              {pitStopMinuteOptions.map(m => <SelectItem key={`pm-${m}`} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-lg font-bold text-primary">:</span>
          <Select value={minPitStopTimeSeconds} onValueChange={(val) => handleChange('minPitStopTimeSeconds', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-base py-2"><SelectValue placeholder="SS" /></SelectTrigger>
            <SelectContent>
              {secondOptions.map(s => <SelectItem key={`ps-${s}`} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Total: {formatDurationToCustomFormat(calculateMinPitStopTime(), 'MMSS')}</p>
      </div>
    </div>
    <SettingsImportExport config={config} setConfig={setConfig} label="Paramètres de base" />
    </>
  );
};

export default BasicSettings;