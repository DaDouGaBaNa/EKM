import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListChecks, ChevronUp, ChevronDown, ArrowDownNarrowWide, ArrowUpNarrowWide, Hash, Fuel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';

const RelayLogCard = ({ relays, drivers, isExpanded, onToggleExpand }) => {
  if (relays.length === 0 && !isExpanded) return null; 

  const getDriverColor = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.color : 'bg-gray-500';
  };

  const calculateGap = (actualDuration, plannedDuration) => {
    const diffSeconds = actualDuration - plannedDuration;
    const diffMinutes = Math.floor(diffSeconds / 60); 
    return diffMinutes;
  };

  return (
    <motion.div layout className="w-full">
    <Card className="glassmorphism-card shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
        <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <ListChecks className="h-4 w-4 md:h-5 md:w-5" /> Journal Relais
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
          <CardContent className="p-0 md:p-1 max-h-60 overflow-y-auto">
            {relays.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-xs md:text-sm">Aucun relais enregistré.</p>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-card/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="px-2 py-2 text-center text-xs font-medium text-primary uppercase tracking-wider"><Hash className="inline h-3 w-3" /></TableHead>
                    <TableHead className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Pilote</TableHead>
                    <TableHead className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Début</TableHead>
                    <TableHead className="px-2 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Fin</TableHead>
                    <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Durée Prévue</TableHead>
                    <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Durée Réelle</TableHead>
                    <TableHead className="px-2 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Écart (min)</TableHead>
                    <TableHead className="px-2 py-2 text-center text-xs font-medium text-primary uppercase tracking-wider">Ravit.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-card divide-y divide-border">
                  {relays.slice().reverse().map((relay, index) => {
                    const displayIndex = relays.length - index;
                    const gapMinutes = calculateGap(relay.duration, relay.plannedDuration);
                    let gapColor = 'text-muted-foreground';
                    if (gapMinutes > 0) gapColor = 'text-red-500'; 
                    else if (gapMinutes < 0) gapColor = 'text-blue-500';

                    return (
                      <TableRow key={relay.id || index}>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-center text-xs md:text-sm">{displayIndex}</TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-xs md:text-sm">
                          <div className="flex items-center gap-1 md:gap-2">
                            <span className={`h-2 w-2 md:h-3 md:w-3 rounded-full ${getDriverColor(relay.driverId)}`}></span>
                            {relay.driverName}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-xs md:text-sm">{relay.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-xs md:text-sm">{relay.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm">{formatDurationHHMMSS(relay.plannedDuration)}</TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm">{formatDurationHHMMSS(relay.duration)}</TableCell>
                        <TableCell className={`px-2 py-2 whitespace-nowrap text-right tabular-nums text-xs md:text-sm font-semibold ${gapColor}`}>
                          <div className="flex items-center justify-end gap-1">
                            {gapMinutes > 0 && <ArrowUpNarrowWide className="h-3 w-3" />}
                            {gapMinutes < 0 && <ArrowDownNarrowWide className="h-3 w-3" />}
                            {gapMinutes !== 0 ? `${gapMinutes > 0 ? '+' : ''}${gapMinutes}` : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2 whitespace-nowrap text-center text-xs md:text-sm">
                          {relay.refueled ? <Fuel className="h-4 w-4 text-green-500 mx-auto" /> : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

export default RelayLogCard;