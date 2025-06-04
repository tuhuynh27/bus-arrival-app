import { useLocalStorage } from './useLocalStorage'

export interface PendingNotification {
  id: string
  busNo: string
  targetTime: number
}

export function usePendingNotifications() {
  const [notifications, setNotifications] = useLocalStorage<PendingNotification[]>('pendingNotifications', [])

  const addNotification = (notification: PendingNotification) => {
    setNotifications([...notifications, notification])
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return { notifications, addNotification, removeNotification, clearNotifications }
}
