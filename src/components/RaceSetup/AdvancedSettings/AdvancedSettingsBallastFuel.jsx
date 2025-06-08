import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Weight, Scale, Fuel, Target } from 'lucide-react';
import { PLACEHOLDER_VALUE } from '@/components/RaceSetup/AdvancedSettings/utils';


const AdvancedSettingsBallastFuel = ({ config, setConfig, isRaceActive }) => {
  const yesNoOptions = [{value: PLACEHOLDER_VALUE, label: "Choisir..."}, { value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }];

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value === PLACEHOLDER_VALUE ? '' : value }));
  };

  const handleNumericInputChange = (field, value) => {
    const numValue = value === '' ? null : parseFloat(value);
    if (value === '' || (!isNaN(numValue) && numValue >=0)) {
        setConfig(prev => ({ ...prev, [field]: value === '' ? '' : numValue }));
    } else if (isNaN(numValue) && value !== '') {
        setConfig(prev => ({ ...prev, [field]: prev[field] || '' }));
    }
  };

  const calculateTargetReferenceWeight = () => {
    const { minTotalWeight, emptyKartWeight, fullTankWeight } = config;
    if (
      minTotalWeight === null || minTotalWeight === undefined || minTotalWeight === '' ||
      emptyKartWeight === null || emptyKartWeight === undefined || emptyKartWeight === '' ||
      fullTankWeight === null || fullTankWeight === undefined || fullTankWeight === ''
    ) {
      return "-";
    }
    const targetWeight = parseFloat(minTotalWeight) - (parseFloat(emptyKartWeight) + parseFloat(fullTankWeight));
    return isNaN(targetWeight) ? "-" : `${targetWeight.toFixed(1)} kg`;
  };

  const targetReferenceWeightDisplay = calculateTargetReferenceWeight();

  return (
    <div className="p-4 border rounded-lg bg-card/40 shadow-sm">
      <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
        <Weight className="h-4 w-4" /> Lest & Essence
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="emptyKartWeight" className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Scale className="h-3 w-3"/>Poids Kart Vide (kg)</Label>
          <Input 
            id="emptyKartWeight" type="number" placeholder="Ex: 150" 
            value={config.emptyKartWeight === null || config.emptyKartWeight === undefined ? '' : config.emptyKartWeight}
            onChange={(e) => handleNumericInputChange('emptyKartWeight', e.target.value)}
            className="mt-1 text-sm py-1.5" disabled={isRaceActive} 
          />
        </div>

        <div>
          <Label htmlFor="fullTankWeight" className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3"/>Poids Réservoir Plein (kg)</Label>
          <Input 
            id="fullTankWeight" type="number" placeholder="Ex: 6" 
            value={config.fullTankWeight === null || config.fullTankWeight === undefined ? '' : config.fullTankWeight}
            onChange={(e) => handleNumericInputChange('fullTankWeight', e.target.value)}
            className="mt-1 text-sm py-1.5" disabled={isRaceActive}
          />
        </div>

        <div>
          <Label htmlFor="minTotalWeight" className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Scale className="h-3 w-3"/>Poids Total Min. Kart (kg)</Label>
          <Input 
            id="minTotalWeight" type="number" placeholder="Ex: 230" 
            value={config.minTotalWeight === null || config.minTotalWeight === undefined ? '' : config.minTotalWeight}
            onChange={(e) => handleNumericInputChange('minTotalWeight', e.target.value)}
            className="mt-1 text-sm py-1.5" disabled={isRaceActive}
          />
        </div>
        
        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3"/>Poids de Référence Cible</Label>
          <p className="mt-1 text-sm py-1.5 h-[30px] flex items-center px-3 border rounded-md bg-muted/30">
            {targetReferenceWeightDisplay}
          </p>
        </div>


        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Scale className="h-3 w-3"/>Pesée Sorties Pits</Label>
          <Select value={config.weighingExitPit || PLACEHOLDER_VALUE} onValueChange={(val) => handleInputChange('weighingExitPit', val)} disabled={isRaceActive}>
            <SelectTrigger className="w-full text-sm py-1.5 mt-1"><SelectValue placeholder="Choisir..." /></SelectTrigger>
            <SelectContent>{yesNoOptions.map(opt => <SelectItem key={`wep-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsBallastFuel;