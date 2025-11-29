import type { CollectionConfig } from 'payload'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',

  admin: {
    group: 'Ads',
    useAsTitle: 'name',
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'ads',
      type: 'relationship',
      relationTo: 'ads',
      hasMany: true,
    },
    {
      name: 'advertiser',
      type: 'relationship',
      relationTo: 'advertisers',
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', admin: { width: '50%' } },
        { name: 'endDate', type: 'date', admin: { width: '50%' } },
      ],
    },
    {
      name: 'budget',
      type: 'number',
    },
    {
      name: 'channels',
      type: 'select',
      hasMany: true,
      options: ['radio', 'tv', 'web', 'mobile', 'podcast', 'app', 'live-event'].map((v) => ({
        label: v,
        value: v,
      })),
    },
    { name: 'metadata', type: 'json' },
  ],
}
