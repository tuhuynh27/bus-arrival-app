import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Add to Home Screen</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {promptEvent ? (
            <p className="text-sm text-muted-foreground">Install this app for quick access.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Tap Share and choose "Add to Home Screen".</p>
          )}
          <div className="flex gap-3 justify-center">
            {promptEvent && <Button onClick={install}>Install</Button>}
            <Button variant="outline" onClick={dismiss}>Dismiss</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
