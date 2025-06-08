import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Edit3, Check, X, Trash2, ChevronUp, ChevronDown, AlertTriangle, Clock, PlayCircle, CheckCircle2, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDurationHHMMSS, formatDurationMMSS } from '@/utils/timeFormatters';
import { calculateBallast } from './utils/dashboardUtils';

const RelayOrderTable = ({
  relayPlan,
  drivers,
  referenceBallast,
  currentRelayIndex,
  isRunning,
  editingRelay,
  editDriverId,
  setEditDriverId,
  editDuration,
  setEditDuration,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onMoveRelay,
  onDeleteRelay,
  getRelayStatus,
  fuelAutonomy,
  onToggleRefuelStop,
}) => {

  const getStatusIcon = (status) => {
    if (status === 'Terminé') return <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-green-500" />;
    if (status === 'En cours') return <PlayCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 animate-pulse" />;
    return <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />;
  };

  let cumulativeDuration = 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-card/50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">#</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Pilote</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Lest</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Durée Prév.</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Cumul Théor.</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-center text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Fuel</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-1 py-1.5 md:px-2 md:py-2 text-left text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {relayPlan.map((relay, index) => {
            const driver = drivers.find(d => d.id === relay.driverId);
            const ballast = driver ? calculateBallast(driver.weight, referenceBallast) : 0;
            const status = getRelayStatus(index, currentRelayIndex, isRunning);
            const canEditRelay = status !== 'Terminé';
            const canMoveUp = index > 0 && status !== 'Terminé' && status !== 'En cours' && getRelayStatus(index - 1, currentRelayIndex, isRunning) !== 'Terminé' && getRelayStatus(index - 1, currentRelayIndex, isRunning) !== 'En cours';
            const canMoveDown = index < relayPlan.length - 1 && status !== 'Terminé' && status !== 'En cours' && getRelayStatus(index + 1, currentRelayIndex, isRunning) !== 'Terminé' && getRelayStatus(index + 1, currentRelayIndex, isRunning) !== 'En cours';
            const canDeleteRelay = status !== 'Terminé' && status !== 'En cours' && !(relayPlan.length <= 1 && index === 0);
            const canToggleFuel = status !== 'Terminé';

            if (index > 0 && relayPlan[index - 1].isRefuelStop) {
                cumulativeDuration = 0;
            }
            cumulativeDuration += relay.duration;
            const exceedsAutonomy = fuelAutonomy > 0 && cumulativeDuration > fuelAutonomy;


            if (editingRelay && editingRelay.planIndex === index) {
              return (
                <motion.tr
                  layout
                  key={`${relay.id}-edit` || `${index}-edit`}
                  className="bg-background/80"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">{index + 1}</td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                    <Select value={editDriverId} onValueChange={setEditDriverId}>
                      <SelectTrigger className="text-[10px] md:text-sm h-7 md:h-8"><SelectValue placeholder="Pilote" /></SelectTrigger>
                      <SelectContent>
                        {drivers.map(d => <SelectItem key={d.id} value={d.id} className="text-[10px] md:text-sm">{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">N/A</td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                    <Input
                      type="text" value={editDuration} onChange={(e) => setEditDuration(e.target.value)}
                      placeholder="MM:SS" className="text-[10px] md:text-sm h-7 md:h-8"
                    />
                  </td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">-</td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">-</td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">Édition</td>
                  <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                    <div className="flex items-center space-x-0.5 md:space-x-1">
                      <Button size="icon" variant="ghost" onClick={onCancelEdit} className="h-6 w-6 md:h-7 md:w-7"><X className="h-3 w-3 md:h-4 md:w-4"/></Button>
                      <Button size="icon" onClick={onSaveEdit} className="bg-primary h-6 w-6 md:h-7 md:w-7"><Check className="h-3 w-3 md:h-4 md:w-4"/></Button>
                    </div>
                  </td>
                </motion.tr>
              );
            }

            return (
              <motion.tr
                layout
                key={relay.id || index}
                className={`${status === 'En cours' ? 'ring-1 ring-primary bg-primary/10' : status === 'Terminé' ? 'opacity-60 bg-background/50' : 'bg-card'}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">{index + 1}</td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className={`h-2 w-2 md:h-3 md:w-3 rounded-full flex-shrink-0 ${relay.driverColor}`}></span>
                    {relay.driverName}
                  </div>
                </td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <AlertTriangle className="h-2.5 w-2.5 md:h-4 md:w-4 text-accent" /> {ballast} kg
                  </div>
                </td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm tabular-nums">
                  {status !== 'Terminé' ? formatDurationHHMMSS(relay.duration) : '-'}
                </td>
                <td className={`px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm tabular-nums ${exceedsAutonomy ? 'text-red-500 font-semibold' : 'text-foreground'}`}>
                  {formatDurationHHMMSS(cumulativeDuration)}
                </td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-center">
                  <Switch 
                    checked={relay.isRefuelStop} 
                    onCheckedChange={() => onToggleRefuelStop(index)}
                    disabled={!canToggleFuel}
                    className="h-4 w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30 [&>span]:h-3 [&>span]:w-3"
                  />
                </td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {getStatusIcon(status)} {status}
                  </div>
                </td>
                <td className="px-1 py-1.5 md:px-2 md:py-2 whitespace-nowrap text-[10px] md:text-sm">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => onMoveRelay(index, -1)} disabled={!canMoveUp} className="h-5 w-5 md:h-6 md:w-6"><ChevronUp className="h-2.5 w-2.5 md:h-3 md:w-3" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onMoveRelay(index, 1)} disabled={!canMoveDown} className="h-5 w-5 md:h-6 md:w-6"><ChevronDown className="h-2.5 w-2.5 md:h-3 md:w-3" /></Button>
                    {canEditRelay && <Button variant="ghost" size="icon" onClick={() => onEdit(relay, index)} className="h-5 w-5 md:h-6 md:w-6"><Edit3 className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-400" /></Button>}
                    {canDeleteRelay && <Button variant="ghost" size="icon" onClick={() => onDeleteRelay(index)} className="h-5 w-5 md:h-6 md:w-6"><Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3 text-destructive" /></Button>}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RelayOrderTable;