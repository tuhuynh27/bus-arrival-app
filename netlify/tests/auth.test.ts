// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

vi.mock('@netlify/blobs', () => {
  const store = new Map<string, any>()
  return {
    connectLambda: () => {},
    getStore: () => ({
      get: async (key: string) => store.get(key),
      setJSON: async (key: string, value: any) => {
        store.set(key, value)
      },
    }),
  }
})

const eventBase = {} as any

describe('auth', () => {
  it('returns 400 if no body', async () => {
    const { handler } = await import('../functions/auth')
    const res = await handler({ httpMethod: 'POST', ...eventBase })
    expect(res.statusCode).toBe(400)
  })

  it('registers and logs in user', async () => {
    process.env.JWT_SECRET = 'testsecret'
    const { handler } = await import('../functions/auth')
    const email = 'user@example.com'
    const registerRes = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ email, pin: '1234', action: 'register' }),
      ...eventBase,
    })
    expect(registerRes.statusCode).toBe(200)

    const loginRes = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ email, pin: '1234', action: 'login' }),
      ...eventBase,
    })
    expect(loginRes.statusCode).toBe(200)

    const wrongRes = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ email, pin: '0000', action: 'login' }),
      ...eventBase,
    })
    expect(wrongRes.statusCode).toBe(401)

    const getRes = await handler({
      httpMethod: 'GET',
      queryStringParameters: { email },
      ...eventBase,
    })
    expect(getRes.statusCode).toBe(200)
  })
})
