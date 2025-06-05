/// <reference lib="webworker" />
/// <reference types="vite-plugin-pwa/client" />
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

// self.__WB_MANIFEST is injected by workbox at build time
import type { ManifestEntry } from 'workbox-build'
declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: ManifestEntry[] }

self.addEventListener('message', (event) => {
  const msg = event.data as { type?: string } | undefined
  if (msg?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Bus Alert'
  const options: NotificationOptions = {
    body: data.body || 'Your bus is arriving soon.',
    icon: '/bus.png',
    badge: '/bus.png'
  }
  event.waitUntil(self.registration.showNotification(title, options))
})
