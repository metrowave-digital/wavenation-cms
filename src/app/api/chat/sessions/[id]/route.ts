// src/app/api/chat/sessions/[id]/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const { id } = params

  const session = await payload.findByID({
    collection: 'chat-sessions',
    id,
  })

  return NextResponse.json(session)
}
