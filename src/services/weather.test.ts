import { describe, it, expect, vi } from 'vitest'
import { fetchWeather, DEFAULT_LOCATION } from './weather'

const sample = {
  hourly: {
    time: ['2024-01-01T00:00'],
    temperature_2m: [25],
    precipitation_probability: [10],
    weathercode: [1],
  },
}

describe('fetchWeather', () => {
  it('returns parsed weather data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => sample })))
    const data = await fetchWeather(DEFAULT_LOCATION)
    expect(data.temperature_2m[0]).toBe(25)
    vi.restoreAllMocks()
  })

  it('throws on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })))
    await expect(fetchWeather(DEFAULT_LOCATION)).rejects.toThrow('Failed to fetch weather')
    vi.restoreAllMocks()
  })
})
