import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie')

  if (!cookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { deviceId } = await req.json()

  if (!deviceId) {
    return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 })
  }

  // 🔥 Correct Payload v3 authentication
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const trustedDevices = Array.isArray(user.trustedDevices) ? user.trustedDevices : []

  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      trustedDevices: trustedDevices.filter((d: any) => d.deviceId !== deviceId),
    },
  })

  return NextResponse.json({ user: updated })
}
