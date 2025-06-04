import { describe, it, expect, vi } from 'vitest'

const sub = { endpoint: 'x' }

describe('schedule-notification-background', () => {
  it('returns 400 if no body', async () => {
    const { handler } = await import('../functions/schedule-notification-background')
    const res = await handler({} as any)
    expect(res.statusCode).toBe(400)
  })

  it('returns 500 if missing keys', async () => {
    const { handler } = await import('../functions/schedule-notification-background')
    const res = await handler({ body: JSON.stringify({ subscription: sub, payload: {}, delay: 0 }) } as any)
    expect(res.statusCode).toBe(500)
  })

  it('sends notification', async () => {
    process.env.VAPID_PUBLIC_KEY = 'a'
    process.env.VAPID_PRIVATE_KEY = 'b'
    const webpush = await import('web-push')
    const sendNotification = vi.spyOn(webpush.default, 'sendNotification').mockResolvedValue(undefined as any)
    vi.spyOn(webpush.default, 'setVapidDetails').mockImplementation(() => {})
    const { handler } = await import('../functions/schedule-notification-background')
    const res = await handler({ body: JSON.stringify({ subscription: sub, payload: { hi: 1 }, delay: 0 }) } as any)
    expect(sendNotification).toHaveBeenCalled()
    expect(res.statusCode).toBe(200)
  })
})
