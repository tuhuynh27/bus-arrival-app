import { renderHook, act } from '@testing-library/react'
import { useOfflineDetection } from './useOfflineDetection'
import { vi } from 'vitest'

describe('useOfflineDetection', () => {
  it('manualRetry updates state', async () => {
    vi.stubGlobal('navigator', { onLine: false })
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true })))
    const { result } = renderHook(() => useOfflineDetection())
    await act(async () => {
      await result.current.manualRetry()
    })
    expect(result.current.isOffline).toBe(false)
    vi.restoreAllMocks()
  })
})
