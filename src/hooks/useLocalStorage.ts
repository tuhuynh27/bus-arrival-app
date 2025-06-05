import { useState, useEffect, useRef } from 'react'

import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const initialRef = useRef(initialValue)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialRef.current
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialRef.current
    }
  })

  const setValue: Dispatch<SetStateAction<T>> = value => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value
      setStoredValue(newValue)
      window.localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(
        new CustomEvent('local-storage', { detail: key })
      )
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleChange = (e: Event) => {
      if (e instanceof StorageEvent && e.key && e.key !== key) return
      if (
        e.type === 'local-storage' &&
        (e as CustomEvent<string>).detail !== key
      )
        return
      try {
        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialRef.current)
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
    window.addEventListener('storage', handleChange)
    window.addEventListener('local-storage', handleChange as EventListener)
    return () => {
      window.removeEventListener('storage', handleChange)
      window.removeEventListener('local-storage', handleChange as EventListener)
    }
  }, [key])

  return [storedValue, setValue];
} 