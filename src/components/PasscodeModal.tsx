import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { InputOTP } from './ui/input-otp'

interface PasscodeModalProps {
  mode: 'setup' | 'enter'
  open: boolean
  onSubmit: (pin: string) => void
  onClose: () => void
}

export function PasscodeModal({ mode, open, onSubmit, onClose }: PasscodeModalProps) {
  const [step, setStep] = useState(0)
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setStep(0)
      setPin('')
      setConfirm('')
      setError('')
    }
  }, [open])

  useEffect(() => {
    setError('')
  }, [pin, confirm])

  const handlePrimary = () => {
    if (mode === 'setup') {
      if (step === 0) {
        if (pin.length === 4) {
          setStep(1)
        }
      } else if (confirm.length === 4) {
        if (confirm === pin) {
          onSubmit(pin)
        } else {
          setError('Passcodes do not match')
          toast.error('Passcodes do not match')
          setConfirm('')
        }
      }
    } else {
      if (pin.length === 4) {
        onSubmit(pin)
      }
    }
  }

  useEffect(() => {
    if (!open) return
    if (mode === 'setup') {
      if (step === 0 && pin.length === 4) {
        handlePrimary()
      } else if (step === 1 && confirm.length === 4) {
        handlePrimary()
      }
    } else if (pin.length === 4) {
      handlePrimary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, confirm, step, mode, open])

  const title = mode === 'setup' ? (step === 0 ? 'Set Passcode' : 'Confirm Passcode') : 'Enter Passcode'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-sm mx-auto shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {mode === 'setup' && step === 1 ? (
            <InputOTP value={confirm} onChange={setConfirm} autoFocus length={4} className="mx-auto" />
          ) : (
            <InputOTP value={pin} onChange={setPin} autoFocus length={4} className="mx-auto" />
          )}
          {error && <p className="text-red-600 text-center text-sm">{error}</p>}
          <div className="flex justify-center gap-2">
            <Button className="w-20" variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="w-20" onClick={handlePrimary}>OK</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
