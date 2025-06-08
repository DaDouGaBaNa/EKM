import { useState, useCallback } from 'react';
import { getDefaultAdvancedConfig, getDefaultBasicConfig, calculateTotalRaceDuration, calculateFuelAutonomy, calculateMinPitStopTime } from '@/components/RaceSetup/configUtils';

export const useRaceSetupManager = (initialConfig) => {
  const [basicConfig, setBasicConfig] = useState(getDefaultBasicConfig());
  const [drivers, setDrivers] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedConfigData, setAdvancedConfigData] = useState(getDefaultAdvancedConfig());

  const loadConfig = useCallback((configToLoad) => {
    if (configToLoad) {
      setBasicConfig({
        raceHours: configToLoad.raceHours || String(Math.floor((configToLoad.raceDuration || 3600) / 3600)).padStart(2, '0'),
        raceMinutes: configToLoad.raceMinutes || String(Math.floor(((configToLoad.raceDuration || 3600) % 3600) / 60)).padStart(2, '0'),
        referenceBallast: configToLoad.referenceBallast === 0 ? "Pas de lest" : String(configToLoad.referenceBallast || "80"),
        desiredRelays: configToLoad.desiredRelays || (configToLoad.drivers?.length > 0 ? configToLoad.drivers.length : 1),
        fuelAutonomyHours: configToLoad.fuelAutonomyHours || '01',
        fuelAutonomyMinutes: configToLoad.fuelAutonomyMinutes || '00',
        minPitStopTimeMinutes: configToLoad.minPitStopTimeMinutes || '00',
        minPitStopTimeSeconds: configToLoad.minPitStopTimeSeconds || '30',
      });
      setDrivers(configToLoad.drivers || []);
      
      const defaultAdvanced = getDefaultAdvancedConfig();
      const loadedAdvanced = configToLoad.advancedSettings 
        ? { ...defaultAdvanced, ...configToLoad.advancedSettings } 
        : defaultAdvanced;
      
      const migratedAdvanced = { ...loadedAdvanced };
      if (migratedAdvanced.weighingEntryPit !== undefined) {
        migratedAdvanced.weighingExitPit = migratedAdvanced.weighingEntryPit;
        delete migratedAdvanced.weighingEntryPit;
      }

      setAdvancedConfigData(migratedAdvanced);
      setShowAdvanced(!!configToLoad.advancedSettings);

    } else {
      setBasicConfig(getDefaultBasicConfig());
      setDrivers([]);
      setAdvancedConfigData(getDefaultAdvancedConfig());
      setShowAdvanced(false);
    }
  }, []);

  const prepareConfigForSave = () => {
    const totalRaceDurationSeconds = calculateTotalRaceDuration(basicConfig);
    const ballastValue = basicConfig.referenceBallast === "Pas de lest" ? 0 : parseInt(basicConfig.referenceBallast, 10);
    
    const configToSave = { 
      raceDuration: totalRaceDurationSeconds, 
      raceHours: basicConfig.raceHours,
      raceMinutes: basicConfig.raceMinutes,
      referenceBallast: ballastValue, 
      desiredRelays: parseInt(basicConfig.desiredRelays, 10), 
      drivers,
      fuelAutonomy: calculateFuelAutonomy(basicConfig),
      fuelAutonomyHours: basicConfig.fuelAutonomyHours,
      fuelAutonomyMinutes: basicConfig.fuelAutonomyMinutes,
      minPitStopTime: calculateMinPitStopTime(basicConfig),
      minPitStopTimeMinutes: basicConfig.minPitStopTimeMinutes,
      minPitStopTimeSeconds: basicConfig.minPitStopTimeSeconds,
    };

    if (showAdvanced) {
      configToSave.advancedSettings = advancedConfigData;
    }
    return configToSave;
  };

  return {
    basicConfig,
    setBasicConfig,
    drivers,
    setDrivers,
    showAdvanced,
    setShowAdvanced,
    advancedConfigData,
    setAdvancedConfigData,
    loadConfig,
    prepareConfigForSave,
    calculateTotalRaceDuration, // Expose if needed by component for disabling button
  };
};