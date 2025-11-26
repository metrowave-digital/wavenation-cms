import type { CollectionConfig } from 'payload'

export const LatestFeed: CollectionConfig = {
  slug: 'latest-feed',

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

export default LatestFeed
