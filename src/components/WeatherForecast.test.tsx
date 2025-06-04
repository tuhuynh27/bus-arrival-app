import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WeatherForecast } from './WeatherForecast'
import * as weatherService from '@/services/weather'

const queryClient = new QueryClient()

describe('WeatherForecast', () => {
  it('renders data', async () => {
    vi.spyOn(weatherService, 'fetchWeather').mockResolvedValue({
      time: ['2024-01-01T00:00'],
      temperature_2m: [20],
      precipitation_probability: [5],
      weathercode: [0],
    })
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <WeatherForecast />
      </QueryClientProvider>
    )
    await waitFor(() => {
      expect(getByText('12AM')).toBeTruthy()
    })
  })
})
