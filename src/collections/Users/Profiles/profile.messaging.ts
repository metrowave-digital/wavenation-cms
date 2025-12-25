// src/collections/Profiles/profile.messaging.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * (system-managed messaging graph)
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Profile owner OR Admin (read visibility)
 */
const selfOrAdminRead: FieldAccess = ({ req, siblingData }): boolean => {
  if (!req?.user) return false
  if (isAdminRole(req)) return true

  const profileId = siblingData?.id
  if (!profileId) return false

  const userProfile =
    typeof (req.user as any)?.profile === 'string'
      ? (req.user as any).profile
      : (req.user as any)?.profile?.id

  return Boolean(userProfile && String(profileId) === String(userProfile))
}

/* ============================================================
   MESSAGING / COMMUNICATION FIELDS (SYSTEM MANAGED)
============================================================ */

export const profileMessagingFields: Field[] = [
  /* ----------------------------------------------------------
     INBOXES (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'inbox',
    type: 'relationship',
    relationTo: 'inbox',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Inbox records associated with this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     MESSAGES (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'messages',
    type: 'relationship',
    relationTo: 'messages',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Messages authored or received by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     CHATS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'chats',
    type: 'relationship',
    relationTo: 'chats',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Chat threads this profile participates in.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     MENTIONS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'mentions',
    type: 'relationship',
    relationTo: 'mentions',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Mentions of this profile across the platform.',
      readOnly: true,
    },
  },
]
