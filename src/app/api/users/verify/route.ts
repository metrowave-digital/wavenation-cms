// app/api/users/verify/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id } = await req.json()

  await payload.update({
    collection: 'users',
    id,
    data: {
      verified: {
        status: 'verified',
        badge: true,
      },
    },
  })

  return NextResponse.json({ verified: true })
}
