import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, BarChart2, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';

const DriverStatsCard = ({ drivers, driverTimes, relays, plannedRelayDurations, raceDuration, isExpanded, onToggleExpand }) => {
  if (drivers.length === 0 && !isExpanded) return null;

  const calculateTotalRelayTime = (driverId) => {
    return relays.filter(r => r.driverId === driverId).reduce((sum, r) => sum + r.duration, 0);
  };
  
  const calculatePlannedRelayTimeForDriver = (driverId) => {
     return plannedRelayDurations
      .filter(pr => pr.driverId === driverId)
      .reduce((sum, pr) => sum + pr.duration, 0);
  };

  const calculatePlannedRelaysCountForDriver = (driverId) => {
    return plannedRelayDurations.filter(pr => pr.driverId === driverId).length;
  };
  
  const calculateCompletedRelaysForDriver = (driverId) => {
    return relays.filter(r => r.driverId === driverId).length;
  };

  const calculateRemainingDrivingTime = (driverId) => {
    const totalTimeDriven = calculateTotalRelayTime(driverId);
    const totalPlannedTimeForDriver = calculatePlannedRelayTimeForDriver(driverId);
    // This does not account for current relay progress yet.
    // For a simple approach, it's the remaining planned time for this driver.
    // Consider only future planned relays for this driver
    
    let remainingTime = 0;
    let completedRelaysCountByDriver = {};

    relays.forEach(relay => {
        completedRelaysCountByDriver[relay.driverId] = (completedRelaysCountByDriver[relay.driverId] || 0) + 1;
    });

    plannedRelayDurations.forEach(plannedRelay => {
        if (plannedRelay.driverId === driverId) {
            if (!completedRelaysCountByDriver[driverId] || completedRelaysCountByDriver[driverId] === 0) {
                remainingTime += plannedRelay.duration;
            } else {
                completedRelaysCountByDriver[driverId]--; 
            }
        }
    });
    return remainingTime;
  };

  const overallTotalPlannedTime = plannedRelayDurations.reduce((sum, r) => sum + r.duration, 0);
  const overallTotalActualTime = relays.reduce((sum, r) => sum + r.duration, 0);
  const overallDifference = overallTotalActualTime - overallTotalPlannedTime;

  return (
    <motion.div layout className="w-full">
      <Card className="glassmorphism-card shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
          <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <BarChart2 className="h-4 w-4 md:h-5 md:w-5" /> Synthèse de Course
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
            <CardContent className="p-0 md:p-1">
              {drivers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-xs md:text-sm">Aucun pilote configuré.</p>
              ) : (
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-card/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Pilote</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">T. Prévu</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">T. Réel</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">T. Restant Prévu</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Nb. Relais Effectués</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Nb. Relais Prévus</TableHead>
                      <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Écart / Pilote</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-card divide-y divide-border">
                    {drivers.map((driver) => {
                      const totalTimeDriven = calculateTotalRelayTime(driver.id);
                      const totalPlannedTimeForDriver = calculatePlannedRelayTimeForDriver(driver.id);
                      const remainingDrivingTime = calculateRemainingDrivingTime(driver.id);
                      const relaysCompleted = calculateCompletedRelaysForDriver(driver.id);
                      const relaysPlanned = calculatePlannedRelaysCountForDriver(driver.id);
                      const differenceSeconds = totalTimeDriven - totalPlannedTimeForDriver; 

                      const gapTotalRelayTime = relays
                        .filter(r => r.driverId === driver.id)
                        .reduce((sum, r) => sum + (r.duration - r.plannedDuration), 0);

                      return (
                        <TableRow key={driver.id}>
                          <TableCell className="px-2 py-2 whitespace-nowrap text-xs md:text-sm">
                            <div className="flex items-center gap-1 md:gap-2">
                              <span className={`h-2 w-2 md:h-3 md:w-3 rounded-full ${driver.color}`}></span>
                              {driver.name}
                            </div>
                          </TableCell>
                          <TableCell className="px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm">
                            {formatDurationHHMMSS(totalPlannedTimeForDriver)}
                          </TableCell>
                          <TableCell className="px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm">
                            {formatDurationHHMMSS(totalTimeDriven)}
                          </TableCell>
                           <TableCell className="px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm">
                            {formatDurationHHMMSS(remainingDrivingTime)}
                          </TableCell>
                          <TableCell className="px-2 py-2 whitespace-nowrap text-right text-xs md:text-sm">{relaysCompleted}</TableCell>
                          <TableCell className="px-2 py-2 whitespace-nowrap text-right text-xs md:text-sm">{relaysPlanned}</TableCell>
                          <TableCell className={`px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm font-semibold ${gapTotalRelayTime > 0 ? 'text-red-500' : gapTotalRelayTime < 0 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                            {formatDurationHHMMSS(gapTotalRelayTime, true)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableBody className="border-t-2 border-primary/50 bg-card/60">
                    <TableRow className="font-bold">
                        <TableCell className="px-2 py-2 text-left text-xs md:text-sm">Total Équipe</TableCell>
                        <TableCell className="px-2 py-2 text-right tabular-nums text-xs md:text-sm">{formatDurationHHMMSS(overallTotalPlannedTime)}</TableCell>
                        <TableCell className="px-2 py-2 text-right tabular-nums text-xs md:text-sm">{formatDurationHHMMSS(overallTotalActualTime)}</TableCell>
                        <TableCell className="px-2 py-2 text-right tabular-nums text-xs md:text-sm">
                            {formatDurationHHMMSS(Math.max(0, overallTotalPlannedTime - overallTotalActualTime))}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-right text-xs md:text-sm">{relays.length}</TableCell>
                        <TableCell className="px-2 py-2 text-right text-xs md:text-sm">{plannedRelayDurations.length}</TableCell>
                        <TableCell className={`px-2 py-2 text-right tabular-nums text-xs md:text-sm font-semibold ${overallDifference > 0 ? 'text-red-500' : overallDifference < 0 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                            {formatDurationHHMMSS(overallDifference, true)}
                        </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default DriverStatsCard;