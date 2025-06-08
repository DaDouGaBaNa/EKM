import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RaceSetup from '@/components/RaceSetup/RaceSetup';
import RaceDashboard from '@/components/RaceDashboard';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  const [raceConfig, setRaceConfig] = useState(null);
  const [appState, setAppState] = useState('setup'); 
  const { toast } = useToast();
  
  const [isSetupExpanded, setIsSetupExpanded] = useState(true);

  useEffect(() => {
    const savedConfig = localStorage.getItem('kartRaceConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setRaceConfig(parsedConfig);
        setAppState('racing'); 
        setIsSetupExpanded(false); 
      } catch (error) {
        console.error("Failed to parse saved race config:", error);
        localStorage.removeItem('kartRaceConfig');
      }
    }
  }, []);

  const handleSetupComplete = (config) => {
    setRaceConfig(config);
    localStorage.setItem('kartRaceConfig', JSON.stringify(config));
    setAppState('racing');
    setIsSetupExpanded(false); 
    toast({
      title: "Configuration Enregistrée!",
      description: "La course est prête à démarrer.",
    });
  };

  const handleBackToSetup = () => {
    setAppState('setup'); 
    setIsSetupExpanded(true); 
     toast({
      title: "Modification des Paramètres",
      description: "Vous pouvez maintenant ajuster les paramètres.",
    });
  };
  
  const handleResetRace = () => {
    setRaceConfig(null); 
    setAppState('setup');
    setIsSetupExpanded(true); 
    localStorage.removeItem('kartRaceConfig');
     toast({
      title: "Course Réinitialisée",
      description: "Configurez une nouvelle course.",
    });
  };
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <Header />
        <main className="w-full flex-grow p-2 sm:p-4 space-y-3 md:space-y-4 flex flex-col items-center">
          <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
            <RaceSetup 
              onSetupComplete={handleSetupComplete} 
              initialConfig={raceConfig}
              isExpanded={isSetupExpanded}
              onToggleExpand={() => setIsSetupExpanded(!isSetupExpanded)}
              isRaceActive={appState === 'racing' && raceConfig?.raceDuration > 0 && raceConfig?.elapsedTime < raceConfig?.raceDuration}
            />
          </div>

          {appState === 'racing' && raceConfig && (
            <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
              <RaceDashboard 
                raceConfig={raceConfig} 
                onResetRace={handleResetRace}
                onBackToSetup={handleBackToSetup}
              />
            </div>
          )}
        </main>
        <Toaster />
        <footer className="text-center w-full py-4 md:py-6 text-xs text-muted-foreground border-t border-border">
          <p>Endurance Karting Manager By Damien GALVEZ</p>
          <p>&copy; {new Date().getFullYear()} Hostinger Horizons</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;