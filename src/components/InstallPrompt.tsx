import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import busIcon from '@/assets/bus.png'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

function isiOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissedAt, setDismissedAt] = useLocalStorage<number | null>('installPromptDismissed', null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  useEffect(() => {
    if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return
    interface Nav extends Navigator { standalone?: boolean }
    const nav = navigator as Nav
    const notStandalone = !window.matchMedia('(display-mode: standalone)').matches && !nav.standalone
    if (notStandalone && (promptEvent || isiOS())) setShow(true)
  }, [promptEvent, dismissedAt])

  const dismiss = () => {
    setShow(false)
    setDismissedAt(Date.now())
  }

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt()
    }
    dismiss()
  }

  if (!show) return null

  return (
    <div className="bg-background border-b border-border/50 shadow-sm">
      <div className="max-w-[480px] mx-auto flex items-center gap-3 p-3">
        <img
          src={busIcon}
          alt="App icon"
          className="w-8 h-8 rounded-md flex-shrink-0"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="flex-1 text-sm">
          {promptEvent ? (
            <p>
              Install <span className="font-medium">SG Bus Arrival</span> for quick access
            </p>
          ) : (
            <p>
              Tap Share and choose <span className="font-medium">Add to Home Screen</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {promptEvent && (
            <Button size="sm" onClick={install} className="px-3">
              Install
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={dismiss} className="px-3">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
