import type { StationConfig } from '../types'

const endpoint = '/.netlify/functions/user-settings'

export async function fetchUserSettings(email: string): Promise<StationConfig[] | null> {
  const res = await fetch(`${endpoint}?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return (await res.json()) as StationConfig[] | null
}

export async function saveUserSettings(email: string, data: StationConfig[]): Promise<void> {
  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, data })
  })
}
