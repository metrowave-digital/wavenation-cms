import type { CollectionConfig } from 'payload'

export const EngagementEvents: CollectionConfig = {
  slug: 'engagement-events',

  labels: {
    singular: 'Engagement Event',
    plural: 'Engagement Events',
  },

  admin: {
    group: 'Analytics',
    defaultColumns: ['user', 'kind', 'target', 'createdAt'],
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: () => false,
    delete: () => false,
  },

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'View', value: 'view' },
        { label: 'Like', value: 'like' },
        { label: 'Comment', value: 'comment' },
        { label: 'Follow', value: 'follow' },
        { label: 'Play', value: 'play' },
        { label: 'Skip', value: 'skip' },
        { label: 'Share', value: 'share' },
      ],
    },

    {
      name: 'target',
      type: 'relationship',
      required: true,
      relationTo: [
        'posts',
        'videos',
        'tracks',
        'podcast-episodes',
        'shows',
        'podcasts',
        'creator-channels',
      ],
    },

    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Optional event details (duration, device, referrer, etc.)',
      },
    },
  ],
}

export default EngagementEvents
