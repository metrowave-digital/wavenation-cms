import type { CollectionConfig } from 'payload'

export const ContentAccess: CollectionConfig = {
  slug: 'content-access',

  admin: {
    useAsTitle: 'id',
    group: 'Content Monetization',
    defaultColumns: ['user', 'contentType', 'contentItem', 'accessedAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => true,
  },

  fields: [
    { name: 'user', type: 'relationship', relationTo: 'profiles', required: true },

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

    { name: 'accessedAt', type: 'date', required: true },
    { name: 'source', type: 'text', admin: { description: 'App, Web, TV, etc.' } },
    { name: 'sessionId', type: 'text' },

    { name: 'metadata', type: 'json' },
  ],
}
