import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import AdvancedSettingsDriver from '@/components/RaceSetup/AdvancedSettings/AdvancedSettingsDriver';
import AdvancedSettingsQualif from '@/components/RaceSetup/AdvancedSettings/AdvancedSettingsQualif';
import AdvancedSettingsPits from '@/components/RaceSetup/AdvancedSettings/AdvancedSettingsPits';
import AdvancedSettingsBallastFuel from '@/components/RaceSetup/AdvancedSettings/AdvancedSettingsBallastFuel';
import SettingsImportExport from './SettingsImportExport';

const AdvancedSettings = ({ advancedConfig, setAdvancedConfig, isRaceActive }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-4 pt-4 border-t border-border/50">
        <h3 className="text-md md:text-lg font-semibold text-primary mb-3 md:mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" /> Paramètres Avancés
        </h3>
        
        <div className="space-y-6">
          <AdvancedSettingsDriver 
            config={advancedConfig} 
            setConfig={setAdvancedConfig} 
            isRaceActive={isRaceActive} 
          />
          <AdvancedSettingsQualif
            config={advancedConfig}
            setConfig={setAdvancedConfig}
            isRaceActive={isRaceActive}
          />
          <AdvancedSettingsPits
            config={advancedConfig}
            setConfig={setAdvancedConfig}
            isRaceActive={isRaceActive}
          />
          <AdvancedSettingsBallastFuel
            config={advancedConfig}
            setConfig={setAdvancedConfig}
            isRaceActive={isRaceActive}
          />
        </div>
        <SettingsImportExport config={advancedConfig} setConfig={setAdvancedConfig} label="Paramètres Avancés" />
      </div>
    </motion.div>
  );
};

export default AdvancedSettings;