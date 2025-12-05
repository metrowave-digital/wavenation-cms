import type { CollectionBeforeChangeHook } from 'payload'
import { Roles } from '@/access/roles'

export const enforceWorkflow: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!data) return data

  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []

  const isPublisher =
    roles.includes(Roles.SYSTEM) ||
    roles.includes(Roles.SUPER_ADMIN) ||
    roles.includes(Roles.ADMIN) ||
    roles.includes(Roles.STAFF) ||
    roles.includes(Roles.EDITOR)

  const nextStatus = data.status
  const prevStatus = originalDoc?.status

  // Only publisher-level roles may move to 'published' or 'scheduled'
  if ((nextStatus === 'published' || nextStatus === 'scheduled') && !isPublisher) {
    throw new Error('Only editorial staff may publish or schedule articles.')
  }

  // If scheduling, require a date
  if (nextStatus === 'scheduled' && !data.scheduledPublishDate) {
    throw new Error('Scheduled articles must have a Scheduled Publish Date.')
  }

  // Default status if none provided
  if (!data.status) {
    data.status = prevStatus ?? 'draft'
  }

  // Simple state sanity: if previously published, keep it published
  if (prevStatus === 'published' && nextStatus !== 'published' && isPublisher) {
    // This is allowed but treated as an editorial choice (e.g., unpublishing)
    return data
  }

  return data
}
