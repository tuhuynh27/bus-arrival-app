import { useState, useEffect } from 'react'

import type { Dispatch, SetStateAction } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = value => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value
      setStoredValue(newValue)
      window.localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialValue)
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
    window.addEventListener('storage', handleChange)
    window.addEventListener('local-storage', handleChange)
    return () => {
      window.removeEventListener('storage', handleChange)
      window.removeEventListener('local-storage', handleChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue];
} 