import type { CollectionBeforeChangeHook } from 'payload'
import { isAdminRole, isStaff } from '@/access/control'

/* ============================================================
   STATUS PERMISSIONS
============================================================ */

const enforceStatusChangePermissions: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!originalDoc || !data) return data

  // 🔑 ADMIN ALWAYS ALLOWED
  if (req && isAdminRole(req)) return data

  // Status changed?
  if (typeof data.status !== 'undefined' && data.status !== originalDoc.status) {
    const staffAllowed = Boolean(req && isStaff({ req }))

    if (!staffAllowed) {
      throw new Error('Only staff or admins can change article status.')
    }
  }

  return data
}

/* ============================================================
   BADGE PERMISSIONS
============================================================ */

const enforceBadgePermissions: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!originalDoc || !data) return data

  // 🔑 ADMIN ALWAYS ALLOWED
  if (req && isAdminRole(req)) return data

  // Badges changed?
  if (
    Array.isArray(data.badges) &&
    JSON.stringify(data.badges) !== JSON.stringify(originalDoc.badges)
  ) {
    const staffAllowed = Boolean(req && isStaff({ req }))

    if (!staffAllowed) {
      throw new Error('Only staff or admins can update article badges.')
    }
  }

  return data
}

/* ============================================================
   EXPORT
============================================================ */

export const articleHooks = {
  beforeChange: [enforceStatusChangePermissions, enforceBadgePermissions],
}
