// app/api/events/register-with-account/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'
import type { User } from '@/payload-types'

type Body = {
  eventId: string
  eventType: 'events' | 'live-events'
  email: string
  name?: string
  createAccount?: boolean
}

export async function POST(req: Request) {
  const { eventId, eventType, email, name, createAccount = false } = (await req.json()) as Body

  if (!eventId || !email || !eventType) {
    return NextResponse.json({ error: 'Missing eventId, eventType, or email' }, { status: 400 })
  }

  // Payload relationship IDs must be numbers
  const eventPk = Number(eventId)
  if (Number.isNaN(eventPk)) {
    return NextResponse.json({ error: 'Invalid eventId (must be numeric)' }, { status: 400 })
  }

  const eventRelation =
    eventType === 'live-events'
      ? ({ relationTo: 'live-events', value: eventPk } as const)
      : ({ relationTo: 'events', value: eventPk } as const)

  const normalEmail = email.toLowerCase()

  // 1) Try to find existing user
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
    where: { email: { equals: normalEmail } },
  })

  let user = existingUsers.docs[0]

  // 2) Create user if allowed
  if (!user && createAccount) {
    user = await payload.create({
      collection: 'users',
      data: {
        email: normalEmail,
        displayName: name || email,
        role: 'viewer',
        status: 'pending',
      } as Partial<User>, // ⭐ FIX: mark as Partial<User> so missing fields are allowed
      draft: true, // ⭐ FIX: required by your Users collection
    })
  }

  if (!user) {
    return NextResponse.json(
      {
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        suggestion: 'Pass createAccount: true to create a profile.',
      },
      { status: 404 },
    )
  }

  // 3) Prevent duplicate registration
  const existingReg = await payload.find({
    collection: 'event-registrations',
    limit: 1,
    where: {
      and: [
        { event: { equals: eventPk } },
        { user: { equals: user.id } },
        { status: { equals: 'registered' } },
      ],
    },
  })

  if (existingReg.totalDocs > 0) {
    return NextResponse.json({
      user,
      registration: existingReg.docs[0],
      createdUser: false,
      createdRegistration: false,
    })
  }

  // 4) Create registration (correct relationship type)
  const registration = await payload.create({
    collection: 'event-registrations',
    data: {
      event: eventRelation, // ⭐ FIXED: polymorphic relationship object
      user: user.id,
      status: 'registered',
      source: 'web',
    },
    draft: false,
  })

  return NextResponse.json({
    user,
    registration,
    createdUser: existingUsers.totalDocs === 0 && createAccount,
    createdRegistration: true,
  })
}
