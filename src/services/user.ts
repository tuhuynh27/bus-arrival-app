import type { StationConfig } from '../types'

const endpoint = '/.netlify/functions/user-settings'

export async function fetchUserSettings(
  email: string,
  token: string
): Promise<StationConfig[] | null> {
  const res = await fetch(`${endpoint}?email=${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return (await res.json()) as StationConfig[] | null
}

export async function saveUserSettings(
  email: string,
  token: string,
  data: StationConfig[]
): Promise<void> {
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, data }),
  })
}
