// src/collections/Profiles/profile.creator.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only update
 * Used for monetization, subscriptions, payouts, metrics
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * Profile owner OR Admin (read-only visibility)
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
   CREATOR / MONETIZATION FIELDS
============================================================ */

export const profileCreatorFields: Field[] = [
  /* ----------------------------------------------------------
     CREATOR CHANNELS (ADMIN-CONTROLLED)
  ---------------------------------------------------------- */
  {
    name: 'creatorChannels',
    type: 'relationship',
    relationTo: 'creator-channels',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Channels owned or managed by this creator.',
    },
  },

  /* ----------------------------------------------------------
     CREATOR TIERS (ADMIN-CONTROLLED)
  ---------------------------------------------------------- */
  {
    name: 'creatorTiers',
    type: 'relationship',
    relationTo: 'creator-tiers',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      condition: (data: Record<string, any>) => Boolean(data?.isCreator),
      description: 'Subscription tiers offered by this creator.',
    },
  },

  /* ----------------------------------------------------------
     CREATOR SUBSCRIPTIONS (SYSTEM / READ-ONLY)
  ---------------------------------------------------------- */
  {
    name: 'creatorSubscriptions',
    type: 'relationship',
    relationTo: 'creator-subscriptions',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Active subscribers to this creator.',
    },
  },

  /* ----------------------------------------------------------
     CONTENT SUBSCRIPTIONS (OWNER VISIBLE)
  ---------------------------------------------------------- */
  {
    name: 'contentSubscriptions',
    type: 'relationship',
    relationTo: 'content-subscriptions',
    hasMany: true,
    access: {
      read: selfOrAdminRead,
      update: adminOnlyField,
    },
    admin: {
      description: 'Content subscriptions held by this profile.',
    },
  },

  /* ----------------------------------------------------------
     WAVENATION PLUS STATUS (ADMIN CONTROLLED)
  ---------------------------------------------------------- */
  {
    name: 'wavenationPlusStatus',
    type: 'select',
    defaultValue: 'none',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'WaveNation Plus subscription state.',
    },
    options: [
      { label: 'No Subscription', value: 'none' },
      { label: 'Active', value: 'active' },
      { label: 'Past Due', value: 'past_due' },
      { label: 'Canceled', value: 'canceled' },
    ],
  },

  {
    name: 'wavenationPlusPlan',
    type: 'relationship',
    relationTo: 'subscription-plans',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'Assigned WaveNation Plus plan.',
    },
  },

  /* ----------------------------------------------------------
     CREATOR METRICS (READ-ONLY)
  ---------------------------------------------------------- */
  {
    type: 'row',
    fields: [
      {
        name: 'totalFollowers',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
      {
        name: 'totalMonthlyListeners',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
      {
        name: 'totalEarnings',
        type: 'number',
        defaultValue: 0,
        admin: { readOnly: true },
        access: { update: () => false },
      },
    ],
  },

  /* ----------------------------------------------------------
     EARNINGS & PAYOUTS (ADMIN ONLY)
  ---------------------------------------------------------- */
  {
    name: 'creatorEarnings',
    type: 'relationship',
    relationTo: 'creator-earnings',
    hasMany: true,
    access: {
      read: adminOnlyField,
      update: adminOnlyField,
    },
    admin: {
      condition: (data: Record<string, any>) => Boolean(data?.isCreator),
      description: 'Earnings ledger for this creator.',
    },
  },

  {
    name: 'creatorPayouts',
    type: 'relationship',
    relationTo: 'creator-payouts',
    hasMany: true,
    access: {
      read: adminOnlyField,
      update: adminOnlyField,
    },
    admin: {
      condition: (data: Record<string, any>) => Boolean(data?.isCreator),
      description: 'Payout history for this creator.',
    },
  },
]
