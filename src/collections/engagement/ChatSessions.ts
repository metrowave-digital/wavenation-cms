import type { CollectionConfig } from 'payload'

export const ChatSessions: CollectionConfig = {
  slug: 'chat-sessions',

  labels: {
    plural: 'Chat Sessions',
    singular: 'Chat Session',
  },

  admin: {
    group: 'Social',
    defaultColumns: ['participants', 'lastMessage', 'updatedAt'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: true,
    },

    {
      name: 'isGroup',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'groupName',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData.isGroup === true },
    },

    {
      name: 'lastMessage',
      type: 'relationship',
      relationTo: 'chat-messages',
    },

    {
      name: 'unreadCounts',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
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
