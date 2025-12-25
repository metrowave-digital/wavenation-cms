import type { CollectionBeforeChangeHook } from 'payload'

export const rollbackFromVersion: CollectionBeforeChangeHook = async ({ req, data }) => {
  if (!req?.payload) return data
  if (!data || typeof data !== 'object') return data

  const rollback = (data as any).rollback
  const sourceVersionId =
    rollback && typeof rollback.sourceVersionId === 'string' ? rollback.sourceVersionId : null

  if (!sourceVersionId) return data

  /* ------------------------------------------------
     LOAD VERSION SNAPSHOT (PAYLOAD-NATIVE)
  ------------------------------------------------- */
  const versions = await req.payload.findVersions({
    collection: 'articles',
    where: {
      id: { equals: sourceVersionId },
    },
    limit: 1,
  })

  const versionDoc = versions?.docs?.[0]

  if (!versionDoc || !('version' in versionDoc)) {
    throw new Error('Invalid article version selected for rollback.')
  }

  /* ------------------------------------------------
     SAFE SNAPSHOT NORMALIZATION
     (Required by TypeScript)
  ------------------------------------------------- */
  const snapshot = versionDoc.version as unknown as Record<string, unknown>

  /* ------------------------------------------------
     PROTECT SYSTEM FIELDS
  ------------------------------------------------- */
  const PROTECTED_FIELDS = [
    'id',
    'slug',
    'createdAt',
    'updatedAt',
    'rollback',
    'moderationLog',
    'moderationStatus',
  ]

  for (const field of PROTECTED_FIELDS) {
    delete snapshot[field]
  }

  /* ------------------------------------------------
     APPLY ROLLBACK METADATA
  ------------------------------------------------- */
  snapshot.rollback = {
    sourceVersionId,
    rollbackReason: rollback?.rollbackReason ?? 'Rolled back to previous version',
    rolledBackAt: new Date().toISOString(),
  }

  // Prevent infinite rollback loops
  delete (snapshot.rollback as any)?.sourceVersionId

  return snapshot
}
