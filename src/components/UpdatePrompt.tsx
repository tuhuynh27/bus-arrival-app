import { DownloadCloud, RefreshCw } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true })

  if (!needRefresh) return null

  const close = () => setNeedRefresh(false)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <DownloadCloud className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Update Available</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">A new version of the app is available.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={close}>Later</Button>
            <Button onClick={() => updateServiceWorker(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
