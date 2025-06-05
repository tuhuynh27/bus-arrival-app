import { Handler } from '@netlify/functions'
import webpush from 'web-push'

const MAX_DELAY_MS = 60000

const handler: Handler = async (event) => {
  if (!event.body) return { statusCode: 400, body: 'No body' }
  const { subscription, payload, delay } = JSON.parse(event.body)
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const contact = process.env.VAPID_CONTACT || 'mailto:example@example.com'
  if (!publicKey || !privateKey) {
    return { statusCode: 500, body: 'VAPID keys not configured' }
  }
  const wait = Math.max(0, Math.min(Number(delay) || 0, MAX_DELAY_MS))
  webpush.setVapidDetails(contact, publicKey, privateKey)
  if (wait > 0) {
    await new Promise((res) => setTimeout(res, wait))
  }
  await webpush.sendNotification(subscription, JSON.stringify(payload))
  return { statusCode: 200, body: 'sent' }
}

export { handler }
