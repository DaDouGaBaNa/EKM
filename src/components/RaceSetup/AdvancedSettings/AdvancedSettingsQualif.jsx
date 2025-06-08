import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, Clock, Fuel } from 'lucide-react';
import { formatDurationToCustomFormat } from '@/utils/timeFormatters';
import { generateNumberOptions, PLACEHOLDER_VALUE } from '@/components/RaceSetup/AdvancedSettings/utils';

const AdvancedSettingsQualif = ({ config, setConfig, isRaceActive }) => {
  const baseHourOptions = generateNumberOptions(0, 5);
  const minuteOptions = generateNumberOptions(0, 59);
  const yesNoOptions = [{value: PLACEHOLDER_VALUE, label: "Choisir..."}, { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }];

  const handleTimeChange = (fieldPrefix, part, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      newConfig[`${fieldPrefix}${part}`] = value;
      newConfig[`${fieldPrefix}Total`] = (parseInt(part === 'Hours' ? value : prev[`${fieldPrefix}Hours`] || '0', 10) * 3600) + 
                                        (parseInt(part === 'Minutes' ? value : prev[`${fieldPrefix}Minutes`] || '0', 10) * 60);
      return newConfig;
    });
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value === PLACEHOLDER_VALUE ? '' : value }));
  };

  return (
    <div className="p-4 border rounded-lg bg-card/40 shadow-sm">
      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <Flag className="h-4 w-4" /> Qualifications
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> Durée Qualifs (HH:MM)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Select value={config.qualifDurationHours || '00'} onValueChange={(val) => handleTimeChange('qualifDuration', 'Hours', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="HH" /></SelectTrigger>
              <SelectContent>{baseHourOptions.map(h => <SelectItem key={`qdh-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
            <span className="font-semibold text-primary">:</span>
            <Select value={config.qualifDurationMinutes || '00'} onValueChange={(val) => handleTimeChange('qualifDuration', 'Minutes', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="MM" /></SelectTrigger>
              <SelectContent>{minuteOptions.map(m => <SelectItem key={`qdm-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-1">Total: {formatDurationToCustomFormat(config.qualifDurationTotal || 0, 'HHMM')}</p>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3"/>Refuel après Qualifs</Label>
          <Select value={config.refuelAfterQualif || PLACEHOLDER_VALUE} onValueChange={(val) => handleInputChange('refuelAfterQualif', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-sm py-1.5 mt-1"><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>{yesNoOptions.map(opt => <SelectItem key={`raq-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsQualif;