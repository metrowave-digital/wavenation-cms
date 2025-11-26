import { NextResponse } from 'next/server'
import payload from 'payload'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const deleted = await payload.delete({
    collection: 'creator-channels',
    id: params.id,
  })

  return NextResponse.json({ success: true, deleted })
}
