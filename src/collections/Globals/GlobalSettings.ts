import type { CollectionConfig, Access } from 'payload'
import { seoFields } from '../../fields/seo'

import { isAdminRole } from '@/access/control'

/* ============================================================
   ACCESS
============================================================ */

/**
 * Global settings:
 * - Public read (frontend-safe)
 * - Admin/System update only
 */
const canUpdateGlobalSettings: Access = ({ req }) => Boolean(req?.user && isAdminRole(req))

/* ============================================================
   COLLECTION
============================================================ */

export const GlobalSettings: CollectionConfig = {
  slug: 'global-settings',

  admin: {
    group: 'System',
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'environment', 'updatedAt'],
  },

  access: {
    read: () => true,
    update: canUpdateGlobalSettings,
  },

  fields: [
    /* --------------------------------------------------------
       CORE
    -------------------------------------------------------- */
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },

    {
      name: 'environment',
      type: 'select',
      defaultValue: 'production',
      options: [
        { label: 'Production', value: 'production' },
        { label: 'Staging', value: 'staging' },
        { label: 'Development', value: 'development' },
      ],
    },

    /* --------------------------------------------------------
       MAINTENANCE MODE
    -------------------------------------------------------- */
    {
      name: 'maintenanceMode',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'textarea',
        },
      ],
    },

    /* --------------------------------------------------------
       SCHEDULED DOWNTIME
    -------------------------------------------------------- */
    {
      name: 'scheduledDowntime',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'startsAt',
          type: 'date',
        },
        {
          name: 'endsAt',
          type: 'date',
        },
        {
          name: 'displayBanner',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'bannerMessage',
          type: 'text',
        },
      ],
    },

    /* --------------------------------------------------------
       ALERTS + POPUPS
    -------------------------------------------------------- */
    {
      name: 'activeAlerts',
      type: 'relationship',
      relationTo: 'alerts',
      hasMany: true,
    },
    {
      name: 'activePopups',
      type: 'relationship',
      relationTo: 'popups',
      hasMany: true,
    },

    /* --------------------------------------------------------
       STREAMING
    -------------------------------------------------------- */
    {
      name: 'streamSettings',
      type: 'group',
      fields: [
        {
          name: 'radioStreamURL',
          type: 'text',
        },
        {
          name: 'tvStreamURL',
          type: 'text',
        },
        {
          name: 'showNowPlayingMetadata',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },

    /* --------------------------------------------------------
       SEO
    -------------------------------------------------------- */
    {
      name: 'seo',
      type: 'group',
      fields: [seoFields],
    },
  ],
}

export default GlobalSettings
