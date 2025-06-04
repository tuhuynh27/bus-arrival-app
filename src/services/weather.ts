export interface WeatherData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability?: number[]
  weathercode: number[]
}

export interface WeatherLocation {
  latitude: number
  longitude: number
  timezone?: string
}

export const DEFAULT_LOCATION: WeatherLocation = {
  latitude: 1.2861,
  longitude: 103.8294,
  timezone: 'Asia/Singapore',
}

export const fetchWeather = async (
  location: WeatherLocation = DEFAULT_LOCATION,
): Promise<WeatherData> => {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
    '&hourly=temperature_2m,precipitation_probability,weathercode&forecast_hours=2' +
    `&timezone=${encodeURIComponent(location.timezone ?? 'auto')}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch weather')
  }
  const data = await res.json()
  return data.hourly as WeatherData
}
