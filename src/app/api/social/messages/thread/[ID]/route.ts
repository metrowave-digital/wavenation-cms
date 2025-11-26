// src/app/api/social/messages/thread/[id]/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const { id } = params

  const msg = await payload.findByID({
    collection: 'messages',
    id,
  })

  return NextResponse.json(msg)
}
