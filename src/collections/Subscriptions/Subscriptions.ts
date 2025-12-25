import type { CollectionConfig, Access } from 'payload'
import { isLoggedIn, isAdmin, isStaffAccess, isAdminField } from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read rules:
 * - Admin / Staff: all subscriptions
 * - Logged-in user: only their own subscription
 */
const canReadSubscription: Access = ({ req }) => {
  if (!req?.user) return false

  // Admin / Staff see everything
  if (isAdmin({ req }) || isStaffAccess({ req })) return true

  // User sees only their own
  return {
    user: { equals: req.user.id },
  }
}

/**
 * Create:
 * - Logged-in users only
 * - (Stripe webhooks should use overrideAccess)
 */
const canCreateSubscription: Access = ({ req }) => Boolean(req?.user)

/**
 * Update:
 * - Admin / Staff only
 * - Prevents users from tampering with status / Stripe IDs
 */
const canUpdateSubscription: Access = ({ req }) =>
  Boolean(isAdmin({ req }) || isStaffAccess({ req }))

/**
 * Delete:
 * - Admin only (soft-cancel preferred)
 */
const canDeleteSubscription: Access = ({ req }) => Boolean(isAdmin({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',

  admin: {
    group: 'Subscriptions',
    useAsTitle: 'id',
    defaultColumns: ['user', 'plan', 'status', 'startDate', 'endDate'],
  },

  access: {
    read: canReadSubscription,
    create: canCreateSubscription,
    update: canUpdateSubscription,
    delete: canDeleteSubscription,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CORE RELATIONSHIPS
    -------------------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: {
        update: isAdminField, // prevent reassignment
      },
    },

    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'subscription-plans',
      required: true,
      access: {
        update: isAdminField,
      },
    },

    /* --------------------------------------------------------
       STATUS & LIFECYCLE
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'trialing', 'past_due', 'paused', 'canceled', 'expired'].map((v) => ({
        label: v,
        value: v,
      })),
      access: {
        update: isAdminField,
      },
    },

    {
      name: 'startDate',
      type: 'date',
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
      name: 'stripeCustomerId',
      type: 'text',
      access: {
        read: isAdminField,
        update: isAdminField,
      },
    },

    {
      name: 'stripeSubscriptionId',
      type: 'text',
      access: {
        read: isAdminField,
        update: isAdminField,
      },
    },

    {
      name: 'renewalAttempts',
      type: 'number',
      defaultValue: 0,
      access: {
        update: isAdminField,
      },
    },

    /* --------------------------------------------------------
       METADATA / FLAGS
    -------------------------------------------------------- */
    {
      name: 'autoRenew',
      type: 'checkbox',
      defaultValue: true,
      access: {
        update: isAdminField,
      },
    },

    {
      name: 'canceledAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
