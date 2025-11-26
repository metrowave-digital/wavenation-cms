// app/api/events/checkin/scan/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { qr } = await req.json()

  if (!qr) return NextResponse.json({ error: 'Missing QR' }, { status: 400 })

  let parsed
  try {
    parsed = JSON.parse(qr)
  } catch {
    return NextResponse.json({ error: 'Invalid QR' }, { status: 400 })
  }

  const { registrationId } = parsed

  const registration = await payload.findByID({
    collection: 'event-registrations',
    id: registrationId,
  })

  if (!registration) {
    return NextResponse.json({ ok: false, error: 'Invalid or expired QR code' }, { status: 404 })
  }

  const user = await payload.findByID({
    collection: 'users',
    id: registration.user as number,
  })

  return NextResponse.json({
    ok: true,
    user,
    registration,
  })
}
