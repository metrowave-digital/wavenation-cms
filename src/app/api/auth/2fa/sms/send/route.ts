// app/api/auth/2fa/sms/send/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!)

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader.match(/payload-token=([^;]+)/)?.[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✔ Correct Payload auth for v3.64
  const { user } = await payload.auth({
    headers: req.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ✔ Validate phone field
  if (!('phone' in user) || !user.phone) {
    return NextResponse.json({ error: 'User has no phone number on file' }, { status: 400 })
  }

  // Generate 6-digit SMS code
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // Send SMS
  await client.messages.create({
    to: user.phone,
    from: process.env.TWILIO_NUMBER!,
    body: `Your WaveNation verification code is ${code}`,
  })

  // (Optional) Save code for verification
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      pendingSmsCode: code,
      pendingSmsExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    },
  })

  return NextResponse.json({ sent: true })
}
