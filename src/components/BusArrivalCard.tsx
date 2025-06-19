import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Clock, Bell, CheckCircle } from 'lucide-react';
import type { BusArrival } from '../types';

interface BusArrivalCardProps {
  bus: BusArrival;
  routeName?: string;
  onNotify?: (bus: BusArrival) => void;
}

export function BusArrivalCard({ bus, routeName, onNotify }: BusArrivalCardProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Update current time every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remainingTime = bus.arrivalTimestamp - currentTime;
  const isArrived = remainingTime <= 0;
  const timePassedSinceArrival = Math.abs(remainingTime);
  
  const minutes = Math.floor(Math.abs(remainingTime) / (1000 * 60));
  const seconds = Math.floor((Math.abs(remainingTime) % (1000 * 60)) / 1000);
  
  const getTimeStatus = () => {
    if (isArrived) {
      const sinceSeconds = Math.floor(timePassedSinceArrival / 1000);
      if (sinceSeconds < 120) {
        return `Arrived ${sinceSeconds}s ago`;
      }
      return 'Arrived';
    } else {
      return minutes === 0 ? `${seconds}s` : `${minutes}m ${seconds}s`;
    }
  };

  const getTimeColor = () => {
    if (isArrived) return 'text-green-600 dark:text-green-400';
    if (remainingTime <= 60000) return 'text-red-500 dark:text-red-400'; // Less than 1 minute
    if (remainingTime <= 180000) return 'text-orange-500 dark:text-orange-400'; // Less than 3 minutes
    return 'text-foreground';
  };

  const progressPercent = (() => {
    if (isArrived) return 100;
    if (minutes >= 20) return 0;
    return ((20 - minutes) / 20) * 100;
  })();

  const getProgressColor = () => {
    if (isArrived) return 'bg-green-500 dark:bg-green-400';
    if (remainingTime <= 60000) return 'bg-red-500 dark:bg-red-400';
    if (remainingTime <= 180000) return 'bg-orange-500 dark:bg-orange-400';
    return 'bg-blue-500 dark:bg-blue-400';
  };

  const shouldPulse = !isArrived && remainingTime <= 60000;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      shouldPulse ? 'animate-pulse border-red-200 dark:border-red-800' : ''
    } ${isArrived ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
      <div 
        className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${getProgressColor()}`}
        style={{ width: `${progressPercent}%` }}
      />
      
      <CardContent className="px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Bus Number Circle */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isArrived 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-primary/10'
            }`}>
              <span className={`text-lg font-bold transition-colors duration-300 ${
                isArrived 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-primary'
              }`}>
                {bus.busNo}
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="flex-grow min-w-0">
            {routeName && (
              <div className="text-xs text-muted-foreground mb-1 truncate">
                {routeName}
              </div>
            )}
            <div className="flex items-center gap-2">
              {isArrived ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={`text-base font-semibold transition-colors duration-300 ${getTimeColor()}`}>
                {getTimeStatus()}
              </span>
              {!isArrived && remainingTime <= 180000 && ( // Show seconds for buses arriving in 3 minutes or less
                <div className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                  remainingTime <= 60000 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}>
                  {seconds}s
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          {onNotify && !isArrived && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNotify(bus)}
                className="h-8 w-8 p-0 hover:bg-primary/10 active:bg-primary/20 transition-colors"
              >
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 