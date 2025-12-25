import type { CollectionBeforeChangeHook } from 'payload'

/* ============================================================
   SEARCH INDEX / READ MODEL BUILDER
============================================================ */

export const searchIndexHook: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  /* ---------------------------------------------------------
     DETERMINE VISIBILITY
     (Only published + non-toxic content is searchable)
  --------------------------------------------------------- */

  const status = data.status ?? originalDoc?.status
  const isPublished = status === 'published'

  const isToxic = typeof data.isToxic === 'boolean' ? data.isToxic : Boolean(originalDoc?.isToxic)

  const isSearchable = isPublished && !isToxic

  /* ---------------------------------------------------------
     BUILD READ MODEL (FRONTEND SAFE)
     This mirrors ArticleReadModel
  --------------------------------------------------------- */

  if (!isSearchable) {
    // Remove from search index but do NOT delete the document
    data.searchIndex = null
    return data
  }

  const readModel = {
    id: originalDoc?.id ?? data.id,
    title: data.title ?? originalDoc?.title,
    slug: data.slug ?? originalDoc?.slug,
    type: data.type ?? originalDoc?.type,
    status,
    publishedDate: data.publishedDate ?? originalDoc?.publishedDate ?? null,
    heroImage: data.heroImage ?? originalDoc?.heroImage ?? null,
    author: data.author ?? originalDoc?.author ?? null,
    readingTime:
      typeof data.readingTime === 'number' ? data.readingTime : (originalDoc?.readingTime ?? null),
  }

  /* ---------------------------------------------------------
     AVOID NO-OP WRITES
     (Prevents noisy versions)
  --------------------------------------------------------- */

  if (JSON.stringify(originalDoc?.searchIndex) === JSON.stringify(readModel)) {
    return data
  }

  data.searchIndex = readModel

  return data
}
