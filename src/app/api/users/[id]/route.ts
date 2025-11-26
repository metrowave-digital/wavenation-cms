// app/api/users/[id]/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: any) {
  const user = await payload.findByID({
    collection: 'users',
    id: params.id,
  })

  return NextResponse.json({ user })
}

export async function PATCH(req: Request, { params }: any) {
  const data = await req.json()

  const updated = await payload.update({
    collection: 'users',
    id: params.id,
    data,
  })

  return NextResponse.json({ user: updated })
}

export async function DELETE(_: Request, { params }: any) {
  await payload.delete({
    collection: 'users',
    id: params.id,
  })

  return NextResponse.json({ success: true })
}
