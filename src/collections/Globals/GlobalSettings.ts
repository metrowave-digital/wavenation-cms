import type { CollectionConfig } from 'payload'
import { seoFields } from '../../fields/seo'

export const GlobalSettings: CollectionConfig = {
  slug: 'global-settings',

  admin: {
    group: 'System',
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'environment', 'updatedAt'],
  },

  access: {
    read: () => true,
    update: ({ req }) => !!req.user?.roles?.includes('admin'),
  },

  fields: [
    { name: 'siteName', type: 'text', required: true },

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

    /* -------------------------
       MAINTENANCE MODE
    -------------------------- */
    {
      name: 'maintenanceMode',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'message', type: 'textarea' },
      ],
    },

    /* -------------------------
       SCHEDULED DOWNTIME
    -------------------------- */
    {
      name: 'scheduledDowntime',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'startsAt', type: 'date' },
        { name: 'endsAt', type: 'date' },
        { name: 'displayBanner', type: 'checkbox', defaultValue: true },
        { name: 'bannerMessage', type: 'text' },
      ],
    },

    /* -------------------------
       Alerts + Popups
    -------------------------- */
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

    /* -------------------------
       Streaming
    -------------------------- */
    {
      name: 'streamSettings',
      type: 'group',
      fields: [
        { name: 'radioStreamURL', type: 'text' },
        { name: 'tvStreamURL', type: 'text' },
        { name: 'showNowPlayingMetadata', type: 'checkbox', defaultValue: true },
      ],
    },

    /* -------------------------
       SEO
    -------------------------- */
    {
      name: 'seo',
      type: 'group',
      fields: [seoFields],
    },
  ],
}

export default GlobalSettings
