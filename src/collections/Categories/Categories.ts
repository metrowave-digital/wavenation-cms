import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type'],
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
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Episode', value: 'episode' },
        { label: 'Article', value: 'article' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Film', value: 'film' },
        { label: 'Music', value: 'music' },
        { label: 'Event', value: 'event' },
      ],
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
