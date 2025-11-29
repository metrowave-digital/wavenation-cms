import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    group: 'Core',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
      return roles.includes('admin') || roles.includes('super-admin')
    },
  },

  upload: {
    // This activates S3/R2 storage ONLY IF the S3 plugin includes this collection
    disableLocalStorage: true,
  },

  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const allowed = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'video/mp4',
          'video/webm',
          'video/quicktime',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/aac',
          'application/pdf',
        ]

        const file = req.file

        if (file && !allowed.includes(file.mimetype)) {
          throw new Error(`Unsupported file type: ${file.mimetype}`)
        }

        return data
      },
    ],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'File Info',
          fields: [
            { name: 'filename', type: 'text', admin: { readOnly: true } },
            { name: 'mimeType', type: 'text', admin: { readOnly: true } },
            { name: 'filesize', type: 'number', admin: { readOnly: true } },

            {
              type: 'row',
              fields: [
                { name: 'width', type: 'number', admin: { readOnly: true } },
                { name: 'height', type: 'number', admin: { readOnly: true } },
              ],
            },

            { name: 'duration', type: 'number', admin: { readOnly: true } },
            { name: 'bitrate', type: 'number', admin: { readOnly: true } },
            { name: 'dominantColor', type: 'text', admin: { readOnly: true } },
          ],
        },
      ],
    },
  ],
}
