import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeoutSignal(ms: number): AbortSignal {
  const timeout = (AbortSignal as { timeout?: (ms: number) => AbortSignal }).timeout
  if (typeof timeout === 'function') {
    return timeout(ms)
  }
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}
