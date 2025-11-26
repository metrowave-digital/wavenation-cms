import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await req.json()

  const updated = await payload.update({
    collection: 'users',
    id: userId,
    data: { isBanned: true },
  })

  return NextResponse.json({ success: true, updated })
}
