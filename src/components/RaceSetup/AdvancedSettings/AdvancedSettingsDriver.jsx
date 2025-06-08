import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Clock, Users, PauseCircle } from 'lucide-react';
import { formatDurationToCustomFormat } from '@/utils/timeFormatters';
import { generateNumberOptions } from '@/components/RaceSetup/AdvancedSettings/utils';

const TimeDurationInput = ({ label, icon, config, setConfig, fieldPrefix, hourOptions, minuteOptions, isRaceActive }) => {
  const IconComponent = icon;
  const handleTimeChange = (part, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      newConfig[`${fieldPrefix}${part}`] = value;
      newConfig[`${fieldPrefix}Total`] = (parseInt(part === 'Hours' ? value : prev[`${fieldPrefix}Hours`] || '0', 10) * 3600) + 
                                        (parseInt(part === 'Minutes' ? value : prev[`${fieldPrefix}Minutes`] || '0', 10) * 60);
      return newConfig;
    });
  };

  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        {IconComponent && <IconComponent className="h-3 w-3"/>} {label} (HH:MM)
      </Label>
      <div className="flex items-center gap-2 mt-1">
        <Select value={config[`${fieldPrefix}Hours`] || '00'} onValueChange={(val) => handleTimeChange('Hours', val)} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="HH" /></SelectTrigger>
          <SelectContent>{hourOptions.map(h => <SelectItem key={`${fieldPrefix}h-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
        </Select>
        <span className="font-semibold text-primary">:</span>
        <Select value={config[`${fieldPrefix}Minutes`] || '00'} onValueChange={(val) => handleTimeChange('Minutes', val)} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="MM" /></SelectTrigger>
          <SelectContent>{minuteOptions.map(m => <SelectItem key={`${fieldPrefix}m-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-1">Total: {formatDurationToCustomFormat(config[`${fieldPrefix}Total`] || 0, 'HHMM')}</p>
    </div>
  );
};


const AdvancedSettingsDriver = ({ config, setConfig, isRaceActive }) => {
  const baseHourOptions = generateNumberOptions(0, 5);
  const extendedHourOptions = generateNumberOptions(0, 12);
  const minuteOptions = generateNumberOptions(0, 59);

  return (
    <div className="p-4 border rounded-lg bg-card/40 shadow-sm">
      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <User className="h-4 w-4" /> Pilotes
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TimeDurationInput
          label="Durée Min. Relais"
          icon={Clock}
          config={config}
          setConfig={setConfig}
          fieldPrefix="minRelayDuration"
          hourOptions={baseHourOptions}
          minuteOptions={minuteOptions}
          isRaceActive={isRaceActive}
        />
        <TimeDurationInput
          label="Durée Max. Relais"
          icon={Clock}
          config={config}
          setConfig={setConfig}
          fieldPrefix="maxRelayDuration"
          hourOptions={baseHourOptions}
          minuteOptions={minuteOptions}
          isRaceActive={isRaceActive}
        />
        <TimeDurationInput
          label="Tps Cumulé Max / Pilote"
          icon={Users}
          config={config}
          setConfig={setConfig}
          fieldPrefix="maxTotalTimePerDriver"
          hourOptions={extendedHourOptions}
          minuteOptions={minuteOptions}
          isRaceActive={isRaceActive}
        />
        <TimeDurationInput
          label="Tps Cumulé Min / Pilote"
          icon={Users}
          config={config}
          setConfig={setConfig}
          fieldPrefix="minTotalTimePerDriver"
          hourOptions={extendedHourOptions}
          minuteOptions={minuteOptions}
          isRaceActive={isRaceActive}
        />
        <TimeDurationInput
          label="Tps Repos Min entre Relais"
          icon={PauseCircle}
          config={config}
          setConfig={setConfig}
          fieldPrefix="minRestTimeBetweenRelays"
          hourOptions={extendedHourOptions}
          minuteOptions={minuteOptions}
          isRaceActive={isRaceActive}
        />
      </div>
    </div>
  );
};

export default AdvancedSettingsDriver;