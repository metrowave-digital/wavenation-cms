import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const Tags: CollectionConfig = {
  slug: 'tags',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Taxonomy',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
  ----------------------------------------------------------- */
  access: {
    read: AccessControl.isPublic, // 🔓 search-safe
    create: AccessControl.isStaff, // controlled taxonomy
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
      admin: { description: 'Auto-generated if left empty.' },
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

export default Tags
