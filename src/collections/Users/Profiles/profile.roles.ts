// src/collections/Profiles/profile.roles.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * Used for ALL role / tier / capability flags
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Admin OR profile owner (read-only guard still applies)
 * Used ONLY for relationship visibility, not mutation
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
   PROFILE ROLE / CAPABILITY FIELDS
============================================================ */

export const profileRoleFields: Field[] = [
  /* ----------------------------------------------------------
     ROLE FLAGS (ADMIN CONTROLLED)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'isHost',
        type: 'checkbox',
        defaultValue: false,
        admin: { width: '25%' },
        access: { update: adminOnlyField },
      },
      {
        name: 'isCreator',
        type: 'checkbox',
        defaultValue: false,
        admin: { width: '25%' },
        access: { update: adminOnlyField },
      },
      {
        name: 'isContributor',
        type: 'checkbox',
        defaultValue: false,
        admin: { width: '25%' },
        access: { update: adminOnlyField },
      },
      {
        name: 'isEditor',
        type: 'checkbox',
        defaultValue: false,
        admin: { width: '25%' },
        access: { update: adminOnlyField },
      },
    ],
  },

  /* ----------------------------------------------------------
     TIER / INDUSTRY STATUS (ADMIN CONTROLLED)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'tier',
        type: 'select',
        defaultValue: 'free',
        admin: {
          width: '50%',
          description: 'Profile tier for display, perks, and monetization (not auth).',
        },
        access: { update: adminOnlyField },
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Creator', value: 'creator' },
          { label: 'Pro', value: 'pro' },
          { label: 'Industry', value: 'industry' },
        ],
      },
      {
        name: 'industryTitle',
        type: 'text',
        admin: {
          width: '50%',
          description: 'Optional industry role or title.',
        },
        access: { update: adminOnlyField },
      },
    ],
  },

  /* ----------------------------------------------------------
     HOSTED SHOWS (READABLE BY OWNER / ADMIN)
  ---------------------------------------------------------- */
  {
    name: 'hostedShows',
    type: 'relationship',
    relationTo: 'shows',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Shows this profile hosts.',
      condition: (data: Record<string, any>) => Boolean(data?.isHost),
    },
  },

  /* ----------------------------------------------------------
     EDITORIAL ARTICLES (READABLE BY OWNER / ADMIN)
  ---------------------------------------------------------- */
  {
    name: 'editorialArticles',
    type: 'relationship',
    relationTo: 'articles',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Articles edited by this profile.',
      condition: (data: Record<string, any>) => Boolean(data?.isEditor),
    },
  },

  /* ----------------------------------------------------------
     EDITORIAL REVIEWS (READABLE BY OWNER / ADMIN)
  ---------------------------------------------------------- */
  {
    name: 'editorialReviews',
    type: 'relationship',
    relationTo: 'reviews',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Reviews authored by this profile.',
      condition: (data: Record<string, any>) => Boolean(data?.isEditor),
    },
  },
]
