import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useNotifications } from './useNotifications'
import { usePendingNotifications } from './usePendingNotifications'
import { requestPushSubscription, schedulePush } from '../services/push'

vi.mock('./usePendingNotifications')
vi.mock('../services/push')

const mockedUsePending = usePendingNotifications as unknown as any
const mockedRequest = requestPushSubscription as unknown as any
const mockedSchedule = schedulePush as unknown as any

describe('useNotifications', () => {
  it('schedules and saves notification', async () => {
    vi.useFakeTimers()
    mockedUsePending.mockReturnValue({ addNotification: vi.fn(), removeNotification: vi.fn() })
    mockedRequest.mockResolvedValue({})
    const { result } = renderHook(() => useNotifications())
    const bus = { busNo: '10', arrivalTimestamp: Date.now() + 60000 } as any
    await act(async () => {
      await result.current.notifyBus(bus)
    })
    expect(mockedSchedule).toHaveBeenCalled()
    expect(mockedUsePending.mock.results[0].value.addNotification).toHaveBeenCalledTimes(1)
    // run all timers to trigger cleanup
    vi.runAllTimers()
    expect(mockedUsePending.mock.results[0].value.removeNotification).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('adds notification once per call', async () => {
    const addNotification = vi.fn()
    mockedUsePending.mockReturnValue({ addNotification, removeNotification: vi.fn() })
    mockedRequest.mockResolvedValue({})
    const { result } = renderHook(() => useNotifications())
    const bus = { busNo: '10', arrivalTimestamp: Date.now() + 60000 } as any
    await act(async () => {
      await result.current.notifyBus(bus)
    })
    await act(async () => {
      await result.current.notifyBus(bus)
    })
    expect(addNotification).toHaveBeenCalledTimes(2)
  })
})
