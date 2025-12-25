import type { CollectionConfig, Access, AccessArgs } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

/**
 * Read access:
 * - Logged-in users → full access
 * - Public → API key + fetch code
 */
const canReadVideoGalleries: Access = ({ req }) => {
  if (req?.user) return true
  return AccessControl.apiLockedRead({ req } as any)
}

/**
 * Staff+ can create/update
 */
const canManageVideoGalleries: Access = ({ req }) => AccessControl.isStaff({ req })

/**
 * Admin-only hard delete
 */
const canDeleteVideoGalleries: Access = ({ req }) => AccessControl.isAdmin({ req })

/**
 * Owner OR staff/admin update
 */
const canUpdateVideoGallery: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const gallery = await req.payload.findByID({
    collection: 'video-galleries',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (gallery as any).createdBy === 'string'
      ? (gallery as any).createdBy
      : (gallery as any).createdBy?.id

  return ownerId === String(req.user.id)
}

/* ============================================================
   COLLECTION
============================================================ */

export const VideoGallery: CollectionConfig = {
  slug: 'video-galleries',

  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'visibility', 'status', 'updatedAt'],
  },

  access: {
    read: canReadVideoGalleries,
    create: canManageVideoGalleries,
    update: canUpdateVideoGallery,
    delete: canDeleteVideoGalleries,
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
      name: 'description',
      type: 'textarea',
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
          admin: {
            description: 'Controls frontend visibility. Private galleries require authentication.',
          },
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
          admin: {
            description: 'Archive instead of deleting to preserve references.',
          },
        },
      ],
    },

    /* ---------------- VIDEOS ---------------- */
    {
      type: 'array',
      name: 'videos',
      label: 'Videos',
      minRows: 1,
      fields: [
        {
          name: 'video',
          type: 'relationship',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Video media asset. Must respect visibility rules of the gallery.',
          },
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Optional caption override for this gallery.',
          },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: {
            description: 'Optional attribution override.',
          },
        },
      ],
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

export default VideoGallery
