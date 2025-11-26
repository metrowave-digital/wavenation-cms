import type { CollectionConfig } from 'payload'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',

  labels: {
    singular: 'Chat Message',
    plural: 'Chat Messages',
  },

  admin: {
    group: 'Social',
    defaultColumns: ['session', 'sender', 'content', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'session',
      type: 'relationship',
      relationTo: 'chat-sessions',
      required: true,
    },

    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'content',
      type: 'textarea',
    },

    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
