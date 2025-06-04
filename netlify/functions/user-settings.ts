import { Handler } from '@netlify/functions'
import { connectLambda, getStore } from '@netlify/blobs'
import type { LambdaEvent } from '@netlify/serverless-functions-api/dist/lambda/event'
import { jwtVerify } from 'jose'

interface TokenPayload {
  email: string
}

const handler: Handler = async (event) => {
  if ((event as { blobs?: string }).blobs) {
    try {
      connectLambda(event as unknown as LambdaEvent)
    } catch {
      /* ignore errors */
    }
  }
  const store = getStore('user-settings')
  const method = event.httpMethod || 'GET'

  let email = event.queryStringParameters?.email as string | undefined
  if (!email && event.body) {
    try {
      email = JSON.parse(event.body).email
    } catch {
      /* ignore errors */
    }
  }

  const token = event.headers?.authorization?.replace(/^Bearer\s+/i, '')
  const secret = process.env.JWT_SECRET
  if (!secret) return { statusCode: 500, body: 'JWT secret not configured' }
  if (!token) return { statusCode: 401, body: 'Unauthorized' }
  let payloadEmail = ''
  try {
    const { payload } = await jwtVerify<TokenPayload>(
      token,
      new TextEncoder().encode(secret)
    )
    payloadEmail = payload.email
  } catch {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  if (!email) return { statusCode: 400, body: 'Email required' }
  if (email.trim().toLowerCase() !== payloadEmail) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const key = encodeURIComponent(payloadEmail)

  if (method === 'GET') {
    const data = await store.get(key, { type: 'json' })
    return { statusCode: 200, body: JSON.stringify(data) }
  }
  if (method === 'POST') {
    const { data } = event.body ? JSON.parse(event.body) : { data: null }
    await store.setJSON(key, data)
    return { statusCode: 200, body: 'ok' }
  }
  return { statusCode: 405, body: 'Method Not Allowed' }
}

export { handler }
