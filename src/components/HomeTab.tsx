import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BusArrivalCard } from './BusArrivalCard';
import { RefreshCw, Sun, Moon, MapPin } from 'lucide-react';
import { WeatherForecast } from './WeatherForecast';
import type { StationConfig, Theme, StopData, ServiceData, BusArrival, TabType } from '../types';
import busIcon from '@/assets/bus.png';
import { fetchBusArrivals } from '../services/api';

interface HomeTabProps {
  theme: Theme;
  toggleTheme: () => void;
  isRefreshing: boolean;
  refreshAllData: () => void;
  stationConfigs: StationConfig[];
  setActiveTab: (tab: TabType) => void;
  servicesData: ServiceData;
  stopsData: StopData;
  handleNotify: (bus: BusArrival) => void;
  showRouteName: boolean;
  showStationInfo: boolean;
}

export function StationCard({
  config,
  servicesData,
  stopsData,
  onNotify,
  maxItems = Infinity,
  showRouteName,
  showStationInfo,
}: {
  config: StationConfig;
  servicesData: ServiceData;
  stopsData: StopData;
  onNotify: (bus: BusArrival) => void;
  maxItems?: number;
  showRouteName: boolean;
  showStationInfo: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: arrivals = [], isLoading, error } = useQuery<BusArrival[]>({
    queryKey: ['busArrivals', config.stationId, config.busNumbers],
    queryFn: () => fetchBusArrivals(config.stationId, config.busNumbers),
    enabled: config.busNumbers.length > 0,
    refetchInterval: 30000, // 30 seconds
  });

  const getStationDisplayName = (stationId: string) => {
    const stop = stopsData[stationId];
    if (stop) {
      return `${stop[2]} (${stop[3]})`;
    }
    return stationId;
  };

  // Determine which buses to show
  const maxVisible = 3;
  const visibleArrivals = isExpanded
    ? arrivals.slice(0, maxItems)
    : arrivals.slice(0, maxVisible);
  const hasMore = arrivals.length > maxVisible;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">
              {getStationDisplayName(config.stationId)}
            </CardTitle>
          </div>
          {showStationInfo && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {arrivals.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {arrivals.length}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {config.stationId}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-sm text-destructive">
              Failed to load bus arrivals
            </p>
          </div>
        ) : arrivals.length > 0 ? (
          <div className="space-y-2">
            {visibleArrivals.map((bus, busIndex) => (
              <BusArrivalCard
                key={`${bus.busNo}-${busIndex}`}
                bus={bus}
                routeName={showRouteName ? servicesData[bus.busNo]?.name : undefined}
                onNotify={onNotify}
              />
            ))}
            {/* Expand/Collapse Button */}
            {(isExpanded || hasMore) && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full h-8 text-sm text-muted-foreground hover:text-foreground transition-colors border-dashed border border-border/50 hover:border-border"
                >
                  {isExpanded ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Show Less
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show {Math.min(arrivals.length, maxItems) - maxVisible} More
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No buses found for this stop
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HomeTab({
  theme,
  toggleTheme,
  isRefreshing,
  refreshAllData,
  stationConfigs,
  setActiveTab,
  servicesData,
  stopsData,
  handleNotify,
  showRouteName,
  showStationInfo,
}: HomeTabProps) {
  return (
    <div className="space-y-3 pb-6">
      {/* Header - Elegant and Modern */}
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center gap-3">
          {/* Bus Logo */}
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <img
              src={busIcon}
              alt="Bus Logo"
              className="w-full h-full object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          {/* App Title */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              SG Bus
            </h1>
            <p className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent -mt-1">
              Live Arrivals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={toggleTheme} className="aspect-square w-12 h-12 rounded-xl flex items-center justify-center">
            {theme === 'light' ? (
              <Moon className="w-5 h-5 aspect-square" />
            ) : (
              <Sun className="w-5 h-5 aspect-square" />
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshAllData} disabled={isRefreshing} className="aspect-square w-12 h-12 rounded-xl flex items-center justify-center">
            <RefreshCw className={`w-5 h-5 aspect-square ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <WeatherForecast />
      {/* Bus Stations - Reduced spacing */}
      {stationConfigs.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-base font-semibold mb-2">No stations configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your favorite bus stations to get started
            </p>
            <Button onClick={() => setActiveTab('settings')} size="sm">
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {stationConfigs.map((config) => (
            <StationCard
              key={config.stationId}
              config={config}
              servicesData={servicesData}
              stopsData={stopsData}
              onNotify={handleNotify}
              showRouteName={showRouteName}
              showStationInfo={showStationInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
} 