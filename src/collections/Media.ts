import type { CollectionConfig } from 'payload'
import { allowAdminsAnd } from '../access/control'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'updatedAt'],
  },

  access: {
    read: () => true,
    create: allowAdminsAnd(['editor', 'creator', 'contributor', 'host-dj']),
    update: allowAdminsAnd(['editor']),
    delete: allowAdminsAnd(['admin']),
  },

  upload: {
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300 },
      { name: 'medium', width: 800 },
      { name: 'large', width: 1600 },
    ],
  },

  fields: [],
}
