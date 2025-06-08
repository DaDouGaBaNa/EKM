import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, UserPlus, Users, Palette, Weight, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const availableColors = [
  { name: 'Rouge', value: 'bg-red-500', text: 'text-red-500' },
  { name: 'Bleu', value: 'bg-blue-500', text: 'text-blue-500' },
  { name: 'Vert', value: 'bg-green-500', text: 'text-green-500' },
  { name: 'Jaune', value: 'bg-yellow-500', text: 'text-yellow-500' },
  { name: 'Violet', value: 'bg-purple-500', text: 'text-purple-500' },
  { name: 'Orange', value: 'bg-orange-500', text: 'text-orange-500' },
  { name: 'Rose', value: 'bg-pink-500', text: 'text-pink-500' },
  { name: 'Cyan', value: 'bg-cyan-500', text: 'text-cyan-500' },
  { name: 'Lime', value: 'bg-lime-500', text: 'text-lime-500' },
  { name: 'Indigo', value: 'bg-indigo-500', text: 'text-indigo-500' },
];

const calculateRequiredBallast = (driverWeight, referenceBallast) => {
  if (driverWeight === null || driverWeight === undefined || driverWeight === '') return 0;
  const weight = parseFloat(driverWeight);
  if (isNaN(weight) || weight >= referenceBallast) return 0;
  const diff = referenceBallast - weight;
  return Math.ceil(diff / 2.5) * 2.5;
};

