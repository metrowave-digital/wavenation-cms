// app/api/auth/2fa/enable/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import { authenticator } from 'otplib'

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader.match(/payload-token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✔ The ONLY valid auth method in Payload v3.64
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { method } = await req.json()

  if (!['sms', 'email', 'auth-app'].includes(method)) {
    return NextResponse.json({ error: 'Invalid 2FA method' }, { status: 400 })
  }

  let secret: string | null = null

  if (method === 'auth-app') {
    secret = authenticator.generateSecret()
  }

  // ✔ Update user safely
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      twoFactorEnabled: true,
      twoFactorMethod: method,
      authAppSecret: secret ?? undefined,
    },
  })

  return NextResponse.json({
    enabled: true,
    method,
    secret: method === 'auth-app' ? secret : undefined,
  })
}
