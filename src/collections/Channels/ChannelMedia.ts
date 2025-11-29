import type { CollectionConfig } from 'payload'

export const ChannelMedia: CollectionConfig = {
  slug: 'channel-media',

  admin: {
    useAsTitle: 'filename',
    group: 'Creator Channels',
  },

  upload: {
    // S3/R2 storage is defined globally in payload.config.ts
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
    disableLocalStorage: true,

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'center',
      },
    ],

    // ❌ Do NOT include staticURL/staticDir in Payload v3
    // The S3 adapter handles public URLs automatically.
  },

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'creator-channels',
      required: true,
    },
    {
      name: 'uploader',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },

    { name: 'description', type: 'textarea' },

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'subscribers',
      options: ['public', 'subscribers', 'tiers'].map((v) => ({
        label: v,
        value: v,
      })),
    },

    {
      name: 'allowedTiers',
      type: 'relationship',
      relationTo: 'creator-tiers',
      hasMany: true,
      admin: { condition: (data) => data?.visibility === 'tiers' },
    },

    { name: 'metadata', type: 'json' },
  ],
}
