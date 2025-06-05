import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Bell, X } from 'lucide-react'
import { usePendingNotifications } from '../hooks/usePendingNotifications'

export function NotificationsTab() {
  const { notifications, removeNotification, clearNotifications } = usePendingNotifications()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const formatRemaining = (ms: number) => {
    if (ms <= 0) return 'Arriving'
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m > 0 ? `${m}m ` : ''}${s}s`
  }

  return (
    <div className="space-y-3 pb-6">
      <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-3 text-center">
            <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-base font-semibold tracking-tight mb-2">Bus Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Tap the bell icon on any bus card to get notified before it arrives
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <Card key={n.id}>
              <CardContent className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="font-semibold">Bus {n.busNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatRemaining(n.targetTime - now)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(n.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardFooter className="justify-end">
              <Button variant="destructive" size="sm" onClick={clearNotifications}>
                Clear All
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
