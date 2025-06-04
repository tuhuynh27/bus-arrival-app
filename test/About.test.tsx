import { render } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('../src/assets/bus.png', () => ({ default: '' }))
import { About } from '../src/components/About'

describe('About', () => {
  it('renders title', () => {
    const { getByText } = render(<About />)
    expect(getByText('SG Bus Arrival')).toBeTruthy()
  })
})
