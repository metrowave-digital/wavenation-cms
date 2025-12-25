// src/collections/Profiles/profile.system.ts

import type { Field, FieldAccess } from 'payload'
import { isAdminRole } from '@/access/control'
import { seoFields } from '../../../fields/seo'

/* ============================================================
   FIELD ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Admin-only system fields
 */
const adminOnlyField: FieldAccess = ({ req }): boolean => Boolean(req?.user && isAdminRole(req))

/**
 * System-only (non-editable)
 */
const systemOnlyField: FieldAccess = () => false

/* ============================================================
   PROFILE SYSTEM / GOVERNANCE FIELDS
============================================================ */

export const profileSystemFields: Field[] = [
  /* ==========================================================
     USER LINKAGE (IMMUTABLE)
  ========================================================== */
  {
    name: 'user',
    type: 'relationship',
    relationTo: 'users',
    access: {
      update: systemOnlyField,
    },
    admin: {
      description: 'Linked user account (immutable).',
      readOnly: true,
    },
  },

  /* ==========================================================
     GROUPS / PERMISSIONS (ADMIN CONTROLLED)
  ========================================================== */
  {
    name: 'groups',
    type: 'relationship',
    relationTo: 'groups',
    hasMany: true,
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'Internal groups used for moderation, access, or segmentation.',
    },
  },

  /* ==========================================================
     VERIFICATION & TRUST SIGNALS
     (YouTube / Spotify style)
  ========================================================== */
  {
    name: 'verification',
    type: 'group',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'Verification and trust signals for this profile.',
    },
    fields: [
      {
        name: 'isVerified',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'verificationType',
        type: 'select',
        options: [
          { label: 'Identity Verified', value: 'identity' },
          { label: 'Creator Verified', value: 'creator' },
          { label: 'Industry / Brand', value: 'industry' },
        ],
      },
      {
        name: 'verifiedAt',
        type: 'date',
      },
    ],
  },

  /* ==========================================================
     MODERATION & SAFETY FLAGS
  ========================================================== */
  {
    name: 'moderation',
    type: 'group',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'Moderation status and enforcement flags.',
    },
    fields: [
      {
        name: 'status',
        type: 'select',
        defaultValue: 'active',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Limited', value: 'limited' },
          { label: 'Suspended', value: 'suspended' },
          { label: 'Banned', value: 'banned' },
        ],
      },
      {
        name: 'reason',
        type: 'textarea',
        admin: {
          description: 'Internal moderation reason.',
        },
      },
      {
        name: 'expiresAt',
        type: 'date',
        admin: {
          description: 'Optional expiration for temporary actions.',
        },
      },
    ],
  },

  /* ==========================================================
     TRUST / REPUTATION SCORE (SYSTEM UPDATED)
  ========================================================== */
  {
    name: 'trustSignals',
    type: 'group',
    access: {
      update: systemOnlyField,
    },
    admin: {
      description: 'System-generated reputation and trust signals.',
      readOnly: true,
    },
    fields: [
      {
        name: 'trustScore',
        type: 'number',
        defaultValue: 100,
        admin: {
          description: 'Composite trust score (0–100).',
        },
      },
      {
        name: 'flagsCount',
        type: 'number',
        defaultValue: 0,
      },
      {
        name: 'lastFlagAt',
        type: 'date',
      },
    ],
  },

  /* ==========================================================
     SEO (ADMIN MANAGED)
  ========================================================== */
  {
    label: 'SEO',
    type: 'group',
    access: {
      update: adminOnlyField,
    },
    fields: [seoFields],
  },

  /* ==========================================================
     AUDIT METADATA (IMMUTABLE)
  ========================================================== */
  {
    type: 'row',
    fields: [
      {
        name: 'createdBy',
        type: 'relationship',
        relationTo: 'users',
        admin: { readOnly: true },
        access: { update: systemOnlyField },
      },
      {
        name: 'updatedBy',
        type: 'relationship',
        relationTo: 'users',
        admin: { readOnly: true },
        access: { update: systemOnlyField },
      },
    ],
  },

  /* ==========================================================
     INTERNAL NOTES (ADMIN ONLY)
  ========================================================== */
  {
    name: 'internalNotes',
    type: 'textarea',
    access: {
      update: adminOnlyField,
    },
    admin: {
      description: 'Internal notes for staff and moderators.',
    },
  },
]
