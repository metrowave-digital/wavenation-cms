// app/api/users/flag/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, notes } = await req.json()

  await payload.update({
    collection: 'users',
    id,
    data: {
      verified: {
        status: 'flagged',
        notes,
      },
    },
  })

  return NextResponse.json({ flagged: true })
}
