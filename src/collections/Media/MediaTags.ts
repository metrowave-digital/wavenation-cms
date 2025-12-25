import type { CollectionConfig } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   COLLECTION
============================================================ */

export const MediaTags: CollectionConfig = {
  slug: 'media-tags',

  labels: {
    singular: 'Media Tag',
    plural: 'Media Tags',
  },

  admin: {
    group: 'Core',
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'createdAt'],
  },

  /* -----------------------------------------------------------
     ACCESS CONTROL
     - Public read (search-safe, API-locked handled upstream)
     - Staff+ manage tags
     - Admin can delete
  ----------------------------------------------------------- */
  access: {
    read: () => true,
    create: AccessControl.isStaff,
    update: AccessControl.isStaff,
    delete: AccessControl.isAdmin,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Human-readable tag name (e.g. "Concert Photography")',
      },
    },

    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'System value (auto-generated, URL-safe)',
      },
    },

    /* ---------------- AUDIT ---------------- */
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },

    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data

        // Generate or preserve normalized value
        if (typeof data.label === 'string') {
          data.value = data.label
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        } else if (originalDoc?.value) {
          // Prevent accidental value wipe
          data.value = originalDoc.value
        }

        return data
      },
    ],

    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user || !data) return data

        const userId = String(req.user.id)

        if (operation === 'create') {
          data.createdBy = userId
        }

        data.updatedBy = userId

        return data
      },
    ],
  },
}

export default MediaTags
