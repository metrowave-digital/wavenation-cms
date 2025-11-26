// app/api/users/suspend/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, until } = await req.json()

  await payload.update({
    collection: 'users',
    id,
    data: {
      isSuspended: true,
      suspendedUntil: until || null,
      status: 'suspended',
    },
  })

  return NextResponse.json({ success: true })
}
