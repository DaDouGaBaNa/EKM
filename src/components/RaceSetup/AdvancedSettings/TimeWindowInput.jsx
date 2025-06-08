import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { formatDurationToCustomFormat } from '@/utils/timeFormatters';

const TimeWindowInput = ({ windowData, onChange, onRemove, isRaceActive, windowTypeLabel, hourOptions, minuteOptions }) => {
  const handleTimeChange = (part, value, field) => {
    const newTime = { ...windowData, [field]: { ...windowData[field], [part]: value } };
    newTime[field].total = (parseInt(newTime[field].Hours || '0', 10) * 3600) + (parseInt(newTime[field].Minutes || '0', 10) * 60);
    onChange(newTime);
  };

  return (
    <div className="flex flex-col gap-2 p-3 border rounded-md bg-background/30">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{windowTypeLabel}</Label>
        <Button variant="ghost" size="icon" onClick={onRemove} disabled={isRaceActive} className="h-6 w-6">
          <XCircle className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs">Entre</span>
        <Select value={windowData.start.Hours || '00'} onValueChange={(val) => handleTimeChange('Hours', val, 'start')} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-xs py-1"><SelectValue placeholder="HH" /></SelectTrigger>
          <SelectContent>{hourOptions.map(h => <SelectItem key={`swh-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
        </Select>
        <span className="font-semibold text-primary">:</span>
        <Select value={windowData.start.Minutes || '00'} onValueChange={(val) => handleTimeChange('Minutes', val, 'start')} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-xs py-1"><SelectValue placeholder="MM" /></SelectTrigger>
          <SelectContent>{minuteOptions.map(m => <SelectItem key={`swm-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs">et</span>
        <Select value={windowData.end.Hours || '00'} onValueChange={(val) => handleTimeChange('Hours', val, 'end')} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-xs py-1"><SelectValue placeholder="HH" /></SelectTrigger>
          <SelectContent>{hourOptions.map(h => <SelectItem key={`ewh-${h}`} value={h}>{h}</SelectItem>)}</SelectContent>
        </Select>
        <span className="font-semibold text-primary">:</span>
        <Select value={windowData.end.Minutes || '00'} onValueChange={(val) => handleTimeChange('Minutes', val, 'end')} disabled={isRaceActive}>
          <SelectTrigger className="w-full text-xs py-1"><SelectValue placeholder="MM" /></SelectTrigger>
          <SelectContent>{minuteOptions.map(m => <SelectItem key={`ewm-${m}`} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-xs">de course</span>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-1">
        Début: {formatDurationToCustomFormat(windowData.start.total || 0, 'HHMM')}, Fin: {formatDurationToCustomFormat(windowData.end.total || 0, 'HHMM')}
      </p>
    </div>
  );
};

export default TimeWindowInput;