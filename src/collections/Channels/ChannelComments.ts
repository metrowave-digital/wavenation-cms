import type { CollectionConfig } from 'payload'

export const ChannelComments: CollectionConfig = {
  slug: 'channel-comments',

  admin: {
    group: 'Creator Channels',
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => false,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  timestamps: true,

  fields: [
    { name: 'post', type: 'relationship', relationTo: 'channel-posts', required: true },
    { name: 'user', type: 'relationship', relationTo: 'profiles', required: true },
    { name: 'body', type: 'text', required: true },

    { name: 'parent', type: 'relationship', relationTo: 'channel-comments' }, // threaded
    {
      name: 'replies',
      type: 'relationship',
      relationTo: 'channel-comments',
      hasMany: true,
    },

    {
      name: 'reactions',
      type: 'relationship',
      relationTo: 'channel-reactions',
      hasMany: true,
    },

    { name: 'isToxic', type: 'checkbox', defaultValue: false },
    { name: 'toxicityScore', type: 'number' },
  ],
}
