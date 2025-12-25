import type { CollectionConfig, Access, AccessArgs } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Public read:
 * - Logged-in users → full access
 * - Anonymous → API key + fetch code
 */
const canReadPhotos: Access = ({ req }) => {
  if (req?.user) return true
  return AccessControl.apiLockedRead({ req } as any)
}

/**
 * Staff+ can create
 */
const canCreatePhotos: Access = ({ req }) => AccessControl.isStaff({ req })

/**
 * Owner OR staff/admin update
 */
const canUpdatePhoto: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const photo = await req.payload.findByID({
    collection: 'photos',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (photo as any).createdBy === 'string'
      ? (photo as any).createdBy
      : (photo as any).createdBy?.id

  return ownerId === String(req.user.id)
}

/**
 * Admin-only hard delete
 */
const canDeletePhotos: Access = ({ req }) => AccessControl.isAdmin({ req })

/* ============================================================
   COLLECTION
============================================================ */

export const Photos: CollectionConfig = {
  slug: 'photos',

  labels: {
    singular: 'Photo',
    plural: 'Photos',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'image', 'visibility', 'status', 'updatedAt'],
  },

  access: {
    read: canReadPhotos,
    create: canCreatePhotos,
    update: canUpdatePhoto,
    delete: canDeletePhotos,
  },

  timestamps: true,

  /* ============================================================
     FIELDS
  ============================================================ */
  fields: [
    /* ---------------- BASIC ---------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    /* ---------------- DISPLAY ---------------- */
    {
      name: 'caption',
      type: 'textarea',
    },

    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Accessibility alt text (recommended).',
      },
    },

    {
      name: 'attribution',
      type: 'text',
    },

    /* ---------------- GOVERNANCE ---------------- */
    {
      type: 'row',
      fields: [
        {
          name: 'visibility',
          type: 'select',
          defaultValue: 'public',
          required: true,
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Unlisted', value: 'unlisted' },
            { label: 'Private', value: 'private' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          required: true,
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
          ],
        },
      ],
    },

    /* ---------------- ORGANIZATION ---------------- */
    {
      name: 'folderSlug',
      type: 'text',
      admin: {
        description: 'Media folder slug (UI-only, non-relational)',
      },
    },

    {
      name: 'tagSlugs',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Media tag slugs (UI-only, non-relational)',
      },
    },

    {
      name: 'albumSlug',
      type: 'text',
      admin: {
        description: 'Media album slug (UI-only, non-relational)',
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

  /* ============================================================
     HOOKS
  ============================================================ */
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data

        data.visibility ??= originalDoc?.visibility ?? 'public'
        data.status ??= originalDoc?.status ?? 'active'

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

export default Photos
