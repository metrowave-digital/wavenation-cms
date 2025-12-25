import type { CollectionBeforeChangeHook } from 'payload'
import { Roles } from '@/access/roles'

export const enforceWorkflow: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!data) return data

  // Require authenticated user for workflow changes
  if (!req?.user) {
    throw new Error('Authentication is required to change article workflow.')
  }

  const roles = Array.isArray(req.user.roles) ? req.user.roles : []

  const isPublisher =
    roles.includes(Roles.SYSTEM) ||
    roles.includes(Roles.SUPER_ADMIN) ||
    roles.includes(Roles.ADMIN) ||
    roles.includes(Roles.STAFF) ||
    roles.includes(Roles.EDITOR)

  const prevStatus = originalDoc?.status ?? 'draft'

  // Normalize next status FIRST
  const nextStatus = data.status ?? prevStatus
  data.status = nextStatus

  /* ---------------------------------------------------------
     PUBLISH / SCHEDULE GATE
  --------------------------------------------------------- */

  if ((nextStatus === 'published' || nextStatus === 'scheduled') && !isPublisher) {
    throw new Error('Only editorial staff may publish or schedule articles.')
  }

  /* ---------------------------------------------------------
     SCHEDULING RULE
  --------------------------------------------------------- */

  if (nextStatus === 'scheduled' && !data.scheduledPublishDate) {
    throw new Error('Scheduled articles must have a Scheduled Publish Date.')
  }

  /* ---------------------------------------------------------
     UNPUBLISHING (EDITORIAL DECISION)
     Allowed for publishers
  --------------------------------------------------------- */

  if (prevStatus === 'published' && nextStatus !== 'published' && isPublisher) {
    // Allowed — handled as an editorial action
    return data
  }

  return data
}
