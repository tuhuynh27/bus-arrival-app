import { useEffect, useState } from 'react'

interface SwState {
  needRefresh: boolean
  updateServiceWorker: () => void
  setNeedRefresh: (v: boolean) => void
}

export function useServiceWorker(): SwState {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let mounted = true
    const controllerChange = () => window.location.reload()
    navigator.serviceWorker.addEventListener('controllerchange', controllerChange)

    navigator.serviceWorker.getRegistration().then(async (reg) => {
      try {
        if (!reg) {
          reg = await navigator.serviceWorker.register('/sw.js')
        }
      } catch {
        return
      }
      if (!mounted || !reg) return

      setRegistration(reg)
      if (reg.waiting) setNeedRefresh(true)

      reg.addEventListener('updatefound', () => {
        const newWorker = reg!.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setNeedRefresh(true)
          }
        })
      })
    })

    return () => {
      mounted = false
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChange)
    }
  }, [])

  const updateServiceWorker = () => {
    registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
  }

  return { needRefresh, updateServiceWorker, setNeedRefresh }
}
