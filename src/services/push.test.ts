import { describe, it, expect, vi } from 'vitest'
import { urlBase64ToUint8Array, requestPushSubscription, schedulePush } from './push'

const sampleKey = 'AQAB'

describe('urlBase64ToUint8Array', () => {
  it('converts base64 to Uint8Array', () => {
    const arr = urlBase64ToUint8Array(sampleKey)
    expect(arr).toBeInstanceOf(Uint8Array)
    expect(arr.length).toBeGreaterThan(0)
  })
})

describe('requestPushSubscription', () => {
  const orig = {
    serviceWorker: navigator.serviceWorker,
    Notification: global.Notification,
    PushManager: (global as any).PushManager,
  }
  afterEach(() => {
    Object.assign(navigator, { serviceWorker: orig.serviceWorker })
    global.Notification = orig.Notification
    if (orig.PushManager) (global as any).PushManager = orig.PushManager
    else delete (global as any).PushManager
    vi.restoreAllMocks()
  })
  it('returns null when permission denied', async () => {
    Object.assign(navigator, { serviceWorker: { ready: Promise.resolve({ pushManager: { getSubscription: vi.fn(), subscribe: vi.fn() } }) } })
    global.Notification = { requestPermission: vi.fn(async () => 'denied') } as any
    const res = await requestPushSubscription()
    expect(res).toBeNull()
  })
  it('subscribes when permission granted', async () => {
    const sub = {}
    const pushManager = { getSubscription: vi.fn(async () => null), subscribe: vi.fn(async () => sub) }
    Object.assign(navigator, { serviceWorker: { ready: Promise.resolve({ pushManager }) } })
    global.Notification = { requestPermission: vi.fn(async () => 'granted') } as any
    ;(global as any).PushManager = function () {}
    process.env.VITE_VAPID_PUBLIC_KEY = sampleKey
    const res = await requestPushSubscription()
    expect(res).toBe(sub)
  })
})

describe('schedulePush', () => {
  it('posts to server', async () => {
    const fetchMock = vi.fn(async () => ({}))
    vi.stubGlobal('fetch', fetchMock)
    const sub = {} as PushSubscription
    await schedulePush(sub, { a: 1 }, 100)
    expect(fetchMock).toHaveBeenCalled()
    vi.restoreAllMocks()
  })
})
