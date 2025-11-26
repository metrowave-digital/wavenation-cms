// src/app/api/vod/[id]/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    const doc = await payload.findByID({
      collection: 'vod',
      id: params.id,
      depth: 2,
    })

    return NextResponse.json(doc)
  } catch (err) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json()

  const updated = await payload.update({
    collection: 'vod',
    id: params.id,
    data: body,
  })

  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  await payload.delete({
    collection: 'vod',
    id: params.id,
  })

  return NextResponse.json({ status: 'deleted' })
}
