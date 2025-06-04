import { Handler } from '@netlify/functions'
import webpush from 'web-push'

const handler: Handler = async (event) => {
  if (!event.body) return { statusCode: 400, body: 'No body' }
  const { subscription, payload, delay } = JSON.parse(event.body)
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    return { statusCode: 500, body: 'VAPID keys not configured' }
  }
  webpush.setVapidDetails('mailto:example@example.com', publicKey, privateKey)
  await new Promise((res) => setTimeout(res, Math.max(0, delay || 0)))
  await webpush.sendNotification(subscription, JSON.stringify(payload))
  return { statusCode: 200, body: 'sent' }
}

export { handler }
