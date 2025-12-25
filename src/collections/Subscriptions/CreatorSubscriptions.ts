import type { CollectionConfig, Access } from 'payload'
import { isAdmin, isStaffAccess, hasRoleAtOrAbove } from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS (TYPE-SAFE)
============================================================ */

/**
 * Read:
 * - Subscriber (fan)
 * - Creator
 * - Staff / Admin
 * Row filtering handled at query level
 */
const canReadCreatorSubscriptions: Access = ({ req }) => Boolean(req?.user)

/**
 * Create:
 * - Logged-in users only
 * (Stripe / checkout flow)
 */
const canCreateCreatorSubscription: Access = ({ req }) => Boolean(req?.user)

/**
 * Update:
 * - Staff / Admin only
 * (prevents tampering with status, tier, Stripe IDs)
 */
const canUpdateCreatorSubscription: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Delete:
 * - Admin only
 * (soft cancel preferred)
 */
const canDeleteCreatorSubscription: Access = ({ req }) => Boolean(isAdmin({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorSubscriptions: CollectionConfig = {
  slug: 'creator-subscriptions',

  admin: {
    useAsTitle: 'id',
    group: 'Creator Economy',
    defaultColumns: ['subscriber', 'creator', 'tier', 'status'],
  },

  access: {
    read: canReadCreatorSubscriptions,
    create: canCreateCreatorSubscription,
    update: canUpdateCreatorSubscription,
    delete: canDeleteCreatorSubscription,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       RELATIONSHIPS
    -------------------------------------------------------- */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'creator-tiers',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       STATUS & LIFECYCLE
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
      ],
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'endDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       BILLING (STRIPE SAFE)
    -------------------------------------------------------- */
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'renewalAttempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },

    /* --------------------------------------------------------
       METADATA / ENTITLEMENTS
    -------------------------------------------------------- */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Internal flags, entitlement cache, analytics',
      },
    },
  ],
}
