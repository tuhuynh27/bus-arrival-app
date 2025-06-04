import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface PendingNotification {
  id: string
  busNo: string
  targetTime: number
}

export function usePendingNotifications() {
  const [notifications, setNotifications] = useLocalStorage<PendingNotification[]>('pendingNotifications', [])

  // Remove any expired notifications every second
  useEffect(() => {
    const id = setInterval(() => {
      setNotifications(prev => prev.filter(n => n.targetTime > Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [setNotifications])

  const addNotification = (notification: PendingNotification) => {
    setNotifications(prev => [...prev, notification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return { notifications, addNotification, removeNotification, clearNotifications }
}
