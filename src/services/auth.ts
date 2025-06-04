const endpoint = '/.netlify/functions/auth'

export async function checkUser(email: string): Promise<boolean> {
  const res = await fetch(`${endpoint}?email=${encodeURIComponent(email)}`)
  if (res.status === 404) return false
  if (!res.ok) throw new Error('Failed to check user')
  return true
}

interface AuthResult { token: string }

async function post(body: object): Promise<AuthResult> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await res.text())
  }
  return (await res.json()) as AuthResult
}

export async function register(email: string, pin: string): Promise<AuthResult> {
  return post({ email, pin, action: 'register' })
}

export async function login(email: string, pin: string): Promise<AuthResult> {
  return post({ email, pin, action: 'login' })
}
