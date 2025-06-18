import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Slider } from './ui/slider'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User, Rocket, Circle, Moon, Sun } from 'lucide-react'
import { PasscodeModal } from './PasscodeModal'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { StationConfigComponent } from './StationConfig'
import { SettingRow } from './SettingRow'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchUserSettings, saveUserSettings } from '../services/user'
import { checkUser, register, login } from '../services/auth'
import type { StationConfig, StopData, ServiceData, Theme } from '../types'

const fontSizeOptions = [14, 16, 18, 20]
const fontSizeLabels = ['Very Compact', 'Compact', 'Default', 'Large']

interface SettingsTabProps {
  stationConfigs: StationConfig[];
  setStationConfigs: (configs: StationConfig[]) => void;
  stopsData: StopData;
  servicesData: ServiceData;
  fontSize: number;
  setFontSize: (size: number) => void;
  uiMode: 'advance' | 'basic';
  setUiMode: (mode: 'advance' | 'basic') => void;
  theme: Theme;
  toggleTheme: () => void;
}

export function SettingsTab({
  stationConfigs,
  setStationConfigs,
  stopsData,
  servicesData,
  fontSize,
  setFontSize,
  uiMode,
  setUiMode,
  theme,
  toggleTheme,
}: SettingsTabProps) {
  const [email, setEmail] = useLocalStorage<string>('userEmail', '')
  const [emailInput, setEmailInput] = useState(email)
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '')
  const [lastSync, setLastSync] = useLocalStorage<number>('lastSync', 0)
  const [pendingEmail, setPendingEmail] = useState('')
  const [modalMode, setModalMode] = useState<'enter' | 'setup' | null>(null)
  const [notifyMinutes, setNotifyMinutes] = useLocalStorage<number>('notifyLeadTime', 2)

  const fontSizeIndex = Math.max(0, fontSizeOptions.indexOf(fontSize))

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
      <Card className="divide-y">
        <SettingRow
          label="Mode"
          description="Choose between advance and basic interfaces."
        >
          <Tabs
            value={uiMode}
            onValueChange={(v) => setUiMode(v as 'advance' | 'basic')}
            className="w-32"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="advance" className="flex items-center gap-1 py-1">
                <Rocket className="w-4 h-4" />
                <span>Advance</span>
              </TabsTrigger>
              <TabsTrigger value="basic" className="flex items-center gap-1 py-1">
                <Circle className="w-4 h-4" />
                <span>Basic</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SettingRow>
        <SettingRow
          label="Theme"
          description="Switch between light and dark mode."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </>
            )}
          </Button>
        </SettingRow>
        {uiMode === 'advance' && (
          <div className="px-4 py-3 space-y-2">
            <div className="text-sm font-medium leading-none">Account</div>
            <div className="text-xs text-muted-foreground">
              Sync your favourite stations across devices by signing in with your email.
            </div>
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
                    Last sync: {lastSync ? format(lastSync, 'PP p') : 'Never'}
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
          </div>
        )}
        <SettingRow
          label="Alerts"
          description="Choose how many minutes before arrival you're notified."
        >
          <div className="flex items-center gap-2">
            <Slider
              min={1}
              max={10}
              step={1}
              value={[notifyMinutes]}
              onValueChange={(v) => setNotifyMinutes(v[0])}
              className="w-32 sm:w-40"
            />
            <span className="text-sm text-muted-foreground">
              {notifyMinutes} minute{notifyMinutes > 1 ? 's' : ''} before
            </span>
          </div>
        </SettingRow>
        <SettingRow
          label="Text Size"
          description="Adjust how large or small text appears."
        >
          <div className="flex items-center gap-2">
            <Slider
              min={0}
              max={3}
              step={1}
              value={[fontSizeIndex]}
              onValueChange={(v) => setFontSize(fontSizeOptions[v[0]])}
              className="w-32 sm:w-40"
            />
            <span className="text-sm text-muted-foreground">
              {fontSizeLabels[fontSizeIndex]}
            </span>
          </div>
        </SettingRow>
      </Card>
      {/* Station Configuration */}
      {uiMode === 'advance' && (
        <StationConfigComponent
          stationConfigs={stationConfigs}
          onUpdateConfigs={setStationConfigs}
          stopsData={stopsData}
          servicesData={servicesData}
          showAddStation
          showStationCards
        />
      )}
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
