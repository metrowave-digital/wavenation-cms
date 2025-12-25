// src/collections/Articles/Articles/jobs/ModerationJob.ts

import type { Payload } from 'payload'

/* ------------------------------------------------------------
   Moderation Job Payload
------------------------------------------------------------ */
export type ModerationJobInput = {
  articleId: string
  triggeredBy?: number | null // user id or null (system)
}

/* ------------------------------------------------------------
   Enqueue moderation job (DB-backed, queue-ready)
------------------------------------------------------------ */
export async function enqueueModerationJob(payload: Payload, input: ModerationJobInput) {
  const { articleId } = input

  await payload.update({
    collection: 'articles',
    id: articleId,
    data: {
      moderationStatus: 'queued',
      moderationLog: [
        {
          at: new Date().toISOString(),
          by: input.triggeredBy ?? null,
          action: 'queued',
          message: 'Article queued for moderation scan.',
        },
      ],
    },
  })
}
