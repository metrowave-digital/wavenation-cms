import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',

  labels: {
    singular: 'Message',
    plural: 'Messages',
  },

  admin: {
    group: 'Communication',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'sender', 'recipient', 'createdAt'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'cc',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'bcc',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'subject',
      type: 'text',
      required: true,
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
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

    {
      name: 'labels',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Inbox', value: 'inbox' },
        { label: 'Important', value: 'important' },
        { label: 'Starred', value: 'starred' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: ['inbox'],
    },
  ],
}
