import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const media = await payload.findByID({
    collection: 'media',
    id: params.id,
    depth: 2,
  })

  return NextResponse.json(media)
}
