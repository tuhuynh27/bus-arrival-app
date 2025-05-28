import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { WifiOff, RefreshCw, Wifi } from 'lucide-react';

interface OfflineModalProps {
  isOffline: boolean;
  isRetrying: boolean;
  retryCount: number;
  lastRetryTime: number | null;
  onRetry: () => Promise<boolean>;
}

export function OfflineModal({ 
  isOffline, 
  isRetrying, 
  retryCount, 
  lastRetryTime, 
  onRetry 
}: OfflineModalProps) {
  const [nextRetryIn, setNextRetryIn] = useState<number>(10);

  useEffect(() => {
    if (!isOffline || !lastRetryTime) {
      setNextRetryIn(10);
      return;
    }

    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - lastRetryTime) / 1000);
      const remaining = Math.max(0, 10 - elapsed);
      setNextRetryIn(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOffline, lastRetryTime]);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto shadow-2xl border-destructive/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold text-destructive">
            You're offline!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your internet connection and try again.
          </p>
          
          {retryCount > 0 && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <p>Retry attempts: {retryCount}</p>
              {nextRetryIn > 0 && (
                <p className="mt-1">
                  Auto-retry in {nextRetryIn}s
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={onRetry} 
              disabled={isRetrying}
              className="w-full"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              The app will automatically retry every 10 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 