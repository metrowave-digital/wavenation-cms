import type { GlobalConfig } from 'payload'

export const MediaFolders: GlobalConfig = {
  slug: 'media-folders',

  admin: {
    group: 'Core',
  },

  fields: [
    {
      name: 'folders',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
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
