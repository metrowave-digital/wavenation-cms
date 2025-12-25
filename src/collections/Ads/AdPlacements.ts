import type { CollectionConfig, FieldAccess, Access } from 'payload'

import {
  apiLockedRead,
  hasRole,
  isAdsAdmin,
  isAdsManager,
  isAdsAnalyst,
  isAdminRole,
} from '@/access/control'

import { Roles, AdsRoles } from '@/access/roles'

/* ============================================================
   FIELD-LEVEL BOOLEAN HELPERS (REQUIRED)
   ⚠️ NEVER RETURN Access / Where / Promise
============================================================ */

/**
 * Admin-only field read
 */
const adsFieldReadBoolean: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req) === true || isAdsAdmin({ req } as any) === true
}

/**
 * Ads Manager+ field update
 */
const adsFieldUpdateBoolean: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdsManager({ req } as any) === true || isAdsAdmin({ req } as any) === true
}

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

/**
 * READ RULES
 * - Admin UI: Ads roles + Admin override
 * - Public API: API key + fetch code (READ ONLY)
 */
const canReadAdPlacements: Access = ({ req }) => {
  // Authenticated users
  if (req?.user) {
    return (
      isAdminRole(req) ||
      hasRole(req, [AdsRoles.ADS_ANALYST, AdsRoles.ADS_MANAGER, AdsRoles.ADS_ADMIN])
    )
  }

  // Public / frontend API
  return apiLockedRead({ req } as any)
}

/* ============================================================
   COLLECTION CONFIG
============================================================ */

export const AdPlacements: CollectionConfig = {
  slug: 'ad-placements',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  access: {
    /* ----------------------------------------
       READ
    ---------------------------------------- */
    read: canReadAdPlacements,

    /* ----------------------------------------
       CREATE — Ads Manager+
    ---------------------------------------- */
    create: ({ req }) => isAdsManager({ req } as any) === true,

    /* ----------------------------------------
       UPDATE — Ads Analyst+
    ---------------------------------------- */
    update: ({ req }) => isAdsAnalyst({ req } as any) === true,

    /* ----------------------------------------
       DELETE — Ads Admin+
    ---------------------------------------- */
    delete: ({ req }) => isAdsAdmin({ req } as any) === true,
  },

  fields: [
    /* ================= CORE ================= */

    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'placementType',
      type: 'select',
      required: true,
      options: [
        { label: 'Radio', value: 'radio' },
        { label: 'TV', value: 'tv' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'App', value: 'app' },
        { label: 'Live Event', value: 'live-event' },
      ],
      access: {
        read: adsFieldReadBoolean,
        update: adsFieldUpdateBoolean,
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'dimensions',
      type: 'text',
    },

    /* ================= SEARCH GOVERNANCE ================= */

    {
      name: '_searchable',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: adsFieldReadBoolean,
        update: adsFieldUpdateBoolean,
      },
    },
  ],
}

export default AdPlacements
