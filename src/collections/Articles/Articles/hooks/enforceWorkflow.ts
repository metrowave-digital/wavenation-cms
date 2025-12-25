import type { CollectionBeforeChangeHook } from 'payload'
import { Roles } from '@/access/roles'

/* ============================================================
   NON-BLOCKING PUBLISH NOTIFICATION (LOCAL STUB)
   Replace later with Slack / Email service
============================================================ */

const notifyPublish = async (article: { id?: string; title?: string; publishedDate?: string }) => {
  // Never throw from here
  console.log('[WORKFLOW] Article published:', {
    id: article.id,
    title: article.title,
    publishedDate: article.publishedDate,
  })
}

/* ============================================================
   WORKFLOW STATE MACHINE
============================================================ */

const WORKFLOW_TRANSITIONS: Record<string, string[]> = {
  draft: ['review'],
  review: ['draft', 'needs-correction', 'scheduled'],
  'needs-correction': ['review'],
  scheduled: ['published', 'draft'],
  published: ['needs-correction'],
}

/* ============================================================
   WORKFLOW ENFORCEMENT HOOK
============================================================ */

export const enforceWorkflow: CollectionBeforeChangeHook = async ({ req, data, originalDoc }) => {
  if (!data) return data

  /* ---------------------------------------------------------
     AUTH REQUIRED
  --------------------------------------------------------- */

  if (!req?.user) {
    throw new Error('Authentication is required to change article workflow.')
  }

  const roles = Array.isArray(req.user.roles) ? req.user.roles : []

  const isPublisher =
    roles.includes(Roles.SYSTEM) ||
    roles.includes(Roles.SUPER_ADMIN) ||
    roles.includes(Roles.ADMIN) ||
    roles.includes(Roles.STAFF)

  const isEditor = isPublisher || roles.includes(Roles.EDITOR)

  /* ---------------------------------------------------------
     STATUS NORMALIZATION
  --------------------------------------------------------- */

  const prevStatus = originalDoc?.status ?? 'draft'
  const nextStatus = data.status ?? prevStatus
  data.status = nextStatus

  /* ---------------------------------------------------------
     STATE MACHINE VALIDATION
  --------------------------------------------------------- */

  if (prevStatus !== nextStatus) {
    const allowedTransitions = WORKFLOW_TRANSITIONS[prevStatus] || []

    if (!allowedTransitions.includes(nextStatus)) {
      throw new Error(`Invalid workflow transition: ${prevStatus} → ${nextStatus}`)
    }
  }

  /* ---------------------------------------------------------
     APPROVAL GATES
  --------------------------------------------------------- */

  // Only publishers may schedule or publish
  if ((nextStatus === 'scheduled' || nextStatus === 'published') && !isPublisher) {
    throw new Error('Only publishers may schedule or publish articles.')
  }

  // Only editors or higher may submit for review
  if (nextStatus === 'review' && !isEditor) {
    throw new Error('Only editors may submit articles for review.')
  }

  /* ---------------------------------------------------------
     SCHEDULING REQUIREMENT
  --------------------------------------------------------- */

  if (nextStatus === 'scheduled' && !data.scheduledPublishDate) {
    throw new Error('Scheduled articles must have a Scheduled Publish Date.')
  }

  /* ---------------------------------------------------------
     UNPUBLISH REASON REQUIRED
  --------------------------------------------------------- */

  if (prevStatus === 'published' && nextStatus !== 'published' && !data.unpublishReason) {
    throw new Error('An unpublish reason is required when removing published content.')
  }

  /* ---------------------------------------------------------
     WORKFLOW EVENT LOG (APPEND-ONLY)
  --------------------------------------------------------- */

  if (prevStatus !== nextStatus) {
    data.workflowLog = [
      ...(originalDoc?.workflowLog || []),
      {
        from: prevStatus,
        to: nextStatus,
        by: req.user.id,
        at: new Date().toISOString(),
        reason: data.unpublishReason || data.editorialNotes || null,
      },
    ]
  }

  /* ---------------------------------------------------------
     PUBLISH NOTIFICATION (NON-BLOCKING)
  --------------------------------------------------------- */

  if (prevStatus !== 'published' && nextStatus === 'published') {
    try {
      await notifyPublish({
        id: data.id,
        title: data.title,
        publishedDate: data.publishedDate,
      })
    } catch {
      // Never block save
    }
  }

  return data
}
