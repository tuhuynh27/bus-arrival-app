import { useState, useEffect, useCallback } from 'react';
import { timeoutSignal } from '../lib/utils';

export interface OfflineState {
  isOffline: boolean;
  isRetrying: boolean;
  retryCount: number;
  lastRetryTime: number | null;
}

export function useOfflineDetection() {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOffline: !navigator.onLine,
    isRetrying: false,
    retryCount: 0,
    lastRetryTime: null,
  });

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify actual connectivity
      const response = await fetch('https://arrivelah2.busrouter.sg/?id=10389', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: timeoutSignal(5000), // 5 second timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const manualRetry = useCallback(async () => {
    setOfflineState(prev => ({
      ...prev,
      isRetrying: true,
    }));

    const isConnected = await checkConnection();
    
    setOfflineState(prev => ({
      ...prev,
      isOffline: !isConnected,
      isRetrying: false,
      retryCount: isConnected ? 0 : prev.retryCount + 1,
      lastRetryTime: Date.now(),
    }));

    return isConnected;
  }, [checkConnection]);

  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOffline: false,
        retryCount: 0,
        lastRetryTime: null,
      }));
    };

    const handleOffline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOffline: true,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry mechanism every 10 seconds when offline
  useEffect(() => {
    if (!offlineState.isOffline || offlineState.isRetrying) {
      return;
    }

    const autoRetryInterval = setInterval(async () => {
      const isConnected = await checkConnection();
      
      setOfflineState(prev => ({
        ...prev,
        isOffline: !isConnected,
        retryCount: isConnected ? 0 : prev.retryCount + 1,
        lastRetryTime: Date.now(),
      }));
    }, 10000); // 10 seconds

    return () => clearInterval(autoRetryInterval);
  }, [offlineState.isOffline, offlineState.isRetrying, checkConnection]);

  return {
    ...offlineState,
    manualRetry,
  };
} 