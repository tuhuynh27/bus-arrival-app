import { render } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('./assets/bus.png', () => ({ default: '' }))
vi.mock('@/assets/bus.png', () => ({ default: '' }))
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }),
  })
  window.scrollTo = vi.fn()
})
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
