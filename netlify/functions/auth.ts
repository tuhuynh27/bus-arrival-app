import { Handler } from '@netlify/functions'
import { connectLambda, getStore } from '@netlify/blobs'
import type { LambdaEvent } from '@netlify/serverless-functions-api/dist/lambda/event'
import { SignJWT } from 'jose'
import crypto from 'node:crypto'

const ITERATIONS = 100000
const KEY_LEN = 32
const DIGEST = 'sha256'

const handler: Handler = async (event) => {
  if ((event as { blobs?: string }).blobs) {
    try {
      connectLambda(event as unknown as LambdaEvent)
    } catch {
      /* ignore */
    }
  }

  const method = event.httpMethod || 'POST'
  const store = getStore('user-passcodes')

  if (method === 'GET') {
    const email = event.queryStringParameters?.email
    if (!email) return { statusCode: 400, body: 'Email required' }
    const key = encodeURIComponent(email.trim().toLowerCase())
    const data = await store.get(key, { type: 'json' })
    if (!data) return { statusCode: 404, body: 'Not found' }
    return { statusCode: 200, body: 'exists' }
  }

  if (method === 'POST') {
    if (!event.body) return { statusCode: 400, body: 'No body' }
    const { email, pin, action } = JSON.parse(event.body)
    if (!email || !pin) {
      return { statusCode: 400, body: 'Email and pin required' }
    }
    const key = encodeURIComponent(email.trim().toLowerCase())

    if (action === 'register') {
      const salt = crypto.randomBytes(16).toString('hex')
      const hash = crypto.pbkdf2Sync(pin, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex')
      await store.setJSON(key, { salt, hash })
    } else if (action === 'login') {
      const data = (await store.get(key, { type: 'json' })) as {
        salt?: string
        hash: string
      } | null
      if (!data) {
        return { statusCode: 401, body: 'Invalid pin' }
      }
      let valid = false
      if (data.salt) {
        const check = crypto
          .pbkdf2Sync(pin, data.salt, ITERATIONS, KEY_LEN, DIGEST)
          .toString('hex')
        valid = check === data.hash
      } else {
        const legacyHash = crypto.createHash('sha256').update(pin).digest('hex')
        valid = legacyHash === data.hash
      }
      if (!valid) {
        return { statusCode: 401, body: 'Invalid pin' }
      }
    } else {
      return { statusCode: 400, body: 'Invalid action' }
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return { statusCode: 500, body: 'JWT secret not configured' }
    }
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(secret))
    return { statusCode: 200, body: JSON.stringify({ token }) }
  }

  return { statusCode: 405, body: 'Method Not Allowed' }
}

export { handler }
