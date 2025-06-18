import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { BottomNavigation } from './components/BottomNavigation';
import { About } from './components/About';
import { OfflineModal } from './components/OfflineModal';
import { UpdatePrompt } from './components/UpdatePrompt';
import { InstallPrompt } from './components/InstallPrompt';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOfflineDetection } from './hooks/useOfflineDetection';
import { useNotifications } from './hooks/useNotifications';
import type { StationConfig, TabType, Theme, StopData, ServiceData } from './types';
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
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 16);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stationConfigs, setStationConfigs] = useLocalStorage<StationConfig[]>('stationConfigs', [
    { stationId: '10389', busNumbers: ['121', '122'] },
    { stationId: '10161', busNumbers: ['121', '122'] },
  ]);

  const { notifyBus } = useNotifications();

  // Scroll to top whenever the active tab changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollTo' in window) {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        /* ignore scroll errors in tests */
      }
    }
  }, [activeTab]);

  // Offline detection
  const { isOffline, isRetrying, retryCount, lastRetryTime, manualRetry } = useOfflineDetection();

  // Static data is now available instantly - no async loading needed!
  const stopsDataTyped = stopsData as unknown as StopData;
  const servicesDataTyped = servicesData as unknown as ServiceData;

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

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
            handleNotify={notifyBus}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            stationConfigs={stationConfigs}
            setStationConfigs={setStationConfigs}
            stopsData={stopsDataTyped}
            servicesData={servicesDataTyped}
            fontSize={fontSize}
            setFontSize={setFontSize}
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
          handleNotify={notifyBus}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-safe">
      <InstallPrompt />
      {/* Main Content */}
      <div
        className="mx-auto max-w-[480px] p-3"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
        {renderTabContent()}
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Toast Container */}
      <Toaster
        richColors
        position="top-center"
        offset={{ top: 'calc(env(safe-area-inset-top) + 8px)' }}
        mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 8px)' }}
      />
      {/* Offline Modal */}
      <OfflineModal
        isOffline={isOffline}
        isRetrying={isRetrying}
        retryCount={retryCount}
        lastRetryTime={lastRetryTime}
        onRetry={handleOfflineRetry}
      />
      <UpdatePrompt />
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
