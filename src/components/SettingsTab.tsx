import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { StationConfigComponent } from './StationConfig';
import type { StationConfig, Theme, StopData, ServiceData } from '../types';

interface SettingsTabProps {
  theme: Theme;
  toggleTheme: () => void;
  stationConfigs: StationConfig[];
  setStationConfigs: (configs: StationConfig[]) => void;
  stopsData: StopData;
  servicesData: ServiceData;
}

export function SettingsTab({
  theme,
  toggleTheme,
  stationConfigs,
  setStationConfigs,
  stopsData,
  servicesData,
}: SettingsTabProps) {
  return (
    <div className="space-y-3 pb-6">
      <h2 className="text-xl font-bold">Settings</h2>
      {/* Theme Toggle */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Sun className="mr-2 w-4 h-4" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button onClick={toggleTheme} variant="outline" className="w-full">
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Switch to Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Switch to Light Mode
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {/* Station Configuration */}
      <StationConfigComponent
        stationConfigs={stationConfigs}
        onUpdateConfigs={setStationConfigs}
        stopsData={stopsData}
        servicesData={servicesData}
      />
    </div>
  );
}
