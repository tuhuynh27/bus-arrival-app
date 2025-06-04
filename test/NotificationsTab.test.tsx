import { render } from '@testing-library/react'
import { NotificationsTab } from '../src/components/NotificationsTab'

describe('NotificationsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<NotificationsTab />)
    expect(getByText('Notifications')).toBeTruthy()
  })
})
