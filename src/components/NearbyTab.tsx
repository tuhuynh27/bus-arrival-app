import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from './ui/card'
import { MapPin } from 'lucide-react'
import { StationCard } from './HomeTab'
import type { StopData, ServiceData, StationConfig, BusArrival } from '../types'

interface NearbyTabProps {
  stopsData: StopData
  servicesData: ServiceData
  handleNotify: (bus: BusArrival) => void
  showRouteName: boolean
}

export function NearbyTab({ stopsData, servicesData, handleNotify, showRouteName }: NearbyTabProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          setError('Unable to retrieve your location')
        },
        { enableHighAccuracy: true, maximumAge: 600000, timeout: 5000 }
      )
    } else {
      setError('Geolocation not supported')
    }
  }, [])

  const stationToBusNumbers = useMemo(() => {
    const mapping: Record<string, Set<string>> = {}
    Object.keys(servicesData).forEach(busNo => {
      servicesData[busNo].routes.forEach(route => {
        route.forEach(stationId => {
          if (!mapping[stationId]) {
            mapping[stationId] = new Set()
          }
          mapping[stationId].add(busNo)
        })
      })
    })
    const res: Record<string, string[]> = {}
    Object.keys(mapping).forEach(id => {
      res[id] = Array.from(mapping[id])
    })
    return res
  }, [servicesData])

  const nearbyConfigs = useMemo(() => {
    if (!coords) return [] as StationConfig[]
    const { lat, lng } = coords
    return Object.keys(stopsData)
      .map(id => {
        const stop = stopsData[id]
        const distance = Math.sqrt(
          Math.pow(stop[1] - lat, 2) + Math.pow(stop[0] - lng, 2)
        )
        return { id, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(({ id }) => ({
        stationId: id,
        busNumbers: stationToBusNumbers[id] || []
      }))
  }, [coords, stopsData, stationToBusNumbers])

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!coords) {
    return (
      <Card>
        <CardContent className="flex justify-center p-6">
          <MapPin className="w-5 h-5 animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2 pb-6">
      {nearbyConfigs.map(config => (
        <StationCard
          key={config.stationId}
          config={config}
          servicesData={servicesData}
          stopsData={stopsData}
          onNotify={handleNotify}
          maxItems={8}
          showRouteName={showRouteName}
        />
      ))}
    </div>
  )
}
