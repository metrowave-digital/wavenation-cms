type EpisodeDoc = {
  airDate?: string
  duration?: string | number
  thumbnail?: string
  [key: string]: any
}

type RecalculateShowMetadataArgs = {
  showId: string
  req: {
    payload: {
      find: (args: any) => Promise<{ docs: EpisodeDoc[] }>
      update: (args: any) => Promise<any>
    }
  }
}

export const recalculateShowMetadata = async ({ showId, req }: RecalculateShowMetadataArgs) => {
  if (!showId) return

  const result = await req.payload.find({
    collection: 'episodes',
    where: { show: { equals: showId } },
    limit: 1000,
  })

  const docs: EpisodeDoc[] = result.docs

  const episodeCount = docs.length

  // -----------------------
  // Find latest episode by airDate
  // -----------------------
  const latest = docs
    .filter((e: EpisodeDoc) => e.airDate)
    .sort((a: EpisodeDoc, b: EpisodeDoc) => {
      const da = new Date(a.airDate ?? '').getTime()
      const db = new Date(b.airDate ?? '').getTime()
      return db - da
    })[0]

  // -----------------------
  // Compute total duration safely
  // -----------------------
  const totalDuration = docs.reduce((sum: number, ep: EpisodeDoc) => {
    const dur = Number(ep.duration || 0)
    return sum + (isNaN(dur) ? 0 : dur)
  }, 0)

  // -----------------------
  // Update SHOW record
  // -----------------------
  await req.payload.update({
    collection: 'shows',
    id: showId,
    data: {
      episodeCount,
      latestEpisodeAirDate: latest?.airDate || null,
      totalEpisodeDuration: totalDuration,
      featuredImage: latest?.thumbnail || null,
      lastUpdated: new Date().toISOString(),
    },
  })
}
