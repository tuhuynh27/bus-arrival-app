export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
}

export async function requestPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null
  const registration = await navigator.serviceWorker.ready
  const existing = await registration.pushManager.getSubscription()
  if (existing) return existing
  const key = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!key) return null
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key)
  })
}

export async function schedulePush(
  subscription: PushSubscription,
  payload: Record<string, unknown>,
  delayMs: number
) {
  await fetch('/.netlify/functions/schedule-notification-background', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, payload, delay: delayMs })
  })
}
