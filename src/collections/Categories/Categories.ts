import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type'],
    group: 'Taxonomy',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
    create: AccessControl.isStaff, // taxonomy control
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
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
        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
      },
    ],
  },
}

export default Categories
