import type { CollectionConfig } from 'payload'

export const HomepageUnifiedFeed: CollectionConfig = {
  slug: 'homepage-unified-feed',

  admin: {
    group: 'Homepage',
    useAsTitle: 'title',
  },

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'VOD', value: 'vod' },
            { label: 'Track', value: 'track' },
            { label: 'Podcast Episode', value: 'podcast' },
            { label: 'Live Channel', value: 'live' },
          ],
          required: true,
        },
        {
          name: 'ref',
          type: 'relationship',
          relationTo: ['articles', 'vod', 'tracks', 'podcasts', 'live-channels'] as const,
          required: true,
        },
      ],
    },
  ],
}

export default HomepageUnifiedFeed
