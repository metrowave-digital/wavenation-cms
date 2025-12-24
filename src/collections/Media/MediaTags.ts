import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

export const MediaTags: CollectionConfig = {
  slug: 'media-tags',

  admin: {
    group: 'Core',
    useAsTitle: 'label',
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (search-safe)
     - Staff manage tags
     - Admin can delete
  ----------------------------------------------------------- */
  access: {
    read: () => true,
    create: AccessControl.isStaff,
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.label) {
          data.value = data.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
        return data
      },
    ],
  },
}

export default MediaTags
