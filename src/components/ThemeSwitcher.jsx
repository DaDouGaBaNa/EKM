import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label={theme === 'dark' ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.4rem] w-[1.4rem] text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-[1.4rem] w-[1.4rem] text-indigo-400 transition-all" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;