import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User } from 'lucide-react'
import { PasscodeModal } from './PasscodeModal'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { StationConfigComponent } from './StationConfig'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchUserSettings, saveUserSettings } from '../services/user'
import { checkUser, register, login } from '../services/auth'
import type { StationConfig, StopData, ServiceData } from '../types'

interface SettingsTabProps {
  stationConfigs: StationConfig[];
  setStationConfigs: (configs: StationConfig[]) => void;
  stopsData: StopData;
  servicesData: ServiceData;
}

export function SettingsTab({
  stationConfigs,
  setStationConfigs,
  stopsData,
  servicesData,
}: SettingsTabProps) {
  const [email, setEmail] = useLocalStorage<string>('userEmail', '')
  const [emailInput, setEmailInput] = useState(email)
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '')
  const [lastSync, setLastSync] = useLocalStorage<number>('lastSync', 0)
  const [pendingEmail, setPendingEmail] = useState('')
  const [modalMode, setModalMode] = useState<'enter' | 'setup' | null>(null)
  const [notifyMinutes, setNotifyMinutes] = useLocalStorage<number>('notifyLeadTime', 2)

  const decodeJwt = (token: string) => {
    const base64 = token
      .split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded)) as { email: string; exp: number }
  }

  const verifyExistingToken = async () => {
    if (!authToken) return
    try {
      const payload = decodeJwt(authToken)
      if (payload.exp * 1000 > Date.now()) {
        setEmail(payload.email)
        setEmailInput(payload.email)
        return
      }
    } catch {
      /* ignore */
    }
    setAuthToken('')
    setEmail('')
    setModalMode(null)
    setPendingEmail('')
  }

  useEffect(() => {
    verifyExistingToken().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completeLogin = async (userEmail: string, token: string) => {
    setEmail(userEmail)
    try {
      const data = await fetchUserSettings(userEmail, token)
      if (data) {
        setStationConfigs(data)
        setLastSync(Date.now())
      }
    } catch {
      toast.error('Failed to load settings')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = emailInput.trim()
    if (!value) return
    setPendingEmail(value)
    try {
      const exists = await checkUser(value)
      setModalMode(exists ? 'enter' : 'setup')
    } catch {
      toast.error('Failed to check user')
    }
  }

  const handleSync = async () => {
    if (!email || !authToken) return
    try {
      await saveUserSettings(email, authToken, stationConfigs)
      setLastSync(Date.now())
      toast.success('Settings synced')
    } catch {
      toast.error('Failed to sync settings')
    }
  }

  return (
    <div className="space-y-3 pb-6">
      <h2 className="text-xl font-bold">Settings</h2>
      {/* Login */}
      <Card>
        <CardHeader className="pb-2 space-y-1">
          <CardTitle className="text-base">Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sync your favourite stations across devices by signing in with your email.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {email ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {email ? email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm break-all">{email}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEmail('')
                    setAuthToken('')
                  }}
                >
                  Log out
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  Last sync:{' '}
                  {lastSync ? format(lastSync, 'PP p') : 'Never'}
                </span>
                <Button size="sm" onClick={handleSync}>
                  Sync now
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 text-base placeholder:text-base"
              />
              <Button type="submit" size="sm">Login</Button>
            </form>
          )}
        </CardContent>
      </Card>
      {/* Notification Settings */}
      <Card>
        <CardHeader className="pb-2 space-y-1">
          <CardTitle className="text-base">Alerts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how many minutes before arrival you're notified.
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
              <Slider
                min={1}
                max={10}
                step={1}
                value={[notifyMinutes]}
                onValueChange={(v) => setNotifyMinutes(v[0])}
                className="flex-1"
              />
            <span className="text-sm text-muted-foreground">
              {notifyMinutes} minute{notifyMinutes > 1 ? 's' : ''} before
            </span>
          </div>
        </CardContent>
      </Card>
      {/* Station Configuration */}
      <StationConfigComponent
        stationConfigs={stationConfigs}
        onUpdateConfigs={setStationConfigs}
        stopsData={stopsData}
        servicesData={servicesData}
      />
      <PasscodeModal
        mode={modalMode || 'enter'}
        open={modalMode !== null && !!pendingEmail}
        onClose={() => {
          setModalMode(null)
          setPendingEmail('')
        }}
        onSubmit={async (pin) => {
          if (!pendingEmail) return
          try {
            const { token } =
              modalMode === 'setup'
                ? await register(pendingEmail, pin)
                : await login(pendingEmail, pin)
            setModalMode(null)
            setAuthToken(token)
            await completeLogin(pendingEmail, token)
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Authentication failed'
            toast.error(message)
          }
        }}
      />
    </div>
  );
}
