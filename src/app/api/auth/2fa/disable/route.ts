// app/api/auth/2fa/disable/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Extract token manually (for your own check)
  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader.match(/payload-token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✔ Only pass headers — this is all Payload v3.64 accepts
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 })
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      twoFactorEnabled: false,
      twoFactorMethod: 'none',
      authAppSecret: null,
    },
  })

  return NextResponse.json({ success: true })
}
