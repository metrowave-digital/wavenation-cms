// collections/Follows.ts
import type { CollectionConfig } from 'payload'

export const Follows: CollectionConfig = {
  slug: 'follows',

  labels: {
    singular: 'Follow',
    plural: 'Follows',
  },

  admin: {
    group: 'Social',
    defaultColumns: ['follower', 'target', 'kind'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    {
      name: 'follower',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'target',
      type: 'relationship',
      relationTo: ['users', 'creator-channels', 'shows', 'podcasts'], // 🔥 Supports ALL content follow types
      required: true,
    },

    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'User', value: 'user' },
        { label: 'Channel', value: 'channel' },
        { label: 'Show', value: 'show' },
        { label: 'Podcast', value: 'podcast' },
      ],
    },
  ],
}
