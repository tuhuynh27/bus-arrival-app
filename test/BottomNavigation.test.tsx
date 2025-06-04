import { render, fireEvent } from '@testing-library/react'
import { BottomNavigation } from '../src/components/BottomNavigation'

describe('BottomNavigation', () => {
  it('calls onTabChange when clicked', () => {
    const fn = vi.fn()
    const { getByText } = render(<BottomNavigation activeTab="home" onTabChange={fn} />)
    fireEvent.click(getByText('Settings'))
    expect(fn).toHaveBeenCalled()
  })
})
