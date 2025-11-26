// app/api/auth/2fa/verify/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import { authenticator } from 'otplib'

export async function POST(req: Request) {
  // Extract session token
  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader.match(/payload-token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✔ Correct Payload v3 authentication
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const code = body.code as string

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const method = user.twoFactorMethod

  // ============================================
  // AUTHENTICATOR APP (TOTP)
  // ============================================
  if (method === 'auth-app') {
    if (!user.authAppSecret) {
      return NextResponse.json({ error: '2FA secret missing for this user' }, { status: 400 })
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.authAppSecret as string, // ensure correct typing
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid authentication code' }, { status: 400 })
    }
  }

  // ============================================
  // SMS or EMAIL (Your OTP system must store code)
  // ============================================
  if (method === 'sms' || method === 'email') {
    // You probably saved pendingSmsCode / pendingEmailCode earlier.
    const savedCode = (method === 'sms' ? user.pendingSmsCode : user.pendingEmailCode) || null

    if (!savedCode) {
      return NextResponse.json({ error: 'No pending verification code stored' }, { status: 400 })
    }

    if (String(savedCode) !== String(code)) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }
  }

  // ============================================
  // SUCCESS
  // ============================================

  return NextResponse.json({ verified: true })
}
