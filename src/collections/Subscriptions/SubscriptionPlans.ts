import type { CollectionConfig, Access } from 'payload'
import { isPublic, isAdmin, isStaffAccess, isAdminField } from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read:
 * - Public: active plans only (API-locked)
 * - Staff/Admin: all plans
 */
const canReadPlans: Access = ({ req }) => {
  if (req?.user && (isAdmin({ req }) || isStaffAccess({ req }))) return true

  // Public / frontend
  return {
    status: { equals: 'active' },
  }
}

/**
 * Create / Update:
 * - Staff or Admin only
 */
const staffOnly: Access = ({ req }) =>
  Boolean(req?.user && (isAdmin({ req }) || isStaffAccess({ req })))

/**
 * Delete:
 * - Admin only (prefer archive)
 */
const adminOnly: Access = ({ req }) => Boolean(isAdmin({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'name',
    defaultColumns: ['name', 'interval', 'price', 'status'],
  },

  access: {
    read: canReadPlans,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE IDENTITY
    -------------------------------------------------------- */
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Used for routing and entitlement lookup',
      },
    },

    /* --------------------------------------------------------
       BILLING STRUCTURE
    -------------------------------------------------------- */
    {
      name: 'interval',
      type: 'select',
      required: true,
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
      ],
    },

    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Display price (not authoritative billing source)',
      },
    },

    /* --------------------------------------------------------
       PLAN VISIBILITY
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden (direct only)', value: 'hidden' },
        { label: 'Archived (legacy)', value: 'archived' },
      ],
      access: {
        update: isAdminField,
      },
    },

    /* --------------------------------------------------------
       BENEFITS (UI DISPLAY)
    -------------------------------------------------------- */
    {
      name: 'benefits',
      type: 'array',
      admin: {
        description: 'Shown on pricing & upgrade screens',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },

    /* --------------------------------------------------------
       ENTITLEMENTS (FUTURE SAFE)
       Used by feature gating & roles
    -------------------------------------------------------- */
    {
      name: 'entitlements',
      type: 'array',
      admin: {
        description: 'Feature flags unlocked by this plan (e.g. plus_video, uploads, host_tools)',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
      ],
    },

    /* --------------------------------------------------------
       STRIPE (ADMIN ONLY)
    -------------------------------------------------------- */
    {
      name: 'stripeProductId',
      type: 'text',
      access: {
        read: isAdminField,
        update: isAdminField,
      },
    },

    {
      name: 'stripePriceId',
      type: 'text',
      access: {
        read: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
