import type { CollectionConfig } from 'payload'

export const Newsroom: CollectionConfig = {
  slug: 'newsroom',

  admin: {
    group: 'Editorial',
    useAsTitle: 'title',
  },

  access: {
    read: ({ req }) => !!req.user, // staff only
    create: ({ req }) => req.user?.role === 'editor' || req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'editor' || req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'title', type: 'text', required: true },

    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'status',
      type: 'select',
      options: ['assigned', 'in-progress', 'editing', 'complete'],
      defaultValue: 'assigned',
    },

    { name: 'deadline', type: 'date' },
    { name: 'notes', type: 'textarea' },
  ],
}

export default Newsroom
