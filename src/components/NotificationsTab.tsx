import { Card, CardContent } from './ui/card';
import { Bell } from 'lucide-react';

export function NotificationsTab() {
  return (
    <div className="space-y-3 pb-6">
      <h2 className="text-xl font-bold">Notifications</h2>
      <Card>
        <CardContent className="p-3 text-center">
          <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-base font-semibold mb-2">Bus Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Tap the bell icon on any bus card to get notified before it arrives
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 