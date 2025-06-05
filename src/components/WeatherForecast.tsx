import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import type { WeatherData } from '../services/weather'
import { fetchWeather, DEFAULT_LOCATION, type WeatherLocation } from '../services/weather'
import { useEffect, useState } from 'react'

function weatherIcon(code: number) {
  if (code === 0) return { Icon: Sun, label: 'Clear' }
  if ([1, 2, 3].includes(code)) return { Icon: Cloud, label: 'Cloudy' }
  if ([45, 48].includes(code)) return { Icon: CloudFog, label: 'Fog' }
  if ([51, 53, 55, 56, 57].includes(code)) return { Icon: CloudDrizzle, label: 'Drizzle' }
  if ([61, 63, 65, 80, 81, 82, 66, 67].includes(code)) return { Icon: CloudRain, label: 'Rain' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { Icon: CloudSnow, label: 'Snow' }
  if ([95, 96, 99].includes(code)) return { Icon: CloudLightning, label: 'Storm' }
  return { Icon: Cloud, label: 'N/A' }
}

export function WeatherForecast() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timezone: DEFAULT_LOCATION.timezone,
          })
        },
        () => {
          /* fallback to default */
        },
        { enableHighAccuracy: true, maximumAge: 3600000, timeout: 5000 },
      )
    }
  }, [])

  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeather(location),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <Card className="p-3 gap-2">
      <CardContent className="p-0 text-xs">
        {isLoading ? (
          <div className="flex justify-around animate-pulse gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 rounded-full bg-muted" />
                <div className="w-7 h-2.5 rounded bg-muted" />
                <div className="w-6 h-2.5 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error || !data ? (
          <div className="flex justify-center py-2 text-destructive">
            Failed to load weather
          </div>
        ) : (
          <div className="flex justify-around gap-2">
            {data.time.slice(0, 3).map((t, idx) => {
              const { Icon } = weatherIcon(data.weathercode[idx])
              const temp = Math.round(data.temperature_2m[idx])
              const precip = data.precipitation_probability?.[idx]
              return (
                <div key={t} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{format(new Date(t), 'ha')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{temp}&deg;C</span>
                    {precip != null && (
                      <span className="text-[10px] text-muted-foreground">{precip}%</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
