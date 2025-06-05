import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface InputOTPProps {
  length?: number
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  className?: string
}

export function InputOTP({ length = 4, value, onChange, autoFocus = false, className }: InputOTPProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const values = Array.from({ length }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        refs.current[0]?.focus()
        refs.current[0]?.select()
      }, 0)
    }
  }, [autoFocus])

  const focusIndex = (idx: number) => {
    refs.current[idx]?.focus()
    refs.current[idx]?.select()
  }

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const newValue = values.map((d, i) => (i === idx ? v : d)).join('')
    onChange(newValue)
    if (v && idx < length - 1) {
      focusIndex(idx + 1)
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      e.preventDefault()
      focusIndex(idx - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (text) {
      onChange(text)
      const nextIndex = Math.min(text.length, length - 1)
      setTimeout(() => focusIndex(nextIndex), 0)
      e.preventDefault()
    }
  }

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {values.map((digit, idx) => (
        <input
          key={idx}
          ref={el => {
            refs.current[idx] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoFocus={autoFocus && idx === 0}
          value={digit}
          onChange={e => handleChange(idx, e)}
          onKeyDown={e => handleKeyDown(idx, e)}
          onPaste={idx === 0 ? handlePaste : undefined}
          className="w-10 h-10 text-center text-lg rounded-md border bg-transparent focus-visible:ring-ring/50 focus-visible:ring-2"
        />
      ))}
    </div>
  )
}

export default InputOTP
