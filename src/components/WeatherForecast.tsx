import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import type { WeatherData } from '../services/weather'
import { fetchWeather, DEFAULT_LOCATION } from '../services/weather'

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
    queryKey: ['weather', DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude],
    queryFn: () => fetchWeather(DEFAULT_LOCATION),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <Card className="py-2 gap-2">
      <CardHeader className="py-1 pb-1">
        <CardTitle className="text-sm leading-tight">Weather (next 2h)</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2 text-xs">
        {isLoading ? (
          <div className="flex justify-around animate-pulse gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-0.5">
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
          <div className="flex justify-around gap-3">
            {data.time.map((t, idx) => {
              const { Icon } = weatherIcon(data.weathercode[idx])
              const temp = Math.round(data.temperature_2m[idx])
              const precip = data.precipitation_probability?.[idx]
              return (
                <div key={t} className="flex flex-col items-center">
                  <Icon className="w-4 h-4 mb-0.5" />
                  <div>{format(new Date(t), 'ha')}</div>
                  <div>{temp}&deg;C</div>
                  {precip != null && (
                    <div className="text-[10px] text-muted-foreground">{precip}%</div>
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
