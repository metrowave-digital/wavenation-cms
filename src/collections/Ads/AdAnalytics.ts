import type { CollectionConfig } from 'payload'

export const AdAnalytics: CollectionConfig = {
  slug: 'ad-analytics',

  admin: {
    group: 'Ads',
    useAsTitle: 'id',
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },

  fields: [
    { name: 'ad', type: 'relationship', relationTo: 'ads', required: true },
    { name: 'campaign', type: 'relationship', relationTo: 'campaigns' },
    { name: 'placement', type: 'relationship', relationTo: 'ad-placements' },

    {
      name: 'date',
      type: 'date',
      required: true,
    },

    {
      name: 'metrics',
      type: 'group',
      fields: [
        { name: 'impressions', type: 'number', defaultValue: 0 },
        { name: 'clicks', type: 'number', defaultValue: 0 },
        { name: 'conversions', type: 'number', defaultValue: 0 },
        { name: 'frequency', type: 'number', defaultValue: 0 },
        { name: 'cost', type: 'number', defaultValue: 0 },
      ],
    },

    { name: 'raw', type: 'json' },
  ],
}
