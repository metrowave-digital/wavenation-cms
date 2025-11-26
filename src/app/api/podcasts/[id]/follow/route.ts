import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Convert string → number
  const podcastIdNum = Number(params.id)
  if (Number.isNaN(podcastIdNum)) {
    return NextResponse.json({ error: 'Invalid podcast id' }, { status: 400 })
  }

  // Look for existing follow
  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      kind: { equals: 'podcast' },
      'target.value': { equals: podcastIdNum },
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
      kind: 'podcast',
      target: {
        relationTo: 'podcasts',
        value: podcastIdNum,
      },
    },
  })

  // Load podcast
  const podcast = await payload.findByID({
    collection: 'podcasts',
    id: podcastIdNum,
  })

  // Determine notification recipient
  let ownerId: number | undefined

  if (podcast.primaryHost) {
    // It might be an ID or an object
    ownerId = typeof podcast.primaryHost === 'object' ? podcast.primaryHost.id : podcast.primaryHost
  }

  // Create notification
  if (ownerId && ownerId !== user.id) {
    await payload.create({
      collection: 'notifications',
      data: {
        user: ownerId, // must be number
        actor: user.id, // number
        type: 'follow',
        target: {
          relationTo: 'podcasts',
          value: podcastIdNum, // must be number
        },
      },
    })
  }

  return NextResponse.json({ success: true, follow })
}
