import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  it('reads and writes localStorage', () => {
    window.localStorage.clear()
    const { result } = renderHook(() => useLocalStorage('x', 'a'))
    expect(result.current[0]).toBe('a')
    act(() => result.current[1]('b'))
    expect(window.localStorage.getItem('x')).toBe('"b"')
  })

  it('syncs across hook instances', () => {
    window.localStorage.clear()
    const first = renderHook(() => useLocalStorage('y', 0))
    const second = renderHook(() => useLocalStorage('y', 0))
    act(() => first.result.current[1](1))
    expect(second.result.current[0]).toBe(1)
  })

  it('does not react to other keys', () => {
    window.localStorage.clear()
    const first = renderHook(() => useLocalStorage('a', 0))
    const second = renderHook(() => useLocalStorage('b', 0))
    act(() => first.result.current[1](1))
    expect(second.result.current[0]).toBe(0)
  })
})
