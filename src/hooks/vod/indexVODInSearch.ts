// src/hooks/vod/indexVODInSearch.ts
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const INDEX_COLLECTION = 'search-index'

export const indexVODInSearchAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  const isDraft = doc.status !== 'published'

  const existing = await req.payload.find({
    collection: INDEX_COLLECTION,
    limit: 1,
    where: {
      and: [{ collection: { equals: 'vod' } }, { itemId: { equals: doc.id } }],
    },
  })

  const record = {
    collection: 'vod',
    itemId: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    tags: doc.tags ?? [],
    genre: doc.genre ?? [],
    status: doc.status,
    featured: doc.featured,
    trending: doc.trending,
    recommended: doc.recommended,
    searchType: 'vod',
  }

  // -----------------
  // UPDATE EXISTING
  // -----------------
  if (existing.docs[0]) {
    const updateOptions: any = {
      collection: INDEX_COLLECTION,
      id: existing.docs[0].id,
      data: record,
    }
    if (isDraft) updateOptions.draft = true

    await req.payload.update(updateOptions)
    return doc
  }

  // -----------------
  // CREATE NEW ENTRY
  // -----------------
  const createOptions: any = {
    collection: INDEX_COLLECTION,
    data: record,
  }
  if (isDraft) createOptions.draft = true

  await req.payload.create(createOptions)

  return doc
}

export const indexVODInSearchAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await req.payload.delete({
    collection: INDEX_COLLECTION,
    where: {
      and: [{ collection: { equals: 'vod' } }, { itemId: { equals: doc.id } }],
    },
  })

  return doc
}
