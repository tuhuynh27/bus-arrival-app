import { describe, it, expect, vi } from 'vitest'
import { fetchBusArrivals } from './api'

const sample = {
  services: [
    { no: '10', next: { duration_ms: 60000 } },
    { no: '20', next: { duration_ms: 120000 } },
  ],
}

describe('fetchBusArrivals', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws when offline', async () => {
    vi.stubGlobal('navigator', { onLine: false })
    await expect(fetchBusArrivals('100', ['10'])).rejects.toThrow('No internet connection')
  })

  it('returns arrivals when fetch succeeds', async () => {
    vi.stubGlobal('navigator', { onLine: true })
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => sample })))
    const res = await fetchBusArrivals('100', ['10'])
    expect(res[0].busNo).toBe('10')
  })

  it('throws error when fetch fails', async () => {
    vi.stubGlobal('navigator', { onLine: true })
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })))
    await expect(fetchBusArrivals('100', ['10'])).rejects.toThrow('HTTP 500')
  })
})
