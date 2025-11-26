import payload from 'payload'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie')

  if (!cookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 🔥 Correct Payload v3 auth (uses cookies)
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const deviceId = randomUUID()

  const trustedDevices = Array.isArray(user.trustedDevices) ? user.trustedDevices : []

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      trustedDevices: [...trustedDevices, { deviceId, addedAt: new Date().toISOString() }],
    },
  })

  return NextResponse.json({
    deviceId,
    user: updated,
  })
}
