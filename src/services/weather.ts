export interface WeatherData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability?: number[]
  weathercode: number[]
}

export const fetchWeather = async (): Promise<WeatherData> => {
  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=1.284&longitude=103.828&hourly=temperature_2m,precipitation_probability,weathercode&forecast_hours=2&timezone=Asia%2FSingapore'
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch weather')
  }
  const data = await res.json()
  return data.hourly as WeatherData
}
