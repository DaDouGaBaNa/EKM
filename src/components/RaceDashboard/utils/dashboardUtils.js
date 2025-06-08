import React from 'react';
import { formatDurationHHMMSS } from '@/utils/timeFormatters';

export const calculateBallast = (driverWeight, referenceBallast) => {
  if (driverWeight === null || driverWeight === undefined || isNaN(parseFloat(driverWeight))) return 0;
  const ballast = referenceBallast - parseFloat(driverWeight);
  if (ballast <= 0) return 0;
  return Math.ceil(ballast / 2.5) * 2.5; // Arrondi au 2.5kg supérieur
};


export const calculateDriverPerformance = (driver, plannedRelayDurations, relayHistory) => {
  const driverRelays = relayHistory.filter(r => r.driverId === driver.id);
  const totalActualTime = driverRelays.reduce((sum, r) => sum + r.duration, 0);
  
  const driverPlannedRelays = plannedRelayDurations.filter(p => p.driverId === driver.id);
  const totalPlannedTime = driverPlannedRelays.reduce((sum, p) => sum + p.duration, 0);

  // Estimate remaining planned time for this driver
  const completedPlannedRelayIndices = driverRelays.map(hr => {
    // Find the original index in plannedRelayDurations for this completed relay.
    // This assumes relayHistory items might not directly map one-to-one if plan changes
    // but for simplicity, we can use originalIndex if available or just count.
    // A more robust approach might involve unique IDs for planned relays.
    const plannedRelay = plannedRelayDurations.find(pr => 
        pr.driverId === hr.driverId && 
        Math.abs(pr.duration - hr.plannedDuration) < 1 && // approximately same planned duration
        !relayHistory.find(rh => rh !== hr && rh.plannedRelayId === pr.id) // pseudo-check if this planned relay was already 'used'
    );
    return plannedRelay ? plannedRelay.originalIndex : -1; // or some other logic
  });


  let remainingPlannedTimeForDriver = 0;
  driverPlannedRelays.forEach((plannedRelay, idx) => {
    // Check if this specific instance of a planned relay for the driver is completed
    // This needs a more robust way to link historical relays to planned ones if order/duration can change significantly
    // For now, let's assume order is somewhat preserved or we count completed vs total planned for driver
    const isRelayCompleted = relayHistory.some(hr => 
        hr.driverId === plannedRelay.driverId && 
        // This matching is tricky if plan can be heavily modified.
        // Using originalIndex from plan if it's stable
        plannedRelayDurations[hr.originalRelayIndexInPlan]?.id === plannedRelay.id
    );

    if (plannedRelayDurations.findIndex(p => p.id === plannedRelay.id) >= relayHistory.length) { // Crude check if this planned relay is "future"
         remainingPlannedTimeForDriver += plannedRelay.duration;
    }
  });
  
  // Simplified: sum of all planned durations for this driver that are not yet in history
  // This isn't perfect if a driver has multiple future relays and some past ones.
  const numDriverRelaysInHistory = driverRelays.length;
  const numDriverRelaysInPlan = driverPlannedRelays.length;
  
  if (numDriverRelaysInPlan > numDriverRelaysInHistory) {
    for (let i = numDriverRelaysInHistory; i < numDriverRelaysInPlan; i++) {
        // This assumes the Nth relay in history corresponds to Nth planned relay for that driver
        // This is a weak assumption if drivers swap positions. A better way would be to use unique IDs for planned relays.
        // Or, iterate through plannedRelayDurations and check if it's "after" the currentRelayIndex
        // and belongs to this driver.
        // For now, simplified:
        // Let's find the *next* planned relay for this driver
        let futureRelayCount = 0;
        for(let i=0; i<plannedRelayDurations.length; i++){
            if(plannedRelayDurations[i].driverId === driver.id){
                // check if this planned relay (at index i) is already in history by matching originalIndex
                const inHistory = relayHistory.some(hr => hr.originalRelayIndexInPlan === i);
                if(!inHistory){
                    remainingPlannedTimeForDriver += plannedRelayDurations[i].duration;
                }
            }
        }
    }
  }


  const difference = totalActualTime - totalPlannedTime; // This is overall difference so far

  // This is a simplified view, for more dynamic advice, current relay state is needed.
  return {
    driverName: driver.name,
    totalPlannedTime: formatDurationHHMMSS(totalPlannedTime),
    totalActualTime: formatDurationHHMMSS(totalActualTime),
    remainingPlannedTime: formatDurationHHMMSS(remainingPlannedTimeForDriver), // This estimation needs refinement
    difference: formatDurationHHMMSS(difference, true),
    differenceSeconds: difference,
    relaysDone: driverRelays.length,
    driverColor: driver.color,
  };
};