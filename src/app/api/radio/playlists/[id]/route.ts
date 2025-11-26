// src/app/api/radio/playlists/[id]/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const playlist = await payload.findByID({
    collection: 'playlists',
    id: params.id,
  })

  return NextResponse.json(playlist)
}

export async function PATCH(req: Request, { params }: Params) {
  const data = await req.json()

  const updated = await payload.update({
    collection: 'playlists',
    id: params.id,
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  await payload.delete({
    collection: 'playlists',
    id: params.id,
  })

  return NextResponse.json({ status: 'deleted' })
}
