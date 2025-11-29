import type { CollectionConfig } from 'payload'

export const ContentSubscriptions: CollectionConfig = {
  slug: 'content-subscriptions',

  admin: {
    useAsTitle: 'id',
    group: 'Content Monetization',
    defaultColumns: ['subscriber', 'contentType', 'contentItem', 'status'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => true,
  },

  fields: [
    { name: 'subscriber', type: 'relationship', relationTo: 'profiles', required: true },

    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        'shows',
        'episodes',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'articles',
        'tracks',
        'albums',
      ].map((v) => ({ label: v, value: v })),
    },

    {
      name: 'contentItem',
      type: 'relationship',
      relationTo: [
        'shows',
        'episodes',
        'films',
        'vod',
        'podcasts',
        'podcast-episodes',
        'articles',
        'tracks',
        'albums',
      ],
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'expired', 'canceled'].map((v) => ({ label: v, value: v })),
    },

    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },

    { name: 'pricePaid', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'USD' },

    { name: 'transactionId', type: 'text' },
    { name: 'metadata', type: 'json' },
  ],
}
