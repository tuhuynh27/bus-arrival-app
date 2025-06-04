import { render } from '@testing-library/react'
import { BusArrivalCard } from '../src/components/BusArrivalCard'

describe('BusArrivalCard', () => {
  it('renders bus number', () => {
    const bus = { busNo: '10', arrivalTimestamp: Date.now() + 60000, estimatedArrival: '1 min' }
    const { getByText } = render(<BusArrivalCard bus={bus} />)
    expect(getByText('10')).toBeTruthy()
  })
})
