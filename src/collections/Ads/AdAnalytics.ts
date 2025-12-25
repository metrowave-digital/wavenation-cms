import type { CollectionConfig, FieldAccess, Access } from 'payload'

import {
  apiLockedRead,
  isAdsAnalyst,
  isAdsManager,
  isAdsAdmin,
  isAdminRole,
} from '@/access/control'

/* ============================================================
   COLLECTION READ ACCESS
============================================================ */

/**
 * READ RULES
 * - Admin UI: Ads Admin / Admin override roles
 * - Public API: API key + fetch code (read-only)
 */
const canReadAdAnalytics: Access = ({ req }) => {
  // Admin / authenticated users
  if (req?.user) {
    return isAdminRole(req) || isAdsAnalyst({ req } as any)
  }

  // Public / ingestion API (STRICT READ ONLY)
  return apiLockedRead({ req } as any)
}

/* ============================================================
   FIELD-LEVEL ACCESS (BOOLEAN ONLY)
============================================================ */

/**
 * Sensitive analytics fields:
 * - Admin override roles only
 * - NEVER exposed to public API
 */
const adsAnalyticsFieldRead: FieldAccess = ({ req }: any): boolean => {
  if (!req?.user) return false
  return isAdminRole(req)
}

/* ============================================================
   COLLECTION
============================================================ */

export const AdAnalytics: CollectionConfig = {
  slug: 'ad-analytics',

  admin: {
    group: 'Ads',
    useAsTitle: 'id',
  },

  access: {
    /* ----------------------------------------
       READ
    ---------------------------------------- */
    read: canReadAdAnalytics,

    /* ----------------------------------------
       CREATE — Ads Analyst+
    ---------------------------------------- */
    create: ({ req }) => isAdsAnalyst({ req } as any),

    /* ----------------------------------------
       UPDATE — Ads Manager+
    ---------------------------------------- */
    update: ({ req }) => isAdsManager({ req } as any),

    /* ----------------------------------------
       DELETE — Ads Admin+
    ---------------------------------------- */
    delete: ({ req }) => isAdsAdmin({ req } as any),
  },

  fields: [
    /* ================= RELATIONS ================= */

    {
      name: 'ad',
      type: 'relationship',
      relationTo: 'ads',
      required: true,
    },

    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'campaigns',
    },

    {
      name: 'placement',
      type: 'relationship',
      relationTo: 'ad-placements',
    },

    /* ================= DATE ================= */

    {
      name: 'date',
      type: 'date',
      required: true,
    },

    /* ================= METRICS ================= */

    {
      name: 'metrics',
      type: 'group',
      access: {
        read: adsAnalyticsFieldRead,
        update: isAdsManager as FieldAccess,
      },
      fields: [
        { name: 'impressions', type: 'number', defaultValue: 0 },
        { name: 'clicks', type: 'number', defaultValue: 0 },
        { name: 'conversions', type: 'number', defaultValue: 0 },
        { name: 'frequency', type: 'number', defaultValue: 0 },
        { name: 'cost', type: 'number', defaultValue: 0 },
      ],
    },

    /* ================= RAW INGEST ================= */

    {
      name: 'raw',
      type: 'json',
    },

    /* ================= SEARCH GOVERNANCE ================= */

    {
      name: '_searchable',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: adsAnalyticsFieldRead,
        update: adsAnalyticsFieldRead,
      },
    },
  ],
}

export default AdAnalytics
