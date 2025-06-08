import React, { useState, useEffect } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center text-sm sm:text-base font-medium text-muted-foreground">
      <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

const Header = () => {
  return (
    <header className="w-full bg-card shadow-md sticky top-0 z-50 border-b border-primary/50">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold gradient-text">
              Endurance Karting Manager
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <DigitalClock />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;