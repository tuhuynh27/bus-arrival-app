import { toast } from 'sonner'
import { requestPushSubscription, schedulePush } from '../services/push'
import type { BusArrival } from '../types'
import { usePendingNotifications } from './usePendingNotifications'

export function useNotifications() {
  const { addNotification, removeNotification } = usePendingNotifications()

  const notifyBus = async (bus: BusArrival) => {
    const remainingTime = bus.arrivalTimestamp - Date.now()
    const minutes = Math.floor(remainingTime / (1000 * 60))
    if (remainingTime <= 0) {
      toast.info("Bus is arriving now!")
      return
    }

    const subscription = await requestPushSubscription()
    if (!subscription) {
      toast.error('Notifications not enabled')
      return
    }

    const notifyBefore = 2 * 60 * 1000 // 2 minutes
    const delay = Math.max(remainingTime - notifyBefore, 0)
    await schedulePush(
      subscription,
      {
        title: `Bus ${bus.busNo} approaching`,
        body: `Bus ${bus.busNo} will arrive soon`,
      },
      delay,
    )
    const id = `${bus.busNo}-${Date.now()}`
    const targetTime = Date.now() + delay
    addNotification({ id, busNo: bus.busNo, targetTime })
    setTimeout(() => removeNotification(id), delay + 1000)
    toast.success(`Notification set for Bus ${bus.busNo} (${minutes} min)`)
  }

  return { notifyBus }
}
