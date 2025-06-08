import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Repeat, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RelayOrderTable from '@/components/RaceDashboard/RelayOrderTable';
// Removed unused imports: useState, useEffect, useCallback, formatDurationMMSS, parseDurationMMSS

const RelayOrderCard = ({ 
  drivers, 
  referenceBallast,
  currentRelayIndex, 
  isRunning,
  isExpanded,
  onToggleExpand,
  fuelAutonomy,
  // Props from useRelayOrderManagement hook, passed down from RaceDashboard
  relayPlan,
  editingRelay,
  editDriverId,
  setEditDriverId,
  editDuration,
  setEditDuration,
  onEditRelay,
  onSaveRelayEdit,
  onCancelRelayEdit,
  onMoveRelay,
  onDeleteRelay,
  onAddRelay,
  onToggleRefuelStop,
  getRelayStatus,
  distributeRelayTimeEqually, // Keep if still used directly here, e.g. for a manual re-distribute button
  onRelayOrderUpdate, // This is the callback to update the master plan if changes are made directly here
}) => {

  const handleRedistribute = () => {
    const newPlan = distributeRelayTimeEqually(relayPlan);
    onRelayOrderUpdate(newPlan); // Ensure this updates the master plan
  };

  return (
    <motion.div layout className="w-full">
    <Card className="glassmorphism-card shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">
        <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <Repeat className="h-4 w-4 md:h-5 md:w-5" /> Ordre & Durées Relais
        </CardTitle>
        <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onAddRelay(relayPlan.length)} className="text-xs p-1 md:text-sm md:p-2" disabled={isRunning}>
            <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1"/> Ajouter Relais
        </Button>
         {/* Optional: Button to manually redistribute times if desired */}
        {/* <Button variant="outline" size="sm" onClick={handleRedistribute} className="text-xs p-1 md:text-sm md:p-2" disabled={isRunning}>
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1"/> Redistribuer
        </Button> */}
        <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-7 w-7 md:h-8 md:w-8">
          {isExpanded ? <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> : <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />}
        </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="p-0 md:p-1 max-h-72 md:max-h-96 overflow-y-auto">
            {relayPlan.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-xs md:text-sm">Configurez la course et les pilotes d'abord.</p>
            ) : (
              <RelayOrderTable
                relayPlan={relayPlan}
                drivers={drivers}
                referenceBallast={referenceBallast}
                currentRelayIndex={currentRelayIndex}
                isRunning={isRunning}
                editingRelay={editingRelay}
                editDriverId={editDriverId}
                setEditDriverId={setEditDriverId}
                editDuration={editDuration}
                setEditDuration={setEditDuration}
                onEdit={onEditRelay}
                onSaveEdit={onSaveRelayEdit}
                onCancelEdit={onCancelRelayEdit}
                onMoveRelay={onMoveRelay}
                onDeleteRelay={onDeleteRelay}
                getRelayStatus={getRelayStatus}
                fuelAutonomy={fuelAutonomy}
                onToggleRefuelStop={onToggleRefuelStop}
              />
            )}
          </CardContent>
        </motion.div>
      )}
      </AnimatePresence>
    </Card>
    </motion.div>
  );
};

export default RelayOrderCard;