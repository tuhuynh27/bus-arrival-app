import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { PasscodeModal } from './PasscodeModal'
import { jwtVerify, SignJWT } from 'jose'
import { Sun, Moon } from 'lucide-react'
import { toast } from 'sonner'
import { StationConfigComponent } from './StationConfig'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { fetchUserSettings, saveUserSettings } from '../services/user'
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
  const [users, setUsers] = useLocalStorage<Record<string, string>>('users', {})
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '')
  const [pendingEmail, setPendingEmail] = useState('')
  const [modalMode, setModalMode] = useState<'enter' | 'setup' | null>(null)

  const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET)

  const generateToken = async (userEmail: string) => {
    return new SignJWT({ email: userEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)
  }

  const verifyExistingToken = async () => {
    if (!authToken) return
    try {
      const { payload } = await jwtVerify(authToken, secret)
      const userEmail = payload.email as string
      setEmail(userEmail)
      setEmailInput(userEmail)
    } catch {
      setAuthToken('')
      setEmail('')
    }
  }

  useEffect(() => {
    verifyExistingToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completeLogin = async (userEmail: string) => {
    setEmail(userEmail)
    const token = await generateToken(userEmail)
    setAuthToken(token)
    try {
      const data = await fetchUserSettings(userEmail)
      if (data) {
        setStationConfigs(data)
      }
      toast.success('Settings synced')
    } catch {
      toast.error('Failed to load settings')
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const value = emailInput.trim()
    if (!value) return
    setPendingEmail(value)
    if (users[value]) {
      setModalMode('enter')
    } else {
      setModalMode('setup')
    }
  }

  useEffect(() => {
    if (email) {
      saveUserSettings(email, stationConfigs).catch(() => {
        toast.error('Failed to sync settings')
      })
    }
  }, [stationConfigs, email])

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
        open={modalMode !== null}
        onClose={() => {
          setModalMode(null)
          setPendingEmail('')
        }}
        onSubmit={async (pin) => {
          if (modalMode === 'setup') {
            setUsers({ ...users, [pendingEmail]: pin })
          } else if (users[pendingEmail] !== pin) {
            toast.error('Incorrect passcode')
            return
          }
          setModalMode(null)
          await completeLogin(pendingEmail)
        }}
      />
    </div>
  );
}
