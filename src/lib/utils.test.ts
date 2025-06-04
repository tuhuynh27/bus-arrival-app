import { describe, it, expect, vi } from 'vitest'
import { cn, timeoutSignal } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('a', { b: true, c: false }, 'd')
    expect(result).toBe('a b d')
  })
})

describe('timeoutSignal', () => {
  it('aborts after timeout', async () => {
    const signal = timeoutSignal(10)
    expect(signal.aborted).toBe(false)
    await new Promise(r => setTimeout(r, 15))
    expect(signal.aborted).toBe(true)
  })

  it('uses AbortSignal.timeout if available', () => {
    const original = (AbortSignal as any).timeout
    const mock = vi.fn((ms: number) => new AbortController().signal)
    ;(AbortSignal as any).timeout = mock
    timeoutSignal(5)
    expect(mock).toHaveBeenCalledWith(5)
    ;(AbortSignal as any).timeout = original
  })
})
