import type { GlobalConfig, Access } from 'payload'
import * as AccessControl from '@/access/control'

/* ============================================================
   ACCESS
============================================================ */

const isAdminOnly: Access = ({ req }) => AccessControl.isAdmin({ req })

/* ============================================================
   GLOBAL
============================================================ */

export const MediaFolders: GlobalConfig = {
  slug: 'media-folders',

  admin: {
    group: 'Core',
  },

  access: {
    read: () => true, // public-safe (used by media UI)
    update: isAdminOnly, // 🔒 admin only
  },

  fields: [
    {
      name: 'folders',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: { readOnly: true },
        },
      ],
    },
  ],
}

export default MediaFolders
