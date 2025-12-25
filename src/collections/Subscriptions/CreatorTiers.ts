import type { CollectionConfig, Access } from 'payload'
import {
  isAdmin,
  isStaffAccess,
  isAdminField,
  isLoggedIn,
  hasRoleAtOrAbove,
} from '@/access/control'
import { Roles } from '@/access/roles'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read:
 * - Public: active tiers only
 * - Creator: their own tiers
 * - Staff/Admin: all
 */
const canReadCreatorTiers: Access = ({ req }) => {
  // Admin / Staff → full read
  if (req?.user && (isAdmin({ req }) || isStaffAccess({ req }))) {
    return true
  }

  // Logged-in users → allow read (filtering handled elsewhere)
  if (req?.user) {
    return true
  }

  // Public users → allow read (filtering handled by query)
  return true
}

/**
 * Create:
 * - Creator or above
 */
const canCreateTier: Access = ({ req }) =>
  Boolean(req?.user && hasRoleAtOrAbove(req, Roles.CREATOR))

/**
 * Update:
 * - Owner (creator)
 * - Staff/Admin
 */
const canUpdateTier: Access = ({ req }) => {
  if (!req?.user) return false
  if (isAdmin({ req }) || isStaffAccess({ req })) return true

  return {
    creator: { equals: req.user.id },
  }
}

/**
 * Delete:
 * - Admin only (archive preferred)
 */
const canDeleteTier: Access = ({ req }) => Boolean(isAdmin({ req }))

/* ============================================================
   COLLECTION
============================================================ */

export const CreatorTiers: CollectionConfig = {
  slug: 'creator-tiers',

  admin: {
    useAsTitle: 'name',
    group: 'Creator Economy',
    defaultColumns: ['name', 'creator', 'price', 'billingInterval', 'status'],
  },

  access: {
    read: canReadCreatorTiers,
    create: canCreateTier,
    update: canUpdateTier,
    delete: canDeleteTier,
  },

  timestamps: true,

  fields: [
    /* --------------------------------------------------------
       CREATOR OWNERSHIP
    -------------------------------------------------------- */
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      access: {
        update: isAdminField, // prevent tier hijacking
      },
    },

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
        description: 'Public URL identifier',
      },
    },

    /* --------------------------------------------------------
       VISIBILITY
    -------------------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden (direct link)', value: 'hidden' },
        { label: 'Archived (legacy)', value: 'archived' },
      ],
      access: {
        update: isAdminField,
      },
    },

    /* --------------------------------------------------------
       PRICING (CREATOR-SAFE)
    -------------------------------------------------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'USD',
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'billingInterval',
      type: 'select',
      required: true,
      defaultValue: 'monthly',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
      ],
    },

    /* --------------------------------------------------------
       DESCRIPTION & BENEFITS
    -------------------------------------------------------- */
    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'benefits',
      type: 'relationship',
      relationTo: 'creator-tier-benefits',
      hasMany: true,
    },

    {
      name: 'mediaPreview',
      type: 'upload',
      relationTo: 'media',
    },

    /* --------------------------------------------------------
       BILLING / STRIPE CONNECT (ADMIN ONLY)
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

    /* --------------------------------------------------------
       METADATA / EXTENSIBILITY
    -------------------------------------------------------- */
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Internal flags, analytics tags, experiments',
      },
    },
  ],
}
