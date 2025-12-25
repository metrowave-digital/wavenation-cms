import type { Payload } from 'payload'

/**
 * Process queued moderation jobs for Articles.
 * - Finds articles with moderationStatus === 'queued'
 * - Runs moderation job
 * - Updates moderation fields + log
 *
 * NOTE:
 * This script intentionally hard-types collection to 'articles'
 * to satisfy Payload v3 CollectionSlug typing and to avoid union doc typing.
 */

type ArticleModerationStatus = 'unscanned' | 'queued' | 'scanned' | 'flagged' | 'error'

type ModerationLogEntry = {
  at?: string | null
  by?: number | null
  action?: string | null
  score?: number | null
  isToxic?: boolean | null
  message?: string | null
}

/* ------------------------------------------------------------
   Placeholder moderation scan — replace with real AI later
------------------------------------------------------------ */
async function runModerationScan(
  text: string,
): Promise<{ score: number; isToxic: boolean; message: string }> {
  // TODO: integrate OpenAI / Perspective / internal moderation
  return { score: 0, isToxic: false, message: 'Content passed automated moderation.' }
}

/* ------------------------------------------------------------
   Extract text for moderation (simple + safe)
------------------------------------------------------------ */
function buildModerationText(article: any): string {
  let text = ''

  if (typeof article?.title === 'string') text += ` ${article.title}`
  if (Array.isArray(article?.contentBlocks)) text += ` ${JSON.stringify(article.contentBlocks)}`
  if (typeof article?.subtitle === 'string') text += ` ${article.subtitle}`
  if (typeof article?.editorialNotes === 'string') text += ` ${article.editorialNotes}`

  return text.trim()
}

/* ------------------------------------------------------------
   Main processor
------------------------------------------------------------ */
export async function processModerationJobs(payload: Payload, limit = 25) {
  // ✅ Hard-typed collection slug (fixes "string is not assignable to CollectionSlug")
  const collection = 'articles' as const

  const results = await payload.find({
    collection,
    limit,
    where: {
      moderationStatus: { equals: 'queued' as ArticleModerationStatus },
    },
    sort: '-updatedAt',
  })

  for (const doc of results.docs) {
    // doc is now typed as Article (collection-specific), not union(User|...)
    const moderationText = buildModerationText(doc)

    try {
      const { score, isToxic, message } = await runModerationScan(moderationText)

      const prevLog = Array.isArray((doc as any).moderationLog)
        ? ((doc as any).moderationLog as ModerationLogEntry[])
        : []

      const nextLog: ModerationLogEntry[] = [
        ...prevLog,
        {
          at: new Date().toISOString(),
          by: null, // system job
          action: isToxic ? 'flagged' : 'scanned',
          score,
          isToxic,
          message,
        },
      ]

      await payload.update({
        collection,
        id: doc.id,
        data: {
          toxicityScore: score,
          isToxic,
          moderationStatus: (isToxic ? 'flagged' : 'scanned') as ArticleModerationStatus,
          moderationLog: nextLog,

          // Optional: auto-flag → needs-correction
          ...(isToxic ? { status: 'needs-correction' } : {}),
        },
      })
    } catch (err) {
      const prevLog = Array.isArray((doc as any).moderationLog)
        ? ((doc as any).moderationLog as ModerationLogEntry[])
        : []

      const nextLog: ModerationLogEntry[] = [
        ...prevLog,
        {
          at: new Date().toISOString(),
          by: null,
          action: 'error',
          message: err instanceof Error ? err.message : 'Unknown moderation error',
        },
      ]

      await payload.update({
        collection,
        id: doc.id,
        data: {
          moderationStatus: 'error' as ArticleModerationStatus,
          moderationLog: nextLog,
        },
      })
    }
  }

  return {
    processed: results.docs.length,
    totalQueued: results.totalDocs,
  }
}
