// app/api/auth/password-reset/request/route.ts
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  const key = `pwd-reset:${ip}:${email.toLowerCase()}`
  const limit = rateLimit(key, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
  })

  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfter),
        },
      },
    )
  }

  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      email,
      connection: 'Username-Password-Authentication',
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Unable to send reset email' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Password reset email sent' })
}
