import { render } from '@testing-library/react'
import { NotificationsTab } from './NotificationsTab'

describe('NotificationsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<NotificationsTab />)
    expect(getByText('Notifications')).toBeTruthy()
  })
})
