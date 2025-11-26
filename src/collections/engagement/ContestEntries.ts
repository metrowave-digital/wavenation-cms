import type { CollectionConfig } from 'payload'
import { allowIfSelfOrAdmin } from '@/access/control'

export const ContestEntries: CollectionConfig = {
  slug: 'contest-entries',

  labels: {
    singular: 'Contest Entry',
    plural: 'Contest Entries',
  },

  admin: {
    group: 'Engagement',
    defaultColumns: ['contest', 'user', 'votes'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: allowIfSelfOrAdmin,
    delete: allowIfSelfOrAdmin,
  },

  fields: [
    {
      name: 'contest',
      type: 'relationship',
      relationTo: 'contests',
      required: true,
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },

    /* ENTRY CONTENT */
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    /* VOTING */
    { name: 'votes', type: 'number', defaultValue: 0 },

    /* JUDGING (Optional) */
    {
      name: 'judgingScore',
      type: 'number',
    },
  ],
}
