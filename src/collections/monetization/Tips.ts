import type { CollectionConfig } from 'payload'

export const Tips: CollectionConfig = {
  slug: 'tips',

  labels: {
    singular: 'Tip',
    plural: 'Tips',
  },

  admin: {
    group: 'Monetization',
    defaultColumns: ['fromUser', 'toCreator', 'amount', 'date'],
  },

  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    delete: ({ req }) => false,
  },

  fields: [
    {
      name: 'fromUser',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'toCreator',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
    },

    { name: 'amount', type: 'number', required: true },

    { name: 'message', type: 'textarea' },

    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'date',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },

    /* Auto-create earning logs later */
  ],
}
