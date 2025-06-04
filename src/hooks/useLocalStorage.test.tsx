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
})
