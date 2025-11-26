import type { CollectionConfig } from 'payload'

export const Drafts: CollectionConfig = {
  slug: 'drafts',

  admin: {
    group: 'Editorial',
    useAsTitle: 'title',
  },

  access: {
    read: ({ req }) => !!req.user?.role,
    create: ({ req }) => !!req.user?.role,
    update: ({ req }) => !!req.user?.role,
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'submitted', 'approved', 'published'],
      defaultValue: 'draft',
    },
  ],
}

export default Drafts
