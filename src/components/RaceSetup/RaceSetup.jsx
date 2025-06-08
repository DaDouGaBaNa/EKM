import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Settings, ChevronUp, ChevronDown, PlusCircle, MinusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DriverManagement from '@/components/RaceSetup/DriverManagement';
import AdvancedSettings from '@/components/RaceSetup/AdvancedSettings';
import BasicSettings from '@/components/RaceSetup/BasicSettings';
import { useRaceSetupManager } from '@/components/RaceSetup/hooks/useRaceSetupManager';


const RaceSetup = ({ onSetupComplete, initialConfig, isExpanded, onToggleExpand, isRaceActive }) => {
  const {
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
    calculateTotalRaceDuration,
  } = useRaceSetupManager(initialConfig);


  useEffect(() => {
    loadConfig(initialConfig);
  }, [initialConfig, loadConfig]);


  const handleSetupComplete = () => {
    const totalRaceDurationSeconds = calculateTotalRaceDuration(basicConfig);
    if (drivers.length === 0) {
      alert("Veuillez ajouter au moins un pilote.");
      return;
    }
    if (parseInt(basicConfig.desiredRelays, 10) <= 0) {
      alert("Le nombre de relais souhaités doit être supérieur à zéro.");
      return;
    }
    if (totalRaceDurationSeconds <=0) {
        alert("La durée de la course doit être positive.");
        return;
    }
    
    const configToSave = prepareConfigForSave();
    onSetupComplete(configToSave);
  };

  return (
    <motion.div layout className="w-full">
      <Card className="glassmorphism-card shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-primary/30 flex flex-row justify-between items-center p-4">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
            <Settings className="text-primary h-6 w-6 md:h-7 md:w-7" />
            <span className="gradient-text">Paramètres de course</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onToggleExpand} disabled={isRaceActive && isExpanded}>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
              <BasicSettings 
                config={basicConfig}
                setConfig={setBasicConfig}
                isRaceActive={isRaceActive}
              />

              <DriverManagement 
                drivers={drivers} 
                setDrivers={setDrivers} 
                referenceBallast={basicConfig.referenceBallast === "Pas de lest" ? 0 : parseInt(basicConfig.referenceBallast,10)} 
                desiredRelays={parseInt(basicConfig.desiredRelays, 10)}
                setDesiredRelays={(val) => setBasicConfig(prev => ({...prev, desiredRelays: parseInt(val,10)}))}
                isRaceActive={isRaceActive}
              />

              <Button 
                variant="outline" 
                onClick={() => setShowAdvanced(!showAdvanced)} 
                className="w-full text-sm md:text-md py-2 md:py-2.5"
                disabled={isRaceActive}
              >
                {showAdvanced ? <MinusCircle className="mr-2 h-4 w-4"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                {showAdvanced ? 'Masquer' : 'Afficher'} les Paramètres Avancés
              </Button>

              {showAdvanced && (
                <AdvancedSettings 
                    advancedConfig={advancedConfigData}
                    setAdvancedConfig={setAdvancedConfigData}
                    isRaceActive={isRaceActive}
                />
              )}
            </CardContent>
            <CardFooter className="border-t border-primary/30 p-4 md:pt-4">
              <Button 
                onClick={handleSetupComplete} 
                disabled={isRaceActive || drivers.length === 0 || parseInt(basicConfig.desiredRelays,10) <= 0 || calculateTotalRaceDuration(basicConfig) <=0}
                className="w-full text-sm md:text-md py-2 md:py-3 bg-primary hover:bg-primary/90 transition-opacity duration-300 text-primary-foreground"
              >
                Valider Paramètres
              </Button>
            </CardFooter>
          </motion.div>
        )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default RaceSetup;