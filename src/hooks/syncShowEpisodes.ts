import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Unified handler that works for BOTH afterChange and afterDelete
export const syncShowEpisodes: CollectionAfterChangeHook & CollectionAfterDeleteHook = async (
  args,
) => {
  const { req } = args

  // Episode document always exists in afterChange
  // and is also included as `doc` in afterDelete
  const episode = args.doc

  if (!episode) return args.doc

  const showID = episode.show
  if (!showID) return episode

  // Example metadata update
  await req.payload.update({
    collection: 'shows',
    id: showID,
    data: {
      updatedAt: new Date().toISOString(),
    },
  })

  return episode
}
