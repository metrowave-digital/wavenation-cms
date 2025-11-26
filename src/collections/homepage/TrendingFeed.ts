import type { CollectionConfig } from 'payload'

export const TrendingFeed: CollectionConfig = {
  slug: 'trending-feed',

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
      type: 'relationship',
      relationTo: ['articles', 'vod', 'tracks'],
      hasMany: true,
    },
  ],
}

export default TrendingFeed
