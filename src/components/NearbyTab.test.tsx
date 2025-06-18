import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NearbyTab } from './NearbyTab'
import * as api from '@/services/api'

const queryClient = new QueryClient()

const stopsData = {
  '1': [103, 1, 'Stop1', 'Road1'],
  '2': [104, 1.1, 'Stop2', 'Road2']
} as any

const servicesData = {
  '10': { name: 'Ten', routes: [['1', '2']] }
} as any

vi.mock('@/services/api')

const mockGeoSuccess = {
  getCurrentPosition: vi.fn((cb) => cb({ coords: { latitude: 1, longitude: 103 } }))
} as Geolocation

const mockGeoFail = {
  getCurrentPosition: vi.fn((_s, e) => e && e(new Error('denied')))
} as Geolocation

describe('NearbyTab', () => {
  it('shows error when location denied', async () => {
    Object.defineProperty(global.navigator, 'geolocation', { value: mockGeoFail, configurable: true })
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <NearbyTab stopsData={stopsData} servicesData={servicesData} handleNotify={() => {}} showRouteName={true} showStationInfo={true} />
      </QueryClientProvider>
    )
    await waitFor(() => {
      expect(getByText(/Unable/)).toBeTruthy()
    })
  })

  it('renders stations on success', async () => {
    Object.defineProperty(global.navigator, 'geolocation', { value: mockGeoSuccess, configurable: true })
    ;(api.fetchBusArrivals as any).mockResolvedValue([])
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <NearbyTab stopsData={stopsData} servicesData={servicesData} handleNotify={() => {}} showRouteName={true} showStationInfo={true} />
      </QueryClientProvider>
    )
    await waitFor(() => {
      expect(getByText('Stop1 (Road1)')).toBeTruthy()
    })
  })
})
