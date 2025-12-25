import type { GlobalConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS
============================================================ */

const isAdminOnly: Access = ({ req }) => AccessControl.isAdmin({ req })

/* ============================================================
   HELPERS
============================================================ */

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/* ============================================================
   GLOBAL
============================================================ */

export const MediaFolders: GlobalConfig = {
  slug: 'media-folders',

  admin: {
    group: 'Core',
    description: 'Organizational folders for Media assets. Used by Media UI and content editors.',
  },

  /* -----------------------------------------------------------
     ACCESS
     - Public read (UI + search safe)
     - Admin-only updates
  ----------------------------------------------------------- */
  access: {
    read: () => true,
    update: isAdminOnly,
  },

  /* -----------------------------------------------------------
     FIELDS
  ----------------------------------------------------------- */
  fields: [
    {
      name: 'folders',
      type: 'array',
      labels: {
        singular: 'Folder',
        plural: 'Folders',
      },
      admin: {
        description: 'Media folder structure. Folder slugs are auto-generated and immutable.',
      },
      fields: [
        /* ---------- STABLE ID ---------- */
        {
          name: 'id',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
            description: 'Stable internal ID (do not change)',
          },
        },

        /* ---------- DISPLAY NAME ---------- */
        {
          name: 'name',
          type: 'text',
          required: true,
        },

        /* ---------- SYSTEM SLUG ---------- */
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
            description: 'Auto-generated, URL-safe identifier',
          },
        },

        /* ---------- OPTIONAL DESCRIPTION ---------- */
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    /* ---------------------------------------------------------
       AUDIT (GLOBAL-LEVEL)
    --------------------------------------------------------- */
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],

  /* -----------------------------------------------------------
     HOOKS
  ----------------------------------------------------------- */
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (!data) return data

        // Stamp updater
        if (req?.user) {
          ;(data as any).updatedBy = String(req.user.id)
        }

        // Normalize folders
        if (Array.isArray((data as any).folders)) {
          ;(data as any).folders = (data as any).folders.map((folder: any) => {
            // Stable ID (only generate once)
            if (!folder.id) {
              folder.id = crypto.randomUUID()
            }

            // Slug derived from name (immutable after creation)
            if (!folder.slug && typeof folder.name === 'string') {
              folder.slug = slugify(folder.name)
            }

            return folder
          })
        }

        return data
      },
    ],
  },
}

export default MediaFolders