const DriverManagement = ({ drivers, setDrivers, referenceBallast, desiredRelays, setDesiredRelays, isRaceActive }) => {
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverWeight, setNewDriverWeight] = useState('');
  const [newDriverColor, setNewDriverColor] = useState(availableColors[0].value);

  const addDriver = () => {
    if (!newDriverName.trim()) {
      alert('Le nom du pilote ne peut pas être vide.');
      return;
    }
    const driverWeightValue = newDriverWeight.trim() === '' ? null : parseFloat(newDriverWeight);
    if (newDriverWeight.trim() !== '' && (isNaN(driverWeightValue) || driverWeightValue <= 0)) {
        alert('Le poids du pilote doit être un nombre positif, ou laissé vide.');
        return;
    }

    setDrivers([
      ...drivers,
      { id: Date.now().toString(), name: newDriverName.trim(), weight: driverWeightValue, color: newDriverColor },
    ]);
    setNewDriverName('');
    setNewDriverWeight('');
    setNewDriverColor(availableColors[(drivers.length + 1) % availableColors.length]?.value || availableColors[0].value);
    
    if (drivers.length + 1 > desiredRelays) {
        setDesiredRelays(drivers.length + 1);
    }
  };

  const updateDriver = (id, field, value) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      )
    );
  };
  
  const updateDriverWeight = (id, value) => {
    const weightValue = value.trim() === '' ? null : parseFloat(value);
     if (value.trim() !== '' && (isNaN(weightValue) || weightValue <= 0)) {
        alert('Le poids du pilote doit être un nombre positif, ou laissé vide.');
        updateDriver(id, 'weight', drivers.find(d=>d.id === id).weight); 
        return;
    }
    updateDriver(id, 'weight', weightValue);
  };


  const removeDriver = (id) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
     if (drivers.length - 1 < desiredRelays && drivers.length -1 > 0) {
        setDesiredRelays(drivers.length - 1);
    } else if (drivers.length - 1 === 0) {
        setDesiredRelays(1);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <Label className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
          <Users className="h-4 w-4"/> Équipage
        </Label>
        <AnimatePresence>
          {drivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="mt-2 p-3 md:p-4 border rounded-lg shadow-sm bg-card/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm md:text-md flex items-center">
                  <span className={cn("w-3 h-3 rounded-full mr-2", driver.color)}></span>
                  {driver.name}
                </span>
                <Button variant="ghost" size="icon" onClick={() => removeDriver(driver.id)} className="text-destructive hover:text-destructive/80 h-7 w-7 md:h-8 md:w-8" disabled={isRaceActive}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`driver-name-${driver.id}`} className="text-xs text-muted-foreground">Nom</Label>
                  <Input
                    id={`driver-name-${driver.id}`}
                    type="text"
                    value={driver.name}
                    onChange={(e) => updateDriver(driver.id, 'name', e.target.value)}
                    placeholder="Nom du Pilote"
                    className="mt-1 text-sm py-1.5"
                    disabled={isRaceActive}
                  />
                </div>
                <div>
                  <Label htmlFor={`driver-weight-${driver.id}`} className="text-xs text-muted-foreground flex items-center gap-1"><Weight className="h-3 w-3"/> Poids (kg)</Label>
                  <Input
                    id={`driver-weight-${driver.id}`}
                    type="number"
                    value={driver.weight === null ? '' : driver.weight}
                    onChange={(e) => updateDriverWeight(driver.id, e.target.value)}
                    placeholder="Poids (ex: 75)"
                    className="mt-1 text-sm py-1.5"
                    disabled={isRaceActive}
                  />
                </div>
                <div>
                  <Label htmlFor={`driver-color-${driver.id}`} className="text-xs text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3"/> Couleur</Label>
                  <Select
                    value={driver.color}
                    onValueChange={(value) => updateDriver(driver.id, 'color', value)}
                    disabled={isRaceActive}
                  >
                    <SelectTrigger id={`driver-color-${driver.id}`} className="mt-1 text-sm py-1.5">
                      <SelectValue placeholder="Couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <span className={cn("w-3 h-3 rounded-full mr-2", color.value)}></span>
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Lest à embarquer: <span className="font-semibold">{calculateRequiredBallast(driver.weight, referenceBallast)} kg</span></p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isRaceActive && (
        <>
          <div className="p-3 md:p-4 border rounded-lg shadow-sm bg-card/30 space-y-3">
            <h3 className="text-sm md:text-md font-semibold text-primary flex items-center gap-1">
              <UserPlus className="h-4 w-4"/> Confirmer un Pilote
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="new-driver-name" className="text-xs text-muted-foreground">Nom</Label>
                <Input
                  id="new-driver-name"
                  type="text"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="Nom du Pilote"
                  className="mt-1 text-sm py-1.5"
                />
              </div>
              <div>
                <Label htmlFor="new-driver-weight" className="text-xs text-muted-foreground flex items-center gap-1"><Weight className="h-3 w-3"/> Poids (kg)</Label>
                <Input
                  id="new-driver-weight"
                  type="number"
                  value={newDriverWeight}
                  onChange={(e) => setNewDriverWeight(e.target.value)}
                  placeholder="Optionnel (ex: 75)"
                  className="mt-1 text-sm py-1.5"
                />
              </div>
              <div>
                <Label htmlFor="new-driver-color" className="text-xs text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3"/> Couleur</Label>
                <Select value={newDriverColor} onValueChange={setNewDriverColor}>
                  <SelectTrigger id="new-driver-color" className="mt-1 text-sm py-1.5">
                    <SelectValue placeholder="Couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColors.map((color) => (
                      <SelectItem key={`new-${color.value}`} value={color.value}>
                        <div className="flex items-center">
                          <span className={cn("w-3 h-3 rounded-full mr-2", color.value)}></span>
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addDriver} className="w-full sm:w-auto text-xs md:text-sm py-1.5 md:py-2">
              <UserPlus className="mr-2 h-4 w-4" /> Confirmer Pilote
            </Button>
          </div>
          {/* --- Boutons Import/Export Pilotes en dehors de la box --- */}
          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              onClick={() => {
                const dataStr = JSON.stringify(drivers, null, 2);
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                if (isIOS) {
                  window.open(url, '_blank');
                } else {
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "pilotes_ekm.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-white shadow-lg backdrop-blur border border-primary/30 transition-all duration-150"
            >
              <Download className="w-4 h-4" />
              Exporter pilotes
            </Button>
            <input
              type="file"
              accept="application/json"
              id="import-drivers"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = evt => {
                  try {
                    const imported = JSON.parse(evt.target.result);
                    if (Array.isArray(imported)) {
                      setDrivers(imported);
                    } else {
                      alert("Fichier de pilotes invalide !");
                    }
                  } catch {
                    alert("Fichier de pilotes invalide !");
                  }
                };
                reader.readAsText(file);
              }}
            />
            <Button
              type="button"
              onClick={() => document.getElementById('import-drivers').click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/80 hover:bg-secondary text-primary shadow-lg backdrop-blur border border-secondary/30 transition-all duration-150"
            >
              <Upload className="w-4 h-4" />
              Importer pilotes
            </Button>
          </div>
          {/* --- Fin Import/Export --- */}
        </>
      )}
    </div>
  );
};

export default DriverManagement;