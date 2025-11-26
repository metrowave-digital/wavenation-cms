import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const audioTypes = ['tracks', 'episodes', 'podcast-episodes', 'music', 'shows']

  const { docs } = await payload.find({
    collection: 'playback-progress' as any,
    limit: 100,
    sort: '-updatedAt',
    where: {
      user: { equals: Number(userId) },
      progress: { less_than: 95 },
      completedAt: { exists: false },
      itemType: { in: audioTypes },
    },
  })

  // ------------------------------
  // GROUP BY PODCAST / SHOW / ARTIST
  // ------------------------------
  const grouped: Record<string, any[]> = {}

  for (const entry of docs) {
    try {
      const media = await payload.findByID({
        collection: entry.itemType as any,
        id: entry.itemId,
      })

      const groupName =
        media.show?.title || media.showTitle || media.podcastTitle || media.artist || 'Other'

      if (!grouped[groupName]) grouped[groupName] = []

      grouped[groupName].push({
        ...entry,
        media,
      })
    } catch {
      continue
    }
  }

  // ------------------------------
  // NEXT EPISODE LOOKUP INSIDE GET
  // ------------------------------
  for (const [groupName, entries] of Object.entries(grouped)) {
    for (const item of entries) {
      const media = item.media

      // episodic only
      if (!media.episodeNumber || !media.show) continue

      const nextEpisodeNumber = media.episodeNumber + 1

      const next = await payload.find({
        collection: media.show.relationTo ?? 'episodes',
        limit: 1,
        where: {
          episodeNumber: { equals: nextEpisodeNumber },
          show: { equals: media.show.id },
        },
      })

      if (next.docs.length) {
        item.nextEpisode = next.docs[0]
      }
    }
  }

  return NextResponse.json({ groups: grouped })
}
