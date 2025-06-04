import { render } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('../src/assets/bus.png', () => ({ default: '' }))
import App from '../src/App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
