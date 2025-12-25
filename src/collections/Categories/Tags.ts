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
     ACCESS CONTROL (ADMIN + PUBLIC SAFE)
  ----------------------------------------------------------- */
  access: {
    /**
     * READ
     * - Admin UI (logged-in users)
     * - Public API (API key + fetch code)
     */
    read: AccessControl.isPublic,

    /**
     * Editorial taxonomy control
     * (editor, moderator, staff, admin)
     */
    create: AccessControl.isEditorOrAbove,
    update: AccessControl.isEditorOrAbove,

    /**
     * Destructive action restricted
     */
    delete: AccessControl.isAdmin,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
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
      admin: {
        description: 'Auto-generated if left empty.',
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        return data
      },
    ],
  },
}

export default Tags
