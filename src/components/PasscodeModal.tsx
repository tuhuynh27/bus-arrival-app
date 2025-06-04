import { useState } from 'react'
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

  if (!open) return null

  const handlePrimary = () => {
    if (mode === 'setup') {
      if (step === 0) {
        if (pin.length === 4) {
          setStep(1)
        }
      } else if (confirm.length === 4 && confirm === pin) {
        onSubmit(pin)
      }
    } else {
      if (pin.length === 4) {
        onSubmit(pin)
      }
    }
  }

  const title = mode === 'setup' ? (step === 0 ? 'Set Passcode' : 'Confirm Passcode') : 'Enter Passcode'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {mode === 'setup' && step === 1 ? (
            <InputOTP value={confirm} onChange={setConfirm} autoFocus length={4} className="mx-auto" />
          ) : (
            <InputOTP value={pin} onChange={setPin} autoFocus length={4} className="mx-auto" />
          )}
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={handlePrimary}>OK</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
