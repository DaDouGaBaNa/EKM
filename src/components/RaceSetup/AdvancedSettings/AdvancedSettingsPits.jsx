
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Wind, Fuel, Gauge, Wrench as Tool, PlusCircle } from 'lucide-react';
import { formatDurationToCustomFormat } from '@/utils/timeFormatters';
import { generateNumberOptions, PLACEHOLDER_VALUE } from '@/components/RaceSetup/AdvancedSettings/utils';
import TimeWindowInput from '@/components/RaceSetup/AdvancedSettings/TimeWindowInput';

const AdvancedSettingsPits = ({ config, setConfig, isRaceActive }) => {
  const fullDayHourOptions = generateNumberOptions(0, 24);
  const minuteOptions = generateNumberOptions(0, 59);
  const pitSpeedOptions = generateNumberOptions(0, 30, false);
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

  const handleWindowListChange = (listName, index, newWindowData) => {
    setConfig(prev => {
      const newList = [...(prev[listName] || [])];
      newList[index] = newWindowData;
      return { ...prev, [listName]: newList };
    });
  };

  const addWindowToList = (listName) => {
    setConfig(prev => ({
      ...prev,
      [listName]: [
        ...(prev[listName] || []),
        { id: Date.now(), start: { Hours: '00', Minutes: '00', total: 0 }, end: { Hours: '00', Minutes: '00', total: 0 } }
      ]
    }));
  };

  const removeWindowFromList = (listName, index) => {
    setConfig(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-4 border rounded-lg bg-card/40 shadow-sm">
      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4" /> Pits
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Wind className="h-3 w-3"/>QuickChange</Label>
          <Select value={config.quickChangeActive || PLACEHOLDER_VALUE} onValueChange={(val) => handleInputChange('quickChangeActive', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-sm py-1.5 mt-1"><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>{yesNoOptions.map(opt => <SelectItem key={`qc-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>Ouverture Pitlane (début course) (HH:MM)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Select value={config.pitOpenTimeHours || '00'} onValueChange={(val) => handleTimeChange('pitOpenTime', 'Hours', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="HH" /></SelectTrigger>
              <SelectContent>{fullDayHourOptions.map(h => <SelectItem key={`poth-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
            <span className="font-semibold text-primary">:</span>
            <Select value={config.pitOpenTimeMinutes || '00'} onValueChange={(val) => handleTimeChange('pitOpenTime', 'Minutes', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="MM" /></SelectTrigger>
              <SelectContent>{minuteOptions.map(m => <SelectItem key={`potm-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-1">Total: {formatDurationToCustomFormat(config.pitOpenTimeTotal || 0, 'HHMM')}</p>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>Fermeture Pitlane (fin course) (HH:MM)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Select value={config.pitCloseTimeHours || '00'} onValueChange={(val) => handleTimeChange('pitCloseTime', 'Hours', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="HH" /></SelectTrigger>
              <SelectContent>{fullDayHourOptions.map(h => <SelectItem key={`pcth-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
            <span className="font-semibold text-primary">:</span>
            <Select value={config.pitCloseTimeMinutes || '00'} onValueChange={(val) => handleTimeChange('pitCloseTime', 'Minutes', val)} disabled={isRaceActive}>
              <SelectTrigger className="w-full text-sm py-1.5"><SelectValue placeholder="MM" /></SelectTrigger>
              <SelectContent>{minuteOptions.map(m => <SelectItem key={`pctm-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-1">Total: {formatDurationToCustomFormat(config.pitCloseTimeTotal || 0, 'HHMM')}</p>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3"/>Vitesse Pits (km/h)</Label>
          <Select value={config.pitLaneSpeed || '0'} onValueChange={(val) => handleInputChange('pitLaneSpeed', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-sm py-1.5 mt-1"><SelectValue placeholder="km/h" /></SelectTrigger>
            <SelectContent>{pitSpeedOptions.map(s => <SelectItem key={`pls-${s}`} value={s}>{s} km/h</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Fuel className="h-4 w-4"/>Fenêtres de Ravitaillement (HH:MM)</Label>
        {(config.refuelWindows || []).map((window, index) => (
            <TimeWindowInput 
                key={window.id || `refuel-${index}`} 
                windowData={window}
                onChange={(data) => handleWindowListChange('refuelWindows', index, data)}
                onRemove={() => removeWindowFromList('refuelWindows', index)}
                isRaceActive={isRaceActive}
                windowTypeLabel={`Fenêtre Ravitaillement ${index + 1}`}
                hourOptions={fullDayHourOptions}
                minuteOptions={minuteOptions}
            />
        ))}
        <Button variant="outline" size="sm" onClick={() => addWindowToList('refuelWindows')} disabled={isRaceActive} className="w-full text-xs py-1.5">
            <PlusCircle className="h-3 w-3 mr-1"/> Ajouter Fenêtre Ravitaillement
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Tool className="h-4 w-4"/>Fenêtres Pit Stop Technique (HH:MM)</Label>
        {(config.technicalPitStopWindows || []).map((window, index) => (
            <TimeWindowInput 
                key={window.id || `tech-${index}`} 
                windowData={window}
                onChange={(data) => handleWindowListChange('technicalPitStopWindows', index, data)}
                onRemove={() => removeWindowFromList('technicalPitStopWindows', index)}
                isRaceActive={isRaceActive}
                windowTypeLabel={`Fenêtre Pit Stop Tech. ${index + 1}`}
                hourOptions={fullDayHourOptions}
                minuteOptions={minuteOptions}
            />
        ))}
        <Button variant="outline" size="sm" onClick={() => addWindowToList('technicalPitStopWindows')} disabled={isRaceActive} className="w-full text-xs py-1.5">
            <PlusCircle className="h-3 w-3 mr-1"/> Ajouter Fenêtre Pit Stop Tech.
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSettingsPits;
