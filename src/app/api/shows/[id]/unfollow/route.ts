// app/api/shows/[id]/unfollow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const showId = params.id

  const result = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: showId },
      kind: { equals: 'show' },
    },
    limit: 1,
  })

  if (result.totalDocs === 0) return NextResponse.json({ success: true, alreadyUnfollowed: true })

  await payload.delete({
    collection: 'follows',
    id: result.docs[0].id,
  })

  return NextResponse.json({ success: true })
}
