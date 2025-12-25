import type { CollectionConfig, Access, AccessArgs } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS HELPERS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req?.user)

const canUpdateAlbum: Access = async ({ req, id }: AccessArgs) => {
  if (!req?.user) return false

  if (AccessControl.isAdmin({ req })) return true
  if (AccessControl.isStaff({ req })) return true

  if (!id) return false

  const album = await req.payload.findByID({
    collection: 'media-albums',
    id: String(id),
    depth: 0,
  })

  const ownerId =
    typeof (album as any).createdBy === 'string'
      ? (album as any).createdBy
      : (album as any).createdBy?.id

  return ownerId === String(req.user.id)
}

const canDeleteAlbum: Access = ({ req }) => AccessControl.isAdmin({ req })

const canReadAlbums: Access = ({ req }) => {
  if (req?.user) return true
  return AccessControl.apiLockedRead({ req } as any)
}

/* ============================================================
   COLLECTION
============================================================ */

export const MediaAlbums: CollectionConfig = {
  slug: 'media-albums',

  labels: {
    singular: 'Media Album',
    plural: 'Media Albums',
  },

  admin: {
    group: 'Media',
    useAsTitle: 'title',
    defaultColumns: ['title', 'items', 'createdBy', 'updatedAt'],
  },

  access: {
    read: canReadAlbums,
    create: isLoggedIn,
    update: canUpdateAlbum,
    delete: canDeleteAlbum,
  },

  timestamps: true,

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      type: 'array',
      name: 'items',
      label: 'Album Items',
      minRows: 1,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
        },
        {
          name: 'attribution',
          type: 'text',
        },
      ],
    },

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
        description: 'Controls public API visibility. Private albums require authentication.',
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

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req?.user) return data

        const userId = String(req.user.id)

        if (operation === 'create') {
          ;(data as any).createdBy = userId
        }

        ;(data as any).updatedBy = userId

        return data
      },
    ],
  },
}

export default MediaAlbums
