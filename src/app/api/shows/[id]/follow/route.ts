// app/api/shows/[id]/follow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Convert show ID to number because Payload types require number | Show
  const showIdNum = Number(params.id)
  if (isNaN(showIdNum)) {
    return NextResponse.json({ error: 'Invalid show ID' }, { status: 400 })
  }

  // Check if already following
  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      'target.relationTo': { equals: 'shows' },
      'target.value': { equals: showIdNum },
      kind: { equals: 'show' },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ success: true, alreadyFollowing: true })
  }

  // Create follow
  const follow = await payload.create({
    collection: 'follows',
    data: {
      follower: user.id,
      kind: 'show',
      target: {
        relationTo: 'shows',
        value: showIdNum, // number ✔
      },
    },
  })

  return NextResponse.json({ success: true, follow })
}
