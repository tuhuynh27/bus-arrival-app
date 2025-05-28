import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { BottomNavigation } from './components/BottomNavigation';
import { About } from './components/About';
import { OfflineModal } from './components/OfflineModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOfflineDetection } from './hooks/useOfflineDetection';
import type { StationConfig, TabType, Theme, StopData, ServiceData, BusArrival } from './types';
import './App.css';
import { HomeTab } from './components/HomeTab';
import { SettingsTab } from './components/SettingsTab';
import { NotificationsTab } from './components/NotificationsTab';
// Import static data directly for instant loading
import stopsData from './assets/data/stops.json';
import servicesData from './assets/data/services.json';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount) => {
        // Don't retry if we're offline
        if (!navigator.onLine) return false;
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stationConfigs, setStationConfigs] = useLocalStorage<StationConfig[]>('stationConfigs', [
    { stationId: '10389', busNumbers: ['121', '122'] },
    { stationId: '10161', busNumbers: ['121', '122'] },
  ]);

  // Offline detection
  const { isOffline, isRetrying, retryCount, lastRetryTime, manualRetry } = useOfflineDetection();

  // Static data is now available instantly - no async loading needed!
  const stopsDataTyped = stopsData as unknown as StopData;
  const servicesDataTyped = servicesData as unknown as ServiceData;

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Show toast when going offline/online
  useEffect(() => {
    if (isOffline) {
      toast.error('You\'re offline! Some features may not work.');
    } else if (retryCount > 0) {
      toast.success('Connection restored!');
    }
  }, [isOffline, retryCount]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNotify = (bus: BusArrival) => {
    const remainingTime = bus.arrivalTimestamp - Date.now();
    const minutes = Math.floor(remainingTime / (1000 * 60));
    if (remainingTime <= 0) {
      toast.info('Bus is arriving now!');
    } else if (remainingTime <= 60000) {
      toast.info('Bus is arriving in less than 60 seconds!');
    } else {
      toast.success(`Notification set for Bus ${bus.busNo} (${minutes} min)`);
      // In a real app, you would set up a notification here
    }
  };

  const refreshAllData = async () => {
    if (isOffline) {
      toast.error('Cannot refresh while offline');
      return;
    }

    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['busArrivals'] }),
      ]);
      toast.success('Data refreshed');
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOfflineRetry = async () => {
    const isConnected = await manualRetry();
    if (isConnected) {
      // Invalidate queries to refresh data when back online
      queryClient.invalidateQueries({ queryKey: ['busArrivals'] });
    }
    return isConnected;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            theme={theme}
            toggleTheme={toggleTheme}
            isRefreshing={isRefreshing}
            refreshAllData={refreshAllData}
            stationConfigs={stationConfigs}
            setActiveTab={setActiveTab}
            servicesData={servicesDataTyped}
            stopsData={stopsDataTyped}
            handleNotify={handleNotify}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            theme={theme}
            toggleTheme={toggleTheme}
            stationConfigs={stationConfigs}
            setStationConfigs={setStationConfigs}
            stopsData={stopsDataTyped}
            servicesData={servicesDataTyped}
          />
        );
      case 'notifications':
        return <NotificationsTab />;
      case 'info':
        return <About />;
      default:
        return <HomeTab
          theme={theme}
          toggleTheme={toggleTheme}
          isRefreshing={isRefreshing}
          refreshAllData={refreshAllData}
          stationConfigs={stationConfigs}
          setActiveTab={setActiveTab}
          servicesData={servicesDataTyped}
          stopsData={stopsDataTyped}
          handleNotify={handleNotify}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="mx-auto max-w-[480px] p-3 pb-20">
        {renderTabContent()}
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Toast Container */}
      <Toaster richColors position="top-center" />
      {/* Offline Modal */}
      <OfflineModal
        isOffline={isOffline}
        isRetrying={isRetrying}
        retryCount={retryCount}
        lastRetryTime={lastRetryTime}
        onRetry={handleOfflineRetry}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
