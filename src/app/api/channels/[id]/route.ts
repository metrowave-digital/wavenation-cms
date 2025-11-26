import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const channel = await payload.findByID({
      collection: 'creator-channels',
      id: params.id,
      depth: 2,
    })

    return NextResponse.json(channel)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
