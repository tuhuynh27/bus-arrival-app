import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type { WeatherData } from '../services/weather'
import { fetchWeather } from '../services/weather'

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
  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 5,
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-tight">Weather (next 2h)</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-around animate-pulse gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="w-5 h-5 rounded-full bg-muted" />
                <div className="w-8 h-3 rounded bg-muted" />
                <div className="w-6 h-3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error || !data ? (
          <div className="flex justify-center py-4 text-sm text-destructive">
            Failed to load weather
          </div>
        ) : (
          <div className="flex justify-around gap-4 text-sm">
            {data.time.map((t, idx) => {
              const { Icon } = weatherIcon(data.weathercode[idx])
              const temp = Math.round(data.temperature_2m[idx])
              const precip = data.precipitation_probability?.[idx]
              return (
                <div key={t} className="flex flex-col items-center">
                  <Icon className="w-5 h-5 mb-1" />
                  <div>{format(new Date(t), 'ha')}</div>
                  <div>{temp}&deg;C</div>
                  {precip != null && (
                    <div className="text-xs text-muted-foreground">{precip}%</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
