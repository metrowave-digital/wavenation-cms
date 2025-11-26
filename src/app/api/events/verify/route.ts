// app/api/events/verify/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import type { User, EventRegistration } from '@/payload-types'

type VerifyBody = {
  qr: string // QR JSON
}

export async function POST(req: Request) {
  const { qr } = (await req.json()) as VerifyBody

  if (!qr) {
    return NextResponse.json({ error: 'Missing QR data' }, { status: 400 })
  }

  let parsed: {
    registrationId: string
    eventId: string
    eventType: 'events' | 'live-events'
    ts: number
    token: string
  }

  try {
    parsed = JSON.parse(qr)
  } catch {
    return NextResponse.json({ error: 'Invalid QR format' }, { status: 400 })
  }

  const { registrationId, eventId, eventType } = parsed

  // Convert IDs to numbers (REQUIRED by your Payload schema)
  const regPk = Number(registrationId)
  const eventPk = Number(eventId)

  if (Number.isNaN(regPk) || Number.isNaN(eventPk)) {
    return NextResponse.json(
      { error: 'Invalid registrationId or eventId (must be numeric)' },
      { status: 400 },
    )
  }

  // Build event relationship object
  const eventRelation =
    eventType === 'live-events'
      ? ({ relationTo: 'live-events', value: eventPk } as const)
      : ({ relationTo: 'events', value: eventPk } as const)

  // 1. Load registration
  const registration = await payload.findByID({
    collection: 'event-registrations',
    id: regPk,
  })

  if (!registration) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  // relationship fields always store numeric PKs so user is numeric
  const userPk = Number(registration.user)

  // 2. Create check-in record
  const checkIn = await payload.create({
    collection: 'event-checkins',
    data: {
      registration: regPk, // ✔ FIXED: must be number
      event: eventRelation, // ✔ already correct polymorphic relationship
      user: userPk, // ✔ must be number
      method: 'qr',
    },
  })

  return NextResponse.json({
    ok: true,
    registration,
    checkIn,
  })
}
