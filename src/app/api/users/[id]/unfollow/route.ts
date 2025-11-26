// app/api/users/[id]/unfollow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const targetId = params.id

  const exists = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: targetId },
      kind: { equals: 'user' },
    },
    limit: 1,
  })

  if (exists.totalDocs === 0) return NextResponse.json({ success: true, alreadyUnfollowed: true })

  await payload.delete({
    collection: 'follows',
    id: exists.docs[0].id,
  })

  return NextResponse.json({ success: true })
}
