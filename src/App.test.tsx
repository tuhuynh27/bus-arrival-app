import { render } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('./assets/bus.png', () => ({ default: '' }))
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
