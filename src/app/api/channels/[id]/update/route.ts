import { NextResponse } from 'next/server'
import payload from 'payload'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const channel = await payload.update({
    collection: 'creator-channels',
    id: params.id,
    data: body,
  })

  return NextResponse.json({ success: true, channel })
}
