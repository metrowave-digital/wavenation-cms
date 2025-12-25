import type { CollectionConfig, FieldAccess, Access } from 'payload'

import { apiLockedRead, hasRole, isAdminRole } from '@/access/control'

import { Roles, AdsRoles } from '@/access/roles'
import type { Role } from '@/access/roles'

/* ============================================================
   OVERRIDE ROLE SET (FIELD SAFE)
============================================================ */

const ADS_OVERRIDE_ROLES: Role[] = [
  // Core admin / editorial
  Roles.SYSTEM,
  Roles.SUPER_ADMIN,
  Roles.ADMIN,
  Roles.STAFF,
  Roles.MODERATOR,
  Roles.EDITOR,
  Roles.INDUSTRY,
  Roles.HOST,
  Roles.PRO,
  Roles.CREATOR,

  // Ads hierarchy
  AdsRoles.ADS_ADMIN,
  AdsRoles.ADS_MANAGER,
  AdsRoles.ADS_ANALYST,
]

Object.freeze(ADS_OVERRIDE_ROLES)
const ADS_OVERRIDE_SET = new Set<Role>(ADS_OVERRIDE_ROLES)

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

/**
 * READ RULES
 * - Admin UI: logged-in Ads / Admin roles
 * - Public API: API key + fetch code (READ ONLY)
 */
const canReadAds: Access = ({ req }) => {
  // Admin UI / authenticated users
  if (req?.user) {
    return isAdminRole(req) || hasRole(req, ADS_OVERRIDE_ROLES)
  }

  // Public / frontend API (strict read-only)
  return apiLockedRead({ req } as any)
}

/* ============================================================
   FIELD-LEVEL ACCESS HELPERS (BOOLEAN ONLY)
============================================================ */

/**
 * Internal read for protected fields
 */
const fieldInternalRead: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, ADS_OVERRIDE_ROLES)
}

/**
 * Internal update for protected fields
 */
const fieldInternalUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) || hasRole(req, ADS_OVERRIDE_ROLES)
}

/**
 * Search index toggle — VERY restricted
 */
const fieldSearchToggleUpdate: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false

  return isAdminRole(req) || hasRole(req, [AdsRoles.ADS_ADMIN])
}

/* ============================================================
   ADS COLLECTION
============================================================ */

export const Ads: CollectionConfig = {
  slug: 'ads',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  access: {
    /* ----------------------------------------
       READ
    ---------------------------------------- */
    read: canReadAds,

    /* ----------------------------------------
       CREATE — Ads Manager+
    ---------------------------------------- */
    create: ({ req }) =>
      hasRole(req, [
        AdsRoles.ADS_MANAGER,
        AdsRoles.ADS_ADMIN,
        Roles.ADMIN,
        Roles.SYSTEM,
        Roles.SUPER_ADMIN,
      ]),

    /* ----------------------------------------
       UPDATE — Ads Manager+
    ---------------------------------------- */
    update: ({ req }) =>
      hasRole(req, [
        AdsRoles.ADS_MANAGER,
        AdsRoles.ADS_ADMIN,
        Roles.ADMIN,
        Roles.SYSTEM,
        Roles.SUPER_ADMIN,
      ]),

    /* ----------------------------------------
       DELETE — Ads Admin+
    ---------------------------------------- */
    delete: ({ req }) =>
      hasRole(req, [AdsRoles.ADS_ADMIN, Roles.ADMIN, Roles.SYSTEM, Roles.SUPER_ADMIN]),
  },

  fields: [
    /* ================= CORE ================= */

    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'advertiser',
      type: 'relationship',
      relationTo: 'advertisers',
      required: true,
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'placement',
      type: 'relationship',
      relationTo: 'ad-placements',
      required: true,
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'mediaType',
      type: 'select',
      options: ['image', 'video', 'audio', 'html'].map((v) => ({
        label: v,
        value: v,
      })),
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    {
      name: 'creative',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: fieldInternalRead,
        update: fieldInternalUpdate,
      },
    },

    /* ================= METADATA ================= */

    {
      name: 'ctaUrl',
      type: 'text',
    },

    {
      name: 'metadata',
      type: 'json',
    },

    /* ================= SEARCH GOVERNANCE ================= */

    {
      name: '_searchable',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: () => false,
        update: fieldSearchToggleUpdate,
      },
    },
  ],
}

export default Ads
