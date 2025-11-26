import type { CollectionConfig } from 'payload'

export const MessageThreads: CollectionConfig = {
  slug: 'message-threads',

  labels: {
    plural: 'Message Threads',
    singular: 'Message Thread',
  },

  admin: {
    group: 'Social',
    defaultColumns: ['participants', 'lastMessage', 'updatedAt'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },

  fields: [
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
    },

    {
      name: 'lastMessage',
      type: 'relationship',
      relationTo: 'messages',
      required: false,
    },

    {
      name: 'unreadCounts',
      type: 'array',
      admin: { description: 'Track unread messages per participant' },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'count',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
}
