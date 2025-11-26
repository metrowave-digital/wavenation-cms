// src/hooks/vod/syncVODSeasonsAndEpisodes.ts
import type { CollectionBeforeValidateHook } from 'payload'

export const syncVODSeasonsAndEpisodes: CollectionBeforeValidateHook = async (args) => {
  const { data, originalDoc, req } = args

  // Guard for optional data
  if (!data) return data

  const vod = data as any

  // Only care about episodes
  if (vod.type !== 'episode') return vod

  const seriesId = typeof vod.series === 'object' ? vod.series?.id : vod.series

  if (!seriesId) {
    // Episode with no parent series – allow or enforce depending on your rules
    return vod
  }

  // Ensure seasonNumber
  if (!vod.seasonNumber || vod.seasonNumber <= 0) {
    vod.seasonNumber = 1
  }

  // If no episodeNumber specified, auto-assign next available
  if (!vod.episodeNumber || vod.episodeNumber <= 0) {
    const existing = await req.payload.find({
      collection: 'vod',
      limit: 1,
      sort: '-episodeNumber', // highest first
      where: {
        and: [
          { type: { equals: 'episode' } },
          { series: { equals: seriesId } },
          { seasonNumber: { equals: vod.seasonNumber } },
        ],
      },
    })

    const lastEpisode = existing.docs[0] as any | undefined
    const nextEp = lastEpisode?.episodeNumber ? lastEpisode.episodeNumber + 1 : 1

    vod.episodeNumber = nextEp
  }

  // Enforce uniqueness: if conflict exists, bump episodeNumber
  const andConditions: any[] = [
    { type: { equals: 'episode' } },
    { series: { equals: seriesId } },
    { seasonNumber: { equals: vod.seasonNumber } },
    { episodeNumber: { equals: vod.episodeNumber } },
  ]

  if (originalDoc?.id) {
    andConditions.push({ id: { not_equals: originalDoc.id } })
  }

  const conflict = await req.payload.find({
    collection: 'vod',
    limit: 1,
    where: { and: andConditions },
  })

  if (conflict.docs[0]) {
    vod.episodeNumber = vod.episodeNumber + 1
  }

  return vod
}
