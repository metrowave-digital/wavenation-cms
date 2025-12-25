// src/collections/Profiles/profile.social.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * (system-managed social graphs)
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
   SOCIAL GRAPH FIELDS (SYSTEM MANAGED)
============================================================ */

export const profileSocialFields: Field[] = [
  /* ----------------------------------------------------------
     FOLLOWERS / FOLLOWING (READ-ONLY, SYSTEM UPDATED)
  ---------------------------------------------------------- */
  {
    name: 'followers',
    type: 'relationship',
    relationTo: 'profiles',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Profiles following this profile.',
      readOnly: true,
    },
  },

  {
    name: 'following',
    type: 'relationship',
    relationTo: 'profiles',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Profiles this profile follows.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     FOLLOWED CHANNELS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'followingChannels',
    type: 'relationship',
    relationTo: 'creator-channels',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Creator channels this profile follows.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     BLOCKING (OWNER-CONTROLLED VIA API)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'blockedUsers',
        type: 'relationship',
        relationTo: 'profiles',
        hasMany: true,
        access: {
          read: selfOrAdminRead,
          update: adminOnlyField,
        },
        admin: {
          description: 'Profiles blocked by this user.',
          readOnly: true,
        },
      },
      {
        name: 'blockedBy',
        type: 'relationship',
        relationTo: 'profiles',
        hasMany: true,
        access: {
          read: adminOnlyField,
          update: adminOnlyField,
        },
        admin: {
          description: 'Profiles that have blocked this user.',
          readOnly: true,
        },
      },
    ],
  },
]
