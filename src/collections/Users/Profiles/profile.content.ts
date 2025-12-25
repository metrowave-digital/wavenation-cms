// src/collections/Profiles/profile.content.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * (system-managed content graphs)
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
   PROFILE CONTENT FIELDS (SYSTEM MANAGED)
============================================================ */

export const profileContentFields: Field[] = [
  /* ----------------------------------------------------------
     SAVED CONTENT (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'savedContent',
    type: 'relationship',
    hasMany: true,
    relationTo: ['tracks', 'albums', 'episodes', 'shows', 'podcasts', 'films', 'vod', 'articles'],
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Content saved by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     LIKED CONTENT (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'likedContent',
    type: 'relationship',
    hasMany: true,
    relationTo: [
      'tracks',
      'albums',
      'episodes',
      'shows',
      'podcasts',
      'films',
      'vod',
      'articles',
      'charts',
    ],
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Content liked by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     FOLLOWED CHARTS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'followedCharts',
    type: 'relationship',
    relationTo: 'charts',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Charts followed by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     AUTHORED CONTENT (SYSTEM ATTACHED)
  ---------------------------------------------------------- */
  {
    name: 'reviewsAuthored',
    type: 'relationship',
    relationTo: 'reviews',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Reviews authored by this profile.',
      readOnly: true,
    },
  },

  {
    name: 'articlesAuthored',
    type: 'relationship',
    relationTo: 'articles',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Articles authored by this profile.',
      readOnly: true,
    },
  },

  /* ----------------------------------------------------------
     CONTENT METRICS (READ-ONLY, SYSTEM UPDATED)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'totalContentLikes',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
      {
        name: 'totalContentSaves',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
      {
        name: 'totalComments',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
    ],
  },
]
