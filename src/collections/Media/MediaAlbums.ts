import type { CollectionConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS
============================================================ */

const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/**
 * Admin OR creator (safe — no collection lookup)
 */
const canUpdateAlbum: Access = ({ req }) => {
  if (!req.user) return false

  // 🔑 ADMIN ALWAYS WINS
  if (AccessControl.isAdmin({ req })) return true

  // creators & staff can update their own albums
  const roles = Array.isArray(req.user.roles) ? req.user.roles : []
  return roles.includes('creator') || roles.includes('staff')
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
    defaultColumns: ['title', 'items'],
  },

  access: {
    read: () => true,
    create: isLoggedIn,
    update: canUpdateAlbum,
    delete: AccessControl.isAdmin,
  },

  timestamps: true,

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

    /* ---------------- ALBUM ITEMS ---------------- */
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

  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (!req.user) return data

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

export default MediaAlbums
