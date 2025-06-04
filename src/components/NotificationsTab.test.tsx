import { render, fireEvent } from '@testing-library/react'
import { NotificationsTab } from './NotificationsTab'

describe('NotificationsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<NotificationsTab />)
    expect(getByText('Notifications')).toBeTruthy()
  })

  it('shows stored notifications and can clear', () => {
    window.localStorage.setItem('pendingNotifications', JSON.stringify([{ id: '1', busNo: '10', targetTime: Date.now() + 1000 }]))
    const { getByText } = render(<NotificationsTab />)
    expect(getByText('Bus 10')).toBeTruthy()
    fireEvent.click(getByText('Clear All'))
    expect(window.localStorage.getItem('pendingNotifications')).toBe('[]')
  })
})
