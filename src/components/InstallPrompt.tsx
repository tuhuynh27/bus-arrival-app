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

export function InstallPrompt({
  onVisibleChange,
}: { onVisibleChange?: (visible: boolean) => void }) {
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

  useEffect(() => {
    onVisibleChange?.(show)
  }, [show, onVisibleChange])

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

  if (promptEvent) {
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
            <p>
              Install <span className="font-medium">SG Bus Arrival</span> for quick access
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={install} className="px-3">
              Install
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss} className="px-3">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center">
      <div className="max-w-[480px] w-[calc(100%-1.5rem)] bg-background border border-border rounded-lg shadow-lg flex items-center gap-3 p-3">
        <img
          src={busIcon}
          alt="App icon"
          className="w-8 h-8 rounded-md flex-shrink-0"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <p className="flex-1 text-sm">
          Tap the <span className="font-medium">Share</span> button below and select
          <span className="font-medium"> Add to Home Screen</span> to install
          <span className="font-medium"> SG Bus Arrival</span>.
        </p>
        <Button size="sm" variant="ghost" onClick={dismiss} className="px-3">
          Dismiss
        </Button>
      </div>
    </div>
  )
}
