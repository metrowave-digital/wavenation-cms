import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const updated = await payload.update({
    collection: 'comments',
    id,
    data: { status: 'approved' },
  })

  return NextResponse.json({ success: true, updated })
}
