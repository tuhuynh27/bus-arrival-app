import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PasscodeModal } from './PasscodeModal'
import { Sun, Moon } from 'lucide-react'
import { toast } from 'sonner'
import { StationConfigComponent } from './StationConfig'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchUserSettings, saveUserSettings } from '../services/user'
import { checkUser, register, login } from '../services/auth'
import type { StationConfig, Theme, StopData, ServiceData } from '../types'

interface SettingsTabProps {
  theme: Theme;
  toggleTheme: () => void;
  stationConfigs: StationConfig[];
  setStationConfigs: (configs: StationConfig[]) => void;
  stopsData: StopData;
  servicesData: ServiceData;
}

export function SettingsTab({
  theme,
  toggleTheme,
  stationConfigs,
  setStationConfigs,
  stopsData,
  servicesData,
}: SettingsTabProps) {
  const [email, setEmail] = useLocalStorage<string>('userEmail', '')
  const [emailInput, setEmailInput] = useState(email)
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '')
  const [pendingEmail, setPendingEmail] = useState('')
  const [modalMode, setModalMode] = useState<'enter' | 'setup' | null>(null)

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
        await completeLogin(payload.email, authToken)
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
      }
      toast.success('Settings synced')
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

  useEffect(() => {
    if (email && authToken) {
      saveUserSettings(email, authToken, stationConfigs).catch(() => {
        toast.error('Failed to sync settings')
      })
    }
  }, [stationConfigs, email, authToken])

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
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm break-all">{email}</span>
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
      {/* Theme Toggle */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Sun className="mr-2 w-4 h-4" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button onClick={toggleTheme} variant="outline" className="w-full">
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Switch to Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Switch to Light Mode
              </>
            )}
          </Button>
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
