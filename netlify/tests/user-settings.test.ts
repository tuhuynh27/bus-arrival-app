// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { SignJWT } from 'jose'

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

const secret = 'testsecret'

async function makeToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret))
}

const eventBase = {} as any

describe('user-settings', () => {
  it('requires valid token', async () => {
    process.env.JWT_SECRET = secret
    const { handler } = await import('../functions/user-settings')
    const email = 'user@example.com'
    const res = await handler({
      httpMethod: 'GET',
      queryStringParameters: { email },
      headers: {},
      ...eventBase,
    })
    expect(res.statusCode).toBe(401)
  })

  it('saves and fetches with token', async () => {
    process.env.JWT_SECRET = secret
    const { handler } = await import('../functions/user-settings')
    const email = 'user@example.com'
    const token = await makeToken(email)

    let res = await handler({
      httpMethod: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, data: { hi: 1 } }),
      ...eventBase,
    })
    expect(res.statusCode).toBe(200)

    res = await handler({
      httpMethod: 'GET',
      headers: { authorization: `Bearer ${token}` },
      queryStringParameters: { email },
      ...eventBase,
    })
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body)).toEqual({ hi: 1 })
  })
})
