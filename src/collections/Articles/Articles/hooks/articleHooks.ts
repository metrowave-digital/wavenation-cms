import type { CollectionBeforeChangeHook } from 'payload'
import { isAdminBoolean, isStaffBoolean } from '@/access/control'

/* ============================================================
   STATUS PERMISSIONS
============================================================ */

const enforceStatusChangePermissions: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!originalDoc) return data

  // 🔑 ADMIN ALWAYS ALLOWED
  if (isAdminBoolean(req)) return data

  if (
    typeof data.status !== 'undefined' &&
    data.status !== originalDoc.status &&
    !isStaffBoolean(req)
  ) {
    throw new Error('Only staff or admins can change article status.')
  }

  return data
}

/* ============================================================
   BADGE PERMISSIONS
============================================================ */

const enforceBadgePermissions: CollectionBeforeChangeHook = ({ req, data, originalDoc }) => {
  if (!originalDoc) return data

  // 🔑 ADMIN ALWAYS ALLOWED
  if (isAdminBoolean(req)) return data

  if (
    Array.isArray(data.badges) &&
    JSON.stringify(data.badges) !== JSON.stringify(originalDoc.badges) &&
    !isStaffBoolean(req)
  ) {
    throw new Error('Only staff or admins can update article badges.')
  }

  return data
}

export const articleHooks = {
  beforeChange: [enforceStatusChangePermissions, enforceBadgePermissions],
}
