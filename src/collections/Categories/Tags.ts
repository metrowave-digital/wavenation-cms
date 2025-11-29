import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Taxonomy',
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user?.roles : []
      return roles.includes('admin') || roles.includes('super-admin')
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Auto-generated if left empty.' },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
      },
    ],
  },
}
