export const getDefaultAdvancedConfig = () => ({
  qualifDurationHours: '00', qualifDurationMinutes: '00', qualifDurationTotal: 0,
  refuelAfterQualif: '',
  quickChangeActive: '',
  minRelayDurationHours: '00', minRelayDurationMinutes: '00', minRelayDurationTotal: 0,
  maxRelayDurationHours: '00', maxRelayDurationMinutes: '00', maxRelayDurationTotal: 0,
  pitOpenTimeHours: '00', pitOpenTimeMinutes: '00', pitOpenTimeTotal: 0,
  pitCloseTimeHours: '00', pitCloseTimeMinutes: '00', pitCloseTimeTotal: 0,
  emptyKartWeight: '',
  fullTankWeight: '',
  minTotalWeight: '',
  weighingExitPit: '',
  pitLaneSpeed: '0',
  maxTotalTimePerDriverHours: '00', maxTotalTimePerDriverMinutes: '00', maxTotalTimePerDriverTotal: 0,
  minTotalTimePerDriverHours: '00', minTotalTimePerDriverMinutes: '00', minTotalTimePerDriverTotal: 0,
  minRestTimeBetweenRelaysHours: '00', minRestTimeBetweenRelaysMinutes: '00', minRestTimeBetweenRelaysTotal: 0,
  refuelWindows: [],
  technicalPitStopWindows: [],
});

export const getDefaultBasicConfig = () => ({
  raceHours: '01',
  raceMinutes: '00',
  referenceBallast: "80",
  desiredRelays: 1,
  fuelAutonomyHours: '01',
  fuelAutonomyMinutes: '00',
  minPitStopTimeMinutes: '00',
  minPitStopTimeSeconds: '30',
});

export const calculateTotalRaceDuration = (basicConfig) => (parseInt(basicConfig.raceHours || '0', 10) * 3600) + (parseInt(basicConfig.raceMinutes || '0', 10) * 60);
export const calculateFuelAutonomy = (basicConfig) => (parseInt(basicConfig.fuelAutonomyHours || '0', 10) * 3600) + (parseInt(basicConfig.fuelAutonomyMinutes || '0', 10) * 60);
export const calculateMinPitStopTime = (basicConfig) => (parseInt(basicConfig.minPitStopTimeMinutes || '0', 10) * 60) + (parseInt(basicConfig.minPitStopTimeSeconds || '0', 10));