import { renderHook, act } from '@testing-library/react'
import { usePendingNotifications } from './usePendingNotifications'

describe('usePendingNotifications', () => {
  it('adds and removes notifications', () => {
    window.localStorage.clear()
    const { result } = renderHook(() => usePendingNotifications())
    act(() => {
      result.current.addNotification({ id: '1', busNo: '10', targetTime: Date.now() + 1000 })
    })
    expect(result.current.notifications.length).toBe(1)
    act(() => {
      result.current.removeNotification('1')
    })
    expect(result.current.notifications.length).toBe(0)
  })

  it('appends multiple notifications correctly', () => {
    window.localStorage.clear()
    const { result } = renderHook(() => usePendingNotifications())
    act(() => {
      result.current.addNotification({ id: '1', busNo: '10', targetTime: 1 })
    })
    act(() => {
      result.current.addNotification({ id: '2', busNo: '20', targetTime: 2 })
    })
    expect(result.current.notifications.length).toBe(2)
  })
})
